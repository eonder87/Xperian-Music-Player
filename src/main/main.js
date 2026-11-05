const { app, BrowserWindow, ipcMain, dialog, protocol, net } = require('electron');
const path = require('path');
const fs = require('fs');
const ini = require('ini');
const mm = require('music-metadata');
const { spawn } = require('child_process');

// Register media:// protocol privileges before app ready
protocol.registerSchemesAsPrivileged([
    {
        scheme: 'media',
        privileges: {
            secure: true,
            standard: true,
            supportFetchAPI: true,
            bypassCSP: true,
            stream: true
        }
    }
]);

// ─── Portable Configuration ───────────────────────────────────────────────────
const isPackaged = app.isPackaged;
const appRootDir = process.env.PORTABLE_EXECUTABLE_DIR || (isPackaged ? path.dirname(app.getPath('exe')) : app.getAppPath());
const tempDir = path.join(appRootDir, 'temp');
const libraryIniPath = path.join(appRootDir, 'library.ini');
const libraryJsonPath = path.join(appRootDir, 'library.json');

// Clean up stale temp directory from previous runs BEFORE setting userData (so no locks are held yet)
try {
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
} catch (e) {
    console.error('[Startup Cleanup] Failed:', e.message);
}

// Set Electron's userData to a local temp folder to bypass AppData entirely
app.setPath('userData', tempDir);

function loadConfig() {
    if (!fs.existsSync(libraryIniPath)) return '';
    try {
        const parsed = ini.parse(fs.readFileSync(libraryIniPath, 'utf-8'));
        return (parsed.Settings && parsed.Settings.MusicFolder) ? parsed.Settings.MusicFolder : '';
    } catch (_) { return ''; }
}

function saveConfig(folderPath) {
    try {
        fs.writeFileSync(libraryIniPath, ini.stringify({ Settings: { MusicFolder: folderPath } }));
    } catch (e) { console.error('[Config] Save failed:', e.message); }
}

// ─── Window ───────────────────────────────────────────────────────────────────
let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        fullscreen: true,
        frame: false,
        kiosk: true,
        show: true,
        backgroundColor: '#050505',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: true            // Enable webSecurity for production security
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
        console.log(`[Renderer] [Level ${level}] ${message} (at ${sourceId}:${line})`);
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    mainWindow.on('closed', () => { mainWindow = null; });
}

// Hata loglaması (Global Error Logging to Local Temp)
process.on('uncaughtException', (err) => {
    try {
        fs.appendFileSync(path.join(tempDir, 'error.log'), `[${new Date().toISOString()}] ${err.stack}\n`);
    } catch (_) {}
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    dialog.showErrorBox('Uygulama Zaten Açık', 'Xperian Vinyl Music şu anda arka planda veya başka bir pencerede çalışıyor.\nAynı anda ikinci bir uygulama açılamaz.');
    app.quit();
} else {

    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    app.commandLine.appendSwitch('disable-gpu-shader-disk-cache'); // Önbellek hatalarını engelle
    
    app.whenReady().then(() => {
        // Register custom protocol handler to securely stream local audio files
        const { pathToFileURL } = require('url');
        protocol.handle('media', (request) => {
            // Strip the custom scheme prefix and get the raw Windows path
            const rawPath = request.url.replace(/^media:\/\/\/?/, '');
            // Decode the URL encoded characters (like spaces and special characters) before converting to file URL
            const decodedPath = decodeURIComponent(rawPath);
            // Reconstruct Windows drive letter colon if it was stripped by Chromium URL parser
            const normalizedPath = decodedPath.replace(/^([a-zA-Z])\//, (m, drive) => drive + ':/');
            // Convert the absolute path to a proper file:// URL
            const fileUrl = pathToFileURL(normalizedPath).toString();
            return net.fetch(fileUrl, { bypassCustomProtocolHandlers: true });
        });
        createWindow();
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });

    app.on('activate', () => {
        if (mainWindow === null) createWindow();
    });

    // Detached process cleanup of the temp directory upon app quit using direct hidden CMD retry loop (execution policy proof)
    app.on('quit', () => {
        if (fs.existsSync(tempDir)) {
            const cmd = `for /L %i in (1,1,5) do ( ping 127.0.0.1 -n 2 > nul & rmdir /s /q "${tempDir}" & if not exist "${tempDir}" exit )`;
            spawn(cmd, {
                shell: true,
                detached: true,
                stdio: 'ignore',
                windowsHide: true
            }).unref();
        }
    });
}

// ─── IPC Handlers ─────────────────────────────────────────────────────────────

ipcMain.handle('get-saved-folder', () => loadConfig());

ipcMain.handle('get-cached-library', () => {
    if (!fs.existsSync(libraryJsonPath)) return [];
    try {
        const content = fs.readFileSync(libraryJsonPath, 'utf-8');
        return JSON.parse(content);
    } catch (e) {
        console.error('[Cache] Load failed:', e.message);
        return [];
    }
});

ipcMain.handle('save-library-cache', (event, tracks) => {
    try {
        fs.writeFileSync(libraryJsonPath, JSON.stringify(tracks, null, 2), 'utf-8');
        return true;
    } catch (e) {
        console.error('[Cache] Save failed:', e.message);
        return false;
    }
});

ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Müzik Klasörünü Seçin',
        properties: ['openDirectory']
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    const folderPath = result.filePaths[0];
    saveConfig(folderPath);
    return folderPath;
});

ipcMain.handle('select-file', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Müzik Dosyası Seçin',
        properties: ['openFile'],
        filters: [{ name: 'Audio Files', extensions: ['mp3', 'flac', 'wav', 'ogg', 'm4a'] }]
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    return getMetadata(result.filePaths[0]);
});

ipcMain.handle('scan-folder', async (event, folderPath) => {
    if (!folderPath || !fs.existsSync(folderPath)) return [];

    const SUPPORTED = new Set(['.mp3', '.flac', '.wav', '.ogg', '.m4a']);
    const allFiles = [];

    function walk(dir) {
        let entries;
        try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
        catch (_) { return; }
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(full);
            } else if (SUPPORTED.has(path.extname(entry.name).toLowerCase())) {
                allFiles.push(full);
            }
        }
    }

    walk(folderPath);

    // Process in batches of 8 for performance
    const results = [];
    for (let i = 0; i < allFiles.length; i += 8) {
        const batch = allFiles.slice(i, i + 8);
        const batchResult = await Promise.all(batch.map(f => getMetadata(f)));
        results.push(...batchResult);
    }

    // Cache the scanned tracks to library.json
    try {
        fs.writeFileSync(libraryJsonPath, JSON.stringify(results, null, 2), 'utf-8');
    } catch (e) {
        console.error('[Cache] Save scanned tracks failed:', e.message);
    }

    return results;
});

ipcMain.handle('exit-app', () => app.quit());

// ─── Metadata ─────────────────────────────────────────────────────────────────

async function getMetadata(filePath) {
    const base = {
        title: path.basename(filePath, path.extname(filePath)),
        artist: 'Unknown Artist',
        album: 'Unknown Album',
        duration: 0,
        artwork: null,
        path: filePath     // full absolute path; renderer converts to file:// URL
    };
    try {
        const meta = await mm.parseFile(filePath, { skipCovers: false });
        let artwork = null;
        if (meta.common.picture && meta.common.picture.length > 0) {
            const pic = meta.common.picture[0];
            artwork = `data:${pic.format};base64,${pic.data.toString('base64')}`;
        }
        return {
            title:    meta.common.title  || base.title,
            artist:   meta.common.artist || base.artist,
            album:    meta.common.album  || base.album,
            duration: meta.format.duration || 0,
            artwork,
            path:     filePath
        };
    } catch (e) {
        console.error('[Metadata]', path.basename(filePath), e.message);
        return base;
    }
}

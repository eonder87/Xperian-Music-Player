'use strict';
console.log("script.js loaded successfully!");

let library = [], queue = [], queueIndex = -1, currentView = 'songs', hasTrack = false;
let isShuffle = false, isRepeat = false;

const audio        = document.getElementById('audio');
const bgBlur       = document.getElementById('bg-blur');
const vinyl        = document.getElementById('vinyl');
const albumArt     = document.getElementById('album-art');
const boxArt       = document.getElementById('box-art');
const trackTitle   = document.getElementById('track-title');
const trackArtist  = document.getElementById('track-artist');
const trackAlbum   = document.getElementById('track-album');
const progressBar  = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');
const timeCur      = document.getElementById('time-cur');
const timeTotal    = document.getElementById('time-total');
const btnPlay      = document.getElementById('btn-play');
const iconPlay     = document.getElementById('icon-play');
const iconPause    = document.getElementById('icon-pause');
const libraryList  = document.getElementById('library-list');
const playerPanel  = document.getElementById('player-panel');
const trackInfo    = document.getElementById('track-info');

// Shuffle / Repeat / Volume Elements
const btnShuffle   = document.getElementById('btn-shuffle');
const btnRepeat    = document.getElementById('btn-repeat');
const btnVolume    = document.getElementById('btn-volume');
const iconVolUp    = document.getElementById('icon-vol-up');
const iconVolMute  = document.getElementById('icon-vol-mute');
const volumeBar    = document.getElementById('volume-bar');
const volumeFill   = document.getElementById('volume-fill');

// Settings Elements
const btnSettings     = document.getElementById('btn-settings');
const settingsModal   = document.getElementById('settings-modal');
const btnCloseSettings= document.getElementById('btn-close-settings');
const resBtns         = document.querySelectorAll('.res-btn');

// ── Boot ──────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
    console.log("DOMContentLoaded fired!");
    // Auto-detect or Load Resolution Preference
    let savedRes = localStorage.getItem('ui_resolution');
    const explicit = localStorage.getItem('ui_resolution_explicit');
    if (!savedRes || !explicit) {
        const w = window.screen.width;
        if (w >= 3840) savedRes = '4k';
        else if (w >= 2560) savedRes = '1440p';
        else if (w >= 1920) savedRes = '1080p';
        else savedRes = '720p';
        localStorage.setItem('ui_resolution', savedRes);
        localStorage.setItem('ui_resolution_explicit', 'true');
        console.log(`Auto-detected screen width: ${w}px. Setting default UI scale to: ${savedRes}`);
    }
    console.log("Applying resolution:", savedRes);
    applyResolution(savedRes);

    try {
        // Load library from local JSON cache instantly (sub-50ms startup!)
        const cached = await window.api.getCachedLibrary();
        console.log("Cached library retrieved on boot:", cached ? cached.length : 0);
        if (cached && cached.length) {
            library = cached;
            renderLibrary();
        }

        const saved = await window.api.getSavedFolder();
        console.log("Saved folder retrieved:", saved);
        if (saved && saved.trim()) {
            // Perform a delayed, non-blocking background sync so startup isn't lagged
            setTimeout(async () => {
                try {
                    console.log("[Boot] Starting background library sync...");
                    const tracks = await window.api.scanFolder(saved);
                    console.log("[Boot] Background scan completed. Found tracks:", tracks ? tracks.length : 0);
                    if (tracks) {
                        // Compare loaded library with background scanned tracks
                        const currentPaths = new Set(library.map(t => t.path));
                        const scannedPaths = new Set(tracks.map(t => t.path));
                        let changed = currentPaths.size !== scannedPaths.size;
                        if (!changed) {
                            for (const t of tracks) {
                                if (!currentPaths.has(t.path)) {
                                    changed = true;
                                    break;
                                }
                            }
                        }
                        if (changed) {
                            console.log("[Boot] Library changes detected. Updating UI.");
                            library = tracks;
                            renderLibrary();
                        } else {
                            console.log("[Boot] No library changes detected. Sync done.");
                        }
                    }
                } catch (err) {
                    console.error('[Boot Background Sync]', err);
                }
            }, 1500);
        }
    } catch(e) { console.error('[Boot]', e); }
});

// ── Buttons ───────────────────────────────────────────────────────────────────
document.getElementById('btn-folder').addEventListener('click', async () => {
    try {
        const folder = await window.api.selectFolder();
        if (!folder) return;
        const tracks = await window.api.scanFolder(folder);
        if (tracks) { library = tracks; renderLibrary(); }
    } catch(e) { console.error(e); }
});

document.getElementById('btn-file').addEventListener('click', async () => {
    try {
        const track = await window.api.selectFile();
        if (!track) return;
        if (!library.find(t => t.path === track.path)) {
            library.push(track);
            await window.api.saveLibraryCache(library);
        }
        renderLibrary();
        queue = [track]; queueIndex = 0; playTrack(track);
    } catch(e) { console.error(e); }
});

document.getElementById('btn-exit').addEventListener('click', () => window.api.exitApp());

// ── Library tabs ──────────────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentView = tab.dataset.view;
        renderLibrary();
    });
});

// ── Render ────────────────────────────────────────────────────────────────────
function renderLibrary() {
    libraryList.innerHTML = '';
    if (!library.length) { libraryList.innerHTML = '<div class="empty-msg">Müzik bulunamadı.</div>'; return; }
    if (currentView === 'songs') {
        library.forEach((t, i) => addItem(t.artwork, t.title, t.artist, () => { queue=[...library]; queueIndex=i; playTrack(queue[i]); }));
    } else if (currentView === 'albums') {
        groupBy(library,'album').forEach((tracks,name) => addItem(tracks[0].artwork, name, tracks[0].artist, () => { queue=tracks; queueIndex=0; playTrack(queue[0]); }));
    } else {
        groupBy(library,'artist').forEach((tracks,name) => addItem(tracks[0].artwork, name, `${tracks.length} şarkı`, () => { queue=tracks; queueIndex=0; playTrack(queue[0]); }));
    }
}

function groupBy(arr, key) {
    const m = new Map();
    arr.forEach(i => { const k=i[key]||'?'; if(!m.has(k)) m.set(k,[]); m.get(k).push(i); });
    return m;
}

function addItem(artwork, title, sub, onClick) {
    const el=document.createElement('div'); el.className='lib-item';
    const img=document.createElement('img'); img.className='lib-art';
    img.src=artwork||'assets/default-art.png'; img.onerror=()=>{img.src='assets/default-art.png';};
    const info=document.createElement('div'); info.className='lib-info';
    const t=document.createElement('div'); t.className='lib-title'; t.textContent=title;
    const s=document.createElement('div'); s.className='lib-sub'; s.textContent=sub;
    info.append(t,s); el.append(img,info);
    el.addEventListener('click', onClick);
    libraryList.appendChild(el);
}

// ── Playback ──────────────────────────────────────────────────────────────────
function playTrack(track) {
    if (!track) return;
    hasTrack = true;
    audio.src = 'media:///' + track.path.replace(/\\/g, '/');

    const art = track.artwork || 'assets/default-art.png';
    boxArt.src   = art;
    albumArt.src = art;
    bgBlur.style.backgroundImage = `url("${art}")`;

    trackTitle.textContent  = track.title  || 'Bilinmeyen Şarkı';
    trackArtist.textContent = track.artist || '—';
    trackAlbum.textContent  = track.album  || '—';

    vinyl.classList.add('slide-out');
    playerPanel.classList.add('revealed');
    trackInfo.classList.add('revealed');
    vinyl.classList.add('playing');

    audio.play()
        .then(()  => setPlayState(true))
        .catch(e  => { console.error('[Play]',e); setPlayState(false); });
}

function setPlayState(playing) {
    if (playing) {
        iconPlay.classList.add('hidden');
        iconPause.classList.remove('hidden');
        vinyl.classList.add('playing');      // spin yeniden başlat
    } else {
        iconPlay.classList.remove('hidden');
        iconPause.classList.add('hidden');
        vinyl.classList.remove('playing');   // spin durdur
    }
}

function togglePlay() {
    if (!hasTrack) return;
    if (audio.paused) {
        audio.play().then(()=>setPlayState(true)).catch(console.error);
    } else {
        audio.pause(); setPlayState(false);
    }
}

btnPlay.addEventListener('click', togglePlay);

// Önceki Şarkıya Geçiş
document.getElementById('btn-prev').addEventListener('click', () => {
    if (!queue.length) return;
    if (isShuffle) {
        playRandomTrack();
    } else {
        queueIndex = (queueIndex - 1 + queue.length) % queue.length;
        playTrack(queue[queueIndex]);
    }
});

// Sonraki Şarkıya Geçiş
document.getElementById('btn-next').addEventListener('click', () => {
    if (!queue.length) return;
    if (isShuffle) {
        playRandomTrack();
    } else {
        queueIndex = (queueIndex + 1) % queue.length;
        playTrack(queue[queueIndex]);
    }
});

// Karışık Oynatma Togglesı
btnShuffle.addEventListener('click', () => {
    isShuffle = !isShuffle;
    btnShuffle.classList.toggle('active', isShuffle);
});

// Tekrar Oynatma Togglesı
btnRepeat.addEventListener('click', () => {
    isRepeat = !isRepeat;
    btnRepeat.classList.toggle('active', isRepeat);
});

// Ses / Mute Togglesı
btnVolume.addEventListener('click', () => {
    audio.muted = !audio.muted;
    if (audio.muted) {
        updateVolumeUI(0);
    } else {
        updateVolumeUI(audio.volume);
    }
});

// Ses Seviyesi Değiştirme
volumeBar.addEventListener('click', e => {
    const r = volumeBar.getBoundingClientRect();
    let vol = (e.clientX - r.left) / r.width;
    vol = Math.max(0, Math.min(1, vol));
    audio.volume = vol;
    audio.muted = false;
    updateVolumeUI(vol);
});

function updateVolumeUI(vol) {
    volumeFill.style.width = (vol * 100) + '%';
    if (vol === 0 || audio.muted) {
        iconVolUp.classList.add('hidden');
        iconVolMute.classList.remove('hidden');
    } else {
        iconVolUp.classList.remove('hidden');
        iconVolMute.classList.add('hidden');
    }
}

// Rastgele Şarkı Seçimi (Shuffle)
function playRandomTrack() {
    if (queue.length <= 1) {
        playTrack(queue[0]);
        return;
    }
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * queue.length);
    } while (newIndex === queueIndex);
    queueIndex = newIndex;
    playTrack(queue[queueIndex]);
}

// Şarkı Bittiğinde Çalışacak Mantık
audio.addEventListener('ended', () => {
    if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
    } else if (isShuffle) {
        playRandomTrack();
    } else {
        const n = queueIndex + 1;
        if (n < queue.length) {
            queueIndex = n;
            playTrack(queue[n]);
        } else {
            setPlayState(false);
        }
    }
});

// ── Progress ──────────────────────────────────────────────────────────────────
audio.addEventListener('timeupdate', () => {
    if (!audio.duration || isNaN(audio.duration)) return;
    progressFill.style.width = (audio.currentTime/audio.duration*100)+'%';
    timeCur.textContent   = fmt(audio.currentTime);
    timeTotal.textContent = fmt(audio.duration);
});

progressBar.addEventListener('click', e => {
    if (!audio.duration || isNaN(audio.duration)) return;
    const r = progressBar.getBoundingClientRect();
    audio.currentTime = ((e.clientX-r.left)/r.width)*audio.duration;
});

function fmt(s) {
    if(isNaN(s)) return '0:00';
    return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
}

// ── Settings & Resolution ──────────────────────────────────────────────────────
btnSettings.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
});
btnCloseSettings.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
});
settingsModal.addEventListener('click', e => {
    if (e.target === settingsModal) settingsModal.classList.add('hidden');
});

resBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const res = btn.dataset.res;
        applyResolution(res);
        localStorage.setItem('ui_resolution', res);
        localStorage.setItem('ui_resolution_explicit', 'true');
    });
});

function applyResolution(res) {
    let factor = 1.0;
    if (res === '720p') factor = 0.75;
    if (res === '1080p') factor = 1.0;
    if (res === '1440p') factor = 1.3333;
    if (res === '4k') factor = 2.0;

    if (window.api && window.api.setZoom) {
        window.api.setZoom(factor);
    }
    
    resBtns.forEach(b => {
        if (b.dataset.res === res) b.classList.add('active');
        else b.classList.remove('active');
    });
}

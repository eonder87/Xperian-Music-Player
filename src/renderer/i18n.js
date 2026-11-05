'use strict';
const translations = {
    tr: {
        settings: 'Ayarlar', scale: 'Çözünürlük Ölçeği', language: 'Dil',
        scaleHint: '1440p veya 4K ekranlarda arayüzün küçük kalmaması için ölçeği artırabilirsiniz.',
        brand: 'Müzik Çalar', folder: 'Klasör Seç', file: 'Dosya Aç', exit: 'Çıkış',
        songs: 'Şarkılar', albums: 'Albümler', artists: 'Sanatçılar',
        empty: 'Klasör seçin veya dosya ekleyin.', noTrack: 'Şarkı Seçilmedi',
        unknownTrack: 'Bilinmeyen Şarkı', unknownArtist: 'Bilinmeyen Sanatçı', unknownAlbum: 'Bilinmeyen Albüm',
        shuffle: 'Karışık Çal', repeat: 'Tekrar Çal', volume: 'Sessiz / Sesli', volumeLevel: 'Ses Seviyesi',
        previous: 'Önceki Şarkı', next: 'Sonraki Şarkı', play: 'Oynat', pause: 'Duraklat', close: 'Kapat',
        songCount: '{count} şarkı', saveError: 'Ayarlar kaydedilemedi. Lütfen tekrar deneyin.'
    },
    en: {
        settings: 'Settings', scale: 'UI Scale', language: 'Language',
        scaleHint: 'Increase the scale to make the interface larger on 1440p or 4K displays.',
        brand: 'Music Player', folder: 'Select Folder', file: 'Open File', exit: 'Exit',
        songs: 'Songs', albums: 'Albums', artists: 'Artists',
        empty: 'Select a folder or add a file.', noTrack: 'No Track Selected',
        unknownTrack: 'Unknown Track', unknownArtist: 'Unknown Artist', unknownAlbum: 'Unknown Album',
        shuffle: 'Shuffle', repeat: 'Repeat', volume: 'Mute / Unmute', volumeLevel: 'Volume',
        previous: 'Previous Track', next: 'Next Track', play: 'Play', pause: 'Pause', close: 'Close',
        songCount: '{count} songs', saveError: 'Could not save settings. Please try again.'
    }
};
let language = 'tr';
function t(key) { return translations[language][key] || key; }
function displayMetadata(value, kind) {
    if (!value || value === 'Unknown Artist' || value === 'Unknown Album') return t(kind);
    return value;
}
function applyLanguage(value) {
    language = value === 'en' ? 'en' : 'tr';
    document.documentElement.lang = language;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelector('.brand-subtitle').textContent = t('brand');
    document.querySelectorAll('.tab').forEach(el => { el.textContent = t(el.dataset.view); });
    const titles = { 'btn-settings': 'settings', 'btn-folder': 'folder', 'btn-file': 'file', 'btn-exit': 'exit',
        'btn-shuffle': 'shuffle', 'btn-repeat': 'repeat', 'btn-volume': 'volume', 'volume-bar': 'volumeLevel',
        'btn-prev': 'previous', 'btn-next': 'next', 'btn-close-settings': 'close' };
    for (const [id, key] of Object.entries(titles)) {
        const el = document.getElementById(id);
        el.title = t(key);
        el.setAttribute('aria-label', t(key));
    }
    document.querySelectorAll('[data-language]').forEach(el => {
        const selected = el.dataset.language === language;
        el.classList.toggle('active', selected);
        el.setAttribute('aria-pressed', String(selected));
    });
    if (hasTrack) updateTrackText(queue[queueIndex]);
    else trackTitle.textContent = t('noTrack');
    btnPlay.title = t(audio.paused ? 'play' : 'pause');
    btnPlay.setAttribute('aria-label', btnPlay.title);
    renderLibrary();
}

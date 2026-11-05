<div align="center">

# 💿 Xperian Music Player

### A classic vinyl experience in the digital world of music.

**A fullscreen Windows music player with vinyl animations for your local music library.**

![Platform](https://img.shields.io/badge/Platform-Windows-0078D4?style=flat-square&logo=windows)
![Electron](https://img.shields.io/badge/Electron-42-47848F?style=flat-square&logo=electron&logoColor=white)
![Version](https://img.shields.io/badge/Version-1.0.1-555555?style=flat-square)
![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=flat-square)

**[English](#english) · [Türkçe](#türkçe)**

</div>

---

<a id="english"></a>

## 🎧 About the Project

**Xperian Music Player** is an **Electron-based** desktop application designed to play music stored on your computer with a visual vinyl record experience.

A spinning record that slides out from behind the album artwork, a blurred background inspired by the cover, and minimal playback controls turn listening to music into a visual experience.

The application works with **local music files**; no online music service is required.

## ✨ Features

### 💿 Vinyl-Style Player

- Animated vinyl record emerging from behind the album cover
- Record rotation that starts and stops with playback
- Blurred background based on the current track's cover art
- Display of track title, artist, and album information
- Default artwork for tracks without embedded cover art

### 📚 Music Library

- Recursive scanning of a selected folder and its subfolders
- Browse music by **Songs**, **Albums**, and **Artists**
- Open an individual audio file directly
- Read titles, artists, albums, durations, and cover art from audio metadata
- Cache the music library in `library.json`
- Load the cached library at startup and rescan the music folder in the background

### 🎛️ Playback Controls

- Play / pause
- Previous / next track
- Shuffle
- Repeat current track
- Seek within a track using the progress bar
- Volume adjustment and mute

### 🖥️ Fullscreen Experience

- Fullscreen, frameless player interface
- Automatic initial scaling based on screen width
- Manual interface scaling presets: **720p / 1080p / 1440p / 4K**
- Persistent scaling preferences

## 🎼 Supported Audio Files

| Format | Extension |
| --- | --- |
| MP3 | `.mp3` |
| FLAC | `.flac` |
| WAV | `.wav` |
| Ogg | `.ogg` |
| M4A | `.m4a` |

> **Note:** These extensions are supported by the application's file scanning and selection filters. Actual playback also depends on whether Electron/Chromium supports the codec inside the file.

## 🚀 Installation and Running

### Requirements

- Windows
- Node.js and npm (to run from source)

### Run from Source

```bash
git clone https://github.com/eonder87/Xperian-Music-Player.git
cd Xperian-Music-Player
npm install
npm start
```

Alternatively, after installing the dependencies, you can use `run.bat` on Windows.

### 📦 Build a Portable Version

```bash
npm run build
```

The project's `electron-builder` configuration targets **portable** Windows builds. Build artifacts are created in `dist/`.

> **Note:** A prebuilt download may not be available in the repository. If so, you can run the app from source or build it yourself.

## 🎵 How to Use

1. Start the application.
2. Use the **Folder** icon to select your music library directory, or use **Open File** to add a single track.
3. Switch between **Songs**, **Albums**, and **Artists** in the left panel.
4. Select the track, album, or artist you want to listen to.
5. Use the bottom panel to manage playback, volume, and playback modes.
6. If needed, change the interface scale in **Settings**.

## 🗂️ Project Structure

```text
Xperian-Music-Player/
├── src/
│   ├── main/
│   │   ├── main.js           # Electron main process and file operations
│   │   └── preload.js        # Bridge between main process and UI
│   └── renderer/
│       ├── index.html        # Player interface
│       ├── style.css         # Interface styling and animations
│       ├── script.js         # Library and playback logic
│       └── assets/           # UI images
├── icon.ico                  # Application icon
├── library.ini               # Selected music folder
├── library.json              # Cached music library
├── package.json              # Dependencies and build settings
└── run.bat                   # Windows launch script
```

## 🛠️ Technologies Used

| Technology | Purpose |
| --- | --- |
| **Electron** | Windows desktop application |
| **HTML / CSS / JavaScript** | Player UI and interactions |
| **music-metadata** | Read audio tags and embedded artwork |
| **ini** | Store the selected music folder setting |
| **electron-builder** | Build a portable Windows application |

## 💾 Data and Portability

The application stores the selected music folder in `library.ini` and scanned track metadata in `library.json`. These files are used in the application's working directory.

The music files themselves are not copied into the library; the player uses their existing file paths. If you move your music folder, you may need to select it again.

## 🚧 Project Status

The project is under active development. This README documents the current application structure and implemented features in the repository. The documentation will be updated as features are added.

## 🐞 Bug Reports and Suggestions

For bug reports and feature suggestions, please use [GitHub Issues](https://github.com/eonder87/Xperian-Music-Player/issues).

---

<a id="türkçe"></a>

<div align="center">

# 💿 Xperian Music Player

### Müziğin dijital dünyasında klasik plak deneyimi.

**Yerel müzik arşiviniz için plak animasyonlu, tam ekran bir Windows müzik çalar.**

![Platform](https://img.shields.io/badge/Platform-Windows-0078D4?style=flat-square&logo=windows)
![Electron](https://img.shields.io/badge/Electron-42-47848F?style=flat-square&logo=electron&logoColor=white)
![Version](https://img.shields.io/badge/Version-1.0.1-555555?style=flat-square)
![Status](https://img.shields.io/badge/Status-Geliştirme%20Aşamasında-orange?style=flat-square)

**[English](#english) · [Türkçe](#türkçe)**

</div>

---

## 🎧 Proje Hakkında

**Xperian Music Player**, bilgisayarınızdaki müzik dosyalarını görsel bir plak çalar deneyimiyle dinlemek için geliştirilen, **Electron tabanlı** bir masaüstü uygulamasıdır.

Albüm kapağının arkasından çıkan dönen plak, kapağa uyum sağlayan bulanık arka plan ve sade oynatma kontrolleriyle müzik dinlemeyi görsel bir deneyime dönüştürür.

Uygulama **yerel müzik dosyalarıyla** çalışır; bir çevrim içi müzik servisine bağlanmanız gerekmez.

## ✨ Özellikler

### 💿 Plak Tasarımlı Oynatıcı

- Albüm kapağının arkasından çıkan animasyonlu vinil plak
- Çalma ve duraklatma durumuna göre dönen veya duran plak
- Parçanın kapak görseline uyum sağlayan bulanık arka plan
- Şarkı adı, sanatçı ve albüm bilgilerinin gösterimi
- Kapak görseli olmayan parçalar için varsayılan görsel

### 📚 Müzik Kütüphanesi

- Seçilen klasörün alt klasörleriyle birlikte taranması
- Müziği **Şarkılar**, **Albümler** ve **Sanatçılar** üzerinden görüntüleme
- Tek bir ses dosyasını doğrudan açma
- Dosya etiketlerinden başlık, sanatçı, albüm, süre ve kapak bilgilerini okuma
- Müzik listesini `library.json` dosyasında önbelleğe alma
- Açılışta kayıtlı kütüphaneyi yükleme ve klasörü arka planda yeniden tarama

### 🎛️ Oynatma Kontrolleri

- Oynat / duraklat
- Önceki / sonraki parça
- Karışık çalma (shuffle)
- Geçerli parçayı tekrarlama (repeat)
- İlerleme çubuğundan parça içinde gezinme
- Ses seviyesi ayarı ve sessize alma

### 🖥️ Tam Ekran Deneyimi

- Tam ekran, çerçevesiz oynatıcı arayüzü
- Ekran genişliğine göre otomatik başlangıç ölçeklendirmesi
- Manuel arayüz ölçekleri: **720p / 1080p / 1440p / 4K**
- Seçilen ölçek ayarının saklanması

## 🎼 Desteklenen Ses Dosyaları

| Format | Uzantı |
| --- | --- |
| MP3 | `.mp3` |
| FLAC | `.flac` |
| WAV | `.wav` |
| Ogg | `.ogg` |
| M4A | `.m4a` |

> **Not:** Bu uzantılar uygulamanın dosya tarama ve seçme filtrelerinde desteklenir. Sesin oynatılabilmesi, dosyanın içindeki codec'in Electron/Chromium tarafından desteklenmesine de bağlıdır.

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- Windows
- Node.js ve npm (kaynak koddan çalıştırmak için)

### Kaynak Koddan Çalıştırma

```bash
git clone https://github.com/eonder87/Xperian-Music-Player.git
cd Xperian-Music-Player
npm install
npm start
```

Alternatif olarak, bağımlılıklar kurulduktan sonra Windows'ta `run.bat` dosyası kullanılabilir.

### 📦 Taşınabilir Sürüm Oluşturma

```bash
npm run build
```

Projenin `electron-builder` yapılandırması Windows için **portable** hedefini kullanır. Derleme çıktıları `dist/` klasöründe oluşturulur.

> **Not:** Depoda hazır bir indirme sürümü bulunmayabilir. Bu durumda uygulamayı kaynak koddan çalıştırabilir veya kendiniz derleyebilirsiniz.

## 🎵 Nasıl Kullanılır?

1. Uygulamayı başlatın.
2. **Klasör** simgesiyle müzik arşivinizin bulunduğu klasörü seçin veya **Dosya Aç** düğmesiyle tek bir parça ekleyin.
3. Sol panelden **Şarkılar**, **Albümler** veya **Sanatçılar** sekmesine geçin.
4. Dinlemek istediğiniz parçayı, albümü ya da sanatçıyı seçin.
5. Alt panelden oynatmayı, ses seviyesini ve çalma seçeneklerini yönetin.
6. Gerekirse **Ayarlar** üzerinden arayüz ölçeğini değiştirin.

## 🗂️ Proje Yapısı

```text
Xperian-Music-Player/
├── src/
│   ├── main/
│   │   ├── main.js           # Electron ana süreç ve dosya işlemleri
│   │   └── preload.js        # Ana süreç ile arayüz arasındaki köprü
│   └── renderer/
│       ├── index.html        # Oynatıcı arayüzü
│       ├── style.css         # Arayüz tasarımı ve animasyonlar
│       ├── script.js         # Kütüphane ve oynatma mantığı
│       └── assets/           # Arayüz görselleri
├── icon.ico                  # Uygulama simgesi
├── library.ini               # Seçili müzik klasörü
├── library.json              # Müzik kütüphanesi önbelleği
├── package.json              # Bağımlılıklar ve derleme ayarları
└── run.bat                   # Windows başlatma betiği
```

## 🛠️ Kullanılan Teknolojiler

| Teknoloji | Kullanım amacı |
| --- | --- |
| **Electron** | Windows masaüstü uygulaması |
| **HTML / CSS / JavaScript** | Oynatıcı arayüzü ve etkileşimler |
| **music-metadata** | Ses dosyalarından etiket ve kapak bilgilerini okuma |
| **ini** | Müzik klasörü ayarını saklama |
| **electron-builder** | Taşınabilir Windows uygulaması oluşturma |

## 💾 Veriler ve Taşınabilirlik

Uygulama seçilen müzik klasörünü `library.ini`, taranan parça bilgilerini ise `library.json` dosyasında tutar. Bu dosyalar uygulamanın çalışma dizininde kullanılır.

Müzik dosyalarının kendileri kütüphaneye kopyalanmaz; oynatıcı mevcut dosya yollarını kullanır. Bu nedenle müzik klasörünün taşınması durumunda yeniden klasör seçmek gerekebilir.

## 🚧 Proje Durumu

Proje geliştirilmeye devam etmektedir. Bu README, depodaki mevcut uygulama yapısını ve uygulanmış özellikleri açıklamaktadır. Yeni özellikler eklendikçe belge de güncellenecektir.

## 🐞 Hata Bildirimi ve Öneriler

Hata raporları ve geliştirme önerileri için [GitHub Issues](https://github.com/eonder87/Xperian-Music-Player/issues) bölümünü kullanabilirsiniz.

---

<div align="center">

**💿 Xperian Music Player**

Geliştirici: [Xperian](https://github.com/eonder87)

</div>

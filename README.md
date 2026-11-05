<div align="center">

# 💿 Xperian Music Player

### Müziğin dijital dünyasında klasik plak deneyimi.

**Yerel müzik arşiviniz için plak animasyonlu, tam ekran bir Windows müzik çalar.**

![Platform](https://img.shields.io/badge/Platform-Windows-0078D4?style=flat-square&logo=windows)
![Electron](https://img.shields.io/badge/Electron-42-47848F?style=flat-square&logo=electron&logoColor=white)
![Version](https://img.shields.io/badge/Version-1.0.1-555555?style=flat-square)
![Status](https://img.shields.io/badge/Status-Geliştirme%20Aşamasında-orange?style=flat-square)

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

## 🌍 Dil Desteği

Bu belgenin mevcut sürümü **Türkçedir**. İngilizce README ilerleyen aşamalarda eklenecektir.

---

<div align="center">

**💿 Xperian Music Player**

Geliştirici: [Xperian](https://github.com/eonder87)

</div>

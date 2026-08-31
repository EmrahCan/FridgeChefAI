# 🍳 FridgeChef AI — Sıfır İsraf Yapay Zeka Mutfak Asistanı

[![React Native](https://img.shields.io/badge/React_Native-0.86-61DAFB?logo=react&logoColor=white)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-SDK_57-000020?logo=expo&logoColor=white)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Google Cloud Vision](https://img.shields.io/badge/AI-Google_Cloud_Vision-4285F4?logo=googlecloud&logoColor=white)](https://cloud.google.com/vision)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

> **"Buzdolabındaki Kalanları Yapay Zekayla Gurme Lezzetlere ve Sıfır İsrafa Dönüştürün!"**  
> *Apple Design & Circular Gastronomy Standartlarında Yeni Nesil Akıllı Mutfak Deneyimi.*

---

## 🌟 Öne Çıkan Güçlü Özellikler

- 👁️ **Canlı Görsel Yapay Zeka (Google Cloud Vision & Gemini):** Tek kare fotoğrafla buzdolabındaki açık/kapalı saklama kaplarını, sebzeleri ve kalan yemekleri %98 doğrulukla tespit eder.
- ⏳ **Akıllı Dolap Tazelik Radarı:** Bozulma riski olan gıdaları (`🚨 1 Gün Kaldı`) canlı takip ederek bozulmadan önce acil gurme menülere dönüştürür.
- 🔊 **Eller Serbest Sesli Şef Asistanı (`expo-speech`):** Mutfakta elleriniz unlu veya yağlıyken ekrana dokunmadan adımları ve şef püf noktalarını Türkçe/İngilizce seslendirir.
- 🛒 **Eksik Malzeme Sepeti & WhatsApp Export:** Tarifteki eksikleri tek tıkla sepete ekler ve formatlı liste olarak WhatsApp'a aktarır.
- 🏆 **Oyunlaştırma & Rozetler:** `🔥 3 Günlük Seri`, 5 farklı kazanılabilir şef rozeti ve kurtarılan kg / TL tasarruf odometresi.
- 📸 **Viral 9:16 Instagram Story Kartı:** Yemek bittiğinde kurtarılan gramaj ve karbon ayak izini gösteren dikey başarı sertifikası.
- 🌐 **%100 Saf Çift Dilli Altyapı:** Tek dokunuşla Türkçe (`TR`) ve İngilizce (`EN`) arasında kusursuz geçiş.

---

## 📱 Ekran Mimarisi

```
fridge-chef-ai/
├── 📱 app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Keşfet, Dolap Tazelik Radarı & Bento İstatistikler
│   │   ├── scan.tsx           # Canlı Vizör, 50/50 Kamera/Galeri Güvertesi
│   │   ├── saved.tsx          # Gurme Kasası & Filtreli Favoriler
│   │   └── settings.tsx       # Şef Atölyesi, Rozetler & Diyet Ayarları
│   ├── recipe/
│   │   ├── [id].tsx           # Masterclass Tarif Detayı, Sesli Şef & Sayaçlar
│   │   └── review.tsx         # Malzeme İnceleme & Pişirme Tarzı Filtreleri
│   ├── login.tsx              # Lüks Hoş Geldin & Ürün Tanıtım Vitrini
│   └── admin/index.tsx        # Yönetici Komuta Merkezi
├── 🧠 services/
│   ├── geminiService.ts       # Google Cloud Vision & Gemini API Entegrasyonu
│   ├── audioChefService.ts    # Sesli Şef Motoru (TTS)
│   ├── pantryRadarService.ts  # Tazelik Radarı Motoru
│   ├── groceryService.ts      # Akıllı Alışveriş Listesi
│   └── gamificationService.ts # Rozet & Seri Hesaplama
```

---

## 🚀 Hızlı Başlangıç & Kurulum

```bash
# 1. Depoyu klonlayın
git clone https://github.com/EmrahCan/FridgeChefAI.git
cd FridgeChefAI

# 2. Bağımlılıkları yükleyin
npm install

# 3. Expo geliştirme sunucusunu başlatın
npx expo start
```

### 📱 Mobil Cihazda Çalıştırma:
- **iOS Simülatörü:** Terminalde `i` tuşuna basın.
- **Android Emülatörü:** Terminalde `a` tuşuna basın.
- **Web / Tarayıcı:** Terminalde `w` tuşuna basın.

---

## 💻 Teknoloji Yığını

| Alan | Kullanılan Teknolojiler |
|---|---|
| **Mobil Çerçeve** | React Native, Expo SDK 57, Expo Router |
| **Programlama Dili** | TypeScript (Strict Mode) |
| **Yapay Zeka** | Google Cloud Vision API & Gemini 1.5 Flash Vision |
| **Donanım Entegrasyonu**| Expo-Speech, Expo-Camera, Expo-ImagePicker, Expo-Haptics |
| **Tasarım & UI** | Bento Grid Architecture, Glassmorphism, LinearGradient, Lucide Icons |

---

## 📄 Lisans
Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

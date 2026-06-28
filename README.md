<div align="center">

[![](https://img.shields.io/badge/Language-English-blue?style=for-the-badge&logo=google-translate)](#english-version)
&nbsp;&nbsp;&nbsp;&nbsp;
[![](https://img.shields.io/badge/Dil-T%C3%BCrk%C3%A7e-red?style=for-the-badge&logo=google-translate)](#turkish-version)

</div>

---

<a id="english-version"></a>
# English Version

## 💻 Project Overview
**Lale Perde** is a high-end corporate website and management system tailored for a premium curtain store. It features a fully-functional customer-facing landing page, dynamic product catalogs with smart categorization (curtain types, fabric types, and mounting options), an interactive measurement wizard, and a secure admin panel for complete content, settings, and analytics management.

---

## 🚀 Key Features
- **Dynamic Content & Catalog Management:** Fully database-driven dynamic system to manage categories, products, curtain/fabric/mounting options, campaigns, comments, and guides.
- **Smart Measurement Wizard:** An interactive client-side tool allowing users to select categories, products, and enter dimensions to calculate fabric requirements.
- **Robust Security & Admin Panel:** Protects admin operations using custom JWT sessions with 2FA OTP capability (via Resend Email), rate limiting, and Server Actions.
- **Real-Time Analytics & Logs:** Features a tracking dashboard syncing with Google Analytics 4 (GA4), as well as logging visitor entries, search terms, and form conversion interactions.
- **Performance Optimizations:** Server-side search debouncing, O(1) IP rate-limit garbage collection throttling, and static-site generation (ISR) configured at 60s for lightning-fast page loading.

---

## 🛠️ Tech Stack

<div align="left">

- **Framework:** ![Next.js](https://img.shields.io/badge/Next.js-000?style=flat&logo=nextdotjs&logoColor=fff) (v16.2.9 with Turbopack)
- **Library:** ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) (v19)
- **Database / Backend:** ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=fff) (PostgreSQL client)
- **Styling:** ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) / ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
- **Email Service:** ![Resend](https://img.shields.io/badge/Resend-000000?style=flat&logo=maildotru&logoColor=white) (OTP & Notification deliveries)
- **Analytics:** ![Google Analytics](https://img.shields.io/badge/Google_Analytics-E37400?style=flat&logo=google-analytics&logoColor=white) (GA4 integration)

</div>

---

## 📁 Project Structure

```
lale-perde-site/
├── database/               # SQL Migrations and database seeds
├── public/                 # Static assets (images, logos, fonts)
└── src/
    ├── app/                # Next.js App Router (pages and API routes)
    │   ├── actions/        # Public Server Actions (e.g., contact submissions)
    │   ├── admin/          # Admin pages, actions, and tabs (Dashboard, Inbox, etc.)
    │   ├── api/            # API endpoints (Analytics sync, Log visitors, rate limiters)
    │   ├── hizmetler/      # Services page
    │   ├── iletisim/       # Contact page with Formspree integration
    │   ├── olcu-sihirbazi/ # Interactive measurement wizard page
    │   ├── rehber/         # Guides & Blog pages
    │   ├── urunler/        # Products Catalog & Detailed view pages
    │   ├── global-error.tsx# Main global error boundary
    │   ├── globals.css     # Global stylesheets and animations
    │   ├── layout.tsx      # Main site shell (Theme provider & Header/Footer)
    │   └── page.tsx        # Homepage (ISR 60s config)
    ├── components/         # Reusable UI Components (Header, Footer, ConsentBanner)
    ├── context/            # Theme, Language, Database, and GoogleAds contexts
    ├── lib/                # Database clients, utility servers, and email services
    ├── locales/            # Localization dictionaries (TR / EN)
    └── utils/              # Helper functions (e.g., IP hashing, device detection)
```

---

## 💾 Database/Data Schema

Below is the structured layout of the core PostgreSQL database tables configured in Supabase:

| Table Name | Description | Key Fields | RLS Enabled |
| :--- | :--- | :--- | :--- |
| `site_settings` | Holds general site configuration | `id` (PK), `phone`, `email`, `address`, `google_ads_id` | Yes |
| `categories` | Product categories | `id` (PK), `name_tr`, `name_en`, `slug`, `display_order` | Yes |
| `products` | Curtain products catalog | `id` (PK), `name_tr`, `category_id` (FK), `fabric_type_id` (FK), `price_multiplier` | Yes |
| `curtain_types` | Types of curtains (e.g., roller, zebra) | `id` (PK), `category_id` (FK), `name_tr`, `slug` | Yes |
| `fabric_types` | Types of fabrics available | `id` (PK), `category_id` (FK), `name_tr`, `slug` | Yes |
| `mounting_types`| Installation/mounting choices | `id` (PK), `category_id` (FK), `name_tr` | Yes |
| `inbox` | Customer messages & appointments | `id` (PK), `name`, `email`, `appointment_date`, `address` | Yes |
| `visitor_logs` | Web visitor traffic logging | `id` (PK), `ip` (hashed), `city`, `user_agent`, `timestamp` | Yes |
| `search_logs` | User search statistics cache | `query` (PK), `count` | Yes |
| `form_interactions`| Conversion funnel interactions tracking | `session_id` (PK), `status`, `created_at` | Yes |
| `campaigns` | Dynamic marketing banners | `id` (PK), `title_tr`, `is_active`, `display_order` | Yes |
| `comments` | Customer reviews and testimonials | `id` (PK), `name`, `comment_tr`, `rating`, `status` | Yes |

---

## ⚙️ Installation & Usage

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **Supabase Account** with a running database instance

### 2. Environment Setup
Create a `.env` file in the root directory and configure the following variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Resend API Key
RESEND_API_KEY="your-resend-key"
RESEND_FROM_EMAIL="iletisim@laleperde.com"

# Admin Authentication
JWT_SECRET="your-jwt-secret-string"

# Google Analytics (GA4) API Setup
GA4_PROPERTY_ID="your-property-id"
GA4_CLIENT_EMAIL="your-ga4-service-account-email"
GA4_PRIVATE_KEY="your-ga4-private-key"

# Integrations
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-F8X2E97400"
FORMSPREE_PROJECT_ID="xkolnkpg"
IP_HASH_SALT="your-random-ip-hash-salt"
```

### 3. Installation
Install the project dependencies using npm:
```bash
npm install
```

### 4. Running Locally
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 5. Production Build
Build the application for production deployment:
```bash
npm run build
npm run start
```

---

## ⚖️ License
This project is private and proprietary. All rights reserved.

---
---

<a id="turkish-version"></a>
# Türkçe Versiyon

## 💻 Proje Amacı ve Tanımı
**Lale Perde**, premium bir perde mağazası için özel olarak tasarlanmış üst düzey kurumsal web sitesi ve yönetim sistemidir. Ziyaretçiler için tam işlevsel açılış sayfası, akıllı kategorizasyona (perde tipleri, kumaş türleri, montaj seçenekleri) sahip dinamik ürün katalogları, etkileşimli bir ölçü hesaplama sihirbazı ve içerik, ayar ve analiz yönetimini sağlayan güvenli bir yönetici paneli içerir.

---

## 🚀 Öne Çıkan Özellikler
- **Dinamik İçerik ve Katalog Yönetimi:** Kategorileri, ürünleri, perde/kumaş/montaj seçeneklerini, kampanyaları, yorumları ve rehberleri yönetmek için tamamen veritabanı kontrollü dinamik sistem.
- **Akıllı Ölçü Sihirbazı:** Kullanıcıların kullanım alanlarını, ürünleri seçmesini ve kumaş ihtiyacını hesaplamak için boyutları girmesini sağlayan etkileşimli bir müşteri aracı.
- **Güçlü Güvenlik ve Yönetim Paneli:** Resend e-posta servisi ile iki adımlı doğrulama (2FA OTP) destekli, JWT tabanlı güvenli oturumlar, istek sınırlama (rate limiting) ve Server Actions koruması.
- **Gerçek Zamanlı Analitikler ve Loglar:** Google Analytics 4 (GA4) ile senkronize çalışan bir gösterge paneli; ayrıca ziyaretçi trafik akışlarını, aranan terimleri ve form dönüşüm adımlarını kayıt altına alma.
- **Performans Optimizasyonları:** Arama işlemlerinde sunucu tabanlı geciktirici (debounce) mekanizması, O(1) IP sınırlayıcı çöp toplayıcı sınırlaması ve ışık hızında yüklenme için 60s'lik Artımlı Statik Yeniden Oluşturma (ISR).

---

## 🛠️ Kullanılan Teknolojiler

<div align="left">

- **Framework:** ![Next.js](https://img.shields.io/badge/Next.js-000?style=flat&logo=nextdotjs&logoColor=fff) (v16.2.9 Turbopack destekli)
- **Kütüphane:** ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) (v19)
- **Veritabanı / Altyapı:** ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=fff) (PostgreSQL istemcisi)
- **Tasarım:** ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) / ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
- **E-Posta Gönderimi:** ![Resend](https://img.shields.io/badge/Resend-000000?style=flat&logo=maildotru&logoColor=white) (Güvenlik kodları ve bildirim gönderimleri)
- **Analiz:** ![Google Analytics](https://img.shields.io/badge/Google_Analytics-E37400?style=flat&logo=google-analytics&logoColor=white) (GA4 entegrasyonu)

</div>

---

## 📁 Klasör Yapısı

```
lale-perde-site/
├── database/               # SQL Migrasyonları ve veritabanı tohumlama verileri
├── public/                 # Statik dosyalar (görseller, logolar, yazı tipleri)
└── src/
    ├── app/                # Next.js App Router (sayfalar ve API rotaları)
    │   ├── actions/        # Genel Server Actions (iletişim formu gönderimleri vb.)
    │   ├── admin/          # Yönetici sayfaları, aksiyonları ve sekmeleri (Dashboard, Inbox vb.)
    │   ├── api/            # API uç noktaları (Analitik senkronizasyon, ziyaretçi kaydetme, sınırlayıcılar)
    │   ├── hizmetler/      # Hizmetlerimiz sayfası
    │   ├── iletisim/       # Formspree entegrasyonlu iletişim sayfası
    │   ├── olcu-sihirbazi/ # İnteraktif ölçü alma sihirbazı sayfası
    │   ├── rehber/         # Blog & Rehber içerik sayfaları
    │   ├── urunler/        # Ürün Kataloğu ve Ürün Detay sayfaları
    │   ├── global-error.tsx# Global ana hata yakalama sınırı
    │   ├── globals.css     # Global stil dosyaları ve animasyonlar
    │   ├── layout.tsx      # Ana şablon yapısı (Tema sağlayıcı, Başlık ve Alt Bilgi)
    │   └── page.tsx        # Anasayfa (ISR 60s olarak yapılandırılmış)
    ├── components/         # Yeniden kullanılabilir UI bileşenleri (Header, Footer, ConsentBanner)
    ├── context/            # Tema, Dil, Veritabanı ve Google Reklam kapsam bağlamları
    ├── lib/                # Veritabanı istemcileri, yardımcı sunucular ve e-posta servisi
    ├── locales/            # Dil dosyaları (TR / EN)
    └── utils/              # Yardımcı fonksiyonlar (IP maskeleme, cihaz algılama vb.)
```

---

## 💾 Veritabanı Tablo Şeması

Supabase üzerinde kurulu olan temel PostgreSQL veritabanı tablolarının şematik yapısı:

| Tablo Adı | Tanım | Önemli Alanlar | RLS Aktif |
| :--- | :--- | :--- | :--- |
| `site_settings` | Genel site ayarlarını tutar | `id` (PK), `phone`, `email`, `address`, `google_ads_id` | Evet |
| `categories` | Ürün kategorileri | `id` (PK), `name_tr`, `name_en`, `slug`, `display_order` | Evet |
| `products` | Perde ürünleri kataloğu | `id` (PK), `name_tr`, `category_id` (FK), `fabric_type_id` (FK), `price_multiplier` | Evet |
| `curtain_types` | Perde türleri (Örn: stor, zebra) | `id` (PK), `category_id` (FK), `name_tr`, `slug` | Evet |
| `fabric_types` | Kumaş türleri | `id` (PK), `category_id` (FK), `name_tr`, `slug` | Evet |
| `mounting_types`| Montaj ve kurulum seçenekleri | `id` (PK), `category_id` (FK), `name_tr` | Evet |
| `inbox` | Müşteri mesajları & randevular | `id` (PK), `name`, `email`, `appointment_date`, `address` | Evet |
| `visitor_logs` | Web ziyaretçi trafiği kayıtları | `id` (PK), `ip` (hashli), `city`, `user_agent`, `timestamp` | Evet |
| `search_logs` | Arama istatistikleri önbelleği | `query` (PK), `count` | Evet |
| `form_interactions`| Dönüşüm adımları etkileşim analizi | `session_id` (PK), `status`, `created_at` | Evet |
| `campaigns` | Dinamik kampanya afişleri | `id` (PK), `title_tr`, `is_active`, `display_order` | Evet |
| `comments` | Müşteri değerlendirmeleri ve yorumları | `id` (PK), `name`, `comment_tr`, `rating`, `status` | Evet |

---

## ⚙️ Kurulum & Çalıştırma

### 1. Gereksinimler
- **Node.js** (v18 veya daha yüksek bir sürüm önerilir)
- **Supabase Hesabı** ve çalışan bir veritabanı örneği

### 2. Ortam Değişkenleri
Projenin ana dizininde bir `.env` dosyası oluşturun ve aşağıdaki değişkenleri tanımlayın:
```env
# Supabase Bağlantı Bilgileri
NEXT_PUBLIC_SUPABASE_URL="supabase-url-adresiniz"
NEXT_PUBLIC_SUPABASE_ANON_KEY="anon-anahtariniz"
SUPABASE_SERVICE_ROLE_KEY="service-role-anahtariniz"

# Resend API Anahtarı
RESEND_API_KEY="resend-api-anahtariniz"
RESEND_FROM_EMAIL="iletisim@laleperde.com"

# Yönetici Oturum Güvenliği
JWT_SECRET="jwt-gizli-anahtar-kelimeniz"

# Google Analytics (GA4) API Yapılandırması
GA4_PROPERTY_ID="ga4-mulk-id-numaraniz"
GA4_CLIENT_EMAIL="ga4-servis-hesabi-postaniz"
GA4_PRIVATE_KEY="ga4-ozel-anahtari"

# Harici Entegrasyonlar
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-F8X2E97400"
FORMSPREE_PROJECT_ID="xkolnkpg"
IP_HASH_SALT="rastgele-ip-hash-tuz-kelimeniz"
```

### 3. Paket Kurulumu
Gerekli paketleri kurmak için şu komutu çalıştırın:
```bash
npm install
```

### 4. Lokal Çalıştırma
Geliştirici modunda lokal sunucuyu başlatın:
```bash
npm run dev
```
Uygulamayı tarayıcınızda görüntülemek için [http://localhost:3000](http://localhost:3000) adresine gidin.

### 5. Canlı Sürüme Derleme
Canlı (production) dağıtım öncesi build almak için:
```bash
npm run build
npm run start
```

---

## ⚖️ Lisans
Bu proje özel mülkiyet altındadır ve ticari kullanıma kapalıdır. Tüm hakları saklıdır.

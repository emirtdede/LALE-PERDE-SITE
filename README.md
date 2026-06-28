<div align="center">

# 🏡 Lale Perde E-Commerce & Management System

[![](https://img.shields.io/badge/Language-English-blue?style=for-the-badge&logo=google-translate)](#english-version)
&nbsp;&nbsp;&nbsp;&nbsp;
[![](https://img.shields.io/badge/Dil-T%C3%BCrk%C3%A7e-red?style=for-the-badge&logo=google-translate)](#turkish-version)

---

[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![React](https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: Private](https://img.shields.io/badge/License-Proprietary-orange.svg?style=flat-square)](#)

</div>

---

<a id="english-version"></a>
# English Version

**Lale Perde** is a high-end corporate e-commerce and administration platform customized for a luxury curtain and textile business. It features a fully-functional customer landing page, dynamic product catalogs with smart categorization (curtain types, fabric types, and mounting options), an interactive measurement wizard, and a secure admin panel for complete content, settings, and analytics management.

---

## 🚀 Key Features

*   **💻 Dynamic Catalog Management**: Manage product catalogs, categories, curtain/fabric types, installation choices, campaigns, and guides directly from the Admin DB.
*   **📐 Smart Measurement Wizard**: Interactive UI allowing users to select categories, products, and enter dimensions to calculate fabric requirements.
*   **🔐 Secure Admin Panel & 2FA OTP**: Protects admin operations using custom JWT sessions with 2FA OTP capability (via Resend Email), rate limiting, and secure Server Actions.
*   **📊 Traffic Analytics & Funnels**: Includes a tracking dashboard syncing with Google Analytics 4 (GA4), logging visitor traffic, search terms, and form conversion interactions.
*   **⚡ Performance Optimized**: Server-side search debouncing, O(1) IP rate-limit garbage collection throttling, and static-site generation (ISR) configured at 60s for lightning-fast page loading.

---

## 🛠️ Technology Stack

### Frontend & API Router
- **Next.js 16 (App Router)** (React framework with Turbopack support)
- **React 19** (Component model & state hooks)
- **Tailwind CSS v4** (Utility-first CSS styling)
- **Recharts** (Visual analytics dashboard charts)
- **Sharp** (Image optimization)

### Backend & Infrastructure
- **Supabase** (PostgreSQL database client with Row Level Security - RLS)
- **Resend API** (Transactional email service for OTP verification)
- **Jose** (JWT generation and validation)
- **Zod** (Robust server-side schema validation)

---

## 📁 Project Structure

```text
lale-perde-site/
├── database/                  # SQL Migrations and database seeds
├── public/                    # Static assets (images, logos, fonts)
└── src/
    ├── app/                   # Next.js App Router (pages and API routes)
    │   ├── actions/           # Public Server Actions (e.g., contact submissions)
    │   ├── admin/             # Admin pages, actions, and tabs (Dashboard, Inbox, etc.)
    │   ├── api/               # API endpoints (Analytics sync, Log visitors, rate limiters)
    │   ├── hizmetler/         # Services page
    │   ├── iletisim/          # Contact page with Formspree integration
    │   ├── olcu-sihirbazi/    # Interactive measurement wizard page
    │   ├── rehber/            # Guides & Blog pages
    │   └── urunler/           # Products Catalog & Detailed view pages
    ├── components/            # Reusable UI Components (Header, Footer, ConsentBanner)
    ├── context/               # Theme, Language, Database, and GoogleAds contexts
    ├── lib/                   # Database clients, utility servers, and email services
    ├── locales/               # Localization dictionaries (TR / EN)
    └── utils/                 # Helper functions (e.g., IP hashing, device detection)
```

---

## 💾 Database/Data Schema

| Table Name | Description | Key Fields | RLS Enabled |
| :--- | :--- | :--- | :--- |
| `site_settings` | Holds general site configuration | `id` (PK), `phone`, `email`, `address`, `google_ads_id` | Yes |
| `categories` | Product categories | `id` (PK), `name_tr`, `name_en`, `slug`, `display_order` | Yes |
| `products` | Curtain products catalog | `id` (PK), `name_tr`, `category_id` (FK), `fabric_type_id` (FK) | Yes |
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

## ⚙️ Setup & Execution Guide

### 1. Environment Setup
Create a `.env` file in the root directory and configure the variables:
```env
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
RESEND_API_KEY="your-resend-key"
JWT_SECRET="your-jwt-secret-string"
GA4_PROPERTY_ID="your-property-id"
GA4_CLIENT_EMAIL="your-ga4-service-account-email"
GA4_PRIVATE_KEY="your-ga4-private-key"
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-F8X2E97400"
FORMSPREE_PROJECT_ID="xkolnkpg"
IP_HASH_SALT="your-random-ip-hash-salt"
```

### 2. Installation & Running
Ensure Node.js is installed. Run the commands:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 👥 Authors
*   **Emir Tarık DEDE** - [GitHub](https://github.com/emirtdede)

---

## ⚖️ License
This project is private and proprietary. All rights reserved.

---

<a id="turkish-version"></a>
# Türkçe Versiyon

**Lale Perde**, lüks perde ve tekstil işletmeleri için özel olarak tasarlanmış üst düzey kurumsal e-ticaret ve yönetim platformudur. Ziyaretçiler için tam işlevsel açılış sayfası, akıllı kategorizasyona (perde tipleri, kumaş türleri, montaj seçenekleri) sahip dinamik ürün katalogları, etkileşimli bir ölçü hesaplama sihirbazı ve içerik, ayar ve analiz yönetimini sağlayan güvenli bir yönetici paneli içerir.

---

## 🚀 Öne Çıkan Özellikler

*   **💻 Dinamik Katalog Yönetimi**: Ürün kataloglarını, kategorileri, perde/kumaş tiplerini, kurulum seçeneklerini, kampanyaları ve rehberleri doğrudan Yönetim DB'sinden yönetin.
*   **📐 Akıllı Ölçü Sihirbazı**: Kullanıcıların kullanım alanlarını ve ürünleri seçmesini, kumaş ihtiyacını hesaplamak için boyutları girmesini sağlayan etkileşimli kullanıcı arayüzü.
*   **🔐 Güvenli Yönetici Paneli & 2FA OTP**: Resend e-posta servisi ile iki adımlı doğrulama (2FA OTP) destekli, JWT tabanlı güvenli oturumlar, istek sınırlama (rate limiting) ve Server Actions koruması.
*   **📊 Trafik Analizleri ve Hunileri**: Google Analytics 4 (GA4) ile senkronize çalışan bir gösterge paneli; ayrıca ziyaretçi trafik akışlarını, aranan terimleri ve form dönüşüm adımlarını kayıt altına alma.
*   **⚡ Performans Optimizasyonları**: Arama işlemlerinde sunucu tabanlı geciktirici (debounce) mekanizması, O(1) IP sınırlayıcı çöp toplayıcı sınırlaması ve ışık hızında yüklenme için 60s'lik Artımlı Statik Yeniden Oluşturma (ISR).

---

## 🛠️ Kullanılan Teknolojiler

### Önyüz ve API Rotaları
- **Next.js 16 (App Router)** (Turbopack destekli React framework'ü)
- **React 19** (Bileşen modeli ve durum hook'ları)
- **Tailwind CSS v4** (Yardımcı sınıf öncelikli CSS tasarımı)
- **Recharts** (Görsel analitik paneli grafikleri)
- **Sharp** (Görsel optimizasyonu)

### Arkayüz ve Altyapı
- **Supabase** (Satır Düzeyinde Güvenlik - RLS destekli PostgreSQL veritabanı istemcisi)
- **Resend API** (Tek seferlik şifre doğrulama için e-posta gönderim servisi)
- **Jose** (JWT üretimi ve doğrulaması)
- **Zod** (Gelişmiş sunucu tarafı şema doğrulaması)

---

## 📁 Klasör Yapısı

```text
lale-perde-site/
├── database/                  # SQL Migrasyonları ve veritabanı tohumlama verileri
├── public/                    # Statik dosyalar (görseller, logolar, yazı tipleri)
└── src/
    ├── app/                   # Next.js App Router (sayfalar ve API rotaları)
    │   ├── actions/           # Genel Server Actions (iletişim formu gönderimleri vb.)
    │   ├── admin/             # Yönetici sayfaları, aksiyonları ve sekmeleri (Dashboard, Inbox vb.)
    │   ├── api/               # API uç noktaları (Analitik senkronizasyon, ziyaretçi kaydetme, sınırlayıcılar)
    │   ├── hizmetler/         # Hizmetlerimiz sayfası
    │   ├── iletisim/          # Formspree entegrasyonlu iletişim sayfası
    │   ├── olcu-sihirbazi/    # İnteraktif ölçü alma sihirbazı sayfası
    │   ├── rehber/            # Blog & Rehber içerik sayfaları
    │   └── urunler/           # Ürün Kataloğu ve Ürün Detay sayfaları
    ├── components/            # Yeniden kullanılabilir UI bileşenleri (Header, Footer, ConsentBanner)
    ├── context/               # Tema, Dil, Veritabanı ve Google Reklam kapsam bağlamları
    ├── lib/                   # Veritabanı istemcileri, yardımcı sunucular ve e-posta servisi
    ├── locales/               # Dil dosyaları (TR / EN)
    └── utils/                 # Yardımcı fonksiyonlar (IP maskeleme, cihaz algılama vb.)
```

---

## 💾 Veritabanı Tablo Şeması

| Tablo Adı | Tanım | Önemli Alanlar | RLS Aktif |
| :--- | :--- | :--- | :--- |
| `site_settings` | Genel site ayarlarını tutar | `id` (PK), `phone`, `email`, `address`, `google_ads_id` | Evet |
| `categories` | Ürün kategorileri | `id` (PK), `name_tr`, `name_en`, `slug`, `display_order` | Evet |
| `products` | Perde ürünleri kataloğu | `id` (PK), `name_tr`, `category_id` (FK), `fabric_type_id` (FK) | Evet |
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

## ⚙️ Kurulum ve Çalıştırma

### 1. Ortam Değişkenleri
Projenin ana dizininde bir `.env` dosyası oluşturun ve aşağıdaki değişkenleri tanımlayın:
```env
NEXT_PUBLIC_SUPABASE_URL="supabase-url-adresiniz"
NEXT_PUBLIC_SUPABASE_ANON_KEY="anon-anahtariniz"
SUPABASE_SERVICE_ROLE_KEY="service-role-anahtariniz"
RESEND_API_KEY="resend-api-anahtariniz"
JWT_SECRET="jwt-gizli-anahtar-kelimeniz"
GA4_PROPERTY_ID="ga4-mulk-id-numaraniz"
GA4_CLIENT_EMAIL="ga4-servis-hesabi-postaniz"
GA4_PRIVATE_KEY="ga4-ozel-anahtari"
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-F8X2E97400"
FORMSPREE_PROJECT_ID="xkolnkpg"
IP_HASH_SALT="rastgele-ip-hash-tuz-kelimeniz"
```

### 2. Kurulum & Çalıştırma
Node.js yüklü olduğundan emin olun ve şu komutları çalıştırın:
```bash
npm install
npm run dev
```
Uygulamayı tarayıcınızda görüntülemek için [http://localhost:3000](http://localhost:3000) adresine gidin.

---

## 👥 Yazarlar
*   **Emir Tarık DEDE** - [GitHub](https://github.com/emirtdede)

---

## ⚖️ Lisans
Bu proje özel mülkiyet altındadır ve ticari kullanıma kapalıdır. Tüm hakları saklıdır.

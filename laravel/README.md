# TAKONO Digital Tourism Platform - Laravel 11 Backend & React Integration Guide

Panduan integrasi penuh antara **Laravel 11 (REST API Backend)** dan **React TypeScript (Frontend SPA)** untuk platform pariwisata digital **TAKONO** (dioptimasi untuk deployment di **Jagoan Hosting**, VPS, atau cPanel).

---

## 1. Arsitektur Integrasi (Decoupled Production Architecture)

```text
[ React Frontend SPA (Vite + TS) ] 
       │ 
       ▼ (HTTP / JSON via Bearer Sanctum Token)
[ Laravel 11 Backend API ]
       │
  ┌────┴───────────────────────────────┐
  ▼                                    ▼
[ MySQL Database ]            [ Storage & Media ]
(Users, Points, Quizzes,     (Hero images, assets)
 Destinations, UMKM)
```

- **Frontend**: React 19 + TypeScript + Tailwind CSS + Lucide Icons + Leaflet.
- **Backend**: Laravel 11 + Laravel Sanctum + Eloquent ORM + MySQL.
- **Integrasi**: Konfigurasi otomatis via `VITE_API_URL`.

---

## 2. Cara Menjalankan Backend Laravel di Server / Lokal

### Langkah 1: Masuk ke direktori Laravel
```bash
cd laravel
```

### Langkah 2: Install dependensi Composer
```bash
composer install
```

### Langkah 3: Konfigurasi Environment (`.env`)
Salin file `.env.example` ke `.env`:
```bash
cp .env.example .env
php artisan key:generate
```

Sesuaikan kredensial database di `.env`:
```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=takono_db
DB_USERNAME=root
DB_PASSWORD=rahasia
```

Pastikan domain frontend diizinkan di CORS `.env`:
```ini
CORS_ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173,https://takono.id"
SANCTUM_STATEFUL_DOMAINS="localhost:3000,localhost:5173,takono.id"
```

### Langkah 4: Jalankan Migration dan Seeder Data Resmi KBS
```bash
php artisan migrate --seed
```
*Perintah ini akan membuat 10 tabel database dan mengisinya dengan akun demo (Budi Santoso, Pengelola KBS, Dinas Pariwisata Surabaya), data destinasi Kebun Binatang Surabaya, Explore Points, Kuis Interaktif, dan Mitra UMKM.*

### Langkah 5: Jalankan Server Laravel
```bash
php artisan serve --port=8000
```
API akan aktif di `http://localhost:8000/api`.

---

## 3. Menghubungkan Frontend React ke Backend Laravel

Di root folder proyek React, setel file `.env`:
```ini
VITE_API_URL="http://localhost:8000"
```
*(Atau URL domain produksi backend Anda di Jagoan Hosting, misal: `https://api.takono.id`)*

Jalankan frontend:
```bash
npm run dev
```

Frontend secara otomatis akan memanggil seluruh endpoint Laravel 11:
- `POST /api/auth/login` & `POST /api/auth/switch-demo-role`
- `GET /api/destinations/kebun-binatang-surabaya`
- `GET /api/smart-guide/recommendations`
- `POST /api/explore-points/{id}/quiz/submit` (validasi kuis server-side)
- `POST /api/rewards/{id}/redeem` (pemotongan Jejak Points & pembuatan voucher)
- `GET /api/government/dashboard` & `GET /api/manager/dashboard`

---

## 4. Panduan Deploy ke cPanel / Cloud VPS Jagoan Hosting

1. **Upload File Laravel**: Letakkan seluruh isi folder `laravel/` di luar direktori `public_html` (misal: `/home/username/takono-backend/`).
2. **Setup Public Folder**: Arahkan subdomain (misal: `api.takono.id`) ke folder `/home/username/takono-backend/public/`.
3. **Build Frontend**:
   ```bash
   npm run build
   ```
4. **Upload Frontend**: Ekstrak isi folder `dist/` ke direktori `public_html` utama domain Anda (`takono.id`).
5. **SSL & HTTPS**: Aktifkan Let's Encrypt SSL gratis di cPanel Jagoan Hosting untuk kedua domain.

---

## 5. Fitur Utama yang Terintegrasi
- **Zero AI-Slop & Desain Bersih**: Mengikuti panduan kompetisi Jagoan Hosting Innovation 2026.
- **Logo Resmi TAKONO**: Tersemat rapi di Navbar, Footer, Mobile Layout, dan Landing Page.
- **Logo Partner Resmi (Group 8)**: Terpasang eksklusif di footer (Jagoan Hosting Innovation Competition 2026, Jagoan Hosting, Ngalup.co, Komdigi, Garuda Spark Innovation Hub).
- **Gamifikasi & Local Discovery**: Real-time point tracking menghubungkan wisatawan langsung dengan UMKM lokal.

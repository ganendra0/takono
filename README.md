# TAKONO — Tourism Experience & Ecosystem Platform
> Platform Ekosistem Pariwisata Berkelanjutan Terintegrasi yang menghubungkan **Traveler (Wisatawan)**, **Destination Manager (Pengelola Destinasi)**, **Pelaku UMKM Mitra**, **Dinas Pariwisata (Pemerintah)**, dan **Super Administrator**.

---

## 🏗️ Arsitektur Teknologi

Aplikasi ini dibangun menggunakan arsitektur **Full-Stack Terpadu (Unified Full-Stack)**:

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion (Framer Motion), Canvas Confetti, QRCode.
- **Backend**: Express.js (Node.js) terintegrasi dengan Vite Middleware.
- **Database**: **MySQL 8.0+** (dengan konektor `mysql2/promise`, migrasi DDL otomatis, dan *in-memory fallback* cerdas).
- **Autentikasi & Keamanan**: **Bcrypt.js** (hashing kata sandi) & **JSON Web Token (JWT)**.
- **Development Tooling**: `tsx` (TypeScript executor untuk backend), `esbuild` (bundler produksi), `vite` (bundler frontend).

---

## 📋 Prasyarat Sistem (Prerequisites)

Sebelum menjalankan aplikasi di komputer lokal Anda, pastikan telah menginstal:

1. **Node.js** versi **18.x** atau **20.x+** (Unduh di: [nodejs.org](https://nodejs.org))
2. **NPM** (biasanya terinstal otomatis bersama Node.js)
3. **MySQL Server** versi **8.0+** atau **MariaDB 10.4+**
   - Anda bisa menggunakan salah satu dari:
     - **XAMPP** (paling mudah di Windows: aktifkan modul *Apache* dan *MySQL*)
     - **Laragon** (Windows)
     - **MySQL Community Server** / **MySQL Workbench**
     - **Docker** (`docker run --name mysql-takono -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=takono_db -p 3307:3307 -d mysql:8.0`)

---

## 🚀 Panduan Instalasi & Konfigurasi di Komputer Lokal

Ikuti langkah-langkah berikut secara berurutan:

### Langkah 1: Ekstrak atau Kloning Proyek
Buka terminal atau Command Prompt di folder proyek Anda:
```bash
cd path/ke/folder-takono
```

### Langkah 2: Instalasi Dependensi NPM
Jalankan perintah berikut untuk mengunduh semua paket yang dibutuhkan:
```bash
npm install
```

### Langkah 3: Konfigurasi Database MySQL

1. Pastikan layanan MySQL Anda sedang berjalan (misal: klik tombol **Start** MySQL di XAMPP Control Panel).
2. Buka alat manajemen database Anda (**phpMyAdmin**, **MySQL Workbench**, **DBeaver**, **HeidiSQL**, atau **Terminal MySQL**).
3. Buat database baru bernama `takono_db`:
   ```sql
   CREATE DATABASE IF NOT EXISTS takono_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
4. *(Opsional)* Jika Anda ingin mengimpor skema tabel secara manual, Anda dapat mengimpor file `schema.sql` yang sudah tersedia di root proyek:
   ```bash
   mysql -u root -p takono_db < schema.sql
   ```
   > **Catatan Penting**: Backend Express TAKONO sudah dilengkapi dengan **Auto-Migration & Auto-Seeding**. Jika Anda hanya membuat database `takono_db` kosong, backend akan secara otomatis membuat 13 tabel dan mengisi data awal (users, Penglipuran, kuis, UMKM, produk, reward) saat server pertama kali dijalankan!

### Langkah 4: Konfigurasi File Environment (`.env`)

Salin file contoh `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
*(Di Windows Command Prompt: `copy .env.example .env`)*

Buka file `.env` di text editor (VS Code, Notepad, dll.) dan sesuaikan kredensial MySQL lokal Anda:

```env
# Port Server Backend & Frontend
PORT=3000

# Kunci Rahasia JWT (dapat diganti acak)
JWT_SECRET="takono_super_secret_jwt_key_2026"

# Konfigurasi Koneksi Database MySQL Lokal
MYSQL_HOST="localhost"
MYSQL_PORT=3307
MYSQL_USER="root"
MYSQL_PASSWORD=""
MYSQL_DATABASE="takono_db"
```

> **Tips untuk Pengguna XAMPP / Laragon**:
> - Di XAMPP default: `MYSQL_USER="root"` dan `MYSQL_PASSWORD=""` (dikosongkan).
> - Di Laragon default: `MYSQL_USER="root"` dan `MYSQL_PASSWORD=""`.
> - Di Docker / MySQL Installer: sesuaikan dengan password root yang Anda tentukan saat instalasi.

---

### Langkah 5: Menjalankan Server Aplikasi

#### Mode Pengembangan (Development Mode):
```bash
npm run dev
```
Server akan mengompilasi backend Express dan frontend Vite secara instan.
Buka peramban (*browser*) Anda di:
👉 **`http://localhost:3000`**

Di terminal, Anda akan melihat log seperti ini:
```text
[DB] Mencoba menghubungkan ke MySQL di localhost:3307, database: takono_db...
[DB] ✅ Berhasil terhubung ke MySQL Server: localhost:3307/takono_db
[DB] ✅ Migrasi skema tabel MySQL selesai.
[DB] ✅ Data awal berhasil disemai ke seluruh tabel MySQL.
[TAKONO] Full-stack Server running at http://0.0.0.0:3000
```

#### Mode Produksi (Production Build & Start):
```bash
npm run build
npm start
```

---

## 👥 Akun Demo Siap Pakai untuk Pengujian

Semua akun demo di bawah ini telah disemai (*pre-seeded*) dengan password default: **`takono123`**. Anda juga dapat mendaftarkan akun baru melalui tombol **"Masuk / Daftar"** di pojok kanan atas aplikasi.

| Peran (Role) | Nama Pengguna | Email Login | Password | Keterangan Akses |
| :--- | :--- | :--- | :--- | :--- |
| **Traveler** | Ganendra Djawa | `ganendradjawa@gmail.com` | `takono123` | Wisatawan aktif, saldo 85 Jejak Points, akses Smart Guide & penukaran reward |
| **Destination Manager** | Wayan Sudirga | `wayan.sudirga@penglipuran.desa.id` | `takono123` | Pengelola Desa Wisata Penglipuran, kelola explore points, kuis, generator QR |
| **UMKM Mitra** | Ni Wayan Rai | `loloh.cemcem.made@gmail.com` | `takono123` | Pemilik Warung Loloh Cemcem Bu Made, kelola katalog kuliner & promosi diskon |
| **Dinas Pariwisata** | Dr. I Ketut Widana, M.Par | `pariwisata.provinsi@bali.go.id` | `takono123` | Laporan intelligence pariwisata provinsi, kepatuhan adat & dampak ekonomi UMKM |
| **Super Admin** | Super Administrator | `admin@takono.id` | `takono123` | Akses penuh moderasi destinasi, persetujuan UMKM, dan manajemen pengguna |

---

## 🗄️ Skema Tabel Basis Data MySQL

Terdapat 13 tabel relasional di database `takono_db`:

1. `users` — Data profil pengguna, peran (role), avatar, hashed password, dan saldo Jejak Points.
2. `destinations` — Master data destinasi wisata (nama, deskripsi, lokasi administratif, pengelola, tarif tiket, galeri).
3. `explore_points` — Titik jelajah tematik per destinasi (cagar budaya, pantangan adat, narasi budaya, kode QR, reward poin).
4. `quizzes` — Soal kuis edukasi budaya per titik jelajah untuk verifikasi pengetahuan wisatawan.
5. `rewards` — Katalog reward & voucher UMKM yang dapat ditukarkan menggunakan saldo Jejak Points.
6. `events` — Jadwal festival, upacara adat, dan acara destinasi dengan perolehan lencana/badge.
7. `umkm` — Profil pelaku UMKM mitra, status verifikasi/persetujuan (*pending*, *approved*, *rejected*), dan relasi destinasi.
8. `umkm_products` — Daftar menu kuliner, kerajinan lokal, atau suvenir khas yang dijual UMKM.
9. `umkm_promotions` — Kupon diskon dan kode promo khusus wisatawan TAKONO.
10. `point_transactions` — **Buku Besar Transaksi (Ledger Poin)** yang mencatat setiap penambahan atau pengurangan poin secara detail dan terverifikasi.
11. `journeys` — Sesi jelajah aktif wisatawan, riwayat titik yang sudah dikunjungi, dan kuis yang diselesaikan.
12. `qr_codes` — Kode QR terenkripsi yang ditempatkan di plakat fisik titik jelajah untuk di-scan wisatawan.
13. `analytics_events` — Jejak analitik peristiwa (scan QR, penyelesaian titik, penukaran voucher, submit kuis).

---

## 🔌 Dokumentasi REST API Backend

Backend Express menyediakan endpoint API lengkap di bawah prefix `/api`:

### Autentikasi (`/api/auth`)
- `POST /api/auth/register` — Mendaftarkan akun baru (nama, email, password, peran, dll.).
- `POST /api/auth/login` — Autentikasi pengguna, mengembalikan token JWT dan profil pengguna.
- `GET /api/auth/me` — Memverifikasi token JWT dan mengembalikan profil pengguna yang sedang login.
- `GET /api/auth/users` — Mengambil daftar seluruh pengguna (untuk kebutuhan admin/switcher).

### Destinasi & Titik Jelajah
- `GET /api/destinations` — Mengambil daftar seluruh destinasi wisata.
- `GET /api/destinations/:id` — Mengambil rincian destinasi berdasarkan ID atau slug.
- `POST /api/destinations` — Membuat destinasi baru (Manager/Admin).
- `GET /api/explore-points?destinationId=...` — Mengambil titik jelajah per destinasi.
- `POST /api/explore-points` — Menambah titik jelajah baru beserta narasi budaya & pantangan adat.

### Kuis & Edukasi Budaya
- `GET /api/quizzes?explorePointId=...` — Mengambil kuis edukasi untuk titik jelajah tertentu.
- `POST /api/quizzes` — Menambah atau memperbarui kuis budaya.

### UMKM & Ekonomi Lokal
- `GET /api/umkm?destinationId=...&status=approved` — Mengambil daftar UMKM mitra.
- `PUT /api/umkm/:id/approve` — Menyetujui pendaftaran UMKM (oleh Admin).
- `PUT /api/umkm/:id/reject` — Menolak pendaftaran UMKM dengan alasan tertulis.
- `POST /api/umkm/:id/products` — Menambahkan produk ke katalog UMKM.
- `POST /api/umkm/:id/promotions` — Menambahkan promo diskon voucher.

### Reward & Jejak Points
- `GET /api/rewards?destinationId=...` — Mengambil katalog penukaran reward.
- `POST /api/rewards/redeem` — Melakukan transaksi penukaran reward secara aman (validasi saldo, pengurangan stok otomatis, dan penerbitan kode klaim).
- `GET /api/points/transactions?userId=...` — Mengambil buku besar riwayat transaksi poin.

### Status Sistem & Database
- `GET /api/db/status` — Memeriksa kesehatan koneksi MySQL, host, port, dan mode operasional aktif.
- `GET /api/health` — Status liveness server backend.

---

## 🛠️ Panduan Penyelesaian Masalah (Troubleshooting)

### 1. `Error: connect ECONNREFUSED 127.0.0.1:3307`
- **Penyebab**: Layanan MySQL belum dinyalakan atau port bukan 3307.
- **Solusi**: 
  - Pastikan MySQL di XAMPP / Laragon sudah berstatus **Running**.
  - Cek apakah port MySQL Anda adalah 3307 atau 3307 di XAMPP. Jika port 3307, ubah `MYSQL_PORT=3307` di file `.env`.
  - *Catatan*: Aplikasi TAKONO tetap dapat berjalan normal menggunakan *Resilient In-Memory Mode* jika MySQL belum aktif.

### 2. `Error: ER_ACCESS_DENIED_ERROR for user 'root'@'localhost'`
- **Penyebab**: Password MySQL yang dimasukkan di file `.env` salah.
- **Solusi**: Sesuaikan nilai `MYSQL_PASSWORD` di file `.env`. Pada XAMPP standar Windows, biarkan bernilai kosong: `MYSQL_PASSWORD=""`.

### 3. Port 3000 sedang digunakan aplikasi lain
- Ubah `PORT=3001` di `.env` (untuk penggunaan di komputer lokal Anda).

---

## 📄 Lisensi & Hak Cipta
Dibuat dengan ❤️ untuk Pariwisata Berkelanjutan Indonesia.
Platform TAKONO &copy; 2026.
# takono

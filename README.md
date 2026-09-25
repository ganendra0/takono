# TAKONO

TAKONO adalah aplikasi digital tourism untuk pengalaman destinasi berbasis React, TypeScript, Tailwind CSS, Laravel REST API, Sanctum bearer token, dan MySQL.

Demo utama menggunakan **Taman Bungkul, Surabaya**. Backend aktif berada di folder `laravel/`; Express dan database in-memory tidak digunakan.

## Kebutuhan lokal

- Node.js dan npm
- PHP 8.2 atau lebih baru
- Composer
- MySQL

## Instalasi

### 1. Backend Laravel

```bash
cd laravel
composer install
cp .env.example .env
php artisan key:generate
```

Sesuaikan koneksi MySQL pada `laravel/.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=takono_db
DB_USERNAME=root
DB_PASSWORD=
```

Kemudian jalankan:

```bash
php artisan migrate
php artisan db:seed
```

Seeder utama mengisi katalog Taman Bungkul tanpa membuat akun atau password otomatis.

### 2. Frontend React

Dari root project:

```bash
npm install
```

## Menjalankan aplikasi

Buka dua terminal dari root project.

Terminal backend:

```bash
npm run api
```

Terminal frontend:

```bash
npm run dev
```

Frontend tersedia di `http://localhost:3000` dan Laravel API di `http://127.0.0.1:8000`.

Pada mode development, request `/api` diteruskan oleh Vite ke Laravel sehingga akses dari alamat LAN seperti `http://192.168.x.x:3000` tidak membutuhkan URL API `localhost` di browser pengguna.

## Akun demo lokal

Password akun demo pada workspace lokal saat ini:

```text
TakonoDemo#2026
```

| Role | Email |
| --- | --- |
| Traveler | `traveler@takono.id` |
| Pengelola Taman Bungkul | `manager@bungkul.id` |
| Pemerintah | `dinas@surabaya.go.id` |
| Super Admin | `admin@takono.id` |

Jadi login Manager terbaru adalah:

```text
Email: manager@bungkul.id
Password: TakonoDemo#2026
```

Untuk membuat atau mereset empat akun demo pada database lokal lain:

```bash
cd laravel
DEMO_ACCOUNT_PASSWORD='TakonoDemo#2026' php artisan db:seed --class=DemoAccountSeeder
```

Perintah tersebut:

- membuat akun jika belum ada;
- memperbarui role dan password akun demo jika sudah ada;
- menetapkan Manager ke Taman Bungkul;
- mempertahankan saldo dan histori aktivitas akun yang sudah ada;
- mencabut token login lama setelah password direset.

Jangan gunakan password demo ini pada production.

## Membuat Admin tanpa akun demo

Untuk instalasi non-demo, buat administrator pertama secara interaktif:

```bash
cd laravel
php artisan takono:admin admin@example.com --name="Admin TAKONO"
```

Setelah login, Admin dapat membuat akun Pemerintah atau Pengelola dan menetapkan destinasi Manager.

## Role dan akses

- **Traveler:** destinasi, Smart Guide, Explore Point, QR, Quiz, Points, Reward, Event, Local Discovery, dan Album.
- **Manager:** hanya mengelola destinasi yang ditugaskan kepadanya beserta Explore Point, Event, Reward, dan Local Discovery.
- **Government:** dashboard aktivitas pengguna TAKONO dan laporan agregat, tanpa akses mengubah konten.
- **Super Admin:** pengguna, role, assignment Manager, destinasi, dan audit log.

Ownership dan role diperiksa oleh Laravel API, bukan hanya disembunyikan dari UI.

## Seeder Taman Bungkul

Data katalog berada di:

```text
laravel/database/data/catalog.json
```

Jalankan ulang secara aman dengan:

```bash
cd laravel
php artisan db:seed
```

Seeder memperbarui katalog berdasarkan slug/nama dan mempertahankan ID serta histori aktivitas yang sudah terkait.

## CORS dan akses melalui jaringan lokal

Untuk development, gunakan URL frontend Vite dan biarkan frontend memanggil `/api` melalui proxy.

Jika frontend dan Laravel dijalankan pada origin berbeda, tambahkan origin frontend ke `laravel/.env`:

```env
CORS_ALLOWED_ORIGINS="http://localhost:3000,http://192.168.1.9:3000"
```

Setelah mengubah environment Laravel:

```bash
cd laravel
php artisan optimize:clear
```

Pada production, atur `VITE_API_URL` sebelum build dan gunakan HTTPS.

## Login dengan Google

Integrasi Google sudah disiapkan dengan Google Identity Services. Agar tombol Google aktif, buat **OAuth 2.0 Client ID untuk Web application** di [Google Cloud Console](https://console.cloud.google.com/apis/credentials), lalu isi Client ID tersebut (bukan Client Secret) di `laravel/.env`:

```env
GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
```

Pada konfigurasi Client ID, tambahkan seluruh alamat frontend ke **Authorized JavaScript origins**, misalnya:

```text
http://localhost:3000
http://192.168.1.9:3000
https://domain-takono-anda.id
```

Setelah menyimpan konfigurasi, jalankan berikut dari folder `laravel/` lalu restart backend dan frontend:

```bash
php artisan optimize:clear
```

Login Google membuat akun Traveler baru secara otomatis. Jika alamat email Google sudah dipakai oleh akun TAKONO berbasis password, masuklah dengan password lebih dulu; akun tidak otomatis disatukan hanya berdasarkan kecocokan email demi mencegah pengambilalihan akun.

## Pemeriksaan kualitas

Frontend:

```bash
npm run lint
npm run build
```

Backend:

```bash
cd laravel
php artisan test
php artisan migrate:status
php artisan route:list --path=api
```

Test backend menggunakan koneksi database dari environment. Jangan menjalankannya terhadap database production.

Audit browser opsional:

```bash
TAKONO_TEST_PASSWORD='TakonoDemo#2026' npm run test:browser
```

## Struktur penting

```text
src/                         Frontend React
src/pages/traveler/          UI Traveler
src/pages/manager/           UI Pengelola
src/pages/government/        UI Pemerintah
src/pages/admin/             UI Admin
src/lib/api.ts               Client Laravel API
laravel/app/                 Backend Laravel
laravel/routes/api.php       Route REST API
laravel/database/data/       Katalog Taman Bungkul
laravel/database/seeders/    Seeder katalog dan akun demo opsional
scripts/browser-audit.mjs    Audit UI responsif
```

## Catatan production

- Jangan menjalankan `DemoAccountSeeder` di production.
- Gunakan `APP_DEBUG=false`.
- Gunakan password database terbatas dan backup terjadwal.
- Serve Laravel dari folder `public/`.
- Build frontend dengan `npm run build` lalu serve folder `dist/`.
- Pastikan `storage/` dan `bootstrap/cache/` dapat ditulis oleh proses PHP.
- Gunakan HTTPS dan origin CORS yang spesifik.

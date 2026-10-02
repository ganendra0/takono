# TAKONO

TAKONO adalah aplikasi digital tourism untuk pengalaman destinasi berbasis React, TypeScript, Tailwind CSS, Laravel REST API, Sanctum bearer token, dan MySQL.

Demo mencakup **Taman Bungkul** dan **Tugu Pahlawan, Surabaya**. Backend aktif berada di folder `laravel/`; Express dan database in-memory tidak digunakan.

Untuk memahami arsitektur, semua peran, alur QR dan perjalanan traveler, data, keamanan, serta endpoint utama, baca [Dokumentasi TAKONO](docs/TAKONO_OVERVIEW.md).

Untuk men-deploy ke VPS dengan Nginx, MySQL, HTTPS, backup, dan checklist go-live, baca [Panduan Deployment VPS](docs/DEPLOYMENT_VPS.md).

## Kebutuhan lokal

- Node.js dan npm
- PHP 8.2 atau lebih baru
- Composer
- MySQL

## Instalasi cepat

Ikuti langkah ini dari folder utama proyek. Perintah di bawah dibagi berdasarkan terminal agar tidak tertukar antara macOS/Linux dan Windows PowerShell.

### 1. Backend Laravel

macOS / Linux:

```bash
cd laravel
composer install
cp .env.example .env
php artisan key:generate
```

Windows PowerShell:

```powershell
cd laravel
composer install
Copy-Item .env.example .env
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

Seeder utama mengisi katalog Taman Bungkul dan Tugu Pahlawan tanpa membuat akun atau password otomatis.

> Jangan gunakan `php artisan migrate:fresh` kecuali memang ingin menghapus seluruh data database lokal. Untuk penggunaan biasa gunakan `php artisan migrate`.

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
| Traveler | `sari.traveler@takono.id` |
| Traveler | `raka.traveler@takono.id` |
| Pengelola Taman Bungkul | `manager@bungkul.id` |
| Pengelola Tugu Pahlawan | `manager@tugupahlawan.id` |
| Tenant Taman Bungkul | `tenant@bungkul.id` |
| Tenant Tugu Pahlawan | `tenant@tugupahlawan.id` |
| Pemerintah | `dinas@surabaya.go.id` |
| Super Admin | `admin@takono.id` |

Jadi login Manager terbaru adalah:

```text
Email: manager@bungkul.id
Password: TakonoDemo#2026
```

Untuk membuat atau mereset **sembilan akun demo** pada database lokal lain, jalankan salah satu perintah berikut dari folder `laravel/`.

macOS / Linux:

```bash
cd laravel
DEMO_ACCOUNT_PASSWORD='TakonoDemo#2026' php artisan db:seed --class=DemoAccountSeeder
```

Windows PowerShell:

```powershell
cd laravel
$env:DEMO_ACCOUNT_PASSWORD = 'TakonoDemo#2026'
php artisan db:seed --class=DemoAccountSeeder
Remove-Item Env:DEMO_ACCOUNT_PASSWORD
```

PowerShell tidak mendukung format `NAMA_VARIABEL=nilai perintah`, sehingga gunakan `$env:...` seperti contoh di atas.

Perintah tersebut:

- membuat akun jika belum ada;
- memperbarui role dan password akun demo jika sudah ada;
- menetapkan Manager dan Tenant ke Taman Bungkul dan Tugu Pahlawan;
- menugaskan reward demo pada tenant destinasi yang sesuai;
- mempertahankan saldo dan histori aktivitas akun yang sudah ada;
- mencabut token login lama setelah password direset.

Jangan gunakan password demo ini pada production.

## Membuat Admin tanpa akun demo

Untuk instalasi non-demo, buat administrator pertama secara interaktif:

```bash
cd laravel
php artisan takono:admin admin@example.com --name="Admin TAKONO"
```

Setelah login, Admin dapat membuat akun Pemerintah, Pengelola, atau Tenant dan menetapkan destinasi untuk Pengelola/Tenant.

## Role dan akses

- **Traveler:** destinasi, Smart Guide, Explore Point, QR, Quiz, Points, Reward, Event, Local Discovery, dan Album.
- **Manager:** hanya mengelola destinasi yang ditugaskan kepadanya beserta Explore Point, Event, Reward, dan Local Discovery.
- **Tenant:** memindai QR voucher traveler dan memvalidasi penukaran satu kali untuk reward yang ditugaskan kepadanya.
- **Government:** dashboard aktivitas pengguna TAKONO dan laporan agregat, tanpa akses mengubah konten.
- **Super Admin:** pengguna, role, assignment Manager, destinasi, dan audit log.

Ownership dan role diperiksa oleh Laravel API, bukan hanya disembunyikan dari UI.

## Seeder katalog destinasi

Data katalog berada di:

```text
laravel/database/data/catalog.json
```

Jalankan ulang secara aman dengan:

```bash
cd laravel
php artisan db:seed
```

Seeder memperbarui katalog berdasarkan code/slug dan mempertahankan ID, QR token, serta histori aktivitas yang sudah terkait. Tugu Pahlawan mencakup empat Explore Point dengan kuis, empat UMKM/Local Discovery, dan tiga event demo.

Untuk database demo baru, urutan aman yang direkomendasikan:

```text
1. php artisan migrate
2. php artisan db:seed
3. Jalankan DemoAccountSeeder sesuai sistem operasi di atas
```

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
laravel/database/data/       Katalog destinasi demo
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

# TAKONO — Laravel API

React → Laravel REST API (Sanctum bearer tokens) → MySQL. Tidak ada Express atau fallback database in-memory.

## Menjalankan lokal

1. Jalankan `composer install` di folder ini. Untuk instalasi baru, salin `.env.example` ke `.env`, atur MySQL dan jalankan `php artisan key:generate`. Jangan timpa environment yang sudah ada.
2. Tinjau `php artisan migrate:status`. Pada database baru jalankan `php artisan migrate`, lalu `php artisan db:seed`.
3. Pada database lama, migration `2026_09_24_000003_balance_ledger` menambahkan catatan rekonsiliasi selisih saldo lama dan ledger tanpa mengubah saldo. Migration ini sudah diterapkan pada lingkungan kerja.
4. Dari root proyek jalankan `npm install`, `npm run api`, dan pada terminal lain `npm run dev`.

Vite meneruskan `/api` ke Laravel port 8000. Seeder hanya mengimpor katalog destinasi, bukan akun demo atau aktivitas sintetis, dan tidak menimpa konten yang sudah ada.

Untuk instalasi baru, buat admin melalui `php artisan takono:admin email@example.com --name="Admin TAKONO"`. Password diminta secara tersembunyi. Admin dapat membuat manager/government dan menetapkan destinasi manager. Registrasi publik hanya membuat traveler. Akun lama tidak dihapus; ganti password default lama sebelum produksi.

Seeder sengaja tidak membuat pengguna atau password bawaan. Alur awal yang aman adalah:

1. Jalankan `php artisan db:seed` untuk mengisi katalog awal.
2. Buat satu Admin menggunakan `php artisan takono:admin`.
3. Login sebagai Admin, pilih **Tambah pengguna**, lalu buat akun Pemerintah atau Pengelola.
4. Untuk Pengelola, pilih destinasi pada field **Destinasi penugasan**. Tanpa penugasan ini, API Pengelola akan menjawab 403.

Pada lingkungan kerja ini, akun Manager lokal sudah ditugaskan ke Taman Bungkul melalui administrasi lokal. Kredensial lokal lama bukan bagian dari seeder dan tidak boleh dipakai sebagai kredensial produksi.

## API dan keamanan

Lihat kontrak aktual di `routes/api.php` atau `php artisan route:list --path=api`.

- Auth: register, login, logout, current user; tanpa role switching demo.
- Traveler: destinasi, rekomendasi, QR token, kuis, ledger, album, event, local discovery, reward redemption.
- Manager: profile destinasi dan CRUD explore-points, events, rewards, local-discoveries. Ownership diperiksa server.
- Government: dashboard, destination performance, insights, report JSON dari aktivitas tersimpan; read-only.
- Admin: users, roles, aktivasi akun, assignment manager, destinasi, audit logs.

Points dihitung server. Kredit aktivitas idempotent; redemption memakai transaction, row locks, request ID unik, dan snapshot syarat reward. Soft delete menjaga referensi riwayat konten.

QR dibuka melalui kamera ponsel atau kode/link dimasukkan ke formulir. Smart Guide menggunakan lokasi jika diizinkan pengguna; garis navigasi merupakan perkiraan garis langsung, bukan rute jalan terverifikasi.

## Verifikasi

`php artisan test` memakai MySQL yang dikonfigurasi. Gunakan database pengujian tersendiri untuk CI. Tes platform membatalkan transaksi fixture; tes concurrency membuat fixture terisolasi lalu membersihkannya. Jangan menjalankan tes pada produksi. Jalankan juga `php artisan migrate:status`, `php artisan route:list`, `npm run lint`, dan `npm run build` dari folder yang sesuai.

Untuk audit tampilan lokal, jalankan frontend dan API kemudian `TAKONO_TEST_PASSWORD=... npm run test:browser`. Tanpa password, audit hanya memeriksa halaman publik. Screenshot dan hasil audit ditulis ke `/tmp/takono-phase4-audit`.

## Deployment

Serve Laravel dari folder `public/` melalui PHP, bukan development server. Build React dan serve `dist/` sebagai static frontend. Gunakan reverse proxy `/api` ke Laravel, atau set `VITE_API_URL` ke origin Laravel sebelum build dan izinkan origin frontend melalui `CORS_ALLOWED_ORIGINS`. Gunakan HTTPS, `APP_DEBUG=false`, database user terbatas, backup, dan writable storage/cache. Tidak memerlukan Node/Express sebagai backend produksi.

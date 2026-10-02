# Deployment TAKONO di VPS

Panduan ini adalah runbook deployment **React/Vite + Laravel + MySQL** TAKONO pada VPS Linux menggunakan Nginx, PHP-FPM, dan HTTPS. Arsitektur ini cocok untuk VPS Jagoan Hosting maupun VPS Ubuntu lain yang memberi akses SSH/root.

Referensi panel dan layanan VPS Jagoan Hosting: [Panduan Lengkap VPS Hosting](https://www.jagoanhosting.com/tutorial/layanan-jagoan-hosting/panduan-lengkap-vps-hosting). Panduan ini sengaja memakai Nginx langsung agar konfigurasi aplikasi, keamanan, dan pembaruan lebih dapat dikendalikan daripada mengandalkan development server.

> Jangan menjalankan perintah `migrate:fresh`, `db:seed`, atau `DemoAccountSeeder` pada database production kecuali memang ingin menghapus/mengisi ulang data. Backup terlebih dahulu.

## 1. Arsitektur production

Contoh domain:

```text
https://takono.example.id       → frontend React statis (folder dist/)
https://api.takono.example.id   → Laravel API (folder laravel/public/)
```

Browser hanya berbicara melalui HTTPS. Frontend memanggil `https://api.takono.example.id/api/...`; Laravel, MySQL, dan PHP-FPM berada di VPS yang sama. QR kamera pada browser produksi memerlukan HTTPS, sehingga sertifikat TLS bukan opsional.

## 2. Sebelum mulai

Siapkan hal berikut.

- VPS Ubuntu 22.04/24.04 dengan akses SSH dan IP publik.
- Domain utama serta subdomain API.
- A record `takono.example.id` dan `api.takono.example.id` menuju IP VPS.
- Repository GitHub/Git yang dapat diakses VPS.
- Akun MySQL production serta password yang kuat.
- Google OAuth Client ID bila ingin mengaktifkan Login Google.

Gunakan nilai domain asli Anda pada semua contoh. Jangan gunakan `takono.example.id` secara harfiah.

## 3. Hardening awal VPS

Masuk sebagai root melalui SSH, perbarui sistem, lalu buat user deploy non-root.

```bash
apt update && apt upgrade -y
apt install -y nginx mysql-server git curl unzip ufw
adduser takono
usermod -aG sudo takono
```

Pasang SSH public key untuk user `takono`, kemudian nonaktifkan login password/root melalui SSH **setelah** key tersebut sudah berhasil diuji dari terminal lain. Aktifkan firewall minimum:

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

Port database tidak perlu dibuka ke internet bila MySQL berada pada VPS yang sama.

## 4. Instal runtime aplikasi

Pasang PHP 8.2+ beserta ekstensi Laravel/MySQL dan Node.js LTS. Paket persis dapat berbeda menurut versi Ubuntu.

```bash
apt install -y php8.3-fpm php8.3-cli php8.3-mysql php8.3-mbstring \
  php8.3-xml php8.3-curl php8.3-zip php8.3-bcmath php8.3-intl

curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
```

Pasang Composer dari installer resminya dan pastikan versi runtime tersedia:

```bash
php -v
node -v
npm -v
composer --version
```

Jika VPS Jagoan Hosting memakai Webuzo, Node.js, PHP, database, domain, dan SSL juga dapat dikelola lewat panel. Namun document root API tetap harus menunjuk tepat ke `laravel/public`, bukan ke folder `laravel`.

## 5. Database MySQL production

Masuk ke MySQL sebagai administrator lalu buat database dan user terpisah untuk TAKONO.

```sql
CREATE DATABASE takono_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'takono_app'@'localhost' IDENTIFIED BY 'GANTI_DENGAN_PASSWORD_PANJANG_UNIK';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP ON takono_production.* TO 'takono_app'@'localhost';
FLUSH PRIVILEGES;
```

Simpan password database hanya di file environment server, password manager, atau secret manager; jangan masukkan ke Git.

## 6. Ambil source code dan pasang dependency

Jalankan sebagai user `takono`.

```bash
sudo -iu takono
mkdir -p /var/www
cd /var/www
git clone https://github.com/ganendra0/takono.git takono
cd /var/www/takono
git checkout takono-laravel

npm ci
cd laravel
composer install --no-dev --optimize-autoloader
```

Jika repository private, gunakan deploy key read-only atau token akses terbatas. Jangan memasukkan personal access token ke URL remote Git.

## 7. Konfigurasi Laravel production

Buat file environment di `/var/www/takono/laravel/.env` dari `.env.example`.

```bash
cd /var/www/takono/laravel
cp .env.example .env
php artisan key:generate --force
```

Isi nilai penting berikut. Ganti semua placeholder.

```env
APP_NAME="TAKONO"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.takono.example.id
APP_TIMEZONE=Asia/Jakarta

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=takono_production
DB_USERNAME=takono_app
DB_PASSWORD=GANTI_DENGAN_PASSWORD_DATABASE

CORS_ALLOWED_ORIGINS="https://takono.example.id"
GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxx.apps.googleusercontent.com

SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

Catatan:

- `APP_DEBUG=false` wajib di production.
- Hanya tuliskan domain HTTPS nyata pada `CORS_ALLOWED_ORIGINS`; jangan memakai `*`.
- Bila tidak memakai Google login, kosongkan `GOOGLE_CLIENT_ID`. Tombol Google akan tetap memberi arahan konfigurasi dan tidak membuka autentikasi palsu.
- Pada Google Cloud Console, tambahkan `https://takono.example.id` ke **Authorized JavaScript origins**.

Atur permission Laravel. Sesuaikan user group bila Nginx/PHP-FPM menggunakan user selain `www-data`.

```bash
cd /var/www/takono
sudo chown -R takono:www-data laravel/storage laravel/bootstrap/cache
sudo chmod -R ug+rwx laravel/storage laravel/bootstrap/cache
```

Lalu jalankan migrasi yang aman untuk production dan cache konfigurasi:

```bash
cd /var/www/takono/laravel
php artisan migrate --force
php artisan optimize
php artisan route:cache
```

Jangan menjalankan `php artisan db:seed` pada server production secara otomatis. Buat administrator pertama dengan perintah proyek bila database memang masih kosong:

```bash
php artisan takono:admin admin@domain-anda.id --name="Admin TAKONO"
```

## 8. Build frontend

Frontend production tidak memakai Vite dev server. Dari root repository, build dengan alamat API HTTPS.

```bash
cd /var/www/takono
VITE_API_URL=https://api.takono.example.id npm run build
```

Hasilnya berada di `/var/www/takono/dist`. Variabel `VITE_API_URL` tertanam ketika build; jika domain API berubah, frontend harus dibangun ulang.

## 9. Konfigurasi Nginx

Buat dua server block. Ganti domain dan socket PHP apabila versi PHP berbeda.

`/etc/nginx/sites-available/takono-frontend`

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name takono.example.id;

    root /var/www/takono/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(?:css|js|jpg|jpeg|png|webp|svg|ico|woff2?)$ {
        try_files $uri =404;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }
}
```

`/etc/nginx/sites-available/takono-api`

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name api.takono.example.id;

    root /var/www/takono/laravel/public;
    index index.php;
    client_max_body_size 10m;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        try_files $uri =404;
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Aktifkan dan uji konfigurasi:

```bash
sudo ln -s /etc/nginx/sites-available/takono-frontend /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/takono-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 10. HTTPS dengan Let's Encrypt

Setelah DNS sudah mengarah ke VPS dan kedua virtual host HTTP dapat diakses, pasang Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d takono.example.id -d api.takono.example.id
sudo systemctl enable --now certbot.timer
sudo certbot renew --dry-run
```

Jangan mengaktifkan `VITE_API_URL=https://...` sebelum sertifikat API valid, karena browser akan menolak mixed content atau sertifikat yang bermasalah.

## 11. Pemeriksaan sebelum go-live

Jalankan dari server:

```bash
curl -I https://takono.example.id
curl -i https://api.takono.example.id/api/destinations
cd /var/www/takono/laravel
php artisan about --only=environment
php artisan migrate:status
```

Lalu lakukan pemeriksaan manual dari browser HTTPS:

1. Daftar/login traveler, kemudian pastikan Scan QR meminta login bila belum ada sesi.
2. Scan QR pintu masuk, Explore Point, event, jawab kuis, dan akhiri perjalanan.
3. Pastikan Album, poin, rating UMKM, dan voucher QR traveler tampil benar.
4. Login pengelola: ubah konten sendiri, pastikan konten tujuan lain tidak dapat diakses.
5. Login tenant: pindai voucher active sekali, lalu pastikan pemindaian kedua ditolak.
6. Login Government dan Super Admin: cek data, role, serta audit log.
7. Uji tampilan pada layar 360px, tablet, dan desktop; tidak boleh ada scroll horizontal.

## 12. Rilis pembaruan berikutnya

Sebelum deploy, backup database. Lalu jalankan sebagai user `takono`:

```bash
cd /var/www/takono
git fetch origin
git checkout takono-laravel
git pull --ff-only origin takono-laravel

npm ci
VITE_API_URL=https://api.takono.example.id npm run build

cd laravel
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan optimize
```

Jika update gagal, jangan melakukan `git reset --hard` secara spontan pada server. Catat commit yang berjalan, pulihkan dari backup/commit sebelumnya melalui prosedur release yang disetujui, lalu investigasi migrasi dan log.

## 13. Backup, log, dan operasional

Backup database setiap hari dan simpan salinan di lokasi berbeda dari VPS. Contoh backup manual:

```bash
mysqldump --single-transaction -u takono_app -p takono_production | gzip > /var/backups/takono-$(date +%F).sql.gz
```

Tambahkan cron sebagai user `takono` untuk scheduler Laravel, meskipun versi saat ini memakai queue `sync`:

```cron
* * * * * cd /var/www/takono/laravel && php artisan schedule:run >> /dev/null 2>&1
```

Lokasi diagnosis utama:

```text
/var/www/takono/laravel/storage/logs/laravel.log
/var/log/nginx/access.log
/var/log/nginx/error.log
```

Pantau kapasitas disk, penggunaan RAM/CPU, masa berlaku SSL, status backup, dan error login/API. Jangan mencatat token Sanctum, password, kode voucher aktif, atau isi `.env` ke log aplikasi.

## 14. Checklist keamanan

- [ ] SSH key-only dan login root via password dimatikan setelah key diuji.
- [ ] UFW hanya membuka SSH, HTTP, dan HTTPS.
- [ ] MySQL tidak diekspos publik.
- [ ] `APP_DEBUG=false` dan `APP_KEY` unik.
- [ ] `.env` tidak masuk Git dan tidak dapat diakses Nginx.
- [ ] CORS hanya berisi origin frontend HTTPS yang sah.
- [ ] Semua domain memakai HTTPS valid.
- [ ] Password akun demo tidak dipakai di production.
- [ ] Backup database diuji proses restore-nya.
- [ ] Migrasi dijalankan dengan `--force`, bukan `migrate:fresh`.
- [ ] Reward production telah ditugaskan ke Tenant sebelum dapat diredeem.

## 15. Troubleshooting singkat

| Gejala | Pemeriksaan awal |
| --- | --- |
| Halaman putih setelah deploy | Pastikan `dist/` terbaru, `root` Nginx mengarah ke `dist`, dan `try_files` fallback ke `index.html`. |
| API 404 | Pastikan domain API memakai `laravel/public` dan blok PHP mengarah ke socket PHP-FPM yang benar. |
| CORS gagal | Cocokkan origin persis di `CORS_ALLOWED_ORIGINS`, lalu `php artisan optimize:clear` dan restart PHP-FPM. |
| QR kamera tidak aktif | Pastikan halaman dibuka lewat HTTPS, izin kamera browser aktif, dan perangkat memiliki kamera. |
| Laravel 500 | Cek `storage/logs/laravel.log`, permission `storage`/`bootstrap/cache`, serta isi `.env`. |
| Google login gagal | Periksa `GOOGLE_CLIENT_ID` dan Authorized JavaScript origin di Google Cloud Console. |
| Voucher tidak dapat divalidasi | Pastikan status voucher aktif, belum kedaluwarsa, belum pernah dipakai, dan reward ditugaskan ke akun tenant yang sedang login. |


# TAKONO — Ringkasan Produk, Arsitektur, dan Alur Sistem

Dokumen ini menjelaskan TAKONO sebagai aplikasi tourism-tech: apa yang dikerjakan setiap peran, bagaimana data mengalir, serta komponen teknis yang menjalankannya. Panduan instalasi dan akun demo tersedia di [README utama](../README.md).

## 1. Tujuan produk

TAKONO membantu wisatawan menikmati destinasi secara mandiri dan terarah. Pengalaman dimulai saat wisatawan tiba di lokasi, memindai QR pintu masuk, lalu menggunakan Smart Guide untuk menemukan Explore Point, membaca cerita, mengikuti kuis, mengumpulkan poin, mengikuti event, dan menemukan usaha lokal.

TAKONO merekam **aktivitas di aplikasi**, bukan jumlah seluruh pengunjung fisik suatu tempat. Karena itu dashboard pemerintah tidak mengklaim data keramaian, kepadatan, atau total pengunjung destinasi.

Demo saat ini menggunakan dua destinasi Surabaya:

- Taman Bungkul
- Tugu Pahlawan Surabaya

## 2. Peran pengguna

| Peran | Tujuan | Akses utama |
| --- | --- | --- |
| Traveler | Menjelajah destinasi | QR, Smart Guide, Explore Point, kuis, poin, reward, event, UMKM, Album Jelajah |
| Destination Manager | Mengelola satu destinasi yang ditugaskan | Profil destinasi, Explore Point, urutan rute, event, reward, Local Discovery, QR konten |
| Government | Melihat intelligence aktivitas TAKONO | Dashboard agregat, tren, insight, report; tanpa perubahan konten |
| Super Admin | Mengelola platform | Pengguna, role, status akun, assignment pengelola, destinasi, audit log |

Hak akses diperiksa Laravel pada setiap endpoint. Menyembunyikan tombol di UI bukan satu-satunya mekanisme keamanan.

## 3. Arsitektur teknis

```text
Browser
  │
  ├─ React 19 + TypeScript + Tailwind + Vite
  │   ├─ Halaman publik
  │   ├─ Aplikasi Traveler
  │   ├─ Portal Pengelola
  │   ├─ Portal Pemerintah
  │   └─ Portal Admin
  │
  └─ /api (Vite proxy saat development)
        │
        ├─ Laravel REST API
        │   ├─ Sanctum bearer token authentication
        │   ├─ Role middleware dan ownership policy
        │   ├─ Validasi request dan audit log
        │   └─ Service poin, perjalanan, katalog, dan insight
        │
        └─ MySQL
            ├─ Konten destinasi dan akun
            ├─ Aktivitas traveler dan buku kas poin
            ├─ Perjalanan/album
            └─ Audit log
```

Runtime utama adalah Laravel + MySQL. Tidak ada Express atau database in-memory yang dipakai sebagai backend aplikasi.

### Frontend

- **React + TypeScript**: UI dan hash routing (`#/...`).
- **Vite**: development server, build, dan proxy `/api` ke Laravel.
- **Tailwind CSS**: desain responsif dan sistem visual.
- **Leaflet**: peta Smart Guide.
- **jsQR**: pembacaan QR dari kamera/foto/kode.
- **Lucide**: ikon antarmuka.

Klien API utama berada pada `src/lib/api.ts`. Komponen dan halaman menggunakan data API yang sama; tidak ada sumber data mock terpisah untuk manager dan traveler.

### Backend

- **Laravel REST API** pada `laravel/routes/api.php`.
- **Laravel Sanctum** untuk token login.
- **MySQL** sebagai source of truth.
- **Form Request validation** untuk input pengelola/admin.
- **Policy `manage-destination`** untuk memastikan manager hanya dapat mengelola destinasi miliknya.
- **Database transaction dan row lock** untuk operasi yang membutuhkan konsistensi, terutama redemption reward dan pembaruan poin.

## 4. Struktur halaman dan URL

### Halaman publik

| URL hash | Fungsi |
| --- | --- |
| `#/` | Beranda TAKONO |
| `#/destinations` | Daftar destinasi publik |
| `#/destinations/{slug}` | Informasi publik satu destinasi |
| `#/how-it-works` | Cara kerja |
| `#/about` | Tentang TAKONO |
| `#/login` | Login/register dan Google Sign-In bila dikonfigurasi |

### Ruang personal traveler

Ruang personal tidak mewakili satu destinasi tertentu.

| URL hash | Fungsi |
| --- | --- |
| `#/app` | Beranda personal dan tombol Scan QR Destinasi |
| `#/app/album` | Album semua perjalanan yang sudah diakhiri |
| `#/app/points` | Saldo dan riwayat poin |
| `#/app/profile` | Profil dan voucher reward |

### Mode kunjungan destinasi

Mode ini dibuka setelah QR pintu masuk dipindai, bukan hanya karena traveler membuka halaman publik.

| URL hash | Fungsi |
| --- | --- |
| `#/scan/{kode-destinasi}` | Halaman konfirmasi sebelum memulai perjalanan |
| `#/app/destination/{slug}` | Beranda kunjungan destinasi |
| `#/app/destination/{slug}/smart-guide` | Rekomendasi dan peta Smart Guide |
| `#/app/destination/{slug}/explore` | Daftar Explore Point pada destinasi |
| `#/app/destination/{slug}/explore/{slug-titik}` | Cerita, materi, dan kuis satu Explore Point |
| `#/app/destination/{slug}/local-discovery` | UMKM/Local Discovery |
| `#/app/destination/{slug}/events` | Event destinasi |
| `#/app/destination/{slug}/rewards` | Reward yang dapat ditukar |

### Portal operasional

| URL hash | Peran |
| --- | --- |
| `#/manager` | Destination Manager dan Super Admin |
| `#/government` | Government dan Super Admin |
| `#/admin` | Super Admin |

## 5. Alur traveler

### A. Masuk aplikasi

1. Traveler dapat melihat beranda dan detail destinasi tanpa login.
2. Traveler login atau register dengan email/password. Google Sign-In tersedia jika `GOOGLE_CLIENT_ID` telah diisi.
3. Setelah login, traveler masuk ke `#/app`, yaitu ruang personal.
4. Dari sana traveler memilih **Scan QR Destinasi** saat sudah berada di lokasi.

### B. Memulai kunjungan

1. QR pintu masuk berisi kode destinasi, misalnya `BUNGKUL`.
2. API memvalidasi kode dan menampilkan halaman selamat datang `#/scan/{kode}`.
3. Traveler menekan **Mulai Jelajah Destinasi**.
4. Backend membuat atau melanjutkan `user_destination_journeys` berstatus `active`.
5. Traveler masuk ke mode kunjungan `#/app/destination/{slug}`.

Satu traveler dapat mempunyai perjalanan aktif/selesai untuk banyak destinasi. Album menyimpan perjalanan yang sudah diakhiri.

### C. Explore Point dan kuis

1. Traveler membuka Smart Guide atau daftar Explore Point.
2. Traveler mendatangi titik fisik dan memindai QR Explore Point.
3. Backend memeriksa bahwa ada perjalanan aktif pada destinasi tersebut.
4. Aktivitas `explore_point_discovered` dicatat sekali; pemindaian ulang tidak memberikan poin lagi.
5. Traveler membaca cerita/materi dan menjawab kuis bila tersedia.
6. Jawaban benar dapat memberi poin satu kali. Pengiriman ulang tidak menghasilkan poin tak terbatas.

### D. Event, usaha lokal, dan reward

- **Event**: Manager membuat event dan QR partisipasi. Traveler memindainya di lokasi event untuk merekam keikutsertaan satu kali.
- **Local Discovery**: Traveler mengunjungi UMKM/tenant lokal; aktivitas dan poin hanya diberikan oleh backend.
- **Reward**: Traveler menukar poin dengan voucher jika reward aktif, belum kedaluwarsa, kuota tersedia, dan saldo cukup.

### E. Mengakhiri perjalanan dan Album Jelajah

1. Traveler boleh memilih **Akhiri perjalanan & simpan ke Album** kapan saja; tidak wajib menyelesaikan semua Explore Point.
2. Backend menyimpan jumlah titik yang telah dan belum dikunjungi pada perjalanan tersebut.
3. Aplikasi menampilkan ringkasan: Explore Point, kuis, UMKM, dan poin dari aktivitas TAKONO.
4. Traveler kembali ke `#/app`.
5. Kartu destinasi di Album membuka detail perjalanan: titik yang dikunjungi, titik yang belum dikunjungi, dan seluruh aktivitas pada destinasi tersebut.

## 6. Smart Guide dan urutan rute

Smart Guide adalah rekomendasi berbasis aturan, bukan AI generatif. Input rekomendasi:

- destinasi aktif;
- Explore Point yang telah/belum diselesaikan;
- kategori preferensi traveler bila diberikan;
- posisi pengguna bila izin lokasi tersedia;
- urutan rute yang ditetapkan pengelola.

Pengelola mengatur urutan melalui menu **Explore Points**, dengan tombol naik/turun. Urutan disimpan pada kolom `route_order` dan menjadi prioritas rute Smart Guide; preferensi dan jarak digunakan sebagai pertimbangan berikutnya.

Garis di peta adalah estimasi arah langsung, bukan navigasi jalan yang dijamin akurat seperti aplikasi peta komersial.

## 7. Alur pengelola destinasi

1. Admin menetapkan user manager ke satu `destination_id`.
2. Manager login dan membuka `#/manager`.
3. Setiap permintaan manager menggunakan destination assignment dari server.
4. Manager dapat:
   - memperbarui profil destinasi, galeri, lokasi, fasilitas, dan status publikasi;
   - membuat/edit/hapus Explore Point beserta mini kuis dan QR;
   - mengatur urutan rute Explore Point;
   - membuat/edit/hapus event dan QR partisipasi;
   - membuat/edit/hapus reward;
   - membuat/edit/hapus Local Discovery/UMKM.
5. Konten published/active tampil pada traveler dari API yang sama.

Manager A tidak dapat mengambil, mengubah, menghapus, maupun menyusun ulang konten milik destination B.

## 8. Alur pemerintah dan admin

### Government

Portal pemerintah hanya baca. Data yang tampil berupa aktivitas TAKONO, misalnya jumlah QR Explore Point, kuis selesai, event diikuti, reward ditukar, dan UMKM dikunjungi. Government tidak dapat mengubah konten ataupun akun.

### Super Admin

Admin dapat melihat dan mengelola pengguna, status aktif/nonaktif, peran, assignment manager, destinasi, serta audit log. Admin juga memiliki akses operasional untuk membantu mengelola konten destinasi bila diperlukan.

## 9. Model data utama

| Tabel | Isi | Hubungan penting |
| --- | --- | --- |
| `users` | Akun, role, assignment manager, saldo poin | Manager dapat memiliki `destination_id` |
| `destinations` | Identitas dan informasi destinasi | Memiliki banyak konten |
| `explore_points` | Titik cerita fisik, QR token, materi, koordinat, urutan | Milik satu destinasi; dapat punya satu kuis |
| `quizzes` | Pertanyaan dan jawaban kuis | Milik satu Explore Point |
| `destination_events` | Agenda/event dan QR partisipasi | Milik satu destinasi |
| `local_discoveries` | UMKM, kuliner, oleh-oleh, produk lokal | Milik satu destinasi |
| `rewards` | Reward, poin syarat, kuota, masa berlaku | Milik satu destinasi |
| `reward_redemptions` | Snapshot voucher yang ditukar traveler | Mengunci nilai reward saat redemption |
| `point_transactions` | Buku kas kredit/debit poin | Sumber saldo poin traveler |
| `user_activities` | Jejak aktivitas TAKONO | Dasar insight dan ringkasan perjalanan |
| `user_destination_journeys` | Perjalanan per traveler per destinasi | `active` atau `completed`, tampil di Album |
| `audit_logs` | Jejak perubahan operasional | Mencatat aksi manager/admin |
| `personal_access_tokens` | Token Sanctum | Sesi API pengguna |

## 10. Endpoint API penting

Semua endpoint menggunakan prefix `/api`. Kontrak rute aktual ada di `laravel/routes/api.php`.

| Kelompok | Contoh endpoint | Keterangan |
| --- | --- | --- |
| Public | `GET /destinations`, `GET /destinations/{slug}` | Katalog publik |
| Auth | `POST /auth/login`, `POST /auth/register`, `POST /auth/google` | Login/register |
| QR perjalanan | `GET /scan/{code}`, `POST /scan/{code}/journey` | Validasi QR destinasi dan mulai perjalanan |
| Traveler | `POST /scan/explore/{token}`, `POST /explore-points/{id}/quiz/submit` | Explore Point dan kuis |
| Album | `GET /me/album`, `GET /me/album/{destination}` | Daftar dan detail perjalanan tersimpan |
| Reward | `POST /rewards/{id}/redeem` | Penukaran voucher |
| Manager | `/manager/explore-points`, `/manager/events`, `/manager/rewards`, `/manager/local-discoveries` | CRUD konten berdasarkan ownership |
| Rute | `PUT /manager/explore-points/route-order` | Simpan urutan Smart Guide |
| Government | `/government/dashboard`, `/government/insights`, `/government/reports` | Analytics read-only |
| Admin | `/admin/dashboard`, `/admin/users`, `/admin/destinations` | Manajemen platform |

## 11. Keamanan dan konsistensi data

- Token Sanctum dikirim sebagai bearer token.
- Role middleware menolak endpoint yang tidak sesuai peran.
- Destination policy memeriksa ownership manager di server.
- Input konten, koordinat, status, kuota, periode reward, dan kuis divalidasi di Laravel.
- Frontend tidak menentukan jumlah poin.
- Kredit poin menggunakan penanda aktivitas agar satu Explore Point/kuis/event tidak dapat dipanen berulang.
- Redemption reward memakai database transaction, row lock, request ID, saldo non-negatif, dan pemeriksaan kuota/validitas.
- Edit atau penghapusan reward tidak mengubah snapshot voucher yang telah ditukar.
- Soft delete pada konten menjaga histori aktivitas lama tetap konsisten.
- Audit log mencatat perubahan operasional.
- QR token sensitif tidak dikirim ke katalog publik; QR hanya ditampilkan di portal manager yang berwenang.

## 12. Data demo dan seeder

`laravel/database/data/catalog.json` adalah katalog demo yang saling terhubung untuk Taman Bungkul dan Tugu Pahlawan: profil destinasi, Explore Point, kuis, event, UMKM, dan reward.

Seeder utama:

```bash
cd laravel
php artisan db:seed
```

Seeder akun demo menggunakan `DemoAccountSeeder`; instruksi macOS/Linux dan Windows PowerShell ada di README utama. Seeder akun demo untuk lokal mengatur traveler, dua manager, government, dan super admin.

## 13. Menjalankan dan memverifikasi

```bash
# root proyek, terminal 1
npm run api

# root proyek, terminal 2
npm run dev

# pemeriksaan frontend
npm run lint
npm run build

# pemeriksaan Laravel
cd laravel
php artisan test
php artisan migrate:status
```

Frontend development tersedia pada `http://localhost:3000`; API Laravel pada `http://127.0.0.1:8000`. Vite meneruskan `/api` ke backend sehingga browser tidak perlu mengakses `localhost:8000` secara langsung saat memakai jaringan lokal.

## 14. Batasan yang perlu diketahui

- TAKONO mengukur aktivitas pengguna aplikasi, bukan keseluruhan kunjungan fisik.
- Perkiraan rute Smart Guide bukan rute jalan real-time.
- Kamera browser biasanya memerlukan HTTPS saat dibuka dari perangkat lain melalui alamat IP; formulir tempel kode/link QR tetap tersedia sebagai fallback.
- Google Sign-In harus dikonfigurasi dengan `GOOGLE_CLIENT_ID` dan origin yang benar.
- Akun dan password demo hanya untuk lingkungan lokal/demo, bukan production.


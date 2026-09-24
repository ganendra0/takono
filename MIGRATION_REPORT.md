# TAKONO migration report — 24 September 2026

## Migrated

Runtime aplikasi kini React/TypeScript/Tailwind → Laravel REST API → MySQL. UI React dipertahankan. Auth, destinasi, Explore Point/QR/quiz, points, Smart Guide, events, rewards/redemption, Local Discovery, album, Manager CRUD, Government analytics/report JSON, dan Admin user/role management memakai Laravel.

## Laravel APIs, models, database

35 route terdaftar di `laravel/routes/api.php`. Manager menggunakan route resource generik untuk explore-points, events, rewards, local-discoveries. Government menyediakan dashboard/destinations/insights/reports. Admin menyediakan dashboard, create/update users, dan create destinations.

Controller domain existing diganti implementasi MySQL; AdminController, Form Requests, middleware Role, DestinationPolicy, Api serializer, Catalog, PointService, InsightService, dan AuditLog ditambahkan. Model User, ExplorePoint, DestinationEvent, LocalDiscovery, Reward, RewardRedemption, dan PointTransaction diperbarui.

Migration secure_platform sudah diterapkan: active users, foreign keys/indexes, Sanctum tokens, content soft deletes, status/validity, unique ledger claim keys, idempotency redemption, snapshot terms, audit logs. Seeder mengimpor katalog saja, tanpa aktivitas sintetis atau akun demo baru.

Migration balance_ledger masih PENDING: menambahkan catatan selisih saldo lama dan ledger; tidak mengubah saldo. Eksekusinya ditolak pemeriksaan izin otomatis dan belum diulang. Tidak ada akun uji admin permanen yang dibuat.

## React changes

Central API client di `src/lib/api.ts`, password login/register dan logout Sanctum, route guards, destination context dinamis, CRUD forms, QR images/link input, feedback/loading/empty/error states. Smart Guide mengambil Explore Points runtime yang sama, preference/completion/location untuk rekomendasi rule-based. Government tidak lagi memakai angka pengunjung/revenue sintetis. Admin memakai users dan audit logs nyata.

## Express removed

`server.ts`, `src/server/routes.ts`, `src/server/database.ts`, seluruh service Express, RoleSwitcher, dan DemoDataNotice dihapus. Dependency langsung express, @types/express, tsx, dotenv dihapus; npm scripts kini Vite + Laravel. Pencarian runtime source tidak menemukan Express/demo role-switch/simulated scan. Optional peer metadata tsx dari Vite di lockfile bukan backend runtime.

## Security

Password hash verification, Sanctum, active-account checks, role middleware, destination ownership gate, request validation, server-authoritative points, idempotent QR/quiz/activity credits, transactional locked redemption, immutable reward snapshots. Tes concurrency menemukan pembacaan quota stale; validasi diperbaiki agar membaca row reward yang sudah terkunci. Perubahan role/active/destination/password membatalkan token akun terkait.

## Executed tests

- `php artisan route:list --path=api`: 35 routes.
- `php artisan migrate:status`: 2 ran, balance_ledger pending.
- `php artisan test`: 6 passed, 129 assertions, MySQL nyata, termasuk dua redemption paralel untuk quota terakhir.
- Cakupan API: auth/roles, Manager→Traveler content roundtrip, QR/quiz/ledger/album, events/local activities, reward validity/quota/idempotency/snapshots, cross-destination denial, government read-only/report, admin assignment/deactivation.
- Pengulangan awal tes gagal koneksi MySQL karena sandbox (0 assertions); setelah izin koneksi lokal, seluruh tes di atas lolos.
- `npm run lint` (TypeScript check): passed.
- `npm run build`: passed.
- `git diff --check`: passed.
- `npm ls express @types/express tsx --depth=0`: empty.
- Browser smoke check: traveler login dan Smart Guide; halaman Government tanpa sesi menampilkan login. Belum seluruh CRUD/role diuji lewat browser dan belum ada automated browser E2E suite.

## Remaining issues / boundaries

- Rekonsiliasi ledger saldo lama memerlukan persetujuan; sebelum diterapkan, total history akun lama bisa berbeda dari saldo tersimpan.
- Akun default lama dipertahankan: ganti password sebelum produksi. Assignment manager lama yang kosong perlu ditetapkan Admin.
- QR kamera memakai kamera native perangkat atau input link/token; bukan scanner video tertanam. Belum diuji pada kamera fisik.
- Smart Guide menampilkan arah garis langsung, bukan navigasi jalan tervalidasi.
- Foto existing sekitar 1.2 MB per gambar; optimasi gambar masih disarankan.
- Deployment produksi dan pemeriksaan visual semua ukuran layar belum dilakukan.

Panduan menjalankan dan deployment: `laravel/README.md`.

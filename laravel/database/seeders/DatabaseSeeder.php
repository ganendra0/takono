<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Destination;
use App\Models\ExplorePoint;
use App\Models\Quiz;
use App\Models\DestinationEvent;
use App\Models\LocalDiscovery;
use App\Models\Reward;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Demo Users
        User::create([
            'name' => 'Budi Santoso',
            'email' => 'traveler@takono.id',
            'password' => Hash::make('takono123456'),
            'role' => 'traveler',
            'points_balance' => 85,
        ]);

        User::create([
            'name' => 'Maya Indah (Pengelola KBS)',
            'email' => 'manager@kbs.id',
            'password' => Hash::make('takono123456'),
            'role' => 'destination_manager',
            'points_balance' => 0,
        ]);

        User::create([
            'name' => 'Drs. Hendra W. (Dinas Pariwisata)',
            'email' => 'dinas@surabaya.go.id',
            'password' => Hash::make('takono123456'),
            'role' => 'government',
            'institution' => 'Dinas Kebudayaan & Pariwisata Kota Surabaya',
            'points_balance' => 0,
        ]);

        User::create([
            'name' => 'Admin Platform TAKONO',
            'email' => 'admin@takono.id',
            'password' => Hash::make('takono123456'),
            'role' => 'super_admin',
            'points_balance' => 0,
        ]);

        // 2. Seed Destination: Kebun Binatang Surabaya
        $destination = Destination::create([
            'name' => 'Kebun Binatang Surabaya (KBS)',
            'code' => 'KBS',
            'slug' => 'kebun-binatang-surabaya',
            'tagline' => 'Wisata Edukasi, Konservasi Satwa, & Cagar Budaya Sejak 1916',
            'description' => 'Didirikan pada tanggal 31 Agustus 1916 dengan nama Soerabaiasche Planten-en Dierentuin, Kebun Binatang Surabaya merupakan salah satu kebun binatang tertua dan terlengkap di Asia Tenggara. Menyimpan lebih dari 200 spesies dan lebih dari 2.000 satwa langka.',
            'hero_image' => '/src/assets/images/hero_takono_tourism_1790168118274.jpg',
            'gallery' => [
                '/src/assets/images/kbs_surabaya_zoo_1790168132396.jpg',
                '/src/assets/images/kbs_elephant_exhibit_1790168144417.jpg',
                '/src/assets/images/kbs_aquarium_building_1790168158103.jpg',
            ],
            'address' => 'Jl. Setail No.1, Darmo, Kec. Wonokromo, Surabaya',
            'city' => 'Surabaya',
            'province' => 'Jawa Timur',
            'latitude' => -7.295843,
            'longitude' => 112.736528,
            'boundary_coordinates' => [
                [-7.2935, 112.7340],
                [-7.2935, 112.7395],
                [-7.2985, 112.7395],
                [-7.2985, 112.7340],
            ],
            'operating_hours' => 'Setiap Hari, 08.00 - 16.00 WIB',
            'ticket_info' => 'Rp 15.000 / orang (Pembayaran Non-Tunai / QRIS)',
            'contact_phone' => '(031) 5678210',
            'contact_email' => 'info@surabayazoo.co.id',
            'facilities' => [
                ['id' => 'f1', 'name' => 'Musholla Al-Ikhlas', 'icon' => 'moon', 'latitude' => -7.2952, 'longitude' => 112.7368],
                ['id' => 'f2', 'name' => 'Toilet & Ruang Laktasi', 'icon' => 'user', 'latitude' => -7.2961, 'longitude' => 112.7355],
                ['id' => 'f3', 'name' => 'Pos P3K & Medis', 'icon' => 'heart', 'latitude' => -7.2948, 'longitude' => 112.7360],
                ['id' => 'f4', 'name' => 'Food Court & UMKM Sentra', 'icon' => 'coffee', 'latitude' => -7.2970, 'longitude' => 112.7375],
            ],
            'status' => 'published',
            'is_demo' => true,
        ]);

        // 3. Seed Explore Points
        $ep1 = ExplorePoint::create([
            'destination_id' => $destination->id,
            'name' => 'Aquarium Air Tawar Bersejarah 1922',
            'slug' => 'aquarium-air-tawar-bersejarah-1922',
            'category' => 'Sejarah',
            'description' => 'Bangunan akuarium bersejarah bergaya kolonial yang telah beroperasi sejak masa Hindia Belanda.',
            'story' => 'Diresmikan pada tahun 1922, paviliun akuarium KBS dirancang dengan lorong bawah tanah unik yang menjaga suhu air tetap sejuk secara alami.',
            'educational_content' => 'Menampilkan keanekaragaman fauna air tawar endemik sungai-sungai Indonesia seperti Ikan Arwana Papua dan Belida Jawa.',
            'fun_facts' => [
                'Merupakan salah satu bangunan akuarium publik tertua di Asia Tenggara yang masih aktif beroperasi.',
                'Kaca akuarium tebal asli buatan Eropa abad ke-20 masih dipertahankan hingga kini.',
            ],
            'image' => '/src/assets/images/kbs_aquarium_building_1790168158103.jpg',
            'latitude' => -7.2961,
            'longitude' => 112.7360,
            'estimated_duration' => '15-20 menit',
            'difficulty' => 'Mudah',
            'secure_token' => 'ep_kbs_aquarium_1922',
            'points_reward' => 25,
            'status' => 'published',
        ]);

        Quiz::create([
            'explore_point_id' => $ep1->id,
            'title' => 'Kuis Warisan Sejarah Aquarium KBS',
            'questions' => [
                [
                    'id' => 'q1',
                    'question' => 'Pada tahun berapakah bangunan Aquarium Bersejarah KBS pertama kali diresmikan?',
                    'options' => [
                        ['id' => 'o1', 'text' => '1910'],
                        ['id' => 'o2', 'text' => '1922'],
                        ['id' => 'o3', 'text' => '1945'],
                    ],
                    'correctOptionId' => 'o2',
                    'explanation' => 'Aquarium KBS diresmikan pada tahun 1922 dan merupakan cagar budaya aktif tertua.',
                    'points' => 25,
                ],
            ],
        ]);

        // 4. Seed Local Discoveries (UMKM)
        LocalDiscovery::create([
            'destination_id' => $destination->id,
            'name' => 'Rawon Kalkulator Taman Bungkul',
            'category' => 'Kuliner',
            'description' => 'Warung rawon legendaris dengan kuah kluwek hitam pekat dan daging sapi empuk melimpah tepat di seberang KBS.',
            'image' => '/src/assets/images/hero_takono_tourism_1790168118274.jpg',
            'address' => 'Sentra Kuliner Taman Bungkul, Jl. Raya Darmo, Surabaya',
            'latitude' => -7.2925,
            'longitude' => 112.7388,
            'operatingHours' => '10.00 - 22.00 WIB',
            'promotion' => 'Diskon 15% + Es Teh Manis Gratis untuk Penjelajah TAKONO',
            'reward_text' => 'Tunjukkan voucher aplikasi TAKONO kepada kasir saat pembayaran.',
            'status' => 'published',
            'points_reward' => 20,
        ]);

        // 5. Seed Rewards
        Reward::create([
            'destination_id' => $destination->id,
            'name' => 'Voucher Kuliner Rawon Kalkulator Rp 15.000',
            'category' => 'Kuliner',
            'partner' => 'Rawon Kalkulator Bungkul',
            'description' => 'Potongan langsung Rp 15.000 untuk pembelian menu makanan utama.',
            'image' => '/src/assets/images/hero_takono_tourism_1790168118274.jpg',
            'points_required' => 50,
            'quota' => 200,
            'stock' => 175,
            'valid_until' => '2026-12-31',
            'terms' => [
                'Dapat ditukarkan setiap hari saat jam operasional mitra.',
                'Tunjukkan kode voucher digital TAKONO sebelum melakukan transaksi.',
            ],
            'status' => 'active',
        ]);
    }
}

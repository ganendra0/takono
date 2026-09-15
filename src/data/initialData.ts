import { Destination, ExplorePoint, Quiz, DestinationEvent, DestinationReward } from '../types/destination';
import { UMKM } from '../types/umkm';
import { UserProfile } from '../types/roles';
import { QRCodeData } from '../types/qr';
import { Journey } from '../types/journey';
import { PointTransaction } from '../types/points';
import { AnalyticsEvent } from '../types/analytics';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-traveler-1',
    name: 'Ganendra Djawa',
    email: 'ganendradjawa@gmail.com',
    role: 'traveler',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    pointsBalance: 85,
  },
  {
    id: 'user-manager-1',
    name: 'Wayan Sudirga',
    email: 'wayan.sudirga@penglipuran.desa.id',
    role: 'manager',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    pointsBalance: 0,
    assignedDestinationId: 'dest-penglipuran',
  },
  {
    id: 'user-umkm-1',
    name: 'Ni Wayan Rai',
    email: 'loloh.cemcem.made@gmail.com',
    role: 'umkm',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    pointsBalance: 0,
    umkmId: 'umkm-loloh-made',
  },
  {
    id: 'user-gov-1',
    name: 'Dr. I Ketut Widana, M.Par',
    email: 'pariwisata.provinsi@bali.go.id',
    role: 'government',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    pointsBalance: 0,
    agencyName: 'Dinas Pariwisata & Ekonomi Kreatif Wilayah Bali-Jawa',
  },
  {
    id: 'user-admin-1',
    name: 'Super Administrator',
    email: 'admin@takono.id',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    pointsBalance: 0,
  },
];

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: 'dest-penglipuran',
    name: 'Desa Wisata Penglipuran',
    slug: 'desa-wisata-penglipuran',
    tagline: 'Desa Adat Terbersih Dunia berakar pada Filosofi Tri Hita Karana',
    description: 'Desa adat di dataran tinggi Bangli, Bali, yang tersohor dengan kelestarian arsitektur bambu tradisional, tata ruang linier tanpa kendaraan bermotor, dan hutan bambu suci yang menjadi paru-paru ekologis.',
    province: 'Bali',
    regency: 'Bangli',
    address: 'Jl. Penglipuran, Kubu, Kec. Bangli, Kabupaten Bangli, Bali 80611',
    status: 'published',
    managerId: 'user-manager-1',
    managerName: 'Wayan Sudirga',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80',
    ticketPriceIdr: 25000,
    openingHours: '08:00 - 18:30 WITA',
    connectedUmkmIds: ['umkm-loloh-made', 'umkm-kriya-bambu'],
    qrCodeId: 'QR-DEST-PENGLIPURAN',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-03-01T10:30:00Z',
  },
  {
    id: 'dest-prambanan',
    name: 'Taman Wisata Candi Prambanan',
    slug: 'candi-prambanan',
    tagline: 'Mahakarya Arsitektur Hindu Terbesar di Nusantara Warisan Abad ke-9',
    description: 'Kompleks percandian Hindu megah peninggalan Dinasti Sanjaya abad ke-9 Masehi, menampilkan relief epos Ramayana terpahat halus pada dinding candi utama Dewa Siwa.',
    province: 'DI Yogyakarta',
    regency: 'Sleman',
    address: 'Jl. Raya Solo - Yogyakarta No.16, Kranggan, Bokoharjo, Prambanan',
    status: 'published',
    managerId: 'user-manager-1',
    managerName: 'Bambang Prasetyo',
    heroImage: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&auto=format&fit=crop&q=80',
    ticketPriceIdr: 50000,
    openingHours: '06:30 - 17:00 WIB',
    connectedUmkmIds: ['umkm-batik-prambanan'],
    qrCodeId: 'QR-DEST-PRAMBANAN',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-02-20T14:15:00Z',
  },
  {
    id: 'dest-waerebo',
    name: 'Kampung Adat Wae Rebo',
    slug: 'kampung-adat-wae-rebo',
    tagline: 'Perkampungan Tradisional di Atas Awan dengan 7 Mbaru Niang',
    description: 'Desa adat terpencil di pegunungan Manggarai, Flores, NTT. Terkenal dengan 7 rumah kerucut tradisional Mbaru Niang yang sarat penghormatan leluhur dan alam.',
    province: 'Nusa Tenggara Timur',
    regency: 'Manggarai',
    address: 'Satar Lenda, Kecamatan Satar Mese Barat, Kabupaten Manggarai, NTT',
    status: 'draft', // DRAFT to test unpublished state flow
    managerId: 'user-manager-1',
    managerName: 'Fransiskus Jehamin',
    heroImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop&q=80',
    ticketPriceIdr: 325000,
    openingHours: '24 Jam (Perlu Konfirmasi Homestay)',
    connectedUmkmIds: ['umkm-kopi-waerebo'],
    qrCodeId: 'QR-DEST-WAEREBO',
    createdAt: '2026-02-01T11:00:00Z',
    updatedAt: '2026-02-25T16:00:00Z',
  },
];

export const INITIAL_EXPLORE_POINTS: ExplorePoint[] = [
  {
    id: 'pt-peng-1',
    destinationId: 'dest-penglipuran',
    name: 'Angkul-Angkul & Lorong Rerata Utama',
    sequenceOrder: 1,
    category: 'architecture',
    status: 'published',
    shortDescription: 'Gerbang tradisional seragam yang mencerminkan kesetaraan dan keharmonisan sosial.',
    story: 'Memasuki gerbang desa, mata Anda disambut oleh jajaran angkul-angkul (pintu gerbang pekarangan) yang berukuran seragam. Ini bukan sekadar estetika arsitektur, melainkan perwujudan filosofi Tri Hita Karana (Pawongan) di mana tiada satu warga pun yang menonjolkan kekayaan fisik di depan umum.',
    facts: [
      'Setiap pekarangan rumah memiliki pintu gerbang dengan dimensi yang sama persis.',
      'Dilarang menggunakan bahan sintetis seperti seng atau asbes untuk atap angkul-angkul.',
      'Lorong tengah sepanjang 500 meter dilarang dilintasi kendaraan bermotor apapun.',
    ],
    education: {
      culturalNorms: 'Ucapkan salam "Om Swastiastu" saat bertegur sapa dengan warga yang beraktivitas di halaman depan.',
      ecoGuidelines: 'Simpan sampah pribadi di saku atau tas jika belum menemukan tempat sampah terpilah.',
      etiquette: 'Berjalanlah dengan tenang di lorong tengah; jangan berteriak atau memutar musik keras.',
    },
    activity: 'Amati ukiran khas pada daun pintu bambu dan temukan papan nama silsilah keluarga di sebelah gerbang.',
    coordinates: { lat: -8.4526, lng: 115.3571 },
    locationName: 'Pintu Masuk Utama Penglipuran',
    estimatedMinutes: 15,
    completionPoints: 5,
    isManagerRecommended: true,
    imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&auto=format&fit=crop&q=80',
    qrCodeId: 'QR-POINT-PENG-1',
  },
  {
    id: 'pt-peng-2',
    destinationId: 'dest-penglipuran',
    name: 'Hutan Bambu Lindung Suci',
    sequenceOrder: 2,
    category: 'nature',
    status: 'published',
    shortDescription: 'Kawasan lindung 45 hektar yang memasok oksigen dan bahan ritual sakral.',
    story: 'Melangkah ke utara desa, Anda memasuki kanopi hijau teduh seluas 45 hektar. Hutan bambu ini disucikan oleh masyarakat adat Penglipuran sebagai "Parahyangan" dan penyerap air alami desa. Ada 15 varietas bambu langka yang dipelihara secara turun-temurun.',
    facts: [
      'Warga tidak boleh menebang sembarangan tanpa izin tetua adat (Bendesa Adat).',
      'Penebangan hanya diizinkan pada hari baik (Dewasa Ayu) sesuai penanggalan Saka.',
      'Kayu bambu yang ditebang wajib diganti dengan bibit baru.',
    ],
    education: {
      culturalNorms: 'Hormati area pura mini di dalam hutan yang diberi kain poleng (hitam-putih).',
      ecoGuidelines: 'Jangan memetik rebung (anak bambu) atau mengukir nama di batang bambu.',
      etiquette: 'Gunakan jalur setapak kayu yang telah disediakan untuk mencegah erosi tanah.',
    },
    activity: 'Dengarkan gemerisik daun bambu ditiup angin pegunungan dan hirup udara beroksigen tinggi.',
    coordinates: { lat: -8.4501, lng: 115.3582 },
    locationName: 'Zona Konservasi Utara',
    estimatedMinutes: 25,
    completionPoints: 5,
    isManagerRecommended: true,
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
    qrCodeId: 'QR-POINT-PENG-2',
  },
  {
    id: 'pt-peng-3',
    destinationId: 'dest-penglipuran',
    name: 'Bale Banjar & Sentra Kriya Tradisional',
    sequenceOrder: 3,
    category: 'craft',
    status: 'published',
    shortDescription: 'Balai musyawarah warga dan tempat perajin menganyam anyaman bambu khas Bangli.',
    story: 'Bale Banjar adalah jantung musyawarah demokratis Penglipuran. Di sekelilingnya, Anda dapat menjumpai ibu-ibu perajin yang terampil menyayat bilah bambu menjadi besek, topi caping, dan anyaman keranjang upacara bernilai seni tinggi.',
    facts: [
      'Sistem pengambilan keputusan di Bale Banjar wajib menggunakan musyawarah mufakat.',
      'Anyaman bambu Penglipuran dijemur secara alami tanpa pewarna kimia beracun.',
      'Sebagian hasil penjualan dialokasikan untuk kas desa dan perawatan fasilitas umum.',
    ],
    education: {
      culturalNorms: 'Duduklah dengan sopan jika memasuki area panggung musyawarah Bale Banjar.',
      ecoGuidelines: 'Dukung perajin lokal dengan membeli cinderamata berbahan alami.',
      etiquette: 'Minta izin sebelum memotret perajin lansia yang sedang berkarya.',
    },
    activity: 'Coba rasakan kelenturan serat bambu tali dan ikuti demo singkat anyam bilah bambu.',
    coordinates: { lat: -8.4520, lng: 115.3575 },
    locationName: 'Sentra Tengah Desa',
    estimatedMinutes: 20,
    completionPoints: 5,
    isManagerRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80',
    qrCodeId: 'QR-POINT-PENG-3',
  },
  {
    id: 'pt-peng-4',
    destinationId: 'dest-penglipuran',
    name: 'Pawon Suci & Warung Herbal Cemcem',
    sequenceOrder: 4,
    category: 'culinary',
    status: 'published',
    shortDescription: 'Mencicipi minuman herbal khas Loloh Cemcem yang segar berkhasiat.',
    story: 'Di dapur tradisional bergaya arsitektur bambu, resep jamu Loloh Cemcem diracik dari daun cemcem liar yang diulek bersama garam gunung, cabai, dan gula aren, menghasilkan sensasi rasa asam manis segar pedas yang unik dan kaya antioksidan.',
    facts: [
      'Daun cemcem dipetik segar setiap pagi dari perkebunan alami warga.',
      'Kemasan ramah lingkungan mulai menggantikan botol plastik sekali pakai.',
      'Minuman ini terbukti secara empiris membantu melancarkan pencernaan.',
    ],
    education: {
      culturalNorms: 'Hargai kearifan ramuan obat tradisional nusantara.',
      ecoGuidelines: 'Kembalikan botol kaca reusable ke warung setelah selesai minum.',
      etiquette: 'Jangan buang ampas daun sembarangan.',
    },
    activity: 'Cicipi Loloh Cemcem dingin dan pelajari manfaat 5 rempah alami khas Bali.',
    coordinates: { lat: -8.4532, lng: 115.3568 },
    locationName: 'Pekarangan Banjar Selatan',
    estimatedMinutes: 15,
    completionPoints: 5,
    isManagerRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    qrCodeId: 'QR-POINT-PENG-4',
  },
  // Prambanan point
  {
    id: 'pt-pram-1',
    destinationId: 'dest-prambanan',
    name: 'Candi Siwa — Mahameru Megah 47 Meter',
    sequenceOrder: 1,
    category: 'heritage',
    status: 'published',
    shortDescription: 'Candi tertinggi di kompleks Prambanan tempat arca Siwa Mahadewa dan Roro Jonggrang.',
    story: 'Candi Siwa menjulang setinggi 47 meter di pelataran pusat. Bangunan ini melambangkan Gunung Meru, poros alam semesta dalam kosmologi Hindu kuno.',
    facts: [
      'Dibangun sekitar tahun 850 Masehi oleh Rakai Pikatan dari Mataram Kuno.',
      'Di lorong galeri terpahat relief cerita Ramayana berurutan searah jarum jam (Pradaksina).',
    ],
    education: {
      culturalNorms: 'Berjalanlah mengitari candi searah jarum jam (Pradaksina) sebagai tanda hormat.',
      ecoGuidelines: 'Dilarang memanjat atau duduk di atas batu stupa dan pagar langkan relief.',
      etiquette: 'Patuhi batas antrean tangga demi keselamatan dan pelestarian struktur batu purba.',
    },
    activity: 'Temukan arca Durga Mahisasuramardini yang dalam legenda rakyat disebut sebagai Roro Jonggrang.',
    coordinates: { lat: -7.7520, lng: 110.4914 },
    locationName: 'Pelataran Utama Candi Prambanan',
    estimatedMinutes: 30,
    completionPoints: 5,
    isManagerRecommended: true,
    imageUrl: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&auto=format&fit=crop&q=80',
    qrCodeId: 'QR-POINT-PRAM-1',
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-peng-1',
    explorePointId: 'pt-peng-1',
    destinationId: 'dest-penglipuran',
    title: 'Kuis Kearifan Angkul-Angkul Penglipuran',
    description: 'Uji pemahamanmu tentang filosofi gerbang tradisional dan nilai kesetaraan sosial!',
    status: 'published',
    pointsPerCorrect: 10,
    totalPointsAvailable: 10,
    questions: [
      {
        id: 'q1',
        question: 'Mengapa pintu gerbang (angkul-angkul) di Desa Penglipuran dibangun dengan bentuk dan ukuran yang seragam?',
        options: [
          'Agar desa terlihat mirip dengan perumahan kota modern',
          'Sebagai simbol kesetaraan sosial dan kerukunan warga (Pawongan) tanpa menonjolkan kekayaan materi',
          'Karena material kayu dan bambu di desa tersebut terbatas jumlahnya',
          'Instruksi dari pemerintah kolonial masa lampau'
        ],
        correctOptionIndex: 1,
        explanation: 'Keseragaman angkul-angkul mencerminkan nilai Pawongan dalam Tri Hita Karana, menjauhkan sifat iri dan meneguhkan kesetaraan antarwarga adat.',
        pointsAwarded: 10,
      }
    ]
  },
  {
    id: 'quiz-peng-2',
    explorePointId: 'pt-peng-2',
    destinationId: 'dest-penglipuran',
    title: 'Kuis Konservasi Hutan Bambu Suci',
    description: 'Buktikan kepedulianmu terhadap aturan adat penjagaan hutan bambu!',
    status: 'published',
    pointsPerCorrect: 10,
    totalPointsAvailable: 10,
    questions: [
      {
        id: 'q2',
        question: 'Bagaimana aturan adat (awig-awig) Penglipuran terkait penebangan bambu di kawasan hutan lindung?',
        options: [
          'Siapapun boleh menebang kapan saja untuk keperluan pribadi',
          'Bambu boleh ditebang asalkan membayar uang kompensasi kepada turis',
          'Penebangan wajib mendapat izin Bendesa Adat pada hari baik (Dewasa Ayu) dan wajib menanam tunas baru',
          'Hutan hanya boleh dimasuki oleh pejabat kementerian kehutanan'
        ],
        correctOptionIndex: 2,
        explanation: 'Masyarakat Penglipuran menerapkan aturan sakral (awig-awig) ketat: penebangan harus berizin tetua adat pada hari baik, dan diimbangi reboisasi tunas bambu.',
        pointsAwarded: 10,
      }
    ]
  },
  {
    id: 'quiz-peng-3',
    explorePointId: 'pt-peng-3',
    destinationId: 'dest-penglipuran',
    title: 'Kuis Kriya & Musyawarah Bale Banjar',
    description: 'Ketahui tradisi gotong royong dan kerajinan lokal Penglipuran.',
    status: 'published',
    pointsPerCorrect: 10,
    totalPointsAvailable: 10,
    questions: [
      {
        id: 'q3',
        question: 'Apa fungsi utama Bale Banjar bagi masyarakat Desa Adat Penglipuran?',
        options: [
          'Hanya sebagai gudang penyimpanan peralatan upacara',
          'Tempat musyawarah mufakat, koordinasi gotong royong, dan kegiatan sosial kemasyarakatan',
          'Pusat perdagangan modern dan pasar grosir',
          'Area parkir kendaraan roda empat'
        ],
        correctOptionIndex: 1,
        explanation: 'Bale Banjar adalah ruang sentral pertemuan adat warga di mana semua keputusan diambil melalui musyawarah mufakat secara demokratis.',
        pointsAwarded: 10,
      }
    ]
  },
  {
    id: 'quiz-pram-1',
    explorePointId: 'pt-pram-1',
    destinationId: 'dest-prambanan',
    title: 'Kuis Mahakarya Candi Siwa',
    description: 'Uji pengetahuan sejarah epos Ramayana dan arsitektur Hindu kuno.',
    status: 'published',
    pointsPerCorrect: 10,
    totalPointsAvailable: 10,
    questions: [
      {
        id: 'q-pram-1',
        question: 'Bagaimana urutan langkah yang dianjurkan saat mengitari candi untuk menghormati tradisi (Pradaksina)?',
        options: [
          'Berjalan berlawanan arah jarum jam dari sisi belakang',
          'Berjalan searah jarum jam dengan menjaga posisi candi di sebelah kanan pengunjung',
          'Melompat tangga demi tangga secepat mungkin',
          'Hanya boleh berdiri di pintu utara tanpa berkeliling'
        ],
        correctOptionIndex: 1,
        explanation: 'Pradaksina adalah ritual penghormatan kuno dengan mengelilingi bangunan suci searah jarum jam.',
        pointsAwarded: 10,
      }
    ]
  }
];

export const INITIAL_REWARDS: DestinationReward[] = [
  {
    id: 'rwd-peng-1',
    destinationId: 'dest-penglipuran',
    umkmId: 'umkm-loloh-made',
    title: 'Voucher Segelas Loloh Cemcem Dingin',
    description: 'Tukarkan Jejak Points Anda dengan segelas jamu herbal segar khas Penglipuran di Warung Bu Made.',
    pointsCost: 20,
    initialStock: 50,
    currentStock: 42,
    validUntil: '2026-12-31',
    status: 'active',
    terms: 'Dapat ditukarkan di Warung Loloh Cemcem Bu Made di dekat Banjar Selatan. 1 voucher per traveler per hari.',
    category: 'culinary',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'rwd-peng-2',
    destinationId: 'dest-penglipuran',
    umkmId: 'umkm-kriya-bambu',
    title: 'Gantungan Kunci Anyaman Bambu Penglipuran',
    description: 'Cinderamata ramah lingkungan buatan tangan perajin bambu lokal Desa Penglipuran.',
    pointsCost: 35,
    initialStock: 30,
    currentStock: 18,
    validUntil: '2026-12-31',
    status: 'active',
    terms: 'Tunjukkan kode klaim di Sentra Kriya Bale Banjar.',
    category: 'souvenir',
    imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'rwd-peng-3',
    destinationId: 'dest-penglipuran',
    title: 'Diskon 50% Tiket Masuk Kunjungan Berikutnya',
    description: 'Voucher potongan setengah harga tiket masuk Penglipuran untuk kunjungan Anda berikutnya.',
    pointsCost: 60,
    initialStock: 100,
    currentStock: 89,
    validUntil: '2026-06-30',
    status: 'active',
    terms: 'Berlaku untuk 1 kali kunjungan di loket tiket resmi Penglipuran.',
    category: 'voucher',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'rwd-pram-1',
    destinationId: 'dest-prambanan',
    umkmId: 'umkm-batik-prambanan',
    title: 'Potongan Belanja Rp 25.000 Batik Enom',
    description: 'Diskon belanja batik cap motif sulur Candi Prambanan di gerai resmi Batik Enom.',
    pointsCost: 30,
    initialStock: 40,
    currentStock: 35,
    validUntil: '2026-12-31',
    status: 'active',
    terms: 'Minimum pembelanjaan Rp 100.000.',
    category: 'voucher',
    imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_EVENTS: DestinationEvent[] = [
  {
    id: 'evt-peng-1',
    destinationId: 'dest-penglipuran',
    title: 'Parade Budaya & Musik Bambu Penglipuran Fest',
    date: '2026-09-20',
    time: '14:00 - 17:30 WITA',
    location: 'Sepanjang Lorong Utama Desa Penglipuran',
    description: 'Pertunjukan ansambel musik bambu jegog, tari barong khas Bangli, dan pawai busana kain tenun tradisional.',
    status: 'published',
    qrCodeId: 'QR-EVT-PENG-FEST',
    badgeEarned: 'Sahabat Budaya Bambu 2026',
  }
];

export const INITIAL_UMKM: UMKM[] = [
  {
    id: 'umkm-loloh-made',
    ownerId: 'user-umkm-1',
    ownerName: 'Ni Wayan Rai',
    businessName: 'Warung Loloh Cemcem Bu Made',
    category: 'culinary',
    description: 'Penyedia racikan jamu Loloh Cemcem asli khas Penglipuran sejak 1998, dibuat tanpa pengawet dengan bahan segar pegunungan.',
    address: 'Jl. Penglipuran No. 12 (Samping Pekarangan Selatan)',
    phone: '+62 812-3456-7890',
    instagram: '@lolohcemcem.penglipuran',
    approvalStatus: 'approved',
    associatedDestinationIds: ['dest-penglipuran'],
    verifiedAt: '2026-01-12T09:00:00Z',
    viewsCount: 384,
    travelerInteractionsCount: 142,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    products: [
      {
        id: 'prod-loloh-1',
        umkmId: 'umkm-loloh-made',
        name: 'Loloh Cemcem Botol Kaca (350ml)',
        description: 'Ekstrak daun cemcem, jeruk nipis, cabai, dan gula aren bali murni.',
        priceIdr: 10000,
        category: 'culinary',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
        isAvailable: true,
      },
      {
        id: 'prod-loloh-2',
        umkmId: 'umkm-loloh-made',
        name: 'Kue Klepon Ubi Ungu (Isi 6)',
        description: 'Kudapan manis legit dengan taburan kelapa parut sangrai dan gula juruh.',
        priceIdr: 12000,
        category: 'culinary',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80',
        isAvailable: true,
      }
    ],
    promotions: [
      {
        id: 'promo-loloh-1',
        umkmId: 'umkm-loloh-made',
        title: 'Gratis 1 Klepon setiap beli 2 Botol Loloh Cemcem',
        discountPercentage: 15,
        promoCode: 'TAKONO-CEMCEM',
        validUntil: '2026-12-31',
        description: 'Tunjukkan badge traveler Takono untuk mendapatkan penawaran spesial ini.',
        redemptionCount: 38,
      }
    ]
  },
  {
    id: 'umkm-kriya-bambu',
    ownerId: 'user-manager-1',
    ownerName: 'I Made Suwena',
    businessName: 'Kriya Anyaman Bambu Penglipuran',
    category: 'craft',
    description: 'Kelompok pengrajin anyaman bambu tali khas Bali yang memproduksi perabot, wadah sajen, dan hiasan dinding artistik.',
    address: 'Kawasan Bale Banjar Penglipuran, Bangli',
    phone: '+62 813-9876-5432',
    instagram: '@bambu.penglipuran',
    approvalStatus: 'approved',
    associatedDestinationIds: ['dest-penglipuran'],
    verifiedAt: '2026-01-14T10:00:00Z',
    viewsCount: 290,
    travelerInteractionsCount: 88,
    imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=600&auto=format&fit=crop&q=80',
    products: [
      {
        id: 'prod-bambu-1',
        umkmId: 'umkm-kriya-bambu',
        name: 'Topi Anyaman Bambu Etnik (Caping)',
        description: 'Topi pelindung terik matahari dari serat bambu halus tahan hujan.',
        priceIdr: 35000,
        category: 'craft',
        imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=400&auto=format&fit=crop&q=80',
        isAvailable: true,
      }
    ],
    promotions: [
      {
        id: 'promo-bambu-1',
        umkmId: 'umkm-kriya-bambu',
        title: 'Diskon 10% untuk Souvenir Kerajinan Tangan',
        discountPercentage: 10,
        promoCode: 'BAMBU10',
        validUntil: '2026-11-30',
        description: 'Khusus bagi traveler yang telah menyelesaikan minimal 2 Explore Point di Penglipuran.',
        redemptionCount: 19,
      }
    ]
  },
  {
    id: 'umkm-batik-prambanan',
    ownerId: 'user-manager-1',
    ownerName: 'Sri Handayani',
    businessName: 'Batik Enom Prambanan',
    category: 'souvenir',
    description: 'Batik cap dan tulis dengan motif ukiran relief candi dan flora khas Jawa Tengah.',
    address: 'Pasar Seni Candi Prambanan Kios B-07',
    phone: '+62 821-4455-6677',
    approvalStatus: 'approved',
    associatedDestinationIds: ['dest-prambanan'],
    verifiedAt: '2026-01-20T11:00:00Z',
    viewsCount: 215,
    travelerInteractionsCount: 74,
    imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&auto=format&fit=crop&q=80',
    products: [
      {
        id: 'prod-batik-1',
        umkmId: 'umkm-batik-prambanan',
        name: 'Syal Batik Katun Halus Motif Siwa',
        description: 'Syal nyaman dengan motif terinspirasi relief candi utama.',
        priceIdr: 45000,
        category: 'fashion',
        imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&auto=format&fit=crop&q=80',
        isAvailable: true,
      }
    ],
    promotions: []
  },
  {
    id: 'umkm-kopi-waerebo',
    ownerId: 'user-manager-1',
    ownerName: 'Stefanus Ngganggur',
    businessName: 'Kopi Arabika Juria Wae Rebo',
    category: 'culinary',
    description: 'Biji kopi arabika langka varietas Juria yang tumbuh di lereng pegunungan Wae Rebo dengan cita rasa karamel dan rempah.',
    address: 'Dusun Dintor, Jalur Pendakian Wae Rebo, Manggarai, NTT',
    phone: '+62 852-1122-3344',
    approvalStatus: 'pending', // PENDING for Super Admin approval workflow!
    rejectionReason: undefined,
    associatedDestinationIds: ['dest-waerebo'],
    viewsCount: 12,
    travelerInteractionsCount: 2,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    products: [
      {
        id: 'prod-kopi-1',
        umkmId: 'umkm-kopi-waerebo',
        name: 'Kopi Bubuk Arabika Juria 200gr',
        description: 'Dipetik merah dari pohon kopi berumur puluhan tahun di hutan adat.',
        priceIdr: 65000,
        category: 'culinary',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
        isAvailable: true,
      }
    ],
    promotions: []
  }
];

export const INITIAL_QR_CODES: QRCodeData[] = [
  {
    id: 'QR-DEST-PENGLIPURAN',
    code: 'TAKONO:DEST:dest-penglipuran',
    targetType: 'destination',
    destinationId: 'dest-penglipuran',
    targetId: 'dest-penglipuran',
    title: 'Pintu Gerbang Utama Penglipuran',
    description: 'Scan untuk memulai atau melanjutkan Journey di Desa Wisata Penglipuran.',
    scansCount: 428,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'QR-POINT-PENG-1',
    code: 'TAKONO:POINT:pt-peng-1',
    targetType: 'explore_point',
    destinationId: 'dest-penglipuran',
    targetId: 'pt-peng-1',
    title: 'Plakat Angkul-Angkul Tradisional',
    description: 'Scan di gerbang pekarangan untuk membaca kisah, aturan budaya, dan mengikuti kuis.',
    scansCount: 312,
    createdAt: '2026-01-10T08:30:00Z',
  },
  {
    id: 'QR-POINT-PENG-2',
    code: 'TAKONO:POINT:pt-peng-2',
    targetType: 'explore_point',
    destinationId: 'dest-penglipuran',
    targetId: 'pt-peng-2',
    title: 'Papan Konservasi Hutan Bambu Suci',
    description: 'Scan di pintu masuk hutan bambu untuk membuka materi edukasi kelestarian alam.',
    scansCount: 275,
    createdAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'QR-POINT-PENG-3',
    code: 'TAKONO:POINT:pt-peng-3',
    targetType: 'explore_point',
    destinationId: 'dest-penglipuran',
    targetId: 'pt-peng-3',
    title: 'Balai Banjar & Sentra Kriya',
    description: 'Scan di Bale Banjar untuk melihat proses pembuatan anyaman bambu.',
    scansCount: 198,
    createdAt: '2026-01-10T09:30:00Z',
  },
  {
    id: 'QR-DEST-PRAMBANAN',
    code: 'TAKONO:DEST:dest-prambanan',
    targetType: 'destination',
    destinationId: 'dest-prambanan',
    targetId: 'dest-prambanan',
    title: 'Pintu Gerbang Tiket Prambanan',
    description: 'Scan untuk memulai Smart Guide penjelajahan Candi Prambanan.',
    scansCount: 350,
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'QR-POINT-PRAM-1',
    code: 'TAKONO:POINT:pt-pram-1',
    targetType: 'explore_point',
    destinationId: 'dest-prambanan',
    targetId: 'pt-pram-1',
    title: 'Plakat Candi Siwa',
    description: 'Scan di pelataran utama candi Siwa.',
    scansCount: 220,
    createdAt: '2026-01-15T09:30:00Z',
  },
  {
    id: 'QR-DEST-WAEREBO',
    code: 'TAKONO:DEST:dest-waerebo',
    targetType: 'destination',
    destinationId: 'dest-waerebo',
    targetId: 'dest-waerebo',
    title: 'Gerbang Pos Pa’al Wae Rebo (DRAFT)',
    description: 'QR Code untuk destinasi dalam status Draft.',
    scansCount: 5,
    createdAt: '2026-02-01T11:00:00Z',
  },
  {
    id: 'QR-EVT-PENG-FEST',
    code: 'TAKONO:EVENT:evt-peng-1',
    targetType: 'event',
    destinationId: 'dest-penglipuran',
    targetId: 'evt-peng-1',
    title: 'Check-in Festival Budaya Bambu 2026',
    description: 'Scan di panggung festival untuk mengklaim badge Sahabat Budaya.',
    scansCount: 64,
    createdAt: '2026-02-10T10:00:00Z',
  }
];

export const INITIAL_JOURNEYS: Journey[] = [
  {
    id: 'journey-penglipuran-active',
    travelerId: 'user-traveler-1',
    destinationId: 'dest-penglipuran',
    status: 'completed',
    startedAt: '2026-03-12T10:00:00Z',
    lastActivityAt: '2026-03-12T11:30:00Z',
    visitedPoints: [
      {
        explorePointId: 'pt-peng-1',
        viewedAt: '2026-03-12T10:05:00Z',
        interactedAt: '2026-03-12T10:10:00Z',
        completedAt: '2026-03-12T10:15:00Z',
      }
    ],
    completedQuizzes: [
      {
        quizId: 'quiz-peng-1',
        explorePointId: 'pt-peng-1',
        completedAt: '2026-03-12T10:18:00Z',
        score: 1,
        maxScore: 1,
        pointsEarned: 10,
        selectedAnswers: [1],
      }
    ],
    earnedPointsTotal: 15,
    claimedRewards: [],
    discoveredUmkmIds: ['umkm-loloh-made'],
    albumStamps: [
      {
        id: 'stamp-1',
        explorePointId: 'pt-peng-1',
        explorePointName: 'Angkul-Angkul Tradisional',
        earnedAt: '2026-03-12T10:15:00Z',
        iconName: 'DoorClosed',
        category: 'architecture',
      }
    ],
    personalNotes: 'Desa sangat asri dan tenang. Gerbang rumah warga sangat serasi!',
  }
];

export const INITIAL_POINT_TRANSACTIONS: PointTransaction[] = [
  {
    id: 'ptx-1',
    travelerId: 'user-traveler-1',
    journeyId: 'journey-penglipuran-active',
    destinationId: 'dest-penglipuran',
    amount: 5,
    type: 'explore_point',
    description: 'Menyelesaikan bacaan & etika Angkul-Angkul Tradisional',
    balanceAfter: 75,
    createdAt: '2026-03-12T10:15:00Z',
  },
  {
    id: 'ptx-2',
    travelerId: 'user-traveler-1',
    journeyId: 'journey-penglipuran-active',
    destinationId: 'dest-penglipuran',
    amount: 10,
    type: 'quiz',
    description: 'Menjawab benar Kuis Kearifan Angkul-Angkul Penglipuran',
    balanceAfter: 85,
    createdAt: '2026-03-12T10:18:00Z',
  }
];

export const INITIAL_ANALYTICS_EVENTS: AnalyticsEvent[] = [
  {
    id: 'evt-1',
    eventType: 'qr_scan',
    userId: 'user-traveler-1',
    destinationId: 'dest-penglipuran',
    targetId: 'dest-penglipuran',
    timestamp: '2026-03-12T10:00:00Z',
  },
  {
    id: 'evt-2',
    eventType: 'journey_start',
    userId: 'user-traveler-1',
    destinationId: 'dest-penglipuran',
    journeyId: 'journey-penglipuran-active',
    timestamp: '2026-03-12T10:00:05Z',
  },
  {
    id: 'evt-3',
    eventType: 'explore_point_complete',
    userId: 'user-traveler-1',
    destinationId: 'dest-penglipuran',
    targetId: 'pt-peng-1',
    journeyId: 'journey-penglipuran-active',
    timestamp: '2026-03-12T10:15:00Z',
  },
  {
    id: 'evt-4',
    eventType: 'quiz_submit',
    userId: 'user-traveler-1',
    destinationId: 'dest-penglipuran',
    targetId: 'quiz-peng-1',
    journeyId: 'journey-penglipuran-active',
    timestamp: '2026-03-12T10:18:00Z',
  }
];

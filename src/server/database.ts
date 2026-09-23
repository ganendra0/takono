import { 
  User, 
  Destination, 
  ExplorePoint, 
  DestinationEvent, 
  LocalDiscovery, 
  Reward, 
  RewardRedemption, 
  PointTransaction, 
  UserActivity, 
  UserDestinationProgress,
  TourismStats 
} from '../types/index.js';

// Pre-seeded Demo Data for Kebun Binatang Surabaya (KBS)
export const initialDestinations: Destination[] = [
  {
    id: 'dest_kbs_01',
    name: 'Kebun Binatang Surabaya (KBS)',
    code: 'KBS',
    slug: 'kebun-binatang-surabaya',
    tagline: 'Lembaga Konservasi Ex-Situ & Cagar Budaya Sejarah Tertua di Asia Tenggara',
    description: 'Kebun Binatang Surabaya (KBS) adalah salah satu kebun binatang tertua dan terlengkap di Asia Tenggara, berdiri sejak tahun 1916. Selain sebagai sarana rekreasi ramah keluarga, KBS berfungsi aktif sebagai benteng konservasi satwa langka Indonesia, riset hayati, dan edukasi lingkungan alam bagi generasi muda.',
    heroImage: '/src/assets/images/kbs_surabaya_zoo_1790168132396.jpg',
    gallery: [
      '/src/assets/images/kbs_elephant_exhibit_1790168144417.jpg',
      '/src/assets/images/kbs_aquarium_building_1790168158103.jpg',
      '/src/assets/images/hero_takono_tourism_1790168118274.jpg'
    ],
    address: 'Jl. Setail No. 1, Darmo, Kec. Wonokromo, Surabaya, Jawa Timur 60241',
    city: 'Surabaya',
    province: 'Jawa Timur',
    latitude: -7.2961,
    longitude: 112.7368,
    boundaryCoordinates: [
      [-7.2938, 112.7350],
      [-7.2936, 112.7388],
      [-7.2982, 112.7391],
      [-7.2985, 112.7348],
      [-7.2938, 112.7350]
    ],
    operatingHours: 'Setiap Hari: 08:00 – 16:00 WIB',
    ticketInfo: 'Tiket Masuk Reguler: Rp 15.000 / orang (Non-tunai via QRIS / Brizzi)',
    contactPhone: '+62 31 5678211',
    contactEmail: 'info@surabayazoo.co.id',
    facilities: [
      { id: 'fac_1', name: 'Pusat Informasi & Tourism Care', icon: 'Info', latitude: -7.2942, longitude: 112.7365, description: 'Layanan informasi, peta cetak panduan, dan penitipan barang' },
      { id: 'fac_2', name: 'Musholla Al-Hikmah KBS', icon: 'Moon', latitude: -7.2952, longitude: 112.7375, description: 'Tempat ibadah bersih berpenyejuk udara dilengkapi mukena & sarung' },
      { id: 'fac_3', name: 'Toilet Sentral & Akses Difabel', icon: 'Accessibility', latitude: -7.2946, longitude: 112.7360, description: 'Fasilitas sanitasi ramah anak, lansia, dan kursi roda' },
      { id: 'fac_4', name: 'Pos Medis & Pertolongan Pertama', icon: 'HeartPulse', latitude: -7.2958, longitude: 112.7362, description: 'Tim medis siaga dan perawat bersertifikasi' },
      { id: 'fac_5', name: 'Gazebo Istirahat Rindang', icon: 'Coffee', latitude: -7.2970, longitude: 112.7378, description: 'Area teduh keluarga di bawah pohon beringin berusia 100+ tahun' }
    ],
    status: 'published',
    isDemo: true
  }
];

export const initialExplorePoints: ExplorePoint[] = [
  {
    id: 'exp_kbs_01',
    destinationId: 'dest_kbs_01',
    name: 'Aquarium Bersejarah & Biota Air Tawar',
    slug: 'aquarium-bersejarah',
    category: 'Sejarah',
    description: 'Paviliun akuarium bersejarah bergaya arsitektur kolonial dengan koleksi ikan endemik sungai nusantara dan Arapaima raksasa.',
    story: 'Dibangun pada masa awal berdirinya kebun binatang, terowongan akuarium ini merupakan salah satu fasilitas pameran air tertua di Indonesia. Desain lengkungan batu bata merah kunonya masih kokoh mempertahankan temperatur sejuk alami.',
    educationalContent: 'Biota air tawar nusantara seperti Ikan Belida (Chitala lopis) dan Arwana Irian memainkan peran vital dalam rantai makanan sungai tropis. Belida kini berstatus dilindungi penuh karena kepunahan habitat alaminya di Pulau Jawa dan Sumatera.',
    funFacts: [
      'Akuarium ini menampung Arapaima Gigas dari Sungai Amazon yang dapat tumbuh hingga panjang 3 meter.',
      'Sistem sirkulasi filtrasi menggunakan gravitasi alami yang telah dimodernisasi sejak dekade 1970-an.'
    ],
    image: '/src/assets/images/kbs_aquarium_building_1790168158103.jpg',
    latitude: -7.2945,
    longitude: 112.7362,
    estimatedDuration: '15-20 menit',
    difficulty: 'Mudah',
    secureToken: 'token_aq_kbs_9812a',
    pointsReward: 10,
    status: 'published',
    quiz: {
      id: 'quiz_aq_01',
      explorePointId: 'exp_kbs_01',
      title: 'Kuis Biota Air & Sejarah Akuarium',
      questions: [
        {
          id: 'q_aq_1',
          question: 'Ikan air tawar endemik Sumatera & Jawa yang berbentuk pipih dan kini dilindungi karena populasinya terancam adalah...',
          options: [
            { id: 'opt_1', text: 'Ikan Belida (Chitala lopis)' },
            { id: 'opt_2', text: 'Ikan Lele Dumbo' },
            { id: 'opt_3', text: 'Ikan Mas Koki' },
            { id: 'opt_4', text: 'Ikan Nila Merah' }
          ],
          correctOptionId: 'opt_1',
          explanation: 'Tepat sekali! Ikan Belida (Chitala lopis) merupakan ikan khas yang kini dilindungi secara ketat oleh Kementerian Kelautan dan Perikanan Republik Indonesia.',
          points: 15
        }
      ]
    }
  },
  {
    id: 'exp_kbs_02',
    destinationId: 'dest_kbs_01',
    name: 'Konservasi Gajah Sumatera (Elephas maximus sumatranus)',
    slug: 'gajah-sumatera',
    category: 'Edukasi',
    description: 'Habitat terbuka hijau tempat perlindungan dan perbanyakan gajah sumatera yang berstatus Kritis (Critically Endangered).',
    story: 'Gajah Sumatera merupakan subspesies gajah Asia yang populasinya terus merosot akibat perambahan hutan dan konflik dengan perkebunan. Di KBS, program enrichment harian dirancang khusus untuk merangsang kecerdasan dan gerak motorik alami mereka.',
    educationalContent: 'Seekor gajah dewasa mengonsumsi sekitar 150 kg hijauan dan 100 liter air setiap hari. Melalui kotorannya, gajah menjadi "petani hutan" ulung yang menyebarkan benih pohon-pohon besar di belantara Sumatera.',
    funFacts: [
      'Gajah berkomunikasi menggunakan gelombang infrasonik frekuensi rendah yang merambat lewat tanah hingga jarak puluhan kilometer.',
      'Belalai gajah memiliki lebih dari 40.000 otot mandiri tanpa tulang tunggal pun.'
    ],
    image: '/src/assets/images/kbs_elephant_exhibit_1790168144417.jpg',
    latitude: -7.2965,
    longitude: 112.7372,
    estimatedDuration: '20-25 menit',
    difficulty: 'Mudah',
    secureToken: 'token_gj_kbs_4571b',
    pointsReward: 10,
    status: 'published',
    quiz: {
      id: 'quiz_gj_01',
      explorePointId: 'exp_kbs_02',
      title: 'Tantangan Pengetahuan Satwa Payung Gajah Sumatera',
      questions: [
        {
          id: 'q_gj_1',
          question: 'Mengapa gajah sumatera dijuluki sebagai "spesies payung" (umbrella species) dan "petani hutan"?',
          options: [
            { id: 'opt_gj_a', text: 'Karena bentuk telinganya menyerupai payung saat kepanasan' },
            { id: 'opt_gj_b', text: 'Karena daya jelajahnya membantu menyebarkan biji tanaman dan membuka tajuk kanopi hutan bagi vegetasi bawah' },
            { id: 'opt_gj_c', text: 'Karena gajah bisa berteduh di bawah pohon rindang saat hujan' },
            { id: 'opt_gj_d', text: 'Karena gajah adalah hewan peliharaan raja-raja masa lalu' }
          ],
          correctOptionId: 'opt_gj_b',
          explanation: 'Luar biasa! Gajah membantu meregenerasi ekosistem hutan tropis dengan memakan buah hutan dan menyebarkan biji-bijian di sepanjang jalur jelajahnya.',
          points: 15
        }
      ]
    }
  },
  {
    id: 'exp_kbs_03',
    destinationId: 'dest_kbs_01',
    name: 'Dunia Reptil & Suaka Komodo Dragon',
    slug: 'dunia-reptil-komodo',
    category: 'Alam',
    description: 'Zona ekosistem reptil prasejarah yang menampilkan kadal terbesar di bumi asal Nusa Tenggara Timur.',
    story: 'KBS memiliki rekor sukses internasional dalam penangkaran ex-situ Komodo (Varanus komodoensis). Belasan anakan komodo berhasil ditetaskan secara alami di fasilitas inkubasi reptil KBS ini.',
    educationalContent: 'Komodo mengandalkan organ Jacobson di langit-langit mulutnya bersama lidah bercabang untuk mencium aroma bangkai hingga jarak 9,5 kilometer dengan bantuan hembusan angin.',
    funFacts: [
      'Gigi komodo bergerigi tajam layaknya hiu dan dapat berganti berkali-kali sepanjang hidupnya.',
      'Kelenjar racun di rahang bawah komodo mengeluarkan protein antibeku darah yang melemahkan mangsanya.'
    ],
    image: '/src/assets/images/hero_takono_tourism_1790168118274.jpg',
    latitude: -7.2974,
    longitude: 112.7358,
    estimatedDuration: '15-20 menit',
    difficulty: 'Sedang',
    secureToken: 'token_rp_kbs_2309c',
    pointsReward: 10,
    status: 'published',
    quiz: {
      id: 'quiz_rp_01',
      explorePointId: 'exp_kbs_03',
      title: 'Kuis Ketangkasan Komodo Dragon',
      questions: [
        {
          id: 'q_rp_1',
          question: 'Bagian tubuh manakah yang digunakan Komodo untuk mendeteksi bau mangsa dari jarak bermil-mil?',
          options: [
            { id: 'opt_rp_a', text: 'Hidung luar' },
            { id: 'opt_rp_b', text: 'Lidah bercabang yang terhubung ke Organ Jacobson' },
            { id: 'opt_rp_c', text: 'Gendang telinga luar' },
            { id: 'opt_rp_d', text: 'Sisik pada bagian ekor' }
          ],
          correctOptionId: 'opt_rp_b',
          explanation: 'Benar! Lidah komodo menangkap partikel aroma di udara dan membawanya ke organ Jacobson di langit-langit mulut.',
          points: 15
        }
      ]
    }
  },
  {
    id: 'exp_kbs_04',
    destinationId: 'dest_kbs_01',
    name: 'Pusat Primata Bekantan & Orangutan',
    slug: 'pusat-primata-bekantan',
    category: 'Budaya',
    description: 'Kompleks pulau buatan berparit air yang mensimulasikan hutan mangrove Kalimantan bagi Bekantan berhidung panjang.',
    story: 'Bekantan (Nasalis larvatus) adalah maskot fauna khas Pulau Kalimantan. KBS memelihara kelompok keluarga bekantan di pulau berpohon bakau buatan tanpa kandang teralis kawat, memungkinkan wisatawan mengamati interaksi sosial alaminya.',
    educationalContent: 'Perut bekantan memiliki sistem pencernaan bersekat mirip sapi yang menampung bakteri pemecah selulosa, memungkinkan mereka mencerna daun mangrove yang berserat kasar dan beracun bagi primata lain.',
    funFacts: [
      'Hidung jantan bekantan yang besar berfungsi sebagai pengeras suara alami untuk memanggil betina.',
      'Bekantan memiliki selaput di antara jari-jari kakinya yang membuat mereka menjadi perenang andal.'
    ],
    image: '/src/assets/images/kbs_surabaya_zoo_1790168132396.jpg',
    latitude: -7.2955,
    longitude: 112.7380,
    estimatedDuration: '20 menit',
    difficulty: 'Mudah',
    secureToken: 'token_pm_kbs_7734d',
    pointsReward: 10,
    status: 'published',
    quiz: {
      id: 'quiz_pm_01',
      explorePointId: 'exp_kbs_04',
      title: 'Kuis Anatomi & Perilaku Bekantan',
      questions: [
        {
          id: 'q_pm_1',
          question: 'Fungsi adaptasi fisik selaput pada kaki bekantan adalah untuk...',
          options: [
            { id: 'opt_pm_a', text: 'Membantu berenang melintasi sungai mangrove' },
            { id: 'opt_pm_b', text: 'Menghangatkan tubuh saat musim dingin' },
            { id: 'opt_pm_c', text: 'Membuat suara tepukan di dahan pohon' },
            { id: 'opt_pm_d', text: 'Menggali lubang tanah tempat bertelur' }
          ],
          correctOptionId: 'opt_pm_a',
          explanation: 'Tepat sekali! Bekantan adalah primata yang sangat menyukai air dan sering melompat ke sungai untuk menghindari predator.',
          points: 15
        }
      ]
    }
  },
  {
    id: 'exp_kbs_05',
    destinationId: 'dest_kbs_01',
    name: 'Kubah Aviary Burung Langka & Endemik',
    slug: 'kubah-aviary-burung',
    category: 'Foto',
    description: 'Kubah raksasa jelajah burung tempat burung Jalak Bali dan Kakatua terbang bebas di atas pepohonan rindang.',
    story: 'Kubah jelajah ini dirancang agar pengunjung berjalan langsung di tengah kepakan sayap burung tanpa kaca pembatas. Suara kicau Jalak Bali yang riuh mengedukasi wisatawan tentang kesuksesan program pelepasan liar satwa.',
    educationalContent: 'Jalak Bali (Leucopsar rothschildi) hanya ditemukan di ujung barat Pulau Bali. Program penangkaran kolaboratif kebun binatang berhasil meningkatkan populasinya dari ancaman kepunahan total di alam bebas.',
    funFacts: [
      'Jalak Bali memiliki jambul putih elegan yang akan ditegakkan saat memikat pasangannya.',
      'Kakatua Raja memiliki paruh sekuat tang baja yang mampu memecahkan tempurung kenari hutan.'
    ],
    image: '/src/assets/images/hero_takono_tourism_1790168118274.jpg',
    latitude: -7.2949,
    longitude: 112.7370,
    estimatedDuration: '15 menit',
    difficulty: 'Mudah',
    secureToken: 'token_av_kbs_6129e',
    pointsReward: 10,
    status: 'published',
    quiz: {
      id: 'quiz_av_01',
      explorePointId: 'exp_kbs_05',
      title: 'Kuis Konservasi Jalak Bali',
      questions: [
        {
          id: 'q_av_1',
          question: 'Warna kulit melingkar di sekitar mata burung Jalak Bali yang khas adalah...',
          options: [
            { id: 'opt_av_a', text: 'Biru terang mencolok' },
            { id: 'opt_av_b', text: 'Merah delima' },
            { id: 'opt_av_c', text: 'Kuning keemasan' },
            { id: 'opt_av_d', text: 'Hijau zamrud' }
          ],
          correctOptionId: 'opt_av_a',
          explanation: 'Benar sekali! Ciri pembeda utama Jalak Bali yang eksotis adalah pelupuk mata telanjang berwarna biru terang berpadu bulu putih bersih.',
          points: 15
        }
      ]
    }
  },
  {
    id: 'exp_kbs_06',
    destinationId: 'dest_kbs_01',
    name: 'Area Edukasi Satwa & Hutan Botani Sejarah',
    slug: 'area-edukasi-botani',
    category: 'Keluarga',
    description: 'Taman botani dengan pohon-pohon peneduh raksasa berusia seabad, ruang workshop interaktif, dan sentra belajar daur ulang.',
    story: 'KBS tidak hanya cagar satwa, melainkan juga paru-paru hijau Kota Surabaya. Ribuan spesimen pohon langka ditanam sejak 1920 untuk menciptakan iklim mikro sejuk di tengah hangatnya pesisir Jawa Timur.',
    educationalContent: 'Pohon Baobab (Adansonia digitata) dan Beringin Bersejarah di area ini mampu menyerap hingga ratusan ton karbon dioksida per tahun dan menjadi habitat alami serangga dan burung liar Surabaya.',
    funFacts: [
      'Beberapa pohon trembesi di area ini telah berusia lebih dari 110 tahun.',
      'Sisa pakan organik satwa diolah mandiri menjadi kompos pupuk organik untuk merawat seluruh taman kebun binatang.'
    ],
    image: '/src/assets/images/kbs_surabaya_zoo_1790168132396.jpg',
    latitude: -7.2968,
    longitude: 112.7385,
    estimatedDuration: '20 menit',
    difficulty: 'Mudah',
    secureToken: 'token_ed_kbs_5541f',
    pointsReward: 10,
    status: 'published',
    quiz: {
      id: 'quiz_ed_01',
      explorePointId: 'exp_kbs_06',
      title: 'Kuis Kelestarian Alam & Hutan Kota',
      questions: [
        {
          id: 'q_ed_1',
          question: 'Bagaimana sisa pakan organik dan dedaunan di kebun binatang diolah secara berkelanjutan?',
          options: [
            { id: 'opt_ed_a', text: 'Dibuang ke sungai kota' },
            { id: 'opt_ed_b', text: 'Difermentasi menjadi pupuk kompos organik penyubur tanaman' },
            { id: 'opt_ed_c', text: 'Dibakar di lapangan terbuka' },
            { id: 'opt_ed_d', text: 'Dibiarkan menumpuk tanpa perawatan' }
          ],
          correctOptionId: 'opt_ed_b',
          explanation: 'Hebat! Pengolahan menjadi kompos organik merupakan wujud nyata ekonomi sirkular dan perlindungan lingkungan hidup di KBS.',
          points: 15
        }
      ]
    }
  }
];

export const initialEvents: DestinationEvent[] = [
  {
    id: 'evt_kbs_01',
    destinationId: 'dest_kbs_01',
    title: 'Feeding Time Gajah Sumatera & Tanya Pawang',
    slug: 'feeding-time-gajah',
    description: 'Saksikan interaksi langsung para mahout (pawang gajah) memberikan santapan buah semangka dan tebu segar sembari mendengarkan penjelasan perilaku gajah.',
    image: '/src/assets/images/kbs_elephant_exhibit_1790168144417.jpg',
    startDate: '2026-09-24',
    endDate: '2026-10-31',
    time: '10:00 – 10:45 WIB',
    location: 'Plaza Konservasi Gajah Sumatera',
    organizer: 'Tim Edukasi & Mahout KBS',
    pointsReward: 20,
    status: 'upcoming'
  },
  {
    id: 'evt_kbs_02',
    destinationId: 'dest_kbs_01',
    title: 'Safari Jelajah Cerita Malam: Nocturnal Animals',
    slug: 'safari-cerita-malam',
    description: 'Pengalaman eksklusif mengamati pola hidup satwa malam (Kukang Jawa, Burung Hantu, dan Binturong) didampingi kurator biologi.',
    image: '/src/assets/images/kbs_aquarium_building_1790168158103.jpg',
    startDate: '2026-09-26',
    endDate: '2026-09-27',
    time: '18:30 – 20:30 WIB',
    location: 'Gerbang Utama & Jalur Nokturnal',
    organizer: 'Departemen Edukasi & Rekreasi KBS',
    pointsReward: 30,
    status: 'upcoming'
  },
  {
    id: 'evt_kbs_03',
    destinationId: 'dest_kbs_01',
    title: 'Workshop Dokter Hewan Cilik: Sahabat Satwa',
    slug: 'workshop-vet-cilik',
    description: 'Pelatihan dasar kepedulian satwa bagi anak dan keluarga, belajar memeriksa detak jantung mamalia dan meracik nutrisi satwa.',
    image: '/src/assets/images/hero_takono_tourism_1790168118274.jpg',
    startDate: '2026-10-04',
    endDate: '2026-10-04',
    time: '09:00 – 11:30 WIB',
    location: 'Aula Bale Edukasi Wonokromo',
    organizer: 'Ikatan Dokter Hewan & Divisi Edukasi',
    pointsReward: 25,
    status: 'upcoming'
  }
];

export const initialLocalDiscoveries: LocalDiscovery[] = [
  {
    id: 'loc_kbs_01',
    destinationId: 'dest_kbs_01',
    name: 'Warung Rawon Sedap Pojok KBS',
    category: 'Kuliner',
    description: 'Sajian Rawon Daging Empuk khas Suroboyo dengan kuah kluwek hitam pekat otentik, sambal terasi, dan tempe mendol gurih.',
    image: '/src/assets/images/hero_takono_tourism_1790168118274.jpg',
    address: 'Jl. Setail No. 12 (depan Gerbang Selatan KBS)',
    latitude: -7.2982,
    longitude: 112.7360,
    operatingHours: '07:30 – 17:00 WIB',
    contact: '+62 812-3344-5511',
    promotion: 'Diskon 15% untuk semua menu dengan menunjukkan aplikasi TAKONO',
    rewardText: 'Dapatkan +10 Jejak Points saat berkunjung',
    pointsReward: 10,
    status: 'published'
  },
  {
    id: 'loc_kbs_02',
    destinationId: 'dest_kbs_01',
    name: 'Sentra Oleh-oleh & Suvenir Khas Surabaya',
    category: 'Oleh-oleh',
    description: 'Pusat cenderamata UMKM Surabaya: Kaos Sablon Satwa KBS, Kerupuk Ikan Kenjeran, Almond Crispy, dan Spikoe Kuno Surabaya.',
    image: '/src/assets/images/kbs_surabaya_zoo_1790168132396.jpg',
    address: 'Kompleks Ruko Darmo Point Blok C-4',
    latitude: -7.2940,
    longitude: 112.7352,
    operatingHours: '08:00 – 20:00 WIB',
    contact: '+62 821-8899-7700',
    promotion: 'Gratis tote bag edisi khusus setiap belanja di atas Rp 75.000',
    rewardText: 'Dapatkan +10 Jejak Points saat belanja suvenir lokal',
    pointsReward: 10,
    status: 'published'
  },
  {
    id: 'loc_kbs_03',
    destinationId: 'dest_kbs_01',
    name: 'Kedai Es Degan Nusantara & Aneka Jamu Segar',
    category: 'Kuliner',
    description: 'Minuman kelapa muda murni penyejuk dahaga di tengah teriknya Surabaya, disajikan dengan sirup gula kelapa organik dan jeruk nipis segar.',
    image: '/src/assets/images/kbs_aquarium_building_1790168158103.jpg',
    address: 'Selasar Pujasera KBS Pintu 2',
    latitude: -7.2950,
    longitude: 112.7388,
    operatingHours: '08:30 – 16:30 WIB',
    contact: '+62 813-5566-2211',
    promotion: 'Gratis topping selasih & nata de coco untuk wisatawan TAKONO',
    rewardText: 'Dapatkan +10 Jejak Points saat mampir',
    pointsReward: 10,
    status: 'published'
  },
  {
    id: 'loc_kbs_04',
    destinationId: 'dest_kbs_01',
    name: 'Batik Mangrove & Kriya Daun Rungkut',
    category: 'Produk Lokal',
    description: 'Karya kerajinan tangan tekstil bermotif satwa dan mangrove Jawa Timur karya kelompok perajin ibu-ibu binaan pariwisata.',
    image: '/src/assets/images/hero_takono_tourism_1790168118274.jpg',
    address: 'Galeri Kriya Jawa Timur, Jl. Diponegoro No. 8',
    latitude: -7.2932,
    longitude: 112.7365,
    operatingHours: '09:00 – 17:00 WIB',
    contact: '+62 856-4433-2210',
    promotion: 'Potongan harga Rp 20.000 untuk kain motif satwa',
    rewardText: 'Dukungan ekonomi kreatif lokal',
    pointsReward: 10,
    status: 'published'
  }
];

export const initialRewards: Reward[] = [
  {
    id: 'rew_kbs_01',
    destinationId: 'dest_kbs_01',
    name: 'Voucher Diskon 25% Tiket Kunjungan KBS',
    partner: 'Manajemen Kebun Binatang Surabaya',
    description: 'Gunakan potongan harga 25% pada kunjungan berikutnya bersama keluarga di loket khusus digital KBS.',
    image: '/src/assets/images/kbs_surabaya_zoo_1790168132396.jpg',
    pointsRequired: 40,
    quota: 150,
    claimedCount: 42,
    validUntil: '2026-12-31',
    terms: [
      'Berlaku untuk 1 tiket masuk reguler',
      'Tunjukkan kode voucher pada loket layanan khusus digital',
      'Tidak dapat diuangkan atau digabungkan dengan promo rombongan'
    ],
    status: 'active'
  },
  {
    id: 'rew_kbs_02',
    destinationId: 'dest_kbs_01',
    name: 'Voucher Kuliner Lokal Rp 20.000',
    partner: 'Paguyuban Warung Sedap Pojok KBS',
    description: 'Potongan belanja makanan & minuman di mitra Local Discovery bertanda khusus di sekitar destinasi.',
    image: '/src/assets/images/hero_takono_tourism_1790168118274.jpg',
    pointsRequired: 50,
    quota: 80,
    claimedCount: 31,
    validUntil: '2026-11-30',
    terms: [
      'Minimum transaksi Rp 40.000',
      'Berlaku di seluruh outlet mitra kuliner bertanda TAKONO Partner',
      'Berlaku hingga 30 hari sejak tanggal penukaran'
    ],
    status: 'active'
  },
  {
    id: 'rew_kbs_03',
    destinationId: 'dest_kbs_01',
    name: 'Merchandise Resmi Topi Rimba Penjelajah KBS',
    partner: 'Sentra Suvenir Kreatif KBS',
    description: 'Topi bucket rimba bahan katun kanvas berbordir logo konservasi KBS untuk teman berpetualang di bawah terik matahari.',
    image: '/src/assets/images/kbs_elephant_exhibit_1790168144417.jpg',
    pointsRequired: 75,
    quota: 30,
    claimedCount: 14,
    validUntil: '2026-12-15',
    terms: [
      'Ambil langsung di Pusat Informasi & Tourism Care KBS Pintu Utama',
      'Tunjukkan bukti kode penukaran aktif di aplikasi'
    ],
    status: 'active'
  },
  {
    id: 'rew_kbs_04',
    destinationId: 'dest_kbs_01',
    name: 'Akses VIP Sesi Foto Bersama Satwa Edukasi',
    partner: 'Divisi Pelayanan Wisata KBS',
    description: 'Kesempatan eksklusif berfoto bersama satwa jinak (Burung Makaw & Reptil Edukasi) dipandu pawang profesional tanpa antrean umum.',
    image: '/src/assets/images/kbs_aquarium_building_1790168158103.jpg',
    pointsRequired: 100,
    quota: 20,
    claimedCount: 9,
    validUntil: '2026-10-31',
    terms: [
      'Berlaku untuk 1 keluarga (maksimal 4 orang)',
      'Sesi berlangsung 10 menit di panggung interaksi satwa',
      'Termasuk 1 cetak foto ukuran 4R dan softcopy resolusi tinggi'
    ],
    status: 'active'
  }
];

export const initialUsers: User[] = [
  {
    id: 'usr_traveler_01',
    name: 'Budi Santoso',
    email: 'traveler@takono.id',
    role: 'traveler',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    pointsBalance: 85,
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'usr_manager_01',
    name: 'Maya Indah, S.Par',
    email: 'manager@kbs.id',
    role: 'destination_manager',
    destinationId: 'dest_kbs_01',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    pointsBalance: 0,
    createdAt: '2026-08-15T09:30:00Z'
  },
  {
    id: 'usr_gov_01',
    name: 'Drs. Hendra Wijaya, M.Si',
    email: 'dinas@surabaya.go.id',
    role: 'government',
    institution: 'Dinas Kebudayaan, Kepemudaan dan Olahraga serta Pariwisata Kota Surabaya',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    pointsBalance: 0,
    createdAt: '2026-08-10T10:00:00Z'
  },
  {
    id: 'usr_admin_01',
    name: 'Super Admin TAKONO',
    email: 'admin@takono.id',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=120&auto=format&fit=crop&q=80',
    pointsBalance: 0,
    createdAt: '2026-08-01T00:00:00Z'
  }
];

export const initialPointTransactions: PointTransaction[] = [
  {
    id: 'tx_pt_01',
    userId: 'usr_traveler_01',
    type: 'credit',
    sourceType: 'explore_point_discovered',
    sourceId: 'exp_kbs_01',
    amount: 10,
    description: 'Menemukan titik Aquarium Bersejarah',
    createdAt: '2026-09-22T09:15:00Z'
  },
  {
    id: 'tx_pt_02',
    userId: 'usr_traveler_01',
    type: 'credit',
    sourceType: 'quiz_completed',
    sourceId: 'quiz_aq_01',
    amount: 15,
    description: 'Menjawab kuis Biota Air dengan benar',
    createdAt: '2026-09-22T09:20:00Z'
  },
  {
    id: 'tx_pt_03',
    userId: 'usr_traveler_01',
    type: 'credit',
    sourceType: 'explore_point_discovered',
    sourceId: 'exp_kbs_02',
    amount: 10,
    description: 'Menemukan titik Konservasi Gajah Sumatera',
    createdAt: '2026-09-22T09:45:00Z'
  },
  {
    id: 'tx_pt_04',
    userId: 'usr_traveler_01',
    type: 'credit',
    sourceType: 'quiz_completed',
    sourceId: 'quiz_gj_01',
    amount: 15,
    description: 'Menjawab kuis Gajah Sumatera dengan benar',
    createdAt: '2026-09-22T09:50:00Z'
  },
  {
    id: 'tx_pt_05',
    userId: 'usr_traveler_01',
    type: 'credit',
    sourceType: 'explore_point_discovered',
    sourceId: 'exp_kbs_04',
    amount: 10,
    description: 'Menemukan titik Pusat Primata Bekantan',
    createdAt: '2026-09-22T10:15:00Z'
  },
  {
    id: 'tx_pt_06',
    userId: 'usr_traveler_01',
    type: 'credit',
    sourceType: 'quiz_completed',
    sourceId: 'quiz_pm_01',
    amount: 15,
    description: 'Menjawab kuis Bekantan dengan benar',
    createdAt: '2026-09-22T10:20:00Z'
  },
  {
    id: 'tx_pt_07',
    userId: 'usr_traveler_01',
    type: 'credit',
    sourceType: 'local_discovery_visited',
    sourceId: 'loc_kbs_01',
    amount: 10,
    description: 'Kunjungan mitra Warung Rawon Sedap Pojok',
    createdAt: '2026-09-22T11:30:00Z'
  }
];

export const initialActivities: UserActivity[] = [
  {
    id: 'act_01',
    userId: 'usr_traveler_01',
    destinationId: 'dest_kbs_01',
    type: 'explore_point_discovered',
    referenceId: 'exp_kbs_01',
    title: 'Menjelajahi Aquarium Bersejarah & Biota Air',
    pointsEarned: 10,
    createdAt: '2026-09-22T09:15:00Z'
  },
  {
    id: 'act_02',
    userId: 'usr_traveler_01',
    destinationId: 'dest_kbs_01',
    type: 'quiz_completed',
    referenceId: 'exp_kbs_01',
    title: 'Menyelesaikan Kuis Akuarium Bersejarah',
    pointsEarned: 15,
    createdAt: '2026-09-22T09:20:00Z'
  },
  {
    id: 'act_03',
    userId: 'usr_traveler_01',
    destinationId: 'dest_kbs_01',
    type: 'explore_point_discovered',
    referenceId: 'exp_kbs_02',
    title: 'Menjelajahi Konservasi Gajah Sumatera',
    pointsEarned: 10,
    createdAt: '2026-09-22T09:45:00Z'
  },
  {
    id: 'act_04',
    userId: 'usr_traveler_01',
    destinationId: 'dest_kbs_01',
    type: 'quiz_completed',
    referenceId: 'exp_kbs_02',
    title: 'Menyelesaikan Kuis Gajah Sumatera',
    pointsEarned: 15,
    createdAt: '2026-09-22T09:50:00Z'
  },
  {
    id: 'act_05',
    userId: 'usr_traveler_01',
    destinationId: 'dest_kbs_01',
    type: 'explore_point_discovered',
    referenceId: 'exp_kbs_04',
    title: 'Menjelajahi Pusat Primata Bekantan',
    pointsEarned: 10,
    createdAt: '2026-09-22T10:15:00Z'
  },
  {
    id: 'act_06',
    userId: 'usr_traveler_01',
    destinationId: 'dest_kbs_01',
    type: 'quiz_completed',
    referenceId: 'exp_kbs_04',
    title: 'Menyelesaikan Kuis Bekantan',
    pointsEarned: 15,
    createdAt: '2026-09-22T10:20:00Z'
  },
  {
    id: 'act_07',
    userId: 'usr_traveler_01',
    destinationId: 'dest_kbs_01',
    type: 'local_discovery_visited',
    referenceId: 'loc_kbs_01',
    title: 'Mampir di Warung Rawon Sedap Pojok KBS',
    pointsEarned: 10,
    createdAt: '2026-09-22T11:30:00Z'
  }
];

export const initialUserProgress: UserDestinationProgress[] = [
  {
    destinationId: 'dest_kbs_01',
    destinationName: 'Kebun Binatang Surabaya (KBS)',
    totalExplorePoints: 6,
    completedExplorePoints: 3,
    completedPointIds: ['exp_kbs_01', 'exp_kbs_02', 'exp_kbs_04'],
    lastVisitedAt: '2026-09-22T11:30:00Z'
  }
];

export const initialRedemptions: RewardRedemption[] = [
  {
    id: 'red_01',
    userId: 'usr_traveler_01',
    rewardId: 'rew_kbs_01',
    rewardName: 'Voucher Diskon 25% Tiket Kunjungan KBS',
    partner: 'Manajemen Kebun Binatang Surabaya',
    redemptionCode: 'TAKONO-KBS-25-8831',
    pointsSpent: 40,
    claimedAt: '2026-09-20T14:10:00Z',
    status: 'active'
  }
];

// In-Memory Database Store Class with Relational Querying
export class DatabaseStore {
  destinations = [...initialDestinations];
  explorePoints = [...initialExplorePoints];
  events = [...initialEvents];
  localDiscoveries = [...initialLocalDiscoveries];
  rewards = [...initialRewards];
  users = [...initialUsers];
  pointTransactions = [...initialPointTransactions];
  activities = [...initialActivities];
  userProgress = [...initialUserProgress];
  redemptions = [...initialRedemptions];
  activeTokens: Map<string, string> = new Map(); // token -> userId

  constructor() {
    // Seed initial auth tokens for easy session recovery
    this.activeTokens.set('sanctum_token_traveler', 'usr_traveler_01');
    this.activeTokens.set('sanctum_token_manager', 'usr_manager_01');
    this.activeTokens.set('sanctum_token_government', 'usr_gov_01');
    this.activeTokens.set('sanctum_token_admin', 'usr_admin_01');
  }

  getUserById(id: string) {
    return this.users.find(u => u.id === id);
  }

  getUserByEmail(email: string) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserByToken(token: string) {
    const userId = this.activeTokens.get(token);
    if (!userId) return null;
    return this.getUserById(userId) || null;
  }

  // Calculate actual ledger balance
  getUserPointsBalance(userId: string): number {
    const credits = this.pointTransactions
      .filter(t => t.userId === userId && t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    const debits = this.pointTransactions
      .filter(t => t.userId === userId && t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
    return credits - debits;
  }

  getCompletedPoints(userId: string, destinationId: string): string[] {
    return this.activities
      .filter(a => a.userId === userId && a.destinationId === destinationId && a.type === 'explore_point_discovered')
      .map(a => a.referenceId);
  }

  getDestinationProgress(userId: string, destinationId: string): UserDestinationProgress {
    const destination = this.destinations.find(d => d.id === destinationId);
    const destinationPoints = this.explorePoints.filter(p => p.destinationId === destinationId && p.status === 'published');
    const completedPointIds = this.getCompletedPoints(userId, destinationId);

    return {
      destinationId,
      destinationName: destination?.name || 'Destinasi',
      totalExplorePoints: destinationPoints.length,
      completedExplorePoints: completedPointIds.length,
      completedPointIds,
      lastVisitedAt: new Date().toISOString()
    };
  }

  // Activity check for duplicate prevention (Idempotency)
  hasUserCompletedActivity(userId: string, type: string, referenceId: string): boolean {
    return this.activities.some(
      a => a.userId === userId && a.type === type && a.referenceId === referenceId
    );
  }
}

export const db = new DatabaseStore();

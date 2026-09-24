import React from 'react';
import {
  Compass,
  QrCode,
  MapPin,
  Gift,
  ArrowRight,
  Sparkles,
  Building2,
  Landmark,
  Store,
  Footprints,
  BookOpen,
  Clock,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { Destination, LocalDiscovery, ExplorePoint } from '../../types/index.js';
import heroImage from '../../assets/images/hero_takono_tourism_1790168118274.jpg';
import { TakonoLogo } from '../../components/TakonoLogo.js';

interface HomePageProps {
  explorePoints?: ExplorePoint[];
  destination: Destination | null;
  localDiscoveries: LocalDiscovery[];
  onNavigate: (path: string) => void;
  onOpenScanModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  destination,
  explorePoints = [],
  localDiscoveries,
  onNavigate,
  onOpenScanModal
}) => {
  return (
    <div className="min-h-screen bg-white">

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-100 bg-gradient-to-b from-blue-50/40 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-7 space-y-6">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span>Platform Pemandu Wisata & Smart Guide Interaktif</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight text-balance leading-none">
                  Malu Bertanya? <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600">
                    TAKONO.
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 max-w-xl text-balance font-normal leading-relaxed pt-1">
                  Temukan lebih banyak cerita, edukasi satwa, rute jalan kaki cerdas, dan kuliner UMKM lokal di setiap sudut Kebun Binatang Surabaya. Jangan sampai titik terbaik terlewat.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('/app')}
                  className="px-6 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-98"
                >
                  <Compass className="w-4 h-4" />
                  <span>Mulai Jelajah Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenScanModal}
                  className="px-6 py-3.5 bg-white text-slate-800 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all border border-slate-200 shadow-xs flex items-center gap-2 cursor-pointer hover:border-slate-300"
                >
                  <QrCode className="w-4 h-4 text-blue-600" />
                  <span>Scan QR Titik Destinasi</span>
                </button>
              </div>

              <div className="pt-2">

              </div>

              {/* Live Metric Badges */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 max-w-lg">
                <div className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">{explorePoints.length}</div>
                  <div className="text-xs text-slate-500 font-medium">Explore Points Aktif</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-black text-blue-600 font-mono tabular-nums">{explorePoints.reduce((sum,p)=>sum+p.pointsReward+(p.quiz?.questions.reduce((n,q)=>n+q.points,0)||0),0)}</div>
                  <div className="text-xs text-slate-500 font-medium">Jejak Points Hadiah</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono tabular-nums">{localDiscoveries.length}</div>
                  <div className="text-xs text-slate-500 font-medium">Mitra Lokal</div>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 group">
                <img
                  src={destination?.heroImage || heroImage}
                  alt="Wisatawan menjelajahi destinasi dengan TAKONO"
                  className="w-full h-[460px] object-cover transition-transform duration-700 group-hover:scale-103"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Destination Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 sm:p-5 bg-white/95 backdrop-blur-md rounded-2xl border border-white/80 shadow-lg space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-blue-700">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Destinasi Percontohan 2026</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[11px] font-semibold border border-emerald-200">
                      {destination?.operatingHours || 'Lihat destinasi'}
                    </span>
                  </div>

                  <div className="text-base font-extrabold text-slate-900 leading-tight">
                    {destination?.name || 'Jelajahi destinasi'}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      {destination?.city}
                    </span>
                    <button
                      onClick={() => onNavigate(destination ? '/destinations/'+destination.slug : '/destinations')}
                      className="text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Jelajahi Peta</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. VALUE PROPOSITION: BUKAN SEKADAR DIREKTORI */}
      <section className="py-20 bg-slate-50/80 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <span className="text-xs font-bold text-blue-700 tracking-wider uppercase">
              Solusi Pengalaman Pariwisata Terintegrasi
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Mengapa Berwisata Bersama TAKONO?
            </h2>
            <p className="text-slate-600 leading-relaxed text-balance text-base">
              Banyak potensi di sebuah destinasi yang belum tentu ditemukan oleh wisatawan. Seringkali orang hanya mendatangi titik paling populer dan melewatkan cerita edukatif, kekayaan sejarah, jadwal atraksi makan satwa, dan kuliner UMKM khas di sekitarnya. TAKONO menjawab pertanyaan penting: <strong className="text-slate-900">"Ada hal menarik apa lagi di sini?"</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="p-7 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Smart Guide Berbasis Rute</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Bukan peta statis biasa. Smart Guide memadukan preferensi minatmu (Edukasi Satwa, Sejarah Cagar Budaya, Wahana Anak, atau Jalur Santai) dengan rute jalan kaki interaktif di lapangan.
              </p>
              <div className="pt-2 text-xs font-semibold text-blue-600 flex items-center gap-1">
                <span>Rute Otomatis Sesuai Waktu</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            <div className="p-7 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Explore Point & Kuis Interaktif</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tiap titik fisik menyimpan narasi mendalam dan kuis interaktif yang menguji wawasanmu, menghasilkan reward langsung di setiap penemuan tanpa bikin bosan.
              </p>
              <div className="pt-2 text-xs font-semibold text-indigo-600 flex items-center gap-1">
                <span>Edukasi Menyenangkan untuk Keluarga</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            <div className="p-7 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Jejak Points & Mitra UMKM</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kumpulkan poin dari aktivitas jelajahmu dan tukarkan dengan diskon tiket, suvenir resmi, atau voucher makan di warung legendaris sekitar destinasi wisata.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <span>Dampak Ekonomi Nyata bagi Warga</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. ALUR PERJALANAN (8-STEP USER FLOW) */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-3xl mb-14">
            <span className="text-xs font-bold text-blue-700 tracking-wider uppercase">
              Alur Pengalaman Wisatawan
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
              Bagaimana TAKONO Bekerja?
            </h2>
            <p className="text-slate-600 text-base mt-2">
              Satu perjalanan mulus dari scan papan QR di gerbang masuk hingga penukaran reward bernilai.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { step: '01', title: 'Scan QR Destinasi', desc: 'Pindai papan QR selamat datang di gerbang masuk destinasi untuk membuka panduan instan.' },
              { step: '02', title: 'Login & Profil', desc: 'Masuk instan untuk menyimpan seluruh riwayat jelajah, stempel, dan Jejak Points.' },
              { step: '03', title: 'Pilih Preferensi', desc: 'Tentukan minat wisata: Edukasi Satwa, Cagar Budaya, Wahana Anak, atau Santai.' },
              { step: '04', title: 'Smart Guide Rute', desc: 'Ikuti peta rute jalan kaki dinamis menuju titik rekomendasi berikutnya.' },
              { step: '05', title: 'Tiba di Titik Jelajah', desc: 'Pindai kode titik fisik untuk menyingkap narasi rahasia & fakta menarik.' },
              { step: '06', title: 'Jawab Mini Kuis', desc: 'Uji wawasan lewat kuis seru berhadiah +25 hingga +50 Jejak Points instan.' },
              { step: '07', title: 'Koleksi Stempel', desc: 'Buku Album Jelajah otomatis mencatat setiap pencapaian dan foto memorimu.' },
              { step: '08', title: 'Klaim Reward & UMKM', desc: 'Tukarkan poin dengan voucher kuliner lokal atau suvenir resmi destinasi!' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400/80 hover:shadow-md transition-all space-y-2.5 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    LANGKAH {item.step}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-slate-300" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. DESTINASI AKTIF: KEBUN BINATANG SURABAYA */}
      {destination && (
        <section className="py-20 bg-slate-50/90 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-bold text-blue-700 tracking-wider uppercase">
                  Destinasi Terintegrasi Aktif
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
                  {destination.name}
                </h2>
                <p className="text-slate-600 text-sm mt-1 max-w-2xl">
                  {destination.tagline}
                </p>
              </div>

              <button
                onClick={() => onNavigate(destination ? '/destinations/'+destination.slug : '/destinations')}
                className="px-5 py-2.5 border border-slate-300 text-slate-800 bg-white rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-2 self-start md:self-auto cursor-pointer shadow-xs"
              >
                <span>Lihat Panduan Destinasi</span>
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">

              <div className="lg:col-span-6 space-y-5">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {destination.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block mb-1 font-medium text-[11px]">Jam Operasional</span>
                    <span className="font-bold text-slate-900 text-sm">{destination.operatingHours}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block mb-1 font-medium text-[11px]">Lokasi Destinasi</span>
                    <span className="font-bold text-slate-900 text-sm">{destination.city}, {destination.province}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  <span className="font-bold text-slate-900 block">Fasilitas Lengkap Terverifikasi:</span>
                  <div className="flex flex-wrap gap-2 text-slate-600">
                    {destination.facilities.map(f => (
                      <span key={f.id} className="px-3 py-1 bg-slate-100 rounded-lg border border-slate-200/60 text-[11px] font-medium">
                        {f.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onNavigate('/app/smart-guide')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-98"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Buka Smart Guide</span>
                  </button>
                  <button
                    onClick={onOpenScanModal}
                    className="px-5 py-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors"
                  >
                    Scan QR Destinasi
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-2 gap-3.5">
                <img
                  src={destination.heroImage}
                  alt={destination.name}
                  className="rounded-2xl h-52 w-full object-cover col-span-2 border border-slate-200 shadow-xs"
                  loading="lazy"
                />
                <img
                  src={destination.gallery?.[0] || destination.heroImage}
                  alt="Konservasi Gajah KBS"
                  className="rounded-2xl h-40 w-full object-cover border border-slate-200 shadow-xs"
                  loading="lazy"
                />
                <img
                  src={destination.gallery?.[1] || destination.heroImage}
                  alt="Aquarium Bersejarah KBS"
                  className="rounded-2xl h-40 w-full object-cover border border-slate-200 shadow-xs"
                  loading="lazy"
                />
              </div>

            </div>

          </div>
        </section>
      )}

      {/* 5. LOCAL DISCOVERY: MITRA UMKM & KULINER SEKITAR */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-700 tracking-wider uppercase">
                Ekonomi Kreatif & Pemberdayaan Lokal
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
                Local Discovery
              </h2>
              <p className="text-slate-600 text-sm mt-1 max-w-2xl">
                Mitra kuliner legendaris dan suvenir khas di sekitar destinasi yang memberikan keuntungan voucher eksklusif bagi penjelajah TAKONO.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/app/local-discovery')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Lihat Semua 6 Mitra UMKM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {localDiscoveries.slice(0, 3).map(partner => (
              <div
                key={partner.id}
                className="rounded-2xl border border-slate-200/90 overflow-hidden hover:shadow-lg transition-all bg-white flex flex-col justify-between group"
              >
                <div>
                  <div className="relative overflow-hidden h-48 bg-slate-100">
                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-blue-700 border border-white">
                      {partner.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span className="truncate max-w-[180px]">{partner.address}</span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        {partner.operatingHours}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {partner.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {partner.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-3">
                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 font-semibold flex items-center gap-2">
                    <Gift className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{partner.promotion}</span>
                  </div>

                  <button
                    onClick={() => onNavigate('/app/local-discovery')}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Buka Detail Promo & Rute
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center justify-center mb-2">
            <TakonoLogo variant="full" size="lg" theme="dark" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-balance leading-tight">
            Malu Bertanya? <span className="text-blue-500">TAKONO.</span>
          </h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto text-balance leading-relaxed">
            Mulailah menjelajahi keindahan, sejarah, dan potensi tersembunyi destinasi favoritmu dengan panduan digital yang cerdas dan interaktif.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('/app')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg active:scale-98 cursor-pointer"
            >
              Buka Aplikasi Wisatawan
            </button>
            <button
              onClick={() => onNavigate('/how-it-works')}
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm rounded-xl transition-all border border-slate-700 cursor-pointer"
            >
              Pelajari Cara Kerja
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

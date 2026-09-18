import React from 'react';
import { useTakonoStore } from '../../services/store';
import { 
  Users, 
  Compass, 
  BookOpen, 
  Coins, 
  Award, 
  Calendar, 
  QrCode, 
  BarChart3, 
  ArrowUpRight, 
  Settings, 
  ChevronRight,
  Building2,
  Sparkles
} from 'lucide-react';

export const ManagerDashboard: React.FC = () => {
  const store = useTakonoStore();
  const destinations = store.destinations || [];
  const explorePoints = store.explorePoints || [];
  const quizzes = store.quizzes || [];
  const rewards = store.rewards || [];
  const events = store.events || [];
  const navigateTo = store.navigateTo;

  const currentDest = destinations[0] || {
    id: 'dest-penglipuran',
    name: 'Desa Wisata Penglipuran',
    status: 'PUBLISHED',
    location: 'Bangli, Bali'
  };

  const destPoints = explorePoints.filter((p) => p.destinationId === currentDest.id);

  return (
    <div className="space-y-8 pb-16 font-sans text-neutral-800 antialiased max-w-7xl mx-auto">
      
      {/* 1. HERO MANAGER BANNER */}
      <div className="relative rounded-3xl bg-blue-600 text-white p-8 sm:p-10 overflow-hidden shadow-xl shadow-blue-500/20">
        
        {/* Abstract Wave Silhouette Background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-20">
          <svg className="h-full w-full fill-current text-white" viewBox="0 0 400 400" preserveAspectRatio="none">
            <path d="M150,0 Q300,150 200,300 T400,400 L400,0 Z" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold uppercase tracking-wider text-blue-100">
                DESTINATION MANAGEMENT
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-300/30 text-emerald-200 text-[10px] font-mono font-bold uppercase tracking-wider">
                STATUS: {currentDest.status || 'PUBLISHED'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {currentDest.name}
            </h1>

            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Kelola alur jelajah budaya, kuis interaktif, reward UMKM, dan kode QR resmi di lapangan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('/manager/destinations')}
            className="px-6 py-3 bg-white hover:bg-blue-50 text-blue-600 font-extrabold text-xs uppercase tracking-wider rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shrink-0"
          >
            <Settings className="w-4 h-4 text-blue-600" />
            <span>Konfigurasi Destinasi</span>
          </button>
        </div>
      </div>

      {/* 2. METRIC SUMMARY BENTO GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase font-mono tracking-wider">Total Kunjungan</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-neutral-900">2</span>
            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">+100%</span>
          </div>
          <span className="text-[11px] text-neutral-400 block font-mono">2 Pindai QR Tersebar</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase font-mono tracking-wider">Titik Jelajah</span>
            <Compass className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-neutral-900">{destPoints.length || 4}</span>
          </div>
          <span className="text-[11px] text-neutral-400 block font-mono">Titik Aktif Terpandu</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase font-mono tracking-wider">Kuis Terjawab</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-neutral-900">1</span>
          </div>
          <span className="text-[11px] text-neutral-400 block font-mono">Tingkat Edukasi Aktif</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase font-mono tracking-wider">Poin Beredar</span>
            <Coins className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-blue-600">+15</span>
            <span className="text-xs font-mono font-bold text-blue-600">PTS</span>
          </div>
          <span className="text-[11px] text-neutral-400 block font-mono">Jejak Points Dihasilkan</span>
        </div>

      </div>

      {/* 3. ALUR PENGELOLAAN DESTINASI (BENTO MANAGEMENT GRID) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
            ALUR PENGELOLAAN DESTINASI (SETUP CHAIN)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Explore Points */}
          <div 
            onClick={() => navigateTo('/manager/explore-points')}
            className="group bg-white p-6 rounded-3xl border border-neutral-200 hover:border-blue-300 hover:shadow-xl transition duration-300 cursor-pointer flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-base text-neutral-900 group-hover:text-blue-600 transition">
                Explore Points
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Tambah titik lokasi, susun urutan narasi budaya, estimasi durasi, dan etika lokal.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold font-mono text-blue-600">
              <span>{destPoints.length || 4} Titik Terpasang</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Kuis Budaya */}
          <div 
            onClick={() => navigateTo('/manager/quizzes')}
            className="group bg-white p-6 rounded-3xl border border-neutral-200 hover:border-blue-300 hover:shadow-xl transition duration-300 cursor-pointer flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-base text-neutral-900 group-hover:text-blue-600 transition">
                Kuis Budaya
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Buat kuis pilihan ganda yang terikat dengan Explore Point untuk reward poin traveler.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold font-mono text-blue-600">
              <span>{quizzes.length || 3} Kuis Dikonfigurasi</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Katalog Reward */}
          <div 
            onClick={() => navigateTo('/manager/rewards')}
            className="group bg-white p-6 rounded-3xl border border-neutral-200 hover:border-blue-300 hover:shadow-xl transition duration-300 cursor-pointer flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-base text-neutral-900 group-hover:text-blue-600 transition">
                Katalog Reward
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Atur reward penukaran poin, jumlah stok, dan integrasikan dengan produk mitra UMKM.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold font-mono text-blue-600">
              <span>{rewards.length || 3} Pilihan Reward</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Event & Festival */}
          <div 
            onClick={() => navigateTo('/manager/events')}
            className="group bg-white p-6 rounded-3xl border border-neutral-200 hover:border-blue-300 hover:shadow-xl transition duration-300 cursor-pointer flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-base text-neutral-900 group-hover:text-blue-600 transition">
                Event & Festival
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Jadwalkan perayaan desa adat, tari kolosal, dan lokakarya kebudayaan.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold font-mono text-blue-600">
              <span>{events.length || 1} Event Terdaftar</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Generator & Cetak QR */}
          <div 
            onClick={() => navigateTo('/manager/qr-codes')}
            className="group bg-white p-6 rounded-3xl border border-neutral-200 hover:border-blue-300 hover:shadow-xl transition duration-300 cursor-pointer flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition">
                <QrCode className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-base text-neutral-900 group-hover:text-blue-600 transition">
                Generator & Cetak QR
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Unduh barcode QR beresolusi tinggi untuk dipasang di plakat gerbang & titik jelajah.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold font-mono text-blue-600">
              <span>5 QR Tergenerate</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Analitik Pengunjung */}
          <div 
            onClick={() => navigateTo('/manager/analytics')}
            className="group bg-white p-6 rounded-3xl border border-neutral-200 hover:border-blue-300 hover:shadow-xl transition duration-300 cursor-pointer flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-base text-neutral-900 group-hover:text-blue-600 transition">
                Analitik Pengunjung
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Pantau statistik scan, tingkat keterlibatan, titik paling populer, dan perputaran poin.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold font-mono text-blue-600">
              <span>Lihat Laporan Lengkap</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ManagerDashboard;
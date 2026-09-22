import React from 'react';
import { useTakonoStore } from '../../services/store';
import {
  BarChart3,
  MapPin,
  Compass,
  BookOpen,
  Award,
  Calendar,
  QrCode,
  Users,
  Coins,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  ShieldCheck,
  Layers,
} from 'lucide-react';

export const ManagerDashboard: React.FC = () => {
  const {
    currentUser,
    destinations,
    explorePoints,
    quizzes,
    rewards,
    events,
    qrCodes,
    journeys,
    analyticsEvents,
    navigateTo,
  } = useTakonoStore();

  // Find destinations managed by this user
  const managedDestinations = destinations.filter((d) => d.managerId === currentUser.id);
  const primaryDest = managedDestinations[0] || destinations[0];

  const destPoints = explorePoints.filter((p) => p.destinationId === primaryDest?.id);
  const destQuizzes = quizzes.filter((q) => q.destinationId === primaryDest?.id);
  const destRewards = rewards.filter((r) => r.destinationId === primaryDest?.id);
  const destEvents = events.filter((e) => e.destinationId === primaryDest?.id);
  const destQrs = qrCodes.filter((q) => q.destinationId === primaryDest?.id);
  const destJourneys = journeys.filter((j) => j.destinationId === primaryDest?.id);

  // Quick Stats
  const totalScans = analyticsEvents.filter(
    (a) => a.eventType === 'qr_scan' && a.destinationId === primaryDest?.id
  ).length;
  const totalQuizzesPassed = destJourneys.reduce(
    (acc, j) => acc + j.completedQuizzes.length,
    0
  );
  const totalPointsAwarded = destJourneys.reduce(
    (acc, j) => acc + j.earnedPointsTotal,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans text-neutral-900 antialiased">
      
      {/* Enterprise Header Banner */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xs p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-100 text-neutral-700 text-[11px] font-mono font-bold uppercase tracking-wider border border-neutral-200">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>Destination Control Panel</span>
            </span>

            {primaryDest && (
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-lg border ${
                  primaryDest.status === 'published'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${primaryDest.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span>Status: {primaryDest.status.toUpperCase()}</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
            {primaryDest ? primaryDest.name : 'Dashboard Pengelola Destinasi'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
            Pusat kendali operasional alur jelajah budaya, kuis interaktif, reward UMKM, dan pemindaian kode QR di lapangan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('/manager/destinations')}
          className="px-6 py-3.5 bg-neutral-900 hover:bg-blue-600 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-2 shrink-0 self-start lg:self-auto"
        >
          <MapPin className="w-4 h-4 text-blue-400" />
          <span>Konfigurasi Destinasi</span>
        </button>
      </div>

      {/* Primary Metrics Grid (High-End Operator Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-mono font-bold uppercase tracking-wider">Total Kunjungan</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="pt-1">
            <span className="text-3xl sm:text-4xl font-black font-mono text-neutral-900 tracking-tight">
              {destJourneys.length}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
              +{totalScans} Pindai QR Tercatat
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-mono font-bold uppercase tracking-wider">Titik Jelajah</span>
            <Compass className="w-4 h-4 text-blue-600" />
          </div>
          <div className="pt-1">
            <span className="text-3xl sm:text-4xl font-black font-mono text-neutral-900 tracking-tight">
              {destPoints.length}
            </span>
            <span className="text-[11px] text-neutral-500 block mt-1">Titik Aktif Terpandu</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-mono font-bold uppercase tracking-wider">Kuis Terjawab</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="pt-1">
            <span className="text-3xl sm:text-4xl font-black font-mono text-neutral-900 tracking-tight">
              {totalQuizzesPassed}
            </span>
            <span className="text-[11px] text-neutral-500 block mt-1">Tingkat edukasi aktif</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-mono font-bold uppercase tracking-wider">Poin Beredar</span>
            <Coins className="w-4 h-4 text-amber-600" />
          </div>
          <div className="pt-1">
            <span className="text-3xl sm:text-4xl font-black font-mono text-amber-600 tracking-tight">
              +{totalPointsAwarded}
            </span>
            <span className="text-[11px] text-neutral-500 block mt-1">Jejak Points dihasilkan</span>
          </div>
        </div>
      </div>

      {/* Module Navigation Grid (Flow A: Destination Setup Chain) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 px-1">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Alur Pengelolaan Destinasi (Setup Chain)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            onClick={() => navigateTo('/manager/explore-points')}
            className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs hover:border-blue-500 hover:shadow-md transition cursor-pointer space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-black text-neutral-900 text-base group-hover:text-blue-600 transition tracking-tight">
                Explore Points
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Tambah titik lokasi, susun urutan narasi budaya, estimasi durasi, dan etika lokal.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-xs font-bold text-blue-600">
              <span className="font-mono">{destPoints.length} Titik Terpasang</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          <div
            onClick={() => navigateTo('/manager/quizzes')}
            className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs hover:border-blue-500 hover:shadow-md transition cursor-pointer space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-black text-neutral-900 text-base group-hover:text-blue-600 transition tracking-tight">
                Kuis Budaya
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Buat kuis pilihan ganda yang terikat dengan Explore Point untuk reward poin traveler.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-xs font-bold text-blue-600">
              <span className="font-mono">{destQuizzes.length} Kuis Dikonfigurasi</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          <div
            onClick={() => navigateTo('/manager/rewards')}
            className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs hover:border-blue-500 hover:shadow-md transition cursor-pointer space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-black text-neutral-900 text-base group-hover:text-blue-600 transition tracking-tight">
                Katalog Reward
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Atur reward penukaran poin, jumlah stok, dan integrasikan dengan produk mitra UMKM.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-xs font-bold text-amber-700">
              <span className="font-mono">{destRewards.length} Pilihan Reward</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          <div
            onClick={() => navigateTo('/manager/events')}
            className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs hover:border-blue-500 hover:shadow-md transition cursor-pointer space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-black text-neutral-900 text-base group-hover:text-blue-600 transition tracking-tight">
                Event & Festival
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Jadwalkan perayaan desa adat, tari kolosal, dan lokakarya kebudayaan.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-xs font-bold text-purple-700">
              <span className="font-mono">{destEvents.length} Event Terdaftar</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          <div
            onClick={() => navigateTo('/manager/qr-codes')}
            className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs hover:border-blue-500 hover:shadow-md transition cursor-pointer space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-black text-neutral-900 text-base group-hover:text-blue-600 transition tracking-tight">
                Generator & Cetak QR
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Unduh barcode QR beresolusi tinggi untuk dipasang di plakat gerbang, titik jelajah, & event.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-xs font-bold text-teal-700">
              <span className="font-mono">{destQrs.length} QR Tergenerate</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          <div
            onClick={() => navigateTo('/manager/analytics')}
            className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs hover:border-blue-500 hover:shadow-md transition cursor-pointer space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-black text-neutral-900 text-base group-hover:text-blue-600 transition tracking-tight">
                Analitik Pengunjung
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Pantau statistik scan, tingkat keterlibatan, titik paling populer, dan perputaran poin.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-xs font-bold text-blue-600">
              <span className="font-mono">Lihat Laporan Lengkap</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
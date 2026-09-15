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
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-md border border-indigo-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500 text-white">
              Destination Management Control
            </span>
            {primaryDest && (
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  primaryDest.status === 'published'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                Status: {primaryDest.status.toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {primaryDest ? primaryDest.name : 'Dashboard Pengelola Destinasi'}
          </h1>
          <p className="text-xs text-slate-300">
            Kelola alur jelajah budaya, kuis interaktif, reward UMKM, dan kode QR resmi di lapangan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('/manager/destinations')}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-1.5 shadow-sm"
        >
          <MapPin className="w-4 h-4" />
          <span>Konfigurasi Destinasi</span>
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Kunjungan</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-2xl font-bold text-slate-900 font-mono">
            {destJourneys.length}
          </span>
          <span className="text-[11px] text-emerald-600 font-medium block">
            {totalScans} Pindai QR Tercatat
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Titik Jelajah</span>
            <Compass className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold text-slate-900 font-mono">
            {destPoints.length}
          </span>
          <span className="text-[11px] text-slate-500 block">Titik Aktif Terpandu</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Kuis Terjawab</span>
            <BookOpen className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-slate-900 font-mono">
            {totalQuizzesPassed}
          </span>
          <span className="text-[11px] text-slate-500 block">Tingkat edukasi aktif</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Poin Beredar</span>
            <Coins className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-bold text-amber-600 font-mono">
            +{totalPointsAwarded}
          </span>
          <span className="text-[11px] text-slate-500 block">Jejak Points dihasilkan</span>
        </div>
      </div>

      {/* Module Navigation Grid (Flow A: Destination Setup Steps) */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Alur Pengelolaan Destinasi (Setup Chain):
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            onClick={() => navigateTo('/manager/explore-points')}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-sm transition cursor-pointer space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 pt-1">Explore Points</h3>
              <p className="text-xs text-slate-500">
                Tambah titik lokasi, susun urutan narasi budaya, estimasi durasi, dan etika lokal.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-emerald-700 font-semibold">
              <span>{destPoints.length} Titik Terpasang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => navigateTo('/manager/quizzes')}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-500 hover:shadow-sm transition cursor-pointer space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 pt-1">Kuis Budaya</h3>
              <p className="text-xs text-slate-500">
                Buat kuis pilihan ganda yang terikat dengan Explore Point untuk reward poin traveler.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-indigo-700 font-semibold">
              <span>{destQuizzes.length} Kuis Dikonfigurasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => navigateTo('/manager/rewards')}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-amber-500 hover:shadow-sm transition cursor-pointer space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 pt-1">Katalog Reward</h3>
              <p className="text-xs text-slate-500">
                Atur reward penukaran poin, jumlah stok, dan integrasikan dengan produk mitra UMKM.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-amber-700 font-semibold">
              <span>{destRewards.length} Pilihan Reward</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => navigateTo('/manager/events')}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-purple-500 hover:shadow-sm transition cursor-pointer space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 pt-1">Event & Festival</h3>
              <p className="text-xs text-slate-500">
                Jadwalkan perayaan desa adat, tari kolosal, dan lokakarya kebudayaan.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-purple-700 font-semibold">
              <span>{destEvents.length} Event Terdaftar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => navigateTo('/manager/qr-codes')}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-sm transition cursor-pointer space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                <QrCode className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 pt-1">Generator & Cetak QR</h3>
              <p className="text-xs text-slate-500">
                Unduh barcode QR beresolusi tinggi untuk dipasang di plakat gerbang, titik jelajah, & event.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-teal-700 font-semibold">
              <span>{destQrs.length} QR Tergenerate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => navigateTo('/manager/analytics')}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-500 hover:shadow-sm transition cursor-pointer space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 pt-1">Analitik Pengunjung</h3>
              <p className="text-xs text-slate-500">
                Pantau statistik scan, tingkat keterlibatan, titik paling populer, dan perputaran poin.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-blue-700 font-semibold">
              <span>Lihat Laporan Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { InteractivePointModal } from './InteractivePointModal';
import { calculateSmartGuideRecommendation } from '../../services/smartGuideEngine';
import { ExplorePoint } from '../../types/destination';
import confetti from 'canvas-confetti';
import {
  Compass,
  QrCode,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Clock,
  Coins,
  ShoppingBag,
  ChevronRight,
  RotateCcw,
  Footprints,
  ShieldCheck,
  Check,
  Search,
  Globe,
  Award,
} from 'lucide-react';

export const TravelerHome: React.FC = () => {
  const {
    currentUser,
    destinations,
    explorePoints,
    activeJourney,
    leaveDestination,
    navigateTo,
    setQrModalOpen,
    redeemReward,
    getRewardsByDestination,
    verifyGatePasscode,
  } = useTakonoStore();

  const [selectedPointForModal, setSelectedPointForModal] = useState<ExplorePoint | null>(null);
  const [pointModalOpen, setPointModalOpen] = useState<boolean>(false);
  const [quickRedeemMsg, setQuickRedeemMsg] = useState<string | null>(null);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [checkInSuccessMsg, setCheckInSuccessMsg] = useState<string | null>(null);

  const activeDest = activeJourney
    ? destinations.find((d) => d.id === activeJourney.destinationId)
    : null;

  const destPoints = activeDest
    ? explorePoints
        .filter((p) => p.destinationId === activeDest.id)
        .sort((a, b) => a.sequenceOrder - b.sequenceOrder)
    : [];

  const completedPointsCount = activeJourney
    ? activeJourney.visitedPoints.filter((vp) => !!vp.completedAt).length
    : 0;

  const totalPointsForActive = destPoints.length;
  const progressPercent =
    totalPointsForActive > 0
      ? Math.round((completedPointsCount / totalPointsForActive) * 100)
      : 0;

  // Next recommended point in active destination
  const smartRec = activeDest
    ? calculateSmartGuideRecommendation(destPoints, activeJourney || undefined)
    : null;

  const handleOpenPoint = (point: ExplorePoint) => {
    setSelectedPointForModal(point);
    setPointModalOpen(true);
  };

  const handleQuickClaimReward = (rewardId: string, title: string) => {
    const res = redeemReward(rewardId);
    if (res.success) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setQuickRedeemMsg(`Berhasil menukar "${title}"! Kode: ${res.claimCode}`);
      setTimeout(() => setQuickRedeemMsg(null), 5000);
    } else {
      alert(res.message);
    }
  };

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    const matchedDest = verifyGatePasscode(passcode.trim());
    if (matchedDest) {
      setPasscodeError('');
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
      setCheckInSuccessMsg(`Berhasil Check-In di ${matchedDest.name}! Panduan rute dan plakat budaya telah diaktifkan.`);
      setTimeout(() => setCheckInSuccessMsg(null), 5000);
    } else {
      setPasscodeError('Kode gerbang tidak valid. Coba: dest-penglipuran atau dest-prambanan');
    }
  };

  /* =========================================================================
     CASE 1: NO ACTIVE DESTINATION SCANNED YET
     ========================================================================= */
  if (!activeDest) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-12 font-sans text-neutral-900 antialiased">
        {checkInSuccessMsg && (
          <div className="pt-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-sm font-semibold">{checkInSuccessMsg}</span>
            </div>
          </div>
        )}

        <section className="relative pt-4 lg:pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Ekowisata & Warisan Budaya</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 leading-[1.1]">
                Jelajahi Warisan <br />
                <span className="text-blue-600">Budaya Nusantara</span>
              </h1>

              <p className="text-neutral-600 text-base sm:text-lg max-w-xl leading-relaxed">
                Nikmati pengalaman wisata imersif. Pindai plakat di gerbang masuk, selesaikan kuis budaya, dan kumpulkan poin untuk ditukarkan produk UMKM lokal.
              </p>

              <div className="bg-white p-3 rounded-2xl border border-neutral-200 shadow-xl shadow-neutral-100 space-y-3">
                <form onSubmit={handleVerifyPasscode} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        setPasscodeError('');
                      }}
                      placeholder="Masukkan kode gerbang (cth: dest-penglipuran)"
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 rounded-xl text-xs sm:text-sm font-mono border border-neutral-200 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shrink-0 shadow-md shadow-blue-500/20"
                  >
                    <span>Verifikasi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {passcodeError && (
                  <p className="text-xs text-rose-600 font-medium px-2">{passcodeError}</p>
                )}

                <div className="flex items-center justify-between border-t border-neutral-100 pt-2.5 px-1">
                  <span className="text-xs text-neutral-500">Atau gunakan pemindai cepat:</span>
                  <button
                    type="button"
                    onClick={() => setQrModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Buka Kamera QR</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex -space-x-2">
                  <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="User" />
                  <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="User" />
                  <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="User" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-neutral-900">2,400+ Penjelajah Aktif</span>
                  <span className="text-[11px] text-neutral-500">Telah melestarikan budaya lokal</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-64 rounded-3xl overflow-hidden border border-neutral-200 shadow-md bg-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80"
                      alt="Bali Culture"
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-6 rounded-3xl bg-blue-600 text-white space-y-2 shadow-lg shadow-blue-500/25">
                    <div className="flex items-center justify-between">
                      <Award className="w-6 h-6 text-blue-200" />
                      <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-md bg-white/20 text-white">Poin Aktif</span>
                    </div>
                    <div className="text-3xl font-black font-mono">{currentUser.pointsBalance} PTS</div>
                    <p className="text-xs font-medium text-blue-100">Tukarkan voucher kuliner & suvenir khas warga.</p>
                  </div>
                </div>

                <div className="space-y-4 pt-8">
                  <div className="p-6 rounded-3xl bg-neutral-900 text-white space-y-2">
                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                    <h4 className="font-bold text-sm">Terverifikasi Plakat</h4>
                    <p className="text-xs text-neutral-400">Konten resmi dari dinas & pengelola adat setempat.</p>
                  </div>
                  <div className="h-64 rounded-3xl overflow-hidden border border-neutral-200 shadow-md bg-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80"
                      alt="Temple"
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl p-8 border border-neutral-200/90 shadow-2xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-100">
            <div className="pt-4 md:pt-0">
              <span className="block text-3xl font-black font-mono text-neutral-900">100+</span>
              <span className="text-xs font-medium text-neutral-500">Titik Plakat Budaya</span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="block text-3xl font-black font-mono text-neutral-900">50+</span>
              <span className="text-xs font-medium text-neutral-500">Mitra UMKM Desa</span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="block text-3xl font-black font-mono text-neutral-900">12K+</span>
              <span className="text-xs font-medium text-neutral-500">Kuis Budaya Selesai</span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="block text-3xl font-black font-mono text-blue-600">100%</span>
              <span className="text-xs font-medium text-neutral-500">Keberlanjutan Lokal</span>
            </div>
          </div>
        </section>

        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600">Panduan Langkah</span>
            <h2 className="text-3xl font-black tracking-tight text-neutral-900">Bagaimana Cara Kerjanya?</h2>
            <p className="text-neutral-500 text-sm">Tiga langkah mudah menikmati wisata budaya yang bermakna dan berdampak bagi warga lokal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-neutral-200 hover:border-neutral-300 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black font-mono text-lg">01</div>
              <h3 className="font-bold text-lg text-neutral-900">Pindai Plakat Gerbang</h3>
              <p className="text-neutral-500 text-xs leading-relaxed">Arahkan kamera ke kode QR resmi di pintu masuk wisata untuk mengaktifkan alur rute dan pemandu pintar.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-neutral-200 hover:border-neutral-300 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-black font-mono text-lg">02</div>
              <h3 className="font-bold text-lg text-neutral-900">Jelajahi & Jawab Kuis</h3>
              <p className="text-neutral-500 text-xs leading-relaxed">Kunjungi setiap titik lokasi budaya, pelajari narasi sejarah adat, dan jawab kuis edukatif untuk mengumpulkan poin.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-neutral-200 hover:border-neutral-300 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-black font-mono text-lg">03</div>
              <h3 className="font-bold text-lg text-neutral-900">Tukar Poin di UMKM</h3>
              <p className="text-neutral-500 text-xs leading-relaxed">Gunakan poin untuk mengklaim kupon diskon kuliner khas, cenderamata, dan karya pengerajin warga lokal.</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* =========================================================================
     CASE 2: ACTIVE DESTINATION SCANNED
     ========================================================================= */
  const activeRewards = getRewardsByDestination(activeDest.id).filter((r) => r.status === 'active');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans text-neutral-900 antialiased">
      {/* Toast Notification for Quick Redeem */}
      {quickRedeemMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">{quickRedeemMsg}</span>
        </div>
      )}

      {/* 1. TOP ACTIVE LOCATION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-white border border-neutral-200/90 rounded-2xl text-xs shadow-2xs">
        <div className="flex items-center gap-3 text-neutral-800 font-semibold">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
          </span>
          <span className="text-neutral-400 font-medium">Sedang Mengunjungi:</span>
          <span className="font-black text-neutral-900 text-sm tracking-tight">
            {activeDest.name}
          </span>
          <span className="text-neutral-500 font-mono text-[11px] bg-neutral-100 px-2.5 py-1 rounded-lg">
            {activeDest.regency}, {activeDest.province}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Selesai mengunjungi ${activeDest.name}? Anda dapat memindai gerbang masuk wisata lain setelah ini.`)) {
              leaveDestination();
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200 font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
          <span>Ganti Lokasi / Pindai Gerbang Lain</span>
        </button>
      </div>

      {/* 2. DESTINATION HERO CARD */}
      <div className="relative rounded-3xl bg-neutral-950 text-white overflow-hidden shadow-xl border border-neutral-800">
        <div className="relative h-72 sm:h-80 w-full overflow-hidden">
          <img
            src={activeDest.heroImage}
            alt={activeDest.name}
            className="w-full h-full object-cover brightness-[0.75] hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

          {/* Hero Content Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{activeDest.regency}, {activeDest.province}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {activeDest.name}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 leading-relaxed font-normal">
                {activeDest.description}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-blue-500/25"
              >
                <QrCode className="w-4 h-4" />
                <span>Pindai QR Plakat di Titik</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('/traveler/smart-guide')}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 transition border border-white/20"
              >
                <Compass className="w-4 h-4" />
                <span>Rute Cerdas</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Strip */}
        <div className="px-6 py-4 bg-neutral-900 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-300 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Buka: 08:00 - 18:30 WITA</span>
            </span>
            <span className="text-neutral-600">•</span>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>{destPoints.length} Titik Plakat Budaya</span>
            </span>
          </div>

          <div className="flex items-center gap-2 bg-neutral-950 px-4 py-1.5 rounded-xl border border-neutral-800">
            <span className="text-neutral-400 font-sans text-xs">Dompet Jejak Anda:</span>
            <span className="font-black text-amber-400 text-sm">{currentUser.pointsBalance} PTS</span>
          </div>
        </div>
      </div>

      {/* 3. ACTIVE JOURNEY PROGRESS COMPANION */}
      <div className="p-7 rounded-3xl bg-white border border-neutral-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
              Progres Jelajah Aktif
            </span>
            <h2 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight pt-1">
              {completedPointsCount} dari {totalPointsForActive} Titik Warisan Selesai ({progressPercent}%)
            </h2>
          </div>

          <div className="flex items-center gap-2.5 bg-neutral-50 px-4 py-2 rounded-2xl border border-neutral-200">
            <span className="text-xs text-neutral-500 font-medium">Poin Sesi Ini:</span>
            <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-mono font-black text-xs shadow-xs">
              +{activeJourney.earnedPointsTotal} PTS
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden p-0.5 border border-neutral-200/60">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* SMART GUIDE RECOMMENDATION CALLOUT */}
        {smartRec?.recommendedPoint && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-neutral-50 to-white border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white">
                    Rekomendasi Rute Selanjutnya
                  </span>
                  <span className="text-xs font-semibold text-neutral-500 font-mono">
                    Titik #{smartRec.recommendedPoint?.sequenceOrder}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-neutral-900">
                  {smartRec.recommendedPoint?.name}
                </h3>
                <p className="text-xs text-neutral-600 line-clamp-1 leading-relaxed">
                  {smartRec.reason}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => smartRec.recommendedPoint && handleOpenPoint(smartRec.recommendedPoint)}
              className="px-5 py-3 bg-neutral-900 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 shadow-sm shrink-0"
            >
              <span>Buka Materi Titik</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 4. SEQUENTIAL HERITAGE POINTS AT THIS DESTINATION */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2.5">
              <Footprints className="w-5 h-5 text-blue-600" />
              <span>Titik Jelajah Warisan Budaya Berurutan</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Kunjungi dan pelajari etika adat di setiap titik untuk mengumpulkan poin dan membuka kuis.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('/traveler/smart-guide')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
          >
            <span>Peta Rute Interaktif</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {destPoints.map((point) => {
            const visitedRecord = activeJourney.visitedPoints.find(
              (vp) => vp.explorePointId === point.id
            );
            const isCompleted = !!visitedRecord?.completedAt;
            const isRecommended = smartRec?.recommendedPoint?.id === point.id;

            return (
              <div
                key={point.id}
                onClick={() => handleOpenPoint(point)}
                className={`p-6 rounded-3xl border transition cursor-pointer flex flex-col justify-between space-y-4 ${
                  isCompleted
                    ? 'bg-emerald-50/30 border-emerald-200/80 shadow-2xs'
                    : isRecommended
                    ? 'bg-white border-blue-500 shadow-lg shadow-blue-500/5 ring-2 ring-blue-500/10'
                    : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black font-mono text-xs ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : isRecommended
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : `#${point.sequenceOrder}`}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 leading-tight">
                        {point.name}
                      </h3>
                      <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                        {point.category}
                      </span>
                    </div>
                  </div>

                  {isCompleted ? (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selesai</span>
                    </span>
                  ) : isRecommended ? (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 font-mono">
                      Rekomendasi
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                      +{point.completionPoints || 5} PTS
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                  {point.storySummary}
                </p>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>~{point.estimatedMinutes} menit jelajah</span>
                  </span>

                  <span className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5">
                    <span>Pelajari & Kuis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. LOCAL UMKM DISCOUNTS AT THIS DESTINATION */}
      <div className="p-7 rounded-3xl bg-white border border-neutral-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-neutral-900 tracking-tight">
                Voucher Diskon Warung & UMKM di {activeDest.name}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Tukarkan Jejak Points hasil kuis Anda dengan promo kuliner & kerajinan tangan warga sekitar.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('/traveler/points')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0 transition"
          >
            <span>Semua Hadiah</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {activeRewards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {activeRewards.slice(0, 3).map((reward) => (
              <div
                key={reward.id}
                className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 flex flex-col justify-between space-y-4 hover:border-amber-300 transition"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                    {reward.category}
                  </span>
                  <h3 className="font-extrabold text-xs sm:text-sm text-neutral-900 mt-1 leading-snug">
                    {reward.title}
                  </h3>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                    {reward.description}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-neutral-200/70 flex items-center justify-between">
                  <span className="font-black text-xs text-neutral-900 font-mono bg-amber-50 text-amber-800 px-2 py-1 rounded-lg border border-amber-200/50">
                    {reward.pointsCost} PTS
                  </span>

                  <button
                    type="button"
                    onClick={() => handleQuickClaimReward(reward.id, reward.title)}
                    disabled={currentUser.pointsBalance < reward.pointsCost}
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider transition shadow-2xs"
                  >
                    Tukar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-neutral-50 rounded-2xl text-center text-xs text-neutral-500 font-mono border border-dashed border-neutral-200">
            Katalog voucher lokal untuk destinasi ini sedang disiapkan oleh mitra UMKM warga.
          </div>
        )}
      </div>

      {/* Unified Interactive Point Modal */}
      <InteractivePointModal
        point={selectedPointForModal}
        isOpen={pointModalOpen}
        onClose={() => {
          setPointModalOpen(false);
          setSelectedPointForModal(null);
        }}
        onNavigateToNextPoint={(nextPointId) => {
          const nextPt = destPoints.find((p) => p.id === nextPointId);
          if (nextPt) {
            setSelectedPointForModal(nextPt);
          } else {
            setPointModalOpen(false);
          }
        }}
      />
    </div>
  );
};
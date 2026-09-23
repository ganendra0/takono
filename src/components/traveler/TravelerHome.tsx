import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
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

  // PERBAIKAN: Hitung titik selesai berdasarkan completedAt, quizPassed, atau pointsEarned > 0
  const completedPointsCount = activeJourney
    ? activeJourney.visitedPoints.filter(
        (vp) => !!vp.completedAt || vp.quizPassed || (vp.pointsEarned && vp.pointsEarned > 0)
      ).length
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

  // Navigasi langsung ke halaman penuh detail titik
  const handleOpenPoint = (point: ExplorePoint) => {
    navigateTo(`/traveler/explore/${point.id}`);
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
  const targetPoint = smartRec?.recommendedPoint || destPoints[0];

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

      {/* 3. SECTION PANDUAN RUTE JELAJAH BUDAYA */}
      <div className="space-y-6">
        
        {/* Card Header & Pilihan Manajer */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-2xs space-y-6">
          {/* Header & Progress Rute Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Footprints className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  PANDUAN RUTE JELAJAH BUDAYA
                </span>
              </div>
              <h2 className="text-2xl font-black text-neutral-900 tracking-tight pt-1">
                Mau ke mana selanjutnya?
              </h2>
              <p className="text-xs text-neutral-500">
                Rekomendasi titik warisan budaya berurutan agar perjalanan Anda lebih bermakna dan terarah.
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-4 min-w-[240px] shrink-0">
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-neutral-700">Progres Rute di {activeDest.name}</span>
                <span className="text-emerald-600 font-mono">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] text-neutral-400 font-mono mt-2 block">
                {completedPointsCount} dari {totalPointsForActive} titik warisan terselesaikan
              </span>
            </div>
          </div>

          {/* Card Pilihan Manajer (Rekomendasi) */}
          {targetPoint && (
            <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-500 text-neutral-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                    PILIHAN MANAJER
                  </span>
                  <span className="text-xs text-neutral-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" /> Est. {targetPoint.estimatedMinutes || 15} menit
                  </span>
                </div>
                <span className="text-xs font-mono text-neutral-400 font-bold">
                  Titik #{targetPoint.sequenceOrder} dari {totalPointsForActive}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {targetPoint.name}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-3xl">
                  {targetPoint.shortDescription || targetPoint.storySummary}
                </p>
              </div>

              <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl p-4 text-xs text-neutral-300">
                <strong className="text-emerald-400 font-mono">Alasan Panduan:</strong> {smartRec?.reason || 'Rekomendasi kurasi utama dari Pengelola Destinasi untuk pengalaman budaya terbaik.'}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{targetPoint.locationHint || 'Pintu Masuk Utama ' + activeDest.name}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenPoint(targetPoint)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95 shrink-0"
                >
                  <span>Buka Panduan & Kuis (+{targetPoint.completionPoints || 5} Pts)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Daftar Urutan Titik Jelajah Berurutan */}
        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
            <Footprints className="w-5 h-5 text-blue-600" />
            <span>Daftar Urutan Rute Kunjungan ({destPoints.length} Titik)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {destPoints.map((point) => {
              const visitedRecord = activeJourney.visitedPoints.find(
                (vp) => vp.explorePointId === point.id
              );
              // PERBAIKAN: Tandai selesai jika completedAt, quizPassed, atau pointsEarned > 0 bernilai true
              const isCompleted = !!(
                visitedRecord?.completedAt ||
                visitedRecord?.quizPassed ||
                (visitedRecord?.pointsEarned && visitedRecord.pointsEarned > 0)
              );

              return (
                <div
                  key={point.id}
                  onClick={() => handleOpenPoint(point)}
                  className={`p-5 rounded-3xl border transition cursor-pointer flex items-center justify-between gap-4 group ${
                    isCompleted
                      ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-400'
                      : 'bg-white border-neutral-200 hover:border-blue-400 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl font-mono font-black text-sm flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-neutral-100 text-neutral-700 group-hover:bg-blue-600 group-hover:text-white transition duration-300'
                      }`}
                    >
                      #{point.sequenceOrder}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-neutral-900 tracking-tight group-hover:text-blue-600 transition">
                          {point.name}
                        </h4>
                        {isCompleted && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 line-clamp-1">
                        {point.shortDescription}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-1 transition shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 4. LOCAL UMKM DISCOUNTS AT THIS DESTINATION */}
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
    </div>
  );
};
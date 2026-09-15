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
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Coins,
  BookOpen,
  Award,
  ShoppingBag,
  Tag,
  Check,
  ChevronRight,
  Camera,
  RotateCcw,
  Footprints,
  Info,
  ShieldCheck,
  Sparkle,
} from 'lucide-react';

export const TravelerHome: React.FC = () => {
  const {
    currentUser,
    destinations,
    explorePoints,
    activeJourney,
    startOrResumeJourney,
    leaveDestination,
    navigateTo,
    setQrModalOpen,
    redeemReward,
    getRewardsByDestination,
    simulateScanCode,
  } = useTakonoStore();

  const [selectedPointForModal, setSelectedPointForModal] = useState<ExplorePoint | null>(null);
  const [pointModalOpen, setPointModalOpen] = useState<boolean>(false);
  const [quickRedeemMsg, setQuickRedeemMsg] = useState<string | null>(null);
  const [manualCodeInput, setManualCodeInput] = useState<string>('');
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

  const handleScanGate = (gateCode: string, destName: string) => {
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
    simulateScanCode(gateCode);
    setCheckInSuccessMsg(`Berhasil Check-In di ${destName}! Panduan rute dan plakat budaya telah diaktifkan.`);
    setTimeout(() => setCheckInSuccessMsg(null), 5000);
  };

  const handleManualGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCodeInput.trim()) return;
    simulateScanCode(manualCodeInput.trim());
    setManualCodeInput('');
  };

  /* =========================================================================
     CASE 1: NO ACTIVE DESTINATION SCANNED YET (PROMINENT GATE SCAN LANDING)
     The user is at the entrance gate of a tourist destination.
     We prioritize the Call-to-Action to SCAN, without showing destination catalogs.
     ========================================================================= */
  if (!activeDest) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Success Alert if just checked in */}
        {checkInSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-semibold">{checkInSuccessMsg}</span>
          </div>
        )}

        {/* 1. HERO: PROMINENT CALL TO SCAN AT ENTRANCE GATE */}
        <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white p-6 sm:p-10 overflow-hidden shadow-2xl border border-emerald-800/60">
          {/* Background decorative glow */}
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gerbang Masuk Digital • TAKONO Heritage</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Pindai QR di Gerbang Masuk Wisata
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Selamat datang di kawasan wisata budaya nusantara! Plakat QR resmi terpasang di gerbang masuk untuk memverifikasi kedatangan Anda, mengaktifkan peta panduan budaya, dan membuka diskon UMKM warga lokal.
            </p>

            {/* Prominent Optical Scanner Trigger */}
            <div className="pt-2 w-full flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-sm flex items-center justify-center gap-3 transition shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Camera className="w-5 h-5 text-slate-950" />
                <span>Buka Kamera Pemindai QR</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Arahkan kamera ke plakat QR fisik yang tertera di pintu masuk lokasi wisata.</span>
            </p>
          </div>
        </div>

        {/* 2. INSTANT GATE SIMULATION (For Testing & Preview) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Simulasi Pindai Gerbang (Uji Coba Pengunjung)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Pilih gerbang lokasi wisata di bawah untuk menyimulasikan pengalaman scan plakat di pintu masuk:
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full w-fit">
              1-Klik Simulasi
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Simulation Option 1: Penglipuran */}
            <div className="p-4 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-slate-50 flex flex-col justify-between space-y-3 hover:border-emerald-400 transition">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white">
                    Desa Wisata
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">TAKONO:DEST:dest-penglipuran</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900">
                  Gerbang Utama Desa Wisata Penglipuran
                </h3>
                <p className="text-xs text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Kec. Bangli, Kab. Bangli, Bali</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  4 Titik Plakat Budaya • Angkul-Angkul, Bale Banjar, Pura Penataran, Hutan Bambu
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleScanGate('TAKONO:DEST:dest-penglipuran', 'Desa Wisata Penglipuran')}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
              >
                <QrCode className="w-4 h-4" />
                <span>Simulasi Pindai Gerbang Penglipuran</span>
              </button>
            </div>

            {/* Simulation Option 2: Kintamani */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50 flex flex-col justify-between space-y-3 hover:border-teal-400 transition">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-600 text-white">
                    Kawasan Budaya
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">TAKONO:DEST:dest-kintamani</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900">
                  Gerbang Kawasan Budaya Kintamani
                </h3>
                <p className="text-xs text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Kintamani, Kab. Bangli, Bali</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  3 Titik Plakat Budaya • Kopi Tradisi, Kaldera Batur, Pura Ulun Danu
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleScanGate('TAKONO:DEST:dest-kintamani', 'Kawasan Budaya Kintamani')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
              >
                <QrCode className="w-4 h-4" />
                <span>Simulasi Pindai Gerbang Kintamani</span>
              </button>
            </div>
          </div>

          {/* Manual Code Input Form */}
          <form onSubmit={handleManualGateSubmit} className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={manualCodeInput}
                onChange={(e) => setManualCodeInput(e.target.value)}
                placeholder="Atau masukkan kode plakat gerbang (cth: TAKONO:DEST:dest-penglipuran)..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition"
              />
            </div>
            <button
              type="submit"
              disabled={!manualCodeInput.trim()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 disabled:opacity-50 text-white font-bold text-xs hover:bg-emerald-600 transition"
            >
              Verifikasi Kode
            </button>
          </form>
        </div>

        {/* 3. HOW IT WORKS IN 3 SIMPLE STEPS */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold">Bagaimana Alur Pengalaman di Lokasi?</h2>
            <p className="text-xs text-slate-400 mt-1">
              TAKONO menjamin pengalaman kunjungan yang bermakna, beretika, dan mendukung ekonomi lokal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-xs font-bold text-white">Scan di Gerbang Masuk</h3>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Pindai plakat gerbang untuk mengaktifkan panduan rute dan merekam kedatangan Anda di lokasi wisata.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-xs font-bold text-white">Jelajahi Titik & Kuis</h3>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Kunjungi tiap plakat fisik, pelajari kisah adat dan etika berkunjung, lalu pecahkan kuis berhadiah poin.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-xs font-bold text-white">Tukar Poin di UMKM Warga</h3>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Gunakan Jejak Points untuk mendapatkan potongan harga kuliner khas dan cinderamata di warung UMKM terdekat.
              </p>
            </div>
          </div>
        </div>

        {/* 4. TRAVELER WALLET SUMMARY (Ready State) */}
        <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Dompet Jejak Points Anda
              </span>
              <p className="text-sm font-black text-slate-900">
                Saldo: <span className="font-mono text-amber-700">{currentUser.pointsBalance} Points</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('/traveler/points')}
            className="text-xs font-bold text-amber-900 hover:text-amber-700 flex items-center gap-1"
          >
            <span>Katalog Hadiah UMKM</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
     CASE 2: ACTIVE DESTINATION SCANNED
     User is currently checked into this specific destination (e.g. Penglipuran).
     The screen is strictly focused on THIS destination (NO list of other destinations).
     ========================================================================= */
  const activeRewards = getRewardsByDestination(activeDest.id).filter((r) => r.status === 'active');

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Toast Notification for Quick Redeem */}
      {quickRedeemMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">{quickRedeemMsg}</span>
        </div>
      )}

      {/* 1. TOP ACTIVE LOCATION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs">
        <div className="flex items-center gap-2 text-emerald-900 font-semibold">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <span>Sedang Mengunjungi:</span>
          <span className="font-black text-emerald-950 underline decoration-emerald-400 underline-offset-2">
            {activeDest.name}
          </span>
          <span className="text-emerald-700">({activeDest.regency}, {activeDest.province})</span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Selesai mengunjungi ${activeDest.name}? Anda dapat memindai gerbang masuk wisata lain setelah ini.`)) {
              leaveDestination();
            }
          }}
          className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium text-[11px] flex items-center gap-1.5 transition shadow-2xs"
        >
          <RotateCcw className="w-3 h-3 text-slate-500" />
          <span>Ganti Lokasi / Pindai Gerbang Lain</span>
        </button>
      </div>

      {/* 2. DESTINATION HERO CARD */}
      <div className="relative rounded-3xl bg-slate-900 text-white overflow-hidden shadow-xl border border-slate-800">
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <img
            src={activeDest.heroImage}
            alt={activeDest.name}
            className="w-full h-full object-cover brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Hero Content Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md text-white text-xs font-bold shadow-sm">
                <MapPin className="w-3.5 h-3.5" />
                <span>{activeDest.regency}, {activeDest.province}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {activeDest.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed">
                {activeDest.description}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-md"
              >
                <QrCode className="w-4 h-4" />
                <span>Pindai QR Plakat di Titik</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('/traveler/smart-guide')}
                className="px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition border border-white/20"
              >
                <Compass className="w-4 h-4" />
                <span>Rute Cerdas</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Strip */}
        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Buka: 08:00 - 18:30 WITA</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Sparkle className="w-3.5 h-3.5 text-amber-400" />
              <span>{destPoints.length} Titik Plakat Budaya</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Dompet Jejak Anda:</span>
            <span className="font-bold text-amber-400 font-mono text-sm">{currentUser.pointsBalance} Pts</span>
          </div>
        </div>
      </div>

      {/* 3. ACTIVE JOURNEY PROGRESS COMPANION */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Progres Jelajah Aktif
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {completedPointsCount} dari {totalPointsForActive} Titik Warisan Selesai ({progressPercent}%)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Poin Sesi Ini:</span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold font-mono text-xs border border-emerald-200">
              +{activeJourney.earnedPointsTotal} Pts
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* SMART GUIDE RECOMMENDATION CALLOUT */}
        {smartRec && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Compass className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-200/70 text-emerald-900">
                    Rekomendasi Rute Selanjutnya
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Titik #{smartRec.recommendedPoint.sequenceOrder}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900">
                  {smartRec.recommendedPoint.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-1">
                  {smartRec.reason}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenPoint(smartRec.recommendedPoint)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <span>Buka Materi Titik</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 4. SEQUENTIAL HERITAGE POINTS AT THIS DESTINATION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Footprints className="w-5 h-5 text-emerald-600" />
              <span>Titik Jelajah Warisan Budaya Berurutan</span>
            </h2>
            <p className="text-xs text-slate-500">
              Kunjungi dan pelajari etika adat di setiap titik untuk mengumpulkan poin dan membuka kuis.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('/traveler/smart-guide')}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>Peta Rute Interaktif</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {destPoints.map((point) => {
            const visitedRecord = activeJourney.visitedPoints.find(
              (vp) => vp.explorePointId === point.id
            );
            const isCompleted = !!visitedRecord?.completedAt;
            const isRecommended = smartRec?.recommendedPoint.id === point.id;

            return (
              <div
                key={point.id}
                onClick={() => handleOpenPoint(point)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : isRecommended
                    ? 'bg-white border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isRecommended
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : `#${point.sequenceOrder}`}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">
                        {point.name}
                      </h3>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {point.category}
                      </span>
                    </div>
                  </div>

                  {isCompleted ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Selesai</span>
                    </span>
                  ) : isRecommended ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Rekomendasi
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-400">
                      +{point.completionPoints || 5} Pts
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {point.storySummary}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>~{point.estimatedMinutes} menit jelajah</span>
                  </span>

                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <span>Pelajari & Kuis</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. LOCAL UMKM DISCOUNTS AT THIS DESTINATION */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-700" />
            <div>
              <h2 className="font-bold text-sm sm:text-base text-slate-900">
                Voucher Diskon Warung & UMKM di {activeDest.name}
              </h2>
              <p className="text-xs text-slate-600">
                Tukarkan Jejak Points hasil kuis Anda dengan promo kuliner & kerajinan tangan warga sekitar.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('/traveler/points')}
            className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Semua Hadiah</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeRewards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeRewards.slice(0, 3).map((reward) => (
              <div
                key={reward.id}
                className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    {reward.category}
                  </span>
                  <h3 className="font-bold text-xs text-slate-900 mt-2">
                    {reward.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {reward.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-black text-xs text-amber-700 font-mono">
                    {reward.pointsCost} Pts
                  </span>

                  <button
                    type="button"
                    onClick={() => handleQuickClaimReward(reward.id, reward.title)}
                    disabled={currentUser.pointsBalance < reward.pointsCost}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold text-[11px] transition shadow-2xs"
                  >
                    Tukar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-white/80 rounded-2xl text-center text-xs text-slate-500">
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

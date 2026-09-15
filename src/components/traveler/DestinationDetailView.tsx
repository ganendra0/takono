import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { InteractivePointModal } from './InteractivePointModal';
import { ExplorePoint } from '../../types/destination';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Clock,
  Ticket,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  ShoppingBag,
  ArrowLeft,
  QrCode,
  Compass,
  Tag,
  Gift,
  Check,
} from 'lucide-react';

interface DestinationDetailViewProps {
  destinationId: string;
}

export const DestinationDetailView: React.FC<DestinationDetailViewProps> = ({ destinationId }) => {
  const {
    getDestination,
    getExplorePointsByDestination,
    getRewardsByDestination,
    getEventsByDestination,
    getApprovedUMKMByDestination,
    activeJourney,
    startOrResumeJourney,
    navigateTo,
    simulateScanCode,
    setQrModalOpen,
    redeemReward,
    currentUser,
  } = useTakonoStore();

  const destination = getDestination(destinationId);
  const points = destination ? getExplorePointsByDestination(destination.id) : [];
  const rewards = destination ? getRewardsByDestination(destination.id) : [];
  const events = destination ? getEventsByDestination(destination.id) : [];
  const umkms = destination ? getApprovedUMKMByDestination(destination.id) : [];

  const [activeTab, setActiveTab] = useState<'points' | 'umkm' | 'events' | 'rewards'>('points');
  const [selectedPointForModal, setSelectedPointForModal] = useState<ExplorePoint | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [claimToast, setClaimToast] = useState<string | null>(null);

  if (!destination) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center space-y-4">
        <p className="text-slate-500 text-sm">Destinasi tidak ditemukan.</p>
        <button
          type="button"
          onClick={() => navigateTo('/traveler/home')}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const isCurrentActive = activeJourney?.destinationId === destination.id;

  const handleStartOrResume = () => {
    startOrResumeJourney(destination.id);
  };

  const handleOpenPoint = (point: ExplorePoint) => {
    if (!isCurrentActive) {
      startOrResumeJourney(destination.id);
    }
    setSelectedPointForModal(point);
    setModalOpen(true);
  };

  const handleClaimReward = (rewardId: string, title: string) => {
    const res = redeemReward(rewardId);
    if (res.success) {
      confetti({ particleCount: 50, spread: 60 });
      setClaimToast(`Voucher "${title}" berhasil diklaim! Kode: ${res.claimRecord?.redemptionCode}`);
      setTimeout(() => setClaimToast(null), 6000);
    } else {
      alert(res.message);
    }
  };

  const completedPointsCount = activeJourney && isCurrentActive
    ? activeJourney.visitedPoints.filter((vp) => !!vp.completedAt).length
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigateTo('/traveler/home')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda Jelajah</span>
      </button>

      {/* Toast Notification */}
      {claimToast && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl text-xs font-semibold flex items-center justify-between shadow-md animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{claimToast}</span>
          </div>
          <button type="button" onClick={() => setClaimToast(null)} className="text-emerald-200 hover:text-white">✕</button>
        </div>
      )}

      {/* Destination Hero */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 text-white shadow-lg">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-72 sm:h-80 object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-xs">
              {destination.province}
            </span>
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {destination.regency}
            </span>
            {isCurrentActive && (
              <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-800 flex items-center gap-1 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Journey Aktif ({completedPointsCount}/{points.length} Titik)</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{destination.name}</h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">{destination.tagline}</p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-4 pt-3 border-t border-white/15">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Buka: {destination.openingHours}</span>
            </div>
            <div className="flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tiket: Rp {destination.ticketPriceIdr.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{points.length} Titik Warisan Budaya</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQrModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Pindai QR Plakat di Lokasi</span>
          </button>

          <button
            type="button"
            onClick={() => simulateScanCode(`TAKONO:DEST:${destination.id}`)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Simulasikan pindai QR Pintu Masuk"
          >
            <span>Simulasi Check-In Masuk</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            handleStartOrResume();
            if (points[0]) {
              handleOpenPoint(points[0]);
            }
          }}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-sm transition"
        >
          <Compass className="w-4 h-4" />
          <span>{isCurrentActive ? 'Lanjutkan Panduan Rute' : 'Mulai Petualangan Rute #1'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Content Navigation Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/70 text-xs font-bold px-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('points')}
            className={`px-5 py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'points'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Rute & Titik Jelajah ({points.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('umkm')}
            className={`px-5 py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'umkm'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Kuliner & UMKM Lokal ({umkms.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`px-5 py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'events'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Event & Festival ({events.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rewards')}
            className={`px-5 py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'rewards'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Voucher & Hadiah ({rewards.length})</span>
          </button>
        </div>

        <div className="p-6">
          {/* Tab: Explore Points (Clean Sequential Timeline!) */}
          {activeTab === 'points' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs text-emerald-900 flex items-center justify-between">
                <span className="font-semibold">
                  💡 Tips: Kunjungi titik secara berurutan untuk pengalaman budaya yang utuh dan kumpulkan Jejak Points di tiap titik.
                </span>
                <span className="font-bold text-emerald-700 font-mono">
                  {completedPointsCount} / {points.length} Selesai
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {points.map((pt) => {
                  const visitedRecord = activeJourney?.visitedPoints.find(
                    (vp) => vp.explorePointId === pt.id
                  );
                  const isPointCompleted = !!visitedRecord?.completedAt;

                  return (
                    <div
                      key={pt.id}
                      className={`p-5 rounded-2xl border transition flex flex-col justify-between space-y-4 ${
                        isPointCompleted
                          ? 'bg-emerald-50/40 border-emerald-300'
                          : 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-xs'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            Titik #{pt.sequenceOrder} • {pt.category}
                          </span>
                          {isPointCompleted && (
                            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 leading-snug">{pt.name}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {pt.shortDescription}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                        <span className="text-amber-700 font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          +{pt.completionPoints} Poin
                        </span>

                        <button
                          type="button"
                          onClick={() => handleOpenPoint(pt)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
                        >
                          <span>{isPointCompleted ? 'Tinjau Panduan' : 'Buka Cerita & Kuis'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab: Local Discovery UMKM */}
          {activeTab === 'umkm' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {umkms.map((u) => (
                  <div
                    key={u.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-amber-300 transition space-y-3 flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={u.imageUrl}
                        alt={u.businessName}
                        className="w-18 h-18 rounded-2xl object-cover border border-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          {u.category}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1 truncate">
                          {u.businessName}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                          {u.description}
                        </p>
                      </div>
                    </div>

                    {u.promotions.length > 0 && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
                        <div className="text-emerald-950 font-semibold">
                          <span>Diskon {u.promotions[0].discountPercentage}% ({u.promotions[0].title})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleClaimReward(
                              `rew-${u.id}`,
                              `Diskon ${u.promotions[0].discountPercentage}% ${u.businessName}`
                            )
                          }
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition"
                        >
                          Tukar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Events */}
          {activeTab === 'events' && (
            <div className="space-y-3">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                      Event Budaya
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{ev.title}</h4>
                    <p className="text-xs text-slate-600">{ev.description}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <span>Tanggal: {ev.date}</span>
                      <span>•</span>
                      <span>Waktu: {ev.time}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => simulateScanCode(ev.qrCodeId)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0 transition"
                  >
                    Check-in Event
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tab: Rewards */}
          {activeTab === 'rewards' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Saldo Anda: <strong className="text-amber-600 font-mono">{currentUser.pointsBalance} Poin</strong></span>
                <span className="text-slate-500">Poin didapat dari kuis & check-in plakat</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rewards.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          {r.category}
                        </span>
                        <span className="text-xs font-bold text-amber-900 font-mono">
                          {r.pointsCost} Poin
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900">{r.title}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{r.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleClaimReward(r.id, r.title)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-2xs"
                    >
                      Tukar Voucher Sekarang
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* UNIFIED INTERACTIVE POINT MODAL */}
      <InteractivePointModal
        point={selectedPointForModal}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onNavigateToNextPoint={(nextPointId) => {
          const nextPt = points.find((p) => p.id === nextPointId);
          if (nextPt) {
            setSelectedPointForModal(nextPt);
          }
        }}
      />
    </div>
  );
};

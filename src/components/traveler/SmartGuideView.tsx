import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { calculateSmartGuideRecommendation } from '../../services/smartGuideEngine';
import { InteractivePointModal } from './InteractivePointModal';
import { ExplorePoint } from '../../types/destination';
import {
  Compass,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  BookOpen,
  Award,
  ChevronRight,
  QrCode,
  Layers,
  Footprints,
} from 'lucide-react';

export const SmartGuideView: React.FC = () => {
  const {
    destinations,
    explorePoints,
    activeJourney,
    startOrResumeJourney,
    navigateTo,
    currentUser,
  } = useTakonoStore();

  const activeDestId = activeJourney?.destinationId;
  const selectedDestination = destinations.find((d) => d.id === activeDestId);
  const destinationPoints = explorePoints.filter((p) => p.destinationId === activeDestId);

  const [selectedPointForModal, setSelectedPointForModal] = useState<ExplorePoint | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const recommendation = calculateSmartGuideRecommendation(
    destinationPoints,
    activeJourney || undefined
  );

  const handleOpenPoint = (point: ExplorePoint) => {
    setSelectedPointForModal(point);
    setModalOpen(true);
  };

  if (!activeJourney || !selectedDestination) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-5 animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center shadow-2xs">
          <Compass className="w-8 h-8 text-emerald-700" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-stone-900">
            Belum Ada Gerbang Wisata yang Dipindai
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
            Panduan Rute Cerdas menyajikan urutan titik warisan budaya berdasarkan plakat gerbang masuk yang Anda pindai di lokasi wisata.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigateTo('/traveler/home')}
          className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-2xs inline-flex items-center gap-2 transition cursor-pointer"
        >
          <QrCode className="w-4 h-4" />
          <span>Kembali ke Beranda & Pindai Gerbang Masuk</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>Panduan Rute Jelajah Budaya</span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Mau ke mana selanjutnya?
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Rekomendasi titik warisan budaya berurutan agar perjalanan Anda lebih bermakna dan terarah.
          </p>
        </div>

        {/* Current Active Location Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-800 block leading-tight">Lokasi Aktif:</span>
            <span className="font-extrabold text-emerald-950">{selectedDestination.name}</span>
          </div>
        </div>
      </div>

      {selectedDestination && (
        <>
          {/* Progress Overview Card */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  Progres Rute di {selectedDestination.name}
                </h3>
                <p className="text-xs text-stone-500">
                  {recommendation.totalPoints - recommendation.unvisitedCount} dari {recommendation.totalPoints} titik warisan terselesaikan
                </p>
              </div>
              <span className="text-lg font-black font-mono text-emerald-800">
                {recommendation.completionPercentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${recommendation.completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Featured Recommendation Card */}
          {recommendation.recommendedPoint ? (
            <div className="rounded-3xl border border-stone-800 bg-[#1C2520] text-white shadow-md p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-2xs">
                    {recommendation.badge}
                  </span>
                  <span className="text-xs text-stone-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    Est. {recommendation.recommendedPoint.estimatedMinutes} menit
                  </span>
                </div>
                <span className="text-xs text-stone-300">
                  Titik #{recommendation.recommendedPoint.sequenceOrder} dari {recommendation.totalPoints}
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                  {recommendation.recommendedPoint.name}
                </h2>
                <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-2xl leading-relaxed font-normal">
                  {recommendation.recommendedPoint.shortDescription}
                </p>
              </div>

              {/* Rationale box */}
              <div className="p-3.5 bg-white/10 rounded-2xl border border-white/15 text-xs text-stone-200 font-normal">
                <strong className="text-emerald-300 font-bold">Alasan Panduan: </strong>
                {recommendation.reason}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-stone-300">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{recommendation.recommendedPoint.locationName || selectedDestination.name}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenPoint(recommendation.recommendedPoint!)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-xs cursor-pointer"
                >
                  <span>Buka Panduan & Kuis (+{recommendation.recommendedPoint.completionPoints} Pts)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-3 shadow-2xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-950">Semua Titik Selesai Dijelajahi! 🎉</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Luar biasa! Anda telah menyelesaikan seluruh titik warisan budaya di {selectedDestination.name}. Periksa koleksi stempel Anda di Album Jelajah atau tukarkan poin di UMKM warga.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigateTo('/traveler/album')}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl font-bold text-xs transition cursor-pointer"
                >
                  Buka Album Stempel
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('/traveler/points')}
                  className="px-4 py-2 bg-white border border-stone-300 text-stone-700 rounded-xl font-bold text-xs hover:bg-stone-50 transition cursor-pointer"
                >
                  Tukar Jejak Points
                </button>
              </div>
            </div>
          )}

          {/* Sequential Route Timeline List */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Footprints className="w-4 h-4 text-emerald-700" />
              <span>Daftar Urutan Rute Kunjungan ({destinationPoints.length} Titik)</span>
            </h3>

            <div className="space-y-3">
              {destinationPoints
                .sort((a, b) => a.sequenceOrder - b.sequenceOrder)
                .map((pt, idx) => {
                  const visitedRecord = activeJourney.visitedPoints.find(
                    (vp) => vp.explorePointId === pt.id
                  );
                  const isCompleted = !!visitedRecord?.completedAt;
                  const isTarget = recommendation.recommendedPoint?.id === pt.id;

                  return (
                    <div
                      key={pt.id}
                      onClick={() => handleOpenPoint(pt)}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCompleted
                          ? 'bg-emerald-50/40 border-emerald-200 text-stone-600'
                          : isTarget
                          ? 'bg-white border-emerald-600 shadow-sm ring-1 ring-emerald-600/30'
                          : 'bg-white border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-700 text-white'
                              : isTarget
                              ? 'bg-emerald-700 text-white font-black'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {isCompleted ? '✓' : `#${pt.sequenceOrder}`}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-stone-900">{pt.name}</h4>
                            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                              {pt.category}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 line-clamp-1">{pt.storySummary}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 text-xs">
                        <span className="text-stone-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          ~{pt.estimatedMinutes} mnt
                        </span>

                        {isCompleted ? (
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            Selesai
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                            <span>Pelajari</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}

      {/* Unified Interactive Point Modal */}
      <InteractivePointModal
        point={selectedPointForModal}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedPointForModal(null);
        }}
        onNavigateToNextPoint={(nextPointId) => {
          const nextPt = destinationPoints.find((p) => p.id === nextPointId);
          if (nextPt) {
            setSelectedPointForModal(nextPt);
          } else {
            setModalOpen(false);
          }
        }}
      />
    </div>
  );
};

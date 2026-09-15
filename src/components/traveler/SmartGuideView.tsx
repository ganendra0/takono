import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { calculateSmartGuideRecommendation } from '../../services/smartGuideEngine';
import { InteractivePointModal } from './InteractivePointModal';
import { ExplorePoint } from '../../types/destination';
import {
  Compass,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  BookOpen,
  Award,
  ChevronRight,
  QrCode,
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
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
          <Compass className="w-8 h-8 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900">
            Belum Ada Gerbang Wisata yang Dipindai
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            Panduan Rute Cerdas menyajikan urutan titik warisan budaya berdasarkan plakat gerbang masuk yang Anda pindai di lokasi wisata.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigateTo('/traveler/home')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-2 transition"
        >
          <QrCode className="w-4 h-4" />
          <span>Kembali ke Beranda & Pindai Gerbang Masuk</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Panduan Rute Cerdas (Smart Guide)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Mau ke mana selanjutnya?
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Rekomendasi titik warisan budaya berurutan agar perjalanan Anda lebih bermakna dan terarah.
          </p>
        </div>

        {/* Current Active Location Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 block leading-tight">Lokasi Aktif:</span>
            <span className="font-black text-emerald-950">{selectedDestination.name}</span>
          </div>
        </div>
      </div>

      {selectedDestination && (
        <>
          {/* Progress Overview Card */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Progres Rute di {selectedDestination.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {recommendation.totalPoints - recommendation.unvisitedCount} dari {recommendation.totalPoints} titik warisan terselesaikan
                </p>
              </div>
              <span className="text-lg font-black font-mono text-emerald-600">
                {recommendation.completionPercentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${recommendation.completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Featured Recommendation Card */}
          {recommendation.recommendedPoint ? (
            <div className="relative rounded-3xl overflow-hidden border border-emerald-400 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white shadow-xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-xs">
                    {recommendation.badge}
                  </span>
                  <span className="text-xs text-emerald-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Est. {recommendation.recommendedPoint.estimatedMinutes} menit
                  </span>
                </div>
                <span className="text-xs text-slate-300">
                  Titik #{recommendation.recommendedPoint.sequenceOrder} dari {recommendation.totalPoints}
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {recommendation.recommendedPoint.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {recommendation.recommendedPoint.shortDescription}
                </p>
              </div>

              {/* Rationale box */}
              <div className="p-3.5 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-xs text-xs text-emerald-200">
                <strong className="text-white">Alasan Rekomendasi: </strong>
                {recommendation.reason}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{recommendation.recommendedPoint.locationName || selectedDestination.name}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenPoint(recommendation.recommendedPoint!)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 transition shadow-md hover:scale-[1.02]"
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
                {recommendation.reason}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigateTo('/traveler/points')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-xs"
                >
                  Tukarkan Poin di Warung UMKM
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('/traveler/album')}
                  className="px-4 py-2.5 bg-white border border-emerald-300 text-emerald-800 font-bold rounded-xl text-xs hover:bg-emerald-50 transition"
                >
                  Lihat Album Stempel Saya
                </button>
              </div>
            </div>
          )}

          {/* Sequential Route Trail */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-sm">
                  Urutan Alur Jelajah Lengkap (Sequential Trail)
                </h3>
                <p className="text-xs text-slate-500">
                  Klik titik untuk membaca cerita, pantangan adat, dan mengerjakan kuis berhadiah poin.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {recommendation.suggestedRoute.map((point) => {
                const visitedRecord = activeJourney?.visitedPoints.find(
                  (vp) => vp.explorePointId === point.id
                );
                const isPointCompleted = !!visitedRecord?.completedAt;
                const isRecommended = recommendation.recommendedPoint?.id === point.id;

                return (
                  <div
                    key={point.id}
                    onClick={() => handleOpenPoint(point)}
                    className={`p-4 rounded-2xl border transition flex items-center justify-between cursor-pointer group ${
                      isRecommended
                        ? 'border-emerald-500 bg-emerald-50/60 shadow-xs ring-2 ring-emerald-400/80'
                        : isPointCompleted
                        ? 'border-slate-200 bg-slate-50/70 opacity-90'
                        : 'border-slate-200 hover:border-emerald-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 shrink-0">
                        {isPointCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <span>#{point.sequenceOrder}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition">
                            {point.name}
                          </h4>
                          {isRecommended && (
                            <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                              Rekomendasi Saat Ini
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {point.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-semibold text-emerald-700 hidden sm:inline font-mono">
                        +{point.completionPoints} Pts
                      </span>
                      <span className="px-3 py-1.5 rounded-lg bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 text-xs font-bold transition flex items-center gap-1">
                        <span>{isPointCompleted ? 'Tinjau' : 'Jelajahi'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* UNIFIED INTERACTIVE POINT MODAL */}
      <InteractivePointModal
        point={selectedPointForModal}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onNavigateToNextPoint={(nextPointId) => {
          const nextPt = destinationPoints.find((p) => p.id === nextPointId);
          if (nextPt) {
            setSelectedPointForModal(nextPt);
          }
        }}
      />
    </div>
  );
};

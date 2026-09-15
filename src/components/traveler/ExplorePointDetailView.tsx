import React, { useState, useEffect } from 'react';
import { useTakonoStore } from '../../services/store';
import { MiniQuizModal } from './MiniQuizModal';
import { calculateSmartGuideRecommendation } from '../../services/smartGuideEngine';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  Leaf,
  Shield,
  HelpCircle,
  Footprints,
  ShoppingBag,
  ArrowRight,
  MapPin,
} from 'lucide-react';

interface ExplorePointDetailViewProps {
  pointId: string;
}

export const ExplorePointDetailView: React.FC<ExplorePointDetailViewProps> = ({ pointId }) => {
  const {
    explorePoints,
    getDestination,
    getQuizByExplorePoint,
    activeJourney,
    recordPointInteraction,
    getApprovedUMKMByDestination,
    navigateTo,
  } = useTakonoStore();

  const [activeTab, setActiveTab] = useState<'story' | 'facts' | 'education' | 'activity'>('story');
  const [quizModalOpen, setQuizModalOpen] = useState<boolean>(false);
  const [isCompletedState, setIsCompletedState] = useState<boolean>(false);

  const point = explorePoints.find((p) => p.id === pointId);
  const destination = point ? getDestination(point.destinationId) : null;
  const quiz = point ? getQuizByExplorePoint(point.id) : null;

  // Track initial VIEW action on load (Flow E / Section 12)
  useEffect(() => {
    if (point && activeJourney) {
      recordPointInteraction(point.id, 'view');
    }
  }, [point?.id, activeJourney?.id]);

  if (!point || !destination) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center space-y-4">
        <p className="text-slate-500 text-sm">Titik jelajah tidak ditemukan.</p>
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

  // Check visited status in active journey
  const visitedRecord = activeJourney?.visitedPoints.find((vp) => vp.explorePointId === point.id);
  const isCompleted = !!visitedRecord?.completedAt || isCompletedState;
  const isQuizCompleted = activeJourney?.completedQuizzes.some((cq) => cq.explorePointId === point.id);

  const handleMarkComplete = () => {
    const res = recordPointInteraction(point.id, 'complete');
    if (res.success) {
      setIsCompletedState(true);
    }
  };

  const handleTabChange = (tab: 'story' | 'facts' | 'education' | 'activity') => {
    setActiveTab(tab);
    // Track interaction (Section 12: VIEW -> INTERACT -> COMPLETE)
    if (activeJourney) {
      recordPointInteraction(point.id, 'interact');
    }
  };

  // Connected UMKM
  const connectedUMKMs = getApprovedUMKMByDestination(destination.id);

  // Smart Guide recommendation for the next step
  const allDestPoints = explorePoints.filter((p) => p.destinationId === destination.id);
  const smartRecommendation = calculateSmartGuideRecommendation(allDestPoints, activeJourney || undefined, point.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Back to destination bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigateTo(`/traveler/destinations/${destination.id}`)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke {destination.name}</span>
        </button>

        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Jelajah Tuntas</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleMarkComplete}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tandai Selesai (+{point.completionPoints} Poin)</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white shadow-md">
        <img
          src={point.imageUrl}
          alt={point.name}
          className="w-full h-64 sm:h-72 object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/80 text-white backdrop-blur-xs">
              Titik #{point.sequenceOrder} • {point.category}
            </span>
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {point.estimatedMinutes} menit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{point.name}</h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">
            {point.shortDescription}
          </p>
        </div>
      </div>

      {/* Interactive Tabs (Flow E: Story, Facts, Education, Activity) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => handleTabChange('story')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'story'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Kisah & Makna</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('facts')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'facts'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Fakta Menarik</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('education')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'education'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Edukasi & Etika Budaya</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('activity')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'activity'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Footprints className="w-4 h-4" />
            <span>Aktivitas di Lokasi</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'story' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Narasi Warisan Budaya</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {point.story}
              </p>
            </div>
          )}

          {activeTab === 'facts' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Tahukah Anda?</h3>
              <ul className="space-y-2.5">
                {point.facts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span>Norma & Adat Budaya</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {point.education.culturalNorms}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>Pedoman Ramah Lingkungan</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {point.education.ecoGuidelines}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-semibold text-xs">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Tata Krama Wisatawan</span>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  {point.education.etiquette}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Panduan Interaksi Langsung</h3>
              <p className="text-xs text-slate-700 leading-relaxed">{point.activity}</p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Titik pandu: {point.locationName}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mini Quiz Banner / Launcher (Flow F) */}
      {quiz && (
        <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                Tantangan Edukasi
              </span>
              {isQuizCompleted && (
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Kuis Selesai
                </span>
              )}
            </div>
            <h4 className="font-bold text-slate-900 text-sm">{quiz.title}</h4>
            <p className="text-xs text-slate-600">{quiz.description}</p>
          </div>

          <button
            type="button"
            onClick={() => setQuizModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shrink-0 shadow-sm transition flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" />
            <span>{isQuizCompleted ? 'Lihat Kembali Kuis' : 'Mulai Mini Kuis (+10 Poin)'}</span>
          </button>
        </div>
      )}

      {/* Connected Local Discovery (UMKM) */}
      {connectedUMKMs.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-sm">Local Discovery Dekat Titik Ini</h3>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('/traveler/local-discovery')}
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              Lihat Semua UMKM →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {connectedUMKMs.map((umkm) => (
              <div
                key={umkm.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start gap-3 hover:bg-slate-50 transition"
              >
                <img
                  src={umkm.imageUrl}
                  alt={umkm.businessName}
                  className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-800 text-xs truncate">
                    {umkm.businessName}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{umkm.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      {umkm.category}
                    </span>
                    {umkm.promotions.length > 0 && (
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        Promo: Diskon {umkm.promotions[0].discountPercentage}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Guide Next Recommendation (Flow D) */}
      {smartRecommendation.recommendedPoint && (
        <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                Smart Guide: Rekomendasi Titik Berikutnya
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {smartRecommendation.badge}
              </span>
            </div>
            <h4 className="font-bold text-sm text-white">
              {smartRecommendation.recommendedPoint.name}
            </h4>
            <p className="text-xs text-slate-300">{smartRecommendation.reason}</p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigateTo(`/traveler/explore/${smartRecommendation.recommendedPoint!.id}`)
            }
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition shrink-0"
          >
            <span>Lanjut Jelajah</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Mini Quiz Modal */}
      {quiz && (
        <MiniQuizModal
          quiz={quiz}
          isOpen={quizModalOpen}
          onClose={() => setQuizModalOpen(false)}
          onSuccess={() => {
            // handle success
          }}
        />
      )}
    </div>
  );
};

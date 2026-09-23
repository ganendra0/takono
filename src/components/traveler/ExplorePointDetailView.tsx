import React, { useState, useEffect } from 'react';
import { useTakonoStore } from '../../services/store';
import { calculateSmartGuideRecommendation } from '../../services/smartGuideEngine';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Coins, 
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

interface ExplorePointDetailViewProps {
  pointId: string;
}

export const ExplorePointDetailView: React.FC<ExplorePointDetailViewProps> = ({ pointId }) => {
  const store = useTakonoStore();
  const {
    explorePoints = [],
    getDestination,
    getQuizByExplorePoint,
    activeJourney,
    recordPointInteraction,
    getApprovedUMKMByDestination,
    navigateTo,
    completeExplorePoint,
    completePointQuiz,
  } = store;

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isCompletedState, setIsCompletedState] = useState<boolean>(false);

  const point = explorePoints.find((p) => p.id === pointId) || explorePoints[0];
  const destination = point && getDestination ? getDestination(point.destinationId) : null;
  const quiz = point && getQuizByExplorePoint ? getQuizByExplorePoint(point.id) : null;

  // Catat jejak awal "VIEW"
  useEffect(() => {
    if (point && activeJourney && recordPointInteraction) {
      recordPointInteraction(point.id, 'view');
    }
  }, [point?.id, activeJourney?.id]);

  if (!point) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center space-y-4">
        <p className="text-slate-500 text-sm">Titik jelajah tidak ditemukan.</p>
        <button
          type="button"
          onClick={() => navigateTo('/traveler')}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  // Cek status kunjungan dari activeJourney
  const visitedRecord = activeJourney?.visitedPoints?.find((vp) => vp.explorePointId === point.id);
  const isCompleted = !!(
    visitedRecord?.completedAt ||
    visitedRecord?.quizPassed ||
    (visitedRecord?.pointsEarned && visitedRecord.pointsEarned > 0) ||
    activeJourney?.completedPointIds?.includes(point.id) ||
    isCompletedState
  );

  // Ambil pertanyaan & opsi kuis dari objek quiz asli atau properti titik
  const quizQuestion = quiz?.question || (point as any).quizQuestion || 'Apa nilai budaya utama dari lokasi ini?';
  const quizOptions = quiz?.options || (point as any).quizOptions || [
    'Kesetaraan derajat sosial dan keharmonisan warga',
    'Estetika arsitektur semata',
    'Aturan administratif daerah',
    'Efisiensi bahan bangunan'
  ];
  const correctAnswerIndex = quiz?.correctAnswerIndex ?? (point as any).correctAnswerIndex ?? 0;
  const rewardPoints = quiz?.rewardPoints || point.completionPoints || (point as any).rewardPoints || 5;

  const handleSubmitQuiz = () => {
    if (selectedOption === null) return;

    const correct = selectedOption === correctAnswerIndex;
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      setIsCompletedState(true);

      // 1. Eksekusi recordPointInteraction dari logika asli Anda
      if (typeof recordPointInteraction === 'function') {
        recordPointInteraction(point.id, 'complete');
      }

      // 2. Panggil handler penyelesaian store
      if (typeof completeExplorePoint === 'function') {
        completeExplorePoint(point.id);
      }
      if (typeof completePointQuiz === 'function') {
        completePointQuiz(point.id, rewardPoints);
      }

      // 3. Fallback Update Langsung ke Store
      useTakonoStore.setState((state: any) => {
        const targetDestId = state.activeJourney?.destinationId || point.destinationId || 'dest-penglipuran';
        const existingVP = state.activeJourney?.visitedPoints || [];
        const hasPoint = existingVP.some((vp: any) => vp.explorePointId === point.id);

        const updatedVP = hasPoint
          ? existingVP.map((vp: any) =>
              vp.explorePointId === point.id
                ? { ...vp, completedAt: new Date().toISOString(), quizPassed: true, pointsEarned: rewardPoints }
                : vp
            )
          : [
              ...existingVP,
              {
                explorePointId: point.id,
                visitedAt: new Date().toISOString(),
                completedAt: new Date().toISOString(),
                quizPassed: true,
                pointsEarned: rewardPoints
              }
            ];

        const existingCompletedIds = state.activeJourney?.completedPointIds || [];
        const updatedCompletedIds = Array.from(new Set([...existingCompletedIds, point.id]));

        const currentPoints = state.currentUser?.pointsBalance ?? state.user?.pointsBalance ?? state.currentUser?.points ?? 0;
        const newPoints = currentPoints + rewardPoints;

        return {
          ...state,
          activeJourney: {
            destinationId: targetDestId,
            startedAt: state.activeJourney?.startedAt || new Date().toISOString(),
            visitedPoints: updatedVP,
            completedPointIds: updatedCompletedIds,
            ...state.activeJourney,
          },
          currentUser: state.currentUser
            ? { ...state.currentUser, pointsBalance: newPoints, points: newPoints }
            : { pointsBalance: newPoints, points: newPoints },
          user: state.user
            ? { ...state.user, pointsBalance: newPoints, points: newPoints }
            : undefined,
        };
      });
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-neutral-800 antialiased max-w-4xl mx-auto px-4 pt-4">
      
      {/* 1. TOMBOL KEMBALI */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigateTo('/traveler')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 text-neutral-700 hover:text-blue-600 hover:border-blue-200 text-xs font-bold transition shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Panduan Rute</span>
        </button>

        <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          {point.category || 'CULTURE'}
        </span>
      </div>

      {/* 2. HEADER TITIK JELAJAH */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-neutral-400">
            KODE PLAKAT: <strong className="text-neutral-700 font-bold">{(point as any).qrCodeId || point.id}</strong>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-black">
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>+{rewardPoints} PTS</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">
          {point.name || (point as any).title}
        </h1>

        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          {point.shortDescription || (point as any).description}
        </p>
      </div>

      {/* 3. NARASI SEJARAH & ETIKA BUDAYA */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-blue-600 border-b border-neutral-100 pb-4">
          <BookOpen className="w-5 h-5" />
          <h2 className="font-extrabold text-base text-neutral-900">Cerita Warisan & Etika Lokal</h2>
        </div>

        <div className="prose prose-sm text-neutral-700 leading-relaxed text-xs sm:text-sm">
          <p>{point.story || (point as any).narrativeContent || point.shortDescription}</p>
        </div>

        {/* Etika & Aturan Kunjungan */}
        <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
          <h4 className="font-extrabold text-xs text-blue-950 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Etika & Aturan Kunjungan:</span>
          </h4>
          <ul className="space-y-2 text-xs text-blue-900">
            {point.education?.culturalNorms && (
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>{point.education.culturalNorms}</span>
              </li>
            )}
            {point.education?.etiquette && (
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>{point.education.etiquette}</span>
              </li>
            )}
            {(!point.education?.culturalNorms && !(point as any).culturalEthics) && (
              <>
                <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span> Ucapkan salam saat memasuki pekarangan warga.</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span> Dilarang membuang sampah sembarangan di lorong jalan utama.</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* 4. KUIS BUDAYA INTERAKTIF (LANGSUNG / INLINE) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2 text-blue-600">
            <HelpCircle className="w-5 h-5" />
            <h2 className="font-extrabold text-base text-neutral-900">Kuis Edukasi Budaya</h2>
          </div>

          {(isCompleted || (isSubmitted && isCorrect)) && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sudah Diselesaikan</span>
            </span>
          )}
        </div>

        <div className="space-y-4">
          <p className="font-bold text-sm text-neutral-900 leading-snug">
            {quizQuestion}
          </p>

          <div className="space-y-2.5">
            {quizOptions.map((opt: string, idx: number) => {
              const isSelected = selectedOption === idx;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isSubmitted || isCompleted}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-4 rounded-2xl text-xs font-bold border transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-neutral-50/50'
                  }`}
                >
                  <span>{opt}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-blue-600 bg-blue-600' : 'border-neutral-300'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>

          {!isSubmitted && !isCompleted && (
            <button
              type="button"
              disabled={selectedOption === null}
              onClick={handleSubmitQuiz}
              className={`w-full py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition shadow-md cursor-pointer ${
                selectedOption !== null
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              }`}
            >
              Kirim Jawaban & Klaim Poin
            </button>
          )}

          {(isSubmitted || isCompleted) && (
            <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 ${
              isCorrect || isCompleted
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center gap-3">
                {isCorrect || isCompleted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-black">Jawaban Benar! Selamat!</p>
                      <p className="font-normal text-[11px] text-emerald-700">Anda berhasil mendapatkan +{rewardPoints} Jejak Points.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <div>
                      <p className="font-black">Jawaban Kurang Tepat.</p>
                      <p className="font-normal text-[11px] text-rose-700">Silakan pilih opsi lain untuk mencoba lagi.</p>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => navigateTo('/traveler')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shrink-0 cursor-pointer"
              >
                Kembali ke Rute
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
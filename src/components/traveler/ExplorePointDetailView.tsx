import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { 
  ArrowLeft, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Coins, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';

interface ExplorePointDetailViewProps {
  pointId: string;
}

export const ExplorePointDetailView: React.FC<ExplorePointDetailViewProps> = ({ pointId }) => {
  const store = useTakonoStore();
  const explorePoints = store.explorePoints || [];
  const activeJourney = store.activeJourney;
  const completeExplorePoint = store.completeExplorePoint;
  const navigateTo = store.navigateTo;

  const point = explorePoints.find((p) => p.id === pointId) || explorePoints[0] || {
    id: pointId,
    destinationId: 'dest-penglipuran',
    title: 'Angkul-Angkul & Lorong Rerata Utama',
    category: 'ARCHITECTURE',
    description: 'Gerbang tradisional seragam yang mencerminkan kesetaraan dan keharmonisan sosial.',
    narrativeContent: 'Angkul-angkul merupakan pintu gerbang tradisional khas Bali yang dibuat dari bambu dan tanah liat. Di Desa Wisata Penglipuran, bentuk angkul-angkul dibuat seragam sebagai simbol kesetaraan derajat sosial seluruh warga desa.',
    culturalEthics: [
      'Ucapkan salam saat memasuki pekarangan warga.',
      'Dilarang membuang sampah sembarangan di lorong jalan utama.',
      'Hormati area suci pura keluarga di balik angkul-angkul.'
    ],
    quizQuestion: 'Apa filosofi di balik bentuk angkul-angkul yang dibuat seragam di Desa Penglipuran?',
    quizOptions: [
      'Simbol kesetaraan derajat sosial dan keharmonisan warga',
      'Hanya untuk estetika foto wisatawan',
      'Aturan dari pemerintah daerah',
      'Menghemat bahan bangunan'
    ],
    correctAnswerIndex: 0,
    rewardPoints: 5,
    qrCodeId: 'QR-POINT-PENG-1'
  };

  const isCompleted = activeJourney?.completedPointIds?.includes(point.id);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handleSubmitQuiz = () => {
    if (selectedOption === null) return;
    
    const correct = selectedOption === (point.correctAnswerIndex ?? 0);
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct && completeExplorePoint) {
      completeExplorePoint(point.id);
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-neutral-800 antialiased max-w-4xl mx-auto">
      
      {/* 1. KEMBALI */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigateTo(`/traveler/destination/${point.destinationId}`)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 text-neutral-700 hover:text-blue-600 hover:border-blue-200 text-xs font-bold transition shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail Destinasi</span>
        </button>

        <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          {point.category || 'CULTURE'}
        </span>
      </div>

      {/* 2. HEADER TITIK JELAJAH */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-neutral-400">
            KODE PLAKAT: <strong className="text-neutral-700 font-bold">{point.qrCodeId || point.id}</strong>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-black">
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>+{point.rewardPoints || 5} PTS</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">
          {point.title}
        </h1>

        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          {point.description}
        </p>
      </div>

      {/* 3. NARASI SEJARAH & ETIKA BUDAYA */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-blue-600 border-b border-neutral-100 pb-4">
          <BookOpen className="w-5 h-5" />
          <h2 className="font-extrabold text-base text-neutral-900">Cerita Warisan & Etika Lokal</h2>
        </div>

        <div className="prose prose-sm text-neutral-700 leading-relaxed text-xs sm:text-sm">
          <p>{point.narrativeContent || point.description}</p>
        </div>

        {point.culturalEthics && point.culturalEthics.length > 0 && (
          <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
            <h4 className="font-extrabold text-xs text-blue-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Etika & Aturan Kunjungan:</span>
            </h4>
            <ul className="space-y-2 text-xs text-blue-900">
              {point.culturalEthics.map((ethic, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{ethic}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 4. KUIS BUDAYA INTERAKTIF */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2 text-blue-600">
            <HelpCircle className="w-5 h-5" />
            <h2 className="font-extrabold text-base text-neutral-900">Kuis Edukasi Budaya</h2>
          </div>

          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sudah Diselesaikan</span>
            </span>
          )}
        </div>

        <div className="space-y-4">
          <p className="font-bold text-sm text-neutral-900 leading-snug">
            {point.quizQuestion || 'Apakah Anda sudah memahami cerita warisan budaya pada titik ini?'}
          </p>

          <div className="space-y-2.5">
            {(point.quizOptions || ['Ya, saya paham', 'Tidak']).map((opt, idx) => {
              const isSelected = selectedOption === idx;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isSubmitted || isCompleted}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-4 rounded-2xl text-xs font-bold border transition flex items-center justify-between ${
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
              className={`w-full py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition shadow-md ${
                selectedOption !== null
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              }`}
            >
              Kirim Jawaban & Klaim Poin
            </button>
          )}

          {isSubmitted && (
            <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-black">Jawaban Benar! Selamat!</p>
                    <p className="font-normal text-[11px] text-emerald-700">Anda berhasil mendapatkan +{point.rewardPoints || 5} Jejak Points.</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <p className="font-black">Jawaban Kurang Tepat.</p>
                    <p className="font-normal text-[11px] text-rose-700">Silakan baca kembali cerita di atas dan coba lagi.</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
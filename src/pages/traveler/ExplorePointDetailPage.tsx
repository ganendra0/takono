import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../lib/api.js';
import { ExplorePoint, QuizQuestion } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExplorePointDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ExplorePointDetailPage: React.FC<ExplorePointDetailPageProps> = ({ slug, onNavigate }) => {
  const { refreshUserData } = useAuth();
  const [point, setPoint] = useState<ExplorePoint | null>(null);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Quiz state
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<{
    isCorrect: boolean;
    score: number;
    pointsAwarded: number;
    explanation: string;
    alreadyCompleted: boolean;
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPoint = async () => {
      setIsLoading(true);
      setPoint(null); setQuizResult(null); setSelectedOptions({}); setError('');
      const res = await ApiClient.getExplorePoint(slug);
      if (res.success && res.data) {
        setPoint(res.data.explorePoint);
        setAlreadyCompleted(res.data.alreadyCompleted);
        setQuizCompleted(res.data.quizCompleted);
      } else {
        setError(res.message || 'Gagal memuat titik.');
      }
      setIsLoading(false);
    };

    fetchPoint();
  }, [slug]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (quizResult?.isCorrect) return; // locked once correct
    setSelectedOptions({
      ...selectedOptions,
      [questionId]: optionId
    });
  };

  const handleSubmitQuiz = async () => {
    if (!point || !point.quiz) return;
    setIsSubmitting(true);

    const answers = point.quiz.questions.map(q => ({
      questionId: q.id,
      selectedOptionId: selectedOptions[q.id] || ''
    }));

    const res = await ApiClient.submitQuiz(point.id, answers);
    if (res.success && res.data) {
      setQuizResult(res.data);
      if (res.data.isCorrect && res.data.pointsAwarded > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        await refreshUserData();
      }
    } else {
      setError(res.message || 'Gagal mengirim kuis.');
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-500 space-y-2">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs">Memuat konten Explore Point...</p>
      </div>
    );
  }

  if (!point) {
    return (
      <div className="p-6 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">Explore Point Tidak Ditemukan</h2>
        <button
          onClick={() => onNavigate('/app/smart-guide')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Kembali ke Smart Guide
        </button>
      </div>
    );
  }

  const quiz = point.quiz;

  return (
    <div className="space-y-6 pb-12">
      {error && <p role="alert" className="text-rose-700">{error}</p>}
      
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('/app/smart-guide')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Smart Guide</span>
        </button>

        <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
          {point.category}
        </span>
      </div>

      {/* Hero Photo & Badges */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <img
          src={point.image}
          alt={point.name}
          className="w-full h-64 sm:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
          <div className="flex items-center gap-2 text-xs text-blue-200">
            <span className="font-mono">+{point.pointsReward} Jejak Points Titik</span>
            <span>·</span>
            <span>{point.estimatedDuration}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold leading-tight">
            {point.name}
          </h1>
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {alreadyCompleted ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <Sparkles className="w-4 h-4 text-blue-600" />
          )}
          <span className="font-semibold text-slate-900">
            {alreadyCompleted ? 'Sudah dijelajahi' : 'Siap untuk dijelajahi'}
          </span>
        </div>
        <span className="text-slate-500 font-mono text-[11px]">
          {alreadyCompleted ? 'QR tervalidasi' : 'Pindai QR fisik untuk mencatat kunjungan'}
        </span>
      </div>

      {/* Story & Historical Narration */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Kisah & Sejarah Titik</span>
          </h3>
          {point.audioGuideUrl&&<audio controls className="max-w-40 h-8" src={point.audioGuideUrl}>Audio tidak didukung.</audio>}
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {point.story}
        </p>
      </div>

      {/* Educational Content */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Wawasan & Edukasi Hayati</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {point.educationalContent}
        </p>

        {point.funFacts && point.funFacts.length > 0 && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-800">Tahukah Kamu?</span>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {point.funFacts.map((fact, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* MINI QUIZ (Section 15: Server validates correct answer) */}
      {quiz && (
        <div className="p-5 bg-white rounded-2xl border border-blue-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                ?
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Mini Quiz Jelajah</h3>
                <p className="text-[11px] text-slate-500">Raih +{quiz.questions.reduce((sum,q)=>sum+q.points,0)} Jejak Points dengan menjawab kuis</p>
              </div>
            </div>

            {quizCompleted && (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[11px] font-bold">
                ✓ Selesai
              </span>
            )}
          </div>

          {!alreadyCompleted&&<div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900 flex items-center justify-between gap-3"><span>Scan QR di titik ini untuk membuka kuis.</span><button className="font-semibold underline" onClick={()=>onNavigate('/app/smart-guide')}>Buka peta</button></div>}
          <div className={`space-y-4 pt-1 ${!alreadyCompleted?'opacity-50 pointer-events-none':''}`}>
            {quiz.questions.map((question, qIdx) => (
              <div key={question.id} className="space-y-3">
                <p className="text-xs font-bold text-slate-800 leading-snug">
                  {qIdx + 1}. {question.question}
                </p>

                <div className="space-y-2">
                  {question.options.map(opt => {
                    const isSelected = selectedOptions[question.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(question.id, opt.id)}
                        disabled={quizResult?.isCorrect}
                        className={`w-full p-3 rounded-xl text-xs text-left border transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-950 font-semibold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="flex-1 pr-2">{opt.text}</span>
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] shrink-0 ${
                          isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && '✓'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Quiz Result Banner */}
          {quizResult && (
            <div className={`p-4 rounded-xl text-xs space-y-1.5 ${
              quizResult.isCorrect 
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                {quizResult.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Jawaban Tepat!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Belum Tepat</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed">{quizResult.message}</p>
              {quizResult.explanation && (
                <div className="pt-2 mt-2 border-t border-slate-200/60 font-normal">
                  <span className="font-semibold block mb-0.5">Penjelasan Ilmiah:</span>
                  {quizResult.explanation}
                </div>
              )}
            </div>
          )}

          {/* Submit CTA */}
          {(!quizResult || !quizResult.isCorrect) && (
            <button
              onClick={handleSubmitQuiz}
              disabled={!alreadyCompleted || isSubmitting || Object.keys(selectedOptions).length !== quiz.questions.length}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span>Kirim Jawaban Kuis</span>
              )}
            </button>
          )}

        </div>
      )}

      {/* Bottom Route Progression */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => onNavigate('/app/smart-guide')}
          className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Lanjutkan ke Titik Berikutnya di Smart Guide</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

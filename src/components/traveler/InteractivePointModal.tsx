import React, { useState, useEffect } from 'react';
import { ExplorePoint, Quiz, Destination } from '../../types/destination';
import { useTakonoStore } from '../../services/store';
import confetti from 'canvas-confetti';
import {
  X,
  BookOpen,
  HelpCircle,
  ShoppingBag,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  QrCode,
  Tag,
  Check,
  ShieldCheck,
} from 'lucide-react';

interface InteractivePointModalProps {
  point: ExplorePoint | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToNextPoint?: (nextPointId: string) => void;
}

export const InteractivePointModal: React.FC<InteractivePointModalProps> = ({
  point,
  isOpen,
  onClose,
  onNavigateToNextPoint,
}) => {
  const {
    getDestination,
    getQuizByExplorePoint,
    explorePoints,
    activeJourney,
    recordPointInteraction,
    submitQuizAttempt,
    getApprovedUMKMByDestination,
    redeemReward,
    currentUser,
    setQrModalOpen,
  } = useTakonoStore();

  const [activeTab, setActiveTab] = useState<'story' | 'quiz' | 'umkm'>('story');

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<{ message: string; pointsEarned: number } | null>(null);

  // Voucher claim notification
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);

  const destination: Destination | undefined = point ? getDestination(point.destinationId) : undefined;
  const quiz: Quiz | undefined = point ? getQuizByExplorePoint(point.id) : undefined;

  // Track interactions
  useEffect(() => {
    if (point && isOpen) {
      recordPointInteraction(point.id, 'view');
      // Reset quiz local selection
      if (quiz) {
        setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
      }
      setQuizSubmitted(false);
      setQuizResult(null);
      setClaimedNotice(null);
      setActiveTab('story');
    }
  }, [point?.id, isOpen]);

  if (!isOpen || !point) return null;

  // Find index and next point in sequence
  const destPoints = explorePoints
    .filter((p) => p.destinationId === point.destinationId)
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  const currentIndex = destPoints.findIndex((p) => p.id === point.id);
  const nextPoint = currentIndex >= 0 && currentIndex < destPoints.length - 1 ? destPoints[currentIndex + 1] : null;

  // Status in active journey
  const visitedRecord = activeJourney?.visitedPoints.find((vp) => vp.explorePointId === point.id);
  const isPointCompleted = !!visitedRecord?.completedAt;
  const previousQuizAttempt = activeJourney?.completedQuizzes.find((cq) => cq.explorePointId === point.id);

  // Connected UMKM
  const nearbyUMKMs = destination ? getApprovedUMKMByDestination(destination.id) : [];

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (quizSubmitted || previousQuizAttempt) return;
    const next = [...selectedAnswers];
    next[questionIndex] = optionIndex;
    setSelectedAnswers(next);
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz || selectedAnswers.includes(-1)) return;

    const res = submitQuizAttempt(quiz.id, selectedAnswers);
    setQuizSubmitted(true);
    setQuizResult({
      message: res.message,
      pointsEarned: res.pointsEarned,
    });

    if (res.pointsEarned > 0) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      // also mark point completed
      recordPointInteraction(point.id, 'complete');
    }
  };

  const handleManualCheckIn = () => {
    const res = recordPointInteraction(point.id, 'complete');
    if (res.success) {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
      });
    }
  };

  const handleClaimVoucher = (rewardId: string, title: string) => {
    const res = redeemReward(rewardId);
    if (res.success) {
      setClaimedNotice(`Berhasil menukar voucher "${title}"! Kode klaim: ${res.claimRecord?.redemptionCode}`);
      setTimeout(() => setClaimedNotice(null), 6000);
      confetti({
        particleCount: 40,
        spread: 45,
      });
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Hero */}
        <div className="relative h-44 sm:h-52 bg-slate-950 shrink-0">
          <img
            src={point.imageUrl || destination?.heroImage}
            alt={point.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition z-10"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-slate-950 shadow-xs">
              Titik #{point.sequenceOrder}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/20 text-white backdrop-blur-md border border-white/20">
              {point.category}
            </span>
            {isPointCompleted && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Telah Dijelajahi</span>
              </span>
            )}
          </div>

          {/* Title & Info inside Hero */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight leading-snug drop-shadow-md">
              {point.name}
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-300 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {point.locationName || destination?.name}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Est. {point.estimatedMinutes} menit
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                +{point.completionPoints} Poin Kunjungan
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation (Simple & Clear) */}
        <div className="flex border-b border-slate-200 bg-slate-50/90 text-xs font-semibold px-4 pt-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('story')}
            className={`flex items-center gap-1.5 py-3 px-4 border-b-2 transition ${
              activeTab === 'story'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Cerita & Etika Budaya</span>
          </button>

          {quiz && (
            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 py-3 px-4 border-b-2 transition ${
                activeTab === 'quiz'
                  ? 'border-emerald-600 text-emerald-700 font-bold bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Kuis Edukasi</span>
              {previousQuizAttempt ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              ) : (
                <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                  +{quiz.totalPointsAvailable} Pts
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('umkm')}
            className={`flex items-center gap-1.5 py-3 px-4 border-b-2 transition ${
              activeTab === 'umkm'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Warung & Diskon Terdekat</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {nearbyUMKMs.length}
            </span>
          </button>
        </div>

        {/* Claimed notice toast */}
        {claimedNotice && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-2.5 font-medium flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              {claimedNotice}
            </span>
            <button
              type="button"
              onClick={() => setClaimedNotice(null)}
              className="text-emerald-200 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
          {/* TAB 1: STORY & CULTURAL ETIQUETTE */}
          {activeTab === 'story' && (
            <div className="space-y-4">
              {/* Short snippet */}
              <p className="text-sm font-medium text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                {point.shortDescription}
              </p>

              {/* Story Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Narasi Warisan & Cerita Budaya</span>
                </h4>
                <div className="text-xs text-slate-600 leading-relaxed space-y-2">
                  {point.story.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Facts list */}
              {point.facts && point.facts.length > 0 && (
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 space-y-2">
                  <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fakta Menarik di Lokasi Ini</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-emerald-950">
                    {point.facts.map((fact, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cultural Norms & Etiquette (Very Important for Travelers!) */}
              {(point.education?.culturalNorms || point.education?.etiquette) && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Tata Tertib & Pantangan Adat yang Wajib Dihormati</span>
                  </div>
                  <div className="text-xs text-amber-900 leading-relaxed space-y-1">
                    {point.education.culturalNorms && (
                      <p>• {point.education.culturalNorms}</p>
                    )}
                    {point.education.etiquette && (
                      <p>• {point.education.etiquette}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Recommended Activity */}
              {point.activity && (
                <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-700 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Aktivitas yang Disarankan: </strong>
                    <span>{point.activity}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: QUIZ */}
          {activeTab === 'quiz' && quiz && (
            <div className="space-y-5">
              {previousQuizAttempt ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <h4 className="font-bold text-emerald-950">Kuis Sudah Selesai!</h4>
                    <p className="text-emerald-800">
                      Anda telah memperoleh <strong>+{previousQuizAttempt.pointsEarned} Jejak Points</strong> pada{' '}
                      {new Date(previousQuizAttempt.completedAt).toLocaleDateString('id-ID')}. Anda dapat melihat soal dan pembahasan di bawah.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <span>Jawab kuis ini dengan benar untuk mendapatkan poin!</span>
                  </div>
                  <span className="font-bold text-indigo-700">+{quiz.totalPointsAvailable} Poin</span>
                </div>
              )}

              <form onSubmit={handleQuizSubmit} className="space-y-5">
                {quiz.questions.map((q, qIndex) => {
                  const hasAnswered = selectedAnswers[qIndex] !== -1;
                  const chosen = selectedAnswers[qIndex];
                  const isCorrectAnswer = chosen === q.correctOptionIndex;

                  return (
                    <div
                      key={q.id || qIndex}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                    >
                      <h5 className="font-semibold text-xs text-slate-900">
                        {qIndex + 1}. {q.question}
                      </h5>

                      <div className="space-y-2">
                        {q.options.map((opt, optIndex) => {
                          const isSelected = chosen === optIndex;
                          const showCorrect = (quizSubmitted || previousQuizAttempt) && optIndex === q.correctOptionIndex;
                          const showWrong = (quizSubmitted || previousQuizAttempt) && isSelected && !isCorrectAnswer;

                          return (
                            <button
                              type="button"
                              key={optIndex}
                              onClick={() => handleSelectOption(qIndex, optIndex)}
                              disabled={quizSubmitted || !!previousQuizAttempt}
                              className={`w-full text-left p-3 rounded-xl text-xs border transition flex items-center justify-between ${
                                showCorrect
                                  ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                                  : showWrong
                                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                                  : isSelected
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
                                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                              }`}
                            >
                              <span>{opt}</span>
                              {showCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                            </button>
                          );
                        })}
                      </div>

                      {(quizSubmitted || previousQuizAttempt) && q.explanation && (
                        <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                          <strong className="text-emerald-700">Penjelasan: </strong>
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}

                {!previousQuizAttempt && !quizSubmitted && (
                  <button
                    type="submit"
                    disabled={selectedAnswers.includes(-1)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Kirim Jawaban & Ambil Poin</span>
                  </button>
                )}

                {quizResult && (
                  <div className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-medium text-center space-y-1">
                    <p className="font-bold">{quizResult.message}</p>
                    {quizResult.pointsEarned > 0 && (
                      <p className="text-emerald-700 font-mono text-sm font-bold">
                        +{quizResult.pointsEarned} Poin telah ditambahkan ke dompet Anda! 🎉
                      </p>
                    )}
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 3: NEARBY UMKM & VOUCHERS */}
          {activeTab === 'umkm' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">
                    Warung & Mitra Kuliner/Oleh-Oleh Terdekat
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Tukarkan Jejak Points Anda dengan potongan harga langsung di warung berikut.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Saldo Anda:</span>
                  <span className="text-xs font-bold text-amber-600 font-mono">
                    {currentUser.pointsBalance} Pts
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {nearbyUMKMs.map((umkm) => (
                  <div
                    key={umkm.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={umkm.imageUrl}
                        alt={umkm.businessName}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                            {umkm.category}
                          </span>
                          <span className="text-[10px] text-slate-400">• Dekat lokasi titik ini</span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-xs mt-1 truncate">
                          {umkm.businessName}
                        </h5>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{umkm.description}</p>
                      </div>
                    </div>

                    {/* Vouchers / Promotions of this UMKM */}
                    {umkm.promotions.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                          <Tag className="w-3.5 h-3.5" />
                          <span>Diskon {umkm.promotions[0].discountPercentage}% ({umkm.promotions[0].title})</span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleClaimVoucher(
                              `rew-${umkm.id}`,
                              `Diskon ${umkm.promotions[0].discountPercentage}% ${umkm.businessName}`
                            )
                          }
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Tukar Diskon (25 Poin)</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Clear Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!isPointCompleted ? (
              <button
                type="button"
                onClick={handleManualCheckIn}
                className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Simulasi Check-In (+5 Pts)</span>
              </button>
            ) : (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Titik ini sudah terselesaikan</span>
              </span>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                setQrModalOpen(true);
              }}
              className="px-3 py-2 border border-slate-300 hover:bg-white text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1 transition"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan QR</span>
            </button>
          </div>

          {/* Next Point shortcut */}
          {nextPoint && onNavigateToNextPoint && (
            <button
              type="button"
              onClick={() => onNavigateToNextPoint(nextPoint.id)}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <span>Lanjut: Titik #{nextPoint.sequenceOrder} ({nextPoint.name})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

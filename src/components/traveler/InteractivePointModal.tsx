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
  Sparkles,
  QrCode,
  Tag,
  Check,
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
      // Menutup modal dengan mulus setelah simulasi check-in berhasil agar tidak blank
      setTimeout(() => {
        onClose();
      }, 800);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Hero */}
        <div className="relative h-48 sm:h-56 bg-neutral-950 shrink-0">
          <img
            src={point.imageUrl || destination?.heroImage}
            alt={point.name}
            className="w-full h-full object-cover brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-black/30" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition z-10"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-xs font-mono">
              Titik #{point.sequenceOrder}
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white backdrop-blur-md border border-white/20">
              {point.category}
            </span>
            {isPointCompleted && (
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white flex items-center gap-1.5 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Telah Dijelajahi</span>
              </span>
            )}
          </div>

          {/* Title & Info inside Hero */}
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug drop-shadow-md">
              {point.name}
            </h2>
            <div className="flex items-center gap-4 text-xs text-neutral-300 font-mono">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                {point.locationName || destination?.name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Est. {point.estimatedMinutes} menit
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-bold text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                +{point.completionPoints} PTS
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 bg-neutral-50/90 text-xs font-bold px-6 pt-2 shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('story')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition rounded-t-xl ${
              activeTab === 'story'
                ? 'border-blue-600 text-blue-700 bg-white shadow-2xs'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Cerita & Etika Budaya</span>
          </button>

          {quiz && (
            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 transition rounded-t-xl ${
                activeTab === 'quiz'
                  ? 'border-blue-600 text-blue-700 bg-white shadow-2xs'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Kuis Edukasi</span>
              {previousQuizAttempt ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">
                  +{quiz.totalPointsAvailable} PTS
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('umkm')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition rounded-t-xl ${
              activeTab === 'umkm'
                ? 'border-blue-600 text-blue-700 bg-white shadow-2xs'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Warung & Diskon</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700 font-mono">
              {nearbyUMKMs.length}
            </span>
          </button>
        </div>

        {/* Claimed notice toast */}
        {claimedNotice && (
          <div className="bg-emerald-600 text-white text-xs px-6 py-3 font-semibold flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-neutral-800">
          
          {/* TAB 1: STORY & CULTURAL ETIQUETTE */}
          {activeTab === 'story' && (
            <div className="space-y-5">
              <p className="text-sm font-medium text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
                {point.shortDescription}
              </p>

              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Narasi Warisan & Cerita Budaya</span>
                </h4>
                <div className="text-xs text-neutral-600 leading-relaxed space-y-3">
                  {point.story.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              {point.facts && point.facts.length > 0 && (
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/70 space-y-2">
                  <h5 className="text-xs font-bold text-blue-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Fakta Menarik di Lokasi Ini</span>
                  </h5>
                  <ul className="space-y-2 text-xs text-blue-950">
                    {point.facts.map((fact, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(point.education?.culturalNorms || point.education?.etiquette) && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Tata Tertib & Pantangan Adat yang Wajib Dihormati</span>
                  </div>
                  <div className="text-xs text-amber-900 leading-relaxed space-y-1.5">
                    {point.education.culturalNorms && (
                      <p>• {point.education.culturalNorms}</p>
                    )}
                    {point.education.etiquette && (
                      <p>• {point.education.etiquette}</p>
                    )}
                  </div>
                </div>
              )}

              {point.activity && (
                <div className="p-4 bg-neutral-100 rounded-2xl text-xs text-neutral-700 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-neutral-900 font-bold">Aktivitas yang Disarankan: </strong>
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
                      Anda telah memperoleh <strong className="font-mono">+{previousQuizAttempt.pointsEarned} PTS</strong> pada{' '}
                      {new Date(previousQuizAttempt.completedAt).toLocaleDateString('id-ID')}. Anda dapat melihat soal dan pembahasan di bawah.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Jawab kuis ini dengan benar untuk mendapatkan poin!</span>
                  </div>
                  <span className="font-bold text-blue-700 font-mono">+{quiz.totalPointsAvailable} PTS</span>
                </div>
              )}

              <form onSubmit={handleQuizSubmit} className="space-y-6">
                {quiz.questions.map((q, qIndex) => {
                  const chosen = selectedAnswers[qIndex];
                  const showCorrect = (quizSubmitted || previousQuizAttempt) && chosen === q.correctOptionIndex;
                  const showWrong = (quizSubmitted || previousQuizAttempt) && chosen !== -1 && chosen !== q.correctOptionIndex;

                  return (
                    <div
                      key={q.id || qIndex}
                      className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3.5"
                    >
                      <h5 className="font-bold text-xs sm:text-sm text-neutral-900">
                        {qIndex + 1}. {q.question}
                      </h5>

                      <div className="space-y-2">
                        {q.options.map((opt, optIndex) => {
                          const isSelected = chosen === optIndex;
                          const isTargetCorrect = (quizSubmitted || previousQuizAttempt) && optIndex === q.correctOptionIndex;

                          return (
                            <button
                              type="button"
                              key={optIndex}
                              onClick={() => handleSelectOption(qIndex, optIndex)}
                              disabled={quizSubmitted || !!previousQuizAttempt}
                              className={`w-full text-left p-3.5 rounded-xl text-xs border transition flex items-center justify-between ${
                                isTargetCorrect
                                  ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                                  : showWrong && isSelected
                                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                                  : isSelected
                                  ? 'bg-blue-50 border-blue-500 text-blue-950 font-semibold'
                                  : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-700'
                              }`}
                            >
                              <span>{opt}</span>
                              {isTargetCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                            </button>
                          );
                        })}
                      </div>

                      {(quizSubmitted || previousQuizAttempt) && q.explanation && (
                        <p className="text-[11px] text-neutral-600 bg-white p-3 rounded-xl border border-neutral-200">
                          <strong className="text-blue-600 font-bold">Penjelasan: </strong>
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
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Kirim Jawaban & Ambil Poin</span>
                  </button>
                )}

                {quizResult && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold text-center space-y-1">
                    <p>{quizResult.message}</p>
                    {quizResult.pointsEarned > 0 && (
                      <p className="text-emerald-700 font-mono text-sm font-black">
                        +{quizResult.pointsEarned} PTS telah ditambahkan ke dompet Anda! 🎉
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
                  <h4 className="font-bold text-xs sm:text-sm text-neutral-900">
                    Warung & Mitra Kuliner/Oleh-Oleh Terdekat
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Tukarkan Jejak Points Anda dengan potongan harga langsung di warung berikut.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block font-mono">Saldo Anda:</span>
                  <span className="text-xs font-black text-amber-600 font-mono">
                    {currentUser.pointsBalance} PTS
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {nearbyUMKMs.map((umkm) => (
                  <div
                    key={umkm.id}
                    className="p-4 rounded-2xl border border-neutral-200 bg-white hover:border-blue-300 transition space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={umkm.imageUrl}
                        alt={umkm.businessName}
                        className="w-16 h-16 rounded-xl object-cover border border-neutral-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                            {umkm.category}
                          </span>
                          <span className="text-[10px] text-neutral-400">• Dekat lokasi titik ini</span>
                        </div>
                        <h5 className="font-bold text-neutral-900 text-xs truncate">
                          {umkm.businessName}
                        </h5>
                        <p className="text-[11px] text-neutral-500 line-clamp-1">{umkm.description}</p>
                      </div>
                    </div>

                    {umkm.promotions.length > 0 && (
                      <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-700 font-semibold">
                          <Tag className="w-3.5 h-3.5 text-blue-600" />
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
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Tukar Diskon (25 PTS)</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!isPointCompleted ? (
              <button
                type="button"
                onClick={handleManualCheckIn}
                className="w-full sm:w-auto px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Simulasi Check-In (+5 PTS)</span>
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 px-2">
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
              className="px-3.5 py-2.5 border border-neutral-300 hover:bg-white text-neutral-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan QR</span>
            </button>
          </div>

          {nextPoint && onNavigateToNextPoint && (
            <button
              type="button"
              onClick={() => onNavigateToNextPoint(nextPoint.id)}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md"
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
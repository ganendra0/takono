import React, { useState } from 'react';
import { Quiz } from '../../types/destination';
import { useTakonoStore } from '../../services/store';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle, XCircle, Award, AlertCircle, ArrowRight, X } from 'lucide-react';

interface MiniQuizModalProps {
  quiz: Quiz;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (pointsEarned: number) => void;
}

export const MiniQuizModal: React.FC<MiniQuizModalProps> = ({
  quiz,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { submitQuizAttempt, activeJourney } = useTakonoStore();
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    new Array(quiz.questions.length).fill(-1)
  );
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [pointsAwarded, setPointsAwarded] = useState<number>(0);
  const [isAlreadyCompleted, setIsAlreadyCompleted] = useState<boolean>(false);

  if (!isOpen) return null;

  // Check if current active journey already completed this quiz
  const previousAttempt = activeJourney?.completedQuizzes.find((cq) => cq.quizId === quiz.id);

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (submitted || previousAttempt) return;
    const next = [...selectedAnswers];
    next[questionIndex] = optionIndex;
    setSelectedAnswers(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnswers.includes(-1)) return;

    const res = submitQuizAttempt(quiz.id, selectedAnswers);
    setSubmitted(true);
    setResultMessage(res.message);
    setPointsAwarded(res.pointsEarned);
    if (res.alreadyCompleted) {
      setIsAlreadyCompleted(true);
    } else if (res.pointsEarned > 0) {
      // Trigger festive celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      if (onSuccess) onSuccess(res.pointsEarned);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-700 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center">
              <Award className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-tight">{quiz.title}</h3>
              <p className="text-[11px] text-emerald-200">Mini Kuis Interaktif (+{quiz.totalPointsAvailable} Jejak Points)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {previousAttempt && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Kuis Ini Sudah Pernah Anda Tuntaskan</p>
                <p className="text-amber-800 mt-0.5">
                  Anda telah memperoleh +{previousAttempt.pointsEarned} poin pada{' '}
                  {new Date(previousAttempt.completedAt).toLocaleDateString('id-ID')}. Anda dapat meninjau soal dan jawaban di bawah ini.
                </p>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-600 leading-relaxed">{quiz.description}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {quiz.questions.map((q, qIndex) => {
              const selectedOpt = previousAttempt
                ? previousAttempt.selectedAnswers[qIndex]
                : selectedAnswers[qIndex];
              const isCorrect = selectedOpt === q.correctOptionIndex;

              return (
                <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {qIndex + 1}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-800 leading-snug">{q.question}</h4>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIndex) => {
                      const isOptionSelected = selectedOpt === optIndex;
                      const isOptionCorrect = optIndex === q.correctOptionIndex;

                      let style = 'border-slate-200 hover:border-slate-300 bg-white text-slate-700';

                      if (submitted || previousAttempt) {
                        if (isOptionCorrect) {
                          style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-400';
                        } else if (isOptionSelected && !isOptionCorrect) {
                          style = 'border-rose-300 bg-rose-50 text-rose-900 line-through';
                        }
                      } else if (isOptionSelected) {
                        style = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                      }

                      return (
                        <button
                          key={optIndex}
                          type="button"
                          disabled={submitted || !!previousAttempt}
                          onClick={() => handleSelectOption(qIndex, optIndex)}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center justify-between ${style}`}
                        >
                          <span>{opt}</span>
                          {(submitted || previousAttempt) && isOptionCorrect && (
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                          )}
                          {(submitted || previousAttempt) && isOptionSelected && !isOptionCorrect && (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission or previous attempt */}
                  {(submitted || previousAttempt) && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-600">
                      <strong className="text-slate-800">Penjelasan: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Result banner if just submitted */}
            {submitted && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1 animate-in fade-in">
                <p className="font-bold text-sm text-emerald-950">{resultMessage}</p>
                {pointsAwarded > 0 && (
                  <p className="text-xs text-emerald-700">
                    Poin telah dicatat secara otomatis ke dalam buku besar Jejak Points Anda!
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
              >
                {submitted || previousAttempt ? 'Tutup' : 'Batal'}
              </button>

              {!submitted && !previousAttempt && (
                <button
                  type="submit"
                  disabled={selectedAnswers.includes(-1)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <span>Kirim Jawaban</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

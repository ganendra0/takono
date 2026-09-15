import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { Quiz, QuizQuestion } from '../../types/destination';
import {
  BookOpen,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Edit3,
  X,
  HelpCircle,
} from 'lucide-react';

export const ManagerQuizzes: React.FC = () => {
  const {
    destinations,
    explorePoints,
    quizzes,
    addQuiz,
    updateQuiz,
    navigateTo,
  } = useTakonoStore();

  const [selectedDestId, setSelectedDestId] = useState<string>(destinations[0]?.id || '');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  // Form states
  const [targetPointId, setTargetPointId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [questionText, setQuestionText] = useState<string>('');
  const [option0, setOption0] = useState<string>('');
  const [option1, setOption1] = useState<string>('');
  const [option2, setOption2] = useState<string>('');
  const [option3, setOption3] = useState<string>('');
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);
  const [explanation, setExplanation] = useState<string>('');
  const [totalPointsAvailable, setTotalPointsAvailable] = useState<number>(10);

  const destPoints = explorePoints.filter((p) => p.destinationId === selectedDestId);
  const destQuizzes = quizzes.filter((q) => q.destinationId === selectedDestId);

  const handleOpenAddModal = () => {
    setEditingQuiz(null);
    setTargetPointId(destPoints[0]?.id || '');
    setTitle('Kuis Edukasi Budaya');
    setDescription('Uji pemahaman Anda tentang filosofi dan kearifan lokal.');
    setQuestionText('');
    setOption0('');
    setOption1('');
    setOption2('');
    setOption3('');
    setCorrectOptionIndex(0);
    setExplanation('');
    setTotalPointsAvailable(10);
    setModalOpen(true);
  };

  const handleOpenEditModal = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setTargetPointId(quiz.explorePointId);
    setTitle(quiz.title);
    setDescription(quiz.description);
    const q = quiz.questions[0] || {
      question: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      explanation: '',
    };
    setQuestionText(q.question);
    setOption0(q.options[0] || '');
    setOption1(q.options[1] || '');
    setOption2(q.options[2] || '');
    setOption3(q.options[3] || '');
    setCorrectOptionIndex(q.correctOptionIndex);
    setExplanation(q.explanation);
    setTotalPointsAvailable(quiz.totalPointsAvailable);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const questions: QuizQuestion[] = [
      {
        id: `q-${Date.now()}`,
        question: questionText,
        options: [option0, option1, option2, option3],
        correctOptionIndex,
        explanation,
        pointsAwarded: totalPointsAvailable,
      },
    ];

    if (editingQuiz) {
      updateQuiz(editingQuiz.id, {
        explorePointId: targetPointId,
        title,
        description,
        totalPointsAvailable,
        questions,
      });
    } else {
      addQuiz({
        destinationId: selectedDestId,
        explorePointId: targetPointId,
        title,
        description,
        totalPointsAvailable,
        questions,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigateTo('/manager/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Manager</span>
          </button>
          <h1 className="text-xl font-bold text-slate-900">Kelola Kuis Budaya (Mini Quizzes)</h1>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDestId}
            onChange={(e) => setSelectedDestId(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-medium"
          >
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Kuis Baru</span>
          </button>
        </div>
      </div>

      {/* Quizzes List */}
      <div className="space-y-4">
        {destQuizzes.map((quiz) => {
          const point = explorePoints.find((p) => p.id === quiz.explorePointId);
          return (
            <div
              key={quiz.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    Terikat pada: {point?.name || 'Explore Point'}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-600">
                    +{quiz.totalPointsAvailable} Poin
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900">{quiz.title}</h3>
                <p className="text-xs text-slate-600">{quiz.description}</p>
                {quiz.questions[0] && (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                    "Soal: {quiz.questions[0].question}"
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleOpenEditModal(quiz)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Sunting Kuis</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Add/Edit Quiz */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-bold text-sm">
                {editingQuiz ? 'Sunting Kuis Budaya' : 'Buat Kuis Budaya Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Tautkan ke Explore Point</label>
                <select
                  value={targetPointId}
                  onChange={(e) => setTargetPointId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
                  required
                >
                  {destPoints.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.sequenceOrder} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Judul Kuis</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Total Poin Diberikan</label>
                  <input
                    type="number"
                    value={totalPointsAvailable}
                    onChange={(e) => setTotalPointsAvailable(parseInt(e.target.value) || 10)}
                    required
                    min={1}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Pertanyaan</label>
                <textarea
                  rows={2}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                  placeholder="Tuliskan pertanyaan budaya di sini..."
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="space-y-2 pt-1">
                <label className="font-semibold text-slate-700 block">
                  Pilihan Jawaban (Pilih radio button untuk kunci jawaban yang benar):
                </label>
                {[
                  { val: option0, set: setOption0, idx: 0, label: 'A' },
                  { val: option1, set: setOption1, idx: 1, label: 'B' },
                  { val: option2, set: setOption2, idx: 2, label: 'C' },
                  { val: option3, set: setOption3, idx: 3, label: 'D' },
                ].map((item) => (
                  <div key={item.idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={correctOptionIndex === item.idx}
                      onChange={() => setCorrectOptionIndex(item.idx)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-slate-600 w-4">{item.label}.</span>
                    <input
                      type="text"
                      value={item.val}
                      onChange={(e) => item.set(e.target.value)}
                      required
                      placeholder={`Pilihan ${item.label}`}
                      className="flex-1 p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Penjelasan Jawaban yang Benar</label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  required
                  placeholder="Edukasi mengapa jawaban tersebut benar..."
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  Simpan Kuis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

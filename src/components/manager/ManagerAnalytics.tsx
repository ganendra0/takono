import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import {
  BarChart3,
  ArrowLeft,
  Users,
  QrCode,
  BookOpen,
  Coins,
  TrendingUp,
  Award,
  Download,
  Compass,
} from 'lucide-react';

export const ManagerAnalytics: React.FC = () => {
  const {
    destinations,
    explorePoints,
    journeys,
    analyticsEvents,
    navigateTo,
  } = useTakonoStore();

  const [selectedDestId, setSelectedDestId] = useState<string>(destinations[0]?.id || '');
  const destination = destinations.find((d) => d.id === selectedDestId);

  const destJourneys = journeys.filter((j) => j.destinationId === selectedDestId);
  const destPoints = explorePoints.filter((p) => p.destinationId === selectedDestId);
  const destEvents = analyticsEvents.filter((a) => a.destinationId === selectedDestId);

  const totalScans = destEvents.filter((e) => e.eventType === 'qr_scan').length;
  const totalCompletedJourneys = destJourneys.filter((j) => j.status === 'completed').length;
  const totalQuizzesAnswered = destJourneys.reduce((acc, j) => acc + j.completedQuizzes.length, 0);
  const totalPointsAwarded = destJourneys.reduce((acc, j) => acc + j.earnedPointsTotal, 0);

  // Calculate engagement per explore point
  const pointVisitCounts: Record<string, number> = {};
  destJourneys.forEach((j) => {
    j.visitedPoints.forEach((vp) => {
      if (vp.completedAt) {
        pointVisitCounts[vp.explorePointId] = (pointVisitCounts[vp.explorePointId] || 0) + 1;
      }
    });
  });

  return (
    <div className="w-full max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigateTo('/manager/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 mb-1 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Manager</span>
          </button>
          <h1 className="text-xl font-bold text-slate-900">
            Analisis & Wawasan Pengunjung
          </h1>
          <p className="text-xs text-slate-500">
            Data perilaku dan pergerakan wisatawan untuk pengambilan keputusan berbasis bukti di {destination?.name || 'Destinasi'}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDestId}
            onChange={(e) => setSelectedDestId(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 font-medium shadow-2xs"
          >
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => alert('Fitur unduh laporan analitik diekspor.')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>UNDUH LAPORAN</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Kunjungan</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {destJourneys.length}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
              Aktif
            </span>
          </div>
          <span className="text-xs text-slate-500 block">
            {totalCompletedJourneys} Selesai Penuh Jurnalis
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pindai QR</span>
            <QrCode className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-3xl font-extrabold text-slate-900 font-mono block">
            {totalScans}
          </span>
          <span className="text-xs text-slate-500 block">
            Aktivitas plakat lapangan
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kuis Budaya Selesai</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-3xl font-extrabold text-slate-900 font-mono block">
            {totalQuizzesAnswered}
          </span>
          <span className="text-xs text-slate-500 block">
            Evaluasi edukasi budaya
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jejak Points Beredar</span>
            <Coins className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-3xl font-extrabold text-blue-600 font-mono block">
            +{totalPointsAwarded} <span className="text-xs text-slate-500 font-normal">PTS</span>
          </span>
          <span className="text-xs text-slate-500 block">
            Potensi konversi UMKM
          </span>
        </div>
      </div>

      {/* Explore Points Popularity Bar List */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Tingkat Kunjungan per Titik Jelajah
              </h3>
              <p className="text-xs text-slate-500">
                Explore Point Popularity berdasarkan rekam jejak check-in traveler di lapangan.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
            REAL-TIME TELEMETRY
          </span>
        </div>

        <div className="space-y-4">
          {destPoints.map((point) => {
            const count = pointVisitCounts[point.id] || 0;
            const maxCount = Math.max(...Object.values(pointVisitCounts), 1);
            const percentage = Math.round((count / maxCount) * 100);

            return (
              <div key={point.id} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    #{point.sequenceOrder} {point.name}
                  </span>
                  <span className="font-mono text-slate-500 font-medium">
                    {count} kunjungan selesai ({percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(percentage, 3)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ManagerAnalytics;
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
          <h1 className="text-xl font-bold text-slate-900">
            Analisis & Wawasan Pengunjung (Manager Analytics)
          </h1>
          <p className="text-xs text-slate-500">
            Data perilaku dan pergerakan wisatawan untuk pengambilan keputusan berbasis bukti.
          </p>
        </div>

        <select
          value={selectedDestId}
          onChange={(e) => setSelectedDestId(e.target.value)}
          className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-semibold"
        >
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500">Total Kunjungan</span>
          <span className="text-2xl font-bold text-slate-900 font-mono block">
            {destJourneys.length}
          </span>
          <span className="text-[11px] text-emerald-600 font-medium">
            {totalCompletedJourneys} Selesai Penuh
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500">Total Pindai QR</span>
          <span className="text-2xl font-bold text-indigo-600 font-mono block">
            {totalScans}
          </span>
          <span className="text-[11px] text-slate-500">Aktivitas plakat lapangan</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500">Kuis Budaya Selesai</span>
          <span className="text-2xl font-bold text-emerald-600 font-mono block">
            {totalQuizzesAnswered}
          </span>
          <span className="text-[11px] text-slate-500">Evaluasi edukasi budaya</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500">Jejak Points Beredar</span>
          <span className="text-2xl font-bold text-amber-600 font-mono block">
            +{totalPointsAwarded}
          </span>
          <span className="text-[11px] text-slate-500">Potensi konversi UMKM</span>
        </div>
      </div>

      {/* Explore Points Popularity Bar List */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">
          Tingkat Kunjungan per Titik Jelajah (Explore Point Popularity)
        </h3>

        <div className="space-y-3">
          {destPoints.map((point) => {
            const count = pointVisitCounts[point.id] || 0;
            const maxCount = Math.max(...Object.values(pointVisitCounts), 1);
            const percentage = Math.round((count / maxCount) * 100);

            return (
              <div key={point.id} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">
                    #{point.sequenceOrder} {point.name}
                  </span>
                  <span className="font-mono text-slate-500">{count} kunjungan selesai</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.max(percentage, 5)}%` }}
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

import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { 
  BarChart3, 
  Users, 
  QrCode, 
  BookOpen, 
  Coins, 
  ArrowLeft, 
  ChevronDown, 
  TrendingUp, 
  Compass,
  Download
} from 'lucide-react';

export const ManagerAnalytics: React.FC = () => {
  const store = useTakonoStore();
  const destinations = store.destinations || [];
  const explorePoints = store.explorePoints || [];
  const quizzes = store.quizzes || [];
  const navigateTo = store.navigateTo;

  const [selectedDestId, setSelectedDestId] = useState<string>(
    destinations[0]?.id || 'dest-penglipuran'
  );

  const currentDest = destinations.find((d) => d.id === selectedDestId) || destinations[0] || {
    name: 'Desa Wisata Penglipuran'
  };

  const destPoints = explorePoints.filter((p) => p.destinationId === selectedDestId);

  // Simulasi data metrik analitik
  const metrics = {
    totalVisits: 2,
    qrScans: 2,
    completedQuizzes: 1,
    circulatingPoints: 15,
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-neutral-800 antialiased max-w-7xl mx-auto">
      
      {/* 1. TOP HEADER & FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => navigateTo('/manager/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-blue-600 transition mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard Manager</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Analisis & Wawasan Pengunjung
          </h1>
          <p className="text-xs text-neutral-500">
            Data perilaku dan pergerakan wisatawan untuk pengambilan keputusan berbasis bukti di {currentDest.name}.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="relative inline-block text-left">
            <select
              value={selectedDestId}
              onChange={(e) => setSelectedDestId(e.target.value)}
              className="appearance-none bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 font-sans text-xs font-bold py-2.5 pl-4 pr-10 rounded-2xl cursor-pointer transition shadow-2xs focus:outline-none focus:border-blue-500"
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => alert('Laporan analitik ringkas berhasil diunduh (PDF/CSV)!')}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition flex items-center gap-2 shadow-md shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Laporan</span>
          </button>
        </div>
      </div>

      {/* 2. BENTO METRICS SUMMARY GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase font-mono tracking-wider">Total Kunjungan</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-neutral-900">{metrics.totalVisits}</span>
            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Aktif</span>
          </div>
          <span className="text-[11px] text-neutral-400 block font-mono">2 Selesai Penuh Jurnalis</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase font-mono tracking-wider">Total Pindai QR</span>
            <QrCode className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-neutral-900">{metrics.qrScans}</span>
          </div>
          <span className="text-[11px] text-neutral-400 block font-mono">Aktivitas plakat lapangan</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase font-mono tracking-wider">Kuis Budaya Selesai</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-neutral-900">{metrics.completedQuizzes}</span>
          </div>
          <span className="text-[11px] text-neutral-400 block font-mono">Evaluasi edukasi budaya</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase font-mono tracking-wider">Jejak Points Beredar</span>
            <Coins className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-blue-600">+{metrics.circulatingPoints}</span>
            <span className="text-xs font-mono font-bold text-blue-600">PTS</span>
          </div>
          <span className="text-[11px] text-neutral-400 block font-mono">Potensi konversi UMKM</span>
        </div>

      </div>

      {/* 3. EXPLORE POINT POPULARITY SECTION */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-neutral-900">
                Tingkat Kunjungan per Titik Jelajah
              </h3>
              <p className="text-xs text-neutral-500">
                Explore Point Popularity berdasarkan rekam jejak check-in traveler di lapangan.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">
            REAL-TIME TELEMETRY
          </span>
        </div>

        <div className="space-y-5 pt-2">
          {destPoints.length > 0 ? (
            destPoints.map((pt, idx) => {
              const visitsCount = idx === 0 ? 2 : 0;
              const percentage = idx === 0 ? 100 : 0;

              return (
                <div key={pt.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-neutral-900">
                      #{idx + 1} {pt.title}
                    </span>
                    <span className="font-mono text-blue-600">
                      {visitsCount} kunjungan selesai ({percentage}%)
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-neutral-100 overflow-hidden border border-neutral-200/60 p-0.5">
                    <div 
                      className="h-full rounded-full bg-blue-600 transition-all duration-1000"
                      style={{ width: `${Math.max(percentage, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            [
              { title: 'Angkul-Angkul & Lorong Rerata Utama', count: 2, pct: 100 },
              { title: 'Hutan Bambu Lindung Suci', count: 0, pct: 0 },
              { title: 'Bale Banjar & Sentra Kriya Tradisional', count: 0, pct: 0 },
              { title: 'Pawon Suci & Warung Herbal Cemcem', count: 0, pct: 0 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-neutral-900">
                    #{idx + 1} {item.title}
                  </span>
                  <span className="font-mono text-blue-600">
                    {item.count} kunjungan selesai
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-neutral-100 overflow-hidden border border-neutral-200/60 p-0.5">
                  <div 
                    className="h-full rounded-full bg-blue-600 transition-all duration-1000"
                    style={{ width: `${Math.max(item.pct, 4)}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. EXECUTIVE INSIGHT FOOTER CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-blue-600 text-white space-y-3 shadow-lg shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
            <TrendingUp className="w-40 h-40" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-100 block">
            WAWASAN UTAMA PENGELOLA
          </span>
          <h4 className="text-lg font-black leading-snug">
            Titik "Angkul-Angkul Utama" Menjadi Magnet Utama Wisatawan
          </h4>
          <p className="text-blue-100 text-xs leading-relaxed max-w-md">
            Sebagian besar pengunjung memulai perjalanan dari gerbang utama dan menyelesaikan seluruh modul kuis budaya. Pertahankan kebersihan dan plakat QR di titik ini.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-3 shadow-2xs flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
              POTENSI EKONOMI LOKAL
            </span>
            <h4 className="text-base font-extrabold text-neutral-900">
              Konversi Poin ke UMKM Mitra
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Sebanyak 15 poin telah beredar di tangan pengunjung. Pastikan stok cinderamata bambu dan voucher kuliner di Katalog Reward siap ditukarkan.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold font-mono text-blue-600">
            <span>Status Sistem: Optimal & Sinkron</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ManagerAnalytics;
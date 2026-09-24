import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../lib/api.js';
import { TourismStats, Destination } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { 
  Landmark, 
  TrendingUp, 
  ShieldCheck, 
  BarChart3, 
  FileText, 
  Lightbulb, 
  MapPin, 
  CheckCircle2, 
  Download,
  AlertCircle
} from 'lucide-react';

export const GovernmentDashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<TourismStats | null>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [transparency, setTransparency] = useState<any>(null);
  const [error, setError] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [performance,setPerformance] = useState<{destination:Destination;stats:TourismStats}[]>([]);

  useEffect(() => {
    const fetchGovData = async () => {
      setIsLoading(true);
      const res = await ApiClient.getGovernmentDashboard();
      const destinations = await ApiClient.getGovernmentDestinations();
      if (destinations.success && destinations.data) setPerformance(destinations.data);
      if (res.success && res.data) {
        setStats(res.data.stats);
        setInsights(res.data.insights || []);
        setTransparency(res.data.dataTransparency);
      }
      if (!res.success) setError(res.message || 'Gagal memuat data.');
      setIsLoading(false);
    };

    fetchGovData();
  }, []);

  const handleDownloadReport = async () => {
    const r = await ApiClient.getGovernmentReports();
    if (!r.success) { setError(r.message || 'Gagal mengunduh laporan.'); return; }
    const url = URL.createObjectURL(new Blob([JSON.stringify(r.data, null, 2)], {type:'application/json'}));
    const a = document.createElement('a'); a.href=url; a.download='takono-aktivitas.json'; a.click(); URL.revokeObjectURL(url);
    setReportSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Card */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-900 text-white flex items-center justify-center font-bold">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Tourism Intelligence Dashboard
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-xs font-semibold">
                  Dinas Kebudayaan & Pariwisata
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pejabat Analis: {user?.name || 'Drs. Hendra Wijaya, M.Si'} ({user?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{reportSuccess ? 'Laporan Diunduh!' : 'Unduh Laporan Agregat (JSON)'}</span>
            </button>
          </div>
        </div>

        {isLoading && <p>Memuat aktivitas…</p>}{error && <p role="alert" className="text-rose-700">{error}</p>}{!isLoading && !stats?.totalPlatformActivities && <p>Belum ada data</p>}

        {/* DATA TRANSPARENCY & ETHICAL FRAMEWORK (Mandatory Section 32 & 33) */}
        <div className="p-5 bg-white rounded-3xl border border-indigo-100 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>Prinsip Perlindungan Privasi & Transparansi Data Pariwisata</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-900 block">Sumber Data:</span>
              <p className="text-slate-600">
                Aktivitas pengguna platform TAKONO yang diagregasikan secara anonim.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-900 block">Metrik Yang Dianalisis:</span>
              <p className="text-slate-600">
                Interaksi titik jelajah, skor kuis edukasi, preferensi rute, dan klaim voucher UMKM.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-900 block">Safeguards Privasi:</span>
              <p className="text-slate-600">
                Tidak mengumpulkan atau menampilkan password, kontak pribadi, maupun profil individual wisatawan.
              </p>
            </div>
          </div>
        </div>

        {/* Aggregated High-Level Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Aktivitas Platform</span>
            <div className="text-2xl font-mono font-extrabold text-slate-900">
              {stats?.totalPlatformActivities ?? 0}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">Seluruh aktivitas tersimpan</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Titik Jelajah Ditemukan</span>
            <div className="text-2xl font-mono font-extrabold text-indigo-600">
              {stats?.totalExplorePointsDiscovered ?? 0}
            </div>
            <span className="text-[11px] text-slate-500">Scan QR Explore terverifikasi</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Aktivitas Kuis</span>
            <div className="text-2xl font-mono font-extrabold text-blue-600">
              {stats?.totalQuizzesCompleted ?? 0}
            </div>
            <span className="text-[11px] text-slate-500">Penyelesaian kuis tercatat</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Aktivitas Local Discovery</span>
            <div className="text-2xl font-mono font-extrabold text-amber-600">
              {stats?.totalLocalDiscoveryVisits ?? 0}
            </div>
            <span className="text-[11px] text-slate-500">Kunjungan melalui TAKONO</span>
          </div>

        </div>

        {/* Category Trends & Recommendations Grid */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-bold">Performa Destinasi — Aktivitas Pengguna TAKONO</h2>
          {!performance.length ? <p>Belum ada data</p> : <div className="overflow-x-auto"><table className="w-full text-xs text-left"><thead><tr>{['Destinasi','Explore Point','Kuis','Event','Reward','Local Discovery'].map(label=><th key={label} className="p-3">{label}</th>)}</tr></thead><tbody>{performance.map(({destination:d,stats:s})=><tr key={d.id} className="border-t"><td className="p-3">{d.name}</td>{[s.totalExplorePointsDiscovered,s.totalQuizzesCompleted,s.totalEventParticipations,s.totalRewardRedemptions,s.totalLocalDiscoveryVisits].map((n,i)=><td key={i} className="p-3">{n??0}</td>)}</tr>)}</tbody></table></div>}
          <h3 className="text-sm font-semibold">Tren aktivitas 7 hari</h3>
          <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">{stats?.activityTrendsByDay.map(day=><div key={day.date} className="bg-slate-50 rounded-xl p-3 text-xs"><p>{day.date}</p><p className="text-lg font-bold">{day.count}</p></div>)}</div>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Category Trends */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>Distribusi Preferensi Minat Wisatawan</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">Agregat destinasi</span>
            </div>

            <p className="text-xs text-slate-500">
              Berdasarkan aktivitas Explore Point yang tercatat.
            </p>

            <div className="space-y-3 pt-2">
              {stats?.popularCategories && stats.popularCategories.map(cat => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{cat.category}</span>
                    <span className="font-mono text-slate-600">{cat.percentage}% ({cat.count} interaksi)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Policy Insights */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Insight Kebijakan Berbasis Aktivitas</span>
              </h2>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Rekomendasi</span>
            </div>

            <p className="text-xs text-slate-500">
              Insight pariwisata berbasis aktivitas pengguna TAKONO.
            </p>

            <div className="space-y-3 pt-1">
              {insights.map(item => (
                <div 
                  key={item.id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      item.impact === 'Tinggi' ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      Dampak {item.impact}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.finding}
                  </p>
                  <div className="text-[11px] font-medium text-indigo-900 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="font-bold">Langkah Konkret:</span> {item.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

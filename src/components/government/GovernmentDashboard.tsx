import React, { useState, useEffect } from 'react';
import { useTakonoStore } from '../../services/store';
import {
  Landmark,
  TrendingUp,
  MapPin,
  Users,
  Award,
  BookOpen,
  DollarSign,
  ShieldCheck,
  Compass,
  FileText,
  BarChart3,
  Calendar,
  Building2,
  PieChart,
  Download,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const GovernmentDashboard: React.FC = () => {
  const {
    destinations,
    explorePoints,
    journeys,
    umkmList,
    rewards,
    analyticsEvents,
    activeRoute,
    navigateTo,
  } = useTakonoStore();

  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');

  // Derive tab from activeRoute
  const getTabFromRoute = (route: string): 'overview' | 'trends' | 'performance' | 'reports' => {
    if (route.includes('/trends')) return 'trends';
    if (route.includes('/performance')) return 'performance';
    if (route.includes('/reports')) return 'reports';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'performance' | 'reports'>(
    getTabFromRoute(activeRoute)
  );

  useEffect(() => {
    setActiveTab(getTabFromRoute(activeRoute));
  }, [activeRoute]);

  const handleTabChange = (tab: 'overview' | 'trends' | 'performance' | 'reports') => {
    setActiveTab(tab);
    if (tab === 'overview') navigateTo('/government/dashboard');
    else if (tab === 'trends') navigateTo('/government/trends');
    else if (tab === 'performance') navigateTo('/government/performance');
    else if (tab === 'reports') navigateTo('/government/reports');
  };

  const filteredDestinations = destinations.filter((d) =>
    selectedRegionFilter === 'all' ? true : d.province === selectedRegionFilter
  );

  const totalVisitors = journeys.length;
  const totalCompletedJourneys = journeys.filter((j) => j.status === 'completed').length;
  const totalPointsDistributed = journeys.reduce((acc, j) => acc + j.earnedPointsTotal, 0);
  const totalApprovedUmkm = umkmList.filter((u) => u.approvalStatus === 'approved').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#182230] text-white p-6 sm:p-8 shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-700 text-white">
              Data Kebijakan Kepariwisataan
            </span>
            <span className="text-xs text-sky-300 font-medium">Dinas Kebudayaan & Pariwisata</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            TAKONO Tourism Intelligence Dashboard
          </h1>
          <p className="text-xs text-stone-300 max-w-2xl font-normal">
            Pemantauan makro persebaran wisatawan, indeks pelestarian adat budaya, dan perputaran ekonomi mikro berbasis data nyata (Evidence-Based Policy).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 font-medium">Wilayah:</span>
          <select
            value={selectedRegionFilter}
            onChange={(e) => setSelectedRegionFilter(e.target.value)}
            className="text-xs bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 font-semibold outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">Seluruh Wilayah Binaan</option>
            <option value="Bali">Provinsi Bali</option>
            <option value="D.I. Yogyakarta">Provinsi D.I. Yogyakarta</option>
            <option value="Nusa Tenggara Timur">Provinsi Nusa Tenggara Timur</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="flex border-b border-stone-200 bg-stone-50/80 text-xs font-bold px-2 pt-1 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => handleTabChange('overview')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-sky-700 text-sky-950 font-bold bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Intelligence Overview</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('trends')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'trends'
                ? 'border-sky-700 text-sky-950 font-bold bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Tren Pariwisata</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('performance')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'performance'
                ? 'border-sky-700 text-sky-950 font-bold bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Kinerja Destinasi</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('reports')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'reports'
                ? 'border-sky-700 text-sky-950 font-bold bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Laporan Kebijakan</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* High-Level Macro KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-stone-500 text-xs">
                    <span className="font-semibold">Total Kunjungan</span>
                    <Users className="w-4 h-4 text-sky-700" />
                  </div>
                  <span className="text-2xl font-extrabold text-stone-900 font-mono">
                    {totalVisitors.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[11px] text-emerald-800 font-semibold block">
                    {totalCompletedJourneys} Penjelajahan Tuntas
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-stone-500 text-xs">
                    <span className="font-semibold">Destinasi Binaan</span>
                    <MapPin className="w-4 h-4 text-indigo-700" />
                  </div>
                  <span className="text-2xl font-extrabold text-stone-900 font-mono">
                    {filteredDestinations.length}
                  </span>
                  <span className="text-[11px] text-stone-500 block">
                    {filteredDestinations.filter((d) => d.status === 'published').length} Berstatus Published
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-stone-500 text-xs">
                    <span className="font-semibold">UMKM Mitra Terbina</span>
                    <Building2 className="w-4 h-4 text-amber-700" />
                  </div>
                  <span className="text-2xl font-extrabold text-stone-900 font-mono">
                    {totalApprovedUmkm}
                  </span>
                  <span className="text-[11px] text-stone-500 block">100% Legal & Terverifikasi</span>
                </div>

                <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-stone-500 text-xs">
                    <span className="font-semibold">Poin Budaya Beredar</span>
                    <Award className="w-4 h-4 text-emerald-700" />
                  </div>
                  <span className="text-2xl font-extrabold text-emerald-800 font-mono">
                    +{totalPointsDistributed}
                  </span>
                  <span className="text-[11px] text-stone-500 block">Insentif perputaran lokal</span>
                </div>
              </div>

              {/* Overview Summary & Strategic Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl border border-stone-200 bg-white space-y-3 shadow-2xs">
                  <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-sky-700" />
                    <span>Distribusi Beban Wisatawan (Dispersion Rate)</span>
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    Melalui rute terpandu TAKONO, beban kunjungan tersebar merata ke seluruh titik plakat adat hingga ke warung warga lokal di luar gerbang utama.
                  </p>
                  <div className="p-4 rounded-2xl bg-sky-50 text-xs text-sky-950 font-medium">
                    Indeks Pemerataan Alur Kunjungan: <strong className="font-bold font-mono">87.4% (Sangat Baik)</strong>
                  </div>
                </div>

                <div className="p-6 rounded-3xl border border-stone-200 bg-white space-y-3 shadow-2xs">
                  <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Kepatuhan Norma & Etika Adat</span>
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    Wisatawan wajib membaca tata tertib dan memecahkan kuis sebelum menjelajah, meminimalisir pelanggaran kesakralan pura dan area terlarang.
                  </p>
                  <div className="p-4 rounded-2xl bg-emerald-50 text-xs text-emerald-950 font-medium">
                    Tingkat Pemahaman Kuis Budaya: <strong className="font-bold font-mono">92.1% Lulus Pada Percobaan Pertama</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRENDS */}
          {activeTab === 'trends' && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 text-sm">Tren Volume Kunjungan & Jam Ramai</h3>
              <p className="text-xs text-stone-500 font-normal">
                Puncak keramaian terpantau pada rentang 09:00 - 11:30 WITA dan 14:30 - 16:30 WITA.
              </p>
              <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 text-xs space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-stone-200">
                  <span className="font-medium text-stone-700">Desa Wisata Penglipuran</span>
                  <span className="font-mono font-bold text-stone-900">420 Wisatawan / Minggu</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-stone-200">
                  <span className="font-medium text-stone-700">Kawasan Budaya Kintamani</span>
                  <span className="font-mono font-bold text-stone-900">310 Wisatawan / Minggu</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PERFORMANCE */}
          {activeTab === 'performance' && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 text-sm">Tabel Kinerja Destinasi & Kepatuhan SOP</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-100 text-stone-700 uppercase font-bold">
                    <tr>
                      <th className="p-3.5 rounded-l-xl">Destinasi</th>
                      <th className="p-3.5">Wilayah</th>
                      <th className="p-3.5">Plakat Aktif</th>
                      <th className="p-3.5">Mitra UMKM</th>
                      <th className="p-3.5 rounded-r-xl">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredDestinations.map((d) => (
                      <tr key={d.id} className="hover:bg-stone-50">
                        <td className="p-3.5 font-bold text-stone-900">{d.name}</td>
                        <td className="p-3.5 text-stone-600">{d.regency}, {d.province}</td>
                        <td className="p-3.5 font-mono">{explorePoints.filter((p) => p.destinationId === d.id).length} Titik</td>
                        <td className="p-3.5 font-mono">{umkmList.filter((u) => u.associatedDestinationIds.includes(d.id)).length} Mitra</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 text-sm">Unduh Dokumen Laporan Kebijakan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl border border-stone-200 bg-stone-50 space-y-2">
                  <h4 className="font-bold text-xs text-stone-900">Laporan Ekosistem Triwulan III 2026</h4>
                  <p className="text-[11px] text-stone-500 font-normal">Analisis dampak ekonomi mikro pada warung lokal di sekitar desa wisata binaan.</p>
                  <button className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-stone-800">
                    Unduh PDF Resmi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

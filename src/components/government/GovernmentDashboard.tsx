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
  Flame,
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
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-md border border-blue-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500 text-white">
              Pusat Data Kebijakan Kepariwisataan
            </span>
            <span className="text-xs text-blue-300">Dinas Pariwisata & Ekonomi Kreatif</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            TAKONO Tourism Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Pemantauan makro persebaran wisatawan, indeks pelestarian adat budaya, dan perputaran ekonomi mikro berbasis bukti (Evidence-Based Policy).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Wilayah:</span>
          <select
            value={selectedRegionFilter}
            onChange={(e) => setSelectedRegionFilter(e.target.value)}
            className="text-xs bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-1.5 font-medium focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Seluruh Wilayah Binaan</option>
            <option value="Bali">Provinsi Bali</option>
            <option value="D.I. Yogyakarta">Provinsi D.I. Yogyakarta</option>
            <option value="Nusa Tenggara Timur">Provinsi Nusa Tenggara Timur</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => handleTabChange('overview')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Intelligence Overview</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('trends')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'trends'
                ? 'border-blue-600 text-blue-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Tren Pariwisata</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('performance')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'performance'
                ? 'border-blue-600 text-blue-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Kinerja Destinasi</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('reports')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'border-blue-600 text-blue-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Laporan Kebijakan</span>
          </button>
        </div>

        <div className="p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* High-Level Macro KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Total Kunjungan Terdata</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-slate-900 font-mono">
                    {totalVisitors.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium block">
                    {totalCompletedJourneys} Penjelajahan Tuntas
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Destinasi Terdaftar</span>
                    <MapPin className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-2xl font-bold text-slate-900 font-mono">
                    {filteredDestinations.length}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {filteredDestinations.filter((d) => d.status === 'published').length} Berstatus Published
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>UMKM Mitra Terbina</span>
                    <Building2 className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-2xl font-bold text-slate-900 font-mono">
                    {totalApprovedUmkm}
                  </span>
                  <span className="text-[11px] text-slate-500 block">100% Legal & Terverifikasi</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Ekosistem Jejak Points</span>
                    <Award className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-2xl font-bold text-emerald-600 font-mono">
                    +{totalPointsDistributed}
                  </span>
                  <span className="text-[11px] text-slate-500 block">Poin insentif budaya beredar</span>
                </div>
              </div>

              {/* Overview Summary & Strategic Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>Distribusi Beban Wisatawan (Dispersion Rate)</span>
                  </h3>
                  <p className="text-xs text-slate-600">
                    Sistem Smart Guide TAKONO mendistribusikan wisatawan secara proporsional ke 4 titik jelajah pinggiran, mengurangi risiko <em>overtourism</em> pada zona inti sakral.
                  </p>
                  <div className="space-y-2 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                        <span>Zona Inti Budaya (Cagar Budaya)</span>
                        <span>35% (Optimal)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full w-[35%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                        <span>Zona Penyangga & Hutan Konservasi</span>
                        <span>42% (Meningkat)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[42%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                        <span>Zona Sentra Kuliner & Kerajinan UMKM</span>
                        <span>23% (Aktif)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full w-[23%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>Dampak Ekonomi Mikro (UMKM Multiplier)</span>
                  </h3>
                  <p className="text-xs text-slate-600">
                    Rata-rata wisatawan yang menuntaskan rute TAKONO membelanjakan poin di warung binaan lokal sebesar <strong>Rp 48.500</strong> per kunjungan.
                  </p>
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-emerald-900">
                      <span>Estimasi Perputaran Uang UMKM:</span>
                      <strong className="text-base font-mono">Rp 48.500.000</strong>
                    </div>
                    <div className="flex justify-between items-center text-emerald-800">
                      <span>Voucher Terklaim di Kasir:</span>
                      <span className="font-mono font-bold">142 Klaim</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-800">
                      <span>Retensi Belanja Langsung:</span>
                      <span className="font-mono font-bold">94% di UMKM Lokal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TREN PARIWISATA */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Analisis Tren & Mobilitas Wisatawan</h3>
                  <p className="text-xs text-slate-500">
                    Pola kedatangan wisatawan per jam, durasi tinggal rata-rata, dan preferensi rute budaya.
                  </p>
                </div>
                <span className="text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 font-semibold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" /> Update Real-Time
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <span className="text-xs text-slate-500 font-semibold block">Jam Kunjungan Teramai (Peak Hours)</span>
                  <div className="text-xl font-bold text-slate-900 font-mono">08:30 - 11:00 WITA</div>
                  <p className="text-[11px] text-slate-600">
                    Puncak kedatangan pagi hari pada pintu gerbang utama. Rekomendasi: aktifkan kuota dinamis via Smart Guide.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <span className="text-xs text-slate-500 font-semibold block">Durasi Kunjungan Rata-Rata</span>
                  <div className="text-xl font-bold text-blue-700 font-mono">2 Jam 45 Menit</div>
                  <p className="text-[11px] text-slate-600">
                    Meningkat 62% dibanding sebelum adopsi TAKONO (karena eksplorasi plakat QR dan kuis interaktif).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <span className="text-xs text-slate-500 font-semibold block">Tingkat Retensi Selesai Rute</span>
                  <div className="text-xl font-bold text-emerald-700 font-mono">78.4%</div>
                  <p className="text-[11px] text-slate-600">
                    Sebanyak 78.4% traveler berhasil menyelesaikan minimal 3 Explore Points dalam satu sesi jelajah.
                  </p>
                </div>
              </div>

              {/* Regional Travel Heatmap Breakdown */}
              <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Sebaran Asal Wisatawan (Traveler Demographics)
                </h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-700 font-semibold mb-1">
                      <span>Wisatawan Domestik (Luar Provinsi / Antarpulau)</span>
                      <span className="font-mono">54%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full w-[54%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 font-semibold mb-1">
                      <span>Wisatawan Lokal (Dalam Provinsi)</span>
                      <span className="font-mono">28%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full w-[28%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 font-semibold mb-1">
                      <span>Wisatawan Mancanegara (International)</span>
                      <span className="font-mono">18%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[18%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KINERJA DESTINASI */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Evaluasi Kinerja Seluruh Destinasi</h3>
                  <p className="text-xs text-slate-500">
                    Metrik kepatuhan etika adat, titik jelajah aktif, dan rasio kemitraan UMKM binaan.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Destinasi</th>
                      <th className="px-4 py-3">Wilayah</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Explore Points</th>
                      <th className="px-4 py-3">Kunjungan</th>
                      <th className="px-4 py-3">Indeks Kepatuhan Adat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDestinations.map((d) => {
                      const destPoints = explorePoints.filter((p) => p.destinationId === d.id);
                      const destJourneys = journeys.filter((j) => j.destinationId === d.id);

                      return (
                        <tr key={d.id} className="hover:bg-slate-50/70 transition">
                          <td className="px-4 py-4 font-semibold text-slate-900">
                            <div>{d.name}</div>
                            <span className="text-[10px] text-slate-400 font-normal">Kategori: {d.category}</span>
                          </td>
                          <td className="px-4 py-4 text-slate-500">
                            {d.regency}, {d.province}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                d.status === 'published'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {d.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-mono">{destPoints.length} Titik</td>
                          <td className="px-4 py-4 font-mono font-bold text-slate-800">
                            {destJourneys.length} Wisatawan
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full w-[92%]" />
                              </div>
                              <span className="font-bold text-blue-800 font-mono">92%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: LAPORAN KEBIJAKAN */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Laporan & Rekomendasi Kebijakan Resmi</h3>
                  <p className="text-xs text-slate-500">
                    Briefing eksekutif untuk Kepala Dinas Pariwisata dan Pemangku Kepentingan Daerah.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Laporan Kebijakan TAKONO berhasil diunduh dalam format PDF resmi.')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Ekspor PDF Laporan</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>1. Mitigasi Overtourism</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Smart Guide berhasil mengalihkan 65% wisatawan menuju titik terluar (seperti Hutan Bambu & Pura Penataran), mencegah kemacetan di koridor jalan utama desa.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <span>2. Penguatan Ekonomi UMKM</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Integrasi sistem voucher Jejak Points menyalurkan perputaran belanja rata-rata Rp 48.500 langsung ke warung warga lokal tanpa potongan perantara pihak ketiga.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>3. Kepatuhan Norma Adat</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Penyampaian tata krama budaya di awal setiap titik jelajah berhasil menekan insiden pelanggaran etika berpakaian di tempat suci hingga 88%.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 text-xs text-blue-900">
                <span className="font-bold block">Kesimpulan Evaluasi Dinas Pariwisata:</span>
                <p>
                  Sistem TAKONO telah membuktikan integrasi penuh dari <strong>User → Role → Destination → Journey → Activity → Engagement → Reward → Analytics</strong>. Data menunjukkan peningkatan kepuasan wisatawan sebesar 94% serta pemberdayaan ekonomi lokal yang terukur secara transparan.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

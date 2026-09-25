import React, { useEffect, useState } from 'react';
import { Activity, BarChart3, Building2, CalendarCheck, ChevronRight, Compass, Download, FileBarChart, Gift, LayoutDashboard, Lightbulb, MapPinned, ShieldCheck, Store, TrendingUp } from 'lucide-react';
import { ApiClient } from '../../lib/api';
import { Destination, TourismStats } from '../../types';
import { Empty, Notice } from '../../components/Workspace';

const navigation = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'trends', label: 'Tren Aktivitas', icon: TrendingUp },
  { key: 'performance', label: 'Performa Destinasi', icon: MapPinned },
  { key: 'insights', label: 'Insight', icon: Lightbulb },
  { key: 'reports', label: 'Laporan', icon: FileBarChart }
];
const metricConfig: [string, keyof TourismStats, React.ElementType][] = [
  ['Total aktivitas', 'totalPlatformActivities', Activity],
  ['Titik dijelajahi', 'totalExplorePointsDiscovered', Compass],
  ['Kuis selesai', 'totalQuizzesCompleted', BarChart3],
  ['Event diikuti', 'totalEventParticipations', CalendarCheck],
  ['Reward ditukar', 'totalRewardRedemptions', Gift],
  ['Usaha lokal dikunjungi', 'totalLocalDiscoveryVisits', Store]
];

export function GovernmentDashboard({ onNavigate: _onNavigate }: { onNavigate: (p: string) => void }) {
  const [view, setView] = useState('overview');
  const [stats, setStats] = useState<TourismStats | null>(null);
  const [performance, setPerformance] = useState<{ destination: Destination; stats: TourismStats }[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloaded, setDownloaded] = useState(false);

  const load = async () => {
    setLoading(true); setError('');
    const [dashboard, destinations] = await Promise.all([ApiClient.getGovernmentDashboard(), ApiClient.getGovernmentDestinations()]);
    if (dashboard.success && dashboard.data) { setStats(dashboard.data.stats); setInsights(dashboard.data.insights || []); }
    else setError(dashboard.message || 'Data tidak dapat dimuat.');
    if (destinations.success) setPerformance(destinations.data || []);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const downloadReport = async () => {
    const result = await ApiClient.getGovernmentReports();
    if (!result.success) { setError(result.message || 'Laporan gagal dibuat.'); return; }
    const url = URL.createObjectURL(new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'aktivitas-takono.json'; link.click(); URL.revokeObjectURL(url); setDownloaded(true);
  };

  return <main className="government-shell mx-auto flex w-full max-w-[1440px] flex-col lg:min-h-[calc(100vh-4rem)] lg:flex-row">
    <aside className="border-b border-slate-200 bg-white lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="hidden px-5 pb-4 pt-6 lg:block"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">TAKONO Intelligence</p><h2 className="mt-2 text-sm font-bold">Pemerintah Kota Surabaya</h2><p className="mt-1 text-[11px] text-slate-500">Aktivitas Pengguna TAKONO</p></div>
      <nav aria-label="Menu pemerintah" className="flex gap-1 overflow-x-auto p-3 lg:block lg:space-y-1 lg:px-3">{navigation.map(({ key, label, icon: Icon }) => <button key={key} onClick={() => setView(key)} className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition lg:w-full ${view === key ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}><Icon size={17} />{label}</button>)}</nav>
      <div className="hidden border-t border-slate-100 p-5 lg:block"><div className="flex items-start gap-2 text-[10px] leading-4 text-slate-500"><ShieldCheck size={16} className="shrink-0 text-emerald-600" /><span>Data agregat tanpa identitas pribadi traveler.</span></div></div>
    </aside>

    <div className="min-w-0 flex-1 bg-[#f5f7fb]">
      <header className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 lg:px-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-blue-600">Tourism Intelligence</p><h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950">{navigation.find(item => item.key === view)?.label}</h1><p className="mt-1 text-xs text-slate-500">Analisis interaksi yang tercatat di platform TAKONO.</p></div><button className="primary-button !py-2.5" onClick={downloadReport}><Download size={16} />{downloaded ? 'Laporan diunduh' : 'Unduh laporan'}</button></div></header>
      <div className="space-y-5 p-4 sm:p-6 lg:p-8">{error && <Notice error>{error} <button className="underline" onClick={load}>Coba lagi</button></Notice>}{loading ? <p className="text-sm text-slate-500">Memuat aktivitas…</p> : <GovernmentView view={view} stats={stats} performance={performance} insights={insights} onView={setView} onDownload={downloadReport} />}</div>
    </div>
  </main>;
}

function GovernmentView({ view, stats, performance, insights, onView, onDownload }: { view: string; stats: TourismStats | null; performance: { destination: Destination; stats: TourismStats }[]; insights: any[]; onView: (view: string) => void; onDownload: () => void }) {
  if (view === 'trends') return <Trends stats={stats} />;
  if (view === 'performance') return <Performance performance={performance} />;
  if (view === 'insights') return <Insights insights={insights} />;
  if (view === 'reports') return <Reports stats={stats} performance={performance} onDownload={onDownload} />;
  return <Overview stats={stats} performance={performance} insights={insights} onView={onView} />;
}

function Overview({ stats, performance, insights, onView }: { stats: TourismStats | null; performance: { destination: Destination; stats: TourismStats }[]; insights: any[]; onView: (view: string) => void }) {
  const headline = metricConfig.slice(0, 4);
  return <>
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">{headline.map(([label, key, Icon]) => <Metric key={key} label={label} value={Number(stats?.[key] || 0)} icon={Icon} />)}</section>
    <section className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
      <div className="intelligence-card p-5"><SectionTitle title="Tren aktivitas 7 hari" description="Seluruh interaksi pengguna yang tercatat per hari." action={<button onClick={() => onView('trends')} className="text-[11px] font-bold text-blue-700">Detail tren</button>} /><TrendChart data={stats?.activityTrendsByDay || []} /></div>
      <div className="intelligence-card p-5"><SectionTitle title="Komposisi aktivitas" description="Distribusi berdasarkan fitur TAKONO." /><ActivityBars stats={stats} /></div>
    </section>
    <section className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
      <div className="intelligence-card overflow-hidden"><div className="p-5"><SectionTitle title="Performa destinasi" description="Perbandingan aktivitas yang tersedia saat ini." /></div><DestinationRows performance={performance} compact /><button onClick={() => onView('performance')} className="flex w-full items-center justify-between border-t border-slate-100 px-5 py-4 text-xs font-bold text-blue-700">Lihat seluruh metrik <ChevronRight size={15} /></button></div>
      <div className="intelligence-card p-5"><SectionTitle title="Insight terbaru" description="Temuan otomatis dari data aktivitas." />{!insights.length ? <Empty title="Belum ada insight" /> : <div className="mt-4 space-y-4">{insights.slice(0, 2).map(insight => <article key={insight.id} className="border-l-2 border-blue-600 pl-3"><h3 className="text-xs font-bold">{insight.title}</h3><p className="mt-1 text-[11px] leading-5 text-slate-500 line-clamp-3">{insight.finding}</p></article>)}</div>}<button onClick={() => onView('insights')} className="mt-5 text-xs font-bold text-blue-700">Buka semua insight →</button></div>
    </section>
    <Transparency />
  </>;
}

function Trends({ stats }: { stats: TourismStats | null }) {
  return <><section className="intelligence-card p-5"><SectionTitle title="Pergerakan aktivitas mingguan" description="Jumlah aktivitas TAKONO per hari, bukan jumlah pengunjung fisik." /><TrendChart data={stats?.activityTrendsByDay || []} large /></section><section className="grid gap-5 xl:grid-cols-2"><div className="intelligence-card p-5"><SectionTitle title="Aktivitas berdasarkan fitur" description="Fitur yang paling banyak digunakan." /><ActivityBars stats={stats} /></div><div className="intelligence-card p-5"><SectionTitle title="Jam aktivitas" description="Waktu pencatatan aktivitas pengguna TAKONO." /><HourlyBars data={stats?.hourlyActivityPeak || []} /></div></section><Transparency /></>;
}

function Performance({ performance }: { performance: { destination: Destination; stats: TourismStats }[] }) {
  return <><section className="intelligence-card overflow-hidden"><div className="p-5"><SectionTitle title="Performa per destinasi" description="Metrik berasal dari scan, kuis, event, reward, dan kunjungan usaha lokal." /></div><DestinationRows performance={performance} /></section><Transparency /></>;
}

function Insights({ insights }: { insights: any[] }) {
  if (!insights.length) return <section className="intelligence-card"><Empty title="Belum ada insight" description="Insight akan muncul setelah aktivitas pengguna tercatat." /></section>;
  return <><section className="grid gap-4 xl:grid-cols-2">{insights.map((insight, index) => <article className="intelligence-card p-5" key={insight.id}><div className="flex items-start justify-between gap-4"><span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600"><Lightbulb size={18} /></span><span className="text-[10px] font-bold text-slate-300">0{index + 1}</span></div><h2 className="mt-4 text-sm font-bold">{insight.title}</h2><p className="mt-2 text-xs leading-5 text-slate-600">{insight.finding}</p><div className="mt-4 rounded-lg bg-sky-50 p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Rekomendasi</p><p className="mt-1 text-xs leading-5 text-blue-950">{insight.recommendation}</p></div></article>)}</section><Transparency /></>;
}

function Reports({ stats, performance, onDownload }: { stats: TourismStats | null; performance: { destination: Destination; stats: TourismStats }[]; onDownload: () => void }) {
  return <><section className="intelligence-card p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div className="max-w-2xl"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600"><FileBarChart size={21} /></span><h2 className="mt-4 text-base font-bold">Laporan aktivitas TAKONO</h2><p className="mt-2 text-xs leading-5 text-slate-600">Unduh snapshot JSON berisi ringkasan aktivitas platform dan performa setiap destinasi. Laporan tidak memuat identitas traveler.</p></div><button onClick={onDownload} className="primary-button shrink-0"><Download size={16} /> Unduh JSON</button></div><div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-3">{[['Aktivitas', stats?.totalPlatformActivities || 0], ['Destinasi', performance.length], ['Sumber data', 'TAKONO']].map(([label, value]) => <div className="bg-white p-4" key={label}><p className="text-[10px] text-slate-500">{label}</p><p className="mt-1 text-lg font-bold">{value}</p></div>)}</div></section><Transparency /></>;
}

function Metric({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) { return <div className="intelligence-card p-4"><div className="flex items-center justify-between"><span className="text-[11px] text-slate-500">{label}</span><span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600"><Icon size={16} /></span></div><p className="mt-3 text-2xl font-bold tracking-tight">{value.toLocaleString('id-ID')}</p><p className="mt-1 text-[10px] text-emerald-600">Aktivitas tercatat</p></div>; }
function SectionTitle({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) { return <div className="flex items-start justify-between gap-4"><div><h2 className="text-sm font-bold">{title}</h2>{description && <p className="mt-1 text-[11px] text-slate-500">{description}</p>}</div>{action}</div>; }

function TrendChart({ data, large = false }: { data: { date: string; count: number }[]; large?: boolean }) {
  const max = Math.max(1, ...data.map(item => item.count));
  return <div className={`mt-6 flex items-end gap-2 border-b border-slate-200 px-1 ${large ? 'h-64' : 'h-44'}`}>{data.map(item => <div key={item.date} className="flex h-full min-w-0 flex-1 flex-col justify-end"><div className="group relative flex flex-1 items-end justify-center"><span className="absolute -top-1 text-[10px] font-bold text-slate-500">{item.count}</span><span className="w-full max-w-12 rounded-t-md bg-blue-600 transition hover:bg-blue-700" style={{ height: `${Math.max(4, (item.count / max) * 88)}%` }} /></div><span className="py-2 text-center text-[9px] text-slate-400">{new Date(item.date + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'short' })}</span></div>)}</div>;
}
function ActivityBars({ stats }: { stats: TourismStats | null }) {
  const items = metricConfig.slice(1).map(([label, key]) => ({ label, value: Number(stats?.[key] || 0) })); const max = Math.max(1, ...items.map(item => item.value));
  return <div className="mt-5 space-y-4">{items.map(item => <div key={item.label} className="grid grid-cols-[120px_1fr_28px] items-center gap-3 text-[10px]"><span className="truncate text-slate-600">{item.label}</span><span className="h-2 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-blue-600" style={{ width: `${(item.value / max) * 100}%` }} /></span><strong className="text-right">{item.value}</strong></div>)}</div>;
}
function HourlyBars({ data }: { data: { hour: string; count: number }[] }) {
  const max = Math.max(1, ...data.map(item => item.count));
  if (!data.length) return <Empty title="Belum ada data jam aktivitas" />;
  return <div className="mt-6 flex h-44 items-end gap-1 border-b border-slate-200">{data.map(item => <div className="flex min-w-0 flex-1 flex-col items-center justify-end" key={item.hour}><span className="w-full max-w-5 rounded-t bg-teal-500" style={{ height: `${Math.max(4, (item.count / max) * 130)}px` }} /><span className="py-2 text-[8px] text-slate-400">{item.hour}</span></div>)}</div>;
}
function DestinationRows({ performance, compact = false }: { performance: { destination: Destination; stats: TourismStats }[]; compact?: boolean }) {
  if (!performance.length) return <Empty title="Belum ada data destinasi" />;
  return <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-xs"><thead className="border-y border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3 font-semibold">Destinasi</th>{['Explore', 'Kuis', 'Event', 'Reward', 'Usaha lokal'].map(label => <th className="px-4 py-3 font-semibold" key={label}>{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{performance.slice(0, compact ? 4 : undefined).map(({ destination, stats }) => <tr key={destination.id}><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600"><Building2 size={17} /></span><span><strong className="block text-slate-900">{destination.name}</strong><span className="text-[10px] text-slate-400">{destination.city}</span></span></div></td>{[stats.totalExplorePointsDiscovered, stats.totalQuizzesCompleted, stats.totalEventParticipations, stats.totalRewardRedemptions, stats.totalLocalDiscoveryVisits].map((value, index) => <td className="px-4 py-4 font-semibold text-slate-600" key={index}>{value || 0}</td>)}</tr>)}</tbody></table></div>;
}
function Transparency() { return <section className="intelligence-card flex items-start gap-3 p-4"><ShieldCheck size={19} className="shrink-0 text-emerald-600" /><div><h2 className="text-xs font-bold">Transparansi data</h2><p className="mt-1 max-w-4xl text-[11px] leading-5 text-slate-500">Data hanya berasal dari aktivitas di TAKONO: scan Explore Point, kuis, event, reward, dan Local Discovery. Angka bukan jumlah seluruh pengunjung destinasi dan tidak menampilkan identitas traveler.</p></div></section>; }

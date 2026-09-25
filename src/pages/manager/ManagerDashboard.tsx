import React, { useEffect, useState } from 'react';
import { BarChart3, CalendarDays, ChevronRight, Compass, Gift, LayoutDashboard, MapPinned, Plus, Store, UsersRound } from 'lucide-react';
import { ApiClient } from '../../lib/api';
import { ContentEditor } from '../../components/ContentEditor';
import { useAuth } from '../../context/AuthContext';
import { QRCode } from '../../components/QRCode';
import { Empty, Notice } from '../../components/Workspace';
import { statusLabels } from '../../lib/content';

const sections = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'destination', label: 'Kelola Destinasi', icon: MapPinned },
  { key: 'explore-points', label: 'Explore Points', icon: Compass },
  { key: 'events', label: 'Event', icon: CalendarDays },
  { key: 'rewards', label: 'Reward', icon: Gift },
  { key: 'local-discoveries', label: 'Local Discovery', icon: Store }
];
const labels: Record<string, string> = { destination: 'Profil destinasi', 'explore-points': 'Explore Points', events: 'Event', rewards: 'Reward', 'local-discoveries': 'Local Discovery' };
const metrics = [
  ['QR dipindai', 'totalExplorePointsDiscovered', Compass],
  ['Kuis selesai', 'totalQuizzesCompleted', BarChart3],
  ['Event diikuti', 'totalEventParticipations', CalendarDays],
  ['Reward ditukar', 'totalRewardRedemptions', Gift],
  ['Usaha dikunjungi', 'totalLocalDiscoveryVisits', Store]
] as const;

export function ManagerDashboard({ onNavigate: _onNavigate }: { onNavigate: (p: string) => void }) {
  const { user } = useAuth();
  const [kind, setKind] = useState('overview');
  const [data, setData] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editor, setEditor] = useState<any>(undefined);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [selected, setSelected] = useState(user?.destinationId || '');
  const suffix = user?.role === 'super_admin' ? '?destinationId=' + encodeURIComponent(selected) : '';
  const resource = kind === 'overview' ? 'destination' : kind;

  const load = async () => {
    if (user?.role === 'super_admin' && !selected) { setLoading(false); return; }
    setLoading(true); setError('');
    const [dashboardResult, contentResult] = await Promise.all([
      ApiClient.request<any>('/manager/dashboard' + suffix),
      ApiClient.request<any>('/manager/' + resource + suffix)
    ]);
    if (dashboardResult.success) setDashboard(dashboardResult.data);
    if (contentResult.success) {
      setData(resource === 'destination' ? [contentResult.data] : contentResult.data || []);
    } else { setError(contentResult.message || 'Gagal memuat.'); setData([]); }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.role === 'super_admin') ApiClient.request<any>('/admin/dashboard').then(result => {
      setDestinations(result.data?.destinations || []);
      if (!selected) setSelected(result.data?.destinations?.[0]?.id || '');
    });
  }, []);
  useEffect(() => { void load(); }, [kind, selected]);

  const openNew = () => setEditor({ latitude: dashboard?.destination?.latitude || 0, longitude: dashboard?.destination?.longitude || 0, estimatedDuration: '15 menit', pointsReward: 0 });
  const selectSection = (value: string) => { setKind(value); setMessage(''); setError(''); };

  return <main className="manager-shell mx-auto flex w-full max-w-[1440px] flex-col lg:min-h-[calc(100vh-4rem)] lg:flex-row">
    <aside className="border-b border-slate-200 bg-white lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="hidden px-5 pb-3 pt-6 lg:block"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Portal Pengelola</p><h2 className="mt-2 text-sm font-bold text-slate-900 line-clamp-2">{dashboard?.destination?.name || 'Destinasi TAKONO'}</h2></div>
      <nav aria-label="Menu pengelola" className="flex gap-1 overflow-x-auto p-3 lg:block lg:space-y-1 lg:px-3">
        {sections.map(({ key, label, icon: Icon }) => <button key={key} onClick={() => selectSection(key)} className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition lg:w-full ${kind === key ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}><Icon size={17} /><span>{label}</span></button>)}
      </nav>
      <div className="hidden border-t border-slate-100 px-5 py-5 lg:block"><p className="text-[10px] text-slate-400">Masuk sebagai</p><p className="mt-1 truncate text-xs font-semibold text-slate-700">{user?.name}</p></div>
    </aside>

    <div className="min-w-0 flex-1 bg-[#f5f7fb]">
      <header className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-blue-600">{kind === 'overview' ? 'Dashboard pengelola' : 'Manajemen konten'}</p><h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950">{kind === 'overview' ? 'Selamat datang kembali' : labels[kind]}</h1><p className="mt-1 text-xs text-slate-500">{dashboard?.destination?.name || 'Kelola pengalaman destinasi dari satu tempat.'}</p></div>
          {user?.role === 'super_admin' && <select aria-label="Destinasi" className="field max-w-xs" value={selected} onChange={event => setSelected(event.target.value)}><option value="">Pilih destinasi</option>{destinations.map(destination => <option key={destination.id} value={destination.id}>{destination.name}</option>)}</select>}
          {kind !== 'overview' && kind !== 'destination' && <button disabled={loading || !dashboard?.destination} onClick={openNew} className="primary-button !py-2.5"><Plus size={16} /> Tambah konten</button>}
        </div>
      </header>

      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        {message && <Notice>{message}</Notice>}{error && <Notice error>{error} {error.includes('belum ditugaskan') && user?.role !== 'super_admin' ? <span>Hubungi Admin untuk memilih destinasi akun ini.</span> : <button className="underline" onClick={load}>Coba lagi</button>}</Notice>}

        {kind === 'overview' ? <Overview dashboard={dashboard} loading={loading} onOpen={selectSection} /> :
          <ContentList kind={kind} data={data} dashboard={dashboard} loading={loading} busy={busy} suffix={suffix} setBusy={setBusy} setEditor={setEditor} setMessage={setMessage} setError={setError} reload={load} />}
      </div>
    </div>

    {editor !== undefined && <ContentEditor key={kind + (editor.id || 'new')} kind={kind} record={editor} onClose={() => setEditor(undefined)} onSave={async payload => {
      const endpoint = '/manager/' + kind + (kind !== 'destination' && editor.id ? '/' + editor.id : '') + suffix;
      const result = await ApiClient.request(endpoint, { method: kind === 'destination' || editor.id ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      if (result.success) { setEditor(undefined); setMessage('Perubahan tersimpan.'); await load(); }
      return result;
    }} />}
  </main>;
}

function Overview({ dashboard, loading, onOpen }: { dashboard: any; loading: boolean; onOpen: (key: string) => void }) {
  const values = metrics.map(([, key]) => Number(dashboard?.stats?.[key] || 0));
  const max = Math.max(1, ...values);
  if (loading) return <p className="text-sm text-slate-500">Memuat dashboard…</p>;
  return <>
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">
      {metrics.map(([label, key, Icon], index) => <div className="manager-card p-4" key={key}><div className="flex items-center justify-between"><span className="text-[11px] text-slate-500">{label}</span><Icon size={16} className="text-blue-600" /></div><p className="mt-3 text-2xl font-bold tracking-tight">{values[index]}</p></div>)}
    </section>
    <section className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
      <div className="manager-card p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-bold">Aktivitas pengguna</h2><p className="mt-1 text-[11px] text-slate-500">Berdasarkan aktivitas yang tercatat di TAKONO.</p></div><UsersRound size={18} className="text-slate-400" /></div><div className="mt-6 space-y-4">{metrics.map(([label], index) => <div key={label} className="grid grid-cols-[110px_1fr_28px] items-center gap-3 text-[11px]"><span className="truncate text-slate-600">{label}</span><span className="h-2 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-blue-600" style={{ width: `${(values[index] / max) * 100}%` }} /></span><strong className="text-right">{values[index]}</strong></div>)}</div></div>
      <div className="manager-card overflow-hidden"><div className="border-b border-slate-100 p-5"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Destinasi aktif</p><h2 className="mt-1 font-bold">{dashboard?.destination?.name}</h2><p className="mt-2 text-xs leading-5 text-slate-500 line-clamp-3">{dashboard?.destination?.description}</p></div><button onClick={() => onOpen('destination')} className="flex w-full items-center justify-between p-4 text-xs font-bold text-blue-700">Kelola profil destinasi <ChevronRight size={15} /></button></div>
    </section>
    <section className="manager-card p-5"><h2 className="text-sm font-bold">Akses cepat</h2><div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">{sections.slice(2).map(({ key, label, icon: Icon }) => <button key={key} onClick={() => onOpen(key)} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left text-xs font-semibold hover:border-blue-300 hover:bg-blue-50"><span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-50 text-blue-600"><Icon size={17} /></span>{label}<ChevronRight size={14} className="ml-auto text-slate-400" /></button>)}</div></section>
  </>;
}

function ContentList({ kind, data, dashboard, loading, busy, suffix, setBusy, setEditor, setMessage, setError, reload }: any) {
  return <section className="manager-card overflow-hidden"><div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5"><div><h2 className="text-sm font-bold">{labels[kind]}</h2><p className="mt-1 text-[11px] text-slate-500">{data.length} konten tercatat</p></div>{kind !== 'destination' && <button onClick={() => setEditor({ latitude: dashboard?.destination?.latitude || 0, longitude: dashboard?.destination?.longitude || 0, estimatedDuration: '15 menit', pointsReward: 0 })} className="secondary-button !px-3 !py-2"><Plus size={15} /> Tambah</button>}</div>
    {loading ? <p className="p-5 text-sm text-slate-500">Memuat konten…</p> : !data.length ? <Empty title="Belum ada konten" description="Gunakan tombol Tambah untuk membuat konten pertama." /> : <div className="divide-y divide-slate-100">{data.map((item: any) => <article key={item.id} className="p-4 sm:p-5"><div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-bold">{item.name || item.title}</h3><span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${['published', 'active'].includes(item.status) ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{statusLabels[item.status] || item.status}</span></div><p className="mt-2 max-w-3xl text-xs leading-5 text-slate-500 line-clamp-2">{item.description}</p>{kind === 'rewards' && <p className="mt-2 text-[11px] text-slate-400">{item.claimedCount} / {item.quota} ditukar</p>}</div><div className="flex shrink-0 gap-2"><button onClick={() => setEditor(item)} className="secondary-button !px-3 !py-2">Edit</button>{kind !== 'destination' && <button disabled={busy} className="px-3 py-2 text-xs font-semibold text-rose-700" onClick={async () => { if (!confirm('Hapus konten ini? Riwayat aktivitas tetap tersimpan.')) return; setBusy(true); const result = await ApiClient.request('/manager/' + kind + '/' + item.id + suffix, { method: 'DELETE' }); setBusy(false); if (result.success) { setMessage('Konten dihapus.'); reload(); } else setError(result.message || 'Gagal menghapus.'); }}>Hapus</button>}</div></div>
      {kind === 'destination' && <div className="mt-5 border-t border-slate-100 pt-5"><QRCode value={location.origin + location.pathname + '#/scan/' + item.code} label={item.name} /></div>}
      {kind === 'explore-points' && <details className="mt-4 rounded-xl bg-slate-50 p-3 text-xs"><summary className="cursor-pointer font-semibold text-blue-700">Lihat QR dan mini quiz</summary><div className="mt-3 space-y-2"><QRCode value={location.origin + location.pathname + '#/app/scan/' + item.secureToken} label={item.name} /><p className="text-slate-500">Kuis: {item.quiz?.title || 'Belum dibuat'}</p></div></details>}
      {kind === 'events' && item.qrToken && <details className="mt-4 rounded-xl bg-slate-50 p-3 text-xs"><summary className="cursor-pointer font-semibold text-blue-700">Lihat QR partisipasi event</summary><div className="mt-3"><QRCode value={location.origin + location.pathname + '#/app/scan/event/' + item.qrToken} label={item.title} /><p className="mt-2 text-slate-500">Pasang QR di lokasi event. Partisipasi hanya tercatat satu kali per akun.</p></div></details>}
    </article>)}</div>}
  </section>;
}

import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../lib/api.js';
import { RewardRedemption, UserDestinationJourney } from '../../types/index.js';
import { ArrowLeft, BookMarked, CalendarDays, CheckCircle2, ChevronRight, Circle, Compass, MapPin, Trophy } from 'lucide-react';

type AlbumData = {
  progress: any;
  activeJourney: any;
  journeys: UserDestinationJourney[];
  redemptions: RewardRedemption[];
  totalPointsEarned: number;
};

export const AlbumJelajahPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [album, setAlbum] = useState<AlbumData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJourney, setSelectedJourney] = useState<UserDestinationJourney | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    ApiClient.getMyAlbum(false).then(result => {
      if (result.success && result.data) setAlbum(result.data);
      else setError(result.message || 'Album tidak dapat dimuat.');
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="py-20 text-center text-sm text-slate-500">Membuka Album Jelajah…</div>;
  if (error) return <div className="py-16 text-center"><p role="alert" className="text-sm text-rose-700">{error}</p><button className="mt-4 text-sm font-medium text-blue-700" onClick={() => onNavigate('/app')}>Kembali ke perjalanan</button></div>;

  const journeys = album?.journeys || [];
  const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  const openJourney = async (journey: UserDestinationJourney) => {
    setSelectedJourney(journey); setDetail(null); setDetailLoading(true);
    const result = await ApiClient.getAlbumDestination(journey.destinationId);
    if (result.success) setDetail(result.data); else setError(result.message || 'Detail perjalanan tidak dapat dimuat.');
    setDetailLoading(false);
  };

  if (selectedJourney) {
    const points = detail?.explorePoints || [];
    const visited = points.filter((point: any) => point.visited);
    const notVisited = points.filter((point: any) => !point.visited);
    const activityLabels: Record<string, string> = { destination_checked_in: 'Memulai kunjungan', explore_point_discovered: 'Mengunjungi Explore Point', quiz_completed: 'Menyelesaikan kuis', event_participated: 'Mengikuti event', local_discovery_visited: 'Mengunjungi usaha lokal', reward_redeemed: 'Menukar reward', destination_completed: 'Mengakhiri perjalanan' };
    return <div className="mx-auto max-w-5xl space-y-6 pb-12"><button onClick={() => { setSelectedJourney(null); setDetail(null); }} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700"><ArrowLeft size={17} />Kembali ke Album</button><header className="overflow-hidden rounded-2xl border border-slate-200 bg-white sm:flex"><img src={selectedJourney.destination.heroImage} alt="" className="h-44 w-full object-cover sm:h-auto sm:w-72" /><div className="p-6"><p className="text-xs font-semibold tracking-wide text-emerald-700">PERJALANAN TERSIMPAN</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{selectedJourney.destination.name}</h1><p className="mt-2 flex items-center gap-1 text-sm text-slate-500"><MapPin size={15} />{selectedJourney.destination.city}, {selectedJourney.destination.province}</p><p className="mt-5 text-sm text-slate-500">Disimpan {formatDate(selectedJourney.completedAt)}</p></div></header>{detailLoading ? <p className="py-12 text-center text-sm text-slate-500">Membuka detail perjalanan…</p> : <><section className="grid gap-3 sm:grid-cols-4"><div className="rounded-xl border border-slate-200 bg-white p-4"><strong className="text-2xl text-slate-950">{detail?.summary?.explorePointsVisited ?? visited.length}</strong><span className="mt-1 block text-xs text-slate-500">Titik dikunjungi</span></div><div className="rounded-xl border border-slate-200 bg-white p-4"><strong className="text-2xl text-slate-950">{detail?.summary?.quizzesCompleted ?? 0}</strong><span className="mt-1 block text-xs text-slate-500">Kuis selesai</span></div><div className="rounded-xl border border-slate-200 bg-white p-4"><strong className="text-2xl text-slate-950">{detail?.summary?.localDiscoveriesVisited ?? 0}</strong><span className="mt-1 block text-xs text-slate-500">Usaha lokal</span></div><div className="rounded-xl border border-slate-200 bg-white p-4"><strong className="text-2xl text-slate-950">{detail?.summary?.pointsEarned ?? 0}</strong><span className="mt-1 block text-xs text-slate-500">Poin didapat</span></div></section><section className="grid gap-5 lg:grid-cols-2"><div className="rounded-xl border border-slate-200 bg-white"><div className="border-b border-slate-100 p-5"><h2 className="font-semibold text-slate-950">Explore Point yang dikunjungi</h2><p className="mt-1 text-sm text-slate-500">{visited.length} dari {points.length} titik pada kunjungan ini.</p></div>{visited.length ? <div className="divide-y divide-slate-100">{visited.map((point: any) => <div key={point.id} className="flex items-center gap-3 p-4"><CheckCircle2 size={19} className="shrink-0 text-emerald-600" /><div className="min-w-0"><strong className="block text-sm text-slate-900">{point.name}</strong><span className="mt-1 block text-xs text-slate-500">{point.category}</span></div></div>)}</div> : <p className="p-5 text-sm text-slate-500">Belum ada Explore Point yang dipindai.</p>}</div><div className="rounded-xl border border-slate-200 bg-white"><div className="border-b border-slate-100 p-5"><h2 className="font-semibold text-slate-950">Titik yang belum dikunjungi</h2><p className="mt-1 text-sm text-slate-500">Tetap tersimpan sebagai catatan rute berikutnya.</p></div>{notVisited.length ? <div className="divide-y divide-slate-100">{notVisited.map((point: any) => <div key={point.id} className="flex items-center gap-3 p-4"><Circle size={19} className="shrink-0 text-slate-300" /><div className="min-w-0"><strong className="block text-sm text-slate-700">{point.name}</strong><span className="mt-1 block text-xs text-slate-500">{point.category}</span></div></div>)}</div> : <p className="p-5 text-sm text-slate-500">Semua titik pada rute ini sudah dikunjungi.</p>}</div></section><section className="rounded-xl border border-slate-200 bg-white"><div className="border-b border-slate-100 p-5"><h2 className="font-semibold text-slate-950">Aktivitas di destinasi</h2></div>{detail?.activities?.length ? <div className="divide-y divide-slate-100">{detail.activities.map((activity: any) => <div key={activity.id} className="flex items-start justify-between gap-4 p-4"><div><p className="text-sm font-medium text-slate-900">{activity.title || activityLabels[activity.type] || 'Aktivitas TAKONO'}</p><p className="mt-1 text-xs text-slate-500">{activityLabels[activity.type] || activity.type} · {formatDate(activity.createdAt)}</p></div>{activity.pointsEarned > 0 && <strong className="text-sm text-emerald-700">+{activity.pointsEarned} poin</strong>}</div>)}</div> : <p className="p-5 text-sm text-slate-500">Belum ada aktivitas yang tercatat.</p>}</section></>}</div>;
  }

  return <div className="mx-auto w-full max-w-7xl space-y-8 pb-16">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Jejak perjalanan</p><h1 className="mt-2 flex items-center gap-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"><BookMarked size={26} className="text-blue-700" />Album Jelajah</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Destinasi yang perjalanannya sudah kamu akhiri tersimpan di sini. Progres Explore Point tetap tercatat apa adanya.</p></div>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm"><Trophy size={20} className="text-blue-600" /><div><strong className="block text-slate-900">{journeys.length} destinasi</strong><span className="text-xs text-slate-500">tersimpan di album</span></div></div>
    </header>

    {album?.activeJourney && <section className="flex flex-col gap-4 rounded-[2rem] border border-blue-100 bg-blue-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Perjalanan sedang berlangsung</p><h2 className="mt-2 text-lg font-semibold text-slate-950">Ada kunjungan yang belum kamu akhiri</h2><p className="mt-1 text-sm text-slate-600">Kamu boleh mengakhirinya kapan saja; progres titik yang sudah dikunjungi tetap tercatat.</p></div><button onClick={() => onNavigate('/app')} className="primary-button shrink-0 !py-2.5">Ruang personal</button></section>}

    {!journeys.length ? <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><Compass size={30} className="mx-auto text-blue-600" /><h2 className="mt-4 text-lg font-semibold text-slate-900">Album masih menunggu cerita pertamamu</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Pindai QR pintu masuk saat tiba di destinasi, lalu akhiri kunjungan kapan pun kamu siap untuk menyimpannya di sini.</p><button onClick={() => onNavigate('/app')} className="primary-button mt-5 !py-2.5">Scan QR Destinasi</button></section> : <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {journeys.map(journey => <article key={journey.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"><img src={journey.destination.heroImage} alt="" className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" /><div className="p-5"><div className="flex items-center justify-between gap-3"><span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"><CheckCircle2 size={14} />Perjalanan ditutup</span><span className="text-xs text-slate-500">{journey.explorePointsCompleted ?? 0}/{journey.explorePointsTotal ?? 0} titik</span></div><h2 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">{journey.destination.name}</h2><p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><MapPin size={13} />{journey.destination.city}, {journey.destination.province}</p><p className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500"><CalendarDays size={14} />Disimpan {formatDate(journey.completedAt)}</p><button onClick={() => void openJourney(journey)} className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800">Lihat detail perjalanan <ChevronRight size={16} /></button></div></article>)}
    </section>}

    {!!album?.redemptions?.length && <section className="border-t border-slate-200 pt-6"><h2 className="text-sm font-semibold text-slate-900">Reward yang ditukar</h2><div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">{album.redemptions.map(redemption => <div key={redemption.id} className="flex items-center justify-between gap-4 p-4 text-sm"><div className="min-w-0"><strong className="block truncate">{redemption.rewardTitle || redemption.rewardName}</strong><span className="mt-1 block text-xs text-slate-500">{redemption.partner}</span></div><span className="shrink-0 text-xs text-slate-500">{redemption.status === 'active' ? 'Siap dipakai' : redemption.status}</span></div>)}</div></section>}
  </div>;
};

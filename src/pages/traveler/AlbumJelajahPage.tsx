import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../lib/api.js';
import { RewardRedemption, UserDestinationJourney } from '../../types/index.js';
import { BookMarked, CalendarDays, CheckCircle2, ChevronRight, Compass, MapPin, Trophy } from 'lucide-react';

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

  return <div className="mx-auto max-w-5xl space-y-6 pb-12">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-xs font-semibold tracking-wide text-blue-700">JEJAK PERJALANAN</p><h1 className="mt-2 flex items-center gap-2 text-2xl font-semibold tracking-tight text-slate-950"><BookMarked size={23} className="text-blue-700" />Album Jelajah</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Destinasi yang perjalanannya sudah kamu akhiri tersimpan di sini. Progres Explore Point tetap tercatat apa adanya.</p></div>
      <div className="flex items-center gap-3 border-l border-slate-200 pl-4 text-sm"><Trophy size={20} className="text-amber-500" /><div><strong className="block text-slate-900">{journeys.length} destinasi</strong><span className="text-xs text-slate-500">tersimpan di album</span></div></div>
    </header>

    {album?.activeJourney && <section className="flex flex-col gap-4 rounded-xl border border-blue-100 bg-blue-50/50 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold text-blue-700">PERJALANAN SEDANG BERLANGSUNG</p><h2 className="mt-1 font-semibold text-slate-950">Ada kunjungan yang belum kamu akhiri</h2><p className="mt-1 text-sm text-slate-600">Kamu boleh mengakhirinya kapan saja; progres titik yang sudah dikunjungi tetap tercatat.</p></div><button onClick={() => onNavigate('/app')} className="primary-button shrink-0 !py-2.5">Ruang personal</button></section>}

    {!journeys.length ? <section className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><Compass size={28} className="mx-auto text-blue-600" /><h2 className="mt-4 font-semibold text-slate-900">Album masih menunggu cerita pertamamu</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Pindai QR pintu masuk saat tiba di destinasi, lalu akhiri kunjungan kapan pun kamu siap untuk menyimpannya di sini.</p><button onClick={() => onNavigate('/app')} className="primary-button mt-5 !py-2.5">Scan QR Destinasi</button></section> : <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {journeys.map(journey => <article key={journey.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white"><img src={journey.destination.heroImage} alt="" className="h-36 w-full object-cover" /><div className="p-5"><div className="flex items-center justify-between gap-3"><span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700"><CheckCircle2 size={14} />Perjalanan ditutup</span><span className="text-xs text-slate-500">{journey.explorePointsCompleted ?? 0}/{journey.explorePointsTotal ?? 0} titik</span></div><h2 className="mt-3 text-base font-semibold text-slate-950">{journey.destination.name}</h2><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin size={13} />{journey.destination.city}, {journey.destination.province}</p><p className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500"><CalendarDays size={14} />Disimpan {formatDate(journey.completedAt)}</p><button onClick={() => onNavigate(`/destinations/${journey.destination.slug}`)} className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-700">Lihat info destinasi <ChevronRight size={16} /></button></div></article>)}
    </section>}

    {!!album?.redemptions?.length && <section className="border-t border-slate-200 pt-6"><h2 className="text-sm font-semibold text-slate-900">Reward yang ditukar</h2><div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">{album.redemptions.map(redemption => <div key={redemption.id} className="flex items-center justify-between gap-4 p-4 text-sm"><div className="min-w-0"><strong className="block truncate">{redemption.rewardTitle || redemption.rewardName}</strong><span className="mt-1 block text-xs text-slate-500">{redemption.partner}</span></div><span className="shrink-0 text-xs text-slate-500">{redemption.status === 'active' ? 'Siap dipakai' : redemption.status}</span></div>)}</div></section>}
  </div>;
};

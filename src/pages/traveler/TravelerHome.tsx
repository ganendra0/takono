import React, { useEffect, useState } from 'react';
import { CalendarDays, Compass, Gift, Map, MapPin, QrCode, Store, ArrowRight } from 'lucide-react';
import { ApiClient } from '../../lib/api';
import { Destination, DestinationEvent, ExplorePoint, LocalDiscovery, Reward } from '../../types';
import { useAuth } from '../../context/AuthContext';

export function TravelerHome({ onNavigate, onOpenScanModal }: { onNavigate: (path: string) => void; onOpenScanModal: () => void }) {
  const { user, pointsBalance } = useAuth();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [next, setNext] = useState<ExplorePoint | null>(null);
  const [progress, setProgress] = useState<any>();
  const [events, setEvents] = useState<DestinationEvent[]>([]);
  const [local, setLocal] = useState<LocalDiscovery[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [destinationResult, guideResult, eventResult, rewardResult] = await Promise.all([
        ApiClient.getDestinationBySlug(), ApiClient.getSmartGuideRecommendations(), ApiClient.getEvents(), ApiClient.getRewards()
      ]);
      if (destinationResult.success && destinationResult.data) {
        setDestination(destinationResult.data.destination);
        setLocal(destinationResult.data.localDiscoveries || []);
      } else setError(destinationResult.message || 'Destinasi tidak dapat dimuat.');
      if (guideResult.success && guideResult.data) {
        setNext(guideResult.data.nextRecommendation.point);
        setProgress(guideResult.data.progress);
      }
      if (eventResult.success) setEvents(eventResult.data || []);
      if (rewardResult.success) setRewards(rewardResult.data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="py-16 text-center text-sm text-slate-500">Menyiapkan perjalanan…</div>;
  if (error) return <div className="py-12"><p role="alert" className="text-sm text-rose-700">{error}</p><button className="mt-4 text-blue-700" onClick={() => onNavigate('/destinations')}>Pilih destinasi</button></div>;

  const completed = progress?.completedExplorePoints || 0;
  const total = progress?.totalExplorePoints || 0;
  const menu = [
    { label: 'Peta', icon: Map, path: '/app/smart-guide' },
    { label: 'Explore Point', icon: Compass, path: '/app/smart-guide' },
    { label: 'Event', icon: CalendarDays, path: '/app/events' },
    { label: 'Kuliner', icon: Store, path: '/app/local-discovery' }
  ];

  return <div className="traveler-home space-y-6 pb-5">
    <section className="home-hero relative overflow-hidden min-h-[300px] rounded-2xl">
      <img src={destination?.heroImage} alt={destination?.name} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent" />
      <div className="relative min-h-[300px] lg:min-h-[390px] p-6 lg:p-10 flex flex-col justify-end text-white">
        <span className="w-fit rounded-md bg-white/90 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-700">Destinasi aktif</span>
        <h1 className="mt-3 text-3xl lg:text-4xl font-semibold tracking-tight">{destination?.name}</h1>
        <p className="mt-1 flex items-center gap-1 text-xs text-white/85"><MapPin size={13} /> {destination?.city}, {destination?.province}</p>
      </div>
    </section>

    <section className="home-intro traveler-card p-5 lg:p-7">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hai, {user?.name.split(' ')[0]}</p><p className="mt-1 text-sm font-semibold text-slate-900">Siap menjelajah hari ini?</p></div>
        <button onClick={() => onNavigate('/app/profile')} className="text-right"><strong className="block text-lg text-blue-700">{pointsBalance}</strong><span className="text-[10px] text-slate-500">Jejak Points</span></button>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600 line-clamp-3">{destination?.description}</p>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {menu.map(({ label, icon: Icon, path }) => <button key={label} onClick={() => onNavigate(path)} className="group flex min-w-0 flex-col items-center gap-2 text-center">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-sky-50 text-blue-600 transition group-active:scale-95"><Icon size={19} /></span>
          <span className="text-xs font-medium leading-4 text-slate-600">{label}</span>
        </button>)}
      </div>
      <button onClick={() => onNavigate('/app/smart-guide')} className="primary-button mt-4 w-full !py-2.5"><Compass size={16} /> Mulai jelajah</button>
    </section>

    <section className="home-progress traveler-card overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Lanjutkan perjalanan</p><h2 className="mt-1 font-bold">{next?.name || 'Perjalanan selesai'}</h2></div><span className="text-xs font-bold text-blue-700">{completed}/{total}</span></div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-500" style={{ width: `${total ? (completed / total) * 100 : 0}%` }} /></div>
        <p className="mt-3 text-xs leading-5 text-slate-500 line-clamp-2">{next?.description || 'Semua titik sudah dikunjungi. Lihat kembali koleksimu di Album.'}</p>
      </div>
      <div className="grid grid-cols-2 border-t border-slate-100">
        <button onClick={() => onNavigate('/app/smart-guide')} className="py-3 text-xs font-bold text-blue-700">Lihat rute</button>
        <button onClick={onOpenScanModal} className="flex items-center justify-center gap-1 border-l border-slate-100 py-3 text-xs font-bold text-blue-700"><QrCode size={14} /> Scan QR</button>
      </div>
    </section>

    <section>
      <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">Agenda berikutnya</h2><button onClick={() => onNavigate('/app/events')} className="text-sm font-medium text-blue-700">Lihat semua</button></div>
      <div className="traveler-card divide-y divide-slate-100">
        {events.length ? events.slice(0, 2).map(event => <button key={event.id} onClick={() => onNavigate('/app/events')} className="flex w-full items-center gap-3 p-3 text-left">
          <img src={event.image} alt="" className="h-14 w-16 rounded-lg object-cover" />
          <span className="min-w-0 flex-1"><strong className="block truncate text-xs">{event.title}</strong><span className="mt-1 block text-[10px] text-slate-500">{event.startDate} · {event.time}</span></span><ArrowRight size={14} className="text-slate-400" />
        </button>) : <p className="p-4 text-xs text-slate-500">Belum ada event.</p>}
      </div>
    </section>

    <section className="grid grid-cols-2 gap-3">
      <button onClick={() => onNavigate('/app/local-discovery')} className="traveler-card p-4 text-left"><Store size={18} className="text-teal-600" /><strong className="mt-3 block text-lg">{local.length}</strong><span className="text-[11px] text-slate-500">Usaha lokal dekatmu</span></button>
      <button onClick={() => onNavigate('/app/rewards')} className="traveler-card p-4 text-left"><Gift size={18} className="text-blue-600" /><strong className="mt-3 block text-lg">{rewards.length}</strong><span className="text-[11px] text-slate-500">Reward tersedia</span></button>
    </section>
  </div>;
}

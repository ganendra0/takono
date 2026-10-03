import React, { useEffect, useState } from 'react';
import { CalendarDays, Compass, Gift, Map, MapPin, QrCode, Store, ArrowRight, CheckCircle2, CircleHelp, Coins } from 'lucide-react';
import { ApiClient } from '../../lib/api';
import { Destination, DestinationEvent, ExplorePoint, LocalDiscovery, Reward } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { TextToSpeechControls } from '../../components/TextToSpeechControls.js';

export function TravelerHome({ destinationSlug, onNavigate, onOpenScanModal }: { destinationSlug: string; onNavigate: (path: string) => void; onOpenScanModal: () => void }) {
  const { user, pointsBalance } = useAuth();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [next, setNext] = useState<ExplorePoint | null>(null);
  const [progress, setProgress] = useState<any>();
  const [events, setEvents] = useState<DestinationEvent[]>([]);
  const [local, setLocal] = useState<LocalDiscovery[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [hasActiveJourney, setHasActiveJourney] = useState(false);
  const [isEndingJourney, setIsEndingJourney] = useState(false);
  const [journeyError, setJourneyError] = useState('');
  const [tripSummary, setTripSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [destinationResult, guideResult, eventResult, rewardResult, albumResult] = await Promise.all([
        ApiClient.getDestinationBySlug(destinationSlug), ApiClient.getSmartGuideRecommendations(), ApiClient.getEvents(), ApiClient.getRewards(), ApiClient.getMyAlbum()
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
      if (albumResult.success) setHasActiveJourney(Boolean(albumResult.data?.activeJourney));
      setLoading(false);
    })();
  }, [destinationSlug]);

  if (loading) return <div className="py-16 text-center text-sm text-slate-500">Menyiapkan perjalanan…</div>;
  if (error) return <div className="py-12"><p role="alert" className="text-sm text-rose-700">{error}</p><button className="mt-4 text-blue-700" onClick={() => onNavigate('/destinations')}>Pilih destinasi</button></div>;

  const completed = progress?.completedExplorePoints || 0;
  const total = progress?.totalExplorePoints || 0;
  const canEndJourney = hasActiveJourney;
  const completeJourney = async () => {
    if (!destination) return;
    setIsEndingJourney(true); setJourneyError('');
    const result = await ApiClient.completeDestinationJourney(destination.id);
    setIsEndingJourney(false);
    if (result.success) {
      setHasActiveJourney(false);
      setTripSummary(result.data?.summary || { destination: destination.name, explorePointsVisited: completed, quizzesCompleted: 0, pointsEarned: 0, localDiscoveriesVisited: 0 });
    }
    else setJourneyError(result.message || 'Perjalanan belum dapat diakhiri.');
  };
  const menu = [
    { label: 'Peta', icon: Map, path: '/app/smart-guide' },
    { label: 'Explore Point', icon: Compass, path: '/app/smart-guide' },
    { label: 'Event', icon: CalendarDays, path: '/app/events' },
    { label: 'Kuliner', icon: Store, path: '/app/local-discovery' }
  ];

  return <div className="traveler-home space-y-7 pb-10">
    <section className="home-hero relative min-h-[340px] overflow-hidden rounded-[2rem] bg-slate-900 sm:min-h-[380px] lg:min-h-[420px]">
      <img src={destination?.heroImage} alt={destination?.name} className="absolute inset-0 h-full w-full object-cover" loading="eager" fetchPriority="high" decoding="async" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
      <div className="relative flex min-h-[340px] flex-col justify-end p-6 text-white sm:min-h-[380px] sm:p-9 lg:min-h-[420px] lg:p-12">
        <span className="flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/90"><span className="h-1.5 w-1.5 rounded-full bg-blue-400" />Destinasi aktif</span>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{destination?.name}</h1>
        <p className="mt-3 flex items-center gap-2 text-sm text-white/85"><MapPin size={15} />{destination?.city}, {destination?.province}</p>
      </div>
    </section>

    <div className="home-body-grid">
    <div className="home-primary-column">
    <section className="home-intro traveler-card rounded-[2rem] p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Hai, {user?.name.split(' ')[0]}</p><h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Siap menjelajah hari ini?</h2></div>
        <button onClick={() => onNavigate('/app/rewards')} className="shrink-0 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-right transition-colors hover:bg-blue-100"><strong className="block text-lg leading-5 text-blue-700">{pointsBalance}</strong><span className="text-xs text-slate-500">Jejak Points</span></button>
      </div>
      <div className="mt-5 space-y-3">
        <TextToSpeechControls text={destination?.description || ''} />
        <p className="text-sm leading-6 text-slate-600 line-clamp-4">{destination?.description}</p>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 border-y border-slate-100 py-4 sm:grid-cols-4">
        {menu.map(({ label, icon: Icon, path }) => <button key={label} onClick={() => onNavigate(path)} className="group flex min-w-0 items-center gap-2 rounded-xl px-2 py-2 text-left transition-colors hover:bg-slate-50 sm:flex-col sm:justify-center sm:gap-2 sm:text-center">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700"><Icon size={17} /></span>
          <span className="text-xs font-semibold leading-4 text-slate-700">{label}</span>
        </button>)}
      </div>
      <button onClick={() => onNavigate('/app/smart-guide')} className="primary-button mt-5 min-h-12 w-full !rounded-xl !py-3"><Compass size={17} />Mulai jelajah</button>
    </section>



        <section className="home-events min-w-0">
          <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Di sekitar destinasi</p><h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">Agenda berikutnya</h2></div><button onClick={() => onNavigate('/app/events')} className="shrink-0 text-sm font-semibold text-blue-700 hover:text-blue-800">Lihat semua</button></div>
          <div className="traveler-card divide-y divide-slate-100 overflow-hidden rounded-[2rem]">
            {events.length ? events.slice(0, 2).map(event => <button key={event.id} onClick={() => onNavigate('/app/events')} className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-slate-50 sm:p-5">
              <img src={event.image} alt="" className="h-16 w-20 shrink-0 rounded-xl object-cover" />
              <span className="min-w-0 flex-1"><strong className="block truncate text-xs">{event.title}</strong><span className="mt-1 block text-[10px] text-slate-500">{event.startDate} · {event.time}</span></span><ArrowRight size={14} className="text-slate-400" />
            </button>) : <p className="p-4 text-xs text-slate-500">Belum ada event.</p>}
          </div>
        </section>
    </div>
    <div className="home-secondary-column">


            <section className="home-progress traveler-card overflow-hidden rounded-[2rem]">
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Lanjutkan perjalanan</p><h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">{next?.name || 'Perjalanan selesai'}</h2></div><span className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold tabular-nums text-blue-700">{completed}/{total}</span></div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600 transition-[width]" style={{ width: `${total ? (completed / total) * 100 : 0}%` }} /></div>
            <p className="mt-4 text-sm leading-6 text-slate-600 line-clamp-3">{next?.description || (canEndJourney ? 'Kamu dapat mengakhiri perjalanan kapan saja. Progres titik yang sudah dikunjungi tetap tersimpan di Album Jelajah.' : 'Semua titik sudah dikunjungi. Lihat kembali koleksimu di Album.')}</p>
            {journeyError && <p role="alert" className="mt-3 text-sm text-rose-700">{journeyError}</p>}
          </div>
          <div className="grid grid-cols-2 border-t border-slate-100">
            <button onClick={() => onNavigate('/app/smart-guide')} className="min-h-12 text-sm font-semibold text-blue-700 transition-colors hover:bg-slate-50">Lihat rute</button>
            <button onClick={onOpenScanModal} className="flex min-h-12 items-center justify-center gap-2 border-l border-slate-100 text-sm font-semibold text-blue-700 transition-colors hover:bg-slate-50"><QrCode size={16} />Scan QR</button>
          </div>
          {canEndJourney && <button disabled={isEndingJourney} onClick={completeJourney} className="primary-button m-4 mt-0 w-[calc(100%-2rem)] !py-2.5">{isEndingJourney ? 'Menyimpan perjalanan…' : 'Akhiri perjalanan & simpan ke Album'}</button>}
        </section>
<section className="home-metrics grid grid-cols-1 gap-4 sm:grid-cols-2">
      <button onClick={() => onNavigate('/app/local-discovery')} className="traveler-card flex min-w-0 items-center gap-4 rounded-2xl p-5 text-left transition-colors hover:border-blue-200 hover:bg-blue-50/40"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><Store size={19} /></span><span className="min-w-0"><strong className="block text-xl font-semibold text-slate-950">{local.length}</strong><span className="mt-0.5 block text-sm leading-snug text-slate-500">Usaha lokal dekatmu</span></span></button>
      <button onClick={() => onNavigate('/app/rewards')} className="traveler-card flex min-w-0 items-center gap-4 rounded-2xl p-5 text-left transition-colors hover:border-blue-200 hover:bg-blue-50/40"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><Gift size={19} /></span><span className="min-w-0"><strong className="block text-xl font-semibold text-slate-950">{rewards.length}</strong><span className="mt-0.5 block text-sm leading-snug text-slate-500">Reward tersedia</span></span></button>
    </section>
    </div>
    </div>
    {tripSummary && <div className="fixed inset-0 z-[100] flex items-end bg-slate-950/45 p-0 sm:items-center sm:justify-center sm:p-5" role="dialog" aria-modal="true" aria-label="Ringkasan perjalanan"><section className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-2xl"><span className="grid h-11 w-11 place-items-center rounded-full bg-emerald-50 text-emerald-700"><CheckCircle2 size={23} /></span><p className="mt-4 text-xs font-semibold tracking-wide text-emerald-700">PERJALANAN TERSIMPAN</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Terima kasih sudah menjelajah.</h2><p className="mt-2 text-sm leading-6 text-slate-500">Ringkasan kunjunganmu di {destination?.name} sudah masuk ke Album Jelajah.</p><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-4"><Compass size={17} className="text-blue-600" /><strong className="mt-2 block text-xl text-slate-950">{tripSummary.explorePointsVisited || 0}</strong><span className="text-xs text-slate-500">Explore Point</span></div><div className="rounded-xl bg-slate-50 p-4"><CircleHelp size={17} className="text-blue-600" /><strong className="mt-2 block text-xl text-slate-950">{tripSummary.quizzesCompleted || 0}</strong><span className="text-xs text-slate-500">Kuis selesai</span></div><div className="rounded-xl bg-slate-50 p-4"><Coins size={17} className="text-blue-600" /><strong className="mt-2 block text-xl text-slate-950">{tripSummary.pointsEarned || 0}</strong><span className="text-xs text-slate-500">Poin didapat</span></div><div className="rounded-xl bg-slate-50 p-4"><Store size={17} className="text-blue-600" /><strong className="mt-2 block text-xl text-slate-950">{tripSummary.localDiscoveriesVisited || 0}</strong><span className="text-xs text-slate-500">Usaha lokal</span></div></div><button onClick={() => onNavigate('/app')} className="primary-button mt-6 w-full !py-3">Kembali ke ruang personal</button></section></div>}
  </div>;
}

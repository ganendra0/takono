import React, { useEffect, useState } from 'react';
import { Album, ArrowRight, Compass, MapPin, QrCode, Sparkles } from 'lucide-react';
import { ApiClient } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.js';

export const PersonalHomePage: React.FC<{ onNavigate: (path: string) => void; onOpenScanModal: () => void }> = ({ onNavigate, onOpenScanModal }) => {
  const { user, pointsBalance } = useAuth();
  const [album, setAlbum] = useState<any>(null);

  useEffect(() => { ApiClient.getMyAlbum(false).then(result => { if (result.success) setAlbum(result.data); }); }, []);
  const lastJourney = album?.journeys?.[0];

  return <div className="mx-auto max-w-5xl space-y-6 pb-10">
    <header className="pt-2">
      <p className="text-xs font-semibold tracking-wide text-blue-700">RUANG PERJALANAN</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Halo, {user?.name?.split(' ')[0] || 'Traveler'}.</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Mulai kunjungan baru dengan memindai QR di pintu masuk destinasi.</p>
    </header>

    <section className="overflow-hidden rounded-2xl bg-[#0d2a4a] p-6 text-white sm:p-8">
      <div className="max-w-xl">
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-sky-200"><Compass size={15} /> SIAP MENJELAJAH</span>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">Datang ke destinasi?<br />Mulai dari QR masuk.</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">QR pintu masuk akan membuka mode kunjungan untuk destinasi yang kamu datangi.</p>
        <button onClick={onOpenScanModal} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-blue-800 transition hover:bg-sky-50"><QrCode size={18} /> Scan QR Destinasi</button>
      </div>
    </section>

    <section className="grid gap-4 md:grid-cols-[1.4fr_.8fr]">
      <button onClick={() => onNavigate('/app/points')} className="rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-blue-200"><span className="text-xs font-semibold tracking-wide text-slate-500">JEJAK POINTS</span><div className="mt-4 flex items-end justify-between"><strong className="text-3xl tracking-tight text-slate-950">{pointsBalance}</strong><Sparkles className="text-blue-600" size={20} /></div><p className="mt-2 text-sm text-slate-500">Lihat aktivitas dan poin yang sudah terkumpul.</p></button>
      <button onClick={() => onNavigate('/app/album')} className="rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-blue-200"><span className="text-xs font-semibold tracking-wide text-slate-500">ALBUM JELAJAH</span><div className="mt-4 flex items-end justify-between"><strong className="text-3xl tracking-tight text-slate-950">{album?.journeys?.length || 0}</strong><Album className="text-blue-600" size={20} /></div><p className="mt-2 text-sm text-slate-500">Destinasi yang sudah kamu simpan.</p></button>
    </section>

    <section>
      <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-950">Kunjungan terakhir</h2><button onClick={() => onNavigate('/app/album')} className="inline-flex items-center gap-1 text-sm font-medium text-blue-700">Album <ArrowRight size={15} /></button></div>
      {lastJourney ? <article className="flex overflow-hidden rounded-xl border border-slate-200 bg-white"><img src={lastJourney.destination.heroImage} alt="" className="h-28 w-28 object-cover sm:h-32 sm:w-40" /><div className="min-w-0 p-4"><p className="text-xs font-medium text-emerald-700">Tersimpan di album</p><h3 className="mt-1 truncate font-semibold text-slate-950">{lastJourney.destination.name}</h3><p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><MapPin size={13} />{lastJourney.destination.city}</p><p className="mt-3 text-xs text-slate-500">{lastJourney.explorePointsCompleted || 0}/{lastJourney.explorePointsTotal || 0} Explore Point dikunjungi</p></div></article> : <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center"><Compass className="mx-auto text-blue-600" size={24} /><p className="mt-3 text-sm font-medium text-slate-900">Belum ada perjalanan tersimpan</p><p className="mt-1 text-sm text-slate-500">Pindai QR destinasi saat kamu tiba untuk memulai.</p></div>}
    </section>
  </div>;
};

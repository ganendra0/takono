import React from 'react';
import { ArrowRight, Compass, MapPin, QrCode, BookOpen, Store, Navigation, ArrowUpRight } from 'lucide-react';
import { Destination, ExplorePoint, LocalDiscovery } from '../../types';
import heroFallback from '../../assets/images/hero_takono_tourism_1790168118274.jpg';

type Props = {
  destination: Destination | null;
  explorePoints?: ExplorePoint[];
  localDiscoveries: LocalDiscovery[];
  onNavigate: (path: string) => void;
  onOpenScanModal: () => void;
};

export function HomePage({ destination, explorePoints = [], localDiscoveries, onNavigate, onOpenScanModal }: Props) {
  const photo = destination?.heroImage || heroFallback;
  return <main className="welcome-page bg-white text-slate-900">
    <section className="welcome-container py-10 sm:py-16 lg:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div className="max-w-xl">
          <p className="mb-5 flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-700"><span className="h-px w-7 bg-blue-600" /> TEMAN JELAJAH DESTINASIMU</p>
          <h1 className="text-[2.5rem] font-semibold leading-[1.14] tracking-[-.045em] sm:text-5xl xl:text-[3.5rem]">Datang ke tempat baru.<br /><span className="text-blue-700">Pulang bawa cerita.</span></h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-600">Kenalan dengan TAKONO, panduan wisata yang membantu kamu menemukan tempat, mengenal ceritanya, dan menikmati hal-hal menarik di sekitarnya.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="welcome-primary" onClick={() => onNavigate('/destinations')}>Temukan destinasi <ArrowRight size={17} /></button>
            <button className="welcome-secondary" onClick={onOpenScanModal}><QrCode size={17} /> Scan QR di lokasi</button>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">Lihat destinasi lebih dulu. Masuk saat kamu siap mulai menjelajah.</p>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-2xl bg-slate-100">
            <img src={photo} alt={destination?.name || 'Destinasi wisata'} className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[460px]" fetchPriority="high" />
          </div>
          <div className="relative mx-4 -mt-14 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:mx-6 sm:p-5">
            <div className="min-w-0"><p className="flex items-center gap-1.5 text-xs text-slate-500"><MapPin size={13} />{destination?.city || 'Jelajah bersama TAKONO'}</p><h2 className="mt-1 text-lg font-semibold">{destination?.name || 'Temukan destinasi pilihanmu'}</h2>{destination && <p className="mt-1 text-xs text-slate-500">{explorePoints.length} titik jelajah · {localDiscoveries.length} usaha lokal</p>}</div>
            <button aria-label="Lihat informasi destinasi" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100" onClick={() => onNavigate(destination ? '/destinations/' + destination.slug : '/destinations')}><ArrowUpRight size={20} /></button>
          </div>
        </div>
      </div>
    </section>

    <section className="border-y border-slate-100 bg-[#f7f9fc]">
      <div className="welcome-container grid gap-8 py-10 md:grid-cols-3 md:gap-10">
        {[
          { icon: Compass, title: 'Tahu mau ke mana', text: 'Pilih titik menarik dan lihat arahnya lewat Smart Guide.' },
          { icon: BookOpen, title: 'Kenali cerita di baliknya', text: 'Scan QR di lokasi untuk membaca cerita dan mencoba kuis singkat.' },
          { icon: Store, title: 'Jangan lewatkan sekitar', text: 'Cari agenda, kuliner, dan usaha lokal untuk melengkapi perjalanan.' }
        ].map(({ icon: Icon, title, text }) => <div key={title} className="flex items-start gap-4"><Icon size={22} strokeWidth={1.6} className="mt-1 shrink-0 text-blue-700" /><div><h2 className="text-sm font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div></div>)}
      </div>
    </section>

    <section className="welcome-container py-14 sm:py-20">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="mb-2 text-xs font-semibold text-blue-700">KENALI DESTINASINYA</p><h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Mulai dari satu tempat.<br />Temukan banyak pengalaman.</h2></div>
        <button className="inline-flex items-center gap-2 text-sm font-medium text-blue-700" onClick={() => onNavigate('/destinations')}>Lihat destinasi <ArrowRight size={16} /></button>
      </div>
      {destination ? <div className="grid overflow-hidden rounded-2xl border border-slate-200 md:grid-cols-2">
        <img src={destination.gallery?.[0] || photo} alt={'Suasana ' + destination.name} className="h-64 w-full object-cover md:h-full md:min-h-80" loading="lazy" />
        <div className="flex flex-col justify-center p-6 sm:p-9"><p className="flex items-center gap-1.5 text-xs text-slate-500"><MapPin size={14} />{destination.city}, {destination.province}</p><h3 className="mt-3 text-2xl font-semibold tracking-tight">{destination.name}</h3><p className="mt-4 text-sm leading-7 text-slate-600 line-clamp-4">{destination.description}</p><button className="welcome-primary mt-6 self-start" onClick={() => onNavigate('/destinations/' + destination.slug)}>Kenali {destination.name} <ArrowRight size={16} /></button></div>
      </div> : <div className="rounded-xl bg-slate-50 p-8 text-sm text-slate-500">Informasi destinasi akan tampil setelah tersedia. Kamu tetap dapat mengenal cara kerja TAKONO di bawah.</div>}
      {explorePoints.length > 0 && <div className="mt-6 grid gap-4 sm:grid-cols-3">{explorePoints.slice(0, 3).map(point => <button key={point.id} onClick={() => onNavigate('/app/explore/' + point.slug)} className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-blue-300 hover:bg-blue-50/30"><img src={point.image || photo} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" loading="lazy" /><span className="min-w-0 flex-1"><span className="block text-[11px] text-slate-500">{point.category}</span><strong className="mt-1 block text-sm font-medium leading-5">{point.name}</strong></span><ArrowUpRight size={16} className="shrink-0 text-slate-400 group-hover:text-blue-700" /></button>)}</div>}
    </section>

    <section className="border-t border-slate-100 bg-[#f7f9fc]">
      <div className="welcome-container grid gap-10 py-14 sm:py-16 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
        <div><p className="text-xs font-semibold text-blue-700">DARI PETA KE PENGALAMAN</p><h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Jelajah dengan<br />langkah sederhana.</h2><p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">TAKONO menemani dari memilih tujuan sampai menyimpan jejak perjalananmu.</p><button onClick={() => onNavigate('/how-it-works')} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-700">Pelajari cara menggunakan <ArrowRight size={16} /></button></div>
        <ol className="divide-y divide-slate-200">{[
          { icon: Navigation, title: 'Pilih tujuan dan buka panduannya', text: 'Lihat informasi destinasi, lalu temukan titik sesuai minatmu di Smart Guide.' },
          { icon: QrCode, title: 'Scan QR ketika sampai', text: 'Buka cerita di titik jelajah dan jawab kuis untuk mendapatkan poin.' },
          { icon: BookOpen, title: 'Simpan jejak perjalananmu', text: 'Lihat titik yang sudah dikunjungi di Album dan tukarkan poin dengan reward tersedia.' }
        ].map(({ icon: Icon, title, text }, index) => <li key={title} className="flex gap-4 py-5 first:pt-0 last:pb-0"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-blue-700"><Icon size={19} /></span><div><p className="text-xs text-slate-400">Langkah {index + 1}</p><h3 className="mt-1 text-sm font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{text}</p></div></li>)}</ol>
      </div>
    </section>
    <section className="welcome-container py-12 sm:py-16"><div className="flex flex-col justify-between gap-6 rounded-2xl bg-[#102542] p-7 sm:flex-row sm:items-center sm:p-10"><div><h2 className="text-2xl font-medium tracking-tight text-white">Mau mulai dari mana?</h2><p className="mt-2 text-sm leading-6 text-slate-300">Temukan destinasi, lalu biarkan rasa ingin tahu menuntunmu.</p></div><button onClick={() => onNavigate('/destinations')} className="inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-blue-50 sm:self-center">Lihat destinasi <ArrowRight size={17} /></button></div></section>
  </main>;
}

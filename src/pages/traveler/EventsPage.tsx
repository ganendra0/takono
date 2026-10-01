import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../lib/api.js';
import { DestinationEvent } from '../../types/index.js';
import { CalendarDays, CheckCircle2, Clock3, MapPin, QrCode } from 'lucide-react';

export const EventsPage: React.FC<{ onNavigate: (path: string) => void; onOpenScanModal: () => void }> = ({ onNavigate, onOpenScanModal }) => {
  const [events, setEvents] = useState<DestinationEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [participatedIds, setParticipatedIds] = useState<string[]>([]);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const res = await ApiClient.getEvents();
      if (res.success && res.data) {
        setEvents(res.data);
      } else {
        setActiveMessage(res.message || 'Gagal memuat event.');
      }
      const activities = await ApiClient.getMyActivities();
      if (activities.success) setParticipatedIds((activities.data || []).filter(a=>a.type==='event_participated').map(a=>a.referenceId));
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 px-4 pb-12 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Agenda destinasi</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Kegiatan dan acara</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Lihat jadwal acara di destinasi. Pindai QR di lokasi untuk mencatat partisipasi dan mengumpulkan poin.</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-sm text-slate-500">
          <CalendarDays size={17} className="text-blue-700" />
          <span><strong className="font-semibold text-slate-900">{events.length}</strong> agenda</span>
        </div>
      </header>

      {activeMessage && (
        <div role="alert" className="flex items-start justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          <span>{activeMessage}</span>
          <button onClick={() => setActiveMessage(null)} aria-label="Tutup pesan" className="shrink-0 rounded-md px-2 text-lg leading-5 text-rose-700 transition-colors hover:bg-rose-100">×</button>
        </div>
      )}

      {isLoading ? (
        <section aria-label="Memuat agenda" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map(item => (
            <div key={item} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="aspect-[16/10] animate-pulse bg-slate-100" />
              <div className="space-y-3 p-5"><div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" /><div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" /><div className="h-3 w-full animate-pulse rounded bg-slate-100" /></div>
            </div>
          ))}
        </section>
      ) : events.length ? (
        <section aria-label="Daftar agenda destinasi" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {events.map(event => {
            const isRegistered = participatedIds.includes(event.id);
            return (
              <article key={event.id} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-slate-300">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-xs font-semibold text-blue-800">
                    <CalendarDays size={14} />{event.startDate}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">Agenda destinasi</span>
                    <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold tabular-nums text-blue-800">+{event.pointsReward} poin</span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-slate-950">{event.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{event.description}</p>

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                    <div className="flex items-start gap-2.5"><Clock3 size={16} className="mt-0.5 shrink-0 text-slate-400" /><span>{event.time}</span></div>
                    <div className="flex items-start gap-2.5"><MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" /><span>{event.location}</span></div>
                  </div>

                  <button
                    type="button"
                    disabled={isRegistered}
                    onClick={onOpenScanModal}
                    className={`mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                      isRegistered
                        ? 'cursor-default border border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'cursor-pointer bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900'
                    }`}
                  >
                    {isRegistered ? <><CheckCircle2 size={17} /><span>Sudah berpartisipasi</span></> : <><QrCode size={17} /><span>Scan QR untuk klaim poin</span></>}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <CalendarDays className="mx-auto h-7 w-7 text-slate-400" strokeWidth={1.6} />
          <h2 className="mt-4 text-base font-semibold text-slate-900">Belum ada agenda tersedia</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Agenda yang diterbitkan untuk destinasi ini akan muncul di sini.</p>
        </section>
      )}
    </div>
  );
};

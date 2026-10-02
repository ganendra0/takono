import React, { useEffect, useState } from 'react';
import { Clock3, MapPin, QrCode } from 'lucide-react';
import { ApiClient } from '../../lib/api.js';
import { ExplorePoint } from '../../types/index.js';

export const DestinationExplorePage: React.FC<{ onOpenScanModal: () => void }> = ({ onOpenScanModal }) => {
  const [points, setPoints] = useState<ExplorePoint[]>([]);
  const [destinationName, setDestinationName] = useState('Destinasi');
  const [loading, setLoading] = useState(true);
  useEffect(() => { ApiClient.getDestinationBySlug().then(result => { if (result.success && result.data) { setPoints(result.data.explorePoints || []); setDestinationName(result.data.destination.name); } setLoading(false); }); }, []);
  if (loading) return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-label="Memuat Explore Point">
      <div className="h-7 w-48 animate-pulse rounded-lg bg-slate-200" />
      <div className="mt-3 h-4 max-w-md animate-pulse rounded bg-slate-100" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map(item => <div key={item} className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="aspect-[16/10] animate-pulse bg-slate-100" /><div className="space-y-3 p-5"><div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" /><div className="h-3 w-full animate-pulse rounded bg-slate-100" /></div></div>)}
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 pb-12">
      <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Panduan titik</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Jelajahi {destinationName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Kunjungi titik yang menarik, lalu pindai QR di lokasi untuk membuka cerita dan aktivitasnya.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:items-end">
          <span className="text-xs text-slate-500">{points.length} titik tersedia</span>
          <button onClick={onOpenScanModal} className="primary-button min-h-11 w-full rounded-xl px-5 sm:w-auto">
            <QrCode size={17} />
            Scan QR Explore Point
          </button>
        </div>
      </header>

      {points.length ? (
        <section aria-label={`Explore Point di ${destinationName}`} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {points.map((point, index) => (
            <article key={point.id} className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-slate-300">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img src={point.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <span className="absolute left-4 top-4 inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-white/70 bg-white/95 px-2 text-xs font-semibold text-slate-800 shadow-sm">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-800">{point.category}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500"><Clock3 size={13} />{point.estimatedDuration}</span>
                </div>
                <h2 className="mt-3 text-base font-semibold leading-snug tracking-tight text-slate-950">{point.name}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{point.description}</p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-500">Pindai QR saat tiba</span>
                  <span className="text-xs font-semibold tabular-nums text-blue-700">+{point.pointsReward} PTS</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <MapPin className="mx-auto h-7 w-7 text-slate-400" strokeWidth={1.6} />
          <h2 className="mt-4 text-base font-semibold text-slate-900">Belum ada titik jelajah</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Titik Explore Point yang diterbitkan untuk destinasi ini akan muncul di sini.</p>
        </section>
      )}
    </div>
  );
};

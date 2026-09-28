import React, { useEffect, useState } from 'react';
import { CheckCircle2, Compass, MapPin, QrCode } from 'lucide-react';
import { ApiClient } from '../../lib/api.js';
import { ExplorePoint } from '../../types/index.js';

export const DestinationExplorePage: React.FC<{ onOpenScanModal: () => void }> = ({ onOpenScanModal }) => {
  const [points, setPoints] = useState<ExplorePoint[]>([]);
  const [destinationName, setDestinationName] = useState('Destinasi');
  const [loading, setLoading] = useState(true);
  useEffect(() => { ApiClient.getDestinationBySlug().then(result => { if (result.success && result.data) { setPoints(result.data.explorePoints || []); setDestinationName(result.data.destination.name); } setLoading(false); }); }, []);
  if (loading) return <div className="py-16 text-center text-sm text-slate-500">Memuat Explore Point…</div>;
  return <div className="mx-auto max-w-5xl space-y-6 pb-10"><header><p className="text-xs font-semibold tracking-wide text-blue-700">EXPLORE POINT</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Titik cerita di {destinationName}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Datangi titiknya, lalu pindai QR pada papan informasi untuk membuka cerita dan aktivitasnya.</p></header><button onClick={onOpenScanModal} className="primary-button !py-2.5"><QrCode size={17} />Scan QR Explore Point</button><section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{points.length ? points.map(point => <article key={point.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white"><img src={point.image} alt="" className="h-36 w-full object-cover" /><div className="p-4"><div className="flex items-start justify-between gap-3"><h2 className="font-semibold text-slate-950">{point.name}</h2><Compass size={17} className="shrink-0 text-blue-600" /></div><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{point.description}</p><p className="mt-4 flex items-center gap-1 text-xs text-slate-500"><MapPin size={13} />Pindai QR saat tiba di titik</p></div></article>) : <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">Belum ada Explore Point yang diterbitkan.</div>}</section></div>;
};

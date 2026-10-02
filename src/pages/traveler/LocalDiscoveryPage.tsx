import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../lib/api.js';
import { LocalDiscovery } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { CheckCircle2, Clock3, MapPin, Phone, Star, Store, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LocalDiscoveryPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { refreshUserData } = useAuth();
  const [partners, setPartners] = useState<LocalDiscovery[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [visitedIds, setVisitedIds] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [ratingBusyId, setRatingBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['Semua', 'Kuliner', 'Oleh-oleh', 'Produk Lokal', 'Lainnya'];

  useEffect(() => {
    const fetchPartners = async () => {
      setIsLoading(true);
      const res = await ApiClient.getDestinationBySlug();
      if (res.success && res.data) {
        setPartners(res.data.localDiscoveries || []);
        const ratings = await ApiClient.getMyLocalDiscoveryRatings(res.data.destination.id);
        if (ratings.success) setRatings(Object.fromEntries((ratings.data || []).map(item => [item.localDiscoveryId, item.rating])));
      }
      const activities = await ApiClient.getMyActivities();
      if (activities.success) setVisitedIds((activities.data || []).filter(a=>a.type==='local_discovery_visited').map(a=>a.referenceId));
      if(!res.success) setMessage(res.message || 'Gagal memuat mitra.');
      setIsLoading(false);
    };

    fetchPartners();
  }, []);

  const handleRecordVisit = async (partner: LocalDiscovery) => {
    const res = await ApiClient.visitLocalDiscovery(partner.id);
    if (res.success && res.data) {
      setVisitedIds(current => current.includes(partner.id) ? current : [...current, partner.id]);
      setMessage(res.data.message);
      if (res.data.pointsAwarded > 0) {
        confetti({ particleCount: 40, spread: 50 });
        await refreshUserData();
      }
    } else { setMessage(res.message || 'Gagal mencatat kunjungan.'); }
  };

  const handleRating = async (partner: LocalDiscovery, rating: number) => {
    setRatingBusyId(partner.id);
    const res = await ApiClient.rateLocalDiscovery(partner.id, rating);
    setRatingBusyId(null);
    if (res.success && res.data) {
      setRatings(current => ({ ...current, [partner.id]: rating }));
      setPartners(current => current.map(item => item.id === partner.id ? { ...item, averageRating: res.data!.averageRating, ratingsCount: res.data!.ratingsCount } : item));
      setMessage(res.data.message);
    } else setMessage(res.message || 'Rating belum dapat disimpan.');
  };

  const filtered = selectedCategory === 'Semua'
    ? partners
    : partners.filter(p => p.category === selectedCategory);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 pb-12">
      <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Mitra sekitar</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Singgah di sekitar destinasi</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Temukan kuliner, oleh-oleh, dan usaha lokal untuk melengkapi perjalananmu.</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-sm text-slate-500">
          <Store size={17} className="text-blue-700" />
          <span><strong className="font-semibold text-slate-900">{filtered.length}</strong> mitra</span>
        </div>
      </header>

      {message && (
        <div role="status" className="flex items-start justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} aria-label="Tutup pesan" className="shrink-0 rounded-md px-2 text-lg leading-5 text-emerald-700 transition-colors hover:bg-emerald-100">×</button>
        </div>
      )}

      <section aria-label="Kategori usaha lokal" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-700 text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <p className="shrink-0 text-xs text-slate-500">{selectedCategory === 'Semua' ? 'Semua kategori' : selectedCategory}</p>
      </section>

      {isLoading ? (
        <section aria-label="Memuat mitra lokal" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map(item => (
            <div key={item} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="aspect-[16/10] animate-pulse bg-slate-100" />
              <div className="space-y-3 p-5"><div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" /><div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" /><div className="h-3 w-full animate-pulse rounded bg-slate-100" /></div>
            </div>
          ))}
        </section>
      ) : filtered.length ? (
        <section aria-label="Daftar usaha lokal" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(partner => {
            const isVisited = visitedIds.includes(partner.id);
            return (
              <article key={partner.id} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-slate-300">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img src={partner.image} alt={partner.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/95 px-3 py-1 text-xs font-semibold text-slate-800">{partner.category}</span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1"><h2 className="text-lg font-semibold leading-snug tracking-tight text-slate-950">{partner.name}</h2>{partner.ratingsCount ? <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-slate-600"><Star size={14} className="fill-amber-400 text-amber-400" />{Number(partner.averageRating || 0).toFixed(1)} <span className="font-normal text-slate-400">({partner.ratingsCount})</span></span> : <span className="mt-1 block text-xs text-slate-400">Belum ada rating</span>}</div>
                    {partner.operatingHours && <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-500"><Clock3 size={14} />{partner.operatingHours}</span>}
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{partner.description}</p>

                  {partner.promotion && (
                    <div className="mt-4 flex items-start gap-2 rounded-xl bg-blue-50 px-3 py-3 text-sm text-blue-950">
                      <Tag size={16} className="mt-0.5 shrink-0 text-blue-700" />
                      <span className="leading-5">{partner.promotion}</span>
                    </div>
                  )}

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
                    <div className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0 text-slate-400" /><span>{partner.address}</span></div>
                    {(partner.contact || partner.phone) && <div className="flex items-center gap-2"><Phone size={14} className="shrink-0 text-slate-400" /><span>{partner.contact || partner.phone}</span></div>}
                  </div>

                  <button
                    onClick={() => handleRecordVisit(partner)}
                    disabled={isVisited}
                    className={`mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                      isVisited
                        ? 'cursor-default border border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'cursor-pointer bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900'
                    }`}
                  >
                    {isVisited ? <><CheckCircle2 size={17} /><span>Kunjungan tercatat</span></> : <><Store size={16} /><span>Catat kunjungan · +{partner.pointsReward ?? 0} poin</span></>}
                  </button>

                  {isVisited && <div className="mt-3 border-t border-slate-100 pt-4"><p className="text-sm font-semibold text-slate-800">Bagaimana pengalamanmu?</p><div className="mt-2 flex items-center justify-between gap-2"><div className="flex items-center gap-1" role="radiogroup" aria-label={`Rating untuk ${partner.name}`}>{[1,2,3,4,5].map(star => <button key={star} type="button" disabled={ratingBusyId === partner.id} onClick={() => void handleRating(partner, star)} aria-label={`${star} bintang`} aria-pressed={(ratings[partner.id] || 0) === star} className="grid h-9 w-9 place-items-center rounded-lg text-slate-300 transition hover:bg-amber-50 hover:text-amber-400 disabled:opacity-50"><Star size={21} className={star <= (ratings[partner.id] || 0) ? 'fill-amber-400 text-amber-400' : ''} /></button>)}</div><span className="text-xs text-slate-500">{ratings[partner.id] ? `${ratings[partner.id]} dari 5` : 'Beri rating'}</span></div></div>}
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <Store className="mx-auto h-7 w-7 text-slate-400" strokeWidth={1.6} />
          <h2 className="mt-4 text-base font-semibold text-slate-900">Belum ada mitra di kategori ini</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Mitra lokal yang tersedia akan muncul di bagian ini.</p>
        </section>
      )}
    </div>
  );
};

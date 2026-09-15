import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import {
  ShoppingBag,
  Building2,
  Tag,
  MapPin,
  Phone,
  Instagram,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const LocalDiscoveryView: React.FC = () => {
  const { umkmList, destinations, logAnalyticsEvent } = useTakonoStore();
  const approvedUmkms = umkmList.filter((u) => u.approvalStatus === 'approved');

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState<string>('all');

  const categories = ['all', 'culinary', 'craft', 'souvenir'];

  const filteredUmkms = approvedUmkms.filter((u) => {
    const matchCat = selectedCategory === 'all' || u.category === selectedCategory;
    const matchDest =
      selectedDestinationFilter === 'all' ||
      u.associatedDestinationIds.includes(selectedDestinationFilter);
    return matchCat && matchDest;
  });

  const handleTrackUMKMView = (umkmId: string) => {
    logAnalyticsEvent('umkm_view', umkmId);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
          <ShoppingBag className="w-4 h-4" />
          <span>Local Discovery & UMKM Mitra</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Eksplorasi UMKM & Produk Lokal
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Dukung perekonomian warga lokal di sekitar destinasi wisata dengan berbelanja karya dan kuliner otentik.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium capitalize transition ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Destinasi:</span>
          <select
            value={selectedDestinationFilter}
            onChange={(e) => setSelectedDestinationFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 font-medium"
          >
            <option value="all">Semua Destinasi</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* UMKM List Cards */}
      <div className="space-y-6">
        {filteredUmkms.map((umkm) => {
          const associatedDests = destinations.filter((d) =>
            umkm.associatedDestinationIds.includes(d.id)
          );

          return (
            <div
              key={umkm.id}
              onClick={() => handleTrackUMKMView(umkm.id)}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-5 hover:shadow-sm transition"
            >
              {/* Business Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={umkm.imageUrl}
                    alt={umkm.businessName}
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-slate-900">{umkm.businessName}</h3>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Terverifikasi Takono
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                      {umkm.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {umkm.address}
                      </span>
                      {umkm.phone && (
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {umkm.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Destinations tag */}
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[11px] text-slate-400 block">Mitra Destinasi:</span>
                  <span className="text-xs font-semibold text-slate-800">
                    {associatedDests.map((d) => d.name).join(', ')}
                  </span>
                </div>
              </div>

              {/* Active Promotions */}
              {umkm.promotions.length > 0 && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-200/80 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <strong className="text-slate-900 font-bold">
                        {umkm.promotions[0].title}
                      </strong>
                      <p className="text-slate-600 text-[11px]">
                        {umkm.promotions[0].description}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-md bg-white border border-emerald-300 font-mono font-bold text-emerald-800 text-[11px] shrink-0">
                    KODE: {umkm.promotions[0].promoCode}
                  </span>
                </div>
              )}

              {/* Products Carousel / Grid */}
              {umkm.products.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
                    Produk Unggulan:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {umkm.products.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-3"
                      >
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-xs text-slate-900 truncate">
                            {prod.name}
                          </h5>
                          <span className="font-mono text-xs font-bold text-emerald-700">
                            Rp {prod.priceIdr.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

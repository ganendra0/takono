import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../lib/api.js';
import { LocalDiscovery } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { 
  Store, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  ExternalLink,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LocalDiscoveryPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { refreshUserData } = useAuth();
  const [partners, setPartners] = useState<LocalDiscovery[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [visitedIds, setVisitedIds] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['Semua', 'Kuliner', 'Oleh-oleh', 'Produk Lokal', 'Lainnya'];

  useEffect(() => {
    const fetchPartners = async () => {
      setIsLoading(true);
      const res = await ApiClient.getDestinationBySlug();
      if (res.success && res.data) {
        setPartners(res.data.localDiscoveries || []);
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
      setVisitedIds([...visitedIds, partner.id]);
      setMessage(res.data.message);
      if (res.data.pointsAwarded > 0) {
        confetti({ particleCount: 40, spread: 50 });
        await refreshUserData();
      }
    } else { setMessage(res.message || 'Gagal mencatat kunjungan.'); }
  };

  const filtered = selectedCategory === 'Semua'
    ? partners
    : partners.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-5 pb-8">
      
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Store className="w-5 h-5 text-amber-600" />
          <span>Singgah di sekitar</span>
        </h1>
        <p className="text-xs text-slate-500">
          Temukan kuliner, oleh-oleh, dan usaha lokal di sekitar destinasi.
        </p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="font-bold text-emerald-700">✕</button>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Partners List */}
      <div className="travel-catalog grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? <p>Memuat mitra…</p> : !filtered.length && <p>Belum ada mitra untuk kategori ini.</p>}
        {filtered.map(partner => {
          const isVisited = visitedIds.includes(partner.id);
          return (
            <div
              key={partner.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-blue-300 transition-colors flex flex-col justify-between"
            >
              <img
                src={partner.image}
                alt={partner.name}
                className="w-full h-44 object-cover"
                loading="lazy"
              />

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    {partner.category}
                  </span>
                  <span className="text-slate-500">{partner.operatingHours}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {partner.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {partner.description}
                </p>

                {/* Promo Card */}
                <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-950 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-medium">{partner.promotion}</span>
                </div>

                <div className="space-y-1 text-xs text-slate-500 pt-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{partner.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{partner.contact || partner.phone}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleRecordVisit(partner)}
                    disabled={isVisited}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isVisited
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-98'
                    }`}
                  >
                    {isVisited ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Kunjungan Tercatat</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Catat Kunjungan (+{partner.pointsReward ?? 0} Pts)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

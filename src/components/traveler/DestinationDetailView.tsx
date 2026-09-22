import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { 
  Clock, 
  Ticket, 
  ArrowLeft, 
  QrCode, 
  CheckCircle2, 
  Coins, 
  Store, 
  Calendar, 
  Gift, 
  Compass, 
  ChevronRight
} from 'lucide-react';

interface DestinationDetailViewProps {
  destinationId: string;
}

export const DestinationDetailView: React.FC<DestinationDetailViewProps> = ({ destinationId }) => {
  const store = useTakonoStore();
  
  const destinations = store.destinations || [];
  const explorePoints = store.explorePoints || [];
  const activeJourney = store.activeJourney;
  const startJourney = store.startJourney;
  const navigateTo = store.navigateTo;
  const setQrModalOpen = store.setQrModalOpen;
  const umkmProfiles = store.umkmProfiles || [];
  const rewards = store.rewards || [];

  const [activeTab, setActiveTab] = useState<'points' | 'umkm' | 'events' | 'rewards'>('points');

  // Fallback images teruji untuk hero banner
  const defaultImages: Record<string, string> = {
    'dest-penglipuran': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    'dest-prambanan': 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80',
    'dest-waerebo': 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80',
    'default': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80'
  };

  const destination = destinations.find((d) => d.id === destinationId) || destinations[0] || {
    id: 'dest-penglipuran',
    name: 'Desa Wisata Penglipuran',
    description: 'Desa adat di dataran tinggi Bangli, Bali, yang tersohor dengan kelestarian arsitektur bambu tradisional, tata ruang linier tanpa kendaraan bermotor, dan hutan bambu suci yang menjadi paru-paru ekologis.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    location: 'INDONESIA',
    operatingHours: '08:00 - 18:30 WITA',
    ticketPrice: 'Rp 25.000'
  };

  const points = explorePoints.filter((p) => p.destinationId === destination.id);
  const isCurrentJourney = activeJourney?.destinationId === destination.id;
  const completedCount = activeJourney?.completedPointIds?.length || 0;
  const progressPercent = Math.round((completedCount / (points.length || 1)) * 100);

  const heroImgSrc = destination.imageUrl || defaultImages[destination.id] || defaultImages['default'];

  return (
    <div className="space-y-8 pb-16 font-sans text-neutral-800 antialiased">
      
      {/* 1. TOP NAVIGATION / BACK BUTTON */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigateTo('/traveler/home')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 text-neutral-700 hover:text-blue-600 hover:border-blue-200 text-xs font-bold transition shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda Jelajah</span>
        </button>

        {isCurrentJourney && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>PERJALANAN AKTIF</span>
          </div>
        )}
      </div>

      {/* 2. HERO BANNER DESTINASI */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-200 shadow-xl min-h-[340px] sm:min-h-[400px] flex flex-col justify-end p-6 sm:p-10 text-white bg-neutral-900">
        <img
          src={heroImgSrc}
          alt={destination.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImages[destination.id] || defaultImages['default'];
          }}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-blue-600 font-bold text-white uppercase tracking-wider text-[10px]">
              {destination.location || 'INDONESIA'}
            </span>
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 font-medium text-neutral-200">
              {points.length} Titik Warisan Budaya
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {destination.name}
          </h1>

          <p className="text-neutral-300 text-xs sm:text-sm line-clamp-2 leading-relaxed max-w-2xl">
            {destination.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-3 text-xs font-medium text-neutral-300 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Buka: {destination.operatingHours || '08:00 - 18:30 WITA'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-blue-400" />
              <span>Tiket Masuk: {destination.ticketPrice || 'Rp 25.000'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CHECK-IN CONTROLLER & PROGRESS TRACKER */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-neutral-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              <span>Progress Jelajah Budaya</span>
            </h3>
            <p className="text-xs text-neutral-500">
              Kunjungi setiap titik secara berurutan untuk mendapatkan stempel dan Jejak Points.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 shrink-0 shadow-sm"
            >
              <QrCode className="w-4 h-4 text-blue-400" />
              <span>Pindai QR Plakat</span>
            </button>

            {!isCurrentJourney && startJourney && (
              <button
                type="button"
                onClick={() => startJourney(destination.id)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 shrink-0 shadow-md shadow-blue-500/20"
              >
                <span>Mulai Petualangan</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar Visual */}
        <div className="space-y-2 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-500 font-semibold">Progres Pengumpulan Poin</span>
            <span className="font-black text-blue-600">{completedCount} / {points.length} Tuntas ({progressPercent}%)</span>
          </div>
          <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden p-0.5 border border-neutral-200/60">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. TAB NAVIGATION MENU */}
      <div className="border-b border-neutral-200">
        <nav className="flex gap-2 overflow-x-auto scrollbar-none pb-px">
          <button
            type="button"
            onClick={() => setActiveTab('points')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition ${
              activeTab === 'points'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Rute & Titik Jelajah ({points.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('umkm')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition ${
              activeTab === 'umkm'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Kuliner & UMKM Lokal ({umkmProfiles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition ${
              activeTab === 'events'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Event & Festival</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rewards')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition ${
              activeTab === 'rewards'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Voucher & Hadiah ({rewards.length})</span>
          </button>
        </nav>
      </div>

      {/* 5. TAB CONTENT: RUTE & TITIK JELAJAH */}
      {activeTab === 'points' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {points.map((pt, idx) => {
            const isCompleted = activeJourney?.completedPointIds?.includes(pt.id);

            return (
              <div
                key={pt.id}
                className={`group bg-white rounded-3xl border p-6 space-y-4 transition duration-300 flex flex-col justify-between ${
                  isCompleted 
                    ? 'border-blue-200 bg-blue-50/20' 
                    : 'border-neutral-200 hover:border-neutral-300 hover:shadow-lg'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      TITIK #{idx + 1} • {pt.category || 'CULTURE'}
                    </span>
                    
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Selesai</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <Coins className="w-3.5 h-3.5" />
                        <span>+{pt.rewardPoints || 5} PTS</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-extrabold text-neutral-900 group-hover:text-blue-600 transition">
                    {pt.title}
                  </h4>

                  <p className="text-neutral-500 text-xs line-clamp-2 leading-relaxed">
                    {pt.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400 font-mono">
                    Kode: <strong className="text-neutral-700 font-bold">{pt.qrCodeId || pt.id}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => navigateTo(`/traveler/explore/${pt.id}`)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                  >
                    <span>Buka Cerita & Kuis</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT LAINNYA */}
      {activeTab === 'umkm' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {umkmProfiles.length > 0 ? (
            umkmProfiles.map((u) => (
              <div key={u.id} className="bg-white p-6 rounded-3xl border border-neutral-200 space-y-3">
                <div className="flex items-center gap-3">
                  <Store className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-extrabold text-neutral-900 text-sm">{u.name}</h4>
                    <p className="text-xs text-neutral-500">{u.category}</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-600">{u.description}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-neutral-500 col-span-2">Belum ada mitra UMKM di lokasi ini.</p>
          )}
        </div>
      )}

      {activeTab === 'events' && (
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 text-center space-y-3">
          <Calendar className="w-10 h-10 text-blue-600 mx-auto" />
          <h4 className="font-extrabold text-neutral-900">Festival Budaya Penglipuran 2026</h4>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Nikmati pertunjukan tarian tradisional dan pameran kerajinan bambu lokal sepanjang bulan ini.
          </p>
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.length > 0 ? (
            rewards.map((rw) => (
              <div key={rw.id} className="bg-white p-6 rounded-3xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-neutral-900 text-sm">{rw.title}</h4>
                  <span className="text-xs font-black font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                    {rw.pointsCost} PTS
                  </span>
                </div>
                <p className="text-xs text-neutral-500">{rw.description}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-neutral-500 col-span-2">Belum ada voucher yang tersedia.</p>
          )}
        </div>
      )}

    </div>
  );
};
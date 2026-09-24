import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { ApiClient } from '../../lib/api.js';
import {
  Destination,
  ExplorePoint,
  DestinationEvent,
  LocalDiscovery,
  Reward
} from '../../types/index.js';
import {
  Compass,
  MapPin,
  ArrowRight,
  Calendar,
  Gift,
  Store,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Footprints,
  Clock
} from 'lucide-react';

interface TravelerHomeProps {
  onNavigate: (path: string) => void;
  onOpenScanModal: () => void;
}

export const TravelerHome: React.FC<TravelerHomeProps> = ({ onNavigate, onOpenScanModal }) => {
  const { user, pointsBalance } = useAuth();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [recommendation, setRecommendation] = useState<ExplorePoint | null>(null);
  const [progress, setProgress] = useState<any>(null);
  const [events, setEvents] = useState<DestinationEvent[]>([]);
  const [localDiscoveries, setLocalDiscoveries] = useState<LocalDiscovery[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHomeData = async () => {
      setIsLoading(true);
      try {
        const [destRes, recRes, evtRes, locRes, rewRes] = await Promise.all([
          ApiClient.getDestinationBySlug(),
          ApiClient.getSmartGuideRecommendations(),
          ApiClient.getEvents(),
          ApiClient.getDestinationBySlug(),
          ApiClient.getRewards()
        ]);

        if (destRes.success && destRes.data) {
          setDestination(destRes.data.destination);
          setLocalDiscoveries(destRes.data.localDiscoveries || []);
        } else {
          setError(destRes.message || 'Destinasi tidak tersedia.');
        }

        if (recRes.success && recRes.data) {
          setRecommendation(recRes.data.nextRecommendation.point);
          setProgress(recRes.data.progress);
        }

        if (evtRes.success && evtRes.data) {
          setEvents(evtRes.data);
        }

        if (rewRes.success && rewRes.data) {
          setRewards(rewRes.data);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const uncompletedCount = progress
    ? progress.totalExplorePoints - progress.completedExplorePoints
    : 0;
  if (isLoading) return <p className="p-6 text-center">Memuat destinasi…</p>;
  if (error) return <div className="p-6 space-y-3"><p role="alert">{error}</p><button className="text-blue-600" onClick={()=>onNavigate('/destinations')}>Pilih destinasi</button></div>;

  return (
    <div className="space-y-5 pb-6">

      {/* 1. GREETING & POINTS SUMMARY */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Halo, {user?.name.split(' ')[0] || 'Penjelajah'}!
          </h1>
          <p className="text-xs text-slate-500">
            Siap menjelajahi cerita baru hari ini?
          </p>
        </div>

        <button
          onClick={() => onNavigate('/app/profile')}
          className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer hover:border-blue-300 transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 block leading-none">Jejak Points</span>
            <span className="text-xs font-mono font-bold text-slate-900 leading-none">
              {pointsBalance} Pts
            </span>
          </div>
        </button>
      </div>



      {/* 2. ACTIVE DESTINATION BANNER & PROGRESS TRACKER */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 text-white p-5 shadow-sm space-y-4 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between text-xs text-blue-200">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-300" />
              Destinasi Aktif
            </span>
            <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-mono uppercase">
              {destination?.name || 'Pilih destinasi'}
            </span>
          </div>

          <h2 className="text-lg font-extrabold leading-tight">
            {destination?.name || 'Belum ada destinasi'}
          </h2>

          <p className="text-xs text-blue-100">
            {uncompletedCount > 0
              ? `Masih ada ${uncompletedCount} titik yang belum kamu jelajahi.`
              : 'Luar biasa! Kamu telah menemukan seluruh titik jelajah di destinasi ini.'}
          </p>

          {/* Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] text-blue-200 font-mono">
              <span>Progres Penjelajahan</span>
              <span>{progress?.completedExplorePoints ?? 0} / {progress?.totalExplorePoints ?? 0} Titik</span>
            </div>
            <div className="w-full bg-blue-950/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${((progress?.completedExplorePoints ?? 0) / Math.max(1,progress?.totalExplorePoints ?? 0)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onNavigate('/app/smart-guide')}
              className="px-4 py-2.5 bg-white text-blue-900 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Lanjutkan Jelajah</span>
            </button>

            <button
              onClick={onOpenScanModal}
              className="px-3.5 py-2.5 bg-blue-800/80 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Scan QR Titik
            </button>
          </div>
        </div>
      </div>

      {/* 3. REKOMENDASI EXPLORE POINT BERIKUTNYA */}
      {recommendation && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Rekomendasi Titik Berikutnya
            </h3>
            <button
              onClick={() => onNavigate('/app/smart-guide')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Buka Smart Guide</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div
            onClick={() => onNavigate(`/app/explore/${recommendation.slug}`)}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer flex gap-4 items-center"
          >
            <img
              src={recommendation.image}
              alt={recommendation.name}
              className="w-20 h-20 rounded-xl object-cover shrink-0"
              loading="lazy"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 text-[10px]">
                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded">
                  {recommendation.category}
                </span>
                <span className="text-slate-400 font-mono">+{recommendation.pointsReward} Pts</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {recommendation.name}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-1">
                {recommendation.description}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        </div>
      )}

      {/* 4. EVENT TERDEKAT */}
      {events.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Event & Pertunjukan Terdekat
            </h3>
            <button
              onClick={() => onNavigate('/app/events')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Semua Event</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div
            onClick={() => onNavigate('/app/events')}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer flex gap-4 items-center"
          >
            <img
              src={events[0].image}
              alt={events[0].title}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
              loading="lazy"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 text-[10px] text-blue-600 font-semibold">
                <Clock className="w-3 h-3" />
                <span>{events[0].time}</span>
                <span>·</span>
                <span>+{events[0].pointsReward} Poin</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {events[0].title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-1">
                {events[0].location}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. LOCAL DISCOVERY */}
      {localDiscoveries.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Local Discovery di Sekitar Destinasi
            </h3>
            <button
              onClick={() => onNavigate('/app/local-discovery')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {localDiscoveries.slice(0, 2).map(partner => (
              <div
                key={partner.id}
                onClick={() => onNavigate('/app/local-discovery')}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-colors cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="font-semibold text-blue-600">{partner.category}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{partner.operatingHours}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{partner.name}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{partner.promotion}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. REWARD YANG TERSEDIA */}
      {rewards.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Reward Siap Ditukar
            </h3>
            <button
              onClick={() => onNavigate('/app/rewards')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Katalog Reward</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900">{rewards[0].name}</h4>
              <p className="text-[11px] text-slate-500">Diperlukan: {rewards[0].pointsRequired} Jejak Points</p>
            </div>
            <button
              onClick={() => onNavigate('/app/rewards')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Tukar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

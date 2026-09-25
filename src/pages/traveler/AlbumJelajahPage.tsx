import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../lib/api.js';
import { ExplorePoint, RewardRedemption } from '../../types/index.js';
import {
  BookMarked,
  Award,
  Sparkles,
  CheckCircle2,
  MapPin,
  ChevronRight,
  Gift,
  Calendar
} from 'lucide-react';

export const AlbumJelajahPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [albumData, setAlbumData] = useState<{
    progress: any;
    completedPoints: ExplorePoint[];
    redemptions: RewardRedemption[];
    totalPointsEarned: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,setError] = useState('');

  useEffect(() => {
    const fetchAlbum = async () => {
      setIsLoading(true);
      const res = await ApiClient.getMyAlbum();
      if (res.success && res.data) {
        setAlbumData(res.data);
      } else {
        setError(res.message || 'Gagal memuat album.');
      }
      setIsLoading(false);
    };

    fetchAlbum();
  }, []);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-500 space-y-2">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs">Membuka Album Jelajah...</p>
      </div>
    );
  }

  const progress = albumData?.progress;
  if (error) return <p role="alert" className="text-rose-700 p-6">{error}</p>;
  const completedPoints = albumData?.completedPoints || [];
  const percent = progress
    ? Math.round((progress.completedExplorePoints / Math.max(1,progress.totalExplorePoints)) * 100)
    : 0;

  return (
    <div className="space-y-6 pb-12">

      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-blue-600" />
          <span>Album Jelajah Destinasi</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Simpan titik yang sudah dikunjungi dan lihat perjalananmu di Taman Bungkul.
        </p>
      </div>

      {/* Destination Album Header Card */}
      <div className="p-5 bg-slate-950 text-white rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-300">
            Album Taman Bungkul
          </span>
          <span className="text-xs text-slate-300 font-mono">
            {progress?.completedExplorePoints ?? 0} / {progress?.totalExplorePoints ?? 0} Titik
          </span>
        </div>

        <div>
          <h2 className="text-lg font-bold text-white">{progress?.destinationName || 'Destinasi'}</h2>
          <p className="text-xs text-slate-400">Ruang kota, sejarah, aktivitas, dan kuliner Surabaya</p>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Kelengkapan Album</span>
            <span className="font-mono font-bold text-blue-400">{percent}%</span>
          </div>
        </div>
      </div>

      {/* Badges Earned */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Lencana Petualang
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center space-y-1 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mx-auto text-sm">
              🌿
            </div>
            <div className="text-[11px] font-bold text-slate-900 leading-snug">Sahabat Taman</div>
            <div className="text-[10px] text-emerald-600 font-semibold">{completedPoints.some(p=>p.category==='Alam'||p.category==='Edukasi') ? 'Tercapai' : 'Belum tercapai'}</div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center space-y-1 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mx-auto text-sm">
              🏛️
            </div>
            <div className="text-[11px] font-bold text-slate-900 leading-snug">Pecinta Sejarah</div>
            <div className="text-[10px] text-emerald-600 font-semibold">{completedPoints.some(p=>p.category==='Sejarah') ? 'Tercapai' : 'Belum tercapai'}</div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-dashed border-slate-200 text-center space-y-1 opacity-60">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center font-bold mx-auto text-sm">
              🏆
            </div>
            <div className="text-[11px] font-bold text-slate-500 leading-snug">Penjelajah Lengkap</div>
            <div className="text-[10px] text-slate-400 font-medium">{Math.max(0,(progress?.totalExplorePoints??0)-(progress?.completedExplorePoints??0))} titik tersisa</div>
          </div>
        </div>
      </div>

      {/* Discovered Points Collection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Titik Yang Berhasil Ditemukan ({completedPoints.length})
          </h3>
          <button
            onClick={() => onNavigate('/app/smart-guide')}
            className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            Lanjut Cari
          </button>
        </div>

        <div className="space-y-3">
          {completedPoints.map(point => (
            <div
              key={point.id}
              onClick={() => onNavigate(`/app/explore/${point.slug}`)}
              className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer flex items-center gap-3.5"
            >
              <img
                src={point.image}
                alt={point.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Koleksi Ditemukan</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">{point.name}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">{point.category} · {point.estimatedDuration}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Redemptions List */}
      {albumData?.redemptions && albumData.redemptions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Kupon Reward Ditukarkan
          </h3>
          <div className="space-y-2">
            {albumData.redemptions.map(red => (
              <div key={red.id} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{red.rewardTitle || red.rewardName}</div>
                  <div className="text-[11px] font-mono text-blue-600 mt-0.5">{red.voucherCode || red.redemptionCode}</div>
                </div>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-md">
                  {red.status === 'active' ? 'Siap Pakai' : 'Terpakai'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

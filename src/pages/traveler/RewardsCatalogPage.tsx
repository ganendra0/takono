import {copyText} from '../../lib/clipboard';
import {createId} from '../../lib/uuid';
import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../lib/api.js';
import { Reward, RewardRedemption } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Clock, 
  AlertCircle,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RewardsCatalogPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { user, pointsBalance, refreshUserData } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [redemptionSuccess, setRedemptionSuccess] = useState<RewardRedemption | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [busy, setBusy] = useState(false);
  const requestRef = React.useRef<{rewardId:string;id:string}|null>(null);

  useEffect(() => {
    const fetchRewards = async () => {
      setIsLoading(true);
      const res = await ApiClient.getRewards();
      if (res.success && res.data) {
        setRewards(res.data);
      } else {
        setErrorMessage(res.message || 'Gagal memuat reward.');
      }
      setIsLoading(false);
    };

    fetchRewards();
  }, []);

  const handleRedeem = async (reward: Reward) => {
    if (busy) return;
    if (pointsBalance < reward.pointsRequired) {
      setErrorMessage(`Jejak Points kamu (${pointsBalance}) belum mencukupi untuk reward ini (${reward.pointsRequired} Pts).`);
      return;
    }

    setErrorMessage(null);
    setBusy(true);
    if (requestRef.current?.rewardId !== reward.id) requestRef.current = {rewardId:reward.id,id:createId()};
    const res = await ApiClient.redeemReward(reward.id, requestRef.current.id);
    setBusy(false);
    if (res.success && res.data) {
      setRedemptionSuccess(res.data.redemption);
      setSelectedReward(null);
      confetti({ particleCount: 70, spread: 70 });
      await refreshUserData();
      requestRef.current = null;
      const fresh = await ApiClient.getRewards();
      if (fresh.success && fresh.data) setRewards(fresh.data);
    } else {
      setErrorMessage(res.message || 'Gagal menukarkan reward.');
    }
  };

  const handleCopyCode = async (code: string) => {
    const copied=await copyText(code);
    setCopiedCode(copied);if(!copied)setErrorMessage('Salin kode voucher secara manual.');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-5 pb-8">
      
      {/* Top Points Balance Header Card */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
            Saldo Jejak Points Kamu
          </span>
          <div className="text-2xl font-mono font-extrabold text-slate-900 mt-0.5">
            {pointsBalance} <span className="text-xs font-sans font-semibold text-blue-600">Points</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Jelajahi destinasi dan jawab kuis untuk mengumpulkan poin.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/app/smart-guide')}
          className="px-3.5 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer border border-blue-100"
        >
          Cari Poin
        </button>
      </div>

      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Gift className="w-5 h-5 text-blue-600" />
          <span>Reward untuk perjalananmu</span>
        </h1>
        <p className="text-xs text-slate-500">
          Gunakan poin untuk reward yang tersedia dari pengelola dan mitra destinasi.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="font-bold text-rose-700">✕</button>
        </div>
      )}

      {/* Rewards Grid */}
      <div className="travel-catalog grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? <p>Memuat reward…</p> : !rewards.length && <p>Belum ada reward tersedia.</p>}
        {rewards.map(reward => {
          const canAfford = pointsBalance >= reward.pointsRequired;
          const currentStock = reward.stock ?? (reward.quota - reward.claimedCount);
          return (
            <div 
              key={reward.id}
              className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-3 hover:border-blue-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    {reward.category || 'Voucher UMKM'}
                  </span>
                  <span className="font-mono font-bold text-xs text-slate-900">
                    Sisa Stok: {currentStock}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {reward.name}
                  </h3>
                  <div className="text-[11px] text-slate-500">Mitra: {reward.partner}</div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {reward.description}
                </p>

                <div className="text-[10px] text-slate-400">
                  {Array.isArray(reward.terms) ? reward.terms.join(' · ') : reward.terms}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="font-mono font-bold text-sm text-blue-600">
                  {reward.pointsRequired} Pts
                </div>

                <button
                  onClick={() => setSelectedReward(reward)}
                  disabled={!canAfford || currentStock <= 0}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    canAfford && currentStock > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-98'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {currentStock <= 0 ? 'Stok Habis' : canAfford ? 'Tukarkan Reward' : 'Poin Kurang'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">Konfirmasi Penukaran</h3>
              <p className="text-xs text-slate-600">
                Tukarkan <strong>{selectedReward.pointsRequired} Jejak Points</strong> untuk:
              </p>
              <p className="text-xs font-bold text-blue-600 pt-1">{selectedReward.name}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 text-left">
              Poin akan didebit dari saldo akunmu secara langsung dan kamu akan mendapatkan kode voucher unik.
            </div>

            {errorMessage&&<p role="alert" className="text-sm text-rose-700">{errorMessage}</p>}<div className="flex gap-2 pt-2">
              <button
                disabled={busy} onClick={() => setSelectedReward(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                disabled={busy}
                onClick={() => handleRedeem(selectedReward)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {busy?'Menukar…':'Tukar reward'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal with Voucher Code */}
      {redemptionSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                Penukaran Berhasil!
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                {redemptionSuccess.rewardTitle || redemptionSuccess.rewardName}
              </h3>
              <p className="text-xs text-slate-600">
                Tunjukkan kode voucher berikut kepada staf kasir mitra.
              </p>
            </div>

            {/* Voucher Box */}
            <div className="p-4 bg-slate-50 border-2 border-dashed border-blue-300 rounded-2xl space-y-2">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Kode Voucher Unik</div>
              <div className="text-lg font-mono font-extrabold text-blue-700 tracking-wider">
                {redemptionSuccess.voucherCode || redemptionSuccess.redemptionCode}
              </div>
              <button
                onClick={() => handleCopyCode(redemptionSuccess.voucherCode || redemptionSuccess.redemptionCode)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-blue-600" />
                <span>{copiedCode ? 'Tersalin!' : 'Salin Kode'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                setRedemptionSuccess(null);
                onNavigate('/app/profile');
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Lihat di Dompet Voucher Profil
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

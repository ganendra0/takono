import {copyText} from '../../lib/clipboard';
import {createId} from '../../lib/uuid';
import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../lib/api.js';
import { Reward, RewardRedemption } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { AlertCircle, CheckCircle2, Copy, Gift, ShoppingBag } from 'lucide-react';
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
    <div className="mx-auto w-full max-w-7xl space-y-7 pb-12">
      <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Apresiasi perjalanan</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Reward untuk perjalananmu</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Tukarkan Jejak Points dengan pilihan reward dari pengelola dan mitra destinasi.</p>
        </div>
        <button
          onClick={() => onNavigate('/app/smart-guide')}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-800 transition-colors hover:bg-blue-100"
        >
          <Gift size={16} />Cari poin
        </button>
      </header>

      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Saldo Jejak Points</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums text-slate-950">
            {pointsBalance}<span className="ml-2 text-sm font-medium text-slate-500">poin</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">Jelajahi destinasi dan ikuti aktivitas untuk mengumpulkan poin.</p>
        </div>
        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          <Gift size={17} className="text-blue-700" />
          <span><strong className="font-semibold text-slate-900">{rewards.length}</strong> reward tersedia</span>
        </div>
      </section>

      {errorMessage && (
        <div role="alert" className="flex items-start justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          <div className="flex items-start gap-2.5"><AlertCircle size={17} className="mt-0.5 shrink-0 text-rose-600" /><span>{errorMessage}</span></div>
          <button onClick={() => setErrorMessage(null)} aria-label="Tutup pesan" className="shrink-0 rounded-md px-2 text-lg leading-5 text-rose-700 transition-colors hover:bg-rose-100">Ã—</button>
        </div>
      )}

      {isLoading ? (
        <section aria-label="Memuat reward" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map(item => (
            <div key={item} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="aspect-[16/10] animate-pulse bg-slate-100" />
              <div className="space-y-3 p-5"><div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" /><div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" /><div className="h-3 w-full animate-pulse rounded bg-slate-100" /></div>
            </div>
          ))}
        </section>
      ) : rewards.length ? (
        <section aria-label="Katalog reward" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rewards.map(reward => {
            const canAfford = pointsBalance >= reward.pointsRequired;
            const currentStock = reward.stock ?? (reward.quota - reward.claimedCount);
            return (
              <article key={reward.id} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-slate-300">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img src={reward.image} alt={reward.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/95 px-3 py-1 text-xs font-semibold text-slate-800">{reward.category || 'Voucher UMKM'}</span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold leading-snug tracking-tight text-slate-950">{reward.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">Dari {reward.partner}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium tabular-nums ${currentStock <= 0 ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-800'}`}>
                      {currentStock <= 0 ? 'Stok habis' : `Sisa ${currentStock}`}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{reward.description}</p>
                  {reward.terms && (
                    <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">
                      <span className="font-semibold text-slate-600">Ketentuan: </span>{Array.isArray(reward.terms) ? reward.terms.join(' Â· ') : reward.terms}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-[11px] text-slate-500">Nilai penukaran</p>
                      <p className="mt-0.5 text-base font-semibold tabular-nums text-blue-800">{reward.pointsRequired} poin</p>
                    </div>
                    <button
                      onClick={() => setSelectedReward(reward)}
                      disabled={!canAfford || currentStock <= 0}
                      className={`min-h-10 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                        canAfford && currentStock > 0
                          ? 'cursor-pointer bg-blue-700 text-white hover:bg-blue-800'
                          : 'cursor-not-allowed bg-slate-100 text-slate-400'
                      }`}
                    >
                      {currentStock <= 0 ? 'Stok habis' : canAfford ? 'Tukarkan' : 'Poin kurang'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <Gift className="mx-auto h-7 w-7 text-slate-400" strokeWidth={1.6} />
          <h2 className="mt-4 text-base font-semibold text-slate-900">Belum ada reward tersedia</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Reward yang diterbitkan untuk destinasi ini akan muncul di sini.</p>
        </section>
      )}

      {selectedReward && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label="Konfirmasi penukaran reward">
          <section className="w-full max-w-md space-y-5 rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-2xl">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><ShoppingBag size={21} /></span>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold tracking-tight text-slate-950">Konfirmasi penukaran</h2>
                <p className="mt-1 text-sm leading-5 text-slate-600">Tukarkan <strong>{selectedReward.pointsRequired} Jejak Points</strong> untuk reward ini.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-3">
              <img src={selectedReward.image} alt="" className="h-16 w-20 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-950">{selectedReward.name}</p><p className="mt-1 truncate text-xs text-slate-500">{selectedReward.partner}</p></div>
            </div>

            <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm leading-5 text-slate-600">Poin akan dipotong dari saldo akunmu. Setelah berhasil, kode voucher unik akan ditampilkan.</p>
            {errorMessage && <p role="alert" className="text-sm text-rose-700">{errorMessage}</p>}
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button disabled={busy} onClick={() => setSelectedReward(null)} className="min-h-11 flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50">Batal</button>
              <button disabled={busy} onClick={() => handleRedeem(selectedReward)} className="min-h-11 flex-1 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60">{busy ? 'Menukarâ€¦' : 'Tukar reward'}</button>
            </div>
          </section>
        </div>
      )}

      {redemptionSuccess && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label="Voucher berhasil diterbitkan">
          <section className="w-full max-w-md space-y-5 rounded-t-3xl bg-white p-6 text-center shadow-2xl sm:rounded-2xl">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-700"><CheckCircle2 size={24} /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Penukaran berhasil</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{redemptionSuccess.rewardTitle || redemptionSuccess.rewardName}</h2>
              <p className="mt-2 text-sm leading-5 text-slate-600">Tunjukkan kode voucher ini kepada staf kasir mitra.</p>
            </div>

            <div className="rounded-xl border border-dashed border-blue-300 bg-blue-50/60 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Kode voucher</p>
              <p className="mt-2 break-all font-mono text-xl font-semibold tracking-wider text-blue-800">{redemptionSuccess.voucherCode || redemptionSuccess.redemptionCode}</p>
              <button onClick={() => handleCopyCode(redemptionSuccess.voucherCode || redemptionSuccess.redemptionCode)} className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                <Copy size={15} className="text-blue-700" />{copiedCode ? 'Tersalin' : 'Salin kode'}
              </button>
            </div>

            <button onClick={() => { setRedemptionSuccess(null); onNavigate('/app/profile'); }} className="min-h-11 w-full rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800">Lihat di profil</button>
          </section>
        </div>
      )}
    </div>
  );
};

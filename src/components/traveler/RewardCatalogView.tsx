import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { DestinationReward } from '../../types/destination';
import { QRCodeView } from '../common/QRCodeView';
import {
  Award,
  Coins,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ShoppingBag,
  Ticket,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RewardCatalogView: React.FC = () => {
  const {
    rewards,
    currentUser,
    redeemReward,
    getDestination,
    getUMKMById,
    navigateTo,
  } = useTakonoStore();

  const [selectedReward, setSelectedReward] = useState<DestinationReward | null>(null);
  const [redemptionSuccessCode, setRedemptionSuccessCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpenRedeemModal = (reward: DestinationReward) => {
    setSelectedReward(reward);
    setRedemptionSuccessCode(null);
    setErrorMessage(null);
  };

  const handleConfirmRedeem = () => {
    if (!selectedReward) return;

    const res = redeemReward(selectedReward.id);
    if (res.success && res.claimCode) {
      setRedemptionSuccessCode(res.claimCode);
      setErrorMessage(null);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Katalog Reward Budaya & UMKM</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Tukarkan Jejak Points
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gunakan poin yang Anda raih dari kuis dan jelajah budaya untuk menikmati kuliner lokal dan cinderamata.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
          <Coins className="w-4 h-4 text-amber-600" />
          <div className="text-xs">
            <span className="text-slate-500">Saldo Anda: </span>
            <strong className="text-amber-950 font-mono font-bold">
              {currentUser.pointsBalance} Poin
            </strong>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rewards.map((reward) => {
          const destination = getDestination(reward.destinationId);
          const umkm = reward.umkmId ? getUMKMById(reward.umkmId) : null;
          const canAfford = currentUser.pointsBalance >= reward.pointsCost;
          const isOutOfStock = reward.currentStock <= 0;

          return (
            <div
              key={reward.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={reward.imageUrl}
                    alt={reward.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-white backdrop-blur-xs">
                      {reward.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-xs font-mono">
                      {reward.pointsCost} Poin
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{reward.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {reward.description}
                  </p>

                  <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Destinasi:</span>
                      <span className="font-medium text-slate-700">{destination?.name}</span>
                    </div>
                    {umkm && (
                      <div className="flex items-center justify-between">
                        <span>Mitra UMKM:</span>
                        <span className="font-medium text-emerald-700">{umkm.businessName}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Sisa Stok:</span>
                      <span
                        className={`font-semibold font-mono ${
                          isOutOfStock ? 'text-rose-600' : 'text-slate-700'
                        }`}
                      >
                        {reward.currentStock} / {reward.initialStock}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  type="button"
                  disabled={!canAfford || isOutOfStock}
                  onClick={() => handleOpenRedeemModal(reward)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition ${
                    isOutOfStock
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : canAfford
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {isOutOfStock
                    ? 'Stok Habis'
                    : canAfford
                    ? 'Tukarkan Poin Sekarang'
                    : `Butuh ${reward.pointsCost - currentUser.pointsBalance} Poin Lagi`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Redemption Confirmation & Voucher Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-bold text-sm">
                {redemptionSuccessCode ? 'Voucher Berhasil Diklaim' : 'Konfirmasi Penukaran Poin'}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedReward(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {!redemptionSuccessCode ? (
                <>
                  <div className="flex items-start gap-3">
                    <img
                      src={selectedReward.imageUrl}
                      alt={selectedReward.title}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{selectedReward.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{selectedReward.description}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Biaya Poin:</span>
                      <strong className="text-slate-900 font-mono">
                        {selectedReward.pointsCost} Jejak Points
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Saldo Anda Saat Ini:</span>
                      <span className="font-mono">{currentUser.pointsBalance} Poin</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200">
                      <span className="text-slate-500">Sisa Saldo Setelah Klaim:</span>
                      <strong className="font-mono text-emerald-700">
                        {currentUser.pointsBalance - selectedReward.pointsCost} Poin
                      </strong>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedReward(null)}
                      className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmRedeem}
                      className="px-5 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-xs"
                    >
                      Konfirmasi & Tukar Poin
                    </button>
                  </div>
                </>
              ) : (
                /* Success Voucher Screen with Scannable QR */
                <div className="space-y-4 text-center">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-emerald-950">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-sm">Penukaran Sukses!</h4>
                    <p className="text-xs text-emerald-800">
                      Tunjukkan kode voucher atau QR berikut ke kasir/pengelola mitra untuk penukaran.
                    </p>
                  </div>

                  <QRCodeView
                    value={redemptionSuccessCode}
                    title={selectedReward.title}
                    subtitle={`Kode Klaim Resmi: ${redemptionSuccessCode}`}
                    size={160}
                    showActions={true}
                  />

                  <div className="p-3 bg-slate-50 rounded-xl text-left text-xs text-slate-600 space-y-1">
                    <strong className="text-slate-900 block font-semibold">Syarat & Ketentuan:</strong>
                    <p className="text-[11px]">{selectedReward.terms}</p>
                    <p className="text-[11px] text-slate-400">
                      Berlaku hingga: {selectedReward.validUntil}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedReward(null)}
                    className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
                  >
                    Selesai & Tutup
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

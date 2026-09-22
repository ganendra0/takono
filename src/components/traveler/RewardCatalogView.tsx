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
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Katalog Reward Budaya & UMKM</span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Tukarkan Jejak Points
          </h1>
          <p className="text-xs text-stone-500 mt-0.5 font-normal">
            Gunakan poin yang Anda raih dari kuis dan jelajah budaya untuk menikmati kuliner lokal dan cinderamata.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-amber-50 border border-amber-200 shadow-2xs">
          <Coins className="w-4 h-4 text-amber-800" />
          <div className="text-xs">
            <span className="text-stone-500">Saldo Anda: </span>
            <strong className="text-amber-950 font-mono font-bold">
              {currentUser.pointsBalance.toLocaleString('id-ID')} Poin
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
              className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-sm transition"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-stone-100">
                  <img
                    src={reward.imageUrl}
                    alt={reward.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-stone-900/80 text-white backdrop-blur-xs">
                      {reward.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-700 text-white shadow-xs font-mono">
                      {reward.pointsCost} Poin
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-stone-900 leading-snug">{reward.title}</h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-normal">
                    {reward.description}
                  </p>

                  <div className="pt-2 text-[11px] text-stone-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Destinasi:</span>
                      <span className="font-semibold text-stone-700">{destination?.name}</span>
                    </div>
                    {umkm && (
                      <div className="flex items-center justify-between">
                        <span>Mitra UMKM:</span>
                        <span className="font-semibold text-emerald-800">{umkm.businessName}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Sisa Stok:</span>
                      <span
                        className={`font-semibold font-mono ${
                          isOutOfStock ? 'text-rose-600' : 'text-stone-700'
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
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isOutOfStock
                      ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      : canAfford
                      ? 'bg-amber-700 hover:bg-amber-800 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden my-6 animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-white">
              <h3 className="font-bold text-sm">
                {redemptionSuccessCode ? 'Voucher Berhasil Diklaim' : 'Konfirmasi Penukaran Poin'}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedReward(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white cursor-pointer"
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
                      className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">{selectedReward.title}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">{selectedReward.description}</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Biaya Poin:</span>
                      <strong className="text-stone-900 font-mono">
                        {selectedReward.pointsCost} Jejak Points
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Saldo Anda Saat Ini:</span>
                      <span className="font-mono">{currentUser.pointsBalance} Poin</span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-stone-200">
                      <span className="text-stone-500">Sisa Saldo Setelah Klaim:</span>
                      <strong className="font-mono text-emerald-800">
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
                      className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmRedeem}
                      className="px-5 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-2xs cursor-pointer"
                    >
                      Konfirmasi & Tukar Poin
                    </button>
                  </div>
                </>
              ) : (
                /* Success Voucher Screen with Scannable QR */
                <div className="space-y-4 text-center">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-emerald-950">
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

                  <div className="p-3.5 bg-stone-50 rounded-2xl text-left text-xs text-stone-600 space-y-1">
                    <strong className="text-stone-900 block font-semibold">Syarat & Ketentuan:</strong>
                    <p className="text-[11px]">{selectedReward.terms}</p>
                    <p className="text-[11px] text-stone-400">
                      Berlaku hingga: {selectedReward.validUntil}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedReward(null)}
                    className="w-full py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-stone-800"
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

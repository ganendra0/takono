import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Gift, 
  HelpCircle, 
  Store, 
  CheckCircle2, 
  ArrowRight,
  Receipt
} from 'lucide-react';

export const PointsLedgerView: React.FC = () => {
  const store = useTakonoStore();
  
  const currentUser = store.currentUser || { pointsBalance: 85 };
  const rewards = store.rewards || [];
  const pointTransactions = store.pointTransactions || [];
  const claimReward = store.claimReward;

  const [claimedRewardId, setClaimedRewardId] = useState<string | null>(null);

  const handleClaim = (rewardId: string, cost: number) => {
    if (currentUser.pointsBalance < cost) {
      alert('Poin Anda belum mencukupi untuk menukar voucher ini.');
      return;
    }

    if (claimReward) {
      claimReward(rewardId);
      setClaimedRewardId(rewardId);
      setTimeout(() => setClaimedRewardId(null), 3000);
    }
  };

  const displayTransactions = pointTransactions.length > 0 ? pointTransactions : [
    {
      id: 'tx-1',
      description: 'Menyelesaikan bacaan & etika Angkul-Angkul Tradisional',
      type: 'EARN',
      amount: 5,
      createdAt: '2026-09-18 09:30'
    },
    {
      id: 'tx-2',
      description: 'Menjawab kuis budaya Hutan Bambu Suci dengan benar',
      type: 'EARN',
      amount: 10,
      createdAt: '2026-09-18 10:15'
    }
  ];

  const totalEarned = displayTransactions
    .filter((t) => t.type === 'EARN' || t.amount > 0)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSpent = displayTransactions
    .filter((t) => t.type === 'SPEND' || t.amount < 0)
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

  return (
    <div className="space-y-10 pb-16 font-sans text-neutral-800 antialiased max-w-7xl mx-auto">
      
      {/* 1. HERO WALLET CARD (Electric Blue - Balanced 2-Column Layout) */}
      <div className="relative rounded-3xl bg-blue-600 text-white p-8 sm:p-10 overflow-hidden shadow-xl shadow-blue-500/20">
        
        {/* Abstract Wave Silhouette Background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-20">
          <svg className="h-full w-full fill-current text-white" viewBox="0 0 400 400" preserveAspectRatio="none">
            <path d="M150,0 Q300,150 200,300 T400,400 L400,0 Z" />
          </svg>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Kolom Kiri: Saldo Utama & Statistik */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-mono font-bold uppercase tracking-wider">
              <Coins className="w-3.5 h-3.5 text-blue-200" />
              <span>Buku Besar Jejak Points</span>
            </div>

            <div>
              <span className="text-xs font-medium text-blue-100 block mb-1">Saldo Poin Aktif Anda</span>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight">
                  {currentUser.pointsBalance}
                </span>
                <span className="text-xl font-bold font-mono text-blue-200">PTS</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-xl">
              Poin reward ekowisata yang Anda kumpulkan dari penjelajahan titik budaya dan kuis edukasi. Tukarkan dengan voucher kuliner & cenderamata UMKM lokal.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/15">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-blue-200 block">Total Diperoleh</span>
                  <span className="text-sm font-extrabold font-mono">+{totalEarned} PTS</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-blue-200 block">Total Ditukarkan</span>
                  <span className="text-sm font-extrabold font-mono">-{totalSpent} PTS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Status Penjelajah & Action Widget */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-200 block font-bold">Status Penjelajah</span>
              <h4 className="font-black text-base text-white">Pelestari Budaya Aktif</h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                Anda telah berkontribusi mendukung ekonomi UMKM lokal minggu ini.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  const catalogSection = document.getElementById('katalog-reward');
                  catalogSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-3 px-4 bg-white hover:bg-blue-50 text-blue-600 font-extrabold rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md"
              >
                <Gift className="w-4 h-4" />
                <span>Tukarkan ke Hadiah</span>
              </button>

              <button
                type="button"
                onClick={() => store.navigateTo('/traveler/album')}
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider border border-white/20 transition flex items-center justify-center gap-2"
              >
                <span>Lihat Album Stempel</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. ATURAN PEROLEHAN POIN */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-neutral-900">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h3 className="font-extrabold text-base tracking-tight">Aturan Resmi Perolehan Jejak Points</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 font-mono font-bold text-xs">
              +5 Poin
            </span>
            <h4 className="font-bold text-xs text-neutral-900">Edukasi Etika Budaya</h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Menuntaskan membaca narasi sejarah & aturan etika adat di setiap Explore Point.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono font-bold text-xs">
              +10 Poin
            </span>
            <h4 className="font-bold text-xs text-neutral-900">Kuis Budaya Interaktif</h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Menjawab kuis edukatif dengan benar (berlaku 1x penuntasan per titik).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-mono font-bold text-xs">
              -20 s/d -80 Poin
            </span>
            <h4 className="font-bold text-xs text-neutral-900">Penukaran Voucher UMKM</h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Klaim potongan harga kuliner khas & kerajinan lokal warga desa setempat.
            </p>
          </div>
        </div>
      </div>

      {/* 3. KATALOG HADIAH & VOUCHER UMKM */}
      <div id="katalog-reward" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600">Katalog Reward</span>
            <h2 className="text-2xl font-black tracking-tight text-neutral-900">Tukarkan Poin di UMKM Mitra</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.length > 0 ? (
            rewards.map((rw) => {
              const canAfford = currentUser.pointsBalance >= rw.pointsCost;
              const isJustClaimed = claimedRewardId === rw.id;

              return (
                <div 
                  key={rw.id}
                  className="bg-white rounded-3xl border border-neutral-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        VOUCHER UMKM
                      </span>
                      <span className="text-xs font-mono font-black text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-full">
                        {rw.pointsCost} PTS
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-neutral-900 leading-snug">
                      {rw.title}
                    </h3>

                    <p className="text-neutral-500 text-xs line-clamp-2 leading-relaxed">
                      {rw.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                      <Store className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{rw.merchantName || 'Mitra Warga Desa'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleClaim(rw.id, rw.pointsCost)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isJustClaimed
                          ? 'bg-emerald-600 text-white'
                          : canAfford
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                          : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                      }`}
                    >
                      {isJustClaimed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Klaim Sukses!</span>
                        </>
                      ) : (
                        <>
                          <span>{canAfford ? 'Tukarkan' : 'Poin Kurang'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white p-8 rounded-3xl border border-neutral-200 text-center text-neutral-500 text-xs">
              Belum ada katalog hadiah aktif untuk destinasi saat ini.
            </div>
          )}
        </div>
      </div>

      {/* 4. RIWAYAT TRANSAKSI POIN (LEDGER TABLE) */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base text-neutral-900">Riwayat Transaksi Poin (Ledger)</h3>
          </div>
          <span className="text-xs font-mono text-neutral-400 font-semibold">{displayTransactions.length} entri</span>
        </div>

        <div className="divide-y divide-neutral-100">
          {displayTransactions.map((tx) => {
            const isEarn = tx.type === 'EARN' || tx.amount > 0;

            return (
              <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-neutral-50/80 transition">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    isEarn ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {isEarn ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900">{tx.description}</p>
                    <span className="text-[11px] font-mono text-neutral-400">{tx.createdAt}</span>
                  </div>
                </div>

                <span className={`text-sm font-black font-mono ${
                  isEarn ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {isEarn ? `+${tx.amount}` : `-${Math.abs(tx.amount)}`} PTS
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default PointsLedgerView;
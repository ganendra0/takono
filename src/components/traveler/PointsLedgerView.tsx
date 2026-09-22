import React from 'react';
import { useTakonoStore } from '../../services/store';
import { Coins, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Award, HelpCircle, ArrowRight } from 'lucide-react';

export const PointsLedgerView: React.FC = () => {
  const { currentUser, getTravelerTransactions, navigateTo } = useTakonoStore();
  const transactions = getTravelerTransactions(currentUser.id);

  const totalEarned = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const totalRedeemed = Math.abs(
    transactions
      .filter((t) => t.amount < 0)
      .reduce((acc, t) => acc + t.amount, 0)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans text-neutral-900 antialiased">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-blue-600">
            <Coins className="w-4 h-4" /> Buku Besar Jejak Points
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
            Dompet & Riwayat Poin
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl">
            Transparansi perolehan dan penukaran poin reward budaya Anda dari setiap titik jelajah dan kuis edukasi.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('/traveler/rewards')}
          className="px-6 py-3.5 bg-neutral-900 hover:bg-blue-600 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-2 self-start md:self-auto shrink-0"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Tukarkan ke Hadiah</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Balance & Stats Grid (Clean Editorial Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Balance Card */}
        <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-neutral-200 shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              Saldo Poin Aktif
            </span>
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-neutral-900">
                {currentUser.pointsBalance}
              </span>
              <span className="text-sm font-bold text-blue-600 font-mono">PTS</span>
            </div>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed border-t border-neutral-100 pt-4">
            Poin ini dapat digunakan langsung untuk mendapatkan potongan harga di warung dan UMKM mitra lokal di sekitar destinasi.
          </p>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">Diperoleh</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-600">
                +{totalEarned}
              </span>
              <span className="text-[11px] text-neutral-400 block mt-0.5">Total akumulasi masuk</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">Ditukarkan</span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black font-mono text-rose-600">
                -{totalRedeemed}
              </span>
              <span className="text-[11px] text-neutral-400 block mt-0.5">Total voucher diklaim</span>
            </div>
          </div>
        </div>
      </div>

      {/* Point Earning Rules Guide */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Aturan Resmi Perolehan Jejak Points</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1.5">
            <span className="font-mono font-bold text-blue-600 text-sm block">+5 Poin</span>
            <p className="text-neutral-600">Menuntaskan membaca cerita & edukasi etika di Explore Point.</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1.5">
            <span className="font-mono font-bold text-blue-600 text-sm block">+10 Poin</span>
            <p className="text-neutral-600">Menjawab kuis budaya dengan benar (hanya 1x per titik).</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1.5">
            <span className="font-mono font-bold text-amber-700 text-sm block">-20 s/d -80 Poin</span>
            <p className="text-neutral-600">Penukaran voucher kuliner & cinderamata UMKM lokal.</p>
          </div>
        </div>
      </div>

      {/* Transactions Ledger Table / List */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="px-6 sm:px-8 py-5 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="font-black text-neutral-900 text-sm tracking-tight">Riwayat Transaksi (Ledger)</h3>
          <span className="text-xs text-neutral-500 font-mono bg-neutral-100 px-3 py-1 rounded-xl">
            {transactions.length} entri tercatat
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-16 text-center text-neutral-400 text-xs font-mono">
            Belum ada transaksi poin yang tercatat dalam sistem.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {transactions.map((tx) => {
              const isEarn = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  className="px-6 sm:px-8 py-4.5 flex items-center justify-between gap-4 hover:bg-neutral-50/80 transition text-xs"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 border ${
                        isEarn 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                          : 'bg-rose-50 border-rose-200 text-rose-600'
                      }`}
                    >
                      {isEarn ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-neutral-900 text-sm leading-tight">{tx.description}</h4>
                      <div className="flex items-center gap-2.5 text-[11px] text-neutral-500">
                        <span className="uppercase font-mono font-bold tracking-wider text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 border border-neutral-200">
                          {tx.type}
                        </span>
                        <span>•</span>
                        <span className="font-mono">
                          {(() => {
                            try {
                              return new Date(tx.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
                            } catch {
                              return new Date(tx.createdAt).toLocaleString('id-ID');
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-base font-black font-mono ${
                        isEarn ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isEarn ? `+${tx.amount}` : tx.amount}
                    </span>
                    <span className="block text-[11px] text-neutral-400 font-mono mt-0.5">
                      Saldo: {tx.balanceAfter}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
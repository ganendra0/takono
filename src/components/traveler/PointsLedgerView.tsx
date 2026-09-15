import React from 'react';
import { useTakonoStore } from '../../services/store';
import { Coins, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, ShieldAlert, Award, HelpCircle } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header & Balance Card */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100 flex items-center gap-1.5">
              <Coins className="w-4 h-4" /> Buku Besar Jejak Points
            </span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-mono">
                {currentUser.pointsBalance}
              </h1>
              <span className="text-sm font-semibold text-amber-100">Poin Aktif</span>
            </div>
            <p className="text-xs text-amber-100/90 max-w-md">
              Poin reward budaya yang Anda kumpulkan dengan menuntaskan titik jelajah dan kuis edukasi.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('/traveler/rewards')}
            className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition shadow-sm shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Tukarkan ke Hadiah</span>
          </button>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-amber-400/40 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400/30 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-amber-100 text-[11px] block">Total Poin Diperoleh</span>
              <span className="font-bold text-sm font-mono text-white">+{totalEarned}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400/30 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-amber-100 text-[11px] block">Total Poin Ditukarkan</span>
              <span className="font-bold text-sm font-mono text-white">-{totalRedeemed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Point Earning Rules Guide (Section 14) */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Aturan Resmi Perolehan Jejak Points:</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <strong className="text-slate-900 block font-semibold">+5 Poin</strong>
            <span>Menuntaskan membaca cerita & edukasi etika di Explore Point.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <strong className="text-slate-900 block font-semibold">+10 Poin</strong>
            <span>Menjawab kuis budaya dengan benar (hanya 1x per titik).</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <strong className="text-slate-900 block font-semibold">-20 s/d -80 Poin</strong>
            <span>Penukaran voucher kuliner & cinderamata UMKM lokal.</span>
          </div>
        </div>
      </div>

      {/* Transactions Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Riwayat Transaksi Poin (Ledger)</h3>
          <span className="text-xs text-slate-500 font-mono">{transactions.length} entri</span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Belum ada transaksi poin yang tercatat.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => {
              const isEarn = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isEarn ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {isEarn ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 leading-tight">{tx.description}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span className="uppercase font-bold tracking-wider text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                          {tx.type}
                        </span>
                        <span>•</span>
                        <span>
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
                      className={`text-sm font-bold font-mono ${
                        isEarn ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isEarn ? `+${tx.amount}` : tx.amount}
                    </span>
                    <span className="block text-[11px] text-slate-400 font-mono">
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

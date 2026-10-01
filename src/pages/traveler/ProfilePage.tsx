import {copyText} from '../../lib/clipboard';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { ApiClient } from '../../lib/api.js';
import { PointTransaction, RewardRedemption } from '../../types/index.js';
import { 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Ticket, 
  Copy, 
  Check, 
  LogOut
} from 'lucide-react';

export const ProfilePage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { user, pointsBalance, logout } = useAuth();
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const [ptRes, albRes] = await Promise.all([
        ApiClient.getMyPoints(),
        ApiClient.getMyAlbum(false)
      ]);

      if (ptRes.success && ptRes.data) {
        setTransactions(ptRes.data.transactions || []);
      }

      if (albRes.success && albRes.data) {
        setRedemptions(albRes.data.redemptions || []);
      }
      if(!ptRes.success) setError(ptRes.message || 'Gagal memuat transaksi.');
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  const handleCopy = async (code: string) => {
    const copied=await copyText(code);
    if(copied)setCopiedCode(code);else setError('Salin kode voucher secara manual.');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 pb-16">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Akun traveler</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Profil saya</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Informasi akun, voucher, dan aktivitas poin perjalananmu.</p>
      </header>
      {isLoading && <p>Memuat profil…</p>}{error && <p role="alert" className="text-rose-700">{error}</p>}
      
      <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-6">
      {/* Profile Card */}
      <section className="flex h-full items-start gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:gap-6 sm:p-7">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-sm sm:h-20 sm:w-20">
          {user?.name.charAt(0) || 'U'}
        </div>

        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              {user?.name}
            </h2>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
              Traveler
            </span>
          </div>
          <p className="truncate text-sm text-slate-500">{user?.email}</p>
          <div className="mt-1 text-xs text-slate-400">
            Bergabung sejak {user && new Date(user.createdAt).toLocaleDateString('id-ID')}
          </div>
        </div>
      </section>

      {/* Points Ledger Summary Card */}
      <section className="grid h-full gap-6 rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-700 to-blue-600 p-6 text-white shadow-sm sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,0.8fr)] lg:items-end">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
            Jejak Points kamu
          </span>
          <div className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {pointsBalance} <span className="text-sm font-sans font-normal text-blue-200">Points Aktif</span>
          </div>
        </div>
        <p className="max-w-sm text-sm leading-6 text-blue-100 lg:text-right">
          Gunakan poin dari perjalananmu untuk menukar reward yang tersedia.
        </p>
      </section>
      </div>

      {/* Active Vouchers Wallet */}
      <div className="grid gap-8 lg:grid-cols-2">
      <section className="min-w-0 space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-950">
          <Ticket className="w-4 h-4 text-blue-600" />
          <span>Dompet Voucher Saya ({redemptions.length})</span>
        </h3>

        {redemptions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-sm text-slate-500">
            Belum ada kupon reward yang ditukarkan.
          </div>
        ) : (
          <div className="space-y-2">
            {redemptions.map(r => (
              <div 
                key={r.id} 
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-slate-900">{r.rewardTitle || r.rewardName}</div>
                  <div className="mt-1 text-xs font-mono font-semibold text-blue-700">{r.voucherCode || r.redemptionCode}</div>
                  <div className="mt-1 text-xs text-slate-400">Berlaku s/d: {r.expiresAt?.substring(0,10) || 'Lihat ketentuan voucher'}</div>
                </div>

                <button
                  onClick={() => handleCopy(r.voucherCode || r.redemptionCode)}
                  className="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  {copiedCode === (r.voucherCode || r.redemptionCode) ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                      <span>Disalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Points Transactions Ledger History */}
      <section className="min-w-0 space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-950">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Riwayat Mutasi Poin</span>
        </h3>

        {transactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-sm text-slate-500">
            Belum ada transaksi poin tercatat.
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map(tx => {
              const isCredit = tx.type === 'credit';
              return (
                <div 
                  key={tx.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isCredit ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold leading-snug text-slate-900">
                        {tx.description}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Saldo: {tx.balanceAfter} Pts
                      </div>
                    </div>
                  </div>

                  <span className={`font-mono font-bold text-xs ${
                    isCredit ? 'text-blue-700' : 'text-rose-600'
                  }`}>
                    {isCredit ? `+${tx.amount}` : `-${tx.amount}`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
      </div>

      {/* Account Switcher / Logout */}
      <div className="flex justify-end border-t border-slate-200 pt-6">
        <button
          onClick={() => logout()}
          className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 sm:w-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Sesi</span>
        </button>
      </div>

    </div>
  );
};

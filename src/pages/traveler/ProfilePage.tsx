import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { ApiClient } from '../../lib/api.js';
import { PointTransaction, RewardRedemption } from '../../types/index.js';
import { 
  User, 
  Sparkles, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Ticket, 
  Copy, 
  Check, 
  LogOut,
  Shield,
  HelpCircle,
  ChevronRight
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
        ApiClient.getMyAlbum()
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

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {isLoading && <p>Memuat profil…</p>}{error && <p role="alert" className="text-rose-700">{error}</p>}
      
      {/* Profile Card */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
          {user?.name.charAt(0) || 'U'}
        </div>

        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-extrabold text-slate-900 truncate">
              {user?.name}
            </h2>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold">
              Traveler
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          <div className="text-[11px] text-slate-400">
            Bergabung sejak {user && new Date(user.createdAt).toLocaleDateString('id-ID')}
          </div>
        </div>
      </div>

      {/* Points Ledger Summary Card */}
      <div className="p-5 bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-3xl space-y-3 shadow-md">
        <span className="text-[11px] font-medium text-blue-200 block uppercase tracking-wider">
          Buku Kas Jejak Points
        </span>
        <div className="text-3xl font-mono font-extrabold text-white">
          {pointsBalance} <span className="text-sm font-sans font-normal text-blue-200">Points Aktif</span>
        </div>
        <p className="text-xs text-blue-100">
          Sistem poin berbasis buku kas transaksi (immutable ledger) dengan pemeriksaan idempotensi ganda.
        </p>
      </div>

      {/* Active Vouchers Wallet */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Ticket className="w-4 h-4 text-blue-600" />
          <span>Dompet Voucher Saya ({redemptions.length})</span>
        </h3>

        {redemptions.length === 0 ? (
          <div className="p-4 bg-white rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
            Belum ada kupon reward yang ditukarkan.
          </div>
        ) : (
          <div className="space-y-2">
            {redemptions.map(r => (
              <div 
                key={r.id} 
                className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-900">{r.rewardTitle || r.rewardName}</div>
                  <div className="text-[11px] font-mono text-blue-600 font-semibold">{r.voucherCode || r.redemptionCode}</div>
                  <div className="text-[10px] text-slate-400">Berlaku s/d: {r.expiresAt?.substring(0,10) || 'Lihat ketentuan voucher'}</div>
                </div>

                <button
                  onClick={() => handleCopy(r.voucherCode || r.redemptionCode)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedCode === (r.voucherCode || r.redemptionCode) ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
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
      </div>

      {/* Points Transactions Ledger History */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Riwayat Mutasi Poin</span>
        </h3>

        {transactions.length === 0 ? (
          <div className="p-4 bg-white rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
            Belum ada transaksi poin tercatat.
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map(tx => {
              const isCredit = tx.type === 'credit';
              return (
                <div 
                  key={tx.id}
                  className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isCredit ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 leading-snug">
                        {tx.description}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Saldo: {tx.balanceAfter} Pts
                      </div>
                    </div>
                  </div>

                  <span className={`font-mono font-bold text-xs ${
                    isCredit ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {isCredit ? `+${tx.amount}` : `-${tx.amount}`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Account Switcher / Logout */}
      <div className="pt-4 border-t border-slate-200 space-y-2">
        <button
          onClick={() => logout()}
          className="w-full py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Sesi</span>
        </button>
      </div>

    </div>
  );
};

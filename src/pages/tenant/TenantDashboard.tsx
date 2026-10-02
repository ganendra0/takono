import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock3, QrCode, ScanLine, Ticket, XCircle } from 'lucide-react';
import { ApiClient } from '../../lib/api';
import { Empty, Notice, PageHeading } from '../../components/Workspace';

type TenantData = { tenant: { name: string; email: string }; rewards: any[]; redemptions: any[] };

export function TenantDashboard({ onOpenVoucherScanner, scannedCode, onScannedCodeHandled }: {
  onOpenVoucherScanner: () => void;
  scannedCode?: string | null;
  onScannedCodeHandled?: () => void;
}) {
  const [data, setData] = useState<TenantData | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<any>(null);

  const load = async () => {
    const result = await ApiClient.getTenantDashboard();
    if (result.success && result.data) setData(result.data);
    else setError(result.message || 'Data portal tenant tidak dapat dimuat.');
  };

  useEffect(() => { load(); }, []);

  const validate = async (value: string) => {
    const voucherCode = value.trim();
    if (!voucherCode || busy) return;
    setBusy(true); setError(''); setSuccess(null);
    const result = await ApiClient.validateTenantVoucher(voucherCode);
    setBusy(false);
    if (result.success && result.data) {
      setSuccess(result.data.redemption);
      setCode('');
      await load();
    } else setError(result.message || 'Voucher tidak dapat divalidasi.');
  };

  useEffect(() => {
    if (!scannedCode) return;
    validate(scannedCode).finally(onScannedCodeHandled);
  }, [scannedCode]);

  const activeCount = data?.redemptions.filter(item => item.status === 'active').length || 0;
  return <main className="workspace space-y-7 py-7 sm:py-9">
    <PageHeading title="Portal Tenant" description="Pindai QR voucher pelanggan untuk memverifikasi penukaran di tempat Anda." action={<button className="primary-button" onClick={onOpenVoucherScanner}><ScanLine size={17} />Pindai voucher</button>} />

    <section className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
      <div className="rounded-2xl border border-blue-100 bg-blue-700 p-6 text-white sm:p-7">
        <div className="flex items-start justify-between gap-5"><div><p className="text-sm font-medium text-blue-100">Validasi penukaran</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Scan QR dari voucher traveler</h2><p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">Satu voucher hanya bisa dipakai sekali. Sistem langsung memeriksa status, masa berlaku, dan tenant penerimanya.</p></div><QrCode className="hidden shrink-0 sm:block" size={42} strokeWidth={1.5} /></div>
        <button className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-50" onClick={onOpenVoucherScanner}><ScanLine size={17} />Buka kamera pemindai</button>
      </div>
      <form className="rounded-2xl border border-slate-200 bg-white p-6" onSubmit={event => { event.preventDefault(); validate(code); }}>
        <p className="text-sm font-semibold text-slate-900">Masukkan kode voucher</p><p className="mt-1 text-xs leading-5 text-slate-500">Gunakan bila kamera perangkat belum tersedia.</p>
        <input value={code} onChange={event => setCode(event.target.value)} className="field mt-4 font-mono text-sm" placeholder="TAKONO-XXXX" aria-label="Kode voucher" />
        <button disabled={busy || !code.trim()} className="primary-button mt-3 w-full justify-center disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Memvalidasi…' : 'Validasi voucher'}</button>
      </form>
    </section>

    {error && <Notice error>{error}</Notice>}
    {success && <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950"><div className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" /><div><h2 className="font-semibold">Voucher berhasil digunakan</h2><p className="mt-1 text-sm">{success.reward?.name} · milik {success.user?.name}. Penukaran sudah tercatat dan QR ini tidak dapat digunakan kembali.</p></div></div></section>}

    <section className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
      <div className="rounded-2xl border border-slate-200 bg-white"><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold">Reward di tenant Anda</h2><p className="mt-1 text-xs text-slate-500">{data?.rewards.length || 0} reward terhubung</p></div>{!data ? <p className="p-5 text-sm text-slate-500">Memuat reward…</p> : !data.rewards.length ? <Empty title="Belum ada reward ditugaskan" description="Minta pengelola destinasi menghubungkan reward ke akun tenant ini." /> : <div className="divide-y divide-slate-100">{data.rewards.map(reward => <div key={reward.id} className="px-5 py-4"><p className="font-medium text-slate-900">{reward.name}</p><p className="mt-1 text-xs text-slate-500">{reward.partner || 'Tenant TAKONO'} · {reward.pointsRequirement} poin</p></div>)}</div>}</div>
      <div className="rounded-2xl border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-semibold">Riwayat voucher</h2><p className="mt-1 text-xs text-slate-500">{activeCount} voucher menunggu penukaran</p></div><Ticket size={20} className="text-blue-600" /></div>{!data ? <p className="p-5 text-sm text-slate-500">Memuat riwayat…</p> : !data.redemptions.length ? <Empty title="Belum ada voucher" description="Voucher traveler yang terkait dengan tenant Anda akan muncul di sini." /> : <div className="divide-y divide-slate-100">{data.redemptions.map(redemption => <article key={redemption.id} className="flex items-center justify-between gap-4 px-5 py-4"><div className="min-w-0"><p className="font-medium text-slate-900">{redemption.reward?.name}</p><p className="mt-1 text-xs text-slate-500">{redemption.user?.name} · {redemption.redemptionCode}</p></div>{redemption.status === 'used' ? <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-slate-500"><CheckCircle2 size={15} className="text-emerald-600" />Digunakan</span> : redemption.status === 'active' ? <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-amber-700"><Clock3 size={15} />Aktif</span> : <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-rose-700"><XCircle size={15} />Tidak aktif</span>}</article>)}</div>}</div>
    </section>
  </main>;
}

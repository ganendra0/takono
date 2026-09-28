import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Compass, Eye, EyeOff, MapPin, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TakonoLogo } from '../../components/TakonoLogo';
import { GoogleSignIn } from '../../components/GoogleSignIn';
import { ApiClient } from '../../lib/api';
import { Destination } from '../../types';

export function AuthPage({ onNavigate, returnTo = '/app' }: { onNavigate: (path: string) => void; returnTo?: string }) {
  const { login, register, loginGoogle } = useAuth();
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const [googleKey, setGoogleKey] = useState(0);
  const [destination, setDestination] = useState<Destination | null>(null);
  useEffect(() => { ApiClient.getDestinations().then(result => { if (result.success) setDestination(result.data?.[0] || null); }); }, []);
  const finish = (role?: string) => {
    const roleHome = ({ destination_manager: '/manager', government: '/government', super_admin: '/admin' } as Record<string, string>)[role || ''];
    onNavigate(roleHome || returnTo);
  };
  return <main className="min-h-screen bg-white font-sans">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
      <button aria-label="Beranda TAKONO" onClick={() => onNavigate('/')}><TakonoLogo size="sm" /></button>
      <button className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-blue-700" onClick={() => onNavigate('/')}><ArrowLeft size={15} />Kembali ke beranda</button>
    </div>
    <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-12 pt-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20 lg:py-10">
      <aside className="relative hidden min-h-[650px] overflow-hidden rounded-2xl bg-[#102542] lg:flex lg:flex-col lg:justify-end">
        {destination?.heroImage && <img src={destination.heroImage} alt={destination.name} className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#102542] via-[#102542]/30 to-transparent" />
        <div className="relative p-10 text-white"><Compass size={30} strokeWidth={1.5} /><h2 className="mt-6 text-4xl font-medium leading-tight tracking-tight">Tempat baru.<br />Cerita berikutnya.</h2><p className="mt-5 max-w-sm text-sm leading-7 text-slate-200">Simpan jejak perjalanan, temukan cerita di setiap titik, dan nikmati pengalaman lokal bersama TAKONO.</p>{destination && <p className="mt-8 flex items-center gap-2 border-t border-white/20 pt-5 text-xs text-white/80"><MapPin size={15} />{destination.name} · {destination.city}</p>}</div>
      </aside>
      <section className="mx-auto w-full max-w-[400px]">
        <p className="mb-3 text-xs font-semibold tracking-wide text-blue-700">{creating ? 'MULAI PERJALANANMU' : 'SELAMAT DATANG KEMBALI'}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{creating ? 'Buat akun TAKONO' : 'Masuk ke TAKONO'}</h1>
        <p className="mb-7 mt-3 text-sm leading-6 text-slate-500">{creating ? 'Satu akun untuk cerita dan pengalaman yang kamu temukan.' : 'Lanjutkan perjalananmu atau kelola destinasi dari satu akun.'}</p>
        <GoogleSignIn key={googleKey} disabled={busy} onCredential={async (credential, nonce) => { setBusy(true); setError(''); try { const result = await loginGoogle(credential, nonce); if (result.success) finish(result.role); else { setError(result.message || 'Login Google gagal.'); setGoogleKey(key => key + 1); } } finally { setBusy(false); } }} />
        <div className="my-6 flex items-center gap-4 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />atau dengan email<span className="h-px flex-1 bg-slate-200" /></div>
        <form className="space-y-5" onSubmit={async event => { event.preventDefault(); if (busy) return; setBusy(true); setError(''); const fields = new FormData(event.currentTarget); try { const result = creating ? await register(String(fields.get('name')), String(fields.get('email')), String(fields.get('password'))) : await login(String(fields.get('email')), String(fields.get('password'))); if (result.success) finish(result.role); else setError(result.message || 'Tidak dapat masuk. Coba kembali.'); } finally { setBusy(false); } }}>
          {creating && <label className="block text-sm font-medium text-slate-700">Nama lengkap<input name="name" required maxLength={160} className="auth-input" autoComplete="name" placeholder="Nama kamu" disabled={busy} /></label>}
          <label className="block text-sm font-medium text-slate-700">Email<input name="email" required type="email" className="auth-input" autoComplete="email" placeholder="nama@email.com" disabled={busy} /></label>
          <label className="block text-sm font-medium text-slate-700">Password<span className="relative mt-2 block"><input name="password" required type={visible ? 'text' : 'password'} minLength={creating ? 10 : 1} className="auth-input !mt-0 !pr-12" autoComplete={creating ? 'new-password' : 'current-password'} placeholder={creating ? 'Minimal 10 karakter' : 'Masukkan password'} disabled={busy} /><button type="button" aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'} aria-pressed={visible} className="absolute inset-y-0 right-0 px-4 text-slate-400 hover:text-blue-700" onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
          {error && <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">{error}</p>}
          <button disabled={busy} className="welcome-primary min-h-12 w-full disabled:opacity-50">{busy ? 'Memproses…' : creating ? 'Buat akun' : 'Masuk'}{!busy && <ArrowRight size={17} />}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">{creating ? 'Sudah punya akun?' : 'Belum punya akun?'} <button disabled={busy} onClick={() => { setCreating(!creating); setError(''); setVisible(false); }} className="font-semibold text-blue-700 hover:underline">{creating ? 'Masuk' : 'Daftar sekarang'}</button></p>
        <p className="mt-8 flex items-start gap-2 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-400"><ShieldCheck size={16} className="mt-0.5 shrink-0" />Akun pengelola dan pemerintah disediakan oleh administrator TAKONO.</p>
      </section>
    </div>
  </main>;
}

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TakonoLogo } from '../../components/TakonoLogo';
export function AuthPage({ onNavigate, returnTo = '/app' }: {onNavigate:(path:string)=>void;returnTo?:string}) {
 const {login,register}=useAuth(); const [creating,setCreating]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 return <main className="w-[calc(100%_-_2rem)] max-w-md mx-auto my-6 sm:my-16 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 space-y-5 shadow-xl shadow-slate-200/40">
 <TakonoLogo size="lg"/><p className="text-sm text-slate-500 leading-relaxed">Satu akun untuk menjelajah, mengumpulkan Jejak Points, dan menemukan cerita baru.</p>
 <h1 className="text-2xl font-bold text-slate-900">{creating?'Daftar penjelajah':'Masuk TAKONO'}</h1>
 <form className="space-y-4" onSubmit={async e=>{e.preventDefault();setBusy(true);setError('');const f=new FormData(e.currentTarget);const r=creating?await register(String(f.get('name')),String(f.get('email')),String(f.get('password'))):await login(String(f.get('email')),String(f.get('password')));setBusy(false);if(r.success)onNavigate(returnTo==='/app'&&r.role&&r.role!=='traveler'?({destination_manager:'/manager',government:'/government',super_admin:'/admin'}[r.role]||returnTo):returnTo);else setError(r.message||'Gagal masuk.');}}>
 {creating&&<label className="block text-sm">Nama<input name="name" required maxLength={160} className="block w-full p-3 border rounded-xl" autoComplete="name"/></label>}
 <label className="block text-sm">Email<input name="email" required type="email" className="block w-full p-3 border rounded-xl" autoComplete="email"/></label>
 <label className="block text-sm">Password<input name="password" required type="password" minLength={creating?10:1} className="block w-full p-3 border rounded-xl" autoComplete={creating?'new-password':'current-password'}/></label>
 {error&&<p role="alert" className="text-rose-700 text-sm">{error}</p>}
 <button disabled={busy} className="w-full p-3 rounded-xl bg-blue-600 text-white disabled:opacity-50">{busy?'Memproses…':creating?'Daftar':'Masuk'}</button>
 {creating&&<p className="text-xs text-slate-500">Gunakan password minimal 10 karakter.</p>}
 </form><button disabled={busy} onClick={()=>{setCreating(!creating);setError('');}} className="text-sm text-blue-700 py-2">{creating?'Sudah punya akun? Masuk':'Belum punya akun? Daftar'}</button>
 <button onClick={()=>onNavigate('/')} className="block text-sm text-slate-500">Kembali ke beranda</button></main>;
}

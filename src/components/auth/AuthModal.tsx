import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { UserRole } from '../../types/roles';
import {
  X,
  Lock,
  Mail,
  User,
  Compass,
  MapPin,
  Building2,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  Sparkles,
  Eye,
  EyeOff,
  Server,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    dbStatus,
  } = useTakonoStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('traveler');
  const [extraField, setExtraField] = useState(''); // agencyName or umkmName
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Harap isi email dan kata sandi.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          setAuthModalOpen(false);
          setPassword('');
          setErrorMsg(null);
          setSuccessMsg(null);
        }, 800);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name || !email || !password) {
      setErrorMsg('Harap lengkapi semua bidang yang bertanda wajib.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Kata sandi minimal harus 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name,
        email,
        password,
        role,
        agencyName: role === 'government' ? extraField : undefined,
        umkmName: role === 'umkm' ? extraField : undefined,
      });

      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          setAuthModalOpen(false);
          setPassword('');
          setErrorMsg(null);
          setSuccessMsg(null);
        }, 1000);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mendaftar akun.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoRole: UserRole) => {
    setEmail(demoEmail);
    setPassword('takono123');
    setErrorMsg(null);
    setSuccessMsg(`Memilih akun demo ${demoRole.toUpperCase()}. Klik Masuk untuk melanjutkan.`);
  };

  const roleOptions: { role: UserRole; title: string; desc: string; icon: any; color: string }[] = [
    {
      role: 'traveler',
      title: 'Traveler (Wisatawan)',
      desc: 'Jelajahi destinasi, scan QR budaya, kuis, kumpulkan Jejak Points',
      icon: Compass,
      color: 'border-emerald-500 bg-emerald-50/50 text-emerald-800',
    },
    {
      role: 'manager',
      title: 'Pengelola Destinasi',
      desc: 'Kelola explore points, kuis, reward, event, dan pantau analitik',
      icon: MapPin,
      color: 'border-indigo-500 bg-indigo-50/50 text-indigo-800',
    },
    {
      role: 'umkm',
      title: 'Pelaku UMKM Mitra',
      desc: 'Katalog kuliner/kerajinan, kupon promo diskon, keterhubungan destinasi',
      icon: Building2,
      color: 'border-amber-500 bg-amber-50/50 text-amber-800',
    },
    {
      role: 'government',
      title: 'Dinas Pariwisata',
      desc: 'Laporan kebijakan pariwisata, tren kepatuhan adat, dampak ekonomi UMKM',
      icon: Landmark,
      color: 'border-blue-500 bg-blue-50/50 text-blue-800',
    },
    {
      role: 'admin',
      title: 'Super Administrator',
      desc: 'Verifikasi UMKM, moderasi destinasi, manajemen user dan sistem',
      icon: ShieldCheck,
      color: 'border-purple-500 bg-purple-50/50 text-purple-800',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-sm">
              T
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Autentikasi TAKONO</h3>
              <p className="text-[11px] text-slate-400">Express.js API + MySQL Database Persisten</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAuthModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector: Masuk vs Daftar */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition border-b-2 ${
              authModalMode === 'login'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Masuk (Login)
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition border-b-2 ${
              authModalMode === 'register'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Daftar Akun Baru
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {authModalMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Pengguna</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition shadow-sm disabled:opacity-50"
              >
                {loading ? 'Memverifikasi...' : 'Masuk ke Sistem'}
              </button>

              {/* Demo Accounts Quick Login */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Akun Demo Siap Pakai (Password: takono123)
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">1-Klik Isi</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-left">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('ganendradjawa@gmail.com', 'traveler')}
                    className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-xs text-slate-700 text-left transition"
                  >
                    <span className="font-semibold block text-emerald-800">Ganendra Djawa</span>
                    <span className="text-[10px] text-slate-500 block">Traveler (+85 Pts)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('wayan.sudirga@penglipuran.desa.id', 'manager')}
                    className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-xs text-slate-700 text-left transition"
                  >
                    <span className="font-semibold block text-indigo-800">Wayan Sudirga</span>
                    <span className="text-[10px] text-slate-500 block">Manager Penglipuran</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('loloh.cemcem.made@gmail.com', 'umkm')}
                    className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-xs text-slate-700 text-left transition"
                  >
                    <span className="font-semibold block text-amber-800">Ni Wayan Rai</span>
                    <span className="text-[10px] text-slate-500 block">UMKM Kuliner Bali</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('pariwisata.provinsi@bali.go.id', 'government')}
                    className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-xs text-slate-700 text-left transition"
                  >
                    <span className="font-semibold block text-blue-800">Dr. I Ketut Widana</span>
                    <span className="text-[10px] text-slate-500 block">Dinas Pariwisata</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('admin@takono.id', 'admin')}
                    className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-300 text-xs text-slate-700 text-left transition sm:col-span-2"
                  >
                    <span className="font-semibold block text-purple-800">Super Administrator</span>
                    <span className="text-[10px] text-slate-500 block">admin@takono.id — Akses Penuh Sistem</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Pratama"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Aktif *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@domain.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi (Minimal 6 karakter) *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pilih Peran Akun *</label>
                <div className="space-y-2">
                  {roleOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = role === opt.role;
                    return (
                      <button
                        key={opt.role}
                        type="button"
                        onClick={() => setRole(opt.role)}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-start gap-3 transition ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-slate-900">{opt.title}</span>
                            {opt.role === 'traveler' && (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                +50 Poin Bonus
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Conditional extra fields */}
              {role === 'umkm' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Usaha / Merk UMKM</label>
                  <input
                    type="text"
                    value={extraField}
                    onChange={(e) => setExtraField(e.target.value)}
                    placeholder="Contoh: Kopi Luwak Desa Penglipuran"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              )}

              {role === 'government' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lembaga / Dinas Pemerintahan</label>
                  <input
                    type="text"
                    value={extraField}
                    onChange={(e) => setExtraField(e.target.value)}
                    placeholder="Contoh: Dinas Kebudayaan & Pariwisata Kab. Bangli"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition shadow-sm disabled:opacity-50"
              >
                {loading ? 'Mendaftarkan Akun...' : 'Daftar Akun Baru'}
              </button>
            </form>
          )}
        </div>

        {/* Database & Backend Connectivity Status Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-[11px] text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                dbStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="font-semibold text-slate-800">
              {dbStatus?.connected ? 'MySQL Live Connected' : 'Express Server Fallback'}
            </span>
            <span className="text-slate-400">|</span>
            <span className="font-mono text-slate-500">
              {dbStatus?.databaseName || 'takono_db'}@{dbStatus?.host || 'localhost'}:{dbStatus?.port || 3307}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 hidden sm:inline">
            Bcrypt + JWT Auth Active
          </span>
        </div>
      </div>
    </div>
  );
};

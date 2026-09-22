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
  Eye,
  EyeOff,
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
      color: 'border-emerald-600 bg-emerald-50/50 text-emerald-900',
    },
    {
      role: 'manager',
      title: 'Pengelola Destinasi',
      desc: 'Kelola explore points, kuis, reward, event, dan pantau analitik',
      icon: MapPin,
      color: 'border-emerald-600 bg-emerald-50/50 text-emerald-900',
    },
    {
      role: 'umkm',
      title: 'Pelaku UMKM Mitra',
      desc: 'Katalog kuliner/kerajinan, kupon promo diskon, keterhubungan destinasi',
      icon: Building2,
      color: 'border-amber-600 bg-amber-50/50 text-amber-900',
    },
    {
      role: 'government',
      title: 'Dinas Pariwisata',
      desc: 'Laporan kebijakan pariwisata, tren kepatuhan adat, dampak ekonomi UMKM',
      icon: Landmark,
      color: 'border-sky-600 bg-sky-50/50 text-sky-900',
    },
    {
      role: 'admin',
      title: 'Super Administrator',
      desc: 'Verifikasi UMKM, moderasi destinasi, manajemen user dan sistem',
      icon: ShieldCheck,
      color: 'border-stone-700 bg-stone-100 text-stone-900',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#1C2520] px-6 py-4 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-black text-sm">
              T
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Autentikasi Akun TAKONO</h3>
              <p className="text-[11px] text-stone-400 font-mono">Platform Pariwisata & Ekosistem Budaya</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAuthModalOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector: Masuk vs Daftar */}
        <div className="flex border-b border-stone-200 bg-stone-50">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition border-b-2 cursor-pointer ${
              authModalMode === 'login'
                ? 'border-emerald-700 text-emerald-950 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
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
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition border-b-2 cursor-pointer ${
              authModalMode === 'register'
                ? 'border-emerald-700 text-emerald-950 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Daftar Akun Baru
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {authModalMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Pengguna</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700 bg-stone-50 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Kata Sandi</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700 bg-stone-50 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
              >
                {loading ? 'Memproses Masuk...' : 'Masuk ke Platform'}
              </button>

              {/* Quick Demo Selector */}
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Pilih Cepat Akun Uji Coba:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('wayan.traveler@example.com', 'traveler')}
                    className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left font-semibold text-stone-700 cursor-pointer"
                  >
                    Wayan (Traveler)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('ketut.penglipuran@example.com', 'manager')}
                    className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left font-semibold text-stone-700 cursor-pointer"
                  >
                    Ketut (Manager)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('made.loloh@example.com', 'umkm')}
                    className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left font-semibold text-stone-700 cursor-pointer"
                  >
                    Bu Made (UMKM)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('dinas.pariwisata@example.com', 'government')}
                    className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left font-semibold text-stone-700 cursor-pointer"
                  >
                    Dinas Pariwisata
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('superadmin@takono.id', 'admin')}
                    className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left font-semibold text-stone-700 cursor-pointer"
                  >
                    Super Admin
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nama Lengkap / Instansi *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Lengkap Anda"
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700 bg-stone-50 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Aktif *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700 bg-stone-50 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Pilih Peran Akun *</label>
                <div className="space-y-2">
                  {roleOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = role === opt.role;
                    return (
                      <div
                        key={opt.role}
                        onClick={() => setRole(opt.role)}
                        className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-50/60 ring-1 ring-emerald-700'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${isSelected ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-700'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-stone-900">{opt.title}</h4>
                          <p className="text-[11px] text-stone-500 font-normal leading-tight">{opt.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Kata Sandi (Min. 6 Karakter) *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700 bg-stone-50 focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
              >
                {loading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

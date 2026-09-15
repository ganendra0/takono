import React from 'react';
import { useTakonoStore } from '../../services/store';
import { UserRole } from '../../types/roles';
import {
  Compass,
  MapPin,
  Building2,
  Landmark,
  ShieldCheck,
  QrCode,
  Coins,
  ChevronDown,
  Sparkles,
  BookOpen,
  Award,
  ShoppingBag,
  BarChart3,
  Calendar,
  Database,
  LogIn,
  UserPlus,
  LogOut,
} from 'lucide-react';

export const AppHeader: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    activeRoute,
    navigateTo,
    setQrModalOpen,
    activeJourney,
    destinations,
    dbStatus,
    setAuthModalOpen,
    setAuthModalMode,
    authToken,
    logout,
  } = useTakonoStore();

  const roleConfigs: Record<
    UserRole,
    { label: string; icon: React.FC<{ className?: string }>; color: string }
  > = {
    traveler: { label: 'Traveler', icon: Compass, color: 'bg-emerald-500' },
    manager: { label: 'Destination Manager', icon: MapPin, color: 'bg-indigo-500' },
    umkm: { label: 'UMKM Mitra', icon: Building2, color: 'bg-amber-500' },
    government: { label: 'Government Intelligence', icon: Landmark, color: 'bg-blue-500' },
    admin: { label: 'Super Admin', icon: ShieldCheck, color: 'bg-purple-500' },
  };

  const currentRoleConfig = roleConfigs[currentUser.role];

  // Traveler sub-navigation items
  const travelerNavItems = [
    { label: 'Beranda', route: '/traveler/home', icon: Compass },
    { label: 'Rute & Panduan Cerdas', route: '/traveler/smart-guide', icon: Sparkles },
    { label: 'Tukar Poin & Hadiah', route: '/traveler/points', icon: Coins },
    { label: 'Album Stempel', route: '/traveler/album', icon: BookOpen },
  ];

  // Manager sub-navigation items
  const managerNavItems = [
    { label: 'Dashboard', route: '/manager/dashboard', icon: BarChart3 },
    { label: 'Kelola Destinasi', route: '/manager/destinations', icon: MapPin },
    { label: 'Explore Points', route: '/manager/explore-points', icon: Compass },
    { label: 'Kuis Budaya', route: '/manager/quizzes', icon: BookOpen },
    { label: 'Katalog Reward', route: '/manager/rewards', icon: Award },
    { label: 'Event & Festival', route: '/manager/events', icon: Calendar },
    { label: 'Generator QR', route: '/manager/qr-codes', icon: QrCode },
    { label: 'Analytics Pengunjung', route: '/manager/analytics', icon: BarChart3 },
  ];

  // UMKM sub-navigation items
  const umkmNavItems = [
    { label: 'Dashboard UMKM', route: '/umkm/dashboard', icon: BarChart3 },
    { label: 'Profil Usaha', route: '/umkm/profile', icon: Building2 },
    { label: 'Katalog Produk', route: '/umkm/products', icon: ShoppingBag },
    { label: 'Promosi Traveler', route: '/umkm/promotions', icon: Award },
  ];

  // Government sub-navigation items
  const govNavItems = [
    { label: 'Intelligence Overview', route: '/government/dashboard', icon: Landmark },
    { label: 'Tren Pariwisata', route: '/government/trends', icon: BarChart3 },
    { label: 'Kinerja Destinasi', route: '/government/performance', icon: MapPin },
    { label: 'Laporan Kebijakan', route: '/government/reports', icon: BookOpen },
  ];

  // Admin sub-navigation items
  const adminNavItems = [
    { label: 'Overview Platform', route: '/admin/dashboard', icon: ShieldCheck },
    { label: 'Verifikasi UMKM', route: '/admin/umkm-approval', icon: Building2 },
    { label: 'Moderasi Destinasi', route: '/admin/destinations', icon: MapPin },
    { label: 'Kelola Pengguna', route: '/admin/users', icon: ShieldCheck },
    { label: 'Pengaturan Sistem', route: '/admin/settings', icon: Landmark },
  ];

  const currentNavItems =
    currentUser.role === 'traveler'
      ? travelerNavItems
      : currentUser.role === 'manager'
      ? managerNavItems
      : currentUser.role === 'umkm'
      ? umkmNavItems
      : currentUser.role === 'government'
      ? govNavItems
      : adminNavItems;

  const currentActiveDest = activeJourney
    ? destinations.find((d) => d.id === activeJourney.destinationId)
    : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Bar: Role Switcher & User Profile */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (currentUser.role === 'traveler') navigateTo('/traveler/home');
                else navigateTo(`/${currentUser.role}/dashboard`);
              }}
              className="flex items-center gap-2 font-bold text-white tracking-wider hover:text-emerald-400 transition"
            >
              <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs shadow-sm">
                T
              </div>
              <span className="text-sm font-black tracking-tight text-white">TAKONO</span>
            </button>
            <span className="hidden sm:inline-block text-[11px] text-slate-400 border-l border-slate-700 pl-3">
              Tourism Experience & Ecosystem Platform
            </span>
          </div>

          {/* Active Role Switcher Selector & Auth Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Database & Backend Status Badge */}
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition"
              title="Klik untuk melihat status koneksi MySQL dan info endpoint"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  dbStatus?.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <Database className="w-3 h-3 text-slate-400" />
              <span className="font-mono font-medium">
                {dbStatus?.connected ? 'MySQL Live' : 'Express + MySQL'}
              </span>
            </button>

            {/* Login / Register Button */}
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('login');
                setAuthModalOpen(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white font-medium text-[11px] transition"
              title="Buka dialog Masuk / Daftar Akun"
            >
              <LogIn className="w-3 h-3" />
              <span>Masuk / Daftar</span>
            </button>

            <span className="text-[11px] text-slate-400 hidden md:inline ml-1">Peran:</span>
            <div className="inline-flex rounded-lg p-0.5 bg-slate-800 border border-slate-700">
              {(['traveler', 'manager', 'umkm', 'government', 'admin'] as UserRole[]).map((r) => {
                const isCurrent = currentUser.role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => switchUserRole(r)}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium transition ${
                      isCurrent
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {r === 'traveler'
                      ? 'Traveler'
                      : r === 'manager'
                      ? 'Manager'
                      : r === 'umkm'
                      ? 'UMKM'
                      : r === 'government'
                      ? 'Govt'
                      : 'Admin'}
                  </button>
                );
              })}
            </div>

            {/* Quick QR Scanner Simulator Button */}
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition shadow-sm"
              title="Buka QR Scanner TAKONO"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="font-semibold text-[11px]">Scan QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Role identity and Active Journey Banner */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-sm">{currentUser.name}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {currentRoleConfig.label}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {currentUser.agencyName ||
                  (currentUser.role === 'manager'
                    ? 'Pengelola Desa Wisata Penglipuran'
                    : currentUser.role === 'umkm'
                    ? 'Pemilik Warung Loloh Cemcem Bu Made'
                    : currentUser.email)}
              </p>
            </div>
          </div>

          {/* Active Traveler Journey Chip */}
          {currentUser.role === 'traveler' && currentActiveDest && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-emerald-900 font-medium">
                Aktif di <strong>{currentActiveDest.name}</strong>
              </span>
              <button
                type="button"
                onClick={() => navigateTo(`/traveler/smart-guide`)}
                className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-0.5"
              >
                <span>Smart Guide</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Points Balance for Traveler, or quick stats for other roles */}
        <div className="flex items-center gap-3">
          {currentUser.role === 'traveler' && (
            <button
              type="button"
              onClick={() => navigateTo('/traveler/points')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100/80 transition"
            >
              <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-sm">
                <Coins className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                  Jejak Points
                </span>
                <span className="text-sm font-bold text-amber-950 font-mono">
                  {currentUser.pointsBalance}
                </span>
              </div>
            </button>
          )}

          {currentUser.role === 'manager' && (
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-slate-400 block">Destinasi Kelolaan</span>
              <span className="text-xs font-semibold text-slate-800">Desa Wisata Penglipuran</span>
            </div>
          )}

          {currentUser.role === 'government' && (
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-slate-400 block">Cakupan Wilayah</span>
              <span className="text-xs font-semibold text-slate-800">Provinsi Bali & D.I. Yogyakarta</span>
            </div>
          )}

          {authToken && (
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 text-xs font-medium transition"
              title="Keluar dari akun saat ini"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-navigation Menu per Role */}
      <div className="border-t border-slate-100 bg-slate-50/70 px-4 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5">
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeRoute === item.route ||
              (item.route !== '/traveler/home' &&
                item.route !== '/manager/dashboard' &&
                activeRoute.startsWith(item.route));

            return (
              <button
                key={item.route}
                type="button"
                onClick={() => navigateTo(item.route)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'bg-white text-emerald-700 shadow-xs border border-slate-200 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

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
  Map,
  BookOpen,
  Award,
  ShoppingBag,
  BarChart3,
  Calendar,
  LogIn,
  LogOut,
  ChevronDown
} from 'lucide-react';

export const AppHeader: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    activeRoute,
    navigateTo,
    setQrModalOpen,
    setAuthModalOpen,
    setAuthModalMode,
    authToken,
    logout,
  } = useTakonoStore();

  const roleLabels: Record<UserRole, string> = {
    traveler: 'Traveler',
    manager: 'Manager',
    umkm: 'UMKM',
    government: 'Govt',
    admin: 'Admin',
  };

  const navItemsMap: Record<UserRole, Array<{ label: string; route: string; icon: React.FC<{ className?: string }> }>> = {
    traveler: [
      { label: 'Jelajah Budaya', route: '/traveler/home', icon: Compass },
      { label: 'Panduan Rute', route: '/traveler/smart-guide', icon: Map },
      { label: 'Tukar Poin', route: '/traveler/points', icon: Coins },
      { label: 'Album Stempel', route: '/traveler/album', icon: BookOpen },
    ],
    manager: [
      { label: 'Dashboard', route: '/manager/dashboard', icon: BarChart3 },
      { label: 'Destinasi', route: '/manager/destinations', icon: MapPin },
      { label: 'Explore Points', route: '/manager/explore-points', icon: Compass },
      { label: 'Kuis Budaya', route: '/manager/quizzes', icon: BookOpen },
      { label: 'Katalog Reward', route: '/manager/rewards', icon: Award },
      { label: 'Event', route: '/manager/events', icon: Calendar },
      { label: 'Kode QR', route: '/manager/qr-codes', icon: QrCode },
      { label: 'Analitik', route: '/manager/analytics', icon: BarChart3 },
    ],
    umkm: [
      { label: 'Dashboard', route: '/umkm/dashboard', icon: BarChart3 },
      { label: 'Profil Usaha', route: '/umkm/profile', icon: Building2 },
      { label: 'Produk', route: '/umkm/products', icon: ShoppingBag },
      { label: 'Promosi', route: '/umkm/promotions', icon: Award },
    ],
    government: [
      { label: 'Overview', route: '/government/dashboard', icon: Landmark },
      { label: 'Tren Pariwisata', route: '/government/trends', icon: BarChart3 },
      { label: 'Kinerja Wilayah', route: '/government/performance', icon: MapPin },
      { label: 'Laporan Kebijakan', route: '/government/reports', icon: BookOpen },
    ],
    admin: [
      { label: 'Overview', route: '/admin/dashboard', icon: ShieldCheck },
      { label: 'Verifikasi UMKM', route: '/admin/umkm-approval', icon: Building2 },
      { label: 'Moderasi Destinasi', route: '/admin/destinations', icon: MapPin },
      { label: 'Pengguna', route: '/admin/users', icon: ShieldCheck },
      { label: 'Pengaturan', route: '/admin/settings', icon: Landmark },
    ]
  };

  const currentNavItems = navItemsMap[currentUser.role] || navItemsMap.traveler;

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-4 bg-neutral-100/60 backdrop-blur-md antialiased font-sans">
      <div className="max-w-7xl mx-auto relative bg-white rounded-full shadow-xl shadow-neutral-200/60 border border-neutral-200/90 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 overflow-hidden min-h-[72px]">
        
        {/* SILUET GELOMBANG (Electric Blue Gradient) */}
        <div className="absolute left-0 top-0 bottom-0 w-[220px] pointer-events-none z-0 overflow-hidden rounded-l-full">
          <svg className="absolute top-0 left-0 h-full w-full text-blue-600/10 fill-current" viewBox="0 0 200 100" preserveAspectRatio="none">
            <path d="M0,0 L120,0 C170,30 130,70 180,100 L0,100 Z" />
          </svg>
          <svg className="absolute top-0 left-0 h-full w-full text-blue-500/15 fill-current" viewBox="0 0 200 100" preserveAspectRatio="none">
            <path d="M0,0 L90,0 C140,25 100,75 150,100 L0,100 Z" />
          </svg>
        </div>

        {/* 1. KIRI: BRAND LOGO & ROLE SELECTOR */}
        <div className="flex items-center gap-4 relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => navigateTo(currentUser.role === 'traveler' ? '/traveler/home' : `/${currentUser.role}/dashboard`)}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-blue-100 shadow-sm flex items-center justify-center p-1.5 overflow-hidden group-hover:scale-105 group-hover:border-blue-300 transition duration-300 shrink-0">
              <img
                src="/logo.png"
                alt="TAKONO Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-sm sm:text-base tracking-widest text-neutral-900 uppercase block leading-tight">
                TAKONO
              </span>
              <span className="text-[10px] sm:text-[11px] text-blue-600 font-semibold tracking-tight block">
                Ekowisata & Budaya
              </span>
            </div>
          </button>

          {/* Role Dropdown Selector */}
          <div className="relative inline-block text-left">
            <select
              value={currentUser.role}
              onChange={(e) => switchUserRole(e.target.value as UserRole)}
              className="appearance-none bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-300/80 text-neutral-800 font-mono text-[11px] sm:text-xs font-bold py-1.5 pl-3 pr-7 rounded-full cursor-pointer transition focus:outline-none shadow-2xs"
            >
              {(['traveler', 'manager', 'umkm', 'government', 'admin'] as UserRole[]).map((r) => (
                <option key={r} value={r}>
                  {roleLabels[r]} Mode
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-neutral-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 2. TENGAH: FLOATING CAPSULE NAVIGATION MENU (Diberi overflow & shrink agar aman) */}
        <nav className="hidden lg:flex items-center gap-1 bg-neutral-50/90 border border-neutral-200/90 rounded-full px-2 py-1.5 shadow-inner relative z-10 overflow-x-auto scrollbar-none shrink max-w-[45vw] xl:max-w-none">
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition relative shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* 3. KANAN: POIN & ACTION BUTTONS */}
        <div className="flex items-center gap-2.5 relative z-10 shrink-0">
          
          {/* Poin Balance Badge */}
          {currentUser.role === 'traveler' && (
            <button
              type="button"
              onClick={() => navigateTo('/traveler/points')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-950 hover:bg-blue-100 transition"
            >
              <Coins className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-black font-mono text-blue-900">{currentUser.pointsBalance} PTS</span>
            </button>
          )}

          {/* Quick Scan QR Button */}
          <button
            type="button"
            onClick={() => setQrModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-extrabold rounded-full text-xs uppercase tracking-wider shadow-md shadow-blue-500/25 transition active:scale-95 shrink-0"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>

          {/* Auth Controls */}
          {!authToken ? (
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('login');
                setAuthModalOpen(true);
              }}
              className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition shrink-0"
              title="Masuk Akun"
            >
              <LogIn className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={logout}
              className="p-2 rounded-full bg-neutral-100 hover:bg-rose-50 hover:text-rose-600 text-neutral-600 transition shrink-0"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>

      {/* Mobile & Tablet Horizontal Scroll Nav Drawer */}
      <div className="lg:hidden mt-2.5 px-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 py-1">
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.route;

            return (
              <button
                key={item.route}
                type="button"
                onClick={() => navigateTo(item.route)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-neutral-600 border border-neutral-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
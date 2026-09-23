import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Compass, QrCode, Sparkles, MapPin, Menu, X, ArrowUpRight } from 'lucide-react';
import { TakonoLogo } from './TakonoLogo.js';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenScanModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenScanModal }) => {
  const { user, role, pointsBalance } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Zone 1: Takono Authentic Brand Logo */}
        <button
          onClick={() => handleNav('/')}
          className="flex items-center group cursor-pointer focus:outline-hidden py-1 transition-opacity hover:opacity-90"
          aria-label="TAKONO Home"
        >
          <TakonoLogo variant="full" size="md" />
        </button>

        {/* Zone 2: Primary Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => handleNav('/')}
            className={`transition-colors py-1 cursor-pointer relative ${
              currentPath === '/' 
                ? 'text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full' 
                : 'hover:text-slate-900'
            }`}
          >
            Beranda
          </button>
          
          <button
            onClick={() => handleNav('/destinations')}
            className={`transition-colors py-1 cursor-pointer relative ${
              currentPath.startsWith('/destinations') 
                ? 'text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full' 
                : 'hover:text-slate-900'
            }`}
          >
            Destinasi
          </button>
          
          <button
            onClick={() => handleNav('/how-it-works')}
            className={`transition-colors py-1 cursor-pointer relative ${
              currentPath === '/how-it-works' 
                ? 'text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full' 
                : 'hover:text-slate-900'
            }`}
          >
            Cara Kerja
          </button>
          
          <button
            onClick={() => handleNav('/about')}
            className={`transition-colors py-1 cursor-pointer relative ${
              currentPath === '/about' 
                ? 'text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full' 
                : 'hover:text-slate-900'
            }`}
          >
            Tentang
          </button>

          <button
            onClick={() => handleNav('/app/smart-guide')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-blue-600 bg-blue-50/80 hover:bg-blue-100 font-semibold text-xs transition-colors cursor-pointer border border-blue-100"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Smart Guide</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3">
          {onOpenScanModal && (
            <button
              onClick={onOpenScanModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100/90 hover:bg-slate-200/90 rounded-xl transition-colors cursor-pointer border border-slate-200/60"
              title="Simulasikan Scan QR Destinasi"
            >
              <QrCode className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>
          )}

          {role === 'traveler' ? (
            <button
              onClick={() => handleNav('/app')}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm active:scale-98 whitespace-nowrap cursor-pointer"
            >
              <span>Buka Aplikasi</span>
              <span className="bg-blue-700 px-2 py-0.5 rounded-md text-[11px] font-mono tabular-nums">
                {pointsBalance} Pts
              </span>
            </button>
          ) : role === 'destination_manager' ? (
            <button
              onClick={() => handleNav('/manager')}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-sm whitespace-nowrap cursor-pointer"
            >
              <span>Portal Pengelola KBS</span>
            </button>
          ) : role === 'government' ? (
            <button
              onClick={() => handleNav('/government')}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-900 rounded-xl hover:bg-indigo-800 transition-all shadow-sm whitespace-nowrap cursor-pointer"
            >
              <span>Tourism Intelligence</span>
            </button>
          ) : (
            <button
              onClick={() => handleNav('/admin')}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-sm whitespace-nowrap cursor-pointer"
            >
              <span>Admin Platform</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <button
            onClick={() => handleNav('/')}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Beranda
          </button>
          <button
            onClick={() => handleNav('/destinations')}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Destinasi Terhubung
          </button>
          <button
            onClick={() => handleNav('/how-it-works')}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Cara Kerja
          </button>
          <button
            onClick={() => handleNav('/about')}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Tentang Kami
          </button>
          <button
            onClick={() => handleNav('/app/smart-guide')}
            className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg text-blue-600 bg-blue-50 cursor-pointer flex items-center justify-between"
          >
            <span>Smart Guide Interaktif</span>
            <Compass className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};

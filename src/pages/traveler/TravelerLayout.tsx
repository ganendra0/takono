import React from 'react';
import { 
  Home, 
  Compass, 
  Calendar, 
  Gift, 
  BookMarked, 
  User,
  Sparkles,
  QrCode
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { TakonoLogo } from '../../components/TakonoLogo.js';

interface TravelerLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenScanModal?: () => void;
  children: React.ReactNode;
}

export const TravelerLayout: React.FC<TravelerLayoutProps> = ({
  currentTab,
  onSelectTab,
  onOpenScanModal,
  children
}) => {
  const { user, pointsBalance } = useAuth();

  const tabs = [
    { id: '/app', label: 'Home', icon: Home },
    { id: '/app/smart-guide', label: 'Jelajah', icon: Compass },
    { id: '/app/events', label: 'Event', icon: Calendar },
    { id: '/app/rewards', label: 'Reward', icon: Gift },
    { id: '/app/album', label: 'Album', icon: BookMarked },
    { id: '/app/profile', label: 'Profil', icon: User }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center">
      
      {/* Mobile-first viewport container (desktop centers as modern phone/tablet frame or fluid) */}
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl min-h-screen bg-slate-50 flex flex-col shadow-sm border-x border-slate-200/80 pb-20 relative">
        
        {/* Top App Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onSelectTab('/')} 
              className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
              aria-label="Kembali ke Beranda"
            >
              <TakonoLogo variant="icon" size="sm" />
            </button>
            <div className="leading-none">
              <span className="font-black text-sm tracking-tight text-blue-600 block leading-tight">
                TAKONO
              </span>
              <span className="text-[10px] text-slate-500 font-medium leading-none">
                Jelajah destinasi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenScanModal && (
              <button
                onClick={onOpenScanModal}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors cursor-pointer border border-slate-200/60"
                title="Pindai QR Titik Jelajah"
              >
                <QrCode className="w-4 h-4 text-blue-600" />
              </button>
            )}

            <button
              onClick={() => onSelectTab('/app/profile')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs font-semibold hover:bg-blue-100 transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-mono font-bold tabular-nums">{pointsBalance}</span>
              <span className="text-[10px] text-blue-700">Pts</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content Frame */}
        <main className="flex-1 p-4">
          {children}
        </main>

        {/* Fixed Bottom Tab Bar (Mobile Thumb Zone Anchor) */}
        <nav aria-label="Navigasi aplikasi traveler" style={{paddingBottom:'env(safe-area-inset-bottom)'}} className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 flex justify-center shadow-lg">
          <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl grid grid-cols-6 h-16">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id || (tab.id === '/app' && currentTab === '/app');
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className={`text-[10px] tracking-tight mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

      </div>
    </div>
  );
};

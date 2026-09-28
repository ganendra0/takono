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
  destinationSlug?: string;
  onSelectTab: (tab: string) => void;
  onOpenScanModal?: () => void;
  children: React.ReactNode;
}

export const TravelerLayout: React.FC<TravelerLayoutProps> = ({
  currentTab,
  destinationSlug,
  onSelectTab,
  onOpenScanModal,
  children
}) => {
  const { user, pointsBalance } = useAuth();

  const base = destinationSlug ? `/app/${encodeURIComponent(destinationSlug)}` : '/app';
  const tabs = [
    { id: base, label: 'Home', icon: Home },
    { id: `${base}/smart-guide`, label: 'Jelajah', icon: Compass },
    { id: `${base}/events`, label: 'Event', icon: Calendar },
    { id: `${base}/rewards`, label: 'Reward', icon: Gift },
    { id: `${base}/album`, label: 'Album', icon: BookMarked },
    { id: `${base}/profile`, label: 'Profil', icon: User }
  ];

  return (
    <div className="traveler-shell min-h-screen bg-[#f6f8fa] flex flex-col items-center">
      
      {/* Full canvas on desktop; compact, thumb-friendly frame on mobile. */}
      <div className="traveler-frame relative flex min-h-screen w-full flex-col pb-24 lg:max-w-none">
        
        {/* Top App Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-3.5 py-2.5 backdrop-blur-md lg:px-10 xl:px-14 2xl:px-20">
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
                Surabaya
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenScanModal && (
              <button
                onClick={onOpenScanModal}
                className="p-2 bg-sky-50 hover:bg-sky-100 rounded-lg text-blue-700 transition-colors cursor-pointer"
                title="Pindai QR Titik Jelajah"
              >
                <QrCode className="w-4 h-4 text-blue-600" />
              </button>
            )}

            <button
              onClick={() => onSelectTab(`${base}/profile`)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 rounded-lg text-white text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-mono font-bold tabular-nums">{pointsBalance}</span>
              <span className="text-[10px] text-blue-100">Pts</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content Frame */}
        <main className="traveler-content flex-1 p-4 sm:p-6 lg:order-2 lg:px-10 lg:py-9 xl:px-14 2xl:px-20">
          {children}
        </main>

        {/* Fixed Bottom Tab Bar (Mobile Thumb Zone Anchor) */}
        <nav aria-label="Navigasi aplikasi traveler" style={{paddingBottom:'env(safe-area-inset-bottom)'}} className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 flex justify-center shadow-[0_-4px_18px_rgba(15,23,42,.06)] lg:static lg:order-1 lg:shadow-none lg:border-t-0 lg:border-b lg:justify-start">
          <div className="grid h-[68px] w-full max-w-3xl grid-cols-6 lg:max-w-none lg:px-10 xl:px-14 2xl:px-20">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id
                || (tab.id === `${base}/smart-guide` && (currentTab.startsWith(`${base}/explore/`) || (currentTab.startsWith(`${base}/scan/`) && !currentTab.startsWith(`${base}/scan/event/`))))
                || (tab.id === `${base}/events` && currentTab.startsWith(`${base}/scan/event/`));
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    isActive ? 'text-blue-700' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span className={`grid h-8 w-10 place-items-center rounded-lg ${isActive ? 'bg-blue-50' : ''}`}><Icon className={`w-[18px] h-[18px] ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} /></span>
                  <span className={`text-[11px] tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
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

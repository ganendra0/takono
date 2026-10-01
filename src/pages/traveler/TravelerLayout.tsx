import React from 'react';
import { 
  Home, 
  Compass, 
  Calendar, 
  Gift, 
  BookMarked, 
  User,
  QrCode,
  MapPinned,
  Store,
  Coins
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { TakonoLogo } from '../../components/TakonoLogo.js';

interface TravelerLayoutProps {
  currentTab: string;
  mode: 'personal' | 'destination';
  destinationSlug?: string;
  onSelectTab: (tab: string) => void;
  onOpenScanModal?: () => void;
  children: React.ReactNode;
}

export const TravelerLayout: React.FC<TravelerLayoutProps> = ({
  currentTab,
  mode,
  destinationSlug,
  onSelectTab,
  onOpenScanModal,
  children
}) => {
  const { pointsBalance } = useAuth();

  const base = mode === 'destination' && destinationSlug ? `/app/destination/${encodeURIComponent(destinationSlug)}` : '/app';
  const tabs = mode === 'personal'
    ? [
        { id: '/app', label: 'Beranda', icon: Home },
        { id: '/app/album', label: 'Album', icon: BookMarked },
        { id: '/app/points', label: 'Poin', icon: Coins },
        { id: '/app/profile', label: 'Profil', icon: User }
      ]
    : [
        { id: base, label: 'Destinasi', icon: Home },
        { id: `${base}/smart-guide`, label: 'Smart Guide', icon: Compass },
        { id: `${base}/explore`, label: 'Explore', icon: MapPinned },
        { id: `${base}/local-discovery`, label: 'Lokal', icon: Store },
        { id: `${base}/events`, label: 'Event', icon: Calendar },
        { id: `${base}/rewards`, label: 'Reward', icon: Gift }
      ];

  return (
    <div className="traveler-shell min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col items-center">
      {/* Container utama disamakan lebarnya untuk seluruh halaman */}
      <div className="traveler-frame relative mx-auto flex min-h-screen w-full max-w-none flex-col px-4 sm:px-6 pb-24 lg:pb-12">
        
        {/* Simple brand header */}
        <header className="sticky top-0 z-50 -ml-4 w-screen border-b border-slate-100 bg-white shadow-[0_1px_8px_rgba(15,23,42,0.04)] sm:-ml-6">
          <div className="mx-auto flex min-h-20 w-full max-w-6xl items-center justify-between gap-5 px-4 lg:h-20">
            <button
              onClick={() => onSelectTab('/')}
              className="inline-flex shrink-0 cursor-pointer items-center rounded-sm focus-visible:outline-offset-4"
              aria-label="Kembali ke Beranda"
            >
              <TakonoLogo variant="full" size="md" />
            </button>

            <nav aria-label="Navigasi utama traveler" className="hidden flex-1 items-center justify-center gap-1 lg:flex">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id
                  || (tab.id === `${base}/smart-guide` && (currentTab.startsWith(`${base}/explore/`) || (currentTab.startsWith(`${base}/scan/`) && !currentTab.startsWith(`${base}/scan/event/`))))
                  || (tab.id === `${base}/explore` && currentTab === `${base}/explore`)
                  || (tab.id === `${base}/events` && currentTab.startsWith(`${base}/scan/event/`));

                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectTab(tab.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <button
                onClick={() => onSelectTab(mode === 'personal' ? '/app/points' : `${base}/rewards`)}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <span className="tabular-nums">{pointsBalance}</span>
                <span className="text-xs text-slate-500">PTS</span>
              </button>
              {onOpenScanModal && (
                <button
                  onClick={onOpenScanModal}
                  title={mode === 'destination' ? 'Pindai QR Explore Point' : 'Pindai QR Destinasi'}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  <QrCode className="h-4 w-4" />
                  Scan QR
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content Frame */}
        <main className="traveler-content w-full flex-1 pt-6 sm:pt-8">
          {children}
        </main>

        {/* Mobile Navigation */}
        <nav 
          aria-label="Navigasi aplikasi traveler" 
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} 
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-slate-200/80 shadow-lg lg:hidden"
        >
          <div className={`grid h-16 w-full ${mode === 'personal' ? 'grid-cols-4' : 'grid-cols-6'}`}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id
                || (tab.id === `${base}/smart-guide` && (currentTab.startsWith(`${base}/explore/`) || (currentTab.startsWith(`${base}/scan/`) && !currentTab.startsWith(`${base}/scan/event/`))))
                || (tab.id === `${base}/explore` && currentTab === `${base}/explore`)
                || (tab.id === `${base}/events` && currentTab.startsWith(`${base}/scan/event/`));

              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <div className={`grid h-7 w-9 place-items-center rounded-full transition-all ${isActive ? 'bg-blue-50 text-blue-600' : ''}`}>
                    <Icon className={`h-4 w-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  </div>
                  <span className={`text-[10px] tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
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

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { ApiClient } from './lib/api.js';
import { Destination, LocalDiscovery, ExplorePoint } from './types/index.js';

// Top bars & Global UI
import { AuthPage } from './pages/public/AuthPage.js';
import { ScanPointPage } from './pages/traveler/ScanPointPage.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { ScanModal } from './components/ScanModal.js';
import { Workspace } from './components/Workspace.js';

// Public Pages
import { HomePage } from './pages/public/HomePage.js';
import { AboutPage } from './pages/public/AboutPage.js';
import { HowItWorksPage } from './pages/public/HowItWorksPage.js';
import { DestinationsListPage } from './pages/public/DestinationsListPage.js';
import { DestinationDetailPage } from './pages/public/DestinationDetailPage.js';
import { DestinationWelcomeScanPage } from './pages/public/DestinationWelcomeScanPage.js';

// Traveler Pages
import { TravelerLayout } from './pages/traveler/TravelerLayout.js';
import { TravelerHome } from './pages/traveler/TravelerHome.js';
const SmartGuidePage = lazy(() => import('./pages/traveler/SmartGuidePage.js').then(m=>({default:m.SmartGuidePage})));
import { ExplorePointDetailPage } from './pages/traveler/ExplorePointDetailPage.js';
import { EventsPage } from './pages/traveler/EventsPage.js';
import { RewardsCatalogPage } from './pages/traveler/RewardsCatalogPage.js';
import { LocalDiscoveryPage } from './pages/traveler/LocalDiscoveryPage.js';
import { AlbumJelajahPage } from './pages/traveler/AlbumJelajahPage.js';
import { ProfilePage } from './pages/traveler/ProfilePage.js';

// Manager, Government, Admin Pages
import { ManagerDashboard } from './pages/manager/ManagerDashboard.js';
import { GovernmentDashboard } from './pages/government/GovernmentDashboard.js';
import { AdminDashboard } from './pages/admin/AdminDashboard.js';

const AppContent: React.FC = () => {
  const { role, user, isLoading } = useAuth();
  
  // URL Hash routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || '/';
  });

  // Global shared state
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [destinationDetails, setDestinationDetails] = useState<any>(null);
  const [destinationError, setDestinationError] = useState('');
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [preselectedScanPoint, setPreselectedScanPoint] = useState<ExplorePoint | null>(null);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      setCurrentPath(hash || '/');
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // Load the active destination catalog.
  useEffect(() => {
    const fetchGlobalData = async () => {
      const listRes = await ApiClient.getDestinations();
      if (listRes.success && listRes.data) {
        setDestinations(listRes.data);
      }

      const slug = currentPath.startsWith('/destinations/') ? currentPath.slice('/destinations/'.length) : undefined;
      setDestinationDetails(null);
      const detailRes = await ApiClient.getDestinationBySlug(slug);
      if (detailRes.success && detailRes.data) {
        setDestinationDetails(detailRes.data);
        setDestinationError('');
      } else {
        setDestinationError(detailRes.message || 'Destinasi tidak tersedia.');
      }
    };

    fetchGlobalData();
  }, [currentPath, user?.id]);

  const handleOpenScan = (point?: ExplorePoint) => {
    setPreselectedScanPoint(point || null);
    setIsScanModalOpen(true);
  };

  // ----------------------------------------------------
  // ROUTE RESOLVER
  // ----------------------------------------------------
  const renderRoute = () => {
    const privatePath = /^\/(app|manager|government|admin)(\/|$)/.test(currentPath);
    if (isLoading && privatePath) return <p className="p-12 text-center">Memuat sesi…</p>;
    if ((!user && privatePath) || currentPath === '/login') return <AuthPage onNavigate={navigate} returnTo={currentPath === '/login' ? '/app' : currentPath}/>;
    const home = role === 'destination_manager' ? '/manager' : role === 'government' ? '/government' : role === 'super_admin' ? '/admin' : '/app';
    if (privatePath && ((currentPath.startsWith('/manager') && !['destination_manager','super_admin'].includes(role)) || (currentPath.startsWith('/government') && !['government','super_admin'].includes(role)) || (currentPath.startsWith('/admin') && role !== 'super_admin') || (currentPath.startsWith('/app') && role !== 'traveler'))) {
      return <div className="p-12 text-center space-y-4"><p>Halaman ini tidak tersedia untuk peran akun Anda.</p><button className="text-blue-600" onClick={()=>navigate(home)}>Buka dashboard saya</button></div>;
    }
    // 1. Scan Destination Landing (/scan/:code)
    if (currentPath.startsWith('/scan/')) {
      const code = currentPath.replace('/scan/', '');
      return <DestinationWelcomeScanPage destinationCode={code} onNavigate={navigate} />;
    }

    // 2. Traveler Application Routes (/app/*)
    if (currentPath.startsWith('/app')) {
      let subView = <TravelerHome onNavigate={navigate} onOpenScanModal={() => handleOpenScan()} />;

      if (currentPath.startsWith('/app/scan/event/')) {
        subView = <ScanPointPage mode="event" token={decodeURIComponent(currentPath.slice('/app/scan/event/'.length))} onNavigate={navigate}/>;
      } else if (currentPath.startsWith('/app/scan/')) {
        subView = <ScanPointPage token={decodeURIComponent(currentPath.slice('/app/scan/'.length))} onNavigate={navigate}/>;
      } else if (currentPath === '/app/smart-guide') {
        subView = <SmartGuidePage onNavigate={navigate} onOpenScanModal={(pt) => handleOpenScan(pt)} />;
      } else if (currentPath.startsWith('/app/explore/')) {
        const slug = currentPath.replace('/app/explore/', '');
        subView = <ExplorePointDetailPage slug={slug} onNavigate={navigate} />;
      } else if (currentPath === '/app/events') {
        subView = <EventsPage onNavigate={navigate} onOpenScanModal={() => handleOpenScan()} />;
      } else if (currentPath === '/app/rewards') {
        subView = <RewardsCatalogPage onNavigate={navigate} />;
      } else if (currentPath === '/app/local-discovery') {
        subView = <LocalDiscoveryPage onNavigate={navigate} />;
      } else if (currentPath === '/app/album') {
        subView = <AlbumJelajahPage onNavigate={navigate} />;
      } else if (currentPath === '/app/profile') {
        subView = <ProfilePage onNavigate={navigate} />;
      }

      return (
        <TravelerLayout
          currentTab={currentPath}
          onSelectTab={navigate}
          onOpenScanModal={() => handleOpenScan()}
        >
          {subView}
        </TravelerLayout>
      );
    }

    // 3. Destination Manager Portal (/manager)
    if (currentPath.startsWith('/manager')) {
      return <Workspace onNavigate={navigate}><ManagerDashboard onNavigate={navigate} /></Workspace>;
    }

    // 4. Government Intelligence Portal (/government)
    if (currentPath.startsWith('/government')) {
      return <Workspace onNavigate={navigate}><GovernmentDashboard onNavigate={navigate} /></Workspace>;
    }

    // 5. Super Admin Platform (/admin)
    if (currentPath.startsWith('/admin')) {
      return <Workspace onNavigate={navigate}><AdminDashboard onNavigate={navigate} /></Workspace>;
    }

    // 6. Public Pages
    if (currentPath === '/about') {
      return (
        <div>
          <Navbar currentPath={currentPath} onNavigate={navigate} onOpenScanModal={() => handleOpenScan()} />
          <AboutPage onNavigate={navigate} />
          <Footer onNavigate={navigate} />
        </div>
      );
    }

    if (currentPath === '/how-it-works') {
      return (
        <div>
          <Navbar currentPath={currentPath} onNavigate={navigate} onOpenScanModal={() => handleOpenScan()} />
          <HowItWorksPage onNavigate={navigate} />
          <Footer onNavigate={navigate} />
        </div>
      );
    }

    if (currentPath === '/destinations') {
      return (
        <div>
          <Navbar currentPath={currentPath} onNavigate={navigate} onOpenScanModal={() => handleOpenScan()} />
          <DestinationsListPage destinations={destinations} onNavigate={navigate} />
          <Footer onNavigate={navigate} />
        </div>
      );
    }

    if (currentPath.startsWith('/destinations/')) {
      return (
        <div>
          <Navbar currentPath={currentPath} onNavigate={navigate} onOpenScanModal={() => handleOpenScan()} />
          {destinationDetails ? (
            <DestinationDetailPage
              destination={destinationDetails.destination}
              explorePoints={destinationDetails.explorePoints || []}
              events={destinationDetails.events || []}
              localDiscoveries={destinationDetails.localDiscoveries || []}
              rewards={destinationDetails.rewards || []}
              onNavigate={navigate}
              onOpenScanModal={() => handleOpenScan()}
            />
          ) : (
            <div className="py-20 text-center text-xs text-slate-500">{destinationError || 'Memuat detail destinasi...'}</div>
          )}
          <Footer onNavigate={navigate} />
        </div>
      );
    }

    // Default: Home Page
    return (
      <div>
        <Navbar currentPath={currentPath} onNavigate={navigate} onOpenScanModal={() => handleOpenScan()} />
        <HomePage
          explorePoints={destinationDetails?.explorePoints || []}
          destination={destinationDetails?.destination || null}
          localDiscoveries={destinationDetails?.localDiscoveries || []}
          onNavigate={navigate}
          onOpenScanModal={() => handleOpenScan()}
        />
        <Footer onNavigate={navigate} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Primary Routed View */}
      <div className="flex-1" key={user?.id || 'guest'}>
        <Suspense fallback={<p className="p-8 text-center">Memuat halaman…</p>}>{renderRoute()}</Suspense>
      </div>

      {/* Global QR Code Scan Modal */}
      <ScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onNavigate={navigate}
        preselectedPoint={preselectedScanPoint}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { ApiClient } from './lib/api.js';
import { Destination, LocalDiscovery, ExplorePoint } from './types/index.js';

// Top bars & Global UI
import { RoleSwitcher } from './components/RoleSwitcher.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { ScanModal } from './components/ScanModal.js';

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
import { SmartGuidePage } from './pages/traveler/SmartGuidePage.js';
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
  const { role } = useAuth();
  
  // URL Hash routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || '/';
  });

  // Global shared state
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [destinationDetails, setDestinationDetails] = useState<any>(null);
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

  // Initial load KBS data
  useEffect(() => {
    const fetchGlobalData = async () => {
      const listRes = await ApiClient.getDestinations();
      if (listRes.success && listRes.data) {
        setDestinations(listRes.data);
      }

      const detailRes = await ApiClient.getDestinationBySlug('kebun-binatang-surabaya');
      if (detailRes.success && detailRes.data) {
        setDestinationDetails(detailRes.data);
      }
    };

    fetchGlobalData();
  }, []);

  const handleOpenScan = (point?: ExplorePoint) => {
    setPreselectedScanPoint(point || null);
    setIsScanModalOpen(true);
  };

  // ----------------------------------------------------
  // ROUTE RESOLVER
  // ----------------------------------------------------
  const renderRoute = () => {
    // 1. Scan Destination Landing (/scan/:code)
    if (currentPath.startsWith('/scan/')) {
      const code = currentPath.replace('/scan/', '');
      return <DestinationWelcomeScanPage destinationCode={code} onNavigate={navigate} />;
    }

    // 2. Traveler Application Routes (/app/*)
    if (currentPath.startsWith('/app')) {
      let subView = <TravelerHome onNavigate={navigate} onOpenScanModal={() => handleOpenScan()} />;

      if (currentPath === '/app/smart-guide') {
        subView = <SmartGuidePage onNavigate={navigate} onOpenScanModal={(pt) => handleOpenScan(pt)} />;
      } else if (currentPath.startsWith('/app/explore/')) {
        const slug = currentPath.replace('/app/explore/', '');
        subView = <ExplorePointDetailPage slug={slug} onNavigate={navigate} />;
      } else if (currentPath === '/app/events') {
        subView = <EventsPage onNavigate={navigate} />;
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
      return (
        <div>
          <Navbar currentPath={currentPath} onNavigate={navigate} onOpenScanModal={() => handleOpenScan()} />
          <ManagerDashboard onNavigate={navigate} />
          <Footer onNavigate={navigate} />
        </div>
      );
    }

    // 4. Government Intelligence Portal (/government)
    if (currentPath.startsWith('/government')) {
      return (
        <div>
          <Navbar currentPath={currentPath} onNavigate={navigate} onOpenScanModal={() => handleOpenScan()} />
          <GovernmentDashboard onNavigate={navigate} />
          <Footer onNavigate={navigate} />
        </div>
      );
    }

    // 5. Super Admin Platform (/admin)
    if (currentPath.startsWith('/admin')) {
      return (
        <div>
          <Navbar currentPath={currentPath} onNavigate={navigate} onOpenScanModal={() => handleOpenScan()} />
          <AdminDashboard onNavigate={navigate} />
          <Footer onNavigate={navigate} />
        </div>
      );
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
            <div className="py-20 text-center text-xs text-slate-500">Memuat detail destinasi...</div>
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
      {/* Interactive Role Switcher Banner */}
      <RoleSwitcher currentPath={currentPath} onNavigate={navigate} />

      {/* Primary Routed View */}
      <div className="flex-1">
        {renderRoute()}
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

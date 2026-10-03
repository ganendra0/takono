import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { ApiClient } from './lib/api.js';
import { scopedTravelerPath, travelerDestinationSlug } from './lib/travelerRoute.js';
import { Destination, LocalDiscovery, ExplorePoint } from './types/index.js';

// Top bars & Global UI
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';

// Public Pages
import { HomePage } from './pages/public/HomePage.js';

// Route modules are loaded only when that route is opened. Home, navigation,
// and footer stay in the initial chunk to keep the public landing page fast.
const AuthPage = lazy(() => import('./pages/public/AuthPage.js').then(m => ({ default: m.AuthPage })));
const ScanPointPage = lazy(() => import('./pages/traveler/ScanPointPage.js').then(m => ({ default: m.ScanPointPage })));
const ScanModal = lazy(() => import('./components/ScanModal.js').then(m => ({ default: m.ScanModal })));
const Workspace = lazy(() => import('./components/Workspace.js').then(m => ({ default: m.Workspace })));
const AboutPage = lazy(() => import('./pages/public/AboutPage.js').then(m => ({ default: m.AboutPage })));
const HowItWorksPage = lazy(() => import('./pages/public/HowItWorksPage.js').then(m => ({ default: m.HowItWorksPage })));
const DestinationsListPage = lazy(() => import('./pages/public/DestinationsListPage.js').then(m => ({ default: m.DestinationsListPage })));
const DestinationDetailPage = lazy(() => import('./pages/public/DestinationDetailPage.js').then(m => ({ default: m.DestinationDetailPage })));
const DestinationWelcomeScanPage = lazy(() => import('./pages/public/DestinationWelcomeScanPage.js').then(m => ({ default: m.DestinationWelcomeScanPage })));
const TravelerLayout = lazy(() => import('./pages/traveler/TravelerLayout.js').then(m => ({ default: m.TravelerLayout })));
const TravelerHome = lazy(() => import('./pages/traveler/TravelerHome.js').then(m => ({ default: m.TravelerHome })));
const PersonalHomePage = lazy(() => import('./pages/traveler/PersonalHomePage.js').then(m => ({ default: m.PersonalHomePage })));
const PointsPage = lazy(() => import('./pages/traveler/PointsPage.js').then(m => ({ default: m.PointsPage })));
const DestinationExplorePage = lazy(() => import('./pages/traveler/DestinationExplorePage.js').then(m => ({ default: m.DestinationExplorePage })));
const SmartGuidePage = lazy(() => import('./pages/traveler/SmartGuidePage.js').then(m => ({ default: m.SmartGuidePage })));
const ExplorePointDetailPage = lazy(() => import('./pages/traveler/ExplorePointDetailPage.js').then(m => ({ default: m.ExplorePointDetailPage })));
const EventsPage = lazy(() => import('./pages/traveler/EventsPage.js').then(m => ({ default: m.EventsPage })));
const RewardsCatalogPage = lazy(() => import('./pages/traveler/RewardsCatalogPage.js').then(m => ({ default: m.RewardsCatalogPage })));
const LocalDiscoveryPage = lazy(() => import('./pages/traveler/LocalDiscoveryPage.js').then(m => ({ default: m.LocalDiscoveryPage })));
const AlbumJelajahPage = lazy(() => import('./pages/traveler/AlbumJelajahPage.js').then(m => ({ default: m.AlbumJelajahPage })));
const ProfilePage = lazy(() => import('./pages/traveler/ProfilePage.js').then(m => ({ default: m.ProfilePage })));
const ManagerDashboard = lazy(() => import('./pages/manager/ManagerDashboard.js').then(m => ({ default: m.ManagerDashboard })));
const GovernmentDashboard = lazy(() => import('./pages/government/GovernmentDashboard.js').then(m => ({ default: m.GovernmentDashboard })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.js').then(m => ({ default: m.AdminDashboard })));
const TenantDashboard = lazy(() => import('./pages/tenant/TenantDashboard.js').then(m => ({ default: m.TenantDashboard })));

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
  const [autoStartScanCamera, setAutoStartScanCamera] = useState(false);
  const [scanMode, setScanMode] = useState<'traveler' | 'voucher'>('traveler');
  const [tenantVoucherCode, setTenantVoucherCode] = useState<string | null>(null);
  const scopedDestinationSlug = travelerDestinationSlug(currentPath);

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

  // Load only the destination data required by the active route. This avoids
  // an unnecessary catalog + detail chain on the public landing page.
  useEffect(() => {
    const publicSlug = currentPath.startsWith('/destinations/') ? currentPath.slice('/destinations/'.length) : undefined;
    const slug = publicSlug || travelerDestinationSlug(currentPath);
    const needsCatalog = currentPath === '/destinations';

    if (!needsCatalog && !slug) {
      setDestinationDetails(null);
      setDestinationError('');
      return;
    }

    const loadDestinationData = async () => {
      if (needsCatalog) {
        const listRes = await ApiClient.getDestinations();
        if (listRes.success && listRes.data) setDestinations(listRes.data);
      }

      if (!slug) return;
      setDestinationDetails(null);
      const detailRes = await ApiClient.getDestinationBySlug(slug);
      if (detailRes.success && detailRes.data) {
        if (slug) ApiClient.selectDestination(detailRes.data.destination.id, detailRes.data.destination.slug);
        setDestinationDetails(detailRes.data);
        setDestinationError('');
      } else {
        setDestinationError(detailRes.message || 'Destinasi tidak tersedia.');
      }
    };

    loadDestinationData();
  }, [currentPath, user?.id]);

  useEffect(() => {
    if (user && currentPath === '/scan') {
      setPreselectedScanPoint(null);
      setAutoStartScanCamera(true);
      setIsScanModalOpen(true);
    }
  }, [currentPath, user?.id]);

  const handleOpenScan = (point?: ExplorePoint, autoStartCamera = false) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setPreselectedScanPoint(point || null);
    setAutoStartScanCamera(autoStartCamera);
    setScanMode('traveler');
    setIsScanModalOpen(true);
  };

  const handleOpenTenantVoucherScanner = () => {
    setPreselectedScanPoint(null);
    setAutoStartScanCamera(true);
    setScanMode('voucher');
    setIsScanModalOpen(true);
  };

  const destinationNavigate = (path: string) => {
    if (!path.startsWith('/app')) { navigate(path); return; }
    // Leaving a visit must never be re-scoped back into its active destination.
    if (['/app', '/app/album', '/app/points', '/app/profile'].includes(path)) {
      navigate(path);
      return;
    }
    const destinationSlug = travelerDestinationSlug(currentPath) || localStorage.getItem('takono_destination_slug');
    navigate(destinationSlug ? scopedTravelerPath(destinationSlug, path) : path);
  };

  const publicDestinationNavigate = (destination: Destination, path: string) => {
    if (path.startsWith('/app')) {
      ApiClient.selectDestination(destination.id, destination.slug);
      navigate(scopedTravelerPath(destination.slug, path));
      return;
    }
    navigate(path);
  };

  // ----------------------------------------------------
  // ROUTE RESOLVER
  // ----------------------------------------------------
  const renderRoute = () => {
    const privatePath = /^\/(app|manager|government|admin|tenant)(\/|$)/.test(currentPath);
    const scanPath = currentPath === '/scan' || currentPath.startsWith('/scan/');
    if (isLoading && privatePath) return <p className="p-12 text-center">Memuat sesi…</p>;
    if ((!user && (privatePath || scanPath)) || currentPath === '/login') return <AuthPage onNavigate={navigate} returnTo={currentPath === '/login' ? '/app' : currentPath}/>;
    const home = role === 'destination_manager' ? '/manager' : role === 'tenant' ? '/tenant' : role === 'government' ? '/government' : role === 'super_admin' ? '/admin' : '/app';
    if (privatePath && ((currentPath.startsWith('/manager') && !['destination_manager','super_admin'].includes(role)) || (currentPath.startsWith('/tenant') && role !== 'tenant') || (currentPath.startsWith('/government') && !['government','super_admin'].includes(role)) || (currentPath.startsWith('/admin') && role !== 'super_admin') || (currentPath.startsWith('/app') && role !== 'traveler'))) {
      return <div className="p-12 text-center space-y-4"><p>Halaman ini tidak tersedia untuk peran akun Anda.</p><button className="text-blue-600" onClick={()=>navigate(home)}>Buka dashboard saya</button></div>;
    }
    // 1. Scan Destination Landing (/scan/:code)
    if (currentPath.startsWith('/scan/')) {
      const code = currentPath.replace('/scan/', '');
      return <DestinationWelcomeScanPage destinationCode={code} onNavigate={navigate} />;
    }

    // 2. Traveler Application Routes: personal area and QR-gated destination mode.
    if (currentPath.startsWith('/app')) {
      const directPointScan = currentPath.match(/^\/app\/scan\/(event\/)?(.+)$/);
      if (directPointScan) return <ScanPointPage mode={directPointScan[1] ? 'event' : 'point'} token={decodeURIComponent(directPointScan[2])} onNavigate={navigate}/>;

      if (!scopedDestinationSlug) {
        let personalView: React.ReactNode = <PersonalHomePage onNavigate={navigate} onOpenScanModal={() => handleOpenScan(undefined, true)} />;
        if (currentPath === '/app/album') personalView = <AlbumJelajahPage onNavigate={navigate} />;
        else if (currentPath === '/app/points') personalView = <PointsPage />;
        else if (currentPath === '/app/profile') personalView = <ProfilePage onNavigate={navigate} />;
        return <TravelerLayout currentTab={currentPath} mode="personal" onSelectTab={navigate} onOpenScanModal={() => handleOpenScan(undefined, true)}>{personalView}</TravelerLayout>;
      }

      if (!destinationDetails || destinationDetails.destination?.slug !== scopedDestinationSlug) return <p className="p-12 text-center text-sm text-slate-500">Memuat destinasi…</p>;
      const prefix = `/app/destination/${encodeURIComponent(scopedDestinationSlug)}`;
      const travelerPath = currentPath.slice(prefix.length) || '/';
      let subView: React.ReactNode = <TravelerHome destinationSlug={scopedDestinationSlug} onNavigate={destinationNavigate} onOpenScanModal={() => handleOpenScan()} />;
      if (travelerPath === '/smart-guide') subView = <SmartGuidePage onNavigate={destinationNavigate} onOpenScanModal={() => handleOpenScan()} />;
      else if (travelerPath === '/explore') subView = <DestinationExplorePage onOpenScanModal={() => handleOpenScan()} />;
      else if (travelerPath.startsWith('/explore/')) subView = <ExplorePointDetailPage slug={travelerPath.slice('/explore/'.length)} onNavigate={destinationNavigate} />;
      else if (travelerPath === '/events') subView = <EventsPage onNavigate={destinationNavigate} onOpenScanModal={() => handleOpenScan()} />;
      else if (travelerPath === '/rewards') subView = <RewardsCatalogPage onNavigate={destinationNavigate} />;
      else if (travelerPath === '/local-discovery') subView = <LocalDiscoveryPage onNavigate={destinationNavigate} />;
      return <TravelerLayout currentTab={currentPath} mode="destination" destinationSlug={scopedDestinationSlug} onSelectTab={destinationNavigate} onOpenScanModal={() => handleOpenScan()}>{subView}</TravelerLayout>;
    }

    // 3. Destination Manager Portal (/manager)
    if (currentPath.startsWith('/manager')) {
      return <Workspace onNavigate={navigate}><ManagerDashboard onNavigate={navigate} /></Workspace>;
    }

    // 4. Tenant voucher verification portal (/tenant)
    if (currentPath.startsWith('/tenant')) {
      return <Workspace onNavigate={navigate}><TenantDashboard onOpenVoucherScanner={handleOpenTenantVoucherScanner} scannedCode={tenantVoucherCode} onScannedCodeHandled={() => setTenantVoucherCode(null)} /></Workspace>;
    }

    // 5. Government Intelligence Portal (/government)
    if (currentPath.startsWith('/government')) {
      return <Workspace onNavigate={navigate}><GovernmentDashboard onNavigate={navigate} /></Workspace>;
    }

    // 6. Super Admin Platform (/admin)
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
              onNavigate={path => publicDestinationNavigate(destinationDetails.destination, path)}
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
        <Navbar currentPath={currentPath} onNavigate={navigate} onOpenScanModal={() => handleOpenScan(undefined, true)} />
        <HomePage onOpenScanModal={() => handleOpenScan(undefined, true)} />
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
      {isScanModalOpen && <Suspense fallback={null}><ScanModal
          isOpen={isScanModalOpen}
          onClose={() => { setIsScanModalOpen(false); setScanMode('traveler'); }}
          onNavigate={navigate}
          preselectedPoint={preselectedScanPoint}
          autoStartCamera={autoStartScanCamera}
          mode={scanMode}
          onVoucherScanned={code => setTenantVoucherCode(code)}
        /></Suspense>}
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

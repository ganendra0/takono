import React from 'react';
import { TakonoStoreProvider, useTakonoStore } from './services/store';
import { AppHeader } from './components/layout/AppHeader';
import { QRScannerModal } from './components/common/QRScannerModal';
import { AuthModal } from './components/auth/AuthModal';

// Traveler views
import { TravelerHome } from './components/traveler/TravelerHome';
import { DestinationDetailView } from './components/traveler/DestinationDetailView';
import { ExplorePointDetailView } from './components/traveler/ExplorePointDetailView';
import { SmartGuideView } from './components/traveler/SmartGuideView';
import { LocalDiscoveryView } from './components/traveler/LocalDiscoveryView';
import { RewardCatalogView } from './components/traveler/RewardCatalogView';
import { PointsLedgerView } from './components/traveler/PointsLedgerView';
import { AlbumJelajahView } from './components/traveler/AlbumJelajahView';

// Manager views
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { ManagerDestinations } from './components/manager/ManagerDestinations';
import { ManagerExplorePoints } from './components/manager/ManagerExplorePoints';
import { ManagerQuizzes } from './components/manager/ManagerQuizzes';
import { ManagerRewards } from './components/manager/ManagerRewards';
import { ManagerEvents } from './components/manager/ManagerEvents';
import { ManagerQRCodes } from './components/manager/ManagerQRCodes';
import { ManagerAnalytics } from './components/manager/ManagerAnalytics';

// UMKM views
import { UMKMDashboard } from './components/umkm/UMKMDashboard';

// Government views
import { GovernmentDashboard } from './components/government/GovernmentDashboard';

// Admin views
import { AdminDashboard } from './components/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { activeRoute, currentUser, navigateTo } = useTakonoStore();

  const renderActiveView = () => {
    // Route matching
    if (activeRoute.startsWith('/traveler/destinations/')) {
      const parts = activeRoute.split('?')[0].split('/');
      const destinationId = parts[3];
      return <DestinationDetailView destinationId={destinationId} />;
    }

    if (activeRoute.startsWith('/traveler/explore/')) {
      const pointId = activeRoute.split('/')[3];
      return <ExplorePointDetailView pointId={pointId} />;
    }

    switch (activeRoute) {
      // Traveler Routes
      case '/traveler/home':
        return <TravelerHome />;
      case '/traveler/smart-guide':
        return <SmartGuideView />;
      case '/traveler/local-discovery':
        return <LocalDiscoveryView />;
      case '/traveler/rewards':
        return <RewardCatalogView />;
      case '/traveler/points':
        return <PointsLedgerView />;
      case '/traveler/album':
        return <AlbumJelajahView />;

      // Manager Routes
      case '/manager/dashboard':
        return <ManagerDashboard />;
      case '/manager/destinations':
        return <ManagerDestinations />;
      case '/manager/explore-points':
        return <ManagerExplorePoints />;
      case '/manager/quizzes':
        return <ManagerQuizzes />;
      case '/manager/rewards':
        return <ManagerRewards />;
      case '/manager/events':
        return <ManagerEvents />;
      case '/manager/qr-codes':
        return <ManagerQRCodes />;
      case '/manager/analytics':
        return <ManagerAnalytics />;

      // UMKM Routes
      case '/umkm/dashboard':
      case '/umkm/profile':
      case '/umkm/products':
      case '/umkm/promotions':
        return <UMKMDashboard />;

      // Government Routes
      case '/government/dashboard':
      case '/government/trends':
      case '/government/performance':
      case '/government/reports':
        return <GovernmentDashboard />;

      // Super Admin Routes
      case '/admin/dashboard':
      case '/admin/umkm-approval':
      case '/admin/destinations':
      case '/admin/users':
        return <AdminDashboard />;

      default:
        // Default based on current role
        if (currentUser.role === 'traveler') return <TravelerHome />;
        if (currentUser.role === 'manager') return <ManagerDashboard />;
        if (currentUser.role === 'umkm') return <UMKMDashboard />;
        if (currentUser.role === 'government') return <GovernmentDashboard />;
        return <AdminDashboard />;
    }
  };

  // Tautan pintasan footer kontekstual berdasarkan role
  const getFooterLinks = () => {
    switch (currentUser.role) {
      case 'manager':
        return [
          { label: 'Dashboard', path: '/manager/dashboard' },
          { label: 'Destinasi', path: '/manager/destinations' },
          { label: 'Explore Points', path: '/manager/explore-points' },
          { label: 'Reward', path: '/manager/rewards' },
          { label: 'Analitik', path: '/manager/analytics' }
        ];
      case 'umkm':
        return [
          { label: 'Dashboard', path: '/umkm/dashboard' },
          { label: 'Usaha', path: '/umkm/profile' },
          { label: 'Produk', path: '/umkm/products' }
        ];
      case 'government':
        return [
          { label: 'Overview', path: '/government/dashboard' },
          { label: 'Tren', path: '/government/trends' },
          { label: 'Kinerja', path: '/government/performance' }
        ];
      case 'admin':
        return [
          { label: 'Overview', path: '/admin/dashboard' },
          { label: 'Verifikasi', path: '/admin/umkm-approval' },
          { label: 'Pengguna', path: '/admin/users' }
        ];
      default:
        return [
          { label: 'Jelajah Budaya', path: '/traveler/home' },
          { label: 'Panduan Rute', path: '/traveler/smart-guide' },
          { label: 'Tukar Poin', path: '/traveler/points' },
          { label: 'Album Stempel', path: '/traveler/album' }
        ];
    }
  };

  const footerLinks = getFooterLinks();

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] flex flex-col selection:bg-blue-600 selection:text-white font-sans antialiased">
      {/* Dynamic Header */}
      <AppHeader />
      
      {/* Main Container Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {renderActiveView()}
      </main>

      {/* Global QR Scanner Modal */}
      <QRScannerModal />

      {/* Authentication Modal */}
      <AuthModal />

     {/* Standard Natural Footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 px-4 sm:px-8 text-neutral-600 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-800">TAKONO</span>
            <span className="text-neutral-300">|</span>
            <span className="text-neutral-500">© 2026 Ekowisata & Budaya Indonesia.</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-500">
            {footerLinks.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigateTo(item.path)}
                className="hover:text-neutral-900 transition"
              >
                {item.label}
              </button>
            ))}
          </div>

        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <TakonoStoreProvider>
      <AppContent />
    </TakonoStoreProvider>
  );
}
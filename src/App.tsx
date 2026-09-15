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
  const { activeRoute, currentUser } = useTakonoStore();

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
      case '/admin/settings':
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

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white font-sans">
      <AppHeader />
      <main className="flex-1 pb-16">{renderActiveView()}</main>

      {/* Global QR Scanner Modal (Simulates Physical Camera & Plaque Scan) */}
      <QRScannerModal />

      {/* Authentication Modal (Login / Register) */}
      <AuthModal />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 tracking-wider">TAKONO</span>
            <span>— Ekosistem Pariwisata Berkelanjutan Terintegrasi</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Traveler → Role → Destination → Journey → Activity → Engagement → Reward → Analytics</span>
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

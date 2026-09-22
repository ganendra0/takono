import React from 'react';
import { useTakonoStore } from '../../services/store';

export const AppFooter: React.FC = () => {
  const { currentUser, navigateTo } = useTakonoStore();

  const getBreadcrumbLinks = () => {
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
          { label: 'Profil Usaha', path: '/umkm/profile' },
          { label: 'Produk', path: '/umkm/products' },
          { label: 'Promosi', path: '/umkm/promotions' }
        ];
      case 'government':
        return [
          { label: 'Overview', path: '/government/dashboard' },
          { label: 'Tren Pariwisata', path: '/government/trends' },
          { label: 'Kinerja', path: '/government/performance' },
          { label: 'Laporan', path: '/government/reports' }
        ];
      case 'admin':
        return [
          { label: 'Overview', path: '/admin/dashboard' },
          { label: 'Verifikasi', path: '/admin/umkm-approval' },
          { label: 'Destinasi', path: '/admin/destinations' },
          { label: 'Pengguna', path: '/admin/users' }
        ];
      default: // traveler
        return [
          { label: 'Jelajah Budaya', path: '/traveler/home' },
          { label: 'Panduan Rute', path: '/traveler/smart-guide' },
          { label: 'Tukar Poin', path: '/traveler/points' },
          { label: 'Album Stempel', path: '/traveler/album' }
        ];
    }
  };

  const links = getBreadcrumbLinks();

  return (
    <footer className="w-full border-t border-neutral-200/80 bg-white/80 backdrop-blur-md py-8 px-4 sm:px-8 mt-auto font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        
        {/* Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <span className="font-black tracking-widest text-neutral-900 uppercase">
            TAKONO
          </span>
          <span className="hidden sm:inline text-neutral-300">|</span>
          <span className="text-neutral-500">
            Ekosistem Pariwisata Berkelanjutan Terintegrasi
          </span>
        </div>

        {/* Breadcrumb Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-neutral-600 font-medium">
          {links.map((item, index) => (
            <React.Fragment key={item.path}>
              {index > 0 && <span className="text-neutral-300">→</span>}
              <button
                type="button"
                onClick={() => navigateTo(item.path)}
                className="hover:text-blue-600 transition font-bold"
              >
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </div>

      </div>
    </footer>
  );
};

export default AppFooter;
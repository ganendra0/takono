import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import { UserRole } from '../types/index.js';
import { Compass, Building2, Landmark, ShieldCheck } from 'lucide-react';

interface RoleSwitcherProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentPath, onNavigate }) => {
  const { user, role, switchRole } = useAuth();

  const roles: { key: UserRole; label: string; icon: any; targetPath: string; desc: string }[] = [
    { 
      key: 'traveler', 
      label: 'Wisatawan', 
      icon: Compass, 
      targetPath: '/app',
      desc: 'Budi Santoso'
    },
    { 
      key: 'destination_manager', 
      label: 'Pengelola KBS', 
      icon: Building2, 
      targetPath: '/manager',
      desc: 'Maya Indah'
    },
    { 
      key: 'government', 
      label: 'Dinas Pariwisata', 
      icon: Landmark, 
      targetPath: '/government',
      desc: 'Drs. Hendra W.'
    },
    { 
      key: 'super_admin', 
      label: 'Super Admin', 
      icon: ShieldCheck, 
      targetPath: '/admin',
      desc: 'Admin Pusat'
    }
  ];

  const handleSwitch = async (targetRole: UserRole, path: string) => {
    await switchRole(targetRole);
    onNavigate(path);
  };

  return (
    <aside aria-label="Demo role selector" className="bg-slate-900 text-white border-b border-slate-800 text-xs py-1.5 px-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-200">Mode Uji Coba Multi-Role:</span>
          <span className="hidden sm:inline">Pilih peran untuk menguji pengalaman aplikasi secara langsung</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {roles.map(r => {
            const Icon = r.icon;
            const isActive = role === r.key;
            return (
              <button
                key={r.key}
                onClick={() => handleSwitch(r.key, r.targetPath)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title={`Beralih ke role ${r.label}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
                <span className="opacity-70 text-[10px] hidden md:inline">({r.desc})</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

import React from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { db } from '../../server/database.js';
import { ShieldCheck, Users, Database, Server, RefreshCw, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types/index.js';

export const AdminDashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { user, switchRole } = useAuth();

  const userList = [
    { id: 'usr_traveler_01', name: 'Budi Santoso', email: 'budi.santoso@example.com', role: 'traveler' },
    { id: 'usr_mgr_kbs', name: 'Maya Indah (KBS)', email: 'maya.indah@kbs.id', role: 'destination_manager' },
    { id: 'usr_gov_sby', name: 'Drs. Hendra Wijaya, M.Si', email: 'hendra.w@disbudpar.surabaya.go.id', role: 'government' },
    { id: 'usr_admin_01', name: 'Super Admin TAKONO', email: 'admin@takono.id', role: 'super_admin' }
  ];

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Super Admin Console
              </h1>
              <p className="text-xs text-slate-500">
                Pusat Kontrol Sistem & Arsitektur Multi-Role TAKONO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>API Gateway: Aktif (200 OK)</span>
            </span>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold uppercase">Destinasi Pilot</span>
            <div className="text-xl font-mono font-bold text-slate-900">1 Destinasi</div>
            <div className="text-[11px] text-slate-500">KBS Surabaya (Aktif)</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold uppercase">Explore Points</span>
            <div className="text-xl font-mono font-bold text-blue-600">6 Titik</div>
            <div className="text-[11px] text-slate-500">100% Berisi Kuis & Token</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold uppercase">Mitra UMKM Terhubung</span>
            <div className="text-xl font-mono font-bold text-amber-600">3 Mitra</div>
            <div className="text-[11px] text-slate-500">Kuliner & Oleh-oleh</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold uppercase">Arsitektur DB</span>
            <div className="text-xl font-mono font-bold text-emerald-600">REST API</div>
            <div className="text-[11px] text-slate-500">In-Memory Store + Ledger</div>
          </div>
        </div>

        {/* User Role Testing Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Pengguna Terdaftar & Akses Role
              </h2>
              <p className="text-xs text-slate-500">
                Uji coba otentikasi role-based access control (RBAC) dalam 1 ketukan.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">Nama Pengguna</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Hak Akses (Role)</th>
                  <th className="p-4 text-right">Uji Coba Langsung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userList.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{u.name}</td>
                    <td className="p-4 font-mono text-[11px]">{u.email}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-mono text-[11px] font-semibold">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={async () => {
                          await switchRole(u.role as UserRole);
                          if (u.role === 'traveler') onNavigate('/app');
                          else if (u.role === 'destination_manager') onNavigate('/manager');
                          else if (u.role === 'government') onNavigate('/government');
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Beralih ke Akun Ini
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

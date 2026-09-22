import React, { useState, useEffect } from 'react';
import { useTakonoStore } from '../../services/store';
import {
  ShieldCheck,
  Building2,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  QrCode,
  Activity,
  FileCheck,
  Lock,
  Sliders,
  Award,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    users = [],
    destinations = [],
    umkmList = [],
    explorePoints = [],
    journeys = [],
    analyticsEvents = [],
    approveUMKM,
    rejectUMKM,
    updateDestination,
    activeRoute,
    navigateTo,
  } = useTakonoStore();

  // Derive tab from activeRoute
  const getTabFromRoute = (route: string): 'dashboard' | 'umkm' | 'destinations' | 'users' | 'settings' => {
    if (route.includes('/umkm-approval')) return 'umkm';
    if (route.includes('/destinations')) return 'destinations';
    if (route.includes('/users')) return 'users';
    if (route.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<'dashboard' | 'umkm' | 'destinations' | 'users' | 'settings'>(
    getTabFromRoute(activeRoute)
  );

  useEffect(() => {
    setActiveTab(getTabFromRoute(activeRoute));
  }, [activeRoute]);

  const handleTabChange = (tab: 'dashboard' | 'umkm' | 'destinations' | 'users' | 'settings') => {
    setActiveTab(tab);
    if (tab === 'dashboard') navigateTo('/admin/dashboard');
    else if (tab === 'umkm') navigateTo('/admin/umkm-approval');
    else if (tab === 'destinations') navigateTo('/admin/destinations');
    else if (tab === 'users') navigateTo('/admin/users');
    else if (tab === 'settings') navigateTo('/admin/settings');
  };

  // Toast / feedback notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const pendingUmkms = umkmList.filter((u) => u.approvalStatus === 'pending');
  const approvedUmkms = umkmList.filter((u) => u.approvalStatus === 'approved');
  const allUmkms = umkmList;

  const handleApprove = (id: string, name: string) => {
    approveUMKM(id);
    showToast(`UMKM "${name}" telah disetujui & aktif di platform!`);
  };

  const handleReject = (id: string, name: string) => {
    rejectUMKM(id, 'Dokumen atau perizinan belum memenuhi standar kualifikasi ekosistem.');
    showToast(`Pendaftaran UMKM "${name}" telah ditolak.`);
  };

  const totalPointsInCirculation = users.reduce((acc, u) => acc + (u.pointsBalance || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-stone-900 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-3xl bg-[#1C2024] text-white p-6 sm:p-8 shadow-sm border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-700 text-white">
              Super Admin Governance
            </span>
            <span className="text-xs text-stone-400">Hak Akses Tata Kelola Sistem</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            TAKONO Governance & Moderation
          </h1>
          <p className="text-xs text-stone-300 max-w-2xl font-normal">
            Verifikasi kelayakan UMKM mitra, moderasi status publikasi destinasi, audit integritas poin, dan manajemen seluruh entitas ekosistem.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700 text-xs text-stone-300">
          <span className="block font-bold text-white">Status Platform: SEHAT</span>
          <span className="text-[11px] text-stone-400 font-mono">Enkripsi & atomic ledger aktif</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="flex border-b border-stone-200 bg-stone-50/80 text-xs font-bold px-2 pt-1 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => handleTabChange('dashboard')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'border-stone-800 text-stone-900 font-bold bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Overview Platform</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('umkm')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'umkm'
                ? 'border-stone-800 text-stone-900 font-bold bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Verifikasi UMKM ({pendingUmkms.length} Tertunda)</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('destinations')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'destinations'
                ? 'border-stone-800 text-stone-900 font-bold bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Moderasi Destinasi ({destinations.length})</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('users')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'users'
                ? 'border-stone-800 text-stone-900 font-bold bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kelola Pengguna ({users.length})</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('settings')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'border-stone-800 text-stone-900 font-bold bg-white rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Pengaturan Sistem</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* TAB 1: OVERVIEW PLATFORM */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Macro Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-2 text-stone-500 text-xs mb-1">
                    <Users className="w-4 h-4 text-stone-700" />
                    <span className="font-semibold">Total Pengguna</span>
                  </div>
                  <span className="text-2xl font-extrabold font-mono text-stone-900">
                    {users.length}
                  </span>
                  <span className="text-[11px] text-stone-500 block font-medium">5 Role Terdefinisi</span>
                </div>

                <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-2 text-amber-800 text-xs mb-1">
                    <Building2 className="w-4 h-4 text-amber-700" />
                    <span className="font-semibold">Antrean UMKM</span>
                  </div>
                  <span className="text-2xl font-extrabold font-mono text-amber-800">
                    {pendingUmkms.length}
                  </span>
                  <span className="text-[11px] text-amber-700 font-semibold block">Memerlukan Review</span>
                </div>

                <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-2 text-stone-500 text-xs mb-1">
                    <MapPin className="w-4 h-4 text-stone-700" />
                    <span className="font-semibold">Total Destinasi</span>
                  </div>
                  <span className="text-2xl font-extrabold font-mono text-stone-900">
                    {destinations.length}
                  </span>
                  <span className="text-[11px] text-stone-500 block font-medium">Wisata Budaya Aktif</span>
                </div>

                <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-2 text-emerald-800 text-xs mb-1">
                    <Activity className="w-4 h-4 text-emerald-700" />
                    <span className="font-semibold">Poin Beredar</span>
                  </div>
                  <span className="text-2xl font-extrabold font-mono text-emerald-800">
                    {totalPointsInCirculation.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[11px] text-emerald-800 font-semibold block">Atomic Ledger Terlindungi</span>
                </div>
              </div>

              {/* Quick Actions & Recent Pending UMKM */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-stone-900">
                    UMKM Menunggu Verifikasi ({pendingUmkms.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleTabChange('umkm')}
                    className="text-xs font-bold text-stone-700 hover:text-stone-900 cursor-pointer"
                  >
                    Buka Modul Verifikasi →
                  </button>
                </div>

                {pendingUmkms.length === 0 ? (
                  <div className="p-8 text-center text-stone-400 text-xs border border-dashed border-stone-200 rounded-3xl">
                    Semua pendaftaran UMKM telah diproses dan diverifikasi.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingUmkms.slice(0, 3).map((u) => (
                      <div
                        key={u.id}
                        className="p-5 rounded-3xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                            {u.category}
                          </span>
                          <h4 className="font-bold text-sm text-stone-900">{u.businessName}</h4>
                          <p className="text-xs text-stone-600 font-normal">
                            Pemilik: {u.ownerName} • {u.address}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => handleReject(u.id, u.businessName)}
                            className="px-3.5 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
                          >
                            Tolak
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApprove(u.id, u.businessName)}
                            className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                          >
                            Setujui & Terbitkan
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: UMKM APPROVAL */}
          {activeTab === 'umkm' && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 text-sm">Daftar Pengajuan UMKM Mitra</h3>
              <div className="space-y-3">
                {allUmkms.map((u) => (
                  <div
                    key={u.id}
                    className="p-5 rounded-3xl border border-stone-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            u.approvalStatus === 'approved'
                              ? 'bg-emerald-100 text-emerald-900'
                              : u.approvalStatus === 'rejected'
                              ? 'bg-rose-100 text-rose-900'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {u.approvalStatus}
                        </span>
                        <span className="text-xs text-stone-400 capitalize">{u.category}</span>
                      </div>
                      <h4 className="font-bold text-sm text-stone-900">{u.businessName}</h4>
                      <p className="text-xs text-stone-600 font-normal">{u.description}</p>
                    </div>

                    {u.approvalStatus === 'pending' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleReject(u.id, u.businessName)}
                          className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold cursor-pointer"
                        >
                          Tolak
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprove(u.id, u.businessName)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-600 text-xs font-bold cursor-pointer"
                        >
                          Setujui
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DESTINATIONS */}
          {activeTab === 'destinations' && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 text-sm">Moderasi Status Destinasi Wisata</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {destinations.map((d) => (
                  <div key={d.id} className="p-5 rounded-3xl border border-stone-200 bg-white space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{d.name}</h4>
                        <p className="text-xs text-stone-500">{d.regency}, {d.province}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                        {d.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-2">{d.description}</p>
                    <div className="flex gap-2 pt-2 border-t border-stone-100">
                      <button
                        onClick={() => updateDestination(d.id, { status: d.status === 'published' ? 'draft' : 'published' })}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition cursor-pointer"
                      >
                        Ubah ke {d.status === 'published' ? 'Draft' : 'Published'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: USERS */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 text-sm">Daftar Akun Pengguna</h3>
              <div className="divide-y divide-stone-100">
                {users.map((u) => (
                  <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full border border-stone-200" />
                      <div>
                        <strong className="block font-bold text-stone-900">{u.name}</strong>
                        <span className="text-stone-400">{u.email}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md bg-stone-100 font-bold uppercase text-[10px] text-stone-700">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 text-xs text-stone-600">
              <h3 className="font-bold text-stone-900 text-sm">Pengaturan Sistem & Keamanan</h3>
              <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200 space-y-2">
                <p><strong>Database:</strong> MySQL Live connection active with Express engine.</p>
                <p><strong>Ledger Poin:</strong> Transaksi poin terisolasi secara transaksional (*atomic updates*).</p>
                <p><strong>Audit Log:</strong> Seluruh event pemindaian QR terekam ke tabel analitik pemerintah.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

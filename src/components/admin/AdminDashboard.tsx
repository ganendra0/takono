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
  Sparkles,
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
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-purple-900 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-300" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-md border border-purple-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500 text-white">
              Super Admin Ecosystem Control
            </span>
            <span className="text-xs text-purple-300">Level Hak Akses Tertinggi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            TAKONO Governance & Moderation
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Verifikasi kelayakan UMKM mitra, moderasi status publikasi destinasi, audit integritas poin, dan manajemen seluruh entitas ekosistem.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-700/50 text-xs text-purple-200">
          <span className="block font-semibold text-white">Status Platform: SEHAT</span>
          <span className="text-[11px]">Enkripsi & atomic ledger aktif</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => handleTabChange('dashboard')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'border-purple-600 text-purple-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Overview Platform</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('umkm')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'umkm'
                ? 'border-purple-600 text-purple-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Verifikasi UMKM ({pendingUmkms.length} Tertunda)</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('destinations')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'destinations'
                ? 'border-purple-600 text-purple-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Moderasi Destinasi ({destinations.length})</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('users')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-purple-600 text-purple-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kelola Pengguna ({users.length})</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('settings')}
            className={`px-5 py-3 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-purple-600 text-purple-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Pengaturan Sistem & Audit</span>
          </button>
        </div>

        <div className="p-6">
          {/* TAB 1: OVERVIEW PLATFORM */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Macro Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Total Pengguna</span>
                  </div>
                  <span className="text-2xl font-bold font-mono text-slate-900">
                    {users.length}
                  </span>
                  <span className="text-[11px] text-slate-500 block">5 Role Terdefinisi</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <span>Antrean UMKM</span>
                  </div>
                  <span className="text-2xl font-bold font-mono text-amber-700">
                    {pendingUmkms.length}
                  </span>
                  <span className="text-[11px] text-amber-600 font-medium block">Memerlukan Review</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>Total Destinasi</span>
                  </div>
                  <span className="text-2xl font-bold font-mono text-slate-900">
                    {destinations.length}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium block">
                    {destinations.filter((d) => d.status === 'published').length} Terpublikasi
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Poin Beredar</span>
                  </div>
                  <span className="text-2xl font-bold font-mono text-emerald-700">
                    {totalPointsInCirculation}
                  </span>
                  <span className="text-[11px] text-slate-500 block">Buku Besar Terlindungi</span>
                </div>
              </div>

              {/* Quick Action Shortcuts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-amber-950">Antrean Verifikasi UMKM</h4>
                    <p className="text-xs text-amber-800 mt-1">
                      Terdapat {pendingUmkms.length} permohonan kemitraan UMKM yang menunggu keputusan persetujuan dari Super Admin.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTabChange('umkm')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                  >
                    <span>Periksa Antrean UMKM</span>
                  </button>
                </div>

                <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-blue-950">Moderasi Status Destinasi</h4>
                    <p className="text-xs text-blue-800 mt-1">
                      Kelola hak tayang destinasi wisata desa untuk memastikan seluruh konten etika & plakat QR siap dikunjungi traveler.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTabChange('destinations')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                  >
                    <span>Buka Moderasi Destinasi</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VERIFIKASI UMKM */}
          {activeTab === 'umkm' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Antrean Verifikasi Dokumen & Legalitas UMKM
                  </h3>
                  <p className="text-xs text-slate-500">
                    Setujui atau tolak pendaftaran pelaku usaha lokal untuk menjaga standar ekosistem.
                  </p>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  Total Terdaftar: {allUmkms.length}
                </span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {allUmkms.map((umkm) => (
                  <div
                    key={umkm.id}
                    className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/70 transition text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={umkm.imageUrl}
                        alt={umkm.businessName}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{umkm.businessName}</h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              umkm.approvalStatus === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : umkm.approvalStatus === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {umkm.approvalStatus}
                          </span>
                        </div>
                        <p className="text-slate-500">{umkm.description}</p>
                        <span className="text-[11px] text-slate-400 block">
                          Alamat: {umkm.address} • Kategori: {umkm.category} • Produk: {umkm.products?.length || 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {umkm.approvalStatus !== 'approved' && (
                        <button
                          type="button"
                          onClick={() => handleApprove(umkm.id, umkm.businessName)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-1 shadow-xs transition"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Setujui (Approve)</span>
                        </button>
                      )}
                      {umkm.approvalStatus !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => handleReject(umkm.id, umkm.businessName)}
                          className="px-3.5 py-1.5 border border-rose-300 hover:bg-rose-50 text-rose-700 font-semibold rounded-lg flex items-center gap-1 transition"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Tolak (Reject)</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MODERASI DESTINASI */}
          {activeTab === 'destinations' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Moderasi Status Publikasi Destinasi
                </h3>
                <p className="text-xs text-slate-500">
                  Destinasi hanya boleh dipublikasikan jika memiliki konten edukasi etika dan titik jelajah yang memadai.
                </p>
              </div>

              <div className="space-y-3">
                {destinations.map((d) => {
                  const destPoints = explorePoints.filter((p) => p.destinationId === d.id);
                  return (
                    <div
                      key={d.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{d.name}</h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              d.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            Status: {d.status}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-0.5">
                          {d.regency}, {d.province} • Pengelola: {d.managerName} ({destPoints.length} Titik Jelajah)
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {d.status !== 'published' ? (
                          <button
                            type="button"
                            onClick={() => {
                              updateDestination(d.id, { status: 'published' });
                              showToast(`Destinasi "${d.name}" berhasil dipublikasikan!`);
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs transition"
                          >
                            Publikasikan (Publish)
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              updateDestination(d.id, { status: 'draft' });
                              showToast(`Destinasi "${d.name}" diubah ke status Draft.`);
                            }}
                            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition"
                          >
                            Ubah Jadi Draft
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: KELOLA PENGGUNA */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Daftar Akun Pengguna Platform</h3>
                <p className="text-xs text-slate-500">
                  Data seluruh akun pengguna berdasarkan 5 peran sistem (Traveler, Manager, UMKM, Govt, Admin).
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5">Nama</th>
                      <th className="px-4 py-2.5">Email</th>
                      <th className="px-4 py-2.5">Peran (Role)</th>
                      <th className="px-4 py-2.5">Saldo Jejak Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3 font-semibold text-slate-900">{u.name}</td>
                        <td className="px-4 py-3 text-slate-500 font-mono">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-amber-700">
                          {u.pointsBalance || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: PENGATURAN SISTEM & AUDIT */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Pengaturan Keamanan & Log Audit Sistem
                </h3>
                <p className="text-xs text-slate-500">
                  Konfigurasi aturan insentif poin dan rekam jejak aktivitas real-time.
                </p>
              </div>

              {/* Security parameters */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wider block">
                  Aturan Keamanan Anti-Fraud TAKONO:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-900 block">Buku Besar Poin Atomik</span>
                    <span className="text-slate-600 text-[11px]">Poin tidak dapat dimodifikasi di browser; hanya tercatat lewat event QR resmi.</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-900 block">Kuis Sekali Tuntas (Idempotent)</span>
                    <span className="text-slate-600 text-[11px]">Poin kuis hanya diberikan 1x per titik jelajah untuk mencegah farming poin.</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-900 block">Verifikasi UMKM Wajib</span>
                    <span className="text-slate-600 text-[11px]">Voucher dan produk UMKM hanya aktif setelah disetujui Super Admin.</span>
                  </div>
                </div>
              </div>

              {/* Audit trail list */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Audit Log Aktivitas ({analyticsEvents.length} Event Terakhir)
                </h4>
                <div className="space-y-2 max-h-80 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                  {analyticsEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                          {evt.eventType}
                        </span>
                        <span className="text-slate-700 font-mono">{evt.targetId || 'Sistem'}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(evt.timestamp).toLocaleTimeString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

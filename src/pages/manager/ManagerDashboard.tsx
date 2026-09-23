import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../lib/api.js';
import { Destination, TourismStats, ExplorePoint } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { 
  Building2, 
  MapPin, 
  Footprints, 
  Calendar, 
  Gift, 
  Store, 
  Plus, 
  QrCode, 
  Sparkles, 
  AlertCircle,
  Clock,
  TrendingUp,
  FileText
} from 'lucide-react';
import { DemoDataNotice } from '../../components/DemoDataNotice.js';

interface ManagerDashboardProps {
  onNavigate: (path: string) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [stats, setStats] = useState<TourismStats | null>(null);
  const [explorePoints, setExplorePoints] = useState<ExplorePoint[]>([]);
  const [disclaimer, setDisclaimer] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // New point modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Edukasi');
  const [newDesc, setNewDesc] = useState('');
  const [newStory, setNewStory] = useState('');
  const [newEdu, setNewEdu] = useState('');
  const [newPoints, setNewPoints] = useState('10');

  useEffect(() => {
    const fetchManagerData = async () => {
      setIsLoading(true);
      const [dashRes, ptsRes] = await Promise.all([
        ApiClient.getManagerDashboard(),
        ApiClient.getManagerExplorePoints()
      ]);

      if (dashRes.success && dashRes.data) {
        setDestination(dashRes.data.destination);
        setStats(dashRes.data.stats);
        setDisclaimer(dashRes.data.terminologyDisclaimer);
      }

      if (ptsRes.success && ptsRes.data) {
        setExplorePoints(ptsRes.data);
      }

      setIsLoading(false);
    };

    fetchManagerData();
  }, []);

  const handleCreatePoint = async () => {
    if (!newName.trim()) return;

    const res = await ApiClient.createExplorePoint({
      name: newName,
      category: newCategory as any,
      description: newDesc,
      story: newStory,
      educationalContent: newEdu,
      pointsReward: parseInt(newPoints) || 10
    });

    if (res.success && res.data) {
      setExplorePoints([...explorePoints, res.data]);
      setIsCreateModalOpen(false);
      setNewName('');
      setNewDesc('');
      setNewStory('');
      setNewEdu('');
    }
  };

  const handleDeletePoint = async (id: string) => {
    if (!confirm('Yakin ingin menghapus titik jelajah ini?')) return;
    const res = await ApiClient.deleteExplorePoint(id);
    if (res.success) {
      setExplorePoints(explorePoints.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header Card */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Portal Pengelola Destinasi
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold">
                  KBS Surabaya
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pengelola: {user?.name || 'Maya Indah'} ({user?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Titik Jelajah Baru</span>
            </button>

            <button
              onClick={() => onNavigate('/app/smart-guide')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Lihat di Smart Guide
            </button>
          </div>
        </div>

        {/* Terminology Transparency Disclaimer */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Ketentuan Metrik Transparansi:</span> {disclaimer}
          </div>
        </div>

        <DemoDataNotice />

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Titik Explore Aktif</span>
            <div className="text-2xl font-mono font-extrabold text-slate-900">
              {explorePoints.length}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">Semua terbit di peta</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Interaksi Penjelajah</span>
            <div className="text-2xl font-mono font-extrabold text-blue-600">
              {stats?.totalPlatformActivities || 142}
            </div>
            <span className="text-[11px] text-slate-500">Aktivitas aplikasi tercatat</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Kuis Berhasil Dijawab</span>
            <div className="text-2xl font-mono font-extrabold text-emerald-600">
              {stats?.totalQuizzesCompleted || 38}
            </div>
            <span className="text-[11px] text-slate-500">Skor edukasi tervalidasi</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Klaim Voucher Mitra</span>
            <div className="text-2xl font-mono font-extrabold text-amber-600">
              {stats?.totalRewardsRedeemed || 19}
            </div>
            <span className="text-[11px] text-slate-500">Ekonomi UMKM terdorong</span>
          </div>

        </div>

        {/* Explore Points Management Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Manajemen Titik Jelajah (Explore Points)
              </h2>
              <p className="text-xs text-slate-500">
                Titik fisik dengan token QR aman, konten edukasi kurasi, dan kuis berhadiah.
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold cursor-pointer border border-blue-200"
            >
              + Tambah Titik
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">Nama Titik</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Token QR Aman</th>
                  <th className="p-4">Estimasi Durasi</th>
                  <th className="p-4">Reward Poin</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {explorePoints.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div>{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal font-mono">{p.slug}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-medium">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-blue-600">
                      {p.secureToken}
                    </td>
                    <td className="p-4">{p.estimatedDuration}</td>
                    <td className="p-4 font-mono font-bold text-slate-900">+{p.pointsReward} Pts</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => onNavigate(`/app/explore/${p.slug}`)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium cursor-pointer"
                      >
                        Pratinjau
                      </button>
                      <button
                        onClick={() => handleDeletePoint(p.id)}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md font-medium cursor-pointer"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* CREATE EXPLORE POINT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                Tambah Explore Point Baru
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Titik / Wahana</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Contoh: Kandang Beruang Madu"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Edukasi">Edukasi</option>
                    <option value="Sejarah">Sejarah</option>
                    <option value="Keluarga">Keluarga</option>
                    <option value="Alam">Alam</option>
                    <option value="Foto">Foto</option>
                    <option value="Santai">Santai</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hadiah Jejak Points</label>
                  <input
                    type="number"
                    value={newPoints}
                    onChange={e => setNewPoints(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu rute..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kisah & Narasi Edukasi Mendalam</label>
                <textarea
                  rows={3}
                  value={newStory}
                  onChange={e => setNewStory(e.target.value)}
                  placeholder="Tuliskan cerita sejarah atau informasi konservasi menarik..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                ></textarea>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Fakta Ilmiah Hayati</label>
                <textarea
                  rows={2}
                  value={newEdu}
                  onChange={e => setNewEdu(e.target.value)}
                  placeholder="Status konservasi, persebaran habitat alami..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleCreatePoint}
                disabled={!newName.trim()}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
              >
                Simpan & Terbitkan Titik
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

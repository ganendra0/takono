import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { 
  Compass, 
  Plus, 
  Edit3, 
  Clock, 
  Coins, 
  MapPin, 
  ArrowLeft, 
  Trash2, 
  CheckCircle2, 
  X, 
  Image as ImageIcon,
  ChevronDown
} from 'lucide-react';

export const ManagerExplorePoints: React.FC = () => {
  const store = useTakonoStore();
  const destinations = store.destinations || [];
  const explorePoints = store.explorePoints || [];
  const navigateTo = store.navigateTo;

  const [selectedDestId, setSelectedDestId] = useState<string>(
    destinations[0]?.id || 'dest-penglipuran'
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<any | null>(null);

  // Fallback gambar jika URL rusak atau kosong
  const defaultImages: Record<string, string> = {
    'ARCHITECTURE': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80',
    'NATURE': 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=400&q=80',
    'CRAFT': 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=400&q=80',
    'DEFAULT': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80'
  };

  // Filter titik lokasi berdasarkan destinasi terpilih
  const points = explorePoints.filter((p) => p.destinationId === selectedDestId);

  // Handle Edit/Add Modal
  const handleOpenModal = (point?: any) => {
    if (point) {
      setEditingPoint({ ...point });
    } else {
      setEditingPoint({
        id: `pt-${Date.now()}`,
        destinationId: selectedDestId,
        title: '',
        category: 'ARCHITECTURE',
        description: '',
        location: '',
        estimatedMinutes: 15,
        rewardPoints: 5,
        imageUrl: '',
        qrCodeId: `QR-POINT-${selectedDestId.toUpperCase()}-${points.length + 1}`
      });
    }
    setIsModalOpen(true);
  };

  const handleSavePoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPoint) return;

    const existingIdx = store.explorePoints.findIndex((p) => p.id === editingPoint.id);
    if (existingIdx !== -1) {
      store.explorePoints[existingIdx] = { ...editingPoint };
    } else {
      store.explorePoints.push({ ...editingPoint });
    }

    setIsModalOpen(false);
    setEditingPoint(null);
  };

  const handleDeletePoint = (pointId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus titik jelajah ini?')) {
      const filtered = store.explorePoints.filter((p) => p.id !== pointId);
      store.explorePoints = filtered;
      // Triggers re-render
      setSelectedDestId(selectedDestId);
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-neutral-800 antialiased max-w-7xl mx-auto">
      
      {/* 1. TOP HEADER & NAVIGATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => navigateTo('/manager/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-blue-600 transition mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Kelola Titik Jelajah (Explore Points)
          </h1>
        </div>

        {/* Action Bar: Destinasi Selector & Tambah Button */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative inline-block text-left">
            <select
              value={selectedDestId}
              onChange={(e) => setSelectedDestId(e.target.value)}
              className="appearance-none bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 font-sans text-xs font-bold py-2.5 pl-4 pr-10 rounded-2xl cursor-pointer transition shadow-2xs focus:outline-none focus:border-blue-500"
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition flex items-center gap-2 shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Titik Jelajah</span>
          </button>
        </div>
      </div>

      {/* 2. EXPLORE POINTS LIST */}
      <div className="space-y-4">
        {points.length > 0 ? (
          points.map((pt, idx) => {
            const imgSrc = pt.imageUrl || defaultImages[pt.category] || defaultImages['DEFAULT'];

            return (
              <div
                key={pt.id}
                className="group bg-white rounded-3xl border border-neutral-200 p-5 sm:p-6 hover:border-blue-200 hover:shadow-lg transition duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              >
                {/* Kiri: Nomor, Thumbnail & Info Titik */}
                <div className="flex items-start gap-4 sm:gap-6 w-full">
                  
                  {/* Badge Nomor Urut */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center font-mono font-black text-sm text-neutral-700 shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition">
                    #{idx + 1}
                  </div>

                  {/* Thumbnail Gambar */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shrink-0 relative">
                    <img
                      src={imgSrc}
                      alt={pt.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultImages['DEFAULT'];
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Rincian Teks */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-100">
                        {pt.category || 'CULTURE'}
                      </span>
                      <span className="text-neutral-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{pt.estimatedMinutes || 15} menit</span>
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-neutral-900 group-hover:text-blue-600 transition">
                      {pt.title}
                    </h3>

                    <p className="text-xs text-neutral-500 line-clamp-1 leading-relaxed">
                      {pt.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400 pt-1">
                      <span>Lokasi: <strong className="text-neutral-700">{pt.location || 'Zona Utama'}</strong></span>
                      <span>•</span>
                      <span className="text-amber-600 font-bold">+{pt.rewardPoints || 5} PTS</span>
                    </div>
                  </div>
                </div>

                {/* Kanan: Tombol Aksi */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(pt)}
                    className="px-4 py-2 bg-neutral-100 hover:bg-blue-50 text-neutral-700 hover:text-blue-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-neutral-200"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Sunting</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletePoint(pt.id)}
                    className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Hapus Titik"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-3">
            <Compass className="w-10 h-10 text-neutral-300 mx-auto" />
            <h3 className="font-extrabold text-neutral-900 text-sm">Belum Ada Titik Jelajah</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Tambahkan titik penjelajahan budaya pertama untuk destinasi ini agar traveler dapat melakukan check-in via QR.
            </p>
          </div>
        )}
      </div>

      {/* 3. MODAL EDIT / TAMBAH TITIK JELAJAH */}
      {isModalOpen && editingPoint && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-neutral-200 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2 text-neutral-900">
                <Compass className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base">
                  {editingPoint.title ? 'Sunting Titik Jelajah' : 'Tambah Titik Jelajah Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePoint} className="space-y-4 text-xs font-bold">
              
              <div className="space-y-1.5">
                <label className="text-neutral-700 block">Judul Titik Jelajah</label>
                <input
                  type="text"
                  value={editingPoint.title}
                  onChange={(e) => setEditingPoint({ ...editingPoint, title: e.target.value })}
                  placeholder="Contoh: Angkul-Angkul Tradisional"
                  className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-900 bg-neutral-50/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-neutral-700 block">Kategori</label>
                  <select
                    value={editingPoint.category}
                    onChange={(e) => setEditingPoint({ ...editingPoint, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-900 bg-neutral-50/50"
                  >
                    <option value="ARCHITECTURE">ARCHITECTURE</option>
                    <option value="NATURE">NATURE</option>
                    <option value="CRAFT">CRAFT</option>
                    <option value="CULINARY">CULINARY</option>
                    <option value="HISTORY">HISTORY</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-700 block">Estimasi Durasi (menit)</label>
                  <input
                    type="number"
                    value={editingPoint.estimatedMinutes}
                    onChange={(e) => setEditingPoint({ ...editingPoint, estimatedMinutes: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-900 bg-neutral-50/50 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-neutral-700 block">Reward Poin (+PTS)</label>
                  <input
                    type="number"
                    value={editingPoint.rewardPoints}
                    onChange={(e) => setEditingPoint({ ...editingPoint, rewardPoints: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-900 bg-neutral-50/50 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-700 block">Lokasi Spesifik</label>
                  <input
                    type="text"
                    value={editingPoint.location}
                    onChange={(e) => setEditingPoint({ ...editingPoint, location: e.target.value })}
                    placeholder="Contoh: Pintu Masuk Utama"
                    className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-900 bg-neutral-50/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-700 block">URL Foto Lokasi</label>
                <input
                  type="url"
                  value={editingPoint.imageUrl}
                  onChange={(e) => setEditingPoint({ ...editingPoint, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-800 bg-neutral-50/50 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-700 block">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  value={editingPoint.description}
                  onChange={(e) => setEditingPoint({ ...editingPoint, description: e.target.value })}
                  placeholder="Jelaskan sejarah dan keunikan titik ini..."
                  className="w-full p-3 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-800 bg-neutral-50/50 leading-relaxed font-normal"
                />
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 font-bold transition hover:bg-neutral-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold transition shadow-md shadow-blue-500/20"
                >
                  Simpan Titik
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManagerExplorePoints;
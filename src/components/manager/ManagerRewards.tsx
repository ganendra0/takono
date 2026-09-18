import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { 
  Gift, 
  Plus, 
  Edit3, 
  Trash2, 
  Coins, 
  ArrowLeft, 
  X, 
  ChevronDown, 
  Store, 
  Package
} from 'lucide-react';

export const ManagerRewards: React.FC = () => {
  const store = useTakonoStore();
  const destinations = store.destinations || [];
  const rewards = store.rewards || [];
  const navigateTo = store.navigateTo;

  // Memanggil fungsi aksi dari store
  const addReward = (store as any).addReward;
  const updateReward = (store as any).updateReward;
  const deleteReward = (store as any).deleteReward;

  const [selectedDestId, setSelectedDestId] = useState<string>(
    destinations[0]?.id || 'dest-penglipuran'
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingReward, setEditingReward] = useState<any | null>(null);

  // Fallback gambar sesuai kategori reward
  const defaultRewardImages: Record<string, string> = {
    'SOUVENIR': 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
    'VOUCHER': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    'FOOD': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    'DEFAULT': 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80'
  };

  // Filter reward berdasarkan destinasi terpilih
  const displayRewards = rewards.filter((r) => !r.destinationId || r.destinationId === selectedDestId);

  const handleOpenModal = (reward?: any) => {
    if (reward) {
      setEditingReward({ ...reward });
    } else {
      setEditingReward({
        id: `rw-${Date.now()}`,
        destinationId: selectedDestId,
        title: '',
        description: '',
        category: 'SOUVENIR',
        pointsCost: 35,
        stockAvailable: 20,
        stockTotal: 30,
        merchantName: 'Perajin Lokal Desa Adat',
        imageUrl: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReward) return;

    const existingIdx = store.rewards.findIndex((r) => r.id === editingReward.id);

    if (existingIdx !== -1) {
      // Pembaruan data di store
      if (updateReward) {
        updateReward(editingReward.id, editingReward);
      } else {
        store.rewards[existingIdx] = { ...editingReward };
      }
    } else {
      // Penambahan data baru ke store
      if (addReward) {
        addReward(editingReward);
      } else {
        store.rewards.push({ ...editingReward });
      }
    }

    setIsModalOpen(false);
    setEditingReward(null);
  };

  const handleDeleteReward = (rewardId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus reward ini dari katalog?')) {
      if (deleteReward) {
        deleteReward(rewardId);
      } else {
        store.rewards = store.rewards.filter((r) => r.id !== rewardId);
        setSelectedDestId(selectedDestId); // Trigger re-render
      }
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-neutral-800 antialiased max-w-7xl mx-auto">
      
      {/* 1. TOP HEADER & ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => navigateTo('/manager/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-blue-600 transition mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard Manager</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Kelola Katalog Reward Wisatawan
          </h1>
        </div>

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
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition flex items-center gap-2 shadow-md shadow-blue-500/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Reward</span>
          </button>
        </div>
      </div>

      {/* 2. REWARDS CATALOG GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayRewards.length > 0 ? (
          displayRewards.map((rw) => {
            const imgSrc = rw.imageUrl || defaultRewardImages[rw.category] || defaultRewardImages['DEFAULT'];

            return (
              <div
                key={rw.id}
                className="group bg-white rounded-3xl border border-neutral-200 overflow-hidden hover:border-blue-200 hover:shadow-lg transition duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Aspect Ratio Image Container */}
                  <div className="relative h-48 w-full bg-neutral-100 overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={rw.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultRewardImages['DEFAULT'];
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* Cost Badge */}
                    <div className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-mono font-black border border-white/20 shadow-md flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-blue-200" />
                      <span>{rw.pointsCost || rw.pointsRequired || 35} PTS</span>
                    </div>

                    {/* Category Tag */}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border border-white/20">
                      {rw.category || 'SOUVENIR'}
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 space-y-3">
                    <h3 className="font-extrabold text-base text-neutral-900 group-hover:text-blue-600 transition leading-snug">
                      {rw.title}
                    </h3>

                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {rw.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs border-t border-neutral-100">
                      <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
                        <Store className="w-3.5 h-3.5 text-blue-600" />
                        <span>{rw.merchantName || 'Mitra UMKM Desa'}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-neutral-700">
                        <Package className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Stok: {rw.stockAvailable ?? rw.stock ?? 18} / {rw.stockTotal ?? 30}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-neutral-50/60 border-t border-neutral-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(rw)}
                    className="w-full py-2 bg-white hover:bg-blue-50 text-neutral-700 hover:text-blue-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-neutral-200 shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Sunting Reward</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteReward(rw.id)}
                    className="ml-2 p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Hapus Reward"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-3">
            <Gift className="w-10 h-10 text-neutral-300 mx-auto" />
            <h3 className="font-extrabold text-neutral-900 text-sm">Katalog Reward Kosong</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Tambahkan produk voucher atau cinderamata mitra UMKM lokal pertama untuk destinasi ini.
            </p>
          </div>
        )}
      </div>

      {/* 3. MODAL EDIT / TAMBAH REWARD */}
      {isModalOpen && editingReward && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-neutral-200 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2 text-neutral-900">
                <Gift className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base">
                  {editingReward.title ? 'Sunting Reward Wisatawan' : 'Tambah Reward Baru'}
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

            <form onSubmit={handleSaveReward} className="space-y-4 text-xs font-bold">
              
              <div className="space-y-1.5">
                <label className="text-neutral-700 block">Nama Reward / Produk</label>
                <input
                  type="text"
                  value={editingReward.title}
                  onChange={(e) => setEditingReward({ ...editingReward, title: e.target.value })}
                  placeholder="Contoh: Gantungan Kunci Anyaman Bambu"
                  className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-900 bg-neutral-50/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-neutral-700 block">Kategori</label>
                  <select
                    value={editingReward.category}
                    onChange={(e) => setEditingReward({ ...editingReward, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-900 bg-neutral-50/50"
                  >
                    <option value="SOUVENIR">SOUVENIR</option>
                    <option value="VOUCHER">VOUCHER</option>
                    <option value="FOOD">KULINER</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-700 block">Biaya Penukaran (Poin)</label>
                  <input
                    type="number"
                    value={editingReward.pointsCost}
                    onChange={(e) => setEditingReward({ ...editingReward, pointsCost: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-900 bg-neutral-50/50 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-neutral-700 block">Stok Tersedia</label>
                  <input
                    type="number"
                    value={editingReward.stockAvailable}
                    onChange={(e) => setEditingReward({ ...editingReward, stockAvailable: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-900 bg-neutral-50/50 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-700 block">Total Kuota Stok</label>
                  <input
                    type="number"
                    value={editingReward.stockTotal}
                    onChange={(e) => setEditingReward({ ...editingReward, stockTotal: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-900 bg-neutral-50/50 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-700 block">Nama Mitra UMKM</label>
                <input
                  type="text"
                  value={editingReward.merchantName}
                  onChange={(e) => setEditingReward({ ...editingReward, merchantName: e.target.value })}
                  placeholder="Contoh: Perajin Bambu Penglipuran"
                  className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-900 bg-neutral-50/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-700 block">URL Foto Produk</label>
                <input
                  type="url"
                  value={editingReward.imageUrl}
                  onChange={(e) => setEditingReward({ ...editingReward, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-800 bg-neutral-50/50 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-700 block">Deskripsi Produk</label>
                <textarea
                  rows={3}
                  value={editingReward.description}
                  onChange={(e) => setEditingReward({ ...editingReward, description: e.target.value })}
                  placeholder="Jelaskan detail cenderamata/voucher ini..."
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
                  Simpan Reward
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManagerRewards;
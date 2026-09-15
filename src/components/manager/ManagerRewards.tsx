import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { DestinationReward } from '../../types/destination';
import { Award, Plus, ArrowLeft, Edit3, X, Coins, ShoppingBag } from 'lucide-react';

export const ManagerRewards: React.FC = () => {
  const {
    destinations,
    rewards,
    umkmList,
    addReward,
    updateReward,
    navigateTo,
  } = useTakonoStore();

  const [selectedDestId, setSelectedDestId] = useState<string>(destinations[0]?.id || '');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingReward, setEditingReward] = useState<DestinationReward | null>(null);

  // Form states
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [pointsCost, setPointsCost] = useState<number>(30);
  const [initialStock, setInitialStock] = useState<number>(50);
  const [category, setCategory] = useState<'culinary' | 'souvenir' | 'ticket' | 'workshop'>('culinary');
  const [umkmId, setUmkmId] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800');
  const [terms, setTerms] = useState<string>('Tunjukkan kode voucher ke kasir mitra sebelum pemesanan.');
  const [validUntil, setValidUntil] = useState<string>('2026-12-31');

  const destRewards = rewards.filter((r) => r.destinationId === selectedDestId);
  const destinationUmkms = umkmList.filter((u) => u.associatedDestinationIds.includes(selectedDestId));

  const handleOpenAddModal = () => {
    setEditingReward(null);
    setTitle('');
    setDescription('');
    setPointsCost(30);
    setInitialStock(50);
    setCategory('culinary');
    setUmkmId(destinationUmkms[0]?.id || '');
    setImageUrl('https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800');
    setTerms('Tunjukkan kode voucher ke kasir mitra sebelum memesan.');
    setValidUntil('2026-12-31');
    setModalOpen(true);
  };

  const handleOpenEditModal = (reward: DestinationReward) => {
    setEditingReward(reward);
    setTitle(reward.title);
    setDescription(reward.description);
    setPointsCost(reward.pointsCost);
    setInitialStock(reward.initialStock);
    setCategory(reward.category);
    setUmkmId(reward.umkmId || '');
    setImageUrl(reward.imageUrl);
    setTerms(reward.terms);
    setValidUntil(reward.validUntil);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReward) {
      updateReward(editingReward.id, {
        title,
        description,
        pointsCost,
        initialStock,
        currentStock: Math.min(editingReward.currentStock, initialStock),
        category,
        umkmId: umkmId || undefined,
        imageUrl,
        terms,
        validUntil,
      });
    } else {
      addReward({
        destinationId: selectedDestId,
        title,
        description,
        pointsCost,
        initialStock,
        currentStock: initialStock,
        category,
        umkmId: umkmId || undefined,
        imageUrl,
        terms,
        validUntil,
        status: 'available',
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigateTo('/manager/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Manager</span>
          </button>
          <h1 className="text-xl font-bold text-slate-900">Kelola Katalog Reward Wisatawan</h1>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDestId}
            onChange={(e) => setSelectedDestId(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-medium"
          >
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Reward</span>
          </button>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {destRewards.map((reward) => (
          <div
            key={reward.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="h-40 overflow-hidden relative">
                <img
                  src={reward.imageUrl}
                  alt={reward.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white font-mono shadow-xs">
                    {reward.pointsCost} Poin
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  {reward.category}
                </span>
                <h3 className="font-bold text-sm text-slate-900">{reward.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{reward.description}</p>
                <div className="pt-2 text-[11px] text-slate-600 flex justify-between">
                  <span>Stok Tersedia:</span>
                  <strong className="font-mono">
                    {reward.currentStock} / {reward.initialStock}
                  </strong>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                type="button"
                onClick={() => handleOpenEditModal(reward)}
                className="w-full py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Sunting Reward</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit Reward */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-bold text-sm">
                {editingReward ? 'Sunting Item Reward' : 'Tambah Item Reward Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Judul Reward</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Contoh: Voucher Diskon Rp 15.000 Kuliner Khas"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Biaya Poin (Cost)</label>
                  <input
                    type="number"
                    value={pointsCost}
                    onChange={(e) => setPointsCost(parseInt(e.target.value) || 10)}
                    required
                    min={1}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Jumlah Stok</label>
                  <input
                    type="number"
                    value={initialStock}
                    onChange={(e) => setInitialStock(parseInt(e.target.value) || 10)}
                    required
                    min={1}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  >
                    <option value="culinary">Kuliner</option>
                    <option value="souvenir">Cinderamata</option>
                    <option value="workshop">Workshop & Edukasi</option>
                    <option value="ticket">Tiket & Akses</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Mitra UMKM Terkait</label>
                  <select
                    value={umkmId}
                    onChange={(e) => setUmkmId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  >
                    <option value="">-- Tanpa UMKM (Pengelola Langsung) --</option>
                    {destinationUmkms.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.businessName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Deskripsi Reward</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Syarat & Ketentuan Penukaran</label>
                <input
                  type="text"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-sm"
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

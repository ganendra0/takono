import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { Destination } from '../../types/destination';
import { MapPin, CheckCircle2, AlertTriangle, Edit3, Save, Plus, ArrowLeft } from 'lucide-react';

export const ManagerDestinations: React.FC = () => {
  const { destinations, updateDestination, explorePoints, navigateTo } = useTakonoStore();
  const [selectedDestId, setSelectedDestId] = useState<string>(destinations[0]?.id || '');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const destination = destinations.find((d) => d.id === selectedDestId);
  const [formData, setFormData] = useState<Partial<Destination>>({});

  const handleSelectDest = (dest: Destination) => {
    setSelectedDestId(dest.id);
    setFormData(dest);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    if (!destination) return;
    setFormData({ ...destination });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;

    // Check validation: Section 4 Rule: Publishing requires at least 1 explore point
    const destPoints = explorePoints.filter((p) => p.destinationId === destination.id);
    if (formData.status === 'published' && destPoints.length === 0) {
      alert('Gagal mempublikasikan: Destinasi harus memiliki minimal 1 Titik Jelajah (Explore Point) sebelum dapat di-publish!');
      return;
    }

    updateDestination(destination.id, formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigateTo('/manager/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard Manager</span>
        </button>

        <h1 className="text-xl font-bold text-slate-900">Kelola Destinasi Wisata</h1>
      </div>

      {/* Destination Picker */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {destinations.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => handleSelectDest(d)}
            className={`px-4 py-2 rounded-xl text-xs font-medium border transition flex items-center gap-2 whitespace-nowrap ${
              d.id === selectedDestId
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{d.name}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                d.status === 'published'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-400 text-slate-950'
              }`}
            >
              {d.status}
            </span>
          </button>
        ))}
      </div>

      {destination && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-900">{destination.name}</h2>
              <p className="text-xs text-slate-500">
                {destination.regency}, {destination.province}
              </p>
            </div>

            {!isEditing ? (
              <button
                type="button"
                onClick={handleStartEdit}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Konfigurasi</span>
              </button>
            ) : (
              <span className="text-xs font-semibold text-indigo-600">Mode Sunting Aktif</span>
            )}
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nama Destinasi</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={isEditing ? formData.name || '' : destination.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 disabled:bg-slate-50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Status Publikasi</label>
                <select
                  disabled={!isEditing}
                  value={isEditing ? formData.status || 'draft' : destination.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'draft' | 'published' | 'archived',
                    })
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-300 disabled:bg-slate-50 font-semibold"
                >
                  <option value="published">Published (Dapat diakses traveler via QR)</option>
                  <option value="draft">Draft (Belum tersedia untuk traveler)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Tagline / Slogan</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={isEditing ? formData.tagline || '' : destination.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 disabled:bg-slate-50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Harga Tiket Masuk (IDR)</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={isEditing ? formData.ticketPriceIdr ?? 0 : destination.ticketPriceIdr}
                  onChange={(e) =>
                    setFormData({ ...formData, ticketPriceIdr: parseInt(e.target.value) || 0 })
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-300 disabled:bg-slate-50 font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Jam Operasional</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={isEditing ? formData.openingHours || '' : destination.openingHours}
                  onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 disabled:bg-slate-50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Foto Sampul (URL)</label>
                <input
                  type="url"
                  disabled={!isEditing}
                  value={isEditing ? formData.heroImage || '' : destination.heroImage}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 disabled:bg-slate-50"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Deskripsi Lengkap Budaya & Sejarah</label>
              <textarea
                rows={4}
                disabled={!isEditing}
                value={isEditing ? formData.description || '' : destination.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 disabled:bg-slate-50 leading-relaxed"
                required
              />
            </div>

            {isEditing && (
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

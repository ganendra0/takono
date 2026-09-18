import React, { useState, useEffect } from 'react';
import { useTakonoStore } from '../../services/store';
import { 
  Building2, 
  Clock, 
  Ticket, 
  Image as ImageIcon, 
  Save, 
  CheckCircle2, 
  ArrowLeft, 
  Eye
} from 'lucide-react';

export const ManagerDestinations: React.FC = () => {
  const store = useTakonoStore();
  const destinations = store.destinations || [];
  const navigateTo = store.navigateTo;

  // Fungsi update dari store (jika ada di store)
  const updateDestination = (store as any).updateDestination;

  const [selectedDestId, setSelectedDestId] = useState<string>(
    destinations[0]?.id || 'dest-penglipuran'
  );

  const selectedDest = destinations.find((d) => d.id === selectedDestId) || destinations[0] || {
    id: 'dest-penglipuran',
    name: 'Desa Wisata Penglipuran',
    location: 'Bangli, Bali',
    tagline: 'Desa Adat Terbersih Dunia berakar pada Filosofi Tri Hita Karana',
    description: 'Desa adat di dataran tinggi Bangli, Bali...',
    operatingHours: '08:00 - 18:30 WITA',
    ticketPrice: '25000',
    imageUrl: '',
    status: 'PUBLISHED'
  };

  const [formData, setFormData] = useState({ ...selectedDest });
  const [isSaved, setIsSaved] = useState(false);

  // Sinkronisasi data saat memilih destinasi lain
  useEffect(() => {
    if (selectedDest) {
      setFormData({ ...selectedDest });
    }
  }, [selectedDestId, destinations]);

  const handleSelectDestination = (destId: string) => {
    setSelectedDestId(destId);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Jika ada method pembaruan di store, panggil untuk meng-update state global
    if (updateDestination) {
      updateDestination(formData);
    } else {
      // Fallback: update langsung di objek store jika updateDestination belum didefinisikan
      const destIndex = store.destinations.findIndex((d) => d.id === formData.id);
      if (destIndex !== -1) {
        store.destinations[destIndex] = { ...formData };
      }
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-neutral-800 antialiased max-w-7xl mx-auto">
      
      {/* 1. TOP HEADER & BREADCRUMB */}
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
            Pengaturan & Profil Destinasi
          </h1>
        </div>

        {/* Tab Pilih Destinasi */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {destinations.map((d) => {
            const isSelected = d.id === selectedDestId;
            const isPublished = d.status === 'PUBLISHED';

            return (
              <button
                key={d.id}
                type="button"
                onClick={() => handleSelectDestination(d.id)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <span>{d.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                  isSelected 
                    ? 'bg-white/20 text-white' 
                    : isPublished 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {d.status || 'PUBLISHED'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN LAYOUT: FORM & LIVE PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* KOLOM KIRI: FORM CONFIGURATION */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-2 text-neutral-900">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-extrabold text-base">Informasi Utama Destinasi</h3>
            </div>
            
            {/* Status Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl border border-neutral-200">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'PUBLISHED' })}
                className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                  formData.status === 'PUBLISHED'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                PUBLISHED
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'DRAFT' })}
                className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                  formData.status === 'DRAFT'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                DRAFT
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Nama & Lokasi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 block">Nama Destinasi</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-xs font-bold text-neutral-900 bg-neutral-50/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 block">Wilayah / Lokasi</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-xs font-semibold text-neutral-900 bg-neutral-50/50"
                  placeholder="Contoh: Bangli, Bali"
                />
              </div>
            </div>

            {/* Jam Operasional & Tiket */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 block">Jam Operasional</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.operatingHours || ''}
                    onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-xs font-semibold text-neutral-900 bg-neutral-50/50"
                    placeholder="08:00 - 18:30 WITA"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 block">Harga Tiket (Rp)</label>
                <div className="relative">
                  <Ticket className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.ticketPrice || ''}
                    onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-xs font-mono font-bold text-neutral-900 bg-neutral-50/50"
                    placeholder="25000"
                  />
                </div>
              </div>
            </div>

            {/* Tagline / Slogan */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 block">Tagline / Slogan Budaya</label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-xs font-semibold text-neutral-900 bg-neutral-50/50"
                placeholder="Kalimat singkat pemikat traveler..."
              />
            </div>

            {/* Foto Sampul URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 block">URL Foto Sampul Banner</label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-xs font-mono text-neutral-800 bg-neutral-50/50"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 block">Deskripsi Narasi Budaya & Sejarah</label>
              <textarea
                rows={4}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-4 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-xs leading-relaxed text-neutral-800 bg-neutral-50/50"
                placeholder="Jelaskan sejarah singkat, keunikan arsitektur, dan nilai ekologi..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400 font-mono">
              Status: <strong className="text-blue-600">Tersimpan di Store</strong>
            </span>

            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition shadow-md flex items-center gap-2 ${
                isSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* KOLOM KANAN: LIVE PREVIEW BANNER */}
        <div className="lg:col-span-5 space-y-4 sticky top-28">
          <div className="flex items-center justify-between text-neutral-900">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-neutral-500">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Pratinjau Tampilan Traveler</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
              LIVE PREVIEW
            </span>
          </div>

          {/* Card Preview Banner */}
          <div className="relative rounded-3xl overflow-hidden border border-neutral-200 shadow-lg min-h-[360px] flex flex-col justify-end p-6 text-white bg-neutral-900">
            {formData.imageUrl ? (
              <img
                src={formData.imageUrl}
                alt={formData.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition duration-500"
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-800 flex flex-col items-center justify-center text-neutral-400 text-xs">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <span>Belum Ada Foto Sampul</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 text-[10px]">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-600 font-bold text-white uppercase tracking-wider">
                  {formData.location || 'INDONESIA'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-neutral-200">
                  Titik Warisan Budaya
                </span>
              </div>

              <h2 className="text-2xl font-black leading-snug">
                {formData.name || 'Nama Destinasi'}
              </h2>

              <p className="text-neutral-300 text-xs line-clamp-2 leading-relaxed">
                {formData.tagline || formData.description}
              </p>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-300 font-mono">
                <span>Rp {formData.ticketPrice ? Number(formData.ticketPrice).toLocaleString('id-ID') : '0'}</span>
                <span>{formData.operatingHours || '08:00 - 18:30 WITA'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ManagerDestinations;
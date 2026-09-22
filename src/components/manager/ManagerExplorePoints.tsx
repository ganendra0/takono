import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { ExplorePoint } from '../../types/destination';
import {
  Compass,
  Plus,
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle2,
  Trash2,
  Edit3,
  X,
  Save,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ManagerExplorePoints: React.FC = () => {
  const {
    destinations,
    explorePoints,
    addExplorePoint,
    updateExplorePoint,
    navigateTo,
  } = useTakonoStore();

  const [selectedDestId, setSelectedDestId] = useState<string>(destinations[0]?.id || '');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingPoint, setEditingPoint] = useState<ExplorePoint | null>(null);

  // Form state
  const [name, setName] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('');
  const [category, setCategory] = useState<string>('Sejarah');
  const [sequenceOrder, setSequenceOrder] = useState<number>(1);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(15);
  const [completionPoints, setCompletionPoints] = useState<number>(5);
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1537996194471-e657df975ab4');
  const [shortDescription, setShortDescription] = useState<string>('');
  const [story, setStory] = useState<string>('');
  const [culturalNorms, setCulturalNorms] = useState<string>('');
  const [ecoGuidelines, setEcoGuidelines] = useState<string>('');
  const [etiquette, setEtiquette] = useState<string>('');
  const [activity, setActivity] = useState<string>('');

  const destPoints = explorePoints
    .filter((p) => p.destinationId === selectedDestId)
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder);

  const handleOpenAddModal = () => {
    setEditingPoint(null);
    setName('');
    setLocationName('');
    setCategory('Sejarah & Arsitektur');
    setSequenceOrder(destPoints.length + 1);
    setEstimatedMinutes(15);
    setCompletionPoints(5);
    setImageUrl('https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800');
    setShortDescription('');
    setStory('');
    setCulturalNorms('Kenakan pakaian sopan dan hargai ketenangan warga.');
    setEcoGuidelines('Dilarang membuang sampah sembarangan dan gunakan botol minum guna ulang.');
    setEtiquette('Sapa warga lokal dengan ramah dan selalu tersenyum.');
    setActivity('Berjalan santai dan rasakan atmosfer otentik.');
    setModalOpen(true);
  };

  const handleOpenEditModal = (point: ExplorePoint) => {
    setEditingPoint(point);
    setName(point.name);
    setLocationName(point.locationName);
    setCategory(point.category);
    setSequenceOrder(point.sequenceOrder);
    setEstimatedMinutes(point.estimatedMinutes);
    setCompletionPoints(point.completionPoints);
    setImageUrl(point.imageUrl);
    setShortDescription(point.shortDescription);
    setStory(point.story);
    setCulturalNorms(point.education.culturalNorms);
    setEcoGuidelines(point.education.ecoGuidelines);
    setEtiquette(point.education.etiquette);
    setActivity(point.activity);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPoint) {
      updateExplorePoint(editingPoint.id, {
        name,
        locationName,
        category,
        sequenceOrder,
        estimatedMinutes,
        completionPoints,
        imageUrl,
        shortDescription,
        story,
        activity,
        education: {
          culturalNorms,
          ecoGuidelines,
          etiquette,
        },
      });
    } else {
      addExplorePoint({
        destinationId: selectedDestId,
        name,
        locationName,
        category,
        sequenceOrder,
        estimatedMinutes,
        completionPoints,
        imageUrl,
        shortDescription,
        story,
        facts: [
          'Memiliki nilai filosofi tata ruang kuno yang diwariskan turun-temurun.',
          'Dikelola secara gotong-royong oleh masyarakat adat setempat.',
        ],
        activity,
        education: {
          culturalNorms,
          ecoGuidelines,
          etiquette,
        },
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans text-neutral-900 antialiased">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => navigateTo('/manager/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-500 hover:text-neutral-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Manager</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
            Kelola Titik Jelajah (Explore Points)
          </h1>
          <p className="text-xs text-neutral-500 max-w-xl">
            Atur urutan narasi budaya, titik koordinat plakat, serta poin edukasi untuk para wisatawan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedDestId}
            onChange={(e) => setSelectedDestId(e.target.value)}
            className="text-xs bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 font-bold text-neutral-800 shadow-2xs focus:outline-none focus:border-blue-600 transition"
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
            className="px-5 py-2.5 bg-neutral-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition shrink-0"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Tambah Titik Jelajah</span>
          </button>
        </div>
      </div>

      {/* Explore Points Sequential List - Rapat & Proporsional */}
      <div className="space-y-3">
        {destPoints.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 text-xs font-mono border border-dashed border-neutral-200 rounded-2xl bg-white shadow-2xs">
            Belum ada titik jelajah yang dikonfigurasi untuk destinasi ini.
          </div>
        ) : (
          destPoints.map((point) => (
            <div
              key={point.id}
              className="bg-white px-6 py-4 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-blue-300 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center font-mono font-black text-neutral-800 shrink-0 border border-neutral-200 shadow-2xs text-sm">
                  #{point.sequenceOrder}
                </div>
                <img
                  src={point.imageUrl}
                  alt={point.name}
                  className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0 hidden sm:block shadow-2xs"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                      {point.category}
                    </span>
                    <span className="text-[11px] text-neutral-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> {point.estimatedMinutes} menit
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 tracking-tight leading-snug">{point.name}</h3>
                  <p className="text-xs text-neutral-500 line-clamp-1">{point.shortDescription}</p>
                  <div className="text-[11px] text-neutral-400 flex items-center gap-2 font-mono">
                    <span>Lokasi: {point.locationName}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">
                      +{point.completionPoints} Jejak Points
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(point)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sunting</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 bg-neutral-900 text-white">
              <h3 className="font-black text-sm tracking-tight">
                {editingPoint ? 'Sunting Titik Jelajah' : 'Tambah Titik Jelajah Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-xl text-neutral-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Nama Titik Jelajah</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Contoh: Plakat Sejarah Bale Adat"
                    className="w-full p-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Lokasi / Landmark Spesifik</label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    required
                    placeholder="Contoh: Poros Utama Sebelah Barat"
                    className="w-full p-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:border-blue-600 focus:bg-white transition font-bold"
                  >
                    <option value="Sejarah & Arsitektur">Sejarah & Arsitektur</option>
                    <option value="Alam & Ekologi">Alam & Ekologi</option>
                    <option value="Spiritual & Adat">Spiritual & Adat</option>
                    <option value="Seni & Kerajinan">Seni & Kerajinan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Urutan Perjalanan (Sequence Order)</label>
                  <input
                    type="number"
                    value={sequenceOrder}
                    onChange={(e) => setSequenceOrder(parseInt(e.target.value) || 1)}
                    required
                    min={1}
                    className="w-full p-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:border-blue-600 focus:bg-white transition font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Estimasi Durasi (Menit)</label>
                  <input
                    type="number"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 10)}
                    required
                    min={1}
                    className="w-full p-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:border-blue-600 focus:bg-white transition font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Reward Poin Penyelesaian</label>
                  <input
                    type="number"
                    value={completionPoints}
                    onChange={(e) => setCompletionPoints(parseInt(e.target.value) || 5)}
                    required
                    min={1}
                    className="w-full p-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:border-blue-600 focus:bg-white transition font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Ringkasan Singkat</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  required
                  placeholder="Ringkasan 1 kalimat yang memikat"
                  className="w-full p-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Narasi Kisah & Makna Budaya</label>
                <textarea
                  rows={3}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  required
                  placeholder="Ceritakan latar belakang sejarah, mitologi, atau nilai filosofi tempat ini..."
                  className="w-full p-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:border-blue-600 focus:bg-white transition resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Aktivitas di Lokasi</label>
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  required
                  placeholder="Contoh: Mengamati ornamen ukiran bambu dan berbincang dengan tetua desa"
                  className="w-full p-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>

              {/* Education section */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                <h4 className="font-black text-neutral-900">Edukasi & Etika Pengunjung</h4>
                <div className="space-y-2.5">
                  <input
                    type="text"
                    value={culturalNorms}
                    onChange={(e) => setCulturalNorms(e.target.value)}
                    placeholder="Norma Adat (contoh: wajib mengenakan kamen/selendang)"
                    className="w-full p-2.5 rounded-lg border border-neutral-200 bg-white"
                  />
                  <input
                    type="text"
                    value={ecoGuidelines}
                    onChange={(e) => setEcoGuidelines(e.target.value)}
                    placeholder="Pedoman Ramah Lingkungan (contoh: zero single-use plastic)"
                    className="w-full p-2.5 rounded-lg border border-neutral-200 bg-white"
                  />
                  <input
                    type="text"
                    value={etiquette}
                    onChange={(e) => setEtiquette(e.target.value)}
                    placeholder="Tata Krama (contoh: jangan melangkahi sesajen canang sari)"
                    className="w-full p-2.5 rounded-lg border border-neutral-200 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-neutral-600 hover:bg-neutral-100 font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-blue-600 text-white font-bold rounded-2xl shadow-sm uppercase tracking-wider transition"
                >
                  Simpan Titik Jelajah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
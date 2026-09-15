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
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
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
          <h1 className="text-xl font-bold text-slate-900">Kelola Titik Jelajah (Explore Points)</h1>
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
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Titik Jelajah</span>
          </button>
        </div>
      </div>

      {/* Explore Points Sequential List */}
      <div className="space-y-4">
        {destPoints.map((point) => (
          <div
            key={point.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-mono font-bold text-slate-700 shrink-0">
                #{point.sequenceOrder}
              </div>
              <img
                src={point.imageUrl}
                alt={point.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 hidden sm:block"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {point.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {point.estimatedMinutes} menit
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900">{point.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-1">{point.shortDescription}</p>
                <div className="text-[11px] text-slate-400">
                  <span>Lokasi: {point.locationName}</span> •{' '}
                  <span className="text-emerald-700 font-semibold font-mono">
                    +{point.completionPoints} Jejak Points
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                type="button"
                onClick={() => handleOpenEditModal(point)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Sunting</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-bold text-sm">
                {editingPoint ? 'Sunting Titik Jelajah' : 'Tambah Titik Jelajah Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Nama Titik Jelajah</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Contoh: Plakat Sejarah Bale Adat"
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Lokasi / Landmark Spesifik</label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    required
                    placeholder="Contoh: Poros Utama Sebelah Barat"
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  >
                    <option value="Sejarah & Arsitektur">Sejarah & Arsitektur</option>
                    <option value="Alam & Ekologi">Alam & Ekologi</option>
                    <option value="Spiritual & Adat">Spiritual & Adat</option>
                    <option value="Seni & Kerajinan">Seni & Kerajinan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Urutan Perjalanan (Sequence Order)</label>
                  <input
                    type="number"
                    value={sequenceOrder}
                    onChange={(e) => setSequenceOrder(parseInt(e.target.value) || 1)}
                    required
                    min={1}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Estimasi Durasi (Menit)</label>
                  <input
                    type="number"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 10)}
                    required
                    min={1}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Reward Poin Penyelesaian</label>
                  <input
                    type="number"
                    value={completionPoints}
                    onChange={(e) => setCompletionPoints(parseInt(e.target.value) || 5)}
                    required
                    min={1}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Ringkasan Singkat</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  required
                  placeholder="Ringkasan 1 kalimat yang memikat"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Narasi Kisah & Makna Budaya</label>
                <textarea
                  rows={3}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  required
                  placeholder="Ceritakan latar belakang sejarah, mitologi, atau nilai filosofi tempat ini..."
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Aktivitas di Lokasi</label>
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  required
                  placeholder="Contoh: Mengamati ornamen ukiran bambu dan berbincang dengan tetua desa"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              {/* Education section */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900">Edukasi & Etika Pengunjung</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={culturalNorms}
                    onChange={(e) => setCulturalNorms(e.target.value)}
                    placeholder="Norma Adat (contoh: wajib mengenakan kamen/selendang)"
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    value={ecoGuidelines}
                    onChange={(e) => setEcoGuidelines(e.target.value)}
                    placeholder="Pedoman Ramah Lingkungan (contoh: zero single-use plastic)"
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    value={etiquette}
                    onChange={(e) => setEtiquette(e.target.value)}
                    placeholder="Tata Krama (contoh: jangan melangkahi sesajen canang sari)"
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm"
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

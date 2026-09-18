import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Coins, 
  FileCheck, 
  Lock, 
  MapPin, 
  PenTool, 
  ShieldCheck, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const AlbumJelajahView: React.FC = () => {
  const store = useTakonoStore();
  
  const journeys = store.completedJourneys || [];
  const activeJourney = store.activeJourney;
  const destinations = store.destinations || [];
  const explorePoints = store.explorePoints || [];

  // Gabungkan pilihan perjalanan yang ada
  const allJourneys = [
    ...(activeJourney ? [{ ...activeJourney, status: 'IN_PROGRESS' }] : []),
    ...journeys
  ];

  const [selectedJourneyId, setSelectedJourneyId] = useState<string>(
    allJourneys[0]?.id || 'journey-1'
  );

  const [personalNote, setPersonalNote] = useState<string>('');
  const [isSavedNote, setIsSavedNote] = useState<boolean>(false);

  const currentJourney = allJourneys.find((j) => j.id === selectedJourneyId) || {
    id: 'journey-dest-penglipuran',
    destinationId: 'dest-penglipuran',
    completedPointIds: [], // Set default ke array kosong (0 tuntas)
    status: 'IN_PROGRESS'
  };

  const currentDest = destinations.find((d) => d.id === currentJourney.destinationId) || destinations[0] || {
    name: 'Desa Wisata Penglipuran',
    location: 'Bangli, Bali'
  };

  const destPoints = explorePoints.filter((p) => p.destinationId === currentDest.id);

  // Ambil jumlah asli dari store jika ada, jika tidak default ke 0
  const completedCount = currentJourney.completedPointIds?.length || 0;

  const handleSaveNote = () => {
    if (!personalNote.trim()) return;
    setIsSavedNote(true);
    setTimeout(() => setIsSavedNote(false), 3000);
  };

  return (
    <div className="space-y-10 pb-16 font-sans text-neutral-800 antialiased max-w-7xl mx-auto">
      
      {/* 1. TOP HEADER & PERJALANAN SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600">Paspor Wisata Budaya</span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-900">Rekam Jejak & Album Stempel</h1>
        </div>

        {/* Dropdown Pemilih Perjalanan */}
        <div className="relative inline-block text-left shrink-0">
          <select
            value={selectedJourneyId}
            onChange={(e) => setSelectedJourneyId(e.target.value)}
            className="appearance-none bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 font-sans text-xs font-bold py-2.5 pl-4 pr-10 rounded-2xl cursor-pointer transition shadow-2xs focus:outline-none focus:border-blue-500"
          >
            {allJourneys.length > 0 ? (
              allJourneys.map((j) => {
                const d = destinations.find((dest) => dest.id === j.destinationId);
                return (
                  <option key={j.id} value={j.id}>
                    {d?.name || 'Destinasi'} ({j.status === 'IN_PROGRESS' ? 'Berjalan' : 'Selesai'})
                  </option>
                );
              })
            ) : (
              <option value="default">Desa Wisata Penglipuran (Berjalan)</option>
            )}
          </select>
          <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 2. HERO PASPOR CARD (Electric Blue Layout) */}
      <div className="relative rounded-3xl bg-blue-600 text-white p-8 sm:p-10 overflow-hidden shadow-xl shadow-blue-500/20">
        
        {/* Abstract Stamp Seal Silhouette Background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-15 flex items-center justify-center">
          <Award className="w-96 h-96 text-white stroke-1" />
        </div>

        <div className="relative z-10 space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
                <span>JOURNEY ID: {currentJourney.id}</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">{currentDest.name}</h2>
              <div className="flex items-center gap-2 text-xs text-blue-100 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-200" />
                <span>{currentDest.location || 'Bangli, Bali'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert('Sertifikat Digital berhasil diunduh dalam format PDF!')}
              className="px-5 py-2.5 bg-white hover:bg-blue-50 text-blue-600 font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 shadow-md shrink-0"
            >
              <FileCheck className="w-4 h-4" />
              <span>Cetak Sertifikat Digital</span>
            </button>
          </div>

          {/* Bento Stats Grid - murni dari 0 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-[10px] uppercase font-mono text-blue-200 block font-bold">Titik Tuntas</span>
              <span className="text-2xl font-black font-mono">
                {completedCount} / {destPoints.length || 4}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-[10px] uppercase font-mono text-blue-200 block font-bold">Kuis Terjawab</span>
              <span className="text-2xl font-black font-mono">
                {completedCount}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-[10px] uppercase font-mono text-blue-200 block font-bold">Poin Diraih</span>
              <span className="text-2xl font-black font-mono text-amber-300">
                +{completedCount * 10} PTS
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-[10px] uppercase font-mono text-blue-200 block font-bold">Reward Diklaim</span>
              <span className="text-2xl font-black font-mono">0</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. KOLEKSI STEMPEL BUDAYA */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2 text-neutral-900">
            <Award className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base">Koleksi Stempel Budaya Digital</h3>
          </div>
          <span className="text-xs font-mono text-neutral-400 font-bold">
            {completedCount} Terkumpul
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(destPoints.length > 0 ? destPoints : [
            { id: 'pt-1', title: 'Angkul-Angkul Tradisional', category: 'ARCHITECTURE' },
            { id: 'pt-2', title: 'Hutan Bambu Suci', category: 'NATURE' },
            { id: 'pt-3', title: 'Sentra Kriya Bambu', category: 'CRAFT' },
            { id: 'pt-4', title: 'Pawon Herbal Cemcem', category: 'CULINARY' }
          ]).map((pt, idx) => {
            // Hanya terbuka jika ID titik ada di dalam completedPointIds asli
            const isUnlocked = currentJourney.completedPointIds?.includes(pt.id);

            return (
              <div 
                key={pt.id}
                className={`p-6 rounded-3xl border text-center space-y-3 flex flex-col items-center justify-between transition duration-300 ${
                  isUnlocked
                    ? 'border-blue-200 bg-blue-50/30 shadow-sm'
                    : 'border-neutral-200 bg-neutral-50/50 opacity-60'
                }`}
              >
                <div className="space-y-2 w-full">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
                    STEMPEL #{idx + 1}
                  </span>

                  {/* Stamp Circular Emblem */}
                  <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center p-2 border-2 ${
                    isUnlocked
                      ? 'border-dashed border-blue-600 bg-white shadow-inner text-blue-600'
                      : 'border-neutral-300 bg-neutral-100 text-neutral-400'
                  }`}>
                    {isUnlocked ? (
                      <div className="text-center">
                        <Award className="w-8 h-8 mx-auto stroke-2" />
                        <span className="text-[8px] font-mono font-black uppercase tracking-tighter block mt-0.5">TERVERIFIKASI</span>
                      </div>
                    ) : (
                      <Lock className="w-7 h-7 stroke-2" />
                    )}
                  </div>

                  <h4 className="font-extrabold text-xs text-neutral-900 line-clamp-2 pt-1">
                    {pt.title}
                  </h4>
                </div>

                <div className="w-full pt-2 border-t border-neutral-100">
                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tercapai</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-neutral-400">Terkunci</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. CATATAN PENGALAMAN PERSONAL (JOURNAL) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-neutral-900 border-b border-neutral-100 pb-4">
          <PenTool className="w-5 h-5 text-blue-600" />
          <h3 className="font-extrabold text-base">Catatan Jurnal Pengalaman Personal</h3>
        </div>

        <div className="space-y-3">
          <textarea
            rows={4}
            value={personalNote}
            onChange={(e) => setPersonalNote(e.target.value)}
            placeholder="Tuliskan kesan, cerita warga lokal, atau pengalaman etika budaya yang paling berkesan bagi Anda selama menjelajahi destinasi ini..."
            className="w-full p-4 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-xs leading-relaxed text-neutral-800 placeholder-neutral-400 bg-neutral-50/50"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-neutral-400">
              Catatan ini tersimpan rapi di paspor digital Anda.
            </span>

            <button
              type="button"
              onClick={handleSaveNote}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition shadow-md flex items-center gap-2 ${
                isSavedNote
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
              }`}
            >
              {isSavedNote ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <span>Simpan Catatan</span>
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AlbumJelajahView;
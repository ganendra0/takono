import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Calendar,
  Coins,
  MapPin,
  Stamp,
  ShieldCheck,
  FileCheck,
  Compass,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AlbumJelajahView: React.FC = () => {
  const {
    currentUser,
    journeys,
    activeJourney,
    getDestination,
    endJourney,
    navigateTo,
  } = useTakonoStore();

  const travelerJourneys = journeys.filter((j) => j.travelerId === currentUser.id);
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>(
    activeJourney?.id || travelerJourneys[0]?.id || ''
  );

  const selectedJourney = journeys.find((j) => j.id === selectedJourneyId);
  const destination = selectedJourney ? getDestination(selectedJourney.destinationId) : null;
  const [personalNotesInput, setPersonalNotesInput] = useState<string>(
    selectedJourney?.personalNotes || ''
  );
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  const handleEndJourney = () => {
    if (!selectedJourney) return;
    const res = endJourney(selectedJourney.id, personalNotesInput);
    if (res.success) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
      setShowCertificate(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans text-neutral-900 antialiased">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-blue-600">
            <BookOpen className="w-4 h-4" /> Album Jelajah Budaya
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
            Paspor & Rekam Jejak Kunjungan
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl">
            Kumpulan stempel digital resmi, badge pencapaian, dan catatan petualangan otentik Anda.
          </p>
        </div>

        {/* Journey Selector */}
        {travelerJourneys.length > 1 && (
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-neutral-200 shadow-2xs text-xs self-start md:self-auto">
            <span className="text-neutral-500 font-medium">Pilih Perjalanan:</span>
            <select
              value={selectedJourneyId}
              onChange={(e) => setSelectedJourneyId(e.target.value)}
              className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 focus:outline-none focus:border-blue-600 transition"
            >
              {travelerJourneys.map((j) => {
                const d = getDestination(j.destinationId);
                return (
                  <option key={j.id} value={j.id}>
                    {d?.name || 'Destinasi'} ({j.status === 'active' ? 'Aktif' : 'Selesai'})
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      {selectedJourney && destination ? (
        <>
          {/* Passport Cover Card (Clean Editorial Style) */}
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xs p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                    selectedJourney.status === 'active' 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {selectedJourney.status === 'active' ? 'Journey Sedang Berjalan' : 'Journey Tuntas'}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    ID: {selectedJourney.id}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">{destination.name}</h2>
                <p className="text-xs sm:text-sm text-neutral-600 flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  {destination.regency}, {destination.province}
                </p>
              </div>

              {selectedJourney.status === 'active' ? (
                <button
                  type="button"
                  onClick={handleEndJourney}
                  className="px-6 py-3.5 bg-neutral-900 hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-sm shrink-0 self-start lg:self-auto"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Selesaikan Perjalanan & Terbitkan Sertifikat</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCertificate(true)}
                  className="px-6 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 transition shrink-0 self-start lg:self-auto border border-neutral-200"
                >
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Lihat Sertifikat Digital</span>
                </button>
              )}
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1">
                <span className="text-neutral-400 font-mono text-[11px] uppercase tracking-wider block">Titik Tuntas</span>
                <span className="font-black text-2xl font-mono text-neutral-900">
                  {selectedJourney.visitedPoints.filter((vp) => !!vp.completedAt).length}
                </span>
              </div>
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1">
                <span className="text-neutral-400 font-mono text-[11px] uppercase tracking-wider block">Kuis Terjawab</span>
                <span className="font-black text-2xl font-mono text-emerald-600">
                  {selectedJourney.completedQuizzes.length}
                </span>
              </div>
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1">
                <span className="text-neutral-400 font-mono text-[11px] uppercase tracking-wider block">Poin Diraih</span>
                <span className="font-black text-2xl font-mono text-amber-600">
                  +{selectedJourney.earnedPointsTotal}
                </span>
              </div>
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-1">
                <span className="text-neutral-400 font-mono text-[11px] uppercase tracking-wider block">Reward Diklaim</span>
                <span className="font-black text-2xl font-mono text-blue-600">
                  {selectedJourney.claimedRewards.length}
                </span>
              </div>
            </div>
          </div>

          {/* Stamps Collection (Authentic Passport Stamp Style) */}
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xs p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100">
                  <Stamp className="w-4 h-4" />
                </div>
                <h3 className="font-black text-neutral-900 text-base tracking-tight">
                  Koleksi Stempel Budaya ({selectedJourney.albumStamps.length} Terkumpul)
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200/60">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Otentik Terverifikasi</span>
              </span>
            </div>

            {selectedJourney.albumStamps.length === 0 ? (
              <div className="p-16 text-center text-neutral-400 text-xs font-mono border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/30">
                Belum ada stempel yang dikoleksi. Tuntaskan membaca dan etika di Explore Point untuk meraih stempel pertamamu!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                {selectedJourney.albumStamps.map((stamp, index) => (
                  <div
                    key={stamp.id}
                    className="p-5 rounded-2xl border-2 border-dashed border-blue-300/80 bg-blue-50/20 text-center space-y-4 flex flex-col justify-between shadow-2xs transition hover:border-blue-500 hover:bg-blue-50/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                        CAP RESMI #{index + 1}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>

                    <div className="space-y-1.5 py-2">
                      <h4 className="font-bold text-xs sm:text-sm text-neutral-900 leading-snug">
                        {stamp.explorePointName}
                      </h4>
                      <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 font-mono">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        <span>{new Date(stamp.earnedAt).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-blue-200/60 text-[9px] font-mono text-blue-700 uppercase tracking-widest font-bold">
                      Takono Cultural Heritage
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Personal Traveler Notes */}
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xs p-8 space-y-4">
            <h3 className="font-black text-neutral-900 text-base tracking-tight">Catatan Pengalaman Personal</h3>
            <textarea
              rows={3}
              value={personalNotesInput}
              onChange={(e) => setPersonalNotesInput(e.target.value)}
              placeholder="Tuliskan kesan, cerita warga, atau pengalaman budaya berkesan Anda selama menjelajahi destinasi ini..."
              className="w-full p-4 text-xs sm:text-sm border border-neutral-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white bg-neutral-50 transition resize-none"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  endJourney(selectedJourney.id, personalNotesInput);
                  alert('Catatan berhasil disimpan ke dalam Album Jelajah!');
                }}
                className="px-6 py-3 bg-neutral-900 hover:bg-blue-600 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-sm"
              >
                Simpan Catatan
              </button>
            </div>
          </div>

          {/* Digital Certificate of Completion Modal */}
          {showCertificate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="relative w-full max-w-lg bg-amber-50 rounded-3xl shadow-2xl border-4 border-amber-300 p-8 text-center space-y-6 text-neutral-900 my-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-black text-amber-800 font-mono">
                    Sertifikat Apresiasi Penjelajah Budaya
                  </span>
                  <h2 className="text-2xl font-black tracking-tight text-neutral-950 font-serif">
                    TAKONO DIGITAL AMBASSADOR
                  </h2>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <Award className="w-8 h-8" />
                </div>

                <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-neutral-700">
                  <p>Diberikan dengan hormat kepada:</p>
                  <p className="text-lg font-extrabold text-neutral-900 underline decoration-amber-500 decoration-2">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-neutral-600">
                    Telah sukses menuntaskan ekspedisi budaya ramah lingkungan di{' '}
                    <strong className="text-neutral-900">{destination.name}</strong>, mematuhi etika kearifan lokal, serta
                    mendukung ekosistem UMKM setempat.
                  </p>
                </div>

                <div className="p-4 bg-white/90 rounded-2xl border border-amber-200 text-xs font-mono text-neutral-700 flex justify-around">
                  <div>
                    <span className="block text-neutral-400 text-[10px]">Total Poin</span>
                    <strong className="text-emerald-700 text-sm font-bold">+{selectedJourney.earnedPointsTotal}</strong>
                  </div>
                  <div>
                    <span className="block text-neutral-400 text-[10px]">Stempel</span>
                    <strong className="text-neutral-900 text-sm font-bold">{selectedJourney.albumStamps.length} Buah</strong>
                  </div>
                  <div>
                    <span className="block text-neutral-400 text-[10px]">Tanggal Tuntas</span>
                    <strong className="text-neutral-900 text-sm font-bold">{new Date().toLocaleDateString('id-ID')}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCertificate(false)}
                  className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition"
                >
                  Tutup Sertifikat
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-neutral-200 text-neutral-400 text-xs font-mono">
          Belum ada data perjalanan untuk akun ini. Silakan mulai menjelajahi salah satu destinasi terlebih dahulu.
        </div>
      )}
    </div>
  );
};
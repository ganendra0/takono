import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Calendar,
  Coins,
  MapPin,
  Sparkles,
  Share2,
  Download,
  Flame,
  FileCheck,
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
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Album Jelajah Budaya</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Paspor & Rekam Jejak Kunjungan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kumpulan stempel digital, badge pencapaian, dan catatan petualangan otentik Anda.
          </p>
        </div>

        {/* Journey Selector */}
        {travelerJourneys.length > 1 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Pilih Perjalanan:</span>
            <select
              value={selectedJourneyId}
              onChange={(e) => setSelectedJourneyId(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
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
          {/* Passport Cover Card */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-md border border-indigo-900/60 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                    {selectedJourney.status === 'active' ? 'Journey Sedang Berjalan' : 'Journey Tuntas'}
                  </span>
                  <span className="text-xs text-slate-400">
                    ID: {selectedJourney.id.substring(0, 16)}...
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">{destination.name}</h2>
                <p className="text-xs text-indigo-200">
                  {destination.regency}, {destination.province}
                </p>
              </div>

              {selectedJourney.status === 'active' ? (
                <button
                  type="button"
                  onClick={handleEndJourney}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm self-start sm:self-auto"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesaikan Perjalanan & Terbitkan Sertifikat</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCertificate(true)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition self-start sm:self-auto"
                >
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>Lihat Sertifikat Digital</span>
                </button>
              )}
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-center text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block text-[11px]">Titik Tuntas</span>
                <span className="font-bold text-base font-mono text-white">
                  {selectedJourney.visitedPoints.filter((vp) => !!vp.completedAt).length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block text-[11px]">Kuis Terjawab</span>
                <span className="font-bold text-base font-mono text-emerald-400">
                  {selectedJourney.completedQuizzes.length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block text-[11px]">Poin Diraih</span>
                <span className="font-bold text-base font-mono text-amber-400">
                  +{selectedJourney.earnedPointsTotal}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block text-[11px]">Reward Diklaim</span>
                <span className="font-bold text-base font-mono text-indigo-300">
                  {selectedJourney.claimedRewards.length}
                </span>
              </div>
            </div>
          </div>

          {/* Stamps Collection */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                Koleksi Stempel Budaya ({selectedJourney.albumStamps.length} Terkumpul)
              </h3>
              <span className="text-xs text-slate-500">Otentik Terverifikasi</span>
            </div>

            {selectedJourney.albumStamps.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                Belum ada stempel yang dikoleksi. Tuntaskan membaca dan etika di Explore Point untuk meraih stempel pertamamu!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {selectedJourney.albumStamps.map((stamp) => (
                  <div
                    key={stamp.id}
                    className="p-4 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 text-center space-y-2 flex flex-col items-center justify-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-tight">
                        {stamp.explorePointName}
                      </h4>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {new Date(stamp.earnedAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Personal Traveler Notes */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Catatan Pengalaman Personal</h3>
            <textarea
              rows={3}
              value={personalNotesInput}
              onChange={(e) => setPersonalNotesInput(e.target.value)}
              placeholder="Tuliskan kesan, cerita warga, atau pengalaman budaya berkesan Anda selama menjelajahi destinasi ini..."
              className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  endJourney(selectedJourney.id, personalNotesInput);
                  alert('Catatan berhasil disimpan ke dalam Album Jelajah!');
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Simpan Catatan
              </button>
            </div>
          </div>

          {/* Digital Certificate of Completion Modal */}
          {showCertificate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="relative w-full max-w-lg bg-amber-50 rounded-3xl shadow-2xl border-4 border-amber-300 p-8 text-center space-y-6 text-slate-900 my-6">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-black text-amber-800">
                    Sertifikat Apresiasi Penjelajah Budaya
                  </span>
                  <h2 className="text-2xl font-black tracking-tight text-slate-950 font-serif">
                    TAKONO DIGITAL AMBASSADOR
                  </h2>
                </div>

                <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <Award className="w-8 h-8" />
                </div>

                <div className="space-y-2 text-xs leading-relaxed text-slate-700">
                  <p>Diberikan dengan hormat kepada:</p>
                  <p className="text-lg font-bold text-slate-900 underline decoration-amber-500 decoration-2">
                    {currentUser.name}
                  </p>
                  <p>
                    Telah sukses menuntaskan ekspedisi budaya ramah lingkungan di{' '}
                    <strong>{destination.name}</strong>, mematuhi etika kearifan lokal, serta
                    mendukung ekosistem UMKM setempat.
                  </p>
                </div>

                <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-[11px] font-mono text-slate-600 flex justify-around">
                  <div>
                    <span className="block text-slate-400">Total Poin</span>
                    <strong className="text-emerald-700">+{selectedJourney.earnedPointsTotal}</strong>
                  </div>
                  <div>
                    <span className="block text-slate-400">Stempel</span>
                    <strong>{selectedJourney.albumStamps.length} Buah</strong>
                  </div>
                  <div>
                    <span className="block text-slate-400">Tanggal Tuntas</span>
                    <strong>{new Date().toLocaleDateString('id-ID')}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCertificate(false)}
                  className="w-full py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold shadow-md hover:bg-slate-900"
                >
                  Tutup Sertifikat
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
          Belum ada data perjalanan untuk akun ini. Silakan mulai menjelajahi salah satu destinasi terlebih dahulu.
        </div>
      )}
    </div>
  );
};

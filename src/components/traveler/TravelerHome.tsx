import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { 
  QrCode, 
  MapPin, 
  Leaf, 
  BookOpen, 
  Coins, 
  ArrowRight, 
  Search,
  ShieldCheck
} from 'lucide-react';

export const TravelerHome: React.FC = () => {
  const { 
    destinations, 
    navigateTo, 
    setQrModalOpen, 
    currentUser, 
    verifyGatePasscode 
  } = useTakonoStore();

  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const defaultImages: Record<string, string> = {
    'dest-penglipuran': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    'dest-prambanan': 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
    'dest-waerebo': 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
    'default': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  };

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    const matchedDest = verifyGatePasscode(passcode.trim());
    if (matchedDest) {
      setPasscodeError('');
      navigateTo(`/traveler/destinations/${matchedDest.id}`);
    } else {
      setPasscodeError('Kode gerbang tidak valid. Coba: dest-penglipuran atau dest-prambanan');
    }
  };

  return (
    <div className="space-y-20 pb-12 font-sans text-neutral-800 antialiased">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-4 lg:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5 text-blue-600" />
              <span>Ekowisata & Warisan Budaya</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 leading-[1.1]">
              Jelajahi Warisan <br />
              <span className="text-blue-600">Budaya Nusantara</span>
            </h1>

            <p className="text-neutral-600 text-base sm:text-lg max-w-xl leading-relaxed">
              Nikmati pengalaman wisata imersif. Pindai plakat di gerbang masuk, selesaikan kuis budaya, dan kumpulkan poin untuk ditukarkan produk UMKM lokal.
            </p>

            {/* Interactive Gate Passcode Box */}
            <div className="bg-white p-3 rounded-2xl border border-neutral-200 shadow-xl shadow-neutral-100 space-y-3">
              <form onSubmit={handleVerifyPasscode} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setPasscodeError('');
                    }}
                    placeholder="Masukkan kode gerbang (cth: dest-penglipuran)"
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 rounded-xl text-xs sm:text-sm font-mono border border-neutral-200 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shrink-0 shadow-md shadow-blue-500/20"
                >
                  <span>Verifikasi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {passcodeError && (
                <p className="text-xs text-rose-600 font-medium px-2">{passcodeError}</p>
              )}

              <div className="flex items-center justify-between border-t border-neutral-100 pt-2.5 px-1">
                <span className="text-xs text-neutral-500">Atau gunakan pemindai cepat:</span>
                <button
                  type="button"
                  onClick={() => setQrModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Buka Kamera QR</span>
                </button>
              </div>
            </div>

            {/* Traveler Points Quick Stats */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex -space-x-2">
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="User" />
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="User" />
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="User" />
              </div>
              <div>
                <span className="block text-xs font-bold text-neutral-900">2,400+ Penjelajah Aktif</span>
                <span className="text-[11px] text-neutral-500">Telah melestarikan budaya lokal</span>
              </div>
            </div>

          </div>

          {/* Hero Right Media Grid */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-64 rounded-3xl overflow-hidden border border-neutral-200 shadow-md bg-neutral-100">
                  <img
                    src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80"
                    alt="Bali Culture"
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-5 rounded-3xl bg-blue-600 text-white space-y-2 shadow-lg shadow-blue-500/25">
                  <div className="flex items-center justify-between">
                    <Coins className="w-6 h-6 text-blue-200" />
                    <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-white/20 text-white">Poin Aktif</span>
                  </div>
                  <div className="text-3xl font-black font-mono">{currentUser.pointsBalance} PTS</div>
                  <p className="text-xs font-medium text-blue-100">Tukarkan voucher kuliner & suvenir khas warga.</p>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="p-5 rounded-3xl bg-neutral-900 text-white space-y-2">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                  <h4 className="font-bold text-sm">Terverifikasi Plakat</h4>
                  <p className="text-xs text-neutral-400">Konten resmi dari dinas & pengelola adat setempat.</p>
                </div>
                <div className="h-64 rounded-3xl overflow-hidden border border-neutral-200 shadow-md bg-neutral-100">
                  <img
                    src="https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80"
                    alt="Temple"
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. IMPACT STATS SECTION */}
      <section className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-100">
          <div className="pt-4 md:pt-0">
            <span className="block text-3xl font-black font-mono text-neutral-900">100+</span>
            <span className="text-xs font-medium text-neutral-500">Titik Plakat Budaya</span>
          </div>
          <div className="pt-4 md:pt-0">
            <span className="block text-3xl font-black font-mono text-neutral-900">50+</span>
            <span className="text-xs font-medium text-neutral-500">Mitra UMKM Desa</span>
          </div>
          <div className="pt-4 md:pt-0">
            <span className="block text-3xl font-black font-mono text-neutral-900">12K+</span>
            <span className="text-xs font-medium text-neutral-500">Kuis Budaya Selesai</span>
          </div>
          <div className="pt-4 md:pt-0">
            <span className="block text-3xl font-black font-mono text-blue-600">100%</span>
            <span className="text-xs font-medium text-neutral-500">Keberlanjutan Lokal</span>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS / FEATURES SECTION */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600">Panduan Langkah</span>
          <h2 className="text-3xl font-black tracking-tight text-neutral-900">Bagaimana Cara Kerjanya?</h2>
          <p className="text-neutral-500 text-sm">Tiga langkah mudah menikmati wisata budaya yang bermakna dan berdampak bagi warga lokal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-neutral-200 hover:border-neutral-300 transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black font-mono text-lg">
              01
            </div>
            <h3 className="font-bold text-lg text-neutral-900">Pindai Plakat Gerbang</h3>
            <p className="text-neutral-500 text-xs leading-relaxed">
              Arahkan kamera ke kode QR resmi di pintu masuk wisata untuk mengaktifkan alur rute dan pemandu pintar.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-neutral-200 hover:border-neutral-300 transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-black font-mono text-lg">
              02
            </div>
            <h3 className="font-bold text-lg text-neutral-900">Jelajahi & Jawab Kuis</h3>
            <p className="text-neutral-500 text-xs leading-relaxed">
              Kunjungi setiap titik lokasi budaya, pelajari narasi sejarah adat, dan jawab kuis edukatif untuk mengumpulkan poin.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-neutral-200 hover:border-neutral-300 transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-700 flex items-center justify-center font-black font-mono text-lg">
              03
            </div>
            <h3 className="font-bold text-lg text-neutral-900">Tukar Poin di UMKM</h3>
            <p className="text-neutral-500 text-xs leading-relaxed">
              Gunakan poin untuk mengklaim kupon diskon kuliner khas, cenderamata, dan karya pengerajin warga lokal.
            </p>
          </div>
        </div>
      </section>

      {/* 4. DESTINATION CARDS GRID SECTION */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600">Destinasi Pilihan</span>
            <h2 className="text-3xl font-black tracking-tight text-neutral-900">Eksplorasi Destinasi Budaya</h2>
          </div>
          <button
            type="button"
            onClick={() => setQrModalOpen(true)}
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-900 hover:text-blue-600 transition"
          >
            <span>Scan QR untuk Masuk Destinasi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {destinations.map((dest) => {
            const imgSrc = dest.imageUrl || defaultImages[dest.id] || defaultImages['default'];
            const destCode = dest.passcode || dest.id;

            return (
              <div 
                key={dest.id}
                className="group bg-white rounded-3xl border border-neutral-200 overflow-hidden hover:shadow-xl hover:shadow-neutral-100 transition duration-300 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden bg-neutral-100">
                  <img
                    src={imgSrc}
                    alt={dest.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = defaultImages[dest.id] || defaultImages['default'];
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{dest.location || 'Indonesia'}</span>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-extrabold text-neutral-900 group-hover:text-blue-600 transition">
                      {dest.name}
                    </h3>
                    <p className="text-neutral-500 text-xs line-clamp-2 leading-relaxed">
                      {dest.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs font-mono text-neutral-400">
                      Kode: <strong className="text-neutral-700 font-semibold">{destCode}</strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => navigateTo(`/traveler/destinations/${dest.id}`)}
                      className="px-4 py-2 bg-neutral-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <span>Masuk Destinasi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. REWARD CTA BANNER */}
      <section className="bg-neutral-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold">Jejak Points Ecosystem</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Kumpulkan Poin, Dukung Ekonomi Warga Lokal
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
            Setiap kali Anda menuntaskan jelajah budaya, Anda mendapatkan poin yang dapat ditukar secara instan dengan kuliner lokal dan cinderamata UMKM mitra.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigateTo('/traveler/points')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-blue-500/25"
            >
              <Coins className="w-4 h-4" />
              <span>Lihat Katalog Hadiah</span>
            </button>
            <button
              type="button"
              onClick={() => navigateTo('/traveler/album')}
              className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider border border-neutral-700 transition flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Album Stempel</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
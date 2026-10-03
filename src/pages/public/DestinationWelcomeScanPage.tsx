import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../lib/api.js';
import { Destination } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { TakonoLogo } from '../../components/TakonoLogo.js';
import { Compass, AlertCircle } from 'lucide-react';

interface DestinationWelcomeScanPageProps {
  destinationCode: string;
  onNavigate: (path: string) => void;
}

export const DestinationWelcomeScanPage: React.FC<DestinationWelcomeScanPageProps> = ({
  destinationCode,
  onNavigate
}) => {
  const { user } = useAuth();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [welcomeTitle, setWelcomeTitle] = useState('');
  const [welcomeSubtitle, setWelcomeSubtitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWelcome = async () => {
      setIsLoading(true);
      const res = await ApiClient.scanDestinationQR(destinationCode);
      if (res.success && res.data) {
        setDestination(res.data.destination);
        setWelcomeTitle(res.data.welcomeTitle);
        setWelcomeSubtitle(res.data.welcomeSubtitle);
      } else {
        setError(res.message || 'Kode QR destinasi tidak valid.');
      }
      setIsLoading(false);
    };

    fetchWelcome();
  }, [destinationCode]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <p className="mt-5 text-sm font-medium text-slate-600">Memindai data selamat datang destinasi...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">QR Destinasi Tidak Ditemukan</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {error || `Kode destinasi "${destinationCode}" belum terdaftar di platform TAKONO.`}
          </p>
          <button
            onClick={() => onNavigate('/')}
            className="w-full cursor-pointer rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const startJourney = async () => {
    if (!user) { onNavigate('/login'); return; }
    setIsStarting(true);
    setError('');
    const result = await ApiClient.startDestinationJourney(destinationCode);
    setIsStarting(false);
    if (!result.success || !result.data) { setError(result.message || 'Perjalanan tidak dapat dimulai.'); return; }
    const base = `/app/destination/${encodeURIComponent(result.data.destination.slug)}`;
    ApiClient.selectDestination(result.data.destination.id, result.data.destination.slug);
    onNavigate(result.data.journey.status === 'completed' ? '/app/album' : base);
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#071326] text-white">
      
      {/* Background Hero Image */}
      <img
        src={destination.heroImage}
        alt={destination.name}
        className="absolute inset-0 h-full w-full object-cover opacity-50"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#071326]/95 via-[#071326]/75 to-[#071326]/45" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#071326]/80 via-transparent to-[#071326]/30" />

      {/* Top Bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-10">
        <div className="flex items-center">
          <TakonoLogo variant="full" size="sm" theme="dark" />
        </div>
        <span className="rounded-md border border-white/15 bg-slate-950/35 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-300 sm:text-xs">
          KODE: {destination.code}
        </span>
      </header>

      {/* Welcome Core Content */}
      <main className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-8 px-5 py-8 text-left sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(26rem,0.9fr)] lg:gap-x-16 lg:gap-y-6 lg:px-10">
        
        <div className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200 lg:col-start-1 lg:row-start-1">
          <span className="h-px w-8 bg-blue-400" />
          <span>Selamat Datang Wisatawan!</span>
        </div>

        <div className="space-y-3 lg:col-start-1 lg:row-start-2">
          <h1 className="text-4xl font-semibold leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-7xl">
            {destination.name}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
            {destination.tagline}
          </p>
        </div>

        {/* Practical Highlights Pill Grid */}
        <div className="grid grid-cols-1 gap-x-6 border-y border-white/20 text-left sm:grid-cols-2 lg:col-start-2 lg:row-start-1">
          <div className="py-4 text-sm">
            <span className="mb-1 block text-slate-300">Jam operasional</span>
            <span className="font-medium leading-6 text-white">{destination.operatingHours}</span>
          </div>
          <div className="border-t border-white/15 py-4 text-sm sm:border-l sm:border-t-0 sm:pl-6">
            <span className="mb-1 block text-slate-300">Tiket masuk</span>
            <span className="font-medium leading-6 text-white">{destination.ticketInfo}</span>
          </div>
        </div>

        {/* Facilities Preview */}
        <div className="max-w-none space-y-3 text-left lg:col-start-2 lg:row-start-2">
          <span className="block text-sm font-semibold text-white">Fasilitas</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {destination.facilities.map(f => (
              <span key={f.id} className="text-sm text-slate-200">
                {f.name}
              </span>
            ))}
          </div>
        </div>

        {/* Primary CTA */}
        <div className="max-w-md space-y-3 pt-2 lg:col-start-1 lg:row-start-3">
          <button
            onClick={startJourney}
            disabled={isStarting}
            className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-wait disabled:opacity-70"
          >
            <Compass className="h-5 w-5" />
            <span>{isStarting ? 'Memulai perjalanan…' : 'Mulai Jelajah Destinasi'}</span>
          </button>

          <p className="text-sm text-slate-300">
            {user ? `Terhubung sebagai: ${user.name} (${user.pointsBalance} Poin)` : 'Masuk atau daftar untuk mulai menjelajah'}
          </p>
        </div>

      </main>

      {/* Footer info */}
      <footer className="relative z-10 mx-auto w-full max-w-7xl px-5 py-5 text-center text-xs text-slate-400 sm:px-8 lg:px-10">
        {destination.name} · TAKONO
      </footer>

    </div>
  );
};

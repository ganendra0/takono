import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../lib/api.js';
import { Destination } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { TakonoLogo } from '../../components/TakonoLogo.js';
import { 
  Compass, 
  MapPin, 
  Clock, 
  Ticket, 
  CheckCircle2, 
  ArrowRight, 
  QrCode,
  Sparkles,
  AlertCircle 
} from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-medium">Memindai data selamat datang destinasi...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">QR Destinasi Tidak Ditemukan</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {error || `Kode destinasi "${destinationCode}" belum terdaftar di platform TAKONO.`}
          </p>
          <button
            onClick={() => onNavigate('/')}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Hero Image */}
      <img
        src={destination.heroImage}
        alt={destination.name}
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40"></div>

      {/* Top Bar */}
      <div className="relative z-10 p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TakonoLogo variant="full" size="md" theme="dark" />
        </div>
        <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md text-[11px] font-mono uppercase text-slate-300">
          KODE: {destination.code}
        </span>
      </div>

      {/* Welcome Core Content */}
      <div className="relative z-10 max-w-xl mx-auto px-6 py-8 text-center space-y-6">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Selamat Datang Wisatawan!</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {destination.name}
          </h1>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            {destination.tagline}
          </p>
        </div>

        {/* Practical Highlights Pill Grid */}
        <div className="grid grid-cols-2 gap-3 text-left max-w-md mx-auto">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-xs">
            <span className="text-slate-400 block mb-0.5">Jam Operasional</span>
            <span className="font-semibold text-white">{destination.operatingHours}</span>
          </div>
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-xs">
            <span className="text-slate-400 block mb-0.5">Tiket Masuk</span>
            <span className="font-semibold text-white">{destination.ticketInfo}</span>
          </div>
        </div>

        {/* Facilities Preview */}
        <div className="max-w-md mx-auto text-left p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 space-y-2">
          <span className="text-xs font-semibold text-slate-300 block">Fasilitas Utama Terhubung:</span>
          <div className="flex flex-wrap gap-1.5">
            {destination.facilities.map(f => (
              <span key={f.id} className="text-[11px] px-2 py-0.5 bg-white/15 rounded text-slate-200">
                {f.name}
              </span>
            ))}
          </div>
        </div>

        {/* Primary CTA */}
        <div className="pt-2 max-w-md mx-auto space-y-3">
          <button
            onClick={() => { ApiClient.selectDestination(destination.id); onNavigate('/app/smart-guide'); }}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
          >
            <Compass className="w-5 h-5" />
            <span>Mulai Jelajah Destinasi</span>
          </button>

          <p className="text-[11px] text-slate-400">
            {user ? `Terhubung sebagai: ${user.name} (${user.pointsBalance} Poin)` : 'Masuk atau daftar untuk mulai menjelajah'}
          </p>
        </div>

      </div>

      {/* Footer info */}
      <div className="relative z-10 p-6 text-center text-xs text-slate-500">
        {destination.name} · TAKONO
      </div>

    </div>
  );
};

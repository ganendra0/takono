import React, { useState } from 'react';
import { ApiClient } from '../lib/api.js';
import { ExplorePoint } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { 
  QrCode, 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Camera, 
  KeyRound,
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  preselectedPoint?: ExplorePoint | null;
}

export const ScanModal: React.FC<ScanModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  preselectedPoint
}) => {
  const { refreshUserData } = useAuth();
  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    title: string;
    message: string;
    pointsAwarded?: number;
    destinationSlug?: string;
    pointSlug?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleProcessCode = async (inputCode: string) => {
    setIsProcessing(true);
    setScanResult(null);

    const clean = inputCode.trim();

    // Check if destination code (e.g. KBS-SBY)
    if (clean.toUpperCase() === 'KBS-SBY' || clean.toLowerCase() === 'kbs') {
      const res = await ApiClient.scanDestinationQR('KBS-SBY');
      if (res.success && res.data) {
        setScanResult({
          success: true,
          title: res.data.welcomeTitle,
          message: res.data.welcomeSubtitle,
          destinationSlug: res.data.destination.slug
        });
      } else {
        setScanResult({
          success: false,
          title: 'Kode Tidak Dikenali',
          message: 'Destinasi tidak ditemukan dalam database platform.'
        });
      }
      setIsProcessing(false);
      return;
    }

    // Otherwise test explore point token
    const res = await ApiClient.scanExplorePointToken(clean);
    if (res.success && res.data) {
      if (res.data.awardResult?.pointsAwarded) {
        confetti({ particleCount: 70, spread: 60 });
        await refreshUserData();
      }
      setScanResult({
        success: true,
        title: res.data.explorePoint.name,
        message: res.data.message,
        pointsAwarded: res.data.awardResult?.pointsAwarded || 0,
        pointSlug: res.data.explorePoint.slug
      });
    } else {
      setScanResult({
        success: false,
        title: 'Pemindaian Gagal',
        message: res.message || 'Kode QR tidak cocok dengan titik jelajah aktif.'
      });
    }
    setIsProcessing(false);
  };

  const quickSimulations = [
    { label: '🐘 Papan Titik Konservasi Gajah', token: 'token_kbs_01_gajah' },
    { label: '🦎 Papan Titik Habitat Komodo', token: 'token_kbs_02_komodo' },
    { label: '🐠 Papan Titik Aquarium Bersejarah', token: 'token_kbs_03_aquarium' },
    { label: '🦁 Papan Titik Singa Afrika', token: 'token_kbs_04_singa' },
    { label: '🚪 Gerbang Utama KBS (Welcome)', token: 'KBS-SBY' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Pemindai QR TAKONO</h3>
              <p className="text-[10px] text-slate-500">Papan gerbang & Explore Point fisik</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera simulation viewport */}
        <div className="relative h-44 bg-slate-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-center p-4 border border-slate-800">
          <div className="w-36 h-36 border-2 border-dashed border-blue-400 rounded-xl relative flex items-center justify-center animate-pulse">
            <Camera className="w-8 h-8 text-blue-400/80" />
            <div className="absolute inset-x-2 top-1/2 h-0.5 bg-rose-500/80 shadow-xs animate-bounce"></div>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 z-10">Arahkan kamera ke kode QR fisik</span>
        </div>

        {/* Input manual fallback */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-700 block">
            Atau masukkan kode / token manual:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Contoh: token_kbs_01_gajah atau KBS-SBY"
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-hidden focus:border-blue-500"
            />
            <button
              onClick={() => handleProcessCode(code)}
              disabled={isProcessing || !code.trim()}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              {isProcessing ? '...' : 'Cek'}
            </button>
          </div>
        </div>

        {/* Instant Simulation One-Tap Pills */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Uji Coba Cepat (Simulasi 1-Klik):
          </span>
          <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
            {quickSimulations.map(sim => (
              <button
                key={sim.token}
                onClick={() => handleProcessCode(sim.token)}
                className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200/70 hover:border-blue-200 text-[11px] text-slate-700 hover:text-blue-900 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>{sim.label}</span>
                <span className="text-[10px] font-mono text-slate-400">Scan</span>
              </button>
            ))}
          </div>
        </div>

        {/* Result Feedback Banner */}
        {scanResult && (
          <div className={`p-3.5 rounded-xl text-xs space-y-2 border ${
            scanResult.success 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
              : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}>
            <div className="flex items-center gap-1.5 font-bold">
              {scanResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{scanResult.title}</span>
            </div>

            <p className="text-[11px] leading-relaxed">{scanResult.message}</p>

            {scanResult.pointsAwarded !== undefined && scanResult.pointsAwarded > 0 && (
              <div className="font-mono font-bold text-emerald-700 text-xs">
                +{scanResult.pointsAwarded} Jejak Points telah ditambahkan ke buku kas!
              </div>
            )}

            <div className="pt-1 flex gap-2">
              {scanResult.pointSlug && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigate(`/app/explore/${scanResult.pointSlug}`);
                  }}
                  className="flex-1 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold text-xs text-center cursor-pointer"
                >
                  Buka Detail Cerita & Kuis
                </button>
              )}
              {scanResult.destinationSlug && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('/app/smart-guide');
                  }}
                  className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg font-semibold text-xs text-center cursor-pointer"
                >
                  Buka Smart Guide KBS
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

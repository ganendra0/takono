import React, { useState, useEffect } from 'react';
import { useTakonoStore } from '../../services/store';
import { QRResolutionResult } from '../../types/qr';
import { QrCode, X, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export const QRScannerModal: React.FC = () => {
  const {
    qrModalOpen,
    setQrModalOpen,
    activeQrTargetCode,
    resolveQRCode,
    qrCodes,
    destinations,
    navigateTo,
    startOrResumeJourney,
  } = useTakonoStore();

  const [inputCode, setInputCode] = useState<string>('');
  const [resolutionResult, setResolutionResult] = useState<QRResolutionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (activeQrTargetCode) {
      setInputCode(activeQrTargetCode);
      handleProcessScan(activeQrTargetCode);
    } else {
      setResolutionResult(null);
    }
  }, [activeQrTargetCode, qrModalOpen]);

  if (!qrModalOpen) return null;

  const handleProcessScan = (codeToScan: string) => {
    setIsProcessing(true);
    // simulate optical scan validation time
    setTimeout(() => {
      const result = resolveQRCode(codeToScan);
      setResolutionResult(result);
      setIsProcessing(false);
    }, 400);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    handleProcessScan(inputCode);
  };

  const handleNavigateToTarget = () => {
    if (!resolutionResult || resolutionResult.status !== 'success') return;
    setQrModalOpen(false);

    if (resolutionResult.targetType === 'destination') {
      startOrResumeJourney(resolutionResult.destinationId);
      navigateTo('/traveler/home');
    } else if (resolutionResult.targetType === 'explore_point') {
      navigateTo(`/traveler/explore/${resolutionResult.targetId}`);
    } else if (resolutionResult.targetType === 'event') {
      navigateTo(`/traveler/destinations/${resolutionResult.destinationId}?tab=events`);
    } else {
      navigateTo('/traveler/home');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-neutral-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight">TAKONO QR Scanner</h3>
              <p className="text-[11px] text-neutral-400">Pintu Masuk Traveler & Resolusi Titik Jelajah</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setQrModalOpen(false)}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Scanner Viewfinder Simulation */}
          <div className="relative h-44 bg-neutral-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-neutral-800 shadow-inner">
            {/* Viewfinder crosshairs */}
            <div className="relative w-32 h-32 border-2 border-blue-500/60 rounded-2xl flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/10 animate-pulse rounded-2xl" />
              <div className="w-full h-0.5 bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)] animate-bounce" />
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-blue-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-blue-400" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-blue-400" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-blue-400" />
            </div>
            <p className="text-[11px] font-mono text-neutral-400 mt-3">Arahkan kamera ke plakat fisik QR di lokasi wisata</p>
          </div>

          {/* Quick preset selector for simulation */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Uji Coba Pindai QR Fisik di Lapangan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs max-h-36 overflow-y-auto pr-1">
              {qrCodes.map((q) => {
                const dest = destinations.find((d) => d.id === q.destinationId);
                const isDraft = dest?.status !== 'published';
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setInputCode(q.code);
                      handleProcessScan(q.code);
                    }}
                    className={`p-3 text-left rounded-2xl border transition flex flex-col justify-between space-y-1 ${
                      inputCode === q.code
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="truncate">{q.title}</span>
                      {isDraft && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold">
                          Draft
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono truncate">{q.code}</span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  const invalidCode = 'TAKONO:INVALID:999';
                  setInputCode(invalidCode);
                  handleProcessScan(invalidCode);
                }}
                className="p-3 text-left rounded-2xl border border-dashed border-rose-200 hover:bg-rose-50 text-rose-700 text-xs flex flex-col justify-between space-y-1 transition"
              >
                <span className="font-bold">Tes QR Tidak Terdaftar (Invalid)</span>
                <span className="text-[10px] text-rose-500 font-mono">TAKONO:INVALID:999</span>
              </button>
            </div>
          </div>

          {/* Manual Input form */}
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Masukkan kode QR..."
              className="flex-1 px-4 py-3 text-xs font-mono border border-neutral-200 rounded-xl focus:outline-none focus:border-blue-600 bg-neutral-50 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={isProcessing || !inputCode.trim()}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-md shadow-blue-500/20 shrink-0"
            >
              {isProcessing ? 'Memeriksa...' : 'Validasi'}
            </button>
          </form>

          {/* Resolution Result Presentation */}
          {resolutionResult && (
            <div className="animate-in fade-in duration-200">
              {resolutionResult.status === 'success' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-neutral-900 text-sm">
                        {resolutionResult.qrData?.title}
                      </h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {resolutionResult.qrData?.description}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-200/70 text-blue-900 uppercase tracking-wider">
                          Target: {resolutionResult.targetType}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          Journey otomatis aktif & terlacak.
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNavigateToTarget}
                    className="w-full py-3 px-4 bg-neutral-900 hover:bg-blue-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-sm"
                  >
                    <span>Masuk ke Konten Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {resolutionResult.status === 'destination_unavailable' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-amber-900">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-950 text-sm">
                        Destinasi Belum Tersedia
                      </h4>
                      <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                        {resolutionResult.message}
                      </p>
                      <p className="text-[11px] text-amber-700 mt-2 italic">
                        Tips: Beralih ke peran <strong>Manager</strong> untuk mengubah status destinasi menjadi Published!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {resolutionResult.status === 'invalid_code' && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 text-rose-900">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-rose-950 text-sm">
                        Kode QR Tidak Valid
                      </h4>
                      <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                        {resolutionResult.message}
                      </p>
                      <p className="text-[11px] text-rose-600 mt-2">
                        Pastikan Anda memindai kode QR resmi yang terpasang di area destinasi TAKONO.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
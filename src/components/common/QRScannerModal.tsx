import React, { useState, useEffect } from 'react';
import { useTakonoStore } from '../../services/store';
import { QRResolutionResult } from '../../types/qr';
import { QrCode, X, AlertTriangle, CheckCircle2, ArrowRight, Compass, Sparkles, ExternalLink } from 'lucide-react';

export const QRScannerModal: React.FC = () => {
  const {
    qrModalOpen,
    setQrModalOpen,
    activeQrTargetCode,
    resolveQRCode,
    qrCodes,
    destinations,
    explorePoints,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">TAKONO QR Scanner</h3>
              <p className="text-xs text-slate-400">Pintu Masuk Traveler & Resolusi Titik Jelajah</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setQrModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Scanner Viewfinder Simulation */}
          <div className="relative h-48 bg-slate-950 rounded-xl overflow-hidden flex flex-col items-center justify-center border border-slate-800">
            {/* Viewfinder crosshairs */}
            <div className="relative w-36 h-36 border-2 border-emerald-500/60 rounded-xl flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
              <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-bounce" />
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Arahkan kamera ke plakat fisik QR di lokasi wisata</p>
          </div>

          {/* Quick preset selector for simulation */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
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
                    className={`p-2.5 text-left rounded-lg border transition flex flex-col ${
                      inputCode === q.code
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-medium">
                      <span className="truncate">{q.title}</span>
                      {isDraft && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded font-semibold">
                          Draft
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{q.code}</span>
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
                className="p-2.5 text-left rounded-lg border border-dashed border-red-200 hover:bg-red-50 text-red-700 text-xs flex flex-col"
              >
                <span className="font-medium">Tes QR Tidak Terdaftar (Invalid)</span>
                <span className="text-[10px] text-red-500 font-mono">TAKONO:INVALID:999</span>
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
              className="flex-1 px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={isProcessing || !inputCode.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition"
            >
              {isProcessing ? 'Memeriksa...' : 'Validasi'}
            </button>
          </form>

          {/* Resolution Result Presentation */}
          {resolutionResult && (
            <div className="animate-in fade-in duration-200">
              {resolutionResult.status === 'success' && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-emerald-950 text-sm">
                        {resolutionResult.qrData?.title}
                      </h4>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        {resolutionResult.qrData?.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-200 text-emerald-800 uppercase tracking-wide">
                          Target: {resolutionResult.targetType}
                        </span>
                        <span className="text-xs text-emerald-700">
                          Journey otomatis aktif & terlacak.
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNavigateToTarget}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition"
                  >
                    <span>Masuk ke Konten Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {resolutionResult.status === 'destination_unavailable' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-amber-900">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-950 text-sm">
                        Destinasi Belum Tersedia
                      </h4>
                      <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                        {resolutionResult.message}
                      </p>
                      <p className="text-[11px] text-amber-700 mt-2 italic">
                        Tips Pengembang: Beralih ke peran <strong>Destination Manager</strong> atau <strong>Super Admin</strong> untuk mengubah status destinasi menjadi Published!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {resolutionResult.status === 'invalid_code' && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-rose-900">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-rose-950 text-sm">
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

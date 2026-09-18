import React, { useState, useEffect } from 'react';
import { useTakonoStore } from '../../services/store';
import { QRResolutionResult } from '../../types/qr';
import { QrCode, X, AlertTriangle, CheckCircle2, ArrowRight, Compass, ExternalLink } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1C2520] text-white border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Pemindai Plakat QR TAKONO</h3>
              <p className="text-xs text-stone-400">Verifikasi Kedatangan & Titik Budaya</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setQrModalOpen(false)}
            className="p-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Scanner Viewfinder Simulation */}
          <div className="relative h-44 bg-stone-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-stone-800">
            {/* Viewfinder crosshairs */}
            <div className="relative w-32 h-32 border-2 border-emerald-500/80 rounded-2xl flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500/10" />
              <div className="w-full h-0.5 bg-emerald-400 opacity-80" />
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
            </div>
            <p className="text-[11px] text-stone-400 mt-2 font-medium">Arahkan kamera ke plakat fisik QR di lokasi wisata</p>
          </div>

          {/* Quick preset selector for simulation */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
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
                    className={`p-2.5 text-left rounded-xl border transition flex flex-col cursor-pointer ${
                      inputCode === q.code
                        ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold'
                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="truncate">{q.title}</span>
                      {isDraft && (
                        <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                          Draft
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono mt-0.5 truncate">{q.code}</span>
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
                className="p-2.5 text-left rounded-xl border border-dashed border-rose-300 hover:bg-rose-50 text-rose-800 text-xs flex flex-col cursor-pointer"
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
              className="flex-1 px-3.5 py-2 text-xs font-mono border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 bg-stone-50 focus:bg-white"
            />
            <button
              type="submit"
              disabled={isProcessing || !inputCode.trim()}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              {isProcessing ? 'Memeriksa...' : 'Validasi'}
            </button>
          </form>

          {/* Resolution Result Presentation */}
          {resolutionResult && (
            <div className="animate-fade-in">
              {resolutionResult.status === 'success' && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-emerald-950 text-sm">
                        {resolutionResult.qrData?.title}
                      </h4>
                      <p className="text-xs text-emerald-800 mt-0.5 font-normal">
                        {resolutionResult.qrData?.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900 uppercase tracking-wide">
                          Target: {resolutionResult.targetType}
                        </span>
                        <span className="text-xs text-emerald-800 font-semibold">
                          Journey otomatis aktif & terlacak.
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNavigateToTarget}
                    className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer"
                  >
                    <span>Masuk ke Konten Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {resolutionResult.status === 'destination_unavailable' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-amber-900">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-950 text-sm">
                        Destinasi Belum Tersedia
                      </h4>
                      <p className="text-xs text-amber-800 mt-1 leading-relaxed font-normal">
                        {resolutionResult.message}
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
                      <p className="text-xs text-rose-800 mt-1 leading-relaxed font-normal">
                        {resolutionResult.message}
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

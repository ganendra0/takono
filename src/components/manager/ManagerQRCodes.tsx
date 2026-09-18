import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { QRCodeView } from '../common/QRCodeView';
import { QrCode, ArrowLeft, Printer, Download, Filter } from 'lucide-react';

export const ManagerQRCodes: React.FC = () => {
  const { destinations, qrCodes, navigateTo, simulateScanCode } = useTakonoStore();
  const [selectedDestId, setSelectedDestId] = useState<string>(destinations[0]?.id || '');
  const [targetTypeFilter, setTargetTypeFilter] = useState<string>('all');

  const destQrs = qrCodes.filter((q) => {
    const matchDest = q.destinationId === selectedDestId;
    const matchType = targetTypeFilter === 'all' || q.targetType === targetTypeFilter;
    return matchDest && matchType;
  });

  const selectedDestination = destinations.find((d) => d.id === selectedDestId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigateTo('/manager/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Manager</span>
          </button>
          <h1 className="text-xl font-bold text-slate-900">
            Generator & Pencetakan QR Code Fisik
          </h1>
          <p className="text-xs text-slate-500">
            Plakat barcode resmi untuk dicetak dan dipasang di lokasi destinasi wisata.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDestId}
            onChange={(e) => setSelectedDestId(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-semibold"
          >
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter and instructions bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-500">Filter Tipe QR:</span>
          <select
            value={targetTypeFilter}
            onChange={(e) => setTargetTypeFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium"
          >
            <option value="all">Semua Plakat ({qrCodes.filter((q) => q.destinationId === selectedDestId).length})</option>
            <option value="destination">Gerbang Pintu Masuk</option>
            <option value="explore_point">Titik Jelajah (Explore Points)</option>
            <option value="event">Event & Festival</option>
          </select>
        </div>

        <span className="text-[11px] text-slate-400">
          Format: Standar QR Code ISO/IEC 18004 berdaya tahan outdoor tinggi.
        </span>
      </div>

      {/* QR Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destQrs.map((qr) => (
          <div
            key={qr.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:shadow-sm transition"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {qr.targetType === 'destination'
                    ? 'Pintu Gerbang Utama'
                    : qr.targetType === 'explore_point'
                    ? 'Titik Jelajah'
                    : 'Event'}
                </span>
                <button
                  type="button"
                  onClick={() => simulateScanCode(qr.code)}
                  className="text-[11px] font-semibold text-emerald-600 hover:underline"
                >
                  Tes Pindai →
                </button>
              </div>
              <h3 className="font-bold text-sm text-slate-900 leading-snug">{qr.title}</h3>
              <p className="text-xs text-slate-500">{qr.description}</p>
            </div>

            <QRCodeView
              value={qr.code}
              title={qr.title}
              subtitle={selectedDestination?.name}
              size={180}
              showActions={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { DestinationEvent } from '../../types/destination';
import { Calendar, Plus, ArrowLeft, Clock, MapPin, QrCode, X } from 'lucide-react';

export const ManagerEvents: React.FC = () => {
  const { destinations, events, addEvent, navigateTo, simulateScanCode } = useTakonoStore();
  const [selectedDestId, setSelectedDestId] = useState<string>(destinations[0]?.id || '');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Form states
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('2026-10-15');
  const [time, setTime] = useState<string>('09:00 - 15:00 WITA');
  const [locationName, setLocationName] = useState<string>('');

  const destEvents = events.filter((e) => e.destinationId === selectedDestId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent({
      destinationId: selectedDestId,
      title,
      description,
      date,
      time,
      locationName,
      status: 'upcoming',
    });
    setModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigateTo('/manager/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 mb-1 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Manager</span>
          </button>
          <h1 className="text-xl font-bold text-slate-900">Kelola Event & Festival Budaya</h1>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDestId}
            onChange={(e) => setSelectedDestId(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 font-medium shadow-2xs"
          >
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setTitle('');
              setDescription('');
              setLocationName('Pelataran Utama Desa');
              setModalOpen(true);
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>JADWALKAN EVENT</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {destEvents.map((ev) => (
          <div
            key={ev.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                  STATUS: {ev.status}
                </span>
                <span className="text-xs text-slate-500 font-mono">Kode QR: <strong className="text-slate-800">{ev.qrCodeId}</strong></span>
              </div>
              <h3 className="font-bold text-base text-slate-900">{ev.title}</h3>
              <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">{ev.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  {ev.date}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  {ev.time}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  {ev.locationName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                type="button"
                onClick={() => simulateScanCode(ev.qrCodeId)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
              >
                <QrCode className="w-4 h-4 text-blue-600" />
                <span>Simulasi Pindai QR</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-bold text-sm">Jadwalkan Event Budaya Baru</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nama Event / Festival</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Contoh: Parade Tari Pendet & Musik Tradisional"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Deskripsi Event</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Waktu / Jam</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Lokasi / Panggung</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  Jadwalkan & Generate QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
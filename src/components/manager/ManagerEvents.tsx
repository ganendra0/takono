import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { 
  Calendar, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowLeft, 
  Clock, 
  MapPin, 
  QrCode, 
  X, 
  ChevronDown
} from 'lucide-react';

export const ManagerEvents: React.FC = () => {
  const store = useTakonoStore();
  const destinations = store.destinations || [];
  const events = store.events || [];
  const navigateTo = store.navigateTo;

  // Aksi persisten ke Zustand Store
  const addEvent = (store as any).addEvent;
  const updateEvent = (store as any).updateEvent;
  const deleteEvent = (store as any).deleteEvent;

  const [selectedDestId, setSelectedDestId] = useState<string>(
    destinations[0]?.id || 'dest-penglipuran'
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

  // Murni menyaring data event dari store tanpa fallback lokal yang memicu reset
  const filteredEvents = events.filter((e) => !e.destinationId || e.destinationId === selectedDestId);

  const handleOpenModal = (eventItem?: any) => {
    if (eventItem) {
      setEditingEvent({ ...eventItem });
    } else {
      setEditingEvent({
        id: `evt-${Date.now()}`,
        destinationId: selectedDestId,
        title: '',
        description: '',
        eventDate: '2026-09-25',
        eventTime: '09:00 - 17:30 WITA',
        location: 'Pelataran Adat Utama',
        qrCodeId: `QR-EVT-${selectedDestId.toUpperCase()}-${filteredEvents.length + 1}`,
        status: 'PUBLISHED'
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    const existingIdx = store.events.findIndex((evt) => evt.id === editingEvent.id);

    if (existingIdx !== -1) {
      // Mengubah event yang ada
      if (updateEvent) {
        updateEvent(editingEvent.id, editingEvent);
      } else {
        const updatedEvents = [...store.events];
        updatedEvents[existingIdx] = { ...editingEvent };
        store.events = updatedEvents;
        setSelectedDestId(selectedDestId); // Trigger state refresh
      }
    } else {
      // Menambah event baru
      if (addEvent) {
        addEvent(editingEvent);
      } else {
        store.events = [...store.events, editingEvent];
        setSelectedDestId(selectedDestId); // Trigger state refresh
      }
    }

    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal event festival ini?')) {
      if (deleteEvent) {
        deleteEvent(eventId);
      } else {
        store.events = store.events.filter((evt) => evt.id !== eventId);
        setSelectedDestId(selectedDestId);
      }
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-neutral-800 antialiased max-w-7xl mx-auto">
      
      {/* 1. TOP HEADER & ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => navigateTo('/manager/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-blue-600 transition mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard Manager</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Kelola Event & Festival Budaya
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="relative inline-block text-left">
            <select
              value={selectedDestId}
              onChange={(e) => setSelectedDestId(e.target.value)}
              className="appearance-none bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 font-sans text-xs font-bold py-2.5 pl-4 pr-10 rounded-2xl cursor-pointer transition shadow-2xs focus:outline-none focus:border-blue-500"
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition flex items-center gap-2 shadow-md shadow-blue-500/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Jadwalkan Event</span>
          </button>
        </div>
      </div>

      {/* 2. EVENTS LIST */}
      <div className="space-y-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((evt) => {
            const dateParts = evt.eventDate ? evt.eventDate.split('-') : ['2026', '09', '20'];
            const dayNum = dateParts[2] || '20';
            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
            const monthStr = monthNames[parseInt(dateParts[1] || '09') - 1] || 'SEP';

            return (
              <div
                key={evt.id}
                className="group bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 hover:border-blue-200 hover:shadow-lg transition duration-300 space-y-6"
              >
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      STATUS: {evt.status || 'PUBLISHED'}
                    </span>

                    <span className="text-neutral-400">
                      Kode QR: <strong className="text-neutral-700 font-mono">{evt.qrCodeId || 'QR-EVT-DEFAULT'}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => alert(`Simulasi Pindai QR untuk event '${evt.title}' berhasil!`)}
                      className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-blue-100"
                    >
                      <QrCode className="w-3.5 h-3.5 text-blue-600" />
                      <span>Simulasi Pindai QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenModal(evt)}
                      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-neutral-200"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Sunting</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Hapus Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Body */}
                <div className="flex flex-col md:flex-row items-start gap-6">
                  
                  {/* Calendar Date Badge */}
                  <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center text-blue-600 shrink-0 font-mono">
                    <span className="text-2xl font-black leading-none">{dayNum}</span>
                    <span className="text-[10px] font-bold tracking-widest uppercase mt-1">{monthStr}</span>
                  </div>

                  {/* Text Details */}
                  <div className="space-y-3 flex-1">
                    <h3 className="text-xl font-black text-neutral-900 group-hover:text-blue-600 transition">
                      {evt.title}
                    </h3>

                    <p className="text-xs text-neutral-500 leading-relaxed max-w-3xl">
                      {evt.description}
                    </p>

                    {/* Metadata Grid */}
                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium text-neutral-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>{evt.eventDate}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>{evt.eventTime || '14:00 - 17:30 WITA'}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>{evt.location || 'Area Destinasi Utama'}</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-3">
            <Calendar className="w-10 h-10 text-neutral-300 mx-auto" />
            <h3 className="font-extrabold text-neutral-900 text-sm">Belum Ada Event Terjadwal</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Jadwalkan perayaan desa adat atau pertunjukan seni kebudayaan pertama untuk destinasi ini.
            </p>
          </div>
        )}
      </div>

      {/* 3. MODAL EDIT / JADWALKAN EVENT */}
      {isModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-neutral-200 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2 text-neutral-900">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base">
                  {editingEvent.title ? 'Sunting Jadwal Event' : 'Jadwalkan Event Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs font-bold">
              
              <div className="space-y-1.5">
                <label className="text-neutral-700 block">Nama Event / Festival Budaya</label>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  placeholder="Contoh: Parade Budaya & Musik Bambu Fest"
                  className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-900 bg-neutral-50/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-neutral-700 block">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    value={editingEvent.eventDate}
                    onChange={(e) => setEditingEvent({ ...editingEvent, eventDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-900 bg-neutral-50/50 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-700 block">Jam Pelaksanaan</label>
                  <input
                    type="text"
                    value={editingEvent.eventTime}
                    onChange={(e) => setEditingEvent({ ...editingEvent, eventTime: e.target.value })}
                    placeholder="14:00 - 17:30 WITA"
                    className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-900 bg-neutral-50/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-700 block">Lokasi Pelaksanaan Spesifik</label>
                <input
                  type="text"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  placeholder="Contoh: Lapangan Adat Penglipuran"
                  className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-900 bg-neutral-50/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-700 block">Kode Unik QR Event</label>
                <input
                  type="text"
                  value={editingEvent.qrCodeId}
                  onChange={(e) => setEditingEvent({ ...editingEvent, qrCodeId: e.target.value })}
                  placeholder="QR-EVT-PENG-FEST"
                  className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-900 bg-neutral-50/50 font-mono uppercase"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-700 block">Deskripsi Acara & Susunan Acara</label>
                <textarea
                  rows={3}
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  placeholder="Jelaskan detail pertunjukan seni, pakaian adat, atau informasi daya tarik acara..."
                  className="w-full p-3 rounded-2xl border border-neutral-200 focus:border-blue-500 focus:outline-none text-neutral-800 bg-neutral-50/50 leading-relaxed font-normal"
                />
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 font-bold transition hover:bg-neutral-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold transition shadow-md shadow-blue-500/20"
                >
                  Simpan Event
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManagerEvents;
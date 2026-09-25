import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../lib/api.js';
import { DestinationEvent } from '../../types/index.js';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  QrCode
} from 'lucide-react';

export const EventsPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [events, setEvents] = useState<DestinationEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [participatedIds, setParticipatedIds] = useState<string[]>([]);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const res = await ApiClient.getEvents();
      if (res.success && res.data) {
        setEvents(res.data);
      } else {
        setActiveMessage(res.message || 'Gagal memuat event.');
      }
      const activities = await ApiClient.getMyActivities();
      if (activities.success) setParticipatedIds((activities.data || []).filter(a=>a.type==='event_participated').map(a=>a.referenceId));
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <div className="space-y-5 pb-8">
      
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span>Agenda & Event Destinasi</span>
        </h1>
        <p className="text-xs text-slate-500">
          Lihat jadwal, lalu scan QR di lokasi Event untuk mencatat partisipasi.
        </p>
      </div>

      {activeMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
          <span className="font-medium">{activeMessage}</span>
          <button 
            onClick={() => setActiveMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-500">Memuat agenda event...</div>
      ) : (
        <div className="space-y-4">
          {!events.length && <p className="text-slate-500">Belum ada event tersedia.</p>}
          {events.map(event => {
            const isRegistered = participatedIds.includes(event.id);
            return (
              <div 
                key={event.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-blue-300 transition-colors"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded-md border border-blue-100">
                      +{event.pointsReward} Jejak Points
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">{event.startDate}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isRegistered
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-98'
                      }`}
                    >
                      {isRegistered ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Sudah Berpartisipasi</span>
                        </>
                      ) : (
                        <>
                          <QrCode className="w-4 h-4" />
                          <span>Scan QR di lokasi untuk klaim +{event.pointsReward} poin</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

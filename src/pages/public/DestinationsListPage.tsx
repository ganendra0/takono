import React, { useState } from 'react';
import { Destination } from '../../types/index.js';
import { ArrowLeft, MapPin, Compass, Search, Clock, ChevronRight } from 'lucide-react';
import { DemoDataNotice } from '../../components/DemoDataNotice.js';

interface DestinationsListPageProps {
  destinations: Destination[];
  onNavigate: (path: string) => void;
}

export const DestinationsListPage: React.FC<DestinationsListPageProps> = ({ destinations, onNavigate }) => {
  const [search, setSearch] = useState('');

  const filtered = destinations.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.city.toLowerCase().includes(search.toLowerCase()) ||
    d.tagline.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-blue-700 tracking-wider uppercase">
              Katalog Destinasi
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Destinasi Terhubung TAKONO
            </h1>
            <p className="text-slate-600 text-sm max-w-xl">
              Pilih destinasi untuk melihat panduan lengkap, jadwal event, dan membuka pengalaman Smart Guide.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari destinasi atau kota..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <DemoDataNotice />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filtered.map(dest => (
            <div
              key={dest.id}
              className="rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow bg-white flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-medium text-white flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{dest.city}</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="text-xs font-mono font-bold text-blue-600">
                    KODE: {dest.code}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{dest.operatingHours}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 space-y-2">
                <button
                  onClick={() => onNavigate(`/destinations/${dest.slug}`)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Buka Panduan Destinasi</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

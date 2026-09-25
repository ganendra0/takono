import React from 'react';
import { ApiClient } from '../../lib/api';
import {
  Destination,
  ExplorePoint,
  DestinationEvent,
  LocalDiscovery,
  Reward
} from '../../types/index.js';
import {
  ArrowLeft,
  Compass,
  MapPin,
  Clock,
  Ticket,
  Phone,
  Mail,
  Calendar,
  Gift,
  Store,
  QrCode,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface DestinationDetailPageProps {
  destination: Destination;
  explorePoints: ExplorePoint[];
  events: DestinationEvent[];
  localDiscoveries: LocalDiscovery[];
  rewards: Reward[];
  onNavigate: (path: string) => void;
  onOpenScanModal: () => void;
}

export const DestinationDetailPage: React.FC<DestinationDetailPageProps> = ({
  destination,
  explorePoints,
  events,
  localDiscoveries,
  rewards,
  onNavigate,
  onOpenScanModal
}) => {
  React.useEffect(() => { ApiClient.selectDestination(destination.id); }, [destination.id]);
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        <button
          onClick={() => onNavigate('/destinations')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Destinasi</span>
        </button>

        {/* Hero Banner Card */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[360px] flex flex-col justify-end p-6 sm:p-10 shadow-lg">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>

          <div className="relative z-10 space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-600 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider">
                KODE: {destination.code}
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {destination.city}, {destination.province}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {destination.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {destination.tagline}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('/app/smart-guide')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <Compass className="w-4 h-4" />
                <span>Buka Smart Guide & Peta Navigasi</span>
              </button>

              <button
                onClick={onOpenScanModal}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer border border-white/20"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan QR destinasi</span>
              </button>
            </div>
          </div>
        </div>



        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Column: Explore Points, Events, Facilities */}
          <div className="lg:col-span-2 space-y-8">

            {/* Overview */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Tentang Destinasi</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {destination.description}
              </p>

              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">
                  Fasilitas Tersedia
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {destination.facilities.map(fac => (
                    <div key={fac.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{fac.name}</div>
                        {fac.description && (
                          <div className="text-[11px] text-slate-500 mt-0.5">{fac.description}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Explore Points Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Explore Points di Destinasi Ini</h2>
                  <p className="text-xs text-slate-500">Titik fisik penjelajahan yang menyimpan narasi edukasi dan mini quiz</p>
                </div>
                <button
                  onClick={() => onNavigate('/app/smart-guide')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Peta Smart Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {explorePoints.map(point => (
                  <div
                    key={point.id}
                    onClick={() => onNavigate(`/app/explore/${point.slug}`)}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="relative h-32 rounded-xl overflow-hidden">
                        <img
                          src={point.image}
                          alt={point.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-semibold">
                          {point.category}
                        </div>
                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white rounded text-[10px] font-mono">
                          +{point.pointsReward} Pts
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {point.name}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {point.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span>Estimasi: {point.estimatedDuration}</span>
                      <span className="font-semibold text-blue-600 flex items-center gap-0.5">
                        <span>Buka Cerita</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events Preview */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Agenda & Event Terdekat</h2>
              <div className="space-y-3">
                {events.map(event => (
                  <div key={event.id} className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-4 items-center">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full sm:w-28 h-20 rounded-xl object-cover"
                      loading="lazy"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 text-[11px] text-blue-600 font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{event.time}</span>
                        <span>·</span>
                        <span>+{event.pointsReward} Poin Partisipasi</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{event.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-1">{event.description}</p>
                    </div>
                    <button
                      onClick={() => onNavigate('/app/events')}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold text-slate-800 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Detail Event
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar: Key Metadata & Local Discovery */}
          <div className="space-y-6">

            {/* Practical Visitor Info */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Informasi Kunjungan</h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Jam Buka</span>
                    <span className="text-slate-600">{destination.operatingHours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Ticket className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Tarif & Tiket</span>
                    <span className="text-slate-600">{destination.ticketInfo}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Alamat</span>
                    <span className="text-slate-600">{destination.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Kontak Informasi</span>
                    <span className="text-slate-600">{destination.contactPhone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/app/smart-guide')}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Compass className="w-4 h-4" />
                  <span>Mulai Navigasi Smart Guide</span>
                </button>
              </div>
            </div>

            {/* Local Discovery Mini Widget */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-amber-600" />
                  <span>Mitra Kuliner Terdekat</span>
                </h3>
                <button
                  onClick={() => onNavigate('/app/local-discovery')}
                  className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="space-y-3">
                {localDiscoveries.slice(0, 2).map(partner => (
                  <div key={partner.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{partner.name}</span>
                      <span className="text-[10px] text-blue-600 font-medium">{partner.category}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">{partner.promotion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Rewards */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-blue-600" />
                  <span>Reward Penukaran Poin</span>
                </h3>
                <button
                  onClick={() => onNavigate('/app/rewards')}
                  className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Katalog
                </button>
              </div>

              <div className="space-y-2">
                {rewards.slice(0, 2).map(reward => (
                  <div key={reward.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{reward.name}</div>
                      <div className="text-[10px] text-slate-500">Oleh: {reward.partner}</div>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 font-mono font-bold text-xs rounded-md">
                      {reward.pointsRequired} Pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

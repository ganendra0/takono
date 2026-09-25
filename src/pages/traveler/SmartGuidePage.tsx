import React, { useEffect, useState, useRef } from 'react';
import { ApiClient } from '../../lib/api.js';
import { 
  Destination, 
  ExplorePoint, 
  ExploreCategory, 
  DestinationFacility,
  DestinationEvent,
  LocalDiscovery
} from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { 
  Compass, 
  MapPin, 
  Navigation, 
  SlidersHorizontal, 
  CheckCircle2, 
  QrCode, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Info,
  Footprints,
  Layers,
  X
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));

interface SmartGuidePageProps {
  onNavigate: (path: string) => void;
  onOpenScanModal: (point?: ExplorePoint) => void;
}

export const SmartGuidePage: React.FC<SmartGuidePageProps> = ({ onNavigate, onOpenScanModal }) => {
  const { user } = useAuth();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  const [destination, setDestination] = useState<Destination | null>(null);
  const [explorePoints, setExplorePoints] = useState<ExplorePoint[]>([]);
  const [facilities, setFacilities] = useState<DestinationFacility[]>([]);
  const [events, setEvents] = useState<DestinationEvent[]>([]);
  const [localDiscoveries, setLocalDiscoveries] = useState<LocalDiscovery[]>([]);
  const [completedPointIds, setCompletedPointIds] = useState<string[]>([]);
  
  // Selected preferences
  const [preferences, setPreferences] = useState<ExploreCategory[]>(['Edukasi', 'Sejarah']);
  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);
  
  // Recommendation state
  const [nextPoint, setNextPoint] = useState<ExplorePoint | null>(null);
  const [recommendationReason, setRecommendationReason] = useState<string>('');
  const [walkingRoute, setWalkingRoute] = useState<any>(null);

  // Location is requested from the device; no destination coordinate is assumed.
  const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);
  const [hasLocation, setHasLocation] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(p => { setUserLocation([p.coords.latitude,p.coords.longitude]); setHasLocation(true); }, () => setError('Lokasi tidak tersedia. Rekomendasi tetap dapat digunakan tanpa jarak.'), {enableHighAccuracy:true});
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  // Arrived popup alert
  const [arrivedPoint, setArrivedPoint] = useState<ExplorePoint | null>(null);

  // Active layer filters on map
  const [showFacilities, setShowFacilities] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [showLocal, setShowLocal] = useState(true);

  // All available categories
  const allCategories: ExploreCategory[] = [
    'Edukasi',
    'Sejarah',
    'Budaya',
    'Kuliner',
    'Keluarga',
    'Alam',
    'Foto',
    'Santai'
  ];

  // 1. Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      const destRes = await ApiClient.getDestinationBySlug();
      if (destRes.success && destRes.data) {
        setDestination(destRes.data.destination);
        setExplorePoints(destRes.data.explorePoints || []);
        setFacilities(destRes.data.destination.facilities || []);
        setEvents(destRes.data.events || []);
        setLocalDiscoveries(destRes.data.localDiscoveries || []);
        mapInstanceRef.current?.setView([destRes.data.destination.latitude,destRes.data.destination.longitude],17);
      } else {
        setError(destRes.message || 'Destinasi tidak tersedia.');
      }

      // Fetch user completed points
      const albumRes = await ApiClient.getMyAlbum();
      if (albumRes.success && albumRes.data?.progress) {
        setCompletedPointIds(albumRes.data.progress.completedPointIds || []);
      }
    };

    fetchData();
  }, []);

  // 2. Fetch recommendations whenever preferences or userLocation changes
  useEffect(() => {
    const fetchRecommendations = async () => {
      const recRes = await ApiClient.getSmartGuideRecommendations({
        destinationId: destination?.id,
        preferences: preferences,
        lat: hasLocation ? userLocation[0] : undefined,
        lng: hasLocation ? userLocation[1] : undefined
      });

      if (recRes.success && recRes.data) {
        setNextPoint(recRes.data.nextRecommendation.point);
        setRecommendationReason(recRes.data.nextRecommendation.reason);
        setWalkingRoute(recRes.data.walkingRoute);
      }
    };

    fetchRecommendations();
  }, [preferences, userLocation, completedPointIds, destination?.id, hasLocation]);

  // 3. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create the map around the selected destination.
    const map = L.map(mapContainerRef.current, {
      center: [0, 0],
      zoom: 17,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // High quality OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 4. Render Markers & Layers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !destination) return;

    // Clean up previous layers
    map.eachLayer(layer => {
      if (layer instanceof L.Marker || layer instanceof L.Polygon || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Draw Destination Boundary
    if (destination.boundaryCoordinates && destination.boundaryCoordinates.length > 0) {
      const polygon = L.polygon(destination.boundaryCoordinates, {
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.08,
        weight: 2,
        dashArray: '4, 6'
      }).addTo(map);
      polygon.bindTooltip(escapeHtml(destination.name), { sticky: true });
    }

    // Custom Icon Creators
    const createCustomIcon = (bgColor: string, text: string, isCompleted: boolean) => {
      return L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div style="
            background-color: ${isCompleted ? '#10b981' : bgColor};
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: bold;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            border: 2px solid white;
          ">
            ${isCompleted ? '✓' : text}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    };

    // User Location Marker
    const userIcon = L.divIcon({
      className: 'user-location-icon',
      html: `
        <div style="position: relative; width: 24px; height: 24px;">
          <div style="
            position: absolute;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: rgba(37, 99, 235, 0.3);
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            width: 16px;
            height: 16px;
            margin: 4px;
            background: #2563eb;
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          "></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    if (hasLocation) {
      const userMarker = L.marker(userLocation, { icon: userIcon }).addTo(map);
      userMarker.bindTooltip('Lokasi perangkat', { direction: 'top' });
      userMarkerRef.current = userMarker;
    }

    // Explore Points Markers
    explorePoints.forEach(point => {
      const isCompleted = completedPointIds.includes(point.id);
      const isNextTarget = nextPoint?.id === point.id;
      
      const pointMarker = L.marker([point.latitude, point.longitude], {
        icon: createCustomIcon(
          isNextTarget ? '#2563eb' : '#0f172a',
          point.category.substring(0, 1),
          isCompleted
        )
      }).addTo(map);

      const popupHtml = `
        <div style="width: 220px; padding: 12px; font-family: 'Plus Jakarta Sans', sans-serif;">
          <div style="font-size: 10px; font-weight: 700; color: ${isCompleted ? '#059669' : '#2563eb'}; text-transform: uppercase; margin-bottom: 2px;">
            ${isCompleted ? '✓ Telah Dijelajahi' : `+${point.pointsReward} Jejak Points`}
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 4px; line-height: 1.3;">
            ${escapeHtml(point.name)}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
            Kategori: ${escapeHtml(point.category)} · ${escapeHtml(point.estimatedDuration)}
          </div>
          <div style="display: flex; gap: 4px;">
            <a href="#/app/explore/${encodeURIComponent(point.slug)}" style="
              display: block;
              text-align: center;
              background: #2563eb;
              color: white;
              padding: 6px 10px;
              border-radius: 8px;
              font-size: 11px;
              font-weight: 600;
              text-decoration: none;
              flex: 1;
            ">Buka Cerita</a>
          </div>
        </div>
      `;

      pointMarker.bindPopup(popupHtml);
    });

    // Facility Markers
    if (showFacilities) {
      facilities.forEach(fac => {
        const facIcon = L.divIcon({
          className: 'fac-icon',
          html: `
            <div style="
              background: #475569;
              color: white;
              width: 22px;
              height: 22px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 9px;
              border: 1.5px solid white;
            ">
              ⚲
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        const m = L.marker([fac.latitude, fac.longitude], { icon: facIcon }).addTo(map);
        m.bindTooltip(escapeHtml(`Fasilitas: ${fac.name}`), { direction: 'top' });
      });
    }

    // Events Markers
    if (showEvents && events.length > 0) {
      events.forEach(evt => {
        const evtIcon = L.divIcon({
          className: 'evt-icon',
          html: `
            <div style="
              background: #d97706;
              color: white;
              width: 26px;
              height: 26px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            ">
              ★
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const m = L.marker([destination.latitude, destination.longitude], { icon: evtIcon }).addTo(map);
        m.bindTooltip(escapeHtml(`Event: ${evt.title} — ${evt.location} (${evt.time}); pin lokasi destinasi`), { direction: 'top' });
      });
    }

    // Walking Route Polyline
    if (walkingRoute && walkingRoute.waypoints && walkingRoute.waypoints.length > 0) {
      const polyline = L.polyline(walkingRoute.waypoints, {
        color: '#2563eb',
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8'
      }).addTo(map);
      routePolylineRef.current = polyline;
    }

    if (showLocal) localDiscoveries.forEach(partner => {
      L.marker([partner.latitude, partner.longitude], {icon:createCustomIcon('#b45309','L',false)}).addTo(map).bindTooltip(escapeHtml(partner.name));
    });
  }, [destination, explorePoints, facilities, events, completedPointIds, nextPoint, walkingRoute, showFacilities, showEvents, userLocation, hasLocation, showLocal, localDiscoveries]);

  // Handle Arrival Simulation
  const focusPoint = (point: ExplorePoint) => {
    setArrivedPoint(point);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([point.latitude, point.longitude], 18);
    }
  };

  const togglePreference = (cat: ExploreCategory) => {
    if (preferences.includes(cat)) {
      if (preferences.length > 1) {
        setPreferences(preferences.filter(c => c !== cat));
      }
    } else {
      setPreferences([...preferences, cat]);
    }
  };

  return (
    <div className="space-y-3 pb-8">
      
      {/* 1. Header Bar: Title & Preference Trigger */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            <Compass className="w-5 h-5 text-blue-600" />
            <span>Smart Guide</span>
          </h1>
          <p className="text-[11px] text-slate-500">
            Pemandu rute navigasi & penemuan titik jelajah
          </p>
        </div>

        <button
          onClick={() => setIsPrefModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-blue-300 transition-colors shadow-xs cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
          <span>Preferensi ({preferences.length})</span>
        </button>
      </div>

      {/* 2. Active Preferences Horizontal Chips */}
      {error && <p role="status" className="text-xs text-amber-800">{error}</p>}
      <p className="text-xs text-slate-500">{destination?.name} · Garis peta menunjukkan arah langsung; ikuti jalur resmi destinasi.</p>
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">Fokus Minat:</span>
        {preferences.map(p => (
          <span key={p} className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-medium rounded-md border border-blue-100 whitespace-nowrap text-[11px]">
            {p}
          </span>
        ))}
        <button 
          onClick={() => setIsPrefModalOpen(true)}
          className="text-blue-600 text-[11px] font-semibold hover:underline whitespace-nowrap ml-1 cursor-pointer"
        >
          Ubah
        </button>
      </div>

      {/* 3. Real Leaflet Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-[380px] sm:h-[450px] bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Quick Layer Toggles */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-xs text-[11px]">
          <button
            onClick={() => setShowFacilities(!showFacilities)}
            className={`px-2 py-1 rounded text-left font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showFacilities ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500'
            }`}
          >
            <span>⚲</span>
            <span>Fasilitas</span>
          </button>
          <button
            onClick={() => setShowEvents(!showEvents)}
            className={`px-2 py-1 rounded text-left font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showEvents ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-500'
            }`}
          >
            <span>★</span>
            <span>Event</span>
          </button>
        </div>

        {/* Floating Location Helper Tooltip */}
        <div className="absolute bottom-3 left-3 z-20 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-2 border border-slate-700">
          <Navigation className="w-3 h-3 text-blue-400 animate-pulse" />
          <span>{hasLocation ? 'Pin biru: lokasi perangkat.' : 'Aktifkan lokasi untuk melihat jarak.'}</span>
        </div>
      </div>

      {/* 4. RECOMMENDATION CARD (The Smart Guide core!) */}
      {nextPoint ? (
        <div className="p-4 bg-white rounded-2xl border border-blue-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Titik Rekomendasi Berikutnya</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {walkingRoute ? `±${walkingRoute.distanceMeters}m · ${walkingRoute.estimatedWalkingMinutes} menit jalan` : ''}
            </span>
          </div>

          <div className="flex gap-3 items-center">
            <img 
              src={nextPoint.image} 
              alt={nextPoint.name}
              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200" 
            />
            <div className="flex-1 space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {nextPoint.name}
              </h3>
              <p className="text-[11px] text-slate-500">
                {recommendationReason || nextPoint.description}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => focusPoint(nextPoint)}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
            >
              <Footprints className="w-4 h-4" />
              <span>Lihat Titik & Scan QR</span>
            </button>

            <button
              onClick={() => onNavigate(`/app/explore/${nextPoint.slug}`)}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Detail Titik
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="text-sm font-bold text-emerald-900">Tidak Ada Rekomendasi Baru</h3>
          <p className="text-xs text-emerald-700">
            {recommendationReason || 'Memuat rekomendasi atau belum ada titik tersedia.'}
          </p>
          <button
            onClick={() => onNavigate('/app/rewards')}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            Tukarkan Jejak Points
          </button>
        </div>
      )}

      {/* 5. ALL EXPLORE POINTS LIST IN THIS DESTINATION */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Daftar Seluruh Titik Jelajah ({explorePoints.length})
        </h3>

        <div className="space-y-2">
          {explorePoints.map((point, index) => {
            const isCompleted = completedPointIds.includes(point.id);
            return (
              <div
                key={point.id}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {point.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                      <span>{point.category}</span>
                      <span>·</span>
                      <span>{point.estimatedDuration}</span>
                      <span>·</span>
                      <span className="font-mono text-blue-600">+{point.pointsReward} Pts</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => focusPoint(point)}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Lihat Titik"
                  >
                    <Navigation className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onNavigate(`/app/explore/${point.slug}`)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    Buka
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ARRIVAL POPUP (Section 11 requirement: User tiba -> Popup: "Kamu sudah sampai!" -> Scan QR Explore Point) */}
      {arrivedPoint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl text-center animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                Titik Pilihan
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                {arrivedPoint.name}
              </h3>
              <p className="text-xs text-slate-600">
                Pindai papan QR fisik titik ini untuk membuka cerita tersembunyi, kuis interaktif, dan Jejak Points.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  const pt = arrivedPoint;
                  setArrivedPoint(null);
                  onOpenScanModal(pt);
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan QR Explore Point</span>
              </button>

              <button
                onClick={() => {
                  const slug = arrivedPoint.slug;
                  setArrivedPoint(null);
                  onNavigate(`/app/explore/${slug}`);
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Buka Halaman Cerita Titik
              </button>

              <button
                onClick={() => setArrivedPoint(null)}
                className="text-xs text-slate-400 hover:text-slate-600 pt-1 cursor-pointer"
              >
                Tutup Notifikasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREFERENCE SELECTOR MODAL */}
      {isPrefModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>Preferensi Minat Jelajah</span>
              </h3>
              <button 
                onClick={() => setIsPrefModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Pilih satu atau beberapa kategori yang paling menarik bagimu. Smart Guide akan menyesuaikan urutan rekomendasi rute penjelajahan.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {allCategories.map(cat => {
                const isSelected = preferences.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => togglePreference(cat)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all text-left flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <span className="text-blue-600 text-xs">✓</span>}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsPrefModalOpen(false)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Terapkan Preferensi
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

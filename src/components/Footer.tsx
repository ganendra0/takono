import React from 'react';
import { TakonoLogo } from './TakonoLogo.js';
import { Group8Partners } from './Group8Partners.js';
import { Compass, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 mb-10">
          
          {/* Brand Column with Authentic TAKONO Logo */}
          <div className="col-span-2 md:col-span-5 space-y-4 pr-0 md:pr-6">
            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center rounded-xl bg-white px-3 py-2 cursor-pointer hover:opacity-95 transition-opacity"
            >
              <TakonoLogo variant="full" size="lg" theme="dark" />
            </button>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-white tracking-tight">
                "Malu Bertanya? TAKONO."
              </p>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                Berasal dari falsafah bahasa Jawa <em className="text-slate-300">"takon o"</em> (bertanyalah). Platform smart guide & tourism discovery digital yang membantu wisatawan menyingkap cerita, warisan edukasi, dan potensi lokal tersembunyi di setiap destinasi Indonesia.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>Surabaya, Jawa Timur, Indonesia</span>
            </div>
          </div>

          {/* Nav Column 1: Eksplorasi Wisatawan */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Eksplorasi</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('/destinations')} 
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Destinasi Terhubung
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/app/smart-guide')} 
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>Smart Guide & Peta</span>
                  <span className="text-[10px] text-blue-400 font-mono">NEW</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/how-it-works')} 
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Alur Jelajah Wisatawan
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/about')} 
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Filosofi & Misi
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/app/rewards')} 
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Katalog Jejak Rewards
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Column 2: Ekosistem & Multi-Stakeholder */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ekosistem</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('/manager')} 
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Portal Pengelola
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/government')} 
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Tourism Intelligence (Dinas)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/app/local-discovery')} 
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Mitra UMKM & Kuliner
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/admin')} 
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Administrasi Platform
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Column 3: Trust & Inovasi */}
          <div className="col-span-2 md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Inovasi Pariwisata</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mengintegrasikan geolokasi interaktif, kurasi narasi terverifikasi, kuis wawasan, dan dampak ekonomi langsung ke UMKM lokal sekitar destinasi.
            </p>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Transparansi Data & Privasi</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Seluruh metrik agregat wisata dikelola tanpa membagi identitas pribadi traveler.
              </p>
            </div>
          </div>

        </div>

        {/* PARTNER LOGOS: GROUP 8 IN FOOTER ONLY */}
        <div className="pt-10 pb-8 border-t border-slate-800/80">
          <Group8Partners theme="dark" />
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} TAKONO Digital Tourism Platform. Hak Cipta Dilindungi.</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-3 text-[11px] text-center">
            <span>Jagoan Hosting Innovation Competition 2026</span>
            <span aria-hidden="true">·</span>
            <span>OpenStreetMap & Leaflet</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-mono font-medium">Platform Online</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

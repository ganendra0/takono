import React from 'react';
import { TakonoLogo } from './TakonoLogo';
import { Group8Partners } from './Group8Partners';
import { MapPin, ArrowUpRight } from 'lucide-react';

export function Footer({ onNavigate }: { onNavigate: (path: string) => void }) {
  return <footer className="border-t border-slate-200 bg-white text-slate-600">
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="footer-links grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-[2fr_1fr_1fr]">
        <div><button aria-label="Beranda TAKONO" onClick={() => onNavigate('/')}><TakonoLogo size="md" /></button><p className="mt-4 max-w-sm text-sm leading-6">Kenali destinasi, temukan cerita, dan singgah di tempat lokal sepanjang perjalanan.</p><p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><MapPin size={14} /> Surabaya, Indonesia</p></div>
        <div><h2 className="mb-4 text-sm font-semibold text-slate-900">Jelajahi</h2><div className="flex flex-col items-start gap-3">{[['Destinasi','/destinations'],['Smart Guide','/app/smart-guide'],['Agenda','/app/events'],['Usaha lokal','/app/local-discovery'],['Reward','/app/rewards']].map(([label,path]) => <button key={path} className="text-sm hover:text-blue-700" onClick={()=>onNavigate(path)}>{label}</button>)}</div></div>
        <div><h2 className="mb-4 text-sm font-semibold text-slate-900">Tentang TAKONO</h2><div className="flex flex-col items-start gap-3">{[['Cara menggunakan','/how-it-works'],['Tentang kami','/about'],['Portal pengelola','/manager'],['Portal pemerintah','/government'],['Administrasi','/admin']].map(([label,path]) => <button key={path} className="flex items-center gap-1 text-sm hover:text-blue-700" onClick={()=>onNavigate(path)}>{label}<ArrowUpRight size={12}/></button>)}</div></div>
      </div>
      <div className="mt-10 border-t border-slate-100 pt-6"><Group8Partners /></div>
      <p className="mt-6 border-t border-slate-100 pt-5 text-xs text-slate-400">© {new Date().getFullYear()} TAKONO. Jelajah dengan rasa ingin tahu.</p>
    </div>
  </footer>;
}

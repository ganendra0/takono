import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const highlights = [
  'Menemukan titik penting di dalam destinasi.',
  'Membaca cerita yang terkait langsung dengan tempat.',
  'Mengenal aktivitas dan usaha lokal di sekitar.',
  'Menyimpan perjalanan tanpa membuat pengalaman terasa rumit.',
];

export function AboutPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  return <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
    <button onClick={() => onNavigate('/')} className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"><ArrowLeft size={16} />Beranda</button>

    <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_.8fr] lg:gap-16">
      <section>
        <p className="text-sm font-medium text-blue-700">TENTANG TAKONO</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Malu bertanya?<br />Takono.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">Nama TAKONO berangkat dari ungkapan Jawa “takon o”—bertanyalah. Kami membantu pengunjung memahami tempat yang sedang didatangi, bukan sekadar menemukan lokasinya.</p>
        <button onClick={() => onNavigate('/destinations')} className="primary-button mt-8">Lihat destinasi <ArrowRight size={17} /></button>
      </section>

      <aside className="border-t border-slate-900 pt-5">
        <h2 className="text-base font-semibold text-slate-950">Yang bisa dilakukan</h2>
        <ul className="mt-4 divide-y divide-slate-200 text-sm leading-6 text-slate-600">
          {highlights.map((item, index) => <li key={item} className="grid grid-cols-[2rem_1fr] gap-3 py-4"><span className="font-mono text-xs text-blue-700">0{index + 1}</span><span>{item}</span></li>)}
        </ul>
      </aside>
    </div>
  </main>;
}

import React from 'react';
import { ArrowRight, BookOpen, Compass, QrCode, Sparkles } from 'lucide-react';

export function HomePage({ onOpenScanModal }: { onOpenScanModal: () => void }) {
  return (
    <main className="flex min-h-[calc(100vh-4.5rem)] items-center bg-white text-slate-900">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-20 lg:py-24">
        <section className="max-w-2xl">
          <p className="mb-5 flex items-center gap-2 text-xs font-semibold tracking-[.16em] text-blue-700">
            <span className="h-px w-8 bg-blue-600" /> MENGENAL TAKONO
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-[-.04em] sm:text-5xl lg:text-6xl">
            TAKONO menemani setiap langkah jelajahmu.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            TAKONO adalah panduan wisata digital yang menghubungkan pengalaman menjelajah dengan cerita, pengetahuan, dan aktivitas menarik. Temukan makna di balik perjalananmu, satu langkah pada satu waktu.
          </p>
          <button
            onClick={onOpenScanModal}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
          >
            <QrCode size={18} /> Scan QR <ArrowRight size={17} />
          </button>
          <p className="mt-3 text-xs text-slate-500">Mulai menjelajah dengan TAKONO.</p>
        </section>

        <section aria-label="Tentang TAKONO" className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-5 rounded-[2rem] bg-blue-50" />
          <div className="relative space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-700 text-white"><Sparkles size={23} /></span>
              <div><p className="text-xs font-medium uppercase tracking-wider text-blue-700">TAKONO</p><p className="mt-1 text-lg font-semibold">Jelajah lebih bermakna</p></div>
            </div>
            {[
              { icon: Compass, title: 'Jelajahi dengan panduan', text: 'Ikuti pengalaman digital yang dirancang untuk menemani perjalanan.' },
              { icon: BookOpen, title: 'Kenali cerita dan pengetahuan', text: 'Setiap perjalanan memberi ruang untuk belajar hal baru.' },
              { icon: QrCode, title: 'Scan untuk memulai', text: 'Gunakan QR untuk membuka pengalaman TAKONO.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-blue-700 shadow-sm"><Icon size={19} /></span>
                <div><h2 className="text-sm font-semibold">{title}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

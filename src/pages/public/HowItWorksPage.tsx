import React from 'react';
import { ArrowLeft, QrCode, Compass, Award, Gift, ArrowRight, CheckCircle2 } from 'lucide-react';

export const HowItWorksPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const steps = [
    {
      num: '01',
      title: 'Scan QR Destinasi di Pintu Masuk',
      desc: 'Setiap destinasi terintegrasi memasang kode QR unik di gerbang masuk. Cukup arahkan kamera ponselmu untuk membuka sambutan digital seketika.',
      tag: 'Akses Instan'
    },
    {
      num: '02',
      title: 'Tentukan Preferensi Jelajahmu',
      desc: 'Apakah kamu datang bersama keluarga? Mencari edukasi satwa, fotografi, spot santai, atau petualangan sejarah? TAKONO menyesuaikan rekomendasinya.',
      tag: 'Personalisasi'
    },
    {
      num: '03',
      title: 'Ikuti Pemandu Smart Guide',
      desc: 'Buka peta terintegrasi yang menunjukkan posisimu, batas area destinasi, titik fasilitas (musholla, toilet, pos medis), dan rute jalan kaki paling efisien.',
      tag: 'Navigasi Presisi'
    },
    {
      num: '04',
      title: 'Tiba di Explore Point & Buka Ceritanya',
      desc: 'Saat kamu tiba dalam radius titik jelajah fisik, kamu akan menerima notifikasi kedatangan untuk memindai token unik titik dan membuka cerita tersembunyi.',
      tag: 'Penemuan Otentik'
    },
    {
      num: '05',
      title: 'Taklukkan Mini Quiz & Raih Jejak Points',
      desc: 'Uji daya ingat dan wawasan barumu melalui kuis singkat pilihan ganda. Jawaban yang tepat akan menghadiahkan poin yang masuk langsung ke buku kas digitalmu.',
      tag: 'Gamifikasi'
    },
    {
      num: '06',
      title: 'Tukarkan Reward & Singgah di Local Discovery',
      desc: 'Tukarkan Jejak Points dengan diskon tiket, cendera mata, atau kunjungi mitra kuliner UMKM lokal di sekitar destinasi untuk mencicipi rasa khas daerah.',
      tag: 'Manfaat Nyata'
    }
  ];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span>Panduan Langkah demi Langkah</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Bagaimana TAKONO Bekerja?
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
            Dari satu ketukan di gerbang masuk hingga penukaran reward bernilai, berikut adalah alur lengkap pengalaman penjelajahan bersama TAKONO.
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="p-6 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col md:flex-row gap-6 items-start hover:border-blue-300 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-mono font-bold text-lg flex items-center justify-center shrink-0 shadow-xs">
                {step.num}
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    {step.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-slate-900 text-white rounded-2xl space-y-4 text-center">
          <h3 className="text-2xl font-bold">Siap Mencoba Pengalaman Ini Secara Langsung?</h3>
          <p className="text-slate-300 text-xs max-w-md mx-auto">
            Gunakan simulasi destinasi Kebun Binatang Surabaya dan rasakan kemudahan Smart Guide sekarang.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/app/smart-guide')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-sm"
            >
              Buka Smart Guide KBS
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { ArrowLeft, Compass, Sparkles, Heart, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
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
            <span>Filosofi & Misi TAKONO</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Tentang TAKONO
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed italic">
            "Malu Bertanya? TAKONO."
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm leading-relaxed">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Makna Nama</h3>
            <p>
              Nama <strong>TAKONO</strong> berakar dari frasa bahasa Jawa <em>"takon o"</em> yang berarti <em>"tanya saja"</em>. Pepatah klasik nusantara mengingatkan kita bahwa: <em>"Malu bertanya, sesat di jalan."</em> Dalam konteks pariwisata modern, banyak wisatawan bukan tersesat secara geografis, melainkan <strong>tersesat dari cerita dan makna</strong> yang sesungguhnya ada di depan mata mereka.
            </p>
          </div>

          <h3 className="text-lg font-bold text-slate-900 pt-4">Tujuan & Masalah yang Kami Selesaikan</h3>
          <p>
            Banyak potensi yang tersedia di sebuah destinasi belum tentu ditemukan oleh wisatawan. Wisatawan seringkali hanya berkerumun di spot foto paling viral, sementara paviliun edukasi bersejarah, keunikan botani langka, pertunjukan satwa tersembunyi, hingga kelezatan kuliner lokal di sekitar gerbang destinasi terlewatkan begitu saja.
          </p>
          <p>
            TAKONO lahir untuk mengubah cara wisatawan berinteraksi dengan destinasi:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Pemandu Cerdas & Terarah</span>
              </h4>
              <p className="text-xs text-slate-600">
                Memberikan rute penjelajahan yang disesuaikan dengan minat pribadi, bukan sekadar menampilkan daftar tempat tanpa konteks.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600" />
                <span>Edukasi & Gamifikasi Bernilai</span>
              </h4>
              <p className="text-xs text-slate-600">
                Menyajikan cerita mendalam dan kuis interaktif yang menghasilkan Jejak Points yang dapat ditukarkan di mitra lokal.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-900 pt-4">Prinsip & Nilai Kami</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Autentik & Berbasis Cerita Nyata:</strong> Seluruh narasi edukatif diolah bersama kurator dan pengelola destinasi langsung.</li>
            <li><strong>Dukungan Ekonomi Lokal:</strong> Menghubungkan wisatawan dengan UMKM terdekat melalui Local Discovery tanpa potongan biaya pasar.</li>
            <li><strong>Transparansi Data & Privasi:</strong> Kami menjunjung tinggi keamanan data. Seluruh insight pariwisata yang kami bagikan kepada pengelola dan pemerintah berbentuk agregat tanpa membuka data identitas pribadi pengguna.</li>
          </ul>
        </div>

        <div className="p-6 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-blue-900 text-sm">Ingin Berkolaborasi Bersama TAKONO?</h4>
            <p className="text-xs text-blue-700 mt-0.5">Kami terbuka untuk kemitraan pengelola destinasi dan dinas pariwisata daerah.</p>
          </div>
          <button
            onClick={() => onNavigate('/manager')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            Hubungi Tim Kemitraan
          </button>
        </div>

      </div>
    </div>
  );
};

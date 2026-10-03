import React, { useEffect, useState } from 'react';
import {
  Album,
  ArrowRight,
  Compass,
  MapPin,
  QrCode,
  ShieldCheck,
  ArrowUpRight,
  UsersRound,
} from 'lucide-react';
import { ApiClient } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.js';

export const PersonalHomePage: React.FC<{
  onNavigate: (path: string) => void;
  onOpenScanModal: () => void;
}> = ({ onNavigate, onOpenScanModal }) => {
  const { user, pointsBalance } = useAuth();
  const [album, setAlbum] = useState<any>(null);

  useEffect(() => {
    ApiClient.getMyAlbum(false).then((result) => {
      if (result.success) setAlbum(result.data);
    });
  }, []);

  const lastJourney = album?.journeys?.[0];

  return (
    <div className="mx-auto max-w-7xl pb-16 pt-4">

      {/* =========================================================
          INTRO
      ========================================================= */}
      <section className="mb-10 flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            Ekowisata & Warisan Budaya
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-6xl">
            Halo, {user?.name?.split(' ')[0] || 'Traveler'}.
            <br />
            <span className="text-slate-400">
              Mau menjelajah ke mana hari ini?
            </span>
          </h1>
        </div>

        {/* Points */}
        <button
          onClick={() => onNavigate('/app/points')}
          className="group flex w-fit items-center gap-4 text-left transition-opacity hover:opacity-70 cursor-pointer"
        >
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Poin perjalanan
            </p>

            <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              {pointsBalance}
              <span className="ml-1 text-sm font-medium text-slate-400">
                PTS
              </span>
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-all group-hover:border-slate-400 group-hover:text-slate-950">
            <ArrowUpRight size={17} />
          </div>
        </button>
      </section>

      {/* =========================================================
          MAIN JOURNEY FEATURE
      ========================================================= */}
      <section className="grid gap-5 lg:grid-cols-12">

        {/* Destination Feature */}
        <div className="lg:col-span-8">
          {lastJourney ? (
            <article className="group relative overflow-hidden rounded-[2rem] bg-slate-900">

              <div className="relative h-[420px] sm:h-[500px]">
                <img
                  src={lastJourney.destination.heroImage}
                  alt=""
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />

                {/* Natural image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                {/* Top label */}
                <div className="absolute left-5 top-5 sm:left-7 sm:top-7">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-800 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    Kunjungan terakhir
                  </span>
                </div>

                {/* Destination information */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                    <div>
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/75">
                        <MapPin size={13} />
                        {lastJourney.destination.city}
                      </p>

                      <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        {lastJourney.destination.name}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-md">
                      <div>
                        <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-white/55">
                          Progress jelajah
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                          <span className="text-blue-300">
                            {lastJourney.explorePointsCompleted || 0}
                          </span>
                          <span className="mx-1 text-white/40">/</span>
                          {lastJourney.explorePointsTotal || 0}
                          <span className="ml-1 font-normal text-white/55">
                            titik
                          </span>
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </article>
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-[#fafaf8] px-6 text-center sm:min-h-[500px]">

              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
                <Compass size={28} strokeWidth={1.5} />
              </div>

              <h2 className="mt-6 text-xl font-semibold tracking-tight text-slate-900">
                Belum ada perjalanan
              </h2>

              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                Scan QR di gapura atau plakat pintu masuk destinasi
                untuk membuka perjalanan pertamamu.
              </p>

            </div>
          )}
        </div>

        {/* =====================================================
            SIDE ACTION PANEL
        ===================================================== */}
        <div className="flex flex-col gap-5 lg:col-span-4">

          {/* Scan */}
          <div className="flex flex-1 flex-col justify-between rounded-[2rem] bg-blue-50 p-6 sm:p-7">

            <div>
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-white text-blue-700">
                <QrCode size={20} strokeWidth={1.7} />
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-700">
                Mulai perjalanan
              </p>

              <h3 className="mt-3 max-w-xs text-2xl font-semibold leading-tight tracking-tight text-slate-950">
                Temukan cerita di setiap destinasi.
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
                Pindai plakat untuk membuka informasi destinasi,
                mengikuti kuis budaya, dan mendapatkan poin.
              </p>
            </div>

            <button
              onClick={onOpenScanModal}
              className="mt-8 flex w-full items-center justify-between rounded-xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.99] cursor-pointer"
            >
              <span>Scan QR sekarang</span>

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

          </div>

          {/* Album */}
          <button
            onClick={() => onNavigate('/app/album')}
            className="group rounded-[2rem] border border-slate-200 bg-white p-6 text-left transition-all hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-start justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                <Album size={20} strokeWidth={1.7} />
              </div>

              <ArrowUpRight
                size={18}
                className="text-slate-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-900"
              />

            </div>

            <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Koleksi perjalanan
            </p>

            <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
              Album Saya
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Simpan dan lihat kembali setiap destinasi yang sudah kamu
              jelajahi.
            </p>
          </button>

        </div>
      </section>

      {/* =========================================================
          INFORMATION STRIP
      ========================================================= */}
      <section className="mt-5 grid gap-5 sm:grid-cols-3">

        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={18}
              strokeWidth={1.7}
              className="mt-0.5 text-blue-700"
            />

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Informasi terverifikasi
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Konten berasal dari pengelola dan sumber resmi destinasi.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-start gap-3">
            <UsersRound
              size={18}
              strokeWidth={1.7}
              className="mt-0.5 text-blue-700"
            />

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Setiap kunjungan berarti
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Jelajahi budaya lokal sambil mendukung ekonomi masyarakat.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-start gap-3">
            <MapPin
              size={18}
              strokeWidth={1.7}
              className="mt-0.5 text-blue-700"
            />

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Jelajahi Nusantara
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Temukan tempat, cerita, dan pengalaman yang berbeda.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* =========================================================
          RECENT JOURNEY
          Kept as a secondary section so existing journey data
          remains visible.
      ========================================================= */}
      {lastJourney && (
        <section className="mt-16 border-t border-slate-200 pt-8">

          <div className="mb-6 flex items-end justify-between gap-4">

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Your journey
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Perjalanan yang tersimpan
              </h2>
            </div>

            <button
              onClick={() => onNavigate('/app/album')}
              className="group inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-950 cursor-pointer"
            >
              Lihat semua
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

          </div>

          <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-slate-300 sm:flex-row">

            <div className="relative h-52 overflow-hidden sm:h-auto sm:w-64">
              <img
                src={lastJourney.destination.heroImage}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">

              <div>

                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  Tersimpan di album
                </div>

                <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
                  {lastJourney.destination.name}
                </h3>

                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin size={13} />
                  {lastJourney.destination.city}
                </p>

              </div>

              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">

                <span className="text-xs text-slate-500">
                  Progress perjalanan
                </span>

                <span className="text-xs font-semibold text-slate-900">
                  <span className="text-blue-700">
                    {lastJourney.explorePointsCompleted || 0}
                  </span>
                  <span className="mx-1 text-slate-300">/</span>
                  {lastJourney.explorePointsTotal || 0} titik
                </span>

              </div>

            </div>
          </article>

        </section>
      )}

    </div>
  );
};

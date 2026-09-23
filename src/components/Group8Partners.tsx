import React from 'react';

interface Group8PartnersProps {
  variant?: 'banner' | 'grid' | 'compact';
  theme?: 'dark' | 'light';
  className?: string;
}

export const Group8Partners: React.FC<Group8PartnersProps> = ({
  variant = 'banner',
  theme = 'dark',
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-blue-400">
            Official Competition & Ecosystem Partners
          </span>
          <p className="text-xs text-slate-400 mt-0.5">
            Diinisiasi untuk Jagoan Hosting Innovation Competition 2026 bekerja sama dengan ekosistem digital nasional
          </p>
        </div>
        <div className="text-[11px] font-mono text-slate-400 shrink-0">
          Cohort 2026 · Group 8
        </div>
      </div>

      {/* Partner Logos Container with high-clarity crisp white backdrop matching the original asset */}
      <div className="w-full bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-sm overflow-x-auto">
        <div className="min-w-[840px] flex items-center justify-between gap-6 py-1">
          
          {/* 1. Jagoan Hosting Innovation Competition 2026 Badge */}
          <div className="flex items-center gap-3 shrink-0 group">
            <div className="relative flex flex-col items-center">
              <svg width="150" height="70" viewBox="0 0 200 95" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-105 duration-200">
                {/* Outer Orange Wings */}
                <path d="M 20 50 L 0 54 L 14 78 L 36 78 Z" fill="#F36F21" />
                <path d="M 180 50 L 200 54 L 186 78 L 164 78 Z" fill="#F36F21" />
                {/* Shield Body */}
                <polygon points="26,18 174,18 168,76 100,90 32,76" fill="#1C2127" stroke="#F36F21" strokeWidth="4" />
                {/* Top mini badge */}
                <rect x="70" y="24" width="60" height="14" rx="2" fill="#F36F21" />
                <text x="100" y="34" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
                  jh Jagoan Hosting_
                </text>
                {/* INNOVATION text */}
                <text x="100" y="55" fill="#FFFFFF" fontSize="19" fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="1">
                  INNOVATION
                </text>
                {/* Red/Orange Ribbon */}
                <polygon points="38,62 162,62 154,76 46,76" fill="#EA3826" />
                <text x="100" y="72" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="1.5">
                  COMPETITION
                </text>
                {/* Year 2026 */}
                <text x="100" y="85" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="4">
                  2 0 2 6
                </text>
              </svg>
            </div>
          </div>

          <div className="h-10 w-px bg-slate-200 shrink-0" />

          {/* 2. Jagoan Hosting Main Logo */}
          <div className="flex items-center gap-3 shrink-0 group">
            {/* Orange square icon */}
            <div className="w-12 h-12 rounded-xl bg-[#F36F21] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 duration-200">
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Stylized jh upward arrow mark */}
                <path d="M 12 16 L 12 28 C 12 30 14 31 16 31 C 18 31 19 30 19 28 L 19 20 L 21 20 L 21 28 C 21 30 23 31 25 31 C 27 31 28 30 28 28 L 28 16 L 20 8 Z" fill="#FFFFFF" />
                <polygon points="20,8 14,15 18,15 18,22 22,22 22,15 26,15" fill="#FFFFFF" />
              </svg>
            </div>
            {/* Text */}
            <div className="leading-tight">
              <div className="text-lg font-bold text-slate-900 tracking-tight font-sans">
                Jagoan
              </div>
              <div className="text-lg font-bold text-slate-900 tracking-tight font-sans flex items-center">
                <span>Hosting</span>
                <span className="text-[#F36F21] font-mono ml-0.5">_</span>
              </div>
            </div>
          </div>

          <div className="h-10 w-px bg-slate-200 shrink-0" />

          {/* 3. NGALUP.CO */}
          <div className="flex items-center gap-2.5 shrink-0 group">
            {/* Blue paw/nodes emblem */}
            <svg width="34" height="34" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-105 duration-200">
              <circle cx="14" cy="18" r="7" fill="#0055FE" />
              <circle cx="30" cy="12" r="7" fill="#0055FE" />
              <circle cx="46" cy="18" r="7" fill="#0055FE" />
              <path d="M 16 42 C 16 34 22 30 30 30 C 38 30 44 34 44 42 C 44 46 41 50 30 50 C 19 50 16 46 16 42 Z" fill="#0055FE" />
            </svg>
            <span className="text-xl font-black tracking-tight text-[#0055FE] font-sans">
              NGALUP.CO
            </span>
          </div>

          <div className="h-10 w-px bg-slate-200 shrink-0" />

          {/* 4. KOMDIGI */}
          <div className="flex flex-col items-center shrink-0 group">
            {/* Colored pixel cluster */}
            <svg width="42" height="32" viewBox="0 0 60 46" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-105 duration-200">
              <rect x="12" y="4" width="10" height="10" fill="#991B1B" rx="1.5" />
              <rect x="24" y="4" width="10" height="10" fill="#0284C7" rx="1.5" />
              <rect x="36" y="4" width="10" height="10" fill="#0EA5E9" rx="1.5" />
              <rect x="24" y="16" width="10" height="10" fill="#0369A1" rx="1.5" />
              <rect x="36" y="16" width="10" height="10" fill="#0284C7" rx="1.5" />
              <rect x="48" y="16" width="10" height="10" fill="#EAB308" rx="1.5" />
              <rect x="24" y="28" width="10" height="10" fill="#0284C7" rx="1.5" />
            </svg>
            <div className="text-sm font-bold tracking-wider text-slate-800 font-sans mt-0.5">
              KOMDIGI
            </div>
          </div>

          <div className="h-10 w-px bg-slate-200 shrink-0" />

          {/* 5. GARUDA SPARK INNOVATION HUB by KOMDIGI */}
          <div className="flex items-center gap-3 shrink-0 group">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                {/* Garuda swooping wing logo */}
                <svg width="34" height="28" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-105 duration-200">
                  <path d="M 6 32 C 10 14 26 4 44 8 C 34 10 24 16 18 24 C 15 28 12 32 6 32 Z" fill="#0284C7" />
                  <path d="M 20 22 C 26 12 38 6 46 10 C 38 12 32 18 28 26 Z" fill="#0EA5E9" />
                  <path d="M 28 10 C 36 8 44 12 46 16 C 42 16 36 14 28 10 Z" fill="#DC2626" />
                </svg>

                <div>
                  <div className="text-base font-black tracking-tight text-slate-900 leading-none">
                    GARUDA
                  </div>
                  <div className="text-base font-black tracking-tight text-slate-900 leading-none mt-0.5">
                    SPARK
                  </div>
                </div>

                <div className="ml-1 pl-2 border-l border-slate-300 leading-tight">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight block">
                    INNOVATION
                  </span>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight block">
                    HUB
                  </span>
                </div>
              </div>

              {/* Sub-label by KOMDIGI */}
              <div className="flex items-center justify-end gap-1 mt-1 text-[9px] font-medium text-slate-500">
                <span>by</span>
                <span className="font-bold text-slate-700">KOMDIGI</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

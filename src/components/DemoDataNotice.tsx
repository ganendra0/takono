import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DemoDataNotice: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 bg-blue-50/80 border border-blue-200/80 rounded-lg text-xs text-blue-900 ${className}`}>
      <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
      <div className="leading-snug">
        <span className="font-semibold">Demo & Prototype Data:</span> Menampilkan simulasi destinasi Kebun Binatang Surabaya (KBS). Seluruh aktivitas dan metrik berasal dari sistem prototipe TAKONO.
      </div>
    </div>
  );
};

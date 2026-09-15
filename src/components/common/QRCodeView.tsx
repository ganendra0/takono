import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check } from 'lucide-react';

interface QRCodeViewProps {
  value: string;
  title?: string;
  subtitle?: string;
  size?: number;
  showActions?: boolean;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  value,
  title,
  subtitle,
  size = 200,
  showActions = true,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 2,
      color: {
        dark: '#1e293b',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (mounted) setDataUrl(url);
      })
      .catch((err) => {
        console.error('Error generating QR', err);
      });

    return () => {
      mounted = false;
    };
  }, [value, size]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `TAKONO-QR-${title ? title.replace(/\s+/g, '-').toLowerCase() : 'code'}.png`;
    a.click();
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
      {title && <h4 className="font-semibold text-slate-800 text-sm mb-1">{title}</h4>}
      {subtitle && <p className="text-xs text-slate-500 mb-3 max-w-[220px]">{subtitle}</p>}
      <div className="relative p-2 bg-white rounded-lg border border-slate-100 shadow-inner">
        {dataUrl ? (
          <img
            src={dataUrl}
            alt={value}
            style={{ width: size, height: size }}
            className="rounded"
          />
        ) : (
          <div
            style={{ width: size, height: size }}
            className="flex items-center justify-center bg-slate-50 text-xs text-slate-400 animate-pulse"
          >
            Menghasilkan QR...
          </div>
        )}
      </div>
      <span className="font-mono text-[11px] text-slate-400 mt-2 select-all bg-slate-50 px-2 py-0.5 rounded">
        {value}
      </span>

      {showActions && (
        <div className="flex items-center gap-2 mt-3">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="Salin Kode QR"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
            title="Unduh Gambar QR"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh</span>
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import QRCodeEncoder from 'qrcode';

const QR_SIZE = 768;
const LOGO_TILE = 150;

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

/** A print-ready QR image. The high correction level leaves room for the TAKONO mark. */
async function createBrandedQR(value: string) {
  const raw = await QRCodeEncoder.toDataURL(value, {
    width: QR_SIZE,
    margin: 3,
    errorCorrectionLevel: 'H',
  });
  const [qr, logo] = await Promise.all([loadImage(raw), loadImage('/brand/takono.png')]);
  const canvas = document.createElement('canvas');
  canvas.width = QR_SIZE;
  canvas.height = QR_SIZE;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Browser tidak mendukung pembuatan QR.');

  context.drawImage(qr, 0, 0, QR_SIZE, QR_SIZE);
  const x = (QR_SIZE - LOGO_TILE) / 2;
  const y = (QR_SIZE - LOGO_TILE) / 2;
  context.fillStyle = '#ffffff';
  context.beginPath();
  context.roundRect(x, y, LOGO_TILE, LOGO_TILE, 22);
  context.fill();
  // Crop to the symbol portion of the supplied TAKONO brand asset, not its wordmark.
  context.drawImage(logo, 1010, 870, 470, 390, x + 24, y + 20, LOGO_TILE - 48, LOGO_TILE - 40);
  return canvas.toDataURL('image/png');
}

export function QRCode({ value, label }: { value: string; label: string }) {
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let mounted = true;
    setImage('');
    setError('');
    createBrandedQR(value).then(url => { if (mounted) setImage(url); }).catch(() => {
      if (mounted) setError('Gagal membuat QR. Coba muat ulang halaman.');
    });
    return () => { mounted = false; };
  }, [value]);
  return <div className="space-y-3">
    {image ? <>
      <img src={image} width={256} height={256} alt={`QR ${label}`} className="rounded-lg border border-slate-200 bg-white" />
      <a className="inline-flex text-sm font-medium text-blue-700 hover:underline" href={image} download="takono-qr.png">Unduh QR</a>
    </> : <p className="text-sm text-slate-500">{error || 'Menyiapkan QR…'}</p>}
  </div>;
}

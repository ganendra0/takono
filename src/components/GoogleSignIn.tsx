import React, { useEffect, useRef, useState } from 'react';
import { LogIn } from 'lucide-react';
import { ApiClient } from '../lib/api';

type GoogleIdentity = { initialize: (options: Record<string, unknown>) => void; renderButton: (element: HTMLElement, options: Record<string, unknown>) => void };
let scriptReady: Promise<void> | undefined;
function loadGoogle() {
  if (!scriptReady) scriptReady = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => { script.remove(); scriptReady = undefined; reject(new Error('Google tidak dapat dimuat. Gunakan email atau coba lagi nanti.')); };
    document.head.appendChild(script);
  });
  return scriptReady;
}

export function GoogleSignIn({ onCredential, disabled = false }: { onCredential: (credential: string, nonce: string) => Promise<void>; disabled?: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const callback = useRef(onCredential);
  callback.current = onCredential;
  const [state, setState] = useState('loading');
  const [message, setMessage] = useState('');
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const response = await ApiClient.request<{ enabled: boolean; clientId?: string; nonce?: string }>('/auth/google/config');
        if (!live) return;
        if (!response.success) throw new Error('Google belum dapat dihubungi. Kamu tetap bisa masuk dengan email.');
        if (!response.data?.enabled) { setState('unavailable'); return; }
        await loadGoogle();
        if (!live || !container.current) return;
        const identity = (window as unknown as { google: { accounts: { id: GoogleIdentity } } }).google.accounts.id;
        identity.initialize({ client_id: response.data.clientId, nonce: response.data.nonce, auto_select: false, callback: (result: { credential: string }) => { if (live) void callback.current(result.credential, response.data!.nonce!); } });
        identity.renderButton(container.current, { theme: 'outline', size: 'large', text: 'continue_with', shape: 'rectangular', width: Math.min(400, container.current.clientWidth), locale: 'id' });
        setState('ready');
      } catch (error) { if (live) { setState('error'); setMessage(error instanceof Error ? error.message : 'Google tidak tersedia.'); } }
    })();
    return () => { live = false; };
  }, []);
  return <div>
    <div ref={container} aria-label="Masuk dengan Google" className={disabled ? 'pointer-events-none opacity-50' : ''} inert={disabled} />
    {state !== 'ready' && <button type="button" disabled className="flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-400"><LogIn size={18} />{state === 'loading' ? 'Menyiapkan Google…' : 'Lanjutkan dengan Google'}</button>}
    {state === 'unavailable' && <p className="mt-2 text-center text-xs text-slate-500">Login Google belum tersedia. Gunakan email untuk melanjutkan.</p>}
    {message && <p role="status" className="mt-2 text-xs text-slate-500">{message}</p>}
  </div>;
}

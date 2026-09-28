import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, Square } from 'lucide-react';

export const TextToSpeechControls: React.FC<{ text: string }> = ({ text }) => {
  const [speechStatus, setSpeechStatus] = useState<'stopped' | 'started' | 'paused'>('stopped');
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => () => {
    if (utterance.current && supported) window.speechSynthesis.cancel();
  }, [supported]);

  const start = () => {
    if (!supported) return;
    if (speechStatus === 'paused') {
      window.speechSynthesis.resume();
      setSpeechStatus('started');
      return;
    }
    window.speechSynthesis.cancel();
    const next = new SpeechSynthesisUtterance(text);
    next.lang = 'id-ID';
    next.rate = 0.95;
    next.onend = () => setSpeechStatus('stopped');
    next.onerror = () => setSpeechStatus('stopped');
    utterance.current = next;
    window.speechSynthesis.speak(next);
    setSpeechStatus('started');
  };
  const pause = () => { if (supported) { window.speechSynthesis.pause(); setSpeechStatus('paused'); } };
  const stop = () => { if (supported) window.speechSynthesis.cancel(); utterance.current = null; setSpeechStatus('stopped'); };

  if (!text.trim()) return null;

  return (
    <div className="flex shrink-0 items-center gap-1" aria-label="Kontrol text to speech">
      {speechStatus === 'started' ? (
        <button type="button" onClick={pause} disabled={!supported} className="secondary-button py-1.5 px-2 text-xs" aria-label="Jeda narasi">
          <Pause className="w-3.5 h-3.5" /> Jeda
        </button>
      ) : (
        <button type="button" onClick={start} disabled={!supported} className="secondary-button py-1.5 px-2 text-xs" aria-label={speechStatus === 'paused' ? 'Lanjutkan narasi' : 'Dengarkan narasi'}>
          <Play className="w-3.5 h-3.5" /> {speechStatus === 'paused' ? 'Lanjutkan' : 'Dengarkan'}
        </button>
      )}
      {speechStatus !== 'stopped' && (
        <button type="button" onClick={stop} disabled={!supported} className="secondary-button py-1.5 px-2 text-xs" aria-label="Hentikan narasi">
          <Square className="w-3.5 h-3.5" /> Berhenti
        </button>
      )}
      {!supported && <span className="text-[11px] text-slate-500">Browser tidak mendukung audio narasi.</span>}
    </div>
  );
};

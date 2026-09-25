import React,{useEffect,useRef,useState} from 'react';
import {Camera,ImagePlus,QrCode,X} from 'lucide-react';
import {ApiClient} from '../lib/api';
import {parseTakonoQR} from '../lib/qr';
import {ExplorePoint} from '../types';
import {useAuth} from '../context/AuthContext';

export function ScanModal({isOpen,onClose,onNavigate}:{isOpen:boolean;onClose:()=>void;onNavigate:(p:string)=>void;preselectedPoint?:ExplorePoint|null}) {
 const {user,refreshUserData}=useAuth();
 const [code,setCode]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[camera,setCamera]=useState(false);
 const video=useRef<HTMLVideoElement>(null),stream=useRef<MediaStream|null>(null),timer=useRef<number|undefined>(undefined),locked=useRef(false),generation=useRef(0);
 const stop=()=>{generation.current++;stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;window.clearTimeout(timer.current);setCamera(false);};
 useEffect(()=>{if(!isOpen){stop();setMessage('');setCode('');}return()=>{generation.current++;stream.current?.getTracks().forEach(t=>t.stop());window.clearTimeout(timer.current);};},[isOpen]);
 useEffect(()=>{if(!isOpen)return;const previous=document.activeElement as HTMLElement;const overflow=document.body.style.overflow;document.body.style.overflow='hidden';const key=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose();};window.addEventListener('keydown',key);return()=>{document.body.style.overflow=overflow;window.removeEventListener('keydown',key);previous?.focus();};},[isOpen,onClose]);
 async function open(raw:string){
  if(locked.current)return;locked.current=true;setBusy(true);setMessage('');stop();
  try{
   const parsed=parseTakonoQR(raw);setCode(parsed.code);
   if(parsed.kind==='event'){
    if(!user){onClose();onNavigate('/app/scan/event/'+encodeURIComponent(parsed.code));return;}
    const result=await ApiClient.scanEventToken(parsed.code);if(!result.success||!result.data)throw new Error(result.message||'QR Event tidak valid.');
    await refreshUserData();onClose();onNavigate('/app/events');return;
   }
   if(parsed.kind!=='point'){
    const welcome=await ApiClient.scanDestinationQR(parsed.code);
    if(welcome.success&&welcome.data){ApiClient.selectDestination(welcome.data.destination.id);onClose();onNavigate('/scan/'+encodeURIComponent(welcome.data.destination.code));return;}
    if(parsed.kind==='destination')throw new Error(welcome.message||'Destinasi tidak ditemukan.');
   }
   if(!user){onClose();onNavigate('/app/scan/'+encodeURIComponent(parsed.code));return;}
   const result=await ApiClient.scanExplorePointToken(parsed.code);
   if(!result.success||!result.data)throw new Error(result.message||'Kode tidak valid.');
   ApiClient.selectDestination(result.data.destination.id);await refreshUserData();onClose();onNavigate('/app/explore/'+result.data.explorePoint.slug);
  }catch(e){setMessage(e instanceof Error?e.message:'Tidak dapat membaca QR.');}finally{locked.current=false;setBusy(false);}
 }
 async function decode(source:CanvasImageSource,width:number,height:number){
  const canvas=document.createElement('canvas'),scale=Math.min(1,1200/Math.max(width,height));canvas.width=Math.round(width*scale);canvas.height=Math.round(height*scale);
  const context=canvas.getContext('2d',{willReadFrequently:true})!;context.drawImage(source,0,0,canvas.width,canvas.height);
  const pixels=context.getImageData(0,0,canvas.width,canvas.height);const {default:jsQR}=await import('jsqr');return jsQR(pixels.data,pixels.width,pixels.height)?.data;
 }
 async function start(){
  setMessage('');
  if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia){setMessage('Kamera langsung membutuhkan HTTPS. Pada alamat HTTP ini, pilih foto QR atau masukkan kode di bawah.');return;}
  stop();const version=generation.current;
  try{const media=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});if(version!==generation.current){media.getTracks().forEach(t=>t.stop());return;}stream.current=media;setCamera(true);
   const tick=async()=>{if(version!==generation.current)return;try{if(video.current){if(video.current.srcObject!==media){video.current.srcObject=media;await video.current.play();}if(video.current.readyState>=2){const result=await decode(video.current,video.current.videoWidth,video.current.videoHeight);if(version!==generation.current)return;if(result){void open(result);return;}}}timer.current=window.setTimeout(tick,200);}catch{stop();setMessage('Kamera tidak dapat dibaca. Gunakan foto QR.');}};void tick();
  }catch{setMessage('Kamera tidak tersedia atau izinnya ditolak. Gunakan foto QR atau masukkan kode.');}
 }
 if(!isOpen)return null;
 return <div className="fixed inset-0 z-[1000] bg-slate-950/60 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center" onClick={e=>{if(e.target===e.currentTarget)onClose();}}><section role="dialog" aria-modal="true" aria-label="Scan QR TAKONO" className="bg-white rounded-3xl p-5 sm:p-7 max-w-md w-full max-h-[90dvh] overflow-y-auto space-y-5 shadow-2xl">
 <div className="flex justify-between items-center"><div><p className="text-xs text-blue-600 font-semibold mb-1">MULAI JELAJAH</p><h2 className="text-xl font-bold text-slate-900">Scan QR TAKONO</h2></div><button autoFocus className="p-3 rounded-full bg-slate-100" aria-label="Tutup" onClick={onClose}><X size={18}/></button></div>
 <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5 text-center">{camera?<video ref={video} muted playsInline className="w-full rounded-xl aspect-square object-cover"/>:<><QrCode className="mx-auto text-blue-600 mb-3" size={56}/><p className="text-sm text-slate-600">Pindai QR destinasi atau Explore Point untuk membuka informasi dan mulai menjelajah.</p></>}</div>
 <div className="grid grid-cols-2 gap-3"><button disabled={busy} onClick={camera?stop:start} className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50"><Camera size={18}/>{camera?'Tutup kamera':'Kamera'}</button><label className={`flex items-center justify-center gap-2 p-3 border border-slate-200 rounded-xl text-sm font-semibold cursor-pointer ${busy?'opacity-50':''}`}><ImagePlus size={18}/>Foto QR<input type="file" accept="image/*" disabled={busy} className="sr-only" onChange={async e=>{const file=e.target.files?.[0];e.target.value='';if(!file)return;stop();setMessage('');setBusy(true);const url=URL.createObjectURL(file);try{const img=new Image();img.src=url;await img.decode();const result=await decode(img,img.naturalWidth,img.naturalHeight);if(!result)throw new Error('QR belum terbaca. Pilih foto yang jelas dan tidak terpotong.');await open(result);}catch(err){setMessage(err instanceof Error?err.message:'Foto tidak dapat dibaca.');}finally{URL.revokeObjectURL(url);setBusy(false);}}}/></label></div>
 <form className="space-y-3" onSubmit={e=>{e.preventDefault();void open(code);}}><label className="block text-sm font-medium text-slate-700">Atau masukkan kode / link QR<input required value={code} onChange={e=>setCode(e.target.value)} placeholder="Tempel link atau kode TAKONO" className="mt-2 block w-full p-3 border border-slate-200 rounded-xl text-base"/></label>{message&&<p role="alert" className="rounded-xl bg-amber-50 p-3 text-amber-900 text-sm">{message}</p>}<button disabled={busy} className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold disabled:opacity-50">{busy?'Memeriksa…':'Buka QR'}</button></form></section></div>;
}

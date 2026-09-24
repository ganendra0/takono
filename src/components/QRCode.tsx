import React,{useEffect,useState} from 'react';
import QRCodeEncoder from 'qrcode';
export function QRCode({value,label}:{value:string;label:string}) {
 const [image,setImage]=useState('');const [error,setError]=useState('');
 useEffect(()=>{let mounted=true;QRCodeEncoder.toDataURL(value,{width:256,margin:2,errorCorrectionLevel:'M'}).then(url=>{if(mounted)setImage(url);}).catch(()=>setError('Gagal membuat QR.'));return()=>{mounted=false;};},[value]);
 return <div className="space-y-2">{image?<><img src={image} width={192} height={192} alt={'QR '+label}/><a className="text-blue-700" href={image} download={'takono-qr.png'}>Unduh QR</a></>:<p>{error||'Menyiapkan QR…'}</p>}</div>;
}

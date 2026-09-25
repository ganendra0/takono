import React,{useEffect,useState} from 'react';
import {ApiClient} from '../../lib/api';
import {useAuth} from '../../context/AuthContext';
export function ScanPointPage({token,onNavigate,mode='point'}:{token:string;onNavigate:(p:string)=>void;mode?:'point'|'event'}) {
 const {refreshUserData}=useAuth();const [error,setError]=useState('');
 useEffect(()=>{let active=true;(mode==='event'?ApiClient.scanEventToken(token):ApiClient.scanExplorePointToken(token)).then(async (r:any)=>{if(!active)return;if(r.success&&r.data){if(mode==='event'){await refreshUserData();onNavigate('/app/events');}else{ApiClient.selectDestination(r.data.destination.id);await refreshUserData();onNavigate('/app/explore/'+r.data.explorePoint.slug);}}else setError(r.message||'QR tidak valid.');});return()=>{active=false;};},[token,mode]);
 return <div className="p-8 text-center">{error||'Memvalidasi QR…'}{error&&<button className="block mx-auto mt-4 text-blue-600" onClick={()=>onNavigate('/app/smart-guide')}>Kembali ke Smart Guide</button>}</div>;
}

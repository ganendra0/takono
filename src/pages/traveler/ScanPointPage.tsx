import React,{useEffect,useState} from 'react';
import {ApiClient} from '../../lib/api';
import {useAuth} from '../../context/AuthContext';
export function ScanPointPage({token,onNavigate}:{token:string;onNavigate:(p:string)=>void}) {
 const {refreshUserData}=useAuth();const [error,setError]=useState('');
 useEffect(()=>{let active=true;ApiClient.scanExplorePointToken(token).then(async r=>{if(!active)return;if(r.success&&r.data){ApiClient.selectDestination(r.data.destination.id);await refreshUserData();onNavigate('/app/explore/'+r.data.explorePoint.slug);}else setError(r.message||'QR tidak valid.');});return()=>{active=false;};},[token]);
 return <div className="p-8 text-center">{error||'Memvalidasi QR…'}{error&&<button className="block mx-auto mt-4 text-blue-600" onClick={()=>onNavigate('/app/smart-guide')}>Kembali ke Smart Guide</button>}</div>;
}

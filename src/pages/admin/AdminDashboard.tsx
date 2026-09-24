import React,{useEffect,useState} from 'react';
import {ApiClient} from '../../lib/api';
import {ContentEditor} from '../../components/ContentEditor';
export function AdminDashboard({onNavigate}:{onNavigate:(path:string)=>void}) {
 const [data,setData]=useState<any>(null);const [error,setError]=useState('');const [editor,setEditor]=useState<any>(undefined);const [kind,setKind]=useState('users');
 const load=async()=>{const r=await ApiClient.request<any>('/admin/dashboard');if(r.success)setData(r.data);else setError(r.message||'Gagal memuat.');};
 useEffect(()=>{load();},[]);
 return <main className="min-h-screen bg-slate-100 py-8"><div className="max-w-7xl mx-auto px-4 space-y-6">
 <header className="bg-white border rounded-3xl p-6"><h1 className="text-xl font-extrabold">Super Admin Console</h1><p className="text-sm text-slate-500">Pengguna, penugasan destinasi, dan audit aktivitas sistem.</p></header>
 {error&&<p role="alert" className="text-rose-700">{error}</p>}{!data?<p>Memuat data…</p>:<>
 <div className="bg-white border rounded-2xl p-5 text-sm"><p>{data.users.length} akun · {data.destinations.length} destinasi · {data.activityCount} aktivitas TAKONO</p><p className="mt-2">Peran: {data.roles.join(', ')}</p></div>
 <section className="bg-white border rounded-3xl p-6"><div className="flex justify-between gap-3"><h2 className="font-bold">Pengguna & Penugasan</h2><button className="text-blue-700" onClick={()=>{setKind('users');setEditor({role:'traveler',active:true});}}>+ Pengguna</button></div>
 <div className="overflow-x-auto"><table className="w-full text-sm text-left mt-4"><thead><tr>{['Nama','Email','Peran','Destinasi','Status','Aksi'].map(x=><th className="p-3" key={x}>{x}</th>)}</tr></thead><tbody>{data.users.map((u:any)=><tr key={u.id} className="border-t"><td className="p-3">{u.name}</td><td className="p-3">{u.email}</td><td className="p-3">{u.role}</td><td className="p-3">{data.destinations.find((d:any)=>d.id===u.destinationId)?.name||'—'}</td><td className="p-3">{u.active?'Aktif':'Nonaktif'}</td><td><button className="text-blue-700 p-3" onClick={()=>{setKind('users');setEditor(u);}}>Edit</button></td></tr>)}</tbody></table></div></section>
 <section className="bg-white border rounded-3xl p-6 space-y-3"><div className="flex justify-between"><h2 className="font-bold">Destinasi</h2><button className="text-blue-700" onClick={()=>{setKind('destination');setEditor({status:'draft'});}}>+ Destinasi</button></div>{data.destinations.map((d:any)=><p key={d.id} className="text-sm">{d.id} — {d.name} ({d.status})</p>)}<button className="text-blue-700" onClick={()=>onNavigate('/manager')}>Kelola konten destinasi</button></section>
 <section className="bg-white border rounded-3xl p-6 space-y-3"><h2 className="font-bold">Audit log (200 terbaru)</h2>{!data.auditLogs.length&&<p>Belum ada data</p>}{data.auditLogs.map((a:any)=><p key={a.id} className="text-xs border-t py-2">{a.createdAt} · Akun {a.userId} · {a.action} · {a.resource} #{a.resourceId}</p>)}</section>
 </>}
 {editor!==undefined&&<ContentEditor kind={kind} record={editor} onClose={()=>setEditor(undefined)} onSave={async payload=>{const path=kind==='destination'?'/admin/destinations':'/admin/users'+(editor.id?'/'+editor.id:'');const r=await ApiClient.request(path,{method:editor.id?'PUT':'POST',body:JSON.stringify(payload)});if(r.success){setEditor(undefined);await load();}return r;}}/>}
 </div></main>;
}

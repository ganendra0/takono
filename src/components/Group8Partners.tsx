import React from 'react';
const partners=[['Innovation Competition','0 0 285 183'],['Jagoan Hosting','295 0 315 183'],['Ngalup.co','610 0 465 183'],['Komdigi','1075 0 200 183'],['Garuda Spark','1270 0 298 183']];
export function Group8Partners({className=''}:{variant?:'banner'|'grid'|'compact';theme?:'dark'|'light';className?:string}) {
 return <section className={className} aria-label="Partner TAKONO"><p className="mb-4 text-[11px] text-slate-500">Kompetisi & ekosistem pendukung</p><div className="flex flex-wrap items-center gap-x-6 gap-y-4">{partners.map(([name,box])=><svg key={name} viewBox={box} role="img" aria-label={name} style={{width:Math.round(Number(box.split(' ')[2])/183*34),height:34}} className="shrink-0"><image href="/brand/partners.png" width="1568" height="183"/></svg>)}</div></section>;
}

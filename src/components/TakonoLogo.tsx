import React from 'react';

export function TakonoLogo({variant='full',size='md',className=''}:{variant?:'full'|'icon'|'wordmark';theme?:'light'|'dark'|'auto';size?:'sm'|'md'|'lg'|'xl';className?:string}) {
 const height={sm:28,md:34,lg:42,xl:54}[size];
 const icon=variant==='icon';
 return <svg role="img" aria-label="TAKONO" viewBox={icon?'1010 870 470 390':'1010 870 1990 390'} style={{height,width:icon?height*1.2:height*5.1}} className={`shrink-0 max-w-full ${className}`}><image href="/brand/takono.png" width="4080" height="2295"/></svg>;
}

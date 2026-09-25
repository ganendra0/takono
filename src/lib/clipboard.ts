export async function copyText(value:string):Promise<boolean> {
 try { if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);return true;} }catch{}
 const input=document.createElement('textarea');input.value=value;input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();
 try{return document.execCommand('copy');}catch{return false;}finally{input.remove();}
}

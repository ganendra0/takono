export function parseTakonoQR(raw:string):{kind:'destination'|'point'|'event'|'unknown';code:string} {
 const value=raw.trim();
 const point=value.match(/(?:#\/app\/scan\/|\/api\/scan\/explore\/)([^/?#]+)/);
 const event=value.match(/(?:#\/app\/scan\/event\/|\/api\/scan\/event\/)([^/?#]+)/);
 const destination=value.match(/#\/scan\/([^/?#]+)/);
 if(event||point||destination) return {kind:event?'event':point?'point':'destination',code:decodeURIComponent((event||point||destination)![1])};
 if(!/^[a-zA-Z0-9_-]{1,160}$/.test(value))throw new Error('QR tidak berisi kode TAKONO yang valid.');
 return {kind:'unknown',code:value};
}

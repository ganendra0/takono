export function parseTakonoQR(raw:string):{kind:'destination'|'point'|'unknown';code:string} {
 const value=raw.trim();
 const point=value.match(/(?:#\/app\/scan\/|\/api\/scan\/explore\/)([^/?#]+)/);
 const destination=value.match(/#\/scan\/([^/?#]+)/);
 if(point||destination) return {kind:point?'point':'destination',code:decodeURIComponent((point||destination)![1])};
 if(!/^[a-zA-Z0-9_-]{1,160}$/.test(value))throw new Error('QR tidak berisi kode TAKONO yang valid.');
 return {kind:'unknown',code:value};
}

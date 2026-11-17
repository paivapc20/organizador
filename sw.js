/* Service worker del Organizador. Sube el número de VERSION cada vez que publiques cambios. */
const VERSION="v2";
const CACHE="organizador-"+VERSION;
const ASSETS=["./","index.html","manifest.webmanifest","xlsx.full.min.js","icon-192.png","icon-512.png","icon-maskable-512.png","logo.svg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("message",e=>{if(e.data==="SKIP"||e.data==="skip")self.skipWaiting()});
self.addEventListener("fetch",e=>{
  const req=e.request;
  if(req.method!=="GET")return;
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>hit||fetch(req).then(res=>{
    if(res&&res.ok&&new URL(req.url).origin===location.origin){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy))}
    return res;
  }).catch(()=>req.mode==="navigate"?caches.match("./"):undefined)));
});

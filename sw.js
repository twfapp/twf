/* TWF service worker: altijd eerst het netwerk (nieuwste versie), offline terugvallen op cache */
const C='twf-v2';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{ const r=e.request; if(r.method!=='GET'||new URL(r.url).origin!==location.origin) return;
  const nav=r.mode==='navigate'||/\.html?($|\?)|\/($|\?)/.test(new URL(r.url).pathname+new URL(r.url).search);
  e.respondWith((nav?fetch(r.url,{cache:'no-store',credentials:'same-origin'}):fetch(r)).then(res=>{ if(res&&res.ok&&!/[?&](nocache|v)=/.test(r.url)){ const cp=res.clone(); caches.open(C).then(c=>c.put(r,cp)).catch(()=>{}) } return res }).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./')))) });

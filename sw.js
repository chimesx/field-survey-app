const VERSION='field-app-v4.3.0';
const SHELL_CACHE=VERSION+'-shell';
const RUNTIME_CACHE=VERSION+'-runtime';
const TILE_CACHE=VERSION+'-tiles';
const SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
const LIB_HOSTS=['unpkg.com','cdn.jsdelivr.net','cdnjs.cloudflare.com'];
const TILE_HOSTS=['server.arcgisonline.com'];
const NO_TILE_CACHE_HOSTS=['wmts.nlsc.gov.tw','tile.openstreetmap.org'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(SHELL_CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('field-app-')&&!k.startsWith(VERSION)).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

async function trimCache(name,maxItems){
  const cache=await caches.open(name); const keys=await cache.keys();
  while(keys.length>maxItems){await cache.delete(keys.shift());}
}
async function cacheFirst(request,cacheName,maxItems){
  const cache=await caches.open(cacheName); const hit=await cache.match(request);
  if(hit)return hit;
  const response=await fetch(request);
  if(response && (response.ok || response.type==='opaque')){
    await cache.put(request,response.clone());
    if(maxItems) trimCache(cacheName,maxItems);
  }
  return response;
}
async function staleWhileRevalidate(request){
  const cache=await caches.open(RUNTIME_CACHE); const hit=await cache.match(request);
  const network=fetch(request).then(r=>{if(r && (r.ok||r.type==='opaque'))cache.put(request,r.clone());return r}).catch(()=>null);
  return hit || await network || new Response('',{status:504,statusText:'Offline'});
}
async function navigation(request){
  try{
    const response=await fetch(request);
    const cache=await caches.open(SHELL_CACHE); cache.put('./index.html',response.clone());
    return response;
  }catch(_){
    return (await caches.match('./index.html')) || new Response('離線且尚未快取應用程式',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});
  }
}
self.addEventListener('fetch',event=>{
  const req=event.request; if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(req.mode==='navigate'){event.respondWith(navigation(req));return;}
  if(url.hostname==='maps.nlsc.gov.tw' && url.pathname.includes('/OpenData/wmts/')){
    event.respondWith((async()=>{
      const keys=(await caches.keys()).filter(k=>k.startsWith('field-offline-'));
      for(const k of keys){const hit=await (await caches.open(k)).match(req); if(hit)return hit;}
      try{return await fetch(req);}catch(_){return new Response('',{status:504,statusText:'Offline'});}
    })()); return;
  }
  if(NO_TILE_CACHE_HOSTS.includes(url.hostname)){
    // NLSC 圖磚採即時連線，不由本 App 大量永久快取。
    event.respondWith(fetch(req).catch(()=>new Response('',{status:504,statusText:'Offline'}))); return;
  }
  if(TILE_HOSTS.includes(url.hostname)){
    // Esri 僅快取使用者實際瀏覽過的圖磚，並限制數量。
    event.respondWith(cacheFirst(req,TILE_CACHE,300)); return;
  }
  if(LIB_HOSTS.includes(url.hostname)){event.respondWith(staleWhileRevalidate(req));return;}
  if(url.origin===self.location.origin){event.respondWith(cacheFirst(req,SHELL_CACHE));}
});

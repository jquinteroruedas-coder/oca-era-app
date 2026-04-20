// Service Worker - Reporte Diario La Ocanera
const CACHE = "ocanera-v21";
const ASSETS = [
  "./",
  "./Reporte_Produccion.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./logo-header.png",
  "./laocanera_logo.png"
];
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }).catch(function(){}));
  self.skipWaiting();
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }));
  self.clients.claim();
});
self.addEventListener("fetch", function(e){
  if(e.request.url.indexOf("script.google.com") >= 0 || e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function(r){
      return r || fetch(e.request).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, copy); }).catch(function(){});
        return res;
      }).catch(function(){ return caches.match("./Reporte_Produccion.html"); });
    })
  );
});

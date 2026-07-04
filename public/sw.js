// Dhyana service worker — network-first for the app (always fresh), cache-first
// for static assets, and never touch the API (so check-ins always hit the server).
const CACHE = 'dhyana-v1';
const ASSETS = ['/app.html', '/528hz.mp3', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return; // let POSTs (saving check-ins) pass straight through
  const url = new URL(req.url);

  // Never cache the API — insight/history must always be live.
  if (url.origin === location.origin && url.pathname.startsWith('/api/')) {
    e.respondWith(fetch(req));
    return;
  }

  // Network-first for the app page so updates always land when online.
  if (req.mode === 'navigate' || url.pathname.endsWith('/app.html')) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put('/app.html', copy));
        return res;
      }).catch(() => caches.match('/app.html'))
    );
    return;
  }

  // Cache-first for static assets (fonts, audio, icons).
  e.respondWith(
    caches.match(req).then(r => r || fetch(req).then(res => {
      if (res && res.status === 200 && (url.origin === location.origin || url.origin.includes('gstatic'))) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});

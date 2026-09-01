const CACHE = 'fx50fhii-v3';
const ASSETS = [
  '.', 'index.html', 'css/style.css',
  'js/font.js', 'js/display.js', 'js/engine.js', 'js/fmla.js', 'js/stat.js', 'js/program.js',
  'js/keyboard.js', 'js/main.js',
  'manifest.webmanifest', 'icon-192.png', 'icon-512.png',
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }))
  );
});

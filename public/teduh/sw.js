/* Doa Teduh — compact offline-first reader, cache revision 3.6 */
const CACHE_NAME = 'doa-teduh-v3-7-1-20261114';
const CORE = [
  './index.html','./style.css','./app.js','./data.js','./extras.js',
  './guide.js','./salat.js','./icon.svg','./manifest.webmanifest'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('doa-teduh-') && k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    // Online users see the latest prayers and interface; offline users use cache.
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      return (await caches.match(request)) ||
        (request.mode === 'navigate' ? (await caches.match('./index.html')) : undefined) ||
        Response.error();
    }
  })());
});

/* Doa Teduh — offline reading for the bundled library */
const CACHE_NAME = 'doa-teduh-reader-3';
const entry = new URL('./index.html', self.registration.scope).href;
const core = new Set([
  'index.html', 'style.css', 'app.js', 'data.js', 'extras.js', 'doa-nabi.js', 'guide.js',
  'salat.js', 'munajat99.js', 'icon.svg', 'manifest.webmanifest'
].map(path => new URL(path, self.registration.scope).href));

async function prepareOfflineLibrary() {
  const cache = await caches.open(CACHE_NAME);
  try {
    await cache.addAll([...core].map(url => new Request(url, { redirect: 'error' })));
  } catch (error) {
    await caches.delete(CACHE_NAME);
    throw error;
  }
  await self.skipWaiting();
}

self.addEventListener('install', event => event.waitUntil(prepareOfflineLibrary()));
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('doa-teduh-') && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  url.search = '';
  const useReaderEntry = request.mode === 'navigate' && url.href === self.registration.scope;
  const key = useReaderEntry ? entry : url.href;
  if (!core.has(key)) return;
  // Let the host respond to any online sign-in requirement or access change.
  // Use the installed copy only when there is no network response.
  event.respondWith(fetch(request).catch(async () => {
    const cache = await caches.open(CACHE_NAME);
    return (await cache.match(key)) || Response.error();
  }));
});

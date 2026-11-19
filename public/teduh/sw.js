/* Doa Teduh — keep the reader ready and download the full library on request. */
const CACHE_NAME = 'doa-teduh-reader-5';
const entry = new URL('./index.html', self.registration.scope).href;
const resourceUrl = path => new URL(path, self.registration.scope).href;
const shell = [
  'index.html', 'style.css', 'app.js', 'manuscript-index.js', 'extras.js', 'doa-nabi.js',
  'doa-quran.js', 'guide.js', 'salat.js', 'icon.svg', 'manifest.webmanifest',
].map(resourceUrl);
const library = [
  'munajat99.js', 'masjid-fajar.webp', 'masjid-fajar-mobile.webp', 'noto-naskh-arabic.woff2',
  ...Array.from({ length: 13 }, (_, index) => 'pustaka/fase-' + (index + 1) + '.json'),
].map(resourceUrl);
const resources = new Set([...shell, ...library]);
const cachedRequest = url => new Request(url, { redirect: 'error' });

async function installReader() {
  const cache = await caches.open(CACHE_NAME);
  try {
    await cache.addAll(shell.map(cachedRequest));
  } catch (error) {
    await caches.delete(CACHE_NAME);
    throw error;
  }
  await self.skipWaiting();
}

self.addEventListener('install', event => event.waitUntil(installReader()));
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('doa-teduh-') && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  const port = event.ports[0];
  if (event.data?.type !== 'cache-library' || !port) return;
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      const entries = await Promise.all(library.map(async url => await cache.match(url) ? null : cachedRequest(url)));
      await cache.addAll(entries.filter(Boolean));
      port.postMessage({ ok: true });
    } catch {
      port.postMessage({ ok: false });
    }
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  url.search = '';
  const useReaderEntry = request.mode === 'navigate' && url.href === self.registration.scope;
  const key = useReaderEntry ? entry : url.href;
  if (!resources.has(key)) return;
  // Let the host respond to any online sign-in requirement or access change.
  const network = fetch(request);
  event.waitUntil(network.then(async response => {
    if (!response.ok || response.redirected) return;
    const copy = response.clone();
    const cache = await caches.open(CACHE_NAME);
    await cache.put(key, copy);
  }).catch(() => {}));
  event.respondWith(network.catch(async () => {
    const cache = await caches.open(CACHE_NAME);
    return (await cache.match(key)) || Response.error();
  }));
});

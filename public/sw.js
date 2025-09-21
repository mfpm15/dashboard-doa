// Dashboard Doa Service Worker - Enhanced Version
const CACHE_NAME = 'dashboard-doa-v2';
const STATIC_CACHE = 'dashboard-doa-static-v2';
const DYNAMIC_CACHE = 'dashboard-doa-dynamic-v2';
const AUDIO_CACHE = 'dashboard-doa-audio-v2';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/offline',
  '/_next/static/css/',
  '/_next/static/chunks/',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Network-first URLs (always try network first)
const NETWORK_FIRST = [
  '/api/',
];

// Cache-first URLs (for static assets)
const CACHE_FIRST = [
  '/_next/static/',
  '/icons/',
  '/images/',
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .catch((error) => {
        console.error('Failed to cache static files:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME &&
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== AUDIO_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Skip external requests (different origin)
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle different request types
  if (isNetworkFirst(url.pathname)) {
    event.respondWith(networkFirst(request));
  } else if (isCacheFirst(url.pathname)) {
    event.respondWith(cacheFirst(request));
  } else if (isAudioRequest(request)) {
    event.respondWith(handleAudioRequest(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Check if URL should use network-first strategy
function isNetworkFirst(pathname) {
  return NETWORK_FIRST.some(pattern => pathname.startsWith(pattern));
}

// Check if URL should use cache-first strategy
function isCacheFirst(pathname) {
  return CACHE_FIRST.some(pattern => pathname.includes(pattern));
}

// Check if request is for audio content
function isAudioRequest(request) {
  const contentType = request.headers.get('accept') || '';
  return contentType.includes('audio/') ||
         request.url.includes('.mp3') ||
         request.url.includes('.wav') ||
         request.url.includes('.ogg') ||
         request.url.includes('.opus');
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', request.url);

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/offline');
    }

    throw error;
  }
}

// Cache-first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('Cache-first failed:', error);
    throw error;
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  // Fetch from network in background
  const networkResponsePromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((error) => {
      console.log('Network request failed:', error);
      return null;
    });

  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }

  // Otherwise wait for network
  const networkResponse = await networkResponsePromise;
  if (networkResponse) {
    return networkResponse;
  }

  // Fallback for navigation requests
  if (request.destination === 'document') {
    return caches.match('/offline');
  }

  throw new Error('No cached response and network failed');
}

// Handle audio requests with special caching
async function handleAudioRequest(request) {
  const cache = await caches.open(AUDIO_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    console.log('Serving audio from cache:', request.url);
    return cachedResponse;
  }

  try {
    console.log('Fetching audio from network:', request.url);
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache audio files for offline use
      cache.put(request, networkResponse.clone());
      console.log('Audio cached:', request.url);
    }

    return networkResponse;
  } catch (error) {
    console.error('Audio request failed:', error);
    throw error;
  }
}

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);

  if (event.tag === 'prayer-data-sync') {
    event.waitUntil(
      // Sync any pending prayer data changes
      syncPrayerData()
    );
  }
});

// Handle push notifications (future feature)
self.addEventListener('push', (event) => {
  console.log('Push notification received');

  const options = {
    body: event.data ? event.data.text() : 'Waktunya membaca doa',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Buka Dashboard'
      },
      {
        action: 'dismiss',
        title: 'Tutup'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Dashboard Doa', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Sync prayer data function
async function syncPrayerData() {
  try {
    console.log('Syncing prayer data...');
    // Implementation would sync any offline changes
    // with server or cloud storage when connection is restored
    return true;
  } catch (error) {
    console.error('Failed to sync prayer data:', error);
    return false;
  }
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Dashboard Doa Service Worker loaded successfully');
/* Importing a user's original offline file takes place entirely in their browser. */
/* Remove a previous root-scoped Dashboard Doa service worker that may serve stale Next.js HTML. */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      const activeUrl = registration.active?.scriptURL || '';
      // Only remove a legacy Dashboard Doa registration. Never remove this
      // application's own versioned worker on every visit.
      if (new URL(registration.scope).pathname === '/' &&
          !activeUrl.includes('td=static-v36')) registration.unregister();
    }
  }).catch(() => {});
}
if ('caches' in window) {
  caches.keys().then(keys => Promise.all(
    keys.filter(name => name.startsWith('dashboard-doa-')).map(name => caches.delete(name))
  )).catch(() => {});
}

(() => {
  try {
    const json = localStorage.getItem('doa-teduh-local-v34');
    if (!json) return;
    const parsed = JSON.parse(json);
    if (parsed.data && Array.isArray(parsed.data.chapters) && parsed.data.chapters.length === 13) {
      window.DOA_DATA = parsed.data;
      if (parsed.extras && Array.isArray(parsed.extras.items)) window.DOA_EXTRAS = parsed.extras;
    }
  } catch (error) {
    console.warn('Local prayer library could not be loaded; using public dataset.',error);
  }
})();

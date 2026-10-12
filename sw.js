/* Faith Intelligence School Classroom: service worker
   - Works from any GitHub Pages path (all URLs are relative to this file's scope).
   - The app and all notes live in index.html, so index.html is fetched "network first":
     whenever the phone is online it gets the newest version; when offline (or the network is
     slow) it opens the saved copy instantly.
   - Icons and the manifest use "stale while revalidate": shown from cache, refreshed in the background.
   - Change VERSION only if you add/rename files in CORE below; changing index.html alone
     needs no change here. */
const VERSION = 'v2';
const CACHE = 'deltaclassroom-' + VERSION;
const SCOPE = self.registration.scope;
const INDEX = new URL('index.html', SCOPE).href;
const CORE = [
  'index.html',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  'apple-touch-icon.png'
];
const NETWORK_TIMEOUT = 4000; /* ms to wait for the network before showing the saved copy */

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE.map(u => new Request(new URL(u, SCOPE).href, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(k => k.startsWith('deltaclassroom-') && k !== CACHE)
        .map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Page and app code: newest version when online, saved copy when offline or slow. */
function pageResponse(event) {
  const req = event.request;
  const network = fetch(req)
    .then(res => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(INDEX, copy));
      }
      return res;
    });
  const cachedLookup = caches.match(INDEX);
  event.waitUntil(network.catch(() => {}));
  return cachedLookup.then(cached => {
    if (!cached) return network;
    const timeout = new Promise(resolve => setTimeout(() => resolve(cached), NETWORK_TIMEOUT));
    return Promise.race([network.catch(() => cached), timeout]);
  });
}

/* Icons, manifest and other files: serve from cache, refresh in the background. */
function staticResponse(event) {
  const req = event.request;
  return caches.open(CACHE).then(cache =>
    cache.match(req).then(cached => {
      const refresh = fetch(req).then(res => {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      });
      refresh.catch(() => {});
      return cached || refresh;
    })
  );
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (!url.href.startsWith(SCOPE)) return;
  const isPage = req.mode === 'navigate' || url.href === INDEX || url.href === SCOPE;
  event.respondWith(isPage ? pageResponse(event) : staticResponse(event));
});

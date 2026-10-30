/* ─── Caisse Salle — Service Worker ───────────────────────────
   Stratégie : Network-first pour les requêtes API Supabase,
               Cache-first pour les assets statiques.
   ─────────────────────────────────────────────────────────── */

const CACHE_VERSION = 'caisse-salle-v2';
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon.svg',
];

/* ── Install : précache les assets shell ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

/* ── Activate : supprime les vieux caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── Fetch ── */
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  /* Ignorer les requêtes Supabase (toujours network) */
  if (url.hostname.includes('supabase.co')) return;

  /* Assets statiques Vite (contiennent un hash) → cache-first */
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then(c => c.put(request, copy));
          }
          return response;
        });
      })
    );
    return;
  }

  /* Navigation + autres ressources → network-first avec fallback */
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok && url.origin === self.location.origin) {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then(c => c.put(request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(request)
          .then(cached => cached || caches.match('/index.html'))
      )
  );
});

const CACHE = 'acopio-v1'
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return

  // Assets with hash → cache-first
  if (url.pathname.startsWith('/assets/') || url.pathname === '/index.html' || url.pathname === '/') {
    event.respondWith(
      caches.match(event.request).then((cached) =>
        cached ||
        fetch(event.request).then((res) =>
          caches.open(CACHE).then((cache) => { cache.put(event.request, res.clone()); return res })
        )
      )
    )
    return
  }

  // Everything else → network-first
  event.respondWith(
    fetch(event.request)
      .then((res) => caches.open(CACHE).then((cache) => { cache.put(event.request, res.clone()); return res }))
      .catch(() => caches.match(event.request))
  )
})

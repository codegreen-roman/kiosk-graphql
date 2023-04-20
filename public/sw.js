const CACHE_NAME = 'sales-next-v8'

const fontFiles = [
  '/themes/kihnuKiosk/fonts/BloggerSans-Light.ttf',
  '/themes/kihnuKiosk/fonts/BloggerSans-Medium.ttf',
  '/themes/kihnuKiosk/fonts/BloggerSans-Bold.woff',
  '/themes/kihnuKiosk/fonts/BloggerSans-Medium.woff',
  '/themes/kihnuKiosk/fonts/BloggerSans-Regular.woff',
  '/themes/kihnuKiosk/fonts/Roboto-Bold.ttf',
  '/themes/kihnuKiosk/fonts/Roboto-Regular.ttf',
  '/themes/kihnuKiosk/images/sea.jpg',
  '/themes/kihnuKiosk/images/top-strip.png',
  '/offline.html',
]

self.addEventListener('install', function (event) {
  // eslint-disable-next-line no-console
  console.log('installing new sw')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // eslint-disable-next-line no-console
      return cache.addAll(fontFiles).catch((err) => console.log(err))
    }),
  )

  // self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      const clearAllOldCachesPromise = cacheNames
        .filter((cache) => cache !== CACHE_NAME)
        .map((cache) => {
          return caches.delete(cache)
        })

      return Promise.all([clearAllOldCachesPromise]).then(() => {
        return self.clients.claim()
      })
    }),
  )
})

function isDocument(fetchRequest) {

  const { destination, mode, method, headers } = fetchRequest

  return (
    mode === 'navigate' ||
    (method === 'GET' &&
      destination === 'document' &&
      headers.get('accept').startsWith('text/html'))
  )
}

function isFromOfflineDocument(fetchRequest) {
  const { destination, referrer } = fetchRequest
  return destination === 'font' && referrer.endsWith('offline.html')
}

self.addEventListener('fetch', (event) => {

  const handleDocumentError = () => {
    // eslint-disable-next-line no-undef
    return caches.match('offline.html')
  }

  if (isDocument(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // eslint-disable-next-line no-console
          if (response.status === 503) {
            // eslint-disable-next-line no-undef
            return caches.match('offline.html')
          }
          return response
        })
        .catch(handleDocumentError),
    )
  } else if (isFromOfflineDocument(event.request)) {
    event.respondWith(caches.match(event.request))
  }
})


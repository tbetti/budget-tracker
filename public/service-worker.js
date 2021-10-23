const DATA_CACHE_NAME = 'data-cache-v1';
const CACHE_NAME = 'statick-cache-v2';
const FILES_TO_CACHE = [
    "/",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/index.html",
    "/index.js",
    "/styles.css"
];

// Load cache and install/register service-worker
self.addEventListener('install', (event) =>{
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache=>{
                console.log('Files cached');
                return cache.addAll(FILES_TO_CACHE);
            })
    )
})
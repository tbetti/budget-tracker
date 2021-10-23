const DATA_CACHE_NAME = 'data-cache-v1';
const CACHE_NAME = 'static-cache-v2';
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
            // go into cache, name each individually
            .then(cache=>{
                return cache.addAll(FILES_TO_CACHE);
            })
    )
    self.skipWaiting();
});

// Delete previous cache data
self.addEventListener('activate', (event) =>{
    event.waitUntil(
        caches.keys()
            .then(keyList =>{
                return Promise.all(
                    keyList.map(key =>{
                        if(key !== CACHE_NAME && key !== DATA_CACHE_NAME){
                            console.log('Removing old data: ', key);
                            return(caches.delete(key));
                        }
                    })
                )
            })
    );
    self.clients.claim();
});
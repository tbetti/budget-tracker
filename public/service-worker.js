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

// Handle API calls and store in cache
self.addEventListener('fetch', (event)=>{
    if(event.request.url.includes("/api/")){
        event.respondWith(
            caches.open(DATA_CACHE_NAME)
                .then(cache=>{
                    console.log('API request: ', event.request);
                    return fetch(event.request)
                        .then(response=>{
                            if(response.status===200){
                                cache.put(event.request.url, response.clone());
                            }
                            return response;
                        })
                        .catch(err =>{
                            console.log('fetch error: ', err);
                            return cache.match(event.request);
                        });
                })
                .catch(err =>{
                    console.log('cache error: ', err);
                })
        );
        return;
    }
    // Serve static files from cache and allow offline access
    event.respondWith(
        caches.match(event.request)
            .then(response =>{
                return response || fetch(event.request);
            }
    ));
});
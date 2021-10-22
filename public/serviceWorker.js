const FILES_TO_CACHE = [
    "/",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/index.html",
    "/db.js",
    "/index.js",
    "/styles.css"
];
const DATA_CACHE_NAME = "data-cache-v1";
const CACHE_NAME = "static-cache-v2";

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            // go into cache, name each individually
            .then((cache) => cache.addAll(FILES_TO_CACHE))
            .then(self.skipWaiting())
    );
});

// Listen for any fetch request - is it HTML or API?
// respond in 
self.addEventListener('fetch', (event) => {
    // fetch address
    // check to see if it's an api
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        console.log(response);
                        if (response.status === 200) {
                            cache.put(event.request.url, response.clone());
                        }
                        return response;
                    })
                    .catch(err => {
                        return cache.match(event.request);
                    });
            })
                .catch(err => {
                    console.log(err);
                })
        )
        return;
    }
    //   console.log(event.request);
    event.respondWith(
        fetch(event.request)
            .catch(function () {
                return caches.match(event.request)
                    .then(response => {
                        if (response) {
                            return response;
                        } else if (event.request.headers.get("accept").includes("text/html")) {
                            return caches.match("/");
                        }
                    })
            })
    )
});


// const DATA_CACHE_NAME = "data-cache-v1";
// const CACHE_NAME = "static-cache-v2";

// // Install cache
// self.addEventListener("install", (event) =>{
//     event.waitUntil(
//         caches.open(CACHE_NAME)
//             .then(cache =>{
//                 console.log("cache successful!");
//                 return cache.addAll(FILES_TO_CACHE);
//             })
//     ),
//     self.skipWaiting();
// });
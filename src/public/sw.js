// Service Worker for The Weight RM
// Provides offline caching and performance improvements

const CACHE_NAME = 'weight-rm-cache-v1';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline functionality
const CACHE_FILES = [
    '/',
    '/contact-us',
    '/about',
    '/services',
    OFFLINE_URL,
    // Add your critical CSS and JS files
    '/src/public/seoUtils.js',
    '/src/public/performanceUtils.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching app shell');
                return cache.addAll(CACHE_FILES);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version if available
                if (response) {
                    return response;
                }
                
                // Otherwise fetch from network
                return fetch(event.request)
                    .then(response => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Cache successful responses for future use
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                // Only cache GET requests for same origin
                                if (event.request.method === 'GET' && 
                                    event.request.url.startsWith(self.location.origin)) {
                                    cache.put(event.request, responseToCache);
                                }
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // If both cache and network fail, show offline page for navigation requests
                        if (event.request.destination === 'document') {
                            return caches.match(OFFLINE_URL);
                        }
                        
                        // For other requests, return a generic offline response
                        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
                    });
            })
    );
});

// Background sync for form submissions when offline
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

function doBackgroundSync() {
    // Handle offline form submissions when connection is restored
    return new Promise((resolve, reject) => {
        // Your background sync logic here
        resolve();
    });
}

// Push notifications (if needed in the future)
self.addEventListener('push', event => {
    if (event.data) {
        const options = {
            body: event.data.text(),
            icon: '/images/icon-192x192.png',
            badge: '/images/badge-72x72.png',
            vibrate: [200, 100, 200],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: '2'
            },
            actions: [
                {
                    action: 'explore',
                    title: 'View Details',
                    icon: '/images/checkmark.png'
                },
                {
                    action: 'close',
                    title: 'Close Notification',
                    icon: '/images/xmark.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification('The Weight RM', options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'explore') {
        // Open the app to a specific page
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Performance optimizations
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
const CACHE_NAME = 'gestao-medicamentos-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/main.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
        body: data.message || data.text(),
        icon: '/public/logo-home.svg',
        badge: '/public/logo-home.svg',
        vibrate: [100, 50, 100],
        tag: data.tag || 'medicacao-reminder',
        renotify: true,
        data: {
            dateOfArrival: Date.now(),
            primaryKey: data.id || 1,
            url: data.url || '/'
        },
        actions: [
            {
                action: 'tomar',
                title: 'Tomar Medicação',
                icon: '/public/logo-home.svg'
            },
            {
                action: 'adiar',
                title: 'Adiar 30min',
                icon: '/public/logo-home.svg'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Lembrete de Medicação', options)
    );
});

self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-notifications') {
        event.waitUntil(syncNotifications());
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    event.waitUntil(
        clients.openWindow('/')
    );
});
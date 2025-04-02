self.addEventListener('push', function(event) {
    const options = {
        body: event.data.text(),
        icon: '/public/logo-home.svg',
        badge: '/public/logo-home.svg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'close',
                title: 'Fechar',
                icon: '/public/logo-home.svg'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Lembrete de Medicação', options)
    );
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
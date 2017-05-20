const CACHE_NAME = 'periodic-weather-v01';
const expectedCaches = [CACHE_NAME];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request).then(response =>
      caches.open(CACHE_NAME).then((cache) => {
        if (event.request.url.match(/(locations|subscriptions|notifications)/) === null) {
          cache.put(event.request, response.clone());
        }
        return response;
      })
    ))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (!expectedCaches.includes(key)) {
          return caches.delete(key);
        }
      })
    )).then(() => {
      console.log(`${CACHE_NAME} now ready to handle fetches!`);
      return clients.claim();
    })
  );
});

self.addEventListener('push', (event) => {
  event.waitUntil(
    self.registration.pushManager.getSubscription().then((subscription) => {
      const subscriptionId = subscription.endpoint.replace('https://android.googleapis.com/gcm/send/', '', subscription);

      return fetch('./notifications', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
        }),
      })
        .then(response => response.json())
        .then((data) => {
          const title = data.value.title;
          const body = `${(data.value.body).substring(0, 32)}...`;
          const icon = `./app/assets/icon/${data.value.icon}.jpg`;
          const badge = `./app/assets/badge/${data.value.icon}.png`;
          const tag = data.value.tag;
          return self.registration.showNotification(title, { body, icon, badge, tag });
        });
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://use-the-platform.com/periodic-weather/')
  );
});

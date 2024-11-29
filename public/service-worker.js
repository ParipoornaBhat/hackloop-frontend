self.addEventListener('push', (event) => {
  let notificationData = event.data ? JSON.parse(event.data.text()) : {};
  const title = notificationData.title || 'New Notification';
  const options = {
    body: notificationData.message || 'You have a new message.',
    icon: '/Alpha.jpeg', // Change to your icon
    badge: '/Alpha.jpeg', // Change to your badge
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // Handle the notification click event, e.g., open a URL
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
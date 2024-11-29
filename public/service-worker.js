self.addEventListener("push", (event) => {
  const { title, message } = event.data.json();  // Extract title and message from the push event data

  const options = {
    body: message, // Display the message body in the notification
    icon: "/icon.png", // Set an icon for the notification
    badge: "/badge.png", // Set a badge for the notification
  };

  event.waitUntil(
    self.registration.showNotification(title, options)  // Show the notification
  );
});

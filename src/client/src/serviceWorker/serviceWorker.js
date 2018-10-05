importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

const config = {
  messagingSenderId: '203333096571' // TODO - Dynamically insert Firebase sender ID
};

firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => (
  self.registration.showNotification('Hello, world', {body: 'This is a message'})
));

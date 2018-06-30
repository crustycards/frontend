const firebase = require('firebase');

const config = {
  apiKey: 'place_key_here', // TODO - Set API key
  messagingSenderId: '203333096571'
};

const init = () => {
  firebase.initializeApp(config);
  const messaging = firebase.messaging();
  messaging.requestPermission()
    .catch(() => console.log('Denied permission for notifications'))
    .then(() => {
      console.log('Granted permission for notifications');
      return messaging.getToken();
    })
    .then((token) => console.log(token));

  messaging.onMessage((payload) => console.log('Message:', payload));
};

module.exports = {init};

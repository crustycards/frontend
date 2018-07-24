import * as firebase from 'firebase/app';
import 'firebase/messaging';

const config = {
  messagingSenderId: '203333096571' // TODO - Dynamically insert Firebase sender ID
};

const init = (onMessage) => {
  firebase.initializeApp(config);
  const messaging = firebase.messaging();
  onMessage && messaging.onMessage(onMessage);
  return messaging.requestPermission()
    .catch(() => console.log('Denied permission for notifications'))
    .then(() => {
      return messaging.getToken();
    });
};

module.exports = {init};

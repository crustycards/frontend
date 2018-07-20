import * as firebase from 'firebase/app';
import 'firebase/messaging';
import {linkSessionToFirebase} from './api/apiInterface';

const config = {
  messagingSenderId: '203333096571' // TODO - Dynamically insert Firebase sender ID
};

const init = () => {
  firebase.initializeApp(config);
  const messaging = firebase.messaging();
  messaging.requestPermission()
    .catch(() => console.log('Denied permission for notifications'))
    .then(() => messaging.getToken())
    .then(linkSessionToFirebase);

  messaging.onMessage((payload) => console.log('Message:', payload));
};

module.exports = {init};

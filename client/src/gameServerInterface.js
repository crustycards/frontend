import io from 'socket.io-client';
export const gameSocket = io(window.__PRELOADED_DATA__.gameURL);
let sockets = {};

module.exports.openSocket = (socket) => {
  console.log('A user has connected');
  if (socket.request.user.id) {
    sockets[socket.request.user.id] = socket;
  }
  // Add event listeners here
};

module.exports.closeSocket = (socket) => {
  console.log('A user has disconnected');
  if (socket.request.user.id) {
    delete sockets[socket.request.user.id];
  }
};

module.exports.respondByUser = (userEmailArray, dataType, data) => {
  for (let socket in sockets) {
    for (let i = 0; i < userEmailArray.length; i++) {
      if (socket.request.user.email === userEmailArray[i]) {
        socket.emit(dataType, JSON.stringify(data));
      }
    }
  }
};
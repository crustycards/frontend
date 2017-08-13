let sockets = {};

module.exports.openSocket = (socket) => {
  console.log('A user has connected');
  if (socket.request.user.email) {
    sockets[socket.request.user.email] = socket;
  }
  // Add event listeners here
};

module.exports.closeSocket = (socket) => {
  console.log('A user has disconnected');
  if (socket.request.user.id) {
    delete sockets[socket.request.user.id];
  }
};

module.exports.respondByUserEmail = (userEmailArray, dataType, data) => {
  for (let emailKey in sockets) {
    for (let i = 0; i < userEmailArray.length; i++) {
      if (userEmailArray[i] === emailKey) {
        sockets[emailKey].emit(dataType, JSON.stringify(data));
      }
    }
  }
};
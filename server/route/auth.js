const authUrl = process.env.AUTH_SERVER_URL;

module.exports = [
  {
    method: 'PUT',
    path: '/api/session',
    handler: (request, reply) => {
      // TODO - Replace '.session' with cookie name in server index file
      const sessionId = request.state.session;
      const token = request.query.token;
      if (sessionId) {
        reply.proxy({uri: `${authUrl}/session/${sessionId}?token=${token}`});
      } else {
        reply.response('Must be logged in to link Firebase token to session').code(400);
      }
    },
    options: {payload: {parse: false}}
  }
];

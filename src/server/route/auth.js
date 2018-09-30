const Boom = require('boom');
const authUrl = process.env.AUTH_SERVER_URL;

module.exports = [
  {
    method: 'PUT',
    path: '/api/session',
    handler: (request, h) => {
      // TODO - Replace '.session' with cookie name in server index file
      const sessionId = request.state.session;
      const token = request.query.token;
      if (sessionId) {
        return h.proxy({uri: `${authUrl}/session/${sessionId}?token=${token}`});
      } else {
        return h.response('Must be logged in to link Firebase token to session').code(400);
      }
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'GET',
    path: '/api/sessions',
    handler: (request, h) => {
      const {userId} = request.query;
      if (userId === undefined) {
        throw Boom.badRequest('Must provide query parameter for userId');
      } else {
        return h.proxy({uri: `${authUrl}/sessions?userId=${userId}`});
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/session',
    handler: (request, h) => {
      const {sessionId} = request.query;
      if (sessionId === undefined) {
        throw Boom.badRequest('Must provide query parameter for sessionId');
      } else {
        return h.proxy({uri: `${authUrl}/session?sessionId=${sessionId}`});
      }
    },
    options: {payload: {parse: false}}
  }
];

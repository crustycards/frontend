const apiUrl = process.env.API_URL;

module.exports = [
  {
    method: 'DELETE',
    path: '/api/cardpack/{id}',
    handler: (request, h) => {
      return h.proxy({uri: `${apiUrl}/cardpack/{id}`});
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'GET',
    path: '/api/cardpack/{id}',
    handler: (request, h) => {
      return h.proxy({uri: `${apiUrl}/cardpack/{id}`});
    }
  },
  {
    method: 'PATCH',
    path: '/api/cardpack/{id}',
    handler: (request, h) => {
      return h.proxy({uri: `${apiUrl}/cardpack/{id}`});
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'PUT',
    path: '/api/cardpack/cards/black/{id}',
    handler: (request, h) => {
      return h.proxy({uri: `${apiUrl}/cardpack/{id}/cards/black`});
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'PUT',
    path: '/api/cardpack/cards/white/{id}',
    handler: (request, h) => {
      return h.proxy({uri: `${apiUrl}/cardpack/{id}/cards/white`});
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'DELETE',
    path: '/api/cards/black/{id}',
    handler: (request, h) => {
      return h.proxy({uri: `${apiUrl}/cards/black/{id}`});
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'DELETE',
    path: '/api/cards/white/{id}',
    handler: (request, h) => {
      return h.proxy({uri: `${apiUrl}/cards/white/{id}`});
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'PUT',
    path: '/api/cardpacks/{userId}',
    handler: (request, h) => {
      return h.proxy({uri: `${apiUrl}/{userId}/cardpack`});
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'GET',
    path: '/api/cardpacks/{id}',
    handler: (request, h) => {
      return h.proxy({uri: `${apiUrl}/{id}/cardpacks`});
    }
  }
];

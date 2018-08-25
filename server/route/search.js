const apiUrl = process.env.API_URL;

const getQuery = (query) => query ? `?query=${query}` : '';

module.exports = [
  {
    method: 'GET',
    path: '/api/cardpack/search',
    handler: (request, h) => {
      const query = request.query.query;

      return h.proxy({
        uri: `${apiUrl}/cardpack/search${getQuery(query)}`
      });
    }
  },
  {
    method: 'GET',
    path: '/api/cardpack/search/autocomplete',
    handler: (request, h) => {
      const query = request.query.query;

      return h.proxy({
        uri: `${apiUrl}/cardpack/search/autocomplete${getQuery(query)}`
      });
    }
  },
  {
    method: 'GET',
    path: '/api/user/search',
    handler: (request, h) => {
      const query = request.query.query;

      return h.proxy({
        uri: `${apiUrl}/user/search${getQuery(query)}`
      });
    }
  },
  {
    method: 'GET',
    path: '/api/user/search/autocomplete',
    handler: (request, h) => {
      const query = request.query.query;

      return h.proxy({
        uri: `${apiUrl}/user/search/autocomplete${getQuery(query)}`
      });
    }
  }
];

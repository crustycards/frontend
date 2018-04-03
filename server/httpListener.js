const assert = require('assert');

module.exports = () => {
  if (process.env.NODE_ENV !== 'production') {
    const http = require('http');
    return http.createServer();
  }

  const Http = require('https');
  const key = process.env.WEB_TLS_KEY;
  const cert = process.env.WEB_TLS_CERTIFICATE;

  return Http.createServer({key, cert});
};
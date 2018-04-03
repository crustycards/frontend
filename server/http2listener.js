const assert = require('assert');

module.exports = () => {
  if (process.env.NODE_ENV !== 'production') {
    const http = require('http');
    return http.createServer();
  }

  const Http2 = require('http2');
  const key = process.env.WEB_TLS_KEY;
  const cert = process.env.WEB_TLS_CERTIFICATE;

  return Http2.createSecureServer({key, cert});
};
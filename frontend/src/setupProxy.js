const createProxyMiddleware = require('http-proxy-middleware');

const { BACKEND_HOST = 'localhost' } = process.env;

module.exports = function (app) {
  app.use(
    '/oauth',
    createProxyMiddleware({
      target: `http://${BACKEND_HOST}:4000`,
      changeOrigin: true,
    })
  );
};

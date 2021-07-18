/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */

// This is not shipped to the frontend. This is pure create-react-app magic meant for development.
// However this is in the src/ directory, which means it's treated like a frontend file.
// As such, we have to disable the eslint rules that don't apply to this file.

// This is installed as a devDependency.
const createProxyMiddleware = require('http-proxy-middleware');

const { BACKEND_HOST = 'localhost' } = process.env;

function setupProxy(app) {
  app.use(
    '/oauth',
    createProxyMiddleware({
      target: `http://${BACKEND_HOST}:4000`,
      changeOrigin: true,
    })
  );
}

module.exports = setupProxy;

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://allsextoyss.vercel.app',
      changeOrigin: true,
    })
  );
};

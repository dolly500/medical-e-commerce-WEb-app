const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://medical-e-app.vercel.app/',
      changeOrigin: true,
    })
  );
};

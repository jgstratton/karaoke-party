const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	app.use(
		createProxyMiddleware(['/party', '/singer', '/song', '/songs', '/user'], {
			target: 'https://localhost:7049',
			secure: false,
			ws: true,
		})
	);

	app.use(
		createProxyMiddleware(['/hubs/player'], {
			target: 'https://localhost:7049',
			secure: false,
			ws: true,
		})
	);
};

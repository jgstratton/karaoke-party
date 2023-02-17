const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	app.use(
		createProxyMiddleware(['/party', '/singer', '/song'], {
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

	app.use(
		'/yt-dlp',
		createProxyMiddleware({
			target: 'http://127.0.0.1:5000',
			pathRewrite: { '^/yt-dlp': '' },
			secure: false,
		})
	);
};

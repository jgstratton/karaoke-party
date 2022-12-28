const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	app.use(
		createProxyMiddleware(['/party', '/singer'], {
			target: 'https://localhost:7049',
			secure: false,
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

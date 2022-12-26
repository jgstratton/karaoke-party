const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/party",
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://localhost:7049',
        secure: false
    });

    app.use(appProxy); 
};

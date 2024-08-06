const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Replace this with the target server URL
const targetUrl = 'https://api.backpack.exchange';

// Handle CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Range');
    next();
});



app.use('/', (req, res, next) => {
    // Modifying headers to mimic the correct request
    req.headers.origin = 'http://localhost:3000';
    req.headers.referer = 'http://localhost:3000/';
    req.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36';
    req.headers['accept-encoding'] = 'gzip, deflate, br, zstd';
    req.headers['accept-language'] = 'en-US,en;q=0.9';

    next();
}, createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        // Optionally, log the full proxy request object
       
    },
    onProxyRes: (proxyRes, req, res) => {
        // Optionally, modify the response if needed
    }
}));

const port = 3006;
app.listen(port, () => {
    console.log(`Proxy server running on http://localhost:${port}`);
});

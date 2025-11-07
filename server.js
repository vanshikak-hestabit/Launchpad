const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;

    res.setHeader('Content-Type', 'application/json');
    
    if (path === '/echo') {
        res.statusCode = 200;
        res.end(JSON.stringify(req.headers));

    } else if (path === '/slow') {
        const delay = parseInt(query.ms) || 3000;
        res.statusCode = 200;
        setTimeout(() => {
            res.end(JSON.stringify({ message: `Delayed by ${delay}ms` }));
        }, delay);

    } else if (path === '/cache') {
        res.statusCode = 200;
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.end(JSON.stringify({ message: "Cache headers set." }));

    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});


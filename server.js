const http = require('http');
const fs = require('fs');
const path = require('path');

const VIEWS_FILE = path.join(__dirname, 'views.json');
const seenIPs = new Map();

function getViews() {
  try {
    return JSON.parse(fs.readFileSync(VIEWS_FILE, 'utf8')).count;
  } catch {
    return 0;
  }
}

function saveViews(count) {
  fs.writeFileSync(VIEWS_FILE, JSON.stringify({ count }));
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET' && req.url === '/api/views') {
    res.end(JSON.stringify({ count: getViews() }));
  } else if (req.method === 'POST' && req.url === '/api/views') {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress;
    const now = Date.now();
    const last = seenIPs.get(ip);
    let count = getViews();
    if (!last || now - last > 24 * 60 * 60 * 1000) {
      count++;
      saveViews(count);
      seenIPs.set(ip, now);
    }
    res.end(JSON.stringify({ count }));
  } else {
    res.statusCode = 404;
    res.end('{}');
  }
});

server.listen(3001, '127.0.0.1', () => {
  console.log('Views server on :3001');
});

const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const VIEWS_FILE = path.join(__dirname, 'views.json');
const DAY_MS = 24 * 60 * 60 * 1000;
const seenIPs = new Map();

async function getViews() {
  try {
    return JSON.parse(await fs.readFile(VIEWS_FILE, 'utf8')).count;
  } catch {
    return 0;
  }
}

async function saveViews(count) {
  await fs.writeFile(VIEWS_FILE, JSON.stringify({ count }));
}

setInterval(() => {
  const cutoff = Date.now() - DAY_MS;
  for (const [ip, ts] of seenIPs) {
    if (ts < cutoff) seenIPs.delete(ip);
  }
}, 60 * 60 * 1000);

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'POST' && req.url === '/api/views') {
    try {
      const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress;
      const now = Date.now();
      const last = seenIPs.get(ip);
      let count = await getViews();
      if (!last || now - last > DAY_MS) {
        count++;
        await saveViews(count);
        seenIPs.set(ip, now);
      }
      res.end(JSON.stringify({ count }));
    } catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.end('{}');
    }
  } else {
    res.statusCode = 404;
    res.end('{}');
  }
});

server.listen(3001, '127.0.0.1', () => {
  console.log('Views server on :3001');
});
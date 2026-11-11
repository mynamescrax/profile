const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const VIEWS_FILE = path.join(__dirname, 'views.json');
const DAY_MS = 24 * 60 * 60 * 1000;
const seenIPs = new Map();

// The count lives in memory and is written through a single serialized queue,
// so concurrent requests can't clobber each other or read a half-written file.
let count = 0;
let writing = Promise.resolve();

async function loadCount() {
  try {
    const parsed = JSON.parse(await fs.readFile(VIEWS_FILE, 'utf8'));
    count = Number(parsed.count) || 0;
  } catch {
    count = 0;
  }
}

function persist() {
  writing = writing
    .then(async () => {
      const tmp = `${VIEWS_FILE}.${process.pid}.tmp`;
      await fs.writeFile(tmp, JSON.stringify({ count }));
      await fs.rename(tmp, VIEWS_FILE); // atomic replace
    })
    .catch((err) => console.error('views: save failed', err));
  return writing;
}

// Caddy terminates TLS and proxies to loopback, so the real address is the one
// it forwards: Cloudflare's edge-supplied client IP when the peer is a CF edge,
// otherwise the direct peer. The socket address here is always 127.0.0.1.
function clientIP(req) {
  // Caddy forwards the Cloudflare-supplied client address as X-Real-IP. Fall
  // back to the head of X-Forwarded-For, then the peer, so a missing or empty
  // header can never collapse every visitor onto 127.0.0.1.
  const forwarded = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const raw = (req.headers['x-real-ip'] || '').trim() || forwarded || req.socket.remoteAddress || '';
  return raw.replace(/^::ffff:/, '').replace(/%.*$/, '').toLowerCase() || 'unknown';
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

setInterval(() => {
  const cutoff = Date.now() - DAY_MS;
  for (const [ip, ts] of seenIPs) {
    if (ts < cutoff) seenIPs.delete(ip);
  }
}, 60 * 60 * 1000).unref();

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/views') {
    const ip = clientIP(req);
    const now = Date.now();
    const last = seenIPs.get(ip);
    if (!last || now - last > DAY_MS) {
      seenIPs.set(ip, now);
      count += 1;
      console.log(`views: +1 from ${ip} (total ${count})`);
      persist();
    }
    send(res, 200, { count });
    return;
  }

  send(res, 404, {});
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    writing.finally(() => process.exit(0));
  });
}

loadCount().then(() => {
  server.listen(3001, '127.0.0.1', () => {
    console.log(`Views server on :3001 (${count} views)`);
  });
});

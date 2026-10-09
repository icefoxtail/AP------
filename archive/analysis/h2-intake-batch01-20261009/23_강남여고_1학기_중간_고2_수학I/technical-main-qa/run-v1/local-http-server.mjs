import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const root = path.resolve(process.cwd());
const port = 41873;
const evidenceDir = path.join(root, 'archive/analysis/h2-intake-batch01-20261009/23_강남여고_1학기_중간_고2_수학I/technical-main-qa/run-v1');
const log = fs.createWriteStream(path.join(evidenceDir, 'http-requests.ndjson'), { flags: 'wx' });
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
};

const server = http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400); response.end('bad url'); return; }
  const file = path.resolve(root, '.' + pathname);
  const relative = path.relative(root, file);
  if (relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) {
    response.writeHead(403); response.end('forbidden'); return;
  }
  let bytes;
  try { bytes = fs.readFileSync(file); }
  catch { response.writeHead(404); response.end('not found'); return; }
  response.writeHead(200, {
    'content-type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'cache-control': 'no-store', 'content-length': bytes.length, 'access-control-allow-origin': '*',
  });
  response.end(bytes);
  log.write(JSON.stringify({ method: request.method, path: pathname, status: 200, bytes: bytes.length }) + '\n');
});

server.listen(port, '0.0.0.0', () => process.stdout.write(JSON.stringify({ event: 'listen', root, port }) + '\n'));

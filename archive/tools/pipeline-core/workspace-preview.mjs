import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { archiveWorkspace } from './archive-workspace.mjs';
import { safePath } from './canonical.mjs';

export async function serveWorkspacePreview(root, options) {
  const layout = archiveWorkspace(root, options);
  safePath(root, layout.examPath);
  const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff' };
  const server = http.createServer((request, response) => {
    try {
      if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
      let relative = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).slice(1);
      if (relative === 'favicon.ico') { response.writeHead(204); response.end(); return; }
      if (relative.startsWith('archive/archive/')) relative = relative.slice(8);
      if (relative === `archive/exams/${layout.archiveRelativePath}`) relative = layout.examPath;
      else if (relative.startsWith(`archive/assets/images/${layout.examId}/`)) relative = `${layout.workRoot}/${relative.slice(8)}`;
      else if (/^(archive\/exams\/|archive\/assets\/|archive\/tools\/)/.test(relative)) throw new Error('NOT_IN_WORKSPACE');
      else if (!/^(archive\/|data\/|apmath\/css\/|apmath\/js\/)/.test(relative) || !mime[path.extname(relative)]) throw new Error('NOT_PREVIEW_RUNTIME');
      const file = safePath(root, relative);
      response.writeHead(200, { 'Content-Type': mime[path.extname(file)], 'Cache-Control': 'no-store' });
      response.end(request.method === 'HEAD' ? undefined : fs.readFileSync(file));
    } catch { response.writeHead(404); response.end('Not found'); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(options.port || 0, '127.0.0.1', resolve); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const url = `${base}/archive/engine.html?data=${encodeURIComponent(`exams/${layout.archiveRelativePath}`)}&preview=1&mode=exam`;
  return { status: 'PREVIEW_RUNNING', url, layout, server };
}

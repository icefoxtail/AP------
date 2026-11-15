'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { EventEmitter } = require('node:events');
const { spawn } = require('node:child_process');
const { waitForChromePage } = require('../tools/check-archive-pages-site-browser.cjs');

const settings = { timeoutMs: 2000, pollMs: 5, probeTimeoutMs: 100 };
function fixture(t) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'pages-chrome-startup-'));
  const browser = new EventEmitter();
  browser.exitCode = null;
  browser.signalCode = null;
  t.after(() => fs.rmSync(profile, { recursive: true, force: true }));
  return { profile, browser, portFile: path.join(profile, 'DevToolsActivePort') };
}
async function endpoint(t, handler) {
  let requests = 0;
  const server = http.createServer((request, response) => {
    requests += 1;
    assert.equal(request.url, '/json/list');
    handler(response, requests, server.address().port);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }));
  return { port: server.address().port, requests: () => requests };
}
function ready(response, port) {
  response.end(JSON.stringify([{ type: 'page', id: 'ready', webSocketDebuggerUrl: `ws://127.0.0.1:${port}/devtools/page/ready` }]));
}

for (const [label, initial] of [
  ['created but empty', ''], ['incomplete numeric line', '123'],
  ['zero port', '0\n'], ['out of range port', '65536\n'], ['non-numeric port', 'starting\n'],
]) {
  test(`Chrome waits for a complete port when the file is ${label}`, async t => {
    const f = fixture(t);
    const server = await endpoint(t, (response, count, port) => ready(response, port));
    fs.writeFileSync(f.portFile, initial);
    const waiting = waitForChromePage(f.browser, f.profile, settings);
    // The first synchronous read sees the incomplete file, before Chrome's write.
    fs.writeFileSync(f.portFile, `${server.port}\n/devtools/browser/test`);
    assert.equal((await waiting).id, 'ready');
    assert.equal(server.requests(), 1);
    assert.equal(f.browser.listenerCount('error'), 0);
  });
}

test('Chrome waits for file creation, then accepts a complete CRLF port line', async t => {
  const f = fixture(t);
  const server = await endpoint(t, (response, count, port) => ready(response, port));
  const waiting = waitForChromePage(f.browser, f.profile, settings);
  fs.writeFileSync(f.portFile, `${server.port}\r\n/devtools/browser/test`);
  assert.equal((await waiting).id, 'ready');
});

test('a valid port is not ready until the HTTP endpoint returns a local page target', async t => {
  const f = fixture(t);
  const server = await endpoint(t, (response, count, port) => {
    if (count === 1) { response.writeHead(503); response.end('starting'); }
    else if (count === 2) response.end('unfinished JSON');
    else if (count === 3) response.end(JSON.stringify([{ type: 'service_worker', webSocketDebuggerUrl: `ws://127.0.0.1:${port}/devtools/worker/one` }]));
    else if (count === 4) response.end(JSON.stringify([{ type: 'page', webSocketDebuggerUrl: 'ws://127.0.0.1:1/devtools/page/wrong-port' }]));
    else ready(response, port);
  });
  fs.writeFileSync(f.portFile, `${server.port}\n/devtools/browser/test`);
  assert.equal((await waitForChromePage(f.browser, f.profile, settings)).id, 'ready');
  assert.equal(server.requests(), 5);
});

test('an unresponsive endpoint remains a bounded startup failure with stderr evidence', async t => {
  const f = fixture(t);
  const server = await endpoint(t, () => {});
  fs.writeFileSync(f.portFile, `${server.port}\n/devtools/browser/test`);
  await assert.rejects(waitForChromePage(f.browser, f.profile, {
    ...settings, timeoutMs: 80, probeTimeoutMs: 15, stderrTail: () => 'DevTools startup diagnostic',
  }), /startup timed out.*last observation: DevTools port.*not ready.*Chrome stderr: DevTools startup diagnostic/);
  assert.ok(server.requests() >= 1);
});

test('an incomplete port never turns into a pass at the deadline', async t => {
  const f = fixture(t);
  fs.writeFileSync(f.portFile, '');
  await assert.rejects(waitForChromePage(f.browser, f.profile, { ...settings, timeoutMs: 20 }),
    /startup timed out.*DevToolsActivePort is empty, incomplete, or has an invalid port/);
});

test('process exit and signal failures keep their actual cause and stderr', async t => {
  const f = fixture(t);
  f.browser.exitCode = 7;
  await assert.rejects(waitForChromePage(f.browser, f.profile, { ...settings, stderrTail: () => 'profile failed' }),
    /Chrome exited with code 7.*Chrome stderr: profile failed/);
  f.browser.exitCode = null;
  f.browser.signalCode = 'SIGTERM';
  await assert.rejects(waitForChromePage(f.browser, f.profile, settings), /Chrome exited with signal SIGTERM/);
});

test('a failed executable launch is reported instead of an unhandled child-process error', async t => {
  const f = fixture(t);
  const waiting = waitForChromePage(f.browser, f.profile, settings);
  f.browser.emit('error', new Error('spawn ENOENT'));
  await assert.rejects(waiting, /Chrome could not start: spawn ENOENT/);
  assert.equal(f.browser.listenerCount('error'), 0);
});

test('a real missing Chrome executable fails through the same startup contract', async t => {
  const f = fixture(t);
  const browser = spawn(path.join(f.profile, 'missing-chrome'), [], { stdio: 'ignore' });
  await assert.rejects(waitForChromePage(browser, f.profile, settings), /Chrome could not start:.*ENOENT/);
});

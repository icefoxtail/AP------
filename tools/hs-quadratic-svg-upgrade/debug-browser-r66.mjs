import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { readBoundFile } from '../../archive/tools/pipeline-core/canonical.mjs';

const ROOT = path.resolve(process.cwd());
const runPath = process.env.DEBUG_RUN_PATH || 'archive/_generated/hs-quadratic-svg-upgrade-20260908/pipeline-r73a/runs/hsquadratic-r73a-001/run.json';
const run = JSON.parse(fs.readFileSync(path.join(ROOT, runPath), 'utf8'));
const refByPath = new Map(run.inputs.map(ref => [ref.path, ref]));
const candidates = [...new Set(run.questions.map(q => q.candidatePath))];
const requests = [], unbound = [];
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
const server = http.createServer((request, response) => {
  let requested = '';
  try {
    requested = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).slice(1);
    if (requested === 'favicon.ico') { response.writeHead(204); response.end(); return; }
    let relative = requested.startsWith('archive/archive/') ? requested.slice('archive/'.length) : requested;
    const match = requested.match(/^archive\/exams\/__pipeline_review__\/(\d+)\.js$/);
    if (match) relative = candidates[Number(match[1])];
    const ref = refByPath.get(relative) || (requested.startsWith('archive/') ? refByPath.get(requested.slice('archive/'.length)) : null);
    requests.push({ requested, relative, bound: !!ref });
    if (!ref) { unbound.push(relative); throw new Error(`UNBOUND_RUNTIME_REQUEST:${relative}`); }
    response.writeHead(200, { 'Content-Type': mime[path.extname(relative)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); response.end(readBoundFile(ROOT, ref));
  } catch (error) { response.writeHead(404); response.end(String(error.message)); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const require = createRequire(path.join(process.env.APMATH_NODE_MODULES || path.join(ROOT, 'node_modules'), '..', 'package.json'));
const { chromium } = require('playwright');
const browser = await chromium.launch({ channel: 'chromium', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
const pageErrors = [], failedRequests = [], consoleMessages = [];
page.on('pageerror', error => pageErrors.push(error.message));
page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText || 'REQUEST_FAILED' }));
page.on('console', message => consoleMessages.push({ type: message.type(), text: message.text() }));
const mode = process.env.DEBUG_MODE || 'exam';
const url = `http://127.0.0.1:${port}/archive/engine.html?data=exams/__pipeline_review__/0.js&mode=${mode === 'solution' ? 'sol' : mode}&qpp=4&fit=screen`;
let navigation;
try { navigation = await page.goto(url, { waitUntil: 'load', timeout: 45000 }); } catch (error) { navigation = { error: error.message }; }
await new Promise(resolve => setTimeout(resolve, Number(process.env.DEBUG_WAIT_MS || 30000)));
const state = await page.evaluate(() => ({ title: document.title, readyState: document.readyState, qBoxes: document.querySelectorAll('#print-area .q-box').length, sourceRefs: [...document.querySelectorAll('#print-area .q-box')].map(node => node.dataset.sourceRef || null), boxDetails: [...document.querySelectorAll('#print-area .q-box')].map(node => { const r = node.getBoundingClientRect(); const s = getComputedStyle(node); const offenders = []; for (const child of [node, ...node.querySelectorAll('*')]) { const c = child.getBoundingClientRect(); if (!c.width || !c.height) continue; for (let ancestor = child.parentElement; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) { const a = getComputedStyle(ancestor), b = ancestor.getBoundingClientRect(); const outside = (['hidden','clip'].includes(a.overflowX) && (c.left < b.left - 1 || c.right > b.right + 1)) || (['hidden','clip'].includes(a.overflowY) && (c.top < b.top - 1 || c.bottom > b.bottom + 1)); if (outside && offenders.length < 3) offenders.push({ child: { tag: child.tagName, className: child.className, x: c.x, y: c.y, width: c.width, height: c.height }, ancestor: { tag: ancestor.tagName, className: ancestor.className, x: b.x, y: b.y, width: b.width, height: b.height, overflowX: a.overflowX, overflowY: a.overflowY } }); } } return { className: node.className, sourceRef: node.dataset.sourceRef || null, rect: { x: r.x, y: r.y, width: r.width, height: r.height }, clientHeight: node.clientHeight, scrollHeight: node.scrollHeight, overflowX: s.overflowX, overflowY: s.overflowY, offenders, childRects: [...node.children].map(child => { const c = child.getBoundingClientRect(); return { tag: child.tagName, className: child.className, x: c.x, y: c.y, width: c.width, height: c.height }; }) }; }), ans: document.querySelectorAll('#print-area .ans-n').length, renderError: document.documentElement.dataset.apRenderError || null, text: document.querySelector('#print-area')?.innerText?.slice(0, 1000) || '', mathJax: !!window.MathJax, questionBankLength: Array.isArray(window.questionBank) ? window.questionBank.length : null, questionBankIds: Array.isArray(window.questionBank) ? window.questionBank.map(q => ({ id: q.id, type: typeof q.id })) : null, appDataLength: Array.isArray(window.AppState?.data) ? window.AppState.data.length : null, appDataIds: Array.isArray(window.AppState?.data) ? window.AppState.data.map(q => ({ id: q.id, type: typeof q.id })) : null }));
console.log(JSON.stringify({ runId: run.runId, url, navigation: navigation?.error || navigation?.status(), state, pageErrors, failedRequests, unbound: [...new Set(unbound)], requests: requests.slice(-80), consoleMessages: consoleMessages.slice(-80) }, null, 2));
await browser.close(); await new Promise(resolve => server.close(resolve));

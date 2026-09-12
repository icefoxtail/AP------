import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileRef, writeNewJson } from './canonical.mjs';

const root = process.cwd();
const output = process.argv[2];
if (!output?.startsWith('alive/runtime/')) throw new Error('RUNTIME_OUTPUT_REQUIRED');
fs.mkdirSync(output, { recursive: true });
const load = p => { const c = { window: {} }; vm.runInNewContext(fs.readFileSync(p, 'utf8'), c, { timeout: 3000 }); return JSON.parse(JSON.stringify(c.window)); };
const files = execFileSync('git', ['ls-files', '-z', 'archive/exams/original/**/*.js'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const db = load('archive/db.js').mainDB.exams;
const index = load('archive/question-index.js').questionIndex;
const counts = {}, observations = [], assets = new Map(), errors = [];
for (const file of files) {
  const bank = load(file).questionBank;
  for (const q of bank) {
    for (const field of ['image', 'solutionImage']) if (q[field]) {
      const asset = `archive/${q[field]}`;
      counts[`${field}:${path.extname(asset)}`] = (counts[`${field}:${path.extname(asset)}`] || 0) + 1;
      assets.set(asset, [...(assets.get(asset) || []), { file, id: q.id, field }]);
    }
    if (q.choices?.length) counts.choices = (counts.choices || 0) + 1;
    if (!q.image && !q.solutionImage) counts.noLinkedVisual = (counts.noLinkedVisual || 0) + 1;
  }
  observations.push({ ...fileRef(root, file), count: bank.length, db: db.some(row => `archive/exams/${row.file}` === file), indexCount: index.filter(row => `archive/exams/${row.sourceFile}` === file).length });
}
for (const [asset] of assets) if (!fs.existsSync(asset)) errors.push(`MISSING_ASSET:${asset}`);
const samples = [
  'original/high/h1/1final/22_금당고_1학기_기말_고1_기출.js',
  'original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js',
  'original/high/h1/2mid/21_강남여고_2학기_중간_고1_기출.js',
  'original/middle/m1/2mid/23_연향중_2학기_중간_중1_기출.js',
];
const report = { status: 'DIAGNOSTIC_ONLY', productionAuthorized: false, counts, observations, errors, sharedAssetReferences: [...assets].filter(([, rows]) => new Set(rows.map(row => `${row.file}|${row.id}`)).size > 1), samples: samples.map(file => ({ file, ...load(`archive/exams/${file}`) })), renders: [] };
const require = createRequire(process.env.APMATH_NODE_MODULES ? path.join(process.env.APMATH_NODE_MODULES, '..', 'package.json') : import.meta.url);
const { chromium } = require('playwright');
const server = http.createServer((req, res) => {
  const p = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://local').pathname));
  if (!p.startsWith(root + path.sep) || !fs.existsSync(p) || !fs.statSync(p).isFile()) { res.writeHead(404); res.end(); return; }
  res.setHeader('Content-Type', ({ '.js': 'application/javascript', '.html': 'text/html', '.svg': 'image/svg+xml', '.png': 'image/png' })[path.extname(p)] || 'application/octet-stream');
  fs.createReadStream(p).pipe(res);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const [sampleIndex, file] of samples.entries()) for (const mode of ['exam', 'sol', 'ans']) for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const expected = load(`archive/exams/${file}`).questionBank.length;
    const row = { file, mode, viewport, expected, errors: [] };
    page.on('pageerror', e => row.errors.push(e.message));
    try {
      await page.goto(`http://127.0.0.1:${server.address().port}/archive/engine.html?data=${encodeURIComponent('exams/' + file)}&mode=${mode}&qpp=4&fit=screen`);
      await page.waitForFunction(({ mode, expected }) => document.querySelectorAll(mode === 'ans' ? '.ans-n' : '.q-box').length >= expected, { mode, expected }, { timeout: 30000 });
      await page.evaluate(async () => { await window.MathJax?.startup?.promise; await Promise.all([...document.images].map(img => img.decode().catch(() => {}))); });
      row.observed = await page.evaluate(mode => ({ count: document.querySelectorAll(mode === 'ans' ? '.ans-n' : '.q-box').length, broken: [...document.images].filter(i => !i.naturalWidth).map(i => i.src), mathErrors: document.querySelectorAll('mjx-merror').length }), mode);
      const shot = `${output}/${sampleIndex}-${mode}-${viewport.width}.png`;
      await page.screenshot({ path: shot, fullPage: true });
      row.screenshot = fileRef(root, shot);
    } catch (e) { row.errors.push(e.message); }
    report.renders.push(row); await page.close();
    console.log(JSON.stringify({ sampleIndex, mode, width: viewport.width, observed: row.observed, errors: row.errors }));
  }
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
writeNewJson(path.join(output, 'inspection.json'), report);
console.log(JSON.stringify({ files: observations.length, questions: observations.reduce((n, r) => n + r.count, 0), counts, missingAssets: errors.length, sharedAssetCount: report.sharedAssetReferences.length, report: `${output}/inspection.json` }));

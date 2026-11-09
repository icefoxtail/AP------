#!/usr/bin/env node
'use strict';
/*
 * AP Table validator (PR-2 of AP Table Engine, see docs/agents/table-engine.md).
 *
 * Purpose: find tables a student would see broken, before release, for any AI-authored exam.
 * Criterion is "fit for students", not pixel perfection. Exam data is never modified here.
 *
 *   node tools/check-ap-tables.cjs                              static check of every archive/exams/**\/*.js
 *   node tools/check-ap-tables.cjs --files <list|glob>          subset (comma/space separated paths, globs, or name fragments)
 *   node tools/check-ap-tables.cjs --json <path>                also write the full result as JSON
 *   node tools/check-ap-tables.cjs --browser --files <list>     + Chrome check of engine.html?data=...&mode=exam|sol
 *
 * Static rules: ROW_COL_MISMATCH, RESIDUAL_PIPE_ROW, PAREN_MATH_IN_CELL, UNBALANCED_DOLLAR, EMPTY_HEADER,
 *               SLASH_FRACTION_OUTSIDE_MATH, BARE_MATH_VARIABLE_HEADER (+ ENGINE_EXCEPTION).
 * Browser rules: TABLE_OVERFLOW, CELL_OVERFLOW, MATH_ERROR. A file that cannot render for an unrelated
 *               reason is reported as NOT_RUN (never silently passed).
 * Exit code: 1 when any FAIL, 2 on usage error, 0 otherwise.
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const http = require('node:http');

const repoRoot = path.resolve(__dirname, '..');
const examsRoot = path.join(repoRoot, 'archive', 'exams');
const imageRoot = path.join(repoRoot, 'archive', 'assets', 'images');
const PIXEL_PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
const { renderApTables } = require(path.join(repoRoot, 'archive', 'js', 'ap-table-engine.js'));

const RULES = [
  'ROW_COL_MISMATCH', 'RESIDUAL_PIPE_ROW', 'PAREN_MATH_IN_CELL', 'UNBALANCED_DOLLAR', 'EMPTY_HEADER',
  'SLASH_FRACTION_OUTSIDE_MATH', 'BARE_MATH_VARIABLE_HEADER', 'ENGINE_EXCEPTION'
];
const BROWSER_RULES = ['TABLE_OVERFLOW', 'CELL_OVERFLOW', 'MATH_ERROR'];

// ------------------------------------------------------------------ helpers

function decodeEntities(t) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return String(t).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (all, e) => {
    if (e[0] === '#') {
      const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return code ? String.fromCodePoint(code) : all;
    }
    const v = named[e.toLowerCase()];
    return v === undefined ? all : v;
  });
}

// Replace math spans by a blank so that what is left is "text outside math".
function stripMath(s) {
  return String(s)
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\\\[[\s\S]*?\\\]/g, ' ')
    .replace(/\\\([\s\S]*?\\\)/g, ' ')
    .replace(/\$(?!\$)[\s\S]*?(?<!\$)\$/g, ' ');
}

function plainText(html) {
  return decodeEntities(String(html).replace(/<br\s*\/?>/gi, ' ').replace(/<\/?[a-zA-Z][^>]*>/g, '')).replace(/\s+/g, ' ').trim();
}

function excerpt(s, n = 60) {
  const t = plainText(s);
  return t.length > n ? t.slice(0, n) + '…' : t;
}

// ------------------------------------------------------------------ table extraction

const TAG_RE = /<(\/?)(table|thead|tbody|tfoot|tr|th|td)\b([^>]*)>/gi;

function attrNum(attrs, name) {
  const m = new RegExp('\\b' + name + '\\s*=\\s*["\']?(\\d+)', 'i').exec(attrs || '');
  const n = m ? parseInt(m[1], 10) : 1;
  return n >= 1 ? n : 1;
}

// Top-level tables of `html` (nested tables stay part of their parent cell).
// -> [{ classes, rows: [{ head, cells: [{ tag, html, colspan, rowspan, row, col }] }] }]
function extractTables(html) {
  const tables = [];
  let depth = 0, table = null, row = null, cell = null, section = '';
  let m;
  TAG_RE.lastIndex = 0;
  const closeCell = (pos) => { if (cell) { cell.html = html.slice(cell.start, pos); cell = null; } };
  while ((m = TAG_RE.exec(html))) {
    const closing = m[1] === '/';
    const tag = m[2].toLowerCase();
    if (tag === 'table') {
      if (!closing) {
        depth++;
        if (depth === 1) { table = { classes: (/class\s*=\s*["']([^"']*)["']/i.exec(m[3]) || [])[1] || '', rows: [] }; tables.push(table); row = null; cell = null; section = ''; }
      } else {
        if (depth === 1) { closeCell(m.index); }
        if (depth > 0) depth--;
        if (depth === 0) { table = null; row = null; }
      }
      continue;
    }
    if (depth !== 1 || !table) continue;
    if (tag === 'thead' || tag === 'tbody' || tag === 'tfoot') { if (!closing) section = tag; closeCell(m.index); continue; }
    if (tag === 'tr') {
      closeCell(m.index);
      if (!closing) { row = { head: section === 'thead', cells: [] }; table.rows.push(row); } else row = null;
      continue;
    }
    // th / td
    if (!closing) {
      closeCell(m.index);
      if (!row) { row = { head: section === 'thead', cells: [] }; table.rows.push(row); }
      cell = { tag, html: '', start: m.index + m[0].length, colspan: attrNum(m[3], 'colspan'), rowspan: attrNum(m[3], 'rowspan') };
      row.cells.push(cell);
    } else closeCell(m.index);
  }
  tables.forEach(t => t.rows = t.rows.filter(r => r.cells.length));
  return tables;
}

// Assign grid coordinates (row, col) accounting for colspan / rowspan; returns the width of every row.
function layoutGrid(table) {
  const occupied = []; // occupied[r] = Set of columns taken by a rowspan from above
  const widths = [];
  table.rows.forEach((row, r) => {
    occupied[r] = occupied[r] || new Set();
    let col = 0;
    row.cells.forEach(cell => {
      while (occupied[r].has(col)) col++;
      cell.row = r; cell.col = col;
      for (let dr = 1; dr < cell.rowspan; dr++) {
        occupied[r + dr] = occupied[r + dr] || new Set();
        for (let dc = 0; dc < cell.colspan; dc++) occupied[r + dr].add(col + dc);
      }
      col += cell.colspan;
    });
    while (occupied[r].has(col)) col++;
    widths.push(col);
  });
  return widths;
}

// ------------------------------------------------------------------ per-cell rules

const VAR_LETTERS = 'XYZxyznkpt';
const FN_RE = /^(?:[PEV]|Var|Cov|σ)\s*\(.*\)$/;                       // P(X=x), E(X), V(X), P(0≤Z≤z)
const BARE_SYMBOL_RE = new RegExp('^[0-9' + VAR_LETTERS + '+\\-−×÷*/=<>≤≥≠∩∪^_(),.\\s]+$');
const HAS_VAR_RE = new RegExp('[' + VAR_LETTERS + ']');

function isMathValueText(raw) {
  // another cell of the table that is clearly math/numeric data: $…$, or a bare number / slash number
  if (/\$/.test(raw)) return true;
  const t = plainText(raw);
  return /^[-+−]?\d+(?:[.,]\d+)?(?:\s*\/\s*\d+)?%?$/.test(t);
}

function checkCellText(rawCellHtml) {
  const rules = [];
  // PAREN_MATH_IN_CELL
  if (/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/.test(rawCellHtml)) rules.push(['PAREN_MATH_IN_CELL', 'math written with \\( \\) / \\[ \\] inside a table cell']);
  // UNBALANCED_DOLLAR
  const noEsc = rawCellHtml.replace(/\\\$/g, '').replace(/\$\$[\s\S]*?\$\$/g, '');
  const dollars = (noEsc.match(/\$/g) || []).length;
  if (dollars % 2 === 1) rules.push(['UNBALANCED_DOLLAR', 'odd number of $ in the cell']);
  // SLASH_FRACTION_OUTSIDE_MATH
  const outside = decodeEntities(stripMath(rawCellHtml).replace(/<[^>]*>/g, ' '));
  const slash = /(?<![\d/.:])(\d+)\s*\/\s*(\d+)(?![\d/:]|\.\d)/g;
  let sm;
  while ((sm = slash.exec(outside))) {
    // dates such as 2024/11/09 and 11/09 next to another number group are excluded by the lookarounds above;
    // also a bare yyyy/m or m/d pair preceded by a 4-digit year is not a fraction
    if (/^\d{4}$/.test(sm[1]) && sm[2].length <= 2) continue;
    rules.push(['SLASH_FRACTION_OUTSIDE_MATH', `"${sm[0]}" is not inside $…$`]);
    break;
  }
  return rules;
}

function bareVariableKind(rawCellHtml) {
  // returns 'function' | 'expression' | 'letter' | null for text that is a math symbol written outside $…$
  if (/\$/.test(rawCellHtml)) return null;
  const t = plainText(rawCellHtml);
  if (!t || t.length > 24 || /[가-힣]/.test(t)) return null;
  if (/^[A-F]$/.test(t)) return null;                                 // names / labels
  if (FN_RE.test(t)) return 'function';
  if (!BARE_SYMBOL_RE.test(t) || !HAS_VAR_RE.test(t)) return null;
  if (t.length === 1) return 'letter';
  if (/^[(\s]*[A-Za-z]+[)\s]*$/.test(t)) return null;                 // plain latin word such as "pt", "nk"
  return 'expression';
}

// ------------------------------------------------------------------ html -> findings

const PIPE_ROW = /^\s*\|.*\|\s*(\[[\d.]+\s*점\])?\s*$/;
const PIPE_SEP_ROW = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/;

// Groups of consecutive lines that still look like pipe-table rows after the engine ran.
function residualPipeGroups(html) {
  const outside = stripMath(String(html).replace(/<table\b[\s\S]*?<\/table\s*>/gi, ' '));
  const lines = outside.split(/\r?\n|\\n(?![a-zA-Z])|<br\s*\/?>/i);
  const isRow = (l) => PIPE_ROW.test(l) || PIPE_SEP_ROW.test(l);
  const groups = [];
  let cur = null;
  lines.forEach(l => {
    if (isRow(l)) { (cur = cur || []).push(l.trim()); } else { if (cur) groups.push(cur); cur = null; }
  });
  if (cur) groups.push(cur);
  // a lone pipe line is only a table remnant when it is a separator row (---|---)
  return groups.filter(g => g.length > 1 || PIPE_SEP_ROW.test(g[0]));
}
function residualPipeRows(html) { return residualPipeGroups(html).flat(); }

// Check one student-visible string. Returns [{ rule, table, cell, detail }].
function checkHtml(source) {
  const findings = [];
  const add = (rule, table, cell, detail) => findings.push({ rule, table, cell: excerpt(cell || ''), detail });
  let html;
  try { html = renderApTables(source); } catch (e) { add('ENGINE_EXCEPTION', -1, '', String(e && e.message || e)); return findings; }

  residualPipeGroups(html).forEach(g => add('RESIDUAL_PIPE_ROW', -1, g[0], `${g.length} pipe-table row(s) left unconverted`));

  const tables = extractTables(html);
  Object.defineProperty(findings, 'tableCount', { value: tables.length, enumerable: false });
  tables.forEach((table, ti) => {
    if (!table.rows.length) return;
    const widths = layoutGrid(table);
    if (new Set(widths).size > 1) {
      const r = widths.findIndex(w => w !== widths[0]);
      add('ROW_COL_MISMATCH', ti, table.rows[r].cells.map(c => c.html).join(' | '), `column counts per row: ${widths.join(',')}`);
    }
    const head = table.rows.filter(r => r.head);
    const headRows = head.length ? head : (table.rows[0].cells.every(c => c.tag === 'th') ? [table.rows[0]] : []);
    if (headRows.length && headRows.every(r => r.cells.every(c => !plainText(c.html) && !/<img\b/i.test(c.html)))) {
      add('EMPTY_HEADER', ti, '', 'every header cell is empty');
    }
    const cells = table.rows.flatMap(r => r.cells);
    cells.forEach(cell => {
      checkCellText(cell.html).forEach(([rule, detail]) => add(rule, ti, cell.html, detail));
      const kind = bareVariableKind(cell.html);
      if (!kind) return;
      if (kind === 'letter') {
        // a lone variable letter only counts when the same row or column carries math values
        const mates = cells.filter(o => o !== cell && (o.row === cell.row || o.col === cell.col));
        if (!mates.some(o => isMathValueText(o.html))) return;
      }
      add('BARE_MATH_VARIABLE_HEADER', ti, cell.html, `"${plainText(cell.html)}" must be written as $…$`);
    });
  });
  return findings;
}

// ------------------------------------------------------------------ exam files

const VISIBLE_FIELDS = ['content', 'question', 'stem', 'sharedMaterial', 'solution'];

function loadBank(file) {
  const w = {};
  vm.runInContext(fs.readFileSync(file, 'utf8'), vm.createContext({ window: w }), { timeout: 10000 });
  return Array.isArray(w.questionBank) ? w.questionBank : null;
}

function collectStrings(q) {
  const out = [];
  VISIBLE_FIELDS.forEach(f => { if (typeof q[f] === 'string') out.push([f, q[f]]); });
  if (Array.isArray(q.choices)) q.choices.forEach((c, i) => { if (typeof c === 'string') out.push([`choices[${i}]`, c]); });
  return out;
}

function checkFile(file) {
  const rel = path.relative(repoRoot, file).split(path.sep).join('/');
  const result = { file: rel, fails: [], skipped: null, strings: 0, tables: 0 };
  let bank;
  try { bank = loadBank(file); } catch (e) { result.skipped = 'LOAD_ERROR: ' + (e && e.message || e); return result; }
  if (!bank) { result.skipped = 'NO_QUESTION_BANK'; return result; }
  bank.forEach(q => {
    collectStrings(q).forEach(([field, text]) => {
      result.strings++;
      if (text.indexOf('|') === -1 && !/<table\b/i.test(text)) return;   // a table rule can only fire where a table (or pipe row) exists
      const found = checkHtml(text);
      result.tables += found.tableCount || 0;
      found.forEach(f => result.fails.push({ file: rel, qid: q.id, field, rule: f.rule, table: f.table, cell: f.cell, detail: f.detail }));
    });
  });
  return result;
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith('.js')) out.push(p);
  }
  return out;
}

function globToRegExp(g) {
  let re = '';
  for (let i = 0; i < g.length; i++) {
    const c = g[i];
    if (c === '*') { if (g[i + 1] === '*') { re += '.*'; i++; if (g[i + 1] === '/') i++; } else re += '[^/]*'; }
    else if (c === '?') re += '[^/]';
    else re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp('^' + re + '$');
}

// spec: path, directory, glob (repo-relative or relative to archive/exams), or a name fragment such as
// "h2/2final/25_금당고_2학기_기말_고2_확률과통계".
function resolveFiles(specs, all) {
  const rels = all.map(f => ({ f, rel: path.relative(repoRoot, f).split(path.sep).join('/') }));
  const picked = new Set();
  specs.forEach(spec => {
    const norm = spec.split(path.sep).join('/').replace(/^\.\//, '');
    const abs = path.resolve(norm);
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) { picked.add(abs); return; }
    if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) { walk(abs).forEach(f => picked.add(f)); return; }
    if (/[*?]/.test(norm)) {
      const re = globToRegExp(norm);
      const re2 = globToRegExp('archive/exams/' + norm);
      rels.forEach(({ f, rel }) => { if (re.test(rel) || re2.test(rel)) picked.add(f); });
      return;
    }
    const frag = norm.replace(/\.js$/, '');
    rels.forEach(({ f, rel }) => { const r = rel.replace(/\.js$/, ''); if (r === frag || r.endsWith('/' + frag)) picked.add(f); });
  });
  return [...picked].sort();
}

// ------------------------------------------------------------------ browser mode

function loadPlaywright() {
  const cands = [process.env.AP_PLAYWRIGHT_MODULE, 'playwright'];
  if (process.env.GEOMETRY_NODE_MODULES) cands.push(path.join(process.env.GEOMETRY_NODE_MODULES, 'playwright'));
  const sub = path.join('.tmp', 'apmath-visual-engine', 'dependencies', 'node_modules', 'playwright');
  cands.push(path.join(repoRoot, sub));
  try {
    const { execFileSync } = require('node:child_process');
    const common = execFileSync('git', ['rev-parse', '--git-common-dir'], { cwd: repoRoot, encoding: 'utf8' }).trim();
    cands.push(path.join(path.resolve(repoRoot, common, '..'), sub));
  } catch { /* not a git checkout */ }
  const tried = [];
  for (const c of cands.filter(Boolean)) {
    try { return require(c); } catch (e) { tried.push(c); }
  }
  throw new Error('playwright not found (set AP_PLAYWRIGHT_MODULE or GEOMETRY_NODE_MODULES); tried: ' + tried.join(', '));
}

function startServer() {
  const mime = { '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.html': 'text/html' };
  const server = http.createServer((req, res) => {
    try {
      let n = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (n.endsWith('/')) n += 'index.html';
      const p = path.resolve(repoRoot, '.' + n);
      if (!p.startsWith(repoRoot + path.sep) || !fs.existsSync(p) || !fs.statSync(p).isFile()) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'Content-Type': (mime[path.extname(p).toLowerCase()] || 'application/octet-stream') + '; charset=utf-8', 'Cache-Control': 'no-store' });
      fs.createReadStream(p).pipe(res);
    } catch (e) { res.writeHead(500); res.end(String(e)); }
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

// Runs in the page. Returns table-level defects of the rendered paper.
function inPageMeasure() {
  const out = { tables: 0, defects: [] };
  const label = (el) => {
    const host = el.closest('[data-source-ref]');
    return host ? host.getAttribute('data-source-ref') : null;
  };
  const text = (el) => (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 50);
  document.querySelectorAll('.ap-table').forEach((tbl, idx) => {
    out.tables++;
    const wrap = tbl.closest('.ap-table-wrap') || tbl.parentElement;
    const host = wrap.parentElement || wrap;
    const hs = getComputedStyle(host);
    const hostRect = host.getBoundingClientRect();
    const limit = hostRect.right - (parseFloat(hs.paddingRight) || 0);
    const tr = tbl.getBoundingClientRect();
    const where = label(tbl);
    if (tr.right > limit + 1 || wrap.scrollWidth > wrap.clientWidth + 1) {
      out.defects.push({ rule: 'TABLE_OVERFLOW', where, table: idx, detail: `table right ${Math.round(tr.right)}px > column right ${Math.round(limit)}px (wrap scrollWidth ${wrap.scrollWidth} > clientWidth ${wrap.clientWidth})`, cell: text(tbl) });
    }
    tbl.querySelectorAll('th,td').forEach(c => {
      if (c.scrollWidth > c.clientWidth + 1) out.defects.push({ rule: 'CELL_OVERFLOW', where, table: idx, detail: `cell scrollWidth ${c.scrollWidth} > clientWidth ${c.clientWidth}`, cell: text(c) });
    });
    const bad = tbl.querySelector('mjx-merror');
    if (bad) out.defects.push({ rule: 'MATH_ERROR', where, table: idx, detail: 'mjx-merror inside table: ' + (bad.getAttribute('data-mjx-error') || text(bad)), cell: text(tbl) });
  });
  return out;
}

async function browserCheck(files, opts) {
  const { chromium } = loadPlaywright();
  const server = await startServer();
  const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ channel: process.env.AP_CHROME_CHANNEL || 'chrome', headless: true });
  const results = [];
  try {
    for (const file of files) {
      const rel = path.relative(examsRoot, file).split(path.sep).join('/');
      for (const width of opts.widths) {
        for (const mode of opts.modes) {
          const rec = { file: path.relative(repoRoot, file).split(path.sep).join('/'), mode, width, status: 'PASS', tables: 0, placeholderImages: 0, fails: [], notRun: null };
          const page = await browser.newPage({ viewport: { width, height: 1000 } });
          const pageErrors = [];
          page.on('pageerror', e => pageErrors.push(String(e && e.message || e)));
          try {
            await page.route('**/api/**', r => r.abort());
            // Exam images live on Cloudflare R2 (CORS-closed to localhost). Serve them from archive/assets/images;
            // an image that is not in the repository gets a 1x1 placeholder so that it cannot block the table check.
            await page.route('https://img.wangjiedu.com/exams/images/**', route => {
              try {
                const key = decodeURIComponent(new URL(route.request().url()).pathname.slice('/exams/images/'.length));
                const f = path.resolve(imageRoot, ...key.split('/'));
                const inside = path.relative(imageRoot, f);
                if (inside && !inside.startsWith('..') && !path.isAbsolute(inside) && fs.existsSync(f) && fs.statSync(f).isFile()) {
                  const ext = path.extname(f).toLowerCase();
                  return route.fulfill({ status: 200, contentType: ({ '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml' })[ext] || 'application/octet-stream', body: fs.readFileSync(f), headers: { 'Access-Control-Allow-Origin': '*' } });
                }
              } catch { /* fall through to the placeholder */ }
              rec.placeholderImages++;
              return route.fulfill({ status: 200, contentType: 'image/png', body: PIXEL_PNG, headers: { 'Access-Control-Allow-Origin': '*' } });
            });
            await page.goto(`${base}/archive/engine.html?data=${encodeURIComponent('exams/' + rel)}&mode=${mode}&snapshotCache=0&prewarm=0`, { waitUntil: 'load', timeout: 60000 });
            await page.waitForFunction(() => (window.archiveScreenRuntime && window.archiveScreenRuntime.activeSnapshot) || /불러올 수 없습니다|오류가 발생했습니다/.test(document.body.innerText), undefined, { timeout: opts.timeoutMs });
            const blocked = await page.evaluate(() => (window.archiveScreenRuntime && window.archiveScreenRuntime.activeSnapshot) ? '' : document.body.innerText.replace(/s+/g, ' ').slice(0, 200));
            if (blocked) throw Object.assign(new Error('page did not render (unrelated to tables): ' + blocked), { notRun: true });
            const idle = await page.evaluate(() => window.archiveScreenRuntime.whenIdle());
            if (!idle || idle.ok === false) throw Object.assign(new Error('render not idle-ok: ' + JSON.stringify(idle).slice(0, 300)), { notRun: true });
            await page.evaluate(async () => {
              if (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise) await window.MathJax.startup.promise;
              if (window.MathJax && window.MathJax.typesetPromise) await window.MathJax.typesetPromise();
              if (document.fonts && document.fonts.ready) await document.fonts.ready;
            });
            const m = await page.evaluate(inPageMeasure);
            rec.tables = m.tables;
            rec.fails = m.defects.map(d => ({ file: rec.file, mode, width, ...d }));
            if (rec.fails.length) rec.status = 'FAIL';
          } catch (e) {
            rec.status = 'NOT_RUN';
            rec.notRun = String(e && e.message || e).split('\n')[0].slice(0, 400) + (pageErrors.length ? ` | pageerror: ${pageErrors[0].slice(0, 200)}` : '');
          } finally { await page.close(); }
          results.push(rec);
        }
      }
    }
  } finally { await browser.close(); server.close(); }
  return results;
}

// ------------------------------------------------------------------ CLI

function parseArgs(argv) {
  const o = { files: [], json: null, browser: false, modes: ['exam', 'sol'], widths: [1440], timeoutMs: 120000, quiet: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const val = () => argv[++i];
    if (a === '--json') o.json = val();
    else if (a === '--browser') o.browser = true;
    else if (a === '--quiet') o.quiet = true;
    else if (a === '--files') { while (i + 1 < argv.length && !argv[i + 1].startsWith('--')) o.files.push(...argv[++i].split(',').map(s => s.trim()).filter(Boolean)); }
    else if (a === '--modes') o.modes = val().split(',');
    else if (a === '--widths') o.widths = val().split(',').map(Number);
    else if (a === '--timeout-ms') o.timeoutMs = Number(val());
    else if (a === '-h' || a === '--help') o.help = true;
    else throw new Error('unknown argument: ' + a);
  }
  return o;
}

function summarize(fails) {
  const byRule = {};
  fails.forEach(f => { (byRule[f.rule] = byRule[f.rule] || []).push(f); });
  return byRule;
}

async function main() {
  let opts;
  try { opts = parseArgs(process.argv.slice(2)); } catch (e) { console.error(e.message); process.exit(2); }
  if (opts.help) { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^[\s\S]*?\/\*/, '')); return; }
  const all = walk(examsRoot).sort();
  let files = all;
  if (opts.files.length) {
    files = resolveFiles(opts.files, all);
    if (!files.length) { console.error('no exam file matches: ' + opts.files.join(', ')); process.exit(2); }
  }
  if (opts.browser && !opts.files.length) { console.error('--browser needs --files (browser mode checks only the files you name)'); process.exit(2); }

  const perFile = files.map(checkFile);
  const fails = perFile.flatMap(r => r.fails);
  const skipped = perFile.filter(r => r.skipped).map(r => ({ file: r.file, reason: r.skipped }));
  const out = {
    generatedAt: new Date().toISOString(),
    static: {
      filesScanned: perFile.length - skipped.length,
      filesSkipped: skipped,
      tablesChecked: perFile.reduce((n, r) => n + r.tables, 0),
      failCount: fails.length,
      countsByRule: Object.fromEntries(Object.entries(summarize(fails)).map(([k, v]) => [k, v.length])),
      fails
    }
  };
  let browserFailed = false;
  if (opts.browser) {
    try {
      const rec = await browserCheck(files, opts);
      out.browser = { modes: opts.modes, widths: opts.widths, results: rec, notRun: rec.filter(r => r.status === 'NOT_RUN').map(r => ({ file: r.file, mode: r.mode, width: r.width, reason: r.notRun })) };
      browserFailed = rec.some(r => r.status === 'FAIL');
    } catch (e) {
      out.browser = { error: String(e && e.message || e), results: [], notRun: files.map(f => ({ file: path.relative(repoRoot, f).split(path.sep).join('/'), reason: 'BROWSER_UNAVAILABLE: ' + String(e && e.message || e).slice(0, 200) })) };
    }
  }
  if (opts.json) {
    fs.mkdirSync(path.dirname(path.resolve(opts.json)), { recursive: true });
    fs.writeFileSync(opts.json, JSON.stringify(out, null, 2));
  }

  // text summary
  const lines = [];
  lines.push(`static: ${out.static.filesScanned} files scanned, ${skipped.length} skipped, ${out.static.tablesChecked} tables, ${fails.length} FAIL`);
  Object.entries(summarize(fails)).forEach(([rule, list]) => {
    lines.push(`  ${rule}: ${list.length}`);
    if (!opts.quiet) list.slice(0, 3).forEach(f => lines.push(`    ${f.file} qid ${f.qid} ${f.field} table#${f.table} "${f.cell}" (${f.detail})`));
  });
  if (out.browser) {
    lines.push('browser:');
    if (out.browser.error) lines.push('  NOT_RUN: ' + out.browser.error);
    (out.browser.results || []).forEach(r => {
      lines.push(`  ${r.status} ${r.file} mode=${r.mode} w=${r.width} tables=${r.tables}${r.notRun ? ' NOT_RUN: ' + r.notRun : ''}`);
      r.fails.slice(0, 5).forEach(f => lines.push(`    ${f.rule} ${f.where || ''} table#${f.table} "${f.cell}" (${f.detail})`));
    });
  }
  console.log(lines.join('\n'));
  process.exit(fails.length || browserFailed ? 1 : 0);
}

module.exports = { inPageMeasure, checkHtml, checkFile, extractTables, layoutGrid, residualPipeRows, resolveFiles, RULES, BROWSER_RULES };
if (require.main === module) main().catch(e => { console.error(e); process.exit(2); });

// 시험지별 해설 그림 장부 공용 읽기·쓰기(Node). 규칙은 figure_ledger.py와 같다(그 파일 머리 설명 참고).
// 직렬화: JSON.stringify(v, null, 2) + '\n' — Python json.dumps(indent=2, ensure_ascii=False)와 바이트가 같다.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const LEDGER_REL = 'archive/tools/geometry-equation/production/exam-figure-ledger';
const LEGACY_REL = 'archive/tools/geometry-equation/production/exam-figure-ledger.json';
const META_NAME = '_meta.json';
const SRC_PREFIX = 'archive/exams/original/';
const TERMINAL = new Set(['PUBLISHED', 'EXEMPT']);

function repoRoot(start = process.cwd()) {
  const ok = p => fs.existsSync(path.join(p, '.git')) && fs.existsSync(path.join(p, 'archive/tools/geometry-equation/visual-browser-runtime.mjs'));
  if (process.env.APMS_ROOT) { const p = path.resolve(process.env.APMS_ROOT); if (!ok(p)) throw new Error('Invalid APMS_ROOT: ' + p); return p; }
  for (const base of [path.resolve(start), __dirname]) {
    for (let p = base; ; p = path.dirname(p)) { if (ok(p)) return p; if (path.dirname(p) === p) break; }
  }
  throw new Error('Repository root not found; set APMS_ROOT');
}
const ledgerDir = (root = repoRoot()) => path.join(root, LEDGER_REL);
function relPath(src) {
  if (typeof src !== 'string' || !src.startsWith(SRC_PREFIX) || !src.endsWith('.js')) throw new Error('src must be ' + SRC_PREFIX + '...js: ' + src);
  const rel = src.slice(SRC_PREFIX.length, -3), parts = rel.split('/');
  if (parts.some(p => p === '' || p === '.' || p === '..' || p.includes('\\')) || parts.at(-1) === '_meta') throw new Error('invalid src path: ' + src);
  return rel + '.json';
}
const examPath = (src, root) => path.join(ledgerDir(root), relPath(src));
const dumps = obj => Buffer.from(JSON.stringify(obj, null, 2) + '\n', 'utf8');
const parse = buf => JSON.parse(buf.toString('utf8').replace(/^﻿/, ''));
const ordId = o => String(o);
const isTerminal = it => TERMINAL.has(it.state);

function checkEntry(e, rel) {
  if (!e || typeof e !== 'object') throw new Error('exam entry must be an object');
  for (const k of ['exam', 'src', 'items', 'status']) if (!(k in e)) throw new Error(`${e.exam}: missing ${k}`);
  const want = relPath(e.src);
  if (rel !== undefined && rel !== want) throw new Error(`${e.exam}: file ${rel} does not match src (${want})`);
  if (path.posix.basename(e.src, '.js') !== e.exam) throw new Error(`${e.exam}: exam name differs from src file name`);
  if (e.status !== 'OPEN' && e.status !== 'CLOSED') throw new Error(`${e.exam}: status must be OPEN or CLOSED`);
  if (!Array.isArray(e.items)) throw new Error(`${e.exam}: items must be a list`);
  const seen = new Set();
  for (const it of e.items) {
    if (!it || typeof it !== 'object' || !('ord' in it) || !('state' in it)) throw new Error(`${e.exam}: item without ord/state`);
    if (seen.has(ordId(it.ord))) throw new Error(`${e.exam}: duplicate ord ${it.ord}`);
    seen.add(ordId(it.ord));
  }
  if (e.status === 'CLOSED') { const bad = e.items.filter(it => !isTerminal(it)).map(it => it.ord); if (bad.length) throw new Error(`${e.exam}: CLOSED with unresolved items ${bad}`); }
}
function guardChange(prev, e, allowDemote = []) {
  if (!prev) return;
  const allowed = new Set(allowDemote.map(ordId)), now = new Map(e.items.map(it => [ordId(it.ord), it]));
  for (const it of prev.items) {
    const k = ordId(it.ord), n = now.get(k);
    if (!n) throw new Error(`${e.exam} q${it.ord}: existing item would be removed`);
    if (it.state === 'PUBLISHED' && n.state !== 'PUBLISHED' && !allowed.has(k)) throw new Error(`${e.exam} q${it.ord}: PUBLISHED would become ${n.state} (pass the ord explicitly to demote)`);
  }
}
function atomicWrite(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = path.join(path.dirname(file), `.${path.basename(file, '.json')}.${process.pid}.${Date.now()}.part`);
  fs.writeFileSync(tmp, data);
  try { fs.renameSync(tmp, file); } catch (err) { try { fs.unlinkSync(tmp); } catch {} throw err; }
}
function loadExam(src, root = repoRoot()) {
  const p = examPath(src, root);
  if (!fs.existsSync(p)) return null;
  const e = parse(fs.readFileSync(p)); checkEntry(e, relPath(src)); return e;
}
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, d.name); if (d.isDirectory()) walk(p, out); else out.push(p); }
  return out;
}
function examFiles(root = repoRoot()) {
  const d = ledgerDir(root);
  return walk(d).filter(p => p.endsWith('.json') && path.relative(d, p).split(path.sep).join('/') !== META_NAME).sort();
}
function findExam(name, root = repoRoot()) {
  if (typeof name !== 'string' || !name || /[\\/]/.test(name) || name === '.' || name === '..') throw new Error('invalid exam name: ' + name);
  const d = ledgerDir(root), hits = examFiles(root).filter(p => path.basename(p) === name + '.json');
  if (hits.length > 1) throw new Error(name + ': found in several folders');
  if (!hits.length) return null;
  const e = parse(fs.readFileSync(hits[0])); checkEntry(e, path.relative(d, hits[0]).split(path.sep).join('/')); return e;
}
function saveExam(e, root = repoRoot(), { allowDemote = [] } = {}) {
  checkEntry(e);
  const prev = loadExam(e.src, root);
  if (prev && prev.exam !== e.exam) throw new Error(e.src + ': exam name changed');
  guardChange(prev, e, allowDemote);
  const p = examPath(e.src, root), data = dumps(e);
  if (fs.existsSync(p) && fs.readFileSync(p).equals(data)) return p;
  atomicWrite(p, data); return p;
}
function settleStatus(e) {
  if (e.items.some(it => !isTerminal(it))) { if (e.status === 'CLOSED' && e.closedBy != null) e.closedBy = null; e.status = 'OPEN'; }
  return e;
}
function upsertItem(src, ord, patch, root = repoRoot(), { allowDemote = false } = {}) {
  const e = loadExam(src, root);
  if (!e) throw new Error(src + ': not in ledger');
  if ('ord' in patch && ordId(patch.ord) !== ordId(ord)) throw new Error('patch cannot change ord');
  const i = e.items.findIndex(it => ordId(it.ord) === ordId(ord));
  if (i >= 0) e.items[i] = { ...e.items[i], ...patch }; else e.items.push({ ord, ...patch });
  settleStatus(e);
  return saveExam(e, root, { allowDemote: allowDemote ? [ord] : [] });
}
function assemble(meta, entries) {
  if ('exams' in meta) throw new Error('_meta.json must not contain exams');
  return { ...meta, exams: entries.sort((a, b) => (a.src < b.src ? -1 : a.src > b.src ? 1 : 0)) };
}
function loadAll(root = repoRoot()) {
  const d = ledgerDir(root), meta = parse(fs.readFileSync(path.join(d, META_NAME)));
  return assemble(meta, examFiles(root).map(p => { const e = parse(fs.readFileSync(p)); checkEntry(e, path.relative(d, p).split(path.sep).join('/')); return e; }));
}
const git = (root, args, input) => execFileSync('git', ['-c', 'core.quotepath=off', ...args], { cwd: root, input, maxBuffer: 1 << 30 });
function catFiles(root, specs) {
  if (!specs.length) return [];
  const raw = git(root, ['cat-file', '--batch'], specs.map(s => s + '\n').join('')), out = [];
  let pos = 0;
  for (const s of specs) {
    const nl = raw.indexOf(10, pos), head = raw.subarray(pos, nl).toString().split(' ');
    if (head.length !== 3 || head[1] !== 'blob') throw new Error('cannot read ' + s);
    const size = Number(head[2]); out.push(raw.subarray(nl + 1, nl + 1 + size)); pos = nl + 1 + size + 1;
  }
  return out;
}
// 커밋 하나의 장부 전체(새 형식, 없으면 옛 한 파일). only=[src...]를 주면 그 시험지만 읽는다.
function loadAllAt(rev, root = repoRoot(), { only = null } = {}) {
  const names = git(root, ['ls-tree', '-r', '-z', '--name-only', rev, '--', LEDGER_REL + '/']).toString('utf8').split('\0').filter(Boolean);
  if (names.length) {
    const want = only && new Set([META_NAME, ...only.map(relPath)]);
    const pick = names.filter(n => n.endsWith('.json') && (!want || want.has(n.slice(LEDGER_REL.length + 1))));
    let meta = null; const entries = [];
    catFiles(root, pick.map(n => `${rev}:${n}`)).forEach((b, i) => {
      const rel = pick[i].slice(LEDGER_REL.length + 1);
      if (rel === META_NAME) meta = parse(b); else { const e = parse(b); checkEntry(e, rel); entries.push(e); }
    });
    if (!meta) throw new Error(rev + ': ' + META_NAME + ' missing');
    return assemble(meta, entries);
  }
  const legacy = parse(catFiles(root, [`${rev}:${LEGACY_REL}`])[0]);
  if (only) { const s = new Set(only); legacy.exams = legacy.exams.filter(e => s.has(e.src)); }
  return legacy;
}
module.exports = { LEDGER_REL, LEGACY_REL, META_NAME, SRC_PREFIX, TERMINAL, repoRoot, ledgerDir, relPath, examPath, dumps, parse, ordId, isTerminal,
  checkEntry, guardChange, loadExam, findExam, saveExam, settleStatus, upsertItem, examFiles, loadAll, loadAllAt, catFiles };

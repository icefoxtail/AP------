#!/usr/bin/env node
// Read-only report: for every question whose source fingerprint no longer matches
// the canonical metadata, find the old source (the git blob that reproduces the
// recorded sourceFingerprint) and classify what changed with source-delta.mjs.
// Writes ONE json file outside the repository and nothing inside it.
//
//   node archive/tools/meta-foundation/source-delta-report.mjs --out <file.json>
//        [--scope original/middle/m3/1mid] [--limit <exam files>] [--ref HEAD] [--root <repo>]
//
// --scope  path prefix relative to archive/exams (an "archive/exams/" prefix is accepted)
// --limit  process only the first N exam files (sorted) that have stale questions
// --ref    git ref whose history is searched for old blobs (default HEAD)
// Git is called twice per stale exam: one `git log --raw`, one `git cat-file --batch`.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { classify, fingerprints, CLASSES, REPLACED_RECALL_THRESHOLD } from './source-delta.mjs';

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const UNDETERMINED = ['NO_PRIOR_BLOB', 'ORDINAL_MISMATCH', 'SOURCE_MISSING'];

export function parseArgs(argv) {
  const opts = { scope: '', limit: Infinity, ref: 'HEAD', root: DEFAULT_ROOT, out: null };
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i], value = argv[i + 1];
    if (!['--scope', '--limit', '--out', '--ref', '--root'].includes(key)) throw new Error(`unknown argument: ${key}`);
    if (value == null || value.startsWith('--')) throw new Error(`${key} needs a value`);
    i++;
    if (key === '--scope') opts.scope = value.replace(/\\/g, '/').replace(/^archive\/exams\//, '').replace(/^\/+|\/+$/g, '');
    else if (key === '--limit') { opts.limit = Number(value); if (!Number.isInteger(opts.limit) || opts.limit < 1) throw new Error('--limit must be a positive integer'); }
    else if (key === '--out') opts.out = value;
    else if (key === '--ref') opts.ref = value;
    else opts.root = path.resolve(value);
  }
  return opts;
}

// The report is evidence, not source: refuse any output path inside the repository.
export function resolveOutputPath(out, root) {
  const target = path.resolve(out || path.join(os.tmpdir(), `source-delta-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`));
  const rel = path.relative(path.resolve(root), target);
  const inside = rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
  if (inside) throw new Error(`output path is inside the repository (${target}); choose a path outside it`);
  return target;
}

export function loadBank(text, name = 'source') {
  const sandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(sandbox);
  vm.runInContext(text, sandbox, { filename: name, timeout: 8000 });
  const bank = sandbox.window.questionBank || sandbox.window.questions || sandbox.questionBank || sandbox.questions || sandbox.window.examData?.questions;
  if (!Array.isArray(bank) || !bank.length) throw new Error('SOURCE_BANK_MISSING');
  return JSON.parse(JSON.stringify(bank));
}

function git(root, args, input) {
  const r = spawnSync('git', args, { cwd: root, input, maxBuffer: 512 * 1024 * 1024 });
  if (r.error || r.status !== 0) throw new Error(`git ${args[0]} failed: ${r.error?.message || String(r.stderr)}`);
  return r.stdout;
}

// Newest-first unique blob ids that ever held this path.
export function historyBlobs(root, ref, rel) {
  const log = git(root, ['log', ref, '--format=%H', '--raw', '--no-abbrev', '--no-renames', '--', rel]).toString('utf8');
  const blobs = [];
  for (const line of log.split('\n')) {
    const m = line.match(/^:\d+ \d+ [0-9a-f]{40} ([0-9a-f]{40}) [AM]\t/);
    if (m && !blobs.includes(m[1])) blobs.push(m[1]);
  }
  return blobs;
}

// One `git cat-file --batch` for all blobs of one exam.
export function readBlobs(root, ids) {
  if (!ids.length) return new Map();
  const buf = git(root, ['cat-file', '--batch'], ids.join('\n') + '\n');
  const out = new Map();
  let pos = 0;
  for (const id of ids) {
    const nl = buf.indexOf(10, pos);
    const header = buf.slice(pos, nl).toString('utf8').split(' ');
    if (header[1] !== 'blob') { pos = nl + 1; continue; }
    const size = Number(header[2]);
    out.set(id, buf.slice(nl + 1, nl + 1 + size).toString('utf8'));
    pos = nl + 1 + size + 1;
  }
  return out;
}

const bump = (map, key) => { map[key] = (map[key] || 0) + 1; };
const groupOf = (file, depth) => file.split('/').slice(0, depth).join('/');

export function buildReport(opts) {
  const { root, ref, scope, limit } = opts;
  const meta = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/question_metadata.json'), 'utf8'));
  const byFile = new Map();
  for (const r of meta.records) {
    if (typeof r.sourceArchiveFile !== 'string' || !r.sourceArchiveFile.startsWith(scope)) continue;
    if (!byFile.has(r.sourceArchiveFile)) byFile.set(r.sourceArchiveFile, []);
    byFile.get(r.sourceArchiveFile).push(r);
  }
  const rows = [];
  const totals = { files: 0, filesWithStale: 0, records: 0, fresh: 0, stale: 0, byClass: {} };
  const byExam = {}, byTerm = {}, byGrade = {};
  const note = (file, cls) => {
    for (const [bag, key] of [[byExam, file], [byTerm, groupOf(file, 4)], [byGrade, groupOf(file, 3)]]) {
      bag[key] = bag[key] || { stale: 0, byClass: {} };
      bag[key].stale++; bump(bag[key].byClass, cls);
    }
    bump(totals.byClass, cls);
  };

  let processed = 0;
  for (const file of [...byFile.keys()].sort()) {
    const records = byFile.get(file);
    totals.files++; totals.records += records.length;
    let bank = null, missing = false;
    try { bank = loadBank(fs.readFileSync(path.join(root, 'archive/exams', file), 'utf8'), file); } catch { missing = true; }
    const stale = [];
    for (const r of records) {
      const q = bank?.[r.sourceOrdinal - 1];
      if (!q) { stale.push({ r, q: null }); continue; }
      const fp = fingerprints(q);
      const isStale = fp.sourceFingerprint !== r.sourceFingerprint || (r.contentFingerprint != null && fp.contentFingerprint !== r.contentFingerprint);
      if (isStale) stale.push({ r, q }); else totals.fresh++;
    }
    if (!stale.length) continue;
    if (processed >= limit) break;
    processed++; totals.filesWithStale++; totals.stale += stale.length;

    let history = null; // lazy: [{id, bank}] newest first
    const old = () => {
      if (history) return history;
      history = [];
      const ids = historyBlobs(root, ref, `archive/exams/${file}`);
      const texts = readBlobs(root, ids);
      for (const id of ids) {
        try { history.push({ id, bank: loadBank(texts.get(id), id) }); } catch { /* blob that does not evaluate cannot be the old source */ }
      }
      return history;
    };

    for (const { r, q } of stale) {
      const row = { questionUid: r.questionUid, file, ordinal: r.sourceOrdinal };
      if (missing) row.class = 'SOURCE_MISSING';
      else if (!q) row.class = 'ORDINAL_MISMATCH';
      else {
        let found = null;
        for (const h of old()) {
          const candidate = h.bank[r.sourceOrdinal - 1];
          if (candidate && fingerprints(candidate).sourceFingerprint === r.sourceFingerprint) { found = { h, candidate }; break; }
        }
        if (!found) {
          // The recorded text exists in history but at another position: the slot moved.
          const moved = old().some(h => h.bank.some(c => fingerprints(c).sourceFingerprint === r.sourceFingerprint));
          row.class = moved ? 'ORDINAL_MISMATCH' : 'NO_PRIOR_BLOB';
        } else {
          const verdict = classify(found.candidate, q);
          row.class = verdict.class;
          row.changed = verdict.changed;
          row.stemRecall = verdict.stemRecall;
          row.oldBlob = found.h.id.slice(0, 12);
          row.bankLength = { old: found.h.bank.length, new: bank.length };
        }
      }
      rows.push(row);
      note(file, row.class);
    }
  }
  return {
    schema: 'source-delta-report-v1',
    generatedAt: new Date().toISOString(),
    ref, scope, limit: Number.isFinite(limit) ? limit : null,
    replacedRecallThreshold: REPLACED_RECALL_THRESHOLD,
    classes: [...CLASSES, ...UNDETERMINED],
    totals, byGrade, byTerm, byExam, rows,
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const out = resolveOutputPath(opts.out, opts.root);
  const report = buildReport(opts);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(report, null, 1) + '\n');
  const t = report.totals;
  console.log(`scope=${opts.scope || '(all)'} files=${t.files} records=${t.records} fresh=${t.fresh} stale=${t.stale}`);
  for (const [k, v] of Object.entries(t.byClass).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(18)} ${v}`);
  console.log(`report: ${out}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (e) { console.error(e.message); process.exit(1); }
}

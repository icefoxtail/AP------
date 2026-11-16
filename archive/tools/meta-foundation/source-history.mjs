// Read-only git history evidence shared by reports and opt-in rebind planning.
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { fingerprints } from './source-delta.mjs';

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

// Each invocation reads one exam with one log and one batch process. Callers
// cache this array per exam, rather than invoking it once per question.
export function loadExamHistory(root, ref, rel) {
  const ids = historyBlobs(root, ref, rel);
  const texts = readBlobs(root, ids);
  const history = [];
  for (const id of ids) {
    try { history.push({ id, bank: loadBank(texts.get(id), id) }); }
    catch { /* Invalid historical source cannot establish identity. */ }
  }
  return history;
}

// Only candidates obtained from loadExamHistory are evidence of git ancestry.
// This pure matcher does not authorize an arbitrary caller-supplied blob ID.
export function findHistoricalQuestion(history, row, { expectedCount } = {}) {
  const ordinal = row?.sourceOrdinal;
  if (!Number.isInteger(ordinal) || ordinal < 1) return { ok: false, reason: 'ORDINAL_MISMATCH' };
  for (const h of history) {
    const oldQuestion = h.bank[ordinal - 1];
    if (!oldQuestion || fingerprints(oldQuestion).sourceFingerprint !== row.sourceFingerprint) continue;
    if (expectedCount !== undefined && h.bank.length !== expectedCount)
      return { ok: false, reason: 'QUESTION_COUNT_MISMATCH', oldBlob: h.id, questionCount: h.bank.length };
    return { ok: true, reason: null, oldQuestion, oldBlob: h.id, sourceOrdinal: ordinal,
      questionCount: h.bank.length, questionUid: row.questionUid };
  }
  const moved = history.some(h => h.bank.some(q => fingerprints(q).sourceFingerprint === row.sourceFingerprint));
  return { ok: false, reason: moved ? 'ORDINAL_MISMATCH' : 'NO_PRIOR_BLOB' };
}

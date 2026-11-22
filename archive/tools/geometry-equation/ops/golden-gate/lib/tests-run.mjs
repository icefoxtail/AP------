// --tests: the engine's own node and python tests, run on base and head snapshots; a test that fails only on head is a failure.
// Nothing is skipped or quarantined here: a test that fails on both sides is printed as existing, with its count.
import fs from 'node:fs';
import path from 'node:path';
import {sha256, mkdirp, readJson, writeJson, run} from './util.mjs';
import {GE} from './kinds.mjs';
import {buildCodeGraph, closureOf} from './code-graph.mjs';
import {acquireSlot, childEnv} from './render.mjs';

const isNodeTest = f => /\.test\.(mjs|cjs|js)$/.test(f);
const isPyTest = f => /\/test_[^/]+\.py$/.test(f);

export function listTests(snap) {
  return snap.fileList.filter(f => f.startsWith(`${GE}/`) && (isNodeTest(f) || (f.startsWith(`${GE}/tests/`) && isPyTest(f)))).sort();
}

// A test is related to a change when the test's own import closure reaches a changed file.
// Changes to non-test files under tests/ (fixtures, helpers read by path) select every test.
export function selectTests({snaps, changed, all}) {
  const universe = new Set(); for (const s of snaps) for (const t of listTests(s)) universe.add(t);
  const tests = [...universe].sort();
  if (all) return {tests, reason: 'all (shared engine file changed, or --tests all)'};
  const changedSet = new Set(changed);
  const picked = new Set();
  for (const c of changed) if (c.startsWith(`${GE}/tests/`) && !isNodeTest(c) && !isPyTest(c)) return {tests, reason: `all (non-test file under tests/ changed: ${c})`};
  for (const s of snaps) {
    const graph = buildCodeGraph(s.dir, listTests(s));
    for (const t of listTests(s)) { if (changedSet.has(t)) picked.add(t); for (const f of closureOf(graph, t)) if (changedSet.has(f)) { picked.add(t); break; } }
  }
  return {tests: tests.filter(t => picked.has(t)), reason: 'tests whose import closure reaches a changed file'};
}

export const parseTapForTest = text => parseTap(text);
export const parseUnittestForTest = text => parseUnittest(text);
function parseTap(text) {
  const out = {};
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*(not ok|ok) \d+ - (.*?)(?:\s+# (SKIP|TODO)\b.*)?\s*$/);
    if (!m) continue;
    let name = m[2], n = 2;
    while (out[name]) name = `${m[2]} #${n++}`;
    out[name] = m[3] ? 'skip' : m[1] === 'ok' ? 'pass' : 'fail';
  }
  return out;
}
function parseUnittest(text) {
  const out = {};
  for (const line of text.split('\n')) {
    const m = line.match(/^(\S+) \((\S+)\)(?:\n)? \.\.\. (ok|FAIL|ERROR|skipped.*|expected failure|unexpected success)\s*$/) || line.match(/^(\S+) \((\S+)\) \.\.\. (ok|FAIL|ERROR|skipped.*|expected failure|unexpected success)\s*$/);
    if (!m) continue;
    out[m[2]] = m[3] === 'ok' || m[3] === 'expected failure' ? 'pass' : m[3].startsWith('skipped') ? 'skip' : 'fail';
  }
  return out;
}

export function fullKey(snap) {
  const f = path.join(snap.dir, '.snapshot-fullkey');
  try { return fs.readFileSync(f, 'utf8'); } catch { /* compute */ }
  const h = sha256(snap.fileList.map(x => x + '\0' + sha256(fs.readFileSync(path.join(snap.dir, x)))).join('\n'));
  fs.writeFileSync(f, h);
  return h;
}

async function runOne({snap, file, env, timeoutMs}) {
  const t0 = Date.now();
  let r, names;
  if (isNodeTest(file)) {
    r = await run(process.execPath, ['--test', '--test-reporter=tap', path.join(snap.dir, file)], {cwd: snap.dir, env, timeoutMs, lines: false});
    names = parseTap(r.stdout, file);
  } else {
    const dir = path.join(snap.dir, path.posix.dirname(file));
    r = await run(process.env.GEOMETRY_PYTHON || 'python', ['-X', 'utf8', '-m', 'unittest', 'discover', '-s', dir, '-t', dir, '-p', path.posix.basename(file), '-v'], {cwd: snap.dir, env, timeoutMs, lines: false});
    names = parseUnittest(r.stderr + '\n' + r.stdout);
  }
  const rec = {names, ms: Date.now() - t0, code: r.code, timedOut: r.timedOut || false};
  if (r.timedOut) names['<file timed out>'] = 'fail';
  else if (r.code !== 0 && !Object.values(names).includes('fail')) names[`<process exited with ${r.code}>`] = 'fail';
  if (!Object.keys(names).length) names['<no test result>'] = r.code === 0 ? 'skip' : 'fail';
  return rec;
}

export async function runTests({snap, files, resultsRoot, envKey, slots, lockDir, cacheRoot, depsDir, log = () => {}, timeoutMs = 15 * 60e3, noCache = false}) {
  const env = childEnv({cacheRoot, depsDir});
  const fk = fullKey(snap);
  const results = {}; const queue = [...files]; let done = 0;
  const worker = async () => {
    for (let file = queue.shift(); file; file = queue.shift()) {
      const key = sha256(`${fk}\n${envKey}\n${file}`);
      const cacheFile = path.join(resultsRoot, key.slice(0, 2), key + '.json');
      let rec = null;
      if (!noCache) { try { rec = readJson(cacheFile); rec.fromCache = true; } catch { rec = null; } }
      if (!rec) {
        const slot = await acquireSlot({lockDir, slots, log});
        try { rec = await runOne({snap, file, env, timeoutMs}); } finally { slot.release(); }
        mkdirp(path.dirname(cacheFile)); writeJson(cacheFile, rec);
      }
      results[file] = rec; done++;
      if (done % 10 === 0 || done === files.length) log(`  tests ${snap.id}: ${done}/${files.length} files`);
    }
  };
  await Promise.all(Array.from({length: Math.max(1, slots)}, worker));
  return results;
}

// base/head: {file: {names}} -> comparison by "file :: test name"
export function compareTests(base, head, files) {
  const flat = res => { const m = new Map(); for (const f of files) for (const [n, s] of Object.entries(res[f]?.names ?? {})) m.set(`${f.replace(`${GE}/`, '')} :: ${n}`, s); return m; };
  const b = flat(base), h = flat(head);
  const out = {newFailures: [], existingFailures: [], fixed: [], removed: [], counts: {base: {}, head: {}}};
  for (const [k, s] of h) {
    out.counts.head[s] = (out.counts.head[s] ?? 0) + 1;
    if (s === 'fail') (b.get(k) === 'fail' ? out.existingFailures : out.newFailures).push(k);
    else if (b.get(k) === 'fail') out.fixed.push(k);
  }
  for (const [k, s] of b) { out.counts.base[s] = (out.counts.base[s] ?? 0) + 1; if (!h.has(k)) { out.removed.push(k); } }
  return out;
}

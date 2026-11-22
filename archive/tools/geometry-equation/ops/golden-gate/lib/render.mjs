// Renders golden plans in a snapshot with the unchanged production runner (render-plan.mjs --manifest) and caches one result per item.
// - one Chrome and one python host serve a whole chunk (the runner's own reuse); results do not depend on chunking or order (checked by the gate's repeat check)
// - the render slot lock is the one production workers use (render.lock.<n> directories in RENDER_LOCK_DIR), kept alive by a heartbeat
// - a killed or timed-out run is resumed: items that already finished are harvested, the rest run again
import fs from 'node:fs';
import path from 'node:path';
import {sha256, mkdirp, readJson, writeJson, run, sleep} from './util.mjs';
import {GE} from './kinds.mjs';
import {resolveChrome} from './env-fingerprint.mjs';

const INFRA = /WORKER_TIMEOUT|WORKER_EXIT|WORKER_CANCELLED|Timeout \d+ms|timeout .*exceeded|ETIMEDOUT|ECONNRESET|Target (page|context|browser).*closed|browser has been closed|ENOMEM|EMFILE|spawn .* (EPERM|EAGAIN)/i;
export const isInfraFailure = r => r.status === 'FAILED' && INFRA.test(`${r.code ?? ''} ${r.detailFull ?? r.detail ?? ''}`);

// ---- slot lock ------------------------------------------------------------------------------------------------------
export async function acquireSlot({lockDir, slots, log = () => {}, pollMs = 5000}) {
  mkdirp(lockDir);
  for (;;) {
    for (let n = 0; n < slots; n++) {
      const dir = path.join(lockDir, `render.lock.${n}`);
      try {
        fs.mkdirSync(dir);
        fs.writeFileSync(path.join(dir, 'owner'), `golden-gate ${process.pid}`);
        const beat = setInterval(() => { try { const t = new Date(); fs.utimesSync(dir, t, t); } catch { /* released */ } }, 30000);
        beat.unref?.();
        return {dir, release() { clearInterval(beat); fs.rmSync(dir, {recursive: true, force: true}); }};
      } catch (e) {
        if (e.code !== 'EEXIST') throw e;
        try { if (Date.now() - fs.statSync(dir).mtimeMs > 20 * 60e3) fs.rmSync(dir, {recursive: true, force: true}); } catch { /* raced */ }
      }
    }
    log('waiting for a render slot...');
    await sleep(pollMs);
  }
}

// ---- result store ---------------------------------------------------------------------------------------------------
export const storeDir = (root, itemKey) => path.join(root, itemKey.slice(0, 2), itemKey);
export function loadResult(root, itemKey) {
  const dir = storeDir(root, itemKey);
  try {
    const r = readJson(path.join(dir, 'record.json'));
    if (r.svgSha) r.svgPath = path.join(dir, 'solution.svg');
    return r;
  } catch { return null; }
}
function saveResult(root, itemKey, record, svg) {
  const dir = mkdirp(storeDir(root, itemKey));
  if (svg) fs.writeFileSync(path.join(dir, 'solution.svg'), svg);
  const {svgPath, ...rest} = record;
  writeJson(path.join(dir, 'record.json'), rest);
}

// Read what render-plan wrote for one item.
function harvest(outDir, name) {
  const file = path.join(outDir, `${name}-result.json`);
  if (!fs.existsSync(file)) return null;
  const r = readJson(file);
  const svgFile = path.join(outDir, `${name}-solution.svg`);
  const svg = r.status === 'ARCHIVE_BOUND' && fs.existsSync(svgFile) ? fs.readFileSync(svgFile) : null;
  const rec = {
    item: name, status: r.status, stage: r.stage ?? null, code: r.code ?? null,
    detail: typeof r.detail === 'string' ? r.detail.slice(0, 300) : JSON.stringify(r.detail ?? null).slice(0, 300),
    detailFull: r.status === 'FAILED' ? String(r.detailFull ?? '').slice(0, 2000) : undefined,
    sizeClass: r.sizeClass ?? null, solutionImageScale: r.solutionImageScale ?? null,
    capability: r.capability ?? null, svgSha: svg ? sha256(svg) : null, svgBytes: svg ? svg.length : 0
  };
  if (r.status === 'ARCHIVE_BOUND' && !svg) { rec.status = 'FAILED'; rec.code = 'SVG_MISSING'; rec.detail = 'result says ARCHIVE_BOUND but no svg was written'; }
  return {rec, svg};
}

function attemptDurations(outDir) {
  const out = {};
  try {
    for (const line of fs.readFileSync(path.join(outDir, 'attempts.jsonl'), 'utf8').split('\n')) {
      if (!line.trim()) continue;
      const a = JSON.parse(line);
      if (a.kind === 'final') out[a.item] = a.durationMs;
    }
  } catch { /* no log */ }
  return out;
}

// One production process over a list of items (in a snapshot, holding one slot).
async function runChunk({snap, items, workRoot, tag, env, lockDir, slots, log, idleMs, totalMs}) {
  const packet = path.join(workRoot, tag, 'packet');
  const outDir = path.join(workRoot, tag, 'out');
  mkdirp(outDir);
  for (const it of items) {
    mkdirp(path.join(packet, it.dir));
    fs.copyFileSync(path.join(snap.dir, GE, 'ops/golden', it.dir, 'plan.json'), path.join(packet, it.dir, 'plan.json'));
  }
  fs.writeFileSync(`${packet}.manifest.json`, JSON.stringify({items}));
  const slot = await acquireSlot({lockDir, slots, log});
  const started = Date.now();
  let done = 0;
  try {
    const r = await run(process.execPath, [path.join(snap.dir, GE, 'production/render-plan.mjs'), '--manifest', packet, '--out', outDir], {
      cwd: snap.dir, env, idleMs, timeoutMs: totalMs,
      onLine: () => { done++; log(`  [${tag}] ${done}/${items.length} items finished`); }
    });
    // The runner exits 1 when some item FAILED (normal); a crash with a stack on stderr is worth showing (e.g. a file the snapshot lacks).
    if (r.stderr.trim() && !r.timedOut && /Error|ENOENT|Cannot find/.test(r.stderr)) log(`  [${tag}] render process exited ${r.code}: ${r.stderr.trim().split(/\r?\n/).slice(0, 6).join(' | ').slice(0, 600)}`);
    return {outDir, timedOut: r.timedOut, code: r.code, ms: Date.now() - started, stderr: r.stderr.slice(-1500)};
  } finally { slot.release(); }
}

export function childEnv({cacheRoot, depsDir}) {
  const tmp = mkdirp(path.join(cacheRoot, 'tmp'));
  const chrome = resolveChrome();
  const env = {
    ...process.env, TEMP: tmp, TMP: tmp, TMPDIR: tmp, PYTHONIOENCODING: 'utf-8',
    PYTHONPATH: path.join(depsDir, 'python'), GEOMETRY_WORKER_TIMEOUT_MS: process.env.GEOMETRY_WORKER_TIMEOUT_MS || '30000'
  };
  if (chrome && !env.GEOMETRY_BROWSER_EXECUTABLE) env.GEOMETRY_BROWSER_EXECUTABLE = chrome;
  return env;
}

// Render `itemDirs` of a snapshot. Returns {results: Map(dir -> record), stats}.
export async function renderItems({snap, itemDirs, resultsRoot, noCache = false, slots = 1, lockDir, chunkSize = 10, retries = 2, log = () => {}, cacheRoot, depsDir, idleMs = 20 * 60e3, totalMs = 150 * 60e3, label = 'render'}) {
  const byDir = new Map(snap.items.map(i => [i.dir, i]));
  const results = new Map();
  const stats = {cached: 0, rendered: 0, retried: 0, wallMs: 0, itemMs: {}, chunks: 0, timedOutChunks: 0};
  const t0 = Date.now();
  const todo = [];
  for (const d of itemDirs) {
    const it = byDir.get(d);
    const key = snap.itemKey(it);
    const hit = noCache ? null : loadResult(resultsRoot, key);
    if (hit && !(hit.status === 'FAILED' && isInfraFailure(hit))) { results.set(d, {...hit, fromCache: true}); stats.cached++; if (hit.durationMs) stats.itemMs[d] = hit.durationMs; }
    else todo.push(it);
  }
  const env = childEnv({cacheRoot, depsDir});
  const workRoot = mkdirp(path.join(cacheRoot, 'work', `${snap.id}-${Date.now().toString(36)}-${process.pid}`));
  const store = (it, rec, svg, ms) => {
    rec.durationMs = ms ?? null; if (ms) stats.itemMs[it.dir] = ms;
    saveResult(resultsRoot, snap.itemKey(it), rec, svg);
    results.set(it.dir, {...rec, svgPath: svg ? path.join(storeDir(resultsRoot, snap.itemKey(it)), 'solution.svg') : undefined, fromCache: false});
    stats.rendered++;
  };
  const runList = async (list, tagBase, concurrency) => {
    const count = Math.max(Math.ceil(list.length / chunkSize), Math.min(concurrency, list.length));
    const chunks = Array.from({length: count}, () => []);
    list.forEach((it, i) => chunks[i % count].push(it));
    const n = Math.min(concurrency, count);
    stats.chunks += count;
    const queue = chunks.map((c, i) => ({c, tag: `${tagBase}${i}`}));
    const worker = async () => {
      for (let job = queue.shift(); job; job = queue.shift()) {
        const r = await runChunk({snap, items: job.c, workRoot, tag: job.tag, env, lockDir, slots, log, idleMs, totalMs});
        if (r.timedOut) { stats.timedOutChunks++; log(`  [${job.tag}] chunk ${r.timedOut} timeout, harvesting finished items`); }
        const dur = attemptDurations(r.outDir);
        for (const it of job.c) {
          const h = harvest(r.outDir, it.dir);
          if (h) store(it, h.rec, h.svg, dur[it.dir]);
        }
      }
    };
    await Promise.all(Array.from({length: n}, worker));
  };
  if (todo.length) {
    log(`${label}: ${todo.length} to render (${stats.cached} cached) in ${snap.id}`);
    await runList(todo, 'c', slots);
    // items that did not finish, or whose failure is the machine's (timeouts under load): again one at a time
    for (let attempt = 1; attempt <= retries; attempt++) {
      const again = todo.filter(it => !results.has(it.dir) || (results.get(it.dir).status === 'FAILED' && isInfraFailure(results.get(it.dir))));
      if (!again.length) break;
      log(`${label}: retrying ${again.length} item(s) alone (attempt ${attempt}): ${again.map(i => i.dir).join(' ')}`);
      for (const it of again) { stats.retried++; results.delete(it.dir); await runList([it], `r${attempt}-${it.dir}-`, 1); const r = results.get(it.dir); if (r) r.retried = attempt; }
    }
  }
  for (const d of itemDirs) if (!results.has(d)) results.set(d, {item: d, status: 'NOT_RUN', code: 'NOT_RUN', detail: 'render process produced no result (killed, timed out or crashed)'});
  stats.wallMs = Date.now() - t0;
  try { fs.rmSync(workRoot, {recursive: true, force: true}); } catch { /* keep */ }
  return {results, stats};
}

// Old run folders of the engine (.tmp/archive/<runId>, ~1.4 MB per item) are never needed again.
export function pruneSnapshotRuns(snapDir, maxAgeMs = 60 * 60e3) {
  const dir = path.join(snapDir, '.tmp/archive');
  if (!fs.existsSync(dir)) return 0;
  let n = 0;
  for (const e of fs.readdirSync(dir)) {
    const p = path.join(dir, e);
    try { if (Date.now() - fs.statSync(p).mtimeMs > maxAgeMs) { fs.rmSync(p, {recursive: true, force: true}); n++; } } catch { /* in use */ }
  }
  return n;
}

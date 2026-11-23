// Order check: does a figure come out the same whatever was drawn before it in the same production process?
// One render-plan process keeps one python host and one Chrome across its items, so module-level state (the solid observer's YAW/VIEW/SCREEN_*, a cache,
// a global) could leak from one item into the next. This check renders a few golden plans in several orders, one process per order, and compares every
// item with the same item rendered with the reuse switched off (GEOMETRY_WORKER_REUSE=0 and GEOMETRY_BROWSER_REUSE=0: a fresh python and Chrome per request).
// It uses the unchanged production runner on a snapshot, like the gate (no engine code is imported here).
import fs from 'node:fs';
import path from 'node:path';
import {mkdirp, run, sha256} from './util.mjs';
import {GE} from './kinds.mjs';
import {acquireSlot, childEnv, harvest} from './render.mjs';

// Solids that differ in what the projection and the observer have to do: yaw 0 (plan.view), default yaw, a net (unfolded), a round solid, a cut prism, a composite of panels with a net.
export const DEFAULT_SOLIDS = ['item152solidcolor', 'item64g1', 'item47', 'item22', 'item52', 'item110g15'];
// One graph, one construction (plane marks), one statistics chart: nothing of the solid code runs for them.
export const DEFAULT_OTHERS = ['item14', 'item19', 'item21'];

export const REFERENCE = 'reuse-off';
export const SCENARIO_NAMES = ['reuse-off', 'fwd', 'rev', 'twice', 'alone'];

const AGAIN = '__again';
const dup = d => d + AGAIN;
export const baseDir = d => d.endsWith(AGAIN) ? d.slice(0, -AGAIN.length) : d;

// The item lists of each scenario (a name with the AGAIN suffix is the same plan rendered a second time, right after the first).
//   reuse-off: solids then others, a fresh python and Chrome per request (the reference)
//   fwd:       solids in order, then the others (a solid before a non-solid; A then B)
//   rev:       the others reversed first, then the solids reversed (B then A; a non-solid before a solid)
//   twice:     every item two times in a row (the same solid twice, the same non-solid twice)
//   alone:     the others only, no solid before them
export function scenarioItems(name, solids, others) {
  switch (name) {
    case 'reuse-off': case 'fwd': return [...solids, ...others];
    case 'rev': return [...others].reverse().concat([...solids].reverse());
    case 'twice': return [...solids, ...others].flatMap(d => [d, dup(d)]);
    case 'alone': return [...others];
    default: throw new Error(`unknown order-check scenario ${name}`);
  }
}
export const scenarioEnv = name => name === REFERENCE ? {GEOMETRY_WORKER_REUSE: '0', GEOMETRY_BROWSER_REUSE: '0'} : {GEOMETRY_WORKER_REUSE: '1', GEOMETRY_BROWSER_REUSE: '1'};

// What must be identical: the final SVG bytes and everything the runner records about the result (status, stage, code, sizes, panels, repairs, identity ...).
function fingerprint(outDir, name, rec) {
  let resultSha = null;
  try { resultSha = sha256(fs.readFileSync(path.join(outDir, `${name}-result.json`))); } catch { /* no result file */ }
  return {status: rec.status, code: rec.code, stage: rec.stage, svgSha: rec.svgSha, svgBytes: rec.svgBytes, resultSha};
}
const same = (a, b) => !!a && !!b && a.status === b.status && a.code === b.code && a.stage === b.stage && a.svgSha === b.svgSha && a.resultSha === b.resultSha;

async function runScenario({snap, name, solids, others, workRoot, env, lockDir, slots, log, idleMs = 20 * 60e3, totalMs = 60 * 60e3}) {
  const byDir = new Map(snap.items.map(i => [i.dir, i]));
  const list = scenarioItems(name, solids, others);
  const packet = path.join(workRoot, name, 'packet');
  const outDir = mkdirp(path.join(workRoot, name, 'out'));
  const metas = [];
  for (const d of list) {
    const src = byDir.get(baseDir(d));
    if (!src) throw new Error(`golden item ${baseDir(d)} is not in the snapshot`);
    mkdirp(path.join(packet, d));
    fs.copyFileSync(path.join(snap.dir, GE, 'ops/golden', src.dir, 'plan.json'), path.join(packet, d, 'plan.json'));
    metas.push({...src, dir: d});
  }
  fs.writeFileSync(`${packet}.manifest.json`, JSON.stringify({items: metas}));
  const slot = await acquireSlot({lockDir, slots, log});
  const started = Date.now();
  let done = 0;
  try {
    const r = await run(process.execPath, [path.join(snap.dir, GE, 'production/render-plan.mjs'), '--manifest', packet, '--out', outDir], {
      cwd: snap.dir, env: {...env, ...scenarioEnv(name)}, idleMs, timeoutMs: totalMs,
      onLine: () => { done++; log(`  [${name}] ${done}/${list.length} items finished`); }
    });
    if (r.stderr.trim() && !r.timedOut && /Error|ENOENT|Cannot find/.test(r.stderr)) log(`  [${name}] render process exited ${r.code}: ${r.stderr.trim().split(/\r?\n/).slice(0, 6).join(' | ').slice(0, 600)}`);
    const cells = new Map();
    for (const d of list) {
      const h = harvest(outDir, d);
      cells.set(d, h ? fingerprint(outDir, d, h.rec) : {status: 'NOT_RUN', code: 'NOT_RUN', stage: null, svgSha: null, svgBytes: 0, resultSha: null});
    }
    return {name, list, cells, ms: Date.now() - started, timedOut: r.timedOut};
  } finally { slot.release(); }
}

// Runs the scenarios one after the other (one render process at a time). Returns {rows, scenarios, runs, solidsRendered}.
// A row is one (scenario, item): verdict SAME / DIFF against the same item in the reference scenario, REFERENCE for the reference itself.
export async function orderCheck({snap, solids = DEFAULT_SOLIDS, others = DEFAULT_OTHERS, scenarios = SCENARIO_NAMES, cacheRoot, depsDir, lockDir, slots = 1, log = () => {}}) {
  if (!scenarios.includes(REFERENCE)) scenarios = [REFERENCE, ...scenarios];
  const env = childEnv({cacheRoot, depsDir});
  const workRoot = mkdirp(path.join(cacheRoot, 'order-check', `${snap.id}-${Date.now().toString(36)}-${process.pid}`));
  const runs = [];
  for (const name of scenarios) runs.push(await runScenario({snap, name, solids, others, workRoot, env, lockDir, slots, log}));
  const ref = runs.find(r => r.name === REFERENCE);
  const rows = [];
  for (const r of runs) {
    for (const d of r.list) {
      const refCell = ref.cells.get(baseDir(d));
      const cell = r.cells.get(d);
      let verdict;
      if (r.name === REFERENCE) verdict = cell.status === 'NOT_RUN' ? 'NOT_RUN' : 'REFERENCE';
      else if (cell.status === 'NOT_RUN' || refCell?.status === 'NOT_RUN') verdict = 'NOT_RUN';
      else verdict = same(cell, refCell) ? 'SAME' : 'DIFF';
      rows.push({scenario: r.name, item: d, base: baseDir(d), verdict, ...cell, refSvgSha: refCell?.svgSha ?? null});
    }
  }
  const solidsRendered = solids.filter(d => ref.cells.get(d)?.status === 'ARCHIVE_BOUND').length;
  try { fs.rmSync(workRoot, {recursive: true, force: true}); } catch { /* keep */ }
  return {rows, scenarios, runs: runs.map(r => ({name: r.name, items: r.list.length, ms: r.ms, timedOut: r.timedOut})), solidsRendered};
}

// The table: one line per item, one column per scenario (the reference column shows the SVG sha, a refused item its code).
export function formatTable(result) {
  const names = result.scenarios;
  const items = [...new Set(result.rows.filter(r => !r.item.endsWith(AGAIN)).map(r => r.item))];
  const cell = (scenario, item) => {
    const r = result.rows.find(x => x.scenario === scenario && x.item === item);
    if (!r) return '-';
    if (r.verdict === 'REFERENCE') return r.svgSha ? r.svgSha.slice(0, 10) : `refused:${r.code ?? r.status}`;
    return r.verdict;
  };
  const lines = [`${'item'.padEnd(20)} ${names.map(n => n.padEnd(14)).join(' ')} twice-2nd`];
  for (const d of items) {
    const second = result.rows.find(x => x.scenario === 'twice' && x.item === d + AGAIN);
    lines.push(`${d.padEnd(20)} ${names.map(n => cell(n, d).padEnd(14)).join(' ')} ${second ? second.verdict : '-'}`);
  }
  return lines;
}

// 0 = every item agrees in every order and with reuse on or off; 1 = a difference (a leak); 2 = cannot vouch (an item did not run, or no solid figure was drawn).
export function decideOrderCheck(result) {
  const diff = result.rows.filter(r => r.verdict === 'DIFF');
  if (diff.length) return {exit: 1, outcome: 'LEAK', reason: `${diff.length} cell(s) differ from the reuse-off reference`};
  if (result.rows.some(r => r.verdict === 'NOT_RUN')) return {exit: 2, outcome: 'CANNOT_VOUCH', reason: 'some items did not run'};
  if (!result.solidsRendered) return {exit: 2, outcome: 'CANNOT_VOUCH', reason: 'no solid figure was drawn in the reference run'};
  return {exit: 0, outcome: 'PASS', reason: ''};
}

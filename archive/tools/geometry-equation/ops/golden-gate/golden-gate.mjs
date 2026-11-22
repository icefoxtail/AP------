#!/usr/bin/env node
// Local identity gate for the SVG engine: renders the golden plans on a base and a head of this PC and compares the SVG bytes.
//   node archive/tools/geometry-equation/ops/golden-gate/golden-gate.mjs --base <ref> [--head <ref|@worktree>] [--families auto|all|<list>]
//        [--expected <file>] [--tests [auto|all]] [--slots N] [--no-cache] [--repeat-check] [--list] [--out report.json]
// See README.md in this folder. Exit 0 = pass, 1 = the gate failed, 2 = could not run (usage, missing dependency).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gitText, mkdirp, writeJson, fmtDuration} from './lib/util.mjs';
import {classifyFile, parseFamilies, selectItems, planKinds, KINDS} from './lib/kinds.mjs';
import {resolveTarget, ensureSnapshot, changedFiles, pruneSnapshots} from './lib/snapshot.mjs';
import {environmentFingerprint} from './lib/env-fingerprint.mjs';
import {renderItems, pruneSnapshotRuns} from './lib/render.mjs';
import {compareItem, parseExpected, applyExpected, summarize} from './lib/judge.mjs';
import {listTests, selectTests, runTests, compareTests} from './lib/tests-run.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../../..');

function parseArgs(argv) {
  const a = {families: 'auto', tests: null, slots: Number(process.env.RENDER_SLOTS) || 1, chunk: 10, retries: 2};
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    const val = () => argv[++i];
    if (k === '--base') a.base = val(); else if (k === '--head') a.head = val(); else if (k === '--families') a.families = val();
    else if (k === '--expected') a.expected = val(); else if (k === '--slots') a.slots = Number(val()); else if (k === '--chunk-size') a.chunk = Number(val());
    else if (k === '--cache') a.cache = val(); else if (k === '--lock-dir') a.lockDir = val(); else if (k === '--deps') a.deps = val(); else if (k === '--out') a.out = val();
    else if (k === '--retries') a.retries = Number(val());
    else if (k === '--tests') { const n = argv[i + 1]; a.tests = n && !n.startsWith('--') ? (i++, n) : 'auto'; }
    else if (k === '--no-cache') a.noCache = true; else if (k === '--repeat-check') a.repeat = true; else if (k === '--list') a.list = true;
    else if (k === '--help' || k === '-h') a.help = true; else throw new Error(`unknown option ${k}`);
  }
  return a;
}

const USAGE = `golden-gate --base <ref> [--head <ref|@worktree>] [--families auto|all|<kind,kind|item|FAM>] [--expected <file>] [--tests [auto|all]]
  [--slots N] [--chunk-size N] [--no-cache] [--repeat-check] [--list] [--out <report.json>] [--cache <dir>] [--lock-dir <dir>] [--deps <dir>]
kinds: ${KINDS.join(', ')}
env: GOLDEN_GATE_CACHE (cache folder), RENDER_LOCK_DIR (render slot folder shared with other workers), RENDER_SLOTS, GOLDEN_GATE_DEPS, GEOMETRY_BROWSER_EXECUTABLE, GEOMETRY_PYTHON`;

const log = m => console.error(`[${new Date().toTimeString().slice(0, 8)}] ${m}`);

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.base) { console.log(USAGE); return args.help ? 0 : 2; }
  const cacheRoot = path.resolve(args.cache || process.env.GOLDEN_GATE_CACHE || path.join(REPO, '.tmp/golden-gate-cache'));
  const lockDir = path.resolve(args.lockDir || process.env.RENDER_LOCK_DIR || path.join(cacheRoot, 'render-locks'));
  const depsDir = path.resolve(args.deps || process.env.GOLDEN_GATE_DEPS || path.join(REPO, '.tmp/apmath-visual-engine/dependencies'));
  if (!fs.existsSync(path.join(depsDir, 'node_modules')) || !fs.existsSync(path.join(depsDir, 'python'))) {
    console.error(`render dependencies not found in ${depsDir} (node_modules and python). Set GOLDEN_GATE_DEPS or --deps.`);
    return 2;
  }
  mkdirp(cacheRoot);
  const resultsRoot = mkdirp(path.join(cacheRoot, 'results'));
  const t0 = Date.now();

  const baseT = resolveTarget(REPO, args.base);
  const headT = resolveTarget(REPO, args.head || '@worktree');
  const env = environmentFingerprint({depsDir});
  log(`cache ${cacheRoot}`);
  log(`render slots: ${args.slots} in ${lockDir}`);
  log(`environment ${env.key}: chrome ${env.chrome}, node ${env.node}, ${env.python}, ${env.os}`);
  pruneSnapshots(cacheRoot);
  const baseSnap = ensureSnapshot({repo: REPO, target: baseT, cacheRoot, depsDir, log});
  const headSnap = ensureSnapshot({repo: REPO, target: headT, cacheRoot, depsDir, log});
  for (const s of [baseSnap, headSnap]) pruneSnapshotRuns(s.dir);
  const sameInput = baseSnap.commonKey === headSnap.commonKey && baseSnap.items.every(i => baseSnap.itemKey(i) === headSnap.itemKey(i));
  log(`base ${baseT.label} snapshot ${baseSnap.id} (render inputs ${baseSnap.commonKey.slice(0, 12)})`);
  log(`head ${headT.label} snapshot ${headSnap.id} (render inputs ${headSnap.commonKey.slice(0, 12)})${sameInput ? ' -- identical render inputs' : ''}`);

  // ---- which golden items -------------------------------------------------------------------------------------------
  const changed = changedFiles(REPO, baseT, headT);
  const items = headSnap.items;
  const reachable = new Set([...baseSnap.reachable, ...headSnap.reachable]);
  const classes = changed.map(f => ({file: f, ...classifyFile(f, {renderReachable: reachable, items})}));
  let all = false; const kinds = new Set(); const itemDirs = new Set(); const reasons = [];
  let familyWords = String(args.families).split(',').map(s => s.trim()).filter(Boolean);
  const expectedText = args.expected ? fs.readFileSync(args.expected, 'utf8') : '';
  const expected = parseExpected(expectedText);
  if (familyWords.length === 1 && familyWords[0] === 'auto') {
    for (const c of classes) {
      if (c.effect === 'ALL') { all = true; reasons.push(`${c.file}: ${c.reason}`); }
      else if (c.effect === 'KINDS') { c.kinds.forEach(k => kinds.add(k)); reasons.push(`${c.file}: kinds ${c.kinds.join('+')}`); }
      else if (c.effect === 'ITEM') { c.items.forEach(i => itemDirs.add(i)); reasons.push(`${c.file}: ${c.reason} ${c.items.join(',')}`); }
    }
    for (const e of expected.entries) itemDirs.add(e.item); // an item named in --expected is always compared
  } else {
    const f = parseFamilies(familyWords, items);
    if (f.unknown.length) { console.error(`unknown --families word(s): ${f.unknown.join(', ')}`); return 2; }
    all = f.all; f.kinds.forEach(k => kinds.add(k)); f.items.forEach(i => itemDirs.add(i));
    for (const e of expected.entries) itemDirs.add(e.item);
    reasons.push(`--families ${args.families}`);
  }
  const plans = headSnap.plans;
  for (const [d, p] of Object.entries(baseSnap.plans)) if (!(d in plans)) plans[d] = p;
  const selected = selectItems({items, plans, all, kinds, itemDirs});
  const noEffect = classes.filter(c => c.effect === 'NONE');
  console.log(`changed files: ${changed.length} (render-relevant ${classes.filter(c => c.effect !== 'NONE').length}, ignored ${noEffect.length})`);
  for (const r of reasons.slice(0, 40)) console.log(`  ${r}`);
  if (reasons.length > 40) console.log(`  ... ${reasons.length - 40} more`);
  console.log(`golden items selected: ${selected.length} of ${items.length}${all ? ' (whole set)' : kinds.size ? ` (kinds: ${[...kinds].join(', ')})` : ''}`);
  if (args.list) { console.log(selected.join(' ')); return 0; }

  let exit = 0;
  const report = {base: baseT.label, head: headT.label, env: env.key, selected: selected.length, total: items.length};

  // ---- repeat check: the same snapshot rendered twice, independently ----------------------------------------------------
  if (args.repeat) {
    const dirs = selected.length ? selected : items.map(i => i.dir);
    const r1 = await renderItems({snap: headSnap, itemDirs: dirs, resultsRoot: mkdirp(path.join(cacheRoot, 'repeat', 'a')), noCache: true, slots: args.slots, lockDir, chunkSize: args.chunk, retries: args.retries, log, cacheRoot, depsDir, label: 'repeat 1'});
    const r2 = await renderItems({snap: headSnap, itemDirs: [...dirs].reverse(), resultsRoot: mkdirp(path.join(cacheRoot, 'repeat', 'b')), noCache: true, slots: args.slots, lockDir, chunkSize: Math.max(1, args.chunk - 3), retries: args.retries, log, cacheRoot, depsDir, label: 'repeat 2 (reversed order, other chunking)'});
    const rows = dirs.map(d => compareItem(d, r1.results.get(d), r2.results.get(d)));
    const bad = rows.filter(r => r.verdict !== 'SAME' && r.verdict !== 'BOTH_FAIL_SAME');
    console.log(`\nrepeat check on ${headT.label}: ${rows.length} items rendered twice, ${rows.filter(r => r.verdict === 'SAME').length} byte-identical, ${rows.filter(r => r.verdict === 'BOTH_FAIL_SAME').length} failed identically, ${bad.length} unstable`);
    for (const r of bad) console.log(`  UNSTABLE ${r.item}: ${r.verdict} ${r.reason ?? ''}`);
    report.repeat = {items: rows.length, unstable: bad.map(b => b.item), wallMs: Date.now() - t0};
    if (args.out) writeJson(args.out, report);
    return bad.length ? 1 : 0;
  }

  // ---- render and compare -----------------------------------------------------------------------------------------
  let rows = [], stats = {};
  if (selected.length) {
    const baseR = await renderItems({snap: baseSnap, itemDirs: selected, resultsRoot, noCache: args.noCache, slots: args.slots, lockDir, chunkSize: args.chunk, retries: args.retries, log, cacheRoot, depsDir, label: 'base'});
    const headR = sameInput && !args.noCache ? baseR : await renderItems({snap: headSnap, itemDirs: selected, resultsRoot, noCache: args.noCache, slots: args.slots, lockDir, chunkSize: args.chunk, retries: args.retries, log, cacheRoot, depsDir, label: 'head'});
    stats = {base: baseR.stats, head: headR.stats};
    rows = selected.map(d => compareItem(d, baseR.results.get(d), headR.results.get(d)));
  }
  const applied = applyExpected(rows, expected);
  const summary = summarize(rows, applied);
  const byKind = k => [...planKinds(plans[k])].sort()[0];

  console.log('');
  const order = ['DIFFERENT', 'REGRESSED', 'NOT_RUN', 'FIXED', 'BOTH_FAIL_SAME'];
  for (const v of order) for (const r of rows.filter(x => x.verdict === v)) console.log(`${r.accepted ? 'EXPECTED ' : ''}${v.padEnd(14)} ${r.item.padEnd(24)} [${byKind(r.item)}] ${r.reason ?? ''}${r.accepted ? `  <= expected: ${r.accepted}` : ''}`);
  if (applied.accepted.length) console.log(`\nexpected changes accepted: ${applied.accepted.length}`);
  for (const e of applied.errors) console.log(`EXPECTED-FILE ERROR: ${e}`);
  const c = summary.counts;
  console.log(`\nitems ${summary.total}: SAME ${c.SAME ?? 0}, DIFFERENT ${c.DIFFERENT ?? 0}, REGRESSED ${c.REGRESSED ?? 0}, NOT_RUN ${c.NOT_RUN ?? 0}; listed only: FIXED ${c.FIXED ?? 0}, BOTH_FAIL_SAME ${c.BOTH_FAIL_SAME ?? 0} (all stay in the denominator)`);
  if (stats.base) console.log(`rendered base ${stats.base.rendered} (+${stats.base.cached} cached), head ${stats.head.rendered} (+${stats.head.cached} cached), solo retries ${stats.base.retried + stats.head.retried}`);
  if (stats.base) timingTable(selected, plans, stats);
  report.rows = rows; report.summary = {counts: c, accepted: applied.accepted, expectedErrors: applied.errors}; report.stats = stats;
  if (!rows.length) console.log('NOTHING RENDERED: no render input of the golden set differs between base and head (use --families all to render anyway).');
  else if (!summary.pass) exit = 1;

  // ---- engine tests -------------------------------------------------------------------------------------------------
  if (args.tests) {
    const sel = selectTests({snaps: [baseSnap, headSnap], changed, all: args.tests === 'all' || all});
    console.log(`\nengine tests: ${sel.tests.length} files (${sel.reason})`);
    const tBase = await runTests({snap: baseSnap, files: sel.tests, resultsRoot: mkdirp(path.join(cacheRoot, 'test-results')), envKey: env.key, slots: args.slots, lockDir, cacheRoot, depsDir, log, noCache: args.noCache});
    const tHead = sameInput && !args.noCache ? tBase : await runTests({snap: headSnap, files: sel.tests, resultsRoot: path.join(cacheRoot, 'test-results'), envKey: env.key, slots: args.slots, lockDir, cacheRoot, depsDir, log, noCache: args.noCache});
    const cmp = compareTests(tBase, tHead, sel.tests);
    for (const n of cmp.newFailures) console.log(`NEW TEST FAILURE  ${n}`);
    console.log(`tests (head): ${Object.entries(cmp.counts.head).map(([k, v]) => `${k} ${v}`).join(', ')}; failing on both sides (existing, printed): ${cmp.existingFailures.length}; fixed ${cmp.fixed.length}; removed ${cmp.removed.length}`);
    for (const n of cmp.existingFailures) console.log(`  existing failure ${n}`);
    for (const n of cmp.fixed) console.log(`  fixed ${n}`);
    report.tests = {files: sel.tests.length, newFailures: cmp.newFailures, existingFailures: cmp.existingFailures, fixed: cmp.fixed, counts: cmp.counts};
    if (cmp.newFailures.length) exit = 1;
  }

  report.wallMs = Date.now() - t0; report.pass = exit === 0;
  const reportFile = args.out || path.join(cacheRoot, 'reports', `${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  writeJson(reportFile, report);
  console.log(`\n${exit === 0 ? 'GOLDEN GATE PASS' : 'GOLDEN GATE FAIL'} in ${fmtDuration(Date.now() - t0)}; report ${reportFile}`);
  return exit;
}

function timingTable(selected, plans, stats) {
  const by = {};
  for (const d of selected) {
    const k = [...planKinds(plans[d])].sort()[0];
    const e = by[k] ?? (by[k] = {n: 0, ms: 0, known: 0});
    e.n++; for (const side of ['base', 'head']) { const ms = stats[side].itemMs[d]; if (ms) { e.ms += ms; e.known++; } }
  }
  console.log('render time per kind (sum of base+head item times measured in the process):');
  for (const [k, e] of Object.entries(by).sort()) console.log(`  ${k.padEnd(13)} ${String(e.n).padStart(3)} items  ${fmtDuration(e.ms)} (${e.known ? fmtDuration(e.ms / e.known) : '-'} per render)`);
  console.log(`wall time: base ${fmtDuration(stats.base.wallMs)}, head ${fmtDuration(stats.head.wallMs)}`);
}

main().then(code => process.exit(code), e => { console.error(e?.stack || e); process.exit(2); });

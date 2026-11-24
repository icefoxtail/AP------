#!/usr/bin/env node
// Break gate for the SVG engine (2026-11-24): renders golden plans on a base and a head of this PC and fails only when a figure a student sees is broken
// (a cut-off, a figure the head cannot draw any more, a failed measurement or a crash). A changed figure is listed and shown side by side, never a failure.
//   node archive/tools/geometry-equation/ops/golden-gate/golden-gate.mjs [--base <ref>] [--head <ref|@worktree>] [--families auto|<list>] [--all]
//        [--sample N] [--max-per-kind N] [--exam-batch N] [--expected <file>] [--tests [auto|all]] [--slots N] [--no-cache] [--repeat-check] [--list] [--out report.json]
// See README.md in this folder. Exit 0 = nothing broke, 1 = a figure breaks, 2 = could not run (usage, missing dependency).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gitText, mkdirp, writeJson, fmtDuration} from './lib/util.mjs';
import {planKinds, KINDS} from './lib/kinds.mjs';
import {chooseItems} from './lib/select.mjs';
import {resolveTarget, ensureSnapshot, changedFiles, pruneSnapshots} from './lib/snapshot.mjs';
import {environmentFingerprint} from './lib/env-fingerprint.mjs';
import {renderItems, pruneSnapshotRuns} from './lib/render.mjs';
import {compareItem, parseExpected, applyExpected, summarize, evaluate, decide, testsFail, bytesCompared, removedRow, addedRow} from './lib/judge.mjs';
import {narrowSelection, DEFAULT_SAMPLE_PER_KIND, DEFAULT_MAX_PER_KIND} from './lib/related.mjs';
import {sheetPairs, writeSheets, PAIRS_PER_SHEET} from './lib/sheet.mjs';
import {listTests, selectTests, runTests, compareTests} from './lib/tests-run.mjs';
import {orderCheck, formatTable, decideOrderCheck} from './lib/order-check.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../../..');

function parseArgs(argv) {
  const a = {families: 'auto', tests: null, slots: Number(process.env.RENDER_SLOTS) || 1, chunk: 10, retries: 2, sample: DEFAULT_SAMPLE_PER_KIND, maxPerKind: DEFAULT_MAX_PER_KIND, perSheet: PAIRS_PER_SHEET, examBatch: Number(process.env.APMS_EXAM_BATCH) || 0};
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    const val = () => argv[++i];
    if (k === '--base') a.base = val(); else if (k === '--head') a.head = val(); else if (k === '--families') a.families = val();
    else if (k === '--expected') a.expected = val(); else if (k === '--slots') a.slots = Number(val()); else if (k === '--chunk-size') a.chunk = Number(val());
    else if (k === '--cache') a.cache = val(); else if (k === '--lock-dir') a.lockDir = val(); else if (k === '--deps') a.deps = val(); else if (k === '--out') a.out = val();
    else if (k === '--retries') a.retries = Number(val()); else if (k === '--repo') a.repo = val();
    else if (k === '--tests') { const n = argv[i + 1]; a.tests = n && !n.startsWith('--') ? (i++, n) : 'auto'; }
    else if (k === '--order-check') { const n = argv[i + 1]; a.orderCheck = n && !n.startsWith('--') ? (i++, n) : 'default'; }
    else if (k === '--all') a.families = 'all'; else if (k === '--sample') a.sample = Number(val()); else if (k === '--max-per-kind') a.maxPerKind = Number(val());
    else if (k === '--exam-batch') a.examBatch = Number(val()); else if (k === '--sheets-dir') a.sheetsDir = val(); else if (k === '--per-sheet') a.perSheet = Number(val()); else if (k === '--no-sheets') a.noSheets = true;
    else if (k === '--no-cache') a.noCache = true; else if (k === '--repeat-check') a.repeat = true; else if (k === '--list') a.list = true;
    else if (k === '--help' || k === '-h') a.help = true; else throw new Error(`unknown option ${k}`);
  }
  return a;
}

const USAGE = `golden-gate [--base <ref, default: merge-base of origin/main and HEAD>] [--head <ref|@worktree>] [--families auto|all|<kind,kind|item|FAM>] [--all]
  [--sample N (items per kind when the change reaches shared code, default ${DEFAULT_SAMPLE_PER_KIND})] [--max-per-kind N (default ${DEFAULT_MAX_PER_KIND})] [--exam-batch N]
  [--expected <file>] [--tests [auto|all]] [--slots N] [--chunk-size N] [--no-cache] [--repeat-check] [--order-check [solid,item..:other,item..]] [--list]
  [--sheets-dir <dir>] [--per-sheet N] [--no-sheets] [--out <report.json>] [--cache <dir>] [--repo <dir>] [--lock-dir <dir>] [--deps <dir>]
kinds: ${KINDS.join(', ')}
env: GOLDEN_GATE_CACHE (cache folder), RENDER_LOCK_DIR (render slot folder shared with other workers), RENDER_SLOTS, GOLDEN_GATE_DEPS, GEOMETRY_BROWSER_EXECUTABLE, GEOMETRY_PYTHON`;

// stdout is collected and printed at the end, headline first: "byte compared N / selected M" (the number that says what the run vouches for)
const lines = [];
let headline = null;
const say = m => { lines.push(m); };
const flush = () => { if (headline) console.log(headline); for (const l of lines) console.log(l); lines.length = 0; };
const log = m => console.error(`[${new Date().toTimeString().slice(0, 8)}] ${m}`);

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) { console.log(USAGE); return 0; }
  const repo = path.resolve(args.repo || REPO);
  if (!args.base && !args.orderCheck) {
    // the usual use: the pull request against main. The merge-base keeps main's newer commits from looking like the head's changes.
    try { args.base = gitText(repo, ['merge-base', 'origin/main', args.head && args.head !== '@worktree' ? args.head : 'HEAD']).trim(); } catch { args.base = null; }
    if (!args.base) { console.log(USAGE); return 2; }
  }
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

  // the --expected file is read first: a wrong file is exit 1 whatever else happens
  let expected = {entries: [], errors: []};
  if (args.expected) {
    try { expected = parseExpected(fs.readFileSync(args.expected, 'utf8')); } catch (e) { expected = {entries: [], errors: [`cannot read the expected file ${args.expected}: ${e.message}`]}; }
  }

  if (args.orderCheck) return orderCheckMain({args, repo, cacheRoot, lockDir, depsDir});
  const baseT = resolveTarget(repo, args.base);
  const headT = resolveTarget(repo, args.head || '@worktree');
  // nothing changed and nothing asked for by name: nothing can break, and the snapshots (minutes of unpacking) are not needed
  if (args.families === 'auto' && !args.repeat && !args.list && !expected.entries.length) {
    let early = null;
    try { early = changedFiles(repo, baseT, headT); } catch { /* the full path below reports it */ }
    if (early && early.length === 0) {
      headline = 'byte compared 0 / selected 0 (base and head do not differ)';
      say(`GOLDEN GATE UNAFFECTED (nothing compared): base ${baseT.label} and head ${headT.label} do not differ; ${fmtDuration(Date.now() - t0)}`);
      if (args.out) writeJson(args.out, {base: baseT.label, head: headT.label, outcome: 'UNAFFECTED', reason: 'base and head do not differ', pass: true, wallMs: Date.now() - t0});
      return 0;
    }
  }
  const env = environmentFingerprint({depsDir});
  log(`cache ${cacheRoot}`);
  log(`render slots: ${args.slots} in ${lockDir}`);
  log(`environment ${env.key}: chrome ${env.chrome}, node ${env.node}, ${env.python}, ${env.os}`);
  pruneSnapshots(cacheRoot);
  const baseSnap = ensureSnapshot({repo, target: baseT, cacheRoot, depsDir, log});
  const headSnap = ensureSnapshot({repo, target: headT, cacheRoot, depsDir, log});
  for (const s of [baseSnap, headSnap]) pruneSnapshotRuns(s.dir);
  const baseDirs = new Set(baseSnap.items.map(i => i.dir)), headDirs = new Set(headSnap.items.map(i => i.dir));
  const sameInput = baseSnap.commonKey === headSnap.commonKey && baseDirs.size === headDirs.size && headSnap.items.every(i => baseDirs.has(i.dir) && baseSnap.itemKey(i) === headSnap.itemKey(i));
  log(`base ${baseT.label} snapshot ${baseSnap.id} (render inputs ${baseSnap.commonKey.slice(0, 12)})`);
  log(`head ${headT.label} snapshot ${headSnap.id} (render inputs ${headSnap.commonKey.slice(0, 12)})${sameInput ? ' -- identical render inputs' : ''}`);

  // ---- which golden items -------------------------------------------------------------------------------------------
  let changed, sel;
  try {
    changed = changedFiles(repo, baseT, headT);
    sel = chooseItems({families: args.families, changed, baseSnap, headSnap, expectedItems: expected.entries.map(e => e.item)});
  } catch (e) { headline = 'byte compared 0 / selected 0'; say(`CANNOT RUN: the changes could not be classified: ${e.message}`); return 2; }
  if (sel.unknown.length) { headline = 'byte compared 0 / selected 0'; say(`CANNOT RUN: unknown --families word(s): ${sel.unknown.join(', ')}`); return 2; }
  const {all, kinds, plans} = sel;
  const items = headSnap.items;
  // the related items only: a kind's own change renders that kind, a change to shared code a sample of every kind, --all the whole set (lib/related.mjs)
  const narrowed = narrowSelection({sel, items, perKind: args.sample, maxPerKind: args.maxPerKind});
  const selected = narrowed.selected;
  const removedDirs = baseSnap.items.filter(i => !headDirs.has(i.dir)).map(i => i.dir);
  say(`changed files: ${changed.length} (render-relevant ${sel.classes.filter(c => c.effect !== 'NONE').length}, ignored ${sel.classes.filter(c => c.effect === 'NONE').length})`);
  for (const r of sel.reasons.slice(0, 40)) say(`  ${r}`);
  if (sel.reasons.length > 40) say(`  ... ${sel.reasons.length - 40} more`);
  say(`golden items selected: ${selected.length} of ${items.length}${narrowed.sampled ? ' (a sample)' : all ? ' (whole set)' : kinds.size ? ` (kinds: ${[...kinds].join(', ')})` : ''}${removedDirs.length ? `; ${removedDirs.length} item(s) only on base` : ''}`);
  if (narrowed.note) say(`  ${narrowed.note}`);
  if (args.list) { say(selected.join(' ')); return 0; }

  const report = {base: baseT.label, head: headT.label, env: env.key, selected: selected.length, total: items.length};
  const renderOpts = {resultsRoot, noCache: args.noCache, slots: args.slots, lockDir, chunkSize: args.chunk, retries: args.retries, log, cacheRoot, depsDir, envKey: env.key, examBatch: args.examBatch};

  // ---- repeat check: the same snapshot rendered twice, independently ----------------------------------------------------
  if (args.repeat) {
    const dirs = selected.length ? selected : items.map(i => i.dir);
    const r1 = await renderItems({...renderOpts, snap: headSnap, itemDirs: dirs, resultsRoot: mkdirp(path.join(cacheRoot, 'repeat', 'a')), noCache: true, label: 'repeat 1'});
    const r2 = await renderItems({...renderOpts, snap: headSnap, itemDirs: [...dirs].reverse(), resultsRoot: mkdirp(path.join(cacheRoot, 'repeat', 'b')), noCache: true, chunkSize: Math.max(1, args.chunk - 3), label: 'repeat 2 (reversed order, other chunking)'});
    const rows = dirs.map(d => compareItem(d, r1.results.get(d), r2.results.get(d)));
    const bad = rows.filter(r => r.verdict !== 'SAME' && r.verdict !== 'BOTH_FAIL_SAME');
    headline = `byte compared ${rows.filter(bytesCompared).length} / selected ${rows.length}`;
    say(`\nrepeat check on ${headT.label}: ${rows.length} items rendered twice, ${rows.filter(r => r.verdict === 'SAME').length} byte-identical, ${rows.filter(r => r.verdict === 'BOTH_FAIL_SAME').length} failed identically, ${bad.length} unstable`);
    for (const r of bad) say(`  UNSTABLE ${r.item}: ${r.verdict} ${r.reason ?? ''}`);
    report.repeat = {items: rows.length, unstable: bad.map(b => b.item), wallMs: Date.now() - t0};
    if (args.out) writeJson(args.out, report);
    return bad.length || !rows.some(bytesCompared) ? (bad.length ? 1 : 2) : 0;
  }

  // ---- render and compare -----------------------------------------------------------------------------------------
  let rows = [], stats = {}, baseRes = null, headRes = null;
  if (selected.length) {
    const baseList = selected.filter(d => baseDirs.has(d));
    const baseR = await renderItems({...renderOpts, snap: baseSnap, itemDirs: baseList, label: 'base'});
    const headR = sameInput && !args.noCache ? baseR : await renderItems({...renderOpts, snap: headSnap, itemDirs: selected, label: 'head'});
    stats = {base: baseR.stats, head: headR.stats};
    baseRes = baseR.results; headRes = headR.results;
    rows = selected.map(d => baseDirs.has(d) ? compareItem(d, baseR.results.get(d), headR.results.get(d)) : addedRow(d, headR.results.get(d)));
  }
  for (const d of removedDirs) rows.push(removedRow(d)); // a removed golden item always counts, selected or not
  const applied = applyExpected(rows, expected);
  const summary = summarize(rows, applied);
  const byKind = k => [...planKinds(plans[k])].sort()[0];

  say('');
  // the ones that fail first, then the changes a person looks at (DIFFERENT is long: the first 40 are printed, all are in the report and on the sheets)
  const order = ['CLIPPED', 'REGRESSED', 'NOT_RUN', 'DIFFERENT', 'MINOR', 'REMOVED', 'FIXED', 'ADDED', 'BOTH_FAIL_SAME'];
  for (const v of order) {
    const list = rows.filter(x => x.verdict === v);
    for (const r of list.slice(0, v === 'DIFFERENT' || v === 'BOTH_FAIL_SAME' ? 40 : 200)) say(`${r.accepted ? 'EXPECTED ' : ''}${v.padEnd(14)} ${r.item.padEnd(24)} [${plans[r.item] ? byKind(r.item) : '-'}] ${r.reason ?? ''}${r.accepted ? `  <= expected: ${r.accepted}` : ''}`);
    if (list.length > 40 && (v === 'DIFFERENT' || v === 'BOTH_FAIL_SAME')) say(`  ... ${list.length - 40} more ${v} (see the report)`);
  }
  if (applied.accepted.length) say(`\nexpected changes marked: ${applied.accepted.length}`);
  for (const e of applied.errors) say(`EXPECTED-FILE NOTE (does not fail the gate): ${e}`);
  const c = summary.counts;
  say(`\nitems ${summary.total}: SAME ${c.SAME ?? 0}, DIFFERENT ${c.DIFFERENT ?? 0} (information, not a failure); FAIL: REGRESSED ${c.REGRESSED ?? 0}, CLIPPED ${c.CLIPPED ?? 0}, NOT_RUN ${c.NOT_RUN ?? 0}; listed: MINOR ${c.MINOR ?? 0}, REMOVED ${c.REMOVED ?? 0}, FIXED ${c.FIXED ?? 0}, ADDED ${c.ADDED ?? 0}, BOTH_FAIL_SAME ${c.BOTH_FAIL_SAME ?? 0} (all stay in the denominator)`);
  if (stats.base) say(`rendered base ${stats.base.rendered} (+${stats.base.cached} cached), head ${stats.head.rendered} (+${stats.head.cached} cached), solo retries ${stats.base.retried + stats.head.retried}`);
  if (stats.base) timingTable(selected, plans, stats);
  report.rows = rows; report.summary = {counts: c, accepted: applied.accepted, expectedErrors: applied.errors}; report.stats = stats;
  const reusedHead = sameInput && !args.noCache && rows.length > 0;
  const cover = evaluate(rows, {kinds, kindOf: d => plans[d] ? planKinds(plans[d]) : new Set(), reused: reusedHead});
  headline = `byte compared ${cover.byteCompared} / selected ${cover.selected}${sameInput && !args.noCache && rows.length ? ' (base and head have identical render inputs: nothing to compare)' : ''}`;
  report.coverage = cover;
  const decision = decide({rows, summary, changedCount: changed.length, allChangesIgnored: sel.classes.length > 0 && sel.classes.every(c => c.effect === 'NONE'), explicitSelection: sel.explicit, reusedHead});
  let exit = decision.exit, outcome = decision.outcome;
  for (const k of cover.notCovered) say(`note: kind ${k} changed but no golden item of that kind was drawn on both sides (they all fail or were not run), so nothing of it was compared.`);
  if (cover.wholeUncovered.length) say(`note: no byte comparison for kind(s) ${cover.wholeUncovered.join(', ')} (every golden item of that kind fails or was not run): a change to them is not covered by this run.`);

  // ---- side-by-side sheets of what changed: a person looks, the gate does not block on it ---------------------------------
  if (!args.noSheets && !reusedHead && stats.base) {
    const svgOf = (side, item) => { const rec = (side === 'base' ? baseRes : headRes)?.get(item); try { return rec?.svgPath ? fs.readFileSync(rec.svgPath, 'utf8') : null; } catch { return null; } };
    const pairs = sheetPairs(rows, svgOf);
    if (pairs.length) {
      const sheetsDir = path.resolve(args.sheetsDir || path.join(cacheRoot, 'sheets', new Date().toISOString().replace(/[:.]/g, '-')));
      const sheets = await writeSheets({pairs, outDir: sheetsDir, depsDir, baseLabel: `base ${baseT.label}`, headLabel: `head ${headT.label}`, per: args.perSheet, log});
      say(`\ncomparison sheets: ${pairs.length} changed figure(s), ${sheets.sheets.length} sheet(s) in ${sheetsDir}`);
      for (const s of sheets.sheets) say(`  ${s.file} (${s.items.join(' ')})`);
      if (sheets.note) say(`note: ${sheets.note}`);
      report.sheets = {dir: sheetsDir, files: sheets.sheets, note: sheets.note};
    } else say('\ncomparison sheets: no figure changed on both sides, nothing to look at');
  }

  // ---- engine tests -------------------------------------------------------------------------------------------------
  if (args.tests) {
    const tsel = selectTests({snaps: [baseSnap, headSnap], changed, all: args.tests === 'all' || all, kinds});
    say(`\nengine tests: ${tsel.tests.length} files (${tsel.reason})`);
    const tOpts = {files: tsel.tests, resultsRoot: mkdirp(path.join(cacheRoot, 'test-results')), envKey: env.key, slots: args.slots, lockDir, cacheRoot, depsDir, log, noCache: args.noCache};
    const tBase = await runTests({...tOpts, snap: baseSnap});
    const tHead = sameInput && !args.noCache ? tBase : await runTests({...tOpts, snap: headSnap});
    const cmp = compareTests(tBase, tHead, tsel.tests);
    for (const n of cmp.newFailures) say(`NEW TEST FAILURE  ${n}`);
    for (const n of cmp.lost) say(`LOST TEST  ${n}`);
    say(`tests (head): ${Object.entries(cmp.counts.head).map(([k, v]) => `${k} ${v}`).join(', ')}; failing on both sides (existing, printed): ${cmp.existingFailures.length}; fixed ${cmp.fixed.length}; lost ${cmp.lost.length}`);
    for (const n of cmp.existingFailures) say(`  existing failure ${n}`);
    for (const n of cmp.fixed) say(`  fixed ${n}`);
    report.tests = {files: tsel.tests.length, newFailures: cmp.newFailures, lost: cmp.lost, existingFailures: cmp.existingFailures, fixed: cmp.fixed, counts: cmp.counts};
    if (testsFail(cmp)) { exit = 1; outcome = 'FAIL'; }
  }

  report.wallMs = Date.now() - t0; report.pass = exit === 0 && outcome === 'PASS'; report.outcome = outcome; report.reason = decision.reason;
  const reportFile = args.out || path.join(cacheRoot, 'reports', `${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  writeJson(reportFile, report);
  const word = outcome === 'PASS' ? `GOLDEN GATE PASS (${decision.reason}; ${c.DIFFERENT ?? 0} changed figure(s) are information only)` : outcome === 'UNAFFECTED' ? `GOLDEN GATE UNAFFECTED (nothing compared: ${decision.reason})` : outcome === 'CANNOT_RUN' ? `GOLDEN GATE CANNOT RUN: ${decision.reason}` : `GOLDEN GATE FAIL (${summary.failures.length ? `${summary.failures.length} figure(s) break` : 'engine tests'})`;
  say(`\n${word} in ${fmtDuration(Date.now() - t0)}; report ${reportFile}`);
  return exit;
}

// --order-check: a few golden plans in several orders and with the process reuse on and off, all compared with the reuse-off render (lib/order-check.mjs). No base is needed.
//   --order-check                  the default sample (the solids and other items named in lib/order-check.mjs)
//   --order-check s1,s2:o1,o2      your own list: solid items before the colon, other items after it
async function orderCheckMain({args, repo, cacheRoot, lockDir, depsDir}) {
  const headT = resolveTarget(repo, args.head || '@worktree');
  const env = environmentFingerprint({depsDir});
  log(`environment ${env.key}: chrome ${env.chrome}, node ${env.node}, ${env.python}, ${env.os}`);
  const snap = ensureSnapshot({repo, target: headT, cacheRoot, depsDir, log});
  pruneSnapshotRuns(snap.dir);
  const custom = args.orderCheck !== 'default' ? args.orderCheck.split(':') : null;
  const pick = s => s.split(',').filter(Boolean);
  const t0 = Date.now();
  const result = await orderCheck({snap, ...(custom ? {solids: pick(custom[0]), others: pick(custom[1] ?? '')} : {}), cacheRoot, depsDir, lockDir, slots: args.slots, log});
  const d = decideOrderCheck(result);
  const n = v => result.rows.filter(r => r.verdict === v).length;
  say(`order check on ${headT.label} (snapshot ${snap.id}): scenarios ${result.scenarios.join(', ')}; ${result.rows.length} renders: ${n('SAME')} SAME, ${n('DIFF')} DIFF, ${n('NOT_RUN')} NOT_RUN (the reuse-off run is the reference)`);
  for (const l of formatTable(result)) say(l);
  for (const r of result.rows.filter(x => x.verdict === 'DIFF')) say(`DIFF ${r.scenario} ${r.item}: svg ${r.svgSha?.slice(0, 12)} vs reuse-off ${r.refSvgSha?.slice(0, 12)} (status ${r.status} ${r.code ?? ''})`);
  headline = `order check ${d.outcome}${d.reason ? `: ${d.reason}` : ''} in ${fmtDuration(Date.now() - t0)}`;
  if (args.out) writeJson(args.out, {head: headT.label, env: env.key, result, outcome: d.outcome, reason: d.reason});
  return d.exit;
}

function timingTable(selected, plans, stats) {
  const by = {};
  for (const d of selected) {
    const k = [...planKinds(plans[d])].sort()[0];
    const e = by[k] ?? (by[k] = {n: 0, ms: 0, known: 0});
    e.n++; for (const side of ['base', 'head']) { const ms = stats[side].itemMs[d]; if (ms) { e.ms += ms; e.known++; } }
  }
  say('render time per kind (sum of base+head item times measured in the process):');
  for (const [k, e] of Object.entries(by).sort()) say(`  ${k.padEnd(13)} ${String(e.n).padStart(3)} items  ${fmtDuration(e.ms)} (${e.known ? fmtDuration(e.ms / e.known) : '-'} per render)`);
  say(`wall time: base ${fmtDuration(stats.base.wallMs)}, head ${fmtDuration(stats.head.wallMs)}`);
}

main().then(code => { flush(); process.exit(code); }, e => { flush(); console.error(e?.stack || e); process.exit(2); });

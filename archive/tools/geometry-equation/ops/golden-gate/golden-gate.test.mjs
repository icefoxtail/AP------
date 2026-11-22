// Fast tests of the golden gate (no browser, no render): verdict rules, the kind table and the checks that keep the table honest.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {compareItem, parseExpected, applyExpected, summarize, evaluate, statusChainOf, decide, bytesCompared, removedRow, addedRow, testsFail} from './lib/judge.mjs';
import {chooseItems} from './lib/select.mjs';
import {environmentFingerprint} from './lib/env-fingerprint.mjs';
import {
  GE, KINDS, CAPABILITY_KIND, KIND_FILES, SHARED_FILES, SHARED_PREFIXES, SHARED_EXACT, NON_RENDER_FILES, DISPATCHERS, IMPORT_EXCEPTIONS,
  planKinds, planCapabilities, classifyFile, parseFamilies, selectItems, KINDS_VERSION, kindTableProblems, RULE_FILES, readRuleSources, kindsVersionOf, currentTable
} from './lib/kinds.mjs';
import {buildCodeGraph} from './lib/code-graph.mjs';
import {SNAPSHOT_SPECS, RENDER_PLAN, MANIFEST, describeSnapshot, repoFilesUnder, extractImageRefs, refCandidates, resolveTarget, ensureSnapshot, changedFiles, commonKeyOf} from './lib/snapshot.mjs';
import {renderItems, resultKey, reusable, loadResult, storeDir, harvest, acquireSlot} from './lib/render.mjs';
import {parseTapForTest, parseUnittestForTest, normalizeTestName, compareTests} from './lib/tests-run.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../..');
const manifest = JSON.parse(fs.readFileSync(path.join(REPO, GE, 'ops/golden.manifest.json'), 'utf8'));
const items = manifest.items;
const plans = Object.fromEntries(items.map(i => [i.dir, JSON.parse(fs.readFileSync(path.join(REPO, GE, 'ops/golden', i.dir, 'plan.json'), 'utf8'))]));
const graph = buildCodeGraph(REPO, [RENDER_PLAN]);
// temp fixtures live inside the repo's .tmp (ignored by git), on the same drive as the checkout, never in the system temp folder
const TMP_ROOT = path.join(REPO, '.tmp/golden-gate-test');
fs.mkdirSync(TMP_ROOT, {recursive: true});
const P = `${GE}/production`;

const rec = (status, more = {}) => ({status, code: null, stage: null, svgSha: status === 'ARCHIVE_BOUND' ? 'a'.repeat(64) : null, svgBytes: 10, sizeClass: 'full', solutionImageScale: null, ...more});

test('verdicts: identical bytes are SAME, changed bytes DIFFERENT, size fields count', () => {
  assert.equal(compareItem('i', rec('ARCHIVE_BOUND'), rec('ARCHIVE_BOUND')).verdict, 'SAME');
  assert.equal(compareItem('i', rec('ARCHIVE_BOUND'), rec('ARCHIVE_BOUND', {svgSha: 'b'.repeat(64)})).verdict, 'DIFFERENT');
  assert.equal(compareItem('i', rec('ARCHIVE_BOUND'), rec('ARCHIVE_BOUND', {sizeClass: 'tall'})).verdict, 'DIFFERENT');
  assert.equal(compareItem('i', rec('ARCHIVE_BOUND'), rec('ARCHIVE_BOUND', {solutionImageScale: 85})).verdict, 'DIFFERENT');
});

test('verdicts: pass to fail is REGRESSED, fail to pass and same-code failures are listed, other changes fail', () => {
  assert.equal(compareItem('i', rec('ARCHIVE_BOUND'), rec('FAILED', {code: 'X'})).verdict, 'REGRESSED');
  assert.equal(compareItem('i', rec('FAILED', {code: 'X'}), rec('ARCHIVE_BOUND')).verdict, 'FIXED');
  assert.equal(compareItem('i', rec('FAILED', {code: 'X'}), rec('FAILED', {code: 'X'})).verdict, 'BOTH_FAIL_SAME');
  assert.equal(compareItem('i', rec('FAILED', {code: 'X'}), rec('FAILED', {code: 'Y'})).verdict, 'DIFFERENT');
  assert.equal(compareItem('i', rec('NOT_RUN'), rec('ARCHIVE_BOUND')).verdict, 'NOT_RUN');
  assert.equal(compareItem('i', rec('EXEMPT', {detail: 'a'}), rec('EXEMPT', {detail: 'a'})).verdict, 'SAME');
  assert.equal(compareItem('i', rec('EXEMPT', {detail: 'a'}), rec('EXEMPT', {detail: 'b'})).verdict, 'DIFFERENT');
});

test('summary: failing verdicts fail the gate, listed verdicts do not, and they stay in the count', () => {
  const rows = [compareItem('a', rec('ARCHIVE_BOUND'), rec('ARCHIVE_BOUND')), compareItem('b', rec('FAILED', {code: 'X'}), rec('ARCHIVE_BOUND')), compareItem('c', rec('FAILED', {code: 'X'}), rec('FAILED', {code: 'X'}))];
  const s = summarize(rows);
  assert.equal(s.pass, true); assert.equal(s.total, 3); assert.equal(s.listed.length, 2);
  rows.push(compareItem('d', rec('ARCHIVE_BOUND'), rec('ARCHIVE_BOUND', {svgSha: 'b'.repeat(64)})));
  assert.equal(summarize(rows).pass, false);
  assert.equal(summarize([]).pass, false); // nothing compared is not a pass; the CLI reports "nothing rendered" separately
});

test('expected file: only lines with a reason count, and an expected change that did not happen fails', () => {
  const bad = parseExpected('item1 DIFFERENT\nitem2 DIFFERENT short\nitem3 MAYBE a long enough reason here\n');
  assert.equal(bad.entries.length, 0); assert.equal(bad.errors.length, 3);
  const exp = parseExpected('# comment\n\nitem1 DIFFERENT x-axis dimension moved up by design (commit cc76160b8d)\nitem2 DIFFERENT intended change that never happened\n');
  assert.equal(exp.errors.length, 0);
  const rows = [compareItem('item1', rec('ARCHIVE_BOUND'), rec('ARCHIVE_BOUND', {svgSha: 'b'.repeat(64)})), compareItem('item2', rec('ARCHIVE_BOUND'), rec('ARCHIVE_BOUND'))];
  const applied = applyExpected(rows, exp);
  assert.equal(applied.accepted.length, 1); assert.match(applied.errors.join('\n'), /item2.*did not change/);
  assert.equal(summarize(rows, applied).pass, false);
  const ok = applyExpected(rows.slice(0, 1), parseExpected('item1 DIFFERENT x-axis dimension moved up by design\n'));
  assert.equal(summarize(rows.slice(0, 1), ok).pass, true);
  assert.equal(rows[0].accepted, 'x-axis dimension moved up by design');
  const wrong = applyExpected([compareItem('i', rec('ARCHIVE_BOUND'), rec('FAILED', {code: 'X'}))], parseExpected('i DIFFERENT this was announced as a plain change\n'));
  assert.match(wrong.errors.join('\n'), /expected DIFFERENT for i but it is REGRESSED/);
  const missing = applyExpected(rows, parseExpected('zzz DIFFERENT an item that is not in this run at all\n'));
  assert.match(missing.errors.join('\n'), /not part of this run/);
});

test('plan kinds: capabilities are collected from composite panels', () => {
  const composite = items.map(i => plans[i.dir]).find(p => p.capability === 'composite-panels-v1');
  assert.ok(composite);
  const caps = planCapabilities(composite);
  assert.ok(caps.has('composite-panels-v1') && caps.size >= 2, [...caps].join());
  assert.ok(planKinds(composite).has('composite'));
  assert.deepEqual([...planKinds({capability: 'brand-new-v1'})], ['unknown']);
});

test('golden set: every plan maps to known kinds, and every kind has a golden item', () => {
  for (const i of items) {
    const pk = planKinds(plans[i.dir]);
    assert.ok(!pk.has('unknown'), `${i.dir} has a capability the kind table does not know: ${[...planCapabilities(plans[i.dir])].join()}`);
    for (const k of pk) assert.ok(KINDS.includes(k) || k === 'status-only', `${i.dir}: ${k}`);
  }
  for (const k of KINDS) assert.ok(items.some(i => planKinds(plans[i.dir]).has(k)), `no golden item exercises kind ${k}`);
});

test('every file the render can reach, and every engine file next to it, is listed explicitly (no silent default)', () => {
  const explicit = f => KIND_FILES[f] || SHARED_FILES.has(f) || SHARED_EXACT.has(f) || NON_RENDER_FILES.has(f) || SHARED_PREFIXES.some(p => f.startsWith(p)) || /\.md$/.test(f);
  const files = new Set([...graph.nodes]);
  for (const dir of ['production', 'visual_engine']) {
    const walk = d => { for (const e of fs.readdirSync(path.join(REPO, d), {withFileTypes: true})) {
      const rel = `${d}/${e.name}`;
      if (e.isDirectory()) { if (!/(^|\/)(plans|exam-figure-ledger|__pycache__)$/.test(rel)) walk(rel); } else if (!/\.pyc$/.test(e.name)) files.add(rel);
    } };
    walk(`${GE}/${dir}`);
  }
  const unlisted = [...files].filter(f => !explicit(f));
  assert.deepEqual(unlisted, [], `add these to a list in lib/kinds.mjs (kind file, shared, or non-render):\n${unlisted.join('\n')}`);
  // classify() always answers with one of the four effects, never undefined
  for (const f of files) assert.ok(['ALL', 'KINDS', 'ITEM', 'NONE'].includes(classifyFile(f, {renderReachable: graph.nodes, items}).effect), f);
});

test('files listed as non-render are really not reachable from render-plan.mjs; kind files really are', () => {
  for (const f of NON_RENDER_FILES) assert.ok(!graph.nodes.has(f), `${f} is reachable from render-plan.mjs but listed as NON_RENDER`);
  for (const f of Object.keys(KIND_FILES)) { assert.ok(fs.existsSync(path.join(REPO, f)), `${f} does not exist`); assert.ok(graph.nodes.has(f), `${f} is not reachable from render-plan.mjs`); }
  for (const f of SHARED_FILES) assert.ok(fs.existsSync(path.join(REPO, f)), `${f} does not exist`);
  for (const [f, who] of Object.entries(IMPORT_EXCEPTIONS)) { assert.ok(KIND_FILES[f], `${f} is not a kind file`); for (const w of who) assert.ok(graph.nodes.has(w), `${w}`); }
});

test('kind files are used only by their own kind, the dispatchers, or an exception that says why', () => {
  assert.deepEqual(kindTableProblems({graph}), []);
});

test('the snapshot unpacks every code root the render imports from, and the data files known to be read', () => {
  const covered = f => SNAPSHOT_SPECS.some(s => !s.startsWith(':') && (f === s || f.startsWith(s + '/'))) || (/^archive\/[^/]+$/.test(f)) || f.startsWith(`${GE}/`);
  const outside = [...graph.nodes].filter(f => !covered(f));
  assert.deepEqual(outside, [], `render code outside the snapshot: add to SNAPSHOT_SPECS\n${outside.join('\n')}`);
  for (const f of ['archive/tools/past-exam-pipeline/completion-contract.json', 'archive/tools/svg-language-contract.cjs', 'archive/data/svg-accessibility-index.js', 'archive/engine.html']) assert.ok(covered(f), `${f} is read by the render but not in the snapshot`);
});

test('changed files map to kinds, items, everything, or nothing', () => {
  const kindsOf = f => classifyFile(f, {renderReachable: graph.nodes, items});
  assert.deepEqual(kindsOf(`${P}/stat-chart-v1.mjs`), {effect: 'KINDS', kinds: ['stat'], reason: 'kind file'});
  assert.equal(kindsOf(`${P}/phase2.mjs`).effect, 'ALL');
  assert.equal(kindsOf(`${P}/brand-new-engine-file.mjs`).effect, 'ALL', 'an unknown engine file must mean the whole set');
  assert.equal(kindsOf(`${GE}/visual_engine/label_layout.py`).effect, 'ALL');
  assert.equal(kindsOf('archive/figure-size.css').effect, 'ALL');
  assert.equal(kindsOf('archive/tools/pipeline-core/canonical.mjs').effect, 'ALL');
  assert.equal(kindsOf(`${GE}/ops/golden.manifest.json`).effect, 'ALL');
  assert.deepEqual(kindsOf(`${GE}/ops/golden/item21/plan.json`).items, ['item21']);
  assert.equal(kindsOf(`${GE}/production/AUTHOR_GUIDE.md`).effect, 'NONE');
  assert.equal(kindsOf(`${GE}/tests/stat-chart.test.mjs`).effect, 'NONE');
  assert.equal(kindsOf('docs/agents/visual-svg.md').effect, 'NONE');
  assert.equal(kindsOf(`${P}/exam-figure-ledger/x.json`).effect, 'NONE');
  const examFile = items[0].sourcePath;
  assert.deepEqual(kindsOf(examFile).items.includes(items[0].dir), true);
  assert.equal(kindsOf('archive/exams/original/high/h1/2mid/not-a-golden-exam.js').effect, 'NONE');
});

test('kind selection: a stat file selects stat plans (standalone and inside composites) and nothing from other kinds', () => {
  const sel = selectItems({items, plans, kinds: new Set(['stat'])});
  assert.ok(sel.length >= 20, `only ${sel.length} stat items`);
  for (const d of sel) assert.ok(planKinds(plans[d]).has('stat'), d);
  for (const i of items) if (planKinds(plans[i.dir]).has('stat')) assert.ok(sel.includes(i.dir), i.dir);
  assert.equal(selectItems({items, plans, all: true}).length, items.length);
  const sol = selectItems({items, plans, kinds: new Set(['solid'])});
  assert.ok(sol.length > 0 && !sol.every(d => sel.includes(d)));
});

test('--families words: kinds, capability names, fam labels, items and aliases', () => {
  const f = parseFamilies(['stat', 'solid-figure-v1', 'SET_DIAGRAM', 'item21', 'plane', 'nonsense'], items);
  assert.deepEqual([...f.kinds].sort(), ['construction', 'solid', 'stat']);
  assert.ok(f.items.has('item21') && f.items.size > 1);
  assert.deepEqual(f.unknown, ['nonsense']);
  assert.equal(parseFamilies(['all'], items).all, true);
});

test('engine test output parsers read TAP and unittest verbose lines', () => {
  const tap = parseTapForTest('# Subtest: a\nok 1 - a\n  ---\n  duration_ms: 1\n  ...\n    ok 1 - child\nnot ok 2 - b\nok 3 - c # SKIP later\nok 4 - a\n');
  assert.deepEqual(tap, {a: 'pass', child: 'pass', b: 'fail', c: 'skip', 'a #2': 'pass'});
  const ut = parseUnittestForTest('test_one (test_mod.T.test_one) ... ok\ntest_two (test_mod.T.test_two) ... FAIL\ntest_three (test_mod.T.test_three) ... skipped \'x\'\nRan 3 tests\n');
  assert.deepEqual(ut, {'test_mod.T.test_one': 'pass', 'test_mod.T.test_two': 'fail', 'test_mod.T.test_three': 'skip'});
});

test('engine test comparison: names that hold the snapshot path match across base and head, new failures are the head-only ones', () => {
  const BS = String.fromCharCode(92);
  const win = (...parts) => parts.join(BS);
  assert.equal(normalizeTestName(win('D:', 'cache', 'gate', 'snapshots', 'c-abc-1', 'archive', 'tools', 'x.test.mjs')), 'archive/tools/x.test.mjs');
  const F = `${GE}/tests/x.test.mjs`;
  const base = {[F]: {names: {a: 'pass', b: 'fail', c: 'pass', [win('D:', 'cache', 'snapshots', 'c-1', 'y.test.mjs')]: 'fail'}}};
  const head = {[F]: {names: {a: 'fail', b: 'fail', c: 'pass', d: 'fail', [win('D:', 'cache', 'snapshots', 'c-2', 'y.test.mjs')]: 'fail'}}};
  const r = compareTests(base, head, [F]);
  assert.deepEqual(r.newFailures.sort(), ['tests/x.test.mjs :: a', 'tests/x.test.mjs :: d']);
  assert.deepEqual(r.existingFailures.sort(), ['tests/x.test.mjs :: b', 'tests/x.test.mjs :: y.test.mjs']);
});

// ---- a green gate must have compared something -------------------------------------------------------------------------------
const failRec = (more = {}) => rec('FAILED', {code: 'UNSUPPORTED_DISPLAY_ENVELOPE', stage: 'compose', detailFull: '{"status":"COMPOSITE_PANEL_NOT_COMPOSED","detail":{"status":"X"}}', ...more});

test('209 identical failures are not a pass: no bytes compared means the gate cannot vouch', () => {
  const rows = items.map(i => compareItem(i.dir, failRec(), failRec()));
  assert.equal(rows.every(r => r.verdict === 'BOTH_FAIL_SAME'), true);
  const s = summarize(rows);
  assert.equal(s.total, 209); assert.equal(s.byteCompared, 0); assert.equal(s.pass, false);
  const cover = evaluate(rows, {kindOf: d => planKinds(plans[d])});
  assert.equal(cover.byteCompared, 0); assert.equal(cover.cannotVouch, true); assert.equal(cover.selected, 209);
});

test('a changed kind with no byte comparison is NOT_COVERED, even when other kinds were compared', () => {
  const rows = [compareItem('item21', rec('ARCHIVE_BOUND'), rec('ARCHIVE_BOUND')), compareItem('item22', failRec(), failRec())];
  const kindOf = d => d === 'item21' ? new Set(['stat']) : new Set(['solid']);
  assert.deepEqual(evaluate(rows, {kinds: new Set(['stat', 'solid']), kindOf}).notCovered, ['solid']);
  assert.equal(evaluate(rows, {kinds: new Set(['stat', 'solid']), kindOf}).cannotVouch, true);
  assert.equal(evaluate(rows, {kinds: new Set(['stat']), kindOf}).cannotVouch, false);
  assert.deepEqual(evaluate(rows, {kindOf}).wholeUncovered, ['solid']); // whole-set runs name the uncovered kinds but do not refuse
});

test('environment errors (image, page, module, browser, timeout) are NOT_RUN even when both sides show them', () => {
  for (const text of ['QUESTION_IMAGE_LOAD_FAILED: q03.png', 'PAGE_RENDER_ERROR', "Cannot find module 'x'", 'ENOENT: no such file', 'Timeout 30000ms exceeded', "browserType.launch: Executable doesn't exist"]) {
    const r = failRec({code: 'ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL', detailFull: `{"status":"A","detail":"${text}"}`});
    const v = compareItem('i', r, r);
    assert.equal(v.verdict, 'NOT_RUN', text);
    assert.match(v.reason, /environment error/);
  }
  assert.equal(compareItem('i', rec('ARCHIVE_BOUND'), failRec({code: 'ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL', detailFull: 'QUESTION_IMAGE_LOAD_FAILED'})).verdict, 'NOT_RUN');
});

test('a formula the page cannot typeset (MATH_TYPESET_ERROR) is a content verdict, not an environment error; other page render errors stay NOT_RUN', () => {
  const typeset = (extra = '') => failRec({code: 'ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL', stage: 'measure', detailFull: '{"status":"ARCHIVE_PREFLIGHT_FAIL","detail":{"message":"ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL:{errors:[page.waitForFunction: Error: ARCHIVE_PAGE_RENDER_ERROR:MATH_TYPESET_ERROR' + extra + ']}"}}'});
  assert.equal(compareItem('i', typeset(), typeset()).verdict, 'BOTH_FAIL_SAME');
  assert.equal(compareItem('i', rec('ARCHIVE_BOUND'), typeset()).verdict, 'REGRESSED');
  const other = failRec({code: 'ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL', stage: 'measure', detailFull: '{"status":"A","detail":"ARCHIVE_PAGE_RENDER_ERROR:IMAGE_BROKEN"}'});
  assert.equal(compareItem('i', other, other).verdict, 'NOT_RUN');
  assert.equal(compareItem('i', typeset(), other).verdict, 'NOT_RUN');
  // a stored record made before this rule carries envError PAGE_RENDER_ERROR: it is judged again from its text
  assert.equal(compareItem('i', {...typeset(), envError: 'PAGE_RENDER_ERROR'}, {...typeset(), envError: 'PAGE_RENDER_ERROR'}).verdict, 'BOTH_FAIL_SAME');
  // a real environment error next to a typeset error still counts
  assert.equal(compareItem('i', typeset(' ENOENT: no such file'), typeset(' ENOENT: no such file')).verdict, 'NOT_RUN');
});

test('the same failure means the same code, stage and nested status; a failure without a code is never the same', () => {
  assert.equal(compareItem('i', failRec(), failRec()).verdict, 'BOTH_FAIL_SAME');
  assert.equal(compareItem('i', failRec(), failRec({stage: 'capture'})).verdict, 'DIFFERENT');
  assert.equal(compareItem('i', failRec(), failRec({detailFull: '{"status":"COMPOSITE_PANEL_NOT_COMPOSED","detail":{"status":"Y"}}'})).verdict, 'DIFFERENT');
  assert.equal(compareItem('i', failRec({code: null}), failRec({code: null})).verdict, 'NOT_RUN');
  assert.equal(compareItem('i', failRec({code: null}), failRec()).verdict, 'NOT_RUN');
  assert.deepEqual(statusChainOf('{"status":"A","detail":{"status":"B","detail":{"status":"C:d"}}}'), ['A', 'B', 'C:d']);
});

// ---- the snapshot must hold every asset the repo has -------------------------------------------------------------------------
const mkSnap = (root, name, {pngs = {}, svgs = {}, drop = null, planA = null, srcA = null, cross = null, files = {}} = {}) => {
  const dir = path.join(root, name);
  const put = (rel, text) => { const p = path.join(dir, rel); fs.mkdirSync(path.dirname(p), {recursive: true}); fs.writeFileSync(p, text); };
  const fxItems = [{dir: 'itemA', sourcePath: 'archive/exams/original/x/aaa.js', ordinal: 1}, {dir: 'itemB', sourcePath: 'archive/exams/original/x/bbb.js', ordinal: 1}];
  put(MANIFEST, JSON.stringify({items: fxItems}));
  for (const i of fxItems) { put(`${GE}/ops/golden/${i.dir}/plan.json`, JSON.stringify(i.dir === 'itemA' && planA ? planA : {capability: 'stat-chart-figure-v1'})); put(i.sourcePath, i.dir === 'itemA' && srcA ? srcA : 'export default {};'); }
  const bySource = {};
  for (const [uid, src] of [['aaa', fxItems[0].sourcePath], ['bbb', fxItems[1].sourcePath]]) {
    bySource[src] = [`archive/assets/images/${uid}/q01.png`, `archive/assets/images/${uid}/q01-solution.svg`];
    put(bySource[src][0], pngs[uid] ?? 'png-bytes'); put(bySource[src][1], svgs[uid] ?? '<svg/>');
  }
  if (cross) { bySource[fxItems[0].sourcePath].push(cross.path); put(cross.path, cross.bytes); } // an image another exam's folder holds, named by itemA's exam
  for (const [rel, text] of Object.entries(files)) put(rel, text);
  put('.snapshot-assets.json', JSON.stringify({bySource}));
  if (drop) fs.rmSync(path.join(dir, drop));
  return dir;
};

test('a snapshot that lacks an asset the repo has: that item is NOT_RUN and nothing is rendered for it', async () => {
  const root = fs.mkdtempSync(path.join(TMP_ROOT, 'gg-snap-'));
  try {
    const dir = mkSnap(root, 'missing', {drop: 'archive/assets/images/aaa/q01.png'});
    const snap = describeSnapshot(dir, 'fx', {type: 'commit', sha: 'x'});
    assert.deepEqual(Object.keys(snap.blocked), ['itemA']);
    assert.deepEqual(snap.blocked.itemA, ['archive/assets/images/aaa/q01.png']);
    const {results} = await renderItems({snap, itemDirs: ['itemA'], resultsRoot: path.join(root, 'res'), cacheRoot: path.join(root, 'cache'), depsDir: path.join(root, 'deps'), lockDir: path.join(root, 'locks'), envKey: 'env-test'});
    assert.equal(results.get('itemA').status, 'NOT_RUN'); assert.equal(results.get('itemA').code, 'SNAPSHOT_LACKS_ASSET');
    assert.equal(compareItem('itemA', results.get('itemA'), results.get('itemA')).verdict, 'NOT_RUN');
    const whole = describeSnapshot(mkSnap(root, 'whole'), 'fx2', {type: 'commit', sha: 'y'});
    assert.deepEqual(whole.blocked, {});
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('a changed raster (PNG) of one exam changes the key of that exam only, so only its items render again', () => {
  const root = fs.mkdtempSync(path.join(TMP_ROOT, 'gg-snap-'));
  try {
    const a = describeSnapshot(mkSnap(root, 'one'), 'one', {type: 'commit', sha: 'a'});
    const b = describeSnapshot(mkSnap(root, 'two', {pngs: {aaa: 'other png bytes'}}), 'two', {type: 'commit', sha: 'b'});
    const c = describeSnapshot(mkSnap(root, 'three', {svgs: {bbb: '<svg x="1"/>'}}), 'three', {type: 'commit', sha: 'c'});
    const [iA, iB] = a.items;
    assert.equal(a.commonKey, b.commonKey);
    assert.notEqual(a.itemKey(iA), b.itemKey(iA));
    assert.equal(a.itemKey(iB), b.itemKey(iB));
    assert.equal(a.itemKey(iA), c.itemKey(iA));
    assert.notEqual(a.itemKey(iB), c.itemKey(iB));
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('exam assets of any extension are unpacked: the repo folder of a golden exam holds PNG files, and image paths in the exam JS are found', () => {
  const uid = path.posix.basename(items.find(i => /금당고_1학기_기말_고2_수학I\.js$/.test(i.sourcePath))?.sourcePath ?? '', '.js');
  assert.ok(uid, 'golden exam used by item18 not found');
  const files = repoFilesUnder(REPO, {type: 'worktree'}, [`archive/assets/images/${uid}`]);
  assert.ok(files.some(f => /\.png$/i.test(f)), 'no PNG found under the exam asset folder: rasters must be carried');
  assert.ok(files.some(f => /\.svg$/i.test(f)));
  assert.deepEqual(extractImageRefs('a: "q03.png", b: \'assets/images/x/q1.jpg\', c: `../y/z.webp`, d: "not an image.txt"').sort(), ['../y/z.webp', 'assets/images/x/q1.jpg', 'q03.png']);
  assert.deepEqual(refCandidates('q03.png'), []);
  assert.deepEqual(refCandidates('assets/images/x/q1.jpg'), ['archive/assets/images/x/q1.jpg', 'archive/assets/assets/images/x/q1.jpg', 'archive/assets/images/assets/images/x/q1.jpg']);
  assert.deepEqual(refCandidates('archive/assets/images/x/q1.jpg'), ['archive/assets/images/x/q1.jpg']);
});


// ==== round 3: a PASS means something was really compared =====================================================================
// A fixture git repo with two golden items (itemA names an image of another folder, itemB two of a third), built inside the repo's .tmp.
const GG = path.join(path.dirname(fileURLToPath(import.meta.url)), 'golden-gate.mjs');
const sh = (cwd, ...args) => {
  const r = spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'core.autocrlf=false', ...args], {cwd, encoding: 'utf8', windowsHide: true});
  if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${r.stderr}`);
  return r.stdout.trim();
};
const putFile = (root, rel, text) => { const p = path.join(root, rel); fs.mkdirSync(path.dirname(p), {recursive: true}); fs.writeFileSync(p, text); };
const SOLID_FILE = Object.entries(KIND_FILES).find(([, k]) => k.length === 1 && k[0] === 'solid')[0];
const STAT_FILE = `${P}/stat-chart-v1.mjs`;
let fxCache = null;
function fixture() {
  if (fxCache) return fxCache;
  const root = fs.mkdtempSync(path.join(TMP_ROOT, 'gg-git-'));
  const repo = path.join(root, 'repo');
  fs.mkdirSync(repo);
  sh(repo, 'init', '-q');
  const fxItems = [{dir: 'itemA', sourcePath: 'archive/exams/original/x/aaa.js', ordinal: 1}, {dir: 'itemB', sourcePath: 'archive/exams/original/x/bbb.js', ordinal: 1}];
  putFile(repo, MANIFEST, JSON.stringify({items: fxItems}));
  for (const i of fxItems) putFile(repo, `${GE}/ops/golden/${i.dir}/plan.json`, JSON.stringify({capability: 'stat-chart-figure-v1'}));
  putFile(repo, fxItems[0].sourcePath, 'export default {img: "assets/images/other/q23.png"};');
  putFile(repo, fxItems[1].sourcePath, 'export default {a: "assets/images/third/q14.png", b: "assets/images/third/q19.png"};');
  for (const f of ['aaa/q01.png', 'bbb/q01.png', 'other/q23.png', 'third/q14.png', 'third/q19.png']) putFile(repo, `archive/assets/images/${f}`, `png ${f} v1`);
  putFile(repo, STAT_FILE, 'export const v = 1;'); putFile(repo, SOLID_FILE, 'export const v = 1;');
  putFile(repo, 'archive/engine.html', '<html></html>'); putFile(repo, 'docs/notes.md', 'v1');
  const commit = msg => { sh(repo, 'add', '-A'); sh(repo, 'commit', '-q', '-m', msg); return sh(repo, 'rev-parse', 'HEAD'); };
  const c = {c1: commit('base')};
  putFile(repo, 'archive/assets/images/other/q23.png', 'png other/q23 v2'); c.c2 = commit('image in another folder');
  putFile(repo, 'archive/assets/images/third/q14.png', 'png third/q14 v2'); putFile(repo, 'archive/assets/images/third/q19.png', 'png third/q19 v2'); c.c3 = commit('two images in a third folder');
  putFile(repo, 'docs/notes.md', 'v2'); c.c4 = commit('docs only');
  putFile(repo, SOLID_FILE, 'export const v = 2;'); c.c5 = commit('a kind no golden item uses');
  const deps = path.join(root, 'deps'); fs.mkdirSync(path.join(deps, 'node_modules'), {recursive: true}); fs.mkdirSync(path.join(deps, 'python'), {recursive: true});
  fxCache = {root, repo, c, deps, cache: path.join(root, 'cache'), locks: path.join(root, 'locks')};
  return fxCache;
}
const fxSnap = (fx, name) => ensureSnapshot({repo: fx.repo, target: resolveTarget(fx.repo, fx.c[name]), cacheRoot: fx.cache, depsDir: fx.deps});
const cli = (fx, args) => {
  const r = spawnSync(process.execPath, [GG, '--repo', fx.repo, '--cache', fx.cache, '--deps', fx.deps, '--lock-dir', fx.locks, ...args], {encoding: 'utf8', windowsHide: true, env: {...process.env, GEOMETRY_BROWSER_EXECUTABLE: 'no-such-chrome-for-fixture'}});
  return {code: r.status, out: r.stdout, err: r.stderr};
};
const sameCover = rows => evaluate(rows, {});
const noSummary = summarize([]);

// ---- 1. an empty selection never says PASS ------------------------------------------------------------------------------------
test('1: no change, an empty or unknown selection, or an expected-file error never exit 0 with PASS text', () => {
  const fx = fixture();
  const run = (args, want, notWord) => { const r = cli(fx, ['--base', fx.c.c1, '--head', fx.c.c1, ...args]); assert.equal(r.code, want, `${args.join(' ')}\n${r.out}\n${r.err}`); assert.doesNotMatch(r.out, new RegExp(notWord)); return r; };
  assert.match(run([], 2, 'GOLDEN GATE PASS').out, /CANNOT VOUCH/); // base = head
  const empty = cli(fx, ['--base', fx.c.c1, '--head', fx.c.c2, '--families', '']);
  assert.equal(empty.code, 2); assert.match(empty.out, /CANNOT VOUCH/); assert.doesNotMatch(empty.out, /GOLDEN GATE PASS/);
  const unknown = cli(fx, ['--base', fx.c.c1, '--head', fx.c.c2, '--families', 'nonsense-kind']);
  assert.equal(unknown.code, 2); assert.match(unknown.out, /unknown --families/);
  const noKind = cli(fx, ['--base', fx.c.c4, '--head', fx.c.c5]); // a kind change that no golden item uses: nothing selected
  assert.equal(noKind.code, 2); assert.match(noKind.out, /CANNOT VOUCH/); assert.doesNotMatch(noKind.out, /GOLDEN GATE PASS/);
  const bad = path.join(fx.root, 'bad-expected.txt'); fs.writeFileSync(bad, 'itemA DIFFERENT x\n');
  assert.equal(cli(fx, ['--base', fx.c.c1, '--head', fx.c.c1, '--expected', bad]).code, 1); // a wrong expected file is exit 1 whatever the rest says
  assert.equal(cli(fx, ['--base', fx.c.c1, '--head', fx.c.c1, '--expected', path.join(fx.root, 'does-not-exist.txt')]).code, 1);
});

test('1: only "changed files all outside the render and identical render inputs" is UNAFFECTED (exit 0, never the word PASS)', () => {
  const fx = fixture();
  const r = cli(fx, ['--base', fx.c.c3, '--head', fx.c.c4]); // docs/notes.md only
  assert.equal(r.code, 0, r.out + r.err);
  assert.match(r.out, /UNAFFECTED \(nothing compared\)/); assert.doesNotMatch(r.out, /GOLDEN GATE PASS/);
  assert.match(r.out.split('\n')[0], /byte compared 0 \/ selected 0/);
  const d = (more) => decide({rows: [], cover: sameCover([]), summary: noSummary, changedCount: 1, allChangesIgnored: true, inputsIdentical: true, ...more});
  assert.equal(d({}).exit, 0); assert.equal(d({}).outcome, 'UNAFFECTED');
  assert.equal(d({inputsIdentical: false}).exit, 2); // the render inputs differ: ignoring the names is not allowed
  assert.equal(d({allChangesIgnored: false}).exit, 2);
  assert.equal(d({changedCount: 0}).exit, 2);
  assert.equal(d({explicitSelection: true}).exit, 2);
  assert.equal(d({expectedErrors: ['x']}).exit, 1);
});

test('1: decide() is the one exit-code authority: fail first, then cannot-vouch, then pass only with bytes compared', () => {
  const same = compareItem('a', rec('ARCHIVE_BOUND'), rec('ARCHIVE_BOUND'));
  const diff = compareItem('b', rec('ARCHIVE_BOUND'), rec('ARCHIVE_BOUND', {svgSha: 'b'.repeat(64)}));
  const both = compareItem('c', failRec(), failRec());
  const dec = (rows, more = {}) => decide({rows, cover: evaluate(rows, {}), summary: summarize(rows), changedCount: 1, ...more});
  assert.equal(dec([same]).outcome, 'PASS');
  assert.equal(dec([same, diff]).exit, 1);
  assert.equal(dec([both]).exit, 2); // nothing compared byte for byte
  assert.equal(dec([same, both]).exit, 0);
  assert.equal(dec([compareItem('d', rec('NOT_RUN'), rec('ARCHIVE_BOUND'))]).exit, 1);
});

// ---- 2. an item whose own inputs differ is selected, whatever the git file names say --------------------------------------------
test('2: an image in another exam folder, named by a golden exam, selects that exam (git file names alone select nothing)', () => {
  const fx = fixture();
  const b1 = fxSnap(fx, 'c1'), b2 = fxSnap(fx, 'c2'), b3 = fxSnap(fx, 'c3');
  const tgt = n => resolveTarget(fx.repo, fx.c[n]);
  const changed12 = changedFiles(fx.repo, tgt('c1'), tgt('c2'));
  assert.deepEqual(changed12, ['archive/assets/images/other/q23.png']);
  assert.equal(classifyFile(changed12[0], {renderReachable: b1.reachable, items: b1.items}).effect, 'NONE', 'the git name alone says nothing about itemA');
  const sel12 = chooseItems({changed: changed12, baseSnap: b1, headSnap: b2});
  assert.deepEqual(sel12.selected, ['itemA']);
  assert.match(sel12.reasons.join('\n'), /itemA: its own inputs differ/);
  assert.equal(b1.commonKey, b2.commonKey);
  const changed23 = changedFiles(fx.repo, tgt('c2'), tgt('c3'));
  assert.deepEqual(changed23, ['archive/assets/images/third/q14.png', 'archive/assets/images/third/q19.png']);
  assert.deepEqual(chooseItems({changed: changed23, baseSnap: b2, headSnap: b3}).selected, ['itemB']);
  // a run with --families auto does not hide it behind the empty git-name classification
  const r = cli(fx, ['--base', fx.c.c1, '--head', fx.c.c2, '--list']);
  assert.equal(r.code, 0, r.out + r.err); assert.match(r.out, /golden items selected: 1 of 2/); assert.match(r.out, /itemA/);
});

test('2: kind change nobody uses, with the render inputs different and nothing selected, is exit 2 (not a pass, not UNAFFECTED)', () => {
  const fx = fixture();
  const b4 = fxSnap(fx, 'c4'), b5 = fxSnap(fx, 'c5');
  assert.notEqual(b4.commonKey, b5.commonKey);
  const changed = changedFiles(fx.repo, resolveTarget(fx.repo, fx.c.c4), resolveTarget(fx.repo, fx.c.c5));
  const sel = chooseItems({changed, baseSnap: b4, headSnap: b5});
  assert.deepEqual(sel.selected, []);
  const d = decide({rows: [], cover: evaluate([], {}), summary: noSummary, changedCount: changed.length, allChangesIgnored: false, inputsIdentical: false, explicitSelection: false});
  assert.equal(d.exit, 2); assert.match(d.reason, /render inputs differ/);
});

// ---- 3. rules that had no test ---------------------------------------------------------------------------------------------
test('3 NOT_RUN=fail: a run that could not run an item fails the gate and the exit code', () => {
  const rows = [compareItem('a', rec('ARCHIVE_BOUND'), rec('ARCHIVE_BOUND')), compareItem('b', rec('NOT_RUN', {detail: 'x'}), rec('ARCHIVE_BOUND'))];
  assert.equal(rows[1].verdict, 'NOT_RUN');
  assert.equal(summarize(rows).pass, false); assert.equal(summarize(rows).failures.length, 1);
  assert.equal(decide({rows, cover: evaluate(rows, {}), summary: summarize(rows), changedCount: 1}).exit, 1);
});

test('3 bytesCompared: a comparison needs an SVG on BOTH sides', () => {
  const n = (b, h) => bytesCompared(compareItem('i', b, h));
  assert.equal(n(rec('ARCHIVE_BOUND'), rec('ARCHIVE_BOUND')), true);
  assert.equal(n(rec('ARCHIVE_BOUND'), rec('ARCHIVE_BOUND', {svgSha: 'b'.repeat(64)})), true);
  assert.equal(n(rec('ARCHIVE_BOUND'), failRec()), false); // REGRESSED
  assert.equal(n(failRec(), rec('ARCHIVE_BOUND')), false); // FIXED
  assert.equal(n(failRec(), failRec()), false); // BOTH_FAIL_SAME
  assert.equal(n(rec('EXEMPT', {detail: 'a'}), rec('EXEMPT', {detail: 'a'})), false); // SAME, but no bytes
  assert.equal(n(rec('NOT_RUN'), rec('ARCHIVE_BOUND')), false);
  assert.equal(bytesCompared({verdict: 'SAME', base: {status: 'ARCHIVE_BOUND'}, head: {status: 'FAILED'}}), false);
  assert.equal(bytesCompared({verdict: 'SAME', base: {status: 'FAILED'}, head: {status: 'ARCHIVE_BOUND'}}), false);
});

test('3 itemKey covers the plan, the exam source, every asset, and an image of another exam folder the exam names', () => {
  const root = fs.mkdtempSync(path.join(TMP_ROOT, 'gg-key-'));
  try {
    const d = (name, o) => describeSnapshot(mkSnap(root, name, o), name, {type: 'commit', sha: name});
    const base = d('base', {});
    const [iA, iB] = base.items;
    const changedA = (o, label) => {
      const s = d(label, o);
      assert.notEqual(s.itemKey(iA), base.itemKey(iA), `${label}: itemA key must change`);
      assert.equal(s.itemKey(iB), base.itemKey(iB), `${label}: itemB key must not change`);
      assert.equal(s.commonKey, base.commonKey, `${label}: the shared key must not change`);
    };
    changedA({planA: {capability: 'stat-chart-figure-v1', extra: 1}}, 'plan');
    changedA({srcA: 'export default {changed: true};'}, 'source');
    changedA({pngs: {aaa: 'another png'}}, 'png');
    changedA({svgs: {aaa: '<svg id="x"/>'}}, 'svg');
    const withCross = d('cross1', {cross: {path: 'archive/assets/images/other/q23.png', bytes: 'v1'}});
    assert.notEqual(withCross.itemKey(iA), base.itemKey(iA), 'a cross-folder image the exam names counts');
    const crossChanged = d('cross2', {cross: {path: 'archive/assets/images/other/q23.png', bytes: 'v2'}});
    assert.notEqual(crossChanged.itemKey(iA), withCross.itemKey(iA));
    assert.equal(crossChanged.itemKey(iB), withCross.itemKey(iB));
    assert.equal(crossChanged.itemOwnKey(iB), withCross.itemOwnKey(iB));
    assert.notEqual(crossChanged.itemOwnKey(iA), withCross.itemOwnKey(iA), 'the own key (no engine) differs too: that is what selects the item');
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('3 commonKey covers the files the kind table classifies (KINDS and ALL), and ignores files that cannot render', () => {
  const root = fs.mkdtempSync(path.join(TMP_ROOT, 'gg-key-'));
  try {
    const d = (name, files) => describeSnapshot(mkSnap(root, name, {files}), name, {type: 'commit', sha: name});
    const a = d('k0', {[STAT_FILE]: 'v1'});
    assert.notEqual(a.commonKey, d('k1', {[STAT_FILE]: 'v2'}).commonKey, 'a kind file changes the shared key');
    assert.notEqual(a.commonKey, d('k2', {[`${P}/phase2.mjs`]: 'x'}).commonKey, 'an ALL file changes the shared key');
    assert.equal(a.commonKey, d('k3', {[STAT_FILE]: 'v1', [`${P}/AUTHOR_GUIDE.md`]: 'doc'}).commonKey, 'a document does not');
    assert.equal(a.commonKey, d('k4', {[STAT_FILE]: 'v1', 'docs/agents/visual-svg.md': 'doc'}).commonKey);
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('3 asset ITEM classification: a file in a golden exam asset folder selects that exam, any extension, nothing else', () => {
  const uidOf = i => path.posix.basename(i.sourcePath, '.js');
  const [a, b] = [items[0], items.find(i => uidOf(i) !== uidOf(items[0]))];
  for (const ext of ['png', 'jpg', 'svg', 'webp']) {
    const c = classifyFile(`archive/assets/images/${uidOf(a)}/q01.${ext}`, {renderReachable: graph.nodes, items});
    assert.equal(c.effect, 'ITEM', ext); assert.ok(c.items.includes(a.dir), ext); assert.ok(!c.items.includes(b.dir), ext);
  }
  assert.equal(classifyFile('archive/assets/images/not-a-golden-exam/q01.png', {renderReachable: graph.nodes, items}).effect, 'NONE');
});

test('3 unknown capability: an item the table cannot map is selected by every kind run (never skipped)', () => {
  const fx = [{dir: 'x1'}, {dir: 'x2'}];
  const pl = {x1: {capability: 'brand-new-capability-v9'}, x2: {capability: 'stat-chart-figure-v1'}};
  assert.ok(planKinds(pl.x1).has('unknown'));
  assert.deepEqual(selectItems({items: fx, plans: pl, kinds: new Set(['solid'])}), ['x1']);
  assert.deepEqual(selectItems({items: fx, plans: pl, kinds: new Set(['stat'])}), ['x1', 'x2']);
  assert.deepEqual(selectItems({items: fx, plans: pl}), []);
});

test('3 git changes: untracked files count, and a rename is two changed paths (no rename detection)', () => {
  const fx = fixture();
  const repo = fx.repo;
  const oldPath = 'archive/assets/images/aaa/q01.png', newPath = 'archive/assets/images/aaa/q02.png';
  const head0 = sh(repo, 'rev-parse', 'HEAD');
  fs.writeFileSync(path.join(repo, 'archive/assets/images/aaa/untracked.png'), 'new');
  try {
    const wt = changedFiles(repo, resolveTarget(repo, head0), {type: 'worktree'});
    assert.deepEqual(wt, ['archive/assets/images/aaa/untracked.png']);
  } finally { fs.rmSync(path.join(repo, 'archive/assets/images/aaa/untracked.png'), {force: true}); }
  sh(repo, 'mv', oldPath, newPath); sh(repo, 'commit', '-q', '-m', 'rename');
  const renamed = changedFiles(repo, resolveTarget(repo, head0), resolveTarget(repo, 'HEAD'));
  assert.deepEqual(renamed, [oldPath, newPath], 'both the old and the new path');
  assert.deepEqual(changedFiles(repo, resolveTarget(repo, head0), {type: 'worktree'}), [oldPath, newPath]);
  sh(repo, 'reset', '-q', '--hard', head0);
});

test('3 SVG_MISSING: a result that says ARCHIVE_BOUND without an SVG is a failure of the machine, not a comparison', () => {
  const dir = fs.mkdtempSync(path.join(TMP_ROOT, 'gg-harvest-'));
  try {
    fs.writeFileSync(path.join(dir, 'x-result.json'), JSON.stringify({status: 'ARCHIVE_BOUND', capability: 'stat-chart-figure-v1'}));
    const h = harvest(dir, 'x');
    assert.equal(h.rec.status, 'FAILED'); assert.equal(h.rec.code, 'SVG_MISSING'); assert.equal(h.rec.svgSha, null);
    assert.equal(compareItem('x', h.rec, h.rec).verdict, 'NOT_RUN');
    assert.equal(compareItem('x', rec('ARCHIVE_BOUND'), h.rec).verdict, 'NOT_RUN');
    fs.writeFileSync(path.join(dir, 'y-result.json'), JSON.stringify({status: 'ARCHIVE_BOUND'})); fs.writeFileSync(path.join(dir, 'y-solution.svg'), '<svg/>');
    assert.equal(harvest(dir, 'y').rec.status, 'ARCHIVE_BOUND');
    assert.equal(harvest(dir, 'nothing-here'), null);
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});

test('3 cache reuse: a stored result is reused for the same inputs and environment only, and a machine failure is never reused', async () => {
  const root = fs.mkdtempSync(path.join(TMP_ROOT, 'gg-cache-'));
  try {
    const snap = describeSnapshot(mkSnap(root, 's'), 's', {type: 'commit', sha: 's'});
    const other = describeSnapshot(mkSnap(root, 's2', {planA: {capability: 'stat-chart-figure-v1', n: 2}}), 's2', {type: 'commit', sha: 's2'});
    const [iA] = snap.items;
    assert.notEqual(resultKey(snap, iA, 'env1'), resultKey(snap, iA, 'env2'), 'the environment is part of the key');
    assert.notEqual(resultKey(snap, iA, 'env1'), resultKey(other, other.items[0], 'env1'), 'the render inputs are part of the key');
    assert.equal(resultKey(snap, iA, 'env1'), resultKey(snap, iA, 'env1'));
    const res = path.join(root, 'res');
    const put = (key, record) => { const dir = storeDir(res, key); fs.mkdirSync(dir, {recursive: true}); fs.writeFileSync(path.join(dir, 'record.json'), JSON.stringify(record)); };
    put(resultKey(snap, iA, 'env1'), {item: 'itemA', status: 'ARCHIVE_BOUND', svgSha: 'f'.repeat(64), svgBytes: 5});
    const opts = {snap, itemDirs: ['itemA'], resultsRoot: res, cacheRoot: path.join(root, 'cache'), depsDir: path.join(root, 'deps'), lockDir: path.join(root, 'locks')};
    const hit = await renderItems({...opts, envKey: 'env1'});
    assert.equal(hit.results.get('itemA').fromCache, true); assert.equal(hit.stats.cached, 1);
    assert.equal(loadResult(res, resultKey(snap, iA, 'env2')), null, 'another environment finds nothing');
    assert.equal(loadResult(res, resultKey(other, other.items[0], 'env1')), null, 'other render inputs find nothing');
    assert.equal(reusable({status: 'ARCHIVE_BOUND'}), true); assert.equal(reusable({status: 'FAILED', code: 'X', detailFull: 'plain failure'}), true);
    assert.equal(reusable({status: 'FAILED', code: 'WORKER_TIMEOUT'}), false); assert.equal(reusable({status: 'FAILED', code: 'X', detailFull: 'Timeout 30000ms exceeded'}), false);
    assert.equal(reusable(null), false);
    await assert.rejects(() => renderItems({...opts}), /environment fingerprint/);
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('3 lazy import: a python import inside a function is lazy, a top-level one is not, and a dispatcher may only use a kind file lazily', () => {
  const root = fs.mkdtempSync(path.join(TMP_ROOT, 'gg-graph-'));
  try {
    putFile(root, `${P}/a.mjs`, "import './b.mjs';\nexport const f = async () => import('./c.mjs');\n");
    putFile(root, `${P}/b.mjs`, 'export const b = 1;'); putFile(root, `${P}/c.mjs`, 'export const c = 1;');
    putFile(root, `${P}/worker.py`, 'from kmod import f\n\ndef g():\n    from lmod import h\n    return h\n');
    putFile(root, `${P}/kmod.py`, 'f = 1\n'); putFile(root, `${P}/lmod.py`, 'h = 1\n');
    const g = buildCodeGraph(root, [`${P}/a.mjs`, `${P}/worker.py`]);
    const lazyOf = f => g.importers.get(f).map(e => e.lazy);
    assert.deepEqual(lazyOf(`${P}/b.mjs`), [false]); assert.deepEqual(lazyOf(`${P}/c.mjs`), [true]);
    assert.deepEqual(lazyOf(`${P}/kmod.py`), [false]); assert.deepEqual(lazyOf(`${P}/lmod.py`), [true]);
    const dispatchers = new Set([`${P}/worker.py`]);
    const problems = kindTableProblems({graph: g, kindFiles: {[`${P}/kmod.py`]: ['stat'], [`${P}/lmod.py`]: ['stat']}, dispatchers, exceptions: {}});
    assert.equal(problems.length, 1); assert.match(problems[0], /kmod\.py is imported at the top of .*worker\.py/);
    // a kind file used by a file of another kind, or an unlisted file, is a problem; an exception with a reason is not
    const g2 = {importers: new Map([[`${P}/s.mjs`, [{from: `${P}/other.mjs`, lazy: false}]]])};
    assert.equal(kindTableProblems({graph: g2, kindFiles: {[`${P}/s.mjs`]: ['stat']}, dispatchers: new Set(), exceptions: {}}).length, 1);
    assert.equal(kindTableProblems({graph: g2, kindFiles: {[`${P}/s.mjs`]: ['stat']}, dispatchers: new Set(), exceptions: {[`${P}/s.mjs`]: [`${P}/other.mjs`]}}).length, 0);
    assert.equal(kindTableProblems({graph: g2, kindFiles: {[`${P}/s.mjs`]: ['stat'], [`${P}/other.mjs`]: ['stat']}, dispatchers: new Set(), exceptions: {}}).length, 0);
    assert.equal(kindTableProblems({graph: g2, kindFiles: {[`${P}/s.mjs`]: ['stat'], [`${P}/other.mjs`]: ['solid']}, dispatchers: new Set(), exceptions: {}}).length, 1);
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('3 duplicate expected: the same item twice in the expected file is an error, and an error fails the gate', () => {
  const e = parseExpected('itemA DIFFERENT first reason that is long enough\nitemA DIFFERENT second reason that is long enough\n');
  assert.equal(e.entries.length, 1); assert.match(e.errors.join('\n'), /itemA is listed twice/);
  const rows = [compareItem('itemA', rec('ARCHIVE_BOUND'), rec('ARCHIVE_BOUND', {svgSha: 'b'.repeat(64)}))];
  const applied = applyExpected(rows, e);
  assert.equal(summarize(rows, applied).pass, false);
  assert.equal(decide({rows, cover: evaluate(rows, {}), summary: summarize(rows, applied), expectedErrors: applied.errors, changedCount: 1}).exit, 1);
});

// ---- 4. the environment is part of the stored-result key -------------------------------------------------------------------------
test('4: the environment fingerprint changes with the python packages, and a stored result key changes with it', () => {
  const root = fs.mkdtempSync(path.join(TMP_ROOT, 'gg-env-'));
  const old = process.env.GEOMETRY_BROWSER_EXECUTABLE; process.env.GEOMETRY_BROWSER_EXECUTABLE = 'no-such-chrome-for-fixture';
  try {
    const mk = (name, pkgs) => { const d = path.join(root, name); fs.mkdirSync(path.join(d, 'node_modules'), {recursive: true}); fs.mkdirSync(path.join(d, 'python'), {recursive: true}); for (const p of pkgs) fs.mkdirSync(path.join(d, 'python', p)); return d; };
    const a = environmentFingerprint({depsDir: mk('a', ['numpy-1.0.dist-info'])});
    assert.equal(a.key, environmentFingerprint({depsDir: mk('a2', ['numpy-1.0.dist-info'])}).key, 'the same environment gives the same key');
    assert.notEqual(a.key, environmentFingerprint({depsDir: mk('b', ['numpy-2.0.dist-info'])}).key);
    for (const field of ['chrome', 'node', 'python', 'os', 'fontNotoSansKR', 'pythonPackages', 'nodePackages']) assert.ok(field in a, `the fingerprint lists ${field}`);
  } finally { if (old === undefined) delete process.env.GEOMETRY_BROWSER_EXECUTABLE; else process.env.GEOMETRY_BROWSER_EXECUTABLE = old; fs.rmSync(root, {recursive: true, force: true}); }
});

// ---- 5. a changed kind table never reuses old keys -----------------------------------------------------------------------------
test('5: stored snapshot keys are reused only under the same kind table version', () => {
  const root = fs.mkdtempSync(path.join(TMP_ROOT, 'gg-ver-'));
  try {
    assert.match(KINDS_VERSION, /^[0-9a-f]{12}$/);
    const dir = mkSnap(root, 's');
    const fresh = describeSnapshot(dir, 's', {type: 'commit', sha: 's'});
    const keyFile = path.join(dir, '.snapshot-keys.json');
    const keys = JSON.parse(fs.readFileSync(keyFile, 'utf8'));
    assert.equal(keys.kindsVersion, KINDS_VERSION);
    fs.writeFileSync(keyFile, JSON.stringify({...keys, commonKey: 'stale-common-key'}));
    assert.equal(describeSnapshot(dir, 's', {type: 'commit', sha: 's'}).commonKey, 'stale-common-key', 'the same version reuses the stored keys');
    fs.writeFileSync(keyFile, JSON.stringify({...keys, kindsVersion: 'an-older-table', commonKey: 'stale-common-key'}));
    const again = describeSnapshot(dir, 's', {type: 'commit', sha: 's'});
    assert.equal(again.commonKey, fresh.commonKey, 'another table version recomputes the keys');
    assert.equal(JSON.parse(fs.readFileSync(keyFile, 'utf8')).kindsVersion, KINDS_VERSION);
    // the version is also inside the key itself: the same files under another table give another key
    const lines = ['a' + String.fromCharCode(0) + 'x'];
    assert.notEqual(commonKeyOf('table-v1', lines), commonKeyOf('table-v2', lines));
    assert.equal(commonKeyOf('table-v1', lines), commonKeyOf('table-v1', lines));
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

// ---- 6. a golden item that is gone, a test that stops running -----------------------------------------------------------------------
test('1: CLI with identical render inputs and an explicit --families all: UNAFFECTED (nothing compared), byte compared 0, never PASS', () => {
  const fx = fixture();
  const old = process.env.GEOMETRY_BROWSER_EXECUTABLE; process.env.GEOMETRY_BROWSER_EXECUTABLE = 'no-such-chrome-for-fixture';
  try {
    const env = environmentFingerprint({depsDir: fx.deps});
    const snap = fxSnap(fx, 'c3');
    for (const it of snap.items) { // the base results are already stored, so no render is needed
      const dir = storeDir(path.join(fx.cache, 'results'), resultKey(snap, it, env.key)); fs.mkdirSync(dir, {recursive: true});
      fs.writeFileSync(path.join(dir, 'record.json'), JSON.stringify({item: it.dir, status: 'ARCHIVE_BOUND', code: null, stage: null, svgSha: 'c'.repeat(64), svgBytes: 9, sizeClass: 'full', solutionImageScale: null}));
    }
    const r = cli(fx, ['--base', fx.c.c3, '--head', fx.c.c4, '--families', 'all']);
    assert.equal(r.code, 0, r.out + r.err);
    assert.match(r.out.split('\n')[0], /byte compared 0 \/ selected 2/);
    assert.match(r.out, /UNAFFECTED \(nothing compared\)/); assert.doesNotMatch(r.out, /GOLDEN GATE PASS/);
  } finally { if (old === undefined) delete process.env.GEOMETRY_BROWSER_EXECUTABLE; else process.env.GEOMETRY_BROWSER_EXECUTABLE = old; }
});

test('5: the kind table version also covers the classification rule code (kinds.mjs, select.mjs)', () => {
  assert.deepEqual([...RULE_FILES].sort(), ['kinds.mjs', 'select.mjs']);
  const src = readRuleSources();
  assert.equal(src.length, 2); assert.ok(src[0].includes('export function classifyFile')); assert.ok(src[1].includes('export function chooseItems'));
  assert.equal(KINDS_VERSION, kindsVersionOf(currentTable(), src));
  assert.notEqual(kindsVersionOf(currentTable(), src), kindsVersionOf(currentTable(), [src[0] + ' ', src[1]]), 'a changed classifyFile/planKinds/selectItems changes the version');
  assert.notEqual(kindsVersionOf(currentTable(), src), kindsVersionOf(currentTable(), [src[0], src[1] + ' ']), 'a changed chooseItems changes the version');
});

test('1: a head result reused from base (identical render inputs) is UNAFFECTED, never PASS, and compares nothing, even with an explicit --families', () => {
  const rows = [compareItem('a', rec('ARCHIVE_BOUND'), rec('ARCHIVE_BOUND'))];
  assert.equal(evaluate(rows, {}).byteCompared, 1);
  assert.equal(evaluate(rows, {reused: true}).byteCompared, 0);
  const d = more => decide({rows, cover: evaluate(rows, {reused: more.reusedHead}), summary: summarize(rows), changedCount: 1, explicitSelection: true, inputsIdentical: true, ...more});
  assert.equal(d({reusedHead: true}).outcome, 'UNAFFECTED'); assert.equal(d({reusedHead: true}).exit, 0);
  assert.equal(d({reusedHead: false}).outcome, 'PASS'); // two separate renders (--no-cache) may say PASS
  const bad = [compareItem('a', rec('NOT_RUN'), rec('NOT_RUN'))];
  assert.equal(decide({rows: bad, cover: evaluate(bad, {reused: true}), summary: summarize(bad), changedCount: 1, reusedHead: true}).exit, 1, 'a failure still fails');
});

test('6: a golden item only on base is REMOVED and fails; an item only on head is ADDED and listed', () => {
  const rows = [compareItem('a', rec('ARCHIVE_BOUND'), rec('ARCHIVE_BOUND')), removedRow('gone')];
  assert.equal(rows[1].verdict, 'REMOVED');
  const s = summarize(rows); assert.equal(s.pass, false); assert.equal(s.failures.length, 1);
  assert.equal(decide({rows, cover: evaluate(rows, {}), summary: s, changedCount: 1}).exit, 1);
  assert.equal(decide({rows: [removedRow('gone')], cover: evaluate([removedRow('gone')], {}), summary: summarize([removedRow('gone')]), changedCount: 1}).exit, 1, 'REMOVED fails even when nothing else was compared');
  const added = [compareItem('a', rec('ARCHIVE_BOUND'), rec('ARCHIVE_BOUND')), addedRow('fresh', rec('ARCHIVE_BOUND'))];
  assert.equal(added[1].verdict, 'ADDED'); assert.equal(summarize(added).pass, true); assert.equal(summarize(added).listed.length, 1);
  const accepted = applyExpected(rows, parseExpected('gone REMOVED the item was retired on purpose in this change\n'));
  assert.equal(accepted.errors.length, 0); assert.equal(summarize(rows, accepted).pass, true);
});

test('1: no change is exit 2 even when an explicit selection has rows (base = head compares a tree with itself)', () => {
  const rows = [compareItem('a', rec('ARCHIVE_BOUND'), rec('ARCHIVE_BOUND'))];
  const d = more => decide({rows, cover: evaluate(rows, {}), summary: summarize(rows), explicitSelection: true, inputsIdentical: true, ...more});
  assert.equal(d({changedCount: 0}).exit, 2); assert.match(d({changedCount: 0}).reason, /do not differ/);
  assert.equal(d({changedCount: 1}).exit, 0);
});

test('6: engine tests that passed on base and are skipped or deleted on head fail like a new failure', () => {
  const F = `${GE}/tests/x.test.mjs`;
  const base = {[F]: {names: {keep: 'pass', skipped: 'pass', deleted: 'pass', wasSkipped: 'skip', wasFailing: 'fail'}}};
  const head = {[F]: {names: {keep: 'pass', skipped: 'skip', wasSkipped: 'skip', wasFailing: 'skip'}}};
  const r = compareTests(base, head, [F]);
  assert.equal(r.lost.length, 2); assert.match(r.lost.join('\n'), /skipped.*skipped on head/); assert.match(r.lost.join('\n'), /deleted.*missing on head/);
  assert.deepEqual(r.newFailures, []);
  assert.equal(compareTests(base, base, [F]).lost.length, 0);
  assert.equal(testsFail(r), true); assert.equal(testsFail({newFailures: ['x'], lost: []}), true); assert.equal(testsFail({newFailures: [], lost: []}), false);
});

// ---- 7. locks and snapshots: nothing of another process is deleted --------------------------------------------------------------------
test('7: a render slot is released only by its owner (a stale lock another process took is left alone)', async () => {
  const root = fs.mkdtempSync(path.join(TMP_ROOT, 'gg-lock-'));
  try {
    const lockDir = path.join(root, 'locks');
    const mine = await acquireSlot({lockDir, slots: 1, pollMs: 10});
    assert.ok(fs.existsSync(mine.dir));
    fs.writeFileSync(path.join(mine.dir, 'owner'), 'someone else took this slot'); // my lock went stale and another process holds the slot now
    mine.release();
    assert.ok(fs.existsSync(mine.dir), 'a lock that is no longer ours is not removed');
    fs.rmSync(mine.dir, {recursive: true, force: true});
    const own = await acquireSlot({lockDir, slots: 1, pollMs: 10});
    own.release();
    assert.ok(!fs.existsSync(own.dir), 'our own lock is released');
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('7: a snapshot is built in a folder of its own and renamed into place; a folder another process is building is never touched', () => {
  const fx = fixture();
  const foreign = path.join(fx.cache, 'snapshots', 'c-tmp-99999-abcdef.part'); // another process, still building
  fs.mkdirSync(foreign, {recursive: true}); fs.writeFileSync(path.join(foreign, 'half-written.txt'), 'in progress');
  const s1 = fxSnap(fx, 'c1');
  assert.ok(fs.existsSync(path.join(foreign, 'half-written.txt')), 'the other process folder is untouched');
  assert.ok(fs.existsSync(path.join(s1.dir, '.snapshot-complete')));
  assert.deepEqual(fs.readdirSync(path.join(fx.cache, 'snapshots')).filter(n => n.endsWith('.part') && n !== 'c-tmp-99999-abcdef.part'), [], 'our own part folder is gone');
  const again = fxSnap(fx, 'c1');
  assert.equal(again.dir, s1.dir); assert.equal(again.commonKey, s1.commonKey);
  assert.ok(fs.existsSync(path.join(foreign, 'half-written.txt')));
});

test('zz fixture cleanup', () => { if (fxCache) { fs.rmSync(fxCache.root, {recursive: true, force: true}); fxCache = null; } });

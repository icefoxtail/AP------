// Fast tests of the golden gate (no browser, no render): verdict rules, the kind table and the checks that keep the table honest.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {compareItem, parseExpected, applyExpected, summarize} from './lib/judge.mjs';
import {
  GE, KINDS, CAPABILITY_KIND, KIND_FILES, SHARED_FILES, SHARED_PREFIXES, SHARED_EXACT, NON_RENDER_FILES, DISPATCHERS, IMPORT_EXCEPTIONS,
  planKinds, planCapabilities, classifyFile, parseFamilies, selectItems
} from './lib/kinds.mjs';
import {buildCodeGraph} from './lib/code-graph.mjs';
import {SNAPSHOT_SPECS, RENDER_PLAN} from './lib/snapshot.mjs';
import {parseTapForTest, parseUnittestForTest} from './lib/tests-run.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../..');
const manifest = JSON.parse(fs.readFileSync(path.join(REPO, GE, 'ops/golden.manifest.json'), 'utf8'));
const items = manifest.items;
const plans = Object.fromEntries(items.map(i => [i.dir, JSON.parse(fs.readFileSync(path.join(REPO, GE, 'ops/golden', i.dir, 'plan.json'), 'utf8'))]));
const graph = buildCodeGraph(REPO, [RENDER_PLAN]);
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
  const problems = [];
  for (const [file, kinds] of Object.entries(KIND_FILES)) {
    for (const {from, lazy} of graph.importers.get(file) ?? []) {
      if (DISPATCHERS.has(from)) { if (from.endsWith('worker.py') && !lazy) problems.push(`${file} is imported at the top of ${from}, so every request kind loads it`); continue; }
      if ((IMPORT_EXCEPTIONS[file] ?? []).includes(from)) continue;
      const importerKinds = KIND_FILES[from];
      if (importerKinds && importerKinds.every(k => kinds.includes(k))) continue; // the importer only runs for kinds this file already selects
      if (importerKinds && from.endsWith('composite-candidate-svg-v1.mjs')) continue; // the panel dispatcher: panels are selected through planKinds() of the composite plan
      problems.push(`${file} (kinds ${kinds.join('+')}) is imported by ${from}${importerKinds ? ` (kinds ${importerKinds.join('+')})` : ' (shared or unlisted)'}; list it as ALL, or add an IMPORT_EXCEPTION with the reason`);
    }
  }
  assert.deepEqual(problems, []);
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

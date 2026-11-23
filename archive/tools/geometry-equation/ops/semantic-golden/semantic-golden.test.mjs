// Tests of the semantic golden table and runner (ops/semantic-golden). Three layers:
//   1. the table format and the registries: no engine code (they also run where there is no python);
//   2. the named mutations: python standard library only, plus the javascript capture mutation;
//   3. the table itself against the real observers and generators, and the runner's own verdicts (neutralised mutation, KNOWN_GAP, wrong expectation):
//      need the render dependencies (sympy, mathjax) and are skipped where they are not installed (the CI test shards), as graph-g-bundle.test.mjs does.
import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {GENERATOR_KINDS, OBSERVER_MUTATIONS, codeMatches, exitCode, hasPythonDeps, loadTable, runTable, summarize, validateTable} from './semantic-golden.mjs';
import {MUTATIONS, MutationNotApplicable, axisValueCapture, observeCapture} from './layout-capture.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const python = process.env.GEOMETRY_PYTHON || process.env.PYTHON || 'python';
const hasPython = (() => { try { return spawnSync(python, ['-c', 'pass'], {stdio: 'ignore'}).status === 0; } catch { return false; } })();
const deps = await hasPythonDeps();
const table = loadTable();
const clone = () => structuredClone(table);

// ---------------------------------------------------------------------------------------------------------------- 1. format
test('the table is well formed and holds the five reported defects', () => {
  assert.deepEqual(validateTable(table), []);
  const ids = table.rows.map(row => row.id);
  for (const id of ['exp-factor-glued', 'degree-pi-drawn-angle', 'axis-title-z', 'area-label-beside-side', 'minus-pi-tick-reads-as-y']) assert.ok(ids.includes(id), id);
  assert.ok(table.rows.length >= 5);
  for (const row of table.rows.filter(r => r.observer)) assert.ok(row.mutations.length >= 1, row.id);
});

test('the format check refuses what would make a row pass for the wrong reason', () => {
  const bad = (mutate, expected) => {
    const copy = clone(); mutate(copy);
    const problems = validateTable(copy);
    assert.ok(problems.some(p => p.includes(expected)), `${expected} in ${JSON.stringify(problems)}`);
  };
  bad(t => { t.rows[1].id = t.rows[0].id; }, 'duplicate id');
  bad(t => { t.rows[0].expect = 'MAYBE'; }, 'expect must be PASS or REJECT');
  bad(t => { t.rows[0].expect = 'REJECT:lowercase'; }, 'expect must be PASS or REJECT');
  bad(t => { t.rows[0].mutations[0].name = 'no-such-mutation'; }, 'name must be one of');
  bad(t => { t.rows[0].mutations[0].expect = 'x'; }, "refusal code");
  bad(t => { t.rows[0].mutations = []; }, 'needs mutations');
  bad(t => { t.rows[0].reuses = []; }, 'reuses[] required');
  bad(t => { t.rows[0].reuses = ['archive/no/such/file.test.mjs']; }, 'does not exist');
  bad(t => { t.rows[0].generator.kind = 'invented'; }, 'generator.kind');
  bad(t => { t.rows[0].plan = 'plans/missing.json'; }, 'does not exist');
  bad(t => { t.rows[0].mutations[0].knownGap = 'short'; }, 'knownGap');
  bad(t => { t.rows[1].mutations = [{name: 'glue-exp-factor', expect: 'X_Y'}]; }, 'mutations without an observer');
  assert.deepEqual(validateTable({schema: 'semantic-golden-table-v1', rows: []}), []);
  assert.ok(validateTable({rows: []}).length > 0);
});

test('a refusal code matches itself and its detail, never a longer name', () => {
  assert.ok(codeMatches('AXIS_TITLE_TEXT_MISMATCH:x', 'AXIS_TITLE_TEXT_MISMATCH'));
  assert.ok(codeMatches('AXIS_TITLE_TEXT_MISMATCH', 'AXIS_TITLE_TEXT_MISMATCH'));
  assert.ok(!codeMatches('AXIS_TITLE_TEXT_MISMATCH_X', 'AXIS_TITLE_TEXT_MISMATCH'));
  assert.ok(!codeMatches(undefined, 'A'));
});

test('the python registry lists exactly the names the table may use', {skip: !hasPython}, () => {
  const run = spawnSync(python, ['-X', 'utf8', path.join(here, 'semantic_golden.py')], {input: JSON.stringify({phase: 'registry'}), encoding: 'utf8'});
  assert.equal(run.status, 0, run.stderr);
  const registry = JSON.parse(run.stdout);
  assert.deepEqual([...registry.generators, 'construction-marks'].sort(), [...GENERATOR_KINDS].sort());   // construction-marks runs on the node side (specFor)
  const js = Object.fromEntries(Object.entries(OBSERVER_MUTATIONS).filter(([kind]) => kind !== 'layout-capture'));
  assert.deepEqual(registry.observers, js);
  assert.deepEqual(Object.keys(MUTATIONS), OBSERVER_MUTATIONS['layout-capture']);
});

// ---------------------------------------------------------------------------------------------------------------- 2. mutations
test('python SVG mutations (standard library) change what they say and refuse to do nothing', {skip: !hasPython}, () => {
  const run = spawnSync(python, ['-m', 'unittest', 'test_semantic_mutations'], {cwd: here, encoding: 'utf8'});
  assert.equal(run.status, 0, String(run.stderr).slice(-3000));
});

test('minus-pi-tick-as-y moves the label off its tick and the observer refuses exactly that', async () => {
  const box = {x: 89, y: 160, width: 22, height: 16};
  const normal = axisValueCapture({box});
  assert.deepEqual(await observeCapture(normal, {codePrefix: 'AXIS_VALUE_LABEL'}), []);
  const moved = MUTATIONS['minus-pi-tick-as-y'](normal, {dy: 40});
  assert.notDeepEqual(moved, normal);
  assert.deepEqual(normal.labels[0].client, box, 'the mutation does not touch its input');
  assert.deepEqual(await observeCapture(moved, {codePrefix: 'AXIS_VALUE_LABEL'}), ['AXIS_VALUE_LABEL_NOT_ADJACENT:interval-end-label']);
  assert.throws(() => MUTATIONS['minus-pi-tick-as-y'](normal, {dx: 0, dy: 0}), MutationNotApplicable);
});

// ---------------------------------------------------------------------------------------------------------------- 3. the table against the engine
const SLOW = {skip: !deps, timeout: 600000};

test('every row of the table gives its verdict and every mutation is refused with its code', SLOW, async () => {
  const report = await runTable(table);
  assert.deepEqual(report.format, []);
  const bad = report.rows.filter(row => row.status !== 'OK');
  assert.deepEqual(bad, [], JSON.stringify(bad, null, 1).slice(0, 4000));
  const counts = summarize(report);
  assert.equal(counts.fail, 0);
  assert.equal(exitCode(report), 0);
});

// a row in the table fails when its mutation is switched off: the check is not a pass whatever the observer says
test('a row whose mutation does nothing FAILS (each mutation switched off in turn)', SLOW, async () => {
  const observers = table.rows.filter(row => row.observer);
  const names = [...new Set(observers.flatMap(row => row.mutations.map(m => m.name)))];
  const report = await runTable({...table, rows: observers}, {neutralize: names});
  for (const row of report.rows) {
    assert.equal(row.status, 'FAIL', row.id);
    assert.ok(row.mutations.every(m => m.status === 'FAIL'), row.id + JSON.stringify(row.mutations));
  }
  assert.equal(exitCode(report), 1);
});

const one = id => { const copy = clone(); copy.rows = copy.rows.filter(row => row.id === id); return copy; };

test('a wrong expectation fails and a KNOWN_GAP is listed apart, never counted as a pass', SLOW, async () => {
  const tick = one('minus-pi-tick-reads-as-y');
  const wrongGenerator = structuredClone(tick); wrongGenerator.rows[0].expect = 'REJECT:LAYOUT_UNRESOLVED';
  const generatorReport = await runTable(wrongGenerator);
  assert.equal(generatorReport.rows[0].status, 'FAIL');
  assert.equal(exitCode(generatorReport), 1);

  const gap = structuredClone(tick);   // the observer does not refuse with this code: without knownGap that is a failure ...
  gap.rows[0].mutations = [{name: 'minus-pi-tick-as-y', args: {dy: 40}, expect: 'AXIS_VALUE_LABEL_NOT_THERE'}];
  const failing = await runTable(gap);
  assert.equal(failing.rows[0].mutations[0].status, 'FAIL');
  gap.rows[0].mutations[0].knownGap = 'the observer has no rule for this yet (test fixture)';   // ... and with it a gap that is shown, not passed
  const gapped = await runTable(gap);
  assert.equal(gapped.rows[0].mutations[0].status, 'KNOWN_GAP');
  const counts = summarize(gapped);
  assert.equal(counts.knownGap, 1);
  assert.equal(counts.pass, 1, 'only the generator verdict passed');
  assert.equal(exitCode(gapped), 0);

  const closed = structuredClone(tick);   // a gap the observer now closes must be taken out of the table
  closed.rows[0].mutations[0].knownGap = 'was not refused before (test fixture)';
  const closedReport = await runTable(closed);
  assert.equal(closedReport.rows[0].mutations[0].status, 'FAIL');
  assert.match(closedReport.rows[0].mutations[0].note, /remove knownGap/);
});

test('--ids runs only the named rows and a mutation that fits nothing is reported, not skipped', SLOW, async () => {
  const report = await runTable(table, {ids: ['axis-title-z']});
  assert.deepEqual(report.rows.map(row => row.id), ['axis-title-z']);
  assert.equal(report.rows[0].status, 'OK');
  const broken = one('axis-title-z');
  broken.rows[0].mutations = [{name: 'rename-axis-title', args: {axis: 'q', to: 'Z'}, expect: 'AXIS_TITLE_TEXT_MISMATCH'}];
  const result = await runTable(broken);
  assert.equal(result.rows[0].mutations[0].status, 'FAIL');
  assert.match(result.rows[0].mutations[0].note, /not applicable/);
});

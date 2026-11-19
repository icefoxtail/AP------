'use strict';
// CI runs the full test registry as a matrix of shards (tools/ci/test-shard.cjs) and one aggregate job named `test`.
// These checks pin the properties that make that safe: every test command runs in exactly one shard, the split is
// deterministic, a missing/failed shard can never look like a pass, and the check name `test` is kept.
// No operating-data counts are pinned; only defect conditions (missing, duplicated, unstable) are checked.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repo = path.join(__dirname, '..');
const shard = require('../tools/ci/test-shard.cjs');
const { collectTests, requiredCommands } = require('../tools/run-tests.js');

const registryNames = () => {
  const { tests } = collectTests();
  return [...tests, ...requiredCommands.map(command => command.label)].map(name => ({ name }));
};
const names = items => items.map(item => item.name);

test('parseShardArg accepts i/n and rejects everything else', () => {
  assert.deepEqual(shard.parseShardArg('2/3'), { index: 2, total: 3 });
  assert.deepEqual(shard.parseShardArg('1/1'), { index: 1, total: 1 });
  for (const bad of ['', '0/3', '4/3', '1/0', '1-3', 'a/b', '1/3/5', undefined, null, '01/3x']) {
    assert.throws(() => shard.parseShardArg(bad), /usage|greater/, String(bad));
  }
});

test('run-tests.js rejects a malformed --shard before doing any work', () => {
  for (const args of [['--shard', '4/3'], ['--shard'], ['--shard', 'x'], ['--bogus']]) {
    const run = spawnSync(process.execPath, ['tools/run-tests.js', ...args], { cwd: repo, encoding: 'utf8', timeout: 30000 });
    assert.notEqual(run.status, 0, args.join(' '));
    assert.match(run.stderr, /usage|greater/, args.join(' '));
  }
});

test('the real registry splits into disjoint shards whose union is every test command', () => {
  const all = registryNames();
  assert.equal(new Set(names(all)).size, all.length, 'test command names are unique');
  for (const total of [1, 2, 3, 4, 7]) {
    const seen = new Map();
    for (let index = 1; index <= total; index += 1) {
      for (const item of shard.selectShard(all, { index, total })) {
        assert.ok(!seen.has(item.name), `${item.name} is in shards ${seen.get(item.name)} and ${index} of ${total}`);
        seen.set(item.name, index);
      }
    }
    assert.deepEqual([...seen.keys()].sort(), names(all).sort(), `union of ${total} shards`);
  }
});

test('the split is deterministic and does not depend on input order', () => {
  const all = registryNames();
  const shuffled = [...all].sort((a, b) => (a.name < b.name ? 1 : -1));
  for (let index = 1; index <= 3; index += 1) {
    const first = names(shard.selectShard(all, { index, total: 3 }));
    assert.deepEqual(names(shard.selectShard(all, { index, total: 3 })), first, 'same input, same shard');
    assert.deepEqual(new Set(names(shard.selectShard(shuffled, { index, total: 3 }))), new Set(first), 'same shard for reordered input');
  }
});

test('a test missing from the duration file, and a stale duration key, are placed exactly once', () => {
  const durations = { seconds: { 'known.test.js': 40, 'ghost-removed.test.js': 90 }, defaultSeconds: 5 };
  const items = [{ name: 'known.test.js' }, { name: 'brand-new.test.js' }, { name: 'another-new.test.mjs' }, { name: 'tests/x.mjs' }];
  const placed = [1, 2, 3].flatMap(index => names(shard.selectShard(items, { index, total: 3 }, durations)));
  assert.deepEqual(placed.sort(), names(items).sort());
  assert.deepEqual(names(shard.selectShard(items, { index: 1, total: 1 }, durations)), names(items));
});

test('the duration file is well formed and balances the real registry within one test of equal', () => {
  const durations = shard.loadDurations();
  assert.ok(durations.defaultSeconds > 0);
  for (const [name, value] of Object.entries(durations.seconds)) assert.ok(Number.isFinite(value) && value > 0, name);
  const all = registryNames();
  for (const total of [2, 3, 4]) {
    const { load } = shard.assignShards(all, total, durations);
    const heaviest = Math.max(...all.map(item => durations.seconds[item.name] ?? durations.defaultSeconds));
    assert.ok(Math.max(...load) - Math.min(...load) <= heaviest + 1e-9, `${total} shards: load spread ${Math.max(...load) - Math.min(...load)} vs heaviest ${heaviest}`);
  }
});

test('a scoped run is shared out too: tests are disjoint, syntax checks and package preparation follow the rules', async () => {
  const { shardScopedCommands } = await import('../tools/ci/run-scoped-tests.mjs');
  const pkg = ['archive/tools/build-archive2-catalog.mjs', '--package-only'];
  const syntax = [['--check', 'tools/a.js'], ['--check', 'tools/b.mjs']];
  const tests = Array.from({ length: 9 }, (_, i) => ['--test', `tests/scoped-${i}.test.mjs`]);
  const commands = [...syntax, pkg, ...tests];
  const durations = { seconds: {}, defaultSeconds: 5 };
  const runs = [1, 2, 3].map(index => shardScopedCommands(commands, { index, total: 3 }, durations));
  const key = args => JSON.stringify(args);
  const ranTests = runs.flatMap(run => run.filter(args => args[0] === '--test').map(key));
  assert.deepEqual(ranTests.sort(), tests.map(key).sort(), 'every selected test runs once');
  assert.equal(runs.flatMap(run => run.filter(args => args[0] === '--check')).length, syntax.length, 'syntax checks run once');
  assert.ok(runs[0].filter(args => args[0] === '--check').length === syntax.length, 'shard 1 runs the syntax checks');
  for (const run of runs) {
    const first = run.findIndex(args => args[0] === '--test');
    if (first >= 0) assert.ok(run.findIndex(args => key(args) === key(pkg)) >= 0 && run.findIndex(args => key(args) === key(pkg)) < first, 'package preparation precedes the tests in the shard that has tests');
  }
  assert.deepEqual(shardScopedCommands(commands, null), commands);
  assert.deepEqual(shardScopedCommands(commands, { index: 1, total: 1 }), commands);
});

test('aggregate: all shards green is PASS and sums the counts in the usual format', async () => {
  const { aggregate } = await import('../tools/ci/aggregate-test-shards.mjs');
  const result = (index, passed, extra = {}) => ({ schema: 'archive-test-shard-result-v1', shard: index, of: 3, mode: 'full', fullTotal: 21, passed, failed: [], knownFailed: [], fixedKnown: [], total: passed, durationsMs: { a: 1500 }, ...extra });
  const outcome = aggregate({ results: [result(2, 10), result(1, 7), result(3, 4)], shardsResult: 'success' });
  assert.equal(outcome.ok, true, outcome.problems.join('; '));
  assert.equal(outcome.verdict, 'PASS 21 / FAIL 0 / QUARANTINED-FAIL 0 (total 21)');
  assert.equal(outcome.lines.length, 3);
  assert.match(outcome.lines[0], /^shard 1\/3: PASS 7 \/ FAIL 0/);
});

test('aggregate: a failed, missing, duplicated, mismatched, cancelled or skipped shard is never a pass', async () => {
  const { aggregate } = await import('../tools/ci/aggregate-test-shards.mjs');
  const good = (index, extra = {}) => ({ schema: 'archive-test-shard-result-v1', shard: index, of: 3, mode: 'full', fullTotal: 15, passed: 5, failed: [], knownFailed: [], total: 5, durationsMs: {}, ...extra });
  const all = [good(1), good(2), good(3)];
  const failedShard = aggregate({ results: [good(1), good(2, { passed: 4, failed: ['broken.test.js'], total: 5 }), good(3)], shardsResult: 'failure' });
  assert.equal(failedShard.ok, false);
  assert.deepEqual(failedShard.failedFiles, [{ shard: 2, name: 'broken.test.js' }]);
  assert.match(failedShard.verdict, /FAIL 1 \//);
  // even if the matrix claims success, a failed file is still a failure
  assert.equal(aggregate({ results: [good(1), good(2, { failed: ['x'] }), good(3)], shardsResult: 'success' }).ok, false);
  assert.equal(aggregate({ results: [good(1), good(3)], shardsResult: 'success' }).ok, false, 'missing shard 2');
  assert.equal(aggregate({ results: [], shardsResult: 'success' }).ok, false, 'no results');
  assert.equal(aggregate({ results: [...all, good(2)], shardsResult: 'success' }).ok, false, 'duplicated shard');
  assert.equal(aggregate({ results: [good(1), good(2, { of: 2 }), good(3)], shardsResult: 'success' }).ok, false, 'shard counts disagree');
  for (const status of ['failure', 'cancelled', 'skipped', '', undefined]) {
    assert.equal(aggregate({ results: all, shardsResult: status }).ok, false, String(status));
  }
});

test('aggregate: a full run must cover the whole registry; a scoped run is not compared', async () => {
  const { aggregate } = await import('../tools/ci/aggregate-test-shards.mjs');
  const shardResult = (index, total, extra = {}) => ({ schema: 'archive-test-shard-result-v1', shard: index, of: 3, mode: 'full', fullTotal: 30, passed: total, failed: [], knownFailed: [], total, durationsMs: {}, ...extra });
  const ok = aggregate({ results: [shardResult(1, 10), shardResult(2, 10), shardResult(3, 10)], shardsResult: 'success' });
  assert.equal(ok.ok, true, ok.problems.join('; '));
  // one shard ran nothing but "passed"
  const empty = aggregate({ results: [shardResult(1, 15), shardResult(2, 15), shardResult(3, 0)], shardsResult: 'success' });
  assert.equal(empty.ok, false);
  assert.ok(empty.problems.some(problem => /ran no test command/.test(problem)), empty.problems.join('; '));
  // the shares add up to less than the registry
  const short = aggregate({ results: [shardResult(1, 10), shardResult(2, 10), shardResult(3, 9)], shardsResult: 'success' });
  assert.equal(short.ok, false);
  assert.ok(short.problems.some(problem => /ran 29 test command\(s\) but the full registry has 30/.test(problem)), short.problems.join('; '));
  // the shards were not looking at the same registry
  const disagree = aggregate({ results: [shardResult(1, 10), shardResult(2, 10), shardResult(3, 10, { fullTotal: 31 })], shardsResult: 'success' });
  assert.equal(disagree.ok, false);
  assert.ok(disagree.problems.some(problem => /disagree on the full test count/.test(problem)), disagree.problems.join('; '));
  // a full result without a usable fullTotal cannot be trusted
  assert.equal(aggregate({ results: [1, 2, 3].map(index => shardResult(index, 10, { fullTotal: undefined })), shardsResult: 'success' }).ok, false);
  // mixed run modes
  const mixed = aggregate({ results: [shardResult(1, 10), shardResult(2, 10), shardResult(3, 10, { mode: 'scoped' })], shardsResult: 'success' });
  assert.equal(mixed.ok, false);
  assert.ok(mixed.problems.some(problem => /disagree on the run mode/.test(problem)), mixed.problems.join('; '));
  // scoped run: a shard with no test is normal, and package preparation repeated per shard may make the sum exceed the selection
  const scoped = (index, total) => shardResult(index, total, { mode: 'scoped', fullTotal: 4 });
  const scopedOk = aggregate({ results: [scoped(1, 4), scoped(2, 0), scoped(3, 0)], shardsResult: 'success' });
  assert.equal(scopedOk.ok, true, scopedOk.problems.join('; '));
  const scopedMore = aggregate({ results: [scoped(1, 3), scoped(2, 3), scoped(3, 3)], shardsResult: 'success' });
  assert.equal(scopedMore.ok, true, scopedMore.problems.join('; '));
});

test('aggregate: reads result files from downloaded artifact folders and ignores other json', async () => {
  const { readShardResults, aggregate } = await import('../tools/ci/aggregate-test-shards.mjs');
  const dir = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'shard-results-'));
  try {
    for (const index of [1, 2]) {
      fs.mkdirSync(path.join(dir, `test-shard-${index}`));
      fs.writeFileSync(path.join(dir, `test-shard-${index}`, 'test-shard-result.json'),
        JSON.stringify({ schema: 'archive-test-shard-result-v1', shard: index, of: 2, mode: 'full', fullTotal: 6, passed: 3, failed: [], knownFailed: [], total: 3, durationsMs: {} }));
    }
    fs.writeFileSync(path.join(dir, 'unrelated.json'), '{"a":1}');
    fs.writeFileSync(path.join(dir, 'broken.json'), '{');
    const results = readShardResults(dir);
    assert.equal(results.length, 2);
    assert.equal(aggregate({ results, shardsResult: 'success' }).ok, true);
    assert.deepEqual(readShardResults(path.join(dir, 'nope')), []);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('refreshing durations keeps the longest observed time per test and ignores scoped runs', async () => {
  const { buildDurations } = await import('../tools/ci/refresh-test-durations.mjs');
  const next = buildDurations([
    { mode: 'full', durationsMs: { 'a.test.js': 12000, 'b.test.js': 200 } },
    { mode: 'full', durationsMs: { 'a.test.js': 15000 } },
    { mode: 'scoped', durationsMs: { 'c.test.js': 99000 } },
  ], { note: 'n' });
  assert.deepEqual(next.seconds, { 'a.test.js': 15, 'b.test.js': 0.2 });
  assert.ok(next.defaultSeconds >= 0.5);
});

test('ci.yml: the `test` check keeps its name, aggregates every shard, and shards never fail fast', () => {
  const ci = fs.readFileSync(path.join(repo, '.github/workflows/ci.yml'), 'utf8');
  const job = key => {
    const start = ci.indexOf(`\n  ${key}:\n`);
    assert.ok(start >= 0, `job ${key}`);
    const rest = ci.slice(start + 1);
    const next = rest.slice(1).search(/\n  [a-z][a-z-]*:\n/);
    return next < 0 ? rest : rest.slice(0, next + 1);
  };
  const aggregateJob = job('test');
  assert.doesNotMatch(aggregateJob, /\n    name:/, 'the check name is the job id `test`');
  assert.match(aggregateJob, /needs: \[plan, test-shards\]/);
  assert.match(aggregateJob, /if: \$\{\{ always\(\) && needs\.plan\.outputs\.run == 'true' \}\}/);
  assert.match(aggregateJob, /--shards-result "\$SHARDS_RESULT"/);
  assert.match(aggregateJob, /SHARDS_RESULT: \$\{\{ needs\.test-shards\.result \}\}/);
  const shards = job('test-shards');
  assert.match(shards, /fail-fast: false/);
  const matrix = /matrix:\n\s+shard: \[([\d, ]+)\]/.exec(shards);
  assert.ok(matrix, 'matrix.shard list');
  const list = matrix[1].split(',').map(value => Number(value.trim()));
  assert.deepEqual(list, list.map((_, i) => i + 1), 'shards are 1..n');
  assert.ok(shards.includes(`name: test (shard \${{ matrix.shard }}/${list.length})`), 'visible shard count matches the matrix');
  assert.match(shards, /--shard "\$\{\{ matrix\.shard \}\}\/\$\{\{ strategy\.job-total \}\}"/);
  assert.match(shards, /name: test-shard-\$\{\{ matrix\.shard \}\}[\s\S]*?overwrite: true/, 're-running a failed shard may upload its result again');
  assert.match(shards, /ARCHIVE_TEST_SHARD_RESULT: /);
  assert.equal((ci.match(/\n  test:\n/g) || []).length, 1, 'exactly one job is named test');
});

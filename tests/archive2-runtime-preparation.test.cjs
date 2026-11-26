'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const checker = path.resolve(__dirname, '../tools/check-archive2-runtime.cjs');
const source = fs.readFileSync(checker, 'utf8');
const compiler = 'archive/tools/meta-foundation/compile-meta-foundation.mjs';

function run({ registered = false, compilerResult } = {}) {
  const calls = [];
  let exitCode;
  const stop = new Error('isolated checker exit');
  const processStub = {
    execPath: process.execPath,
    argv: [process.execPath, checker, ...(registered ? ['--registered'] : [])],
    exit(code) { exitCode = code; throw stop; },
  };
  try {
    vm.runInNewContext(source, {
      __dirname: path.dirname(checker),
      process: processStub,
      console: { log() {}, error() {} },
      require(name) {
        if (name === 'node:path') return path;
        if (name === 'node:child_process') return {
          spawnSync(command, args, options) {
            calls.push({ command, args, options });
            return args[0] === compiler && compilerResult ? compilerResult : { status: 0 };
          },
        };
        throw new Error('unexpected checker dependency: ' + name);
      },
    }, { filename: checker, timeout: 1000 });
  } catch (error) {
    if (error !== stop) throw error;
  }
  return { calls, exitCode };
}

test('ordinary runtime checks compile the exact checkout before catalog and resolver tests', () => {
  const { calls, exitCode } = run();
  assert.equal(exitCode, 0);
  assert.deepEqual(Array.from(calls[0].args), [compiler, '--write']);
  assert.equal(calls[0].options.cwd, path.resolve(__dirname, '..'));
  assert.equal(calls[0].options.timeout, 120000);
  const catalog = calls.findIndex(call => call.args[0] === 'archive/tools/build-archive2-catalog.mjs');
  const tests = calls.findIndex(call => call.args[0] === '--test');
  assert.ok(catalog > 0 && tests > catalog);
  const testStages = calls.filter(call => call.args[0] === '--test');
  assert.equal(testStages.length, 2, 'isolated timing tests and remaining runtime contracts both run');
  const allTestFiles = testStages.flatMap(call => call.args.slice(2));
  assert.equal(allTestFiles.length, 34);
  assert.equal(new Set(allTestFiles).size, 34, 'every original runtime test file executes exactly once');
  assert.ok(allTestFiles.includes('archive/tools/meta-foundation/rpm-active-resolver.test.mjs'));
  assert.ok(allTestFiles.includes('tests/archive2-runtime-preparation.test.cjs'));
});

for (const [label, compilerResult] of [
  ['compiler refusal', { status: 1 }],
  ['compiler timeout', { status: null, error: new Error('ETIMEDOUT') }],
]) {
  test(`${label} stops before any downstream builder or runtime assertion`, () => {
    const { calls, exitCode } = run({ compilerResult });
    assert.equal(exitCode, 1);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].args[0], compiler);
  });
}

test('registered runtime verification preserves the snapshot and executes the existing test gates', () => {
  const { calls, exitCode } = run({ registered: true });
  assert.equal(exitCode, 0);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].args[0], '--test');
  assert.equal(calls[1].args[0], '--test');
  assert.ok(calls[0].args.includes('--test-concurrency=1'));
  assert.ok(calls[1].args.includes('--test-concurrency=2'));
  for (const timingFile of [
    'tests/archive2-compose-performance.test.cjs',
    'tests/archive2-key-resolver.test.js',
    'tests/archive2-quick-pools.test.js',
  ]) {
    assert.ok(calls[0].args.includes(timingFile), `${timingFile} runs without a competing test file`);
    assert.ok(!calls[1].args.includes(timingFile));
  }
  assert.ok(calls[1].args.includes('archive/tools/meta-foundation/rpm-active-resolver.test.mjs'));
  assert.ok(calls.every(call => call.options.timeout > 0 && call.options.timeout <= 180000));
  assert.ok(calls[1].options.timeout <= calls[0].options.timeout, 'both stages share one original deadline');
  assert.ok(calls.every(call => !call.args.includes('--write')), 'registered verification does not rewrite sources');
});

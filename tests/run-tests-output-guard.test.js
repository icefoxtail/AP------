'use strict';
// The runner may only put back its own pre-step outputs, never other edits.
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { createOutputGuard } = require('../tools/lib/test-output-guard.js');

const CATALOG = 'archive/data/archive2-catalog.json';
const SHARD = 'archive/data/archive2-source-verification/v1/a.json';
const OTHER = 'docs/notes.md';

function git(root, ...args) {
  const r = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  assert.strictEqual(r.status, 0, r.stderr);
  return r.stdout;
}
function write(root, file, text) {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), text);
}
function read(root, file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'output-guard-'));
  git(root, 'init', '-q');
  git(root, 'config', 'user.email', 't@example.com');
  git(root, 'config', 'user.name', 't');
  for (const file of [CATALOG, SHARD, OTHER]) write(root, file, 'committed\n');
  git(root, 'add', '-A');
  git(root, 'commit', '-q', '-m', 'init');
  return root;
}
function makeGuard(root, lines) {
  return createOutputGuard({
    root,
    outputFiles: [CATALOG],
    outputPrefixes: ['archive/data/archive2-source-verification/'],
    log: (line) => lines.push(line)
  });
}

(function restoresOnlyUntouchedPrestepOutputs() {
  const root = fixture();
  try {
    const lines = [];
    const guard = makeGuard(root, lines);
    guard.begin();
    write(root, CATALOG, 'regenerated\n'); // pre-step output
    write(root, SHARD, 'regenerated\n'); // pre-step output
    guard.afterPrestep();
    write(root, SHARD, 'edited by someone else during the run\n');
    write(root, OTHER, 'edited by someone else\n'); // not a pre-step path
    write(root, 'new-untracked.txt', 'x\n');
    guard.finish();
    assert.strictEqual(read(root, CATALOG), 'committed\n');
    assert.strictEqual(read(root, SHARD), 'edited by someone else during the run\n');
    assert.strictEqual(read(root, OTHER), 'edited by someone else\n');
    assert.ok(lines.includes(`RESTORED ${CATALOG}`), lines.join('\n'));
    assert.ok(lines.includes(`NOT_RESTORED ${SHARD} (changed during run)`), lines.join('\n'));
    assert.ok(lines.includes(`CHANGED_DURING_RUN ${OTHER}`), lines.join('\n'));
    assert.ok(lines.includes('UNTRACKED new-untracked.txt'), lines.join('\n'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
})();

(function leavesPrestepPathsThatWereAlreadyDirty() {
  const root = fixture();
  try {
    const lines = [];
    write(root, CATALOG, 'my own uncommitted work\n'); // dirty before the run
    const guard = makeGuard(root, lines);
    guard.begin();
    write(root, CATALOG, 'regenerated\n');
    guard.afterPrestep();
    guard.finish();
    assert.strictEqual(read(root, CATALOG), 'regenerated\n');
    assert.ok(!lines.some((line) => line.includes(CATALOG)), lines.join('\n'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
})();

(function keepOptionDisablesTheGuard() {
  const root = fixture();
  try {
    const guard = createOutputGuard({
      root, outputFiles: [CATALOG], outputPrefixes: [], keep: true, log: () => {}
    });
    guard.begin();
    write(root, CATALOG, 'regenerated\n');
    guard.afterPrestep();
    guard.finish();
    assert.strictEqual(read(root, CATALOG), 'regenerated\n');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
})();

console.log('run-tests output guard: ok');

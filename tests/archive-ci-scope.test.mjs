import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { classifyPaths, planCiScope, readScope } from '../tools/ci/archive-ci-scope.mjs';
import { commandsForScope } from '../tools/ci/run-scoped-tests.mjs';

const source = 'archive/exams/original/high/example.js';
const asset = 'archive/assets/images/example/solution.svg';
function fixture(t, changedFiles = { [source]: 'window.questions=[];' }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-scope-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = (...args) => {
    const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr); return result.stdout.trim();
  };
  const write = (file, value) => { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.writeFileSync(path.join(root, file), value); };
  git('init', '-q', '--initial-branch=main'); git('config', 'user.name', 'fixture'); git('config', 'user.email', 'fixture@example.invalid');
  git('config', 'commit.gpgsign', 'false'); write('README.md', 'baseline');
  write(source, `window.questions=[{solutionImage:'assets/images/example/solution.svg'}];`);
  write(asset, '<svg xmlns="http://www.w3.org/2000/svg"/>');
  git('add', '.'); git('commit', '-qm', 'base'); const baseSha = git('rev-parse', 'HEAD');
  git('switch', '-qc', 'pr');
  for (const [file, value] of Object.entries(changedFiles)) write(file, value);
  git('add', '.'); git('commit', '-qm', 'change'); const headSha = git('rev-parse', 'HEAD');
  const event = { pull_request: { base: { sha: baseSha }, head: { sha: headSha } } };
  return { root, git, write, baseSha, headSha, event, plan: () => planCiScope({ root, eventName: 'pull_request', event, expectedSha: headSha }) };
}

test('only proven original content and original-only asset dependencies select targeted checks', () => {
  assert.equal(classifyPaths([source]).mode, 'archive-content');
  const plan = classifyPaths([asset], { assetConsumers: () => [source] });
  assert.equal(plan.mode, 'archive-content'); assert.deepEqual(plan.sources, [source]);
  assert.equal(classifyPaths([asset]).mode, 'full', 'unknown reverse dependency is conservative');
  assert.equal(classifyPaths([asset], { assetConsumers: () => ['archive/generated/bank.js'] }).mode, 'full');
  assert.equal(classifyPaths([source], { exists: () => false }).mode, 'full', 'deletion needs inventory checks');
});

test('metadata, generators, common output engines and checker versions keep existing relevant regression coverage', () => {
  for (const file of ['archive/data/question_metadata.json', 'archive/engine.js', 'archive/tools/build-archive2-catalog.mjs',
    'tools/ci/archive-ci-scope.mjs', 'tests/archive-content-scope.test.mjs', '.github/workflows/ci.yml', 'unmapped.txt']) {
    assert.equal(classifyPaths([source, file]).mode, 'full', file);
  }
  assert.equal(classifyPaths(null).mode, 'full'); assert.equal(classifyPaths([]).mode, 'full');
});

test('playground-only changes execute project and portal link tests without Archive generation', () => {
  const scope = { ...classifyPaths(['apmath/playground/next/kit/a.js']), changedFiles: ['apmath/playground/new.test.mjs'] };
  assert.equal(scope.mode, 'playground');
  const commands = commandsForScope(scope).flat().join('\n');
  assert.match(commands, /student-portal-geometry-lab-entry/);
  assert.match(commands, /apmath\/playground\/new.test.mjs/);
  assert.doesNotMatch(commands, /archive\/|build-archive2|geometry-equation/);
  assert.equal(commandsForScope({ mode: 'full' }), null);
  assert.throws(() => commandsForScope({ mode: 'unknown' }), /unknown/);
});

test('a later unrelated main merge cannot change the event base or broaden source validation', t => {
  const f = fixture(t); const before = f.plan();
  f.git('switch', '-q', 'main'); f.write('apmath/another.js', 'later'); f.git('add', '.'); f.git('commit', '-qm', 'other merge');
  f.git('update-ref', 'refs/remotes/origin/main', 'HEAD'); f.git('switch', '-q', 'pr');
  assert.deepEqual(f.plan(), before);
  assert.equal(before.mode, 'archive-content'); assert.deepEqual(before.changedFiles, [source]);
});

test('same event is deterministic; persisted plans reject a different checkout or changed dependency scope', t => {
  const f = fixture(t); const plan = f.plan();
  const file = path.join(os.tmpdir(), 'scope-' + f.headSha + '.json'); t.after(() => fs.rmSync(file, { force: true }));
  fs.writeFileSync(file, JSON.stringify(plan)); assert.deepEqual(readScope(file, f.root), plan);
  assert.deepEqual(f.plan(), plan);
  f.write('archive/engine.js', 'output engine'); f.git('add', '.'); f.git('commit', '-qm', 'engine change');
  assert.throws(() => readScope(file, f.root), /does not match/);
  const updated = planCiScope({ root: f.root, baseSha: f.baseSha }); assert.equal(updated.mode, 'full');
});

test('a solution SVG-only replacement resolves real source consumers at the exact Git snapshot', t => {
  const f = fixture(t, { [asset]: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/></svg>' });
  const plan = f.plan(); assert.equal(plan.mode, 'archive-content');
  assert.deepEqual(plan.sources, [source]); assert.deepEqual(plan.assets, [asset]);
  f.write('archive/generated/bank.js', `window.questions=[{solutionImage:'assets/images/example/solution.svg'}];`);
  f.git('add', '.'); f.git('commit', '-qm', 'shared generated consumer');
  assert.equal(planCiScope({ root: f.root, baseSha: f.baseSha }).mode, 'full');
});

test('missing event identities and an unrelated PR base cannot become a scoped success', t => {
  const f = fixture(t);
  assert.throws(() => planCiScope({ root: f.root, eventName: 'pull_request', event: {} }), /exact event/);
  assert.throws(() => planCiScope({ root: f.root, expectedSha: f.baseSha }), /does not match/);
  assert.throws(() => planCiScope({ root: f.root, eventName: 'pull_request', event: { pull_request: { base: { sha: 'a'.repeat(40) }, head: { sha: f.headSha } } } }));
  assert.equal(planCiScope({ root: f.root, eventName: 'workflow_dispatch' }).mode, 'full');
});

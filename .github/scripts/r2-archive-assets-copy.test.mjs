import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, unlinkSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildDeltaPlan, IMAGE_ROOT, runCopy, STATE_OBJECT_KEY } from './r2-archive-assets-copy.mjs';

const BUCKET = 'test-r2-bucket';
const MARKER_KEY = STATE_OBJECT_KEY;

function git(root, args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', windowsHide: true }).trim();
}

function writeRepoFile(root, relative, value) {
  const fullPath = path.join(root, ...relative.split('/'));
  mkdirSync(path.dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, value);
}

function createRepo(t, files = {}) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'r2-assets-git-'));
  git(root, ['init', '--initial-branch=main']);
  git(root, ['config', 'user.name', 'R2 Delta Test']);
  git(root, ['config', 'user.email', 'r2-delta-test@example.invalid']);
  for (const [relative, value] of Object.entries(files)) {
    writeRepoFile(root, `${IMAGE_ROOT}/${relative}`, value);
  }
  git(root, ['add', '--all']);
  git(root, Object.keys(files).length ? ['commit', '-m', 'baseline'] : ['commit', '--allow-empty', '-m', 'baseline']);
  const baseline = git(root, ['rev-parse', 'HEAD']);
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return { root, baseline };
}

function commit(root, message = 'change') {
  git(root, ['add', '--all']);
  git(root, ['commit', '-m', message]);
  return git(root, ['rev-parse', 'HEAD']);
}

function imagePath(relative) {
  return `exams/images/${relative}`;
}

function remoteKey(remotePath) {
  const [, remainder = ''] = remotePath.split(':', 2);
  const firstSlash = remainder.indexOf('/');
  return remainder.slice(firstSlash + 1);
}

function markerState(sha) {
  return Buffer.from(`${JSON.stringify({
    schemaVersion: 1,
    workflow: 'r2-archive-assets-copy',
    branch: 'main',
    lastSuccessfulCommit: sha,
    mode: 'bootstrap',
    uploaded: null,
    verified: 0,
    unchanged: 0,
    deletedRetained: 0,
    updatedAt: '2026-10-11T00:00:00.000Z',
  }, null, 2)}\n`);
}

function fakeRclone({ bucket = BUCKET } = {}) {
  const objects = new Map();
  const calls = [];
  const failPut = new Map();
  const setFailPut = (key, { sideEffect = false, times = 1 } = {}) => failPut.set(key, { sideEffect, times });

  function walkFiles(directory) {
    const rows = [];
    const visit = current => {
      for (const entry of readdirSync(current, { withFileTypes: true })) {
        const fullPath = path.join(current, entry.name);
        if (entry.isDirectory()) visit(fullPath);
        else rows.push(fullPath);
      }
    };
    visit(directory);
    return rows;
  }

  const rclone = {
    objects,
    calls,
    setFailPut,
    run(args) {
      const copy = [...args];
      calls.push(copy);
      const command = copy[0];
      if (command === 'lsjson') {
        assert.ok(copy.includes('--stat'), 'delta lookups must target a single key');
        const key = remoteKey(copy[1]);
        const bytes = objects.get(key);
        const stdout = bytes
          ? JSON.stringify({ Name: key.split('/').at(-1), Path: `${bucket}/${key}`, IsDir: false, Size: bytes.length })
          : '[]';
        return { status: 0, stdout: Buffer.from(stdout), stderr: Buffer.alloc(0) };
      }
      if (command === 'cat') {
        const key = remoteKey(copy[1]);
        if (!objects.has(key)) return { status: 1, stdout: Buffer.alloc(0), stderr: Buffer.from('object not found') };
        return { status: 0, stdout: Buffer.from(objects.get(key)), stderr: Buffer.alloc(0) };
      }
      if (command === 'copyto') {
        assert.ok(copy.includes('--ignore-times'), 'hash-mismatching objects must be overwritten unconditionally');
        const source = copy[1];
        const key = remoteKey(copy[2]);
        const failure = failPut.get(key);
        const bytes = readFileSync(source);
        if (failure && failure.times > 0) {
          failure.times -= 1;
          if (failure.sideEffect) objects.set(key, bytes);
          return { status: 1, stdout: Buffer.alloc(0), stderr: Buffer.from('simulated partial upload failure') };
        }
        objects.set(key, bytes);
        return { status: 0, stdout: Buffer.alloc(0), stderr: Buffer.alloc(0) };
      }
      if (command === 'copy') {
        const sourceRoot = copy[1];
        const prefix = remoteKey(copy[2]).replace(/\/$/, '');
        for (const fullPath of walkFiles(sourceRoot)) {
          const relative = path.relative(sourceRoot, fullPath).split(path.sep).join('/');
          objects.set(`${prefix}/${relative}`, readFileSync(fullPath));
        }
        return { status: 0, stdout: Buffer.alloc(0), stderr: Buffer.alloc(0) };
      }
      if (command === 'check') {
        const sourceRoot = copy[1];
        const prefix = remoteKey(copy[2]).replace(/\/$/, '');
        for (const fullPath of walkFiles(sourceRoot)) {
          const relative = path.relative(sourceRoot, fullPath).split(path.sep).join('/');
          const actual = objects.get(`${prefix}/${relative}`);
          if (!actual || !actual.equals(readFileSync(fullPath))) {
            return { status: 1, stdout: Buffer.alloc(0), stderr: Buffer.from(`mismatch: ${relative}`) };
          }
        }
        return { status: 0, stdout: Buffer.alloc(0), stderr: Buffer.alloc(0) };
      }
      throw new Error(`Unexpected rclone command in mock: ${copy.join(' ')}`);
    },
  };
  return rclone;
}

function seedRemote(rclone, baseline, assets) {
  for (const [relative, content] of Object.entries(assets)) {
    rclone.objects.set(imagePath(relative), Buffer.from(content));
  }
  rclone.objects.set(MARKER_KEY, markerState(baseline));
}

function runDelta(root, target, rclone, extra = {}) {
  return runCopy({
    mode: 'delta',
    target,
    eventName: 'push',
    ref: 'refs/heads/main',
    repoRoot: root,
    bucket: BUCKET,
    rclone,
    now: '2026-10-11T01:02:03.000Z',
    log: () => {},
    ...extra,
  });
}

test('delta uploads only the added and modified current image keys, with no prefix listing', t => {
  const { root, baseline } = createRepo(t, { 'exam/a.png': 'old-a', 'exam/keep.png': 'same' });
  const rclone = fakeRclone();
  seedRemote(rclone, baseline, { 'exam/a.png': 'old-a', 'exam/keep.png': 'same' });
  writeRepoFile(root, `${IMAGE_ROOT}/exam/a.png`, 'new-a');
  writeRepoFile(root, `${IMAGE_ROOT}/시험 폴더/문제 1.png`, 'new-korean-space');
  const target = commit(root, 'change two image paths');

  const result = runDelta(root, target, rclone);
  assert.equal(result.uploaded, 2);
  assert.equal(result.verified, 2);
  assert.equal(result.fullPrefixOperations, 0);
  assert.deepEqual(rclone.objects.get(imagePath('exam/a.png')), Buffer.from('new-a'));
  assert.deepEqual(rclone.objects.get(imagePath('시험 폴더/문제 1.png')), Buffer.from('new-korean-space'));
  const imageLookups = rclone.calls.filter(args => args[0] === 'lsjson' && args[1].includes('/exams/images/'));
  assert.deepEqual(imageLookups.map(args => args[1]).sort(), [
    `r2-ap-assets:${BUCKET}/exams/images/exam/a.png`,
    `r2-ap-assets:${BUCKET}/exams/images/시험 폴더/문제 1.png`,
  ].sort());
  assert.equal(rclone.calls.some(args => ['lsf', 'lsd', 'size', 'tree'].includes(args[0])), false);
  assert.equal(rclone.calls.some(args => args[0] === 'copyto' && args[2].endsWith('/시험 폴더/문제 1.png')), true);
  assert.equal(rclone.calls.some(args => args[0] === 'copyto' && !args.includes('--ignore-times')), false);
  assert.equal(JSON.parse(rclone.objects.get(MARKER_KEY).toString('utf8')).lastSuccessfulCommit, target);
});

test('one changed image causes only exact-key R2 requests and zero exams/images prefix enumeration', t => {
  const { root, baseline } = createRepo(t, { 'exam/one.png': 'before' });
  const rclone = fakeRclone();
  seedRemote(rclone, baseline, { 'exam/one.png': 'before' });
  writeRepoFile(root, `${IMAGE_ROOT}/exam/one.png`, 'after');
  const target = commit(root, 'change one image');

  const logLines = [];
  const result = runDelta(root, target, rclone, { log: message => logLines.push(message) });
  assert.equal(result.uploaded, 1);
  assert.equal(result.fullPrefixOperations, 0);
  assert.equal(logLines.some(line => line === 'r2_sync_counts comparison_targets=1 identical=0 uploaded=1 verified=1 verification_failures=0'), true);
  assert.equal(logLines.some(line => line.includes('existing selected keys are read in full') && line.includes('missing exact key may use a limited LIST')), true);
  const imageCalls = rclone.calls.filter(args =>
    args.some(value => typeof value === 'string' && value.includes('/exams/images/'))
  );
  const touchedKeys = imageCalls.map(args => args[0] === 'copyto' ? args[2] : args[1]);
  assert.deepEqual(touchedKeys, [
    `r2-ap-assets:${BUCKET}/exams/images/exam/one.png`,
    `r2-ap-assets:${BUCKET}/exams/images/exam/one.png`,
    `r2-ap-assets:${BUCKET}/exams/images/exam/one.png`,
    `r2-ap-assets:${BUCKET}/exams/images/exam/one.png`,
  ]);
  assert.equal(imageCalls.every(args => args[0] === 'lsjson' || args[0] === 'cat' || args[0] === 'copyto'), true);
  assert.equal(imageCalls.some(args => args[1] === `r2-ap-assets:${BUCKET}/exams/images`), false);
});

test('JS-only changes produce an empty image delta and do not widen the workflow trigger', t => {
  const { root, baseline } = createRepo(t, { 'exam/a.png': 'same' });
  writeRepoFile(root, 'archive/exams/example.js', 'const question = 1;');
  const target = commit(root, 'JS-only change');
  const plan = buildDeltaPlan({ repoRoot: root, baseline, target });
  assert.deepEqual(plan.files, []);
  assert.deepEqual(plan.deleted, []);

  const workflow = readFileSync(new URL('../workflows/r2-archive-assets-copy.yml', import.meta.url), 'utf8');
  assert.match(workflow, /"archive\/assets\/images\/\*\*"/);
  assert.doesNotMatch(workflow, /"archive\/exams\/\*\*"|"\*\*\.js"/);
});

test('delete-only delta retains the remote object and reports the deletion', t => {
  const { root, baseline } = createRepo(t, { 'exam/remove.png': 'remote-retained' });
  const rclone = fakeRclone();
  seedRemote(rclone, baseline, { 'exam/remove.png': 'remote-retained' });
  unlinkSync(path.join(root, ...`${IMAGE_ROOT}/exam/remove.png`.split('/')));
  const target = commit(root, 'delete image locally');

  const plan = buildDeltaPlan({ repoRoot: root, baseline, target });
  assert.deepEqual(plan.files, []);
  assert.deepEqual(plan.deleted.map(item => item.path), ['exam/remove.png']);
  const result = runDelta(root, target, rclone);
  assert.equal(result.deletedRetained, 1);
  assert.deepEqual(rclone.objects.get(imagePath('exam/remove.png')), Buffer.from('remote-retained'));
  assert.equal(JSON.parse(rclone.objects.get(MARKER_KEY).toString('utf8')).lastSuccessfulCommit, target);
  assert.equal(rclone.calls.some(args => ['delete', 'purge', 'sync'].includes(args[0])), false);
});

test('image added then deleted on another branch before merge is treated as a normal deletion', t => {
  const { root, baseline } = createRepo(t);
  const gitPath = `${IMAGE_ROOT}/exam/branch-only.png`;
  git(root, ['checkout', '-b', 'feature-image']);
  writeRepoFile(root, gitPath, 'temporary image');
  commit(root, 'add image on feature branch');
  unlinkSync(path.join(root, ...gitPath.split('/')));
  const deletion = commit(root, 'delete image on feature branch');
  git(root, ['checkout', 'main']);
  git(root, ['merge', '--no-ff', 'feature-image', '-m', 'merge feature image history']);
  const target = git(root, ['rev-parse', 'HEAD']);

  const plan = buildDeltaPlan({ repoRoot: root, baseline, target });
  assert.deepEqual(plan.files, []);
  assert.deepEqual(plan.deleted.map(item => item.path), ['exam/branch-only.png']);
  assert.equal(plan.deleted[0].deletedAt, deletion);

  const rclone = fakeRclone();
  seedRemote(rclone, baseline, {});
  const result = runDelta(root, target, rclone);
  assert.equal(result.deletedRetained, 1);
  assert.equal(result.uploaded, 0);
  assert.equal(JSON.parse(rclone.objects.get(MARKER_KEY).toString('utf8')).lastSuccessfulCommit, target);
  assert.equal(rclone.calls.some(args => ['delete', 'purge', 'sync'].includes(args[0])), false);
});

test('merge result deletion is found when both parents contain the image', t => {
  const { root, baseline } = createRepo(t, { 'exam/conflict.png': 'base bytes' });
  const gitPath = `${IMAGE_ROOT}/exam/conflict.png`;
  writeRepoFile(root, gitPath, 'main parent bytes');
  commit(root, 'change image on main');
  git(root, ['checkout', '-b', 'feature-delete-resolution', baseline]);
  writeRepoFile(root, gitPath, 'feature parent bytes');
  commit(root, 'change image on feature');
  git(root, ['checkout', 'main']);
  assert.throws(
    () => execFileSync('git', ['merge', '--no-commit', '--no-ff', 'feature-delete-resolution'], { cwd: root, stdio: 'ignore' }),
    error => error.status === 1
  );
  git(root, ['rm', '-f', '--', gitPath]);
  const target = commit(root, 'merge resolution deletes image');

  const parents = git(root, ['show', '-s', '--format=%P', target]).split(/\s+/).filter(Boolean);
  assert.equal(parents.length, 2, 'the target must be a two-parent merge commit');
  assert.notEqual(parents[0], parents[1]);
  assert.equal(git(root, ['cat-file', '-e', `${target}^1:${gitPath}`]) === '', true);
  assert.equal(git(root, ['cat-file', '-e', `${target}^2:${gitPath}`]) === '', true);

  const plan = buildDeltaPlan({ repoRoot: root, baseline, target });
  assert.deepEqual(plan.files, []);
  assert.deepEqual(plan.deleted.map(item => item.path), ['exam/conflict.png']);
  assert.equal(plan.deleted[0].deletedAt, target);

  const rclone = fakeRclone();
  seedRemote(rclone, baseline, { 'exam/conflict.png': 'base bytes' });
  const result = runDelta(root, target, rclone);
  assert.equal(result.deletedRetained, 1);
  assert.equal(JSON.parse(rclone.objects.get(MARKER_KEY).toString('utf8')).lastSuccessfulCommit, target);
  assert.deepEqual(rclone.objects.get(imagePath('exam/conflict.png')), Buffer.from('base bytes'));
});

test('rename uploads the new key and preserves the old remote key', t => {
  const oldName = `${IMAGE_ROOT}/시험지/old name.png`;
  const newName = `${IMAGE_ROOT}/시험지/new name.png`;
  const { root, baseline } = createRepo(t, { '시험지/old name.png': 'same bytes' });
  const rclone = fakeRclone();
  seedRemote(rclone, baseline, { '시험지/old name.png': 'same bytes' });
  git(root, ['mv', oldName, newName]);
  const target = commit(root, 'rename image');

  const plan = buildDeltaPlan({ repoRoot: root, baseline, target });
  assert.deepEqual(plan.files.map(item => item.path), ['시험지/new name.png']);
  assert.deepEqual(plan.deleted.map(item => item.path), ['시험지/old name.png']);
  runDelta(root, target, rclone);
  assert.deepEqual(rclone.objects.get(imagePath('시험지/old name.png')), Buffer.from('same bytes'));
  assert.deepEqual(rclone.objects.get(imagePath('시험지/new name.png')), Buffer.from('same bytes'));
});

test('content-identical change is verified by SHA-256 and not recopied for checkout-time differences', t => {
  const { root, baseline } = createRepo(t, { 'exam/a.png': 'original' });
  const rclone = fakeRclone();
  seedRemote(rclone, baseline, { 'exam/a.png': 'original' });
  writeRepoFile(root, `${IMAGE_ROOT}/exam/a.png`, 'intermediate');
  commit(root, 'temporary image edit');
  writeRepoFile(root, `${IMAGE_ROOT}/exam/a.png`, 'original');
  const target = commit(root, 'restore image bytes');

  const result = runDelta(root, target, rclone);
  assert.equal(result.uploaded, 0);
  assert.equal(result.unchanged, 1);
  assert.equal(rclone.calls.some(args => args[0] === 'copyto' && args[2].includes('/exams/images/')), false);
});

test('partial upload failure leaves baseline unchanged; retry uploads only the missing key', t => {
  const { root, baseline } = createRepo(t, { 'exam/a.png': 'a0', 'exam/b.png': 'b0' });
  const rclone = fakeRclone();
  seedRemote(rclone, baseline, { 'exam/a.png': 'a0', 'exam/b.png': 'b0' });
  writeRepoFile(root, `${IMAGE_ROOT}/exam/a.png`, 'a1');
  writeRepoFile(root, `${IMAGE_ROOT}/exam/b.png`, 'b1');
  const target = commit(root, 'change two images');
  rclone.setFailPut(imagePath('exam/b.png'));

  const failureStats = {};
  assert.throws(() => runDelta(root, target, rclone, { stats: failureStats }), /simulated partial upload failure/);
  assert.equal(failureStats.comparisonTargets, 2);
  assert.equal(failureStats.uploaded, 1);
  assert.equal(failureStats.verificationFailures, 0);
  assert.equal(JSON.parse(rclone.objects.get(MARKER_KEY).toString('utf8')).lastSuccessfulCommit, baseline);
  assert.deepEqual(rclone.objects.get(imagePath('exam/a.png')), Buffer.from('a1'));
  assert.deepEqual(rclone.objects.get(imagePath('exam/b.png')), Buffer.from('b0'));

  const retried = runDelta(root, target, rclone);
  assert.equal(retried.uploaded, 1);
  assert.equal(retried.unchanged, 1);
  assert.equal(JSON.parse(rclone.objects.get(MARKER_KEY).toString('utf8')).lastSuccessfulCommit, target);
});

test('partial upload followed by a Git revert uploads the reverted current bytes', t => {
  const { root, baseline } = createRepo(t, { 'exam/a.png': 'a0', 'exam/b.png': 'b0' });
  const rclone = fakeRclone();
  seedRemote(rclone, baseline, { 'exam/a.png': 'a0', 'exam/b.png': 'b0' });
  writeRepoFile(root, `${IMAGE_ROOT}/exam/a.png`, 'a1');
  writeRepoFile(root, `${IMAGE_ROOT}/exam/b.png`, 'b1');
  const failedTarget = commit(root, 'partial upload target');
  rclone.setFailPut(imagePath('exam/b.png'), { sideEffect: true });
  assert.throws(() => runDelta(root, failedTarget, rclone), /simulated partial upload failure/);
  assert.equal(JSON.parse(rclone.objects.get(MARKER_KEY).toString('utf8')).lastSuccessfulCommit, baseline);

  writeRepoFile(root, `${IMAGE_ROOT}/exam/a.png`, 'a0');
  writeRepoFile(root, `${IMAGE_ROOT}/exam/b.png`, 'b0');
  const revertedTarget = commit(root, 'revert images');
  const result = runDelta(root, revertedTarget, rclone);
  assert.equal(result.uploaded, 2);
  assert.deepEqual(rclone.objects.get(imagePath('exam/a.png')), Buffer.from('a0'));
  assert.deepEqual(rclone.objects.get(imagePath('exam/b.png')), Buffer.from('b0'));
  assert.equal(JSON.parse(rclone.objects.get(MARKER_KEY).toString('utf8')).lastSuccessfulCommit, revertedTarget);
});

test('an old run after a newer successful baseline performs no image or marker writes', t => {
  const { root, baseline } = createRepo(t, { 'exam/a.png': 'a0' });
  const rclone = fakeRclone();
  seedRemote(rclone, baseline, { 'exam/a.png': 'a0' });
  writeRepoFile(root, `${IMAGE_ROOT}/exam/a.png`, 'a1');
  const olderTarget = commit(root, 'older image');
  writeRepoFile(root, `${IMAGE_ROOT}/exam/a.png`, 'a2');
  const newerTarget = commit(root, 'newer image');

  runDelta(root, newerTarget, rclone);
  const callsBeforeOldRetry = rclone.calls.length;
  git(root, ['checkout', '--detach', olderTarget]);
  const result = runDelta(root, olderTarget, rclone);
  assert.equal(result.status, 'stale-skipped');
  assert.equal(result.processedCommit, olderTarget);
  assert.equal(JSON.parse(rclone.objects.get(MARKER_KEY).toString('utf8')).lastSuccessfulCommit, newerTarget);
  assert.deepEqual(rclone.objects.get(imagePath('exam/a.png')), Buffer.from('a2'));
  const oldCalls = rclone.calls.slice(callsBeforeOldRetry);
  assert.equal(oldCalls.some(args => args[0] === 'copyto'), false);
  assert.equal(oldCalls.some(args => args[0] === 'lsjson' && args[1].includes('/exams/images/')), false);
});

test('missing baseline fails without an automatic full scan; manual bootstrap is explicit', t => {
  const { root, baseline } = createRepo(t, { 'exam/a.png': 'a0' });
  const rclone = fakeRclone();
  assert.throws(() => runDelta(root, baseline, rclone), /baseline marker is missing.*mode=bootstrap/i);
  assert.equal(rclone.calls.some(args => args[0] === 'copy' || args[0] === 'check'), false);

  const result = runCopy({
    mode: 'bootstrap',
    target: baseline,
    eventName: 'workflow_dispatch',
    ref: 'refs/heads/main',
    repoRoot: root,
    bucket: BUCKET,
    rclone,
    now: '2026-10-11T01:02:03.000Z',
    log: () => {},
  });
  assert.equal(result.status, 'success');
  assert.equal(rclone.calls.some(args => args[0] === 'copy' && args[2].endsWith('/exams/images')), true);
  assert.equal(rclone.calls.some(args => args[0] === 'check' && args.includes('--one-way') && args.includes('--download')), true);
  assert.equal(JSON.parse(rclone.objects.get(MARKER_KEY).toString('utf8')).lastSuccessfulCommit, baseline);
});

test('an old manual bootstrap retry cannot overwrite a newer successful delta', t => {
  const { root, baseline } = createRepo(t, { 'exam/a.png': 'a0' });
  const rclone = fakeRclone();
  runCopy({
    mode: 'bootstrap',
    target: baseline,
    eventName: 'workflow_dispatch',
    ref: 'refs/heads/main',
    repoRoot: root,
    bucket: BUCKET,
    rclone,
    now: '2026-10-11T01:02:03.000Z',
    log: () => {},
  });

  writeRepoFile(root, `${IMAGE_ROOT}/exam/a.png`, 'a1');
  const newerTarget = commit(root, 'newer image');
  runDelta(root, newerTarget, rclone);
  const callsBeforeRetry = rclone.calls.length;
  git(root, ['checkout', '--detach', baseline]);
  const result = runCopy({
    mode: 'bootstrap',
    target: baseline,
    eventName: 'workflow_dispatch',
    ref: 'refs/heads/main',
    repoRoot: root,
    bucket: BUCKET,
    rclone,
    now: '2026-10-11T02:03:04.000Z',
    log: () => {},
  });

  assert.equal(result.status, 'stale-skipped');
  assert.equal(result.fullPrefixOperations, 0);
  assert.equal(JSON.parse(rclone.objects.get(MARKER_KEY).toString('utf8')).lastSuccessfulCommit, newerTarget);
  assert.deepEqual(rclone.objects.get(imagePath('exam/a.png')), Buffer.from('a1'));
  assert.equal(rclone.calls.slice(callsBeforeRetry).some(args => ['copy', 'copyto', 'check'].includes(args[0])), false);
});

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { auditGitGrowth } from '../tools/check-git-growth.mjs';

function makeRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'git-growth-policy-'));
  execFileSync('git', ['init', '--quiet'], { cwd: root, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.email', 'policy-test@example.invalid'], { cwd: root });
  execFileSync('git', ['config', 'user.name', 'Policy Test'], { cwd: root });
  fs.writeFileSync(path.join(root, '.gitignore'), '/archive/analysis/**\n');
  commit(root, 'baseline');
  const base = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  return { root, base };
}

function write(root, relative, content) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return file;
}

function commit(root, message) {
  execFileSync('git', ['add', '-A'], { cwd: root });
  execFileSync('git', ['commit', '--quiet', '-m', message], { cwd: root });
}

function cleanRepo(run) {
  try { fs.rmSync(run.root, { recursive: true, force: true }); } catch {}
}

test('ignore rules hide only rebuildable snapshot folders and the static-site output', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'git-growth-ignore-'));
  try {
    fs.copyFileSync(path.join(import.meta.dirname, '..', '.gitignore'), path.join(tempRoot, '.gitignore'));
    execFileSync('git', ['init', '--quiet'], { cwd: tempRoot, stdio: 'ignore' });
    for (const relative of ['archive/analysis/run/conflict-stage-snapshots/catalog.bin', '_site/index.html']) {
      assert.doesNotThrow(() => execFileSync('git', ['check-ignore', '--no-index', '-q', '--', relative], { cwd: tempRoot, stdio: 'ignore' }));
    }
    assert.throws(() => execFileSync('git', ['check-ignore', '--no-index', '-q', '--',
      'archive/analysis/run/receipt.json'], { cwd: tempRoot, stdio: 'ignore' }));
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test('new large analysis catalog and conflict snapshots fail while small receipts pass', () => {
  const repo = makeRepo();
  try {
    write(repo.root, 'archive/analysis/run/catalog.snapshot.json', Buffer.alloc(3 * 1024 * 1024));
    write(repo.root, 'archive/analysis/run/receipt.json', JSON.stringify({ status: 'captured', count: 2 }));
    execFileSync('git', ['add', '-f', 'archive/analysis/run/catalog.snapshot.json', 'archive/analysis/run/receipt.json'], { cwd: repo.root });
    commit(repo.root, 'add analysis evidence');
    const report = auditGitGrowth({ root: repo.root, base: repo.base, head: 'HEAD' });
    assert.equal(report.ok, false);
    assert.ok(report.errors.some(error => error.includes('catalog.snapshot.json')));
    assert.ok(report.files.some(file => file.path.endsWith('receipt.json') && file.checked));
    assert.ok(!report.errors.some(error => error.includes('receipt.json')));
  } finally {
    cleanRepo(repo);
  }
});

test('production images and the two canonical catalog projections are explicit large-data lanes', () => {
  const repo = makeRepo();
  try {
    write(repo.root, 'archive/assets/images/approved/diagram.png', Buffer.alloc(10 * 1024 * 1024));
    write(repo.root, 'archive/data/archive2-catalog.json', Buffer.alloc(40 * 1024 * 1024));
    write(repo.root, 'archive/data/question_metadata.json', Buffer.alloc(46 * 1024 * 1024));
    commit(repo.root, 'add production data');
    const report = auditGitGrowth({ root: repo.root, base: repo.base, head: 'HEAD' });
    assert.equal(report.ok, true, report.errors.join('\n'));
    assert.ok(report.files.filter(file => !file.checked).length >= 3);
  } finally {
    cleanRepo(repo);
  }
});

test('a force-staged ignored snapshot is detected before commit', () => {
  const repo = makeRepo();
  try {
    write(repo.root, 'archive/analysis/run/forced.snapshot.json', Buffer.alloc(3 * 1024 * 1024));
    execFileSync('git', ['add', '-f', 'archive/analysis/run/forced.snapshot.json'], { cwd: repo.root });
    const report = auditGitGrowth({ root: repo.root, base: repo.base, head: 'HEAD' });
    assert.equal(report.ok, false);
    assert.ok(report.errors.some(error => error.includes('forced.snapshot.json')));
  } finally {
    cleanRepo(repo);
  }
});

test('visible untracked output is checked before it is staged', () => {
  const repo = makeRepo();
  try {
    write(repo.root, 'reports/untracked-capture.capture.json', Buffer.alloc(9 * 1024 * 1024));
    const report = auditGitGrowth({ root: repo.root, base: repo.base, head: 'HEAD' });
    assert.equal(report.ok, false);
    assert.ok(report.errors.some(error => error.includes('untracked-capture.capture.json')));
  } finally {
    cleanRepo(repo);
  }
});

test('new large transient patch is blocked and unchanged legacy size is grandfathered', () => {
  const repo = makeRepo();
  try {
    write(repo.root, 'archive/analysis/legacy.json', Buffer.alloc(3 * 1024 * 1024, 1));
    execFileSync('git', ['add', '-f', 'archive/analysis/legacy.json'], { cwd: repo.root });
    commit(repo.root, 'add historical large evidence');
    const legacy = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo.root, encoding: 'utf8' }).trim();
    assert.equal(auditGitGrowth({ root: repo.root, base: legacy, head: 'HEAD' }).ok, true);
    write(repo.root, 'reports/new-change.patch', Buffer.alloc(9 * 1024 * 1024));
    commit(repo.root, 'add patch artifact');
    const report = auditGitGrowth({ root: repo.root, base: legacy, head: 'HEAD' });
    assert.equal(report.ok, false);
    assert.ok(report.errors.some(error => error.includes('new-change.patch')));
  } finally {
    cleanRepo(repo);
  }
});

test('same-size rewrite of an existing large analysis blob is checked', () => {
  const repo = makeRepo();
  try {
    const relative = 'archive/analysis/legacy/catalog.json';
    write(repo.root, relative, Buffer.alloc(3 * 1024 * 1024, 1));
    execFileSync('git', ['add', '-f', relative], { cwd: repo.root });
    commit(repo.root, 'establish legacy catalog');
    const base = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo.root, encoding: 'utf8' }).trim();
    write(repo.root, relative, Buffer.alloc(3 * 1024 * 1024, 2));
    execFileSync('git', ['add', '-f', relative], { cwd: repo.root });
    commit(repo.root, 'rewrite same-size catalog');
    const report = auditGitGrowth({ root: repo.root, base, head: 'HEAD' });
    assert.equal(report.ok, false);
    assert.ok(report.errors.some(error => error.includes('legacy/catalog.json')));
  } finally {
    cleanRepo(repo);
  }
});

test('reused blob content is counted once across changed paths', () => {
  const repo = makeRepo();
  try {
    const payload = Buffer.alloc(128 * 1024, 7);
    write(repo.root, 'receipts/first.json', payload);
    write(repo.root, 'receipts/second.json', payload);
    commit(repo.root, 'reuse receipt bytes');
    const report = auditGitGrowth({ root: repo.root, base: repo.base, head: 'HEAD' });
    assert.equal(report.ok, true, report.errors.join('\n'));
    assert.equal(report.countedChangedBytes, payload.length);
  } finally {
    cleanRepo(repo);
  }
});

test('working-tree CRLF conversion follows the Git clean-filter path', () => {
  const repo = makeRepo();
  try {
    write(repo.root, '.gitattributes', '*.txt text\n');
    write(repo.root, 'receipt.txt', 'status=PASS\n');
    commit(repo.root, 'add text receipt');
    const base = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo.root, encoding: 'utf8' }).trim();
    write(repo.root, 'receipt.txt', 'status=PASS\r\n');
    const report = auditGitGrowth({ root: repo.root, base, head: 'HEAD' });
    assert.equal(report.ok, true, report.errors.join('\n'));
    assert.equal(report.files.some(file => file.path === 'receipt.txt' && file.checked), false);
  } finally {
    cleanRepo(repo);
  }
});

test('non-image file under an image directory is not a production exemption', () => {
  const repo = makeRepo();
  try {
    write(repo.root, 'archive/assets/images/approved/catalog.bin', Buffer.alloc(33 * 1024 * 1024));
    commit(repo.root, 'add oversized non-image data');
    const report = auditGitGrowth({ root: repo.root, base: repo.base, head: 'HEAD' });
    assert.equal(report.ok, false);
    assert.ok(report.errors.some(error => error.includes('catalog.bin')));
  } finally {
    cleanRepo(repo);
  }
});

test('zero-before initial push requires a full-history audit for a root commit', () => {
  const repo = makeRepo();
  try {
    assert.throws(
      () => auditGitGrowth({ root: repo.root, base: '0'.repeat(40), head: 'HEAD' }),
      /INITIAL_PUSH_BASE_UNAVAILABLE: full-history audit is required/
    );
  } finally {
    cleanRepo(repo);
  }
});

test('zero-before initial push requires a full-history audit for a multi-commit history', () => {
  const repo = makeRepo();
  try {
    write(repo.root, 'later.txt', 'second commit');
    commit(repo.root, 'second commit');
    assert.throws(
      () => auditGitGrowth({ root: repo.root, base: '0'.repeat(40), head: 'HEAD' }),
      /INITIAL_PUSH_BASE_UNAVAILABLE: full-history audit is required/
    );
  } finally {
    cleanRepo(repo);
  }
});

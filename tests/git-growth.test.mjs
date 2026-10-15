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
    for (const relative of ['archive/analysis/run/conflict-stage-snapshots/catalog.bin', 'archive/evidence/run/physical-evidence.json', '_site/index.html']) {
      assert.doesNotThrow(() => execFileSync('git', ['check-ignore', '--no-index', '-q', '--', relative], { cwd: tempRoot, stdio: 'ignore' }));
    }
    assert.throws(() => execFileSync('git', ['check-ignore', '--no-index', '-q', '--',
      'archive/data/evidence-authority/v1/index.json'], { cwd: tempRoot, stdio: 'ignore' }));
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test('all changed analysis outputs are forbidden while production authority receipts remain allowed', () => {
  const repo = makeRepo();
  try {
    write(repo.root, 'archive/analysis/run/catalog.snapshot.json', Buffer.alloc(3 * 1024 * 1024));
    write(repo.root, 'archive/analysis/run/receipt.json', JSON.stringify({ status: 'captured', count: 2 }));
    write(repo.root, 'archive/data/evidence-authority/v1/receipt.json', JSON.stringify({ status: 'FULL_BYTES_VERIFIED', count: 2 }));
    execFileSync('git', ['add', '-f', 'archive/analysis/run/catalog.snapshot.json', 'archive/analysis/run/receipt.json', 'archive/data/evidence-authority/v1/receipt.json'], { cwd: repo.root });
    commit(repo.root, 'add analysis evidence');
    const report = auditGitGrowth({ root: repo.root, base: repo.base, head: 'HEAD' });
    assert.equal(report.ok, false);
    assert.ok(report.errors.some(error => error === 'GIT_RAW_OUTPUT_FORBIDDEN:archive/analysis/run/catalog.snapshot.json'));
    assert.ok(report.errors.some(error => error === 'GIT_RAW_OUTPUT_FORBIDDEN:archive/analysis/run/receipt.json'));
    assert.ok(report.files.some(file => file.path === 'archive/data/evidence-authority/v1/receipt.json' && file.checked));
    assert.ok(!report.errors.some(error => error.includes('archive/data/evidence-authority/v1/receipt.json')));
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

test('raw artifacts are forbidden in designated output roots even when small', () => {
  const repo = makeRepo();
  try {
    for (const relative of [
      'output/run.json',
      'reports/run.json',
      'render_review/run.json',
      'artifacts/run.json',
      'archive-work/run.json',
      'archive/evidence/run.json',
      'evidence/run.json',
      '스캔_인테이크_산출물/run.json'
    ]) write(repo.root, relative, '{"ok":true}\n');
    commit(repo.root, 'add small raw outputs');
    const report = auditGitGrowth({ root: repo.root, base: repo.base, head: 'HEAD' });
    assert.equal(report.ok, false);
    for (const relative of [
      'output/run.json',
      'reports/run.json',
      'render_review/run.json',
      'artifacts/run.json',
      'archive-work/run.json',
      'archive/evidence/run.json',
      'evidence/run.json',
      '스캔_인테이크_산출물/run.json'
    ]) assert.ok(report.errors.includes(`GIT_RAW_OUTPUT_FORBIDDEN:${relative}`), relative);
  } finally {
    cleanRepo(repo);
  }
});

test('a force-staged small archive/evidence file remains forbidden despite the ignore rule', () => {
  const repo = makeRepo();
  try {
    fs.copyFileSync(path.join(import.meta.dirname, '..', '.gitignore'), path.join(repo.root, '.gitignore'));
    execFileSync('git', ['add', '.gitignore'], { cwd: repo.root });
    commit(repo.root, 'install production cold-root ignores');
    const base = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo.root, encoding: 'utf8' }).trim();
    const relative = 'archive/evidence/run/physical-evidence.json';
    write(repo.root, relative, '{"status":"captured"}\n');
    assert.doesNotThrow(() => execFileSync('git', ['check-ignore', '-q', '--', relative], { cwd: repo.root, stdio: 'ignore' }));
    execFileSync('git', ['add', '-f', relative], { cwd: repo.root });
    const report = auditGitGrowth({ root: repo.root, base, head: 'HEAD' });
    assert.equal(report.ok, false);
    assert.ok(report.errors.includes(`GIT_RAW_OUTPUT_FORBIDDEN:${relative}`));
  } finally {
    cleanRepo(repo);
  }
});

test('only the three canonical generated inputs are allowed under archive/_generated', () => {
  const repo = makeRepo();
  try {
    const allowed = [
      'archive/_generated/intelligence/meta-foundation/h2-math2-continuity/STAGE6_FINAL_FOUNDATION.json',
      'archive/_generated/intelligence/phase1/middle1-foundation/global/B01_B16_CANONICAL_MAPPING.json',
      'archive/_generated/intelligence/phase1/middle1-foundation/global/B01_B16_SOURCE_NORMALIZATION_RECEIPT.json'
    ];
    for (const relative of [...allowed, 'archive/_generated/intelligence/other/generated-output.json']) {
      const destination = path.join(repo.root, relative);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, '{"ok":true}\n');
    }
    commit(repo.root, 'add canonical generated inputs');
    const report = auditGitGrowth({ root: repo.root, base: repo.base, head: 'HEAD' });
    assert.equal(report.ok, false);
    assert.ok(report.errors.includes('GIT_RAW_OUTPUT_FORBIDDEN:archive/_generated/intelligence/other/generated-output.json'));
    for (const relative of allowed) assert.ok(!report.errors.some(error => error.includes(relative)), relative);
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

test('bulk committed deletions use a bounded number of Git processes', () => {
  const repo = makeRepo();
  try {
    execFileSync('git', ['config', 'core.autocrlf', 'false'], { cwd: repo.root });
    const directory = 'archive/analysis/bulk-delete-fixture';
    for (let index = 0; index < 3000; index += 1) {
      write(repo.root, `${directory}/receipt-${String(index).padStart(4, '0')}.json`, '{"ok":true}\n');
    }
    execFileSync('git', ['add', '-f', '--', directory], { cwd: repo.root });
    commit(repo.root, 'add bulk deletion fixture');
    const base = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo.root, encoding: 'utf8' }).trim();
    fs.rmSync(path.join(repo.root, directory), { recursive: true, force: true });
    commit(repo.root, 'delete bulk analysis receipts');

    const metrics = {};
    const report = auditGitGrowth({ root: repo.root, base, head: 'HEAD', metrics });
    assert.equal(report.ok, true, report.errors.join('\n'));
    assert.equal(report.countedChangedBytes, 0);
    assert.equal(report.files.length, 0);
    assert.ok(metrics.gitCommands <= 12, `expected a bounded audit, got ${metrics.gitCommands} Git processes`);
  } finally {
    cleanRepo(repo);
  }
});

test('ignored local evidence retained after rm --cached is skipped with bounded Git processes', () => {
  const repo = makeRepo();
  try {
    const paths = Array.from({ length: 48 }, (_, index) => `archive/evidence/retained-${String(index).padStart(3, '0')}.json`);
    for (const [index, relative] of paths.entries()) write(repo.root, relative, `baseline evidence ${index}\n`);
    execFileSync('git', ['add', '-f', '--', ...paths], { cwd: repo.root });
    commit(repo.root, 'seed tracked cold evidence');
    const base = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo.root, encoding: 'utf8' }).trim();

    fs.appendFileSync(path.join(repo.root, '.gitignore'), '/archive/evidence/\n');
    execFileSync('git', ['rm', '--cached', '--', ...paths], { cwd: repo.root, stdio: 'ignore' });
    commit(repo.root, 'remove cold evidence from Git while retaining local copies');
    for (const [index, relative] of paths.entries()) {
      write(repo.root, relative, `locally modified retained evidence ${index}\n`);
    }
    assert.doesNotThrow(() => execFileSync('git', ['check-ignore', '-q', '--', paths[0]], { cwd: repo.root, stdio: 'ignore' }));

    const metrics = {};
    const report = auditGitGrowth({ root: repo.root, base, head: 'HEAD', metrics });
    assert.equal(report.ok, true, report.errors.join('\n'));
    assert.ok(metrics.gitCommands <= 12, `expected bounded Git work, got ${metrics.gitCommands} commands`);
    assert.ok(!report.files.some(file => paths.includes(file.path)));
  } finally {
    cleanRepo(repo);
  }
});

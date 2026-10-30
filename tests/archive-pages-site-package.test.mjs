import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { buildPagesSite, formatPackageSummary, HEADROOM_WARNING_BYTES, planPagesSite, summarizePackageSize } from '../tools/build-archive-pages-site.mjs';

function digest(value) {
  return crypto.createHash('sha256').update(value.replace(/\r\n/g, '\n')).digest('hex');
}

function put(root, relative, contents) {
  const destination = path.join(root, ...relative.split('/'));
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, contents);
  return destination;
}

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-pages-package-'));
  const canonicalMaster = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
  const canonicalBytes = '{"version":"fixture"}\n';
  const generatedInput = 'archive/_generated/intelligence/fixture.json';
  const generatedBytes = '{"runtime":"fixture"}\n';
  const shard = 'archive/data/archive2-source-verification/v1/' + 'a'.repeat(64) + '.json';
  const shardBytes = '{"schemaVersion":"archive2-source-verification-v1"}\n';
  const override = 'archive/data/meta-foundation/evidence/review-overrides/v1/qid_v1_' + 'b'.repeat(64) + '.json';
  const overrideBytes = '{"evidence":"fixture"}\n';
  const reviewedMeta = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/review.json';
  const reviewedBytes = '{"reviewed":"fixture"}\n';

  put(root, 'index.html', '<h1>Hub</h1>');
  put(root, 'apmath/index.html', '<h1>AP</h1>');
  put(root, 'apmath/worker-backup/old.js', 'retired');
  put(root, 'apmath/js/student.js', 'student runtime');
  put(root, 'archive/runtime.js', 'runtime');
  put(root, generatedInput, generatedBytes);
  put(root, canonicalMaster, canonicalBytes);
  put(root, shard, shardBytes);
  put(root, override, overrideBytes);
  put(root, reviewedMeta, reviewedBytes);

  const canonicalManifest = {
    schemaVersion: 'archive2-canonical-input-manifest-v1',
    files: [
      { path: 'data/fixture.json', sha256: digest('{"fixture":true}\n') },
      { path: '_generated/intelligence/fixture.json', sha256: digest(generatedBytes) },
      { path: '../docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json', sha256: digest(canonicalBytes) },
    ],
  };
  put(root, 'archive/data/fixture.json', '{"fixture":true}\n');
  put(root, 'archive/data/archive2-canonical-input-manifest.json', JSON.stringify(canonicalManifest));
  put(root, 'archive/data/archive2-source-verification-index.json', JSON.stringify({
    schemaVersion: 'archive2-source-verification-index-v1',
    files: [{ path: shard.slice('archive/'.length), sha256: digest(shardBytes) }],
  }));
  put(root, 'archive/data/archive2-item-review-overrides.json', JSON.stringify({
    records: [{ evidenceReference: override.slice('archive/'.length), evidenceSha256: digest(overrideBytes) }],
  }));
  put(root, 'archive/data/question_metadata.json', JSON.stringify({
    records: [{ reviewedOriginalMetaEvidence: { manifestPath: reviewedMeta } }],
  }));

  const manifest = {
    schemaVersion: 'ARCHIVE_PAGES_SITE_MANIFEST_V1',
    maxBytes: 100000,
    files: ['index.html', 'archive/data/archive2-canonical-input-manifest.json', 'archive/data/archive2-source-verification-index.json', 'archive/data/archive2-item-review-overrides.json', 'archive/data/question_metadata.json'],
    trees: [{ path: 'apmath', exclude: ['worker-backup'], reason: 'frontend' }],
    archiveRootFiles: ['runtime.js'],
    archiveDataFiles: [],
    runtimeClosure: {
      canonicalInputs: {
        manifest: 'archive/data/archive2-canonical-input-manifest.json',
        allowedPrefixes: ['archive/data/', 'archive/_generated/intelligence/', canonicalMaster],
      },
      sourceVerification: {
        index: 'archive/data/archive2-source-verification-index.json',
        pathPrefix: 'data/archive2-source-verification/v1/',
      },
      reviewOverrides: {
        index: 'archive/data/archive2-item-review-overrides.json',
        pathPrefix: 'data/meta-foundation/evidence/review-overrides/v1/',
      },
      reviewedExamMeta: {
        index: 'archive/data/question_metadata.json',
        pathPrefix: 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/',
      },
      extraFiles: [],
    },
  };
  return { root, manifest, shard, override, reviewedMeta };
}

test('stages exact frontend files and manifest-declared runtime closure with hashes', async (t) => {
  const { root, manifest, shard, override, reviewedMeta } = fixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const output = path.join(root, '_site');
  const reportPath = path.join(root, 'work', 'site-report.json');
  const report = await buildPagesSite({ sourceRoot: root, outputDir: output, reportPath, manifest });
  const published = new Set(report.inventory.map((item) => item.path));

  assert.ok(published.has('index.html'));
  assert.ok(published.has('apmath/js/student.js'));
  assert.ok(published.has('archive/runtime.js'));
  assert.ok(published.has('archive/_generated/intelligence/fixture.json'));
  assert.ok(published.has(shard));
  assert.ok(published.has(override));
  assert.ok(published.has(reviewedMeta));
  assert.equal(published.has('apmath/worker-backup/old.js'), false);
  assert.equal(fs.existsSync(path.join(output, 'work', 'site-report.json')), false);
  assert.equal(report.totalBytes, report.inventory.reduce((sum, item) => sum + item.bytes, 0));
  for (const item of report.inventory) {
    const actual = fs.readFileSync(path.join(output, ...item.path.split('/')));
    assert.equal(crypto.createHash('sha256').update(actual).digest('hex'), item.sha256, item.path);
  }
  assert.ok(fs.existsSync(reportPath));
});

test('rejects canonical manifest paths outside the declared runtime roots', async (t) => {
  const { root, manifest } = fixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const canonicalPath = path.join(root, 'archive', 'data', 'archive2-canonical-input-manifest.json');
  const canonical = JSON.parse(fs.readFileSync(canonicalPath, 'utf8'));
  canonical.files.push({ path: '../private.json', sha256: 'a'.repeat(64) });
  fs.writeFileSync(canonicalPath, JSON.stringify(canonical));

  await assert.rejects(
    buildPagesSite({ sourceRoot: root, outputDir: path.join(root, '_site'), manifest }),
    /unapproved parent path/,
  );
});

test('rejects content digest drift and site packages at or above the size limit', async (t) => {
  const { root, manifest } = fixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  put(root, 'archive/_generated/intelligence/fixture.json', '{"runtime":"changed"}\n');
  await assert.rejects(
    buildPagesSite({ sourceRoot: root, outputDir: path.join(root, '_site'), manifest }),
    /canonical input digest mismatch/,
  );

  const sizeFixture = fixture();
  t.after(() => fs.rmSync(sizeFixture.root, { recursive: true, force: true }));
  sizeFixture.manifest.maxBytes = 1;
  await assert.rejects(
    buildPagesSite({ sourceRoot: sizeFixture.root, outputDir: path.join(sizeFixture.root, '_site'), manifest: sizeFixture.manifest }),
    /must be below the 1-byte Pages limit/,
  );
});

test('rejects a nested output path without deleting its sentinel', async (t) => {
  const { root, manifest } = fixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const protectedOutput = path.join(root, 'assets', '_site');
  put(root, 'assets/_site/sentinel.txt', 'keep');
  await assert.rejects(
    buildPagesSite({ sourceRoot: root, outputDir: protectedOutput, manifest }),
    /exactly <sourceRoot>\/_site/,
  );
  assert.equal(fs.readFileSync(path.join(protectedOutput, 'sentinel.txt'), 'utf8'), 'keep');
});

test('does not allow the manifest to raise the fixed Pages byte limit', async (t) => {
  const { root, manifest } = fixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  manifest.maxBytes = 1000000001;
  await assert.rejects(
    buildPagesSite({ sourceRoot: root, outputDir: path.join(root, '_site'), manifest }),
    /cannot exceed the fixed 1000000000-byte Pages limit/,
  );
});

test('rejects a junction at the designated output without deleting its target', async (t) => {
  const { root, manifest } = fixture();
  const protectedTarget = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-pages-protected-'));
  t.after(() => {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(protectedTarget, { recursive: true, force: true });
  });
  put(protectedTarget, 'sentinel.txt', 'keep');
  fs.symlinkSync(protectedTarget, path.join(root, '_site'), 'junction');
  await assert.rejects(
    buildPagesSite({ sourceRoot: root, outputDir: path.join(root, '_site'), manifest }),
    /symbolic link or junction|resolves outside/,
  );
  assert.equal(fs.readFileSync(path.join(protectedTarget, 'sentinel.txt'), 'utf8'), 'keep');
});

test('rejects symlinked manifest and indexed source files before digesting or copying them', async (t) => {
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-pages-shard-target-'));
  const roots = [];
  t.after(() => {
    for (const root of roots) fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(outside, { recursive: true, force: true });
  });
  const cases = [
    {
      link: 'archive/_generated/intelligence',
      target: 'intelligence',
      file: 'fixture.json',
      contents: '{"runtime":"fixture"}\n',
    },
    {
      link: 'archive/data/archive2-source-verification/v1',
      target: 'source-verification',
      file: 'a'.repeat(64) + '.json',
      contents: '{"schemaVersion":"archive2-source-verification-v1"}\n',
    },
    {
      link: 'archive/data/meta-foundation/evidence/review-overrides/v1',
      target: 'review-overrides',
      file: 'qid_v1_' + 'b'.repeat(64) + '.json',
      contents: '{"evidence":"fixture"}\n',
    },
  ];
  for (const item of cases) {
    const { root, manifest } = fixture();
    roots.push(root);
    const linkPath = path.join(root, ...item.link.split('/'));
    const targetPath = path.join(outside, item.target);
    fs.rmSync(linkPath, { recursive: true, force: true });
    put(outside, `${item.target}/${item.file}`, item.contents);
    fs.symlinkSync(targetPath, linkPath, 'junction');
    await assert.rejects(
      buildPagesSite({ sourceRoot: root, outputDir: path.join(root, '_site'), manifest }),
      /symbolic link|junction/,
      item.link,
    );
    fs.rmSync(linkPath, { recursive: true, force: true });
  }
});

test('compacts only listed non-digest-bound JSON and keeps its value identical', async (t) => {
  const { root, manifest } = fixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const pretty = JSON.stringify({ rows: [{ id: 1, name: '한글', nested: { a: [1, 2, 3] } }], big: 12345678901234567890 }, null, 2) + '\n';
  put(root, 'archive/data/loose.json', pretty);
  put(root, 'archive/data/loose-tree/a.json', pretty);
  put(root, 'archive/data/other.json', pretty);
  manifest.archiveDataFiles = ['loose.json', 'other.json'];
  manifest.trees.push({ path: 'archive/data/loose-tree', reason: 'tree' });
  manifest.minifyJson = ['archive/data/loose.json', 'archive/data/loose-tree/'];
  const report = await buildPagesSite({ sourceRoot: root, outputDir: path.join(root, '_site'), manifest });
  const byPath = new Map(report.inventory.map((item) => [item.path, item]));
  for (const relative of ['archive/data/loose.json', 'archive/data/loose-tree/a.json']) {
    const text = fs.readFileSync(path.join(root, '_site', ...relative.split('/')), 'utf8');
    assert.deepEqual(JSON.parse(text), JSON.parse(pretty), relative);
    assert.ok(text.length < pretty.length, relative);
    assert.equal(byPath.get(relative).transform, 'minify-json');
    assert.equal(byPath.get(relative).bytes, Buffer.byteLength(text));
    assert.equal(byPath.get(relative).sourceBytes, Buffer.byteLength(pretty));
    assert.equal(byPath.get(relative).sha256, crypto.createHash('sha256').update(text).digest('hex'));
  }
  assert.equal(fs.readFileSync(path.join(root, '_site', 'archive/data/other.json'), 'utf8'), pretty);
  assert.equal(byPath.get('archive/data/other.json').transform, undefined);
  assert.equal(report.minifiedFileCount, 2);
  assert.equal(report.totalBytes, report.inventory.reduce((sum, item) => sum + item.bytes, 0));
});

test('refuses to compact digest-bound files and unmatched or malformed entries', async (t) => {
  const { root, manifest } = fixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const attempt = (minifyJson) => buildPagesSite({
    sourceRoot: root, outputDir: path.join(root, '_site'), manifest: { ...manifest, minifyJson },
  });
  // the canonical input manifest binds this file's bytes to a digest
  await assert.rejects(attempt(['archive/data/fixture.json']), /minifyJson refuses a digest-bound file/);
  await assert.rejects(attempt(['archive/data/archive2-source-verification/v1/']), /minifyJson refuses a digest-bound file/);
  await assert.rejects(attempt(['archive/data/missing.json']), /matches no packaged JSON file/);
  await assert.rejects(attempt('archive/data/fixture.json'), /minifyJson must be an array/);
  put(root, 'archive/data/broken.json', '{not json');
  manifest.archiveDataFiles = ['broken.json'];
  await assert.rejects(attempt(['archive/data/broken.json']), /not valid JSON/);
});

test('reviewed evidence referenced only by path is verified but not shipped when verifyOnly is set', async (t) => {
  const { root, manifest, reviewedMeta } = fixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  manifest.runtimeClosure.reviewedExamMeta.verifyOnly = true;
  const plan = planPagesSite({ sourceRoot: root, manifest });
  assert.equal(plan.entries.some((entry) => entry.path === reviewedMeta), false);
  assert.deepEqual(plan.buildOnly.map((item) => item.path), [reviewedMeta]);
  fs.rmSync(path.join(root, ...reviewedMeta.split('/')));
  assert.throws(() => planPagesSite({ sourceRoot: root, manifest }), /ENOENT|does not exist/);
});

test('size summary names the largest contributors and the remaining headroom', () => {
  const entries = [
    { path: 'a/b/c/one.bin', bytes: 600 },
    { path: 'a/b/c/two.bin', bytes: 300 },
    { path: 'a/b/d/three.bin', bytes: 50 },
    { path: 'top.html', bytes: 10 },
  ];
  const summary = summarizePackageSize(entries, 2000, { groupDepth: 3, topGroups: 2, topFiles: 2 });
  assert.equal(summary.totalBytes, 960);
  assert.equal(summary.headroomBytes, 1040);
  assert.deepEqual(summary.topGroups.map((group) => [group.path, group.bytes, group.files]), [['a/b/c', 900, 2], ['a/b/d', 50, 1]]);
  assert.deepEqual(summary.topFiles.map((file) => file.path), ['a/b/c/one.bin', 'a/b/c/two.bin']);
  assert.match(formatPackageSummary(summary), /headroom 0\.0 MB/);
});

test('the command line reports headroom and warns, without failing, when it drops below the threshold', async (t) => {
  const { root, manifest } = fixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const probe = planPagesSite({ sourceRoot: root, manifest });
  const run = (maxBytes) => {
    const manifestPath = path.join(root, `manifest-${maxBytes}.json`);
    fs.writeFileSync(manifestPath, JSON.stringify({ ...manifest, maxBytes }));
    return spawnSync(process.execPath, [
      path.resolve('tools/build-archive-pages-site.mjs'), '--root', root, '--output', path.join(root, '_site'), '--manifest', manifestPath,
    ], { encoding: 'utf8' });
  };
  const tight = run(probe.totalBytes + 1000);
  assert.equal(tight.status, 0, tight.stderr);
  assert.match(tight.stdout, /headroom 0\.0 MB/);
  assert.match(tight.stdout, /::warning title=Pages size headroom::/);
  assert.equal(HEADROOM_WARNING_BYTES, 50_000_000);

  const over = run(probe.totalBytes);
  assert.equal(over.status, 1);
  assert.match(over.stderr, /must be below the/);
  assert.match(over.stderr, /Largest directories:/);
});

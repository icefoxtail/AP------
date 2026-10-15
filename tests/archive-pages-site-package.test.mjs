import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildPagesSite } from '../tools/build-archive-pages-site.mjs';

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

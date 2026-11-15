'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const REPO_ROOT = path.resolve(__dirname, '../..');
const MANIFEST_PATH = path.join(REPO_ROOT, 'tests/fixtures/m2-create-gate-history.json');
const HEX40 = /^[a-f0-9]{40}$/;
const HEX64 = /^[a-f0-9]{64}$/;
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const blobDigest = bytes => crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');

function safePath(value) {
  return typeof value === 'string' && value.startsWith('archive/')
    && !/[\\\r\n\0:]/.test(value)
    && value.split('/').every(part => part && part !== '.' && part !== '..')
    && path.posix.normalize(value) === value;
}

function selectedFiles(manifest, caseId) {
  assert.equal(manifest?.schemaVersion, 'archive-historical-create-gate-fixtures-v1', 'HISTORICAL_CREATE_MANIFEST_SCHEMA');
  assert.match(manifest.sourceCommit ?? '', HEX40, 'HISTORICAL_CREATE_COMMIT_REQUIRED');
  assert.ok(Array.isArray(manifest.cases) && Array.isArray(manifest.files), 'HISTORICAL_CREATE_MANIFEST_COLLECTIONS');
  const cases = manifest.cases.filter(entry => entry.id === caseId);
  assert.equal(cases.length, 1, 'HISTORICAL_CREATE_CASE_NOT_UNIQUE');
  const entry = cases[0];
  assert.ok(safePath(entry.examPath) && safePath(entry.evidencePath), 'HISTORICAL_CREATE_TARGET_PATH_INVALID');
  assert.ok(Number.isSafeInteger(entry.questionCount) && entry.questionCount > 0, 'HISTORICAL_CREATE_QUESTION_COUNT_REQUIRED');
  assert.ok(Array.isArray(entry.files) && entry.files.length > 1, 'HISTORICAL_CREATE_FILES_REQUIRED');
  assert.equal(new Set(entry.files).size, entry.files.length, 'HISTORICAL_CREATE_DUPLICATE_CASE_FILE');
  assert.ok(entry.files.includes(entry.examPath) && entry.files.includes(entry.evidencePath), 'HISTORICAL_CREATE_TARGET_FILES_REQUIRED');
  const index = new Map();
  for (const file of manifest.files) {
    assert.ok(safePath(file.path), 'HISTORICAL_CREATE_FILE_PATH_INVALID');
    assert.ok(!index.has(file.path), 'HISTORICAL_CREATE_DUPLICATE_FILE');
    assert.match(file.gitBlobSha1 ?? '', HEX40, 'HISTORICAL_CREATE_BLOB_REQUIRED');
    assert.match(file.sha256 ?? '', HEX64, 'HISTORICAL_CREATE_SHA256_REQUIRED');
    assert.ok(Number.isSafeInteger(file.sizeBytes) && file.sizeBytes > 0 && file.sizeBytes <= 32 * 1024 * 1024,
      'HISTORICAL_CREATE_FILE_SIZE_INVALID');
    index.set(file.path, file);
  }
  const files = entry.files.map(relative => {
    assert.ok(safePath(relative) && index.has(relative), 'HISTORICAL_CREATE_FILE_NOT_PINNED');
    return index.get(relative);
  });
  assert.ok(files.reduce((sum, file) => sum + file.sizeBytes, 0) <= 128 * 1024 * 1024, 'HISTORICAL_CREATE_FIXTURE_TOO_LARGE');
  return { entry, files };
}

function readPinnedFiles(repoRoot, sourceCommit, files) {
  // commit:path, rather than a dangling object or the working tree, also binds
  // every dependency to its original repository location at the reviewed main.
  const refs = files.map(file => `${sourceCommit}:${file.path}`);
  const result = spawnSync('git', ['cat-file', '--batch'], {
    cwd: repoRoot,
    input: refs.join('\n') + '\n',
    maxBuffer: 129 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`HISTORICAL_CREATE_GIT_READ_FAILED:${result.error?.message || result.stderr?.toString()}`);
  }
  const output = result.stdout;
  let offset = 0;
  return files.map((file, index) => {
    const end = output.indexOf(10, offset);
    assert.ok(end >= offset, 'HISTORICAL_CREATE_GIT_HEADER_MISSING');
    const header = output.subarray(offset, end).toString('utf8');
    if (header.endsWith(' missing')) {
      throw new Error(`HISTORICAL_CREATE_GIT_OBJECT_REQUIRED:${refs[index]} (fetch full history; no current-source fallback)`);
    }
    const match = /^([a-f0-9]{40}) blob ([0-9]+)$/.exec(header);
    assert.ok(match, 'HISTORICAL_CREATE_GIT_BLOB_HEADER_INVALID');
    assert.equal(match[1], file.gitBlobSha1, 'HISTORICAL_CREATE_BLOB_MISMATCH');
    assert.equal(Number(match[2]), file.sizeBytes, 'HISTORICAL_CREATE_SIZE_MISMATCH');
    const start = end + 1;
    const bytes = output.subarray(start, start + file.sizeBytes);
    assert.equal(bytes.length, file.sizeBytes, 'HISTORICAL_CREATE_BYTES_TRUNCATED');
    assert.equal(output[start + file.sizeBytes], 10, 'HISTORICAL_CREATE_GIT_SEPARATOR_MISSING');
    assert.equal(blobDigest(bytes), file.gitBlobSha1, 'HISTORICAL_CREATE_RAW_BLOB_MISMATCH');
    assert.equal(digest(bytes), file.sha256, 'HISTORICAL_CREATE_SHA256_MISMATCH');
    offset = start + file.sizeBytes + 1;
    if (index === files.length - 1) assert.equal(offset, output.length, 'HISTORICAL_CREATE_UNEXPECTED_GIT_OUTPUT');
    return { ...file, bytes };
  });
}

function materializeHistoricalCreateFixture(caseId, options = {}) {
  const repoRoot = options.repoRoot || REPO_ROOT;
  const manifest = options.manifest || JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const { entry, files } = selectedFiles(manifest, caseId);
  const pinned = readPinnedFiles(repoRoot, manifest.sourceCommit, files);
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-create-history-'));
  const cleanup = () => fs.rmSync(root, { recursive: true, force: true });
  try {
    // The production calibration reader locates its temporary repository by this
    // marker. All Git reads above use the real checkout, never this fixture.
    fs.mkdirSync(path.join(root, '.git'));
    for (const file of pinned) {
      const target = path.join(root, file.path);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, file.bytes);
    }
    const examFile = path.join(root, entry.examPath);
    const evidenceFile = path.join(root, entry.evidencePath);
    const evidence = JSON.parse(fs.readFileSync(evidenceFile, 'utf8'));
    assert.equal(evidence.stage, 'CREATE', 'HISTORICAL_CREATE_STAGE_MISMATCH');
    assert.equal(evidence.examPath, entry.examPath, 'HISTORICAL_CREATE_EXAM_PATH_MISMATCH');
    assert.equal(evidence.questionCount, entry.questionCount, 'HISTORICAL_CREATE_EVIDENCE_COUNT_MISMATCH');
    assert.equal(evidence.examSha256, `sha256:${digest(fs.readFileSync(examFile))}`, 'HISTORICAL_CREATE_EVIDENCE_SOURCE_MISMATCH');
    return { root, examFile, evidenceFile, entry, sourceCommit: manifest.sourceCommit, cleanup };
  } catch (error) {
    cleanup();
    throw error;
  }
}

function runHistoricalCreateGates(caseId) {
  const fixture = materializeHistoricalCreateFixture(caseId);
  try {
    for (const [gate, extra] of [
      ['solution-calibration-gate.mjs', ['--preflight']],
      ['review-evidence-gate.mjs', []],
    ]) {
      const result = spawnSync(process.execPath, [
        path.join(REPO_ROOT, 'archive/tools', gate),
        '--exam', fixture.entry.examPath,
        '--evidence', fixture.entry.evidencePath,
        '--stage', 'CREATE', ...extra,
      ], { cwd: fixture.root, stdio: 'inherit' });
      assert.equal(result.error, undefined, `HISTORICAL_CREATE_GATE_EXECUTION_FAILED:${gate}`);
      assert.equal(result.status, 0, `HISTORICAL_CREATE_GATE_FAILED:${gate}`);
    }
    console.log(`${caseId}: historical CREATE canonical gates PASS (${fixture.entry.questionCount} questions; ${fixture.sourceCommit})`);
  } finally {
    fixture.cleanup();
  }
}

module.exports = { materializeHistoricalCreateFixture, runHistoricalCreateGates };

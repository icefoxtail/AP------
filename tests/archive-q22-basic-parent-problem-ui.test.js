'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const C = require('../tools/check-q22-basic-parent-problem-browser.cjs');
const H = require('../tools/check-reviewed-problem-renderer-browser.cjs');
const root = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, C.MANIFEST_PATH)));
const copy = value => JSON.parse(JSON.stringify(value));
const commit = 'a'.repeat(40);
function inputs() {
  const source = fs.readFileSync(path.join(root, C.EXPECTED_ITEM.sourcePath));
  const asset = fs.readFileSync(path.join(root, C.EXPECTED_ITEM.assetPath));
  const record = { sourceArchiveFile: C.EXPECTED_ITEM.sourcePath.slice('archive/exams/'.length), sourceOrdinal: 22,
    questionUid: C.EXPECTED_ITEM.questionUid };
  const files = new Map([[C.EXPECTED_ITEM.sourcePath, source], [C.EXPECTED_ITEM.assetPath, asset],
    [C.IDENTITY_PATH, Buffer.from(JSON.stringify({ records: [record] }))]]);
  const reader = { read(file) { assert(files.has(file), 'UNDECLARED_READ'); return files.get(file); },
    ref(file, bytes = this.read(file)) { return { commit, path: file, gitBlobSha1: H.gitBlob(bytes), sha256: H.sha256(bytes), bytes: bytes.length }; } };
  return { files, reader, record };
}
function technical() { return { mode: 'exam', questions: 24, pages: 24, readiness: 'RENDER_READY', imagesComplete: true,
  mathErrors: 0, unrenderedMath: 0, mathJaxSource: 'local', solutionNodes: 0 }; }
function completed() {
  const actual = C.preflight(inputs().reader, manifest), item = actual.items[0];
  const rows = C.VIEWPORTS.map((viewport, vi) => {
    const intervals = vi === 0 ? [[0, 600]] : [[0, 400], [368, 600]];
    const tiles = intervals.map((relativeInterval, index) => ({ tileIndex: index + 1, relativeInterval,
      filename: `Q22-${viewport.name}-tile-0${index + 1}.png` }));
    const capture = { schemaVersion: H.TILE_SCHEMA, method: 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES', tileLimit: 8,
      overlapCssPixels: 32, tileCount: tiles.length, content: { height: 600 }, tiles,
      coverage: H.assertTileCoverage(600, tiles), cssWrites: 0, domWrites: 0, viewportChanges: 0,
      compositeImageCreated: false, feedbackIdle: true, foreignContentHits: 0 };
    return { status: 'PASS', key: 'Q22', questionUid: item.questionUid, sourceOrdinal: 22, viewport: copy(viewport),
      sourceRef: copy(item.sourceRef), assetRef: copy(item.assetRef), technical: technical(), capture, visualReview: 'PENDING',
      screenshots: tiles.map(tile => ({ tileIndex: tile.tileIndex, path: tile.filename, sha256: H.sha256(tile.filename), bytes: 100 })) };
  });
  const artifacts = rows.flatMap(row => row.screenshots.map(({ tileIndex, ...ref }) => ref));
  return { actual, rows, artifacts };
}

test('the closed fixture contains only the one Q22 problem and two unchanged student viewports', () => {
  assert.equal(C.validateManifest(manifest), manifest);
  assert.equal(manifest.items.length, 1); assert.equal(manifest.expectedCases, 2);
  assert.equal(manifest.items[0].expectedBankCount, 24);
  assert.equal(C.SCHEMA, 'archive-q22-basic-parent-problem-ui-preview-v1');
  const raw = JSON.stringify(manifest);
  assert(!/solution|answer|verdict|rationale|correctChoice/.test(raw));
});
for (const [name, mutate] of [
  ['schema', m => { m.schemaVersion = 'archive-problem-renderer-student-ui-preview-v2'; }],
  ['scope', m => { m.scope = 'FULL_NATIVE_APPROVAL'; }],
  ['case count', m => { m.expectedCases = 6; }],
  ['other item', m => { m.items[0].questionUid = 'qid_v1_' + 'b'.repeat(64); }],
  ['ordinal', m => { m.items[0].sourceOrdinal = 21; }],
  ['bank count', m => { m.items[0].expectedBankCount = 23; }],
  ['second UID', m => { m.items.push(copy(m.items[0])); }],
  ['source path', m => { m.items[0].sourcePath = 'archive/exams/other.js'; }],
  ['source Git', m => { m.items[0].sourceGitBlobSha1 = 'b'.repeat(40); }],
  ['source raw', m => { m.items[0].sourceSha256 = 'b'.repeat(64); }],
  ['asset path', m => { m.items[0].assetPath = m.items[0].assetPath.replace('-v2.svg', '-v1.svg'); }],
  ['asset Git', m => { m.items[0].assetGitBlobSha1 = 'b'.repeat(40); }],
  ['asset raw', m => { m.items[0].assetSha256 = 'b'.repeat(64); }],
  ['payload digest', m => { m.items[0].problemPayloadSha256 = 'b'.repeat(64); }],
  ['presentation digest', m => { m.items[0].presentationSha256 = 'b'.repeat(64); }],
  ['viewport resizing', m => { m.viewports[1].height += 100; }],
  ['single viewport', m => { m.viewports.pop(); }],
  ['extra item key', m => { m.items[0].skipAssetCheck = true; }],
  ['extra top key', m => { m.force = true; }]
]) test('rejects fixture widening or substitution: ' + name, () => {
  const altered = copy(manifest); mutate(altered); assert.throws(() => C.validateManifest(altered), /UI_Q22_/);
});

test('preflight binds the current public full source, asset and exact identity locator without exposing question text', () => {
  const f = inputs(), result = C.preflight(f.reader, manifest);
  assert.equal(result.expectedBankCount, 24); assert.equal(result.items.length, 1);
  assert.equal(result.items[0].sourceRef.gitBlobSha1, C.EXPECTED_ITEM.sourceGitBlobSha1);
  assert.equal(result.items[0].assetRef.sha256, C.EXPECTED_ITEM.assetSha256);
  for (const ref of [result.identityRef, result.items[0].sourceRef, result.items[0].assetRef])
    assert.deepEqual(Object.keys(ref).sort(), ['commit', 'path', 'gitBlobSha1', 'sha256', 'bytes'].sort());
  assert(!/"content"|"choices"|"solution"|"answer"/.test(JSON.stringify(result)));
});
for (const [name, mutate, pattern] of [
  ['source bytes', f => f.files.set(C.EXPECTED_ITEM.sourcePath, Buffer.concat([f.files.get(C.EXPECTED_ITEM.sourcePath), Buffer.from('\n')])), /SOURCE_GIT_DRIFT/],
  ['asset same-path bytes', f => f.files.set(C.EXPECTED_ITEM.assetPath, Buffer.concat([f.files.get(C.EXPECTED_ITEM.assetPath), Buffer.from('\n')])), /ASSET_GIT_DRIFT/],
  ['identity missing', f => f.files.set(C.IDENTITY_PATH, Buffer.from(JSON.stringify({ records: [] }))), /UNIQUE_IDENTITY/],
  ['identity duplicate', f => f.files.set(C.IDENTITY_PATH, Buffer.from(JSON.stringify({ records: [f.record, f.record] }))), /UNIQUE_IDENTITY/],
  ['identity other UID', f => f.files.set(C.IDENTITY_PATH, Buffer.from(JSON.stringify({ records: [{ ...f.record, questionUid: 'qid_v1_' + 'c'.repeat(64) }] }))), /IDENTITY_UID/],
  ['identity other ordinal', f => f.files.set(C.IDENTITY_PATH, Buffer.from(JSON.stringify({ records: [{ ...f.record, sourceOrdinal: 23 }] }))), /UNIQUE_IDENTITY/]
]) test('preflight rejects ' + name, () => { const f = inputs(); mutate(f); assert.throws(() => C.preflight(f.reader, manifest), pattern); });

test('explicit workflow head differs safely from the unmodified PR event merge reference', () => {
  const env = Object.freeze({ ARCHIVE_Q22_PROBLEM_UI_EXPECTED_SHA: commit, GITHUB_SHA: 'b'.repeat(40) });
  assert.deepEqual(C.checkoutEvidence(commit, env), { expectedCheckoutCommit: commit, actualCheckoutCommit: commit, githubEventCommit: 'b'.repeat(40) });
  assert.equal(env.GITHUB_SHA, 'b'.repeat(40));
});
for (const env of [{}, { GITHUB_SHA: commit }, { ARCHIVE_Q22_PROBLEM_UI_EXPECTED_SHA: '' },
  { ARCHIVE_Q22_PROBLEM_UI_EXPECTED_SHA: commit.slice(0, 7) }, { ARCHIVE_Q22_PROBLEM_UI_EXPECTED_SHA: 'b'.repeat(40) },
  { ARCHIVE_Q22_PROBLEM_UI_EXPECTED_SHA: commit, GITHUB_SHA: 'bad' }])
  test('checkout cannot fall back to a mismatched or malformed event declaration ' + JSON.stringify(env), () => {
    assert.throws(() => C.checkoutEvidence(commit, env), /UI_Q22_/);
  });

test('technical readiness alone remains question-only and complete-bank', () => { C.assertTechnicalState(technical()); });
for (const [key, value] of [['mode', 'sol'], ['questions', 23], ['readiness', 'BUILDING'], ['pages', 0],
  ['imagesComplete', false], ['mathErrors', 1], ['unrenderedMath', 1], ['mathJaxSource', 'cdn'], ['solutionNodes', 1]])
  test(`technical observation refuses ${key}=${value}`, () => { const valueRow = technical(); valueRow[key] = value; assert.throws(() => C.assertTechnicalState(valueRow), /UI_/); });

test('two logical cases bind every original tile and remain visual-review pending', () => {
  const f = completed(); assert.equal(C.assertCompletedResults(f.rows, f.actual, manifest, f.artifacts), 3);
  assert.equal(f.rows.length, 2); assert.equal(f.artifacts.length, 3);
  assert(f.rows.every(row => row.visualReview === 'PENDING'));
});
for (const [name, mutate] of [
  ['missing mobile', f => f.rows.pop()], ['duplicate desktop', f => { f.rows[1].viewport = copy(f.rows[0].viewport); }],
  ['changed UID', f => { f.rows[0].questionUid = 'qid_v1_' + 'b'.repeat(64); }],
  ['changed source ref', f => { f.rows[0].sourceRef.sha256 = 'b'.repeat(64); }],
  ['changed asset ref', f => { f.rows[0].assetRef.gitBlobSha1 = 'b'.repeat(40); }],
  ['premature visual approval', f => { f.rows[0].visualReview = 'PASS'; }],
  ['source mode', f => { f.rows[0].technical.mode = 'sol'; }],
  ['CSS mutation', f => { f.rows[0].capture.cssWrites = 1; }], ['DOM mutation', f => { f.rows[0].capture.domWrites = 1; }],
  ['viewport mutation', f => { f.rows[0].capture.viewportChanges = 1; }],
  ['stitched picture', f => { f.rows[0].capture.compositeImageCreated = true; }],
  ['pending feedback', f => { f.rows[0].capture.feedbackIdle = false; }],
  ['foreign content', f => { f.rows[0].capture.foreignContentHits = 1; }],
  ['shortened overlap', f => { f.rows[1].capture.tiles[1].relativeInterval[0] += 1; }],
  ['missing bottom', f => { f.rows[1].capture.tiles[1].relativeInterval[1] -= 1; }],
  ['tile gap hidden in proof', f => { f.rows[1].capture.coverage.complete = false; }],
  ['missing original PNG', f => { f.artifacts.pop(); }],
  ['extra PNG', f => { f.artifacts.push({ path: 'foreign.png', sha256: 'd'.repeat(64), bytes: 99 }); }],
  ['altered PNG hash', f => { f.artifacts[0].sha256 = 'd'.repeat(64); }],
  ['single-shot alias', f => { f.rows[1].screenshots = []; f.rows[1].screenshot = f.artifacts[1]; }],
  ['tile index swap', f => { f.rows[1].screenshots[1].tileIndex = 1; }]
]) test('complete Q22 output refuses ' + name, () => {
  const f = completed(); mutate(f); assert.throws(() => C.assertCompletedResults(f.rows, f.actual, manifest, f.artifacts), /UI_/);
});

test('the imported UI3 capture and font module remains its exact frozen source and six-case contract', () => {
  assert.equal(H.sha256(fs.readFileSync(path.join(root, C.SHARED_CHECKER_PATH))), C.SHARED_CHECKER_SHA256);
  const sharedManifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/archive-reviewed-problem-renderer-ui3.json')));
  assert.equal(H.validateManifest(sharedManifest).expectedCases, 6); assert.equal(H.TILE_OVERLAP, 32); assert.equal(H.TILE_LIMIT, 8);
});
test('output cannot overwrite the checkout, reuse stale artifacts or follow an output symlink', () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'q22-output-test-'));
  try {
    assert.equal(C.checkedOutput(root, path.join(folder, 'new')), path.join(folder, 'new'));
    assert.throws(() => C.checkedOutput(root, root), /OUTSIDE_CHECKOUT/);
    assert.throws(() => C.checkedOutput(root, path.join(root, 'output')), /OUTSIDE_CHECKOUT/);
    fs.writeFileSync(path.join(folder, 'old.png'), 'old'); assert.throws(() => C.checkedOutput(root, folder), /EMPTY_OUTPUT/);
    fs.symlinkSync(folder, path.join(folder, 'linked')); assert.throws(() => C.checkedOutput(root, path.join(folder, 'linked', 'new')), /SYMLINK/);
  } finally { fs.rmSync(folder, { recursive: true, force: true }); }
});

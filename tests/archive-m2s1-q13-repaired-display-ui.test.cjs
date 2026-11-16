'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const C = require('../tools/check-m2s1-q13-repaired-display-browser.cjs');
const H = require('../tools/check-reviewed-problem-renderer-browser.cjs');
const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative));
const reader = { read, ref: (relative, bytes = read(relative)) => ({
  path: relative, gitBlobSha1: H.gitBlob(bytes), sha256: H.sha256(bytes), bytes: bytes.length
}) };
const manifest = JSON.parse(read(C.SPECS.PROBLEM.path));
const UID = 'qid_v1_594a94974ad128fef949b5ad8e5b88adf7658172b79e76e4cbabaa9f40b8f101';

test('only the repaired Q13 and its two original viewports pass exact source/asset/identity preflight', () => {
  const result = C.preflight(reader, manifest);
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].questionUid, UID);
  assert.equal(result.items[0].sourceOrdinal, 13);
  assert.equal(result.items[0].assetRef.gitBlobSha1, '90d7c28a4f812792acda697ac66cbf2eac37f439');
  assert.deepEqual(manifest.viewports, [
    { name: 'desktop', width: 1365, height: 1000 },
    { name: 'mobile', width: 390, height: 844 }
  ]);
  assert.equal(manifest.expectedCases, 2);
  assert.equal(result.status, undefined);
});

test('another UID, source ordinal, old SVG, added item, mode, viewport or profile is rejected', () => {
  for (const change of [
    m => m.items[0].questionUid = 'qid_v1_' + '0'.repeat(64),
    m => m.items[0].sourceOrdinal = 24,
    m => m.items[0].assets[0].gitBlobSha1 = '6b233140aa1c7a622fd0d43c841ab0396cc11f9b',
    m => m.items.push(structuredClone(m.items[0])),
    m => m.items.pop(),
    m => m.expectedCases = 1,
    m => m.viewports[1].width = 400,
    m => m.viewports.reverse(),
    m => m.mode = 'sol',
    m => m.surface = 'SOLUTION',
    m => m.captureProfile = 'TWO_ROLES'
  ]) {
    const changed = structuredClone(manifest); change(changed);
    assert.throws(() => C.validateManifest(changed));
  }
});

test('unchanged declared hashes cannot hide altered source or repaired SVG bytes', () => {
  for (const relative of [manifest.items[0].sourcePath, manifest.items[0].assets[0].path]) {
    const altered = { ...reader, read: p => p === relative ? Buffer.concat([read(p), Buffer.from(' ')]) : read(p) };
    assert.throws(() => C.preflight(altered, manifest), /UI_(SOURCE|ASSET)_GIT_DRIFT/);
  }
});

test('the selected source ordinal must retain exactly its registered UID', () => {
  const relative = 'archive/data/question_identity_map.json';
  const identity = JSON.parse(read(relative));
  const selected = identity.records.filter(x => x.sourceArchiveFile === manifest.items[0].sourcePath.slice('archive/exams/'.length) && Number(x.sourceOrdinal) === 13);
  assert.equal(selected.length, 1); selected[0].questionUid = 'wrong-uid';
  assert.throws(() => C.preflight({ ...reader, read: p => p === relative ? Buffer.from(JSON.stringify(identity)) : read(p) }, manifest), /UI_IDENTITY_UID/);
});

test('an exact event/checkout commitment is required independently of the selected binding', () => {
  const sha = 'a'.repeat(40);
  assert.throws(() => C.checkoutEvidence(sha, {}), /UI_EXPECTED_CHECKOUT_REQUIRED/);
  assert.throws(() => C.checkoutEvidence(sha, { ARCHIVE_M2S1_DISPLAY_UI_EXPECTED_SHA: 'b'.repeat(40) }), /UI_CHECKOUT_MISMATCH/);
  assert.throws(() => C.checkoutEvidence(sha, { ARCHIVE_M2S1_DISPLAY_UI_EXPECTED_SHA: sha, GITHUB_SHA: 'invalid' }), /UI_EVENT_SHA/);
  assert.equal(C.checkoutEvidence(sha, { ARCHIVE_M2S1_DISPLAY_UI_EXPECTED_SHA: sha, GITHUB_SHA: sha }).actualCheckoutCommit, sha);
});

test('the original standard helper remains exact and rejects a two-child or clipped problem', () => {
  assert.equal(H.sha256(read('tools/check-reviewed-problem-renderer-browser.cjs')), '94ec31b0e66d1461e7e9757e10af194ac2de47d9b614da4ab191e4615a17dfa4');
  const frame = { question: { x: 10, y: 10, width: 300, height: 400 },
    children: [{ x: 12, y: 12, width: 100, height: 20 }, { x: 12, y: 40, width: 290, height: 40 }, { x: 12, y: 90, width: 290, height: 200 }],
    viewport: { width: 390, height: 844 }, obstructions: [], feedbackIdle: true, readiness: 'RENDER_READY', solutionNodes: 0 };
  assert(H.planProblemTiles(frame).tiles.length > 0);
  assert.throws(() => H.planProblemTiles({ ...frame, children: frame.children.slice(0, 2) }), /UI_COMPLETE_PROBLEM_CHILDREN/);
  const clipped = structuredClone(frame); clipped.children[2].width = 400;
  assert.throws(() => H.planProblemTiles(clipped), /UI_PROBLEM_CHILD_CLIPPED/);
  assert.throws(() => H.assertTileCoverage(100, [{ tileIndex: 1, relativeInterval: [0, 99] }]), /UI_SCROLL_TILE_BOTTOM_MISSING/);
});

test('solution mode, incomplete math, absent image or a different bank cannot grant technical success', () => {
  const technical = { mode: 'exam', questions: 24, pages: 1, readiness: 'RENDER_READY', imagesComplete: true,
    mathErrors: 0, unrenderedMath: 0, mathJaxSource: 'local', solutionNodes: 0 };
  C.assertTechnicalState(technical, 'exam', 24);
  for (const changed of [{ mode: 'sol' }, { questions: 23 }, { solutionNodes: 1 }, { mathErrors: 1 }, { unrenderedMath: 1 }, { imagesComplete: false }, { mathJaxSource: 'cdn' }])
    assert.throws(() => C.assertTechnicalState({ ...technical, ...changed }, 'exam', 24));
});

test('neither a missing viewport nor placeholder results can produce a final proof', () => {
  assert.throws(() => C.assertCompletedResults([], { items: [] }, manifest, []), /UI_ALL_LOGICAL_CASES/);
  assert.throws(() => C.assertCompletedResults([{ status: 'PASS' }], { items: [] }, manifest, []), /UI_ALL_LOGICAL_CASES/);
  assert.throws(() => C.assertCompletedResults(Array(2).fill({ status: 'PASS', key: 'E010-Q13', viewport: { name: 'desktop' } }), { items: [] }, manifest, []));
});

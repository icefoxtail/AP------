import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { deflateSync } from 'node:zlib';
import { REVIEW_RUNS, createReviewManifest, recordReviewScenes, recordReviewCapture, requiredReviewStates, validateReviewManifest, saveReviewManifest, aggregateReviewCaptures } from './high-review-capture.mjs';

// Valid transparent PNG fixtures exercise byte/viewport binding, not rendering.
const pngCache = new Map();
function png(width, height) {
  const key = `${width}x${height}`;
  if (pngCache.has(key)) return pngCache.get(key);
  const chunk = (type, data) => {
    const body = Buffer.concat([Buffer.from(type), data]), out = Buffer.alloc(data.length + 12);
    out.writeUInt32BE(data.length); body.copy(out, 4);
    let crc = 0xffffffff;
    for (const byte of body) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0); }
    out.writeUInt32BE((crc ^ 0xffffffff) >>> 0, out.length - 4); return out;
  };
  const header = Buffer.alloc(13); header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 6;
  const data = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), chunk('IDAT', deflateSync(Buffer.alloc((width * 4 + 1) * height))), chunk('IEND', Buffer.alloc(0))]);
  pngCache.set(key, data); return data;
}
function fixture(t, id = 'common-functions') {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-review-capture-'));
  t.after(() => fs.rmSync(out, { recursive: true, force: true }));
  const provenance = { sourceRole: 'CANDIDATE', sourceCommit: 'b'.repeat(40), candidateHeadSha: 'a'.repeat(40), testedCheckoutSha: 'b'.repeat(40) };
  const sourceBindings = [{ lab: id, htmlSha256: 'c'.repeat(64), sourceSetSha256: 'd'.repeat(64), candidateHeadSourceVerified: true, errors: [] }];
  const manifest = createReviewManifest({ labs: [{ id, next: `next/labs/${id}.html`, sceneTotal: 1 }], provenance, sourceBindings });
  const scenes = [{ id: 'one', index: 0, title: 'One actual scene' }];
  recordReviewScenes(manifest, id, scenes);
  const report = { mode: 'CANDIDATE_CHECK', commit: provenance.sourceCommit, provenance, sourceBindings, labs: [{ id, scenes, observations: [] }] };
  for (const run of REVIEW_RUNS) for (const state of requiredReviewStates(id, run)) {
    const file = `${id}--one--${run}--${state}.png`;
    const viewport = run.startsWith('mobile-') ? { width: 390, height: 844 } : { width: 1440, height: 900 };
    fs.writeFileSync(path.join(out, file), png(viewport.width, viewport.height));
    report.labs[0].observations.push({ id: 'one', run, state });
    const frame = { viewport, canvas: { width: 300, height: 300 }, fonts: 'loaded', questionSha256: 'f'.repeat(64), questionPresent: true, tab: state === 'initial-explore' ? 'explore' : state === 'review-final' ? 'review' : 'problem', step: state === 'review-final' ? 3 : 0, steps: 3, revealed: state === 'answer-revealed', answerOpen: ['answer-revealed', 'review-final'].includes(state), answerPresent: true };
    recordReviewCapture(manifest, out, { lab: id, id: 'one', run, state, file, frame });
  }
  return { out, manifest, report, id };
}

test('common and algebra review states retain their separate required denominators', t => {
  const common = fixture(t), algebra = fixture(t, 'alg-sequence');
  const c = validateReviewManifest(common.manifest, { out: common.out, report: common.report });
  const a = validateReviewManifest(algebra.manifest, { out: algebra.out, report: algebra.report });
  assert.equal(c.complete, true); assert.equal(c.counts.required, 10); assert.equal(c.counts.problemDisclosure, 8); assert.equal(c.counts.finalReview, 2);
  assert.equal(a.complete, true); assert.equal(a.counts.required, 16); assert.equal(a.counts.algebraInitialExplore, 4); assert.equal(a.counts.finalReview, 4);
});

test('missing, duplicate or unobserved required states cannot complete a manifest', t => {
  const f = fixture(t); f.manifest.entries.pop();
  assert.equal(validateReviewManifest(f.manifest, { out: f.out, report: f.report }).complete, false);
  assert.throws(() => recordReviewCapture(f.manifest, f.out, f.manifest.entries[0]), /Duplicate/);
  f.report.labs[0].observations = [];
  assert.ok(validateReviewManifest(f.manifest, { out: f.out, report: f.report }).errors.some(e => e.startsWith('missing-captured-state-observation')));
});

test('PNG bytes and candidate source identity are verified again after capture', t => {
  const f = fixture(t), entry = f.manifest.entries[0];
  fs.appendFileSync(path.join(f.out, entry.file), 'changed');
  assert.ok(validateReviewManifest(f.manifest, { out: f.out, report: f.report }).errors.some(e => e.startsWith('png-byte-mismatch')));
  entry.candidateHeadSha = 'e'.repeat(40);
  assert.ok(validateReviewManifest(f.manifest, { out: f.out, report: f.report }).errors.some(e => e.startsWith('frame-source-mismatch')));
});

test('partial scene census and unresolved targeted coverage remain incomplete', t => {
  const f = fixture(t); f.manifest.scope[0].catalogSceneTotal = 2;
  assert.ok(validateReviewManifest(f.manifest).errors.some(e => e.startsWith('scene-census-mismatch')));
  f.manifest.scope[0].catalogSceneTotal = 1; f.manifest.coverageDebt.push({ reason: 'target not exercised' });
  assert.equal(validateReviewManifest(f.manifest).complete, false);
});

test('artifact aggregation checks the exact requested lab set and raw PNGs', t => {
  const f = fixture(t);
  saveReviewManifest(f.manifest, f.out, f.report, { final: true });
  fs.writeFileSync(path.join(f.out, 'results.json'), JSON.stringify(f.report));
  assert.equal(aggregateReviewCaptures(f.out, [f.id]).complete, true);
  assert.equal(aggregateReviewCaptures(f.out, [f.id, 'alg-sequence']).complete, false);
  fs.unlinkSync(path.join(f.out, f.manifest.entries[0].file));
  assert.equal(aggregateReviewCaptures(f.out, [f.id]).complete, false);
});

test('closed answers, wrong tabs and changed questions cannot borrow disclosure frame labels', t => {
  const f = fixture(t), reveal = f.manifest.entries.find(e => e.state === 'answer-revealed');
  reveal.frame.answerOpen = false;
  assert.ok(validateReviewManifest(f.manifest).errors.some(e => e.startsWith('incorrect-revealed-frame')));
  reveal.frame.answerOpen = true; reveal.frame.questionSha256 = 'e'.repeat(64);
  assert.ok(validateReviewManifest(f.manifest).errors.some(e => e.startsWith('disclosure-question-changed')));
  const hidden = f.manifest.entries.find(e => e.state === 'problem-hidden'); hidden.frame.tab = 'review';
  assert.ok(validateReviewManifest(f.manifest).errors.some(e => e.startsWith('incorrect-hidden-frame')));
});

test('baseline or mismatched report provenance cannot become a candidate capture verdict', t => {
  const f = fixture(t);
  f.manifest.provenance.sourceRole = 'BASELINE';
  assert.ok(validateReviewManifest(f.manifest, { report: f.report }).errors.includes('invalid-candidate-provenance'));
  f.manifest.provenance.sourceRole = 'CANDIDATE'; f.report.mode = 'BASELINE_OBSERVATION';
  assert.ok(validateReviewManifest(f.manifest, { report: f.report }).errors.includes('report-provenance-mismatch'));
});

test('source-proven exclusions and continuous-route limitations do not hide a real coverage debt', t => {
  const f = fixture(t);
  f.manifest.notApplicable.push({ status: 'NOT_APPLICABLE', reason: 'Endpoint excluded by the source parameter range' });
  f.manifest.targetLimitations.push({ status: 'LIMITATION', reason: 'Bounded states, no exhaustive continuous trace' });
  assert.equal(validateReviewManifest(f.manifest).complete, true);
  f.manifest.coverageDebt.push({ status: 'COVERAGE_DEBT', reason: 'A required condition was not found' });
  assert.equal(validateReviewManifest(f.manifest).complete, false);
});

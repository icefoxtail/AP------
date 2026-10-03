const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const review = require('../apmath/student/archive-review-output.js');
const contract = require('../archive/archive2-output-contract.js');
const output = require('../archive/archive2-output.js');
const base = 'https://archive.test/apmath/student/index.html';
const payload = {
  questions: [{ id: 1, questionUid: 'q-old', content: 'issued question', answer: '2', solution: 'issued solution', image: 'data:image/png;base64,AAAA' }],
  meta: { sourceKind: 'archive2-original', qpp: 8, questionUids: ['q-old'], sourceArchiveFile: 'original/sample.js', printHeaderOptions: { title: 'issued title' } },
};
for (const file of ['original/sample.js', 'MIXED:saved-paper', 'MIXED:legacy']) {
  for (const mode of ['exam', 'sol', 'ans']) test(`${file} ${mode} opens the issued snapshot through the strict consumer contract`, async () => {
    const exam = { assignment_id: 'old-assignment', archive_file: file, question_count: 1, mixed_payload_json: JSON.stringify(payload), is_review_only: true };
    const before = JSON.stringify(exam);
    let envelope;
    const url = new URL(await review.prepare(exam, mode, {
      ...output,
      async publishOutputEnvelope(input) { envelope = await contract.createOutputEnvelope(input); return envelope; },
    }, base));
    await contract.validateOutputEnvelope(envelope, {
      outputRequestId: url.searchParams.get('outputRequestId'), ownerId: url.searchParams.get('outputOwnerId'), mode,
    });
    assert.equal(url.searchParams.get('archive2OutputContract'), contract.CONTRACT_VERSION);
    assert.equal(url.searchParams.get('assignmentId'), 'old-assignment');
    assert.equal(url.searchParams.get('qpp'), '8');
    assert.equal(url.searchParams.get('studentReview'), '1');
    assert.equal(url.searchParams.get('submitQr'), '0');
    assert.equal(url.searchParams.get('solQr'), '0');
    assert.equal(url.searchParams.has('originalSnapshot'), false);
    assert.equal(url.searchParams.has('key'), false);
    assert.equal(url.searchParams.has('data'), false);
    assert.deepEqual(envelope.questions, payload.questions);
    assert.deepEqual(envelope.meta, payload.meta);
    assert.equal(envelope.sourceKind, 'assignment');
    assert.equal(JSON.stringify(exam), before);
  });
}
test('only snapshot-less legacy originals retain the existing source route', async () => {
  assert.equal(await review.prepare({ archive_file: 'original/legacy.js' }, 'sol', {}, base), null);
  for (const mixed_payload_json of ['{bad', JSON.stringify({questions:[],meta:{}})]) {
    await assert.rejects(review.prepare({ assignment_id: 'a', archive_file: 'original/x.js', mixed_payload_json }, 'sol', {}, base));
  }
  await assert.rejects(review.prepare({ archive_file: 'MIXED:old' }, 'ans', {}, base));
});
test('storage failure and inconsistent count do not fall back to the current source', async () => {
  const exam = { assignment_id: 'a', archive_file: 'original/x.js', question_count: 2, mixed_payload_json: JSON.stringify(payload) };
  await assert.rejects(review.prepare(exam, 'sol', output, base), /문항 수/);
  exam.question_count = 1;
  await assert.rejects(review.prepare(exam, 'sol', { publishOutputEnvelope: async () => { throw new Error('quota'); } }, base), /quota/);
});
test('the click reserves its popup before async publication and closes it on failure', async () => {
  const html = fs.readFileSync(require.resolve('../apmath/student/index.html'), 'utf8');
  const handler = html.slice(html.indexOf('    async function openOmrReview('), html.indexOf('    function renderOmrReviewActions('));
  const calls = [];
  const popup = { opener: {}, location: {}, close: () => calls.push('close') };
  const ctx = {
    findOmrExam: () => ({}), isOmrReviewAvailable: () => true,
    buildOmrReviewUrl: () => { throw new Error('unexpected legacy fallback'); },
    toast: message => calls.push(message),
    window: { location: { href: base }, open: () => { calls.push('open'); return popup; },
      Archive2Output: output, StudentArchiveReviewOutput: { prepare: async () => { calls.push('publish'); return 'https://archive.test/frozen'; } } },
  };
  vm.runInNewContext(handler, ctx);
  await ctx.openOmrReview('a', 'sol');
  assert.deepEqual(calls, ['open', 'publish']);
  assert.equal(popup.opener, null);
  assert.equal(popup.location.href, 'https://archive.test/frozen');
  ctx.window.StudentArchiveReviewOutput.prepare = async () => { throw new Error('storage unavailable'); };
  await ctx.openOmrReview('a', 'ans');
  assert.deepEqual(calls.slice(-3), ['open', 'close', 'storage unavailable']);
});

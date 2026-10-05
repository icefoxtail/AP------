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
test('student return context keeps the exact portal list and assignment but drops unrelated query secrets', async () => {
  const baseWithContext = 'https://archive.test/apmath/student/index.html?teacher_preview=1&student_id=student-a&assignment_id=assignment-exact&omr=1&access_token=do-not-copy&other=discard#omr-panel-all';
  const exam = { assignment_id: 'assignment-exact', archive_file: 'original/sample.js', question_count: 1, mixed_payload_json: JSON.stringify(payload) };
  const url = new URL(await review.prepare(exam, 'sol', {
    ...output,
    async publishOutputEnvelope(input) { return contract.createOutputEnvelope(input); },
  }, baseWithContext));
  const returnTo = new URL(url.searchParams.get('studentReturnTo'), url.origin);
  assert.equal(returnTo.pathname, '/apmath/student/index.html');
  assert.equal(returnTo.searchParams.get('teacher_preview'), '1');
  assert.equal(returnTo.searchParams.get('student_id'), 'student-a');
  assert.equal(returnTo.searchParams.get('assignment_id'), 'assignment-exact');
  assert.equal(returnTo.searchParams.get('omr'), '1');
  assert.equal(returnTo.searchParams.has('access_token'), false);
  assert.equal(returnTo.searchParams.has('other'), false);
  assert.equal(returnTo.hash, '#omr-panel-all');
});
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

test('teacher preview assignment links show only the exact student Assignment', () => {
  const html = fs.readFileSync(require.resolve('../apmath/student/index.html'), 'utf8');
  assert.match(html, /previewParams\.get\('assignment_id'\)/);
  assert.match(html, /getVisibleOmrExams\(\)/);
  assert.match(html, /data-assignment-id="\$\{escapeHtml\(String\(exam\.assignment_id/);
  const start = html.indexOf('    function getVisibleOmrExams() {');
  const end = html.indexOf('    const STUDENT_PORTAL_RECENT_EXAM_DAYS', start);
  assert.ok(start >= 0 && end > start, 'exact Assignment projection helper exists');
  const context = {
    exactOmrAssignmentId: 'assignment-exact-b',
    getOmrExams: () => [
      { assignment_id: 'assignment-a' },
      { assignment_id: 'assignment-exact-b' },
      { assignment_id: 'assignment-c' },
    ],
  };
  vm.runInNewContext(html.slice(start, end), context);
  assert.deepEqual(Array.from(context.getVisibleOmrExams(), row => row.assignment_id), ['assignment-exact-b']);
  context.getOmrExams = () => [];
  assert.deepEqual(Array.from(context.getVisibleOmrExams()), [], 'a missing exact receipt does not fall back to all assignments');
});
test('student exact deep links call the Assignment-scoped endpoint while ordinary lists remain bounded', async () => {
  const html = fs.readFileSync(require.resolve('../apmath/student/index.html'), 'utf8');
  const start = html.indexOf('    async function loadOmrExams(force = false) {');
  const end = html.indexOf('    function getOmrExams()', start);
  assert.ok(start >= 0 && end > start);
  async function requestFor(exactOmrAssignmentId) {
    const calls = [];
    const context = {
      URLSearchParams,
      exactOmrAssignmentId,
      omrData: null,
      omrLoadedAssignmentId: null,
      omrIndex: null,
      session: { student_id: 'student-a', student_token: 'student-token' },
      hasPortalReadAccess: () => true,
      apiGet: async (url, token) => { calls.push({ url, token }); return { exams: [] }; },
    };
    vm.runInNewContext(html.slice(start, end), context);
    await context.loadOmrExams();
    return calls[0];
  }
  const exact = await requestFor('assignment-old');
  const exactUrl = new URL(exact.url, base);
  assert.equal(exactUrl.searchParams.get('student_id'), 'student-a');
  assert.equal(exactUrl.searchParams.get('assignment_id'), 'assignment-old');
  assert.equal(exact.token, 'student-token');
  const list = await requestFor('');
  const listUrl = new URL(list.url, base);
  assert.equal(listUrl.searchParams.get('student_id'), 'student-a');
  assert.equal(listUrl.searchParams.has('assignment_id'), false);
  const worker = fs.readFileSync(require.resolve('../apmath/worker-backup/worker/routes/student-portal.js'), 'utf8');
  assert.match(worker, /loadStudentClassExamAssignments\(\s*env,\s*verified\.student\.id,\s*150,\s*exactAssignmentId/);
});

test('student app, manifest, service worker, and version endpoint advance together', () => {
  const html = fs.readFileSync(require.resolve('../apmath/student/index.html'), 'utf8');
  const manifest = JSON.parse(fs.readFileSync(require.resolve('../apmath/student/manifest.json'), 'utf8'));
  const version = JSON.parse(fs.readFileSync(require.resolve('../apmath/student/student-version.json'), 'utf8'));
  const sw = fs.readFileSync(require.resolve('../apmath/student/sw.js'), 'utf8');
  const appVersion = html.match(/const STUDENT_APP_VERSION = '([^']+)'/)?.[1];
  const swVersion = sw.match(/const STUDENT_SW_VERSION = '([^']+)'/)?.[1];
  assert.equal(appVersion, '2026.10.03.3');
  assert.equal(manifest.version, appVersion);
  assert.equal(version.version, appVersion);
  assert.equal(swVersion, appVersion);
  assert.match(html, /archive2-output\.js\?v=20261003-student-output-s4-1/);
});

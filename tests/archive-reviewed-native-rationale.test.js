const { test, before } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');

let validate;
before(async () => {
  ({ validateReviewedSourceReassessment: validate } = await import(pathToFileURL(path.join(__dirname,
    '../archive/tools/meta-foundation/reviewed-source-reassessment.mjs'))));
});
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const blob = bytes => crypto.createHash('sha1').update(`blob ${Buffer.byteLength(bytes)}\0`).update(bytes).digest('hex');

function nativeRationaleFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'native-rationale-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (relative, value) => {
    const file = path.join(root, relative); fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
  };
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init', '-q');
  const source = 'fixture/exam.js', sourcePath = `archive/exams/${source}`, reviewPath = 'docs/native-review.json';
  const nativeQuestion = { id: 1, content: 'Reviewed immutable question', choices: ['1', '2'], answer: '1',
    solution: 'Reviewed immutable solution', image: null };
  const sourceBytes = `window.questions = ${JSON.stringify([nativeQuestion])};\n`;
  put(sourcePath, sourceBytes);
  const value = 'The decisive step recorded by the immutable native reviewer.';
  const review = { schemaVersion: 'm3-s2-complete-semantic-review-v1', sourceArchiveFile: source,
    author: 'native-reviewer', rootIntegrator: 'native-integrator', questionCount: 1,
    sourceAfterBlob: blob(sourceBytes), sourceAfterSha256: sha(sourceBytes),
    items: [{ ordinal: 1, questionUid: 'uid1', decision: 'CORRECT', decisiveStep: value, after: {}, debts: [] }] };
  const fingerprints = { sourceFingerprint: sha(JSON.stringify({ content: nativeQuestion.content, choices: nativeQuestion.choices,
    answer: nativeQuestion.answer, solution: nativeQuestion.solution, image: null })),
    contentFingerprint: sha(JSON.stringify({ content: nativeQuestion.content, choices: nativeQuestion.choices, image: null })) };
  const metadata = { questionUid: 'uid1', sourceArchiveFile: source, sourceOrdinal: 1, ...fingerprints,
    metadataApprovalType: 'FINAL_QA', metadataStatus: 'approved_semantic_review', reviewStatus: 'reviewed_pass',
    tagStatus: 'reviewed_pass', metaFoundationStatus: 'ACTIVE', primaryMethod: value, decisiveStep: value };
  const question = { ...nativeQuestion, primaryMethod: value, decisiveStep: value };
  const request = { scope: 'PARTIAL_UIDS', sourceArchiveFile: source, expectedQuestionCount: 1,
    approval: { type: 'FINAL_QA', metadataReviewed: true, evidenceRefs: [] } };
  const patch = { questionUid: 'uid1', sourceOrdinal: 1, before: { ...fingerprints }, after: { ...fingerprints },
    identityBefore: { sourceFingerprint: fingerprints.sourceFingerprint }, evidenceRefs: [] };
  const final = { ...metadata, ...patch.after };
  const commitReview = () => {
    put(reviewPath, review); git('add', '--', sourcePath, reviewPath);
    git('-c', 'user.name=Fixture Reviewer', '-c', 'user.email=fixture@example.invalid', 'commit', '--allow-empty', '-qm', 'Bind native review');
    const ref = { path: reviewPath, sha256: sha(fs.readFileSync(path.join(root, reviewPath))) };
    request.approval.evidenceRefs = [ref]; patch.evidenceRefs = [ref];
    patch.sourceReview = { schemaVersion: 'archive-reviewed-source-reassessment-v1', reviewCommit: git('rev-parse', 'HEAD'),
      reviewPath, reviewRef: ref };
  };
  commitReview();
  return { root, request, patch, metadata, question, final, review, value, put, commitReview,
    args: () => ({ root, request, patch, metadata, question, final, supportedFields: new Set(Object.keys(final)) }) };
}

test('fingerprint-only reassessment preserves an issued verbatim native rationale without a new method judgment', t => {
  const f = nativeRationaleFixture(t), beforeState = JSON.stringify([f.metadata, f.question, f.final]);
  const proof = validate(f.args());
  assert.deepEqual(proof.rationaleBindings.primaryMethod,
    { origin: 'REGISTERED_NATIVE_DECISIVE_STEP_UNCHANGED', valueSha256: sha(f.value) });
  assert.deepEqual(proof.rationaleBindings.decisiveStep,
    { origin: 'NATIVE_ITEM_FIELD', valueSha256: sha(f.value) });
  assert.equal(proof.newMathematicalQa, false);
  assert.equal(JSON.stringify([f.metadata, f.question, f.final]), beforeState);
});

for (const [name, mutate] of [
  ['no prior approval', f => { delete f.metadata.metadataApprovalType; }],
  ['REVIEW2 in place of FINAL_QA', f => { f.metadata.metadataApprovalType = 'REVIEW2'; }],
  ['audit in place of FINAL_QA', f => { f.metadata.metadataApprovalType = 'META_PIPELINE_AUDIT'; }],
  ['pending review', f => { f.metadata.reviewStatus = 'review_required'; }],
  ['pending tags', f => { f.metadata.tagStatus = 'review_required'; }],
  ['pending metadata', f => { f.metadata.metadataStatus = 'registration_pending'; }],
  ['inactive metadata', f => { f.metadata.metaFoundationStatus = 'HOLD'; }],
  ['only one fingerprint', f => { delete f.patch.after.contentFingerprint; }],
  ['additional unchanged metadata field', f => { f.patch.after.level = '중'; f.metadata.level = f.final.level = '중'; }],
  ['only explicit primaryMethod', f => { f.patch.after.primaryMethod = f.value; }],
  ['only explicit decisiveStep', f => { f.patch.after.decisiveStep = f.value; }],
  ['different shared rationale', f => { for (const object of [f.metadata, f.question, f.final]) object.primaryMethod = object.decisiveStep = 'Unreviewed method'; }],
  ['missing native decisive step', f => { delete f.review.items[0].decisiveStep; f.commitReview(); }],
  ['different explicit native method', f => { f.review.items[0].primaryMethod = 'A different reviewed method'; f.commitReview(); }],
  ['missing local native evidence', f => { fs.unlinkSync(path.join(f.root, 'docs/native-review.json')); }],
  ['changed local native evidence', f => { f.put('docs/native-review.json', { ...f.review, author: 'substituted' }); }],
  ['unbound approval evidence', f => { f.request.approval.evidenceRefs = []; }],
  ['unbound item evidence', f => { f.patch.evidenceRefs = []; }],
  ['changed student answer', f => { f.question.answer = '2'; }],
]) test(`registered rationale preservation refuses ${name}`, t => {
  const f = nativeRationaleFixture(t); mutate(f);
  assert.throws(() => validate(f.args()), /source reassessment:/);
});

for (const object of ['metadata', 'question', 'final']) for (const field of ['primaryMethod', 'decisiveStep']) {
  test(`registered rationale preservation refuses a single ${object}.${field} mismatch`, t => {
    const f = nativeRationaleFixture(t); f[object][field] += ' drift';
    assert.throws(() => validate(f.args()), /source reassessment:/);
  });
}

test('the existing explicit two-field native rationale transport still supports its original provenance', t => {
  const f = nativeRationaleFixture(t);
  Object.assign(f.patch.after, { primaryMethod: f.value, decisiveStep: f.value });
  delete f.metadata.metadataApprovalType;
  const proof = validate(f.args());
  assert.equal(proof.rationaleBindings.primaryMethod.origin, 'NATIVE_DECISIVE_STEP_VERBATIM');
});

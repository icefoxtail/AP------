import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import writer from '../archive/review-source-writer.js';

const {
  fingerprintText,
  parseArchiveSource,
  replaceQuestionBankPreservingSource,
  validateRoundTrip,
} = writer;

const directSource = `// keep this comment\nwindow.examTitle = "보존 시험";\nwindow.examDisplayTitle = "표시 제목";\nconst helper = { keep: true };\nwindow.questionBank = [{ id: 1, content: "원본", choices: ["①"] }];\nwindow.extraMeta = { keep: "yes" };\n`;

test('parses a direct questionBank and preserves non-bank source bytes during replacement', () => {
  const parsed = parseArchiveSource(directSource, 'fixture.js');
  const edited = [{ id: 1, content: '수정', choices: ['①', '②'] }];
  const rewritten = replaceQuestionBankPreservingSource(directSource, edited);

  assert.equal(parsed.title, '보존 시험');
  assert.equal(parsed.displayTitle, '표시 제목');
  assert.deepEqual(parsed.bank, [{ id: 1, content: '원본', choices: ['①'] }]);
  assert.match(rewritten, /keep this comment/);
  assert.match(rewritten, /window\.extraMeta = \{ keep: "yes" \}/);
  assert.deepEqual(parseArchiveSource(rewritten, 'fixture.js').bank, edited);
});

test('replaces only the questions member of an object-shaped questionBank', () => {
  const source = `window.examTitle = '객체 시험';\nwindow.questionBank = { meta: { version: 3 }, questions: [{ id: 7, content: 'old' }] };\n`;
  const rewritten = replaceQuestionBankPreservingSource(source, [{ id: 7, content: 'new' }]);
  const parsed = parseArchiveSource(rewritten, 'object.js');

  assert.deepEqual(parsed.bank, [{ id: 7, content: 'new' }]);
  assert.match(rewritten, /meta: \{ version: 3 \}/);
});

test('preserves the final edited bank when the original source applies post-bank helpers', () => {
  const source = `window.questionBank = [{ id: 1, content: 'old' }];\nconst updates = { 1: 'helper' };\nwindow.questionBank.forEach(q => { q.content = updates[q.id]; });\n`;
  const rewritten = replaceQuestionBankPreservingSource(source, [{ id: 1, content: 'new' }]);
  assert.deepEqual(parseArchiveSource(rewritten, 'helper.js').bank, [{ id: 1, content: 'new' }]);
});

test('updates one review override on repeated saves instead of appending overrides', () => {
  const source = `window.questionBank = [{ id: 1, content: 'old' }];\nwindow.questionBank.forEach(q => { q.content += '!'; });\n`;
  const first = replaceQuestionBankPreservingSource(source, [{ id: 1, content: 'new' }]);
  const second = replaceQuestionBankPreservingSource(first, [{ id: 1, content: 'latest' }]);
  assert.deepEqual(parseArchiveSource(second, 'repeat.js').bank, [{ id: 1, content: 'latest' }]);
  assert.equal((second.match(/AP_REVIEW_SOURCE_OVERRIDE/g) || []).length, 1);
});

test('rejects identifier-backed banks instead of rewriting unknown source structure', () => {
  assert.throws(
    () => replaceQuestionBankPreservingSource('const bank = []; window.questionBank = bank;', []),
    /SOURCE_WRITER_UNSUPPORTED_SHAPE/
  );
});

test('post-write validation rejects a source whose parsed bank differs from the intended snapshot', () => {
  assert.throws(
    () => validateRoundTrip(directSource, [{ id: 1, content: '다른 값' }], 'fixture.js'),
    /ROUND_TRIP_SEMANTIC_MISMATCH/
  );
});

test('text fingerprints are stable for identical bytes and change for edited bytes', async () => {
  const first = await fingerprintText('same');
  assert.equal(first, await fingerprintText('same'));
  assert.notEqual(first, await fingerprintText('changed'));
  assert.match(first, /^[0-9a-f]{64}$/);
});

test('all production exam sources pass an unchanged source round-trip', () => {
  for (const file of [
    'archive/exams/types/high/h1/RPM_공통수학1_행렬_12_행렬_고1.js',
    'archive/exams/types/middle/m2/RPM_중2_2-2_부록_대표문제다시풀기_중2.js',
  ]) {
    const source = fs.readFileSync(file, 'utf8');
    const parsed = parseArchiveSource(source, file);
    const rewritten = replaceQuestionBankPreservingSource(source, parsed.bank);
    assert.doesNotThrow(() => validateRoundTrip(rewritten, parsed.bank, file), file);
  }
});

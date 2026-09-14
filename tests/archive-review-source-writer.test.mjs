import assert from 'node:assert/strict';
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

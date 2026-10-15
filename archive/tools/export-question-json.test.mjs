import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {
  buildUidEntries,
  buildUidOccurrenceIndex,
  cloneJsonValue,
  resolveQuestionArray,
  resolveGeneratedSidecarMetadata,
  UnsupportedJsValueError
} from './export-question-json.mjs';

function evaluate(code) {
  const context = vm.createContext({ window: {} });
  vm.runInContext(code, context, { timeout: 1000 });
  return context;
}

test('JSON cloning preserves exact strings, array order, empty values, and unknown fields', () => {
  const source = {
    content: '$\\frac{x^2}{\\sqrt{3}}$ \\text{LaTeX}',
    choices: ['', '②', '<img src="assets/diagram.svg">'],
    answer: '③',
    solution: '첫째 줄\n둘째 줄',
    image: 'assets/diagram.svg',
    customNested: { z: 0, a: [true, null, ''] }
  };
  const copy = cloneJsonValue(source);
  assert.equal(JSON.stringify(copy), JSON.stringify(source));
  assert.deepEqual(Object.keys(copy), Object.keys(source));
  assert.equal(copy.content, source.content);
  assert.deepEqual(copy.choices, source.choices);
});

test('unsupported values fail with explicit codes and paths', () => {
  const cases = [
    [undefined, 'UNDEFINED_VALUE'],
    [() => 1, 'FUNCTION_VALUE'],
    [Symbol('s'), 'SYMBOL_VALUE'],
    [1n, 'BIGINT_VALUE'],
    [NaN, 'NON_FINITE_NUMBER'],
    [Infinity, 'NON_FINITE_NUMBER'],
    [-Infinity, 'NON_FINITE_NUMBER'],
    [-0, 'NEGATIVE_ZERO'],
    [new Date('2026-01-01T00:00:00Z'), 'NON_PLAIN_OBJECT']
  ];
  for (const [value, code] of cases) {
    assert.throws(
      () => cloneJsonValue({ nested: value }, '$.root'),
      error => error instanceof UnsupportedJsValueError && error.code === code && error.valuePath === '$.root.nested'
    );
  }

  const circular = {};
  circular.self = circular;
  assert.throws(() => cloneJsonValue(circular), error => error.code === 'CIRCULAR_REFERENCE');

  const sparse = [];
  sparse.length = 1;
  assert.throws(() => cloneJsonValue(sparse), error => error.code === 'SPARSE_ARRAY_HOLE');

  const accessor = {};
  Object.defineProperty(accessor, 'secret', { enumerable: true, get() { throw new Error('must not run'); } });
  assert.throws(() => cloneJsonValue(accessor), error => error.code === 'ACCESSOR_PROPERTY');

  const symbolKey = { [Symbol('field')]: 1 };
  assert.throws(() => cloneJsonValue(symbolKey), error => error.code === 'SYMBOL_PROPERTY');

  const hidden = {};
  Object.defineProperty(hidden, 'secret', { value: 1, enumerable: false });
  assert.throws(() => cloneJsonValue(hidden), error => error.code === 'NON_ENUMERABLE_PROPERTY');

  class CustomArray extends Array {}
  assert.throws(() => cloneJsonValue(new CustomArray(1, 2)), error => error.code === 'NON_PLAIN_ARRAY_PROTOTYPE');
});

test('question array resolution retains the original container and post-execution mutation', () => {
  const context = evaluate(
    'window.examTitle = "exam title"; window.questionBank = { batch: "B-01", questions: [{ id: "", content: "$x\\\\leq 2$", custom: { keep: true } }] }; (function () { Object.assign(window.questionBank.questions[0], { runtimeMeta: { status: "pending" } }); })();',
  );
  const resolved = resolveQuestionArray(context, 'exam');
  assert.equal(resolved.questionArrayLocation, 'window.questionBank.questions');
  assert.deepEqual(resolved.questionArrayPath, ['window', 'questionBank', 'questions']);
  const clonedGlobals = cloneJsonValue(resolved.sourceGlobals);
  assert.equal(clonedGlobals.window.examTitle, 'exam title');
  assert.equal(clonedGlobals.window.questionBank.batch, 'B-01');
  assert.equal(clonedGlobals.window.questionBank.questions[0].runtimeMeta.status, 'pending');
  assert.equal(clonedGlobals.window.questionBank.questions[0].id, '');
});

test('question array resolution supports examData, top-level globals, and generatedLiteQuestions', () => {
  const examData = evaluate('window.examData = { title: "t", questions: [{ id: 1 }] };');
  assert.equal(resolveQuestionArray(examData, 'exam').questionArrayLocation, 'window.examData.questions');

  const globalQuestion = evaluate('var questions = [{ id: 2 }];');
  assert.equal(resolveQuestionArray(globalQuestion, 'exam').questionArrayLocation, 'global.questions');

  const generated = evaluate('window.generatedLiteQuestions = [{ uid: "ALITE-X" }];');
  assert.equal(resolveQuestionArray(generated, 'generated').questionArrayLocation, 'window.generatedLiteQuestions');
});

test('conflicting recognized question arrays are rejected instead of choosing one silently', () => {
  const context = evaluate('window.questions = [{ id: 1 }]; window.questionBank = [{ id: 2 }];');
  assert.throws(() => resolveQuestionArray(context, 'exam'), /MULTIPLE_QUESTION_ARRAYS_CONFLICT/);
});

test('a malformed source with no question array is an explicit parse error', () => {
  const context = evaluate('window.examTitle = "missing bank";');
  assert.throws(() => resolveQuestionArray(context, 'exam'), /QUESTION_ARRAY_NOT_FOUND/);
});

test('UID index keeps repeated identities as separate source occurrences and lists unresolved keys', () => {
  const index = buildUidOccurrenceIndex([
    {
      sourceKey: 'archive/generated/lite/v1/a.js#1',
      sourcePath: 'archive/generated/lite/v1/a.js',
      sourceOrdinal: 1,
      jsonPath: 'generated/lite/v1/a.json',
      questionArrayPath: ['window', 'questionBank'],
      uidEntries: [{ questionUid: 'ALITE-EXISTING', identitySource: 'SOURCE_QUESTION_UID_FIELD:uid' }]
    },
    {
      sourceKey: 'archive/generated/lite/v1/b.js#2',
      sourcePath: 'archive/generated/lite/v1/b.js',
      sourceOrdinal: 2,
      jsonPath: 'generated/lite/v1/b.json',
      questionArrayPath: ['window', 'questionBank'],
      uidEntries: [{ questionUid: 'ALITE-EXISTING', identitySource: 'SOURCE_QUESTION_UID_FIELD:uid' }]
    },
    {
      sourceKey: 'archive/exams/textbooks/book.js#3',
      sourcePath: 'archive/exams/textbooks/book.js',
      sourceOrdinal: 3,
      jsonPath: 'exams/textbooks/book.json',
      questionArrayPath: ['window', 'questionBank'],
      uidEntries: [],
      unresolvedReason: 'UNKNOWN_SOURCE_ORDINAL'
    }
  ]);
  assert.equal(index.uniqueQuestionUidCount, 1);
  assert.equal(index.uidOccurrenceCount, 2);
  assert.equal(index.byUid['ALITE-EXISTING'].length, 2);
  assert.equal(index.unresolvedSourceKeys[0].sourceKey, 'archive/exams/textbooks/book.js#3');
});

test('UID index labels canonical map identities separately from supplemental source identifiers', () => {
  const index = buildUidOccurrenceIndex([
    {
      sourceKey: 'archive/exams/original/sample.js#1',
      sourcePath: 'archive/exams/original/sample.js',
      sourceOrdinal: 1,
      jsonPath: 'exams/original/sample.json',
      questionArrayPath: ['window', 'questionBank'],
      uidEntries: [
        { questionUid: 'qid_v1_canonical', identitySource: 'QUESTION_IDENTITY_MAP_V1' },
        { questionUid: 'legacy-source-uid', identitySource: 'SOURCE_QUESTION_UID_FIELD:uid', conflictsWithCanonical: true }
      ]
    }
  ]);
  assert.equal(index.uniqueQuestionUidCount, 2);
  assert.equal(index.uniqueUidKeyCount, 2);
  assert.equal(index.canonicalQuestionUidCount, 1);
  assert.equal(index.supplementalUidKeyCount, 1);
  assert.equal(index.uidKeyCountByIdentitySource.QUESTION_IDENTITY_MAP_V1, 1);
  assert.equal(index.lookupKeySemantics.includes('not every key is a verified canonical UID'), true);
});

test('explicit UID conflict remains indexed alongside the existing canonical UID', () => {
  const entries = buildUidEntries({
    questionUid: 'qid_v1_existing',
    identitySource: 'QUESTION_IDENTITY_MAP_V1',
    sourceDeclaredUids: [{ field: 'uid', value: 'ALITE-explicit-source-value' }]
  });
  assert.equal(entries.length, 2);
  assert.equal(entries[0].questionUid, 'qid_v1_existing');
  assert.equal(entries[1].questionUid, 'ALITE-explicit-source-value');
  assert.equal(entries[1].conflictsWithCanonical, true);
});

test('a one-question Generated sidecar UID is associated by ordinal and conflicts remain separate', () => {
  const sidecar = { generatedQuestionUid: 'ALITE-SIDECAR-UID', sourceQid: 5 };
  const match = resolveGeneratedSidecarMetadata({ id: 1 }, sidecar, 1, 1);
  assert.equal(match.status, 'MATCHED_SINGLE_SIDECAR_OBJECT_BY_SOURCE_ORDINAL');
  assert.equal(match.record.generatedQuestionUid, 'ALITE-SIDECAR-UID');

  const ambiguous = resolveGeneratedSidecarMetadata({}, sidecar, 1, 2);
  assert.equal(ambiguous.status, 'NO_SIDECAR_QUESTION_MATCH');

  const entries = buildUidEntries({
    questionUid: 'ALITE-QUESTION-FIELD',
    identitySource: 'SOURCE_QUESTION_UID_FIELD:uid',
    sourceDeclaredUids: [{ field: 'uid', value: 'ALITE-QUESTION-FIELD' }],
    generatedMetadataDeclaredUids: [{ field: 'generatedQuestionUid', value: 'ALITE-SIDECAR-UID' }]
  });
  assert.equal(entries.length, 2);
  assert.equal(entries[1].identitySource, 'GENERATED_METADATA_SIDECAR_FIELD:generatedQuestionUid');
  assert.equal(entries[1].conflictsWithCanonical, true);

  const sidecarOnly = buildUidEntries({
    questionUid: 'ALITE-SIDECAR-UID',
    identitySource: 'GENERATED_METADATA_SIDECAR_FIELD:generatedQuestionUid',
    sourceDeclaredUids: [],
    generatedMetadataDeclaredUids: [{ field: 'generatedQuestionUid', value: 'ALITE-SIDECAR-UID' }]
  });
  assert.equal(sidecarOnly.length, 1);
  assert.equal(sidecarOnly[0].questionUid, 'ALITE-SIDECAR-UID');
  assert.equal(sidecarOnly[0].identitySource, 'GENERATED_METADATA_SIDECAR_FIELD:generatedQuestionUid');
});

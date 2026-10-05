import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import joiner from '../archive/weakness-metadata-join.js';

const identity = JSON.parse(fs.readFileSync('archive/data/question_identity_map.json', 'utf8'));
const indexContext = { window: {} };
vm.runInNewContext(fs.readFileSync('archive/question-index.js', 'utf8'), indexContext);
const indexRecord = indexContext.window.questionIndex.find(record => record.sourceFile.startsWith('original/'));
const identityRecord = identity.records.find(record => record.sourceArchiveFile === indexRecord.sourceFile && record.sourceOrdinal === indexRecord.sourceOrdinal);
const blueprint = {
  archive_file: `exams/${indexRecord.sourceFile}`,
  question_no: Number(indexRecord.id),
  source_archive_file: `exams/${indexRecord.sourceFile}`,
  source_question_no: Number(indexRecord.id),
  source_question_ordinal: indexRecord.sourceOrdinal,
  source_question_uid: identityRecord.questionUid,
  standard_unit_key: indexRecord.standardUnitKey,
  sub_unit_key: indexRecord.subUnitKey,
  concept_cluster_key: 'TEST-CONCEPT',
  type_key: indexRecord.questionType,
  difficulty: indexRecord.level,
};

test('assessment result item joins canonical UID and weakness metadata', () => {
  const [row] = joiner.joinWrongItems({
    assessmentResultItems: [{ session_id: 'sess-1', student_id: 'student-1', source_archive_file: `exams/${indexRecord.sourceFile}`, source_question_ordinal: indexRecord.sourceOrdinal, result_status: 'wrong', is_correct: 0 }],
    blueprintRows: [blueprint],
    identityRecords: identity.records,
    indexRecords: indexContext.window.questionIndex,
  });
  assert.equal(row.questionUid, identityRecord.questionUid);
  assert.equal(row.resolution, 'blueprint_uid');
  assert.equal(row.standardUnitKey, indexRecord.standardUnitKey);
  assert.equal(row.subUnitKey, indexRecord.subUnitKey);
  assert.equal(row.conceptClusterKey, 'TEST-CONCEPT');
  assert.equal(row.resultStatus, 'wrong');
});

test('legacy wrong_answers resolve through session archive and blueprint question number', () => {
  const [row] = joiner.joinWrongItems({
    wrongAnswers: [{ session_id: 'sess-2', student_id: 'student-2', question_id: Number(indexRecord.id) }],
    sessions: [{ id: 'sess-2', archive_file: `exams/${indexRecord.sourceFile}` }],
    blueprintRows: [blueprint],
    identityRecords: identity.records,
    indexRecords: indexContext.window.questionIndex,
  });
  assert.equal(row.questionUid, identityRecord.questionUid);
  assert.equal(row.resolution, 'blueprint_uid');
  assert.equal(row.sourceQuestionNo, Number(indexRecord.id));
});

test('unresolvable source stays explicit and is never assigned a guessed UID', () => {
  const [row] = joiner.joinWrongItems({
    wrongAnswers: [{ session_id: 'sess-3', student_id: 'student-3', question_id: 999 }],
    sessions: [{ id: 'sess-3', archive_file: 'MIXED:missing-source' }],
  });
  assert.equal(row.questionUid, '');
  assert.equal(row.resolution, 'unresolved');
});

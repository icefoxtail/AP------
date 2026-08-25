import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const archiveRoot = path.join(root, 'archive');
const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));

function loadQuestionBank(sourceArchiveFile) {
  const file = path.join(archiveRoot, 'exams', sourceArchiveFile);
  const context = { window: {}, console };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { filename: sourceArchiveFile, timeout: 3000 });
  const bank = context.window.questionBank || context.window.questions;
  assert.ok(Array.isArray(bank), `question bank missing: ${sourceArchiveFile}`);
  return bank;
}

test('Phase 1B sidecar preserves every non-empty production subunit', () => {
  const identity = readJson('archive/data/question_identity_map.json');
  const metadata = readJson('archive/data/question_metadata.json');
  const classification = readJson('archive/_generated/intelligence/phase3/complete-subunit-classification/archive-complete-subunit-classification-v1.json');
  assert.equal(metadata.consistency.sourceFingerprintFailures, 0);
  assert.equal(metadata.consistency.sourceClassificationConflicts, 0);
  assert.equal(identity.records.length, 10690);
  assert.equal(metadata.records.length, identity.records.length);
  assert.equal(classification.records.length, identity.records.length);

  const metadataByUid = new Map(metadata.records.map(record => [record.questionUid, record]));
  const classificationByUid = new Map(classification.records.map(record => [record.questionUid, record]));
  const grouped = new Map();
  for (const record of identity.records) {
    if (!grouped.has(record.sourceArchiveFile)) grouped.set(record.sourceArchiveFile, []);
    grouped.get(record.sourceArchiveFile).push(record);
  }

  for (const [sourceArchiveFile, records] of grouped) {
    const bank = loadQuestionBank(sourceArchiveFile);
    for (const identityRecord of records) {
      const question = bank[Number(identityRecord.sourceOrdinal) - 1];
      const sidecar = metadataByUid.get(identityRecord.questionUid);
      const classified = classificationByUid.get(identityRecord.questionUid);
      assert.ok(sidecar, `metadata missing: ${identityRecord.questionUid}`);
      assert.ok(classified, `classification missing: ${identityRecord.questionUid}`);
      if (String(question.subUnitKey || '').trim()) {
        assert.equal(sidecar.subUnitKey, question.subUnitKey, `sidecar key overwrote production: ${sourceArchiveFile}#${identityRecord.sourceOrdinal}`);
        assert.equal(sidecar.subUnit, question.subUnit, `sidecar label overwrote production: ${sourceArchiveFile}#${identityRecord.sourceOrdinal}`);
        assert.equal(classified.classification.subUnitKey, question.subUnitKey, `classification drift: ${sourceArchiveFile}#${identityRecord.sourceOrdinal}`);
      }
    }
  }
});

test('runtime merge keeps production fields and records conflicts instead of overwriting', async () => {
  const identity = readJson('archive/data/question_identity_map.json');
  const metadata = readJson('archive/data/question_metadata.json');
  const target = identity.records.find(record => record.sourceArchiveFile.includes('original/high/h1/2mid/21_금당고_2학기_중간_고1_기출.js') && record.sourceOrdinal === 17);
  assert.ok(target);
  const runtime = fs.readFileSync(path.join(archiveRoot, 'question-meta.js'), 'utf8');
  const context = {
    window: {},
    document: { baseURI: 'https://archive.local/mixer.html' },
    console,
    URL,
    fetch: async () => ({ ok: true, json: async () => metadata })
  };
  vm.runInNewContext(runtime, context, { filename: 'archive/question-meta.js' });
  await context.window.__ARCHIVE_METADATA_READY__;
  const merged = context.window.mergeArchiveQuestionMetadata(
    { subUnitKey: 'H15-SB-03-COMPOSITE_FUNCTION', subUnit: '합성함수' },
    { questionUid: target.questionUid }
  );
  assert.equal(merged.subUnitKey, 'H15-SB-03-COMPOSITE_FUNCTION');
  assert.equal(merged.subUnit, '합성함수');
  assert.equal(merged._archiveMetadataMergeStatus, undefined);

  const conflict = context.window.mergeArchiveQuestionMetadata(
    { subUnitKey: 'STALE-KEY', subUnit: 'stale' },
    { questionUid: target.questionUid }
  );
  assert.equal(conflict.subUnitKey, 'STALE-KEY');
  assert.equal(conflict._archiveMetadataMergeStatus, 'SOURCE_CONFLICT_HOLD');
  assert.equal(conflict._archiveMetadataConflicts.subUnitKey.metadata, 'H15-SB-03-COMPOSITE_FUNCTION');
});

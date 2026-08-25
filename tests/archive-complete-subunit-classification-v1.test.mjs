import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'complete-subunit-classification');
const classification = JSON.parse(fs.readFileSync(path.join(outputDir, 'archive-complete-subunit-classification-v1.json'), 'utf8'));

assert.equal(classification.schemaVersion, 'archive-complete-subunit-classification-v1');
assert.equal(classification.totals.records, 10690);
assert.equal(classification.totals.emptySubUnitKeys, 0);
assert.equal(classification.totals.taxonomyKeyGaps, 0);
assert.equal(classification.totals.identityUnique, true);
assert.equal(classification.totals.classificationDepth.complete_default || 0, 0);
assert.equal(classification.totals.confidence.standard_unit_default || 0, 0);
assert.ok(classification.records.every(record => record.classification.subUnitKey && record.classification.subUnit));
assert.equal(new Set(classification.records.map(record => record.questionUid)).size, 10690);
assert.equal(classification.gates.allRecordsHaveSubUnitKey, true);
assert.equal(classification.gates.allSubUnitKeysInTaxonomy, true);
assert.equal(classification.gates.sourceQuestionJoinComplete, true);

const grouped = new Map();
for (const record of classification.records) {
  if (!grouped.has(record.sourceArchiveFile)) grouped.set(record.sourceArchiveFile, []);
  grouped.get(record.sourceArchiveFile).push(record);
}
let productionQuestions = 0;
for (const [sourceArchiveFile, records] of grouped) {
  const absolute = path.join(root, 'archive', 'exams', sourceArchiveFile);
  const source = fs.readFileSync(absolute, 'utf8');
  const context = { window: {}, console };
  vm.runInNewContext(source, context, { timeout: 3000, filename: sourceArchiveFile });
  const questions = context.window.questionBank;
  assert.ok(Array.isArray(questions), `questionBank missing: ${sourceArchiveFile}`);
  assert.equal(questions.length, records.length, `question count mismatch: ${sourceArchiveFile}`);
  questions.forEach((question, index) => {
    const expected = records[index].classification;
    // The complete classification is a read-only policy snapshot.  Only
    // values already present in production JS are expected to match the
    // snapshot; inferred values remain explicit in the generated artifact.
    if (question.subUnitKey) {
      assert.equal(question.subUnitKey, expected.subUnitKey, `subUnitKey mismatch: ${sourceArchiveFile}#${index + 1}`);
      assert.equal(question.subUnit, expected.subUnit, `subUnit mismatch: ${sourceArchiveFile}#${index + 1}`);
      assert.equal(question.subUnitConfidence, expected.confidence, `confidence mismatch: ${sourceArchiveFile}#${index + 1}`);
      assert.equal(question.subUnitClassificationDepth, expected.classificationDepth, `depth mismatch: ${sourceArchiveFile}#${index + 1}`);
    }
  });
  productionQuestions += questions.length;
}
assert.equal(productionQuestions, 10690);

console.log(JSON.stringify({ ok: true, classificationDigest: classification.digest, productionQuestions }, null, 2));

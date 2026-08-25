import assert from 'node:assert/strict';
import { classifyArchiveHierarchicalV1 } from '../archive/tools/intelligence/classify-archive-hierarchical-v1.mjs';

const report = classifyArchiveHierarchicalV1();

assert.equal(report.schemaVersion, 'archive-hierarchical-classification-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.scannedFiles, 432);
assert.equal(report.totals.scannedQuestions, 10552);
assert.equal(report.totals.classifiedRecords, 10498);
assert.equal(report.totals.excludedRecords, 54);
assert.equal(report.totals.identityFailures, 0);
assert.equal(report.totals.recommendationEligible, 32);
assert.deepEqual(report.totals.classificationDepth, {
    documented_template: 32,
    single_documented_subunit: 286,
    standard_unit_only: 9700,
    unmapped_standard_unit: 480
});
assert.equal(new Set(report.records.map(item => item.questionUid)).size, 10498);
assert.equal(report.records.every(item => item.classification.recommendationEligible ? item.classification.evidence.agreedRuleIds.length === 1 : true), true);
assert.equal(report.digest, '899dc2017e29b637db6375490de172a13316f1bc787f6a9fee46a1a72e80343b');

console.log(JSON.stringify({ digest: report.digest, classified: report.totals.classifiedRecords, excluded: report.totals.excludedRecords, status: 'PASS' }, null, 2));

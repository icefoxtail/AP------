import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildMetadataInventory } from '../archive/tools/intelligence/build-metadata-inventory.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase1', 'metadata-inventory-latest.json');
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const rerun = buildMetadataInventory();

assert.equal(report.schemaVersion, 'phase1-metadata-inventory-v1');
assert.equal(report.totals.files, 432);
assert.equal(report.totals.questions, 10552);
assert.equal(report.totals.expectedQuestions, 10552);
assert.equal(report.totals.loadFailures, 0);
assert.equal(report.totals.identityJoinFailures, 0);
assert.equal(report.digest, rerun.digest, 'metadata inventory digest must be deterministic');
assert.equal(new Set(report.records.map(record => record.questionUid)).size, report.records.length);
assert.deepEqual(report.counts.standardKeyClass, { empty: 13, invalid: 250, official: 10072, raw: 217 });
assert.equal(report.fieldPresence.problemTypeKey.present, 0);
assert.equal(report.fieldPresence.templateKey.present, 0);
assert.equal(report.fieldPresence.subUnitKey.present, 623);
assert.equal(report.counts.metadataStatus.partial, 10072);
assert.equal(report.counts.metadataStatus.invalid_standard_unit, 250);
assert.equal(report.counts.metadataStatus.raw_standard_unit, 217);
assert.equal(report.counts.metadataStatus.missing_standard_unit, 13);

console.log(JSON.stringify({
    digest: report.digest,
    files: report.totals.files,
    questions: report.totals.questions,
    status: 'PASS'
}, null, 2));

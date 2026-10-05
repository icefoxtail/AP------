import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { buildSubunitPilotValidationV1 } from '../archive/tools/intelligence/build-subunit-pilot-validation-v1.mjs';

test('pilot validation covers all proposed keys without approving production tags', () => {
  const report = buildSubunitPilotValidationV1();
  assert.equal(report.productionWriteAllowed, false);
  assert.equal(report.totals.proposedKeys, 32);
  assert.equal(report.totals.approvedCandidates + report.totals.reviewRequired, 32);
  assert.ok(report.totals.samples > 0);
  assert.ok(report.entries.every(entry => entry.productionUsable === false));
  const saved = JSON.parse(fs.readFileSync('archive/_generated/intelligence/phase3/subunit-pilot-validation/archive-subunit-pilot-validation-v1.json', 'utf8'));
  assert.equal(saved.digest, report.digest);
});

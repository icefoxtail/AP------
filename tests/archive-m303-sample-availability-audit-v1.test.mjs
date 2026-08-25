import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const reportPath = 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-m303-sample-availability-audit-v1.json';

test('M3-03 availability audit proves no remaining candidates meet the gate', () => {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    assert.equal(report.schemaVersion, 'archive-m303-sample-availability-audit-v1');
    assert.equal(report.productionWriteAllowed, false);
    assert.equal(report.totals.availableStrongByKey['M3-03-QUADRATIC_EQUATION'], 0);
    assert.equal(report.totals.availableMixedBoundary, 0);
    assert.equal(report.totals.canReachStrongMinimum, false);
    assert.equal(report.totals.canReachMixedBoundaryMinimum, false);
    assert.equal(report.disposition, 'STANDARD_UNIT_FALLBACK_LOCKED_NO_ADDITIONAL_SAMPLE_CAN_SATISFY_GATE');
});

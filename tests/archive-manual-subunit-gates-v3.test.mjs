import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const reportPath = 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-manual-subunit-gates-v3.json';

test('two-pass gate requires final signoff and keeps M3-03 fail-closed', () => {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    assert.equal(report.schemaVersion, 'archive-manual-subunit-gates-v3');
    assert.equal(report.productionWriteAllowed, false);
    assert.equal(report.totals.twoPassMatchedPairs, 1);
    assert.equal(report.totals.manualReviewCandidatePairs, 2);
    assert.equal(report.totals.failedClosed, 1);
    const m204 = report.pairs.find(pair => pair.standardUnitKey === 'M2-04');
    assert.equal(m204.status, 'TWO_PASS_MATCHED_FINAL_SIGNOFF_REQUIRED');
    const m303 = report.pairs.find(pair => pair.standardUnitKey === 'M3-03');
    assert.equal(m303.status, 'FAIL_CLOSED_MANUAL_COVERAGE_OR_UNRESOLVED');
    for (const pair of report.pairs) assert.equal(pair.productionUsable, false);
});

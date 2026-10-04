import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const reportPath = 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-manual-subunit-gates-v1.json';

test('manual gate keeps production locked and identifies only coverage-ready candidates', () => {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    assert.equal(report.schemaVersion, 'archive-manual-subunit-gates-v1');
    assert.equal(report.productionWriteAllowed, false);
    assert.equal(report.totals.pairs, 3);
    assert.equal(report.totals.manualReviewCandidatePairs, 1);
    assert.equal(report.totals.failedClosed, 2);
    assert.equal(report.totals.unresolved, 0);
    const m204 = report.pairs.find(pair => pair.standardUnitKey === 'M2-04');
    assert.equal(m204.status, 'MANUAL_REVIEW_CANDIDATE_SECOND_REVIEW_REQUIRED');
    assert.equal(m204.coverageReady, true);
    assert.equal(m204.reviewComplete, true);
    for (const pair of report.pairs) assert.equal(pair.productionUsable, false);
});

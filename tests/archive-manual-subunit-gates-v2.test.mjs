import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const reportPath = 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-manual-subunit-gates-v2.json';

test('supplemental manual gate promotes only coverage-ready nonproduction candidates', () => {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    assert.equal(report.schemaVersion, 'archive-manual-subunit-gates-v2');
    assert.equal(report.productionWriteAllowed, false);
    assert.equal(report.totals.pairs, 3);
    assert.equal(report.totals.manualReviewCandidatePairs, 2);
    assert.equal(report.totals.failedClosed, 1);
    assert.equal(report.totals.unresolved, 0);
    const m205 = report.pairs.find(pair => pair.standardUnitKey === 'M2-05');
    assert.equal(m205.effectiveBoundaryCount, 20);
    assert.equal(m205.status, 'MANUAL_REVIEW_CANDIDATE_SECOND_REVIEW_REQUIRED');
    const m303 = report.pairs.find(pair => pair.standardUnitKey === 'M3-03');
    assert.equal(m303.effectiveBoundaryCount, 14);
    assert.equal(m303.status, 'FAIL_CLOSED_MANUAL_COVERAGE_OR_UNRESOLVED');
    for (const pair of report.pairs) assert.equal(pair.productionUsable, false);
});

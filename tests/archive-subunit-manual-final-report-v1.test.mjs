import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const reportPath = 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-subunit-manual-final-report-v1.json';

test('final report is nonproduction and includes all final dispositions', () => {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    assert.equal(report.schemaVersion, 'archive-subunit-manual-final-report-v1');
    assert.equal(report.productionWriteAllowed, false);
    assert.equal(report.sourceMasterDbIndexWrites, false);
    assert.equal(report.totals.uniqueSourceQuestionsManuallyReviewed, 84);
    assert.equal(report.totals.manualReviewInstances, 89);
    assert.equal(report.totals.twoPassMatchedPairs, 2);
    assert.equal(report.totals.fallbackLockedPairs, 1);
    assert.equal(report.totals.productionUsable, 0);
    assert.equal(report.verification.allPassed, true);
});

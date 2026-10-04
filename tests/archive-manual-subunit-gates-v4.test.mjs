import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const reportPath = 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-manual-subunit-gates-v4.json';

test('final manual gate records two-pass matches and M3-03 fallback lock', () => {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    assert.equal(report.schemaVersion, 'archive-manual-subunit-gates-v4');
    assert.equal(report.productionWriteAllowed, false);
    assert.equal(report.totals.twoPassMatchedFinalSignoffRequired, 2);
    assert.equal(report.totals.failedClosed, 1);
    assert.equal(report.totals.unresolved, 0);
    assert.equal(report.totals.productionUsable, 0);
    const m303 = report.pairs.find(pair => pair.standardUnitKey === 'M3-03');
    assert.equal(m303.finalReviewStatus, 'FAIL_CLOSED_NO_SAMPLE_AVAILABILITY_STANDARD_FALLBACK');
});

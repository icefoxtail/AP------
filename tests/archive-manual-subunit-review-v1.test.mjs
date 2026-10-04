import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const reportPath = 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-manual-subunit-review-v1.json';

test('manual subunit review covers every queued sample without production writes', () => {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    assert.equal(report.schemaVersion, 'archive-manual-subunit-review-v1');
    assert.equal(report.status, 'MANUAL_REVIEW_COMPLETE_NONPRODUCTION');
    assert.equal(report.productionWriteAllowed, false);
    assert.equal(report.totals.entries, 59);
    assert.equal(report.totals.manualConfirmed, 59);
    assert.equal(report.totals.unresolved, 0);
    assert.equal(report.entries.length, report.totals.entries);
    for (const entry of report.entries) {
        assert.equal(entry.manualDecision, 'MANUAL_CONFIRMED');
        assert.equal(entry.sourceContentSolutionReviewed, true);
        assert.equal(entry.productionUsable, false);
        assert.ok(entry.subUnitKeys.includes(entry.manualLabel));
    }
});

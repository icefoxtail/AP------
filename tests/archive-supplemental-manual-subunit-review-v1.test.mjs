import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const reportPath = 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-supplemental-manual-subunit-review-v1.json';

test('supplemental manual review records source-backed decisions and preserves fallback', () => {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    assert.equal(report.schemaVersion, 'archive-supplemental-manual-subunit-review-v1');
    assert.equal(report.productionWriteAllowed, false);
    assert.equal(report.totals.entries, 30);
    assert.equal(report.totals.manualConfirmed, 29);
    assert.equal(report.totals.standardFallback, 1);
    assert.equal(report.totals.unresolved, 0);
    for (const entry of report.entries) {
        assert.equal(entry.sourceContentSolutionReviewed, true);
        assert.equal(entry.productionUsable, false);
        if (entry.manualLabel) assert.ok(entry.subUnitKeys.includes(entry.manualLabel));
    }
});

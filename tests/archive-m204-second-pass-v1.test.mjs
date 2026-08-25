import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const reportPath = 'archive/_generated/intelligence/phase3/manual-subunit-review/archive-m204-second-pass-v1.json';

test('M2-04 second pass matches the first pass without production writes', () => {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    assert.equal(report.schemaVersion, 'archive-m204-second-pass-v1');
    assert.equal(report.productionWriteAllowed, false);
    assert.equal(report.totals.entries, 30);
    assert.equal(report.totals.agreements, 30);
    assert.equal(report.totals.disagreements, 0);
    assert.equal(report.status, 'SECOND_PASS_MATCHED_NONPRODUCTION');
});

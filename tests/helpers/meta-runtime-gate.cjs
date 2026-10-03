const assert = require('node:assert/strict');
const core = require('../../archive/archive2-core.js');

// Exercise the current canonical projection rather than fabricating approval by
// merging old overlays into the pre-canonical catalog.
function assertCanonicalRuntimeGate(overlay, catalog) {
  const record = catalog.records.find(row => row.questionUid === overlay.questionUid);
  assert.ok(record, `canonical runtime join missing: ${overlay.questionUid}`);
  const gate = core.eligibility(record, { canonicalAuthority: catalog.canonicalAuthority });
  const assignment = core.Canonical.validateBasicAssignment(record, catalog.canonicalAuthority);
  if (!assignment.ok) {
    assert.equal(gate.ok, false, 'unapproved runtime metadata must never release');
    assert.ok(gate.reasons.includes('taxonomy'));
    for (const reason of assignment.reasons) assert.ok(gate.reasons.includes(reason), reason);
  }
  if (gate.ok) {
    assert.equal(record.identityStatus, 'VERIFIED');
    assert.equal(record.sourceIntegrityStatus, 'VERIFIED');
    assert.equal(record.sourceStatus, 'VERIFIED');
    assert.equal(assignment.ok, true);
  }
  assert.equal(core.eligibility(record).ok, false, 'missing authority must fail closed');
  return gate;
}
const fs = require('node:fs');
const path = require('node:path');
const runtimePacks = core.Canonical.RUNTIME_INPUT_PATHS.map(file =>
  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../archive', file), 'utf8')));
const runtimeRecords = runtimePacks.flatMap(pack => pack.records);
assert.equal(new Set(runtimeRecords.map(row => row.questionUid)).size, runtimeRecords.length);
assert.equal(new Set(runtimeRecords.map(row => `${row.sourceArchiveFile}#${row.sourceOrdinal}`)).size, runtimeRecords.length);
module.exports = { assertCanonicalRuntimeGate, runtimeRecordCount: runtimeRecords.length };

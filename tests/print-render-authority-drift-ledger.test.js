const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const ledger = JSON.parse(fs.readFileSync(path.join(root, 'reports', 'print-render-authority-v2.2', 'phase-0.6-known-drift-ledger.json'), 'utf8'));
const fixtures = JSON.parse(fs.readFileSync(path.join(root, 'tests', 'fixtures', 'print-render-authority-v2.2-fixtures.json'), 'utf8'));
const allowedDispositions = new Set([
  'PRESERVE_DIFFERENCE',
  'CANONICALIZE_TO_ARCHIVE',
  'CANONICALIZE_TO_MIXED',
  'CANONICALIZE_TO_CLINIC',
  'CANONICALIZE_TO_NEW_CONTRACT'
]);
const requiredDrifts = [
  'DRIFT_CHOICE_COLUMNS_001',
  'DRIFT_MIXER_QPP_002',
  'DRIFT_CLINIC_REVIEW_003',
  'DRIFT_PREVIEW_SOURCE_004',
  'DRIFT_PRINT_TRANSPORT_005',
  'DRIFT_MIXER_SOURCE_PERSISTENCE_006',
  'DRIFT_HEADER_FIELD_BEHAVIOR_007',
  'DRIFT_ANSWER_ALIAS_008',
  'DRIFT_SOLUTION_ALIAS_009',
  'DRIFT_PROBLEM_IMAGE_RESOLVER_010',
  'DRIFT_SOLUTION_IMAGE_RESOLVER_011',
  'DRIFT_MATHJAX_READINESS_012',
  'DRIFT_PAGE_SPLIT_013',
  'DRIFT_SOLUTION_CONTINUATION_014',
  'DRIFT_DUPLEX_BLANK_015',
  'DRIFT_SOURCE_RESTORE_FAILURE_016',
  'DRIFT_VIEW_LABEL_SEMANTICS_017',
  'DRIFT_SOURCE_IDENTITY_018'
];

function source(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

test('Phase 0.6 has zero unadjudicated known drifts and every decision has the required evidence fields', () => {
  assert.equal(ledger.planVersion, 'v2.2');
  assert.equal(ledger.phase, 'PHASE_0_6');
  assert.equal(ledger.status, 'PASS');
  assert.equal(ledger.unadjudicatedDriftCount, 0);
  assert.deepEqual(ledger.drifts.map(drift => drift.driftId), requiredDrifts);

  const fixtureIds = new Set([...fixtures.fixtures, ...fixtures.supplementalFixtureIds]);
  assert.equal(fixtures.fixtures.length, 44, 'Golden Fixture v2.2 must specify all 44 required fixture IDs');
  for (const drift of ledger.drifts) {
    for (const field of ['driftId', 'archiveBehavior', 'mixerBehavior', 'clinicBehavior', 'disposition', 'rationale', 'fixtureId']) {
      assert.match(String(drift[field] || ''), /\S/, `${drift.driftId} is missing ${field}`);
    }
    assert.ok(allowedDispositions.has(drift.disposition), `${drift.driftId} has an invalid disposition`);
    assert.equal(typeof drift.migrationRequired, 'boolean', `${drift.driftId} must declare migrationRequired`);
    assert.ok(fixtureIds.has(drift.fixtureId), `${drift.driftId} references an unknown fixture`);
    for (const fixtureId of drift.relatedFixtureIds || []) assert.ok(fixtureIds.has(fixtureId), `${drift.driftId} references unknown related fixture ${fixtureId}`);
    assert.ok(Array.isArray(drift.sourceEvidence) && drift.sourceEvidence.length > 0, `${drift.driftId} requires production evidence`);
  }
  assert.equal(ledger.drifts.filter(drift => drift.disposition === 'UNADJUDICATED').length, 0);
});

test('The ledger records current production differences rather than a desired-but-unverified common implementation', () => {
  const byId = new Map(ledger.drifts.map(drift => [drift.driftId, drift]));
  assert.equal(byId.get('DRIFT_MIXER_QPP_002').disposition, 'PRESERVE_DIFFERENCE');
  assert.equal(byId.get('DRIFT_MIXER_QPP_002').migrationRequired, false);
  assert.equal(byId.get('DRIFT_PRINT_TRANSPORT_005').disposition, 'PRESERVE_DIFFERENCE');
  assert.equal(byId.get('DRIFT_MIXER_SOURCE_PERSISTENCE_006').migrationRequired, false);

  const archive = source('archive/engine.html');
  const mixed = source('archive/mixed_engine.html');
  const clinic = source('apmath/wrong_print_engine.html');
  assert.match(archive, /Number\.parseInt\(q\.choiceColumns, 10\)/);
  assert.doesNotMatch(mixed, /choiceColumns/);
  assert.match(clinic, /function getQuestionAnswer\(q\)/);
  assert.match(clinic, /state\.mode === 'review'/);
  assert.match(clinic, /AP_CLINIC_PREVIEW/);
  assert.match(clinic, /appendBlankPage\(area\)/);
  assert.match(clinic, /문항 복원 실패/);
  assert.match(mixed, /return \[4, 6, 8\]\.includes\(parsed\) \? parsed : 4;/);
  assert.match(source('archive/mixer.html'), /<option value="2">2문항\/P<\/option>/);
});

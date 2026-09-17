import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { objectDigest } from '../archive/tools/intelligence/metadata-foundation-gates.mjs';
import { buildPilotClassifierInput } from '../archive/tools/intelligence/run-metadata-foundation-h1-pilot.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'archive/_generated/intelligence/phase3/metadata-foundation-h1-pilot');
const read = name => JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));

test('GATE 3 A pilot artifacts are source-first, corrected, and fail closed', () => {
  const source = read('source_pack.json');
  const decisions = read('a_decision_pack.json');
  const machine = read('machine_validation.json');
  const report = read('pilot_report.json');
  const bPacket = read('b_independent_decision_pack.json');
  const corrections = read('a_source_read_corrections.json');
  const corrected = new Set(Array.from({ length: 25 }, (_, index) => index + 1));
  assert.equal(source.sourceOnly, true);
  assert.ok(source.records.every(record => record.content && Array.isArray(record.choices) && typeof record.solution === 'string'));
  assert.ok(source.records.every(record => record.decisionStatus === undefined && record.primaryConcept === undefined));
  assert.equal(machine.sourcePackSha256, objectDigest(source));
  assert.equal(machine.bIndependentDecisionPackSha256, objectDigest(bPacket));
  assert.deepEqual(report.targetDenominator.missingIdentityKeys, [
    'original/high/h1/2mid/20_매산고_2학기_중간_고1_기출.js#1',
    'original/high/h1/2mid/20_매산고_2학기_중간_고1_기출.js#14',
    'original/high/h1/2mid/20_매산고_2학기_중간_고1_기출.js#19',
    'original/high/h1/2mid/20_매산고_2학기_중간_고1_기출.js#2'
  ]);
  assert.equal(report.targetDenominator.rawRecords, 626);
  assert.equal(report.targetDenominator.uniqueSourceRecords, 622);
  assert.equal(decisions.records.length, 25);
  assert.equal(corrections.records.length, 25);
  for (const index of corrected) {
    const row = decisions.records.find(record => record.pilotIndex === index);
    assert.ok(row, `corrected pilot index ${index} is present`);
    assert.equal(row.decisionStatus, 'HOLD');
    assert.equal(row.canonicalSelection.validation.ok, true);
    assert.ok(row.primaryConcept.reason);
    assert.ok(row.decisiveSolutionStep);
    assert.ok(row.difficulty.evidence);
    assert.ok(Array.isArray(row.rejectedAlternatives));
    assert.ok(row.evidence.holdEvidence.ok);
  }
  assert.ok(decisions.records.every(record => record.decisionStatus !== 'RECHECK_PASS' && record.decisionStatus !== 'ACCEPTED_FOR_METADATA_APPLY'));
  assert.equal(machine.checks.builderFingerprintFailures, 0);
  assert.equal(machine.checks.sourceOnlyDecisionRecords, 25);
  assert.equal(machine.checks.noCandidateContextFallback, true);
  assert.equal(machine.checks.noAcceptedEmptySubunit, true);
  assert.equal(machine.checks.holdsHaveCurrentEvidence, true);
  assert.equal(machine.checks.imageReferencesPresentOrAbsent, true);
  assert.ok(report.canonicalGapProbes.some(probe => probe.name === 'coordinate_centroid'));
  assert.ok(!report.canonicalGapProbes.some(probe => probe.name === 'coordinate_triangle_area'));
  const q7 = decisions.records.find(record => record.pilotIndex === 1);
  assert.equal(q7.canonicalDependencies[0].curriculumApplicability, 'RPM_EXTENDED_CANDIDATE');
  assert.equal(q7.canonicalDependencies[0].defaultSelectable, false);
  assert.equal(q7.canonicalDependencies[0].validation.ok, true);
  assert.equal(report.globalArtifactStatus, 'STALE_DEFERRED_GATE_3_H1_SCOPED_REGENERATION_PREREQUISITE');
});

test('pilot classifier input is source-only and cannot fall back to candidate context', () => {
  const source = read('source_pack.json');
  const runner = fs.readFileSync(path.join(root, 'archive/tools/intelligence/run-metadata-foundation-h1-pilot.mjs'), 'utf8');
  for (const record of source.records) {
    const input = buildPilotClassifierInput(record);
    assert.deepEqual(Object.keys(input).sort(), ['answer', 'choices', 'content', 'solution', ...(record.imageReference ? ['image'] : [])].sort());
    assert.equal(input.level, undefined);
    assert.equal(input.standardUnitKey, undefined);
    assert.equal(input.subUnitKey, undefined);
    assert.equal(input.L1, undefined);
    assert.equal(input.L2, undefined);
    assert.equal(input.L3, undefined);
    assert.equal(input.L4, undefined);
  }
  assert.doesNotMatch(runner, /sourceItem\.canonicalCandidateContext\[0\]/);
  assert.doesNotMatch(runner, /sourceItem\.queueCandidateContext\s*\|\|/);
  assert.doesNotMatch(runner, /classifierQuestion\s*=\s*\{\s*\.\.\.question\s*,\s*\.\.\.sourceItem\.legacySourceMetadata/);
});

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { contentFingerprint, machineValidationDigest, objectDigest, sourceFingerprint, validateDecisiveSolutionEvidence, verifyMachineValidationDigest } from '../archive/tools/intelligence/metadata-foundation-gates.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'archive/_generated/intelligence/phase3/metadata-foundation-h1-full-rebuild');
const read = name => JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));

test('GATE 4 A H1 full rebuild is complete, source-only, sealed, and non-promoting', () => {
  const source = read('source_pack.json');
  const reconciliation = read('source_identity_reconciliation.json');
  const summary = read('full_rebuild_summary.json');
  const batchDirs = fs.readdirSync(dir).filter(name => /^batch-\d{3}$/.test(name)).sort();
  assert.equal(source.sourceOnly, true);
  assert.equal(source.records.length, 626);
  assert.equal(summary.total, 626);
  assert.equal(summary.checked, 626);
  assert.equal(summary.batchCount, 38);
  assert.equal(batchDirs.length, 38);
  assert.equal(summary.identity.uniqueIdentityBound, 626);
  assert.deepEqual(summary.identity.originalMissingIdentityKeys, [
    'original/high/h1/2mid/20_매산고_2학기_중간_고1_기출.js#1',
    'original/high/h1/2mid/20_매산고_2학기_중간_고1_기출.js#14',
    'original/high/h1/2mid/20_매산고_2학기_중간_고1_기출.js#19',
    'original/high/h1/2mid/20_매산고_2학기_중간_고1_기출.js#2'
  ]);
  assert.deepEqual(summary.identity.missingIdentityKeysAfterScopedRepair, []);
  assert.equal(summary.identity.gate.ok, false);
  assert.deepEqual(summary.identity.gate.missingIdentityKeys, []);
  assert.equal(summary.identity.gate.unresolvedFingerprintConflicts, 8);
  assert.equal(reconciliation.uniqueIdentityBoundRecords, 626);
  assert.equal(reconciliation.repairedRecords.length, 4);
  assert.equal(reconciliation.fingerprintMismatches.length, 8);
  assert.equal(summary.allDecisionsFailClosed, true);
  assert.equal(summary.allNoPromotion, true);
  assert.equal(summary.totals.AMBIGUOUS_PRIMARY, 366);
  assert.equal(summary.totals.EVIDENCE_INSUFFICIENT, 9);
  assert.equal(summary.totals.FOUNDATION_DEFECT_CANDIDATE, 93);
  assert.equal(summary.totals.CONFLICT, 8);
  assert.equal(summary.productionMutation.fullRebuild, false);
  assert.equal(summary.productionMutation.sourceJs, false);
  assert.equal(summary.productionMutation.database, false);
  assert.equal(summary.productionMutation.questionIndex, false);
  assert.equal(summary.aStatus, 'A_READY_FOR_REVIEW');
  assert.equal(summary.evidence.stagingEvidencePass, true);
  let total = 0;
  for (const batchId of batchDirs) {
    const seal = read(`${batchId}/batch_seal.json`);
    const blind = read(`${batchId}/blind_decision_pack.json`);
    const machine = read(`${batchId}/machine_validation.json`);
    assert.equal(seal.status, 'SEALED_FOR_B_REVIEW');
    assert.equal(seal.productionWriteAllowed, false);
    assert.equal(verifyMachineValidationDigest(machine, seal.machineValidationDigest).ok, true);
    assert.equal(seal.machineValidationDigest, machineValidationDigest(machine));
    assert.ok(Array.isArray(machine.imageChecks));
    assert.equal(blind.priorReviewVisibility, 'NONE');
    assert.equal(blind.productionWriteAllowed, false);
    assert.ok(blind.records.every(record => record.decisionStatus === 'HOLD'));
    assert.ok(blind.records.every(record => record.difficultyEvidence && record.holdEvidence && record.holdEvidenceValidation.ok));
    assert.ok(blind.records.every(record => record.decisionStatus !== 'RECHECK_PASS' && record.decisionStatus !== 'ACCEPTED_FOR_METADATA_APPLY'));
    assert.equal(machine.checks.rawCount, blind.records.length);
    assert.equal(machine.checks.holdEvidencePass, true);
    assert.equal(machine.checks.noBareBooleanAcceptance, true);
    assert.equal(machine.checks.evidenceCompletenessPass, true);
    assert.equal(machine.checks.ambiguityRoutingPass, true);
    assert.equal(machine.checks.lexicalNoFitHoldPass, true);
    assert.equal(machine.checks.foundationEvidencePass, true);
    assert.equal(machine.checks.taxonomyReasonPass, true);
    assert.equal(machine.checks.difficultyReasonPass, true);
    assert.equal(machine.checks.decisiveSolutionStepPlaceholderCount, 0);
    total += blind.records.length;
  }
  assert.equal(total, 626);
  assert.equal(summary.totals.decisiveSolutionStepPlaceholderCount, 0);
  assert.equal(summary.evidence.sourceEvidenceMissingCount, 0);
  assert.equal(objectDigest(read('source_pack.json')), source.records ? objectDigest(source) : null);
  assert.equal(reconciliation.rawDenominator, 626);
});

test('every persisted H1 blind record has a source-bound proof object and substantive reasons', () => {
  const records = [];
  for (const name of fs.readdirSync(dir).filter(value => /^batch-\d{3}$/u.test(value)).sort()) {
    records.push(...read(`${name}/blind_decision_pack.json`).records);
  }
  assert.equal(records.length, 626);
  for (const record of records) {
    assert.equal(record.decisionStatus, 'HOLD');
    assert.equal(record.productionWriteAllowed, false);
    assert.equal(validateDecisiveSolutionEvidence({
      decisiveSolutionStep: record.decisiveSolutionStep,
      usedEvidence: record.usedEvidence,
      mathematicalObjects: record.mathematicalObjects,
      mathematicalAction: record.mathematicalAction,
      resultingConditionOrConclusion: record.resultingConditionOrConclusion,
      sourceIdentity: record.sourceIdentity,
      sourceEvidenceHash: record.sourceEvidenceHash
    }).ok, true, `${record.sourceArchiveFile}#${record.sourceOrdinal}`);
    assert.equal(typeof record.taxonomyReason, 'string');
    assert.equal(typeof record.difficultyReason, 'string');
    assert.equal(record.taxonomyReasonValidation.ok, true);
    assert.equal(record.difficultyReasonValidation.ok, true);
  }
});

test('actual H1 runner routes ties and lexical no-fit from current source/canonical evidence', () => {
  execFileSync(process.execPath, ['archive/tools/intelligence/run-metadata-foundation-h1-full-rebuild.mjs'], { cwd: root, stdio: 'pipe' });
  const summary = read('full_rebuild_summary.json');
  const records = [];
  for (const name of fs.readdirSync(dir).filter(value => /^batch-\d{3}$/.test(value)).sort()) {
    records.push(...read(`${name}/blind_decision_pack.json`).records);
  }
  assert.equal(records.length, summary.total);
  assert.equal(records.filter(record => record.classificationStatus === 'AMBIGUOUS_PRIMARY').length, summary.totals.AMBIGUOUS_PRIMARY);
  assert.equal(records.filter(record => record.foundationRoutingEvidence.tieState === 'TIED_TOP').every(record => ['AMBIGUOUS_PRIMARY', 'CONFLICT', 'HOLD_KEEP', 'EVIDENCE_INSUFFICIENT'].includes(record.classificationStatus) && record.foundationDefectCandidate === false), true);
  assert.equal(records.filter(record => record.foundationRoutingEvidence.tieState === 'NO_ELIGIBLE_CANDIDATE' && !record.foundationDefectCandidate).every(record => ['EVIDENCE_INSUFFICIENT', 'CONFLICT'].includes(record.classificationStatus)), true);
  assert.equal(records.filter(record => record.foundationDefectCandidate).every(record => record.foundationRoutingEvidence.sourceConcept.repeatedCoreTypes.length > 0 && record.foundationRoutingEvidence.decisiveEvidenceValidation.ok === true && record.foundationRoutingEvidence.canonicalSearch.searchedPathCount > 0 && record.foundationRoutingEvidence.whyNoFit && record.foundationRoutingEvidence.nextAction), true);
  assert.equal(records.every(record => record.decisionStatus === 'HOLD' && record.productionWriteAllowed === false), true);
});

test('full rebuild source pack is immutable against the live HIGH1 source payload and assets', () => {
  const source = read('source_pack.json');
  const grouped = new Map();
  for (const record of source.records) {
    if (!grouped.has(record.sourceArchiveFile)) grouped.set(record.sourceArchiveFile, []);
    grouped.get(record.sourceArchiveFile).push(record);
  }
  for (const [sourceArchiveFile, records] of grouped) {
    const sourcePath = path.join(root, 'archive/exams', sourceArchiveFile);
    const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(sourcePath, 'utf8'), context, { filename: sourcePath, timeout: 3000 });
    const questions = context.window.questionBank || context.window.questions;
    for (const record of records) {
      const question = questions[record.sourceOrdinal - 1];
      assert.equal(record.sourceFingerprint, sourceFingerprint(question), `${sourceArchiveFile}#${record.sourceOrdinal}`);
      assert.equal(record.contentFingerprint, contentFingerprint(question), `${sourceArchiveFile}#${record.sourceOrdinal}`);
      assert.deepEqual(JSON.parse(JSON.stringify(record.choices)), Array.isArray(question.choices) ? JSON.parse(JSON.stringify(question.choices)) : []);
      assert.equal(record.content, question.content ?? '');
      assert.equal(record.answer, question.answer ?? null);
      assert.equal(record.solution, question.solution ?? '');
      assert.equal(record.imageReference?.path ?? null, question.image ?? null);
      assert.equal(record.solutionImageReference?.path ?? null, question.solutionImage ?? null);
    }
  }
  const blindRecords = [];
  for (const name of fs.readdirSync(dir).filter(value => /^batch-\d{3}$/.test(value))) blindRecords.push(...read(`${name}/blind_decision_pack.json`).records);
  const sourceByKey = new Map(source.records.map(record => [`${record.sourceArchiveFile}#${record.sourceOrdinal}`, record]));
  assert.equal(blindRecords.every(record => {
    const sourceRecord = sourceByKey.get(`${record.sourceArchiveFile}#${record.sourceOrdinal}`);
    return validateDecisiveSolutionEvidence({
      decisiveSolutionStep: record.decisiveSolutionStep,
      usedEvidence: record.usedEvidence,
      mathematicalObjects: record.mathematicalObjects,
      mathematicalAction: record.mathematicalAction,
      resultingConditionOrConclusion: record.resultingConditionOrConclusion,
      sourceIdentity: record.sourceIdentity,
      sourceEvidenceHash: record.sourceEvidenceHash
    }, {
      questionUid: sourceRecord.questionUid,
      sourceArchiveFile: sourceRecord.sourceArchiveFile,
      sourceOrdinal: sourceRecord.sourceOrdinal,
      content: sourceRecord.content,
      choices: sourceRecord.choices,
      answer: sourceRecord.answer,
      solution: sourceRecord.solution,
      image: sourceRecord.imageReference?.path ?? null
    }).ok;
  }), true);
});

test('H1 routing is manifest-driven and contains no dataset-specific qN or expected-exception logic', () => {
  const runner = fs.readFileSync(path.join(root, 'archive/tools/intelligence/run-metadata-foundation-h1-full-rebuild.mjs'), 'utf8');
  const pilot = fs.readFileSync(path.join(root, 'archive/tools/intelligence/run-metadata-foundation-h1-pilot.mjs'), 'utf8');
  assert.doesNotMatch(runner, /expectedCount|COHORT_DENOMINATOR_MISMATCH|q7|626/);
  assert.doesNotMatch(pilot, /expectedCount|COHORT_DENOMINATOR_MISMATCH|q7|626/);
  assert.match(runner, /loadMetadataFoundationAuditManifest/);
  assert.match(pilot, /loadMetadataFoundationAuditManifest/);
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/metadata-foundation-h1-audit-manifest.json'), 'utf8'));
  assert.equal(manifest.scope, 'HIGH1_ONLY');
  assert.ok(manifest.representatives.length > 0);
});

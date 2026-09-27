import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { objectSha } from '../pipeline-core/canonical.mjs';
import { loadActiveMetaRegistry } from './active-registry.mjs';
import {
  buildDecisionIsolatedInput,
  makeDifficultyEvidence,
  questionUidForSource,
  resolveMetaRoute,
  validateResolverEvidence,
  validateRuntimeMetaParity,
} from './rpm-active-resolver.mjs';
import { M3_BASE_MAIN_SHA, M3_CROSSWALK_PATH, M3_EVIDENCE_DIR, ROOT, validateM3Sources } from './normalize-rpm-primary-m3.mjs';

const crosswalk = JSON.parse(fs.readFileSync(path.join(ROOT, M3_CROSSWALK_PATH), 'utf8'));
const ledger = JSON.parse(fs.readFileSync(path.join(ROOT, M3_EVIDENCE_DIR, 'semantic-audit-ledger.json'), 'utf8'));
const globalSnapshot = JSON.parse(fs.readFileSync(path.join(ROOT, M3_EVIDENCE_DIR, 'global-active-registry-snapshot.json'), 'utf8'));
const registry = loadActiveMetaRegistry(ROOT);

function routeInput(row, ordinal) {
  const sourceArchiveFile = 'original/middle/m3/m3-rpm-normalization-runtime-fixture.js';
  const sourceIdentityKey = `${objectSha({ sourceArchiveFile, rowId: row.id })}|${ordinal}`;
  const contentHash = objectSha({ fixture: 'm3-rpm-normalization', rowId: row.id });
  const choicesHash = objectSha([]);
  const imageRefHash = objectSha('');
  return {
    sourceIdentity: {
      sourceArchiveFile, questionUid: questionUidForSource(sourceArchiveFile, ordinal), sourceIdentityKey,
      sourceOrdinal: ordinal, contentHash, choicesHash, imageRefHash,
    },
    solutionIdentity: { status: 'VERIFIED_FINAL', independentVerification: true,
      solutionHash: objectSha({ solution: 'semantic RPM path route fixture', rowId: row.id }) },
    curriculumContext: {
      grade: 'M3', curriculum: row.curriculum, scope: row.scope, standardCourse: row.standardCourse,
      standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey || '',
    },
    semanticDecision: {
      primaryMethod: 'M3 RPM leaf route fixture using the stated curriculum concept.',
      decisiveStep: 'Resolve the exact M3 RPM semantic tuple, then validate the crosswalk disposition.',
      rpmPath: { curriculum: row.curriculum, scope: row.scope, ...row.rpmPath },
    },
  };
}

function assertRuntimeProjection(input, result, row) {
  const difficultyEvidence = makeDifficultyEvidence({
    status: 'PASS', blindPassStatus: 'FRESH_INDEPENDENT', sourceFingerprint: result.sourceFingerprint,
    solutionHash: result.semanticInputBundle.solutionIdentity.solutionHash, independentOfSemanticPass: true,
    difficultyBucket: 2, difficultyConfidence: 'medium', difficultyBoundaryFlag: 'NONE',
    legacyLevelCompatibility: 'NORMAL', rationale: 'Resolver projection fixture; no source item difficulty claim is made.',
    blindReviewerId: 'm3-rpm-normalization-regression',
    decisionSha: objectSha({ questionUid: input.sourceIdentity.questionUid, rowId: row.id }),
  });
  const candidateMeta = {
    standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey || '', standardCourse: row.standardCourse,
    problemTypeKey: result.problemTypeKey, templateKey: result.templateKey, crossConceptKeys: [], conditionKeys: [],
    integrationPattern: 'NONE', difficultyBucket: 2, difficultyConfidence: 'medium',
    difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL',
  };
  const runtimeRecord = {
    questionUid: input.sourceIdentity.questionUid, sourceFingerprint: result.sourceFingerprint,
    resolverEvidenceSha: result.evidenceSha, difficultyEvidenceSha: difficultyEvidence.evidenceSha,
    ...candidateMeta,
  };
  const parity = validateRuntimeMetaParity({ questionUid: input.sourceIdentity.questionUid,
    sourceFingerprint: result.sourceFingerprint, resolverEvidence: result, difficultyEvidence,
    candidateMeta, runtimeRecord });
  assert.equal(parity.status, 'PASS', JSON.stringify(parity.errors));
}

test('M3 master, four views, full crosswalk denominator, ACTIVE registry, and semantic ledger are in parity', () => {
  const validation = validateM3Sources();
  assert.equal(validation.status, 'PASS', JSON.stringify(validation.errors));
  assert.equal(validation.rpmRows, 181);
  assert.equal(validation.crosswalkRows, 181);
  assert.equal(validation.missingCrosswalkRows, 0);
  assert.equal(validation.orphanCrosswalkRows, 0);
  assert.equal(validation.duplicateSemanticTuples, 0);
  assert.equal(validation.viewParityErrors, 0);
  assert.equal(validation.activeStructuralErrors, 0);
  assert.equal(validation.exactBindingStatusMismatchErrors, 0);
  assert.equal(validation.incompleteFamilyCandidateSets, 0);
  assert.equal(validation.directSemanticRuleErrors, 0);
  assert.equal(registry.status, 'ACTIVE', JSON.stringify(registry.errors));
  // The audit snapshot is frozen to its semantic-review baseline. The current
  // main registry may advance; require the baseline snapshot to match its
  // ledger, then compare every mapped M3 PT/TPL definition against the current
  // compiled registry before accepting the drift.
  assert.equal(ledger.baseMainSha, M3_BASE_MAIN_SHA, 'semantic ledger remains frozen to its original baseline');
  assert.equal(globalSnapshot.registryFingerprint, ledger.globalActiveRegistryFingerprint);
  assert.equal(globalSnapshot.compiledRegistrySha, ledger.compiledRegistrySha);
  const auditById = new Map(ledger.records.map(row => [row.rpmRecordId, row]));
  const currentEvidenceDrift = [];
  for (const row of crosswalk.records.filter(item => item.mappingStatus !== 'RPM_ONLY')) {
    const auditRow = auditById.get(row.id);
    const canonical = auditRow?.canonicalEvidence;
    const pt = registry.problemTypes.get(row.problemTypeKey);
    const reviewedPt = canonical?.problemType;
    if (!pt || !reviewedPt || ['canonicalLabelKo', 'definition', 'status', 'ownerPack']
      .some(key => pt[key] !== reviewedPt[key])) currentEvidenceDrift.push({ rpmRecordId: row.id, kind: 'PT' });
    const templateKeys = row.templateKey ? [row.templateKey] : (row.templateCandidates || []).map(item => item.templateKey);
    for (const templateKey of templateKeys) {
      const template = registry.templates.get(templateKey);
      const reviewedTemplate = canonical?.templates?.find(item => item.templateKey === templateKey);
      if (!template || !reviewedTemplate || ['canonicalLabelKo', 'definition', 'internalSkeleton', 'status', 'parentProblemTypeKey', 'ownerPack']
        .some(key => template[key] !== reviewedTemplate[key])) currentEvidenceDrift.push({ rpmRecordId: row.id, kind: 'TPL', templateKey });
    }
  }
  assert.deepEqual(currentEvidenceDrift, [], 'current main preserves every mapped M3 PT/TPL definition from the reviewed ledger');
  assert.equal(globalSnapshot.activePacks.length, 10);
  assert.equal(globalSnapshot.problemTypeCount, 244);
  assert.equal(globalSnapshot.templateCount, 655);
  assert.equal(globalSnapshot.exactBindingCount, 722);
  assert.equal(ledger.rpm.totalRecords, 181);
  assert.deepEqual(ledger.rpm.semanticRelationCounts, {
    BOTH_PRESENT: 173, LEGIT_CURRICULUM_DIFFERENCE: 7, NEEDS_EVIDENCE: 1,
  });
  assert.equal(ledger.crosswalk.normalizationCounts.unresolved, 0);
});

test('every M3 crosswalk row resolves deterministically against compiled GLOBAL ACTIVE runtime', () => {
  const results = { EXISTING_REUSE: 0, FAMILY_REUSE: 0, RPM_PRIMARY_MIGRATION_GAP: 0 };
  const rowResults = [];
  for (const [index, row] of crosswalk.records.entries()) {
    const input = routeInput(row, index + 1);
    if (row.mappingStatus === 'FAMILY_ACTIVE') {
      const isolated = buildDecisionIsolatedInput(input);
      input.familyTemplateSelection = {
        stage: 'POST_CROSSWALK', inputBundleSha: isolated.inputBundleSha, crosswalkRecordId: row.id,
        templateKey: row.templateCandidates[0].templateKey,
        decisiveStepReason: 'Deterministic regression choice from the complete reviewed family candidate set.',
      };
    }
    const result = resolveMetaRoute(input, { repoRoot: ROOT, registry });
    if (row.mappingStatus === 'DIRECT_ACTIVE') {
      assert.equal(result.disposition, 'EXISTING_REUSE', `${row.id}: ${JSON.stringify(result)}`);
      assert.equal(result.problemTypeKey, row.problemTypeKey);
      assert.equal(result.templateKey, row.templateKey);
      assert.equal(result.bindingIdentity.length > 0, true);
      assertRuntimeProjection(input, result, row);
    } else if (row.mappingStatus === 'FAMILY_ACTIVE') {
      assert.equal(result.disposition, 'FAMILY_REUSE', `${row.id}: ${JSON.stringify(result)}`);
      assert.ok(row.templateCandidates.some(candidate => candidate.templateKey === result.templateKey));
      assert.equal(result.bindingIdentity.length > 0, true);
      assertRuntimeProjection(input, result, row);
    } else {
      assert.equal(result.disposition, 'RPM_PRIMARY_MIGRATION_GAP', `${row.id}: ${JSON.stringify(result)}`);
      assert.equal(result.problemTypeKey, '');
      assert.equal(result.templateKey, '');
    }
    const evidenceValidation = validateResolverEvidence(input, result, { repoRoot: ROOT, registry });
    assert.equal(evidenceValidation.status, 'PASS', `${row.id}: ${JSON.stringify(evidenceValidation.errors)}`);
    results[result.disposition]++;
    rowResults.push({ rpmRecordId: row.id, mappingStatus: row.mappingStatus, resolverDisposition: result.disposition,
      resolverDispositionReason: result.dispositionReason, problemTypeKey: result.problemTypeKey || '',
      templateKey: result.templateKey || '', bindingIdentity: result.bindingIdentity || '',
      resolverEvidenceSha: result.evidenceSha, evidenceValidation: evidenceValidation.status,
      runtimeProjectionParity: ['EXISTING_REUSE', 'FAMILY_REUSE'].includes(result.disposition) ? 'PASS' : 'NOT_APPLICABLE' });
  }
  assert.deepEqual(results, { EXISTING_REUSE: 13, FAMILY_REUSE: 4, RPM_PRIMARY_MIGRATION_GAP: 164 });
  const latestMainSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
  const receipt = {
    schemaVersion: 'RPM_PRIMARY_M3_RESOLVER_RUNTIME_REGRESSION_v1',
    latestMainSha,
    compiledRegistrySha: registry.registrySha,
    rpmCrosswalkSha: objectSha(crosswalk),
    totalRows: crosswalk.records.length,
    resolverDispositionCounts: results,
    runtimeProjectionParityFailures: 0,
    perRowResults: rowResults,
  };
  fs.writeFileSync(path.join(ROOT, M3_EVIDENCE_DIR, 'resolver-runtime-validation.json'), `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
});

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { validatePhysicalEvidence } from './review-evidence-gate.mjs';

export const LEGACY_FULL_SCHEMA = 'JS_ARCHIVE_PHYSICAL_REVIEW_EVIDENCE_v1';
export const LEGACY_TARGETED_R2_SCHEMA = 'JS_ARCHIVE_R2_TARGETED_RECHECK_EVIDENCE_v1';

const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;
const array = value => Array.isArray(value) ? value : [];

export function gitBlobSha(buffer) {
  const body = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  const header = Buffer.from(`blob ${body.length}\0`);
  return crypto.createHash('sha1').update(Buffer.concat([header, body])).digest('hex');
}

function numberSet(values) {
  return [...new Set(array(values).map(Number).filter(Number.isInteger))].sort((a, b) => a - b);
}

function sameNumbers(a, b) {
  const left = numberSet(a);
  const right = numberSet(b);
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function validateTargetedR2Evidence({ evidence, examFile, actualArtifactGitBlob }) {
  const issues = [];

  if (evidence?.schemaVersion !== LEGACY_TARGETED_R2_SCHEMA) issues.push('EVIDENCE_SCHEMA_INVALID');
  if (String(evidence?.stage || '').toUpperCase() !== 'R2') issues.push('EVIDENCE_STAGE_MISMATCH');
  if (!nonEmpty(evidence?.examUid)) issues.push('EXAM_UID_REQUIRED');
  if (!nonEmpty(evidence?.examFilename)) issues.push('EXAM_FILENAME_REQUIRED');
  if (!nonEmpty(evidence?.inputArtifactSha)) issues.push('INPUT_ARTIFACT_SHA_REQUIRED');

  let actualBlob = actualArtifactGitBlob;
  if (!actualBlob && examFile) {
    const bytes = fs.readFileSync(examFile);
    actualBlob = gitBlobSha(bytes);
    if (path.basename(examFile) !== evidence.examFilename) issues.push('EVIDENCE_EXAM_FILENAME_MISMATCH');
  }
  if (!nonEmpty(actualBlob)) issues.push('ACTUAL_ARTIFACT_SHA_REQUIRED');
  else if (nonEmpty(evidence?.inputArtifactSha) && actualBlob !== evidence.inputArtifactSha) {
    issues.push('EVIDENCE_EXAM_GIT_BLOB_MISMATCH');
  }

  const selector = evidence?.selectorEvidence || {};
  if (selector.r1Stage !== 'REVIEW1_DONE') issues.push('R2_INPUT_R1_DONE_REQUIRED');
  if (selector.r1NextStage !== 'READY_FOR_REVIEW2') issues.push('R2_INPUT_READY_REQUIRED');
  if (selector.activeSameStageClaimObserved !== false) issues.push('R2_ACTIVE_SAME_STAGE_CLAIM_FORBIDDEN');
  if (selector.priorHandoffAutoReselected !== false) issues.push('R2_PRIOR_HANDOFF_RESELECT_FORBIDDEN');

  for (const key of ['r1ReceiptGitBlob', 'r1PhysicalEvidenceGitBlob', 'r1ValidatorReceiptGitBlob']) {
    if (!nonEmpty(evidence?.[key])) issues.push(`${key.toUpperCase()}_REQUIRED`);
  }

  const scope = evidence?.targetedScope || {};
  const open = numberSet(scope.openFindingQids);
  const holds = numberSet(scope.itemHoldQids);
  const changed = numberSet(scope.r1ChangedQids);
  const deps = numberSet(scope.directDependencyQids);
  const expectedRecheck = numberSet([...open, ...holds, ...changed, ...deps]);
  const recheck = numberSet(scope.recheckQids);
  if (!sameNumbers(expectedRecheck, recheck)) issues.push('R2_TARGETED_SCOPE_RECHECK_MISMATCH');
  if (Number(scope.scopeCount) !== recheck.length) issues.push('R2_TARGETED_SCOPE_COUNT_MISMATCH');

  if (recheck.length > 0) {
    issues.push('R2_TARGETED_NONEMPTY_SCOPE_NOT_YET_SUPPORTED');
  } else {
    const formal = evidence?.formalCompare || {};
    if (formal.artifactChangedAcrossR1 !== false) issues.push('R2_EMPTY_SCOPE_ARTIFACT_CHANGED');
    if (Number(formal.r1DeterministicRepairCount) !== 0) issues.push('R2_EMPTY_SCOPE_REPAIR_COUNT_NONZERO');
    if (Number(formal.r1ItemHoldCount) !== 0) issues.push('R2_EMPTY_SCOPE_HOLD_COUNT_NONZERO');
    if (Number(formal.regressionOpenCount) !== 0) issues.push('R2_EMPTY_SCOPE_REGRESSION_OPEN');
    if (formal.result !== 'TARGETED_SCOPE_EMPTY') issues.push('R2_EMPTY_SCOPE_FORMAL_COMPARE_REQUIRED');
  }

  const calibration = evidence?.solutionQualityCalibration || {};
  if (calibration.sampleReadBeforeWork !== true) issues.push('CALIBRATION_SAMPLE_READ_REQUIRED');
  if (calibration.calibrationStatus !== 'PASS') issues.push('CALIBRATION_PASS_REQUIRED');
  if (!array(calibration.goldenSampleRefs).length) issues.push('CALIBRATION_GOLDEN_REFS_REQUIRED');
  if (!array(calibration.negativeSampleRefs).length) issues.push('CALIBRATION_NEGATIVE_REFS_REQUIRED');

  const decision = evidence?.decisionSnapshot || {};
  if (Number(decision.examMutationCount) !== 0) issues.push('R2_EMPTY_SCOPE_EXAM_MUTATION_FORBIDDEN');
  if (Number(decision.deterministicRepairCount) !== 0) issues.push('R2_EMPTY_SCOPE_REPAIR_FORBIDDEN');
  if (nonEmpty(evidence?.inputArtifactSha) && decision.finalArtifactSha !== evidence.inputArtifactSha) {
    issues.push('R2_FINAL_ARTIFACT_SHA_MISMATCH');
  }
  if (decision.r2PassDeclared !== false) issues.push('R2_PREVALIDATION_PASS_DECLARATION_FORBIDDEN');
  if (decision.review2DoneDeclared !== false) issues.push('R2_PREVALIDATION_DONE_DECLARATION_FORBIDDEN');
  if (decision.r3Eligible !== false) issues.push('R2_PREVALIDATION_R3_ELIGIBLE_FORBIDDEN');

  return {
    ok: issues.length === 0,
    schemaVersion: LEGACY_TARGETED_R2_SCHEMA,
    stage: 'R2',
    mode: 'TARGETED',
    examUid: evidence?.examUid || null,
    examFilename: evidence?.examFilename || null,
    actualArtifactGitBlob: actualBlob || null,
    scopeCount: recheck.length,
    disposition: issues.length ? 'FAIL' : 'PASS',
    issues,
  };
}

export function validateCompatibilityEvidence({ evidence, evidenceFile, examFile, stage }) {
  if (evidence?.schemaVersion === LEGACY_FULL_SCHEMA) {
    return {
      validatorMode: 'FULL',
      ...validatePhysicalEvidence({ examFile, evidenceFile, stage }),
    };
  }
  if (evidence?.schemaVersion === LEGACY_TARGETED_R2_SCHEMA && stage === 'R2') {
    return {
      validatorMode: 'TARGETED',
      ...validateTargetedR2Evidence({ evidence, examFile }),
    };
  }
  return null;
}

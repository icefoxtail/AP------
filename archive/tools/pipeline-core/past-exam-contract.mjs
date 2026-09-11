import { readBoundFile, nonempty, canonicalJson } from './canonical.mjs';
import { validateFrozenCalibration } from '../past-exam-pipeline/lib/calibration.mjs';
import { evaluateGoldSourceEligibility, isBenchmarkJobKind } from './gold-contract.mjs';
import { calibrationIdentityFromLock } from './calibration-consumption.mjs';

export function validatePastExamCompletion(root, run) {
  if (run.pipeline !== 'past-exam') return [];
  const errors = [];
  try {
    if (run.schemaVersion !== 'APMATH_PIPELINE_RUN_v2') errors.push('PAST_EXAM_V3_REQUIRES_CORE_V2');
    const configRef = run.pastExamCompletionRef;
    if (!configRef || !run.inputs.some(r => r.role === 'spec' && r.path === configRef.path && r.bytes === configRef.bytes && r.sha256 === configRef.sha256)) throw new Error('PAST_EXAM_COMPLETION_CONFIG_UNBOUND');
    const config = JSON.parse(readBoundFile(root, configRef));
    if (config.schemaVersion !== 'PAST_EXAM_V3_PROJECT_CONFIG') errors.push('PAST_EXAM_COMPLETION_CONFIG_REQUIRED');
    const contractRef = run.inputs.find(r => r.path === 'archive/tools/past-exam-pipeline/completion-contract.json' && r.role === 'spec');
    const contract = JSON.parse(readBoundFile(root, contractRef));
    if (contract.schemaVersion !== 'PAST_EXAM_V3_COMPLETE') errors.push('PAST_EXAM_COMPLETION_VERSION_INVALID');
    const policy = contract.geometryPolicyRef;
    if (config.geometryPolicyRef?.path !== policy.path || config.geometryPolicyRef?.version !== policy.version || config.geometryPolicyRef?.sha256 !== policy.sha256 || config.geometryPolicyRef?.bytes !== policy.bytes) errors.push('GEOMETRY_POLICY_PROJECT_PIN_REQUIRED');
    const policyInput = run.inputs.find(r => r.role === 'rule' && r.path === policy.path && r.bytes === policy.bytes && r.sha256 === policy.sha256);
    if (!policyInput) errors.push('GEOMETRY_POLICY_APPLIED_REF_REQUIRED');
    else readBoundFile(root, policyInput);
    const ref = config.referenceSampleLockRef;
    if (!ref || !run.inputs.some(r => r.role === 'spec' && r.path === ref.path && r.bytes === ref.bytes && r.sha256 === ref.sha256)) throw new Error('REFERENCE_SAMPLE_LOCK_UNBOUND');
    const lock = JSON.parse(readBoundFile(root, ref));
    const calibrationIdentity = calibrationIdentityFromLock(ref, lock);
    errors.push(...validateFrozenCalibration(root, lock, { startSha: (config.authority || run.pastExamAuthority)?.startSha || null }).errors);
    const authority = config.authority || run.pastExamAuthority || null;
    if (authority && contract.calibrationConsumptionContract?.path) {
      const calibrationContractRef = run.inputs.find(input => input.role === 'spec' && input.path === contract.calibrationConsumptionContract.path);
      if (!calibrationContractRef) errors.push('CALIBRATION_CONTRACT_UNBOUND');
      else {
        const calibrationContract = JSON.parse(readBoundFile(root, calibrationContractRef));
        if (calibrationContract.$id !== contract.calibrationConsumptionContract.schemaVersion || calibrationContractRef.bytes !== contract.calibrationConsumptionContract.bytes || calibrationContractRef.sha256 !== contract.calibrationConsumptionContract.sha256) errors.push('CALIBRATION_CONTRACT_STALE');
      }
    }
    if (authority) {
      if (authority.schemaVersion !== 'APMATH_PAST_EXAM_JOB_AUTHORITY_v1' || authority.startSha !== lock.mainCommit || authority.calibrationSha !== ref.sha256 || authority.productionQualityProfileSha !== calibrationIdentity.productionQualityProfileSha || authority.rulePackSha !== lock.rulePackSha) errors.push('FROZEN_CALIBRATION_IDENTITY_MISMATCH');
      if (run.pastExamAuthority && canonicalJson(run.pastExamAuthority) !== canonicalJson(authority)) errors.push('FROZEN_JOB_AUTHORITY_MISMATCH');
    } else if (isBenchmarkJobKind(run.benchmarkKind)) errors.push('FROZEN_JOB_AUTHORITY_REQUIRED');
    if (lock.readerId !== run.builderId || lock.readerSessionId !== run.builderSessionId) errors.push('CALIBRATION_READER_BUILDER_MISMATCH');
    if (run.publicationIntent !== 'FULL_EXAM') errors.push('PAST_EXAM_FULL_EXAM_CLOSURE_REQUIRED');
    if (run.questions.some(q => q.examId !== lock.target?.examId)) errors.push('CALIBRATION_TARGET_EXAM_MISMATCH');
    if (!nonempty(config.sourceInventorySha) || !run.inputs.some(r => r.sha256 === config.sourceInventorySha && r.role === 'dependency')) errors.push('PAST_EXAM_SOURCE_INVENTORY_UNBOUND');
    else {
      const inventory = JSON.parse(readBoundFile(root, run.inputs.find(r => r.sha256 === config.sourceInventorySha && r.role === 'dependency')));
      const included = (inventory.questions || []).filter(q => q.disposition !== 'EXCLUDED_WITH_EVIDENCE');
      if (inventory.status !== 'SOURCE_INVENTORY_FROZEN' || inventory.examId !== lock.target?.examId || included.length !== run.questions.length || new Set(included.map(q => q.sourceIdentityKey)).size !== included.length || included.some(q => !run.questions.some(r => r.sourceIdentityKey === q.sourceIdentityKey))) errors.push('PAST_EXAM_SOURCE_INVENTORY_COVERAGE_FAIL');
    }
    if (isBenchmarkJobKind(run.benchmarkKind)) {
      const declared = run.sourceAuthority?.goldBenchmarkEligibility || config.goldBenchmarkEligibility;
      const source = { sourceFormat: declared?.sourceFormat, sourcePixelRenderAvailable: declared?.sourcePixelRenderAvailable, pdfPath: lock.target?.sourceFiles?.find(ref => /\.pdf$/i.test(ref.path))?.path };
      const eligibility = evaluateGoldSourceEligibility(source);
      if (!declared || declared.status !== eligibility.status || declared.denominatorIncluded !== eligibility.denominatorIncluded) errors.push('GOLD_SOURCE_ELIGIBILITY_BINDING');
      if (eligibility.status !== 'GOLD_ELIGIBLE') errors.push(eligibility.status);
    }
  } catch (error) { errors.push(`PAST_EXAM_COMPLETION:${error.message}`); }
  return errors;
}

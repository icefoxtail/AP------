const STAGES = new Set(['CREATE', 'R1', 'R2', 'R3', 'MAIN']);
const NEXT_STAGE = Object.freeze({
  CREATE: 'R1',
  R1: 'R2',
  R2: 'R3',
  R3: 'MAIN',
});
const V2_VALIDATOR_MODES = new Set(['CREATE_V2', 'R1_V2', 'R2_V2', 'R3_V2']);

const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;

function required(condition, code) {
  if (!condition) throw new Error(code);
}

function normalizeStage(stage) {
  const value = String(stage || '').toUpperCase();
  required(STAGES.has(value), 'STAGE_STATE_STAGE_REQUIRED');
  return value;
}

export function buildStageState({
  stage,
  workComplete = false,
  closurePending = false,
} = {}) {
  required(typeof workComplete === 'boolean', 'STAGE_STATE_WORK_COMPLETE_BOOLEAN_REQUIRED');
  required(typeof closurePending === 'boolean', 'STAGE_STATE_CLOSURE_PENDING_BOOLEAN_REQUIRED');
  return {
    stage: normalizeStage(stage),
    workComplete,
    closurePending,
  };
}

export function buildContinuation(input = {}) {
  const stage = normalizeStage(input.stage);

  for (const field of [
    'examUid',
    'inputArtifactSha',
    'finalArtifactSha',
    'evidenceRef',
    'completedStep',
    'firstMissingClosureStep',
    'exactReason',
  ]) {
    required(nonEmpty(input[field]), 'CONTINUATION_' + field.replaceAll(/([A-Z])/g, '_$1').toUpperCase() + '_REQUIRED');
  }

  return {
    stage,
    examUid: input.examUid,
    inputArtifactSha: input.inputArtifactSha,
    finalArtifactSha: input.finalArtifactSha,
    evidenceRef: input.evidenceRef,
    completedStep: input.completedStep,
    firstMissingClosureStep: input.firstMissingClosureStep,
    exactReason: input.exactReason,
  };
}

function targetKey(value) {
  return value.stage + ':' + value.examUid;
}

export function handoffContinuation({ state, continuation } = {}) {
  const current = buildStageState(state);
  const next = buildContinuation(continuation);
  required(current.stage === next.stage, 'CONTINUATION_STAGE_MISMATCH');

  return {
    state: {
      ...current,
      closurePending: true,
    },
    continuation: next,
  };
}

export function resolveClosurePending(state) {
  const current = buildStageState(state);
  return {
    ...current,
    closurePending: false,
  };
}

export function consumeValidationPass({ state, validationReport } = {}) {
  const current = buildStageState(state);
  required(current.stage !== 'MAIN', 'CLOSURE_MAIN_VALIDATION_FORBIDDEN');
  required(current.workComplete === true, 'CLOSURE_WORK_COMPLETE_REQUIRED');
  required(validationReport && validationReport.ok === true, 'CLOSURE_VALIDATION_PASS_REQUIRED');
  required(String(validationReport.disposition || '').toUpperCase() === 'PASS', 'CLOSURE_VALIDATION_DISPOSITION_REQUIRED');
  required(V2_VALIDATOR_MODES.has(validationReport.validatorMode), 'CLOSURE_V2_VALIDATOR_REQUIRED');

  const reportStage = normalizeStage(validationReport.stage);
  required(reportStage === current.stage, 'CLOSURE_VALIDATION_STAGE_MISMATCH');
  required(nonEmpty(validationReport.examUid), 'CLOSURE_EXAM_UID_REQUIRED');
  required(nonEmpty(validationReport.artifactSha), 'CLOSURE_ARTIFACT_SHA_REQUIRED');
  required(nonEmpty(validationReport.evidenceRef), 'CLOSURE_EVIDENCE_REF_REQUIRED');

  const nextStage = NEXT_STAGE[current.stage];
  required(nonEmpty(nextStage), 'CLOSURE_NEXT_STAGE_REQUIRED');

  return {
    state: buildStageState({
      stage: nextStage,
      workComplete: false,
      closurePending: false,
    }),
    nextStageEligible: true,
    receipt: {
      examUid: validationReport.examUid,
      completedStage: current.stage,
      nextStage,
      artifactSha: validationReport.artifactSha,
      evidenceRef: validationReport.evidenceRef,
      validatorMode: validationReport.validatorMode,
      disposition: 'PASS',
    },
  };
}

export async function drainMasterContinuations({
  continuations = [],
  execute,
  canContinue = () => true,
} = {}) {
  required(Array.isArray(continuations), 'MASTER_CONTINUATIONS_ARRAY_REQUIRED');
  required(typeof execute === 'function', 'MASTER_EXECUTE_REQUIRED');
  required(typeof canContinue === 'function', 'MASTER_CAN_CONTINUE_REQUIRED');

  const queue = continuations.map(buildContinuation);
  const seen = new Set();
  for (const item of queue) {
    const key = targetKey(item);
    required(!seen.has(key), 'MASTER_DUPLICATE_CONTINUATION:' + key);
    seen.add(key);
  }

  const processedKeys = [];
  const closedKeys = [];
  const remaining = [];

  for (let index = 0; index < queue.length; index += 1) {
    if (canContinue() !== true) {
      remaining.push(...queue.slice(index));
      break;
    }

    const current = queue[index];
    const key = targetKey(current);
    const result = await execute(current);
    processedKeys.push(key);

    if (result?.closed === true) {
      closedKeys.push(key);
      continue;
    }

    required(result && result.continuation, 'MASTER_UPDATED_CONTINUATION_REQUIRED:' + key);
    const updated = buildContinuation(result.continuation);
    required(targetKey(updated) === key, 'MASTER_CONTINUATION_TARGET_CHANGE_FORBIDDEN:' + key);
    remaining.push(updated);
  }

  return {
    processedCount: processedKeys.length,
    closedCount: closedKeys.length,
    processedKeys,
    closedKeys,
    remaining,
  };
}

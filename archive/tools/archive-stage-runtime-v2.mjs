const STAGES = new Set(['CREATE', 'R1', 'R2', 'R3', 'MAIN']);

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

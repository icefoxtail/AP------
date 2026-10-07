import { QUALITY_CONTRACT_V2 } from './archive-stage-validator-artifact-v2.mjs';
import { validateCodexRenderReceipt, validateCodexMainDoneReceipt, validateCodexUserWaivedMainDoneReceipt, validateCodexRootWaivedStaticReceipt, validateCodexRootWaivedMainDoneReceipt } from './archive-codex-closeout-v2.mjs';
import { validateGptMainDoneReceipt } from './archive-gpt-closeout-v2.mjs';
const STAGES = new Set(['CREATE', 'R1', 'R2', 'R3', 'MAIN', 'RENDER', 'PUBLICATION', 'MAIN_DONE']);
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
  qualityContractVersion,
  executionLine,
  campaignId,
  stream,
} = {}) {
  required(typeof workComplete === 'boolean', 'STAGE_STATE_WORK_COMPLETE_BOOLEAN_REQUIRED');
  required(typeof closurePending === 'boolean', 'STAGE_STATE_CLOSURE_PENDING_BOOLEAN_REQUIRED');
  if(qualityContractVersion !== undefined) {
    required(qualityContractVersion===QUALITY_CONTRACT_V2,'STAGE_QUALITY_CONTRACT_UNSUPPORTED');
    required(['CODEX','GPT_SCHEDULED'].includes(executionLine),'STAGE_EXECUTION_LINE_REQUIRED');
    if (executionLine === 'GPT_SCHEDULED') {
      required(nonEmpty(campaignId),'STAGE_GPT_CAMPAIGN_ID_REQUIRED');
      required(['A','B','C'].includes(String(stream || '').toUpperCase()),'STAGE_GPT_STREAM_REQUIRED');
    }
  }
  return {
    ...(qualityContractVersion ? {qualityContractVersion,executionLine} : {}),
    ...(executionLine === 'GPT_SCHEDULED' ? {campaignId,stream:String(stream).toUpperCase()} : {}),
    stage: normalizeStage(stage),
    workComplete,
    closurePending,
  };
}

export function buildContinuation(input = {}) {
  const stage = normalizeStage(input.stage);
  const contract=buildStageState({stage,qualityContractVersion:input.qualityContractVersion,executionLine:input.executionLine,campaignId:input.campaignId,stream:input.stream});

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
    ...(contract.qualityContractVersion ? {qualityContractVersion:contract.qualityContractVersion,executionLine:contract.executionLine} : {}),
    ...(contract.executionLine === 'GPT_SCHEDULED' ? {campaignId:contract.campaignId,stream:contract.stream} : {}),
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
  return [value.executionLine || 'LEGACY', value.campaignId || '-', value.stream || '-', value.stage, value.examUid].join(':');
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

  if(current.qualityContractVersion) {
    required(validationReport.qualityContractVersion===current.qualityContractVersion,'CLOSURE_CONTRACT_DOWNGRADE_FORBIDDEN');
    required(validationReport.executionLine===current.executionLine,'CLOSURE_EXECUTION_LINE_MISMATCH');
    if (current.executionLine === 'GPT_SCHEDULED') {
      required(validationReport.campaignId===current.campaignId,'CLOSURE_GPT_CAMPAIGN_ID_MISMATCH');
      required(String(validationReport.stream || '').toUpperCase()===current.stream,'CLOSURE_GPT_STREAM_MISMATCH');
    }
  }
  const currentContract=validationReport.qualityContractVersion===QUALITY_CONTRACT_V2;
  if(currentContract) required(validationReport.artifactContract?.active===true,'CLOSURE_ARTIFACT_GATE_REQUIRED');
  const nextStage = currentContract && validationReport.executionLine==='CODEX' && current.stage==='R3' ? 'RENDER' : NEXT_STAGE[current.stage];
  required(nonEmpty(nextStage), 'CLOSURE_NEXT_STAGE_REQUIRED');

  return {
    state: buildStageState({
      stage: nextStage,
      ...(currentContract ? {qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:validationReport.executionLine} : {}),
      ...(validationReport.executionLine === 'GPT_SCHEDULED' ? {campaignId:validationReport.campaignId,stream:validationReport.stream} : {}),
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
      ...(validationReport.executionLine === 'GPT_SCHEDULED' ? {qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'GPT_SCHEDULED',campaignId:validationReport.campaignId,stream:validationReport.stream} : {}),
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

export function consumeCodexRenderPass({state,...input}) {
  required(buildStageState(state).stage==='RENDER','RENDER_STAGE_REQUIRED');
  const result=validateCodexRenderReceipt(input);required(result.ok,'RENDER_CLOSURE_FAILED:'+result.issues.join(','));
  return {state:buildStageState({stage:'PUBLICATION',qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'CODEX'}),receipt:input.receipt};
}
export function consumeCodexMainDone({state,...input}) {
  required(buildStageState(state).stage==='PUBLICATION','PUBLICATION_STAGE_REQUIRED');
  const result=validateCodexMainDoneReceipt(input);required(result.ok,'MAIN_DONE_CLOSURE_FAILED:'+result.issues.join(','));
  return {state:buildStageState({stage:'MAIN_DONE',workComplete:true,qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'CODEX'}),receipt:input.receipt};
}
export function consumeCodexUserWaivedMainDone({state,...input}) {
  const current=buildStageState(state);
  required(current.stage==='RENDER','USER_WAIVER_RENDER_STAGE_REQUIRED');
  required(current.executionLine==='CODEX' && current.qualityContractVersion===QUALITY_CONTRACT_V2,'USER_WAIVER_CODEX_CURRENT_REQUIRED');
  const result=validateCodexUserWaivedMainDoneReceipt(input);required(result.ok,'USER_WAIVED_MAIN_DONE_CLOSURE_FAILED:'+result.issues.join(','));
  return {state:buildStageState({stage:'MAIN_DONE',workComplete:true,qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'CODEX'}),receipt:input.receipt,closure:result};
}
export function consumeCodexRootWaivedStaticPass({state,...input}) {
  const current=buildStageState(state);
  required(['R3','RENDER'].includes(current.stage),'ROOT_WAIVER_R3_OR_RENDER_STAGE_REQUIRED');
  required(current.executionLine==='CODEX'&&current.qualityContractVersion===QUALITY_CONTRACT_V2,'ROOT_WAIVER_CODEX_CURRENT_REQUIRED');
  const result=validateCodexRootWaivedStaticReceipt(input);required(result.ok,'ROOT_WAIVED_STATIC_CLOSURE_FAILED:'+result.issues.join(','));
  return {state:buildStageState({stage:'PUBLICATION',qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'CODEX'}),receipt:input.receipt,closure:result};
}
export function consumeCodexRootWaivedMainDone({state,...input}) {
  const current=buildStageState(state);
  required(current.stage==='PUBLICATION','PUBLICATION_STAGE_REQUIRED');
  required(current.executionLine==='CODEX'&&current.qualityContractVersion===QUALITY_CONTRACT_V2,'ROOT_WAIVER_CODEX_CURRENT_REQUIRED');
  const result=validateCodexRootWaivedMainDoneReceipt(input);required(result.ok,'ROOT_WAIVED_MAIN_DONE_CLOSURE_FAILED:'+result.issues.join(','));
  return {state:buildStageState({stage:'MAIN_DONE',workComplete:true,qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'CODEX'}),receipt:input.receipt,closure:result};
}

export function consumeGptMainDone({state,...input}) {
  const current=buildStageState(state);
  required(current.stage==='MAIN','GPT_MAIN_STAGE_REQUIRED');
  required(current.executionLine==='GPT_SCHEDULED','GPT_MAIN_EXECUTION_LINE_REQUIRED');
  const result=validateGptMainDoneReceipt({...input,campaignId:current.campaignId,stream:current.stream});
  required(result.ok,'GPT_MAIN_DONE_CLOSURE_FAILED:'+result.issues.join(','));
  return {state:buildStageState({stage:'MAIN_DONE',workComplete:true,qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'GPT_SCHEDULED',campaignId:current.campaignId,stream:current.stream}),receipt:input.receipt};
}

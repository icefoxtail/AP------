import { objectSha, nonempty } from './canonical.mjs';

export const EXECUTION_FAILURE_CLASSES = Object.freeze([
  'PRE_MODEL_EXECUTION_FAILURE',
  'MODEL_STATE_AMBIGUOUS_FAILURE',
]);
export const MAX_EXECUTION_RECOVERY_ATTEMPTS = 2;

const integerOrNull = value => Number.isSafeInteger(value) && value >= 0 ? value : null;

export function classifyExecutionFailure({ receipt = {}, request = {}, error = null } = {}) {
  const errorText = [error?.message, receipt.failureCode, receipt.code, receipt.reason, request.failureCode].filter(nonempty).join(' ').toUpperCase();
  const explicit = receipt.executionFailureClass || request.executionFailureClass || error?.executionFailureClass;
  const modelInvocationCount = integerOrNull(receipt.modelInvocationCount ?? receipt.execution?.modelInvocationCount ?? request.modelInvocationCount);
  const semanticEvidenceCount = integerOrNull(receipt.semanticEvidenceCount ?? receipt.execution?.semanticEvidenceCount ?? request.semanticEvidenceCount)
    ?? (receipt.evidenceReturned === false ? 0 : Array.isArray(receipt.semanticEvidence) ? receipt.semanticEvidence.length : null);
  const responseReturned = receipt.responseReturned === true || receipt.responseAttestationReturned === true || receipt.providerResponseReturned === true;
  const evidenceReturned = receipt.evidenceReturned === true || (Array.isArray(receipt.semanticEvidence) && receipt.semanticEvidence.length > 0);
  const preModelSignal = receipt.preDispatchFailure === true
    || modelInvocationCount === 0
    || receipt.responseReturned === false && receipt.responseAttestationReturned === false && receipt.evidenceReturned === false
    || /INPUT_ENVELOPE|NATIVE_IMAGE|PACKET_INVALID|TRANSPORT_UNAVAILABLE|DAEMON|SOCKET|APP_SERVER.*REJECT|BEFORE_TURN|TURN_START_REJECT/.test(errorText);
  const ambiguousSignal = /TIMEOUT|UNKNOWN|PARTIAL|TURN_ID|OUTPUT_NOT_JSON|PROTOCOL|DISPATCHED|CONNECTION_RESET|CLOSED/.test(errorText)
    || (responseReturned && !evidenceReturned)
    || (modelInvocationCount === null && semanticEvidenceCount === null);
  const failureClass = EXECUTION_FAILURE_CLASSES.includes(explicit)
    ? explicit
    : modelInvocationCount === 0
      ? 'PRE_MODEL_EXECUTION_FAILURE'
      : (preModelSignal && !ambiguousSignal) || (preModelSignal && receipt.preDispatchFailure === true)
        ? 'PRE_MODEL_EXECUTION_FAILURE'
        : 'MODEL_STATE_AMBIGUOUS_FAILURE';
  const failureCode = receipt.failureCode || request.failureCode || error?.failureCode || error?.code || null;
  const fingerprint = receipt.executionFailureFingerprint || `sha256:${objectSha({
    failureClass,
    failureCode,
    phase: receipt.failedPhase || receipt.phase || request.phase || null,
    responseReturned,
    responseAttestationReturned: receipt.responseAttestationReturned === true,
    evidenceReturned,
    modelInvocationCount,
    semanticEvidenceCount,
  }).slice('sha256:'.length)}`;
  return {
    failureClass,
    failureCode,
    modelInvocationCount,
    semanticEvidenceCount: semanticEvidenceCount ?? 0,
    responseReturned,
    responseAttestationReturned: receipt.responseAttestationReturned === true,
    evidenceReturned,
    fingerprint,
  };
}

export function isPreModelExecutionFailure(value) {
  return value?.failureClass === 'PRE_MODEL_EXECUTION_FAILURE';
}

export function isAmbiguousExecutionFailure(value) {
  return value?.failureClass === 'MODEL_STATE_AMBIGUOUS_FAILURE';
}

import { canonicalJson, HASH_PATTERN, isObject, nonempty, objectSha } from './canonical.mjs';
import { loadBoundQuestionBanks } from './closure.mjs';

export const AUDITOR_PACKET_VERSION = 'APMATH_AUDITOR_PACKET_v1';
export const AUDITOR_PHASES = Object.freeze(['U1', 'U2', 'U3']);

const allowed = Object.freeze({
  U1: ['questionUid', 'content', 'choices', 'problemAssets', 'curriculum'],
  U2: ['questionUid', 'artifact', 'renderWitnesses'],
  U3: ['renderWitnesses', 'currentQuestion', 'questionUid', 'frozenU1', 'frozenU2', 'currentAnswer', 'currentSolution', 'metadata', 'dependencies']
});
const forbidden = Object.freeze({ U1: ['answer', 'solution', 'solutionImage', 'previousVerdict'], U2: ['expectedAnswer', 'answer', 'solution', 'solutionImage', 'frozenU1', 'previousVerdict'], U3: [] });

// Read the byte-bound candidate, never the source choices or a previous verdict.
export function loadCandidateReviewContext(root, run) {
  return Object.fromEntries(loadBoundQuestionBanks(root, run).map(question => {
    const declared = run.questions.find(q => q.questionUid === question.questionUid);
    const candidateRef = run.inputs.find(ref => ref.role === 'candidate' && ref.path === declared.candidatePath);
    return [question.questionUid, {
      currentQuestion: { questionUid: question.questionUid, content: question.content, choices: question.choices || [], candidateRef },
      currentAnswer: question.answer,
      currentSolution: question.solution || '',
    }];
  }));
}

export function buildU3CandidatePayload(candidateContext, questionUid, frozenInputs = {}) {
  if (!candidateContext?.[questionUid]) throw new Error('U3_CANDIDATE_NOT_BOUND');
  return structuredClone({ ...frozenInputs, questionUid, ...candidateContext[questionUid] });
}

export function buildAuditorPacket({ phase, questionUid, questionUids = [questionUid], payload = {}, affectedUidSet = [questionUid], declaredContextDependencyUidSet = [], auditorId, auditorSessionId, builderId, builderSessionId, auditorPrincipalType, contextId, inputVisibilityProfile, priorReviewVisibility, sealed, launchId, externalTaskId, candidateContext = null }) {
  if (!AUDITOR_PHASES.includes(phase)) throw new Error('AUDITOR_PHASE_INVALID');
  const packet = { schemaVersion: AUDITOR_PACKET_VERSION, phase, questionUids, payload, auditorId, auditorSessionId, builderId, builderSessionId, auditorPrincipalType, contextId, inputVisibilityProfile, priorReviewVisibility, sealed, launchId, externalTaskId };
  packet.packetSha = objectSha(packet);
  const result = validateAuditorPacket(packet, { affectedUidSet, declaredContextDependencyUidSet, candidateContext });
  if (result.status !== 'PASS') throw new Error(result.errors.join(';'));
  return packet;
}

export function validateAuditorPacket(packet, { affectedUidSet = [], declaredContextDependencyUidSet = [], builderId, builderSessionId, candidateContext = null } = {}) {
  const errors = [];
  if (!isObject(packet)) return { status: 'BLOCKED', errors: ['AUDITOR_PACKET_REQUIRED'] };
  const visibleUids = [...new Set([...affectedUidSet, ...declaredContextDependencyUidSet])];
  const { packetSha, ...boundPacket } = packet;
  if (packetSha !== objectSha(boundPacket) || packet.sealed !== true || !nonempty(packet.contextId)) errors.push('AUDITOR_SEAL_INVALID');
  if (!['STATELESS_MODEL', 'HUMAN'].includes(packet.auditorPrincipalType)) errors.push('AUDITOR_PRINCIPAL_TYPE_INVALID');
  if (!isObject(packet) || packet.schemaVersion !== AUDITOR_PACKET_VERSION || !AUDITOR_PHASES.includes(packet.phase)) errors.push('AUDITOR_PACKET_SCHEMA_INVALID');
  if (!Array.isArray(packet.questionUids) || packet.questionUids.length === 0 || packet.questionUids.some(uid => !nonempty(uid))) errors.push('AUDITOR_PACKET_UIDS_INVALID');
  if (packet.questionUids?.some(uid => !visibleUids.includes(uid))) errors.push('UNRELATED_UID_PROMPT_EXPOSURE');
  if (!nonempty(packet.auditorId) || !nonempty(packet.auditorSessionId)) errors.push('AUDITOR_IDENTITY_MISSING');
  const expectedBuilderId = builderId ?? packet.builderId;
  const expectedBuilderSessionId = builderSessionId ?? packet.builderSessionId;
  if (!nonempty(expectedBuilderId) || !nonempty(expectedBuilderSessionId) || packet.auditorId === expectedBuilderId || packet.auditorSessionId === expectedBuilderSessionId) errors.push('AUDITOR_BUILDER_NOT_INDEPENDENT');
  const payload = packet.payload;
  if (Array.isArray(payload)) {
    if (payload.length !== packet.questionUids.length || payload.some(p => !packet.questionUids.includes(p?.questionUid)) || new Set(payload.map(p => p?.questionUid)).size !== payload.length) errors.push('AUDITOR_BATCH_PAYLOAD_PARITY');
    for (const item of payload) {
      const { packetSha: ignored, ...body } = packet;
      const subpacket = { ...body, questionUids: [item?.questionUid], payload: item };
      errors.push(...validateAuditorPacket({ ...subpacket, packetSha: objectSha(subpacket) }, { affectedUidSet, declaredContextDependencyUidSet, builderId, builderSessionId, candidateContext }).errors);
    }
  } else if (!isObject(payload)) errors.push('AUDITOR_PACKET_PAYLOAD_INVALID');
  else {
    if (!packet.questionUids.includes(payload.questionUid)) errors.push('PAYLOAD_UID_SCOPE_MISMATCH');
    if (packet.phase === 'U3') {
      const current = payload.currentQuestion;
      if (!isObject(current) || current.questionUid !== payload.questionUid || !nonempty(current.content)
        || !Array.isArray(current.choices) || current.choices.some(choice => !nonempty(choice))
        || !nonempty(current.candidateRef?.path) || !Number.isSafeInteger(current.candidateRef?.bytes)
        || current.candidateRef.bytes < 0 || !HASH_PATTERN.test(current.candidateRef?.sha256)
        || payload.currentAnswer === undefined || payload.currentAnswer === null || !nonempty(payload.currentSolution)) errors.push('U3_CURRENT_CANDIDATE_REQUIRED');
      if (candidateContext) {
        const expected = candidateContext[payload.questionUid];
        if (!expected || ['currentQuestion', 'currentAnswer', 'currentSolution'].some(field => canonicalJson(payload[field] ?? null) !== canonicalJson(expected[field] ?? null))) errors.push('U3_CURRENT_CANDIDATE_MISMATCH');
      }
    }
    const walk = value => {
      if (Array.isArray(value)) return value.forEach(walk);
      if (!isObject(value)) return;
      if (typeof value.questionUid === 'string' && !visibleUids.includes(value.questionUid)) errors.push('NESTED_UNRELATED_UID_EXPOSURE');
      for (const [key, nested] of Object.entries(value)) {
        if ((forbidden[packet.phase] || []).some(word => key.toLowerCase().replace(/[^a-z]/g, '').includes(word.toLowerCase())) || ['U1','U2'].includes(packet.phase) && /verdict|rationale|hiddencontext|systemprompt|answerkey|expectedfact/i.test(key)) errors.push(`NESTED_BLIND_CONTEXT_LEAK:${key}`);
        if (['U1', 'U2'].includes(packet.phase) && typeof nested === 'string' && /^\s*[\[{]/.test(nested)) { try { walk(JSON.parse(nested)); } catch { errors.push('OPAQUE_BLIND_CONTEXT_JSON'); } }
        walk(nested);
      }
    };
    walk(payload);
    const keys = Object.keys(payload);
    for (const key of keys) if (!allowed[packet.phase]?.includes(key)) errors.push(`AUDITOR_FIELD_NOT_ALLOWED:${packet.phase}:${key}`);
    for (const key of forbidden[packet.phase] || []) if (keys.includes(key)) errors.push(`AUDITOR_FORBIDDEN_FIELD:${packet.phase}:${key}`);
  }
  return { status: errors.length ? 'BLOCKED' : 'PASS', errors, unrelatedUidPromptExposureCount: packet.questionUids?.filter(uid => !affectedUidSet.includes(uid)).length || 0 };
}

export function createSealedAuditorSubcontexts({ builderId, builderSessionId, auditorId, auditorPrincipalType, sessions = {}, contextIds = {}, principalIds = {} }) {
  const errors = [];
  if (!nonempty(builderId) || !nonempty(builderSessionId) || !nonempty(auditorId)) errors.push('PRINCIPAL_IDENTITY_MISSING');
  if (builderId === auditorId) errors.push('BUILDER_AUDITOR_PRINCIPAL_COLLISION');
  const contexts = Object.fromEntries(AUDITOR_PHASES.map(phase => [phase, { phase, auditorId: principalIds[phase] || auditorId, auditorSessionId: sessions[phase], contextId: contextIds[phase] }]));
  if (Object.values(contexts).some(context => !nonempty(context.contextId) || !nonempty(context.auditorSessionId)) || new Set(Object.values(contexts).map(context => context.contextId)).size !== 3) errors.push('SEALED_CONTEXT_IDENTITY_REQUIRED');
  if (!['HUMAN', 'STATELESS_MODEL'].includes(auditorPrincipalType) || auditorPrincipalType === 'HUMAN' && contexts.U1.auditorId === contexts.U2.auditorId) errors.push('PRINCIPAL_SEPARATION_REQUIRED');
  if (new Set(Object.values(contexts).map(context => context.auditorSessionId)).size !== AUDITOR_PHASES.length) errors.push('AUDITOR_SESSION_COLLISION');
  if (Object.values(contexts).some(context => context.auditorSessionId === builderSessionId)) errors.push('BUILDER_AUDITOR_SESSION_COLLISION');
  return { status: errors.length ? 'BLOCKED' : 'PASS', errors, builderId, builderSessionId, auditorId, contexts };
}

export function secondAuditorRequirement(signals = {}) {
  const reasonCodes = [];
  const mappings = [['independentAnswerMatches', false, 'ANSWER_MISMATCH'], ['sourceConflict', true, 'SOURCE_CONFLICT'], ['repairAfterFail', true, 'REPAIR_AFTER_FAIL'], ['visualDisagreement', true, 'VISUAL_SEMANTIC_DISAGREEMENT'], ['firstAuditorFailed', true, 'FIRST_AUDITOR_NOT_PASS'], ['highRisk', true, 'HIGH_RISK'], ['reuseConflict', true, 'REUSE_VALIDATOR_CONFLICT'], ['dependencyExpansion', true, 'UNEXPECTED_DEPENDENCY_EXPANSION']];
  for (const [key, expected, reason] of mappings) if (signals[key] !== undefined && signals[key] === expected && ((key === 'independentAnswerMatches' && expected === false) || key !== 'independentAnswerMatches')) reasonCodes.push(reason);
  return { required: false, eligible: reasonCodes.length > 0, requiresExplicitAuthorization: true, maxAdditionalAuditors: 1, reasonCodes };
}

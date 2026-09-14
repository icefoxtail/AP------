import { canonicalJson, HASH_PATTERN, isObject, nonempty, objectSha } from './canonical.mjs';
import { loadBoundQuestionBanks } from './closure.mjs';
import { visualAssetPayload } from './native-visual.mjs';

export const AUDITOR_PACKET_VERSION = 'APMATH_AUDITOR_PACKET_v1';
export const AUDITOR_PHASES = Object.freeze(['U1', 'U2', 'U3']);
export const INDEPENDENT_REVIEW_CONTRACTS = Object.freeze({
  U1: 'Independently audit source fidelity, source defects and mathematics using only the provided source pixels, source text and ordered choices. Source-page pixels are evidence, not candidate solutions. Do not review other questions visible on a page outside the declared UID scope.',
  U2: 'Independently audit only supplied visual artifacts and artifact renders: crop completeness, geometry, labels, coordinates and visual fidelity. Do not infer intended answers or consume source/candidate solutions or peer reports.',
  U3: 'Independently audit the current candidate problem, choices, answer, solution, necessary problem visuals and actual browser renders for mathematical correctness, intermediate reasoning and student output consistency. No U1/U2 reports are available. Return independentAnswer and independentDerivation for MATH_A2, not peer evidence hashes.',
});

const allowed = Object.freeze({
  U1: ['questionUid', 'content', 'choices', 'problemAssets', 'sourcePixels', 'curriculum'],
  U2: ['questionUid', 'artifact', 'renderWitnesses', 'visualApplicability'],
  U3: ['renderWitnesses', 'currentQuestion', 'questionUid', 'currentAnswer', 'currentSolution', 'metadata', 'dependencies']
});
const forbidden = Object.freeze({ U1: ['answer', 'solution', 'solutionImage', 'previousVerdict'], U2: ['expectedAnswer', 'answer', 'solution', 'solutionImage', 'frozenU1', 'previousVerdict'], U3: [] });

export const VISUAL_APPLICABILITY_STATUSES = Object.freeze(['VISUAL_REQUIRED', 'VISUAL_OPTIONAL', 'VISUAL_EXEMPT']);
export const VISUAL_ONLY_DEFECT_TYPES = Object.freeze(['missing_artifact', 'missing_render_witness']);

export function sourcePixelPayloads(root, run, source) {
  const paths = source?.sourcePageEvidencePaths || (source?.sourceEvidencePath ? [source.sourceEvidencePath] : []);
  return [...new Set(paths)].map(relative => {
    const matches = run.inputs.filter(ref => ref.path === relative || ref.path.endsWith(`/${relative}`));
    if (matches.length !== 1) throw new Error(`SOURCE_PIXEL_BINDING_REQUIRED:${relative}`);
    return visualAssetPayload(root, matches[0]);
  });
}

function assetPaths(question, key, refKey) {
  const direct = Array.isArray(question?.[key]) ? question[key] : [];
  if (direct.length) return direct;
  return Array.isArray(question?.[refKey]) ? question[refKey].filter(Boolean).map(ref => ref.path).filter(Boolean) : [];
}

// This is a projection of existing question metadata and visual triage
// authority. It is deliberately not a second visual classifier: a source
// question marked no_visual_asset_required/VISUAL_EXEMPT stays exempt, while
// an existing problem/shared visual dependency keeps the visual axis required
// even when the solution visual itself was labelled optional.
export function visualApplicabilityForQuestion(question = {}) {
  const visual = question.visual || {};
  const sourceRecord = question.sourceRecord || {};
  const problemAssetPaths = assetPaths(question, 'problemAssetPaths', 'problemAssetRefs');
  const solutionAssetPaths = assetPaths(question, 'solutionAssetPaths', 'solutionAssetRefs');
  const hasDependency = visual.problemVisualMathDependency === true
    || visual.sharedVisualMathDependency === true
    || problemAssetPaths.length > 0 || Boolean(question.image || sourceRecord.image);
  const explicitlyExempt = (visual.requirement === 'VISUAL_EXEMPT'
    || sourceRecord.visualAssetStatus === 'no_visual_asset_required')
    && !solutionAssetPaths.length && !question.solutionImage && visual.actualSolutionVisualAttached !== true;
  const status = hasDependency || visual.requirement === 'VISUAL_REQUIRED'
    ? 'VISUAL_REQUIRED'
    : explicitlyExempt
      ? 'VISUAL_EXEMPT'
      : 'VISUAL_OPTIONAL';
  const artifactRequired = status === 'VISUAL_REQUIRED' || visual.actualSolutionVisualAttached === true || solutionAssetPaths.length > 0 || Boolean(question.solutionImage);
  return {
    status,
    artifactRequired,
    renderWitnessRequired: artifactRequired,
    authority: {
      requirement: visual.requirement || null,
      visualAssetStatus: sourceRecord.visualAssetStatus || null,
      action: visual.action || null,
      adjudicationId: visual.adjudicationId || null,
      adjudicationStatus: visual.adjudicationStatus || null,
      problemDependency: visual.problemVisualMathDependency === true,
      sharedDependency: visual.sharedVisualMathDependency === true,
      sourceNoVisualAssetRequired: sourceRecord.visualAssetStatus === 'no_visual_asset_required'
    }
  };
}

function validateVisualApplicability(value) {
  return isObject(value)
    && VISUAL_APPLICABILITY_STATUSES.includes(value.status)
    && typeof value.artifactRequired === 'boolean'
    && typeof value.renderWitnessRequired === 'boolean'
    && isObject(value.authority)
    && (value.status === 'VISUAL_EXEMPT' ? value.artifactRequired === false && value.renderWitnessRequired === false : true);
}

// Read the byte-bound candidate, never the source choices or a previous verdict.
export function loadCandidateReviewContext(root, run) {
  return Object.fromEntries(loadBoundQuestionBanks(root, run).map(question => {
    const declared = run.questions.find(q => q.questionUid === question.questionUid);
    const candidateRef = run.inputs.find(ref => ref.role === 'candidate' && ref.path === declared.candidatePath);
    return [question.questionUid, {
      currentQuestion: { questionUid: question.questionUid, content: question.content || '', choices: question.choices || [], candidateRef,
        ...(question.image ? { image: question.image, problemAssets: candidateProblemAssets(root, run, question) } : {}) },
      currentAnswer: question.answer,
      currentSolution: question.solution || '',
    }];
  }));
}

function candidateProblemAssets(root, run, question) {
  const ref = (question.problemAssetRefs || []).find(ref => ref && (ref.path === question.image || ref.path === `archive/${question.image}` || ref.path === `${run.assetRoot || 'archive'}/${question.image}`));
  if (!ref) throw new Error(`CANDIDATE_PROBLEM_ASSET_NOT_BOUND:${question.questionUid}`);
  return [visualAssetPayload(root, ref)];
}

export function buildU3CandidatePayload(candidateContext, questionUid, frozenInputs = {}) {
  if (!candidateContext?.[questionUid]) throw new Error('U3_CANDIDATE_NOT_BOUND');
  if ('frozenU1' in frozenInputs || 'frozenU2' in frozenInputs) throw new Error('CROSS_AUDITOR_OUTPUT_FORBIDDEN');
  return structuredClone({ ...frozenInputs, questionUid, ...candidateContext[questionUid], dependencies: {
    ...(frozenInputs.dependencies || {}),
    solutionReviewContract: {
      answerOnlyPassForbidden: true,
      required: ['keyIdea', 'conditionInterpretation', 'intermediateReasoningComplete', 'caseSplitComplete', 'studentReproducible', 'internalConsistency', 'independentIntermediateRecalculation', 'finalAnswerParity'],
      recalculation: 'Recompute every decisive arithmetic/combinatorial intermediate from the source conditions. Record independentWork and recalculations with current solutionExcerpt, bounded expression, claimedValue and independentlyComputedValue. A correct final answer never repairs a wrong step.',
      visual: 'Independently review the current candidate, its problem visuals and actual browser renders. No other auditor output is available. Report your own findings; a deterministic merger handles agreement and conflicts.'
    }
  } });
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
  const visibility = { U1: 'SOURCE_ONLY', U2: 'ARTIFACT_ONLY', U3: 'CANDIDATE_ONLY' };
  if (packet.inputVisibilityProfile !== visibility[packet.phase] || packet.priorReviewVisibility !== 'NONE') errors.push('INDEPENDENT_PHASE_VISIBILITY_REQUIRED');
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
    if (packet.phase === 'U2' && !validateVisualApplicability(payload.visualApplicability)) errors.push('U2_VISUAL_APPLICABILITY_REQUIRED');
    if (packet.phase === 'U3') {
      const current = payload.currentQuestion;
      if (!isObject(current) || current.questionUid !== payload.questionUid || !(nonempty(current.content) || current.problemAssets?.length)
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
        if (/^(?:frozenU[123]|u[123](?:Output|Result|Evidence)|a1EvidenceSha|v[12]EvidenceSha|v1ContractSha|priorReview|previousVerdict)$/i.test(key)) errors.push(`CROSS_AUDITOR_OUTPUT_FORBIDDEN:${key}`);
        if ((forbidden[packet.phase] || []).some(word => key.toLowerCase().replace(/[^a-z]/g, '').includes(word.toLowerCase())) || ['U1','U2'].includes(packet.phase) && /verdict|rationale|hiddencontext|systemprompt|answerkey|expectedfact/i.test(key)) errors.push(`NESTED_BLIND_CONTEXT_LEAK:${key}`);
        if (typeof nested === 'string' && /^\s*[\[{]/.test(nested)) {
          try { walk(JSON.parse(nested)); } catch { /* Literal bracket-prefixed content is valid blind input. */ }
        }
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

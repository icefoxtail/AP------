import { runInputSha } from './closure.mjs';
import { objectSha, nonempty } from './canonical.mjs';

export const AUTHORITY_REPAIR_VERSION = 'APMATH_AUTHORITY_BINDING_REPAIR_v1';
export const FINAL_AUTHORITY_STATUS = 'RESOLVED';

const derivedRequirement = question => {
  const visual = question.visual || {};
  if (visual.problemVisualMathDependency === true || visual.sharedVisualMathDependency === true || visual.actualSolutionVisualAttached === true) return 'VISUAL_REQUIRED';
  if (visual.requirement === 'VISUAL_REQUIRED') return 'VISUAL_REQUIRED';
  if (visual.requirement === 'VISUAL_EXEMPT' || question.sourceRecord?.visualAssetStatus === 'no_visual_asset_required') return 'VISUAL_EXEMPT';
  return 'VISUAL_OPTIONAL';
};

export function materializeAuthorityBinding(run, { questionUids = null, adjudicationStatus = FINAL_AUTHORITY_STATUS, authorityEvidenceRef = null } = {}) {
  if (!run || !Array.isArray(run.questions) || !nonempty(run.runId)) throw new Error('AUTHORITY_REPAIR_RUN_REQUIRED');
  if (adjudicationStatus !== FINAL_AUTHORITY_STATUS) throw new Error('AUTHORITY_REPAIR_TERMINAL_STATUS_REQUIRED');
  const selected = questionUids ? new Set(questionUids) : new Set(run.questions.map(question => question.questionUid));
  const next = structuredClone(run);
  const changedQuestionUids = [];
  for (const question of next.questions) {
    if (!selected.has(question.questionUid)) continue;
    const visual = { ...(question.visual || {}) };
    const requirement = derivedRequirement(question);
    const adjudicationId = visual.adjudicationId || `${question.questionUid}:authority`;
    const authorityEvidenceSha = objectSha({ questionUid: question.questionUid, requirement, adjudicationId, adjudicationStatus, authorityEvidenceRef });
    if (visual.requirement !== requirement || visual.adjudicationStatus !== adjudicationStatus || visual.adjudicationId !== adjudicationId || visual.authorityEvidenceSha !== authorityEvidenceSha) changedQuestionUids.push(question.questionUid);
    question.visual = { ...visual, requirement, adjudicationId, adjudicationStatus, authorityEvidenceSha };
  }
  if (!changedQuestionUids.length) return { status: 'NO_CHANGE', run: next, revision: run.revision, inputSha: run.inputSha, changedQuestionUids };
  next.revision = (Number.isSafeInteger(run.revision) ? run.revision : 0) + 1;
  next.inputSha = runInputSha(next);
  if (next.registry?.length) {
    next.canonicalRecordId = `${next.runId}-r${next.revision}`;
    next.registry = next.registry.map(record => ({ ...record, isCanonical: false })).concat({ recordId: next.canonicalRecordId, batchId: next.runId, revision: next.revision, supersedes: run.canonicalRecordId || null, isCanonical: true, inputSha: next.inputSha, questionUids: next.questions.map(question => question.questionUid) });
  }
  return { status: 'REPAIRED', disposition: 'SEMANTIC_REPAIR', run: next, revision: next.revision, inputSha: next.inputSha, changedQuestionUids };
}

export function authorityBindingReady(run) {
  if (!run?.questions?.length) return { status: 'BLOCKED', errors: ['AUTHORITY_RUN_EMPTY'] };
  const unresolved = run.questions.filter(question => question.visual?.adjudicationStatus !== FINAL_AUTHORITY_STATUS || !nonempty(question.visual?.adjudicationId));
  return { status: unresolved.length ? 'BLOCKED' : 'PASS', errors: unresolved.map(question => `UNFINALIZED_AUTHORITY:${question.questionUid}`) };
}

// Pure decision layer. This does not authorize writes or establish Git ancestry:
// the registrar must prove UID, ordinal, count and historical blob first.
import { classify, sourceFingerprint } from './source-delta.mjs';

export function planRebind({current, question, previous, priorBlob, at} = {}) {
  const refuse = reason => ({action:'REFUSE',deltaClass:null,changed:{},tags:{},reason});
  if (!current || !question || !previous) return refuse('NO_PRIOR_QUESTION');
  if (sourceFingerprint(previous) !== current.sourceFingerprint) return refuse('PRIOR_FINGERPRINT_MISMATCH');
  if (!/^[a-f0-9]{40}$/.test(priorBlob || '')) return refuse('PRIOR_BLOB_INVALID');
  const delta = classify(previous, question);
  const base = {deltaClass:delta.class,changed:delta.changed,tags:{},reason:delta.class};
  const number = q => q.sourceQuestionNo ?? q.questionNumber ?? q.number ?? q.id ?? null;
  if (delta.class === 'NUMBER_MISMATCH' || (number(previous) != null && number(question) != null && String(number(previous)) !== String(number(question))))
    return {...base,action:'REFUSE',deltaClass:'NUMBER_MISMATCH',reason:'NUMBER_MISMATCH'};
  if (delta.class === 'UNCHANGED') return {...base,action:'NONE'};
  if (typeof at !== 'string' || !Number.isFinite(Date.parse(at))) return {...base,action:'REFUSE',reason:'REBIND_TIME_REQUIRED'};
  const pending = new Set(Array.isArray(current.reviewPending) ? current.reviewPending : []);
  const sourceDrift = {class:delta.class === 'ANSWER' && delta.details.answerFilled ? 'ANSWER_FILLED' : delta.class, at, priorBlob};
  // Compound changes retain their review obligations and figure evidence, even
  // when the primary severity class is ANSWER or STEM_EDIT.
  if (delta.changed.figure) sourceDrift.figure = true;
  if (delta.changed.solutionText) pending.add('method');
  if (delta.changed.stemText || delta.changed.choicesText) pending.add('stem');
  if (delta.changed.answer && !delta.details.answerFilled) pending.add('answer');
  if (delta.details.otherChangedKeys.length) {
    pending.add('other');
    sourceDrift.otherChangedKeys = delta.details.otherChangedKeys;
  }
  if (delta.class === 'REPLACED') {
    sourceDrift.metadataExcluded = true;
    pending.add('reclassification');
  }
  const tags = {sourceDrift,...(pending.size ? {reviewPending:[...pending]} : {})};
  return {...base,action:delta.class === 'REPLACED' ? 'BLOCK' : 'REBIND',tags};
}

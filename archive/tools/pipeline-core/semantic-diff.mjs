import { canonicalJson, isObject, objectSha } from './canonical.mjs';
import { AXIS_INPUT_PROJECTION_MAP, CANONICAL_AXES, axisName, axisInputSha, questionFieldHashMap } from './projection.mjs';

export const SEMANTIC_DIFF_VERSION = 'APMATH_SEMANTIC_DIFF_v1';
export const CHANGE_IMPACT_VERSION = 'CHANGE_IMPACT_MAP_v1';

const FIELD_IMPACT = Object.freeze({
  SOURCE_STEM: ['A1', 'A2', 'SOLUTION', 'V1', 'V3', 'RENDER'],
  CHOICES: ['A1', 'A2', 'SOLUTION', 'V3', 'RENDER'],
  ANSWER: ['A2', 'SOLUTION', 'RENDER'],
  SOLUTION: ['SOLUTION', 'RENDER'],
  PROBLEM_ASSETS: ['A1', 'V1', 'V2', 'V3', 'RENDER'],
  SOLUTION_ASSETS: ['V2', 'V3', 'RENDER'],
  METADATA_TAGS: ['METADATA'],
  SCORE_LAYOUT: ['METADATA', 'RENDER'],
  SHARED_DEPENDENCIES: ['A1', 'SOLUTION', 'METADATA', 'V1', 'V2', 'V3', 'RENDER']
});

const GLOBAL_IMPACT = Object.freeze({
  'engine.html': ['RENDER'], css: ['RENDER'], layout: ['RENDER'], 'layout-authority': ['RENDER'], runtime: ['RENDER'], fonts: ['RENDER'], mathjax: ['RENDER'], viewport: ['RENDER'], renderPolicy: ['RENDER'], rule: ['A1', 'A2', 'SOLUTION', 'METADATA', 'V1', 'V2', 'V3', 'RENDER'], verifier: ['A1', 'A2', 'SOLUTION', 'METADATA', 'V1', 'V2', 'V3', 'RENDER'], uidRegistry: ['A1', 'A2', 'SOLUTION', 'METADATA', 'V1', 'V2', 'V3', 'RENDER']
});

const listQuestions = value => Array.isArray(value) ? value : Array.isArray(value?.questions) ? value.questions : Array.isArray(value?.questionBank) ? value.questionBank : [];
const uidOf = question => question?.questionUid || `${question?.sourcePath || 'unknown'}|${question?.examId || 'unknown'}|${question?.id ?? question?.qid}`;
const fieldMap = (question, dependencies) => questionFieldHashMap({ ...question, questionUid: uidOf(question) }, dependencies);

export function semanticDiff(previous, current, { previousDependencies = {}, currentDependencies = {} } = {}) {
  const before = new Map(listQuestions(previous).map(q => [uidOf(q), q]));
  const after = new Map(listQuestions(current).map(q => [uidOf(q), q]));
  const questionUids = [...new Set([...before.keys(), ...after.keys()])].sort();
  const changedUidSet = [], changedFieldMap = {}, previousFieldHashMap = {}, currentFieldHashMap = {};
  for (const uid of questionUids) {
    const oldMap = before.has(uid) ? fieldMap(before.get(uid), previousDependencies) : null;
    const newMap = after.has(uid) ? fieldMap(after.get(uid), currentDependencies) : null;
    previousFieldHashMap[uid] = oldMap?.fieldShaMap || null;
    currentFieldHashMap[uid] = newMap?.fieldShaMap || null;
    const changedFields = oldMap && newMap ? Object.keys(oldMap.fieldShaMap).filter(group => oldMap.fieldShaMap[group] !== newMap.fieldShaMap[group]) : Object.keys(newMap?.fieldShaMap || oldMap?.fieldShaMap || {});
    if (!oldMap || !newMap || changedFields.length) {
      changedUidSet.push(uid);
      changedFieldMap[uid] = changedFields.sort();
    }
  }
  const globalInvalidatorSet = Object.keys({ ...previousDependencies, ...currentDependencies }).filter(key => canonicalJson(previousDependencies[key] ?? null) !== canonicalJson(currentDependencies[key] ?? null)).sort();
  const payload = { changedUidSet, changedFieldMap, globalInvalidatorSet, previousFieldHashMap, currentFieldHashMap };
  return { schemaVersion: SEMANTIC_DIFF_VERSION, ...payload, semanticDiffSha: objectSha(payload) };
}

function globalAxes(globalInvalidatorSet) {
  return [...new Set(globalInvalidatorSet.flatMap(key => GLOBAL_IMPACT[key] || CANONICAL_AXES).flatMap(expandAxis))];
}

const expandAxis = axis => axis === 'RENDER' ? ['RENDER_CAPTURE', 'RENDER_REVIEW'] : [axisName(axis)];
export function runLevelSemanticHash(run, questions) {
  return objectSha({ schemaVersion: 'RUN_LEVEL_SEMANTIC_HASH_v1', examIdentity: run.questions.map(q => [q.sourceExamId, q.examId]), questionCount: questions.length, questionOrder: questions.map(q => q.questionUid), uidSet: questions.map(q => q.questionUid).sort(), actualExamMetadata: questions.map(q => q.examMetadata || null), sharedMaterial: run.sharedMaterial || null, sharedDependency: run.semanticDependencyBindings || {}, globalLayoutMetadata: run.globalLayoutMetadata || null, releaseMetadata: run.releasePolicy || run.releaseRenderPolicy || null });
}

export function changeImpactMap(diff, currentQuestions, { previousAxisInputShas = {}, currentAxisInputShas = {}, dependencies = {}, renderPolicy = null, runtime = null } = {}) {
  if (!isObject(diff) || diff.schemaVersion !== SEMANTIC_DIFF_VERSION) throw new Error('SEMANTIC_DIFF_REQUIRED');
  const questions = new Map(listQuestions(currentQuestions).map(q => [uidOf(q), q]));
  const affected = new Map();
  const add = (uid, axis, reason) => {
    const key = `${uid}\u0000${axis}`;
    const entry = affected.get(key) || { questionUid: uid, axis, action: 'RECHECK', reasonCodes: [] };
    if (!entry.reasonCodes.includes(reason)) entry.reasonCodes.push(reason);
    affected.set(key, entry);
  };
  for (const uid of diff.changedUidSet) {
    const fields = diff.changedFieldMap[uid] || [];
    if (!questions.has(uid)) continue;
    for (const field of fields) for (const axis of (FIELD_IMPACT[field] || CANONICAL_AXES).flatMap(expandAxis)) add(uid, axis, `FIELD_CHANGED:${field}`);
    if (fields.length) add(uid, 'STATIC', 'CONTENT_STATIC_CONTRACT');
    if (fields.some(field => ['SOURCE_STEM', 'CHOICES', 'PROBLEM_ASSETS'].includes(field))) add(uid, 'SOURCE', 'SOURCE_FACT_CHANGED');
    if (fields.includes('SOLUTION')) add(uid, 'V3', 'SOLUTION_VISUAL_BENEFIT_GATE');
    if (fields.includes('SOURCE_STEM') || fields.includes('CHOICES')) add(uid, 'V3', 'DOWNSTREAM_CORRECTNESS');
  }
  const globals = globalAxes(diff.globalInvalidatorSet || []);
  if (globals.length) for (const uid of questions.keys()) for (const axis of globals) add(uid, axis, `GLOBAL_INVALIDATOR:${diff.globalInvalidatorSet.find(key => (GLOBAL_IMPACT[key] || []).includes(axis))}`);
  const affectedUidAxisSet = [...affected.values()].map(entry => ({ ...entry, reasonCodes: entry.reasonCodes.sort() })).sort((a, b) => `${a.questionUid}:${a.axis}`.localeCompare(`${b.questionUid}:${b.axis}`));
  const allPairs = [...questions.keys()].sort().flatMap(uid => Object.keys(AXIS_INPUT_PROJECTION_MAP).map(axis => ({ questionUid: uid, axis })));
  const affectedKeys = new Set(affectedUidAxisSet.map(entry => `${entry.questionUid}\u0000${entry.axis}`));
  const reusable = allPairs.filter(pair => !affectedKeys.has(`${pair.questionUid}\u0000${pair.axis}`) && previousAxisInputShas[pair.questionUid]?.[pair.axis] && previousAxisInputShas[pair.questionUid]?.[pair.axis] === currentAxisInputShas[pair.questionUid]?.[pair.axis]);
  const payload = { semanticDiffSha: diff.semanticDiffSha, affectedUidAxisSet, reusableUidAxisSet: reusable, globalInvalidatorSet: diff.globalInvalidatorSet || [] };
  return { schemaVersion: CHANGE_IMPACT_VERSION, ...payload, affectedUidSet: [...new Set(affectedUidAxisSet.map(entry => entry.questionUid))].sort(), affectedUidAxisSetSha: objectSha(affectedUidAxisSet), changeImpactSha: objectSha(payload) };
}

export function computeAxisInputShaMap(questions, context = {}) {
  return Object.fromEntries(listQuestions(questions).map(question => {
    const uid = uidOf(question);
    return [uid, Object.fromEntries(Object.keys(AXIS_INPUT_PROJECTION_MAP).map(axis => [axis, axisInputSha({ ...question, questionUid: uid }, axis, context)]))];
  }));
}

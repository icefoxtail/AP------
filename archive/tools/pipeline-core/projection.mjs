import { isObject, objectSha } from './canonical.mjs';

export const QUESTION_FIELD_GROUPS = Object.freeze([
  'SOURCE_STEM', 'CHOICES', 'ANSWER', 'SOLUTION', 'PROBLEM_ASSETS',
  'SOLUTION_ASSETS', 'METADATA_TAGS', 'SCORE_LAYOUT', 'SHARED_DEPENDENCIES'
]);

export const AXIS_INPUT_PROJECTION_MAP = Object.freeze({
  SOURCE: ['SOURCE_AUTHORITY', 'SOURCE_STEM', 'CHOICES', 'PROBLEM_ASSETS'],
  MATH_A1: ['SOURCE_STEM', 'CHOICES', 'PROBLEM_ASSETS', 'SHARED_DEPENDENCIES'],
  MATH_A2: ['A1_FROZEN', 'SOURCE_STEM', 'CHOICES', 'ANSWER'],
  SOLUTION: ['SOURCE_STEM', 'ANSWER', 'SOLUTION', 'SOLUTION_ASSETS', 'SHARED_DEPENDENCIES'],
  METADATA: ['METADATA_TAGS', 'SCORE_LAYOUT', 'SHARED_DEPENDENCIES'],
  STATIC: QUESTION_FIELD_GROUPS,
  V1: ['SOURCE_STEM', 'PROBLEM_ASSETS', 'SHARED_DEPENDENCIES'],
  V2: ['PROBLEM_ASSETS', 'SOLUTION_ASSETS', 'SHARED_DEPENDENCIES'],
  V3: ['A1_FROZEN', 'V1_FROZEN', 'V2_FROZEN', 'ANSWER', 'SOLUTION', 'METADATA_TAGS'],
  RENDER_CAPTURE: [...QUESTION_FIELD_GROUPS, 'RENDER_POLICY', 'RUNTIME'],
  RENDER_REVIEW: [...QUESTION_FIELD_GROUPS, 'RENDER_POLICY', 'RUNTIME']
});

export const AXIS_ALIASES = Object.freeze({ source: 'SOURCE', math: 'MATH_A1', a1: 'MATH_A1', a2: 'MATH_A2', solution: 'SOLUTION', metadata: 'METADATA', static: 'STATIC', v1: 'V1', v2: 'V2', v3: 'V3', 'render-capture': 'RENDER_CAPTURE', render: 'RENDER_REVIEW' });
export const CANONICAL_AXES = Object.freeze(Object.keys(AXIS_INPUT_PROJECTION_MAP));

export function requiredAxesForQuestion(policy, question, run = {}) {
  if (!policy) throw new Error('PIPELINE_PROFILE_REQUIRED');
  const axes = policy.axes.map(axisName);
  if (policy.scope === 'QUESTION_QUALITY') axes.push('MATH_A2', 'STATIC');
  if (policy.visual) {
    axes.push('V1', 'V3');
    if (question.visual?.actualSolutionVisualAttached || question.visual?.problemVisualMathDependency || question.visual?.sharedVisualMathDependency || question.visual?.requirement === 'VISUAL_REQUIRED') axes.push('V2');
  }
  if (policy.modes.length || run.publicationIntent === 'FULL_EXAM') axes.push('RENDER_CAPTURE', 'RENDER_REVIEW');
  return [...new Set(axes)].sort();
}

const valueOrNull = value => value === undefined ? null : value;
const normalizeRefs = refs => (Array.isArray(refs) ? refs : []).map(ref => ({ path: ref.path || null, bytes: valueOrNull(ref.bytes), sha256: valueOrNull(ref.sha256), role: valueOrNull(ref.role) })).sort((a, b) => `${a.role}:${a.path}`.localeCompare(`${b.role}:${b.path}`));

function fieldGroups(question, dependencies = {}) {
  const metadata = question?.metadata && isObject(question.metadata) ? question.metadata : {};
  return {
    SOURCE_STEM: { content: valueOrNull(question?.content), sourceStem: valueOrNull(question?.sourceStem), sourceExamId: valueOrNull(question?.sourceExamId) },
    CHOICES: valueOrNull(question?.choices || []),
    ANSWER: { answer: valueOrNull(question?.answer), answerType: valueOrNull(question?.answerType) },
    SOLUTION: { solution: valueOrNull(question?.solution), solutionText: valueOrNull(question?.solutionText) },
    PROBLEM_ASSETS: { image: valueOrNull(question?.image), imageAlt: valueOrNull(question?.imageAlt), paths: normalizeRefs(question?.problemAssetRefs || dependencies.problemAssets || question?.problemAssetPaths?.map(path => ({ path })) || []) },
    SOLUTION_ASSETS: { solutionImage: valueOrNull(question?.solutionImage), solutionImageAlt: valueOrNull(question?.solutionImageAlt), solutionImageCaption: valueOrNull(question?.solutionImageCaption), paths: normalizeRefs(question?.solutionAssetRefs || dependencies.solutionAssets || question?.solutionAssetPaths?.map(path => ({ path })) || []) },
    METADATA_TAGS: { ...Object.fromEntries(Object.entries(question || {}).filter(([key]) => !['questionUid', 'content', 'choices', 'answer', 'solution', 'image', 'solutionImage', 'sourceStem', 'problemAssetRefs', 'solutionAssetRefs'].includes(key))), metadata },
    SCORE_LAYOUT: { score: valueOrNull(question?.score), layoutTag: valueOrNull(question?.layoutTag), wide: valueOrNull(question?.wide), layout: valueOrNull(question?.layout) },
    SHARED_DEPENDENCIES: normalizeRefs(dependencies.shared || question?.sharedDependencies || [])
  };
}

export function questionFieldHashMap(question, dependencies = {}) {
  const fields = fieldGroups(question, dependencies);
  return {
    schemaVersion: 'APMATH_QUESTION_FIELD_HASH_MAP_v1',
    questionUid: question?.questionUid || null,
    fields: Object.fromEntries(QUESTION_FIELD_GROUPS.map(group => [group, { value: fields[group], sha256: objectSha(fields[group]) }])),
    fieldShaMap: Object.fromEntries(QUESTION_FIELD_GROUPS.map(group => [group, objectSha(fields[group])])),
    dependencySetSha: objectSha(fields.SHARED_DEPENDENCIES)
  };
}

function projectionValue(group, hashes, context) {
  if (group.endsWith('_FROZEN')) return valueOrNull(context.frozen?.[group.slice(0, -7)] || context.frozen?.[group]);
  if (group === 'RENDER_POLICY') return valueOrNull(context.renderPolicy);
  if (group === 'RUNTIME') return valueOrNull(context.runtime);
  if (group === 'SOURCE_AUTHORITY') return valueOrNull(context.sourceAuthority);
  return hashes[group]?.value ?? null;
}

export function axisName(axis) {
  const normalized = String(axis || '').trim();
  return AXIS_ALIASES[normalized.toLowerCase()] || normalized.toUpperCase();
}

export function axisInputProjection(question, axis, context = {}) {
  const canonicalAxis = axisName(axis);
  const map = AXIS_INPUT_PROJECTION_MAP[canonicalAxis];
  if (!map) throw new Error(`AXIS_INPUT_PROJECTION_UNSUPPORTED:${axis}`);
  const hashes = questionFieldHashMap(question, context.dependencies || {});
  const input = Object.fromEntries(map.map(group => [group, projectionValue(group, hashes.fields, context)]));
  return { schemaVersion: 'APMATH_AXIS_INPUT_v2', questionUid: question?.questionUid || null, axis: canonicalAxis, projectionVersion: 'APMATH_AXIS_INPUT_PROJECTION_v2', projectedInputs: input, dependencySetSha: context.dependencySetSha ?? objectSha(context.dependencies || {}), ruleDependencySetSha: context.ruleDependencySetSha ?? null, verifierDependencySetSha: context.verifierDependencySetSha ?? null, sourceAuthoritySliceSha: context.sourceAuthoritySliceSha ?? null };
}

export function axisInputSha(question, axis, context = {}) {
  return objectSha(axisInputProjection(question, axis, context));
}

export function allAxisInputShas(question, context = {}) {
  return Object.fromEntries(Object.keys(AXIS_INPUT_PROJECTION_MAP).map(axis => [axis, axisInputSha(question, axis, context)]));
}

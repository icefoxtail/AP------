import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(here, '../../..');
const text = value => String(value ?? '').trim();
const digest = bytes => {
  const normalized = Buffer.from(Buffer.from(bytes).toString('utf8').replaceAll('\r\n', '\n'), 'utf8');
  return `sha256:${crypto.createHash('sha256').update(normalized).digest('hex')}`;
};
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));

export const DIFFICULTY_BUCKETS = Object.freeze([1, 2, 3, 4, 5, 'UNKNOWN']);
export const DIFFICULTY_CONFIDENCE = Object.freeze(['high', 'medium', 'low', 'UNKNOWN']);
export const DIFFICULTY_BOUNDARY_FLAGS = Object.freeze(['NONE', 'B12', 'B23', 'B34', 'B45', 'UNKNOWN']);
export const LEGACY_LEVEL_COMPATIBILITY = Object.freeze(['NORMAL', 'BORDERLINE_REVIEW', 'BORDERLINE_ACCEPTABLE', 'STRONG_CONFLICT', 'UNKNOWN']);

const META_PATHS = Object.freeze({
  index: 'archive/data/meta-foundation/canonical/registry_index.json',
  rules: 'archive/data/meta-foundation/canonical/metadata_rules.json',
  conditionsCanonical: 'archive/data/meta-foundation/canonical/condition_registry.json',
  taxonomy: 'archive/data/meta-foundation/compiled/taxonomy_registry.json',
  concepts: 'archive/data/meta-foundation/compiled/concept_registry.json',
  conditions: 'archive/data/meta-foundation/compiled/condition_registry.json',
  bindings: 'archive/data/meta-foundation/compiled/curriculum_bindings.json',
});

function keyMap(rows, keyField) {
  const map = new Map();
  const duplicate = new Set();
  for (const row of rows || []) {
    const key = text(row?.[keyField]);
    if (!key) continue;
    if (map.has(key)) duplicate.add(key);
    else map.set(key, row);
  }
  return { map, duplicate };
}

function bindingKey(row) {
  return [text(row?.curriculum), text(row?.standardUnitKey), row?.subUnitKey == null ? '<DIRECT>' : text(row.subUnitKey), text(row?.problemTypeKey)].join('\0');
}

export function loadActiveMetaRegistry(repoRoot = defaultRoot) {
  const root = path.resolve(repoRoot);
  const errors = [];
  const parsed = {};
  for (const [name, relative] of Object.entries(META_PATHS)) {
    const file = path.join(root, relative);
    if (!fs.existsSync(file)) {
      errors.push(`META_REGISTRY_FILE_MISSING:${relative}`);
      continue;
    }
    try { parsed[name] = readJson(file); }
    catch { errors.push(`META_REGISTRY_JSON_INVALID:${relative}`); }
  }
  const index = parsed.index;
  if (index?.status !== 'ACTIVE') errors.push('META_REGISTRY_INDEX_NOT_ACTIVE');
  if (parsed.rules?.status !== 'ACTIVE') errors.push('META_METADATA_RULES_NOT_ACTIVE');
  if (parsed.conditionsCanonical?.status !== 'ACTIVE') errors.push('META_CONDITION_REGISTRY_NOT_ACTIVE');
  const indexedCanonicalPaths = new Set((index?.canonicalSources || []).map(row => row.path));
  const indexedCompiledPaths = new Set((index?.compiledArtifacts || []).map(row => row.path));
  for (const relative of ['archive/data/meta-foundation/canonical/metadata_rules.json', 'archive/data/meta-foundation/canonical/condition_registry.json']) {
    if (!indexedCanonicalPaths.has(relative)) errors.push(`META_CANONICAL_SOURCE_NOT_INDEXED:${relative}`);
  }
  for (const relative of [META_PATHS.taxonomy, META_PATHS.concepts, META_PATHS.conditions, META_PATHS.bindings]) {
    if (!indexedCompiledPaths.has(relative)) errors.push(`META_COMPILED_ARTIFACT_NOT_INDEXED:${relative}`);
  }
  for (const source of index?.canonicalSources || []) {
    const file = path.join(root, String(source.path || ''));
    if (!file.startsWith(path.join(root, 'archive', 'data', 'meta-foundation', 'canonical') + path.sep)) {
      errors.push(`META_CANONICAL_PATH_INVALID:${source.path}`);
      continue;
    }
    if (!fs.existsSync(file) || digest(fs.readFileSync(file)) !== `sha256:${String(source.sha256 || '').replace(/^sha256:/, '')}`) errors.push(`META_CANONICAL_SOURCE_STALE:${source.path}`);
  }
  for (const artifact of index?.compiledArtifacts || []) {
    const file = path.join(root, String(artifact.path || ''));
    if (!file.startsWith(path.join(root, 'archive', 'data', 'meta-foundation', 'compiled') + path.sep)) {
      errors.push(`META_COMPILED_PATH_INVALID:${artifact.path}`);
      continue;
    }
    if (!fs.existsSync(file)) {
      errors.push(`META_COMPILED_FILE_MISSING:${artifact.path}`);
      continue;
    }
    if (digest(fs.readFileSync(file)) !== `sha256:${String(artifact.sha256 || '').replace(/^sha256:/, '')}`) errors.push(`META_COMPILED_STALE:${artifact.path}`);
  }
  const taxonomy = parsed.taxonomy || {};
  const concepts = parsed.concepts || {};
  const conditions = parsed.conditions || {};
  const bindings = parsed.bindings || {};
  if ([taxonomy.status, concepts.status, conditions.status, bindings.status].some(status => status !== 'DERIVED_READ_ONLY')) errors.push('META_COMPILED_REGISTRY_NOT_ACTIVE');
  const problemTypes = keyMap(taxonomy.problemTypes, 'problemTypeKey');
  const templates = keyMap(taxonomy.templates, 'templateKey');
  const conceptRows = keyMap(concepts.concepts, 'conceptKey');
  const conditionRows = keyMap(conditions.conditions, 'conditionKey');
  for (const [kind, duplicate] of [['PROBLEM_TYPE', problemTypes.duplicate], ['TEMPLATE', templates.duplicate], ['CROSS_CONCEPT', conceptRows.duplicate], ['CONDITION', conditionRows.duplicate]]) {
    for (const key of duplicate) errors.push(`META_REGISTRY_DUPLICATE:${kind}:${key}`);
  }
  const activeBindings = new Set((bindings.bindings || []).filter(row => row?.status === 'ACTIVE').map(bindingKey));
  return {
    status: errors.length ? 'UNAVAILABLE' : 'ACTIVE',
    errors: [...new Set(errors)],
    root,
    paths: META_PATHS,
    files: parsed,
    problemTypes: problemTypes.map,
    templates: templates.map,
    concepts: conceptRows.map,
    conditions: conditionRows.map,
    bindings: activeBindings,
    integrationPatterns: new Set(parsed.rules?.integrationPatterns || []),
  };
}

export function curriculumForQuestion(question) {
  const unitKey = text(question?.standardUnitKey);
  const family = unitKey.match(/^(H15|H22)-/i)?.[1]?.toUpperCase();
  if (family) return family === 'H15' ? '2015' : '2022';
  if (/^M[123]-/.test(unitKey)) {
    const explicit = text(question?.curriculum || question?.curriculumKey);
    if (['2015', '2022'].includes(explicit)) return explicit;
    const id = text(question?.examId || question?.sourceArchiveFile);
    const yearMatch = id.match(/(?:^|[^0-9])(\d{2}|\d{4})[_-]/);
    const grade = Number(unitKey.match(/^M([123])-/)?.[1] || 0);
    if (yearMatch && grade) {
      const rawYear = Number(yearMatch[1]);
      const year = yearMatch[1].length === 2 ? 2000 + rawYear : rawYear;
      return year - grade + 1 >= 2025 ? '2022' : '2015';
    }
  }
  return '';
}

export function validateActiveMetaFields(question, registry, { requireFields = false } = {}) {
  const errors = [];
  const problemTypeKey = text(question?.problemTypeKey);
  const templateKey = text(question?.templateKey);
  const crossConceptKeys = question?.crossConceptKeys;
  const conditionKeys = question?.conditionKeys;
  const integrationPattern = text(question?.integrationPattern);
  const curriculum = curriculumForQuestion(question);
  const standardUnitKey = text(question?.standardUnitKey);
  const subUnitKey = text(question?.subUnitKey);
  const metaPopulated = Boolean(problemTypeKey || templateKey || (Array.isArray(crossConceptKeys) && crossConceptKeys.length) || (Array.isArray(conditionKeys) && conditionKeys.length)
    || (question?.difficultyBucket !== undefined && question?.difficultyBucket !== 'UNKNOWN')
    || (question?.difficultyConfidence !== undefined && question?.difficultyConfidence !== 'UNKNOWN')
    || (question?.difficultyBoundaryFlag !== undefined && question?.difficultyBoundaryFlag !== 'UNKNOWN')
    || (question?.legacyLevelCompatibility !== undefined && question?.legacyLevelCompatibility !== 'UNKNOWN'));
  const required = ['problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility'];
  if (requireFields) for (const key of required) if (!Object.hasOwn(question || {}, key)) errors.push(`ADVANCED_META_FIELD_MISSING:${key}`);
  for (const key of ['problemTypeKey', 'templateKey', 'integrationPattern', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility']) {
    if (question?.[key] !== undefined && typeof question[key] !== 'string') errors.push(`ADVANCED_META_FIELD_TYPE_INVALID:${key}`);
  }
  if (crossConceptKeys !== undefined && !Array.isArray(crossConceptKeys)) errors.push('CROSS_CONCEPT_ARRAY_REQUIRED');
  if (conditionKeys !== undefined && !Array.isArray(conditionKeys)) errors.push('CONDITION_ARRAY_REQUIRED');
  if (registry?.status !== 'ACTIVE') {
    if (metaPopulated) errors.push('ACTIVE_META_REGISTRY_UNAVAILABLE_WITH_KEYS');
  } else {
    if (problemTypeKey) {
      const row = registry.problemTypes.get(problemTypeKey);
      if (!row || row.status !== 'ACTIVE') errors.push('ADVANCED_META_PROBLEM_TYPE_INVALID');
      else if (!curriculum || !standardUnitKey || !registry.bindings.has(bindingKey({ curriculum, standardUnitKey, subUnitKey: subUnitKey || null, problemTypeKey }))) errors.push('ADVANCED_META_CURRICULUM_BINDING_INVALID');
    }
    if (templateKey) {
      const row = registry.templates.get(templateKey);
      if (!row || row.status !== 'ACTIVE') errors.push('ADVANCED_META_TEMPLATE_INVALID');
      else if (!problemTypeKey || row.parentProblemTypeKey !== problemTypeKey) errors.push('ADVANCED_META_TEMPLATE_PARENT_MISMATCH');
    }
    if (!problemTypeKey && templateKey) errors.push('ADVANCED_META_TEMPLATE_WITHOUT_PROBLEM_TYPE');
    if (Array.isArray(crossConceptKeys)) {
      if (new Set(crossConceptKeys).size !== crossConceptKeys.length) errors.push('ADVANCED_META_CROSS_CONCEPT_DUPLICATE');
      for (const key of crossConceptKeys) {
        if (typeof key !== 'string' || !key.trim() || !registry.concepts.has(key) || registry.concepts.get(key)?.status !== 'ACTIVE') errors.push(`ADVANCED_META_CROSS_CONCEPT_INVALID:${String(key)}`);
        if (key === problemTypeKey || key === templateKey) errors.push(`ADVANCED_META_CROSS_CONCEPT_DUPLICATES_PRIMARY:${key}`);
      }
    }
    if (Array.isArray(conditionKeys)) {
      if (new Set(conditionKeys).size !== conditionKeys.length) errors.push('ADVANCED_META_CONDITION_DUPLICATE');
      for (const key of conditionKeys) if (typeof key !== 'string' || !key.trim() || !registry.conditions.has(key) || registry.conditions.get(key)?.status !== 'ACTIVE') errors.push(`ADVANCED_META_CONDITION_INVALID:${String(key)}`);
    }
  }
  if (requireFields && !integrationPattern) errors.push('ADVANCED_META_INTEGRATION_PATTERN_REQUIRED');
  if (integrationPattern && registry?.status === 'ACTIVE' && !registry.integrationPatterns.has(integrationPattern)) errors.push('ADVANCED_META_INTEGRATION_PATTERN_INVALID');
  if (integrationPattern && registry?.status !== 'ACTIVE' && integrationPattern !== 'NONE') errors.push('ACTIVE_META_REGISTRY_UNAVAILABLE_WITH_KEYS');
  if (question?.difficultyBucket !== undefined && !DIFFICULTY_BUCKETS.includes(question.difficultyBucket)) errors.push('ADVANCED_META_DIFFICULTY_BUCKET_INVALID');
  if (question?.difficultyConfidence !== undefined && !DIFFICULTY_CONFIDENCE.includes(question.difficultyConfidence)) errors.push('ADVANCED_META_DIFFICULTY_CONFIDENCE_INVALID');
  if (question?.difficultyBoundaryFlag !== undefined && !DIFFICULTY_BOUNDARY_FLAGS.includes(question.difficultyBoundaryFlag)) errors.push('ADVANCED_META_DIFFICULTY_BOUNDARY_INVALID');
  if (question?.legacyLevelCompatibility !== undefined && !LEGACY_LEVEL_COMPATIBILITY.includes(question.legacyLevelCompatibility)) errors.push('ADVANCED_META_LEGACY_COMPATIBILITY_INVALID');
  const difficultyComplete = Number.isInteger(question?.difficultyBucket) && question.difficultyBucket >= 1 && question.difficultyBucket <= 5
    && ['high', 'medium', 'low'].includes(question?.difficultyConfidence)
    && ['NONE', 'B12', 'B23', 'B34', 'B45'].includes(question?.difficultyBoundaryFlag)
    && ['NORMAL', 'BORDERLINE_ACCEPTABLE', 'STRONG_CONFLICT'].includes(question?.legacyLevelCompatibility);
  const activeBinding = Boolean(problemTypeKey && registry?.status === 'ACTIVE' && curriculum && standardUnitKey
    && registry.bindings.has(bindingKey({ curriculum, standardUnitKey, subUnitKey: subUnitKey || null, problemTypeKey })));
  return {
    status: errors.length ? 'FAIL' : metaPopulated ? 'VALIDATED' : 'UNCLASSIFIED',
    errors: [...new Set(errors)],
    metaPopulated,
    curriculum,
    activeBinding,
    difficultyComplete,
    l3Active: Boolean(problemTypeKey && registry?.problemTypes.get(problemTypeKey)?.status === 'ACTIVE'),
    l4Active: Boolean(templateKey && registry?.templates.get(templateKey)?.status === 'ACTIVE'),
  };
}

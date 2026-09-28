import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { objectSha, fileRef } from '../pipeline-core/canonical.mjs';
import { loadActiveMetaRegistry, validateActiveMetaFields } from './active-registry.mjs';

export const LEGACY_META_RESOLUTION_SCHEMA_V1 = 'JS_ARCHIVE_RPM_ACTIVE_RESOLUTION_v1';
export const META_RESOLUTION_SCHEMA = 'JS_ARCHIVE_RPM_ACTIVE_RESOLUTION_v2';
export const META_DIFFICULTY_SCHEMA = 'JS_ARCHIVE_DIFFICULTY_BLIND_EVIDENCE_v1';
export const R2E_META_INPUT_SCHEMA_V1 = 'JS_ARCHIVE_R2E_META_INPUT_RECEIPT_v1';
export const R2E_META_INPUT_SCHEMA_V2 = 'JS_ARCHIVE_R2E_META_INPUT_RECEIPT_v2';
export const META_LOOKUP_ORDER = Object.freeze([
  'RPM_PRIMARY_README', 'RPM_CANONICAL_MASTER', 'RPM_CURRICULUM_SCOPE_VIEW', 'RPM_SEMANTIC_CLASSIFICATION_FINAL', 'RPM_TO_ACTIVE_CROSSWALK', 'ACTIVE_META_FOUNDATION',
]);
export const DECISION_ISOLATED_INPUT_FIELDS = Object.freeze(['sourceIdentity', 'solutionIdentity', 'curriculumContext', 'semanticDecision']);
export const ADVANCED_META_FIELDS_EXCLUDED_FROM_SEMANTIC_INPUT = Object.freeze([
  'problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern',
  'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility',
]);
export const META_ROUTE_DISPOSITIONS = Object.freeze(['RPM_SEMANTIC_FINAL', 'TRUE_META_HOLD', 'ROUTE_OUT']);
export const META_PROJECTION_STATUSES = Object.freeze(['PROJECTION_REUSE', 'PROJECTION_BINDING_PENDING', 'PROJECTION_UNMATERIALIZED', 'META_ONLY_COMPATIBILITY_PENDING', 'NOT_ATTEMPTED']);
export const DIFFICULTY_BUCKETS = Object.freeze([1, 2, 3, 4, 5]);
export const DIFFICULTY_CONFIDENCE = Object.freeze(['high', 'medium', 'low']);
export const DIFFICULTY_BOUNDARY_FLAGS = Object.freeze(['NONE', 'B12', 'B23', 'B34', 'B45']);
export const LEGACY_LEVEL_COMPATIBILITY = Object.freeze(['NORMAL', 'BORDERLINE_REVIEW', 'BORDERLINE_ACCEPTABLE', 'STRONG_CONFLICT']);

const here = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(here, '../../..');
const text = value => typeof value === 'string' ? value.trim() : '';
const equal = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const equalCountSummary = (actual, expected) => Boolean(actual && typeof actual === 'object' && !Array.isArray(actual)
  && Object.keys(actual).length === Object.keys(expected).length
  && Object.entries(expected).every(([key, count]) => Number(actual[key]) === count));
const comparableMetaProjectionValue = (field, value) => {
  if (field === 'problemTypeKey' || field === 'templateKey') return text(value) || null;
  if (field === 'crossConceptKeys' || field === 'conditionKeys') return Array.isArray(value) ? value : [];
  if (field === 'integrationPattern') return text(value) || 'NONE';
  return value ?? null;
};
const DIFFICULTY_PROJECTION_FIELDS = Object.freeze(['difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility']);
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const pathRef = (root, rel) => fileRef(root, rel);
const rpmBase = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0';
const crosswalkBase = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0';

export function makeR2ESourceMetaProjection(question) {
  return Object.fromEntries(ADVANCED_META_FIELDS_EXCLUDED_FROM_SEMANTIC_INPUT
    .map(field => [field, comparableMetaProjectionValue(field, question?.[field])]));
}

const BANNED_DECISION_KEY = /candidate|heuristic|previous.?verdict|reviewer.?verdict|problemTypeKey|templateKey|crossConcept|conditionKey|difficultyBucket|legacyLevel|activeMapping/i;
const ALLOWED_TOP_LEVEL = new Set(['sourceIdentity', 'solutionIdentity', 'curriculumContext', 'semanticDecision', 'familyTemplateSelection', 'activeSearchEvidence']);

function requireString(value, code) {
  if (!text(value)) throw new Error(code);
  return text(value);
}

function normalizeGrade(value) {
  const v = text(value).toUpperCase().replaceAll(' ', '').replace('중', 'M').replace('고', 'H');
  const match = v.match(/^(M|H)([123])$/);
  return match ? `${match[1]}${match[2]}` : '';
}

function levelForGrade(grade) { return grade.startsWith('M') ? 'MIDDLE' : grade.startsWith('H') ? 'HIGH' : ''; }

function subjectFamilyFor(scope, explicit) {
  const s = text(scope).replaceAll(' ', '');
  let derived = '';
  if (['수학I', '대수', '공통수학1', '공통수학Ⅰ', 'ALGEBRA', 'MATH1'].includes(s)) derived = 'MATH1_ALGEBRA';
  else if (['수학II', '미적분I', '공통수학2', '공통수학Ⅱ', 'MATH2', 'CALCULUS1'].includes(s)) derived = 'MATH2_CALCULUS1';
  else if (['미적분', '미적분II', 'CALCULUS', 'CALCULUS2'].includes(s)) derived = 'CALCULUS_CALCULUS2';
  else if (['확률과통계', 'PROBABILITYSTATISTICS', 'STATISTICS'].includes(s)) derived = 'PROBABILITY_STATISTICS';
  else if (['기하', 'GEOMETRY'].includes(s)) derived = 'GEOMETRY';
  const given = text(explicit).toUpperCase().replaceAll(/[^A-Z0-9]/g, '');
  return given && derived && given !== derived ? '' : given || derived;
}

function crosswalkPathFor(context) {
  const grade = normalizeGrade(context.grade);
  if (!grade) return '';
  if (grade.startsWith('M')) return `${crosswalkBase}/middle${grade.slice(1)}.json`;
  if (grade === 'H1') return `${crosswalkBase}/high1.json`;
  if (grade !== 'H2') return '';
  const family = subjectFamilyFor(context.scope, context.subjectFamily);
  const fileByFamily = {
    MATH1_ALGEBRA: 'high2-math1-algebra.json',
    MATH2_CALCULUS1: 'high2-math2-calculus1.json',
    CALCULUS_CALCULUS2: 'high2-calculus-calculus2.json',
    PROBABILITY_STATISTICS: 'high2-probability-statistics.json',
    GEOMETRY: 'high2-geometry.json',
  };
  return fileByFamily[family] ? `${crosswalkBase}/${fileByFamily[family]}` : '';
}

function viewPathFor(context, rpmPath) {
  const grade = normalizeGrade(context.grade);
  const band = levelForGrade(grade);
  const year = context.curriculum === '2015' ? '01_2015' : context.curriculum === '2022' ? '02_2022' : '';
  if (!band || !year || !text(rpmPath.scope)) return '';
  return `${rpmBase}/${year}/${band}/${rpmPath.scope}.md`;
}

function canonicalSourceFingerprint(source) {
  return objectSha({
    sourceArchiveFile: text(source.sourceArchiveFile),
    sourceIdentityKey: text(source.sourceIdentityKey || source.questionUid),
    sourceOrdinal: Number(source.sourceOrdinal),
    contentHash: text(source.contentHash),
    choicesHash: text(source.choicesHash),
    imageRefHash: text(source.imageRefHash),
  });
}

export function questionUidForSource(sourceArchiveFile, sourceOrdinal) {
  const normalized = text(sourceArchiveFile).normalize('NFC').replaceAll('\\', '/').replace(/^archive\/exams\//, '');
  const ordinal = Number(sourceOrdinal);
  if (!normalized || !Number.isInteger(ordinal) || ordinal < 1 || normalized.split('/').includes('..')) throw new Error('META_CANONICAL_SOURCE_UID_INPUT_INVALID');
  return `qid_v1_${crypto.createHash('sha256').update(`${normalized}#${ordinal}`).digest('hex')}`;
}

function containsBannedKey(value, pathPart = '$') {
  if (Array.isArray(value)) return value.flatMap((item, index) => containsBannedKey(item, `${pathPart}[${index}]`));
  if (!value || typeof value !== 'object') return [];
  const found = [];
  for (const [key, child] of Object.entries(value)) {
    if (BANNED_DECISION_KEY.test(key)) found.push(`${pathPart}.${key}`);
    found.push(...containsBannedKey(child, `${pathPart}.${key}`));
  }
  return found;
}

function assertAllowedKeys(value, allowed, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label}_OBJECT_REQUIRED`);
  const extra = Object.keys(value).filter(key => !allowed.has(key));
  if (extra.length) {
    if (extra.some(key => BANNED_DECISION_KEY.test(key))) throw new Error(`FORBIDDEN_CANDIDATE_INPUT:${label}.${extra.join(',')}`);
    throw new Error(`${label}_FIELD_NOT_ALLOWED:${extra.join(',')}`);
  }
}

export function buildDecisionIsolatedInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('META_INPUT_OBJECT_REQUIRED');
  const extra = Object.keys(input).filter(key => !ALLOWED_TOP_LEVEL.has(key));
  if (extra.length) {
    if (extra.some(key => BANNED_DECISION_KEY.test(key))) throw new Error(`FORBIDDEN_CANDIDATE_INPUT:${extra.join(',')}`);
    throw new Error(`META_INPUT_FIELD_NOT_ALLOWED:${extra.join(',')}`);
  }
  const source = input.sourceIdentity || {};
  const solution = input.solutionIdentity || {};
  const context = input.curriculumContext || {};
  const decision = input.semanticDecision || {};
  assertAllowedKeys(source, new Set(['sourceArchiveFile', 'questionUid', 'sourceIdentityKey', 'sourceOrdinal', 'contentHash', 'choicesHash', 'imageRefHash', 'sourceIdentityFingerprint', 'sourceFingerprint']), 'META_SOURCE_IDENTITY');
  assertAllowedKeys(solution, new Set(['status', 'independentVerification', 'solutionHash']), 'META_SOLUTION_IDENTITY');
  assertAllowedKeys(context, new Set(['grade', 'curriculum', 'scope', 'subjectFamily', 'standardCourse', 'standardUnitKey', 'subUnitKey']), 'META_CURRICULUM_CONTEXT');
  assertAllowedKeys(decision, new Set(['primaryMethod', 'decisiveStep', 'rpmPath']), 'META_SEMANTIC_DECISION');
  if (decision.rpmPath) assertAllowedKeys(decision.rpmPath, new Set(['curriculum', 'scope', 'majorUnit', 'midUnit', 'l3', 'l4']), 'META_RPM_PATH');
  if (input.familyTemplateSelection) assertAllowedKeys(input.familyTemplateSelection, new Set(['stage', 'inputBundleSha', 'crosswalkRecordId', 'templateKey', 'decisiveStepReason']), 'META_FAMILY_SELECTION');
  if (input.activeSearchEvidence) assertAllowedKeys(input.activeSearchEvidence, new Set(['status', 'searchedGlobalActive', 'candidateKeys', 'registrySha', 'searchMethod', 'searchedScope']), 'META_ACTIVE_SEARCH_EVIDENCE');
  const leakage = containsBannedKey(decision);
  if (leakage.length) throw new Error(`FORBIDDEN_CANDIDATE_INPUT:${leakage.join(',')}`);
  const questionUid = requireString(source.questionUid || source.sourceIdentityKey, 'META_SOURCE_UID_REQUIRED');
  const sourceIdentityKey = requireString(source.sourceIdentityKey || source.questionUid, 'META_SOURCE_IDENTITY_KEY_REQUIRED');
  const sourceArchiveFile = requireString(source.sourceArchiveFile, 'META_SOURCE_FILE_REQUIRED');
  const sourceOrdinal = Number(source.sourceOrdinal);
  if (!Number.isInteger(sourceOrdinal) || sourceOrdinal < 1) throw new Error('META_SOURCE_ORDINAL_INVALID');
  for (const field of ['contentHash', 'choicesHash', 'imageRefHash']) requireString(source[field], `META_SOURCE_${field.toUpperCase()}_REQUIRED`);
  const sourceFingerprint = canonicalSourceFingerprint({ ...source, questionUid, sourceIdentityKey });
  const suppliedFingerprint = text(source.sourceIdentityFingerprint || source.sourceFingerprint);
  if (suppliedFingerprint && suppliedFingerprint !== sourceFingerprint) throw new Error('META_SOURCE_FINGERPRINT_MISMATCH');
  const solutionHash = requireString(solution.solutionHash, 'META_VERIFIED_SOLUTION_HASH_REQUIRED');
  if (solution.status !== 'VERIFIED_FINAL' || solution.independentVerification !== true) throw new Error('META_VERIFIED_FINAL_SOLUTION_REQUIRED');
  const grade = normalizeGrade(context.grade);
  const curriculum = requireString(context.curriculum, 'META_CURRICULUM_REQUIRED');
  if (!['2015', '2022'].includes(curriculum) || !grade) throw new Error('META_GRADE_CURRICULUM_INVALID');
  const standardUnitKey = requireString(context.standardUnitKey, 'META_STANDARD_UNIT_REQUIRED');
  const scope = requireString(context.scope, 'META_RPM_SCOPE_REQUIRED');
  const subUnitKey = text(context.subUnitKey);
  const standardCourse = text(context.standardCourse);
  const subjectFamily = text(context.subjectFamily);
  const primaryMethod = requireString(decision.primaryMethod, 'META_PRIMARY_METHOD_REQUIRED');
  const decisiveStep = requireString(decision.decisiveStep, 'META_DECISIVE_STEP_REQUIRED');
  const rpmPathInput = decision.rpmPath || {};
  const rpmPath = {
    curriculum: requireString(rpmPathInput.curriculum || curriculum, 'META_RPM_CURRICULUM_REQUIRED'),
    scope: requireString(rpmPathInput.scope || scope, 'META_RPM_SCOPE_REQUIRED'),
    majorUnit: text(rpmPathInput.majorUnit),
    midUnit: text(rpmPathInput.midUnit),
    l3: text(rpmPathInput.l3),
    l4: text(rpmPathInput.l4),
  };
  if (rpmPath.curriculum !== curriculum || rpmPath.scope !== scope) throw new Error('META_RPM_CONTEXT_MISMATCH');
  const bundle = {
    sourceIdentity: {
      sourceArchiveFile,
      questionUid,
      sourceIdentityKey,
      sourceOrdinal,
      contentHash: text(source.contentHash),
      choicesHash: text(source.choicesHash),
      imageRefHash: text(source.imageRefHash),
      sourceFingerprint,
    },
    solutionIdentity: { status: 'VERIFIED_FINAL', solutionHash, independentVerification: true },
    curriculumContext: { grade, curriculum, scope, subjectFamily, standardCourse, standardUnitKey, subUnitKey },
    semanticDecision: { primaryMethod, decisiveStep, rpmPath },
  };
  return { bundle, sourceFingerprint, inputBundleSha: objectSha(bundle) };
}

function findRpmRecords(master, rpmPath) {
  if (![rpmPath.curriculum, rpmPath.scope, rpmPath.majorUnit, rpmPath.midUnit, rpmPath.l3, rpmPath.l4].every(Boolean)) return [];
  const records = (master.records || []).filter(row => row.curriculum === rpmPath.curriculum && row.scope === rpmPath.scope
    && row.majorUnit === rpmPath.majorUnit && row.midUnit === rpmPath.midUnit);
  const hits = [];
  for (const row of records) for (const concept of row.concepts || []) {
    if (concept.concept !== rpmPath.l3) continue;
    for (const item of concept.problemTypes || []) if (item.problemType === rpmPath.l4) hits.push({ row, concept, item });
  }
  return hits;
}

function crosswalkMatch(file, context, rpmPath) {
  const doc = readJson(file);
  const rows = (doc.records || []).filter(row => row.curriculum === context.curriculum && row.scope === context.scope
    && row.standardUnitKey === context.standardUnitKey && equal(row.rpmPath, {
      majorUnit: rpmPath.majorUnit, midUnit: rpmPath.midUnit, l3: rpmPath.l3, l4: rpmPath.l4,
    }));
  if (!rows.length) return { doc, row: null, duplicate: false };
  if (rows.length > 1) return { doc, row: null, duplicate: true };
  const row = rows[0];
  if (row.subUnitKey != null && row.subUnitKey !== context.subUnitKey) return { doc, row: null, duplicate: false, l2Mismatch: true };
  if (row.standardCourse && context.standardCourse && row.standardCourse !== context.standardCourse) return { doc, row: null, duplicate: false, standardCourseMismatch: true };
  return { doc, row, duplicate: false };
}

export function activeCandidateKeysForScope(registry, { curriculum, standardUnitKey, subUnitKey = '' } = {}) {
  const candidates = new Set();
  for (const binding of registry?.bindingRows || []) {
    if (binding.status !== 'ACTIVE' || binding.curriculum !== curriculum
      || binding.standardUnitKey !== standardUnitKey || (binding.subUnitKey ?? '') !== (subUnitKey ?? '')) continue;
    const pt = registry.problemTypes.get(binding.problemTypeKey);
    const bindingPack = registry.activePacks.get(binding.ownerPack);
    if (pt?.status !== 'ACTIVE' || !registry.activePacks.has(pt.ownerPack) || !bindingPack) continue;
    candidates.add(binding.problemTypeKey);
    for (const tpl of registry.templates.values()) {
      if (tpl.status === 'ACTIVE' && tpl.parentProblemTypeKey === binding.problemTypeKey
        && registry.activePacks.has(tpl.ownerPack)) candidates.add(tpl.templateKey);
    }
  }
  return [...candidates].sort();
}

function bindingIdentity(binding) {
  if (!binding) return '';
  return [binding.curriculum, binding.standardUnitKey, binding.subUnitKey ?? '<DIRECT>', binding.problemTypeKey, binding.ownerPack].join('|');
}

function semanticRecord(fields) {
  const { bundle, rpmHit, refs = [], ...rest } = fields;
  const rpmPath = bundle.semanticDecision.rpmPath;
  const semantic = {
    status: 'FINAL',
    authorityVersion: 'RPM_PRIMARY_TAXONOMY_v1.0',
    curriculum: rpmPath.curriculum,
    scope: rpmPath.scope,
    majorUnit: rpmPath.majorUnit,
    midUnit: rpmPath.midUnit,
    l3: rpmPath.l3,
    l4: rpmPath.l4,
    primaryMethod: bundle.semanticDecision.primaryMethod,
    decisiveStep: bundle.semanticDecision.decisiveStep,
    sourceFingerprint: rest.sourceFingerprint,
    inputBundleSha: rest.inputBundleSha,
    rpmRecordSha: objectSha(rpmHit),
  };
  const projectionStatus = rest.projectionStatus || 'PROJECTION_UNMATERIALIZED';
  const projection = rest.legacyProjection || { status: projectionStatus };
  return buildEvidence({
    bundle,
    ...rest,
    disposition: 'RPM_SEMANTIC_FINAL',
    semanticStatus: 'FINAL',
    rpmSemantic: semantic,
    projectionStatus,
    legacyProjection: projection,
    advancedMetaEligible: projectionStatus === 'PROJECTION_REUSE',
    refs,
  });
}

function semanticHold(fields) {
  const { bundle, refs = [], sourceFingerprint, inputBundleSha, reasonCode, detail = '' } = fields;
  const rpmPath = bundle.semanticDecision.rpmPath;
  return buildEvidence({
    bundle,
    sourceFingerprint,
    inputBundleSha,
    rpmPath,
    rpmL3: rpmPath.l3,
    rpmL4: rpmPath.l4,
    disposition: 'TRUE_META_HOLD',
    semanticStatus: 'HOLD',
    problemTypeKey: '',
    templateKey: '',
    ownerPack: '',
    bindingOwnerPack: '',
    rpmSemantic: {
      status: 'HOLD',
      authorityVersion: 'RPM_PRIMARY_TAXONOMY_v1.0',
      curriculum: rpmPath.curriculum,
      scope: rpmPath.scope,
      majorUnit: rpmPath.majorUnit,
      midUnit: rpmPath.midUnit,
      l3: rpmPath.l3,
      l4: rpmPath.l4,
      reasonCode,
      detail,
      sourceFingerprint,
      inputBundleSha,
    },
    projectionStatus: 'NOT_ATTEMPTED',
    legacyProjection: { status: 'NOT_ATTEMPTED', reasonCode },
    reasonCode,
    reason: detail || reasonCode,
    refs,
  });
}

function projectionPending(fields, projectionStatus, reasonCode, details = {}) {
  const { bundle, rpmHit, refs = [], ...base } = fields;
  const canonicalOwnerPack = text(details.canonicalOwnerPack || '');
  const bindingOwnerPack = text(details.bindingOwnerPack || '');
  const mappedProblemTypeKey = text(details.problemTypeKey || '');
  const mappedTemplateKeys = (details.mappedTemplateKeys || []).filter(Boolean);
  const reusable = projectionStatus === 'PROJECTION_REUSE';
  return semanticRecord({
    ...base,
    bundle,
    rpmHit,
    refs,
    projectionStatus,
    projectionReasonCode: reasonCode,
    crosswalkFile: details.crosswalkFile || base.crosswalkFile || '',
    crosswalkRecordId: details.crosswalkRecordId || base.crosswalkRecordId || '',
    crosswalkStatus: details.crosswalkStatus || base.crosswalkStatus || '',
    problemTypeKey: reusable ? mappedProblemTypeKey : '',
    templateKey: reusable ? text(details.templateKey || '') : '',
    mappedProblemTypeKey,
    mappedTemplateKeys,
    ownerPack: canonicalOwnerPack,
    ownerVersion: details.ownerVersion || '',
    bindingOwnerPack,
    bindingIdentity: details.bindingIdentity || '',
    legacyProjection: {
      status: projectionStatus,
      reasonCode,
      problemTypeKey: mappedProblemTypeKey,
      templateKey: reusable ? text(details.templateKey || '') : '',
      candidateTemplateKeys: mappedTemplateKeys,
      canonicalOwnerPack,
      bindingOwnerPack,
      bindingIdentity: details.bindingIdentity || '',
    },
  });
}

function exactProjectionBindings(registry, row, context, problemTypeKey) {
  const binding = row.binding || {};
  const curriculum = text(binding.curriculum || context.curriculum);
  const standardUnitKey = text(binding.standardUnitKey || context.standardUnitKey);
  const subUnitKey = Object.hasOwn(binding, 'subUnitKey')
    ? binding.subUnitKey : Object.hasOwn(row, 'subUnitKey') ? row.subUnitKey : context.subUnitKey;
  const standardCourse = text(binding.standardCourse || row.standardCourse || context.standardCourse);
  return (registry.bindingRows || []).filter(item => item.status === 'ACTIVE'
    && item.curriculum === curriculum
    && item.standardUnitKey === standardUnitKey
    && (item.subUnitKey ?? null) === (subUnitKey ?? null)
    && item.problemTypeKey === problemTypeKey
    && (!standardCourse || !item.standardCourse || item.standardCourse === standardCourse));
}

export function validateCanonicalProjectionKeys(candidateMeta, registry) {
  const errors = [];
  const problemTypeKey = text(candidateMeta?.problemTypeKey);
  const templateKey = text(candidateMeta?.templateKey);
  if (!problemTypeKey) {
    if (templateKey) errors.push('ADVANCED_META_TEMPLATE_WITHOUT_PROBLEM_TYPE');
    return { status: errors.length ? 'FAIL' : 'PASS', errors };
  }
  if (registry?.status !== 'ACTIVE') return { status: 'FAIL', errors: ['ACTIVE_META_REGISTRY_UNAVAILABLE_WITH_KEYS'] };
  const problemType = registry.problemTypes.get(problemTypeKey);
  if (!problemType || problemType.status !== 'ACTIVE') errors.push('ADVANCED_META_PROBLEM_TYPE_INVALID');
  const canonicalOwnerPack = text(problemType?.ownerPack);
  if (!canonicalOwnerPack || !registry.activePacks.has(canonicalOwnerPack)) errors.push('ADVANCED_META_CANONICAL_OWNER_INVALID');
  if (templateKey) {
    const template = registry.templates.get(templateKey);
    if (!template || template.status !== 'ACTIVE') errors.push('ADVANCED_META_TEMPLATE_INVALID');
    else if (template.parentProblemTypeKey !== problemTypeKey) errors.push('ADVANCED_META_TEMPLATE_PARENT_MISMATCH');
    else if (!registry.activePacks.has(text(template.ownerPack))) errors.push('ADVANCED_META_TEMPLATE_OWNER_INVALID');
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors };
}

export function resolveMetaRoute(input, { repoRoot = DEFAULT_ROOT, registry: suppliedRegistry } = {}) {
  const root = path.resolve(repoRoot);
  const isolated = buildDecisionIsolatedInput(input);
  const { bundle, sourceFingerprint, inputBundleSha } = isolated;
  const context = bundle.curriculumContext;
  const rpmPath = bundle.semanticDecision.rpmPath;
  const refs = [];
  const readRef = relative => {
    try { const ref = pathRef(root, relative); refs.push(ref); return ref; }
    catch { return null; }
  };
  const rpmReadme = readRef(rpmBase + '/README.md');
  const rpmMasterRef = readRef(rpmBase + '/00_POLICY/CANONICAL_MASTER.json');
  if (!rpmReadme || !rpmMasterRef) {
    return buildEvidence({ bundle, sourceFingerprint, inputBundleSha, refs, rpmPath, disposition: 'ROUTE_OUT',
      semanticStatus: 'UNAVAILABLE', projectionStatus: 'NOT_ATTEMPTED', reasonCode: 'RPM_PRIMARY_AUTHORITY_UNAVAILABLE' });
  }
  const master = readJson(path.join(root, rpmMasterRef.path));
  const rpmHits = findRpmRecords(master, rpmPath);
  if (rpmHits.length === 0) {
    return semanticHold({ bundle, refs, sourceFingerprint, inputBundleSha,
      reasonCode: 'RPM_PRIMARY_PATH_NOT_FOUND', detail: 'The supplied curriculum/scope/L3/L4 tuple is not present in locked RPM Primary.' });
  }
  if (rpmHits.length > 1) {
    return semanticHold({ bundle, refs, sourceFingerprint, inputBundleSha,
      reasonCode: 'RPM_PRIMARY_PATH_AMBIGUOUS', detail: 'The locked RPM Primary tuple matches ' + rpmHits.length + ' rows.' });
  }
  const rpmHit = rpmHits[0];
  const viewPath = viewPathFor(context, rpmPath);
  const viewRef = viewPath ? readRef(viewPath) : null;
  if (!viewRef) {
    return buildEvidence({ bundle, sourceFingerprint, inputBundleSha, refs, rpmPath, rpmL3: rpmPath.l3, rpmL4: rpmPath.l4,
      disposition: 'ROUTE_OUT', semanticStatus: 'UNAVAILABLE', projectionStatus: 'NOT_ATTEMPTED', reasonCode: 'RPM_SCOPE_VIEW_UNAVAILABLE' });
  }
  const viewText = fs.readFileSync(path.join(root, viewRef.path), 'utf8');
  if (!viewText.includes(rpmPath.l3) || !viewText.includes(rpmPath.l4)) {
    return semanticHold({ bundle, refs, sourceFingerprint, inputBundleSha,
      reasonCode: 'RPM_PRIMARY_MASTER_VIEW_CONTRADICTION', detail: 'The locked master and its curriculum/scope view disagree on the supplied path.' });
  }

  const rpmSemanticBase = {
    bundle, rpmHit, refs, sourceFingerprint, inputBundleSha,
    rpmPath, rpmL3: rpmPath.l3, rpmL4: rpmPath.l4,
  };
  const crosswalkPath = crosswalkPathFor(context);
  const crosswalkRef = crosswalkPath ? readRef(crosswalkPath) : null;
  if (crosswalkRef) refs.push({ ...crosswalkRef, role: 'RPM_TO_ACTIVE_COMPATIBILITY_PROJECTION' });
  let activeRegistry;
  try { activeRegistry = suppliedRegistry || loadActiveMetaRegistry(root); }
  catch { return projectionPending(rpmSemanticBase, 'PROJECTION_UNMATERIALIZED', 'ACTIVE_COMPATIBILITY_REGISTRY_UNAVAILABLE'); }
  const activeReferencePaths = activeRegistry.paths ? [
    activeRegistry.paths.index, activeRegistry.paths.rules, activeRegistry.paths.conditionsCanonical,
    activeRegistry.paths.taxonomy, activeRegistry.paths.concepts, activeRegistry.paths.conditions, activeRegistry.paths.bindings,
  ] : [];
  for (const relative of activeReferencePaths) {
    try { refs.push({ ...pathRef(root, relative), role: 'ACTIVE_META_COMPATIBILITY_PROJECTION' }); }
    catch { /* a missing projection source never invalidates RPM semantic classification */ }
  }
  const base = { ...rpmSemanticBase, crosswalkFile: crosswalkRef?.path || '', crosswalkRecordId: '', crosswalkStatus: '' };
  if (!crosswalkRef) return projectionPending(base, 'PROJECTION_UNMATERIALIZED', 'CROSSWALK_COMPATIBILITY_ROUTE_UNAVAILABLE');

  let matched;
  try { matched = crosswalkMatch(path.join(root, crosswalkRef.path), context, rpmPath); }
  catch { return projectionPending(base, 'PROJECTION_UNMATERIALIZED', 'CROSSWALK_COMPATIBILITY_DATA_UNAVAILABLE'); }
  if (matched.duplicate) return projectionPending(base, 'PROJECTION_UNMATERIALIZED', 'CROSSWALK_COMPATIBILITY_ROW_AMBIGUOUS');
  if (matched.standardCourseMismatch) return projectionPending(base, 'PROJECTION_UNMATERIALIZED', 'CROSSWALK_STANDARD_COURSE_PROJECTION_MISMATCH');
  if (matched.l2Mismatch) return projectionPending(base, 'PROJECTION_UNMATERIALIZED', 'CROSSWALK_L2_PROJECTION_MISMATCH');
  const row = matched.row;
  if (!row) return projectionPending(base, 'PROJECTION_UNMATERIALIZED', 'CROSSWALK_PROJECTION_ROW_MISSING');
  const currentBase = { ...base, crosswalkRecordId: row.id || '', crosswalkStatus: row.mappingStatus || '' };
  const mappingStatus = text(row.mappingStatus);
  if (mappingStatus === 'RPM_ONLY' || !['DIRECT_ACTIVE', 'FAMILY_ACTIVE', 'DIRECT_BINDING_GAP', 'FAMILY_BINDING_GAP'].includes(mappingStatus)) {
    return projectionPending(currentBase, 'PROJECTION_UNMATERIALIZED',
      mappingStatus === 'RPM_ONLY' ? 'RPM_ONLY_COMPATIBILITY_PROJECTION' : 'CROSSWALK_PROJECTION_STATUS_UNSUPPORTED');
  }

  const problemTypeKey = text(row.problemTypeKey);
  const mappedTemplateKeys = row.templateKey ? [text(row.templateKey)] : (row.templateCandidates || []).map(item => text(item.templateKey)).filter(Boolean);
  if (!problemTypeKey || activeRegistry.status !== 'ACTIVE') {
    return projectionPending(currentBase, 'PROJECTION_UNMATERIALIZED',
      !problemTypeKey ? 'CROSSWALK_PROBLEM_TYPE_NOT_MAPPED' : 'ACTIVE_COMPATIBILITY_REGISTRY_UNAVAILABLE',
      { problemTypeKey, mappedTemplateKeys });
  }
  const problemType = activeRegistry.problemTypes.get(problemTypeKey);
  if (!problemType || problemType.status !== 'ACTIVE') {
    return projectionPending(currentBase, 'PROJECTION_UNMATERIALIZED', 'ACTIVE_PROBLEM_TYPE_PROJECTION_NOT_MATERIALIZED',
      { problemTypeKey, mappedTemplateKeys });
  }
  const canonicalOwnerPack = text(problemType.ownerPack);
  const canonicalPack = activeRegistry.activePacks.get(canonicalOwnerPack);
  if (!canonicalOwnerPack || !canonicalPack) {
    return projectionPending(currentBase, 'PROJECTION_UNMATERIALIZED', 'ACTIVE_CANONICAL_OWNER_NOT_ACTIVE',
      { problemTypeKey, canonicalOwnerPack, mappedTemplateKeys });
  }

  let templateKey = '';
  if (mappingStatus === 'FAMILY_ACTIVE' || mappingStatus === 'FAMILY_BINDING_GAP') {
    const selection = input.familyTemplateSelection;
    const candidates = new Set(mappedTemplateKeys);
    if (!selection || selection.stage !== 'POST_CROSSWALK' || selection.inputBundleSha !== inputBundleSha
      || selection.crosswalkRecordId !== row.id || !candidates.has(selection.templateKey) || !text(selection.decisiveStepReason)) {
      const existingBindings = exactProjectionBindings(activeRegistry, row, context, problemTypeKey);
      return projectionPending(currentBase, 'META_ONLY_COMPATIBILITY_PENDING', 'FAMILY_TEMPLATE_SELECTION_PENDING',
        { problemTypeKey, canonicalOwnerPack, ownerVersion: canonicalPack.version, mappedTemplateKeys,
          bindingOwnerPack: existingBindings.length === 1 ? text(existingBindings[0].ownerPack) : '' });
    }
    templateKey = selection.templateKey;
  } else {
    templateKey = text(row.templateKey);
    if (!templateKey) return projectionPending(currentBase, 'PROJECTION_UNMATERIALIZED', 'ACTIVE_TEMPLATE_PROJECTION_NOT_MAPPED',
      { problemTypeKey, canonicalOwnerPack, ownerVersion: canonicalPack.version, mappedTemplateKeys });
  }

  const template = templateKey ? activeRegistry.templates.get(templateKey) : null;
  if (!templateKey || !template || template.status !== 'ACTIVE' || template.parentProblemTypeKey !== problemTypeKey
    || !activeRegistry.activePacks.has(text(template.ownerPack))) {
    return projectionPending(currentBase, 'PROJECTION_UNMATERIALIZED', 'ACTIVE_TEMPLATE_PROJECTION_NOT_MATERIALIZED',
      { problemTypeKey, canonicalOwnerPack, ownerVersion: canonicalPack.version, mappedTemplateKeys: templateKey ? [templateKey] : [] });
  }

  const bindingRows = exactProjectionBindings(activeRegistry, row, context, problemTypeKey);
  const bindingOwnerHint = text(row.bindingOwnerPack || row.binding?.bindingOwnerPack || row.binding?.ownerPack);
  const hintedBindings = bindingOwnerHint ? bindingRows.filter(binding => text(binding.ownerPack) === bindingOwnerHint) : [];
  const eligibleBindings = bindingOwnerHint ? hintedBindings : bindingRows;
  if (eligibleBindings.length !== 1) {
    const pendingStatus = eligibleBindings.length > 1 ? 'META_ONLY_COMPATIBILITY_PENDING' : 'PROJECTION_BINDING_PENDING';
    return projectionPending(currentBase, pendingStatus,
      eligibleBindings.length > 1 ? 'EXACT_BINDING_OWNER_AMBIGUOUS' : 'EXACT_ACTIVE_BINDING_PENDING',
      { problemTypeKey, canonicalOwnerPack, ownerVersion: canonicalPack.version, mappedTemplateKeys: [templateKey],
        bindingOwnerPack: bindingOwnerHint || (bindingRows.length === 1 ? text(bindingRows[0].ownerPack) : '') });
  }
  const bindingRow = eligibleBindings[0];
  const bindingOwnerPack = text(bindingRow.ownerPack);
  if (!activeRegistry.activePacks.has(bindingOwnerPack)) {
    return projectionPending(currentBase, 'PROJECTION_BINDING_PENDING', 'BINDING_OWNER_PACK_NOT_ACTIVE',
      { problemTypeKey, canonicalOwnerPack, ownerVersion: canonicalPack.version, mappedTemplateKeys: [templateKey], bindingOwnerPack });
  }
  return projectionPending(currentBase, 'PROJECTION_REUSE', 'ACTIVE_COMPATIBILITY_PROJECTION_AVAILABLE',
    { projectionReusable: true, problemTypeKey, templateKey, canonicalOwnerPack, ownerVersion: canonicalPack.version,
      mappedTemplateKeys: [templateKey], bindingOwnerPack, bindingIdentity: bindingIdentity(bindingRow) });
}
function buildEvidence(fields) {
  const { bundle, refs = [], ...rest } = fields;
  const dispositionReason = text(rest.dispositionReason || rest.reason);
  delete rest.reason;
  rest.dispositionReason = dispositionReason;
  if (!Object.hasOwn(rest, 'advancedMetaEligible')) {
    rest.advancedMetaEligible = rest.semanticStatus === 'FINAL' && rest.projectionStatus === 'PROJECTION_REUSE';
  }
  const evidence = {
    schemaVersion: META_RESOLUTION_SCHEMA,
    ...rest,
    semanticInputBundle: bundle,
    authorityRefs: refs.map(({ path: filePath, bytes, sha256, role }) => ({ path: filePath, bytes, sha256, ...(role ? { role } : {}) })),
  };
  delete evidence.evidenceSha;
  evidence.evidenceSha = objectSha(evidence);
  return evidence;
}

export function validateResolverEvidence(input, evidence, { repoRoot = DEFAULT_ROOT, registry } = {}) {
  const errors = [];
  let recomputed;
  try { recomputed = resolveMetaRoute(input, { repoRoot, registry }); }
  catch (error) { return { status: 'FAIL', errors: [String(error.message || error)] }; }
  if (!evidence || typeof evidence !== 'object') return { status: 'FAIL', errors: ['META_RESOLUTION_SCHEMA_INVALID'] };
  const { evidenceSha, ...body } = evidence;
  if (!evidenceSha || evidenceSha !== objectSha(body)) errors.push('META_RESOLUTION_EVIDENCE_SHA_INVALID');

  if (evidence.schemaVersion === LEGACY_META_RESOLUTION_SCHEMA_V1) {
    const isolated = buildDecisionIsolatedInput(input);
    const legacyDispositions = new Set(['EXISTING_REUSE', 'FAMILY_REUSE', 'RPM_PRIMARY_MIGRATION_GAP', 'TRUE_TAXONOMY_GAP', 'ROUTE_OUT']);
    if (!legacyDispositions.has(evidence.disposition)) errors.push('LEGACY_META_RESOLUTION_DISPOSITION_INVALID');
    if (evidence.inputBundleSha !== isolated.inputBundleSha || evidence.sourceFingerprint !== isolated.sourceFingerprint) errors.push('META_RESOLUTION_INPUT_BINDING_MISMATCH');
    if (!equal(evidence.semanticInputBundle, isolated.bundle)) errors.push('META_RESOLUTION_SEMANTIC_INPUT_MISMATCH');
    if (evidence.rpmPath && !equal(evidence.rpmPath, recomputed.rpmPath)) errors.push('META_RESOLUTION_RPM_PATH_RECLASSIFICATION_MISMATCH');
    return {
      status: errors.length ? 'FAIL' : 'PASS',
      errors,
      recomputed,
      reclassifiedLegacyProjection: true,
      priorDisposition: evidence.disposition,
    };
  }

  if (evidence.schemaVersion !== META_RESOLUTION_SCHEMA) errors.push('META_RESOLUTION_SCHEMA_INVALID');
  if (evidence?.inputBundleSha !== recomputed.inputBundleSha || evidence?.sourceFingerprint !== recomputed.sourceFingerprint) errors.push('META_RESOLUTION_INPUT_BINDING_MISMATCH');
  const { evidenceSha: expectedSha, ...expectedBody } = recomputed;
  if (!equal(body, expectedBody)) errors.push('META_RESOLUTION_RECOMPUTE_MISMATCH');
  if (!META_ROUTE_DISPOSITIONS.includes(evidence?.disposition)) errors.push('META_RESOLUTION_DISPOSITION_INVALID');
  if (evidence?.semanticStatus === 'FINAL' && !META_PROJECTION_STATUSES.includes(evidence?.projectionStatus)) errors.push('META_PROJECTION_STATUS_INVALID');
  return { status: errors.length ? 'FAIL' : 'PASS', errors, recomputed };
}
export function validateBlindDifficulty(evidence, { sourceFingerprint, solutionHash } = {}) {
  const errors = [];
  if (evidence?.schemaVersion !== META_DIFFICULTY_SCHEMA) errors.push('DIFFICULTY_SCHEMA_INVALID');
  if (evidence?.status !== 'PASS' || evidence?.blindPassStatus !== 'FRESH_INDEPENDENT') errors.push('DIFFICULTY_BLIND_PASS_REQUIRED');
  if (evidence?.sourceFingerprint !== sourceFingerprint || evidence?.solutionHash !== solutionHash) errors.push('DIFFICULTY_SOURCE_SOLUTION_BINDING_MISMATCH');
  if (evidence?.independentOfSemanticPass !== true) errors.push('DIFFICULTY_SEMANTIC_PASS_NOT_INDEPENDENT');
  if (evidence?.derivedFromLegacyLevel === true || evidence?.difficultyMappingSource === 'level') errors.push('LEVEL_TO_DIFFICULTY_INFERENCE_FORBIDDEN');
  if (!DIFFICULTY_BUCKETS.includes(evidence?.difficultyBucket)) errors.push('DIFFICULTY_BUCKET_INVALID');
  if (!DIFFICULTY_CONFIDENCE.includes(evidence?.difficultyConfidence)) errors.push('DIFFICULTY_CONFIDENCE_INVALID');
  if (!DIFFICULTY_BOUNDARY_FLAGS.includes(evidence?.difficultyBoundaryFlag)) errors.push('DIFFICULTY_BOUNDARY_INVALID');
  if (!LEGACY_LEVEL_COMPATIBILITY.includes(evidence?.legacyLevelCompatibility)) errors.push('LEGACY_LEVEL_COMPATIBILITY_INVALID');
  if (evidence?.difficultyConfidence === 'low' && evidence?.independentRecheckCompleted !== true && evidence?.adjudicationCompleted !== true) errors.push('DIFFICULTY_LOW_CONFIDENCE_RECHECK_REQUIRED');
  if (evidence?.difficultyBoundaryFlag !== 'NONE' && evidence?.boundaryRecheckCompleted !== true && evidence?.adjudicationCompleted !== true) errors.push('DIFFICULTY_BOUNDARY_RECHECK_REQUIRED');
  if (evidence?.legacyLevelCompatibility === 'BORDERLINE_REVIEW') errors.push('DIFFICULTY_LEGACY_COMPATIBILITY_UNRESOLVED');
  if (['BORDERLINE_ACCEPTABLE', 'STRONG_CONFLICT'].includes(evidence?.legacyLevelCompatibility)
    && evidence?.independentRecheckCompleted !== true && evidence?.adjudicationCompleted !== true) errors.push('DIFFICULTY_LEGACY_COMPATIBILITY_RECHECK_REQUIRED');
  if (!text(evidence?.rationale) || !text(evidence?.blindReviewerId) || !text(evidence?.decisionSha)) errors.push('DIFFICULTY_BLIND_PROVENANCE_REQUIRED');
  const { evidenceSha, ...body } = evidence || {};
  if (!evidenceSha || evidenceSha !== objectSha(body)) errors.push('DIFFICULTY_EVIDENCE_SHA_INVALID');
  return { status: errors.length ? 'FAIL' : 'PASS', errors };
}

export function validateDifficultyProjectionParity(candidateMeta, difficultyEvidence, { errorPrefix = 'META_FINAL_DIFFICULTY_FIELD_PARITY_FAIL' } = {}) {
  const errors = [];
  for (const field of DIFFICULTY_PROJECTION_FIELDS) {
    if (!equal(candidateMeta?.[field] ?? null, difficultyEvidence?.[field] ?? null)) errors.push(`${errorPrefix}:${field}`);
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors };
}

export function validateMetaFinalization({ input, resolverEvidence, difficultyEvidence, candidateMeta, semanticMetaEvidence, validatorReceipt,
  requireValidatorReceipt = true, repoRoot = DEFAULT_ROOT, registry } = {}) {
  const errors = [];
  const resolution = validateResolverEvidence(input, resolverEvidence, { repoRoot, registry });
  errors.push(...resolution.errors);
  const resolved = resolution.recomputed || resolverEvidence || {};
  const difficulty = validateBlindDifficulty(difficultyEvidence, {
    sourceFingerprint: resolved?.sourceFingerprint,
    solutionHash: resolved?.semanticInputBundle?.solutionIdentity?.solutionHash,
  });
  errors.push(...difficulty.errors);
  errors.push(...validateDifficultyProjectionParity(candidateMeta, difficultyEvidence).errors);
  if (!candidateMeta || typeof candidateMeta !== 'object') errors.push('META_FINAL_CANDIDATE_REQUIRED');
  else {
    const activeRegistry = registry || loadActiveMetaRegistry(repoRoot);
    const projectionReady = resolved?.projectionStatus === 'PROJECTION_REUSE';
    const fieldCheck = validateActiveMetaFields(candidateMeta, activeRegistry, { requireFields: projectionReady });
    const canonicalCheck = validateCanonicalProjectionKeys(candidateMeta, activeRegistry);
    const fieldErrors = projectionReady ? fieldCheck.errors
      : fieldCheck.errors.filter(error => error !== 'ADVANCED_META_CURRICULUM_BINDING_INVALID');
    errors.push(...fieldErrors, ...canonicalCheck.errors.map(error => 'META_FINAL_INVALID_CANONICAL_PROJECTION:' + error));
    const candidatePT = text(candidateMeta.problemTypeKey);
    const candidateTPL = text(candidateMeta.templateKey);
    if (candidatePT && resolved?.problemTypeKey && candidatePT !== resolved.problemTypeKey) errors.push('META_FINAL_RESOLVER_KEY_PARITY_FAIL');
    if (candidateTPL && resolved?.templateKey && candidateTPL !== resolved.templateKey) errors.push('META_FINAL_RESOLVER_KEY_PARITY_FAIL');
    if (projectionReady && (!fieldCheck.activeBinding || !fieldCheck.l3Active || (candidateTPL && !fieldCheck.l4Active))) {
      errors.push('META_FINAL_ACTIVE_BINDING_REQUIRED');
    }
    if (resolved?.semanticStatus === 'HOLD') errors.push('META_RPM_SEMANTIC_HOLD_UNRESOLVED');
    else if (resolved?.semanticStatus !== 'FINAL') errors.push('META_RPM_SEMANTIC_FINAL_REQUIRED');
    if (resolved?.projectionStatus === 'PROJECTION_REUSE' && candidatePT && candidatePT !== resolved.problemTypeKey) {
      errors.push('META_FINAL_RESOLVER_KEY_PARITY_FAIL');
    }
    if (candidateMeta.crossConceptKeys?.includes(candidateMeta.problemTypeKey) || candidateMeta.crossConceptKeys?.includes(candidateMeta.templateKey)) errors.push('META_FINAL_PRIMARY_CROSSCONCEPT_DUPLICATE');
    if (!text(candidateMeta.integrationReason)) errors.push('META_FINAL_INTEGRATION_REASON_REQUIRED');
    const auditByKey = (items, keys, kind) => {
      const expected = new Set(keys || []);
      const actual = new Set((items || []).map(item => item.key));
      if (expected.size !== actual.size || [...expected].some(key => !actual.has(key))) errors.push('META_FINAL_' + kind + '_EVIDENCE_PARITY_FAIL');
      for (const item of items || []) {
        if (item.status !== 'FINAL' || !text(item.reason) || item.sourceFingerprint !== resolved?.sourceFingerprint
          || item.inputBundleSha !== resolved?.inputBundleSha) errors.push('META_FINAL_' + kind + '_EVIDENCE_INVALID:' + (item.key || '<missing>'));
      }
    };
    auditByKey(semanticMetaEvidence?.crossConceptDecisions, candidateMeta.crossConceptKeys, 'CROSS_CONCEPT');
    auditByKey(semanticMetaEvidence?.conditionDecisions, candidateMeta.conditionKeys, 'CONDITION');
    if (semanticMetaEvidence?.schemaVersion !== 'JS_ARCHIVE_RELATIONAL_META_EVIDENCE_v1'
      || semanticMetaEvidence?.sourceFingerprint !== resolved?.sourceFingerprint
      || semanticMetaEvidence?.inputBundleSha !== resolved?.inputBundleSha
      || semanticMetaEvidence?.candidateVisibleDuringDecision !== false) errors.push('META_FINAL_RELATIONAL_PROVENANCE_INVALID');
    const { evidenceSha: semanticSha, ...semanticBody } = semanticMetaEvidence || {};
    if (!semanticSha || semanticSha !== objectSha(semanticBody)) errors.push('META_FINAL_RELATIONAL_EVIDENCE_SHA_INVALID');
  }
  if (requireValidatorReceipt) {
    const preflight = validateMetaFinalization({ input, resolverEvidence, difficultyEvidence, candidateMeta, semanticMetaEvidence,
      requireValidatorReceipt: false, repoRoot, registry });
    if (preflight.status !== 'PASS' || !validateMetaValidatorReceipt(validatorReceipt, resolverEvidence?.evidenceSha, resolverEvidence?.schemaVersion === LEGACY_META_RESOLUTION_SCHEMA_V1 ? undefined : preflight)) {
      errors.push('META_DETERMINISTIC_VALIDATOR_NOT_RUN');
    }
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors, resolutionStatus: resolution.status, difficultyStatus: difficulty.status,
    rpmSemanticStatus: resolved?.semanticStatus || 'UNAVAILABLE', projectionStatus: resolved?.projectionStatus || 'NOT_ATTEMPTED' };
}
export function validateMetaValidatorReceipt(validatorReceipt, evidenceSha, validationResult) {
  if (!validatorReceipt || validatorReceipt.status !== 'PASS' || validatorReceipt.validatorId !== 'rpm-active-resolver-v1'
    || validatorReceipt.inputEvidenceSha !== evidenceSha || !text(validatorReceipt.validationResultSha)) return false;
  if (validationResult && validatorReceipt.validationResultSha !== objectSha(validationResult)) return false;
  return validatorReceipt.runSha === objectSha({ inputEvidenceSha: validatorReceipt.inputEvidenceSha,
    validatorId: validatorReceipt.validatorId, validationResultSha: validatorReceipt.validationResultSha });
}

export function validateR2EReceipt(receipt, options = {}) {
  const errors = [];
  if (receipt?.schemaVersion !== 'JS_ARCHIVE_R2E_META_RECEIPT_v1' || !Array.isArray(receipt.items)) errors.push('R2E_META_RECEIPT_SCHEMA_INVALID');
  const { receiptSha, ...receiptBody } = receipt || {};
  if (!receiptSha || receiptSha !== objectSha(receiptBody)) errors.push('R2E_META_RECEIPT_SHA_INVALID');
  const seen = new Set();
  const semanticCounts = { FINAL: 0, HOLD: 0, UNAVAILABLE: 0 };
  const projectionCounts = { PROJECTION_REUSE: 0, PROJECTION_BINDING_PENDING: 0, PROJECTION_UNMATERIALIZED: 0, META_ONLY_COMPATIBILITY_PENDING: 0 };
  for (const item of receipt?.items || []) {
    const uid = text(item.questionUid);
    if (!uid || seen.has(uid)) errors.push('R2E_META_UID_INVALID:' + (uid || '<missing>'));
    seen.add(uid);
    const resolverEvidence = item.resolverEvidence || {};
    if (resolverEvidence.semanticInputBundle?.sourceIdentity?.questionUid !== uid) errors.push('R2E_META_UID_BINDING_MISMATCH:' + uid);
    const routeCheck = validateResolverEvidence(item.input, resolverEvidence, { repoRoot: options.repoRoot, registry: options.registry });
    for (const error of routeCheck.errors) errors.push(error + ':' + uid);
    const effective = routeCheck.recomputed || resolverEvidence;
    if (effective.semanticStatus === 'FINAL') semanticCounts.FINAL++;
    else if (effective.semanticStatus === 'HOLD') semanticCounts.HOLD++;
    else semanticCounts.UNAVAILABLE++;
    if (projectionCounts[effective.projectionStatus] !== undefined) projectionCounts[effective.projectionStatus]++;
    const routeOut = effective.disposition === 'ROUTE_OUT' && item.r2eFinalDisposition === 'ROUTE_OUT';
    if (routeOut) {
      if (!text(item.routeOutEvidence?.reason) || item.routeOutEvidence?.status !== 'FINAL') errors.push('R2E_ROUTE_OUT_EVIDENCE_REQUIRED:' + uid);
      if (!validateMetaValidatorReceipt(item.validatorReceipt, resolverEvidence.evidenceSha, routeCheck)) errors.push('R2E_VALIDATOR_NOT_RUN:' + uid);
      if (item.routeOutEvidence?.runtimeParity?.status !== 'PASS'
        || item.routeOutEvidence?.runtimeParity?.questionUid !== uid
        || item.routeOutEvidence?.runtimeParity?.resolverEvidenceSha !== resolverEvidence.evidenceSha) errors.push('R2E_ROUTE_OUT_RUNTIME_PARITY_REQUIRED:' + uid);
      continue;
    }

    const result = validateMetaFinalization({ ...item, repoRoot: options.repoRoot, registry: options.registry });
    for (const error of result.errors) errors.push(error + ':' + uid);
    if (effective.semanticStatus !== 'FINAL') errors.push('R2E_RPM_SEMANTIC_FINAL_REQUIRED:' + uid);
    if (item.disposition !== resolverEvidence.disposition
      && resolverEvidence.schemaVersion !== LEGACY_META_RESOLUTION_SCHEMA_V1) errors.push('R2E_META_ITEM_DISPOSITION_MISMATCH:' + uid);

    const projectionPending = effective.projectionStatus !== 'PROJECTION_REUSE';
    const allowedFinal = new Set(['EXISTING_REUSE', 'REBIND', 'MATERIALIZED', 'NEW_L4', 'NEW_L3', 'CROSS_CONCEPT', 'META_ONLY_COMPATIBILITY_PENDING', 'META_ONLY']);
    if (!allowedFinal.has(item.r2eFinalDisposition)) errors.push('R2E_FINAL_DISPOSITION_INVALID:' + uid);
    if (projectionPending && !['META_ONLY_COMPATIBILITY_PENDING', 'META_ONLY'].includes(item.r2eFinalDisposition)) {
      errors.push('R2E_COMPATIBILITY_PENDING_NOT_META_ONLY:' + uid);
    }
    if (!projectionPending && item.r2eFinalDisposition !== 'EXISTING_REUSE') {
      if (item.actionEvidence?.status !== 'PASS' || item.actionEvidence?.questionUid !== uid
        || item.actionEvidence?.resolverEvidenceSha !== resolverEvidence.evidenceSha) errors.push('R2E_ACTION_EVIDENCE_INVALID:' + uid);
    }
    if (!projectionPending || item.actionEvidence?.status === 'PASS') {
      const runtimeParity = validateRuntimeMetaParity({
        questionUid: uid,
        sourceFingerprint: effective.sourceFingerprint,
        resolverEvidence,
        difficultyEvidence: item.difficultyEvidence,
        candidateMeta: item.candidateMeta,
        runtimeRecord: item.runtimeRecord,
      });
      for (const error of runtimeParity.errors) errors.push(error + ':' + uid);
    } else if (item.runtimeRecord && item.runtimeRecord.questionUid !== uid) {
      errors.push('RUNTIME_META_UID_MISMATCH:' + uid);
    }
  }
  if (Array.isArray(options.sourceQuestions)) {
    const inputSchemaVersion = receipt?.items?.some(item => item?.sourceMetaProjection)
      ? R2E_META_INPUT_SCHEMA_V2 : R2E_META_INPUT_SCHEMA_V1;
    const sourceCheck = validateR2EIntakeMetaReceipt({
      schemaVersion: inputSchemaVersion,
      items: receipt.items.map(item => ({ ...item, sourceOrdinal: item.sourceOrdinal ?? item.input?.sourceIdentity?.sourceOrdinal,
        disposition: item.resolverEvidence?.disposition })),
    }, { sourceArchiveFile: options.sourceArchiveFile, sourceQuestions: options.sourceQuestions, repoRoot: options.repoRoot,
      registry: options.registry, requireResolverReceipt: false, projectionMode: 'R2E_FINAL' });
    for (const error of sourceCheck.errors) errors.push('R2E_FINAL_SOURCE_BINDING:' + error);
  }
  if (receipt?.stage === 'R2E_FINAL') {
    const declaredHoldCount = receipt.rpmSemanticHoldCount ?? receipt.trueMetaHoldCount;
    if (declaredHoldCount !== undefined && declaredHoldCount !== semanticCounts.HOLD) errors.push('R2E_FINAL_RPM_SEMANTIC_HOLD_COUNT_MISMATCH');
    const declaredSemantic = receipt.rpmSemantic || receipt.rpmSemanticSummary;
    if (declaredSemantic && !equalCountSummary(declaredSemantic, semanticCounts)) errors.push('R2E_FINAL_RPM_SEMANTIC_SUMMARY_MISMATCH');
    const declaredProjection = receipt.legacyProjection || receipt.legacyProjectionSummary;
    if (declaredProjection && !equalCountSummary(declaredProjection, projectionCounts)) errors.push('R2E_FINAL_LEGACY_PROJECTION_SUMMARY_MISMATCH');
    const hasNewProjectionSummary = receipt.projectionPendingCount !== undefined || declaredProjection !== undefined;
    if (hasNewProjectionSummary && receipt.migrationGapCount !== undefined && Number(receipt.migrationGapCount) !== projectionCounts.PROJECTION_BINDING_PENDING
      + projectionCounts.PROJECTION_UNMATERIALIZED + projectionCounts.META_ONLY_COMPATIBILITY_PENDING) {
      errors.push('R2E_FINAL_PROJECTION_PENDING_COUNT_MISMATCH');
    }
    // Legacy aggregate HOLD/proposal/runtime counters mixed semantic and
    // projection debt. Current per-item resolver, canonical-key and runtime
    // validation below are authoritative; stale aggregate values cannot turn a
    // projection-only gap into a release blocker.
    if (semanticCounts.HOLD > 0 || semanticCounts.UNAVAILABLE > 0) errors.push('R2E_FINAL_RPM_SEMANTIC_NOT_CLOSED');
    if (errors.length) errors.push('R2E_FINAL_META_SEMANTIC_CLOSURE_FAIL');
  }
  return {
    status: errors.length ? 'FAIL' : 'PASS',
    errors,
    questionCount: seen.size,
    rpmSemantic: semanticCounts,
    legacyProjection: projectionCounts,
    projectionPendingCount: projectionCounts.PROJECTION_BINDING_PENDING + projectionCounts.PROJECTION_UNMATERIALIZED + projectionCounts.META_ONLY_COMPATIBILITY_PENDING,
  };
}
export function sealR2EMetaReceipt(receipt) {
  const { receiptSha: _discard, ...body } = receipt || {};
  return { ...body, receiptSha: objectSha(body) };
}

export function mapResolverDispositionToR2E(dispositionOrEvidence, projectionStatus = '') {
  const disposition = typeof dispositionOrEvidence === 'string' ? dispositionOrEvidence : dispositionOrEvidence?.disposition;
  const projection = projectionStatus || (typeof dispositionOrEvidence === 'object' ? dispositionOrEvidence?.projectionStatus : '');
  if (disposition === 'RPM_SEMANTIC_FINAL') return projection === 'PROJECTION_REUSE' ? 'EXISTING_REUSE' : 'META_ONLY_COMPATIBILITY_PENDING';
  if (disposition === 'EXISTING_REUSE' || disposition === 'FAMILY_REUSE') return 'EXISTING_REUSE';
  if (disposition === 'TRUE_META_HOLD' || disposition === 'TRUE_TAXONOMY_GAP') return 'TRUE_META_HOLD';
  if (disposition === 'ROUTE_OUT') return 'ROUTE_OUT';
  return null;
}
export function validateRuntimeMetaParity({ questionUid, sourceFingerprint, resolverEvidence, difficultyEvidence, candidateMeta, runtimeRecord } = {}) {
  const errors = [];
  if (!runtimeRecord || runtimeRecord.questionUid !== questionUid) errors.push('RUNTIME_META_UID_MISMATCH');
  // Runtime sourceFingerprint remains the Archive2/identity-map fingerprint.
  // The resolver has a separate canonical fingerprint over source tuple hashes.
  const resolverSourceFingerprint = runtimeRecord?.resolverSourceFingerprint || runtimeRecord?.sourceFingerprint;
  if (resolverSourceFingerprint !== sourceFingerprint) errors.push('RUNTIME_META_SOURCE_FINGERPRINT_MISMATCH');
  if (candidateMeta?.archiveSourceFingerprint && runtimeRecord?.sourceFingerprint !== candidateMeta.archiveSourceFingerprint) errors.push('RUNTIME_META_ARCHIVE_SOURCE_FINGERPRINT_MISMATCH');
  for (const field of ['problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility']) {
    // NO_SEPARATE_L4 is stored as an empty string in R2E metadata and as null in runtime rows.
    const runtimeValue = field === 'templateKey' && !runtimeRecord?.[field] ? null : runtimeRecord?.[field];
    const candidateValue = field === 'templateKey' && !candidateMeta?.[field] ? null : candidateMeta?.[field];
    if (!equal(runtimeValue, candidateValue)) errors.push('RUNTIME_META_FIELD_PARITY_FAIL:' + field);
  }
  if (runtimeRecord?.resolverEvidenceSha !== resolverEvidence?.evidenceSha) errors.push('RUNTIME_META_RESOLVER_EVIDENCE_SHA_MISMATCH');
  if (runtimeRecord?.difficultyEvidenceSha !== difficultyEvidence?.evidenceSha) errors.push('RUNTIME_META_DIFFICULTY_EVIDENCE_SHA_MISMATCH');
  return { status: errors.length ? 'FAIL' : 'PASS', errors };
}

export function validateR2EIntakeMetaReceipt(receipt, { sourceArchiveFile, sourceQuestions, repoRoot = DEFAULT_ROOT, registry,
  requireResolverReceipt = true, projectionMode = 'R2E_INTAKE' } = {}) {
  const errors = [];
  const rows = receipt?.items;
  const isV1 = receipt?.schemaVersion === R2E_META_INPUT_SCHEMA_V1;
  const isV2 = receipt?.schemaVersion === R2E_META_INPUT_SCHEMA_V2;
  if ((!isV1 && !isV2) || !Array.isArray(rows)) return { status: 'FAIL', errors: ['R2E_META_INPUT_RECEIPT_SCHEMA_INVALID'] };
  if (!['R2E_INTAKE', 'R2E_FINAL'].includes(projectionMode)) errors.push('R2E_META_INPUT_PROJECTION_MODE_INVALID');
  if (!Array.isArray(sourceQuestions) || rows.length !== sourceQuestions.length) errors.push('R2E_META_INPUT_DENOMINATOR_MISMATCH');
    const normalizeSource = value => text(value).replaceAll('\\', '/').replace(/^archive\/exams\//, '');
  const seen = new Set();
  const activeRegistry = registry || loadActiveMetaRegistry(repoRoot);
  const rpmSemanticSummary = { FINAL: 0, HOLD: 0, UNAVAILABLE: 0 };
  const legacyProjectionSummary = { PROJECTION_REUSE: 0, PROJECTION_BINDING_PENDING: 0, PROJECTION_UNMATERIALIZED: 0, META_ONLY_COMPATIBILITY_PENDING: 0, NOT_ATTEMPTED: 0 };
  let invalidCanonicalProjectionCount = 0;
  for (let i = 0; i < rows.length; i += 1) {
    const item = rows[i];
    const question = sourceQuestions?.[i];
    const uid = text(item?.questionUid);
    if (!uid || seen.has(uid)) errors.push(`R2E_META_INPUT_UID_INVALID:${uid || i + 1}`);
    seen.add(uid);
    const input = item?.input;
    const source = input?.sourceIdentity || {};
    const ctx = input?.curriculumContext || {};
    if (!question || Number(item?.sourceOrdinal) !== i + 1 || Number(source.sourceOrdinal) !== i + 1) errors.push(`R2E_META_INPUT_ORDINAL_MISMATCH:${uid}`);
    if (uid !== source.questionUid || normalizeSource(source.sourceArchiveFile) !== normalizeSource(sourceArchiveFile)) errors.push(`R2E_META_INPUT_SOURCE_JOIN_MISMATCH:${uid}`);
    const canonicalSourceKey = normalizeSource(sourceArchiveFile).normalize('NFC');
    const expectedUid = `qid_v1_${crypto.createHash('sha256').update(`${canonicalSourceKey}#${i + 1}`).digest('hex')}`;
    if (uid !== expectedUid) errors.push(`R2E_META_INPUT_CANONICAL_UID_MISMATCH:${uid}`);
    if (question?.sourceIdentityKey && source.sourceIdentityKey !== question.sourceIdentityKey) errors.push(`R2E_META_INPUT_SOURCE_IDENTITY_KEY_MISMATCH:${uid}`);
    const actualHashes = question ? {
      contentHash: objectSha(question.content ?? ''),
      choicesHash: objectSha(question.choices ?? []),
      imageRefHash: objectSha({
        image: question.image ?? '', visualAsset: question.visualAsset ?? '',
        fullPageImagePath: question.fullPageImagePath ?? '', fullPageImageRelPath: question.fullPageImageRelPath ?? '',
        sourceEvidencePath: question.sourceEvidencePath ?? '', sourcePageEvidencePaths: question.sourcePageEvidencePaths ?? [],
      }),
      solutionHash: objectSha(question.solution ?? ''),
    } : {};
    for (const [field, expected] of Object.entries(actualHashes)) {
      const actual = field === 'solutionHash' ? input?.solutionIdentity?.[field] : source[field];
      if (actual !== expected) errors.push(`R2E_META_INPUT_${field.toUpperCase()}_MISMATCH:${uid}`);
    }
    if (question && (ctx.standardUnitKey !== question.standardUnitKey || (ctx.subUnitKey || '') !== (question.subUnitKey || ''))) errors.push(`R2E_META_INPUT_CURRICULUM_PARITY_FAIL:${uid}`);
    const candidateMeta = item?.candidateMeta || {};
    if (question) {
      const candidateJsFields = isV1 || projectionMode === 'R2E_FINAL'
        ? [...ADVANCED_META_FIELDS_EXCLUDED_FROM_SEMANTIC_INPUT, 'standardUnitKey', 'subUnitKey']
        : ['standardUnitKey', 'subUnitKey'];
      for (const field of candidateJsFields) {
        if (!equal(comparableMetaProjectionValue(field, candidateMeta[field]), comparableMetaProjectionValue(field, question[field]))) {
          errors.push(`R2E_META_INPUT_CANDIDATE_JS_PARITY_FAIL:${uid}:${field}`);
        }
      }
      if (isV2) {
        const sourceProjection = item?.sourceMetaProjection;
        const projectionSha = item?.sourceMetaProjectionSha;
        const expectedProjection = makeR2ESourceMetaProjection(question);
        if (!sourceProjection || !equal(sourceProjection, makeR2ESourceMetaProjection(sourceProjection))) errors.push(`R2E_META_INPUT_SOURCE_JS_PROJECTION_INVALID:${uid}`);
        if (!sourceProjection || !projectionSha || projectionSha !== objectSha(sourceProjection)) errors.push(`R2E_META_INPUT_SOURCE_JS_PROJECTION_SHA_INVALID:${uid}`);
        if (projectionMode === 'R2E_INTAKE' && !equal(sourceProjection, expectedProjection)) errors.push(`R2E_META_INPUT_SOURCE_JS_PROJECTION_PARITY_FAIL:${uid}`);
      }
    }
    const resolver = validateResolverEvidence(input, item?.resolverEvidence, { repoRoot, registry: activeRegistry });
    for (const error of resolver.errors) errors.push(error + ':' + uid);
    const effectiveResolution = resolver.recomputed || item?.resolverEvidence || {};
    if (effectiveResolution.semanticStatus === 'FINAL') rpmSemanticSummary.FINAL++;
    else if (effectiveResolution.semanticStatus === 'HOLD') rpmSemanticSummary.HOLD++;
    else rpmSemanticSummary.UNAVAILABLE++;
    if (legacyProjectionSummary[effectiveResolution.projectionStatus] !== undefined) legacyProjectionSummary[effectiveResolution.projectionStatus]++;
    if (item?.disposition !== item?.resolverEvidence?.disposition
      && item?.resolverEvidence?.schemaVersion !== LEGACY_META_RESOLUTION_SCHEMA_V1) errors.push('R2E_META_INPUT_DISPOSITION_MISMATCH:' + uid);
    const difficulty = validateBlindDifficulty(item?.difficultyEvidence, {
      sourceFingerprint: item?.resolverEvidence?.sourceFingerprint,
      solutionHash: item?.resolverEvidence?.semanticInputBundle?.solutionIdentity?.solutionHash,
    });
    for (const error of difficulty.errors) errors.push(`${error}:${uid}`);
    errors.push(...validateDifficultyProjectionParity(candidateMeta, item?.difficultyEvidence,
      { errorPrefix: `R2E_META_INPUT_DIFFICULTY_FIELD_PARITY_FAIL:${uid}` }).errors);
    const relation = item?.semanticMetaEvidence;
    if (relation?.schemaVersion !== 'JS_ARCHIVE_RELATIONAL_META_EVIDENCE_v1'
      || relation?.sourceFingerprint !== item?.resolverEvidence?.sourceFingerprint
      || relation?.inputBundleSha !== item?.resolverEvidence?.inputBundleSha
      || relation?.candidateVisibleDuringDecision !== false) errors.push(`R2E_META_INPUT_RELATIONAL_PROVENANCE_FAIL:${uid}`);
    const { evidenceSha: relationSha, ...relationBody } = relation || {};
    if (!relationSha || relationSha !== objectSha(relationBody)) errors.push(`R2E_META_INPUT_RELATIONAL_EVIDENCE_SHA_INVALID:${uid}`);
    const keySet = new Set();
    for (const [field, decisions] of [['crossConceptDecisions', relation?.crossConceptDecisions], ['conditionDecisions', relation?.conditionDecisions]]) {
      if (!Array.isArray(decisions)) errors.push(`R2E_META_INPUT_${field.toUpperCase()}_MISSING:${uid}`);
      for (const decision of decisions || []) {
        if (!text(decision.key) || !text(decision.reason) || decision.status !== 'FINAL'
          || decision.sourceFingerprint !== item?.resolverEvidence?.sourceFingerprint
          || decision.inputBundleSha !== item?.resolverEvidence?.inputBundleSha) errors.push(`R2E_META_INPUT_${field.toUpperCase()}_INVALID:${uid}`);
        const uniqueKey = `${field}:${decision.key}`;
        if (keySet.has(uniqueKey)) errors.push(`R2E_META_INPUT_RELATIONAL_DUPLICATE:${uid}:${decision.key}`);
        keySet.add(uniqueKey);
      }
    }
    for (const [field, decisions] of [['crossConceptKeys', relation?.crossConceptDecisions], ['conditionKeys', relation?.conditionDecisions]]) {
      const expected = new Set(candidateMeta[field] || []);
      const actual = new Set((decisions || []).map(decision => decision.key));
      if (expected.size !== actual.size || [...expected].some(key => !actual.has(key))) errors.push(`R2E_META_INPUT_RELATIONAL_FIELD_PARITY_FAIL:${uid}:${field}`);
    }
    if (!text(candidateMeta.integrationReason)) errors.push(`R2E_META_INPUT_INTEGRATION_REASON_MISSING:${uid}`);
    const projectionReady = effectiveResolution.projectionStatus === 'PROJECTION_REUSE';
    const projectedCandidate = { ...candidateMeta, curriculum: candidateMeta.curriculum || ctx.curriculum };
    const activeCheck = validateActiveMetaFields(projectedCandidate, activeRegistry, { requireFields: projectionReady });
    const canonicalCheck = validateCanonicalProjectionKeys(projectedCandidate, activeRegistry);
    const activeErrors = projectionReady ? activeCheck.errors
      : activeCheck.errors.filter(error => error !== 'ADVANCED_META_CURRICULUM_BINDING_INVALID');
    for (const error of activeErrors) errors.push(error + ':' + uid);
    for (const error of canonicalCheck.errors) errors.push('R2E_META_INVALID_CANONICAL_PROJECTION:' + error + ':' + uid);
    const validator = item?.validatorReceipt;
    if (requireResolverReceipt && !validateMetaValidatorReceipt(validator, item?.resolverEvidence?.evidenceSha, item?.resolverEvidence?.schemaVersion === LEGACY_META_RESOLUTION_SCHEMA_V1 ? undefined : resolver)) errors.push(`R2E_META_INPUT_VALIDATOR_NOT_RUN:${uid}`);
    const hasProjectionKey = Boolean(text(candidateMeta.problemTypeKey) || text(candidateMeta.templateKey));
    if (effectiveResolution.semanticStatus === 'HOLD' && hasProjectionKey) errors.push('R2E_META_INPUT_TRUE_HOLD_KEY_MUST_REMAIN_BLANK:' + uid);
    if (effectiveResolution.semanticStatus === 'FINAL' && hasProjectionKey) {
      const projectionCheck = validateActiveMetaFields({ ...candidateMeta, curriculum: candidateMeta.curriculum || ctx.curriculum }, activeRegistry);
      if (projectionCheck.errors.length) invalidCanonicalProjectionCount++;
      if (effectiveResolution.projectionStatus === 'PROJECTION_REUSE'
        && ((candidateMeta.problemTypeKey && candidateMeta.problemTypeKey !== effectiveResolution.problemTypeKey)
          || (candidateMeta.templateKey && candidateMeta.templateKey !== effectiveResolution.templateKey))) {
        errors.push('R2E_META_INPUT_REUSE_FIELD_MISMATCH:' + uid);
      }
    }
  }
  const resolvablePending = rpmSemanticSummary.HOLD + rpmSemanticSummary.UNAVAILABLE + invalidCanonicalProjectionCount;
  return { status: errors.length ? 'FAIL' : 'PASS', errors, questionCount: rows.length,
    rpmSemantic: rpmSemanticSummary, legacyProjection: legacyProjectionSummary, invalidCanonicalProjectionCount, resolvablePending };
}

export function makeMetaValidatorReceipt(resolverEvidence, validationResult) {
  if (validationResult?.status !== 'PASS' || !resolverEvidence?.evidenceSha) throw new Error('META_DETERMINISTIC_VALIDATION_NOT_PASS');
  const validationResultSha = objectSha(validationResult);
  const inputEvidenceSha = resolverEvidence.evidenceSha;
  const validatorId = 'rpm-active-resolver-v1';
  return { status: 'PASS', validatorId: 'rpm-active-resolver-v1', inputEvidenceSha: resolverEvidence.evidenceSha,
    validationResultSha, runSha: objectSha({ inputEvidenceSha, validatorId, validationResultSha }) };
}

export function makeDifficultyEvidence(fields) {
  const evidence = { schemaVersion: META_DIFFICULTY_SCHEMA, ...fields };
  evidence.evidenceSha = objectSha(evidence);
  return evidence;
}

export function buildResolverBackedMetaEvidence({ input, candidateMeta, semanticMetaEvidence, difficultyEvidence, repoRoot = DEFAULT_ROOT, registry } = {}) {
  const resolverEvidence = resolveMetaRoute(input, { repoRoot, registry });
  const payload = { input, resolverEvidence, candidateMeta, semanticMetaEvidence, difficultyEvidence, repoRoot, registry };
  const preflight = validateMetaFinalization({ ...payload, requireValidatorReceipt: false });
  const validatorReceipt = preflight.status === 'PASS' ? makeMetaValidatorReceipt(resolverEvidence, preflight) : null;
  const finalValidation = validateMetaFinalization({ ...payload, validatorReceipt });
  return { resolverEvidence, difficultyEvidence, semanticMetaEvidence, validatorReceipt, validation: finalValidation };
}

export function buildResolverDecisionEvidence(input, { repoRoot = DEFAULT_ROOT, registry } = {}) {
  const resolverEvidence = resolveMetaRoute(input, { repoRoot, registry });
  const validation = validateResolverEvidence(input, resolverEvidence, { repoRoot, registry });
  const validatorReceipt = validation.status === 'PASS' ? makeMetaValidatorReceipt(resolverEvidence, validation) : null;
  return { resolverInput: input, resolverEvidence, validatorReceipt, validation };
}

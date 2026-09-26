import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { objectSha, fileRef } from '../pipeline-core/canonical.mjs';
import { loadActiveMetaRegistry, validateActiveMetaFields } from './active-registry.mjs';

export const META_RESOLUTION_SCHEMA = 'JS_ARCHIVE_RPM_ACTIVE_RESOLUTION_v1';
export const META_DIFFICULTY_SCHEMA = 'JS_ARCHIVE_DIFFICULTY_BLIND_EVIDENCE_v1';
export const META_LOOKUP_ORDER = Object.freeze([
  'RPM_PRIMARY_README', 'RPM_CANONICAL_MASTER', 'RPM_CURRICULUM_SCOPE_VIEW', 'RPM_TO_ACTIVE_CROSSWALK', 'ACTIVE_META_FOUNDATION',
]);
export const DECISION_ISOLATED_INPUT_FIELDS = Object.freeze(['sourceIdentity', 'solutionIdentity', 'curriculumContext', 'semanticDecision']);
export const ADVANCED_META_FIELDS_EXCLUDED_FROM_SEMANTIC_INPUT = Object.freeze([
  'problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern',
  'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility',
]);
export const META_ROUTE_DISPOSITIONS = Object.freeze([
  'EXISTING_REUSE', 'FAMILY_REUSE', 'RPM_PRIMARY_MIGRATION_GAP', 'TRUE_TAXONOMY_GAP', 'ROUTE_OUT',
]);
export const DIFFICULTY_BUCKETS = Object.freeze([1, 2, 3, 4, 5]);
export const DIFFICULTY_CONFIDENCE = Object.freeze(['high', 'medium', 'low']);
export const DIFFICULTY_BOUNDARY_FLAGS = Object.freeze(['NONE', 'B12', 'B23', 'B34', 'B45']);
export const LEGACY_LEVEL_COMPATIBILITY = Object.freeze(['NORMAL', 'BORDERLINE_REVIEW', 'BORDERLINE_ACCEPTABLE', 'STRONG_CONFLICT']);

const here = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(here, '../../..');
const text = value => typeof value === 'string' ? value.trim() : '';
const equal = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const pathRef = (root, rel) => fileRef(root, rel);
const rpmBase = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0';
const crosswalkBase = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0';

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

function findRpmRecord(master, rpmPath) {
  if (![rpmPath.curriculum, rpmPath.scope, rpmPath.majorUnit, rpmPath.midUnit, rpmPath.l3, rpmPath.l4].every(Boolean)) return null;
  const records = (master.records || []).filter(row => row.curriculum === rpmPath.curriculum && row.scope === rpmPath.scope
    && row.majorUnit === rpmPath.majorUnit && row.midUnit === rpmPath.midUnit);
  const hits = [];
  for (const row of records) for (const concept of row.concepts || []) {
    if (concept.concept !== rpmPath.l3) continue;
    for (const item of concept.problemTypes || []) if (item.problemType === rpmPath.l4) hits.push({ row, concept, item });
  }
  return hits.length === 1 ? hits[0] : null;
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

function bindingIdentity(binding) {
  if (!binding) return '';
  return [binding.curriculum, binding.standardUnitKey, binding.subUnitKey ?? '<DIRECT>', binding.problemTypeKey, binding.ownerPack].join('|');
}

function migrationResult(base, reason) {
  return { ...base, disposition: 'RPM_PRIMARY_MIGRATION_GAP', dispositionReason: reason, problemTypeKey: '', templateKey: '', advancedMetaEligible: false };
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
  const rpmReadme = readRef(`${rpmBase}/README.md`);
  const rpmMasterRef = readRef(`${rpmBase}/00_POLICY/CANONICAL_MASTER.json`);
  if (!rpmReadme || !rpmMasterRef) return buildEvidence({ bundle, sourceFingerprint, inputBundleSha, refs, disposition: 'ROUTE_OUT', reason: 'RPM_PRIMARY_AUTHORITY_MISSING' });
  const master = readJson(path.join(root, rpmMasterRef.path));
  const rpmHit = findRpmRecord(master, rpmPath);
  const viewPath = viewPathFor(context, rpmPath);
  const viewRef = viewPath ? readRef(viewPath) : null;
  if (!viewRef) return buildEvidence({ bundle, sourceFingerprint, inputBundleSha, refs, rpmPath, disposition: 'ROUTE_OUT', reason: 'RPM_SCOPE_VIEW_MISSING' });
  const viewText = fs.readFileSync(path.join(root, viewRef.path), 'utf8');
  const rpmVerified = Boolean(rpmHit && viewText.includes(rpmPath.l3) && viewText.includes(rpmPath.l4));
  if (rpmHit && !rpmVerified) return buildEvidence({ bundle, sourceFingerprint, inputBundleSha, refs, rpmPath, disposition: 'ROUTE_OUT', reason: 'RPM_SCOPE_VIEW_PATH_MISMATCH' });

  const crosswalkPath = crosswalkPathFor(context);
  const crosswalkRef = crosswalkPath ? readRef(crosswalkPath) : null;
  if (crosswalkRef) {
    // The crosswalk is intentionally read only after RPM Primary was resolved.
    refs.push({ ...crosswalkRef, role: 'RPM_TO_ACTIVE_CROSSWALK' });
  }
  const registry = suppliedRegistry || loadActiveMetaRegistry(root);
  const activeReferencePaths = registry.paths ? [registry.paths.index, registry.paths.rules, registry.paths.conditionsCanonical,
    registry.paths.taxonomy, registry.paths.concepts, registry.paths.conditions, registry.paths.bindings] : [];
  for (const relative of activeReferencePaths) {
    try { refs.push({ ...pathRef(root, relative), role: 'ACTIVE_META_FOUNDATION' }); }
    catch { /* active registry status below records missing/stale runtime inputs */ }
  }
  const base = {
    sourceFingerprint,
    inputBundleSha,
    rpmPath: rpmVerified ? rpmPath : null,
    rpmL3: rpmVerified ? rpmPath.l3 : '',
    rpmL4: rpmVerified ? rpmPath.l4 : '',
    crosswalkFile: crosswalkRef?.path || '',
    crosswalkRecordId: '',
    crosswalkStatus: '',
    problemTypeKey: '',
    templateKey: '',
    ownerPack: '',
    ownerVersion: '',
    bindingIdentity: '',
    refs,
  };
  if (registry.status !== 'ACTIVE') return buildEvidence({ bundle, ...base, disposition: 'ROUTE_OUT', reason: 'ACTIVE_META_REGISTRY_UNAVAILABLE', activeRegistrySha: registry.registrySha || '' });
  if (!rpmVerified) {
    if (input.activeSearchEvidence?.status !== 'COMPLETED_NO_MATCH'
      || input.activeSearchEvidence?.registrySha !== registry.registrySha
      || input.activeSearchEvidence?.searchedGlobalActive !== true
      || input.activeSearchEvidence?.searchMethod !== 'GLOBAL_ACTIVE_TARGETED_BY_EXACT_CURRICULUM_L1_L2'
      || !equal(input.activeSearchEvidence?.searchedScope, { curriculum: context.curriculum, standardUnitKey: context.standardUnitKey, subUnitKey: context.subUnitKey })
      || !Array.isArray(input.activeSearchEvidence?.candidateKeys)
      || input.activeSearchEvidence.candidateKeys.length) {
      return buildEvidence({ bundle, ...base, disposition: 'ROUTE_OUT', reason: 'ACTIVE_TARGETED_SEARCH_EVIDENCE_REQUIRED' });
    }
    return buildEvidence({ bundle, ...base, disposition: 'TRUE_TAXONOMY_GAP', reason: 'RPM_AND_ACTIVE_TARGETED_SEARCH_EMPTY', activeRegistrySha: registry.registrySha,
      activeSearchEvidence: input.activeSearchEvidence });
  }
  if (!crosswalkRef) return buildEvidence({ bundle, ...base, disposition: 'RPM_PRIMARY_MIGRATION_GAP', reason: 'EXACT_CROSSWALK_ROUTE_UNAVAILABLE' });
  const matched = crosswalkMatch(path.join(root, crosswalkRef.path), context, rpmPath);
  if (matched.duplicate) return buildEvidence({ bundle, ...base, disposition: 'ROUTE_OUT', reason: 'CROSSWALK_PATH_DUPLICATE' });
  if (matched.standardCourseMismatch) return buildEvidence({ bundle, ...base, disposition: 'ROUTE_OUT', reason: 'EXACT_CROSSWALK_SUBJECT_MISMATCH' });
  if (matched.l2Mismatch) return buildEvidence({ bundle, ...base, disposition: 'RPM_PRIMARY_MIGRATION_GAP', reason: 'CROSSWALK_EXACT_L2_BINDING_MISSING' });
  const row = matched.row;
  if (!row) return buildEvidence({ bundle, ...base, disposition: 'RPM_PRIMARY_MIGRATION_GAP', reason: 'RPM_PATH_NOT_MATERIALIZED_IN_EXACT_CROSSWALK' });
  const currentBase = { ...base, crosswalkRecordId: row.id || '', crosswalkStatus: row.mappingStatus || '' };
  if (['RPM_ONLY', 'DIRECT_BINDING_GAP', 'FAMILY_BINDING_GAP'].includes(row.mappingStatus) || row.bindingStatus !== 'ACTIVE') {
    const mappedProblemTypeKey = text(row.problemTypeKey);
    const mappedTemplateKeys = row.templateKey ? [text(row.templateKey)] : (row.templateCandidates || []).map(item => text(item.templateKey)).filter(Boolean);
    const mappedPT = registry.problemTypes.get(mappedProblemTypeKey);
    const mappedOwner = text(mappedPT?.ownerPack || row.ownerPack);
    const mappedOwnerVersion = registry.activePacks?.get(mappedOwner)?.version || '';
    const mappedBinding = row.binding ? bindingIdentity({ ...row.binding, problemTypeKey: mappedProblemTypeKey }) : '';
    return buildEvidence({ bundle, ...currentBase, disposition: 'RPM_PRIMARY_MIGRATION_GAP', reason: row.mappingStatus || 'CROSSWALK_BINDING_UNAVAILABLE',
      mappedProblemTypeKey, mappedTemplateKeys, mappedOwnerPack: mappedOwner, mappedOwnerVersion,
      mappedBindingIdentity: mappedBinding, activeMaterializationStatus: mappedPT?.status === 'ACTIVE' ? 'ACTIVE_KEY_PRESENT' : 'ACTIVE_KEY_MISSING' });
  }
  if (!['DIRECT_ACTIVE', 'FAMILY_ACTIVE'].includes(row.mappingStatus)) return buildEvidence({ bundle, ...currentBase, disposition: 'ROUTE_OUT', reason: 'CROSSWALK_STATUS_UNSUPPORTED' });

  const ptKey = text(row.problemTypeKey);
  const pt = registry.problemTypes.get(ptKey);
  const ownerPack = text(pt?.ownerPack || row.ownerPack);
  const pack = registry.activePacks?.get(ownerPack);
  if (!pt || pt.status !== 'ACTIVE' || !pack || ownerPack !== text(row.ownerPack)) {
    return buildEvidence({ bundle, ...currentBase, disposition: 'RPM_PRIMARY_MIGRATION_GAP', reason: 'ACTIVE_PROBLEM_TYPE_NOT_MATERIALIZED',
      mappedProblemTypeKey: ptKey, mappedTemplateKeys: row.templateKey ? [text(row.templateKey)] : (row.templateCandidates || []).map(item => text(item.templateKey)).filter(Boolean),
      mappedOwnerPack: ownerPack, mappedOwnerVersion: pack?.version || '', activeMaterializationStatus: 'ACTIVE_KEY_MISSING', activeRegistrySha: registry.registrySha });
  }

  let templateKey = '';
  let disposition = 'EXISTING_REUSE';
  if (row.mappingStatus === 'FAMILY_ACTIVE') {
    disposition = 'FAMILY_REUSE';
    const selection = input.familyTemplateSelection;
    const candidates = new Set((row.templateCandidates || []).map(item => item.templateKey));
    if (selection?.stage !== 'POST_CROSSWALK' || selection?.inputBundleSha !== inputBundleSha
      || selection?.crosswalkRecordId !== row.id || !candidates.has(selection?.templateKey)
      || !text(selection?.decisiveStepReason)) {
      return buildEvidence({ bundle, ...currentBase, disposition, dispositionReason: 'FAMILY_TEMPLATE_SELECTION_REQUIRED',
        mappedProblemTypeKey: ptKey, mappedTemplateKeys: [...candidates], mappedOwnerPack: ownerPack, mappedOwnerVersion: pack.version,
        activeRegistrySha: registry.registrySha });
    }
    templateKey = selection.templateKey;
  } else templateKey = text(row.templateKey);

  if (templateKey) {
    const tpl = registry.templates.get(templateKey);
    if (!tpl || tpl.status !== 'ACTIVE' || tpl.parentProblemTypeKey !== ptKey || tpl.ownerPack !== ownerPack) {
      return buildEvidence({ bundle, ...currentBase, disposition: 'RPM_PRIMARY_MIGRATION_GAP', reason: 'ACTIVE_TEMPLATE_PARENT_OR_OWNER_MISMATCH',
        mappedProblemTypeKey: ptKey, mappedTemplateKeys: [templateKey], mappedOwnerPack: ownerPack, mappedOwnerVersion: pack.version,
        activeMaterializationStatus: tpl?.status === 'ACTIVE' ? 'ACTIVE_TEMPLATE_PARENT_MISMATCH' : 'ACTIVE_TEMPLATE_MISSING', activeRegistrySha: registry.registrySha });
    }
  } else if (row.mappingStatus === 'FAMILY_ACTIVE') {
    return buildEvidence({ bundle, ...currentBase, disposition: 'FAMILY_REUSE', dispositionReason: 'FAMILY_TEMPLATE_SELECTION_REQUIRED',
      mappedProblemTypeKey: ptKey, mappedTemplateKeys: (row.templateCandidates || []).map(item => item.templateKey),
      mappedOwnerPack: ownerPack, mappedOwnerVersion: pack.version, activeRegistrySha: registry.registrySha });
  }

  const binding = row.binding || {
    curriculum: context.curriculum,
    standardUnitKey: context.standardUnitKey,
    subUnitKey: row.subUnitKey ?? null,
    problemTypeKey: ptKey,
    ownerPack,
  };
  const bindingRow = (registry.bindingRows || []).find(item => item.curriculum === binding.curriculum
    && item.standardUnitKey === binding.standardUnitKey && (item.subUnitKey ?? null) === (binding.subUnitKey ?? null)
    && item.problemTypeKey === ptKey && item.ownerPack === ownerPack);
  if (!bindingRow) return buildEvidence({ bundle, ...currentBase, disposition: 'RPM_PRIMARY_MIGRATION_GAP', reason: 'EXACT_ACTIVE_BINDING_NOT_MATERIALIZED',
    mappedProblemTypeKey: ptKey, mappedTemplateKeys: templateKey ? [templateKey] : [], mappedOwnerPack: ownerPack, mappedOwnerVersion: pack.version,
    activeMaterializationStatus: 'ACTIVE_KEYS_PRESENT_BINDING_MISSING', activeRegistrySha: registry.registrySha });
  return buildEvidence({ bundle, ...currentBase, disposition, dispositionReason: row.mappingStatus, problemTypeKey: ptKey, templateKey,
    ownerPack, ownerVersion: pack.version, bindingIdentity: bindingIdentity(bindingRow), activeRegistrySha: registry.registrySha, familySelection: input.familyTemplateSelection || null });
}

function buildEvidence(fields) {
  const { bundle, refs = [], ...rest } = fields;
  const dispositionReason = text(rest.dispositionReason || rest.reason);
  delete rest.reason;
  rest.dispositionReason = dispositionReason;
  if (!Object.hasOwn(rest, 'advancedMetaEligible')) {
    rest.advancedMetaEligible = ['EXISTING_REUSE', 'FAMILY_REUSE'].includes(rest.disposition)
      && !(rest.disposition === 'FAMILY_REUSE' && !text(rest.templateKey));
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
  if (!evidence || evidence.schemaVersion !== META_RESOLUTION_SCHEMA) errors.push('META_RESOLUTION_SCHEMA_INVALID');
  if (evidence?.inputBundleSha !== recomputed.inputBundleSha || evidence?.sourceFingerprint !== recomputed.sourceFingerprint) errors.push('META_RESOLUTION_INPUT_BINDING_MISMATCH');
  const { evidenceSha, ...body } = evidence || {};
  if (!evidenceSha || evidenceSha !== objectSha(body)) errors.push('META_RESOLUTION_EVIDENCE_SHA_INVALID');
  const { evidenceSha: expectedSha, ...expectedBody } = recomputed;
  if (!equal(body, expectedBody)) errors.push('META_RESOLUTION_RECOMPUTE_MISMATCH');
  if (!META_ROUTE_DISPOSITIONS.includes(evidence?.disposition)) errors.push('META_RESOLUTION_DISPOSITION_INVALID');
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

export function validateMetaFinalization({ input, resolverEvidence, difficultyEvidence, candidateMeta, semanticMetaEvidence, validatorReceipt,
  requireValidatorReceipt = true, repoRoot = DEFAULT_ROOT, registry } = {}) {
  const errors = [];
  const resolution = validateResolverEvidence(input, resolverEvidence, { repoRoot, registry });
  errors.push(...resolution.errors);
  const difficulty = validateBlindDifficulty(difficultyEvidence, {
    sourceFingerprint: resolverEvidence?.sourceFingerprint,
    solutionHash: resolverEvidence?.semanticInputBundle?.solutionIdentity?.solutionHash,
  });
  errors.push(...difficulty.errors);
  if (!candidateMeta || typeof candidateMeta !== 'object') errors.push('META_FINAL_CANDIDATE_REQUIRED');
  else {
    const activeRegistry = registry || loadActiveMetaRegistry(repoRoot);
    const fieldCheck = validateActiveMetaFields(candidateMeta, activeRegistry, { requireFields: true });
    errors.push(...fieldCheck.errors);
    if (candidateMeta.problemTypeKey !== resolverEvidence?.problemTypeKey || (candidateMeta.templateKey || '') !== (resolverEvidence?.templateKey || '')) errors.push('META_FINAL_RESOLVER_KEY_PARITY_FAIL');
    if (!fieldCheck.activeBinding || !fieldCheck.l3Active || (candidateMeta.templateKey && !fieldCheck.l4Active)) errors.push('META_FINAL_ACTIVE_BINDING_REQUIRED');
    if (candidateMeta.crossConceptKeys?.includes(candidateMeta.problemTypeKey) || candidateMeta.crossConceptKeys?.includes(candidateMeta.templateKey)) errors.push('META_FINAL_PRIMARY_CROSSCONCEPT_DUPLICATE');
    if (!text(candidateMeta.integrationReason)) errors.push('META_FINAL_INTEGRATION_REASON_REQUIRED');
    const auditByKey = (items, keys, kind) => {
      const expected = new Set(keys || []);
      const actual = new Set((items || []).map(item => item.key));
      if (expected.size !== actual.size || [...expected].some(key => !actual.has(key))) errors.push(`META_FINAL_${kind}_EVIDENCE_PARITY_FAIL`);
      for (const item of items || []) {
        if (item.status !== 'FINAL' || !text(item.reason) || item.sourceFingerprint !== resolverEvidence?.sourceFingerprint
          || item.inputBundleSha !== resolverEvidence?.inputBundleSha) errors.push(`META_FINAL_${kind}_EVIDENCE_INVALID:${item.key || '<missing>'}`);
      }
    };
    auditByKey(semanticMetaEvidence?.crossConceptDecisions, candidateMeta.crossConceptKeys, 'CROSS_CONCEPT');
    auditByKey(semanticMetaEvidence?.conditionDecisions, candidateMeta.conditionKeys, 'CONDITION');
    if (semanticMetaEvidence?.schemaVersion !== 'JS_ARCHIVE_RELATIONAL_META_EVIDENCE_v1'
      || semanticMetaEvidence?.sourceFingerprint !== resolverEvidence?.sourceFingerprint
      || semanticMetaEvidence?.inputBundleSha !== resolverEvidence?.inputBundleSha
      || semanticMetaEvidence?.candidateVisibleDuringDecision !== false) errors.push('META_FINAL_RELATIONAL_PROVENANCE_INVALID');
    const { evidenceSha: semanticSha, ...semanticBody } = semanticMetaEvidence || {};
    if (!semanticSha || semanticSha !== objectSha(semanticBody)) errors.push('META_FINAL_RELATIONAL_EVIDENCE_SHA_INVALID');
  }
  if (requireValidatorReceipt) {
    const preflight = validateMetaFinalization({ input, resolverEvidence, difficultyEvidence, candidateMeta, semanticMetaEvidence,
      requireValidatorReceipt: false, repoRoot, registry });
    if (preflight.status !== 'PASS' || !validateMetaValidatorReceipt(validatorReceipt, resolverEvidence?.evidenceSha, preflight)) {
      errors.push('META_DETERMINISTIC_VALIDATOR_NOT_RUN');
    }
  }
  if (['RPM_PRIMARY_MIGRATION_GAP', 'TRUE_TAXONOMY_GAP', 'ROUTE_OUT'].includes(resolverEvidence?.disposition)) errors.push('META_ADVANCED_CLOSURE_UNRESOLVED');
  if (resolverEvidence?.disposition === 'FAMILY_REUSE' && !resolverEvidence?.templateKey) errors.push('META_FAMILY_REUSE_TEMPLATE_UNRESOLVED');
  return { status: errors.length ? 'FAIL' : 'PASS', errors, resolutionStatus: resolution.status, difficultyStatus: difficulty.status };
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
  for (const item of receipt?.items || []) {
    if (!text(item.questionUid) || seen.has(item.questionUid)) errors.push(`R2E_META_UID_INVALID:${item.questionUid || '<missing>'}`);
    seen.add(item.questionUid);
    if (item.resolverEvidence?.semanticInputBundle?.sourceIdentity?.questionUid !== item.questionUid) errors.push(`R2E_META_UID_BINDING_MISMATCH:${item.questionUid}`);
    const routeOut = item.resolverEvidence?.disposition === 'ROUTE_OUT' && item.r2eFinalDisposition === 'ROUTE_OUT';
    if (routeOut) {
      const routeCheck = validateResolverEvidence(item.input, item.resolverEvidence, { repoRoot: options.repoRoot, registry: options.registry });
      for (const error of routeCheck.errors) errors.push(`${error}:${item.questionUid}`);
      if (!text(item.routeOutEvidence?.reason) || item.routeOutEvidence?.status !== 'FINAL') errors.push(`R2E_ROUTE_OUT_EVIDENCE_REQUIRED:${item.questionUid}`);
      if (!validateMetaValidatorReceipt(item.validatorReceipt, item.resolverEvidence?.evidenceSha, routeCheck)) errors.push(`R2E_VALIDATOR_NOT_RUN:${item.questionUid}`);
      if (item.routeOutEvidence?.runtimeParity?.status !== 'PASS'
        || item.routeOutEvidence?.runtimeParity?.questionUid !== item.questionUid
        || item.routeOutEvidence?.runtimeParity?.resolverEvidenceSha !== item.resolverEvidence?.evidenceSha) errors.push(`R2E_ROUTE_OUT_RUNTIME_PARITY_REQUIRED:${item.questionUid}`);
    } else {
      const result = validateMetaFinalization({ ...item, repoRoot: options.repoRoot, registry: options.registry });
      for (const error of result.errors) errors.push(`${error}:${item.questionUid}`);
      const mapped = item.resolverEvidence?.disposition === 'EXISTING_REUSE' || item.resolverEvidence?.disposition === 'FAMILY_REUSE';
      if (!mapped) errors.push(`R2E_RESOLVER_DISPOSITION_NOT_FINAL:${item.questionUid}`);
      const allowedFinal = new Set(['EXISTING_REUSE', 'REBIND', 'MATERIALIZED', 'NEW_L4', 'NEW_L3', 'CROSS_CONCEPT']);
      if (!allowedFinal.has(item.r2eFinalDisposition)) errors.push(`R2E_FINAL_DISPOSITION_INVALID:${item.questionUid}`);
      if (item.r2eFinalDisposition !== 'EXISTING_REUSE') {
        if (item.actionEvidence?.status !== 'PASS' || item.actionEvidence?.questionUid !== item.questionUid
          || item.actionEvidence?.resolverEvidenceSha !== item.resolverEvidence?.evidenceSha) errors.push(`R2E_ACTION_EVIDENCE_INVALID:${item.questionUid}`);
      }
      const runtimeParity = validateRuntimeMetaParity({
        questionUid: item.questionUid,
        sourceFingerprint: item.resolverEvidence?.sourceFingerprint,
        resolverEvidence: item.resolverEvidence,
        difficultyEvidence: item.difficultyEvidence,
        candidateMeta: item.candidateMeta,
        runtimeRecord: item.runtimeRecord,
      });
      for (const error of runtimeParity.errors) errors.push(`${error}:${item.questionUid}`);
    }
  }
  if (Array.isArray(options.sourceQuestions)) {
    const sourceCheck = validateR2EIntakeMetaReceipt({
      schemaVersion: 'JS_ARCHIVE_R2E_META_INPUT_RECEIPT_v1',
      items: receipt.items.map(item => ({ ...item, sourceOrdinal: item.sourceOrdinal ?? item.input?.sourceIdentity?.sourceOrdinal,
        disposition: item.resolverEvidence?.disposition })),
    }, { sourceArchiveFile: options.sourceArchiveFile, sourceQuestions: options.sourceQuestions, repoRoot: options.repoRoot, registry: options.registry, requireResolverReceipt: false });
    for (const error of sourceCheck.errors) errors.push(`R2E_FINAL_SOURCE_BINDING:${error}`);
  }
  if (receipt?.stage === 'R2E_FINAL') {
    for (const field of ['unresolvedSemanticCount', 'unresolvedProposalCount', 'unresolvedCrossConceptCandidateCount', 'metaHoldCount', 'migrationGapCount', 'runtimeParityFailureCount']) {
      if (receipt[field] !== 0) errors.push(`R2E_FINAL_${field.toUpperCase()}_NOT_ZERO`);
    }
    if (errors.length) errors.push('R2E_FINAL_META_HOLD_ZERO_FAIL');
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors, questionCount: seen.size };
}

export function sealR2EMetaReceipt(receipt) {
  const { receiptSha: _discard, ...body } = receipt || {};
  return { ...body, receiptSha: objectSha(body) };
}

export function mapResolverDispositionToR2E(disposition) {
  if (disposition === 'EXISTING_REUSE' || disposition === 'FAMILY_REUSE') return 'EXISTING_REUSE';
  if (disposition === 'ROUTE_OUT') return 'ROUTE_OUT';
  return null;
}

export function validateRuntimeMetaParity({ questionUid, sourceFingerprint, resolverEvidence, difficultyEvidence, candidateMeta, runtimeRecord } = {}) {
  const errors = [];
  if (!runtimeRecord || runtimeRecord.questionUid !== questionUid) errors.push('RUNTIME_META_UID_MISMATCH');
  if (runtimeRecord?.sourceFingerprint !== sourceFingerprint) errors.push('RUNTIME_META_SOURCE_FINGERPRINT_MISMATCH');
  for (const field of ['problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility']) {
    if (!equal(runtimeRecord?.[field], candidateMeta?.[field])) errors.push(`RUNTIME_META_FIELD_PARITY_FAIL:${field}`);
  }
  if (runtimeRecord?.resolverEvidenceSha !== resolverEvidence?.evidenceSha) errors.push('RUNTIME_META_RESOLVER_EVIDENCE_SHA_MISMATCH');
  if (runtimeRecord?.difficultyEvidenceSha !== difficultyEvidence?.evidenceSha) errors.push('RUNTIME_META_DIFFICULTY_EVIDENCE_SHA_MISMATCH');
  return { status: errors.length ? 'FAIL' : 'PASS', errors };
}

export function validateR2EIntakeMetaReceipt(receipt, { sourceArchiveFile, sourceQuestions, repoRoot = DEFAULT_ROOT, registry, requireResolverReceipt = true } = {}) {
  const errors = [];
  const rows = receipt?.items;
  if (receipt?.schemaVersion !== 'JS_ARCHIVE_R2E_META_INPUT_RECEIPT_v1' || !Array.isArray(rows)) return { status: 'FAIL', errors: ['R2E_META_INPUT_RECEIPT_SCHEMA_INVALID'] };
  if (!Array.isArray(sourceQuestions) || rows.length !== sourceQuestions.length) errors.push('R2E_META_INPUT_DENOMINATOR_MISMATCH');
    const normalizeSource = value => text(value).replaceAll('\\', '/').replace(/^archive\/exams\//, '');
  const seen = new Set();
  const activeRegistry = registry || loadActiveMetaRegistry(repoRoot);
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
      for (const field of [...ADVANCED_META_FIELDS_EXCLUDED_FROM_SEMANTIC_INPUT, 'standardUnitKey', 'subUnitKey']) {
        if (!equal(candidateMeta[field] ?? null, question[field] ?? null)) errors.push(`R2E_META_INPUT_CANDIDATE_JS_PARITY_FAIL:${uid}:${field}`);
      }
    }
    const resolver = validateResolverEvidence(input, item?.resolverEvidence, { repoRoot, registry: activeRegistry });
    for (const error of resolver.errors) errors.push(`${error}:${uid}`);
    if (item?.disposition !== item?.resolverEvidence?.disposition) errors.push(`R2E_META_INPUT_DISPOSITION_MISMATCH:${uid}`);
    const difficulty = validateBlindDifficulty(item?.difficultyEvidence, {
      sourceFingerprint: item?.resolverEvidence?.sourceFingerprint,
      solutionHash: item?.resolverEvidence?.semanticInputBundle?.solutionIdentity?.solutionHash,
    });
    for (const error of difficulty.errors) errors.push(`${error}:${uid}`);
    for (const field of ['difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility']) {
      if (!equal(candidateMeta[field] ?? null, item?.difficultyEvidence?.[field] ?? null)) errors.push(`R2E_META_INPUT_DIFFICULTY_FIELD_PARITY_FAIL:${uid}:${field}`);
    }
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
    const activeCheck = validateActiveMetaFields({ ...candidateMeta, curriculum: candidateMeta.curriculum || ctx.curriculum }, activeRegistry, { requireFields: true });
    for (const error of activeCheck.errors) errors.push(`${error}:${uid}`);
    const validator = item?.validatorReceipt;
    if (requireResolverReceipt && !validateMetaValidatorReceipt(validator, item?.resolverEvidence?.evidenceSha, resolver)) errors.push(`R2E_META_INPUT_VALIDATOR_NOT_RUN:${uid}`);
    const disposition = item?.resolverEvidence?.disposition;
    if (['RPM_PRIMARY_MIGRATION_GAP', 'TRUE_TAXONOMY_GAP', 'ROUTE_OUT'].includes(disposition)
      && (candidateMeta.problemTypeKey || candidateMeta.templateKey)) errors.push(`R2E_META_INPUT_GAP_KEY_MUST_REMAIN_BLANK:${uid}`);
    if (['EXISTING_REUSE', 'FAMILY_REUSE'].includes(disposition)) {
      if (candidateMeta.problemTypeKey !== item?.resolverEvidence?.problemTypeKey
        || (candidateMeta.templateKey || '') !== (item?.resolverEvidence?.templateKey || '')) errors.push(`R2E_META_INPUT_REUSE_FIELD_MISMATCH:${uid}`);
    }
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors, questionCount: rows.length };
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

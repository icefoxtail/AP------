import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { objectSha } from '../../pipeline-core/canonical.mjs';
import { curriculumForQuestion, loadActiveMetaRegistry, validateActiveMetaFields } from '../../meta-foundation/active-registry.mjs';

export const SOLUTION_IDENTITY_SCHEMA = 'PAST_EXAM_SOLUTION_IDENTITY_v1';
export const META_DECISION_SCHEMA = 'PAST_EXAM_META_DECISION_EVIDENCE_v1';
export const RPM_LOOKUP_ORDER = Object.freeze([
  'RPM_PRIMARY_README', 'RPM_CANONICAL_MASTER', 'RPM_CURRICULUM_SCOPE_VIEW',
  'RPM_TO_ACTIVE_CROSSWALK', 'ACTIVE_META_FOUNDATION',
]);
export const META_DECISION_INPUT_FIELDS = Object.freeze([
  'sourceArchiveFile', 'sourceIdentityKey', 'sourceOrdinal', 'contentHash', 'choicesHash',
  'imageRefHash', 'solutionHash', 'primaryMethod', 'decisiveStep', 'standardCourse',
  'standardUnitKey', 'subUnitKey',
]);
export const META_FIELDS_EXCLUDED_FROM_DECISION = Object.freeze([
  'problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern',
  'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility',
]);

const digest = bytes => `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
const normalizeSha = value => String(value || '').startsWith('sha256:') ? String(value) : `sha256:${String(value || '')}`;
const text = value => String(value ?? '').trim();
const equal = (left, right) => JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));

function candidateRoot(candidateFile) {
  const parent = path.dirname(candidateFile);
  return path.basename(parent) === 'candidate' ? path.dirname(parent) : parent;
}

function solutionIdentityFields(question, { sourceArchiveFile, sourceOrdinal }) {
  const contentHash = objectSha(question.content ?? '');
  const choicesHash = objectSha(question.choices ?? []);
  const imageRefHash = objectSha({
    image: question.image ?? '',
    visualAsset: question.visualAsset ?? '',
    fullPageImagePath: question.fullPageImagePath ?? '',
    fullPageImageRelPath: question.fullPageImageRelPath ?? '',
    sourceEvidencePath: question.sourceEvidencePath ?? '',
    sourcePageEvidencePaths: question.sourcePageEvidencePaths ?? [],
  });
  const solutionHash = objectSha(question.solution ?? '');
  const sourceIdentityFingerprint = objectSha({
    sourceArchiveFile,
    sourceIdentityKey: question.sourceIdentityKey,
    sourceOrdinal,
    contentHash,
    choicesHash,
    imageRefHash,
  });
  return {
    sourceArchiveFile,
    sourceIdentityKey: question.sourceIdentityKey,
    sourceOrdinal,
    contentHash,
    choicesHash,
    imageRefHash,
    sourceIdentityFingerprint,
    solutionHash,
  };
}

export function makeSolutionIdentityDraft({ questions, manifest, inventory }) {
  const inventoryByKey = new Map((inventory?.questions || []).map(row => [row.sourceIdentityKey, row]));
  return {
    schema: SOLUTION_IDENTITY_SCHEMA,
    status: 'NOT_TESTED',
    identityAuthority: 'sourceArchiveFile + sourceIdentityKey + sourceOrdinal + content/choices/image refs + solutionHash',
    items: (questions || []).map(question => {
      const source = inventoryByKey.get(question.sourceIdentityKey);
      return {
        ...solutionIdentityFields(question, {
          sourceArchiveFile: String(manifest?.archiveRelativePath || ''),
          sourceOrdinal: Number(source?.sourceOrdinal || question.sourceOrdinal || 0),
        }),
        inputVisibilityProfile: 'CANDIDATE_ONLY',
        alignmentStatus: 'NOT_VERIFIED',
        primaryMethod: '',
        decisiveSteps: [],
        sourceSolutionMatch: false,
      };
    }),
  };
}

function metaFieldProjection(question) {
  return Object.fromEntries(META_FIELDS_EXCLUDED_FROM_DECISION.map(key => [key, question?.[key] ?? null]));
}

function fieldSnapshot(question) {
  return {
    problemTypeKey: question.problemTypeKey ?? '',
    templateKey: question.templateKey ?? '',
    crossConceptKeys: question.crossConceptKeys ?? [],
    conditionKeys: question.conditionKeys ?? [],
    integrationPattern: question.integrationPattern ?? 'NONE',
    difficultyBucket: question.difficultyBucket ?? 'UNKNOWN',
    difficultyConfidence: question.difficultyConfidence ?? 'UNKNOWN',
    difficultyBoundaryFlag: question.difficultyBoundaryFlag ?? 'UNKNOWN',
    legacyLevelCompatibility: question.legacyLevelCompatibility ?? 'UNKNOWN',
  };
}

function findRpmPath(master, candidatePath) {
  const { curriculum, scope, majorUnit, midUnit, l3, l4 } = candidatePath || {};
  if (![curriculum, scope, majorUnit, midUnit, l3, l4].every(value => typeof value === 'string' && value.trim())) return false;
  return (master.records || []).some(record => {
    if (record.curriculum !== curriculum || record.scope !== scope || record.majorUnit !== majorUnit || record.midUnit !== midUnit) return false;
    return (record.concepts || []).some(concept => concept.concept === l3
      && (concept.problemTypes || []).some(type => type.problemType === l4));
  });
}

function rpmViewPath({ curriculum, scope, level }) {
  const year = curriculum === '2015' ? '01_2015' : curriculum === '2022' ? '02_2022' : '';
  const band = level === 'middle' ? 'MIDDLE' : level === 'high' ? 'HIGH' : '';
  if (!year || !band || !text(scope)) return '';
  return `docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/${year}/${band}/${scope}.md`;
}

function activeMetaReferencePaths(registry) {
  return [
    registry.paths.index,
    registry.paths.rules,
    registry.paths.conditionsCanonical,
    registry.paths.taxonomy,
    registry.paths.concepts,
    registry.paths.conditions,
    registry.paths.bindings,
  ];
}

function validateReferences(repoRoot, references, { crosswalkRoot = false } = {}) {
  const errors = [];
  const checked = [];
  if (!Array.isArray(references) || !references.length) return { errors: ['RPM_LOOKUP_REFERENCES_REQUIRED'], checked };
  for (const row of references) {
    const relative = String(row?.path || '').replaceAll('\\', '/');
    if (!relative || path.isAbsolute(relative) || relative.split('/').includes('..')) {
      errors.push(`RPM_LOOKUP_REFERENCE_PATH_INVALID:${relative}`);
      continue;
    }
    if (crosswalkRoot && !relative.startsWith('archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/')) errors.push(`RPM_CROSSWALK_PATH_INVALID:${relative}`);
    const file = path.resolve(repoRoot, relative);
    if (!file.startsWith(path.resolve(repoRoot) + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      errors.push(`RPM_LOOKUP_REFERENCE_MISSING:${relative}`);
      continue;
    }
    const actual = digest(fs.readFileSync(file));
    if (normalizeSha(row.sha256) !== actual) errors.push(`RPM_LOOKUP_REFERENCE_STALE:${relative}`);
    checked.push({ ...row, path: relative, sha256: actual, file });
  }
  return { errors, checked };
}

function expectedDecisionInput(question, identity, row) {
  return {
    sourceArchiveFile: identity.sourceArchiveFile,
    sourceIdentityKey: identity.sourceIdentityKey,
    sourceOrdinal: identity.sourceOrdinal,
    contentHash: identity.contentHash,
    choicesHash: identity.choicesHash,
    imageRefHash: identity.imageRefHash,
    solutionHash: identity.solutionHash,
    primaryMethod: text(row.primaryMethod),
    decisiveStep: text(row.decisiveStep),
    standardCourse: text(question.standardCourse),
    standardUnitKey: text(question.standardUnitKey),
    subUnitKey: text(question.subUnitKey),
  };
}

export function metaDecisionInputSha({ question, identity, row }) {
  return objectSha(expectedDecisionInput(question, identity, row));
}

function validateMetaRow({ row, question, identity, solutionReview, repoRoot, registry, errors }) {
  const key = String(question.sourceIdentityKey);
  if (row.sourceIdentityKey !== key || row.sourceArchiveFile !== identity.sourceArchiveFile || Number(row.sourceOrdinal) !== identity.sourceOrdinal) errors.push(`META_EVIDENCE_SOURCE_IDENTITY_MISMATCH:${key}`);
  for (const field of ['contentHash', 'choicesHash', 'imageRefHash', 'sourceIdentityFingerprint', 'solutionHash']) if (row[field] !== identity[field]) errors.push(`META_EVIDENCE_${field.toUpperCase()}_MISMATCH:${key}`);
  if (!text(row.primaryMethod) || !text(row.decisiveStep) || !text(row.semanticReason)) errors.push(`META_EVIDENCE_SEMANTIC_REASON_REQUIRED:${key}`);
  if (row.primaryMethod !== solutionReview?.primaryMethod || !(solutionReview?.decisiveSteps || []).includes(row.decisiveStep)) errors.push(`META_EVIDENCE_SOLUTION_METHOD_MISMATCH:${key}`);
  const inputFields = [...(row.decisionInputFields || [])];
  if (JSON.stringify(inputFields) !== JSON.stringify([...META_DECISION_INPUT_FIELDS])) errors.push(`META_EVIDENCE_INPUT_FIELDS_INVALID:${key}`);
  if (JSON.stringify(row.candidateMetaFieldsExcluded || []) !== JSON.stringify([...META_FIELDS_EXCLUDED_FROM_DECISION])) errors.push(`META_EVIDENCE_CANDIDATE_KEY_LEAKAGE:${key}`);
  if (row.candidateMetaVisible !== false) errors.push(`META_EVIDENCE_CANDIDATE_KEY_LEAKAGE:${key}`);
  const input = expectedDecisionInput(question, identity, row);
  if (row.decisionInputSha !== objectSha(input)) errors.push(`META_EVIDENCE_INPUT_SHA_MISMATCH:${key}`);

  const lookup = row.rpmLookup || {};
  if (!equal(lookup.order, RPM_LOOKUP_ORDER)) errors.push(`RPM_FIRST_ORDER_INVALID:${key}`);
  const refs = Array.isArray(lookup.references) ? lookup.references : [];
  const firstRoles = refs.slice(0, 4).map(ref => ref.role);
  if (!equal(firstRoles, RPM_LOOKUP_ORDER.slice(0, 4))) errors.push(`RPM_FIRST_REFERENCES_ORDER_INVALID:${key}`);
  const activeStart = refs.findIndex(ref => ref.role === 'ACTIVE_META_FOUNDATION');
  if (activeStart < 4 || refs.slice(activeStart).some(ref => ref.role !== 'ACTIVE_META_FOUNDATION')) errors.push(`RPM_ACTIVE_LOOKUP_ORDER_INVALID:${key}`);
  const activeReferenceSet = new Set(refs.filter(ref => ref.role === 'ACTIVE_META_FOUNDATION').map(ref => ref.path));
  for (const requiredPath of activeMetaReferencePaths(registry)) if (!activeReferenceSet.has(requiredPath)) errors.push(`ACTIVE_META_REFERENCE_MISSING:${key}:${requiredPath}`);
  const refCheck = validateReferences(repoRoot, refs);
  errors.push(...refCheck.errors.map(error => `${error}:${key}`));
  const rolePath = role => refs.find(ref => ref.role === role)?.path || '';
  const expectedReadme = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/README.md';
  const expectedMaster = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
  if (rolePath('RPM_PRIMARY_README') !== expectedReadme || rolePath('RPM_CANONICAL_MASTER') !== expectedMaster) errors.push(`RPM_PRIMARY_AUTHORITY_PATH_INVALID:${key}`);
  const crosswalkRef = refs.find(ref => ref.role === 'RPM_TO_ACTIVE_CROSSWALK');
  const crosswalkCheck = validateReferences(repoRoot, crosswalkRef ? [crosswalkRef] : [], { crosswalkRoot: true });
  errors.push(...crosswalkCheck.errors.map(error => `${error}:${key}`));
  const rpmPath = lookup.rpmPath || {};
  const curriculum = curriculumForQuestion(question);
  if (!curriculum || lookup.curriculum !== curriculum) errors.push(`RPM_CURRICULUM_SCOPE_MISMATCH:${key}`);
  const rpmReferencePath = path.join(repoRoot, expectedMaster);
  const rpmMaster = fs.existsSync(rpmReferencePath) ? readJson(rpmReferencePath) : { records: [] };
  const rpmPathExists = findRpmPath(rpmMaster, { ...rpmPath, curriculum: lookup.curriculum, scope: lookup.scope });
  if (lookup.rpmPathStatus === 'FOUND' && !rpmPathExists) errors.push(`RPM_PATH_NOT_FOUND:${key}`);
  if (lookup.rpmPathStatus === 'NOT_FOUND' && rpmPathExists) errors.push(`RPM_PATH_EXISTS_BUT_MARKED_MISSING:${key}`);
  if (!['FOUND', 'NOT_FOUND'].includes(lookup.rpmPathStatus)) errors.push(`RPM_PATH_STATUS_INVALID:${key}`);
  const view = rolePath('RPM_CURRICULUM_SCOPE_VIEW');
  const expectedView = rpmViewPath({ curriculum, scope: lookup.scope, level: lookup.level });
  if (!expectedView || view !== expectedView || !fs.existsSync(path.join(repoRoot, view))) errors.push(`RPM_CURRICULUM_SCOPE_VIEW_INVALID:${key}`);
  if (rpmPath.scope && rpmPath.scope !== lookup.scope) errors.push(`RPM_PATH_SCOPE_MISMATCH:${key}`);

  let crosswalkRecord = null;
  if (crosswalkCheck.checked.length) {
    try {
      const crosswalk = readJson(crosswalkCheck.checked[0].file);
      crosswalkRecord = (crosswalk.records || []).find(item => item.id === lookup.crosswalkRecordId) || null;
    } catch { errors.push(`RPM_CROSSWALK_JSON_INVALID:${key}`); }
  }
  if (lookup.crosswalkRecordId && !crosswalkRecord) errors.push(`RPM_CROSSWALK_ROW_NOT_FOUND:${key}`);
  if (crosswalkRecord) {
    if (crosswalkRecord.curriculum !== curriculum || crosswalkRecord.scope !== lookup.scope || !equal(crosswalkRecord.rpmPath, rpmPath)) errors.push(`RPM_CROSSWALK_RPM_PATH_MISMATCH:${key}`);
    if (crosswalkRecord.standardUnitKey !== question.standardUnitKey || (crosswalkRecord.subUnitKey ?? null) !== (question.subUnitKey || null)) errors.push(`RPM_CROSSWALK_CURRICULUM_BINDING_MISMATCH:${key}`);
    if (lookup.crosswalkMappingStatus !== crosswalkRecord.mappingStatus) errors.push(`RPM_CROSSWALK_STATUS_MISMATCH:${key}`);
  } else if (lookup.crosswalkMappingStatus !== 'NO_MATCH') errors.push(`RPM_CROSSWALK_NO_MATCH_STATUS_REQUIRED:${key}`);

  const disposition = row.disposition;
  const activeTypeKey = crosswalkRecord?.problemTypeKey || row.activeMapping?.problemTypeKey || '';
  const activeTemplateKey = crosswalkRecord?.templateKey || row.activeMapping?.templateKey || '';
  const currentProjection = fieldSnapshot(question);
  if (!equal(row.fieldProjection, currentProjection)) errors.push(`META_EVIDENCE_FIELD_PROJECTION_MISMATCH:${key}`);
  const activeCheck = validateActiveMetaFields(question, registry, { requireFields: true });
  errors.push(...activeCheck.errors.map(error => `${error}:${key}`));

  if (disposition === 'REUSE') {
    if (lookup.rpmPathStatus !== 'FOUND' || !['DIRECT_ACTIVE', 'FAMILY_ACTIVE'].includes(crosswalkRecord?.mappingStatus)) errors.push(`META_REUSE_WITHOUT_RPM_ACTIVE_MAPPING:${key}`);
    if (!question.problemTypeKey || question.problemTypeKey !== activeTypeKey || (question.templateKey || '') !== activeTemplateKey) errors.push(`META_REUSE_FIELD_MAPPING_MISMATCH:${key}`);
    if (question.templateKey) {
      if (row.l4Disposition !== 'ASSIGNED') errors.push(`META_L4_DISPOSITION_REQUIRED:${key}`);
    } else if (row.l4Disposition !== 'NO_SEPARATE_L4' || !text(row.noSeparateL4Reason) || activeTemplateKey
      || row.activeMapping?.noSeparateL4 !== true || (crosswalkRecord?.templateCandidates || []).length) {
      errors.push(`META_NO_SEPARATE_L4_EVIDENCE_REQUIRED:${key}`);
    }
    if (!activeCheck.activeBinding || !activeCheck.l3Active || (question.templateKey && !activeCheck.l4Active)) errors.push(`META_REUSE_ACTIVE_BINDING_REQUIRED:${key}`);
  } else if (disposition === 'BINDING_MIGRATION_GAP') {
    if (lookup.rpmPathStatus !== 'FOUND' || !['DIRECT_BINDING_GAP', 'FAMILY_BINDING_GAP'].includes(crosswalkRecord?.mappingStatus)) errors.push(`META_BINDING_GAP_EVIDENCE_INVALID:${key}`);
    if (!activeTypeKey || !registry.problemTypes.has(activeTypeKey)) errors.push(`META_BINDING_GAP_ACTIVE_TYPE_MISSING:${key}`);
    if (activeTemplateKey && (!registry.templates.has(activeTemplateKey) || registry.templates.get(activeTemplateKey)?.parentProblemTypeKey !== activeTypeKey)) errors.push(`META_BINDING_GAP_ACTIVE_TEMPLATE_MISSING:${key}`);
    if (question.problemTypeKey || question.templateKey) errors.push(`META_MIGRATION_KEY_MATERIALIZED_WITHOUT_BINDING:${key}`);
  } else if (disposition === 'KEY_MIGRATION_GAP') {
    if (lookup.rpmPathStatus !== 'FOUND' || (crosswalkRecord && crosswalkRecord.mappingStatus !== 'RPM_ONLY')) errors.push(`META_KEY_GAP_EVIDENCE_INVALID:${key}`);
    if (activeTypeKey && registry.problemTypes.has(activeTypeKey)) errors.push(`META_KEY_GAP_HAS_ACTIVE_TYPE:${key}`);
    if (question.problemTypeKey || question.templateKey) errors.push(`META_MIGRATION_KEY_MATERIALIZED_WITHOUT_ACTIVE_REGISTRY:${key}`);
  } else if (disposition === 'TRUE_TAXONOMY_GAP') {
    if (lookup.rpmPathStatus !== 'NOT_FOUND' || crosswalkRecord || lookup.crosswalkMappingStatus !== 'NO_MATCH') errors.push(`META_TRUE_GAP_EVIDENCE_INVALID:${key}`);
    if (row.activeSearch?.status !== 'COMPLETED' || row.activeSearch?.searchedSemanticPath !== true
      || row.activeSearch?.matchingProblemTypeKey || row.activeSearch?.matchingTemplateKey
      || !Array.isArray(row.activeSearch?.problemTypeCandidates) || row.activeSearch.problemTypeCandidates.length
      || !Array.isArray(row.activeSearch?.templateCandidates) || row.activeSearch.templateCandidates.length) errors.push(`META_TRUE_GAP_ACTIVE_SEARCH_INCOMPLETE:${key}`);
    if (question.problemTypeKey || question.templateKey) errors.push(`META_TRUE_GAP_KEY_MUST_REMAIN_HOLD:${key}`);
  } else errors.push(`META_DISPOSITION_INVALID:${key}`);

  const crossReasons = new Map((row.crossConceptDecisions || []).map(item => [item.key, item.reason]));
  const conditionReasons = new Map((row.conditionDecisions || []).map(item => [item.key, item.reason]));
  for (const conceptKey of question.crossConceptKeys || []) if (!text(crossReasons.get(conceptKey))) errors.push(`META_CROSS_CONCEPT_REASON_MISSING:${key}:${conceptKey}`);
  for (const conditionKey of question.conditionKeys || []) if (!text(conditionReasons.get(conditionKey))) errors.push(`META_CONDITION_REASON_MISSING:${key}:${conditionKey}`);
  if (question.crossConceptKeys?.some(conceptKey => crossReasons.size && !crossReasons.has(conceptKey))) errors.push(`META_CROSS_CONCEPT_REASON_PARITY_FAIL:${key}`);
  if (question.conditionKeys?.some(conditionKey => conditionReasons.size && !conditionReasons.has(conditionKey))) errors.push(`META_CONDITION_REASON_PARITY_FAIL:${key}`);
  const difficulty = row.difficultyEvidence || {};
  if (!equal(difficulty.fields, {
    difficultyBucket: question.difficultyBucket ?? 'UNKNOWN',
    difficultyConfidence: question.difficultyConfidence ?? 'UNKNOWN',
    difficultyBoundaryFlag: question.difficultyBoundaryFlag ?? 'UNKNOWN',
    legacyLevelCompatibility: question.legacyLevelCompatibility ?? 'UNKNOWN',
  })) errors.push(`META_DIFFICULTY_FIELD_PARITY_FAIL:${key}`);

  const advancedEligible = disposition === 'REUSE' && errors.filter(error => error.endsWith(`:${key}`) || error.includes(`:${key}:`)).length === 0
    && activeCheck.status === 'VALIDATED' && activeCheck.difficultyComplete
    && text(row.difficultyEvidence?.reason) && text(row.integrationReason)
    && (question.difficultyConfidence !== 'low' || difficulty.independentRecheckCompleted === true || difficulty.adjudicationCompleted === true)
    && (question.difficultyBoundaryFlag === 'NONE' || difficulty.boundaryRecheckCompleted === true || difficulty.adjudicationCompleted === true)
    && !['BORDERLINE_REVIEW'].includes(question.legacyLevelCompatibility)
    && (!['BORDERLINE_ACCEPTABLE', 'STRONG_CONFLICT'].includes(question.legacyLevelCompatibility) || difficulty.adjudicationCompleted === true || difficulty.independentRecheckCompleted === true)
    && (question.crossConceptKeys || []).every(conceptKey => text(crossReasons.get(conceptKey)))
    && (question.conditionKeys || []).every(conditionKey => text(conditionReasons.get(conditionKey)));
  return { disposition, advancedEligible, rpmPathExists, crosswalkRecordId: crosswalkRecord?.id || '', currentProjection };
}

export function validateCompletionEvidence({ candidateFile, questions, manifest, review, inventory, repoRoot }) {
  const root = path.resolve(repoRoot);
  const runRoot = candidateRoot(candidateFile);
  const evidenceErrors = [];
  const sourceRows = new Map((inventory?.questions || []).map(row => [row.sourceIdentityKey, row]));
  const identityPath = review.evidenceFiles?.solutionIdentityEvidence?.path
    ? path.resolve(runRoot, review.evidenceFiles.solutionIdentityEvidence.path)
    : path.join(runRoot, 'reports', 'solution_identity_evidence.json');
  const metaPath = review.evidenceFiles?.metaDecisionEvidence?.path
    ? path.resolve(runRoot, review.evidenceFiles.metaDecisionEvidence.path)
    : path.join(runRoot, 'reports', 'meta_decision_evidence.json');
  const sidecar = (file, hashField, schema, errors, errorCode) => {
    if (!fs.existsSync(file) || normalizeSha(review[hashField]) !== digest(fs.readFileSync(file))) {
      errors.push(errorCode);
      return null;
    }
    let value;
    try { value = readJson(file); }
    catch { errors.push(`${errorCode}_JSON_INVALID`); return null; }
    if (value.schema !== schema) errors.push(`${errorCode}_SCHEMA_INVALID`);
    return value;
  };
  const identityData = sidecar(identityPath, 'solutionIdentityEvidenceSha', SOLUTION_IDENTITY_SCHEMA, evidenceErrors, 'SOLUTION_IDENTITY_EVIDENCE_BINDING_FAIL');
  const metaData = sidecar(metaPath, 'metaDecisionEvidenceSha', META_DECISION_SCHEMA, evidenceErrors, 'META_DECISION_EVIDENCE_BINDING_FAIL');
  const identityByKey = new Map((identityData?.items || []).map(row => [String(row.sourceIdentityKey || ''), row]));
  const identityRows = [];
  for (const question of questions || []) {
    const key = String(question.sourceIdentityKey || '');
    const source = sourceRows.get(key);
    const expected = solutionIdentityFields(question, {
      sourceArchiveFile: String(manifest?.archiveRelativePath || ''),
      sourceOrdinal: Number(source?.sourceOrdinal || question.sourceOrdinal || 0),
    });
    const item = identityByKey.get(key);
    if (!expected.sourceArchiveFile || text(question.sourceArchiveFile) !== expected.sourceArchiveFile || !Number.isSafeInteger(expected.sourceOrdinal) || expected.sourceOrdinal < 1) evidenceErrors.push(`SOLUTION_IDENTITY_SOURCE_BINDING_FAIL:q${question.id}`);
    if (Number(question.sourceOrdinal) !== expected.sourceOrdinal) evidenceErrors.push(`SOLUTION_IDENTITY_ORDINAL_MISMATCH:q${question.id}`);
    if (!source || Number(source.sourceOrdinal) !== expected.sourceOrdinal) evidenceErrors.push(`SOLUTION_IDENTITY_ORDINAL_MISMATCH:q${question.id}`);
    if (!item) { evidenceErrors.push(`SOLUTION_IDENTITY_ROW_MISSING:q${question.id}`); continue; }
    for (const [field, value] of Object.entries(expected)) if (!equal(item[field], value)) evidenceErrors.push(`SOLUTION_IDENTITY_MISMATCH:q${question.id}:${field}`);
    if (item.inputVisibilityProfile !== 'CANDIDATE_ONLY' || item.alignmentStatus !== 'ALIGNMENT_PASS' || item.sourceSolutionMatch !== true
      || !text(item.primaryMethod) || !Array.isArray(item.decisiveSteps) || !item.decisiveSteps.length || item.decisiveSteps.some(step => !text(step))) evidenceErrors.push(`SOLUTION_IDENTITY_ALIGNMENT_FAIL:q${question.id}`);
    identityRows.push(expected);
  }
  if (identityByKey.size !== questions.length) evidenceErrors.push('SOLUTION_IDENTITY_COVERAGE_FAIL');
  if (identityData?.status !== 'PASS') evidenceErrors.push('SOLUTION_IDENTITY_STATUS_NOT_PASS');

  const mathFile = review.evidenceFiles?.mathReviewEvidence?.path
    ? path.resolve(runRoot, review.evidenceFiles.mathReviewEvidence.path)
    : path.join(runRoot, 'reports', 'math_review_evidence.json');
  if (!fs.existsSync(mathFile) || normalizeSha(review.mathReviewEvidenceSha) !== digest(fs.readFileSync(mathFile))) evidenceErrors.push('V3_MATH_SOLUTION_BINDING_FAIL');
  else {
    let mathData = null;
    try { mathData = readJson(mathFile); } catch { evidenceErrors.push('V3_MATH_EVIDENCE_JSON_INVALID'); }
    const mathByKey = new Map((mathData?.items || []).map(row => [String(row.sourceIdentityKey || ''), row]));
    for (const identity of identityRows) {
      const row = mathByKey.get(identity.sourceIdentityKey);
      const alignment = identityByKey.get(identity.sourceIdentityKey);
      if (!row || row.sourceArchiveFile !== identity.sourceArchiveFile || Number(row.sourceOrdinal) !== identity.sourceOrdinal
        || row.contentHash !== identity.contentHash || row.choicesHash !== identity.choicesHash || row.imageRefHash !== identity.imageRefHash
        || row.sourceIdentityFingerprint !== identity.sourceIdentityFingerprint
        || row.inputVisibilityProfile !== 'SOURCE_ONLY' || row.priorAnswerVisible !== false || row.sourceOnlyBlindSolve !== true
        || !text(row.independentWork) || row.primaryMethod !== alignment?.primaryMethod
        || !equal(row.decisiveSteps || [], alignment?.decisiveSteps || [])) {
        evidenceErrors.push(`V3_MATH_SOLUTION_BINDING_FAIL:${identity.sourceIdentityKey}`);
      }
    }
    if (mathByKey.size !== questions.length) evidenceErrors.push('V3_MATH_SOLUTION_BINDING_COVERAGE_FAIL');
  }

  const registry = loadActiveMetaRegistry(root);
  const metaByKey = new Map((metaData?.items || []).map(row => [String(row.sourceIdentityKey || ''), row]));
  const metaResults = [];
  for (const question of questions || []) {
    const key = String(question.sourceIdentityKey || '');
    const identity = identityRows.find(row => row.sourceIdentityKey === key);
    const row = metaByKey.get(key);
    if (!row || !identity) { evidenceErrors.push(`META_EVIDENCE_ROW_MISSING:q${question.id}`); continue; }
    const result = validateMetaRow({ row, question, identity, solutionReview: identityByKey.get(key), repoRoot: root, registry, errors: evidenceErrors });
    metaResults.push({ sourceIdentityKey: key, qid: question.id, ...result });
  }
  if (metaByKey.size !== questions.length) evidenceErrors.push('META_EVIDENCE_COVERAGE_FAIL');
  if (!['PASS', 'HOLD', 'MIGRATION_GAP'].includes(metaData?.status)) evidenceErrors.push('META_EVIDENCE_STATUS_INVALID');
  const inventoryPath = path.join(runRoot, 'reports', 'source_inventory.json');
  if (!fs.existsSync(inventoryPath) || metaData?.sourceInventorySha !== digest(fs.readFileSync(inventoryPath))) evidenceErrors.push('META_EVIDENCE_INVENTORY_STALE');
  if (!identityData || !fs.existsSync(identityPath) || metaData?.solutionIdentityEvidenceSha !== digest(fs.readFileSync(identityPath))) evidenceErrors.push('META_EVIDENCE_SOLUTION_IDENTITY_STALE');
  const allAdvanced = metaResults.length === questions.length && metaResults.every(row => row.advancedEligible);
  const migrationGapCount = metaResults.filter(row => ['BINDING_MIGRATION_GAP', 'KEY_MIGRATION_GAP', 'TRUE_TAXONOMY_GAP'].includes(row.disposition)).length;
  const advancedMetaEligible = allAdvanced && metaData?.status === 'PASS' && evidenceErrors.length === 0;
  return {
    errors: [...new Set(evidenceErrors)],
    solutionIdentityEvidenceSha: identityData && digest(fs.readFileSync(identityPath)),
    metaDecisionEvidenceSha: metaData && digest(fs.readFileSync(metaPath)),
    metaEligibility: {
      schema: 'PAST_EXAM_META_ELIGIBILITY_v1',
      basicArchiveEligible: false,
      advancedMetaEligible,
      status: advancedMetaEligible ? 'PASS' : migrationGapCount ? 'MIGRATION_GAP' : 'HOLD',
      migrationGapCount,
      solutionIdentityEvidenceSha: identityData && digest(fs.readFileSync(identityPath)),
      metaDecisionEvidenceSha: metaData && digest(fs.readFileSync(metaPath)),
      rows: metaResults,
      registryStatus: registry.status,
      registryErrors: registry.errors,
    },
  };
}

export function createMetaDecisionDraft({ questions, manifest, inventory, solutionIdentityEvidenceSha }) {
  const inventoryByKey = new Map((inventory?.questions || []).map(row => [row.sourceIdentityKey, row]));
  return {
    schema: META_DECISION_SCHEMA,
    status: 'NOT_TESTED',
    rpmLookupOrder: [...RPM_LOOKUP_ORDER],
    sourceInventorySha: '',
    solutionIdentityEvidenceSha: solutionIdentityEvidenceSha || '',
    items: (questions || []).map(question => {
      const identity = solutionIdentityFields(question, {
        sourceArchiveFile: String(manifest?.archiveRelativePath || ''),
        sourceOrdinal: Number(inventoryByKey.get(question.sourceIdentityKey)?.sourceOrdinal || question.sourceOrdinal || 0),
      });
      const row = {
        ...identity,
        primaryMethod: '',
        decisiveStep: '',
        semanticReason: '',
        decisionInputFields: [...META_DECISION_INPUT_FIELDS],
        candidateMetaFieldsExcluded: [...META_FIELDS_EXCLUDED_FROM_DECISION],
        candidateMetaVisible: false,
        decisionInputSha: '',
        disposition: 'HOLD',
        rpmLookup: { order: [...RPM_LOOKUP_ORDER], curriculum: curriculumForQuestion(question), level: '', scope: '', rpmPathStatus: 'NOT_FOUND', rpmPath: {}, crosswalkRecordId: '', crosswalkMappingStatus: 'NO_MATCH', references: [] },
        activeSearch: { status: 'NOT_TESTED', matchingProblemTypeKey: '', matchingTemplateKey: '' },
        activeMapping: { problemTypeKey: '', templateKey: '', curriculumBindingStatus: 'NOT_TESTED' },
        crossConceptDecisions: [],
        conditionDecisions: [],
        integrationReason: '',
        difficultyEvidence: { fields: { ...fieldSnapshot(question) }, reason: 'NOT_TESTED' },
        fieldProjection: { ...fieldSnapshot(question) },
      };
      return row;
    }),
  };
}

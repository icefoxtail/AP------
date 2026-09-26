import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { objectSha } from '../../pipeline-core/canonical.mjs';
import { loadActiveMetaRegistry, validateActiveMetaFields } from '../../meta-foundation/active-registry.mjs';
import {
  ADVANCED_META_FIELDS_EXCLUDED_FROM_SEMANTIC_INPUT as META_FIELDS_EXCLUDED_FROM_DECISION,
  DECISION_ISOLATED_INPUT_FIELDS as META_DECISION_INPUT_FIELDS,
  META_LOOKUP_ORDER as RPM_LOOKUP_ORDER,
  buildResolverBackedMetaEvidence,
  buildResolverDecisionEvidence,
  validateMetaFinalization, validateResolverEvidence,
} from '../../meta-foundation/rpm-active-resolver.mjs';

export const SOLUTION_IDENTITY_SCHEMA = 'PAST_EXAM_SOLUTION_IDENTITY_v1';
export const META_DECISION_SCHEMA = 'PAST_EXAM_META_DECISION_EVIDENCE_v2';
export { META_DECISION_INPUT_FIELDS, META_FIELDS_EXCLUDED_FROM_DECISION, RPM_LOOKUP_ORDER };
export { buildResolverBackedMetaEvidence, buildResolverDecisionEvidence };

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

function validateMetaRow({ row, question, identity, solutionReview, repoRoot, registry }) {
  const key = String(question.sourceIdentityKey);
  const errors = [];
  const input = row.resolverInput;
  if (row.sourceIdentityKey !== key || row.sourceArchiveFile !== identity.sourceArchiveFile || Number(row.sourceOrdinal) !== identity.sourceOrdinal) errors.push(`META_EVIDENCE_SOURCE_IDENTITY_MISMATCH:${key}`);
  for (const field of ['contentHash', 'choicesHash', 'imageRefHash', 'sourceIdentityFingerprint', 'solutionHash']) if (!equal(row[field], identity[field])) errors.push(`META_EVIDENCE_${field.toUpperCase()}_MISMATCH:${key}`);
  if (!text(row.primaryMethod) || !text(row.decisiveStep) || !text(row.semanticReason)) errors.push(`META_EVIDENCE_SEMANTIC_REASON_REQUIRED:${key}`);
  if (row.primaryMethod !== solutionReview?.primaryMethod || !(solutionReview?.decisiveSteps || []).includes(row.decisiveStep)) errors.push(`META_EVIDENCE_SOLUTION_METHOD_MISMATCH:${key}`);
  const resolution = row.resolverEvidence;
  if (!resolution) errors.push(`SHARED_META_RESOLVER_EVIDENCE_REQUIRED:${key}`);
  const resolverCheck = resolution && input ? validateResolverEvidence(input, resolution, { repoRoot, registry }) : { status: 'FAIL', errors: ['META_RESOLVER_EVIDENCE_MISSING'] };
  const advancedErrors = [...errors, ...resolverCheck.errors.map(error => `${error}:${key}`)];
  const candidateMeta = {
    standardCourse: question.standardCourse, standardUnitKey: question.standardUnitKey, subUnitKey: question.subUnitKey,
    problemTypeKey: question.problemTypeKey ?? '', templateKey: question.templateKey ?? '',
    crossConceptKeys: question.crossConceptKeys ?? [], conditionKeys: question.conditionKeys ?? [],
    integrationPattern: question.integrationPattern ?? 'NONE', integrationReason: row.integrationReason || '',
    difficultyBucket: question.difficultyBucket ?? 'UNKNOWN', difficultyConfidence: question.difficultyConfidence ?? 'UNKNOWN',
    difficultyBoundaryFlag: question.difficultyBoundaryFlag ?? 'UNKNOWN', legacyLevelCompatibility: question.legacyLevelCompatibility ?? 'UNKNOWN',
  };
  const structural = validateActiveMetaFields(candidateMeta, registry, { requireFields: true });
  const semanticFinalization = resolution ? validateMetaFinalization({
    input, resolverEvidence: resolution, difficultyEvidence: row.difficultyEvidence,
    candidateMeta, semanticMetaEvidence: row.semanticMetaEvidence, validatorReceipt: row.validatorReceipt, repoRoot, registry,
  }) : { status: 'FAIL', errors: ['META_RESOLVER_EVIDENCE_MISSING'] };
  advancedErrors.push(...semanticFinalization.errors.filter(error => error !== 'META_FINAL_CANDIDATE_REQUIRED').map(error => `${error}:${key}`));
  const disposition = resolution?.disposition || 'ROUTE_OUT';
  const advancedEligible = !advancedErrors.length && !structural.errors.length
    && semanticFinalization.status === 'PASS' && resolution?.advancedMetaEligible === true;
  return {
    disposition,
    advancedEligible,
    rpmPathExists: Boolean(resolution?.rpmPath),
    crosswalkRecordId: resolution?.crosswalkRecordId || '',
    advancedErrors: [...new Set(advancedErrors)],
    basicMetaErrors: structural.errors.map(error => `${error}:${key}`),
  };
}

export function validateCompletionEvidence({ candidateFile, questions, manifest, review, inventory, repoRoot }) {
  const root = path.resolve(repoRoot);
  const runRoot = candidateRoot(candidateFile);
  const evidenceErrors = [];
  const metaEvidenceErrors = [];
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
  const metaData = sidecar(metaPath, 'metaDecisionEvidenceSha', META_DECISION_SCHEMA, metaEvidenceErrors, 'META_DECISION_EVIDENCE_BINDING_FAIL');
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
  let mathByKey = new Map();
  if (!fs.existsSync(mathFile) || normalizeSha(review.mathReviewEvidenceSha) !== digest(fs.readFileSync(mathFile))) evidenceErrors.push('V3_MATH_SOLUTION_BINDING_FAIL');
  else {
    let mathData = null;
    try { mathData = readJson(mathFile); } catch { evidenceErrors.push('V3_MATH_EVIDENCE_JSON_INVALID'); }
    mathByKey = new Map((mathData?.items || []).map(row => [String(row.sourceIdentityKey || ''), row]));
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
  const advancedMetaErrors = [];
  const basicMetaErrors = [];
  for (const question of questions || []) {
    const key = String(question.sourceIdentityKey || '');
    const identity = identityRows.find(row => row.sourceIdentityKey === key);
    const row = metaByKey.get(key);
    if (!identity) { evidenceErrors.push(`META_EVIDENCE_SOURCE_IDENTITY_MISSING:q${question.id}`); continue; }
    if (!row) { metaEvidenceErrors.push(`META_EVIDENCE_ROW_MISSING:q${question.id}`); continue; }
    const result = validateMetaRow({ row, question, identity, solutionReview: identityByKey.get(key), repoRoot: root, registry });
    advancedMetaErrors.push(...result.advancedErrors);
    basicMetaErrors.push(...result.basicMetaErrors);
    metaResults.push({ sourceIdentityKey: key, qid: question.id, ...result });
  }
  evidenceErrors.push(...basicMetaErrors);
  if (metaByKey.size !== questions.length) metaEvidenceErrors.push('META_EVIDENCE_COVERAGE_FAIL');
  if (metaData?.schema !== META_DECISION_SCHEMA) metaEvidenceErrors.push('META_EVIDENCE_SCHEMA_INVALID');
  const inventoryPath = path.join(runRoot, 'reports', 'source_inventory.json');
  if (!fs.existsSync(inventoryPath) || metaData?.sourceInventorySha !== digest(fs.readFileSync(inventoryPath))) metaEvidenceErrors.push('META_EVIDENCE_INVENTORY_STALE');
  if (!identityData || !fs.existsSync(identityPath) || metaData?.solutionIdentityEvidenceSha !== digest(fs.readFileSync(identityPath))) metaEvidenceErrors.push('META_EVIDENCE_SOLUTION_IDENTITY_STALE');
  advancedMetaErrors.push(...metaEvidenceErrors);
  const allAdvanced = metaResults.length === questions.length && metaResults.every(row => row.advancedEligible);
  const migrationGapCount = metaResults.filter(row => row.disposition === 'RPM_PRIMARY_MIGRATION_GAP').length;
  const trueTaxonomyGapCount = metaResults.filter(row => row.disposition === 'TRUE_TAXONOMY_GAP').length;
  const routeOutCount = metaResults.filter(row => row.disposition === 'ROUTE_OUT').length;
  const advancedMetaEligible = allAdvanced && metaData?.status === 'PASS' && advancedMetaErrors.length === 0 && evidenceErrors.length === 0;
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
      trueTaxonomyGapCount,
      routeOutCount,
      advancedErrors: [...new Set(advancedMetaErrors)],
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
        resolverInput: null,
        resolverEvidence: null,
        semanticMetaEvidence: null,
        validatorReceipt: null,
        integrationReason: '',
        difficultyEvidence: null,
      };
      return row;
    }),
  };
}

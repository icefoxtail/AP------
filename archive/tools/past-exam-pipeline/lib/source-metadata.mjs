import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bytesSha, objectSha } from '../../pipeline-core/canonical.mjs';
import { examStorage } from '../../pipeline-core/archive-workspace.mjs';
import { loadActiveMetaRegistry, validateActiveMetaFields } from '../../meta-foundation/active-registry.mjs';

const defaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const text = value => String(value ?? '').trim();
export const FIRST_PASS_SCHEMA = 'PAST_EXAM_SOURCE_METADATA_FIRST_PASS_v1';
export const RECONCILIATION_SCHEMA = 'PAST_EXAM_SOLUTION_METADATA_RECONCILIATION_v1';
export const METADATA_DEFAULTS = Object.freeze({
  curriculum: '', standardCourse: '', standardUnitKey: '', standardUnit: '', standardUnitOrder: 0,
  subUnitKey: '', subUnit: '', subUnitConfidence: '', subUnitClassificationDepth: '',
  category: '', originalCategory: '', conceptClusterKey: '', problemTypeKey: '', templateKey: '',
  crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE',
  difficultyBucket: 'UNKNOWN', difficultyConfidence: 'UNKNOWN', difficultyBoundaryFlag: 'UNKNOWN',
  legacyLevelCompatibility: 'UNKNOWN', level: '', tags: ['기출'], layoutTag: 'grid', wide: false,
});
export const METADATA_FIELDS = Object.freeze(Object.keys(METADATA_DEFAULTS));
export const metadataProjection = question => Object.fromEntries(METADATA_FIELDS.map(field => [field, question[field] ?? structuredClone(METADATA_DEFAULTS[field])]));
export const sourceMetadataFingerprint = q => objectSha({ sourceIdentityKey: q.sourceIdentityKey, sourceArchiveFile: q.sourceArchiveFile || '', sourceOrdinal: q.sourceOrdinal || q.id, content: q.content, choices: q.choices || [], image: q.image || '', visualAssetBBoxOnPage: q.visualAssetBBoxOnPage ? structuredClone(q.visualAssetBBoxOnPage) : null });

export function loadSourceMetadataCatalog(root = defaultRoot) {
  const masterPath = 'docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md';
  const compiledPath = 'archive/data/master_tables/js_archive_tag_master.json';
  const source = fs.readFileSync(path.join(root, masterPath), 'utf8');
  const compiled = JSON.parse(fs.readFileSync(path.join(root, compiledPath), 'utf8'));
  const units = new Map(), subunits = new Map(), concepts = new Map();
  let course = '';
  for (const line of source.split(/\r?\n/)) {
    const heading = line.match(/^###\s+(.+)\s+\((H(?:15|22)-[A-Z0-9]+)\)\s*$/);
    if (heading) course = heading[1].trim();
    const middle = line.match(/^###\s+M([123])\s+\(중[123]\)/);
    if (middle) course = `중${middle[1]} 수학`;
    const row = line.match(/^\|\s*((?:M[123]|H(?:15|22)-[A-Z0-9]+)-\d{2})\s*\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|\s*$/);
    if (row) units.set(row[1], { key: row[1], label: row[2].trim(), order: Number(row[3]), course });
  }
  for (const row of compiled) {
    if (row.status !== 'active') continue;
    if (row.keyType === 'subUnitKey') subunits.set(row.key, row);
    if (row.keyType === 'conceptClusterKey') concepts.set(row.key, row);
  }
  for (const unit of units.values()) {
    const matches = compiled.filter(row => row.keyType === 'standardUnitKey' && row.key === unit.key && row.status === 'active');
    if (matches.length !== 1 || matches[0].labelKo !== unit.label) throw new Error(`SOURCE_METADATA_MASTER_PARITY_FAIL:${unit.key}`);
  }
  const registry = loadActiveMetaRegistry(root);
  const refs = [masterPath, compiledPath].map(file => ({ path: file, sha256: bytesSha(fs.readFileSync(path.join(root, file))) }));
  return { units, subunits, concepts, registry, refs, catalogSha: objectSha({ refs, registrySha: registry.registrySha }) };
}

function sourceContext(manifest) {
  const id = text(manifest.examId);
  const grade = text(manifest.grade) || id.match(/(?:^|_)(고[123]|중[123])(?:_|$)/)?.[1] || '';
  const rawYear = text(manifest.year) || id.match(/^(\d{2}|\d{4})_/ )?.[1] || '';
  const year = rawYear.length === 2 ? 2000 + Number(rawYear) : Number(rawYear);
  const inferred = year && grade ? (year >= 2024 + Number(grade.slice(1)) ? '2022' : '2015') : '';
  return { grade, curriculum: text(manifest.curriculum) || inferred, course: text(manifest.course) };
}

export function validateSourceMetadata(values = {}, { manifest = {}, catalog = loadSourceMetadataCatalog(), base = {} } = {}) {
  if (!values || typeof values !== 'object' || Array.isArray(values)) throw new Error('SOURCE_METADATA_VALUES_REQUIRED');
  const unknown = Object.keys(values).filter(field => !METADATA_FIELDS.includes(field));
  if (unknown.length) throw new Error(`SOURCE_METADATA_FIELD_FORBIDDEN:${unknown.join(',')}`);
  const result = { ...structuredClone(METADATA_DEFAULTS), ...metadataProjection(base), ...values };
  const context = sourceContext(manifest);
  result.curriculum = text(values.curriculum || result.curriculum || context.curriculum);
  result.standardCourse = text(values.standardCourse || result.standardCourse || context.course);
  for (const [field, value] of Object.entries(result)) {
    if (typeof METADATA_DEFAULTS[field] === 'string' && typeof value !== 'string' && field !== 'difficultyBucket') throw new Error(`SOURCE_METADATA_TYPE_INVALID:${field}`);
  }
  if (context.curriculum && result.curriculum && context.curriculum !== result.curriculum) throw new Error('SOURCE_METADATA_COHORT_MISMATCH');
  if (result.curriculum && !['2015', '2022'].includes(result.curriculum)) throw new Error('SOURCE_METADATA_CURRICULUM_INVALID');
  if (result.standardUnitKey) {
    const unit = catalog.units.get(result.standardUnitKey);
    if (!unit) throw new Error(`SOURCE_METADATA_L1_INVALID:${result.standardUnitKey}`);
    const family = result.standardUnitKey.match(/^H(15|22)-/);
    if (family && result.curriculum && family[1] !== result.curriculum.slice(-2)) throw new Error('SOURCE_METADATA_CURRICULUM_MISMATCH');
    if (/^중/.test(context.grade) && !result.standardUnitKey.startsWith(`M${context.grade.slice(1)}-`)) throw new Error('SOURCE_METADATA_GRADE_MISMATCH');
    if (/^고/.test(context.grade) && !family) throw new Error('SOURCE_METADATA_GRADE_MISMATCH');
    if (values.standardUnit && values.standardUnit !== unit.label) throw new Error('SOURCE_METADATA_L1_LABEL_MISMATCH');
    if (values.standardUnitOrder !== undefined && values.standardUnitOrder !== unit.order) throw new Error('SOURCE_METADATA_L1_ORDER_MISMATCH');
    const normalizeCourse = value => {
      const normalized = text(value).replace(/\s/g, '').replace(/Ⅱ/g, 'II').replace(/Ⅰ/g, 'I');
      return ({ '수학상': '수학(상)', '수학하': '수학(하)', '수1': '수학I', '수2': '수학II', '미적분1': '미적분I', '미적분2': '미적분II', '확통': '확률과통계' })[normalized] || normalized;
    };
    if (unit.course && result.standardCourse && result.standardCourse !== '수학' && normalizeCourse(unit.course) !== normalizeCourse(result.standardCourse)) throw new Error('SOURCE_METADATA_COURSE_MISMATCH');
    if (unit.course && context.course && context.course !== '수학' && normalizeCourse(unit.course) !== normalizeCourse(context.course)) throw new Error('SOURCE_METADATA_MANIFEST_COURSE_MISMATCH');
    result.standardUnit = unit.label; result.standardUnitOrder = unit.order;
    if (unit.course) result.standardCourse = unit.course;
    if (!result.category) result.category = unit.label;
  } else if (result.standardUnit || result.standardUnitOrder !== 0) throw new Error('SOURCE_METADATA_L1_KEY_REQUIRED');
  if (result.subUnitKey) {
    const subunit = catalog.subunits.get(result.subUnitKey);
    if (!subunit || subunit.standardUnitKey !== result.standardUnitKey) throw new Error('SOURCE_METADATA_L2_PARENT_INVALID');
    if (values.subUnit && values.subUnit !== (subunit.subUnit || subunit.labelKo)) throw new Error('SOURCE_METADATA_L2_LABEL_MISMATCH');
    result.subUnit = subunit.subUnit || subunit.labelKo;
    result.subUnitConfidence ||= 'candidate_evidence'; result.subUnitClassificationDepth ||= 'complete_candidate';
    if (!result.conceptClusterKey && catalog.concepts.has(subunit.conceptClusterKey)) result.conceptClusterKey = subunit.conceptClusterKey;
  } else if (result.subUnit || result.subUnitConfidence || result.subUnitClassificationDepth) throw new Error('SOURCE_METADATA_L2_KEY_REQUIRED');
  if (result.subUnitConfidence && !['existing_preserved', 'candidate_evidence', 'category_or_cue_inferred', 'rule_inferred'].includes(result.subUnitConfidence)) throw new Error('SOURCE_METADATA_L2_CONFIDENCE_INVALID');
  if (result.subUnitClassificationDepth && !['complete_candidate', 'complete_category', 'complete_documented', 'complete_rule'].includes(result.subUnitClassificationDepth)) throw new Error('SOURCE_METADATA_L2_DEPTH_INVALID');
  if (result.conceptClusterKey && !catalog.concepts.has(result.conceptClusterKey)) throw new Error('SOURCE_METADATA_CONCEPT_CLUSTER_INVALID');
  if (!['', '하', '중', '상'].includes(result.level)) throw new Error('SOURCE_METADATA_LEVEL_INVALID');
  if (!['grid', 'fullwidth', 'subjective-2up', 'subjective-4up'].includes(result.layoutTag) || typeof result.wide !== 'boolean') throw new Error('SOURCE_METADATA_LAYOUT_INVALID');
  if (!Array.isArray(result.tags) || result.tags.some(tag => typeof tag !== 'string' || !tag.trim())) throw new Error('SOURCE_METADATA_TAGS_INVALID');
  result.tags = [...new Set(['기출', ...result.tags])];
  const active = validateActiveMetaFields(result, catalog.registry, { requireFields: true });
  if (active.errors.length) throw new Error(`SOURCE_METADATA_CANONICAL_INVALID:${active.errors.join(',')}`);
  return result;
}

function checkAnchors(excerpts, sources, code) {
  if (!Array.isArray(excerpts) || !excerpts.length || excerpts.some(excerpt => !text(excerpt) || !sources.some(source => String(source || '').includes(excerpt)))) throw new Error(code);
}

export function buildSourceMetadataFirstPass(questions, manifest, { catalog = loadSourceMetadataCatalog() } = {}) {
  const report = { schema: FIRST_PASS_SCHEMA, status: 'SOURCE_FIRST_PASS', catalogSha: catalog.catalogSha, catalogRefs: catalog.refs, productionAuthorized: false, solutionReviewRequired: true, items: [] };
  const updated = questions.map(question => {
    const q = { ...question, sourceArchiveFile: manifest.archiveRelativePath || '', sourceOrdinal: question.sourceOrdinal || question.id };
    const input = q.initialMetadataInput; delete q.initialMetadataInput;
    if (input) {
      if (!['high', 'medium', 'low'].includes(input.confidence) || !text(input.reason)) throw new Error('SOURCE_METADATA_EVIDENCE_REQUIRED');
      checkAnchors(input.sourceExcerpts, [q.content, ...(q.choices || [])], 'SOURCE_METADATA_SOURCE_ANCHOR_REQUIRED');
      if (input.derivedFromLegacyLevel === true) throw new Error('SOURCE_METADATA_LEVEL_TO_DIFFICULTY_FORBIDDEN');
    }
    const values = validateSourceMetadata(input?.values || {}, { manifest, catalog, base: q });
    const item = { sourceIdentityKey: q.sourceIdentityKey, sourceFingerprint: sourceMetadataFingerprint(q), values, confidence: input?.confidence || 'low', reason: text(input?.reason) || 'First-pass decisions not supplied; solve-stage classification remains required.', sourceExcerpts: input?.sourceExcerpts || [], unresolvedFields: input?.unresolvedFields || [], status: input ? (values.standardUnitKey ? 'FIRST_PASS_FILLED' : 'FIRST_PASS_DEFERRED') : 'FIRST_PASS_UNCLASSIFIED', solutionReviewRequired: true };
    if (!Array.isArray(item.unresolvedFields) || item.unresolvedFields.some(row => !METADATA_FIELDS.includes(row?.field) || !text(row.reason))) throw new Error('SOURCE_METADATA_UNRESOLVED_REASON_REQUIRED');
    item.fieldStatus = Object.fromEntries(METADATA_FIELDS.map(field => {
      const value = values[field], declared = input?.unresolvedFields?.find(row => row.field === field);
      const unresolved = Boolean(declared) || value === '' || value === 'UNKNOWN' || (field === 'standardUnitOrder' && !values.standardUnitKey)
        || (['problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern'].includes(field) && !Object.hasOwn(input?.values || {}, field));
      return [field, { status: unresolved ? 'DEFERRED_TO_SOLUTION' : 'FIRST_PASS_FILLED', reason: declared?.reason || (unresolved ? 'Source reading did not establish this field; reconsider after solving.' : item.reason) }];
    }));
    const itemSha = objectSha(item); report.items.push(item);
    return { ...q, ...values, tagConfidence: item.confidence, tagStatus: 'manual_review', metadataStatus: 'SOURCE_FIRST_PASS', metadataReviewRequired: true, sourceMetadataFirstPassSha: itemSha };
  });
  report.classifiedCount = report.items.filter(item => item.status === 'FIRST_PASS_FILLED').length;
  return { questions: updated, report };
}

export function makeSourceMetadataRecheckDraft(questions) {
  return { schema: RECONCILIATION_SCHEMA, status: 'NOT_TESTED', priorTagsVisibleDuringFreshDecision: false, items: questions.filter(q => q.sourceMetadataFirstPassSha).map(q => ({ sourceIdentityKey: q.sourceIdentityKey, firstPassSha: q.sourceMetadataFirstPassSha, sourceFingerprint: sourceMetadataFingerprint(q), solutionSha: objectSha(q.solution || ''), values: {}, reason: '', solutionExcerpts: [], status: 'NOT_TESTED' })) };
}

export function reconcileSourceMetadata(questions, firstPass, decision, manifest, { catalog = loadSourceMetadataCatalog() } = {}) {
  if (firstPass.schema !== FIRST_PASS_SCHEMA || decision.schema !== RECONCILIATION_SCHEMA || decision.priorTagsVisibleDuringFreshDecision !== false) throw new Error('SOURCE_METADATA_RECHECK_CONTRACT_REQUIRED');
  const targets = questions.filter(q => q.sourceMetadataFirstPassSha);
  if (!Array.isArray(decision.items) || decision.items.length !== targets.length || new Set(decision.items.map(row => row.sourceIdentityKey)).size !== targets.length) throw new Error('SOURCE_METADATA_RECHECK_COVERAGE_FAIL');
  const report = { schema: RECONCILIATION_SCHEMA, status: 'SOLUTION_RECONCILED', catalogSha: catalog.catalogSha, productionAuthorized: false, items: [] };
  const updated = questions.map(q => {
    if (!q.sourceMetadataFirstPassSha) return q;
    const initial = firstPass.items.find(row => row.sourceIdentityKey === q.sourceIdentityKey);
    const row = decision.items.find(row => row.sourceIdentityKey === q.sourceIdentityKey);
    if (!initial || objectSha(initial) !== q.sourceMetadataFirstPassSha || row?.firstPassSha !== q.sourceMetadataFirstPassSha) throw new Error('SOURCE_METADATA_FIRST_PASS_STALE');
    if (initial.sourceFingerprint !== sourceMetadataFingerprint(q) || row.sourceFingerprint !== sourceMetadataFingerprint(q) || row.solutionSha !== objectSha(q.solution || '')) throw new Error('SOURCE_METADATA_RECHECK_INPUT_STALE');
    if (!text(q.answer) || !text(q.solution) || !text(row.reason)) throw new Error('SOURCE_METADATA_SOLUTION_REQUIRED');
    checkAnchors(row.solutionExcerpts, [q.solution], 'SOURCE_METADATA_SOLUTION_ANCHOR_REQUIRED');
    // Fresh decisions must supply a complete projection, rather than silently inheriting tentative tags.
    if (!row.values || METADATA_FIELDS.some(field => !Object.hasOwn(row.values, field))) throw new Error('SOURCE_METADATA_FRESH_PROJECTION_REQUIRED');
    const values = validateSourceMetadata(row.values, { manifest, catalog });
    if (values.layoutTag !== q.layoutTag || values.wide !== q.wide) throw new Error('SOURCE_METADATA_SOURCE_LAYOUT_PROTECTED');
    const changes = METADATA_FIELDS.filter(field => objectSha(initial.values[field]) !== objectSha(values[field])).map(field => ({ field, before: initial.values[field], after: values[field] }));
    report.items.push({ sourceIdentityKey: q.sourceIdentityKey, firstPassSha: q.sourceMetadataFirstPassSha, sourceFingerprint: row.sourceFingerprint, solutionSha: row.solutionSha, metadataSha: objectSha(values), previousMetadata: initial.values, currentMetadata: values, changes, reason: row.reason, solutionExcerpts: row.solutionExcerpts, status: changes.length ? 'ADJUSTED' : 'CONFIRMED' });
    return { ...q, ...values, metadataStatus: 'SOLUTION_RECONCILED', metadataReviewRequired: false, tagStatus: 'manual_review' };
  });
  return { questions: updated, report };
}

export function validateSourceMetadataReconciliation(candidateFile, questions) {
  const reports = path.join(examStorage(candidateFile).evidenceRoot, 'reports');
  const firstFile = path.join(reports, 'source_metadata_first_pass.json'), finalFile = path.join(reports, 'solution_metadata_reconciliation.json');
  if (!questions.some(q => q.sourceMetadataFirstPassSha || q.metadataStatus === 'SOURCE_FIRST_PASS') && !fs.existsSync(firstFile)) return [];
  if (!fs.existsSync(firstFile) || !fs.existsSync(finalFile)) return ['SOURCE_METADATA_SOLUTION_RECHECK_REQUIRED'];
  let first, final;
  try { first = JSON.parse(fs.readFileSync(firstFile)); final = JSON.parse(fs.readFileSync(finalFile)); }
  catch { return ['SOURCE_METADATA_RECHECK_RECORD_INVALID']; }
  if (first.schema !== FIRST_PASS_SCHEMA || final.schema !== RECONCILIATION_SCHEMA || final.status !== 'SOLUTION_RECONCILED') return ['SOURCE_METADATA_RECHECK_CONTRACT_INVALID'];
  const targets = questions.filter(q => q.sourceMetadataFirstPassSha || first.items?.some(row => row.sourceIdentityKey === q.sourceIdentityKey));
  const errors = [];
  if (first.items?.length !== targets.length || new Set(first.items?.map(row => row.sourceIdentityKey)).size !== targets.length) errors.push('SOURCE_METADATA_FIRST_PASS_COVERAGE_FAIL');
  if (final.items?.length !== targets.length || new Set(final.items?.map(row => row.sourceIdentityKey)).size !== targets.length) errors.push('SOURCE_METADATA_RECHECK_COVERAGE_FAIL');
  for (const q of targets) {
    const initial = first.items?.find(row => row.sourceIdentityKey === q.sourceIdentityKey), row = final.items?.find(row => row.sourceIdentityKey === q.sourceIdentityKey);
    if (q.metadataStatus !== 'SOLUTION_RECONCILED' || q.metadataReviewRequired !== false || !initial || objectSha(initial) !== q.sourceMetadataFirstPassSha || row?.firstPassSha !== q.sourceMetadataFirstPassSha || initial.sourceFingerprint !== sourceMetadataFingerprint(q) || row?.sourceFingerprint !== sourceMetadataFingerprint(q) || row?.solutionSha !== objectSha(q.solution || '') || row?.metadataSha !== objectSha(metadataProjection(q))) errors.push(`SOURCE_METADATA_RECHECK_STALE:q${q.id}`);
  }
  return errors;
}

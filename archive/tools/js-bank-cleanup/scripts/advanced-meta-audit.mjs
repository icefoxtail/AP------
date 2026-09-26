import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { loadActiveMetaRegistry, validateActiveMetaFields } from '../../meta-foundation/active-registry.mjs';

const ADVANCED_FIELDS = Object.freeze([
  'problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern',
  'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility',
]);
const normalize = value => String(value ?? '').replaceAll('\\', '/').replace(/^archive\/exams\//, '');
const sourceKey = (file, ordinal) => `${normalize(file)}#${Number(ordinal)}`;
const projection = row => Object.fromEntries(ADVANCED_FIELDS.map(key => [key, row?.[key] ?? null]));
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
}

function collectRuntimeRows(runtimeRoot) {
  const bySource = new Map();
  if (!fs.existsSync(runtimeRoot)) return bySource;
  for (const name of fs.readdirSync(runtimeRoot).filter(file => file.endsWith('.json') && file !== 'runtime-bridge-receipt.json')) {
    const doc = readJson(path.join(runtimeRoot, name));
    for (const row of doc?.records || []) {
      const key = sourceKey(row.sourceArchiveFile, row.sourceOrdinal);
      if (!row.sourceArchiveFile || !Number.isInteger(Number(row.sourceOrdinal))) continue;
      const rows = bySource.get(key) || [];
      rows.push({ packId: doc.packId || '', runtimePath: `archive/data/meta-foundation/runtime/${name}`, row });
      bySource.set(key, rows);
    }
  }
  return bySource;
}

export function loadAdvancedMetaAuditContext(repoRoot) {
  const root = path.resolve(repoRoot);
  const metadata = readJson(path.join(root, 'archive/data/question_metadata.json'));
  const metadataBySource = new Map();
  for (const row of metadata?.records || []) metadataBySource.set(sourceKey(row.sourceArchiveFile, row.sourceOrdinal), row);
  return {
    root,
    registry: loadActiveMetaRegistry(root),
    metadataBySource,
    runtimeBySource: collectRuntimeRows(path.join(root, 'archive/data/meta-foundation/runtime')),
    metadataStatus: metadata?.approvalStatus || 'MISSING',
  };
}

function auditEvidenceReference(reference, root) {
  const ref = typeof reference === 'string' ? { path: reference } : reference || {};
  const relative = String(ref.path || '').replaceAll('\\', '/');
  if (!relative || path.isAbsolute(relative) || relative.split('/').includes('..')) return { path: relative, status: 'INVALID_REFERENCE' };
  const file = path.resolve(root, relative);
  if (!file.startsWith(path.resolve(root) + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return { path: relative, status: 'MISSING' };
  const sha256 = digest(fs.readFileSync(file));
  const expected = String(ref.sha256 || '').replace(/^sha256:/, '');
  return { path: relative, sha256, status: expected ? expected === sha256 ? 'PASS' : 'STALE' : 'PRESENT_UNHASHED' };
}

export function auditAdvancedMetaQuestion({ question, sourceArchiveFile, sourceOrdinal, context }) {
  const key = sourceKey(sourceArchiveFile, sourceOrdinal);
  const metadataRecord = context.metadataBySource.get(key) || null;
  const runtimeRows = context.runtimeBySource.get(key) || [];
  const fields = question.advancedMetaFields || {};
  const presence = Object.fromEntries(ADVANCED_FIELDS.map(field => [field, Object.hasOwn(fields, field)]));
  const types = Object.fromEntries(ADVANCED_FIELDS.map(field => [field, Array.isArray(fields[field]) ? 'array' : fields[field] === null ? 'null' : typeof fields[field]]));
  const current = {
    ...fields,
    standardUnitKey: question.standardUnitKey || metadataRecord?.standardUnitKey || '',
    subUnitKey: question.subUnitKey || metadataRecord?.subUnitKey || '',
    standardCourse: question.standardCourse || metadataRecord?.standardCourse || '',
    curriculum: metadataRecord?.curriculum || metadataRecord?.curriculumKey || '',
  };
  const canonical = validateActiveMetaFields(current, context.registry, { requireFields: false });
  const metadataParity = metadataRecord
    ? equal(projection(fields), projection(metadataRecord)) ? 'PASS' : 'MISMATCH'
    : 'NO_METADATA_ROW';
  const runtimeProjections = runtimeRows.map(item => ({ ...item, matches: equal(projection(fields), projection(item.row)) }));
  const runtimeParity = !runtimeRows.length ? 'NOT_MATERIALIZED'
    : runtimeProjections.every(item => item.matches) ? 'PASS' : 'MISMATCH';
  const hasResolverEvidence = Boolean(metadataRecord?.metaResolverEvidenceSha && metadataRecord?.difficultyBlindEvidenceSha);
  const evidenceReferences = [
    ...(metadataRecord?.approvalEvidence || []),
    ...(metadataRecord?.metaResolverEvidenceRef ? [metadataRecord.metaResolverEvidenceRef] : []),
    ...(metadataRecord?.difficultyEvidenceRef ? [metadataRecord.difficultyEvidenceRef] : []),
  ].map(reference => auditEvidenceReference(reference, context.root));
  const evidenceFilesComplete = evidenceReferences.length > 0 && evidenceReferences.every(ref => ['PASS', 'PRESENT_UNHASHED'].includes(ref.status));
  const provenanceStatus = hasResolverEvidence && evidenceFilesComplete ? 'RESOLVER_EVIDENCE_REFERENCED'
    : evidenceReferences.length && evidenceFilesComplete ? 'LEGACY_EVIDENCE_FILES_PRESENT'
      : evidenceReferences.length ? 'EVIDENCE_REFERENCE_MISSING_OR_STALE' : 'NO_PROVENANCE_REFERENCE';
  return {
    sourceArchiveFile: normalize(sourceArchiveFile), sourceOrdinal: Number(sourceOrdinal), questionId: question.questionId,
    fieldPresence: presence, fieldTypes: types,
    canonicalStatus: canonical.status, canonicalErrors: canonical.errors,
    metadataStatus: metadataRecord?.metadataStatus || metadataRecord?.foundationTaxonomyStatus || 'NO_METADATA_ROW',
    provenanceStatus,
    resolverEvidenceSha: metadataRecord?.metaResolverEvidenceSha || '',
    difficultyEvidenceSha: metadataRecord?.difficultyBlindEvidenceSha || '',
    evidenceReferences,
    metadataParity,
    runtimeParity,
    runtimeRows: runtimeProjections.map(({ matches, ...row }) => ({ packId: row.packId, runtimePath: row.runtimePath, matches })),
    auditMode: 'READ_ONLY_NO_SEMANTIC_AUTOFIX',
  };
}

export function buildAdvancedMetaAudit({ files, repoRoot }) {
  const context = loadAdvancedMetaAuditContext(repoRoot);
  const items = [];
  for (const file of files || []) for (const question of file.questions || []) {
    items.push(auditAdvancedMetaQuestion({ question, sourceArchiveFile: file.relativePath, sourceOrdinal: question.originalIndex + 1, context }));
  }
  return {
    schemaVersion: 'JS_BANK_ADVANCED_META_AUDIT_v1',
    generatedAt: new Date().toISOString(), statusScope: 'READ_ONLY',
    registryStatus: context.registry.status, registryErrors: context.registry.errors,
    totals: {
      questions: items.length,
      invalidCanonical: items.filter(item => item.canonicalErrors.length).length,
      metadataParityMismatch: items.filter(item => item.metadataParity === 'MISMATCH').length,
      runtimeParityMismatch: items.filter(item => item.runtimeParity === 'MISMATCH').length,
      resolverEvidenceReferenced: items.filter(item => item.provenanceStatus === 'RESOLVER_EVIDENCE_REFERENCED').length,
    },
    items,
  };
}

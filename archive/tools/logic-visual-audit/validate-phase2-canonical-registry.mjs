import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const registry = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_2022_set_pilot_canonical_registry.json'), 'utf8'));
const inventory = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_2022_set_pilot_inventory.json'), 'utf8'));
const allowed = new Set(['NO_VISUAL', 'KEEP_EXISTING', 'REBUILD_EXISTING', 'ADD_NEW_VISUAL']);
const errors = [];
const entries = registry.entries ?? [];
const uids = entries.map((entry) => entry.questionUid);
const records = registry.records ?? [];
const activeRecords = records.filter((record) => record.isCanonical === true);
const hashFile = (relativePath) => {
  try {
    const candidate = relativePath.startsWith('archive/') || relativePath.startsWith('docs/') ? path.join(ROOT, relativePath.replaceAll('/', path.sep)) : path.join(OUT, relativePath.replaceAll('/', path.sep));
    return `sha256:${crypto.createHash('sha256').update(fs.readFileSync(candidate)).digest('hex')}`;
  } catch { return null; }
};
if (new Set(uids).size !== uids.length) errors.push('ACTIVE_CANONICAL_UID_DUPLICATE');
if (uids.length !== inventory.rows.length) errors.push('ACTIVE_CANONICAL_COVERAGE_MISMATCH');
if (entries.some((entry) => !entry.isCanonical || !allowed.has(entry.finalVisualDecision))) errors.push('ACTIVE_CANONICAL_ENTRY_INVALID');
if ((registry.canonicalBatches ?? []).some((batch) => batch.active === true || batch.isCanonical === true)) errors.push('LEGACY_BATCH_WRONGFULLY_MARKED_ACTIVE');
if (activeRecords.length !== 1) errors.push('ACTIVE_RECORD_COUNT_MUST_BE_ONE_FOR_LEGACY_CONSOLIDATION');
const activeUids = activeRecords.flatMap((record) => record.questionUids || []);
if (new Set(activeUids).size !== activeUids.length) errors.push('ACTIVE_RECORD_UID_DUPLICATE');
if (JSON.stringify([...new Set(activeUids)].sort()) !== JSON.stringify([...new Set(uids)].sort())) errors.push('ACTIVE_RECORD_ENTRY_SCOPE_MISMATCH');
if (records.some((record) => !record.recordId || !record.batchId || !Number.isSafeInteger(record.revision) || record.revision < 1 || !/^sha256:[0-9a-f]{64}$/.test(record.inputSha || ''))) errors.push('RECORD_IDENTITY_OR_INPUT_SHA_INVALID');
const byRecordId = new Map(records.map((record) => [record.recordId, record]));
for (const record of records) {
  if (record.revision === 1 && record.supersedes !== null) errors.push(`INITIAL_REVISION_SUPERSEDES:${record.recordId}`);
  if (record.revision > 1) {
    const previous = byRecordId.get(record.supersedes);
    if (!previous || previous.isCanonical || previous.batchId !== record.batchId || previous.revision !== record.revision - 1 || previous.inputSha === record.inputSha || JSON.stringify([...previous.questionUids].sort()) !== JSON.stringify([...record.questionUids].sort())) errors.push(`REVISION_LINEAGE_INVALID:${record.recordId}`);
  }
}
for (const batch of registry.canonicalBatches ?? []) if (batch.canonicalSourceFile && batch.canonicalSourceFileSha !== hashFile(batch.canonicalSourceFile)) errors.push(`CANONICAL_SOURCE_REPORT_SHA_MISMATCH:${batch.canonicalSourceFile}`);
const adjudications = registry.legacyMigration?.conflictAdjudications ?? [];
if ((registry.legacyMigration?.rawConflictCount ?? 0) !== adjudications.length) errors.push('LEGACY_CONFLICT_ADJUDICATION_COUNT_MISMATCH');
if (adjudications.some((item) => item.status !== 'ADJUDICATED_TO_ACTIVE_UID_RECORD' || !item.selectedSourceReportSha || !item.selectedDecision)) errors.push('LEGACY_CONFLICT_ADJUDICATION_INCOMPLETE');
if (registry.legacyMigration?.unresolvedConflictCount > 0 || (registry.status || '').startsWith('FAIL')) errors.push('LEGACY_CONFLICT_OR_REGISTRY_STATUS_FAIL');
const result = { generatedAtKst: '2026-09-06', phase: 'LOGIC_VISUAL_PHASE_2_CANONICAL_REGISTRY_VALIDATION', status: errors.length ? 'FAIL_CANONICAL_REGISTRY_VALIDATION' : 'PASS_CANONICAL_REGISTRY_VALIDATION', activeCanonicalEntryCount: entries.length, activeCanonicalRecordCount: activeRecords.length, activeCanonicalUidDuplicateCount: uids.length - new Set(uids).size, legacyRawConflictCount: registry.legacyMigration?.rawConflictCount ?? null, legacyUnresolvedConflictCount: registry.legacyMigration?.unresolvedConflictCount ?? null, errors };
fs.writeFileSync(path.join(OUT, 'phase2_2022_set_pilot_canonical_registry_validation.json'), JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;

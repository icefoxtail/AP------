import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const read = (name) => JSON.parse(fs.readFileSync(path.join(OUT, name), 'utf8'));
const bytesSha = (bytes) => `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
const objectSha = (value) => bytesSha(Buffer.from(JSON.stringify(value), 'utf8'));
const write = (name, value) => fs.writeFileSync(path.join(OUT, name), JSON.stringify(value, null, 2) + '\n', 'utf8');

const inventory = read('phase2_2022_set_pilot_inventory.json');
const files = fs.readdirSync(OUT).filter((name) => /^phase2_batch_\d+.*requirement_adjudication\.json$/.test(name)).sort();
const explicitCanonicalReportByBatch = new Map([
  [1, 'phase2_batch_01_requirement_adjudication.json'],
  [2, 'phase2_batch_02_requirement_adjudication.json'],
  [3, 'phase2_batch_03_requirement_adjudication.json'],
  [4, 'phase2_batch_04_requirement_adjudication.json'],
  [5, 'phase2_batch_05_final_requirement_adjudication.json'],
  [6, 'phase2_batch_06_final_requirement_adjudication.json'],
  [7, 'phase2_batch_07_final_requirement_adjudication.json'],
  [8, 'phase2_batch_08_final_requirement_adjudication.json'],
  [9, 'phase2_batch_09_requirement_adjudication.json'],
  [10, 'phase2_batch_10_requirement_adjudication.json'],
  [11, 'phase2_batch_11_requirement_adjudication.json']
]);
const byBatch = new Map();
for (const file of files) {
  const batchNo = Number(file.match(/^phase2_batch_(\d+)/)?.[1]);
  if (!Number.isSafeInteger(batchNo)) continue;
  if (!byBatch.has(batchNo)) byBatch.set(batchNo, []);
  byBatch.get(batchNo).push(file);
}
const selected = [...byBatch.keys()].sort((a, b) => a - b).map((batchNo) => {
  const canonicalName = explicitCanonicalReportByBatch.get(batchNo);
  if (!canonicalName || !byBatch.get(batchNo).includes(canonicalName)) throw new Error(`EXPLICIT_CANONICAL_REPORT_MISSING:${batchNo}`);
  return { batchNo, canonicalName, allNames: byBatch.get(batchNo).sort(), selectionMethod: 'EXPLICIT_RECONCILIATION_MANIFEST' };
});

const allOccurrences = new Map();
for (const file of files) {
  const report = read(file);
  for (const entry of report.entries ?? []) {
    if (!entry.questionUid) continue;
    if (!allOccurrences.has(entry.questionUid)) allOccurrences.set(entry.questionUid, []);
    allOccurrences.get(entry.questionUid).push({
      file,
      reportSha: bytesSha(fs.readFileSync(path.join(OUT, file))),
      finalVisualRequirement: entry.finalVisualRequirement ?? null,
      visualAction: entry.visualAction ?? null,
      status: entry.status ?? null
    });
  }
}
const rawConflicts = [];
for (const [questionUid, occurrences] of allOccurrences) {
  const decisions = new Set(occurrences.map((entry) => `${entry.finalVisualRequirement}|${entry.visualAction}`));
  if (decisions.size > 1) rawConflicts.push({ questionUid, occurrences, conflictType: 'LEGACY_DECISION_CONFLICT' });
}

const normalize = (entry) => {
  if (entry.finalVisualRequirement === 'VISUAL_EXEMPT' || entry.finalVisualRequirement === 'NO_VISUAL') return 'NO_VISUAL';
  if (entry.finalVisualRequirement === 'KEEP_EXISTING' || entry.visualAction === 'KEEP_EXISTING') return 'KEEP_EXISTING';
  if (entry.visualAction === 'ADD' || entry.visualAction === 'ADD_NEW_VISUAL') return 'ADD_NEW_VISUAL';
  if (entry.visualAction === 'REBUILD_EXISTING') return 'REBUILD_EXISTING';
  return null;
};

const canonicalBatchRecords = [];
const unmapped = [];
const canonicalUidMap = new Map();
const legacyCanonicalOverlaps = [];
for (const { batchNo, canonicalName, allNames, selectionMethod } of selected) {
  const report = read(canonicalName);
  const reportSha = bytesSha(fs.readFileSync(path.join(OUT, canonicalName)));
  const entries = [];
  for (const entry of report.entries ?? []) {
    const decision = normalize(entry);
    if (!decision) unmapped.push({ batchNo, sourceFile: canonicalName, questionUid: entry.questionUid, entry });
    const normalized = { questionUid: entry.questionUid, finalVisualDecision: decision, legacySourceFile: canonicalName, legacyBatchNo: batchNo, revision: 1, supersedes: null, isCanonical: false, sourceReportSha: reportSha };
    entries.push(normalized);
    const previous = canonicalUidMap.get(entry.questionUid);
    if (previous) legacyCanonicalOverlaps.push({ questionUid: entry.questionUid, previous, replacement: normalized, resolution: 'CONSOLIDATED_IN_ACTIVE_UID_REGISTRY' });
    canonicalUidMap.set(entry.questionUid, normalized);
  }
  canonicalBatchRecords.push({
    recordId: `legacy-phase2-batch-${batchNo}:r1`,
    batchId: `legacy-phase2-batch-${batchNo}`,
    batchNo,
    revision: 1,
    supersedes: null,
    inputSha: objectSha({ batchNo, canonicalName, reportSha, questionUids: entries.map((entry) => entry.questionUid).sort() }),
    isCanonical: false,
    active: false,
    legacy: true,
    canonicalSourceFile: canonicalName,
    canonicalSourceFileSha: reportSha,
    selectionMethod,
    supersededSourceFiles: allNames.filter((name) => name !== canonicalName),
    questionUidCount: entries.length,
    questionUids: entries.map((entry) => entry.questionUid),
    activeQuestionUids: [],
    supersededQuestionUids: entries.map((entry) => entry.questionUid)
  });
}

const inventoryUidSet = new Set(inventory.rows.map((row) => row.questionUid));
const unknownCanonicalUids = [...canonicalUidMap.keys()].filter((uid) => !inventoryUidSet.has(uid));
const missingCanonicalUids = [...inventoryUidSet].filter((uid) => !canonicalUidMap.has(uid));
const chosenEntries = [...canonicalUidMap.values()].sort((a, b) => a.questionUid.localeCompare(b.questionUid));
const activeBatchId = 'legacy-phase2-active-reconciled';
const activeInputSha = objectSha({ inventorySha: bytesSha(fs.readFileSync(path.join(OUT, 'phase2_2022_set_pilot_inventory.json'))), entries: chosenEntries });
const activeRecord = {
  recordId: `${activeBatchId}:r1`,
  batchId: activeBatchId,
  batchNo: Math.max(...selected.map((item) => item.batchNo), 0),
  revision: 1,
  supersedes: null,
  inputSha: activeInputSha,
  isCanonical: true,
  legacy: true,
  questionUids: chosenEntries.map((entry) => entry.questionUid)
};
const finalEntries = chosenEntries.map((entry) => ({ ...entry, recordId: activeRecord.recordId, batchId: activeRecord.batchId, inputSha: activeRecord.inputSha, isCanonical: true, active: true }));
const conflictAdjudications = rawConflicts.map((conflict) => {
  const chosen = finalEntries.find((entry) => entry.questionUid === conflict.questionUid);
  return {
    questionUid: conflict.questionUid,
    status: chosen ? 'ADJUDICATED_TO_ACTIVE_UID_RECORD' : 'BLOCKED_NO_ACTIVE_RECORD',
    selectedSourceFile: chosen?.legacySourceFile ?? null,
    selectedDecision: chosen?.finalVisualDecision ?? null,
    selectedSourceReportSha: chosen?.sourceReportSha ?? null,
    basis: 'Explicit per-batch reconciliation manifest plus consolidated active UID record; no filename ordering is used at validation time.',
    occurrenceCount: conflict.occurrences.length
  };
});
const unresolvedConflicts = conflictAdjudications.filter((item) => item.status !== 'ADJUDICATED_TO_ACTIVE_UID_RECORD');
const records = [...canonicalBatchRecords, activeRecord];
const registry = {
  generatedAtKst: '2026-09-06',
  registryVersion: 'PHASE2_CANONICAL_BATCH_REGISTRY_v2',
  status: unknownCanonicalUids.length === 0 && missingCanonicalUids.length === 0 && unmapped.length === 0 && unresolvedConflicts.length === 0 ? 'PASS_CANONICAL_REGISTRY_WITH_LEGACY_RECONCILIATION' : 'FAIL_CANONICAL_REGISTRY',
  sourceInventory: 'phase2_2022_set_pilot_inventory.json',
  inventoryCount: inventory.rows.length,
  canonicalBatchCount: canonicalBatchRecords.length,
  activeCanonicalRegistryMode: 'UID_ENTRY_LEVEL_WITH_EXPLICIT_ACTIVE_RECORD',
  activeCanonicalQuestionCount: finalEntries.length,
  canonicalQuestionCount: finalEntries.length,
  canonicalQuestionUidSetSha: objectSha(finalEntries.map((entry) => entry.questionUid)),
  records,
  canonicalBatches: canonicalBatchRecords,
  entries: finalEntries,
  legacyMigration: {
    status: unresolvedConflicts.length ? 'LEGACY_CONFLICTS_UNRESOLVED' : 'CONFLICTS_AND_OVERLAPS_RECONCILED_EXPLICITLY',
    selectionRule: 'Explicit per-batch reconciliation manifest; active membership is consolidated in one UID record. Higher batch/file name ordering is never an eligibility rule.',
    rawReportCount: files.length,
    duplicateOccurrenceUidCount: [...allOccurrences.values()].filter((occurrences) => occurrences.length > 1).length,
    rawConflictCount: rawConflicts.length,
    rawConflicts,
    conflictAdjudications,
    unresolvedConflictCount: unresolvedConflicts.length,
    legacyCanonicalOverlapCount: legacyCanonicalOverlaps.length,
    legacyCanonicalOverlaps,
    unmapped,
    unknownCanonicalUids,
    missingCanonicalUids
  }
};
registry.registrySha = objectSha(registry);
write('phase2_2022_set_pilot_canonical_registry.json', registry);
write('phase2_2022_set_pilot_legacy_reconciliation.json', {
  generatedAtKst: registry.generatedAtKst,
  status: registry.status,
  registrySha: registry.registrySha,
  rawReportFiles: files,
  selectedCanonicalReports: selected,
  rawConflictCount: rawConflicts.length,
  conflictAdjudications,
  rawConflicts,
  legacyCanonicalOverlapCount: legacyCanonicalOverlaps.length,
  legacyCanonicalOverlaps,
  unknownCanonicalUids,
  missingCanonicalUids,
  unmapped,
  note: 'Legacy reports are selected by an explicit reconciliation manifest and consolidated into one active UID record. Future revisions must use recordId, revision, supersedes, inputSha, and actual evidence hashes.'
});
console.log(JSON.stringify({ status: registry.status, inventoryCount: registry.inventoryCount, canonicalQuestionCount: registry.canonicalQuestionCount, canonicalBatchCount: registry.canonicalBatchCount, rawConflictCount: rawConflicts.length, legacyCanonicalOverlapCount: legacyCanonicalOverlaps.length, duplicateOccurrenceUidCount: registry.legacyMigration.duplicateOccurrenceUidCount, activeRecordCount: records.filter((record) => record.isCanonical).length, missingCanonicalCount: missingCanonicalUids.length, registrySha: registry.registrySha }, null, 2));
if (!registry.status.startsWith('PASS_CANONICAL_REGISTRY')) process.exitCode = 1;

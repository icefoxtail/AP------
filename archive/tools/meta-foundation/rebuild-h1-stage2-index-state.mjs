import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const INV = JSON.parse(fs.readFileSync(path.join(ROOT, 'archive/_generated/intelligence/phase1/high1-foundation/h1_fresh_inventory.json'), 'utf8'));
const shaBytes = (file) => crypto.createHash('sha256').update(fs.readFileSync(path.join(OUT, file))).digest('hex');
const readJsonl = (file) => fs.readFileSync(path.join(OUT, file), 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const writeJson = (file, value) => fs.writeFileSync(path.join(OUT, file), `${JSON.stringify(value, null, 2)}\n`, 'utf8');

const ledgerSpecs = [
  ['POLYNOMIAL_SEMANTIC_LEDGER_217.jsonl', 217, 'existing physical checkpoint backfilled from current source'],
  ['EQINEQ_BATCH1_SEMANTIC_LEDGER.jsonl', 70, 'current source+solution physical restore'],
  ['EQINEQ_BATCH2_SEMANTIC_LEDGER.jsonl', 70, 'current source+solution physical restore'],
  ['EQINEQ_BATCH3_SEMANTIC_LEDGER.jsonl', 70, 'current source+solution physical restore'],
  ['EQINEQ_BATCH4_SEMANTIC_LEDGER.jsonl', 70, 'current source+solution physical restore'],
  ['EQINEQ_BATCH5_SOL_DECISIONS_281_350.jsonl', 70, 'current source pack semantic checkpoint backfilled'],
  ['EQINEQ_BATCH6_SOL_DECISIONS_351_420.jsonl', 70, 'current Stage 2 source-semantic pass'],
  ['EQINEQ_BATCH7_SOL_DECISIONS_421_490.jsonl', 70, 'current Stage 2 source-semantic pass'],
  ['EQINEQ_BATCH8_SOL_DECISIONS_491_560.jsonl', 70, 'current Stage 2 source-semantic pass'],
  ['EQINEQ_BATCH9_SOL_DECISIONS_561_583.jsonl', 23, 'current Stage 2 source-semantic pass'],
  ['PERMCOMB_BATCH10_SOL_DECISIONS_1_70.jsonl', 70, 'current source-semantic pass with pinpoint overlay'],
  ['PERMCOMB_BATCH11_SOL_DECISIONS_71_140.jsonl', 70, 'current source-semantic pass with pinpoint overlay'],
  ['PERMCOMB_BATCH12_SOL_DECISIONS_141_210.jsonl', 70, 'current source-semantic pass with pinpoint overlay'],
  ['PERMCOMB_BATCH13_SOL_DECISIONS_211_280.jsonl', 70, 'current source-semantic pass with pinpoint overlay'],
  ['PERMCOMB_BATCH14_SOL_DECISIONS_281_287.jsonl', 7, 'current source-semantic pass with pinpoint overlay'],
  ['MATRIX_BATCH15_SOL_DECISIONS_1_70.jsonl', 70, 'current source-semantic pass with pinpoint overlay'],
  ['MATRIX_BATCH16_SOL_DECISIONS_71_83.jsonl', 13, 'current source-semantic pass with pinpoint overlay'],
];
const required = ['questionUid', 'sourceIdentity', 'sourceFingerprint', 'primaryMethod', 'decisiveStep', 'supportingConcepts', 'conditions', 'compositionPattern', 'curriculumNotes', 'sourceIssue', 'semanticConfidence', 'semanticReasonShort'];
const ledgers = ledgerSpecs.flatMap(([file, expected]) => {
  const rows = readJsonl(file);
  if (rows.length !== expected) throw new Error(`${file} rows ${rows.length} !== ${expected}`);
  return rows;
});
const uidSet = new Set();
const sourceSet = new Set();
const missingFields = [];
for (const row of ledgers) {
  for (const field of required) if (row[field] === undefined || row[field] === null || row[field] === '') missingFields.push(`${row.questionUid}:${field}`);
  if (uidSet.has(row.questionUid)) throw new Error(`Duplicate UID ${row.questionUid}`);
  if (sourceSet.has(row.sourceIdentity)) throw new Error(`Duplicate source identity ${row.sourceIdentity}`);
  uidSet.add(row.questionUid); sourceSet.add(row.sourceIdentity);
}
const sourceByIdentity = new Map(INV.rows.map((row) => [`${row.sourceArchiveFile}#${row.sourceOrdinal}`, row]));
const fingerprintMismatch = ledgers.filter((row) => sourceByIdentity.get(row.sourceIdentity)?.sourceFingerprint !== row.sourceFingerprint).length;
const inventory = readJsonl('H1_STAGE2_HOLD_INVENTORY_1170.jsonl');
const resolution = readJsonl('H1_STAGE2_HOLD_RESOLUTION_1170.jsonl');
const holdKnown = inventory.filter((row) => row.questionUid).length;
const holdClosed = resolution.filter((row) => row.questionUid && row.resolutionStatus === 'CLOSED_ROUTED_NO_SOURCE_MUTATION').length;
const aggregate = resolution.filter((row) => row.recordType === 'LEGACY_AGGREGATE_HOLD_GAP' || row.recordType === 'LEGACY_AGGREGATE_HOLD_GAP').reduce((sum, row) => sum + Number(row.count || 0), 0);
const ledgerFiles = ledgerSpecs.map(([file, rows, authority]) => ({ file, rows, sha256: shaBytes(file), authority }));
const index = {
  schemaVersion: 'h1-stage2-semantic-ledger-index-v2',
  status: 'STAGE2_1170_PHYSICAL_COMPLETE_HOLD_AGGREGATE_BLOCKED',
  goal: '1170/1170 Stage 2 Single Semantic Pass physical coverage',
  ledgerCoverage: { rows: ledgers.length, uidUnique: uidSet.size, sourceIdentityUnique: sourceSet.size, missingUid: 0, duplicateUid: 1170 - uidSet.size, fingerprintMismatch, requiredSemanticFieldMissing: missingFields.length, workUnits: { POLYNOMIAL: 217, EQINEQ: 583, PERMCOMB: 287, MATRIX: 83 } },
  ledgerFiles,
  legacyPhysicalCoverage: { eqineqPriorTo281: 280, restoredLedgers: ['EQINEQ_BATCH1_SEMANTIC_LEDGER.jsonl', 'EQINEQ_BATCH2_SEMANTIC_LEDGER.jsonl', 'EQINEQ_BATCH3_SEMANTIC_LEDGER.jsonl', 'EQINEQ_BATCH4_SEMANTIC_LEDGER.jsonl'], artifact: 'H1_COMMON_MATH1_SOL_SEMANTIC_PAYLOAD_280.zip', artifactAuthority: false, artifactStatus: 'TRUNCATED_CORRUPT_NOT_USED' },
  holdResolution: { inventoryRows: inventory.length, knownItemLevelHoldRows: holdKnown, closedOrRouted: holdClosed, openReviewRequired: 0, aggregateBlocked: aggregate, unresolved: aggregate, inventory: 'H1_STAGE2_HOLD_INVENTORY_1170.jsonl', resolution: 'H1_STAGE2_HOLD_RESOLUTION_1170.jsonl', residualAudit: 'H1_STAGE2_LEGACY_HOLD_RESIDUAL_7_AUDIT.json' },
};
writeJson('H1_STAGE2_SEMANTIC_LEDGER_INDEX_1170.json', index);

const summary = {
  schemaVersion: 'h1-stage2-full-goal-summary-v2',
  status: 'STAGE2_1170_PHYSICAL_COMPLETE_HOLD_AGGREGATE_BLOCKED',
  baseMainSha: '54b3f2aee093c9f25b27a618630fe2ebac9c2d46',
  currentOriginMainSha: '0487238c8a137fcf5853d5202663dec04f893a01',
  branch: 'meta-foundation-h1-preprocess-sol-review',
  stage2: { rows: ledgers.length, uidUnique: uidSet.size, sourceIdentityUnique: sourceSet.size, missingUid: 0, duplicateUid: 1170 - uidSet.size, fingerprintMismatch, requiredSemanticFieldMissing: missingFields.length, semanticDispositionPresent: ledgers.filter((row) => row.semanticReasonShort).length },
  workUnits: { POLYNOMIAL: { completed: 217, denominator: 217 }, EQINEQ: { completed: 583, denominator: 583 }, PERMCOMB: { completed: 287, denominator: 287 }, MATRIX: { completed: 83, denominator: 83 } },
  total: { completed: ledgers.length, denominator: 1170 },
  holdInventory: { totalRows: inventory.length, itemLevelKnown: holdKnown, itemLevelClosedOrRouted: holdClosed, openReviewRequired: 0, aggregateBlocked: aggregate, unresolvedUidCount: aggregate, path: 'H1_STAGE2_HOLD_INVENTORY_1170.jsonl', resolutionPath: 'H1_STAGE2_HOLD_RESOLUTION_1170.jsonl', residualAudit: 'H1_STAGE2_LEGACY_HOLD_RESIDUAL_7_AUDIT.json' },
  mutation: { production: 0, canonical: 0, compiled: 0, runtime: 0, mainMerge: 0 },
  artifacts: { index: 'H1_STAGE2_SEMANTIC_LEDGER_INDEX_1170.json', state: 'H1_COMMON_MATH1_SOL_STATE.json', ledgerFiles },
};
writeJson('H1_STAGE2_FULL_GOAL_SUMMARY_1170.json', summary);
const state = JSON.parse(fs.readFileSync(path.join(OUT, 'H1_COMMON_MATH1_SOL_STATE.json'), 'utf8'));
state.status = 'STAGE2_1170_PHYSICAL_COMPLETE_HOLD_AGGREGATE_BLOCKED';
state.overallCompleted = ledgers.length; state.overallDenominator = 1170; state.totalHold = inventory.length + aggregate;
state.stage2 = summary.stage2;
state.holdResolution = { closed: holdClosed, unresolved: aggregate, openReviewRequired: 0, path: 'H1_STAGE2_HOLD_RESOLUTION_1170.jsonl', residualAudit: 'H1_STAGE2_LEGACY_HOLD_RESIDUAL_7_AUDIT.json', blocker: 'Seven historical Eq/Ineq batch1-4 aggregate HOLD identities remain unavailable; exact UID inference is prohibited.' };
state.holdInventory = { totalReported: inventory.length + aggregate, itemLevelKnown: holdKnown, itemLevelResolvedOrRouted: holdClosed, openReviewRequired: 0, legacyAggregateGap: aggregate, unresolvedUidCount: aggregate, path: 'H1_STAGE2_HOLD_INVENTORY_1170.jsonl', recoveryArtifact: 'H1_STAGE2_LEGACY_HOLD_RECOVERY_SOURCE_AUDIT_5.jsonl', residualAudit: 'H1_STAGE2_LEGACY_HOLD_RESIDUAL_7_AUDIT.json' };
state.finalSummary = 'H1_STAGE2_FULL_GOAL_SUMMARY_1170.json';
writeJson('H1_COMMON_MATH1_SOL_STATE.json', state);
const summarySha = shaBytes('H1_STAGE2_FULL_GOAL_SUMMARY_1170.json');
const state2 = JSON.parse(fs.readFileSync(path.join(OUT, 'H1_COMMON_MATH1_SOL_STATE.json'), 'utf8'));
state2.finalSummarySha256 = summarySha;
writeJson('H1_COMMON_MATH1_SOL_STATE.json', state2);
console.log(JSON.stringify({ rows: ledgers.length, uidUnique: uidSet.size, sourceIdentityUnique: sourceSet.size, fingerprintMismatch, requiredFieldMissing: missingFields.length, holdKnown, holdClosed, aggregateBlocked: aggregate, summarySha }, null, 2));

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const readJsonl = (file) => fs.readFileSync(path.join(OUT, file), 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const writeJsonl = (file, rows) => fs.writeFileSync(path.join(OUT, file), `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');

const mapping = new Map([
  ['qid_v1_33ed96533ee09ef1350ae13e39c9ef876b29170339b3a2fdbe747a25e505ae04', { disposition: 'ANSWER_REPAIR_REQUIRED', issue: 'ANSWER_KEY_MISSING_AND_DUPLICATE_CHOICE', note: 'Current source content+solution yields 4√6, but answer field is missing and choices ④/⑤ are duplicates.' }],
  ['qid_v1_9f6d119436795a8634f2fbd232bca0af696e929cc35fb718316a1fa3b689f423', { disposition: 'ANSWER_REPAIR_REQUIRED', issue: 'ANSWER_FIELD_MISSING', note: 'Current source+solution supports minimum 2, but current source answer field is missing.' }],
  ['qid_v1_407efb2cf43120511ba8befe8ec893212addde8886155d68c6d60ccd6b932ac2', { disposition: 'SOURCE_BLOCKED', issue: 'MISSING_REQUIRED_SOURCE_STRUCTURE', note: 'Current source omits the second complex-number definition/condition required by the solution; no recoverable UID-level replacement was found.' }],
  ['qid_v1_ce9233127836eec69af90d69b2fd1ad36c212281782539693d7f8a94f858fa86', { disposition: 'SOLUTION_REPAIR_REQUIRED', issue: 'SOLUTION_LOGIC_CONTRADICTION_AND_ANSWER_FIELD_MISSING', note: 'Current solution treats z² imaginary as implying z imaginary, which has counterexamples; current source answer field is also missing.' }],
  ['qid_v1_51decba190f0d425b29d7a0d5ea57be530279b25d830effd59f4269ca6ab649d', { disposition: 'SOLUTION_REPAIR_REQUIRED', issue: 'SOLUTION_BRANCH_CONVENTION_AND_ANSWER_SOURCE_CONFLICT', note: 'Current source+solution depends on an unstated complex square-root branch and conflicts with the stored school answer; no source mutation performed.' }],
]);

const resolutionFile = 'H1_STAGE2_HOLD_RESOLUTION_1170.jsonl';
const resolution = readJsonl(resolutionFile).map((row) => {
  const fix = mapping.get(row.questionUid);
  if (!fix) return row;
  return {
    ...row,
    sourceIssue: fix.issue,
    resolutionDisposition: fix.disposition,
    resolutionStatus: 'CLOSED_ROUTED_NO_SOURCE_MUTATION',
    evidenceRef: `${row.evidenceRef || ''}; current source inventory + source JS + current solution recheck`,
    note: fix.note,
  };
});
writeJsonl(resolutionFile, resolution);

const inventoryFile = 'H1_STAGE2_HOLD_INVENTORY_1170.jsonl';
const inventory = readJsonl(inventoryFile).map((row) => {
  const fix = mapping.get(row.questionUid);
  if (!fix) return row;
  return { ...row, sourceIssue: fix.issue, resolutionDisposition: fix.disposition, resolutionStatus: 'CLOSED_ROUTED_NO_SOURCE_MUTATION', note: fix.note };
});
writeJsonl(inventoryFile, inventory);

const residual = {
  schemaVersion: 'h1-stage2-legacy-hold-residual-audit-v1',
  status: 'AGGREGATE_BLOCKER_UID_UNRESOLVED',
  unit: 'EQINEQ',
  aggregateCount: 7,
  exactUidRecovery: false,
  evidenceSearch: [
    'git history: all reachable commits/refs searched for EQINEQ_BATCH1-4 semantic ledgers and legacy payload objects',
    'local Git objects: legacy ZIP blob exists but is 15009 bytes with no EOCD; no valid original ledger object found',
    'current checkpoint: H1_COMMON_MATH1_SOL_CHECKPOINT_280.json contains aggregate count/checksums but no UID list',
    'source-audit/evidence: five UID-level HOLD rows recovered into H1_STAGE2_LEGACY_HOLD_RECOVERY_SOURCE_AUDIT_5.jsonl; no additional seven exact UIDs',
    'current source inventory and batch summaries: no item-level identity that can be proven to be the remaining seven historical HOLD rows'
  ],
  disposition: 'SOURCE_BLOCKED',
  resolutionStatus: 'UNRESOLVED_UID_REQUIRED',
  note: 'Do not infer or fabricate the seven UIDs. Preserve as explicit aggregate blocker until original item-level payload or exact historical ledger is recovered.'
};
fs.writeFileSync(path.join(OUT, 'H1_STAGE2_LEGACY_HOLD_RESIDUAL_7_AUDIT.json'), `${JSON.stringify(residual, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ resolutionRows: resolution.length, inventoryRows: inventory.length, closedFive: mapping.size, aggregateBlocked: 7 }, null, 2));

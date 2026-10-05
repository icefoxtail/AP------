import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const INVENTORY = path.join(ROOT, 'archive', '_generated', 'intelligence', 'phase1', 'high1-foundation', 'h1_fresh_inventory.json');
const OUT = path.join(ROOT, 'archive', '_generated', 'intelligence', 'phase1', 'high1-foundation', 'sol-checkpoint');
const DECISION_FILES = [
  'H1_SEMANTIC_REPAIR_EQINEQ_DECISIONS_001_035.jsonl',
  'H1_SEMANTIC_REPAIR_EQINEQ_DECISIONS_036_070.jsonl',
  'H1_SEMANTIC_REPAIR_EQINEQ_DECISIONS_071_105.jsonl',
  'H1_SEMANTIC_REPAIR_EQINEQ_DECISIONS_106_140.jsonl',
  'H1_SEMANTIC_REPAIR_EQINEQ_DECISIONS_141_175.jsonl',
  'H1_SEMANTIC_REPAIR_EQINEQ_DECISIONS_176_210.jsonl',
  'H1_SEMANTIC_REPAIR_EQINEQ_DECISIONS_211_245.jsonl',
  'H1_SEMANTIC_REPAIR_EQINEQ_DECISIONS_246_280.jsonl',
];
const REQUIRED = [
  'primaryMethod',
  'decisiveStep',
  'supportingConcepts',
  'conditions',
  'compositionPattern',
  'curriculumNotes',
  'sourceIssue',
  'semanticConfidence',
  'semanticReasonShort',
  'reviewBasis',
];

function sha(value) {
  return crypto.createHash('sha256').update(String(value), 'utf8').digest('hex');
}

function readJsonl(file) {
  return fs.readFileSync(path.join(OUT, file), 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
}

const inventory = JSON.parse(fs.readFileSync(INVENTORY, 'utf8'));
const selected = inventory.rows
  .filter((row) => ['H15-SA-04', 'H15-SA-05', 'H15-SA-06', 'H15-SA-07', 'H15-SA-08', 'H15-SA-13'].includes(row.currentStandardUnitKey))
  .concat(inventory.rows.filter((row) => row.currentStandardUnitKey === 'H22-C-04').slice(0, 33));
if (selected.length !== 280) throw new Error(`Expected 280 Eq/Ineq source rows, got ${selected.length}`);

const decisions = DECISION_FILES.flatMap(readJsonl);
if (decisions.length !== 280) throw new Error(`Expected 280 direct decision rows, got ${decisions.length}`);
const decisionByIndex = new Map();
for (const decision of decisions) {
  if (!Number.isInteger(decision.workIndex) || decision.workIndex < 1 || decision.workIndex > 280) throw new Error(`Invalid workIndex ${decision.workIndex}`);
  if (decisionByIndex.has(decision.workIndex)) throw new Error(`Duplicate decision workIndex ${decision.workIndex}`);
  for (const field of REQUIRED) if (!(field in decision)) throw new Error(`Decision ${decision.workIndex} missing ${field}`);
  if (decision.reviewBasis !== 'DIRECT_SOURCE_SOLUTION_SEMANTIC_REVIEW') throw new Error(`Decision ${decision.workIndex} lacks direct review basis`);
  decisionByIndex.set(decision.workIndex, decision);
}
for (let workIndex = 1; workIndex <= 280; workIndex += 1) if (!decisionByIndex.has(workIndex)) throw new Error(`Missing direct decision ${workIndex}`);

const rows = selected.map((source, index) => {
  const workIndex = index + 1;
  const decision = decisionByIndex.get(workIndex);
  const sourceIdentity = `${source.sourceArchiveFile}#${source.sourceOrdinal}`;
  const contentHash = sha(source.content ?? '');
  const solutionHash = sha(source.solution ?? '');
  return {
    schemaVersion: 'h1-stage2-direct-source-solution-semantic-repair-v1',
    authority: 'DIRECT_SOURCE_SOLUTION_SEMANTIC_REVIEW',
    workIndex,
    questionUid: source.questionUid,
    sourceIdentity,
    sourceArchiveFile: source.sourceArchiveFile,
    sourceOrdinal: source.sourceOrdinal,
    sourceFingerprint: source.sourceFingerprint,
    sourceFileSha256: source.sourceJsSha256,
    imageDependencyRefs: source.image ? [source.image] : [],
    inputBundleSha: sha(JSON.stringify({ questionUid: source.questionUid, sourceIdentity, sourceFingerprint: source.sourceFingerprint, contentHash, solutionHash })),
    contentHash,
    solutionHash,
    curriculum: source.curriculum,
    courseKey: source.courseKey,
    sourceStandardUnitKey: source.currentStandardUnitKey,
    sourceSubUnitKey: source.currentSubUnitKey,
    ...decision,
    forbiddenSameStageInputLeakage: [],
    legacyL3L4DifficultyUsed: false,
  };
});

const batches = [
  [1, 70],
  [71, 140],
  [141, 210],
  [211, 280],
];
for (const [start, end] of batches) {
  const file = `H1_SEMANTIC_REPAIR_EQINEQ_${String(start).padStart(3, '0')}_${String(end).padStart(3, '0')}.jsonl`;
  fs.writeFileSync(path.join(OUT, file), `${rows.slice(start - 1, end).map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
}
fs.writeFileSync(path.join(OUT, 'H1_SEMANTIC_REPAIR_EQINEQ_001_280.jsonl'), `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ role: 'JOIN_AND_MATERIALIZE_ONLY', rows: rows.length, uidUnique: new Set(rows.map((row) => row.questionUid)).size, sourceIdentityUnique: new Set(rows.map((row) => row.sourceIdentity)).size, decisionFiles: DECISION_FILES }, null, 2));

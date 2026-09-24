import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const rootRel = 'archive/_generated/intelligence/phase1/middle1-foundation';
const generatedRoot = path.join(root, rootRel);
const fullInventory = JSON.parse(fs.readFileSync(path.join(generatedRoot, 'M1_EXAM_INVENTORY_31.json'), 'utf8'));
const batchNo = Number(process.argv[2]);
if (!Number.isInteger(batchNo) || batchNo < 1 || batchNo > fullInventory.exams.length) throw new Error('Usage: validate-middle1-batch.mjs <1..31>');
const exam = fullInventory.exams[batchNo - 1];
const batchDir = path.join(root, exam.artifactPath);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const errors = [];
const counts = {};
const fail = (code, detail = {}) => errors.push({ code, ...detail });
const exists = name => fs.existsSync(path.join(batchDir, name));
const json = name => JSON.parse(fs.readFileSync(path.join(batchDir, name), 'utf8'));
const jsonl = name => fs.readFileSync(path.join(batchDir, name), 'utf8').split(/\r?\n/).filter(Boolean).map((line, index) => {
  try { return JSON.parse(line); } catch (error) { fail('INVALID_JSONL', { file: name, line: index + 1, message: error.message }); return null; }
}).filter(Boolean);
function sourceBank(text) {
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(text, context, { timeout: 3000 });
  return context.window.questionBank || context.window.questions || context.questionBank || context.questions;
}
const protectedFields = ['content', 'choices', 'answer', 'solution', 'image', 'layoutTag', 'wide'];
const currentSourcePath = path.join(root, 'archive/exams', exam.sourceArchiveFile);
const baseSource = execFileSync('git', ['show', `${fullInventory.baseMainSha}:archive/exams/${exam.sourceArchiveFile}`], { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
const original = sourceBank(baseSource);
const current = sourceBank(fs.readFileSync(currentSourcePath, 'utf8'));
counts.sourceQuestionCount = current.length;
counts.originalQuestionCount = original.length;
if (current.length !== exam.questionRowCount || original.length !== exam.questionRowCount) fail('SOURCE_COUNT_MISMATCH');
for (let i = 0; i < Math.min(original.length, current.length); i++) {
  for (const field of protectedFields) {
    if (JSON.stringify(original[i][field] ?? null) !== JSON.stringify(current[i][field] ?? null)) fail('PROTECTED_FIELD_MUTATION', { sourceOrdinal: i + 1, field });
  }
}
const allowedMutationFields = new Set(['standardUnitKey', 'standardUnit', 'standardUnitOrder', 'subUnitKey', 'subUnit', 'subUnitConfidence', 'subUnitClassificationDepth', 'problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility']);
for (let i = 0; i < Math.min(original.length, current.length); i++) {
  for (const key of new Set([...Object.keys(original[i]), ...Object.keys(current[i])])) {
    if (allowedMutationFields.has(key)) continue;
    if (JSON.stringify(original[i][key] ?? null) !== JSON.stringify(current[i][key] ?? null)) fail('NON_METADATA_MUTATION', { sourceOrdinal: i + 1, field: key });
  }
}
const input = exists('INPUT_BUNDLE.jsonl') ? jsonl('INPUT_BUNDLE.jsonl') : [];
counts.inputRows = input.length;
if (!exists('INPUT_BUNDLE.jsonl')) fail('MISSING_DECISION_ISOLATED_BUNDLE');
if (input.length !== exam.questionRowCount) fail('INPUT_COUNT_MISMATCH', { expected: exam.questionRowCount, actual: input.length });
const inputByUid = new Map();
const inputSourceSet = new Set();
const forbiddenInputFields = ['problemTypeKey', 'templateKey', 'crossConceptKeys', 'difficultyBucket', 'level', 'heuristicHint', 'priorVerdict'];
for (const row of input) {
  if (inputByUid.has(row.questionUid)) fail('DUPLICATE_UID', { uid: row.questionUid });
  inputByUid.set(row.questionUid, row);
  if (inputSourceSet.has(row.sourceIdentity)) fail('DUPLICATE_SOURCE_IDENTITY', { sourceIdentity: row.sourceIdentity });
  inputSourceSet.add(row.sourceIdentity);
  for (const field of forbiddenInputFields) if (Object.hasOwn(row, field) || row.inputFieldInventory?.includes(field)) fail('FORBIDDEN_CANDIDATE_INPUT', { uid: row.questionUid, field });
  if (!row.contentHash || !row.solutionHash || !row.inputBundleSha || !row.choicesHash) fail('MISSING_DECISION_ISOLATED_BUNDLE', { uid: row.questionUid });
  const { inputBundleSha, ...withoutSha } = row;
  if (sha(JSON.stringify(withoutSha)) !== inputBundleSha) fail('INPUT_BUNDLE_HASH_MISMATCH', { uid: row.questionUid });
  if (sha(JSON.stringify(row.content ?? null)) !== row.contentHash) fail('CONTENT_HASH_MISMATCH', { uid: row.questionUid });
  if (sha(JSON.stringify(row.solution ?? null)) !== row.solutionHash) fail('SOLUTION_HASH_MISMATCH', { uid: row.questionUid });
  if (sha(JSON.stringify(row.choices ?? null)) !== row.choicesHash) fail('CHOICES_HASH_MISMATCH', { uid: row.questionUid });
  if (row.sourceArchiveFile !== exam.sourceArchiveFile || !Number.isInteger(row.sourceOrdinal)) fail('SOURCE_IDENTITY_MISMATCH', { uid: row.questionUid });
  for (const image of row.images || []) if (!image.exists || !image.sha256) fail('MISSING_IMAGE_DEPENDENCY', { uid: row.questionUid, ref: image.ref });
}
counts.uniqueInputUids = inputByUid.size;
counts.uniqueInputSources = inputSourceSet.size;
const modelLog = JSON.parse(fs.readFileSync(path.join(generatedRoot, 'WORKER_MODEL_LOG.json'), 'utf8'));
const requiredSemanticFields = ['questionUid', 'sourceArchiveFile', 'sourceOrdinal', 'sourceFingerprint', 'inputBundleSha', 'contentHash', 'solutionHash', 'primaryMethod', 'decisiveStep', 'standardUnitKey', 'subUnitKey', 'l1Reason', 'l2Reason', 'problemTypeKey', 'l3SemanticReason', 'templateKey', 'l4SemanticReason', 'crossConceptKeys', 'crossConceptReasons', 'conditionKeys', 'conditionReasons', 'integrationPattern', 'semanticReason', 'reviewStatus', 'sourceIssue'];
for (const role of ['A', 'B']) {
  const file = `LUNA_${role}.jsonl`;
  const assignedWorkers = modelLog.workers.filter(x => x.workerName.startsWith(`/root/m1_semantic_${role.toLowerCase()}`) && x.batchAssignments?.includes(batchNo));
  const worker = assignedWorkers[0];
  if (assignedWorkers.length !== 1) fail('MODEL_PINNING_AMBIGUOUS_ASSIGNMENT', { role, count: assignedWorkers.length });
  if (!worker || !worker.modelVerified || worker.actualModel !== 'gpt-6-luna' || worker.actualReasoningEffort !== 'xhigh') fail('MODEL_PINNING_UNVERIFIED', { role });
  if (worker?.semanticInputVerified === false) fail('MISSING_DECISION_ISOLATED_BUNDLE', { role, reason: 'Worker input-isolation review pending or rejected' });
  if (!exists(file)) { fail('MISSING_WORKER_LEDGER', { role }); counts[`${role}Reviewed`] = 0; continue; }
  const rows = jsonl(file);
  counts[`${role}Reviewed`] = rows.length;
  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row.questionUid)) fail('DUPLICATE_WORKER_UID', { role, uid: row.questionUid });
    seen.add(row.questionUid);
    const source = inputByUid.get(row.questionUid);
    if (!source) { fail('UNKNOWN_WORKER_UID', { role, uid: row.questionUid }); continue; }
    for (const field of requiredSemanticFields) if (!Object.hasOwn(row, field) || (field !== 'sourceIssue' && (row[field] === null || row[field] === ''))) fail('MISSING_SEMANTIC_EVIDENCE', { role, uid: row.questionUid, field });
    for (const field of ['sourceArchiveFile', 'sourceOrdinal', 'sourceFingerprint', 'inputBundleSha', 'contentHash', 'solutionHash']) if (row[field] !== source[field]) fail('WORKER_PROVENANCE_MISMATCH', { role, uid: row.questionUid, field });
    if (batchNo >= 11) {
      if (typeof row.l1L2Conflict !== 'boolean' || (row.l1L2Conflict && !String(row.l1L2ConflictReason || '').trim())) fail('L1_L2_CONFLICT_EVIDENCE_MISSING', { role, uid: row.questionUid });
      if (row.l1L2Conflict === false && (row.standardUnitKey !== source.currentL1 || row.subUnitKey !== source.currentL2)) fail('L1_L2_BASELINE_DEVIATION_UNDECLARED', { role, uid: row.questionUid });
    }
    if (!Array.isArray(row.crossConceptKeys) || !Array.isArray(row.crossConceptReasons) || row.crossConceptKeys.length !== row.crossConceptReasons.length) fail('CROSS_CONCEPT_REASON_MISMATCH', { role, uid: row.questionUid });
    if (!Array.isArray(row.conditionKeys) || !Array.isArray(row.conditionReasons) || row.conditionKeys.length !== row.conditionReasons.length) fail('CONDITION_REASON_MISMATCH', { role, uid: row.questionUid });
    if (row.reviewStatus === 'FINAL' || row.reviewStatus === 'PASS') fail('MODEL_DECLARED_FINAL', { role, uid: row.questionUid });
  }
  if (rows.length !== input.length || seen.size !== inputByUid.size) fail('WORKER_COVERAGE_MISMATCH', { role, expected: input.length, actual: rows.length });
}
let baselineAuditChecked = batchNo < 10;
let baselineAuditByUid = new Map();
if (batchNo >= 10) {
  if (!exists('L1_L2_BASELINE_AUDIT.jsonl') || !exists('L1_L2_BASELINE_SUMMARY.json')) fail('L1_L2_BASELINE_AUDIT_MISSING');
  else {
    const auditBytes = fs.readFileSync(path.join(batchDir, 'L1_L2_BASELINE_AUDIT.jsonl'));
    const audit = jsonl('L1_L2_BASELINE_AUDIT.jsonl');
    const summary = json('L1_L2_BASELINE_SUMMARY.json');
    baselineAuditByUid = new Map(audit.map(x => [x.questionUid, x]));
    counts.l1L2BaselineUsed = audit.filter(x => x.baselineUsed).length;
    counts.l1L2ConflictConfirmed = audit.filter(x => x.l1L2Conflict).length;
    if (batchNo >= 12) {
      const plan = json('L1_L2_CONFLICT_PLAN.json');
      const rootOnlyDecisions = new Map((plan.candidateDecisions || []).filter(x => x.rootOpened === true).map(x => [x.sourceOrdinal, x]));
      counts.l1L2RootOnlyCandidate = audit.filter(x => x.rootOpened === true).length;
      if (summary.rootOnlyCandidateCount !== counts.l1L2RootOnlyCandidate || rootOnlyDecisions.size !== counts.l1L2RootOnlyCandidate) fail('L1_L2_ROOT_ONLY_COUNT_MISMATCH');
      for (const row of audit.filter(x => x.rootOpened === true)) {
        const decision = rootOnlyDecisions.get(row.sourceOrdinal);
        if (!decision || row.aDeviation || row.bDeviation || !decision.rootEvidenceFile || !exists(decision.rootEvidenceFile) || !String(decision.evidence || '').trim()) fail('L1_L2_ROOT_ONLY_PROVENANCE_INVALID', { uid: row.questionUid });
      }
    }
    if (audit.length !== input.length || baselineAuditByUid.size !== input.length || summary.batchNo !== batchNo || summary.denominator !== input.length || summary.auditSha256 !== sha(auditBytes) || summary.baselineUsedUidCount !== counts.l1L2BaselineUsed || summary.l1L2ConflictCount !== counts.l1L2ConflictConfirmed || counts.l1L2BaselineUsed + counts.l1L2ConflictConfirmed !== input.length) fail('L1_L2_BASELINE_AUDIT_COUNT_OR_HASH_MISMATCH');
    for (const row of audit) {
      const source = inputByUid.get(row.questionUid);
      if (!source || row.sourceOrdinal !== source.sourceOrdinal || row.sourceFingerprint !== source.sourceFingerprint || row.inputBundleSha !== source.inputBundleSha || row.baselineL1 !== source.currentL1 || row.baselineL2 !== source.currentL2 || row.baselineUsed === row.l1L2Conflict || !String(row.evidence || '').trim()) fail('L1_L2_BASELINE_AUDIT_PROVENANCE_MISMATCH', { uid: row.questionUid });
      if (row.baselineUsed && (row.acceptedL1 !== row.baselineL1 || row.acceptedL2 !== row.baselineL2)) fail('L1_L2_BASELINE_RETAINED_MUTATED', { uid: row.questionUid });
      if (row.l1L2Conflict && row.acceptedL1 === row.baselineL1 && row.acceptedL2 === row.baselineL2) fail('L1_L2_CONFLICT_NO_CHANGE', { uid: row.questionUid });
    }
    baselineAuditChecked = true;
  }
}
let conflictSet = new Set();
if (exists('AB_COMPARISON.jsonl') && exists('CONFLICT_INPUT.jsonl')) {
  const comparison = jsonl('AB_COMPARISON.jsonl');
  const conflictInput = jsonl('CONFLICT_INPUT.jsonl');
  counts.abCompared = comparison.length;
  if (comparison.length !== input.length) fail('AB_COMPARISON_COUNT_MISMATCH');
  const comparedUids = new Set();
  for (const row of comparison) {
    const source = inputByUid.get(row.questionUid);
    if (!source || row.inputBundleSha !== source.inputBundleSha) fail('AB_COMPARISON_SOURCE_MISMATCH', { uid: row.questionUid });
    if (comparedUids.has(row.questionUid)) fail('AB_COMPARISON_DUPLICATE', { uid: row.questionUid });
    comparedUids.add(row.questionUid);
    if (row.semanticStatus === 'ACTUAL_CONFLICT_C_REQUIRED') conflictSet.add(row.questionUid);
  }
  counts.abConflicts = conflictSet.size;
  if (conflictInput.length !== conflictSet.size) fail('CONFLICT_INPUT_COUNT_MISMATCH');
  for (const row of conflictInput) {
    if (!conflictSet.has(row.questionUid) || JSON.stringify(row) !== JSON.stringify(inputByUid.get(row.questionUid))) fail('CONFLICT_INPUT_NOT_BLIND_SOURCE_SUBSET', { uid: row.questionUid });
  }
} else if (exists('LUNA_A.jsonl') && exists('LUNA_B.jsonl')) fail('AB_COMPARISON_NOT_FROZEN');
if (exists('B10_C_SCOPE_DELTA.json')) {
  const delta = json('B10_C_SCOPE_DELTA.json');
  const oldBytes = fs.readFileSync(path.join(batchDir, 'CONFLICT_INPUT_PRE_BASELINE.jsonl'));
  const currentBytes = fs.readFileSync(path.join(batchDir, 'CONFLICT_INPUT.jsonl'));
  const oldRows = jsonl('CONFLICT_INPUT_PRE_BASELINE.jsonl');
  const currentRows = jsonl('CONFLICT_INPUT.jsonl');
  const excluded = oldRows.filter(x => !currentRows.some(y => y.questionUid === x.questionUid)).map(x => x.sourceOrdinal).sort((a,b) => a-b);
  if (delta.batchNo !== batchNo || sha(oldBytes) !== delta.oldConflictInputSha256 || sha(currentBytes) !== delta.newConflictInputSha256 || delta.oldConflictCount !== oldRows.length || delta.newConflictCount !== currentRows.length || JSON.stringify(excluded) !== JSON.stringify([...delta.excludedOrdinals].sort((a,b) => a-b)) || delta.oldCReviewedAccepted !== 0 || currentRows.length !== conflictSet.size) fail('C_SCOPE_BASELINE_DELTA_INVALID');
}
if (exists('CONFLICT_C.jsonl')) {
  const cWorkers = modelLog.workers.filter(x => x.workerName.startsWith('/root/m1_conflict_c') && x.batchAssignments?.includes(batchNo));
  const cWorker = cWorkers[0];
  if (cWorkers.length !== 1 || !cWorker?.modelVerified || cWorker.actualModel !== 'gpt-6-luna' || cWorker.actualReasoningEffort !== 'xhigh' || cWorker.blindInputVerified === false) fail('MODEL_PINNING_UNVERIFIED', { role: 'C', assignmentCount: cWorkers.length });
  const cRows = jsonl('CONFLICT_C.jsonl');
  counts.CReviewed = cRows.length;
  const seen = new Set();
  for (const row of cRows) {
    if (seen.has(row.questionUid)) fail('DUPLICATE_WORKER_UID', { role: 'C', uid: row.questionUid });
    seen.add(row.questionUid);
    const source = inputByUid.get(row.questionUid);
    if (!conflictSet.has(row.questionUid)) fail('C_READ_NONCONFLICT_UID', { uid: row.questionUid });
    if (!source || row.inputBundleSha !== source.inputBundleSha || row.contentHash !== source.contentHash || row.solutionHash !== source.solutionHash) fail('WORKER_PROVENANCE_MISMATCH', { role: 'C', uid: row.questionUid });
    for (const field of requiredSemanticFields) if (!Object.hasOwn(row, field) || (field !== 'sourceIssue' && (row[field] === null || row[field] === ''))) fail('MISSING_SEMANTIC_EVIDENCE', { role: 'C', uid: row.questionUid, field });
    if (!Array.isArray(row.conditionKeys) || !Array.isArray(row.conditionReasons) || row.conditionKeys.length !== row.conditionReasons.length) fail('CONDITION_REASON_MISMATCH', { role: 'C', uid: row.questionUid });
    if (batchNo >= 10) {
      if (typeof row.l1L2Conflict !== 'boolean' || (row.l1L2Conflict && !String(row.l1L2ConflictReason || '').trim())) fail('C_L1_L2_CONFLICT_EVIDENCE_MISSING', { uid: row.questionUid });
      if (row.l1L2Conflict === false && (row.standardUnitKey !== source.currentL1 || row.subUnitKey !== source.currentL2)) fail('C_L1_L2_BASELINE_DEVIATION_UNDECLARED', { uid: row.questionUid });
    }
  }
  if (seen.size !== conflictSet.size) fail('C_COVERAGE_MISMATCH', { expected: conflictSet.size, actual: seen.size });
} else counts.CReviewed = 0;
if (exists('C_QUALITY_DEFECTS.json')) {
  const rejection = json('C_QUALITY_DEFECTS.json');
  const defects = rejection.defects || [];
  const cRows = jsonl('CONFLICT_C.jsonl');
  const cByUid = new Map(cRows.map(x => [x.questionUid, x]));
  if (rejection.batchNo !== batchNo || rejection.status !== 'AFFECTED_UID_REOPENED_AND_ROOT_ADJUDICATED' || rejection.preservedLedgerSha256 !== sha(fs.readFileSync(path.join(batchDir, 'CONFLICT_C.jsonl'))) || defects.length === 0 || new Set(defects.map(x => x.questionUid)).size !== defects.length) fail('C_QUALITY_DEFECT_RECEIPT_INVALID');
  for (const defect of defects) {
    const source = inputByUid.get(defect.questionUid);
    if (!source || source.sourceOrdinal !== defect.sourceOrdinal || !conflictSet.has(defect.questionUid) || !cByUid.has(defect.questionUid) || !String(defect.reason || '').trim() || !String(defect.type || '').trim() || !exists(defect.rootEvidenceFile)) fail('C_QUALITY_AFFECTED_UID_INVALID', { uid: defect.questionUid });
  }
  counts.cQualityRejectedUidCount = defects.length;
}
if (exists('AB_QUALITY_DEFECTS.json')) {
  const rejection = json('AB_QUALITY_DEFECTS.json');
  const defects = rejection.defects || [];
  if (rejection.batchNo !== batchNo || rejection.status !== 'AFFECTED_UID_REOPENED_AND_ROOT_ADJUDICATED' || rejection.preservedALedgerSha256 !== sha(fs.readFileSync(path.join(batchDir, 'LUNA_A.jsonl'))) || rejection.preservedBLedgerSha256 !== sha(fs.readFileSync(path.join(batchDir, 'LUNA_B.jsonl'))) || defects.length === 0 || new Set(defects.map(x => x.questionUid)).size !== defects.length) fail('AB_QUALITY_DEFECT_RECEIPT_INVALID');
  for (const defect of defects) {
    const source = inputByUid.get(defect.questionUid);
    if (!source || source.sourceOrdinal !== defect.sourceOrdinal || !conflictSet.has(defect.questionUid) || !String(defect.reason || '').trim() || !String(defect.type || '').trim() || !exists(defect.rootEvidenceFile)) fail('AB_QUALITY_AFFECTED_UID_INVALID', { uid: defect.questionUid });
  }
  counts.abQualityRejectedUidCount = defects.length;
}
if (exists('B_SCHEMA_CORRECTION_RECEIPT.json')) {
  const receipt = json('B_SCHEMA_CORRECTION_RECEIPT.json');
  const oldBytes = fs.readFileSync(path.join(batchDir, 'LUNA_B_PRE_SCHEMA_CORRECTION.jsonl'));
  const correctedBytes = fs.readFileSync(path.join(batchDir, 'LUNA_B.jsonl'));
  const oldRows = jsonl('LUNA_B_PRE_SCHEMA_CORRECTION.jsonl');
  const correctedRows = jsonl('LUNA_B.jsonl');
  if (receipt.batchNo !== batchNo || receipt.role !== 'B' || receipt.rowCount !== input.length || receipt.addedField !== 'conditionReasons' || JSON.stringify(receipt.addedValue) !== '[]' || receipt.semanticFieldsChanged !== 0 || sha(oldBytes) !== receipt.oldLedgerSha256 || sha(correctedBytes) !== receipt.correctedLedgerSha256 || oldRows.length !== correctedRows.length) fail('WORKER_SCHEMA_CORRECTION_PROVENANCE_MISMATCH');
  for (let i = 0; i < oldRows.length; i++) {
    const old = oldRows[i], fixed = correctedRows[i];
    if (Object.hasOwn(old, 'conditionReasons') || !Array.isArray(old.conditionKeys) || old.conditionKeys.length || JSON.stringify({ ...old, conditionReasons: [] }) !== JSON.stringify(fixed)) fail('WORKER_SCHEMA_CORRECTION_SCOPE_MISMATCH', { uid: old.questionUid });
  }
}
let workerQualityClosure = true;
const qualityScopes = [
  { file: 'WORKER_QUALITY_REJECTIONS.json', role: 'A', oldFile: 'LUNA_A_PRE_CORRECTION.jsonl', revisionFile: 'LUNA_A_REVISION_01_09.jsonl', ledgerFile: 'LUNA_A.jsonl' },
  { file: 'WORKER_QUALITY_REJECTION_B.json', role: 'B', oldFile: 'LUNA_B_PRE_CORRECTION.jsonl', revisionFile: 'LUNA_B_REVISION_03.jsonl', ledgerFile: 'LUNA_B.jsonl' },
  { file: 'WORKER_QUALITY_REJECTION_A_B08.json', role: 'A', oldFile: 'LUNA_A_PRE_CORRECTION.jsonl', revisionFile: 'LUNA_A_REVISION_12.jsonl', reviewInputFile: 'A_REVIEW_INPUT_12.jsonl', ledgerFile: 'LUNA_A.jsonl' },
  { file: 'WORKER_QUALITY_REJECTION_B_B09.json', role: 'B', oldFile: 'LUNA_B_PRE_CORRECTION.jsonl', revisionFile: 'LUNA_B_REVISION_18.jsonl', reviewInputFile: 'B_REVIEW_INPUT_18.jsonl', ledgerFile: 'LUNA_B.jsonl' }
];
counts.workerQualityRejectedUidCount = 0;
for (const scope of qualityScopes.filter(x => exists(x.file))) {
  const rejection = json(scope.file);
  const rejectedCount = rejection.rejectedQuestionUids?.length || 0;
  counts.workerQualityRejectedUidCount += rejectedCount;
  if (rejection.worker !== scope.role) fail('WORKER_QUALITY_ROLE_MISMATCH', { file: scope.file });
  if (rejection.status !== 'RESOLVED_TARGETED_REVIEW') {
    fail('WORKER_QUALITY_REJECTED_SCOPE', { worker: scope.role, count: rejectedCount });
    if (scope.role === 'A') counts.AReviewed = Math.max(0, (counts.AReviewed || 0) - rejectedCount);
    if (scope.role === 'B') counts.BReviewed = Math.max(0, (counts.BReviewed || 0) - rejectedCount);
    workerQualityClosure = false;
  } else {
    const corrected = fs.readFileSync(path.join(batchDir, scope.ledgerFile));
    const old = fs.readFileSync(path.join(batchDir, scope.oldFile));
    const revision = jsonl(scope.revisionFile);
    const correctedRows = jsonl(scope.ledgerFile);
    const correctedByUid = new Map(correctedRows.map(x => [x.questionUid, x]));
    if (sha(corrected) !== rejection.correctedLedgerSha256 || sha(old) !== rejection.oldLedgerSha256 || revision.length !== rejectedCount) {
      fail('WORKER_QUALITY_CORRECTION_PROVENANCE_MISMATCH', { worker: scope.role });
      workerQualityClosure = false;
    }
    if (rejection.earlyDraftFile && sha(fs.readFileSync(path.join(batchDir, rejection.earlyDraftFile))) !== rejection.earlyDraftSha256) {
      fail('WORKER_QUALITY_EARLY_DRAFT_PROVENANCE_MISMATCH', { worker: scope.role });
      workerQualityClosure = false;
    }
    if (scope.reviewInputFile) {
      const reviewInputBytes = fs.readFileSync(path.join(batchDir, scope.reviewInputFile));
      const reviewInput = jsonl(scope.reviewInputFile);
      if (sha(reviewInputBytes) !== rejection.reviewInputSha256 || reviewInput.length !== rejectedCount || reviewInput.some(row => !inputByUid.has(row.questionUid) || JSON.stringify(row) !== JSON.stringify(inputByUid.get(row.questionUid)))) {
        fail('WORKER_QUALITY_ISOLATED_INPUT_MISMATCH', { worker: scope.role });
        workerQualityClosure = false;
      }
    }
    const rejectedSet = new Set(rejection.rejectedQuestionUids);
    for (const row of revision) {
      const source = inputByUid.get(row.questionUid);
      if (!rejectedSet.has(row.questionUid) || !source || row.inputBundleSha !== source.inputBundleSha || row.contentHash !== source.contentHash || row.solutionHash !== source.solutionHash || JSON.stringify(row) !== JSON.stringify(correctedByUid.get(row.questionUid))) {
        fail('WORKER_QUALITY_REVISION_SOURCE_MISMATCH', { worker: scope.role, uid: row.questionUid });
        workerQualityClosure = false;
      }
    }
  }
}
counts.workerQualityRejectedUidCount += (counts.cQualityRejectedUidCount || 0) + (counts.abQualityRejectedUidCount || 0);
let consensusChecked = false;
let consensusByUid = new Map();
if (exists('CONSENSUS.jsonl')) {
  const consensus = jsonl('CONSENSUS.jsonl');
  const cQualityRejectedUids = new Set((exists('C_QUALITY_DEFECTS.json') ? json('C_QUALITY_DEFECTS.json').defects : []).map(x => x.questionUid));
  const abQualityRejectedUids = new Set((exists('AB_QUALITY_DEFECTS.json') ? json('AB_QUALITY_DEFECTS.json').defects : []).map(x => x.questionUid));
  const consensusPlan = json('CONSENSUS_PLAN.json');
  consensusByUid = new Map(consensus.map(x => [x.questionUid, x]));
  const master = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/master_tables/js_archive_tag_master.json'), 'utf8'));
  const masterByKey = new Map(master.map(x => [x.key, x]));
  const activePt = new Set(JSON.parse(fs.readFileSync(path.join(root, 'archive/data/meta-foundation/compiled/taxonomy_registry.json'), 'utf8')).problemTypes.map(x => x.problemTypeKey));
  const activeCc = new Set(JSON.parse(fs.readFileSync(path.join(root, 'archive/data/meta-foundation/compiled/concept_registry.json'), 'utf8')).concepts.map(x => x.conceptKey));
  const activeCond = new Set(JSON.parse(fs.readFileSync(path.join(root, 'archive/data/meta-foundation/canonical/condition_registry.json'), 'utf8')).conditions.map(x => x.conditionKey));
  const registry = JSON.parse(fs.readFileSync(path.join(generatedRoot, 'M1_CUMULATIVE_TAXONOMY_REGISTRY.json'), 'utf8'));
  const candidatePt = new Set(registry.problemTypes.map(x => x.problemTypeKey));
  const candidateTpl = new Map(registry.templates.map(x => [x.templateKey, x]));
  const candidateCc = new Set(registry.crossConcepts.map(x => x.conceptKey));
  const registrySupportingUids = new Set([...registry.problemTypes, ...registry.templates, ...registry.crossConcepts].flatMap(x => x.supportingQuestionUids || []));
  counts.consensusRows = consensus.length;
  counts.consensusHolds = consensus.filter(x => x.reviewStatus === 'HOLD').length;
  counts.consensusRouteOut = consensus.filter(x => x.reviewStatus === 'ROUTE_OUT').length;
  if (consensus.length !== input.length) fail('CONSENSUS_COUNT_MISMATCH');
  const seen = new Set();
  for (const row of consensus) {
    if (seen.has(row.questionUid)) fail('CONSENSUS_DUPLICATE_UID', { uid: row.questionUid });
    seen.add(row.questionUid);
    const source = inputByUid.get(row.questionUid);
    if (!source || row.inputBundleSha !== source.inputBundleSha || row.sourceFingerprint !== source.sourceFingerprint) fail('CONSENSUS_PROVENANCE_MISMATCH', { uid: row.questionUid });
    if (batchNo >= 10 && (row.standardUnitKey !== baselineAuditByUid.get(row.questionUid)?.acceptedL1 || row.subUnitKey !== baselineAuditByUid.get(row.questionUid)?.acceptedL2)) fail('CONSENSUS_L1_L2_BASELINE_AUTHORITY_MISMATCH', { uid: row.questionUid });
    if (batchNo >= 12 && (row.l1L2Conflict !== baselineAuditByUid.get(row.questionUid)?.l1L2Conflict || (row.l1L2Conflict && !String(row.l1L2ConflictReason || '').trim()))) fail('CONSENSUS_L1_L2_CONFLICT_EVIDENCE_MISMATCH', { uid: row.questionUid });
    if (!row.consensusBasis?.rootReason || !['A','B','C'].includes(row.consensusBasis?.chosenRole)) fail('CONSENSUS_ROOT_REASON_MISSING', { uid: row.questionUid });
    if (cQualityRejectedUids.has(row.questionUid) && (row.consensusBasis.chosenRole === 'C' || !consensusPlan.rootDirectReadOrdinals?.includes(row.sourceOrdinal))) fail('C_QUALITY_DEFECT_NOT_ROOT_ADJUDICATED', { uid: row.questionUid });
    if (abQualityRejectedUids.has(row.questionUid) && !consensusPlan.rootDirectReadOrdinals?.includes(row.sourceOrdinal)) fail('AB_QUALITY_DEFECT_NOT_ROOT_ADJUDICATED', { uid: row.questionUid });
    const l1row = masterByKey.get(row.standardUnitKey), l2row = masterByKey.get(row.subUnitKey);
    if (l1row?.keyType !== 'standardUnitKey' || l2row?.keyType !== 'subUnitKey' || l2row.standardUnitKey !== row.standardUnitKey) fail('L1_L2_PARENT_INVALID', { uid: row.questionUid, l1: row.standardUnitKey, l2: row.subUnitKey });
    if (row.reviewStatus === 'ROUTE_OUT' || row.reviewStatus === 'HOLD') {
      if (registrySupportingUids.has(row.questionUid)) fail('NONPROPOSED_TAXONOMY_LEAK', { uid: row.questionUid, status: row.reviewStatus });
    } else {
      if (!activePt.has(row.problemTypeKey) && !candidatePt.has(row.problemTypeKey)) fail('UNREGISTERED_L3', { uid: row.questionUid, key: row.problemTypeKey });
      if (candidateTpl.get(row.templateKey)?.parentProblemTypeKey !== row.problemTypeKey) fail('L3_L4_PARENT_INVALID', { uid: row.questionUid, l3: row.problemTypeKey, l4: row.templateKey });
      for (const key of row.crossConceptKeys || []) if (!activeCc.has(key) && !candidateCc.has(key)) fail('UNREGISTERED_CROSS_CONCEPT', { uid: row.questionUid, key });
      for (const key of row.conditionKeys || []) if (!activeCond.has(key)) fail('UNREGISTERED_CONDITION', { uid: row.questionUid, key });
    }
    if (!['NONE','SEQUENTIAL','INTERDEPENDENT','REINTERPRETATION','CASE_BRANCH','DEEP_COMPOSITE'].includes(row.integrationPattern)) fail('INVALID_INTEGRATION_PATTERN', { uid: row.questionUid });
    if (!['PROPOSED','HOLD','ROUTE_OUT'].includes(row.reviewStatus)) fail('MODEL_DECLARED_FINAL', { uid: row.questionUid, status: row.reviewStatus });
  }
  consensusChecked = true;
}
let sourceQualityChecked = false;
if (exists('SOURCE_QUALITY.jsonl')) {
  const quality = jsonl('SOURCE_QUALITY.jsonl');
  counts.sourceQualityRows = quality.length;
  counts.solutionQualityHold = quality.filter(x => x.disposition === 'SOLUTION_REPAIR_REQUIRED').length;
  counts.sourceBlocked = quality.filter(x => x.disposition === 'SOURCE_BLOCKED').length;
  if (quality.length !== input.length) fail('SOURCE_QUALITY_COVERAGE_MISMATCH');
  const seen = new Set();
  for (const row of quality) {
    if (seen.has(row.questionUid)) fail('SOURCE_QUALITY_DUPLICATE_UID', { uid: row.questionUid });
    seen.add(row.questionUid);
    if (!inputByUid.has(row.questionUid) || row.sourceFingerprint !== inputByUid.get(row.questionUid).sourceFingerprint) fail('SOURCE_QUALITY_PROVENANCE_MISMATCH', { uid: row.questionUid });
    if (!String(row.issueReason || '').trim()) fail('SOURCE_QUALITY_REASON_MISSING', { uid: row.questionUid });
    if (!['SOLUTION_REPAIR_REQUIRED', 'SOURCE_BLOCKED', 'HOLD_RESOLVED_NO_SOURCE_MUTATION'].includes(row.disposition)) fail('SOURCE_QUALITY_DISPOSITION_INVALID', { uid: row.questionUid });
    if (row.semanticMappingStatus !== consensusByUid.get(row.questionUid)?.reviewStatus) fail('SOURCE_QUALITY_SEMANTIC_STATUS_MISMATCH', { uid: row.questionUid });
    if (row.disposition !== 'HOLD_RESOLVED_NO_SOURCE_MUTATION' && row.runtimeSelectableBeforeRepair !== false) fail('SOURCE_QUALITY_SELECTABILITY_LEAK', { uid: row.questionUid });
    if (row.semanticMappingStatus === 'ROUTE_OUT' && (row.metadataWritebackAllowed !== false || row.runtimeSelectableBeforeRepair !== false)) fail('ROUTE_OUT_SELECTABILITY_LEAK', { uid: row.questionUid });
    if (row.semanticMappingStatus === 'HOLD' && (row.metadataWritebackAllowed !== false || row.runtimeSelectableBeforeRepair !== false)) fail('HOLD_SELECTABILITY_LEAK', { uid: row.questionUid });
    if (row.disposition === 'SOURCE_BLOCKED' && row.semanticMappingStatus !== 'HOLD') fail('SOURCE_BLOCKED_WITHOUT_SEMANTIC_HOLD', { uid: row.questionUid });
  }
  sourceQualityChecked = true;
}
if (exists('B11_L4_REUSE_INPUT_DELTA.json')) {
  const delta = json('B11_L4_REUSE_INPUT_DELTA.json');
  const oldBytes = fs.readFileSync(path.join(batchDir, 'DIFFICULTY_INPUT_PRE_L4_REUSE.jsonl'));
  const newBytes = fs.readFileSync(path.join(batchDir, 'DIFFICULTY_INPUT.jsonl'));
  const oldRows = jsonl('DIFFICULTY_INPUT_PRE_L4_REUSE.jsonl');
  const newRows = jsonl('DIFFICULTY_INPUT.jsonl');
  const changed = [];
  if (delta.batchNo !== batchNo || delta.workerBlindDraftWrittenBeforeDelta !== false || sha(oldBytes) !== delta.oldInputSha256 || sha(newBytes) !== delta.newInputSha256 || oldRows.length !== input.length || newRows.length !== input.length || delta.denominator !== input.length) fail('L4_REUSE_DIFFICULTY_INPUT_DELTA_PROVENANCE_INVALID');
  for (let i = 0; i < Math.min(oldRows.length, newRows.length); i++) {
    const old = oldRows[i], fresh = newRows[i];
    const expected = { ...old, semanticContext: { ...old.semanticContext, templateKey: fresh.semanticContext.templateKey }, blindInputSha: fresh.blindInputSha };
    if (JSON.stringify(expected) !== JSON.stringify(fresh)) fail('L4_REUSE_DIFFICULTY_INPUT_SCOPE_INVALID', { uid: old.questionUid });
    if (old.semanticContext.templateKey !== fresh.semanticContext.templateKey) changed.push({ sourceOrdinal: old.sourceOrdinal, questionUid: old.questionUid, oldTemplateKey: old.semanticContext.templateKey, newTemplateKey: fresh.semanticContext.templateKey });
  }
  if (changed.length !== delta.changedCount || JSON.stringify(changed) !== JSON.stringify(delta.changed)) fail('L4_REUSE_DIFFICULTY_INPUT_CHANGESET_INVALID');
}
let difficultyInputChecked = false, difficultyChecked = false;
if (exists('DIFFICULTY_INPUT.jsonl')) {
  const dInput = jsonl('DIFFICULTY_INPUT.jsonl');
  counts.difficultyInputRows = dInput.length;
  if (dInput.length !== input.length) fail('DIFFICULTY_INPUT_COUNT_MISMATCH');
  for (const row of dInput) {
    const source = inputByUid.get(row.questionUid);
    if (!source || row.inputBundleSha !== source.inputBundleSha) fail('DIFFICULTY_INPUT_SOURCE_MISMATCH', { uid: row.questionUid });
    if (Object.keys(row).some(key => /^(level|legacyLevel|difficultyBucket)$/i.test(key)) || row.inputFieldInventory?.some(key => /level|legacy/i.test(key))) fail('DIFFICULTY_LEGACY_LEAKAGE', { uid: row.questionUid });
    const { blindInputSha, ...withoutSha } = row;
    if (sha(JSON.stringify(withoutSha)) !== blindInputSha) fail('DIFFICULTY_INPUT_HASH_MISMATCH', { uid: row.questionUid });
  }
  difficultyInputChecked = true;
  if (exists('DIFFICULTY.jsonl')) {
    const dRows = jsonl('DIFFICULTY.jsonl');
    const dByUid = new Map(dInput.map(x => [x.questionUid, x]));
    const difficultyWorkers = modelLog.workers.filter(x => x.workerName.startsWith('/root/m1_difficulty_blind') && x.workerName !== '/root/m1_difficulty_blind_repair' && x.reviewRole !== 'targeted_repair' && x.batchAssignments?.includes(batchNo));
    const worker = difficultyWorkers[0];
    if (difficultyWorkers.length !== 1 || !worker?.modelVerified || worker.actualModel !== 'gpt-6-luna' || worker.actualReasoningEffort !== 'xhigh' || worker.blindInputVerified === false) fail('DIFFICULTY_MODEL_UNVERIFIED', { assignmentCount: difficultyWorkers.length });
    counts.difficultyReviewed = dRows.length;
    if (dRows.length !== input.length) fail('DIFFICULTY_COVERAGE_MISMATCH');
    const seen = new Set();
    for (const row of dRows) {
      if (seen.has(row.questionUid)) fail('DIFFICULTY_DUPLICATE_UID', { uid: row.questionUid });
      seen.add(row.questionUid);
      if (row.blindInputSha !== dByUid.get(row.questionUid)?.blindInputSha) fail('DIFFICULTY_PROVENANCE_MISMATCH', { uid: row.questionUid });
      if (![1,2,3,4,5,'UNKNOWN'].includes(row.difficultyBucket)) fail('INVALID_DIFFICULTY_BUCKET', { uid: row.questionUid, value: row.difficultyBucket });
      if (!['high','medium','low'].includes(row.difficultyConfidence)) fail('INVALID_DIFFICULTY_CONFIDENCE', { uid: row.questionUid });
      if (!['NONE','B12','B23','B34','B45'].includes(row.difficultyBoundaryFlag)) fail('INVALID_DIFFICULTY_BOUNDARY', { uid: row.questionUid });
      if (!String(row.difficultyReason || '').trim()) fail('MISSING_DIFFICULTY_REASON', { uid: row.questionUid });
      if (batchNo >= 8) for (const [flag, reason] of [['visualDifficultyImpact','visualDifficultyImpactReason'], ['sourceSolutionDifficultyConflict','sourceSolutionConflictReason'], ['reviewerRequestedRecheck','reviewerRecheckReason']]) {
        if (typeof row[flag] !== 'boolean' || (row[flag] && !String(row[reason] || '').trim())) fail('MISSING_FIRST_PASS_RECHECK_EVIDENCE', { uid: row.questionUid, flag });
      }
    }
    difficultyChecked = true;
  }
}
if (exists('B11_DIFFICULTY_QUALITY_REJECTION.json')) {
  const rejection = json('B11_DIFFICULTY_QUALITY_REJECTION.json');
  const schemaReceipt = json('B11_Q19_SCHEMA_NORMALIZATION.json');
  const rawCorrectionBytes = fs.readFileSync(path.join(batchDir, 'DIFFICULTY_BLIND_CORRECTION_Q19_RAW.jsonl'));
  const draftBytes = fs.readFileSync(path.join(batchDir, 'DIFFICULTY_DRAFT.jsonl'));
  const correctedBytes = fs.readFileSync(path.join(batchDir, 'DIFFICULTY_BLIND_CORRECTION_Q19.jsonl'));
  const finalBytes = fs.readFileSync(path.join(batchDir, 'DIFFICULTY.jsonl'));
  const isolatedBytes = fs.readFileSync(path.join(batchDir, 'DIFFICULTY_BLIND_INPUT_Q19.jsonl'));
  const draft = jsonl('DIFFICULTY_DRAFT.jsonl'), corrected = jsonl('DIFFICULTY_BLIND_CORRECTION_Q19.jsonl'), final = jsonl('DIFFICULTY.jsonl'), isolated = jsonl('DIFFICULTY_BLIND_INPUT_Q19.jsonl');
  const fullInput = jsonl('DIFFICULTY_INPUT.jsonl');
  const shared = json('Q19_SHARED_MATERIAL_REF.json');
  const repairWorker = modelLog.workers.find(x => x.workerName === '/root/m1_difficulty_blind_repair' && x.batchAssignments?.includes(batchNo));
  counts.difficultyWorkerQualityRejectedUidCount = 1;
  const rawCorrection = jsonl('DIFFICULTY_BLIND_CORRECTION_Q19_RAW.jsonl');
  const normalizedFromRaw = { ...rawCorrection[0], sourceSolutionDifficultyConflict: rawCorrection[0]?.sourceSolutionConflict, reviewerRequestedRecheck: rawCorrection[0]?.reviewerRecheck, reviewer: schemaReceipt.reviewerStampOnly };
  delete normalizedFromRaw.sourceSolutionConflict;
  delete normalizedFromRaw.reviewerRecheck;
  if (schemaReceipt.batchNo !== batchNo || schemaReceipt.sourceOrdinal !== 19 || schemaReceipt.mathematicalFieldsChanged !== 0 || schemaReceipt.rawSha256 !== sha(rawCorrectionBytes) || schemaReceipt.normalizedSha256 !== sha(correctedBytes) || JSON.stringify(schemaReceipt.renamedFields) !== JSON.stringify({ sourceSolutionConflict: 'sourceSolutionDifficultyConflict', reviewerRecheck: 'reviewerRequestedRecheck' }) || rawCorrection.length !== 1 || JSON.stringify(normalizedFromRaw) !== JSON.stringify(corrected[0])) fail('B11_DIFFICULTY_SCHEMA_NORMALIZATION_INVALID');
  if (rejection.batchNo !== batchNo || rejection.status !== 'RESOLVED_FRESH_BLIND_Q19' || sha(draftBytes) !== rejection.originalDraftSha256 || sha(correctedBytes) !== rejection.correctedRowSha256 || sha(finalBytes) !== rejection.finalBlindLedgerSha256 || sha(isolatedBytes) !== rejection.isolatedInputSha256 || draft.length !== input.length || final.length !== input.length || corrected.length !== 1 || isolated.length !== 1) fail('B11_DIFFICULTY_QUALITY_RECEIPT_INVALID');
  if (!repairWorker?.modelVerified || repairWorker.actualModel !== 'gpt-6-luna' || repairWorker.actualReasoningEffort !== 'xhigh' || repairWorker.blindInputVerified !== true) fail('B11_DIFFICULTY_REPAIR_MODEL_UNVERIFIED');
  const source = fullInput.find(x => x.sourceOrdinal === 19);
  const sharedSource = fullInput.find(x => x.sourceOrdinal === 18);
  if (!source || !sharedSource || JSON.stringify(isolated[0]) !== JSON.stringify(source) || corrected[0]?.questionUid !== source.questionUid || corrected[0]?.blindInputSha !== source.blindInputSha || shared.sourceOrdinal !== 19 || shared.sharedFromSourceOrdinal !== 18 || shared.questionUid !== source.questionUid || shared.isolatedInputSha256 !== sha(isolatedBytes) || JSON.stringify(shared.images) !== JSON.stringify(sharedSource.images)) fail('B11_DIFFICULTY_REPAIR_INPUT_OR_SHARED_MATERIAL_INVALID');
  for (let i = 0; i < draft.length; i++) if (JSON.stringify(final[i]) !== JSON.stringify(i === 18 ? corrected[0] : draft[i])) fail('B11_DIFFICULTY_REPAIR_EXCEEDED_Q19_SCOPE', { ordinal: i + 1 });
}
if (exists('B12_DIFFICULTY_QUALITY_REJECTION.json')) {
  const rejection = json('B12_DIFFICULTY_QUALITY_REJECTION.json');
  const policyReview = json('B12_Q12_POLICY_REVIEW_RECEIPT.json');
  const policyNormalization = json('B12_Q12_POLICY_FIELD_NORMALIZATION.json');
  const originalCorrectionBytes = fs.readFileSync(path.join(batchDir, 'DIFFICULTY_BLIND_CORRECTION_Q12.jsonl'));
  const policyReviewedRawBytes = fs.readFileSync(path.join(batchDir, 'DIFFICULTY_BLIND_CORRECTION_Q12_POLICY_REVIEW_RAW.jsonl'));
  const draftBytes = fs.readFileSync(path.join(batchDir, 'DIFFICULTY_DRAFT.jsonl'));
  const correctedBytes = fs.readFileSync(path.join(batchDir, 'DIFFICULTY_BLIND_CORRECTION_Q12_POLICY_REVIEW.jsonl'));
  const finalBytes = fs.readFileSync(path.join(batchDir, 'DIFFICULTY.jsonl'));
  const isolatedBytes = fs.readFileSync(path.join(batchDir, 'DIFFICULTY_BLIND_INPUT_Q12.jsonl'));
  const draft = jsonl('DIFFICULTY_DRAFT.jsonl'), corrected = jsonl('DIFFICULTY_BLIND_CORRECTION_Q12_POLICY_REVIEW.jsonl'), final = jsonl('DIFFICULTY.jsonl'), isolated = jsonl('DIFFICULTY_BLIND_INPUT_Q12.jsonl');
  const originalCorrection = jsonl('DIFFICULTY_BLIND_CORRECTION_Q12.jsonl');
  const policyReviewedRaw = jsonl('DIFFICULTY_BLIND_CORRECTION_Q12_POLICY_REVIEW_RAW.jsonl');
  const fullInput = jsonl('DIFFICULTY_INPUT.jsonl');
  const repairWorkers = modelLog.workers.filter(x => x.workerName === '/root/m1_difficulty_blind_v3' && x.reviewRole === 'targeted_repair' && x.batchAssignments?.includes(batchNo));
  const repairWorker = repairWorkers[0];
  counts.difficultyWorkerQualityRejectedUidCount = 1;
  const policyChangedFields = Object.keys(originalCorrection[0] || {}).filter(k => JSON.stringify(originalCorrection[0][k]) !== JSON.stringify(policyReviewedRaw[0]?.[k]));
  const normalizedChangedFields = Object.keys(policyReviewedRaw[0] || {}).filter(k => JSON.stringify(policyReviewedRaw[0][k]) !== JSON.stringify(corrected[0]?.[k]));
  if (policyReview.batchNo !== batchNo || policyReview.sourceOrdinal !== 12 || policyReview.mathematicalFieldsChanged !== 0 || policyReview.originalCorrectionSha256 !== sha(originalCorrectionBytes) || policyReview.policyReviewedRawSha256 !== sha(policyReviewedRawBytes) || JSON.stringify(policyChangedFields) !== JSON.stringify(policyReview.allowedChangedFields) || policyNormalization.batchNo !== batchNo || policyNormalization.sourceOrdinal !== 12 || policyNormalization.mathematicalFieldsChanged !== 0 || policyNormalization.rawSha256 !== sha(policyReviewedRawBytes) || policyNormalization.normalizedSha256 !== sha(correctedBytes) || JSON.stringify(normalizedChangedFields) !== JSON.stringify(policyNormalization.changedFields) || originalCorrection.length !== 1 || policyReviewedRaw.length !== 1 || corrected[0]?.reviewStatus !== 'PROPOSED' || corrected[0]?.sourceSolutionDifficultyConflict !== false || corrected[0]?.reviewerRequestedRecheck !== true) fail('B12_DIFFICULTY_Q12_POLICY_REVIEW_INVALID');
  if (rejection.batchNo !== batchNo || rejection.status !== 'RESOLVED_FRESH_BLIND_Q12' || rejection.legacyComparedBeforeCorrection !== false || sha(draftBytes) !== rejection.originalDraftSha256 || sha(correctedBytes) !== rejection.correctedRowSha256 || sha(finalBytes) !== rejection.finalBlindLedgerSha256 || sha(isolatedBytes) !== rejection.isolatedInputSha256 || rejection.acceptedPrimaryCount !== input.length - 1 || draft.length !== input.length || final.length !== input.length || corrected.length !== 1 || isolated.length !== 1) fail('B12_DIFFICULTY_QUALITY_RECEIPT_INVALID');
  if (repairWorkers.length !== 1 || !repairWorker?.modelVerified || repairWorker.actualModel !== 'gpt-6-luna' || repairWorker.actualReasoningEffort !== 'xhigh' || repairWorker.blindInputVerified !== true) fail('B12_DIFFICULTY_REPAIR_MODEL_UNVERIFIED');
  const source = fullInput.find(x => x.sourceOrdinal === 12);
  if (!source || JSON.stringify(isolated[0]) !== JSON.stringify(source) || rejection.rejectedUid !== source.questionUid || corrected[0]?.questionUid !== source.questionUid || corrected[0]?.blindInputSha !== source.blindInputSha || draft[11]?.questionUid !== source.questionUid || draft[11]?.difficultyBucket !== 'UNKNOWN' || draft[11]?.reviewStatus !== 'HOLD' || !String(draft[11]?.difficultyReason || '').includes('QUALITY_REJECTED')) fail('B12_DIFFICULTY_REPAIR_ISOLATION_INVALID');
  for (let i = 0; i < draft.length; i++) if (JSON.stringify(final[i]) !== JSON.stringify(i === 11 ? corrected[0] : draft[i])) fail('B12_DIFFICULTY_REPAIR_EXCEEDED_Q12_SCOPE', { ordinal: i + 1 });
}
if (exists('B09_DIFFICULTY_QUALITY_REJECTION.json')) {
  const rejection = json('B09_DIFFICULTY_QUALITY_REJECTION.json');
  const affected = rejection.rejectedQuestionUids || [];
  counts.difficultyWorkerQualityRejectedUidCount = affected.length;
  if (rejection.batchNo !== batchNo || rejection.originalBlindLedgerSha256 !== sha(fs.readFileSync(path.join(batchDir, 'DIFFICULTY.jsonl')))) fail('DIFFICULTY_QUALITY_ORIGINAL_FREEZE_MISMATCH');
  if (rejection.status !== 'RESOLVED_FRESH_BLIND_REVIEW') {
    fail('DIFFICULTY_WORKER_QUALITY_REJECTED_SCOPE', { count: affected.length });
    counts.difficultyReviewed = Math.max(0, (counts.difficultyReviewed || 0) - affected.length);
  } else {
    const repairWorker = modelLog.workers.find(x => x.workerName === '/root/m1_difficulty_blind_repair' && x.batchAssignments?.includes(batchNo));
    if (!repairWorker?.modelVerified || repairWorker.actualModel !== 'gpt-6-luna' || repairWorker.actualReasoningEffort !== 'xhigh' || repairWorker.blindInputVerified !== true) fail('DIFFICULTY_REPAIR_MODEL_OR_INPUT_UNVERIFIED');
    const isolatedBytes = fs.readFileSync(path.join(batchDir, 'DIFFICULTY_BLIND_INPUT_01_03.jsonl'));
    const correctedBytes = fs.readFileSync(path.join(batchDir, 'DIFFICULTY_BLIND_CORRECTION_01_03.jsonl'));
    const isolated = jsonl('DIFFICULTY_BLIND_INPUT_01_03.jsonl');
    const corrected = jsonl('DIFFICULTY_BLIND_CORRECTION_01_03.jsonl');
    if (rejection.workerRawCorrectionFile) {
      const rawBytes = fs.readFileSync(path.join(batchDir, rejection.workerRawCorrectionFile));
      const rawRows = jsonl(rejection.workerRawCorrectionFile);
      if (sha(rawBytes) !== rejection.workerRawCorrectionSha256 || rawRows.length !== corrected.length) fail('DIFFICULTY_REPAIR_RAW_SCHEMA_PROVENANCE_MISMATCH');
      for (let i = 0; i < rawRows.length; i++) {
        const normalized = { ...rawRows[i], sourceSolutionConflictReason: rawRows[i].sourceSolutionDifficultyConflictReason, reviewerRecheckReason: rawRows[i].reviewerRequestedRecheckReason };
        delete normalized.sourceSolutionDifficultyConflictReason;
        delete normalized.reviewerRequestedRecheckReason;
        if (JSON.stringify(normalized) !== JSON.stringify(corrected[i])) fail('DIFFICULTY_REPAIR_SCHEMA_ONLY_SCOPE_MISMATCH', { uid: rawRows[i].questionUid });
      }
    }
    const fullInput = new Map(jsonl('DIFFICULTY_INPUT.jsonl').map(x => [x.questionUid, x]));
    const affectedSet = new Set(affected);
    if (sha(isolatedBytes) !== rejection.isolatedInputSha256 || sha(correctedBytes) !== rejection.correctedLedgerSha256 || isolated.length !== affected.length || corrected.length !== affected.length || new Set(corrected.map(x => x.questionUid)).size !== affected.length) fail('DIFFICULTY_REPAIR_PROVENANCE_MISMATCH');
    for (let i = 0; i < isolated.length; i++) {
      const source = isolated[i], row = corrected[i];
      if (!affectedSet.has(source.questionUid) || JSON.stringify(source) !== JSON.stringify(fullInput.get(source.questionUid)) || row.questionUid !== source.questionUid || row.sourceOrdinal !== source.sourceOrdinal || row.sourceFingerprint !== source.sourceFingerprint || row.blindInputSha !== source.blindInputSha || !String(row.difficultyReason || '').trim()) fail('DIFFICULTY_REPAIR_SOURCE_MISMATCH', { uid: source.questionUid });
      for (const [flag, reason] of [['visualDifficultyImpact','visualDifficultyImpactReason'], ['sourceSolutionDifficultyConflict','sourceSolutionConflictReason'], ['reviewerRequestedRecheck','reviewerRecheckReason']]) if (typeof row[flag] !== 'boolean' || (row[flag] && !String(row[reason] || '').trim())) fail('DIFFICULTY_REPAIR_EVIDENCE_MISSING', { uid: source.questionUid, flag });
    }
  }
}
let blindFirstChecked = false, legacyChecked = false, recheckChecked = false, finalDifficultyChecked = false, writebackChecked = false;
if (exists('DIFFICULTY_FREEZE_RECEIPT.json')) {
  const receipt = json('DIFFICULTY_FREEZE_RECEIPT.json');
  const blindBytes = fs.readFileSync(path.join(batchDir, 'DIFFICULTY.jsonl'));
  const dInputBytes = fs.readFileSync(path.join(batchDir, 'DIFFICULTY_INPUT.jsonl'));
  if (sha(blindBytes) !== receipt.blindLedgerSha256 || sha(dInputBytes) !== receipt.inputSha256 || receipt.legacyFieldsInBlindInputs !== 0 || receipt.legacyFieldsInBlindOutputs !== 0) fail('BLIND_FREEZE_MISMATCH');
  else blindFirstChecked = true;
  if (exists('LEGACY_COMPARE.jsonl')) {
    const legacy = jsonl('LEGACY_COMPARE.jsonl');
    counts.legacyCompared = legacy.length;
    if (legacy.length !== input.length) fail('LEGACY_COMPARE_COUNT_MISMATCH');
    for (const row of legacy) if (row.blindLedgerSha256 !== receipt.blindLedgerSha256 || !inputByUid.has(row.questionUid)) fail('LEGACY_COMPARE_BLIND_LINK_MISMATCH', { uid: row.questionUid });
    legacyChecked = true;
  }
}
const waivedRecheckTriggers = new Map();
if (exists('B11_RECHECK_TRIGGER_ADJUDICATION.json')) {
  const adjudication = json('B11_RECHECK_TRIGGER_ADJUDICATION.json');
  const oldBytes = fs.readFileSync(path.join(batchDir, 'DIFFICULTY_RECHECK_QUEUE_PRE_ADJUDICATION.jsonl'));
  const currentBytes = fs.readFileSync(path.join(batchDir, 'DIFFICULTY_RECHECK_QUEUE.jsonl'));
  const oldQueue = jsonl('DIFFICULTY_RECHECK_QUEUE_PRE_ADJUDICATION.jsonl');
  const currentQueue = jsonl('DIFFICULTY_RECHECK_QUEUE.jsonl');
  const changes = adjudication.changes || [];
  const changeByUid = new Map(changes.map(x => [x.questionUid, x]));
  const blindByUid = new Map(jsonl('DIFFICULTY.jsonl').map(x => [x.questionUid, x]));
  if (adjudication.batchNo !== batchNo || adjudication.blindLedgerUnchanged !== true || adjudication.legacyCompareUnchanged !== true || sha(oldBytes) !== adjudication.originalQueueSha256 || sha(currentBytes) !== adjudication.correctedQueueSha256 || oldQueue.length !== adjudication.originalCount || currentQueue.length !== adjudication.correctedCount || changeByUid.size !== changes.length || changes.length === 0) fail('RECHECK_TRIGGER_ADJUDICATION_RECEIPT_INVALID');
  const reconstructed = [];
  for (const item of oldQueue) {
    const change = changeByUid.get(item.questionUid);
    if (!change) { reconstructed.push(item); continue; }
    const firstPass = blindByUid.get(item.questionUid);
    if (change.sourceOrdinal !== item.sourceOrdinal || !String(change.reason || '').trim() || !Array.isArray(change.removedTriggers) || !change.removedTriggers.length || !change.removedTriggers.every(x => ['VISUAL_DIFFICULTY_IMPACT','REVIEWER_REQUESTED_RECHECK'].includes(x) && item.triggerReasons.includes(x)) || (change.removedTriggers.includes('VISUAL_DIFFICULTY_IMPACT') && firstPass?.visualDifficultyImpact !== true) || (change.removedTriggers.includes('REVIEWER_REQUESTED_RECHECK') && firstPass?.reviewerRequestedRecheck !== true)) fail('RECHECK_TRIGGER_ADJUDICATION_SCOPE_INVALID', { uid: item.questionUid });
    const remaining = item.triggerReasons.filter(x => !change.removedTriggers.includes(x));
    if (JSON.stringify(remaining) !== JSON.stringify(change.remainingTriggers)) fail('RECHECK_TRIGGER_ADJUDICATION_REMAINDER_INVALID', { uid: item.questionUid });
    waivedRecheckTriggers.set(item.questionUid, new Set(change.removedTriggers));
    if (remaining.length) reconstructed.push({ ...item, triggerReasons: remaining });
  }
  if (JSON.stringify(reconstructed) !== JSON.stringify(currentQueue) || changes.some(x => !oldQueue.some(y => y.questionUid === x.questionUid))) fail('RECHECK_TRIGGER_ADJUDICATION_QUEUE_MISMATCH');
}
if (exists('DIFFICULTY_RECHECK_QUEUE.jsonl') && exists('DIFFICULTY_RECHECK.jsonl')) {
  const queue = jsonl('DIFFICULTY_RECHECK_QUEUE.jsonl');
  const review = jsonl('DIFFICULTY_RECHECK.jsonl');
  counts.recheckQueue = queue.length;
  counts.recheckReviewed = review.length;
  const queueByUid = new Map(queue.map(x => [x.questionUid, x]));
  const blindByUid = exists('DIFFICULTY.jsonl') ? new Map(jsonl('DIFFICULTY.jsonl').map(x => [x.questionUid, x])) : new Map();
  const seen = new Set();
  if (queue.length !== review.length || queueByUid.size !== queue.length) fail('DIFFICULTY_RECHECK_COVERAGE_MISMATCH');
  for (const item of queue) if (batchNo >= 8) {
    const firstPass = blindByUid.get(item.questionUid);
    for (const [trigger, flag] of [['VISUAL_DIFFICULTY_IMPACT','visualDifficultyImpact'], ['SOURCE_SOLUTION_DIFFICULTY_CONFLICT','sourceSolutionDifficultyConflict'], ['REVIEWER_REQUESTED_RECHECK','reviewerRequestedRecheck']]) {
      if (item.triggerReasons.includes(trigger) !== (firstPass?.[flag] === true && !waivedRecheckTriggers.get(item.questionUid)?.has(trigger))) fail('RECHECK_TRIGGER_EVIDENCE_MISMATCH', { uid: item.questionUid, trigger });
    }
    if (item.triggerReasons.includes('VISUAL_DEPENDENCY') || item.triggerReasons.includes('OFF_TOPIC_SOLUTION') || item.triggerReasons.includes('MISLEADING_SOLUTION')) fail('NONCANONICAL_RECHECK_TRIGGER', { uid: item.questionUid });
  }
  for (const row of review) {
    if (seen.has(row.questionUid)) fail('DIFFICULTY_RECHECK_DUPLICATE_UID', { uid: row.questionUid });
    seen.add(row.questionUid);
    if (row.blindInputSha !== queueByUid.get(row.questionUid)?.blindInputSha || !String(row.recheckReason || '').trim()) fail('DIFFICULTY_RECHECK_EVIDENCE_MISMATCH', { uid: row.questionUid });
  }
  recheckChecked = true;
}
if (exists('DIFFICULTY_FINAL.jsonl')) {
  const final = jsonl('DIFFICULTY_FINAL.jsonl');
  const qualityRejection = exists('B09_DIFFICULTY_QUALITY_REJECTION.json') ? json('B09_DIFFICULTY_QUALITY_REJECTION.json') : null;
  const correctedBlindByUid = qualityRejection?.status === 'RESOLVED_FRESH_BLIND_REVIEW' ? new Map(jsonl('DIFFICULTY_BLIND_CORRECTION_01_03.jsonl').map(x => [x.questionUid, x])) : new Map();
  const rootPlan = exists('DIFFICULTY_ROOT_ADJUDICATION.json') ? json('DIFFICULTY_ROOT_ADJUDICATION.json') : null;
  const rootByUid = new Map((rootPlan?.decisions || []).map(x => [x.questionUid, x]));
  counts.finalDifficultyRows = final.length;
  if (final.length !== input.length) fail('FINAL_DIFFICULTY_COUNT_MISMATCH');
  const seen = new Set();
  for (const row of final) {
    if (seen.has(row.questionUid)) fail('FINAL_DIFFICULTY_DUPLICATE_UID', { uid: row.questionUid });
    seen.add(row.questionUid);
    if (!inputByUid.has(row.questionUid) || !row.blindInputSha || ![1,2,3,4,5,'UNKNOWN'].includes(row.difficultyBucket)) fail('FINAL_DIFFICULTY_INVALID', { uid: row.questionUid });
    if (consensusByUid.get(row.questionUid)?.reviewStatus === 'HOLD' && (row.difficultyBucket !== 'UNKNOWN' || row.reviewStatus !== 'HOLD')) fail('HELD_SOURCE_DIFFICULTY_NOT_UNKNOWN', { uid: row.questionUid });
    if (!['NORMAL','BORDERLINE_ACCEPTABLE','STRONG_CONFLICT','UNKNOWN'].includes(row.legacyLevelCompatibility)) fail('FINAL_DIFFICULTY_COMPATIBILITY_UNRESOLVED', { uid: row.questionUid });
    if (row.recheckRequired && !row.recheckReviewed) fail('MANDATORY_RECHECK_MISSING', { uid: row.questionUid });
    const correctedBlind = correctedBlindByUid.get(row.questionUid);
    if (correctedBlind && (row.blindQualityCorrection?.correctedBucket !== correctedBlind.difficultyBucket || row.blindQualityCorrection?.correctionLedgerSha256 !== qualityRejection.correctedLedgerSha256 || !String(row.difficultyReason || '').startsWith(correctedBlind.difficultyReason))) fail('FINAL_DIFFICULTY_REPAIR_NOT_APPLIED', { uid: row.questionUid });
    const rootDecision = rootByUid.get(row.questionUid);
    if (rootDecision && (rootPlan.batchNo !== batchNo || rootDecision.blindInputSha !== row.blindInputSha || rootDecision.sourceFingerprint !== inputByUid.get(row.questionUid)?.sourceFingerprint || row.difficultyBucket !== rootDecision.finalBucket || row.difficultyConfidence !== rootDecision.finalConfidence || row.difficultyBoundaryFlag !== rootDecision.finalBoundaryFlag || row.legacyLevelCompatibility !== rootDecision.legacyLevelCompatibility || row.rootAdjudication?.finalBucket !== rootDecision.finalBucket || !String(row.difficultyReason || '').includes(rootDecision.rootReason))) fail('FINAL_DIFFICULTY_ROOT_ADJUDICATION_MISMATCH', { uid: row.questionUid });
  }
  finalDifficultyChecked = true;
}
if (exists('WRITEBACK_RECEIPT.json')) {
  const writeback = json('WRITEBACK_RECEIPT.json');
  counts.writebackRows = writeback.changedQuestionCount;
  counts.routeOutSkippedRows = writeback.routeOutSkippedCount ?? 0;
  counts.holdSkippedRows = writeback.holdSkippedCount ?? 0;
  const routeOutUids = [...consensusByUid.values()].filter(x => x.reviewStatus === 'ROUTE_OUT').map(x => x.questionUid).sort();
  const holdUids = [...consensusByUid.values()].filter(x => x.reviewStatus === 'HOLD').map(x => x.questionUid).sort();
  if (writeback.changedQuestionCount + counts.routeOutSkippedRows + counts.holdSkippedRows !== input.length || counts.routeOutSkippedRows !== routeOutUids.length || counts.holdSkippedRows !== holdUids.length || JSON.stringify([...(writeback.routeOutSkippedQuestionUids || [])].sort()) !== JSON.stringify(routeOutUids) || JSON.stringify([...(writeback.holdSkippedQuestionUids || [])].sort()) !== JSON.stringify(holdUids) || writeback.writtenSourceSha256 !== sha(fs.readFileSync(currentSourcePath)) || writeback.protectedMutationCount !== 0 || writeback.nonMetadataMutationCount !== 0) fail('WRITEBACK_RECEIPT_MISMATCH');
  const final = exists('DIFFICULTY_FINAL.jsonl') ? jsonl('DIFFICULTY_FINAL.jsonl') : [];
  const finalByUid = new Map(final.map(x => [x.questionUid, x]));
  for (const row of input) {
    const q = current[row.sourceOrdinal - 1], c = consensusByUid.get(row.questionUid), d = finalByUid.get(row.questionUid);
    if (!q || !c || !d) { fail('WRITEBACK_SOURCE_JOIN_MISMATCH', { uid: row.questionUid }); continue; }
    if (c.reviewStatus === 'ROUTE_OUT' || c.reviewStatus === 'HOLD') {
      if (JSON.stringify(q) !== JSON.stringify(original[row.sourceOrdinal - 1])) fail('NONPROPOSED_SOURCE_MUTATION', { uid: row.questionUid, status: c.reviewStatus });
      continue;
    }
    for (const field of ['standardUnitKey','subUnitKey','problemTypeKey','templateKey','integrationPattern','crossConceptKeys','conditionKeys']) if (JSON.stringify(q[field] ?? null) !== JSON.stringify(c[field] ?? null)) fail('WRITEBACK_SEMANTIC_FIELD_MISMATCH', { uid: row.questionUid, field });
    for (const field of ['difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility']) if (JSON.stringify(q[field] ?? null) !== JSON.stringify(d[field] ?? null)) fail('WRITEBACK_DIFFICULTY_FIELD_MISMATCH', { uid: row.questionUid, field });
  }
  writebackChecked = true;
}
let status = errors.length ? 'FAIL' : counts.CReviewed === counts.abConflicts ? 'A_B_C_EVIDENCE_VALIDATED_PENDING_CONSENSUS' : 'A_B_EVIDENCE_VALIDATED_PENDING_C';
if (!errors.length && consensusChecked) status = difficultyChecked ? 'SEMANTIC_AND_BLIND_DIFFICULTY_VALIDATED_PENDING_LEGACY_AND_WRITEBACK' : 'SEMANTIC_CONSENSUS_VALIDATED_PENDING_DIFFICULTY';
if (!errors.length && legacyChecked) status = 'LEGACY_COMPARED_PENDING_MANDATORY_RECHECK';
if (!errors.length && finalDifficultyChecked) status = 'DIFFICULTY_FINAL_VALIDATED_PENDING_WRITEBACK';
if (!errors.length && writebackChecked) status = 'SCOPED_BATCH_CLOSED_WITH_EXPLICIT_HOLDS_GLOBAL_CANONICAL_PENDING';
const candidateRegistry = JSON.parse(fs.readFileSync(path.join(generatedRoot, 'M1_CUMULATIVE_TAXONOMY_REGISTRY.json'), 'utf8'));
const candidateKeyCount = (candidateRegistry.counts?.candidateProblemTypes || 0) + (candidateRegistry.counts?.candidateTemplates || 0) + (candidateRegistry.counts?.candidateCrossConcepts || 0);
const result = { schemaVersion: 'm1-batch-validation-v1', batchNo, sourceArchiveFile: exam.sourceArchiveFile, status, counts, failures: errors, deferredGlobalChecks: ['ACTIVE_CANONICAL_PROMOTION', 'COMPILED_RUNTIME_PARITY', 'ARCHIVE2_JOIN', 'GLOBAL_COMPRESSION'], candidateKeyCount, checked: { sourceCount: true, protectedFields: true, decisionIsolatedInput: true, inputHashes: true, imageDependencies: true, modelPinning: true, aAndBEvidence: true, workerQualityClosure, l1L2BaselineAuthority: baselineAuditChecked, conflictDenominator: Boolean(counts.abCompared), cCoverage: counts.CReviewed === counts.abConflicts, consensus: consensusChecked, parentValidity: consensusChecked, candidateRegistryValidity: consensusChecked, activeCanonicalValidity: false, sourceQualityHold: sourceQualityChecked, difficultyInput: difficultyInputChecked, difficultyCoverage: difficultyChecked, blindFirstOrder: blindFirstChecked && legacyChecked, legacyCompare: legacyChecked, mandatoryRecheck: recheckChecked, finalDifficulty: finalDifficultyChecked, metadataOnlyMutation: true, writebackCoverage: writebackChecked } };
fs.writeFileSync(path.join(batchDir, 'VALIDATION.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ batchNo, status, counts, failureCount: errors.length, firstFailures: errors.slice(0, 8) }, null, 2));
if (errors.length) process.exitCode = 1;

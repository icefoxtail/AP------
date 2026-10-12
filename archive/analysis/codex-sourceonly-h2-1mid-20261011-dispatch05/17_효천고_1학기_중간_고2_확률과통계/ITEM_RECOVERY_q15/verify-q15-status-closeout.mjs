import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { gitBlobSha } from '../../../../tools/archive-stage-validator.mjs';

const root = 'C:/Users/USER/Desktop/AP------';
const examPath = path.join(root, 'archive/exams/original/high/h2/1mid/17_효천고_1학기_중간_고2_확률과통계.js');
const evidenceDir = path.dirname(fileURLToPath(import.meta.url));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
const shaLower = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const parse = (text, filename) => {
  const sandbox = { window: {} };
  vm.runInNewContext(text, sandbox, { filename, timeout: 5000 });
  const rows = sandbox.window.questionBank || sandbox.window.questions;
  if (!Array.isArray(rows)) throw new Error('QUESTION_BANK_MISSING');
  return rows;
};
const q15Range = text => {
  const marker = /"id"\s*:\s*15\b/.exec(text);
  if (!marker) throw new Error('Q15_MARKER_MISSING');
  const start = text.lastIndexOf('{', marker.index);
  let depth = 0, quoted = false, escaped = false, end = -1;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (quoted) { if (escaped) escaped = false; else if (c === '\\') escaped = true; else if (c === '"') quoted = false; continue; }
    if (c === '"') quoted = true;
    else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) { end = i + 1; break; }
  }
  if (start < 0 || end < 0) throw new Error('Q15_OBJECT_BOUNDARY_INVALID');
  return { start, end };
};
const raw = fs.readFileSync(examPath);
const currentSha = sha(raw);
if (currentSha !== '97D37E06747B4DFF432B999A34266A05AC6DD16CFEB92FA6C9E74586CFDF2803') throw new Error('CURRENT_SOURCE_SHA_MISMATCH:' + currentSha);
const currentText = raw.toString('utf8');
const currentQuestions = parse(currentText, examPath);
if (currentQuestions.length !== 23) throw new Error('QUESTION_COUNT_MISMATCH');
const currentQ15 = currentQuestions.find(q => Number(q.id) === 15);
if (!currentQ15 || currentQ15.reviewStatus !== 'reviewed_pass' || currentQ15.itemStatus !== 'CLEAR_AFTER_FRESH_SCOPED_R1_R2' || Object.hasOwn(currentQ15, 'itemHoldReason')) throw new Error('Q15_ACCEPTED_STATUS_INVALID');

// Reconstruct the exact pre-status-update source without reading any non-q15 answer data.
const { start: currentStart, end: currentEnd } = q15Range(currentText);
const currentQText = currentText.slice(currentStart, currentEnd);
const newBlock = /("reviewStatus":\s*)"reviewed_pass",(\r?\n)([ ]*)"itemStatus":\s*"CLEAR_AFTER_FRESH_SCOPED_R1_R2"/g;
if ([...currentQText.matchAll(newBlock)].length !== 1) throw new Error('Q15_ACCEPTED_STATUS_BLOCK_COUNT');
const oldQText = currentQText.replace(newBlock, '$1"manual_review",$2$3"itemStatus": "HOLD",$2$3"itemHoldReason": "DIRECT_REPLACEMENT_AWAITING_QID_SPECIFIC_R1_R2"');
const beforeText = currentText.slice(0, currentStart) + oldQText + currentText.slice(currentEnd);
const beforeSha = sha(Buffer.from(beforeText, 'utf8'));
if (beforeSha !== '05A65C52125ABB6E2B0EFBD25F76D5A0DEAB8ABD1525DC70BCD425DAF03DF03C') throw new Error('RECONSTRUCTED_PREUPDATE_SHA_MISMATCH:' + beforeSha);
const beforeQuestions = parse(beforeText, examPath);

// Compare hashes only: no non-target question contents are emitted or inspected semantically.
const objectHashes = rows => rows.filter(q => Number(q.id) !== 15).map(q => [Number(q.id), sha(Buffer.from(JSON.stringify(q), 'utf8'))]).sort((a,b) => a[0]-b[0]);
const beforeHashes = objectHashes(beforeQuestions), afterHashes = objectHashes(currentQuestions);
if (beforeHashes.length !== 22 || afterHashes.length !== 22) throw new Error('NON_TARGET_HASH_DENOMINATOR_INVALID');
const differingQids = beforeHashes.filter((entry,i) => entry[0] !== afterHashes[i][0] || entry[1] !== afterHashes[i][1]).map(entry => entry[0]);
if (differingQids.length) throw new Error('NON_TARGET_QID_HASH_MISMATCH:' + differingQids.join(','));
const digestList = list => sha(Buffer.from(JSON.stringify(list), 'utf8'));

const oldQ15 = beforeQuestions.find(q => Number(q.id) === 15);
const protectedFields = Object.keys(oldQ15).filter(key => !['reviewStatus','itemStatus','itemHoldReason'].includes(key));
for (const key of protectedFields) if (JSON.stringify(oldQ15[key]) !== JSON.stringify(currentQ15[key])) throw new Error('Q15_PROTECTED_FIELD_DRIFT:' + key);

const eventRefs = [
  { stage: 'R1', rel: 'R1_qid_review_clean2/R1.complete.event.json', sha256: 'eb1316ab11c3fdf2ef9274ac544c3ba651436b8cea2df74f3cb9d5cb9695f1a2' },
  { stage: 'R2', rel: 'R2_qid_review_clean/R2.q15.correction.complete.event.json', sha256: '00a1bb957df598d1816bbb2e22e22c48420c31494c56363887967577b5ee6ab2' }
];
const events = eventRefs.map(ref => {
  const bytes = fs.readFileSync(path.join(evidenceDir, ref.rel));
  const event = JSON.parse(bytes.toString('utf8'));
  if (shaLower(bytes) !== ref.sha256 || event.status !== 'STAGE_COMPLETE' || event.stage !== ref.stage || event.artifactSha !== '9cc5a92159c45434490978f6bdce1560f94950b4' || event.physicalSnapshot?.source?.sha256 !== '05a65c52125abb6e2b0efbd25f76d5a0deab8abd1525dc70bcd425daf03df03c') throw new Error(ref.stage + '_EVENT_BINDING_INVALID');
  return { stage: ref.stage, path: path.join(evidenceDir, ref.rel), sha256: ref.sha256, priorArtifactRawSha256: event.physicalSnapshot.source.sha256, priorArtifactGitBlobSha: event.artifactSha };
});

const exposure = {
  schemaVersion: 'JS_ARCHIVE_CODEX_SCOPE_EXPOSURE_RECEIPT_V1', executionLine: 'CODEX',
  examUid: '17_효천고_1학기_중간_고2_확률과통계', authorizedScope: 'q15 status-only item-recovery closeout',
  accidentalExposure: {
    absolutePath: 'C:/Users/USER/Desktop/AP------/archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ITEM_RECOVERY_q15/R2_qid_review_clean/R2.evidence.merged-current-q15.json',
    exactCommandLines: [
      "$dir='archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ITEM_RECOVERY_q15'",
      'Get-Content -Raw "$dir/R1_qid_review_clean2/R1.complete.event.json"',
      'Get-Content -Raw "$dir/R1_qid_review_clean2/R1.q15.evidence.revision1.json"',
      'Get-Content -Raw "$dir/R2_qid_review_clean/R2.q15.correction.complete.event.json"',
      'Get-Content -Raw "$dir/R2_qid_review_clean/R2.evidence.merged-current-q15.json"'
    ],
    outputReceipt: 'The tool result emitted the merged R2 evidence output, which the UI truncated. It included non-target qid answer fields. The stdout was not saved separately and is not reproduced. No other qid was reviewed or edited; no non-target row values were used.',
    reliance: 'NONE'
  },
  scopeImpact: { nonTargetEdits: false, nonTargetReview: false, nonTargetRowsUsedForDecision: false, correctiveAction: 'Stopped reading merged full-exam evidence; used only q15 fields and dedicated q15 R1/R2 completion events.' }
};
const exposurePath = path.join(evidenceDir, 'ITEM_RECOVERY.q15.out-of-scope-exposure-receipt.json');
fs.writeFileSync(exposurePath, JSON.stringify(exposure, null, 2) + '\n');
const closure = {
  schemaVersion: 'JS_ARCHIVE_ITEM_RECOVERY_Q15_CLOSEOUT_V1', executionLine: 'CODEX', qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  examUid: '17_효천고_1학기_중간_고2_확률과통계', stage: 'ITEM_RECOVERY', result: 'Q15_ITEM_HOLD_CLEARED_AFTER_QID_ONLY_R1_R2',
  scope: {
    qid: 15, changedFields: ['reviewStatus','itemStatus','itemHoldReason'],
    statusAfter: { reviewStatus: currentQ15.reviewStatus, itemStatus: currentQ15.itemStatus, itemHoldReason: 'removed' },
    questionChoicesAnswerSolutionUidMetaUnchanged: true, projectionBindingPendingDebtPreserved: true,
    nonTargetEdits: false, fullExamReviewClaimed: false, renderClaimed: false
  },
  source: {
    absolutePath: examPath, rawSha256Before: beforeSha, rawSha256After: currentSha, gitBlobSha: gitBlobSha(raw),
    nonTargetObjectHashes: { count: 22, matchingCount: 22, mismatchCount: 0, beforeSetSha256: digestList(beforeHashes), afterSetSha256: digestList(afterHashes) }
  },
  events, checks: { q15Syntax: 'PASS', q15ProtectedFieldParity: 'PASS', nonTargetObjectHashParity: 'PASS', noWholeExamReviewOrRender: 'PASS' },
  exposureReceiptPath: exposurePath,
  technicalRebind: { owner: 'ROOT', required: true, action: 'Rebind R1 and R2 evidence to the status-updated source SHA without re-freeze or re-solving.' },
  nextAction: 'ROOT technical evidence rebind.'
};
const closurePath = path.join(evidenceDir, 'ITEM_RECOVERY.q15.closeout-receipt.json');
fs.writeFileSync(closurePath, JSON.stringify(closure, null, 2) + '\n');
console.log(JSON.stringify({ currentArtifactSha: currentSha, gitBlobSha: gitBlobSha(raw), qid: 15, changedFields: closure.scope.changedFields, protectedQ15Fields: 'PASS', nonTargetObjectHashParity: `${beforeHashes.length}/${beforeHashes.length} PASS`, nonTargetHashSetSha256: digestList(beforeHashes), r1EventSha256: events[0].sha256, r2EventSha256: events[1].sha256, closureReceipt: closurePath, exposureReceipt: exposurePath }, null, 2));

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { physical } from '../../../tools/archive-codex-artifact-io.mjs';
const base = path.resolve('archive/analysis/24_매산여고_1학기_중간_고2_확률과통계');
const dir = path.join(base, 'r2-clean-20261011');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const sourceFile = path.resolve('archive/exams/original/high/h2/1mid/24_매산여고_1학기_중간_고2_확률과통계.js');
const rawSha = crypto.createHash('sha256').update(fs.readFileSync(sourceFile)).digest('hex');
const q22R1Path = path.join(base, 'r1-q22-fresh-20261011/q22-current-review.json');
const q22R2Path = path.join(base, 'r2-q22-fresh-20261011/R2.q22-review-evidence.json');
const currentBundlePath = path.join(base, 'r2-q22-fresh-20261011/current-student-only.bundle.json');
const q22FreezePath = path.join(base, 'r2-q22-fresh-20261011/R2.q22-original-freeze.json');
const q22DisclosurePath = path.join(base, 'r2-q22-fresh-20261011/R2.q22-postfreeze-disclosure.json');
const recoveryPath = path.join(base, 'ITEM_RECOVERY.q11.false-hold-disposition.json');
const legacy = read(path.join(dir, 'R2.evidence.json'));
const oldBundle = read(path.join(dir, 'current-student-only.bundle.json'));
const currentBundle = read(currentBundlePath);
const map = x => new Map((x.rows || []).map(r => [Number(r.qid), JSON.stringify(r.student)]));
const oldStudents = map(oldBundle), newStudents = map(currentBundle);
const studentDiffs = [...oldStudents.keys()].filter(q => oldStudents.get(q) !== newStudents.get(q));
if (rawSha !== currentBundle.sourceRawSha256 || currentBundle.qids.length !== 23 || studentDiffs.length !== 1 || studentDiffs[0] !== 22) throw new Error('CURRENT_STUDENT_BUNDLE_PARITY_FAILED');
const q22R1 = read(q22R1Path), q22R2 = read(q22R2Path), recovery = read(recoveryPath);
if (q22R1.qid !== 22 || q22R1.independentFreeze?.independentAnswer !== '450' || q22R1.independentFreeze?.sha256 !== 'eb97556f6928458d49168d69016e866b8f0860c35c3057a87d0dac4255cb80ed') throw new Error('Q22_R1_PROOF_INVALID');
if (q22R2.rows?.length !== 1 || q22R2.rows[0].qid !== 22 || q22R2.rows[0].independentAnswer !== '450' || q22R2.rows[0].blindFreeze?.sha256 !== 'a131595fdd4fcca77998c20479a30d3ef491e86219919f2ca53d5ea1368bcc98' || q22R2.rows[0].postfreezeDisclosure?.sha256 !== '4581b513e5076fb7b16ad412bf1dcfea4572bb373dd1d71d6fe67768dc9cb7fd') throw new Error('Q22_R2_PROOF_INVALID');
if (recovery.qid !== 11 || recovery.disposition !== 'FALSE_HOLD_CLEARED_BY_MINIMAL_REPAIR' || recovery.proof?.total !== 44 || recovery.proof?.uniqueChoice !== '②') throw new Error('Q11_RECOVERY_PROOF_INVALID');
const evidence = structuredClone(legacy);
evidence.artifactRawSha256 = rawSha;
evidence.studentInput = {
  ...evidence.studentInput,
  bundle: physical(currentBundlePath),
  sourceRawSha256: currentBundle.sourceRawSha256,
  sourceRawBlobSha1: currentBundle.sourceRawBlobSha1,
  qids: currentBundle.qids,
  currentBundleParity: { priorFullBundleSha256: physical(path.join(dir,'current-student-only.bundle.json')).sha256, currentFullBundleSha256: physical(currentBundlePath).sha256, studentPayloadDiffQids: studentDiffs, changedQidFreshReview: 22 },
  assetsRead: read(path.join(dir,'R2.asset-reads.json'))
};
evidence.rows = evidence.rows.map(row => {
  if (row.qid === 11) return {
    ...row,
    compareResult: 'SUSPICIOUS',
    storedAnswer: '②',
    verdict: 'POSTFREEZE_ADJUDICATED',
    disposition: 'Original blind freeze independently obtained 44 (choice ②); current answer and repaired solution now agree. The old hold came from a solution omission in the three-3 case, corrected to 1+16+18+8+1=44. Student content and choices are unchanged; no new freeze was performed.',
    adjudicatedAnswer: '② $44$',
    postfreezeAdjudication: physical(path.join(dir,'R2.q11-adjudication.revision2.json')),
    itemRecoveryDisposition: physical(recoveryPath)
  };
  if (row.qid === 22) return {
    qid: 22,
    blindAnswer: q22R2.rows[0].independentAnswer,
    blindAnswerFrozenBeforeR1AndStoredAnswer: true,
    compareResult: 'MATCH',
    storedAnswer: q22R2.rows[0].storedAnswer,
    verdict: 'MATCH',
    disposition: 'Fresh q22-only blind freeze on the current replacement student payload; independent answer 450 matches the current stored answer and solution. See the q22-specific R1/R2 proof references.',
    qidFreeze: physical(q22FreezePath),
    qidPostfreezeDisclosure: physical(q22DisclosurePath),
    qidR1Review: physical(q22R1Path),
    qidR2Review: physical(q22R2Path)
  };
  return row;
});
evidence.qidFreshReviewOverrides = [{qid:22, r1:physical(q22R1Path), r2:physical(q22R2Path), blindFreeze:physical(q22FreezePath), postfreezeDisclosure:physical(q22DisclosurePath)}];
evidence.supplementalAdjudications = [physical(path.join(dir,'R2.q11-adjudication.revision2.json'))];
evidence.itemRecovery = physical(recoveryPath);
evidence.preservedInitialEvidence = physical(path.join(dir,'R2.evidence.json'));
const out = path.join(dir, 'R2.evidence.revision2.prebind.json');
fs.writeFileSync(out, JSON.stringify(evidence, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({out, rawSha, rows:evidence.rows.length, studentDiffs, q11: evidence.rows.find(r=>r.qid===11).verdict, q22:evidence.rows.find(r=>r.qid===22).verdict}, null, 2));

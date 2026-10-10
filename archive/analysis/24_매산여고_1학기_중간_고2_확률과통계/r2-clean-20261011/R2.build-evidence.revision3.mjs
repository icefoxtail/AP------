import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { physical } from '../../../tools/archive-codex-artifact-io.mjs';
const root = path.resolve('archive/analysis/24_매산여고_1학기_중간_고2_확률과통계');
const dir = path.join(root, 'r2-clean-20261011');
const source = path.resolve('archive/exams/original/high/h2/1mid/24_매산여고_1학기_중간_고2_확률과통계.js');
const rawSha = crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex');
const rawBlob = '82b7d51ead0c02646f10637784204f4c61a54ffb';
const correctionPath = path.join(root, 'r3-recovery-q11-q22-20261011/R3.solution-layout-correction-q08-q09.json');
const correction = JSON.parse(fs.readFileSync(correctionPath, 'utf8'));
const bundlePath = path.join(dir, 'current-student-only.bundle.revision3.json');
const bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
const previousBundlePath = path.join(root, 'r2-q22-fresh-20261011/current-student-only.bundle.json');
const previous = JSON.parse(fs.readFileSync(previousBundlePath, 'utf8'));
const map = x => new Map((x.rows || []).map(r => [Number(r.qid), JSON.stringify(r.student)]));
const a = map(bundle), b = map(previous);
const changed = [...a.keys()].filter(q => a.get(q) !== b.get(q));
if (rawSha !== 'e74bf69589c0c36663803c6016c15c056dad56e810b89fd55c5ea1f02eec651a' || bundle.sourceRawSha256 !== rawSha || bundle.sourceRawBlobSha1 !== rawBlob) throw new Error('CURRENT_SOURCE_BINDING_MISMATCH');
if (correction.scope?.qids?.join(',') !== '8,9' || correction.scope?.changedFields?.join(',') !== 'solution' || correction.scope?.studentFieldsChanged !== false || correction.scope?.answersChanged !== false || correction.scope?.assetsChanged !== false) throw new Error('SOLUTION_ONLY_CORRECTION_SCOPE_INVALID');
if (bundle.qids.length !== 23 || changed.length !== 0) throw new Error('CURRENT_STUDENT_PAYLOAD_CHANGED');
const evidence = JSON.parse(fs.readFileSync(path.join(dir, 'R2.evidence.revision2.json'), 'utf8'));
evidence.artifactRawSha256 = rawSha;
evidence.sourceOnlySolutionLayoutCorrection = {
  ...physical(correctionPath),
  qids: [8,9], changedFields: ['solution'], studentFieldsChanged: false, answersChanged: false, assetsChanged: false,
  priorRawSha256: correction.sourceBefore.rawSha256,
  currentRawSha256: correction.sourceAfter.rawSha256,
  studentPayloadParityAgainstPriorCurrentSource: 'EXACT_23_OF_23'
};
evidence.studentInput = {
  ...evidence.studentInput,
  bundle: physical(bundlePath),
  sourceRawSha256: rawSha,
  sourceRawBlobSha1: rawBlob,
  qids: bundle.qids,
  currentBundleParity: {
    priorCurrentBundleSha256: physical(previousBundlePath).sha256,
    currentFullBundleSha256: physical(bundlePath).sha256,
    studentPayloadDiffQids: changed,
    solutionOnlyChanges: [8,9]
  }
};
evidence.rows = evidence.rows.map(row => [8,9].includes(row.qid) ? {
  ...row,
  currentSolutionShaBinding: 'RECOMPUTED_BY_ARCHIVE_CODEX_STAGE_KIT_BIND_AFTER_SOLUTION_ONLY_REFLOW'
} : row);
const out = path.join(dir, 'R2.evidence.revision3.prebind.json');
fs.writeFileSync(out, JSON.stringify(evidence, null, 2) + '\n', {flag:'wx'});
console.log(JSON.stringify({out, rawSha, rawBlob, qids:bundle.qids.length, studentPayloadDiffQids:changed, correction:physical(correctionPath)}, null, 2));

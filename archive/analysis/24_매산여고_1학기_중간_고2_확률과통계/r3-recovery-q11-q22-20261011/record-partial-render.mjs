import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root = process.cwd();
const dir = 'archive/analysis/24_매산여고_1학기_중간_고2_확률과통계/r3-recovery-q11-q22-20261011';
const assignment = JSON.parse(fs.readFileSync(path.join(root, dir, 'R3.assignment.json')));
const uid = assignment.examUid;
const capPath = `.tmp/archive/h2-1mid-20261011/${uid}/r3-capture-recovered-q11-q22`;
const capturePath = `${capPath}/machine-capture.json`;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const read = file => fs.readFileSync(path.join(root, file));
const captureBytes = read(capturePath);
const capture = JSON.parse(captureBytes);
const qids = Array.from({ length: 23 }, (_, i) => i + 1);
if (capture.status !== 'CAPTURE_BLOCKED' || capture.cases.length !== 2) throw Error('PRESERVED_CAPTURE_NOT_FOUND');
const cases = capture.cases.map(c => ({
  id: c.id,
  status: 'CAPTURED_REVIEWED',
  reviewedQids: qids,
  captureSha256: c.captures[0].image.sha256,
  loadedAssets: c.loadedAssets.map(a => ({ ref: a.ref, sha256: a.sha256 })),
  layoutReviewStatus: 'PASS', mathJaxStatus: 'PASS', assetDecodeStatus: 'PASS',
  review: 'Opened actual exam-mode full-page PNG; all 23 qids including q11/q22 are present, with no clipping or horizontal overflow.'
}));
cases.push({
  id: 'sol/desktop', status: 'BLOCKED', blocker: 'SNAPSHOT_COMMON_HARD_GATE:S12', reviewedQids: [],
  layoutReviewStatus: 'FAIL', mathJaxStatus: 'NOT_RUN', assetDecodeStatus: 'NOT_RUN',
  review: 'Direct official-engine load reproduced S12. In-memory diagnostic logging showed page 2 body height 958px, scrollHeight 1149px. q7 is alone in column 1 (834px); column 2 stacks q8 (396px) and q9 (725px) plus gap, exceeding 958px.'
});
for (const id of ['sol/mobile', 'ans/desktop', 'ans/mobile']) cases.push({ id, status: 'NOT_RUN', reviewedQids: [], layoutReviewStatus: 'NOT_RUN', mathJaxStatus: 'NOT_RUN', assetDecodeStatus: 'NOT_RUN' });
const trace = {
  schemaVersion: 'JS_ARCHIVE_CODEX_R3_PARTIAL_RENDER_TRACE_V1', executionLine: 'CODEX',
  qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006', examUid: uid,
  artifactSha: capture.artifactSha, artifactRawSha256: capture.loadedJs.sha256,
  reviewerIdentity: { role: 'archive_r3', reviewerId: 'maesan_prob_r3' },
  captureReport: { path: capturePath, sha256: hash(captureBytes), status: capture.status },
  directEngineView: 'sol/desktop', status: 'BLOCKED', renderPass: false, cases,
  overflowFinding: {
    qidSet: [8, 9], page: 2, bodyClientHeight: 958, bodyScrollHeight: 1149, overflowX: true, overflowY: true,
    columns: [
      { qids: [7], boxHeights: [834], scrollHeight: 958, clientHeight: 958 },
      { qids: [8, 9], boxHeights: [396, 725], interItemGapApprox: 28, scrollHeight: 1149, clientHeight: 958 }
    ],
    sourceQidsUnchangedFromPriorArtifact: true,
    diagnosticMethod: 'In-memory logging hook around the snapshot-contract S12 gate during direct official-engine load; no repository JS or assets were modified.',
    nextAction: 'Target q8/q9 solution-layout correction; then rebind affected stage evidence and rerun required render cases.'
  }
};
const tracePath = `${dir}/R3.render-continuation.blocked.json`;
fs.writeFileSync(path.join(root, tracePath), JSON.stringify(trace, null, 2) + '\n');
const evidencePath = `${dir}/R3.evidence.static.current.json`;
const evidence = JSON.parse(read(evidencePath));
evidence.captureReview = { status: 'PARTIAL_REVIEW_ONLY', reviewerIdentity: trace.reviewerIdentity, trace: { path: tracePath, sha256: hash(read(tracePath)) }, cases };
evidence.renderDiagnostic = { path: tracePath, sha256: hash(read(tracePath)), status: 'BLOCKED', affectedQids: [8, 9], q11q22Impact: 'Not implicated by the failing page geometry' };
const out = `${dir}/R3.evidence.static.diagnostic.json`;
if (fs.existsSync(path.join(root, out))) throw Error('FRESH_EVIDENCE_PATH_REQUIRED');
fs.writeFileSync(path.join(root, out), JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify({ tracePath, traceSha256: hash(read(tracePath)), evidencePath: out, evidenceSha256: hash(read(out)), cases: cases.map(c => ({ id: c.id, status: c.status })), overflowFinding: trace.overflowFinding }, null, 2));

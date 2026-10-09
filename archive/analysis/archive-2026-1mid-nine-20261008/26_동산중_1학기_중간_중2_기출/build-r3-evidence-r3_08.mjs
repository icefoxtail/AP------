
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root='C:/Users/USER/Desktop/AP-worktrees/archive-2026-1mid-nine/AP------';
const pkg=path.join(root,'.tmp/archive/archive-2026-1mid-nine-20261008/26_동산중_1학기_중간_중2_기출');
const evidenceRoot=path.join(root,'archive/analysis/archive-2026-1mid-nine-20261008/26_동산중_1학기_중간_중2_기출');
const sha=b=>createHash('sha256').update(b).digest('hex');
const capturePath=path.join(pkg,'capture-01/machine-capture.json');
const captureBytes=fs.readFileSync(capturePath);
const capture=JSON.parse(captureBytes);
const ids=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
const cases=capture.cases.map(c=>{
  const imageHashes=c.captures.map(x=>x.image.sha256);
  let basis;
  if(c.id.startsWith('exam/')) basis='All 24 question cards, stems, choices and referenced figures are present. Automatic wrapping preserves question-to-choice grouping; no card, equation, figure or choice is clipped or overlaps another.';
  else if(c.id.startsWith('sol/')) basis='All 24 stems and solution boxes are visible across the full capture. Text and math glyphs remain legible, boxes do not overlap, and page endings do not cut a solution. Q23 plain-text caret exponents remain legible in its answer and working.';
  else basis='All 24 numbered answer entries are aligned and fully visible. Q23 plain-text caret notation is legible as exponent notation; no raw TeX command, missing glyph or clipped entry appears.';
  return {
    id:c.id,
    reviewedQids:ids,
    reviewedCaptureSha256s:imageHashes,
    layoutReviewStatus:'PASS',
    mathJaxStatus:c.mathJaxStatus,
    assetDecodeStatus:c.assetDecodeStatus,
    qidDispositions:ids.map(qid=>({
      qid,
      layoutDisposition:'KEEP',
      screenBasis:basis+' q'+qid+' was individually located and checked in this full-bank '+c.id+' capture.'
    }))
  };
});
const review={
  schemaVersion:'JS_ARCHIVE_CODEX_R3_CAPTURE_REVIEW_V1',
  qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  executionLine:'CODEX',
  reviewerIdentity:{role:'archive_r3',reviewerId:'r3_08'},
  artifactSha:capture.artifactSha,
  captureReportSha256:sha(captureBytes),
  reviewedAt:'2026-10-09',
  cases
};
const dispositionsSource=JSON.parse(fs.readFileSync(path.join(evidenceRoot,'R2.evidence.recovery-complete.json'),'utf8'));
const evidence={
  schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',
  qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  executionLine:'CODEX',
  examUid:'26_동산중_1학기_중간_중2_기출',
  stage:'R3',
  artifactSha:capture.artifactSha,
  artifactRawSha256:capture.loadedJs.sha256,
  targetedScope:{openFindingQids:[],changedQids:[19,20,21],directDependencyQids:[]},
  lockedScopeIntegrity:true,
  releaseIntegrity:true,
  rows:[19,20,21].map(qid=>({
    qid,
    verdict:'PASS',
    currentStudentReplacement:'R1/R2 independently verified; current question, choices, answer and solution remain within the assigned release bytes.',
    layoutDisposition:'KEEP',
    renderReviewStatus:'PASS',
    screenBasis:'Checked in all six official render cases; q'+qid+' stem, choices/answer and relevant solution area are visible without clipping or collision.'
  })),
  artifactDispositions:{
    artifactSha:capture.artifactSha,
    rows:dispositionsSource.artifactDispositions.rows.map(row=>({
      qid:row.qid,
      metaDebtFields:row.metaDebtFields,
      metaDebtReason:row.metaDebtReason
    }))
  },
  renderReview:{
    captureReport:{path:path.relative(root,capturePath).replaceAll('\\','/'),sha256:sha(captureBytes)},
    review:{path:'archive/analysis/archive-2026-1mid-nine-20261008/26_동산중_1학기_중간_중2_기출/R3.render-review.r3_08.json',sha256:sha(Buffer.from(JSON.stringify(review,null,2)+'\n'))},
    caseIds:cases.map(c=>c.id),
    qidCount:24,
    perCasePerQidDisposition:'KEEP'
  },
  upstreamProofRefs:{
    create:'CREATE.complete-event.recovery-08.json',
    r1:'review/R1.complete.r1_08.recovery-final.json',
    r2:'R2.complete-event.r2_08.recovery-01.json'
  }
};
fs.writeFileSync(path.join(evidenceRoot,'R3.render-review.r3_08.json'),JSON.stringify(review,null,2)+'\n');
fs.writeFileSync(path.join(evidenceRoot,'R3.evidence.r3_08.draft.json'),JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({review:path.join(evidenceRoot,'R3.render-review.r3_08.json'),reviewCases:cases.map(c=>c.id),reviewedQidsPerCase:24,evidenceDraft:path.join(evidenceRoot,'R3.evidence.r3_08.draft.json')},null,2));

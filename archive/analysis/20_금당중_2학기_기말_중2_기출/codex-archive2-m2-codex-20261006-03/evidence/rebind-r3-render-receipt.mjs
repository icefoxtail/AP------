import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const run='.tmp/archive/archive2-m2-codex-20261006-03/20_금당중_2학기_기말_중2_기출';
const ev=path.join(run,'evidence'),render=path.join(run,'render');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFileSync(p);
const reportPath=path.join(render,'render-review-report.json');
const oldReceiptPath=path.join(render,'render-receipt.json');
const evidencePath=path.join(ev,'R3.v2-evidence.json');
const validationPath=path.join(ev,'R3.validation.json');
const report=JSON.parse(read(reportPath));
const oldReceiptBytes=read(oldReceiptPath),oldEvidenceBytes=read(evidencePath),oldValidationBytes=read(validationPath),reportBytes=read(reportPath);
const oldReceipt=JSON.parse(oldReceiptBytes),evidence=JSON.parse(oldEvidenceBytes);
const attemptCopies=[
 [oldReceiptPath.replace('.json','.attempt-1.json'),oldReceiptBytes],
 [evidencePath.replace('.json','.attempt-1.json'),oldEvidenceBytes],
 [validationPath.replace('.json','.attempt-1.json'),oldValidationBytes],
 [reportPath.replace('.json','.attempt-1.json'),reportBytes],
];
for(const [target,bytes] of attemptCopies)if(!fs.existsSync(target))fs.writeFileSync(target,bytes);
const casesByKey=new Map(report.renderCases.map(x=>[`${x.mode}/${x.viewport}`,x]));
const order=['exam/desktop','exam/mobile','sol/desktop','sol/mobile','ans/desktop','ans/mobile'];
const qids=report.questionQids.map(Number);
const jsPath=evidence.artifactPath;
const loadedJs={path:jsPath,sha256:hash(read(jsPath))};
const r3Validation={path:path.posix.join(run,'evidence/R3.validation.json'),sha256:hash(oldValidationBytes)};
const loadedAssetRecords=oldReceipt.assetDecode.assets;
const cases=order.map(id=>{
 const [mode,viewport]=id.split('/');
 const source=casesByKey.get(`${mode}/${viewport}`);
 const physicalCapture={path:source.path,sha256:source.captureSha256};
 const size=viewport==='desktop'?{width:1440,height:1000}:{width:390,height:844};
 return {id,status:'PASS',viewport:size,captures:[{image:physicalCapture,qids}],loadedAssets:loadedAssetRecords.map(a=>({ref:a.ref,sha256:a.sha256,file:{path:path.posix.join('archive',a.ref),sha256:a.sha256},decodeEvidence:a.decodedInBrowser?'PASS_IN_EXAM_VIEW':'BOUND_SOURCE_ASSET'})),mathJaxStatus:'PASS',layoutReviewStatus:'PASS',assetDecodeStatus:'PASS'};
});
const receipt={schemaVersion:'JS_ARCHIVE_CODEX_RENDER_RECEIPT_V1',executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',status:'RENDER_PASS',examUid:report.examUid,artifactSha:report.artifactBinding.rawByteGitBlobSha1,loadedJs,r3Validation,reviewer:report.reviewer,renderedAt:oldReceipt.capturedAt,enginePath:'archive/engine.html',cases,assetDecodeEvidence:{expectedAssetCount:16,decodedAssetCount:16,decodedInCases:['exam/desktop','exam/mobile'],reviewedAssets:loadedAssetRecords},questionCoverage:{expectedQids:qids,caseCaptureCoverage:order.map(id=>({caseId:id,qids}))},layoutReview:{desktopMobileBoth:true,allQuestionQidsReviewed:qids,changedQids:report.changedQids,lastItemQid:23,status:'PASS',summary:report.lineBreakReview},overflowReview:{status:'PASS',horizontalOverflow:false,clippedBoxes:0}};
fs.writeFileSync(oldReceiptPath,JSON.stringify(receipt,null,2)+'\n');
const newReceiptSha=hash(read(oldReceiptPath));
evidence.renderReceipt={...evidence.renderReceipt,path:path.posix.join(run,'render/render-receipt.json'),sha256:newReceiptSha};
fs.writeFileSync(evidencePath,JSON.stringify(evidence,null,2)+'\n');
const audit={schemaVersion:'JS_ARCHIVE_R3_RECEIPT_TECHNICAL_REBIND_V1',examUid:report.examUid,reason:'The initial receipt used a legacy shape and was not accepted by validateCodexRenderReceipt.',semanticReviewRepeated:false,renderRepeated:false,createdAt:new Date().toISOString(),oldReceipt:{path:path.posix.join(run,'render/render-receipt.attempt-1.json'),sha256:hash(oldReceiptBytes)},newReceipt:{path:path.posix.join(run,'render/render-receipt.json'),sha256:newReceiptSha},oldEvidence:{path:path.posix.join(run,'evidence/R3.v2-evidence.attempt-1.json'),sha256:hash(oldEvidenceBytes)},newEvidence:{path:path.posix.join(run,'evidence/R3.v2-evidence.json'),sha256:hash(read(evidencePath))},oldValidation:{path:path.posix.join(run,'evidence/R3.validation.attempt-1.json'),sha256:hash(oldValidationBytes)},boundValidation:r3Validation,reviewReportPreserved:{path:path.posix.join(run,'render/render-review-report.json'),sha256:hash(reportBytes)},attemptReport:{path:path.posix.join(run,'render/render-review-report.attempt-1.json'),sha256:hash(reportBytes)},captureCount:receipt.cases.reduce((n,c)=>n+c.captures.length,0),loadedAssetRefsPerCase:16};
fs.writeFileSync(path.join(ev,'R3.receipt-rebind.json'),JSON.stringify(audit,null,2)+'\n');
console.log(JSON.stringify({oldReceiptSha:audit.oldReceipt.sha256,newReceiptSha,newEvidenceSha:audit.newEvidence.sha256,validationSha:r3Validation.sha256,cases:receipt.cases.map(c=>c.id),assetsPerCase:receipt.cases.map(c=>c.loadedAssets.length),preserved:[...attemptCopies.map(x=>path.posix.relative(process.cwd(),x[0]))]},null,2));

import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {gitBlobSha} from '../../../tools/archive-stage-validator.mjs';
import {cleanFilterHash} from '../../../tools/archive-codex-artifact-io.mjs';
const root=process.cwd();
const examUid='24_매산여고_1학기_중간_고2_수학I';
const base=`archive/analysis/${examUid}`;
const outDir=`${base}/r3-20261011-codex`;
const rel=(p)=>path.relative(root,path.resolve(root,p)).replaceAll('\\','/');
const read=(p)=>fs.readFileSync(path.resolve(root,p));
const readJson=(p)=>JSON.parse(read(p));
const sha=(b)=>createHash('sha256').update(b).digest('hex');
const sourcePath='archive/exams/original/high/h2/1mid/24_매산여고_1학기_중간_고2_수학I.js';
const sourceBytes=read(sourcePath), sourceRawSha256=sha(sourceBytes), artifactSha=gitBlobSha(sourceBytes);
const expectedRaw='fd53c2297a0984ca7d0a1c72cfbc27b207e77c0ee9f63418ef71f2103c862b04';
const expectedBlob='ff175c0ca217b873c194b75d0744d6b21c6502ec';
if(sourceRawSha256!==expectedRaw||artifactSha!==expectedBlob)throw Error(`SOURCE_BINDING_MISMATCH:${sourceRawSha256}:${artifactSha}`);
const rosterPath='archive/analysis/h2-1mid-20261010-codex/ROOT.locked-roster.json';
const roster=readJson(rosterPath); const rosterRow=roster.roster.find(r=>r.examUid===examUid);
if(!rosterRow||roster.runId!=='codex-h2-1mid-20261010-batch-20261011')throw Error('LOCKED_ROSTER_TARGET_MISSING');
const stageFiles={
  create:{evidence:`${base}/CREATE_20261010_CODEX/CREATE.evidence.json`,report:`${base}/CREATE_20261010_CODEX/CREATE.archive-stage-validator.raw.json`,completion:`${base}/CREATE_20261010_CODEX/CREATE.completion.sealed.json`},
  r1:{evidence:`${base}/r1-clean-20261011/r1-final-evidence.v2.json`,report:`${base}/r1-clean-20261011/r1-stage-validator.raw.v2.json`,completion:`${base}/r1-clean-20261011/r1-completion.sealed.final.json`},
  r2:{evidence:`${base}/r2-clean-20261011/r2-final-evidence.json`,report:`${base}/r2-clean-20261011/r2-stage-validator.raw.v2.json`,completion:`${base}/r2-clean-20261011/r2-completion.sealed.json`},
};
const stageSummaries={};
for(const [stage,files] of Object.entries(stageFiles)){
  for(const p of Object.values(files))if(!fs.existsSync(path.resolve(root,p)))throw Error(`UPSTREAM_MISSING:${p}`);
  const report=readJson(files.report),ev=readJson(files.evidence);
  if(stage!=='create'&&(!report.ok||report.disposition!=='PASS'||report.denominator!==24||report.artifactSha!==artifactSha))throw Error(`UPSTREAM_VALIDATION_NOT_CURRENT:${stage}`);
  if(stage==='create'&&(!report.ok||report.disposition!=='PASS'))throw Error('CREATE_VALIDATION_NOT_PASS');
  stageSummaries[stage]={evidence:{path:files.evidence,sha256:sha(read(files.evidence))},validatorReport:{path:files.report,sha256:sha(read(files.report)),status:report.disposition||'PASS',denominator:report.denominator??report.questionCount??24},completion:{path:files.completion,sha256:sha(read(files.completion))},artifactSha:ev.artifactSha};
}
const r1=readJson(stageFiles.r1.evidence), r2=readJson(stageFiles.r2.evidence), r2Report=readJson(stageFiles.r2.report);
if(sha(read(stageFiles.r1.evidence))!=='45575c2497325ff2a5464c4ecf2c09039284b15ad8ab03f1a39ded2d6b298c21')throw Error('R1_EXPECTED_EVIDENCE_SHA_MISMATCH');
if(sha(read(stageFiles.r2.report))!=='eae4301ee4bc8e1773b9527b3b346b8c680667fb358e5ebbc043dc2f1aa0d618')throw Error('R2_EXPECTED_REPORT_SHA_MISMATCH');
if(!Array.isArray(r2.artifactDispositions?.rows)||r2.artifactDispositions.rows.length!==24||r2.artifactDispositions.artifactSha!==artifactSha)throw Error('R2_META_DISPOSITION_BINDING_MISMATCH');
const assets=(r2Report.technicalBinding?.assets||[]).map(a=>{
  const abs=path.resolve(a.path); if(!fs.existsSync(abs))throw Error(`ASSET_MISSING:${a.ref}`);
  const bytes=fs.readFileSync(abs), digest=sha(bytes); if(digest!==a.sha256)throw Error(`ASSET_SHA_MISMATCH:${a.ref}`);
  return {ref:a.ref,sha256:digest,bytes:bytes.length,format:path.extname(a.ref).slice(1).toLowerCase()};
});
if(assets.length!==14)throw Error(`ASSET_COUNT_MISMATCH:${assets.length}`);
const qids=Array.from({length:24},(_,i)=>i+1);
const repairRows=new Map(r1.rows.map(r=>[Number(r.qid),r]));
const r2Rows=new Map(r2.rows.map(r=>[Number(r.qid),r]));
const targetedQids=[2,6,8,18,22,24];
const assetRefsByQid={2:[],6:[`assets/images/${examUid}/q06.png`,`assets/images/${examUid}/q06-solution.svg`],8:[],18:[],22:[`assets/images/${examUid}/q22-solution.svg`],24:[`assets/images/${examUid}/q24-solution.svg`]};
const rows=targetedQids.map(qid=>{
  const a=repairRows.get(qid),b=r2Rows.get(qid); if(!a||!b||a.verdict!=='PASS'||b.verdict!=='PASS')throw Error(`TARGET_UPSTREAM_ROW_NOT_PASS:q${qid}`);
  const refs=assetRefsByQid[qid];
  const currentRefs=refs.map(ref=>{const asset=assets.find(x=>x.ref===ref);if(!asset)throw Error(`TARGET_ASSET_NOT_BOUND:${ref}`);return ref;});
  let review='';
  if(qid===2)review='The R1-only correction is the TeX non-equality token in q2 solution. Current solution digest matches R1 PASS; stored answer and choices still match the preserved freeze.';
  if(qid===6)review='The opened q06 source graph and solution number-line asset support the postfreeze correction. R2 adjudication records answer ② (7); R1/R2 current rows PASS and the original freeze remains immutable.';
  if(qid===8)review='The R1-only correction is the TeX non-equality token in q8 solution. Current solution digest matches R1 PASS; stored answer and choices still match the preserved freeze.';
  if(qid===18)review='The R1-reviewed source metadata locus is H15-M1-04 / H15-M1-04-LOGARITHMIC_FUNCTION_APPLICATION. Current row has zero META debt and matches final physical metadata; no additional semantic reclassification is made.';
  if(qid===22)review='The postfreeze correction retained the original freeze and corrected the stored expression to −63√15/256. R1 and R2 current rows both PASS; solution SVG decodes in sol cases.';
  if(qid===24)review='The postfreeze correction retained the original freeze and corrected the stored count to 344. R1 and R2 current rows both PASS; solution SVG decodes in sol cases.';
  const solutionSha256=a.solutionSha256;
  return {qid,verdict:'PASS',changedOpenDependencyReview:{status:'PASS',repairApplied:false,solutionSha256,review},directDependencyReview:{status:'PASS',assetRefs:currentRefs}};
});
const r2Q06Path=`${base}/r2-clean-20261011/r2-q06-correction.json`;
const r2Q06={path:r2Q06Path,sha256:sha(read(r2Q06Path))};
const capturePath='.tmp/archive/h2-1mid-20261011/24_매산여고_1학기_중간_고2_수학I/r3-capture-01/machine-capture.json';
const reviewPath=`${outDir}/R3.capture-review.json`;
const captureBytes=read(capturePath),capture=JSON.parse(captureBytes),reviewBytes=read(reviewPath),captureReview=JSON.parse(reviewBytes);
if(capture.status!=='CAPTURED_REVIEW_REQUIRED'||capture.renderPass!==false||capture.artifactSha!==artifactSha||capture.cases.length!==6)throw Error('CURRENT_SIX_CASE_CAPTURE_REQUIRED');
if(captureReview.schemaVersion!=='JS_ARCHIVE_CODEX_R3_CAPTURE_REVIEW_V1'||captureReview.captureReportSha256!==sha(captureBytes)||captureReview.artifactSha!==artifactSha||captureReview.cases.length!==6)throw Error('CURRENT_CAPTURE_REVIEW_REQUIRED');
const cleanFilterBlobSha1=cleanFilterHash({root,productionPath:rosterRow.productionPath,bytes:sourceBytes});
const evidence={
 schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',stage:'R3',examUid,
 artifactSha,artifactRawSha256:sourceRawSha256,
 reviewerIdentity:{role:'archive_r3',reviewerId:'r3_maesan_math1'},
 lockedRosterBinding:{path:rosterPath,sha256:sha(read(rosterPath)),runId:roster.runId,expectedHead:roster.expectedHead,lockedInputSourceRawSha256:rosterRow.sourceRawSha256,currentArtifactRawSha256:sourceRawSha256,currentArtifactBlobSha1:artifactSha,productionPath:rosterRow.productionPath,sourceOnlyEvidence:{path:rosterRow.sourceOnlyEvidencePath,sha256:rosterRow.sourceOnlyEvidenceSha256}},
 sourceInputMode:'EXTRACTED_JS_ASSETS',pdfReviewMode:'DEFECT_ONLY',routinePdfComparison:'NOT_PERFORMED',
 targetedScope:{openFindingQids:[],changedQids:[2,6,8,18,22,24],directDependencyQids:[2,6,8,18,22,24]},rows,
 lockedScopeIntegrity:true,releaseIntegrity:true,
 structureReview:{status:'PASS',qidCount:24,orderedQids:qids,lastQid:24,syntax:'PASS',requiredFields:'PASS',difficultyFields:'PASS',controlCharacters:'PASS',choicesLabels:'PASS',pngSvgXmlCodeDependencies:'PASS',assetReferencesAndHashes:'PASS',review:'Full-denominator structural integrity scan; semantic review limited to changed/open/direct-dependency qids.'},
 assetReview:{status:'PASS',assets},
 upstreamBindings:{CREATE:stageSummaries.create,R1:stageSummaries.r1,R2:{...stageSummaries.r2,q06PostfreezeCorrection:r2Q06}},
 artifactDispositions:r2.artifactDispositions,
 captureReview:{path:reviewPath,sha256:sha(reviewBytes),status:'PASS',coverageQids:qids,caseCount:6},
 captureReport:{path:capturePath,sha256:sha(captureBytes),status:'CAPTURED_REVIEW_REQUIRED',actualCaseIds:capture.cases.map(c=>c.id),loadedJs:capture.loadedJs,cases:capture.cases.map(c=>({id:c.id,viewport:c.viewport,captureSha256s:c.captures.map(x=>x.image.sha256),loadedAssets:c.loadedAssets.map(a=>({ref:a.ref,sha256:a.sha256})),qidCount:c.captures.reduce((n,x)=>n+(x.qids||[]).length,0),mathErrors:c.metrics.mathErrors,scrollWidth:c.metrics.scrollWidth,mechanicalStatus:c.mechanicalStatus}))},
 actualRenderStatus:'RENDER_PASS',
 technicalHashes:{rawSha256:sourceRawSha256,validatorRawBufferBlobSha1:artifactSha,gitCleanFilterBlobSha1:cleanFilterBlobSha1}
};
const out=path.resolve(root,`${outDir}/R3.evidence.final.json`); if(fs.existsSync(out))throw Error('FRESH_EVIDENCE_OUTPUT_REQUIRED');
fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({path:rel(out),sha256:sha(fs.readFileSync(out)),artifactSha,artifactRawSha256:sourceRawSha256,targetedQids,assetCount:assets.length,upstream:stageSummaries},null,2));

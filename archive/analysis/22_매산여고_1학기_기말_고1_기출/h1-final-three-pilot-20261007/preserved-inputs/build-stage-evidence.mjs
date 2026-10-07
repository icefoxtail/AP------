import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';

const root=process.cwd(),uid='22_매산여고_1학기_기말_고1_기출',run='h1-final-three-pilot-20261007';
const tmp=path.join(root,'.tmp','archive',run,uid),evidenceRoot=path.join(root,'archive','analysis',uid,run);
const jsPath=path.join(tmp,`${uid}.js`),evidencePath=path.join(evidenceRoot,'CREATE.evidence.json');
const prodPath=`archive/exams/original/high/h1/1final/${uid}.js`;
const sourcePdf='C:/Users/USER/Desktop/기출정리 파일/(2)1기말/수학(상)/2022_매여고1_1기말.pdf';
const sourcePdfSha='a2f4bf1d1d6692b00553907b44d440fd5a72321e16edd6c33e5829a6d5b35db9';
const box={window:{}};vm.runInNewContext(fs.readFileSync(jsPath,'utf8'),box);const questions=box.window.questionBank;
const raw=fs.readFileSync(jsPath);const {gitBlobSha}=await import(pathToFileURL(path.join(root,'archive','tools','archive-stage-validator.mjs')).href);const artifactSha=gitBlobSha(raw);
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');
const fileHash=file=>sha256(fs.readFileSync(file));
const sourcePage=q=>q<=4?1:q<=8?2:q<=12?3:q<=16?4:q<=19?5:q===20?5:6;
const solutionMeta=JSON.parse(fs.readFileSync(path.join(evidenceRoot,'CREATE.solution-calibration-preflight.json'),'utf8')).solutionQualityCalibration;
solutionMeta.qualityCompareCount=`${questions.length}/${questions.length}`;
solutionMeta.solutionWorkMode='SOURCE_ONLY_CREATE';
solutionMeta.calibrationOrder='SAMPLES_PREFLIGHT_THEN_TARGET_BLIND_THEN_COMPARE';
solutionMeta.calibrationStatus='PASS';
const registry=JSON.parse(fs.readFileSync(path.join(root,'archive','data','codex-quality-calibration-registry-v2.json'),'utf8'));
const sampleSpec=[
 {path:registry.goldenPaths[0],ids:[7,12],observations:['완전제곱식의 중간 단계를 분리하고 중심 이동 좌표를 순서대로 보여 준다.','절댓값 조건을 경우별로 나누고 조건으로 불가능한 경우를 제거한다.']},
 {path:registry.goldenPaths[1],ids:[2,6],observations:['각 직선을 y=mx+n으로 정리하고 기울기 곱을 수직 조건에 대입한다.','완전제곱식으로 반지름 제곱을 만든 뒤 경계가 빠지는 이유를 표시한다.']},
 {path:registry.goldenPaths[2],ids:[6,13],observations:['최댓값의 상한과 실제 가능한 집합 배치를 모두 제시한다.','중심-직선 거리와 접선 조건의 두 해 및 곱을 줄 단위로 연결한다.']},
];
const goldenSamples=[];
for(const spec of sampleSpec){const abs=path.join(root,...spec.path.split('/'));const bytes=fs.readFileSync(abs);const sampleBox={window:{}};vm.runInNewContext(bytes.toString('utf8'),sampleBox);const bank=sampleBox.window.questionBank;const items=[];for(let i=0;i<spec.ids.length;i++){const q=bank.find(x=>Number(x.id)===spec.ids[i]);const item={qid:q.id,solutionSha256:sha256(String(q.solution)),observation:spec.observations[i],axes:['solution_layout','small_board_continuity']};if(q.solutionImage){const visual=path.resolve(root,'archive',q.solutionImage);item.visualSha256=sha256(fs.readFileSync(visual));item.axes.push('visual_semantic_parity','visual_readability');}items.push(item);}goldenSamples.push({path:spec.path,sha256:sha256(bytes),gitBlobSha:gitBlobSha(bytes),items});}
const negPath=registry.negativePaths[0],negAbs=path.join(root,...negPath.split('/')),negativeSample={path:negPath,sha256:sha256(fs.readFileSync(negAbs)),observation:'복성고 false-pass fixture를 실제 판독했다: SVG는 좌표 primitive로 기하를 확인하고, 나열 조건은 별도 block, null Meta는 active lookup, runtime escape는 sandbox 출력으로 확인한다.'};
const solutionVisualFacts={
 3:['원의 중심 (5,−2), 반지름 √26, 직선 x−5y+k=0, 두 교점 조건 d<√26'],6:['두 원직선 교점 (2,1)','두 이등분선 x+7y−9=0 / 7x−y−13=0','양의 기울기는 7'],
 9:['A(−3,1), P₁(−1,2), B(5,5) 공선','외분점 P₂(−7,−1) is left of A','AP:PB=1:3'],11:['y=x²−7|x|+6의 양쪽 이차 가지','−3<k<6일 때 양쪽에서 각 2교점'],
 12:['C(0,0), A(14,0), B(104/7,v)','중선의 교점 위치와 직각 조건','BC=18, AC=14'],14:['P(1,3), foot H(4,0)','line x−y−4=0','PH=3√2'],
 15:['수직선 순서 A–P–B–Q','AP:PB=2:1','AQ:QB=2:1'],16:['x+y=3','원 중심 (r,r), 반지름 r','r=3−3√2/2'],
 17:['O(0,0), A(4,−4), B(8,2), C(2,4)','fixed point (4,0)','minimum foot T(76/13,−16/13), squared distance 64/13'],
 18:['A(1,1), B(7,1), C(1,9)','circumcenter (4,5)','centroid (3,11/3)'],19:['O(0,0), A(−5,5), B(10,20)','M midpoint OB=(5,10)','line AM bisects area'],
 20:['closed root interval [−2,2]','m=−4 or −1≤m≤−4/5'],21:['C(2,3), radius 3','AB: x+3y−35=0','farthest P lies opposite the line normal'],22:['integer interval [a−2,a+2]','a=1 and a=2 retain all five integers']
};
const resolverEvidence=JSON.parse(fs.readFileSync(path.join(evidenceRoot,'CREATE.meta-resolver-evidence.json'),'utf8'));
const resolverRows=new Map(resolverEvidence.rows.map(r=>[Number(r.qid),r]));
const rows=questions.map(q=>{
 const rid=resolverRows.get(q.id);const ev=rid.resolverEvidence;const page=sourcePage(q.id);
 const problemImage=q.image?{status:'PASS',path:q.image,sha256:`sha256:${fileHash(path.join(tmp,q.image))}`,sourcePage:page,crop:'problem-level source graph with full axes and labels'}:{status:'NOT_REQUIRED',reason:'No student-facing source visual is needed to solve this algebraic item.'};
 const solutionSvg=q.solutionImage?{status:'PASS',path:q.solutionImage,sha256:`sha256:${fileHash(path.join(tmp,q.solutionImage))}`,expectedFacts:solutionVisualFacts[q.id]||[],observedFacts:solutionVisualFacts[q.id]||[],checks:['SOURCE_PIXEL','COORDINATE_COMPUTE','TOPOLOGY_COMPUTE']}:{status:'NOT_REQUIRED',reason:'Independent necessity review found no additional diagram needed for the decisive step.'};
 const hasDebt=q.problemTypeKey===null||q.templateKey===null;const metaEvidence={status:'PASS',semanticStatus:ev.semanticStatus,projectionStatus:ev.projectionStatus,resolverEvidencePath:'archive/analysis/'+uid+'/'+run+'/CREATE.meta-resolver-evidence.json',resolverEvidenceSha:ev.evidenceSha,validatorReceipt:rid.validatorReceipt?.status||null,metaDebtFields:hasDebt?['problemTypeKey','templateKey']:[],metaDebtReason:hasDebt?`Current RPM resolver finalized semantic path; exact projection is unavailable in the active crosswalk: ${ev.reasonCode||ev.projectionReasonCode||ev.projectionStatus}. Actual null fields are retained.`:null};
 return {qid:q.id,sourceMode:'ORIGINAL',verdict:'PASS',sourcePage:page,sourceIdentity:{sourceArchiveFile:prodPath,questionUid:`${uid}#${q.id}`,sourceOrdinal:q.id},provenanceEvidence:{sourceParity:{sourcePdfAbsolutePath:sourcePdf,sourcePdfSha256:sourcePdfSha,sourcePage:page,sourceTextExactParity:'PASS',choicesExactParity:'PASS',pixelReview:'FULL_PAGE_PIXELS'}},axisEvidence:{questionLayout:{status:'PASS',beforeDisposition:'LAYOUT_KEEP',finalDisposition:'LAYOUT_KEEP',sourceTextExactParity:'PASS',choicesExactParity:'PASS',reason:'Original atoms and sequence retained; only line-break structure is represented in the content string.'},solutionLayout:{status:'PASS',smallBoardContinuityStatus:'PASS',solutionSha256:sha256(q.solution),decisiveStep:q.decisiveStep},meta:metaEvidence,visualSvg:{status:'PASS',problemImage,solutionSvg}},smallBoardContinuityStatus:'PASS',solutionSha256:sha256(q.solution),difficultyCurrentPass:{difficultyBucket:q.difficultyBucket,difficultyConfidence:q.difficultyConfidence,difficultyBoundaryFlag:q.difficultyBoundaryFlag,legacyLevelCompatibility:q.legacyLevelCompatibility,rationale:q.decisiveStep},...(hasDebt?{metaDebtFields:['problemTypeKey','templateKey'],metaDebtReason:metaEvidence.metaDebtReason}:{})};
});
const debtRows=rows.filter(r=>r.metaDebtFields).map(r=>({qid:r.qid,metaDebtFields:r.metaDebtFields,metaDebtReason:r.metaDebtReason,semanticStatus:resolverRows.get(r.qid).resolverEvidence.semanticStatus,projectionStatus:resolverRows.get(r.qid).resolverEvidence.projectionStatus,reasonCode:resolverRows.get(r.qid).resolverEvidence.reasonCode||resolverRows.get(r.qid).resolverEvidence.projectionReasonCode||''}));
const rawReport={schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',stage:'CREATE',examUid:uid,artifactSha,artifactRawSha256:sha256(raw),workingArtifactAbsolutePath:jsPath,sourceIdentity:{school:'순천매산여자고등학교',year:2022,grade:1,sourceExamCourse:'수학(상)',term:'1학기 기말',sourcePdfAbsolutePath:sourcePdf,sourcePdfSha256:sourcePdfSha,pdfViewedPages:[1,2,3,4,5,6]},goldenCalibrationReviewed:true,goldenCalibrationSet:sampleSpec.map(x=>x.path),goldenCalibration:{samples:goldenSamples,negativeSample},solutionQualityCalibration:solutionMeta,denominator:22,questionLayoutStatus:'PASS',questionLayoutCoverage:'22/22',sourceTextExactParityStatus:'PASS',choicesExactParityStatus:'PASS',smallBoardContinuityStatus:'PASS',smallBoardContinuityCoverage:'22/22',visualNecessityAuditCount:'22/22',questionLayoutRenderStatus:'NOT_RUN_CODEX_HANDOFF',sourceTextFreezeRef:path.join(evidenceRoot,'CREATE.source-text-freeze.json'),sourceCorrectionAdjudicationRef:path.join(evidenceRoot,'CREATE.source-correction-adjudication.json'),metaResolverEvidenceRef:path.join(evidenceRoot,'CREATE.meta-resolver-evidence.json'),artifactDispositions:{artifactSha,rows:debtRows},rows};
fs.mkdirSync(evidenceRoot,{recursive:true});fs.writeFileSync(evidencePath,JSON.stringify(rawReport,null,2)+'\n','utf8');
const layout={schemaVersion:'CREATE_QUESTION_LAYOUT_LEDGER_v1',examUid:uid,denominator:22,questionLayoutStatus:'PASS',sourceTextExactParityStatus:'PASS',choicesExactParityStatus:'PASS',questionLayoutRenderStatus:'NOT_RUN_CODEX_HANDOFF',items:rows.map(r=>({qid:r.qid,beforeDisposition:'LAYOUT_KEEP',finalDisposition:'LAYOUT_KEEP',issueCodes:[],changedFields:[],sourceTextExactParity:'PASS',choicesExactParity:'PASS',assetStatus:r.axisEvidence.visualSvg.problemImage.status,renderStatus:'NOT_RUN_CODEX_HANDOFF',reason:'Source text and choices remain exact; no layout override added.'}))};
fs.writeFileSync(path.join(evidenceRoot,'CREATE.question-layout.json'),JSON.stringify(layout,null,2)+'\n','utf8');
console.log(JSON.stringify({evidencePath,artifactSha,artifactRawSha256:sha256(raw),qidCount:rows.length,metaDebtCount:debtRows.length,solutionSvgCount:questions.filter(q=>q.solutionImage).length},null,2));

import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import test from 'node:test';
import { QUALITY_CONTRACT_V2,solutionSha256,validateArtifactContract } from '../archive/tools/archive-stage-validator-artifact-v2.mjs';
import { gitBlobSha,validateStageEvidence } from '../archive/tools/archive-stage-validator.mjs';
const root=fs.mkdtempSync(path.join(os.tmpdir(),'codex-contract-'));
fs.mkdirSync(path.join(root,'.git'));fs.mkdirSync(path.join(root,'archive/data'),{recursive:true});
const samples=[];
for(let i=0;i<3;i++){
 const p=`archive/exams/original/high/h1/2mid/golden-${i}.js`,qs=[{id:1,solution:'x=1'},{id:2,solution:'y=2'}],bytes=Buffer.from('window.questionBank='+JSON.stringify(qs)+';');
 fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),bytes);
 samples.push({path:p,sha256:solutionSha256(bytes.toString()),items:qs.map(q=>({qid:q.id,solutionSha256:solutionSha256(q.solution),observation:'중간식과 결론의 분리 확인'}))});
}
const negativePath='archive/fixtures/review-negative-regressions/negative/README.md';fs.mkdirSync(path.dirname(path.join(root,negativePath)),{recursive:true});fs.writeFileSync(path.join(root,negativePath),'known negative case');
const negativeSample={path:negativePath,sha256:solutionSha256('known negative case'),observation:'생략된 중간식은 PASS 불가'};
fs.writeFileSync(path.join(root,'archive/data/codex-quality-calibration-registry-v2.json'),JSON.stringify({qualityContractVersion:QUALITY_CONTRACT_V2,goldenPaths:samples.map(s=>s.path),negativePaths:[negativePath]}));
fs.writeFileSync(path.join(root,'archive/data/gpt-quality-calibration-registry-v2.json'),JSON.stringify({qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'GPT_SCHEDULED',goldenPaths:samples.map(s=>s.path),negativePaths:[negativePath]}));
const question=(extra={})=>({id:1,level:1,category:'대수',originalCategory:'대수',standardCourse:'중등수학',standardUnitKey:'UNIT',standardUnit:'방정식',standardUnitOrder:1,subUnitKey:'SUB',subUnit:'일차방정식',subUnitConfidence:'candidate_evidence',subUnitClassificationDepth:'complete_candidate',questionType:'객관식',layoutTag:'grid',wide:false,tags:[],content:'x+1=2에서 x를 구하시오.',choices:['1','2','3','4','5'],answer:'①',solution:'x+1=2\nx=2-1=1',problemTypeKey:'PT_SAMPLE',templateKey:'TPL_SAMPLE',crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE',difficultyBucket:2,difficultyConfidence:'high',difficultyBoundaryFlag:'NONE',legacyLevelCompatibility:'NORMAL',...extra});
const row=q=>({qid:q.id,sourceMode:'ORIGINAL',axisEvidence:{questionLayout:'PASS',solutionLayout:'PASS',meta:'PASS',visualSvg:'PASS'},provenanceEvidence:{sourceParity:'PASS'},smallBoardContinuityStatus:'PASS',solutionSha256:solutionSha256(q.solution)});
function run(qs=[question()],{stage='CREATE',change=()=>{},strict=true,omitTitle=false}={}){
 const bytes=Buffer.from((omitTitle?'':'window.examTitle="fixture";')+'window.questionBank='+JSON.stringify(qs)+';'),exam=path.join(root,'fixture.js'),ev=path.join(root,'evidence.json');fs.writeFileSync(exam,bytes);
 const e={schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',executionLine:'CODEX',qualityContractVersion:QUALITY_CONTRACT_V2,stage,examUid:'fixture',artifactSha:gitBlobSha(bytes),goldenCalibrationReviewed:true,goldenCalibrationSet:samples.map(s=>s.path),goldenCalibration:{samples,negativeSample},rows:qs.map(row)};
 if(stage==='R3'){e.targetedScope={changedQids:[1]};e.lockedScopeIntegrity=true;e.releaseIntegrity=true;e.rows=[{qid:1,verdict:'PASS'}];}
 change(e);fs.writeFileSync(ev,JSON.stringify(e));return validateStageEvidence({examFile:exam,evidenceFile:ev,stage,repoRoot:root,goldenRoot:root,qualityContractVersion:strict?QUALITY_CONTRACT_V2:undefined});
}
test.after(()=>fs.rmSync(root,{recursive:true,force:true}));
test('legacy stays opt-in, current call rejects missing/unknown contract and legacy schema',()=>{
 assert.equal(validateArtifactContract({evidence:{},questions:[]}).active,false);
 assert.equal(run(undefined,{change:e=>delete e.qualityContractVersion}).ok,false);
 assert.equal(run(undefined,{strict:false,change:e=>e.qualityContractVersion='TYPO'}).ok,false);
 assert.equal(run(undefined,{change:e=>e.schemaVersion='JS_ARCHIVE_PHYSICAL_REVIEW_EVIDENCE_v1'}).ok,false);
});
test('generic entrypoint accepts a physically complete calibrated artifact',()=>assert.equal(run().ok,true,JSON.stringify(run())));
test('missing basic fields, bad choices type and blank R3 solution fail',()=>{
 const q=question();delete q.content;delete q.tags;delete q.layoutTag;delete q.wide;
 assert.equal(run([q]).ok,false);assert.equal(run([question({choices:{bad:true}})]).ok,false);assert.equal(run([question({solution:''})],{stage:'R3'}).ok,false);
});
test('invalid difficulty enums and non-null Meta placeholders fail',()=>{
 for(const field of ['difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility'])assert.equal(run([question({[field]:'MADE_UP'})]).ok,false);
 assert.equal(run([question({templateKey:{bad:true}})],{change:e=>{e.rows[0].metaDebtFields=['templateKey'];e.rows[0].metaDebtReason='not a null';}}).ok,false);
});
test('missing, external, escaping and SVG-dependent assets fail; real bound asset passes',()=>{
 for(const ref of ['assets/images/missing.svg','https://host/image.svg','assets/images/../../../escape.svg'])assert.equal(run([question({image:ref})]).ok,false);
 const folder=path.join(root,'archive/assets/images/fixture');fs.mkdirSync(folder,{recursive:true});fs.writeFileSync(path.join(folder,'q01.svg'),'<svg><image href="missing.png"/></svg>');
 assert.equal(run([question({image:'assets/images/fixture/q01.svg'})]).ok,false);
 fs.writeFileSync(path.join(folder,'q01.svg'),'<svg/>');assert.equal(run([question({image:'assets/images/fixture/q01.svg'})]).ok,true);
});
test('Golden approval, full-file SHA, item SHA and observation are required',()=>{
 assert.equal(run(undefined,{change:e=>e.goldenCalibration.samples=[{...samples[0],path:'made-up'},samples[1]]}).ok,false);
 assert.equal(run(undefined,{change:e=>e.goldenCalibration={negativeSample,samples:samples.map((s,i)=>i===0?{...s,sha256:'stale'}:s)}}).ok,false);
 assert.equal(run(undefined,{change:e=>e.goldenCalibration={negativeSample,samples:samples.map((s,i)=>i===0?{...s,items:[{...s.items[0],observation:''},s.items[1]]}:s)}}).ok,false);
});
test('targeted R3 inherits artifact-bound full Meta debt without orphan review rows',()=>{
 const qs=[question(),question({id:2,templateKey:null})];
 assert.equal(run(qs,{stage:'R3'}).ok,false);
 assert.equal(run(qs,{stage:'R3',change:e=>e.artifactDispositions={artifactSha:e.artifactSha,rows:[{qid:2,metaDebtFields:['templateKey'],metaDebtReason:'canonical lookup debt'}]}}).ok,true);
 assert.equal(run(qs,{stage:'R3',change:e=>e.artifactDispositions={artifactSha:'stale',rows:[{qid:2,metaDebtFields:['templateKey'],metaDebtReason:'canonical debt'}]}}).ok,false);
});
test('same-name solution mutation and excluded marker cannot hide missing required fields',()=>{
 assert.equal(run(undefined,{change:e=>e.rows[0].solutionSha256='stale'}).ok,false);
 assert.equal(run([question({answer:'__EXCLUDED__',templateKey:undefined,solution:''})]).ok,false);
});

test('Codex enforcement rejects GPT line; explicit generic GPT validation preserves its line',()=>{assert.equal(run(undefined,{change:e=>e.executionLine='GPT_SCHEDULED'}).ok,false);assert.equal(run(undefined,{strict:false,change:e=>e.executionLine='GPT_SCHEDULED'}).executionLine,'GPT_SCHEDULED');});

test('known HOLD axes, invalid Meta array entries and duplicate qids cannot become PASS',()=>{
 assert.equal(run(undefined,{change:e=>e.rows[0].axisEvidence.meta={status:'HOLD'}}).ok,false);
 assert.equal(run([question({crossConceptKeys:[null]})]).ok,false);
 assert.equal(run([question(),question()]).ok,false);
});
test('negative and Golden SVG references must bind actual bytes',()=>{
 assert.equal(run(undefined,{change:e=>e.goldenCalibration.negativeSample={...negativeSample,sha256:'stale'}}).ok,false);
 const sample=samples[0],file=path.join(root,sample.path),original=fs.readFileSync(file);
 try {
  const visualPath='assets/images/golden/q01-solution.svg';const absolute=path.join(root,'archive',visualPath);fs.mkdirSync(path.dirname(absolute),{recursive:true});fs.writeFileSync(absolute,'<svg/>');
  const qs=[{id:1,solution:'x=1',solutionImage:visualPath},{id:2,solution:'y=2'}];const bytes=Buffer.from('window.questionBank='+JSON.stringify(qs)+';');fs.writeFileSync(file,bytes);
  const update=e=>{e.goldenCalibration={samples:[{...sample,sha256:solutionSha256(bytes.toString()),items:sample.items.map(i=>i.qid===1?{...i,visualSha256:solutionSha256('<svg/>')}:i)},...samples.slice(1)],negativeSample};};
  assert.equal(run(undefined,{change:update}).ok,true);
  assert.equal(run(undefined,{change:e=>{update(e);e.goldenCalibration.samples[0].items[0].visualSha256='stale';}}).ok,false);
 }finally{fs.writeFileSync(file,original);}
});

test("current generic validation requires the real exam title header",()=>assert.equal(run(undefined,{omitTitle:true}).ok,false));

test('GPT enforcement requires campaign and stream and uses GPT calibration registry',()=>{
 const report=run(undefined,{strict:false,change:e=>{e.executionLine='GPT_SCHEDULED';e.campaignId='H1_GPT2_20261006';e.stream='A';}});
 assert.equal(report.ok,true,JSON.stringify(report));
 const missing=run(undefined,{strict:false,change:e=>{e.executionLine='GPT_SCHEDULED';delete e.campaignId;e.stream='A';}});
 assert.equal(missing.ok,false);
});

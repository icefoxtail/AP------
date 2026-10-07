import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';import assert from 'node:assert/strict';import test from 'node:test';
import {QUALITY_CONTRACT_V2} from '../archive/tools/archive-stage-validator-artifact-v2.mjs';
import {gitBlobSha} from '../archive/tools/archive-stage-validator.mjs';
import {validateCodexRenderReceipt,validateCodexMainDoneReceipt,validateCodexUserWaivedStaticReceipt,validateCodexUserWaivedMainDoneReceipt,CODEX_USER_RENDER_WAIVER_DIRECTIVE} from '../archive/tools/archive-codex-closeout-v2.mjs';
import {buildContinuation,consumeValidationPass,consumeCodexRenderPass,consumeCodexMainDone,consumeCodexUserWaivedMainDone} from '../archive/tools/archive-stage-runtime-v2.mjs';
function fixture({question='{id:1,image:"assets/images/test/q01.svg"}',files={'q01.svg':Buffer.from('<svg/>')},loadedModes={exam:['q01.svg'],sol:[],ans:[]}}={}){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'codex-closeout-')),hash=b=>createHash('sha256').update(b).digest('hex');
 const write=(p,b)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),b);return {path:p,sha256:hash(Buffer.from(b))};};
 const js=Buffer.from(`window.questionBank=[${question}];`),artifactSha=gitBlobSha(js),loadedJs=write('archive/exams/original/middle/m2/2final/test.js',js);
 const assets=Object.entries(files).map(([name,bytes])=>({ref:`assets/images/test/${name}`,sha256:hash(bytes)}));
 const assetFiles=new Map(assets.map(asset=>[asset.ref,write(`archive/${asset.ref}`,files[asset.ref.slice('assets/images/test/'.length)])]));
 const r3={ok:true,validatorMode:'R3_V2',stage:'R3',examUid:'test',artifactSha,executionLine:'CODEX',qualityContractVersion:QUALITY_CONTRACT_V2,artifactContract:{active:true},disposition:'PASS',evidenceRef:'r3-evidence.json'};
 const r3Validation=write('r3-report.json',JSON.stringify(r3));
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j5u0AAAAASUVORK5CYII=','base64');
 const receipt={executionLine:'CODEX',qualityContractVersion:QUALITY_CONTRACT_V2,status:'RENDER_PASS',artifactSha,loadedJs,r3Validation,cases:['exam','sol','ans'].flatMap(mode=>['desktop','mobile'].map(device=>({id:mode+'/'+device,status:'PASS',viewport:{width:device==='mobile'?390:1280,height:900},captures:[{image:write(`captures/${mode}-${device}.png`,png),qids:[1]}],loadedAssets:(loadedModes[mode]||[]).map(name=>{const ref=`assets/images/test/${name}`,asset=assets.find(a=>a.ref===ref);return {...asset,file:assetFiles.get(ref)}}),mathJaxStatus:'PASS',layoutReviewStatus:'PASS',assetDecodeStatus:'PASS'})))};
 return {root,receipt,artifactSha,assets,qids:[1],r3,write,cleanup:()=>fs.rmSync(root,{recursive:true,force:true})};
}
function userWaiverFixture({candidateQuestionCount}={}){
 const f=fixture(),git=(...args)=>execFileSync('git',['-C',f.root,...args],{stdio:'pipe'}),runId='archive2-m2-codex-20261006-03';
 git('init','-q');git('config','user.name','test');git('config','user.email','test@example.invalid');git('config','core.autocrlf','false');
 const rosterPath='archive/analysis/archive2-m2-codex-20261006-03/roster.json',rosterBytes=fs.readFileSync(path.resolve(process.cwd(),rosterPath)),rosterSource=JSON.parse(rosterBytes),rosterRow=rosterSource.rows[0],examUid=rosterRow.examUid,productionPath=rosterRow.productionPath;
 const questionCount=candidateQuestionCount??rosterRow.questionCount,qids=Array.from({length:questionCount},(_,i)=>i+1),questions=qids.map(id=>id===1?{id,image:'assets/images/test/q01.svg'}:{id});
 const candidateBytes=Buffer.from(`window.questionBank=${JSON.stringify(questions)};`),artifactSha=gitBlobSha(candidateBytes),artifactRawSha256=createHash('sha256').update(candidateBytes).digest('hex');
 const loadedJs=f.write(productionPath,candidateBytes);f.receipt.loadedJs=loadedJs;f.receipt.artifactSha=artifactSha;f.artifactSha=artifactSha;f.qids=qids;
 const lockedRosterBase=f.write(rosterPath,rosterBytes);
 const lockedRoster={...lockedRosterBase,originalPath:'.tmp/archive/archive2-m2-codex-20261006-03/roster.json'};
 const directiveText=CODEX_USER_RENDER_WAIVER_DIRECTIVE,directiveFile=f.write('archive/analysis/archive2-m2-codex-20261006-03/CODEX_M2_USER_RENDER_WAIVER_DIRECTIVE_20261007.txt',Buffer.from(directiveText,'utf8'));
 const directiveReceipt=f.write('archive/analysis/archive2-m2-codex-20261006-03/CODEX_M2_USER_RENDER_WAIVER_DIRECTIVE_RECEIPT_20261007.json',JSON.stringify({schemaVersion:'JS_ARCHIVE_CODEX_USER_RENDER_WAIVER_DIRECTIVE_RECEIPT_V1',executionLine:'CODEX',qualityContractVersion:QUALITY_CONTRACT_V2,status:'USER_DIRECTED_WAIVER_RECORDED',runId,course:'m2',rosterLocked:true,scope:'actualRenderCaptureOnly',directiveText,directiveFile,lockedRoster}));
 const report=stage=>({ok:true,stage,validatorMode:`${stage}_V2`,examUid,artifactSha:f.artifactSha,qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'CODEX',disposition:'PASS',issues:[],denominator:qids.length,rowCount:qids.length,common:{commonValid:true,stage,examUid,artifactSha:f.artifactSha,observedQids:qids,expectedQids:qids,issues:[]},artifactContract:{active:true,qualityContractVersion:QUALITY_CONTRACT_V2,stage,questionCount:qids.length,disposition:'PASS',issues:[]}});
 const r1Validation=f.write('archive/analysis/test/R1.validation.json',JSON.stringify(report('R1'))),r2Validation=f.write('archive/analysis/test/R2.validation.json',JSON.stringify(report('R2')));
 const assets=f.assets.map(asset=>({...asset,file:{path:`archive/${asset.ref}`,sha256:asset.sha256}}));
 const staticClosure=f.write('archive/analysis/test/R3.static-closure.json',JSON.stringify({executionLine:'CODEX',qualityContractVersion:QUALITY_CONTRACT_V2,examUid,artifactSha:f.artifactSha,artifactRawSha256, status:'STATIC_CODE_COMPLETE',completionBasis:'USER_DIRECTED_STATIC_COMPLETE',renderStatus:'NOT_RUN_USER_WAIVER',reviewerIdentity:{role:'archive_r3',reviewerId:'r3_static_test'},qids,structureIntegrityStatus:'PASS',jsIntegrityStatus:'PASS',assetIntegrityStatus:'PASS',changedOpenDependencyReviewStatus:'PASS',itemHoldCount:0,itemHoldQids:[],assets:f.assets,upstreamBindings:{R1:{validatorReport:r1Validation},R2:{validatorReport:r2Validation}}}));
 git('add','-A');git('commit','-qm','waiver closure fixture');const main=git('rev-parse','HEAD').toString().trim();git('update-ref','refs/remotes/origin/main',main);
 const receipt={schemaVersion:'JS_ARCHIVE_CODEX_USER_WAIVED_MAIN_DONE_RECEIPT_V1',status:'MAIN_DONE',executionLine:'CODEX',qualityContractVersion:QUALITY_CONTRACT_V2,completionBasis:'USER_DIRECTED_STATIC_COMPLETE',renderStatus:'NOT_RUN_USER_WAIVER',waiverScope:{runId,course:'m2',rosterLocked:true,scope:'actualRenderCaptureOnly'},examUid,artifactSha:f.artifactSha,artifactRawSha256,productionPath,remoteMainSha:main,loadedJs,lockedRoster,userDirectiveReceipt:directiveReceipt,r1Validation,r2Validation,r3StaticClosure:staticClosure,qids,assets};
 return {...f,receipt,cleanup:f.cleanup};
}
test('current R3 closes to RENDER, legacy R3 still closes to MAIN',()=>{
 const f=fixture();try{assert.equal(consumeValidationPass({state:{stage:'R3',workComplete:true},validationReport:f.r3}).state.stage,'RENDER');const old={...f.r3};delete old.qualityContractVersion;assert.equal(consumeValidationPass({state:{stage:'R3',workComplete:true},validationReport:old}).state.stage,'MAIN');}finally{f.cleanup();}
});
test('six bound capture cases and assets enable publication, not MAIN_DONE',()=>{
 const f=fixture();try{assert.equal(validateCodexRenderReceipt(f).ok,true);assert.equal(consumeCodexRenderPass({state:{stage:'RENDER'},...f}).state.stage,'PUBLICATION');}finally{f.cleanup();}
});
test('stale JS, omitted mobile case, omitted last qid and wrong loaded asset fail',()=>{
 for(const mutate of [f=>f.receipt.loadedJs.sha256='stale',f=>f.receipt.cases.pop(),f=>f.receipt.cases[0].captures[0].qids=[],f=>f.receipt.cases[0].loadedAssets[0].sha256='wrong']){const f=fixture();try{mutate(f);assert.equal(validateCodexRenderReceipt(f).ok,false);}finally{f.cleanup();}}
});
test('question-image assets are required in exam cases and absent from modes that do not render them',()=>{
 const f=fixture();try{
  assert.equal(validateCodexRenderReceipt(f).ok,true);
  f.receipt.cases.find(c=>c.id==='sol/desktop').loadedAssets=[{...f.assets[0],file:f.receipt.cases[0].loadedAssets[0].file}];
  assert.equal(validateCodexRenderReceipt(f).ok,false);
 }finally{f.cleanup();}
});
test('solution-only SVG dependencies bind through solution cases, not exam witnesses',()=>{
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j5u0AAAAASUVORK5CYII=','base64');
 const f=fixture({question:'{id:1,solutionImage:"assets/images/test/sol.svg"}',files:{'sol.svg':Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><image href="dep.png"/></svg>'),'dep.png':png},loadedModes:{exam:[],sol:['sol.svg','dep.png'],ans:[]}});
 try{
  assert.equal(validateCodexRenderReceipt(f).ok,true);
  f.receipt.cases.find(c=>c.id==='sol/mobile').loadedAssets=f.receipt.cases.find(c=>c.id==='sol/mobile').loadedAssets.filter(a=>a.ref.endsWith('sol.svg'));
  assert.equal(validateCodexRenderReceipt(f).ok,false);
 }finally{f.cleanup();}
});
test('HTML image choices are exam assets and missing choice decode fails',()=>{
 const f=fixture({question:'{id:1,choices:["<img src=\\\"assets/images/test/choice.png\\\">"]}',files:{'choice.png':Buffer.from('choice-bytes')},loadedModes:{exam:['choice.png'],sol:[],ans:[]}});
 try{
  assert.equal(validateCodexRenderReceipt(f).ok,true);
  f.receipt.cases.find(c=>c.id==='exam/mobile').loadedAssets=[];
  assert.equal(validateCodexRenderReceipt(f).ok,false);
 }finally{f.cleanup();}
});
test('MAIN_DONE requires render receipt, origin/main production blob, asset bytes and HEAD parity',()=>{
 const f=fixture();try{
  const git=(...args)=>execFileSync('git',['-C',f.root,...args],{stdio:'pipe'});git('init','-q');git('config','user.name','test');git('config','user.email','test@example.invalid');git('config','core.autocrlf','false');git('add','--',f.receipt.loadedJs.path,'archive/assets/images/test/q01.svg');git('commit','-qm','fixture');const main=git('rev-parse','HEAD').toString().trim();git('update-ref','refs/remotes/origin/main',main);
  const renderRef=f.write('render.json',JSON.stringify(f.receipt));const receipt={status:'MAIN_DONE',executionLine:'CODEX',qualityContractVersion:QUALITY_CONTRACT_V2,artifactSha:f.artifactSha,productionPath:f.receipt.loadedJs.path,remoteMainSha:main,renderReceipt:renderRef};
  const input={receipt,root:f.root,renderReceipt:f.receipt,assets:f.assets,qids:f.qids};assert.equal(validateCodexMainDoneReceipt(input).ok,true,JSON.stringify(validateCodexMainDoneReceipt(input)));assert.equal(consumeCodexMainDone({state:{stage:'PUBLICATION'},...input}).state.stage,'MAIN_DONE');
  assert.equal(validateCodexMainDoneReceipt({...input,receipt:{...receipt,remoteMainSha:'stale'}}).ok,false);
  assert.equal(validateCodexMainDoneReceipt({...input,receipt:{...receipt,productionPath:'archive/_generated/fake.js'}}).ok,false);
 }finally{f.cleanup();}
});
test('user waiver has a separate static MAIN_DONE route and preserves render-required normal path',()=>{
 const f=userWaiverFixture();try{
  const prepublication={...f.receipt,schemaVersion:'JS_ARCHIVE_CODEX_USER_WAIVED_STATIC_RECEIPT_V1',status:'STATIC_CODE_COMPLETE',remoteMainSha:'not-yet-published'};
  const staticChecked=validateCodexUserWaivedStaticReceipt({receipt:prepublication,root:f.root});assert.equal(staticChecked.ok,true,JSON.stringify(staticChecked));
  const checked=validateCodexUserWaivedMainDoneReceipt({receipt:f.receipt,root:f.root});assert.equal(checked.ok,true,JSON.stringify(checked));assert.equal(checked.completionBasis,'USER_DIRECTED_STATIC_COMPLETE');assert.equal(checked.renderStatus,'NOT_RUN_USER_WAIVER');
  const consumed=consumeCodexUserWaivedMainDone({state:{stage:'RENDER',qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'CODEX'},receipt:f.receipt,root:f.root});assert.equal(consumed.state.stage,'MAIN_DONE');assert.equal(consumed.closure.renderStatus,'NOT_RUN_USER_WAIVER');
  assert.equal(validateCodexMainDoneReceipt({receipt:f.receipt,root:f.root,renderReceipt:{},assets:f.receipt.assets,qids:f.receipt.qids}).ok,false);
 }finally{f.cleanup();}
});
test('user waiver rejects missing directive, non-PASS stages, incomplete static qids/assets and render claims',()=>{
 const mutations=[
  f=>f.receipt.userDirectiveReceipt.sha256='stale',
  f=>f.receipt.r1Validation.sha256='stale',
  f=>f.receipt.r2Validation.sha256='stale',
  f=>f.receipt.r3StaticClosure.sha256='stale',
  f=>f.receipt.assets=[],
  f=>f.receipt.lockedRoster.sha256='stale',
  f=>f.receipt.renderStatus='RENDER_PASS',
  f=>f.receipt.renderReceipt={status:'RENDER_PASS'},
  f=>f.receipt.remoteMainSha='stale',
 ];
 for(const mutate of mutations){const f=userWaiverFixture();try{mutate(f);assert.equal(validateCodexUserWaivedMainDoneReceipt({receipt:f.receipt,root:f.root}).ok,false);}finally{f.cleanup();}}
});
test('user waiver static closure rejects item HOLD and non-PASS full-qid bindings',()=>{
 for(const mode of ['item-hold','changed-r1-qids']){const f=userWaiverFixture();try{
  const ref=f.receipt.r3StaticClosure,body=JSON.parse(fs.readFileSync(path.join(f.root,ref.path),'utf8'));
  if(mode==='item-hold'){body.itemHoldCount=1;body.itemHoldQids=[1];}
  else body.upstreamBindings.R1.validatorReport.sha256='stale';
  const next=f.write('archive/analysis/test/R3.static-closure.mutated.json',JSON.stringify(body));f.receipt.r3StaticClosure=next;
  assert.equal(validateCodexUserWaivedStaticReceipt({receipt:f.receipt,root:f.root}).ok,false);
 }finally{f.cleanup();}}
});
test('user waiver rejects self-consistent truncated source and report denominator against the locked roster',()=>{
 const f=userWaiverFixture({candidateQuestionCount:24});try{assert.equal(validateCodexUserWaivedStaticReceipt({receipt:f.receipt,root:f.root}).ok,false);}finally{f.cleanup();}
});

test('caller cannot omit a real JS asset or change the expected question set',()=>{const f=fixture();try{assert.equal(validateCodexRenderReceipt({...f,assets:[]}).ok,false);assert.equal(validateCodexRenderReceipt({...f,qids:[2]}).ok,false);}finally{f.cleanup();}});

test('GPT scheduled R3 does not acquire a Codex render prerequisite',()=>{const f=fixture();try{const identity={qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'GPT_SCHEDULED',campaignId:'H1_GPT2_20261006',stream:'A'};assert.equal(consumeValidationPass({state:{stage:'R3',workComplete:true,...identity},validationReport:{...f.r3,...identity}}).state.stage,'MAIN');}finally{f.cleanup();}});

test('declared current Codex state rejects downgrade and carries its contract onward',()=>{
 const f=fixture();try{
  const state={stage:'R3',workComplete:true,qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'CODEX'};
  const legacy={...f.r3};delete legacy.qualityContractVersion;delete legacy.executionLine;
  assert.throws(()=>consumeValidationPass({state,validationReport:legacy}),/DOWNGRADE/);
  assert.throws(()=>consumeValidationPass({state,validationReport:{...f.r3,executionLine:'GPT_SCHEDULED'}}),/LINE_MISMATCH/);
  assert.equal(consumeValidationPass({state,validationReport:f.r3}).state.qualityContractVersion,QUALITY_CONTRACT_V2);
 }finally{f.cleanup();}
});

test('durable technical continuation retains its current execution contract',()=>{
 const item=buildContinuation({stage:'RENDER',examUid:'test',inputArtifactSha:'input',finalArtifactSha:'final',evidenceRef:'evidence.json',completedStep:'R3',firstMissingClosureStep:'RENDER',exactReason:'capture needed',qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'CODEX'});
 assert.equal(item.qualityContractVersion,QUALITY_CONTRACT_V2);assert.equal(item.executionLine,'CODEX');
});

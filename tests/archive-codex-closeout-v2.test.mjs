import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';import assert from 'node:assert/strict';import test from 'node:test';
import {QUALITY_CONTRACT_V2} from '../archive/tools/archive-stage-validator-artifact-v2.mjs';
import {gitBlobSha} from '../archive/tools/archive-stage-validator.mjs';
import {validateCodexRenderReceipt,validateCodexMainDoneReceipt} from '../archive/tools/archive-codex-closeout-v2.mjs';
import {buildContinuation,consumeValidationPass,consumeCodexRenderPass,consumeCodexMainDone} from '../archive/tools/archive-stage-runtime-v2.mjs';
function fixture(){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'codex-closeout-')),hash=b=>createHash('sha256').update(b).digest('hex');
 const write=(p,b)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),b);return {path:p,sha256:hash(Buffer.from(b))};};
 const js=Buffer.from('window.questionBank=[{id:1,image:"assets/images/test/q01.svg"}];'),artifactSha=gitBlobSha(js),loadedJs=write('archive/exams/original/middle/m2/2final/test.js',js);
 const ab=Buffer.from('<svg/>'),assetFile=write('archive/assets/images/test/q01.svg',ab),assets=[{ref:'assets/images/test/q01.svg',sha256:hash(ab)}];
 const r3={ok:true,validatorMode:'R3_V2',stage:'R3',examUid:'test',artifactSha,executionLine:'CODEX',qualityContractVersion:QUALITY_CONTRACT_V2,artifactContract:{active:true},disposition:'PASS',evidenceRef:'r3-evidence.json'};
 const r3Validation=write('r3-report.json',JSON.stringify(r3));
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j5u0AAAAASUVORK5CYII=','base64');
 const receipt={executionLine:'CODEX',qualityContractVersion:QUALITY_CONTRACT_V2,status:'RENDER_PASS',artifactSha,loadedJs,r3Validation,cases:['exam','sol','ans'].flatMap(mode=>['desktop','mobile'].map(device=>({id:mode+'/'+device,status:'PASS',viewport:{width:device==='mobile'?390:1280,height:900},captures:[{image:write(`captures/${mode}-${device}.png`,png),qids:[1]}],loadedAssets:[{...assets[0],file:assetFile}],mathJaxStatus:'PASS',layoutReviewStatus:'PASS',assetDecodeStatus:'PASS'})))};
 return {root,receipt,artifactSha,assets,qids:[1],r3,write,cleanup:()=>fs.rmSync(root,{recursive:true,force:true})};
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
test('MAIN_DONE requires render receipt, origin/main production blob, asset bytes and HEAD parity',()=>{
 const f=fixture();try{
  const git=(...args)=>execFileSync('git',['-C',f.root,...args],{stdio:'pipe'});git('init','-q');git('config','user.name','test');git('config','user.email','test@example.invalid');git('config','core.autocrlf','false');git('add','--',f.receipt.loadedJs.path,'archive/assets/images/test/q01.svg');git('commit','-qm','fixture');const main=git('rev-parse','HEAD').toString().trim();git('update-ref','refs/remotes/origin/main',main);
  const renderRef=f.write('render.json',JSON.stringify(f.receipt));const receipt={status:'MAIN_DONE',executionLine:'CODEX',qualityContractVersion:QUALITY_CONTRACT_V2,artifactSha:f.artifactSha,productionPath:f.receipt.loadedJs.path,remoteMainSha:main,renderReceipt:renderRef};
  const input={receipt,root:f.root,renderReceipt:f.receipt,assets:f.assets,qids:f.qids};assert.equal(validateCodexMainDoneReceipt(input).ok,true,JSON.stringify(validateCodexMainDoneReceipt(input)));assert.equal(consumeCodexMainDone({state:{stage:'PUBLICATION'},...input}).state.stage,'MAIN_DONE');
  assert.equal(validateCodexMainDoneReceipt({...input,receipt:{...receipt,remoteMainSha:'stale'}}).ok,false);
  assert.equal(validateCodexMainDoneReceipt({...input,receipt:{...receipt,productionPath:'archive/_generated/fake.js'}}).ok,false);
 }finally{f.cleanup();}
});

test('caller cannot omit a real JS asset or change the expected question set',()=>{const f=fixture();try{assert.equal(validateCodexRenderReceipt({...f,assets:[]}).ok,false);assert.equal(validateCodexRenderReceipt({...f,qids:[2]}).ok,false);}finally{f.cleanup();}});

test('GPT scheduled R3 does not acquire a Codex render prerequisite',()=>{const f=fixture();try{assert.equal(consumeValidationPass({state:{stage:'R3',workComplete:true},validationReport:{...f.r3,executionLine:'GPT_SCHEDULED'}}).state.stage,'MAIN');}finally{f.cleanup();}});

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

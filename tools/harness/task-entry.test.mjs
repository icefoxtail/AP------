import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {evaluate,main} from './task-entry.mjs';
const manifest={schemaVersion:1,routes:[
 {task:'read-only',authority:'docs/authority.md',target:'optional-local-file',requiredCapabilities:['gitRead'],optionalCapabilities:[]},
 {task:'publish',authority:'docs/authority.md',target:'local-file',requiredCapabilities:['gitRead','gitWrite'],optionalCapabilities:['browser']},
 {task:'stage',authority:'docs/authority.md',target:'stage-owned',requiredCapabilities:['gitRead','libraryRead'],optionalCapabilities:[]}
]};
function fixture(fn){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'ap-harness-'));
 try{
  fs.mkdirSync(path.join(root,'docs'));
  fs.writeFileSync(path.join(root,'docs/authority.md'),'# authority');
  fs.writeFileSync(path.join(root,'target.js'),'export default 1;');
  for(const args of [['init','-q'],['config','user.email','test@example.invalid'],['config','user.name','test'],['add','docs/authority.md'],['commit','-qm','fixture']]){
    const r=spawnSync('git',args,{cwd:root}); assert.equal(r.status,0,String(r.stderr));
  }
  return fn(root);
 }finally{fs.rmSync(root,{force:true,recursive:true});}
}
const run=(root,task='publish',caps={},target='target.js',m=manifest)=>evaluate({root,manifest:m,task,target,caps});
test('local entry readiness requires real Git, not release approval',()=>fixture(root=>{
 const r=run(root,'read-only',{},null);
 assert.equal(r.decision,'ENTRY_READY');
 assert.equal(r.git.checked,true);
 assert.equal(r.scope,'ENTRY_ONLY_NOT_QUALITY_OR_RELEASE');
}));
test('unknown route cannot be inferred',()=>fixture(root=>{
 assert.equal(run(root,'unknown').nextRecommendedAction.code,'TASK_NOT_ROUTED');
}));
test('missing capability blocks',()=>fixture(root=>{
 assert.equal(run(root,'publish',{gitWrite:'UNAVAILABLE'}).nextRecommendedAction.code,'CAPABILITY_UNAVAILABLE');
}));
test('unknown capability needs probe',()=>fixture(root=>{
 assert.equal(run(root).nextRecommendedAction.code,'CAPABILITY_UNKNOWN');
}));
test('caller-reported AVAILABLE is not attestation',()=>fixture(root=>{
 const r=run(root,'publish',{gitWrite:'AVAILABLE'});
 assert.equal(r.decision,'PROBE_REQUIRED');
 assert.equal(r.nextRecommendedAction.code,'CAPABILITY_REQUIRES_PROVIDER_PROBE');
 assert.equal(r.requiredCapabilities.gitWrite.provenance,'caller-report-unverified');
}));
test('exact missing target cannot be guessed from filename search',()=>fixture(root=>{
 assert.equal(run(root,'publish',{},'missing.js').nextRecommendedAction.code,'TARGET_NOT_FOUND');
}));
test('missing mandatory local target blocks',()=>fixture(root=>{
 assert.equal(run(root,'publish',{},null).nextRecommendedAction.code,'TARGET_UNSPECIFIED');
}));
test('outside path rejected',()=>fixture(root=>{
 assert.throws(()=>run(root,'publish',{},'../bad.js'),/TARGET_PATH_INVALID/);
}));
test('stage-owned path cannot be supplied as local target',()=>fixture(root=>{
 assert.equal(run(root,'stage',{libraryRead:'AVAILABLE'}).nextRecommendedAction.code,'TARGET_TYPE_MISMATCH');
 assert.equal(evaluate({root,manifest,task:'stage',caps:{libraryRead:'AVAILABLE'}}).decision,'PROBE_REQUIRED');
}));
test('missing authority is a blocker',()=>fixture(root=>{
 fs.rmSync(path.join(root,'docs/authority.md'));
 assert.equal(run(root).nextRecommendedAction.code,'AUTHORITY_NOT_FOUND');
}));
test('malformed route must fail',()=>fixture(root=>{
 const invalid={schemaVersion:1,routes:[{...manifest.routes[0],requiredCapabilities:['gitRead','gitRead']}]};
 assert.throws(()=>run(root,'read-only',{},null,invalid),/ROUTES_INVALID/);
}));
test('invalid caller states and gitRead claims rejected',()=>{
 assert.equal(main(['--task','publish','--caps','gitWrite=PASS']),1);
 assert.equal(main(['--task','publish','--caps','gitRead=AVAILABLE']),1);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {canonicalJson,objectSha,bytesSha,fileRef,readBoundFile} from '../../pipeline-core/canonical.mjs';
import {freezeWire,validateScalar,assetIdentity,stageKey,capabilityFingerprint,bindLegacy} from '../production/contracts.mjs';
import {commitStage,loadStage,calculationStage,generatedPath,withWorkRoot,currentWorkRoot,validateWorkRoot,bindRunWorkspace} from '../production/store.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {RepairBudget} from '../production/repair-budget.mjs';
const root=fs.mkdtempSync(path.join(os.tmpdir(),'apmath-wire-'));
const workRoot=`.tmp/archive/test-${process.pid}/geometry/visual-engine/production`;
test.after(()=>fs.rmSync(root,{recursive:true,force:true}));
test('Node authority normalizes 1/1.0, -0, NFC; Python binds identical raw blob',async()=>{
  const value={x:1.0,z:-0,s:'e\u0301',exact:{kind:'rational',numerator:'9007199254740993',denominator:'7'}};
  validateScalar(value.exact);
  assert.equal(canonicalJson(value),'{"exact":{"denominator":"7","kind":"rational","numerator":"9007199254740993"},"s":"é","x":1,"z":0}');
  const response=await pythonWorker({action:'echo',value});
  assert.deepEqual(response.result,JSON.parse(canonicalJson(value)));
  assert.equal(response.inputObjectSha256,freezeWire({action:'echo',value}).objectSha256);
});
test('unsafe numbers and executable/untyped exact scalars rejected',()=>{
  for(const n of [NaN,Infinity,9007199254740992])assert.throws(()=>freezeWire({n}));
  for(const v of [{kind:'rational',numerator:'1',denominator:'0'},{kind:'integer',value:'01'},{kind:'expression',op:'eval',args:[]}])assert.throws(()=>validateScalar(v));
  validateScalar({kind:'expression',op:'sqrt',args:[{kind:'integer',value:'2'}]});
  assert.throws(()=>freezeWire({'e\u0301':1}),/WIRE_KEY_MUST_BE_NFC/);
});
test('raw SHA, object SHA, legacy SHA retain distinct meanings',()=>{
  const relative='source.json';fs.writeFileSync(path.join(root,relative),'{"x":1.0,"s":"e\\u0301"}\n');
  const ref=fileRef(root,relative),raw=readBoundFile(root,ref);
  assert.notEqual(ref.sha256,objectSha(JSON.parse(raw)));
  const legacyHex=bytesSha(raw).slice(7);
  assert.deepEqual(bindLegacy(root,ref,{algorithm:'GE_PYTHON_CANONICAL_v1',expectedHex:legacyHex,compute:raw=>bytesSha(raw).slice(7)}).boundFile,ref);
  assert.throws(()=>readBoundFile(root,{...ref,bytes:ref.bytes+1}));
});
test('canonical UID maps stable role to asset independent of revision',()=>{
  const a=assetIdentity('exam-stable|12','SOLUTION_VISUAL','foot');
  assert.deepEqual(a,assetIdentity('exam-stable|12','SOLUTION_VISUAL','foot'));
  assert.notEqual(a.assetId,assetIdentity('exam-stable|12','SOLUTION_VISUAL','midpoint').assetId);
  assert.throws(()=>assetIdentity('../x','SOLUTION_VISUAL'));
});
test('immutable commit, corruption, partial staging, concurrent writer fail closed',()=>withWorkRoot(workRoot,()=>{
  const key=objectSha({x:1});
  assert.throws(()=>commitStage(root,{stage:'MATH',key,outputs:{'model.json':'{}'},provenance:{},crashAt:'manifest'}),/INJECTED/);
  assert.equal(loadStage(root,'MATH',key),null);
  const receipt=commitStage(root,{stage:'MATH',key,outputs:{'model.json':'{}'},provenance:{}});
  assert.ok(receipt.manifestRef);
  assert.throws(()=>commitStage(root,{stage:'MATH',key,outputs:{'model.json':'{}'},provenance:{}}),/IMMUTABLE/);
  fs.writeFileSync(path.join(root,receipt.outputs[0].path),'corrupt');
  assert.throws(()=>loadStage(root,'MATH',key),/STALE_FILE/);
  const key2=objectSha({x:2}),lock=generatedPath(root,`${workRoot}/stages/MATH/${key2.slice(7)}.lock`);
  fs.writeFileSync(lock,'held');
  assert.throws(()=>commitStage(root,{stage:'MATH',key:key2,outputs:{'x.json':'{}'},provenance:{}}),/EEXIST/);
}));
test('temporary workspace required and traversal rejected',()=>{
  assert.throws(()=>currentWorkRoot(),/VISUAL_WORKSPACE_CONTEXT_REQUIRED/);
  for(const p of ['archive/assets/a.svg',`${workRoot}/../../assets/a.svg`])assert.throws(()=>withWorkRoot(workRoot,()=>generatedPath(root,p)));
  assert.throws(()=>validateWorkRoot('archive/_generated/geometry-visual-engine/production'));
});
test('each real UID attempt binds a unique temporary run and exam workspace',()=>{
  const a=bindRunWorkspace(root,{questionUid:'exam-stable|12',sourcePath:'archive/exams/original/exam-stable.js'});
  const b=bindRunWorkspace(root,{questionUid:'exam-stable|12',sourcePath:'archive/exams/original/exam-stable.js'});
  assert.notEqual(a.runId,b.runId);
  assert.equal(a.examUid,'exam-stable');
  assert.equal(a.workRoot,`.tmp/archive/${a.runId}/exam-stable/visual-engine/production`);
  assert.throws(()=>bindRunWorkspace(root,{questionUid:'other-exam|12',sourcePath:'archive/exams/original/exam-stable.js'}),/SOURCE_EXAM_UID_MISMATCH/);
});
test('temporary workspace junction into another root rejected',()=>withWorkRoot(workRoot,()=>{
  const target=path.join(root,'archive/assets');fs.mkdirSync(target,{recursive:true});
  const link=path.join(root,workRoot,'redirect');fs.mkdirSync(path.dirname(link),{recursive:true});fs.symlinkSync(target,link,'junction');
  assert.throws(()=>generatedPath(root,`${workRoot}/redirect/visual.svg`),/GENERATED_PATH_REDIRECT/);
}));
test('calculation cache reuses bytes with new provenance, never review authority',async()=>withWorkRoot(workRoot,async()=>{
  const math={graph:{branch:{refs:['A','B']}}},fingerprint=objectSha({worker:1});
  const key=stageKey('MATH',math,fingerprint);
  const cold=await calculationStage(root,{stage:'MATH',key,provenance:{reviewer:'old'}},async()=>({'x.json':'{"x":1}'}));
  const warm=await calculationStage(root,{stage:'MATH',key,provenance:{reviewer:'new'}},async()=>{throw Error('NO_RECOMPUTE');});
  assert.equal(warm.cacheHit,true);assert.deepEqual(cold.receipt.outputs,warm.receipt.outputs);
  assert.equal(warm.currentProvenance.reviewer,'new');
  assert.notEqual(key,stageKey('MATH',{graph:{branch:{refs:['B','A']}}},fingerprint));
  await assert.rejects(calculationStage(root,{stage:'REVIEW',key},async()=>({})),/EVIDENCE_CACHE/);
}));
test('scope fingerprint includes observer code, excludes unrelated docs',()=>{
  for(const name of ['worker','observer','docs'])fs.writeFileSync(path.join(root,name),'one');
  const spec={capability:'spike',implementationPaths:['worker'],observerPaths:['observer'],dependencyLock:{sympy:'1.14.0'},policy:{version:1}};
  const before=capabilityFingerprint(root,spec);
  fs.writeFileSync(path.join(root,'docs'),'two');assert.equal(before,capabilityFingerprint(root,spec));
  fs.writeFileSync(path.join(root,'observer'),'two');assert.notEqual(before,capabilityFingerprint(root,spec));
});
test('timeout terminates worker; next request uses a fresh subprocess',async()=>{
  const script=path.join(root,'sleep.py');fs.writeFileSync(script,'import time\ntime.sleep(30)\n');
  await assert.rejects(pythonWorker({action:'echo',value:1},{script,timeoutMs:100}),/WORKER_TIMEOUT/);
  assert.equal((await pythonWorker({action:'echo',value:2})).result,2);
});
test('concurrent async runs keep generated output in their own Archive temp workspaces',async()=>{
  const left='.tmp/archive/concurrent-left/exam-left/visual-engine/production';
  const right='.tmp/archive/concurrent-right/exam-right/visual-engine/production';
  const key=objectSha({sameMath:true});
  const commit=(workRoot,delay)=>withWorkRoot(workRoot,async()=>{
    await new Promise(resolve=>setTimeout(resolve,delay));
    const receipt=commitStage(root,{stage:'MATH',key,outputs:{'model.json':'{}'},provenance:{}});
    return receipt.manifestRef.path;
  });
  const [a,b]=await Promise.all([commit(left,15),commit(right,2)]);
  assert.ok(a.startsWith(left+'/stages/'));
  assert.ok(b.startsWith(right+'/stages/'));
  assert.notEqual(a,b);
});
test('one controller rejects fourth repair and repeated input/action/output',()=>{
  const b=new RepairBudget();for(let i=0;i<3;i++)b.complete(b.consume('PLAN',objectSha(i),'schema'),objectSha(i+1));
  assert.throws(()=>b.consume('LAYOUT',objectSha(4),'collision'),/REPAIR_BUDGET_EXHAUSTED/);
  const s=new RepairBudget();s.complete(s.consume('PLAN',objectSha(0),'schema'),objectSha(1));
  assert.throws(()=>s.complete(s.consume('PLAN',objectSha(0),'schema'),objectSha(1)),/STAGNATION/);
});

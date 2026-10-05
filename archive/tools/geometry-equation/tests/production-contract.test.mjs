import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {canonicalJson,objectSha,bytesSha,fileRef,readBoundFile} from '../../pipeline-core/canonical.mjs';
import {freezeWire,validateScalar,assetIdentity,stageKey,capabilityFingerprint,bindLegacy} from '../production/contracts.mjs';
import {commitStage,loadStage,calculationStage,GENERATED_ROOT,generatedPath} from '../production/store.mjs';
import {pythonWorker} from '../production/worker.mjs';
const root=fs.mkdtempSync(path.join(os.tmpdir(),'apmath-wire-'));
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
test('immutable commit, corruption, partial staging, concurrent writer fail closed',()=>{
  const key=objectSha({x:1});
  assert.throws(()=>commitStage(root,{stage:'MATH',key,outputs:{'model.json':'{}'},provenance:{},crashAt:'manifest'}),/INJECTED/);
  assert.equal(loadStage(root,'MATH',key),null);
  const receipt=commitStage(root,{stage:'MATH',key,outputs:{'model.json':'{}'},provenance:{}});
  assert.ok(receipt.manifestRef);
  assert.throws(()=>commitStage(root,{stage:'MATH',key,outputs:{'model.json':'{}'},provenance:{}}),/IMMUTABLE/);
  fs.writeFileSync(path.join(root,receipt.outputs[0].path),'corrupt');
  assert.throws(()=>loadStage(root,'MATH',key),/STALE_FILE/);
  const key2=objectSha({x:2}),lock=generatedPath(root,`${GENERATED_ROOT}/stages/MATH/${key2.slice(7)}.lock`);
  fs.writeFileSync(lock,'held');
  assert.throws(()=>commitStage(root,{stage:'MATH',key:key2,outputs:{'x.json':'{}'},provenance:{}}),/EEXIST/);
});
test('generated-only output and traversal rejected',()=>{
  for(const p of ['archive/assets/a.svg',`${GENERATED_ROOT}/../../assets/a.svg`])assert.throws(()=>generatedPath(root,p));
});
test('generated junction into production inside repo rejected',()=>{
  const target=path.join(root,'archive/assets');fs.mkdirSync(target,{recursive:true});
  const link=path.join(root,GENERATED_ROOT,'redirect');fs.symlinkSync(target,link,'junction');
  assert.throws(()=>generatedPath(root,`${GENERATED_ROOT}/redirect/visual.svg`),/GENERATED_PATH_REDIRECT/);
});
test('calculation cache reuses bytes with new provenance, never review authority',async()=>{
  const math={graph:{branch:{refs:['A','B']}}},fingerprint=objectSha({worker:1});
  const key=stageKey('MATH',math,fingerprint);
  const cold=await calculationStage(root,{stage:'MATH',key,provenance:{reviewer:'old'}},async()=>({'x.json':'{"x":1}'}));
  const warm=await calculationStage(root,{stage:'MATH',key,provenance:{reviewer:'new'}},async()=>{throw Error('NO_RECOMPUTE');});
  assert.equal(warm.cacheHit,true);assert.deepEqual(cold.receipt.outputs,warm.receipt.outputs);
  assert.equal(warm.currentProvenance.reviewer,'new');
  assert.notEqual(key,stageKey('MATH',{graph:{branch:{refs:['B','A']}}},fingerprint));
  await assert.rejects(calculationStage(root,{stage:'REVIEW',key},async()=>({})),/EVIDENCE_CACHE/);
});
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

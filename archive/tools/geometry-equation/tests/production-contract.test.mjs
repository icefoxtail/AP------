import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
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
test('separate processes cannot publish competing bytes for one immutable stage key',async()=>{
  const runId=`commit-race-${crypto.randomUUID()}`;
  const raceWorkRoot=`.tmp/archive/${runId}/geometry/visual-engine/production`;
  const raceKey=objectSha({sameStage:true,runId});
  const storeUrl=new URL('../production/store.mjs',import.meta.url).href;
  const writerSource=`
    import {commitStage,withWorkRoot} from ${JSON.stringify(storeUrl)};
    const root=process.env.APMATH_RACE_ROOT;
    const workRoot=process.env.APMATH_RACE_WORK_ROOT;
    const key=process.env.APMATH_RACE_KEY;
    const value=process.env.APMATH_RACE_VALUE;
    process.stdout.write('READY\\n');
    await new Promise(resolve=>process.stdin.once('data',resolve));
    try {
      const receipt=withWorkRoot(workRoot,()=>commitStage(root,{stage:'MATH',key,outputs:{'model.json':JSON.stringify({value})},provenance:{writer:value}}));
      process.stdout.write('RESULT '+JSON.stringify({status:'COMMITTED',value,manifestRef:receipt.manifestRef})+'\\n');
    } catch(error) {
      process.stdout.write('RESULT '+JSON.stringify({status:'REJECTED',error:error.code||error.message})+'\\n');
    }
  `;
  const launchWriter=value=>{
    const child=spawn(process.execPath,['--input-type=module','-e',writerSource],{
      env:{...process.env,APMATH_RACE_ROOT:root,APMATH_RACE_WORK_ROOT:raceWorkRoot,APMATH_RACE_KEY:raceKey,APMATH_RACE_VALUE:value},
      stdio:['pipe','pipe','pipe']
    });
    let pending='',stderr='';
    let readyResolve,resultResolve;
    const ready=new Promise(resolve=>{readyResolve=resolve;});
    const result=new Promise(resolve=>{resultResolve=resolve;});
    child.stdout.setEncoding('utf8');
    child.stdout.on('data',chunk=>{
      pending+=chunk;
      while(pending.includes('\n')){
        const index=pending.indexOf('\n'),line=pending.slice(0,index);pending=pending.slice(index+1);
        if(line==='READY')readyResolve();
        if(line.startsWith('RESULT '))resultResolve(JSON.parse(line.slice(7)));
      }
    });
    child.stderr.setEncoding('utf8');child.stderr.on('data',chunk=>{stderr+=chunk;});
    const closed=new Promise((resolve,reject)=>child.once('close',code=>code===0?resolve():reject(Error(`race writer exited ${code}: ${stderr}`))));
    return{child,ready,result,closed};
  };
  const writers=[launchWriter('left'),launchWriter('right')];
  await Promise.all(writers.map(writer=>writer.ready));
  for(const writer of writers)writer.child.stdin.end('GO\n');
  const outcomes=await Promise.all(writers.map(async writer=>{const [result]=await Promise.all([writer.result,writer.closed]);return result;}));
  assert.equal(outcomes.filter(value=>value.status==='COMMITTED').length,1,JSON.stringify(outcomes));
  assert.equal(outcomes.filter(value=>value.status==='REJECTED').length,1,JSON.stringify(outcomes));
  assert.ok(['EEXIST','IMMUTABLE_STAGE_EXISTS'].includes(outcomes.find(value=>value.status==='REJECTED').error));
  const published=withWorkRoot(raceWorkRoot,()=>loadStage(root,'MATH',raceKey));
  assert.ok(published?.manifestRef);
  assert.equal(JSON.parse(readBoundFile(root,published.outputs[0])).value,outcomes.find(value=>value.status==='COMMITTED').value);
  const stageParent=path.join(root,raceWorkRoot,'stages','MATH');
  assert.deepEqual(fs.readdirSync(stageParent),[raceKey.slice(7)]);
});
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
test('repair ledger hydration carries the same three-attempt budget across replay',()=>{
  const first=new RepairBudget();
  for(let i=0;i<2;i++)first.complete(first.consume('SOURCE_REVIEW',objectSha(i),'review-defect'),objectSha(i+1));
  const persisted=JSON.parse(JSON.stringify(first.ledger)),resumed=new RepairBudget(persisted);
  assert.deepEqual(resumed.ledger,persisted);
  resumed.complete(resumed.consume('LAYOUT',objectSha(2),'measured-collision'),objectSha(3));
  assert.throws(()=>resumed.consume('LAYOUT',objectSha(4),'next-defect'),/REPAIR_BUDGET_EXHAUSTED/);
  assert.equal(resumed.ledger.length,3);
  const interrupted=new RepairBudget();interrupted.consume('LAYOUT',objectSha('input'),'interrupted-worker');
  const recovered=new RepairBudget(JSON.parse(JSON.stringify(interrupted.ledger)));
  assert.equal(recovered.ledger.length,1);assert.equal(recovered.ledger[0].outputSha,null);
  recovered.complete(recovered.ledger[0],objectSha('recovered-output'));
  assert.throws(()=>new RepairBudget([{...recovered.ledger[0],iteration:0}]),/INVALID_REPAIR_LEDGER/);
});

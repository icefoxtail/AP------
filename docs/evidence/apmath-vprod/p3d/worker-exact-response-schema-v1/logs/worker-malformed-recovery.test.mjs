import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {canonicalJson,objectSha,readBoundFile} from '../../pipeline-core/canonical.mjs';
import {calculationStage,loadStage,withWorkRoot} from '../production/store.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {freezeWire,WIRE_VERSION} from '../production/contracts.mjs';

const root=fs.mkdtempSync(path.join(os.tmpdir(),'apmath-worker-malformed-recovery-'));
test.after(()=>fs.rmSync(root,{recursive:true,force:true}));

test('invalid worker protocol stays uncached until same-key recovery commits valid bytes',async()=>{
  const workRoot=`.tmp/archive/worker-malformed-${crypto.randomUUID()}/exam-worker-malformed/visual-engine/production`;
  const key=objectSha({calculation:'worker-malformed-protocol-recovery'}),base=`${workRoot}/stages/MATH/${key.slice(7)}`;
  const invalid={wireVersion:'APMATH_VISUAL_WIRE_v1',inputObjectSha256:'sha256:'+'0'.repeat(64),status:'OK',result:{value:'must-not-publish'}};
  const script=path.join(root,'invalid-response.py');fs.writeFileSync(script,'import sys\nsys.stdin.read()\nsys.stdout.write('+JSON.stringify(JSON.stringify(invalid))+')\nsys.stdout.flush()\n');
  let failedProducerCalls=0;
  await assert.rejects(withWorkRoot(workRoot,()=>calculationStage(root,{stage:'MATH',key,provenance:{attempt:'invalid-protocol'}},async()=>{
    failedProducerCalls++;
    const result=await pythonWorker({action:'echo',value:'request'},{script,timeoutMs:2000});
    return{'model.json':canonicalJson(result.result)};
  })),/INVALID_WORKER_RESPONSE/);
  assert.equal(failedProducerCalls,1);
  withWorkRoot(workRoot,()=>{
    assert.equal(loadStage(root,'MATH',key),null);
    assert.equal(fs.existsSync(path.join(root,base+'.lock')),false);
    const parent=path.join(root,workRoot,'stages','MATH');
    const siblings=fs.existsSync(parent)?fs.readdirSync(parent):[];
    assert.equal(siblings.some(name=>name.startsWith(path.basename(base)+'.staging-')),false);
  });
  let recoveryProducerCalls=0;
  const recovered=await withWorkRoot(workRoot,()=>calculationStage(root,{stage:'MATH',key,provenance:{attempt:'recovered'}},async()=>{
    recoveryProducerCalls++;
    const result=await pythonWorker({action:'echo',value:'recovered-after-invalid-response'});
    return{'model.json':canonicalJson(result.result)};
  }));
  assert.equal(recovered.cacheHit,false);assert.equal(recoveryProducerCalls,1);
  assert.equal(readBoundFile(root,recovered.receipt.outputs[0]).toString('utf8'),JSON.stringify('recovered-after-invalid-response'));
  const warm=await withWorkRoot(workRoot,()=>calculationStage(root,{stage:'MATH',key,provenance:{attempt:'warm'}},async()=>{
    recoveryProducerCalls++;
    return{'model.json':'"wrong-recompute"'};
  }));
  assert.equal(warm.cacheHit,true);assert.equal(recoveryProducerCalls,1);
  assert.equal(readBoundFile(root,warm.receipt.outputs[0]).toString('utf8'),JSON.stringify('recovered-after-invalid-response'));
  withWorkRoot(workRoot,()=>{
    const siblings=fs.readdirSync(path.join(root,workRoot,'stages','MATH'));
    assert.deepEqual(siblings,[key.slice(7)]);
    assert.ok(loadStage(root,'MATH',key));
  });
});

test('malformed JSON framing and invalid status schemas stay uncached until same-key recovery',async()=>{
  const cases=[
    {name:'malformed-json-frame',payload:{action:'echo',value:'malformed-frame'},error:error=>error instanceof SyntaxError,scriptText:'import sys\nsys.stdin.read()\nsys.stdout.write("not-json\\n")\nsys.stdout.flush()\n'},
    {name:'invalid-status-schema',payload:{action:'echo',value:'invalid-status'},error:error=>error.message==='INVALID_WORKER_RESPONSE',makeScript:payload=>{
      const requestHash=freezeWire(payload).objectSha256;
      const response={wireVersion:WIRE_VERSION,inputObjectSha256:requestHash,status:'NOT_A_WORKER_STATUS',result:{value:'must-not-publish'}};
      return'import sys\nsys.stdin.read()\nsys.stdout.write('+JSON.stringify(JSON.stringify(response)+'\n')+')\nsys.stdout.flush()\n';
    }},
    {name:'invalid-wire-version',payload:{action:'echo',value:'invalid-wire-version'},error:error=>error.message==='INVALID_WORKER_RESPONSE',makeScript:payload=>{
      const requestHash=freezeWire(payload).objectSha256;
      const response={wireVersion:'APMATH_VISUAL_WIRE_v0',inputObjectSha256:requestHash,status:'OK',result:{value:'must-not-publish'}};
      return'import sys\nsys.stdin.read()\nsys.stdout.write('+JSON.stringify(JSON.stringify(response)+'\n')+')\nsys.stdout.flush()\n';
    }},
    {name:'missing-result-field',payload:{action:'echo',value:'missing-result'},error:error=>error.message==='INVALID_WORKER_RESPONSE',makeScript:payload=>{
      const requestHash=freezeWire(payload).objectSha256;
      const response={wireVersion:WIRE_VERSION,inputObjectSha256:requestHash,status:'OK'};
      return'import sys\nsys.stdin.read()\nsys.stdout.write('+JSON.stringify(JSON.stringify(response)+'\n')+')\nsys.stdout.flush()\n';
    }},
    {name:'unexpected-response-field',payload:{action:'echo',value:'unexpected-response-field'},error:error=>error.message==='INVALID_WORKER_RESPONSE',makeScript:payload=>{
      const requestHash=freezeWire(payload).objectSha256;
      const response={wireVersion:WIRE_VERSION,inputObjectSha256:requestHash,status:'OK',result:{value:'must-not-publish'},diagnostic:'unexpected'};
      return'import sys\nsys.stdin.read()\nsys.stdout.write('+JSON.stringify(JSON.stringify(response)+'\n')+')\nsys.stdout.flush()\n';
    }}
  ];
  for(const [index,scenario] of cases.entries()){
    const workRoot=`.tmp/archive/worker-malformed-${crypto.randomUUID()}/exam-protocol-${index}/visual-engine/production`;
    const key=objectSha({calculation:'worker-malformed-framing-schema-recovery',name:scenario.name}),base=`${workRoot}/stages/MATH/${key.slice(7)}`;
    const script=path.join(root,scenario.name+'.py');fs.writeFileSync(script,scenario.makeScript?scenario.makeScript(scenario.payload):scenario.scriptText);
    let failedProducerCalls=0;
    await assert.rejects(withWorkRoot(workRoot,()=>calculationStage(root,{stage:'MATH',key,provenance:{attempt:scenario.name}},async()=>{
      failedProducerCalls++;
      const result=await pythonWorker(scenario.payload,{script,timeoutMs:2000});
      return{'model.json':canonicalJson(result.result)};
    })),error=>scenario.error(error));
    assert.equal(failedProducerCalls,1);
    withWorkRoot(workRoot,()=>{
      assert.equal(loadStage(root,'MATH',key),null);
      assert.equal(fs.existsSync(path.join(root,base+'.lock')),false);
      const parent=path.join(root,workRoot,'stages','MATH'),siblings=fs.existsSync(parent)?fs.readdirSync(parent):[];
      assert.equal(siblings.some(name=>name.startsWith(path.basename(base)+'.staging-')),false);
    });
    let recoveryCalls=0;const recoveredValue='recovered-'+scenario.name;
    const recovered=await withWorkRoot(workRoot,()=>calculationStage(root,{stage:'MATH',key,provenance:{attempt:'recovered'}},async()=>{
      recoveryCalls++;const result=await pythonWorker({action:'echo',value:recoveredValue});return{'model.json':canonicalJson(result.result)};
    }));
    assert.equal(recovered.cacheHit,false);assert.equal(recoveryCalls,1);
    assert.equal(readBoundFile(root,recovered.receipt.outputs[0]).toString('utf8'),JSON.stringify(recoveredValue));
    const warm=await withWorkRoot(workRoot,()=>calculationStage(root,{stage:'MATH',key,provenance:{attempt:'warm'}},async()=>{recoveryCalls++;return{'model.json':'"wrong-recompute"'};}));
    assert.equal(warm.cacheHit,true);assert.equal(recoveryCalls,1);
    assert.equal(readBoundFile(root,warm.receipt.outputs[0]).toString('utf8'),JSON.stringify(recoveredValue));
    withWorkRoot(workRoot,()=>{
      assert.deepEqual(fs.readdirSync(path.join(root,workRoot,'stages','MATH')),[key.slice(7)]);
      assert.ok(loadStage(root,'MATH',key));
    });
  }
});

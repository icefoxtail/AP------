import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {canonicalJson,objectSha,readBoundFile} from '../../pipeline-core/canonical.mjs';
import {calculationStage,loadStage,withWorkRoot} from '../production/store.mjs';
import {pythonWorker} from '../production/worker.mjs';

const root=fs.mkdtempSync(path.join(os.tmpdir(),'apmath-worker-error-recovery-'));
test.after(()=>fs.rmSync(root,{recursive:true,force:true}));

test('worker output-limit and nonzero-exit stages stay uncached until same-key recovery',async()=>{
  const failures=[
    {name:'output-limit',script:'import sys\nsys.stdin.read()\nsys.stdout.write("x"*4096)\nsys.stdout.flush()\n',options:{maxBytes:16},error:/WORKER_OUTPUT_LIMIT/},
    {name:'nonzero-exit',script:'import sys\nsys.stdin.read()\nsys.stderr.write("injected worker exit")\nsys.exit(23)\n',options:{timeoutMs:2000},error:/WORKER_EXIT:23:injected worker exit/}
  ];
  for(const failure of failures){
    const workRoot=`.tmp/archive/worker-error-${failure.name}-${crypto.randomUUID()}/exam-worker-error/visual-engine/production`;
    const key=objectSha({calculation:'worker-error-recovery',kind:failure.name});
    const base=`${workRoot}/stages/MATH/${key.slice(7)}`;
    const script=path.join(root,`${failure.name}.py`);fs.writeFileSync(script,failure.script);
    let failedProducerCalls=0;
    await assert.rejects(withWorkRoot(workRoot,()=>calculationStage(root,{stage:'MATH',key,provenance:{attempt:'worker-error'}},async()=>{
      failedProducerCalls++;
      const result=await pythonWorker({action:'echo',value:'must-not-publish'},{script,...failure.options});
      return{'model.json':canonicalJson(result.result)};
    })),failure.error);
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
      const result=await pythonWorker({action:'echo',value:`recovered-${failure.name}`});
      return{'model.json':canonicalJson(result.result)};
    }));
    assert.equal(recovered.cacheHit,false);assert.equal(recoveryProducerCalls,1);
    assert.equal(readBoundFile(root,recovered.receipt.outputs[0]).toString('utf8'),JSON.stringify(`recovered-${failure.name}`));
    const warm=await withWorkRoot(workRoot,()=>calculationStage(root,{stage:'MATH',key,provenance:{attempt:'warm'}},async()=>{
      recoveryProducerCalls++;
      return{'model.json':'"wrong-recompute"'};
    }));
    assert.equal(warm.cacheHit,true);assert.equal(recoveryProducerCalls,1);
    assert.equal(readBoundFile(root,warm.receipt.outputs[0]).toString('utf8'),JSON.stringify(`recovered-${failure.name}`));
    withWorkRoot(workRoot,()=>{
      const siblings=fs.readdirSync(path.join(root,workRoot,'stages','MATH'));
      assert.deepEqual(siblings,[key.slice(7)]);
      assert.ok(loadStage(root,'MATH',key));
    });
  }
});

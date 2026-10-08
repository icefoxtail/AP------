import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {canonicalJson,objectSha,readBoundFile} from '../../pipeline-core/canonical.mjs';
import {calculationStage,loadStage,withWorkRoot} from '../production/store.mjs';
import {pythonWorker} from '../production/worker.mjs';

const root=fs.mkdtempSync(path.join(os.tmpdir(),'apmath-worker-cancel-recovery-'));
test.after(()=>fs.rmSync(root,{recursive:true,force:true}));

test('cancellation terminates its worker and leaves the calculation key recoverable',async()=>{
  const workRoot=`.tmp/archive/worker-cancel-${crypto.randomUUID()}/exam-worker-cancel/visual-engine/production`;
  const key=objectSha({calculation:'worker-cancel-recovery'}),base=`${workRoot}/stages/MATH/${key.slice(7)}`;
  const marker=path.join(root,'worker-started.marker'),script=path.join(root,'cancel-sleep.py');
  fs.writeFileSync(script,'from pathlib import Path\nPath('+JSON.stringify(marker)+').write_text("started", encoding="utf-8")\nimport time\ntime.sleep(30)\n');
  const controller=new AbortController();let cancelledProducerCalls=0;
  const interrupted=withWorkRoot(workRoot,()=>calculationStage(root,{stage:'MATH',key,provenance:{attempt:'cancelled'}},async()=>{
    cancelledProducerCalls++;
    const response=await pythonWorker({action:'echo',value:'must-not-publish'},{script,signal:controller.signal,timeoutMs:10000});
    return{'model.json':canonicalJson(response.result)};
  }));
  const cancellation=assert.rejects(interrupted,/WORKER_CANCELLED/);
  const deadline=Date.now()+5000;
  while(!fs.existsSync(marker)&&Date.now()<deadline)await new Promise(resolve=>setTimeout(resolve,10));
  const workerStarted=fs.existsSync(marker);
  controller.abort();
  await cancellation;
  assert.equal(workerStarted,true);
  assert.equal(cancelledProducerCalls,1);
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
    const response=await pythonWorker({action:'echo',value:'recovered-after-cancel'});
    return{'model.json':canonicalJson(response.result)};
  }));
  assert.equal(recovered.cacheHit,false);assert.equal(recoveryProducerCalls,1);
  assert.equal(readBoundFile(root,recovered.receipt.outputs[0]).toString('utf8'),JSON.stringify('recovered-after-cancel'));
  const warm=await withWorkRoot(workRoot,()=>calculationStage(root,{stage:'MATH',key,provenance:{attempt:'warm'}},async()=>{
    recoveryProducerCalls++;
    return{'model.json':'"wrong-recompute"'};
  }));
  assert.equal(warm.cacheHit,true);assert.equal(recoveryProducerCalls,1);
  assert.equal(readBoundFile(root,warm.receipt.outputs[0]).toString('utf8'),JSON.stringify('recovered-after-cancel'));
  withWorkRoot(workRoot,()=>{
    const siblings=fs.readdirSync(path.join(root,workRoot,'stages','MATH'));
    assert.deepEqual(siblings,[key.slice(7)]);
    assert.ok(loadStage(root,'MATH',key));
  });
});

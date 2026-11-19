// The long-lived python host (worker_host.py) answers production-script requests exactly like one fresh process per request, and recovers from timeout and cancellation.
import test from 'node:test';
import assert from 'node:assert/strict';
import {pythonWorker,closeWorkers,workerHostStats} from '../production/worker.mjs';

const payloads=[
  {action:'echo',value:'one'},
  {action:'echo',value:{nested:[1,2,{three:'삼'}]}},
  {action:'no-such-action'},
  {action:'build'}, // missing spec -> KeyError reported as status ERROR
];
const withReuse=async(flag,fn)=>{const old=process.env.GEOMETRY_WORKER_REUSE;process.env.GEOMETRY_WORKER_REUSE=flag;try{return await fn();}finally{if(old===undefined)delete process.env.GEOMETRY_WORKER_REUSE;else process.env.GEOMETRY_WORKER_REUSE=old;}};
test.after(()=>closeWorkers());

test('persistent host results equal one-process-per-request results and one host serves every request',async()=>{
  const classic=await withReuse('0',async()=>{const out=[];for(const p of payloads)out.push(await pythonWorker(p,{timeoutMs:60000}));return out;});
  closeWorkers();
  const reused=await withReuse('1',async()=>{const out=[];for(const p of payloads)out.push(await pythonWorker(p,{timeoutMs:60000}));return out;});
  assert.deepEqual(reused,classic);
  const stats=workerHostStats();
  assert.equal(stats.live,1);assert.equal(stats.served,payloads.length);
});

test('a timeout or cancellation ends that host and the next request gets a fresh one',async()=>{
  await withReuse('1',async()=>{
    closeWorkers();
    await assert.rejects(pythonWorker({action:'echo',value:'slow'},{timeoutMs:1}),/WORKER_TIMEOUT/);
    assert.equal(workerHostStats().live,0);
    const controller=new AbortController();
    const cancelled=pythonWorker({action:'echo',value:'cancel'},{timeoutMs:60000,signal:controller.signal});
    controller.abort();
    await assert.rejects(cancelled,/WORKER_CANCELLED/);
    assert.equal(workerHostStats().live,0);
    const ok=await pythonWorker({action:'echo',value:'after'},{timeoutMs:60000});
    assert.equal(ok.status,'OK');assert.equal(ok.result,'after');assert.equal(workerHostStats().live,1);
  });
});

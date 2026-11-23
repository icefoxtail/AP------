// exam-batch.mjs: the scheduler that lets the figures of one exam share an Archive page (no browser needed: the batch and single calls are fakes).
import test from 'node:test';
import assert from 'node:assert/strict';
import {runExamBatch,currentBatchSession} from '../production/exam-batch.mjs';

const tick=()=>new Promise(resolve=>setImmediate(resolve));

// one task: does `before` steps, asks once, returns what it got
function figure(name,{group='exam-A',kind='measure',dupKey=name,log,calls,answerFor}){
  return async()=>{
    log.push(name+':start');
    const session=currentBatchSession();
    assert.ok(session,'the task runs inside the session');
    await tick();
    const got=await session.submit({kind,group,dupKey,payload:name,
      batch:async payloads=>{calls.push({kind,group,payloads:[...payloads]});return payloads.map(p=>answerFor?.(p)??{ok:true,value:'batch:'+p});},
      single:async()=>{calls.push({single:name});return 'single:'+name;}});
    log.push(name+':got '+got);
    return got;
  };
}

test('figures of one exam that ask in the same round are answered by one batch call, resumed in the order they asked',async()=>{
  const log=[],calls=[];
  const results=await runExamBatch(['a','b','c'].map(name=>figure(name,{log,calls})));
  assert.deepEqual(results.map(r=>r.value),['batch:a','batch:b','batch:c']);
  assert.equal(calls.length,1);
  assert.deepEqual(calls[0].payloads,['a','b','c']);
  assert.deepEqual(log.filter(l=>l.includes('got')),['a:got batch:a','b:got batch:b','c:got batch:c']);
  assert.equal(results.stats.batches,1);
});

test('only one figure runs at a time: a task gives the turn up only when it asks',async()=>{
  let running=0,peak=0;
  const tasks=['a','b','c','d'].map(name=>async()=>{
    running++;peak=Math.max(peak,running);
    await tick();await tick();
    running--;
    const got=await currentBatchSession().submit({kind:'measure',group:'g',dupKey:name,payload:name,batch:async p=>p.map(x=>({ok:true,value:x})),single:async()=>name});
    running++;peak=Math.max(peak,running);
    await tick();
    running--;
    return got;
  });
  const results=await runExamBatch(tasks);
  assert.equal(peak,1);
  assert.deepEqual(results.map(r=>r.value),['a','b','c','d']);
});

test('a figure the batch refuses goes on alone and does not change the others',async()=>{
  const log=[],calls=[];
  const results=await runExamBatch(['a','b','c'].map(name=>figure(name,{log,calls,answerFor:p=>p==='b'?{ok:false}:null})));
  assert.deepEqual(results.map(r=>r.value),['batch:a','single:b','batch:c']);
  assert.equal(results.stats.single,1);
});

test('a batch that throws sends every figure to its own single call',async()=>{
  const tasks=['a','b'].map(name=>async()=>currentBatchSession().submit({kind:'capture',group:'g',dupKey:name,payload:name,batch:async()=>{throw Error('page crashed');},single:async()=>'single:'+name}));
  const results=await runExamBatch(tasks);
  assert.deepEqual(results.map(r=>r.value),['single:a','single:b']);
});

test('a figure that finishes without asking does not hold the others back; a lone request is answered by its single call',async()=>{
  const log=[],calls=[];
  const quick=async()=>'quick';
  const results=await runExamBatch([figure('a',{log,calls}),quick]);
  assert.deepEqual(results.map(r=>r.value),['single:a','quick']);
  assert.equal(calls.filter(c=>c.payloads).length,0,'a request of one never opens a shared page');
});

test('a task that throws is reported and the others still finish',async()=>{
  const log=[],calls=[];
  const bad=async()=>{await tick();throw Error('boom');};
  const results=await runExamBatch([figure('a',{log,calls}),bad,figure('c',{log,calls})]);
  assert.equal(results[0].status,'fulfilled');
  assert.equal(results[1].status,'rejected');
  assert.equal(results[2].status,'fulfilled');
  assert.deepEqual(calls.filter(c=>c.payloads).map(c=>c.payloads),[['a','c']]);
});

test('the same figure twice in one round goes to different waves; other exams and other kinds are separate calls',async()=>{
  const log=[],calls=[];
  const results=await runExamBatch([
    figure('a',{log,calls}),
    figure('a2',{log,calls,dupKey:'a'}),
    figure('b',{log,calls,group:'exam-B'}),
    figure('b2',{log,calls,group:'exam-B'}),
    figure('c',{log,calls,kind:'capture'}),
    figure('c2',{log,calls,kind:'capture'})
  ]);
  assert.equal(results.every(r=>r.status==='fulfilled'),true);
  const batches=calls.filter(c=>c.payloads).map(c=>c.kind+'|'+c.group+'|'+c.payloads.join(','));
  assert.deepEqual(batches.sort(),['capture|exam-A|c,c2','measure|exam-B|b,b2'].sort());
  // a and a2 share a dupKey: each is alone in its wave, so each is answered by its single call
  assert.equal(results[0].value,'single:a');
  assert.equal(results[1].value,'single:a2');
});

test('a task that asks twice (a second measurement) joins the next round',async()=>{
  const calls=[];
  const twice=name=>async()=>{
    const s=currentBatchSession();
    const one=await s.submit({kind:'measure',group:'g',dupKey:name,payload:name+'1',batch:async p=>{calls.push(p);return p.map(x=>({ok:true,value:x}));},single:async()=>'s'});
    const two=await s.submit({kind:'measure',group:'g',dupKey:name,payload:name+'2',batch:async p=>{calls.push(p);return p.map(x=>({ok:true,value:x}));},single:async()=>'s'});
    return one+'|'+two;
  };
  const results=await runExamBatch([twice('a'),twice('b')]);
  assert.deepEqual(results.map(r=>r.value),['a1|a2','b1|b2']);
  assert.deepEqual(calls,[['a1','b1'],['a2','b2']]);
});

test('a group of one task runs without a session',async()=>{
  const results=await runExamBatch([async()=>currentBatchSession()]);
  assert.equal(results[0].value,null);
});

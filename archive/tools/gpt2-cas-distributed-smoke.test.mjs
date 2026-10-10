import test from 'node:test';
import assert from 'node:assert/strict';
import {testPath,collisionStatus,evaluateAttemptResults} from './gpt2-cas-distributed-smoke.mjs';
const p=testPath('12345');
const rows=[
 {actor:'A',created:true,path:p,runId:'12345',observedOwner:'A'},
 {actor:'B',created:false,path:p,runId:'12345',observedOwner:'A'},
];
test('unique per-run CAS path with hex token',()=>{assert.match(p,/^gpt2-locks\/[a-f0-9]{64}\.json$/);assert.notEqual(p,testPath('12346'));});
test('only 409 and 422 are acceptable CAS conflicts',()=>{assert.equal(collisionStatus(409),true);assert.equal(collisionStatus(422),true);assert.equal(collisionStatus(403),false);assert.equal(collisionStatus(500),false);});
test('exactly one distributed winner and one loser',()=>{assert.deepEqual(evaluateAttemptResults(rows,{owner:'A'}).winner,'A');});
test('two successes are hard failure',()=>{assert.throws(()=>evaluateAttemptResults(rows.map(x=>({...x,created:true})),{owner:'A'}),/exactly one writer/);});
test('remote payload must reflect the winning writer',()=>{assert.throws(()=>evaluateAttemptResults(rows,{owner:'B'}),/actual remote writer/);});
test('malformed run IDs and records fail closed',()=>{assert.throws(()=>testPath('../hack'),/INVALID_RUN_ID/);assert.throws(()=>evaluateAttemptResults(rows,{owner:'C'}),/INVALID_DISTRIBUTED/);});
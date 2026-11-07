import test from 'node:test';
import assert from 'node:assert/strict';
import { compareReports } from './high-lab-compare.mjs';
function report() { return { commit: 'fixture', runs: [{ name: 'pc-paper' }], failures: [], labs: [{ id: 'lab', course: 'common', scenes: [{ id: 's' }], observations: [{ id: 's', run: 'pc-paper', state: 'initial', steps: 1, tabs: ['review'] }, { id: 's', run: 'pc-paper', state: 'step-0' }, { id: 's', run: 'pc-paper', state: 'step-1' }], interactions: [] }] }; }
test('an unchanged existing defect cannot become an all-checks or quality pass', () => {
  const before=report();before.failures.push({lab:'lab',id:'s',run:'pc-paper',reason:'runtime-error',errors:['old error']});
  const r=compareReports(before,structuredClone(before));
  assert.equal(r.regressionCheckPassed,true);assert.equal(r.candidateAllChecksPassed,false);assert.equal(r.quality,'NOT_ASSESSED_BY_AUTOMATION');
});
test('a new runtime error fails even when the same scene already has another error', () => {
  const before=report(),after=report();before.failures.push({lab:'lab',reason:'runtime-error',errors:['old']});after.failures.push({lab:'lab',reason:'runtime-error',errors:['old','new']});
  assert.equal(compareReports(before,after).regressions.length,1);
});
test('missing scenes and truncated stage traversal cannot silently pass', () => {
  const before=report(),after=report();after.labs[0].observations.pop();
  assert.equal(compareReports(before,after).regressionCheckPassed,false);
  after.labs[0].scenes=[];assert.equal(compareReports(before,after).regressions.some(x=>x.issue==='missing-candidate-scene'),true);
});
test('removing environment declarations and all observations cannot pass',()=>{
  const before=report(),after=report();after.runs=[];after.labs[0].observations=[];
  const r=compareReports(before,after);assert.equal(r.regressionCheckPassed,false);assert.equal(r.candidateAllChecksPassed,false);
});
test('removing the review tab or all stages cannot hide coverage requirements',()=>{
  const before=report(),after=report();after.labs[0].observations=[{...after.labs[0].observations[0],tabs:[],steps:0}];
  const r=compareReports(before,after);assert.equal(r.regressionCheckPassed,false);assert.equal(r.candidateAllChecksPassed,false);
});
test('a documented shorter sequence still passes when all candidate stages ran',()=>{
  const before=report(),after=report();before.labs[0].observations[0].steps=2;before.labs[0].observations.push({id:'s',run:'pc-paper',state:'step-2'});
  assert.equal(compareReports(before,after).candidateAllChecksPassed,true);
});
test('the local HTTP server ephemeral port does not invent a regression',()=>{
  const before=report(),after=report();before.failures=[{lab:'lab',reason:'runtime-error',errors:['HTTP 404 http://127.0.0.1:3000/file.js']}];after.failures=[{lab:'lab',reason:'runtime-error',errors:['HTTP 404 http://127.0.0.1:4000/file.js']}];
  assert.equal(compareReports(before,after).regressionCheckPassed,true);assert.equal(compareReports(before,after).candidateAllChecksPassed,false);
});
test('a disappeared slider or a generator no-op stays a failed observation',()=>{
  const before=report(),after=report();before.labs[0].observations[0].capabilities={sliders:1};after.labs[0].observations[0].capabilities={sliders:0};
  assert.equal(compareReports(before,after).regressionCheckPassed,false);
  for(const r of [before,after]){r.runs[0].name='mobile-paper';r.labs[0].observations.forEach(o=>o.run='mobile-paper');r.labs[0].observations[0].capabilities={generator:true};}
  assert.equal(compareReports(before,after).candidateAllChecksPassed,false);
});
test('recorded failures and baseline interactions are checked without capability metadata',()=>{
  const before=report(),after=report();before.labs[0].interactions=[{id:'s',kind:'slider',pass:true}];
  assert.equal(compareReports(before,after).regressionCheckPassed,false);
  before.labs[0].interactions=[];after.labs[0].interactions=[{id:'s',kind:'new-problem',variant:1,textChanged:false}];
  assert.equal(compareReports(before,after).candidateAllChecksPassed,false);
});
test('removing one of two solution alternatives cannot pass',()=>{
  const before=report(),after=report();
  before.labs[0].observations[0].capabilities={solutions:2};after.labs[0].observations[0].capabilities={solutions:1};
  before.labs[0].interactions=[0,1].map(index=>({id:'s',run:'pc-paper',kind:'solution-disclosure',state:'baseline',index,bodyPresent:true}));
  after.labs[0].interactions=[before.labs[0].interactions[0]];
  const r=compareReports(before,after);assert.equal(r.regressionCheckPassed,false);assert.equal(r.candidateAllChecksPassed,false);
});
test('steps revealed only after opening review must all be observed',()=>{
  const before=report();before.labs[0].observations[0].steps=0;
  before.labs[0].observations.push({id:'s',run:'pc-paper',tab:'review',state:'first-review',steps:4});
  for(let n=2;n<=4;n++)before.labs[0].observations.push({id:'s',run:'pc-paper',tab:'review',state:`step-${n}`,steps:4});
  assert.equal(compareReports(before,structuredClone(before)).candidateAllChecksPassed,true);
  const truncated=structuredClone(before);truncated.labs[0].observations=truncated.labs[0].observations.filter(o=>o.state!=='step-3');
  assert.equal(compareReports(before,truncated).regressionCheckPassed,false);
  const removed=structuredClone(before);removed.labs[0].observations=removed.labs[0].observations.filter(o=>o.state==='initial'||o.state==='step-0');
  assert.equal(compareReports(before,removed).regressions.some(o=>o.issue==='missing-candidate-solution-steps'),true);
});
test('a longer generated solution does not invent another baseline step',()=>{
  const before=report();before.labs[0].observations.push({id:'s',run:'pc-paper',tab:'review',state:'variant-solution-1',steps:4});
  assert.equal(compareReports(before,structuredClone(before)).candidateAllChecksPassed,true);
});

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

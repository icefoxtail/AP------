import test from 'node:test';
import assert from 'node:assert/strict';
import { compareReports, comparisonPasses } from './high-lab-compare.mjs';
import { REQUIRED_ORBIT_SCENES } from './high-orbit-probe.mjs';
import { SCREENSHOT_ENVIRONMENT_POLICY } from './browser-screenshot-guard.mjs';
function report() { return { commit: 'fixture', runs: [{ name: 'pc-paper' }], failures: [], labs: [{ id: 'lab', course: 'common', scenes: [{ id: 's' }], observations: [{ id: 's', run: 'pc-paper', state: 'initial', steps: 1, tabs: ['review'] }, { id: 's', run: 'pc-paper', state: 'step-0' }, { id: 's', run: 'pc-paper', state: 'step-1' }], interactions: [] }] }; }
test('an unchanged existing defect cannot become an all-checks or quality pass', () => {
  const before=report();before.failures.push({lab:'lab',id:'s',run:'pc-paper',reason:'runtime-error',errors:['old error']});
  const r=compareReports(before,structuredClone(before));
  assert.equal(r.regressionCheckPassed,true);assert.equal(r.candidateAllChecksPassed,false);assert.equal(r.quality,'NOT_ASSESSED_BY_AUTOMATION');
  assert.equal(comparisonPasses(r), true);
  assert.equal(comparisonPasses(r, { strictCandidate: true }), false);
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
test('a longer bounded target does not enlarge the baseline-step denominator', () => {
  const before = report(), after = report();
  after.labs[0].observations.push({ id: 's', run: 'pc-paper', tab: 'review', state: 'target-generated-variant-1', steps: 4 });
  assert.equal(compareReports(before, after).candidateAllChecksPassed, true);
});

test('a mouse drag cannot satisfy the Chromium touch-input gate', () => {
  const before = report(); before.capabilityPolicy = { touchDrag: 'REQUIRED_FOR_VISIBLE_HANDLES' };
  before.runs[0].name = 'mobile-paper'; before.labs[0].observations.forEach(o => { o.run = 'mobile-paper'; });
  before.labs[0].observations[0].capabilities = { drags: 1 };
  before.labs[0].interactions = [{ id: 's', run: 'mobile-paper', kind: 'drag', pass: true }];
  assert.equal(compareReports(before, structuredClone(before)).candidateAllChecksPassed, false);
  before.labs[0].interactions.push({ id: 's', run: 'mobile-paper', kind: 'touch-drag', input: 'touch', pass: true, acquired: true, held: true, changed: true, released: true });
  assert.equal(compareReports(before, structuredClone(before)).candidateAllChecksPassed, true);
  const missing = structuredClone(before); delete missing.capabilityPolicy;
  assert.equal(compareReports(before, missing).candidateAllChecksPassed, false);
});

test('every contracted 3D scene needs a successful native orbit even if metadata disappears', () => {
  const before = { commit: 'fixture', runs: [{ name: 'mobile-paper' }], failures: [], labs: Object.entries(REQUIRED_ORBIT_SCENES).map(([id, ids]) => ({
    id, course: 'geom', scenes: ids.map(id => ({ id })),
    observations: ids.map(id => ({ id, run: 'mobile-paper', state: 'initial', tabs: [] })),
    interactions: ids.map(id => ({ id, run: 'mobile-paper', kind: 'orbit', pass: true, acquired: true, cameraChanged: true, pixelsChanged: true }))
  })) };
  assert.equal(compareReports(before, structuredClone(before)).candidateAllChecksPassed, true);
  const noCamera = structuredClone(before); noCamera.labs[0].interactions[0].cameraChanged = false;
  assert.equal(compareReports(before, noCamera).candidateAllChecksPassed, false);
  const omitted = structuredClone(before); omitted.labs[0].interactions[0] = { ...omitted.labs[0].interactions[0], status: 'NOT_APPLICABLE', pass: false };
  assert.equal(compareReports(before, omitted).candidateAllChecksPassed, false);
  const removed = structuredClone(before); removed.labs[0].scenes.pop();
  assert.equal(compareReports(before, removed).candidateAllChecksPassed, false);
});

test('an incomplete required PNG set blocks the candidate gate', () => {
  const before = report(), after = report();
  after.reviewCapture = { complete: false, counts: { required: 8, capturedRequired: 7 } };
  assert.equal(compareReports(before, after).candidateAllChecksPassed, false);
});

test('initial and every captured environment are required and cannot be removed with their policy', () => {
  const before = report(), env = { maxTouchPoints: 0, coarsePointer: false, onTouchStart: false, hoverNone: false };
  before.capabilityPolicy = { screenshotEnvironment: SCREENSHOT_ENVIRONMENT_POLICY };
  before.labs[0].captures = ['one.png'];
  before.labs[0].screenshotEnvironment = [
    { run: 'pc-paper', phase: 'initial', expectedTouch: false, initial: env, pass: true },
    { run: 'pc-paper', phase: 'capture', file: 'one.png', expectedTouch: false, fullPage: true, initial: env, before: env, after: env, restored: env, restoreCommand: null, pass: true }
  ];
  assert.equal(compareReports(before, structuredClone(before)).candidateAllChecksPassed, true);
  for (const mutate of [r => { r.labs[0].screenshotEnvironment.shift(); }, r => { r.labs[0].screenshotEnvironment.pop(); }, r => { r.labs[0].screenshotEnvironment[1].restored = { ...env, coarsePointer: true }; }, r => { delete r.capabilityPolicy.screenshotEnvironment; }]) {
    const after = structuredClone(before); mutate(after); assert.equal(compareReports(before, after).candidateAllChecksPassed, false);
  }
});

test('schema 3 cannot opt out of screenshot environment verification in both baseline and candidate', () => {
  const before = report(); before.schema = 3;
  const result = compareReports(before, structuredClone(before));
  assert.equal(result.regressionCheckPassed, true);
  assert.equal(result.candidateAllChecksPassed, false);
  assert.ok(result.remaining.some(e => e.issue === 'missing-schema-required-screenshot-environment-policy'));
  assert.ok(result.remaining.some(e => e.issue === 'missing-or-invalid-initial-screenshot-environment'));
});

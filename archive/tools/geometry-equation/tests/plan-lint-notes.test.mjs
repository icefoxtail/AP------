// plan-lint tells an author, without refusing the plan, when a degree label is a bracket-less sum or difference: "x+20" is drawn x+20°, which is right when x is an angle
// (the question writes x=30°) and wrong when x is a plain number (then the plan writes "(x+20)"). The engine cannot know which, so the note asks the author to follow the question.
// Pure JavaScript; run with: node --test archive/tools/geometry-equation/tests/plan-lint-notes.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const {planNotes}=require('../ops/claude-batch/plan-lint.cjs');
const plan=(angles,arcs)=>({capability:'construction-spike-v1',planeMarks:{angles,...(arcs?{arcs}:{})}});

test('a bracket-less sum or difference on a degree label gets a note naming the two readings',()=>{
  for(const label of ['x+20','2x+15','180-x','a+b+c','50 + x']){
    const notes=planNotes(plan([{id:'t',refs:['A','O','B'],value:30,label}]));
    assert.equal(notes.length,1,label);
    assert.match(notes[0],/angles\[t\]/);
    assert.match(notes[0],/각의 크기/);
    assert.match(notes[0],/\(.+\)/);
  }
});
test('labels that are not a bare sum or difference get no note',()=>{
  for(const label of ['x','2x','x/2','180','-x','-30','(x+20)','(2x+10)','θ','2A','50°','x+20°','50+x°']){
    assert.deepEqual(planNotes(plan([{id:'t',refs:['A','O','B'],value:30,label}])),[],label);
  }
});
test('a label kind other than DEGREE, or a label with a unit, is not a degree label',()=>{
  assert.deepEqual(planNotes(plan([{id:'t',label:'x+20',labelKind:'MATH'}])),[]);
  assert.deepEqual(planNotes(plan([{id:'t',label:'x+20',labelKind:'TEXT'}])),[]);
  assert.deepEqual(planNotes(plan([],[{id:'a',label:'4+x',labelKind:'MATH',unit:'cm'}])),[]);
});
test('an arc label of the default kind and a panel plan are both read',()=>{
  assert.equal(planNotes(plan([],[{id:'a',label:'x-10'}])).length,1);
  const panels={panels:[{plan:plan([{id:'t',label:'x+20'}])},{plan:plan([{id:'u',label:'3x+5'}])}]};
  assert.equal(planNotes(panels).length,2);
});
test('a plan without plane marks has no notes',()=>{
  assert.deepEqual(planNotes({capability:'polynomial-spike-v1',graphPlan:{}}),[]);
  assert.deepEqual(planNotes(null),[]);
});

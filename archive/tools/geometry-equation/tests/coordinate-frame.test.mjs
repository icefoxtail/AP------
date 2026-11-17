import test from 'node:test';
import assert from 'node:assert/strict';
import {ensureCoordinateFrame} from '../production/coordinate-frame.mjs';

const src=(id,x,y)=>({id,op:'SOURCE_POINT',inputs:[],args:{coordinates:[{kind:'integer',value:String(x)},{kind:'integer',value:String(y)}]},outputType:'POINT',factRole:'GIVEN'});
const planOf=(nodes,extra={})=>({capability:'construction-spike-v1',mathPlan:{schemaVersion:'construction-spike-v1',realization:{recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false},nodes},displayPoints:['A'],...extra});

test('a source-coordinate plan without frame nodes gets one origin and one unit axis, unused ids, and the input is not mutated',()=>{
  const plan=planOf([src('A',1,2),src('FrameOrigin',0,1)]);
  const before=JSON.stringify(plan);
  const out=ensureCoordinateFrame(plan);
  assert.equal(JSON.stringify(plan),before);
  const ops=out.mathPlan.nodes.map(n=>n.op);
  assert.equal(ops.filter(op=>op==='NORMALIZATION_ORIGIN').length,1);assert.equal(ops.filter(op=>op==='NORMALIZATION_AXIS').length,1);
  const ids=out.mathPlan.nodes.map(n=>n.id);assert.equal(new Set(ids).size,ids.length);
  assert.deepEqual(out.displayPoints,['A'],'the added points are not displayed');
  assert.deepEqual(out.mathPlan.nodes.find(n=>n.op==='NORMALIZATION_AXIS').args,{length:{kind:'integer',value:'1'}});
});
test('plans that already carry a frame node, name no displayPoints, are plane figures or have no source objects are returned untouched',()=>{
  const frame=[{id:'O',op:'NORMALIZATION_ORIGIN',inputs:[],args:{},outputType:'POINT',factRole:'DERIVED_INTERMEDIATE'}];
  for(const plan of [planOf([src('A',1,2),...frame]),planOf([src('A',1,2)],{displayPoints:undefined}),planOf([...frame]),
    {...planOf([src('A',1,2)]),mathPlan:{...planOf([src('A',1,2)]).mathPlan,realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false}}}])assert.equal(ensureCoordinateFrame(plan),plan);
  assert.equal(ensureCoordinateFrame(null),null);
});

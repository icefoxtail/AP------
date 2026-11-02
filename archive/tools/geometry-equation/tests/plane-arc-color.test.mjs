// planeMarks.arcs[].color (G13c, C1): the plan-side rules. A highlighted circle arc takes a palette name (BLUE WARM GREEN ROSE VIOLET) and the engine object carries it;
// a name outside the palette, a colour on an arc that is not drawn (highlight false) and arcs of one colour with different lengths are refused with their codes.
// The engine and the independent observer are covered by tests/test_plane_arc_color.py. Real SymPy worker for the model, no browser. Run with --test-concurrency=1.
import test,{before} from 'node:test';
import assert from 'node:assert/strict';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {int,node} from './construction-v1-fixture.mjs';

const identity=assetIdentity('l1_unit_exam|1','SOLUTION_VISUAL','decisive-relation');
const source=(id,x,y)=>node(id,'SOURCE_POINT',[],'POINT',{coordinates:[int(x),int(y)]});
const polar=(id,center,reference,length,angle,turn='CCW')=>({...node(id,'POLAR_POINT',[center,reference],'POINT',{length:int(length),angleDeg:int(angle),turn}),factRole:'GIVEN'});
const derived=(id,op,inputs,type,args={})=>({...node(id,op,inputs,type,args),factRole:'DERIVED_INTERMEDIATE'});
// circle k (centre O, radius 5); A(30) B(90) C(150) D(210) E(270) degrees: the arcs AB, BC, CD are 60 degrees each, the arc AC is 120
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes:[
  source('O',0,0),derived('X','TRANSLATE_POINT',['O'],'POINT',{dx:int(1),dy:int(0)}),{...node('k','CIRCLE_CENTER_RADIUS',['O'],'CIRCLE',{radius:int(5)}),factRole:'GIVEN'},
  polar('A','O','X',5,30),polar('B','O','X',5,90),polar('C','O','X',5,150),polar('D','O','X',5,210),polar('E','O','X',5,270)]};
const arc=(id,from,to,extra={})=>({id,circle:'k',center:'O',from,to,side:'MINOR',factRole:'DERIVED_INTERMEDIATE',...extra});
const planOf=planeMarks=>({capability:'construction-spike-v1',caption:'원 위의 같은 길이의 호를 같은 색으로 나타냈다.',mathPlan:graph,
  displayPoints:['O','A','B','C','D','E'],displayLines:[],displayCircles:['k'],displaySegments:[],planeMarks});
let model;
before(async()=>{const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;});
const specOf=planeMarks=>specFor(planOf(planeMarks),model,identity.assetId);
const specError=planeMarks=>{try{specOf(planeMarks);}catch(error){return String(error.message);}assert.fail('specFor accepted the marks');};
const expectCode=(message,code)=>assert.ok(String(message).startsWith(code),`${code} expected, got ${message}`);

test('a coloured arc becomes an engine object that carries the palette name',()=>{
  const objects=specOf({arcs:[arc('aAB','A','B',{color:'BLUE'}),arc('aBC','B','C',{color:'BLUE'}),arc('aCD','C','D')]}).objects,byId=id=>objects.find(o=>o.id===id);
  assert.equal(byId('aAB').color,'BLUE');assert.equal(byId('aBC').color,'BLUE');assert.equal(byId('aCD').color,undefined);
  for(const name of ['WARM','GREEN','ROSE','VIOLET'])assert.equal(specOf({arcs:[arc('aAB','A','B',{color:name})]}).objects.find(o=>o.id==='aAB').color,name);
  // the same colour on arcs of the same length, whichever way round they are named
  assert.doesNotThrow(()=>specOf({arcs:[arc('aAB','A','B',{color:'BLUE'}),arc('aDC','D','C',{color:'BLUE'})]}));
});

test('a colour outside the palette, on an arc that is not drawn, or on arcs of different lengths is refused',()=>{
  for(const bad of ['TEAL','LIGHT','blue',1,null,''])expectCode(specError({arcs:[arc('aAB','A','B',{color:bad})]}),'ARC_COLOR_INVALID:aAB');
  expectCode(specError({arcs:[arc('aAB','A','B',{color:'BLUE',highlight:false})]}),'ARC_COLOR_INVALID:aAB');
  expectCode(specError({arcs:[arc('aAB','A','B',{color:'BLUE'}),arc('aAC','A','C',{color:'BLUE'})]}),'ARC_COLOR_GROUP_MISMATCH:aAB&aAC:BLUE');
  // two colours, two lengths: fine
  assert.doesNotThrow(()=>specOf({arcs:[arc('aAB','A','B',{color:'BLUE'}),arc('aAC','A','C',{color:'WARM'})]}));
});

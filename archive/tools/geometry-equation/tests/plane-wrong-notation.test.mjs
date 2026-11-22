// Plane marks that print a wrong value are refused with a code instead of rendering "pass": a degree sign after pi (pi/5 degrees, 4pi degrees) and a bare area
// value on a forced leader of a sector (the leader starts on a radius, so 40pi reads as that radius's length). The right forms stay valid.
// Real SymPy worker for the construction model; no browser. Run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {int,node} from './construction-v1-fixture.mjs';

const identity=assetIdentity('l1_unit_exam|1','SOLUTION_VISUAL','decisive-relation');
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes:[
  node('O','SOURCE_POINT',[],'POINT',{coordinates:[int(0),int(0)]}),
  {...node('A','TRANSLATE_POINT',['O'],'POINT',{dx:int(20),dy:int(0)}),factRole:'DERIVED_INTERMEDIATE'},
  {...node('B','POLAR_POINT',['O','A'],'POINT',{length:int(20),angleDeg:int(36),turn:'CCW'}),factRole:'DERIVED_INTERMEDIATE'},
  {...node('k','CIRCLE_CENTER_RADIUS',['O'],'CIRCLE',{radius:int(20)}),factRole:'DERIVED_INTERMEDIATE'}]};
const sector=(arc={},angle={},region={})=>({capability:'construction-spike-v1',caption:'호의 길이 4π, 반지름 20인 부채꼴이다.',mathPlan:graph,displayPoints:['O','A','B'],displayLines:[],displayCircles:[],
  displaySegments:[['OA','O','A'],['OB','O','B']].map(([id,a,b])=>({id,refs:[a,b]})),coordinateLabels:[],coordinateCanvas:{width:560,height:420},
  planeMarks:{arcs:[{id:'arc',circle:'k',center:'O',from:'A',to:'B',side:'MINOR',label:'4pi',labelKind:'MATH',...arc}],
    expressionLabels:[{id:'r',ownerSegment:'OA',text:'20',factRole:'DERIVED_INTERMEDIATE'}],
    angles:[{id:'th',refs:['A','O','B'],value:36,label:'pi/5',labelKind:'MATH',arcs:1,style:'ARC',...angle}],
    regions:[{id:'sec',fill:'LIGHT',label:'40pi',shapes:[{sector:{center:'O',from:'A',to:'B',side:'MINOR'}}],...region}]}});
let model;
const code=plan=>{try{specFor(plan,model,identity.assetId);}catch(error){return String(error.message);}return null;};
test.before(async()=>{const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;});

test('the right forms are accepted: pi labels as MATH, the sector value inside or on a named leader',()=>{
  assert.equal(code(sector()),null);
  assert.equal(code(sector({},{},{labelPlacement:'AUTO_LEADER'})),null);
  assert.equal(code(sector({},{},{labelName:'부채꼴 AOB',labelPlacement:'LEADER'})),null);
  assert.equal(code(sector({label:'36'},{label:'36',labelKind:'DEGREE'})),null,'a plain degree label is unchanged');
});
test('a degree label with pi in it is refused (the degree sign would make pi/5 degrees)',()=>{
  assert.equal(code(sector({},{labelKind:undefined})),'ANGLE_DEGREE_LABEL_HAS_PI:th');
  assert.equal(code(sector({},{labelKind:'DEGREE'})),'ANGLE_DEGREE_LABEL_HAS_PI:th');
  assert.equal(code(sector({labelKind:undefined})),'ARC_DEGREE_LABEL_HAS_PI:arc');
  assert.equal(code(sector({label:'π/3',labelKind:'DEGREE'})),'ARC_DEGREE_LABEL_HAS_PI:arc');
});
test('a bare value on a forced leader of a sector is refused (it would start on a radius)',()=>{
  assert.equal(code(sector({},{},{labelPlacement:'LEADER'})),'REGION_SECTOR_LEADER_NEEDS_NAME:sec');
});

// E31 (4): a coordinate construction point whose name is hidden (hiddenPointNames) may still write its coordinates (coordinateLabels): "(1,-1)", "(3/2,0)". No Chrome: the spec is the
// unit boundary for the plan side; the observer reads the final XML of a real composed figure (tests/e31-fixtures/hidden-point-coordinates.json: the intersection of two lines on a leader,
// a y-intercept, an x-intercept with a stacked fraction).
import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {int,node} from './construction-v1-fixture.mjs';

const OBSERVER=fileURLToPath(new URL('../production/primitive-observer-worker.py',import.meta.url));
const FIXTURE=JSON.parse(fs.readFileSync(new URL('./e31-fixtures/hidden-point-coordinates.json',import.meta.url),'utf8'));
const line=(id,a,b,c,role='GIVEN')=>({...node(id,'SOURCE_LINE',[],'LINE',{a:int(a),b:int(b),c:int(c)}),factRole:role});
const derived=(id,op,inputs=[],type='POINT',args={})=>({...node(id,op,inputs,type,args),factRole:'DERIVED_INTERMEDIATE'});
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false},nodes:[
  derived('O','NORMALIZATION_ORIGIN'),derived('U','NORMALIZATION_AXIS',[],'POINT',{length:int(1)}),line('l1',2,-1,-3),line('l2',1,2,1),line('xax',0,1,0,'DERIVED_INTERMEDIATE'),
  derived('Q','LINE_INTERSECTION',['l1','l2']),derived('X1','LINE_INTERSECTION',['l1','xax'])]};
const planOf=(extra={})=>({capability:'construction-spike-v1',caption:'두 직선의 교점이다.',mathPlan:graph,displayPoints:['O','Q','X1'],displayLines:['l1','l2'],displayCircles:[],displaySegments:[],
  hiddenPointNames:['Q','X1'],coordinateLabels:['Q','X1'],axisTickValues:{x:[],y:[]},coordinateCanvas:{width:640,height:480},...extra});
let model;
const specError=extra=>{try{specFor(planOf(extra),model,'hidden-coordinates-test');}catch(error){return String(error.message);}return null;};
const objectsOf=extra=>specFor(planOf(extra),model,'hidden-coordinates-test').objects;

test('the model of two lines and their intersection',async()=>{
  const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;
});

test('a hidden point that is a coordinate label has its coordinates and no name',()=>{
  const objects=objectsOf();
  assert.deepEqual(objects.filter(object=>object.kind==='COORDINATE_LABEL').map(object=>[object.id,object.target,object.exact]),[['Q-coordinate','Q',['1','-1']],['X1-coordinate','X1',['(3/2)','0']]]);
  assert.ok(!objects.some(object=>object.kind==='POINT_NAME'&&['Q','X1'].includes(object.target)));
  assert.deepEqual(objects.filter(object=>object.kind==='POINT'&&['Q','X1'].includes(object.id)).map(object=>object.name),[null,null]);
});

test('a point that is not hidden keeps its name beside its coordinates',()=>{
  const objects=objectsOf({hiddenPointNames:['Q'],unmarkedPointNames:undefined});
  assert.ok(objects.some(object=>object.id==='X1-name'&&object.kind==='POINT_NAME'));assert.ok(!objects.some(object=>object.id==='Q-name'));
});

test('a hidden point cannot go to the band and cannot lose its dot while it carries coordinates',()=>{
  assert.equal(specError({coordinatePanel:['Q']}),'COORDINATE_PANEL_HIDDEN_POINT:Q');
  assert.equal(specError({unmarkedPointNames:['Q']}),'COORDINATE_LABEL_POINT_UNMARKED:Q');
  assert.equal(specError({hiddenPointStyle:'NONE'}),'COORDINATE_LABEL_POINT_UNMARKED:Q');
  // the whole-figure band keeps hidden points' coordinates at their points
  const objects=objectsOf({coordinatePlacement:'PANEL'});assert.ok(objects.some(object=>object.id==='Q-coordinate'&&object.kind==='COORDINATE_LABEL'));
});

const observe=async({svg=FIXTURE.svg,points=FIXTURE.points,hidden=['Q','X1','Y1']})=>{
  const response=await pythonWorker({svg,points,transform:{originX:FIXTURE.transform.originX,originY:FIXTURE.transform.originY,sx:FIXTURE.transform.sx,sy:FIXTURE.transform.sy},fragments:FIXTURE.fragments,coordinateMode:'SOURCE_COORDINATES',hiddenCoordinateLabels:hidden},{script:OBSERVER});
  assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;
};
const codes=result=>result.errors.map(error=>error.split(':')[0]+':'+error.split(':')[1]);

test('the observer reads the coordinates back from the final XML of a real figure',async()=>{
  const clean=await observe({});assert.equal(clean.status,'PASS',JSON.stringify(clean.errors));
  assert.deepEqual(clean.observations.filter(row=>row.type==='HIDDEN_POINT_COORDINATE_LABEL').map(row=>row.owner),['Q','X1','Y1']);
});

test('a wrong coordinate, a missing label and a name beside a hidden point are named',async()=>{
  const moved={...FIXTURE.points,Y1:[0,2]};
  assert.ok(codes(await observe({points:moved})).includes('HIDDEN_POINT_COORDINATE_LABEL_TEXT_MISMATCH:Y1'));
  const fraction={...FIXTURE.points,X1:[1.75,0]};assert.ok(codes(await observe({points:fraction})).includes('HIDDEN_POINT_COORDINATE_LABEL_TEXT_MISMATCH:X1'));
  assert.deepEqual(codes(await observe({hidden:['Q','Nope']})),['HIDDEN_POINT_COORDINATE_LABEL_MISSING:Nope']);
  const named=FIXTURE.svg.replace('id="Q-coordinate" data-label-kind="COORDINATE_LABEL"','id="Q-coordinate" data-label-kind="POINT_NAME"');
  assert.ok(codes(await observe({svg:named})).includes('HIDDEN_POINT_COORDINATE_LABEL_MISSING:Q'));
});

test('a label tied to another point by a leader is not that point\'s',async()=>{
  const leader=/<line id="Q-coordinate-owner-leader"[^>]*\/>/.exec(FIXTURE.svg)[0];
  const far=FIXTURE.svg.replace(leader,leader.replace(/ x1="([^"]+)"/,(m,v)=>' x1="'+(Number(v)+60)+'"'));
  assert.ok(codes(await observe({svg:far})).includes('HIDDEN_POINT_COORDINATE_LABEL_AMBIGUOUS_OWNER:Q'));
});

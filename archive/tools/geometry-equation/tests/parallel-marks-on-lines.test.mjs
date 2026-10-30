// E31 (8): planeMarks.parallels[].lines (the parallel arrows stand on displayed lines) next to displayLines. No Chrome: the spec is the unit boundary for the plan side; the independent
// plane-marks observer reads a real composed figure (tests/e31-fixtures/parallel-marks-on-lines.json: x+y-5=0 and its parallel with one arrow, -3x+y+7=0 and its parallel with two).
import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {int,node} from './construction-v1-fixture.mjs';

const OBSERVER=fileURLToPath(new URL('../production/plane-marks-observer-worker.py',import.meta.url));
const FIXTURE=JSON.parse(fs.readFileSync(new URL('./e31-fixtures/parallel-marks-on-lines.json',import.meta.url),'utf8'));
const line=(id,a,b,c)=>({...node(id,'SOURCE_LINE',[],'LINE',{a:int(a),b:int(b),c:int(c)}),factRole:'GIVEN'});
const derived=(id,op,args={})=>({...node(id,op,[],'POINT',args),factRole:'DERIVED_INTERMEDIATE'});
const source=(id,x,y)=>({...node(id,'SOURCE_POINT',[],'POINT',{coordinates:[int(x),int(y)]}),factRole:'DERIVED_INTERMEDIATE'});
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false},nodes:[
  derived('O','NORMALIZATION_ORIGIN'),derived('U','NORMALIZATION_AXIS',{length:int(1)}),line('l1',1,1,-5),line('l2',-3,1,7),line('m1',1,1,4),line('m2',-3,1,4),line('m3',-2,1,4),source('F1',-4,-9),source('F2',8,9)]};
const planOf=(parallels,extra={})=>({capability:'construction-spike-v1',caption:'평행한 직선이다.',mathPlan:graph,displayPoints:['O','F1','F2'],displayLines:['l1','l2','m1','m2','m3'],displayCircles:[],displaySegments:[],
  hiddenPointNames:['F1','F2'],unmarkedPointNames:['F1','F2'],planeMarks:{parallels},axisTickValues:{x:[],y:[]},coordinateCanvas:{width:720,height:600},...extra});
let model;
const specError=(parallels,extra)=>{try{specFor(planOf(parallels,extra),model,'parallel-lines-test');}catch(error){return String(error.message);}return null;};
const marks=parallels=>specFor(planOf(parallels),model,'parallel-lines-test').objects.filter(object=>object.kind==='PARALLEL_MARK');

test('the model of five lines',async()=>{
  const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;
});

test('parallel arrows on displayed lines reach the spec as PARALLEL_MARK objects on those lines',()=>{
  assert.deepEqual(marks([{id:'pa',count:1,lines:['l1','m1']},{id:'pb',count:2,lines:['l2','m2']}]).map(object=>[object.id,object.refs,object.count]),[['pa',['l1','m1'],1],['pb',['l2','m2'],2]]);
});

test('lines that are not displayed, not parallel or mixed with segments are refused with their own codes',()=>{
  assert.equal(specError([{id:'pa',count:1,lines:['l1','nope']}]),'MARK_TARGET_UNKNOWN:nope');
  assert.equal(specError([{id:'pa',count:1,lines:['l1','l2']}]),'PARALLEL_MARK_NOT_PARALLEL:pa');
  assert.equal(specError([{id:'pa',count:1,lines:['l1','m1'],segments:['a','b']}]),'MARK_FIELD_INVALID:parallels.lines_and_segments:pa');
  assert.equal(specError([{id:'pa',count:1,lines:['l1']}]),'MARK_FIELD_INVALID:parallels.lines:pa');
  assert.equal(specError([{id:'pa',count:1,lines:['l1','m1']},{id:'pb',count:1,lines:['l2','m2']}]),'PARALLEL_MARK_GROUP_AMBIGUOUS:pb&pa');
  assert.equal(specError([{id:'pa',count:3,lines:['l1','m1']}]),'MARK_COUNT_INVALID:pa');
});

const observe=async({svg=FIXTURE.svg,marks=FIXTURE.marks})=>{
  const response=await pythonWorker({svg,points:FIXTURE.points,marks,segments:FIXTURE.segments,transform:{originX:FIXTURE.transform.originX,originY:FIXTURE.transform.originY,sx:FIXTURE.transform.sx,sy:FIXTURE.transform.sy}},{script:OBSERVER});
  assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;
};
const codes=result=>result.errors.map(error=>error.split(':')[0]+':'+error.split(':').slice(1).join(':'));

test('the observer reads every arrow back: its count, its place on the line and its direction along it',async()=>{
  const clean=await observe({});assert.equal(clean.status,'PASS',JSON.stringify(clean.errors));
  assert.deepEqual(clean.observations.filter(row=>row.type==='PARALLEL').map(row=>row.segments),[['l1','m1'],['l2','m2']]);
});

test('a missing arrow, a wrong count and lines that are not parallel are named',async()=>{
  const wrongCount=FIXTURE.marks.parallels.map(row=>row.id==='pb'?{...row,count:1}:row);
  assert.ok(codes(await observe({marks:{...FIXTURE.marks,parallels:wrongCount}})).some(code=>code.startsWith('PARALLEL_MARK_MISSING:pb')));
  const crossing=FIXTURE.marks.parallels.map(row=>row.id==='pa'?{...row,lines:['l1','l2']}:row);
  assert.ok(codes(await observe({marks:{...FIXTURE.marks,parallels:crossing}})).some(code=>code.startsWith('PARALLEL_MARK_NOT_PARALLEL:pa')));
  const undeclared=await observe({marks:{...FIXTURE.marks,parallels:FIXTURE.marks.parallels.filter(row=>row.id==='pa')}});
  assert.ok(codes(undeclared).some(code=>code.startsWith('UNDECLARED_MARK:parallel:pb')));
});

// E31 (1): lineLabels[].labelAt (START / END / a fraction) on a coordinate construction plan and the independent read-back of every equation label.
// No Chrome: the spec is the unit boundary for the plan side; the observer runs on a real composed figure (tests/e31-fixtures/parallel-coordinate-lines.json:
// two close parallel displayed lines, START and END labels on leaders). The graph side is tests/test_line_label_at.py.
import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {int,node} from './construction-v1-fixture.mjs';

const OBSERVER=fileURLToPath(new URL('../production/primitive-observer-worker.py',import.meta.url));
const FIXTURE=JSON.parse(fs.readFileSync(new URL('./e31-fixtures/parallel-coordinate-lines.json',import.meta.url),'utf8'));
const line=(id,a,b,c)=>({...node(id,'SOURCE_LINE',[],'LINE',{a:int(a),b:int(b),c:int(c)}),factRole:'GIVEN'});
const derived=(id,op,args={})=>({...node(id,op,[],'POINT',args),factRole:'DERIVED_INTERMEDIATE'});
const source=(id,x,y)=>({...node(id,'SOURCE_POINT',[],'POINT',{coordinates:[int(x),int(y)]}),factRole:'DERIVED_INTERMEDIATE'});
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false},nodes:[
  derived('O','NORMALIZATION_ORIGIN'),derived('U','NORMALIZATION_AXIS',{length:int(1)}),line('l1',-5,2,1),line('l2',-10,4,3),source('W1',-2,-4),source('W2',2,6)]};
const planOf=lineLabels=>({capability:'construction-spike-v1',caption:'평행한 두 직선이다.',mathPlan:graph,displayPoints:['O','W1','W2'],displayLines:['l1','l2'],displayCircles:[],displaySegments:[],
  hiddenPointNames:['W1','W2'],unmarkedPointNames:['W1','W2'],lineLabels,axisTickValues:{x:[],y:[]},coordinateCanvas:{width:640,height:480}});
const specError=lineLabels=>{try{specFor(planOf(lineLabels),model,'line-label-at-test');}catch(error){return String(error.message);}return null;};
let model;
const labelsOf=lineLabels=>specFor(planOf(lineLabels),model,'line-label-at-test').objects.filter(object=>object.id.endsWith('-equation'));

test('the model of two parallel source lines', async()=>{
  const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;
});

test('labelAt reaches the spec as lineAt on the line-owned equation label; without it nothing changes',()=>{
  const labels=labelsOf([{nodeId:'l1',form:'GENERAL',labelAt:'START'},{nodeId:'l2',form:'GENERAL',labelAt:0.35}]);
  assert.deepEqual(labels.map(label=>[label.id,label.lineOwned,label.lineAt]),[['l1-equation',true,'START'],['l2-equation',true,0.35]]);
  const plain=labelsOf([{nodeId:'l1',form:'GENERAL'},{nodeId:'l2',form:'SLOPE_INTERCEPT'}]);
  assert.ok(plain.every(label=>label.lineAt===undefined&&label.lineBand===undefined));assert.equal(plain[0].alternateAt.length,5);
});

test('bad labelAt values and unknown keys are refused with their own codes',()=>{
  for(const value of ['MID','start',-0.1,1.1,true,null,'0.5'])assert.equal(specError([{nodeId:'l1',form:'GENERAL',labelAt:value}]),'LINE_LABEL_AT_INVALID:l1',String(value));
  assert.equal(specError([{nodeId:'l1',form:'GENERAL',color:'red'}]),'INVALID_LINE_LABEL');
  assert.equal(specError([{nodeId:'l1',form:'GENERAL'},{nodeId:'l1',form:'GENERAL'}]),'INVALID_LINE_LABEL');
});

const observe=async({svg=FIXTURE.svg,rows})=>{
  const response=await pythonWorker({svg,transform:{originX:FIXTURE.transform.originX,originY:FIXTURE.transform.originY,sx:FIXTURE.transform.sx,sy:FIXTURE.transform.sy},fragments:FIXTURE.fragments,coordinateMode:'SOURCE_COORDINATES',lineLabels:rows},{script:OBSERVER});
  assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;
};
const rowsOf=(a,b)=>[{id:'l1-equation',owner:'l1',...(a!==undefined?{labelAt:a}:{})},{id:'l2-equation',owner:'l2',...(b!==undefined?{labelAt:b}:{})}];
const codes=result=>result.errors.map(error=>error.split(':')[0]+':'+error.split(':')[1]);
const retag=(svg,id,change)=>{const tag=new RegExp('<line id="'+id+'"[^>]*/>').exec(svg)[0];return svg.replace(tag,change(tag));};

test('the observer reads both equation labels back: owner, leader on the line, and the stated place',async()=>{
  const clean=await observe({rows:rowsOf('START','END')});
  assert.equal(clean.status,'PASS',JSON.stringify(clean.errors));
  assert.deepEqual(clean.observations.filter(row=>row.type==='LINE_LABEL').map(row=>[row.owner,row.leader]),[['l1',true],['l2',true]]);
  assert.equal((await observe({rows:rowsOf()})).status,'PASS');
});

test('a label that does not stand where the plan asks is named',async()=>{
  const swapped=await observe({rows:rowsOf('END','START')});
  assert.equal(swapped.status,'FAIL');assert.deepEqual(codes(swapped).filter(code=>code.startsWith('LINE_LABEL_NOT_AT')),['LINE_LABEL_NOT_AT:l1','LINE_LABEL_NOT_AT:l2']);
  const middle=await observe({rows:rowsOf(0.5,'END')});assert.deepEqual(codes(middle),['LINE_LABEL_NOT_AT:l1']);
  assert.ok((await observe({rows:rowsOf('MID')})).errors.includes('LINE_LABEL_AT_INVALID:l1'));
});

test('a leader that does not start on its own line, a missing label and a wrong owner are named',async()=>{
  const moved=await observe({svg:retag(FIXTURE.svg,'l2-equation-owner-leader',tag=>tag.replace(/ x1="([^"]+)"/,(m,v)=>' x1="'+(Number(v)-40)+'"')),rows:rowsOf()});
  assert.deepEqual(codes(moved),['LINE_LABEL_LEADER_NOT_ON_OWNER:l2']);
  const missing=await observe({rows:[...rowsOf(),{id:'l3-equation',owner:'l3'}]});assert.deepEqual(codes(missing),['LINE_LABEL_MISSING:l3']);
  const wrongOwner=await observe({rows:[{id:'l1-equation',owner:'l2'}]});assert.ok(wrongOwner.errors.includes('LINE_LABEL_OWNER_MISMATCH:l2'),JSON.stringify(wrongOwner.errors));
});

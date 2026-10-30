// E31 (5): planeMarks.quadrants on a coordinate construction plan (a quadrant tinted and/or named in plain Korean text). No Chrome: the spec is the unit boundary for the plan
// side; the independent plane-marks observer reads the final XML of a real composed figure (tests/e31-fixtures/quadrants-coordinate.json: four names, the second tinted LIGHT,
// the fourth MEDIUM, two lines with symbolic equations). The graph side is tests/test_quadrants_graph.py.
import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {int,node} from './construction-v1-fixture.mjs';

const OBSERVER=fileURLToPath(new URL('../production/plane-marks-observer-worker.py',import.meta.url));
const FIXTURE=JSON.parse(fs.readFileSync(new URL('./e31-fixtures/quadrants-coordinate.json',import.meta.url),'utf8'));
const line=(id,a,b,c)=>({...node(id,'SOURCE_LINE',[],'LINE',{a:int(a),b:int(b),c:int(c)}),factRole:'GIVEN'});
const derived=(id,op,args={})=>({...node(id,op,[],'POINT',args),factRole:'DERIVED_INTERMEDIATE'});
const source=(id,x,y)=>({...node(id,'SOURCE_POINT',[],'POINT',{coordinates:[int(x),int(y)]}),factRole:'DERIVED_INTERMEDIATE'});
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false},nodes:[
  derived('O','NORMALIZATION_ORIGIN'),derived('U','NORMALIZATION_AXIS',{length:int(1)}),line('l0',3,1,-1),source('F1',4,5),source('F2',-4,-5)]};
const planOf=quadrants=>({capability:'construction-spike-v1',caption:'네 사분면과 직선이다.',mathPlan:graph,displayPoints:['O','F1','F2'],displayLines:['l0'],displayCircles:[],displaySegments:[],
  hiddenPointNames:['F1','F2'],unmarkedPointNames:['F1','F2'],planeMarks:{quadrants},axisTickValues:{x:[],y:[]},coordinateCanvas:{width:640,height:600}});
let model;
const specError=quadrants=>{try{specFor(planOf(quadrants),model,'quadrants-test');}catch(error){return String(error.message);}return null;};
const objectsOf=quadrants=>specFor(planOf(quadrants),model,'quadrants-test').objects.filter(object=>object.kind==='QUADRANT');

test('the model of a line through the origin quadrants',async()=>{
  const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;
});

test('a quadrant reaches the spec as one QUADRANT object with its tone and its name',()=>{
  const objects=objectsOf([{id:'qd1',quadrant:1,label:'제1사분면'},{id:'qd2',quadrant:2,fill:'LIGHT'},{id:'qd4',quadrant:4,label:'제4사분면',fill:'MEDIUM'}]);
  assert.deepEqual(objects.map(object=>[object.id,object.quadrant,object.fill,object.labelText]),[['qd1',1,undefined,'제1사분면'],['qd2',2,'LIGHT',undefined],['qd4',4,'MEDIUM','제4사분면']]);
  assert.equal(specFor(planOf([{id:'qd1',quadrant:1,label:'제1사분면',factRole:'CONCLUSION'}]),model,'quadrants-test').displayFacts.factRolesByLabel['qd1-label'],'CONCLUSION');
});

test('bad quadrants are refused with their own codes',()=>{
  assert.equal(specError([{id:'qd',quadrant:5,label:'가'}]),'QUADRANT_INVALID:qd');
  assert.equal(specError([{id:'qd',quadrant:'1',label:'가'}]),'QUADRANT_INVALID:qd');
  assert.equal(specError([{id:'a',quadrant:1,label:'가'},{id:'b',quadrant:1,label:'나'}]),'QUADRANT_DUPLICATE:1');
  assert.equal(specError([{id:'qd',quadrant:1}]),'QUADRANT_EMPTY:qd');
  assert.equal(specError([{id:'qd',quadrant:1,fill:'DARK'}]),'QUADRANT_FILL_INVALID:qd');
  assert.equal(specError([{id:'qd',quadrant:1,label:'열세글자를넘는사분면이름이다'}]),'QUADRANT_LABEL_TOO_LONG:qd');
  assert.equal(specError([{id:'qd',quadrant:1,label:'$x$'}]),'MARK_FIELD_INVALID:quadrants.label:qd');
  assert.equal(specError([{id:'qd',quadrant:1,label:'가',color:'red'}]),'MARK_FIELD_UNKNOWN:quadrants.color');
  assert.equal(specError([{id:'qd',quadrant:1,label:'가'},{id:'qd',quadrant:2,label:'나'}]).startsWith('MARK_'),true);
});

const observe=async({svg=FIXTURE.svg,marks=FIXTURE.marks})=>{
  const response=await pythonWorker({svg,points:FIXTURE.points,marks,segments:FIXTURE.segments,transform:{originX:FIXTURE.transform.originX,originY:FIXTURE.transform.originY,sx:FIXTURE.transform.sx,sy:FIXTURE.transform.sy}},{script:OBSERVER});
  assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;
};
const codes=result=>result.errors.map(error=>error.split(':')[0]+':'+error.split(':')[1]);
const withQuadrants=quadrants=>({...FIXTURE.marks,quadrants});
const retag=(svg,id,change)=>{const tag=new RegExp('<polygon id="'+id+'"[^>]*/>').exec(svg)[0];return svg.replace(tag,change(tag));};

test('the observer reads every quadrant back: the rectangle to the end of the axes, its tone, its name inside it',async()=>{
  const clean=await observe({});assert.equal(clean.status,'PASS',JSON.stringify(clean.errors));
  assert.deepEqual(clean.observations.filter(row=>row.type==='QUADRANT').map(row=>[row.quadrant,row.fill]),[[1,null],[2,'LIGHT'],[3,null],[4,'MEDIUM']]);
  assert.equal(clean.observations.filter(row=>row.type==='QUADRANT_LABEL').length,4);
});

test('a wrong rectangle, tone or missing fill is named',async()=>{
  const moved=retag(FIXTURE.svg,'qd2-fill',tag=>tag.replace(/ points="([^"]*)"/,(m,v)=>{const p=v.split(' ').map(pair=>pair.split(','));p[2][1]=String(Number(p[2][1])-40);return ' points="'+p.map(pair=>pair.join(',')).join(' ')+'"';}));
  assert.ok(codes(await observe({svg:moved})).includes('QUADRANT_FILL_MISMATCH:qd2'));
  const tone=retag(FIXTURE.svg,'qd2-fill',tag=>tag.replace('fill="#e4e7ec"','fill="#c7ccd5"'));assert.ok(codes(await observe({svg:tone})).includes('QUADRANT_FILL_TONE_MISMATCH:qd2'));
  const missing=FIXTURE.svg.replace(/<polygon id="qd4-fill"[^>]*\/>/,'');assert.ok(codes(await observe({svg:missing})).includes('QUADRANT_FILL_MISSING:qd4'));
});

test('a name must be plain text inside its quadrant; undeclared fills and names are refused',async()=>{
  const wrongText=FIXTURE.svg.replace('id="qd1-label"','id="qd1-label" data-x="1"').replace(/(id="qd1-label"[^>]*data-text=")[^"]*"/,'$1제2사분면"');
  assert.ok(codes(await observe({svg:wrongText})).includes('LABEL_TEXT_MISMATCH:qd1-label'));
  const noFill=withQuadrants(FIXTURE.marks.quadrants.map(row=>row.id==='qd2'?{id:row.id,quadrant:row.quadrant,label:row.label}:row));
  assert.ok(codes(await observe({marks:noFill})).some(code=>code==='QUADRANT_FILL_UNDECLARED:qd2'||code.startsWith('UNDECLARED_MARK')));
  const noName=withQuadrants(FIXTURE.marks.quadrants.map(row=>row.id==='qd1'?{id:row.id,quadrant:row.quadrant,fill:'LIGHT'}:row));
  assert.ok(codes(await observe({marks:noName})).includes('QUADRANT_LABEL_UNDECLARED:qd1'));
  const swapped=withQuadrants(FIXTURE.marks.quadrants.map(row=>row.id==='qd1'?{...row,quadrant:3}:row.id==='qd3'?{...row,quadrant:1}:row));
  assert.ok(codes(await observe({marks:swapped})).includes('QUADRANT_LABEL_OUTSIDE:qd1'));
});

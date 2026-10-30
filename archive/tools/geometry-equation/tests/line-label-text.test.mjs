// E31 (2): lineLabels[].text, a free (symbolic) equation text on a displayed SOURCE_LINE: y=ax+6, x-1=0, ax+y+4=0. No Chrome: the exact reader (linear-text.mjs), the spec
// and the observer on a real composed figure (tests/e31-fixtures/free-text-coordinate-lines.json: y=ax+6 drawn for a=3/2, and y=-2x+6). Overlay lines: tests/test_free_line_labels.py.
import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {readEquation,sameLine,frac} from '../production/linear-text.mjs';
import {int,node} from './construction-v1-fixture.mjs';

const OBSERVER=fileURLToPath(new URL('../production/primitive-observer-worker.py',import.meta.url));
const FIXTURE=JSON.parse(fs.readFileSync(new URL('./e31-fixtures/free-text-coordinate-lines.json',import.meta.url),'utf8'));
const F=(n,d=1)=>frac(BigInt(n),BigInt(d));
const eq=(text,values)=>{const e=readEquation(text,values);return e&&[e.a,e.b,e.c].map(v=>v.n+'/'+v.d).join(' ');};
const code=(text,values)=>{try{readEquation(text,values);}catch(error){return error.message;}return null;};

test('the reader gives exact coefficients, symbolic texts and its own refusals',()=>{
  assert.equal(eq('y=-2x+6'),'2/1 1/1 -6/1');assert.equal(eq('x-1=0'),'1/1 0/1 -1/1');assert.equal(eq('y=-3/4x+6'),'3/4 1/1 -6/1');assert.equal(eq('2(x-1)+y=0'),'2/1 1/1 -2/1');
  assert.equal(eq('y=ax+6'),null);assert.equal(eq('ax+y+4=0'),null);assert.equal(eq('y=ax+6',{a:'3/2'}),'-3/2 1/1 -6/1');
  assert.equal(code('y=x^2'),'LINE_TEXT_NOT_LINEAR');assert.equal(code('xy=1'),'LINE_TEXT_NOT_LINEAR');assert.equal(code('y=1/x'),'LINE_TEXT_NOT_LINEAR');
  for(const text of ['y','y=','y=x=1','y=(x','x$=1','y=1/0'])assert.equal(code(text),'LINE_TEXT_INVALID',text);
  for(const values of [{x:'1'},{ab:'1'},{a:1},{a:'1/0'}])assert.equal(code('y=ax',values),'LINE_TEXT_VALUES_INVALID',JSON.stringify(values));
  const line={a:F(3),b:F(-2),c:F(12)};
  assert.ok(sameLine(readEquation('y=ax+6',{a:'3/2'}),line));assert.ok(sameLine(readEquation('-6x+4y=24'),line));assert.ok(!sameLine(readEquation('y=ax+6',{a:'2'}),line));assert.ok(!sameLine(readEquation('x=1'),line));
});

const line=(id,a,b,c)=>({...node(id,'SOURCE_LINE',[],'LINE',{a:int(a),b:int(b),c:int(c)}),factRole:'GIVEN'});
const derived=(id,op,args={})=>({...node(id,op,[],'POINT',args),factRole:'DERIVED_INTERMEDIATE'});
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false},nodes:[
  derived('O','NORMALIZATION_ORIGIN'),derived('U','NORMALIZATION_AXIS',{length:int(1)}),line('l1',3,-2,12),line('l2',2,1,-6),line('l3',1,0,-1),
  ...[['W1',-4,-3],['W2',4,8]].map(([id,x,y])=>({...node(id,'SOURCE_POINT',[],'POINT',{coordinates:[int(x),int(y)]}),factRole:'DERIVED_INTERMEDIATE'}))]};
const planOf=lineLabels=>({capability:'construction-spike-v1',caption:'두 직선과 세로선이다.',mathPlan:graph,displayPoints:['O','W1','W2'],displayLines:['l1','l2','l3'],displayCircles:[],displaySegments:[],
  hiddenPointNames:['W1','W2'],unmarkedPointNames:['W1','W2'],lineLabels,axisTickValues:{x:[],y:[]},coordinateCanvas:{width:640,height:480}});
let model;
const specError=lineLabels=>{try{specFor(planOf(lineLabels),model,'line-label-text-test');}catch(error){return String(error.message);}return null;};
const labelsOf=lineLabels=>specFor(planOf(lineLabels),model,'line-label-text-test').objects.filter(object=>object.id.endsWith('-equation'));

test('the model of two lines and a vertical line',async()=>{
  const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;
});

test('a free text reaches the spec as the label text (symbolic, with values, a vertical line) and may carry labelAt',()=>{
  const labels=labelsOf([{nodeId:'l1',text:'y=ax+6',values:{a:'3/2'}},{nodeId:'l2',text:'ax+y+4=0',labelAt:'END'},{nodeId:'l3',text:'x=1'}]);
  assert.deepEqual(labels.map(label=>[label.id,label.text,label.lineAt]),[['l1-equation','y=ax+6',undefined],['l2-equation','ax+y+4=0','END'],['l3-equation','x=1',undefined]]);
  assert.equal(labelsOf([{nodeId:'l3',form:'GENERAL'}])[0].text,'x-1=0');            // the generated form of a vertical line, as before
});

test('a text that is not the drawn line, not linear or malformed is refused with its own code',()=>{
  assert.equal(specError([{nodeId:'l1',text:'y=2x+6'}]),'LINE_LABEL_TEXT_NOT_THE_LINE:l1');
  assert.equal(specError([{nodeId:'l1',text:'y=ax+6',values:{a:'2'}}]),'LINE_LABEL_TEXT_NOT_THE_LINE:l1');
  assert.equal(specError([{nodeId:'l3',text:'x=2'}]),'LINE_LABEL_TEXT_NOT_THE_LINE:l3');
  assert.equal(specError([{nodeId:'l1',text:'y=x^2'}]),'LINE_LABEL_TEXT_NOT_LINEAR:l1');
  assert.equal(specError([{nodeId:'l1',text:'y+6'}]),'LINE_LABEL_TEXT_INVALID:l1');
  assert.equal(specError([{nodeId:'l1',text:'y=ax+6',values:{a:'1/0'}}]),'LINE_LABEL_TEXT_VALUES_INVALID:l1');
  assert.equal(specError([{nodeId:'l1',text:'y=ax+6',values:{b:'1'}}]),'LINE_LABEL_TEXT_VALUES_UNUSED:l1');
  assert.equal(specError([{nodeId:'l1',text:'y=ax+6',form:'GENERAL'}]),'INVALID_LINE_LABEL');
  assert.equal(specError([{nodeId:'l1',form:'GENERAL',values:{a:'1'}}]),'INVALID_LINE_LABEL');
  assert.equal(specError([{nodeId:'l1',text:'y=ax+6',color:'red'}]),'INVALID_LINE_LABEL');
});

const observe=async({svg=FIXTURE.svg,rows})=>{
  const response=await pythonWorker({svg,transform:{originX:FIXTURE.transform.originX,originY:FIXTURE.transform.originY,sx:FIXTURE.transform.sx,sy:FIXTURE.transform.sy},fragments:FIXTURE.fragments,lines:FIXTURE.lines,coordinateMode:'SOURCE_COORDINATES',lineLabels:rows},{script:OBSERVER});
  assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;
};
const rows=(a,b)=>[{id:'l1-equation',owner:'l1',...a},{id:'l2-equation',owner:'l2',...b}];
const GOOD=rows({text:'y=ax+6',values:{a:'3/2'}},{});
const codes=result=>result.errors.map(error=>error.split(':')[0]+':'+error.split(':')[1]);

test('the observer reads the symbolic text back glyph by glyph and compares it with the drawn line',async()=>{
  assert.equal((await observe({rows:GOOD})).status,'PASS');
  assert.equal((await observe({rows:rows({text:'y=ax+6'},{})})).status,'PASS');                 // symbolic: shown as written, not compared
  const other=await observe({rows:rows({text:'y=bx+6',values:{b:'3/2'}},{})});assert.deepEqual(codes(other),['LINE_LABEL_TEXT_MISMATCH:l1']);
  const longer=await observe({rows:rows({text:'y=ax+16'},{})});assert.deepEqual(codes(longer),['LINE_LABEL_TEXT_MISMATCH:l1']);
});

test('a text that is not the drawn line is named by the observer itself',async()=>{
  const wrongValue=await observe({rows:rows({text:'y=ax+6',values:{a:'2'}},{})});assert.deepEqual(codes(wrongValue),['LINE_LABEL_TEXT_NOT_THE_LINE:l1']);
  const wrongLine=await observe({rows:rows({text:'y=-2x+6'},{})});assert.ok(codes(wrongLine).includes('LINE_LABEL_TEXT_NOT_THE_LINE:l1'),JSON.stringify(wrongLine.errors));
  const nonlinear=await observe({rows:rows({text:'y=x^2'},{})});assert.ok(codes(nonlinear).includes('LINE_LABEL_TEXT_NOT_LINEAR:l1'),JSON.stringify(nonlinear.errors));
  const garbage=await observe({rows:rows({text:'y+6'},{})});assert.ok(codes(garbage).includes('LINE_LABEL_TEXT_INVALID:l1'),JSON.stringify(garbage.errors));
});

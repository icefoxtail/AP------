// Palette colours of displayed lines (K): planeMarks.lineColors on a coordinate construction whose radius, line coefficients and tangent points are exact
// radicals (the circle x^2+y^2=6 with the lines x+sqrt(3)y=+-2sqrt(6) and y=sqrt(3)x).
// Real SymPy worker for the model, no browser. Run with --test-concurrency=1.
import test,{before} from 'node:test';
import assert from 'node:assert/strict';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {int,node} from './construction-v1-fixture.mjs';

const identity=assetIdentity('l1_unit_exam|1','SOLUTION_VISUAL','decisive-relation');
const sqrt=n=>({kind:'expression',op:'sqrt',args:[int(n)]});
const mul=(a,b)=>({kind:'expression',op:'mul',args:[a,b]});
const neg=a=>({kind:'expression',op:'neg',args:[a]});
const derived=(id,op,inputs,type,args={})=>({...node(id,op,inputs,type,args),factRole:'DERIVED_INTERMEDIATE'});
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false},nodes:[
  derived('O','NORMALIZATION_ORIGIN',[],'POINT'),derived('X','NORMALIZATION_AXIS',[],'POINT',{length:int(1)}),
  derived('k','CIRCLE_CENTER_RADIUS',['O'],'CIRCLE',{radius:sqrt(6)}),
  derived('t1','SOURCE_LINE',[],'LINE',{a:int(1),b:sqrt(3),c:neg(mul(int(2),sqrt(6)))}),
  derived('t2','SOURCE_LINE',[],'LINE',{a:int(1),b:sqrt(3),c:mul(int(2),sqrt(6))}),
  derived('g','SOURCE_LINE',[],'LINE',{a:sqrt(3),b:int(-1),c:int(0)}),
  derived('T1','PERPENDICULAR_FOOT',['O','t1'],'POINT'),derived('T2','PERPENDICULAR_FOOT',['O','t2'],'POINT')]};
const marks={lineColors:[{lines:['t1','t2'],color:'BLUE'},{lines:['g'],color:'WARM'}]};
const CAPTION='원 x²+y²=6의 두 접선(파랑)과 원점을 지나는 직선(주황)의 접점 T1, T2.';
const planOf=(planeMarks=marks,extra={})=>({capability:'construction-spike-v1',caption:CAPTION,mathPlan:graph,
  displayPoints:['O','T1','T2'],displaySegments:[{id:'sOT1',refs:['O','T1']},{id:'sOT2',refs:['O','T2']}],displayLines:['t1','t2','g'],displayCircles:['k'],
  coordinateLabels:['T1','T2'],axisTickValues:{x:[],y:[]},coordinateCanvas:{width:520,height:480},planeMarks,...extra});
const clone=value=>JSON.parse(JSON.stringify(value));
let model;
before(async()=>{const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;});
const specOf=(planeMarks,extra)=>specFor(planOf(planeMarks,extra),model,identity.assetId);
const specError=(planeMarks,extra)=>{try{specOf(planeMarks,extra);}catch(error){return String(error.message);}assert.fail('specFor accepted the plan');};
const expectCode=(message,code)=>assert.ok(String(message).startsWith(code),`${code} expected, got ${message}`);
const with_=change=>{const copy=clone(marks);change(copy);return copy;};

test('lineColors paints exactly the named displayed lines and leaves the others as before',()=>{
  const objects=specOf().objects,byId=id=>objects.find(o=>o.id===id);
  assert.equal(byId('t1').color,'BLUE');assert.equal(byId('t2').color,'BLUE');assert.equal(byId('g').color,'WARM');
  const plain=specOf(undefined,{planeMarks:undefined}).objects;
  for(const id of ['t1','t2','g'])assert.equal(plain.find(o=>o.id===id).color,undefined);
  const partial=specOf(with_(m=>{m.lineColors=[{lines:['g'],color:'WARM'}];})).objects;
  assert.equal(partial.find(o=>o.id==='g').color,'WARM');assert.equal(partial.find(o=>o.id==='t1').color,undefined);
});

test('lineColors: unknown, undisplayed, repeated or doubly coloured lines and bad colours are refused',()=>{
  expectCode(specError(with_(m=>{m.lineColors=[{lines:['zz'],color:'BLUE'}];})),'LINE_COLOR_UNKNOWN_LINE');
  expectCode(specError(with_(m=>{m.lineColors=[{lines:['k'],color:'BLUE'}];})),'LINE_COLOR_UNKNOWN_LINE');           // a circle is not a line
  expectCode(specError(with_(m=>{m.lineColors=[{lines:['t1'],color:'BLUE'},{lines:['t1'],color:'WARM'}];})),'LINE_COLOR_DUPLICATE');
  expectCode(specError(with_(m=>{m.lineColors=[{lines:['t1'],color:'BLUE'},{lines:['g'],color:'BLUE'}];})),'LINE_COLOR_GROUP_MISMATCH');
  expectCode(specError(with_(m=>{m.lineColors[0].color='TEAL';})),'LINE_COLOR_INVALID');
  expectCode(specError(with_(m=>{m.lineColors=[];})),'LINE_COLOR_INVALID');
  expectCode(specError(with_(m=>{m.lineColors[0].lines=[];})),'LINE_COLOR_INVALID');
  expectCode(specError(with_(m=>{m.lineColors[0].bogus=1;})),'MARK_FIELD_UNKNOWN');
});

test('the caption has to name every colour used',()=>{
  expectCode(specError(marks,{caption:'원 x²+y²=6의 두 접선과 원점을 지나는 직선(주황)의 접점 T1, T2.'}),'LINE_COLOR_CAPTION_MISSING:BLUE');
  expectCode(specError(marks,{caption:'원 x²+y²=6의 두 접선(파랑)과 직선의 접점 T1, T2.'}),'LINE_COLOR_CAPTION_MISSING:WARM');
});

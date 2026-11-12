// Exact radicals in a coordinate construction (G): the radius sqrt(6), the lines x+sqrt(3)y=+-2sqrt(6), y=sqrt(3)x and their tangent points all give a finite,
// canonical spec; and a segmentLabels row without factRole is refused with its own code instead of an opaque NON_JSON_VALUE at the spec digest.
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
const planOf=(extra={})=>({capability:'construction-spike-v1',caption:'원 x²+y²=6의 두 접선과 원점을 지나는 직선의 접점 T1, T2.',mathPlan:graph,
  displayPoints:['O','T1','T2'],displaySegments:[{id:'sOT1',refs:['O','T1']},{id:'sOT2',refs:['O','T2']}],displayLines:['t1','t2','g'],displayCircles:['k'],
  coordinateLabels:['T1','T2'],axisTickValues:{x:[],y:[]},coordinateCanvas:{width:520,height:480},...extra});
let model;
before(async()=>{const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;});
const specOf=extra=>specFor(planOf(extra),model,identity.assetId);
const specError=extra=>{try{specOf(extra);}catch(error){return String(error.message);}assert.fail('specFor accepted the plan');};
const expectCode=(message,code)=>assert.ok(String(message).startsWith(code),`${code} expected, got ${message}`);

test('exact radical radius, line coefficients and tangent points give a finite, canonical spec',()=>{
  const spec=specOf();
  const text=JSON.stringify(spec);
  assert.ok(!/NaN|Infinity/.test(text));
  const circle=spec.objects.find(o=>o.id==='k');
  assert.ok(Math.abs(circle.radius-Math.sqrt(6))<1e-9);
  const point=spec.objects.find(o=>o.id==='T1');
  assert.ok(Math.abs(point.at[0]-Math.sqrt(6)/2)<1e-9&&Math.abs(point.at[1]-3*Math.sqrt(2)/2)<1e-9);
});

test('a segmentLabels row needs a valid factRole instead of failing later as an opaque NON_JSON_VALUE',()=>{
  const labelled=factRole=>({segmentLabels:[{id:'xLabel',ownerSegment:'sOT1',variable:'x',...(factRole===undefined?{}:{factRole})}]});
  expectCode(specError(labelled()),'SEGMENT_LABEL_FACT_ROLE_INVALID:xLabel');
  expectCode(specError(labelled('SECRET')),'SEGMENT_LABEL_FACT_ROLE_INVALID:xLabel');
  const spec=specOf(labelled('DERIVED_INTERMEDIATE'));
  assert.equal(spec.displayFacts.factRolesByLabel.xLabel,'DERIVED_INTERMEDIATE');
  assert.doesNotThrow(()=>JSON.stringify(spec));
});

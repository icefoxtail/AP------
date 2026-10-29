// A length between non-closed-form intersection points written with the author's exact value (E17: scalarLabels[].value), and a coordinate figure that hides
// point names and dots (E19: hiddenPointNames with a SOURCE_POINT, hiddenPointStyle NONE, unmarkedPointNames). Real SymPy/Cindy workers and real Chrome; the
// typography policy is the same FIXTURE as plane-marks.test.mjs. Run with --test-concurrency=1.
import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {requestedProfileTypographyPolicy} from '../production/display-envelope.mjs';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';
import {unmarkedPointIds} from '../production/plane-marks.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {int,node} from './construction-v1-fixture.mjs';

const rect=(width,height)=>({x:20,y:30,width,height});
const OBSERVATION={status:'PASS',synthetic:false,runtime:'playwright-chromium',profiles:[['small',126,105],['medium',174,145],['large',216,180],['full',384,320]].map(([sizeClass,width,height])=>({sizeClass,status:'PASS',imageRect:rect(width,height),naturalWidth:384,naturalHeight:320}))};
const policy=requestedProfileTypographyPolicy({requestedSizeClass:'full',intrinsicSvg:{width:384,height:320},observation:OBSERVATION});
const identity=assetIdentity('l1_unit_exam|1','SOLUTION_VISUAL','decisive-relation');
const source=(id,x,y)=>node(id,'SOURCE_POINT',[],'POINT',{coordinates:[int(x),int(y)]});
const polar=(id,center,reference,length,angle,turn='CCW')=>({...node(id,'POLAR_POINT',[center,reference],'POINT',{length:int(length),angleDeg:int(angle),turn}),factRole:'GIVEN'});
const derived=(id,op,inputs,type,args={})=>({...node(id,op,inputs,type,args),factRole:'DERIVED_INTERMEDIATE'});
const plane=nodes=>({schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes});
const composeOf=async(plan,model)=>composeConstructionCandidate({plan,model,identity,typographyPolicy:policy,browser});
const modelOf=async graph=>{const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;};
const attr=(tag,name)=>new RegExp('\\s'+name+'="([^"]*)"').exec(tag)?.[1];
const specError=(plan,model)=>{try{specFor(plan,model,identity.assetId);}catch(error){return String(error.message);}assert.fail('specFor accepted the plan');};

let browser;
before(async()=>{browser=await launchBrowser();});
after(async()=>{await browser?.close();});


// ---- E17: the length between two non-closed-form intersection points, written with the author's exact value
const circleGraph=plane([source('B',0,0),source('C',5,0),{...polar('R','C','B',8,100,'CW'),factRole:'DERIVED_INTERMEDIATE'},derived('lCR','LINE_THROUGH',['C','R'],'LINE'),derived('kB','CIRCLE_CENTER_RADIUS',['B'],'CIRCLE',{radius:int(8)}),
  derived('iA','INTERSECTION',['lCR','kB'],'POINT_SET'),{...derived('A','SELECT_POINT',['iA'],'POINT',{}),branch:{kind:'SIDE_OF_ORIENTED_LINE',refs:['B','C'],sign:1}},
  {...node('lenBC','SEGMENT_LENGTH',['B','C'],'SCALAR'),factRole:'GIVEN'},{...node('lenAB','SEGMENT_LENGTH',['B','A'],'SCALAR'),factRole:'GIVEN'}]);
const circlePlan=scalarLabels=>({capability:'construction-spike-v1',caption:'BC=5cm이고 AB=8cm이다.',mathPlan:circleGraph,displayPoints:['A','B','C'],displayLines:[],displayCircles:['kB'],
  displaySegments:[{id:'sBC',refs:['B','C']},{id:'sAB',refs:['A','B']}],coordinateCanvas:{width:640,height:480},scalarLabels});
const lengths=extra=>[{nodeId:'lenBC',ownerSegment:'sBC',prefix:'BC',unit:'cm',factRole:'GIVEN'},{nodeId:'lenAB',ownerSegment:'sAB',prefix:'AB',unit:'cm',factRole:'GIVEN',...extra}];
test('E17: scalarLabels[].value writes a SEGMENT_LENGTH that has no closed form, checked against the engine value',async()=>{
  const model=await modelOf(circleGraph);
  assert.equal(model.scalars.lenAB.exact.kind,'decimal','the construction itself has no closed form for this length');
  assert.equal(specError(circlePlan(lengths({})),model),'UNSUPPORTED_SCALAR_NOTATION');
  const composed=await composeOf(circlePlan(lengths({value:'8'})),model);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  const from=composed.svg.indexOf('id="lenAB-value"'),codes8=[...composed.svg.slice(from,composed.svg.indexOf('</svg>',from)).matchAll(/data-c="([0-9A-F]+)"/gu)].map(match=>match[1]);
  assert.deepEqual(codes8,['38','63','6D'],'the label reads 8 cm (the author text, with its unit)');
  assert.equal(specError(circlePlan(lengths({value:'9'})),model).split(':')[0],'SCALAR_LABEL_VALUE_MISMATCH');
  assert.match(specError(circlePlan(lengths({value:'9'})),model),/declared=9:computed=8/);
  for(const bad of ['eight','8.0','','2**3',8])assert.equal(specError(circlePlan(lengths({value:bad})),model).split(':')[0],'SCALAR_LABEL_VALUE_INVALID',String(bad));
  const squareRoot=circlePlan(lengths({value:'sqrt(64)'}));assert.doesNotThrow(()=>specFor(squareRoot,model,identity.assetId));
  const wrongNode=circlePlan([{...lengths({})[0],value:'5'},lengths({value:'8'})[1]]);assert.doesNotThrow(()=>specFor(wrongNode,model,identity.assetId));
});
test('E17: value is for SEGMENT_LENGTH only',async()=>{
  const graph=plane([source('B',0,0),source('C',3,0),polar('A','B','C',4,90),{...node('lenBC','SEGMENT_LENGTH',['B','C'],'SCALAR'),factRole:'GIVEN'},{...node('sq','SCALAR_SQUARE',['lenBC'],'SCALAR'),factRole:'DERIVED_INTERMEDIATE'}]);
  const model=await modelOf(graph);
  const plan={capability:'construction-spike-v1',caption:'BC의 제곱이다.',mathPlan:graph,displayPoints:['A','B','C'],displayLines:[],displayCircles:[],displaySegments:[{id:'sBC',refs:['B','C']}],coordinateCanvas:{width:640,height:380},
    scalarLabels:[{nodeId:'sq',ownerSegment:'sBC',prefix:'BC',factRole:'DERIVED_INTERMEDIATE',value:'9'}]};
  assert.equal(specError(plan,model).split(':')[0],'SCALAR_LABEL_VALUE_REQUIRES_SEGMENT_LENGTH');
});

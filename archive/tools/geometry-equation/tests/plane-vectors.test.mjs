// (G3) Plane vectors: vector names in labels (vec(a), vec(AB)), planeMarks.vectors, planeMarks.vectorOps (sum, difference, scalar multiple).
// Real SymPy/Cindy workers and real Chrome, like plane-marks.test.mjs; the typography policy is the same FIXTURE. Run with --test-concurrency=1.
import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {reconstruct} from '../production/cindy-observer.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {requestedProfileTypographyPolicy} from '../production/display-envelope.mjs';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {int,node} from './construction-v1-fixture.mjs';

const OBSERVER=fileURLToPath(new URL('../production/plane-marks-observer-worker.py',import.meta.url));
const rect=(width,height)=>({x:20,y:30,width,height});
const OBSERVATION={status:'PASS',synthetic:false,runtime:'playwright-chromium',profiles:[['small',126,105],['medium',174,145],['large',216,180],['full',384,320]].map(([sizeClass,width,height])=>({sizeClass,status:'PASS',imageRect:rect(width,height),naturalWidth:384,naturalHeight:320}))};
const policy=requestedProfileTypographyPolicy({requestedSizeClass:'full',intrinsicSvg:{width:384,height:320},observation:OBSERVATION});
const identity=assetIdentity('l1_unit_exam|1','SOLUTION_VISUAL','decisive-relation');
const source=(id,x,y)=>node(id,'SOURCE_POINT',[],'POINT',{coordinates:[int(x),int(y)]});
const clone=value=>JSON.parse(JSON.stringify(value));
const codes=report=>report.errors.map(error=>error.split(':')[0]);

// triangle A(0,0) B(6,0) C(2,4): vectors from A
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes:[source('A',0,0),source('B',6,0),source('C',2,4)]};
const planOf=(planeMarks,extra={})=>({capability:'construction-spike-v1',caption:'세 점 A, B, C이다.',mathPlan:clone(graph),displayPoints:['A','B','C'],displayLines:[],
  displaySegments:[{id:'sAB',refs:['A','B']},{id:'sAC',refs:['A','C']},{id:'sBC',refs:['B','C']}],planeMarks,...extra});

let model,browser;
before(async()=>{
  const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;
  browser=await launchBrowser();
});
after(async()=>{await browser?.close();});
const compose=async(plan,m=model)=>composeConstructionCandidate({plan,model:m,identity,typographyPolicy:policy,browser});
const observe=async(plan,svg,m=model,{points,planeMarks}={})=>{
  const prepared=await pythonWorker({action:'prepare',spec:specFor(plan,m,identity.assetId)});assert.equal(prepared.status,'OK');
  const response=await pythonWorker({action:'planeMarksAudit',svg,points:points??reconstruct(plan.mathPlan).points,marks:planeMarks??plan.planeMarks,segments:plan.displaySegments,transform:prepared.result.coordinateModel},{script:OBSERVER});
  assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;
};
const specError=(plan,m=model)=>{try{specFor(plan,m,identity.assetId);}catch(error){return String(error.message);}assert.fail('specFor accepted the plan');};
const texOf=(svg,id)=>new RegExp('<g id="'+id+'"[^>]*data-tex="([^"]*)"').exec(svg)?.[1];

// ---- feature 1: vector names in labels
test('G3-1: vec(a) and vec(AB) labels are typeset with a vector arrow and read back by the observer',async()=>{
  const marks={expressionLabels:[{id:'ta',ownerSegment:'sAB',text:'vec(a)'},{id:'tb',ownerSegment:'sAC',text:'vec(AC)'},{id:'tc',ownerSegment:'sBC',text:'2vec(a)-vec(AB)',labelAt:0.6}]};
  const plan=planOf(marks),composed=await compose(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  assert.equal(texOf(composed.svg,'ta'),'\\vec{a}');assert.equal(texOf(composed.svg,'tb'),'\\overrightarrow{AC}');assert.equal(texOf(composed.svg,'tc'),'2\\vec{a}-\\overrightarrow{AB}');
  assert.deepEqual((await observe(plan,composed.svg)).errors,[]);
  // tamper: the label says another vector than the plan, or loses its arrow
  const wrong=clone(marks);wrong.expressionLabels[0].text='vec(b)';
  assert.ok(codes(await observe(plan,composed.svg,model,{planeMarks:wrong})).includes('VECTOR_LABEL_TEX_MISMATCH'));
  const plain=composed.svg.replace('data-tex="\\vec{a}"','data-tex="a"');
  assert.ok(codes(await observe(plan,plain)).includes('VECTOR_LABEL_TEX_MISMATCH'));
  const unknown=clone(marks);unknown.expressionLabels[1].text='vec(AZ)';
  assert.ok(codes(await observe(plan,composed.svg,model,{planeMarks:unknown})).includes('VECTOR_LABEL_UNKNOWN_POINT'));
  // a free text label (textLabels) beside a point also takes a vector name
  const free=planOf({textLabels:[{id:'fl',at:'C',text:'vec(a)+vec(b)',anchor:'E'}]});const freeComposed=await compose(free);
  assert.equal(freeComposed.status,'COMPOSED',JSON.stringify(freeComposed.detail));assert.equal(texOf(freeComposed.svg,'fl'),'\\vec{a}+\\vec{b}');
});

test('G3-1: bad vector names are refused before drawing',()=>{
  const label=text=>specError(planOf({expressionLabels:[{id:'ta',ownerSegment:'sAB',text}]}));
  for(const text of ['vec()','vec(ab)','vec(vec(a))','vec(1)','vec(A)','vec(AAB)','vec(a'])assert.match(label(text),/^VECTOR_LABEL_INVALID:ta$/,text);
  assert.match(label('vec(AZ)'),/^VECTOR_LABEL_UNKNOWN_POINT:ta$/);
});

// Plane-figure marks of E8b / E12b through the real pipeline: a joined compass arc (traces span JOIN) with its order label at a named place (labelAt), a segment
// label at the end of its segment (expressionLabels labelAt), and an angle label forced onto a leader (angles labelPlacement LEADER). Real SymPy/Cindy workers and
// real Chrome; the typography policy is the same FIXTURE as plane-marks.test.mjs. Run with --test-concurrency=1.
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
const polar=(id,center,reference,length,angle,turn='CCW')=>({...node(id,'POLAR_POINT',[center,reference],'POINT',{length:int(length),angleDeg:int(angle),turn}),factRole:'GIVEN'});
const plane=nodes=>({schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes});
const composeOf=async(plan,model)=>composeConstructionCandidate({plan,model,identity,typographyPolicy:policy,browser});
const modelOf=async graph=>{const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;};
const tagOf=(svg,id)=>new RegExp('<(?:polyline|line|polygon|circle)\\s(?:[^>]*\\s)?id="'+id+'"[^>]*/>').exec(svg)?.[0];
const attr=(tag,name)=>new RegExp('\\s'+name+'="([^"]*)"').exec(tag)?.[1];
const specError=(plan,model)=>{try{specFor(plan,model,identity.assetId);}catch(error){return String(error.message);}assert.fail('specFor accepted the plan');};
const observe=async(svg,graph,planeMarks,segments,transform)=>{
  const response=await pythonWorker({action:'planeMarksAudit',svg,points:reconstruct(graph).points,marks:planeMarks,segments,transform},{script:OBSERVER});
  assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;
};
const codes=report=>report.errors.map(error=>error.split(':')[0]);

let browser;
before(async()=>{browser=await launchBrowser();});
after(async()=>{await browser?.close();});

// ---- an angle label forced onto a leader
const triangleGraph=plane([source('V',0,0),source('R',8,0),polar('T','V','R',8,70)]);
const trianglePlan=angles=>({capability:'construction-spike-v1',caption:'각 V이다.',mathPlan:triangleGraph,displayPoints:['V','R','T'],displayLines:[],displayCircles:[],
  displaySegments:[{id:'sVR',refs:['V','R']},{id:'sVT',refs:['V','T']}],coordinateCanvas:{width:560,height:420},planeMarks:{angles}});
const angleRow={id:'aV',refs:['R','V','T'],value:70,label:'70',arcs:1,factRole:'GIVEN'};

test('E12b: labelPlacement LEADER puts the label outside the angle on a leader from its own arc, and the observer reads it back',async()=>{
  const model=await modelOf(triangleGraph);
  const plain=await composeOf(trianglePlan([angleRow]),model);
  assert.equal(plain.status,'COMPOSED',JSON.stringify(plain.detail));
  assert.ok(!/data-owner-label="aV-label"/.test(plain.svg),'AUTO keeps the label inside, no leader');
  const plan=trianglePlan([{...angleRow,labelPlacement:'LEADER'}]),composed=await composeOf(plan,model);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  assert.equal(composed.renderedLayout.status,'PASS',JSON.stringify(composed.renderedLayout.errors));
  const leader=/<line\s[^>]*data-role="leader"[^>]*data-owner-label="aV-label"[^>]*\/>/.exec(composed.svg)?.[0];
  assert.ok(leader,'tied to its arc by a leader');
  const prepared=await pythonWorker({action:'prepare',spec:specFor(plan,model,identity.assetId)});assert.equal(prepared.status,'OK');
  const run=svg=>observe(svg,triangleGraph,plan.planeMarks,plan.displaySegments,prepared.result.coordinateModel);
  assert.deepEqual((await run(composed.svg)).errors,[]);
  assert.ok(codes(await run(composed.svg.replace(leader,''))).includes('ANGLE_LABEL_LEADER_MISSING'));
});

test('E12b: labelPlacement plan errors',async()=>{
  const model=await modelOf(triangleGraph);
  assert.equal(specError(trianglePlan([{...angleRow,labelPlacement:'INSIDE'}]),model),'ANGLE_LABEL_PLACEMENT_INVALID:aV');
  assert.equal(specError(trianglePlan([{...angleRow,labelPlacement:'LEADER',noLabel:true,label:undefined}]),model),'ANGLE_LABEL_PLACEMENT_NEEDS_LABEL:aV');
});

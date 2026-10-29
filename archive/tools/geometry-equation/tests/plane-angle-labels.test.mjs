// Plane-figure angle labels: an angle named by one letter (E16), angle arcs in colour groups (E18), and an angle label that finds no room inside its angle
// going outside it on a leader that starts on its own arc (E12). Real SymPy/Cindy workers and real Chrome; the typography policy is the same FIXTURE as
// plane-marks.test.mjs. Run with --test-concurrency=1.
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
const tagOf=(svg,id)=>new RegExp('<(?:polyline|line|polygon|circle)\\s(?:[^>]*\\s)?id="'+id+'"[^>]*/>').exec(svg)[0];
const attr=(tag,name)=>new RegExp('\\s'+name+'="([^"]*)"').exec(tag)?.[1];
const points=tag=>attr(tag,'points').split(' ').map(pair=>pair.split(',').map(Number));
const specError=(plan,model)=>{try{specFor(plan,model,identity.assetId);}catch(error){return String(error.message);}assert.fail('specFor accepted the plan');};

let browser;
before(async()=>{browser=await launchBrowser();});
after(async()=>{await browser?.close();});


// ---- E18: angle arcs in colour groups
const triangleGraph=plane([source('A',0,0),source('B',8,0),polar('C','A','B',6,70)]);
const trianglePlan=angles=>({capability:'construction-spike-v1',caption:'삼각형 ABC이다.',mathPlan:triangleGraph,displayPoints:['A','B','C'],displayLines:[],displayCircles:[],
  displaySegments:[{id:'sAB',refs:['A','B']},{id:'sBC',refs:['B','C']},{id:'sCA',refs:['C','A']}],coordinateCanvas:{width:640,height:420},planeMarks:{angles}});
const triangleAngles=[{id:'aA',refs:['B','A','C'],arcs:1,noLabel:true,emphasisGroup:1},{id:'aB',refs:['A','B','C'],arcs:2,noLabel:true,emphasisGroup:2},{id:'aC',refs:['B','C','A'],arcs:1,noLabel:true}];

// ---- E16: the angle named by one letter
test('E16: an angle named by one capital letter (the angle A) is written as ∠A',async()=>{
  const model=await modelOf(triangleGraph);
  const composed=await composeOf(trianglePlan([{id:'aA',refs:['B','A','C'],value:70,label:'A',labelKind:'NAME',arcs:1,factRole:'GIVEN'}]),model);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  const glyphs=id=>{const from=composed.svg.indexOf('id="'+id+'"');return [...composed.svg.slice(from,composed.svg.indexOf('</svg>',from)).matchAll(/data-c="([0-9A-F]+)"/gu)].map(match=>match[1]);};
  assert.deepEqual(glyphs('aA-label'),['2220','1D434'],'the angle sign and the letter A');
  assert.match(String(await composeOf(trianglePlan([{id:'aA',refs:['B','A','C'],value:70,label:'a',labelKind:'NAME',arcs:1,factRole:'GIVEN'}]),model).then(r=>JSON.stringify(r.detail)).catch(e=>e.message)),/ANGLE_LABEL_NAME_INVALID/);
});

test('E18: angles of one emphasisGroup draw their arcs in one colour; an angle with no group keeps the default; the observer reads it back',async()=>{
  const model=await modelOf(triangleGraph),plan=trianglePlan(triangleAngles),composed=await composeOf(plan,model);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  assert.equal(attr(tagOf(composed.svg,'aA-arc-1'),'stroke'),'#c0392b');
  for(const k of [1,2])assert.equal(attr(tagOf(composed.svg,'aB-arc-'+k),'stroke'),'#1f5fa8');
  assert.equal(attr(tagOf(composed.svg,'aC-arc-1'),'stroke'),'#111');
  assert.equal(attr(tagOf(composed.svg,'aA-sector'),'fill'),'#d9d9d9','the sector keeps the light grey fill');
  const prepared=await pythonWorker({action:'prepare',spec:specFor(plan,model,identity.assetId)});
  const run=svg=>observe(svg,triangleGraph,plan.planeMarks,plan.displaySegments,prepared.result.coordinateModel);
  const swapped=composed.svg.replace(tagOf(composed.svg,'aA-arc-1'),tagOf(composed.svg,'aA-arc-1').replace('#c0392b','#2e7d32'));
  assert.ok(codes(await run(swapped)).includes('ANGLE_EMPHASIS_COLOR_MISMATCH'));
  const painted=composed.svg.replace(tagOf(composed.svg,'aC-arc-1'),tagOf(composed.svg,'aC-arc-1').replace('#111','#c0392b'));
  assert.ok(codes(await run(painted)).includes('ANGLE_EMPHASIS_UNDECLARED'));
  assert.equal(specError(trianglePlan([{...triangleAngles[0],emphasisGroup:4}]),model),'ANGLE_EMPHASIS_GROUP_INVALID:aA');
  assert.equal(specError(trianglePlan([{...triangleAngles[0],emphasisGroup:'1'}]),model),'ANGLE_EMPHASIS_GROUP_INVALID:aA');
});
test('E18: a plan without emphasisGroup is the old figure (no colour anywhere)',async()=>{
  const model=await modelOf(triangleGraph),composed=await composeOf(trianglePlan(triangleAngles.map(({emphasisGroup,...row})=>row)),model);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.ok(!/#c0392b|#1f5fa8|#2e7d32/.test(composed.svg));
});

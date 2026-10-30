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

// ---- E12: a 20 degree angle at V with a dashed line splitting it (no clean place inside, none for a leader from the middle of its arc)
const narrowGraph=plane([source('V',0,0),source('R',6,0),polar('T','V','R',6,20),polar('M','V','R',6,10)]);
const narrowSegments=[{id:'sVR',refs:['V','R']},{id:'sVT',refs:['V','T']},{id:'sVM',refs:['V','M'],dashed:true}];
const narrowPlan=(planeMarks,extra={})=>({capability:'construction-spike-v1',caption:'20도 각을 점선이 둘로 나눈다.',mathPlan:narrowGraph,displayPoints:['V','R','T','M'],displayLines:[],displayCircles:[],
  displaySegments:narrowSegments,coordinateCanvas:{width:640,height:380},planeMarks,...extra});
const narrowMarks={angles:[{id:'a20',refs:['R','V','T'],value:20,label:'20',arcs:1,factRole:'GIVEN'}]};
const observe=async(svg,graph,planeMarks,segments,transform)=>{
  const response=await pythonWorker({action:'planeMarksAudit',svg,points:reconstruct(graph).points,marks:planeMarks,segments,transform},{script:OBSERVER});
  assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;
};
const codes=report=>report.errors.map(error=>error.split(':')[0]);

test('E12: a narrow angle with no room inside takes a leader from the end of its own arc, and every audit passes',async()=>{
  const model=await modelOf(narrowGraph),composed=await composeOf(narrowPlan(narrowMarks),model);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  assert.equal(composed.renderedLayout.status,'PASS',JSON.stringify(composed.renderedLayout.errors));
  const leader=/<line\s[^>]*data-role="leader"[^>]*data-owner-label="a20-label"[^>]*\/>/.exec(composed.svg)?.[0];
  assert.ok(leader,'the label is tied to its arc by a leader');
  // the leader starts on the arc: at the arc's radius from the vertex and within (here: at an end of) its sweep
  const arc=points(tagOf(composed.svg,'a20-arc-1')),vertex=points(tagOf(composed.svg,'a20-sector'))[0];
  const start=[Number(attr(leader,'x1')),Number(attr(leader,'y1'))],radius=Math.hypot(arc[0][0]-vertex[0],arc[0][1]-vertex[1]);
  assert.ok(Math.abs(Math.hypot(start[0]-vertex[0],start[1]-vertex[1])-radius)<1e-3);
  const angleOf=p=>Math.atan2(p[1]-vertex[1],p[0]-vertex[0]),ends=[arc[0],arc[arc.length-1]].map(angleOf);
  assert.ok(ends.some(a=>Math.abs(angleOf(start)-a)<1e-3),'at an end of the arc, where it meets a ray');
});

test('E12: the observer refuses a leader that does not start on its own arc, one that crosses a line, and a far label without a leader',async()=>{
  const model=await modelOf(narrowGraph),plan=narrowPlan(narrowMarks),composed=await composeOf(plan,model);
  const prepared=await pythonWorker({action:'prepare',spec:specFor(plan,model,identity.assetId)});assert.equal(prepared.status,'OK');
  const run=svg=>observe(svg,narrowGraph,narrowMarks,narrowSegments,prepared.result.coordinateModel);
  assert.deepEqual((await run(composed.svg)).errors,[]);
  const leader=/<line\s[^>]*data-owner-label="a20-label"[^>]*\/>/.exec(composed.svg)[0];
  const moved=composed.svg.replace(leader,leader.replace(/\sx1="[^"]*"/,' x1="'+(Number(attr(leader,'x1'))+9).toFixed(3)+'"'));
  assert.ok(codes(await run(moved)).includes('MARK_LEADER_NOT_ON_OWNER'));
  // the leader stretched to the other end of the arc crosses the dashed splitting line that runs along the bisector
  const arc=points(tagOf(composed.svg,'a20-arc-1')),start=[Number(attr(leader,'x1')),Number(attr(leader,'y1'))];
  const far=[arc[0],arc[arc.length-1]].sort((p,q)=>Math.hypot(q[0]-start[0],q[1]-start[1])-Math.hypot(p[0]-start[0],p[1]-start[1]))[0];
  const across=composed.svg.replace(leader,leader.replace(/\sx2="[^"]*"/,' x2="'+far[0].toFixed(3)+'"').replace(/\sy2="[^"]*"/,' y2="'+far[1].toFixed(3)+'"'));
  assert.ok(codes(await run(across)).includes('ANGLE_LABEL_LEADER_CROSSES'));
  // without its leader the label stands outside its angle: refused
  assert.ok(codes(await run(composed.svg.replace(leader,''))).includes('ANGLE_LABEL_NOT_IN_ANGLE'));
});

test('E12: a label that fits inside its angle keeps its old place (no leader)',async()=>{
  const model=await modelOf(triangleGraph),composed=await composeOf(trianglePlan([{id:'aA',refs:['B','A','C'],value:70,label:'70',arcs:1,factRole:'GIVEN'}]),model);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  assert.ok(!/data-owner-label="aA-label"/.test(composed.svg));
});

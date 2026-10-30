// Plane-figure labels, dimension lines and marks (E32): region names and values on a leader, tiered / inline dimension lines, arc labels on a leader and one equal mark for a whole path.
// Real SymPy/Cindy workers and real Chrome; the typography policy is the same FIXTURE as plane-marks.test.mjs. Run with --test-concurrency=1.
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
const midpoint=(id,a,b)=>({...node(id,'MIDPOINT',[a,b],'POINT',{}),factRole:'GIVEN'});
const plane=nodes=>({schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes});
const composeOf=async(plan,model)=>composeConstructionCandidate({plan,model,identity,typographyPolicy:policy,browser});
const modelOf=async graph=>{const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;};
const tagOf=(svg,id)=>new RegExp('<(?:polyline|line|polygon|circle|g)\\s(?:[^>]*\\s)?id="'+id+'"[^>]*>').exec(svg)?.[0];
const attr=(tag,name)=>new RegExp('\\s'+name+'="([^"]*)"').exec(tag)?.[1];
const specError=(plan,model)=>{try{specFor(plan,model,identity.assetId);}catch(error){return String(error.message);}assert.fail('specFor accepted the plan');};
const observe=async(svg,graph,planeMarks,segments,transform)=>{
  const response=await pythonWorker({action:'planeMarksAudit',svg,points:reconstruct(graph).points,marks:planeMarks,segments,transform},{script:OBSERVER});
  assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;
};
const codes=report=>report.errors.map(error=>error.split(':')[0]);
const transformOf=async(plan,model)=>{const prepared=await pythonWorker({action:'prepare',spec:specFor(plan,model,identity.assetId)});assert.equal(prepared.status,'OK');return prepared.result.coordinateModel;};
const expectComposed=composed=>{
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  assert.equal(composed.renderedLayout.status,'PASS',JSON.stringify(composed.renderedLayout.errors));
};

let browser;
before(async()=>{browser=await launchBrowser();});
after(async()=>{await browser?.close();});

// ---- region labels on a leader (feature 1): the rhombus of 26 팔마중 q7 with the triangle ABC filled and its area written outside, on a leader
const rhombus=plane([source('O',0,0),source('B',-3,0),source('D',3,0),source('A',0,2),source('C',0,-2),midpoint('P','B','C')]);
const rhombusSegments=[['sAB','A','B'],['sBP','B','P'],['sPC','P','C'],['sCD','C','D'],['sDA','D','A'],['sAO','A','O'],['sOC','O','C'],['sBO','B','O'],['sOD','O','D'],['sAP','A','P']].map(([id,a,b])=>({id,refs:[a,b]}));
const rhombusPlan=(regionExtra={},extra={})=>({capability:'construction-spike-v1',caption:'마름모 ABCD의 대각선과 AP로 △ABC가 나뉜다.',mathPlan:rhombus,displayPoints:['A','B','C','D','O','P'],displayLines:[],displayCircles:[],displaySegments:rhombusSegments,
  coordinateCanvas:{width:600,height:420},planeMarks:{equalLengths:[{id:'e1',count:1,segments:['sBP','sPC']}],regions:[{id:'rABC',fill:'LIGHT',label:'6',shapes:[{polygon:['A','B','P','C','O']}],...regionExtra}]},...extra});
const leaderTag=(svg,id)=>new RegExp('<line\\s[^>]*data-role="leader"[^>]*data-owner-label="'+id+'"[^>]*/>').exec(svg)?.[0];
const REGION_LEADER={labelName:'△ABC',unit:'cm^2',labelPlacement:'LEADER'};

test('E32 regions: the area of a region cut into cells is written outside it on a leader (△ABC=6cm²), every audit passes',async()=>{
  const model=await modelOf(rhombus),plan=rhombusPlan(REGION_LEADER),composed=await composeOf(plan,model);
  expectComposed(composed);
  const label=tagOf(composed.svg,'rABC-label');
  assert.equal(attr(label,'data-text'),'△ABC=6cm²','the name, the value and the unit written as one text');
  const leader=leaderTag(composed.svg,'rABC-label');assert.ok(leader,'a leader ties the label to the region');
  const run=(svg,marks=plan.planeMarks)=>transformOf(plan,model).then(transform=>observe(svg,rhombus,marks,plan.displaySegments,transform));
  assert.deepEqual((await run(composed.svg)).errors,[]);
  assert.ok(codes(await run(composed.svg.replace(leader,''))).includes('REGION_LABEL_LEADER_MISSING'));
  const off=composed.svg.replace(leader,leader.replace(/\sx1="[^"]*"/,' x1="'+(Number(attr(leader,'x1'))+40).toFixed(3)+'"'));
  assert.ok(codes(await run(off)).includes('MARK_LEADER_NOT_ON_OWNER'));
  assert.ok(codes(await run(composed.svg.replace(label,label.replace(/data-text="[^"]*"/,'data-text="△ABC=3cm²"')))).includes('LABEL_TEXT_MISMATCH'));
});

test('E32 regions: AUTO_LEADER stays inside when the value fits, and a plan without the new fields keeps its bytes',async()=>{
  const model=await modelOf(rhombus);
  const inside=await composeOf(rhombusPlan({labelPlacement:'AUTO_LEADER',label:'6'}),model);expectComposed(inside);
  assert.equal(leaderTag(inside.svg,'rABC-label'),undefined,'it fits inside: no leader');
  const plain=await composeOf(rhombusPlan({}),model),explicit=await composeOf(rhombusPlan({labelPlacement:'AUTO'}),model);
  expectComposed(plain);assert.equal(plain.svg,explicit.svg,'labelPlacement AUTO is the old figure byte for byte');
});

test('E32 regions: plan errors for the name, the unit, the value, the placement and labelAt',async()=>{
  const model=await modelOf(rhombus);
  const err=extra=>specError(rhombusPlan({...REGION_LEADER,...extra}),model);
  assert.equal(err({labelName:'△A=BC'}),'REGION_LABEL_NAME_INVALID:rABC');
  assert.equal(err({unit:'km'}),'MARK_UNIT_INVALID:regions:rABC');
  assert.equal(err({label:'1/2'}),'REGION_LABEL_VALUE_UNSUPPORTED:rABC');
  assert.equal(err({labelPlacement:'OUTSIDE'}),'REGION_LABEL_PLACEMENT_INVALID:rABC');
  assert.equal(err({labelKind:'MATH'}),'REGION_LABEL_NAME_REQUIRES_TEXT:rABC');
  assert.equal(specError(rhombusPlan({labelAt:[5,5],labelPlacement:'AUTO',label:'6'}),model),'REGION_LABEL_AT_OUTSIDE:rABC');
  assert.equal(specError(rhombusPlan({label:undefined,labelPlacement:'LEADER'}),model),'REGION_LABEL_FIELDS_NEED_LABEL:rABC');
});

// ---- dimension lines (feature 2): tiers by themselves, no extension lines, a first tier nearer or further, crossing arcs, and a length written on a segment inside the figure
const lineGraph=plane([source('A',0,0),source('B',36,0),source('C',60,0),midpoint('M','A','B'),midpoint('N','B','C')]);
const lineSegments=[{id:'sAM',refs:['A','M']},{id:'sMB',refs:['M','B']},{id:'sBN',refs:['B','N']},{id:'sNC',refs:['N','C']}];
const linePlan=(planeMarks,extra={})=>({capability:'construction-spike-v1',caption:'M, N이 각각 AB, BC의 중점이다.',mathPlan:lineGraph,displayPoints:['A','M','B','N','C'],displayLines:[],displayCircles:[],
  displaySegments:lineSegments,coordinateCanvas:{width:720,height:380},planeMarks,...extra});
const stacked=[{id:'dAB',from:'A',to:'B',label:'36',unit:'cm',side:'BELOW',offset:'AUTO'},{id:'dBC',from:'B',to:'C',label:'24',unit:'cm',side:'BELOW',offset:'AUTO'},{id:'dAC',from:'A',to:'C',label:'60',unit:'cm',side:'BELOW',offset:'AUTO'}];

test('E32 dimensions: offset AUTO stacks overlapping dimensions of one line in tiers (AB and BC share a tier, AC stands outside them)',async()=>{
  const model=await modelOf(lineGraph),plan=linePlan({dimensions:stacked}),composed=await composeOf(plan,model);
  expectComposed(composed);
  const origin=Number(attr(tagOf(composed.svg,'B'),'cy'));
  assert.ok(Math.abs(Number(attr(tagOf(composed.svg,'dAB-line'),'y1'))-(origin+24))<1e-6,'AB: tier 1');
  assert.ok(Math.abs(Number(attr(tagOf(composed.svg,'dBC-line'),'y1'))-(origin+24))<1e-6,'BC: tier 1 (its span only touches the span of AB)');
  assert.ok(Math.abs(Number(attr(tagOf(composed.svg,'dAC-line'),'y1'))-(origin+24+44))<1e-6,'AC: tier 2');
  const transform=await transformOf(plan,model);
  assert.deepEqual((await observe(composed.svg,lineGraph,plan.planeMarks,plan.displaySegments,transform)).errors,[]);
  // the observer derives the tiers itself: a fixed offset that disagrees with the drawn line is refused
  const fixed={dimensions:stacked.map(row=>row.id==='dAC'?{...row,offset:1}:row)};
  assert.ok(codes(await observe(composed.svg,lineGraph,fixed,plan.displaySegments,transform)).includes('DIMENSION_OFFSET_MISMATCH'));
});

test('E32 dimensions: extension NONE, offsetPx and an inline dimension compose and pass; plan errors',async()=>{
  const model=await modelOf(lineGraph);
  const rows=[{id:'dAB',from:'A',to:'B',label:'36',unit:'cm',side:'BELOW',style:'ARROW',extension:'NONE',offsetPx:16},{id:'dBC',from:'B',to:'C',label:'24',unit:'cm',side:'ABOVE',offsetPx:40},
    {id:'dMN',from:'M',to:'N',label:'30',unit:'cm',side:'ABOVE',style:'INLINE'}];
  const plan=linePlan({dimensions:rows}),composed=await composeOf(plan,model);
  expectComposed(composed);
  const origin=Number(attr(tagOf(composed.svg,'B'),'cy'));
  assert.equal(tagOf(composed.svg,'dAB-ext-from'),undefined);
  assert.ok(Math.abs(Number(attr(tagOf(composed.svg,'dAB-line'),'y1'))-(origin+16))<1e-6);
  assert.ok(Math.abs(Number(attr(tagOf(composed.svg,'dBC-line'),'y1'))-(origin-40))<1e-6);
  assert.ok(tagOf(composed.svg,'dMN-arrow-from')&&tagOf(composed.svg,'dMN-arrow-to')&&!tagOf(composed.svg,'dMN-line'),'an inline dimension draws two arrowheads and no line');
  const transform=await transformOf(plan,model);
  assert.deepEqual((await observe(composed.svg,lineGraph,plan.planeMarks,plan.displaySegments,transform)).errors,[]);
  const err=(change,extra)=>specError(linePlan({dimensions:[{...rows[0],...change}]},extra),model);
  assert.equal(err({offsetPx:5}),'DIMENSION_OFFSET_PX_INVALID:dAB');
  assert.equal(err({extension:'SHORT'}),'DIMENSION_EXTENSION_INVALID:dAB');
  assert.equal(err({crossArcs:'yes'}),'DIMENSION_CROSS_ARCS_INVALID:dAB');
  assert.equal(specError(linePlan({dimensions:[{id:'d',from:'A',to:'B',label:'36',side:'ABOVE',style:'INLINE',offsetPx:20}]}),model),'DIMENSION_INLINE_FIELD_INVALID:d');
  const four=['d','e','f','g'].map(id=>({id,from:'A',to:'B',label:'36',side:'ABOVE',offset:'AUTO'}));
  assert.equal(specError(linePlan({dimensions:four}),model),'DIMENSION_TIERS_EXCEEDED:g');
});


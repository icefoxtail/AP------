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

// ---- arc labels (feature 3): plain-text labels without a degree sign, and a label on a leader from its own arc, for each of several arcs of one circle
const half=plane([source('O',0,0),node('X','TRANSLATE_POINT',['O'],'POINT',{dx:int(1),dy:int(0)}),node('k','CIRCLE_CENTER_RADIUS',['O'],'CIRCLE',{radius:int(5)}),
  node('A','POLAR_POINT',['O','X'],'POINT',{length:int(5),angleDeg:int(20),turn:'CCW'}),node('B','POLAR_POINT',['O','X'],'POINT',{length:int(5),angleDeg:int(110),turn:'CCW'}),node('C','POLAR_POINT',['O','X'],'POINT',{length:int(5),angleDeg:int(160),turn:'CCW'})]);
const arcPlan=(arcs,extra={})=>({capability:'construction-spike-v1',caption:'원 O 위의 세 점 A, B, C이다.',mathPlan:half,displayPoints:['O','A','B','C'],displayLines:[],displayCircles:[],
  displaySegments:[{id:'sOA',refs:['O','A']},{id:'sOB',refs:['O','B']},{id:'sOC',refs:['O','C']}],coordinateCanvas:{width:560,height:480},planeMarks:{arcs},...extra});
const arcRows=extra=>[{id:'arcAB',circle:'k',center:'O',from:'A',to:'B',side:'MINOR',label:'3:1',labelKind:'TEXT',...extra},{id:'arcBC',circle:'k',center:'O',from:'B',to:'C',side:'MINOR',label:'호 BC',labelKind:'TEXT',...extra}];

test('E32 arcs: plain-text labels (no degree sign) on a leader from each of two arcs of one circle; every audit passes',async()=>{
  const model=await modelOf(half),plan=arcPlan(arcRows({labelPlacement:'LEADER'})),composed=await composeOf(plan,model);
  expectComposed(composed);
  assert.equal(attr(tagOf(composed.svg,'arcAB-label'),'data-text'),'3:1');
  assert.equal(attr(tagOf(composed.svg,'arcBC-label'),'data-text'),'호 BC');
  const first=leaderTag(composed.svg,'arcAB-label'),second=leaderTag(composed.svg,'arcBC-label');
  assert.ok(first&&second,'each label is tied to its own arc by a leader');
  const transform=await transformOf(plan,model),run=(svg,marks=plan.planeMarks)=>observe(svg,half,marks,plan.displaySegments,transform);
  assert.deepEqual((await run(composed.svg)).errors,[]);
  assert.ok(codes(await run(composed.svg.replace(first,''))).includes('ARC_LABEL_LEADER_MISSING'));
  // the leader of the first label moved onto the second arc is refused: it must start within its own arc
  const moved=composed.svg.replace(first,first.replace(/\sx1="[^"]*"/,' x1="'+attr(second,'x1')+'"').replace(/\sy1="[^"]*"/,' y1="'+attr(second,'y1')+'"'));
  assert.ok(codes(await run(moved)).includes('MARK_LEADER_NOT_ON_OWNER'));
});

test('E32 arcs: without labelPlacement the figure is the old one byte for byte; plan errors',async()=>{
  const model=await modelOf(half);
  const plain=await composeOf(arcPlan(arcRows({})),model),explicit=await composeOf(arcPlan(arcRows({labelPlacement:'AUTO'})),model);
  expectComposed(plain);assert.equal(plain.svg,explicit.svg);
  assert.equal(specError(arcPlan(arcRows({labelPlacement:'INSIDE'})),model),'ARC_LABEL_PLACEMENT_INVALID:arcAB');
  assert.equal(specError(arcPlan([{id:'arcAB',circle:'k',center:'O',from:'A',to:'B',side:'MINOR',labelPlacement:'LEADER'}]),model),'ARC_LABEL_PLACEMENT_NEEDS_LABEL:arcAB');
});

// ---- one equal mark for a whole path (feature 4): BD = BC with E between B and D
const tri=plane([source('B',0,0),source('C',30,0),source('D',0,30),source('E',0,10)]);
const triSegments=[{id:'sBE',refs:['B','E']},{id:'sED',refs:['E','D']},{id:'sBC',refs:['B','C']},{id:'sCD',refs:['C','D']},{id:'sCE',refs:['C','E']}];
const triPlan=(equalLengths,extra={})=>({capability:'construction-spike-v1',caption:'BD=BC인 삼각형 BCD이다.',mathPlan:tri,displayPoints:['B','C','D','E'],displayLines:[],displayCircles:[],displaySegments:triSegments,
  coordinateCanvas:{width:560,height:480},planeMarks:{equalLengths},...extra});
const equalRow=extra=>[{id:'e1',count:1,segments:[{path:['sBE','sED']},'sBC'],...extra}];

test('E32 equal marks: one mark for the whole path B-E-D (at its middle) against the side BC; every audit passes and the observer reads it',async()=>{
  const model=await modelOf(tri),plan=triPlan(equalRow({})),composed=await composeOf(plan,model);
  expectComposed(composed);
  const transform=await transformOf(plan,model),run=(svg,marks=plan.planeMarks)=>observe(svg,tri,marks,plan.displaySegments,transform);
  const report=await run(composed.svg);assert.deepEqual(report.errors,[]);
  assert.ok(report.observations.some(row=>row.type==='EQUAL'&&row.lengths.length===3||row.type==='EQUAL'),'the group was observed');
  // the tick of the path stands on the line B-D (its piece E-D, the middle of the path), not on BC twice
  const ticks=[...composed.svg.matchAll(/<line\s[^>]*data-mark="equal"[^>]*data-mark-segment="sBE"[^>]*\/>/g)];
  assert.equal(ticks.length,1);
  // the plain lengths still have to agree: BD is 30 long, so a BC of another length is refused by the plan
  const model2=await modelOf(plane([source('B',0,0),source('C',28,0),source('D',0,30),source('E',0,10)]));
  assert.match(specError(triPlan(equalRow({})),model2),/^EQUAL_MARK_LENGTH_MISMATCH:e1/);
});

test('E32 equal marks: pathMark BRACKET draws a bracket beside the path with the ticks at its middle; TICK keeps the tick on the path; the observer checks both',async()=>{
  const model=await modelOf(tri),transform=null;void transform;
  const bracket=triPlan(equalRow({pathMark:'BRACKET'})),composed=await composeOf(bracket,model);
  expectComposed(composed);
  assert.ok(tagOf(composed.svg,'e1-sBE-bracket-line')&&tagOf(composed.svg,'e1-sBE-bracket-cap-from')&&tagOf(composed.svg,'e1-sBE-bracket-cap-to'));
  const t=await transformOf(bracket,model);
  assert.deepEqual((await observe(composed.svg,tri,bracket.planeMarks,bracket.displaySegments,t)).errors,[]);
  assert.ok(codes(await observe(composed.svg,tri,triPlan(equalRow({pathMark:'TICK'})).planeMarks,bracket.displaySegments,t)).includes('EQUAL_MARK_PATH_BRACKET_UNEXPECTED'));
  const tick=triPlan(equalRow({pathMark:'TICK'})),composedTick=await composeOf(tick,model);
  expectComposed(composedTick);assert.ok(!composedTick.svg.includes('bracket'));
});

test('E32 equal marks: plan errors for paths and pathMark',async()=>{
  const model=await modelOf(tri);
  const err=entries=>specError(triPlan([{id:'e1',count:1,segments:entries}]),model);
  assert.equal(err([{path:['sBE']},'sBC']),'EQUAL_MARK_PATH_INVALID:e1');
  assert.equal(err([{path:['sBE','sCD']},'sBC']),'EQUAL_MARK_PATH_NOT_CONNECTED:e1:sCD');
  assert.equal(err([{path:['sBE','sED'],extra:1},'sBC']),'EQUAL_MARK_PATH_INVALID:e1');
  assert.equal(specError(triPlan(equalRow({pathMark:'WAVY'})),model),'EQUAL_MARK_PATH_MARK_INVALID:e1');
  assert.equal(specError(triPlan([{id:'e1',count:1,segments:['sBC','sCD'],pathMark:'TICK'}]),model),'EQUAL_MARK_PATH_MARK_INVALID:e1');
  assert.equal(specError(triPlan([],{planeMarks:{parallels:[{id:'p1',count:1,segments:[{path:['sBE','sED']},'sBC']}]}}),model),'PARALLEL_MARK_PATH_UNSUPPORTED:p1');
});

// ---- angles over their halves and relaxed ownership (feature 5): the parallelogram of 25 연향중 q14 with the whole angle D = 72 over its two halves of 36
const para=plane([source('B',0,0),source('C',8,0),node('D','POLAR_POINT',['C','B'],'POINT',{length:int(6),angleDeg:int(108),turn:'CW'}),node('A','TRANSLATE_POINT',['D'],'POINT',{dx:int(-8),dy:int(0)}),
  node('P','POLAR_POINT',['D','A'],'POINT',{length:int(1),angleDeg:int(36),turn:'CCW'}),node('lDE','LINE_THROUGH',['D','P'],'LINE'),node('lAE','PERPENDICULAR_THROUGH',['A','lDE'],'LINE'),node('E','LINE_INTERSECTION',['lDE','lAE'],'POINT')]);
const paraSegments=[['sAB','A','B'],['sBC','B','C'],['sCD','C','D'],['sDA','D','A'],['sAE','A','E'],['sED','E','D']].map(([id,a,b])=>({id,refs:[a,b]}));
const paraAngles=whole=>[{id:'aADE',refs:['A','D','E'],value:36,label:'36',equalGroup:1,arcs:1},{id:'aEDC',refs:['E','D','C'],value:36,label:'36',equalGroup:1,arcs:1},{id:'aD',refs:['A','D','C'],value:72,label:'72',arcs:1,...whole}];
const paraPlan=(angles,extra={})=>({capability:'construction-spike-v1',caption:'평행사변형 ABCD에서 DE는 ∠D의 이등분선이다.',mathPlan:para,displayPoints:['A','B','C','D','E'],displayLines:[],displayCircles:[],displaySegments:paraSegments,
  coordinateCanvas:{width:620,height:400},planeMarks:{angles},...extra});

test('E32 angles: a whole angle over its halves draws an outer ring and writes its label outside on a leader; the halves keep their labels inside; the observer reads all of it',async()=>{
  const model=await modelOf(para),plan=paraPlan(paraAngles({over:['aADE','aEDC']})),composed=await composeOf(plan,model);
  expectComposed(composed);
  assert.ok(tagOf(composed.svg,'aD-arc-1')&&!tagOf(composed.svg,'aD-sector'),'the whole angle is drawn with arcs only');
  assert.ok(leaderTag(composed.svg,'aD-label'),'its label is tied to its outer ring by a leader');
  const transform=await transformOf(plan,model),run=(svg,marks=plan.planeMarks)=>observe(svg,para,marks,plan.displaySegments,transform);
  assert.deepEqual((await run(composed.svg)).errors,[]);
  const wrong={angles:paraAngles({over:['aADE','aEDC']}).map(row=>row.id==='aD'?{...row,over:['aADE']}:row)};
  assert.deepEqual(codes(await run(composed.svg,wrong)).filter(code=>code.startsWith('ANGLE_OVER')),[],'declaring fewer halves is a different, still true claim');
  const notEnclosed={angles:paraAngles({over:['aADE','aEDC']}).map(row=>row.id==='aD'?{...row,refs:['A','D','E'],value:36}:row)};
  assert.ok(codes(await run(composed.svg,notEnclosed)).includes('ANGLE_OVER_NOT_ENCLOSED'));
});

test('E32 angles: plan errors for over and a segment label with ownership NEAREST',async()=>{
  const model=await modelOf(para);
  const err=(whole,rows)=>specError(paraPlan(rows??paraAngles(whole)),model);
  assert.equal(err({over:[]}),'ANGLE_OVER_INVALID:aD');
  assert.equal(err({over:['aD']}),'ANGLE_OVER_INVALID:aD');
  assert.equal(err({over:['nope']}),'ANGLE_OVER_INVALID:aD');
  assert.equal(err({over:['aADE','aEDC'],style:'SECTOR'}),'ANGLE_OVER_STYLE_INVALID:aD');
  assert.equal(err({over:['aADE','aEDC'],ring:1}),'ANGLE_OVER_RING_INVALID:aD');
  assert.match(err({over:['aEDC']},[{id:'aADE',refs:['A','D','E'],value:36,label:'36'},{id:'aEDC',refs:['E','D','C'],value:36,label:'36'},{id:'aD',refs:['A','D','E'],value:36,label:'36',over:['aEDC']}]),/ANGLE_OVER_NOT_ENCLOSED:aD:aEDC/);
  const label=extra=>paraPlan(paraAngles({}),{planeMarks:{expressionLabels:[{id:'t1',ownerSegment:'sBC',text:'8',unit:'cm',...extra}]}});
  assert.equal(specError(label({ownership:'LOOSE'}),model),'SEGMENT_LABEL_OWNERSHIP_INVALID:t1');
});

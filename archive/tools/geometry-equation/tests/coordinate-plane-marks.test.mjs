// Plane marks on a coordinate construction plan (SOURCE_COORDINATES with axes): the same angles, equal ticks, highlighted arcs and
// facts as PLANE_FIGURE_v1, checked by the same independent observer from the Cindy peer's points and the drawn primitives.
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
const derived=(id,op,inputs,type,args={})=>({...node(id,op,inputs,type,args),factRole:'DERIVED_INTERMEDIATE'});

// A source coordinate frame: O at the origin, A(5,0) on the x-axis, P(3,3) so angle AOP = 45 degrees exactly, F(3,0) the foot of
// the perpendicular from P, B(0,5) on the circle through A. The angle, the right angle at F, the equal halves OF=FP, the highlighted
// quarter arc AB and A on the circle are all stated facts that the observer recomputes.
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false},nodes:[
  derived('O','NORMALIZATION_ORIGIN',[],'POINT'),derived('X','NORMALIZATION_AXIS',[],'POINT',{length:int(1)}),
  source('A',5,0),source('P',3,3),source('B',0,5),
  derived('lOA','LINE_THROUGH',['O','A'],'LINE'),derived('F','PERPENDICULAR_FOOT',['P','lOA'],'POINT'),
  derived('c','CIRCLE_CENTER_RADIUS',['O'],'CIRCLE',{radius:int(5)})]};
const marks={
  angles:[{id:'aPOA',refs:['A','O','P'],value:45,label:'45'}],
  equalLengths:[{id:'eqOF',count:1,segments:['sOF','sFP']}],
  arcs:[{id:'arcAB',circle:'c',center:'O',from:'A',to:'B',side:'CCW'}],
  facts:[{kind:'ON_CIRCLE',circle:'c',points:['A']}]};
const planOf=(planeMarks,extra={})=>({capability:'construction-spike-v1',caption:'좌표평면 위의 두 점 A, P와 각 AOP이다.',mathPlan:graph,
  displayPoints:['O','A','P','B','F'],displayLines:[],displayCircles:['c'],coordinateCanvas:{width:640,height:480},
  displaySegments:[{id:'sOA',refs:['O','A']},{id:'sOP',refs:['O','P']},{id:'sOF',refs:['O','F']},{id:'sFP',refs:['F','P'],dashed:true}],
  rightAngles:[{id:'raF',refs:['O','F','P']}],axisTickValues:{x:[],y:[]},planeMarks,...extra});
const clone=value=>JSON.parse(JSON.stringify(value));

let model,browser,composed,transform;
before(async()=>{
  const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;
  browser=await launchBrowser();
  composed=await composeConstructionCandidate({plan:planOf(marks),model,identity,typographyPolicy:policy,browser});
  const prepared=await pythonWorker({action:'prepare',spec:specFor(planOf(marks),model,identity.assetId)});assert.equal(prepared.status,'OK');transform=prepared.result.coordinateModel;
});
after(async()=>{await browser?.close();});
const observe=async(svg,{points,planeMarks=marks}={})=>{
  const response=await pythonWorker({action:'planeMarksAudit',svg,points:points??reconstruct(graph).points,marks:planeMarks,segments:planOf(marks).displaySegments,transform},{script:OBSERVER});
  assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;
};
const codes=report=>report.errors.map(error=>error.split(':')[0]);
const tagOf=(svg,id)=>new RegExp('<(?:polyline|line|polygon|circle)\\s(?:[^>]*\\s)?id="'+id+'"[^>]*/>').exec(svg)[0];
const retag=(svg,id,change)=>{const tag=tagOf(svg,id);return svg.replace(tag,change(tag));};
const shiftPoints=(dx,dy,last=false)=>tag=>{const attribute=/\spoints="([^"]*)"/.exec(tag);const pairs=attribute[1].split(' ').map(pair=>pair.split(',').map(Number));
  return tag.replace(attribute[0],' points="'+pairs.map(([x,y],i)=>(!last||i===pairs.length-1?[x+dx,y+dy]:[x,y]).map(v=>v.toFixed(6)).join(',')).join(' ')+'"');};
const rotate=(degrees)=>tag=>{const attribute=/\spoints="([^"]*)"/.exec(tag);const pairs=attribute[1].split(' ').map(pair=>pair.split(',').map(Number));
  const [vx,vy]=pairs[0],t=degrees*Math.PI/180,rotated=pairs.slice(1).map(([x,y])=>{const dx=x-vx,dy=y-vy;return[vx+dx*Math.cos(t)-dy*Math.sin(t),vy+dx*Math.sin(t)+dy*Math.cos(t)];});
  return tag.replace(attribute[0],' points="'+[pairs[0],...rotated].map(pair=>pair.map(v=>v.toFixed(6)).join(',')).join(' ')+'"');};
const specError=(planeMarks,extra={})=>{try{specFor(planOf(planeMarks,extra),model,identity.assetId);}catch(error){return String(error.message);}assert.fail('specFor accepted the marks');};

test('the coordinate model keeps the source frame and has axes',()=>{
  assert.equal(model.coordinateMode,'SOURCE_COORDINATES');
  assert.deepEqual(model.points.P.approximation,[3,3]);
  assert.deepEqual(model.points.F.approximation,[3,0]);
});

test('a coordinate figure with plane marks composes; the same observer reads every mark back from the final SVG',()=>{
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  assert.match(composed.svg,/data-role="axis"/);
  const rows=Object.fromEntries(composed.staticAudit.planeMarks.observations.filter(row=>row.id).map(row=>[row.id,row]));
  assert.ok(Math.abs(rows.aPOA.drawnDegrees-45)<1e-6);assert.equal(rows.aPOA.style,'SECTOR');
  assert.equal(rows.eqOF.type,'EQUAL');assert.equal(rows.arcAB.type,'ARC');assert.ok(Math.abs(rows.arcAB.drawnDegrees-90)<1e-6);
  assert.ok(composed.svg.includes('id="aPOA-label"'));
  assert.equal((composed.svg.match(/data-mark="angle"/g)||[]).length,2);                                                  // the sector and its one arc
  assert.match(tagOf(composed.svg,'raF'),/<polyline/);
  assert.equal((composed.svg.match(/data-mark="equal"/g)||[]).length,2);
  assert.equal((composed.svg.match(/data-mark="arc"/g)||[]).length,1);
  assert.match(tagOf(composed.svg,'sFP'),/stroke-dasharray/);
});

test('the angle sector is a light fill from the vertex to the outermost arc, beneath the axes and every stroke',()=>{
  const pointsOf=id=>{const m=/\spoints="([^"]*)"/.exec(tagOf(composed.svg,id));return m[1].split(' ').map(pair=>pair.split(',').map(Number));};
  const wedge=pointsOf('aPOA-sector'),outer=pointsOf('aPOA-arc-1'),v=wedge[0];
  assert.match(tagOf(composed.svg,'aPOA-sector'),/data-role="angleSector"/);assert.match(tagOf(composed.svg,'aPOA-sector'),/fill="#d9d9d9"/);
  assert.ok(wedge.slice(1).every(p=>Math.abs(Math.hypot(p[0]-v[0],p[1]-v[1])-Math.hypot(outer[0][0]-v[0],outer[0][1]-v[1]))<1e-6));
  const sectorAt=composed.svg.indexOf('id="aPOA-sector"');
  for(const stroke of ['sOA','sOP','aPOA-arc-1','aPOA-label'])assert.ok(sectorAt<composed.svg.indexOf('id="'+stroke+'"'),'the fill precedes '+stroke);
});

test('tamper: a rotated sector, a shifted arc, a moved tick and a raised fill make the observer fail',async()=>{
  assert.deepEqual((await observe(composed.svg)).errors,[]);
  assert.ok(codes(await observe(retag(composed.svg,'aPOA-sector',rotate(8)))).includes('ANGLE_SECTOR_RAY_MISMATCH'));
  assert.ok(codes(await observe(retag(composed.svg,'aPOA-arc-1',shiftPoints(7,0)))).includes('ANGLE_ARC_NOT_AT_VERTEX'));
  assert.ok(codes(await observe(retag(composed.svg,'arcAB',shiftPoints(5,0)))).includes('ARC_NOT_ON_CIRCLE'));
  const tick=/\sid="(eqOF-sOF-1)"/.exec(composed.svg)[1];
  assert.ok(codes(await observe(retag(composed.svg,tick,tag=>tag.replace(/\sy1="[^"]*"/,m=>' y1="'+(Number(m.slice(5,-1))+9)+'"').replace(/\sy2="[^"]*"/,m=>' y2="'+(Number(m.slice(5,-1))+9)+'"')))).includes('EQUAL_MARK_NOT_ON_SEGMENT'));
  const sector=tagOf(composed.svg,'aPOA-sector');
  const raised=composed.svg.replace(sector,'').replace('</svg>',sector+'</svg>');
  assert.ok(codes(await observe(raised)).includes('ANGLE_SECTOR_NOT_BENEATH_STROKES'));
});

test('the observer recomputes the angle from the peer points, not from the statement',async()=>{
  const wrong=clone(marks);wrong.angles[0].value=50;assert.ok(codes(await observe(composed.svg,{planeMarks:wrong})).includes('ANGLE_MARK_FACT_MISMATCH'));
  const fewer=clone(marks);fewer.equalLengths=[];assert.ok(codes(await observe(composed.svg,{planeMarks:fewer})).includes('UNDECLARED_MARK'));
  const points=reconstruct(graph).points;points.P=[4,3];                                              // the peer's P is elsewhere than the drawn sector
  const moved=codes(await observe(composed.svg,{points}));assert.ok(moved.includes('ANGLE_MARK_FACT_MISMATCH')||moved.includes('ANGLE_ARC_RAY_MISMATCH'),moved.join());
});

test('error codes: false facts, and marks outside a plane or coordinate figure, are refused explicitly',()=>{
  const with_=change=>{const copy=clone(marks);change(copy);return copy;};
  assert.ok(specError(with_(m=>{m.angles[0].value=60;})).startsWith('ANGLE_MARK_FACT_MISMATCH'));
  assert.ok(specError(with_(m=>{m.arcs[0].center='A';})).startsWith('ARC_CENTER_MISMATCH'));
  assert.ok(specError(with_(m=>{m.equalLengths[0].segments=['sOA','sFP'];})).startsWith('EQUAL_MARK_LENGTH_MISMATCH'));
  const constructed={...graph,realization:{recipeId:'SSS_POSITIVE_SIDE_v1',unit:'source-length',reflectionEquivalent:true}};
  const plainSegments=planOf(marks).displaySegments.map(segment=>({id:segment.id,refs:segment.refs}));
  assert.throws(()=>specFor({...planOf(marks),mathPlan:constructed,displaySegments:plainSegments},model,identity.assetId),/PLANE_MARKS_REQUIRE_PLANE_FIGURE/);
  const graphPlan={capability:'polynomial-spike-v1',caption:'graph',graphPlan:{family:'polynomial',coefficients:['0','1'],domain:[-1,1],viewport:[-2,2,-2,2],planeMarks:{angles:[]}}};
  assert.throws(()=>specFor({...graphPlan,planeMarks:{angles:[]}},model,identity.assetId),/PLANE_MARKS_UNSUPPORTED_ON_GRAPH/);
});

// A 30 degree wedge is too narrow for a value label beside the arc: the label slides out along the bisector until it clears both rays, and a
// MATH label names the angle by its own symbol (5theta) instead of writing a degree value.
test('a narrow coordinate angle carries a symbol label inside the wedge',async()=>{
  const narrow={schemaVersion:'construction-spike-v1',realization:{recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false},nodes:[
    derived('O','NORMALIZATION_ORIGIN',[],'POINT'),derived('U','NORMALIZATION_AXIS',[],'POINT',{length:int(1)}),
    source('X',6,0),{...node('P','POLAR_POINT',['O','X'],'POINT',{length:int(6),angleDeg:int(30),turn:'CCW'}),factRole:'GIVEN'}]};
  const plan={capability:'construction-spike-v1',caption:'30도 각',mathPlan:narrow,displayPoints:['O','X','P'],
    displaySegments:[{id:'sOP',refs:['O','P']}],coordinateCanvas:{width:640,height:480},axisTickValues:{x:[],y:[]},
    planeMarks:{angles:[{id:'aXOP',refs:['X','O','P'],value:30,label:'5θ',labelKind:'MATH'}]}};
  const response=await pythonWorker({action:'construction',graph:narrow},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));
  const composedNarrow=await composeConstructionCandidate({plan,model:response.result,identity,typographyPolicy:policy,browser});
  assert.equal(composedNarrow.status,'COMPOSED',JSON.stringify(composedNarrow.detail));
  assert.equal(composedNarrow.staticAudit.planeMarks.status,'PASS',JSON.stringify(composedNarrow.staticAudit.planeMarks.errors));
  const row=composedNarrow.staticAudit.planeMarks.observations.find(observation=>observation.id==='aXOP');
  assert.ok(Math.abs(row.drawnDegrees-30)<1e-6);
  const at=composedNarrow.svg.indexOf('id="aXOP-label"'),fragment=composedNarrow.svg.slice(at,composedNarrow.svg.indexOf('</g></g>',at));
  assert.ok(fragment.includes('data-c="1D703"'),'the label is the theta symbol');                 // U+1D703, mathematical italic theta
  assert.ok(!fragment.includes('data-c="2218"'),'a MATH label writes no degree sign');             // U+2218, the degree ring
});

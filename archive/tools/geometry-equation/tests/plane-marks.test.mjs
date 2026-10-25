// Plane-figure marks (middle-school stage 1): POLAR_POINT, the axis-free PLANE_FIGURE_v1 mode, angle arcs, equal ticks, parallel arrows,
// expression labels, highlighted circle arcs, and the independent observer (with tamper cases). Real SymPy/Cindy workers and real Chrome;
// the typography policy is the same FIXTURE as construction-candidate-svg-v1.test.mjs (not an Archive observation). Run with --test-concurrency=1.
import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {reconstruct,compareReconstruction} from '../production/cindy-observer.mjs';
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
const polar=(id,center,reference,length,angle,turn='CCW',factRole='GIVEN')=>({...node(id,'POLAR_POINT',[center,reference],'POINT',{length:int(length),angleDeg:int(angle),turn}),factRole});
const derived=(id,op,inputs,type,args={})=>({...node(id,op,inputs,type,args),factRole:'DERIVED_INTERMEDIATE'});

// Isosceles trapezoid ABCD, AD // BC: B(0,0), C(6,0); A at distance 5 from B at 40 degrees (no closed form: computed to high precision);
// D is A reflected in the perpendicular bisector of BC. Angle B = angle C = 40 degrees, AB = CD, AD // BC.
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes:[
  source('B',0,0),source('C',6,0),polar('A','B','C',5,40),
  derived('M','MIDPOINT',['B','C'],'POINT'),derived('lBC','LINE_THROUGH',['B','C'],'LINE'),derived('vM','PERPENDICULAR_THROUGH',['M','lBC'],'LINE'),
  {...node('D','LINE_REFLECTION',['A','vM'],'POINT'),factRole:'GIVEN'}]};
const marks={
  angles:[{id:'aB',refs:['C','B','A'],value:40,label:'40',equalGroup:1,arcs:2},{id:'aC',refs:['D','C','B'],label:'x',factRole:'CONCLUSION',equalGroup:1,arcs:2}],
  equalLengths:[{id:'e1',count:1,segments:['sAB','sCD']}],
  parallels:[{id:'p1',count:1,segments:['sAD','sBC']}],
  expressionLabels:[{id:'tBC',ownerSegment:'sBC',text:'6'}]};
const planOf=planeMarks=>({capability:'construction-spike-v1',caption:'각 B=40°인 등변사다리꼴 ABCD이다.',mathPlan:graph,
  displayPoints:['B','C','A','D'],displayLines:[],
  displaySegments:[{id:'sAB',refs:['A','B']},{id:'sBC',refs:['B','C']},{id:'sCD',refs:['C','D']},{id:'sAD',refs:['A','D']}],planeMarks});
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
const tagOf=(svg,id)=>new RegExp('<(?:polyline|line|polygon)\\s(?:[^>]*\\s)?id="'+id+'"[^>]*/>').exec(svg)[0];
const retag=(svg,id,change)=>{const tag=tagOf(svg,id);return svg.replace(tag,change(tag));};
const shiftPoints=(dx,dy,last=false)=>tag=>{const attribute=/\spoints="([^"]*)"/.exec(tag);const pairs=attribute[1].split(' ').map(pair=>pair.split(',').map(Number));
  return tag.replace(attribute[0],' points="'+pairs.map(([x,y],i)=>(!last||i===pairs.length-1?[x+dx,y+dy]:[x,y]).map(v=>v.toFixed(6)).join(',')).join(' ')+'"');};
const shiftLine=(dx,dy)=>tag=>[['x1',dx],['x2',dx],['y1',dy],['y2',dy]].reduce((text,[name,delta])=>{const attribute=new RegExp('\\s'+name+'="([^"]*)"').exec(text);return text.replace(attribute[0],` ${name}="${(Number(attribute[1])+delta).toFixed(6)}"`);},tag);
const specError=planeMarks=>{try{specFor(planOf(planeMarks),model,identity.assetId);}catch(error){return String(error.message);}assert.fail('specFor accepted the marks');};

test('POLAR_POINT: a non-special angle is computed to high precision and the Cindy peer agrees',()=>{
  const A=model.points.A.approximation;
  assert.ok(Math.abs(A[0]-5*Math.cos(40*Math.PI/180))<1e-13&&Math.abs(A[1]-5*Math.sin(40*Math.PI/180))<1e-13);
  assert.equal(model.points.A.exact[0].kind,'decimal');            // no fake closed form
  assert.equal(model.coordinateMode,'CONSTRUCTED_REALIZATION');
  const peer=reconstruct(graph);assert.equal(compareReconstruction(model,peer).status,'PASS');
  assert.ok(Math.hypot(peer.points.A[0]-A[0],peer.points.A[1]-A[1])<1e-9);
});

test('axis-free plane figure with marks composes; the plane-marks observer reads every mark back from the final SVG',()=>{
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  assert.ok(!/data-role="(axis|tick)"|model-x-axis/.test(composed.svg),'no axes, ticks or unit marks');
  const rows=Object.fromEntries(composed.staticAudit.planeMarks.observations.filter(row=>row.id).map(row=>[row.id,row]));
  assert.ok(Math.abs(rows.aB.drawnDegrees-40)<1e-6&&rows.aB.arcs===2);assert.ok(Math.abs(rows.aC.drawnDegrees-40)<1e-6);
  assert.equal(rows.aB.style,'SECTOR');assert.equal(rows.tBC.type,'EXPRESSION_LABEL');
  for(const id of ['aB-label','aC-label','tBC'])assert.ok(composed.svg.includes('id="'+id+'"'),id);
  assert.equal((composed.svg.match(/data-mark="equal"/g)||[]).length,2);assert.equal((composed.svg.match(/data-mark="parallel"/g)||[]).length,2);
});

test('every angle sector is a light fill whose boundary is the outermost arc, beneath all strokes and labels',()=>{
  const pointsOf=id=>{const m=/\spoints="([^"]*)"/.exec(tagOf(composed.svg,id));return m[1].split(' ').map(pair=>pair.split(',').map(Number));};
  for(const [id,radiusId] of [['aB','aB-arc-2'],['aC','aC-arc-2']]){
    const sector=tagOf(composed.svg,id+'-sector'),outer=pointsOf(radiusId),wedge=pointsOf(id+'-sector');
    assert.match(sector,/data-role="angleSector"/);assert.match(sector,/fill="#d9d9d9"/);assert.match(sector,/stroke="none"/);
    assert.equal(wedge.length,outer.length+1,'the wedge samples the arc stroke it fills');
    const v=wedge[0];const radius=Math.hypot(outer[0][0]-v[0],outer[0][1]-v[1]);                       // the outermost stroke's radius
    assert.ok(wedge.slice(1).every(p=>Math.abs(Math.hypot(p[0]-v[0],p[1]-v[1])-radius)<1e-6),'the fill boundary is exactly the outer arc');
    const mine=composed.svg.indexOf('id="'+id+'-sector"');
    for(const stroke of ['sAB','sBC','sCD','sAD',id+'-arc-1',id+'-arc-2',id+'-label'])assert.ok(mine<composed.svg.indexOf('id="'+stroke+'"'),'the fill precedes '+stroke);
  }
  const wedges=[pointsOf('aB-sector'),pointsOf('aC-sector')];                                                // equalGroup 1: identical marks
  assert.deepEqual(wedges[0].length,wedges[1].length);
  const r=pts=>{const v=pts[0];return Math.hypot(pts[1][0]-v[0],pts[1][1]-v[1]);};assert.ok(Math.abs(r(wedges[0])-r(wedges[1]))<1e-6);
  assert.equal((composed.svg.match(/data-role="angleSector"/g)||[]).length,2,'one sector per angle mark');
});

test('style ARC keeps stroke-only arcs; the observer refuses a sector it did not expect and a missing one',async()=>{
  const arcMarks=clone(marks);arcMarks.angles.forEach(row=>{row.style='ARC';});
  const arcComposed=await composeConstructionCandidate({plan:planOf(arcMarks),model,identity,typographyPolicy:policy,browser});
  assert.equal(arcComposed.status,'COMPOSED',JSON.stringify(arcComposed.detail));
  assert.equal(arcComposed.staticAudit.planeMarks.status,'PASS',JSON.stringify(arcComposed.staticAudit.planeMarks.errors));
  assert.ok(!arcComposed.svg.includes('-sector"'),'ARC draws no fill');
  assert.equal((arcComposed.svg.match(/data-mark="angle"/g)||[]).length,4);                                // two angles x two arcs
  assert.ok(codes(await observe(composed.svg,{planeMarks:arcMarks})).includes('ANGLE_SECTOR_UNEXPECTED'));
  assert.ok(codes(await observe(arcComposed.svg,{planeMarks:marks})).includes('ANGLE_SECTOR_MISSING'));
});

test('tamper: a rotated sector, the wrong side, a wrong radius and a raised fill make the observer fail',async()=>{
  const pointsOf=(svg,id)=>{const m=/\spoints="([^"]*)"/.exec(tagOf(svg,id));return m[1].split(' ').map(pair=>pair.split(',').map(Number));};
  const rewrite=(svg,id,change)=>retag(svg,id,tag=>{const attribute=/\spoints="([^"]*)"/.exec(tag);const pairs=pointsOf(svg,id);return tag.replace(attribute[0],' points="'+change(pairs).map(pair=>pair.map(v=>v.toFixed(6)).join(',')).join(' ')+'"');});
  const rotate=(deg,onlyArc=true)=>pairs=>{const [vx,vy]=pairs[0],t=deg*Math.PI/180;return onlyArc?[pairs[0],...pairs.slice(1).map(([x,y])=>{const dx=x-vx,dy=y-vy;return[vx+dx*Math.cos(t)-dy*Math.sin(t),vy+dx*Math.sin(t)+dy*Math.cos(t)];})]:pairs;};
  const scale=factor=>pairs=>{const [vx,vy]=pairs[0];return[pairs[0],...pairs.slice(1).map(([x,y])=>[vx+(x-vx)*factor,vy+(y-vy)*factor])];};
  assert.ok(codes(await observe(rewrite(composed.svg,'aB-sector',rotate(8)))).includes('ANGLE_SECTOR_RAY_MISMATCH'));
  assert.ok(codes(await observe(rewrite(composed.svg,'aB-sector',scale(1.3)))).includes('ANGLE_SECTOR_RADIUS_MISMATCH'));
  const reversed=rewrite(composed.svg,'aB-sector',pairs=>[pairs[0],...pairs.slice(1).reverse()]);
  const flipped=codes(await observe(reversed));assert.ok(flipped.includes('ANGLE_SECTOR_SIDE_MISMATCH'),flipped.join());
  const sector=tagOf(composed.svg,'aB-sector');
  const raised=composed.svg.replace(sector,'').replace('</svg>',sector+'</svg>');
  assert.ok(codes(await observe(raised)).includes('ANGLE_SECTOR_NOT_BENEATH_STROKES'));
});

test('the genuine SVG passes the standalone observer, and a wrong stated value or an undeclared mark fails it',async()=>{
  assert.deepEqual((await observe(composed.svg)).errors,[]);
  const wrong=clone(marks);wrong.angles[0].value=47;assert.ok(codes(await observe(composed.svg,{planeMarks:wrong})).includes('ANGLE_MARK_FACT_MISMATCH'));
  const fewer=clone(marks);fewer.parallels=[];assert.ok(codes(await observe(composed.svg,{planeMarks:fewer})).includes('UNDECLARED_MARK'));
});

test('tamper: moving an angle arc, a tick, a parallel arrow, a point or a label makes the observer fail',async()=>{
  const arcId='aB-arc-1',tickId=/id="(e1-sAB-1)"/.exec(composed.svg)[1],arrowId=/id="(p1-[A-Za-z]+-1)"/.exec(composed.svg)[1];
  assert.ok(codes(await observe(retag(composed.svg,arcId,shiftPoints(7,0)))).includes('ANGLE_ARC_NOT_AT_VERTEX'));
  const dragged=codes(await observe(retag(composed.svg,'aC-arc-1',shiftPoints(0,-10,true))));
  assert.ok(dragged.includes('ANGLE_ARC_RAY_MISMATCH')||dragged.includes('ANGLE_ARC_NOT_AT_VERTEX'),dragged.join());
  assert.ok(codes(await observe(retag(composed.svg,tickId,shiftLine(0,9)))).includes('EQUAL_MARK_NOT_ON_SEGMENT'));
  assert.ok(codes(await observe(retag(composed.svg,arrowId,shiftPoints(0,6,true)))).includes('PARALLEL_MARK_ARROW_NOT_ALONG_SEGMENT'));
  const points=reconstruct(graph).points;points.A=[points.A[0]-1.2,points.A[1]];                   // the peer's A is elsewhere than the drawn mark says
  const moved=codes(await observe(composed.svg,{points}));assert.ok(moved.includes('ANGLE_MARK_FACT_MISMATCH')||moved.includes('ANGLE_ARC_RAY_MISMATCH'),moved.join());
  // a label dragged onto a drawn line
  const label=/<g id="tBC"[^>]*transform="translate\(([-\d.]+) ([-\d.]+)\)"/.exec(composed.svg);
  const onLine=composed.svg.replace(label[0],label[0].replace(`translate(${label[1]} ${label[2]})`,`translate(${Number(label[1])} ${Number(label[2])-1000})`));
  assert.ok(codes(await observe(onLine)).some(code=>code==='MARK_LABEL_OVERLAPS'||code==='SEGMENT_LABEL_AMBIGUOUS_OWNER'||code==='MARK_LEADER_NOT_ON_OWNER'||code==='MARK_LEADER_NOT_ON_LABEL'),'a label moved away from its segment');
});

test('error codes: false facts and unsupported shapes are refused with explicit codes',()=>{
  const with_=change=>{const copy=clone(marks);change(copy);return copy;};
  expectCode(specError(with_(m=>{m.angles[0].value=45;})),'ANGLE_MARK_FACT_MISMATCH');
  expectCode(specError(with_(m=>{delete m.angles[0].label;delete m.angles[0].value;})),'ANGLE_MARK_LABEL_REQUIRED');
  expectCode(specError(with_(m=>{m.angles[0].refs=['C','B','Z'];})),'DISPLAY_ANNOTATION_POINT_NOT_VISIBLE');
  expectCode(specError(with_(m=>{m.angles[0].refs=['C','B','C'];})),'ANGLE_MARK_DEGENERATE');
  expectCode(specError(with_(m=>{m.angles[1].arcs=1;})),'ANGLE_EQUAL_GROUP_ARC_COUNT');
  expectCode(specError(with_(m=>{m.angles[0].style='FILL';})),'ANGLE_MARK_STYLE_INVALID');
  expectCode(specError(with_(m=>{m.angles[0].style='ARC';})),'ANGLE_EQUAL_GROUP_STYLE_MISMATCH');
  expectCode(specError(with_(m=>{m.angles[1].equalGroup=2;m.angles[1].arcs=2;m.angles[0].equalGroup=3;m.angles[0].arcs=2;})),'ANGLE_EQUAL_GROUP_AMBIGUOUS');
  expectCode(specError(with_(m=>{m.equalLengths[0].segments=['sAB','sBC'];})),'EQUAL_MARK_LENGTH_MISMATCH');
  expectCode(specError(with_(m=>{m.parallels[0].segments=['sAB','sBC'];})),'PARALLEL_MARK_NOT_PARALLEL');
  expectCode(specError(with_(m=>{m.parallels[0].count=3;})),'MARK_COUNT_INVALID');
  expectCode(specError(with_(m=>{m.expressionLabels[0].ownerSegment='sXY';})),'MARK_TARGET_UNKNOWN');
  expectCode(specError(with_(m=>{m.expressionLabels[0].id='aB';})),'MARK_ID_DUPLICATE');
  expectCode(specError(with_(m=>{m.angles[0].bogus=1;})),'MARK_FIELD_UNKNOWN');
  expectCode(specError(with_(m=>{m.circles=[];})),'MARK_FIELD_UNKNOWN');
  expectCode(specError(with_(m=>{m.arcs=[{id:'arc1',circle:'nope',center:'B',from:'A',to:'C'}];})),'MARK_TARGET_UNKNOWN');
  const notPlane=planOf(marks);notPlane.mathPlan={...graph,realization:undefined,nodes:graph.nodes.filter(n=>!/^(M|lBC|vM|D|A)$/.test(n.id)).concat([source('A',1,1)])};delete notPlane.mathPlan.realization;
  assert.throws(()=>specFor({...notPlane,displayPoints:['B','C','A'],displaySegments:[{id:'sBC',refs:['B','C']}],planeMarks:{expressionLabels:[{id:'t',ownerSegment:'sBC',text:'6'}]}},model,identity.assetId),/PLANE_MARKS_REQUIRE_PLANE_FIGURE|UNKNOWN|INVALID|REQUIRED/);
  const styled=planOf(marks);styled.displaySegments[0].arrow='SIDEWAYS';expectCode((()=>{try{specFor(styled,model,identity.assetId);}catch(error){return error.message;}return 'accepted';})(),'DISPLAY_SEGMENT_STYLE_INVALID');
});
const expectCode=(message,code)=>assert.ok(String(message).startsWith(code),`${code} expected, got ${message}`);

test('engine refuses what the author declares but the points do not show: an arc whose end is off the circle',async()=>{
  const circleGraph={...graph,nodes:[...graph.nodes,derived('k','CIRCLE_CENTER_RADIUS',['B'],'CIRCLE',{radius:int(5)})]};
  const circleModel=(await pythonWorker({action:'construction',graph:circleGraph},{timeoutMs:90000})).result;
  const plan={...planOf({arcs:[{id:'arc1',circle:'k',center:'B',from:'A',to:'C'}]}),mathPlan:circleGraph};
  try{specFor(plan,circleModel,identity.assetId);assert.fail('accepted');}catch(error){expectCode(error.message,'ARC_ENDPOINT_NOT_ON_CIRCLE:C');}   // C is 6 from B, the circle has radius 5
});

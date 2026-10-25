// Construction traces (작도 흔적 호): compass arcs of one declared radius around the intersections they produce, their optional
// construction-order labels, and the independent observer (with tamper cases). Also the regular-polygon recipe (POLAR_POINT + equal
// marks). Real SymPy/Cindy workers and real Chrome; the typography policy is the same FIXTURE as plane-marks.test.mjs.
// Run with --test-concurrency=1.
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
const polar=(id,center,reference,length,angle,turn='CCW',factRole='GIVEN')=>({...node(id,'POLAR_POINT',[center,reference],'POINT',{length:int(length),angleDeg:int(angle),turn}),factRole});
const derived=(id,op,inputs,type,args={})=>({...node(id,op,inputs,type,args),factRole:'DERIVED_INTERMEDIATE'});
const rational=(numerator,denominator)=>({kind:'rational',numerator:String(numerator),denominator:String(denominator)});
const polarAngle=(id,center,reference,length,angleDeg,turn='CCW',factRole='GIVEN')=>({...node(id,'POLAR_POINT',[center,reference],'POINT',{length:int(length),angleDeg,turn}),factRole});

// A triangle built by compass: B(0,0), C(6,0); A is the upper intersection of the circles centred B (radius 5) and C (radius 4).
// The visible traces are the two arcs of those circles around A, with the construction order 1 beside the first.
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes:[
  source('B',0,0),source('C',6,0),
  derived('cB','CIRCLE_CENTER_RADIUS',['B'],'CIRCLE',{radius:int(5)}),
  derived('cC','CIRCLE_CENTER_RADIUS',['C'],'CIRCLE',{radius:int(4)}),
  derived('roots','INTERSECTION',['cB','cC'],'POINT_SET'),
  {...node('A','SELECT_POINT',['roots'],'POINT',{}),factRole:'GIVEN',branch:{kind:'SIDE_OF_ORIENTED_LINE',refs:['B','C'],sign:1}}]};
const marks={
  traces:[
    {id:'tB',center:'B',radius:{point:'A'},through:['A'],spanDeg:36,label:'1',factRole:'GIVEN'},
    {id:'tC',center:'C',radius:{segment:'sCA'},through:['A'],spanDeg:36,factRole:'GIVEN'}]};
const planOf=planeMarks=>({capability:'construction-spike-v1',caption:'컴퍼스로 두 호를 그려 두 원의 교점 A를 잡아 삼각형 ABC를 작도한다.',mathPlan:graph,
  displayPoints:['B','C','A'],displayLines:[],
  displaySegments:[{id:'sAB',refs:['A','B']},{id:'sBC',refs:['B','C']},{id:'sCA',refs:['C','A']}],planeMarks});
const clone=value=>JSON.parse(JSON.stringify(value));

// A regular pentagon by the documented recipe: every vertex is POLAR_POINT(O, A, R, 72k); sides and angles are declared equal.
const pentagonGraph=(()=>{
  const nodes=[source('O',0,0),derived('X','TRANSLATE_POINT',['O'],'POINT',{dx:int(1),dy:int(0)}),source('A',4,0)];
  ['B','C','D','E'].forEach((id,k)=>nodes.push(polar(id,'O','X',4,72*(k+1))));
  return {schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes};
})();
const pentagonPlan={capability:'construction-spike-v1',caption:'정오각형 ABCDE이다.',mathPlan:pentagonGraph,
  displayPoints:['O','A','B','C','D','E'],displayLines:[],
  displaySegments:[{id:'sAB',refs:['A','B']},{id:'sBC',refs:['B','C']},{id:'sCD',refs:['C','D']},{id:'sDE',refs:['D','E']},{id:'sEA',refs:['E','A']}],
  planeMarks:{
    equalLengths:[{id:'e1',count:1,segments:['sAB','sBC','sCD','sDE','sEA']}],
    angles:[['aA','E','A','B'],['aB','A','B','C'],['aC','B','C','D'],['aD','C','D','E'],['aE','D','E','A']].map(([id,p,v,n])=>({id,refs:[p,v,n],arcs:1,equalGroup:1,style:'ARC',noLabel:true}))}};

// A regular heptagon by the same recipe with the exact fraction 360/7 (the survey's 정칠각형 case): each vertex is POLAR_POINT(O, X, R, 360k/7).
const heptagonGraph=(()=>{
  const nodes=[source('O',0,0),derived('X','TRANSLATE_POINT',['O'],'POINT',{dx:int(1),dy:int(0)}),source('A',4,0)];
  ['B','C','D','E','F','G'].forEach((id,k)=>nodes.push(polarAngle(id,'O','X',4,rational(360*(k+1),7))));
  return {schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes};
})();
const heptagonNames=['A','B','C','D','E','F','G'];
const heptagonPlan={capability:'construction-spike-v1',caption:'정칠각형 ABCDEFG이다.',mathPlan:heptagonGraph,
  displayPoints:['O',...heptagonNames],displayLines:[],
  displaySegments:heptagonNames.map((name,k)=>({id:'s'+name+heptagonNames[(k+1)%7],refs:[name,heptagonNames[(k+1)%7]]})),
  planeMarks:{
    equalLengths:[{id:'e1',count:1,segments:heptagonNames.map((name,k)=>'s'+name+heptagonNames[(k+1)%7])}],
    angles:heptagonNames.map((name,k)=>({id:'a'+name,refs:[heptagonNames[(k+6)%7],name,heptagonNames[(k+1)%7]],arcs:1,equalGroup:1,style:'ARC',noLabel:true}))}};

// Rays and a line through four collinear points (the survey's 직선·반직선 items): a line by arrow BOTH and rays by arrow END whose tip is a
// hidden, translated beyond-end helper point. The observer must still read every arrowhead tip back from the drawn segment's own end.
const rayGraph={schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes:[
  source('A',0,0),source('B',3,0),source('C',6,0),source('D',9,0),derived('E','TRANSLATE_POINT',['D'],'POINT',{dx:int(2),dy:int(0)})]};
const rayPlan={capability:'construction-spike-v1',caption:'직선 l 위에 네 점 A, B, C, D가 있다.',mathPlan:rayGraph,
  displayPoints:['A','B','C','D','E'],hiddenPointNames:['E'],displayLines:[],
  displaySegments:[{id:'l',refs:['A','E'],arrow:'BOTH'},{id:'rBC',refs:['B','E'],arrow:'END'},{id:'rCB',refs:['C','A'],arrow:'END'},{id:'sAB',refs:['A','B']}],
  planeMarks:{}};

let model,browser,composed,transform;
before(async()=>{
  const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;
  browser=await launchBrowser();
  composed=await composeConstructionCandidate({plan:planOf(marks),model,identity,typographyPolicy:policy,browser});
  const prepared=await pythonWorker({action:'prepare',spec:specFor(planOf(marks),model,identity.assetId)});assert.equal(prepared.status,'OK');transform=prepared.result.coordinateModel;
});
after(async()=>{await browser?.close();});
const observe=async(svg,{points,planeMarks=marks,segments=planOf(marks).displaySegments}={})=>{
  const response=await pythonWorker({action:'planeMarksAudit',svg,points:points??reconstruct(graph).points,marks:planeMarks,segments,transform},{script:OBSERVER});
  assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;
};
const codes=report=>report.errors.map(error=>error.split(':')[0]);
const tagOf=(svg,id)=>new RegExp('<(?:polyline|line|polygon)\\s(?:[^>]*\\s)?id="'+id+'"[^>]*/>').exec(svg)[0];
const rewriteTag=(svg,id,change)=>{const tag=tagOf(svg,id);return svg.replace(tag,change(tag));};
const scalePoints=(factor,aroundFirst=true)=>tag=>{const attribute=/\spoints="([^"]*)"/.exec(tag);const pairs=attribute[1].split(' ').map(pair=>pair.split(',').map(Number));const [cx,cy]=aroundFirst?pairs[0]:[0,0];
  return tag.replace(attribute[0],' points="'+pairs.map(([x,y])=>[cx+(x-cx)*factor,cy+(y-cy)*factor].map(v=>v.toFixed(6)).join(',')).join(' ')+'"');};
const rotateArcAbout=(center,degrees)=>tag=>{const attribute=/\spoints="([^"]*)"/.exec(tag);const pairs=attribute[1].split(' ').map(pair=>pair.split(',').map(Number));const t=degrees*Math.PI/180,[cx,cy]=center;
  return tag.replace(attribute[0],' points="'+pairs.map(([x,y])=>{const dx=x-cx,dy=y-cy;return [cx+dx*Math.cos(t)-dy*Math.sin(t),cy+dx*Math.sin(t)+dy*Math.cos(t)].map(v=>v.toFixed(6)).join(',');}).join(' ')+'"');};
const specError=planeMarks=>{try{specFor(planOf(planeMarks),model,identity.assetId);}catch(error){return String(error.message);}assert.fail('specFor accepted the traces');};
const expectCode=(message,code)=>assert.ok(String(message).startsWith(code),`${code} expected, got ${message}`);

test('the two compass arcs reach the same intersection A and the observer reads centre, radius, span and thinness back from the SVG',()=>{
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  const rows=composed.staticAudit.planeMarks.observations.filter(row=>row.type==='TRACE');
  const byId=Object.fromEntries(rows.map(row=>[row.id,row]));
  assert.ok(Math.abs(byId.tB.radius-5)<1e-9&&Math.abs(byId.tC.radius-4)<1e-9);
  assert.equal(byId.tB.spanDeg,36);assert.deepEqual(byId.tB.through,['A']);assert.deepEqual(byId.tC.through,['A']);
  assert.equal((composed.svg.match(/data-mark="trace"/g)||[]).length,2);
  const arc=tagOf(composed.svg,'tB-1');
  assert.match(arc,/data-role="traceArc"/);assert.match(arc,/stroke-width="1(?:\.0)?"/);assert.ok(!/stroke-dasharray/.test(arc));assert.match(arc,/fill="none"/);
  assert.ok(composed.svg.includes('id="tB-label"'),'construction order 1 is written');
  assert.ok(!composed.svg.includes('id="tC-label"'),'a trace without label has none');
});

test('the construction order digit is a real glyph the observer compares with the plan',async()=>{
  assert.deepEqual((await observe(composed.svg)).errors,[]);
  const wrong=clone(marks);wrong.traces[0].label='2';
  assert.ok(codes(await observe(composed.svg,{planeMarks:wrong})).includes('TRACE_LABEL_MISMATCH'));
});

test('tamper: an arc of the wrong radius, off its intersection, dashed or thick is refused',async()=>{
  assert.ok(codes(await observe(rewriteTag(composed.svg,'tB-1',scalePoints(1.15)))).includes('TRACE_ARC_RADIUS_MISMATCH'));
  const screenOf=([x,y])=>[transform.originX+x*transform.sx,transform.originY-y*transform.sy];
  assert.ok(codes(await observe(rewriteTag(composed.svg,'tC-1',rotateArcAbout(screenOf([6,0]),25)))).includes('TRACE_ARC_DOES_NOT_PASS_THROUGH'));
  const dashed=rewriteTag(composed.svg,'tB-1',tag=>tag.replace(/stroke-width="1(?:\.0)?"/,'stroke-width="1" stroke-dasharray="4 3"'));
  assert.ok(codes(await observe(dashed)).includes('TRACE_ARC_DASHED'));
  const thick=rewriteTag(composed.svg,'tB-1',tag=>tag.replace(/stroke-width="1(?:\.0)?"/,'stroke-width="3"'));
  assert.ok(codes(await observe(thick)).includes('TRACE_ARC_TOO_THICK'));
  const removed=composed.svg.replace(tagOf(composed.svg,'tB-1'),'');
  const missing=codes(await observe(removed));assert.ok(missing.includes('TRACE_ARC_MISSING')||missing.includes('TRACE_ARC_COUNT_MISMATCH'),missing.join());
});

test('tamper: a different declared radius or through point, and an undeclared trace, are refused',async()=>{
  const wider=clone(marks);wider.traces[0].radius={point:'C'};
  const wide=codes(await observe(composed.svg,{planeMarks:wider}));assert.ok(wide.includes('TRACE_ARC_RADIUS_MISMATCH'),wide.join());
  const elsewhere=clone(marks);elsewhere.traces[0].through=['C'];
  const off=codes(await observe(composed.svg,{planeMarks:elsewhere}));assert.ok(off.includes('TRACE_ARC_DOES_NOT_PASS_THROUGH')||off.includes('TRACE_ARC_RADIUS_MISMATCH'),off.join());
  const fewer=clone(marks);fewer.traces=fewer.traces.slice(0,1);
  assert.ok(codes(await observe(composed.svg,{planeMarks:fewer})).includes('UNDECLARED_MARK'));
});

test('error codes: a trace must name a real radius and intersections that lie exactly on it',()=>{
  const with_=change=>{const copy=clone(marks);change(copy);return copy;};
  expectCode(specError(with_(m=>{m.traces[0].through=['C'];})),'TRACE_TARGET_NOT_ON_ARC');
  expectCode(specError(with_(m=>{m.traces[0].radius={point:'B'};})),'TRACE_RADIUS_INVALID');
  expectCode(specError(with_(m=>{m.traces[0].radius={segment:'sBC'};m.traces[0].through=['A'];})),'TRACE_TARGET_NOT_ON_ARC');
  expectCode(specError(with_(m=>{m.traces[0].through=['B'];})),'TRACE_TARGETS_DEGENERATE');
  expectCode(specError(with_(m=>{m.traces[0].spanDeg=200;})),'TRACE_SPAN_INVALID');
  expectCode(specError(with_(m=>{m.traces[0].label='0';})),'TRACE_LABEL_INVALID');
  expectCode(specError(with_(m=>{m.traces[0].radius={circle:'cB'};})),'TRACE_RADIUS_INVALID');
  expectCode(specError(with_(m=>{m.traces[0].bogus=1;})),'MARK_FIELD_UNKNOWN');
  expectCode(specError(with_(m=>{m.traces[0].id='tC';})),'MARK_ID_DUPLICATE');
});

test('regular polygon recipe: POLAR_POINT plus equal-side and equal-angle marks composes and the observer agrees',async()=>{
  const response=await pythonWorker({action:'construction',graph:pentagonGraph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));
  const pentagon=await composeConstructionCandidate({plan:pentagonPlan,model:response.result,identity,typographyPolicy:policy,browser});
  assert.equal(pentagon.status,'COMPOSED',JSON.stringify(pentagon.detail));
  assert.equal(pentagon.staticAudit.planeMarks.status,'PASS',JSON.stringify(pentagon.staticAudit.planeMarks.errors));
  const points=response.result.points;
  const sides=[['A','B'],['B','C'],['C','D'],['D','E'],['E','A']].map(([p,q])=>Math.hypot(points[p].approximation[0]-points[q].approximation[0],points[p].approximation[1]-points[q].approximation[1]));
  assert.ok(sides.every(length=>Math.abs(length-sides[0])<1e-9),'POLAR_POINT gives equal sides');
  const rows=pentagon.staticAudit.planeMarks.observations.filter(row=>row.type==='EQUAL'||row.type==='ANGLE');
  assert.ok(rows.some(row=>row.type==='EQUAL'&&row.id==='e1'));
  assert.equal(rows.filter(row=>row.type==='ANGLE').length,5);
});

test('the same recipe draws a regular heptagon from the exact fraction 360/7',async()=>{
  const response=await pythonWorker({action:'construction',graph:heptagonGraph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));
  const heptagon=await composeConstructionCandidate({plan:heptagonPlan,model:response.result,identity,typographyPolicy:policy,browser});
  assert.equal(heptagon.status,'COMPOSED',JSON.stringify(heptagon.detail));
  assert.equal(heptagon.staticAudit.planeMarks.status,'PASS',JSON.stringify(heptagon.staticAudit.planeMarks.errors));
  const points=response.result.points;
  const sides=heptagonNames.map((name,k)=>{const next=heptagonNames[(k+1)%7];return Math.hypot(points[name].approximation[0]-points[next].approximation[0],points[name].approximation[1]-points[next].approximation[1]);});
  assert.ok(sides.every(length=>Math.abs(length-sides[0])<1e-9),'360/7 gives equal sides');
});

test('rays and a line: arrowheads tip exactly on the drawn ends, including a beyond-end hidden helper point',async()=>{
  const response=await pythonWorker({action:'construction',graph:rayGraph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));
  const rays=await composeConstructionCandidate({plan:rayPlan,model:response.result,identity,typographyPolicy:policy,browser});
  assert.equal(rays.status,'COMPOSED',JSON.stringify(rays.detail));
  assert.equal(rays.staticAudit.planeMarks.status,'PASS',JSON.stringify(rays.staticAudit.planeMarks.errors));
  assert.equal((rays.svg.match(/data-mark="arrow"/g)||[]).length,4);
  for(const id of ['l-arrow-start','l-arrow-end','rBC-arrow-end','rCB-arrow-end'])assert.ok(rays.svg.includes('id="'+id+'"'),id+' is drawn');
  const points=reconstruct(rayGraph).points;
  assert.deepEqual((await observe(rays.svg,{points,planeMarks:{},segments:rayPlan.displaySegments})).errors,[]);
  const shoved=rewriteTag(rays.svg,'rBC-arrow-end',tag=>{const attribute=/\spoints="([^"]*)"/.exec(tag);
    const pairs=attribute[1].split(' ').map(pair=>pair.split(',').map(Number));
    return tag.replace(attribute[0],' points="'+pairs.map(([x,y])=>[x+7,y].map(v=>v.toFixed(6)).join(',')).join(' ')+'"');});
  const codes=await observe(shoved,{points,planeMarks:{},segments:rayPlan.displaySegments});
  assert.ok(codes.errors.map(error=>error.split(':')[0]).includes('SEGMENT_ARROW_TIP_OFF_END'),JSON.stringify(codes.errors));
});

// Plane-figure region fills (middle-school stage 2a): planeMarks.regions colours a region bounded by lines and circular arcs; the independent observer
// recomputes the boundary from the Cindy peer's points and reads the final SVG path (tamper cases included). Real SymPy/Cindy workers and real Chrome;
// the typography policy is the same FIXTURE as plane-marks.test.mjs (not an Archive observation). Run with --test-concurrency=1.
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
const derived=(id,op,inputs,type,args={})=>({...node(id,op,inputs,type,args),factRole:'DERIVED_INTERMEDIATE'});

// Circle k (centre O, radius 5); A(30), B(150), C(210), D(330) degrees on it. A and C are opposite ends of a diameter.
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes:[
  source('O',0,0),derived('X','TRANSLATE_POINT',['O'],'POINT',{dx:int(1),dy:int(0)}),{...node('k','CIRCLE_CENTER_RADIUS',['O'],'CIRCLE',{radius:int(5)}),factRole:'GIVEN'},
  polar('A','O','X',5,30),polar('B','O','X',5,150),polar('C','O','X',5,210),polar('D','O','X',5,330)]};
const marks={regions:[
  {id:'rg1',fill:'LIGHT',label:'S',shapes:[{sector:{center:'O',from:'A',to:'B'}}],holes:[{polygon:['O','A','B']}]},      // a circular segment: sector minus triangle
  {id:'rg2',fill:'MEDIUM',shapes:[{sector:{center:'O',from:'C',to:'D'}}]}]};                                           // a sector
const planOf=planeMarks=>({capability:'construction-spike-v1',caption:'원 O에서 활꼴 AB와 부채꼴 OCD를 색칠했다.',mathPlan:graph,
  displayPoints:['O','A','B','C','D'],displayLines:[],displayCircles:['k'],
  displaySegments:[['sOA','O','A'],['sOB','O','B'],['sAB','A','B'],['sOC','O','C'],['sOD','O','D']].map(([id,a,b])=>({id,refs:[a,b]})),planeMarks});
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
const pathTag=(svg,id)=>new RegExp('<path\\s(?:[^>]*\\s)?id="'+id+'"[^>]*/>').exec(svg)[0];
const retag=(svg,id,change)=>{const tag=pathTag(svg,id);return svg.replace(tag,change(tag));};
const redraw=(svg,id,change)=>retag(svg,id,tag=>{const d=/\sd="([^"]*)"/.exec(tag);return tag.replace(d[0],` d="${change(d[1])}"`);});
const specError=(planeMarks,plan=planOf(planeMarks))=>{try{specFor(plan,model,identity.assetId);}catch(error){return String(error.message);}assert.fail('specFor accepted the regions');};
const expectCode=(message,code)=>assert.ok(String(message).startsWith(code),`${code} expected, got ${message}`);
const with_=change=>{const copy=clone(marks);change(copy);return copy;};

test('regions compose: one even-odd path per region, drawn beneath every stroke, and the observer reads them back from the final SVG',()=>{
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  const rows=composed.staticAudit.planeMarks.observations.filter(row=>row.type==='REGION');
  assert.deepEqual(rows.map(row=>row.id),['rg1','rg2']);assert.equal(rows[0].loops,2);assert.equal(rows[1].loops,1);
  assert.match(pathTag(composed.svg,'rg1'),/fill-rule="evenodd"/);assert.match(pathTag(composed.svg,'rg1'),/stroke="none"/);
  assert.ok(/A[\d.]+ [\d.]+ 0 [01] [01] /.test(pathTag(composed.svg,'rg1')),'arcs are exact svg arcs');
  const first=composed.svg.indexOf('id="rg1"');assert.ok(first>0&&first<composed.svg.indexOf('id="k"')&&first<composed.svg.indexOf('id="sAB"'),'fill precedes strokes');
  assert.ok(composed.svg.includes('id="rg1-label"'));
});

test('the genuine SVG passes the standalone observer; a region the plan does not declare, or a wrong fill, fails it',async()=>{
  assert.deepEqual((await observe(composed.svg)).errors,[]);
  const fewer=clone(marks);fewer.regions=fewer.regions.slice(0,1);assert.ok(codes(await observe(composed.svg,{planeMarks:fewer})).includes('UNDECLARED_MARK'));
  const lighter=clone(marks);lighter.regions[1].fill='LIGHT';assert.ok(codes(await observe(composed.svg,{planeMarks:lighter})).includes('REGION_FILL_MISMATCH'));
});

test('tamper: a moved vertex, a wrong arc side, a flipped sweep, a raised fill, a dragged label or a missing boundary make the observer fail',async()=>{
  // vertex: the first L endpoint of the segment region moved 3 px
  const moved=redraw(composed.svg,'rg1',d=>d.replace(/L([-\d.]+) ([-\d.]+)/,(_,x,y)=>`L${Number(x)+3} ${y}`));
  assert.ok(codes(await observe(moved)).includes('REGION_VERTEX_MISMATCH'));
  // the arc drawn on the other side of its chord (large flag flipped keeps the endpoints, moves the centre)
  const wrongSide=redraw(composed.svg,'rg2',d=>d.replace(/(A[\d.]+ [\d.]+ 0 )([01])/,(_,head,flag)=>head+(flag==='1'?'0':'1')));
  assert.ok(codes(await observe(wrongSide)).includes('REGION_ARC_SIDE_MISMATCH'),'wrong arc side');
  const flipped=redraw(composed.svg,'rg1',d=>d.replace(/(A[\d.]+ [\d.]+ 0 [01] )([01])/,(_,head,flag)=>head+(flag==='1'?'0':'1')));
  assert.ok(codes(await observe(flipped)).includes('REGION_ARC_SIDE_MISMATCH'),'flipped sweep');
  const radius=redraw(composed.svg,'rg2',d=>d.replace(/A([\d.]+) ([\d.]+)/,(_,r)=>`A${Number(r)*1.1} ${Number(r)*1.1}`));
  assert.ok(codes(await observe(radius)).includes('REGION_ARC_RADIUS_MISMATCH'));
  // drawn above the strokes
  const tag=pathTag(composed.svg,'rg1'),raised=composed.svg.replace(tag,'').replace('</svg>',tag+'</svg>');
  assert.ok(codes(await observe(raised)).includes('REGION_NOT_BENEATH_STROKES'));
  // the circle that draws the arc removed: the boundary is not drawn
  const circle=/<circle\s(?:[^>]*\s)?id="k"[^>]*\/>/.exec(composed.svg)[0];
  assert.ok(codes(await observe(composed.svg.replace(circle,''))).includes('REGION_BOUNDARY_NOT_DRAWN'));
  // label dragged out of the region
  const label=/<g id="rg1-label"[^>]*transform="translate\(([-\d.]+) ([-\d.]+)\)"/.exec(composed.svg);
  const dragged=composed.svg.replace(label[0],label[0].replace(`translate(${label[1]} ${label[2]})`,`translate(${Number(label[1])+90} ${Number(label[2])+170})`));
  assert.ok(codes(await observe(dragged)).includes('REGION_LABEL_OUTSIDE'));
  // the peer's B is elsewhere than the drawn vertex says
  const points=reconstruct(graph).points;points.B=[points.B[0]+0.5,points.B[1]];
  assert.ok(codes(await observe(composed.svg,{points})).includes('REGION_VERTEX_MISMATCH'));
});

test('error codes: open, crossing, ambiguous, undrawn and malformed regions are refused with explicit codes',()=>{
  expectCode(specError(with_(m=>{m.regions[0]={id:'r',shapes:[{loop:{start:'O',steps:[{to:'A'},{to:'B'}]}}]};})),'REGION_NOT_CLOSED');
  expectCode(specError(with_(m=>{m.regions[0]={id:'r',shapes:[{polygon:['B','C','D']}]};})),'REGION_BOUNDARY_UNKNOWN');
  expectCode(specError(with_(m=>{m.regions[0]={id:'r',shapes:[{sector:{center:'O',from:'A',to:'C'}}]};})),'REGION_ARC_SIDE_AMBIGUOUS');
  expectCode(specError(with_(m=>{m.regions[0]={id:'r',shapes:[{polygon:['A','B','C']}]};})),'REGION_BOUNDARY_UNKNOWN');
  expectCode(specError(with_(m=>{m.regions[0]={id:'r',shapes:[{sector:{center:'A',from:'B',to:'C'}}]};})),'REGION_ARC_ENDPOINT_NOT_ON_CIRCLE');
  expectCode(specError(with_(m=>{m.regions[0].fill='HATCH';})),'REGION_FILL_UNSUPPORTED');
  expectCode(specError(with_(m=>{m.regions[0].bogus=1;})),'REGION_FIELD_UNKNOWN');
  expectCode(specError(with_(m=>{m.regions[0].shapes=[];})),'REGION_FIELD_INVALID');
  expectCode(specError(with_(m=>{m.regions[0].shapes=[{polygon:['O','A']}];})),'REGION_FIELD_INVALID');
  expectCode(specError(with_(m=>{m.regions[1].id='rg1';})),'REGION_ID_DUPLICATE');
  expectCode(specError(with_(m=>{m.regions[0].holes=[{polygon:['O','C','D']}];})),'REGION_HOLE_OUTSIDE');
  expectCode(specError(with_(m=>{m.regions[0].shapes=[{sector:{center:'O',from:'A',to:'B'}},{polygon:['O','A','B']}];m.regions[0].holes=[];})),'REGION_SHAPES_OVERLAP');
  expectCode(specError(with_(m=>{m.regions[0]={id:'r',shapes:[{polygon:['A','B','D','C']}]};})),'REGION_SELF_INTERSECTING');
  expectCode(specError(with_(m=>{m.regions[0].label='';})),'REGION_FIELD_INVALID');
  // a region needs a plane figure
  const notPlane=planOf(marks);notPlane.mathPlan={...graph,realization:undefined};delete notPlane.mathPlan.realization;
  assert.throws(()=>specFor({...notPlane,planeMarks:marks},model,identity.assetId),/PLANE_MARKS_REQUIRE_PLANE_FIGURE|UNKNOWN|INVALID|REQUIRED/);
});

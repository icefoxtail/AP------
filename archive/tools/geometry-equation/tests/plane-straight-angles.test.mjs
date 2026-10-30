// Straight angles, angle sums and right-angle expression labels on a plane figure (E30).
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
const polar=(id,center,reference,length,angle,turn='CCW')=>({...node(id,'POLAR_POINT',[center,reference],'POINT',{length:int(length),angleDeg:int(angle),turn}),factRole:'GIVEN'});
const translate=(id,from,dx,dy)=>({...node(id,'TRANSLATE_POINT',[from],'POINT',{dx:int(dx),dy:int(dy)}),factRole:id==='Xr'?'DERIVED_INTERMEDIATE':'GIVEN'});
const clone=value=>JSON.parse(JSON.stringify(value));

// 23 연향중 2학기 중간 중1 q21: the line B-O-E, the rays OA (145 deg), OF (55 deg) with OA perpendicular to OD, angle BOA = 35 and FOE = 55
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes:[
  source('O',0,0),translate('Xr','O',1,0),translate('B','O',-6,0),translate('E','O',6,0),polar('A','O','Xr',5,145),polar('F','O','Xr',5,55),polar('D','O','Xr',5,325),polar('C','O','Xr',5,235)]};
const marks={angles:[
  {id:'aBOA',refs:['B','O','A'],value:35,label:'x+20',labelKind:'DEGREE',arcs:1},
  {id:'aFOE',refs:['F','O','E'],value:55,label:'3x+10',labelKind:'DEGREE',arcs:1},
  {id:'aBOE',refs:['B','O','E'],straight:true,side:'ABOVE',ring:3,style:'ARC',labelPlacement:'LEADER'}],
  angleSums:[{id:'sBE',angles:['aBOA','aFOE'],label:'90°',at:[0,-2.6]}]};
const planOf=(planeMarks,extra={})=>({capability:'construction-spike-v1',caption:'직선 BE 위의 이웃한 세 각의 합은 180°이다.',mathPlan:graph,
  displayPoints:['O','B','E','A','F','D','C'],displayLines:[],coordinateCanvas:{width:720,height:480},
  displaySegments:[['sOB','O','B'],['sOE','O','E'],['sOA','O','A'],['sOF','O','F'],['sOD','O','D'],['sOC','O','C']].map(([id,a,b])=>({id,refs:[a,b]})),
  rightAngles:[{id:'rAOF',refs:['A','O','F'],label:'90°'}],planeMarks,...extra});

let model,browser,composed,transform;
before(async()=>{
  const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;
  browser=await launchBrowser();
  composed=await composeConstructionCandidate({plan:planOf(marks),model,identity,typographyPolicy:policy,browser});
  const prepared=await pythonWorker({action:'prepare',spec:specFor(planOf(marks),model,identity.assetId)});assert.equal(prepared.status,'OK');transform=prepared.result.coordinateModel;
});
after(async()=>{await browser?.close();});
const observe=async(svg,{planeMarks=marks,rightAngles=planOf(marks).rightAngles}={})=>{
  const response=await pythonWorker({action:'planeMarksAudit',svg,points:reconstruct(graph).points,marks:planeMarks,segments:planOf(marks).displaySegments,rightAngles,transform},{script:OBSERVER});
  assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;
};
const codes=report=>report.errors.map(error=>error.split(':')[0]);
const specError=(planeMarks,extra)=>{try{specFor(planOf(planeMarks,extra),model,identity.assetId);}catch(error){return String(error.message);}assert.fail('specFor accepted the marks');};
const withAngles=change=>{const next=clone(marks);change(next);return next;};

test('a straight angle, an angle sum and a right angle expression label compose; the observer reads each one back from the final SVG',()=>{
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  const rows=Object.fromEntries(composed.staticAudit.planeMarks.observations.filter(row=>row.id).map(row=>[row.id,row]));
  assert.ok(Math.abs(rows.aBOE.drawnDegrees-180)<1e-6,'the straight angle sweeps a half turn');
  assert.equal(rows.sBE.type,'TEXT_LABEL');assert.equal(rows.rAOF.type,'RIGHT_ANGLE_LABEL');
  assert.ok(composed.svg.includes('id="aBOE-label"')&&composed.svg.includes('id="rAOF-label"')&&composed.svg.includes('id="sBE"'));
  // the sum label is the equation of the two declared values: 35 + 55 = 90, glyph by glyph (the degree sign is the open circle U+2218)
  const glyphs=id=>{const group=new RegExp('<g id="'+id+'"[\\s\\S]*?</svg></g>').exec(composed.svg)[0];return [...group.matchAll(/data-c="([0-9A-F]+)"/g)].map(m=>m[1]);};
  assert.deepEqual(glyphs('sBE'),['33','35','2218','2B','35','35','2218','3D','39','30','2218']);
  assert.deepEqual(glyphs('rAOF-label'),['39','30','2218']);
  // the semicircle of the straight angle faces up: its arc's middle is above the vertex on the screen
  const arc=/id="aBOE-arc-1"[^>]*points="([^"]*)"/.exec(composed.svg)[1].split(' ').map(pair=>pair.split(',').map(Number));
  const middle=arc[Math.floor(arc.length/2)],vertex=/id="O"[^>]*cx="([-\d.]+)" cy="([-\d.]+)"/.exec(composed.svg)||[];
  assert.ok(middle[1]<Number(vertex[2]??Infinity),'ABOVE: smaller y than the vertex');
});

test('the genuine SVG passes the standalone observer; a wrong side, text, sum or place fails it',async()=>{
  assert.deepEqual((await observe(composed.svg)).errors,[]);
  assert.ok(codes(await observe(composed.svg,{planeMarks:withAngles(m=>{m.angles[2].side='BELOW';})})).includes('ANGLE_STRAIGHT_SIDE_MISMATCH'));
  assert.ok(codes(await observe(composed.svg,{planeMarks:withAngles(m=>{m.angleSums[0].angles=['aBOA','aBOE'];})})).includes('ANGLE_SUM_NEEDS_VALUES'));
  assert.ok(codes(await observe(composed.svg,{planeMarks:withAngles(m=>{m.angles[0].value=34;})})).some(code=>['ANGLE_MARK_FACT_MISMATCH','LABEL_TEXT_MISMATCH'].includes(code)),'a changed declared value changes the sum text and the fact');
  assert.ok(codes(await observe(composed.svg,{planeMarks:withAngles(m=>{m.angleSums[0].label='91';})})).includes('ANGLE_SUM_MISMATCH'));
  assert.ok(codes(await observe(composed.svg,{planeMarks:withAngles(m=>{m.angleSums[0].at=[3,3];})})).includes('TEXT_LABEL_NOT_AT_PLACE'));
  assert.ok(codes(await observe(composed.svg,{rightAngles:[{id:'rAOF',refs:['A','O','F'],label:'3x'}]})).includes('LABEL_TEXT_MISMATCH'));
});

test('plan checks: a straight angle needs a straight line and a side; a sum needs two valued angles at one vertex; a right angle label is a plain expression',()=>{
  assert.match(specError(withAngles(m=>{m.angles[2].refs=['B','O','A'];})),/^ANGLE_STRAIGHT_NOT_STRAIGHT:aBOE/);
  assert.match(specError(withAngles(m=>{delete m.angles[2].side;})),/^ANGLE_STRAIGHT_SIDE_REQUIRED:aBOE/);
  assert.match(specError(withAngles(m=>{m.angles[2].side='INNER';})),/^ANGLE_STRAIGHT_SIDE_REQUIRED:aBOE/);
  assert.match(specError(withAngles(m=>{m.angles[2].side='LEFT';})),/^ANGLE_STRAIGHT_SIDE_AMBIGUOUS:aBOE/);          // a horizontal line has no left or right half
  assert.match(specError(withAngles(m=>{m.angles[2].straight='yes';})),/^MARK_FIELD_INVALID:angles\.straight:aBOE/);
  assert.match(specError(withAngles(m=>{m.angles[2].value=179;})),/^ANGLE_MARK_FACT_MISMATCH:aBOE/);
  assert.match(specError(withAngles(m=>{m.angleSums[0].angles=['aBOA','aBOA'];})),/^ANGLE_SUM_ANGLES_INVALID:sBE/);
  assert.match(specError(withAngles(m=>{m.angleSums[0].angles=['aBOA','nope'];})),/^ANGLE_SUM_ANGLES_INVALID:sBE:nope/);
  assert.match(specError(withAngles(m=>{m.angles.push({id:'aOther',refs:['O','A','F'],value:45,arcs:1});m.angleSums[0].angles=['aBOA','aOther'];})),/^ANGLE_SUM_VERTEX_MISMATCH:sBE/);
  assert.match(specError(withAngles(m=>{delete m.angles[0].value;})),/^ANGLE_SUM_NEEDS_VALUES:sBE/);
  assert.match(specError(withAngles(m=>{m.angleSums[0].label='80°';})),/^ANGLE_SUM_MISMATCH:sBE:declared=80°:sum=90/);
  assert.match(specError(withAngles(m=>{m.angleSums[0].at=[1];})),/^ANGLE_SUM_AT_INVALID:sBE/);
  assert.match(specError(withAngles(m=>{m.angleSums[0].anchor='UP';})),/^ANGLE_SUM_ANCHOR_INVALID:sBE/);
  assert.match(specError(marks,{rightAngles:[{id:'rAOF',refs:['A','O','F'],label:'직각'}]}),/^RIGHT_ANGLE_LABEL_INVALID:rAOF/);
  assert.match(specError(marks,{rightAngles:[{id:'rAOF',refs:['A','O','F'],label:'sqrt(2)'}]}),/^RIGHT_ANGLE_LABEL_INVALID:rAOF/);
  assert.match(specError(marks,{rightAngles:[{id:'rAOF',refs:['A','O','F'],label:7}]}),/^RIGHT_ANGLE_LABEL_INVALID:rAOF/);
});

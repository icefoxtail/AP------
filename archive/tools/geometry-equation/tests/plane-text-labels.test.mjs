// Free text labels (E30): planeMarks.textLabels on a coordinate construction plan (SOURCE_COORDINATE_AXES_v1). Real SymPy/Cindy workers and real Chrome;
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
const source=(id,x,y)=>({...node(id,'SOURCE_POINT',[],'POINT',{coordinates:[int(x),int(y)]}),factRole:'DERIVED_INTERMEDIATE'});
const origin=({...node('O','NORMALIZATION_ORIGIN',[],'POINT'),factRole:'DERIVED_INTERMEDIATE'});
const unit=({...node('U','NORMALIZATION_AXIS',[],'POINT',{length:int(1)}),factRole:'DERIVED_INTERMEDIATE'});
const clone=value=>JSON.parse(JSON.stringify(value));

// A point P in the fourth quadrant with its feet Px, Py (no dot, no name), the quadrant names at source coordinates, the sign condition and P(a,b) beside P.
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false},nodes:[
  origin,unit,source('P',1,-1),source('Px',1,0),source('Py',0,-1)]};
const marks={textLabels:[
  {id:'tq1',at:[2,1.9],text:'제1사분면'},{id:'tq2',at:[-2,1.9],text:'제2사분면'},{id:'tq3',at:[-2,-1.9],text:'제3사분면'},{id:'tq4',at:[2,-1.9],text:'제4사분면'},
  {id:'tcond',at:[2,-2.6],text:'a>0, b<0',labelKind:'MATH'},{id:'tP',at:'P',text:'P(a,b)',anchor:'E'},{id:'tFoot',at:'Py',text:'(0,-1)',anchor:'W'}]};
const planOf=(planeMarks,extra={})=>({capability:'construction-spike-v1',caption:'제4사분면 위의 점은 x좌표가 양수, y좌표가 음수이다.',mathPlan:graph,
  displayPoints:['O','P','Px','Py'],displayLines:[],displaySegments:[{id:'gPx',refs:['P','Px'],dashed:true},{id:'gPy',refs:['P','Py'],dashed:true}],
  hiddenPointNames:['P','Px','Py'],unmarkedPointNames:['Px','Py'],axisTickValues:{x:[],y:[]},coordinateCanvas:{width:720,height:560},planeMarks,...extra});

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
const specError=(planeMarks,extra)=>{try{specFor(planOf(planeMarks,extra),model,identity.assetId);}catch(error){return String(error.message);}assert.fail('specFor accepted the marks');};
const withLabel=change=>{const next=clone(marks);change(next.textLabels);return next;};
/** The svg with one label group moved by (dx,dy) px. */
const moveLabel=(svg,id,dx,dy)=>{
  const open=new RegExp('<g id="'+id+'"[^>]*?transform="translate\\(([-\\d.eE+]+)[ ,]([-\\d.eE+]+)\\)"').exec(svg);assert.ok(open,'label group '+id);
  return svg.replace(open[0],open[0].replace(open[1]+' '+open[2],(Number(open[1])+dx).toFixed(6)+' '+(Number(open[2])+dy).toFixed(6)).replace(open[1]+','+open[2],(Number(open[1])+dx).toFixed(6)+','+(Number(open[2])+dy).toFixed(6)));
};

test('a coordinate figure with free text labels composes; the observer reads every label back from the final SVG',()=>{
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  const rows=Object.fromEntries(composed.staticAudit.planeMarks.observations.filter(row=>row.type==='TEXT_LABEL').map(row=>[row.id,row]));
  assert.deepEqual(Object.keys(rows).sort(),['tFoot','tP','tcond','tq1','tq2','tq3','tq4']);
  assert.equal(rows.tq1.labelKind,'TEXT');assert.equal(rows.tq1.anchor,'CENTER');assert.equal(rows.tcond.labelKind,'MATH');assert.equal(rows.tP.anchor,'E');
  for(const id of Object.keys(rows))assert.ok(composed.svg.includes('id="'+id+'"'),id);
  // a TEXT label is plain outlines that keep their text; a MATH label is typeset math with its TeX
  assert.match(composed.svg,/id="tq1"[^>]*data-text="제1사분면"/);
  assert.ok(!/id="tcond"[^>]*data-text=/.test(composed.svg),'a MATH label is typeset math, not plain text');
  assert.ok(/id="tcond"[\s\S]*?<path data-c="1D44E"/.test(composed.svg),'its first glyph is the italic a');
  assert.ok(!/id="Px-name"|id="Py-name"|id="P-name"/.test(composed.svg),'hidden names stay hidden: the label at P is the only text that names it');
});

test('the genuine SVG passes the standalone observer; a wrong text, kind, place, side or an overlap fails it',async()=>{
  assert.deepEqual((await observe(composed.svg)).errors,[]);
  assert.ok(codes(await observe(composed.svg,{planeMarks:withLabel(rows=>{rows[0].text='제2사분면';})})).includes('LABEL_TEXT_MISMATCH'),'TEXT text');
  assert.ok(codes(await observe(composed.svg,{planeMarks:withLabel(rows=>{rows[5].text='Q(a,b)';})})).includes('LABEL_TEXT_MISMATCH'),'MATH glyphs');
  assert.ok(codes(await observe(composed.svg,{planeMarks:withLabel(rows=>{rows[4].labelKind='TEXT';})})).includes('LABEL_KIND_MISMATCH'),'a MATH label declared TEXT');
  assert.ok(codes(await observe(composed.svg,{planeMarks:withLabel(rows=>{rows[0].labelKind='MATH';rows[0].text='x';})})).includes('LABEL_KIND_MISMATCH'),'a TEXT label declared MATH');
  assert.ok(codes(await observe(composed.svg,{planeMarks:withLabel(rows=>{rows[0].at=[2,3.4];})})).includes('TEXT_LABEL_NOT_AT_PLACE'),'centred label away from its place');
  assert.ok(codes(await observe(composed.svg,{planeMarks:withLabel(rows=>{rows[5].anchor='W';})})).includes('TEXT_LABEL_NOT_ON_SIDE'),'wrong side of its point');
  assert.ok(codes(await observe(composed.svg,{planeMarks:withLabel(rows=>{rows[5].at='O';})})).includes('TEXT_LABEL_TOO_FAR'),'label far from the point it claims');
  assert.ok(codes(await observe(composed.svg,{planeMarks:withLabel(rows=>{rows[5].anchor='UP';})})).includes('TEXT_LABEL_ANCHOR_INVALID'));
  assert.ok(codes(await observe(composed.svg,{planeMarks:withLabel(rows=>{rows[0].at=[1];})})).includes('TEXT_LABEL_AT_INVALID'));
});

test('tamper: moving a label onto an axis or another label, or deleting it, makes the observer fail',async()=>{
  const onAxis=moveLabel(composed.svg,'tq1',-80,95);
  assert.ok(codes(await observe(onAxis)).some(code=>code==='MARK_LABEL_OVERLAPS'||code==='MARK_LABEL_OVERLAPS_LABEL'||code==='TEXT_LABEL_NOT_AT_PLACE'));
  assert.ok(codes(await observe(moveLabel(composed.svg,'tq1',200,0))).includes('TEXT_LABEL_NOT_AT_PLACE'));
  assert.ok(codes(await observe(moveLabel(composed.svg,'tP',0,40))).includes('TEXT_LABEL_NOT_ON_SIDE'));
  const group=/<g id="tq2"[^>]*>[\s\S]*?<\/svg><\/g>/.exec(composed.svg);assert.ok(group,'label group tq2');
  assert.ok(codes(await observe(composed.svg.replace(group[0],''))).includes('MARK_LABEL_MISSING'));
});

test('plan checks: an invalid text, place, anchor or math label is refused with its own code',()=>{
  assert.match(specError(withLabel(rows=>{rows[0].at=[1];})),/^TEXT_LABEL_AT_INVALID:tq1/);
  assert.match(specError(withLabel(rows=>{rows[0].at='Q';})),/^MARK_TARGET_UNKNOWN:Q|^DISPLAY_ANNOTATION_POINT_NOT_VISIBLE:Q/);
  assert.match(specError(withLabel(rows=>{rows[0].anchor='UP';})),/^TEXT_LABEL_ANCHOR_INVALID:tq1/);
  assert.match(specError(withLabel(rows=>{rows[0].text='';})),/^TEXT_LABEL_TEXT_INVALID:tq1/);
  assert.match(specError(withLabel(rows=>{rows[0].text='가'.repeat(41);})),/^TEXT_LABEL_TEXT_INVALID:tq1/);
  assert.match(specError(withLabel(rows=>{rows[4].text='a/b';})),/^TEXT_LABEL_MATH_UNSUPPORTED:tcond/);
  assert.match(specError(withLabel(rows=>{rows[4].text='sqrt(2)';})),/^TEXT_LABEL_MATH_UNSUPPORTED:tcond/);
  assert.match(specError(withLabel(rows=>{rows[4].text='제4';rows[4].labelKind='MATH';})),/^TEXT_LABEL_MATH_UNSUPPORTED:tcond/);
  assert.match(specError(withLabel(rows=>{rows[0].labelKind='MATH';rows[0].text='x';rows[0].extra=1;})),/^MARK_FIELD_UNKNOWN:textLabels\.extra/);
  assert.match(specError(withLabel(rows=>{rows[0].id='P';})),/^MARK_ID_DUPLICATE:P/);
  assert.match(specError(withLabel(rows=>{rows[0].labelKind='TEXT';rows[0].text='a$b';})),/^MARK_FIELD_INVALID:textLabels\.text:tq1/);
});

test('plan checks: a coordinate pair written beside a point must be that point; a hidden point may be named only by its own label',()=>{
  assert.match(specError(withLabel(rows=>{rows[6].text='(0,-2)';})),/^TEXT_LABEL_COORDINATE_MISMATCH:tFoot:declared=\(0,-2\):point=\(0,-1\)/);
  assert.match(specError(withLabel(rows=>{rows[5].text='P(2,-1)';})),/^TEXT_LABEL_COORDINATE_MISMATCH:tP/);
  specFor(planOf(withLabel(rows=>{rows[5].text='P(1,-1)';})),model,identity.assetId);          // the true coordinates are fine
  // P is a hidden SOURCE_POINT: a caption or another label cannot call it P, but the textLabels row anchored at P can
  assert.match(specError(marks,{caption:'점 P가 제4사분면 위의 점이다.'}),/^HIDDEN_POINT_NAMED_IN_TEXT:P/);
  assert.match(specError(withLabel(rows=>{rows[0].text='점 P';}),{}),/^HIDDEN_POINT_NAMED_IN_TEXT:P/);
  specFor(planOf(marks),model,identity.assetId);
});

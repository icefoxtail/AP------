// Plane-figure dimension lines and path total-length labels (E7): a length written between two points on a parallel line (bar, arrows or brace) with its label on
// the outer side, and one label for the whole length of a bent path tied to it by a leader. Real SymPy/Cindy workers and real Chrome; the typography policy is the
// same FIXTURE as plane-marks.test.mjs. Run with --test-concurrency=1.
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
const tagOf=(svg,id)=>new RegExp('<(?:polyline|line|polygon|circle)\\s(?:[^>]*\\s)?id="'+id+'"[^>]*/>').exec(svg)?.[0];
const attr=(tag,name)=>new RegExp('\\s'+name+'="([^"]*)"').exec(tag)?.[1];
const specError=(plan,model)=>{try{specFor(plan,model,identity.assetId);}catch(error){return String(error.message);}assert.fail('specFor accepted the plan');};
const observe=async(svg,graph,planeMarks,segments,transform)=>{
  const response=await pythonWorker({action:'planeMarksAudit',svg,points:reconstruct(graph).points,marks:planeMarks,segments,transform},{script:OBSERVER});
  assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;
};
const codes=report=>report.errors.map(error=>error.split(':')[0]);

let browser;
before(async()=>{browser=await launchBrowser();});
after(async()=>{await browser?.close();});

// ---- dimension lines on a line of points: the shape of 24 향림중 q7 (A, M, B, N, C on one line)
const lineGraph=plane([source('A',0,0),source('B',36,0),source('C',60,0),midpoint('M','A','B'),midpoint('N','B','C')]);
const lineSegments=[{id:'sAM',refs:['A','M']},{id:'sMB',refs:['M','B']},{id:'sBN',refs:['B','N']},{id:'sNC',refs:['N','C']},{id:'sMN',refs:['M','N'],emphasis:'ACCENT'}];
const linePlan=(planeMarks,extra={})=>({capability:'construction-spike-v1',caption:'M, N이 각각 AB, BC의 중점이다.',mathPlan:lineGraph,displayPoints:['A','M','B','N','C'],displayLines:[],displayCircles:[],
  displaySegments:lineSegments,coordinateCanvas:{width:720,height:320},planeMarks,...extra});
const lineDimensions=[{id:'dAM',from:'A',to:'M',label:'18',unit:'cm',side:'ABOVE',factRole:'GIVEN'},{id:'dBC',from:'B',to:'C',label:'24',unit:'cm',side:'BELOW',factRole:'DERIVED_INTERMEDIATE'}];

test('E7: a bar dimension above AM and one below BC compose, every audit passes, and the labels stand on the outer side',async()=>{
  const model=await modelOf(lineGraph),plan=linePlan({dimensions:lineDimensions}),composed=await composeOf(plan,model);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  assert.equal(composed.renderedLayout.status,'PASS',JSON.stringify(composed.renderedLayout.errors));
  for(const part of ['line','ext-from','ext-to','tick-from','tick-to'])for(const id of ['dAM','dBC'])assert.ok(tagOf(composed.svg,id+'-'+part),id+'-'+part);
  const line=tagOf(composed.svg,'dBC-line'),origin=Number(attr(tagOf(composed.svg,'B'),'cy'));
  assert.ok(Math.abs(Number(attr(line,'y1'))-(origin+24))<1e-6,'BELOW: 24 px under the points');
  assert.ok(Math.abs(Number(attr(tagOf(composed.svg,'dAM-line'),'y1'))-(origin-24))<1e-6,'ABOVE: 24 px over the points');
  assert.ok(composed.svg.includes('id="dAM-label"')&&composed.svg.includes('id="dBC-label"'));
  const unitGlyphs=id=>{const from=composed.svg.indexOf('id="'+id+'"');return [...composed.svg.slice(from,composed.svg.indexOf('</g></g>',from)).matchAll(/data-c="([0-9A-F]+)"/gu)].map(m=>m[1]);};
  assert.deepEqual(unitGlyphs('dAM-label'),['31','38','63','6D'],'18 cm');
  assert.deepEqual(unitGlyphs('dBC-label'),['32','34','63','6D'],'24 cm');
});

test('E7: a unit written in the label ("24\\,cm") is the unit; the same figure comes out byte for byte',async()=>{
  const model=await modelOf(lineGraph);
  const a=await composeOf(linePlan({dimensions:lineDimensions}),model);
  const b=await composeOf(linePlan({dimensions:lineDimensions.map(({unit,...row})=>({...row,label:row.label+'\\,'+unit}))}),model);
  assert.equal(b.status,'COMPOSED',JSON.stringify(b.detail));
  assert.equal(a.svg,b.svg);
  assert.match(specError(linePlan({dimensions:[{...lineDimensions[0],label:'18\\,cm',unit:'m'}]}),model),/MARK_UNIT_INVALID/);
});

test('E7: arrow and brace styles, a further offset and a slanted segment compose and pass',async()=>{
  const model=await modelOf(lineGraph);
  const rows=[{id:'dMN',from:'M',to:'N',label:'30',unit:'cm',side:'ABOVE',style:'BRACE'},{id:'dBC',from:'B',to:'C',label:'24',unit:'cm',side:'BELOW',style:'ARROW'},{id:'dAC',from:'A',to:'C',label:'60',unit:'cm',side:'BELOW',offset:2}];
  const composed=await composeOf(linePlan({dimensions:rows},{coordinateCanvas:{width:720,height:380}}),model);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  assert.equal(composed.renderedLayout.status,'PASS',JSON.stringify(composed.renderedLayout.errors));
  assert.ok(tagOf(composed.svg,'dMN-brace'));assert.ok(tagOf(composed.svg,'dBC-arrow-from')&&tagOf(composed.svg,'dBC-arrow-to'));
  const near=Number(attr(tagOf(composed.svg,'dBC-line'),'y1')),far=Number(attr(tagOf(composed.svg,'dAC-line'),'y1'));
  assert.ok(Math.abs(far-near-44)<1e-6,'the offset-2 line stands one 44 px step beyond the offset-1 line');
});

test('E7: the frame widens by itself so dimension lines and labels fit (no author action), and a plan without dimensions keeps its frame',async()=>{
  // a square that fills the canvas height: a dimension above its top edge needs room the tight frame does not have
  const squareGraph=plane([source('A',0,0),source('B',40,0),source('C',40,40),source('D',0,40)]);
  const square=planeMarks=>({capability:'construction-spike-v1',caption:'정사각형 ABCD이다.',mathPlan:squareGraph,displayPoints:['A','B','C','D'],displayLines:[],displayCircles:[],
    displaySegments:[{id:'sAB',refs:['A','B']},{id:'sBC',refs:['B','C']},{id:'sCD',refs:['C','D']},{id:'sDA',refs:['D','A']}],coordinateCanvas:{width:384,height:320},planeMarks});
  const model=await modelOf(squareGraph);
  const plain=square({equalLengths:[{id:'e1',count:1,segments:['sAB','sBC']}]}),withDim=square({dimensions:[{id:'dDC',from:'D',to:'C',label:'40',unit:'cm',side:'ABOVE'}]});
  const a=specFor(plain,model,identity.assetId).viewport,b=specFor(withDim,model,identity.assetId).viewport;
  assert.ok(b.yMax-b.yMin>a.yMax-a.yMin+1,'room was added above the square for the dimension line and its label');
  assert.equal(b.yMin,a.yMin,'and only on the side the dimension faces');
  assert.deepEqual(specFor(plain,model,identity.assetId).viewport,a,'a plan without dimensions keeps its frame');
  const composed=await composeOf(withDim,model);assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
});

test('E7: plan errors: side, style, offset, label, value, undisplayed points, ambiguous side',async()=>{
  const model=await modelOf(lineGraph),row=lineDimensions[0];
  const err=(change,extra)=>specError(linePlan({dimensions:[{...row,...change}]},extra),model);
  assert.equal(err({side:'NORTH'}),'DIMENSION_SIDE_INVALID:dAM');
  assert.equal(err({side:undefined}),'DIMENSION_SIDE_INVALID:dAM');
  assert.equal(err({style:'CURLY'}),'DIMENSION_STYLE_INVALID:dAM');
  assert.equal(err({offset:4}),'DIMENSION_OFFSET_INVALID:dAM');
  assert.equal(err({offset:1.5}),'DIMENSION_OFFSET_INVALID:dAM');
  assert.equal(err({label:''}),'DIMENSION_LABEL_REQUIRED:dAM');
  assert.equal(err({label:undefined}),'DIMENSION_LABEL_REQUIRED:dAM');
  assert.equal(err({from:'A',to:'A'}),'MARK_FIELD_INVALID:dimensions.from:dAM');
  assert.equal(err({from:'A',to:'Z'}),'DISPLAY_ANNOTATION_POINT_NOT_VISIBLE:Z');
  assert.equal(err({value:19}),'DIMENSION_FACT_MISMATCH:dAM:declared=19:drawn=18.000000');
  assert.equal(err({labelKind:'TEXT'}),'MARK_UNIT_REQUIRES_MATH_LABEL:dAM');
  assert.equal(err({unit:'km'}),'MARK_UNIT_INVALID:dimensions:dAM');
  assert.equal(err({extra:1}),'MARK_FIELD_UNKNOWN:dimensions.extra');
  assert.match(specError(linePlan({dimensions:[{...row,from:'A',to:'M'}]},{displayPoints:['A','B','C','N']}),model),/NOT_VISIBLE|NOT_DISPLAYED/);
});
test('E7: the observer refuses a dimension line moved off its offset, on the wrong side, between other points, and a label inside it',async()=>{
  const model=await modelOf(lineGraph),plan=linePlan({dimensions:lineDimensions}),composed=await composeOf(plan,model);
  const prepared=await pythonWorker({action:'prepare',spec:specFor(plan,model,identity.assetId)});assert.equal(prepared.status,'OK');
  const run=(svg,marks=plan.planeMarks)=>observe(svg,lineGraph,marks,plan.displaySegments,prepared.result.coordinateModel);
  assert.deepEqual((await run(composed.svg)).errors,[]);
  const line=tagOf(composed.svg,'dBC-line'),y=Number(attr(line,'y1'));
  const moved=composed.svg.replace(line,line.replace(/\sy1="[^"]*"/,' y1="'+(y+3)+'"').replace(/\sy2="[^"]*"/,' y2="'+(y+3)+'"'));
  assert.ok(codes(await run(moved)).includes('DIMENSION_OFFSET_MISMATCH'));
  const flipped={dimensions:[lineDimensions[0],{...lineDimensions[1],side:'ABOVE'}]};
  assert.ok(codes(await run(composed.svg,flipped)).includes('DIMENSION_SIDE_MISMATCH'));
  const shifted={dimensions:[lineDimensions[0],{...lineDimensions[1],from:'M'}]};
  assert.ok(codes(await run(composed.svg,shifted)).some(code=>['DIMENSION_END_MISMATCH','DIMENSION_EXTENSION_MISMATCH'].includes(code)));
  const tick=tagOf(composed.svg,'dBC-tick-from');
  assert.ok(codes(await run(composed.svg.replace(tick,''))).includes('DIMENSION_PART_MISSING'));
  assert.ok(codes(await run(composed.svg,{dimensions:[lineDimensions[0]]})).includes('UNDECLARED_MARK'));
});

// ---- a path total-length label: the road of 25 풍덕중 q4 (a zigzag A - P - Q - B) with the straight distance AB
const pathGraph=plane([source('A',0,0),source('P',34,-8),source('Q',14,-16),source('B',60,40)]);
const pathSegments=[{id:'sAP',refs:['A','P'],dashed:true},{id:'sPQ',refs:['P','Q'],dashed:true},{id:'sQB',refs:['Q','B'],dashed:true},{id:'sAB',refs:['A','B']}];
const pathPlan=(planeMarks,extra={})=>({capability:'construction-spike-v1',caption:'A에서 B까지의 도로 경로와 직선 거리를 나타낸 그림이다.',mathPlan:pathGraph,displayPoints:['A','P','Q','B'],displayLines:[],displayCircles:[],
  displaySegments:pathSegments,coordinateCanvas:{width:640,height:420},hiddenPointNames:['P','Q'],hiddenPointStyle:'NONE',planeMarks,...extra});

test('E7: a path label ties one total length to a bent path with a leader that starts on the path; every audit passes',async()=>{
  const model=await modelOf(pathGraph),marks={pathLabels:[{id:'road',points:['A','P','Q','B'],label:'305',unit:'m'}],dimensions:[{id:'dAB',from:'A',to:'B',label:'193',unit:'m',side:'LEFT',style:'ARROW'}]};
  const plan=pathPlan(marks),composed=await composeOf(plan,model);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  assert.equal(composed.renderedLayout.status,'PASS',JSON.stringify(composed.renderedLayout.errors));
  const leader=/<line\s[^>]*data-role="leader"[^>]*data-owner-label="road-label"[^>]*\/>/.exec(composed.svg)?.[0];
  assert.ok(leader,'the label is tied to its path by a leader');
  const prepared=await pythonWorker({action:'prepare',spec:specFor(plan,model,identity.assetId)});assert.equal(prepared.status,'OK');
  const run=svg=>observe(svg,pathGraph,marks,plan.displaySegments,prepared.result.coordinateModel);
  assert.deepEqual((await run(composed.svg)).errors,[]);
  assert.ok(codes(await run(composed.svg.replace(leader,''))).includes('PATH_LABEL_LEADER_MISSING'));
  const off=composed.svg.replace(leader,leader.replace(/\sx1="[^"]*"/,' x1="'+(Number(attr(leader,'x1'))+12).toFixed(3)+'"'));
  assert.ok(codes(await run(off)).includes('MARK_LEADER_NOT_ON_OWNER'));
});

test('E7: path label plan errors',async()=>{
  const model=await modelOf(pathGraph),row={id:'road',points:['A','P','Q','B'],label:'305',unit:'m'};
  const err=(change,extra)=>specError(pathPlan({pathLabels:[{...row,...change}]},extra),model);
  assert.equal(err({points:['A','P']}),'PATH_LABEL_POINTS_INVALID:road');
  assert.equal(err({points:['A','P','A']}),'PATH_LABEL_POINTS_INVALID:road');
  assert.equal(err({points:['A','Q','P','B']}),'PATH_LABEL_SEGMENT_NOT_DRAWN:road:A-Q');
  assert.equal(err({label:''}),'PATH_LABEL_LABEL_REQUIRED:road');
  assert.match(err({value:300}),/^PATH_LABEL_FACT_MISMATCH:road:declared=300:drawn=/);
  assert.equal(err({unit:'km'}),'MARK_UNIT_INVALID:pathLabels:road');
  assert.equal(err({style:'BRACKET'}),'MARK_FIELD_UNKNOWN:pathLabels.style');
});

// ---- the same marks on a coordinate construction plan (SOURCE_COORDINATE_AXES_v1, axes drawn): O(0,0), A(5,0) on the x axis, P(3,3)
test('E7: a dimension also works on a coordinate construction plan, below the x axis',async()=>{
  const derived=(id,op,inputs,type,args={})=>({...node(id,op,inputs,type,args),factRole:'DERIVED_INTERMEDIATE'});
  const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false},nodes:[
    derived('O','NORMALIZATION_ORIGIN',[],'POINT'),derived('X','NORMALIZATION_AXIS',[],'POINT',{length:int(1)}),source('A',5,0),source('P',3,3)]};
  const planeMarks={dimensions:[{id:'dOA',from:'O',to:'A',label:'5',side:'BELOW'}]};
  const plan={capability:'construction-spike-v1',caption:'좌표평면 위의 두 점 O, A이다.',mathPlan:graph,displayPoints:['O','A','P'],displayLines:[],displayCircles:[],coordinateCanvas:{width:640,height:480},
    displaySegments:[{id:'sOA',refs:['O','A']},{id:'sOP',refs:['O','P']}],axisTickValues:{x:[],y:[]},planeMarks};
  const model=await modelOf(graph),composed=await composeOf(plan,model);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  assert.ok(tagOf(composed.svg,'dOA-line')&&tagOf(composed.svg,'dOA-tick-from'));
});

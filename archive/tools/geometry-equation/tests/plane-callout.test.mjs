// Callouts (E37): a segment path or an angle of a plane figure drawn again beside it, in the same picture (planeMarks.callouts).
// Real SymPy/Cindy workers and real Chrome; the typography policy is the same FIXTURE as plane-e32.test.mjs. Run with --test-concurrency=1.
import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {reconstruct} from '../production/cindy-observer.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {requestedProfileTypographyPolicy} from '../production/display-envelope.mjs';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';
import {planNameExpectations,observeDisplayedPointNames} from '../production/point-name-observer.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {int,node} from './construction-v1-fixture.mjs';

const OBSERVER=fileURLToPath(new URL('../production/plane-marks-observer-worker.py',import.meta.url));
const rect=(width,height)=>({x:20,y:30,width,height});
const OBSERVATION={status:'PASS',synthetic:false,runtime:'playwright-chromium',profiles:[['small',126,105],['medium',174,145],['large',216,180],['full',384,320]].map(([sizeClass,width,height])=>({sizeClass,status:'PASS',imageRect:rect(width,height),naturalWidth:width,naturalHeight:height,fontFloorCssPx:11}))};
const policy=requestedProfileTypographyPolicy({requestedSizeClass:'full',intrinsicSvg:{width:384,height:320},observation:OBSERVATION});
const identity=assetIdentity('l1_unit_exam|1','SOLUTION_VISUAL','decisive-relation');
const source=(id,x,y)=>node(id,'SOURCE_POINT',[],'POINT',{coordinates:[int(x),int(y)]});
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

// ---- segment callout: the median CD of a triangle (CG=10, GD=5, CD=x=15) pulled out beside the triangle with three tiers of dimension lines (25 왕운중 2학기 기말 q6)
const triangle=plane([source('A',10,0),source('B',0,0),source('C',-4,12),{...node('D','MIDPOINT',['A','B'],'POINT',{}),factRole:'GIVEN'},{...node('G','CENTROID',['A','B','C'],'POINT',{}),factRole:'GIVEN'}]);
const triangleSegments=[['sAD','A','D'],['sDB','D','B'],['sBC','B','C'],['sCA','C','A'],['sCG','C','G'],['sGD','G','D']].map(([id,a,b])=>({id,refs:[a,b]}));
const calloutRow=(extra={})=>({id:'k1',kind:'SEGMENT',path:['D','G','C'],at:'RIGHT',dimensions:[
  {id:'dDG',from:'D',to:'G',value:5,label:'5',unit:'cm',side:'BELOW',style:'ARROW',offset:'AUTO',factRole:'DERIVED_INTERMEDIATE'},
  {id:'dGC',from:'G',to:'C',value:10,label:'10',unit:'cm',side:'BELOW',style:'ARROW',offset:'AUTO',factRole:'GIVEN'},
  {id:'dDC',from:'D',to:'C',value:15,label:'x=15',unit:'cm',side:'BELOW',style:'ARROW',offset:'AUTO',factRole:'DERIVED_INTERMEDIATE'}],...extra});
const trianglePlan=(row=calloutRow(),extra={},marks={})=>({capability:'construction-spike-v1',caption:'중선 CD 위에서 CG=10 cm, GD=5 cm이고 전체 CD=x=15 cm이다.',mathPlan:triangle,displayPoints:['A','B','C','D','G'],displayLines:[],displayCircles:[],
  displaySegments:triangleSegments,coordinateCanvas:{width:720,height:540},planeMarks:{equalLengths:[{id:'eAD',count:1,segments:['sAD','sDB']}],dimensions:[{id:'dAB',from:'A',to:'B',label:'10',unit:'cm',side:'BELOW',style:'ARROW',offset:'AUTO',offsetPx:50}],...(row===null?{}:{callouts:[row]}),...marks},...extra});
const scaled=(svg,id)=>{const tag=tagOf(svg,id);return [Number(attr(tag,'cx')),Number(attr(tag,'cy'))];};

test('E37 segment callout: the median pulled out beside the triangle keeps its pieces in ratio, carries the same names and three tiers of dimensions; every audit passes',async()=>{
  const model=await modelOf(triangle),plan=trianglePlan(),composed=await composeOf(plan,model);
  expectComposed(composed);
  const [d,g,c]=['D','G','C'].map(id=>scaled(composed.svg,'k1__'+id));
  assert.ok(Math.abs(d[1]-g[1])<1e-6&&Math.abs(g[1]-c[1])<1e-6,'one horizontal line');
  const dg=Math.hypot(g[0]-d[0],g[1]-d[1]),gc=Math.hypot(c[0]-g[0],c[1]-g[1]);
  assert.ok(Math.abs(gc/dg-2)<1e-9,'CG : GD = 10 : 5 on the copy, as on the main figure');
  assert.ok(c[0]<d[0],'C stands left of D, the way the median runs on the page');
  for(const id of ['k1__s1','k1__s2','k1__dDG-line','k1__dGC-line','k1__dDC-line'])assert.ok(tagOf(composed.svg,id),id);
  // the tiers: GD and CG share tier 1, the whole CD stands outside them
  const y=id=>Number(attr(tagOf(composed.svg,id),'y1'));
  assert.ok(Math.abs(y('k1__dDG-line')-y('k1__dGC-line'))<1e-6&&y('k1__dDC-line')>y('k1__dDG-line')+40);
  // the names: every copy carries the name of its point (read back from the glyphs by the point-name observer)
  assert.equal(planNameExpectations({...plan,pointNames:{C:'C',D:'D',G:'G'}}).filter(row=>row.owner.startsWith('k1__')).length,3);
  assert.equal(observeDisplayedPointNames(composed.svg,planNameExpectations({...plan,pointNames:{C:'C',D:'D',G:'G'}})).errors.length,0);
  const transform=await transformOf(plan,model),report=await observe(composed.svg,triangle,plan.planeMarks,plan.displaySegments,transform);
  assert.deepEqual(report.errors,[]);
  assert.equal(report.observations.filter(row=>row.type==='CALLOUT').length,1);
  // tamper: the observer reads the copies from the final SVG against the main figure's points
  const mid=tagOf(composed.svg,'k1__G'),moved=composed.svg.replace(mid,mid.replace(/\scx="[^"]*"/,' cx="'+(g[0]+12).toFixed(3)+'"'));
  assert.ok(codes(await observe(moved,triangle,plan.planeMarks,plan.displaySegments,transform)).includes('CALLOUT_RATIO_MISMATCH'));
  assert.ok(codes(await observe(composed.svg,triangle,{...plan.planeMarks,callouts:[calloutRow({scale:2})]},plan.displaySegments,transform)).includes('CALLOUT_SCALE_MISMATCH'));
  assert.ok(codes(await observe(composed.svg,triangle,{...plan.planeMarks,callouts:[calloutRow({at:'LEFT'})]},plan.displaySegments,transform)).includes('CALLOUT_SIDE_MISMATCH'));
});

test('E37 segment callout: scale, side, vertical orientation and guide lines',async()=>{
  const model=await modelOf(triangle);
  for(const [row,label] of [[calloutRow({scale:1.5,at:'BELOW',link:'ENDS'}),'below, guided'],[calloutRow({orientation:'VERTICAL',at:'RIGHT',dimensions:[{id:'dDC',from:'D',to:'C',value:15,label:'x=15',unit:'cm',side:'RIGHT',style:'ARROW'}]}),'vertical']]){
    const plan=trianglePlan(row,{coordinateCanvas:{width:720,height:600}}),composed=await composeOf(plan,model);
    expectComposed(composed);
    const report=await observe(composed.svg,triangle,plan.planeMarks,plan.displaySegments,await transformOf(plan,model));
    assert.deepEqual(report.errors,[],label);
    if(row.link==='ENDS'){
      const guide=tagOf(composed.svg,'k1__g1');
      assert.equal(attr(guide,'stroke'),'#8a8a8a');assert.equal(attr(guide,'stroke-dasharray'),'2 4');assert.equal(attr(guide,'data-role'),'guide');
      assert.ok(tagOf(composed.svg,'k1__g2'));
      assert.ok(codes(await observe(composed.svg.replace(guide,''),triangle,plan.planeMarks,plan.displaySegments,await transformOf(plan,model))).includes('CALLOUT_GUIDE_MISSING'));
      assert.ok(codes(await observe(composed.svg,triangle,{...plan.planeMarks,callouts:[{...row,link:'NONE'}]},plan.displaySegments,await transformOf(plan,model))).includes('CALLOUT_GUIDE_UNDECLARED'));
    }
  }
});

test('E37 segment callout: marks on the pieces (equal ticks, a piece label) and plan errors with explicit codes',async()=>{
  const model=await modelOf(triangle);
  const withMarks=calloutRow({marks:{expressionLabels:[{id:'tCG',segment:['C','G'],text:'a',labelKind:'MATH'}]}});
  const plan=trianglePlan(withMarks);
  const composed=await composeOf(plan,model);expectComposed(composed);
  assert.ok(tagOf(composed.svg,'k1__tCG'),'the piece label stands on the copy');
  const err=(row,extra)=>specError(trianglePlan(row,extra),model);
  assert.equal(err(calloutRow({kind:'POLYLINE'})),'CALLOUT_KIND_INVALID:k1');
  assert.equal(err(calloutRow({id:'k_1'})),'CALLOUT_ID_INVALID');
  assert.equal(err(calloutRow({path:['D']})),'CALLOUT_PATH_INVALID:k1');
  assert.equal(err(calloutRow({path:['D','D']})),'CALLOUT_PATH_INVALID:k1');
  assert.equal(err(calloutRow({path:['D','Z']})),'DISPLAY_ANNOTATION_POINT_NOT_VISIBLE:Z');
  assert.equal(err(calloutRow({scale:9})),'CALLOUT_SCALE_INVALID:k1');
  assert.equal(err(calloutRow({at:'CENTER'})),'CALLOUT_AT_INVALID:k1');
  assert.equal(err(calloutRow({orientation:'DIAGONAL'})),'CALLOUT_ORIENTATION_INVALID:k1');
  assert.equal(err(calloutRow({link:'VERTEX'})),'CALLOUT_LINK_INVALID:k1');
  assert.equal(err(calloutRow({gap:-1})),'CALLOUT_GAP_INVALID:k1');
  assert.equal(err(calloutRow({vertex:'D'})),'CALLOUT_FIELD_INVALID:k1.vertex');
  assert.equal(err(calloutRow({dimensions:[{id:'dX',from:'D',to:'B',label:'5',side:'BELOW'}]})),'CALLOUT_TARGET_UNKNOWN:k1.dimensions:dX');
  assert.equal(err(calloutRow({dimensions:[{id:'dX',from:'D',to:'G',label:'6',value:6,side:'BELOW'}]})),'CALLOUT_DIMENSION_FACT_MISMATCH:k1.dX:declared=6:main=5');
  assert.equal(err(calloutRow({marks:{equalLengths:[{id:'e',count:1,segments:[['D','G'],['D','C']]}]}})),'CALLOUT_SEGMENT_UNKNOWN:k1.marks.equalLengths:e');
  assert.equal(err(calloutRow({marks:{angles:[]}})),'CALLOUT_FIELD_INVALID:k1.marks.angles');
  assert.equal(err(calloutRow(),{planeMarks:{callouts:[calloutRow(),calloutRow()]}}),'CALLOUT_ID_DUPLICATE:k1');
  assert.equal(err(calloutRow(),{planeMarks:{callouts:[]}}),'CALLOUTS_INVALID');
  assert.equal(err(calloutRow(),{hiddenPointNames:['G']}),'CALLOUT_POINT_HIDDEN:k1:G');
});

test('E37 segment callout: a plan without callouts is the old figure byte for byte',async()=>{
  const model=await modelOf(triangle);
  const without=await composeOf(trianglePlan(null),model),again=await composeOf(trianglePlan(null),model);
  expectComposed(without);assert.equal(without.svg,again.svg);
  assert.ok(!without.svg.includes('__'),'no callout element in a figure without callouts');
});

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
const observe=async(svg,graph,planeMarks,segments,transform,extra={})=>{
  const response=await pythonWorker({action:'planeMarksAudit',svg,points:reconstruct(graph).points,marks:planeMarks,segments,transform,...extra},{script:OBSERVER});
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

// ---- angle callout: the fan at B of an isosceles triangle with its circumcentre O and incentre I (26 왕운중 2학기 중간 q8), drawn again to the right with the arcs and values of the angles at B
const frac=(n,d)=>({kind:'rational',numerator:String(n),denominator:String(d)});
const fanNodes=plane([source('B',0,0),source('C',10,0),node('A','SOURCE_POINT',[],'POINT',{coordinates:[int(5),frac('24210259','1573278')]}),node('O','SOURCE_POINT',[],'POINT',{coordinates:[int(5),frac('63317959','9200638')]}),
  node('I','SOURCE_POINT',[],'POINT',{coordinates:[int(5),frac('12098833','3330523')]}),source('M',5,0)]);
const fanSegments=[['sAB','A','B'],['sBC','B','C'],['sCA','C','A'],['sBO','B','O'],['sCO','C','O'],['sBI','B','I'],['sCI','C','I']].map(([id,a,b])=>({id,refs:[a,b]}));
const fanRow=(extra={})=>({id:'kB',kind:'ANGLE',vertex:'B',rays:['C','I','O','A'],at:'RIGHT',angles:[
  {id:'aIBC',refs:['C','B','I'],value:36,label:'36',ring:1,style:'ARC',factRole:'DERIVED_INTERMEDIATE'},
  {id:'aOBC',refs:['C','B','O'],value:54,label:'54',ring:2,style:'ARC',factRole:'DERIVED_INTERMEDIATE'},
  {id:'aOBI',refs:['I','B','O'],value:18,noLabel:true,ring:3,emphasisGroup:1,factRole:'CONCLUSION'}],...extra});
const fanPlan=(row=fanRow(),extra={})=>({capability:'construction-spike-v1',caption:'이등변삼각형 ABC의 외심 O와 내심 I에서 B의 각을 따로 그렸다.',mathPlan:fanNodes,displayPoints:['A','B','C','O','I','M'],displayLines:[],displayCircles:[],
  displaySegments:fanSegments,coordinateCanvas:{width:720,height:600},planeMarks:{callouts:[row]},...extra});

test('E37 angle callout: the fan at B drawn again keeps every angle of the original, with the arcs and values of the angles at B; every audit passes',async()=>{
  const model=await modelOf(fanNodes),plan=fanPlan(),composed=await composeOf(plan,model);
  expectComposed(composed);
  const transform=await transformOf(plan,model),report=await observe(composed.svg,fanNodes,plan.planeMarks,plan.displaySegments,transform);
  assert.deepEqual(report.errors,[]);
  const angle=id=>report.observations.find(row=>row.type==='ANGLE'&&row.id===id).drawnDegrees;
  assert.ok(Math.abs(angle('kB__aIBC')-36)<0.01&&Math.abs(angle('kB__aOBC')-54)<0.01&&Math.abs(angle('kB__aOBI')-18)<0.01,'the original angles, whatever the lengths');
  const b=['B','C','I','O','A'].map(id=>scaled(composed.svg,'kB__'+id)),lengths=b.slice(1).map(q=>Math.hypot(q[0]-b[0][0],q[1]-b[0][1]));
  assert.ok(lengths.every(l=>Math.abs(l-lengths[0])<1e-6),'every ray of the fan is as long as the radius');
  // tamper: a ray end moved along its own ray changes its length, one moved across it turns it
  const iTag=tagOf(composed.svg,'kB__I'),at=scaled(composed.svg,'kB__I');
  const longer=composed.svg.replace(iTag,iTag.replace(/\scx="[^"]*"/,' cx="'+(at[0]+25).toFixed(3)+'"'));
  assert.ok(codes(await observe(longer,fanNodes,plan.planeMarks,plan.displaySegments,transform)).some(code=>['CALLOUT_RAY_LENGTH_MISMATCH','CALLOUT_ANGLE_MISMATCH'].includes(code)));
  assert.ok(codes(await observe(composed.svg,fanNodes,{callouts:[fanRow({radius:5})]},plan.displaySegments,transform)).includes('CALLOUT_RADIUS_MISMATCH'));
  assert.ok(codes(await observe(composed.svg,fanNodes,{callouts:[fanRow({at:'ABOVE'})]},plan.displaySegments,transform)).includes('CALLOUT_SIDE_MISMATCH'));
  // the display names of a plan are read back on the copies too
  assert.equal(observeDisplayedPointNames(composed.svg,planNameExpectations({...plan,pointNames:{B:'B',C:'C',I:'I',O:'O',A:'A'}})).errors.length,0);
  assert.equal(planNameExpectations({...plan,pointNames:{B:'B'}}).filter(row=>row.owner==='kB__B').length,1);
});

test('E37 angle callout: guide line to the vertex, a radius, the other sides, and plan errors with explicit codes',async()=>{
  const model=await modelOf(fanNodes);
  const guided=fanPlan(fanRow({link:'VERTEX',radius:9,at:'BELOW'}),{coordinateCanvas:{width:640,height:600}}),composed=await composeOf(guided,model);
  expectComposed(composed);
  const guide=tagOf(composed.svg,'kB__g1');assert.equal(attr(guide,'stroke'),'#8a8a8a');assert.equal(attr(guide,'data-role'),'guide');
  const transform=await transformOf(guided,model);
  assert.deepEqual((await observe(composed.svg,fanNodes,guided.planeMarks,guided.displaySegments,transform)).errors,[]);
  assert.ok(codes(await observe(composed.svg.replace(guide,''),fanNodes,guided.planeMarks,guided.displaySegments,transform)).includes('CALLOUT_GUIDE_MISSING'));
  const err=(row,extra)=>specError(fanPlan(row,extra),model);
  assert.equal(err(fanRow({rays:['C']})),'CALLOUT_RAYS_INVALID:kB');
  assert.equal(err(fanRow({rays:['C','B']})),'CALLOUT_RAYS_INVALID:kB');
  assert.equal(err(fanRow({rays:['C','C']})),'CALLOUT_RAYS_INVALID:kB');
  assert.equal(err(fanRow({vertex:undefined})),'CALLOUT_RAYS_INVALID:kB');
  assert.equal(err(fanRow({rays:['C','M']})),'CALLOUT_RAYS_COINCIDE:kB');
  assert.equal(err(fanRow({radius:0})),'CALLOUT_RADIUS_INVALID:kB');
  assert.equal(err(fanRow({link:'ENDS'})),'CALLOUT_LINK_INVALID:kB');
  assert.equal(err(fanRow({path:['C','I']})),'CALLOUT_FIELD_INVALID:kB.path');
  assert.equal(err(fanRow({dimensions:[]})),'CALLOUT_FIELD_INVALID:kB.dimensions');
  assert.equal(err(fanRow({angles:[{id:'aX',refs:['C','I','O'],value:18,label:'18'}]})),'CALLOUT_ANGLE_REFS_INVALID:kB.aX');
  assert.equal(err(fanRow({angles:[{id:'aX',refs:['C','B','M'],value:36,label:'36'}]})),'CALLOUT_TARGET_UNKNOWN:kB.angles:aX');
  assert.equal(err(fanRow({angles:[{id:'aX',refs:['C','B','I'],value:40,label:'40'}]})),'ANGLE_MARK_FACT_MISMATCH:kB__aX:declared=40:drawn=36.000');
});

// ---- path label anchor and side (E37): the leader of a total-length label starts where the author says along the path, and the label stands on the named side of it
const pathPlan=(row,extra={})=>({...trianglePlan(null,{coordinateCanvas:{width:720,height:540}}),planeMarks:{pathLabels:[{id:'pCD',points:['D','G','C'],label:'x=15',unit:'cm',factRole:'DERIVED_INTERMEDIATE',...row}]},...extra});
const leaderOf=(svg,label)=>{const tag=new RegExp('<line\\s[^>]*data-role="leader"[^>]*data-owner-label="'+label+'"[^>]*/>').exec(svg)?.[0];return tag&&['x1','y1','x2','y2'].map(name=>Number(attr(tag,name)));};
const fractionAlong=(svg,leader,names)=>{   // the leader's start, projected on the polyline of the named points, as a fraction of its length
  const pts=names.map(id=>scaled(svg,id)),pieces=pts.slice(1).map((q,i)=>[pts[i],q]),total=pieces.reduce((sum,[a,b])=>sum+Math.hypot(b[0]-a[0],b[1]-a[1]),0);
  let run=0,best=null;
  for(const [a,b] of pieces){
    const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy),t=Math.max(0,Math.min(1,((leader[0]-a[0])*dx+(leader[1]-a[1])*dy)/(length*length)));
    const distance=Math.hypot(leader[0]-(a[0]+dx*t),leader[1]-(a[1]+dy*t));
    if(best===null||distance<best.distance)best={distance,fraction:(run+length*t)/total};
    run+=length;
  }
  return best.fraction;
};
const sideOf=(svg,leader,names,labelId)=>{   // +1 when the label's centre is on the left of the path (first to last point, y down), -1 on the right
  const pts=names.map(id=>scaled(svg,id)),a=pts[0],b=pts[pts.length-1],d=[b[0]-a[0],b[1]-a[1]],tag=tagOf(svg,labelId),m=/translate\(([-\d.]+)[ ,]([-\d.]+)\)/.exec(tag),inner=new RegExp('<g id="'+labelId+'"[^>]*>\\s*<svg[^>]*width="([\\d.]+)"[^>]*height="([\\d.]+)"').exec(svg);
  const centre=[Number(m[1])+Number(inner[1])/2-leader[0],Number(m[2])+Number(inner[2])/2-leader[1]],normal=[d[1],-d[0]];
  return Math.sign(centre[0]*normal[0]+centre[1]*normal[1]);
};

test('E37 path label: anchor START / END / a fraction puts the leader near the first point, the last point or there (END is exercised by the observer and plan checks); side LEFT / RIGHT puts the label on that side of the path; every audit passes',async()=>{
  const model=await modelOf(triangle),names=['D','G','C'];
  const seen=[];
  for(const [anchor,side] of [['START','LEFT'],['START','RIGHT'],[0.3,'LEFT'],[0.3,'RIGHT']]){
    const plan=pathPlan({anchor,side}),composed=await composeOf(plan,model);
    expectComposed(composed);
    const leader=leaderOf(composed.svg,'pCD-label'),want=typeof anchor==='number'?anchor:anchor==='START'?0.15:0.85;
    assert.ok(Math.abs(fractionAlong(composed.svg,leader,names.map(id=>id))-want)<=0.1,'the leader starts at '+anchor+': '+fractionAlong(composed.svg,leader,names));
    assert.equal(sideOf(composed.svg,leader,names,'pCD-label'),side==='LEFT'?1:-1,anchor+' '+side);
    seen.push(leader);
    const transform=await transformOf(plan,model);
    assert.deepEqual((await observe(composed.svg,triangle,plan.planeMarks,plan.displaySegments,transform)).errors,[]);
    if(anchor==='START'){
      assert.ok(codes(await observe(composed.svg,triangle,{pathLabels:[{...plan.planeMarks.pathLabels[0],anchor:'END'}]},plan.displaySegments,transform)).includes('PATH_LABEL_ANCHOR_MISMATCH'));
      assert.ok(codes(await observe(composed.svg,triangle,{pathLabels:[{...plan.planeMarks.pathLabels[0],side:side==='LEFT'?'RIGHT':'LEFT'}]},plan.displaySegments,transform)).includes('PATH_LABEL_SIDE_MISMATCH'));
    }
  }
  assert.ok(Math.hypot(seen[0][0]-seen[2][0],seen[0][1]-seen[2][1])>20,'START (0.15) and 0.3 start the leader apart');
});

test('E37 path label: a plan without anchor and side is the old figure byte for byte; plan errors with explicit codes',async()=>{
  const model=await modelOf(triangle);
  const plain=await composeOf(pathPlan({}),model),again=await composeOf(pathPlan({}),model);
  expectComposed(plain);assert.equal(plain.svg,again.svg);
  const err=row=>specError(pathPlan(row),model);
  assert.equal(err({anchor:'MIDDLE'}),'PATH_LABEL_ANCHOR_INVALID:pCD');
  assert.equal(err({anchor:0}),'PATH_LABEL_ANCHOR_INVALID:pCD');
  assert.equal(err({anchor:1}),'PATH_LABEL_ANCHOR_INVALID:pCD');
  assert.equal(err({anchor:'0.5'}),'PATH_LABEL_ANCHOR_INVALID:pCD');
  assert.equal(err({side:'UP'}),'PATH_LABEL_SIDE_INVALID:pCD');
  assert.equal(specError(pathPlan({closed:true,side:'LEFT'}),model),'PATH_LABEL_SIDE_INVALID:pCD');
});

test('E37 callouts with hidden points: a point drawn with no dot (hiddenPointStyle NONE) leaves the dots of the copies alone, and every audit passes',async()=>{
  const model=await modelOf(triangle),plan=trianglePlan(calloutRow(),{hiddenPointNames:['B'],hiddenPointStyle:'NONE'}),composed=await composeOf(plan,model);
  expectComposed(composed);
  assert.equal(tagOf(composed.svg,'B'),undefined,'the hidden point draws no dot');
  for(const id of ['k1__D','k1__G','k1__C'])assert.ok(tagOf(composed.svg,id),'the copy '+id+' keeps its dot');
});

// ---- (G11) a callout beside a coordinate figure with axes (SOURCE_COORDINATE_AXES_v1): the axes keep the main frame, the copy stands outside it
const division=(id,a,b)=>({...node(id,'DIVISION_POINT',[a,b],'POINT',{m:int(3),n:int(1),mode:'INTERNAL'}),factRole:'DERIVED_INTERMEDIATE'});
const coordGraph={schemaVersion:'construction-spike-v1',realization:{recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false},nodes:[
  {...node('O','NORMALIZATION_ORIGIN',[],'POINT',{}),factRole:'GIVEN'},{...node('U0','NORMALIZATION_AXIS',[],'POINT',{length:int(1)}),factRole:'DERIVED_INTERMEDIATE'},
  {...source('A',6,0),factRole:'GIVEN'},{...source('B',3,6),factRole:'GIVEN'},division('C','O','A'),division('D','A','B'),division('E','B','O')]};
const coordRow=(extra={})=>({id:'k1',kind:'SEGMENT',path:['O','C','A'],at:'RIGHT',scale:1.6,dimensions:[
  {id:'dOC',from:'O',to:'C',label:'3',side:'ABOVE',style:'ARROW',offset:'AUTO',factRole:'GIVEN'},{id:'dCA',from:'C',to:'A',label:'1',side:'ABOVE',style:'ARROW',offset:'AUTO',factRole:'GIVEN'}],...extra});
const coordPlan=(row=coordRow(),extra={})=>({capability:'construction-spike-v1',caption:'좌표평면 위의 삼각형 OAB와 세 변을 3:1로 내분하는 점 C, D, E이다.',mathPlan:coordGraph,displayPoints:['O','A','B','C','D','E'],
  displaySegments:[['sOA','O','A'],['sAB','A','B'],['sBO','B','O'],['sCD','C','D'],['sDE','D','E'],['sEC','E','C']].map(([id,a,b])=>({id,refs:[a,b]})),coordinateLabels:['A'],axisTickValues:{x:[],y:[]},coordinateCanvas:{width:640,height:520},
  planeMarks:{callouts:[row]},...extra});

test('G11 coordinate callout: a segment pulled out of a figure with axes stands outside the axes; every audit passes and the observer holds the axes to the main frame',async()=>{
  const model=await modelOf(coordGraph),plan=coordPlan(),composed=await composeOf(plan,model);
  expectComposed(composed);
  const spec=specFor(plan,model,identity.assetId),frame=spec.displayFacts.axisBounds;
  assert.ok(Array.isArray(frame)&&frame.length===4,'the main frame is passed to the axes');
  const [o,c,a]=['O','C','A'].map(id=>scaled(composed.svg,'k1__'+id));
  assert.ok(Math.abs(Math.hypot(c[0]-o[0],c[1]-o[1])/Math.hypot(a[0]-c[0],a[1]-c[1])-3)<1e-9,'OC : CA = 3 : 1 on the copy');
  // the x-axis ends at the main frame, left of the first copy point
  const xAxis=tagOf(composed.svg,'x-axis'),axisEnd=Math.max(Number(attr(xAxis,'x1')),Number(attr(xAxis,'x2')));
  assert.ok(axisEnd<Math.min(o[0],c[0],a[0]),'the x-axis stops before the copy');
  const transform=await transformOf(plan,model),report=await observe(composed.svg,coordGraph,plan.planeMarks,plan.displaySegments,transform,{axisBounds:frame});
  assert.deepEqual(report.errors,[]);
  // without callouts the same figure is unchanged: no axisBounds, the axes run over the whole frame
  const bare=coordPlan(undefined,{planeMarks:{}});
  expectComposed(await composeOf(bare,model));
  assert.equal(specFor(bare,model,identity.assetId).displayFacts.axisBounds,undefined);
  // plan errors
  assert.equal(specError(coordPlan(coordRow({scale:9})),model),'CALLOUT_SCALE_INVALID:k1');
});

// ---- (G11) angle callout: arcs that follow the drawn rays (arcScale PROPORTIONAL) and an angle dimension (angleDimension), on the fan of 26 왕운중 2학기 중간 q8
test('G11 angle callout: proportional arcs and a dimension arc with arrowheads; every audit passes, the radii follow the drawn rays, and plan errors have explicit codes',async()=>{
  const model=await modelOf(fanNodes),row=fanRow({radius:9,arcScale:'PROPORTIONAL',angleDimension:{text:'x',refs:['I','O']}}),plan=fanPlan(row),composed=await composeOf(plan,model);
  expectComposed(composed);
  const transform=await transformOf(plan,model),report=await observe(composed.svg,fanNodes,plan.planeMarks,plan.displaySegments,transform);
  assert.deepEqual(report.errors,[]);
  // the radii in px: the first arc 0.30 of the ray (no 28 px cap), the dimension arc 1.15 of it
  const vertex=scaled(composed.svg,'kB__B'),ray=Math.hypot(...scaled(composed.svg,'kB__C').map((v,i)=>v-vertex[i]));
  const radius=id=>{const pts=attr(tagOf(composed.svg,id),'points').split(' ').map(p=>p.split(',').map(Number));return Math.hypot(pts[0][0]-vertex[0],pts[0][1]-vertex[1]);};
  assert.ok(Math.abs(radius('kB__aIBC-arc-1')-Math.min(Math.max(0.3*ray,16),0.55*ray))<1e-3&&radius('kB__aIBC-arc-1')>28,'proportional first arc');
  assert.ok(Math.abs(radius('kB__angDim-arc-1')-1.15*ray)<1e-3,'dimension arc');
  assert.equal([...composed.svg.matchAll(/id="kB__angDim-arrow-(from|to)"/g)].length,2,'an arrowhead at each end');
  // tamper: the observer holds the drawing to the declared fields
  const check=async(change,code)=>assert.ok(codes(await observe(composed.svg,fanNodes,{callouts:[JSON.parse(JSON.stringify(fanRow({...row,...change})))]},plan.displaySegments,transform)).includes(code),code);
  await check({angleDimension:{text:'x',refs:['I','O'],radiusFactor:1.4}},'CALLOUT_ANGLE_DIMENSION_GEOMETRY_MISMATCH');
  await check({angleDimension:{text:'y',refs:['I','O']}},'CALLOUT_ANGLE_DIMENSION_LABEL_MISMATCH');
  // without the new fields the callout is the old figure (arcs capped at 28 px)
  const old=await composeOf(fanPlan(),model);expectComposed(old);
  const oldVertex=scaled(old.svg,'kB__B'),oldPts=attr(tagOf(old.svg,'kB__aIBC-arc-1'),'points').split(' ').map(p=>p.split(',').map(Number));
  assert.ok(Math.hypot(oldPts[0][0]-oldVertex[0],oldPts[0][1]-oldVertex[1])<=28+1e-6);
  // the old drawing (arcs capped at 28 px) declared PROPORTIONAL is refused
  assert.ok(codes(await observe(old.svg,fanNodes,{callouts:[fanRow({arcScale:'PROPORTIONAL'})]},plan.displaySegments,transform)).includes('CALLOUT_ARC_SCALE_MISMATCH'));
  const err=extra=>specError(fanPlan(fanRow({radius:9,...extra})),model);
  assert.equal(err({arcScale:'FIXED'}),'CALLOUT_ARC_SCALE_INVALID:kB');
  assert.equal(err({angleDimension:{text:'',refs:['I','O']}}),'CALLOUT_ANGLE_DIMENSION_INVALID:kB');
  assert.equal(err({angleDimension:{text:'x',refs:['I','O'],radiusFactor:2}}),'CALLOUT_ANGLE_DIMENSION_INVALID:kB');
  assert.equal(err({angleDimension:{text:'x'}}),'CALLOUT_ANGLE_DIMENSION_INVALID:kB');          // four rays: the two of the angle must be named
  assert.equal(err({angleDimension:{text:'x',refs:['I','M']}}),'CALLOUT_ANGLE_DIMENSION_INVALID:kB');
  assert.equal(specError(trianglePlan(calloutRow({arcScale:'PROPORTIONAL'})),await modelOf(triangle)),'CALLOUT_ARC_SCALE_INVALID:k1');
  assert.equal(specError(trianglePlan(calloutRow({angleDimension:{text:'x'}})),await modelOf(triangle)),'CALLOUT_ANGLE_DIMENSION_INVALID:k1');
  assert.equal(err({angleDimension:{text:'36°',refs:['I','O']}}),'ANGLE_MARK_FACT_MISMATCH:kB__angDim:declared=36:drawn=18.000');       // a degree text is the drawn value
});

// ---- (G11) path label: a narrow vertex leaves the first round no place; the second round slides the anchor, goes farther out and marks its leader (25 왕운중 2학기 기말 q6)
const narrow=plane([source('A',6,8),source('B',0,0),node('C','SOURCE_POINT',[],'POINT',{coordinates:[frac(219,13),frac(-23,13)]}),{...node('D','MIDPOINT',['A','B'],'POINT',{}),factRole:'GIVEN'},{...node('G','CENTROID',['A','B','C'],'POINT',{}),factRole:'GIVEN'}]);
const narrowPlan=(row,extra={})=>({capability:'construction-spike-v1',caption:'중선 CD 위에서 CG=10 cm, GD=5 cm이고 전체 CD=x=15 cm이다.',mathPlan:narrow,displayPoints:['A','B','C','D','G'],
  displaySegments:triangleSegments,coordinateCanvas:{width:640,height:440},planeMarks:{pathLabels:[{id:'pCD',points:['C','G','D'],label:'x=15',unit:'cm',factRole:'DERIVED_INTERMEDIATE',...row}]},...extra});

test('G11 path label: where every first-round place fails (narrow vertex C) the second round finds one on a marked leader; leader NEVER stops with PATH_LABEL_NO_ROOM; every audit passes',async()=>{
  const model=await modelOf(narrow),names=['C','G','D'];
  const plan=narrowPlan({anchor:0.2,side:'LEFT'}),composed=await composeOf(plan,model);
  expectComposed(composed);
  assert.equal([...composed.svg.matchAll(/data-path-label-fallback="1"/g)].length,1,'the second-round leader is marked');
  const leader=leaderOf(composed.svg,'pCD-label'),drawn=fractionAlong(composed.svg,leader,names);
  assert.ok(Math.abs(drawn-0.2)<=0.26,'the leader starts within 0.26 of the declared anchor: '+drawn);
  const transform=await transformOf(plan,model);
  assert.deepEqual((await observe(composed.svg,narrow,plan.planeMarks,plan.displaySegments,transform)).errors,[]);
  // the marker is what widens the tolerance: without it the leader is held to the first round's 0.1 (when it lies farther than that)
  if(Math.abs(drawn-0.2)>0.1)assert.ok(codes(await observe(composed.svg.replace(' data-path-label-fallback="1"',''),narrow,plan.planeMarks,plan.displaySegments,transform)).includes('PATH_LABEL_ANCHOR_MISMATCH'));
  // leader NEVER: no second round
  const never=await composeOf(narrowPlan({anchor:0.2,side:'LEFT',leader:'NEVER'}),model);
  assert.equal(never.status,'PATH_LABEL_NO_ROOM');assert.equal(never.detail.id,'pCD');
  assert.ok(codes(await observe(composed.svg,narrow,{pathLabels:[{...plan.planeMarks.pathLabels[0],leader:'NEVER'}]},plan.displaySegments,transform)).includes('PATH_LABEL_NO_ROOM'));
  // a figure whose first round succeeds is the same with or without the field, and carries no marker
  const first=await composeOf(narrowPlan({anchor:0.5,side:'RIGHT'}),model),firstNever=await composeOf(narrowPlan({anchor:0.5,side:'RIGHT',leader:'NEVER'}),model);
  expectComposed(first);assert.equal(first.svg,firstNever.svg);assert.ok(!first.svg.includes('data-path-label-fallback'));
  assert.equal(specError(narrowPlan({leader:'ALWAYS'}),model),'PATH_LABEL_LEADER_INVALID:pCD');
});

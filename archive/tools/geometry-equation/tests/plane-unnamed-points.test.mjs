// Unnamed points on an axis-free plane figure (PLANE_FIGURE_v1): hiddenPointNames may list a SOURCE_POINT, and the optional hiddenPointStyle
// "NONE" draws the hidden points with no dot at all. The independent primitive observer reads the unmarked ids from the PLAN and checks the final SVG
// (a dot where the plan says none FAILS, a missing dot on an ordinary point FAILS). Real SymPy/Cindy workers and real Chrome; the typography policy is
// the same FIXTURE as plane-marks.test.mjs. Run with --test-concurrency=1.
import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {reconstruct} from '../production/cindy-observer.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {requestedProfileTypographyPolicy} from '../production/display-envelope.mjs';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';
import {unmarkedPointIds,textNamesPoint,planNameTexts} from '../production/plane-marks.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {int,node} from './construction-v1-fixture.mjs';

const OBSERVER=fileURLToPath(new URL('../production/primitive-observer-worker.py',import.meta.url));
const rect=(width,height)=>({x:20,y:30,width,height});
const OBSERVATION={status:'PASS',synthetic:false,runtime:'playwright-chromium',profiles:[['small',126,105],['medium',174,145],['large',216,180],['full',384,320]].map(([sizeClass,width,height])=>({sizeClass,status:'PASS',imageRect:rect(width,height),naturalWidth:384,naturalHeight:320}))};
const policy=requestedProfileTypographyPolicy({requestedSizeClass:'full',intrinsicSvg:{width:384,height:320},observation:OBSERVATION});
const identity=assetIdentity('l1_unit_exam|1','SOLUTION_VISUAL','decisive-relation');
const source=(id,x,y)=>node(id,'SOURCE_POINT',[],'POINT',{coordinates:[int(x),int(y)]});
const polar=(id,center,reference,length,angleDeg)=>({...node(id,'POLAR_POINT',[center,reference],'POINT',{length:int(length),angleDeg:int(angleDeg),turn:'CCW'}),factRole:'DERIVED_INTERMEDIATE'});

// A folded-paper figure with no point names: a straight line L-F-R, a fold line FT (dashed) and a flap line FE; F, R, L are source points,
// T and E are derived. Angle R-F-T = 70, T-F-E = 70, E-F-L = 40.
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes:[
  source('F',0,0),source('R',3,0),source('L',-3,0),polar('T','F','R',3,70),polar('E','F','R',3,140)]};
const planeMarks={angles:[
  {id:'ax1',refs:['R','F','T'],value:70,label:'x',arcs:2,equalGroup:1},{id:'ax2',refs:['T','F','E'],value:70,label:'x',arcs:2,equalGroup:1},
  {id:'a40',refs:['E','F','L'],value:40,label:'40',arcs:1,ring:2,factRole:'GIVEN'}]};
const planOf=extra=>({capability:'construction-spike-v1',caption:'접는 선이 140°를 같은 두 각 x로 나눈다.',mathPlan:graph,
  displayPoints:['F','R','L','T','E'],displayLines:[],displayCircles:[],
  displaySegments:[{id:'sL',refs:['L','F']},{id:'sR',refs:['F','R']},{id:'sFold',refs:['F','T'],dashed:true},{id:'sFlap',refs:['F','E']}],
  planeMarks,hiddenPointNames:['F','R','L','T','E'],...extra});
const clone=value=>JSON.parse(JSON.stringify(value));

let model,browser;
before(async()=>{
  const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;
  browser=await launchBrowser();
});
after(async()=>{await browser?.close();});
const compose=(plan,worker)=>composeConstructionCandidate({plan,model,identity,typographyPolicy:policy,browser,...(worker?{worker}:{})});
const dots=svg=>[...svg.matchAll(/<circle\b[^>]*data-role="point"[^>]*>/gu)].map(match=>match[0]);
const nameLabels=svg=>(svg.match(/data-label-kind="POINT_NAME"/gu)||[]).length;
const specError=plan=>{try{specFor(plan,model,identity.assetId);}catch(error){return String(error.message);}assert.fail('specFor accepted the plan');};
// A worker that lets prepare/build run for real and edits the built SVG: the static observer (always the real one) must then catch the edit.
const tamper=edit=>async(payload,options)=>{const response=await pythonWorker(payload,options);if(payload?.action==='build'){response.result.svg=edit(response.result.svg);}return response;};

test('hiding every point (SOURCE_POINT included) with hiddenPointStyle NONE draws no dot and no name, and every audit passes',async()=>{
  const plan=planOf({hiddenPointStyle:'NONE'});
  const composed=await compose(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  assert.equal(composed.renderedLayout.status,'PASS',JSON.stringify(composed.renderedLayout.errors));
  assert.deepEqual(dots(composed.svg),[]);assert.equal(nameLabels(composed.svg),0);
  assert.equal((composed.svg.match(/<circle\b/gu)||[]).length,0,'no dot-like circle anywhere');
  for(const id of ['sL','sR','sFold','sFlap','ax1','ax2','a40'])assert.ok(composed.svg.includes('id="'+id+'"')||composed.svg.includes('data-mark-id="'+id+'"'),id+' is still drawn');
  assert.deepEqual(unmarkedPointIds(plan),['F','R','L','T','E']);
});

test('the default hiddenPointStyle DOT keeps a bare dot (no name) at a hidden SOURCE_POINT, and the observer still requires every dot',async()=>{
  const composed=await compose(planOf());
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(dots(composed.svg).length,5);assert.equal(nameLabels(composed.svg),0);
  assert.deepEqual(unmarkedPointIds(planOf()),[],'DOT is the old behaviour: the observer expects every dot');
  assert.deepEqual(unmarkedPointIds(planOf({hiddenPointStyle:'DOT'})),[]);
  // the same plan with a dot removed is a POINT_MISSING failure of the real observer
  const removed=await compose(planOf(),tamper(svg=>svg.replace(/<circle id="L"[^>]*\/>/u,'')));
  assert.equal(removed.status,'STATIC_PRIMITIVE_AUDIT_FAIL');assert.ok(removed.staticAudit.errors.includes('POINT_MISSING:L'),JSON.stringify(removed.staticAudit.errors));
});

test('NONE hides only the listed points: a named point keeps its dot and its name',async()=>{
  const plan=planOf({hiddenPointNames:['R','L','T','E'],hiddenPointStyle:'NONE',pointNames:{F:'A'}});
  const composed=await compose(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  const found=dots(composed.svg);assert.equal(found.length,1);assert.match(found[0],/id="F"/u);assert.equal(nameLabels(composed.svg),1);
  // the kept point's dot is required: removing it is POINT_MISSING:F even though the other dots are legitimately absent
  const removed=await compose(plan,tamper(svg=>svg.replace(/<circle id="F"[^>]*\/>/u,'')));
  assert.equal(removed.status,'STATIC_PRIMITIVE_AUDIT_FAIL');assert.deepEqual(removed.staticAudit.errors,['POINT_MISSING:F']);
});

test('observer: a dot at a point the plan hides is a FAIL, whatever its id or role, and a stray point marker is a FAIL',async()=>{
  const plan=planOf({hiddenPointStyle:'NONE'});
  // appended before the LAST </svg> (the label fragments are nested svg elements)
  const dotAt=(svg,cx,cy,id,role='point')=>{const end=svg.lastIndexOf('</svg>');return svg.slice(0,end)+`<circle id="${id}" data-role="${role}" stroke="#111" stroke-width="0.8" fill="#111" cx="${cx}" cy="${cy}" r="3.2"/>`+svg.slice(end);};
  // where F is drawn: the vertex of the angle fan (the first sector's vertex), taken from the DOT build of the same plan
  const dotted=await compose(planOf());assert.equal(dotted.status,'COMPOSED');
  const F=/<circle id="F"[^>]* cx="([^"]+)" cy="([^"]+)"/u.exec(dotted.svg),[cx,cy]=[F[1],F[2]];
  const same=await compose(plan,tamper(svg=>dotAt(svg,cx,cy,'F')));
  assert.equal(same.status,'STATIC_PRIMITIVE_AUDIT_FAIL');assert.ok(same.staticAudit.errors.includes('HIDDEN_POINT_MARKER_PRESENT:F'),JSON.stringify(same.staticAudit.errors));
  const renamed=await compose(plan,tamper(svg=>dotAt(svg,cx,cy,'junk')));
  assert.equal(renamed.status,'STATIC_PRIMITIVE_AUDIT_FAIL');
  assert.ok(renamed.staticAudit.errors.includes('HIDDEN_POINT_MARKER_AT_POINT:F'),JSON.stringify(renamed.staticAudit.errors));assert.ok(renamed.staticAudit.errors.includes('UNEXPECTED_POINT_MARKER:junk'));
  const unroled=await compose(plan,tamper(svg=>dotAt(svg,cx,cy,'plain','indicator')));
  assert.ok(unroled.staticAudit.errors.includes('HIDDEN_POINT_MARKER_AT_POINT:F'),'a small filled circle with another role is still a dot at the point');
  const stray=await compose(plan,tamper(svg=>dotAt(svg,10,10,'stray')));
  assert.deepEqual(stray.staticAudit.errors,['UNEXPECTED_POINT_MARKER:stray']);
});

test('observer: the unmarked ids come from the plan; the same dotted SVG fails once the plan says NONE, and an unknown id is refused',async()=>{
  const dotted=await compose(planOf());assert.equal(dotted.status,'COMPOSED');
  const prepared=await pythonWorker({action:'prepare',spec:specFor(planOf(),model,identity.assetId)});assert.equal(prepared.status,'OK');
  const peer=reconstruct(graph).points,base={svg:dotted.svg,points:peer,lines:null,circles:null,segments:planOf().displaySegments,rightAngles:[],transform:prepared.result.coordinateModel,fragments:{},coordinateMode:'SOURCE_COORDINATES'};
  const audit=async unmarkedPoints=>{const response=await pythonWorker({action:'staticAudit',...base,unmarkedPoints},{script:OBSERVER});assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;};
  const codes=report=>report.errors.filter(error=>/^(HIDDEN|UNEXPECTED|UNMARKED|POINT_MISSING)/u.test(error));
  assert.deepEqual(codes(await audit([])),[],'no unmarked ids: the dotted figure is exactly what the old observer accepted');
  const none=await audit(['F','R','L','T','E']);
  assert.deepEqual(codes(none).filter(error=>error.startsWith('HIDDEN_POINT_MARKER_PRESENT')).sort(),['E','F','L','R','T'].map(id=>'HIDDEN_POINT_MARKER_PRESENT:'+id));
  assert.ok(none.errors.some(error=>error.startsWith('HIDDEN_POINT_MARKER_AT_POINT:')));
  assert.ok(codes(await audit(['Z'])).includes('UNMARKED_POINT_UNKNOWN:Z'));
  const bad=await pythonWorker({action:'staticAudit',...base,unmarkedPoints:'F'},{script:OBSERVER});assert.equal(bad.status,'ERROR');assert.equal(bad.result.code,'INVALID_UNMARKED_POINTS');
});

test('plan checks: what a SOURCE_POINT may be hidden for, and every explicit rejection code',()=>{
  const ok=plan=>assert.ok(specFor(plan,model,identity.assetId),'accepted');
  ok(planOf());ok(planOf({hiddenPointStyle:'NONE'}));ok(planOf({hiddenPointStyle:'DOT'}));
  // a hidden point cannot also be named or coordinate-labelled
  assert.equal(specError(planOf({pointNames:{F:'A'}})),'POINT_NAME_TARGET_HIDDEN:F');
  assert.equal(specError(planOf({coordinateLabels:['F']})),'INVALID_HIDDEN_POINT_NAMES');
  // a hidden point unknown to the figure
  assert.equal(specError(planOf({hiddenPointNames:['F','Z']})),'INVALID_HIDDEN_POINT_NAMES');
  // a caption or a label text that writes the id of a hidden SOURCE_POINT
  assert.equal(specError(planOf({caption:'점 F를 지나는 접는 선이다.'})),'HIDDEN_POINT_NAMED_IN_TEXT:F');
  assert.equal(specError(planOf({caption:{math:'AFB'}})),'HIDDEN_POINT_NAMED_IN_TEXT:F');
  const labelled=(where,row)=>{const marks=clone(planeMarks);where(marks,row);return planOf({planeMarks:marks});};
  assert.equal(specError(labelled(marks=>{marks.angles[0].label='F';})),'HIDDEN_POINT_NAMED_IN_TEXT:F');
  assert.equal(specError(labelled(marks=>{marks.expressionLabels=[{id:'tLR',ownerSegment:'sR',text:'FR'}];})),'HIDDEN_POINT_NAMED_IN_TEXT:F');
  // x, degree values and TeX commands do not name a point; a TeX command with capitals is ignored
  ok(planOf({caption:'\\angle x와 \\Delta 40°이다.'}));
  // style values and where NONE is allowed
  assert.equal(specError(planOf({hiddenPointStyle:'DASH'})),'INVALID_HIDDEN_POINT_STYLE');
  assert.equal(specError(planOf({hiddenPointStyle:'none'})),'INVALID_HIDDEN_POINT_STYLE');
  assert.equal(specError(planOf({hiddenPointNames:[],hiddenPointStyle:'NONE'})),'HIDDEN_POINT_STYLE_WITHOUT_HIDDEN_POINTS');
  assert.equal(specError({...planOf({hiddenPointStyle:'NONE'}),hiddenPointNames:undefined}),'HIDDEN_POINT_STYLE_WITHOUT_HIDDEN_POINTS');
});

test('plan checks: the derived-point rule is unchanged; a coordinate figure (axes) now also hides a SOURCE_POINT and takes hiddenPointStyle NONE (E19)',async()=>{
  // a DERIVED_INTERMEDIATE point on a plane figure is still hidden as before; a GIVEN/CONCLUSION derived point is still refused
  const given={...graph,nodes:graph.nodes.map(item=>item.id==='T'?{...item,factRole:'GIVEN'}:item)};
  const givenModel=(await pythonWorker({action:'construction',graph:given},{timeoutMs:90000})).result;
  const refused=plan=>{try{specFor(plan,givenModel,identity.assetId);}catch(error){return String(error.message);}return null;};
  assert.equal(refused({...planOf(),mathPlan:given}),'INVALID_HIDDEN_POINT_NAMES');
  assert.equal(refused({...planOf({hiddenPointNames:['F','R','L','E']}),mathPlan:given}),null);
  // a coordinate figure (axes) hides points the same way (E19): a SOURCE_POINT may be a hidden point there, and NONE draws no dot
  const derived=(id,op,inputs,type,args={})=>({...node(id,op,inputs,type,args),factRole:'DERIVED_INTERMEDIATE'});
  const coordinate={schemaVersion:'construction-spike-v1',realization:{recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false},nodes:[
    derived('O','NORMALIZATION_ORIGIN',[],'POINT'),derived('X','NORMALIZATION_AXIS',[],'POINT',{length:int(1)}),source('A',5,0),source('P',3,3),
    derived('lOA','LINE_THROUGH',['O','A'],'LINE'),derived('H','PERPENDICULAR_FOOT',['P','lOA'],'POINT')]};
  const coordinateModel=(await pythonWorker({action:'construction',graph:coordinate},{timeoutMs:90000})).result;
  const coordinatePlan=extra=>({capability:'construction-spike-v1',caption:'좌표평면 위의 두 점이다.',mathPlan:coordinate,displayPoints:['O','A','P','H'],displayLines:[],displayCircles:[],coordinateCanvas:{width:640,height:480},
    displaySegments:[{id:'sOA',refs:['O','A']},{id:'sOP',refs:['O','P']},{id:'sPH',refs:['P','H']}],axisTickValues:{x:[],y:[]},...extra});
  const refusedCoordinate=plan=>{try{specFor(plan,coordinateModel,identity.assetId);}catch(error){return String(error.message);}return null;};
  assert.equal(refusedCoordinate(coordinatePlan({hiddenPointNames:['H']})),null,'a derived hidden point on a coordinate figure is unchanged');
  assert.equal(refusedCoordinate(coordinatePlan({hiddenPointNames:['A']})),null,'a SOURCE_POINT may be a hidden point on a coordinate figure (its name only is hidden)');
  assert.equal(refusedCoordinate({...coordinatePlan({hiddenPointNames:['A']}),caption:'점 A는 x축 위에 있다.'}),'HIDDEN_POINT_NAMED_IN_TEXT:A','... and a text still naming it is refused, as on a plane figure');
  assert.equal(refusedCoordinate(coordinatePlan({hiddenPointNames:['H'],hiddenPointStyle:'NONE'})),null);
  assert.equal(refusedCoordinate(coordinatePlan({hiddenPointNames:['H'],hiddenPointStyle:'DOT'})),null);
  assert.deepEqual(unmarkedPointIds(coordinatePlan({hiddenPointNames:['H'],hiddenPointStyle:'NONE'})),['H'],'the observer is told to expect no dot at the hidden point of a coordinate figure');
});

test('text helpers: a point id is named only as a name, never inside words, numbers or TeX commands',()=>{
  assert.equal(textNamesPoint('점 A의 크기','A'),true);assert.equal(textNamesPoint('AB=5','B'),true);assert.equal(textNamesPoint('AB=5','A'),true);
  assert.equal(textNamesPoint('x=40','A'),false);assert.equal(textNamesPoint('\\angle x','A'),false);assert.equal(textNamesPoint('\\Delta','D'),false);
  assert.equal(textNamesPoint("A'B",'A'),false,'A prime is another point');assert.equal(textNamesPoint('A_1','A'),false);assert.equal(textNamesPoint('A1','A'),false);
  assert.equal(textNamesPoint('T1 선','T1'),true);assert.equal(textNamesPoint('abc','a'),false);assert.equal(textNamesPoint('a선','a'),true);
  assert.deepEqual(planNameTexts({caption:{text:'가',math:'x'},planeMarks:{angles:[{label:'40'}],arcs:[{label:'a'}],regions:[{label:'(가)'}],expressionLabels:[{text:'3'}]},scalarLabels:[{prefix:'AB',unit:'cm'}]}),['가','x','40','a','(가)','3','AB','cm']);
});

// (G3) Plane vectors: vector names in labels (vec(a), vec(AB)), planeMarks.vectors, planeMarks.vectorOps (sum, difference, scalar multiple).
// Real SymPy/Cindy workers and real Chrome, like plane-marks.test.mjs; the typography policy is the same FIXTURE. Run with --test-concurrency=1.
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
import {expandPlaneVectors} from '../production/plane-vectors.mjs';
import {int,node} from './construction-v1-fixture.mjs';

const OBSERVER=fileURLToPath(new URL('../production/plane-marks-observer-worker.py',import.meta.url));
const rect=(width,height)=>({x:20,y:30,width,height});
const OBSERVATION={status:'PASS',synthetic:false,runtime:'playwright-chromium',profiles:[['small',126,105],['medium',174,145],['large',216,180],['full',384,320]].map(([sizeClass,width,height])=>({sizeClass,status:'PASS',imageRect:rect(width,height),naturalWidth:384,naturalHeight:320}))};
const policy=requestedProfileTypographyPolicy({requestedSizeClass:'full',intrinsicSvg:{width:384,height:320},observation:OBSERVATION});
const identity=assetIdentity('l1_unit_exam|1','SOLUTION_VISUAL','decisive-relation');
const source=(id,x,y)=>node(id,'SOURCE_POINT',[],'POINT',{coordinates:[int(x),int(y)]});
const clone=value=>JSON.parse(JSON.stringify(value));
const codes=report=>report.errors.map(error=>error.split(':')[0]);

// triangle A(0,0) B(6,0) C(2,4): vectors from A
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes:[source('A',0,0),source('B',6,0),source('C',2,4)]};
const planOf=(planeMarks,extra={})=>({capability:'construction-spike-v1',caption:'세 점 A, B, C이다.',mathPlan:clone(graph),displayPoints:['A','B','C'],displayLines:[],
  displaySegments:[{id:'sAB',refs:['A','B']},{id:'sAC',refs:['A','C']},{id:'sBC',refs:['B','C']}],planeMarks,...extra});

let model,browser;
before(async()=>{
  const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;
  browser=await launchBrowser();
});
after(async()=>{await browser?.close();});
const compose=async(plan,m=model)=>composeConstructionCandidate({plan,model:m,identity,typographyPolicy:policy,browser});
const observe=async(plan,svg,m=model,{points,planeMarks}={})=>{
  const prepared=await pythonWorker({action:'prepare',spec:specFor(plan,m,identity.assetId)});assert.equal(prepared.status,'OK');
  const response=await pythonWorker({action:'planeMarksAudit',svg,points:points??reconstruct(plan.mathPlan).points,marks:planeMarks??plan.planeMarks,segments:plan.displaySegments,transform:prepared.result.coordinateModel},{script:OBSERVER});
  assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;
};
const specError=(plan,m=model)=>{try{specFor(plan,m,identity.assetId);}catch(error){return String(error.message);}assert.fail('specFor accepted the plan');};
const texOf=(svg,id)=>new RegExp('<g id="'+id+'"[^>]*data-tex="([^"]*)"').exec(svg)?.[1];

// ---- feature 1: vector names in labels
test('G3-1: vec(a) and vec(AB) labels are typeset with a vector arrow and read back by the observer',async()=>{
  const marks={expressionLabels:[{id:'ta',ownerSegment:'sAB',text:'vec(a)'},{id:'tb',ownerSegment:'sAC',text:'vec(AC)'},{id:'tc',ownerSegment:'sBC',text:'2vec(a)-vec(AB)',labelAt:0.6}]};
  const plan=planOf(marks),composed=await compose(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  assert.equal(texOf(composed.svg,'ta'),'\\vec{a}');assert.equal(texOf(composed.svg,'tb'),'\\overrightarrow{AC}');assert.equal(texOf(composed.svg,'tc'),'2\\vec{a}-\\overrightarrow{AB}');
  assert.deepEqual((await observe(plan,composed.svg)).errors,[]);
  // tamper: the label says another vector than the plan, or loses its arrow
  const wrong=clone(marks);wrong.expressionLabels[0].text='vec(b)';
  assert.ok(codes(await observe(plan,composed.svg,model,{planeMarks:wrong})).includes('VECTOR_LABEL_TEX_MISMATCH'));
  const plain=composed.svg.replace('data-tex="\\vec{a}"','data-tex="a"');
  assert.ok(codes(await observe(plan,plain)).includes('VECTOR_LABEL_TEX_MISMATCH'));
  const unknown=clone(marks);unknown.expressionLabels[1].text='vec(AZ)';
  assert.ok(codes(await observe(plan,composed.svg,model,{planeMarks:unknown})).includes('VECTOR_LABEL_UNKNOWN_POINT'));
  // a free text label (textLabels) beside a point also takes a vector name
  const free=planOf({textLabels:[{id:'fl',at:'C',text:'vec(a)+vec(b)',anchor:'E'}]});const freeComposed=await compose(free);
  assert.equal(freeComposed.status,'COMPOSED',JSON.stringify(freeComposed.detail));assert.equal(texOf(freeComposed.svg,'fl'),'\\vec{a}+\\vec{b}');
});

test('G3-1: bad vector names are refused before drawing',()=>{
  const label=text=>specError(planOf({expressionLabels:[{id:'ta',ownerSegment:'sAB',text}]}));
  for(const text of ['vec()','vec(ab)','vec(vec(a))','vec(1)','vec(A)','vec(AAB)','vec(a'])assert.match(label(text),/^VECTOR_LABEL_INVALID:ta$/,text);
  assert.match(label('vec(AZ)'),/^VECTOR_LABEL_UNKNOWN_POINT:ta$/);
});

// ---- feature 2: planeMarks.vectors
const modelOf=async plan=>{const response=await pythonWorker({action:'construction',graph:plan.mathPlan},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;};
const built=async(marks,extra={displaySegments:[]})=>{const plan=expandPlaneVectors(planOf(marks,extra)),m=await modelOf(plan);return {plan,model:m,composed:await compose(plan,m)};};
const retag=(svg,id,change)=>{const tag=new RegExp('<(?:polyline|line|polygon|circle)\\s(?:[^>]*\\s)?id="'+id+'"[^>]*/>').exec(svg)[0];return svg.replace(tag,change(tag));};
const VECTORS={vectors:[{id:'va',from:'A',to:'B',label:'vec(a)'},{id:'vb',from:'A',to:'C',label:'vec(b)'},{id:'vd',from:'C',to:'B',label:'vec(CB)',emphasis:'ACCENT'}]};

test('G3-2: vectors are arrows that end on their point; an end point that starts no arrow draws no dot; the observer reads all of it back',async()=>{
  const {plan,model:m,composed}=await built(VECTORS);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  for(const id of ['va','vb','vd'])assert.ok(composed.svg.includes('id="'+id+'-arrow-end"'),id);
  assert.ok(!composed.svg.includes('-arrow-start"'));
  // A starts arrows (a dot); B ends two arrows and starts none (no dot); C starts one arrow (a dot)
  assert.ok(/<circle[^>]*\bid="A"/.test(composed.svg),'A keeps its dot');
  assert.ok(!/<circle[^>]*\bid="B"/.test(composed.svg),'B draws no dot');assert.ok(/<circle[^>]*\bid="C"/.test(composed.svg),'C keeps its dot');
  assert.ok(composed.svg.includes('id="B-name"'),'B keeps its name');
  assert.deepEqual((await observe(plan,composed.svg,m)).errors,[]);
});

test('G3-2: tamper - a reversed arrow, a dot on the tip and a moved head make the observer fail',async()=>{
  const {plan,model:m,composed}=await built(VECTORS);
  // the arrow drawn the other way (head at the tail)
  const reversed=retag(composed.svg,'va',tag=>tag.replace(/x1="([^"]*)" y1="([^"]*)" x2="([^"]*)" y2="([^"]*)"/,'x1="$3" y1="$4" x2="$1" y2="$2"'));
  assert.ok(codes(await observe(plan,reversed,m)).includes('VECTOR_DIRECTION_MISMATCH'));
  // a head that stands off its end
  const moved=retag(composed.svg,'vb-arrow-end',tag=>tag.replace(/points="([^"]*)"/,(all,pts)=>'points="'+pts.split(' ').map(pair=>{const [x,y]=pair.split(',').map(Number);return (x+6)+','+y;}).join(' ')+'"'));
  assert.ok(codes(await observe(plan,moved,m)).includes('VECTOR_DIRECTION_MISMATCH'));
  // a dot on the tip B
  const at=/<polygon[^>]*id="va-arrow-end"[^>]*points="([^ ]+)/.exec(composed.svg)[1].split(',');
  const dotted=composed.svg.replace('</svg>','<circle id="Bdot" data-role="point" cx="'+at[0]+'" cy="'+at[1]+'" r="3.5" fill="#111"/></svg>');
  assert.ok(codes(await observe(plan,dotted,m)).includes('VECTOR_TIP_DOT_PRESENT'));
  // the plan says another end point than the drawing
  const other=clone(plan.planeMarks);other.vectors[0].to='C';
  assert.ok(codes(await observe(plan,composed.svg,m,{planeMarks:other})).includes('VECTOR_DIRECTION_MISMATCH'));
});

test('G3-2: vector rows with a bad end, a repeat or components on a plane figure are refused',()=>{
  const code=marks=>{try{expandPlaneVectors(planOf(marks));}catch(error){return String(error.message);}return 'ACCEPTED';};
  assert.match(code({vectors:[{id:'va',from:'A',to:'A'}]}),/^VECTOR_ENDPOINT_INVALID:va$/);
  assert.match(code({vectors:[{id:'va',from:'A',to:'Z'}]}),/^VECTOR_ENDPOINT_INVALID:va$/);
  assert.match(code({vectors:[{id:'va',from:'A',to:'B'},{id:'vb',from:'A',to:'B'}]}),/^VECTOR_DUPLICATE:vb$/);
  assert.match(code({vectors:[{id:'va',from:'A',to:'B',components:true}]}),/^VECTOR_COMPONENTS_REQUIRE_AXES:va$/);
  assert.match(code({vectors:[{id:'sAB',from:'A',to:'B'}]}),/^MARK_ID_DUPLICATE:sAB$/);
  assert.match(code({vectors:[{id:'va',from:'A',to:'B',colour:'red'}]}),/^MARK_FIELD_UNKNOWN:vectors\.colour$/);
});

test('G3-2: a vector row on a plan that was not unfolded is refused',()=>{
  assert.match(specError(planOf(VECTORS)),/^VECTOR_PLAN_NOT_EXPANDED:va$/);
});

// ---- feature 2 on a coordinate figure: the position vector and its components
const derivedNode=(id,op,inputs,type,args={})=>({...node(id,op,inputs,type,args),factRole:'DERIVED_INTERMEDIATE'});
const coordGraph={schemaVersion:'construction-spike-v1',realization:{recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false},nodes:[
  derivedNode('O','NORMALIZATION_ORIGIN',[],'POINT'),derivedNode('X','NORMALIZATION_AXIS',[],'POINT',{length:int(1)}),source('P',3,2)]};
const coordPlan=(planeMarks,extra={})=>({capability:'construction-spike-v1',caption:'좌표평면 위의 점 P이다.',mathPlan:clone(coordGraph),displayPoints:['O','P'],displayLines:[],coordinateCanvas:{width:640,height:480},
  displaySegments:[],axisTickValues:{x:[],y:[]},planeMarks,...extra});
const COMPONENTS={vectors:[{id:'vp',from:'O',to:'P',label:'vec(a)',components:true,componentLabels:['3','2']}]};

test('G3-2: a position vector with components - dashed perpendiculars to both axes, feet without dots, numbered feet',async()=>{
  const plan=expandPlaneVectors(coordPlan(COMPONENTS)),m=await modelOf(plan),composed=await compose(plan,m);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  for(const id of ['vp-cx','vp-cy'])assert.ok(new RegExp('<line[^>]*id="'+id+'"[^>]*stroke-dasharray').test(composed.svg)||new RegExp('<line[^>]*stroke-dasharray[^>]*id="'+id+'"').test(composed.svg),id+' is dashed');
  assert.ok(!/<circle[^>]*\bid="vp(?:Fx|Fy)"/.test(composed.svg),'the feet draw no dot');assert.ok(!/<circle[^>]*\bid="P"/.test(composed.svg),'the tip P draws no dot');
  assert.ok(composed.svg.includes('id="vp-cx-text"')&&composed.svg.includes('id="vp-cy-text"'),'the component numbers stand beside the feet');
  const report=await observe(plan,composed.svg,m);assert.deepEqual(report.errors,[]);
  // tamper: a dashed line that is not perpendicular to its axis, a foot that is off the axis, a dot on a foot
  const slanted=retag(composed.svg,'vp-cx',tag=>tag.replace(/x2="([^"]*)"/,(all,x)=>'x2="'+(Number(x)+8)+'"'));
  assert.ok(codes(await observe(plan,slanted,m)).includes('VECTOR_COMPONENT_MISMATCH'));
  const lifted=retag(composed.svg,'vp-cy',tag=>tag.replace(/y2="([^"]*)"/,(all,y)=>'y2="'+(Number(y)-5)+'"'));
  assert.ok(codes(await observe(plan,lifted,m)).includes('VECTOR_COMPONENT_MISMATCH'));
});

test('G3-2: a position vector whose tip lies on an axis has no component to draw',async()=>{
  const g=clone(coordGraph);g.nodes.push(source('Q',3,0));
  const plan=expandPlaneVectors({...coordPlan({vectors:[{id:'vq',from:'O',to:'Q',components:true}]},{displayPoints:['O','P','Q']}),mathPlan:g});
  assert.match(specError(plan,await modelOf(plan)),/^VECTOR_COMPONENT_DEGENERATE:vq$/);
});

test('G3-2: a dot on an axis foot and a callout that would copy an arrow without its head',async()=>{
  const plan=expandPlaneVectors(coordPlan(COMPONENTS)),m=await modelOf(plan),composed=await compose(plan,m);
  const tag=/<line\s(?:[^>]*\s)?id="vp-cx"[^>]*\/>/.exec(composed.svg)[0],x2=/x2="([^"]*)"/.exec(tag)[1],y2=/y2="([^"]*)"/.exec(tag)[1];
  const dotted=composed.svg.replace('</svg>','<circle id="foot-dot" data-role="point" cx="'+x2+'" cy="'+y2+'" r="3.5" fill="#111"/></svg>');
  assert.ok(codes(await observe(plan,dotted,m)).includes('VECTOR_COMPONENT_MISMATCH'));
  const withCallout=expandPlaneVectors(planOf({vectors:[{id:'va',from:'A',to:'B'}],callouts:[{id:'c1',kind:'SEGMENT',path:['A','B']}]},{displaySegments:[]}));
  assert.match(specError(withCallout,await modelOf(withCallout)),/^CALLOUT_VECTOR_UNSUPPORTED:c1$/);
});

// ---- feature 3: planeMarks.vectorOps
const BASE=[{id:'va',from:'A',to:'B',label:'vec(a)'},{id:'vb',from:'A',to:'C',label:'vec(b)'}];
const opMarks=(...ops)=>({vectors:BASE,vectorOps:ops});
const place=(m,id)=>m.points[id].approximation;
const shiftEnd=(index,dx,dy)=>tag=>[['x'+index,dx],['y'+index,dy]].reduce((text,[name,delta])=>{const hit=new RegExp('\\s'+name+'="([^"]*)"').exec(text);return text.replace(hit[0],' '+name+'="'+(Number(hit[1])+delta)+'"');},tag);

test('G3-3: SUM draws D=B+C-A, the parallelogram sides and the sum arrow; the observer recomputes all of it',async()=>{
  const {plan,model:m,composed}=await built(opMarks({id:'s1',op:'SUM',of:['va','vb'],point:'D',guides:'PARALLELOGRAM',label:'vec(a)+vec(b)'}));
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  assert.deepEqual(place(m,'D'),[8,4]);
  assert.deepEqual(m.points.D.exact.map(v=>v.value),['8','4']);
  for(const id of ['s1','s1-g1','s1-g2'])assert.ok(new RegExp('<line[^>]*id="'+id+'"').test(composed.svg),id);
  assert.ok(composed.svg.includes('id="s1-arrow-end"')&&!composed.svg.includes('id="s1-g1-arrow-end"'),'the sum has a head, its dashed sides have none');
  assert.ok(composed.svg.includes('id="D-name"')&&!/<circle[^>]*\bid="D"/.test(composed.svg),'D keeps its name and draws no dot');
  assert.equal(texOf(composed.svg,'s1-text'),'\\vec{a}+\\vec{b}');
  assert.deepEqual((await observe(plan,composed.svg,m)).errors,[]);
  // tamper: the peer puts D elsewhere, a dashed side is no longer parallel to the opposite vector
  const peer=reconstruct(plan.mathPlan).points;
  assert.ok(Math.hypot(peer.D[0]-8,peer.D[1]-4)<1e-9,'the independent peer agrees');
  const moved={...peer,D:[peer.D[0]+0.6,peer.D[1]]};
  assert.ok(codes(await observe(plan,composed.svg,m,{points:moved})).includes('VECTOR_SUM_POINT_MISMATCH'));
  const tilted=retag(composed.svg,'s1-g1',shiftEnd(1,0,14));
  assert.ok(codes(await observe(plan,tilted,m)).includes('VECTOR_SUM_GUIDE_NOT_PARALLEL'));
  const shortArrow=retag(composed.svg,'s1',shiftEnd(2,-12,0));
  assert.ok(codes(await observe(plan,shortArrow,m)).includes('VECTOR_SUM_POINT_MISMATCH'));
});

test('G3-3: SUM with TRIANGLE guides draws the second vector again from the end of the first; an existing point may be the sum point',async()=>{
  const {plan,model:m,composed}=await built(opMarks({id:'s1',op:'SUM',of:['va','vb'],guides:'TRIANGLE',label:'vec(a)+vec(b)'}));
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  assert.ok(composed.svg.includes('id="s1-g1-arrow-end"'),'the repeated second vector has its head');
  assert.deepEqual(place(m,'vs1P'),[8,4]);
  assert.ok(!composed.svg.includes('id="vs1P-name"'),'the nameless sum point is not named');
  assert.deepEqual((await observe(plan,composed.svg,m)).errors,[]);
  const wrongSide=retag(composed.svg,'s1-g1',shiftEnd(1,0,14));
  assert.ok(codes(await observe(plan,wrongSide,m)).includes('VECTOR_SUM_GUIDE_NOT_PARALLEL'));
  // the sum ends at a point the figure already has: it must be exactly B+C-A
  const quad=clone(graph);quad.nodes.push(source('E',8,4),source('F',8,5));
  const same={...planOf({vectors:BASE,vectorOps:[{id:'s1',op:'SUM',of:['va','vb'],point:'E'}]},{displaySegments:[]}),mathPlan:quad,displayPoints:['A','B','C','E','F']};
  const ok=expandPlaneVectors(same),okModel=await modelOf(ok);assert.doesNotThrow(()=>specFor(ok,okModel,identity.assetId));
  const other=expandPlaneVectors({...same,mathPlan:quad,displayPoints:['A','B','C','E','F'],planeMarks:{vectors:BASE,vectorOps:[{id:'s1',op:'SUM',of:['va','vb'],point:'F'}]}});
  assert.match(specError(other,await modelOf(other)),/^VECTOR_SUM_POINT_MISMATCH:s1$/);
});

test('G3-3: DIFF is the arrow from the end of the second vector to the end of the first',async()=>{
  const {plan,model:m,composed}=await built(opMarks({id:'d1',op:'DIFF',of:['va','vb'],label:'vec(a)-vec(b)'}));
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  assert.equal(texOf(composed.svg,'d1-text'),'\\vec{a}-\\vec{b}');
  assert.deepEqual((await observe(plan,composed.svg,m)).errors,[]);
  const reversed=retag(composed.svg,'d1',tag=>tag.replace(/x1="([^"]*)" y1="([^"]*)" x2="([^"]*)" y2="([^"]*)"/,'x1="$3" y1="$4" x2="$1" y2="$2"'));
  assert.ok(codes(await observe(plan,reversed,m)).includes('VECTOR_DIFF_MISMATCH'));
  const wrongRows=clone(plan.planeMarks);wrongRows.vectorOps[0].of=['vb','va'];
  assert.ok(codes(await observe(plan,composed.svg,m,{planeMarks:wrongRows})).includes('VECTOR_DIFF_MISMATCH'));
});

test('G3-3: SCALE puts P=A+k(B-A) on the line of the vector, exactly, for a whole and a fractional k',async()=>{
  for(const [k,expected,label] of [['2',[12,0],'2vec(a)'],['-1/2',[-3,0],'-vec(a)/2'],['3/2',[9,0],'3vec(a)/2']]){
    const {plan,model:m,composed}=await built({vectors:[BASE[0],BASE[1]],vectorOps:[{id:'k1',op:'SCALE',of:['va'],k,point:'P',label}]});
    assert.equal(composed.status,'COMPOSED',k+' '+JSON.stringify(composed.detail));
    assert.equal(composed.staticAudit.planeMarks.status,'PASS',k+' '+JSON.stringify(composed.staticAudit.planeMarks.errors));
    assert.deepEqual(place(m,'P'),expected,k);
    assert.deepEqual((await observe(plan,composed.svg,m)).errors,[],k);
    if(k==='2'){
      const peer=reconstruct(plan.mathPlan).points;assert.ok(Math.hypot(peer.P[0]-12,peer.P[1])<1e-9,'the independent peer agrees');
      assert.ok(codes(await observe(plan,composed.svg,m,{points:{...peer,P:[peer.P[0],peer.P[1]+0.8]}})).includes('VECTOR_SCALE_MISMATCH'));
      const wrongK=clone(plan.planeMarks);wrongK.vectorOps[0].k='3';
      assert.ok(codes(await observe(plan,composed.svg,m,{planeMarks:wrongK})).includes('VECTOR_SCALE_MISMATCH'));
    }
  }
});

test('G3-3: operations on vectors that do not fit are refused with their own codes',async()=>{
  const code=(marks,extra)=>{try{expandPlaneVectors(planOf(marks,extra));}catch(error){return String(error.message);}return 'ACCEPTED';};
  const twoStarts=[BASE[0],{id:'vc',from:'B',to:'C'}];
  assert.match(code({vectors:twoStarts,vectorOps:[{id:'s1',op:'SUM',of:['va','vc'],point:'D'}]},{displaySegments:[]}),/^VECTOR_OP_REQUIRES_COMMON_START:s1$/);
  assert.match(code({vectors:twoStarts,vectorOps:[{id:'d1',op:'DIFF',of:['va','vc']}]},{displaySegments:[]}),/^VECTOR_OP_REQUIRES_COMMON_START:d1$/);
  assert.match(code({vectors:BASE,vectorOps:[{id:'s1',op:'SUM',of:['va','vz'],point:'D'}]},{displaySegments:[]}),/^VECTOR_OP_UNKNOWN_VECTOR:s1:vz$/);
  for(const k of ['0','x','1','1/0','2.5',undefined])assert.match(code({vectors:BASE,vectorOps:[{id:'k1',op:'SCALE',of:['va'],k,point:'P'}]},{displaySegments:[]}),/^VECTOR_SCALE_INVALID:k1$/,String(k));
  assert.match(code({vectors:BASE,vectorOps:[{id:'s1',op:'SUM',of:['va'],point:'D'}]},{displaySegments:[]}),/^MARK_FIELD_INVALID:vectorOps\.of:s1$/);
  assert.match(code({vectors:BASE,vectorOps:[{id:'d1',op:'DIFF',of:['va','vb'],guides:'PARALLELOGRAM'}]},{displaySegments:[]}),/^MARK_FIELD_INVALID:vectorOps\.guides:d1$/);
  // two vectors on one line make no parallelogram: refused by the exact construction
  const flat=clone(graph);flat.nodes.push(source('E',4,0));
  const plan=expandPlaneVectors({...planOf({vectors:[BASE[0],{id:'vb',from:'A',to:'E'}],vectorOps:[{id:'s1',op:'SUM',of:['va','vb'],point:'D'}]},{displaySegments:[]}),mathPlan:flat,displayPoints:['A','B','E']});
  const response=await pythonWorker({action:'construction',graph:plan.mathPlan},{timeoutMs:90000});
  assert.notEqual(response.status,'OK');assert.match(JSON.stringify(response.result),/VECTOR_SUM_DEGENERATE/);
});

// ---- vector accent never clipped; a head that ends on a dotted point stops at the dot's edge
import {typesetter,pathExtentX,accentInk} from '../production/typography.mjs';
test('G3-4: the box of a \\vec label holds the whole accent, for all 26 letters and two-letter names; other labels keep their box',()=>{
  const typeset=typesetter(),identityRow={visualAssetKey:'sha256:test'};
  const fragment=(tex,id)=>typeset({id,owner:'o',factRole:'GIVEN',kind:'MATH',tex,fontPx:16},identityRow);
  const inkOf=svg=>{
    const width=Number(/<svg[^>]* width="([^"]*)"/.exec(svg)[1]),scale=/translate\(([-\d.e]+) [-\d.e]+\) scale\(([-\d.e]+)\)/.exec(svg),tx=Number(scale[1]),s=Number(scale[2]);
    const parts=[...svg.matchAll(/<g data-mml-node="mo" transform="([^"]*)"><path data-c="20D7" d="([^"]*)"/g)];
    assert.ok(parts.length>=1,'an accent is drawn');
    return parts.map(part=>{const shift=[...part[1].matchAll(/translate\(\s*(-?[\d.]+)[ ,]/g)].reduce((sum,t)=>sum+Number(t[1]),0),ext=pathExtentX(part[2]);return {width,left:tx+s*(shift+ext.left),right:tx+s*(shift+ext.right)};});
  };
  const letters='abcdefghijklmnopqrstuvwxyz'.split('');
  for(const letter of letters)for(const ink of inkOf(fragment('\\vec{'+letter+'}','l'+letter).svg)){assert.ok(ink.left>=-0.01&&ink.right<=ink.width+0.01,letter+' accent '+ink.left.toFixed(2)+'..'+ink.right.toFixed(2)+' in '+ink.width.toFixed(2));}
  for(const name of ['AB','DB','AF'])assert.ok(fragment('\\overrightarrow{'+name+'}','n'+name).intrinsic.width>0);
  // the same letter without an accent keeps the MathJax box exactly
  const plainD=fragment('d','plain'),accentD=fragment('\\vec{d}','accent');
  assert.ok(accentD.intrinsic.width>plainD.intrinsic.width,'the box with the accent is wider than the bare letter');
  assert.equal(accentInk('<g data-mml-node="mi"></g>'),null);
});

test('G3-4: the observer refuses a vector label whose accent leaves its box',async()=>{
  const marks={expressionLabels:[{id:'td',ownerSegment:'sAB',text:'vec(d)'}]};
  const plan=planOf(marks),composed=await compose(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.deepEqual((await observe(plan,composed.svg)).errors,[]);
  const label=/<g id="td"[^>]*>\s*<svg[^>]* width="([^"]*)"/.exec(composed.svg);
  const narrow=composed.svg.replace(label[0],label[0].replace('width="'+label[1]+'"','width="'+(Number(label[1])*0.6).toFixed(3)+'"'));
  assert.ok(codes(await observe(plan,narrow)).includes('VECTOR_LABEL_ACCENT_CLIPPED'));
});

test('G3-4: a vector head that ends on a dotted point stops on the dot edge; the observer holds it to that',async()=>{
  const {plan,model:m,composed}=await built({vectors:[{id:'va',from:'A',to:'B'},{id:'vb',from:'B',to:'C'}]});
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  const dot=/<circle[^>]*id="B"[^>]*\/>/.exec(composed.svg)[0],cx=Number(/cx="([^"]*)"/.exec(dot)[1]),cy=Number(/cy="([^"]*)"/.exec(dot)[1]),r=Number(/ r="([^"]*)"/.exec(dot)[1]);
  const tip=/<polygon[^>]*id="va-arrow-end"[^>]*points="([^ ]+)/.exec(composed.svg)[1].split(',').map(Number);
  assert.ok(Math.abs(Math.hypot(tip[0]-cx,tip[1]-cy)-r)<=0.5,'the tip lies on the dot edge');
  assert.deepEqual((await observe(plan,composed.svg,m)).errors,[]);
  // a head pushed under the dot (on the point itself) or short of the dot is refused
  const onPoint=retag(composed.svg,'va-arrow-end',tag=>tag.replace(/points="([^ ]+) /,'points="'+cx+','+cy+' '));
  assert.ok(codes(await observe(plan,onPoint,m)).includes('SEGMENT_ARROW_TIP_OFF_END'));
});

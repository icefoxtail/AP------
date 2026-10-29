// Chrome-using (composes the figures): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {renderPlan} from '../production/render-plan.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveContainerFill,containerFillSize,containerFillSpec,composeContainerFillFigure,checkContainerFillPlan,FIGURE_CAPABILITY} from '../production/container-fill-v1.mjs';

const observer=fileURLToPath(new URL('../production/container-fill-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const refuse=(container,expected)=>assert.throws(()=>solveContainerFill(container),code(expected),expected);
const plan=container=>({capability:FIGURE_CAPABILITY,container,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'container'}],newVisualInformation:['n']});
const cyl=(radius,height)=>({kind:'CYLINDER',radius,height});
const fru=(r0,r1,height)=>({kind:'FRUSTUM',r0,r1,height});
const pair=(...profile)=>({vessel:{profile}});
// 25 연향중 2학기 중간 중1 4: A widens upward, B a wide low cylinder under a thin tube, C a cylinder; each with its graph name
const three={pairs:[
  {vessel:{name:'A',profile:[fru('2','3','4')]},graphName:'㉠',segmentNotes:[{segment:0,text:'점점 느려짐'}]},
  {vessel:{name:'B',profile:[cyl('3','2'),cyl('1','4')]},graphName:'㉢',segmentNotes:[{segment:0,text:'넓음 → 느림'},{segment:1,text:'좁음 → 빠름'}]},
  {vessel:{name:'C',profile:[cyl('5/2','5')]},graphName:'㉡',segmentNotes:[{segment:0,text:'일정한 비율'}]}],
  guides:true,xTitle:'시간(초)',yTitle:'높이(cm)'};
// 23 금당중 2학기 중간 중1 5: a wide cylinder under a thinner one
const neck={pairs:[{vessel:{profile:[cyl('4','4'),cyl('2','3')]},segmentNotes:[{segment:0,text:'단면 넓음 → 천천히'},{segment:1,text:'단면 좁음 → 빠르게'}]}],guides:true,xTitle:'시간(초)',yTitle:'높이(cm)'};
// a cone with its point down under a cylinder, with numeric ticks and a stated inflow of 3 pi per second
const ticks={pairs:[{vessel:{name:'물통',profile:[fru('0','3','3'),cyl('3','2')]},flowPi:'3',xTicks:['3','9'],yTicks:['3','5']}],guides:true,xTitle:'시간(초)',yTitle:'높이(cm)'};
// a funnel: it narrows upward, so the curve gets steeper and steeper
const funnel={pairs:[{vessel:{name:'깔때기',profile:[fru('4','2','5')]}}]};

test('the engine derives the volumes, times and boundary heights of every vessel exactly',()=>{
  const m=solveContainerFill(neck);
  assert.deepEqual(m.pairs[0].z,['0','4','7']);assert.deepEqual(m.pairs[0].vol,['0','64','76']);
  assert.equal(m.pairs[0].volume,'76');assert.equal(m.pairs[0].maxRadius,'4');assert.equal(m.pairs[0].time,null);
  assert.equal(m.xTitle,'시간(초)');assert.equal(solveContainerFill({pairs:[pair(cyl('1','1'))]}).xTitle,'시간');assert.equal(solveContainerFill({pairs:[pair(cyl('1','1'))]}).yTitle,'높이');
  const t=solveContainerFill(three);
  assert.deepEqual(t.pairs[1].vol,['0','18','22']);              // 9 pi * 2 and pi * 4
  assert.deepEqual(t.pairs[0].vol,['0','76/3']);                  // h (r0^2 + r0 r1 + r1^2) / 3 = 4 * 19 / 3
  assert.deepEqual(t.pairs[2].vol,['0','31.25']);
  assert.equal(solveContainerFill({pairs:[pair(fru('2','4','5'))]}).pairs[0].volume,'140/3');
  assert.equal(solveContainerFill({pairs:[pair(fru('0','3','3'))]}).pairs[0].volume,'9');
  const k=solveContainerFill(ticks).pairs[0];
  assert.deepEqual(k.vol,['0','9','27']);assert.deepEqual(k.time,['0','3','9']);assert.deepEqual(k.xTicks,['3','9']);assert.deepEqual(k.yTicks,['3','5']);
  assert.deepEqual(solveContainerFill({pairs:[{...neck.pairs[0],flowPi:'2'}]}).pairs[0].time,['0','32','38']);
});

test('vessels and figures that cannot be drawn faithfully are refused with their codes',()=>{
  const one=(extra={},profile=[cyl('2','3')])=>({pairs:[{vessel:{profile},...extra}]});
  refuse({pairs:[]},'CONTAINER_PAIR_COUNT_INVALID');
  refuse({pairs:[pair(cyl('1','1')),pair(cyl('1','1')),pair(cyl('1','1')),pair(cyl('1','1'))]},'CONTAINER_PAIR_COUNT_INVALID');
  refuse({pairs:[pair()]},'CONTAINER_PROFILE_INVALID');
  refuse({pairs:[pair(cyl('1','1'),cyl('1','1'),cyl('1','1'),cyl('1','1'),cyl('1','1'))]},'CONTAINER_PROFILE_INVALID');
  refuse(one({},[{kind:'CYLINDER',radius:'2',height:'3',extra:1}]),'CONTAINER_PROFILE_INVALID');
  refuse(one({},[{kind:'FRUSTUM',r0:'1',height:'3'}]),'CONTAINER_DIMENSION_INVALID');
  refuse(one({},[{kind:'CYLINDER',radius:'2'}]),'CONTAINER_DIMENSION_INVALID');
  refuse(one({},[{kind:'PYRAMID',base:'2',height:'3'}]),'CONTAINER_PIECE_KIND_UNSUPPORTED');
  for(const kind of ['SPHERE','HEMISPHERE','BULB'])refuse(one({},[{kind,radius:'2'}]),'CONTAINER_CURVED_PROFILE_UNSUPPORTED');
  refuse(one({},[{kind:'CYLINDER',radius:'2',height:'3',offset:'1'}]),'CONTAINER_ASYMMETRIC_UNSUPPORTED');
  refuse({pairs:[{vessel:{tilt:'10',profile:[cyl('2','3')]}}]},'CONTAINER_ASYMMETRIC_UNSUPPORTED');
  refuse(one({},[cyl('0','3')]),'CONTAINER_DIMENSION_INVALID');
  refuse(one({},[cyl('2','-3')]),'CONTAINER_DIMENSION_INVALID');
  refuse(one({},[cyl('abc','3')]),'CONTAINER_DIMENSION_INVALID');
  refuse(one({},[fru('1','-2','3')]),'CONTAINER_DIMENSION_INVALID');
  refuse(one({},[fru('3','0','3')]),'CONTAINER_APEX_UNSUPPORTED');                    // a point at the top closes the vessel
  refuse(one({},[cyl('2','3'),fru('0','2','3')]),'CONTAINER_APEX_UNSUPPORTED');       // a point above the first piece
  refuse(one({vessel:undefined}),'CONTAINER_PLAN_INVALID');
  refuse({pairs:[{vessel:{profile:[cyl('2','3')]},extra:1}]},'CONTAINER_PLAN_INVALID');
  refuse({pairs:[pair(cyl('1','1'))],extra:1},'CONTAINER_PLAN_INVALID');
  refuse({pairs:[pair(cyl('1','1'))],guides:'yes'},'CONTAINER_PLAN_INVALID');
  refuse(one({vessel:{name:'일곱글자이름입니다',profile:[cyl('2','3')]}}),'CONTAINER_NAME_INVALID');
  refuse(one({graphName:''}),'CONTAINER_NAME_INVALID');
  refuse(one({flowPi:'0'}),'CONTAINER_FLOW_INVALID');
  refuse(one({flowPi:'x'}),'CONTAINER_FLOW_INVALID');
  refuse(one({xTicks:['1']}),'CONTAINER_XTICKS_NEED_FLOW');
  refuse(one({flowPi:'1',xTicks:['13']}),'CONTAINER_TICK_INVALID');                    // total time is 12
  refuse(one({flowPi:'1',xTicks:['5','5']}),'CONTAINER_TICK_INVALID');
  refuse(one({yTicks:['4']}),'CONTAINER_TICK_INVALID');                                // the vessel is 3 high
  refuse(one({yTicks:['2','1']}),'CONTAINER_TICK_INVALID');
  refuse(one({yTicks:['0']}),'CONTAINER_TICK_INVALID');
  refuse(one({segmentNotes:[{segment:1,text:'x'}]}),'CONTAINER_SEGMENT_NOTE_INVALID');
  refuse(one({segmentNotes:[{segment:0,text:'x'},{segment:0,text:'y'}]}),'CONTAINER_SEGMENT_NOTE_INVALID');
  refuse(one({segmentNotes:[{segment:0,text:'열일곱글자를넘는아주긴설명문입니다'}]}),'CONTAINER_SEGMENT_NOTE_INVALID');
  refuse(one({segmentNotes:[{segment:0}]}),'CONTAINER_SEGMENT_NOTE_INVALID');
  refuse({pairs:[pair(cyl('1','1'))],xTitle:'열다섯글자를넘는매우긴축이름입니다'},'CONTAINER_TITLE_INVALID');
  assert.throws(()=>checkContainerFillPlan({...plan(neck),extra:1}),code('CONTAINER_PLAN_INVALID'));
  assert.throws(()=>checkContainerFillPlan({...plan(neck),capability:'other'}),code('CONTAINER_PLAN_INVALID'));
  assert.throws(()=>containerFillSpec(plan(neck),{...solveContainerFill(neck),guides:false}),code('CONTAINER_MODEL_MISMATCH'));
});

test('proportions that cannot be drawn legibly are refused when the figure is laid out',()=>{
  const size=container=>containerFillSize(solveContainerFill(container));
  assert.throws(()=>size({pairs:[pair(cyl('30','1'),cyl('1','4'))]}),code('CONTAINER_PROPORTION_UNSUPPORTED'));   // a thin tube 1 against 30: narrower than 6 px
  assert.throws(()=>size({pairs:[pair(cyl('2','1'),cyl('2','60'))]}),code('CONTAINER_PROPORTION_UNSUPPORTED'));   // a slab 1 against 60: under 12 px
  assert.throws(()=>size({pairs:[pair(cyl('1','60'),cyl('3','1'))]}),code('CONTAINER_PROPORTION_UNSUPPORTED'));
  assert.throws(()=>size({pairs:[pair(cyl('1','10'),cyl('30','10'))]}),code('CONTAINER_PROPORTION_UNSUPPORTED'));   // pieces tall enough, but the thin one is 5 px wide
  assert.throws(()=>size({pairs:[pair(cyl('10','10'),cyl('2','3'))]}),code('CONTAINER_PROPORTION_UNSUPPORTED'));    // the neck holds 1% of the water: its kink would sit 2 px from the end
  const s=size(three);
  assert.equal(s.width,548);assert.ok(Number.isInteger(s.height));assert.ok(s.height>size(neck).height);
});

const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
test('every figure composes, the independent observer passes it, and it catches a wrong curve, guide, kink, scale, name or note',async()=>{
  const browser=await launchBrowser();
  try{
    const compose=async(container,n)=>{
      const p=plan(container),model=solveContainerFill(container);
      const composed=await composeContainerFillFigure({plan:p,model,identity:assetIdentity('25_테스트|'+n,'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.renderedLayout.status,'PASS');
      assert.equal(composed.schemaVersion,'construction-candidate-svg-v1');
      return composed.svg;
    };
    const audit=async(container,svg)=>(await pythonWorker({container,svg},{script:observer})).result;
    const edit=(svg,id,attr,fn)=>{const re=new RegExp(`(id="${id}"[^>]*? ${attr}=")([^"]*)(")`);assert.ok(re.test(svg),id);return svg.replace(re,(m,a,v,z)=>a+fn(v)+z);};
    const bump=(svg,id,attr,delta)=>edit(svg,id,attr,v=>Number(v)+delta);
    // three rows: a widening cup, a wide slab under a tube, a cylinder
    let svg=await compose(three,1);
    const pass=await audit(three,svg);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
    assert.equal(pass.observed.length,3);
    const moveVertex=(id,k,dx,dy)=>edit(svg,id,'points',v=>v.split(' ').map((p,i)=>{if(i!==k)return p;const [x,y]=p.split(',').map(Number);return (x+dx)+','+(y+dy);}).join(' '));
    assert.ok(has(await audit(three,moveVertex('curve-0',4,2,0)),'CF_CURVE_POINT:0:4'));        // a vertex off the exact curve of the cup
    assert.ok(has(await audit(three,moveVertex('curve-1',1,0,-6)),'CF_CURVE_POINT:1:1'));        // the kink of the vessel with the tube moved up
    assert.ok(has(await audit(three,bump(svg,'break-1-1','cx',7)),'CF_BREAK_POINT:1:1'));
    const shiftGuide=(id)=>{const re=new RegExp(`(id="${id}(?:~\\d+)?"[^>]*? y1=")([^"]*)("[^>]*? y2=")([^"]*)(")`);assert.ok(re.test(svg),id);return svg.replace(re,(m,a,y1,b,y2,z)=>a+(Number(y1)+3)+b+(Number(y2)+3)+z);};
    assert.ok(has(await audit(three,shiftGuide('guide-1-1')),'CF_GUIDE_NOT_LEVEL:1:1'));
    assert.ok(has(await audit(three,edit(svg,'vessel-fill-1','points',v=>v.replace(/^[^ ]+/,m=>{const [x,y]=m.split(',').map(Number);return (x+9)+','+y;}))),'CF_VESSEL_SHAPE:1'));
    assert.ok(has(await audit(three,svg.replace(/(id="vessel-name-2"[^>]*data-text=")C/,'$1B')),'CF_NAME_MISMATCH:vessel-name-2'));
    assert.ok(has(await audit(three,svg.replace(/(id="graph-name-0"[^>]*data-text=")㉠/,'$1㉡')),'CF_NAME_MISMATCH:graph-name-0'));
    assert.ok(has(await audit(three,edit(svg,'segment-note-1-1','data-box',v=>{const [x,y,w,h]=v.split(',').map(Number);return [x-170,y+110,w,h].join(',');})),'CF_NOTE_'));   // the note of the tube moved far from its piece
    // the same figure read against another vessel: the observer finds the silhouette and the curve wrong
    const other={...three,pairs:[three.pairs[0],{...three.pairs[1],vessel:{name:'B',profile:[cyl('3','2'),cyl('3/2','4')]}},three.pairs[2]]};
    const wrong=await audit(other,svg);assert.ok(has(wrong,'CF_VESSEL_SHAPE:1'));assert.ok(has(wrong,'CF_CURVE_POINT:1'));
    assert.ok(has(await audit({...three,guides:false},svg),'CF_GUIDE_UNEXPECTED'));
    // a wide slab under a neck, one row, notes
    svg=await compose(neck,2);
    const nk=await audit(neck,svg);assert.equal(nk.status,'PASS',JSON.stringify(nk.errors));
    // a cone point down under a cylinder, with numeric ticks from the stated inflow
    svg=await compose(ticks,3);
    const tk=await audit(ticks,svg);assert.equal(tk.status,'PASS',JSON.stringify(tk.errors));
    assert.ok(has(await audit({pairs:[{...ticks.pairs[0],flowPi:'2'}]},svg),'CF_X_TICK_POSITION:0'));
    assert.ok(has(await audit({pairs:[{...ticks.pairs[0],xTicks:['3']}]},svg),'CF_X_TICK_SET:0'));
    assert.ok(has(await audit({pairs:[{...ticks.pairs[0],yTicks:['3','4']}]},svg),'CF_Y_TICK_SET:0'));
    assert.ok(has(await audit(ticks,bump(svg,'x-tick-0-1','x1',6)),'CF_X_TICK_'));
    // the funnel: steeper and steeper
    svg=await compose(funnel,4);
    const fn=await audit(funnel,svg);assert.equal(fn.status,'PASS',JSON.stringify(fn.errors));
    // a curve drawn convex where the vessel gives a concave one: reflect every vertex of the funnel curve about the chord
    const flat=edit(svg,'curve-0','points',v=>{const pts=v.split(' ').map(p=>p.split(',').map(Number)),a=pts[0],b=pts.at(-1);return pts.map(([x,y])=>{const t=(y-a[1])/(b[1]-a[1]);return (2*(a[0]+t*(b[0]-a[0]))-x)+','+y;}).join(' ');});
    assert.ok(has(await audit(funnel,flat),'CF_CURVE_POINT:0'));
  }finally{await browser.close();}
});

test('a long note finds its place beside its piece or the figure is refused with the note code',async()=>{
  const browser=await launchBrowser();
  try{
    const compose=async(container)=>composeContainerFillFigure({plan:plan(container),model:solveContainerFill(container),identity:assetIdentity('25_테스트|9','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
    const crowded={pairs:[{...neck.pairs[0],segmentNotes:[{segment:0,text:'열여섯글자까지는쓸수있는아주긴설'},{segment:1,text:'열여섯글자까지는쓸수있는아주긴설'}]}]};
    const result=await compose(crowded);
    assert.equal(result.status,'CONTAINER_NOTE_NO_ROOM');
    assert.match(result.detail.labelId,/^segment-note-0-/);
    const clipped=await compose({pairs:[pair(cyl('2','3'))],xTitle:'열네글자를쓰면오른쪽을넘어가'});
    assert.equal(clipped.status,'CONTAINER_LABEL_OUT_OF_BOUNDS');
  }finally{await browser.close();}
});

test('render-plan routes a container-fill plan and reports an unsupported vessel at its stage with the engine code',async()=>{
  const out=fs.mkdtempSync(path.join(os.tmpdir(),'container-fill-'));
  const r=await renderPlan({item:{sourcePath:'archive/exams/test-exam.js',ordinal:3,dir:'t'},plan:plan({pairs:[{vessel:{profile:[{kind:'HEMISPHERE',radius:'3'}]}}]}),outDir:out});
  assert.equal(r.status,'FAILED');assert.equal(r.stage,'container-fill');assert.equal(r.capability,FIGURE_CAPABILITY);assert.match(r.detail,/CONTAINER_CURVED_PROFILE_UNSUPPORTED/);
  const tilted=await renderPlan({item:{sourcePath:'archive/exams/test-exam.js',ordinal:3,dir:'t'},plan:plan({pairs:[{vessel:{profile:[{kind:'CYLINDER',radius:'2',height:'3',tilt:'20'}]}}]}),outDir:out});
  assert.equal(tilted.status,'FAILED');assert.match(tilted.detail,/CONTAINER_ASYMMETRIC_UNSUPPORTED/);
});

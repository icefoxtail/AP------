import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {typesetter} from '../production/typography.mjs';
import {checkLinkedExpLogDetail,composeCompositeCandidate,compositePanels} from '../production/composite-candidate-svg-v1.mjs';

const pairFixture=()=>{
  const points=[
    {id:'A',x:'0',y:'0',coordinates:true},
    {id:'M',x:'1',y:'1',coordinates:true,color:'ROSE'},
    {id:'B',x:'2',y:'2',coordinates:true},
  ];
  const edge={id:'AB',from:'A',to:'B',color:'BLUE'};
  return {capability:'composite-panels-v1',caption:'두 역함수와 중점 확대도',
    linkedExpLogDetail:{midpoint:'M',segment:'AB',bisector:'L'},
    panels:[
      {caption:{text:'역함수와 세 점'},plan:{capability:'exp-log-pair-spike-v1',pointNames:{A:'A',B:'B'},graphPlan:{
        family:'exp-log-pair',identityLine:true,
        curves:[
          {id:'f',family:'exponential-affine',base:'sqrt(3)',coefficients:['3','1','-1'],shiftX:'2',sourceDomain:{kind:'ALL_REALS'},formulaLabel:'NAME'},
          {id:'g',family:'logarithmic-affine',base:'sqrt(3)',coefficients:['1','1','1','0'],sourceDomain:{kind:'NATURAL_LOG_AFFINE'},formulaLabel:'NAME'},
        ],
        overlays:{points:[points[0],{...points[1],coordinates:false,unnamed:true},points[2]],segments:[edge],lines:[{id:'L',slope:'-1',intercept:'2'}]},
      }}},
      {caption:{text:'중점 M과 선분 AB'},plan:{capability:'multi-curve-figure-v1',pointNames:{A:'A',M:'M',B:'B'},graphPlan:{
        family:'multi-curve',viewport:[-.5,2.5,-.5,2.5],plotHeightLimit:300,
        curves:[
          {id:'mirror',kind:'LINE',coefficients:['0','1'],domain:['-1/2','5/2'],label:'y=x'},
          {id:'bisector',kind:'LINE',coefficients:['2','-1'],domain:['-1/2','5/2'],label:'x+y=2'},
        ],
        overlays:{points:structuredClone(points),segments:[{...edge,length:true}]},
      }}},
    ]};
};

test('the inverse-curve detail keeps the real Q18 geometry and old mixed-panel refusal',async()=>{
  const plan=pairFixture();
  assert.equal(compositePanels(plan)[1].plan.graphPlan.plotHeightLimit,300);
  const {linkedExpLogDetail,...stock}=plan;
  assert.throws(()=>compositePanels(stock),e=>e.detail?.reason==='COMPOSITE_MULTI_CURVE_PANEL_MIXED_0');
  const result=await checkLinkedExpLogDetail(plan);
  assert.deepEqual(result.points,{A:['0','0'],M:['1','1'],B:['2','2']});
  assert.equal(result.lengthSquared,'8');
  const problem=await composeCompositeCandidate({plan,identity:{surface:'PROBLEM_VISUAL'}});
  assert.equal(problem.detail.code,'LINKED_EXP_LOG_DETAIL_SOLUTION_ONLY');
  const swapped={...plan,panels:[...plan.panels].reverse()};
  assert.throws(()=>compositePanels(swapped),e=>e.detail?.reason==='LINKED_EXP_LOG_DETAIL_SCOPE');
  for(const [edit,code] of [
    [p=>p.panels[1].plan.graphPlan.overlays.points[1].x='3/2','POINT_PARITY:M'],
    [p=>p.panels[1].plan.graphPlan.overlays.segments[0].length=false,'LENGTH_OWNER'],
    [p=>p.panels[1].plan.graphPlan.overlays.segments[0].color='GREEN','MARK_PARITY'],
    [p=>p.panels[0].plan.graphPlan.curves[1].formulaLabel='EQUATION','FORMULA_NAMES'],
    [p=>p.panels[1].plan.graphPlan.overlays.polygons=[],'SCOPE'],
  ]){
    const changed=pairFixture();
    edit(changed);
    await assert.rejects(checkLinkedExpLogDetail(changed),e=>e.detail?.code==='LINKED_EXP_LOG_DETAIL_'+code);
  }
});

test('the detail readback rejects a changed mark, measured length or leader owner',async()=>{
  // The separate panel observers check the full SVGs. These fragments isolate cross-panel readback.
  const geometry='<circle id="A" data-role="point" fill="#111" cx="20" cy="80"/><circle id="M" data-role="point" fill="#b8325f" cx="40" cy="60"/><circle id="B" data-role="point" fill="#111" cx="60" cy="40"/><line id="overlay-segment-AB" data-role="line" stroke="#1f5fa8" x1="20" y1="80" x2="60" y2="40"/>';
  const labels='<g id="M-coordinates" data-owner="M"/><line id="M-coordinates-owner-leader" data-role="leader" data-owner="M" x1="40" y1="60"/><g id="overlay-segment-AB-length" data-owner="overlay-segment-AB"><path data-c="32"/><path data-c="32"/><path data-c="221A"/></g><line id="overlay-segment-AB-length-owner-leader" data-role="leader" data-owner="overlay-segment-AB" x1="50" y1="50"/>';
  const svg=nodes=>'<svg xmlns="http://www.w3.org/2000/svg">'+nodes+'</svg>';
  const inspect=detail=>checkLinkedExpLogDetail(pairFixture(),[svg(geometry),svg(detail)]);
  assert.equal((await inspect(geometry+labels)).status,'PASS');
  for(const [before,after,code] of [
    ['fill="#b8325f"','fill="#111"','SVG_MARK_PARITY:M'],
    ['cx="40"','cx="42"','SVG_MIDPOINT'],
    ['data-c="32"','data-c="33"','SVG_LENGTH_VALUE'],
    ['data-owner="M" x1="40"','data-owner="A" x1="40"','SVG_LEADER_OWNER:M-coordinates'],
  ]){
    await assert.rejects(inspect((geometry+labels).replace(before,after)),e=>e.detail?.code==='LINKED_EXP_LOG_DETAIL_'+code);
  }
});

test('the actual Q18 pair can transfer only exact reference labels to its named coordinate points',async()=>{
  const stock=pairFixture().panels[0].plan;
  const fresh=structuredClone(stock);
  fresh.graphPlan.curves[0].referenceLabelPoint='B';
  fresh.graphPlan.curves[1].referenceLabelPoint='A';
  const invoke=async(payload,options)=>{
    const reply=await pythonWorker(payload,options);
    assert.equal(reply.status,'OK',JSON.stringify(reply.result));
    return reply.result;
  };
  const frame=async graphPlan=>(await invoke({action:'frame_graph',graphPlan})).graphPlan;
  const original=await frame(stock.graphPlan);
  const selected=await frame(fresh.graphPlan);
  const oldModel=await invoke({action:'graph',graphPlan:original});
  const newModel=await invoke({action:'graph',graphPlan:selected});
  assert.deepEqual(newModel,oldModel);
  assert.match(newModel.svg,/id="reference-f"/);
  assert.match(newModel.svg,/id="reference-g"/);
  const before=specFor({...stock,graphPlan:original,caption:'역함수와 두 점'},oldModel,'q18');
  const after=specFor({...fresh,graphPlan:selected,caption:'역함수와 두 점'},newModel,'q18');
  assert.deepEqual(after,{...before,objects:before.objects.filter(row=>!/^reference-[fg]-value$/.test(row.id))});
  const observer=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));
  const inspect=async(svg,action)=>invoke({action,graphPlan:selected,svg,transform:newModel.transform},{script:observer});
  assert.equal((await inspect(newModel.svg,'modelBinding')).status,'PASS');
  const duplicate=newModel.svg.replace('</svg>','<g id="reference-f-value"/></svg>');
  assert.ok((await inspect(duplicate,'graphAudit')).errors.includes('EXP_LOG_PAIR_REFERENCE_LABEL_NOT_SUPPRESSED:f'));
  assert.ok((await inspect(newModel.svg,'graphAudit')).errors.includes('EXP_LOG_PAIR_REFERENCE_OVERLAY_LABEL_MISSING:B'));

  for(const edit of [
    p=>p.curves[0].referenceLabelPoint='A',
    p=>p.overlays.points[2].coordinates=false,
    p=>p.overlays.points[2].x='3/2',
    p=>p.overlays.points[2].unnamed=true,
  ]){
    const invalid=structuredClone(fresh.graphPlan);
    edit(invalid);
    const refusal=await pythonWorker({action:'frame_graph',graphPlan:invalid});
    assert.equal(refusal.result.code,'EXP_LOG_PAIR_REFERENCE_LABEL_POINT_MISMATCH:f');
  }
});

test('Q21 name-only reference owners retain geometry and refuse disclosure or label movement',async()=>{
  const graphPlan={family:'exp-log-pair',identityLine:true,curves:[
    {id:'f',family:'exponential-affine',base:'4',coefficients:['4','1','0'],shiftX:'1',sourceDomain:{kind:'ALL_REALS'},formulaLabel:'NAME',referenceLabelPoint:'A',referenceLabelMode:'NAME'},
    {id:'g',family:'logarithmic-affine',base:'4',coefficients:['1','1/4','0','1'],sourceDomain:{kind:'NATURAL_LOG_AFFINE'},formulaLabel:'NAME',referenceLabelPoint:'B',referenceLabelMode:'NAME'},
  ],overlays:{
    points:[{id:'A',x:'1',y:'4',coordinates:false},{id:'B',x:'4',y:'1',coordinates:false},{id:'C',x:'0',y:'1'},{id:'D',x:'1',y:'0'}],
    lines:[{id:'l',slope:'-1',intercept:'5'}],
    polygons:[{id:'ACDB',points:['A','C','D','B'],fill:'LIGHT'}],
  }};
  const invoke=async(payload,options)=>{
    const reply=await pythonWorker(payload,options);
    assert.equal(reply.status,'OK',JSON.stringify(reply.result));
    return reply.result;
  };
  const legacy={...graphPlan,curves:graphPlan.curves.map(({referenceLabelMode,referenceLabelPoint,...curve})=>curve)};
  const frame=async plan=>(await invoke({action:'frame_graph',graphPlan:plan})).graphPlan;
  const framed=await frame(graphPlan),original=await frame(legacy);
  const model=await invoke({action:'graph',graphPlan:framed});
  const before=await invoke({action:'graph',graphPlan:original});
  assert.deepEqual(model,before);
  const planFor=graph=>({capability:'exp-log-pair-spike-v1',caption:'두 역함수와 사각형의 대칭',graphPlan:graph});
  const identity=assetIdentity('23_매산여고_1학기_중간_고2_수학I|21','SOLUTION_VISUAL','decisive-relation');
  const oldSpec=specFor(planFor(original),before,identity.assetId);
  const spec=specFor(planFor(framed),model,identity.assetId);
  assert.deepEqual(spec,{...oldSpec,objects:oldSpec.objects.filter(row=>!/^reference-[fg]-value$/.test(row.id))});
  const prepared=await invoke({action:'prepare',spec});
  assert.deepEqual(Object.fromEntries(prepared.labels.map(row=>[row.id,row.text])),{
    'axis-x':'x','axis-y':'y','formula-f':'f(x)','formula-g':'g(x)','identity-label':'y=x',
    'overlay-line-l-equation':'y=−x+5','A-name':'A','B-name':'B','C-name':'C','D-name':'D',
  });
  const typeset=typesetter();
  const fragments=Object.fromEntries(prepared.labels.map(label=>[label.id,typeset({
    id:label.id,owner:label.target||label.id,factRole:'DERIVED_INTERMEDIATE',fontPx:20,
    ...(label.math||label.kind==='POINT_NAME'?{kind:'MATH',tex:label.tex||label.text.replaceAll('−','-')}:{kind:'TEXT',text:label.text}),
  },identity)]));
  const measurements=Object.fromEntries(Object.entries(fragments).map(([id,fragment])=>[id,[fragment.intrinsic.width,fragment.intrinsic.height]]));
  const built=await invoke({action:'build',spec,measurements,fragments});
  assert.deepEqual(built.witness.layout.unresolved,[]);
  const observer=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));
  const {aspectPolicy,...coord}=built.witness.coordinateModel;
  const audit=async(svg,action='graphAudit',transform={...coord,displayScale:.6})=>invoke({action,graphPlan:framed,svg,transform},{script:observer});
  assert.equal((await audit(model.svg,'modelBinding',model.transform)).status,'PASS');
  const observed=await audit(built.svg);
  assert.equal(observed.status,'PASS',JSON.stringify(observed.errors));
  for(const [svg,error] of [
    [built.svg.replace(/(<g id="A-name"[^>]*?data-owner=")A"/,'$1B"'),'EXP_LOG_PAIR_REFERENCE_NAME_OWNER_MISMATCH:A'],
    [built.svg.replace(/(<g id="B-name".*?<path[^>]+data-c=")[^"]+"/s,(_match,head)=>head+'41"'),'EXP_LOG_PAIR_REFERENCE_NAME_TEXT_MISMATCH:B'],
    [built.svg.replace(/(<g id="B-name"[^>]*?transform=")[^"]+"/,'$1translate(10 20)"'),'EXP_LOG_PAIR_REFERENCE_NAME_POSITION_MISMATCH:B'],
    [built.svg.replace(/(<circle id="B"[^>]*?cx=")[^"]+"/,(_match,head)=>head+'80"'),'OVERLAY_POINT_MISMATCH:B'],
    [built.svg.replace('</svg>','<g id="reference-f-value"/></svg>'),'EXP_LOG_PAIR_REFERENCE_LABEL_NOT_SUPPRESSED:f'],
    [built.svg.replace('</svg>','<g id="other-point-label" data-owner="B" data-label-kind="COORDINATE_LABEL"/></svg>'),'EXP_LOG_PAIR_REFERENCE_COORDINATES_NOT_SUPPRESSED:B'],
  ]){
    assert.notEqual(svg,built.svg);
    assert.ok((await audit(svg)).errors.includes(error),error);
  }
  for(const [edit,code] of [
    [p=>delete p.curves[0].referenceLabelPoint,'EXP_LOG_PAIR_REFERENCE_LABEL_MODE_INVALID:f'],
    [p=>delete p.curves[0].formulaLabel,'EXP_LOG_PAIR_REFERENCE_LABEL_MODE_INVALID:f'],
    [p=>p.curves[0].referenceLabelMode='VALUE','EXP_LOG_PAIR_REFERENCE_LABEL_MODE_INVALID:f'],
    [p=>p.overlays.points[0].x='2','EXP_LOG_PAIR_REFERENCE_LABEL_POINT_MISMATCH:f'],
    [p=>p.overlays.points[0].coordinates=true,'EXP_LOG_PAIR_REFERENCE_LABEL_POINT_MISMATCH:f'],
    [p=>p.overlays.points[0].unnamed=true,'EXP_LOG_PAIR_REFERENCE_LABEL_POINT_MISMATCH:f'],
    [p=>p.overlays.points[0].marker='OPEN','EXP_LOG_PAIR_REFERENCE_LABEL_POINT_MISMATCH:f'],
  ]){
    const invalid=structuredClone(graphPlan);
    edit(invalid);
    const refusal=await pythonWorker({action:'frame_graph',graphPlan:invalid});
    assert.equal(refusal.result.code,code);
  }
});

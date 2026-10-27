import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Loaded lazily so a plan/manifest schema check still runs when a sparse checkout lacks a pipeline module the engine imports.
const load=async()=>{
  const [{pythonWorker},{specFor},composite]=await Promise.all([
    import('../production/worker.mjs'),
    import('../production/phase2.mjs'),
    import('../production/composite-candidate-svg-v1.mjs')
  ]);
  return {pythonWorker,specFor,...composite};
};

const int=value=>({kind:'integer',value:String(value)});
const rat=(numerator,denominator)=>({kind:'rational',numerator:String(numerator),denominator:String(denominator)});
const point=(id,x,y)=>({id,op:'SOURCE_POINT',inputs:[],args:{coordinates:[x,y]},outputType:'POINT',factRole:'GIVEN'});
const midpoint=(id,a,b)=>({id,op:'MIDPOINT',inputs:[a,b],args:{},outputType:'POINT',factRole:'GIVEN'});
const segment=(id,a,b)=>({id,refs:[a,b]});

const planePlan=(nodes,{segments=[],points=[],rightAngles=[],planeMarks,coordinateCanvas}={})=>({
  capability:'construction-spike-v1',
  mathPlan:{schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes},
  axisTickValues:{x:[],y:[]},displayLines:[],displayCircles:[],displaySegments:segments,rightAngles,displayPoints:points,
  ...(planeMarks?{planeMarks}:{}),...(coordinateCanvas?{coordinateCanvas}:{})});

// Two different PLANE_FIGURE_v1 panels: a right isosceles triangle with an angle mark and a labelled side, then a square with its diagonal.
const triangle=()=>planePlan(
  [point('A',int(0),int(0)),point('B',int(4),int(0)),point('C',int(0),int(4))],
  {segments:[segment('sAB','A','B'),segment('sBC','B','C'),segment('sCA','C','A')],points:['A','B','C'],
   rightAngles:[{id:'rA',refs:['B','A','C']}],
   planeMarks:{angles:[{id:'aB',refs:['A','B','C'],value:45,label:'45'}],expressionLabels:[{id:'tAC',ownerSegment:'sCA',text:'4'}]}});
const square=()=>planePlan(
  [point('A',rat(0,1),rat(0,1)),point('B',rat(8,1),rat(0,1)),point('C',rat(8,1),rat(8,1)),point('D',rat(0,1),rat(8,1)),midpoint('O','A','C')],
  {segments:[segment('sAB','A','B'),segment('sBC','B','C'),segment('sCD','C','D'),segment('sDA','D','A'),segment('sAC','A','C')],points:['A','B','C','D','O'],
   planeMarks:{angles:[{id:'aA',refs:['D','A','B'],value:90,label:'90'}],expressionLabels:[{id:'tAB',ownerSegment:'sAB',text:'8'}]}});
const panel=(plan,caption)=>({caption,plan});
const composite=panels=>({capability:'composite-panels-v1',panels,caption:'여러 평면도형을 비교한 해설 그림'});

const reasonOf=error=>error?.detail?.reason;

test('the two source-bound goldens are valid JSON and match the working plans when present',async()=>{
  const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
  const root='archive/tools/geometry-equation/';
  const q10=read(root+'ops/golden/item36/plan.json'),q23=read(root+'ops/golden/item37/plan.json');
  assert.equal(q10.capability,'composite-panels-v1');assert.equal(q10.panels.length,5);
  assert.equal(q23.capability,'composite-panels-v1');assert.equal(q23.panels.length,2);
  // The author worktree keeps the same plans under .tmp; a clean checkout has only the goldens and must still pass.
  for(const [working,golden] of [['.tmp/plane-panels-engine/q10/plan.json',q10],['.tmp/plane-panels-engine/q23/plan.json',q23]]){
    if(fs.existsSync(working))assert.deepEqual(read(working),golden);
  }
  const manifest=read(root+'ops/golden.manifest.json');
  assert.deepEqual(manifest.items.filter(item=>item.dir==='item36'||item.dir==='item37').map(item=>[item.dir,item.ordinal]),[['item36',10],['item37',23]]);
});

test('the source-bound goldens pass the plane-panel schema and keep their decisive marks',async()=>{
  const {compositePanels,compositePanelLayout,isPlanePanel}=await load();
  const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
  const root='archive/tools/geometry-equation/';
  const q10=read(root+'ops/golden/item36/plan.json'),q23=read(root+'ops/golden/item37/plan.json');
  const ten=compositePanels(q10),twentyThree=compositePanels(q23);
  assert.equal(ten.length,5);assert.equal(twentyThree.length,2);
  assert.ok([...ten,...twentyThree].every(item=>isPlanePanel(item.plan)));
  assert.ok([...ten,...twentyThree].every(item=>item.plan.mathPlan.nodes.some(node=>node.op==='SOURCE_POINT')));
  assert.ok([...ten,...twentyThree].every(item=>!item.plan.mathPlan.nodes.some(node=>node.op.startsWith('NORMALIZATION_'))));
  assert.deepEqual([compositePanelLayout(ten).columns,compositePanelLayout(ten).rows],[2,3]);
  assert.deepEqual([compositePanelLayout(twentyThree).columns,compositePanelLayout(twentyThree).rows],[2,1]);
  // q10: each option keeps the relation the solution uses, not a copied thumbnail.
  assert.deepEqual(ten[0].plan.planeMarks.expressionLabels.map(label=>label.text),['6','4','6','4']);
  assert.deepEqual(ten[1].plan.planeMarks.angles.map(angle=>angle.value),[80,20,80,20]);
  assert.deepEqual(ten[2].plan.planeMarks.expressionLabels.filter(label=>label.text==='5').map(label=>label.ownerSegment),['sDA','sBC']);
  assert.deepEqual(ten[3].plan.planeMarks.angles.map(angle=>angle.value),[70,70]);
  assert.deepEqual(ten[4].plan.planeMarks.angles.map(angle=>angle.value),[55,125]);
  // q23: panel areas and the 5:3 division stay explicit; both canvases fit the two-column envelope.
  assert.deepEqual(twentyThree[0].plan.planeMarks.regions.map(region=>region.label),['30']);
  assert.deepEqual(twentyThree[1].plan.planeMarks.regions.map(region=>region.label),['50','30']);
  assert.deepEqual(twentyThree[1].plan.planeMarks.equalLengths.map(mark=>mark.segments), [['sAB','sBC','sCD','sDA']]);
  for(const item of twentyThree)assert.ok(item.plan.coordinateCanvas.width*2+8<=848,'two 640-wide panels would exceed the measured font envelope');
});

test('plane panels use a two-column grid; five panels fill three rows',async()=>{
  const {compositePanels,compositePanelLayout,compositeStackSize,compositeGridColumns,COMPOSITE_MAX_PLANE_PANELS}=await load();
  const five=composite(Array.from({length:5},(_,i)=>panel(triangle(),{text:`보기 ${i+1}`})));
  const checked=compositePanels(five),layout=compositePanelLayout(checked);
  assert.deepEqual([layout.kind,layout.columns,layout.rows],['GRID',2,3]);
  const sizes=Array.from({length:5},()=>({width:384,height:320})),stack=compositeStackSize(sizes,0,layout);
  assert.equal(stack.width,2*384+8);
  assert.equal(stack.height,32+3*(44+320)+2*8);

  const two=composite([panel(triangle(),{text:'①'}),panel(square(),{text:'②'})]);
  const twoLayout=compositePanelLayout(compositePanels(two));
  assert.deepEqual([twoLayout.columns,twoLayout.rows],[2,1]);
  const twoStack=compositeStackSize([{width:640,height:560},{width:640,height:560}],0,twoLayout);
  assert.deepEqual([twoStack.width,twoStack.height,twoStack.columns,twoStack.rows],[1288,32+44+560,2,1]);
  assert.deepEqual([compositeGridColumns(2),compositeGridColumns(3),compositeGridColumns(4),compositeGridColumns(5)],[2,2,2,2]);

  const four=composite(Array.from({length:4},()=>panel(triangle(),{text:'보기'})));
  const fourLayout=compositePanelLayout(compositePanels(four));
  assert.deepEqual([fourLayout.columns,fourLayout.rows],[2,2]);
  assert.equal(COMPOSITE_MAX_PLANE_PANELS,5);
});

test('a five-panel grid stays inside the measured Archive font-scale envelope',async()=>{
  // The Archive preflight measured solutionMetaContentWidth 298.125 CSS px for this exam (qpp=4 desktop row). With the unchanged policy
  // (fontFloorCssPx 11, comfortCssPx .25, maximumBaseFontPx 32) requestedProfileTypographyPolicy accepts an intrinsic width W only while
  // 298.125/W * 32 >= 11.25, i.e. W <= 848. The smallest legal plane canvas is 384, so a three-column row (3*384+2*8 = 1168) is refused at
  // measure with UNSUPPORTED_DISPLAY_ENVELOPE:REQUESTED_PROFILE_FONT_SCALE, while the two-column grid (2*384+8 = 776) passes.
  const {compositePanels,compositePanelLayout,compositeStackSize}=await load();
  const measuredContentWidthCssPx=298.125,maxBaseFontPx=32,cssTargetFontPx=11+0.25;
  const maxIntrinsicWidth=measuredContentWidthCssPx*maxBaseFontPx/cssTargetFontPx;
  assert.equal(maxIntrinsicWidth,848);
  const five=composite(Array.from({length:5},()=>panel(triangle(),{text:'보기'})));
  const layout=compositePanelLayout(compositePanels(five));
  const stack=compositeStackSize(Array.from({length:5},()=>({width:384,height:320})),0,layout);
  assert.ok(stack.width<=maxIntrinsicWidth,'two-column five-panel grid must meet the measured font floor');
  assert.equal(stack.width,776);
  assert.ok(3*384+2*8>maxIntrinsicWidth,'a three-column row would exceed the measured font-scale envelope');
  assert.ok(cssTargetFontPx/(measuredContentWidthCssPx/stack.width)<=maxBaseFontPx);
  assert.ok(cssTargetFontPx/(measuredContentWidthCssPx/1168)>maxBaseFontPx);
});

test('a plane grid keeps every panel plan untouched: no graph header, no plot limit and no shared rows',async()=>{
  const {compositePanels,compositeSharedRowCount,isPlanePanel}=await load();
  const panels=[panel(triangle(),{text:'①'}),panel(square(),{text:'②'})],plan=composite(panels);
  const checked=compositePanels(plan);
  assert.ok(checked.every(item=>isPlanePanel(item.plan)));
  assert.deepEqual(checked.map(item=>item.plan),panels.map(item=>item.plan));
  assert.ok(checked.every(item=>item.plan.graphPlan===undefined&&!Object.hasOwn(item.plan,'compositeHeader')));
  assert.equal(compositeSharedRowCount(checked),0);
  assert.deepEqual(checked.map(item=>item.caption),panels.map(item=>item.caption));
  assert.deepEqual(checked.map(item=>item.index),[0,1]);
});

test('every panel keeps its own exact geometry, segments and label owners (engine primitive readback)',async()=>{
  const {compositePanels,pythonWorker,specFor}=await load();
  const panels=[panel(triangle(),{text:'①'}),panel(square(),{text:'②'})],checked=compositePanels(composite(panels));
  const firstModel=await pythonWorker({action:'construction',graph:checked[0].plan.mathPlan},{timeoutMs:90000});
  assert.equal(firstModel.status,'OK',JSON.stringify(firstModel.result));
  const first=specFor(checked[0].plan,firstModel.result,'asset');
  assert.deepEqual([first.viewport.width,first.viewport.height],[384,320]);
  const at=(spec,id)=>spec.objects.find(object=>object.id===id&&object.kind==='POINT')?.at;
  assert.deepEqual(at(first,'A'),[0,0]);
  assert.deepEqual(at(first,'B'),[4,0]);
  assert.deepEqual(at(first,'C'),[0,4]);
  assert.ok(first.objects.some(object=>object.kind==='SEGMENT'&&object.id==='sBC'));
  const label=first.objects.find(object=>object.kind==='EQUATION_LABEL'&&object.id==='tAC');
  assert.equal(label.text,'4');assert.equal(label.target,'sCA');
  const angle=first.objects.find(object=>object.kind==='ANGLE_MARK'&&object.id==='aB');
  assert.equal(angle.labelText,'45');assert.ok(Math.abs(angle.value-45)<1e-9);
  assert.ok(first.objects.some(object=>object.kind==='ANGLE_MARK'&&object.id==='rA'&&object.value===90));
  assert.equal(first.displayFacts.factRolesByLabel['tAC'],'GIVEN');

  const secondModel=await pythonWorker({action:'construction',graph:checked[1].plan.mathPlan},{timeoutMs:90000});
  assert.equal(secondModel.status,'OK',JSON.stringify(secondModel.result));
  const second=specFor(checked[1].plan,secondModel.result,'asset');
  assert.deepEqual(at(second,'O'),[4,4]);
  assert.ok(second.objects.some(object=>object.kind==='SEGMENT'&&object.id==='sAC'));
  const secondLabel=second.objects.find(object=>object.kind==='EQUATION_LABEL'&&object.id==='tAB');
  assert.equal(secondLabel.text,'8');assert.equal(secondLabel.target,'sAB');
  assert.ok(second.objects.some(object=>object.kind==='ANGLE_MARK'&&object.id==='aA'&&Math.abs(object.value-90)<1e-9));
});

test('panel count and type limits are enforced without weakening the graph stack',async()=>{
  const {compositePanels,compositePanelLayout}=await load();
  assert.throws(()=>compositePanels(composite([panel(triangle(),{text:'하나'})])),error=>reasonOf(error)==='PANELS');
  assert.throws(()=>compositePanels(composite(Array.from({length:6},()=>panel(triangle(),{text:'보기'})))),error=>reasonOf(error)==='PANELS');
  const graphPanel={caption:{math:'a=-1'},plan:{capability:'polynomial-spike-v1',graphPlan:{family:'polynomial',coefficients:['0','0','1'],domain:[-1,1],viewport:[-1,1,-1,1],sourceDomain:{kind:'ALL_REALS'},requiredPoints:[],axisTickValues:{x:[],y:[]},lines:[]}}};
  assert.throws(()=>compositePanels(composite([panel(triangle(),{text:'평면'}),graphPanel])),error=>reasonOf(error)==='PANEL_PLANE_MIXED_0');
  assert.throws(()=>compositePanels(composite([graphPanel,panel(triangle(),{text:'평면'})])),error=>reasonOf(error)==='PANEL_PLANE_MIXED_1');
  assert.throws(()=>compositePanels(composite(Array.from({length:4},()=>graphPanel))),error=>reasonOf(error)==='PANELS');
  // The existing graph stack is still a one-column stack of two or three panels.
  const pair=composite([graphPanel,{...graphPanel,caption:{math:'a=1'}}]);
  assert.deepEqual(compositePanelLayout(compositePanels(pair)),{kind:'STACK',columns:1,rows:2});
});

test('a plane panel schema is rejected before any composition',async()=>{
  const {compositePanels}=await load();
  const two=extra=>composite([panel({...triangle(),...extra},{text:'①'}),panel(square(),{text:'②'})]);
  const frame=triangle();frame.mathPlan.nodes.push({id:'O',op:'NORMALIZATION_ORIGIN',inputs:[],args:{},outputType:'POINT',factRole:'GIVEN'});
  assert.throws(()=>compositePanels(two({mathPlan:frame.mathPlan})),error=>reasonOf(error)==='PANEL_PLANE_FRAME_HELPERS_0');
  const noSource=triangle();noSource.mathPlan.nodes=[{...noSource.mathPlan.nodes[0],op:'LINE_THROUGH'}];
  assert.throws(()=>compositePanels(two({mathPlan:noSource.mathPlan})),error=>reasonOf(error)==='PANEL_PLANE_SOURCE_POINT_0');
  assert.throws(()=>compositePanels(two({mathPlan:{...triangle().mathPlan,schemaVersion:'construction-spike-v2'}})),error=>reasonOf(error)==='PANEL_PLANE_MATH_0');
  assert.throws(()=>compositePanels(two({mathPlan:{...triangle().mathPlan,realization:{recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false}}})),error=>reasonOf(error)==='PANEL_PLANE_MIXED_1');
  assert.throws(()=>compositePanels(two({coordinateCanvas:{width:383,height:320}})),error=>reasonOf(error)==='PANEL_PLANE_CANVAS_0');
  assert.throws(()=>compositePanels(two({graphPlan:{family:'polynomial',coefficients:['0','0','1']}})),error=>reasonOf(error)==='PANEL_PLANE_MIXED_1');
  assert.throws(()=>compositePanels(two({capability:'polynomial-spike-v1'})),error=>reasonOf(error)==='PANEL_PLANE_MIXED_1');
  const chainPlan=composite([panel(triangle(),{text:'①'}),panel(square(),{text:'②'})]);chainPlan.chain='number-line-figure-v1';
  assert.throws(()=>compositePanels(chainPlan),error=>reasonOf(error)==='CHAIN');
});

test('panel captions keep the composite schema (one row per panel, inner width limit)',async()=>{
  const {compositePanels}=await load();
  const withCaption=caption=>composite([panel(triangle(),caption),panel(square(),{text:'②'})]);
  assert.throws(()=>compositePanels(withCaption(undefined)),error=>reasonOf(error)==='PANEL_CAPTION_0');
  assert.throws(()=>compositePanels(withCaption({text:''})),error=>reasonOf(error)==='PANEL_CAPTION_0');
  assert.throws(()=>compositePanels(withCaption({text:'가'.repeat(25)})),error=>reasonOf(error)==='PANEL_CAPTION_0');
  assert.throws(()=>compositePanels(withCaption({text:'보기',extra:true})),error=>reasonOf(error)==='PANEL_CAPTION_0');
  assert.throws(()=>compositePanels(withCaption({math:'a=1 2'})),error=>reasonOf(error)==='PANEL_CAPTION_0');
  assert.equal(compositePanels(withCaption({math:'a=1',text:'일 때'})).length,2);
});

// AX1 tests: a displayed SEGMENT that lies on a displayed coordinate axis is drawn with the heavier `axisOverlapShape` stroke on a layer above the axis.
// Real SymPy worker and real Chrome; A2 also runs the real R1-a Archive typography measurement (medium class). No provider is called.
// Cases: A1 prepare of the R1-b real figure; A2 real medium L1 composition (stroke widths in the SVG and as rendered); A3 the overlap treatment reaches only the
// segments lying on the axes (structure, never a digest of the engine output: an engine improvement must not break it); A4 screen-distance boundary, hidden axes
// and what is deliberately out of scope (LINE, LEADER_LINE).
import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {specFor} from '../production/phase2.mjs';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {node,pointNode} from './construction-v1-fixture.mjs';

const root=fileURLToPath(new URL('../../../../',import.meta.url));
const geometryDir=fileURLToPath(new URL('../',import.meta.url));
const CAPTURE_MODULE_URL=new URL('../production/construction-archive-capture-v1.mjs',import.meta.url);
const tokens=JSON.parse(fs.readFileSync(path.join(geometryDir,'visual_engine/style_tokens.json'),'utf8'));
const modelOf=async graph=>{const response=await pythonWorker({action:'construction',graph});assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;};
const prepareOf=async spec=>{const response=await pythonWorker({action:'prepare',spec});assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;};
const byId=prepared=>Object.fromEntries(prepared.prepared.primitives.map(primitive=>[primitive.id,primitive]));
let shared;
const browser=async()=>shared??=await launchBrowser();
after(async()=>{await shared?.close();});

// The R1-b real figure: A=(0,0), B=(6,0), C=(0,3), M the midpoint of AB; AB lies on the x-axis and CA on the y-axis.
const triangle=(bx,ay=0)=>({schemaVersion:'construction-spike-v1',nodes:[pointNode('A',0,ay),pointNode('B',bx,ay),pointNode('C',0,ay+3),node('M','MIDPOINT',['A','B'],'POINT')]});
const planOf=mathPlan=>({capability:'construction-spike-v1',caption:'삼각형과 중점',mathPlan,displaySegments:[{id:'sAB',refs:['A','B']},{id:'sBC',refs:['B','C']},{id:'sCA',refs:['C','A']},{id:'sCM',refs:['C','M']}],coordinateLabels:['A','B','C','M']});
const identityOf=n=>assetIdentity(`ax1_unit_exam|${n}`,'SOLUTION_VISUAL','decisive-relation');

test('A1 R1-b real figure: the segments lying on the axes carry axisOverlapShape and their axis; the other segments stay secondaryShape',async()=>{
  const plan=planOf(triangle(6)),spec=specFor(plan,await modelOf(plan.mathPlan),identityOf(1).assetId),p=byId(await prepareOf(spec));
  for(const [id,axis] of [['x-axis','x'],['y-axis','y']]){
    assert.deepEqual([p[id].token,p[id].layer,p[id].role,p[id].axis],['axis',30,'axis',axis],id);assert.equal(Object.hasOwn(p[id],'axisOverlap'),false,id);
  }
  // the premise of the defect: both ends of sAB are at the x-axis' screen y, both ends of sCA at the y-axis' screen x
  assert.ok(Math.abs(p.sAB.from[1]-p['x-axis'].from[1])<1e-9&&Math.abs(p.sAB.to[1]-p['x-axis'].from[1])<1e-9,'sAB lies on the x-axis');
  assert.ok(Math.abs(p.sCA.from[0]-p['y-axis'].from[0])<1e-9&&Math.abs(p.sCA.to[0]-p['y-axis'].from[0])<1e-9,'sCA lies on the y-axis');
  for(const [id,axis] of [['sAB','x'],['sCA','y']]){
    assert.deepEqual([p[id].kind,p[id].token,p[id].layer,p[id].role,p[id].axisOverlap],['line','axisOverlapShape',35,'line',axis],id);
    assert.ok(p[id].layer>p[axis+'-axis'].layer,id+' is drawn above its axis');
  }
  for(const id of ['sBC','sCM']){
    assert.deepEqual([p[id].kind,p[id].token,p[id].layer,p[id].role],['line','secondaryShape',30,'line'],id);assert.equal(Object.hasOwn(p[id],'axisOverlap'),false,id);
  }
  assert.equal(tokens.axisOverlapShape,3.2);assert.equal(tokens.axis,1.2);assert.equal(tokens.secondaryShape,1.6);
});

const strokeOf=(svg,id)=>{const match=svg.match(new RegExp(`<line id="${id}"[^>]*? stroke-width="([0-9.]+)"`));assert.ok(match,'line '+id+' in the SVG');return Number(match[1]);};
async function renderedStrokes(svg,display,ids){
  const page=await (await browser()).newPage({viewport:{width:Math.ceil(display.width)+20,height:Math.ceil(display.height)+20}});
  try{
    await page.setContent('<body style="margin:0;background:#fff">'+svg.replace('<svg','<svg style="display:block;width:'+display.width+'px;height:'+display.height+'px"')+'</body>');
    return await page.evaluate(names=>Object.fromEntries(names.map(id=>{const element=document.getElementById(id);return [id,parseFloat(getComputedStyle(element).strokeWidth)*element.getScreenCTM().a];})),ids);
  }finally{await page.close();}
}
test('A2 R1-b real figure through the real medium Archive policy and L1: COMPOSED, static and rendered-layout PASS, axis-overlapping segments 3.2 against axis 1.2',async()=>{
  const capture=await import(CAPTURE_MODULE_URL.href),sourcePath='archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',examUid=path.basename(sourcePath,'.js');
  const identity=assetIdentity(`${examUid}|1`,'SOLUTION_VISUAL','decisive-relation'),plan=planOf(triangle(6)),model=await modelOf(plan.mathPlan);
  const measured=await capture.measureArchiveTypographyPolicy({identity,sourcePath,ordinal:1,requestedSizeClass:'medium',intrinsicSvg:{width:384,height:320},runId:'ax1-a2-measure-'+crypto.randomUUID()});
  assert.equal(measured.status,'MEASURED',JSON.stringify(measured.detail));assert.equal(measured.policy.requestedSizeClass,'medium');
  const composed=await composeConstructionCandidate({plan,model,identity,typographyPolicy:measured.policy,browser:await browser()});
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS',JSON.stringify(composed.renderedLayout.errors));
  const {svg}=composed,scale=measured.policy.displayScale;
  assert.deepEqual(['sAB','sCA','sBC','sCM','x-axis','y-axis'].map(id=>strokeOf(svg,id)),[3.2,3.2,1.6,1.6,1.2,1.2]);
  // drawn after (above) the axis it lies on
  assert.ok(svg.indexOf('id="x-axis"')<svg.indexOf('id="sAB"')&&svg.indexOf('id="y-axis"')<svg.indexOf('id="sCA"'));
  assert.ok(svg.includes('<g data-layer="35"><line id="sAB"')&&svg.includes('<g data-layer="35"><line id="sCA"'));
  const css=await renderedStrokes(svg,composed.renderedLayout.display,['sAB','sCA','sBC','sCM','x-axis','y-axis']);
  console.log('AX1_A2='+JSON.stringify({displayScale:scale,display:composed.renderedLayout.display,renderedStrokeCssPx:css,svgSha256:composed.lineage.svgSha256}));
  for(const [id,axis] of [['sAB','x-axis'],['sCA','y-axis']])assert.ok(Math.abs(css[id]-3.2*scale)<.01&&css[id]>2.4*css[axis],`${id} renders ${css[id]} CSS px against its axis ${css[axis]}`);
  for(const id of ['x-axis','y-axis'])assert.ok(Math.abs(css[id]-1.2*scale)<.01,id);
});

// A3 inputs: figures whose output must not change, figures that only partly change, and the out-of-scope LINE / LEADER_LINE cases.
const assetId=assetIdentity('ax1_a3_exam|1','SOLUTION_VISUAL','decisive-relation').assetId;// the asset id the A3 inputs are built with
const P_GRAPH={schemaVersion:'construction-spike-v1',nodes:[pointNode('A',-2,-1),pointNode('B',4,-1),pointNode('C',-2,3),node('M','MIDPOINT',['B','C'],'POINT'),node('lineBC','LINE_THROUGH',['B','C'],'LINE'),node('lineAM','LINE_THROUGH',['A','M'],'LINE'),node('circM','CIRCLE_THROUGH_POINT',['M','B'],'CIRCLE')]};
const P_PLAN={capability:'construction-spike-v1',caption:'직각삼각형과 외접원',mathPlan:P_GRAPH,displaySegments:[{id:'sAB',refs:['A','B']},{id:'sCA',refs:['C','A']}],displayLines:['lineBC','lineAM'],rightAngles:[{id:'raA',refs:['B','A','C']}],coordinateLabels:['A','B','C'],coordinateCanvas:{width:560,height:440}};
const plain={title:'probe',sourceFacts:{independentFactHash:'frozen'},derivedFacts:{},displayFacts:{}};
async function buildSpecs(){
  const specs={};
  // L1-built figures: P is off the axes; Q4 and Q6 have segments lying on both axes (Q6 is the R1-b real figure).
  for(const [id,plan] of [['P_offaxis_plan',P_PLAN],['Q4_overlap_plan',planOf(triangle(4))],['Q6_overlap_plan',planOf(triangle(6))]])specs[id]=specFor(plan,await modelOf(plan.mathPlan),assetId);
  specs.triangle_offaxis_literal={...plain,id:'triangle-offaxis',visualType:'line_circle_geometry',viewport:{xMin:-3,xMax:6,yMin:-3,yMax:5},objects:[
    {id:'A',kind:'POINT',at:[-2,-1],priority:0},{id:'B',kind:'POINT',at:[4,-1],priority:0},{id:'C',kind:'POINT',at:[-2,3],priority:0},
    {id:'AB',kind:'SEGMENT',from:[-2,-1],to:[4,-1]},{id:'BC',kind:'SEGMENT',from:[4,-1],to:[-2,3]},{id:'CA',kind:'SEGMENT',from:[-2,3],to:[-2,-1]},
    {id:'A-coordinate',kind:'COORDINATE_LABEL',target:'A',exact:['-2','-1']},{id:'B-coordinate',kind:'COORDINATE_LABEL',target:'B',exact:['4','-1']}]};
  specs.circle_fixture={...plain,sourceFacts:{independentFactHash:'code-regression-source-freeze-v1'},id:'circle-source',title:'중심과 반지름',visualType:'line_circle_geometry',viewport:{xMin:-4,xMax:4,yMin:-1,yMax:6},objects:[
    {id:'C',kind:'POINT',at:[-1,3],priority:0},{id:'R',kind:'POINT',at:[1,3]},{id:'circle',kind:'CIRCLE',center:[-1,3],radius:2},{id:'radius',kind:'SEGMENT',from:[-1,3],to:[1,3]},
    {id:'C-coordinate',kind:'COORDINATE_LABEL',target:'C',exact:['-1','3']},{id:'equation',kind:'EQUATION_LABEL',text:'(x+1)^2+(y-3)^2=2^2',at:[2,5]},
    {id:'condition',kind:'CONDITION_BOX',at:[2,1],lines:['중심 C',{text:'r=2',math:true}]}]};
  specs.graph_cubic_tangent={...plain,id:'graph-cubic',title:'삼차함수와 접선',visualType:'function_graph',viewport:{xMin:-4,xMax:4,yMin:-4,yMax:4},objects:[
    {id:'g',kind:'FUNCTION_GRAPH',expression:'x^3-4x',domain:[-3,3]},{id:'l',kind:'LINE',coefficients:[1,1,2]},{id:'t',kind:'TANGENT',refs:['l','g'],at:[1,-3]}]};
  // Out of scope on purpose: a LINE lying on an axis and a LEADER_LINE lying on it keep their existing output.
  specs.line_on_axis_literal={...plain,id:'line-on-axis',visualType:'line_circle_geometry',viewport:{xMin:-3,xMax:6,yMin:-3,yMax:5},objects:[
    {id:'P',kind:'POINT',at:[1,2],priority:0},{id:'axisLine',kind:'LINE',coefficients:[0,1,0]},{id:'verticalLine',kind:'LINE',coefficients:[1,0,0]}]};
  specs.leader_on_axis_literal={...plain,id:'leader-on-axis',visualType:'line_circle_geometry',viewport:{xMin:-3,xMax:6,yMin:-3,yMax:5},objects:[
    {id:'P',kind:'POINT',at:[1,2],priority:0},{id:'lead',kind:'LEADER_LINE',from:[1,0],to:[3,0]},{id:'leadY',kind:'LEADER_LINE',from:[0,1],to:[0,3]}]};
  const dir=path.join(geometryDir,'tests/publication-fixtures');
  // the five existing publication fixtures (axes hidden; their segments lie on the coordinate axes without displayed axes), named so that a new fixture does not break the pins
  for(const name of ['equal-length-owners','fraction-point-T','multi-angle-owner','owner-triangle','region-leader'])specs['pub_'+name]=JSON.parse(fs.readFileSync(path.join(dir,name+'.spec.json'),'utf8'));
  return specs;
}
// Which primitives carry the axis-overlap treatment: the two segments lying on the axes of the figures made for it, and nothing else.
const OVERLAP_IDS={'Q4_overlap_plan':['sAB','sCA'],'Q6_overlap_plan':['sAB','sCA']};
const PROBE_PY=`import json,sys
# argv[1] = geometry-equation directory whose visual_engine is probed; stdin = {id: spec}; stdout = {id: what the engine drew}
sys.path.insert(0,sys.argv[1])
from visual_engine.engine import prepare,build
specs=json.loads(sys.stdin.buffer.read().decode('utf-8'))
out={}
for sid,spec in specs.items():
    prepared,labels,obstacles,vp,semantic,sampling=prepare(spec)
    built=build(spec)
    out[sid]={'overlapIds':sorted(p['id'] for p in prepared['primitives'] if p.get('axisOverlap')),
        'overlapTokens':sorted(p['id'] for p in prepared['primitives'] if p.get('token')=='axisOverlapShape'),
        'svg':built['svg'],'witnessStatus':built['witness']['status']}
sys.stdout.buffer.write((json.dumps(out,sort_keys=True,ensure_ascii=False)+'\\n').encode('utf-8'))
`;
let probePromise;
const probed=()=>probePromise??=(async()=>{
  const specs=await buildSpecs(),dir=path.join(root,'.tmp/archive','ax1-a3-'+crypto.randomUUID());fs.mkdirSync(dir,{recursive:true});
  const probeFile=path.join(dir,'probe.py');fs.writeFileSync(probeFile,PROBE_PY);
  const run=spawnSync(process.env.GEOMETRY_PYTHON||'python',['-X','utf8',probeFile,geometryDir],{input:JSON.stringify(specs),encoding:'utf8',maxBuffer:64*1024*1024});
  assert.equal(run.status,0,run.stderr);
  return JSON.parse(run.stdout);
})();

test('A3 the axis-overlap treatment reaches exactly the segments lying on the axes: no other figure, line or leader carries it',async()=>{
  const now=await probed();
  assert.ok(Object.keys(now).length>=13);
  for(const [id,row] of Object.entries(now)){
    const expected=OVERLAP_IDS[id]??[];
    assert.deepEqual(row.overlapIds,expected,id+' axisOverlap');
    assert.deepEqual(row.overlapTokens,expected,id+' axisOverlapShape token');
    assert.ok(row.svg.includes('<svg')&&row.svg.trim().endsWith('</svg>'),id+' builds an SVG');
  }
});
test('A3b the figures with segments on the axes draw them with the heavy stroke; the figures without them draw no stroke of that width on a segment, line or leader',async()=>{
  const now=await probed();
  for(const [id,expected] of Object.entries(OVERLAP_IDS))for(const segment of expected)assert.equal(strokeOf(now[id].svg,segment),tokens.axisOverlapShape,id+' '+segment);
  for(const [id,row] of Object.entries(now).filter(([key])=>!OVERLAP_IDS[key])){
    const heavy=[...row.svg.matchAll(/<line id="([^"]+)"[^>]*? stroke-width="([0-9.]+)"/g)].filter(match=>Number(match[2])===tokens.axisOverlapShape).map(match=>match[1]);
    assert.deepEqual(heavy,[],id+' has no heavy axis-overlap line');
  }
});

// A4: the decision is made on screen coordinates (user-space px of the SVG), 0.5 px, on displayed axes only.
const VIEW={xMin:-1,xMax:8,yMin:-2,yMax:5,width:384,height:320,panel:0};
const probeSpec=(objects,{axes=true,visualType='line_circle_geometry',viewport=VIEW}={})=>({id:'ax1-probe',title:'probe',visualType,viewport,axes,sourceFacts:{independentFactHash:'frozen'},derivedFacts:{},displayFacts:{},objects});
const POINT={id:'P',kind:'POINT',at:[3,2],priority:0};
let framePromise;
const frame=()=>framePromise??=prepareOf(probeSpec([POINT])).then(result=>result.coordinateModel);
// a segment whose ends are d0/d1 screen px above (+) or below (-) the x-axis, or right (+) / left (-) of the y-axis
const nearX=async(d0,d1,x0=1,x1=5)=>{const {sy}=await frame();return {id:'S',kind:'SEGMENT',from:[x0,d0/sy],to:[x1,d1/sy]};};
const nearY=async(d0,d1,y0=1,y1=3)=>{const {sx}=await frame();return {id:'S',kind:'SEGMENT',from:[d0/sx,y0],to:[d1/sx,y1]};};
const overlapOf=async(segment,options)=>{const p=byId(await prepareOf(probeSpec([POINT,segment],options))).S;return {axisOverlap:p.axisOverlap??null,token:p.token,layer:p.layer};};
const OVERLAP_X={axisOverlap:'x',token:'axisOverlapShape',layer:35};
const OVERLAP_Y={...OVERLAP_X,axisOverlap:'y'};
const PLAIN={axisOverlap:null,token:'secondaryShape',layer:30};

test('A4a x-axis: a segment both of whose ends are within 0.5 px of the x-axis overlaps it; 1 px or more away does not',async()=>{
  for(const [d0,d1,expected] of [[0,0,OVERLAP_X],[.4,.4,OVERLAP_X],[-.4,-.4,OVERLAP_X],[.4,-.4,OVERLAP_X],[.49,.49,OVERLAP_X],[.51,.51,PLAIN],[1,1,PLAIN],[-1,-1,PLAIN],[1.5,1.5,PLAIN],[5,5,PLAIN],[.2,.6,PLAIN],[0,1,PLAIN]])
    assert.deepEqual(await overlapOf(await nearX(d0,d1)),expected,`ends ${d0}/${d1} px from the x-axis`);
  assert.deepEqual(await overlapOf(await nearX(.4,.4,1,1.2)),OVERLAP_X,'a short segment is judged the same way');
});
test('A4b y-axis: the same rule for the y-axis',async()=>{
  for(const [d0,d1,expected] of [[0,0,OVERLAP_Y],[.4,.4,OVERLAP_Y],[-.4,-.4,OVERLAP_Y],[.49,.49,OVERLAP_Y],[.51,.51,PLAIN],[1,1,PLAIN],[2,2,PLAIN],[.2,.6,PLAIN]])
    assert.deepEqual(await overlapOf(await nearY(d0,d1)),expected,`ends ${d0}/${d1} px from the y-axis`);
});
test('A4c a segment with only one end on an axis, a diagonal, or one end on each axis is not an overlap',async()=>{
  for(const segment of [{id:'S',kind:'SEGMENT',from:[0,0],to:[6,3]},{id:'S',kind:'SEGMENT',from:[1,0],to:[5,2]},{id:'S',kind:'SEGMENT',from:[2,0],to:[0,2]},{id:'S',kind:'SEGMENT',from:[0,1],to:[3,4]}])
    assert.deepEqual(await overlapOf(segment),PLAIN,JSON.stringify(segment));
});
test('A4d the rule applies to displayed axes only',async()=>{
  const onX=await nearX(0,0),onY=await nearY(0,0);
  for(const [axes,expectedX,expectedY] of [[false,PLAIN,PLAIN],[{x:false,y:true},PLAIN,OVERLAP_Y],[{x:true,y:false},OVERLAP_X,PLAIN],[{x:true,y:true},OVERLAP_X,OVERLAP_Y],[true,OVERLAP_X,OVERLAP_Y]]){
    assert.deepEqual(await overlapOf(onX,{axes}),expectedX,'x-axis segment, axes '+JSON.stringify(axes));
    assert.deepEqual(await overlapOf(onY,{axes}),expectedY,'y-axis segment, axes '+JSON.stringify(axes));
  }
});
test('A4e unequal units: the decision is on screen coordinates, not model coordinates',async()=>{
  const viewport={xMin:-1,xMax:8,yMin:-20,yMax:50,width:384,height:320,panel:0},options={visualType:'function_graph',viewport};
  const model=(await prepareOf(probeSpec([POINT],options))).coordinateModel;
  assert.equal(model.aspectPolicy,'UNEQUAL_UNIT_DECLARED');assert.ok(Math.abs(model.sx-model.sy)>1,'the units differ');
  assert.deepEqual(await overlapOf({id:'S',kind:'SEGMENT',from:[1,0],to:[5,0]},options),OVERLAP_X);
  assert.deepEqual(await overlapOf({id:'S',kind:'SEGMENT',from:[1,.4/model.sy],to:[5,.4/model.sy]},options),OVERLAP_X);
  assert.deepEqual(await overlapOf({id:'S',kind:'SEGMENT',from:[1,1/model.sy],to:[5,1/model.sy]},options),PLAIN);
  assert.deepEqual(await overlapOf({id:'S',kind:'SEGMENT',from:[.4/model.sx,1],to:[.4/model.sx,30]},options),OVERLAP_Y);
});
test('A4f out of scope and kept: a LINE and a LEADER_LINE lying on an axis keep their token, layer and no axisOverlap',async()=>{
  const p=byId(await prepareOf(probeSpec([POINT,{id:'axisLine',kind:'LINE',coefficients:[0,1,0]},{id:'lead',kind:'LEADER_LINE',from:[1,0],to:[3,0]},{id:'leadY',kind:'LEADER_LINE',from:[0,1],to:[0,3]}])));
  assert.deepEqual([p.axisLine.token,p.axisLine.layer],['mainShape',40]);
  for(const id of ['lead','leadY'])assert.deepEqual([p[id].token,p[id].layer,p[id].role],['leaderLine',80,'leader'],id);
  for(const id of ['axisLine','lead','leadY'])assert.equal(Object.hasOwn(p[id],'axisOverlap'),false,id);
});

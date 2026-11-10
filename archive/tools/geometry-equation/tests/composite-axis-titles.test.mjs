// A graph panel of composite-panels-v1 names its own axes with graphPlan.axisTitles (for example t and S for "the area S as a function of t"),
// exactly like a standalone graph; a panel without it keeps x and y. The observer reads each panel's titles from its final SVG, and wrong
// input fails with the same codes as a standalone graph. (22 강남여고 고1 1학기 중간 Q20: the upper panel is the rectangle, the lower one S(t).)
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {compositePanels,composeCompositeCandidate,compositePanelBytes} from '../production/composite-candidate-svg-v1.mjs';
import {specFor} from '../production/phase2.mjs';
import {hintFor} from '../ops/tools/hints.mjs';

const OBSERVER=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));
const lineGraph=()=>({capability:'multi-curve-figure-v1',graphPlan:{family:'multi-curve',viewport:[-2,5.5,-.8,3.8],axisTickValues:{x:[],y:[]},curves:[
  {id:'l1',kind:'LINE',coefficients:['1','2'],domain:['-1/2','1'],color:'BLUE'},
  {id:'l2',kind:'LINE',coefficients:['4','-1'],domain:['1','4'],color:'WARM'}]}});
const areaGraph=axisTitles=>({capability:'multi-curve-figure-v1',graphPlan:{family:'multi-curve',viewport:[-1,4,-.7,4.2],axisTickValues:{x:['3/2','3'],y:[]},curves:[
  {id:'c1',kind:'Y_OF_X',coefficients:['0','9/2','-3/2'],domain:['0','3/2'],color:'BLUE'},
  {id:'c2',kind:'Y_OF_X',coefficients:['0','9/2','-3/2'],domain:['3/2','3'],color:'BLUE'}],
  ...(axisTitles?{axisTitles}:{})}});
const planWith=axisTitles=>({capability:'composite-panels-v1',caption:'rectangle between two lines and its area S(t)',panels:[
  {caption:{math:'t=2'},plan:lineGraph()},
  {caption:{math:'S(t)'},plan:areaGraph(axisTitles)}]});
const refusal=plan=>{try{compositePanels(plan);}catch(error){return error.detail?.reason??String(error.message);}return null;};
async function frame(plan){
  const framedPanels=[],models=[];
  for(const item of compositePanels(plan)){
    const framed=await pythonWorker({action:'frame_graph',graphPlan:item.plan.graphPlan});
    if(framed.status!=='OK')return {error:framed.result};
    const panelPlan={...item.plan,caption:(item.caption.math??'')+(item.caption.text??''),graphPlan:framed.result.graphPlan};
    const built=await pythonWorker({action:'graph',graphPlan:panelPlan.graphPlan});
    if(built.status!=='OK')return {error:built.result};
    const observed=await pythonWorker({graphPlan:panelPlan.graphPlan,svg:built.result.svg,transform:built.result.transform},{script:OBSERVER});
    framedPanels.push({caption:item.caption,plan:panelPlan});models.push({plan:panelPlan,model:built.result,observed:observed.result});
  }
  return {checkedPlan:{...plan,panels:framedPanels},models};
}
// the author's own letter on a drawn axis name (a name made only of letters is typeset as math and carries its TeX)
const axisTex=(svg,axis)=>svg.match(new RegExp(`<g id="axis-${axis}"[^>]*>`))?.[0].match(/data-tex="([^"]*)"/)?.[1]??null;

test('a composite graph panel with axisTitles is observed and draws the author names; the other panel keeps x and y',async()=>{
  let browser;
  try{
    const done=await frame(planWith({x:'t',y:'S'}));
    assert.equal(done.error,undefined,JSON.stringify(done.error));
    for(const {observed} of done.models)assert.equal(observed.status,'PASS',JSON.stringify(observed));
    browser=await launchBrowser();
    const composed=await composeCompositeCandidate({plan:done.checkedPlan,panels:done.models.map(({plan,model})=>({plan,model})),identity:assetIdentity('gangnam-girls-high1-2022|20','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:{schemaVersion:'REQUESTED_PROFILE_TYPOGRAPHY_v1',baseFontPx:20,displayScale:.6,fontFloorCssPx:12},browser});
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.equal(composed.renderedLayout.status,'PASS');
    const [upper,lower]=compositePanelBytes(composed.svg).map(({bytes})=>bytes.toString('utf8'));
    assert.equal(axisTex(lower,'x'),'t');assert.equal(axisTex(lower,'y'),'S');
    // the panel without the field keeps the engine's own x and y (no author name on its axes)
    assert.equal(axisTex(upper,'x'),null);assert.equal(axisTex(upper,'y'),null);
  }finally{await browser?.close();}
});

test('a wrong axis name in a composite panel fails with the standalone codes, and each code has a hint',async()=>{
  const framed=await pythonWorker({action:'frame_graph',graphPlan:areaGraph({x:'t',y:'S'}).graphPlan});
  assert.equal(framed.status,'OK',JSON.stringify(framed.result));
  const failure=async titles=>{
    const graphPlan={...framed.result.graphPlan,axisTitles:titles};
    const built=await pythonWorker({action:'graph',graphPlan});
    assert.equal(built.status,'OK',JSON.stringify(built.result));
    try{specFor({...areaGraph(titles),graphPlan},built.result,'axis-titles-refusal');}catch(error){return error.message;}
    return null;
  };
  assert.equal(await failure({x:'t$',y:'S'}),'AXIS_TITLE_INVALID:x');
  assert.equal(await failure({x:'t',y:'열한글자가넘는이름입니다'}),'AXIS_TITLE_INVALID:y');
  assert.equal(await failure({x:' t'}),'AXIS_TITLE_INVALID:x');
  assert.equal(await failure({z:'t'}),'AXIS_TITLES_INVALID');
  assert.equal(await failure({}),'AXIS_TITLES_INVALID');
  assert.equal(await failure({x:'t',y:'S'}),null);
  assert.equal(refusal(planWith({x:'t',y:'S'})),null);
  for(const code of ['AXIS_TITLES_INVALID','AXIS_TITLE_INVALID:x','AXIS_TITLE_AXIS_HIDDEN:y','AXIS_TITLE_MISSING:x','AXIS_TITLE_NOT_AT_AXIS_END:y']){
    assert.ok(hintFor(code).length>=1,code);
    assert.match(hintFor(code).join('\n'),/axisTitles/,code);
  }
});

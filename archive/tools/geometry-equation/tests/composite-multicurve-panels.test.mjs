import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {compositePanels,compositePanelLayout,composeCompositeCandidate,compositePanelBytes} from '../production/composite-candidate-svg-v1.mjs';
import {specFor} from '../production/phase2.mjs';

const graph=q=>({
  capability:'multi-curve-figure-v1',
  graphPlan:{family:'multi-curve',viewport:[-2,1.5,-1,5],curves:[
    {id:'rational',kind:'RATIONAL',numerator:q==='0'?['1','0']:['1','-3'],denominator:['0','1'],domain:{from:'-2',to:'1/3',toState:'OPEN'},abs:true},
    {id:'radical',kind:'SQRT',radicand:['-1/3','1'],domain:['1/3','3/2']}
  ]}
});
const plan={capability:'composite-panels-v1',caption:'Two cases',sourceConditions:[{id:'cases',condition:'q is 0 or -3',mappedTo:['p1','p2']}],newVisualInformation:['Each panel shows the exact rational and square-root branches.'],panels:[
  {caption:{math:'q=0'},plan:graph('0')},
  {caption:{math:'q=-3'},plan:graph('-3')}
]};
const refusal=value=>{try{compositePanels(value);}catch(error){return error.detail?.reason??String(error.message);}return null;};
const circle=(svg,id)=>{
  const match=svg.match(new RegExp(`<circle\\b(?=[^>]*\\bid="${id}")([^>]*)>`));
  assert.ok(match,`missing ${id}`);
  return Object.fromEntries([...match[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(([,name,value])=>[name,value]));
};

test('composite accepts only exactly two multi-curve panels in the existing stack',()=>{
  const checked=compositePanels(plan);
  assert.equal(checked.length,2);
  assert.ok(checked.every(item=>item.plan.capability==='multi-curve-figure-v1'&&item.plan.graphPlan.family==='multi-curve'));
  assert.deepEqual(compositePanelLayout(checked),{kind:'STACK',columns:1,rows:2});
  assert.equal(refusal({...plan,panels:[plan.panels[0]]}),'COMPOSITE_MULTI_CURVE_PANEL_COUNT');
  assert.equal(refusal({...plan,panels:[...plan.panels,plan.panels[0]]}),'COMPOSITE_MULTI_CURVE_PANEL_COUNT');
  assert.equal(refusal({...plan,panels:[plan.panels[0],{caption:{text:'other'},plan:{capability:'polynomial-spike-v1',graphPlan:{family:'multi-curve'}}}]}),'COMPOSITE_MULTI_CURVE_PANEL_MIXED_1');
  assert.equal(refusal({...plan,panels:[plan.panels[0],{caption:{text:'bad'},plan:{...graph('-3'),graphPlan:{...graph('-3').graphPlan,family:'polynomial'}}}]}),'COMPOSITE_MULTI_CURVE_PANEL_MIXED_1');
});

test('engine rejects malformed source endpoint marker states',async()=>{
  const framed=await pythonWorker({action:'frame_graph',graphPlan:graph('0').graphPlan});
  assert.equal(framed.status,'OK',JSON.stringify(framed.result));
  const panelPlan={...graph('0'),caption:'q=0',graphPlan:framed.result.graphPlan};
  const built=await pythonWorker({action:'graph',graphPlan:panelPlan.graphPlan});
  assert.equal(built.status,'OK',JSON.stringify(built.result));
  const spec=specFor(panelPlan,built.result,'q16-engine-marker-validation');
  const tampered=structuredClone(spec);
  tampered.objects.filter(object=>object.kind==='FUNCTION_GRAPH').forEach((object,index)=>{object.branch='REF_Q'+(index+1);});
  tampered.displayFacts.multiCurveMarks.find(mark=>mark.kind==='SOURCE_ENDPOINT').state='UNKNOWN';
  const rejected=await pythonWorker({action:'prepare',spec:tampered});
  assert.equal(rejected.status,'ERROR');
  assert.equal(rejected.result.code,'MULTI_CURVE_MARK_INVALID');
});

test('both exact cases pass framing and independent graph observation through the real composite stack composer',async()=>{
  let browser;
  try{
    const checked=compositePanels(plan),framedPanels=[],models=[];
    for(const item of checked){
      const framed=await pythonWorker({action:'frame_graph',graphPlan:item.plan.graphPlan});
      assert.equal(framed.status,'OK',JSON.stringify(framed.result));
      const panelPlan={...item.plan,caption:item.plan.caption??(item.caption.math??'')+(item.caption.text??''),graphPlan:framed.result.graphPlan};
      const built=await pythonWorker({action:'graph',graphPlan:panelPlan.graphPlan});
      assert.equal(built.status,'OK',JSON.stringify(built.result));
      const observed=await pythonWorker({graphPlan:panelPlan.graphPlan,svg:built.result.svg,transform:built.result.transform},{script:fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url))});
      assert.equal(observed.status,'OK',JSON.stringify(observed.result));
      assert.equal(observed.result.status,'PASS',JSON.stringify(observed.result));
      framedPanels.push({caption:item.caption,plan:panelPlan});models.push({plan:panelPlan,model:built.result});
    }
    const checkedPlan={...plan,panels:framedPanels};
    browser=await launchBrowser();
    const composed=await composeCompositeCandidate({plan:checkedPlan,panels:models,identity:assetIdentity('geum-dang-high1-2023|16','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:{schemaVersion:'REQUESTED_PROFILE_TYPOGRAPHY_v1',baseFontPx:20,displayScale:.6,fontFloorCssPx:12},browser});
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.deepEqual(composed.renderedLayout.status,'PASS');
    assert.equal(composed.panels.length,2);
    assert.equal(composed.lineage.panelSvgSha256s.length,2);
    assert.equal(composed.productionAuthorized,false);
    const panelSvgs=compositePanelBytes(composed.svg).map(({bytes})=>bytes.toString('utf8'));
    assert.equal(panelSvgs.length,2);
    for(const svg of panelSvgs){
      const open=circle(svg,'domain-endpoint-rational-to');
      assert.equal(open['data-role'],'source-domain-endpoint');
      assert.equal(open['data-curve'],'rational');
      assert.equal(open['data-endpoint'],'to');
      assert.equal(open['data-state'],'OPEN');
      assert.equal(open.fill,'#fff');
      assert.equal(open.stroke,'black');
      assert.equal(open.r,'4');
    }
    const sharedOpen=circle(panelSvgs[1],'domain-endpoint-rational-to');
    const closedStart=circle(panelSvgs[1],'curve-radical-start');
    assert.equal(closedStart['data-role'],'point');
    assert.equal(closedStart.fill,'#111');
    assert.equal(closedStart.cx,sharedOpen.cx);
    assert.equal(closedStart.cy,sharedOpen.cy);
    assert.ok(Number(closedStart.r)<Number(sharedOpen.r));
  }finally{await browser?.close();}
});

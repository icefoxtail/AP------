// composite-panels-v1 `columns` (opt-in): columns:1 stacks plane-figure or Venn panels in one column like graph panels; no columns / columns:2 keep the two-column grid.
// The validation and layout tests need no Chrome; the one compose test (Venn) does: run with --test-concurrency=1. The plane stack is rendered for real by the golden item149colstackplane.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveDiagram,setDiagramSize,FIGURE_CAPABILITY} from '../production/set-diagram-v1.mjs';
import {compositePanels,compositePanelLayout,composeCompositeCandidate,compositeStackSize,COMPOSITE_CAPTION_ROW,COMPOSITE_PANEL_GAP,COMPOSITE_TOP_MARGIN} from '../production/composite-candidate-svg-v1.mjs';

const golden=dir=>JSON.parse(fs.readFileSync(new URL(`../ops/golden/${dir}/plan.json`,import.meta.url),'utf8'));
const plane=golden('item102c1'),planeStack=golden('item149colstackplane'),vennStack=golden('item150colstackvenn');
const setPanel=(shade,caption)=>({caption:{text:caption},plan:{capability:FIGURE_CAPABILITY,diagram:{kind:'VENN',sets:[{id:'A'},{id:'B'}],shade}}});
const venn=(extra={})=>({capability:'composite-panels-v1',panels:[setPanel('A','ㄱ 좌변'),setPanel('A∩B','ㄱ 우변')],caption:'두 벤다이어그램',...extra});
const reason=plan=>{try{compositePanels(plan);}catch(error){return [error.message,error.detail?.reason];}return null;};
const layoutOf=plan=>{const l=compositePanelLayout(compositePanels(plan),plan);return [l.kind,l.columns,l.rows];};

test('without columns, or with columns:2, plane and Venn panels keep the two-column grid',()=>{
  assert.deepEqual(layoutOf(plane),['GRID',2,1]);
  assert.deepEqual(layoutOf({...plane,columns:2}),['GRID',2,1]);
  assert.deepEqual(layoutOf(venn()),['GRID',2,1]);
  assert.deepEqual(layoutOf(venn({columns:2})),['GRID',2,1]);
  // the layout function without a plan (the old one-argument call) is the grid too
  assert.equal(compositePanelLayout(compositePanels(venn())).kind,'GRID');
});

test('columns:1 stacks plane panels and Venn panels in one column, one row per panel',()=>{
  assert.deepEqual(layoutOf(planeStack),['STACK',1,2]);
  assert.deepEqual(layoutOf(vennStack),['STACK',1,2]);
  assert.deepEqual(layoutOf(venn({columns:1})),['STACK',1,2]);
  // the panels are validated exactly as in the grid: the same checked panels come out
  const grid=compositePanels({...plane}),stack=compositePanels({...plane,columns:1});
  assert.deepEqual(stack,grid);
  assert.equal(compositePanels({...plane,panels:[...plane.panels,plane.panels[0]],columns:1}).length,3);
});

test('a stack is as wide as its widest panel, not two cells wide, and as tall as the graph stack adds up',()=>{
  const sizes=[{width:480,height:400},{width:480,height:400}];
  const stack=compositeStackSize(sizes,0,{kind:'STACK',columns:1,rows:2}),grid=compositeStackSize(sizes,0,{kind:'GRID',columns:2,rows:1});
  assert.equal(stack.width,480);assert.equal(grid.width,2*480+COMPOSITE_PANEL_GAP);
  assert.equal(stack.height,COMPOSITE_TOP_MARGIN+2*(COMPOSITE_CAPTION_ROW+400)+COMPOSITE_PANEL_GAP);
  // two Venn panels stacked are one compact panel wide (410), the grid was 828
  const compact=compositePanels(venn({columns:1})).map(item=>setDiagramSize(solveDiagram(item.plan.diagram),{compact:true}));
  assert.equal(compositeStackSize(compact,0,compositePanelLayout(compositePanels(venn({columns:1})),venn({columns:1}))).width,410);
  assert.equal(compositeStackSize(compact,0,compositePanelLayout(compositePanels(venn()),venn())).width,828);
});

test('columns accepts only 1 or 2, and only for a plane-figure or Venn composite',()=>{
  for(const bad of [0,3,-1,1.5,'1','2',true,null])assert.deepEqual(reason({...plane,columns:bad}),['COMPOSITE_PLAN_INVALID','COLUMNS_INVALID'],String(bad));
  assert.deepEqual(reason(venn({columns:3})),['COMPOSITE_PLAN_INVALID','COLUMNS_INVALID']);
  // a graph stack, a solid grid: nothing to stack (or no tested one-column form), so the option is refused, never ignored
  for(const [dir,columns] of [['item24',1],['item24',2],['item56',1]])assert.deepEqual(reason({...golden(dir),columns}),['COMPOSITE_PLAN_INVALID','COLUMNS_UNSUPPORTED'],`${dir} columns ${columns}`);
  // the same plans without the option are unchanged
  for(const dir of ['item24','item56'])assert.equal(reason(golden(dir)),null);
});

const composeVenn=async(plan,browser)=>{
  const checked=compositePanels(plan);
  const panels=checked.map(item=>({plan:item.plan,model:solveDiagram(item.plan.diagram)}));
  const sizes=panels.map(panel=>setDiagramSize(panel.model,{compact:true}));
  const {width}=compositeStackSize(sizes,0,compositePanelLayout(checked,plan));
  return composeCompositeCandidate({plan:{...plan,panels:checked.map(item=>({caption:item.caption,plan:item.plan}))},panels,
    identity:assetIdentity('25_테스트|10','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:{baseFontPx:32,displayScale:Math.min(1,320/width),fontFloorCssPx:11},browser});
};
test('two Venn panels with columns:1 compose as one column: same panel bytes as the grid, every audit PASS',async()=>{
  const browser=await launchBrowser();
  try{
    const stacked=await composeVenn(venn({columns:1}),browser),gridded=await composeVenn(venn(),browser);
    assert.equal(stacked.status,'COMPOSED',JSON.stringify(stacked.detail));
    assert.equal(gridded.status,'COMPOSED',JSON.stringify(gridded.detail));
    assert.deepEqual([stacked.layout.kind,stacked.layout.columns,stacked.layout.rows],['STACK',1,2]);
    assert.equal(gridded.layout.kind,'GRID');
    assert.ok(stacked.panels.every(item=>item.staticAudit.status==='PASS'&&item.renderedLayout.status==='PASS'));
    assert.equal(stacked.renderedLayout.status,'PASS');
    const boxes=svg=>[...svg.matchAll(/<image id="p\d+-panel"[^>]*? x="([\d.]+)" y="([\d.]+)" width="(\d+)" height="(\d+)"/g)].map(match=>match.slice(1).map(Number));
    const stack=boxes(stacked.svg),grid=boxes(gridded.svg);
    assert.equal(stack.length,2);
    assert.equal(stack[0][0],stack[1][0],'one column: both panels at the same x');
    assert.ok(stack[1][1]>=stack[0][1]+stack[0][3],'the second panel is below the first');
    assert.deepEqual(stack.map(box=>box.slice(2)),grid.map(box=>box.slice(2)),'each panel keeps its size');
    const canvas=svg=>svg.match(/<svg [^>]*width="(\d+)" height="(\d+)"/).slice(1).map(Number);
    assert.ok(canvas(stacked.svg)[0]<canvas(gridded.svg)[0]&&canvas(stacked.svg)[1]>canvas(gridded.svg)[1],'narrower and taller than the grid');
    assert.deepEqual(stacked.lineage.panelSvgSha256s,gridded.lineage.panelSvgSha256s);
  }finally{await browser.close();}
});

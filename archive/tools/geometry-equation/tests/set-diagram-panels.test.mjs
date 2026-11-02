// G13b: several Venn panels in one composite (2 to 4 panels, two-column grid, nothing else mixed in).
// Chrome-using (composes the figures): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveDiagram,setDiagramSize,FIGURE_CAPABILITY} from '../production/set-diagram-v1.mjs';
import {compositePanels,compositePanelLayout,composeCompositeCandidate,compositeStackSize} from '../production/composite-candidate-svg-v1.mjs';

const plain={kind:'VENN',sets:[{id:'A'},{id:'B'}],elements:[{text:'9',in:['A']}],shade:'A∩B'};
const setPanel=(shade,caption)=>({caption:{text:caption},plan:{capability:FIGURE_CAPABILITY,diagram:{kind:'VENN',sets:[{id:'A'},{id:'B'}],shade}}});
const four=[setPanel('A','ㄴ 좌변'),setPanel('A','ㄴ 우변 A'),setPanel('B','ㄹ 좌변'),setPanel('B','ㄹ 우변 B')];
const composite=panels=>({capability:'composite-panels-v1',panels,caption:'여러 벤다이어그램'});

test('composite set panels: 2 to 4 Venn panels in a two-column grid, nothing else mixed in',()=>{
  const checked=compositePanels(composite(four));
  assert.equal(checked.length,4);
  const layout=compositePanelLayout(checked);
  assert.deepEqual([layout.kind,layout.columns,layout.rows],['GRID',2,2]);
  assert.equal(compositePanels(composite(four.slice(0,2))).length,2);
  const stop=(panels,expected)=>assert.throws(()=>compositePanels(composite(panels)),error=>error.message===expected&&error.detail?.reason===expected.replace(/^COMPOSITE_/,''),expected);
  stop(four.slice(0,1),'COMPOSITE_SET_PANEL_COUNT');
  stop([...four,setPanel('A','다섯째')],'COMPOSITE_SET_PANEL_COUNT');
  const graphLike={caption:{text:'그래프'},plan:{capability:'polynomial-spike-v1',graphPlan:{}}};
  stop([four[0],graphLike],'COMPOSITE_SET_PANEL_MIXED_0');
  // an error inside one panel names the panel and keeps the engine code
  assert.throws(()=>compositePanels(composite([four[0],setPanel('A∩Z','나쁜 식')])),error=>error.message==='PANEL_1:SET_SHADE_INVALID');
  assert.throws(()=>compositePanels(composite([four[0],{caption:{text:'표'},plan:{capability:FIGURE_CAPABILITY,diagram:{kind:'MEMBERSHIP_TABLE',sets:[{id:'A'},{id:'B'}],elements:[{text:'1',in:['A']}]}}}])),error=>error.message==='PANEL_1:SET_PANEL_KIND_UNSUPPORTED');
  // a panel never carries the figure-level texts: the composite owns them
  assert.throws(()=>compositePanels(composite([four[0],{caption:{text:'x'},plan:{...four[1].plan,caption:'c'}}])),error=>error.message==='PANEL_1:SET_PANEL_PLAN_INVALID');
  // a compact panel is narrow enough for the two-column grid of the Archive solution column
  assert.ok(setDiagramSize(solveDiagram(plain),{compact:true}).width<=420);
  assert.ok(compositeStackSize(checked.map(item=>setDiagramSize(solveDiagram(item.plan.diagram),{compact:true})),0,layout).width<=848);
});

test('four Venn panels compose as one 2x2 composite whose panel bytes pass the set observer',async()=>{
  const browser=await launchBrowser();
  try{
    const checked=compositePanels(composite(four));
    const panels=checked.map(item=>({plan:item.plan,model:solveDiagram(item.plan.diagram)}));
    const sizes=panels.map(panel=>setDiagramSize(panel.model,{compact:true}));
    const {width}=compositeStackSize(sizes,0,compositePanelLayout(checked));
    const composed=await composeCompositeCandidate({plan:{...composite(four),panels:checked.map(item=>({caption:item.caption,plan:item.plan}))},panels,
      identity:assetIdentity('25_테스트|10','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:{baseFontPx:32,displayScale:Math.min(1,320/width),fontFloorCssPx:11},browser});
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.equal(composed.layout.kind,'GRID');assert.deepEqual([composed.layout.columns,composed.layout.rows],[2,2]);
    assert.equal(composed.panels.length,4);
    assert.ok(composed.panels.every(item=>item.staticAudit.status==='PASS'&&item.renderedLayout.status==='PASS'));
    assert.match(composed.svg,/data-composite="composite-panels-v1"/);
  }finally{await browser.close();}
});

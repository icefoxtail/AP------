// G13b: several Venn panels in one composite (2 to 6 panels, two-column grid, nothing else mixed in).
// Chrome-using (composes the figures): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveDiagram,setDiagramSize,FIGURE_CAPABILITY} from '../production/set-diagram-v1.mjs';
import {compositePanels,compositePanelLayout,compositePanelBytes,composeCompositeCandidate,compositeStackSize} from '../production/composite-candidate-svg-v1.mjs';

const plain={kind:'VENN',sets:[{id:'A'},{id:'B'}],elements:[{text:'9',in:['A']}],shade:'A∩B'};
const setPanel=(shade,caption)=>({caption:{text:caption},plan:{capability:FIGURE_CAPABILITY,diagram:{kind:'VENN',sets:[{id:'A'},{id:'B'}],shade}}});
const four=[setPanel('A','ㄴ 좌변'),setPanel('A','ㄴ 우변 A'),setPanel('B','ㄹ 좌변'),setPanel('B','ㄹ 우변 B')];
const composite=panels=>({capability:'composite-panels-v1',panels,caption:'여러 벤다이어그램'});
const six=[...four,setPanel('A','다섯째'),setPanel('B','여섯째')];

test('composite set panels: 2 to 6 Venn panels in a two-column grid, nothing else mixed in',()=>{
  const checked=compositePanels(composite(four));
  assert.equal(checked.length,4);
  const layout=compositePanelLayout(checked);
  assert.deepEqual([layout.kind,layout.columns,layout.rows],['GRID',2,2]);
  assert.equal(compositePanels(composite(four.slice(0,2))).length,2);
  const stop=(panels,expected)=>assert.throws(()=>compositePanels(composite(panels)),error=>error.message===expected&&error.detail?.reason===expected.replace(/^COMPOSITE_/,''),expected);
  stop(four.slice(0,1),'COMPOSITE_SET_PANEL_COUNT');
  // five and six panels are allowed (two columns, three rows, an odd last panel in the left cell); seven are refused
  assert.deepEqual([compositePanelLayout(compositePanels(composite(six.slice(0,5)))).rows,compositePanelLayout(compositePanels(composite(six))).rows],[3,3]);
  stop([...six,setPanel('A','일곱째')],'COMPOSITE_SET_PANEL_COUNT');
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

const composeSet=async(panelPlans,browser)=>{
  const checked=compositePanels(composite(panelPlans));
  const panels=checked.map(item=>({plan:item.plan,model:solveDiagram(item.plan.diagram)}));
  const sizes=panels.map(panel=>setDiagramSize(panel.model,{compact:true}));
  const {width}=compositeStackSize(sizes,0,compositePanelLayout(checked));
  return composeCompositeCandidate({plan:{...composite(panelPlans),panels:checked.map(item=>({caption:item.caption,plan:item.plan}))},panels,
    identity:assetIdentity('25_테스트|10','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:{baseFontPx:32,displayScale:Math.min(1,320/width),fontFloorCssPx:11},browser});
};
test('four Venn panels compose as one 2x2 composite whose panel bytes pass the set observer',async()=>{
  const browser=await launchBrowser();
  try{
    const composed=await composeSet(four,browser);
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.equal(composed.layout.kind,'GRID');assert.deepEqual([composed.layout.columns,composed.layout.rows],[2,2]);
    assert.equal(composed.panels.length,4);
    assert.ok(composed.panels.every(item=>item.staticAudit.status==='PASS'&&item.renderedLayout.status==='PASS'));
    assert.match(composed.svg,/data-composite="composite-panels-v1"/);
  }finally{await browser.close();}
});

test('five frameless three-set options keep their independently audited shade atoms',async()=>{
  const options=['A∪B','(A∩B)∪(A∩C)∪(B∩C)','A','(A∩C)∪(B∩C)','(B-A)∪(A∩C)'].map((shade,index)=>({
    caption:{math:String(index+1)},
    plan:{capability:FIGURE_CAPABILITY,diagram:{kind:'VENN',sets:[{id:'A'},{id:'B'},{id:'C'}],shade,showUniverse:false}},
  }));
  const browser=await launchBrowser();
  try{
    const result=await composeSet(options,browser);
    assert.equal(result.status,'COMPOSED',JSON.stringify(result.detail));
    assert.ok(result.panels.every(panel=>panel.staticAudit.status==='PASS'&&panel.renderedLayout.status==='PASS'));
    const svgs=compositePanelBytes(result.svg).map(panel=>panel.bytes.toString('utf8'));
    assert.equal(svgs.length,5);
    const expected=[[1,2,3,5,6,7],[3,5,6,7],[1,3,5,7],[5,6,7],[2,5,6,7]];
    for(const [index,svg] of svgs.entries()){
      assert.doesNotMatch(svg,/data-role="universal"|id="universal-name"/);
      assert.equal([...svg.matchAll(/<ellipse id="set-[A-C]" data-role="set"/g)].length,3);
      assert.deepEqual([...svg.matchAll(/<path id="shade-(\d+)"/g)].map(hit=>Number(hit[1])),expected[index]);
    }
  }finally{await browser.close();}
});

test('five and six Venn panels compose in three rows: same panel size and font as four panels, a taller canvas, observer and layout PASS',async()=>{
  const browser=await launchBrowser();
  try{
    const composedFour=await composeSet(four,browser);
    assert.equal(composedFour.status,'COMPOSED',JSON.stringify(composedFour.detail));
    const imageBoxes=svg=>[...svg.matchAll(/<image id="p\d+-panel"[^>]*? x="([\d.]+)" y="([\d.]+)" width="(\d+)" height="(\d+)"/g)].map(match=>match.slice(1).map(Number));
    const canvas=svg=>svg.match(/<svg [^>]*width="(\d+)" height="(\d+)"/).slice(1).map(Number);
    const fonts=svg=>[...new Set([...svg.matchAll(/data-font-px="([\d.]+)"/g)].map(match=>match[1]))];
    for(const count of [5,6]){
      const composed=await composeSet(six.slice(0,count),browser);
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assert.deepEqual([composed.layout.kind,composed.layout.columns,composed.layout.rows],['GRID',2,3]);
      assert.equal(composed.panels.length,count);
      assert.ok(composed.panels.every(item=>item.staticAudit.status==='PASS'&&item.renderedLayout.status==='PASS'),'every panel passes the set observer and the rendered layout');
      assert.equal(composed.renderedLayout.status,'PASS');
      const boxes=imageBoxes(composed.svg);
      assert.equal(boxes.length,count);
      // every panel is drawn at the size of a panel in the four-panel figure; only the canvas grows (taller, not wider)
      const fourBoxes=imageBoxes(composedFour.svg);
      assert.ok(boxes.every(box=>box[2]===fourBoxes[0][2]&&box[3]===fourBoxes[0][3]));
      assert.deepEqual(fonts(composed.svg),fonts(composedFour.svg));
      assert.equal(canvas(composed.svg)[0],canvas(composedFour.svg)[0]);
      assert.ok(canvas(composed.svg)[1]>canvas(composedFour.svg)[1]);
      // an odd last panel sits in the left cell of its row
      if(count===5)assert.equal(boxes[4][0],boxes[0][0]);
    }
  }finally{await browser.close();}
});

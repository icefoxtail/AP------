// A Venn figure whose element labels have no room in their regions (2026-11-22, 확통 해설 그림 14개): the figure is laid out again, in this order and only after the plain layout failed:
// the labels wrapped at their spaces onto 2 to 4 lines, the circles and rectangle redrawn larger or farther apart, last an element led out (its label in the free space, a leader to a dot in its region).
// A figure that fits as first drawn is what it was. Chrome-using (composes the figures): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveDiagram,composeSetDiagramFigure,setDiagramSize,setDiagramAttempts,layoutSetDiagram,setDiagramPanelSpec,FIGURE_CAPABILITY} from '../production/set-diagram-v1.mjs';
import {typesetter} from '../production/typography.mjs';
import {objectSha} from '../../pipeline-core/canonical.mjs';

const plan=diagram=>({capability:FIGURE_CAPABILITY,diagram,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'diagram'}],newVisualInformation:['n']});
// the font the Archive asks of a 470 x 330 figure (11.25 css px at the displayed size)
const policy={baseFontPx:28.2,displayScale:0.4,fontFloorCssPx:11};
const run=async(diagram,browser,n)=>{
  const p=plan(diagram),model=solveDiagram(diagram);
  return composeSetDiagramFigure({plan:p,model,identity:assetIdentity('26_테스트|'+(8000+n),'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
};
const ok=composed=>{assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');};
const boxOf=(svg,id)=>svg.match(new RegExp(`<g id="${id}"[^>]*data-box="([^"]+)"`))[1].split(',').map(Number);
const universalX=svg=>Number(svg.match(/id="universal"[^>]*? x="([\d.]+)"/)[1]);

// 19 매산여고 기말 Q12: three Korean sentences, A inside B
const sentences={kind:'VENN',sets:[{id:'A'},{id:'B'}],elements:[{text:'A와 B에 모두 속함',in:['A','B']},{text:'B에만 속함',in:['B']},{text:'어느 쪽에도 속하지 않음',in:[]}],shade:'A',subset:['A','B']};
// 24 순천여고 Q9: short labels, the one outside both circles has no corner to stand in at the first size
const corner={kind:'VENN',sets:[{id:'A'},{id:'B'}],elements:[{text:'A만',in:['A']},{text:'둘 다',in:['A','B']},{text:'B만',in:['B']},{text:'빠진 1개',in:[]}],shade:'A∩B'};
// 20 매산여고 중간 Q8: formulas cannot be wrapped; the ones that have no room in their regions are led out
const formulas={kind:'VENN',sets:[{id:'A'},{id:'B'}],elements:[{text:'P(A)(1−P(B))',in:['A']},{text:'P(A)P(B)',in:['A','B']},{text:'(1−P(A))P(B)',in:['B']},{text:'(1−P(A))(1−P(B))',in:[]}],shade:'A^c∪B'};
// a figure that fits as first drawn
const fits={kind:'VENN',sets:[{id:'A'},{id:'B'}],elements:[{text:'1',in:['A']},{text:'2',in:['A','B']},{text:'3',in:['B']}],shade:'A'};

test('the layouts are tried plain first, leaders last; nothing but a Venn figure is laid out again',()=>{
  const list=setDiagramAttempts(solveDiagram(fits));
  assert.deepEqual(list[0],{wrap:0,variant:0,elementLeaders:false});
  const firstLeader=list.findIndex(way=>way.elementLeaders);
  assert.ok(firstLeader>0&&list.slice(0,firstLeader).every(way=>!way.elementLeaders)&&list.slice(firstLeader).every(way=>way.elementLeaders),'every plain way comes before any led-out way');
  assert.equal(new Set(list.map(way=>JSON.stringify(way))).size,list.length,'no way is tried twice');
  assert.deepEqual(setDiagramAttempts({kind:'MAPPING'}),[{wrap:0,variant:0,elementLeaders:false}]);
});

test('the figure size never depends on the layout tried: the Archive measures it before composing',()=>{
  assert.deepEqual(setDiagramSize(solveDiagram(sentences)),{width:470,height:330});
});

test('long labels are wrapped onto lines inside their regions, text kept whole',async()=>{
  const browser=await launchBrowser();
  try{
    const composed=await run(sentences,browser,1);ok(composed);
    for(const text of ['A와 B에 모두 속함','B에만 속함','어느 쪽에도 속하지 않음'])assert.ok(composed.svg.includes(`data-text="${text}"`),text+' is shown whole');
    assert.ok(boxOf(composed.svg,'element-0')[3]>60,'the lens label stands on more than one line');
  }finally{await browser.close();}
});

test('a label with no corner to stand in is placed by redrawing the circles, no leader',async()=>{
  const browser=await launchBrowser();
  try{
    const composed=await run(corner,browser,2);ok(composed);
    assert.ok(!/element-\d+-leader/.test(composed.svg));
    assert.notEqual(universalX(composed.svg),56,'the rectangle was redrawn to fill the frame');
  }finally{await browser.close();}
});

test('an element that cannot stand in its region is led out: label outside the circles, dot inside its region, observer PASS',async()=>{
  const browser=await launchBrowser();
  try{
    const composed=await run(formulas,browser,3);ok(composed);
    const led=[...composed.svg.matchAll(/id="element-(\d+)-leader"/g)].map(m=>m[1]);
    assert.ok(led.length>=1&&!led.includes('3'),'a led-out element exists, never the one outside both circles: '+led);
    for(const index of led)assert.ok(new RegExp(`id="element-${index}-dot" data-role="element-dot"`).test(composed.svg),'each leader ends in its dot');
    assert.equal([...composed.svg.matchAll(/data-label-role="element"/g)].length,4,'no element is dropped');
  }finally{await browser.close();}
});

test('a figure that fits as first drawn is drawn as first drawn: the original rectangle, no leader',async()=>{
  const browser=await launchBrowser();
  try{
    const composed=await run(fits,browser,4);ok(composed);
    assert.equal(universalX(composed.svg),56);
    assert.ok(!/element-\d+-leader/.test(composed.svg));
  }finally{await browser.close();}
});

test('outside elements that fit nowhere are still refused: an outside element has no region to be led into',async()=>{
  const browser=await launchBrowser();
  try{
    const jam={kind:'VENN',sets:[{id:'S'}],elements:[...Array(12).keys()].map(k=>({text:`${k+1}→${k+3}→${k+5}→${k+1}`,math:true,in:[]}))};
    const composed=await run(jam,browser,5).then(value=>value,error=>({status:'THROWN',detail:error.message}));
    assert.notEqual(composed.status,'COMPOSED');
    assert.ok(/SET_ELEMENT_NO_ROOM/.test(JSON.stringify(composed.detail)),JSON.stringify(composed.detail));
  }finally{await browser.close();}
});

// A compact Venn panel of a composite that is laid out again (wrapped, or an element led out) is still the figure the composite's inverse observation re-derives: the spec it hashes is the plain one
import {compositePanels,compositePanelLayout,composeCompositeCandidate,compositeStackSize} from '../production/composite-candidate-svg-v1.mjs';
test('a compact Venn panel that needs wrapped labels or a leader composes in a composite, with the composite\'s inverse observation passing',async()=>{
  const setPanel=(diagram,caption)=>({caption:{text:caption},plan:{capability:FIGURE_CAPABILITY,diagram}});
  const panelPlans=[setPanel({kind:'VENN',sets:[{id:'A'},{id:'B'}],shade:'A'},'ㄱ'),setPanel({kind:'VENN',sets:[{id:'A'},{id:'B'}],elements:[{text:'수학만 30명',in:['A']}],shade:'A∩B'},'ㄴ')];
  const wrapper={capability:'composite-panels-v1',panels:panelPlans,caption:'세 벤다이어그램'};
  const browser=await launchBrowser();
  try{
    const checked=compositePanels(wrapper);
    const panels=checked.map(item=>({plan:item.plan,model:solveDiagram(item.plan.diagram)}));
    const sizes=panels.map(panel=>setDiagramSize(panel.model,{compact:true}));
    const {width}=compositeStackSize(sizes,0,compositePanelLayout(checked));
    const composed=await composeCompositeCandidate({plan:{...wrapper,panels:checked.map(item=>({caption:item.caption,plan:item.plan}))},panels,identity:assetIdentity('25_테스트|11','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:{baseFontPx:32,displayScale:Math.min(1,320/width),fontFloorCssPx:11},browser});
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.ok(composed.panels.every(item=>item.staticAudit.status==='PASS'&&item.renderedLayout.status==='PASS'));
  }finally{await browser.close();}
});

test('the spec a panel hashes does not depend on how its labels were placed (wrapped, led out): the composite re-derives the plain one',()=>{
  const model=solveDiagram(fits),identity={visualAssetKey:'sha256:probe'},typeset=typesetter();
  const base=layoutSetDiagram({plan:plan(fits),model,identity,typeset,font:20,compact:true}).specSha256;
  for(const way of [{wrap:2},{elementLeaders:true},{wrap:3,elementLeaders:true}])assert.equal(layoutSetDiagram({plan:plan(fits),model,identity,typeset,font:20,compact:true,...way}).specSha256,base,JSON.stringify(way));
  assert.equal(base,objectSha(setDiagramPanelSpec(plan(fits),model)),'and it is the one the composite hashes');
});

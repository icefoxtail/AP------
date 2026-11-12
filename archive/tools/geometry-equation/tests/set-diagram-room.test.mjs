// Venn element labels that did not fit one by one (21 매산고 고1 2학기 중간 Q14 and Q19): the labels of one region are packed together in centred rows,
// each keeping the room from the circle's line that the independent observer demands. A region that really cannot hold its labels is still refused.
// Chrome-using (composes the figures): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveDiagram,composeSetDiagramFigure,FIGURE_CAPABILITY} from '../production/set-diagram-v1.mjs';

const plan=diagram=>({capability:FIGURE_CAPABILITY,diagram,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'diagram'}],newVisualInformation:['n']});
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const identity=assetIdentity('21_매산고_2학기_중간_고1_기출|14','SOLUTION_VISUAL','decisive-relation');
const run=async(diagram,browser,compact=false)=>{const p=plan(diagram);return composeSetDiagramFigure({plan:p,model:solveDiagram(diagram),identity,typographyPolicy:policy,browser,compact});};
const boxes=svg=>Object.fromEntries([...svg.matchAll(/<g id="(element-\d+)"[^>]*data-box="([^"]+)"/g)].map(m=>[m[1],m[2].split(',').map(Number)]));

// Q14: two 133-px chains of arrows in the single circle of S (the old one-by-one placement left the second one 0.3 px inside the line: SD_ELEMENT_REGION:1)
const cycles={kind:'VENN',sets:[{id:'S'}],elements:[{text:'1→4→2→1',math:true,in:['S']},{text:'3→5→6→3',math:true,in:['S']}]};
// Q19: two Korean labels stacked inside the lens A∩B, one label each in the other regions (the old placement left the second lens label no room: SET_ELEMENT_NO_ROOM)
const lens={kind:'VENN',sets:[{id:'A'},{id:'B'}],elements:[
  {text:'(2,0)',math:true,in:['A']},{text:'(0,1)',math:true,in:['A']},{text:'최대점',in:['A','B']},{text:'최소점',in:['A','B']},
  {text:'(3,2)',math:true,in:['B']},{text:'(−3,−2)',math:true,in:['B']}]};

test('Q14 single circle: two long element rows are packed one under the other, in plan order, observer and layout PASS',async()=>{
  const browser=await launchBrowser();
  try{
    for(const compact of [false,true]){
      const composed=await run(cycles,browser,compact);
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.renderedLayout.status,'PASS');
      const at=boxes(composed.svg);
      assert.ok(at['element-0'][1]<at['element-1'][1],'rows keep the plan order');
      assert.ok(Math.abs(at['element-0'][0]-at['element-1'][0])<1e-6,'both rows are centred on the same axis');
    }
  }finally{await browser.close();}
});

test('Q19 lens: two labels fit inside the intersection of two circles, and every other region keeps its labels',async()=>{
  const browser=await launchBrowser();
  try{
    const composed=await run(lens,browser);
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.renderedLayout.status,'PASS');
    assert.equal(Object.keys(boxes(composed.svg)).length,6,'no element is dropped');
  }finally{await browser.close();}
});

test('a region that cannot hold its labels even in rows is still refused, nothing is dropped',async()=>{
  const browser=await launchBrowser();
  try{
    const jam={kind:'VENN',sets:[{id:'S'}],elements:['1→4→2→1','3→5→6→3','7→8→9→7','2→3→4→2','5→6→7→5','8→9→1→8'].map(text=>({text,math:true,in:['S']}))};
    await assert.rejects(run(jam,browser),error=>error.message==='SET_ELEMENT_NO_ROOM');
  }finally{await browser.close();}
});

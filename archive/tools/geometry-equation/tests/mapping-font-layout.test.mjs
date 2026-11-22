// A set-diagram mapping follows the policy font: a column name taller than the room above the ovals slides up, and the rows of a column with two or more elements keep the elements apart.
// With no font, or a font the base layout holds, every figure is laid out exactly as before. The element text rule (SET_ELEMENT_TEXT_UNSUPPORTED) is untouched. Chrome-using: --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {typesetter} from '../production/typography.mjs';
import {solveDiagram,setDiagramSize,layoutSetDiagram,composeSetDiagramFigure,checkSetDiagramPlan,FIGURE_CAPABILITY} from '../production/set-diagram-v1.mjs';

const identity=assetIdentity('25_테스트|3','SOLUTION_VISUAL','decisive-relation');
const arrow=(a,b,c,d)=>({from:{column:a,element:b},to:{column:c,element:d},style:'SOLID'});
const named={kind:'MAPPING',columns:[{id:'A',name:'첫 공',elements:['첫흰']},{id:'B',name:'첫 확률',elements:['4/10']},{id:'C',name:'경로 확률',elements:['24/90']}],arrows:[arrow(0,0,1,0),arrow(1,0,2,0)]};
const rows={kind:'MAPPING',columns:[{id:'A',name:'첫 공',elements:['첫흰','첫검']},{id:'B',name:'첫 확률',elements:['4/10','6/10']},{id:'C',name:'둘째 검정',elements:['6/9','5/9']}],arrows:[arrow(0,0,1,0),arrow(0,1,1,1),arrow(1,0,2,0),arrow(1,1,2,1)]};
const plan=diagram=>({capability:FIGURE_CAPABILITY,diagram,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'diagram'}],newVisualInformation:['n']});
const lay=(diagram,font)=>{try{layoutSetDiagram({plan:plan(diagram),model:solveDiagram(diagram),identity,typeset:typesetter(),font});return 'OK';}catch(error){return error.status??error.message;}};

test('column names that were refused at a policy font above about 27 now slide up; at the limit the old code still refuses',()=>{
  for(const font of [20,22,24,26,27,28.6,30])assert.equal(lay(named,font),'OK',String(font));
  assert.equal(lay(named,32),'MAPPING_COLUMN_NAME_OVERLAPS_OVAL');   // no room left above the ovals: the same code as before
});

test('rows of two elements keep apart at the policy font and the size follows the font; with no font the size is the base size',()=>{
  const model=solveDiagram(rows),base=setDiagramSize(model);
  assert.deepEqual(setDiagramSize(model,{fontPx:20}),base);
  assert.deepEqual(setDiagramSize(model,{fontPx:22}),base);
  assert.ok(setDiagramSize(model,{fontPx:28.6}).height>base.height);
  assert.equal(setDiagramSize(model,{fontPx:28.6}).width,base.width);
  for(const font of [20,24,26,28.6,30])assert.equal(lay(rows,font),'OK',String(font));
  // a one-row mapping never changes size with the font
  const one=solveDiagram(named);assert.deepEqual(setDiagramSize(one,{fontPx:28.6}),setDiagramSize(one));
});

test('the figure composes at the Archive font with the observer and the rendered layout passing',async()=>{
  const browser=await launchBrowser();
  try{
    for(const diagram of [named,rows]){
      const p=plan(diagram),model=checkSetDiagramPlan(p);
      const composed=await composeSetDiagramFigure({plan:p,model,identity,typographyPolicy:{baseFontPx:28.6,displayScale:0.4,fontFloorCssPx:11},browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.renderedLayout.status,'PASS');
      const size=setDiagramSize(model,{fontPx:28.6});
      assert.match(composed.svg,new RegExp(`viewBox="0 0 ${size.width} ${size.height}"`));   // composing and the size the Archive measures agree
    }
  }finally{await browser.close();}
});

test('the element text rule is unchanged: a comma list or an interval is still refused',()=>{
  assert.throws(()=>solveDiagram({kind:'VENN',sets:[{id:'A'},{id:'B'}],elements:[{text:'P(A∩B)',in:['A','B']}]}),error=>error.message==='SET_ELEMENT_TEXT_UNSUPPORTED');
  assert.throws(()=>solveDiagram({kind:'VENN',sets:[{id:'A'},{id:'B'}],elements:[{text:'1≤x≤3',in:['A']}]}),error=>error.message==='SET_ELEMENT_TEXT_UNSUPPORTED');
});

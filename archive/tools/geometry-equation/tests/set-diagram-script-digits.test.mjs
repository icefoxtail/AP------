// Unicode superscripts/subscripts in a Venn element (21 매산고 고1 2학기 중간 Q09: 4k²−4k+1): MathJax drew ² as a font-fallback <text> glyph and the rendered check
// failed the figure with a nameless LABEL_OVERLAP::element-1 and PUBLICATION_FONT_BELOW_11_CSS_PX:. The engine now typesets them as TeX; data-tex keeps the author's text.
// Chrome-using (composes the figures): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveDiagram,composeSetDiagramFigure,setDiagramTypesetTex,FIGURE_CAPABILITY} from '../production/set-diagram-v1.mjs';

const plan=diagram=>({capability:FIGURE_CAPABILITY,diagram,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'diagram'}],newVisualInformation:['n']});
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const identity=assetIdentity('21_매산고_2학기_중간_고1_기출|9','SOLUTION_VISUAL','decisive-relation');
const run=async(diagram,browser)=>composeSetDiagramFigure({plan:plan(diagram),model:solveDiagram(diagram),identity,typographyPolicy:policy,browser});
const venn=(a,b)=>({kind:'VENN',sets:[{id:'A'},{id:'B'}],disjoint:[['A','B']],elements:[{text:a,math:true,in:['A']},{text:b,math:true,in:['B']}]});

test('unicode super/subscript runs become TeX, everything else is untouched',()=>{
  assert.equal(setDiagramTypesetTex('4k²−4k+1'),'4k^{2}−4k+1');
  assert.equal(setDiagramTypesetTex('10⁻²'),'10^{-2}');
  assert.equal(setDiagramTypesetTex('x₁+x₂'),'x_{1}+x_{2}');
  assert.equal(setDiagramTypesetTex('a^2+(2,0)'),'a^2+(2,0)');
});

test('Q09 function-expression steps: 4k²−4k+1 and 2k²−2k+1 compose, labels are outlines, data-tex keeps the typed text',async()=>{
  const browser=await launchBrowser();
  try{
    const composed=await run(venn('4k²−4k+1','2k²−2k+1'),browser);
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.renderedLayout.status,'PASS');
    assert.ok(!/<text[\s>]/.test(composed.svg),'no font-fallback glyph');
    assert.ok(composed.svg.includes('data-tex="4k²−4k+1"')&&composed.svg.includes('data-tex="2k²−2k+1"'));
  }finally{await browser.close();}
});

test('a symbol MathJax cannot outline is refused naming its label, not as a nameless overlap',async()=>{
  const browser=await launchBrowser();
  try{
    const composed=await run(venn('2k−1','12㎡'),browser);
    assert.equal(composed.status,'SET_TYPESET_ERROR');
    assert.equal(composed.detail.labelId,'element-1');assert.equal(composed.detail.code,'MATH_GLYPH_NOT_OUTLINED');
  }finally{await browser.close();}
});

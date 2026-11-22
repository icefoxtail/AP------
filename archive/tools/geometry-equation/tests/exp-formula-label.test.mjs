// The formula the engine prints under an exponential graph (y=A*b^(k*(x-p))+C): the text generator, and the observer's glyph reading of it.
// A factor written next to an integer base read as one number (3 and 2^(x+1) became "32^(x+1)"); the texts below are worked out by hand.
// Needs the render dependencies (mathjax-full, sympy): run with GEOMETRY_NODE_MODULES / PYTHONPATH as the other geometry-equation tests do.
import test from 'node:test';import assert from 'node:assert/strict';import path from 'node:path';
import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {expLogFormulaText} from '../production/phase2.mjs';
import {dependency,dependencyRoot} from '../production/dependencies.mjs';

const probe=fileURLToPath(new URL('./exp_formula_label_probe.py',import.meta.url));
const text=(coefficients,base,shiftX)=>expLogFormulaText({family:'exponential-affine',base,shiftX,coefficients});

// [coefficients, base, shiftX, expected generator text]
const TEXT_CASES=[
  [['3','1','-2'],'2','-1','y=3*2^(x+1)-2'],            // the reported case: 3 * 2^(x+1) - 2
  [['1','1','0'],'2',undefined,'y=2^(x)'],
  [['-3','1','0'],'2',undefined,'y=-3*2^(x)'],
  [['1/2','1','0'],'2',undefined,'y=1/2*2^(x)'],
  [['10','1','0'],'2',undefined,'y=10*2^(x)'],
  [['1','1','0'],'3',undefined,'y=3^(x)'],
  [['-1','1','0'],'2',undefined,'y=-2^(x)'],
  [['3','1','0'],'1/2',undefined,'y=3*(1/2)^(x)'],
  [['3','1','0'],'sqrt(2)',undefined,'y=3*(sqrt(2))^(x)'],
  [['3','1','0'],undefined,undefined,'y=3*e^(x)'],
  [['2','-1','1'],'2',undefined,'y=2*2^(-x)+1'],
  [['1','2','0'],'2',undefined,'y=2^(2x)'],
  [['1','2','0'],'2','1','y=2^(2(x-1))'],
  [['1','-1','0'],'2','1','y=2^(-(x-1))'],
  [['1','1/2','0'],'2',undefined,'y=2^(x/2)'],
  [['1','3/2','0'],'2',undefined,'y=2^(3x/2)'],
  [['1','-1/2','0'],'2','-1','y=2^(-(x+1)/2)'],
  [['1','1','1/2'],'2','1/2','y=2^(x-1/2)+1/2'],
  [['-1/2','1','-3'],'3',undefined,'y=-1/2*3^(x)-3'],
];
test('the exponential formula text keeps a factor and the power apart',()=>{
  for(const [coefficients,base,shiftX,want] of TEXT_CASES)assert.equal(text(coefficients,base,shiftX),want,JSON.stringify([coefficients,base,shiftX]));
});
test('a coefficient is never glued to an integer base, and a logarithm argument writes 3x not (3)x',()=>{
  for(const a of ['2','3','5','10','-2','-3','1/2','-1/2','2/3'])assert.match(text([a,'1','0'],'2'),/\*2\^/,a);
  assert.equal(expLogFormulaText({family:'logarithmic-affine',base:'2',coefficients:['3','3','1','0']}),'y=3logb(2,3*x+1)');
  assert.equal(expLogFormulaText({family:'logarithmic-affine',base:'2',coefficients:['1','1/2','1','0']}),'y=logb(2,(1/2)*x+1)');
  assert.equal(expLogFormulaText({family:'logarithmic-affine',coefficients:['-1','-1','0','2']}),'y=-ln(-x)+2');
});

test('the printed glyphs (real MathJax) are exactly what the observer works out from the numbers, and a missing product sign is caught',()=>{
  const rows=[];
  for(const [coefficients,base,shiftX] of TEXT_CASES)rows.push({text:text(coefficients,base,shiftX),a:coefficients[0],k:coefficients[1],c:coefficients[2],base,shift:shiftX??'0'});
  const run=spawnSync(process.env.GEOMETRY_PYTHON||'python',['-X','utf8',probe],{input:JSON.stringify(rows),encoding:'utf8',env:{...process.env,PYTHONPATH:path.join(dependencyRoot,'python')}});
  assert.equal(run.status,0,run.stderr);
  const probed=JSON.parse(run.stdout);
  const {mathjax}=dependency('mathjax-full/js/mathjax.js');const {TeX}=dependency('mathjax-full/js/input/tex.js');const {SVG}=dependency('mathjax-full/js/output/svg.js');
  const {liteAdaptor}=dependency('mathjax-full/js/adaptors/liteAdaptor.js');const {RegisterHTMLHandler}=dependency('mathjax-full/js/handlers/html.js');
  const adaptor=liteAdaptor();RegisterHTMLHandler(adaptor);const doc=mathjax.document('',{InputJax:new TeX(),OutputJax:new SVG({fontCache:'none'})});
  const glyphs=tex=>[...adaptor.outerHTML(adaptor.firstChild(doc.convert(tex,{display:false}))).matchAll(/data-c="([0-9A-Fa-f]+)"/g)].map(hit=>hit[1].toUpperCase());
  for(const row of probed)assert.deepEqual(glyphs(row.tex),row.want,row.text+' -> '+row.tex);
  // The defect: the same label without the product sign draws 3 and 2 side by side. The observer's expectation (with the dot) does not match it.
  const broken=glyphs('y=32^{x+1}-2'),wanted=probed[0].want;
  assert.notDeepEqual(broken,wanted);
  assert.ok(wanted.includes('22C5')&&!broken.includes('22C5'));
});

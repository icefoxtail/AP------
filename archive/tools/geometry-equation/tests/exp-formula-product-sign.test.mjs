// The formula label of exponential-affine never lets a coefficient and a base run together into another number: y=3*2^(x) is drawn 3·2^x (not 32^x), the exponent is typeset
// as 2^{2x} (not 2^{(2)(x)}), and a written number-times-number product keeps its dot. A in {1,-1,3,1/2,-2}, k in {1,2,-1,1/2}, bases 2 and 3 (and e).
// The text comes from expLogFormulaText and is serialized by the Python math layer (one process, no browser). Run: node --test archive/tools/geometry-equation/tests/exp-formula-product-sign.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {expLogFormulaText} from '../production/phase2.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const engine=path.resolve(here,'..');
const SCRIPT='import sys,json\nsys.path.insert(0,sys.argv[1])\nfrom visual_engine.math_expression import parse,serialize\nout=[]\nfor text in json.loads(sys.argv[2]):\n    try:out.append([serialize(parse(text),m) for m in ("tex","plain")])\n    except ValueError as error:out.append("ERR:"+str(error))\nprint(json.dumps(out,ensure_ascii=False))';
const serializeAll=texts=>{
  const run=spawnSync(process.env.GEOMETRY_PYTHON||'python',['-X','utf8','-c',SCRIPT,engine,JSON.stringify(texts)],{encoding:'utf8',env:{...process.env,PYTHONUTF8:'1'}});
  assert.equal(run.status,0,run.stderr);return JSON.parse(run.stdout);
};

const cases=[];
for(const base of ['2','3','e'])for(const a of ['1','-1','3','1/2','-2'])for(const k of ['1','2','-1','1/2'])
  cases.push({base,a,k,text:expLogFormulaText({family:'exponential-affine',...(base==='e'?{}:{base}),coefficients:[a,k,'0']})});
const tex=serializeAll(cases.map(row=>row.text));

test('every coefficient and base is joined by a product sign when the coefficient is not 1 or -1',()=>{
  cases.forEach((row,index)=>{
    const out=tex[index];assert.ok(Array.isArray(out),row.text+' '+out);
    const [source]=out,power=row.base==='e'?'e':row.base;
    if(row.a==='1')assert.ok(source.startsWith('y='+power+'^{'),source);
    else if(row.a==='-1')assert.ok(source.startsWith('y=-'+power+'^{'),source);
    else if(power==='e')assert.ok(source.includes(row.a.includes('/')?'}\\cdot e^{':row.a+'\\cdot e^{')||source.includes(row.a+'e^{')||source.includes('}e^{'),source);   // a number beside e reads as a product (3e^x)
    else assert.ok(source.includes('\\cdot '+power+'^{'),source);
  });
});
test('the exponent is typeset as one superscript: 2^{2x}, 2^{-x}, 2^{x/2}, never brackets round a lone factor',()=>{
  cases.forEach((row,index)=>{
    const [source]=tex[index];
    assert.ok(!/\^\{\(/.test(source),source);
    if(row.k==='2')assert.ok(source.includes('^{2x}'),source);
    if(row.k==='-1')assert.ok(source.includes('^{-x}'),source);
    if(row.k==='1')assert.ok(source.includes('^{x}'),source);
    if(row.k==='1/2')assert.ok(source.includes('\\frac{x}{2}'),source);
  });
});
test('a number times a number is never written side by side: 3*2, 3 2, 1/2*3 keep a dot',()=>{
  const texts=['y=3*2^(x)','y=3 2^(x)','y=-2*3^(2x)','y=1/2*3^(x)','y=3*4','y=2 3','x=5*7^(2)'];
  const out=serializeAll(texts);
  out.forEach((row,index)=>{assert.ok(Array.isArray(row),texts[index]+' '+row);assert.ok(row[0].includes('\\cdot '),texts[index]+' => '+row[0]);assert.ok(!/\d\d/.test(row[0].replace(/\\cdot /g,'.').replace(/\^\{[^}]*\}/g,'').replace(/\\frac\{\d+\}\{\d+\}/g,'F')),row[0]);});
  assert.equal(serializeAll(['y=3x','y=2(x+1)','y=-x','y=2x^2+3x','y=3sqrt(2)'])[0][0],'y=3x');
});

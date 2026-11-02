// Chrome-using (composes a number-line figure): run with --test-concurrency=1.
// G19: an end or a point may be written as a decimal with up to 2 places (a confidence interval 40.2 to 59.8). Its exact value is the fraction, the label shows the decimal the problem writes,
// and the independent number-line observer reads the label back as the same exact number.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {composeNumberLinePanel} from '../production/quadratic-inequality-chain-v1.mjs';
import {solveNumberLineFigure} from '../production/number-line-v1.mjs';

const observer=fileURLToPath(new URL('../production/number-line-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const C=value=>({value,state:'CLOSED'});
const set=(lo,hi,extra={})=>({kind:'SET',pieces:[{lo:C(lo),hi:C(hi)}],...extra});
const compose=async(numberLine,tag)=>composeNumberLinePanel({plan:{capability:'number-line-v1',numberLine},model:solveNumberLineFigure(numberLine),identity:assetIdentity(`decimal-${tag}|1`,'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy});
const audit=async(svg,numberLine)=>(await pythonWorker({numberLine,svg},{script:observer})).result;
const interval={axisVariable:false,rows:[set('40.2','59.8',{label:'95%',hideSetLabel:true}),set('37.1','62.9',{label:'99%',hideSetLabel:true,integerPoints:true})]};

test('decimal ends are exact fractions that keep the decimal the problem writes',()=>{
  const m=solveNumberLineFigure(interval);
  const first=m.rows[0].pieces[0];
  assert.deepEqual([first.lower.value,first.lower.tex,first.lower.text,first.upper.value,first.upper.tex],['201/5','40.2','40.2','299/5','59.8']);
  assert.deepEqual(m.rows[1].integers.slice(0,2).concat(m.rows[1].integers.slice(-1)),['38','39','62']);
  // a point row takes a decimal too, a negative one and an integer-valued one (written 2.00) as typed
  const p=solveNumberLineFigure({rows:[{kind:'POINTS',points:[{id:'A',value:'-0.25'},{id:'B',value:'1.5'},{id:'C',value:'2'}]}]});
  assert.deepEqual(p.rows[0].points.map(point=>[point.value,point.tex]),[['-1/4','-0.25'],['3/2','1.5'],['2','2']]);
  for(const bad of ['40.234','.5','5.','1e3','40,2','-.5'])assert.throws(()=>solveNumberLineFigure({rows:[set(bad,'60')]}),code('NUMBER_LINE_VALUE_INVALID'),bad);
  assert.throws(()=>solveNumberLineFigure({rows:[set('60.5','40.2')]}));                                          // a decimal is ordered exactly like the fraction it is
});

test('the figure writes the decimals and the observer reads them back as the same exact numbers',async()=>{
  const composed=await compose(interval,'ci');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  for(const text of ['40.2','59.8','37.1','62.9'])assert.ok(composed.svg.includes(text)||composed.svg.includes('data-tex="\\displaystyle '+text+'"'),text);
  const ok=await audit(composed.svg,interval);assert.equal(ok.status,'PASS',JSON.stringify(ok.errors));
  const other={...interval,rows:[set('40.3','59.8',{label:'95%',hideSetLabel:true}),interval.rows[1]]};
  assert.notEqual((await audit(composed.svg,other)).status,'PASS','another end value');
});

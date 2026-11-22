// The optional top-level plan field accessibilityDescription of the standalone figure engines (stat, set, lattice, container): one shared rule, written into the SVG <desc>, read back by each
// engine's independent observer. A plan without the field is written as before (no <title>/<desc> at all for lattice and container). Chrome-using: run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {checkStatChartPlan,composeStatChartFigure,statChartSize} from '../production/stat-chart-v1.mjs';
import {checkSetDiagramPlan,composeSetDiagramFigure} from '../production/set-diagram-v1.mjs';
import {checkLatticePathPlan,composeLatticePathFigure} from '../production/lattice-path-v1.mjs';
import {checkContainerFillPlan,composeContainerFillFigure,containerFillSize} from '../production/container-fill-v1.mjs';
import {assertAccessibleNames} from './accessible-names.mjs';

const dir=name=>fileURLToPath(new URL('../production/'+name,import.meta.url));
const OBSERVER={stat:dir('stat-chart-observer-worker.py'),set:dir('set-diagram-observer-worker.py'),lattice:dir('lattice-path-observer-worker.py'),container:dir('container-fill-observer-worker.py')};
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const identity=assetIdentity('25_테스트|1','SOLUTION_VISUAL','decisive-relation');
const wrap=(capability,body)=>({capability,...body,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'x'}],newVisualInformation:['n']});
const LINE='가지마다 확률을 적어 두 번 모두 1이 나오는 경우를 따라가 확인하는 수형도이다.';
const plans={
  stat:wrap('stat-chart-figure-v1',{chart:{kind:'TREE',root:{children:[{label:'A',p:'1/2',children:[{label:'모두 1',p:'4/9'},{label:'그 외',p:'5/9'}]},{label:'B',p:'1/2',children:[{label:'모두 1',p:'1/9'},{label:'그 외',p:'8/9'}]}]}}}),
  set:wrap('set-diagram-figure-v1',{diagram:{kind:'VENN',sets:[{id:'A'},{id:'B'}],elements:[{text:'9',in:['A']},{text:'9',in:['A','B']},{text:'10',in:['B']}],shade:'A∩B'}}),
  lattice:wrap('lattice-path-figure-v1',{lattice:{grid:{cols:3,rows:2},points:{A:[0,0],B:[3,2]},from:'A',to:'B',counts:true}}),
  container:wrap('container-fill-figure-v1',{container:{pairs:[{vessel:{name:'A',profile:[{kind:'CYLINDER',radius:'2',height:'3'}]}}]}})
};
const check={stat:checkStatChartPlan,set:checkSetDiagramPlan,lattice:checkLatticePathPlan,container:checkContainerFillPlan};
const withLine=(kind,value)=>({...plans[kind],accessibilityDescription:value});
const compose=async(kind,plan,browser)=>{
  const model=check[kind](plan);
  const base={plan,model,identity,typographyPolicy:policy,browser};
  return kind==='stat'?composeStatChartFigure({...base,minSize:statChartSize(model)}):kind==='set'?composeSetDiagramFigure(base):kind==='lattice'?composeLatticePathFigure(base):composeContainerFillFigure(base);
};
const payloadKey={stat:'chart',set:'diagram',lattice:'lattice',container:'container'};
const observe=async(kind,plan,svg,line)=>(await pythonWorker({[payloadKey[kind]]:plan[payloadKey[kind]],svg,...(line!==undefined?{accessibilityDescription:line}:{})},{script:OBSERVER[kind]})).result;

test('every standalone engine accepts the field and refuses a value that is not one non-blank line of at most 500 characters',()=>{
  for(const kind of Object.keys(plans)){
    assert.doesNotThrow(()=>check[kind](withLine(kind,LINE)),kind);
    assert.doesNotThrow(()=>check[kind](withLine(kind,'가'.repeat(500))),kind);
    for(const bad of ['','   ','가'.repeat(501),'두 줄\n입니다',42,null,['가']])assert.throws(()=>check[kind](withLine(kind,bad)),error=>error.message==='INVALID_ACCESSIBILITY_DESCRIPTION',kind+JSON.stringify(bad));
    assert.throws(()=>check[kind]({...plans[kind],other:1}),error=>/_PLAN_INVALID$/.test(error.message),kind+' unknown key');   // the field does not open the plan to other keys
  }
});

test('the plan line is the <desc> of the figure and the independent observer reads it back; a changed or unbound line is caught',async()=>{
  const browser=await launchBrowser();
  try{
    for(const kind of Object.keys(plans)){
      const plan=withLine(kind,LINE),composed=await compose(kind,plan,browser);
      assert.equal(composed.status,'COMPOSED',kind+JSON.stringify(composed.detail));
      assert.equal(composed.staticAudit.status,'PASS',kind);
      assert.equal((composed.svg.match(/<desc\b[^>]*>([^<]*)<\/desc>/)||[])[1],LINE,kind);
      assertAccessibleNames(composed.svg);
      assert.equal((await observe(kind,plan,composed.svg,LINE)).status,'PASS',kind);
      const changed=await observe(kind,plan,composed.svg.replace(LINE,LINE+' 틀림'),LINE);
      assert.equal(changed.status,'FAIL',kind);assert.ok(changed.errors.includes('A11Y_DESCRIPTION_MISMATCH'),kind+JSON.stringify(changed.errors));
      const unbound=await observe(kind,plan,composed.svg.replace(' aria-labelledby="visual-title visual-desc"',''),LINE);
      assert.ok(unbound.errors.includes('A11Y_NAME_BINDING'),kind);
    }
  }finally{await browser.close();}
});

test('without the field a figure is written as before: the fixed kind sentence for stat and set, no <title>/<desc> at all for lattice and container',async()=>{
  const browser=await launchBrowser();
  try{
    for(const kind of Object.keys(plans)){
      const composed=await compose(kind,plans[kind],browser);
      assert.equal(composed.status,'COMPOSED',kind+JSON.stringify(composed.detail));
      const desc=(composed.svg.match(/<desc\b[^>]*>([^<]*)<\/desc>/)||[])[1];
      if(kind==='stat'||kind==='set'){assert.ok(desc&&desc!==LINE,kind);assert.match(composed.svg,/aria-labelledby="visual-title visual-desc"/);}
      else{assert.equal(desc,undefined,kind);assert.doesNotMatch(composed.svg,/<title\b|aria-labelledby/,kind);}
      assert.equal((await observe(kind,plans[kind],composed.svg)).status,'PASS',kind);
      if(kind==='lattice'||kind==='container'){
        const named=await observe(kind,plans[kind],composed.svg.replace('>',' aria-labelledby="visual-title visual-desc"><title id="visual-title">가나</title><desc id="visual-desc">다라</desc>'));
        assert.ok(named.errors.includes('A11Y_UNEXPECTED_NAME'),kind);   // a figure that never writes a name is not allowed to write one nobody asked for
      }
    }
  }finally{await browser.close();}
});

test('a container figure keeps its base size at font 20 and takes the field at the Archive font as well',()=>{
  const model=checkContainerFillPlan(plans.container);
  assert.deepEqual(containerFillSize(model,{fontPx:20}),containerFillSize(model));
  assert.ok(containerFillSize(model,{fontPx:28.6}).width>=containerFillSize(model).width);
});

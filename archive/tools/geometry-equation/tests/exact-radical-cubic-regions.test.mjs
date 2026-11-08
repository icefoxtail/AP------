import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {typesetter} from '../production/typography.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {objectSha} from '../../pipeline-core/canonical.mjs';

const OBSERVER=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));
const base={family:'polynomial',domain:[-2,4],viewport:[-2,4,-4,4],sourceDomain:{kind:'ALL_REALS'},requiredPoints:[],axisTickValues:{x:[],y:[]}};
const q23={...base,overviewHeaderBand:true,plotHeightLimit:360,coefficients:['sqrt(6)','-1','-sqrt(6)','1'],regions:[
  {id:'S1',upper:'f',lower:'axis',from:'-1',to:'1',fill:'LIGHT'},
  {id:'S2',upper:'axis',lower:'f',from:'1',to:'sqrt(6)',fill:'LIGHT'}
]};
const sqrt13={...base,coefficients:['sqrt(13)','-1','-sqrt(13)','1'],regions:[
  {id:'S1',upper:'f',lower:'axis',from:'-1',to:'1',fill:'LIGHT'},
  {id:'S2',upper:'axis',lower:'f',from:'1',to:'sqrt(13)',fill:'LIGHT'}
]};

async function frame(graphPlan){
  const response=await pythonWorker({action:'frame_graph',graphPlan},{timeoutMs:60000});
  return response;
}
async function graph(graphPlan){
  const response=await pythonWorker({action:'graph',graphPlan},{timeoutMs:60000});
  assert.equal(response.status,'OK',JSON.stringify(response.result));
  return response.result;
}
async function observe(graphPlan,model){
  const {aspectPolicy,...transform}=model.transform;
  const response=await pythonWorker({graphPlan,svg:model.svg,transform},{script:OBSERVER,timeoutMs:60000});
  assert.equal(response.status,'OK',JSON.stringify(response.result));
  return response.result;
}
async function composeAndObserve(graphPlan,spec){
  const prepared=await pythonWorker({action:'prepare',spec},{timeoutMs:60000});
  assert.equal(prepared.status,'OK',JSON.stringify(prepared.result));
  const setTypeset=typesetter(),identity={visualAssetKey:objectSha({fixture:'exact-radical-cubic-regions',coefficients:graphPlan.coefficients})};
  const fragments={},measurements={};
  for(const label of prepared.result.labels){
    const numericTick=label.kind==='GRAPH_ANNOTATION'&&/^[-?\d.]+$/.test(label.text);
    fragments[label.id]=setTypeset({id:label.id,owner:label.target||label.id,factRole:spec.displayFacts.factRolesByLabel?.[label.id]||'DERIVED_INTERMEDIATE',fontPx:24.9,...(label.math||label.kind==='POINT_NAME'||numericTick?{kind:'MATH',tex:label.tex||label.text.replaceAll('?','-')}:{kind:'TEXT',text:label.text})},identity);
  }
  const browser=await launchBrowser();
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    for(const [id,fragment] of Object.entries(fragments)){
      await page.setContent(fragment.svg);
      const bbox=await page.locator('svg').first().evaluate(element=>{const box=element.getBBox(),rect=element.getBoundingClientRect();return{x:box.x,y:box.y,width:box.width,height:box.height,viewportWidth:rect.width,viewportHeight:rect.height};});
      assert.ok(bbox.viewportWidth>0&&bbox.viewportHeight>0&&bbox.width>0&&bbox.height>0,`measurement missing: ${id}`);
      fragment.observedBBox=bbox;measurements[id]=[bbox.viewportWidth,bbox.viewportHeight];
    }
    await page.close();
  }finally{await browser.close();}
  const built=await pythonWorker({action:'build',spec,measurements,fragments},{timeoutMs:60000});
  assert.equal(built.status,'OK',JSON.stringify(built.result));
  assert.equal(built.result.witness.layout.status,'PASS',JSON.stringify(built.result.witness.layout));
  const {aspectPolicy,...frame}=built.result.witness.coordinateModel;
  const transform={...frame,displayScale:1};
  const result=await pythonWorker({graphPlan,svg:built.result.svg,transform},{script:OBSERVER,timeoutMs:60000});
  assert.equal(result.status,'OK',JSON.stringify(result.result));
  return {built:built.result,report:result.result};
}

test('Q(sqrt(6)) cubic factors, freezes both bounded x-axis regions and passes the independent observer',async()=>{
  const response=await frame(q23);
  assert.equal(response.status,'OK',JSON.stringify(response.result));
  const {graphPlan}=response.result;
  const roots=graphPlan.overviewFeatures.filter(row=>row.kind==='POLYNOMIAL_FEATURE'&&row.roles.includes('ROOT')).map(row=>row.x);
  assert.deepEqual(roots,[-1,1,Math.sqrt(6)]);
  assert.equal(graphPlan.graphRegionFeatures.regions.length,2);
  const model=await graph(graphPlan);
  assert.match(model.svg,/id="region-S1"/);assert.match(model.svg,/id="region-S2"/);
  const report=await observe(graphPlan,model);
  assert.equal(report.status,'PASS',JSON.stringify(report.errors));
  assert.deepEqual(report.regions.map(row=>row.id),['S1','S2']);

  const spec=specFor({capability:'polynomial-spike-v1',caption:'두 영역을 색칠한다.',graphPlan},model,'radical-cubic-fixture');
  const s1=spec.objects.find(row=>row.id==='region-S1'),s2=spec.objects.find(row=>row.id==='region-S2');
  assert.equal(s1.kind,'GRAPH_REGION');assert.equal(s2.kind,'GRAPH_REGION');
  assert.deepEqual(s1.domain,[-1,1]);assert.deepEqual(s2.domain,[1,Math.sqrt(6)]);
  assert.equal(s1.upper[0].expression,'x^3-sqrt(6)*x^2-x+sqrt(6)');
  assert.equal(s2.lower[0].expression,s1.upper[0].expression);
  const {built,report:finalReport}=await composeAndObserve(graphPlan,spec);
  assert.equal(finalReport.status,'PASS',JSON.stringify(finalReport.errors));
  assert.deepEqual(finalReport.regions.map(row=>row.id),['S1','S2']);
  assert.deepEqual(finalReport.topology.roots.map(([x])=>x),[-1,1,Math.sqrt(6)]);
  assert.match(built.svg,/id="region-S1"/);assert.match(built.svg,/id="region-S2"/);
});

test('the exact-field path is generic across square-free radicands',async()=>{
  const response=await frame(sqrt13);
  assert.equal(response.status,'OK',JSON.stringify(response.result));
  const {graphPlan}=response.result;
  const roots=graphPlan.overviewFeatures.filter(row=>row.kind==='POLYNOMIAL_FEATURE'&&row.roles.includes('ROOT')).map(row=>row.x);
  assert.deepEqual(roots,[-1,1,Math.sqrt(13)]);
  const model=await graph(graphPlan);
  assert.equal((await observe(graphPlan,model)).status,'PASS');
});

test('unsupported fields and cubics that do not split over their coefficient field remain rejected',async()=>{
  const cases=[
    [{...base,coefficients:['sqrt(2)+sqrt(3)','0','0','1']},'INVALID_FRAMING_COEFFICIENTS'],
    [{...base,coefficients:['sqrt(2)','0','0','1']},'UNSUPPORTED_CUBIC_QUARTIC_ALGEBRAIC_FACTORISATION'],
    [{...base,coefficients:['sqrt(3)','0','0','1']},'UNSUPPORTED_CUBIC_QUARTIC_ALGEBRAIC_FACTORISATION'],
    [{...base,coefficients:['0','sqrt(6)','-1','-sqrt(6)','1']},'UNSUPPORTED_CUBIC_QUARTIC_ALGEBRAIC_DEGREE']
  ];
  for(const [graphPlan,code] of cases){
    const response=await frame(graphPlan);
    assert.notEqual(response.status,'OK',code);
    assert.ok(String(response.result?.code).startsWith(code),`${code} expected, received ${JSON.stringify(response.result)}`);
  }
});

test('an exact cubic root inside a shaded interval is still rejected as a crossing',async()=>{
  const response=await frame({...q23,regions:[{id:'S1',upper:'f',lower:'axis',from:'-1',to:'sqrt(6)',fill:'LIGHT'}]});
  assert.notEqual(response.status,'OK');
  assert.ok(String(response.result?.code).includes('GRAPH_REGION_BOUNDARIES_CROSS:S1'),JSON.stringify(response.result));
});

test('rational polynomial regions keep their preexisting rejection',async()=>{
  const region={id:'S',upper:'f',lower:'axis',from:'-1',to:'1',fill:'LIGHT'};
  for(const coefficients of [['0','0','1'],['1','-1','0','1']]){
    const response=await frame({...base,coefficients,regions:[region]});
    assert.notEqual(response.status,'OK');
    assert.ok(String(response.result?.code).includes('GRAPH_REGION_REQUIRES_PIECEWISE_POLYNOMIAL'),JSON.stringify(response.result));
  }
});

test('rational cubic observer payload stays unchanged without regions',async()=>{
  const response=await frame({...base,coefficients:['1','-1','0','1']});
  assert.equal(response.status,'OK',JSON.stringify(response.result));
  const model=await graph(response.result.graphPlan);
  const report=await observe(response.result.graphPlan,model);
  assert.equal(report.status,'PASS',JSON.stringify(report.errors));
  assert.equal(Object.hasOwn(report,'regions'),false);
});

test('malformed polynomial coefficients with regions still fail closed',async()=>{
  const response=await frame({...base,coefficients:null,regions:[{id:'S',upper:'f',lower:'axis',from:'-1',to:'1'}]});
  assert.notEqual(response.status,'OK');
});

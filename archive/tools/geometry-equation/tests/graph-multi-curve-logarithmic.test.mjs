import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';

const observerScript=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));
const lattice=[[0,0],[1,0],[1,1],[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]];
const q20={
  capability:'multi-curve-figure-v1',
  caption:'세 곡선과 정수 격자점',
  graphPlan:{
    family:'multi-curve',
    viewport:[-.42,3.55,-.65,6.55],
    axisTickValues:{x:[1,2,3],y:[1,2,3,4,5]},
    curves:[
      {id:'E',kind:'EXPONENTIAL',base:'5',coefficients:['1','1','0'],shiftX:'1',domain:['0','21/10'],color:'BLUE',weight:'BOLD'},
      {id:'U',kind:'LOGARITHMIC',base:'5',coefficients:['1','1','-1','0'],domain:['3/2','3'],color:'GREEN',style:'DASHED'},
      {id:'D',kind:'LOGARITHMIC',base:'1/3',coefficients:['1','1','-2','0'],domain:['2001/1000','3'],color:'WARM'}
    ],
    overlays:{points:lattice.map(([x,y],index)=>({id:'P'+index,x:String(x),y:String(y),unnamed:true,color:'VIOLET'}))}
  }
};

async function checked(packet,options){
  const result=await pythonWorker(packet,options);
  assert.equal(result.status,'OK',JSON.stringify(result.result));
  return result.result;
}
const frame=graphPlan=>checked({action:'frame_graph',graphPlan});
const observe=(graphPlan,svg,transform)=>checked({action:'modelBinding',graphPlan,svg,transform},{script:observerScript});
async function build(source){
  const {graphPlan}=await frame(source);
  const rendered=await checked({action:'graph',graphPlan});
  return {graphPlan,...rendered};
}
let q20Model;
const model=()=>q20Model??=build(q20.graphPlan);

function polyline(svg,id){
  const tag=svg.match(new RegExp('<polyline\\b[^>]*data-branch="CURVE_'+id+'"[^>]*/>'))?.[0];
  assert.ok(tag,'missing '+id);
  const raw=tag.match(/points="([^"]+)"/)[1];
  return {tag,raw,points:raw.split(/\s+/).map(pair=>pair.split(',').map(Number))};
}
function interpolate(points,x){
  const i=points.findIndex(([px])=>px>=x);
  assert.ok(i>0,'x is inside drawn branch');
  const [[x0,y0],[x1,y1]]=points.slice(i-1,i+1);
  return y0+(y1-y0)*(x-x0)/(x1-x0);
}

test('the three Q20 functions share axes and keep both crossings and the exact lattice witnesses',async()=>{
  const {graphPlan,svg,transform}=await model();
  const {result:observation}=await pythonWorker({graphPlan,svg,transform},{script:observerScript});
  assert.equal(observation.status,'PASS',JSON.stringify(observation.errors));
  assert.equal(observation.curveCount,3);
  assert.equal(graphPlan.equalUnits,true);
  assert.ok(Math.abs(transform.sx-transform.sy)<1e-9);
  const curves=graphPlan.multiCurveFeatures.curves;
  assert.deepEqual(curves.slice(1).map(row=>[row.base,row.naturalDomainBoundaryX]),[['5','1'],['1/3','2']]);
  assert.deepEqual(graphPlan.overlaysFeatures.points.map(row=>[Number(row.xExact),Number(row.yExact)]),lattice);
  assert.equal((svg.match(/<circle\b[^>]*\bid="P\d+"/g)??[]).length,lattice.length);
  assert.doesNotMatch(svg,/data-role="source-domain-endpoint"/);
  const coords=id=>polyline(svg,id).points.map(([x,y])=>[(x-transform.originX)/transform.sx,(transform.originY-y)/transform.sy]);
  const increasing=coords('U'),decreasing=coords('D'),exponential=coords('E');
  for(const [curve,left,right] of [[exponential,2.002,2.006],[increasing,2.68,2.72]]){
    assert.ok(interpolate(curve,left)<interpolate(decreasing,left));
    assert.ok(interpolate(curve,right)>interpolate(decreasing,right));
  }
  const spec=specFor({...q20,graphPlan},null,'q20-mixed-boundaries');
  assert.equal(spec.objects.find(row=>row.id==='curve-U-equation').text,'y=logb(5,x-1)');
  assert.equal(spec.objects.find(row=>row.id==='curve-D-equation').text,'y=logb(1/3,x-2)');
  assert.equal(spec.objects.find(row=>row.id==='f-D').clipRefine,true);
  assert.doesNotMatch(spec.objects.map(row=>row.text??'').join(' '),/정수 좌표\s*9개|④/);
});

test('the observer rejects a truncated near-asymptote curve, a forged natural boundary, and a displaced lattice point',async()=>{
  const {graphPlan,svg,transform}=await model();
  const d=polyline(svg,'D');
  const cut=d.points.findIndex(([x])=>(x-transform.originX)/transform.sx>2.004);
  assert.ok(cut>0&&cut<d.points.length-1);
  assert.ok(d.points[cut][0]-d.points[0][0]<.35,'endpoint y check must catch this subpixel horizontal cut');
  const missing=d.tag.replace(d.raw,d.points.slice(cut).map(pt=>pt.join(',')).join(' '));
  const clipped=await observe(graphPlan,svg.replace(d.tag,missing),transform);
  assert.equal(clipped.status,'FAIL');
  assert.ok(clipped.errors.includes('MULTI_CURVE_COVERAGE_FAIL:CURVE_D'),JSON.stringify(clipped.errors));

  const altered=structuredClone(graphPlan);
  altered.multiCurveFeatures.curves[2].naturalDomainBoundaryX='3';
  const wrongPole=await observe(altered,svg,transform);
  assert.equal(wrongPole.status,'FAIL');
  assert.ok(wrongPole.errors.includes('MULTI_CURVE_INVENTORY_MISMATCH:D'));

  const id='P8';
  const dot=svg.match(new RegExp('<circle\\b[^>]*\\bid="'+id+'"[^>]*/>'))?.[0];
  assert.ok(dot);
  const shifted=dot.replace(/cy="([^"]+)"/,(_match,y)=>'cy="'+(Number(y)+5)+'"');
  const wrongDot=await observe(graphPlan,svg.replace(dot,shifted),transform);
  assert.equal(wrongDot.status,'FAIL');
  assert.match(JSON.stringify(wrongDot.errors),/OVERLAY_POINT_.*P8/);
});

test('a negative affine rate keeps the left domain and invalid log author inputs fail closed',async()=>{
  const plan=structuredClone(q20.graphPlan);
  plan.viewport=[-4,3,-6,13];
  delete plan.overlays;
  plan.curves.splice(1,1);
  plan.curves[1]={id:'D',kind:'LOGARITHMIC',base:'2/3',coefficients:['-2','-1','1','1/4'],domain:['-3','9/10']};
  const built=await build(plan);
  assert.equal(built.graphPlan.multiCurveFeatures.curves[1].naturalDomainBoundaryX,'1');
  assert.equal((await observe(built.graphPlan,built.svg,built.transform)).status,'PASS');
  for(const [edit,code] of [
    [{domain:['-3','1']},'MULTI_CURVE_DOMAIN_INVALID:D'],
    [{domain:['-3','2']},'MULTI_CURVE_DOMAIN_INVALID:D'],
    [{base:'1'},'MULTI_CURVE_LOGARITHMIC_BASE_INVALID:D'],
    [{base:'6/4'},'MULTI_CURVE_LOGARITHMIC_BASE_INVALID:D'],
    [{coefficients:['-2','0','1','1/4']},'MULTI_CURVE_COEFFICIENT_INVALID:D']
  ]){
    const source=structuredClone(plan);
    Object.assign(source.curves[1],edit);
    const rejected=await pythonWorker({action:'frame_graph',graphPlan:source});
    assert.deepEqual([rejected.status,rejected.result.code],['ERROR',code]);
  }
});

import {exactValue} from './phase2.mjs';
// Two discontinuous functions in one solution figure: f over g, two panels that share one x window (same x scale), each named by its caption (y=f(x), y=g(x)).
// The author writes ONE piecewise-discontinuous-spike-v1 plan: graphPlan is f's own plan, graphPlan.referenceCurves[0] is g's pieces (same piece grammar:
// pieces or step, jumpValues, requiredPoints, axisTickValues), graphPlan.layout is 'STACKED', and graphPlan.limitArrows[].curve says which function an arrow runs along.
// The pair becomes composite-panels-v1 (each panel is a normal one-function plan with its own audits), so nothing here draws or measures anything.
export const PAIR_LAYOUTS=['STACKED'];
const curveFields=['id','name','pieces','step','jumpValues','requiredPoints','axisTickValues','exactCoordinates','pointNames'];
const shared=['family','axisTitles','plotHeightLimit'];
const fail=code=>{throw Error(code);};

const finiteEnds=body=>{
  const ends=[];
  for(const piece of body.pieces??[])for(const end of piece.domain??[])if(end!==null&&end!==undefined)ends.push(end);
  if(body.step)ends.push(body.step.xFrom,body.step.xTo);
  for(const value of body.jumpValues??[])ends.push(value.x);
  return ends.map(value=>{try{return exactValue(typeof value==='number'?String(value):value);}catch{fail('PIECEWISE_DISCONTINUOUS_PAIR_X_WINDOW_REQUIRED');}});
};

export function expandDiscontinuousPair(plan){
  const g=plan.graphPlan;
  if(!g||typeof g!=='object'||!Array.isArray(g.referenceCurves)||g.referenceCurves.length!==1)fail('PIECEWISE_DISCONTINUOUS_PAIR_CURVES_INVALID');
  if(g.layout===undefined)fail('PIECEWISE_DISCONTINUOUS_PAIR_LAYOUT_REQUIRED');
  if(!PAIR_LAYOUTS.includes(g.layout))fail('PIECEWISE_DISCONTINUOUS_PAIR_LAYOUT_UNSUPPORTED:'+String(g.layout));
  const ref=g.referenceCurves[0];
  if(!ref||typeof ref!=='object'||Object.keys(ref).some(key=>!curveFields.includes(key))||typeof ref.id!=='string'||!/^[a-hj-wz]$/.test(ref.id))fail('PIECEWISE_DISCONTINUOUS_PAIR_CURVES_INVALID');
  const mainId=g.functionName??'f';
  if(!/^[a-hj-wz]$/.test(mainId)||mainId===ref.id)fail('PIECEWISE_DISCONTINUOUS_PAIR_CURVES_INVALID');
  for(const key of Object.keys(g))if(!['family','pieces','step','jumpValues','requiredPoints','axisTickValues','exactCoordinates','pointNames','functionName','referenceCurves','layout','limitArrows','xWindow',...shared].includes(key))fail('PIECEWISE_DISCONTINUOUS_PAIR_FIELD_UNKNOWN:'+key);
  const bodyOf=source=>Object.fromEntries(['pieces','step','jumpValues','requiredPoints','axisTickValues','exactCoordinates'].filter(key=>source[key]!==undefined).map(key=>[key,source[key]]));
  const mainBody=bodyOf(g),refBody=bodyOf(ref);
  let window=g.xWindow;
  if(window===undefined){
    const ends=[...finiteEnds(mainBody),...finiteEnds(refBody)];
    if(ends.length<2||Math.min(...ends)===Math.max(...ends))fail('PIECEWISE_DISCONTINUOUS_PAIR_X_WINDOW_REQUIRED');
    window=[Math.min(...ends),Math.max(...ends)];
  }
  const arrows=g.limitArrows??[];
  if(!Array.isArray(arrows))fail('PIECEWISE_DISCONTINUOUS_LIMIT_ARROW_INVALID');
  const arrowsFor=id=>arrows.filter(arrow=>(arrow?.curve??mainId)===id).map(({curve,...rest})=>rest);
  if(arrows.some(arrow=>![mainId,ref.id].includes(arrow?.curve??mainId)))fail('PIECEWISE_DISCONTINUOUS_PAIR_ARROW_CURVE_UNKNOWN');
  const panel=(id,body,extra)=>({caption:{math:'y='+id+'(x)'},plan:{capability:plan.capability,graphPlan:{family:g.family,...body,...Object.fromEntries(shared.filter(key=>g[key]!==undefined&&key!=='family').map(key=>[key,g[key]])),xWindow:window,...(extra.length?{limitArrows:extra}:{}),requiredPoints:body.requiredPoints??[],axisTickValues:body.axisTickValues??{x:[],y:[]}}}});
  const {graphPlan,capability,...top}=plan;
  return {...top,capability:'composite-panels-v1',pair:'piecewise-discontinuous-spike-v1',panels:[panel(mainId,mainBody,arrowsFor(mainId)),panel(ref.id,refBody,arrowsFor(ref.id))]};
}

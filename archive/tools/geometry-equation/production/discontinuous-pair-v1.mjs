import {exactValue} from './phase2.mjs';
// Two discontinuous functions in one solution figure: f over g, two panels that share one x window (same x scale), each named by its caption (y=f(x), y=g(x)).
// The author writes ONE piecewise-discontinuous-spike-v1 plan: graphPlan is f's own plan, graphPlan.referenceCurves[0] is g's pieces (same piece grammar:
// pieces or step, jumpValues, requiredPoints, axisTickValues), graphPlan.layout is 'STACKED', and graphPlan.limitArrows[].curve says which function an arrow runs along.
// The pair becomes composite-panels-v1 (each panel is a normal one-function plan with its own audits), so nothing here draws or measures anything.
export const PAIR_LAYOUTS=['STACKED','SHARED'];
const curveFields=['id','name','style','pieces','step','jumpValues','requiredPoints','axisTickValues','exactCoordinates','pointNames','nameLabel','color'];
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
  for(const key of Object.keys(g))if(!['family','pieces','step','jumpValues','requiredPoints','axisTickValues','exactCoordinates','pointNames','functionName','referenceCurves','layout','limitArrows','xWindow','overlays','curveColor','nameLabel','axisVariable',...shared].includes(key))fail('PIECEWISE_DISCONTINUOUS_PAIR_FIELD_UNKNOWN:'+key);
  const bodyOf=source=>Object.fromEntries(['pieces','step','jumpValues','requiredPoints','axisTickValues','exactCoordinates'].filter(key=>source[key]!==undefined).map(key=>[key,source[key]]));
  const mainBody=bodyOf(g),refBody=bodyOf(ref);
  if(g.layout!=='SHARED'&&(g.curveColor!==undefined||g.nameLabel!==undefined||g.axisVariable!==undefined||ref.color!==undefined))fail('PAIR_STACKED_CURVE_FIELDS_UNSUPPORTED:curveColor, nameLabel, axisVariable and color need layout SHARED');
  if(g.layout!=='SHARED'&&(g.overlays!==undefined||ref.nameLabel!==undefined))fail('PAIR_STACKED_OVERLAYS_UNSUPPORTED:overlays and nameLabel need layout SHARED');
  if(g.layout==='SHARED'){
    // SHARED: both functions on one pair of axes. The second curve must be drawn in a line style that tells it from f (DASHED or ACCENT).
    if(!['DASHED','ACCENT'].includes(ref.style))fail('PAIR_SHARED_CURVES_INDISTINCT');
    if((ref.requiredPoints??[]).length)fail('PAIR_SHARED_REQUIRED_POINTS_UNSUPPORTED');
    const arrowsAll=g.limitArrows??[];
    if(!Array.isArray(arrowsAll))fail('PIECEWISE_DISCONTINUOUS_LIMIT_ARROW_INVALID');
    if(arrowsAll.some(arrow=>![mainId,ref.id].includes(arrow?.curve??mainId)))fail('PIECEWISE_DISCONTINUOUS_PAIR_ARROW_CURVE_UNKNOWN');
    const strip=({curve,...rest})=>rest;
    const {referenceCurves,layout,limitArrows,...own}=g;
    const second={id:ref.id,style:ref.style,...(ref.name!==undefined?{name:ref.name}:{}),...(ref.nameLabel!==undefined?{nameLabel:ref.nameLabel}:{}),...(ref.color!==undefined?{color:ref.color}:{}),...(refBody.pieces!==undefined?{pieces:refBody.pieces}:{}),...(refBody.step!==undefined?{step:refBody.step}:{}),...(refBody.jumpValues!==undefined?{jumpValues:refBody.jumpValues}:{}),...(arrowsAll.some(a=>a.curve===ref.id)?{limitArrows:arrowsAll.filter(a=>a.curve===ref.id).map(strip)}:{})};
    const ticks=axis=>[...new Set([...(mainBody.axisTickValues?.[axis]??[]),...(refBody.axisTickValues?.[axis]??[])].map(String))].map(v=>Number.isFinite(Number(v))&&!/[a-z]/i.test(v)?Number(v):v);
    const ownArrows=arrowsAll.filter(a=>(a.curve??mainId)===mainId).map(strip);
    return {...plan,graphPlan:{...own,functionName:mainId,axisTickValues:{x:ticks('x'),y:ticks('y')},...(ownArrows.length?{limitArrows:ownArrows}:{}),sharedCurve:second}};
  }
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

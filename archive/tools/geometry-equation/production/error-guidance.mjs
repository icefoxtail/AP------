// What a failed render tells the author (roadmap 1-1): result.hint (static advice from ops/tools/hints.mjs) and result.fix (machine-usable repair steps).
// Pure functions; they never throw and never change what the render returned. figure-result.json only gets extra fields.
//
// fix shape (documented in author-guide-body.md, enforced by validateFix, which failureGuidance applies to every fix before it is returned):
//   Step   {path, op:'add'|'set'|'remove'|'compare', value?, ids?, labels?, range?, current?, required?, limit?, contains?, overBy?, needs?, expects?}
//   Choice {path, op:'choose', options:[{suggestion?, steps:[Step,...]}, ...], labels?, current?, limit?, overBy?}
// Every value is a number, a boolean, an id that matched a strict pattern, an exact-number text (digits, + - * / ( ) . and the word sqrt) or one of a few
// fixed constants. A fix is built only from numbers and ids the engine computed itself (hintData from the raise site, the framed plan) or from contract
// constants; it never carries an answer value or a free text, so it cannot become a way to put an answer into a figure.
import {hintFor} from '../ops/tools/hints.mjs';
import {canonicalJson} from '../../pipeline-core/canonical.mjs';
import {CANVAS_RANGE} from './phase2.mjs';

// The three ways visual_engine/label_layout.py itself offers when a label found no room (its trace row 'suggestions'); a test keeps this list equal to that source.
export const PLACER_SUGGESTIONS=['LEADER_LINE','VIEWPORT_EXPANSION','PANEL_SPLIT'];
const MAX_HINTS=4;
const OPS=new Set(['add','set','remove','choose','compare']);
const STEP_KEYS=new Set(['path','op','value','ids','labels','range','current','required','limit','contains','overBy','needs','expects','suggestion']);
const CHOICE_KEYS=new Set(['path','op','options','labels','current','limit','overBy','contains']);
const NEEDS=new Set(['id']);
const EXPECTS=new Set(['SAFE_FINITE_NUMBER','PLAIN_JSON_VALUE','UNIQUE_KEYS']);
const SUGGESTIONS=new Set(PLACER_SUGGESTIONS);
const PATH=/^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*|\[\d{1,3}\])*$/;
const ID=/^[A-Za-z][A-Za-z0-9_']{0,31}$/;
const LABEL_ID=/^[A-Za-z0-9_'-]{1,80}$/;
const EXACT=/^(?:[-+*/().0-9]|sqrt)+$/;
const VALUE_KEYS=new Set(['x','y','width','height']);
const RANGE_KEYS=new Set(['width','height','x','window']);

const isPlain=v=>v!==null&&typeof v==='object'&&!Array.isArray(v)&&Object.getPrototypeOf(v)===Object.prototype;
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const okExact=v=>typeof v==='string'&&v.length<=80&&EXACT.test(v);
const okScalar=v=>finite(v)||typeof v==='boolean'||okExact(v);
const okValue=(v,depth=0)=>depth<=3&&(okScalar(v)||Array.isArray(v)&&v.length<=24&&v.every(item=>okValue(item,depth+1))||isPlain(v)&&Object.keys(v).length<=4&&Object.entries(v).every(([key,item])=>VALUE_KEYS.has(key)&&okValue(item,depth+1)));
const okNumbers=v=>finite(v)||Array.isArray(v)&&v.length<=4&&v.every(finite)||isPlain(v)&&Object.keys(v).length<=2&&Object.entries(v).every(([key,item])=>VALUE_KEYS.has(key)&&finite(item));
const okRangeItem=(v,depth=0)=>v===null||finite(v)||okExact(v)||depth<2&&Array.isArray(v)&&v.length<=12&&v.every(item=>okRangeItem(item,depth+1));
const okRange=v=>isPlain(v)&&Object.keys(v).length<=3&&Object.entries(v).every(([key,item])=>RANGE_KEYS.has(key)&&Array.isArray(item)&&item.length<=12&&item.every(okRangeItem));
const okIds=(v,pattern)=>Array.isArray(v)&&v.length>=1&&v.length<=24&&v.every(item=>typeof item==='string'&&pattern.test(item));

// Problems found in a fix, or [] when every key, op and value is inside the documented shape.
export function validateFix(fix,depth=0){
  const bad=[];const fail=why=>{bad.push(why);};
  if(!isPlain(fix)||depth>2){return ['NOT_A_FIX_OBJECT'];}
  if(typeof fix.path!=='string'||!PATH.test(fix.path))fail('path');
  if(!OPS.has(fix.op))fail('op');
  const allowed=fix.op==='choose'?CHOICE_KEYS:STEP_KEYS;
  for(const key of Object.keys(fix))if(!allowed.has(key))fail('key:'+key);
  if('value' in fix&&!okValue(fix.value))fail('value');
  if('ids' in fix&&!okIds(fix.ids,ID))fail('ids');
  if('labels' in fix&&!okIds(fix.labels,LABEL_ID))fail('labels');
  if('range' in fix&&!okRange(fix.range))fail('range');
  for(const key of ['current','required','limit','contains','overBy'])if(key in fix&&!okNumbers(fix[key]))fail(key);
  if('needs' in fix&&!(Array.isArray(fix.needs)&&fix.needs.every(item=>NEEDS.has(item))))fail('needs');
  if('expects' in fix&&!EXPECTS.has(fix.expects))fail('expects');
  if('suggestion' in fix&&!SUGGESTIONS.has(fix.suggestion))fail('suggestion');
  if(fix.op==='choose'){
    if(!Array.isArray(fix.options)||!fix.options.length||fix.options.length>6)fail('options');
    else for(const option of fix.options){
      if(!isPlain(option)||Object.keys(option).some(key=>key!=='suggestion'&&key!=='steps')||!Array.isArray(option.steps)||!option.steps.length||option.steps.length>4||('suggestion' in option&&!SUGGESTIONS.has(option.suggestion)))fail('option');
      else for(const step of option.steps)for(const why of validateFix(step,depth+1))fail('step:'+why);
    }
  }else if('options' in fix)fail('options');
  return bad;
}

const text=value=>{try{return typeof value==='string'?value:JSON.stringify(value??null);}catch{return String(value);}};
// First value inside a nested detail for which pick(node) is not undefined (depth-limited breadth walk).
function find(root,pick,limit=6){
  let level=[root];
  for(let depth=0;depth<=limit&&level.length;depth++){
    const next=[];
    for(const node of level){
      if(node===null||typeof node!=='object')continue;
      const got=pick(node);if(got!==undefined)return got;
      if(Array.isArray(node))next.push(...node);else next.push(...Object.values(node));
    }
    level=next;
  }
  return undefined;
}
const num=v=>finite(v)?v:undefined;

// Where a plan field lives in the plan the author wrote. A failure inside panel i of an expanded plan names that panel's own field.
function targetOf(authored,panel){
  if(panel===undefined||panel===null)return {at:rel=>rel,plain:true};
  if(authored?.capability==='composite-panels-v1')return {at:rel=>`panels[${panel}].plan.${rel}`};
  if(authored?.capability==='piecewise-discontinuous-spike-v1'&&Array.isArray(authored.graphPlan?.referenceCurves)&&(panel===0||panel===1)){
    // A STACKED pair is written as one plan (graphPlan = f, graphPlan.referenceCurves[0] = g) and expanded into two panels.
    const perCurve=new Set(['pieces','step','jumpValues','requiredPoints','axisTickValues','exactCoordinates']);
    return {at:rel=>{
      if(!rel.startsWith('graphPlan.'))return null;
      const field=rel.slice('graphPlan.'.length);
      return panel===1&&perCurve.has(field.split('.')[0])?`graphPlan.referenceCurves[0].${field}`:rel;
    }};
  }
  return {at:()=>null};
}
const planOf=(plan,panel)=>panel===undefined||panel===null?plan:plan?.panels?.[panel]?.plan;
const stepsOf=list=>list.filter(Boolean);
// The graph capabilities whose key point coordinates can stand on a leader line (plan.coordinateLeader, single panel).
const LEADER_CAPABLE=new Set(['polynomial-spike-v1','piecewise-polynomial-spike-v1','piecewise-discontinuous-spike-v1']);
// A choice names the path of its first option's first step, so a reader can always tell where the plan would change.
const choice=(options,extra={})=>options.length?{path:options[0].steps[0].path,op:'choose',...extra,options}:null;

function addRequiredPoints(h,ctx){
  const points=(Array.isArray(h.points)?h.points:[]).filter(p=>isPlain(p)&&okExact(p.x)&&okExact(p.y)).map(p=>({x:p.x,y:p.y}));
  const path=ctx.at('graphPlan.requiredPoints');
  return path&&points.length?[{path,op:'add',value:points,needs:['id']}]:[];
}
function canvasBounds(h,ctx){
  const range=isPlain(h.range)&&Array.isArray(h.range.width)&&Array.isArray(h.range.height)?{width:h.range.width,height:h.range.height}:CANVAS_RANGE;
  const w=num(h.current?.width),ht=num(h.current?.height);
  const clamp=(v,[lo,hi])=>finite(v)?Math.min(hi,Math.max(lo,Math.round(v))):lo;
  const path=ctx.at('coordinateCanvas');
  const current={...(w!==undefined?{width:w}:{}),...(ht!==undefined?{height:ht}:{})};
  return path?[{path,op:'set',value:{width:clamp(w,range.width),height:clamp(ht,range.height)},range:{width:[...range.width],height:[...range.height]},...(Object.keys(current).length?{current}:{})}]:[];
}
function panelTooTall(h,ctx){
  const limit=num(h.limit),height=num(h.height),canvasHeight=num(h.canvasHeight);
  if(limit===undefined||height===undefined)return [];
  const ids=(Array.isArray(h.bandIds)?h.bandIds:[]).filter(id=>typeof id==='string'&&ID.test(id));
  const plan=ctx.planHere||{},options=[];
  if(h.site==='COORDINATE'){
    const bandHeight=num(h.bandHeight),min=num(h.minCanvasHeight);
    // Option 1: a lower canvas, to the highest height that still fits under the limit (the band keeps its height).
    if(bandHeight!==undefined&&min!==undefined&&canvasHeight!==undefined&&canvasHeight>min&&limit-bandHeight>=min&&limit-bandHeight<canvasHeight){
      const path=ctx.at('coordinateCanvas.height');
      if(path)options.push({steps:[{path,op:'set',value:limit-bandHeight,range:{height:[min,limit-bandHeight]},current:canvasHeight}]});
    }
    // Option 2: fewer coordinates in the band, moved back beside their points (the render then tries leader and band steps by itself).
    const move=plan.coordinatePlacement==='PANEL'?[ctx.at('coordinatePlacement')]:ids.length&&Array.isArray(plan.coordinatePanel)?[ctx.at('coordinatePanel')]:[];
    if(move[0])options.push({steps:[plan.coordinatePlacement==='PANEL'?{path:move[0],op:'remove'}:{path:move[0],op:'remove',ids}]});
  }else if(h.site==='GRAPH'&&ctx.single&&ids.length&&LEADER_CAPABLE.has(plan.capability)){
    // Band coordinates of a graph key point go onto a leader line from the dot instead (plan.coordinateLeader); a point may not be in both.
    const steps=[{path:'coordinateLeader',op:'add',ids}];
    if(plan.coordinatePlacement==='PANEL')steps.push({path:'coordinatePlacement',op:'remove'});
    const overlap=ids.filter(id=>Array.isArray(plan.coordinatePanel)&&plan.coordinatePanel.includes(id));
    if(overlap.length)steps.push({path:'coordinatePanel',op:'remove',ids:overlap});
    options.push({steps});
  }
  const made=choice(options,{limit,current:height,overBy:height-limit});
  return made?[made]:[];
}
function sourceGeometry(h,ctx){
  const field=typeof h.field==='string'&&/^display[A-Za-z]{1,16}$/.test(h.field)?h.field:null;
  const ids=(Array.isArray(h.missing)?h.missing:[]).filter(id=>typeof id==='string'&&ID.test(id));
  const path=field&&ctx.at(field);
  return path&&ids.length?[{path,op:'add',ids}]:[];
}
function anchorOffCurve(h,ctx){
  const authoredPair=Array.isArray(ctx.authored?.graphPlan?.referenceCurves);
  const path=authoredPair?'graphPlan.referenceCurves[0].nameLabel.anchorX':'graphPlan.sharedCurve.nameLabel.anchorX';
  const defined=Array.isArray(h.defined)?h.defined.filter(p=>Array.isArray(p)&&p.length===2&&p.every(v=>v===null||okExact(v))):[];
  const options=[{steps:[{path,op:'remove'}]}];
  if(defined.length)options.push({steps:[{path,op:'set',range:{x:defined}}]});
  return [choice(options)];
}
function xWindowTooSmall(h,ctx){
  const lo=num(h.keyMin),hi=num(h.keyMax),path=ctx.at('graphPlan.xWindow');
  if(lo===undefined||hi===undefined||!path)return [];
  const from=Math.floor(lo),to=Math.max(Math.ceil(hi),from+1);
  const current=Array.isArray(h.window)&&h.window.every(finite)?h.window:undefined;
  return [choice([{steps:[{path,op:'remove'}]},{steps:[{path,op:'set',value:[from,to]}]}],{contains:[lo,hi],...(current?{current}:{})})];
}

// LAYOUT_INVENTORY_INCOMPLETE: label ids -> the plan options that pull them out. Steps the render already tried by itself (row.fallback) are not offered again.
function layoutIncomplete(detail,ctx,fallback){
  const found=find(detail,node=>Array.isArray(node.unresolved)?node:undefined);
  if(!found)return [];
  const labels=[...found.unresolved,...(Array.isArray(found.suppressed)?found.suppressed:[])].map(item=>String(item?.id??item)).filter(id=>LABEL_ID.test(id));
  if(!labels.length)return [];
  const tried=new Set(fallback),plan=ctx.planHere||{},gp=plan.graphPlan,keys=Array.isArray(gp?.requiredPoints)?gp.requiredPoints:[];
  const keyIds=[...new Set(labels.map(id=>/^required-point-(\d+)-coordinates$/.exec(id)).filter(Boolean).map(m=>keys[Number(m[1])-1]?.id).filter(id=>typeof id==='string'&&ID.test(id)))];
  const pointIds=[...new Set(labels.map(id=>/^([A-Za-z][0-9']?)-coordinate$/.exec(id)).filter(Boolean).map(m=>m[1]))];
  // a '<mark id>-label' is pulled out with planeMarks.callouts only when that id is really one of the plan's marks
  const knownMarks=new Set(isPlain(plan.planeMarks)?Object.values(plan.planeMarks).flatMap(rows=>Array.isArray(rows)?rows.map(row=>row?.id):[]):[]);
  const markIds=[...new Set(labels.map(id=>/^(.+)-label$/.exec(id)).filter(Boolean).map(m=>m[1]).filter(id=>ID.test(id)&&knownMarks.has(id)))];
  const options=[];
  const paneled=new Set(Array.isArray(plan.coordinatePanel)?plan.coordinatePanel:[]);
  // LEADER_LINE
  if(ctx.single&&LEADER_CAPABLE.has(plan.capability)&&keyIds.length&&!tried.has('COORDINATE_LEADER')&&plan.coordinatePlacement===undefined){
    const steps=[{path:'coordinateLeader',op:'add',ids:keyIds}];
    const overlap=keyIds.filter(id=>paneled.has(id));
    if(overlap.length)steps.push({path:'coordinatePanel',op:'remove',ids:overlap});
    options.push({suggestion:'LEADER_LINE',steps});
  }
  if(markIds.length){const path=ctx.at('planeMarks.callouts');if(path)options.push({suggestion:'LEADER_LINE',steps:[{path,op:'add',ids:markIds}]});}
  // PANEL_SPLIT: only the failed coordinates go to the band (the whole band is a later automatic step)
  // (a hidden point's coordinates stay at the point: the engine refuses them in the band)
  const hidden=new Set(Array.isArray(plan.hiddenPointNames)?plan.hiddenPointNames:[]);
  const bandIds=(keyIds.length?keyIds:pointIds).filter(id=>!hidden.has(id));
  if(bandIds.length&&plan.coordinatePlacement===undefined&&!tried.has('COORDINATE_PANEL_PARTIAL')&&!tried.has('COORDINATE_PANEL')){
    const path=ctx.at('coordinatePanel');
    if(path)options.push({suggestion:'PANEL_SPLIT',steps:[{path,op:'add',ids:bandIds.filter(id=>!paneled.has(id))}].filter(step=>step.ids.length)});
  }
  // VIEWPORT_EXPANSION: a source-coordinate or plane construction asks for a larger canvas, up to the contract maximum
  if(plan.mathPlan){
    const cur=plan.coordinateCanvas,path=ctx.at('coordinateCanvas'),max={width:CANVAS_RANGE.width[1],height:CANVAS_RANGE.height[1]};
    const smaller=!isPlain(cur)||!(cur.width>=max.width&&cur.height>=max.height);
    if(path&&smaller)options.push({suggestion:'VIEWPORT_EXPANSION',steps:[{path,op:'set',value:max,range:{width:[...CANVAS_RANGE.width],height:[...CANVAS_RANGE.height]},...(isPlain(cur)&&finite(cur.width)&&finite(cur.height)?{current:{width:cur.width,height:cur.height}}:{})}]});
  }
  const made=choice(options.filter(option=>option.steps.length),{labels:labels.slice(0,12)});
  return made?[made]:[];
}

function equalUnits(detail,ctx){
  const gp=ctx.planHere?.graphPlan;if(!isPlain(gp))return [];
  const path=ctx.at('graphPlan.axisRatio');if(!path)return [];
  const declared=finite(gp.axisRatio)?gp.axisRatio:1;
  let required=1;
  if(isPlain(gp.axisScale)){const x=Number(gp.axisScale.x),y=Number(gp.axisScale.y);if(x>0&&y>0&&finite(x)&&finite(y))required=y/x;}
  const out=[{path,op:'compare',current:declared,required}];
  const removals=[];
  if(gp.axisSqueeze===true){const p=ctx.at('graphPlan.axisSqueeze');if(p)removals.push({path:p,op:'remove'});}
  if(gp.axisScale!==undefined&&gp.equalUnits===true){const p=ctx.at('graphPlan.axisScale');if(p)removals.push({path:p,op:'remove'});}
  const made=choice(removals.map(step=>({steps:[step]})));
  if(made)out.push(made);
  return out;
}

function notCanonical(detail,ctx){
  const reason=find(detail,node=>typeof node.reason==='string'?node.reason:undefined);
  const probe=(value,prefix)=>{try{canonicalJson(value);return null;}catch(error){return {path:error.path,code:error.code};}};
  let hit=null,prefix='';
  if(reason==='plan'&&ctx.plan)hit=probe(ctx.plan);
  else if(reason==='panelPlan'&&Array.isArray(ctx.plan?.panels))for(const [i,panel] of ctx.plan.panels.entries()){hit=probe(panel.plan);if(hit){prefix=`panels[${i}].plan`;break;}}
  if(!hit||typeof hit.path!=='string')return [];
  const tail=hit.path.replace(/^\$/,'');
  const path=(prefix+tail).replace(/^\./,'');
  const expects={NON_CANONICAL_NUMBER:'SAFE_FINITE_NUMBER',NON_JSON_VALUE:'PLAIN_JSON_VALUE',NORMALIZED_KEY_COLLISION:'UNIQUE_KEYS'}[hit.code];
  return expects&&PATH.test(path)?[{path,op:'set',expects}]:[];
}

/**
 * @param {object} input
 * @param {string|null} input.code     the failure's error code (errorCode of the detail), or null
 * @param {*} input.detail             the thrown detail (object or string), unclipped
 * @param {object} [input.authored]    the plan as the author wrote it
 * @param {object} [input.plan]        the plan as it was when the render failed (framed / composite-expanded)
 * @param {object} [input.hintData]    repair data attached at the raise site (Python hint_data / JS withHint)
 * @param {string[]} [input.fallback]  automatic steps already tried (row.fallback[].to)
 * @returns {{hint:string[],fix:object[]}}
 */
export function failureGuidance({code=null,detail=null,authored=null,plan=null,hintData=null,fallback=[]}={}){
  let hint=[],fix=[];
  try{
    const body=text(detail);
    hint=[...new Set(hintFor(code&&!body.includes(code)?`${code} ${body}`:body))].slice(0,MAX_HINTS);
  }catch{hint=[];}
  try{
    const panel=num(hintData?.panel)??find(detail,node=>Number.isSafeInteger(node.panel)?node.panel:undefined);
    const target=targetOf(authored,panel);
    const ctx={...target,authored,plan,planHere:planOf(plan,panel)??planOf(authored,panel),single:panel===undefined||panel===null};
    if(typeof ctx.at!=='function')ctx.at=()=>null;
    const kind=hintData?.kind;
    let built=[];
    if(kind==='ADD_REQUIRED_POINTS')built=addRequiredPoints(hintData,ctx);
    else if(kind==='CANVAS_BOUNDS')built=canvasBounds(hintData,ctx);
    else if(kind==='PANEL_TOO_TALL')built=panelTooTall(hintData,ctx);
    else if(kind==='SOURCE_GEOMETRY_NOT_DISPLAYED')built=sourceGeometry(hintData,ctx);
    else if(kind==='ANCHOR_X_OFF_CURVE')built=anchorOffCurve(hintData,ctx);
    else if(kind==='X_WINDOW_TOO_SMALL')built=xWindowTooSmall(hintData,ctx);
    else if(code==='LAYOUT_INVENTORY_INCOMPLETE')built=layoutIncomplete(detail,ctx,fallback);
    else if(code==='EQUAL_UNIT_SCALE_MISMATCH')built=equalUnits(detail,ctx);
    else if(code==='COMPOSITE_INPUT_NOT_CANONICAL')built=notCanonical(detail,ctx);
    fix=stepsOf(built).filter(item=>validateFix(item).length===0);
  }catch{fix=[];}
  return {hint,fix};
}

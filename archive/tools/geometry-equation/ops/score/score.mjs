// SVG publication score gate (원장님 2026-11-23: 학생이 읽을 수 있으면 통과, 90점짜리 SVG).
// The observers keep finding and recording everything. Only the publication gate uses this file: a finding costs points by degree,
// a block (wrong value, clipped, half-hidden label, ...) is 0 whatever the rest, a finding that cannot be judged is never covered by a score.
// One place for the numbers: score-table.json next to this file (field tableVersion goes on every receipt; fields are added, never removed).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
export const TABLE_PATH=path.join(here,'score-table.json');
let cached=null;
export function loadTable(file=TABLE_PATH){
  if(file===TABLE_PATH&&cached)return cached;
  const table=JSON.parse(fs.readFileSync(file,'utf8'));
  table.families=(table.families||[]).map(f=>({...f,re:new RegExp(f.match)}));
  if(file===TABLE_PATH)cached=table;
  return table;
}

// Codes that only wrap the real one (the real code is the innermost status / the entries of an errors list).
const WRAPPERS=new Set(['COMPOSITE_PANEL_NOT_COMPOSED','STATIC_GRAPH_AUDIT_FAIL','PLANE_MARKS_AUDIT_FAIL','RENDERED_LAYOUT_FAIL','WORKER_ERROR_WRAPPER','LAYOUT_REPAIR_BINDING_FAIL']);
const isWrapper=c=>WRAPPERS.has(c)||/_RENDERED_LAYOUT_FAIL$/.test(c)||/_AUDIT_FAIL$/.test(c)&&c!=='LAYOUT_REPAIR_AUDIT_FAIL'&&c!=='MEASURED_OWNER_LAYOUT_REPAIR_AUDIT_FAIL';

export function classify(code,table=loadTable(),reason){
  const bare=String(code).split(':')[0];
  // PREFIX:REASON codes: the reason decides (listed reasons first, then the same rule as the bare reason code on desktop, else a block)
  if(table.prefixed?.[bare]){
    const spec=table.prefixed[bare],why=reason??String(code).split(':').slice(1).join(':').split(':')[0];
    const listed=spec.reasons?.[why];
    if(listed)return {source:'prefixed',code:bare,reason:why,track:listed,stage:listed==='INDETERMINATE'?'infra':'post-render',note:spec.about,...(listed==='DEDUCT'?{fixed:3}:{})};
    const like=why?classify(why,table):null;
    if(like&&like.source!=='default')return {...like,source:'prefixed',code:bare,reason:why,note:spec.about};
    return {source:'prefixed',code:bare,reason:why,track:'BLOCK',stage:'post-render',note:spec.about+': unknown reason'};
  }
  if(table.codes[bare])return {source:'code',code:bare,...table.codes[bare]};
  for(const f of table.families)if(f.re.test(bare))return {source:'family',code:bare,track:f.track,stage:f.stage,reason:f.reason};
  return {source:'default',code:bare,...table.default};
}

// Turn a stored engine result (result.json / attempts row) into findings [{code, detail?}].
// errors lists ("LABEL_OVERLAP:a:b"), nested detail.status wrappers and result.code are all read; wrappers are dropped.
export function findingsFromResult(result){
  const out=[];const seen=new Set();
  const push=(code,detail)=>{
    if(!code||typeof code!=='string')return;
    const bare=code.split(':')[0];
    if(!/^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+$/.test(bare)||isWrapper(bare))return;
    const key=code;if(seen.has(key))return;seen.add(key);out.push({code:bare,id:code.includes(':')?code.slice(bare.length+1):undefined,detail});
  };
  const walk=(node,depth=0)=>{
    if(node==null||depth>6)return;
    if(typeof node==='string'){
      if(/^[A-Z][A-Z0-9_]+(:|$)/.test(node)){push(node);return;}
      if(node.startsWith('{')){try{walk(JSON.parse(node),depth+1)}catch{}}
      return;
    }
    if(Array.isArray(node)){for(const v of node)walk(v,depth+1);return;}
    if(typeof node==='object'){
      if(Array.isArray(node.errors)){for(const e of node.errors)walk(e,depth+1);}
      if(typeof node.status==='string'&&!isWrapper(node.status)&&node.status!=='FAILED'&&node.status!=='ARCHIVE_BOUND')push(node.status,node.detail);
      if(typeof node.code==='string')push(node.code,node.detail);
      if(node.detail!=null)walk(node.detail,depth+1);
      if(node.result!=null)walk(node.result,depth+1);
    }
  };
  if(result&&typeof result==='object'){
    if(result.detail!=null)walk(typeof result.detail==='string'?result.detail:result.detail,0);
    if(typeof result.code==='string')push(result.code,undefined);
    // keep the engine-extracted innermost code when the wrappers hid everything
    if(!out.length&&typeof result.status==='string'&&result.status!=='FAILED')push(result.status);
  }
  // prefer result.code first in the order (it is the innermost status the runner picked)
  if(result&&typeof result.code==='string'){out.sort((a,b)=>(b.code===result.code.split(':')[0])-(a.code===result.code.split(':')[0]));}
  // attach measured detail where the engine returned it (degree is computed from it below)
  if(result&&result.detail!=null){
    let d=result.detail;if(typeof d==='string'){try{d=JSON.parse(d)}catch{d=null}}
    const inner=d&&typeof d==='object'?(d.detail&&typeof d.detail==='object'&&d.detail.status?d.detail:d):null;
    for(const f of out){if(f.detail===undefined&&inner&&inner.status===f.code)f.detail=inner.detail;}
  }
  // the same code without a label id is the engine's summary of one of the listed ones; WORKER_ERROR only wraps the code it carries
  const withId=new Set(out.filter(f=>f.id!==undefined).map(f=>f.code));
  let res=out.filter(f=>f.id!==undefined||!withId.has(f.code));
  if(res.some(f=>f.code!=='WORKER_ERROR'))res=res.filter(f=>f.code!=='WORKER_ERROR');
  return res;
}

// --- degree -------------------------------------------------------------------------------------------------
const area=b=>Math.max(0,b.width)*Math.max(0,b.height);
export function overlapRatio(a,b){
  const w=Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x),h=Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y);
  if(w<=0||h<=0)return 0;
  const small=Math.min(area(a),area(b));return small>0?(w*h)/small:0;
}
// SAFE margin of the stat chart is 12 px (stat-chart-v1.mjs SAFE).
export function outsideMeasure(box,size,safe=12){
  const x0=Math.max(box.x,0),y0=Math.max(box.y,0),x1=Math.min(box.x+box.width,size.width),y1=Math.min(box.y+box.height,size.height);
  const visible=Math.max(0,x1-x0)*Math.max(0,y1-y0),total=area(box);
  const clippedFraction=total>0?1-visible/total:1;
  const shortfall=Math.max(0,safe-box.x,safe-box.y,box.x+box.width-(size.width-safe),box.y+box.height-(size.height-safe));
  return {clippedFraction,shortfall,d:shortfall/safe};
}
// Degree the engine output already carries; null = no number, the table's fixed value is used.
export function degreeFromDetail(code,detail){
  const d=detail&&typeof detail==='object'?(detail.detail&&typeof detail.detail==='object'&&!Array.isArray(detail.detail)&&detail.status?detail.detail:detail):null;
  if(!d)return null;
  if(code==='STAT_LABEL_OUT_OF_BOUNDS'&&d.box&&d.size)return {kind:'outside',...outsideMeasure(d.box,d.size)};
  if(code==='NUMBER_LINE_LABEL_TOO_LARGE'&&Number.isFinite(d.height)&&Number.isFinite(d.rowHeight)&&d.rowHeight>0)return {kind:'oversize',d:d.height/d.rowHeight-1};
  return null;
}

export function pointsFor(entry,degree,table=loadTable()){
  // returns {points, block, reason, basis}
  const kinds=table.degreeKinds||{};
  if(degree&&entry.degreeKind){
    const k=kinds[entry.degreeKind];
    if(entry.degreeKind==='outside'&&degree.clippedFraction!=null){
      if(degree.clippedFraction>k.blockAtClippedFraction)return {points:100,block:true,reason:`label ${(degree.clippedFraction*100).toFixed(0)}% outside the viewBox`,basis:'degree'};
      return {points:k.base+k.perUnit*degree.d,block:false,basis:'degree'};
    }
    if(Number.isFinite(degree.d)){
      if(k.blockAt!=null&&degree.d>=k.blockAt)return {points:100,block:true,reason:`degree ${degree.d.toFixed(2)} >= ${k.blockAt}`,basis:'degree'};
      return {points:k.base+k.perUnit*Math.max(0,degree.d),block:false,basis:'degree'};
    }
  }
  return {points:entry.fixed??0,block:false,basis:'fixed'};
}

// findings: [{code, degree?:{kind?,d,...}, detail?}], hasSvg: whether a figure exists to publish.
// Order of verdicts: NO_SVG (nothing to publish) is reported with the verdict the findings would give (ifSvg).
export function scoreFigure({findings,hasSvg=true},table=loadTable()){
  let points=0,block=null,indet=false,wait=false;const lines=[];
  for(const f of findings||[]){
    const entry=classify(f.code,table,f.id);
    const line={code:entry.code,track:entry.track,stage:entry.stage,source:entry.source};
    if(f.id)line.id=f.id;
    if(entry.track==='BLOCK'){block??=entry.reason||entry.note||'block';line.points=100;line.reason=entry.reason||entry.note;}
    else if(entry.track==='DEDUCT'){
      const degree=f.degree||degreeFromDetail(entry.code,f.detail);
      const r=pointsFor(entry,degree,table);
      line.points=r.points;line.basis=r.basis;if(degree)line.degree=degree;
      if(r.block){block??=r.reason;line.block=r.reason;}
      points+=r.points;
    }
    else if(entry.track==='WAIT_ENGINE'){wait=true;const degree=degreeFromDetail(entry.code,f.detail);if(degree)line.degree=degree;}
    else if(entry.track==='INDETERMINATE')indet=true;
    lines.push(line);
  }
  const score=block?0:Math.max(0,100-points);
  let verdict;
  if(block)verdict='BLOCK';
  else if(indet)verdict='INDETERMINATE';
  else if(wait)verdict='WAIT_ENGINE';
  else verdict=score>=table.passScore?'PASS':'FAIL_SCORE';
  const result={tableVersion:table.version,passScore:table.passScore,verdict,score:verdict==='PASS'||verdict==='FAIL_SCORE'||verdict==='BLOCK'?score:null,findings:lines};
  if(block)result.blockReason=block;
  if(!hasSvg){result.ifSvg=verdict;result.verdict='NO_SVG';}
  return result;
}

export function scoreResult(result,{hasSvg}={}){
  const findings=findingsFromResult(result).map(f=>({...f}));
  if(!findings.length&&result&&result.status==='ARCHIVE_BOUND'){return scoreFigure({findings:[],hasSvg:hasSvg??true});}
  if(!findings.length)return {tableVersion:loadTable().version,verdict:hasSvg===false?'NO_SVG':'INDETERMINATE',score:null,findings:[],ifSvg:'INDETERMINATE',note:'no code found in the result'};
  return scoreFigure({findings,hasSvg:hasSvg??false});
}

// CLI: node score.mjs --code STAT_LABELS_TOO_CLOSE [--code ...]   or   node score.mjs --result <result.json> [--svg]
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=process.argv.slice(2),arg=k=>args[args.indexOf(k)+1];
  if(args.includes('--result')){
    const r=JSON.parse(fs.readFileSync(arg('--result'),'utf8'));
    console.log(JSON.stringify(scoreResult(r,{hasSvg:args.includes('--svg')}),null,1));
  } else {
    const codes=args.map((a,i)=>a==='--code'?args[i+1]:null).filter(Boolean);
    console.log(JSON.stringify(scoreFigure({findings:codes.map(code=>({code})),hasSvg:true}),null,1));
  }
}

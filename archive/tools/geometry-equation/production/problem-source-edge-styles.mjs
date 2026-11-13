import {fileURLToPath} from 'node:url';
import {assetIdentity} from './contracts.mjs';
import {canonicalJson,readBoundFile} from '../../pipeline-core/canonical.mjs';
import {parseQuestionUidV2} from '../../pipeline-core/question-uid.mjs';
const root=fileURLToPath(new URL('../../../../',import.meta.url));
const bad=code=>{throw Error(code);};
const keys=(o,allowed)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).every(k=>allowed.includes(k));
const actualProblemIdentity=identity=>identity?.surface==='PROBLEM_VISUAL'&&canonicalJson(identity)===canonicalJson(assetIdentity(identity.questionUid,identity.surface,identity.visualRole));
export function problemCaptionHidden(plan,identity){
  const raw=plan?.problemCaption;if(raw===undefined)return false;
  if(!actualProblemIdentity(identity))bad('PROBLEM_CAPTION_IDENTITY_REQUIRED');
  if(!keys(raw,['scope','visible'])||raw.scope!=='PROBLEM_ONLY'||raw.visible!==false)bad('PROBLEM_CAPTION_SCHEMA');
  const solidPlan=plan.capability==='solid-figure-v1'?plan:plan.capability==='composite-panels-v1'&&plan.chain==='solid-figure-v1'&&plan.panels?.length===1?plan.panels[0].plan:null;
  if(!solidPlan||solidPlan.capability!=='solid-figure-v1'||solidPlan.solids?.length!==1||['net','space','panelWidth'].some(k=>solidPlan[k]!==undefined))bad('PROBLEM_CAPTION_STANDALONE_REQUIRED');
  return true;
}
function checkCutReferenceWireframe(plan,model){
  const spec=plan.solids[0],solid=model.solids[0],base=spec.base,points=base?.points,names=typeof spec.names==='string'?[...spec.names]:[];
  if(base?.kind!=='POLYGON'||base.plane!==undefined&&base.plane!=='XY'||!Array.isArray(points)||points.length!==4||points.some(p=>!Array.isArray(p)||p.length!==2||p.some(v=>!Number.isFinite(v)))||names.length!==8||new Set(names).size!==8||!Number.isFinite(spec.height)||!Array.isArray(spec.cuts)||spec.cuts.length!==1||!keys(spec.cuts[0],['vertices'])||spec.cuts[0].vertices?.length!==3||solid.vertices.length!==7||solid.edges.length!==12||solid.faces.length!==7)bad('PROBLEM_SOURCE_STROKE_CUT_SHAPE_UNSUPPORTED');
  for(let i=0;i<4;i++){const a=points[i],b=points[(i+1)%4],c=points[(i+2)%4],u=[a[0]-b[0],a[1]-b[1]],v=[c[0]-b[0],c[1]-b[1]];if(Math.hypot(...u)<=0||Math.hypot(...v)<=0||Math.abs(u[0]*v[0]+u[1]*v[1])>1e-8)bad('PROBLEM_SOURCE_STROKE_CUT_SHAPE_UNSUPPORTED');}
  const original=points.map(p=>[...p,0]).concat(points.map(p=>[...p,spec.height])),retained=new Map(solid.vertices.map(v=>[v.name,v.p])),anchor=solid.vertices[0],index=names.indexOf(anchor.name);
  if(index<0)bad('PROBLEM_SOURCE_STROKE_CUT_SHAPE_UNSUPPORTED');
  const delta=anchor.p.map((v,k)=>v-original[index][k]),position=name=>original[names.indexOf(name)]?.map((v,k)=>v+delta[k]),same=(a,b)=>a&&b&&a.every((v,k)=>Math.abs(v-b[k])<=1e-5);
  if(solid.vertices.some(v=>!same(v.p,position(v.name))))bad('PROBLEM_SOURCE_STROKE_CUT_SHAPE_UNSUPPORTED');
  const removed=names.filter(n=>!retained.has(n));if(removed.length!==1)bad('PROBLEM_SOURCE_STROKE_CUT_SHAPE_UNSUPPORTED');
  const aux=spec.points??[];
  if(!Array.isArray(aux)||aux.length>1||(solid.aux??[]).length!==aux.length||aux.some(p=>!keys(p,['id','at'])||p.id!==removed[0]||!keys(p.at,['projection'])||!keys(p.at.projection,['from','plane'])||!retained.has(p.at.projection.from)||!Array.isArray(p.at.projection.plane)||p.at.projection.plane.length!==3||p.at.projection.plane.some(n=>!retained.has(n)))||(solid.aux??[]).some(p=>p.name!==removed[0]||!same(p.p,position(p.name))))bad('PROBLEM_SOURCE_STROKE_REFERENCE_POINT_UNSUPPORTED');
  const originalEdges=new Set([...Array(4)].flatMap((_,i)=>[[names[i],names[(i+1)%4]],[names[i+4],names[(i+1)%4+4]],[names[i],names[i+4]]]).map(e=>e.sort().join('|'))),seen=new Set();
  const segments=plan.segments??[];
  if(!Array.isArray(segments)||segments.length>3)bad('PROBLEM_SOURCE_STROKE_REFERENCE_SEGMENT_UNSUPPORTED');
  for(const seg of segments){const key=[seg.from,seg.to].sort().join('|');if(!keys(seg,['from','to','style','role'])||seg.style!=='DASHED'||seg.role!=='REF'||!aux.length||![seg.from,seg.to].includes(removed[0])||!originalEdges.has(key)||seen.has(key))bad('PROBLEM_SOURCE_STROKE_REFERENCE_SEGMENT_UNSUPPORTED');seen.add(key);}
}
export function problemSourceEdgeStyles(plan,model,identity){
  const raw=plan.problemSourceEdgeStyles;if(raw===undefined)return new Map();
  if(!actualProblemIdentity(identity))bad('PROBLEM_SOURCE_STROKE_IDENTITY_REQUIRED');
  if(!keys(raw,['scope','sourceImageRef','edges','mode'])||raw.scope!=='PROBLEM_ONLY'||raw.mode!==undefined&&raw.mode!=='RETAINED_CUT_EDGES')bad('PROBLEM_SOURCE_STROKE_SCHEMA');
  const cut=raw.mode==='RETAINED_CUT_EDGES';
  if(plan.net!==undefined||plan.space!==undefined||plan.panelWidth!==undefined||plan.solids?.length!==1||plan.solids[0].kind!=='PRISM'||!cut&&(plan.segments!==undefined||plan.solids[0].cuts!==undefined||plan.solids[0].points!==undefined))bad('PROBLEM_SOURCE_STROKE_SHAPE_UNSUPPORTED');
  if(cut)checkCutReferenceWireframe(plan,model);
  const parsed=parseQuestionUidV2(identity.questionUid),expected='archive/assets/images/'+parsed.sourceExamId+'/q'+parsed.sourceQuestionOrdinal+'.png';
  const ref=raw.sourceImageRef;
  if(!keys(ref,['path','bytes','sha256'])||ref.path!==expected)bad('PROBLEM_SOURCE_STROKE_SOURCE_SCOPE');
  let bytes;try{bytes=readBoundFile(root,ref);}catch{bad('PROBLEM_SOURCE_STROKE_SOURCE_MISMATCH');}
  if(bytes.toString('hex',0,8)!=='89504e470d0a1a0a')bad('PROBLEM_SOURCE_STROKE_SOURCE_MISMATCH');
  if(!Array.isArray(raw.edges)||raw.edges.length<1||raw.edges.length>(cut?3:2))bad('PROBLEM_SOURCE_STROKE_COUNT');
  const solid=model.solids[0],styles=new Map();
  for(const entry of raw.edges){
    if(!keys(entry,['solid','from','to','stroke'])||entry.solid!==solid.id||!(cut?['SOLID']:['SOLID','DASHED']).includes(entry.stroke)||typeof entry.from!=='string'||typeof entry.to!=='string')bad('PROBLEM_SOURCE_STROKE_ENTRY');
    const a=solid.vertices.findIndex(v=>v.name===entry.from),b=solid.vertices.findIndex(v=>v.name===entry.to),key=[entry.from,entry.to].sort().join('|');
    if(a<0||b<0||a===b||!solid.edges.some(([i,j])=>i===a&&j===b||i===b&&j===a))bad('PROBLEM_SOURCE_STROKE_NOT_AN_EDGE');
    if(styles.has(key))bad('PROBLEM_SOURCE_STROKE_DUPLICATE');
    const run=solid.runs.find(r=>r.a===a&&r.b===b||r.a===b&&r.b===a);if(run?.runs.length!==1)bad('PROBLEM_SOURCE_STROKE_MIXED_VISIBILITY');
    styles.set(key,entry.stroke);
  }
  return styles;
}

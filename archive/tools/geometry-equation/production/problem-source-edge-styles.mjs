import {fileURLToPath} from 'node:url';
import {assetIdentity} from './contracts.mjs';
import {canonicalJson,readBoundFile} from '../../pipeline-core/canonical.mjs';
import {parseQuestionUidV2} from '../../pipeline-core/question-uid.mjs';
const root=fileURLToPath(new URL('../../../../',import.meta.url));
const bad=code=>{throw Error(code);};
const keys=(o,allowed)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).every(k=>allowed.includes(k));
export function problemSourceEdgeStyles(plan,model,identity){
  const raw=plan.problemSourceEdgeStyles;if(raw===undefined)return new Map();
  if(identity?.surface!=='PROBLEM_VISUAL'||canonicalJson(identity)!==canonicalJson(assetIdentity(identity.questionUid,identity.surface,identity.visualRole)))bad('PROBLEM_SOURCE_STROKE_IDENTITY_REQUIRED');
  if(!keys(raw,['scope','sourceImageRef','edges'])||raw.scope!=='PROBLEM_ONLY')bad('PROBLEM_SOURCE_STROKE_SCHEMA');
  if(plan.net!==undefined||plan.space!==undefined||plan.panelWidth!==undefined||plan.segments!==undefined||plan.solids?.length!==1||plan.solids[0].kind!=='PRISM'||plan.solids[0].cuts!==undefined||plan.solids[0].points!==undefined)bad('PROBLEM_SOURCE_STROKE_SHAPE_UNSUPPORTED');
  const parsed=parseQuestionUidV2(identity.questionUid),expected='archive/assets/images/'+parsed.sourceExamId+'/q'+parsed.sourceQuestionOrdinal+'.png';
  const ref=raw.sourceImageRef;
  if(!keys(ref,['path','bytes','sha256'])||ref.path!==expected)bad('PROBLEM_SOURCE_STROKE_SOURCE_SCOPE');
  let bytes;try{bytes=readBoundFile(root,ref);}catch{bad('PROBLEM_SOURCE_STROKE_SOURCE_MISMATCH');}
  if(bytes.toString('hex',0,8)!=='89504e470d0a1a0a')bad('PROBLEM_SOURCE_STROKE_SOURCE_MISMATCH');
  if(!Array.isArray(raw.edges)||raw.edges.length<1||raw.edges.length>2)bad('PROBLEM_SOURCE_STROKE_COUNT');
  const solid=model.solids[0],styles=new Map();
  for(const entry of raw.edges){
    if(!keys(entry,['solid','from','to','stroke'])||entry.solid!==solid.id||!['SOLID','DASHED'].includes(entry.stroke)||typeof entry.from!=='string'||typeof entry.to!=='string')bad('PROBLEM_SOURCE_STROKE_ENTRY');
    const a=solid.vertices.findIndex(v=>v.name===entry.from),b=solid.vertices.findIndex(v=>v.name===entry.to),key=[entry.from,entry.to].sort().join('|');
    if(a<0||b<0||a===b||!solid.edges.some(([i,j])=>i===a&&j===b||i===b&&j===a))bad('PROBLEM_SOURCE_STROKE_NOT_AN_EDGE');
    if(styles.has(key))bad('PROBLEM_SOURCE_STROKE_DUPLICATE');
    const run=solid.runs.find(r=>r.a===a&&r.b===b||r.a===b&&r.b===a);if(run?.runs.length!==1)bad('PROBLEM_SOURCE_STROKE_MIXED_VISIBILITY');
    styles.set(key,entry.stroke);
  }
  return styles;
}

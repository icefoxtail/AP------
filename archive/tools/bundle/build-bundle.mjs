#!/usr/bin/env node
// Read-only inventory. No approval, registration or completion decision is inferred here.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import examItems from '../../../tools/4slot/exam-items.cjs';
export const {sourceNumber,sourceIdentityNumber}=examItems;
import { loadBank } from '../meta-foundation/source-delta-report.mjs';
import { fingerprints } from '../meta-foundation/source-delta.mjs';
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
export const SCHEMA = 'archive-exam-bundle-v0';
export const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
export const blobHash = bytes => crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
export const META_FIELDS = ['standardCourse','courseKey','curriculumKey','curriculum','standardUnitKey','standardUnit','subUnitKey','subUnit','conceptClusterKey','problemTypeKey','templateKey','L1','L2','L3','L4','rpmL1','rpmL2','rpmL3','rpmL4','nativeL1','nativeL2','nativeL3','nativeL4','crossConceptKeys','conditionKeys','integrationPattern','level','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility','metadataStatus','reviewStatus','typeHold','rpmPrimaryPath','rpmPrimaryRecordId'];
export const SLOT_FIELDS = ['format','given','goal','method','condition','steps'];
export function pick(row, fields) {
  const scalar=v=>v===null||['string','number','boolean'].includes(typeof v);
  const out={};
  for(const k of fields) {
    if(row?.[k]===undefined) continue; const v=row[k];
    if(k==='rpmPrimaryPath') {
      if(!v||typeof v!=='object'||Array.isArray(v)) throw Error('INVALID_META_STRUCTURE');
      out[k]=pick(v,['curriculum','scope','majorUnit','midUnit','l3','l4','L1','L2','L3','L4','crosswalkRecordIds']);
    } else if(['given','goal','method','condition'].includes(k)) {
      if(!Array.isArray(v)||!v.every(n=>Number.isSafeInteger(n)&&n>0)) throw Error('INVALID_SLOT_STRUCTURE'); out[k]=v;
    } else if(k==='steps') {
      if(!Array.isArray(v)||!v.every(n=>Number.isSafeInteger(n)||Array.isArray(n)&&n.every(x=>Number.isSafeInteger(x)))) throw Error('UNSUPPORTED_STEPS_STRUCTURE'); out[k]=v;
    } else { if(!scalar(v)&&!(Array.isArray(v)&&v.every(scalar))) throw Error('INVALID_META_STRUCTURE'); out[k]=v; }
  } return out;
}
export function inside(root, target) { const r = path.relative(root,target); return r === '' || (!r.startsWith(`..${path.sep}`) && r !== '..' && !path.isAbsolute(r)); }
// Resolve existing ancestors, including symlinks, even for a not-yet-created output.
export function realTarget(target) { if(fs.existsSync(target)) return fs.realpathSync(target); const parent=path.dirname(target); if(parent===target) throw Error('PATH_UNAVAILABLE'); return path.join(realTarget(parent),path.basename(target)); }
export function safeFile(root, rel) {
  if(typeof rel !== 'string' || !rel || path.isAbsolute(rel) || rel.includes('\\') || rel.split('/').some(p=>p==='..'||p==='.'||!p)) throw Error('UNSAFE_PATH');
  const file=path.resolve(root,rel); if(!inside(fs.realpathSync(root),realTarget(file))) throw Error('PATH_OUTSIDE_REPOSITORY'); return file;
}
export function outputFile(root, out) {
  if(!out) throw Error('--out is required'); const file=path.resolve(out);
  if(inside(fs.realpathSync(root),realTarget(file))) throw Error('OUTPUT_INSIDE_REPOSITORY'); return file;
}
export function git(root,args) { const r=spawnSync('git',args,{cwd:root,maxBuffer:32*1024*1024}); if(r.status!==0||r.error) throw Error('GIT_OBJECT_UNAVAILABLE'); return r.stdout; }
export function examPath(exam) { const rel=exam.replace(/^archive\/exams\//,''); if(!rel.endsWith('.js')) throw Error('EXAM_JS_REQUIRED'); return rel; }
function readJson(root,rel) { const file=safeFile(root,rel); if(!fs.existsSync(file)) return {data:null,path:rel,sha256:null,status:'MISSING'}; const bytes=fs.readFileSync(file); return {data:JSON.parse(bytes),path:rel,sha256:sha256(bytes),status:'PRESENT'}; }
function fileSummary({data,...summary}) { return summary; }
function matching(rows, rel) { return (rows||[]).filter(r=>r.sourceArchiveFile===rel); }
function ordinalMap(rows,label,count) {
  const map=new Map(),uids=new Set();
  for(const row of rows) { const n=row.sourceOrdinal??row.ordinal;
    if(!Number.isInteger(n)||n<1||n>count||map.has(n)) throw Error(`${label}_ORDINAL_CONFLICT`);
    if(row.questionUid && uids.has(row.questionUid)) throw Error(`${label}_UID_CONFLICT`);
    if(row.questionUid) uids.add(row.questionUid); map.set(n,row);
  } return map;
}
export function assetsFor(root,q) {
  const refs=new Set(),inline=[];
  function walk(value,key='') {
    if(Array.isArray(value)) return value.forEach(v=>walk(v,key));
    if(value && typeof value==='object') return Object.entries(value).forEach(([k,v])=>walk(v,k));
    if(typeof value!=='string') return;
    if(/<svg\b/i.test(value)||/^data:image\//i.test(value)) inline.push({field:key,sha256:sha256(value)});
    if(/^(?:images|solutionImages|image|imagePath|imageUrl|solutionImage|solutionImagePath|solutionImageUrl|figure|figureSvg|solutionFigureSvg|src)$/i.test(key) && !/[<>]/.test(value) && !/^data:/i.test(value) && value.trim()) refs.add(value.trim());
    for(const m of value.matchAll(/(?:src|(?:xlink:)?href)\s*=\s*["']([^"']+)["']|url\(\s*["']?([^\s)'"}]+)["']?\s*\)/gi)) refs.add(m[1]||m[2]);
  }
  walk(q);
  const files=[];
  for(const ref of [...refs].sort()) {
    if(ref.startsWith('#')) continue;
    if(/^data:/i.test(ref)) { inline.push({field:'embeddedAsset',sha256:sha256(ref)}); continue; }
    if(/^(?:https?:)?\/\//i.test(ref)) {files.push({reference:ref,status:'REMOTE_NOT_FETCHED',sha256:null});continue;}
    let clean; try { clean=decodeURIComponent(ref.split(/[?#]/)[0]); } catch { files.push({reference:ref,status:'INVALID_PATH',sha256:null});continue; }
    const rel=clean.replace(/^\.\//,'').replace(/^\/?archive\//,'');
    try { const p=safeFile(root,`archive/${rel}`); const exists=fs.existsSync(p)&&fs.statSync(p).isFile(); files.push({reference:ref,path:`archive/${rel}`,status:exists?'PRESENT':'MISSING',sha256:exists?sha256(fs.readFileSync(p)):null}); }
    catch { files.push({reference:ref,status:'INVALID_PATH',sha256:null}); }
  }
  return {files,inline};
}
export async function buildBundle({root=ROOT,exam}) {
  root=fs.realpathSync(root); const rel=examPath(exam), sourcePath=`archive/exams/${rel}`;
  const bytes=fs.readFileSync(safeFile(root,sourcePath)), bank=loadBank(bytes.toString(),sourcePath);
  const sourceGitBlobSha=blobHash(bytes); let gitBlobAvailable=false;
  try { gitBlobAvailable=git(root,['cat-file','-t',sourceGitBlobSha]).toString().trim()==='blob'; } catch {}
  let sourceCommit=null; try { const head=git(root,['rev-parse','HEAD']).toString().trim(); if(git(root,['rev-parse',`${head}:${sourcePath}`]).toString().trim()===sourceGitBlobSha) sourceCommit=head; } catch {}
  const meta=readJson(root,'archive/data/question_metadata.json'), identity=readJson(root,'archive/data/question_identity_map.json'), index=readJson(root,'archive/data/item-4slot-index.json');
  const compactPath=`archive/data/item-4slot/${rel.replace(/\.js$/,'.4slot.json')}`, compact=readJson(root,compactPath);
  if(compact.data && compact.data.sourceArchiveFile!==rel) throw Error('FOURSLOT_SOURCE_MISMATCH');
  const displayNumbers=bank.map(sourceNumber); if(new Set(displayNumbers).size!==bank.length) throw Error('AMBIGUOUS_SOURCE_NUMBER');
  const compactMap=new Map(); for(const item of compact.data?.items||[]) { if(!displayNumbers.includes(item.ordinal)||compactMap.has(item.ordinal)) throw Error('FOURSLOT_ORDINAL_CONFLICT'); compactMap.set(item.ordinal,item); }
  const maps=[ordinalMap(matching(identity.data?.records,rel),'IDENTITY',bank.length),ordinalMap(matching(meta.data?.records,rel),'CANONICAL',bank.length),ordinalMap(matching(index.data?.records,rel),'INDEX',bank.length)];
  // This base has no completion module. Never synthesize its verdict from declarations.
  const completionPath=safeFile(root,'archive/tools/completion/check-exam.mjs');
  if(fs.existsSync(completionPath)) throw Error('COMPLETION_ADAPTER_REQUIRED: use the official completion API before generating');
  const questions=bank.map((q,i)=>{
    const n=i+1,[id,m,idx]=maps.map(map=>map.get(n)), slot=compactMap.get(displayNumbers[i]);
    const uids=[id?.questionUid,m?.questionUid,idx?.questionUid,q.questionUid].filter(Boolean);
    if(new Set(uids).size>1) throw Error('SOURCE_UID_CONFLICT');
    const no=sourceIdentityNumber(q);
    for(const r of [id,m,idx]) if(r?.sourceQuestionNo!=null && no!=null && String(r.sourceQuestionNo)!==String(no)) throw Error('NUMBER_MISMATCH');
    const fp=fingerprints(q), assets=assetsFor(root,q);
    const inline=pick(q,[...META_FIELDS,...SLOT_FIELDS]), canonical=pick(m,META_FIELDS), fourSlot=pick(slot,SLOT_FIELDS);
    const sourceValuesDisagree=Object.keys({...inline,...canonical,...fourSlot}).filter(k=>new Set([inline,canonical,fourSlot].filter(v=>Object.hasOwn(v,k)).map(v=>JSON.stringify(v[k]))).size>1);
    const fieldStatus=Object.fromEntries(Object.entries(m?.fieldStatus||{}).filter(([,v])=>typeof v==='string'));
    const typeHold=q.typeHold===true || m?.typeHold===true || m?.metaFoundationHoldReason==='TYPE_PATH_UNBOUND_UNIT_SUB_ONLY';
    return {questionUid:uids[0]||null,sourceOrdinal:n,sourceQuestionNo:no,sourceDisplayNumber:displayNumbers[i],...fp,assets,
      metadata:{inline,canonical,fourSlot,sourceValuesDisagree,metaBinding:!m?null:m.sourceFingerprint===fp.sourceFingerprint?'exact':m.contentFingerprint===fp.contentFingerprint?'content':null},
      registration:{fieldStatus,fourSlot:pick(idx,['registrationStatus','sourceBinding','identityFingerprintStatus','sourceUidBinding']),pending:(index.data?.pending||[]).filter(p=>p.path===compactPath&&p.ordinal===displayNumbers[i]).map(p=>({reason:p.reason})),compactSourceBinding:compact.data?compact.data.sourceGitBlobSha===sourceGitBlobSha?'EXACT_BLOB':'STALE_STUDENT_PAYLOAD':null},
      partial:{typeHold,missingFigure:assets.files.some(a=>a.status!=='PRESENT'),missing4slot:!slot||['given','goal','method','condition'].some(k=>!Array.isArray(slot[k]))},overall:null};
  });
  return {schemaVersion:SCHEMA,sourceArchiveFile:rel,sourcePath,sourceCommit,sourceGitBlobSha,sourceSha256:sha256(bytes),gitBlobAvailable,questionCount:bank.length,inputs:[meta,identity,index,compact].map(fileSummary),completion:{status:'NOT_AVAILABLE',note:'작업 1 병합 뒤 연결'},questions,summary:{sourceValuesDisagreeCount:questions.filter(q=>q.metadata.sourceValuesDisagree.length).length,partialCount:questions.filter(q=>Object.values(q.partial).some(Boolean)).length}};
}
export function args(argv, keys) { const out={}; for(let i=0;i<argv.length;i+=2) { if(!keys.includes(argv[i])||!argv[i+1]||argv[i+1].startsWith('--')||Object.hasOwn(out,argv[i].slice(2))) throw Error('INVALID_ARGUMENTS'); out[argv[i].slice(2)]=argv[i+1]; } return out; }
export function writeOutput(root,out,value) { const file=outputFile(root,out); fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n',{flag:'wx'}); }
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try { const opts=args(process.argv.slice(2),['--exam','--out']); if(!opts.exam) throw Error('--exam is required'); outputFile(ROOT,opts.out); writeOutput(ROOT,opts.out,await buildBundle(opts)); } catch(e) { console.error(e.message); process.exitCode=1; }
}

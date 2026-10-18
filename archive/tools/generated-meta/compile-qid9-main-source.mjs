#!/usr/bin/env node
// Generic main-source QID9 materializer. Data-configured; no school-specific registration.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import normalizeQid9Svg from './normalize-qid9-svg.cjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const specPath='archive/data/generated-source-import-roots-v1.json';
const spec=JSON.parse(fs.readFileSync(path.join(root,specPath),'utf8'));
const write=process.argv.includes('--write');
const sha256=s=>crypto.createHash('sha256').update(s).digest('hex');
const slash=s=>String(s).replaceAll('\\','/');
const outSource='archive/generated/lite/v1/2022/H1';
const assetsRoot='archive/assets/generated-lite/qid9';
const checkPath=rel=>{
 const p=slash(rel);
 if(!p||p.startsWith('/')||p.split('/').includes('..')||!p.startsWith('alive/06_EXECUTION/'))throw Error('QID9_UNSAFE_SOURCE_PATH:'+p);
 return p;
};
const store=(rel,bytes)=>{
 const p=path.join(root,rel),data=Buffer.isBuffer(bytes)?bytes:Buffer.from(bytes,'utf8');
 if(write){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,data);}
 else if(!fs.existsSync(p)||!fs.readFileSync(p).equals(data))throw Error('QID9_STALE_DERIVED_OUTPUT:'+rel);
};
const emitted=new Set(),seen=new Set(),report=[];
for(const entry of spec.roots){
 const dir=checkPath(entry.directory),abs=path.join(root,dir);
 if(!fs.existsSync(abs))throw Error('QID9_INPUT_DIRECTORY_MISSING:'+dir);
 const drafts=fs.readdirSync(abs).filter(n=>/^GPT_QID9_Q\d{2}_CREATE_DRAFT\.json$/.test(n)).sort();
 if(drafts.length!==entry.expectedSourceQidCount)throw Error('QID9_SOURCE_QID_COUNT:'+drafts.length+':'+entry.expectedSourceQidCount);
 let count=0;const qids=new Set();
 for(const name of drafts){
  const doc=JSON.parse(fs.readFileSync(path.join(abs,name),'utf8'));
  const gitBlob=doc.source?.gitBlob;
  const gitBlobSha1=doc.source?.gitBlobSha1;
  if(gitBlob!==undefined&&gitBlobSha1!==undefined&&gitBlob!==gitBlobSha1)throw Error('QID9_SOURCE_HASH_CONFLICT:'+name);
  const originalSha=gitBlobSha1??gitBlob;
  if(originalSha!==undefined&&!/^[0-9a-f]{40}$/.test(originalSha))throw Error('QID9_SOURCE_HASH_INVALID:'+name);
  if(!doc.source?.path||!originalSha||!Array.isArray(doc.questions)||doc.questions.length!==9)throw Error('QID9_SOURCE_SHAPE_INVALID:'+name);
  if(!/^archive\/exams\/original\/.+\.js$/.test(doc.source.path))throw Error('QID9_SOURCE_EXAM_PATH_INVALID:'+name);
  const qid=Number(doc.source.qid),match=name.match(/Q(\d{2})_/);
  if(!Number.isInteger(qid)||qid!==Number(match?.[1])||qids.has(qid))throw Error('QID9_SOURCE_QID_DUPLICATE:'+name);
  qids.add(qid);
  const student=[];
  for(const [i,item] of doc.questions.entries()){
   if(!item||!/^(?:ALITE|ALIVE)-[A-Z0-9-]+-Q\d{2}-[ABC][123]$/.test(item.uid||'')||item.sourceQid!==qid||!item.content||!item.solution||(!Array.isArray(item.choices)||(item.questionType==='서술형'?item.choices.length!==0:item.choices.length!==5))||!item.answer)throw Error('QID9_ITEM_INVALID:'+name+':'+i);
   if(seen.has(item.uid))throw Error('QID9_DUPLICATE_UID:'+item.uid);seen.add(item.uid);
   if(item.provenance?.sourceOriginalGitBlobSha&&item.provenance.sourceOriginalGitBlobSha!==originalSha)throw Error('QID9_PROVENANCE_DRIFT:'+item.uid);
   const copy=structuredClone(item);
   copy.sourceExamPath=doc.source.path;
   copy.sourceExamBlobSha=originalSha;
   copy.sourceArchiveFile=doc.source.path;
   for(const field of ['image','solutionImage']){
    if(!copy[field])continue;
    const raw=slash(copy[field]),candidate=raw.startsWith('assets/')?dir+'/'+raw:raw;
    const sourceRel=checkPath(candidate),sourceFile=path.join(root,sourceRel);
    if(!fs.existsSync(sourceFile))throw Error('QID9_ASSET_MISSING:'+item.uid+':'+sourceRel);
    const ext=path.extname(sourceRel).toLowerCase();
    if(!['.svg','.png','.jpg','.jpeg','.webp'].includes(ext))throw Error('QID9_ASSET_TYPE:'+sourceRel);
    const bytes=fs.readFileSync(sourceFile);
    if(ext==='.svg'&&(!bytes.includes(Buffer.from('<svg'))||!bytes.includes(Buffer.from('</svg>'))))throw Error('QID9_SVG_INVALID:'+sourceRel);
    const dest=assetsRoot+'/'+item.uid+'-'+(field==='image'?'problem':'solution')+ext;
    const derivedBytes=ext==='.svg'?Buffer.from(normalizeQid9Svg(bytes.toString('utf8'),item.uid,field==='solutionImage'?{title:item.solutionImageAlt,description:item.solutionImageCaption}:{title:item.imageAlt,description:item.imageCaption}),'utf8'):bytes;
    store(dest,derivedBytes);copy[field]=dest.slice('archive/'.length);
   }
   student.push(copy);
  }
  const unit=student[0].subUnitKey;
  if(!unit||student.some(v=>v.subUnitKey!==unit)||!/^H22-[A-Z0-9_-]+$/.test(unit))throw Error('QID9_UNIT_MISMATCH:'+name);
  const digest=sha256(doc.source.path).slice(0,12),stem='qid9-'+digest+'-q'+String(qid).padStart(2,'0');
  const dirOut=outSource+'/'+unit;
  const shard=dirOut+'/shards/'+stem+'.js';
  const meta=dirOut+'/metadata/'+stem+'.json';
  const js='window.examTitle = '+JSON.stringify('QID9_'+(doc.source.examTitle||stem))+';\nwindow.questionBank = '+JSON.stringify(student,null,2)+';\n';
  const sidecar=student.map(v=>({
   uid:v.uid,sourceQid:v.sourceQid,sourceArchiveFile:doc.source.path,sourceBlobSha:originalSha,
   sourceSchoolMarker:(doc.source.examTitle||'').split('_')[1]||'',year:2000+Number((doc.source.examTitle||'').slice(0,2)),
   grade:'고1',standardCourse:v.standardCourse,subUnitKey:v.subUnitKey,meta:v.meta,
   provenance:v.provenance,reviewApprovalStatus:v.review?.approval||'NOT_REVIEWED',metaProjectionOrigin:'MAIN_SOURCE_QUESTION_JS'
  }));
  store(shard,js);store(meta,JSON.stringify(sidecar,null,2)+'\n');
  emitted.add(shard);emitted.add(meta);count+=student.length;
  report.push({qid,uidCount:student.length,shard});
 }
 if(count!==entry.expectedUidCount||qids.size!==entry.expectedSourceQidCount)throw Error('QID9_EXPECTED_UID_COUNT:'+count+':'+entry.expectedUidCount);
}
if(seen.size!==spec.expectedTotalUids)throw Error('QID9_TOTAL_UID_COUNT:'+seen.size);
process.stdout.write(JSON.stringify({status:'PASS',mode:write?'write':'check',total:seen.size,unique:seen.size,shards:report.length,sourceRoots:spec.roots.length,assetRoot:assetsRoot},null,2)+'\n');

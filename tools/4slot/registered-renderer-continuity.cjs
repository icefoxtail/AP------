'use strict';
// Keep the reviewed compact unchanged. Only an explicitly selected UID may reuse
// an already issued semantic renderer receipt for its existing four-slot vector.
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const DIR='.archive-meta-register/4slot-renderer-continuity';
const worker=path.join(__dirname,'registered-renderer-continuity.mjs');
const sourceReviewSchema=value=>['archive-four-slot-registered-m2-problem21-continuity-v1',
  'archive-four-slot-registered-m2-problem21-current-ui-continuity-v1'].includes(value);
// Cache inputs for the separately closed source-review lane. These paths are
// dependencies only; the worker replays the complete issued Native proof.
function sourceReviewInputs(root,doc,receipt,safe){
  const refs=['archive/data/svg-accessibility-index.js','archive/data/master_tables/js_archive_tag_master.json'];
  const append=value=>{
    if(!value||typeof value!=='object')return;
    if(typeof value.path==='string')refs.push(value.path);
    if(Array.isArray(value))value.forEach(append);else Object.values(value).forEach(append);
  };
  append(receipt);
  const documents=[
    doc.sourceReviewBindingRef?.path,
    'docs/operations/m2-problem21-continuity-20261116/static-v1.json',
    'docs/operations/m2-problem21-continuity-20261116/student-ui-technical-v1.json'
  ];
  for(const relative of documents){
    if(typeof relative!=='string')continue;
    refs.push(relative);
    try{append(JSON.parse(fs.readFileSync(safe(root,relative),'utf8')));}catch{}
  }
  if(doc.schemaVersion==='archive-four-slot-registered-m2-problem21-current-ui-continuity-v1'){
    const bindingPath=doc.currentUiBindingRef?.path;
    if(typeof bindingPath==='string'){
      refs.push(bindingPath);
      try{
        const binding=JSON.parse(fs.readFileSync(safe(root,bindingPath),'utf8'));
        append(binding);
        // The current raw proof carries all live renderer, font and mirror
        // dependencies; recursive refs in the binding include every real PNG.
        const technicalPath=binding.currentTechnicalRef?.path;
        if(typeof technicalPath==='string'){
          refs.push(technicalPath);
          append(JSON.parse(fs.readFileSync(safe(root,technicalPath),'utf8')));
        }
      }catch{}
    }
  }
  return refs;
}
function sourceReviewDigest(root,relative,safe,sha){
  const base=fs.realpathSync(root),file=path.resolve(safe(root,relative));
  if(!file.startsWith(base+path.sep))throw Error('M2_CACHE_PATH_OUTSIDE_ROOT');
  for(let cursor=file;cursor!==base;cursor=path.dirname(cursor)){
    if(cursor===path.dirname(cursor)||fs.lstatSync(cursor).isSymbolicLink())throw Error('M2_CACHE_SYMLINK_PATH');
  }
  if(!fs.lstatSync(file).isFile())throw Error('M2_CACHE_REGULAR_FILE_REQUIRED');
  return sha(fs.readFileSync(file));
}
function collect(root,{safe,walk,sha}){
  const dir=safe(root,DIR),bySource=new Map();
  if(!fs.existsSync(dir))return bySource;
  const inputs=walk(dir);
  if(!inputs.length)return bySource;
  const dependencies=['archive/data/question_metadata.json','archive/data/question_identity_map.json'];
  for(const prefix of ['archive/data/meta-foundation/canonical','archive/data/meta-foundation/compiled','archive/data/meta-foundation/runtime','archive/tools/meta-foundation'])
    for(const file of walk(safe(root,prefix)))dependencies.push(path.relative(root,file).split(path.sep).join('/'));
  for(const file of inputs){
    const relative=path.relative(root,file).split(path.sep).join('/');
    if(!relative.endsWith('.json'))throw Error('RENDERER_CONTINUITY_FILE_TYPE');
    const doc=JSON.parse(fs.readFileSync(file,'utf8'));
    if(typeof doc.sourceArchiveFile!=='string'||typeof doc.questionUid!=='string')throw Error('RENDERER_CONTINUITY_IDENTITY_REQUIRED');
    const refs=['compactRef','dictionaryRef','currentSourceRef','receiptRef','rendererBindingRef','independentReviewRef'].map(k=>doc[k]?.path).filter(Boolean);
    let receipt;
    try{receipt=JSON.parse(fs.readFileSync(safe(root,doc.receiptRef?.path),'utf8'));}catch{}
    refs.push(...(receipt?.approval?.evidenceRefs||[]).map(r=>r.path));
    if(sourceReviewSchema(doc.schemaVersion))
      refs.push(...sourceReviewInputs(root,doc,receipt,safe));
    const digests=[...new Set([relative,...refs,...dependencies])].sort().map(p=>{
      try{return [p,sourceReviewSchema(doc.schemaVersion)?sourceReviewDigest(root,p,safe,sha):sha(fs.readFileSync(safe(root,p)))];}catch{return [p,null];}
    });
    const entry={path:relative,sha256:sha(fs.readFileSync(file)),questionUid:doc.questionUid,sourceOrdinal:doc.sourceOrdinal,digests};
    if(!bySource.has(doc.sourceArchiveFile))bySource.set(doc.sourceArchiveFile,[]);
    bySource.get(doc.sourceArchiveFile).push(entry);
  }
  return bySource;
}
function verify(root,entry){
  try{
    const result=JSON.parse(execFileSync(process.execPath,[worker,root,entry.path],{encoding:'utf8',timeout:30000,maxBuffer:4*1024*1024,stdio:['ignore','pipe','pipe']}));
    if(result.status!=='PASS'||result.questionUid!==entry.questionUid||result.sourceOrdinal!==entry.sourceOrdinal)throw Error('WORKER_RESULT_MISMATCH');
    return result;
  }catch(e){throw Error('REGISTERED_RENDERER_CONTINUITY_INVALID:'+String(e.stderr||e.message).trim().slice(0,300));}
}
module.exports={collect,verify,DIR,worker};

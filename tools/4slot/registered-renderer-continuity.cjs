'use strict';
// Keep the reviewed compact unchanged. Only an explicitly selected UID may reuse
// an already issued semantic renderer receipt for its existing four-slot vector.
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const DIR='.archive-meta-register/4slot-renderer-continuity';
const worker=path.join(__dirname,'registered-renderer-continuity.mjs');
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
    const digests=[...new Set([relative,...refs,...dependencies])].sort().map(p=>{
      try{return [p,sha(fs.readFileSync(safe(root,p)))];}catch{return [p,null];}
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

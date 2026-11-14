// Read-only verification for this preserved review branch. This does not register or import metadata.
const fs=require('fs'),path=require('path'),os=require('os'),vm=require('vm'),crypto=require('crypto'),cp=require('child_process');
const {pathToFileURL}=require('url');
const root=cp.execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
process.chdir(root);
const base=path.relative(root,__dirname).replaceAll('\\','/'),read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const hash=x=>sha(JSON.stringify(x));
const git=(...args)=>cp.execFileSync('git',args,{maxBuffer:512*1024*1024});
const progress=read(base+'/progress.json');
const meta=read('archive/data/question_metadata.json').records;
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'m1-s1-check-'));
const output={schemaVersion:'m1-s1-final-verification-v1',verifiedAt:new Date().toISOString(),workKey:progress.workKey,baselineMain:progress.baselineMain,examCount:0,questionCount:0,independentSampleCount:0,changedSourceItems:[],changedFieldCounts:{},protectedFieldChanges:0,legacyLevelChanges:0,sourceOnlyMethodDebt:0,unexpectedFourSlotFailures:0,fourSlotQuotes:0,registeredCurrentQfullMatches:0,failures:[],exams:[],assets:[]};
const assetCache=new Map();
function load(bytes){const c={window:{},console:{log(){},warn(){},error(){}}};c.globalThis=c;vm.createContext(c,{codeGeneration:{strings:false,wasm:false}});vm.runInContext(bytes.toString(),c,{timeout:3000});return c.window.questionBank||c.window.examData?.questions;}
function strings(x){if(typeof x==='string')return[x];if(Array.isArray(x))return x.flatMap(strings);if(x&&typeof x==='object')return Object.values(x).flatMap(strings);return[];}
function assetPath(x){return String(x||'').startsWith('archive/')?String(x):'archive/'+String(x);}
(async()=>{
 try {
  for(const exam of progress.exams){
   const originalBytes=git('show',progress.baselineMain+':'+exam.sourcePath),bank=load(originalBytes);
   const originalBlob=git('rev-parse',progress.baselineMain+':'+exam.sourcePath).toString().trim();
   const input={sourcePath:exam.sourcePath,sourceArchiveFile:exam.sourceArchiveFile,sourceBlob:originalBlob,sourceSha256:sha(originalBytes),sourceOnly:exam.sourceOnly,questionCount:bank.length,items:bank.map((source,i)=>({ordinal:i+1,source,questionUid:exam.questionUids[i],registered:meta.find(r=>r.questionUid===exam.questionUids[i])}))};
   const ip=path.join(tmp,'input.json'),op=path.join(tmp,'check.json');fs.writeFileSync(ip,JSON.stringify(input));
   const a=exam.reviewArtifacts;
   if(!a)throw Error('EXAM_REVIEW_MISSING:'+exam.sourceArchiveFile);
   const result=cp.spawnSync(process.execPath,[path.join(__dirname,'verify-packet.cjs'),ip,a.review,a.fourSlot,op],{encoding:'utf8',maxBuffer:16*1024*1024});
   if(result.status!==0)output.failures.push({sourceArchiveFile:exam.sourceArchiveFile,type:'PACKET_VALIDATION',detail:result.stdout||result.stderr});
   const ck=read(op),r=read(a.review),f=read(a.fourSlot),ind=read(a.independent),oldChecks=read(a.checks);
   if(ind.samples?.length!==3||new Set(ind.samples.map(s=>s.ordinal)).size!==3||ind.author===ind.reviewer)output.failures.push({sourceArchiveFile:exam.sourceArchiveFile,type:'INDEPENDENT_SAMPLE_CONTRACT'});
   for(const [field,p]of [['review',a.review],['fourSlot',a.fourSlot],['independentReview',a.independent]])if(oldChecks.artifactHashes?.[field]&&oldChecks.artifactHashes[field]!==sha(fs.readFileSync(p)))output.failures.push({sourceArchiveFile:exam.sourceArchiveFile,type:'CHECK_ARTIFACT_HASH',field});
   for(const q of ck.changedSourceItems){output.changedSourceItems.push({sourceArchiveFile:exam.sourceArchiveFile,...q});for(const field of q.fields)output.changedFieldCounts[field]=(output.changedFieldCounts[field]||0)+1;}
   output.legacyLevelChanges+=ck.changedSourceItems.filter(q=>q.fields.includes('level')).length;
   output.protectedFieldChanges+=ck.failures.filter(x=>x.startsWith('PROTECTED_')).length;
   output.examCount++;output.questionCount+=bank.length;output.independentSampleCount+=ind.samples.length;
   output.sourceOnlyMethodDebt+=ck.fourSlot.expectedSourceOnlyDebt;output.unexpectedFourSlotFailures+=ck.fourSlot.unexpectedFailureCount;output.fourSlotQuotes+=ck.fourSlot.quotes;
   let qfullMatches=0;
   for(let i=0;i<bank.length;i++){
    const q=bank[i],item=f.items[i],reg=input.items[i].registered;
    if(hash({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,answer:q.answer??null,solution:q.solution??null,image:q.image??null})===reg.sourceFingerprint)qfullMatches++;
    const refs=new Set(strings(q).flatMap(t=>[...t.matchAll(/assets\/images\/[^\s"'<>]+?\.(?:png|jpg|jpeg|svg|webp)/g)].map(m=>assetPath(m[0]))));
    for(const p of refs){
     if(!assetCache.has(p)){const bytes=git('show','HEAD:'+p);assetCache.set(p,{path:p,gitBlob:git('rev-parse','HEAD:'+p).toString().trim(),sha256:sha(bytes),bytes:bytes.length});}
     const ref=assetCache.get(p);
     const proofs=(item.fingerprints||[]).filter(k=>k.scope==='QASSET'&&assetPath(k.path||k.sourceImage||k.sourceAsset)===p);
     if(!proofs.some(k=>k.value===ref.sha256))output.failures.push({sourceArchiveFile:exam.sourceArchiveFile,ordinal:i+1,type:'ASSET_PROOF_MISSING_OR_MISMATCH',path:p});
    }
   }
   output.registeredCurrentQfullMatches+=qfullMatches;
   output.exams.push({sourceArchiveFile:exam.sourceArchiveFile,count:bank.length,sourceCurrentBlob:ck.sourceCurrentBlob,sourceOnly:exam.sourceOnly,mechanicalStatus:ck.mechanicalStatus,fourSlot:ck.fourSlot,independentSamples:ind.samples.map(s=>s.ordinal),registeredCurrentQfullMatches:qfullMatches,changedSourceItemCount:ck.changedSourceItems.length});
  }
  output.assets=[...assetCache.values()];output.assetCount=output.assets.length;
  const registry=await import(pathToFileURL(path.join(root,'archive/tools/meta-foundation/active-registry.mjs')).href);
  const active=registry.loadActiveMetaRegistry(root);output.activeRegistryIntegrity={status:active.status,errors:active.errors,registrySha:active.registrySha,problemTypes:active.problemTypes.size,templates:active.templates.size};
  if(active.errors.length)output.failures.push({type:'ACTIVE_REGISTRY_INTEGRITY',errors:active.errors});
  const changed=git('diff','--name-only','-z',progress.baselineMain).toString().split('\0').filter(Boolean);
  const allowedSources=new Set(progress.exams.map(e=>e.sourcePath));
  output.scopeChanges=changed;
  const illegal=changed.filter(p=>p!=='WORKER_CURRENT.md'&&!p.startsWith(base+'/')&&!allowedSources.has(p));
  if(illegal.length)output.failures.push({type:'OUT_OF_SCOPE_CHANGE',files:illegal});
  if(output.examCount!==12||output.questionCount!==286||output.independentSampleCount!==36||output.sourceOnlyMethodDebt!==193)output.failures.push({type:'FINAL_DENOMINATOR'});
  output.status=output.failures.length?'FAIL':'MECHANICAL_CHECKS_PASSED_WITH_DECLARED_SEMANTIC_DEBT';
  output.qualityStatus='NOT_A_FULL_SEMANTIC_OR_RELEASE_PASS';
  const dest=process.argv[2];if(dest)fs.writeFileSync(dest,JSON.stringify(output,null,2)+'\n');
  console.log(JSON.stringify({status:output.status,examCount:output.examCount,questionCount:output.questionCount,samples:output.independentSampleCount,changedSourceItems:output.changedSourceItems.length,changedFieldCounts:output.changedFieldCounts,expectedMethodDebt:output.sourceOnlyMethodDebt,unexpectedFourSlotFailures:output.unexpectedFourSlotFailures,assetCount:output.assetCount,failures:output.failures}));
  process.exitCode=output.failures.length?1:0;
 } finally { fs.rmSync(tmp,{recursive:true,force:true}); }
})().catch(e=>{console.error(e.stack);process.exitCode=1;});

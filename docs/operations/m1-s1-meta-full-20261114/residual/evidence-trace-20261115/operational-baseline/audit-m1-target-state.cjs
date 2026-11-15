const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),cp=require('node:child_process');
const root=process.argv[2],ref=process.argv[3]||'HEAD',out=process.argv[4];
// Input requests are consumed by the registrar. Their immutable pre-registration
// baseline remains the comparison authority for subsequent production receipts.
const baselineRef=process.argv[5]||'854215b755536cc73b1ce412aed239dc396fd53d';
const git=(...args)=>cp.execFileSync('git',args,{cwd:root,maxBuffer:96*1024*1024});
const readAt=(p)=>git('show',ref+':'+p);
const loadJson=(p)=>JSON.parse(readAt(p));
const loadBaseline=(p)=>JSON.parse(git('show',baselineRef+':'+p));
const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const fp=q=>sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,answer:q.answer??null,solution:q.solution??null,image:q.image??null}));
const cf=q=>sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,image:q.image??null}));
const scope=loadBaseline('docs/operations/m1-operational-closeout-20261115/expected-four-slot-uid-scope.json').items.filter(x=>x.sourceArchiveFile.includes('/middle/m1/1'));
const metas=new Map(loadJson('archive/data/question_metadata.json').records.map(r=>[r.questionUid,r]));
const ids=new Map(loadJson('archive/data/question_identity_map.json').records.map(r=>[r.questionUid,r]));
const runtime=loadJson('archive/data/item-4slot-index.json');
const sandbox={module:{exports:{}}};vm.runInNewContext(readAt('archive/item-4slot.js').toString(),sandbox);
const consumer=sandbox.module.exports.createIndex(runtime);
const runtimeFiles=new Map(runtime.files.map(f=>[f.path,f]));
const cache=new Map();
function source(p){
 if(cache.has(p))return cache.get(p);
 const raw=readAt('archive/exams/'+p),ctx={window:{}};
 vm.runInNewContext(raw.toString(),ctx,{timeout:3000});
 const bank=ctx.window.questionBank||ctx.window.questions||ctx.window.examData?.questions||ctx.questions||ctx.questionBank;
 if(!Array.isArray(bank))throw Error('BANK_MISSING:'+p);
 const value={bank:JSON.parse(JSON.stringify(bank)),blob:git('rev-parse',ref+':archive/exams/'+p).toString().trim(),sha256:sha(raw)};
 cache.set(p,value);return value;
}
const rows=scope.map(s=>{
 const m=metas.get(s.questionUid),id=ids.get(s.questionUid),src=source(s.sourceArchiveFile),q=src.bank[s.sourceOrdinal-1],four=consumer.get(s.questionUid);
 return {...s,currentSourceBlobSha1:src.blob,currentSourceFingerprint:fp(q),currentContentFingerprint:cf(q),
 metadata:{exists:!!m,sourceFingerprint:m?.sourceFingerprint,contentFingerprint:m?.contentFingerprint,sourceFingerprintMatches:m?.sourceFingerprint===fp(q),contentFingerprintMatches:m?.contentFingerprint===cf(q),metadataApprovalType:m?.metadataApprovalType??null,metadataStatus:m?.metadataStatus,reviewStatus:m?.reviewStatus,holdReason:m?.metaFoundationHoldReason??null,difficultyBucket:m?.difficultyBucket,approvalEvidence:m?.approvalEvidence??[]},
 identity:{exists:!!id,tupleMatches:id?.sourceArchiveFile===s.sourceArchiveFile&&id?.sourceOrdinal===s.sourceOrdinal,sourceFingerprintMatches:id?.sourceFingerprint===fp(q)},
 currentSource:{difficultyBucket:q.difficultyBucket??null,solutionPresent:!!String(q.solution||'').trim()},
 fourSlot:four?{status:four.registrationStatus,sourceBinding:four.sourceBinding,identityFingerprintStatus:four.identityFingerprintStatus,compactPath:four.compactPath}:null};
});
const difficulty=[1,2,3].flatMap(n=>{
 const req=loadBaseline('.archive-meta-register/inbox/m1s1-reviewed-difficulty-'+n+'-20261115.json');
 return req.gemini.items.map(it=>{const r=rows.find(x=>x.questionUid===it.questionUid);return {requestId:req.gemini.requestId,questionUid:it.questionUid,sourceArchiveFile:req.gemini.sourceArchiveFile,ordinal:it.ordinal,expected:it.after,metadataBucket:r.metadata.difficultyBucket,sourceBucket:r.currentSource.difficultyBucket,expectedBucketPresent:r.metadata.difficultyBucket===it.after.difficultyBucket,sourceBinding:r.metadata.sourceFingerprintMatches,metadataApprovalType:r.metadata.metadataApprovalType,reviewStatus:r.metadata.reviewStatus};});
});
const count=(list,key)=>Object.fromEntries([...new Set(list.map(key))].map(k=>[k,list.filter(x=>key(x)===k).length]));
const eligible=rows.filter(r=>r.expectedStatus==='ELIGIBLE_PREPARED');
const compactChecks=[...new Set(rows.filter(r=>r.expectedStatus!=='HOLD_SOURCE_ONLY_METHOD').map(r=>r.sourceArchiveFile))].map(sourceArchiveFile=>{
 const compactPath='archive/data/item-4slot/'+sourceArchiveFile.replace(/\.js$/,'.4slot.json');
 const compact=loadJson(compactPath),file=runtimeFiles.get(compactPath),src=source(sourceArchiveFile);
 const matches=compact.items.filter(item=>{
  const row=rows.find(r=>r.sourceArchiveFile===sourceArchiveFile&&r.sourceOrdinal===item.ordinal),four=consumer.get(row.questionUid);
  return four&&['given','goal','method','condition'].every(key=>JSON.stringify(four[key])===JSON.stringify(item[key]));
 }).length;
 return {sourceArchiveFile,compactPath,compactSourceBlob:compact.sourceGitBlobSha,currentSourceBlob:src.blob,compactBoundToCurrentSource:compact.sourceGitBlobSha===src.blob,runtimeFilePresent:!!file,runtimeSourceCurrent:file?.currentSourceBlobSha===src.blob,compactShaMatches:file?.compactSha256===sha(readAt(compactPath)),compactItems:compact.items.length,exactFourSlotMatches:matches};
});
const result={schemaVersion:'m1-target-production-state-readonly-v1',ref:git('rev-parse',ref).toString().trim(),baselineRef,sourceReadFromImmutableGit:true,repositoryMutations:0,semanticReview: 'NOT_RUN_REUSE_EXISTING',difficulty,compactChecks,
fourSlot:{expectedEligible:eligible.length,currentlyExposedByReadOnlyConsumer:eligible.filter(r=>r.fourSlot).length,explicitPartialHolds:rows.filter(r=>r.expectedStatus==='HOLD_PARTIAL_METHOD_EVIDENCE').length,sourceOnlyHeld:rows.filter(r=>r.expectedStatus==='HOLD_SOURCE_ONLY_METHOD').length,indexCounts:runtime.counts,indexSha256:sha(readAt('archive/data/item-4slot-index.json'))},
solved93:{metadataSourceFingerprintCurrent:rows.filter(r=>r.expectedStatus!=='HOLD_SOURCE_ONLY_METHOD'&&r.metadata.sourceFingerprintMatches).length,identitySourceFingerprintCurrent:rows.filter(r=>r.expectedStatus!=='HOLD_SOURCE_ONLY_METHOD'&&r.identity.sourceFingerprintMatches).length,contentFingerprintCurrent:rows.filter(r=>r.expectedStatus!=='HOLD_SOURCE_ONLY_METHOD'&&r.metadata.contentFingerprintMatches).length,reviewStatuses:count(rows.filter(r=>r.expectedStatus!=='HOLD_SOURCE_ONLY_METHOD'),r=>r.metadata.reviewStatus),approvalTypes:count(rows.filter(r=>r.expectedStatus!=='HOLD_SOURCE_ONLY_METHOD'),r=>r.metadata.metadataApprovalType??'NONE')},
q7:rows.find(r=>r.questionUid==='qid_v1_93d23f09e6b4ba421810c56393949ce5910e7d0c7bf416ed78ea055842f93c2e'),rows};
if(out)fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,rows:undefined},null,2));


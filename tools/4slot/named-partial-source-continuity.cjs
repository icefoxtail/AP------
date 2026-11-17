'use strict';
// Reuse two already-issued partial contracts against their exact historical
// source, then retain only current unchanged payloads through the ordinary
// builder. This module never issues a vector or repairs the changed M3 Q8.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const {sourceNumber,sourceIdentityNumber}=require('./exam-items.cjs');
const SCHEMA='archive-4slot-named-partial-source-continuity-v1';
const HISTORY='998e187898165ba979871c25f42582b92889ecc0';
const CHANGE='896f5c7cb5f99f4a98d7824b093672069499acac';
const IDENTITY='archive/data/question_identity_map.json';
const SUBJECTS=Object.freeze([{"subjectId":"m1s1-geumdang19-final-five","sourceArchiveFile":"original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js","claimPath":"archive/data/item-4slot-partial-source-continuity/v1/m1s1-geumdang19-final-five-source-only-26fc-20261117.json","claimSha256":"99e9e5930ebda7e96bf15ec99e7ffe4881771b7526da5a3e0dd0c8fa9bb2c480","claimGitBlobSha1":"53562a65c97961c20670222c67b7206d9f48011f","claimBytes":24210,"allowedOrdinals":[1,4,5,7,8],"heldOrdinals":[]},{"subjectId":"m3s2-sinheung19-mid-eleven","sourceArchiveFile":"original/middle/m3/2mid/19_신흥중_2학기_중간_중3_수학.js","claimPath":"archive/data/item-4slot-partial-source-continuity/v1/m3s2-sinheung19-mid-eleven-source-only-26fc-20261117.json","claimSha256":"0a39181475f4c900b4526ad975e311f47ad171a2103f9b875c9819cb7e7196ec","claimGitBlobSha1":"d2e18bd591b0249f21496648adea92c06da99f41","claimBytes":30595,"allowedOrdinals":[1,2,3,4,5,6,7,9,10,17,21],"heldOrdinals":[8]}].map(row=>Object.freeze({...row,allowedOrdinals:Object.freeze(row.allowedOrdinals),heldOrdinals:Object.freeze(row.heldOrdinals)})));
const contexts=new WeakMap();
const P=()=>require('./partial-submission.cjs');
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const blob=x=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${Buffer.byteLength(x)}\0`),Buffer.from(x)])).digest('hex');
const same=(a,b)=>stable(a)===stable(b),clone=x=>JSON.parse(JSON.stringify(x));
const fail=c=>{throw Error('NAMED_PARTIAL_SOURCE:'+c);};
const check=(ok,c)=>{if(!ok)fail(c);};
const GIT=/^[a-f0-9]{40}$/,SHA=/^[a-f0-9]{64}$/;
function git(root,args){try{return execFileSync('git',['-C',root,...args],{maxBuffer:40*1024*1024,timeout:30000,stdio:['ignore','pipe','pipe']});}catch{fail('IMMUTABLE_GIT_UNAVAILABLE');}}
function rootPath(root){const real=path.resolve(root);check(fs.realpathSync(real)===real&&fs.lstatSync(real).isDirectory(),'ROOT_PATH');return real;}
function regular(root,rel){const f=P().safe(root,rel);let stat;try{stat=fs.lstatSync(f);}catch{fail('LIVE_FILE_MISSING');}check(stat.isFile()&&!stat.isSymbolicLink(),'REGULAR_FILE');return f;}
function assertPin(ref){check(ref&&typeof ref.path==='string'&&GIT.test(ref.gitBlobSha1||'')&&SHA.test(ref.sha256||'')&&Number.isSafeInteger(ref.bytes)&&ref.bytes>0,'REF_FIELDS');}
function assertBytes(raw,ref){assertPin(ref);check(raw.length===ref.bytes&&sha(raw)===ref.sha256&&blob(raw)===ref.gitBlobSha1,'REF_BYTES');}
function treePin(root,commit,ref){
 check(GIT.test(commit||''),'COMMIT_FORMAT');P().safe(root,ref.path);
 const entry=git(root,['ls-tree','-z',commit,'--',ref.path]).toString('utf8');
 check(entry===`100644 blob ${ref.gitBlobSha1}\t${ref.path}\0`,'GIT_PATH_BINDING');
}
function immutable(root,ref){assertPin(ref);treePin(root,ref.commit,ref);const raw=git(root,['show',ref.commit+':'+ref.path]);assertBytes(raw,ref);return raw;}
function live(ctx,ref,{headBound=true}={}){
 assertPin(ref);const raw=fs.readFileSync(regular(ctx.root,ref.path));assertBytes(raw,ref);
 if(headBound)treePin(ctx.root,ctx.head,ref);
 const entry={path:ref.path,sha256:ref.sha256,gitBlobSha1:ref.gitBlobSha1,bytes:ref.bytes,headBound};
 const prior=ctx.live.get(ref.path);check(!prior||same(prior,entry),'LIVE_PATH_CONFLICT');ctx.live.set(ref.path,entry);
 return raw;
}
function assertLive(ctx){
 check(git(ctx.root,['rev-parse','HEAD']).toString().trim()===ctx.head,'HEAD_CHANGED');
 for(const ref of ctx.live.values()){
  const raw=fs.readFileSync(regular(ctx.root,ref.path));assertBytes(raw,ref);
  if(ref.headBound)treePin(ctx.root,ctx.head,ref);
 }
 check(sha(ctx.oldRaw)===ctx.data.historicalSource.sha256&&same(ctx.oldBank,parseBank(ctx.oldRaw)),'HISTORICAL_VIEW_MUTATED');
}
function parseBank(bytes){
 let text=Buffer.from(bytes).toString('utf8').replace(/^\uFEFF/,'').trim(),values=Object.create(null);
 while(text.startsWith('//')||text.startsWith('/*')){
  const end=text.startsWith('//')?text.indexOf('\n'):text.indexOf('*/')+2;
  check(end>0,'SOURCE_HEADER');text=text.slice(end).trim();
 }
 function takeJson(s){let quoted=false,escape=false,depth=0,end=-1;
  for(let i=0;i<s.length;i++){const ch=s[i];if(quoted){if(escape)escape=false;else if(ch==='\\')escape=true;else if(ch==='"')quoted=false;}
   else if(ch==='"')quoted=true;else if(ch==='['||ch==='{')depth++;else if(ch===']'||ch==='}')depth--;
   if(!quoted&&depth===0&&(s[0]==='"'||s[0]==='['||s[0]==='{')){end=i+1;break;}}
  check(end>0&&!quoted&&depth===0,'SOURCE_JSON');let value;try{value=JSON.parse(s.slice(0,end));}catch{fail('SOURCE_JSON');}return{value,rest:s.slice(end).trim()};
 }
 while(text){
  if(/^window\.questionBank\s*=\s*window\.examData\.questions\s*;?\s*$/.test(text)){
   check(!Object.hasOwn(values,'questionBank')&&Array.isArray(values.examData?.questions),'SOURCE_ALIAS');values.questionBank=values.examData.questions;text='';break;
  }
  const m=text.match(/^window\.(examTitle|examData|questionBank)\s*=\s*/);check(m,'SOURCE_DATA_WRAPPER');
  check(!Object.hasOwn(values,m[1]),'SOURCE_DUPLICATE_ASSIGNMENT');const parsed=takeJson(text.slice(m[0].length));
  check(parsed.rest.startsWith(';'),'SOURCE_TERMINATOR');values[m[1]]=parsed.value;text=parsed.rest.slice(1).trim();
 }
 check(!Object.hasOwn(values,'examTitle')||typeof values.examTitle==='string','SOURCE_TITLE_TYPE');
 check(!Object.hasOwn(values,'examData')||values.examData&&typeof values.examData==='object'&&!Array.isArray(values.examData),'SOURCE_DOCUMENT');
 const rows=values.questionBank??values.examData?.questions;check(Array.isArray(rows)&&rows.every(q=>q&&typeof q==='object'&&!Array.isArray(q)),'SOURCE_BANK');
 if(values.questionBank&&values.examData?.questions)check(same(values.questionBank,values.examData.questions),'SOURCE_DUPLICATE_BANK_DRIFT');
 return rows;
}
function parseNamedSource(d,raw){return SUBJECTS.some(s=>s.sourceArchiveFile===d?.sourceArchiveFile)?parseBank(raw):null;}
function identityFor(ctx,provided){
 const raw=fs.readFileSync(regular(ctx.root,IDENTITY));
 const ref={path:IDENTITY,sha256:sha(raw),gitBlobSha1:blob(raw),bytes:raw.length};live(ctx,ref);
 const actual=JSON.parse(raw);check(Array.isArray(actual.records),'IDENTITY_DOCUMENT');
 if(provided!==undefined)check(Array.isArray(provided?.records)&&same(provided.records,actual.records),'CALLER_IDENTITY_RECORDS');
 const counts=new Map(),joins=new Map();
 for(const row of actual.records){check(typeof row.questionUid==='string','GLOBAL_UID_FORMAT');counts.set(row.questionUid,(counts.get(row.questionUid)||0)+1);
  const key=row.sourceArchiveFile+'#'+row.sourceOrdinal;if(!joins.has(key))joins.set(key,[]);joins.get(key).push(row);}
 check([...counts.values()].every(n=>n===1),'GLOBAL_UID_DUPLICATE');
 for(const row of ctx.data.canonicalRows){
  const hits=joins.get(ctx.subject.sourceArchiveFile+'#'+row.sourceOrdinal)||[];
  check(hits.length===1&&hits[0].questionUid===row.questionUid&&sha(stable(hits[0]))===row.identityRowSha256,'CURRENT_CANONICAL_IDENTITY');
 }
 ctx.identity=actual;ctx.identityRecordsSha=sha(stable(actual.records));return actual;
}
function context(token,root){const c=contexts.get(token);check(c&&c.active&&rootPath(root)===c.root,'HISTORICAL_TOKEN_NOT_ACTIVE');assertLive(c);return c;}
function assertHistoricalContext(token,{root,d,bank,identity,sourceRaw,dictRaw,dictPath,stack}){
 const ctx=context(token,root),next=ctx.compactCalls[ctx.callIndex];
 check(next&&sha(stable(d))===next.wholeSha256&&same(d,next.data),'HISTORICAL_COMPACT_SCOPE');
 check(stack instanceof Set&&stack.size===ctx.callIndex,'HISTORICAL_CHAIN_DEPTH');
 check(Buffer.isBuffer(sourceRaw)&&sha(sourceRaw)===ctx.data.historicalSource.sha256&&same(bank,ctx.oldBank),'HISTORICAL_SOURCE_ARGUMENTS');
 check(Array.isArray(identity?.records)&&sha(stable(identity.records))===ctx.identityRecordsSha,'HISTORICAL_IDENTITY_ARGUMENTS');
 check(Buffer.isBuffer(dictRaw)&&sha(dictRaw)===ctx.data.dictionary.sha256&&dictPath===ctx.data.dictionary.path,'HISTORICAL_DICTIONARY_ARGUMENTS');
 ctx.callIndex++;return true;
}
function historicalRebindView(token,{root,inputRef,acceptanceRef,input,acceptance}){
 const ctx=context(token,root),pub=ctx.data.historicalPublicRebind;
 check(ctx.subject.subjectId==='m3s2-sinheung19-mid-eleven'&&ctx.rebindReads===0,'HISTORICAL_REBIND_SCOPE');
 check(same(inputRef,{path:pub.input.path,sha256:pub.input.sha256})&&same(acceptanceRef,{path:pub.acceptance.path,sha256:pub.acceptance.sha256}),'HISTORICAL_REBIND_REFS');
 check(same(input,ctx.publicInput)&&same(acceptance,ctx.publicAcceptance),'HISTORICAL_REBIND_DOCUMENTS');
 ctx.rebindReads++;
 return{sourceRaw:Buffer.from(ctx.oldRaw),bank:clone(ctx.oldBank),sourceCommit:HISTORY,baselineBank:clone(ctx.baselineBank)};
}
function verifyNamedSourceContinuation(root,d,options={}){
 const subject=SUBJECTS.find(s=>s.sourceArchiveFile===d?.sourceArchiveFile);if(!subject)return null;
 root=rootPath(root);const claimFile=P().safe(root,subject.claimPath);if(!fs.existsSync(claimFile))return null;
 const ctx={root,subject,head:git(root,['rev-parse','HEAD']).toString().trim(),live:new Map(),active:false,callIndex:0,rebindReads:0};
 check(GIT.test(ctx.head),'HEAD_FORMAT');
 const claim=live(ctx,{path:subject.claimPath,sha256:subject.claimSha256,gitBlobSha1:subject.claimGitBlobSha1,bytes:subject.claimBytes},{headBound:false});
 const data=JSON.parse(claim);ctx.data=data;
 check(data.schemaVersion===SCHEMA&&data.subjectId===subject.subjectId&&data.authority==='EXISTING_REVIEWED_PARTIAL_VECTORS_ONLY'&&data.sourceArchiveFile===subject.sourceArchiveFile,'CLAIM_SCOPE');
 check(data.historicalCommit===HISTORY&&data.sourceChangeCommit===CHANGE,'HISTORICAL_COMMIT_SCOPE');
 git(root,['merge-base','--is-ancestor',HISTORY,CHANGE]);git(root,['merge-base','--is-ancestor',CHANGE,ctx.head]);
 ctx.oldRaw=immutable(root,data.historicalSource);ctx.oldBank=parseBank(ctx.oldRaw);
 immutable(root,data.currentSource);treePin(root,CHANGE,data.currentSource);
 const currentRaw=live(ctx,data.currentSource),currentBank=parseBank(currentRaw);
 const compactRaw=immutable(root,data.originalCompact),originalCompact=JSON.parse(compactRaw);
 check(same(originalCompact,d)&&sha(stable(d))===data.originalCompactWholeSha256,'ORIGINAL_COMPACT_WHOLE');
 check(d.sourceGitBlobSha===data.historicalSource.gitBlobSha1&&d.sourceArchiveFile===subject.sourceArchiveFile,'ORIGINAL_SOURCE_BINDING');
 check(currentBank.length===data.expectedQuestionCount&&ctx.oldBank.length===data.expectedQuestionCount,'SOURCE_DENOMINATOR');
 check(options.sourceRaw===undefined||Buffer.isBuffer(options.sourceRaw)&&Buffer.compare(options.sourceRaw,currentRaw)===0,'CALLER_CURRENT_SOURCE');
 check(options.bank===undefined||same(options.bank,currentBank),'CALLER_CURRENT_BANK');
 for(const ref of data.requiredHistorical)immutable(root,ref);
 for(const ref of data.requiredCurrent)live(ctx,ref);
 for(const ref of data.immutableNativeRefs)immutable(root,ref);
 const dictRaw=live(ctx,data.dictionary);
 check(options.dictPath===undefined||options.dictPath===data.dictionary.path,'CALLER_DICTIONARY_PATH');
 check(options.dictRaw===undefined||Buffer.isBuffer(options.dictRaw)&&Buffer.compare(options.dictRaw,dictRaw)===0,'CALLER_DICTIONARY_BYTES');
 const identity=identityFor(ctx,options.identity);
 const sourceNow={...d,sourceGitBlobSha:data.currentSource.gitBlobSha1};
 const currentPartition=P().partition(root,sourceNow,{bank:currentBank,sourceRaw:currentRaw,identity});P().selectedItems(d,currentPartition,true);
 check(same(P().scopeFields(d),data.originalPartition),'ORIGINAL_PARTITION');
 const changes=[];
 for(let i=0;i<currentBank.length;i++){
  const before=ctx.oldBank[i],after=currentBank[i],row=data.canonicalRows[i],canonical=currentPartition.canonical[i];
  check(row&&row.sourceOrdinal===i+1&&row.questionUid===canonical.questionUid&&row.sourceQuestionNo===canonical.sourceQuestionNo&&row.displayNumber===canonical.displayNumber,'CANONICAL_PARTITION');
  check(sourceNumber(before)===sourceNumber(after)&&sourceIdentityNumber(before)===sourceIdentityNumber(after),'QUESTION_IDENTITY_CHANGED');
  check(sha(stable(before))===row.historicalWholeSha256&&sha(stable(after))===row.currentWholeSha256,'WHOLE_QUESTION_PIN');
  if(!same(before,after))changes.push({ordinal:i+1,fields:[...new Set([...Object.keys(before),...Object.keys(after)])].filter(k=>!same(before[k],after[k])).sort(),beforeWholeSha256:sha(stable(before)),afterWholeSha256:sha(stable(after))});
 }
 check(same(changes,data.allowedSourceDeltas),'ONLY_DECLARED_SOURCE_DELTA');
 const selected=currentPartition.selected;
 const restored=selected.filter(r=>same(ctx.oldBank[r.sourceOrdinal-1],currentBank[r.sourceOrdinal-1])).map(r=>r.sourceOrdinal);
 const held=selected.filter(r=>!same(ctx.oldBank[r.sourceOrdinal-1],currentBank[r.sourceOrdinal-1])).map(r=>r.sourceOrdinal);
 check(same(restored,subject.allowedOrdinals)&&same(held,subject.heldOrdinals)&&same(restored,data.selectedWholePreservedOrdinals),'EXACT_RESTORED_SELECTION');
 check(same(data.heldSelected.map(r=>r.sourceOrdinal),held)&&data.heldSelected.every(r=>r.reason==='STALE_STUDENT_PAYLOAD'&&r.newApproval===false),'HELD_SELECTION_NOT_APPROVED');
 for(const asset of data.assets){const historical=immutable(root,asset.historical),current=live(ctx,asset.current);check(Buffer.compare(historical,current)===0,'SELECTED_ASSET_CHANGED');}
 ctx.compactCalls=data.originalCompactChain.map(ref=>{const raw=live(ctx,ref),value=JSON.parse(raw);return{data:value,wholeSha256:sha(stable(value))};});
 const pub=data.historicalPublicRebind;
 if(subject.subjectId==='m3s2-sinheung19-mid-eleven'){
  ctx.publicInput=JSON.parse(live(ctx,pub.input));ctx.publicAcceptance=JSON.parse(live(ctx,pub.acceptance));
  immutable(root,pub.priorCompact);ctx.baselineBank=parseBank(immutable(root,pub.baselineSource));
 }
 const token=Object.freeze(Object.create(null));ctx.active=true;contexts.set(token,ctx);
 let original;
 try{
  original=P().publicEvidence(root,d,{bank:clone(ctx.oldBank),identity,sourceRaw:Buffer.from(ctx.oldRaw),dictRaw,dictPath:data.dictionary.path,historicalContext:token});
  check(original&&typeof original.then!=='function','SYNCHRONOUS_ORIGINAL_VALIDATION_REQUIRED');
  check(ctx.callIndex===ctx.compactCalls.length&&ctx.rebindReads===(subject.subjectId==='m3s2-sinheung19-mid-eleven'?1:0),'ORIGINAL_WHOLE_CHAIN_REQUIRED');
  assertLive(ctx);
 }finally{ctx.active=false;contexts.delete(token);}
 const digests=new Map();for(const ref of [...original.evidenceDigests,...ctx.live.values()]){
  const previous=digests.get(ref.path);check(!previous||previous.sha256===ref.sha256,'EVIDENCE_PATH_CONFLICT');digests.set(ref.path,{path:ref.path,sha256:ref.sha256});}
 return{...original,...currentPartition,evidenceDigests:[...digests.values()].sort((a,b)=>a.path.localeCompare(b.path)),
  contractSha256:sha(Buffer.concat([fs.readFileSync(__filename),fs.readFileSync(require.resolve('./rebind-reviewed-partial.cjs'))])),
  namedSourceContinuity:{schemaVersion:SCHEMA,subjectId:subject.subjectId,path:subject.claimPath,sha256:subject.claimSha256,restoredOrdinals:restored,heldOrdinals:held,newApprovals:0}};
}
module.exports={SCHEMA,SUBJECTS,parseBank,parseNamedSource,verifyNamedSourceContinuation,assertHistoricalContext,historicalRebindView};

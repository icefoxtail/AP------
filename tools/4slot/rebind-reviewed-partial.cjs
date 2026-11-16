#!/usr/bin/env node
'use strict';
// Rebind existing public, reviewed vectors after a bounded solution-renderer
// addition. This does not author a vector, issue native QA, or review other UIDs.
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const P=require('./partial-submission.cjs');
const INPUT_SCHEMA='archive-4slot-public-reviewed-renderer-partial-input-v1';
const ACCEPTANCE_SCHEMA='archive-4slot-public-reviewed-renderer-rebind-acceptance-v1';
const EVIDENCE_SCHEMA='archive-4slot-public-reviewed-rebind-evidence-v1';
const RECEIPT_SCHEMA='archive-4slot-public-reviewed-rebind-receipt-v1';
const REVIEW_SCHEMA='m3-s2-current-solution-renderer-independent-review-v1';
const SAME='UNCHANGED_WHOLE_QUESTION_AND_ASSETS',ADDED='REVIEWED_SOLUTION_RENDERER_ADDITION';
const RENDER_FIELDS=['solutionImage','solutionImageSize','solutionImageAlt','solutionImageCaption'];
const fail=c=>P.fail('PUBLIC_REBIND_'+c),eq=P.eq,hash=P.sha;
function check(ok,code){if(!ok)fail(code);}
function publicPath(p){return typeof p==='string'&&/^\.archive-meta-register\/evidence\/m3s2-[A-Za-z0-9_./-]+\.json$/.test(p);}
function publicRef(root,r){P.keys(r,['path','sha256'],'PUBLIC_REFERENCE_FIELDS');check(publicPath(r.path)&&P.SHA.test(r.sha256),'PUBLIC_REFERENCE');const raw=fs.readFileSync(P.safe(root,r.path));check(hash(raw)===r.sha256,'PUBLIC_REFERENCE_HASH');return{raw,data:JSON.parse(raw)};}
function git(root,args){try{return execFileSync('git',['-C',root,...args],{maxBuffer:32*1024*1024,timeout:15000,stdio:['ignore','pipe','pipe']});}catch{fail('IMMUTABLE_GIT_INPUT_UNAVAILABLE');}}
function gitRef(root,r){P.keys(r,['commit','path','sha256','gitBlobSha1'],'PUBLIC_GIT_REFERENCE_FIELDS');check(P.GIT.test(r.commit)&&P.GIT.test(r.gitBlobSha1)&&P.SHA.test(r.sha256),'GIT_REFERENCE');P.safe(root,r.path);const raw=git(root,['show',r.commit+':'+r.path]);check(hash(raw)===r.sha256&&P.blob(raw)===r.gitBlobSha1,'GIT_REFERENCE_BYTES');return{raw,data:JSON.parse(raw)};}
function assets(q){
 const text=JSON.stringify(q).replaceAll('\\/','/'),out=new Set();
 check(!/https?:[^"\s]*\.(?:png|jpe?g|gif|webp|svg)/i.test(text),'EXTERNAL_ASSET_UNSUPPORTED');
 for(const m of text.matchAll(/(?:archive\/)?assets\/[A-Za-z0-9_가-힣%./+()@ -]+\.(?:png|jpe?g|gif|webp|svg)/gi))out.add(m[0].startsWith('archive/')?m[0]:'archive/'+m[0]);
 return [...out].sort();
}
function assetProof(root,bankQuestion,commit){return assets(bankQuestion).map(p=>{P.safe(root,p);const raw=git(root,['show',commit+':'+p]);return{path:p,sha256:hash(raw),gitBlobSha1:P.blob(raw)};});}
function liveAssets(root,q){return assets(q).map(p=>{const raw=fs.readFileSync(P.safe(root,p));return{path:p,sha256:hash(raw),gitBlobSha1:P.blob(raw)};});}
function termLookup(dict){const {buildLookup,norm}=require('./validate-4slot.cjs'),lut=buildLookup(dict);for(const t of dict.terms)lut.set('#'+t.id,t);return{lut,norm};}
function nativeBindings(n,q,compact,dict){
 const {lut,norm}=termLookup(dict),bindings=[];
 check(n.format===compact.format,'NATIVE_FORMAT');
 for(const slot of P.SLOTS){check(Array.isArray(n.slots?.[slot])&&n.slots[slot].length===compact[slot].length,'NATIVE_VECTOR_CARDINALITY');
  for(let i=0;i<n.slots[slot].length;i++){const e=n.slots[slot][i];let t=lut.get(norm(e.term));if(t?.status==='ALIAS'&&t.aliasOf)t=lut.get('#'+t.aliasOf);check(t&&t.id===compact[slot][i]&&!['RETIRED','CANDIDATE'].includes(t.status),'NATIVE_TERM_ID');
   check(typeof e.quote==='string'&&e.quote.length>0,'NATIVE_QUOTE_REQUIRED');
   const texts=e.src==='choices'?(q.choices||[]).map((text,j)=>({text:String(text),choiceIndex:j})):[{text:P.textFor(q,e)}];
   const found=texts.map(x=>({...x,at:x.text.indexOf(e.quote)})).find(x=>x.at>=0);check(found,'NATIVE_QUOTE_CURRENT');
   const b={slot,entryIndex:i,termId:t.id,src:e.src,...(e.src==='choices'?{choiceIndex:found.choiceIndex}:{}),offsetCodepoints:[...found.text.slice(0,found.at)].length,lengthCodepoints:[...e.quote].length,quoteSha256:hash(e.quote)};
   if(slot==='method'){check(['NAMED','IMPLIED'].includes(e.evidenceType),'NATIVE_METHOD_KIND');b.evidenceType=e.evidenceType;if(e.evidenceType==='IMPLIED'){check(typeof e.justification==='string'&&e.justification.trim(),'NATIVE_METHOD_JUSTIFICATION');b.justificationSha256=hash(e.justification);}}
   bindings.push(b);
  }
 }
 P.verifyBindings(bindings,compact,q);return bindings;
}
function validate(root,inputRef,acceptanceRef,{checkCurrentCompact=false}={}){
 root=path.resolve(root);const {raw:inputRaw,data:d}=publicRef(root,inputRef),{raw:acceptanceRaw,data:a}=publicRef(root,acceptanceRef);
 P.keys(d,['schemaVersion','requestId','author','preparedAtUtc','source','dictionary','priorCompact','baselineSourceCommit','expectedCompactSha256','submission','items','newSemanticApproval','newMathQa','sourceChanges'],'PUBLIC_INPUT_FIELDS');
 check(d.schemaVersion===INPUT_SCHEMA&&/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(d.requestId||'')&&typeof d.author==='string'&&d.author.trim()&&Number.isFinite(Date.parse(d.preparedAtUtc))&&d.newSemanticApproval===0&&d.newMathQa===0&&d.sourceChanges===0,'INPUT_SCHEMA');
 P.keys(a,['schemaVersion','author','reviewer','decision','reviewedAtUtc','allowedScope','newSemanticApproval','otherUidApprovals','newMathQa','sourceChanges','candidates'],'PUBLIC_ACCEPTANCE_FIELDS');
 check(a.schemaVersion===ACCEPTANCE_SCHEMA&&a.author===d.author&&a.reviewer&&a.reviewer!==d.author&&a.decision===P.DECISION&&/^\d{4}-\d{2}-\d{2}T.*(?:Z|\+00:00)$/.test(a.reviewedAtUtc||'')&&Number.isFinite(Date.parse(a.reviewedAtUtc))&&a.allowedScope==='FOUR_SLOT_VECTOR_ONLY'&&a.newSemanticApproval===0&&a.otherUidApprovals===0&&a.newMathQa===0&&a.sourceChanges===0,'ACCEPTANCE_AUTHORITY');
 check(Array.isArray(a.candidates)&&a.candidates.length>0&&new Set(a.candidates.map(r=>r.requestId)).size===a.candidates.length,'ACCEPTANCE_CANDIDATES');
 for(const r of a.candidates){P.keys(r,['requestId','inputSha256'],'PUBLIC_ACCEPTANCE_CANDIDATE_FIELDS');check(P.SHA.test(r.inputSha256),'ACCEPTANCE_INPUT_HASH');}
 check(a.candidates.filter(r=>r.requestId===d.requestId&&r.inputSha256===hash(inputRaw)).length===1,'ACCEPTANCE_EXACT_INPUT');
 P.keys(d.source,['path','gitBlobSha','rawSha256'],'PUBLIC_SOURCE_FIELDS');
 check(/^archive\/exams\/original\/middle\/m3\/2(?:mid|final)\/[^/]+\.js$/.test(d.source.path||'')&&P.GIT.test(d.source.gitBlobSha)&&P.SHA.test(d.source.rawSha256),'SOURCE_SCOPE');
 const sourceArchiveFile=d.source.path.slice('archive/exams/'.length),sourceRaw=fs.readFileSync(P.safe(root,d.source.path)),bank=P.loadBank(sourceRaw);
 check(P.blob(sourceRaw)===d.source.gitBlobSha&&hash(sourceRaw)===d.source.rawSha256&&git(root,['rev-parse','HEAD:'+d.source.path]).toString().trim()===d.source.gitBlobSha,'CURRENT_SOURCE_HEAD');
 P.keys(d.dictionary,['path','version','gitBlobSha','rawSha256'],'PUBLIC_DICTIONARY_FIELDS');check(/^docs\/architecture\/4slot\/term-dictionary-v[0-9]+(?:\.[0-9]+)*\.json$/.test(d.dictionary.path||''),'DICTIONARY_PATH');
 const dictRaw=fs.readFileSync(P.safe(root,d.dictionary.path)),dict=JSON.parse(dictRaw);
 check(dict.dictionaryVersion===d.dictionary.version&&P.blob(dictRaw)===d.dictionary.gitBlobSha&&hash(dictRaw)===d.dictionary.rawSha256&&git(root,['rev-parse','HEAD:'+d.dictionary.path]).toString().trim()===d.dictionary.gitBlobSha,'CURRENT_DICTIONARY_HEAD');
 const compactPath='archive/data/item-4slot/'+sourceArchiveFile.replace(/\.js$/,'.4slot.json');check(d.priorCompact.path===compactPath,'PRIOR_COMPACT_PATH');
 const {raw:priorRaw,data:prior}=gitRef(root,d.priorCompact);
 check(d.expectedCompactSha256===hash(priorRaw)&&prior.schemaVersion==='archive-meta-4slot-compact-v1'&&!P.hasScope(prior)&&prior.sourceArchiveFile===sourceArchiveFile&&prior.dictionaryVersion===d.dictionary.version&&P.GIT.test(prior.sourceGitBlobSha)&&Array.isArray(prior.items)&&prior.items.length===bank.length,'PRIOR_COMPLETE_COMPACT');
 check(P.GIT.test(d.baselineSourceCommit),'BASELINE_COMMIT');const oldRaw=git(root,['show',d.baselineSourceCommit+':'+d.source.path]);check(P.blob(oldRaw)===prior.sourceGitBlobSha,'PRIOR_SOURCE_BASELINE');const oldBank=P.loadBank(oldRaw);check(oldBank.length===bank.length,'PRIOR_SOURCE_DENOMINATOR');
 if(checkCurrentCompact)check(hash(fs.readFileSync(P.safe(root,compactPath)))===d.expectedCompactSha256,'COMPACT_CAS');
 P.keys(d.submission,['scope','expectedQuestionCount','selected','unsubmitted'],'PUBLIC_PARTITION_FIELDS');
 const scoped={...d.submission,sourceArchiveFile,sourceGitBlobSha:d.source.gitBlobSha};const partition=P.partition(root,scoped,{bank,sourceRaw});
 check(Array.isArray(d.items)&&d.items.length===partition.selected.length,'ITEM_DENOMINATOR');
 const priorByNumber=new Map(prior.items.map(it=>[it.ordinal,it]));check(priorByNumber.size===bank.length&&bank.every((q,i)=>priorByNumber.has(partition.canonical[i].displayNumber)),'PRIOR_COMPLETE_ROWS');
 const seen=new Set(),outputItems=[],receiptItems=[],continuity=[];let unchanged=0,renderer=0;
 for(const row of d.items){
  P.keys(row,['questionUid','sourceOrdinal','sourceQuestionNo','kind','native','nativeRowSha256','priorCompactItemSha256','currentWholeQuestionSha256','beforeWholeQuestionSha256',...(row.kind===ADDED?['rendererReview']:[])],'PUBLIC_ITEM_FIELDS');
  const selected=partition.selected.find(s=>s.questionUid===row.questionUid&&s.sourceOrdinal===row.sourceOrdinal&&s.sourceQuestionNo===row.sourceQuestionNo);check(selected&&!seen.has(row.questionUid),'ITEM_SELECTION');seen.add(row.questionUid);
  const q=bank[row.sourceOrdinal-1],old=oldBank[row.sourceOrdinal-1],it=priorByNumber.get(selected.displayNumber);
  check(hash(P.stable(it))===row.priorCompactItemSha256&&!Object.hasOwn(it,'registrationHold')&&hash(P.stable(q))===row.currentWholeQuestionSha256&&hash(P.stable(old))===row.beforeWholeQuestionSha256,'ITEM_CURRENT_AND_PRIOR_CAS');
  check(/^(?:docs\/operations\/m3-s2-meta-full-20261114|archive-work\/m3s2-4slot-current-20261115)\/exams\/E[0-9]{3}\.4slot\.json$/.test(row.native.path||''),'NATIVE_PUBLIC_PATH');
  const native=gitRef(root,row.native).data;check(native.schemaVersion==='archive-meta-4slot-v0'&&native.sourceArchiveFile===sourceArchiveFile&&Array.isArray(native.items),'NATIVE_SCHEMA');
  const ns=native.items.filter(n=>n.questionUid===row.questionUid&&n.sourceOrdinal===row.sourceOrdinal);check(ns.length===1&&hash(P.stable(ns[0]))===row.nativeRowSha256,'NATIVE_ROW_HASH');
  const bindings=nativeBindings(ns[0],q,it,dict),beforeAssets=assetProof(root,old,d.baselineSourceCommit),currentAssets=liveAssets(root,q);
  if(row.kind===SAME){check(eq(old,q)&&eq(beforeAssets,currentAssets),'UNCHANGED_QUESTION_AND_ASSETS');unchanged++;}
  else if(row.kind===ADDED){
   const changed=[...new Set([...Object.keys(old),...Object.keys(q)])].filter(k=>!eq(old[k],q[k]));
   check(changed.length>0&&changed.every(k=>RENDER_FIELDS.includes(k))&&!old.solutionImage&&typeof q.solutionImage==='string'&&q.solutionImage&&currentAssets.length>beforeAssets.length,'RENDERER_ADDITION_ONLY');
   for(const oldAsset of beforeAssets)check(currentAssets.some(c=>eq(c,oldAsset)),'EXISTING_ASSET_CHANGED');
   const rv=publicRef(root,row.rendererReview).data;
   check(rv.schemaVersion===REVIEW_SCHEMA&&rv.reviewer&&rv.reviewer!==native.judgedBy?.agent&&rv.reviewerRole==='INDEPENDENT_OF_EXTERNAL_SVG_AUTHOR'&&rv.decision==='ACCEPT_19_CURRENT_SOLUTION_RENDERERS_ONLY'&&rv.scope?.newWholeQuestionMathQa===0&&rv.scope?.newSemanticApprovals===0&&rv.scope?.sourceEdits===0&&rv.scope?.assetEdits===0,'RENDERER_INDEPENDENT_REVIEW');
   const rr=(rv.rows||[]).filter(r=>r.questionUid===row.questionUid&&r.sourceOrdinal===row.sourceOrdinal&&r.sourceArchiveFile===sourceArchiveFile);check(rr.length===1,'RENDERER_REVIEW_IDENTITY');const r=rr[0];
   check(r.decision==='ACCEPT_CURRENT_SOLUTION_RENDERER_CONTINUITY'&&r.rendererRepairRequired===false&&r.newSemanticApproval===false&&r.newWholeQuestionMathQa===false&&r.currentWholeQuestionSHA256===row.currentWholeQuestionSha256&&typeof r.observations==='string'&&r.observations.trim()&&P.SHA.test(r.viewedRaster?.sha256||'')&&P.SHA.test(r.actuallyViewedSheet?.sha256||''),'RENDERER_REVIEW_DECISION');
   const proofAssets=(r.assets||[]).map(x=>({path:x.sourcePath,sha256:x.sha256,gitBlobSha1:x.gitBlobSha1})).sort((a,b)=>a.path.localeCompare(b.path));check(eq(proofAssets,currentAssets),'RENDERER_REVIEW_CURRENT_ASSETS');
   const sourceRefs=(rv.sources||[]).filter(s=>s.sourcePath===d.source.path);check(sourceRefs.length===1&&sourceRefs[0].gitBlobSha1===d.source.gitBlobSha&&sourceRefs[0].rawSHA256===d.source.rawSha256,'RENDERER_REVIEW_CURRENT_SOURCE');renderer++;
  }else fail('ITEM_KIND');
  outputItems.push(it);receiptItems.push({questionUid:row.questionUid,sourceOrdinal:row.sourceOrdinal,sourceQuestionNo:row.sourceQuestionNo,compactItemSha256:row.priorCompactItemSha256,quoteBindings:bindings});
  continuity.push({questionUid:row.questionUid,kind:row.kind,beforeWholeQuestionSha256:row.beforeWholeQuestionSha256,currentWholeQuestionSha256:row.currentWholeQuestionSha256,beforeAssets,currentAssets,native:row.native,nativeRowSha256:row.nativeRowSha256});
 }
 check(unchanged>0&&renderer>0,'MIXED_REUSE_SCOPE_REQUIRED');
 outputItems.sort((a,b)=>a.ordinal-b.ordinal);receiptItems.sort((a,b)=>a.sourceOrdinal-b.sourceOrdinal);continuity.sort((a,b)=>a.questionUid.localeCompare(b.questionUid));
 const receipt={schemaVersion:RECEIPT_SCHEMA,requestId:d.requestId,digestAlgorithm:'sha256-stable-json-utf8-v1',source:d.source,dictionary:d.dictionary,submission:d.submission,acceptance:{author:d.author,reviewer:a.reviewer,decision:a.decision,reviewedAtUtc:a.reviewedAtUtc,candidateSha256:hash(inputRaw),publicInputSha256:hash(inputRaw),independentReviewSha256:hash(acceptanceRaw),allowedScope:a.allowedScope,newSemanticApproval:0,otherUidApprovals:0,newMathQa:0},publicEvidence:{input:inputRef,acceptance:acceptanceRef},items:receiptItems,continuity};
 const receiptPath=P.RECEIPTS+d.requestId+'.json',receiptBytes=JSON.stringify(receipt,null,2)+'\n';
 const output={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile,sourceGitBlobSha:d.source.gitBlobSha,dictionaryVersion:d.dictionary.version,evidence:{schemaVersion:EVIDENCE_SCHEMA,receipt:{path:receiptPath,sha256:hash(receiptBytes)}},reviewedBy:{agent:a.reviewer,at:a.reviewedAtUtc,sampled:outputItems.map(i=>i.ordinal)},...d.submission,items:outputItems};
 return{input:d,output,receipt,receiptBytes,compactPath,receiptPath,summary:{sourceCount:1,expectedQuestionCount:bank.length,selected:outputItems.length,unchanged,renderer,unsubmitted:partition.unsubmitted.length,newSemanticApproval:0,newMathQa:0,sourceMutation:0,originalNativeMutation:0,originalVectorMutation:0}};
}
function verifyPublicReceipt(root,compact,receipt){
 check(receipt.schemaVersion===RECEIPT_SCHEMA&&compact.evidence?.schemaVersion===EVIDENCE_SCHEMA,'RECEIPT_TYPE');P.keys(receipt.publicEvidence,['input','acceptance'],'PUBLIC_RECEIPT_EVIDENCE');
 const plan=validate(root,receipt.publicEvidence.input,receipt.publicEvidence.acceptance);check(eq(plan.receipt,receipt)&&eq(plan.output,compact),'PUBLISHED_DERIVATION_MISMATCH');
 const refs=[receipt.publicEvidence.input,receipt.publicEvidence.acceptance,...plan.input.items.filter(r=>r.kind===ADDED).map(r=>r.rendererReview)],unique=new Map();
 for(const ref of refs){check(!unique.has(ref.path)||unique.get(ref.path).sha256===ref.sha256,'PUBLIC_EVIDENCE_PATH_CONFLICT');unique.set(ref.path,ref);}
 return{evidenceDigests:[...unique.values()]};
}
function importReviewedPartial({root,input,acceptance,expectedCompactSha256,write=false}){
 const plan=validate(root,input,acceptance),{serialize}=require('./import-4slot.cjs'),text=serialize(plan.output),dest=P.safe(root,plan.compactPath),rdest=P.safe(root,plan.receiptPath);
 check(expectedCompactSha256===plan.input.expectedCompactSha256,'EXPECTED_CAS_ARGUMENT');const current=fs.readFileSync(dest),replay=current.toString()===text;
 if(!replay)check(hash(current)===expectedCompactSha256,'COMPACT_CAS');
 if(fs.existsSync(rdest))check(fs.readFileSync(rdest,'utf8')===plan.receiptBytes,'EXISTING_RECEIPT_CONFLICT');
 if(replay)check(fs.existsSync(rdest),'REPLAY_RECEIPT_MISSING');
 // Recheck every source/proof/asset before mutation. No native or canonical write.
 const fresh=validate(root,input,acceptance);check(eq(fresh.receipt,plan.receipt),'INPUT_CHANGED_DURING_IMPORT');
 if(!replay)check(hash(fs.readFileSync(dest))===expectedCompactSha256,'COMPACT_CHANGED_DURING_IMPORT');
 if(write&&!replay){for(const [file,bytes]of [[rdest,plan.receiptBytes],[dest,text]]){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file+'.tmp',bytes);fs.renameSync(file+'.tmp',file);}}
 return{status:'PASS_PUBLIC_REVIEWED_PARTIAL_REBIND',...plan.summary,write,replay,compact:{path:plan.compactPath,sha256:hash(text)},receipt:{path:plan.receiptPath,sha256:hash(plan.receiptBytes)},output:plan.output,publicReceipt:plan.receipt};
}
module.exports={INPUT_SCHEMA,ACCEPTANCE_SCHEMA,EVIDENCE_SCHEMA,RECEIPT_SCHEMA,SAME,ADDED,validate,verifyPublicReceipt,importReviewedPartial,assets,nativeBindings};
if(require.main===module){try{const args=process.argv.slice(2),o={root:process.cwd(),write:false};for(let i=0;i<args.length;i++){const k=args[i];if(k==='--write')o.write=true;else if(['--root','--input','--input-sha256','--acceptance','--acceptance-sha256','--expected-compact-sha256'].includes(k))o[k.slice(2)]=args[++i];else fail('CLI_ARGUMENT');}const r=importReviewedPartial({root:o.root,input:{path:o.input,sha256:o['input-sha256']},acceptance:{path:o.acceptance,sha256:o['acceptance-sha256']},expectedCompactSha256:o['expected-compact-sha256'],write:o.write});delete r.output;delete r.publicReceipt;console.log(JSON.stringify(r,null,2));}catch(e){console.error(e.message);process.exitCode=1;}}

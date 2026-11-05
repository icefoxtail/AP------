'use strict';
// Operator-only executor. Production receives compact data and the five tested compatibility fixes only.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),{pathToFileURL}=require('node:url');
const root=process.cwd(),driver=__dirname,out=process.env.REPORT_DIR,opsCommit=process.env.OPS_COMMIT;
const git=(...a)=>cp.execFileSync('git',a,{cwd:root,encoding:'utf8',maxBuffer:128*1024*1024,stdio:['ignore','pipe','pipe']});
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const save=(p,v)=>{const f=path.join(out,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'||Buffer.isBuffer(v)?v:JSON.stringify(v,null,2)+'\n');};
async function main(){
 if(!out||!/^[a-f0-9]{40}$/.test(opsCommit||''))throw Error('EXECUTION_CONTEXT_MISSING');
 const over=JSON.parse(fs.readFileSync(path.join(driver,'bulk-delta-overrides.json'),'utf8')),ref=over.authoringCommit,base=over.baseMain;
 git('merge-base','--is-ancestor',base,'HEAD');
 const native=['tools/4slot/exam-items.cjs','tools/4slot/validate-4slot.cjs','tools/4slot/import-4slot.cjs','tools/4slot/build-4slot-runtime.cjs','tests/item-4slot-runtime.test.cjs'];
 const baseBlob=p=>git('rev-parse',base+':'+p).trim();
 const assertUnchanged=p=>{if(git('hash-object',p).trim()!==baseBlob(p))throw Error('INPUT_CHANGED_SINCE_REVIEW:'+p);};
 for(const p of native)assertUnchanged(p);
 assertUnchanged('docs/architecture/4slot/term-dictionary-v1.5.json');
 const patch=fs.readFileSync(path.join(driver,'bulk-native-compat.patch'));
 if(hash(patch)!=='3430b720fbf297cf2cb3dd4eb40d38d80085a4aa24fd33670d3cd2e3fe23528f')throw Error('PATCH_TRANSPORT_HASH_MISMATCH');
 git('apply','--check',path.join(driver,'bulk-native-compat.patch'));git('apply',path.join(driver,'bulk-native-compat.patch'));
 const R=require(path.join(root,'tools/4slot/build-4slot-runtime.cjs')),V=require(path.join(root,'tools/4slot/validate-4slot.cjs')),I=require(path.join(root,'tools/4slot/import-4slot.cjs')),E=require(path.join(root,'tools/4slot/exam-items.cjs'));
 const {createQuestionIdentityResolver}=await import(pathToFileURL(path.join(root,'archive/tools/intelligence/question-identity-contract.mjs')).href);
 const identity=JSON.parse(fs.readFileSync(path.join(root,'archive/data/question_identity_map.json'),'utf8')),resolver=createQuestionIdentityResolver(identity);
 const uidMap=new Map(identity.records.map(r=>[r.questionUid,r])),joinMap=new Map(identity.records.map(r=>[r.sourceArchiveFile+'#'+r.sourceOrdinal,r]));
 const dict=V.loadDict(root,V.DEFAULT_DICT),lut=V.buildLookup(dict);for(const t of dict.terms)lut.set('#'+t.id,t);
 const prefix='archive-work/4slot-annotate-v1/out/';
 const files=git('ls-tree','-r','-z','--name-only',ref,'--',prefix).split('\0').filter(p=>p.endsWith('.4slot.json')).sort();
 const queue=JSON.parse(git('show',ref+':archive-work/4slot-annotate-v1/QUEUE-original.json'));
 const qm=new Map((queue.list||[]).map(q=>[I.examKey(q.path),q]));
 let rejected=[];try{rejected=JSON.parse(git('show',ref+':archive-work/4slot-annotate-v1/REVIEW-rejected.json'));}catch{}
 if(!Array.isArray(rejected))rejected=rejected.rejected||rejected.list||[];
 const rejection=new Set(rejected.map(r=>I.examKey(r.path)));
 const summary={schemaVersion:'four-slot-bulk-import-validation-v1',authoringCommit:ref,mainBase:git('rev-parse','HEAD').trim(),reviewBase:base,operatorCommit:opsCommit,totalOutputs:files.length,existingPreserved:[],changedFiles:[],failures:[],quotesChecked:0,totalItems:0,independentFullExamReview:false,studentSourceMutation:0,authorEvidenceMutation:0,sourceDeltas:[]};
 const fields=['content','question','choices','answer','solution','image','images','figureSvg','solutionImage','solutionFigureSvg','id','number'];
 const headings=/\[키포인트\]|(?:조건 정리|풀이 방향|정석 풀이|풀이 과정|빠른 풀이 포인트|결론|검산)(?:\s*[:：]|(?=\s*$))/gm;
 const norm=s=>String(s||'').replace(/\\n(?![A-Za-z])/g,'\n').replace(/<br\s*\/?>(?:\s*)/gi,'\n').replace(headings,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
 for(const p of files){
  const raw=git('show',ref+':'+p),evidence=JSON.parse(raw),key=I.examKey(p),source=key+'.js',qentry=qm.get(key),order=qentry?.order;
  if(rejection.has(key))throw Error('AUTHOR_REJECTION_NOT_RESOLVED:'+source);
  if(I.examKey(evidence.sourceArchiveFile)!==key)throw Error('SOURCE_PATH_MISMATCH:'+p);
  const src='archive/exams/'+source,dest='archive/data/item-4slot/'+key+'.4slot.json';assertUnchanged(src);
  const currentRaw=fs.readFileSync(path.join(root,src)),currentBlob=R.blob(currentRaw),bank=R.loadBank(currentRaw.toString('utf8')),lookup=E.itemLookup(E.loadExam(path.join(root,src)));
  const data=structuredClone(evidence),aliases=[];
  for(const it of data.items){const q=lookup.get(String(it.sourceOrdinal));if(!q)throw Error('ALIAS_MISSING:'+source+'#'+it.sourceOrdinal);if(it.sourceOrdinal!==q.ordinal)aliases.push({from:it.sourceOrdinal,to:q.ordinal});it.sourceOrdinal=q.ordinal;}
  summary.totalItems+=data.items.length;
  const originalItems=data.items.map(it=>I.compactItem(it,lut)).sort((a,b)=>a.ordinal-b.ordinal);
  let previous=null;if(fs.existsSync(path.join(root,dest)))previous=JSON.parse(fs.readFileSync(path.join(root,dest),'utf8'));
  if(previous&&stable(previous.items)===stable(originalItems)){
   summary.existingPreserved.push({path:dest,sha256:hash(fs.readFileSync(path.join(root,dest))),items:originalItems.length});continue;
  }
  const oldBlob=qentry?.blob||evidence.sourceGitBlobSha;
  if(currentBlob!==oldBlob){
   const oldText=git('cat-file','blob',oldBlob);if(R.blob(oldText)!==oldBlob)throw Error('BASELINE_BLOB_MISMATCH');
   const old=R.loadBank(oldText);if(old.length!==bank.length)throw Error('CHANGED_CARDINALITY:'+source);
   for(let i=0;i<bank.length;i++){
    const changed=fields.filter(f=>stable(old[i][f]??null)!==stable(bank[i][f]??null));if(!changed.length)continue;
    let kind='REVIEWED_CURRENT_SOURCE_DELTA';
    if(changed.every(f=>f==='solutionImage'))kind='ADDED_SOLUTION_VISUAL_REFERENCE_NOT_NEW_VISUAL_QA';
    else if(changed.every(f=>f==='solution'||f==='solutionImage')&&norm(old[i].solution)===norm(bank[i].solution))kind='PRESENTATION_HEADINGS_ONLY';
    else if(!over.reviewedNonpresentationChanges.some(x=>x.order===order&&x.ordinal===i+1))throw Error('UNREVIEWED_STUDENT_DELTA:'+source+'#'+(i+1));
    summary.sourceDeltas.push({source,order,ordinal:i+1,fields:changed,kind});
   }
  }
  const ops=over.operations.filter(x=>x.order===order);
  for(const op of ops){const it=data.items.find(x=>x.sourceOrdinal===op.ordinal);if(!it)throw Error('OVERRIDE_QID_MISSING');
   if(op.op==='removeTerms'){for(const s of Object.keys(it.slots))it.slots[s]=it.slots[s].filter(e=>!op.terms.includes(e.term));it.format=op.format;it.reasons.method=op.methodReason;}
   else if(op.op==='replaceQuote'){const e=it.slots[op.slot].find(e=>e.term===op.term);if(!e)throw Error('OVERRIDE_TERM_MISSING');for(const k of ['quote','src','evidenceType','justification'])if(op[k]!=null)e[k]=op[k];}
   else if(op.op==='add'){if(it.slots[op.slot].some(e=>e.term===op.term))throw Error('DUPLICATE_OVERRIDE');it.slots[op.slot].push(Object.fromEntries(['term','quote','src','evidenceType','justification'].map(k=>[k,op[k]])));}
   else throw Error('UNKNOWN_OVERRIDE');
  }
  const validation=V.validateData(data,{root,dict,lut});if(validation.fail.length)throw Error('QUOTE_OR_SCHEMA_FAIL:'+source+':'+validation.fail.slice(0,5).join('|'));
  const sampled=[...new Set([...over.reviewedNonpresentationChanges.filter(x=>x.order===order).map(x=>x.ordinal),...(over.reviewedUpdatedExistingSamples.find(x=>x.order===order)?.ordinals||[])])].sort((a,b)=>a-b);
  const compact={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:source,sourceGitBlobSha:currentBlob,dictionaryVersion:dict.dictionaryVersion,
   evidence:{branch:'work/4slot-annotate-v1',commit:ref,path:p,originalSha256:hash(raw),importDelta:{baseSourceGitBlobSha:oldBlob,authoringSnapshot:ref,reviewRecord:{branch:'ops/4slot-bulk-publish-20261105',commit:opsCommit,path:'tools/4slot/bulk-delta-overrides.json',sha256:hash(fs.readFileSync(path.join(driver,'bulk-delta-overrides.json')))}}},
   reviewedBy:{agent:'GPT6_CHAT',at:'2026-11-05',sampled,scope:'TECHNICAL_IMPORT_ALL_AND_TARGETED_CHANGED_SLOTS',independentFullExamReview:false,originalAuthor:data.judgedBy,...(previous?{previousReview:previous.reviewedBy,previousEvidence:previous.evidence}: {})},
   items:data.items.map(it=>I.compactItem(it,lut)).sort((a,b)=>a.ordinal-b.ordinal)};
  const errors=compact.items.flatMap(it=>R.validateItem(it,{terms:new Map(dict.terms.map(t=>[t.id,t]))}));if(errors.length)throw Error('COMPACT_INVALID:'+source+':'+errors.join('|'));
  const proofs=[];
  for(let i=0;i<bank.length;i++){const q=bank[i],id=joinMap.get(source+'#'+(i+1));const official=resolver.resolve({sourceArchiveFile:source,sourceOrdinal:i+1});
   if(!id||official.status!=='RESOLVED_SOURCE_ORDINAL'||official.questionUid!==id.questionUid)throw Error('CANONICAL_RESOLVER_MISMATCH');
   if(q.questionUid&&q.questionUid!==id.questionUid){if(uidMap.has(q.questionUid)||id.sourceFingerprint!==R.identityHash(q)||String(id.sourceQuestionNo)!==E.sourceIdentityNumber(q))throw Error('ORPHAN_UID_PROOF_INVALID:'+source+'#'+(i+1));proofs.push({sourceOrdinal:i+1,sourceQuestionNo:E.sourceIdentityNumber(q),embeddedQuestionUid:q.questionUid,questionUid:id.questionUid,sourceFingerprint:id.sourceFingerprint});}
  }
  if(proofs.length)compact.identityReconciliation={schemaVersion:'4slot-orphan-uid-reconciliation-v1',sourceGitBlobSha:currentBlob,reviewer:'GPT6_CHAT',basis:'OFFICIAL_SOURCE_TUPLE_AND_EXACT_STUDENT_FINGERPRINT',records:proofs};
  const text=I.serialize(compact);fs.mkdirSync(path.dirname(path.join(root,dest)),{recursive:true});fs.writeFileSync(path.join(root,dest),text);
  summary.quotesChecked+=validation.stats.quotes;
  summary.changedFiles.push({path:dest,order,items:compact.items.length,updatedExisting:!!previous,sourceBlob:currentBlob,evidenceSha256:hash(raw),compactSha256:hash(text),aliases,overrides:ops.length,sampled,orphanUidReconciled:proofs.length,warnings:validation.warn.length});
 }
 if(files.length!==358||summary.totalItems!==8129||summary.changedFiles.length!==353||summary.existingPreserved.length!==5||summary.changedFiles.filter(r=>r.updatedExisting).length!==5)throw Error('SNAPSHOT_COUNT_MISMATCH');
 save('import-validation.json',summary);
 const allowed=[...native,...summary.changedFiles.map(r=>r.path)];save('commit-paths.json',allowed);
 git('diff','--check');git('diff','--exit-code','--','archive/exams','archive/data/question_identity_map.json','archive/data/question_metadata.json');
 const changed=[...new Set([...git('diff','--name-only','-z').split('\0'),...git('ls-files','--others','--exclude-standard','-z').split('\0')].filter(Boolean))];
 if(changed.some(p=>!allowed.includes(p))||changed.length!==allowed.length)throw Error('UNEXPECTED_CHANGESET:'+JSON.stringify(changed.filter(p=>!allowed.includes(p))));
 console.log(JSON.stringify({outputs:files.length,items:summary.totalItems,new:348,updated:5,preserved:5,quotesChecked:summary.quotesChecked,sourceMutation:0,authorMutation:0,orphans:summary.changedFiles.reduce((n,r)=>n+r.orphanUidReconciled,0)},null,2));
}
main().catch(e=>{console.error(e.stack);process.exitCode=1;});

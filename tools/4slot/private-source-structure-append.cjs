'use strict';
// Private, reviewer-reconciled source-structure intake. The original author,
// blind revision and root reconciliation retain their actual distinct roles.
const fs=require('node:fs'),path=require('node:path');
const P=require('./partial-submission.cjs');
const V=require('./validate-4slot.cjs');
const CONTRACT='docs/architecture/JS_Archive_Item_4Slot_Term_Contract_CURRENT_v1.md';
const INPUT_SCHEMA='archive-4slot-root-reconciled-source-structure-append-input-v1';
const tuple=r=>({questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,sourceQuestionNo:r.sourceQuestionNo});
const sorted=rows=>[...rows].sort((a,b)=>a.sourceOrdinal-b.sourceOrdinal);
const utc=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}T.*(?:Z|\+00:00)$/.test(x)&&Number.isFinite(Date.parse(x));
function normalizeSourceStructure({root,input,inputRaw,reviewer,privateFile,gitBlobAtHead,compactItem}){
 P.keys(input,['schemaVersion','classification','status','sourceArchiveFile','sourceGitBlobSha','sourceRawSha256','dictionaryVersion','dictionaryGitBlobSha','dictionarySha256','scope','expectedQuestionCount','selected','unsubmitted','priorCompact','priorReceipt','independentReview','rootAcceptance','newMathQa','newSemanticApproval','sourceChanges','otherUidApprovals'],'STRUCTURE_PRIVATE_INPUT_FIELDS');
 if(input.schemaVersion!==INPUT_SCHEMA||input.classification!=='PRIVATE_NOT_FOR_PUBLIC_GIT'||input.status!=='ACCEPTED_SOURCE_STRUCTURE_VECTORS_PENDING_APPEND_IMPORT'||input.newMathQa!==0||input.newSemanticApproval!==0||input.sourceChanges!==0||input.otherUidApprovals!==0)P.fail('STRUCTURE_PRIVATE_INPUT_SCHEMA');
 P.keys(input.priorCompact,['path','sha256','gitBlobSha'],'STRUCTURE_PRIOR_COMPACT_FIELDS');P.keys(input.priorReceipt,['path','sha256'],'STRUCTURE_PRIOR_RECEIPT_FIELDS');
 const trackedPrivate=[];
 const load=ref=>{P.keys(ref,['path','sha256'],'STRUCTURE_PRIVATE_REFERENCE');const f=privateFile(root,ref);trackedPrivate.push({...ref});return f;};
 const review=load(input.independentReview),accepted=load(input.rootAcceptance),r=review.data,a=accepted.data;
 if(r.schemaVersion!=='independent-source-only-four-slot-review-v2'||r.revision!==2||a.schemaVersion!=='root-reconciled-current-source-four-slot-acceptance-v1'||!Number.isSafeInteger(a.revision)||a.revision<1||a.status!=='ACCEPT_FOUR_SLOT_SOURCE_STRUCTURE_ONLY'||r.conclusion?.decision!=='SOURCE_ONLY_INDEPENDENT_FOUR_SLOT_REVIEW_FROZEN_V2'||a.reviewedBy!==reviewer||!r.reviewer||r.reviewer===reviewer||!utc(a.reviewedAt)||!utc(r.createdAt))P.fail('STRUCTURE_REVIEW_AUTHORITY');
 if(a.independentReview?.path!==input.independentReview.path||a.independentReview.sha256!==P.sha(review.raw)||a.independentReview.reviewer!==r.reviewer||a.independentReview.revision!==r.revision)P.fail('STRUCTURE_REVIEW_REFERENCE');
 if(a.reconciliation?.authorVsIndependentExactAgreementClaim!==false||a.reconciliation.initialBlindExactAgreementWithFinalClaim!==false||a.reconciliation.initialRootMethodFreezePreserved!==true||a.originalAuthor?.notBlanketAccepted!==true||!Array.isArray(a.reconciliation.decisions)||!a.reconciliation.decisions.length)P.fail('STRUCTURE_RECONCILIATION_REQUIRED');
 if(r.scope?.mode!=='INDEPENDENT_SOURCE_ONLY'||r.scope.authorityForUnreviewedSlotsOrQuestions!==false||r.scope.nativeSolutionInspected!==false||r.scope.sourceNativeSemanticFullQAApproved!==false||r.scope.answerOrSolutionProduced!==false||r.scope.remoteWrite!==false||r.scope.repositoryMutation!==false||!P.eq(r.scope.slotsReviewed,P.SLOTS)||r.verification?.offsetUnit!=='UTF-16_CODE_UNITS'||r.verification.literalSpansVerifiedAgainstStudentFields!==true||r.verification.withinSlotDuplicateIds!==0||r.verification.thisVerificationIsNotSemanticQAPass!==true)P.fail('STRUCTURE_REVIEW_SCOPE');
 // The upstream human scope label is preserved, never used as a UID selector.
 // Actual preservation is established by the prior compact and receipt CAS.
 if(!/^REQUIRED_EXISTING_[A-Z0-9_]+_MUST_REMAIN_IMMUTABLE$/.test(a.verification?.appendContract||'')||a.verification.nativeOrFullSemanticQaApprovals!==0||a.verification.newSourceAnswerSolution!==0||a.verification.otherUidApprovals!==0||a.verification.sourceWrites!==0||a.verification.termIdsAndKoreanLabelsMatched!==true)P.fail('STRUCTURE_ROOT_SCOPE');
 const original=load({path:a.originalAuthor.path,sha256:a.originalAuthor.sha256});
 const methodFreeze=load({path:a.originalRootMethodFreeze?.path,sha256:a.originalRootMethodFreeze?.sha256});
 if(!original.data.author||!Array.isArray(original.data.items)||typeof methodFreeze.data.schemaVersion!=='string')P.fail('STRUCTURE_ORIGINAL_RECORDS');
 const blindRef=r.inputs?.sourceOnlyInput,blind=load({path:blindRef?.path,sha256:blindRef?.rawSha256});
 if(blind.data.schemaVersion!=='private-current-source-only-method-review-input-v1'||!Array.isArray(blind.data.items))P.fail('STRUCTURE_BLIND_INPUT_SCHEMA');
 const sourcePath='archive/exams/'+input.sourceArchiveFile,sourceRaw=fs.readFileSync(P.safe(root,sourcePath));
 if(P.blob(sourceRaw)!==input.sourceGitBlobSha||P.sha(sourceRaw)!==input.sourceRawSha256||gitBlobAtHead(root,sourcePath)!==input.sourceGitBlobSha)P.fail('STRUCTURE_SOURCE_NOT_CURRENT_HEAD');
 if(original.data.scope?.sourceArchiveFile!==input.sourceArchiveFile||original.data.scope.sourceGitBlob!==input.sourceGitBlobSha||original.data.scope.sourceSha256!==input.sourceRawSha256||original.data.scope.fullDenominator!==input.expectedQuestionCount)P.fail('STRUCTURE_ORIGINAL_FORMAT_SOURCE_BINDING');
 for(const binding of [a.source,r.inputs?.sourceBinding,blind.data]){
  if(binding?.sourceArchiveFile!==input.sourceArchiveFile||binding.sourceGitBlob!==input.sourceGitBlobSha||binding.sourceSha256!==input.sourceRawSha256)P.fail('STRUCTURE_REVIEW_SOURCE_BINDING');
 }
 const dictRaw=fs.readFileSync(P.safe(root,V.DEFAULT_DICT)),dict=JSON.parse(dictRaw),terms=new Map(dict.terms.map(t=>[t.id,t]));
 if(P.blob(dictRaw)!==input.dictionaryGitBlobSha||P.sha(dictRaw)!==input.dictionarySha256||dict.dictionaryVersion!==input.dictionaryVersion||gitBlobAtHead(root,V.DEFAULT_DICT)!==input.dictionaryGitBlobSha||a.dictionary?.rawSha256!==P.sha(dictRaw)||a.dictionary.dictionaryVersion!==dict.dictionaryVersion||a.dictionary.termCount!==dict.terms.length||r.inputs?.officialDictionary?.rawSha256!==P.sha(dictRaw)||r.inputs.officialDictionary.dictionaryVersion!==dict.dictionaryVersion)P.fail('STRUCTURE_DICTIONARY_BINDING');
 const contractRaw=fs.readFileSync(P.safe(root,CONTRACT));
 if(a.contract?.rawSha256!==P.sha(contractRaw)||r.inputs?.contract?.rawSha256!==P.sha(contractRaw)||gitBlobAtHead(root,CONTRACT)!==P.blob(contractRaw))P.fail('STRUCTURE_ROLE_CONTRACT_BINDING');
 const identityRaw=fs.readFileSync(P.safe(root,'archive/data/question_identity_map.json')),identity=JSON.parse(identityRaw);
 const d={sourceArchiveFile:input.sourceArchiveFile,sourceGitBlobSha:input.sourceGitBlobSha,...P.scopeFields(input)},p=P.partition(root,d,{sourceRaw,identity});
 const wanted=sorted(input.selected);
 if(!P.eq(input.selected,wanted)||!P.eq(r.scope.sourceOrdinals,wanted.map(x=>x.sourceOrdinal))||!Array.isArray(a.items)||a.items.length!==wanted.length||!Array.isArray(r.items)||r.items.length!==wanted.length||blind.data.items.length!==wanted.length||a.verification.approvedUidCount!==wanted.length)P.fail('STRUCTURE_ACCEPTED_SELECTION');
 const lut=V.buildLookup(dict);for(const term of dict.terms)lut.set('#'+term.id,term);
 const items=[],compactItems=[],receiptItems=[];let literalSpans=0;
 for(const selected of wanted){
  const acceptedRows=a.items.filter(x=>P.eq(tuple(x),selected));if(acceptedRows.length!==1)P.fail('STRUCTURE_ROOT_ITEM');const ar=acceptedRows[0];
  const pointer=/^\/items\/(0|[1-9][0-9]*)$/.exec(ar.reviewPointer||''),ri=pointer&&r.items[Number(pointer[1])];
  if(!ri||!P.eq(tuple(ri),selected)||ar.newFourSlotReviewAccepted!==true||ar.nativeOrFullSemanticApproval!==false||ar.evidenceClassification!==P.STRUCTURE_CLASS||ri.decision!=='SOURCE_ONLY_FOUR_SLOT_RECOMMENDATION'||ri.nativeSolutionInspected!==false||ri.fullSemanticQAApproved!==false||!P.eq(ar.slots,ri.slotTermIds))P.fail('STRUCTURE_ROOT_VECTOR_BINDING');
  const q=p.bank[selected.sourceOrdinal-1],blindItems=blind.data.items.filter(x=>P.eq(tuple(x),selected));if(blindItems.length!==1)P.fail('STRUCTURE_BLIND_ITEM');
  const bi=blindItems[0];
  if(!Array.isArray(bi.studentImageRefs)||bi.studentImageRefs.length||!bi.student||Object.hasOwn(bi.student,'answer')||Object.hasOwn(bi.student,'solution'))P.fail('STRUCTURE_BLIND_IMAGE_OR_PRIVATE_SOLUTION');
  const allowedStudent=new Set(['id','number','type','score','question','content','choices']);
  for(const [k,v]of Object.entries(bi.student)){if(!allowedStudent.has(k)||!P.eq(v,q[k]))P.fail('STRUCTURE_BLIND_SOURCE_VALUE');}
  if(!P.eq(bi.student.choices,q.choices)||String(bi.student.question??bi.student.content??'')!==String(q.content||q.question||'')||q.type!=='CHOICE'||!Array.isArray(q.choices)||q.choices.length<2)P.fail('STRUCTURE_SOURCE_FORMAT');
  const hasFigure=['image','images','figureSvg','svg'].some(k=>Array.isArray(q[k])?q[k].length:!!q[k]);
  if(hasFigure||/<(?:img|svg)\b|(?:archive\/)?assets\//i.test(JSON.stringify([q.content||q.question||'',q.choices])))P.fail('STRUCTURE_CURRENT_FIGURE_OUTSIDE_REVIEW');
  const authorRows=original.data.items.filter(x=>x.questionUid===selected.questionUid&&x.sourceOrdinal===selected.sourceOrdinal);
  if(authorRows.length!==1||authorRows[0].provisionalItem?.format!=='단일 정답')P.fail('STRUCTURE_EXISTING_FORMAT');
  const item={...selected,format:authorRows[0].provisionalItem.format,slots:{}},bindings=[];
  for(const slot of P.SLOTS){
   const entries=ri.slots?.[slot];if(!Array.isArray(entries)||!P.eq(entries.map(e=>e.termId),ar.slots[slot])||new Set(entries.map(e=>e.termId)).size!==entries.length)P.fail('STRUCTURE_TERM_VECTOR');
   item.slots[slot]=entries.map((entry,entryIndex)=>{
    const term=terms.get(entry.termId);if(!Number.isSafeInteger(entry.termId)||!term||term.ko!==entry.term||term.kind!==entry.dictionaryKind||!['ACTIVE',undefined].includes(term.status))P.fail('STRUCTURE_ACTIVE_TERM');
    if(!Array.isArray(entry.literalSpans)||!entry.literalSpans.length)P.fail('STRUCTURE_PRIVATE_SPANS_REQUIRED');
    const spans=entry.literalSpans.map(s=>{
     if(!['stem','choices'].includes(s.src)||s.offsetUnit!=='UTF-16_CODE_UNITS'||s.exactLiteralMatch!==true||!Number.isSafeInteger(s.start)||!Number.isSafeInteger(s.end)||s.start<0||s.end<=s.start||typeof s.quote!=='string'||!s.quote.length||s.fieldPath!==(s.src==='stem'?'student.question':`student.choices[${s.choiceIndex}]`))P.fail('STRUCTURE_PRIVATE_SPAN');
     const text=P.textFor(q,s);const split=i=>i>0&&i<text.length&&/[\uD800-\uDBFF]/.test(text[i-1])&&/[\uDC00-\uDFFF]/.test(text[i]);
     if(s.end>text.length||split(s.start)||split(s.end)||text.slice(s.start,s.end)!==s.quote)P.fail('STRUCTURE_PRIVATE_SPAN_NOT_CURRENT');literalSpans++;
     return {src:s.src,...(s.src==='choices'?{choiceIndex:s.choiceIndex}:{}),offsetCodepoints:[...text.slice(0,s.start)].length,lengthCodepoints:[...s.quote].length,quoteSha256:P.sha(s.quote)};
    });
    const binding={slot,entryIndex,termId:entry.termId,classification:entry.classification,spans};
    if(slot==='method'){
     if(entry.evidenceType!=='IMPLIED'||entry.inferenceBasis!=='STUDENT_SOURCE_STRUCTURE_ONLY'||entry.methodUseLiterallyExplicit!==false||typeof entry.justification!=='string'||!entry.justification.trim())P.fail('STRUCTURE_PRIVATE_METHOD_NOT_IMPLIED');
     Object.assign(binding,{evidenceType:entry.evidenceType,inferenceBasis:entry.inferenceBasis,methodUseLiterallyExplicit:entry.methodUseLiterallyExplicit,conceptNameAppearsLiterally:entry.conceptNameAppearsLiterally,justificationSha256:P.sha(entry.justification)});
    }
    bindings.push(binding);const first=entry.literalSpans[0];
    return {term:entry.term,src:first.src,quote:first.quote,...(slot==='method'?{evidenceType:entry.evidenceType,justification:entry.justification}:{})};
   });
  }
  const compact=compactItem(item,lut,new Map([[String(selected.sourceOrdinal),{ordinal:p.canonical[selected.sourceOrdinal-1].displayNumber}]]));
  if(compact.candidates.length||!P.eq(Object.fromEntries(P.SLOTS.map(s=>[s,compact[s]])),ar.slots))P.fail('STRUCTURE_COMPACT_VECTOR');
  P.verifyStructureBindings(bindings,compact,q);items.push(item);compactItems.push(compact);
  receiptItems.push({...selected,compactItemSha256:P.sha(P.stable(compact)),sourceStructureBindings:bindings});
 }
 if(a.verification.literalSpansIndependentlyRechecked!==literalSpans)P.fail('STRUCTURE_ROOT_SPAN_COVERAGE');
 const rich={schemaVersion:'archive-meta-4slot-v0',sourceArchiveFile:input.sourceArchiveFile,sourceGitBlobSha:input.sourceGitBlobSha,dictionaryVersion:input.dictionaryVersion,judgedBy:{agent:r.reviewer,at:r.createdAt},...P.scopeFields(input),items,candidates:[],selfCheck:{partialScope:true,sourceStructureOnly:true}};
 const validation=V.validateData(rich,{root,dict,lut});if(validation.fail.length)P.fail('STRUCTURE_VALIDATION_FAILED:'+validation.fail.length);
 return {input,p,sourcePath,sourceRaw,identityRaw,dictRaw,contractRaw,trackedPrivate,compactItems,receiptItems,validation,literalSpans,acceptance:{author:r.reviewer,reviewer,decision:P.STRUCTURE_DECISION,reviewedAtUtc:a.reviewedAt,privateInputSha256:P.sha(inputRaw),independentReviewSha256:P.sha(review.raw),rootAcceptanceSha256:P.sha(accepted.raw),originalAuthorSha256:P.sha(original.raw),originalRootMethodFreezeSha256:P.sha(methodFreeze.raw),sourceOnlyInputSha256:P.sha(blind.raw),contractSha256:P.sha(contractRaw),allowedScope:'ADDED_FOUR_SLOT_VECTORS_ONLY',newSemanticApproval:0,otherUidApprovals:0,newMathQa:0,authorVsIndependentExactAgreementClaim:false,initialBlindExactAgreementWithFinalClaim:false,evidenceClass:P.STRUCTURE_CLASS}};
}
function importPrivateSourceStructureAppend(options){
 const {root,input,inputRaw,reviewer,requestId,expectedCompactSha256,serialize,write,privateFile,gitBlobAtHead}=options;
 if(!P.SHA.test(expectedCompactSha256||''))P.fail('APPEND_EXPLICIT_EXISTING_COMPACT_CAS_REQUIRED');
 const n=normalizeSourceStructure(options),destPath='archive/data/item-4slot/'+input.sourceArchiveFile.replace(/\.js$/,'.4slot.json'),dest=P.safe(root,destPath);
 if(input.priorCompact.path!==destPath||!P.SHA.test(input.priorCompact.sha256||'')||!P.GIT.test(input.priorCompact.gitBlobSha||''))P.fail('APPEND_INPUT_PRIOR_COMPACT');
 const currentRaw=fs.readFileSync(dest);if(P.sha(currentRaw)!==expectedCompactSha256)P.fail('COMPACT_CAS_MISMATCH');
 const receiptPath=P.RECEIPTS+requestId+'.json',snapshotPath=P.RECEIPTS+requestId+'.prior-compact.json',receiptDest=P.safe(root,receiptPath),snapshotDest=P.safe(root,snapshotPath);
 const replay=P.sha(currentRaw)!==input.priorCompact.sha256;
 const priorRaw=replay?fs.readFileSync(snapshotDest):currentRaw;
 if(P.sha(priorRaw)!==input.priorCompact.sha256||P.blob(priorRaw)!==input.priorCompact.gitBlobSha)P.fail('APPEND_PRIOR_COMPACT_SHA');
 const prior=JSON.parse(priorRaw);
 if(prior.sourceArchiveFile!==input.sourceArchiveFile||prior.sourceGitBlobSha!==input.sourceGitBlobSha||prior.dictionaryVersion!==input.dictionaryVersion||!P.eq(prior.evidence?.receipt,input.priorReceipt))P.fail('APPEND_INPUT_PRIOR_BINDING');
 const prev=P.publicEvidence(root,prior,{bank:n.p.bank,identity:JSON.parse(n.identityRaw),sourceRaw:n.sourceRaw,dictRaw:n.dictRaw,dictPath:V.DEFAULT_DICT});
 if(prev.evidenceDigests.some(x=>x.path===receiptPath||x.path===snapshotPath))P.fail('APPEND_REQUEST_ID_REUSED');
 if(input.selected.some(x=>prior.selected.some(y=>y.questionUid===x.questionUid)||!prior.unsubmitted.some(y=>P.eq(x,y))))P.fail('APPEND_OVERLAP_OR_NOT_PREVIOUSLY_UNSUBMITTED');
 const selected=sorted([...prior.selected,...input.selected]),unsubmitted=sorted(prior.unsubmitted.filter(x=>!input.selected.some(y=>P.eq(x,y))));
 const submission={scope:P.SCOPE,expectedQuestionCount:n.p.bank.length,selected,unsubmitted};
 const output={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:input.sourceArchiveFile,sourceGitBlobSha:input.sourceGitBlobSha,dictionaryVersion:input.dictionaryVersion,evidence:null,reviewedBy:{agent:reviewer,at:n.acceptance.reviewedAtUtc,sampled:selected.map(x=>n.p.canonical[x.sourceOrdinal-1].displayNumber).sort((a,b)=>a-b)},...submission,items:[...prior.items,...n.compactItems].sort((a,b)=>a.ordinal-b.ordinal)};
 P.partition(root,output,{bank:n.p.bank,identity:JSON.parse(n.identityRaw),sourceRaw:n.sourceRaw});
 const receipt={schemaVersion:P.APPEND_RECEIPT_SCHEMA,requestId,digestAlgorithm:'sha256-stable-json-utf8-v1',source:{path:n.sourcePath,gitBlobSha:input.sourceGitBlobSha,rawSha256:P.sha(n.sourceRaw)},dictionary:{path:V.DEFAULT_DICT,version:input.dictionaryVersion,gitBlobSha:P.blob(n.dictRaw),rawSha256:P.sha(n.dictRaw)},submission,append:{kind:'APPEND_DISJOINT_PARTIAL_UIDS',priorCompact:{path:snapshotPath,sha256:P.sha(priorRaw),gitBlobSha:P.blob(priorRaw)},priorReceipt:input.priorReceipt,preservedSelected:prior.selected,addedSelected:input.selected,priorSelectedCount:prior.selected.length,addedCount:input.selected.length,cumulativeSelectedCount:selected.length,expectedQuestionCount:n.p.bank.length,unsubmittedCount:unsubmitted.length,canonicalPartitionSha256:P.sha(P.stable(n.p.canonical.map(tuple)))},acceptance:n.acceptance,items:n.receiptItems};
 const receiptBytes=JSON.stringify(receipt,null,2)+'\n';output.evidence={schemaVersion:P.EVIDENCE_SCHEMA,receipt:{path:receiptPath,sha256:P.sha(receiptBytes)}};const text=serialize(output);
 const head=gitBlobAtHead(root,destPath);if(head!==input.priorCompact.gitBlobSha&&(!replay||head!==P.blob(text)))P.fail('APPEND_PRIOR_COMPACT_NOT_IN_HEAD');
 if(replay&&currentRaw.toString()!==text)P.fail('APPEND_REPLAY_COMPACT_CONFLICT');
 for(const [file,bytes]of [[snapshotDest,priorRaw],[receiptDest,receiptBytes]])if(fs.existsSync(file)&&!fs.readFileSync(file).equals(Buffer.from(bytes)))P.fail('APPEND_EXISTING_EVIDENCE_CONFLICT');
 if(replay&&(!fs.existsSync(snapshotDest)||!fs.existsSync(receiptDest)))P.fail('APPEND_REPLAY_EVIDENCE_MISSING');
 // Before any writes, recheck every mutable input and every ancestor receipt.
 if(P.sha(fs.readFileSync(dest))!==expectedCompactSha256||!fs.readFileSync(P.safe(root,n.sourcePath)).equals(n.sourceRaw)||!fs.readFileSync(P.safe(root,V.DEFAULT_DICT)).equals(n.dictRaw)||!fs.readFileSync(P.safe(root,CONTRACT)).equals(n.contractRaw)||!fs.readFileSync(P.safe(root,'archive/data/question_identity_map.json')).equals(n.identityRaw))P.fail('APPEND_INPUT_CHANGED_DURING_IMPORT');
 for(const ref of [...n.trackedPrivate])privateFile(root,ref);
 for(const ref of prev.evidenceDigests)if(P.sha(fs.readFileSync(P.safe(root,ref.path)))!==ref.sha256)P.fail('APPEND_ANCESTOR_CHANGED_DURING_IMPORT');
 if(write&&!replay){
  // Immutable evidence is written first; the single live compact is the commit
  // point. An interrupted write cannot expose a compact missing its receipts.
  for(const [file,bytes]of [[snapshotDest,priorRaw],[receiptDest,receiptBytes],[dest,text]]){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file+'.tmp',bytes);fs.renameSync(file+'.tmp',file);}
 }
 if(write)P.publicEvidence(root,output);
 return {status:'PASS_PARTIAL_APPEND',scope:P.SCOPE,expectedQuestionCount:n.p.bank.length,preserved:prior.selected.length,added:input.selected.length,selected:selected.length,unsubmitted:unsubmitted.length,completeExam:false,write,replay,newSemanticApproval:0,sourceMutation:0,compact:{path:destPath,sha256:P.sha(text),bytes:Buffer.byteLength(text)},receipt:{path:receiptPath,sha256:P.sha(receiptBytes),bytes:Buffer.byteLength(receiptBytes)},priorCompactSnapshot:{path:snapshotPath,sha256:P.sha(priorRaw),bytes:priorRaw.length},validation:{fail:0,warn:n.validation.warn.length,quotes:n.validation.stats.quotes,sourceStructureSpans:n.literalSpans},output,publicReceipt:receipt};
}
module.exports={INPUT_SCHEMA,CONTRACT,normalizeSourceStructure,importPrivateSourceStructureAppend};

'use strict';
// Offline intake of an actually read private author/independent-review pair.
// Only the compact IDs and a safe, publicly re-checkable receipt are returned.
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const P=require('./partial-submission.cjs');
const {validateData,buildLookup,loadDict,DEFAULT_DICT}=require('./validate-4slot.cjs');
function privateFile(root,ref){
 if(!ref||typeof ref.path!=='string'||!P.SHA.test(ref.sha256||''))P.fail('PRIVATE_REFERENCE');
 const f=fs.realpathSync(ref.path),r=fs.realpathSync(root);
 if(f===r||f.startsWith(r+path.sep))P.fail('PRIVATE_INPUT_MUST_BE_OUTSIDE_REPOSITORY');
 const raw=fs.readFileSync(f);if(P.sha(raw)!==ref.sha256)P.fail('PRIVATE_REFERENCE_SHA');return {raw,data:JSON.parse(raw)};
}
function gitBlobAtHead(root,rel){try{return execFileSync('git',['-C',root,'rev-parse','--verify','HEAD:'+rel],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();}catch{P.fail('PUBLIC_INPUT_NOT_IN_HEAD');}}
function literalBinding(q,e,slot,entryIndex,termId){
 if(typeof e.quote!=='string'||!e.quote.length)P.fail('PRIVATE_QUOTE_EMPTY');
 const candidates=e.src==='choices'?(q.choices||[]).map((text,i)=>({text:String(text),choiceIndex:i})):[{text:P.textFor(q,e)}];
 const found=candidates.map(x=>({...x,index:x.text.indexOf(e.quote)})).find(x=>x.index>=0);if(!found)P.fail('PRIVATE_QUOTE_NOT_CURRENT');
 const out={slot,entryIndex,termId,src:e.src,...(e.src==='choices'?{choiceIndex:found.choiceIndex}:{}),offsetCodepoints:[...found.text.slice(0,found.index)].length,lengthCodepoints:[...e.quote].length,quoteSha256:P.sha(e.quote)};
 if(slot==='method'){out.evidenceType=e.evidenceType;if(e.evidenceType==='IMPLIED'){if(typeof e.justification!=='string'||!e.justification.trim())P.fail('PRIVATE_JUSTIFICATION_REQUIRED');out.justificationSha256=P.sha(e.justification);}}
 return out;
}
// A second, explicitly typed private intake. The original five-item author file
// and both independent reviews remain immutable. Only their selected, accepted
// row is projected into the existing one-item import contract in memory.
const CURRENT_INPUT_SCHEMA='m1-current-source-accepted-private-vector-input-v1';
function normalizeCurrentSourceAcceptance(root,input,author,review,reviewer){
 const c=author.data,v=review.data,it=input.items[0];
 if(!Array.isArray(input.selected)||input.selected.length!==1||!Array.isArray(input.unsubmitted)||input.unsubmitted.length!==input.sourceDenominator-1||typeof input.preparedAtUtc!=='string'||!Number.isFinite(Date.parse(input.preparedAtUtc)))P.fail('CURRENT_PRIVATE_INPUT_SCOPE');
 if(c.schemaVersion!=='m1s1-missing-method-author-five-v1'||c.recordKind!=='PRIVATE_NON_OPERATIONAL_AUTHOR_DRAFT'||!Array.isArray(c.items)||c.items.length!==5||c.author!==input.author.identity||v.schemaVersion!=='m1-current-explicit-source-vector-independent-review-v1'||v.status!=='ACCEPT_EXACT_CURRENT_VECTOR'||input.independentReview.decision!==v.status||v.reviewer!==reviewer||input.independentReview.identity!==reviewer||c.author===reviewer||v.authorSha256!==P.sha(author.raw))P.fail('CURRENT_PRIVATE_REVIEW_AUTHORITY');
 const matches=c.items.map((row,index)=>({row,index})).filter(x=>x.row.questionUid===it.questionUid&&x.row.sourceOrdinal===it.sourceOrdinal);
 if(matches.length!==1||input.author.candidateItemPointer!==`/items/${matches[0].index}`||!P.eq(matches[0].row.provisionalItem,it)||v.questionUid!==it.questionUid||v.sourceOrdinal!==it.sourceOrdinal||!P.eq(matches[0].row.canonicalTermIdVector,v.approvedTermIdVector))P.fail('CURRENT_PRIVATE_AUTHOR_SELECTION');
 if(v.otherThreeRolesIndependentlyChecked!==true||v.legacyProposedVectorMisrepresentedAsApproved!==false||v.newAnswerOrSolution!==0||v.fullMathReviewRepeated!==false||v.sourceChanges!==0||v.nativeApprovalChanges!==0||v.selected!==1||v.unsubmitted!==input.sourceDenominator-1||v.expectedQuestionCount!==input.sourceDenominator)P.fail('CURRENT_PRIVATE_REVIEW_SCOPE');
 if(v.sourceArchiveFile!==input.sourceArchiveFile||v.sourceGitBlob!==input.sourceGitBlobSha||v.sourceSha256!==input.sourceRawSha256||c.scope?.sourceArchiveFile!==input.sourceArchiveFile||c.scope.sourceGitBlob!==input.sourceGitBlobSha||c.scope.sourceSha256!==input.sourceRawSha256||c.scope.fullDenominator!==input.sourceDenominator||c.dictionaryRef?.version!==input.dictionaryVersion||c.dictionaryRef.gitBlob!==input.dictionaryGitBlob||c.dictionaryRef.sha256!==v.dictionarySha256)P.fail('CURRENT_PRIVATE_REVIEW_BINDING');
 const tuples=rows=>(rows||[]).map(r=>{if(typeof r.sourceQuestionNo!=='string'||!r.sourceQuestionNo)P.fail('CURRENT_PRIVATE_SOURCE_NUMBER_REQUIRED');return{questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,sourceQuestionNo:r.sourceQuestionNo};}).sort((a,b)=>a.sourceOrdinal-b.sourceOrdinal);
 if(!Array.isArray(c.scope.selected)||!Array.isArray(c.scope.unsubmitted)||!P.eq(tuples([...c.scope.selected,...c.scope.unsubmitted]),tuples([...input.selected,...input.unsubmitted]))||!c.scope.selected.some(x=>P.eq(tuples([x]),tuples(input.selected))))P.fail('CURRENT_PRIVATE_AUTHOR_PARTITION');
 const method=privateFile(root,input.independentMethodReview),m=method.data;
 if(v.independentMethodReviewSha256!==P.sha(method.raw)||m.schemaVersion!=='m1-current-source-method-only-root-review-v1'||m.status!=='ACCEPT_METHOD_SLOT_ONLY_AWAIT_REUSED_THREE_SLOT_BINDINGS'||m.reviewer!==reviewer||m.authorVectorReadBeforeIndependentDecision!==false||m.newAnswerOrSolution!==0||m.newFullMathReview!==0||m.otherSlotApprovals!=='REUSE_ONLY_AFTER_EXACT_PRIOR_VECTOR_AND_CURRENT_SOURCE_BINDING'||m.evidenceClass!=='EXPLICIT_CURRENT_STEM_PROCEDURE'||m.questionUid!==it.questionUid||m.sourceOrdinal!==it.sourceOrdinal||m.sourceArchiveFile!==input.sourceArchiveFile||m.sourceGitBlob!==input.sourceGitBlobSha||m.sourceSha256!==input.sourceRawSha256||m.dictionarySha256!==v.dictionarySha256||!P.eq(m.methodTermIds,v.approvedTermIdVector.method))P.fail('CURRENT_PRIVATE_METHOD_REVIEW');
 // The original reviews did not record a UTC acceptance time. Do not invent one
 // or relabel either original. A separate reviewer-issued import acceptance
 // binds them, the original author bytes, the exact vector and the full scope.
 const acceptance=privateFile(root,input.importAcceptance),n=acceptance.data;
 const vectorSha=P.sha(P.stable(v.approvedTermIdVector));
 if(n.schemaVersion!=='archive-4slot-current-source-import-acceptance-v1'||n.decision!=='ACCEPT_EXISTING_CURRENT_SOURCE_VECTOR_FOR_PRIVATE_PARTIAL_IMPORT'||n.reviewer!==reviewer||n.authorSha256!==P.sha(author.raw)||n.vectorReviewSha256!==P.sha(review.raw)||n.methodReviewSha256!==P.sha(method.raw)||n.questionUid!==it.questionUid||n.sourceOrdinal!==it.sourceOrdinal||n.sourceArchiveFile!==input.sourceArchiveFile||n.sourceGitBlobSha!==input.sourceGitBlobSha||n.sourceRawSha256!==input.sourceRawSha256||n.dictionarySha256!==v.dictionarySha256||n.canonicalTermIdVectorSha256!==vectorSha||!P.eq(n.scope,{expectedQuestionCount:input.sourceDenominator,selected:1,unsubmitted:input.sourceDenominator-1})||n.allowedScope!=='FOUR_SLOT_VECTOR_ONLY'||n.newSemanticApproval!==0||n.otherUidApprovals!==0||n.newMathQa!==0||n.sourceChanges!==0||typeof n.acceptedAtUtc!=='string'||!/^\d{4}-\d{2}-\d{2}T.*(?:Z|\+00:00)$/.test(n.acceptedAtUtc)||!Number.isFinite(Date.parse(n.acceptedAtUtc)))P.fail('CURRENT_PRIVATE_IMPORT_ACCEPTANCE');
 const entries=P.SLOTS.flatMap(slot=>(it.slots?.[slot]||[]).map((e,index)=>({slot,index,sha:P.sha(e.quote)})));
 if(!Array.isArray(v.quoteChecks)||v.quoteChecks.length!==entries.length)P.fail('CURRENT_PRIVATE_QUOTE_REVIEW_COVERAGE');
 const used=new Set(),quoteChecks=entries.map(e=>{const found=v.quoteChecks.map((q,i)=>({q,i})).filter(x=>x.q.slot===e.slot&&x.q.quoteSha256===e.sha&&x.q.foundInActualSource===true&&!used.has(x.i));if(found.length!==1)P.fail('CURRENT_PRIVATE_QUOTE_REVIEW_MISMATCH');used.add(found[0].i);return{candidateEntryPointer:`/provisionalItem/slots/${e.slot}/${e.index}`,literalPresent:true,quoteSha256:e.sha};});
 return {c:{author:c.author,authoredAtUtc:input.preparedAtUtc,provisionalItem:it,canonicalTermIdVector:v.approvedTermIdVector,vectorSha256:vectorSha},a:{schemaVersion:'normalized-current-source-vector-acceptance-v1',author:c.author,reviewer,decision:P.DECISION,reviewedAtUtc:n.acceptedAtUtc,candidateSha256:P.sha(author.raw),questionUid:it.questionUid,sourceOrdinal:it.sourceOrdinal,sourceBlob:v.sourceGitBlob,dictionaryBlob:input.dictionaryGitBlob,vectorSha256:vectorSha,scope:{reviewedVectorCount:1,otherUidApprovals:0,sourceExamDenominator:input.sourceDenominator,unsubmittedCount:input.sourceDenominator-1},approvalBoundaries:{fourSlotVectorReviewAccepted:true,fullSemanticFinalQaIssued:false,nativeMetadataApprovalIssued:false,newMathQa:0,sourceChanges:0},quoteChecks,validatorBoundary:{sourceQuoteFailures:0,currentSourceQuoteChecks:entries.length}},dictionarySha256:v.dictionarySha256};
}
function importPrivatePartial({root,inputPath,reviewer,requestId,expectedCompactSha256,compactItem,serialize,write=false}){
 root=path.resolve(root);
 if(!/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(requestId||'')||!reviewer||!['NONE'].includes(expectedCompactSha256)&&!P.SHA.test(expectedCompactSha256||''))P.fail('EXPLICIT_IMPORT_ARGUMENTS_REQUIRED');
 const raw=fs.readFileSync(inputPath),input=privateFile(root,{path:inputPath,sha256:P.sha(raw)}).data;
 const currentSourceInput=input.schemaVersion===CURRENT_INPUT_SCHEMA;
 if((!currentSourceInput&&input.schemaVersion!=='q22-accepted-private-vector-input-v1')||input.classification!=='PRIVATE_NOT_FOR_PUBLIC_GIT'||input.status!=='ACCEPTED_VECTOR_ONLY_PENDING_FORMAL_PARTIAL_SUBMISSION_CONTRACT'||input.newMathQa!==0||input.newSemanticApproval!==0||input.sourceChanges!==0||input.unsubmittedApprovals!==0||input.unsubmittedRegistrations!==0||!Array.isArray(input.items)||input.items.length!==1||input.candidates?.length!==0)P.fail('PRIVATE_ACCEPTED_INPUT_SCHEMA');
 const author=privateFile(root,{path:input.author?.candidatePath,sha256:input.author?.candidateSha256});
 const review=privateFile(root,input.independentReview),normalized=currentSourceInput?normalizeCurrentSourceAcceptance(root,input,author,review,reviewer):null,a=normalized?.a||review.data,c=normalized?.c||author.data,it=input.items[0];
 if((currentSourceInput?a.schemaVersion!=='normalized-current-source-vector-acceptance-v1':a.schemaVersion!=='q22-private-independent-current-source-vector-review-v2')||a.decision!==P.DECISION||(!currentSourceInput&&(input.independentReview.decision!==a.decision||input.independentReview.reviewedAtUtc!==a.reviewedAtUtc))||a.author!==input.author.identity||c.author!==a.author||a.reviewer!==reviewer||input.independentReview.identity!==reviewer||a.author===a.reviewer||a.candidateSha256!==P.sha(author.raw)||!P.eq(c.provisionalItem,it)||a.questionUid!==it.questionUid||a.sourceOrdinal!==it.sourceOrdinal||a.vectorSha256!==c.vectorSha256)P.fail('PRIVATE_INDEPENDENT_ACCEPTANCE_MISMATCH');
 if(a.approvalBoundaries?.fourSlotVectorReviewAccepted!==true||a.approvalBoundaries.fullSemanticFinalQaIssued!==false||a.approvalBoundaries.nativeMetadataApprovalIssued!==false||a.approvalBoundaries.newMathQa!==0||a.approvalBoundaries.sourceChanges!==0||a.scope?.reviewedVectorCount!==1||a.scope.otherUidApprovals!==0)P.fail('PRIVATE_ACCEPTANCE_SCOPE');
 const sourcePath='archive/exams/'+input.sourceArchiveFile,sourceRaw=fs.readFileSync(P.safe(root,sourcePath)),bank=P.loadBank(sourceRaw);
 if(P.blob(sourceRaw)!==input.sourceGitBlobSha||a.sourceBlob!==input.sourceGitBlobSha||gitBlobAtHead(root,sourcePath)!==input.sourceGitBlobSha||P.sha(sourceRaw)!==input.sourceRawSha256)P.fail('PRIVATE_SOURCE_NOT_CURRENT_HEAD');
 const dictRaw=fs.readFileSync(P.safe(root,DEFAULT_DICT)),dict=loadDict(root,DEFAULT_DICT),lut=buildLookup(dict);for(const term of dict.terms)lut.set('#'+term.id,term);
 if(dict.dictionaryVersion!==input.dictionaryVersion||P.blob(dictRaw)!==input.dictionaryGitBlob||a.dictionaryBlob!==input.dictionaryGitBlob||gitBlobAtHead(root,DEFAULT_DICT)!==input.dictionaryGitBlob||currentSourceInput&&P.sha(dictRaw)!==normalized.dictionarySha256)P.fail('PRIVATE_DICTIONARY_NOT_CURRENT_HEAD');
 const {sourceIdentityNumber}=require('./exam-items.cjs');
 const tuples=rows=>(rows||[]).map(r=>{const no=sourceIdentityNumber(bank[r.sourceOrdinal-1]||{});if(r.sourceQuestionNo!=null&&String(r.sourceQuestionNo)!==no)P.fail('PRIVATE_SOURCE_NUMBER');return {questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,sourceQuestionNo:no};});
 const d={schemaVersion:'archive-meta-4slot-v0',sourceArchiveFile:input.sourceArchiveFile,sourceGitBlobSha:input.sourceGitBlobSha,dictionaryVersion:input.dictionaryVersion,judgedBy:{agent:a.author,at:c.authoredAtUtc},scope:P.SCOPE,expectedQuestionCount:input.sourceDenominator,selected:tuples(input.selected),unsubmitted:tuples(input.unsubmitted),items:input.items,candidates:[],selfCheck:{partialScope:true}};
 const scope=P.partition(root,d,{bank,sourceRaw});P.selectedItems(d,scope);
 if(a.scope.sourceExamDenominator!==bank.length||a.scope.unsubmittedCount!==scope.unsubmitted.length)P.fail('PRIVATE_ACCEPTANCE_DENOMINATOR');
 const validation=validateData(d,{root,dict,lut});if(validation.fail.length)P.fail('PRIVATE_VALIDATION_FAILED:'+validation.fail.length);
 const selected=scope.selected[0],q=bank[selected.sourceOrdinal-1],lookup=new Map([[String(it.sourceOrdinal),{ordinal:selected.displayNumber}]]),compact=compactItem(it,lut,lookup);
 if(!P.eq(Object.fromEntries(P.SLOTS.map(s=>[s,compact[s]])),c.canonicalTermIdVector))P.fail('PRIVATE_VECTOR_MISMATCH');
 const acceptedCompact=privateFile(root,input.publicCompactItem);if(!P.eq(compact,acceptedCompact.data))P.fail('ACCEPTED_COMPACT_VECTOR_MISMATCH');
 const bindings=P.SLOTS.flatMap(slot=>(it.slots[slot]||[]).map((e,i)=>literalBinding(q,e,slot,i,compact[slot][i])));
 if(!Array.isArray(a.quoteChecks)||a.quoteChecks.length!==bindings.length||a.validatorBoundary?.sourceQuoteFailures!==0||a.validatorBoundary.currentSourceQuoteChecks!==bindings.length)P.fail('PRIVATE_QUOTE_REVIEW_COVERAGE');
 for(const b of bindings){const checks=a.quoteChecks.filter(x=>x.candidateEntryPointer===`/provisionalItem/slots/${b.slot}/${b.entryIndex}`);if(checks.length!==1||checks[0].literalPresent!==true||checks[0].quoteSha256!==b.quoteSha256)P.fail('PRIVATE_QUOTE_REVIEW_MISMATCH');}
 P.verifyBindings(bindings,compact,q);
 const receipt={schemaVersion:P.RECEIPT_SCHEMA,requestId,digestAlgorithm:'sha256-stable-json-utf8-v1',source:{path:sourcePath,gitBlobSha:d.sourceGitBlobSha,rawSha256:P.sha(sourceRaw)},dictionary:{path:DEFAULT_DICT,version:dict.dictionaryVersion,gitBlobSha:P.blob(dictRaw),rawSha256:P.sha(dictRaw)},submission:P.scopeFields(d),acceptance:{author:a.author,reviewer:a.reviewer,decision:a.decision,reviewedAtUtc:a.reviewedAtUtc,candidateSha256:P.sha(author.raw),privateInputSha256:P.sha(raw),independentReviewSha256:P.sha(review.raw),allowedScope:'FOUR_SLOT_VECTOR_ONLY',newSemanticApproval:0,otherUidApprovals:0,newMathQa:0},items:[{questionUid:selected.questionUid,sourceOrdinal:selected.sourceOrdinal,sourceQuestionNo:selected.sourceQuestionNo,compactItemSha256:P.sha(P.stable(compact)),quoteBindings:bindings}]};
 const receiptPath=P.RECEIPTS+requestId+'.json',receiptBytes=JSON.stringify(receipt,null,2)+'\n';
 const output={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:d.sourceArchiveFile,sourceGitBlobSha:d.sourceGitBlobSha,dictionaryVersion:d.dictionaryVersion,evidence:{schemaVersion:P.EVIDENCE_SCHEMA,receipt:{path:receiptPath,sha256:P.sha(receiptBytes)}},reviewedBy:{agent:a.reviewer,at:a.reviewedAtUtc,sampled:[selected.displayNumber]},...P.scopeFields(d),items:[compact]};
 const destPath='archive/data/item-4slot/'+d.sourceArchiveFile.replace(/\.js$/,'.4slot.json'),dest=P.safe(root,destPath),receiptDest=P.safe(root,receiptPath),text=serialize(output);
 const previous=fs.existsSync(dest)?fs.readFileSync(dest):null,current=previous?P.sha(previous):'NONE';
 if(current!==expectedCompactSha256)P.fail('COMPACT_CAS_MISMATCH');
 // This first partial route is new-file or exact replay only. It cannot replace
 // another existing compact or discard another reviewer's selected rows.
 if(previous&&previous.toString()!==text)P.fail('EXISTING_COMPACT_CONFLICT');
 if(fs.existsSync(receiptDest)&&fs.readFileSync(receiptDest,'utf8')!==receiptBytes)P.fail('EXISTING_RECEIPT_CONFLICT');
 if(P.blob(fs.readFileSync(P.safe(root,sourcePath)))!==d.sourceGitBlobSha||P.sha(fs.readFileSync(P.safe(root,DEFAULT_DICT)))!==P.sha(dictRaw))P.fail('INPUT_CHANGED_DURING_IMPORT');
 if(write){for(const [file,bytes]of [[receiptDest,receiptBytes],[dest,text]]){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file+'.tmp',bytes);fs.renameSync(file+'.tmp',file);}}
 return {status:'PASS_PARTIAL_IMPORT',scope:P.SCOPE,expectedQuestionCount:bank.length,selected:1,unsubmitted:scope.unsubmitted.length,completeExam:false,write,replay:Boolean(previous),newSemanticApproval:0,sourceMutation:0,compact:{path:destPath,sha256:P.sha(text),bytes:Buffer.byteLength(text)},receipt:{path:receiptPath,sha256:P.sha(receiptBytes),bytes:Buffer.byteLength(receiptBytes)},validation:{fail:0,warn:validation.warn.length,quotes:validation.stats.quotes},output,publicReceipt:receipt};
}
module.exports={importPrivatePartial};

'use strict';
// Every approval and receipt in this file is synthetic. No production authority.
const fs=require('node:fs'),path=require('node:path');
const prior=require('./m2s2-current-repair-fixture.cjs');
const {repaired,stable,uid,source,sp,cp,mod,old:priorContract,repair}=prior;
const dp='docs/architecture/4slot/term-dictionary-v1.5.json';
const contract=require('../../tools/4slot/m2s2-repaired-issued-metadata-continuity.cjs');
const dir='docs/operations/m2-repaired-metadata-fixture/';
const clone=x=>structuredClone(x),hash=x=>mod.sha(stable(x));
const STUDENT=['id','number','questionType','content','question','choices','answer','solution','image','images','figureSvg','svg','solutionImage','solutionImages','solutionFigureSvg'];
const assets=q=>[...new Set([...JSON.stringify(Object.fromEntries(STUDENT.map(k=>[k,q[k]??null]))).replaceAll('\\/','/').matchAll(/(?:archive\/)?assets\/[A-Za-z0-9_가-힣%./+()@ -]+\.(?:png|jpe?g|gif|webp|svg)/gi)].map(m=>m[0].startsWith('archive/')?m[0]:'archive/'+m[0]))].sort();
const fields=(a,b)=>[...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>Object.hasOwn(a,k)!==Object.hasOwn(b,k)||stable(a[k])!==stable(b[k])).sort();
function fixture(t,options={}) {
  const f=repaired(t,{nativeAfterByOrdinal:{2:{curriculum:'2015'},4:{curriculum:'2015'}}}),{save,bytes,git,commit,ref,js}=f;
  const literal=clone(f.data),priorCommit=commit('synthetic literal fully repaired compact');
  const before=clone(f.bank),bank=clone(before);
  for(const ord of [2,4])Object.assign(bank[ord-1],{courseKey:'M2-2',reviewStatus:'reviewed_pass',tagConfidence:'approved_final_qa',tagStatus:'reviewed_pass'});
  options.changeBank?.(bank);
  save(sp,js(bank));options.changeAssets?.(f);
  const copyPath='.archive-meta-register/evidence/m2-repaired-metadata-fixture/native-review.json';
  save(copyPath,require('node:child_process').execFileSync('git',['-C',f.root,'show',f.proof.nativeReviewRef.commit+':'+f.proof.nativeReviewRef.path]));
  const reviewRef={path:copyPath,sha256:mod.sha(bytes(copyPath))};
  const requestPath='.archive-meta-register/inbox/issued-metadata-fixture.json',requestCopy=dir+'issued-request.json',receiptPath='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/issued-metadata-fixture.json';
  const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:'issued-metadata-fixture',examUid:'synthetic-E999',scope:'PARTIAL_UIDS',sourceArchiveFile:source,expectedSourceBlobSha1:mod.blob(bytes(sp)),expectedQuestionCount:5,approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'synthetic-existing-native',evidenceRefs:[reviewRef]},registryChanges:[],items:[2,4].map(ord=>({questionUid:uid(ord),sourceOrdinal:ord,after:{curriculum:'2015',courseKey:'M2-2'},sourceReview:{schemaVersion:'archive-reviewed-source-reassessment-v1',reviewCommit:f.proof.nativeReviewRef.commit,reviewPath:f.proof.nativeReviewRef.path,reviewRef},evidenceRefs:[reviewRef]}))};
  options.changeRequest?.(request);
  save(requestPath,request);save(requestCopy,bytes(requestPath));const requestCommit=commit('synthetic immutable metadata request and source');
  const applied=[2,4].map(ord=>({questionUid:uid(ord),sourceArchiveFile:source,sourceOrdinal:ord,sourceQuestionNo:String(ord),sourceFingerprint:mod.identityHash(bank[ord-1]),curriculum:'2015',courseKey:'M2-2',reviewStatus:'reviewed_pass',tagConfidence:'approved_final_qa',tagStatus:'reviewed_pass'}));
  const identities=applied.map(row=>Object.fromEntries(['questionUid','sourceArchiveFile','sourceOrdinal','sourceQuestionNo','sourceFingerprint'].map(k=>[k,row[k]])));
  const repairs=applied.map(row=>({questionUid:row.questionUid,sourceOrdinal:row.sourceOrdinal,after:{sourceFingerprint:row.sourceFingerprint},sourceReview:{schemaVersion:'archive-reviewed-source-reassessment-v1',nativeSchemaVersion:'m2-s2-meta-review-v1',reviewCommit:f.proof.nativeReviewRef.commit,reviewPath:f.proof.nativeReviewRef.path,reviewRef,questionUid:row.questionUid,sourceOrdinal:row.sourceOrdinal,reviewedSourceBlobSha1:f.proof.nativeSourceRef.gitBlobSha1,reviewedSourceSha256:f.proof.nativeSourceRef.sha256,scope:'METADATA_SOURCE_BINDING_ONLY',newMathematicalQa:false}}));
  const receipt={schemaVersion:'archive-reviewed-exam-meta-registration-v2',requestId:request.requestId,requestSha256:hash(request),examUid:request.examUid,sourceArchiveFile:source,sourceBlobSha1:request.expectedSourceBlobSha1,sourceRawSha256:mod.sha(bytes(sp)),approval:clone(request.approval),metadataRegistrationStatus:'REGISTERED',scope:'PARTIAL_UIDS',totalQuestions:2,partialUidCount:2,expectedQuestionCount:5,registryChanges:[],appliedRecords:clone(applied),appliedIdentityRecords:identities,runtimeRecords:clone(applied),fingerprintRepairs:repairs};
  options.changeReceipt?.(receipt);
  save(receiptPath,receipt);const issuedCommit=commit('synthetic already-issued native metadata receipt');
  const hp={safe:mod.safe,sha:mod.sha,blob:mod.blob,stable,payloadHash:mod.payloadHash,identityHash:mod.identityHash,assetRefs:assets,loadBank:mod.loadBank,dictionary:{path:dp,sha256:mod.sha(bytes(dp)),...JSON.parse(bytes(dp))},identity:f.identity,studentFields:STUDENT};
  hp.m2ContinuityObligation=priorContract.createObligationReader(f.root,hp)(literal);
  const historical=repair.validateHistoricalFile(f.root,ref(priorCommit,cp,true),hp,priorContract.validateHistoricalFile);
  if(historical.errors.length)throw Error('synthetic literal repair failed: '+historical.errors.join('|'));
  const carrierPath=dir+'m2-repaired-issued-metadata-continuity.json';
  const proof={schemaVersion:contract.SCHEMA,scope:contract.SCOPE,transportAuthor:'synthetic-binding-author',examId:'E999',sourceArchiveFile:source,expectedQuestionCount:5,priorValidatedCompactRef:ref(priorCommit,cp,true),priorRepairCarrierRef:clone(literal.evidence[repair.GROUP].carrier),sourceRef:ref(issuedCommit,sp,true),historicalEvidenceRefs:historical.requiredLiveEvidence,issuedRequestOriginalRef:ref(requestCommit,requestPath,true),issuedRequestCopyRef:ref(requestCommit,requestCopy,true),issuedReceiptRef:ref(issuedCommit,receiptPath,true),nativeReviewCopyRef:ref(requestCommit,copyPath,true),rows:before.map((a,i)=>({questionUid:uid(i+1),sourceOrdinal:i+1,sourceQuestionNo:String(i+1),ordinal:i+1,priorWholeQuestionSha256:hash(a),currentWholeQuestionSha256:hash(bank[i]),studentPayloadSha256:mod.payloadHash(bank[i]),addedFields:fields(a,bank[i])})),currentAssets:[...new Set(bank.flatMap(assets))].sort().map(p=>ref(issuedCommit,p,true)),fullItemsSha256:hash(literal.items),...Object.fromEntries(contract.ZERO.map(k=>[k,0]))};
  options.changeProof?.(proof,f);
  const data=clone(literal);
  function signCarrier(){save(carrierPath,proof);const c=commit('synthetic explicit metadata-only carrier');data.evidence[contract.GROUP]={carrier:ref(c,carrierPath),issuedRequestCopy:clone(proof.issuedRequestCopyRef),issuedReceipt:clone(proof.issuedReceiptRef),nativeReviewCopy:clone(proof.nativeReviewCopyRef)};save(cp,data);}
  signCarrier();
  return {...f,literal,before,bank,data,proof,request,receipt,requestPath,requestCopy,receiptPath,copyPath,carrierPath,priorCommit,requestCommit,issuedCommit,hp,signCarrier,write:()=>save(cp,data),commitCurrent:()=>commit('synthetic bound compact')};
}
const run=f=>mod.build(f.root,{readBlob:oid=>f.git('cat-file','blob',oid)});
const cold=f=>JSON.parse(require('node:child_process').execFileSync(process.execPath,['-e',`const m=require(${JSON.stringify(require.resolve('../../tools/4slot/build-4slot-runtime.cjs'))});console.log(JSON.stringify(m.build(process.argv[1]).index));`,f.root],{encoding:'utf8',timeout:30000}));
module.exports={fixture,run,cold,mod,contract,priorContract,stable,uid,source,sp,cp,dp,dir,assets,hash};

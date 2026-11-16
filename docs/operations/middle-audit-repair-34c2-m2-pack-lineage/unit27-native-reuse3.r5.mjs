// Read only. Exact three M2 replacements; the prior 31 passed UIDs are not executed.
// It does not invoke the registrar, AutoMeta CLI, builder, or any writer.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

const BASE='/workspace/scratch/0a70543c4ce8';
const args=process.argv.slice(2);
const get=(key,fallback)=>{const i=args.indexOf(key);return i<0?fallback:args[i+1];};
if(args.includes('--help')) {
  console.log('node state/m3-prep/unit27-native-reuse3.r5.mjs --root state/unit25-actual-fixture --out state/unit25-official-validation/m2-replacement-three/native-reuse3.r5.json');
  process.exit(0);
}
const root=fs.realpathSync(path.resolve(BASE,get('--root','state/unit25-actual-fixture')));
const out=path.resolve(BASE,get('--out','state/unit25-official-validation/m2-replacement-three/native-reuse3.r5.json'));
const lifecyclePath=path.resolve(BASE,get('--lifecycle','state/unit25-official-validation/m2-replacement-three/official-lifecycle-proof.r1.json'));
const ISSUED='4b504e10b1ce7a90576486663b3862ef99922325';
const APPLICATION='c663f60a7bd3e5cd4bd1f813d3b1888c83888a15';
const RECEIPTS='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const META='archive/data/question_metadata.json',IDENTITY='archive/data/question_identity_map.json';
const RUNTIME='archive/data/meta-foundation/runtime';
assert.ok(!out.startsWith(root+path.sep),'Report must be outside the fixture');
assert.ok(!fs.existsSync(out),'Immutable report already exists');
process.env.GIT_NO_LAZY_FETCH='1';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const same=(a,b)=>stable(a)===stable(b);
const pick=(q,keys)=>Object.fromEntries(keys.map(k=>[k,q?.[k]??null]));
const readSet=new Map();
function safe(relative) {
  assert.ok(typeof relative==='string'&&!path.isAbsolute(relative)&&!relative.includes('\\')&&!relative.split('/').some(p=>!p||p==='.'||p==='..'),'Unsafe fixture path');
  const p=fs.realpathSync(path.join(root,relative));
  assert.ok(p.startsWith(root+path.sep),'Fixture path escapes root');
  return p;
}
function readBytes(relative) {const b=fs.readFileSync(safe(relative));readSet.set(relative,sha(b));return b;}
const read=relative=>JSON.parse(readBytes(relative));
const gitCache=new Map();
function gitBytes(spec) {
  if(!gitCache.has(spec))gitCache.set(spec,execFileSync('git',['show',spec],{cwd:root,maxBuffer:64*1024*1024,stdio:['ignore','pipe','pipe'],env:{...process.env,GIT_NO_LAZY_FETCH:'1'}}));
  return gitCache.get(spec);
}
function sourceByBlob(id) {
  assert.match(id,/^[a-f0-9]{40}$/);
  const key='blob:'+id;
  if(!gitCache.has(key))gitCache.set(key,execFileSync('git',['cat-file','blob',id],{cwd:root,maxBuffer:16*1024*1024,stdio:['ignore','pipe','pipe'],env:{...process.env,GIT_NO_LAZY_FETCH:'1'}}));
  const b=gitCache.get(key);assert.equal(blob(b),id);return b;
}
function unique(rows,key,label) {const m=new Map();for(const r of rows){const k=key(r);assert.ok(k&&!m.has(k),'Duplicate/missing '+label);m.set(k,r);}return m;}
function moduleClosure(entries) {
  const seen=new Map(),todo=[...entries];
  while(todo.length) {
    const rel=todo.pop();if(seen.has(rel))continue;
    const b=readBytes(rel);seen.set(rel,sha(b));
    const regex=/(?:from\s*|import\s*\()\s*['"](\.[^'"]+)['"]/g;
    for(const m of b.toString('utf8').matchAll(regex))todo.push(path.relative(root,path.resolve(root,path.dirname(rel),m[1])).split(path.sep).join('/'));
  }
  return [...seen].sort(([a],[b])=>a.localeCompare(b,'en')).map(([path,sha256])=>({path,sha256}));
}
const modules=moduleClosure(['archive/tools/meta-foundation/auto-register-merged-source.mjs','archive/tools/meta-foundation/active-registry.mjs']);
const auto=await import(pathToFileURL(safe('archive/tools/meta-foundation/auto-register-merged-source.mjs')));
const {loadActiveMetaRegistry}=await import(pathToFileURL(safe('archive/tools/meta-foundation/active-registry.mjs')));
const {REASSESSED_STUDENT_FIELDS}=await import(pathToFileURL(safe('archive/tools/meta-foundation/reviewed-source-reassessment.mjs')));
const {validateNativeReviewedSourceReuse}=await import(pathToFileURL(safe('archive/tools/meta-foundation/native-reviewed-source-reuse.mjs')));
const {nativePreservedSourceRebind}=await import(pathToFileURL(safe('archive/tools/meta-foundation/native-preserved-source-reuse.mjs')));
const manifestBytes=readBytes('REQUESTS12.r2.json'),manifest=JSON.parse(manifestBytes);
const applyPath=path.join(BASE,'state/m2-unit25-ordinary-three/apply-manifest.r2.json');
const applyBytes=fs.readFileSync(applyPath),apply=JSON.parse(applyBytes);
assert.equal(sha(applyBytes),'6d1cfc7d05ca9dcba006d12405bb6f9d67fa0404253c03684bba10eda372e5d8');
assert.equal(apply.actualBeforeMain,ISSUED);assert.equal(apply.currentApplicationCommit,APPLICATION);
assert.equal(apply.requests.length,3);assert.equal(apply.newSemanticApprovals,0);assert.equal(apply.newMathematicalQa,0);
const exactUidSet=new Set(['qid_v1_fc830b51bc963544c673ec6b6560afb6356e63c2fa6eb3b6a65bfaa5baef7d4e','qid_v1_76dd55da73d9edb2aeb41cdd76997b70ec4a5d668fc94f00736038cde358937d','qid_v1_dae274cb2ec304a5e2bd854ac3d05b7af18ff8a9a2720fed024df2b6cae9efdb']);
assert.deepEqual(apply.requests.map(r=>r.questionUid).sort(),[...exactUidSet].sort());
const requestSelection=new Map(apply.requests.map(r=>[r.requestId,r]));
for(const old of apply.replacesUnpublishedRequests){assert.ok(!manifest.files.some(r=>r.requestId===old));assert.ok(!fs.existsSync(path.join(root,'.archive-meta-register/inbox/'+old+'.json')));assert.ok(!fs.existsSync(path.join(root,RECEIPTS+old+'.json')));}
assert.equal(manifest.issuedMain,ISSUED);assert.equal(manifest.applicationCommit,APPLICATION);
const lifecycleBytes=fs.readFileSync(lifecyclePath),lifecycle=JSON.parse(lifecycleBytes);
assert.equal(sha(lifecycleBytes),'3cac81db4c82b8ae8d27e3c7f65ed975a325ed26fe634e393b04778ba556df88');
assert.equal(lifecycle.status,'PASS_LOCAL_CURRENT_DATA_REPLACEMENT_DRY_WRITE_REPLAY');
assert.equal(lifecycle.requestManifestSha256,sha(applyBytes));
assert.equal(lifecycle.actualBeforeMain,ISSUED);assert.equal(lifecycle.applicationCommit,APPLICATION);
assert.equal(lifecycle.sourceChanges,0);assert.equal(lifecycle.unselectedChanges,0);assert.equal(lifecycle.steps.length,9);
assert.equal(manifest.files.length,12);
const requests=manifest.files.filter(f=>requestSelection.has(f.requestId)).map(f=>{assert.equal(f.sha256,requestSelection.get(f.requestId).sha256);assert.equal(f.repoPath,requestSelection.get(f.requestId).repoPath);const b=readBytes(f.repoPath);assert.equal(sha(b),f.sha256);const q=JSON.parse(b);assert.equal(q.requestId,f.requestId);return {...f,request:q};});
assert.equal(requests.length,3);
const selected=requests.flatMap(f=>f.request.items.map(item=>({file:f,request:f.request,item,cohort:f.request.sourceArchiveFile.includes('/m3/')?'M3':'M2'})));
assert.equal(selected.length,3);assert.deepEqual(selected.map(r=>r.item.questionUid).sort(),[...exactUidSet].sort());assert.equal(selected.filter(r=>r.cohort==='M2').length,3);
for(const {request,item}of selected){assert.equal(request.approval.sourceRebind,undefined);assert.deepEqual(request.registryChanges,[]);assert.deepEqual(Object.keys(item.after).sort(),['contentFingerprint','sourceFingerprint']);assert.ok(same(item.before,item.after));}
const appEvidenceRef=apply.evidence.find(r=>r.repoPath.endsWith('/current-native-three-application-evidence.r1.json'));
const appEvidenceBytes=readBytes(appEvidenceRef.repoPath);assert.equal(sha(appEvidenceBytes),appEvidenceRef.sha256);const appEvidence=JSON.parse(appEvidenceBytes);
const rootApprovalRef=apply.approvalRefs.find(r=>r.path.endsWith('/root-current-native-three-approval.r1.json'));
const rootApprovalBytes=readBytes(rootApprovalRef.path);assert.equal(sha(rootApprovalBytes),rootApprovalRef.sha256);const rootApproval=JSON.parse(rootApprovalBytes);
assert.equal(rootApproval.decision,'APPROVE_EXACT_CURRENT_NATIVE_REASSESSMENT_APPLICATION');for(const key of ['newMeaningApprovals','newMathematicalQa','newSourceQa','newUniqueRepairUids'])assert.equal(rootApproval[key],0);
for(const {request} of requests)for(const phase of ['dry','write','replay']) {
  const steps=lifecycle.steps.filter(r=>r.requestId===request.requestId&&r.phase===phase);
  assert.equal(steps.length,1);assert.equal(steps[0].status,'PASS');
  assert.equal(sha(fs.readFileSync(steps[0].path)),steps[0].sha256);
}
const metadata=read(META),identityMap=read(IDENTITY);
const byUid=unique(metadata.records,r=>r.questionUid,'metadata UID');
const byIdentity=unique(identityMap.records,r=>r.questionUid,'identity UID');
const identityByJoin=unique(identityMap.records,r=>`${r.sourceArchiveFile}#${r.sourceOrdinal}`,'identity source ordinal');
const runtimes=new Map(),runtimeContainers=new Map();
for(const name of fs.readdirSync(path.join(root,RUNTIME)).filter(n=>n.endsWith('.json')&&n!=='runtime-bridge-receipt.json')) {
  const rel=RUNTIME+'/'+name,doc=read(rel);if(!doc.packId||!Array.isArray(doc.records))continue;runtimeContainers.set(rel,doc);
  for(const row of doc.records){assert.ok(!runtimes.has(row.questionUid),'Duplicate runtime UID');runtimes.set(row.questionUid,{row,status:doc.status,packId:doc.packId,path:rel});}
}
const registry=loadActiveMetaRegistry(root);
for(const rel of Object.values(registry.paths))readBytes(rel);
for(const ref of [...(registry.files.index?.canonicalSources||[]),...(registry.files.index?.compiledArtifacts||[])])readBytes(ref.path);
assert.equal(registry.status,'ACTIVE','Current compiled registry unavailable: '+registry.errors.join('|'));
const sources=new Map();
for(const {request} of requests) {
  const source=request.sourceArchiveFile;if(sources.has(source))continue;
  const rel='archive/exams/'+source,currentBytes=readBytes(rel),oldBytes=gitBytes(ISSUED+':'+rel),applicationBytes=gitBytes(APPLICATION+':'+rel);
  assert.ok(currentBytes.equals(applicationBytes),'Fixture source differs from immutable application: '+rel);
  const bank=auto.loadBank(currentBytes.toString('utf8'),rel),before=auto.loadBank(oldBytes.toString('utf8'),rel);
  assert.equal(bank.length,before.length);assert.equal(bank.length,request.expectedQuestionCount);
  sources.set(source,{root,bytes:currentBytes,blobSha1:blob(currentBytes),bank,before,oldBlobSha1:blob(oldBytes),oldRawSha256:sha(oldBytes),sourceRawSha256:sha(currentBytes)});
}
const receipts=new Map();
function receipt(relative) {
  if(!receipts.has(relative)){assert.ok(relative.startsWith(RECEIPTS)&&relative.endsWith('.json'));const bytes=readBytes(relative);receipts.set(relative,{document:JSON.parse(bytes),sha256:sha(bytes),path:relative});}
  return receipts.get(relative);
}
function parentChain(initial,uid,ordinal,source) {
  let cursor=initial;const chain=[],seen=new Set();
  while(cursor) {
    assert.ok(!seen.has(cursor.path)&&seen.size<64,'Parent receipt cycle/depth');seen.add(cursor.path);
    const doc=cursor.document;
    assert.equal(doc.metadataRegistrationStatus,'REGISTERED');assert.equal(doc.sourceArchiveFile,source);
    assert.equal(cursor.path,RECEIPTS+doc.requestId+'.json');
    for(const field of ['appliedRecords','appliedIdentityRecords','runtimeRecords'])assert.equal(doc[field]?.filter(r=>r.questionUid===uid&&r.sourceOrdinal===ordinal).length,1,'Parent selected UID '+field);
    const raw=sourceByBlob(doc.sourceBlobSha1);assert.equal(sha(raw),doc.sourceRawSha256);
    const bank=auto.loadBank(raw.toString('utf8'),source);assert.equal(bank.length,doc.expectedQuestionCount);
    const next=doc.approval?.sourceRebind?.priorReceiptRef;
    chain.push({path:cursor.path,requestId:doc.requestId,sha256:cursor.sha256,sourceBlobSha1:doc.sourceBlobSha1,sourceRawSha256:doc.sourceRawSha256,selectedOrdinal:ordinal,sourceQuestionStableSha256:sha(stable(bank[ordinal-1])),priorReceiptRef:next??null});
    if(!next)break;
    const parent=receipt(next.path);assert.equal(parent.sha256,next.sha256,'Parent digest mismatch');cursor=parent;
  }
  return chain;
}
const heldKeys=['metaStatus','metaDebtFields','sourceQualityHold','contentDebt','registrationHold','qualityHold','rpmPrimaryKey','rpmOriginalCurriculum','rpmOriginalStatus'];
const rows=[];let nativeInvocationCount=0;
for(const {request,item,cohort} of selected) {
  const uid=item.questionUid,ordinal=item.sourceOrdinal,source=request.sourceArchiveFile;
  const row={cohort,questionUid:uid,sourceArchiveFile:source,sourceOrdinal:ordinal,requestId:request.requestId,kind:request.approval.sourceRebind?'PRESERVED_APPROVAL':'CURRENT_APPLICATION',status:'FAIL'};
  try {
    const binding=sources.get(source),question=binding.bank[ordinal-1],previous=binding.before[ordinal-1],current=byUid.get(uid),identity=byIdentity.get(uid),runtime=runtimes.get(uid);
    assert.ok(current&&identity&&runtime,'Current metadata, identity or runtime absent');
    assert.equal(identity.sourceArchiveFile,source);assert.equal(identity.sourceOrdinal,ordinal);assert.equal(runtime.status,'ACTIVE');
    const expectedPath=RECEIPTS+request.requestId+'.json',issued=receipt(expectedPath),doc=issued.document;
    assert.equal(doc.requestSha256,sha(stable(request)));assert.equal(doc.sourceBlobSha1,binding.blobSha1);assert.equal(doc.sourceRawSha256,binding.sourceRawSha256);
    assert.ok(same(doc.approval,request.approval),'Issued approval differs from exact request');
    assert.ok(same(doc.appliedRecords.find(r=>r.questionUid===uid),current),'Current metadata differs from newly issued selected row');
    assert.ok(same(doc.appliedIdentityRecords.find(r=>r.questionUid===uid),identity),'Current identity differs from newly issued selected row');
    assert.ok(same(doc.runtimeRecords.find(r=>r.questionUid===uid),runtime.row),'Current runtime differs from newly issued selected row');
    row.expectedReceipt={path:expectedPath,sha256:issued.sha256,requestSha256:doc.requestSha256};
    row.parentChain=parentChain(issued,uid,ordinal,source);
    const authority=appEvidence.selected.find(r=>r.uid===uid&&r.sourceOrdinal===ordinal);assert.ok(authority);
    const prior=receipt(authority.priorReceiptRef.path);assert.equal(prior.sha256,authority.priorReceiptRef.sha256);
    assert.equal(sha(gitBytes(ISSUED+':'+prior.path)),prior.sha256,'Original actual-main receipt changed');
    row.originalPriorReceiptChain=parentChain(prior,uid,ordinal,source);
    const oldMd=prior.document.appliedRecords.find(r=>r.questionUid===uid),oldId=prior.document.appliedIdentityRecords.find(r=>r.questionUid===uid),oldRt=prior.document.runtimeRecords.find(r=>r.questionUid===uid);
    const baseline=apply.actualBeforeRowDigests.find(r=>r.questionUid===uid);assert.ok(baseline);
    assert.equal(sha(stable(oldMd)),baseline.metadata);assert.equal(sha(stable(oldId)),baseline.identity);assert.equal(sha(stable(oldRt)),baseline.runtime);
    // The newly issued ordinary application may bind the current ACTIVE pack
    // revision. Record this technical transition, then let full native reuse
    // enforce the official receipt/ancestry rules; it is not a semantic bypass.
    const withoutAuthority=row=>Object.fromEntries(Object.entries(row).filter(([key])=>!['metadataRevision','approvalEvidence','metaFoundationPackVersion'].includes(key)));
    row.packVersionTransition={metadataBefore:oldMd.metaFoundationPackVersion,runtimeBefore:oldRt.metaFoundationPackVersion,metadataAfter:current.metaFoundationPackVersion,runtimeAfter:runtime.row.metaFoundationPackVersion,scope:'New ordinary registration of unchanged accepted values; full native receipt gate below remains mandatory.'};
    assert.equal(oldMd.metaFoundationPackVersion,oldRt.metaFoundationPackVersion);
    assert.equal(current.metaFoundationPackVersion,runtime.row.metaFoundationPackVersion);
    row.actualBeforeValuesUnchanged={metadataExcludingRecordedPackRevision:same(withoutAuthority(oldMd),withoutAuthority(current)),identity:same(oldId,identity),runtimeExcludingRecordedPackRevision:same(withoutAuthority(oldRt),withoutAuthority(runtime.row)),originalEvidenceRetained:oldMd.approvalEvidence.every(p=>current.approvalEvidence.includes(p))};
    for(const [key,value]of Object.entries(row.actualBeforeValuesUnchanged))assert.equal(value,true,'Already accepted value/provenance changed '+key);
    row.replacesUnpublishedRequestId=requestSelection.get(request.requestId).replacesUnpublishedRequestId;
    const expectedParent=request.approval.sourceRebind?.priorReceiptRef;
    if(expectedParent) {
      assert.ok(same(doc.approval.sourceRebind.priorReceiptRef,expectedParent));
      assert.equal(row.parentChain[1]?.path,expectedParent.path);assert.equal(row.parentChain[1]?.sha256,expectedParent.sha256);
      assert.equal(doc.newMetadataApprovals,0);assert.equal(doc.preservedMetadataApprovals,request.items.length);
    }
    row.sourceBinding={issuedMain:ISSUED,applicationCommit:APPLICATION,beforeBlobSha1:binding.oldBlobSha1,beforeRawSha256:binding.oldRawSha256,currentBlobSha1:binding.blobSha1,currentRawSha256:binding.sourceRawSha256,studentFieldsDomain:'REASSESSED_STUDENT_FIELDS',studentPayloadUnchanged:same(pick(previous,REASSESSED_STUDENT_FIELDS),pick(question,REASSESSED_STUDENT_FIELDS)),selectedWholeQuestionUnchanged:same(previous,question)};
    assert.equal(row.sourceBinding.studentPayloadUnchanged,true);
    assert.equal(row.sourceBinding.selectedWholeQuestionUnchanged,true);
    row.sourceHoldBefore=pick(previous,heldKeys);row.sourceHoldAfter=pick(question,heldKeys);
    row.sourceHoldUnchanged=same(row.sourceHoldBefore,row.sourceHoldAfter);
    // M3's approved package explicitly preserves these source flags. M2's two
    // current applications have their own exact source-field authorization;
    // this runner records their flags without imposing M3's contract on them.
    assert.equal(row.sourceHoldUnchanged,true,'Existing source hold/debt changed');
    const context=auto.activeBindingContext({candidate:current,check:{curriculum:current.curriculum||current.curriculumKey},registry,runtimeOwner:runtime.packId});
    row.activeBinding=context.reason?{status:'FAIL',reason:context.reason}:{status:'PASS',ownerPack:context.ownerPack,binding:context.binding,problemTypeActive:context.pt.status==='ACTIVE',templateActive:context.tpl.status==='ACTIVE'};
    assert.ok(!context.reason,context.reason);
    assert.equal(current.metaFoundationPackVersion,context.pack.version,'Current row pack version differs from current ACTIVE registry');
    row.packVersionTransition.currentActivePackVersion=context.pack.version;
    const nativeSource={root,bytes:binding.bytes,blobSha1:binding.blobSha1,bank:binding.bank,identityMap,identityByJoin,runtimeRecord:runtime.row,runtimeStatus:runtime.status};
    const input={nativeSource,question,previous,current,identity,source,ordinal,registry,...context};
    nativeInvocationCount++;row.nativeReceipt=auto.nativeReviewReceipt(input);
    row.nativeReceiptMatchesExpected=row.nativeReceipt===expectedPath;
    if(!row.nativeReceiptMatchesExpected) {
      // Diagnostic only: these same official read-only validators provide a
      // reason when nativeReviewReceipt deliberately catches an inner failure.
      try{const typed=validateNativeReviewedSourceReuse(doc,nativeSource,question,identity,ordinal,current,registry);row.sourceReuseDiagnostic=typed===true?'PASS_TYPED':typed===null?'NOT_APPLICABLE':{result:typed};}catch(e){row.sourceReuseDiagnostic=String(e.message||e);}
      try{row.preservedReuseDiagnostic=nativePreservedSourceRebind({receipt:doc,nativeSource,question,identity,ordinal,current,registry,revalidateLeaf:ancestor=>auto.nativeReviewReceipt({...input,...ancestor})});}catch(e){row.preservedReuseDiagnostic=String(e.message||e);}
      if(String(row.preservedReuseDiagnostic).includes('reviewed pack version lineage:')) {
        const packPath='archive/data/meta-foundation/canonical/packs/'+runtime.packId.toLowerCase().replaceAll('_','-')+'/pack.json';
        const bindingPath=packPath.replace(/pack\.json$/,'bindings.json');
        const low=Number(oldMd.metaFoundationPackVersion.split('.')[2]),high=Number(current.metaFoundationPackVersion.split('.')[2]);
        const steps=[];
        for(const [label,p]of Object.entries(runtimeContainers.get(runtime.path).generatedFrom||{})) {
          if(!label.startsWith('reviewedExam_')||typeof p!=='string'||!p.startsWith(RECEIPTS)||!p.endsWith('.json'))continue;
          const issued=receipt(p),r=issued.document;
          if(!r.outputDigests?.some(d=>d.path===packPath))continue;
          const versions=[...new Set((r.appliedRecords||[]).filter(v=>v.metaFoundationPackId===runtime.packId).map(v=>v.metaFoundationPackVersion))];
          if(versions.length!==1) {steps.push({path:p,sha256:issued.sha256,versions,scope:'ambiguous version provider'});continue;}
          const parts=versions[0].split('.');if(parts.slice(0,2).join('.')!==oldMd.metaFoundationPackVersion.split('.').slice(0,2).join('.')||Number(parts[2])<=low||Number(parts[2])>high)continue;
          const changes=(r.registryChanges||[]).map(c=>({path:c.path,collection:c.collection,beforeIsNull:c.before===null,matchKeys:Object.keys(c.match||{}).sort(),matchesOnlyBindingPath:c.path===bindingPath&&c.collection==='bindings'&&c.before===null}));
          steps.push({path:p,sha256:issued.sha256,requestId:r.requestId,issuedVersion:versions[0],changes});
        }
        row.lineageStepInventory={scope:'Read-only concrete runtime receipt inventory after the official guard failed; not an alternative validator or approval.',packId:runtime.packId,fromVersion:oldMd.metaFoundationPackVersion,toVersion:current.metaFoundationPackVersion,packPath,bindingPath,steps};
      }
    }
    const proof=doc.fingerprintRepairs?.find(r=>r.questionUid===uid)?.sourceReview;
    assert.ok(proof);assert.equal(proof.scope,'METADATA_SOURCE_BINDING_ONLY');assert.equal(proof.newMathematicalQa,false);
    assert.equal(proof.reviewCommit,APPLICATION);assert.ok(same(proof.reviewRef,item.sourceReview.reviewRef));
    row.approvalBoundary={scope:rootApproval.scope,newMeaningApprovals:0,newMathematicalQa:0,newSourceQa:0,ordinaryRegistrationApplicationOnly:true,currentNativeRef:proof.reviewRef};
    row.sourceReviewLimits=proof?{schemaVersion:proof.schemaVersion,scope:proof.scope,newMathematicalQa:proof.newMathematicalQa,currentTargetApplication:proof.currentTargetApplication?{approvalBoundary:proof.currentTargetApplication.approvalBoundary,nativeOriginalCurriculumProvenance:proof.currentTargetApplication.nativeOriginalCurriculumProvenance,limitations:proof.currentTargetApplication.limitations,newDefinitions:proof.currentTargetApplication.newDefinitions,newBindings:proof.currentTargetApplication.newBindings,crosswalkChanges:proof.currentTargetApplication.crosswalkChanges}:null}:null;
    if(proof?.currentTargetApplication) {
      const limits=proof.currentTargetApplication.limitations;
      assert.equal(limits.semantic2015ExactRpmRecordId,null);assert.equal(limits.nativeOriginalCurriculum,'UNSPECIFIED');
      for(const key of ['semantic2015PublisherParentAndLeafResolved','comparison2022BindingResolved','fullSemanticResolution','officialResolverVerifiedFinal','newFullMathematicalQa','newSourceQualityApproval','newDifficultyJudgment'])assert.equal(limits[key],false,'Q11 approval limitation changed '+key);
      assert.equal(current.semanticSourceScope,'M2-2');assert.equal(current.semanticScopeRelation,'PREREQUISITE_LOWER_GRADE');
    }
    assert.equal(row.nativeReceiptMatchesExpected,true,'Native reuse did not select exact newly issued receipt');
    row.status='PASS';
  } catch(e) {row.failure=String(e.message||e);}
  rows.push(row);
}
const mutated=[];for(const [relative,digest]of readSet)if(sha(fs.readFileSync(safe(relative)))!==digest)mutated.push(relative);
assert.deepEqual(mutated,[],'Read-only input mutation detected');
const cohorts=Object.fromEntries(['M2'].map(cohort=>{const set=rows.filter(r=>r.cohort===cohort);return [cohort,{selected:set.length,currentApplications:set.filter(r=>r.kind==='CURRENT_APPLICATION').length,preservedApprovals:set.filter(r=>r.kind==='PRESERVED_APPROVAL').length,passed:set.filter(r=>r.status==='PASS').length,failed:set.filter(r=>r.status!=='PASS').length,status:set.every(r=>r.status==='PASS')?'PASS_LOCAL_NATIVE_REUSE':'FAIL_LOCAL_NATIVE_REUSE',failedUids:set.filter(r=>r.status!=='PASS').map(r=>r.questionUid)}];}));
const result={schemaVersion:'unit25-m2-replacement-three-native-reuse-readback-v5',fixtureReceiptCorrectionRef:{"path": "state/unit25-official-validation/m2-replacement-three/fixture-receipt-inventory-correction.r1.json", "sha256": "d8287c78c7399624d0d82066bbca98a350812f1972059114856d9cda765d37a8", "priorReportRef": {"path": "state/unit25-official-validation/m2-replacement-three/native-reuse3.r3.json", "sha256": "286cbfd24d018517cffbcc1fc3475766e4d8a0fa7c1acf438df42a1173a10347"}, "scope": "Only genuine actual-main historical receipt copies and removal of three fixture-only unpublished generatedFrom pointers; row values unchanged. No ancestry or policy weakening."},environmentCorrectionRef:{"path": "state/unit25-official-validation/real-git-shallow-boundary-import.r1.json", "sha256": "96854a3fc894a4e6522e8739a301b5a9b3d3d7416e1dfbfeba2501fde9126ae3", "priorNullReport": {"path": "state/unit25-official-validation/m2-replacement-three/native-reuse3.r2.json", "sha256": "2f42cc49a09eb319d50d15dd6fdd5b9baa00b7b180adbe5eef54245c03236b79"}, "reason": "Root imported only actual repository shallow boundaries omitted by the fixture; no fabricated commits, parent or validator changes. R3 reruns only these three previously blocked UIDs."},supersedesPrematurePrecheckReport:{path:'state/unit25-official-validation/m2-replacement-three/native-reuse3.r1.json',sha256:'4d9ac6225ad30e01086ab621b4e47a5451cd106de42366082b0762a6bf6b126f',nativeInvocations:0,reason:'R1 stopped before native calls because it required historical pack version equality. R2 records the ordinary current-pack revision separately and uses the actual full native receipt function as the mandatory gate.'},nativeInvocationCount,reviewer:'GPT_ROOT_0A70543C4CE8',taskId:'34c2e1a2-83bf-4be4-9a70-8f5eb30d6d04',issuedMain:ISSUED,applicationCommit:APPLICATION,fixtureRoot:root,requestManifestSha256:sha(manifestBytes),replacementApplicationManifestRef:{path:applyPath,sha256:sha(applyBytes)},prior31NativePassReruns:0,lifecycleProofRef:{path:lifecyclePath,sha256:sha(lifecycleBytes)},registry:{status:registry.status,registrySha:registry.registrySha},cohorts,selectedUidCount:rows.length,rows,modules,inputReadback:[...readSet].map(([path,sha256])=>({path,sha256})),inputMutationCount:0,productionWrites:0,registrarInvocations:0,oldFocusedTestReruns:0,officialRemoteWriter:'NOT_RUN_FOR_THIS_APPLICATION',studentDeployment:'NOT_RUN_FOR_THIS_APPLICATION',scope:'Only the three exact M2 replacement requests; compare new receipt/current values/ACTIVE/native reuse to unchanged actual4b504 prior authority. Prior31PASS and Q11 are not executed; no registrar invocation.'};
fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({report:out,sha256:sha(fs.readFileSync(out)),cohorts,readOnly:true,productionWrites:0}));
if(rows.some(r=>r.status!=='PASS'))process.exitCode=2;

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {validateReviewedM2CcRendererContinuity, nativeReviewedM2CcRendererRebind}
  from '../archive/tools/meta-foundation/reviewed-m2-cc-renderer-continuity.mjs';

const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const full = q => sha(JSON.stringify({content:q.content??null, choices:q.choices??null, answer:q.answer??null, solution:q.solution??null, image:q.image??null}));
const body = q => sha(JSON.stringify({content:q.content??null, choices:q.choices??null, image:q.image??null}));
const WF = ['id','number','questionType','content','question','choices','answer','solution','image','images','figureSvg','svg','solutionImage','solutionImages','solutionFigureSvg'];
const RF = ['id','number','sourceQuestionNo','sourceQid','sourceOrdinal','questionUid','questionType','content','question','choices','answer','solution',
  'image','images','figureSvg','solutionImage','solutionImages','solutionFigureSvg','layoutTag','wide','imageSize','solutionImageAlt','solutionImageCaption','solutionImageSize','score'];
const payload = (q, fields = RF) => Object.fromEntries(fields.map(k => [k, q[k]??null]));
const TRANSPORT = ['courseKey','crossConceptKeys','curriculumKey'];
const RENDERER = ['image','imageAlt','imageSize','layoutTag','solutionImage','solutionImageAlt','solutionImageCaption'];
const bank = bytes => {const ctx={window:{}}; vm.runInNewContext(bytes.toString(),ctx,{timeout:1000}); return JSON.parse(JSON.stringify(ctx.window.questionBank));};

function fixture(t) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'m2-cc-renderer-')); t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const git=(...args)=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe']}).toString().trim();
  const put=(p,v)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');};
  const source='original/middle/m2/2final/fixture.js',sourcePath='archive/exams/'+source;
  const writeBank=rows=>put(sourcePath,'window.questionBank = '+JSON.stringify(rows)+';\n');
  const commit=()=>{git('add','.');git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','--allow-empty','-qm','fixture');return git('rev-parse','HEAD');};
  const sourceRef=c=>({commit:c,path:sourcePath,gitBlobSha1:git('rev-parse',c+':'+sourcePath),sha256:sha(execFileSync('git',['show',c+':'+sourcePath],{cwd:root}))});
  const ref=p=>({path:p,sha256:sha(fs.readFileSync(path.join(root,p)))});
  git('init','-q');
  const originals=[1,2].map(i=>({id:'q'+i,content:'Fixed stem '+i,choices:['a','b'],answer:'a',solution:'Fixed solution '+i,
    image:`assets/fixture/old-${i}.svg`,solutionImage:`assets/fixture/old-solution-${i}.svg`,crossConceptKeys:[],problemTypeKey:'PT_FIXED'}));
  const asset=(p,text)=>put(p,`<svg xmlns="http://www.w3.org/2000/svg"><text>${text}</text></svg>`);
  for(let i=1;i<=2;i++){asset(`archive/assets/fixture/old-${i}.svg`,'old'+i);asset(`archive/assets/fixture/old-solution-${i}.svg`,'solution'+i);}
  writeBank(originals); put('docs/native.json',{schemaVersion:'m2-s2-meta-review-v1'});const nativeCommit=commit(),nativeRef=ref('docs/native.json');
  const accepted=originals.map(q=>({...q,crossConceptKeys:['CC_FIXED'],courseKey:'M2-2',curriculumKey:'2015'}));
  const originalRequestPath='.archive-meta-register/inbox/original-cc.json';
  const originalRequest={scope:'PARTIAL_UIDS',requestId:'original-cc',sourceArchiveFile:source,expectedQuestionCount:2,
    approval:{type:'FINAL_QA',metadataReviewed:true,evidenceRefs:[]},registryChanges:[{collection:'concepts',mode:'ADD_ONLY',key:'CC_FIXED'}],
    items:accepted.map((q,i)=>({questionUid:'uid'+(i+1),sourceOrdinal:i+1,after:{crossConceptKeys:q.crossConceptKeys,courseKey:q.courseKey,curriculumKey:q.curriculumKey,sourceFingerprint:full(q),contentFingerprint:body(q)},
      sourceReview:{schemaVersion:'archive-reviewed-source-reassessment-v1',reviewCommit:nativeCommit,reviewPath:nativeRef.path,reviewRef:nativeRef,
        proposalFinalization:{schemaVersion:'archive-native-proposal-finalization-v1',finalizationCommit:nativeCommit,proposalIds:['ORIGINAL_CC']}}}))};
  writeBank(accepted);originalRequest.expectedSourceBlobSha1=git('hash-object',sourcePath);put(originalRequestPath,originalRequest);const acceptedCommit=commit();
  const current=originals.map((q,i)=>({...q,image:`assets/fixture/new-${i+1}.svg`,solutionImage:`assets/fixture/new-solution-${i+1}.svg`,
    imageAlt:'Current image',imageSize:'wide',layoutTag:'figure',solutionImageAlt:'Current solution',solutionImageCaption:'Current caption'}));
  for(let i=1;i<=2;i++){asset(`archive/assets/fixture/new-${i}.svg`,'new'+i);asset(`archive/assets/fixture/new-solution-${i}.svg`,'new solution'+i);}
  writeBank(current);const currentCommit=commit();
  const assetRows=(q,c,role)=>[q.image,q.solutionImage].map(p=>{p='archive/'+p;const r=ref(p);return {role,path:p,gitBlob:git('rev-parse',c+':'+p),sha256:r.sha256,renderedSha256:r.sha256};});
  const independent={schemaVersion:'root-independent-existing-native-renderer-review-v1',reviewer:'independent-root',status:'PASS_SELECTED_TWO_CURRENT_RENDERER_ONLY',
    currentSourceCommit:currentCommit,sourcePath,currentSourceGitBlob:sourceRef(currentCommit).gitBlobSha1,originalAcceptedPacket:acceptedCommit,
    newMathematicalQa:false,newDifficultyJudgment:false,newDefinitionApproval:false,originalNativeDefinitionAndApplicationAuthorityReusedOnly:true,reviewedUidCount:2,reviewedAssets:8,
    items:accepted.map((q,i)=>({questionUid:'uid'+(i+1),sourceOrdinal:i+1,originalAcceptedWholeQuestionSha256:sha(stable(q)),currentWholeQuestionSha256:sha(stable(current[i])),
      originalAcceptedStudentPayloadSha256:sha(stable(payload(q,WF))),currentStudentPayloadSha256:sha(stable(payload(current[i],WF))),
      changedRendererFields:[...RENDERER],originalMetadataTransportFields:[...TRANSPORT],assets:[...assetRows(q,acceptedCommit,'ORIGINAL_ACCEPTED'),...assetRows(current[i],currentCommit,'CURRENT_UNREVIEWED')],
      verdict:'PASS_CURRENT_RENDERER_CONTINUITY_ONLY'}))};
  const proofPath='.archive-meta-register/evidence/current-m2-cc.json',independentPath='.archive-meta-register/evidence/independent-renderer.json';
  const doc={schemaVersion:'archive-m2-cc-current-renderer-continuity-evidence-v1',scope:'IMMUTABLE_M2_CC_FINALIZATION_WITH_CURRENT_RENDERER_ONLY',
    sourceArchiveFile:source,expectedQuestionCount:2,newMathematicalQa:false,newMetadataApprovals:0,newDifficultyJudgments:0,originalAuthorityUnchanged:true,
    selectedItems:originalRequest.items.map(r=>({questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal})),
    nativeReviewRef:{commit:nativeCommit,path:nativeRef.path,sha256:nativeRef.sha256},
    originalRequestRef:{commit:acceptedCommit,...ref(originalRequestPath)},originalAcceptedSourceRef:sourceRef(acceptedCommit),currentSourceRef:sourceRef(currentCommit)};
  const request=structuredClone(originalRequest);request.requestId='current-m2-cc';
  const questions=current.map((q,i)=>({...q,...Object.fromEntries(TRANSPORT.map(k=>[k,accepted[i][k]]))}));
  request.items.forEach((p,i)=>{p.after.sourceFingerprint=full(questions[i]);p.after.contentFingerprint=body(questions[i]);});
  const native={spec:originalRequest.items[0].sourceReview,review:{schemaVersion:'m2-s2-meta-review-v1'},reviewedBank:originals,committedBank:originals,reviewer:'native-author'};
  function refresh() {
    put(independentPath,independent);doc.independentReviewRef=ref(independentPath);put(proofPath,doc);const c=commit(),proofRef=ref(proofPath);
    const refs=[proofRef,doc.independentReviewRef];request.approval.evidenceRefs=refs;
    for(const p of request.items){p.evidenceRefs=refs;p.sourceReview.m2CcRendererProof={schemaVersion:'archive-reviewed-m2-cc-renderer-continuity-v1',reviewCommit:c,reviewRef:proofRef};}
    writeBank(questions);
  }
  refresh();
  const context=i=>({root,request,patch:request.items[i],native,row:{questionUid:'uid'+(i+1)},question:questions[i],studentPayload:payload,bankFromBytes:bank,cache:new Map()});
  return {root,git,put,refresh,doc,independent,request,native,questions,accepted,originals,context,run:i=>validateReviewedM2CcRendererContinuity(context(i??0))};
}

test('typed M2 renderer bridge yields only the exact original carrier and current renderer witness', t=>{
  const f=fixture(t);
  for(let i=0;i<2;i++){const p=f.run(i);assert.deepEqual(p.originalQuestion,f.accepted[i]);assert.equal(p.proof.newMetadataApprovals,0);assert.equal(p.proof.newDifficultyJudgments,0);assert.equal(p.proof.originalAssets.length,2);assert.equal(p.proof.currentAssets.length,2);}
});

for(const [label,mutate,refresh=false] of [
  ['full request',f=>f.request.scope='FULL_EXAM'],['REVIEW2 request',f=>f.request.approval.type='REVIEW2'],
  ['source-only combination',f=>f.request.approval.sourceRebind={}],['registration-mode combination',f=>f.request.registrationMode='IDENTITY_FINGERPRINT_ONLY'],
  ['M3 renderer combination',f=>f.request.items[0].sourceReview.rendererProof={}],['M3 native schema',f=>f.native.review.schemaVersion='m3-s2-complete-semantic-review-v1'],
  ['different finalization version',f=>f.request.items[0].sourceReview.proposalFinalization.schemaVersion='archive-native-proposal-finalization-v2'],
  ['original native review spec mutation',f=>f.request.items[0].sourceReview.reviewPath='docs/other.json'],
  ['new CC after value',f=>f.request.items[0].after.crossConceptKeys=['UNREVIEWED']],
  ['definition support mutation',f=>f.request.registryChanges[0].supportingQuestionUids=['uid-other']],
  ['missing original native input equality',f=>f.native.reviewedBank[0].answer='different'],
  ['unreviewed live answer',f=>f.questions[0].answer='different'],['unreviewed live stem',f=>f.questions[0].content='different'],
  ['unreviewed live choices',f=>f.questions[0].choices=['different']],['unreviewed live solution',f=>f.questions[0].solution='different'],
  ['arbitrary source metadata field',f=>f.questions[0].templateKey='UNREVIEWED'],
  ['unbound item witness',f=>f.request.items[0].evidenceRefs=[]],
  ['wrong original commit',f=>f.doc.originalRequestRef.commit='a'.repeat(40),true],
  ['wrong original request hash',f=>f.doc.originalRequestRef.sha256='a'.repeat(64),true],
  ['wrong original source blob',f=>f.doc.originalAcceptedSourceRef.gitBlobSha1='a'.repeat(40),true],
  ['different native evidence',f=>f.doc.nativeReviewRef.sha256='a'.repeat(64),true],
  ['missing selected UID',f=>f.doc.selectedItems.pop(),true],['duplicate selected UID',f=>f.doc.selectedItems.push(f.doc.selectedItems[0]),true],
  ['superset selected UID',f=>f.doc.selectedItems.push({questionUid:'uid3',sourceOrdinal:3}),true],
  ['self review',f=>f.independent.reviewer='native-author',true],['unapproved renderer',f=>f.independent.items[0].verdict='PENDING',true],
  ['expanded math claim',f=>f.independent.newMathematicalQa=true,true],
  ['wrong root current question hash',f=>f.independent.items[0].currentWholeQuestionSha256='a'.repeat(64),true],
  ['missing renderer delta',f=>f.independent.items[0].changedRendererFields=[],true],
  ['metadata transport scope expansion',f=>f.independent.items[0].originalMetadataTransportFields.push('templateKey'),true],
  ['missing old asset',f=>f.independent.items[0].assets.shift(),true],['duplicate current asset',f=>f.independent.items[0].assets.push(f.independent.items[0].assets[2]),true],
  ['wrong current asset hash',f=>f.independent.items[0].assets[2].sha256='a'.repeat(64),true],
  ['unsafe source path',f=>f.doc.currentSourceRef.path='../escape',true],
]) test(`typed M2 renderer bridge refuses ${label}`,t=>{const f=fixture(t);mutate(f);if(refresh)f.refresh();assert.throws(()=>f.run(),/M2 CC renderer continuity:/);});

test('same-path old/current renderer changes and symlinks cannot pass immutable validation',t=>{
  for(const role of ['ORIGINAL_ACCEPTED','CURRENT_UNREVIEWED']){const f=fixture(t);const a=f.independent.items[0].assets.find(r=>r.role===role);f.put(a.path,'changed');assert.throws(()=>f.run(),/asset bytes changed/);}
  const f=fixture(t),a=f.independent.items[0].assets[2],p=path.join(f.root,a.path);fs.unlinkSync(p);fs.symlinkSync(path.join(f.root,f.independent.items[0].assets[0].path),p);assert.throws(()=>f.run(),/symlink/);
});

test('typed cursor gate accepts only original/current payload after both production source gates',t=>{
  const f=fixture(t),continuity=f.run().proof,finalization={schemaVersion:'archive-native-proposal-finalization-v1',nativeAfterSha256:'a'.repeat(64)};
  continuity.originalFinalizationSha256=sha(stable(finalization));
  const receipt={scope:'PARTIAL_UIDS',approval:{type:'FINAL_QA'},fingerprintRepairs:[{questionUid:'uid1',sourceOrdinal:1,
    sourceReview:{nativeSchemaVersion:'m2-s2-meta-review-v1',proposalFinalization:finalization,m2CcRendererContinuity:continuity}}]};
  const ctx={receipt,question:f.questions[0],identity:{questionUid:'uid1'},ordinal:1,verifiedSource:true};
  for(const previous of [f.originals[0],f.accepted[0],f.questions[0]])assert.equal(nativeReviewedM2CcRendererRebind({...ctx,previous}),true);
  for(const verifiedSource of [false,null,undefined,'true'])assert.throws(()=>nativeReviewedM2CcRendererRebind({...ctx,previous:f.originals[0],verifiedSource}),/verified original\/current/);
  assert.throws(()=>nativeReviewedM2CcRendererRebind({...ctx,previous:{...f.originals[0],answer:'changed'}}),/previous cursor/);
  assert.throws(()=>nativeReviewedM2CcRendererRebind({...ctx,previous:{...f.originals[0],imageAlt:'changed'}}),/previous cursor/);
  assert.throws(()=>nativeReviewedM2CcRendererRebind({...ctx,previous:f.originals[0],question:{...f.questions[0],solution:'changed'}}),/previous cursor/);
  const broken=structuredClone(receipt);broken.fingerprintRepairs[0].sourceReview.proposalFinalization.nativeAfterSha256='b'.repeat(64);
  assert.throws(()=>nativeReviewedM2CcRendererRebind({...ctx,receipt:broken,previous:f.originals[0]}),/previous cursor/);
  const ordinary=structuredClone(receipt);delete ordinary.fingerprintRepairs[0].sourceReview.m2CcRendererContinuity;
  assert.equal(nativeReviewedM2CcRendererRebind({...ctx,receipt:ordinary,previous:f.originals[0]}),null);
});

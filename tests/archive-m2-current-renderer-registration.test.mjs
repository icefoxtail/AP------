import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {m2RendererWriterFixture,stable,sha} from './helpers/m2-current-renderer-fixture.mjs';
import {registerReviewedExamV2} from '../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs';
import {nativeReviewReceipt,planQuestion} from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';
import {validateNativeReviewedSourceReuse} from '../archive/tools/meta-foundation/native-reviewed-source-reuse.mjs';

test('official M2 renderer registration issues the current receipt and reuses both old and caught-up cursors',t=>{
  const f=m2RendererWriterFixture(t),before=fs.readFileSync(path.join(f.root,f.sourcePath));
  const dry=registerReviewedExamV2({root:f.root,request:f.request});assert.equal(dry.status,'PASS');
  const written=registerReviewedExamV2({root:f.root,request:f.request,write:true});assert.equal(written.status,'PASS');
  const replay=registerReviewedExamV2({root:f.root,request:f.request});assert.equal(replay.replay,true);assert.deepEqual(replay.plannedPaths,[]);
  const c=f.runtimeContext();
  assert.equal(validateNativeReviewedSourceReuse(c.receipt,c.nativeSource,c.question,c.identity,c.ordinal,c.current,c.registry),true);
  for(const previous of [c.previous,structuredClone(c.question)]){
    const result=planQuestion({...c,previous});assert.equal(result.status,'ALREADY_REGISTERED',JSON.stringify(result));
    assert.equal(result.nativeReviewReceipt,c.receiptPath);assert.equal(result.final,undefined);
  }
  assert.deepEqual(fs.readFileSync(path.join(f.root,f.sourcePath)),before);
});

function stripTransport(f,c){
  delete c.receipt.fingerprintRepairs;
  c.receipt.outputDigests=c.receipt.outputDigests.filter(r=>r.path!==c.bindingPath);
  for(const row of [c.current,c.nativeSource.runtimeRecord,...c.receipt.appliedRecords,...c.receipt.runtimeRecords])
    row.approvalEvidence=row.approvalEvidence.filter(p=>p!==c.bindingPath);
  c.receipt.approval.evidenceRefs=c.receipt.approval.evidenceRefs.filter(r=>r.path!==f.witnessPath);
  fs.unlinkSync(path.join(f.root,c.bindingPath));fs.unlinkSync(path.join(f.root,f.witnessPath));
}
const corruptions=[
 ['missing immutable visual evidence',f=>fs.unlinkSync(path.join(f.root,f.witnessPath))],
 ['changed actual current renderer',f=>fs.appendFileSync(path.join(f.root,f.newAsset),' ')],
 ['changed old renderer',f=>fs.appendFileSync(path.join(f.root,f.oldAsset),' ')],
 ['missing native review bytes',f=>fs.unlinkSync(path.join(f.root,f.patch.sourceReview.reviewRef.path))],
 ['missing frozen request',f=>fs.unlinkSync(path.join(f.root,f.frozenCopy))],
 ['missing durable source binding',(f,c)=>fs.unlinkSync(path.join(f.root,c.bindingPath))],
 ['removed M2 proof repair',(f,c)=>{delete c.receipt.fingerprintRepairs[0].sourceReview.m2RendererContinuity;}],
 ['coordinated markers and witness removal',stripTransport],
 ['coordinated stripping and missing revision',(f,c)=>{stripTransport(f,c);for(const row of [c.current,c.nativeSource.runtimeRecord,...c.receipt.appliedRecords,...c.receipt.runtimeRecords])delete row.metadataRevision;}],
 ['coordinated stripping and removed authority type',(f,c)=>{stripTransport(f,c);for(const row of [c.current,c.nativeSource.runtimeRecord,...c.receipt.appliedRecords,...c.receipt.runtimeRecords])delete row.metadataApprovalType;}],
 ['coordinated stripping and semantic drift',(f,c)=>{stripTransport(f,c);for(const row of [c.current,c.nativeSource.runtimeRecord,...c.receipt.appliedRecords,...c.receipt.runtimeRecords])row.primaryMethod='unreviewed replacement';}],
 ['coordinated stripping and all row provenance removal',(f,c)=>{stripTransport(f,c);for(const row of [c.current,c.nativeSource.runtimeRecord,...c.receipt.appliedRecords,...c.receipt.runtimeRecords]){delete row.metadataRevision;row.approvalEvidence=[];}}],
 ['committed combined marker and witness deletion',(f,c)=>{stripTransport(f,c);f.commit();}],
 ['committed empty replacement witness',(f,c)=>{stripTransport(f,c);f.put(f.witnessPath,{});f.commit();}],
 ['merge deletion retains the witnessed parent obligation',(f,c)=>{
   const witnessed=f.git('rev-parse','HEAD'),prior=f.git('rev-parse','HEAD^'),tree=f.git('rev-parse',prior+'^{tree}'),
     sibling=f.git('commit-tree',tree,'-p',prior,'-m','Synthetic no-witness sibling');
   stripTransport(f,c);f.put(c.receiptPath,c.receipt);f.git('add','-A');
   const merged=f.git('commit-tree',f.git('write-tree'),'-p',witnessed,'-p',sibling,'-m','Synthetic merge removes current witness');
   f.git('update-ref','HEAD',merged);
 }],
 ['combined stripping and unavailable Git HEAD',(f,c)=>{stripTransport(f,c);fs.writeFileSync(path.join(f.root,'.git','HEAD'),'ref: refs/heads/missing-fixture-head\n');}],
];
for(const[label,mutate]of corruptions)test('M2 issued transport cannot become an ordinary approval: '+label,t=>{
  const f=m2RendererWriterFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});
  const c=f.runtimeContext();c.bindingPath=c.receipt.outputDigests.find(r=>r.path.endsWith('.source-review-binding.json')).path;
  assert.equal(planQuestion(c).status,'ALREADY_REGISTERED');
  mutate(f,c);f.put(c.receiptPath,c.receipt);
  for(const previous of [c.previous,structuredClone(c.question)]){
    const result=planQuestion({...c,previous});
    assert.equal(result.status,'SUPPLEMENT_PENDING',JSON.stringify(result));
    assert.equal(result.nativeReviewReceipt,undefined);assert.equal(result.final,undefined);
  }
});

test('a source-only descendant retains the exact M2 proof and its live visual obligation',t=>{
  const f=m2RendererWriterFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});
  const c=f.runtimeContext(),priorRef={path:c.receiptPath,sha256:sha(fs.readFileSync(path.join(f.root,c.receiptPath)))},
    sidecar=c.receipt.outputDigests.find(r=>r.path.endsWith('.source-review-binding.json'));
  fs.appendFileSync(path.join(f.root,f.sourcePath),'// unrelated source formatting\n');
  const request={schemaVersion:f.request.schemaVersion,requestId:'m2-renderer-source-only-descendant',examUid:f.request.examUid,
    sourceArchiveFile:f.request.sourceArchiveFile,scope:'PARTIAL_UIDS',expectedQuestionCount:1,expectedSourceBlobSha1:f.git('hash-object','-w',f.sourcePath),
    approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'synthetic preservation author',sourceRebind:{priorReceiptRef:priorRef},evidenceRefs:[priorRef,sidecar,...f.request.approval.evidenceRefs]},registryChanges:[],
    items:[{questionUid:'uid1',sourceOrdinal:1,before:{},after:{},reason:'Preserve the complete existing synthetic cohort.',evidenceRefs:[priorRef,sidecar,...f.request.items[0].evidenceRefs]}]};
  registerReviewedExamV2({root:f.root,request,write:true});
  const nextPath=c.receiptPath.replace(f.request.requestId,request.requestId),receipt=f.read(nextPath),
    current=receipt.appliedRecords[0],identity=receipt.appliedIdentityRecords[0],nativeSource={...c.nativeSource,bytes:fs.readFileSync(path.join(f.root,f.sourcePath)),blobSha1:request.expectedSourceBlobSha1,runtimeRecord:receipt.runtimeRecords[0]};
  assert.equal(validateNativeReviewedSourceReuse(receipt,nativeSource,c.question,identity,1,current,c.registry),true);
  const args={...c,current,identity,nativeSource};assert.equal(planQuestion(args).nativeReviewReceipt,nextPath);
  fs.unlinkSync(path.join(f.root,f.witnessPath));
  assert.equal(planQuestion(args).status,'SUPPLEMENT_PENDING');
});

const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const source='original/middle/m2/2final/22_풍덕중_2학기_기말_중2_기출.js';
const priorId='m2s2-binding68-20261115-E032',childId='e032-synthetic-subset-preservation';
const prefix='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const priorPath=prefix+priorId+'.json',childPath=prefix+childId+'.json';
const pairs=[
 ['qid_v1_f288a19bf33c38b84c2c2436478bfba2bafd4b275fa60568af686eeab5732363',2],
 ['qid_v1_9172cf1ec90c0cc3af91cab63dcfa4b68fa61065882343e82812a4d86d780f85',3],
 ['qid_v1_bed808c0cecc90e30621de4a5b961290d1ce0b95e943d07155962ed483cc39c8',4],
 ['qid_v1_df579118439a5d43dc8408f65e435810dd1ef11b29053720e135ca1120ec50f0',5],
 ['qid_v1_45204c832c0632b1cad11ec4c9e766abfddf38680628e9af0beb70538e68ece7',6],
 ['qid_v1_9ec4baa4cded9d949b8ca60ced0a095a03b5d438f48f1a57fde1cc7dfeb956d6',7],
 ['qid_v1_7a44e50d6c7fb8fddcd4b1791abe9bd4987c5e1dc4d6e6aafca725c7c62a7f6a',9]
];
const selected=pairs.slice(0,4),excluded=pairs.slice(4);
const clone=value=>structuredClone(value);
const stable=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const blob=bytes=>crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const json=value=>Buffer.from(JSON.stringify(value,null,2)+'\n');
const sourceBytes=bank=>Buffer.from('window.questionBank = '+JSON.stringify(bank)+';\n');
const mod=Promise.all([
 import('../archive/tools/meta-foundation/native-partial-subset-preservation.mjs'),
 import('../archive/tools/meta-foundation/native-preserved-source-reuse.mjs')
]).then(([subset,native])=>({...subset,...native}));

function fixture(t,{svg=false}={}) {
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'e032-subset-focused-'));
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const write=(relative,bytes)=>{const p=path.join(root,relative);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,bytes);};
 const git=(...args)=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe']}).toString().trim();
 git('init','-q');git('config','user.name','synthetic-fixture');git('config','user.email','fixture@example.invalid');
 const oldBank=Array.from({length:24},(_,i)=>({id:i+1,content:'Synthetic question '+(i+1),answer:'synthetic',solution:'synthetic'}));
 if(svg)oldBank[1].svg={opaque:'nonempty renderer carrier'};
 const oldBytes=sourceBytes(oldBank),proofBytes=json({schemaVersion:'synthetic-original-review-v1'});
 write('proof.json',proofBytes);const proofRef={path:'proof.json',sha256:sha(proofBytes)};
 const metadata=pairs.map(([uid,ordinal])=>({questionUid:uid,sourceArchiveFile:source,sourceOrdinal:ordinal,
  sourceFingerprint:sha(stable(oldBank[ordinal-1])),contentFingerprint:sha(stable(oldBank[ordinal-1])),
  metaFoundationPackId:'MIDDLE2',metaFoundationPackVersion:'1.0.3',metadataApprovalType:'FINAL_QA',metadataReviewed:true,
  metadataRevision:'meta-foundation:MIDDLE2@1.0.3:exam-final_qa-v2:'+priorId,approvalEvidence:[priorPath],
  difficultyBucket:3,difficultyConfidence:'high',difficultyBoundaryFlag:'NONE',legacyLevelCompatibility:'NORMAL',
  verifiedEligible:false,automaticAssignmentEligible:false}));
 const identities=metadata.map(row=>({questionUid:row.questionUid,sourceArchiveFile:source,sourceOrdinal:row.sourceOrdinal,sourceFingerprint:row.sourceFingerprint}));
 const runtime=metadata.map(row=>({...clone(row),sourceIdentity:source+'#'+row.sourceOrdinal}));
 const prior={schemaVersion:'archive-reviewed-exam-meta-registration-v2',requestId:priorId,requestSha256:sha('original synthetic request'),
  examUid:'synthetic-e032-exam',sourceArchiveFile:source,sourceBlobSha1:blob(oldBytes),sourceRawSha256:sha(oldBytes),
  expectedQuestionCount:24,scope:'PARTIAL_UIDS',partialUidCount:7,totalQuestions:7,metadataRegistrationStatus:'REGISTERED',
  approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'synthetic-original-reviewer',evidenceRefs:[proofRef]},
  appliedRecords:clone(metadata),appliedIdentityRecords:clone(identities),runtimeRecords:clone(runtime),
  registryChanges:[{syntheticExistingDefinition:true}],fingerprintRepairs:[],nativeParentBindings:[]};
 const priorBytes=json(prior);write(priorPath,priorBytes);write('archive/exams/'+source,oldBytes);
 git('add','.');git('commit','-qm','synthetic immutable original seven');const priorCommit=git('rev-parse','HEAD');
 const bank=clone(oldBank);for(const [,ordinal] of excluded)bank[ordinal-1].solutionImage='assets/synthetic-changed-'+ordinal+'.svg';
 const bytes=sourceBytes(bank);write('archive/exams/'+source,bytes);
 git('add','.');git('commit','-qm','synthetic changed neighbours');const currentCommit=git('rev-parse','HEAD');
 const priorRef={path:priorPath,sha256:sha(priorBytes)};
 const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:childId,examUid:prior.examUid,
  sourceArchiveFile:source,expectedSourceBlobSha1:blob(bytes),expectedQuestionCount:24,scope:'PARTIAL_UIDS',registryChanges:[],
  approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'existing-authority-preservation',evidenceRefs:[priorRef],
   sourceRebind:{schemaVersion:'archive-native-partial-subset-preservation-v1',priorCommit,currentCommit,priorReceiptRef:priorRef,
    selectedQuestionUids:selected.map(([uid])=>uid),excludedQuestionUids:excluded.map(([uid])=>uid)}},
  items:selected.map(([uid,ordinal])=>({questionUid:uid,sourceOrdinal:ordinal,before:{},after:{},reason:'Unchanged original authority only',evidenceRefs:[priorRef]}))};
 const args={root,envelope:request,prior,bytes,bank,metadata:clone(metadata),identities:clone(identities),runtime:clone(runtime),mode:'request'};
 function issue() {
  const revision='meta-foundation:MIDDLE2@1.0.3:exam-final_qa-v2:'+childId;
  const take=rows=>rows.slice(0,4).map(row=>({...clone(row),metadataRevision:revision,approvalEvidence:[priorPath,childPath]}));
  const child={schemaVersion:'archive-reviewed-exam-meta-registration-v2',requestId:childId,requestSha256:sha(stable(request)),
   examUid:prior.examUid,sourceArchiveFile:source,sourceBlobSha1:blob(bytes),sourceRawSha256:sha(bytes),expectedQuestionCount:24,
   scope:'PARTIAL_UIDS',partialUidCount:4,totalQuestions:4,metadataRegistrationStatus:'REGISTERED',newMetadataApprovals:0,
   preservedMetadataApprovals:4,registryChanges:[],fingerprintRepairs:[],nativeParentBindings:[],approval:clone(request.approval),
   appliedRecords:take(metadata),appliedIdentityRecords:clone(identities.slice(0,4)),runtimeRecords:take(runtime)};
  write(childPath,json(child));
  return {child,args:{...args,envelope:child,metadata:clone(child.appliedRecords),identities:clone(child.appliedIdentityRecords),runtime:clone(child.runtimeRecords),mode:'receipt'}};
 }
 return {root,write,git,oldBank,oldBytes,priorBytes,args,request,prior,metadata,identities,runtime,issue};
}
function nativeArgs(f,child,index,revalidateLeaf) {
 return {receipt:child,nativeSource:{root:f.root,bytes:f.args.bytes,blobSha1:blob(f.args.bytes),bank:f.args.bank,
   runtimeRecord:child.runtimeRecords[index],runtimeStatus:'ACTIVE'},question:f.args.bank[child.appliedRecords[index].sourceOrdinal-1],
  identity:child.appliedIdentityRecords[index],ordinal:child.appliedRecords[index].sourceOrdinal,current:child.appliedRecords[index],registry:{},revalidateLeaf};
}

test('exact four preserve an immutable original seven without changing the three excluded rows',async t=>{
 const m=await mod,f=fixture(t),before=sha(json(f.prior));const out=m.validatePartialSubsetPreservation(f.args);
 assert.equal(out.priorApprovalCount,7);assert.equal(out.preservedMetadataApprovals,4);assert.equal(out.newMetadataApprovals,0);
 assert.deepEqual(out.selectedQuestionUids,selected.map(([uid])=>uid));assert.deepEqual(out.excludedQuestionUids,excluded.map(([uid])=>uid));
 assert.equal(sha(json(f.prior)),before);assert.deepEqual(f.args.metadata.slice(4),f.prior.appliedRecords.slice(4));
});

const negativeCases=[
 ['empty selection',f=>{f.request.items=[];f.request.approval.sourceRebind.selectedQuestionUids=[];}],
 ['duplicate selected UID',f=>{f.request.items[1]=clone(f.request.items[0]);}],
 ['foreign selected UID',f=>{f.request.items[0].questionUid='qid_v1_foreign';}],
 ['changed neighbour substituted for a selected UID',f=>{f.request.items[0].questionUid=excluded[0][0];f.request.items[0].sourceOrdinal=6;}],
 ['attempt to promote the original seven as current',f=>{f.request.approval.sourceRebind.selectedQuestionUids=pairs.map(([uid])=>uid);}],
 ['incomplete excluded partition',f=>{f.request.approval.sourceRebind.excludedQuestionUids.pop();}],
 ['overlapping selected and excluded partitions',f=>{f.request.approval.sourceRebind.excludedQuestionUids[0]=selected[0][0];}],
 ['wrong source path',f=>{f.request.sourceArchiveFile='original/middle/m2/2final/not-e032.js';}],
 ['wrong selected ordinal',f=>{f.request.items[0].sourceOrdinal=1;}],
 ['wrong current source pin',f=>{f.request.expectedSourceBlobSha1='1'.repeat(40);}],
 ['forged original receipt digest',f=>{f.request.approval.sourceRebind.priorReceiptRef.sha256='1'.repeat(64);}],
 ['wrong historical source commit',f=>{f.request.approval.sourceRebind.priorCommit=f.request.approval.sourceRebind.currentCommit;}],
 ['wrong current source commit',f=>{f.request.approval.sourceRebind.currentCommit=f.request.approval.sourceRebind.priorCommit;}],
 ['missing fixed Git history fails closed',f=>{f.request.approval.sourceRebind.currentCommit='1'.repeat(40);}],
 ['unknown typed marker field',f=>{f.request.approval.sourceRebind.allowChanged=true;}],
 ['removed typed marker',f=>{delete f.request.approval.sourceRebind;}],
 ['nonempty before patch',f=>{f.request.items[0].before.difficulty5=3;}],
 ['after patch cannot create a new approval',f=>{f.request.items[0].after.difficulty5=1;}],
 ['registry addition cannot use preservation',f=>{f.request.registryChanges.push({definition:'new'});}],
 ['item source review cannot be smuggled into preservation',f=>{f.request.items[0].sourceReview={approved:true};}],
 ['current identity drift',f=>{f.args.identities[0].sourceFingerprint='1'.repeat(64);}],
 ['current runtime evidence drift',f=>{f.args.runtime[0].approvalEvidence.push('unapproved.json');}],
 ['current runtime revision drift',f=>{f.args.runtime[0].metadataRevision='unapproved';}],
 ['current metadata field hold cannot be erased',f=>{f.args.metadata[0].fieldStatus={difficulty5:'HOLD'};}],
 ['selected student text drift',f=>{f.args.bank[1].content='changed';}],
 ['selected renderer insertion',f=>{f.args.bank[1].image='assets/new.svg';}],
 ['original receipt byte mutation',f=>{f.write(priorPath,json({...f.prior,extra:true}));}],
 ['original approval evidence mutation',f=>{f.write('proof.json',json({changed:true}));}],
 ...['difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility'].map(field=>[
  'preserved D5 field stays exact: '+field,f=>{f.args.metadata[0][field]='mutated';}]),
 ['ordinary receipt schema is not a request schema',f=>{f.request.schemaVersion='archive-reviewed-exam-meta-registration-v2';}],
 ['non-FINAL original authority',f=>{f.prior.approval.type='BASIC';}]
];
for(const [name,mutate] of negativeCases)test(name,async t=>{
 const m=await mod,f=fixture(t);mutate(f);assert.throws(()=>m.validatePartialSubsetPreservation(f.args));
});

test('equal old/current opaque svg carriers still fail asset-free scope',async t=>{
 const m=await mod,f=fixture(t,{svg:true});assert.throws(()=>m.validatePartialSubsetPreservation(f.args),/ASSET/);
});
test('issued four replay exact current state; widening, new approval and evidence tamper fail',async t=>{
 const m=await mod,f=fixture(t),issued=f.issue();assert.equal(m.validatePartialSubsetPreservation(issued.args).preservedMetadataApprovals,4);
 for(const mutate of [a=>a.envelope.partialUidCount=7,a=>a.envelope.newMetadataApprovals=1,
  a=>a.metadata[0].difficulty5=1,a=>a.runtime[0].approvalEvidence.pop(),a=>a.envelope.schemaVersion=f.request.schemaVersion]){
  const a={...issued.args,envelope:clone(issued.child),metadata:clone(issued.args.metadata),identities:clone(issued.args.identities),runtime:clone(issued.args.runtime)};
  mutate(a);assert.throws(()=>m.validatePartialSubsetPreservation(a));
 }
});
test('current four each replay original native authority; excluded three cannot become child leaves',async t=>{
 const m=await mod,f=fixture(t),{child}=f.issue(),seen=[];
 for(let i=0;i<4;i++)assert.equal(m.nativePreservedSourceRebind(nativeArgs(f,child,i,ctx=>{
  seen.push(ctx.current.questionUid);assert.equal(ctx.current.metadataRevision,f.prior.appliedRecords[i].metadataRevision);
  assert.equal(ctx.nativeSource.blobSha1,f.prior.sourceBlobSha1);return priorPath;
 })),true);
 assert.deepEqual(seen,selected.map(([uid])=>uid));
 for(const [uid,ordinal] of excluded)assert.throws(()=>m.nativePreservedSourceRebind({...nativeArgs(f,child,0,()=>{throw Error('excluded leaf ran');}),
  identity:f.identities.find(row=>row.questionUid===uid),current:f.metadata.find(row=>row.questionUid===uid),ordinal,question:f.args.bank[ordinal-1]}));
 assert.throws(()=>m.nativePreservedSourceRebind(nativeArgs(f,child,0,()=>null)),/cannot replay/);
});
test('triple-marker deletion retains an obligation and refuses before any native leaf',async t=>{
 const m=await mod,f=fixture(t),{child}=f.issue();delete child.approval.sourceRebind;delete child.newMetadataApprovals;delete child.preservedMetadataApprovals;
 child.approval.evidenceRefs=[];f.write(childPath,json(child));let leafCalls=0;
 assert.equal(m.hasPartialSubsetPreservationFingerprint(child),true);assert.equal(m.isPartialNativeSourcePreservation(child,f.root),true);
 assert.equal(m.hasNativeSourcePreservationClaim({root:f.root,current:child.appliedRecords[0],runtimeRecord:child.runtimeRecords[0],
  nativeSource:{bytes:f.args.bytes,blobSha1:blob(f.args.bytes),bank:f.args.bank}}),true);
 assert.throws(()=>m.nativePreservedSourceRebind(nativeArgs(f,child,0,()=>{leafCalls++;return priorPath;})));
 assert.equal(leafCalls,0);
});
test('fingerprint is limited to this child4 obligation, never original7 or unrelated ordinary receipts',async t=>{
 const m=await mod,f=fixture(t),{child}=f.issue();assert.equal(m.hasPartialSubsetPreservationFingerprint(child),true);
 assert.equal(m.hasPartialSubsetPreservationFingerprint(f.prior),false);
 for(const mutate of [r=>r.sourceArchiveFile='other.js',r=>r.appliedRecords[0].questionUid='foreign',
  r=>r.appliedRecords[0].approvalEvidence=[],r=>r.runtimeRecords.pop()]){
  const r=clone(child);mutate(r);assert.equal(m.hasPartialSubsetPreservationFingerprint(r),false);
 }
});

test('typed Consumer routing alone never grants approval without actual Consumer and replay proof',async t=>{
 const {verifyChangedUidConsumerApproval}=await import('../archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs');
 const f=fixture(t),requestPath='.archive-meta-register/inbox/synthetic-e032.json';f.write(requestPath,json(f.request));
 const result=verifyChangedUidConsumerApproval({root:f.root,requestPaths:[requestPath]});
 assert.equal(result.status,'FAIL');assert.equal(result.counts.passed,0);
 assert.equal(result.exams[0].kind,'native-approval-preservation');
 assert(result.failures.some(row=>row.reason==='CONSUMER_LOAD_FAILED'));
});

test('Consumer rejects unknown typed schemas, nonempty patches, registry changes and nonpartial scope',async t=>{
 const {verifyChangedUidConsumerApproval}=await import('../archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs');
 const f=fixture(t),requestPath='.archive-meta-register/inbox/synthetic-e032.json';
 for(const mutate of [r=>r.approval.sourceRebind.schemaVersion='unknown-subset-schema',r=>r.items[0].after.difficultyBucket=1,
  r=>r.registryChanges.push({unapproved:true}),r=>delete r.scope]){
  const request=clone(f.request);mutate(request);f.write(requestPath,json(request));
  const result=verifyChangedUidConsumerApproval({root:f.root,requestPaths:[requestPath]});
  assert.equal(result.status,'FAIL');assert.equal(result.counts.passed,0);
  assert(result.failures.some(row=>row.reason==='INVALID_REQUEST'));
 }
});

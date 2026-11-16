import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';
import {m2ProviderRendererFixture,stable,sha} from './helpers/m2-provider-current-renderer-fixture.mjs';
import {validateM2ProviderCurrentRendererContinuity} from '../archive/tools/meta-foundation/reviewed-m2-provider-current-renderer-continuity.mjs';
import {validateReviewedSourceReassessment} from '../archive/tools/meta-foundation/reviewed-source-reassessment.mjs';
import {registerReviewedExamV2} from '../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs';
import {nativeReviewReceipt,planQuestion} from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';
import {validateNativeReviewedSourceReuse,hasNativeReviewedSourceClaim} from '../archive/tools/meta-foundation/native-reviewed-source-reuse.mjs';

test('provider renderer exact seven-field view still requires the original v1 finalized CC authority',t=>{
 const f=m2ProviderRendererFixture(t),before=stable(f.current),view=validateM2ProviderCurrentRendererContinuity(f.args);
 assert.deepEqual(view.semanticQuestion,f.prefigure);assert.equal(stable(f.current),before);
 assert.equal(view.proof.suppliesDefinitionApprovals,false);assert.equal(view.proof.suppliesMetadataValues,false);
 const proof=validateReviewedSourceReassessment(f.args);
 assert.deepEqual(proof.m2ProviderRendererContinuity,view.proof);
 assert.equal(proof.proposalFinalization.schemaVersion,'archive-native-proposal-finalization-v1');
 assert.deepEqual(proof.proposalFinalization.finalizedFields.crossConceptKeys,['CC_FINAL']);
 assert.equal(proof.m2RendererContinuity,undefined);assert.equal(proof.rendererContinuity,undefined);
});

test('official provider renderer registration and exact old/current cursor reuse preserve the original authority',t=>{
 const f=m2ProviderRendererFixture(t),source=fs.readFileSync(path.join(f.root,f.sourcePath));
 assert.equal(registerReviewedExamV2({root:f.root,request:f.request}).status,'PASS');
 assert.equal(registerReviewedExamV2({root:f.root,request:f.request,write:true}).status,'PASS');
 const replay=registerReviewedExamV2({root:f.root,request:f.request});assert.equal(replay.replay,true);assert.deepEqual(replay.plannedPaths,[]);
 const c=f.runtimeContext();assert.equal(validateNativeReviewedSourceReuse(c.receipt,c.nativeSource,c.question,c.identity,c.ordinal,c.current,c.registry),true);
 for(const previous of [c.previous,structuredClone(c.question)]){const result=planQuestion({...c,previous});assert.equal(result.status,'ALREADY_REGISTERED',JSON.stringify(result));assert.equal(result.nativeReviewReceipt,c.receiptPath);assert.equal(result.final,undefined);}
 assert.deepEqual(fs.readFileSync(path.join(f.root,f.sourcePath)),source);
});

for(const[label,mutate]of[
 ['missing original finalization',f=>{delete f.patch.sourceReview.proposalFinalization;}],
 ['different original finalization schema',f=>{f.patch.sourceReview.proposalFinalization.schemaVersion='archive-native-proposal-finalization-v3';}],
 ['retained authority mixed into provider',f=>{f.patch.sourceReview.retainedFields={};}],
 ['old M2 renderer opt-in mixed in',f=>{f.patch.sourceReview.m2RendererProof={};}],
 ['M3 renderer opt-in mixed in',f=>{f.patch.sourceReview.rendererProof={};}],
 ['source-only preservation',f=>{f.request.approval.sourceRebind={};}],
 ['extra registry mutation',f=>{f.request.registryChanges.push(structuredClone(f.registryChange));}],
 ['replacement instead of add-only',f=>{f.registryChange.before={};}],
 ['different frozen definition',f=>{f.definition.definition='Changed unapproved definition.';f.witnessRow.registryChangeSha256=sha(stable(f.registryChange));f.reseal();}],
 ['wrong full source blob',f=>{f.request.expectedSourceBlobSha1='0'.repeat(40);}],
 ['wrong final primary value',f=>{f.patch.after.templateKey='TPL_OTHER';f.args.final.templateKey='TPL_OTHER';}],
 ['missing current solution item evidence',f=>{f.patch.evidenceRefs=f.patch.evidenceRefs.filter(r=>r.path!==f.newSolution);}],
 ['missing old solution approval evidence',f=>{f.request.approval.evidenceRefs=f.request.approval.evidenceRefs.filter(r=>r.path!==f.oldSolution);}],
 ['missing frozen request bytes',f=>{fs.unlinkSync(path.join(f.root,f.frozenCopy));}],
])test('provider renderer refuses '+label,t=>{const f=m2ProviderRendererFixture(t);mutate(f);assert.throws(()=>validateReviewedSourceReassessment(f.args));});

for(const[label,mutate]of[
 ['same native reviewer',f=>{f.witness.reviewer='native-author';}],
 ['same transport author',f=>{f.witness.reviewer='transport-author';}],
 ['new definition approval claim',f=>{f.witness.newDefinitionApprovals=1;}],
 ['new math approval claim',f=>{f.witness.newMathematicalQa=true;}],
 ['unknown authority claim',f=>{f.witness.newPrimaryApproval=true;}],
 ['missing actual solution observation',f=>{f.witnessRow.visualChecks.originalAndCurrentSolutionObserved=false;}],
 ['missing caption support',f=>{f.witnessRow.visualChecks.currentCaptionsSupportedByExistingExplanation=false;}],
 ['wrong selected UID',f=>{f.witnessRow.questionUid='wrong';}],
 ['wrong ordinal',f=>{f.witnessRow.sourceOrdinal=2;}],
 ['wrong denominator',f=>{f.witnessRow.expectedQuestionCount=2;}],
 ['missing current solution asset',f=>{f.witnessRow.currentAssets.pop();}],
 ['changed original registry digest',f=>{f.witnessRow.registryChangeSha256='0'.repeat(64);}],
])test('truthfully reauthored provider visual witness rejects '+label,t=>{const f=m2ProviderRendererFixture(t);mutate(f);f.reseal();assert.throws(()=>validateReviewedSourceReassessment(f.args));});

for(const field of ['content','answer','solution'])test('truthful metadata axis cannot replace production student '+field,t=>{
 const f=m2ProviderRendererFixture(t,{productionStudentDelta:{[field]:'different production value'}});
 assert.throws(()=>validateM2ProviderCurrentRendererContinuity(f.args),/metadata axis/);
});
for(const extraDelta of [{content:'different stem'},{solution:'different explanation'},{choices:['b','a']},
 {imageSize:'full'},{image:['assets/current-problem.svg']},{solutionImageSize:'full'}])test('truthful provider current snapshots cannot expand '+Object.keys(extraDelta)[0],t=>{
 const f=m2ProviderRendererFixture(t,{extraDelta});assert.throws(()=>validateReviewedSourceReassessment(f.args));
});
test('provider metadata axis cannot append an unapproved field',t=>{const f=m2ProviderRendererFixture(t,{metadataAppend:{newQaClaim:'unapproved'}});assert.throws(()=>validateM2ProviderCurrentRendererContinuity(f.args),/metadata axis/);});
test('actual current solution bytes remain fresh even with the immutable Git cache populated',t=>{
 const f=m2ProviderRendererFixture(t);validateReviewedSourceReassessment(f.args);fs.appendFileSync(path.join(f.root,f.newSolution),' ');
 assert.throws(()=>validateReviewedSourceReassessment(f.args),/live evidence changed/);
});
test('renderer transport never replaces actual independent definition authentication',t=>{
 const f=m2ProviderRendererFixture(t);validateM2ProviderCurrentRendererContinuity(f.args);
 fs.appendFileSync(path.join(f.root,f.finalRef.path),' ');assert.throws(()=>validateReviewedSourceReassessment(f.args),/evidence|SHA|bound/);
});
test('removing the provider opt-in restores strict native student payload equality',t=>{
 const f=m2ProviderRendererFixture(t);delete f.patch.sourceReview.m2ProviderRendererProof;
 assert.throws(()=>validateReviewedSourceReassessment(f.args),/current student payload differs/);
});
for(const currentSolutionSvg of ['<svg><image href="other.png"/></svg>','<svg><script>1</script></svg>',
 '<svg><path style="fill:url(other.svg#x)"/></svg>',
 '<svg><animate attributeName="x" values="0;1" dur="1s"/></svg>',
 '<svg xmlns:s="http://www.w3.org/2000/svg"><s:animateTransform attributeName="transform" type="rotate"/></svg>',
 '<svg><animateMotion dur="1s" path="M0 0L1 1"/></svg>',
 '<svg><set attributeName="fill" to="red"/></svg>',
 '<svg><discard begin="1s"/></svg>',
 '<svg><style>@import "external.css";</style></svg>',
 '<?xml-stylesheet href="external.css"?><svg/>',
 '<svg><style>@keyframes move {to {opacity:0}}</style></svg>'])test('truthful provider solution SVG cannot introduce external or dynamic dependencies '+currentSolutionSvg.slice(0,40),t=>{
 const f=m2ProviderRendererFixture(t,{currentSolutionSvg});assert.throws(()=>validateReviewedSourceReassessment(f.args));
});

function strip(f,c){
 const sidecar=c.receipt.outputDigests.find(r=>r.path.endsWith('.source-review-binding.json')).path;
 delete c.receipt.fingerprintRepairs;c.receipt.outputDigests=c.receipt.outputDigests.filter(r=>r.path!==sidecar);
 for(const row of[c.current,c.nativeSource.runtimeRecord,...c.receipt.appliedRecords,...c.receipt.runtimeRecords]){row.approvalEvidence=[];delete row.metadataRevision;}
 c.receipt.approval.evidenceRefs=c.receipt.approval.evidenceRefs.filter(r=>r.path!==f.witnessPath);
 fs.unlinkSync(path.join(f.root,sidecar));fs.unlinkSync(path.join(f.root,f.witnessPath));f.put(c.receiptPath,c.receipt);
}
for(const[label,mutate]of[
 ['current solution drift',(f,c)=>{fs.appendFileSync(path.join(f.root,f.newSolution),' ');}],
 ['missing original definition proof',(f,c)=>{fs.unlinkSync(path.join(f.root,f.finalRef.path));}],
 ['missing issued proof repair',(f,c)=>{delete c.receipt.fingerprintRepairs[0].sourceReview.m2ProviderRendererContinuity;}],
 ['all live provenance stripped',strip],
 ['all provenance stripped in a new commit',(f,c)=>{strip(f,c);f.commit();}],
 ['all provenance stripped through a merge',(f,c)=>{const witnessed=f.git('rev-parse','HEAD'),prior=f.git('rev-parse','HEAD^'),tree=f.git('rev-parse',prior+'^{tree}'),sibling=f.git('commit-tree',tree,'-p',prior,'-m','Synthetic no-witness sibling');strip(f,c);f.git('add','-A');const merged=f.git('commit-tree',f.git('write-tree'),'-p',witnessed,'-p',sibling,'-m','Synthetic merge deletes current proof');f.git('update-ref','HEAD',merged);}],
])test('issued provider transport cannot fall back to ordinary approval: '+label,t=>{
 const f=m2ProviderRendererFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});const c=f.runtimeContext();mutate(f,c);f.put(c.receiptPath,c.receipt);
 assert.equal(hasNativeReviewedSourceClaim({root:f.root,current:c.current,runtimeRecord:c.nativeSource.runtimeRecord}),true);
 for(const previous of[c.previous,structuredClone(c.question)]){const result=planQuestion({...c,previous});assert.equal(result.status,'SUPPLEMENT_PENDING',JSON.stringify(result));assert.equal(result.nativeReviewReceipt,undefined);assert.equal(result.final,undefined);}
});

test('source-only descendant preserves the complete provider proof obligation',t=>{
 const f=m2ProviderRendererFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});const c=f.runtimeContext(),priorRef={path:c.receiptPath,sha256:sha(fs.readFileSync(path.join(f.root,c.receiptPath)))},sidecar=c.receipt.outputDigests.find(r=>r.path.endsWith('.source-review-binding.json'));
 fs.appendFileSync(path.join(f.root,f.sourcePath),'// only source container formatting\n');
 const request={schemaVersion:f.request.schemaVersion,scope:'PARTIAL_UIDS',requestId:'provider-renderer-source-only-descendant',examUid:f.request.examUid,sourceArchiveFile:f.request.sourceArchiveFile,expectedQuestionCount:1,expectedSourceBlobSha1:f.git('hash-object','-w',f.sourcePath),approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'synthetic preservation author',sourceRebind:{priorReceiptRef:priorRef},evidenceRefs:[priorRef,sidecar,...f.request.approval.evidenceRefs]},registryChanges:[],items:[{questionUid:'uid1',sourceOrdinal:1,before:{},after:{},reason:'Preserve the complete original provider cohort.',evidenceRefs:[priorRef,sidecar,...f.patch.evidenceRefs]}]};
 assert.equal(registerReviewedExamV2({root:f.root,request,write:true}).status,'PASS');
 const nextPath=c.receiptPath.replace(f.request.requestId,request.requestId),receipt=f.read(nextPath),current=receipt.appliedRecords[0],identity=receipt.appliedIdentityRecords[0],nativeSource={...c.nativeSource,bytes:fs.readFileSync(path.join(f.root,f.sourcePath)),blobSha1:request.expectedSourceBlobSha1,runtimeRecord:receipt.runtimeRecords[0]};
 const args={...c,current,identity,nativeSource};assert.equal(planQuestion(args).nativeReviewReceipt,nextPath);
 fs.unlinkSync(path.join(f.root,f.witnessPath));assert.equal(planQuestion(args).status,'SUPPLEMENT_PENDING');
});

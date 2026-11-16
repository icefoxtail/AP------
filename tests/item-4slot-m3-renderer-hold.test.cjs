'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{execFileSync}=require('node:child_process');
const mod=require('../tools/4slot/build-4slot-runtime.cjs');
const consumer=require('../archive/item-4slot.js');
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const uid=n=>'qid_v1_'+String(n).padStart(64,'0');
function fixture(t, sourceFields={}) {
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'m3-renderer-hold-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const save=(p,v)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'?v:JSON.stringify(v));};
 const git=(...args)=>execFileSync('git',['-C',root,...args],{encoding:'utf8',stdio:['ignore','pipe','pipe']});
 const commit=message=>{git('add','.');git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-qm',message);return git('rev-parse','HEAD').trim();};
 const source='original/middle/m3/2mid/renderer-fixture.js',rel='archive/data/item-4slot/'+source.replace(/\.js$/,'.4slot.json'),asset='archive/assets/images/renderer-fixture/q1-solution.svg';
 const bank=[{id:1,content:'Question one',choices:[],answer:'one',solution:'An unchanged solution',solutionImage:asset.slice(8),...sourceFields},{id:2,content:'Question two',choices:[],answer:'two',solution:'An unchanged neighbor'}];
 const js=()=>'window.questionBank='+JSON.stringify(bank)+';';
 const dict={dictionaryVersion:'term-dict-v1.5-2026-11-04',terms:[{id:1,ko:'given'},{id:2,ko:'goal'},{id:3,ko:'method'}]};
 const data={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:source,sourceGitBlobSha:mod.blob(js()),dictionaryVersion:dict.dictionaryVersion,evidence:{branch:'review/fixture',commit:'a'.repeat(40),path:'review.json'},reviewedBy:{agent:'fixture-reviewer',at:'2026-11-15',sampled:[1]},items:bank.map(q=>({ordinal:q.id,format:'단일 정답',given:[1],goal:[2],method:[3],condition:[],candidates:[]}))};
 const identity={records:bank.map((q,i)=>({questionUid:uid(i+1),sourceArchiveFile:source,sourceOrdinal:i+1,sourceQuestionNo:String(q.id),sourceFingerprint:mod.identityHash(q)}))};
 const supPath='docs/operations/fixture/renderer-supersession.json',proofPath='docs/operations/fixture/renderer-hold.json';
 const sup={schemaVersion:'archive-m3s2-four-slot-renderer-supersession-v1',status:'ONE_UID_WITHHELD_PENDING_EXACT_SOURCE_CORRECTION',questionUid:uid(1),sourceOrdinal:1,sourceArchiveFile:source,operationalHold:{heldUidCount:1,omittedOrdinals:[1]},revokedEvidence:{commit:'a'.repeat(40),path:'old-review.json',sha256:'b'.repeat(64),reviewStatus:'PASS_SCOPED_RENDERER_CONTINUITY'}};
 save('archive/exams/'+source,js());save(asset,'<svg xmlns="http://www.w3.org/2000/svg"><path d="M1 1L2 2"/></svg>');save(supPath,sup);
 git('init','-q');const sourceCommit=commit('immutable source and negative supersession');
 const supersessionEvidence={commit:sourceCommit,path:supPath,sha256:mod.sha(fs.readFileSync(path.join(root,supPath)))};
 const proof={schemaVersion:'m3-s2-renderer-correction-registration-hold-v1',reason:'SOURCE_RENDERER_CORRECTION_PENDING',decision:'WITHHOLD_REGISTRATION',heldUidCount:1,replacesInterimMissingRow:true,newSemanticApprovals:0,newDifficultyApprovals:0,sourceWrites:0,reviewer:data.reviewedBy.agent,nextAction:'Publish the independently reviewed correction, then rebind only this item.',questionUid:uid(1),sourceOrdinal:1,sourceQuestionNo:'1',ordinal:1,sourceArchiveFile:source,fingerprintContract:'4slot-student-payload-v1',studentPayloadSha256:mod.payloadHash(bank[0]),sourceFingerprint:mod.identityHash(bank[0]),originalCompactRowSha256:mod.sha(stable(data.items[0])),sourceRef:{commit:sourceCommit,path:'archive/exams/'+source,gitBlobSha1:data.sourceGitBlobSha,sha256:mod.sha(js())},supersessionEvidence,revokedEvidence:sup.revokedEvidence,incorrectRenderer:{role:'solutionImage',path:asset,sha256:mod.sha(fs.readFileSync(path.join(root,asset)))}};
 save(proofPath,proof);const proofCommit=commit('immutable current-item hold');
 const ref={commit:proofCommit,path:proofPath,sha256:mod.sha(fs.readFileSync(path.join(root,proofPath)))};
 data.evidence.nativeHoldReview={rendererCorrection:ref,supersession:supersessionEvidence};
 data.items[0].registrationHold={schemaVersion:'4slot-native-review-hold-v1',reason:proof.reason,questionUid:uid(1),sourceOrdinal:1,sourceQuestionNo:'1',ordinal:1,studentPayloadSha256:proof.studentPayloadSha256,sourceFingerprint:proof.sourceFingerprint,sourceGitBlobSha:data.sourceGitBlobSha,evidence:ref,supersessionEvidence,nextAction:proof.nextAction};
 const write=()=>{save(rel,data);save('docs/architecture/4slot/term-dictionary-v1.5.json',dict);save('archive/data/question_identity_map.json',identity);};write();
 function resign(){save(proofPath,proof);const ref={commit:commit('changed proof fixture'),path:proofPath,sha256:mod.sha(fs.readFileSync(path.join(root,proofPath)))};data.items[0].registrationHold.evidence=ref;data.evidence.nativeHoldReview.rendererCorrection=ref;write();}
 return {root,save,git,commit,source,rel,asset,bank,js,data,proof,proofPath,sup,supPath,identity,write,resign};
}
function heldOnly(f){const built=mod.build(f.root);assert.equal(built.index.counts.items,2);assert.equal(built.index.records.length,1);assert.equal(built.index.records[0].questionUid,uid(2));assert.equal(consumer.createIndex(built.index).get(uid(1)),null);return built.index;}
test('M3 renderer hold keeps all valid slot rows and excludes exactly one UID',t=>{const f=fixture(t),before=JSON.stringify(f.data.items[0]),index=heldOnly(f);assert.equal(index.pending[0].reason,'EXPLICIT_REVIEW_HOLD:SOURCE_RENDERER_CORRECTION_PENDING');assert.equal(index.pending[0].questionUid,uid(1));assert.equal(mod.verify(index).verified,1);assert.equal(JSON.stringify(f.data.items[0]),before);});
for(const fault of ['uid','ordinal','number','empty-next-action','wrong-commit','proof-bytes','supersession-bytes','missing-proof','wrong-scope','empty-method','slot-substitution','asset-bytes','unrelated-source-field'])test('M3 renderer hold fails closed for '+fault,t=>{
 const f=fixture(t),h=f.data.items[0].registrationHold;
 if(fault==='uid')h.questionUid=uid(2);
 if(fault==='ordinal')h.sourceOrdinal=2;
 if(fault==='number')h.sourceQuestionNo='2';
 if(fault==='empty-next-action')h.nextAction='';
 if(fault==='wrong-commit'){h.evidence={...h.evidence,commit:'f'.repeat(40)};f.data.evidence.nativeHoldReview.rendererCorrection=h.evidence;}
 if(fault==='proof-bytes')f.save(f.proofPath,{...f.proof,changed:true});
 if(fault==='supersession-bytes')f.save(f.supPath,{...f.sup,changed:true});
 if(fault==='missing-proof')fs.unlinkSync(path.join(f.root,f.proofPath));
 if(fault==='wrong-scope'){f.data.sourceArchiveFile=f.source.replace('m3/2mid','m2/2mid');const rel='archive/data/item-4slot/'+f.data.sourceArchiveFile.replace(/\.js$/,'.4slot.json');f.save('archive/exams/'+f.data.sourceArchiveFile,f.js());f.identity.records.forEach(r=>{r.sourceArchiveFile=f.data.sourceArchiveFile;});f.save(rel,f.data);fs.unlinkSync(path.join(f.root,f.rel));f.save('archive/data/question_identity_map.json',f.identity);const index=mod.build(f.root).index;assert.equal(index.records.length,1);assert.match(index.pending[0].reason,/UNSUPPORTED_HOLD_SCOPE/);return;}
 if(fault==='empty-method')f.data.items[0].method=[];
 if(fault==='slot-substitution')f.data.items[0].method=[2];
 if(fault==='asset-bytes')f.save(f.asset,'<svg>corrected but not yet rebound</svg>');
 if(fault==='unrelated-source-field'){f.bank[1].tagStatus='new';f.save('archive/exams/'+f.source,f.js());}
 f.write();const index=heldOnly(f);assert.ok(index.pending[0].reason.includes('INVALID_REGISTRATION_HOLD')||index.pending[0].reason.includes('REQUIRED_SLOT_EMPTY'));
});
for(const fault of ['new-approval','wrong-decision','payload','proof-uid','source-ref','renderer-role','different-supersession'])test('an immutable but invalid M3 proof cannot grant registration: '+fault,t=>{
 const f=fixture(t);
 if(fault==='new-approval')f.proof.newSemanticApprovals=1;
 if(fault==='wrong-decision')f.proof.decision='REGISTER';
 if(fault==='payload')f.proof.studentPayloadSha256='0'.repeat(64);
 if(fault==='proof-uid')f.proof.questionUid=uid(2);
 if(fault==='source-ref')f.proof.sourceRef.path=f.proof.sourceRef.path.replace('renderer-fixture','other');
 if(fault==='renderer-role')f.proof.incorrectRenderer.role='problemImage';
 if(fault==='different-supersession')f.proof.revokedEvidence={...f.proof.revokedEvidence,sha256:'0'.repeat(64)};
 f.resign();assert.match(heldOnly(f).pending[0].reason,/INVALID_REGISTRATION_HOLD/);
});
test('changed held solution is stale before any explicit hold is considered',t=>{const f=fixture(t);f.bank[0].solution='Changed';f.save('archive/exams/'+f.source,f.js());assert.equal(heldOnly(f).pending[0].reason,'STALE_STUDENT_PAYLOAD');});
test('cached hold observes changes in its second immutable evidence file',t=>{const f=fixture(t);mod.run(f.root,{write:true});f.save(f.supPath,{...f.sup,changed:true});const index=heldOnly(f);assert.match(index.pending[0].reason,/HOLD_EVIDENCE_SHA_MISMATCH:supersession/);});

function correctedHoldFixture(t, sourceFields={}) {
 const f=fixture(t,sourceFields),sourcePath='archive/exams/'+f.source,oldQuestion=structuredClone(f.bank[0]);
 const correctedAsset=f.asset.replace('.svg','-corrected.svg'),correctedBytes='<svg xmlns="http://www.w3.org/2000/svg"><path d="M1 1L2 3"/></svg>';
 const afterBank=structuredClone(f.bank);afterBank[0].solutionImage=correctedAsset.slice(8);afterBank[0].solutionImageAlt='The independently reviewed corrected renderer';
 const afterJs='window.questionBank='+JSON.stringify(afterBank)+';';
 const sourceAfter={path:sourcePath,gitBlobSha1:mod.blob(afterJs),sha256:mod.sha(afterJs)};
 const assetAfter={path:correctedAsset,gitBlobSha1:mod.blob(correctedBytes),sha256:mod.sha(correctedBytes)};
 const independentPath='.archive-meta-register/evidence/fixture/corrected-renderer-review.json';
 const independent={schemaVersion:'archive-narrow-solution-renderer-correction-independent-review-v1',decision:'APPROVE_EXACT_RENDERER_CORRECTION_AND_ALT_ONLY',questionUid:uid(1),sourceOrdinal:1,beforeSourceRef:f.proof.sourceRef,proposedSourceRef:sourceAfter,beforeQuestionStableSha256:mod.sha(stable(oldQuestion)),afterQuestionStableSha256:mod.sha(stable(afterBank[0])),changedSourceFields:['solutionImage','solutionImageAlt'],sourceQuestionCount:2,unselectedQuestionsUnchanged:1,assetBefore:{commit:f.proof.sourceRef.commit,path:f.asset,gitBlobSha1:mod.blob(fs.readFileSync(path.join(f.root,f.asset))),sha256:f.proof.incorrectRenderer.sha256},assetAfter,metadataApprovalsAdded:0,difficultyJudgmentsAdded:0,fullMathematicalQa:false,newReviewPassCount:0,sourceWrites:0,requestWrites:0};
 const independentSha=mod.sha(JSON.stringify(independent));
 f.sup.independentCorrectionReview={sha256:independentSha};
 f.sup.proposedCorrection={sourcePath,sourceBlobSha1:sourceAfter.gitBlobSha1,sourceSha256:sourceAfter.sha256,assetPath:assetAfter.path,assetBlobSha1:assetAfter.gitBlobSha1,assetSha256:assetAfter.sha256,changedSourceFields:['solutionImage','solutionImageAlt']};
 f.save(f.supPath,f.sup);const supCommit=f.commit('bind the existing independent correction in the negative decision');
 const supRef={commit:supCommit,path:f.supPath,sha256:mod.sha(JSON.stringify(f.sup))};
 f.proof.supersessionEvidence=supRef;f.proof.correctionOwnerEvidence={sha256:independentSha,correctedAssetSha256:assetAfter.sha256};
 f.data.items[0].registrationHold.supersessionEvidence=supRef;f.data.evidence.nativeHoldReview.supersession=supRef;f.resign();
 const prior=structuredClone(f.data);f.write();const priorCommit=f.commit('freeze reviewed compact and existing renderer hold');
 const priorRaw=fs.readFileSync(path.join(f.root,f.rel));
 f.bank.splice(0,f.bank.length,...afterBank);f.save(sourcePath,afterJs);f.save(correctedAsset,correctedBytes);f.save(independentPath,independent);
 const sourceCommit=f.commit('publish exact independently reviewed renderer correction');
 const independentRef={commit:sourceCommit,path:independentPath,sha256:independentSha};
 const carrierPath='docs/operations/fixture/corrected-renderer-hold-continuity.json';
 const carrier={schemaVersion:'m3-s2-renderer-correction-registration-hold-continuity-v1',scope:'EXACT_PUBLISHED_RENDERER_CORRECTION_PRESERVE_HOLD',reason:f.proof.reason,decision:'WITHHOLD_REGISTRATION',questionUid:uid(1),sourceOrdinal:1,sourceQuestionNo:'1',ordinal:1,sourceArchiveFile:f.source,fingerprintContract:'4slot-student-payload-v1',studentPayloadSha256:mod.payloadHash(afterBank[0]),sourceFingerprint:mod.identityHash(afterBank[0]),priorCompactRef:{commit:priorCommit,path:f.rel,gitBlobSha1:mod.blob(priorRaw),sha256:mod.sha(priorRaw)},correctiveReviewRef:independentRef,sourceRef:{commit:sourceCommit,...sourceAfter},correctedRenderer:{role:'solutionImage',commit:sourceCommit,...assetAfter},sourceQuestionCount:2,unselectedQuestionsUnchanged:1,changedSourceFields:['solutionImage','solutionImageAlt'],newSemanticApprovals:0,newDifficultyApprovals:0,newReviewPassCount:0,sourceWrites:0,slotChanges:0,registryWrites:0};
 function signCarrier(){f.save(carrierPath,carrier);const ref={commit:f.commit('bind exact published correction while preserving hold'),path:carrierPath,sha256:mod.sha(JSON.stringify(carrier))};const h=f.data.items[0].registrationHold;f.data.sourceGitBlobSha=carrier.sourceRef.gitBlobSha1;Object.assign(h,{sourceGitBlobSha:carrier.sourceRef.gitBlobSha1,studentPayloadSha256:carrier.studentPayloadSha256,sourceFingerprint:carrier.sourceFingerprint,reviewEvidence:ref,independentEvidence:carrier.correctiveReviewRef});Object.assign(f.data.evidence.nativeHoldReview,{rendererContinuity:ref,correctiveReview:carrier.correctiveReviewRef});f.write();}
 signCarrier();return {...f,prior,carrier,carrierPath,independent,independentPath,correctedAsset,signCarrier};
}
test('published exact renderer correction preserves the existing HOLD and every compact slot',t=>{
 const f=correctedHoldFixture(t),before=f.prior.items.map(({registrationHold,...row})=>row),index=heldOnly(f);
 assert.equal(index.pending[0].reason,'EXPLICIT_REVIEW_HOLD:SOURCE_RENDERER_CORRECTION_PENDING');
 assert.deepEqual(f.data.items.map(({registrationHold,...row})=>row),before);
 assert.deepEqual(f.data.reviewedBy,f.prior.reviewedBy);
 assert.deepEqual(f.data.items[1],f.prior.items[1]);
 assert.equal(index.semanticApprovalMutation,0);assert.equal(index.sourceMutation,0);
});
for(const fault of ['missing-carrier','missing-correction-review','carrier-null','correction-ref-hidden','all-new-markers-hidden','legacy-bindings-restored','carrier-bytes','independent-bytes','current-asset-bytes','changed-solution','extra-selected-metadata','unselected-metadata','unselected-slot','held-slot','hold-removed','reviewer-changed'])test('corrected renderer HOLD refuses mutable boundary: '+fault,t=>{
 const f=correctedHoldFixture(t),h=f.data.items[0].registrationHold;
 if(fault==='missing-carrier')fs.unlinkSync(path.join(f.root,f.carrierPath));
 if(fault==='missing-correction-review')fs.unlinkSync(path.join(f.root,f.independentPath));
 if(fault==='carrier-null')h.reviewEvidence=null;
 if(fault==='correction-ref-hidden')delete h.independentEvidence;
 if(fault==='all-new-markers-hidden'||fault==='legacy-bindings-restored'){delete h.reviewEvidence;delete h.independentEvidence;delete f.data.evidence.nativeHoldReview.rendererContinuity;delete f.data.evidence.nativeHoldReview.correctiveReview;}
 if(fault==='legacy-bindings-restored'){h.studentPayloadSha256=f.prior.items[0].registrationHold.studentPayloadSha256;h.sourceFingerprint=f.prior.items[0].registrationHold.sourceFingerprint;h.sourceGitBlobSha=f.prior.sourceGitBlobSha;f.data.sourceGitBlobSha=f.prior.sourceGitBlobSha;}
 if(fault==='carrier-bytes')f.save(f.carrierPath,{...f.carrier,newSemanticApprovals:1});
 if(fault==='independent-bytes')f.save(f.independentPath,{...f.independent,decision:'REGISTER'});
 if(fault==='current-asset-bytes')f.save(f.correctedAsset,'<svg>unreviewed bytes</svg>');
 if(fault==='changed-solution'){f.bank[0].solution='Different solution';f.save('archive/exams/'+f.source,f.js());}
 if(fault==='extra-selected-metadata'){f.bank[0].tagStatus='different';f.save('archive/exams/'+f.source,f.js());}
 if(fault==='unselected-metadata'){f.bank[1].tagStatus='different';f.save('archive/exams/'+f.source,f.js());}
 if(fault==='unselected-slot')f.data.items[1].method=[2];
 if(fault==='held-slot')f.data.items[0].method=[2];
 if(fault==='hold-removed')delete f.data.items[0].registrationHold;
 if(fault==='reviewer-changed')f.data.reviewedBy.agent='other';
 f.write();const index=mod.build(f.root).index;
 assert.equal(consumer.createIndex(index).get(uid(1)),null);
 assert.ok(index.pending.some(x=>/INVALID_REGISTRATION_HOLD|STALE_STUDENT_PAYLOAD|RENDERER_HOLD_ONE_UID_REQUIRED/.test(x.reason)),JSON.stringify(index.pending));
});
for(const fault of ['new-approval','unknown-carrier-schema','unknown-carrier-field','scope','source-path','source-commit','wrong-ordinal','denominator','protected-field-list','renderer-role','renderer-sha','wrong-independent-authority','wrong-prior-compact','own-null-field'])test('corrected renderer HOLD refuses immutable invalid carrier: '+fault,t=>{
 const f=correctedHoldFixture(t),p=f.carrier;
 if(fault==='new-approval')p.newSemanticApprovals=1;
 if(fault==='unknown-carrier-schema')p.schemaVersion='other-v1';
 if(fault==='unknown-carrier-field')p.allowAnyChange=true;
 if(fault==='scope')p.scope='ALL_REVIEWED_RENDERERS';
 if(fault==='source-path')p.sourceRef.path=p.sourceRef.path.replace('renderer-fixture','other');
 if(fault==='source-commit')p.sourceRef.commit='f'.repeat(40);
 if(fault==='wrong-ordinal')p.sourceOrdinal=2;
 if(fault==='denominator')p.sourceQuestionCount=1;
 if(fault==='protected-field-list')p.changedSourceFields.push('solution');
 if(fault==='renderer-role')p.correctedRenderer.role='problemImage';
 if(fault==='renderer-sha')p.correctedRenderer.sha256='0'.repeat(64);
 if(fault==='wrong-independent-authority'){f.independent.newReviewPassCount=1;f.save(f.independentPath,f.independent);p.correctiveReviewRef={...p.correctiveReviewRef,commit:f.commit('invalid independent review'),sha256:mod.sha(JSON.stringify(f.independent))};}
 if(fault==='wrong-prior-compact')p.priorCompactRef.sha256='0'.repeat(64);
 if(fault==='own-null-field')p.correctedRenderer.extra=null;
 f.signCarrier();const index=heldOnly(f);assert.match(index.pending[0].reason,/INVALID_REGISTRATION_HOLD/);
});
for(const target of ['carrier','independent'])test('cached corrected HOLD observes deleted '+target+' evidence',t=>{
 const f=correctedHoldFixture(t);mod.run(f.root,{write:true});fs.unlinkSync(path.join(f.root,target==='carrier'?f.carrierPath:f.independentPath));
 const index=heldOnly(f);assert.match(index.pending[0].reason,/INVALID_REGISTRATION_HOLD/);
});

// A real official writer issues the local receipt before the 4slot builder runs.
// The fixture deliberately has no catalog, readiness receipt, or public issued
// commit: those must not become circular prerequisites for keeping a HOLD.
async function metadataHoldFixture(t,{issue=true,sourceAliases={},metadataAliases={}}={}) {
 const sourceFields={standardCourse:'중3 수학',standardUnitKey:'UNIT_HOLD',standardUnit:'Fixture unit',subUnitKey:'SUB_HOLD',subUnit:'Fixture subunit',
  problemTypeKey:'PT_HOLD',templateKey:'TPL_HOLD',crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE',level:'중',difficultyBucket:3,...sourceAliases};
 const f=correctedHoldFixture(t,sourceFields),sourcePath='archive/exams/'+f.source,C='archive/data/meta-foundation/canonical';
 const beforeRaw=fs.readFileSync(path.join(f.root,sourcePath));
 const current={questionUid:uid(1),sourceArchiveFile:f.source,sourceOrdinal:1,sourceQuestionNo:'1',sourceFingerprint:mod.identityHash(f.bank[0]),...sourceFields,
  rpmSemanticStatus:'FINAL',rpmL3:'Fixture type',rpmL4:'Fixture method',reviewStatus:'review_required',...metadataAliases};
 f.save('archive/data/question_metadata.json',{records:[current,{questionUid:uid(2),sourceArchiveFile:f.source,sourceOrdinal:2,sourceFingerprint:mod.identityHash(f.bank[1])}],counts:{}});
 f.identity.schemaVersion='question-identity-map-v1';
 f.identity.lookup={byQuestionUid:{},bySourceFileAndOrdinal:{[f.source]:{}},bySourceFileAndQuestionNo:{[f.source]:{}},byLegacyQKey:{}};
 for(const row of f.identity.records){row.legacyQKey=f.source+'_'+row.sourceOrdinal;f.identity.lookup.byQuestionUid[row.questionUid]=structuredClone(row);f.identity.lookup.bySourceFileAndOrdinal[f.source][row.sourceOrdinal]=row.questionUid;f.identity.lookup.bySourceFileAndQuestionNo[f.source][row.sourceQuestionNo]=[row.questionUid];f.identity.lookup.byLegacyQKey[row.legacyQKey]=[row.questionUid];}
 f.write();
 f.save(C+'/registry_index.json',{activePacks:[{id:'HOLD_FIXTURE',version:'1.0.0',status:'ACTIVE'}],activeConceptShards:[],
  conditionRegistry:{id:'CONDITION_CORE',version:'1',status:'ACTIVE'},canonicalSources:[{path:C+'/condition_registry.json'}],
  compiledArtifacts:['aliases','concept_registry','condition_registry','curriculum_bindings','taxonomy_registry','meta_foundation_compiled'].map(n=>({path:'archive/data/meta-foundation/compiled/'+n+'.json'}))});
 f.save(C+'/condition_registry.json',{schemaVersion:'meta-foundation-condition-registry-v1',owner:'CONDITION_CORE',conditions:[],conditionCount:0});
 const P=C+'/packs/hold-fixture';
 f.save(P+'/pack.json',{schemaVersion:'meta-foundation-pack-v1',packId:'HOLD_FIXTURE',packVersion:'1.0.0',canonicalStatus:'ACTIVE',curricula:['2015'],standardCourses:['중3 수학','M3-2']});
 f.save(P+'/taxonomy.json',{status:'ACTIVE',problemTypes:[{problemTypeKey:'PT_HOLD',canonicalLabelKo:'Fixture type',definition:'Existing fixture type',ownerPack:'HOLD_FIXTURE',status:'ACTIVE',sourceUnit:'UNIT_HOLD',supportingQuestionUids:[uid(1)],supportingItemCount:1}],
  templates:[{templateKey:'TPL_HOLD',canonicalLabelKo:'Fixture method',definition:'Existing fixture method',parentProblemTypeKey:'PT_HOLD',status:'ACTIVE',sourceUnit:'UNIT_HOLD',supportingQuestionUids:[uid(1)],supportingItemCount:1}]});
 f.save(P+'/bindings.json',{status:'ACTIVE',bindings:[{curriculum:'2015',standardCourse:'중3 수학',standardUnitKey:'UNIT_HOLD',subUnitKey:'SUB_HOLD',problemTypeKey:'PT_HOLD',status:'ACTIVE'}]});f.save(P+'/aliases.json',{aliases:[]});
 f.save('archive/data/master_tables/js_archive_tag_master.json',[{key:'UNIT_HOLD',keyType:'standardUnitKey',labelKo:'Fixture unit',status:'active'},
  {key:'SUB_HOLD',keyType:'subUnitKey',parentKey:'UNIT_HOLD',standardUnitKey:'UNIT_HOLD',labelKo:'Fixture subunit',status:'active'}]);
 fs.mkdirSync(path.join(f.root,'archive/data/meta-foundation/runtime'),{recursive:true});
 const nativePath='docs/operations/fixture/native-scope-review.json';
 const native={schemaVersion:'m3-s2-complete-semantic-review-v1',sourceArchiveFile:f.source,questionCount:2,author:'native-fixture-reviewer',rootIntegrator:'fixture-integrator',sourceAfterBlob:mod.blob(beforeRaw),sourceAfterSha256:mod.sha(beforeRaw),items:f.bank.map((q,i)=>({questionUid:uid(i+1),ordinal:i+1,decision:i?'REVIEW_COMPLETE_WITH_SOURCE_PREREQUISITE_HOLD':'KEEP',after:{},decisiveStep:'Existing fixture judgment',debts:[],rpm:{sourceComparison:{curriculum:'2015',scope:'M3-2'}}}))};
 f.save(nativePath,native);
 const baseline=f.commit('freeze existing ACTIVE definitions, native scope and corrected negative hold'),priorRaw=fs.readFileSync(path.join(f.root,f.rel));
 const nativeRef={path:nativePath,sha256:mod.sha(JSON.stringify(native))};
 const additions={curriculumKey:'2015',courseKey:'M3-2'},metadataFields=Object.entries(additions).map(([field,after])=>({field,beforePresent:false,before:null,afterPresent:true,after}));
 const first=JSON.stringify(f.bank[0]),inserted=first.slice(0,-1)+',\n'+Object.entries(additions).map(([k,v])=>'    '+JSON.stringify(k)+': '+JSON.stringify(v)).join(',\n')+'}';
 const afterRaw=beforeRaw.toString().replace(first,inserted);Object.assign(f.bank[0],additions);
 const requestPath='.archive-meta-register/inbox/hold-metadata-fixture.json',approvalPath='docs/operations/fixture/metadata-approval.json';
 f.save(approvalPath,{approved:true,scope:'Synthetic existing definitions and two scope fields only'});
 const evidenceRefs=[{path:approvalPath,sha256:mod.sha(fs.readFileSync(path.join(f.root,approvalPath)))},nativeRef];
 const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:'hold-metadata-fixture',examUid:'hold-fixture',scope:'PARTIAL_UIDS',
  sourceArchiveFile:f.source,expectedSourceBlobSha1:mod.blob(afterRaw),expectedQuestionCount:2,registryChanges:[],
  approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'fixture-reviewer',evidenceRefs},
  items:[{questionUid:uid(1),sourceOrdinal:1,before:{curriculumKey:null,courseKey:null,sourceFingerprint:current.sourceFingerprint,contentFingerprint:null},after:{...additions,sourceFingerprint:current.sourceFingerprint,contentFingerprint:mod.sha(JSON.stringify({content:f.bank[0].content??null,choices:f.bank[0].choices??null,image:f.bank[0].image??null}))},identityBefore:{sourceFingerprint:current.sourceFingerprint},sourceReview:{schemaVersion:'archive-reviewed-source-reassessment-v1',reviewCommit:baseline,reviewPath:nativePath,reviewRef:nativeRef},reason:'Carry explicit fixture scope while retaining the renderer hold',evidenceRefs}]};
 f.save(requestPath,request);const requestRaw=fs.readFileSync(path.join(f.root,requestPath)),identityRaw=fs.readFileSync(path.join(f.root,'archive/data/question_identity_map.json'));
 const hashes=b=>({blobSha1:mod.blob(b),sha256:mod.sha(b)}),manifestPath='.archive-meta-register/evidence/fixture/hold-metadata-manifest.json';
 const manifest={schemaVersion:'archive-reviewed-source-metadata-materialization-v1',transportProfile:'M3_REVIEWED_METADATA_V1',materializationId:'hold-metadata-fixture',baseCommit:baseline,
  identityRef:{path:'archive/data/question_identity_map.json',...hashes(identityRaw)},requestRefs:[{path:requestPath,...hashes(requestRaw)}],outputScope:[sourcePath],
  files:[{path:sourcePath,before:hashes(beforeRaw),after:hashes(afterRaw),expectedQuestionCount:2,changes:[{questionUid:uid(1),sourceOrdinal:1,requestIndex:0,metadataFields}]}]};
 f.save(manifestPath,manifest);const inputCommit=f.commit('immutable scope-only candidate inputs');
 const fullRef=p=>({commit:inputCommit,path:p,gitBlobSha1:mod.blob(fs.readFileSync(path.join(f.root,p))),sha256:mod.sha(fs.readFileSync(path.join(f.root,p)))});
 const carrierPath='docs/operations/fixture/metadata-hold-continuity.json';
 const carrier={schemaVersion:'m3-s2-renderer-hold-metadata-continuity-v1',scope:'EXACT_M3_SCOPE_METADATA_TRANSPORT_PRESERVE_RENDERER_HOLD',decision:'WITHHOLD_REGISTRATION',
  questionUid:uid(1),sourceOrdinal:1,sourceArchiveFile:f.source,sourceQuestionCount:2,priorCompactRef:{commit:baseline,path:f.rel,gitBlobSha1:mod.blob(priorRaw),sha256:mod.sha(priorRaw)},correctedHoldRef:f.data.items[0].registrationHold.reviewEvidence,
  candidate:{baseCommit:baseline,inputCommit,manifestRef:fullRef(manifestPath),requestRef:fullRef(requestPath)},materializedSource:{path:sourcePath,gitBlobSha1:mod.blob(afterRaw),sha256:mod.sha(afterRaw)},
  selected:[{questionUid:uid(1),sourceOrdinal:1}],changedMetadataFields:['courseKey','curriculumKey'],newSemanticApprovals:0,newDifficultyApprovals:0,newFourSlotApprovals:0,newReviewPassCount:0,sourceWrites:0,slotChanges:0,registryWrites:0};
 function signMetadataCarrier(){f.save(carrierPath,carrier);const ref={commit:f.commit('metadata transport continues negative hold'),path:carrierPath,sha256:mod.sha(JSON.stringify(carrier))};
  f.data.sourceGitBlobSha=carrier.materializedSource.gitBlobSha1;Object.assign(f.data.items[0].registrationHold,{sourceGitBlobSha:carrier.materializedSource.gitBlobSha1,metadataTransportEvidence:ref});
  f.data.evidence.nativeHoldReview.metadataContinuity=ref;f.write();}
 f.save(sourcePath,afterRaw);signMetadataCarrier();
 let written=null;
 if(issue){const {registerReviewedExamV2}=await import('../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs');written=registerReviewedExamV2({root:f.root,request,write:true});assert.equal(written.replay,false);assert.equal(written.totalQuestions,1);}
 return {...f,baseline,beforeRaw,afterRaw,request,requestPath,manifest,manifestPath,metadataCarrier:carrier,metadataCarrierPath:carrierPath,signMetadataCarrier,written,native,nativePath,
  receiptPath:'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+request.requestId+'.json'};
}
test('official metadata write before catalog keeps corrected renderer HOLD without a public issued commit',async t=>{
 const f=await metadataHoldFixture(t),before=structuredClone(f.data.items);
 const {verifyHoldMetadataReplay}=await import('../tools/4slot/verify-hold-metadata-replay.mjs');const ref=f.data.items[0].registrationHold.metadataTransportEvidence;
 assert.equal(verifyHoldMetadataReplay({root:f.root,carrierPath:ref.path,carrierCommit:ref.commit,carrierSha256:ref.sha256}).status,'PASS');
 const index=heldOnly(f);
 assert.equal(index.pending[0].reason,'EXPLICIT_REVIEW_HOLD:SOURCE_RENDERER_CORRECTION_PENDING');
 assert.deepEqual(f.data.items,before);assert.equal(fs.existsSync(path.join(f.root,'archive/data/archive2-catalog.json')),false);
 assert.equal(index.semanticApprovalMutation,0);assert.equal(index.sourceMutation,0);
 assert.equal(JSON.parse(fs.readFileSync(path.join(f.root,f.receiptPath))).approval.type,'FINAL_QA');
});

test('metadata HOLD requires an already issued local official receipt',async t=>{
 const f=await metadataHoldFixture(t,{issue:false}),ref=f.data.items[0].registrationHold.metadataTransportEvidence;
 const {verifyHoldMetadataReplay}=await import('../tools/4slot/verify-hold-metadata-replay.mjs');
 assert.throws(()=>verifyHoldMetadataReplay({root:f.root,carrierPath:ref.path,carrierCommit:ref.commit,carrierSha256:ref.sha256}),/ISSUED_RECEIPT_REQUIRED/);
 assert.match(heldOnly(f).pending[0].reason,/INVALID_REGISTRATION_HOLD:HOLD_METADATA_/);
 assert.equal(fs.existsSync(path.join(f.root,f.receiptPath)),false);
});
for(const fault of ['missing-carrier','null-marker','unpaired-marker','all-markers-hidden','legacy-source-hash','carrier-bytes','native-bytes','native-deleted',
 'renderer-bytes','held-student-field','unselected-question','held-slot','neighbor-slot','hold-removed','reviewer','receipt-deleted','receipt-malformed','receipt-request-hash',
 'metadata-value','identity-value','runtime-value','native-proof-deleted','current-active-binding'])test('metadata HOLD rejects mutable provenance boundary: '+fault,async t=>{
 const f=await metadataHoldFixture(t),h=f.data.items[0].registrationHold;
 const edit=(p,change)=>{const value=JSON.parse(fs.readFileSync(path.join(f.root,p)));change(value);f.save(p,value);};
 if(fault==='missing-carrier')fs.unlinkSync(path.join(f.root,f.metadataCarrierPath));
 if(fault==='null-marker')h.metadataTransportEvidence=null;
 if(fault==='unpaired-marker')delete f.data.evidence.nativeHoldReview.metadataContinuity;
 if(fault==='all-markers-hidden'||fault==='legacy-source-hash'){delete h.metadataTransportEvidence;delete f.data.evidence.nativeHoldReview.metadataContinuity;}
 if(fault==='legacy-source-hash'){h.sourceGitBlobSha=f.carrier.sourceRef.gitBlobSha1;f.data.sourceGitBlobSha=h.sourceGitBlobSha;}
 if(fault==='carrier-bytes')f.save(f.metadataCarrierPath,{...f.metadataCarrier,newSemanticApprovals:1});
 if(fault==='native-bytes')f.save(f.nativePath,{...f.native,other:true});
 if(fault==='native-deleted')fs.unlinkSync(path.join(f.root,f.nativePath));
 if(fault==='renderer-bytes')f.save(f.correctedAsset,'<svg>changed current renderer</svg>');
 if(fault==='held-student-field'){f.bank[0].solution='Changed student material';f.save('archive/exams/'+f.source,f.js());}
 if(fault==='unselected-question'){f.bank[1].courseKey='M3-2';f.save('archive/exams/'+f.source,f.js());}
 if(fault==='held-slot')f.data.items[0].method=[2];
 if(fault==='neighbor-slot')f.data.items[1].method=[2];
 if(fault==='hold-removed')delete f.data.items[0].registrationHold;
 if(fault==='reviewer')f.data.reviewedBy.agent='another';
 if(fault==='receipt-deleted')fs.unlinkSync(path.join(f.root,f.receiptPath));
 if(fault==='receipt-malformed')f.save(f.receiptPath,{});
 if(fault==='receipt-request-hash')edit(f.receiptPath,x=>x.requestSha256='0'.repeat(64));
 if(fault==='metadata-value')edit('archive/data/question_metadata.json',x=>x.records[0].courseKey='M3-1');
 if(fault==='identity-value')f.identity.records[0].sourceFingerprint='0'.repeat(64);
 if(fault==='runtime-value')for(const p of f.written.plannedPaths.filter(p=>p.startsWith('archive/data/meta-foundation/runtime/')))edit(p,x=>x.records[0].approvedSourceFingerprint='0'.repeat(64));
 if(fault==='native-proof-deleted')edit(f.receiptPath,x=>{for(const row of x.fingerprintRepairs||[])delete row.sourceReview;});
 if(fault==='current-active-binding')edit('archive/data/meta-foundation/canonical/packs/hold-fixture/bindings.json',x=>x.bindings[0].curriculum='2022');
 f.write();const index=mod.build(f.root).index;
 assert.equal(consumer.createIndex(index).get(uid(1)),null);
 assert.ok(index.pending.some(x=>/INVALID_REGISTRATION_HOLD|STALE_STUDENT_PAYLOAD|RENDERER_HOLD_ONE_UID_REQUIRED/.test(x.reason)),JSON.stringify(index.pending));
});
for(const fault of ['new-semantic-approval','new-slot-approval','unknown-field','unknown-schema','unknown-scope','wrong-source','wrong-denominator','unknown-scope-field',
 'duplicate-selected','wrong-uid','wrong-ordinal','prior-hash','changed-native-scope','missing-native-scope','own-null-native-scope','native-review-deleted'])test('metadata HOLD rejects rehashed carrier boundary: '+fault,async t=>{
 const f=await metadataHoldFixture(t),c=f.metadataCarrier;
 if(fault==='new-semantic-approval')c.newSemanticApprovals=1;
 if(fault==='new-slot-approval')c.newFourSlotApprovals=1;
 if(fault==='unknown-field')c.futureOverride=true;
 if(fault==='unknown-schema')c.schemaVersion='future-v1';
 if(fault==='unknown-scope')c.scope='ANY_METADATA';
 if(fault==='wrong-source')c.sourceArchiveFile=c.sourceArchiveFile.replace('renderer-fixture','other');
 if(fault==='wrong-denominator')c.sourceQuestionCount=1;
 if(fault==='unknown-scope-field')c.changedMetadataFields.push('templateKey');
 if(fault==='duplicate-selected')c.selected.push(structuredClone(c.selected[0]));
 if(fault==='wrong-uid')c.selected[0].questionUid=uid(2);
 if(fault==='wrong-ordinal')c.selected[0].sourceOrdinal=2;
 if(fault==='prior-hash')c.priorCompactRef.sha256='0'.repeat(64);
 if(['changed-native-scope','missing-native-scope','own-null-native-scope','native-review-deleted'].includes(fault)) {
  if(fault==='changed-native-scope')f.native.items[0].rpm.sourceComparison.scope='M3-1';
  if(fault==='missing-native-scope')delete f.native.items[0].rpm.sourceComparison;
  if(fault==='own-null-native-scope')f.native.items[0].after.curriculumKey=null;
  f.save(f.nativePath,f.native);const nativeCommit=f.commit('immutable invalid native scope');
  const ref={path:f.nativePath,sha256:mod.sha(JSON.stringify(f.native))};
  for(const refs of [f.request.approval.evidenceRefs,f.request.items[0].evidenceRefs]){const i=refs.findIndex(r=>r.path===ref.path);refs[i]=ref;}
  Object.assign(f.request.items[0].sourceReview,{reviewCommit:nativeCommit,reviewRef:ref});
  if(fault==='native-review-deleted')delete f.request.items[0].sourceReview;
  f.save(f.requestPath,f.request);const rb=fs.readFileSync(path.join(f.root,f.requestPath));f.manifest.requestRefs[0]={path:f.requestPath,blobSha1:mod.blob(rb),sha256:mod.sha(rb)};
  f.save(f.manifestPath,f.manifest);const input=f.commit('immutable invalid request revision');
  c.candidate.inputCommit=input;
  for(const [key,p]of [['requestRef',f.requestPath],['manifestRef',f.manifestPath]]){const raw=fs.readFileSync(path.join(f.root,p));c.candidate[key]={commit:input,path:p,gitBlobSha1:mod.blob(raw),sha256:mod.sha(raw)};}
 }
 f.signMetadataCarrier();const index=heldOnly(f);assert.match(index.pending[0].reason,/INVALID_REGISTRATION_HOLD:HOLD_METADATA_/);
});
for(const fault of ['receipt','metadata'])test('cached metadata HOLD replays current issued '+fault+' on every build',async t=>{
 const f=await metadataHoldFixture(t);mod.run(f.root,{write:true});
 if(fault==='receipt')fs.unlinkSync(path.join(f.root,f.receiptPath));
 else {const p='archive/data/question_metadata.json',v=JSON.parse(fs.readFileSync(path.join(f.root,p)));v.records[0].templateKey='TPL_UNKNOWN';f.save(p,v);}
 assert.match(heldOnly(f).pending[0].reason,/INVALID_REGISTRATION_HOLD:HOLD_METADATA_/);
});
for(const [field,value]of [['curriculum','2022'],['courseSemester','M3-1'],['semester',1],['grade','중2'],['gradeKey','M2']])for(const target of ['source','metadata'])
 test('metadata HOLD rejects a fully resealed contradictory '+target+' '+field,async t=>{
  await assert.rejects(async()=>{
   const options=target==='source'?{sourceAliases:{[field]:value},metadataAliases:{[field]:field==='curriculum'?'2015':undefined}}:{metadataAliases:{[field]:value}};
   const f=await metadataHoldFixture(t,options),ref=f.data.items[0].registrationHold.metadataTransportEvidence;
   const {verifyHoldMetadataReplay}=await import('../tools/4slot/verify-hold-metadata-replay.mjs');
   verifyHoldMetadataReplay({root:f.root,carrierPath:ref.path,carrierCommit:ref.commit,carrierSha256:ref.sha256});
  },/SCOPE_ALIAS|curriculum\/course aliases disagree|source\/approved metadata parity/);
 });
for(const [field,value]of [['curriculum',null],['courseSemester',null],['semester',null],['grade',null],['gradeKey',null]])for(const target of ['source','metadata'])
 test('metadata HOLD rejects an explicit null '+target+' '+field,async t=>{
  await assert.rejects(async()=>{
   const f=await metadataHoldFixture(t,target==='source'?{sourceAliases:{[field]:value},metadataAliases:{[field]:undefined}}:{metadataAliases:{[field]:value}});
   const {verifyHoldMetadataReplay}=await import('../tools/4slot/verify-hold-metadata-replay.mjs'),ref=f.data.items[0].registrationHold.metadataTransportEvidence;
   verifyHoldMetadataReplay({root:f.root,carrierPath:ref.path,carrierCommit:ref.commit,carrierSha256:ref.sha256});
  },/SCOPE_ALIAS|curriculum\/course aliases disagree|source\/approved metadata parity/);
 });
test('metadata HOLD retains matching explicit source and metadata aliases verbatim',async t=>{
 const aliases={curriculum:'2015',courseSemester:'M3-2',semester:2,grade:'중3',gradeKey:'M3'};
 const f=await metadataHoldFixture(t,{sourceAliases:aliases,metadataAliases:aliases}),beforeSource=fs.readFileSync(path.join(f.root,'archive/exams/'+f.source)),beforeMeta=fs.readFileSync(path.join(f.root,'archive/data/question_metadata.json'));
 assert.equal(heldOnly(f).pending[0].reason,'EXPLICIT_REVIEW_HOLD:SOURCE_RENDERER_CORRECTION_PENDING');
 assert.deepEqual(fs.readFileSync(path.join(f.root,'archive/exams/'+f.source)),beforeSource);assert.deepEqual(fs.readFileSync(path.join(f.root,'archive/data/question_metadata.json')),beforeMeta);
});

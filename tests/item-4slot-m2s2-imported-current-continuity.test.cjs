'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{execFileSync}=require('node:child_process');
const mod=require('../tools/4slot/build-4slot-runtime.cjs'),contract=require('../tools/4slot/m2s2-imported-current-continuity.cjs');
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const uid=n=>'qid_v1_'+String(n).padStart(64,'0');
const source='original/middle/m2/2final/imported-current-fixture.js',sp='archive/exams/'+source,cp='archive/data/item-4slot/'+source.replace(/\.js$/,'.4slot.json');
const dir='docs/operations/m2-imported-fixture/',dp='docs/architecture/4slot/term-dictionary-v1.5.json';
const zero=()=>Object.fromEntries(contract.ZERO.map(k=>[k,0]));
const fields=(a,b)=>[...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>Object.hasOwn(a,k)!==Object.hasOwn(b,k)||stable(a[k])!==stable(b[k])).sort();
const delta=(a,b,allowed)=>fields(a,b).filter(k=>allowed.has(k)).map(field=>({field,beforePresent:Object.hasOwn(a,field),afterPresent:Object.hasOwn(b,field),beforeSha256:Object.hasOwn(a,field)?mod.sha(stable(a[field])):null,afterSha256:Object.hasOwn(b,field)?mod.sha(stable(b[field])):null}));
function fixture(t,{overlay=true,inlineImage=false}={}){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'m2-imported-current-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const save=(p,v)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),Buffer.isBuffer(v)||typeof v==='string'?v:JSON.stringify(v));};
  const bytes=p=>fs.readFileSync(path.join(root,p));
  const git=(...a)=>execFileSync('git',['-C',root,...a],{encoding:'utf8',stdio:['ignore','pipe','pipe']});
  const commit=m=>{git('add','.');git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','--allow-empty','-qm',m);return git('rev-parse','HEAD').trim();};
  const ref=(c,p,full=false)=>{const b=execFileSync('git',['-C',root,'show',c+':'+p]);return {commit:c,path:p,...(full?{gitBlobSha1:mod.blob(b)}:{}),sha256:mod.sha(b)};};
  const full=r=>ref(r.commit,r.path,true),js=b=>'window.questionBank='+JSON.stringify(b)+';';
  const oldAssets=[1,2,3].map(i=>'archive/assets/images/imported-fixture/old'+i+'.svg'),newAssets=[1,2,3].map(i=>'archive/assets/images/imported-fixture/new'+i+'.svg');
  const svg='<svg xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="5" r="3"/></svg>';
  const original=[1,2,3].map(i=>({id:i,content:'Fixture given '+i,choices:['A','B'],answer:'A',solution:'Original fixture method '+i,image:oldAssets[i-1].slice(8),layoutTag:'grid',primaryMethod:'existing source value'}));
  if(inlineImage)original[0].content+='<div class="figure"><img src="'+oldAssets[0].slice(8)+'"></div><span>Unchanged sequence</span>';
  const dict={dictionaryVersion:'term-dict-v1.5-2026-11-04',terms:[{id:1,ko:'fixture given'},{id:2,ko:'fixture goal'},{id:3,ko:'fixture method'}]};
  const np='archive-work/4slot-annotate-v1/out/'+source.replace(/\.js$/,'.4slot.json'),qp='archive-work/4slot-annotate-v1/QUEUE-original.json',rp='tools/4slot/bulk-delta-overrides.json',op='tools/4slot/publish-reviewed-bulk.cjs';
  const native={schemaVersion:'archive-meta-4slot-v0',sourceArchiveFile:source,sourceGitBlobSha:mod.blob(js(original)),dictionaryVersion:dict.dictionaryVersion,judgedBy:{agent:'original-author',run:'synthetic-fixture',at:'2026-11-04'},items:original.map((q,i)=>({sourceOrdinal:i+1,format:'단일 정답',slots:{given:[{term:'fixture given',src:'stem',quote:'Fixture given'}],goal:[{term:'fixture goal',src:'stem',quote:'Fixture given'}],method:[{term:'fixture method',src:'solution',quote:q.solution,evidenceType:'NAMED'}],condition:[]}})),candidates:[],selfCheck:{}};
  const qr={path:source,blob:native.sourceGitBlobSha,items:3,order:130};
  save(sp,js(original));save(dp,dict);save(np,native);save(qp,{list:[qr]});for(const p of oldAssets)save(p,svg);
  const identity={records:original.map((q,i)=>({questionUid:uid(i+1),sourceArchiveFile:source,sourceOrdinal:i+1,sourceQuestionNo:String(q.id),sourceFingerprint:mod.identityHash(q),status:'VERIFIED'}))};save('archive/data/question_identity_map.json',identity);
  git('init','-q');const nativeCommit=commit('original synthetic native authority');
  const before=structuredClone(original);before[0].solution='Previously reviewed fixture method 1';save(sp,js(before));const baseCommit=commit('previously reviewed source before import');
  const review={schemaVersion:'four-slot-bulk-targeted-delta-review-v1',authoringCommit:nativeCommit,baseMain:baseCommit,reviewer:'existing-import-reviewer',scope:'Existing exact quote change only',independentFullExamReview:false,operations:[{order:130,ordinal:1,op:'replaceQuote',slot:'method',term:'fixture method',quote:before[0].solution,src:'solution'}],reviewedNonpresentationChanges:[{order:130,ordinal:1}]};
  save(rp,review);save(op,'// Immutable synthetic import operator; not executed.\n');const reviewCommit=commit('existing import review');
  const items=original.map(q=>({ordinal:q.id,format:'단일 정답',given:[1],goal:[2],method:[3],condition:[],candidates:[]}));
  const prior={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:source,sourceGitBlobSha:mod.blob(js(before)),dictionaryVersion:dict.dictionaryVersion,evidence:{branch:'work/4slot-annotate-v1',commit:nativeCommit,path:np,originalSha256:ref(nativeCommit,np).sha256,importDelta:{baseSourceGitBlobSha:native.sourceGitBlobSha,authoringSnapshot:nativeCommit,reviewRecord:{branch:'ops/fixture',...ref(reviewCommit,rp)}}},reviewedBy:{agent:review.reviewer,at:'2026-11-05',sampled:[1],scope:'TECHNICAL_IMPORT_ALL_AND_TARGETED_CHANGED_SLOTS',independentFullExamReview:false,originalAuthor:native.judgedBy},items};
  save(cp,prior);const priorCommit=commit('existing imported compact');
  const observed=structuredClone(before);observed[0].image=newAssets[0].slice(8);observed[1].image=newAssets[1].slice(8);for(const q of observed)q.primaryMethod='already present unrelated metadata';
  if(inlineImage)observed[0].content=observed[0].content.replace('<img src="'+oldAssets[0].slice(8)+'">','<img src="'+newAssets[0].slice(8)+'" alt="Given diagram" style="display:block;width:min(100%,520px);height:auto;margin:0 auto;">');
  save(sp,js(observed));for(const p of newAssets)save(p,svg);let observedCommit=commit('observed current source and assets');
  const bank=structuredClone(observed);if(overlay)bank[0].courseKey='M2-2';save(sp,js(bank));let currentCommit=commit('existing metadata-only candidate');
  const requestPath='.archive-meta-register/inbox/existing-approved-overlay.json';
  const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',scope:'PARTIAL_UIDS',sourceArchiveFile:source,expectedSourceBlobSha1:mod.blob(js(bank)),expectedQuestionCount:3,approval:{type:'FINAL_QA',metadataReviewed:true},items:[{questionUid:uid(1),sourceOrdinal:1,after:{courseKey:'M2-2'}}]};
  if(overlay)save(requestPath,request);let requestCommit=commit('bind an existing request without approving its metadata');
  const ip=dir+'read-inputs.json',obp=dir+'raw-observer.json',rootp=dir+'root-independent-observation.json',ap=dir+'authority-import-delta-join.json',frozenRequestPath=dir+'existing-metadata-overlay-request.json',carrierPath=dir+'m2-imported-four-slot-transport.json';
  const assets=(c,q)=>[...new Set([...JSON.stringify(q).matchAll(/(?:archive\/)?assets\/[A-Za-z0-9_가-힣%./+()@ -]+\.(?:png|jpe?g|gif|webp|svg)/gi)].map(m=>m[0].startsWith('archive/')?m[0]:'archive/'+m[0]))].sort().map(p=>({...ref(c,p,true),roles:['questionImage']}));
  const priorSourceRef=ref(baseCommit,sp,true),priorCompactRef=ref(priorCommit,cp,true),nativeRef=ref(nativeCommit,np);
  const inputs={schemaVersion:'m2s2-four-source-current-continuity-read-inputs-v1',sources:[]};
  const raw={schemaVersion:'m2s2-existing-vector-actual-continuity-observations-v1',reviewer:'actual-observer',reviewedAtUtc:'2026-11-16T01:00:00Z',sourceArchiveFile:source,priorSourceRef,priorCompactRef,nativeAuthorityRef:full(nativeRef),importDeltaReviewRef:ref(reviewCommit,rp,true),originalEvidenceAndReviewerPreserved:true,sourceWrites:0,assetWrites:0,slotWrites:0,newMathApprovals:0,newDifficultyApprovals:0,fullExamIndependentMathReview:false,rows:[]};
  const rootReview={schemaVersion:'archive-middle-current-observer-root-followup-v1',reviewer:'independent-root',newMetadataApprovals:0,newMathematicalQa:false,newDifficultyJudgments:0,sourceWrites:0,assetWrites:0,slotWrites:0,browserStatus:'NOT_RUN',rows:[]};
  const authority={schemaVersion:'m2s2-existing-import-authority-exact-join-v1',authoringQueueRef:ref(nativeCommit,qp,true),existingImportReviewRef:ref(reviewCommit,rp,true),existingOperatorRef:ref(reviewCommit,op,true),newMathApprovals:0,selectedSources:[{queueRow:qr,nativeAuthorityRef:full(nativeRef),compactRef:priorCompactRef,selectedOperationCount:1}]};
  function fill(){
    const rows=before.map((a,i)=>{const q=observed[i];return {sourceOrdinal:i+1,questionUid:uid(i+1),compactOrdinal:i+1,selectedForActualRead:i<2,priorWholeQuestionSha256:mod.sha(stable(a)),currentWholeQuestionSha256:mod.sha(stable(q)),priorStudentPayloadSha256:mod.payloadHash(a),currentStudentPayloadSha256:mod.payloadHash(q),frozenItem:items[i],frozenItemSha256:mod.sha(stable(items[i])),changedFields:fields(a,q),priorAssets:assets(baseCommit,a),currentAssets:assets(observedCommit,q)};});
    inputs.sources=[{sourceArchiveFile:source,priorSourceRef,currentSourceRef:ref(observedCommit,sp,true),compactRef:priorCompactRef,nativeAuthorityRef:full(nativeRef),rows}];raw.currentSourceRef=ref(observedCommit,sp,true);
    raw.rows=rows.slice(0,2).map((r,i)=>({...r,
      decision:i?'HOLD_CURRENT_RENDERER':'RETAIN_EXISTING_VECTOR',
      specialBoundary:i?'CURRENT_SOLUTION_AREA_LABEL_AMBIGUITY':'EXISTING_IMPORT_QUOTE_AMENDMENT_RETAINED',
      observation:'Synthetic actual-observer fixture; no real approval.',...(inlineImage&&i===0?{detail:{contentDeltaLimitedToImageMarkup:true}}:{}),
      existingFourSlotsAllRead:true,currentStemChoicesAnswerSolutionActuallyRead:true,originalNativeRowActuallyRead:true,
      actualChromeInspectionByThisReviewer:false,actualPriorAssetInspection:r.priorAssets.length>0,actualCurrentAssetInspection:r.currentAssets.length>0,
      cardRef:{sha256:mod.sha('fixture card '+(i+1))},newSlotValues:0,newMathApproval:0,newDifficultyApproval:0,sourceMutation:0,assetMutation:0}));
    const r=raw.rows[1];rootReview.rows=[{sourceArchiveFile:source,questionUid:uid(2),sourceOrdinal:2,decision:'WITHHOLD_CURRENT_RENDERER',choiceAnswerSolutionUnchanged:true,nativeProjectionExact:true,fullSourceDenominator:3,priorWholeQuestionSha256:r.priorWholeQuestionSha256,currentWholeQuestionSha256:r.currentWholeQuestionSha256,frozenVectorSha256:r.frozenItemSha256,priorSourceRef,observerCurrentSourceRef:ref(observedCommit,sp,true),currentSourceRef:ref(observedCommit,sp,true),nativeAuthorityRef:full(nativeRef),compactRef:priorCompactRef,priorAssets:r.priorAssets,currentAssets:r.currentAssets,card:{sha256:r.cardRef.sha256,actuallyViewed:true},reasonCode:'SYNTHETIC_RENDERER_MISMATCH',observation:'Synthetic root held row only.',inspected:{fullStem:true,choices:true,solutionText:true,nativeFourSlots:true}}];
  }
  fill();
  const proof={schemaVersion:contract.CARRIER_SCHEMA,scope:contract.SCOPE,transportAuthor:'transport-author',sourceArchiveFile:source,expectedQuestionCount:3,priorCompactRef,nativeSourceRef:ref(nativeCommit,sp,true),priorSourceRef,observedSourceRef:ref(observedCommit,sp,true),sourceRef:ref(currentCommit,sp,true),dictionaryRef:ref(currentCommit,dp,true),nativeFourSlotRef:nativeRef,queueRef:ref(nativeCommit,qp),importReviewRef:ref(reviewCommit,rp),importOperatorRef:ref(reviewCommit,op),readInputsRef:null,observationRef:null,rootFollowupRef:null,importAuthorityRef:null,metadataOverlayRequestRef:null,metadataOverlayOriginalRef:overlay?ref(requestCommit,requestPath):null,metadataDelta:[],candidateMetadataDelta:[],retainedOrdinals:[1],unchangedOrdinals:[3],heldRows:[{questionUid:uid(2),sourceOrdinal:2,sourceQuestionNo:'2',ordinal:2}],...zero(),nextAction:'Preserve the held UID until a separately authorized repair.'};
  let data=structuredClone(prior);
  function signCarrier(){
    save(carrierPath,proof);const c=commit('immutable typed carrier');data.sourceGitBlobSha=proof.sourceRef.gitBlobSha1;
    const group={carrier:ref(c,carrierPath),readInputs:proof.readInputsRef,observation:proof.observationRef,rootFollowup:proof.rootFollowupRef,importAuthority:proof.importAuthorityRef,metadataOverlayRequest:proof.metadataOverlayRequestRef};data.evidence[contract.GROUP]=group;
    data.items[1].registrationHold={schemaVersion:contract.HOLD_SCHEMA,reason:contract.REASON,questionUid:uid(2),sourceOrdinal:2,sourceQuestionNo:'2',ordinal:2,sourceGitBlobSha:proof.sourceRef.gitBlobSha1,wholeQuestionSha256:mod.sha(stable(bank[1])),studentPayloadSha256:mod.payloadHash(bank[1]),sourceFingerprint:mod.identityHash(bank[1]),m2ImportedCarrier:group.carrier,m2ImportedObservation:group.observation,m2ImportedRootFollowup:group.rootFollowup,nextAction:proof.nextAction};save(cp,data);
  }
  function signDocs(){
    save(ip,inputs);save(obp,raw);save(rootp,rootReview);save(ap,authority);if(overlay)save(frozenRequestPath,execFileSync('git',['-C',root,'show',proof.metadataOverlayOriginalRef.commit+':'+requestPath]));const c=commit('immutable original observations');proof.readInputsRef=ref(c,ip);proof.observationRef=ref(c,obp);proof.rootFollowupRef=ref(c,rootp);proof.importAuthorityRef=ref(c,ap);proof.metadataOverlayRequestRef=overlay?ref(c,frozenRequestPath):null;signCarrier();
  }
  function recomputeDeltas(){proof.metadataDelta=before.map((a,i)=>({sourceOrdinal:i+1,fields:delta(a,observed[i],contract.METADATA)})).filter(x=>x.fields.length);proof.candidateMetadataDelta=observed.map((a,i)=>({sourceOrdinal:i+1,fields:delta(a,bank[i],contract.OVERLAY)})).filter(x=>x.fields.length);}
  function rebind(){
    save(sp,js(observed));observedCommit=commit('truthfully bound observed-source counterexample');save(sp,js(bank));currentCommit=commit('truthfully bound candidate counterexample');
    proof.observedSourceRef=ref(observedCommit,sp,true);proof.sourceRef=ref(currentCommit,sp,true);if(overlay){request.expectedSourceBlobSha1=proof.sourceRef.gitBlobSha1;save(requestPath,request);requestCommit=commit('truthful request source binding');proof.metadataOverlayOriginalRef=ref(requestCommit,requestPath);}fill();recomputeDeltas();signDocs();
  }
  recomputeDeltas();signDocs();
  return {root,save,bytes,git,commit,ref,before,observed,bank,js,native,nativeRef,nativeCommit,baseCommit,prior,priorCommit,items,identity,review,reviewCommit,request,requestCommit,requestPath,frozenRequestPath,authority,proof,inputs,raw,rootReview,data,oldAssets,newAssets,carrierPath,ip,obp,rootp,ap,signCarrier,signDocs,rebind,recomputeDeltas,write:()=>save(cp,data)};
}
function denied(f,re=/M2_IMPORTED_CONTINUITY_/){const x=mod.build(f.root,{previous:null,reuseCache:false}).index;assert.equal(x.records.length,0,JSON.stringify(x.pending));assert(x.pending.some(p=>re.test(p.reason)),JSON.stringify(x.pending));return x;}
test('official dry/write/replay preserves imported full vector and metadata; held UID stays absent',t=>{
  const f=fixture(t),before=mod.sha(f.bytes(sp));const dry=mod.run(f.root);assert.equal(dry.verified,2);assert.equal(dry.pending,1);assert.match(dry.pendingItems[0].reason,/EXPLICIT_REVIEW_HOLD/);
  mod.run(f.root,{write:true});const check=mod.run(f.root,{check:true});assert.equal(check.changed,false);assert.equal(mod.sha(f.bytes(sp)),before);
  const index=JSON.parse(f.bytes('archive/data/item-4slot-index.json')),api=require('../archive/item-4slot.js').createIndex(index);assert(api.get(uid(1)));assert(api.get(uid(3)));assert.equal(api.get(uid(2)),null);
});
test('no candidate metadata overlay is required for an exact observed source',t=>{const f=fixture(t,{overlay:false});assert.equal(mod.run(f.root).verified,2);});
test('existing metadata delta is byte-bound and does not become a slot field',t=>{const f=fixture(t);const x=mod.build(f.root).index;assert.equal(x.records.length,2);for(const r of x.records)assert(!Object.hasOwn(r,'primaryMethod'));});
test('a changed original vector is rejected',t=>{const f=fixture(t);f.data.items[0].given=[2];f.write();denied(f,/EXACT_ITEM/);});
test('reviewedBy may not be upgraded to independent full-exam approval',t=>{const f=fixture(t);f.data.reviewedBy.independentFullExamReview=true;f.write();denied(f,/ORIGINAL_VECTOR/);});
test('an omitted native item cannot reduce the denominator',t=>{const f=fixture(t);f.data.items.pop();f.write();denied(f,/FULL_DENOMINATOR/);});
test('an unchanged row cannot absorb a truthfully rebound renderer change',t=>{const f=fixture(t);f.observed[2].image=f.newAssets[2].slice(8);f.bank[2].image=f.observed[2].image;f.rebind();denied(f,/UNTOUCHED_CHANGED/);});
test('truthfully rebound answer change is rejected despite fresh observation hashes',t=>{const f=fixture(t);f.observed[0].answer='B';f.bank[0].answer='B';f.rebind();denied(f,/SOURCE_FIELD_SCOPE/);});
test('proof or table transcription is outside this remaining71 contract',t=>{const f=fixture(t);f.observed[0].content+='\n|a|b|\n|---|---|\n|1|2|';f.bank[0].content=f.observed[0].content;f.rebind();denied(f,/PROTECTED_TEXT/);});
test('missing existing metadata delta cannot silently bless current values',t=>{const f=fixture(t);f.proof.metadataDelta=[];f.signCarrier();denied(f,/METADATA_DELTA_BINDING/);});
test('non-approved candidate metadata field is rejected after honest source rebinding',t=>{const f=fixture(t);f.bank[0].difficultyBucket='new value';f.rebind();denied(f,/CANDIDATE_OVERLAY_FIELDS/);});
test('candidate value must equal the already-bound request after value',t=>{const f=fixture(t);f.bank[0].courseKey='M9-9';f.rebind();denied(f,/OVERLAY_EXISTING_VALUE/);});
test('request identity or source scope drift is rejected',t=>{const f=fixture(t);f.request.items[0].questionUid=uid(99);f.rebind();denied(f,/OVERLAY_IDENTITY/);});
test('new metadata approval assertion in the carrier is rejected',t=>{const f=fixture(t);f.proof.newSemanticApprovals=1;f.signCarrier();denied(f,/NO_NEW_APPROVAL|HISTORY_UNAVAILABLE/);});
test('raw observer asset substitution is rejected with honest re-signing',t=>{const f=fixture(t);f.raw.rows[0].currentAssets=structuredClone(f.raw.rows[1].currentAssets);f.signDocs();denied(f,/RAW_OBSERVATION_ROW/);});
test('ROOT did not observe ordinary rows and cannot be substituted for their actual observer',t=>{const f=fixture(t);f.raw.reviewer=f.rootReview.reviewer;f.signDocs();denied(f,/ROOT_SCOPE/);});
test('missing ROOT negative evidence rejects the full transport, not just the held row',t=>{const f=fixture(t);f.rootReview.rows=[];f.signDocs();denied(f,/ROOT_HOLD_COVERAGE/);});
test('raw negative classification cannot be changed to positive',t=>{const f=fixture(t);f.raw.rows[1].decision='RETAIN_EXISTING_VECTOR';f.signDocs();denied(f,/HOLD_OBSERVER/);});
test('ROOT source reference must itself match the actually inspected source',t=>{const f=fixture(t);f.rootReview.rows[0].currentSourceRef=f.ref(f.baseCommit,sp,true);f.signDocs();denied(f,/ROOT_SOURCE/);});
test('existing import operation count and its targets are mandatory',t=>{const f=fixture(t);f.authority.selectedSources[0].selectedOperationCount=0;f.signDocs();denied(f,/IMPORT_OPERATION_COUNT/);});
test('current raw SVG drift is rejected before cache reuse',t=>{const f=fixture(t),old=mod.build(f.root).index;f.save(f.newAssets[0],'<svg/>');const x=mod.build(f.root,{previous:old}).index;assert.equal(x.records.length,0);assert(x.pending.some(p=>/LIVE_BYTES/.test(p.reason)));});
for(const [label,payload] of [['SMIL','<svg><animate attributeName="x"/></svg>'],['Unicode-prefixed script','<svg xmlns:한="http://www.w3.org/2000/svg"><한:script/></svg>'],['CSS animation','<svg><style>@keyframes x{} .a{animation:x 1s}</style></svg>'],['external reference','<svg><image href="https://example.invalid/a.png"/></svg>']])test('truthfully rebound static asset gate rejects '+label,t=>{const f=fixture(t);f.save(f.newAssets[0],payload);f.rebind();denied(f,/DYNAMIC_SVG|UNBOUND_SVG_DEPENDENCY/);});
test('deleting a held-row marker cannot fall through to ordinary registration',t=>{const f=fixture(t);delete f.data.items[1].registrationHold;f.write();denied(f,/OBLIGATION_REQUIRED/);});
test('committed simultaneous proof, marker and carrier deletion remains rejected',t=>{
  const f=fixture(t),old=mod.build(f.root).index;delete f.data.evidence[contract.GROUP];delete f.data.items[1].registrationHold;f.write();for(const p of [f.carrierPath,f.ip,f.obp,f.rootp,f.ap])fs.unlinkSync(path.join(f.root,p));f.commit('delete all issued proof and markers');
  denied(f,/OBLIGATION_REQUIRED/);const x=mod.build(f.root,{previous:old}).index;assert.equal(x.records.length,0);assert(x.pending.some(p=>/OBLIGATION_REQUIRED/.test(p.reason)));
});
test('a normal non-opt-in fixture is unchanged when no ancestry claim exists',t=>{const f=fixture(t);f.git('checkout','-q',f.priorCommit);f.git('restore','--source',f.priorCommit,'--',cp);const x=mod.build(f.root,{previous:null}).index;assert.equal(x.records.length,3,JSON.stringify(x.pending));assert.equal(x.pending.length,0);});
test('every original native quote is rechecked rather than trusting a historical pass',t=>{const f=fixture(t);f.observed[2].solution='Different fixture solution';f.bank[2].solution=f.observed[2].solution;f.rebind();denied(f,/NATIVE_VALIDATION/);});
test('duplicate raw asset refs cannot replace a missing distinct current asset',t=>{const f=fixture(t);f.observed[0].solutionImage=f.newAssets[1].slice(8);f.bank[0].solutionImage=f.observed[0].solutionImage;f.rebind();assert.equal(f.raw.rows[0].currentAssets.length,2);f.raw.rows[0].currentAssets=[structuredClone(f.raw.rows[0].currentAssets[0]),structuredClone(f.raw.rows[0].currentAssets[0])];f.signDocs();denied(f,/RAW_OBSERVATION_ROW/);});
test('ROOT cannot release a held row by removing its carrier partition',t=>{const f=fixture(t);f.proof.retainedOrdinals=[1,2];f.proof.heldRows=[];f.proof.rootFollowupRef=null;f.signCarrier();delete f.data.items[1].registrationHold;f.write();denied(f,/OBLIGATION_REQUIRED/);});
test('a merge that deletes all issued witnesses still retains the ancestor obligation',t=>{
  const f=fixture(t),previous=mod.build(f.root).index,issued=f.commit('issued transport and hold');
  f.git('reset','--hard',f.requestCommit);const clean=structuredClone(f.prior);clean.sourceGitBlobSha=f.proof.sourceRef.gitBlobSha1;f.save(cp,clean);const other=f.commit('ordinary tree without issued witnesses');
  const tree=f.git('rev-parse','HEAD^{tree}').trim();const merged=f.git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit-tree',tree,'-p',other,'-p',issued,'-m','merge preserving witness-free tree').trim();f.git('reset','--hard',merged);
  denied(f,/OBLIGATION_REQUIRED/);const x=mod.build(f.root,{previous}).index;assert.equal(x.records.length,0);assert(x.pending.some(p=>/OBLIGATION_REQUIRED/.test(p.reason)));
});
test('consuming the original inbox does not discard the durable immutable overlay binding',t=>{const f=fixture(t);fs.unlinkSync(path.join(f.root,f.requestPath));f.commit('metadata writer consumed the original inbox');assert.equal(mod.run(f.root).verified,2);});
test('deleting the durable overlay copy is rejected after the original inbox was consumed',t=>{const f=fixture(t);fs.unlinkSync(path.join(f.root,f.requestPath));f.commit('metadata writer consumed the original inbox');fs.unlinkSync(path.join(f.root,f.frozenRequestPath));denied(f,/LIVE_UNAVAILABLE/);});
test('a truthfully rebound durable request cannot differ from the immutable original',t=>{const f=fixture(t);const altered=structuredClone(f.request);altered.reason='different request bytes';f.save(f.frozenRequestPath,altered);const c=f.commit('truthful altered durable request');f.proof.metadataOverlayRequestRef=f.ref(c,f.frozenRequestPath);f.signCarrier();denied(f,/OVERLAY_ORIGINAL_BYTES/);});
test('an existing import amendment remains explicit instead of becoming a new ordinary judgment',t=>{const f=fixture(t);f.raw.rows[0].specialBoundary=null;f.signDocs();denied(f,/ORDINARY_ONLY/);});
test('new transcription is not inferred from an existing quote-amendment marker',t=>{const f=fixture(t);f.raw.rows[0].specialBoundary='BODY_TRANSCRIPTION_CONTINUITY';f.signDocs();denied(f,/ORDINARY_ONLY/);});
test('one existing inline image may be replaced with all outside text and authority exact',t=>{const f=fixture(t,{inlineImage:true});assert.equal(mod.run(f.root).verified,2);});
test('the existing append-image branch remains separate from replacement',t=>{const f=fixture(t);f.observed[0].content+='<br><img src="'+f.newAssets[0].slice(8)+'">';f.bank[0].content=f.observed[0].content;f.rebind();assert.equal(mod.run(f.root).verified,2);});
test('inline replacement requires the original actual-observation markup-only detail',t=>{const f=fixture(t,{inlineImage:true});f.raw.rows[0].detail.contentDeltaLimitedToImageMarkup=false;f.signDocs();denied(f,/IMAGE_TOKEN_OBSERVATION/);});
test('inline replacement cannot alter a literal outside the image token',t=>{const f=fixture(t,{inlineImage:true});f.observed[0].content=f.observed[0].content.replace('Unchanged sequence','Changed sequence');f.bank[0].content=f.observed[0].content;f.rebind();denied(f,/PROTECTED_TEXT/);});
for(const [label,make] of [
  ['comment-only fake image',tag=>'<!--'+tag+'-->'],
  ['script-contained fake image',tag=>'<script>'+tag+'</script>'],
  ['quoted-attribute fake image',tag=>'<span data-copy=\''+tag+'\'></span>'],
  ['prose asset path',(_,f)=>f.newAssets[0].slice(8)],
  ['duplicate src',tag=>tag.replace(' alt=', ' src="assets/images/imported-fixture/new1.svg" alt=')],
  ['event attribute',tag=>tag.replace(' alt=', ' onload="run()" alt=')],
  ['HTML entity in src',tag=>tag.replace('new1.svg','new1.s&#118;g')],
  ['quoting escape',tag=>tag.replace('Given diagram','Given\\" diagram')],
  ['escaped CSS URL',tag=>tag.replace('display:block;','background-image:u\\72l(https://example.invalid/a.png);')],
  ['entity CSS URL',tag=>tag.replace('display:block;','background-image:&#117;rl(https://example.invalid/a.png);')],
  ['CSS animation',tag=>tag.replace('display:block;','animation:spin 1s;')],
  ['second actual image',tag=>tag+tag],
  ['unquoted src',tag=>tag.replace('src="assets/images/imported-fixture/new1.svg"','src=assets/images/imported-fixture/new1.svg')],
])test('truthfully rebound inline replacement rejects '+label,t=>{const f=fixture(t,{inlineImage:true});f.observed[0].content=f.observed[0].content.replace(/<img\b[^>]*>/,tag=>make(tag,f));f.bank[0].content=f.observed[0].content;f.rebind();denied(f,/IMAGE_TOKEN|PROTECTED_TEXT|NATIVE_VALIDATION/);});

'use strict';
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{execFileSync}=require('node:child_process');
const mod=require('../../tools/4slot/build-4slot-runtime.cjs'),contract=require('../../tools/4slot/m2s2-imported-current-continuity.cjs');
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const uid=n=>'qid_v1_'+String(n).padStart(64,'0');
const source='original/middle/m2/2final/imported-current-fixture.js',sp='archive/exams/'+source,cp='archive/data/item-4slot/'+source.replace(/\.js$/,'.4slot.json');
const dir='docs/operations/m2-imported-fixture/',dp='docs/architecture/4slot/term-dictionary-v1.5.json';
const zero=()=>Object.fromEntries(contract.ZERO.map(k=>[k,0]));
const fields=(a,b)=>[...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>Object.hasOwn(a,k)!==Object.hasOwn(b,k)||stable(a[k])!==stable(b[k])).sort();
const delta=(a,b,allowed)=>fields(a,b).filter(k=>allowed.has(k)).map(field=>({field,beforePresent:Object.hasOwn(a,field),afterPresent:Object.hasOwn(b,field),beforeSha256:Object.hasOwn(a,field)?mod.sha(stable(a[field])):null,afterSha256:Object.hasOwn(b,field)?mod.sha(stable(b[field])):null}));
function fixture(t,{overlay=true,inlineImage=false,amendmentTerms=false,held=true,displayPng=null}={}){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'m2-imported-current-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const save=(p,v)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),Buffer.isBuffer(v)||typeof v==='string'?v:JSON.stringify(v));};
  const bytes=p=>fs.readFileSync(path.join(root,p));
  const git=(...a)=>execFileSync('git',['-C',root,...a],{encoding:'utf8',stdio:['ignore','pipe','pipe']});
  const commit=m=>{git('add','.');git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','--allow-empty','-qm',m);return git('rev-parse','HEAD').trim();};
  const ref=(c,p,full=false)=>{const b=execFileSync('git',['-C',root,'show',c+':'+p]);return {commit:c,path:p,...(full?{gitBlobSha1:mod.blob(b)}:{}),sha256:mod.sha(b)};};
  const full=r=>ref(r.commit,r.path,true),js=b=>'window.questionBank='+JSON.stringify(b)+';';
  const oldAssets=[1,2,3].map(i=>'archive/assets/images/imported-fixture/old'+i+'.svg'),newAssets=[1,2,3].map(i=>'archive/assets/images/imported-fixture/new'+i+'.svg');
  if(displayPng)oldAssets[1]='archive/assets/images/imported-fixture/old2.png';
  const svg='<svg xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="5" r="3"/></svg>';
  const original=[1,2,3].map(i=>({id:i,content:'Fixture given '+i,choices:['A','B'],answer:'A',solution:'Original fixture method '+i,image:oldAssets[i-1].slice(8),layoutTag:'grid',primaryMethod:'existing source value'}));
  if(displayPng)original[1].solutionImage='assets/images/imported-fixture/native-solution.svg';
  if(inlineImage)original[0].content+='<div class="figure"><img src="'+oldAssets[0].slice(8)+'"></div><span>Unchanged sequence</span>';
  const dict={dictionaryVersion:'term-dict-v1.5-2026-11-04',terms:[{id:1,ko:'fixture given'},{id:2,ko:'fixture goal'},{id:3,ko:'fixture method'}]};
  if(amendmentTerms)dict.terms.push({id:4,ko:'fixture approved specific given'});
  const np='archive-work/4slot-annotate-v1/out/'+source.replace(/\.js$/,'.4slot.json'),qp='archive-work/4slot-annotate-v1/QUEUE-original.json',rp='tools/4slot/bulk-delta-overrides.json',op='tools/4slot/publish-reviewed-bulk.cjs';
  const native={schemaVersion:'archive-meta-4slot-v0',sourceArchiveFile:source,sourceGitBlobSha:mod.blob(js(original)),dictionaryVersion:dict.dictionaryVersion,judgedBy:{agent:'original-author',run:'synthetic-fixture',at:'2026-11-04'},items:original.map((q,i)=>({sourceOrdinal:i+1,format:'단일 정답',slots:{given:[{term:'fixture given',src:'stem',quote:'Fixture given'}],goal:[{term:'fixture goal',src:'stem',quote:'Fixture given'}],method:[{term:'fixture method',src:'solution',quote:q.solution,evidenceType:'NAMED'}],condition:[]}})),candidates:[],selfCheck:{}};
  if(amendmentTerms){native.items[2].slots.method.push({term:'unapproved fixture method',src:'solution',quote:original[2].solution,evidenceType:'NAMED'});native.candidates=[{term:'unapproved fixture method',en:'fixture',synonyms:[],kind:'method',parent:'fixture method',note:'Synthetic unapproved candidate.',usedIn:[3]}];}
  const qr={path:source,blob:native.sourceGitBlobSha,items:3,order:130};
  save(sp,js(original));save(dp,dict);save(np,native);save(qp,{list:[qr]});for(const p of oldAssets)save(p,p.endsWith('.png')?displayPng:svg);if(displayPng)save('archive/assets/images/imported-fixture/native-solution.svg',svg);
  const identity={records:original.map((q,i)=>({questionUid:uid(i+1),sourceArchiveFile:source,sourceOrdinal:i+1,sourceQuestionNo:String(q.id),sourceFingerprint:mod.identityHash(q),status:'VERIFIED'}))};save('archive/data/question_identity_map.json',identity);
  git('init','-q');const nativeCommit=commit('original synthetic native authority');
  const before=structuredClone(original);before[0].solution='Previously reviewed fixture method 1';save(sp,js(before));const baseCommit=commit('previously reviewed source before import');
  const review={schemaVersion:'four-slot-bulk-targeted-delta-review-v1',authoringCommit:nativeCommit,baseMain:baseCommit,reviewer:'existing-import-reviewer',scope:'Existing exact quote change only',independentFullExamReview:false,operations:[{order:130,ordinal:1,op:'replaceQuote',slot:'method',term:'fixture method',quote:before[0].solution,src:'solution'}],reviewedNonpresentationChanges:[{order:130,ordinal:1}]};
  save(rp,review);save(op,'// Immutable synthetic import operator; not executed.\n');const reviewCommit=commit('existing import review');
  const items=original.map(q=>({ordinal:q.id,format:'단일 정답',given:[1],goal:[2],method:[3],condition:[],candidates:[]}));
  if(amendmentTerms)items[2].candidates=['unapproved fixture method'];
  const prior={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:source,sourceGitBlobSha:mod.blob(js(before)),dictionaryVersion:dict.dictionaryVersion,evidence:{branch:'work/4slot-annotate-v1',commit:nativeCommit,path:np,originalSha256:ref(nativeCommit,np).sha256,importDelta:{baseSourceGitBlobSha:native.sourceGitBlobSha,authoringSnapshot:nativeCommit,reviewRecord:{branch:'ops/fixture',...ref(reviewCommit,rp)}}},reviewedBy:{agent:review.reviewer,at:'2026-11-05',sampled:[1],scope:'TECHNICAL_IMPORT_ALL_AND_TARGETED_CHANGED_SLOTS',independentFullExamReview:false,originalAuthor:native.judgedBy},items};
  save(cp,prior);const priorCommit=commit('existing imported compact');
  const observed=structuredClone(before);observed[0].image=newAssets[0].slice(8);observed[1].image=newAssets[1].slice(8);for(const q of observed)q.primaryMethod='already present unrelated metadata';
  if(displayPng)Object.assign(observed[1],{imageAlt:'Unsupported derived figure',imageSize:'tall',layoutTag:'fullwidth',solutionImage:newAssets[1].slice(8),solutionImageAlt:'Derived solution',solutionImageCaption:'Unsupported area placement'});
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
      decision:i&&held?'HOLD_CURRENT_RENDERER':'RETAIN_EXISTING_VECTOR',
      specialBoundary:i?(held?'CURRENT_SOLUTION_AREA_LABEL_AMBIGUITY':null):'EXISTING_IMPORT_QUOTE_AMENDMENT_RETAINED',
      observation:'Synthetic actual-observer fixture; no real approval.',...(inlineImage&&i===0?{detail:{contentDeltaLimitedToImageMarkup:true}}:{}),
      existingFourSlotsAllRead:true,currentStemChoicesAnswerSolutionActuallyRead:true,originalNativeRowActuallyRead:true,
      actualChromeInspectionByThisReviewer:false,actualPriorAssetInspection:r.priorAssets.length>0,actualCurrentAssetInspection:r.currentAssets.length>0,
      cardRef:{sha256:mod.sha('fixture card '+(i+1))},newSlotValues:0,newMathApproval:0,newDifficultyApproval:0,sourceMutation:0,assetMutation:0}));
    const r=raw.rows[1];rootReview.rows=[{sourceArchiveFile:source,questionUid:uid(2),sourceOrdinal:2,decision:'WITHHOLD_CURRENT_RENDERER',choiceAnswerSolutionUnchanged:true,nativeProjectionExact:true,fullSourceDenominator:3,priorWholeQuestionSha256:r.priorWholeQuestionSha256,currentWholeQuestionSha256:r.currentWholeQuestionSha256,frozenVectorSha256:r.frozenItemSha256,priorSourceRef,observerCurrentSourceRef:ref(observedCommit,sp,true),currentSourceRef:ref(observedCommit,sp,true),nativeAuthorityRef:full(nativeRef),compactRef:priorCompactRef,priorAssets:r.priorAssets,currentAssets:r.currentAssets,card:{sha256:r.cardRef.sha256,actuallyViewed:true},reasonCode:displayPng?'AREA_LABEL_OUTSIDE_REFERENCED_REGION':'SYNTHETIC_RENDERER_MISMATCH',observation:'Synthetic root held row only.',inspected:{fullStem:true,choices:true,solutionText:true,nativeFourSlots:true}}];
  }
  fill();
  const proof={schemaVersion:contract.CARRIER_SCHEMA,scope:contract.SCOPE,transportAuthor:'transport-author',sourceArchiveFile:source,expectedQuestionCount:3,priorCompactRef,nativeSourceRef:ref(nativeCommit,sp,true),priorSourceRef,observedSourceRef:ref(observedCommit,sp,true),sourceRef:ref(currentCommit,sp,true),dictionaryRef:ref(currentCommit,dp,true),nativeFourSlotRef:nativeRef,queueRef:ref(nativeCommit,qp),importReviewRef:ref(reviewCommit,rp),importOperatorRef:ref(reviewCommit,op),readInputsRef:null,observationRef:null,rootFollowupRef:null,importAuthorityRef:null,metadataOverlayRequestRef:null,metadataOverlayOriginalRef:overlay?ref(requestCommit,requestPath):null,metadataDelta:[],candidateMetadataDelta:[],retainedOrdinals:held?[1]:[1,2],unchangedOrdinals:[3],heldRows:held?[{questionUid:uid(2),sourceOrdinal:2,sourceQuestionNo:'2',ordinal:2}]:[],...zero(),nextAction:'Preserve the held UID until a separately authorized repair.'};
  let data=structuredClone(prior);
  function signCarrier(){
    save(carrierPath,proof);const c=commit('immutable typed carrier');data.sourceGitBlobSha=proof.sourceRef.gitBlobSha1;
    const group={carrier:ref(c,carrierPath),readInputs:proof.readInputsRef,observation:proof.observationRef,rootFollowup:proof.rootFollowupRef,importAuthority:proof.importAuthorityRef,metadataOverlayRequest:proof.metadataOverlayRequestRef};data.evidence[contract.GROUP]=group;
    if(held)data.items[1].registrationHold={schemaVersion:contract.HOLD_SCHEMA,reason:contract.REASON,questionUid:uid(2),sourceOrdinal:2,sourceQuestionNo:'2',ordinal:2,sourceGitBlobSha:proof.sourceRef.gitBlobSha1,wholeQuestionSha256:mod.sha(stable(bank[1])),studentPayloadSha256:mod.payloadHash(bank[1]),sourceFingerprint:mod.identityHash(bank[1]),m2ImportedCarrier:group.carrier,m2ImportedObservation:group.observation,m2ImportedRootFollowup:group.rootFollowup,nextAction:proof.nextAction};save(cp,data);
  }
  function signDocs(){
    save(ip,inputs);save(obp,raw);save(rootp,rootReview);save(ap,authority);if(overlay)save(frozenRequestPath,execFileSync('git',['-C',root,'show',proof.metadataOverlayOriginalRef.commit+':'+requestPath]));const c=commit('immutable original observations');proof.readInputsRef=ref(c,ip);proof.observationRef=ref(c,obp);proof.rootFollowupRef=held?ref(c,rootp):null;proof.importAuthorityRef=ref(c,ap);proof.metadataOverlayRequestRef=overlay?ref(c,frozenRequestPath):null;signCarrier();
  }
  function recomputeDeltas(){proof.metadataDelta=before.map((a,i)=>({sourceOrdinal:i+1,fields:delta(a,observed[i],contract.METADATA)})).filter(x=>x.fields.length);proof.candidateMetadataDelta=observed.map((a,i)=>({sourceOrdinal:i+1,fields:delta(a,bank[i],contract.OVERLAY)})).filter(x=>x.fields.length);}
  function rebind(){
    save(sp,js(observed));observedCommit=commit('truthfully bound observed-source counterexample');save(sp,js(bank));currentCommit=commit('truthfully bound candidate counterexample');
    proof.observedSourceRef=ref(observedCommit,sp,true);proof.sourceRef=ref(currentCommit,sp,true);if(overlay){request.expectedSourceBlobSha1=proof.sourceRef.gitBlobSha1;save(requestPath,request);requestCommit=commit('truthful request source binding');proof.metadataOverlayOriginalRef=ref(requestCommit,requestPath);}fill();recomputeDeltas();signDocs();
  }
  recomputeDeltas();signDocs();
  return {root,save,bytes,git,commit,ref,before,observed,bank,js,native,nativeRef,nativeCommit,baseCommit,prior,priorCommit,items,identity,review,reviewCommit,request,requestCommit,requestPath,frozenRequestPath,authority,proof,inputs,raw,rootReview,data,oldAssets,newAssets,carrierPath,ip,obp,rootp,ap,signCarrier,signDocs,rebind,recomputeDeltas,write:()=>save(cp,data)};
}

module.exports={fixture,stable,uid,source,sp,cp,dir,dp,fields,delta,mod,contract};

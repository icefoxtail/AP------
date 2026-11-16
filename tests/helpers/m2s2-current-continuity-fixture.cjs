'use strict';
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{execFileSync}=require('node:child_process');
const mod=require('../../tools/4slot/build-4slot-runtime.cjs');
const continuity=require('../../tools/4slot/m2s2-current-continuity.cjs');
const uid=n=>'qid_v1_'+String(n).padStart(64,'0');
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const source='original/middle/m2/2mid/current-continuity-fixture.js',sp='archive/exams/'+source,cp='archive/data/item-4slot/'+source.replace(/\.js$/,'.4slot.json');
const dictPath='docs/architecture/4slot/term-dictionary-v1.5.json',dir='docs/operations/m2-current-fixture/';
const zero=()=>Object.fromEntries(continuity.ZERO.map(k=>[k,0]));
const inspection=()=>({stemRead:true,solutionRead:true,allFourSlotsRead:true,actualRendererRead:true});
function fixture(t,{multiAssets=false,noPriorHeldAsset=false,repairReady=false,displayPng=null,displayClarificationSvg=null,nativeAfterByOrdinal=null}={}) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'m2-current-continuity-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const save=(p,v)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'||Buffer.isBuffer(v)?v:JSON.stringify(v));};
  const bytes=p=>fs.readFileSync(path.join(root,p));
  // Both explicit commits and merge commits use a fixture-local identity.
  const git=(...args)=>execFileSync('git',['-C',root,'-c','user.name=Fixture','-c','user.email=fixture@example.invalid',...args],{encoding:'utf8',stdio:['ignore','pipe','pipe']});
  const commit=msg=>{git('add','.');git('commit','--allow-empty','-qm',msg);return git('rev-parse','HEAD').trim();};
  const ref=(c,p,full=false)=>{const raw=execFileSync('git',['-C',root,'show',c+':'+p],{stdio:['ignore','pipe','pipe']});return {commit:c,path:p,...(full?{gitBlobSha1:mod.blob(raw)}:{}),sha256:mod.sha(raw)};};
  const js=bank=>'window.questionBank='+JSON.stringify(bank)+';';
  const asset=n=>'archive/assets/images/m2-current-fixture/'+n;
  const oldAssets=[asset('proof-old.png'),asset('annotation-old.svg'),asset('held-old.svg'),asset('unchanged.png')];
  if(repairReady)oldAssets[2]=asset('held-native.png');
  const currentAssets=[asset('proof-current.svg'),asset('annotation-current.svg'),asset('held-current.svg'),oldAssets[3],asset('inline-current.svg')];
  const before=Array.from({length:5},(_,i)=>({id:i+1,content:'Fixture question '+(i+1),choices:['A','B'],answer:'A',solution:'Unchanged fixture solution '+(i+1),...(i<4?{image:oldAssets[i].slice(8)}:{}),layoutTag:'grid'}));
  if(repairReady)before[2].solution='Old fixture first line.\nUnchanged fixture suffix.';
  before[0].content='Complete the proof shown in the original image.';
  if(noPriorHeldAsset||displayClarificationSvg)delete before[2].image;
  if(multiAssets){before[4].image=oldAssets[3].slice(8);before[1].content+='<br><img src="'+oldAssets[3].slice(8)+'" alt="Existing fixture diagram">';}
  const dict={dictionaryVersion:'term-dict-v1.5-2026-11-04',terms:[{id:1,ko:'fixture given'},{id:2,ko:'fixture goal'},{id:3,ko:'fixture method'}]};
  const items=before.map(q=>({ordinal:q.id,format:'빈칸 채우기',given:[1],goal:[2],method:[3],condition:[],candidates:[]}));
  const np='archive/data/meta-review/m2-s2-20261114/exams/E999/';
  const nativePath=np+'four-slot.json',reviewPath=np+'review.json',acceptPath=np+'root-acceptance.json',samplePath=np+'independent-sample.json';
  const native={schemaVersion:'archive-meta-4slot-v0',sourceArchiveFile:source,sourceGitBlobSha:mod.blob(js(before)),dictionaryVersion:dict.dictionaryVersion,judgedBy:{agent:'original-author'},items:before.map((q,i)=>({sourceOrdinal:i+1,questionUid:uid(i+1),format:items[i].format,slots:{given:[{term:'fixture given'}],goal:[{term:'fixture goal'}],method:[{term:'fixture method'}],condition:[]}})),candidates:[],selfCheck:{}};
  const nativeReview={schemaVersion:'m2-s2-meta-review-v1',examId:'E999',owner:'original-author',sourceArchiveFile:source,sourceGitBlobSha:native.sourceGitBlobSha,items:before.map((_,i)=>({sourceOrdinal:i+1,questionUid:uid(i+1),...(repairReady&&i===2?{primaryMethod:'Existing synthetic method',decisiveStep:'Existing synthetic step'}:{})}))};
  if(nativeAfterByOrdinal)for(const item of nativeReview.items)if(Object.hasOwn(nativeAfterByOrdinal,item.sourceOrdinal))item.after=structuredClone(nativeAfterByOrdinal[item.sourceOrdinal]);
  const sample={schemaVersion:'m2-s2-independent-sample-v1',examId:'E999',author:'original-author',reviewer:'original-independent',sourceGitBlobSha:native.sourceGitBlobSha};
  const identity={records:before.map((q,i)=>({questionUid:uid(i+1),sourceArchiveFile:source,sourceOrdinal:i+1,sourceQuestionNo:String(q.id),sourceFingerprint:mod.identityHash(q),status:'VERIFIED'}))};
  const svg='<svg xmlns="http://www.w3.org/2000/svg"><circle cx="4" cy="4" r="2"/></svg>';
  save(sp,js(before));save(dictPath,dict);save('archive/data/question_identity_map.json',identity);save(nativePath,native);save(reviewPath,nativeReview);save(samplePath,sample);
  for(const a of oldAssets)save(a,a.endsWith('.png')?(displayPng||Buffer.from([137,80,78,71,13,10,26,10,255,0,129])):svg);
  save(acceptPath,{schemaVersion:'m2-s2-root-acceptance-v1',examId:'E999',owner:'original-author',reviewer:'ROOT',sampleReviewer:'original-independent',semanticReviewStatus:'PRO_REVIEW_COMPLETE',sourceUnchanged:true,sourceGitBlobSha:native.sourceGitBlobSha,sourceSha256:mod.sha(bytes(sp)),fourSlotSha256:mod.sha(bytes(nativePath)),reviewSha256:mod.sha(bytes(reviewPath)),independentSampleSha256:mod.sha(bytes(samplePath))});
  git('init','-q');const nativeCommit=commit('synthetic original source and accepted full vector');
  const prior={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:source,sourceGitBlobSha:native.sourceGitBlobSha,dictionaryVersion:dict.dictionaryVersion,evidence:{branch:'review/fixture',...ref(nativeCommit,nativePath),rootAcceptance:ref(nativeCommit,acceptPath),independentReview:ref(nativeCommit,samplePath),sourceReuse:{kind:'UNCHANGED_STUDENT_PAYLOAD',reviewedSourceGitBlobSha:native.sourceGitBlobSha,currentSourceGitBlobSha:native.sourceGitBlobSha}},reviewedBy:{agent:'original-reviewer',at:'2026-11-15',sampled:[1]},items};
  save(cp,prior);const priorCommit=commit('existing full compact'),priorCompactRef=ref(priorCommit,cp,true),priorSourceRef=ref(priorCommit,sp,true);
  const bank=structuredClone(before);
  bank[0].content='Proof: step ㉠ followed by step ㉡.';bank[0].image=currentAssets[0].slice(8);bank[0].layoutTag='fullwidth';
  bank[1].image=currentAssets[1].slice(8);bank[2].image=currentAssets[2].slice(8);
  if(repairReady)Object.assign(bank[2],{imageAlt:'Fixture unsupported annotation',imageSize:'tall',layoutTag:'fullwidth'});
  if(displayClarificationSvg){delete bank[2].image;delete bank[2].imageAlt;delete bank[2].imageSize;bank[2].content+='<br><img src="'+currentAssets[2].slice(8)+'" alt="Ambiguous whole-side markers">';}
  bank[4].content+='<br><img src="'+currentAssets[4].slice(8)+'" alt="Fixture diagram">';bank[4].layoutTag='fullwidth';
  save(sp,js(bank));for(const a of currentAssets.filter(a=>a.endsWith('.svg')))save(a,displayClarificationSvg&&a===currentAssets[2]?displayClarificationSvg:svg);
  let currentCommit=commit('current source presentation');
  const author='transport-author',reviewer='actual-observer',rootReviewer='independent-root';
  const rawPath=dir+'raw-observer.json',rawRootPath=dir+'raw-root.json',obsPath=dir+'continuity-review.json',rootPath=dir+'m2-current-four-slot-root-closure.json',carrierPath=dir+'m2-current-four-slot-transport.json';
  const kinds={1:'BODY_TRANSCRIPTION_CONTINUITY',2:'ANNOTATION_ONLY_REMOVAL_CONTINUITY',3:'WITHHOLD_CURRENT_RENDERER',5:'RENDERER_PRESENTATION_CONTINUITY'};
  // The existing byte monitor inventories path literals too; these fixtures
  // deliberately do not equate that inventory with actual rendered img tags.
  const assetRefs=(c,q)=>[...new Set([...JSON.stringify(q).matchAll(/(?:archive\/)?assets\/[A-Za-z0-9_가-힣%./+()@ -]+\.(?:png|jpe?g|gif|webp|svg)/gi)].map(m=>m[0].startsWith('archive/')?m[0]:'archive/'+m[0]))].sort().map(p=>({...ref(c,p,true),visuallyInspected:true}));
  const fields=(old,q)=>[...new Set([...Object.keys(old),...Object.keys(q)])].filter(k=>Object.hasOwn(old,k)!==Object.hasOwn(q,k)||stable(old[k])!==stable(q[k])).sort();
  function observedRows() {
    return [1,2,3,5].map(n=>({questionUid:uid(n),sourceOrdinal:n,sourceQuestionNo:String(n),ordinal:n,continuityKind:kinds[n],compactItemSha256:mod.sha(stable(items[n-1])),priorWholeQuestionSha256:mod.sha(stable(before[n-1])),currentWholeQuestionSha256:mod.sha(stable(bank[n-1])),priorStudentPayloadSha256:mod.payloadHash(before[n-1]),currentStudentPayloadSha256:mod.payloadHash(bank[n-1]),changedFields:fields(before[n-1],bank[n-1]),inspection:inspection(),priorAssets:assetRefs(priorCommit,before[n-1]),currentAssets:assetRefs(currentCommit,bank[n-1]),captureSha256s:[mod.sha('synthetic capture '+n)],observed:'Synthetic fixture only; no real-world approval is claimed.'}));
  }
  const rawObservation={schemaVersion:continuity.RAW_REVIEW_SCHEMA,observer:reviewer,newMathematicalApproval:false,newSlotApproval:false,sourceWrites:0,assetWrites:0,slotChanges:0,rows:[]};
  const rawRoot={schemaVersion:continuity.RAW_ROOT_SCHEMA,reviewer:rootReviewer,transportAuthor:author,...zero(),rows:[]};
  const observation={schemaVersion:continuity.REVIEW_SCHEMA,scope:continuity.SCOPE,observer:reviewer,transportAuthor:author,reviewedAtUtc:'2026-11-16T00:00:00Z',sourceArchiveFile:source,priorSourceRef,sourceRef:ref(currentCommit,sp,true),priorCompactRef,rawObservationRef:null,rows:observedRows(),...zero()};
  function body() {
    const blankOrder=['㉠','㉡'];
    return {kind:'PROOF_TEXT_WITH_ORDERED_BLANKS',contentBeforeSha256:mod.sha(before[0].content),contentAfterSha256:mod.sha(bank[0].content),literalStatementsPreserved:true,blankOrderPreserved:true,givenConditionsPreserved:true,noAddedHintOrInference:true,priorBlankOrder:blankOrder,blankOrder,blankSpans:blankOrder.map(label=>({label,start:bank[0].content.indexOf(label),end:bank[0].content.indexOf(label)+label.length}))};
  }
  const closure={schemaVersion:continuity.ROOT_SCHEMA,scope:continuity.ROOT_SCOPE,reviewer:rootReviewer,transportAuthor:author,reviewedAtUtc:'2026-11-16T00:01:00Z',rawObservationRef:null,rows:[],...zero()};
  function fillRaw() {
    rawObservation.rows=observation.rows.map(r=>({sourceOrdinal:r.sourceOrdinal,questionUid:r.questionUid,actualObserver:reviewer,priorSourceRef,currentSourceRef:observation.sourceRef,beforeQuestionSha256:r.priorWholeQuestionSha256,currentQuestionSha256:r.currentWholeQuestionSha256,beforeStudentSha256:r.priorStudentPayloadSha256,currentStudentSha256:r.currentStudentPayloadSha256,compactItemSha256:r.compactItemSha256,unchangedFourSlot:items[r.ordinal-1],changedFields:r.changedFields,actualRead:{fullStem:true,choices:true,answer:true,writtenSolution:true,nativeFourSlot:true,priorAndCurrentReferencedRenderers:true},card:{cardSha256:r.captureSha256s[0],questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,beforeQuestionSha256:r.priorWholeQuestionSha256,currentQuestionSha256:r.currentWholeQuestionSha256,beforeStudentSha256:r.priorStudentPayloadSha256,currentStudentSha256:r.currentStudentPayloadSha256,compactItemSha256:r.compactItemSha256,assets:[...r.priorAssets.map(a=>({...a,phase:'prior',rawBytesVerified:true})),...r.currentAssets.map(a=>({...a,phase:'current',rawBytesVerified:true}))]},decision:r.ordinal===5?'RETAIN_EXISTING_VECTOR':'PENDING_FIXTURE_CLOSURE'}));
    closure.rows=observation.rows.filter(r=>r.ordinal!==5).map(r=>{const {continuityKind,changedFields,...v}=r;return {...v,sourceArchiveFile:source,decision:continuityKind,priorSourceRef,sourceRef:observation.sourceRef,priorCompactRef,bodyTranscription:r.ordinal===1?body():null,classification:r.ordinal===3?(displayClarificationSvg?'WHOLE_SEGMENT_VS_SUBSEGMENT_MARKING_AMBIGUOUS':displayPng?'GIVEN_RIGHT_ANGLE_MARKERS_MISSING':'CURRENT_RENDERER_RELATION_MISMATCH'):null};});
    rawRoot.rows=closure.rows.map(r=>({questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,sourceQuestionNo:r.sourceQuestionNo,ordinal:r.ordinal,sourceArchiveFile:source,decision:r.decision,priorSourceRef,currentSourceRef:observation.sourceRef,priorAssets:r.priorAssets,currentAssets:r.currentAssets,reason:r.classification||r.decision,beforeQuestionSha256:r.priorWholeQuestionSha256,currentQuestionSha256:r.currentWholeQuestionSha256,beforeStudentSha256:r.priorStudentPayloadSha256,currentStudentSha256:r.currentStudentPayloadSha256,compactItemSha256:r.compactItemSha256,preservedFourSlot:items[r.ordinal-1],actualReads:{priorProblemAsset:r.priorAssets.length>0,currentProblemAsset:true,priorAndCurrentStem:true,allChoices:true,answerAndWrittenSolution:true,nativeFourSlotsAndReasons:true},captureRef:{sha256:r.captureSha256s[0]},...(r.bodyTranscription?{bodyTranscription:{transcriptionKind:r.bodyTranscription.kind,contentBeforeSha:r.bodyTranscription.contentBeforeSha256,contentAfterSha:r.bodyTranscription.contentAfterSha256,literalStatementsPreserved:true,blankOrderPreserved:true,givenConditionsPreserved:true,noAddedHintOrInference:true,blankOrder:r.bodyTranscription.blankOrder,blankSpans:r.bodyTranscription.blankSpans,nonTranscriptionQuestionFieldsExact:true}}:{})}));
  }
  fillRaw();save(rawPath,rawObservation);save(rawRootPath,rawRoot);const rawCommit=commit('immutable synthetic observation originals');
  observation.rawObservationRef=ref(rawCommit,rawPath);closure.rawObservationRef=ref(rawCommit,rawRootPath);
  save(obsPath,observation);save(rootPath,closure);const obsCommit=commit('immutable typed current observations');
  const proof={schemaVersion:continuity.CARRIER_SCHEMA,scope:continuity.SCOPE,transportAuthor:author,examId:'E999',sourceArchiveFile:source,expectedQuestionCount:5,priorCompactRef,nativeSourceRef:ref(nativeCommit,sp,true),priorSourceRef,sourceRef:observation.sourceRef,dictionaryRef:ref(currentCommit,dictPath,true),nativeFourSlotRef:ref(nativeCommit,nativePath),nativeReviewRef:ref(nativeCommit,reviewPath),rootAcceptanceRef:ref(nativeCommit,acceptPath),independentSampleRef:ref(nativeCommit,samplePath),observationRef:ref(obsCommit,obsPath),rootClosureRef:ref(obsCommit,rootPath),retainedOrdinals:[2,5],bodyTranscriptionOrdinals:[1],heldOrdinals:[3],unchangedOrdinals:[4],...zero(),nextAction:'Keep the discrepant UID pending until separately authorized correction and release.'};
  const data=structuredClone(prior);
  function signCarrier() {
    save(carrierPath,proof);const c=commit('bind current transport');data.sourceGitBlobSha=proof.sourceRef.gitBlobSha1;
    const group={carrier:ref(c,carrierPath),observation:proof.observationRef,rootClosure:proof.rootClosureRef};data.evidence[continuity.GROUP]=group;
    data.items[2].registrationHold={schemaVersion:continuity.HOLD_SCHEMA,reason:continuity.REASON,questionUid:uid(3),sourceOrdinal:3,sourceQuestionNo:'3',ordinal:3,sourceGitBlobSha:proof.sourceRef.gitBlobSha1,wholeQuestionSha256:mod.sha(stable(bank[2])),studentPayloadSha256:mod.payloadHash(bank[2]),sourceFingerprint:mod.identityHash(bank[2]),m2ContinuityCarrier:group.carrier,m2ContinuityObservation:group.observation,m2RootClosure:group.rootClosure,nextAction:proof.nextAction};save(cp,data);
  }
  function signObservation() {save(obsPath,observation);const c=commit('changed typed observation fixture');proof.observationRef=ref(c,obsPath);signCarrier();}
  function signClosure({raw=false}={}) {if(raw){save(rawRootPath,rawRoot);const c=commit('changed raw closure fixture');closure.rawObservationRef=ref(c,rawRootPath);}save(rootPath,closure);const c=commit('changed typed closure fixture');proof.rootClosureRef=ref(c,rootPath);signCarrier();}
  function rebindCurrent() {
    save(sp,js(bank));currentCommit=commit('truthfully bound counterexample source');observation.sourceRef=ref(currentCommit,sp,true);observation.rows=observedRows();fillRaw();
    save(rawPath,rawObservation);save(rawRootPath,rawRoot);const c=commit('truthfully bound counterexample observation originals');observation.rawObservationRef=ref(c,rawPath);closure.rawObservationRef=ref(c,rawRootPath);
    save(obsPath,observation);save(rootPath,closure);const r=commit('truthfully bound counterexample typed observations');proof.sourceRef=observation.sourceRef;proof.observationRef=ref(r,obsPath);proof.rootClosureRef=ref(r,rootPath);signCarrier();
  }
  signCarrier();
  return {root,save,bytes,git,commit,ref,before,bank,js,prior,data,identity,proof,observation,closure,rawObservation,rawRoot,carrierPath,obsPath,rootPath,rawPath,rawRootPath,nativePath,reviewPath,acceptPath,samplePath,nativeCommit,priorCommit,currentCommit,oldAssets,currentAssets,signCarrier,signObservation,signClosure,rebindCurrent,write:()=>save(cp,data)};
}

module.exports={fixture,uid,stable,source,sp,cp,dictPath,dir,zero};

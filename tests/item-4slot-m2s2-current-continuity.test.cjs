'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{execFileSync}=require('node:child_process');
const mod=require('../tools/4slot/build-4slot-runtime.cjs');
const continuity=require('../tools/4slot/m2s2-current-continuity.cjs');
const consumer=require('../archive/item-4slot.js');
const uid=n=>'qid_v1_'+String(n).padStart(64,'0');
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const source='original/middle/m2/2mid/current-continuity-fixture.js',sp='archive/exams/'+source,cp='archive/data/item-4slot/'+source.replace(/\.js$/,'.4slot.json');
const dictPath='docs/architecture/4slot/term-dictionary-v1.5.json',dir='docs/operations/m2-current-fixture/';
const zero=()=>Object.fromEntries(continuity.ZERO.map(k=>[k,0]));
const inspection=()=>({stemRead:true,solutionRead:true,allFourSlotsRead:true,actualRendererRead:true});
function fixture(t,{multiAssets=false,noPriorHeldAsset=false}={}) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'m2-current-continuity-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const save=(p,v)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'||Buffer.isBuffer(v)?v:JSON.stringify(v));};
  const bytes=p=>fs.readFileSync(path.join(root,p));
  const git=(...args)=>execFileSync('git',['-C',root,...args],{encoding:'utf8',stdio:['ignore','pipe','pipe']});
  const commit=msg=>{git('add','.');git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','--allow-empty','-qm',msg);return git('rev-parse','HEAD').trim();};
  const ref=(c,p,full=false)=>{const raw=execFileSync('git',['-C',root,'show',c+':'+p],{stdio:['ignore','pipe','pipe']});return {commit:c,path:p,...(full?{gitBlobSha1:mod.blob(raw)}:{}),sha256:mod.sha(raw)};};
  const js=bank=>'window.questionBank='+JSON.stringify(bank)+';';
  const asset=n=>'archive/assets/images/m2-current-fixture/'+n;
  const oldAssets=[asset('proof-old.png'),asset('annotation-old.svg'),asset('held-old.svg'),asset('unchanged.png')];
  const currentAssets=[asset('proof-current.svg'),asset('annotation-current.svg'),asset('held-current.svg'),oldAssets[3],asset('inline-current.svg')];
  const before=Array.from({length:5},(_,i)=>({id:i+1,content:'Fixture question '+(i+1),choices:['A','B'],answer:'A',solution:'Unchanged fixture solution '+(i+1),...(i<4?{image:oldAssets[i].slice(8)}:{}),layoutTag:'grid'}));
  before[0].content='Complete the proof shown in the original image.';
  if(noPriorHeldAsset)delete before[2].image;
  if(multiAssets){before[4].image=oldAssets[3].slice(8);before[1].content+='<br><img src="'+oldAssets[3].slice(8)+'" alt="Existing fixture diagram">';}
  const dict={dictionaryVersion:'term-dict-v1.5-2026-11-04',terms:[{id:1,ko:'fixture given'},{id:2,ko:'fixture goal'},{id:3,ko:'fixture method'}]};
  const items=before.map(q=>({ordinal:q.id,format:'빈칸 채우기',given:[1],goal:[2],method:[3],condition:[],candidates:[]}));
  const np='archive/data/meta-review/m2-s2-20261114/exams/E999/';
  const nativePath=np+'four-slot.json',reviewPath=np+'review.json',acceptPath=np+'root-acceptance.json',samplePath=np+'independent-sample.json';
  const native={schemaVersion:'archive-meta-4slot-v0',sourceArchiveFile:source,sourceGitBlobSha:mod.blob(js(before)),dictionaryVersion:dict.dictionaryVersion,judgedBy:{agent:'original-author'},items:before.map((q,i)=>({sourceOrdinal:i+1,questionUid:uid(i+1),format:items[i].format,slots:{given:[{term:'fixture given'}],goal:[{term:'fixture goal'}],method:[{term:'fixture method'}],condition:[]}})),candidates:[],selfCheck:{}};
  const nativeReview={schemaVersion:'m2-s2-meta-review-v1',examId:'E999',owner:'original-author',sourceArchiveFile:source,sourceGitBlobSha:native.sourceGitBlobSha,items:before.map((_,i)=>({sourceOrdinal:i+1,questionUid:uid(i+1)}))};
  const sample={schemaVersion:'m2-s2-independent-sample-v1',examId:'E999',author:'original-author',reviewer:'original-independent',sourceGitBlobSha:native.sourceGitBlobSha};
  const identity={records:before.map((q,i)=>({questionUid:uid(i+1),sourceArchiveFile:source,sourceOrdinal:i+1,sourceQuestionNo:String(q.id),sourceFingerprint:mod.identityHash(q),status:'VERIFIED'}))};
  const svg='<svg xmlns="http://www.w3.org/2000/svg"><circle cx="4" cy="4" r="2"/></svg>';
  save(sp,js(before));save(dictPath,dict);save('archive/data/question_identity_map.json',identity);save(nativePath,native);save(reviewPath,nativeReview);save(samplePath,sample);
  for(const a of oldAssets)save(a,a.endsWith('.png')?Buffer.from([137,80,78,71,13,10,26,10,255,0,129]):svg);
  save(acceptPath,{schemaVersion:'m2-s2-root-acceptance-v1',examId:'E999',owner:'original-author',reviewer:'ROOT',sampleReviewer:'original-independent',semanticReviewStatus:'PRO_REVIEW_COMPLETE',sourceUnchanged:true,sourceGitBlobSha:native.sourceGitBlobSha,sourceSha256:mod.sha(bytes(sp)),fourSlotSha256:mod.sha(bytes(nativePath)),reviewSha256:mod.sha(bytes(reviewPath)),independentSampleSha256:mod.sha(bytes(samplePath))});
  git('init','-q');const nativeCommit=commit('synthetic original source and accepted full vector');
  const prior={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:source,sourceGitBlobSha:native.sourceGitBlobSha,dictionaryVersion:dict.dictionaryVersion,evidence:{branch:'review/fixture',...ref(nativeCommit,nativePath),rootAcceptance:ref(nativeCommit,acceptPath),independentReview:ref(nativeCommit,samplePath),sourceReuse:{kind:'UNCHANGED_STUDENT_PAYLOAD',reviewedSourceGitBlobSha:native.sourceGitBlobSha,currentSourceGitBlobSha:native.sourceGitBlobSha}},reviewedBy:{agent:'original-reviewer',at:'2026-11-15',sampled:[1]},items};
  save(cp,prior);const priorCommit=commit('existing full compact'),priorCompactRef=ref(priorCommit,cp,true),priorSourceRef=ref(priorCommit,sp,true);
  const bank=structuredClone(before);
  bank[0].content='Proof: step ㉠ followed by step ㉡.';bank[0].image=currentAssets[0].slice(8);bank[0].layoutTag='fullwidth';
  bank[1].image=currentAssets[1].slice(8);bank[2].image=currentAssets[2].slice(8);
  bank[4].content+='<br><img src="'+currentAssets[4].slice(8)+'" alt="Fixture diagram">';bank[4].layoutTag='fullwidth';
  save(sp,js(bank));for(const a of currentAssets.filter(a=>a.endsWith('.svg')))save(a,svg);
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
    closure.rows=observation.rows.filter(r=>r.ordinal!==5).map(r=>{const {continuityKind,changedFields,...v}=r;return {...v,sourceArchiveFile:source,decision:continuityKind,priorSourceRef,sourceRef:observation.sourceRef,priorCompactRef,bodyTranscription:r.ordinal===1?body():null,classification:r.ordinal===3?'CURRENT_RENDERER_RELATION_MISMATCH':null};});
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
  return {root,save,bytes,git,commit,ref,before,bank,js,prior,data,identity,proof,observation,closure,rawObservation,rawRoot,carrierPath,obsPath,rootPath,rawPath,rawRootPath,nativePath,acceptPath,priorCommit,currentCommit,oldAssets,currentAssets,signCarrier,signObservation,signClosure,rebindCurrent,write:()=>save(cp,data)};
}
function denied(f,pattern=/M2_CURRENT_CONTINUITY_/) {
  const x=mod.build(f.root).index;assert.equal(x.counts.registered,0,JSON.stringify(x.pending));
  assert.ok(x.pending.some(p=>pattern.test(p.reason)),JSON.stringify(x.pending));return x;
}
test('full native vector survives body/annotation/inline transport while exactly one held UID is absent from Consumer',t=>{
  const f=fixture(t),sourceBytes=f.bytes(sp),out=mod.build(f.root).index;
  assert.deepEqual(out.records.map(r=>r.questionUid),[uid(1),uid(2),uid(4),uid(5)]);
  assert.equal(out.counts.items,5);assert.equal(out.pending.length,1);assert.equal(out.pending[0].questionUid,uid(3));
  assert.equal(out.pending[0].reason,'EXPLICIT_REVIEW_HOLD:'+continuity.REASON);assert.equal(consumer.createIndex(out).get(uid(3)),null);
  assert.deepEqual(f.data.items.map(({registrationHold,...r})=>r),f.prior.items);assert.deepEqual(f.data.reviewedBy,f.prior.reviewedBy);assert.deepEqual(f.bytes(sp),sourceBytes);
  assert.equal(mod.run(f.root,{write:true}).counts.registered,4);assert.equal(mod.run(f.root,{check:true}).changed,false);
});
for(const fault of ['denominator','partition','unknown-field','approval','native-ref','source-ref','root-ref','dictionary-ref'])test('carrier rejects '+fault,t=>{
  const f=fixture(t);
  if(fault==='denominator')f.proof.expectedQuestionCount=4;
  if(fault==='partition')f.proof.unchangedOrdinals=[3,4];
  if(fault==='unknown-field')f.proof.allowSourceChanges=true;
  if(fault==='approval')f.proof.newMathQa=1;
  if(fault==='native-ref')f.proof.nativeFourSlotRef.sha256='0'.repeat(64);
  if(fault==='source-ref')f.proof.nativeSourceRef.commit=f.currentCommit;
  if(fault==='root-ref')f.proof.rootAcceptanceRef.path=f.nativePath;
  if(fault==='dictionary-ref')f.proof.dictionaryRef.sha256='0'.repeat(64);
  f.signCarrier();denied(f);
});
for(const fault of ['answer','solution','metadata','choices','table-transcription'])test('truthfully rebound body source still rejects '+fault,t=>{
  const f=fixture(t);
  if(fault==='answer')f.bank[0].answer='B';
  if(fault==='solution')f.bank[0].solution='New reasoning';
  if(fault==='metadata')f.bank[0].problemType='new-authority';
  if(fault==='choices')f.bank[0].choices.reverse();
  if(fault==='table-transcription')f.bank[0].content='<table><tr><td>㉠</td><td>㉡</td></tr></table>';
  f.rebindCurrent();denied(f,/BODY_FIELDS/);
});
for(const fault of ['not-read','no-raw-authority','false-root-read','raw-renderer-drift','raw-source-drift','wrong-blank-order','wrong-blank-span','false-no-hint','body-class','omit-negative'])test('actual independent closure rejects '+fault,t=>{
  const f=fixture(t),r=f.closure.rows[0];
  if(fault==='not-read')r.inspection.actualRendererRead=false;
  if(fault==='no-raw-authority')f.closure.rawObservationRef.sha256='0'.repeat(64);
  if(fault==='false-root-read')f.rawRoot.rows[0].actualReads.nativeFourSlotsAndReasons=false;
  if(fault==='raw-renderer-drift')f.rawRoot.rows[0].currentAssets=[{...f.rawRoot.rows[0].currentAssets[0],sha256:'0'.repeat(64)}];
  if(fault==='raw-source-drift')f.rawRoot.rows[0].currentSourceRef={...f.rawRoot.rows[0].currentSourceRef,commit:f.priorCommit};
  if(fault==='wrong-blank-order'){r.bodyTranscription.blankOrder.reverse();r.bodyTranscription.priorBlankOrder=[...r.bodyTranscription.blankOrder];f.rawRoot.rows[0].bodyTranscription.blankOrder=[...r.bodyTranscription.blankOrder];}
  if(fault==='wrong-blank-span'){r.bodyTranscription.blankSpans[0].start++;f.rawRoot.rows[0].bodyTranscription.blankSpans=r.bodyTranscription.blankSpans;}
  if(fault==='false-no-hint')r.bodyTranscription.noAddedHintOrInference=false;
  if(fault==='body-class')r.bodyTranscription.kind='TABLE_TRANSCRIPTION';
  if(fault==='omit-negative')f.closure.rows=f.closure.rows.filter(x=>x.ordinal!==3);
  f.signClosure({raw:['false-root-read','raw-renderer-drift','raw-source-drift','wrong-blank-order','wrong-blank-span'].includes(fault)});denied(f);
});
for(const fault of ['raw-vector','raw-capture','not-observed','asset-omitted','body-as-renderer'])test('typed observation cannot replace raw observation: '+fault,t=>{
  const f=fixture(t),r=f.observation.rows[0];
  if(fault==='raw-vector')r.compactItemSha256='0'.repeat(64);
  if(fault==='raw-capture')r.captureSha256s=['0'.repeat(64)];
  if(fault==='not-observed')r.inspection.stemRead=false;
  if(fault==='asset-omitted')r.currentAssets=[];
  if(fault==='body-as-renderer'){r.continuityKind='RENDERER_PRESENTATION_CONTINUITY';f.proof.bodyTranscriptionOrdinals=[];f.proof.retainedOrdinals=[1,2,5];}
  f.signObservation();denied(f);
});
for(const fault of ['source','asset','binary-peer','identity','slot','reviewer','carrier','observation','closure'])test('cached result never waives live '+fault,t=>{
  const f=fixture(t);mod.run(f.root,{write:true});
  if(fault==='source'){f.bank[4].answer='B';f.save(sp,f.js(f.bank));}
  if(fault==='asset')f.save(f.currentAssets[1],'<svg>changed</svg>');
  if(fault==='binary-peer')f.save(f.currentAssets[3],Buffer.from([255,0,128]));
  if(fault==='identity'){f.identity.records[0].questionUid=uid(2);f.save('archive/data/question_identity_map.json',f.identity);}
  if(fault==='slot')f.data.items[3].method=[2];
  if(fault==='reviewer')f.data.reviewedBy.agent='different';
  if(['carrier','observation','closure'].includes(fault))fs.unlinkSync(path.join(f.root,{carrier:f.carrierPath,observation:f.obsPath,closure:f.rootPath}[fault]));
  f.write();denied(f);
});
for(const dynamic of ['<animate attributeName="x"/>','<set attributeName="visibility"/>','<discard/>','<style>@import "https://example.invalid/style.css";</style>','<?xml-stylesheet href="remote.css"?>','<image href="https://example.invalid/image.png"/>'])test('truthfully rebound observed SVG rejects unobserved dynamic dependency '+dynamic,t=>{
  const f=fixture(t);f.save(f.currentAssets[1],'<svg xmlns="http://www.w3.org/2000/svg">'+dynamic+'</svg>');f.rebindCurrent();denied(f,/(DYNAMIC_SVG|UNBOUND_SVG_DEPENDENCY)/);
});
for(const suffix of [' style="background:url(https://example.invalid/x.png)"',' src="https://example.invalid/second.png"'])test('inline image rejects unbound style or duplicate source '+suffix,t=>{
  const f=fixture(t);f.bank[4].content=f.bank[4].content.replace(/>$/,suffix+'>');f.rebindCurrent();denied(f,/PRESENTATION_BODY/);
});
test('row API cannot accept an M2 hold without successful whole-file authority',t=>{
  const f=fixture(t);assert.deepEqual(mod.validateRegistrationHold(f.root,f.data,f.data.items[2],f.identity.records[2],{q:f.bank[2],ordinal:3}),['M2_CURRENT_CONTINUITY_FILE_NOT_VALIDATED']);
});
for(const fault of ['working-deletion','committed-deletion','unavailable-git'])test('ancestry obligations survive '+fault,t=>{
  const f=fixture(t);delete f.data.evidence[continuity.GROUP];delete f.data.items[2].registrationHold;f.write();
  for(const p of [f.carrierPath,f.obsPath,f.rootPath,f.rawPath,f.rawRootPath])fs.unlinkSync(path.join(f.root,p));
  if(fault==='committed-deletion')f.commit('remove every transport marker and proof');
  if(fault==='unavailable-git')fs.renameSync(path.join(f.root,'.git'),path.join(f.root,'.git-hidden'));
  denied(f,/(OBLIGATION_REQUIRED|HISTORY_UNAVAILABLE)/);
});
test('full-history finds issued evidence in the non-TREESAME merge parent',t=>{
  const f=fixture(t);f.commit('issued full compact');const issued=f.git('rev-parse','HEAD').trim();
  f.git('checkout','-q','-b','without-proof',f.currentCommit);
  const stripped=structuredClone(f.prior);stripped.sourceGitBlobSha=mod.blob(f.js(f.bank));f.save(cp,stripped);f.commit('ordinary-looking current blob on other branch');
  f.git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','merge','--no-ff','-s','ours','-m','merge issued branch while dropping every proof',issued);
  denied(f,/OBLIGATION_REQUIRED/);
});

test('unobserved asset requires prior, immutable current and live bytes to agree',t=>{
  const f=fixture(t),old=f.bytes(f.currentAssets[3]);
  f.save(f.currentAssets[3],Buffer.from([255,128,0,1]));f.rebindCurrent();
  f.save(f.currentAssets[3],old);denied(f,/UNOBSERVED_ASSET/);
});
for(const fault of ['current-hash','prior-commit','missing','duplicate'])test('ordinary raw card renderer references refuse '+fault,t=>{
  const f=fixture(t),raw=f.rawObservation.rows.find(r=>r.sourceOrdinal===5);
  if(fault==='current-hash')raw.card.assets[0].sha256='0'.repeat(64);
  if(fault==='prior-commit')raw.card.assets[0].commit=f.priorCommit;
  if(fault==='missing')raw.card.assets=[];
  if(fault==='duplicate')raw.card.assets.push({...raw.card.assets[0]});
  f.save(f.rawPath,f.rawObservation);const c=f.commit('truthfully rebound raw card counterexample');
  f.observation.rawObservationRef=f.ref(c,f.rawPath);f.signObservation();denied(f,/RAW_OBSERVATION_RENDERERS/);
});

for(const tag of ['s:script','s:animate','한:script'])test('static SVG rejects namespace-prefixed dynamic '+tag,t=>{
  const f=fixture(t);f.save(f.currentAssets[1],'<svg xmlns="http://www.w3.org/2000/svg" xmlns:s="http://www.w3.org/2000/svg"><'+tag+' attributeName="x"/></svg>');
  f.rebindCurrent();denied(f,/DYNAMIC_SVG/);
});
test('static SVG check also applies to uppercase extension',t=>{
  const f=fixture(t),asset=f.currentAssets[1].replace(/\.svg$/,'.SVG');
  f.currentAssets[1]=asset;f.bank[1].image=asset.slice(8);
  f.save(asset,'<svg xmlns="http://www.w3.org/2000/svg"><animate attributeName="x"/></svg>');
  f.rebindCurrent();denied(f,/DYNAMIC_SVG/);
});

for(const css of [
  '<style>@keyframes move {to{opacity:0}}</style>',
  '<rect style="animation:move 1s infinite"/>',
  '<rect style="transition:opacity 1s"/>',
  String.raw`<rect style="anim\61tion:move 1s infinite"/>`,
  '<rect style="&#x61;nimation:move 1s infinite"/>'
])test('static SVG refuses animated or undecoded CSS '+css,t=>{
  const f=fixture(t);f.save(f.currentAssets[1],'<svg xmlns="http://www.w3.org/2000/svg">'+css+'</svg>');
  f.rebindCurrent();denied(f,/(DYNAMIC_SVG|UNINSPECTED_CSS_ESCAPE)/);
});

for(const group of ['ordinary','root'])test('raw renderer multiset rejects equal-length duplicate and omission '+group,t=>{
  const f=fixture(t,{multiAssets:true});assert.equal(mod.build(f.root).index.counts.registered,4);
  if(group==='ordinary'){
    const raw=f.rawObservation.rows.find(r=>r.sourceOrdinal===5),indices=raw.card.assets.map((a,i)=>a.phase==='current'?i:-1).filter(i=>i>=0);
    assert.equal(indices.length,2);raw.card.assets[indices[1]]={...raw.card.assets[indices[0]]};
    f.save(f.rawPath,f.rawObservation);const c=f.commit('truthfully rebound duplicate raw observer asset');
    f.observation.rawObservationRef=f.ref(c,f.rawPath);f.signObservation();denied(f,/RAW_OBSERVATION_RENDERERS/);
  } else {
    const raw=f.rawRoot.rows.find(r=>r.sourceOrdinal===2);assert.equal(raw.currentAssets.length,2);
    raw.currentAssets=[raw.currentAssets[0],{...raw.currentAssets[0]}];f.signClosure({raw:true});denied(f,/RAW_ROOT_RENDERERS/);
  }
});

test('actual proof body may empty scalar image only while its local figure moves into inspected HTML',t=>{
  const f=fixture(t);f.bank[0].content+='<br><img src="'+f.currentAssets[0].slice(8)+'" alt="Existing proof figure" style="max-width:100%;display:block">';f.bank[0].image='';f.rebindCurrent();
  const out=mod.build(f.root).index;assert.equal(out.counts.registered,4,JSON.stringify(out.pending));assert.equal(out.pending.length,1);assert.equal(out.pending[0].questionUid,uid(3));assert.equal(consumer.createIndex(out).get(uid(3)),null);
});
test('empty scalar body image cannot discard every inspected local figure',t=>{
  const f=fixture(t);f.bank[0].image='';f.rebindCurrent();denied(f,/(BODY_INLINE_FIGURE_REQUIRED|PRESENTATION_IMAGE)/);
});
test('ordinary renderer still rejects an empty scalar image',t=>{
  const f=fixture(t);f.bank[1].image='';f.rebindCurrent();denied(f,/PRESENTATION_IMAGE/);
});
test('actual negative may truthfully record no prior problem asset for an exact empty prior set',t=>{
  const f=fixture(t,{noPriorHeldAsset:true}),out=mod.build(f.root).index;assert.equal(out.counts.registered,4,JSON.stringify(out.pending));assert.equal(out.pending.length,1);assert.equal(out.pending[0].questionUid,uid(3));assert.equal(consumer.createIndex(out).get(uid(3)),null);
});
test('negative cannot claim missing prior asset when a real prior asset exists',t=>{
  const f=fixture(t);f.rawRoot.rows.find(r=>r.ordinal===3).actualReads.priorProblemAsset=false;f.signClosure({raw:true});denied(f,/RAW_ROOT_ROW/);
});
test('negative with no prior asset cannot pretend a prior problem asset was viewed',t=>{
  const f=fixture(t,{noPriorHeldAsset:true});f.rawRoot.rows.find(r=>r.ordinal===3).actualReads.priorProblemAsset=true;f.signClosure({raw:true});denied(f,/RAW_ROOT_ROW/);
});

for(const form of ['plain-path','comment','quoted-attribute','raw-text-element','different-tag'])test('body empty image requires an actual img src, not '+form,t=>{
  const f=fixture(t),p=f.currentAssets[0].slice(8);f.bank[0].image='';
  const fake={'plain-path':' '+p,'comment':'<!-- <img src="'+p+'"> -->','quoted-attribute':"<div data-example='<img src=\""+p+"\">'></div>",'raw-text-element':'<textarea><img src="'+p+'"></textarea>','different-tag':'<imgx src="'+p+'">'}[form];
  f.bank[0].content+=fake;f.rebindCurrent();denied(f,/BODY_INLINE_FIGURE_REQUIRED/);
});

for(const style of [String.raw`background-image:u\72l(https://example.invalid/x.png)`,'background-image:&#x75;rl(https://example.invalid/x.png)'])test('body inline figure rejects escaped nonlocal CSS '+style,t=>{
  const f=fixture(t);f.bank[0].image='';f.bank[0].content+='<br><img src="'+f.currentAssets[0].slice(8)+'" style="'+style+'">';
  f.rebindCurrent();denied(f,/BODY_INLINE_FIGURE_REQUIRED/);
});
for(const style of [String.raw`background-image:u\72l(https://example.invalid/x.png)`,'background-image:&#x75;rl(https://example.invalid/x.png)'])test('ordinary inline figure rejects escaped nonlocal CSS '+style,t=>{
  const f=fixture(t);f.bank[4].content=f.bank[4].content.replace(/>$/,' style="'+style+'">');
  f.rebindCurrent();denied(f,/PRESENTATION_BODY/);
});

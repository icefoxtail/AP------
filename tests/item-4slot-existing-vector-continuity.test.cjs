'use strict';
// Synthetic contract fixtures only. No public display review or actual UI PASS
// is manufactured here; publication still needs the separately authored inputs.
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{execFileSync}=require('node:child_process');
const builder=require('../tools/4slot/build-4slot-runtime.cjs');
const route=require('../tools/4slot/existing-registered-vector-continuity.cjs');
const ui=require('../tools/4slot/existing-registered-vector-ui.cjs');
const {sha,stable,fields,vector}=route;
const uid=n=>'qid_v1_'+String(n).padStart(64,'0');
const SF='archive/exams/original/middle/m2/1mid/synthetic.js';
const SOURCE=SF.slice('archive/exams/'.length);
const CP='archive/data/item-4slot/'+SOURCE.replace(/\.js$/,'.4slot.json');
const DP='docs/architecture/4slot/term-dictionary-v1.5.json';
const MD='archive/data/question_metadata.json',ID='archive/data/question_identity_map.json';
const NP='docs/operations/m2-s1-meta-full-20261114/exams/E001/four-slot.json';
const RP='docs/operations/m2-s1-meta-full-20261114/exams/E001/root-review.json';
const IP='docs/operations/m2-s1-meta-full-20261114/exams/E001/independent.json';
const SP='docs/operations/m2-s1-meta-full-20261114/exams/E001/review.json';
const OLD='archive/assets/images/synthetic/old.svg',NEW='archive/assets/images/synthetic/new.svg';
const OLD_SOL='archive/assets/images/synthetic/old-sol.svg',NEW_SOL='archive/assets/images/synthetic/new-sol.svg';
const CHILD='archive/assets/images/synthetic/child.png';
const PREFIX='.archive-meta-register/evidence/existing-vector-synthetic';
const CLONE=x=>structuredClone(x);
function write(root,p,x){const full=path.join(root,p);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x)+'\n');}
function g(root,...args){return execFileSync('git',['-C',root,...args],{encoding:'utf8',stdio:['ignore','pipe','pipe'],maxBuffer:16*1024*1024}).trim();}
function commit(root){g(root,'add','-A');g(root,'commit','-qm','SYNTHETIC CONTRACT FIXTURE');return g(root,'rev-parse','HEAD');}
function ref(root,at,p){const b=execFileSync('git',['-C',root,'show',at+':'+p],{maxBuffer:32*1024*1024});return {commit:at,path:p,gitBlobSha1:builder.blob(b),sha256:sha(b),bytes:b.length};}
function bankText(b){return 'window.questionBank = '+JSON.stringify(b)+';\n';}
function capture(viewport,tiles=1,surface='PROBLEM'){
  const h=tiles===1?100:168,shots=Array.from({length:tiles},(_,i)=>({tileIndex:i+1,path:`synthetic-${viewport.name}-${i+1}.png`,sha256:sha(`SYNTHETIC PNG ${viewport.name} ${i+1}`),bytes:100+i}));
  const c={schemaVersion:surface==='PROBLEM'?'archive-problem-scroll-coverage-v1':'archive-solution-scroll-coverage-v1',
    method:'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES',tileLimit:8,tileCount:tiles,overlapCssPixels:32,
    content:{x:0,y:0,width:100,height:h},question:{x:0,y:0,width:100,height:h+20},
    viewport:{width:viewport.width,height:viewport.height},visibleChildren:4,
    coverage:{requiredInterval:[0,h],coveredInterval:[0,h],complete:true},domSha256:sha('SYNTHETIC DOM'),
    scrollBefore:{x:0,y:0},scrollAfter:{x:0,y:(tiles-1)*68},scrollOperations:tiles-1,
    feedbackIdle:true,foreignContentHits:0,cssWrites:0,domWrites:0,viewportChanges:0,compositeImageCreated:false,
    tiles:shots.map((s,i)=>({tileIndex:i+1,relativeInterval:[i*68,i*68+100],filename:s.path,clip:{x:0,y:0,width:100,height:100},scroll:{x:0,y:i*68},
      scrollOperations:i===0?0:1,feedbackIdle:true,obstructionsIntersectingClip:0,foreignContentHits:0,hitTestSamples:20,domSha256:sha('SYNTHETIC DOM')}))};
  return {shots,c};
}
function makeUi(doc,surface,assets,{tiles=1}={}){
  const results=ui.CASES[surface].map(c=>{const {shots,c:cap}=capture(c.viewport,tiles,surface);return {questionUid:doc.questionUid,sourceOrdinal:doc.sourceOrdinal,surface,
    mode:c.mode,viewport:c.viewport,sourceRef:doc.currentSourceRef,assetRefs:assets,status:'PASS',
    fonts:{ready:true,expectedFamilyLoaded:true,responseInventorySha256:sha('SYNTHETIC FONT RESPONSES')},capture:cap,
    screenshots:shots.map(s=>({...s,path:surface.toLowerCase()+'-'+s.path}))};});
  for(const r of results)r.capture.tiles.forEach((t,i)=>{t.filename=r.screenshots[i].path;});
  return {schemaVersion:ui.TECHNICAL_SCHEMA,status:'TECHNICAL_PASS_VISUAL_REVIEW_PENDING',executionOwner:'GITHUB_ACTIONS_SUPPORTED_CHROME',checkoutCommit:doc.currentSourceRef.commit,
    sourceOverlayCount:0,domWrites:0,cssWrites:0,expectedLogicalCases:results.length,completedLogicalCases:results.length,
    screenshotArtifactCount:results.reduce((n,r)=>n+r.screenshots.length,0),screenshotArtifacts:results.flatMap(r=>r.screenshots.map(({tileIndex,...s})=>s)),results};
}
function makeVisual(technical,technicalRef){return {schemaVersion:ui.VISUAL_SCHEMA,reviewer:'SYNTHETIC_INDEPENDENT_DISPLAY_REVIEWER',decision:ui.DECISION,technicalRef,
  newMathQa:0,newSemanticApproval:0,newFourSlotVector:0,records:technical.results.map(r=>({questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,surface:r.surface,viewport:r.viewport,
    captureSha256:sha(stable(r.capture)),decision:ui.DECISION,screenshots:r.screenshots.map(s=>({...s,decision:ui.DECISION}))}))};}
function fixture(t,opt={}) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'existing-vector-synthetic-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  g(root,'init','-q');g(root,'config','user.name','Synthetic contract fixture');g(root,'config','user.email','synthetic@example.invalid');
  const dict={dictionaryVersion:'term-dict-v1.5-2026-11-04',terms:[{id:1,ko:'synthetic given',kind:'대상',status:'ACTIVE'},{id:2,ko:'synthetic goal',kind:'대상',status:'ACTIVE'},{id:3,ko:'synthetic method',kind:'방법',status:'ACTIVE'}]};
  const before=Array.from({length:3},(_,i)=>({id:i+1,questionUid:i===0&&opt.orphan?uid(9):uid(i+1),content:'Synthetic problem '+(i+1),choices:['Synthetic A','Synthetic B'],answer:'SYNTHETIC',solution:'Synthetic explanation '+(i+1),
    ...(i===0?{image:OLD.slice(8),solutionImage:OLD_SOL.slice(8)}:{})}));
  write(root,OLD,'<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/>'+(opt.nested?'<image href="child.png"/>':'')+'</svg>');
  if(opt.nested)write(root,CHILD,'SYNTHETIC CHILD PNG BYTES');
  write(root,OLD_SOL,'<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L2 2"/></svg>');
  write(root,SF,bankText(before));write(root,DP,dict);
  const md={records:before.map((q,i)=>({questionUid:uid(i+1),approvalStatus:'approved_partial_with_explicit_holds',primaryMethod:null,decisiveStep:null}))};
  const identity={records:before.map((q,i)=>({questionUid:uid(i+1),sourceArchiveFile:SOURCE,sourceOrdinal:i+1,sourceQuestionNo:String(i+1),status:'VERIFIED',sourceFingerprint:builder.identityHash(q)}))};
  if(opt.legacyIdentity)for(const row of identity.records)delete row.status;
  if(opt.originalIdentity)opt.originalIdentity(identity);
  write(root,MD,md);write(root,ID,identity);
  const native={schemaVersion:'archive-meta-4slot-v0',sourceArchiveFile:SOURCE,sourceGitBlobSha:builder.blob(Buffer.from(bankText(before))),dictionaryVersion:dict.dictionaryVersion,judgedBy:'SYNTHETIC_AUTHOR',
    items:before.map((q,i)=>({sourceOrdinal:i+1,questionUid:uid(i+1),format:'단일 정답',slots:{given:[{term:'synthetic given'}],goal:[{term:'synthetic goal'}],method:[{term:'synthetic method'}],condition:[]},fingerprints:[],review:{status:'SYNTHETIC_EXISTING'}})),candidates:[],selfCheck:{synthetic:true}};
  const semantic={schemaVersion:'m2-s1-meta-review-v1',examId:'E001',sourceArchiveFile:SOURCE,items:before.map((q,i)=>({questionUid:uid(i+1),sourceOrdinal:i+1}))};
  const independent={schemaVersion:'m2-s1-independent-sample-v1',examId:'E001',author:'SYNTHETIC_AUTHOR',reviewer:'SYNTHETIC_SAMPLE_REVIEWER',independent:true};
  write(root,NP,native);write(root,SP,semantic);write(root,IP,independent);
  const acceptance={schemaVersion:'m2-s1-root-acceptance-v1',examId:'E001',owner:'SYNTHETIC_ROOT',sampleReviewer:independent.reviewer,decision:'ACCEPT_REVIEW_WITH_NAMED_DEBTS',
    independentSha256:sha(fs.readFileSync(path.join(root,IP))),finalSourceBlob:native.sourceGitBlobSha,finalFourSlotSha256:sha(fs.readFileSync(path.join(root,NP))),reviewSha256:sha(fs.readFileSync(path.join(root,SP)))};
  if(opt.acceptance)opt.acceptance(acceptance);write(root,RP,acceptance);
  const nativeCommit=commit(root);
  const compact={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:SOURCE,sourceGitBlobSha:native.sourceGitBlobSha,dictionaryVersion:dict.dictionaryVersion,
    evidence:{branch:'synthetic',commit:nativeCommit,path:NP},reviewedBy:{agent:'SYNTHETIC_EXISTING_REVIEW',at:'2026-01-01',sampled:[1]},
    items:before.map((q,i)=>({ordinal:i+1,format:'단일 정답',given:[1],goal:[2],method:[3],condition:[],candidates:[]}))};
  if(opt.orphan)compact.identityReconciliation={schemaVersion:'4slot-orphan-uid-reconciliation-v1',sourceGitBlobSha:native.sourceGitBlobSha,records:[{sourceOrdinal:1,sourceQuestionNo:'1',questionUid:uid(1),embeddedQuestionUid:uid(9),sourceFingerprint:builder.identityHash(before[0])}]};
  if(opt.unselectedHold)compact.items[2].registrationHold={schemaVersion:'4slot-native-review-hold-v1',reason:'SYNTHETIC_UNSUPPORTED_HOLD'};
  write(root,CP,compact);
  const prior=builder.build(root,{reuseCache:false}).index;
  assert.equal(prior.records.some(r=>r.questionUid===uid(1)),true,'synthetic historical selection was actually REGISTERED');
  if(opt.priorIndex)opt.priorIndex(prior);write(root,builder.OUTPUT,JSON.stringify(prior)+'\n');
  const priorCommit=commit(root);
  const current=CLONE(before);current[0].image=NEW.slice(8);current[0].imageAlt='Synthetic current display';current[0].imageSize='medium';current[0].layoutTag='synthetic-figure';
  if(opt.solution){current[0].solutionImage=NEW_SOL.slice(8);current[0].solutionImageAlt='Synthetic solution display';}
  if(opt.content){current[0].content=before[0].content+'<div><img src="'+NEW.slice(8)+'"></div>';}
  if(opt.transcription){current[0].content=before[0].content+'<div>Synthetic image transcription</div>';}
  if(opt.current)opt.current(current,md,identity,compact);
  write(root,NEW,'<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L3 3"/>'+(opt.nested?'<image href="child.png"/>':'')+'</svg>');
  if(opt.solution)write(root,NEW_SOL,'<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L4 4"/></svg>');
  write(root,SF,bankText(current));write(root,MD,md);write(root,ID,identity);
  if(opt.orphan)compact.identityReconciliation.sourceGitBlobSha=builder.blob(Buffer.from(bankText(current)));
  write(root,CP,compact);const currentCommit=commit(root);
  const assets=(at,which)=>[...new Set([...([which.image,which.solutionImage].filter(Boolean).map(p=>'archive/'+p)),...(opt.nested?[CHILD]:[])])].sort().map(p=>ref(root,at,p));
  const doc={schemaVersion:route.SCHEMA,scope:route.SCOPE,sourceArchiveFile:SOURCE,questionUid:uid(1),sourceOrdinal:1,sourceQuestionNo:'1',sourceQuestionCount:3,
    priorRegistrationRef:ref(root,priorCommit,builder.OUTPUT),priorCompactRef:ref(root,priorCommit,CP),currentCompactRef:ref(root,currentCommit,CP),dictionaryRef:ref(root,priorCommit,DP),
    nativeFourSlotRef:ref(root,nativeCommit,NP),nativeSourceRef:ref(root,nativeCommit,SF),priorSourceRef:ref(root,priorCommit,SF),currentSourceRef:ref(root,currentCommit,SF),
    priorMetadataRef:ref(root,priorCommit,MD),priorIdentityRef:ref(root,priorCommit,ID),
    nativeAuthority:{kind:'ROOT_ACCEPTED_NATIVE',originalRootRef:ref(root,nativeCommit,RP),originalIndependentRef:ref(root,nativeCommit,IP),finalAcceptanceRef:ref(root,nativeCommit,RP),semanticRef:ref(root,nativeCommit,SP),originalFourSlotRef:null,proposalRef:null},
    nativeAssets:assets(nativeCommit,before[0]),priorAssets:assets(priorCommit,before[0]),currentAssets:assets(currentCommit,current[0]),
    vectorSha256:sha(stable(vector(compact.items[0]))),nativeItemSha256:sha(stable(native.items[0])),
    priorMetadataSha256:sha(stable(JSON.parse(g(root,'show',priorCommit+':'+MD)).records[0])),priorIdentitySha256:sha(stable(JSON.parse(g(root,'show',priorCommit+':'+ID)).records[0])),
    changedFields:route.ownChanges(before[0],current[0]),displayReviews:[],inlineEdits:[],orphanIdentity:null,newMathQa:0,newSemanticApproval:0,newFourSlotVector:0};
  if(opt.content||opt.transcription){const b=Buffer.from(before[0].content),a=Buffer.from(current[0].content);doc.inlineEdits=[{kind:opt.transcription?'ORIGINAL_IMAGE_PROCESS_TRANSCRIPTION':'IMAGE_MARKUP_ONLY',beforeInterval:[b.length,b.length],afterInterval:[b.length,a.length],beforeSha256:sha(Buffer.alloc(0)),afterSha256:sha(a.subarray(b.length)),transcriptionAssetRef:opt.transcription?doc.priorAssets.find(r=>r.path===OLD):null}];}
  if(opt.orphan)doc.orphanIdentity={schemaVersion:'archive-existing-registered-orphan-uid-display-continuity-v1',embeddedQuestionUid:uid(9),questionUid:uid(1),sourceOrdinal:1,sourceQuestionNo:'1',historicalFingerprint:builder.identityHash(before[0]),currentFingerprint:builder.identityHash(current[0])};
  if(opt.doc)opt.doc(doc);
  const surfaces=opt.solution?['PROBLEM','SOLUTION']:['PROBLEM'],technical={},reviews={};
  const splitSurfaces=opt.splitCapture||[];let captureCommit=null;
  if(splitSurfaces.length){
    const restore=[SF,NEW,NEW_SOL,CHILD].filter(p=>fs.existsSync(path.join(root,p))).map(p=>[p,fs.readFileSync(path.join(root,p))]);
    write(root,`${PREFIX}/capture-only-marker.json`,{synthetic:true});
    if(opt.captureMutation)opt.captureMutation(root,current);
    captureCommit=commit(root);for(const[p,raw]of restore)write(root,p,raw);
  }
  for(const surface of surfaces){
    const paths=surface==='PROBLEM'?[NEW,...(opt.nested?[CHILD]:[])]:[NEW_SOL];const oldPaths=surface==='PROBLEM'?[OLD,...(opt.nested?[CHILD]:[])]:[OLD_SOL];
    const currentAssets=doc.currentAssets.filter(r=>paths.includes(r.path)),priorAssets=doc.priorAssets.filter(r=>oldPaths.includes(r.path));
    const captured=splitSurfaces.includes(surface);
    const uiDoc=captured?{...doc,currentSourceRef:ref(root,captureCommit,SF)}:doc;
    const uiAssets=captured?currentAssets.map(a=>ref(root,captureCommit,a.path)):currentAssets;
    technical[surface]=makeUi(uiDoc,surface,uiAssets,{tiles:opt.tiles||1});if(opt.technical)opt.technical(technical[surface],surface);
    write(root,`${PREFIX}/${surface}-technical.json`,technical[surface]);
    const binding=route.displayBinding(doc,before[0],current[0],doc.changedFields,surface,priorAssets,currentAssets);
    reviews[surface]={schemaVersion:route.REVIEW_SCHEMA,scope:route.SCOPE,reviewer:'SYNTHETIC_DISPLAY_REVIEWER',decision:ui.DECISION,
      givenRef:null,originalObservationRef:null,currentObservationRef:null,phaseOrder:'GIVEN_THEN_ORIGINAL_FREEZE_THEN_CURRENT',newMathQa:0,newSemanticApproval:0,newFourSlotVector:0,
      records:[{questionUid:uid(1),sourceOrdinal:1,surface,bindingSha256:sha(stable(binding)),decision:ui.DECISION,contentEditKind:surface==='PROBLEM'?(opt.content?'IMAGE_MARKUP_ONLY':opt.transcription?'ORIGINAL_IMAGE_PROCESS_TRANSCRIPTION':'NONE'):'NONE'}]};
  }
  for(const phase of ['given','original','current'])write(root,`${PREFIX}/${phase}.json`,{phase,synthetic:true});
  const phaseCommit=commit(root);
  for(const surface of surfaces){
    const review=reviews[surface];review.givenRef=ref(root,phaseCommit,`${PREFIX}/given.json`);review.originalObservationRef=ref(root,phaseCommit,`${PREFIX}/original.json`);review.currentObservationRef=ref(root,phaseCommit,`${PREFIX}/current.json`);
    if(opt.review)opt.review(review,surface);write(root,`${PREFIX}/${surface}-independent.json`,review);
    const technicalRef=ref(root,phaseCommit,`${PREFIX}/${surface}-technical.json`),visual=makeVisual(technical[surface],technicalRef);
    if(opt.visual)opt.visual(visual,surface);write(root,`${PREFIX}/${surface}-visual.json`,visual);
  }
  const reviewCommit=commit(root);
  doc.displayReviews=surfaces.map(surface=>({surface,independentRef:ref(root,reviewCommit,`${PREFIX}/${surface}-independent.json`),technicalRef:ref(root,phaseCommit,`${PREFIX}/${surface}-technical.json`),visualRef:ref(root,reviewCommit,`${PREFIX}/${surface}-visual.json`)}));
  for(const review of doc.displayReviews)if(splitSurfaces.includes(review.surface)){
    const actual=technical[review.surface].results[0];
    review.uiCheckoutContinuity={schemaVersion:'archive-existing-vector-ui-checkout-continuity-v1',questionUid:doc.questionUid,sourceOrdinal:doc.sourceOrdinal,surface:review.surface,
      capturedSourceRef:actual.sourceRef,capturedAssetRefs:actual.assetRefs,currentSourceRef:doc.currentSourceRef,currentAssetRefs:actual.assetRefs.map(a=>doc.currentAssets.find(c=>c.path===a.path))};
  }
  if(opt.finalDoc)opt.finalDoc(doc);
  const carrier=`${route.DIR}/${uid(1)}.json`;write(root,carrier,doc);
  return {root,doc,carrier,prior,current,before,identity,compact,technical,reviews,commit:currentCommit,
    run:(previous=prior)=>builder.build(root,{previous,reuseCache:true}).index,
    save:()=>write(root,carrier,doc)};
}
function selected(x){return x.records.find(r=>r.questionUid===uid(1));}
function refuses(t,options,pattern){const f=fixture(t,options),x=f.run();assert.equal(selected(x),undefined);assert.match(x.pending.find(r=>r.ordinal===1)?.reason||'',pattern);}

// Reference-policy unit tests use the separately checked immutable-reader
// interface. The fixture is the exact public, hash-only PROBLEM18 inventory;
// these synthetic captures do not claim an actual browser or visual review.
function closedRoleUiFixture(mutate=()=>{}, options={}) {
  const raw=fs.readFileSync(path.join(__dirname,'fixtures/m2s1-existing-vector-problem18-manifest.json'));
  assert.equal(sha(raw),'3b445bd5f807948e56685276d455eb71904385ad837529e13b3267126686d342');
  const manifest=JSON.parse(raw),item=manifest.items[0],at='6'.repeat(40),seen=[];
  const fixed=(p,oid,digest,bytes)=>({commit:at,path:p,gitBlobSha1:oid,sha256:digest,bytes});
  const manifestRef=fixed('tests/fixtures/archive-m2s1-current-problem-display-ui.json','5a78f23961292e13c061b4979feb3c4b54f3426f',sha(raw),raw.length);
  const helperRef=fixed('tools/m2s1-problem18-capture.cjs','058094f355588a021f2c8ac6156f0fe693507b33','785ed7749edf170e38db86119704e19e21dcdb39798a2d23889a4925284d6377',18677);
  const roleHelperRef=fixed('tools/m2s1-problem-capture-diagnostic.cjs','da3e1e22887df491382167ce17003a6d91aa9f29','9951724223fffe462fec790d444a5fb1d04e7a5bf9c4c0d1a2a81ad84f9e2ee9',14569);
  const sourceRef=fixed(item.sourcePath,item.sourceGitBlobSha1,item.sourceSha256,69826),assetRef={commit:at,...item.assets[0]};
  const doc={questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal,currentSourceRef:sourceRef};
  const surface=options.surface||'PROBLEM',technical=makeUi(doc,surface,[assetRef]);
  for (const row of technical.results) {
    row.capture.visibleChildren=2;
    row.capture.closedProblemRoles={schemaVersion:'archive-m2s1-problem18-two-direct-roles-v1',key:item.key,questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal,
      manifestRef,sourceRef,assetRef,helperRef,roleHelperRef,observedFrameSha256:'16ea5f3c9d164327c5fce653bbdd36dbd84056f2c4d6bd81c518cc2f85781bef',
      numberRoleCount:1,contentRoleCount:1,targetImageCount:1,emptyZeroHeightNodeCount:1,originalSharedHelperUnchanged:true};
  }
  mutate(technical,doc);
  const technicalRaw=Buffer.from(JSON.stringify(technical)+'\n');
  const technicalRef=fixed('docs/synthetic-two-role-technical.json',builder.blob(technicalRaw),sha(technicalRaw),technicalRaw.length);
  const visual=makeVisual(technical,technicalRef);
  const readRef=ref=>{
    seen.push(CLONE(ref));
    if(options.missingRef===ref.path)throw Error('SYNTHETIC_IMMUTABLE_REF_MISSING');
    if(ref.path===manifestRef.path)return options.badManifestBytes?Buffer.from('{}'):raw;
    // At this unit boundary readRef stands for the existing exact Git reader.
    // Production reference-byte/commit failures are covered by the integration
    // tests above; no foreign source or fabricated review is issued here.
    return Buffer.alloc(0);
  };
  return {technical,visual,seen,run:()=>ui.verifyUi({technical,visual,technicalRef,readRef,questionUid:doc.questionUid,sourceOrdinal:doc.sourceOrdinal,surface,sourceRef:doc.currentSourceRef,assetRefs:[assetRef]})};
}
const twoRoleChange=(t,fn)=>{for(const row of t.results)fn(row,row.capture.closedProblemRoles);};
function rejectsClosedRole(mutate,pattern=/CLOSED_PROBLEM/,options={}) { const f=closedRoleUiFixture(mutate,options);assert.throws(f.run,pattern); }

test('closed PROBLEM18 number/content roles retain complete desktop and mobile capture checks',()=>{
  const f=closedRoleUiFixture();assert.deepEqual(f.run(),{logicalCases:2,originalTiles:2});
  for(const p of ['tests/fixtures/archive-m2s1-current-problem-display-ui.json','tools/m2s1-problem18-capture.cjs','tools/m2s1-problem-capture-diagnostic.cjs','tools/check-reviewed-problem-renderer-browser.cjs'])
    assert.equal(f.seen.some(r=>r.path===p),true,p+' must be read through the immutable reader');
});
test('closed two-role mobile can coexist with an unchanged normal desktop capture',()=>{
  const f=closedRoleUiFixture(t=>{t.results[0].capture.visibleChildren=4;delete t.results[0].capture.closedProblemRoles;});assert.equal(f.run().logicalCases,2);
});
test('two visible solution children never use the problem-only role exception',()=>rejectsClosedRole(()=>{},/CLOSED_PROBLEM_SCOPE/,{surface:'SOLUTION'}));
test('two problem children without exact role evidence refuse',()=>rejectsClosedRole(t=>twoRoleChange(t,r=>{delete r.capture.closedProblemRoles;})));
test('own-null problem role evidence refuses',()=>rejectsClosedRole(t=>twoRoleChange(t,r=>{r.capture.closedProblemRoles=null;})));
test('a closed-role marker on the ordinary three-child path refuses',()=>rejectsClosedRole(t=>twoRoleChange(t,r=>{r.capture.visibleChildren=3;}),/CLOSED_PROBLEM_SCOPE/));
test('extra role evidence fields cannot be resealed',()=>rejectsClosedRole(t=>twoRoleChange(t,(_r,c)=>{c.optionalApproval=true;})));
test('foreign role UID refuses after the visual hashes are resealed',()=>rejectsClosedRole(t=>twoRoleChange(t,(_r,c)=>{c.questionUid=uid(987);}))); 
test('foreign role ordinal refuses after the visual hashes are resealed',()=>rejectsClosedRole(t=>twoRoleChange(t,(_r,c)=>{c.sourceOrdinal++;})));
test('foreign role key refuses inside the same manifest',()=>rejectsClosedRole(t=>twoRoleChange(t,(_r,c)=>{c.key='E009-Q17';})));
for(const key of ['numberRoleCount','contentRoleCount','targetImageCount','emptyZeroHeightNodeCount']) {
  test('closed role '+key+' cannot be omitted',()=>rejectsClosedRole(t=>twoRoleChange(t,(_r,c)=>{delete c[key];})));
  test('closed role '+key+' must remain exactly one',()=>rejectsClosedRole(t=>twoRoleChange(t,(_r,c)=>{c[key]=2;})));
}
test('closed role original shared helper marker must be true',()=>rejectsClosedRole(t=>twoRoleChange(t,(_r,c)=>{c.originalSharedHelperUnchanged=false;})));
test('different original observed frame is not accepted as the named scope',()=>rejectsClosedRole(t=>twoRoleChange(t,(_r,c)=>{c.observedFrameSha256='0'.repeat(64);}))); 
for(const key of ['manifestRef','helperRef','roleHelperRef']) {
  test('closed '+key+' must be the exact reviewed code or inventory',()=>rejectsClosedRole(t=>twoRoleChange(t,(_r,c)=>{c[key]={...c[key],sha256:'1'.repeat(64)};})));
  test('closed '+key+' must be in the actual capture checkout',()=>rejectsClosedRole(t=>twoRoleChange(t,(_r,c)=>{c[key]={...c[key],commit:'1'.repeat(40)};})));
}
test('a marker cannot substitute for a missing unchanged common helper',()=>rejectsClosedRole(()=>{},/SYNTHETIC_IMMUTABLE_REF_MISSING/,{missingRef:'tools/check-reviewed-problem-renderer-browser.cjs'}));
test('a hash-only claim cannot substitute different manifest bytes',()=>rejectsClosedRole(()=>{},/CLOSED_PROBLEM_MANIFEST/,{badManifestBytes:true}));
test('role source reference must match the technical result exactly',()=>rejectsClosedRole(t=>twoRoleChange(t,(_r,c)=>{c.sourceRef={...c.sourceRef,path:'archive/exams/foreign.js'};})));
test('resealed result and role source still require the exact manifest source',()=>rejectsClosedRole(t=>twoRoleChange(t,(r,c)=>{r.sourceRef={...r.sourceRef,sha256:'2'.repeat(64)};c.sourceRef=r.sourceRef;})));
test('role asset reference must match the technical result exactly',()=>rejectsClosedRole(t=>twoRoleChange(t,(_r,c)=>{c.assetRef={...c.assetRef,sha256:'3'.repeat(64)};})));
test('a changed asset needs a separately reviewed closed inventory revision',()=>rejectsClosedRole(t=>twoRoleChange(t,(r,c)=>{r.assetRefs=[{...r.assetRefs[0],sha256:'4'.repeat(64)}];c.assetRef=r.assetRefs[0];})));
test('two-role coverage still rejects omitted original pixels',()=>rejectsClosedRole(t=>twoRoleChange(t,r=>{r.capture.coverage.complete=false;}),/COVERAGE/));
test('two-role coverage still rejects a blocked tile',()=>rejectsClosedRole(t=>twoRoleChange(t,r=>{r.capture.tiles[0].obstructionsIntersectingClip=1;}),/TILE/));
test('two-role coverage still rejects a changed DOM',()=>rejectsClosedRole(t=>twoRoleChange(t,r=>{r.capture.tiles[0].domSha256='5'.repeat(64);}),/TILE/));
test('two-role coverage still rejects changed viewports',()=>rejectsClosedRole(t=>twoRoleChange(t,r=>{r.capture.viewportChanges=1;}),/CAPTURE/));

test('restores only the pre-existing vector after separate static and actual UI capsule checks',t=>{
  const f=fixture(t,{unselectedHold:true}),carrierBytes=fs.readFileSync(path.join(f.root,f.carrier));
  fs.unlinkSync(path.join(f.root,f.carrier));const ordinaryCurrent=f.run();write(f.root,f.carrier,carrierBytes);
  const out=f.run();assert.equal(selected(out).sourceBinding,'EXISTING_REGISTERED_VECTOR_CONTINUITY');
  assert.deepEqual(vector(selected(out)),vector(selected(f.prior)));assert.equal(selected(out).independentReviewClaim,false);
  assert.deepEqual(out.records.filter(r=>r.questionUid!==uid(1)),ordinaryCurrent.records.filter(r=>r.questionUid!==uid(1)));
  assert.deepEqual(out.pending,f.prior.pending);assert.equal(builder.verify(out).verified,2);
  const caught=f.run(out);assert.deepEqual(caught,out);assert.equal(selected(caught).sourceBinding,'EXISTING_REGISTERED_VECTOR_CONTINUITY');
});
test('problem and solution require distinct complete reviewed surfaces',t=>{const f=fixture(t,{solution:true}),x=f.run();assert.ok(selected(x));assert.equal(x.counts.registered,3);});
test('whole original tiles, including the final tile, are required',t=>{const f=fixture(t,{tiles:2});assert.ok(selected(f.run()));});
test('named orphan proof preserves historical global identity without changing the UID',t=>{
  const f=fixture(t,{orphan:true}),raw=fs.readFileSync(path.join(f.root,ID)),x=f.run();
  assert.equal(selected(x).sourceUidBinding,'EXISTING_REGISTERED_ORPHAN_UID_DISPLAY_CONTINUITY');assert.equal(selected(x).identityFingerprintStatus,'HISTORICAL');
  assert.deepEqual(fs.readFileSync(path.join(f.root,ID)),raw);assert.deepEqual(f.run(x),x);
});
test('prior published legacy identity with exact own-absence remains unchanged',t=>{
  const f=fixture(t,{legacyIdentity:true}),out=f.run();assert.ok(selected(out));assert.equal(Object.hasOwn(f.identity.records[0],'status'),false);assert.deepEqual(f.run(out),out);
});
test('explicit null is not the legacy own-absence route',t=>refuses(t,{originalIdentity:i=>{i.records[1].status=null;}},/FULL_UID_INVENTORY/));
test('adding status to an unrelated old legacy identity is not silently accepted',t=>refuses(t,{legacyIdentity:true,current:(b,m,i)=>{i.records[1].status='VERIFIED';}},/FULL_UID_INVENTORY/));
test('bounded inline image-only spans preserve every other byte',t=>assert.ok(selected(fixture(t,{content:true}).run())));
test('a separately declared original-image transcription is bound to that original asset',t=>assert.ok(selected(fixture(t,{transcription:true}).run())));
test('absent carrier falls through to unchanged original stale-payload refusal',t=>{const f=fixture(t);fs.unlinkSync(path.join(f.root,f.carrier));assert.equal(selected(f.run()),undefined);assert.match(f.run().pending[0].reason,/STALE_STUDENT_PAYLOAD/);});
test('deleting a carrier after issuance refuses on the caught-up cursor',t=>{const f=fixture(t),out=f.run();fs.unlinkSync(path.join(f.root,f.carrier));const x=f.run(out);assert.equal(selected(x),undefined);assert.match(x.pending[0].reason,/CLAIM_MISSING_OR_MIXED/);});
test('removing row marker still retains the separate file claim and refuses',t=>{const f=fixture(t),out=f.run();delete selected(out).existingVectorContinuityRef;selected(out).sourceBinding='UNCHANGED_STUDENT_PAYLOAD';fs.unlinkSync(path.join(f.root,f.carrier));assert.equal(selected(f.run(out)),undefined);});
test('deleting both output claims and the retained input still hits the original student guard',t=>{
  const f=fixture(t),out=f.run();delete selected(out).existingVectorContinuityRef;selected(out).sourceBinding='UNCHANGED_STUDENT_PAYLOAD';
  for(const file of out.files)delete file.existingVectorContinuityClaims;
  fs.unlinkSync(path.join(f.root,f.carrier));const next=f.run(out);assert.equal(selected(next),undefined);
  assert.match(next.pending.find(r=>r.ordinal===1).reason,/STALE_STUDENT_PAYLOAD/);
});
test('current asset bytes are checked live even with unchanged cached output',t=>{const f=fixture(t),out=f.run();fs.appendFileSync(path.join(f.root,NEW),' ');const x=f.run(out);assert.equal(selected(x),undefined);assert.match(x.pending[0].reason,/LIVE_BYTES_CHANGED/);});
test('referenced SVG children are part of the immutable and live asset inventory',t=>{
  const f=fixture(t,{nested:true}),out=f.run();assert.ok(selected(out));fs.appendFileSync(path.join(f.root,CHILD),' changed');
  const next=f.run(out);assert.equal(selected(next),undefined);assert.match(next.pending[0].reason,/LIVE_BYTES_CHANGED/);
});
test('missing SVG child from an otherwise resealed inventory refuses',t=>refuses(t,{nested:true,doc:x=>{x.currentAssets=x.currentAssets.filter(r=>r.path!==CHILD);}},/ASSET_INVENTORY_MISSING/));
test('current metadata whole-row changes cannot be resealed as display continuity',t=>refuses(t,{current:(b,m)=>{m.records[0].primaryMethod='changed';}},/METADATA_IDENTITY_CHANGED/));
test('current identity whole-row changes cannot be resealed as display continuity',t=>refuses(t,{current:(b,m,i)=>{i.records[0].foreign='changed';}},/METADATA_IDENTITY_CHANGED/));
test('different answer cannot use a display witness',t=>refuses(t,{current:b=>{b[0].answer='changed';}},/UNREVIEWABLE_FIELD_CHANGE/));
test('different original solution text cannot use a renderer witness',t=>refuses(t,{current:b=>{b[0].solution='changed';}},/UNREVIEWABLE_FIELD_CHANGE/));
test('new source approval flags are rejected even if separately hashed',t=>refuses(t,{current:b=>{b[0].reviewStatus='FINAL_QA';}},/UNREVIEWABLE_FIELD_CHANGE/));
test('dictionary/vector mutation is refused',t=>refuses(t,{current:(b,m,i,c)=>{c.items[0].method=[2];}},/PRIOR_REGISTERED_INDEX|PRIOR_REGISTERED_ROW/));
test('historical index must actually contain the registered row',t=>refuses(t,{priorIndex:x=>{x.records=x.records.filter(r=>r.questionUid!==uid(1));}},/PRIOR_REGISTERED_ROW/));
test('historical pending row cannot be reinterpreted as registered',t=>refuses(t,{priorIndex:x=>{x.pending.push({path:CP,ordinal:1,reason:'PENDING'});}},/PRIOR_REGISTERED_ROW/));
test('historical registered row cannot invent an independent semantic claim',t=>refuses(t,{priorIndex:x=>{selected(x).independentReviewClaim=true;}},/PRIOR_REGISTERED_ROW/));
test('changed native acceptance decision is refused after all hashes are resealed',t=>refuses(t,{acceptance:x=>{x.decision='PENDING';}},/NATIVE_ROOT_ACCEPTANCE/));
test('full bank denominator is mandatory',t=>refuses(t,{doc:x=>{x.sourceQuestionCount=2;}},/INPUT_SCOPE/));
test('unknown carrier fields are refused',t=>refuses(t,{finalDoc:x=>{x.optionalApproval=true;}},/INPUT_KEYS/));
test('a missing immutable UI file is never a fallback to historical registration',t=>refuses(t,{finalDoc:x=>{x.displayReviews[0].technicalRef.path='docs/missing-technical.json';}},/IMMUTABLE_GIT_INPUT_UNAVAILABLE/));
test('own-null optional approval field is not ignored',t=>refuses(t,{finalDoc:x=>{x.newApproval=null;}},/INPUT_KEYS/));
test('null orphan proof is not a generic UID fallback',t=>refuses(t,{orphan:true,doc:x=>{x.orphanIdentity=null;}},/ORPHAN_PROOF_KEYS/));
test('current orphan fingerprint is recomputed rather than inferred from a header',t=>refuses(t,{orphan:true,doc:x=>{x.orphanIdentity.currentFingerprint=x.orphanIdentity.historicalFingerprint;}},/ORPHAN_CONTINUITY/));
test('foreign embedded UID already in canonical identity is refused',t=>refuses(t,{orphan:true,current:(b,m,i)=>{i.records.push({...i.records[2],questionUid:uid(9),sourceArchiveFile:'original/middle/m2/1mid/other.js'});}},/ORPHAN_CONTINUITY/));
test('wording text outside a bounded image edit is not normalized away',t=>refuses(t,{content:true,current:b=>{b[0].content='unreviewed prefix '+b[0].content;}},/INLINE_NON_IMAGE_MARKUP|INLINE_EDIT_BINDING/));
test('transcription cannot cite a different original asset',t=>refuses(t,{transcription:true,doc:x=>{x.inlineEdits[0].transcriptionAssetRef=x.priorAssets.find(r=>r.path===OLD_SOL);}},/TRANSCRIPTION_ORIGINAL_ASSET/));
test('a missing problem display review cannot be replaced by solution review',t=>refuses(t,{solution:true,finalDoc:x=>{x.displayReviews=x.displayReviews.filter(r=>r.surface==='SOLUTION');}},/DISPLAY_SURFACE_INVENTORY/));
test('static accepted review still requires original UI evidence',t=>refuses(t,{technical:x=>{x.status='NOT_RUN';}},/EXISTING_VECTOR_UI_TECHNICAL/));
test('technical PASS with independent visual pending is refused',t=>refuses(t,{visual:x=>{x.decision='PENDING';}},/EXISTING_VECTOR_UI_VISUAL/));
test('the technical image producer cannot also claim the independent visual review',t=>refuses(t,{visual:x=>{x.reviewer='GITHUB_ACTIONS_SUPPORTED_CHROME';}},/EXISTING_VECTOR_UI_VISUAL/));
test('a missing final original tile cannot be claimed as complete',t=>refuses(t,{tiles:2,visual:x=>{x.records[0].screenshots.pop();}},/VISUAL_TILE_INVENTORY/));
test('all logical cases, not only the selected desktop, need visual acceptance',t=>refuses(t,{visual:x=>{x.records.pop();}},/EXISTING_VECTOR_UI_VISUAL/));
test('root-only solution visual review remains separate from problem review',t=>refuses(t,{solution:true,visual:(x,s)=>{if(s==='SOLUTION')x.records[0].screenshots[0].decision='PENDING';}},/EXISTING_VECTOR_UI_SCREENSHOT/));
test('changing an unchanged other source row does not register it through the selected carrier',t=>{const f=fixture(t,{current:b=>{b[1].answer='changed';}}),x=f.run();assert.ok(selected(x));assert.equal(x.records.some(r=>r.questionUid===uid(2)),false);assert.match(x.pending.find(r=>r.ordinal===2).reason,/STALE_STUDENT_PAYLOAD/);});
test('the read-only Consumer rejects missing, foreign and mixed continuation markers',t=>{
  const f=fixture(t),out=f.run();assert.equal(builder.verify(out).verified,3);
  const mutations=[
    r=>{delete r.existingVectorContinuityRef;},
    r=>{r.existingVectorContinuityRef.path=r.existingVectorContinuityRef.path.replace(uid(1),uid(2));},
    r=>{r.existingVectorContinuityRef.sha256='wrong';},
    r=>{r.existingVectorContinuityRef.extra=true;},
    r=>{r.independentReviewClaim=true;},
    r=>{r.sourceBinding='EXACT_BLOB';},
    r=>{r.rendererContinuityRef={path:'.archive-meta-register/4slot-renderer-continuity/test.json',sha256:sha('x')};}
  ];
  for(const mutate of mutations){const copy=CLONE(out);mutate(selected(copy));assert.throws(()=>builder.verify(copy),/FOUR_SLOT_.*REF/);}
});
test('an unrelated private historical commit cannot manufacture prior registration',t=>{
  const f=fixture(t),old=f.doc.priorRegistrationRef.commit,tree=g(f.root,'rev-parse',old+'^{tree}'),foreign=g(f.root,'commit-tree',tree,'-m','DISCONNECTED SYNTHETIC HISTORY');
  for(const key of ['priorRegistrationRef','priorCompactRef','priorSourceRef','priorMetadataRef','priorIdentityRef'])f.doc[key].commit=foreign;
  f.save();const out=f.run();assert.equal(selected(out),undefined);assert.match(out.pending.find(r=>r.ordinal===1).reason,/PRIOR_REGISTRATION_NOT_ANCESTOR/);
});

const uiNegatives=[
  ['viewport width',t=>{t.results[0].viewport={...t.results[0].viewport,width:1400};}],
  ['mode',t=>{t.results[0].mode='sol';}],
  ['source overlay',t=>{t.sourceOverlayCount=1;}],
  ['DOM mutation',t=>{t.domWrites=1;}],
  ['CSS mutation',t=>{t.cssWrites=1;}],
  ['font not loaded',t=>{t.results[0].fonts.expectedFamilyLoaded=false;}],
  ['fonts ready pending',t=>{t.results[0].fonts.ready=false;}],
  ['unknown technical key',t=>{t.rawMarkup='forbidden';}],
  ['single screenshot alias',t=>{t.results[0].screenshot=t.results[0].screenshots[0];}],
  ['wrong overlap',t=>{t.results[0].capture.overlapCssPixels=31;}],
  ['incomplete interval',t=>{t.results[0].capture.coverage.coveredInterval=[0,99];}],
  ['foreign obstruction',t=>{t.results[0].capture.tiles[0].obstructionsIntersectingClip=1;}],
  ['foreign content',t=>{t.results[0].capture.tiles[0].foreignContentHits=1;}],
  ['absent hit tests',t=>{t.results[0].capture.tiles[0].hitTestSamples=0;}],
  ['feedback not idle',t=>{t.results[0].capture.tiles[0].feedbackIdle=false;}],
  ['DOM changing between capture',t=>{t.results[0].capture.tiles[0].domSha256=sha('different');}],
  ['clip outside viewport',t=>{t.results[0].capture.tiles[0].clip.x=2000;}],
  ['tile index gap',t=>{t.results[0].capture.tiles[0].tileIndex=0;}],
  ['wrong surface capture schema',t=>{t.results[0].capture.schemaVersion='archive-solution-scroll-coverage-v1';}],
  ['compact capture alias',t=>{t.results[0].capture.contentHeight=100;}],
  ['stitched replacement',t=>{t.results[0].capture.compositeImageCreated=true;}],
  ['capture viewport mutation',t=>{t.results[0].capture.viewportChanges=1;}],
  ['capture CSS mutation',t=>{t.results[0].capture.cssWrites=1;}],
  ['capture DOM mutation',t=>{t.results[0].capture.domWrites=1;}],
  ['capture viewport binding',t=>{t.results[0].capture.viewport.height=900;}],
  ['incomplete visible children',t=>{t.results[0].capture.visibleChildren=2;}],
  ['document surface outside own box',t=>{t.results[0].capture.question.height=50;}],
  ['clip different document origin',t=>{t.results[0].capture.tiles[0].scroll.y=10;t.results[0].capture.tiles[0].scrollOperations=1;}],
  ['clip narrower than own surface',t=>{t.results[0].capture.tiles[0].clip.width=90;}],
  ['capture scroll ledger changed',t=>{t.results[0].capture.scrollOperations=1;}],
  ['capture final scroll changed',t=>{t.results[0].capture.scrollAfter.y=10;}],
  ['duplicate logical case',t=>{t.results[1]=CLONE(t.results[0]);}],
  ['extra artifact',t=>{t.screenshotArtifacts.push({path:'extra.png',sha256:sha('extra'),bytes:5});t.screenshotArtifactCount++;}],
  ['missing artifact',t=>{t.screenshotArtifacts.pop();t.screenshotArtifactCount--;}],
  ['artifact traversal',t=>{t.screenshotArtifacts[0].path='../escape.png';}],
  ['unknown asset ref field',t=>{t.results[0].assetRefs[0].optional=true;}]
];
for(const [name,mutate] of uiNegatives)test('rejects fully resealed UI capsule: '+name,t=>refuses(t,{technical:mutate},/EXISTING_VECTOR_UI_|EXISTING_REGISTERED_VECTOR_REF_KEYS/));

const splitOptions={solution:true,splitCapture:['SOLUTION']};
const splitReview=doc=>doc.displayReviews.find(r=>r.surface==='SOLUTION');
function refusesCheckout(t,mutate,pattern=/UI_CHECKOUT_/){
  const f=fixture(t,splitOptions);mutate(splitReview(f.doc),f);f.save();const out=f.run();
  assert.equal(selected(out),undefined);assert.match(out.pending.find(r=>r.ordinal===1)?.reason||'',pattern);
}
test('UI checkout continuity joins separate unchanged solution capture without altering original evidence',t=>{
  const f=fixture(t,splitOptions),review=splitReview(f.doc),raw=fs.readFileSync(path.join(f.root,PREFIX+'/SOLUTION-technical.json'));
  assert.notEqual(review.uiCheckoutContinuity.capturedSourceRef.commit,f.doc.currentSourceRef.commit);
  const md=fs.readFileSync(path.join(f.root,MD)),id=fs.readFileSync(path.join(f.root,ID)),out=f.run();
  assert.ok(selected(out));assert.deepEqual(vector(selected(out)),vector(selected(f.prior)));assert.equal(builder.verify(out).verified,3);
  assert.deepEqual(f.run(out),out);assert.deepEqual(fs.readFileSync(path.join(f.root,MD)),md);assert.deepEqual(fs.readFileSync(path.join(f.root,ID)),id);
  assert.deepEqual(fs.readFileSync(path.join(f.root,PREFIX+'/SOLUTION-technical.json')),raw);
});
test('UI checkout continuity preserves complete two-viewport problem capture',t=>{
  const f=fixture(t,{splitCapture:['PROBLEM']}),out=f.run();assert.ok(selected(out));assert.equal(builder.verify(out).verified,3);assert.deepEqual(f.run(out),out);
});
test('UI checkout continuity validates unchanged nested surface assets as a complete inventory',t=>{
  const f=fixture(t,{nested:true,splitCapture:['PROBLEM']}),out=f.run();assert.ok(selected(out));
  assert.equal(f.doc.displayReviews[0].uiCheckoutContinuity.capturedAssetRefs.length,2);assert.deepEqual(f.run(out),out);
});
test('UI checkout continuity absence retains original selected-ref rejection',t=>refusesCheckout(t,r=>{delete r.uiCheckoutContinuity;},/EXISTING_VECTOR_UI_SELECTED_BINDING/));
test('UI checkout continuity own-null is refused',t=>refusesCheckout(t,r=>{r.uiCheckoutContinuity=null;},/UI_CHECKOUT_CONTINUITY_KEYS/));
test('UI checkout continuity unknown schema is refused',t=>refusesCheckout(t,r=>{r.uiCheckoutContinuity.schemaVersion='unknown';}));
test('UI checkout continuity extra field is refused',t=>refusesCheckout(t,r=>{r.uiCheckoutContinuity.approval=true;},/UI_CHECKOUT_CONTINUITY_KEYS/));
test('UI checkout continuity foreign UID is refused',t=>refusesCheckout(t,r=>{r.uiCheckoutContinuity.questionUid=uid(22);}));
test('UI checkout continuity foreign ordinal is refused',t=>refusesCheckout(t,r=>{r.uiCheckoutContinuity.sourceOrdinal=2;}));
test('UI checkout continuity cannot cross problem and solution scopes',t=>refusesCheckout(t,r=>{r.uiCheckoutContinuity.surface='PROBLEM';}));
test('UI checkout continuity current source must be the carrier current ref',t=>refusesCheckout(t,r=>{r.uiCheckoutContinuity.currentSourceRef=r.uiCheckoutContinuity.capturedSourceRef;}));
test('UI checkout continuity unnecessary same-checkout declaration is refused',t=>refusesCheckout(t,r=>{r.uiCheckoutContinuity.capturedSourceRef=r.uiCheckoutContinuity.currentSourceRef;}));
test('UI checkout continuity source commit must be the actual technical checkout',t=>refusesCheckout(t,(r,f)=>{
  r.uiCheckoutContinuity.capturedSourceRef=ref(f.root,g(f.root,'rev-parse','HEAD'),SF);
}));
test('UI checkout continuity missing immutable commit is refused',t=>refusesCheckout(t,r=>{r.uiCheckoutContinuity.capturedSourceRef.commit='0'.repeat(40);},/IMMUTABLE_GIT_INPUT_UNAVAILABLE/));
test('UI checkout continuity wrong path fails the exact Git binding',t=>refusesCheckout(t,r=>{r.uiCheckoutContinuity.capturedSourceRef.path=DP;},/REF_GIT_BINDING/));
test('UI checkout continuity wrong raw digest is refused',t=>refusesCheckout(t,r=>{r.uiCheckoutContinuity.capturedSourceRef.sha256='0'.repeat(64);},/REF_BYTES/));
test('UI checkout continuity wrong byte count is refused',t=>refusesCheckout(t,r=>{r.uiCheckoutContinuity.capturedSourceRef.bytes++;},/REF_BYTES/));
test('UI checkout continuity omitted captured asset inventory is refused',t=>refusesCheckout(t,r=>{r.uiCheckoutContinuity.capturedAssetRefs=[];}));
test('UI checkout continuity omitted current asset inventory is refused',t=>refusesCheckout(t,r=>{r.uiCheckoutContinuity.currentAssetRefs=[];}));
test('UI checkout continuity duplicate captured asset is refused',t=>refusesCheckout(t,r=>{r.uiCheckoutContinuity.capturedAssetRefs.push(r.uiCheckoutContinuity.capturedAssetRefs[0]);}));
test('UI checkout continuity asset commit must stay in the actual capture',t=>refusesCheckout(t,(r,f)=>{r.uiCheckoutContinuity.capturedAssetRefs=r.uiCheckoutContinuity.capturedAssetRefs.map(a=>ref(f.root,f.commit,a.path));}));
test('UI checkout continuity missing nested captured asset is refused',t=>refuses(t,{nested:true,splitCapture:['PROBLEM'],finalDoc:d=>{d.displayReviews[0].uiCheckoutContinuity.capturedAssetRefs=d.displayReviews[0].uiCheckoutContinuity.capturedAssetRefs.filter(r=>r.path!==CHILD);}},/UI_CHECKOUT_/));
test('UI checkout continuity reordered nested inventory is refused',t=>refuses(t,{nested:true,splitCapture:['PROBLEM'],finalDoc:d=>{d.displayReviews[0].uiCheckoutContinuity.capturedAssetRefs.reverse();}},/UI_CHECKOUT_CAPTURE_BINDING/));
test('UI checkout continuity never ignores an unselected row change in the captured whole source',t=>refuses(t,{...splitOptions,captureMutation:(root,current)=>{
  const other=CLONE(current);other[1].content+=' synthetic captured difference';write(root,SF,bankText(other));
}},/UI_CHECKOUT_BYTES/));
test('UI checkout continuity refuses even source-container whitespace drift',t=>refuses(t,{...splitOptions,captureMutation:root=>{fs.appendFileSync(path.join(root,SF),'\n');}},/UI_CHECKOUT_BYTES/));
test('UI checkout continuity refuses a fully hashed changed captured surface asset',t=>refuses(t,{...splitOptions,captureMutation:root=>{fs.appendFileSync(path.join(root,NEW_SOL),' ');}},/UI_CHECKOUT_BYTES/));
test('UI checkout continuity refuses changed captured nested child bytes',t=>refuses(t,{nested:true,splitCapture:['PROBLEM'],captureMutation:root=>{fs.appendFileSync(path.join(root,CHILD),' changed');}},/UI_CHECKOUT_BYTES/));
test('UI checkout continuity cannot bypass current metadata whole-row equality',t=>refuses(t,{...splitOptions,current:(b,m)=>{m.records[0].primaryMethod='foreign';}},/METADATA_IDENTITY_CHANGED/));
test('UI checkout continuity cannot bypass current identity whole-row equality',t=>refuses(t,{...splitOptions,current:(b,m,i)=>{i.records[0].foreign=true;}},/METADATA_IDENTITY_CHANGED/));
test('UI checkout continuity cannot bypass a changed six-field vector',t=>refuses(t,{...splitOptions,current:(b,m,i,c)=>{c.items[0].method=[2];}},/PRIOR_REGISTERED_INDEX|PRIOR_REGISTERED_ROW/));
test('UI checkout continuity still refuses an independent visual HOLD',t=>refuses(t,{...splitOptions,visual:(v,s)=>{if(s==='SOLUTION')v.records[0].decision='HOLD';}},/EXISTING_VECTOR_UI_VISUAL_CASE_BINDING/));
test('UI checkout continuity deletion refuses on the caught-up cursor',t=>{
  const f=fixture(t,splitOptions),out=f.run();assert.ok(selected(out));delete splitReview(f.doc).uiCheckoutContinuity;f.save();const next=f.run(out);
  assert.equal(selected(next),undefined);assert.match(next.pending.find(r=>r.ordinal===1).reason,/EXISTING_VECTOR_UI_SELECTED_BINDING/);
});
test('UI checkout continuity retains live asset refusal after successful issuance',t=>{
  const f=fixture(t,splitOptions),out=f.run();assert.ok(selected(out));fs.appendFileSync(path.join(f.root,NEW_SOL),' ');const next=f.run(out);
  assert.equal(selected(next),undefined);assert.match(next.pending.find(r=>r.ordinal===1).reason,/LIVE_BYTES_CHANGED/);
});

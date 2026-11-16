const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const sha=x=>crypto.createHash('sha256').update(x).digest('hex'),clone=x=>JSON.parse(JSON.stringify(x));
let mod,binding,reuse;const ready=Promise.all([
 import('../archive/tools/meta-foundation/reviewed-m2-e017-rhs-continuity.mjs').then(x=>mod=x),
 import('../archive/tools/meta-foundation/reviewed-source-binding.mjs').then(x=>binding=x),
 import('../archive/tools/meta-foundation/native-reviewed-source-reuse.mjs').then(x=>reuse=x)
]);
function transition(){const before='SYNTHETIC old explanation\nUNCHANGED suffix\n',after='SYNTHETIC clarified explanation\nUNCHANGED suffix\n';return {before,after,binding:{beforeSha256:sha(before),afterSha256:sha(after),firstLineBeforeSha256:sha(before.split('\n')[0]),firstLineAfterSha256:sha(after.split('\n')[0]),suffixSha256:sha(before.slice(before.indexOf('\n')))}};}
test('the pure transition check binds exactly one line and preserves the full suffix',async()=>{await ready;const f=transition();assert.deepEqual(mod.verifyRhsFirstLineTransition(f.before,f.after,f.binding),f.binding);});
for(const[name,mutate]of[
 ['changed suffix',f=>{f.after+='changed';f.binding.afterSha256=sha(f.after);}],
 ['reordered suffix',f=>{f.after=f.after.replace('UNCHANGED suffix','suffix UNCHANGED');f.binding.afterSha256=sha(f.after);}],
 ['different first line',f=>{f.after='different\nUNCHANGED suffix\n';}],
 ['trimmed newline',f=>{f.after=f.after.trimEnd();}],
 ['CRLF normalization',f=>{f.after=f.after.replaceAll('\n','\r\n');}],
 ['no suffix',f=>{f.after='only line';}],
 ['null string',f=>{f.after=null;}],
 ['unknown transition key',f=>{f.binding.allow=true;}],
 ['missing full-string digest',f=>{delete f.binding.afterSha256;}],
 ['invalid hash',f=>{f.binding.suffixSha256='x';}],
])test('transition refuses '+name,async()=>{await ready;const f=transition();mutate(f);assert.throws(()=>mod.verifyRhsFirstLineTransition(f.before,f.after,f.binding),/M2_E017_RHS/);});
test('explicit already accepted native metadata is the only transport',async()=>{await ready;const original={content:'SYNTHETIC',solution:'same'},current={...original,curriculum:'2015'};assert.deepEqual(mod.verifyRhsMetadataTransport(original,current,{curriculum:'2015'},{curriculum:'2015'}),['curriculum']);assert.deepEqual(original,{content:'SYNTHETIC',solution:'same'});});
for(const key of ['solution','answer','choices','question','image','imageAlt','imageSize','layoutTag','questionUid','sourceOrdinal','sourceQuestionNo','provenance','courseKey','curriculumKey','gradeKey','courseSemester'])
 test('transport cannot silently carry '+key,async()=>{await ready;assert.throws(()=>mod.verifyRhsMetadataTransport({}, {[key]:'same'}, {[key]:'same'}, {[key]:'same'}),/SOURCE_FIELD_OUTSIDE/);});
for(const[name,original,current,accepted,after]of[
 ['null',{}, {curriculum:null},{curriculum:null},{curriculum:null}],
 ['missing native value',{}, {curriculum:'2015'},{},{curriculum:'2015'}],
 ['missing explicit request',{}, {curriculum:'2015'},{curriculum:'2015'},{}],
 ['native contradiction',{}, {curriculum:'2022'},{curriculum:'2015'},{curriculum:'2022'}],
 ['request contradiction',{}, {curriculum:'2015'},{curriculum:'2015'},{curriculum:'2022'}],
 ['source property deletion',{curriculum:'2015'}, {},{curriculum:'2015'},{curriculum:'2015'}],
])test('metadata rejects '+name,async()=>{await ready;assert.throws(()=>mod.verifyRhsMetadataTransport(original,current,accepted,after),/SOURCE_FIELD_OUTSIDE/);});
test('no opt-in leaves the ordinary route unchanged',async()=>{await ready;assert.equal(mod.validateM2E017RhsContinuity({patch:{sourceReview:{}}}),null);});
test('own null cannot become the ordinary route',async()=>{await ready;assert.throws(()=>mod.validateM2E017RhsContinuity({patch:{sourceReview:{e017RhsContinuity:null}}}),/OPT_IN/);});
function early(){return {root:'.',request:{scope:'PARTIAL_UIDS',approval:{type:'FINAL_QA',metadataReviewed:true},registryChanges:[],expectedQuestionCount:23,sourceArchiveFile:mod.M2_E017_RHS_SOURCE},patch:{questionUid:mod.M2_E017_RHS_UID,sourceOrdinal:2,sourceReview:{schemaVersion:'archive-reviewed-source-reassessment-v1',reviewCommit:'a'.repeat(40),reviewPath:'native.json',reviewRef:{path:'native.json',sha256:'b'.repeat(64)},e017RhsContinuity:{schemaVersion:mod.M2_E017_RHS_SCHEMA,reviewCommit:'a'.repeat(40),reviewRef:{path:'binding.json',sha256:'b'.repeat(64)}}}},native:{review:{schemaVersion:'foreign'},spec:{}}};}
for(const[name,mutate]of[
 ['foreign UID',x=>x.patch.questionUid='qid_v1_'+'f'.repeat(64)],
 ['foreign ordinal',x=>x.patch.sourceOrdinal=3],
 ['foreign source',x=>x.request.sourceArchiveFile='original/foreign.js'],
 ['wrong denominator',x=>x.request.expectedQuestionCount=22],
 ['source rebind',x=>x.request.approval.sourceRebind={}],
 ['item rebind',x=>x.patch.rebind={}],
 ['identity-only approval',x=>x.request.registrationMode='IDENTITY_FINGERPRINT_ONLY'],
 ['registry mutation',x=>x.request.registryChanges=[{}]],
 ['missing explicit registry inventory',x=>delete x.request.registryChanges],
 ['mixed fixed-three renderer',x=>x.patch.sourceReview.m2ProblemRendererContinuity={}],
 ['mixed generic renderer',x=>x.patch.sourceReview.rendererProof={}],
 ['unknown opt-in key',x=>x.patch.sourceReview.e017RhsContinuity.allow=true],
])test('official opt-in rejects '+name+' before any Git or source access',async()=>{await ready;const x=early();mutate(x);assert.throws(()=>mod.validateM2E017RhsContinuity(x),/EXCLUSIVE_UID_SCOPE|UNMIXED_SOURCE_REVIEW|OPT_IN/);});
test('a different native review cannot acquire the exact public authority',async()=>{await ready;assert.throws(()=>mod.validateM2E017RhsContinuity(early()),/ORIGINAL_NATIVE_AUTHORITY/);});

function uiFixture(){
 const ref=p=>({commit:'a'.repeat(40),path:p,gitBlobSha1:'b'.repeat(40),sha256:sha(p),bytes:100});
 const sourceRef=ref('archive/exams/synthetic.js'),assetRefs=[ref('archive/assets/images/synthetic.svg')],technicalRef=ref('docs/technical.json');
 const viewport={name:'desktop',width:1440,height:1000},dom=sha('SYNTHETIC DOM');
 const screenshots=[{tileIndex:1,path:'synthetic-tile-1.png',sha256:sha('SYNTHETIC PNG 1'),bytes:100},{tileIndex:2,path:'synthetic-tile-2.png',sha256:sha('SYNTHETIC PNG 2'),bytes:101}];
 const capture={schemaVersion:'archive-solution-scroll-coverage-v1',method:'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES',tileLimit:8,tileCount:2,overlapCssPixels:32,
  content:{x:0,y:0,width:100,height:168},question:{x:0,y:0,width:100,height:188},viewport:{width:1440,height:1000},visibleChildren:4,
  coverage:{requiredInterval:[0,168],coveredInterval:[0,168],complete:true},domSha256:dom,scrollBefore:{x:0,y:0},scrollAfter:{x:0,y:68},scrollOperations:1,
  feedbackIdle:true,foreignContentHits:0,cssWrites:0,domWrites:0,viewportChanges:0,compositeImageCreated:false,
  tiles:screenshots.map((s,i)=>({tileIndex:i+1,relativeInterval:[i*68,i*68+100],filename:s.path,clip:{x:0,y:0,width:100,height:100},scroll:{x:0,y:i*68},scrollOperations:i,feedbackIdle:true,obstructionsIntersectingClip:0,foreignContentHits:0,hitTestSamples:20,domSha256:dom}))};
 const row={questionUid:mod.M2_E017_RHS_UID,sourceOrdinal:2,surface:'SOLUTION',mode:'sol',viewport,sourceRef,assetRefs,status:'PASS',fonts:{ready:true,expectedFamilyLoaded:true,responseInventorySha256:sha('SYNTHETIC FONTS')},capture,screenshots};
 const technical={schemaVersion:'archive-four-slot-existing-vector-display-ui-v1',status:'TECHNICAL_PASS_VISUAL_REVIEW_PENDING',executionOwner:'GITHUB_ACTIONS_SUPPORTED_CHROME',checkoutCommit:sourceRef.commit,sourceOverlayCount:0,domWrites:0,cssWrites:0,expectedLogicalCases:1,completedLogicalCases:1,screenshotArtifactCount:2,screenshotArtifacts:screenshots.map(({tileIndex,...x})=>x),results:[row]};
 const visual={schemaVersion:'archive-independent-four-slot-display-ui-review-v1',reviewer:'SYNTHETIC_SEPARATE_REVIEWER',decision:'ACCEPT_DISPLAY_CONTINUITY_ONLY',technicalRef,newMathQa:0,newSemanticApproval:0,newFourSlotVector:0,records:[{questionUid:row.questionUid,sourceOrdinal:2,surface:'SOLUTION',viewport,captureSha256:sha(stable(capture)),decision:'ACCEPT_DISPLAY_CONTINUITY_ONLY',screenshots:screenshots.map(x=>({...x,decision:'ACCEPT_DISPLAY_CONTINUITY_ONLY'}))}]};
 return{technical,visual,technicalRef,readRef:()=>Buffer.from('SYNTHETIC IMMUTABLE REF READER'),questionUid:row.questionUid,sourceOrdinal:2,surface:'SOLUTION',sourceRef,assetRefs};
}
test('one logical solution case retains both original scroll tiles',async()=>{await ready;const f=uiFixture(),before=clone(f.technical);assert.deepEqual(mod.verifyE017SolutionUi(f),{logicalCases:1,originalTiles:2});assert.deepEqual(f.technical,before);});
for(const[name,mutate]of[
 ['technical PASS without independent acceptance',f=>f.visual.decision='PENDING'],
 ['producer also reviewer',f=>f.visual.reviewer=f.technical.executionOwner],
 ['new math approval',f=>f.visual.newMathQa=1],
 ['missing final original tile',f=>f.visual.records[0].screenshots.pop()],
 ['wrong screenshot digest',f=>f.visual.records[0].screenshots[1].sha256='f'.repeat(64)],
 ['incomplete coverage',f=>f.technical.results[0].capture.coverage.complete=false],
 ['wrong overlap',f=>f.technical.results[0].capture.overlapCssPixels=0],
 ['zero-based tiles',f=>f.technical.results[0].capture.tiles[0].tileIndex=0],
 ['hidden obstruction',f=>f.technical.results[0].capture.tiles[0].obstructionsIntersectingClip=1],
 ['foreign content',f=>f.technical.results[0].capture.foreignContentHits=1],
 ['DOM changes',f=>f.technical.results[0].capture.domWrites=1],
 ['font unavailable',f=>f.technical.results[0].fonts.expectedFamilyLoaded=false],
 ['viewport changed',f=>f.technical.results[0].viewport.width=1365],
 ['problem-only capture',f=>f.technical.results[0].surface='PROBLEM'],
 ['foreign logical case',f=>{f.technical.results.push(clone(f.technical.results[0]));f.technical.expectedLogicalCases=2;f.technical.completedLogicalCases=2;}],
 ['missing asset',f=>f.technical.results[0].assetRefs=[]],
 ['different current source',f=>f.sourceRef={...f.sourceRef,gitBlobSha1:'c'.repeat(40)}],
 ['two-child solution exception',f=>f.technical.results[0].capture.visibleChildren=2],
 ['single-image alias',f=>f.technical.results[0].screenshot=f.technical.results[0].screenshots[0]],
])test('solution UI refuses '+name,async()=>{await ready;const f=uiFixture();mutate(f);assert.throws(()=>mod.verifyE017SolutionUi(f),/E017_RHS|EXISTING_VECTOR_UI/);});

function bindingFixture(){
 const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:'synthetic-e017',scope:'PARTIAL_UIDS',approval:{type:'FINAL_QA',metadataReviewed:true},sourceArchiveFile:mod.M2_E017_RHS_SOURCE,expectedSourceBlobSha1:'a'.repeat(40),expectedQuestionCount:23,items:[{questionUid:mod.M2_E017_RHS_UID,sourceOrdinal:2,sourceReview:{e017RhsContinuity:{schemaVersion:mod.M2_E017_RHS_SCHEMA}}}]};
 return{request,requestId:request.requestId,requestSha256:sha(stable(request)),sourceArchiveFile:request.sourceArchiveFile,sourceBlobSha1:request.expectedSourceBlobSha1,sourceRawSha256:'b'.repeat(64),scope:'PARTIAL_UIDS',expectedQuestionCount:23,partialUidCount:1,fingerprintRepairs:[{questionUid:mod.M2_E017_RHS_UID,sourceOrdinal:2,sourceReview:{schemaVersion:'archive-reviewed-source-reassessment-v1',questionUid:mod.M2_E017_RHS_UID,sourceOrdinal:2,e017RhsContinuity:{schemaVersion:mod.M2_E017_RHS_SCHEMA}}}]};
}
test('the named contract gets a durable typed sidecar record',async()=>{await ready;const x=binding.buildReviewedSourceBinding(bindingFixture());assert.equal(x.sourceReviewUidCount,1);assert.equal(x.records[0].questionUid,mod.M2_E017_RHS_UID);});
test('deleting the issued named proof cannot build its typed sidecar',async()=>{await ready;const f=bindingFixture();delete f.fingerprintRepairs[0].sourceReview.e017RhsContinuity;assert.throws(()=>binding.buildReviewedSourceBinding(f),/exact selected fingerprint repair/);});
test('removing the explicit request cannot create an ordinary sidecar fallback',async()=>{await ready;const f=bindingFixture();delete f.request.items[0].sourceReview.e017RhsContinuity;f.requestSha256=sha(stable(f.request));assert.throws(()=>binding.buildReviewedSourceBinding(f),/exact explicit source-review UID inventory/);});
for(const prior of [null,{content:'old synthetic cursor'},{content:'caught-up synthetic cursor'}])test('old or caught-up cursor cannot use a self-claimed proof without issued sidecar',async()=>{await ready;const r={sourceArchiveFile:mod.M2_E017_RHS_SOURCE,approval:{},fingerprintRepairs:[{questionUid:mod.M2_E017_RHS_UID,sourceOrdinal:2,sourceReview:{e017RhsContinuity:{schemaVersion:mod.M2_E017_RHS_SCHEMA,questionUid:mod.M2_E017_RHS_UID,sourceOrdinal:2,sourceArchiveFile:mod.M2_E017_RHS_SOURCE,memoryOnlyNormalization:true,newMathematicalQa:false,newMetadataApprovals:0,newDifficultyJudgments:0,newReview2Claims:0,sourceWrites:0,rendererWrites:0,nativeReviewedQuestionSha256:sha(stable(prior))}}}]};assert.equal(reuse.nativeReviewedE017RhsRebind(r,{},prior,{}, {questionUid:mod.M2_E017_RHS_UID},2,{},{}),false);});

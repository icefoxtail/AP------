const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const sha=v=>crypto.createHash('sha256').update(v).digest('hex'),clone=v=>JSON.parse(JSON.stringify(v));
let mod;const ready=import('../archive/tools/meta-foundation/reviewed-m2-e023-solution-display-continuity.mjs').then(m=>mod=m);
const fields=['solutionImage','solutionImageAlt','solutionImageCaption'];
const prop=(q,k)=>Object.hasOwn(q,k)?{present:true,value:q[k]}:{present:false};
const fieldHash=(q,k)=>Object.hasOwn(q,k)?{present:true,valueSha256:sha(stable(q[k]))}:{present:false};
const displayHash=q=>sha(stable(Object.fromEntries(fields.map(k=>[k,prop(q,k)]))));
function sealTransition(f){f.transition={beforeDisplaySha256:displayHash(f.original),afterDisplaySha256:displayHash(f.current),fieldTransitions:fields.map(field=>({field,before:fieldHash(f.original,field),after:fieldHash(f.current,field)}))};return f;}
function transition(){
 const original={content:'SYNTHETIC problem',answer:'SYNTHETIC unchanged answer',solution:'SYNTHETIC unchanged explanation',solutionImage:'assets/images/synthetic-old.svg',solutionImageAlt:'SYNTHETIC old alternative',solutionImageCaption:'SYNTHETIC old caption'};
 const current={...original,solutionImage:'assets/images/synthetic-new.svg',solutionImageAlt:'SYNTHETIC new alternative',solutionImageCaption:'SYNTHETIC new caption'};
 return sealTransition({original,prior:clone(original),reviewed:clone(current),current});
}
test('the pure comparison verifies exactly three owned fields and never edits input',async()=>{
 await ready;const f=transition(),before=clone(f);assert.deepEqual(mod.verifyE023OwnedDisplayTransition(f),f.transition);assert.deepEqual(f,before);
});
test('explicit own-absence is distinct from null in a separately bound synthetic transition',async()=>{
 await ready;const f=transition();delete f.original.solutionImageCaption;delete f.prior.solutionImageCaption;sealTransition(f);
 assert.deepEqual(mod.verifyE023OwnedDisplayTransition(f),f.transition);f.prior.solutionImageCaption=null;
 assert.throws(()=>mod.verifyE023OwnedDisplayTransition(f),/EXACT_DISPLAY_TRANSITION/);
});
for(const [name,mutate] of [
 ['missing owned field',f=>delete f.current.solutionImageAlt],
 ['own null image',f=>f.current.solutionImage=null],
 ['own undefined caption',f=>f.current.solutionImageCaption=undefined],
 ['empty caption',f=>f.current.solutionImageCaption=''],
 ['whitespace alternative',f=>f.current.solutionImageAlt=' '],
 ['array alternative',f=>f.current.solutionImageAlt=[]],
 ['unknown transition key',f=>f.transition.allow=true],
 ['missing field binding',f=>f.transition.fieldTransitions.pop()],
 ['duplicate field binding',f=>f.transition.fieldTransitions[2]=clone(f.transition.fieldTransitions[0])],
 ['reordered field binding',f=>f.transition.fieldTransitions.reverse()],
 ['extra normalization field',f=>f.transition.fieldTransitions.push({field:'solution',before:{present:false},after:{present:false}})],
 ['own-presence unknown key',f=>f.transition.fieldTransitions[0].before.allow=true],
 ['false absence with a value hash',f=>{f.transition.fieldTransitions[0].after.present=false;}],
 ['nonboolean presence',f=>f.transition.fieldTransitions[0].before.present=1],
 ['changed value hash',f=>f.transition.fieldTransitions[0].after.valueSha256='f'.repeat(64)],
 ['changed aggregate hash',f=>f.transition.afterDisplaySha256='f'.repeat(64)],
 ['malformed aggregate hash',f=>f.transition.beforeDisplaySha256='invalid'],
 ['current field beyond the signed reviewed value',f=>{f.current.solutionImageCaption+=' altered';sealTransition(f);}],
 ['prior value not present in original native source',f=>{f.prior.solutionImageAlt+=' altered';}],
 ['rewritten original value and resealed hashes',f=>{f.original.solutionImageAlt+=' altered';sealTransition(f);}],
 ['new null made into matching hash',f=>{f.current.solutionImageAlt=null;f.reviewed.solutionImageAlt=null;sealTransition(f);}],
 ['nonstring made into matching hash',f=>{f.current.solutionImage=7;f.reviewed.solutionImage=7;sealTransition(f);}],
])test('owned display comparison rejects '+name,async()=>{
 await ready;const f=transition();mutate(f);assert.throws(()=>mod.verifyE023OwnedDisplayTransition(f),/E023_SOLUTION_DISPLAY_CONTINUITY:/);
});
for(const key of ['answer','solution'])for(const stage of ['prior','reviewed','current'])for(const kind of ['replace','delete','null'])
 test(`display authority cannot ${kind} ${stage} ${key}`,async()=>{
  await ready;const f=transition();if(kind==='delete')delete f[stage][key];else f[stage][key]=kind==='null'?null:'SYNTHETIC changed';
  sealTransition(f);assert.throws(()=>mod.verifyE023OwnedDisplayTransition(f),/ANSWER_OR_SOLUTION_BODY_CHANGED/);
 });

function early(){return {root:'/must-not-read-before-guard',request:{scope:'PARTIAL_UIDS',approval:{type:'FINAL_QA',metadataReviewed:true},registryChanges:[],sourceArchiveFile:mod.E023_SOLUTION_DISPLAY_SOURCE,expectedQuestionCount:24},patch:{questionUid:mod.E023_SOLUTION_DISPLAY_SCOPE[0].questionUid,sourceOrdinal:4,sourceReview:{schemaVersion:'archive-reviewed-source-reassessment-v1',reviewCommit:'c28641f67d91bfb27352b11faaef4552f46c45be',reviewPath:'archive/data/meta-review/m2-s2-20261114/exams/E023/review.json',reviewRef:{path:'native.json',sha256:'7da03aa90ef0e8e7f363dab0e8dc482291683471a6087cde27c650fa4abc6e07'},e023SolutionDisplayContinuity:{schemaVersion:mod.E023_SOLUTION_DISPLAY_SCHEMA,reviewCommit:'a'.repeat(40),reviewRef:{path:'binding.json',sha256:'b'.repeat(64)}}}},native:{review:{schemaVersion:'SYNTHETIC_NOT_AN_AUTHORITY'},spec:{}}};}
const publicOption=()=>({schemaVersion:'archive-reviewed-m2-problem21-continuity-v1',reviewCommit:'a'.repeat(40),reviewRef:{path:'public-binding.json',sha256:'b'.repeat(64)}});
test('absent opt-in preserves the ordinary route without reading Git or sources',async()=>{await ready;assert.equal(mod.validateM2E023SolutionDisplayContinuity({patch:{sourceReview:{}}}),null);});
for(const v of [null,undefined,false,[],{}])test('an own invalid opt-in cannot fall back to ordinary approval: '+String(v),async()=>{await ready;assert.throws(()=>mod.validateM2E023SolutionDisplayContinuity({patch:{sourceReview:{e023SolutionDisplayContinuity:v}}}),/OPT_IN_KEYS/);});
for(const [name,mutate,pattern] of [
 ['foreign UID',x=>x.patch.questionUid='qid_v1_'+'f'.repeat(64),/EXCLUSIVE_UID_SCOPE/],
 ['foreign ordinal',x=>x.patch.sourceOrdinal=3,/EXCLUSIVE_UID_SCOPE/],
 ['swapped valid UID and ordinal',x=>x.patch.questionUid=mod.E023_SOLUTION_DISPLAY_SCOPE[1].questionUid,/EXCLUSIVE_UID_SCOPE/],
 ['foreign source',x=>x.request.sourceArchiveFile='original/foreign.js',/EXCLUSIVE_UID_SCOPE/],
 ['denominator 23',x=>x.request.expectedQuestionCount=23,/EXCLUSIVE_UID_SCOPE/],
 ['full-bank scope',x=>x.request.scope='FULL_EXAM',/EXCLUSIVE_UID_SCOPE/],
 ['REVIEW2 approval',x=>x.request.approval.type='REVIEW2',/EXCLUSIVE_UID_SCOPE/],
 ['metadata not reviewed',x=>x.request.approval.metadataReviewed=false,/EXCLUSIVE_UID_SCOPE/],
 ['source rebind',x=>x.request.approval.sourceRebind={},/EXCLUSIVE_UID_SCOPE/],
 ['own-null source rebind',x=>x.request.approval.sourceRebind=null,/EXCLUSIVE_UID_SCOPE/],
 ['item rebind',x=>x.patch.rebind={},/EXCLUSIVE_UID_SCOPE/],
 ['own-null item rebind',x=>x.patch.rebind=null,/EXCLUSIVE_UID_SCOPE/],
 ['identity registration',x=>x.request.registrationMode='IDENTITY_FINGERPRINT_ONLY',/EXCLUSIVE_UID_SCOPE/],
 ['own-null registration',x=>x.request.registrationMode=null,/EXCLUSIVE_UID_SCOPE/],
 ['registry mutation',x=>x.request.registryChanges=[{}],/EXCLUSIVE_UID_SCOPE/],
 ['missing registry inventory',x=>delete x.request.registryChanges,/EXCLUSIVE_UID_SCOPE/],
 ['registry null',x=>x.request.registryChanges=null,/EXCLUSIVE_UID_SCOPE/],
 ['wrong private schema',x=>x.patch.sourceReview.e023SolutionDisplayContinuity.schemaVersion='foreign',/EXCLUSIVE_UID_SCOPE/],
 ['extra opt-in key',x=>x.patch.sourceReview.e023SolutionDisplayContinuity.allow=true,/OPT_IN_KEYS/],
 ['bad review commit',x=>x.patch.sourceReview.e023SolutionDisplayContinuity.reviewCommit='main',/OPT_IN/],
 ['unhashed binding',x=>delete x.patch.sourceReview.e023SolutionDisplayContinuity.reviewRef.sha256,/BOUND_REF/],
 ['fixed-three legacy renderer',x=>x.patch.sourceReview.m2ProblemRendererContinuity={},/CLOSED_SOURCE_REVIEW/],
 ['generic renderer',x=>x.patch.sourceReview.rendererProof={},/CLOSED_SOURCE_REVIEW/],
 ['E017 opt-in',x=>x.patch.sourceReview.e017RhsContinuity={},/CLOSED_SOURCE_REVIEW/],
 ['family opt-in',x=>x.patch.sourceReview.familyProof={},/CLOSED_SOURCE_REVIEW/],
 ['third opt-in',x=>{x.patch.sourceReview.m2ProblemRenderer21Continuity=publicOption();x.patch.sourceReview.rationaleContinuity={};},/CLOSED_SOURCE_REVIEW/],
 ['unknown sourceReview key',x=>x.patch.sourceReview.allow=true,/CLOSED_SOURCE_REVIEW/],
 ['own-null public opt-in',x=>x.patch.sourceReview.m2ProblemRenderer21Continuity=null,/OPT_IN_KEYS/],
 ['own-undefined public opt-in',x=>x.patch.sourceReview.m2ProblemRenderer21Continuity=undefined,/OPT_IN_KEYS/],
 ['public unknown option',x=>{x.patch.sourceReview.m2ProblemRenderer21Continuity={...publicOption(),allow:true};},/OPT_IN_KEYS/],
 ['public wrong schema',x=>{x.patch.sourceReview.m2ProblemRenderer21Continuity={...publicOption(),schemaVersion:'foreign'};},/PUBLIC_OPT_IN_SCHEMA/],
])test('named six-item opt-in rejects '+name+' before filesystem access',async()=>{await ready;const x=early();mutate(x);assert.throws(()=>mod.validateM2E023SolutionDisplayContinuity(x),pattern);});
test('a valid public companion does not relax original native authority',async()=>{await ready;const x=early();x.patch.sourceReview.m2ProblemRenderer21Continuity=publicOption();assert.throws(()=>mod.validateM2E023SolutionDisplayContinuity(x),/ORIGINAL_NATIVE_AUTHORITY/);});
test('private-only mode still requires original native authority',async()=>{await ready;assert.throws(()=>mod.validateM2E023SolutionDisplayContinuity(early()),/ORIGINAL_NATIVE_AUTHORITY/);});

function uiFixture(){
 const ref=p=>({commit:'a'.repeat(40),path:p,gitBlobSha1:'b'.repeat(40),sha256:sha(p),bytes:100});
 const sourceRef=ref('archive/exams/synthetic.js'),technicalRef=ref('docs/technical.json');
 const results=mod.E023_SOLUTION_DISPLAY_SCOPE.map(({questionUid,sourceOrdinal})=>{
  const viewport={name:'desktop',width:1440,height:1000},dom=sha('SYNTHETIC DOM '+sourceOrdinal);
  const screenshots=[1,2].map(tileIndex=>({tileIndex,path:`synthetic-q${sourceOrdinal}-${tileIndex}.png`,sha256:sha(`SYNTHETIC PNG ${sourceOrdinal} ${tileIndex}`),bytes:100+tileIndex}));
  const capture={schemaVersion:'archive-solution-scroll-coverage-v1',method:'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES',tileLimit:8,tileCount:2,overlapCssPixels:32,
   content:{x:0,y:0,width:100,height:168},question:{x:0,y:0,width:100,height:188},viewport:{width:1440,height:1000},visibleChildren:4,
   coverage:{requiredInterval:[0,168],coveredInterval:[0,168],complete:true},domSha256:dom,scrollBefore:{x:0,y:0},scrollAfter:{x:0,y:68},scrollOperations:1,
   feedbackIdle:true,foreignContentHits:0,cssWrites:0,domWrites:0,viewportChanges:0,compositeImageCreated:false,
   tiles:screenshots.map((s,i)=>({tileIndex:i+1,relativeInterval:[i*68,i*68+100],filename:s.path,clip:{x:0,y:0,width:100,height:100},scroll:{x:0,y:i*68},scrollOperations:i,
    feedbackIdle:true,obstructionsIntersectingClip:0,foreignContentHits:0,hitTestSamples:20,domSha256:dom}))};
  return{questionUid,sourceOrdinal,surface:'SOLUTION',mode:'sol',viewport,sourceRef,assetRefs:[ref(`archive/assets/images/synthetic-q${sourceOrdinal}.svg`)],status:'PASS',
   fonts:{ready:true,expectedFamilyLoaded:true,responseInventorySha256:sha('SYNTHETIC FONTS')},capture,screenshots};
 });
 const technical={schemaVersion:'archive-four-slot-existing-vector-display-ui-v1',status:'TECHNICAL_PASS_VISUAL_REVIEW_PENDING',executionOwner:'GITHUB_ACTIONS_SUPPORTED_CHROME',checkoutCommit:sourceRef.commit,
  sourceOverlayCount:0,domWrites:0,cssWrites:0,expectedLogicalCases:6,completedLogicalCases:6,screenshotArtifactCount:12,screenshotArtifacts:results.flatMap(r=>r.screenshots.map(({tileIndex,...s})=>s)),results};
 const visual={schemaVersion:'archive-independent-four-slot-display-ui-review-v1',reviewer:'SYNTHETIC_INDEPENDENT_REVIEWER',decision:'ACCEPT_DISPLAY_CONTINUITY_ONLY',technicalRef,
  newMathQa:0,newSemanticApproval:0,newFourSlotVector:0,records:results.map(r=>({questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,surface:r.surface,viewport:r.viewport,
   captureSha256:sha(stable(r.capture)),decision:'ACCEPT_DISPLAY_CONTINUITY_ONLY',screenshots:r.screenshots.map(s=>({...s,decision:'ACCEPT_DISPLAY_CONTINUITY_ONLY'}))}))};
 return{technical,visual,technicalRef,readRef:()=>Buffer.from('SYNTHETIC ONLY, NO PRODUCTION AUTHORITY'),questionUid:results[0].questionUid,sourceOrdinal:4,surface:'SOLUTION',sourceRef,assetRefs:results[0].assetRefs};
}
test('six exact logical solutions require all twelve synthetic original tiles',async()=>{await ready;const f=uiFixture(),before=clone(f.technical);assert.deepEqual(mod.verifyE023SolutionUi(f),{logicalCases:1,originalTiles:2});assert.deepEqual(f.technical,before);});
test('all six selectable solutions retain their own original tiles',async()=>{await ready;const f=uiFixture();for(const row of f.technical.results)assert.deepEqual(mod.verifyE023SolutionUi({...f,questionUid:row.questionUid,sourceOrdinal:row.sourceOrdinal,sourceRef:row.sourceRef,assetRefs:row.assetRefs}),{logicalCases:1,originalTiles:2});});
for(const [name,mutate] of [
 ['technical PASS without visual acceptance',f=>f.visual.decision='PENDING'],
 ['visual author is technical producer',f=>f.visual.reviewer=f.technical.executionOwner],
 ['new math approval',f=>f.visual.newMathQa=1],
 ['new semantic approval',f=>f.visual.newSemanticApproval=1],
 ['new four-slot vector',f=>f.visual.newFourSlotVector=1],
 ['missing another solution visual decision',f=>f.visual.records.pop()],
 ['reordered UID inventory',f=>f.technical.results.reverse()],
 ['duplicate UID inventory',f=>f.technical.results[5]=clone(f.technical.results[0])],
 ['foreign selected UID',f=>f.questionUid='qid_v1_'+'f'.repeat(64)],
 ['wrong selected ordinal',f=>f.sourceOrdinal=5],
 ['partial-five inventory',f=>{f.technical.results.pop();f.technical.expectedLogicalCases=5;f.technical.completedLogicalCases=5;}],
 ['injected seventh inventory',f=>{f.technical.results.push(clone(f.technical.results[0]));f.technical.expectedLogicalCases=7;f.technical.completedLogicalCases=7;}],
 ['mixed problem capture',f=>f.technical.results[0].surface='PROBLEM'],
 ['wrong surface at invocation',f=>f.surface='PROBLEM'],
 ['wrong mode',f=>f.technical.results[0].mode='exam'],
 ['missing unselected original tile',f=>f.visual.records[5].screenshots.pop()],
 ['changed unselected screenshot hash',f=>f.visual.records[5].screenshots[1].sha256='f'.repeat(64)],
 ['missing global artifact',f=>f.technical.screenshotArtifacts.pop()],
 ['extra global artifact',f=>f.technical.screenshotArtifacts.push({path:'extra.png',sha256:'f'.repeat(64),bytes:10})],
 ['single-screenshot alias',f=>f.technical.results[0].screenshot=f.technical.results[0].screenshots[0]],
 ['incomplete coverage',f=>f.technical.results[5].capture.coverage.complete=false],
 ['wrong overlap',f=>f.technical.results[0].capture.overlapCssPixels=0],
 ['zero-based tiles',f=>f.technical.results[0].capture.tiles[0].tileIndex=0],
 ['hidden obstruction',f=>f.technical.results[0].capture.tiles[0].obstructionsIntersectingClip=1],
 ['foreign content',f=>f.technical.results[0].capture.foreignContentHits=1],
 ['DOM changes',f=>f.technical.results[0].capture.domWrites=1],
 ['CSS changes',f=>f.technical.results[0].capture.cssWrites=1],
 ['viewport changes',f=>f.technical.results[0].capture.viewportChanges=1],
 ['source overlay',f=>f.technical.sourceOverlayCount=1],
 ['font unavailable',f=>f.technical.results[5].fonts.expectedFamilyLoaded=false],
 ['fonts not ready',f=>f.technical.results[0].fonts.ready=false],
 ['viewport width changed',f=>f.technical.results[0].viewport.width=1365],
 ['missing asset',f=>f.technical.results[0].assetRefs=[]],
 ['duplicate asset',f=>f.technical.results[0].assetRefs.push(clone(f.technical.results[0].assetRefs[0]))],
 ['capture source from another commit',f=>f.technical.results[0].sourceRef={...f.sourceRef,commit:'c'.repeat(40)}],
 ['different selected source bytes',f=>f.sourceRef={...f.sourceRef,gitBlobSha1:'c'.repeat(40)}],
 ['different selected asset bytes',f=>f.assetRefs=[{...f.assetRefs[0],gitBlobSha1:'c'.repeat(40)}]],
 ['two-child solution exception',f=>f.technical.results[0].capture.visibleChildren=2],
 ['forged visual capture hash',f=>f.visual.records[0].captureSha256='f'.repeat(64)],
 ['visual tile decision HOLD',f=>f.visual.records[0].screenshots[0].decision='HOLD'],
])test('solution-six UI rejects '+name,async()=>{await ready;const f=uiFixture();mutate(f);assert.throws(()=>mod.verifyE023SolutionUi(f),/E023_SOLUTION_DISPLAY_CONTINUITY:|EXISTING_VECTOR_UI_/);});

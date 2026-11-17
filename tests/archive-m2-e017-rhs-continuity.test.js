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
for(const prior of [null,{content:'old synthetic cursor'},{content:'caught-up synthetic cursor'}])test('old or caught-up cursor cannot use a self-claimed proof without issued sidecar',async()=>{await ready;const r={sourceArchiveFile:mod.M2_E017_RHS_SOURCE,expectedQuestionCount:23,approval:{},fingerprintRepairs:[{questionUid:mod.M2_E017_RHS_UID,sourceOrdinal:2,sourceReview:{e017RhsContinuity:{schemaVersion:mod.M2_E017_RHS_SCHEMA,questionUid:mod.M2_E017_RHS_UID,sourceOrdinal:2,sourceArchiveFile:mod.M2_E017_RHS_SOURCE,memoryOnlyNormalization:true,newMathematicalQa:false,newMetadataApprovals:0,newDifficultyJudgments:0,newReview2Claims:0,sourceWrites:0,rendererWrites:0,nativeReviewedQuestionSha256:sha(stable(prior))}}}]};assert.equal(reuse.nativeReviewedE017RhsRebind(r,{},prior,{}, {questionUid:mod.M2_E017_RHS_UID},2,{},{}),false);});

// Run the exact production history reader and caller against synthetic Git
// responses. Only the immutable data pins and external I/O are substituted;
// the bank parser, mode/OID/raw/bytes checks and caller ordering are unmodified.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const reuseSource=fs.readFileSync(path.join(__dirname,'../archive/tools/meta-foundation/native-reviewed-source-reuse.mjs'),'utf8');
const cursorConstants=reuseSource.slice(reuseSource.indexOf('const E017_RHS_CURSOR_SOURCE ='),reuseSource.indexOf('function matchesE017RhsHistoricalCursor('));
const cursorFunction=reuseSource.slice(reuseSource.indexOf('function matchesE017RhsHistoricalCursor('),reuseSource.indexOf('\n// The one reviewed solution line'));
const rebindFunction=reuseSource.slice(reuseSource.indexOf('export function nativeReviewedE017RhsRebind('),reuseSource.indexOf('\n// Historical cursor inputs only.')).replace(/^export /,'');
const pinnedCursor=Function(cursorConstants+'\nreturn {ref:E017_RHS_CURSOR_SOURCE,questionSha256:E017_RHS_CURSOR_QUESTION_SHA256};')();
test('the historical context is exactly the observed one-UID pending source, not an approval',()=>{
 assert.deepEqual(pinnedCursor,{ref:{commit:'d511d4f82d3da2224cc43f8ff26f30469b436af3',path:'archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js',gitBlobSha1:'a6a8419ba3ea9b6e271b57c34b920088277dc226',sha256:'916dd50a26c8ca09fc87d67012d70f0a410d4eb3803ba844b46969f63df6b687',bytes:66448},questionSha256:'20a99cd2a1363d44ad9033982102491aff790ef4fe5b187f07bb04dfaa476a51'});
 assert(Object.isFrozen(pinnedCursor.ref));
});
const gitBlob=b=>crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
function cursorFixture(){
 const bank=Array.from({length:23},(_,i)=>({id:i+1,content:'SYNTHETIC QUESTION '+(i+1)}));
 const raw=Buffer.from('window.questionBank = '+JSON.stringify(bank)+';\n');
 return{bank,raw,previous:clone(bank[1]),questionSha256:sha(stable(bank[1])),ref:{...pinnedCursor.ref,gitBlobSha1:gitBlob(raw),sha256:sha(raw),bytes:raw.length},calls:[],typedCalls:0,typed:true};
}
function resealCursor(f,text){f.raw=Buffer.from(text);f.ref={...f.ref,gitBlobSha1:gitBlob(f.raw),sha256:sha(f.raw),bytes:f.raw.length};}
function isolatedCursorReader(f){
 const execFileSync=(command,args,options)=>{
  assert.equal(command,'git');assert.equal(options.env.GIT_NO_LAZY_FETCH,'1');assert.equal(options.env.GIT_OPTIONAL_LOCKS,'0');
  assert.equal(options.cwd,fs.realpathSync(__dirname));f.calls.push(args);
  if(args[0]==='ls-tree'){
   assert.deepEqual(args,['ls-tree','-z',f.ref.commit,'--',f.ref.path]);
   if(f.treeError)throw Error('SYNTHETIC IMMUTABLE TREE UNAVAILABLE');
   return Buffer.from(f.treeEntry??`100644 blob ${f.ref.gitBlobSha1}\t${f.ref.path}\0`);
  }
  assert.deepEqual(args,['cat-file','blob',f.ref.gitBlobSha1]);
  if(f.blobError)throw Error('SYNTHETIC IMMUTABLE BLOB UNAVAILABLE');
  return f.raw;
 };
 return Function('fs','execFileSync','sha','blob','vm','stable','E017_RHS_CURSOR_SOURCE','E017_RHS_CURSOR_QUESTION_SHA256',cursorFunction+'\nreturn matchesE017RhsHistoricalCursor;')(
  fs,execFileSync,sha,gitBlob,vm,stable,f.ref,f.questionSha256);
}
function invokeCursor(f,mutate){
 const proof={schemaVersion:mod.M2_E017_RHS_SCHEMA,questionUid:mod.M2_E017_RHS_UID,sourceOrdinal:2,sourceArchiveFile:mod.M2_E017_RHS_SOURCE,memoryOnlyNormalization:true,newMathematicalQa:false,newMetadataApprovals:0,newDifficultyJudgments:0,newReview2Claims:0,sourceWrites:0,rendererWrites:0};
 const receipt={sourceArchiveFile:mod.M2_E017_RHS_SOURCE,expectedQuestionCount:23,approval:{},fingerprintRepairs:[{questionUid:mod.M2_E017_RHS_UID,sourceOrdinal:2,sourceReview:{e017RhsContinuity:proof}}]};
 const input={receipt,nativeSource:{root:__dirname},previous:f.previous,question:{content:'SYNTHETIC CURRENT'},identity:{questionUid:mod.M2_E017_RHS_UID},ordinal:2,current:{},registry:{}};
 if(mutate)mutate(input,proof);
 const validate=()=>{f.typedCalls++;if(f.typedError)throw Error('SYNTHETIC TYPED AUTHORITY REFUSED');return f.typed;};
 const call=Function('M2_E017_RHS_UID','M2_E017_RHS_SOURCE','M2_E017_RHS_SCHEMA','SHA256','validateNativeReviewedSourceReuse','sha','stable','matchesE017RhsHistoricalCursor',rebindFunction+'\nreturn nativeReviewedE017RhsRebind;')(
  mod.M2_E017_RHS_UID,mod.M2_E017_RHS_SOURCE,mod.M2_E017_RHS_SCHEMA,/^[a-f0-9]{64}$/,validate,sha,stable,isolatedCursorReader(f));
 return call(input.receipt,input.nativeSource,input.previous,input.question,input.identity,input.ordinal,input.current,input.registry);
}
test('an issued current authority may recognize its exact complete old cursor',async()=>{await ready;const f=cursorFixture();assert.equal(invokeCursor(f),true);assert.equal(f.typedCalls,1);assert.equal(f.calls.length,2);});
for(const[name,change]of[
 ['executable mode',f=>f.treeEntry=`100755 blob ${f.ref.gitBlobSha1}\t${f.ref.path}\0`],
 ['symlink mode',f=>f.treeEntry=`120000 blob ${f.ref.gitBlobSha1}\t${f.ref.path}\0`],
 ['different tree path',f=>f.treeEntry=`100644 blob ${f.ref.gitBlobSha1}\tarchive/exams/foreign.js\0`],
 ['different tree OID',f=>f.treeEntry=`100644 blob ${'f'.repeat(40)}\t${f.ref.path}\0`],
 ['extra tree entry',f=>f.treeEntry=`100644 blob ${f.ref.gitBlobSha1}\t${f.ref.path}\0extra\0`],
 ['missing tree',f=>f.treeError=true],['missing blob',f=>f.blobError=true],
 ['different raw bytes',f=>f.raw=Buffer.concat([f.raw,Buffer.from(' ')])],
 ['wrong byte count',f=>f.ref.bytes++],['wrong raw hash',f=>f.ref.sha256='f'.repeat(64)],
 ['wrong Git blob hash',f=>f.ref.gitBlobSha1='f'.repeat(40)],
 ['resealed smaller denominator',f=>resealCursor(f,'window.questionBank = '+JSON.stringify(f.bank.slice(0,22))+';')],
 ['resealed larger denominator',f=>resealCursor(f,'window.questionBank = '+JSON.stringify([...f.bank,{id:24}])+';')],
 ['resealed selected question change',f=>{f.bank[1].content+=' CHANGED';resealCursor(f,'window.questionBank = '+JSON.stringify(f.bank)+';');}],
 ['previous whole-question change',f=>f.previous.extra=true],
 ['wrong historical ordinal',f=>f.previous=clone(f.bank[2])],
 ['non-bank source',f=>resealCursor(f,'window.questionBank = {};')],
 ['VM window host escape',f=>resealCursor(f,'window.constructor.constructor("return process")();window.questionBank = '+JSON.stringify(f.bank)+';')],
 ['VM console host escape',f=>resealCursor(f,'console.log.constructor("return process")();window.questionBank = '+JSON.stringify(f.bank)+';')],
])test('historical input refuses '+name,async()=>{await ready;const f=cursorFixture();change(f);assert.equal(invokeCursor(f),false);assert.equal(f.typedCalls,1);});
for(const[name,mutate]of[
 ['foreign UID',x=>x.identity.questionUid='qid_v1_'+'f'.repeat(64)],
 ['foreign ordinal',x=>x.ordinal=3],['foreign source',x=>x.receipt.sourceArchiveFile='original/foreign.js'],
 ['wrong request denominator',x=>x.receipt.expectedQuestionCount=24],
 ['source rebind',x=>x.receipt.approval.sourceRebind={}],['null source rebind',x=>x.receipt.approval.sourceRebind=null],
 ['missing named proof',x=>delete x.receipt.fingerprintRepairs[0].sourceReview.e017RhsContinuity],
 ['duplicate selected repair',x=>x.receipt.fingerprintRepairs.push(clone(x.receipt.fingerprintRepairs[0]))],
 ['false memory-only claim',(x,p)=>p.memoryOnlyNormalization=false],
 ['new mathematical approval',(x,p)=>p.newMathematicalQa=true],
 ['source write claim',(x,p)=>p.sourceWrites=1],
])test('history cannot bypass '+name,async()=>{await ready;const f=cursorFixture();assert.equal(invokeCursor(f,mutate),false);assert.equal(f.typedCalls,0);assert.equal(f.calls.length,0);});
for(const kind of ['refused','throw'])test('complete current authority '+kind+' is checked before any history read',async()=>{await ready;const f=cursorFixture();if(kind==='refused')f.typed=false;else f.typedError=true;assert.equal(invokeCursor(f),false);assert.equal(f.typedCalls,1);assert.equal(f.calls.length,0);});
test('existing issued native/current proof hashes retain their route without historical I/O',async()=>{await ready;const f=cursorFixture();assert.equal(invokeCursor(f,(_,p)=>{p.reviewedCurrentQuestionSha256=sha(stable(f.previous));}),true);assert.equal(f.typedCalls,1);assert.equal(f.calls.length,0);});

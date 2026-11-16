'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {execFileSync}=require('node:child_process');
const H=require('../tools/4slot/original-source-error-hold.cjs');
const builder=require('../tools/4slot/build-4slot-runtime.cjs');
const {pathToFileURL}=require('node:url');
const {sha,blob,stable,vector}=H;
const sourcePath='archive/exams/'+H.SOURCE,dictPath='docs/architecture/4slot/term-dictionary-v1.5.json';
const nativePath='docs/operations/synthetic-original-source/native.json';
const reviewPath='docs/operations/synthetic-original-source/root-negative-review.json';
const givenPath='docs/operations/synthetic-original-source/given.json',cropPath='docs/operations/synthetic-original-source/given.png';
const originalImage='archive/assets/images/synthetic-original-source/original.png',currentImage='archive/assets/images/synthetic-original-source/current.svg';
function fixture(t){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'original-source-hold-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const git=(args)=>execFileSync('git',['-C',root,...args],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  git(['init','-q']);git(['config','user.name','Synthetic fixture']);git(['config','user.email','fixture@example.invalid']);git(['config','gc.auto','0']);
  function write(p,obj){const b=Buffer.isBuffer(obj)?obj:Buffer.from(typeof obj==='string'?obj:JSON.stringify(obj)+'\n');const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,b);return {path:p,gitBlobSha1:blob(b),sha256:sha(b),bytes:b.length};}
  const commit=()=>{git(['add','.']);git(['commit','-qm','synthetic immutable evidence']);return git(['rev-parse','HEAD']);};
  const ref=(c,p)=>{const b=execFileSync('git',['-C',root,'show',c+':'+p]);return {commit:c,path:p,gitBlobSha1:blob(b),sha256:sha(b),bytes:b.length};};
  const uids=Array.from({length:24},(_,i)=>i===17?H.UID:'qid_v1_'+sha('fixture-uid-'+i));
  const bank=uids.map((questionUid,i)=>({id:i+1,questionUid,content:'synthetic '+(i+1),choices:[],answer:'synthetic answer',solution:'synthetic solution'}));
  bank[17].content='<img src="'+originalImage.slice(8)+'">';
  const serial=b=>'window.questionBank='+JSON.stringify(b)+';\n';
  write(sourcePath,serial(bank));write(originalImage,Buffer.from('synthetic original pixels'));
  const dictionary={dictionaryVersion:'term-dict-v1.5-2026-11-04',terms:[{id:1,ko:'fixture',status:'ACTIVE'}]};write(dictPath,dictionary);
  const native={schemaVersion:'archive-meta-4slot-v0',sourceArchiveFile:H.SOURCE,sourceGitBlobSha:blob(Buffer.from(serial(bank))),dictionaryVersion:dictionary.dictionaryVersion,
    items:uids.map((questionUid,i)=>({questionUid,sourceOrdinal:i+1,format:'단일 정답',slots:Object.fromEntries(['given','goal','method','condition'].map(k=>[k,[{term:'fixture'}]]))}))};write(nativePath,native);const nativeCommit=commit();
  const compact={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:H.SOURCE,sourceGitBlobSha:native.sourceGitBlobSha,dictionaryVersion:dictionary.dictionaryVersion,evidence:{branch:'synthetic',commit:nativeCommit,path:nativePath},reviewedBy:{agent:'synthetic-prior',at:'2026-01-01',sampled:[18]},items:uids.map((_,i)=>({ordinal:i+1,format:'단일 정답',given:[1],goal:[1],method:[1],condition:[1],candidates:[]}))};write(H.COMPACT,compact);
  const identity={records:uids.map((questionUid,i)=>({questionUid,sourceArchiveFile:H.SOURCE,sourceOrdinal:i+1,sourceQuestionNo:String(i+1),status:'VERIFIED',sourceFingerprint:sha('historical-'+i)}))};
  const metadata={records:uids.map((questionUid,i)=>({questionUid,sourceArchiveFile:H.SOURCE,sourceOrdinal:i+1,metadataStatus:'registration_pending_semantic_review',reviewStatus:'review_required',problemTypeKey:'',templateKey:''}))};write(H.ID,identity);write(H.MD,metadata);
  const rows=compact.items.map((it,i)=>({questionUid:uids[i],sourceArchiveFile:H.SOURCE,sourceOrdinal:i+1,sourceQuestionNo:String(i+1),sourceDisplayNumber:i+1,compactPath:H.COMPACT,dictionaryVersion:dictionary.dictionaryVersion,...vector(it),registrationStatus:'REGISTERED',independentReviewClaim:false}));
  const index={schemaVersion:builder.SCHEMA,authority:'MAIN_MERGED_REVIEWED_COMPACT',sourceMutation:0,semanticApprovalMutation:0,records:rows,pending:[],files:[{path:H.COMPACT,currentSourceBlobSha:native.sourceGitBlobSha,sourceGitBlobSha:native.sourceGitBlobSha,compactSha256:sha(fs.readFileSync(path.join(root,H.COMPACT))),itemCount:24,dictionarySha256:sha(fs.readFileSync(path.join(root,dictPath))),evidence:compact.evidence,reviewedBy:compact.reviewedBy}],terms:{}};write(H.INDEX,index);const priorCommit=commit();
  const current=structuredClone(bank);current[17].content='<img src="'+currentImage.slice(8)+'">';write(sourcePath,serial(current));write(currentImage,'<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/></svg>');const currentCommit=commit();
  const d={schemaVersion:H.SCHEMA,scope:H.SCOPE,status:'HOLD',questionUid:H.UID,sourceArchiveFile:H.SOURCE,sourceOrdinal:18,sourceQuestionNo:'18',expectedQuestionCount:24,
    currentSourceRef:ref(currentCommit,sourcePath),priorSourceRef:ref(priorCommit,sourcePath),nativeSourceRef:ref(nativeCommit,sourcePath),currentCompactRef:ref(currentCommit,H.COMPACT),priorCompactRef:ref(priorCommit,H.COMPACT),priorIndexRef:ref(priorCommit,H.INDEX),nativeRef:ref(nativeCommit,nativePath),dictionaryRef:ref(currentCommit,dictPath),metadataRef:ref(currentCommit,H.MD),identityRef:ref(currentCommit,H.ID),
    currentQuestionSha256:sha(stable(current[17])),priorQuestionSha256:sha(stable(bank[17])),nativeQuestionSha256:sha(stable(bank[17])),priorIndexRowSha256:sha(stable(rows[17])),vectorSha256:sha(stable(vector(compact.items[17]))),metadataRowSha256:sha(stable(metadata.records[17])),identityRowSha256:sha(stable(identity.records[17])),identityInventorySha256:sha(stable(identity.records.map(H.tuple))),currentAssets:[ref(currentCommit,currentImage)],priorAssets:[ref(priorCommit,originalImage)],reviewRef:null,releasePolicy:H.RELEASE,newMathQa:0,newSemanticApproval:0,newFourSlotVector:0};
  const crop=write(cropPath,Buffer.from('synthetic given-only crop'));
  const given={schemaVersion:H.GIVEN_SCHEMA,reviewer:'GPT_CHILD_M2S1_GIVEN3_20261116',questionUid:H.UID,sourceArchiveFile:H.SOURCE,sourceOrdinal:18,expectedQuestionCount:24,sourcePdfSha256:sha('synthetic PDF'),givenCropSha256:crop.sha256,originalContradiction:true,thirdChoiceObservable:false,observationSha256:sha('synthetic independent observation'),newMathQa:0,newSemanticApproval:0};
  let review;
  function seal(){const givenRef=write(givenPath,given);review={schemaVersion:H.REVIEW_SCHEMA,decisionId:'m2s1-e034-q18-original-contradiction-root-20261116',reviewer:'GPT_ROOT_C8F1B0BFB4FA',decision:H.DECISION,scope:H.SCOPE,bindingSha256:H.proofBinding(d),independentGiven:givenRef,originalGivenCrop:crop,observedAtUtc:'2026-11-16T00:00:00Z',observedOriginalContradiction:true,thirdChoiceObservable:false,noInferredReconstruction:true,newMathQa:0,newSemanticApproval:0,newFourSlotVector:0};write(reviewPath,review);const c=commit();d.reviewRef=ref(c,reviewPath);write(H.LEDGER,d);}
  seal();return {root,write,ref,commit,git,d,bank,current,metadata,identity,compact,index,given,seal,get review(){return review;}};
}
test('replays exact historical REGISTERED/native vector as a negative hold only',t=>{const f=fixture(t),before=fs.readFileSync(path.join(f.root,H.MD));const h=H.verify(f.root,{identity:f.identity});assert.equal(h.negativeOnly,true);assert.equal(h.projection.status,'HOLD');assert.equal(h.questionUid,H.UID);assert.equal(h.projection.newFourSlotVector,0);assert.deepEqual(fs.readFileSync(path.join(f.root,H.MD)),before);assert(H.dependencyPaths(f.root).includes(cropPath));});
for(const [name,mutate,expected] of [
  ['missing ledger',f=>fs.unlinkSync(path.join(f.root,H.LEDGER)),/LIVE_FILE/],
  ['missing root witness',f=>fs.unlinkSync(path.join(f.root,reviewPath)),/LIVE_FILE/],
  ['missing independent given',f=>fs.unlinkSync(path.join(f.root,givenPath)),/LIVE_FILE/],
  ['missing original given crop',f=>fs.unlinkSync(path.join(f.root,cropPath)),/LIVE_FILE/],
  ['changed source',f=>fs.appendFileSync(path.join(f.root,sourcePath),'\n'),/LIVE_BYTES_CHANGED/],
  ['changed current asset',f=>fs.appendFileSync(path.join(f.root,currentImage),' '),/LIVE_BYTES_CHANGED/],
  ['changed compact vector',f=>{f.compact.items[17].goal=[2];f.write(H.COMPACT,f.compact);},/LIVE_BYTES_CHANGED/],
  ['changed dictionary',f=>fs.appendFileSync(path.join(f.root,dictPath),' '),/LIVE_BYTES_CHANGED/],
  ['selected MD mutation',f=>{f.metadata.records[17].difficultyBucket=5;f.write(H.MD,f.metadata);},/WHOLE_METADATA_IDENTITY/],
  ['selected identity mutation',f=>{f.identity.records[17].sourceFingerprint=sha('new');f.write(H.ID,f.identity);},/WHOLE_METADATA_IDENTITY/],
  ['other bank UID tuple change',f=>{f.identity.records[3].sourceQuestionNo='40';f.write(H.ID,f.identity);},/FULL_UID_INVENTORY/],
  ['missing bank UID',f=>{f.identity.records.pop();f.write(H.ID,f.identity);},/FULL_UID_INVENTORY/],
  ['duplicate UID across banks',f=>{f.identity.records.push({...f.identity.records[0],sourceArchiveFile:'original/foreign.js'});f.write(H.ID,f.identity);},/FULL_UID_INVENTORY/],
  ['passed identity stale',f=>{f.identity={records:[]};},/PASSED_IDENTITY_CHANGED/],
])test('refuses '+name,t=>{const f=fixture(t);mutate(f);assert.throws(()=>H.verify(f.root,{identity:f.identity}),expected);});
for(const [name,change,expected] of [
  ['foreign UID',d=>{d.questionUid='qid_v1_'+'f'.repeat(64);},/EXACT_NAMED_SCOPE/],
  ['foreign source',d=>{d.sourceArchiveFile='original/foreign.js';},/EXACT_NAMED_SCOPE/],
  ['wrong ordinal',d=>{d.sourceOrdinal=17;},/EXACT_NAMED_SCOPE/],
  ['reduced denominator',d=>{d.expectedQuestionCount=23;},/EXACT_NAMED_SCOPE/],
  ['release decision',d=>{d.status='RELEASED';},/EXACT_NAMED_SCOPE/],
  ['new math authority',d=>{d.newMathQa=1;},/EXACT_NAMED_SCOPE/],
  ['new semantic authority',d=>{d.newSemanticApproval=1;},/EXACT_NAMED_SCOPE/],
  ['new vector',d=>{d.newFourSlotVector=1;},/EXACT_NAMED_SCOPE/],
  ['unknown ledger key',d=>{d.approval='PASS';},/LEDGER_KEYS/],
  ['missing source SHA',d=>{delete d.currentSourceRef.sha256;},/REF_KEYS/],
  ['wrong source commit',d=>{d.currentSourceRef.commit='f'.repeat(40);},/IMMUTABLE_GIT_INPUT_UNAVAILABLE/],
  ['wrong source path',d=>{d.currentSourceRef.path='archive/exams/foreign.js';},/SOURCE_PATH/],
  ['wrong source bytes',d=>{d.currentSourceRef.bytes++;},/REF_BYTES/],
  ['no current asset inventory',d=>{d.currentAssets=[];},/ASSET_INVENTORY/],
  ['duplicate current asset',d=>{d.currentAssets.push({...d.currentAssets[0]});},/ASSET_DUPLICATE/],
  ['omitted current asset',d=>{d.currentAssets=[d.priorAssets[0]];},/ASSET_MISSING_OR_COMMIT/],
  ['mixed prior snapshot',d=>{d.priorCompactRef.commit=d.currentSourceRef.commit;},/PRIOR_SNAPSHOT/],
  ['prior vector hash',d=>{d.vectorSha256='f'.repeat(64);},/PRIOR_VECTOR/],
  ['wrong immutable witness',d=>{d.reviewRef.sha256='f'.repeat(64);},/REF_BYTES/],
])test('refuses resealed '+name,t=>{const f=fixture(t);change(f.d);f.write(H.LEDGER,f.d);assert.throws(()=>H.verify(f.root),expected);});
test('refuses independent PASS even with a new Git commit and matching hashes',t=>{const f=fixture(t);f.given.originalContradiction=false;f.seal();assert.throws(()=>H.verify(f.root),/INDEPENDENT_DECISION/);});
test('refuses null root decision and a resealed positive review',t=>{const f=fixture(t);const r={...f.review,decision:null};f.write(reviewPath,r);const c=f.commit();f.d.reviewRef=f.ref(c,reviewPath);f.write(H.LEDGER,f.d);assert.throws(()=>H.verify(f.root),/ROOT_DECISION/);});
test('other UID values may change without altering the held whole row or UID bank',t=>{const f=fixture(t);f.metadata.records[2].difficultyBucket=3;f.write(H.MD,f.metadata);assert.equal(H.verify(f.root).projection.status,'HOLD');});
test('builder removes only the held row and will not reuse a cached positive target',t=>{const f=fixture(t);const first=builder.build(f.root,{reuseCache:false});assert.equal(first.index.records.length,23);assert(first.index.pending.some(p=>p.questionUid===H.UID&&p.reason==='EXPLICIT_REVIEW_HOLD:'+H.REASON));const tampered=structuredClone(first.index);tampered.records.push(f.index.records[17]);tampered.pending=[];const next=builder.build(f.root,{previous:tampered});assert.equal(next.stats.reusedFiles,0);assert.equal(next.index.records.length,23);assert.deepEqual(next.index.records,first.index.records);assert.throws(()=>builder.verify(tampered),/EXPLICIT_SOURCE_RESOLUTION_REQUIRED/);});
test('simultaneous marker/witness/ledger deletion cannot revive old positive cache',t=>{const f=fixture(t);const first=builder.build(f.root,{reuseCache:false});const old=structuredClone(first.index);old.records.push(f.index.records[17]);old.pending=[];delete old.files[0].originalSourceErrorHold;fs.unlinkSync(path.join(f.root,H.LEDGER));fs.unlinkSync(path.join(f.root,reviewPath));const next=builder.build(f.root,{previous:old});assert.equal(next.index.records.length,23);assert(next.index.pending.some(p=>p.questionUid===H.UID&&p.reason.startsWith('ORIGINAL_SOURCE_ERROR_HOLD:')));});
test('existing-vector verifier cannot grant a second positive authority',()=>{const V=require('../tools/4slot/existing-registered-vector-continuity.cjs');assert.throws(()=>V.verify('',{}, {d:{sourceArchiveFile:H.SOURCE},id:{questionUid:H.UID},cur:{ordinal:18}}),/EXPLICIT_SOURCE_RESOLUTION_REQUIRED/);});
test('AutoMeta and the official v2 registrar refuse the held UID without mutating source or metadata',async t=>{const f=fixture(t),A=await import(pathToFileURL(path.resolve(__dirname,'../archive/tools/meta-foundation/auto-register-merged-source.mjs'))),V=await import(pathToFileURL(path.resolve(__dirname,'../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs')));const current=f.metadata.records[17],identity=f.identity.records[17];assert.equal(A.nativeReviewReceipt({current,identity,source:H.SOURCE,ordinal:18,nativeSource:{root:f.root},previous:{}}),null);const p=A.planQuestion({question:f.current[17],current,identity,source:H.SOURCE,ordinal:18});assert.equal(p.status,'SUPPLEMENT_PENDING');assert.deepEqual(p.reasons,[H.REASON]);const evidence={path:givenPath,sha256:sha(fs.readFileSync(path.join(f.root,givenPath)))};const req={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:'synthetic-held-native',examUid:'synthetic-exam',scope:'PARTIAL_UIDS',sourceArchiveFile:H.SOURCE,expectedSourceBlobSha1:f.d.currentSourceRef.gitBlobSha1,expectedQuestionCount:24,approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'synthetic',evidenceRefs:[evidence]},items:[{questionUid:H.UID,sourceOrdinal:18,evidenceRefs:[evidence]}],registryChanges:[]};const before=fs.readFileSync(path.join(f.root,H.MD));assert.throws(()=>V.registerReviewedExamV2({root:f.root,request:req,write:true}),/EXPLICIT_SOURCE_RESOLUTION_REQUIRED/);assert.deepEqual(fs.readFileSync(path.join(f.root,H.MD)),before);});
test('fixed UID and source tuple remain negative with no claim; foreign tuples remain unaffected',()=>{assert.throws(()=>H.assertNotSubject({questionUid:H.UID}),/EXPLICIT_SOURCE_RESOLUTION_REQUIRED/);assert.throws(()=>H.assertNotSubject({source:H.SOURCE,ordinal:18}),/EXPLICIT_SOURCE_RESOLUTION_REQUIRED/);assert.doesNotThrow(()=>H.assertNotSubject({source:H.SOURCE,ordinal:17,questionUid:'qid_v1_'+'a'.repeat(64)}));});
for(const [name,svg,error] of [
  ['missing relative nested asset','<svg><image href="child.png"/></svg>',/ASSET_MISSING_OR_COMMIT/],
  ['external SVG dependency','<svg><image href="https://example.invalid/a.png"/></svg>',/SVG_EXTERNAL_DEPENDENCY/],
  ['active SVG dependency','<svg><script>synthetic()</script></svg>',/SVG_ACTIVE_DEPENDENCY/],
  ['SVG style dependency','<svg><style>@import "child.css";</style></svg>',/SVG_ACTIVE_DEPENDENCY/],
])test('rejects resealed '+name,t=>{const f=fixture(t);f.write(currentImage,svg);const c=f.commit();f.d.currentSourceRef=f.ref(c,sourcePath);f.d.currentAssets=[f.ref(c,currentImage)];f.seal();assert.throws(()=>H.verify(f.root),error);});
test('recomputed MD hash cannot smuggle new positive approval through the negative route',t=>{const f=fixture(t);f.metadata.records[17].metadataApprovalType='FINAL_QA';f.write(H.MD,f.metadata);const c=f.commit();f.d.metadataRef=f.ref(c,H.MD);f.d.metadataRowSha256=sha(stable(f.metadata.records[17]));f.seal();assert.throws(()=>H.verify(f.root),/PENDING_AUTHORITY_REQUIRED/);});
test('catalog composes the separate negative subtype with legacy v1; unchanged state remains exact',async t=>{
  const f=fixture(t),Q=await import(pathToFileURL(path.resolve(__dirname,'../archive/tools/source-quality-holds.mjs'))),helper=await import(pathToFileURL(path.resolve(__dirname,'helpers/source-quality-hold-fixture.mjs')));const legacy=helper.seedSourceQualityHoldFixture(f.root);
  f.identity.records.push(...legacy.identity.records);f.write(H.ID,f.identity);const state=Q.loadSourceQualityHolds({root:f.root,identity:f.identity});assert.equal(state.holds.size,2);
  const hold=state.holds.get(H.UID),record={questionUid:H.UID,sourceFile:H.SOURCE,sourceOrdinal:18,sourceFingerprint:hold.sourceFingerprint,identityStatus:'VERIFIED',sourceIntegrityStatus:'HISTORICAL',difficultyBucket:3,reviewStatus:'review_required'};const before=structuredClone(record);
  Q.applySourceQualityHold(record,state);assert.equal(record.sourceIssueHold,true);assert.equal(record.sourceQualityHold.scope,H.SCOPE);for(const [k,v] of Object.entries(before))assert.deepEqual(record[k],v);
  const oldHold=state.holds.get(legacy.questionUid),oldRecord={questionUid:legacy.questionUid,sourceFile:legacy.row.sourceArchiveFile,sourceOrdinal:1,sourceFingerprint:oldHold.sourceFingerprint,identityStatus:'VERIFIED',sourceIntegrityStatus:'VERIFIED'};Q.applySourceQualityHold(oldRecord,state);Q.assertSourceQualityHoldCoverage(state);assert.equal(oldRecord.sourceQualityHold.schemaVersion,'archive-source-quality-hold-projection-v1');
  const unrelated={...before,questionUid:f.identity.records[0].questionUid,sourceOrdinal:1},untouched=structuredClone(unrelated);Q.applySourceQualityHold(unrelated,state);assert.deepEqual(unrelated,untouched);
  assert.throws(()=>Q.applySourceQualityHold(record,state),/DUPLICATE_CATALOG_UID/);
  const paths=Q.sourceQualityHoldDependencyPaths(f.root);for(const p of [H.LEDGER,H.MODULE,reviewPath,givenPath,cropPath])assert(paths.includes(p));
  const Core=require('../archive/archive2-core.js'),PB=require('../archive/problem-bank-meta.js');assert.equal(Core.basicEligibility(record).ok,false);assert.equal(Core.advancedEligible(record),false);assert.equal(PB.projectOriginal(record).verifiedEligible,false);assert.equal(record.difficultyBucket,3);
});
test('legacy v1 alone does not require a foreign named ledger',async t=>{const root=fs.mkdtempSync(path.join(os.tmpdir(),'legacy-alone-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));const Q=await import(pathToFileURL(path.resolve(__dirname,'../archive/tools/source-quality-holds.mjs'))),helper=await import(pathToFileURL(path.resolve(__dirname,'helpers/source-quality-hold-fixture.mjs')));const legacy=helper.seedSourceQualityHoldFixture(root);const state=Q.loadSourceQualityHolds({root,identity:legacy.identity});assert.equal(state.holds.size,1);assert.equal(state.holds.has(H.UID),false);});

async function pagesNamedHoldFixture(t) {
  const f = fixture(t);
  const Q = await import(pathToFileURL(path.resolve(__dirname, '../archive/tools/source-quality-holds.mjs')));
  const P = await import(pathToFileURL(path.resolve(__dirname, '../tools/build-archive-pages-site.mjs')));
  const legacyHelper = await import(pathToFileURL(path.resolve(__dirname, 'helpers/source-quality-hold-fixture.mjs')));
  const legacy = legacyHelper.seedSourceQualityHoldFixture(f.root);
  f.identity.records.push(...legacy.identity.records); f.write(H.ID, f.identity);
  const state = Q.loadSourceQualityHolds({ root: f.root, identity: f.identity });
  const canonicalPath = 'archive/data/archive2-canonical-input-manifest.json';
  const digest = bytes => sha(Buffer.from(bytes.toString('utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')));
  const canonical = { schemaVersion: 'archive2-canonical-input-manifest-v1', files: state.manifestPaths.map(relative => ({
    path: relative, sha256: digest(fs.readFileSync(path.resolve(f.root, 'archive', relative))),
  })) };
  const save = () => f.write(canonicalPath, canonical);
  save(); f.write('index.html', '<h1>Synthetic runtime</h1>');
  const manifest = {
    schemaVersion: 'ARCHIVE_PAGES_SITE_MANIFEST_V1', maxBytes: 1_000_000,
    files: ['index.html', canonicalPath], trees: [{ path: 'archive/exams' }, { path: 'archive/assets' }],
    runtimeClosure: { canonicalInputs: { manifest: canonicalPath, allowedPrefixes: ['archive/data/'] } },
  };
  return { ...f, canonical, digest, save, manifest, plan: () => P.planPagesSite({ sourceRoot: f.root, manifest }) };
}

test('Pages named hold verifies the exact dictionary/source/SVG closure while preserving runtime files', async t => {
  const f = await pagesNamedHoldFixture(t), plan = f.plan();
  assert(plan.buildOnly.some(row => row.path === dictPath && row.reason === 'source-quality-hold-dependency'));
  assert(!plan.entries.some(row => row.path === dictPath));
  for (const relative of [sourcePath, currentImage]) assert(plan.entries.some(row => row.path === relative));
  for (const relative of [reviewPath, givenPath, cropPath]) {
    assert(plan.buildOnly.some(row => row.path === relative && row.reason === 'source-quality-hold-evidence'));
    assert(!plan.entries.some(row => row.path === relative));
  }
});

for (const [label, relative, error] of [
  ['another dictionary version', '../docs/architecture/4slot/term-dictionary-v9.9.json', /unapproved parent path/],
  ['a dictionary path alias', '../docs/architecture/4slot/alias/../term-dictionary-v1.5.json', /unapproved parent path/],
  ['a foreign exam source', 'exams/foreign.js', /unapproved runtime path/],
  ['a foreign renderer asset', 'assets/foreign.svg', /unapproved runtime path/],
]) test('Pages named hold does not authorize ' + label, async t => {
  const f = await pagesNamedHoldFixture(t);
  f.canonical.files.push({ path: relative, sha256: 'a'.repeat(64) }); f.save();
  assert.throws(f.plan, error);
});

for (const [label, relative] of [['dictionary', dictPath], ['source', sourcePath], ['renderer', currentImage]])
  test('Pages named hold rejects changed ' + label + ' even with a recomputed manifest digest', async t => {
    const f = await pagesNamedHoldFixture(t), absolute = path.join(f.root, relative);
    fs.appendFileSync(absolute, '\n');
    const row = f.canonical.files.find(row => path.resolve(f.root, 'archive', row.path) === absolute);
    row.sha256 = f.digest(fs.readFileSync(absolute)); f.save();
    assert.throws(f.plan, /ORIGINAL_SOURCE_ERROR_HOLD:LIVE_BYTES_CHANGED/);
  });

test('Pages named hold requires all typed dependencies and protects review text from explicit publication', async t => {
  const missing = await pagesNamedHoldFixture(t);
  missing.canonical.files = missing.canonical.files.filter(row => row.path !== 'exams/' + H.SOURCE); missing.save();
  assert.throws(missing.plan, /omits a source quality hold dependency/);
  const publish = await pagesNamedHoldFixture(t); publish.manifest.files.push(reviewPath);
  assert.throws(publish.plan, /source quality hold evidence must remain build-only/);
});

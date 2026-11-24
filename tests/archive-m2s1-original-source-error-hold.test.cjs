'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {execFileSync}=require('node:child_process');
const H=require('../tools/4slot/original-source-error-hold.cjs');
const builder=require('../tools/4slot/build-4slot-runtime.cjs');
const {pathToFileURL}=require('node:url');
const crypto=require('node:crypto');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),blob=b=>crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const vector=q=>Object.fromEntries(['format','given','goal','method','condition','candidates'].map(k=>[k,q[k]]));
const COMPACT='archive/data/item-4slot/'+H.SOURCE.replace(/\.js$/,'.4slot.json'),INDEX='archive/data/item-4slot-index.json',MD='archive/data/question_metadata.json',ID='archive/data/question_identity_map.json';
const sourcePath='archive/exams/'+H.SOURCE,dictPath='docs/architecture/4slot/term-dictionary-v1.5.json';
const nativePath='docs/operations/synthetic-original-source/native.json';
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
  const compact={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:H.SOURCE,sourceGitBlobSha:native.sourceGitBlobSha,dictionaryVersion:dictionary.dictionaryVersion,evidence:{branch:'synthetic',commit:nativeCommit,path:nativePath},reviewedBy:{agent:'synthetic-prior',at:'2026-01-01',sampled:[18]},items:uids.map((_,i)=>({ordinal:i+1,format:'단일 정답',given:[1],goal:[1],method:[1],condition:[1],candidates:[]}))};write(COMPACT,compact);
  const identity={records:uids.map((questionUid,i)=>({questionUid,sourceArchiveFile:H.SOURCE,sourceOrdinal:i+1,sourceQuestionNo:String(i+1),status:'VERIFIED',sourceFingerprint:sha('historical-'+i)}))};
  const metadata={records:uids.map((questionUid,i)=>({questionUid,sourceArchiveFile:H.SOURCE,sourceOrdinal:i+1,metadataStatus:'registration_pending_semantic_review',reviewStatus:'review_required',problemTypeKey:'',templateKey:''}))};write(ID,identity);write(MD,metadata);
  const rows=compact.items.map((it,i)=>({questionUid:uids[i],sourceArchiveFile:H.SOURCE,sourceOrdinal:i+1,sourceQuestionNo:String(i+1),sourceDisplayNumber:i+1,compactPath:COMPACT,dictionaryVersion:dictionary.dictionaryVersion,...vector(it),registrationStatus:'REGISTERED',independentReviewClaim:false}));
  const index={schemaVersion:builder.SCHEMA,authority:'MAIN_MERGED_REVIEWED_COMPACT',sourceMutation:0,semanticApprovalMutation:0,records:rows,pending:[],files:[{path:COMPACT,currentSourceBlobSha:native.sourceGitBlobSha,sourceGitBlobSha:native.sourceGitBlobSha,compactSha256:sha(fs.readFileSync(path.join(root,COMPACT))),itemCount:24,dictionarySha256:sha(fs.readFileSync(path.join(root,dictPath))),evidence:compact.evidence,reviewedBy:compact.reviewedBy}],terms:{}};write(INDEX,index);const priorCommit=commit();

  const current=structuredClone(bank);current[17].content='<img src="'+currentImage.slice(8)+'">';write(sourcePath,serial(current));write(currentImage,'<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/></svg>');commit();
  // The ledger is the only input of the hold. It is read for the projection and never compared with any file bytes.
  const d={schemaVersion:H.SCHEMA,scope:H.SCOPE,status:'HOLD',questionUid:H.UID,sourceArchiveFile:H.SOURCE,sourceOrdinal:18,sourceQuestionNo:'18',expectedQuestionCount:24,
    currentSourceRef:{path:sourcePath,gitBlobSha1:blob(Buffer.from(serial(current)))},reviewRef:{path:givenPath},releasePolicy:H.RELEASE,newMathQa:0,newSemanticApproval:0,newFourSlotVector:0};
  write(H.LEDGER,d);write(givenPath,{note:'synthetic'});
  return {root,write,commit,git,d,bank,current,metadata,identity,compact,index};
}
test('the hold reads only its ledger and returns a negative hold for one question',t=>{const f=fixture(t),before=fs.readFileSync(path.join(f.root,MD));const h=H.verify(f.root);assert.equal(h.negativeOnly,true);assert.equal(h.projection.status,'HOLD');assert.equal(h.questionUid,H.UID);assert.equal(h.projection.newFourSlotVector,0);assert.deepEqual(fs.readFileSync(path.join(f.root,MD)),before);assert.deepEqual(H.dependencyPaths(f.root),[H.MODULE,H.LEDGER]);});
// 2026-11-24: changing or deleting any of these files never fails because of the hold (no byte pinning).
for(const [name,mutate] of [
  ['changed source',f=>fs.appendFileSync(path.join(f.root,sourcePath),'\n')],
  ['deleted source',f=>fs.unlinkSync(path.join(f.root,sourcePath))],
  ['changed current asset',f=>fs.appendFileSync(path.join(f.root,currentImage),' ')],
  ['deleted current asset',f=>fs.unlinkSync(path.join(f.root,currentImage))],
  ['changed compact vector',f=>{f.compact.items[17].goal=[2];f.write(COMPACT,f.compact);}],
  ['changed dictionary',f=>fs.appendFileSync(path.join(f.root,dictPath),' ')],
  ['selected MD mutation',f=>{f.metadata.records[17].difficultyBucket=5;f.write(MD,f.metadata);}],
  ['selected identity mutation',f=>{f.identity.records[17].sourceFingerprint=sha('new');f.write(ID,f.identity);}],
  ['other bank UID tuple change',f=>{f.identity.records[3].sourceQuestionNo='40';f.write(ID,f.identity);}],
  ['missing bank UID',f=>{f.identity.records.pop();f.write(ID,f.identity);}],
  ['missing review evidence file',f=>fs.unlinkSync(path.join(f.root,givenPath))],
])test('does not fail on '+name,t=>{const f=fixture(t);mutate(f);assert.equal(H.verify(f.root).projection.status,'HOLD');H.dependencyPaths(f.root);});
test('without its ledger the hold has no projection and no dependency',t=>{const f=fixture(t);fs.unlinkSync(path.join(f.root,H.LEDGER));assert.equal(H.relevant(f.root),false);assert.deepEqual(H.dependencyPaths(f.root),[H.MODULE]);assert.throws(()=>H.verify(f.root),/LEDGER_MISSING/);});
test('builder removes only the held row and will not reuse a cached positive target',t=>{const f=fixture(t);const first=builder.build(f.root,{reuseCache:false});assert.equal(first.index.records.length,23);assert(first.index.pending.some(p=>p.questionUid===H.UID&&p.reason==='EXPLICIT_REVIEW_HOLD:'+H.REASON));const tampered=structuredClone(first.index);tampered.records.push(f.index.records[17]);tampered.pending=[];const next=builder.build(f.root,{previous:tampered});assert.equal(next.stats.reusedFiles,0);assert.equal(next.index.records.length,23);assert.deepEqual(next.index.records,first.index.records);assert.throws(()=>builder.verify(tampered),/EXPLICIT_SOURCE_RESOLUTION_REQUIRED/);});
test('simultaneous marker/witness/ledger deletion cannot revive old positive cache',t=>{const f=fixture(t);const first=builder.build(f.root,{reuseCache:false});const old=structuredClone(first.index);old.records.push(f.index.records[17]);old.pending=[];delete old.files[0].originalSourceErrorHold;fs.unlinkSync(path.join(f.root,H.LEDGER));const next=builder.build(f.root,{previous:old});assert.equal(next.index.records.length,23);assert(next.index.pending.some(p=>p.questionUid===H.UID&&p.reason.startsWith('ORIGINAL_SOURCE_ERROR_HOLD:')));});
test('existing-vector verifier cannot grant a second positive authority',()=>{const V=require('../tools/4slot/existing-registered-vector-continuity.cjs');assert.throws(()=>V.verify('',{}, {d:{sourceArchiveFile:H.SOURCE},id:{questionUid:H.UID},cur:{ordinal:18}}),/EXPLICIT_SOURCE_RESOLUTION_REQUIRED/);});
test('AutoMeta and the official v2 registrar refuse the held UID without mutating source or metadata',async t=>{const f=fixture(t),A=await import(pathToFileURL(path.resolve(__dirname,'../archive/tools/meta-foundation/auto-register-merged-source.mjs'))),V=await import(pathToFileURL(path.resolve(__dirname,'../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs')));const current=f.metadata.records[17],identity=f.identity.records[17];assert.equal(A.nativeReviewReceipt({current,identity,source:H.SOURCE,ordinal:18,nativeSource:{root:f.root},previous:{}}),null);const p=A.planQuestion({question:f.current[17],current,identity,source:H.SOURCE,ordinal:18});assert.equal(p.status,'SUPPLEMENT_PENDING');assert.deepEqual(p.reasons,[H.REASON]);const evidence={path:givenPath,sha256:sha(fs.readFileSync(path.join(f.root,givenPath)))};const req={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:'synthetic-held-native',examUid:'synthetic-exam',scope:'PARTIAL_UIDS',sourceArchiveFile:H.SOURCE,expectedSourceBlobSha1:f.d.currentSourceRef.gitBlobSha1,expectedQuestionCount:24,approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'synthetic',evidenceRefs:[evidence]},items:[{questionUid:H.UID,sourceOrdinal:18,evidenceRefs:[evidence]}],registryChanges:[]};const before=fs.readFileSync(path.join(f.root,MD));assert.throws(()=>V.registerReviewedExamV2({root:f.root,request:req,write:true}),/EXPLICIT_SOURCE_RESOLUTION_REQUIRED/);assert.deepEqual(fs.readFileSync(path.join(f.root,MD)),before);});
test('fixed UID and source tuple remain negative with no claim; foreign tuples remain unaffected',()=>{assert.throws(()=>H.assertNotSubject({questionUid:H.UID}),/EXPLICIT_SOURCE_RESOLUTION_REQUIRED/);assert.throws(()=>H.assertNotSubject({source:H.SOURCE,ordinal:18}),/EXPLICIT_SOURCE_RESOLUTION_REQUIRED/);assert.doesNotThrow(()=>H.assertNotSubject({source:H.SOURCE,ordinal:17,questionUid:'qid_v1_'+'a'.repeat(64)}));});

test('catalog composes the separate negative subtype with legacy v1; unchanged state remains exact',async t=>{
  const f=fixture(t),Q=await import(pathToFileURL(path.resolve(__dirname,'../archive/tools/source-quality-holds.mjs'))),helper=await import(pathToFileURL(path.resolve(__dirname,'helpers/source-quality-hold-fixture.mjs')));const legacy=helper.seedSourceQualityHoldFixture(f.root);
  f.identity.records.push(...legacy.identity.records);f.write(ID,f.identity);const state=Q.loadSourceQualityHolds({root:f.root,identity:f.identity});assert.equal(state.holds.size,2);
  const record={questionUid:H.UID,sourceFile:H.SOURCE,sourceOrdinal:18,identityStatus:'VERIFIED',sourceIntegrityStatus:'HISTORICAL',difficultyBucket:3,reviewStatus:'review_required'};const before=structuredClone(record);
  Q.applySourceQualityHold(record,state);assert.equal(record.sourceIssueHold,true);assert.equal(record.sourceQualityHold.scope,H.SCOPE);for(const [k,v] of Object.entries(before))assert.deepEqual(record[k],v);
  const oldRecord={questionUid:legacy.questionUid,sourceFile:legacy.row.sourceArchiveFile,sourceOrdinal:1,identityStatus:'VERIFIED',sourceIntegrityStatus:'VERIFIED'};Q.applySourceQualityHold(oldRecord,state);assert.equal(oldRecord.sourceQualityHold.schemaVersion,'archive-source-quality-hold-projection-v1');
  const unrelated={...before,questionUid:f.identity.records[0].questionUid,sourceOrdinal:1},untouched=structuredClone(unrelated);Q.applySourceQualityHold(unrelated,state);assert.deepEqual(unrelated,untouched);
  const paths=Q.sourceQualityHoldDependencyPaths(f.root);for(const p of [H.LEDGER,H.MODULE])assert(paths.includes(p));assert(!paths.includes(givenPath));assert(!paths.includes(sourcePath));
  const Core=require('../archive/archive2-core.js'),PB=require('../archive/problem-bank-meta.js');assert.equal(Core.basicEligibility(record).ok,false);assert.equal(Core.advancedEligible(record),false);assert.equal(PB.projectOriginal(record).verifiedEligible,false);assert.equal(record.difficultyBucket,3);
});
test('legacy v1 alone does not require a foreign named ledger',async t=>{const root=fs.mkdtempSync(path.join(os.tmpdir(),'legacy-alone-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));const Q=await import(pathToFileURL(path.resolve(__dirname,'../archive/tools/source-quality-holds.mjs'))),helper=await import(pathToFileURL(path.resolve(__dirname,'helpers/source-quality-hold-fixture.mjs')));const legacy=helper.seedSourceQualityHoldFixture(root);const state=Q.loadSourceQualityHolds({root,identity:legacy.identity});assert.equal(state.holds.size,1);assert.equal(state.holds.has(H.UID),false);});

async function pagesNamedHoldFixture(t) {
  const f = fixture(t);
  const Q = await import(pathToFileURL(path.resolve(__dirname, '../archive/tools/source-quality-holds.mjs')));
  const P = await import(pathToFileURL(path.resolve(__dirname, '../tools/build-archive-pages-site.mjs')));
  const state = Q.loadSourceQualityHolds({ root: f.root });
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
  return { ...f, state, canonical, digest, save, manifest, plan: () => P.planPagesSite({ sourceRoot: f.root, manifest }) };
}

test('Pages needs only the ledger as a hold input; exam source and figure ship as ordinary runtime files', async t => {
  const f = await pagesNamedHoldFixture(t), plan = f.plan();
  assert.deepEqual(f.state.manifestPaths, [H.LEDGER.slice('archive/'.length)]);
  for (const relative of [sourcePath, currentImage]) assert(plan.entries.some(row => row.path === relative));
  assert(!plan.buildOnly.some(row => /source-quality-hold/.test(row.reason || '')));
});
for (const [label, relative] of [['source', sourcePath], ['renderer', currentImage]])
  test('Pages does not fail when the held exam ' + label + ' changes', async t => {
    const f = await pagesNamedHoldFixture(t);
    fs.appendFileSync(path.join(f.root, relative), '\n');
    assert.doesNotThrow(f.plan);
  });

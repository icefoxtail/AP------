const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const core=require('../archive/archive2-core.js');
const source=require('../archive/archive2-source.js');
const selector=require('../archive/mixer-selector.js');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'archive/mixer.html'),'utf8');
const section=(start,end)=>{
  const a=html.indexOf(start),b=html.indexOf(end,a);
  assert(a>=0&&b>a,start);
  return html.slice(a,b);
};
const bundle=[
  section('function resolveMixerQuestionIdentity(raw, sourceFile) {','let mixerBasicCatalogPromise'),
  section('let mixerBasicCatalogPromise','function normalizeForFilter('),
  section('function normalizeForFilter(q, sourceMode, sourceMeta = {}) {','function isOriginalArchiveSourceFile('),
  section('function matchesBlueprintRow(record, row) {','// 복원된 원본 문항'),
  section('function pickQuestionsByDifficulty(filteredPool, plan) {','function pickQuestionsByBlueprint('),
  section('function pickQuestionsByBlueprint(filteredPool, blueprintRows = null) {','async function applyPickedToCart('),
  section('async function restoreIndexRecordToCart(record) {','/* ===================== 자동출제 엔진 ===================== */'),
  section('async function applyPickedToCart(picked) {','async function runAutoGenerate(')
].join('\n');
const file='original/high/h1/basic-gate-fixture.js';
const uid=ordinal=>'qid_v1_'+crypto.createHash('sha256').update(file+'#'+ordinal).digest('hex');
const fingerprint=q=>crypto.createHash('sha256').update(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,answer:q.answer??null,solution:q.solution??null,image:q.image??null})).digest('hex');
const question=()=>({id:1,content:'$1+1$의 값은?',choices:['2','3'],answer:'2',solution:'$1+1=2$',level:'중',standardUnitKey:'H22-C-01',subUnitKey:'H22-C-01-CORE'});
const record=(q,change={})=>({questionUid:uid(1),sourceFile:file,sourceOrdinal:1,sourceQuestionNo:'1',sourceFingerprint:fingerprint(q),identityStatus:'VERIFIED',sourceStatus:'VERIFIED',taxonomyStatus:'CONFIRMED',basicTaxonomyStatus:'CONFIRMED',curriculumKey:'2022',courseKey:'공통수학1',L1:'다항식',L2:'다항식의 연산',reviewStatus:'reviewed_pass',semanticDisposition:'CONFIRMED',curriculumApplicability:'DEFAULT_SCOPE',defaultSelectable:true,...change});
function environment(rows,bank,options={}){
  const context={
    window:{Archive2Core:core,Archive2Source:source,ArchiveMixerSelector:selector,
      getArchiveQuestionMetadata:()=>options.metadata||{},mergeArchiveQuestionMetadata:q=>q,
      resolveQuestionIdentityReference:ref=>({status:'RESOLVED_SOURCE_ORDINAL',questionUid:ref.questionUid||uid(ref.sourceOrdinal||1),sourceOrdinal:ref.sourceOrdinal||1,sourceQuestionNo:'1'})},
    document:{baseURI:'http://fixture.test/archive/'},URL,
    fetch:async()=>({ok:!options.loadFailure,status:options.loadFailure?503:200,json:async()=>({schemaVersion:core.VERSION,records:rows,exams:[],taxonomy:[],health:{}})}),
    getSourceMetaForFile:()=>({}),getSourceMetaForIndexRecord:()=>({}),getSourceTitleForIndexRecord:()=>file,
    getStandardizedUnit:()=>({course:'공통수학1',unit:'다항식의 연산',order:1}),
    getMixerSourceOrdinal:q=>Number(q.sourceOrdinal||q._sourceQuestionOrdinal),
    normalizeCourseName:value=>String(value||''),normalizeTags:()=>[],findStandardUnitKey:()=> 'H22-C-01',inferGradeFromFile:()=> '고1',normalizeCartLevel:value=>value||'미분류',
    getCachedQuestionFile:async()=>bank,
    readAutoGenAdvancedOptions:()=>({includeSchools:[],excludeSchools:[],recentUids:[],sourceDiversity:false}),
    blueprintTagsOk:()=>true,MASTER_TABLE:{},cart:[],autoGenRows:[],AUTOGEN_MAX_CART:100,ARCHIVE_MIXER_SELECTION_SEED:'fixture',console:{warn(){},log(){}}
  };
  vm.createContext(context);vm.runInContext(bundle,context);
  const normalize=(q,mode='archive')=>context.normalizeForFilter({...q,sourceFile:file,_sourceFile:file,sourceOrdinal:1},mode,{file,grade:'고1'});
  return {context,normalize};
}

test('missing runtimeSelectable does not exclude a healthy L1/L2-only question',async()=>{
  const q=question(),e=environment([record(q)],[q]);
  assert.equal(e.normalize(q).basicSelectable,false,'not ready must not fail open');
  await e.context.ensureMixerBasicCatalog();
  const normalized=e.normalize(q);
  assert.equal(normalized.basicSelectable,true);
  assert.equal(normalized.difficultyBucket,'');
  const selected=e.context.pickQuestionsByBlueprint([normalized],[{count:1,unitKey:'',subUnitKey:'',problemTypeKey:'',level:'',tags:''}]);
  assert.equal(selected.picked.length,1);
  assert.equal(await e.context.restoreIndexRecordToCart(selected.picked[0]),true);
  assert.equal(e.context.cart.length,1);
});

for(const mode of ['archive','paper']){
  test(`concurrent ${mode} restores add a canonical question only once`,{timeout:5000},async()=>{
    const q=question(),e=environment([record(q)],[q]);
    await e.context.ensureMixerBasicCatalog();
    let arrivals=0,release;
    const barrier=new Promise(resolve=>{release=resolve;});
    e.context.window.Archive2Source={...source,fingerprint:async original=>{
      if(++arrivals===2)release();
      await barrier;
      return source.fingerprint(original);
    }};
    const candidate=e.normalize(q,mode);
    const restored=await Promise.all([
      e.context.restoreIndexRecordToCart(candidate),
      e.context.restoreIndexRecordToCart(candidate)
    ]);
    assert.deepEqual(restored,[true,true]);
    assert.equal(arrivals,2,'both calls must reach fingerprint verification concurrently');
    assert.equal(e.context.cart.length,1);
    assert.equal(e.context.cart[0].source_question_uid,uid(1));
    assert.equal(await e.context.restoreIndexRecordToCart(candidate),true);
    assert.equal(e.context.cart.length,1,'sequential retries remain idempotent');
  });
}

test('concurrent legacy keys for one source identity share the catalog canonical UID',async()=>{
  const q=question(),e=environment([record(q)],[q]);
  await e.context.ensureMixerBasicCatalog();
  const candidate=e.normalize(q);
  const restored=await Promise.all([
    e.context.restoreIndexRecordToCart({...candidate,key:'legacy-paper-key',questionUid:''}),
    e.context.restoreIndexRecordToCart({...candidate,key:'legacy-archive-key'})
  ]);
  assert.deepEqual(restored,[true,true]);
  assert.equal(e.context.cart.length,1);
  assert.equal(e.context.cart[0]._sourceQuestionUid,uid(1));
  assert.equal(e.context.cart[0].source_question_uid,uid(1));
});

test('existing cart UID prevents a duplicate even when its legacy key differs',async()=>{
  const q=question();
  for(const field of ['_sourceQuestionUid','source_question_uid']){
    const e=environment([record(q)],[q]);
    await e.context.ensureMixerBasicCatalog();
    e.context.cart.push({...q,_qKey:'legacy-key',[field]:uid(1)});
    assert.equal(await e.context.restoreIndexRecordToCart(e.normalize(q)),true,field);
    assert.equal(e.context.cart.length,1,field);
  }
});

test('missing runtimeSelectable cannot bypass source, identity, solution or semantic HARD blocks',async()=>{
  const q=question();
  for(const change of [{identityStatus:'UNRESOLVED'},{sourceStatus:'HOLD'},{sourceIssueHold:true},{sourceQualityDisposition:'SOLUTION_REPAIR_REQUIRED'},{semanticDisposition:'HOLD'},
    {sourceStatus:'HOLD',sourceFingerprint:'0'.repeat(64)}]){
    const e=environment([record(q,change)],[q]);
    await e.context.ensureMixerBasicCatalog();
    const normalized=e.normalize(q);
    assert.equal(normalized.basicSelectable,false,JSON.stringify(change));
    assert.equal(e.context.pickQuestionsByDifficulty([normalized],{high:0,mid:1,low:0}).picked.length,0);
    assert.equal(e.context.pickQuestionsByBlueprint([normalized],[{count:1,level:''}]).picked.length,0);
    assert.equal(await e.context.restoreIndexRecordToCart({...normalized,basicSelectable:true}),false,'restore must recompute the gate');
    assert.equal(e.context.cart.length,0);
  }
});

test('undefined or stale candidate verdict cannot enter either picker',()=>{
  const q=question(),e=environment([record(q)],[q]);
  const unknown={...e.normalize(q),basicSelectable:undefined};
  assert.equal(e.context.pickQuestionsByDifficulty([unknown],{high:0,mid:1,low:0}).picked.length,0);
  assert.equal(e.context.pickQuestionsByBlueprint([unknown],[{count:1,level:''}]).picked.length,0);
});

test('cart restore detects source changed after a verified catalog snapshot',async()=>{
  const q=question(),e=environment([record(q)],[{...q,answer:'3'}]);
  await e.context.ensureMixerBasicCatalog();
  const normalized=e.normalize(q);
  assert.equal(normalized.basicSelectable,true);
  assert.equal(await e.context.restoreIndexRecordToCart(normalized),false);
  assert.equal(e.context.cart.length,0);
});

test('paper-mode additions also use the verified restore gate',async()=>{
  const q=question(),e=environment([record(q,{sourceQualityDisposition:'SOLUTION_REPAIR_REQUIRED'})],[q]);
  await e.context.ensureMixerBasicCatalog();
  const normalized=e.normalize(q,'paper');
  assert.equal(await e.context.applyPickedToCart([{...normalized,basicSelectable:true}]),0);
  assert.equal(e.context.cart.length,0);
});

test('catalog unavailable or UID/source mismatch stays blocked',async()=>{
  const q=question(),unavailable=environment([record(q)],[q],{loadFailure:true});
  assert.equal(await unavailable.context.restoreIndexRecordToCart(unavailable.normalize(q)),false);
  const e=environment([record(q)],[q]);await e.context.ensureMixerBasicCatalog();
  assert.equal(e.context.getMixerBasicRecord(file,1,uid(2)),null);
});

test('actual unowned source-drift production record never reaches the cart',async()=>{
  const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
  const catalog=core.decodeCatalog(read('archive/data/archive2-catalog.json'));
  const target=catalog.records.find(r=>r.questionUid==='qid_v1_9b1de25500ecd4efd2f7e5cbb47f98a125795ca21ce506254d0a6d0c497f3055');
  assert.equal(target.sourceStatus,'HOLD');
  assert.notEqual(target.sourceFingerprint,target.approvedSourceFingerprint);
  const bank=source.evaluate(fs.readFileSync(path.join(root,'archive/exams',target.sourceFile),'utf8'),target.sourceFile);
  const e=environment([target],bank);
  await e.context.ensureMixerBasicCatalog();
  const candidate={raw:bank[0],key:target.questionUid,questionUid:target.questionUid,sourceFile:target.sourceFile,sourceOrdinal:1,sourceMode:'archive',basicSelectable:undefined,normalizedLevel:'하',standardUnitKey:'H22-A-04'};
  assert.equal(e.context.pickQuestionsByDifficulty([candidate],{high:0,mid:0,low:1}).picked.length,0);
  assert.equal(await e.context.restoreIndexRecordToCart({...candidate,basicSelectable:true}),false);
  assert.equal(e.context.cart.length,0);
});

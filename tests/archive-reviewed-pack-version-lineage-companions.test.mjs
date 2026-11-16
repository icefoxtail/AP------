import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {assertReviewedPackVersionLineage} from '../archive/tools/meta-foundation/reviewed-pack-version-lineage.mjs';

// Synthetic, small Git fixtures exercise lineage integrity only. They do not
// issue a native review, run a registrar, or claim QA for production questions.
const CANON='archive/data/meta-foundation/canonical',RP='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const compiledPath='archive/data/meta-foundation/compiled/taxonomy_registry.json';
const source='original/middle/m2/1mid/lineage-test.js';
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)
  ?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const tuple=['curriculum','problemTypeKey','standardCourse','standardUnitKey','subUnitKey'];

function fixture(t,{midbatch=true,mixed=true,laterForeign=true,publishIssued=true,implicitBindingOwner=false,packOnlyBaseline=false}={}){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'reviewed-pack-companion-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const put=(p,v)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,
    Buffer.isBuffer(v)?v:typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');};
  const raw=p=>fs.readFileSync(path.join(root,p)),ref=p=>({path:p,sha256:sha(raw(p))});
  const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  const commit=message=>{git('add','.');git('-c','user.name=Lineage fixture','-c','user.email=fixture@example.invalid','commit','-qm',message);return git('rev-parse','HEAD');};
  git('init','-q');
  const base=`${CANON}/packs/middle2`,foreignBase=`${CANON}/packs/h1-foundation`;
  const binding={curriculum:'2015',problemTypeKey:'PT_ROOT',standardCourse:'fixture middle2',
    standardUnitKey:'M2-01',subUnitKey:'M2-01-SELECTED',ownerPack:'MIDDLE2',status:'ACTIVE'};
  const pack={packId:'MIDDLE2',ownerPack:'MIDDLE2',packVersion:'1.0.0',canonicalStatus:'ACTIVE',
    curricula:['2015'],ownedStandardUnitDomains:['M2-01'],problemTypeCount:1,templateCount:1,bindingCount:1,aliasCount:0};
  const bindings={status:'ACTIVE',bindingCount:1,bindings:[structuredClone(binding)]};
  const taxonomy={status:'ACTIVE',problemTypeCount:1,templateCount:1,
    problemTypes:[{problemTypeKey:'PT_ROOT',ownerPack:'MIDDLE2',status:'ACTIVE',definition:'unchanged selected definition'}],
    templates:[{templateKey:'TPL_ROOT',parentProblemTypeKey:'PT_ROOT',ownerPack:'MIDDLE2',status:'ACTIVE',definition:'unchanged selected template'}]};
  const foreign={pack:{packId:'H1_FOUNDATION',ownerPack:'H1_FOUNDATION',packVersion:'1.0.0',canonicalStatus:'ACTIVE',
    problemTypeCount:1,templateCount:0,bindingCount:0,aliasCount:0},
    taxonomy:{status:'ACTIVE',problemTypeCount:1,templateCount:0,problemTypes:[{
      problemTypeKey:'PT_FOREIGN',ownerPack:'H1_FOUNDATION',status:'ACTIVE',definition:'unchanged companion parent'}],templates:[]},
    bindings:{status:'ACTIVE',bindingCount:0,bindings:[]},aliases:{status:'ACTIVE',aliases:[]}};
  const live={packId:'MIDDLE2',status:'ACTIVE',packVersion:'1.0.0',generatedFrom:{},records:[]};
  const registry={status:'ACTIVE',activePacks:new Map(),problemTypes:new Map(),templates:new Map()};
  const compiled={status:'DERIVED_READ_ONLY',sourcePacks:[],problemTypes:[],templates:[]};
  const writeAuthority=()=>{
    for(const [n,v]of Object.entries({pack,taxonomy,bindings,aliases:{status:'ACTIVE',aliases:[]}}))put(`${base}/${n}.json`,v);
    for(const [n,v]of Object.entries(foreign))put(`${foreignBase}/${n}.json`,v);
    compiled.sourcePacks=[{packId:'MIDDLE2',version:pack.packVersion},{packId:'H1_FOUNDATION',version:foreign.pack.packVersion}];
    compiled.problemTypes=structuredClone([...taxonomy.problemTypes,...foreign.taxonomy.problemTypes]);
    compiled.templates=structuredClone([...taxonomy.templates,...foreign.taxonomy.templates]);put(compiledPath,compiled);
    const activePacks=[{id:'MIDDLE2',version:pack.packVersion,status:'ACTIVE'},{id:'H1_FOUNDATION',version:foreign.pack.packVersion,status:'ACTIVE'}];
    put(`${CANON}/registry_index.json`,{status:'ACTIVE',activePacks,canonicalSources:[base,foreignBase].flatMap(b=>
      ['pack','taxonomy','bindings','aliases'].map(n=>ref(`${b}/${n}.json`))),compiledArtifacts:[ref(compiledPath)]});
    live.packVersion=pack.packVersion;put('archive/data/meta-foundation/runtime/middle2-v1.json',live);
    registry.activePacks=new Map(activePacks.map(r=>[r.id,structuredClone(r)]));
    registry.problemTypes=new Map(compiled.problemTypes.map(r=>[r.problemTypeKey,structuredClone(r)]));
    registry.templates=new Map(compiled.templates.map(r=>[r.templateKey,structuredClone(r)]));
  };
  const bytes=Buffer.from('window.questionBank=[{id:1,content:"synthetic lineage integrity fixture"}];\n');
  put('archive/exams/'+source,bytes);put('review/witness.json',{scope:'SYNTHETIC_LINEAGE_TEST_ONLY'});writeAuthority();
  const providers=[];
  const make=n=>{
    const requestId='lineage-step-'+n,requestPath='.archive-meta-register/inbox/'+requestId+'.json',receiptPath=RP+requestId+'.json';
    const companion=mixed&&(n===3||n===4),pt=companion?'PT_FOREIGN':'PT_ROOT',tpl=companion?'TPL_COMPANION_'+n:'TPL_ROOT';
    const after={...binding,curriculum:'2022',subUnitKey:'M2-01-STEP-'+n,problemTypeKey:pt};
    if(implicitBindingOwner)delete after.ownerPack;
    const changes=[],packOnly=packOnlyBaseline&&n===(midbatch?1:2);
    if(n===1||packOnly)changes.push({path:base+'/pack.json',before:structuredClone(pack),
      after:{...structuredClone(pack),curricula:n===1?['2015','2022']:['2015','2022','2009']},evidenceRefs:[ref('review/witness.json')]});
    if(companion)changes.push({path:foreignBase+'/taxonomy.json',collection:'templates',match:{templateKey:tpl},before:null,
      after:{templateKey:tpl,parentProblemTypeKey:pt,status:'ACTIVE',ownerPack:'H1_FOUNDATION',definition:'exact synthetic companion '+n},evidenceRefs:[ref('review/witness.json')]});
    if(!packOnly)changes.push({path:base+'/bindings.json',collection:'bindings',match:Object.fromEntries(tuple.map(k=>[k,after[k]])),before:null,after,evidenceRefs:[ref('review/witness.json')]});
    const record={...after,templateKey:tpl,questionUid:'qid_v1_'+String(n).padStart(64,'0'),sourceOrdinal:1,metaFoundationPackId:'MIDDLE2',metadataApprovalType:'FINAL_QA'};
    const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId,scope:'PARTIAL_UIDS',sourceArchiveFile:source,
      expectedQuestionCount:1,expectedSourceBlobSha1:blob(bytes),approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'SYNTHETIC_FIXTURE',evidenceRefs:[ref('review/witness.json')]},
      items:[{questionUid:record.questionUid,sourceOrdinal:1,after:{problemTypeKey:pt,templateKey:tpl},evidenceRefs:[ref('review/witness.json')]}],registryChanges:changes};
    put(requestPath,request);const p={n,requestId,requestPath,receiptPath,request,record,companion};providers.push(p);return p;
  };
  const apply=p=>{
    for(const c of p.request.registryChanges){
      if(c.path===base+'/pack.json')Object.assign(pack,structuredClone(c.after));
      else if(c.collection==='bindings')bindings.bindings.push(structuredClone(c.after));
      else foreign.taxonomy.templates.push(structuredClone(c.after));
    }
    pack.bindingCount=bindings.bindingCount=bindings.bindings.length;pack.packVersion='1.0.'+p.n;
    if(p.companion){foreign.pack.packVersion=foreign.pack.packVersion.replace(/\d+$/,n=>String(Number(n)+1));foreign.pack.templateCount=foreign.taxonomy.templateCount=foreign.taxonomy.templates.length;}
    writeAuthority();const record={...p.record,metaFoundationPackVersion:pack.packVersion,metadataRevision:`meta-foundation:MIDDLE2@${pack.packVersion}:exam-final_qa-v2:${p.requestId}`};
    const digests=[ref(base+'/pack.json')];
    if(p.request.registryChanges.some(c=>c.path===base+'/bindings.json'))digests.push(ref(base+'/bindings.json'));
    if(p.companion)digests.push(ref(foreignBase+'/pack.json'),ref(foreignBase+'/taxonomy.json'));
    p.receipt={schemaVersion:'archive-reviewed-exam-meta-registration-v2',requestId:p.requestId,requestSha256:sha(stable(p.request)),
      sourceArchiveFile:source,sourceBlobSha1:blob(bytes),sourceRawSha256:sha(bytes),expectedQuestionCount:1,
      metadataRegistrationStatus:'REGISTERED',approval:p.request.approval,registryChanges:structuredClone(p.request.registryChanges),
      appliedRecords:[record],runtimeRecords:[structuredClone(record)],outputDigests:digests};
    put(p.receiptPath,p.receipt);live.generatedFrom['reviewedExam_'+p.requestId]=p.receiptPath;writeAuthority();
  };
  const p1=make(1),p2=make(2),inputCommit=commit('Immutable baseline provider requests');apply(p1);
  const fromVersion=midbatch?'1.0.1':'1.0.2',prior={...binding,templateKey:'TPL_ROOT',questionUid:'qid_v1_'+ 'a'.repeat(64),
    metaFoundationPackId:'MIDDLE2',metaFoundationPackVersion:fromVersion};
  const priorPath=RP+'prior-without-canonical-output.json';
  const priorReceipt={schemaVersion:'archive-reviewed-exam-meta-registration-v2',requestId:'prior-without-canonical-output',
    metadataRegistrationStatus:'REGISTERED',appliedRecords:[prior],runtimeRecords:[structuredClone(prior)],outputDigests:[]};
  apply(p2);put(priorPath,priorReceipt);const publishedHigherCommit=commit('Published higher snapshot with exact prior and baseline provider');
  const remaining=[make(3),make(4),make(5)];const laterRequestCommit=commit('Immutable mixed transaction requests');
  for(const p of remaining)apply(p);const issuedCommit=publishIssued?commit('Official issued version and companion receipts'):null;
  if(laterForeign){foreign.taxonomy.templates.push({templateKey:'TPL_UNRELATED_LATER',parentProblemTypeKey:'PT_FOREIGN',ownerPack:'H1_FOUNDATION',status:'ACTIVE'});
    foreign.pack.templateCount=foreign.taxonomy.templateCount=foreign.taxonomy.templates.length;
    foreign.pack.packVersion=foreign.pack.packVersion.replace(/\d+$/,n=>String(Number(n)+1));writeAuthority();if(publishIssued)commit('Later unrelated foreign-owner template');}
  const current={...prior,metaFoundationPackVersion:'1.0.5'},runtime=structuredClone(current),priorRuntime=structuredClone(prior),priorReceiptRef=ref(priorPath);
  const check=()=>assertReviewedPackVersionLineage({root,current,runtime,prior,priorRuntime,priorReceiptRef,registry});
  const saveReceipt=p=>put(p.receiptPath,p.receipt);
  return{root,put,raw,ref,git,commit,check,registry,base,foreignBase,pack,bindings,taxonomy,foreign,compiled,live,providers,
    prior,priorReceipt,priorPath,priorReceiptRef,current,runtime,writeAuthority,saveReceipt,inputCommit,publishedHigherCommit,laterRequestCommit,issuedCommit};
}

test('mixed add-only template transactions reproduce outputs and preserve a prior issued inside a published batch',t=>{
  const f=fixture(t),before=[f.current,f.prior,f.runtime,f.bindings,f.foreign].map(stable);assert.equal(f.check(),true);
  assert.deepEqual([f.current,f.prior,f.runtime,f.bindings,f.foreign].map(stable),before);
  const versions=f.git('rev-list','--first-parent','HEAD','--',f.base+'/pack.json').split('\n').map(c=>JSON.parse(f.git('show',c+':'+f.base+'/pack.json')).packVersion);
  assert.equal(versions.includes('1.0.1'),false);assert.equal(f.priorReceipt.outputDigests.length,0);assert.equal(f.check(),true);
});
test('mixed transactions retain the original exact-prior-snapshot path',t=>assert.equal(fixture(t,{midbatch:false}).check(),true));
test('pack-only issuance uses exact published prior bindings when it has no bindings output',t=>{
  assert.equal(fixture(t,{midbatch:false,packOnlyBaseline:true}).check(),true);
  assert.throws(fixture(t,{packOnlyBaseline:true}).check,/immutable prior\/request authority/);
});
test('a baseline binding mutation still requires the issued bindings digest',t=>{
  const f=fixture(t,{midbatch:false}),p=f.providers[1];
  p.receipt.outputDigests=p.receipt.outputDigests.filter(d=>d.path!==f.base+'/bindings.json');f.saveReceipt(p);
  assert.throws(f.check,/unique canonical output digest required/);
});
test('receipt-bound midbatch anchoring also preserves a binding-only transaction chain',t=>assert.equal(fixture(t,{mixed:false}).check(),true));
test('historical bindings without an owner field use the exact canonical pack path',t=>{
  const f=fixture(t,{mixed:false,implicitBindingOwner:true});assert.equal(f.check(),true);
});

for(const [name,mutate,pattern]of[
  ['foreign replacement instead of addition',f=>{f.providers[2].receipt.registryChanges[0].before={status:'ACTIVE'};f.saveReceipt(f.providers[2]);},/only target bindings/],
  ['explicit foreign target binding owner',f=>{const p=f.providers[2];p.receipt.registryChanges.find(c=>c.collection==='bindings').after.ownerPack='H1_FOUNDATION';f.saveReceipt(p);},/only target bindings/],
  ['explicit null target binding owner',f=>{const p=f.providers[2];p.receipt.registryChanges.find(c=>c.collection==='bindings').after.ownerPack=null;f.saveReceipt(p);},/only target bindings/],
  ['foreign owner/path mismatch',f=>{f.providers[2].receipt.registryChanges[0].path=f.base+'/taxonomy.json';f.saveReceipt(f.providers[2]);},/only target bindings/],
  ['unknown extra operation including a post-prior curricula edit',f=>{const p=f.providers[2];p.receipt.registryChanges.push({path:f.base+'/pack.json',before:f.pack,after:{...f.pack,curricula:['9999']}});f.saveReceipt(p);},/only target bindings/],
  ['companion current full row changed',f=>{f.foreign.taxonomy.templates[0].definition='changed';f.writeAuthority();},/companion template/],
  ['companion parent changed after immutable approval',f=>{f.foreign.taxonomy.problemTypes[0].definition='changed parent';f.writeAuthority();},/complete companion transaction/],
  ['companion canonical output digest differs',f=>{const p=f.providers[2];p.receipt.outputDigests.find(r=>r.path===f.foreignBase+'/taxonomy.json').sha256='e'.repeat(64);f.saveReceipt(p);},/complete companion transaction/],
  ['companion was not an issued target application',f=>{const p=f.providers[2];p.receipt.appliedRecords[0].templateKey='TPL_ROOT';p.receipt.runtimeRecords[0].templateKey='TPL_ROOT';f.saveReceipt(p);},/issued target binding application/],
  ['prior-version provider output digest differs',f=>{const p=f.providers[0];p.receipt.outputDigests[0].sha256='e'.repeat(64);f.saveReceipt(p);},/immutable prior\/request authority/],
  ['prior-version provider immutable request hash differs',f=>{const p=f.providers[0];p.receipt.requestSha256='e'.repeat(64);f.saveReceipt(p);},/immutable prior\/request authority/],
  ['prior issued raw differs from its immutable ancestor',f=>{f.priorReceipt.extra='unissued';f.put(f.priorPath,f.priorReceipt);f.priorReceiptRef.sha256=sha(f.raw(f.priorPath));},/immutable prior\/request authority/],
  ['higher snapshots and receipts exist only off ancestry',f=>{f.git('update-ref','HEAD',f.inputCommit);},/immutable prior\/request authority/],
  ['intervening target version step is missing',f=>{delete f.live.generatedFrom.reviewedExam_lineage_step_3;delete f.live.generatedFrom['reviewedExam_lineage-step-3'];f.writeAuthority();},/binding version step missing/],
])test('mixed lineage refuses '+name,t=>{const f=fixture(t);assert.equal(f.check(),true);mutate(f);assert.throws(f.check,pattern);});

test('cache cannot retain a companion whose caller registry row changed without changing disk bytes',t=>{
  const f=fixture(t);assert.equal(f.check(),true);f.registry.templates.set('TPL_COMPANION_3',{...f.registry.templates.get('TPL_COMPANION_3'),definition:'unreviewed'});
  assert.throws(f.check,/companion current ACTIVE/);
});
test('a duplicate compiled companion key is rejected even when one row still matches the issued definition',t=>{
  const f=fixture(t);assert.equal(f.check(),true);
  f.compiled.templates.push({...f.compiled.templates.find(r=>r.templateKey==='TPL_COMPANION_3'),definition:'conflicting duplicate'});
  f.put(compiledPath,f.compiled);const index=JSON.parse(f.raw(CANON+'/registry_index.json'));
  index.compiledArtifacts=[f.ref(compiledPath)];f.put(CANON+'/registry_index.json',index);
  assert.throws(f.check,/companion template/);
});
for(const [name,pick]of[
  ['foreign canonical taxonomy',f=>f.foreignBase+'/taxonomy.json'],
  ['original prior-version provider receipt',f=>f.providers[0].receiptPath],
  ['exact prior approval receipt',f=>f.priorPath],
])test('cache cannot retain deleted '+name,t=>{const f=fixture(t);assert.equal(f.check(),true);fs.unlinkSync(path.join(f.root,pick(f)));assert.throws(f.check);});

test('a missing actual issued-version snapshot is not replaced by the midbatch prior anchor',t=>{
  const f=fixture(t,{publishIssued:false});f.pack.packVersion='1.0.6';f.writeAuthority();f.commit('Later active pack without publishing the issued 1.0.5 snapshot');
  assert.throws(f.check,/issued pack version lacks immutable canonical history/);
});

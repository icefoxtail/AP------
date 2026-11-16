import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {verifyIssuedRpmEvidenceContinuity} from '../archive/tools/meta-foundation/issued-rpm-evidence-continuity.mjs';
import {registerReviewedExamV2} from '../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs';
import {nativeReviewReceipt,activeBindingContext,sourceFingerprint,contentFingerprint,planQuestion} from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';
import {loadActiveMetaRegistry,validateActiveMetaFields} from '../archive/tools/meta-foundation/active-registry.mjs';
import {selectPendingNativeRequests} from '../tools/ci/archive-pr-native-preview.mjs';

const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(`blob ${Buffer.byteLength(b)}\0`).update(b).digest('hex');
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const copy=x=>structuredClone(x),json=x=>JSON.stringify(x,null,2)+'\n';
const MASTER='docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const WALK='archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
const META='archive/data/question_metadata.json',IDENTITY='archive/data/question_identity_map.json';
const RECEIPTS='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const CANON='archive/data/meta-foundation/canonical',PACK=CANON+'/packs/middle2';
const statuses=['DIRECT_ACTIVE','FAMILY_ACTIVE','DIRECT_BINDING_GAP','FAMILY_BINDING_GAP','RPM_ONLY'];
const refresh=doc=>{doc.summary={recordCount:doc.records.length,...Object.fromEntries(statuses.map(s=>[s,doc.records.filter(r=>r.mappingStatus===s).length]))};return doc;};

// The ordinary registrar issues the successful receipt. No mock approval,
// bypassed verifier, production data clone or generated production write.
function fixture(t,{mutateReceipt,omitRequest=false}={}) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'issued-rpm-continuity-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const git=(...a)=>execFileSync('git',a,{cwd:root,stdio:['ignore','pipe','pipe'],maxBuffer:4*1024*1024}).toString().trim();
  git('init','-q','--initial-branch=main');git('config','user.name','Synthetic test');git('config','user.email','fixture@example.invalid');git('config','commit.gpgsign','false');
  const put=(p,v)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,Buffer.isBuffer(v)||typeof v==='string'?v:json(v));return{path:p,sha256:sha(fs.readFileSync(f))};};
  const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
  const commit=label=>{git('add','.');git('commit','--allow-empty','-qm',label||'Synthetic bounded fixture');return git('rev-parse','HEAD');};
  const sourceArchiveFile='original/middle/m2/1mid/synthetic-rpm.js',sourcePath='archive/exams/'+sourceArchiveFile;
  const rpmPath={majorUnit:'Unit',midUnit:'Subunit',l3:'RPM concept',l4:'RPM method'};
  const q={id:1,content:'Synthetic question',choices:['a','b'],answer:'a',solution:'Synthetic explanation',image:'',
    curriculum:'2022',curriculumKey:'2022',courseKey:'M2-1',standardCourse:'중2 수학',standardUnitKey:'M2-02',subUnitKey:'M2-02-SUB',
    problemTypeKey:'PT_EXISTING',templateKey:'TPL_EXISTING',crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE',
    level:'중',difficultyBucket:2,difficultyConfidence:'high',difficultyBoundaryFlag:'NONE',legacyLevelCompatibility:'NORMAL',
    primaryMethod:'Synthetic existing method',decisiveStep:'Synthetic existing step',rpmPrimaryId:'M2-RPM-1',rpmPrimaryPath:rpmPath,
    rpmL1:'Unit',rpmL2:'Subunit',rpmL3:'RPM concept',rpmL4:'RPM method'};
  const bank=[q,{...copy(q),id:2,content:'Unselected synthetic question'}];
  const source=()=>put(sourcePath,'window.questionBank = '+JSON.stringify(bank)+';\n');source();
  const masterRef=put(MASTER,{schemaVersion:'js-archive-taxonomy-rpm-primary-v1.0',authorityStatus:'LOCKED',records:[{
    curriculum:'2022',scope:'M2-1',majorUnit:'Unit',midUnit:'Subunit',concepts:[{concept:'RPM concept',problemTypes:[{problemType:'RPM method'}]}]}]});
  const walk=refresh({schemaVersion:'rpm-primary-active-crosswalk-v1',status:'ACTIVE_REFERENCE',grade:'M2',
    rpmAuthority:{source:MASTER,status:'LOCKED'},policy:{purpose:'Synthetic existing RPM provenance'},records:[{
      id:'M2-RPM-1',curriculum:'2022',scope:'M2-1',rpmPath:copy(rpmPath),mappingStatus:'RPM_ONLY',bindingStatus:'NO_ACTIVE_MAPPING'}]});
  const crosswalkRef=put(WALK,walk),reviewRef=put('docs/synthetic-reviewed-values.json',{reviewer:'synthetic-original',newMathematicalQa:false});
  const refs=[reviewRef,crosswalkRef,masterRef];
  const pack={schemaVersion:'meta-foundation-pack-v1',packId:'MIDDLE2',packVersion:'1.0.0',canonicalStatus:'ACTIVE',curricula:['2022'],standardCourses:['중2 수학','M2-1']};
  const pt={problemTypeKey:'PT_EXISTING',canonicalLabelKo:'Existing type',definition:'Synthetic existing type',ownerPack:'MIDDLE2',status:'ACTIVE',sourceUnit:'M2-02',supportingQuestionUids:['uid1'],supportingItemCount:1};
  const tpl={templateKey:'TPL_EXISTING',canonicalLabelKo:'Existing method',definition:'Synthetic existing method',parentProblemTypeKey:'PT_EXISTING',ownerPack:'MIDDLE2',status:'ACTIVE',sourceUnit:'M2-02',supportingQuestionUids:['uid1'],supportingItemCount:1};
  const canonicalSources=[put(PACK+'/pack.json',pack),put(PACK+'/taxonomy.json',{status:'ACTIVE',problemTypes:[pt],templates:[tpl]}),
    put(PACK+'/bindings.json',{status:'ACTIVE',bindings:[{curriculum:'2022',standardCourse:'중2 수학',standardUnitKey:'M2-02',subUnitKey:'M2-02-SUB',problemTypeKey:'PT_EXISTING',status:'ACTIVE',L1:'Unit',L2:'Subunit'}]}),
    put(PACK+'/aliases.json',{aliases:[]}),put(CANON+'/condition_registry.json',{schemaVersion:'meta-foundation-condition-registry-v1',status:'ACTIVE',owner:'CONDITION_CORE',conditions:[],conditionCount:0}),
    put(CANON+'/metadata_rules.json',{status:'ACTIVE',integrationPatterns:['NONE']})];
  put(CANON+'/registry_index.json',{status:'ACTIVE',activePacks:[{id:'MIDDLE2',version:'1.0.0',status:'ACTIVE'}],activeConceptShards:[],
    conditionRegistry:{id:'CONDITION_CORE',version:'1',status:'ACTIVE'},canonicalSources,
    compiledArtifacts:['aliases','concept_registry','condition_registry','curriculum_bindings','taxonomy_registry','meta_foundation_compiled'].map(n=>({path:`archive/data/meta-foundation/compiled/${n}.json`}))});
  put('archive/data/master_tables/js_archive_tag_master.json',[{key:'M2-02',keyType:'standardUnitKey',status:'active',labelKo:'Unit'},
    {key:'M2-02-SUB',keyType:'subUnitKey',status:'active',parentKey:'M2-02',labelKo:'Subunit'}]);
  const ids=bank.map((q,i)=>({questionUid:'uid'+(i+1),sourceArchiveFile,sourceOrdinal:i+1,sourceQuestionNo:String(q.id),status:'VERIFIED',sourceFingerprint:sourceFingerprint(q)}));
  const rows=ids.map((id,i)=>({...id,contentFingerprint:contentFingerprint(bank[i]),reviewStatus:'review_required'}));
  put(META,{records:rows,counts:{}});put(IDENTITY,{records:ids});fs.mkdirSync(path.join(root,'archive/data/meta-foundation/runtime'),{recursive:true});
  const after=Object.fromEntries(Object.entries(q).filter(([k])=>!['id','content','choices','answer','solution','image'].includes(k)));
  const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:'synthetic-issued-rpm',examUid:'exam-rpm',sourceArchiveFile,
    expectedQuestionCount:2,expectedSourceBlobSha1:blob(fs.readFileSync(path.join(root,sourcePath))),scope:'PARTIAL_UIDS',
    approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'synthetic-original-reviewer',evidenceRefs:refs},registryChanges:[],
    items:[{questionUid:'uid1',sourceOrdinal:1,before:Object.fromEntries(Object.keys(after).map(k=>[k,rows[0][k]??null])),after,reason:'Synthetic original approved values',evidenceRefs:refs}]};
  const requestPath='.archive-meta-register/inbox/'+request.requestId+'.json',receiptPath=RECEIPTS+request.requestId+'.json';
  if(!omitRequest)put(requestPath,request);const requestCommit=commit('Original request and exact authorities');
  const result=registerReviewedExamV2({root,request,write:true});assert.equal(result.status,'PASS');
  assert.equal(read(receiptPath).metadataRegistrationStatus,'REGISTERED');
  if(mutateReceipt){const r=read(receiptPath);mutateReceipt(r);put(receiptPath,r);}
  if(!omitRequest)fs.unlinkSync(path.join(root,requestPath));const issuedCommit=commit('Official issued receipt; original request consumed');
  const receipt=read(receiptPath),receiptBytes=fs.readFileSync(path.join(root,receiptPath));
  const append=()=>{const x=copy(walk);x.records.push({...copy(x.records[0]),id:'M2-RPM-2',rpmPath:{...rpmPath,l4:'Unrelated added reference'}});put(WALK,refresh(x));return commit('Append unrelated RPM row');};
  const verify=()=>verifyIssuedRpmEvidenceContinuity({root,receipt:read(receiptPath),receiptPath,evidenceRef:crosswalkRef});
  const context=()=>{const current=read(META).records.find(r=>r.questionUid==='uid1'),identity=read(IDENTITY).records.find(r=>r.questionUid==='uid1');
    const runtimePath=fs.readdirSync(path.join(root,'archive/data/meta-foundation/runtime')).filter(p=>p.endsWith('.json')).map(p=>'archive/data/meta-foundation/runtime/'+p).find(p=>read(p).records?.some(r=>r.questionUid==='uid1'));
    const runtime=read(runtimePath),bytes=fs.readFileSync(path.join(root,sourcePath)),registry=loadActiveMetaRegistry(root);
    return{source:sourceArchiveFile,ordinal:1,question:copy(bank[0]),previous:copy(q),current,identity,registry,validate:validateActiveMetaFields,
      nativeSource:{root,bytes,blobSha1:blob(bytes),bank:copy(bank),runtimeRecord:runtime.records.find(r=>r.questionUid==='uid1'),runtimeStatus:runtime.status,
        identityMap:read(IDENTITY),identityByJoin:new Map(ids.map(id=>[sourceArchiveFile+'#'+id.sourceOrdinal,id]))}};};
  const native=()=>{const c=context(),active=activeBindingContext({candidate:c.current,check:{curriculum:'2022'},registry:c.registry,runtimeOwner:'MIDDLE2'});
    return active.reason?null:nativeReviewReceipt({...c,...active});};
  const preserve=()=>{bank[1].content='Unselected changed synthetic question';source();
    const priorRef={path:receiptPath,sha256:sha(receiptBytes)},r={schemaVersion:request.schemaVersion,requestId:'synthetic-preserve-rpm',examUid:request.examUid,
      sourceArchiveFile,scope:'PARTIAL_UIDS',expectedQuestionCount:2,expectedSourceBlobSha1:blob(fs.readFileSync(path.join(root,sourcePath))),
      approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'synthetic-preserver',sourceRebind:{priorReceiptRef:priorRef},evidenceRefs:[priorRef]},registryChanges:[],
      items:[{questionUid:'uid1',sourceOrdinal:1,before:{},after:{},reason:'Preserve original values after outside UID change',evidenceRefs:[priorRef]}]};
    const p='.archive-meta-register/inbox/'+r.requestId+'.json';put(p,r);commit('Current preserving request');return{request:r,path:p,receiptPath:RECEIPTS+r.requestId+'.json'};};
  return{root,git,put,read,commit,request,requestPath,requestCommit,issuedCommit,receipt,receiptPath,receiptBytes,refs,crosswalkRef,masterRef,reviewRef,
    bank,source,sourcePath,sourceArchiveFile,walk,append,verify,native,context,preserve};
}

test('actual ordinary issuance keeps old RPM evidence after append; no approval bytes change',t=>{
  const f=fixture(t);assert.equal(f.native(),f.receiptPath);f.append();
  const before=sha(f.receiptBytes),r=f.verify();assert.equal(r.issuedCommit,f.issuedCommit);
  assert.equal(r.originalRequestRef.commit,f.requestCommit);assert.equal(r.retainedRecordCount,1);assert.equal(r.appendedRecordCount,1);
  assert.equal(r.authorityUse,'RPM_PATH_PROVENANCE_ONLY');assert.equal(r.newMetadataApprovals,0);
  assert.equal(f.native(),f.receiptPath);assert.equal(sha(fs.readFileSync(path.join(f.root,f.receiptPath))),before);
});
test('preview stages current bytes; official preserving receipt replays the original native leaf',t=>{
  const f=fixture(t);f.append();const p=f.preserve();
  const selected=selectPendingNativeRequests({root:f.root,headSha:f.git('rev-parse','HEAD')});assert.equal(selected.length,1);
  assert.equal(selected[0].evidence.find(x=>x.path===WALK).sha256,sha(fs.readFileSync(path.join(f.root,WALK))));
  const result=registerReviewedExamV2({root:f.root,request:p.request,write:true});assert.equal(result.newMetadataApprovals,0);
  assert.equal(f.native(),p.receiptPath);assert.deepEqual(f.read(f.receiptPath),f.receipt);
});
test('preview revalidates historical typed ref even when current path was already staged',t=>{
  const f=fixture(t);f.append();const p=f.preserve();const current={path:WALK,sha256:sha(fs.readFileSync(path.join(f.root,WALK)))};
  p.request.approval.evidenceRefs.unshift(current);f.put(p.path,p.request);f.commit();
  assert.equal(selectPendingNativeRequests({root:f.root,headSha:f.git('rev-parse','HEAD')}).length,1);
  p.request.items[0].evidenceRefs.push(f.crosswalkRef);f.put(p.path,p.request);f.commit();
  assert.throws(()=>selectPendingNativeRequests({root:f.root,headSha:f.git('rev-parse','HEAD')}),/EVIDENCE_DRIFT/);
});

for(const [name,mutate]of [
  ['existing row mutation',d=>{d.records[0].bindingStatus='DIFFERENT';}],
  ['existing row deletion',d=>{d.records.shift();refresh(d);}],
  ['existing row reordering',d=>{d.records.reverse();}],
  ['duplicate record id',d=>{d.records[1].id=d.records[0].id;}],
  ['false summary',d=>{d.summary.recordCount++;}],
  ['authority header mutation',d=>{d.policy.purpose='different authority';}],
])test('truthfully committed crosswalk '+name+' is rejected',t=>{
  const f=fixture(t);f.append();const d=f.read(WALK);mutate(d);f.put(WALK,d);f.commit();assert.throws(f.verify,/issued RPM evidence continuity/);assert.equal(f.native(),null);
});
for(const [name,mutate]of [
  ['PT/TPL authority promotion',r=>{r.rpmPrimaryBindings[0].selectsPtTpl=true;}],
  ['wrong authority use',r=>{r.rpmPrimaryBindings[0].authorityUse='SEMANTIC_APPROVAL';}],
  ['duplicate selected binding',r=>{r.rpmPrimaryBindings.push(copy(r.rpmPrimaryBindings[0]));}],
  ['wrong ordinal',r=>{r.rpmPrimaryBindings[0].sourceOrdinal=2;}],
  ['wrong UID',r=>{r.rpmPrimaryBindings[0].questionUid='other-uid';}],
  ['wrong record',r=>{r.rpmPrimaryBindings[0].recordId='M2-RPM-OTHER';}],
  ['wrong RPM path',r=>{r.rpmPrimaryBindings[0].rpmPath.l4='Different path';}],
  ['wrong bound master SHA',r=>{r.rpmPrimaryBindings[0].masterRef.sha256='0'.repeat(64);}],
  ['wrong request digest',r=>{r.requestSha256='0'.repeat(64);}],
  ['wrong runtime RPM value',r=>{r.runtimeRecords[0].rpmL4='different';}],
])test('issued typed claim '+name+' cannot establish continuity',t=>{
  const f=fixture(t,{mutateReceipt:mutate});f.append();assert.throws(f.verify,/issued RPM evidence continuity|RPM provenance/);
});
test('missing historical original request fails closed',t=>{const f=fixture(t,{omitRequest:true});f.append();assert.throws(f.verify,/original request ancestry/);});
test('uncommitted current crosswalk is not a fixed candidate',t=>{const f=fixture(t);f.append();const d=f.read(WALK);d.records[1].note='uncommitted';f.put(WALK,d);assert.throws(f.verify,/live crosswalk differs from HEAD/);});
test('changed master fails even when its new bytes are committed',t=>{const f=fixture(t);f.append();const d=f.read(MASTER);d.records[0].concepts[0].problemTypes[0].problemType='different';f.put(MASTER,d);f.commit();assert.throws(f.verify,/RPM master changed/);});
test('selected source question change is not hidden by outside source preservation',t=>{const f=fixture(t);f.append();f.bank[0].content+=' changed';f.source();f.commit();assert.throws(f.verify,/selected whole question/);});
test('same-row whitespace-only digest rewrite is outside append continuity',t=>{const f=fixture(t);f.put(WALK,JSON.stringify(f.walk));f.commit();assert.throws(f.verify,/append-only/);});
test('warm success does not cache approval verdict or live bytes',t=>{const f=fixture(t);f.append();assert.ok(f.verify());const stat=fs.statSync(path.join(f.root,WALK));
  const d=f.read(WALK);d.records[0].bindingStatus='CHANGED_MAPPING!!';f.put(WALK,d);fs.utimesSync(path.join(f.root,WALK),stat.atime,stat.mtime);
  assert.throws(f.verify,/live crosswalk differs from HEAD/);assert.equal(f.native(),null);});
test('live receipt replacement is refused even when supplied object follows replacement',t=>{const f=fixture(t);f.append();const d=f.read(f.receiptPath);d.approval.approvedBy='replacement';f.put(f.receiptPath,d);assert.throws(f.verify,/live receipt differs from HEAD/);});
test('committed receipt rewrite cannot invent a new issuance addition',t=>{const f=fixture(t);f.append();const d=f.read(f.receiptPath);d.approval.approvedBy='replacement';f.put(f.receiptPath,d);f.commit();assert.throws(f.verify,/issued receipt addition/);});
test('symlink crosswalk is refused before historical fallback',t=>{const f=fixture(t);f.append();const full=path.join(f.root,WALK);fs.renameSync(full,full+'.saved');fs.symlinkSync(full+'.saved',full);assert.throws(f.verify,/symlink/);});
test('Git HEAD loss cannot become a no-claim exemption after success',t=>{const f=fixture(t);f.append();assert.ok(f.verify());fs.renameSync(path.join(f.root,'.git'),path.join(f.root,'.git-disabled'));assert.throws(f.verify,/Git evidence unavailable/);});
test('a different pinned HEAD cannot substitute for actual ancestry',t=>{const f=fixture(t);f.append();assert.throws(()=>verifyIssuedRpmEvidenceContinuity({root:f.root,receipt:f.receipt,receiptPath:f.receiptPath,evidenceRef:f.crosswalkRef,headSha:f.issuedCommit}),/actual fixed HEAD/);});
test('unmerged original issuance cannot supply a copied receipt with current crosswalk bytes',t=>{
  const f=fixture(t);f.append();const currentWalk=f.read(WALK);f.git('switch','-q','-c','without-issued-ancestor',f.requestCommit);
  f.put(f.receiptPath,f.receiptBytes);f.put(WALK,currentWalk);f.commit('Copy without the historical issuance snapshot');
  assert.throws(f.verify,/issued crosswalk SHA mismatch/);
});
test('selected duplicate in another current crosswalk remains ambiguous',t=>{const f=fixture(t);f.append();f.put(WALK.replace('middle2.json','other.json'),f.walk);f.commit();assert.throws(f.verify,/record ID missing or ambiguous/);});
test('untyped ordinary evidence drift still refuses native and preview',t=>{const f=fixture(t);f.append();f.put(f.reviewRef.path,{reviewer:'changed'});f.commit();assert.equal(f.native(),null);f.preserve();assert.throws(()=>selectPendingNativeRequests({root:f.root,headSha:f.git('rev-parse','HEAD')}),/EVIDENCE_DRIFT/);});
test('marker removal is not a generic SHA exemption',t=>{const f=fixture(t);f.append();const r=f.read(f.receiptPath);delete r.rpmPrimaryBindings;f.put(f.receiptPath,r);f.commit();
  assert.equal(f.verify(),null);assert.equal(f.native(),null);});
test('current ACTIVE canonical guard still rejects a changed type',t=>{const f=fixture(t);f.append();assert.equal(planQuestion(f.context()).status,'ALREADY_REGISTERED');
  const c=f.context();c.registry.problemTypes.get('PT_EXISTING').status='RETIRED';assert.notEqual(planQuestion(c).status,'ALREADY_REGISTERED');});
test('fresh current authority hold still blocks reuse after a positive continuity read',t=>{
  const f=fixture(t);f.append();assert.ok(f.verify());assert.equal(f.native(),f.receiptPath);
  const rows=f.read(META);rows.records[0].metadataAuthorityHold={schemaVersion:'archive-native-authority-hold-v1',status:'AUTHORITY_REVIEW_REQUIRED'};
  f.put(META,rows);assert.ok(f.verify(),'evidence continuity alone does not grant approval');assert.equal(f.native(),null);
});

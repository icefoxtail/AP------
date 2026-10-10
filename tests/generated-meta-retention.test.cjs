'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const os=require('node:os');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const {validateMeta,validateProjection,validateReviewBinding,validateAuthorityBinding,validateMetaTaxonomyBindings,audit,sha256}=require('../archive/tools/generated-meta-retention-gate.cjs');
const meta={
 rpmL1:'H1-RPM-L1-KEY',rpmL2:'H1-RPM-L2-KEY',rpmL3:'H1-RPM-L3-KEY',
 rpmL4:'GEN-EXT-L4-KEY',rpmL4Namespace:'GENERATED_EXT_L4',
 generatedL4RegistryRef:'archive/generated/lite/v1/2022/H1/H22-C2-05-CORE/extension-l4/registry.json',
 crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE',
 difficultyBucket:3,level:'중',problemTypeKey:null,templateKey:null,
 metaDebt:{problemTypeKey:'mapping adjudication required',templateKey:'template review required'}
};
const SHA='a'.repeat(64);
const valid=()=>({uid:'ALITE-NEW-001',approvedMeta:meta,indexMeta:meta,consumerMeta:meta,
 questionMeta:meta,sourceMeta:meta,
 digests:{index:sha256(meta),consumer:sha256(meta),question:sha256(meta),source:sha256(meta),authority:sha256(meta)},
 evidence:{index:SHA,consumer:SHA,authority:SHA}});
test('legacy 323 stay exempt while every approved post-cutover UID passes Meta parity',()=>{
 const r=audit(path.resolve(__dirname,'..'));
 assert.equal(r.status,'PASS_NEW_UID_SCOPE_ONLY',r.errors.join('\n'));
 assert.equal(r.legacyExemptNotRecertified,323);
 const index=require('../archive/data/generated-lite-consumer/v1/index.json');
 assert.equal(r.newUidChecked,index.records.length-323);
 assert.equal(r.total,index.approvedCount);
 assert.ok(r.newUidChecked>=23);
});
test('fully evidenced future UID passes projection-only gate',()=>{
 assert.deepEqual(validateMeta(meta),[]);
 assert.deepEqual(validateProjection(valid()),[]);
});
test('missing Meta differs from explicit NONE and empty arrays',()=>{
 for(const field of ['crossConceptKeys','conditionKeys','integrationPattern','rpmL2','rpmL4']){
  const v={...meta};delete v[field];
  assert.notEqual(validateMeta(v).length,0,field);
 }
});
test('1-5 difficulty, L4 provenance and mapping holds are enforced',()=>{
 for(const patch of [{difficultyBucket:0},{difficultyBucket:6},{difficultyBucket:'3'},
   {rpmL4Namespace:'INVALID'},{generatedL4RegistryRef:''},
   {problemTypeKey:null,metaDebt:{}},{templateKey:undefined}]){
  assert.ok(validateMeta({...meta,...patch}).length);
 }
});
test('any projection mismatch, missing digest or missing review evidence is FAIL',()=>{
 const a=valid();a.consumerMeta={...meta,conditionKeys:['FAKE']};
 assert.ok(validateProjection(a).some(x=>x.includes('consumerMeta:META_PARITY')));
 const b=valid();b.digests.index='0'.repeat(64);
 assert.ok(validateProjection(b).some(x=>x.includes('index:META_SHA')));
 const c=valid();c.evidence.authority=undefined;
 assert.ok(validateProjection(c).some(x=>x.includes('META_REVIEW_EVIDENCE_REQUIRED')));
});


test('existing source-backed RPM draft is represented honestly and never falsified as LOCKED',()=>{
 const draft={...meta,rpmL4Namespace:'RPM_EXISTING_DRAFT',
  rpmPrimaryRecordId:'H1-RPM-234',
  rpmDraftAuthorityRef:'archive/data/meta-foundation/compiled/taxonomy_registry.json',
  rpmDraftAuthoritySha256:'b'.repeat(64)};
 assert.deepEqual(validateMeta(draft),[]);
 assert.ok(validateMeta({...draft,rpmPrimaryRecordId:''}).some(x=>x.includes('rpmPrimaryRecordId')));
 assert.ok(validateMeta({...draft,rpmDraftAuthorityRef:'alive/unverified.md'}).some(x=>x.includes('rpmDraftAuthorityRef')));
 assert.ok(validateMeta({...draft,rpmDraftAuthoritySha256:''}).some(x=>x.includes('rpmDraftAuthoritySha256')));
});

test('generated L4 authority validation reads the registry extensions array and its parent record ID list',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'generated-l4-extensions-'));
 try{
  const uid='ALITE-PALMA25-2MID-Q18-A1',extensionId='EXT-L4-H1-Q18-CENTROID-DIRECT-AREA';
  const authorityPath='archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/test.json';
  const registryPath='archive/generated/lite/v1/2022/H1/H22-C2-01-GEOMETRY_APPLICATION/extension-l4/test.json';
  const authorityBytes=Buffer.from(JSON.stringify({records:[{id:'H1-RPM-209',standardCourse:'공통수학2',standardUnitKey:'H22-C2-01',subUnitKey:'H22-C2-01-GEOMETRY_APPLICATION',rpmPath:{majorUnit:'도형의 방정식',midUnit:'삼각형',l3:'삼각형의 무게중심',l4:'중선과 무게중심'}}]},null,2)+'\n');
  const extension={id:extensionId,labelKo:'무게중심을 이용한 부분 넓이',parentRpmL3RecordIds:['H1-RPM-209'],sourceQid:18,exampleUids:[uid],status:'GENERATED_ACTIVE_CREATOR_CANDIDATE_ONLY'};
  const makeRegistry=(extensions,parentRpmL3RecordIds=['H1-RPM-209'])=>Buffer.from(JSON.stringify({schemaVersion:'ALIVE_GENERATED_EXTENSION_L4_PALMA_Q18_V1',parentRpmL3RecordIds,extensions},null,2)+'\n');
  const registryBytes=makeRegistry([extension]);
  for(const [rel,bytes] of [[authorityPath,authorityBytes],[registryPath,registryBytes]]){
   const full=path.join(root,rel);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,bytes);
  }
  const fileSha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
  const sourceMeta={rpmL1:'도형의 방정식',rpmL2:'삼각형',rpmL3:'삼각형의 무게중심',rpmL4:extensionId,
   rpmL4Namespace:'GENERATED_EXT_L4',rpmPrimaryRecordId:'H1-RPM-209',rpmAuthorityRef:authorityPath,rpmAuthoritySha256:fileSha(authorityBytes),
   generatedL4RegistryRef:registryPath,generatedL4RegistrySha256:fileSha(registryBytes)};
  const question={standardCourse:'공통수학2',standardUnitKey:'H22-C2-01',subUnitKey:'H22-C2-01-GEOMETRY_APPLICATION'};
  const result=validateAuthorityBinding(root,sourceMeta,question,uid);
  assert.deepEqual(result.issues,[]);
  assert.equal(result.primaryRecord.id,'H1-RPM-209');
  const revalidate=registry=>{
   const bytes=makeRegistry(registry);fs.writeFileSync(path.join(root,registryPath),bytes);
   sourceMeta.generatedL4RegistrySha256=fileSha(bytes);
   return validateAuthorityBinding(root,sourceMeta,question,uid).issues;
  };
  assert.ok(revalidate([extension,{...extension,labelKo:'duplicate extension'}]).includes('GENERATED_L4_CANDIDATE_NOT_UNIQUE'));
  assert.ok(revalidate([{...extension,status:'DRAFT',reviewStatus:'REVIEW_PASS'}]).includes('GENERATED_L4_NOT_APPROVED'));
  const wrongParentBytes=makeRegistry([{...extension,parentRpmL3RecordIds:['H1-RPM-999']}],['H1-RPM-999']);
  fs.writeFileSync(path.join(root,registryPath),wrongParentBytes);sourceMeta.generatedL4RegistrySha256=fileSha(wrongParentBytes);
  assert.ok(validateAuthorityBinding(root,sourceMeta,question,uid).issues.includes('GENERATED_L4_PARENT_L3_MISMATCH'));
  assert.ok(revalidate([{...extension,exampleUids:[]}]).includes('GENERATED_L4_UID_SCOPE_UNPROVEN'));

  const q23Uid='ALITE-PALMA25-2MID-Q23-C2',q23ExtensionId='EXT-H1-C2-02-Q23-STRIP-PERIMETER';
  const q23AuthorityBytes=Buffer.from(JSON.stringify({records:[{id:'H1-RPM-216',standardCourse:'공통수학2',standardUnitKey:'H22-C2-02',subUnitKey:'H22-C2-02-RELATION',rpmPath:{majorUnit:'도형의 방정식',midUnit:'직선의 방정식',l3:'점과 직선 사이의 거리',l4:'거리 관계'}}]},null,2)+'\n');
  const q23RegistryPath='archive/generated/lite/v1/2022/H1/H22-C2-02-RELATION/extension-l4/registry.json';
  const q23RegistryBytes=Buffer.from(JSON.stringify({schemaVersion:'ALIVE_GENERATED_EXT_L4_QID9_V1',status:'GENERATED_ACTIVE',standardCourse:'공통수학2',standardUnitKey:'H22-C2-02',subUnitKey:'H22-C2-02-RELATION',candidates:[{
   generatedExtL4Id:q23ExtensionId,labelKo:'거리 자취가 이루는 사각형의 둘레',parentLockedPrimaryL3:'점과 직선 사이의 거리',exampleUids:[q23Uid],status:'GENERATED_ACTIVE',reviewStatus:'CREATOR_ONLY_OPEN_BOOK_NOT_RUN'
  }]},null,2)+'\n');
  for(const [rel,bytes] of [[authorityPath,q23AuthorityBytes],[q23RegistryPath,q23RegistryBytes]]){
   const full=path.join(root,rel);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,bytes);
  }
  const q23Meta={rpmL1:'도형의 방정식',rpmL2:'직선의 방정식',rpmL3:'점과 직선 사이의 거리',rpmL4:q23ExtensionId,
   rpmL4Namespace:'GENERATED_EXT_L4',rpmPrimaryRecordId:'H1-RPM-216',rpmAuthorityRef:authorityPath,rpmAuthoritySha256:fileSha(q23AuthorityBytes),
   generatedL4RegistryRef:q23RegistryPath,generatedL4RegistrySha256:fileSha(q23RegistryBytes)};
  const q23Question={standardCourse:'공통수학2',standardUnitKey:'H22-C2-02',subUnitKey:'H22-C2-02-RELATION'};
  const q23Result=validateAuthorityBinding(root,q23Meta,q23Question,q23Uid);
  assert.deepEqual(q23Result.issues,[]);
  assert.equal(q23Result.primaryRecord.id,'H1-RPM-216');
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('Q23-C3 generated-only concepts require the exact approved package receipt before entering Meta search',()=>{
 const root=path.resolve(__dirname,'..');
 const packagePath='alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q23_PACKAGE.json';
 const packageItem=JSON.parse(fs.readFileSync(path.join(root,packagePath),'utf8')).items.find(item=>item.uid==='ALITE-PALMA25-2MID-Q23-C3');
 const crosswalkRef='archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json';
 const generatedL4Ref='archive/generated/lite/v1/2022/H1/H22-C2-02-RELATION/extension-l4/registry.json';
 const registryRef=packageItem.meta.generatedMetaRegistryRef;
 const fileSha=relative=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,relative))).digest('hex');
 const trackedBlob=relative=>{
  const blobSha1=execFileSync('git',['rev-parse',`HEAD:${relative}`],{cwd:root,encoding:'utf8'}).trim();
  const bytes=execFileSync('git',['cat-file','blob',blobSha1],{cwd:root});
  return {sha256:crypto.createHash('sha256').update(bytes).digest('hex'),blobSha1};
 };
 const generatedL4=trackedBlob(generatedL4Ref);
 const source=packageItem.meta;
 const meta={rpmL1:source.rpmL1,rpmL2:source.rpmL2,rpmL3:source.rpmL3,rpmL4:source.generatedExtL4Id,
  rpmL4Namespace:'GENERATED_EXT_L4',rpmPrimaryRecordId:'H1-RPM-216',rpmAuthorityRef:crosswalkRef,rpmAuthoritySha256:fileSha(crosswalkRef),
  generatedL4RegistryRef:generatedL4Ref,generatedL4RegistrySha256:generatedL4.sha256,generatedL4RegistryGitBlobSha1:generatedL4.blobSha1,secondaryConceptKeys:[],
  crossConceptKeys:source.crossConceptKeys,conditionKeys:source.conditionKeys,crossConceptRegistryRef:registryRef,conditionRegistryRef:registryRef,
  sourceKind:'generated',difficultyBucket:source.difficultyBucket,level:source.level,problemTypeKey:source.problemTypeKey,templateKey:source.templateKey,
  integrationPattern:source.integrationPattern,standardCourse:source.standardCourse,standardUnitKey:source.standardUnitKey,subUnitKey:source.subUnitKey};
 const question={standardCourse:source.standardCourse,standardUnitKey:source.standardUnitKey,subUnitKey:source.subUnitKey};
 const authority=validateAuthorityBinding(root,meta,question,packageItem.uid);
 assert.deepEqual(authority.issues,[]);
 assert.deepEqual(validateMetaTaxonomyBindings(root,meta,authority.primaryRecord,packageItem.uid),[]);
});

test('staged new review evidence uses the Git index clean blob while CRLF-only worktree bytes remain equivalent',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'generated-meta-staged-evidence-'));
 try{
  execFileSync('git',['init','--quiet'],{cwd:root});
  execFileSync('git',['config','core.autocrlf','false'],{cwd:root});
  execFileSync('git',['config','core.safecrlf','false'],{cwd:root});
  fs.writeFileSync(path.join(root,'.gitattributes'),'*.json text eol=lf\n');
  execFileSync('git',['add','--','.gitattributes'],{cwd:root});
  execFileSync('git',['-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','--quiet','-m','fixture attributes'],{cwd:root});
  const uid='ALITE-PALMA25-2MID-Q23-C3',metaFinalSha='a'.repeat(64),approvalBasis='USER_DIRECTED_QUALITY_APPROVED_TEST_STAGED';
  const doc={schemaVersion:'GENERATED_META_REVIEW_EVIDENCE_V1',items:[{uid,reviewStatus:'USER_DIRECTED_QUALITY_APPROVED',metaFinalSha256:metaFinalSha,approvalBasis,scopeUids:[uid]}]};
  const canonical=Buffer.from(JSON.stringify(doc,null,2)+'\n','utf8'),crlf=Buffer.from(canonical.toString('utf8').replace(/\n/g,'\r\n'),'utf8');
  const evidencePath='alive/06_EXECUTION/fixture/evidence.json';
  fs.mkdirSync(path.dirname(path.join(root,evidencePath)),{recursive:true});fs.writeFileSync(path.join(root,evidencePath),crlf);
  execFileSync('git',['add','--',evidencePath],{cwd:root});
  const binding={path:evidencePath,sha256:crypto.createHash('sha256').update(canonical).digest('hex'),reviewStatus:'USER_DIRECTED_QUALITY_APPROVED',approvalBasis,scopeUids:[uid]};
  assert.deepEqual(validateReviewBinding(root,binding,uid,metaFinalSha,'USER_DIRECTED_QUALITY_APPROVED'),[]);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

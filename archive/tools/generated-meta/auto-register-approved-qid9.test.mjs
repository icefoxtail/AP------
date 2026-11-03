import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {eligibleApprovedQids,missingApprovedUids,unknownApprovedQid9Manifests,verifyExplicitPackageApproval,resolveQ21ParameterRpmRecord,resolveQ22B2RpmRecord,verifySourceProjectionBinding,verifyApprovedQuestionBodyParity,canonicalIntegrationPattern,isAllowedGeneratedMetaProjectionRepair,sealedCrosswalkDigestOnlyDrift,reconcileRpmResolutionBytes} from './auto-register-approved-qid9.mjs';
import {gitBlobSha,metaSha256,sha256Bytes} from './register-approved-generated-meta.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const DIR='alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/';
const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,DIR+'GPT_QID9_EXAM_MANIFEST.json'),'utf8'));
const receiptPath=DIR+'GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json';
const receipt=JSON.parse(fs.readFileSync(path.join(ROOT,receiptPath),'utf8'));

test('approval discovery ignores drafts and only returns explicit approved/review-pass manifest rows',()=>{
  const rows=eligibleApprovedQids({qidLedger:[
    {qid:1,reviewStatus:'NOT_REVIEWED'},
    {qid:2,reviewStatus:'CREATE_DRAFT_ONLY'},
    {qid:3,reviewStatus:'USER_DIRECTED_QUALITY_APPROVED'},
    {qid:4,reviewStatus:'GPT_OPEN_BOOK_REVIEW_PASS'}
  ]});
  assert.deepEqual(rows.map(row=>row.qid),[3,4]);
});

test('approval projection rejects approved QID9 rows from another school outside its supported source scope',()=>{
  const rows=unknownApprovedQid9Manifests([
    {path:DIR+'GPT_QID9_EXAM_MANIFEST.json',value:{qidLedger:[{qid:17,reviewStatus:'USER_DIRECTED_QUALITY_APPROVED'}]}},
    {path:'alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2026/other/GPT_QID9_EXAM_MANIFEST.json',value:{qidLedger:[{qid:1,reviewStatus:'USER_DIRECTED_QUALITY_APPROVED'},{qid:2,reviewStatus:'CREATE_DRAFT_ONLY'}]}}
  ],DIR+'GPT_QID9_EXAM_MANIFEST.json');
  assert.deepEqual(rows,[{manifestPath:'alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2026/other/GPT_QID9_EXAM_MANIFEST.json',approvedQidCount:1}]);
});

test('the Palma receipt binds all seven exact package Git blobs and 63 approved UIDs',()=>{
  assert.equal(receipt.scope.uidCount,63);
  assert.equal(receipt.scope.uids.length,63);
  const rows=manifest.qidLedger.filter(row=>row.qid>=17&&row.qid<=23);
  const verified=[];
  for(const row of rows){
    const packagePath=DIR+`GPT_QID9_Q${String(row.qid).padStart(2,'0')}_PACKAGE.json`;
    const actualReceipt=JSON.parse(fs.readFileSync(path.join(ROOT,row.approvalEvidence),'utf8'));
    const result=verifyExplicitPackageApproval({root:ROOT,manifest,manifestRow:row,receipt:actualReceipt,receiptPath:row.approvalEvidence,packagePath});
    verified.push(...result.pkg.items.map(item=>item.uid));
    assert.equal(result.basis,'USER_DIRECTED_QUALITY_APPROVED_20261010_PALMA_Q17_Q23_63');
    assert.equal(result.sourceHistoricalBlobSha,manifest.sourceBlobSha);
  }
  assert.equal(verified.length,63);
  assert.equal(new Set(verified).size,63);
  assert.deepEqual([...verified].sort(),[...receipt.scope.uids].sort());
});

test('approved UID completeness reports a missing UID and treats duplicate registration as incomplete',()=>{
  const expected=['ALITE-TEST-Q17-A1','ALITE-TEST-Q17-A2','ALITE-TEST-Q17-A3'];
  assert.deepEqual(missingApprovedUids(expected,{records:[{uid:expected[0]},{uid:expected[1]},{uid:expected[1]}]}),[expected[1],expected[2]]);
  assert.deepEqual(missingApprovedUids(expected,{records:expected.map(uid=>({uid}))}),[]);
});

test('manifest approval without exact receipt/package binding fails closed',()=>{
  const row=manifest.qidLedger.find(entry=>entry.qid===17);
  const packagePath=DIR+'GPT_QID9_Q17_PACKAGE.json';
  assert.throws(()=>verifyExplicitPackageApproval({root:ROOT,manifest,manifestRow:row,receipt:{...receipt,status:'DRAFT'},receiptPath,packagePath}),/APPROVAL_RECEIPT_STATUS_OR_BASIS_MISMATCH/);
  const wrongPackage={...receipt,packages:receipt.packages.map(entry=>entry.sourceQid===17?{...entry,sha256:'0'.repeat(64)}:entry)};
  assert.throws(()=>verifyExplicitPackageApproval({root:ROOT,manifest,manifestRow:row,receipt:wrongPackage,receiptPath,packagePath}),/APPROVED_PACKAGE_BYTES_MISMATCH/);
});

test('Q21 C1-C3 preserve declared RPM 247 and resolve their exact parameter L4 to active crosswalk record 248',()=>{
  const records=[
    {id:'H1-RPM-247',standardUnitKey:'H22-C2-06',subUnitKey:'H22-C2-06-CORE',rpmPath:{l3:'필요조건·충분조건',l4:'조건 관계'}},
    {id:'H1-RPM-248',standardUnitKey:'H22-C2-06',subUnitKey:'H22-C2-06-CORE',mappingStatus:'FAMILY_ACTIVE',bindingStatus:'ACTIVE',templateCandidates:[{templateKey:'TPL_NEC_SUFF_INTERVAL_PARAMETER'}],rpmPath:{l3:'필요조건·충분조건',l4:'매개변수'}}
  ];
  const uids=['ALITE-PALMA25-2MID-Q21-C1','ALITE-PALMA25-2MID-Q21-C2','ALITE-PALMA25-2MID-Q21-C3'];
  const results=uids.map(uid=>resolveQ21ParameterRpmRecord({records,uid,declaredRecordIds:['H1-RPM-247'],standardUnitKey:'H22-C2-06',subUnitKey:'H22-C2-06-CORE',rpmL3:'필요조건·충분조건',rpmL4:'매개변수',templateKey:'TPL_NEC_SUFF_INTERVAL_PARAMETER'}));
  assert.deepEqual(results.map(result=>result.record.id),['H1-RPM-248','H1-RPM-248','H1-RPM-248']);
  assert.deepEqual(results.map(result=>result.evidence.uid),uids);
  assert.deepEqual(results.map(result=>result.evidence.declaredRecordIds),uids.map(()=>['H1-RPM-247']));
  assert.deepEqual(results.map(result=>result.evidence.selectedRecordId),uids.map(()=>'H1-RPM-248'));
  assert.deepEqual(results.map(result=>result.evidence.selectionBasis),uids.map(()=>'EXACT_ACTIVE_UNIT_SUBUNIT_L3_L4_AND_TEMPLATE'));
});

test('Q21 parameter RPM disambiguation fails closed if selected record is not uniquely exact and active or scope exceeds C1-C3',()=>{
  const input={uid:'ALITE-PALMA25-2MID-Q21-C2',declaredRecordIds:['H1-RPM-247'],standardUnitKey:'H22-C2-06',subUnitKey:'H22-C2-06-CORE',rpmL3:'필요조건·충분조건',rpmL4:'매개변수',templateKey:'TPL_NEC_SUFF_INTERVAL_PARAMETER'};
  const record={id:'H1-RPM-248',standardUnitKey:input.standardUnitKey,subUnitKey:input.subUnitKey,mappingStatus:'FAMILY_ACTIVE',bindingStatus:'ACTIVE',templateCandidates:[{templateKey:input.templateKey}],rpmPath:{l3:input.rpmL3,l4:input.rpmL4}};
  assert.throws(()=>resolveQ21ParameterRpmRecord({...input,records:[{...record,rpmPath:{...record.rpmPath,l4:'조건 관계'}}]}),/Q21_PARAMETER_RPM_EXACT_ACTIVE_RECORD_NOT_UNIQUE/);
  assert.throws(()=>resolveQ21ParameterRpmRecord({...input,records:[record,{...record,id:'H1-RPM-249'}]}),/Q21_PARAMETER_RPM_EXACT_ACTIVE_RECORD_NOT_UNIQUE/);
  assert.throws(()=>resolveQ21ParameterRpmRecord({...input,uid:'ALITE-PALMA25-2MID-Q21-A1',records:[record]}),/Q21_PARAMETER_RPM_EXACT_ACTIVE_RECORD_NOT_UNIQUE/);
});

test('Q22-B2 keeps declared RPM records 217 and 218 while selecting exact general-form record 218',()=>{
  const records=[
    {id:'H1-RPM-217',standardUnitKey:'H22-C2-03',subUnitKey:'H22-C2-03-CIRCLE_EQUATION',mappingStatus:'DIRECT_ACTIVE',bindingStatus:'ACTIVE',rpmPath:{l3:'원의 방정식',l4:'중심과 반지름'}},
    {id:'H1-RPM-218',standardUnitKey:'H22-C2-03',subUnitKey:'H22-C2-03-CIRCLE_EQUATION',mappingStatus:'DIRECT_ACTIVE',bindingStatus:'ACTIVE',rpmPath:{l3:'원의 방정식',l4:'일반형에서 원 찾기'}}
  ];
  const result=resolveQ22B2RpmRecord({records,uid:'ALITE-PALMA25-2MID-Q22-B2',declaredRecordIds:['H1-RPM-217','H1-RPM-218'],standardUnitKey:'H22-C2-03',subUnitKey:'H22-C2-03-CIRCLE_EQUATION',rpmL3:'원의 방정식',rpmL4:'일반형에서 원 찾기'});
  assert.equal(result.record.id,'H1-RPM-218');
  assert.deepEqual(result.evidence.declaredRecordIds,['H1-RPM-217','H1-RPM-218']);
  assert.equal(result.evidence.selectedRecordId,'H1-RPM-218');
  assert.equal(result.evidence.selectionBasis,'EXACT_ACTIVE_UNIT_SUBUNIT_L3_L4');
  const input={uid:'ALITE-PALMA25-2MID-Q22-B2',declaredRecordIds:['H1-RPM-217','H1-RPM-218'],standardUnitKey:'H22-C2-03',subUnitKey:'H22-C2-03-CIRCLE_EQUATION',rpmL3:'원의 방정식',rpmL4:'일반형에서 원 찾기'};
  assert.throws(()=>resolveQ22B2RpmRecord({...input,records:[...records,{...records[1]}]}),/Q22_B2_RPM_EXACT_ACTIVE_RECORD_NOT_UNIQUE/);
  assert.throws(()=>resolveQ22B2RpmRecord({...input,records,declaredRecordIds:['H1-RPM-217']}),/Q22_B2_RPM_EXACT_ACTIVE_RECORD_NOT_UNIQUE/);
});

test('an existing approved projection remains valid when the current original exam advances beyond its recorded source observation',()=>{
  const sourcePath='archive/exams/original/high/h1/2mid/fixture.js';
  const historicalBytes=Buffer.from('approved historical source\n'),observedBytes=Buffer.from('source observed when projection was approved\n'),latestBytes=Buffer.from('later unrelated original exam revision\n');
  const historical=gitBlobSha(historicalBytes),observed=gitBlobSha(observedBytes),latest=gitBlobSha(latestBytes);
  const input={uid:'ALITE-PALMA25-2MID-Q17-A1',sourcePath,historicalSourceBlobSha1:historical,latestCurrentSourceBlobSha1:latest,
    indexRow:{sourceExamBlobSha:historical,approvedSourceSnapshotBlobSha1:historical,currentSourceExamBlobSha1:observed},
    consumerDocument:{sourceExamPath:sourcePath,sourceExamBlobSha:historical,currentSourceExamBlobSha1:observed,approvedSourceSnapshot:{path:sourcePath,gitBlobSha1:historical}},
    consumerRecord:{sourceExamPath:sourcePath,sourceExamBlobSha:historical,currentSourceExamBlobSha1:observed,approvedSourceSnapshotBlobSha1:historical},
    sourceMetadata:{sourceArchiveFile:sourcePath,sourceBlobSha:historical,approvedSourceBlobSha:historical,approvedHistoricalSourceExamBlobSha1:historical,currentSourceExamBlobSha1:observed},
    reviewEvidence:{approvedSourceSnapshot:{path:sourcePath,gitBlobSha1:historical},currentSource:{path:sourcePath,gitBlobSha1:observed}},
    readHistoricalBlob:sha=>sha===observed?observedBytes:null};
  const result=verifySourceProjectionBinding(input);
  assert.equal(result.observedSourceBlobSha1,observed);
  assert.equal(result.latestCurrentSourceBlobSha1,latest);
  assert.equal(result.sourceChangedSinceProjection,true);
  assert.equal(input.indexRow.sourceExamBlobSha,historical);
});

test('an existing source projection fails closed when its recorded observation diverges or the observed Git blob is unavailable',()=>{
  const sourcePath='archive/exams/original/high/h1/2mid/fixture.js',historicalBytes=Buffer.from('approved historical source\n'),observedBytes=Buffer.from('source observed when projection was approved\n');
  const historical=gitBlobSha(historicalBytes),observed=gitBlobSha(observedBytes),latest=gitBlobSha(Buffer.from('later source revision\n'));
  const input={uid:'ALITE-PALMA25-2MID-Q17-A1',sourcePath,historicalSourceBlobSha1:historical,latestCurrentSourceBlobSha1:latest,
    indexRow:{sourceExamBlobSha:historical,approvedSourceSnapshotBlobSha1:historical,currentSourceExamBlobSha1:observed},
    consumerDocument:{sourceExamPath:sourcePath,sourceExamBlobSha:historical,currentSourceExamBlobSha1:observed,approvedSourceSnapshot:{path:sourcePath,gitBlobSha1:historical}},
    consumerRecord:{sourceExamPath:sourcePath,sourceExamBlobSha:historical,currentSourceExamBlobSha1:observed,approvedSourceSnapshotBlobSha1:historical},
    sourceMetadata:{sourceArchiveFile:sourcePath,sourceBlobSha:historical,approvedSourceBlobSha:historical,approvedHistoricalSourceExamBlobSha1:historical,currentSourceExamBlobSha1:observed},
    reviewEvidence:{approvedSourceSnapshot:{path:sourcePath,gitBlobSha1:historical},currentSource:{path:sourcePath,gitBlobSha1:observed}},
    readHistoricalBlob:sha=>sha===observed?observedBytes:null};
  assert.throws(()=>verifySourceProjectionBinding({...input,sourceMetadata:{...input.sourceMetadata,currentSourceExamBlobSha1:'0'.repeat(40)}}),/SOURCE_OBSERVED_PROJECTION_MISMATCH/);
  assert.throws(()=>verifySourceProjectionBinding({...input,readHistoricalBlob:()=>null}),/SOURCE_OBSERVED_BLOB_MISSING/);
});

test('an existing student projection remains bound to the receipt-verified package body and fails after any body field drifts',()=>{
  const approvedPackageItem={uid:'ALITE-PALMA25-2MID-Q17-A1',stem:'approved stem',choices:['①','②','③','④','⑤'],answer:'③',solution:'approved solution'};
  const sourceQuestion={uid:approvedPackageItem.uid,content:approvedPackageItem.stem,choices:[...approvedPackageItem.choices],answer:approvedPackageItem.answer,solution:approvedPackageItem.solution};
  const consumerQuestion=structuredClone(sourceQuestion);
  assert.equal(verifyApprovedQuestionBodyParity({uid:approvedPackageItem.uid,approvedPackageItem,sourceQuestion,consumerQuestion}),true);
  assert.throws(()=>verifyApprovedQuestionBodyParity({uid:approvedPackageItem.uid,approvedPackageItem,sourceQuestion:{...sourceQuestion,solution:'edited after approval'},consumerQuestion}),/APPROVED_PACKAGE_BODY_PARITY_MISMATCH/);
});

test('Generated integration projection maps the approved condition-intersection label to its canonical pattern and preserves existing canonical labels',()=>{
  assert.equal(canonicalIntegrationPattern('CONDITION_INTERSECTION'),'INTERDEPENDENT');
  assert.equal(canonicalIntegrationPattern('CONDITION_COMPOSITE'),'INTERDEPENDENT');
  assert.equal(canonicalIntegrationPattern('CASE_BRANCH'),'CASE_BRANCH');
});

test('only scoped Q18 and Q23 generated-L4 fingerprint refreshes qualify for projection repair',()=>{
  const q18Old={rpmL3:'삼각형의 무게중심',rpmL4:'EXT-L4-H1-Q18-CENTROID-DIRECT-AREA',rpmL4Namespace:'GENERATED_EXT_L4',generatedL4RegistryRef:'archive/generated/q18/registry.json',generatedL4RegistrySha256:'1'.repeat(64)};
  const q18New={...q18Old,generatedL4RegistrySha256:'2'.repeat(64),generatedL4RegistryGitBlobSha1:'a'.repeat(40)};
  assert.equal(isAllowedGeneratedMetaProjectionRepair('ALITE-PALMA25-2MID-Q18-A1',q18Old,q18New),true);
  assert.equal(isAllowedGeneratedMetaProjectionRepair('ALITE-PALMA25-2MID-Q18-A1',q18Old,{...q18New,conditionKeys:['FAKE']}),false);
  const q23Old={rpmL3:'점과 직선 사이의 거리',rpmL4:'거리 자취의 사각형 둘레',rpmL4Namespace:'RPM_EXISTING_DRAFT',rpmDraftAuthorityRef:'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json',rpmDraftAuthoritySha256:'1'.repeat(64)};
  const q23New={rpmL3:'점과 직선 사이의 거리',rpmL4:'EXT-H1-C2-02-Q23-STRIP-PERIMETER',rpmL4Label:'거리 자취의 사각형 둘레',rpmL4Namespace:'GENERATED_EXT_L4',rpmAuthorityRef:'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json',rpmAuthoritySha256:'1'.repeat(64),generatedL4RegistryRef:'archive/generated/q23/registry.json',generatedL4RegistrySha256:'2'.repeat(64),generatedL4RegistryGitBlobSha1:'a'.repeat(40)};
  assert.equal(isAllowedGeneratedMetaProjectionRepair('ALITE-PALMA25-2MID-Q23-C2',q23Old,q23New),true);
  assert.equal(isAllowedGeneratedMetaProjectionRepair('ALITE-PALMA25-2MID-Q23-C2',q23Old,{...q23New,rpmL3:'different L3'}),false);
  const q23C3Old={generatedL4RegistryRef:'archive/generated/q23/registry.json',generatedL4RegistrySha256:'3'.repeat(64)};
  const q23C3New={...q23C3Old,generatedL4RegistrySha256:'4'.repeat(64),generatedL4RegistryGitBlobSha1:'b'.repeat(40)};
  assert.equal(isAllowedGeneratedMetaProjectionRepair('ALITE-PALMA25-2MID-Q23-C3',q23C3Old,q23C3New),true);
  assert.equal(isAllowedGeneratedMetaProjectionRepair('ALITE-PALMA25-2MID-Q23-C3',q23C3Old,{...q23C3New,crossConceptKeys:['FAKE']}),false);
  assert.equal(isAllowedGeneratedMetaProjectionRepair('ALITE-PALMA25-2MID-Q22-B2',q23Old,q23New),false);
});

// ---- Shared crosswalk grows (append-only): pinned whole-file digest drift, 2026-11-03 (f8e9ca610) ----
const CROS='archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json';
const crossBytes=fs.readFileSync(path.join(ROOT,CROS));
const crossDoc=JSON.parse(crossBytes.toString('utf8'));
const currentCrossSha=sha256Bytes(crossBytes);
const consumerIndex=JSON.parse(fs.readFileSync(path.join(ROOT,'archive/data/generated-lite-consumer/v1/index.json'),'utf8'));
function driftFixture(uid){
  const existingRow=structuredClone(consumerIndex.records.find(row=>row.uid===uid));
  const field=existingRow.meta.rpmL4Namespace==='GENERATED_EXT_L4'?'rpmAuthoritySha256':'rpmDraftAuthoritySha256';
  const meta=structuredClone(existingRow.meta);meta[field]=currentCrossSha;
  return {existingRow,meta,field};
}
const drift=(fx,over={})=>sealedCrosswalkDigestOnlyDrift({root:ROOT,crosswalkPath:CROS,crosswalkRecords:crossDoc.records,currentCrosswalkSha256:currentCrossSha,existingRow:fx.existingRow,meta:fx.meta,...over});

test('an approved record whose only difference is a sealed crosswalk digest with intact rows is treated as unchanged (draft and generated-L4 namespaces)',()=>{
  for(const uid of ['ALITE-PALMA25-2MID-Q17-A1','ALITE-PALMA25-2MID-Q23-C3']){
    const fx=driftFixture(uid);
    assert.notEqual(fx.existingRow.meta[fx.field],currentCrossSha,'precondition: the record pins an older crosswalk digest');
    assert.notEqual(metaSha256(fx.meta),fx.existingRow.metaFinalSha256,'precondition: the recomputed Meta hash differs only because of the digest');
    assert.deepEqual(drift(fx),{ok:true,reason:'SEALED_CROSSWALK_DIGEST_ONLY_DRIFT'},uid);
  }
});

test('a changed or missing crosswalk row that the Meta names keeps the record failing even with a sealed digest',()=>{
  const fx=driftFixture('ALITE-PALMA25-2MID-Q17-A1');
  const id=fx.existingRow.meta.rpmPrimaryRecordId;
  const mutate=fn=>{const records=structuredClone(crossDoc.records);fn(records.find(row=>row.id===id));return records;};
  const cases={
    RPM_ROW_RPML3_CHANGED:()=>mutate(row=>{row.rpmPath.l3+=' (changed)';}),
    RPM_ROW_L4_CHANGED:()=>mutate(row=>{row.rpmPath.l4+=' (changed)';}),
    RPM_ROW_COURSE_UNIT_CHANGED:()=>mutate(row=>{row.subUnitKey='H22-C2-00-OTHER';}),
    RPM_PRIMARY_RECORD_NOT_UNIQUE:()=>crossDoc.records.filter(row=>row.id!==id)
  };
  for(const [reason,build] of Object.entries(cases))assert.equal(drift(fx,{crosswalkRecords:build()}).reason,reason);
  // rows the Meta does not name may be added or changed freely
  const unrelated=structuredClone(crossDoc.records);unrelated.push({...structuredClone(unrelated[0]),id:'H1-RPM-999-TEST-ADDED'});
  assert.equal(drift(fx,{crosswalkRecords:unrelated}).ok,true);
  // the generated-L4 record keeps its L1-L3 and unit checks as well
  const g=driftFixture('ALITE-PALMA25-2MID-Q23-C3');
  const changed=structuredClone(crossDoc.records);changed.find(row=>row.id===g.existingRow.meta.rpmPrimaryRecordId).rpmPath.l3+=' (changed)';
  assert.equal(drift(g,{crosswalkRecords:changed}).reason,'RPM_ROW_RPML3_CHANGED');
});

test('a digest sealed only in the append-only registry is accepted for that crosswalk file and refused for another',async()=>{
  const os=await import('node:os');const sealed=(await import('../sealed-crosswalk-digests.cjs')).default;
  const fx=driftFixture('ALITE-PALMA25-2MID-Q17-A1');
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'auto-register-seal-'));
  try{
    const pinned=fx.existingRow.meta[fx.field];
    assert.equal(drift({...fx},{root:dir}).reason,'PINNED_DIGEST_NOT_SEALED','nothing sealed in an empty root');
    const gitBlobSha1='a'.repeat(40),base={gitBlobSha1,sealedAt:'2026-11-03T00:00:00.000Z',sealedBy:'test',reason:'test'};
    fs.mkdirSync(path.join(dir,path.dirname(sealed.REGISTRY_REL)),{recursive:true});
    fs.writeFileSync(path.join(dir,sealed.REGISTRY_REL),sealed.serializeRegistry([{...base,path:'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-geometry.json',sha256:pinned}]));
    assert.equal(drift({...fx},{root:dir}).reason,'PINNED_DIGEST_NOT_SEALED','sealed for another file does not count');
    fs.writeFileSync(path.join(dir,sealed.REGISTRY_REL),sealed.serializeRegistry([{...base,path:CROS,sha256:pinned}]));
    assert.deepEqual(drift({...fx},{root:dir}),{ok:true,reason:'SEALED_CROSSWALK_DIGEST_ONLY_DRIFT'});
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('a pinned digest that no sealed receipt recorded, or any other Meta difference, is still refused',()=>{
  const fx=driftFixture('ALITE-PALMA25-2MID-Q17-A1');
  const unsealed=structuredClone(fx.existingRow);unsealed.meta[fx.field]='d'.repeat(64);unsealed.metaFinalSha256=metaSha256(unsealed.meta);
  assert.equal(drift({...fx,existingRow:unsealed}).reason,'PINNED_DIGEST_NOT_SEALED');
  // a sealed digest is sealed for one crosswalk file only
  const otherFile='archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-geometry.json';
  const moved=structuredClone(fx.existingRow);moved.meta.rpmDraftAuthorityRef=otherFile;moved.metaFinalSha256=metaSha256(moved.meta);
  assert.equal(drift({...fx,existingRow:moved,meta:{...fx.meta,rpmDraftAuthorityRef:otherFile}},{crosswalkPath:otherFile}).reason,'PINNED_DIGEST_NOT_SEALED');
  // any non-digest field differing (a level, a key, the unit) is a real change, not drift
  for(const [key,value] of [['level','상'],['templateKey','TPL_OTHER'],['conditionKeys',['COND_OTHER']],['standardUnitKey','H22-C2-00']])
    assert.equal(drift({...fx,meta:{...fx.meta,[key]:value}}).reason,'META_DIFFERS_BEYOND_CROSSWALK_DIGEST',key);
  // the recomputed digest must be the current crosswalk digest, and the stored record must be self-consistent
  assert.equal(drift({...fx,meta:{...fx.meta,[fx.field]:'e'.repeat(64)}}).reason,'RECOMPUTED_DIGEST_NOT_CURRENT');
  assert.equal(drift({...fx,existingRow:{...fx.existingRow,metaFinalSha256:'f'.repeat(64)}}).reason,'EXISTING_RECORD_INTERNALLY_INCONSISTENT');
  // a Meta that never pinned a crosswalk digest is not a drift case
  const noField=structuredClone(fx.existingRow);delete noField.meta[fx.field];noField.metaFinalSha256=metaSha256(noField.meta);
  assert.equal(drift({...fx,existingRow:noField,meta:noField.meta}).reason,'NO_CROSSWALK_DIGEST_FIELD');
});

test('immutable record-resolution evidence keeps its sealed authority digest only while the rebuilt document is otherwise identical',()=>{
  const storedBytes=fs.readFileSync(path.join(ROOT,'archive/data/evidence-authority/v1/palma-mock-builder-20261010/Q21_C1_RPM_RECORD_RESOLUTION.json'));
  const stored=JSON.parse(storedBytes.toString('utf8'));
  assert.notEqual(stored.authority.sha256,currentCrossSha);
  const build=over=>{const doc={...structuredClone(stored),...over,authority:{...stored.authority,sha256:currentCrossSha}};return {builtDoc:doc,builtBytes:Buffer.from(JSON.stringify(doc,null,2)+'\n')};};
  const run=(built,extra={})=>reconcileRpmResolutionBytes({root:ROOT,crosswalkPath:CROS,currentCrosswalkSha256:currentCrossSha,...built,storedBytes,...extra});
  assert.ok(run(build({})).equals(storedBytes));
  const changed=build({selectedRecordId:'H1-RPM-247'});
  assert.ok(run(changed).equals(changed.builtBytes),'a changed selected row must not reuse the stored bytes');
  const unsealedStored=Buffer.from(JSON.stringify({...stored,authority:{...stored.authority,sha256:'d'.repeat(64)}},null,2)+'\n');
  const same=build({});
  assert.ok(run(same,{storedBytes:unsealedStored}).equals(same.builtBytes),'an unsealed stored digest must not be accepted');
  assert.ok(run(same,{storedBytes:null}).equals(same.builtBytes));
});

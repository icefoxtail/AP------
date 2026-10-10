import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {eligibleApprovedQids,missingApprovedUids,unknownApprovedQid9Manifests,verifyExplicitPackageApproval,resolveQ21ParameterRpmRecord,resolveQ22B2RpmRecord,verifySourceProjectionBinding,verifyApprovedQuestionBodyParity,canonicalIntegrationPattern,isAllowedGeneratedMetaProjectionRepair} from './auto-register-approved-qid9.mjs';
import {gitBlobSha} from './register-approved-generated-meta.mjs';

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

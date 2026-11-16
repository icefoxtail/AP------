'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {selectWholeBankRows,projectTableRows,verifySvg7DerivedContinuity}=require('../tools/4slot/existing-registered-vector-svg7-derived-continuity.cjs');
const schema='archive-question-metadata-v1';
const banks=[
  ['original/middle/m2/1final/22_풍덕중_1학기_기말_중2_수학.js',25],
  ['original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js',24],
  ['original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js',26]
];
function fixture(){
  let index=1;
  const records=banks.flatMap(([sourceArchiveFile,count])=>Array.from({length:count},(_,i)=>({
    questionUid:'qid_v1_'+(index++).toString(16).padStart(64,'0'),sourceArchiveFile,sourceOrdinal:i+1,
    sourceQuestionNo:String(i+1),metadataStatus:'PENDING',additionalGuard:{value:'unchanged'}
  })));
  records.push({questionUid:'qid_v1_'+('f'.repeat(64)),sourceArchiveFile:'unrelated-public-bank',sourceOrdinal:1});
  return {schemaVersion:schema,records};
}
test('retains every field of all75 rows without mutating the input',()=>{
  const document=fixture(),before=JSON.stringify(document),rows=selectWholeBankRows(document,schema);
  assert.equal(rows.length,75);assert.deepEqual(rows[0].additionalGuard,{value:'unchanged'});
  assert.equal(JSON.stringify(document),before);
});
test('missing unselected row invalidates the whole bank denominator',()=>{
  const document=fixture();document.records.splice(0,1);
  assert.throws(()=>selectWholeBankRows(document,schema),/WHOLE_BANK_DENOMINATOR/);
});
test('a foreign source cannot fill a missing row in one of the three banks',()=>{
  const document=fixture();document.records[0].sourceArchiveFile='unrelated-public-bank';
  assert.throws(()=>selectWholeBankRows(document,schema),/WHOLE_BANK_DENOMINATOR/);
});
test('ordinal duplication, shifts and string ordinals are rejected',()=>{
  for(const ordinal of [2,0,'1']){
    const document=fixture();document.records[0].sourceOrdinal=ordinal;
    assert.throws(()=>selectWholeBankRows(document,schema),/BANK_ORDINALS/);
  }
});
test('a bank UID reused in an unrelated global row is rejected',()=>{
  const document=fixture();document.records.at(-1).questionUid=document.records[0].questionUid;
  assert.throws(()=>selectWholeBankRows(document,schema),/GLOBAL_UID_DUPLICATE/);
});
test('malformed and repeated UIDs inside the bank are rejected',()=>{
  for(const uid of ['qid_v1_bad',fixture().records[1].questionUid]){
    const document=fixture();document.records[0].questionUid=uid;
    assert.throws(()=>selectWholeBankRows(document,schema),/WHOLE_BANK_UIDS/);
  }
});
test('an unrelated field change in an unselected bank row changes the comparison',()=>{
  const before=fixture(),after=structuredClone(before);after.records[0].additionalGuard.value='changed';
  assert.notDeepEqual(selectWholeBankRows(before,schema),selectWholeBankRows(after,schema));
});
test('wrong schema and malformed global records fail before selection',()=>{
  const document=fixture();document.schemaVersion='unknown';
  assert.throws(()=>selectWholeBankRows(document,schema),/TABLE_SCHEMA/);
  const malformed=fixture();malformed.records.push(null);
  assert.throws(()=>selectWholeBankRows(malformed,schema),/TABLE_SCHEMA/);
});
test('the closed bridge cannot approve a different UID, ordinal or solution surface',()=>{
  const subject={questionUid:'qid_v1_0d8f5786d2c658ae440bf814c83c4315e77c0730191a8bd95b038590d7383de6',sourceOrdinal:3,surface:'PROBLEM'};
  for(const change of [{questionUid:'qid_v1_'+('f'.repeat(64))},{sourceOrdinal:15},{surface:'SOLUTION'}])
    assert.throws(()=>verifySvg7DerivedContinuity({...subject,...change}),/EXACT_SEVEN_PROBLEMS/);
  assert.throws(()=>verifySvg7DerivedContinuity(subject),/TECHNICAL_REF/);
});
test('bounded raw projection preserves nested strings and the exact global row count',()=>{
  const document=fixture();document.records[0].additionalGuard={text:'괄호 ] } \\" 줄\n표시',nested:[true,null,{x:'["'}]};
  const raw=Buffer.from(JSON.stringify({header:{records:'not-the-array'},...document,lookup:{tail:[1,2,3]}}));
  const result=projectTableRows(raw,schema);
  assert.equal(result.globalRecordCount,76);assert.deepEqual(result.rows,selectWholeBankRows(document,schema));
});
test('bounded projection detects a global duplicate that appears before its bank row',()=>{
  const document=fixture();document.records.at(-1).questionUid=document.records[0].questionUid;
  document.records.unshift(document.records.pop());
  assert.throws(()=>projectTableRows(Buffer.from(JSON.stringify(document)),schema),/GLOBAL_UID_DUPLICATE/);
});
test('bounded projection rejects malformed or trailing JSON outside the selected rows',()=>{
  const raw=JSON.stringify(fixture());
  for(const text of [raw+'null',raw.slice(0,-1)+',"unused":tru}',raw.slice(0,-1)+',}',raw.replace('"records":[','"records":[,')])
    assert.throws(()=>projectTableRows(Buffer.from(text),schema),/TABLE_JSON/);
});
test('bounded projection rejects duplicate top-level authority fields',()=>{
  const raw=JSON.stringify(fixture());
  for(const field of ['"schemaVersion":"archive-question-metadata-v1"','"records":[]'])
    assert.throws(()=>projectTableRows(Buffer.from(raw.slice(0,-1)+','+field+'}'),schema),/TABLE_JSON/);
});
test('bounded projection rejects malformed UTF8 instead of accepting replacement characters',()=>{
  const raw=Buffer.from(JSON.stringify(fixture()));
  const bad=Buffer.concat([raw.subarray(0,-1),Buffer.from(',"unused":"'),Buffer.from([255]),Buffer.from('"}')]);
  assert.throws(()=>projectTableRows(bad,schema),/TABLE_JSON/);
});

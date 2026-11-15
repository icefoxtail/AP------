import test from 'node:test';
import assert from 'node:assert/strict';
import { createQuestionIdentityResolver, isUnambiguousLegacySourceUidAlias } from '../archive/tools/intelligence/question-identity-contract.mjs';

const source='original/middle/m2/2final/fixture.js',uid='qid_v1_'+'a'.repeat(64),otherUid='qid_v1_'+'b'.repeat(64);
function fixture() {
  const question={id:1,number:'1',sourceQuestionNo:1,sourceQid:1,sourceOrdinal:1,questionUid:'fixture|1'};
  const tuple={sourceArchiveFile:source,sourceOrdinal:1,sourceQuestionNo:1};
  const identityRecord={...tuple,questionUid:uid,legacyQKey:source+'_1'};
  const other={sourceArchiveFile:source,sourceOrdinal:2,sourceQuestionNo:2,questionUid:otherUid,legacyQKey:source+'_2'};
  const identityMap={schemaVersion:'question-identity-map-v1',records:[identityRecord,other],lookup:{
    byQuestionUid:{[uid]:tuple,[otherUid]:{sourceArchiveFile:source,sourceOrdinal:2,sourceQuestionNo:2}},
    bySourceFileAndOrdinal:{[source]:{'1':uid,'2':otherUid}},
    bySourceFileAndQuestionNo:{[source]:{'1':[uid],'2':[otherUid]}},
    byLegacyQKey:{[source+'_1']:[uid],[source+'_2']:[otherUid]},
  }};
  return {question,sourceArchiveFile:source,sourceOrdinal:1,identityRecord,identityMap,
    bank:[question,{id:2,sourceQuestionNo:2,questionUid:'fixture|2'}]};
}
test('the exact historical source alias binds through all canonical maps without altering UID resolution',()=>{
  const f=fixture(),before=JSON.stringify(f);
  assert.equal(isUnambiguousLegacySourceUidAlias(f),true);
  assert.equal(createQuestionIdentityResolver(f.identityMap).resolve({questionUid:'fixture|1',sourceArchiveFile:source,sourceOrdinal:1}).status,'UNKNOWN_QUESTION_UID');
  assert.equal(JSON.stringify(f),before);
});
test('legacy alias proof rejects arbitrary UIDs, conflicting numbers, ambiguity and stale lookup paths',async t=>{
  const cases=[
    ['unknown explicit UID',f=>{f.question.questionUid='unknown';}],
    ['foreign canonical UID',f=>{f.question.questionUid=otherUid;}],
    ['wrong basename',f=>{f.question.questionUid='other|1';}],
    ['wrong alias number',f=>{f.question.questionUid='fixture|2';}],
    ['noncanonical numeric alias',f=>{f.question.questionUid='fixture|01';}],
    ['conflicting id',f=>{f.question.id=2;}],
    ['conflicting display number',f=>{f.question.number=2;}],
    ['conflicting source number',f=>{f.question.sourceQuestionNo=2;}],
    ['conflicting sourceQid',f=>{f.question.sourceQid=2;}],
    ['conflicting source ordinal',f=>{f.question.sourceOrdinal=2;}],
    ['global identity number drift',f=>{f.identityRecord.sourceQuestionNo=2;}],
    ['identity ordinal drift',f=>{f.identityRecord.sourceOrdinal=2;}],
    ['duplicate source number',f=>{f.bank[1].sourceQuestionNo=1;}],
    ['duplicate source alias',f=>{f.bank[1].questionUid='fixture|1';}],
    ['actual bound source alias mismatch',f=>{f.bank[0]={...f.question,questionUid:'other|1'};}],
    ['missing canonical map',f=>{delete f.identityMap;}],
    ['missing map schema',f=>{delete f.identityMap.schemaVersion;}],
    ['missing actual identity record',f=>{f.identityMap.records.shift();}],
    ['duplicate actual identity UID',f=>{f.identityMap.records.push({...f.identityRecord,sourceArchiveFile:'other.js'});}],
    ['duplicate actual source ordinal',f=>{f.identityMap.records[1].sourceOrdinal=1;}],
    ['duplicate actual source number',f=>{f.identityMap.records[1].sourceQuestionNo=1;}],
    ['missing UID lookup',f=>{delete f.identityMap.lookup.byQuestionUid[uid];}],
    ['UID lookup points to another source',f=>{f.identityMap.lookup.byQuestionUid[uid].sourceArchiveFile='other.js';}],
    ['ordinal lookup selects another UID',f=>{f.identityMap.lookup.bySourceFileAndOrdinal[source]['1']=otherUid;}],
    ['number lookup selects another UID',f=>{f.identityMap.lookup.bySourceFileAndQuestionNo[source]['1']=[otherUid];}],
    ['ambiguous legacy lookup',f=>{f.identityMap.lookup.bySourceFileAndQuestionNo[source]['1'].push(otherUid);}],
    ['wrong legacyQKey',f=>{f.identityRecord.legacyQKey=source+'_2';}],
    ['missing legacy key lookup',f=>{delete f.identityMap.lookup.byLegacyQKey;}],
    ['ambiguous legacy key lookup',f=>{f.identityMap.lookup.byLegacyQKey[source+'_1'].push(otherUid);}],
  ];
  for(const [name,mutate] of cases)await t.test(name,()=>{
    const f=fixture();mutate(f);assert.equal(isUnambiguousLegacySourceUidAlias(f),false);
  });
});

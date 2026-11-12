import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {registerDifficulty5, SCHEMA} from '../archive/tools/meta-foundation/register-difficulty5.mjs';

const blob = s => crypto.createHash('sha1').update(`blob ${Buffer.byteLength(s)}\0`).update(s).digest('hex');
function fixture(t, questions, sourceNos) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'diff5-id-'));
  t.after(() => fs.rmSync(root, {recursive:true, force:true}));
  const source = 'original/test.js';
  const put = (p, data) => {const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,data);};
  const bank = 'window.questionBank = '+JSON.stringify(questions)+';\n';
  const rows = questions.map((_,i)=>({sourceArchiveFile:source,sourceOrdinal:i+1,questionUid:'uid'+(i+1),sourceQuestionNo:sourceNos[i]}));
  put('archive/exams/'+source,bank);
  put('archive/data/question_identity_map.json',JSON.stringify({records:rows}));
  put('archive/data/question_metadata.json',JSON.stringify({records:rows.map(r=>({...r,level:'하'}))}));
  const request = {schemaVersion:SCHEMA,gemini:{schemaVersion:'v1',requestId:'test',sourceArchiveFile:source,latestBlobSha:blob(bank),items:rows.map(r=>({ordinal:r.sourceOrdinal,questionUid:r.questionUid,before:{level:'하'},after:{difficultyBucket:1,difficultyConfidence:'high',difficultyBoundaryFlag:'NONE'}}))}};
  return {root,request};
}
function projection(t, questions, sourceNos) {
  const f=fixture(t,questions,sourceNos);
  registerDifficulty5({...f,write:true});
  return () => registerDifficulty5({...f,verifyProjection:true});
}
test('canonical unique string IDs with matching display numbers pass',t=>{
  const verify=projection(t,[{id:'q01',number:1},{id:'s01',number:2}],['q01','s01']);
  assert.equal(verify().summary.VERIFIED,2);
});
test('numeric IDs still require their ordinal',t=>{
  assert.equal(projection(t,[{id:1}],['q01'])().summary.VERIFIED,1);
  assert.throws(projection(t,[{id:2}],['q01']),/source question id mismatch #1/);
});
test('wrong canonical ID, number, or duplicate string ID fails closed',t=>{
  assert.throws(projection(t,[{id:'q01',number:1}],['q02']),/source question id mismatch #1/);
  assert.throws(projection(t,[{id:'q01',number:2}],['q01']),/source question id mismatch #1/);
  assert.throws(projection(t,[{id:'q01',number:1},{id:'q01',number:2}],['q01','q01']),/source question id mismatch #1/);
});

// Additional exact-identity cases. Copy this whole test into tests/ with the candidate registrar.
function exactFixture(t, questions, sourceNos) {
  const f=fixture(t,questions,sourceNos);
  const hash=q=>crypto.createHash('sha256').update(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,answer:q.answer??null,solution:q.solution??null,image:q.image??null})).digest('hex');
  for (const name of ['question_identity_map.json','question_metadata.json']) {
    const file=path.join(f.root,'archive/data',name), doc=JSON.parse(fs.readFileSync(file,'utf8'));
    doc.records.forEach((r,i)=>r.sourceFingerprint=hash(questions[i]));fs.writeFileSync(file,JSON.stringify(doc));
  }
  registerDifficulty5({...f,write:true});
  return {verify:()=>registerDifficulty5({...f,verifyProjection:true}),...f};
}
test('unique numeric or string source IDs with exact identity fingerprints pass',t=>{
  assert.equal(exactFixture(t,[{id:81,content:'a'},{id:'qid_x',content:'b'}],[81,'qid_x']).verify().summary.VERIFIED,2);
});
test('exact identity exception rejects duplicate ID, wrong identity, shifted number, and stale fingerprint',t=>{
  assert.throws(exactFixture(t,[{id:81},{id:81}],[81,81]).verify,/source question id mismatch/);
  assert.throws(exactFixture(t,[{id:81}],[82]).verify,/source question id mismatch/);
  assert.throws(exactFixture(t,[{id:81,number:2}],[81]).verify,/source question id mismatch/);
  const f=exactFixture(t,[{id:81}],[81]),p=path.join(f.root,'archive/data/question_identity_map.json'),d=JSON.parse(fs.readFileSync(p,'utf8'));d.records[0].sourceFingerprint='stale';fs.writeFileSync(p,JSON.stringify(d));assert.throws(f.verify,/source question id mismatch/);
});

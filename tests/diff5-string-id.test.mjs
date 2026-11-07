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

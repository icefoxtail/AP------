// A bank whose question ids are strings ("q01", "s01") is addressed by that id: the UID is "<exam>|q01", the Archive capture finds the question by it,
// the figure is named after it, and the publish tool patches the right object. Integer ids behave exactly as before.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {questionUidV2,parseQuestionUidV2} from '../../pipeline-core/question-uid.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {captureArchiveCandidate} from '../production/construction-archive-capture-v1.mjs';

const root=fileURLToPath(new URL('../../../../',import.meta.url));
const EXAM='21_왕의중_2학기_기말_중3_수학';
const SOURCE=`archive/exams/original/middle/m3/2final/${EXAM}.js`;

test('question UID: string ids round-trip, integer ids are unchanged, junk is refused',()=>{
  assert.equal(questionUidV2(EXAM,'q01'),`${EXAM}|q01`);
  assert.deepEqual(parseQuestionUidV2(`${EXAM}|s01`),{sourceExamId:EXAM,sourceQuestionOrdinal:'s01'});
  assert.deepEqual(parseQuestionUidV2(`${EXAM}|7`),{sourceExamId:EXAM,sourceQuestionOrdinal:7});
  assert.equal(questionUidV2(EXAM,7),`${EXAM}|7`);
  for(const bad of ['', 'q 1','1q','q/1','a'.repeat(33),0,-1,1.5,null])assert.throws(()=>questionUidV2(EXAM,bad),/QUESTION_ORDINAL_INVALID/);
  for(const bad of [`${EXAM}|`,`${EXAM}|05`,`${EXAM}|q 1`,`${EXAM}|0`,`|q01`])assert.throws(()=>parseQuestionUidV2(bad));
  assert.equal(assetIdentity(`${EXAM}|q01`,'SOLUTION_VISUAL','decisive-relation').questionUid,`${EXAM}|q01`);
});

// The capture refuses a non-composed figure only AFTER the question lookup: COMPOSED_INPUT_INVALID proves the id was found in the real bank.
async function reach(ordinal,uidTail=ordinal){
  const identity=assetIdentity(`${EXAM}|${uidTail}`,'SOLUTION_VISUAL','decisive-relation');
  return captureArchiveCandidate({composed:null,identity,sourcePath:SOURCE,ordinal,requestedSizeClass:'full',measuredPolicy:null,alt:'a',runId:'string-id-test-'+process.pid});
}
test('Archive capture finds a string-id question in the bank and refuses an id that is not in it',async()=>{
  assert.equal((await reach('q01')).status,'COMPOSED_INPUT_INVALID');
  assert.equal((await reach('s04')).status,'COMPOSED_INPUT_INVALID');
  const missing=await reach('q99');
  assert.equal(missing.status,'ARCHIVE_INPUT_INVALID');assert.equal(missing.detail.reason,'ORDINAL_NOT_IN_BANK');
  const mismatch=await reach('q01','q02');
  assert.equal(mismatch.status,'IDENTITY_SOURCE_MISMATCH');
  const junk=await reach('1q','q01');
  assert.equal(junk.status,'ARCHIVE_INPUT_INVALID');assert.equal(junk.detail.reason,'ORDINAL');
});

test('publish tool patches a string-id question and names the figure after the id (dry run + apply on a scratch root)',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'string-id-publish-'));
  try{
    const dst=path.join(dir,SOURCE);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(path.join(root,SOURCE),dst);
    const svg=path.join(dir,'figure.svg');fs.writeFileSync(svg,'<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>');
    const rows=path.join(dir,'rows.json');
    fs.writeFileSync(rows,JSON.stringify([{src:SOURCE,ord:'s01',svg,key:'m3-s01',fam:'M3',size:'medium',alt:'해설 그림: 테스트',caption:'테스트'},{src:SOURCE,ord:'q01',svg,key:'m3-q01',fam:'M3',size:'medium',alt:'해설 그림: 테스트',caption:'테스트'}]));
    const run=args=>JSON.parse(execFileSync('node',[path.join(root,'archive/tools/geometry-equation/ops/svg-m1/publish.mjs'),rows,dir,...args],{env:{...process.env,PUBLISH_REPORT:path.join(dir,'report.json')},encoding:'utf8'}));
    const dry=run([]);assert.equal(dry.figures,2);assert.deepEqual(dry.problems,[]);assert.deepEqual(dry.skips,[]);
    assert.equal(fs.readFileSync(dst,'utf8'),fs.readFileSync(path.join(root,SOURCE),'utf8'));
    const done=run(['--apply']);assert.equal(done.figures,2);
    const bank=(code=>{const w={};new Function('window',code)(w);return w.questionBank;})(fs.readFileSync(dst,'utf8'));
    assert.equal(bank.find(q=>q.id==='s01').solutionImage,`assets/images/${EXAM}/s01-solution.svg`);
    assert.equal(bank.find(q=>q.id==='q01').solutionImage,`assets/images/${EXAM}/q01-solution.svg`);
    assert.equal(bank.filter(q=>q.solutionImage).length,2);
    assert.ok(fs.existsSync(path.join(dir,`archive/assets/images/${EXAM}/s01-solution.svg`)));
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

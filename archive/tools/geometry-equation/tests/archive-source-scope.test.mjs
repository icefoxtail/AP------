// The Archive display measurement takes any .js exam under archive/exams/ (original, similar, textbooks and every other folder), so the similar and textbook
// questions reach the engine instead of stopping at ARCHIVE_INPUT_INVALID SOURCE_SCOPE. Path escapes, files that are not .js and paths outside archive/exams/ stay refused.
// No Chrome: the scope check runs before any measurement, and the identity check right after it shows which side of the check a path fell on.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {isArchiveExamSourcePath} from '../record-visual-browser-evidence.mjs';
import {measureArchiveTypographyPolicy} from '../production/construction-archive-capture-v1.mjs';
import {assetIdentity} from '../production/contracts.mjs';

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../../');
const first=(dir)=>{const found=fs.readdirSync(path.join(repo,dir),{recursive:true}).map(String).find(name=>name.endsWith('.js'));return found&&('archive/exams/'+dir.replace(/^archive\/exams\//,'')+'/'+found.replaceAll('\\','/'));};

test('original, similar, textbooks and any other folder under archive/exams/ are in scope; everything else is not',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'exam-scope-'));
  for(const folder of ['original/high','similar/high','textbooks/book','other/anything/deep']){
    fs.mkdirSync(path.join(root,'archive/exams',folder),{recursive:true});
    fs.writeFileSync(path.join(root,'archive/exams',folder,'a.js'),'window.questionBank=[];');
  }
  fs.writeFileSync(path.join(root,'archive/exams/similar/high/data.json'),'{}');
  fs.mkdirSync(path.join(root,'archive/data'),{recursive:true});fs.writeFileSync(path.join(root,'archive/data/x.js'),'');
  fs.writeFileSync(path.join(root,'outside.js'),'');
  for(const folder of ['original/high','similar/high','textbooks/book','other/anything/deep'])assert.equal(isArchiveExamSourcePath('archive/exams/'+folder+'/a.js',root),true,folder);
  const refused=['archive/exams/similar/high/data.json','archive/data/x.js','outside.js','archive/exams/../data/x.js','archive/exams/similar/../../data/x.js','archive/exams//similar/high/a.js',
    '/archive/exams/similar/high/a.js','C:/archive/exams/similar/high/a.js','archive\\exams\\similar\\high\\a.js','archive/exams/similar/high/missing.js',null,42];
  for(const value of refused)assert.equal(isArchiveExamSourcePath(value,root),false,String(value));
  // a link out of archive/exams/ (to a file elsewhere in the same tree) is refused
  try{
    fs.symlinkSync(path.join(root,'archive/data/x.js'),path.join(root,'archive/exams/similar/high/link.js'));
    assert.equal(isArchiveExamSourcePath('archive/exams/similar/high/link.js',root),false,'symlink out of archive/exams');
  }catch(error){if(error.code!=='EPERM'&&error.code!=='EACCES')throw error;}   // creating a link needs a privilege on some systems
});

test('the measurement accepts a similar and a textbook exam of this repository and refuses a path outside archive/exams/',async()=>{
  const similar=first('archive/exams/similar'),textbook=first('archive/exams/textbooks');
  assert.ok(similar&&textbook,'the repository has a similar and a textbook exam');
  for(const sourcePath of [similar,textbook])assert.equal(isArchiveExamSourcePath(sourcePath),true,sourcePath);
  // A deliberately wrong identity stops right after the scope check: IDENTITY_SOURCE_MISMATCH means the path was in scope, SOURCE_SCOPE that it was not.
  const identity=assetIdentity('99_other_exam|1','SOLUTION_VISUAL','decisive-relation');
  const measure=sourcePath=>measureArchiveTypographyPolicy({identity,sourcePath,ordinal:1,requestedSizeClass:'full',intrinsicSvg:{width:400,height:300},runId:'scope-test-'+Math.random().toString(36).slice(2)});
  const original=first('archive/exams/original');
  for(const sourcePath of [original,similar,textbook]){
    const outcome=await measure(sourcePath);
    assert.notEqual(outcome.detail?.reason,'SOURCE_SCOPE',sourcePath);
  }
  for(const sourcePath of ['archive/data/x.js','archive/exams/similar/x.json','archive/exams/../data/x.js']){
    const outcome=await measure(sourcePath);
    assert.equal(outcome.status,'ARCHIVE_INPUT_INVALID',sourcePath);assert.equal(outcome.detail.reason,'SOURCE_SCOPE',sourcePath);
  }
});

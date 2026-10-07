import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import path from 'node:path';
const dir='C:/Users/USER/Desktop/AP-worktrees/m3-codex-main-done/AP------/archive/analysis/m3-codex-20261007/21_풍덕중_2학기_기말_중3_기출';
const sourcePath='C:/Users/USER/Desktop/AP-worktrees/m3-codex-main-done/AP------/.tmp/archive/m3-codex-20261007/21_풍덕중_2학기_기말_中3_기출/21_풍덕중_2학기_기말_중3_기출.js'.replace('中','중');
const expected='f55f55c1d1978b8a8cd423a56688b841f3ff02a0f6a9d64f1112970628a05efa';
const sourceBytes=fs.readFileSync(sourcePath);
const sourceSha=crypto.createHash('sha256').update(sourceBytes).digest('hex');
if(sourceSha!==expected) throw new Error('SOURCE_SHA_MISMATCH:'+sourceSha);
const context={window:Object.create(null)};
vm.runInNewContext(sourceBytes.toString('utf8'),context,{timeout:1500,contextCodeGeneration:{strings:false,wasm:false}});
const bank=context.window.questionBank||context.window.questions;
if(!Array.isArray(bank)||bank.length!==25) throw new Error('QID_DENOMINATOR_MISMATCH');
const qids=Array.from({length:25},(_,i)=>i+1);
const rows=bank.filter(q=>qids.includes(Number(q.id??q.qid))).map(q=>({
  qid:Number(q.id??q.qid),
  answer:q.answer??null,
  solution:q.solution??q.explanation??q.sol??null,
  solutionSha256:crypto.createHash('sha256').update(String(q.solution??q.explanation??q.sol??'')).digest('hex')
})).sort((a,b)=>a.qid-b.qid);
if(rows.length!==25||rows.some((r,i)=>r.qid!==i+1)) throw new Error('TARGET_QID_COVERAGE_MISMATCH');
const out={schemaVersion:'R2_POSTFREEZE_QID_LIMITED_EXTRACTION_V1',runId:'m3-codex-20261007',examUid:'21_풍덕중_2학기_기말_중3_기출',sourceSha256:sourceSha,sourceGitBlobSha1:'b1d64930d423d8280f0bb9dda72096694d15808d',qids,rows};
const outputPath=path.join(dir,'R2.postfreeze-extraction.json');
if(fs.existsSync(outputPath)) throw new Error('REFUSE_OVERWRITE');
fs.writeFileSync(outputPath,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({path:outputPath,sha256:crypto.createHash('sha256').update(fs.readFileSync(outputPath)).digest('hex'),qids:rows.map(({qid,answer})=>({qid,answer}))}));
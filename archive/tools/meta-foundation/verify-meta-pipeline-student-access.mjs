import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

// Metadata completeness is supplementary. Missing source, broken question or
// solution content and missing local visual assets remain release failures.
export function verifyStudentAccess(root, request) {
  const failures=[], source=request.sourceArchiveFile;
  const base=path.resolve(root,'archive/exams'),file=path.resolve(base,source||'');
  if(!source||!file.startsWith(base+path.sep)||!file.endsWith('.js'))return {status:'FAIL',failures:['INVALID_SOURCE_PATH']};
  try {
    if(!fs.existsSync(path.join(root,'archive/engine.html')))throw Error('ENGINE_MISSING');
    const ctx=vm.createContext({window:{},console:{log(){},warn(){},error(){}}},{codeGeneration:{strings:false,wasm:false}});
    vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{timeout:5000});
    const rows=ctx.window.questionBank||ctx.window.questions||ctx.questions||ctx.questionBank||ctx.window.examData?.questions;
    if(!Array.isArray(rows)||!rows.length)throw Error('QUESTION_BANK_MISSING');
    if(request.expectedQuestionCount!==rows.length)failures.push('QUESTION_COUNT_MISMATCH');
    const checkAsset=(url,qid)=>{
      if(url&&typeof url==='object'){url=url.src||url.url||url.path;if(!url){failures.push(`${qid}:ASSET_REFERENCE_UNSUPPORTED`);return;}}
      if(typeof url!=='string'||!url.trim()||url.trim().startsWith('<svg')||/^data:/i.test(url))return;
      if(/^https?:/i.test(url)){failures.push(`${qid}:REMOTE_ASSET_NOT_VERIFIED:${url}`);return;}
      const rel=url.split(/[?#]/)[0].replace(/^\/?archive\//,'').replace(/^\//,'');
      const asset=path.resolve(root,'archive',rel);
      if(!asset.startsWith(path.resolve(root,'archive')+path.sep)||!fs.existsSync(asset))failures.push(`${qid}:ASSET_MISSING:${url}`);
    };
    rows.forEach((q,i)=>{
      const qid=i+1;
      if(!String(q.content??q.question??q.stem??'').trim())failures.push(`${qid}:QUESTION_EMPTY`);
      if(!String(q.solution??q.explanation??'').trim()&&!q.solutionImage&&!q.solutionFigureSvg)failures.push(`${qid}:SOLUTION_EMPTY`);
      if(q.questionType==='객관식'&&(!Array.isArray(q.choices)||!q.choices.length))failures.push(`${qid}:CHOICES_EMPTY`);
      for(const value of [q.image,...(Array.isArray(q.images)?q.images:[]),q.solutionImage])checkAsset(value,qid);
      for(const html of [q.content,q.solution,q.figureSvg,q.solutionFigureSvg])for(const m of String(html||'').matchAll(/(?:src|href)=["']([^"']+)["']/g)){
        if(!m[1].startsWith('#'))checkAsset(m[1],qid);
      }
    });
    return {status:failures.length?'FAIL':'PASS',sourceArchiveFile:source,questionCount:rows.length,failures,browserRendering:'NOT_RUN',mathReview:'NOT_RUN'};
  }catch(error){return {status:'FAIL',sourceArchiveFile:source,failures:[...failures,error.message],browserRendering:'NOT_RUN'};}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=process.argv.slice(2),root=process.cwd(),files=[];
  for(let i=0;i<args.length;i++)if(args[i]==='--request')files.push(args[++i]);
  const reports=files.map(f=>verifyStudentAccess(root,JSON.parse(fs.readFileSync(f,'utf8'))));
  console.log(JSON.stringify({reports},null,2));process.exitCode=reports.length&&reports.every(r=>r.status==='PASS')?0:1;
}

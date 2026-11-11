import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

export function semanticFailuresAreSupplementary(report) {
  const reasons=new Set(['NOT_APPROVED_IN_CONSUMER','METADATA_CONFLICT','META_PIPELINE_RUNTIME_MISSING','VALUE_MISMATCH','NOT_DIRECT_SELECTABLE','NOT_RETURNED_BY_PAGE_QUERY','NOT_IN_PROBLEM_BANK_INDEX','ROW_MISSING_IN_RESOLVED_CATALOG','SOURCE_BLOB_MISMATCH','SOURCE_FINGERPRINT_MISMATCH','BODY_FINGERPRINT_MISMATCH']);
  return report?.status==='FAIL'&&Array.isArray(report.failures)&&report.failures.length>0&&report.failures.every(r=>reasons.has(r.reason));
}

// Metadata completeness is supplementary. Missing source, broken question or
// solution content and missing local visual assets remain release failures.
export function verifyStudentAccess(root, request) {
  const failures=[],supplements=[], source=request.sourceArchiveFile;
  const base=path.resolve(root,'archive/exams'),file=path.resolve(base,source||'');
  if(!source||!file.startsWith(base+path.sep)||!file.endsWith('.js'))return {status:'FAIL',failures:['INVALID_SOURCE_PATH']};
  try {
    if(!fs.existsSync(path.join(root,'archive/engine.html')))throw Error('ENGINE_MISSING');
    const ctx=vm.createContext({window:{},console:{log(){},warn(){},error(){}}},{codeGeneration:{strings:false,wasm:false}});
    vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{timeout:5000});
    const rows=ctx.window.questionBank||ctx.window.questions||ctx.questions||ctx.questionBank||ctx.window.examData?.questions;
    if(!Array.isArray(rows)||!rows.length)throw Error('QUESTION_BANK_MISSING');
    if(request.expectedQuestionCount!==rows.length)failures.push('QUESTION_COUNT_MISMATCH');
    // Some original exams contain all choices inside a single problem image.
    // Accept that representation only with an explicit, SHA-bound visual review.
    let visualChoices=[];
    if(request.studentAccessEvidenceRef){
      const ref=request.studentAccessEvidenceRef, evidencePath=path.resolve(root,ref.path||'');
      if(!evidencePath.startsWith(path.resolve(root,'archive/data/meta-foundation/evidence')+path.sep))throw Error('INVALID_STUDENT_ACCESS_EVIDENCE_PATH');
      const bytes=fs.readFileSync(evidencePath);
      if(crypto.createHash('sha256').update(bytes).digest('hex')!==ref.sha256)throw Error('STUDENT_ACCESS_EVIDENCE_SHA_MISMATCH');
      const evidence=JSON.parse(bytes.toString('utf8'));
      if(evidence.schemaVersion!=='archive-visual-choice-review-v1'||evidence.sourceArchiveFile!==source||evidence.requestId!==request.requestId||!Array.isArray(evidence.records))throw Error('STUDENT_ACCESS_EVIDENCE_IDENTITY_MISMATCH');
      visualChoices=evidence.records;
    }
    const hasReviewedImageChoices=(q,qid)=>{
      const matches=visualChoices.filter(r=>r.sourceOrdinal===qid);
      if(matches.length!==1)return false;
      const r=matches[0], item=(request.items||[]).find(x=>x.sourceOrdinal===qid);
      if(!item||item.questionUid!==r.questionUid||r.choiceCount!==5||r.visualReview!=='CHOICES_1_TO_5_PRESENT'||r.imagePath!==q.image||!r.reviewer)return false;
      const file=path.resolve(root,'archive',r.imagePath||'');
      return file.startsWith(path.resolve(root,'archive/assets/images')+path.sep)&&fs.existsSync(file)&&crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')===r.imageSha256;
    };
    const checkAsset=(url,qid,{supplemental=false}={})=>{
      const report=supplemental?supplements:failures;
      if(url&&typeof url==='object'){url=url.src||url.url||url.path;if(!url){report.push(`${qid}:${supplemental?'SOLUTION_ASSET_REFERENCE_UNSUPPORTED':'ASSET_REFERENCE_UNSUPPORTED'}`);return;}}
      if(typeof url!=='string'||!url.trim()||url.trim().startsWith('<svg')||/^data:/i.test(url))return;
      if(/^https?:/i.test(url)){report.push(`${qid}:${supplemental?'SOLUTION_ASSET_NOT_VERIFIED':'REMOTE_ASSET_NOT_VERIFIED'}:${url}`);return;}
      const rel=url.split(/[?#]/)[0].replace(/^\/?archive\//,'').replace(/^\//,'');
      const asset=path.resolve(root,'archive',rel);
      if(!asset.startsWith(path.resolve(root,'archive')+path.sep)||!fs.existsSync(asset))report.push(`${qid}:${supplemental?'SOLUTION_ASSET_PENDING':'ASSET_MISSING'}:${url}`);
    };
    rows.forEach((q,i)=>{
      const qid=i+1;
      if(!String(q.content??q.question??q.stem??'').trim())failures.push(`${qid}:QUESTION_EMPTY`);
      if(!String(q.solution??q.explanation??'').trim()&&!q.solutionImage&&!q.solutionFigureSvg)supplements.push(`${qid}:SOLUTION_PENDING`);
      if(q.questionType==='객관식'&&(!Array.isArray(q.choices)||!q.choices.length)&&!hasReviewedImageChoices(q,qid))failures.push(`${qid}:CHOICES_EMPTY`);
      checkAsset(q.image,qid);
      const displayed=[q.image,...Array.from(String(q.content||'').matchAll(/(?:src|href)=["']([^"']+)["']/g),m=>m[1])].filter(x=>typeof x==='string'&&x.startsWith('assets/images/'));
      for(const value of (Array.isArray(q.images)?q.images:[])){
        // Legacy metadata sometimes repeats only the basename of a displayed asset.
        // Resolve it only when the displayed canonical asset is unique and exists.
        const aliases=typeof value==='string'&&!/[\\/]/.test(value)?displayed.filter(x=>path.posix.basename(x.split(/[?#]/)[0])===value):[];
        if(aliases.length===1&&fs.existsSync(path.resolve(root,'archive',aliases[0])))checkAsset(aliases[0],qid);else checkAsset(value,qid);
      }
      if(q.solutionImage)checkAsset(q.solutionImage,qid,{supplemental:true});
      for(const [html,supplemental] of [[q.content,false],[q.figureSvg,false],[q.solution,true],[q.solutionFigureSvg,true]])for(const m of String(html||'').matchAll(/(?:src|href)=["']([^"']+)["']/g)){
        if(!m[1].startsWith('#'))checkAsset(m[1],qid,{supplemental});
      }
    });
    return {status:failures.length?'FAIL':'PASS',sourceArchiveFile:source,questionCount:rows.length,failures,supplements,browserRendering:'NOT_RUN',mathReview:'NOT_RUN'};
  }catch(error){return {status:'FAIL',sourceArchiveFile:source,failures:[...failures,error.message],browserRendering:'NOT_RUN'};}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=process.argv.slice(2),root=process.cwd(),files=[];
  if(args.includes('--supplement-report')) {
    const report=JSON.parse(fs.readFileSync(args[args.indexOf('--supplement-report')+1],'utf8'));
    if(!semanticFailuresAreSupplementary(report)){console.error('CONSUMER_INFRASTRUCTURE_OR_IDENTITY_FAILURE');process.exit(1);}
    process.exit(0);
  }
  for(let i=0;i<args.length;i++)if(args[i]==='--request')files.push(args[++i]);
  const reports=files.map(f=>verifyStudentAccess(root,JSON.parse(fs.readFileSync(f,'utf8'))));
  console.log(JSON.stringify({reports},null,2));process.exitCode=reports.length&&reports.every(r=>r.status==='PASS')?0:1;
}

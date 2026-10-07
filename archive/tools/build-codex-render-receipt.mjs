import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {validateCodexRenderReceipt} from './archive-codex-closeout-v2.mjs';
import {fileURLToPath} from 'node:url';
export function buildReviewedReceipt({root,capturePath,reviewPath,r3ValidationPath}){
  root=fs.realpathSync(path.resolve(root));
  const bound=p=>{const f=path.resolve(root,p),rel=path.relative(root,f);if(rel.startsWith('..')||path.isAbsolute(rel))throw Error('PATH_ESCAPE');const real=fs.realpathSync(f);if(path.relative(root,real).startsWith('..'))throw Error('SYMLINK_ESCAPE');return f;};
  const sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>fs.readFileSync(bound(p)),captureBytes=read(capturePath),capture=JSON.parse(captureBytes),review=JSON.parse(read(reviewPath));
  if(capture.status!=='CAPTURED_REVIEW_REQUIRED'||capture.renderPass!==false)throw Error('MACHINE_CAPTURE_REQUIRED');
  if(review.schemaVersion!=='JS_ARCHIVE_CODEX_R3_CAPTURE_REVIEW_V1'||review.captureReportSha256!==sha(captureBytes)||review.artifactSha!==capture.artifactSha||review.reviewerIdentity?.role!=='archive_r3'||!review.reviewerIdentity?.reviewerId)throw Error('R3_SHA_BOUND_REVIEW_REQUIRED');
  const expected=['exam/desktop','exam/mobile','sol/desktop','sol/mobile','ans/desktop','ans/mobile'];
  if(capture.cases.length!==6||new Set(capture.cases.map(c=>c.id)).size!==6||review.cases?.length!==6||new Set(review.cases.map(c=>c.id)).size!==6)throw Error('SIX_UNIQUE_CASES_REQUIRED');
  const cases=expected.map(id=>{
    const actual=capture.cases.find(c=>c.id===id),judgment=review.cases.find(c=>c.id===id);
    if(!actual||!judgment||actual.mechanicalStatus!=='PASS'||judgment.layoutReviewStatus!=='PASS'||judgment.mathJaxStatus!=='PASS'||judgment.assetDecodeStatus!=='PASS')throw Error('ACTUAL_R3_CASE_REVIEW_REQUIRED:'+id);
    if(!Array.isArray(judgment.reviewedQids)||new Set(judgment.reviewedQids).size!==capture.qids.length||capture.qids.some(q=>!judgment.reviewedQids.includes(q)))throw Error('R3_FULL_QID_REVIEW_REQUIRED:'+id);
    for(const c of actual.captures)if(!judgment.reviewedCaptureSha256s?.includes(c.image.sha256)||sha(read(c.image.path))!==c.image.sha256)throw Error('REVIEWED_CAPTURE_SHA_REQUIRED:'+id);
    return {...actual,status:'PASS',layoutReviewStatus:'PASS',mathJaxStatus:'PASS',assetDecodeStatus:'PASS'};
  });
  const receipt={executionLine:'CODEX',qualityContractVersion:capture.qualityContractVersion,status:'RENDER_PASS',artifactSha:capture.artifactSha,loadedJs:capture.loadedJs,r3Validation:{path:r3ValidationPath,sha256:sha(read(r3ValidationPath))},cases,r3ReviewerIdentity:review.reviewerIdentity,captureReport:{path:capturePath,sha256:sha(captureBytes)},review:{path:reviewPath,sha256:sha(read(reviewPath))}};
  const assets=[...new Map(cases.flatMap(c=>c.loadedAssets).map(a=>[a.ref,{ref:a.ref,sha256:a.sha256}])).values()];
  const result=validateCodexRenderReceipt({receipt,root,artifactSha:capture.artifactSha,assets,qids:capture.qids});
  if(!result.ok)throw Error('RENDER_RECEIPT_REJECTED:'+result.issues.join(','));
  return receipt;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args={};for(let i=2;i<process.argv.length;i++){const k=process.argv[i];if(!['--root','--capture','--review','--r3-validation','--output'].includes(k))throw Error('UNKNOWN_ARGUMENT:'+k);args[k.slice(2)]=process.argv[++i];}
  const receipt=buildReviewedReceipt({root:args.root,capturePath:args.capture,reviewPath:args.review,r3ValidationPath:args['r3-validation']});
  const output=path.resolve(args.root,args.output),rel=path.relative(path.resolve(args.root),output);if(rel.startsWith('..')||path.isAbsolute(rel)||fs.existsSync(output))throw Error('FRESH_IN_ROOT_OUTPUT_REQUIRED');
  fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({status:'RENDER_PASS',output:args.output}));
}

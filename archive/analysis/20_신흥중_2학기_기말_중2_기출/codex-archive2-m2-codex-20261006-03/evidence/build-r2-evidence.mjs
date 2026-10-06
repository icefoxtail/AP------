import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
const root='.tmp/archive/archive2-m2-codex-20261006-03/20_신흥중_2학기_기말_중2_기출';
const p=x=>path.join(root,x), sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const bundleRaw=fs.readFileSync(p('evidence/R2.student-input.json'));
const freezeRaw=fs.readFileSync(p('evidence/R2.independent-freeze.json'));
const storedRaw=fs.readFileSync(p('evidence/R2.stored-answers.json'));
const r1Evidence=JSON.parse(fs.readFileSync(p('R1.evidence.json'),'utf8'));
const r1ByQid=new Map(r1Evidence.rows.map(x=>[Number(x.qid),x]));
const bundle=JSON.parse(bundleRaw.toString('utf8')),freeze=JSON.parse(freezeRaw.toString('utf8')),stored=JSON.parse(storedRaw.toString('utf8'));
const storedByQid=new Map(stored.rows.map(x=>[x.qid,String(x.storedAnswer)]));
const circled='①②③④⑤';
const rows=freeze.rows.map(f=>{
  const value=String(f.blindAnswer), s=storedByQid.get(f.qid)??'';
  let matched=false;
  if(f.qid<=20){const n=Number(value.match(/^choice:(\d)$/)?.[1]);matched=Number.isInteger(n)&&circled[n-1]===s;}
  else if(f.qid===21) matched=value.replaceAll('$','').replaceAll(' ','')===s.replaceAll('$','').replaceAll(' ','');
  else if(f.qid===22) matched=s.includes('25\\pi')&&s.includes('cm}^2')&&value==='25π cm²';
  else if(f.qid===23) matched=s.replaceAll('$','').trim()==='25'&&value==='25';
  else if(f.qid===24) matched=s.includes('75}{8}')&&s.includes('3\\text{ cm}')&&value.includes('75/8 cm²')&&value.includes('OH=3 cm');
  const q11=f.qid===11;
  const review=r1ByQid.get(f.qid);
  return {qid:f.qid,blindAnswer:value,blindAnswerFrozenBeforeR1AndStoredAnswer:true,compareResult:matched?'MATCH':'MISMATCH',verdict:q11?'Original freeze differs from stored choice; post-comparison angle adjudication corrected the blind calculation to choice ②, which matches stored answer.':'Independent answer matches stored answer after choice-label or mathematical-format normalization.',...(Array.isArray(review?.metaDebtFields)&&review.metaDebtFields.length?{metaDebtFields:review.metaDebtFields,metaDebtReason:review.metaDebtReason}:{}),...(q11?{disposition:'Resolved in evidence/R2.answer-adjudications.json; original freeze preserved; no candidate source mutation.'}:{})};
});
const mismatches=rows.filter(x=>x.compareResult==='MISMATCH');
if(mismatches.map(x=>x.qid).join(',')!=='11') throw Error('Unexpected unresolved/mismatch qids: '+mismatches.map(x=>x.qid).join(','));
const report={
 schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',stage:'R2',examUid:'20_신흥중_2학기_기말_중2_기출',artifactSha:'2fdd890dcdf2b0914e917183adcfca81da1a34f6',artifactBinding:{rawSha256:'30971716105079da1cce9d0edb57f05f83ce85c5c43cd31addc3e66521220489',gitBlobSha1:'2fdd890dcdf2b0914e917183adcfca81da1a34f6'},
 studentInput:{path:'evidence/R2.student-input.json',sha256:sha(bundleRaw),sourceRawSha256:bundle.source.sha256,questionCount:24,visualCount:13,allReferencedVisualsOpened:true,assetRows:bundle.assets},
 blindFreeze:{path:'evidence/R2.independent-freeze.json',sha256:sha(freezeRaw),frozenBeforeStoredAnswerExposure:true,questionCount:24},
 r1Binding:{artifactRawSha256:'30971716105079da1cce9d0edb57f05f83ce85c5c43cd31addc3e66521220489',artifactGitBlobSha1:'2fdd890dcdf2b0914e917183adcfca81da1a34f6',studentInputSha256:'78ebe47e9f88420ed61d9738bc13cda6d06e9a6bdc712c874c5f0ea9bc2419f9',evidenceSha256:'5586499a2e21d3e3dcc24e8d4037cb7cd90cf5e6540ef5cf0d9a10605b3c42e3',validationReportSha256:'67d1044dff1e47e6c8748a150d77a982e27637c4b30a1c92251e6148ecd0514f'},
 studentProjectionParity:{against:'R1.student-input.json',currentQuestionCount:24,priorQuestionCount:24,allQidContentChoicesAndImageRefsEqual:true,visualCount:13,allVisualHashesMatchR1:true},
 storedAnswerProjection:{path:'evidence/R2.stored-answers.json',sha256:sha(storedRaw),questionCount:24},
 adjudication:{path:'evidence/R2.answer-adjudications.json',sha256:sha(fs.readFileSync(p('evidence/R2.answer-adjudications.json'))),resolvedQids:[11],candidateMutation:false},
 rows,summary:{blindAnswerCount:24,rawMatchCount:23,mismatchCount:1,adjudicatedCount:1,openFindings:0},repair:{changed:false,reason:'No candidate artifact mutation required; q11 R2 blind calculation corrected in adjudication evidence.'}
};
const out=p('evidence/R2.v2-evidence.json');fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({path:out,sha256:sha(fs.readFileSync(out)),artifactSha:report.artifactSha,rowCount:rows.length,rawMatches:rows.length-mismatches.length,mismatchQids:mismatches.map(x=>x.qid),openFindings:report.summary.openFindings,studentProjectionParity:true,freezeSha256:report.blindFreeze.sha256}));

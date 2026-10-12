import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root='C:/Users/USER/Desktop/AP------',dir='archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_효천고_1학기_중간_고2_확률과통계/R1_20261012';
const plain=b=>crypto.createHash('sha256').update(b).digest('hex');
const physical=JSON.parse(fs.readFileSync(root+'/'+dir+'/R1.physical-review.final.rev2.json','utf8'));
physical.examUid='18_효천고_1학기_중간_고2_확률과통계';
const physicalOut=dir+'/R1.physical-review.final.rev3.json';
fs.writeFileSync(root+'/'+physicalOut,JSON.stringify(physical,null,2)+'\n',{flag:'wx'});
const evidence=JSON.parse(fs.readFileSync(root+'/'+dir+'/R1.evidence.final.rev2.json','utf8'));
evidence.examUid='18_효천고_1학기_중간_고2_확률과통계';
evidence.physicalReviewRef={path:physicalOut,sha256:plain(fs.readFileSync(root+'/'+physicalOut))};
for(const sample of evidence.goldenCalibration.samples){
 sample.sha256=plain(fs.readFileSync(root+'/'+sample.path));
 for(const item of sample.items){
  const qpath=sample.path;
  const qfile=path.join(root,qpath);
  const source=fs.readFileSync(qfile,'utf8');
  const match=source.match(new RegExp('"id"\\s*:\\s*'+item.qid+'[\\s\\S]*?"solution"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"'));
  if(!match)throw Error('GOLDEN_ITEM_SOLUTION_NOT_FOUND:'+qpath+':q'+item.qid);
  const sol=JSON.parse('"'+match[1]+'"');
  item.solutionSha256=plain(Buffer.from(sol));
  if(item.visualSha256){const exam=path.basename(qpath,'.js');const imageRef=item.qid===7?'assets/images/'+exam+'/q7-solution.svg':item.qid===2?'assets/images/'+exam+'/q02-solution.svg':'assets/images/'+exam+'/q03-solution.svg';item.visualSha256=plain(fs.readFileSync(path.join(root,'archive',imageRef)));}
 }
}
evidence.goldenCalibration.negativeSample.sha256=plain(fs.readFileSync(root+'/'+evidence.goldenCalibration.negativeSample.path));
const out=dir+'/R1.evidence.final.rev3.json';
fs.writeFileSync(root+'/'+out,JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({physicalPath:physicalOut,physicalSha256:plain(fs.readFileSync(root+'/'+physicalOut)),genericEvidencePath:out,genericEvidenceSha256:plain(fs.readFileSync(root+'/'+out)),negativeSampleSha256:evidence.goldenCalibration.negativeSample.sha256,goldenSampleCount:evidence.goldenCalibration.samples.length},null,2));

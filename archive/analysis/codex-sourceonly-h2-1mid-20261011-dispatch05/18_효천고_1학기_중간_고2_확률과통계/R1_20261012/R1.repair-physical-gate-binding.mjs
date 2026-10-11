import fs from 'node:fs';
import crypto from 'node:crypto';
const root='C:/Users/USER/Desktop/AP------',dir='archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_효천고_1학기_중간_고2_확률과통계/R1_20261012';
const hash=b=>'sha256:'+crypto.createHash('sha256').update(b).digest('hex');
const physical=JSON.parse(fs.readFileSync(root+'/'+dir+'/R1.physical-review.final.json','utf8'));
physical.examSha256=hash(fs.readFileSync(root+'/archive/exams/original/high/h2/1mid/18_효천고_1학기_중간_고2_확률과통계.js'));
physical.independence={createReceiptUsedAsAuthority:false,independentAnswersFrozenBeforeStoredAnswer:true,postfreezeComparisonAfterFreeze:true};
for(const row of physical.visualRows){row.assetSha256=hash(fs.readFileSync(root+'/archive/'+row.assetPath));}
const physicalOut=dir+'/R1.physical-review.final.rev2.json';
fs.writeFileSync(root+'/'+physicalOut,JSON.stringify(physical,null,2)+'\n',{flag:'wx'});
const evidence=JSON.parse(fs.readFileSync(root+'/'+dir+'/R1.evidence.final.json','utf8'));
evidence.physicalReviewRef={path:physicalOut,sha256:hash(fs.readFileSync(root+'/'+physicalOut))};
const genericOut=dir+'/R1.evidence.final.rev2.json';
fs.writeFileSync(root+'/'+genericOut,JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({physicalPath:physicalOut,physicalSha256:hash(fs.readFileSync(root+'/'+physicalOut)),genericPath:genericOut,genericSha256:hash(fs.readFileSync(root+'/'+genericOut))},null,2));

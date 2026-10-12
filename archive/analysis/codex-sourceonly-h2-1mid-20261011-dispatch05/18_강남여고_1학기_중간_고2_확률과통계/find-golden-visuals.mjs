import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const reg=JSON.parse(fs.readFileSync('archive/data/codex-quality-calibration-registry-v2.json','utf8'));
for(const p of reg.goldenPaths){const w={};vm.runInNewContext(fs.readFileSync(p,'utf8'),{window:w},{timeout:5000});const imgs=w.questionBank.filter(q=>q.solutionImage).map(q=>({qid:q.id,solutionImage:q.solutionImage,solutionSha256:crypto.createHash('sha256').update(q.solution).digest('hex')}));console.log(JSON.stringify({path:p,solutionImageCount:imgs.length,items:imgs}));}

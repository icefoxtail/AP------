import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
const [root, ...paths] = process.argv.slice(2);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const out=[];
for (const rel of paths) {
 const abs=path.resolve(root,rel), bytes=fs.readFileSync(abs), box={window:{}};
 vm.runInNewContext(bytes.toString('utf8'),box,{timeout:5000});
 const bank=box.window.questionBank||box.window.questions;
 const qs=[1,2,3].map(qid=>{
  const q=bank.find(x=>Number(x.id)===qid); if(!q)throw Error('qid '+qid+' missing in '+rel);
  const svg=q.solutionImage||null;
  const svgPath=svg?path.resolve(root,'archive',svg):null;
  return {qid,content:q.content,choices:q.choices,solution:q.solution,solutionSha256:sha(Buffer.from(q.solution||'')),solutionImage:svg,solutionImagePath:svgPath,solutionImageSha256:svgPath&&fs.existsSync(svgPath)?sha(fs.readFileSync(svgPath)):null};
 });
 out.push({path:rel,sha256:sha(bytes),questions:qs});
}
process.stdout.write(JSON.stringify(out,null,2));

import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const root='C:/Users/USER/Desktop/AP-worktrees/m3-codex-main-done/AP------';
const samples=[
 ['archive/exams/original/middle/m3/2final/25_왕운중_2학기_기말_중3_기출.js',[1,5,15]],
 ['archive/exams/original/middle/m3/2final/25_신흥중_2학기_기말_중3_기출.js',[1,7,14]],
 ['archive/exams/original/middle/m3/2final/25_금당중_2학기_기말_중3_기출.js',[1,8,15]]
];
for (const [rel, ids] of samples) {
 const path=`${root}/${rel}`.replaceAll('\\','/');
 const bytes=fs.readFileSync(path); const ctx={window:{}};
 vm.runInNewContext(bytes.toString('utf8'),ctx,{timeout:1000});
 console.log(JSON.stringify({path:rel,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),items:ctx.window.questionBank.filter(q=>ids.includes(Number(q.id))).map(q=>({id:q.id,tags:q.tags,answer:q.answer,solution:q.solution,content:q.content}))},null,2));
}

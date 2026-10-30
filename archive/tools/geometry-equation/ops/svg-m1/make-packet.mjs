// usage: node make-packet.mjs <exam js path (repo-relative)> <out.json> [--with-existing]
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm';
const [src,out,flag]=process.argv.slice(2); const root='/home/user/AP------/';
const c={window:{}}; vm.runInNewContext(fs.readFileSync(root+src,'utf8'),c);
const exam=path.basename(src,'.js');
const items=c.window.questionBank.map(q=>{const r={ord:q.id,type:q.questionType,unit:q.standardUnit,subUnit:q.subUnit,content:q.content,choices:q.choices,answer:q.answer,solution:q.solution,...(q.sharedMaterial?{sharedMaterial:q.sharedMaterial}:{}),
  questionImage:q.image?root+'archive/'+q.image:null};
  if(flag==='--with-existing'&&q.solutionImage)r.existingSolutionImage=root+'archive/'+q.solutionImage;return r;});
fs.writeFileSync(out,JSON.stringify({exam,sourcePath:src,items},null,1));console.log(exam,items.length,'items');

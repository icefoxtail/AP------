const fs=require('fs'),vm=require('vm'),path=require('path');
const S=__dirname;
const [,,exam,...ords]=process.argv;
const f=S+'/ex/archive/exams/'+exam+'.js';
const c={window:{}};vm.runInNewContext(fs.readFileSync(f,'utf8'),c);
const q=c.window.questionBank||c.window.examData.questions;
const L=JSON.parse(fs.readFileSync(S+'/mainledger.json','utf8'));
for(const o of ords){const it=q[+o-1];
  console.log('=== '+exam.split('/').pop()+' q'+o+' (id '+it.id+')');
  console.log('Q:',it.content);
  if(it.choices)console.log('C:',JSON.stringify(it.choices));
  console.log('A:',it.answer);
  console.log('S:',it.solution);
  console.log('IMG:',it.solutionImage||'-','| alt:',(it.solutionImageAlt||'').slice(0,100),'| prob img fields:',['image','problemImage','images','figure'].filter(k=>it[k]).join(','));
  const l=L.find(r=>r.src==='archive/exams/'+exam+'.js'&&r.ord===+o);if(l)console.log('LEDGER:',l.state,l.reason,l.note);
}

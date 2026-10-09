import fs from 'node:fs';
import vm from 'node:vm';
const root='C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------';
for (const [f,ids] of [['archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js',[7,8]],['archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',[2,3]]]) {
 const src=fs.readFileSync(root+'/'+f); const w={}; vm.runInNewContext(src.toString('utf8'),{window:w});
 console.log('\nFILE',f,'sha256',require('crypto').createHash('sha256').update(src).digest('hex'));
 for(const id of ids){const q=w.questionBank.find(x=>x.id===id); console.log('\nQ',id,'content',q.content,'answer',q.answer,'image',q.image||'', 'solutionImage',q.solutionImage||'','\nSOLUTION\n'+q.solution); if(q.solutionImage){const p=root+'/archive/'+q.solutionImage; const b=fs.readFileSync(p); console.log('SVG',q.solutionImage,'sha256',require('crypto').createHash('sha256').update(b).digest('hex'),'\n'+b.toString('utf8').slice(0,3000));}}
}

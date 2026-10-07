const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root='C:/Users/USER/Desktop/AP-worktrees/m3-codex-main-done/AP------';
const ev=path.join(root,'archive/analysis/m3-codex-20261007/21_신흥중_2학기_기말_중3_기출');
const a=JSON.parse(fs.readFileSync(path.join(ev,'CREATE.assignment.json'),'utf8'));
const c={window:{}};vm.runInNewContext(fs.readFileSync(a.workingJsAbsolute,'utf8'),c);
const q=c.window.questionBank.find(x=>x.id===18);q.answer='';q.solution='';q.reviewStatus='HOLD';q.difficultyBucket=2;q.difficultyConfidence='high';q.difficultyBoundaryFlag='NONE';q.legacyLevelCompatibility='NORMAL';
fs.writeFileSync(a.workingJsAbsolute,'window.examTitle = '+JSON.stringify(c.window.examTitle)+';\nwindow.questionBank = '+JSON.stringify(c.window.questionBank,null,2)+';\n','utf8');
console.log('q18 retained as an unanswered, unsolved, explicit item HOLD; difficulty assessed independently as bucket 2.');
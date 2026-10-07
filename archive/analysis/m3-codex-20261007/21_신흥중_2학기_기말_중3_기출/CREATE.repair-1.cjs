const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root='C:/Users/USER/Desktop/AP-worktrees/m3-codex-main-done/AP------';
const ev=path.join(root,'archive/analysis/m3-codex-20261007/21_신흥중_2학기_기말_중3_기출');
const assignment=JSON.parse(fs.readFileSync(path.join(ev,'CREATE.assignment.json'),'utf8'));
const p=assignment.workingJsAbsolute, c={window:{}};
vm.runInNewContext(fs.readFileSync(p,'utf8'),c);
for(const q of c.window.questionBank){
  q.layoutTag='grid';
  q.wide=false;
  q.integrationPattern='NONE';
  if(q.id===18){
    q.answer='HOLD';
    q.solution='검수 보류: 본문은 양의 상관관계를 묻지만 정답표 ③과 그림은 음의 상관관계를 가리킨다. 비행 거리와 남은 연료의 관계도 음의 상관이므로 원문 의도 확인 전 정답을 확정하지 않는다.';
    q.difficultyBucket=2;
    q.difficultyConfidence='high';
    q.difficultyBoundaryFlag='NONE';
    q.legacyLevelCompatibility='NORMAL';
    delete q.reviewStatus;
  }
}
const out='window.examTitle = '+JSON.stringify(c.window.examTitle)+';\nwindow.questionBank = '+JSON.stringify(c.window.questionBank,null,2)+';\n';
fs.writeFileSync(p,out,'utf8');
console.log(JSON.stringify({workingJsAbsolute:p,qid18:{answer:c.window.questionBank[17].answer,solution:c.window.questionBank[17].solution,difficultyBucket:c.window.questionBank[17].difficultyBucket},questionCount:c.window.questionBank.length},null,2));
import {readExam} from 'file:///C:/Users/USER/Desktop/AP------/archive/tools/archive-codex-artifact-io.mjs';
const e=readExam('C:/Users/USER/Desktop/AP------/archive/exams/original/high/h2/1mid/17_효천고_1학기_중간_고2_확률과통계.js');
for(const id of [3,7]){const q=e.questions.find(x=>Number(x.id)===id);console.log(JSON.stringify({id,subUnitKey:q.subUnitKey,subUnit:q.subUnit,problemTypeKey:q.problemTypeKey,templateKey:q.templateKey}));}
console.log(e.rawSha256,e.rawBufferGitBlobSha1);

import {readExam,sha256} from 'file:///C:/Users/USER/Desktop/AP------/archive/tools/archive-codex-artifact-io.mjs';
const root='C:/Users/USER/Desktop/AP------';
const samples=[
  ['archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js',[3,12]],
  ['archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',[4,11]]
];
const result=[];
for(const [p,qids] of samples){const e=readExam(root+'/'+p);const items=[];for(const qid of qids){const q=e.questions.find(x=>Number(x.id)===qid);if(!q)throw Error('QID_MISSING:'+p+':'+qid);items.push({qid,solution:q.solution,solutionSha256:sha256(Buffer.from(String(q.solution??''),'utf8')),solutionImage:q.solutionImage||null});}result.push({path:p,sourceSha256:e.rawSha256,blobSha1:e.rawBufferGitBlobSha1,items});}
console.log(JSON.stringify(result,null,2));

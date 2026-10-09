import {readExam} from '../../../../archive/tools/archive-codex-artifact-io.mjs';
const paths=['archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js','archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js','archive/exams/original/high/h1/2mid/25_제일고_2학기_중간_고1_기출.js'];
for(const p of paths){const e=readExam(p);console.log(JSON.stringify({path:p,visuals:e.questions.filter(q=>q.solutionImage).map(q=>({qid:q.id,solutionImage:q.solutionImage}))}));}

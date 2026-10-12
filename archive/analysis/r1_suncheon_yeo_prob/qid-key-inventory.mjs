import {readExam} from '../../tools/archive-codex-artifact-io.mjs';
const source='C:/Users/USER/Desktop/AP------/archive/exams/original/high/h2/1mid/24_순천여고_1학기_중간_고2_확률과통계.js';
const e=readExam(source);
if(e.rawSha256!=='c0a092f5047e8e39c1c0d0de08551c473415c718e9b35eb9f1a9acaf33233a8b') throw new Error('SOURCE_SHA_DRIFT');
console.log(JSON.stringify({sourceRawSha256:e.rawSha256,rows:e.questions.map(q=>({qid:Number(q.id??q.qid),keys:Object.keys(q)}))},null,2));

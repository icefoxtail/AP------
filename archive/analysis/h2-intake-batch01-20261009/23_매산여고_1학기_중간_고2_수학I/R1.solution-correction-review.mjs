import {readExam,sha256} from '../../../../archive/tools/archive-codex-artifact-io.mjs';
const f='.tmp/archive/h2-intake-batch01-20261009/23_매산여고_1학기_중간_고2_수학I/23_매산여고_1학기_중간_고2_수학I.js',e=readExam(f);for(const id of [13,21]){const q=e.questions.find(x=>Number(x.id)===id);console.log(JSON.stringify({qid:id,answer:q.answer,solutionSha256:sha256(Buffer.from(q.solution)),solution:q.solution}));}

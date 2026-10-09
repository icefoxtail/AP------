import {readExam,sha256} from '../../../../archive/tools/archive-codex-artifact-io.mjs';import fs from 'node:fs';import path from 'node:path';
const root=path.resolve('.tmp/archive/h2-intake-batch01-20261009/23_매산여고_1학기_중간_고2_수학I'),e=readExam(path.join(root,'23_매산여고_1학기_중간_고2_수학I.js'));
for(const id of [13,16,20,21]){const q=e.questions.find(x=>Number(x.id)===id);console.log(JSON.stringify({qid:id,answer:q.answer,solutionSha256:sha256(Buffer.from(q.solution)),solution:q.solution,image:q.image?{ref:q.image,sha256:sha256(fs.readFileSync(path.join(root,q.image)))}:null}));}

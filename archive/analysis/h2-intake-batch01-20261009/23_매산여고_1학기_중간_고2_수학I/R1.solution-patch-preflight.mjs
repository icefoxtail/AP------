import fs from 'node:fs';import path from 'node:path';import {readExam} from '../../../../archive/tools/archive-codex-artifact-io.mjs';
const f=path.resolve('.tmp/archive/h2-intake-batch01-20261009/23_매산여고_1학기_중간_고2_수학I/23_매산여고_1학기_중간_고2_수학I.js');const raw=fs.readFileSync(f,'utf8'),e=readExam(f);
for(const id of [13,21]){const q=e.questions.find(x=>Number(x.id)===id),lit=JSON.stringify(q.solution);console.log(JSON.stringify({qid:id,solutionLiteralCount:raw.split(lit).length-1,solutionChars:q.solution.length,sourceSha:e.rawSha256}));}

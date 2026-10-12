import fs from 'node:fs';
import {readExam,sha256} from '../../../../tools/archive-codex-artifact-io.mjs';
const file='../../../../../archive/exams/original/high/h2/1mid/18_매산고_1학기_중간_고2_확률과통계.js';
const absolute=new URL(file,import.meta.url);
const path=decodeURIComponent(absolute.pathname.slice(1)).replaceAll('/','\\');
const old='d4b59e341f1ba5e1aa86046a6acc98a3140097c2cdb04a1b3aef280d228b854a';
const exam=readExam(path); if(exam.rawSha256!==old) throw Error('SOURCE_SHA_CHANGED_BEFORE_REPAIR');
const q=exam.questions.find(x=>Number(x.id)===15); if(!q||typeof q.solution!=='string'||q.solution.split('답은 752이다.').length!==2) throw Error('Q15_EXACT_REPAIR_LOCUS_REQUIRED');
const bytes=fs.readFileSync(path); const before=bytes.toString('utf8'); const updated=before.replace('답은 752이다.','답은 632이다.'); if(updated===before) throw Error('REPAIR_NOOP');
fs.writeFileSync(path,updated,'utf8'); const after=readExam(path);
if(after.questions.find(x=>Number(x.id)===15).solution.split('답은 632이다.').length!==2) throw Error('REPAIR_POSTCHECK_FAILED');
console.log(JSON.stringify({qid:15,locus:'solution final numeral',beforeRawSha256:old,afterRawSha256:after.rawSha256,byteCountBefore:bytes.length,byteCountAfter:Buffer.byteLength(updated)}));


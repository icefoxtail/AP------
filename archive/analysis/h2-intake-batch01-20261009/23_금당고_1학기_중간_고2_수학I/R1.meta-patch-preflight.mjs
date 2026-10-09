import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
const file = '.tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/23_금당고_1학기_중간_고2_수학I.js';
const source = fs.readFileSync(file, 'utf8');
const box = { window: {} };
vm.runInNewContext(source, box, {timeout: 5000});
const questions = box.window.questionBank;
const assignment = source.indexOf('window.questionBank =');
const open = source.indexOf('[', assignment);
let depth = 0, inString = false, escaped = false, close = -1;
for (let i = open; i < source.length; i++) {
  const c = source[i];
  if (inString) {
    if (escaped) escaped = false;
    else if (c === '\\') escaped = true;
    else if (c === '"') inString = false;
    continue;
  }
  if (c === '"') inString = true;
  else if (c === '[') depth++;
  else if (c === ']') { depth--; if (depth === 0) { close = i; break; } }
}
if (close < 0) throw new Error('QUESTION_BANK_ARRAY_NOT_FOUND');
const roundTrip = source.slice(0, open) + JSON.stringify(questions, null, 2) + source.slice(close + 1);
const h = s => createHash('sha256').update(s).digest('hex');
console.log(JSON.stringify({qidCount: questions.length, byteExact: source === roundTrip, sourceLength: source.length, roundTripLength: roundTrip.length, sourceSha256: h(source), roundTripSha256: h(roundTrip)}));
console.log(JSON.stringify({crlfCount:(source.match(/\\r\\n/g)||[]).length,lfCount:(source.match(/(?<!\\r)\\n/g)||[]).length}));
let d=0;while(d<Math.min(source.length,roundTrip.length)&&source[d]===roundTrip[d])d++;console.log(JSON.stringify({firstDiff:d,source:source.slice(d-80,d+80),roundTrip:roundTrip.slice(d-80,d+80)}));

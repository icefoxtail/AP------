import fs from 'node:fs';
const p='C:/Users/USER/Desktop/AP------/archive/exams/original/high/h2/1mid/17_효천고_1학기_중간_고2_확률과통계.js';
const out='C:/Users/USER/Desktop/AP------/archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/R1-17-hyocheon/source.pre-q4-correction.js';
let s=fs.readFileSync(p,'utf8');
const needle='"answer": "④",\n    "solution": "일대일 함수는 서로 다른 세 원소에 서로 다른 함숫값을 대응시킨다.';
if(s.split(needle).length!==2) throw Error('Q4_CONTEXT_NOT_UNIQUE');
s=s.replace(needle,needle.replace('"answer": "④"','"answer": "⑤"'));
fs.writeFileSync(out,s,'utf8');

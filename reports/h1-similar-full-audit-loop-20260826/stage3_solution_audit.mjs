import fs from 'node:fs';
import vm from 'node:vm';

const root = 'C:/Users/USER/Desktop/AP------';
const files = [
  'archive/exams/similar/high/h1/2mid/25_금당고_2학기_중간_고1_유사.js',
  'archive/exams/similar/high/h1/2mid/25_매산고_2학기_중간_고1_유사.js',
  'archive/exams/similar/high/h1/2mid/25_순천고_2학기_중간_고1_유사.js',
  'archive/exams/similar/high/h1/2final/25_금당고_2학기_기말_고1_유사.js',
  'archive/exams/similar/high/h1/2final/25_순천고_2학기_기말_고1_유사.js',
  'archive/exams/similar/high/h1/2final/25_제일고_2학기_기말_고1_유사.js',
  'archive/exams/similar/high/h1/2final/25_팔마고_2학기_기말_고1_유사.js',
  'archive/exams/similar/high/h1/2final/25_효천고_2학기_기말_고1_유사.js'
];
const forbidden = [/\[검산\]/,/\[참고\]/,/\[주의\]/,/\[보충\]/,/\[메모\]/,/OCR/i,/원문 오류|오류 가능성|원문 확인 필요/,/보기 오류|수정 필요|재검산|내부 계산/,/운영자|ChatGPT|Gemini|생성 과정|검토 결과/,/PASS|FAIL|WARN/];
const expected = Object.fromEntries(files.map(f => [f.split('/').pop(), null]));
const rows=[];
for (const rel of files) {
  const src=fs.readFileSync(`${root}/${rel}`,'utf8');
  const ctx={window:{}}; vm.runInNewContext(src,ctx,{filename:rel});
  const qs=ctx.window.questionBank||[];
  let fail=0,warn=0;
  const details=[];
  for (const q of qs) {
    const s=String(q.solution??'');
    const issues=[];
    if(!s.trim()) issues.push('EMPTY_SOLUTION');
    if(q.questionType==='객관식' || Array.isArray(q.choices) && q.choices.length===5) {
      const m=s.match(/따라서 정답은\s*([①②③④⑤](?:,\s*[①②③④⑤])*)이다\.?\s*$/);
      if(!m) issues.push('FINAL_CONCLUSION_FORMAT');
      else if(m[1]!==q.answer) issues.push(`FINAL_ANSWER_MISMATCH:${m[1]}!=${q.answer}`);
    }
    for(const re of forbidden) if(re.test(s)) issues.push(`FORBIDDEN:${re}`);
    if(!s.includes('정석 풀이:')) issues.push('NO_CANONICAL_SOLUTION_LABEL');
    if(q.level==='상' && (!s.includes('[키포인트]') || !s.includes('조건 정리:') || !s.includes('풀이 방향:') || !s.includes('핵심 확인:'))) issues.push('HIGH_LEVEL_STRUCTURE_INCOMPLETE');
    if((s.match(/\$/g)||[]).length%2) issues.push('UNBALANCED_DOLLAR');
    if(/\\(?!d)frac(?!\s*\{)/.test(s)) warn++;
    if(/식에 값을 대입하여|계산하면 답은|정리하면 조건을 얻는다/.test(s)) warn++;
    if(issues.length) { fail++; details.push({id:q.id,issues}); }
  }
  rows.push({file:rel,qCount:qs.length,fail,warn,pass:fail===0,details});
}
const out={generatedAt:new Date().toISOString(),files:rows,totalQuestions:rows.reduce((a,r)=>a+r.qCount,0),failQuestions:rows.reduce((a,r)=>a+r.fail,0),warnSignals:rows.reduce((a,r)=>a+r.warn,0),gate:rows.every(r=>r.pass)?'PASS':'FAIL'};
fs.writeFileSync(`${root}/reports/h1-similar-full-audit-loop-20260826/stage3-solution.json`,JSON.stringify(out,null,2));
console.log(JSON.stringify(out,null,2));

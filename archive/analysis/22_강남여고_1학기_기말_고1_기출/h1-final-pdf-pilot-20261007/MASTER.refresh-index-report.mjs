import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
const root='C:/Users/USER/Desktop/AP-worktrees/h1-final-pdf-pilot-20261007/AP------';
const w={};vm.runInNewContext(fs.readFileSync(path.join(root,'archive/question-index.js'),'utf8'),{window:w});
const file='original/high/h1/1final/22_강남여고_1학기_기말_고1_기출.js';
const missing=w.questionIndex.filter(r=>r.sourceFile===file&&!r.choicesText).map(r=>`  - ${r.sourceFile}#${r.id}`);
const reportPath=path.join(root,'archive/question-index-report.md');let report=fs.readFileSync(reportPath,'utf8');
report=report.replace(/최종 인덱스 레코드\(\d+\)/,`최종 인덱스 레코드(${w.questionIndex.length})`);
const section=/### choices\n[\s\S]*?\n\n### level/;
if(!section.test(report))throw Error('choices examples section missing');
report=report.replace(section,`### choices\n${missing.length?missing.join('\n'):'  - 없음'}\n\n### level`);
fs.writeFileSync(reportPath,report);
console.log(JSON.stringify({total:w.questionIndex.length,targetMissingChoices:missing.length,examples:missing},null,2));


import fs from 'node:fs';
const s=fs.readFileSync('archive/exams/original/high/h2/1mid/18_효천고_1학기_중간_고2_확률과통계.js','utf8');
const lines=s.split(/(?<=\n)/);
console.log(JSON.stringify({lines:lines.length,solutionLines:lines.filter(x=>x.includes('"solution"')).length,regexLines:lines.filter(x=>/^\s*"solution"\s*:/.test(x)).length,withBare:lines.filter(x=>/^\s*"solution"\s*:/.test(x)&&/cdot|div|circ|ige/.test(x)).length,sample:lines.filter(x=>x.includes('"solution"')).slice(0,3)},null,2));

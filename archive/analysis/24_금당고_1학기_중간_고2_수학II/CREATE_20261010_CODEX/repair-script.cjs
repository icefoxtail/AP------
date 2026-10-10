const fs=require('node:fs'),path=require('node:path'),p=path.join(__dirname,'author-create.mjs');let s=fs.readFileSync(p,'utf8');
const a=s.indexOf("17:{answer:"),b=s.indexOf("\n18:{answer:",a);if(a<0||b<0)throw Error("Q17_LOCUS");
const entry=[
"17:{answer:'49',unit:'derivative',category:'미분계수의 정의를 이용한 계산',level:'중',bucket:3,pt:'PT_DERIVATIVE_DEFINITION',tpl:'TPL_DERIVATIVE_LIMIT_REDUCTION',method:'미분계수 정의의 차분을 전개해 h의 1차 계수를 읽는다.',step:'[f(2+h)−f(2)]/h의 극한을 정의대로 계산해 49를 얻는다.',integration:'NONE',solution:''},"
].join("\n");
s=s.slice(0,a)+entry+s.slice(b);
const old="Object.assign(q,{answer:a.answer,solution:a.solution,level:a.level";
const replacement="const authoredSolution=[16,17].includes(q.id)?fs.readFileSync(root+'/archive/analysis/24_금당고_1학기_중간_고2_수학II/CREATE_20261010_CODEX/q'+q.id+'-solution.txt','utf8').replace(/^\\uFEFF/,'').trimEnd():a.solution;\\n Object.assign(q,{answer:a.answer,solution:authoredSolution,level:a.level";
if(!s.includes(old))throw Error("ASSIGNMENT_LOCUS");s=s.replace(old,replacement);
fs.writeFileSync(p,s,'utf8');

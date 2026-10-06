import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url),acorn=require('C:/Users/USER/AppData/Local/npm-cache/_npx/bbbefcae0b32ac69/node_modules/acorn');
const root='.tmp/archive/archive2-m2-codex-20261006-03/20_금당중_2학기_기말_중2_기출';
const sourcePath=path.join(root,'20_금당중_2학기_기말_중2_기출.js');
const raw=fs.readFileSync(sourcePath,'utf8'),ast=acorn.parse(raw,{ecmaVersion:'latest',sourceType:'script'});
const arr=ast.body.find(n=>n.type==='ExpressionStatement'&&n.expression?.left?.property?.name==='questionBank')?.expression.right;
function lit(n){if(n.type==='Literal')return n.value;if(n.type==='ArrayExpression')return n.elements.map(lit);if(n.type==='ObjectExpression'){const o={};for(const p of n.properties)o[p.key.name??p.key.value]=lit(p.value);return o;}throw Error('unsupported answer type '+n.type)}
const get=(q,k)=>{const p=q.properties.find(p=>(p.key.name??p.key.value)===k);return p?lit(p.value):undefined};
const questions=arr.elements.map(q=>({id:get(q,'id'),answer:get(q,'answer')}));
const freeze=JSON.parse(fs.readFileSync(path.join(root,'evidence/R2.independent-freeze.json'),'utf8'));
const student=JSON.parse(fs.readFileSync(path.join(root,'evidence/R2.student-input.json'),'utf8'));
const old=JSON.parse(fs.readFileSync(path.join(root,'evidence/R1.student-input.json'),'utf8'));
const current=student.questions.map(q=>({qid:q.id,content:q.content,choices:q.choices,imageRefs:q.image?[q.image]:[]}));
const prior=old.rows.map(q=>({qid:q.qid,content:q.content,choices:q.choices,imageRefs:q.imageRefs}));
const studentParity=JSON.stringify(current)===JSON.stringify(prior);
const results=freeze.blindAnswers.map(f=>{const s=questions.find(q=>q.id===f.qid)?.answer;return {qid:f.qid,blindAnswer:f.answer,storedAnswer:s,match:String(s).trim()===String(f.answer).trim()}});
console.log(JSON.stringify({studentParity,currentCount:current.length,priorCount:prior.length,storedAnswerCount:questions.filter(q=>q.answer!=null).length,matchCount:results.filter(x=>x.match).length,mismatches:results.filter(x=>!x.match),answers:results},null,2));

import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url),acorn=require('C:/Users/USER/AppData/Local/npm-cache/_npx/bbbefcae0b32ac69/node_modules/acorn');
const root='.tmp/archive/archive2-m2-codex-20261006-03/20_신흥중_2학기_기말_중2_기출';
const source=path.join(root,'20_신흥중_2학기_기말_中2_기출.js').replace('中','중');
const raw=fs.readFileSync(source,'utf8'), ast=acorn.parse(raw,{ecmaVersion:'latest',sourceType:'script'});
const assignment=ast.body.find(n=>n.type==='ExpressionStatement'&&n.expression?.type==='AssignmentExpression'&&n.expression.left?.property?.name==='questionBank');
function lit(n){if(n.type==='Literal')return n.value;if(n.type==='ArrayExpression')return n.elements.map(lit);if(n.type==='ObjectExpression'){const o={};for(const p of n.properties){if(p.type!=='Property'||p.computed||p.kind!=='init')throw Error('non-literal');o[p.key.name??p.key.value]=lit(p.value)}return o}throw Error('non-literal answer node '+n.type)}
const rows=assignment.expression.right.elements.map(q=>{const o=lit(q);return {qid:o.id,storedAnswer:o.answer}});
const result={source:{path:source.replaceAll(path.sep,'/'),rawSha256:crypto.createHash('sha256').update(raw).digest('hex')},questionCount:rows.length,rows};
const out=path.join(root,'evidence/R2.stored-answers.json');fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({path:out,questionCount:rows.length,rawSha256:result.source.rawSha256,sha256:crypto.createHash('sha256').update(fs.readFileSync(out)).digest('hex')}));

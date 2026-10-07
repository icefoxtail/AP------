import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const uid=process.argv[2],base='archive/analysis/m3-codex-20261007/'+uid,bad=[];
const visit=(v,where)=>{if(!v||typeof v!=='object')return;if(typeof v.path==='string'&&typeof v.sha256==='string'){const p=path.resolve(v.path);if(fs.existsSync(p)){const actual=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');if(actual!==v.sha256)bad.push({where,path:v.path,expected:v.sha256,actual});}}for(const[k,x]of Object.entries(v))visit(x,where+'.'+k);};
for(const name of ['ROOT.static.receipt.json','ROOT.decision.json','R3.static-closure.json','R1.evidence.json','R2.evidence.json'])visit(JSON.parse(fs.readFileSync(base+'/'+name,'utf8')),name);
console.log(JSON.stringify(bad,null,2));

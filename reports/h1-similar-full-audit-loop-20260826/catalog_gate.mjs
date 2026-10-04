import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const repo='C:/Users/USER/Desktop/AP------'; const outDir=path.join(repo,'reports','h1-similar-full-audit-loop-20260826');
const targets=[['2mid','25_금당고_2학기_중간_고1_유사.js',22],['2mid','25_매산고_2학기_중간_고1_유사.js',20],['2mid','25_순천고_2학기_중간_고1_유사.js',23],['2final','25_금당고_2학기_기말_고1_유사.js',22],['2final','25_순천고_2학기_기말_고1_유사.js',23],['2final','25_제일고_2학기_기말_고1_유사.js',22],['2final','25_팔마고_2학기_기말_고1_유사.js',23],['2final','25_효천고_2학기_기말_고1_유사.js',23]];
function load(file){const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(file,'utf8'),c,{filename:file});return c.window;}
const db=load(path.join(repo,'archive','db.js')).mainDB?.exams||[]; const index=load(path.join(repo,'archive','question-index.js')).questionIndex||[];
const rows=targets.map(([term,name,qCount])=>{const file=`similar/high/h1/${term}/${name}`;return {file,qCount,dbRecords:db.filter(x=>x.file===file).length,indexed:index.filter(x=>x.sourceFile===file).length};});
const out={generatedAt:new Date().toISOString(),dbTotal:db.length,indexTotal:index.length,rows,gate:rows.every(r=>r.dbRecords===1&&r.indexed===r.qCount)?'PASS':'FAIL',reason:'Audit only; no DB/index edits authorized'};fs.writeFileSync(path.join(outDir,'catalog-gate.json'),JSON.stringify(out,null,2));console.log(JSON.stringify(out,null,2));

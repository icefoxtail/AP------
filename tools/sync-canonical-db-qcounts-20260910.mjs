import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]):/, '$1:')), '..');
const archive = path.join(root, 'archive');
const dbPath = path.join(archive, 'db.js');
const c={window:{}}; vm.runInNewContext(fs.readFileSync(dbPath,'utf8'),c,{timeout:10000});
const db=c.window.mainDB; const targets=new Set(db.exams.map(x=>x.file).filter(f=>/^original\/high\/h1\/(2mid|2final)\/(19_|20_|23_|24_)/.test(f)));
const rows=[];
for(const row of db.exams){if(!targets.has(row.file))continue;const file=path.join(archive,'exams',row.file);const qctx={window:{}};vm.runInNewContext(fs.readFileSync(file,'utf8'),qctx,{timeout:10000});const q=qctx.window.questionBank||[];if(row.qCount!==q.length){rows.push({file:row.file,old:row.qCount,new:q.length});row.qCount=q.length;}}
fs.writeFileSync(dbPath,`window.mainDB = ${JSON.stringify(db,null,2)};\n`,'utf8');
console.log(JSON.stringify({updated:rows.length,rows},null,2));

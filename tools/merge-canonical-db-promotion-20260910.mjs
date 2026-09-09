import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]):/, '$1:')), '..');
const dbPath = path.join(root, 'archive', 'db.js');
const oldSource = execFileSync('git', ['show', '9cff916d4:archive/db.js'], { cwd: root, encoding: 'utf8' });
const currentSource = fs.readFileSync(dbPath, 'utf8');
function load(source){const c={window:{}};vm.runInNewContext(source,c,{timeout:10000});return c.window.mainDB;}
const oldDb=load(oldSource); const currentDb=load(currentSource);
const currentByFile=new Map(currentDb.exams.map(row=>[row.file,row]));
const promotionBasenames = [
  '19_강남고_2학기_기말_고1_기출','19_금당고_2학기_기말_고1_기출','19_금당고_2학기_중간_고1_기출','19_복성고_2학기_중간_고1_기출','19_팔마고_2학기_기말_고1_기출','19_팔마고_2학기_중간_고1_기출','20_금당고_2학기_중간_고1_기출','20_매산고_2학기_기말_고1_기출','20_매산고_2학기_중간_고1_기출','20_매산여고_2학기_기말_고1_기출','20_매산여고_2학기_중간_고1_기출','20_복성고_2학기_중간_고1_기출','20_순천고_2학기_중간_고1_기출','20_순천여고_2학기_기말_고1_기출','20_제일고_2학기_중간_고1_기출','20_효천고_2학기_기말_고1_기출','20_효천고_2학기_중간_고1_기출','23_부영여고_2학기_중간_고1_기출','23_여양고_2학기_중간_고1_기출','23_여천고_2학기_기말_고1_기출','23_여천고_2학기_중간_고1_기출','23_중앙여고_2학기_기말_고1_기출','23_한영고_2학기_기말_고1_기출','23_한영고_2학기_중간_고1_기출','24_부영여고_2학기_중간_고1_기출','24_여양고_2학기_기말_고1_기출','24_여천고_2학기_기말_고1_기출','24_여천고_2학기_중간_고1_기출','24_중앙여고_2학기_기말_고1_기출','24_한영고_2학기_기말_고1_기출',
];
const promotionFiles = new Set(currentDb.exams.map(row=>row.file).filter(file=>promotionBasenames.some(base=>file.endsWith(`/${base}.js`))));
function normalizePromotedRow(row){
  const next={...row};
  next.subject=String(next.subject||next.primaryStandardCourse||'수학').trim()||'수학';
  next.primaryStandardCourse=String(next.primaryStandardCourse||next.subject||'수학').trim()||'수학';
  return next;
}
const merged=[]; const seen=new Set();
for(const row of oldDb.exams){const next=promotionFiles.has(row.file)&&currentByFile.has(row.file)?normalizePromotedRow(currentByFile.get(row.file)):row;merged.push(next);seen.add(row.file);}
for(const file of promotionFiles){if(!seen.has(file)&&currentByFile.has(file))merged.push(normalizePromotedRow(currentByFile.get(file)));}
merged.sort((a,b)=>String(a.file).localeCompare(String(b.file),'ko'));
const out={...oldDb,exams:merged};
fs.writeFileSync(dbPath,`window.mainDB = ${JSON.stringify(out,null,2)};\n`,'utf8');
console.log(JSON.stringify({old:oldDb.exams.length,current:currentDb.exams.length,merged:merged.length,promotionFiles:promotionFiles.size},null,2));

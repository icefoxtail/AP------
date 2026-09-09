import fs from 'node:fs';
import path from 'node:path';
const root='C:/Users/work1/Desktop/AP-------h2-math2-visual-repair';
const exams=['25_강남여고_2학기_기말_고2_수학II','25_매산고_2학기_기말_고2_수학II','25_매산여고_2학기_기말_고2_수학II','25_순천고_2학기_기말_고2_수학II','25_제일고_2학기_기말_고2_수학II'];
const rows=[];
for(const exam of exams){const dir=path.join(root,'archive/assets/images',exam);for(const name of fs.readdirSync(dir).filter(x=>x.endsWith('.svg')).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})))rows.push({exam,path:`archive/assets/images/${exam}/${name}`});}
const out=path.join(root,'reports/h2-2final-math2-visual/repair-20260909/svg-browser-inventory.json');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(rows,null,2)+'\n');console.log(JSON.stringify({count:rows.length,unique:new Set(rows.map(x=>x.path)).size,output:out}));
const html=path.join(root,'reports/h2-2final-math2-visual/repair-20260909/svg-browser-inventory-inline.html');fs.writeFileSync(html,`<!doctype html><meta charset="utf-8"><body><pre id="out"></pre><script>window.inventory=${JSON.stringify(rows)};document.querySelector('#out').textContent=JSON.stringify(window.inventory)</script></body>`);

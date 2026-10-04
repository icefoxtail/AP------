import fs from 'node:fs';import path from 'node:path';
const root=process.cwd(),changes=[];
function setAttr(a,k,v){const r=new RegExp(`\\s${k}=(['"])[\\s\\S]*?\\1`,'i');const rep=` ${k}="${v}"`;return r.test(a)?a.replace(r,rep):a+rep}
function update(file,predicate,updates){const p=path.join(root,file);let s=fs.readFileSync(p,'utf8'),found=0;s=s.replace(/<text\b([^>]*)>([\s\S]*?)<\/text>/gi,(m,a,b)=>{const text=b.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").trim();if(!predicate(a,text))return m;found++;for(const [k,v]of Object.entries(updates))a=setAttr(a,k,v);return `<text${a}>${b}</text>`});if(found){fs.writeFileSync(p,s,'utf8');changes.push({file,found,updates})}else changes.push({file,found:0,updates,skipped:true})}
update('archive/assets/images/25_왕운중_2학기_중간_중3_수학/q16-solution.svg',(a,t)=>t==='12'&&a.includes('x="132"'),{x:140,y:135,'text-anchor':'end'});
update('archive/assets/images/25_왕운중_2학기_중간_중3_수학/q17-solution.svg',(a,t)=>t==='QB=3',{x:250,y:34,'text-anchor':'middle'});
update('archive/assets/images/25_풍덕중_2학기_중간_중3_수학/q25-solution.svg',(a,t)=>t==='3'&&a.includes('data-layout-normalized'),{x:305,y:110,'text-anchor':'middle'});
update('archive/assets/images/25_금당중_2학기_기말_중3_기출/q8-solution.svg',(a,t)=>t==='x',{x:292,y:62,'text-anchor':'middle'});
update('archive/assets/images/25_신흥중_2학기_기말_중3_기출/q7-solution.svg',(a,t)=>t==='22°',{x:150,y:-20,'text-anchor':'middle'});
update('archive/assets/images/25_신흥중_2학기_기말_중3_기출/q7-solution.svg',(a,t)=>t==='C',{x:355,y:245,'text-anchor':'middle'});
fs.writeFileSync(path.join(root,'docs/evidence/2025-m3-visual-publishing-normalize-a/round4_label_fixes.json'),JSON.stringify({schemaVersion:'APMATH_M3_LABEL_OWNER_REFINEMENTS_v1',changes},null,2)+'\n','utf8');
console.log(JSON.stringify({changes,skipped:changes.filter(x=>x.skipped).length},null,2));

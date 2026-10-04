import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(), changes=[];
const load=f=>fs.readFileSync(path.join(root,f),'utf8');
const save=(f,s)=>fs.writeFileSync(path.join(root,f),s,'utf8');
function setAttr(attrs,key,value){const r=new RegExp(`\\s${key}=(['"])[\\s\\S]*?\\1`,'i');const rep=` ${key}="${String(value).replaceAll('&','&amp;').replaceAll('"','&quot;')}"`;return r.test(attrs)?attrs.replace(r,rep):attrs+rep}
function byId(file,id,updates){let svg=load(file),found=false;svg=svg.replace(/<text\b([^>]*)>([\s\S]*?)<\/text>/gi,(m,a,b)=>{if(!new RegExp(`\\bid=["']${id}["']`).test(a))return m;found=true;for(const [k,v] of Object.entries(updates))a=setAttr(a,k,v);return `<text${a}>${b}</text>`});if(found){save(file,svg);changes.push({file,id,updates})}else changes.push({file,id,skipped:'not found'})}
function byText(file,target,occurrence,updates){let svg=load(file),n=0,found=false;svg=svg.replace(/<text\b([^>]*)>([\s\S]*?)<\/text>/gi,(m,a,b)=>{const text=b.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").trim();if(text!==target)return m;if(n++!==occurrence)return m;found=true;for(const [k,v]of Object.entries(updates))a=setAttr(a,k,v);return `<text${a}>${b}</text>`});if(found){save(file,svg);changes.push({file,text:target,updates})}else changes.push({file,text:target,skipped:'not found'})}

byText('archive/assets/images/25_왕운중_2학기_중간_중3_수학/q16-solution.svg','12',0,{x:132,y:145,'text-anchor':'middle'});
byText('archive/assets/images/25_왕운중_2학기_중간_중3_수학/q17-solution.svg','QB=3',0,{x:250,y:42,'text-anchor':'middle'});
const pung25="archive/assets/images/25_\uD48D\uB355\uC911_2\uD559\uAE30_\uC911\uAC04_\uC9113_\uC218\uD559/q25-solution.svg";
byText(pung25,'7',0,{x:360,y:118,'text-anchor':'middle'});
byText(pung25,'6',0,{x:380,y:170,'text-anchor':'middle'});
byText(pung25,'3',0,{x:275,y:143,'text-anchor':'middle'});
byText('archive/assets/images/25_연향중_2학기_기말_중3_기출/q11-solution.svg','130°',0,{x:400,y:280,'text-anchor':'middle'});
byText('archive/assets/images/25_연향중_2학기_기말_중3_기출/q22-solution.svg','60°',0,{x:90,y:285,'text-anchor':'middle'});
byText('archive/assets/images/25_금당중_2학기_기말_중3_기출/q8-solution.svg','x',0,{x:292,y:70,'text-anchor':'middle'});
byText('archive/assets/images/25_금당중_2학기_기말_중3_기출/q8-solution.svg','y',0,{x:400,y:240,'text-anchor':'middle'});

const q7='archive/assets/images/25_신흥중_2학기_기말_중3_기출/q7-solution.svg';let svg=load(q7);
svg=svg.replace('viewBox="-105 -185 480 480"','viewBox="-150 -250 600 600"')
  .replace(/(text\.ap-pub-label\{font-size:)\s*42(px!important)/,'$1 53$2')
  .replace(/(text\.ap-pub-title\{font-size:)\s*50(px!important)/,'$1 63$2')
  .replace(/(@media print\{text\.ap-pub-label\{font-size:)\s*20(px!important)/,'$1 25$2');
save(q7,svg);changes.push({file:q7,viewBox:'-150 -250 600 600',screenFontPx:53,printFontPx:25});

fs.writeFileSync(path.join(root,'docs/evidence/2025-m3-visual-publishing-normalize-a/round3_label_fixes.json'),JSON.stringify({schemaVersion:'APMATH_M3_LABEL_OWNER_REFINEMENTS_v1',changes},null,2)+'\n','utf8');
console.log(JSON.stringify({changes:changes.length,skipped:changes.filter(x=>x.skipped).length},null,2));

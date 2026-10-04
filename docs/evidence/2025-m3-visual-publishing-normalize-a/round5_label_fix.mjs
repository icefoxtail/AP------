import fs from 'node:fs';import path from 'node:path';
const root=process.cwd(),file='archive/assets/images/25_풍덕중_2학기_중간_중3_수학/q25-solution.svg',p=path.join(root,file);let svg=fs.readFileSync(p,'utf8'),found=false;
svg=svg.replace(/<text\b([^>]*)>([\s\S]*?)<\/text>/gi,(m,a,b)=>{if(b.trim()!=='3')return m;found=true;a=a.replace(/\sx="[^"]*"/,' x="330"').replace(/\sy="[^"]*"/,' y="140"');return `<text${a}>${b}</text>`});
if(!found)throw new Error('CD_3_LABEL_NOT_FOUND');fs.writeFileSync(p,svg,'utf8');
fs.writeFileSync(path.join(root,'docs/evidence/2025-m3-visual-publishing-normalize-a/round5_label_fix.json'),JSON.stringify({assetPath:file,text:'3',from:[305,110],to:[330,140],reason:'Placed clear of C, D, and the adjacent tangent-value labels while retaining the CD owner neighborhood.'},null,2)+'\n','utf8');
console.log('Moved the CD length label to clear the C point label.');

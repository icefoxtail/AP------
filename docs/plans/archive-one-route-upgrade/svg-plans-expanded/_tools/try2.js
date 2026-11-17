const fs=require('fs'),cp=require('child_process');const M=require('./merge2.js');
const S=__dirname;const ml=JSON.parse(fs.readFileSync(S+'/multilist.json','utf8'));
const [fam,idx,tag]=[process.argv[2],+(process.argv[3]||0),process.argv[4]];
const cands=[];
for(const row of M.rows){if(row.led==='PUBLISHED')continue;const files=ml.find(([k])=>k===row.k)[1];const r=M.build(row,files);if(r.ok&&r.family===fam)cands.push([row,r]);}
const pri=r=>/original\/high/.test(r[0].scope)?0:/similar\/high|types\/high/.test(r[0].scope)?1:/textbooks/.test(r[0].scope)?2:3;
cands.sort((a,b)=>pri(a)-pri(b));
const [row,r]=cands[idx];
const exam=row.k.slice(2,row.k.lastIndexOf('#'));
const out=S+'/tm_'+tag+'.json';fs.writeFileSync(out,JSON.stringify(r.plan,null,1));
console.log(fam,cands.length,'cands;',exam.split('/').pop(),row.ord,(r.plan.panels||[]).map(p=>p.caption.text));
cp.execSync(`bash ${S}/r.sh ${out} ${exam} ${row.ord} ${tag}`,{stdio:'inherit'});

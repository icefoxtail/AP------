import fs from 'node:fs';
const root='C:/Users/USER/Desktop/AP------';
const t=JSON.parse(fs.readFileSync(root+'/archive/data/meta-foundation/compiled/taxonomy_registry.json','utf8'));
const m=JSON.parse(fs.readFileSync(root+'/archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/R1-17-hyocheon/R1-live-metadata-layout-fields.json','utf8'));
const wanted=new Set([...new Set(m.rows.flatMap(r=>[r.problemTypeKey,r.templateKey,...(r.conditionKeys||[])]).filter(Boolean))]);
const found=new Map();
function walk(x,path='root'){if(Array.isArray(x)){x.forEach((v,i)=>walk(v,path+'['+i+']'));return;}if(!x||typeof x!=='object')return;for(const [k,v] of Object.entries(x)){if(typeof v==='string'&&wanted.has(v)){if(!found.has(v))found.set(v,[]);found.get(v).push({path:path+'.'+k,parent:x.parent??x.parentKey??x.type??null,status:x.status??x.state??x.lifecycle??null,namespace:x.namespace??null});}walk(v,path+'.'+k)}}
walk(t);console.log(JSON.stringify({registryKeys:Object.keys(t),registrySha256:(await import('node:crypto')).createHash('sha256').update(fs.readFileSync(root+'/archive/data/meta-foundation/compiled/taxonomy_registry.json')).digest('hex'),wanted:[...wanted],found:Object.fromEntries([...found])},null,2));

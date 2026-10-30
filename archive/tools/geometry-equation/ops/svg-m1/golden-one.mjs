// usage: node golden-one.mjs <outDir> <item numbers...> ; renders golden items sequentially through render-plan
import fs from 'node:fs';
import path from 'node:path';
// WT=<렌더할 트리>를 환경변수로 바꿔 쓴다(기본: 본 체크아웃).
const WT=process.env.WT||'/home/user/AP------';
const {renderPlan}=await import(WT+'/archive/tools/geometry-equation/production/render-plan.mjs');
const root=WT+'/archive/tools/geometry-equation/ops/';
const man=JSON.parse(fs.readFileSync(root+'golden.manifest.json','utf8'));
const [out,...nums]=process.argv.slice(2);
fs.mkdirSync(out,{recursive:true});
for(const n of nums){
  const dir='item'+String(n).padStart(2,'0');
  const meta=man.items.find(i=>i.dir===dir);
  if(!meta){console.log(dir,'NOT IN MANIFEST');continue;}
  const r=await renderPlan({item:meta,plan:path.join(root,'golden',dir,'plan.json'),outDir:out});
  console.log(dir,r.status,r.stage||'',typeof r.detail==='string'?r.detail.slice(0,120):'');
}
process.exit(0);

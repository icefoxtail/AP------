import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {repoRoot,assertOutput} from '../visual-browser-runtime.mjs';
import {verifyRenderedFile} from '../verify-rendered-layout.mjs';
import {verifyVisualEngineStatic} from '../verify-visual-engine-static.mjs';
const arg=k=>process.argv[process.argv.indexOf(k)+1];
const run=assertOutput(arg('--run'));const manifest=JSON.parse(fs.readFileSync(path.join(run,'fixtures/manifest.json'),'utf8'));const rows=[];
for(const item of manifest) {
  let final;
  for(let attempt=0;attempt<3;attempt++) {
    const folder=path.join(run,'rendered-bbox',item.id,'attempt-'+attempt);fs.mkdirSync(folder,{recursive:true});
    const file=path.join(repoRoot,item.svg);fs.copyFileSync(file,path.join(folder,'visual.svg'));
    const captures=[];
    for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const result=await verifyRenderedFile(file,{width,height,screenshot:path.join(folder,name+'.png')});
      fs.writeFileSync(path.join(folder,name+'.json'),JSON.stringify(result,null,2)+'\n');captures.push(result);
    }
    const input=JSON.parse(fs.readFileSync(path.join(repoRoot,item.staticInput),'utf8'));const staticResult=verifyVisualEngineStatic({root:repoRoot,input});
    fs.writeFileSync(path.join(folder,'static.json'),JSON.stringify(staticResult,null,2)+'\n');
    final={id:item.id,status:captures.every(v=>v.status==='PASS')&&staticResult.status==='PASS'?'PASS':'FAIL',attempt,svgSha256:captures[0].svgSha256,errors:captures.flatMap(v=>v.errors),staticErrors:staticResult.errors};
    if(final.status==='PASS'||attempt===2||captures.every(v=>v.status==='PASS'))break;
    const measured=path.join(folder,'measurements.json');fs.writeFileSync(measured,JSON.stringify(captures[0].measurements));
    execFileSync(process.env.GEOMETRY_PYTHON||'python',[path.join(repoRoot,'archive/tools/geometry-equation/generate-svg-from-independent-facts.py'),'--config',path.join(run,'config/run.json'),'--spec',path.join(repoRoot,item.spec),'--measurements',measured],{cwd:repoRoot,stdio:'pipe'});
  }
  rows.push(final);
}
const result={status:rows.every(v=>v.status==='PASS')?'PASS':'FAIL',runtime:'playwright-chromium',synthetic:false,maxRelayoutPasses:3,rows};fs.writeFileSync(path.join(run,'rendered-bbox/summary.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));if(result.status!=='PASS')process.exitCode=1;

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {repoRoot,assertOutput} from './visual-browser-runtime.mjs';
import {sha256} from './verify-visual-engine-static.mjs';

export function loadBank(code){const context={window:{}};vm.runInNewContext(code,context,{timeout:5000});return context.window.questionBank;}
export function buildMatrix({run,bindings,modes=['sol']}) {
  run=assertOutput(run);const fixtures=JSON.parse(fs.readFileSync(path.join(run,'fixtures/manifest.json'),'utf8'));
  const grouped=new Map();
  for(const binding of bindings) {
    if(!fixtures.some(v=>v.id===binding.fixtureId))throw Error('FIXTURE_BINDING_MISSING');
    if(!grouped.has(binding.sourcePath))grouped.set(binding.sourcePath,[]);grouped.get(binding.sourcePath).push(binding);
  }
  const rows=[];const sources=[];let i=0;
  for(const [sourcePath,items] of grouped) {
    const sourceFile=path.resolve(repoRoot,sourcePath);
    if(!sourceFile.startsWith(path.resolve(repoRoot,'archive/exams')+path.sep))throw Error('SOURCE_SCOPE_VIOLATION');
    const source=fs.readFileSync(sourceFile,'utf8');const original=loadBank(source);
    if(!Array.isArray(original)||!original.length)throw Error('SOURCE_BANK_EMPTY');
    const targets=items.map(v=>String(v.questionId));if(new Set(targets).size!==targets.length)throw Error('DUPLICATE_SOURCE_TARGET');
    const patches=items.map(item=>{
      if(!original.some(q=>String(q.id)===String(item.questionId)))throw Error('SOURCE_QUESTION_MISSING');
      const fixture=fixtures.find(v=>v.id===item.fixtureId);return{id:item.questionId,fields:{solutionImage:fixture.svg.replace(/^archive\//,''),solutionImageAlt:item.alt,solutionImageCaption:item.caption,solutionImageSize:'full'}};
    });
    const candidate=source+'\n;for(const patch of '+JSON.stringify(patches)+'){const q=window.questionBank.find(q=>String(q.id)===String(patch.id));Object.assign(q,patch.fields);}\n';
    const bank=loadBank(candidate);if(bank.length!==original.length)throw Error('SOURCE_QCOUNT_MUTATION');
    const protectedParity=original.every((q,n)=>{
      const before=JSON.parse(JSON.stringify(q)),after=JSON.parse(JSON.stringify(bank[n]));
      if(targets.includes(String(q.id)))for(const key of ['solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize']){delete before[key];delete after[key];}
      return JSON.stringify(before)===JSON.stringify(after);
    });
    if(!protectedParity)throw Error('PROTECTED_FIELD_MUTATION');
    const candidateFile=path.join(run,'archive-candidates',`source-${i}.js`);fs.mkdirSync(path.dirname(candidateFile),{recursive:true});fs.writeFileSync(candidateFile,candidate);
    const sourceInfo={id:'source-'+i,sourcePath,sourceSha256:sha256(source),candidatePath:path.relative(repoRoot,candidateFile).replaceAll('\\','/'),candidateSha256:sha256(candidate),questionCount:original.length,protectedFieldParity:'PASS',assets:items.map(item=>{const f=fixtures.find(v=>v.id===item.fixtureId);return{id:item.fixtureId,path:f.svg,sha256:sha256(fs.readFileSync(path.join(repoRoot,f.svg))),questionId:item.questionId};})};
    sources.push(sourceInfo);
    for(const mode of modes)for(const [viewport,width,height] of [['desktop',1440,1000],['mobile',390,844]])rows.push({...sourceInfo,mode,viewport,width,height,urlPath:'/archive/engine.html?preview=1&qpp=4&mode='+mode+'&data='+encodeURIComponent(sourcePath.replace(/^archive\//,''))});
    i++;
  }
  const matrix={schemaVersion:'GEOMETRY_ARCHIVE_RENDER_MATRIX_v1',runtime:'actual archive/engine.html',synthetic:false,engineSha256:sha256(fs.readFileSync(path.join(repoRoot,'archive/engine.html'))),sources,rows};
  fs.writeFileSync(path.join(run,'archive-render-matrix.json'),JSON.stringify(matrix,null,2)+'\n');return matrix;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const arg=k=>process.argv[process.argv.indexOf(k)+1];const matrix=buildMatrix({run:arg('--run'),bindings:JSON.parse(fs.readFileSync(arg('--bindings'),'utf8')),modes:process.argv.includes('--all-modes')?['exam','sol','ans']:['sol']});console.log(JSON.stringify({sources:matrix.sources.length,rows:matrix.rows.length}));
}

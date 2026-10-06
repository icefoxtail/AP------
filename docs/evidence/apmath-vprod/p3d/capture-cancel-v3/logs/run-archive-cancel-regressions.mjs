import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const root=process.cwd();
const outputRoot=path.join(root,'.tmp/archive/phase3d-browser-cancel-test/browser-cancel-test/visual-engine/production/regressions-finalization-v2');
fs.mkdirSync(outputRoot,{recursive:true});
const nodeTests=[
  'archive/tools/geometry-equation/tests/p1-boundaries.test.mjs',
  'archive/tools/geometry-equation/tests/production-runner.test.mjs',
  'archive/tools/geometry-equation/tests/production-contract.test.mjs',
  'archive/tools/geometry-equation/tests/worker-error-recovery.test.mjs',
  'archive/tools/geometry-equation/tests/worker-cancel-recovery.test.mjs',
  'archive/tools/geometry-equation/tests/repair-budget-replay.test.mjs',
  'archive/tools/geometry-equation/tests/display-envelope.test.mjs',
  'archive/tools/geometry-equation/tests/record-visual-browser-evidence.test.mjs',
  'archive/tools/geometry-equation/tests/archive-cancel-recovery.test.mjs'
];
const commands=[
  {name:'node',command:process.execPath,args:['--test',...nodeTests]},
  {name:'focused-archive-cancellation',command:process.execPath,args:['--test','archive/tools/geometry-equation/tests/archive-cancel-recovery.test.mjs']},
  {name:'python',command:'python',args:['-m','unittest','discover','-s','archive/tools/geometry-equation/tests','-p','test_*.py']}
];
const rows=[];
for(const item of commands){
  const run=spawnSync(item.command,item.args,{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024,timeout:300000});
  const log={schemaVersion:'PHASE3D_CANCELLATION_REGRESSION_v1',command:[item.command,...item.args],exitCode:run.status,signal:run.signal,error:run.error?String(run.error):null,stdout:run.stdout||'',stderr:run.stderr||''};
  const logPath=path.join(outputRoot,item.name+'-regression.log');
  fs.writeFileSync(logPath,JSON.stringify(log,null,2)+'\n',{flag:'wx'});
  rows.push({name:item.name,exitCode:run.status,logPath:path.relative(root,logPath).replaceAll('\\','/')});
}
const summary={schemaVersion:'PHASE3D_CANCELLATION_REGRESSION_SUMMARY_v1',rows,status:rows.every(row=>row.exitCode===0)?'PASS':'FAIL'};
const summaryPath=path.join(outputRoot,'summary.json');fs.writeFileSync(summaryPath,JSON.stringify(summary,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({...summary,summaryPath:path.relative(root,summaryPath).replaceAll('\\','/')}));
if(summary.status!=='PASS')process.exitCode=1;

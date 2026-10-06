import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const root=process.cwd();
const outputRoot=path.join(root,'.tmp/archive/phase3d-malformed-exact-v2/worker-exact/visual-engine/production/results');
fs.mkdirSync(outputRoot,{recursive:true});
const focus='archive/tools/geometry-equation/tests/worker-malformed-recovery.test.mjs';
const focused=[];
for(let index=1;index<=10;index++){
  const args=['--test',focus];
  const run=spawnSync(process.execPath,args,{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024,timeout:120000});
  const record={schemaVersion:'MALFORMED_WORKER_EXACT_SCHEMA_FOCUSED_RUN_v1',iteration:index,command:[process.execPath,...args],exitCode:run.status,signal:run.signal,error:run.error?String(run.error):null,stdout:run.stdout||'',stderr:run.stderr||''};
  const logPath=path.join(outputRoot,'focused-'+String(index).padStart(2,'0')+'.json');fs.writeFileSync(logPath,JSON.stringify(record,null,2)+'\n',{flag:'wx'});
  focused.push({iteration:index,exitCode:run.status,logPath:path.relative(root,logPath).replaceAll('\\','/')});
}
const nodeArgs=['--test',
  'archive/tools/geometry-equation/tests/p1-boundaries.test.mjs',
  'archive/tools/geometry-equation/tests/production-runner.test.mjs',
  'archive/tools/geometry-equation/tests/production-contract.test.mjs',
  'archive/tools/geometry-equation/tests/worker-error-recovery.test.mjs',
  'archive/tools/geometry-equation/tests/worker-cancel-recovery.test.mjs',
  'archive/tools/geometry-equation/tests/repair-budget-replay.test.mjs',
  'archive/tools/geometry-equation/tests/display-envelope.test.mjs',
  'archive/tools/geometry-equation/tests/record-visual-browser-evidence.test.mjs',
  'archive/tools/geometry-equation/tests/archive-cancel-recovery.test.mjs',
  focus
];
const nodeRun=spawnSync(process.execPath,nodeArgs,{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024,timeout:300000});
const nodeRecord={schemaVersion:'PHASE3D_MALFORMED_EXACT_SCHEMA_NODE_REGRESSION_v1',command:[process.execPath,...nodeArgs],exitCode:nodeRun.status,signal:nodeRun.signal,error:nodeRun.error?String(nodeRun.error):null,stdout:nodeRun.stdout||'',stderr:nodeRun.stderr||''};
const nodeLogPath=path.join(outputRoot,'node-regression.json');fs.writeFileSync(nodeLogPath,JSON.stringify(nodeRecord,null,2)+'\n',{flag:'wx'});
const pyArgs=['-m','unittest','discover','-s','archive/tools/geometry-equation/tests','-p','test_*.py'];
const pyRun=spawnSync('python',pyArgs,{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024,timeout:300000});
const pyRecord={schemaVersion:'PHASE3D_MALFORMED_EXACT_SCHEMA_PYTHON_REGRESSION_v1',command:['python',...pyArgs],exitCode:pyRun.status,signal:pyRun.signal,error:pyRun.error?String(pyRun.error):null,stdout:pyRun.stdout||'',stderr:pyRun.stderr||''};
const pyLogPath=path.join(outputRoot,'python-regression.json');fs.writeFileSync(pyLogPath,JSON.stringify(pyRecord,null,2)+'\n',{flag:'wx'});
const summary={schemaVersion:'PHASE3D_MALFORMED_EXACT_SCHEMA_REGRESSION_SUMMARY_v1',focusedRuns:focused,focusedStatus:focused.every(row=>row.exitCode===0)?'PASS':'FAIL',node:{exitCode:nodeRun.status,logPath:path.relative(root,nodeLogPath).replaceAll('\\','/')},python:{exitCode:pyRun.status,logPath:path.relative(root,pyLogPath).replaceAll('\\','/')},status:focused.every(row=>row.exitCode===0)&&nodeRun.status===0&&pyRun.status===0?'PASS':'FAIL'};
const summaryPath=path.join(outputRoot,'summary.json');fs.writeFileSync(summaryPath,JSON.stringify(summary,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({...summary,summaryPath:path.relative(root,summaryPath).replaceAll('\\','/')}));
if(summary.status!=='PASS')process.exitCode=1;

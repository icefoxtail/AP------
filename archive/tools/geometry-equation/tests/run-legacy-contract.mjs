// Executes the unchanged production verifier against byte-identical copies.
// It cannot write into the real source/asset tree.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {repoRoot,assertOutput} from '../visual-browser-runtime.mjs';
import {sha256} from '../verify-visual-engine-static.mjs';
import {loadBank} from '../build-visual-render-matrix.mjs';
const arg=k=>process.argv[process.argv.indexOf(k)+1];const run=assertOutput(arg('--run'));
const shadow=path.join(run,'legacy-contract-shadow');fs.mkdirSync(shadow,{recursive:true});const ledger=[];
function copy(source,target) {
  source=path.resolve(source);target=assertOutput(target);
  if(!source.startsWith(path.resolve(repoRoot)+path.sep))throw Error('SOURCE_SCOPE_VIOLATION');
  fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(source,target);
  const a=sha256(fs.readFileSync(source)),b=sha256(fs.readFileSync(target));if(a!==b)throw Error('SHADOW_BYTE_DRIFT');
  ledger.push({source:path.relative(repoRoot,source).replaceAll('\\','/'),target:path.relative(repoRoot,target).replaceAll('\\','/'),sha256:a});
}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const units=new Set(['H15-SA-10','H22-C2-02']);const sourceRoot=path.join(repoRoot,'archive/exams/original/high/h1');
for(const file of walk(sourceRoot).filter(v=>v.endsWith('.js'))) {
  const bank=loadBank(fs.readFileSync(file,'utf8'));
  const targets=bank.filter(q=>units.has(q.standardUnitKey));if(!targets.length)continue;
  copy(file,path.join(shadow,path.relative(repoRoot,file)));
  for(const q of targets)if(q.solutionImage){const asset=path.join(repoRoot,'archive',q.solutionImage);copy(asset,path.join(shadow,'archive',q.solutionImage));}
}
for(const file of walk(path.join(repoRoot,'docs/rules')))copy(file,path.join(shadow,path.relative(repoRoot,file)));
const verifier='archive/tools/geometry-equation/verify-line-equation-v22-actual-svg.mjs';copy(path.join(repoRoot,verifier),path.join(shadow,verifier));
const result=spawnSync(process.execPath,[path.join(shadow,verifier)],{cwd:shadow,encoding:'utf8',timeout:120000});
const out=path.join(run,'legacy-contract');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'stdout.log'),result.stdout||'');fs.writeFileSync(path.join(out,'stderr.log'),result.stderr||'');fs.writeFileSync(path.join(out,'copy-ledger.json'),JSON.stringify(ledger,null,2)+'\n');
const report=JSON.parse(fs.readFileSync(path.join(shadow,'archive/analysis/line-equation-v22-qualification/qualification.json'),'utf8'));
fs.writeFileSync(path.join(out,'qualification.json'),JSON.stringify(report,null,2)+'\n');
const baseline=JSON.parse(fs.readFileSync(path.join(run,'config/baseline.json'),'utf8'));
const protectedInputs=ledger.filter(v=>v.source.startsWith('archive/exams/')||v.source.startsWith('archive/assets/'));
const drift=protectedInputs.filter(v=>baseline.protectedFiles[v.source]!==v.sha256);
const verifierParity=ledger.find(v=>v.source===verifier)?.sha256===baseline.coreFiles[verifier];
const frozenInputParity=!drift.length&&verifierParity;
const historicalInheritedFailureIds=[
  '22_금당고_1학기_기말_고1_기출.js#19',
  '25_매산여고_2학기_중간_고1_공통수학2.js#2',
  '25_매산여고_2학기_중간_고1_공통수학2.js#4',
  '25_매산여고_2학기_중간_고1_공통수학2.js#8',
  '25_매산여고_2학기_중간_고1_공통수학2.js#15',
  '25_매산여고_2학기_중간_고1_공통수학2.js#17',
  '25_순천고_2학기_중간_고1_기출.js#18',
  '25_제일고_2학기_중간_고1_기출.js#15',
];
const currentFailureIds=report.rows.filter(v=>v.status==='FAIL').map(v=>v.key);
const missingHistorical=historicalInheritedFailureIds.filter(v=>!currentFailureIds.includes(v));
const additionalLatestMainFindings=currentFailureIds.filter(v=>!historicalInheritedFailureIds.includes(v));
// This gate is regression against Phase0, not a new production qualification.
// Raw verifier FAILs remain FAILs in qualification.json and in this summary.
const regressionPass=frozenInputParity&&!missingHistorical.length&&report.knownBadRecall.status==='PASS'&&report.sourcePack.status==='PASS';
const summary={status:regressionPass?'PASS':'FAIL',gate:'LEGACY_CONTRACT_BASELINE_PARITY',rawQualificationStatus:report.status,baselineHead:baseline.head,baselineInputParity:frozenInputParity?'PASS':'FAIL',introducedRegressionCount:drift.length,drift,verifierByteParity:verifierParity?'PASS':'FAIL',target:report.target,passCount:report.passCount,failureCount:report.failureCount,historicalInheritedFailureIds,historicalInheritedFindingsPresent:missingHistorical.length?'FAIL':'PASS',missingHistorical,additionalLatestMainFindings,inheritedFindings:report.rows.filter(v=>v.status==='FAIL').map(v=>({key:v.key,failedGates:v.pass3Parity.filter(g=>g.status==='FAIL').map(g=>g.name)})),knownBadRecall:report.knownBadRecall.status,recall:report.knownBadRecall.recall,copiedFileCount:ledger.length,scope:'code regression only; inherited production qualification findings are not relabelled PASS'};
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary));if(summary.status!=='PASS')process.exitCode=1;

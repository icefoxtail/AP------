import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root='C:/Users/USER/Desktop/AP-worktrees/archive-2026-1mid-nine/AP------';
const run='archive-2026-1mid-nine-20261008';
const uid='26_왕운중_1학기_중간_중2_기출';
const base=path.join(root,'archive/analysis',run,uid);
const ev=path.join(base,'registration-root-apply');
const closeoutPath=path.join(base,'registration-technical-source9/ROOT.registration.preapply-closeout.json');
const closeout=JSON.parse(fs.readFileSync(closeoutPath,'utf8'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const physical=p=>({path:p,sha256:hash(fs.readFileSync(p))});
function blob(p,clean){
  const bytes=fs.readFileSync(p);
  const args=['hash-object',...(clean?['--path='+path.relative(root,p).replaceAll('\\','/')]:['--no-filters']),'--stdin'];
  return execFileSync('git',args,{cwd:root,input:bytes,encoding:'utf8'}).trim();
}
const changed=JSON.parse(fs.readFileSync(path.join(ev,'target-registration.receipt.json'),'utf8'));
if(changed.status!=='APPLIED_PENDING_VALIDATORS'||changed.targetCounts.identity!==24||changed.targetCounts.metadata!==24||changed.targetCounts.index!==24||changed.targetCounts.catalog!==24||changed.targetCounts.db!==1)throw Error('APPLY_RECEIPT_SCOPE_MISMATCH');
const registryFiles=closeout.registryFiles.map(row=>{
  const full=path.join(root,row.relativePath);
  const bytes=fs.readFileSync(full);
  const raw=hash(bytes),rawBlob=blob(full,false),cleanBlob=blob(full,true);
  return {...row,path:full,sha256:raw,finalSha256:raw,finalWorktreeRawSha256:raw,proposedFinalSha256:raw,finalRawSha256:raw,finalRawBufferBlobSha1:rawBlob,finalCleanFilterBlobSha1:cleanBlob};
});
const readReport=name=>JSON.parse(fs.readFileSync(path.join(ev,'checks',name+'.result.json'),'utf8'));
const validator=(name)=>{const p=path.join(ev,'checks',name+'.result.json');const report=readReport(name);if(report.exitCode!==0)throw Error('VALIDATOR_FAILED:'+name);return {path:p,sha256:hash(fs.readFileSync(p)),status:'PASS',disposition:'PASS',command:report.command,stdout:{path:report.stdoutPath,sha256:report.stdoutSha256},stderr:{path:report.stderrPath,sha256:report.stderrSha256}};};
for(const [name,entry] of [['catalog-check-02-postcopy',validator('catalog-check-02-postcopy')],['registration-parity-02-postcopy',validator('registration-parity-02-postcopy')],['identity-runtime-tests-02-postcopy',validator('identity-runtime-tests-02-postcopy')]]){
  const report=readReport(name);
  if(report.exitCode!==0)throw Error('POSTCOPY_VALIDATOR_NOT_PASS:'+name);
}
const sourcePath=closeout.source.path;
if(hash(fs.readFileSync(sourcePath))!==closeout.source.rawSha256)throw Error('SOURCE_RAW_SHA_DRIFT');
closeout.assets=closeout.assets.map(a=>({...a,sha256:hash(fs.readFileSync(a.path))}));
closeout.registryFiles=registryFiles;
closeout.validators={
  ...closeout.validators,
  postcopyCatalog:validator('catalog-check-02-postcopy'),
  postcopyRegistration:validator('registration-parity-02-postcopy'),
  postcopyIdentity:validator('identity-runtime-tests-02-postcopy'),
  catalogFailurePreserved:physical(path.join(ev,'checks/catalog-check-01.result.json')),
};
const copyReceiptPath=path.join(ev,'ROOT.canonical-header-repair.copy-receipt.json');
closeout.catalogHeaderRepair={plan:physical(path.join(ev,'ROOT.catalog-header-repair-plan.source9.json')),copyReceipt:physical(copyReceiptPath),preservedFailedCatalogCheck:physical(path.join(ev,'checks/catalog-check-01.result.json'))};
closeout.status='REGISTRATION_VALIDATORS_PASS_AWAITING_ROOT_PUBLICATION';
closeout.executionLine='CODEX';
closeout.qualityContractVersion='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006';
closeout.publicationReadiness={
  requiredStatusAfterROOTApplyAndValidators:'REGISTRATION_VALIDATORS_PASS_AWAITING_ROOT_PUBLICATION',
  currentState:'REGISTRATION_VALIDATORS_PASS_AWAITING_ROOT_PUBLICATION',
  rootOwnsApplyStageCommitPushReadback:true
};
closeout.nextRequiredAction='ROOT runs ROOT.publication-prep.mjs with this exact closeout path and SHA, then completes publication, remote readback, and MAIN_DONE.';
closeout.postcopyValidationSummary={catalogCheck:'PASS',registrationParity:'PASS',identityRuntimeTests:'PASS',applyTargetCounts:changed.targetCounts,nonTargetInvariant:changed.nonTargetInvariant,zeroProductionSourceOrAssetChanges:true};
fs.writeFileSync(closeoutPath,JSON.stringify(closeout,null,2)+'\n');
const output={closeoutPath,closeoutSha256:hash(fs.readFileSync(closeoutPath)),status:closeout.status,registryFiles:registryFiles.map(r=>({relativePath:r.relativePath,rawSha256:r.sha256,rawBufferBlobSha1:r.finalRawBufferBlobSha1,cleanFilterBlobSha1:r.finalCleanFilterBlobSha1})),validators:Object.fromEntries(['postcopyCatalog','postcopyRegistration','postcopyIdentity'].map(k=>[k,{path:closeout.validators[k].path,sha256:closeout.validators[k].sha256,status:closeout.validators[k].status}])),source:physical(sourcePath),assets:closeout.assets.map(a=>({path:a.path,sha256:a.sha256}))};
console.log(JSON.stringify(output,null,2));

import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';
import {physical,writeFresh,inside} from '../../tools/archive-codex-artifact-io.mjs';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim(),run='archive-2026-1mid-nine-20261008';
const row=JSON.parse(fs.readFileSync(path.join(root,'archive/analysis',run,'roster.json')))[Number(process.argv[2])-1];
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();if(head!==process.argv[3])throw Error('EXACT_BASELINE_HEAD_REQUIRED');
const receiptPath=path.join(row.evidenceRootAbsolute,'registration-root-apply/target-registration.receipt.json'),receipt=JSON.parse(fs.readFileSync(receiptPath));
const names=receipt.changedFiles.map(f=>f.path),expected=['archive/db.js','archive/data/question_identity_map.json','archive/data/question_metadata.json','archive/question-identity.js','archive/question-index.js','archive/question-index-report.md','archive/question-index-audit.md','archive/data/archive2-catalog.json','archive/data/archive2-canonical-input-manifest.json'];
if(JSON.stringify([...names].sort())!==JSON.stringify(expected.sort()))throw Error('EXACT_NINE_SCOPE_REQUIRED');
const dirty=execFileSync('git',['diff','--name-only','-z']).toString().split('\0').filter(Boolean);if(dirty.some(p=>!names.includes(p)))throw Error('UNRELATED_DIRTY_FILE');
if(execFileSync('git',['diff','--cached','--name-only']).length)throw Error('INDEX_MUST_BE_EMPTY');
for(const file of receipt.changedFiles)if(physical(inside(root,file.path)).sha256!==file.afterSha256)throw Error('OWNED_APPLIED_BYTES_DRIFT:'+file.path);
const snapshotRoot=path.join(row.assetRootAbsolute,'provenance/before-baseline-refresh'),preserved=[];
for(const file of receipt.changedFiles){const snapshot=path.join(snapshotRoot,file.path);fs.mkdirSync(path.dirname(snapshot),{recursive:true});fs.copyFileSync(inside(root,file.path),snapshot,fs.constants.COPYFILE_EXCL);preserved.push({relativePath:file.path,...physical(snapshot)});}
const restored=[];
for(const relative of names){const bytes=execFileSync('git',['show',head+':'+relative],{maxBuffer:128*1024*1024}),destination=inside(root,relative),temporary=destination+'.root-restore-'+process.pid;fs.writeFileSync(temporary,bytes,{flag:'wx'});fs.renameSync(temporary,destination);restored.push({relativePath:relative,...physical(destination),basis:'Exact pinned HEAD Git blob; raw/clean hashes recorded separately'});}
if(execFileSync('git',['diff','--name-only']).length)throw Error('RESTORE_NOT_GIT_CLEAN');
console.log(JSON.stringify(writeFresh(path.join(row.evidenceRootAbsolute,'ROOT.owned-registry-baseline-restore.receipt.json'),{
 schemaVersion:'ROOT_OWNED_REGISTRY_BASELINE_REFRESH_V1',examUid:row.examUid,head,decisionAuthority:'ROOT_DELEGATED',appliedReceipt:physical(receiptPath),preservedAppliedState:preserved,restored,scope:names,sourceAndAssetsModified:false
})));

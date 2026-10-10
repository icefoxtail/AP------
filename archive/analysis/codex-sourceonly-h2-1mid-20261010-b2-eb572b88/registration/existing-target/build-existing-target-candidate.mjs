import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import core from '../../../../archive2-core.js';
import { makeTargetIdentityRows, makeTargetMetadataRows } from '../../../../tools/prepare-target-registration-candidate.mjs';
import { TARGET_META_DELTA_POLICY, collectR1RpmDebtDispositions } from '../../../../tools/register-existing-target-exam-update.mjs';
import { validateCurrentProofChain } from '../../../../tools/prepare-existing-target-registration-update.mjs';
const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(scriptDir,'../../../../..');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const shaJson=o=>sha(Buffer.from(JSON.stringify(o),'utf8'));
const json=b=>JSON.parse(Buffer.from(b).toString('utf8').replace(/^\uFEFF/,''));
const clone=x=>JSON.parse(JSON.stringify(x));
const stableSortObject=o=>Object.fromEntries(Object.entries(o).sort(([a],[b])=>a.localeCompare(b,'en')));
const args={};for(let i=2;i<process.argv.length;i++){const k=process.argv[i];if(!['--assignment','--proof-manifest','--candidate-root','--temp-root'].includes(k))throw new Error('UNKNOWN_ARGUMENT:'+k);args[k.slice(2)]=process.argv[++i];}
for(const k of ['assignment','proof-manifest','candidate-root','temp-root'])if(!args[k])throw new Error('REQUIRED_ARGUMENT:'+k);
const resolve=(p)=>path.resolve(root,p), rel=(p)=>path.relative(root,p).replaceAll('\\','/');
const assignment=json(fs.readFileSync(resolve(args.assignment)));
const proof=json(fs.readFileSync(resolve(args['proof-manifest'])));
const sourceBytes=fs.readFileSync(resolve(assignment.productionRelativePath));
if(sha(sourceBytes)!==assignment.artifactRawSha256)throw new Error('CURRENT_SOURCE_RAW_SHA_MISMATCH');
const box={window:{}};vm.runInNewContext(sourceBytes.toString('utf8'),box,{filename:assignment.productionRelativePath,timeout:5000});
const bank=box.window.questionBank||box.window.questions;if(!Array.isArray(bank)||bank.length!==assignment.questionCount)throw new Error('CURRENT_SOURCE_BANK_INVALID');
const sourceFile=core.normalizeFile(assignment.productionRelativePath.replace(/^archive\/exams\//,''));
const currentProofChain=validateCurrentProofChain({root,assignment,proofManifest:proof,proofManifestPath:args['proof-manifest']});
const priorIdentityRows=json(fs.readFileSync(resolve('archive/data/question_identity_map.json'))).records.filter(row=>core.normalizeFile(row.sourceArchiveFile)===sourceFile);
const sourceRows=makeTargetIdentityRows(sourceFile,bank),head=assignment.expectedHead;
for(const row of sourceRows){const prior=priorIdentityRows.find(old=>old.questionUid===row.questionUid&&Number(old.sourceOrdinal)===Number(row.sourceOrdinal));if(!prior)throw new Error('EXISTING_TARGET_UID_ROW_REQUIRED:'+row.sourceOrdinal);row.sourceQuestionNo=prior.sourceQuestionNo;}
if(execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim()!==head)throw new Error('ROOT_HEAD_DRIFT');
const r1Path=assignment.r1EvidencePath;
const r1Evidence=json(fs.readFileSync(resolve(r1Path)));
const r1RpmDebtByQid=collectR1RpmDebtDispositions(r1Evidence);
const metadataRows=makeTargetMetadataRows({sourceFile,bank,identityRows:sourceRows,r1EvidencePath:r1Path,r1MetaDebtRows:[]});
const baselineMetadata=json(fs.readFileSync(resolve('archive/data/question_metadata.json'))).records.filter(row=>core.normalizeFile(row.sourceArchiveFile)===sourceFile);
for(let index=0;index<metadataRows.length;index++){
 const current=bank[index],old=baselineMetadata.find(row=>Number(row.sourceOrdinal)===index+1);if(!old)throw new Error('EXISTING_TARGET_METADATA_ROW_REQUIRED:q'+(index+1));
 for(const field of TARGET_META_DELTA_POLICY.fields){
  const sourceHas=Object.prototype.hasOwnProperty.call(current,field)||(field==='standardCourse'&&Object.prototype.hasOwnProperty.call(current,'course'));
  if(!sourceHas){if(Object.prototype.hasOwnProperty.call(old,field))metadataRows[index][field]=clone(old[field]);else delete metadataRows[index][field];}
 }
}
for(let index=0;index<metadataRows.length;index++){
 const question=bank[index],debt=r1RpmDebtByQid.get(index+1);
 const hasSourceRpm=['rpmL1','rpmL2','rpmL3','rpmL4','rpmCurriculum','rpmSemanticStatus','rpmSemanticReason'].some(field=>Object.prototype.hasOwnProperty.call(question,field));
 if(!hasSourceRpm&&debt){metadataRows[index].rpmSemanticStatus=debt.status;metadataRows[index].rpmSemanticReason=debt.reason;metadataRows[index].rpmEvidenceDebtFields=debt.debtFields;metadataRows[index].rpmProjectionRevision='archive-registration-target-r1-rpm-debt-v1';}
}
const candidateRoot=resolve(args['candidate-root']),tempRoot=resolve(args['temp-root']);
for(const p of [candidateRoot,tempRoot]){const relative=path.relative(root,p);if(relative.startsWith('..')||path.isAbsolute(relative))throw new Error('OUTPUT_PATH_OUTSIDE_ROOT:'+p);if(fs.existsSync(p))throw new Error('FRESH_OUTPUT_PATH_REQUIRED:'+rel(p));fs.mkdirSync(p,{recursive:true});}
const sourcePath=resolve(assignment.productionRelativePath);const dbBox={window:{}};vm.runInNewContext(fs.readFileSync(resolve('archive/db.js'),'utf8'),dbBox,{timeout:5000});const targetDb=dbBox.window.mainDB.exams.filter(row=>core.normalizeFile(row.file)===sourceFile);if(targetDb.length!==1)throw new Error('CURRENT_TARGET_DB_TUPLE_REQUIRED');
const oldIdentity=json(fs.readFileSync(resolve('archive/data/question_identity_map.json')));
const identityRecords=[...oldIdentity.records.filter(row=>core.normalizeFile(row.sourceArchiveFile)!==sourceFile),...sourceRows].sort((a,b)=>a.sourceArchiveFile.localeCompare(b.sourceArchiveFile,'en')||Number(a.sourceOrdinal)-Number(b.sourceOrdinal));
const byUid={},byLegacyQKey={},bySourceFileAndOrdinal={},bySourceFileAndQuestionNo={};
for(const row of identityRecords){byUid[row.questionUid]={sourceArchiveFile:row.sourceArchiveFile,sourceOrdinal:row.sourceOrdinal,sourceQuestionNo:row.sourceQuestionNo};(byLegacyQKey[row.legacyQKey]??=[]).push(row.questionUid);(bySourceFileAndOrdinal[row.sourceArchiveFile]??={})[String(row.sourceOrdinal)]=row.questionUid;const m=bySourceFileAndQuestionNo[row.sourceArchiveFile]??={};m[String(row.sourceQuestionNo??'')]=[...(m[String(row.sourceQuestionNo??'')]||[]),row.questionUid];}
const identityNext={...oldIdentity,sourceCommit:head,records:identityRecords,lookup:{byQuestionUid:stableSortObject(byUid),byLegacyQKey:stableSortObject(byLegacyQKey),bySourceFileAndOrdinal:stableSortObject(bySourceFileAndOrdinal),bySourceFileAndQuestionNo:stableSortObject(bySourceFileAndQuestionNo)},stats:{...(oldIdentity.stats||{}),examFileCount:new Set(identityRecords.map(row=>row.sourceArchiveFile)).size,sourceQuestionCount:identityRecords.length,uniqueQuestionUidCount:new Set(identityRecords.map(row=>row.questionUid)).size,duplicateQuestionUidCount:0,failures:0},incrementalSync:{schemaVersion:'question-identity-incremental-sync-v2',sourceCommit:head,updatedFiles:1,updatedRecords:sourceRows.length,updatedSourceFiles:[sourceFile],renamedFiles:[],renamedRecords:0,renamedSourceFiles:[]},generatedAt:new Date().toISOString()};delete identityNext.identityDigest;const stableIdentity={...identityNext};delete stableIdentity.generatedAt;identityNext.identityDigest=shaJson(stableIdentity);
const identityText=JSON.stringify(identityNext,null,2)+'\n';const identityBytes=Buffer.from(identityText,'utf8');
const metadataBase=json(fs.readFileSync(resolve('archive/data/question_metadata.json')));
const metadataRecords=[...metadataBase.records.filter(row=>core.normalizeFile(row.sourceArchiveFile)!==sourceFile),...metadataRows].sort((a,b)=>String(a.questionUid).localeCompare(String(b.questionUid),'en'));
const metadataNext={...metadataBase,generatedAt:new Date().toISOString(),sourceDigests:{...(metadataBase.sourceDigests||{}),identityMap:sha(identityBytes)},consistency:{...(metadataBase.consistency||{}),sourceFingerprintFailures:Number(metadataBase.consistency?.sourceFingerprintFailures||0),sourceClassificationConflicts:Number(metadataBase.consistency?.sourceClassificationConflicts||0),productionValuesWinOnMerge:true},counts:{...(metadataBase.counts||{}),records:metadataRecords.length,uidUnique:true,sourceJoinUnique:true,semanticallyReviewed:metadataRecords.filter(row=>row.reviewStatus==='reviewed_pass'||['approved_semantic_review','approved_exam_meta_source'].includes(row.metadataStatus)).length,explicitProblemTypeHolds:metadataRecords.filter(row=>row.fieldStatus?.problemType==='manual_review_pending').length,explicitTemplateHolds:metadataRecords.filter(row=>row.fieldStatus?.template==='manual_review_pending').length,explicitDifficultyHolds:metadataRecords.filter(row=>row.fieldStatus?.difficulty==='manual_review_pending').length},records:metadataRecords,registrationSync:{schemaVersion:'archive-registration-metadata-sync-v2',updated:metadataRows.length,updatedFiles:[sourceFile],relocated:0,relocatedFiles:[]}};delete metadataNext.digest;metadataNext.digest=shaJson(metadataNext);const metadataText=JSON.stringify(metadataNext,null,2)+'\n';
const prep={
 candidateRoot, tempRoot, sourceFile,
};
function write(relPath,bytes){const file=path.join(tempRoot,relPath);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);}
write('archive/db.js',Buffer.from('window.mainDB = '+JSON.stringify({exams:targetDb},null,2)+';\n','utf8'));
write('archive/exams/'+sourceFile,sourceBytes);
write('archive/data/question_identity_map.json',Buffer.from(identityText,'utf8'));
write('archive/data/question_metadata.json',Buffer.from(metadataText,'utf8'));
for(const name of ['archive2-core.js','problem-bank-meta.js','mixer-selector.js','archive2-canonical.js'])write('archive/'+name,fs.readFileSync(resolve('archive/'+name)));
write('archive/tools/build-archive2-catalog.mjs',fs.readFileSync(resolve('archive/tools/build-archive2-catalog.mjs')));
const runtimePacks=core.Canonical.RUNTIME_INPUT_PATHS.map(p=>json(fs.readFileSync(resolve('archive/'+p))));
const manifestInputs=core.Canonical.manifestInputPathsFromRuntimePacks(runtimePacks,p=>fs.existsSync(resolve('archive/'+p))&&fs.statSync(resolve('archive/'+p)).isFile());
const extraInputs=new Set([...manifestInputs,'data/master_tables/js_archive_tag_master.json']);
for(const item of extraInputs){const source=resolve(path.join('archive',item));if(!fs.existsSync(source))throw new Error('CATALOG_INPUT_MISSING:'+item);write(path.join('archive',item),fs.readFileSync(source));}
write('archive/data/question_identity_map.json',identityBytes);
write('archive/data/question_metadata.json',Buffer.from(metadataText,'utf8'));
const overrideDir=resolve('archive/data/meta-foundation/evidence/review-overrides/v1');if(fs.existsSync(overrideDir)){for(const entry of fs.readdirSync(overrideDir,{withFileTypes:true})){if(entry.isFile())write(path.join('archive/data/meta-foundation/evidence/review-overrides/v1',entry.name),fs.readFileSync(path.join(overrideDir,entry.name)));}}
const catalogBuilder=path.join(tempRoot,'archive/tools/build-archive2-catalog.mjs');
const catalogStdout=execFileSync(process.execPath,[catalogBuilder],{cwd:tempRoot,encoding:'utf8',maxBuffer:16*1024*1024});
const catalogBytes=fs.readFileSync(path.join(tempRoot,'archive/data/archive2-catalog.json'));
const tempIndex=path.join(tempRoot,'index-build');fs.mkdirSync(path.join(tempIndex,'archive/tools'),{recursive:true});fs.mkdirSync(path.join(tempIndex,'archive/exams'),{recursive:true});
fs.mkdirSync(path.dirname(path.join(tempIndex,'archive/exams',sourceFile)),{recursive:true});
fs.copyFileSync(sourcePath,path.join(tempIndex,'archive/exams',sourceFile));fs.copyFileSync(resolve('archive/tools/build-question-index.mjs'),path.join(tempIndex,'archive/tools/build-question-index.mjs'));
fs.writeFileSync(path.join(tempIndex,'archive/db.js'),'window.mainDB = '+JSON.stringify({exams:targetDb},null,2)+';\n');
execFileSync(process.execPath,[path.join(tempIndex,'archive/tools/build-question-index.mjs')],{cwd:tempIndex,env:{...process.env,GEOMETRY_ARCHIVE_ROOT:path.join(tempIndex,'archive'),GEOMETRY_REPO_ROOT:tempIndex},encoding:'utf8',maxBuffer:16*1024*1024});
const indexBytes=fs.readFileSync(path.join(tempIndex,'archive/question-index.js'));
const candidateDb=Buffer.from('window.mainDB = '+JSON.stringify({exams:targetDb},null,2)+';\n','utf8');
for(const [relative,bytes] of [['archive/db.js',candidateDb],['archive/data/question_identity_map.json',Buffer.from(identityText,'utf8')],['archive/data/question_metadata.json',Buffer.from(metadataText,'utf8')],['archive/question-index.js',indexBytes],['archive/data/archive2-catalog.json',catalogBytes]]){const file=path.join(candidateRoot,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);}
const decoded=core.decodeCatalog(json(catalogBytes));const targetCatalog=decoded.records.filter(r=>core.normalizeFile(r.sourceFile)===sourceFile);if(targetCatalog.length!==bank.length)throw new Error('BUILT_CATALOG_TARGET_DENOMINATOR_MISMATCH');
fs.writeFileSync(path.join(candidateRoot,'candidate-build.receipt.json'),JSON.stringify({schemaVersion:'ROOT_EXISTING_TARGET_CANDIDATE_BUILD_V1',examUid:assignment.examUid,source:{path:assignment.productionRelativePath,rawSha256:assignment.artifactRawSha256,gitBlobSha1:assignment.validatorRawBufferBlobSha1,questionCount:bank.length},r1MetaReview:{path:r1Path,sha256:proof.proofs.find(row=>row.stage==='R1')?.sha256,reviewedQids:currentProofChain.r1MetaPassQids,explicitDebtDispositionRetained:true},r1RpmEvidenceDebtQids:[...r1RpmDebtByQid.keys()].sort((a,b)=>a-b),metadataRevisionCounts:Object.fromEntries([...new Set(metadataRows.map(row=>row.metadataRevision))].map(rev=>[rev,metadataRows.filter(row=>row.metadataRevision===rev).length])),rpmProjectionRevisionCounts:Object.fromEntries([...new Set(metadataRows.map(row=>row.rpmProjectionRevision).filter(Boolean))].map(rev=>[rev,metadataRows.filter(row=>row.rpmProjectionRevision===rev).length])),candidateFiles:Object.fromEntries(['archive/db.js','archive/data/question_identity_map.json','archive/data/question_metadata.json','archive/question-index.js','archive/data/archive2-catalog.json'].map(p=>[p,sha(fs.readFileSync(path.join(candidateRoot,p)))])),catalogBuildStdout:catalogStdout.trim(),targetCatalogRows:targetCatalog.length},null,2)+'\n');
console.log(JSON.stringify({status:'EXISTING_TARGET_CANDIDATE_READY',examUid:assignment.examUid,candidateRoot:rel(candidateRoot),tempRoot:rel(tempRoot),questionCount:bank.length,metadataRows:metadataRows.length,reviewedMetaQids:currentProofChain.r1MetaPassQids.length,r1RpmEvidenceDebtQids:[...r1RpmDebtByQid.keys()].sort((a,b)=>a-b),metadataRevisions:Object.fromEntries([...new Set(metadataRows.map(row=>row.metadataRevision))].map(rev=>[rev,metadataRows.filter(row=>row.metadataRevision===rev).length])),rpmProjectionRevisions:Object.fromEntries([...new Set(metadataRows.map(row=>row.rpmProjectionRevision).filter(Boolean))].map(rev=>[rev,metadataRows.filter(row=>row.rpmProjectionRevision===rev).length])),catalogTargetRows:targetCatalog.length},null,2));

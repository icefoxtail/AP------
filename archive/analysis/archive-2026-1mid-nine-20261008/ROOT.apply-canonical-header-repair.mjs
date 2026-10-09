import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {physical,writeFresh,inside} from '../../tools/archive-codex-artifact-io.mjs';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
const [planArg,expectedSha]=process.argv.slice(2),planPath=inside(root,planArg);
if(physical(planPath).sha256!==expectedSha)throw Error('REPAIR_PLAN_BINDING_REQUIRED');
const plan=JSON.parse(fs.readFileSync(planPath));
if(plan.schemaVersion==='ROOT_REGISTRATION_CATALOG_HEADER_REPAIR_PLAN_V1'){
 if(!['packedColumnDefinitionsEqual','packedStringTableExact','packedRowsExactInOrder','decodedCatalogRowsExactInOrder','examCountEqual','recordCountEqual'].every(k=>plan.checks[k]===true)||plan.checks.candidateCatalogCheckExitCode!==0||JSON.stringify(plan.topLevelDifferences.map(d=>d.field))!==JSON.stringify(['indexVersion']))throw Error('CANONICAL_HEADER_ONLY_COMPARISON_REQUIRED');
 const evidenceRoot=path.dirname(planPath),receipt=JSON.parse(fs.readFileSync(path.join(evidenceRoot,'target-registration.receipt.json')));
 const assignmentFolders=fs.readdirSync(path.dirname(evidenceRoot)).filter(p=>/^registration-technical-source\d+$/.test(p));
 if(assignmentFolders.length!==1)throw Error('UNIQUE_TECHNICAL_ASSIGNMENT_REQUIRED');
 const assignment=JSON.parse(fs.readFileSync(path.join(evidenceRoot,'..',assignmentFolders[0],'registration.assignment.json')));
 plan.head=assignment.expectedHead;plan.issues=[];plan.repairLocus={noRowsOrMetaReclassification:true};
 plan.invariance={nineCurrentPhysicalFiles:receipt.changedFiles.map(p=>({path:p.path,rawSha256:p.afterSha256}))};
 plan.copyFiles=plan.repairCopies.map(p=>({relativePath:path.relative(root,p.to).replaceAll('\\','/'),sourcePath:p.from,currentPath:p.to,currentRawSha256:receipt.changedFiles.find(f=>inside(root,f.path)===inside(root,p.to)).afterSha256,expectedRawSha256:p.sha256}));
}
if(plan.schemaVersion==='ROOT_REGISTRATION_D662_CATALOG_HEADER_REPAIR_PLAN_V1'){
 const comparison=plan.canonicalComparison;
 if(!['catalogOnlyIndexVersionDiff','packedColumnsEqual','packedStringsEqual','packedRecordsEqual','healthEqual','examRowsEqual'].every(k=>comparison[k]===true))throw Error('CANONICAL_HEADER_ONLY_COMPARISON_REQUIRED');
 plan.issues=[];plan.repairLocus={noRowsOrMetaReclassification:true};
 plan.invariance={nineCurrentPhysicalFiles:plan.nineCurrentHashes.map(p=>({...p,path:p.relativePath}))};
 plan.copyFiles=plan.repairFiles.map(p=>({relativePath:p.path,sourcePath:p.candidateCanonicalPath,currentPath:p.path,currentRawSha256:p.rootBeforeRawSha256,expectedRawSha256:p.candidateRawSha256}));
}
if(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()!==plan.head||plan.issues.length||!plan.repairLocus.noRowsOrMetaReclassification)throw Error('REPAIR_PRECONDITION_FAILED');
const allowed=['archive/data/archive2-catalog.json','archive/data/archive2-canonical-input-manifest.json'];
if(plan.copyFiles.length!==2||plan.copyFiles.some(p=>!allowed.includes(p.relativePath)))throw Error('EXACT_TWO_HEADER_OUTPUTS_REQUIRED');
for(const binding of plan.invariance.nineCurrentPhysicalFiles)if(physical(inside(root,binding.path)).sha256!==binding.rawSha256)throw Error('CURRENT_NINE_FILE_DRIFT');
for(const output of plan.copyFiles)if(physical(inside(root,output.sourcePath)).sha256!==output.expectedRawSha256||physical(inside(root,output.currentPath)).sha256!==output.currentRawSha256)throw Error('COPY_BINDING_DRIFT');
const backupRoot=inside(root,'.tmp/archive/'+plan.runId+'/'+plan.examUid+'/ROOT-before-header-repair');
const preserved=[];
for(const output of plan.copyFiles){const destination=path.join(backupRoot,output.relativePath);fs.mkdirSync(path.dirname(destination),{recursive:true});fs.copyFileSync(inside(root,output.currentPath),destination,fs.constants.COPYFILE_EXCL);preserved.push({...physical(destination),relativePath:output.relativePath});}
for(const output of plan.copyFiles)fs.copyFileSync(inside(root,output.sourcePath),inside(root,output.currentPath));
const current=plan.copyFiles.map(p=>({relativePath:p.relativePath,...physical(inside(root,p.currentPath))}));
if(current.some(p=>p.sha256!==plan.copyFiles.find(c=>c.relativePath===p.relativePath).expectedRawSha256))throw Error('POST_COPY_HASH_FAILED');
console.log(JSON.stringify(writeFresh(path.join(path.dirname(planPath),'ROOT.canonical-header-repair.copy-receipt.json'),{
 schemaVersion:'ROOT_EXACT_CANONICAL_HEADER_REPAIR_COPY_V1',examUid:plan.examUid,decisionAuthority:'ROOT_DELEGATED',
 plan:physical(planPath),preservedFailedState:preserved,current,technicalCopyComplete:true,qualityPassAsserted:false,
 actualPostCopyValidatorsRequired:true,createdAt:new Date().toISOString()})));

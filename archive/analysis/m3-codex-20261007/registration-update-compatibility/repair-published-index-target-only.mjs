import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';

const root=fs.realpathSync(execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim());
const expectedHead='3e156278663d9595b7773f60d01e165c3986a813';
const examUid='25_왕운중_2학기_중간_중3_수학';
const sourceRel='archive/exams/original/middle/m3/2mid/25_왕운중_2학기_중간_중3_수학.js';
const sourceFile=sourceRel.replace(/^archive\/exams\//,'');
const badIndexSha='4f92c6543e66d3c2eac4172571dedabde331feaca16e3998b5f8d15179d41843';
const originalIndexSha='a0db91d6ac704ae46f34dcf23dcde2f71c4cac93eb89be037ff331508ea62045';
const finalSourceSha='bbe3cb8ff042826fbf354f2654b1126c185f7dfab9f83a8f29469f7657c2fa00';
const finalArtifactBlob='61e0997b3f76551a8b0d012eb3cf469972d774ff';
const rollbackDir='.tmp/archive/m3-codex-20261007/25_왕운중_2학기_중간_중3_수학/registration-final/applied/rollback-backups/2026-10-07T17-39-25-380Z';
const backupIndexRel=rollbackDir+'/archive/question-index.js';
const prototypeRel='archive/analysis/m3-codex-20261007/registration-update-compatibility/canonical-v2-current-prototype.json';
const appliedReceiptRel='archive/analysis/m3-codex-20261007/25_왕운중_2학기_중간_중3_수학/ROOT.existing-registration.merge.receipt.json';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const json=rel=>JSON.parse(fs.readFileSync(path.join(root,rel),'utf8').replace(/^\uFEFF/,''));
const rootPath=rel=>path.join(root,rel);
const indexRel='archive/question-index.js';
const indexPath=rootPath(indexRel);
const bytesCurrent=fs.readFileSync(indexPath);
if(execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim()!==expectedHead)throw Error('REPAIR_HEAD_CHANGED');
if(sha(bytesCurrent)!==badIndexSha)throw Error('PUBLISHED_INVALID_INDEX_SHA_CHANGED:'+sha(bytesCurrent));
const sourceBytes=fs.readFileSync(rootPath(sourceRel));
if(sha(sourceBytes)!==finalSourceSha||blobSha1(sourceBytes)!==finalArtifactBlob)throw Error('FINAL_SOURCE_BINDING_CHANGED');

const compatibilityDir=rootPath('archive/analysis/m3-codex-20261007/registration-update-compatibility');
fs.mkdirSync(compatibilityDir,{recursive:true});
const preservedBadIndex=path.join(compatibilityDir,'question-index.published-invalid.js');
if(fs.existsSync(preservedBadIndex)&&sha(fs.readFileSync(preservedBadIndex))!==badIndexSha)throw Error('PRESERVED_BAD_INDEX_EVIDENCE_COLLISION');
if(!fs.existsSync(preservedBadIndex))fs.copyFileSync(indexPath,preservedBadIndex);
if(sha(fs.readFileSync(preservedBadIndex))!==badIndexSha)throw Error('PRESERVED_BAD_INDEX_SHA_MISMATCH');

const rollbackBytes=fs.readFileSync(rootPath(backupIndexRel));
if(sha(rollbackBytes)!==originalIndexSha)throw Error('ROLLBACK_BASELINE_INDEX_SHA_MISMATCH');
const prototype=json(prototypeRel);
if(prototype.examUid!==examUid||prototype.source.rawSha256!==finalSourceSha||prototype.source.rawBlobSha1!==finalArtifactBlob||!Array.isArray(prototype.targetIndexRows)||prototype.targetIndexRows.length!==24)throw Error('VALIDATED_FINAL_PROTOTYPE_BINDING_MISMATCH');
const core=createRequire(import.meta.url)(rootPath('archive/archive2-core.js'));
const normalizedTarget=core.normalizeFile(sourceFile);
const baseWindow={window:{}};new vm.Script(rollbackBytes.toString('utf8'),{filename:'rollback-question-index.js'});vm.runInNewContext(rollbackBytes.toString('utf8'),baseWindow,{timeout:3000});
const baselineRows=baseWindow.window.questionIndex;
if(!Array.isArray(baselineRows)||baselineRows.length!==12351)throw Error('ROLLBACK_BASELINE_INDEX_PARSE_OR_DENOMINATOR_FAIL');
const targetBefore=baselineRows.filter(row=>core.normalizeFile(row.sourceFile)===normalizedTarget);
if(targetBefore.length!==24)throw Error('ROLLBACK_BASELINE_TARGET_INDEX_DENOMINATOR_FAIL');
const targetByOrdinal=new Map(prototype.targetIndexRows.map(row=>[Number(row.sourceOrdinal),row]));
if(targetByOrdinal.size!==24||[...targetByOrdinal.keys()].sort((a,b)=>a-b).some((qid,i)=>qid!==i+1))throw Error('FINAL_TARGET_INDEX_QID_COVERAGE_FAIL');
const rowsNext=baselineRows.map(row=>core.normalizeFile(row.sourceFile)===normalizedTarget?targetByOrdinal.get(Number(row.sourceOrdinal)):row);
if(rowsNext.some(row=>!row))throw Error('FINAL_TARGET_INDEX_REPLACEMENT_MISSING');
const equal=(a,b)=>JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
if(!equal(rowsNext.filter(row=>core.normalizeFile(row.sourceFile)!==normalizedTarget),baselineRows.filter(row=>core.normalizeFile(row.sourceFile)!==normalizedTarget)))throw Error('NON_TARGET_INDEX_ROW_INVARIANCE_FAIL');
if(!equal(rowsNext.filter(row=>core.normalizeFile(row.sourceFile)===normalizedTarget),prototype.targetIndexRows))throw Error('TARGET_INDEX_PROJECTION_PARITY_FAIL');

const baselineText=rollbackBytes.toString('utf8');
const marker='window.questionIndex=';
const markerStart=baselineText.indexOf(marker);
if(markerStart<0)throw Error('BASELINE_QUESTION_INDEX_ASSIGNMENT_MISSING');
const valueStart=markerStart+marker.length;
const firstSemicolon=baselineText.indexOf(';',valueStart);
const valueEnd=findJsonContainerEnd(baselineText,valueStart);
if(firstSemicolon<0||firstSemicolon>=valueEnd)throw Error('SEMICOLON_IN_STRING_REGRESSION_CASE_MISSING');
const semiRows=baselineRows.filter(row=>['contentText','choicesText'].some(key=>typeof row[key]==='string'&&row[key].includes(';')));
if(!semiRows.length)throw Error('SEMICOLON_STRING_ROW_REGRESSION_CASE_MISSING');
let terminator=valueEnd;while(/\s/.test(baselineText[terminator]||''))terminator++;
if(baselineText[terminator]!==';')throw Error('BASELINE_JSON_VALUE_TERMINATOR_INVALID');
const repairedBytes=Buffer.from(baselineText.slice(0,valueStart)+JSON.stringify(rowsNext)+baselineText.slice(valueEnd),'utf8');
new vm.Script(repairedBytes.toString('utf8'),{filename:indexRel});
const repairedWindow={window:{}};vm.runInNewContext(repairedBytes.toString('utf8'),repairedWindow,{timeout:3000});
if(!equal(repairedWindow.window.questionIndex,rowsNext))throw Error('SERIALIZED_INDEX_READBACK_MISMATCH');

const appliedReceipt=json(appliedReceiptRel);
const appliedIndex=appliedReceipt.changedFiles.find(row=>row.relativePath===indexRel);
if(!appliedIndex||appliedIndex.beforeSha256!==originalIndexSha||appliedIndex.afterSha256!==badIndexSha)throw Error('APPLIED_BAD_INDEX_PROVENANCE_BINDING_MISMATCH');
const manifest=json('archive/data/archive2-canonical-input-manifest.json');
if(manifest.files.some(file=>file.path==='question-index.js'||file.path==='archive/question-index.js'||file.path==='data/question-index.js'))throw Error('QUESTION_INDEX_APPEARS_IN_CANONICAL_MANIFEST_UNEXPECTEDLY');
const ninePaths=['archive/db.js','archive/data/question_identity_map.json','archive/data/question_metadata.json','archive/question-identity.js','archive/question-index.js','archive/question-index-report.md','archive/question-index-audit.md','archive/data/archive2-catalog.json','archive/data/archive2-canonical-input-manifest.json'];
for(const row of appliedReceipt.changedFiles){const actual=sha(fs.readFileSync(rootPath(row.relativePath)));if(actual!==row.afterSha256)throw Error('APPLIED_RECEIPT_CURRENT_HASH_MISMATCH:'+row.relativePath);}
const unchangedOtherFiles=appliedReceipt.changedFiles.filter(row=>row.relativePath!==indexRel).map(row=>({path:row.relativePath,sha256:sha(fs.readFileSync(rootPath(row.relativePath)))}));
if(unchangedOtherFiles.some((row,i)=>row.sha256!==appliedReceipt.changedFiles.filter(x=>x.relativePath!==indexRel)[i].afterSha256))throw Error('NON_INDEX_REGISTRY_CHANGED_BEFORE_REPAIR');
if(new Set(appliedReceipt.changedFiles.map(row=>row.relativePath)).size!==9||ninePaths.some(rel=>!appliedReceipt.changedFiles.some(row=>row.relativePath===rel)))throw Error('APPLIED_NINE_FILE_RECEIPT_INCOMPLETE');

fs.writeFileSync(indexPath,repairedBytes);
const actualAfter=fs.readFileSync(indexPath);
if(sha(actualAfter)!==sha(repairedBytes))throw Error('PUBLISHED_TARGET_INDEX_REPAIR_SHA_MISMATCH');
new vm.Script(actualAfter.toString('utf8'),{filename:indexRel});
const finalWindow={window:{}};vm.runInNewContext(actualAfter.toString('utf8'),finalWindow,{timeout:3000});
if(!equal(finalWindow.window.questionIndex,rowsNext))throw Error('PUBLISHED_INDEX_RUNTIME_READBACK_MISMATCH');
for(const row of appliedReceipt.changedFiles)if(row.relativePath!==indexRel&&sha(fs.readFileSync(rootPath(row.relativePath)))!==row.afterSha256)throw Error('NON_INDEX_REGISTRY_CHANGED_DURING_REPAIR:'+row.relativePath);

const result={schemaVersion:'TARGET_ONLY_PUBLISHED_QUESTION_INDEX_REPAIR_V1',status:'REPAIRED_TARGET_INDEX_ONLY',examUid,head:expectedHead,productionSource:{path:sourceRel,rawSha256:finalSourceSha,artifactSha:finalArtifactBlob},badPublishedIndex:{sha256:badIndexSha,backupPath:path.relative(root,preservedBadIndex).replace(/\\/g,'/'),rollbackBaseSha256:originalIndexSha,rollbackBasePath:backupIndexRel},failureCause:{locus:'archive/tools/merge-existing-target-registration.mjs question-index string-splice boundary',firstSemicolonOffset:firstSemicolon-valueStart,jsonArrayBoundary:valueEnd-valueStart,semicolonRows:semiRows.slice(0,8).map(row=>({sourceFile:row.sourceFile,sourceOrdinal:row.sourceOrdinal,qKey:row.qKey}))},repair:{file:indexRel,beforeSha256:badIndexSha,afterSha256:sha(repairedBytes),targetRowsReplaced:prototype.targetIndexRows.length,nonTargetRowsPreserved:rowsNext.length-prototype.targetIndexRows.length,canonicalManifestIncludesQuestionIndex:false,otherEightRegistryFilesUnchanged:true},validation:{syntax:new vm.Script(actualAfter.toString('utf8'),{filename:indexRel})?'PASS':'FAIL',runtimeReadback:'PASS',targetProjection:'PASS',nonTargetRows:'PASS',semicolonInStringRegressionCase:'PASS'},appliedReceipt:{path:appliedReceiptRel,sha256:sha(fs.readFileSync(rootPath(appliedReceiptRel)))}};
const out=path.join(compatibilityDir,'published-index-target-only-repair.receipt.json');fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,receiptPath:out,receiptSha256:sha(fs.readFileSync(out))},null,2));

function canonical(value){return Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])):value;}
function blobSha1(bytes){return crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`),bytes])).digest('hex');}
function findJsonContainerEnd(source,start){let inString=false,escaped=false,depth=0,started=false;for(let i=start;i<source.length;i++){const ch=source[i];if(inString){if(escaped)escaped=false;else if(ch==='\\')escaped=true;else if(ch==='"')inString=false;continue;}if(ch==='"'){inString=true;continue;}if(ch==='['||ch==='{'){depth++;started=true;continue;}if(ch===']'||ch==='}'){if(!started||depth<=0)throw Error('JSON_NESTING_INVALID');depth--;if(depth===0)return i+1;}}throw Error('JSON_CONTAINER_END_NOT_FOUND');}

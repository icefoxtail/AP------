import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

const args={};
for(let i=2;i<process.argv.length;i++){
  const k=process.argv[i];
  if(k==='--apply')args.apply=true;
  else if(k==='--validate-final-quality')args.validateFinalQuality=true;
  else if(['--root','--baseline-root','--assignment','--prototype','--output-dir','--quality-proof'].includes(k))args[k.slice(2)]=process.argv[++i];
  else throw Error('UNKNOWN_ARGUMENT:'+k);
}
for(const k of ['root','assignment','prototype','output-dir'])if(!args[k])throw Error('REQUIRED_ARGUMENT:'+k);
const root=fs.realpathSync(path.resolve(args.root));
const baselineRoot=fs.realpathSync(path.resolve(args['baseline-root']||root));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const sha1=b=>crypto.createHash('sha1').update(b).digest('hex');
const blobSha1=b=>sha1(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b]));
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const deep=(a,b)=>JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
const json=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const repoPath=(base,rel)=>{const full=path.resolve(base,rel),r=path.relative(base,full);if(r.startsWith('..')||path.isAbsolute(r))throw Error('PATH_ESCAPE:'+rel);return full;};
const rootPath=rel=>repoPath(root,rel),baselinePath=rel=>repoPath(baselineRoot,rel);
const assignment=json(rootPath(args.assignment));
const prototype=json(rootPath(args.prototype));
const examUid=assignment.examUid,sourceRel=assignment.productionRelativePath;
const qCount=Number(assignment.expectedQuestionCount);
const sourceFile=sourceRel.replace(/^archive\/exams\//,'').replace(/\\/g,'/');
const core=createRequire(import.meta.url)(rootPath('archive/archive2-core.js'));
const head=execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(head!==assignment.expectedHead)throw Error('HEAD_MISMATCH:'+head);
if(prototype.head!==head||prototype.examUid!==examUid)throw Error('PROTOTYPE_HEAD_OR_UID_BINDING_MISMATCH');
if(prototype.status!=='PROVISIONAL_CURRENT_SOURCE_PENDING_REVIEW_APPLY_DISABLED')throw Error('PROTOTYPE_STATUS_NOT_APPLICABLE');
const registryPaths=['archive/db.js','archive/data/question_identity_map.json','archive/data/question_metadata.json','archive/question-identity.js','archive/question-index.js','archive/question-index-report.md','archive/question-index-audit.md','archive/data/archive2-catalog.json','archive/data/archive2-canonical-input-manifest.json'];
if(assignment.baselineRegistryBindings.length!==9)throw Error('NINE_BASELINE_BINDINGS_REQUIRED');
const beforeBytes={};
for(const binding of assignment.baselineRegistryBindings){
  if(!registryPaths.includes(binding.relativePath))throw Error('UNEXPECTED_BASELINE_PATH:'+binding.relativePath);
  const bytes=fs.readFileSync(baselinePath(binding.relativePath));
  if(sha(bytes)!==binding.sha256)throw Error('BASELINE_REGISTRY_SHA_MISMATCH:'+binding.relativePath);
  beforeBytes[binding.relativePath]=bytes;
}
const baselineHead=execFileSync('git',['-C',baselineRoot,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(baselineHead!==head)throw Error('BASELINE_HEAD_MISMATCH:'+baselineHead);
const currentSourceBytes=fs.readFileSync(rootPath(sourceRel));
const currentSourceSha=sha(currentSourceBytes),currentSourceBlob=blobSha1(currentSourceBytes);
if(currentSourceSha!==prototype.source.rawSha256||currentSourceBlob!==prototype.source.rawBlobSha1)throw Error('PROTOTYPE_SOURCE_BINDING_MISMATCH');
const finalSourceBinding=assignment.requiredFinalSourceBinding||{};
const expectedAssignedRaw=finalSourceBinding.artifactRawSha256||assignment.provisionalCurrentSource.rawSha256;
const expectedAssignedBlob=finalSourceBinding.validatorRawBufferBlobSha1||assignment.provisionalCurrentSource.rawBlobSha1;
if(currentSourceSha!==expectedAssignedRaw||currentSourceBlob!==expectedAssignedBlob)throw Error('ASSIGNMENT_SOURCE_BINDING_MISMATCH');
const quality=await validateFinalQuality();
if((args.apply||args.validateFinalQuality)&&!quality.allowed){
  console.error(JSON.stringify({status:args.apply?'APPLY_BLOCKED':'QUALITY_PROOF_INVALID',reason:quality.reason,examUid,head,sourceSha256:currentSourceSha,sharedFilesWritten:false},null,2));
  process.exit(2);
}

const protoRoot=path.resolve(prototype.candidateRootAbsolute);
const protoIdentity=json(path.join(protoRoot,'archive/data/question_identity_map.json'));
const protoMetadata=json(path.join(protoRoot,'archive/data/question_metadata.json'));
const protoRuntimeBytes=fs.readFileSync(path.join(protoRoot,'archive/question-identity.js'));
const protoDbBytes=fs.readFileSync(path.join(protoRoot,'archive/db.js'));
const protoIndexRows=prototype.targetIndexRows;
const protoCatalogRows=prototype.targetCatalogRows;
if(!Array.isArray(protoIndexRows)||!Array.isArray(protoCatalogRows))throw Error('PROTOTYPE_TARGET_PROJECTIONS_MISSING');
const norm=s=>core.normalizeFile(s);
const identityBase=json(baselinePath('archive/data/question_identity_map.json'));
const metadataBase=json(baselinePath('archive/data/question_metadata.json'));
const baseDbWindow={window:{}};vm.runInNewContext(beforeBytes['archive/db.js'].toString('utf8'),baseDbWindow);
const candidateDbWindow={window:{}};vm.runInNewContext(protoDbBytes.toString('utf8'),candidateDbWindow);
const baseDb=baseDbWindow.window.mainDB,candidateDb=candidateDbWindow.window.mainDB;
if(JSON.stringify(candidateDb.exams)!==JSON.stringify(baseDb.exams.filter(e=>norm(e.file)===sourceFile)))throw Error('PROTOTYPE_DB_ROW_MISMATCH');
const idTargetBase=identityBase.records.filter(r=>norm(r.sourceArchiveFile)===sourceFile);
const metaTargetBase=metadataBase.records.filter(r=>norm(r.sourceArchiveFile)===sourceFile);
const idTargetProto=protoIdentity.records.filter(r=>norm(r.sourceArchiveFile)===sourceFile);
const metaTargetProto=protoMetadata.records.filter(r=>norm(r.sourceArchiveFile)===sourceFile);
if([idTargetBase.length,metaTargetBase.length,idTargetProto.length,metaTargetProto.length,protoIndexRows.length,protoCatalogRows.length].some(n=>n!==qCount))throw Error('TARGET_PROJECTION_DENOMINATOR_MISMATCH');
const nonTargetIdentityEqual=deep(identityBase.records.filter(r=>norm(r.sourceArchiveFile)!==sourceFile),protoIdentity.records.filter(r=>norm(r.sourceArchiveFile)!==sourceFile));
const nonTargetMetadataEqual=deep(metadataBase.records.filter(r=>norm(r.sourceArchiveFile)!==sourceFile),protoMetadata.records.filter(r=>norm(r.sourceArchiveFile)!==sourceFile));
if(!nonTargetIdentityEqual||!nonTargetMetadataEqual)throw Error('NON_TARGET_IDENTITY_OR_METADATA_CHANGED');
if(!deep(identityBase.records.filter(r=>norm(r.sourceArchiveFile)===sourceFile).map(r=>[r.questionUid,r.sourceOrdinal]),idTargetProto.map(r=>[r.questionUid,r.sourceOrdinal])))throw Error('TARGET_UID_ORDINAL_INVARIANCE_FAIL');
if(protoIdentity.identityDigest!==prototype.identityCandidateDigest)throw Error('PROTOTYPE_IDENTITY_DIGEST_MISMATCH');
const identityStable={...protoIdentity};delete identityStable.generatedAt;delete identityStable.identityDigest;
if(protoIdentity.identityDigest!==sha(Buffer.from(JSON.stringify(identityStable),'utf8')))throw Error('IDENTITY_DIGEST_INVALID');
if(protoMetadata.sourceDigests?.identityMap!==sha(Buffer.from(JSON.stringify(protoIdentity,null,2)+'\n','utf8')))throw Error('METADATA_IDENTITY_DIGEST_BINDING_MISMATCH');
const metadataStable={...protoMetadata};delete metadataStable.digest;
if(protoMetadata.digest!==sha(Buffer.from(JSON.stringify(metadataStable),'utf8')))throw Error('METADATA_DIGEST_INVALID');
if(protoMetadata.sourceDigests?.completeClassification!==metadataBase.sourceDigests?.completeClassification)throw Error('CLASSIFICATION_DIGEST_MUST_BE_INHERITED');
if(protoMetadata.records.some(r=>norm(r.sourceArchiveFile)===sourceFile&&(r.metadataStatus!=='registration_pending_semantic_review'||r.reviewStatus!=='review_required'||r.tagStatus!=='review_required'||r.tagConfidence!=='review_required'||(r.approvalEvidence||[]).length!==0)))throw Error('TARGET_PENDING_REVIEW_GUARD_FAIL');
const protoIdentityFingerprintByUid=new Map(protoIdentity.records.filter(r=>norm(r.sourceArchiveFile)===sourceFile).map(r=>[r.questionUid,r.sourceFingerprint]));
if(protoMetadata.records.filter(r=>norm(r.sourceArchiveFile)===sourceFile).some(r=>protoIdentityFingerprintByUid.get(r.questionUid)!==r.sourceFingerprint))throw Error('IDENTITY_METADATA_FINGERPRINT_PARITY_FAIL');
const automaticTarget=protoCatalogRows.filter(r=>r.automatic).length;
if(automaticTarget!==0||automaticTarget>Number(assignment.currentAutomaticCount||0))throw Error('NO_PROMOTION_GUARD_FAIL:'+automaticTarget);
if(protoCatalogRows.some(r=>r.sourceStatus!=='VERIFIED'))throw Error('TARGET_CATALOG_SOURCE_STATUS_NOT_VERIFIED');
if(protoCatalogRows.some(r=>r.metadataAssignmentEvidence?.evidenceDigest!==metadataBase.sourceDigests?.completeClassification))throw Error('COMPLETE_CLASSIFICATION_DIGEST_NOT_INHERITED_BY_TARGET_CATALOG');
const targetUidByOrdinal=new Map(idTargetProto.map(r=>[Number(r.sourceOrdinal),r.questionUid]));
for(const rows of [protoIndexRows,protoCatalogRows]){const ords=rows.map(r=>Number(r.sourceOrdinal)).sort((a,b)=>a-b);if(!deep(ords,Array.from({length:qCount},(_,i)=>i+1)))throw Error('TARGET_PROJECTION_ORDINAL_COVERAGE_FAIL');}
for(const row of protoCatalogRows)if(targetUidByOrdinal.get(Number(row.sourceOrdinal))!==row.questionUid)throw Error('TARGET_CATALOG_UID_ORDINAL_JOIN_FAIL:'+row.sourceOrdinal);

const outputs=new Map();
outputs.set('archive/db.js',beforeBytes['archive/db.js']);
outputs.set('archive/data/question_identity_map.json',Buffer.from(JSON.stringify(protoIdentity,null,2)+'\n'));
outputs.set('archive/data/question_metadata.json',Buffer.from(JSON.stringify(protoMetadata,null,2)+'\n'));
outputs.set('archive/question-identity.js',protoRuntimeBytes);
const baseIndexWindow={};vm.runInNewContext(beforeBytes['archive/question-index.js'].toString('utf8'),{window:baseIndexWindow});
const baseIndex=baseIndexWindow.questionIndex;
const targetIndexBase=baseIndex.filter(r=>norm(r.sourceFile)===sourceFile);
if(targetIndexBase.length!==qCount)throw Error('BASELINE_TARGET_INDEX_DENOMINATOR_MISMATCH');
assertIndexReportInvariant(targetIndexBase,protoIndexRows);
const indexByOrdinal=new Map(protoIndexRows.map(r=>[Number(r.sourceOrdinal),r]));
if(indexByOrdinal.size!==qCount)throw Error('CANDIDATE_INDEX_ORDINAL_DUPLICATE');
const mergedIndex=baseIndex.map(r=>norm(r.sourceFile)===sourceFile?indexByOrdinal.get(Number(r.sourceOrdinal)):r);
if(mergedIndex.some(r=>!r))throw Error('MERGED_INDEX_TARGET_ROW_MISSING');
const indexText=beforeBytes['archive/question-index.js'].toString('utf8');
const indexStart=indexText.indexOf('window.questionIndex=');
const indexMarker='window.questionIndex=';
if(indexStart<0)throw Error('QUESTION_INDEX_ASSIGNMENT_LOCUS_MISSING');
const indexValueStart=indexStart+indexMarker.length,indexValueEnd=findJsonContainerEnd(indexText,indexValueStart);
let indexTerminator=indexValueEnd;while(/\s/.test(indexText[indexTerminator]||''))indexTerminator++;
if(indexText[indexTerminator]!==';')throw Error('QUESTION_INDEX_JSON_ASSIGNMENT_TERMINATOR_MISSING');
const indexOutput=Buffer.from(indexText.slice(0,indexValueStart)+JSON.stringify(mergedIndex)+indexText.slice(indexValueEnd),'utf8');
outputs.set('archive/question-index.js',indexOutput);
const generatedJsSyntax=[];
for(const [rel,bytes] of outputs){if(!rel.endsWith('.js'))continue;new vm.Script(bytes.toString('utf8'),{filename:rel});generatedJsSyntax.push({path:rel,status:'PASS'});}
const emittedIndexWindow={window:{}};vm.runInNewContext(indexOutput.toString('utf8'),emittedIndexWindow,{timeout:3000});
if(!deep(emittedIndexWindow.window.questionIndex,mergedIndex))throw Error('SERIALIZED_INDEX_RUNTIME_READBACK_MISMATCH');
outputs.set('archive/question-index-report.md',beforeBytes['archive/question-index-report.md']);
outputs.set('archive/question-index-audit.md',beforeBytes['archive/question-index-audit.md']);

const packedBase=json(baselinePath('archive/data/archive2-catalog.json'));
const catalogBase=core.decodeCatalog(packedBase);
const catTargetBase=catalogBase.records.filter(r=>norm(r.sourceFile)===sourceFile);
if(catTargetBase.length!==qCount)throw Error('BASELINE_TARGET_CATALOG_DENOMINATOR_MISMATCH');
const candidateCatalogRowsByOrdinal=new Map(protoCatalogRows.map(r=>[Number(r.sourceOrdinal),r]));
if(candidateCatalogRowsByOrdinal.size!==qCount)throw Error('CANDIDATE_CATALOG_ORDINAL_DUPLICATE');
const mergedCatalogRecords=catalogBase.records.map(r=>norm(r.sourceFile)===sourceFile?candidateCatalogRowsByOrdinal.get(Number(r.sourceOrdinal)):r);
if(mergedCatalogRecords.some(r=>!r))throw Error('MERGED_CATALOG_TARGET_ROW_MISSING');
const examsBase=catalogBase.exams;
const targetExamCandidate=core.decodeCatalog(JSON.parse(fs.readFileSync(path.join(protoRoot,'archive/data/archive2-catalog.json'),'utf8'))).exams.filter(e=>norm(e.file)===sourceFile);
if(targetExamCandidate.length!==1)throw Error('PROTOTYPE_TARGET_EXAM_CATALOG_ROW_REQUIRED');
const examsNext=examsBase.map(e=>norm(e.file)===sourceFile?targetExamCandidate[0]:e);
const sourceHashesNext=catalogBase.sourceHashes.map(([file,old])=>file===sourceFile?[file,sha(currentSourceBytes)]:[file,old]);
if(sourceHashesNext.filter(([file])=>file===sourceFile).length!==1)throw Error('CATALOG_SOURCE_HASH_TARGET_MISSING_OR_DUPLICATE');
const health=computeHealth(core,catalogBase.taxonomy,examsNext,mergedCatalogRecords,rootPath('archive/data/archive2-canonical-projection-policy.json'));
const catalogNext={...catalogBase,indexVersion:'',identityDigest:protoIdentity.identityDigest,sourceHashes:sourceHashesNext,exams:examsNext,records:mergedCatalogRecords,health};
const indexVersion=sha(Buffer.from(JSON.stringify([core.VERSION,sourceHashesNext,sha(outputs.get('archive/data/question_metadata.json')),protoIdentity.identityDigest,catalogNext.taxonomy,examsNext,mergedCatalogRecords]),'utf8'));
catalogNext.indexVersion=indexVersion;
const packedNext=packCatalog(catalogNext,packedBase,sourceFile);
const packedText=JSON.stringify(packedNext)+'\n';
outputs.set('archive/data/archive2-catalog.json',Buffer.from(packedText,'utf8'));
const manifest=await makeManifest(core,baselineRoot,packedText,indexVersion);
outputs.set('archive/data/archive2-canonical-input-manifest.json',Buffer.from(JSON.stringify(manifest)+'\n','utf8'));

const candidateDir=path.resolve(root,args['output-dir']);
const relCandidate=path.relative(root,candidateDir),relCandidatePosix=relCandidate.replace(/\\/g,'/');
if(relCandidate.startsWith('..')||path.isAbsolute(relCandidate)||!relCandidatePosix.startsWith('.tmp/archive/m3-codex-20261007/'))throw Error('OUTPUT_MUST_BE_OWNED_TEMP_EVIDENCE:'+relCandidate);
for(const [rel,bytes] of outputs){const dst=repoPath(candidateDir,rel);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.writeFileSync(dst,bytes);}
const mergedPacked=json(path.join(candidateDir,'archive/data/archive2-catalog.json'));
const mergedDecoded=core.decodeCatalog(mergedPacked);
const mergedNonTargetCatalog=mergedDecoded.records.filter(r=>norm(r.sourceFile)!==sourceFile);
const baseNonTargetPacked=packedBase.records.filter((_,i)=>norm(catalogBase.records[i].sourceFile)!==sourceFile);
const mergedNonTargetPacked=mergedPacked.records.filter((_,i)=>norm(mergedDecoded.records[i].sourceFile)!==sourceFile);
if(!deep(mergedNonTargetCatalog,catalogBase.records.filter(r=>norm(r.sourceFile)!==sourceFile)))throw Error('NON_TARGET_CATALOG_ROW_INVARIANCE_FAIL');
if(!deep(mergedNonTargetPacked,baseNonTargetPacked))throw Error('NON_TARGET_PACKED_CATALOG_ROWS_CHANGED');
if(!deep(mergedPacked.strings.slice(0,packedBase.strings.length),packedBase.strings))throw Error('PACKED_STRING_ID_PREFIX_CHANGED');
if(!deep(mergedDecoded.records.filter(r=>norm(r.sourceFile)===sourceFile),protoCatalogRows))throw Error('TARGET_CATALOG_PROJECTION_READBACK_FAIL');
const mergedRuntimeWindow={window:{}};vm.runInNewContext(outputs.get('archive/question-identity.js').toString('utf8'),mergedRuntimeWindow);
const baselineRuntimeWindow={window:{}};vm.runInNewContext(beforeBytes['archive/question-identity.js'].toString('utf8'),baselineRuntimeWindow);
const runtimeNext=mergedRuntimeWindow.window.questionIdentity,runtimeBase=baselineRuntimeWindow.window.questionIdentity;
if(!deep(runtimeNext.files,runtimeBase.files)||Object.entries(runtimeBase.byUid).some(([uid,t])=>!deep(runtimeNext.byUid[uid],t)))throw Error('RUNTIME_FILE_INDEX_OR_TUPLE_INVARIANCE_FAIL');
if(Object.keys(runtimeNext.byUid).length!==Object.keys(runtimeBase.byUid).length||!deep(runtimeNext.fileIndexByPath,runtimeBase.fileIndexByPath)||!deep(runtimeNext.byFile,runtimeBase.byFile))throw Error('RUNTIME_LOOKUP_MAP_INVARIANCE_FAIL');
if(runtimeNext.identityDigest!==protoIdentity.identityDigest)throw Error('RUNTIME_IDENTITY_DIGEST_MISMATCH');
const runtimeStable={...runtimeNext};delete runtimeStable.runtimeDigest;if(runtimeNext.runtimeDigest!==sha(Buffer.from(JSON.stringify(runtimeStable),'utf8')))throw Error('RUNTIME_DIGEST_INVALID');
const targetIndexReadback=mergedIndex.filter(r=>norm(r.sourceFile)===sourceFile);
if(!deep(targetIndexReadback,protoIndexRows))throw Error('TARGET_INDEX_PROJECTION_READBACK_FAIL');
const validatorSupport=['archive/archive2-core.js','archive/tools/intelligence/question-identity-contract.mjs','archive/tools/target-registration-contract.mjs','tests/archive-question-identity-contract.test.mjs','tests/archive-question-identity-runtime.test.mjs','tests/target-registration-contract.test.mjs'];
for(const rel of validatorSupport){const dst=repoPath(candidateDir,rel);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(rootPath(rel),dst);}
const collisionPath='archive/_generated/intelligence/phase0/qkey-collision-review.json';if(fs.existsSync(rootPath(collisionPath))){const dst=repoPath(candidateDir,collisionPath);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(rootPath(collisionPath),dst);}
const testOut=execFileSync(process.execPath,['--test',...['tests/archive-question-identity-contract.test.mjs','tests/archive-question-identity-runtime.test.mjs','tests/target-registration-contract.test.mjs'].map(rel=>path.join(candidateDir,rel))],{cwd:candidateDir,encoding:'utf8',maxBuffer:64*1024*1024});
const receipt={schemaVersion:'EXISTING_TARGET_REGISTRATION_FULL_NINE_MERGE_V1',status:args.apply?'APPLIED_AND_VALIDATED':args.validateFinalQuality?'FINAL_QUALITY_AND_MERGE_VALIDATED_APPLY_NOT_REQUESTED':'DRY_RUN_VALIDATED_APPLY_DISABLED',examUid,head,baselineHead,source:{path:sourceRel,rawSha256:currentSourceSha,rawBlobSha1:currentSourceBlob,provisionalNotFinalR3:!quality.allowed},questionCount:qCount,outputDirectory:candidateDir,changedFiles:[...outputs].map(([relativePath,bytes])=>({relativePath,beforeSha256:sha(beforeBytes[relativePath]),afterSha256:sha(bytes),changed:sha(beforeBytes[relativePath])!==sha(bytes)})),targetProjection:{identity:protoIdentity.records.filter(r=>norm(r.sourceArchiveFile)===sourceFile).length,metadata:protoMetadata.records.filter(r=>norm(r.sourceArchiveFile)===sourceFile).length,index:targetIndexReadback.length,catalog:mergedDecoded.records.filter(r=>norm(r.sourceFile)===sourceFile).length,sourceStatusCounts:countBy(protoCatalogRows,r=>r.sourceStatus),automaticCount:automaticTarget,pendingReviewCount:protoMetadata.records.filter(r=>norm(r.sourceArchiveFile)===sourceFile&&r.metadataStatus==='registration_pending_semantic_review').length},preservation:{allNonTargetIdentityRows:nonTargetIdentityEqual,allNonTargetMetadataRows:nonTargetMetadataEqual,allNonTargetIndexRows:deep(mergedIndex.filter(r=>norm(r.sourceFile)!==sourceFile),baseIndex.filter(r=>norm(r.sourceFile)!==sourceFile)),allNonTargetCatalogObjects:deep(mergedNonTargetCatalog,catalogBase.records.filter(r=>norm(r.sourceFile)!==sourceFile)),allNonTargetPackedRows:deep(mergedNonTargetPacked,baseNonTargetPacked),existingPackedStringIdsPreserved:deep(mergedPacked.strings.slice(0,packedBase.strings.length),packedBase.strings),runtimeFilesAndAllTuplesPreserved:true,dbBytesPreserved:sha(outputs.get('archive/db.js'))===sha(beforeBytes['archive/db.js']),indexReportAndAuditBytesPreserved:true,sourceAssetsUnchanged:verifyAssets()},pendingReview:{allTargetRowsPending:protoMetadata.records.filter(r=>norm(r.sourceArchiveFile)===sourceFile).every(r=>r.metadataStatus==='registration_pending_semantic_review'&&r.reviewStatus==='review_required'),priorApprovalHistoryPreserved:prototype.pendingReviewTransition.priorApprovalSnapshotsPreserved,completeClassificationDigestInherited:protoMetadata.sourceDigests.completeClassification===metadataBase.sourceDigests.completeClassification,automaticCount:automaticTarget},catalog:{identityDigest:protoIdentity.identityDigest,indexVersion,projectionVersion:manifest.projectionVersion,targetProjectionMatchesPrototype:true,globalFullCatalogCheckDisposition:'NOT_RUN_KNOWN_NON_TARGET_DRIFT_OUT_OF_SCOPE'},qualityBindings:quality,apply:{requested:Boolean(args.apply),allowed:Boolean(args.apply&&quality.allowed),proofValidated:quality.allowed,reason:args.apply?(quality.reason||null):args.validateFinalQuality?'VALIDATED_ONLY_NO_SHARED_WRITE':quality.reason||null,sharedFilesWritten:false,rollback:{backupCreated:false,restorePerformed:false}},validators:{generatedJavaScriptSyntax:generatedJsSyntax,targetIndexScriptReadback:'PASS',targetProjectionReadback:'PASS',nonTargetAndRuntimeInvariance:'PASS',metadataAndIdentityDigest:'PASS',packedDictionaryAppendOnly:'PASS',identityRegistrationTests:'PASS',identityRegistrationTestOutput:testOut},outputHashes:Object.fromEntries([...outputs].map(([rel,b])=>[rel,sha(b)]))};
if(!Object.values(receipt.preservation).every(v=>typeof v!=='boolean'||v))throw Error('MERGED_TARGET_PRESERVATION_GUARD_FAIL');
const receiptPath=path.join(candidateDir,'registration-update.merge.receipt.json');fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n');
if(args.apply)applyAtomically(root,outputs,assignment,receipt,candidateDir);
console.log(JSON.stringify({status:args.apply?'APPLIED_AND_VALIDATED':args.validateFinalQuality?'FINAL_QUALITY_AND_MERGE_VALIDATED_APPLY_NOT_REQUESTED':'DRY_RUN_VALIDATED_APPLY_DISABLED',examUid,head,questionCount:qCount,automaticCount:automaticTarget,outputDirectory:candidateDir,receiptPath,receiptSha256:sha(fs.readFileSync(receiptPath)),changedFiles:receipt.changedFiles.filter(x=>x.changed).map(x=>x.relativePath),qualityBindings:quality,sharedFilesWritten:Boolean(args.apply)},null,2));

function countBy(rows,key){return rows.reduce((o,r)=>{const k=key(r);o[k]=(o[k]||0)+1;return o;},{});}
function computeHealth(core,taxonomy,exams,records,policyPath){
  const policy=json(policyPath),gradeCourses=policy.gradeCourseAllowlist||[],canonicalBasicParents=[],canonicalAdvancedPaths=[];
  for(const row of taxonomy)for(const allowed of gradeCourses){if(allowed.curriculumKey!==row.curriculumKey||allowed.courseKey!==row.courseKey)continue;const withGrade={...row,grade:allowed.grade};canonicalBasicParents.push(withGrade);if(row.L3&&row.L4)canonicalAdvancedPaths.push(withGrade);}
  const uniqueBy=(rows,fields)=>[...new Map(rows.map(row=>[JSON.stringify(fields.map(field=>String(row[field]??''))),row])).values()];
  const canonicalAuthority={taxonomyVersion:core.TAXONOMY_VERSION,examGradeByFile:Object.fromEntries(exams.map(e=>[norm(e.file),e.grade])),identityByUid:Object.fromEntries(records.filter(r=>r.questionUid).map(r=>[r.questionUid,{questionUid:r.questionUid,sourceArchiveFile:r.sourceFile,sourceOrdinal:r.sourceOrdinal,status:r.identityStatus}])),gradeCourses,canonicalParents:uniqueBy(canonicalBasicParents,['grade','curriculumKey','courseKey','L1','L2']),canonicalAdvancedPaths:uniqueBy(canonicalAdvancedPaths,['grade','curriculumKey','courseKey','L1','L2','L3','L4']),assignmentsByUid:Object.fromEntries(records.filter(r=>r.assignmentEvidence).map(r=>[r.questionUid,[r.assignmentEvidence]])),advancedAssignmentsByUid:{}};
  const health={};for(const record of records){const result=core.eligibility(record,{canonicalAuthority});for(const reason of result.reasons)health[reason]=(health[reason]||0)+1;if(result.ok)health.automatic=(health.automatic||0)+1;}
  health.exams=exams.length;health.questions=records.length;return health;
}
function packCatalog(catalog,base,sourceFile){
  const columns=[...base.columns],columnSet=new Set(columns);for(const row of catalog.records)for(const key of Object.keys(row))if(!columnSet.has(key)){columnSet.add(key);columns.push(key);}
  if(columns.length!==base.columns.length)throw Error('TARGET_NEW_CATALOG_COLUMNS_WOULD_RESHAPE_NON_TARGET_PACKED_ROWS');
  const strings=[...base.strings],stringIds=new Map();for(let i=0;i<strings.length;i++)if(!stringIds.has(strings[i]))stringIds.set(strings[i],i);
  const encode=v=>{if(typeof v!=='string')return v??null;if(!stringIds.has(v)){stringIds.set(v,strings.length);strings.push(v);}return [stringIds.get(v)];};
  const rows=catalog.records;
  const packedRows=rows.map((record,i)=>norm(record.sourceFile)!==sourceFile?base.records[i]:columns.map(column=>encode(record[column])));
  return {...catalog,encoding:'column-dictionary-v1',columns,strings,records:packedRows};
}
async function makeManifest(core,baseRoot,packedCatalogText,indexVersion){
  const archiveDir=baselinePath('archive');
  const runtimePacks=core.Canonical.RUNTIME_INPUT_PATHS.map(rel=>json(path.join(archiveDir,rel)));
  const inputs=core.Canonical.manifestInputPathsFromRuntimePacks(runtimePacks,rel=>{const p=path.join(archiveDir,rel);return fs.existsSync(p)&&fs.statSync(p).isFile();});
  const files=inputs.map(rel=>{let bytes;if(rel==='data/archive2-catalog.json')bytes=Buffer.from(packedCatalogText);else bytes=fs.readFileSync(path.join(archiveDir,rel));return {path:rel,sha256:sha(bytes)};});
  return {schemaVersion:'archive2-canonical-input-manifest-v1',resolverVersion:core.Canonical.RESOLVER_VERSION,generatedFromCatalogIndexVersion:indexVersion,projectionVersion:await core.Canonical.computeProjectionVersion(files,core.Canonical.RESOLVER_VERSION),files};
}
function findJsonContainerEnd(source,start){
  let inString=false,escaped=false,depth=0,started=false;
  for(let i=start;i<source.length;i++){
    const ch=source[i];
    if(inString){if(escaped)escaped=false;else if(ch==='\\')escaped=true;else if(ch==='"')inString=false;continue;}
    if(ch==='"'){inString=true;continue;}
    if(ch==='['||ch==='{'){depth++;started=true;continue;}
    if(ch===']'||ch==='}'){if(!started||depth<=0)throw Error('QUESTION_INDEX_JSON_NESTING_INVALID');depth--;if(depth===0)return i+1;}
  }
  throw Error('QUESTION_INDEX_JSON_ASSIGNMENT_UNTERMINATED');
}
function assertIndexReportInvariant(before,after){
  const normTags=r=>Array.isArray(r.tags)&&r.tags.length>0;
  const visuals=r=>{const t=String(r.contentText||'');return {image:Boolean(r.hasImage),solutionImage:Boolean(r.hasSolutionImage),img:(t.match(/<img\b/gi)||[]).length,svg:(t.match(/<svg\b/gi)||[]).length,table:(t.match(/<table\b/gi)||[]).length};};
  const scalar=['qKey','id','level','standardUnit','standardUnitKey','standardCourse'];
  for(let i=0;i<before.length;i++){const a=before[i],b=after.find(r=>Number(r.sourceOrdinal)===Number(a.sourceOrdinal));if(!b)throw Error('INDEX_REPORT_TARGET_ORDINAL_MISSING:'+a.sourceOrdinal);for(const k of scalar)if(!deep(a[k],b[k]))throw Error('INDEX_REPORT_AGGREGATE_CHANGE:'+a.sourceOrdinal+':'+k);if(normTags(a)!==normTags(b))throw Error('INDEX_REPORT_AGGREGATE_CHANGE:'+a.sourceOrdinal+':tagsPresence');if(!deep(visuals(a),visuals(b)))throw Error('INDEX_REPORT_AGGREGATE_CHANGE:'+a.sourceOrdinal+':visualTotals');}
}
function verifyAssets(){for(const asset of assignment.assetBaseline){const p=rootPath('archive/'+asset.ref);if(!fs.existsSync(p)||sha(fs.readFileSync(p))!==asset.sha256)return false;}return true;}
async function validateFinalQuality(){
  if(!args.apply&&!args.validateFinalQuality)return {allowed:false,reason:'DRY_RUN_ONLY',proofPath:args['quality-proof']||null};
  if(!args['quality-proof'])return {allowed:false,reason:'FINAL_R1_R2_R3_PROOF_REQUIRED'};
  const proof=json(rootPath(args['quality-proof']));
  if(proof.schemaVersion==='EXISTING_TARGET_REGISTRATION_FINAL_QUALITY_BINDING_V2')return await validateCanonicalV2QualityProof(proof);
  if(proof.schemaVersion!=='EXISTING_TARGET_REGISTRATION_FINAL_QUALITY_BINDING_V1'||proof.examUid!==examUid)return {allowed:false,reason:'FINAL_QUALITY_PROOF_SCHEMA_OR_UID_MISMATCH'};
  const files={};for(const stage of ['R1','R2','R3']){const rel=proof.evidence?.[stage]?.relativePath;if(typeof rel!=='string')return {allowed:false,reason:'FINAL_QUALITY_EVIDENCE_PATH_MISSING:'+stage};const p=rootPath(rel),bytes=fs.readFileSync(p),expected=proof.evidence[stage].sha256;if(sha(bytes)!==expected)return {allowed:false,reason:'FINAL_QUALITY_EVIDENCE_SHA_MISMATCH:'+stage};files[stage]=json(p);if(files[stage].examUid!==examUid)return {allowed:false,reason:'FINAL_QUALITY_EVIDENCE_UID_MISMATCH:'+stage};}
  const final=proof.finalSource||{},raw=currentSourceSha,rawBlob=currentSourceBlob,gitBlob=execFileSync('git',['-C',root,'hash-object','--path='+sourceRel,rootPath(sourceRel)],{encoding:'utf8'}).trim();
  if(final.productionRelativePath!==sourceRel||final.artifactRawSha256!==raw||final.validatorRawBufferBlobSha1!==rawBlob||final.gitCleanFilterBlobSha1!==gitBlob)return {allowed:false,reason:'FINAL_SOURCE_SHA_BINDING_MISMATCH'};
  const r1=files.R1,r2=files.R2,r3=files.R3;
  if(r1.artifactRawSha256!==raw||r1.validatorRawBufferBlobSha1!==rawBlob||r1.gitCleanFilterBlobSha1!==gitBlob||Number(r1.denominator)!==qCount||!Array.isArray(r1.rows)||r1.rows.length!==qCount||r1.rows.some(r=>!String(r.verdict||'').startsWith('PASS')))return {allowed:false,reason:'R1_FINAL_BINDING_OR_VERDICT_INVALID'};
  const expectedQids=Array.from({length:qCount},(_,i)=>i+1),qidCoverage=rows=>Array.isArray(rows)&&deep([...rows].map(r=>Number(r.qid)).sort((a,b)=>a-b),expectedQids);
  if(!qidCoverage(r1.rows))return {allowed:false,reason:'R1_QID_COVERAGE_INVALID'};
  if(r2.status!=='R2_VERIFIED'||r2.rawArtifactSha256!==raw||r2.validatorRawBufferBlobSha1!==rawBlob||r2.gitCleanFilterBlobSha1!==gitBlob||!Array.isArray(r2.rows)||r2.rows.length!==qCount||!qidCoverage(r2.rows)||r2.rows.some(r=>!['MATCH','PASS'].includes(r.verdict)))return {allowed:false,reason:'R2_FINAL_BINDING_OR_VERDICT_INVALID'};
  const staticReview=r3.staticReview||{};
  if(r3.status!=='R3_RELEASE_READY'||r3.artifactRawSha256!==raw||r3.validatorRawBufferBlobSha1!==rawBlob||r3.gitCleanFilterBlobSha1!==gitBlob||Number(r3.denominator)!==qCount||r3.releaseIntegrity!==true||staticReview.fullQidStructuralScan!==true||staticReview.lastQidIncluded!==true||staticReview.jsParseReviewed!==true||staticReview.requiredMetaDifficultyFieldsReviewed!==true||staticReview.allActualAssetRefsReviewed!==true)return {allowed:false,reason:'R3_FINAL_BINDING_OR_STATIC_INTEGRITY_INVALID'};
  for(const stage of ['R1','R2']){const rel=r3.upstreamBindings?.[stage]?.evidence?.path,expected=r3.upstreamBindings?.[stage]?.evidence?.sha256;if(typeof rel!=='string'||!expected)return {allowed:false,reason:'R3_UPSTREAM_BINDING_MISSING:'+stage};if(sha(fs.readFileSync(rootPath(rel)))!==expected||expected!==proof.evidence[stage].sha256)return {allowed:false,reason:'R3_UPSTREAM_BINDING_MISMATCH:'+stage};}
  if(!verifyAssets())return {allowed:false,reason:'RELEASE_ASSET_SHA_MISMATCH'};
  return {allowed:true,reason:null,proofPath:path.resolve(root,args['quality-proof']),proofSha256:sha(fs.readFileSync(rootPath(args['quality-proof']))),sourceRawSha256:raw,sourceBlobSha1:rawBlob,cleanFilterBlobSha1:gitBlob};
}
async function validateCanonicalV2QualityProof(proof){
  try{
    const blocked=reason=>{throw Error(reason);};
    const refPath=ref=>{
      if(!ref||typeof ref.path!=='string'||!ref.path.trim()||!/^[a-f0-9]{64}$/i.test(String(ref.sha256||'')))blocked('V2_EVIDENCE_REFERENCE_REQUIRED');
      const file=rootPath(ref.path),real=fs.realpathSync(file),relative=path.relative(root,real);
      if(relative.startsWith('..')||path.isAbsolute(relative))blocked('V2_EVIDENCE_PATH_OUTSIDE_ROOT');
      const bytes=fs.readFileSync(real);if(sha(bytes)!==String(ref.sha256).toLowerCase())blocked('V2_EVIDENCE_SHA_MISMATCH:'+ref.path);
      return {file:real,bytes,relativePath:relative.replace(/\\/g,'/')};
    };
    const jsonRef=(ref,label)=>{const binding=refPath(ref);let value;try{value=JSON.parse(binding.bytes.toString('utf8').replace(/^\uFEFF/,''));}catch{blocked('V2_EVIDENCE_JSON_INVALID:'+label);}return {...binding,value};};
    const samePhysicalRef=(a,b,label)=>{
      const left=refPath(a),right=refPath(b);
      if(left.relativePath.toLocaleLowerCase()!==right.relativePath.toLocaleLowerCase()||String(a.sha256).toLowerCase()!==String(b.sha256).toLowerCase())blocked('V2_PHYSICAL_REF_MISMATCH:'+label);
      return left;
    };
    const normalizeSha256=value=>String(value||'').trim().replace(/^sha256:/i,'').toLowerCase();
    const exactQids=Array.from({length:qCount},(_,i)=>i+1),qidCoverage=rows=>Array.isArray(rows)&&deep([...rows].map(r=>Number(r?.qid)).sort((a,b)=>a-b),exactQids);
    const sameQids=value=>Array.isArray(value)&&deep(value.map(Number),exactQids);
    const hasNoIssues=value=>Array.isArray(value)&&value.length===0;
    if(proof.examUid!==examUid||proof.executionLine!=='CODEX'||proof.qualityContractVersion!=='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006')blocked('V2_ACTIVE_CODEX_CONTRACT_REQUIRED');
    if(proof.head!==head)blocked('V2_CURRENT_HEAD_BINDING_MISMATCH');
    if(!Array.isArray(proof.baselineRegistryBindings)||proof.baselineRegistryBindings.length!==9||!deep(proof.baselineRegistryBindings,assignment.baselineRegistryBindings))blocked('V2_CURRENT_NINE_REGISTRY_BINDING_MISMATCH');
    const ev=proof.evidence||{},r1ReviewRef=ev.R1?.review,r1ReportRef=ev.R1?.validatorReport,r2StageRef=ev.R2?.stageEvidence,r2ReportRef=ev.R2?.validatorReport,rootReceiptRef=ev.rootStatic?.receipt,rootIntakeRef=ev.rootStatic?.intake,r3ClosureRef=ev.rootStatic?.r3StaticClosure;
    for(const [ref,label] of [[r1ReviewRef,'R1.review'],[r1ReportRef,'R1.validatorReport'],[r2StageRef,'R2.stageEvidence'],[r2ReportRef,'R2.validatorReport'],[rootReceiptRef,'ROOT.static.receipt'],[rootIntakeRef,'ROOT.static.intake'],[r3ClosureRef,'R3.staticClosure']])if(!ref||typeof ref.path!=='string'||typeof ref.sha256!=='string')blocked('V2_EVIDENCE_REFERENCE_REQUIRED:'+label);
    const r1Review=jsonRef(r1ReviewRef,'R1.review'),r1Report=jsonRef(r1ReportRef,'R1.validatorReport'),r2Stage=jsonRef(r2StageRef,'R2.stageEvidence'),r2Report=jsonRef(r2ReportRef,'R2.validatorReport'),rootReceipt=jsonRef(rootReceiptRef,'ROOT.static.receipt'),rootIntake=jsonRef(rootIntakeRef,'ROOT.static.intake'),r3Closure=jsonRef(r3ClosureRef,'R3.staticClosure');
    const r1=r1Review.value,r1v=r1Report.value,r2=r2Stage.value,r2v=r2Report.value,receipt=rootReceipt.value,intake=rootIntake.value,closure=r3Closure.value;
    const v2Evidence=(e,stage)=>e?.schemaVersion==='JS_ARCHIVE_STAGE_EVIDENCE_v2'&&e.executionLine==='CODEX'&&e.qualityContractVersion==='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'&&e.stage===stage&&e.examUid===examUid;
    if(!v2Evidence(r1,'R1'))blocked('V2_R1_ACTIVE_EVIDENCE_CONTRACT_REQUIRED');
    if(!v2Evidence(r2,'R2'))blocked('V2_R2_ACTIVE_EVIDENCE_CONTRACT_REQUIRED');
    if(r1.status&&/^(?:HOLD|FAIL)(?:\b|_)/i.test(String(r1.status)))blocked('V2_R1_EVIDENCE_HOLD_OR_FAIL');
    if(r2.status&&/^(?:HOLD|FAIL)(?:\b|_)/i.test(String(r2.status)))blocked('V2_R2_EVIDENCE_HOLD_OR_FAIL');
    if(!qidCoverage(r1.rows)||['expectedQids','observedQids'].some(key=>r1.coverage?.[key]!==undefined&&!sameQids(r1.coverage[key])))blocked('V2_R1_FULL_QID_COVERAGE_REQUIRED');
    const r1HoldCount=r1.itemHoldCount??r1.coverage?.itemHoldCount,r1HoldQids=r1.itemHoldQids??r1.coverage?.itemHoldQids;
    if((r1HoldCount!==undefined&&Number(r1HoldCount)!==0)||(r1HoldQids!==undefined&&r1HoldQids!==null&&(!Array.isArray(r1HoldQids)||r1HoldQids.length!==0))||r1.rows.some(row=>/^(?:HOLD|FAIL)(?:\b|_)/i.test(String(row.verdict||''))))blocked('V2_R1_HOLD_OR_NONPASS_ROW');
    if(r1.artifactDispositions!==undefined&&(!r1.artifactDispositions||r1.artifactDispositions.artifactSha!==r1.artifactSha||!Array.isArray(r1.artifactDispositions.rows)||!qidCoverage(r1.artifactDispositions.rows)))blocked('V2_R1_CURRENT_ROW_DISPOSITIONS_REQUIRED');
    if(!qidCoverage(r2.rows)||r2.rows.some(row=>/^(?:HOLD|FAIL)(?:\b|_)/i.test(String(row.verdict||''))))blocked('V2_R2_FULL_QID_PASS_NO_HOLD_REQUIRED');
    if(closure?.status!=='STATIC_CODE_COMPLETE'||Number(closure.itemHoldCount)!==0||!Array.isArray(closure.itemHoldQids)||closure.itemHoldQids.length!==0)blocked('V2_R3_STATIC_CLOSURE_HOLD_OR_NONCOMPLETE');
    const validateRawReport=(report,stage,reviewRef,sourceArtifactSha)=>{
      if(report?.ok!==true||report?.validatorMode!==stage+'_V2'||report?.stage!==stage||report?.examUid!==examUid||report?.artifactSha!==sourceArtifactSha||report?.disposition!=='PASS'||Number(report?.denominator)!==qCount||Number(report?.rowCount)!==qCount||!hasNoIssues(report?.issues))blocked('V2_'+stage+'_RAW_VALIDATOR_REPORT_NOT_PASS');
      if(report?.common?.validatorLayer!=='COMMON_V2'||report.common.commonValid!==true||report.common.schemaVersion!=='JS_ARCHIVE_STAGE_EVIDENCE_v2'||report.common.stage!==stage||report.common.examUid!==examUid||report.common.artifactSha!==sourceArtifactSha||!deep(report.common.expectedQids,exactQids)||!deep(report.common.observedQids,exactQids)||!hasNoIssues(report.common.issues))blocked('V2_'+stage+'_COMMON_REPORT_BINDING_INVALID');
      if(report?.artifactContract?.validatorLayer!=='ARTIFACT_CONTRACT_V2'||report.artifactContract.active!==true||report.artifactContract.qualityContractVersion!=='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'||report.artifactContract.stage!==stage||Number(report.artifactContract.questionCount)!==qCount||report.artifactContract.disposition!=='PASS'||!hasNoIssues(report.artifactContract.issues))blocked('V2_'+stage+'_ARTIFACT_CONTRACT_NOT_PASS');
      samePhysicalRef({path:report.common.evidenceRef,sha256:reviewRef.sha256},reviewRef,stage+'_REPORT_EVIDENCE_REF');
    };
    const proofSource=proof.finalSource||{},raw=currentSourceSha,rawBlob=currentSourceBlob;
    if(proofSource.productionRelativePath!==sourceRel||normalizeSha256(proofSource.artifactRawSha256)!==raw||String(proofSource.artifactSha||'').toLowerCase()!==rawBlob)blocked('V2_FINAL_SOURCE_RAW_OR_BUFFER_BLOB_SHA_MISMATCH');
    if(r1.artifactSha!==rawBlob||normalizeSha256(r1.artifactRawSha256)!==raw||(r1.productionRelativePath!==undefined&&r1.productionRelativePath!==sourceRel))blocked('V2_R1_FINAL_ARTIFACT_BINDING_MISMATCH');
    validateRawReport(r1v,'R1',r1ReviewRef,rawBlob);
    if(!v2Evidence(r2,'R2')||r2.artifactSha!==rawBlob)blocked('V2_R2_FINAL_ARTIFACT_BINDING_MISMATCH');
    const r2SourceRaw=r2.sourceRawSha256??r2.sourceSha256;if(r2SourceRaw!==undefined&&normalizeSha256(r2SourceRaw)!==raw)blocked('V2_R2_SOURCE_RAW_SHA_MISMATCH');
    validateRawReport(r2v,'R2',r2StageRef,rawBlob);
    const sourceContext={window:{},console:{log(){},warn(){},error(){}}};vm.runInNewContext(currentSourceBytes.toString('utf8'),sourceContext,{filename:sourceRel,timeout:3000});
    const currentBank=sourceContext.window.questions||sourceContext.window.questionBank;if(!Array.isArray(currentBank)||currentBank.length!==qCount||!deep(currentBank.map(q=>Number(q?.id)),exactQids))blocked('V2_CURRENT_PRODUCTION_QUESTION_BANK_INVALID');
    const r1Validator=await import(pathToFileURL(rootPath('archive/tools/archive-stage-validator-r1-v2.mjs')).href);
    const r2Validator=await import(pathToFileURL(rootPath('archive/tools/archive-stage-validator-r2-v2.mjs')).href);
    const artifactValidator=await import(pathToFileURL(rootPath('archive/tools/archive-stage-validator-artifact-v2.mjs')).href);
    const freshR1=r1Validator.validateR1Evidence({examUid,artifactSha:rawBlob,actualArtifactSha:rawBlob,evidenceRef:r1Review.relativePath,evidence:r1,expectedQids:exactQids});
    const freshR2=r2Validator.validateR2Evidence({examUid,artifactSha:rawBlob,actualArtifactSha:rawBlob,evidenceRef:r2Stage.relativePath,evidence:r2,expectedQids:exactQids});
    const freshR1Artifact=artifactValidator.validateArtifactContract({stage:'R1',evidence:r1,questions:currentBank,repoRoot:root});
    const freshR2Artifact=artifactValidator.validateArtifactContract({stage:'R2',evidence:r2,questions:currentBank,repoRoot:root});
    const reportMatchesFresh=(report,fresh,artifact)=>report.ok===fresh.ok&&fresh.ok===true&&report.validatorMode===fresh.validatorMode&&report.disposition===fresh.disposition&&Number(report.denominator)===fresh.denominator&&Number(report.rowCount)===fresh.rowCount&&report.artifactSha===fresh.artifactSha&&deep(report.issues,fresh.issues)&&report.artifactContract?.active===artifact.active&&artifact.active===true&&report.artifactContract?.disposition===artifact.disposition&&artifact.disposition==='PASS'&&deep(report.artifactContract?.issues,artifact.issues);
    if(!reportMatchesFresh(r1v,freshR1,freshR1Artifact))blocked('V2_R1_RAW_REPORT_DOES_NOT_REVALIDATE_AGAINST_CURRENT_SOURCE');
    if(!reportMatchesFresh(r2v,freshR2,freshR2Artifact))blocked('V2_R2_RAW_REPORT_DOES_NOT_REVALIDATE_AGAINST_CURRENT_SOURCE');
    if(receipt?.schemaVersion!=='JS_ARCHIVE_CODEX_ROOT_WAIVED_STATIC_RECEIPT_V1'||receipt.status!=='STATIC_CODE_COMPLETE'||receipt.executionLine!=='CODEX'||receipt.qualityContractVersion!=='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'||receipt.completionBasis!=='ROOT_DIRECTED_STATIC_COMPLETE'||!['NOT_RUN_ROOT_WAIVER','PARTIAL_RENDER_ROOT_WAIVER'].includes(receipt.renderStatus)||receipt.examUid!==examUid||receipt.productionPath!==sourceRel||receipt.artifactSha!==rawBlob||normalizeSha256(receipt.artifactRawSha256)!==raw||!sameQids(receipt.qids))blocked('V2_ROOT_STATIC_RECEIPT_CONTRACT_OR_ARTIFACT_INVALID');
    if(closure?.schemaVersion!=='JS_ARCHIVE_CODEX_R3_STATIC_CLOSURE_V1'||closure.status!=='STATIC_CODE_COMPLETE'||closure.executionLine!=='CODEX'||closure.qualityContractVersion!=='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'||closure.examUid!==examUid||closure.runId!==receipt.runId||closure.artifactSha!==rawBlob||normalizeSha256(closure.artifactRawSha256)!==raw||!sameQids(closure.qids)||closure.reviewerIdentity?.role!=='archive_r3'||closure.structureIntegrityStatus!=='PASS'||closure.jsIntegrityStatus!=='PASS'||closure.assetIntegrityStatus!=='PASS'||closure.changedOpenDependencyReviewStatus!=='PASS'||Number(closure.itemHoldCount)!==0||!Array.isArray(closure.itemHoldQids)||closure.itemHoldQids.length!==0)blocked('V2_R3_STATIC_CLOSURE_HOLD_OR_BINDING_INVALID');
    if(!deep(receipt.r1Validation,r1ReportRef)||!deep(receipt.r2Validation,r2ReportRef)||!deep(receipt.r3StaticClosure,r3ClosureRef))blocked('V2_ROOT_RECEIPT_EVIDENCE_BINDINGS_MISMATCH');
    for(const stage of ['R1','R2']){
      const reportRef=stage==='R1'?r1ReportRef:r2ReportRef,up=closure.upstreamBindings?.[stage];
      if(!up||!deep(up.validatorReport,reportRef))blocked('V2_R3_UPSTREAM_BINDING_MISMATCH:'+stage);
    }
    const loadedRef=receipt.loadedJs;if(!loadedRef||normalizeSha256(loadedRef.sha256)!==raw)blocked('V2_ROOT_STATIC_LOADED_JS_BINDING_INVALID');
    const loaded=refPath(loadedRef);if(!loaded.bytes.equals(currentSourceBytes)||blobSha1(loaded.bytes)!==receipt.artifactSha)blocked('V2_ROOT_STATIC_LOADED_JS_BYTES_MISMATCH');
    if(!['static','STATIC'].includes(intake.phase)||intake.ok!==true||intake.disposition!=='PASS'||!hasNoIssues(intake.issues)||intake.receiptSha256!==sha(rootReceipt.bytes)||!['NOT_RUN_ROOT_WAIVER','PARTIAL_RENDER_ROOT_WAIVER'].includes(intake.renderStatus)||intake.completionBasis!=='ROOT_DIRECTED_STATIC_COMPLETE')blocked('V2_ACTUAL_ROOT_STATIC_INTAKE_NOT_PASS');
    const intakeReceiptPath=canonicalPhysicalPath(intake.receiptPath),actualReceiptPath=rootReceipt.relativePath.toLocaleLowerCase();if(intakeReceiptPath!==actualReceiptPath)blocked('V2_STATIC_INTAKE_RECEIPT_PATH_MISMATCH');
    const receiptArg=rootReceipt.relativePath.split('/').join(path.sep);
    const officialOutput=execFileSync(process.execPath,[rootPath('archive/tools/archive-codex-root-waiver-intake.mjs'),'--phase','static','--root',root,'--receipt',receiptArg],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
    const officialIntake=JSON.parse(officialOutput);
    if(officialIntake.ok!==true||officialIntake.disposition!=='PASS'||officialIntake.phase!=='static'||officialIntake.receiptSha256!==sha(rootReceipt.bytes)||officialIntake.completionBasis!=='ROOT_DIRECTED_STATIC_COMPLETE'||officialIntake.receiptPath.toLocaleLowerCase()!==actualReceiptPath)blocked('V2_CANONICAL_ROOT_STATIC_INTAKE_REVALIDATION_FAILED');
    const proofBytes=fs.readFileSync(rootPath(args['quality-proof']));
    return {allowed:true,contract:'JS_ARCHIVE_QUALITY_CONTRACT_V2',evidenceMode:'CANONICAL_V2_RAW_REPORTS_AND_ROOT_STATIC_INTAKE',proofPath:path.resolve(root,args['quality-proof']),proofSha256:sha(proofBytes),sourceRawSha256:raw,sourceRawSha256Prefix:'sha256:'+raw,sourceBlobSha1:rawBlob,r1ReviewRef:{path:r1Review.relativePath,sha256:sha(r1Review.bytes)},r1ValidatorReportRef:{path:r1Report.relativePath,sha256:sha(r1Report.bytes)},r2StageEvidenceRef:{path:r2Stage.relativePath,sha256:sha(r2Stage.bytes)},r2ValidatorReportRef:{path:r2Report.relativePath,sha256:sha(r2Report.bytes)},rootStaticReceiptRef:{path:rootReceipt.relativePath,sha256:sha(rootReceipt.bytes)},rootStaticIntakeRef:{path:rootIntake.relativePath,sha256:sha(rootIntake.bytes)},r3StaticClosureRef:{path:r3Closure.relativePath,sha256:sha(r3Closure.bytes)},canonicalStaticIntakeRevalidated:true};
  }catch(error){return {allowed:false,reason:String(error?.message||error)};}
}
function canonicalPhysicalPath(refPathValue){
  const abs=rootPath(refPathValue),real=fs.realpathSync(abs),relative=path.relative(root,real);
  if(relative.startsWith('..')||path.isAbsolute(relative))throw Error('V2_INTAKE_PATH_OUTSIDE_ROOT');
  return relative.replace(/\\/g,'/').toLocaleLowerCase();
}
function applyAtomically(root,outputs,assignment,receipt,evidenceDir){
  if(path.resolve(baselineRoot)!==path.resolve(root))throw Error('APPLY_BASELINE_MUST_BE_SHARED_ROOT');
  for(const binding of assignment.baselineRegistryBindings)if(sha(fs.readFileSync(rootPath(binding.relativePath)))!==binding.sha256)throw Error('APPLY_BASELINE_CHANGED:'+binding.relativePath);
  const changes=[...outputs].filter(([rel,bytes])=>sha(fs.readFileSync(rootPath(rel)))!==sha(bytes));
  const stamp=new Date().toISOString().replace(/[:.]/g,'-'),backupDir=path.join(evidenceDir,'rollback-backups',stamp);fs.mkdirSync(backupDir,{recursive:true});
  const backup={schemaVersion:'EXISTING_TARGET_REGISTRATION_ROLLBACK_V1',head:assignment.expectedHead,examUid,files:[]};
  for(const [rel,bytes] of outputs){const before=fs.readFileSync(rootPath(rel));const pathBackup=path.join(backupDir,rel);fs.mkdirSync(path.dirname(pathBackup),{recursive:true});fs.writeFileSync(pathBackup,before);backup.files.push({relativePath:rel,backupRelativePath:path.relative(evidenceDir,pathBackup),beforeSha256:sha(before),afterSha256:sha(bytes)});}
  const backupReceipt=path.join(backupDir,'rollback.receipt.json');fs.writeFileSync(backupReceipt,JSON.stringify(backup,null,2)+'\n');
  const written=[];
  try{
    for(const [rel,bytes] of changes){if(sha(fs.readFileSync(rootPath(rel)))!==assignment.baselineRegistryBindings.find(b=>b.relativePath===rel).sha256)throw Error('APPLY_CONCURRENT_WRITE_DETECTED:'+rel);const tmp=rootPath(rel+'.registration-update.tmp');fs.writeFileSync(tmp,bytes);fs.renameSync(tmp,rootPath(rel));written.push(rel);}
    for(const [rel,bytes] of outputs)if(sha(fs.readFileSync(rootPath(rel)))!==sha(bytes))throw Error('APPLY_READBACK_MISMATCH:'+rel);
    receipt.apply={requested:true,allowed:true,sharedFilesWritten:true,backupReceipt,backupReceiptSha256:sha(fs.readFileSync(backupReceipt)),rollback:{backupCreated:true,restorePerformed:false}};
    fs.writeFileSync(path.join(evidenceDir,'registration-update.merge.receipt.json'),JSON.stringify(receipt,null,2)+'\n');
  }catch(error){
    const rollback={restored:[],conflicts:[]};for(const rel of written.reverse()){const tmp=rootPath(rel+'.registration-update.tmp');if(fs.existsSync(tmp))fs.rmSync(tmp);const current=fs.readFileSync(rootPath(rel)),expected=sha(outputs.get(rel));if(sha(current)!==expected){rollback.conflicts.push(rel);continue;}const saved=fs.readFileSync(path.join(backupDir,rel));fs.writeFileSync(rootPath(rel),saved);rollback.restored.push(rel);}
    fs.writeFileSync(path.join(backupDir,'rollback.result.json'),JSON.stringify({schemaVersion:'EXISTING_TARGET_REGISTRATION_ROLLBACK_RESULT_V1',error:String(error),...rollback},null,2)+'\n');throw error;
  }
}

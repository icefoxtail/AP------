import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const root = 'C:/Users/USER/Desktop/AP-worktrees/archive-2026-1mid-nine/AP------';
const runId = 'archive-2026-1mid-nine-20261008';
const examUid = '26_왕운중_1학기_중간_중2_기출';
const relSource = `archive/exams/original/middle/m2/1mid/${examUid}.js`;
const source = path.join(root, relSource);
const evidenceRoot = path.join(root, 'archive/analysis', runId, examUid, 'registration-technical-source9');
const assignmentPath = path.join(evidenceRoot, 'registration.assignment.json');
const rosterPath = path.join(evidenceRoot, 'inputs/locked-roster.json');
const authorityPath = path.join(evidenceRoot, 'inputs/producer-authority.json');
const r1Path = path.join(root, 'archive/analysis', runId, examUid, 'R1.evidence.final.r1_09.revision2.json');
const r1ValidationPath = path.join(root, 'archive/analysis', runId, examUid, 'R1.validator.final.r1_09.revision2.raw.json');
const promotionPath = path.join(root, 'archive/analysis', runId, examUid, 'ROOT.promotion.receipt.json');
const candidateRoot = path.join(root, '.tmp/rm9');
const sourceMount = path.join(root, '.tmp/cm9');
const indexRoot = path.join(root, '.tmp/im9');
const packagePath = path.join(root, '.tmp/reg9/registration-package.json');
const qidFiles = [
  'archive/db.js', 'archive/data/question_identity_map.json', 'archive/data/question_metadata.json',
  'archive/question-identity.js', 'archive/question-index.js', 'archive/question-index-report.md',
  'archive/question-index-audit.md', 'archive/data/archive2-catalog.json',
  'archive/data/archive2-canonical-input-manifest.json',
];
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const hashJson = v => hash(Buffer.from(JSON.stringify(v), 'utf8'));
const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
const writeJson = (p, v) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(v, null, 2) + '\n'); };
const assert = (v, code, detail = '') => { if (!v) throw new Error(detail ? `${code}:${detail}` : code); };

async function main() {
  assert(execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() === '5c63a37e9f247267ac54aaf060007fb0bc3f68e4', 'HEAD_MISMATCH');
  fs.mkdirSync(evidenceRoot, { recursive: true });
  assert(!fs.existsSync(assignmentPath), 'FRESH_ASSIGNMENT_REQUIRED');
  assert(!fs.existsSync(packagePath), 'FRESH_PACKAGE_REQUIRED');
  const assignmentHead = execFileSync('git', ['-C', root, '-c', 'core.quotePath=false', 'status', '--short', '--', relSource], { encoding: 'utf8' }).trim();
  const sourceBytes = fs.readFileSync(source);
  const sourceRaw = hash(sourceBytes);
  const sourceBlob = execFileSync('git', ['-C', root, 'hash-object', '--stdin'], { input: sourceBytes }).toString().trim();
  assert(sourceRaw === 'c38f2c0b8f746170688be1d1c919bd1bbcdf4b4ffab0f925698aa8ef2b2dfbd2' && sourceBlob === 'e51fe7b5b2cfadf69131632a56b10008e34a1fcc', 'SOURCE_HASH_MISMATCH');
  const r1Bytes = fs.readFileSync(r1Path), r1ValidationBytes = fs.readFileSync(r1ValidationPath), promotionBytes = fs.readFileSync(promotionPath);
  const r1 = JSON.parse(r1Bytes.toString('utf8'));
  const r1v = JSON.parse(r1ValidationBytes.toString('utf8'));
  const promotion = JSON.parse(promotionBytes.toString('utf8'));
  assert(hash(r1Bytes) === '642a42bdd24eda8e001ccf17b55e4faedf091408e1c8c4678e0acda6544bb07e', 'R1_EVIDENCE_SHA_MISMATCH');
  assert(hash(r1ValidationBytes) === '1fc855ad31ac123497297b75a6469bfae5211d98142045d585e912ed615b8044', 'R1_VALIDATION_SHA_MISMATCH');
  assert(r1v.ok && r1v.disposition === 'PASS' && r1v.validatorMode === 'R1_V2' && r1v.artifactContract?.active === true && r1v.artifactContract.disposition === 'PASS' && r1v.denominator === 24 && r1v.rowCount === 24, 'R1_VALIDATOR_NOT_PASS');
  assert(r1.stage === 'R1' && r1.executionLine === 'CODEX' && r1.qualityContractVersion === 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006' && r1.artifactSha === sourceBlob && r1.artifactRawSha256 === sourceRaw && r1.rows.length === 24, 'R1_IDENTITY_BINDING_MISMATCH');
  assert(r1.artifactDispositions?.artifactSha === sourceBlob && r1.artifactDispositions.rows.length === 24, 'R1_DISPOSITION_BINDING_MISMATCH');
  assert(promotion.schemaVersion === 'ROOT_EXAM_BYTE_IDENTICAL_PROMOTION_V1' && promotion.examUid === examUid && promotion.artifactSha === sourceBlob && promotion.productionJs?.sha256 === sourceRaw, 'PROMOTION_RECEIPT_BINDING_MISMATCH');

  const current = vm.createContext({ window: {}, console: { log() {}, warn() {}, error() {} } });
  vm.runInContext(sourceBytes.toString('utf8'), current, { filename: source, timeout: 5000 });
  const bank = current.window.questionBank || current.window.questions;
  assert(Array.isArray(bank) && bank.length === 24, 'SOURCE_QID_DENOMINATOR_MISMATCH');
  const importTool = await import(pathToFileURL(path.join(root, 'archive/tools/prepare-target-registration-candidate.mjs')).href);
  const file = 'original/middle/m2/1mid/' + `${examUid}.js`;
  const ids = importTool.makeTargetIdentityRows(file, bank);
  const meta = importTool.makeTargetMetadataRows({ sourceFile: file, bank, identityRows: ids, r1EvidencePath: path.relative(root, r1Path).replaceAll('\\', '/') });
  const selectedMeta = ['standardCourse','standardUnitKey','standardUnit','standardUnitOrder','subUnitKey','subUnit','problemTypeKey','templateKey','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility','crossConceptKeys','conditionKeys','integrationPattern','tagStatus'];
  const r1Rows = new Map(r1.rows.map(x => [Number(x.qid), x]));
  for (let i = 0; i < bank.length; i++) {
    const qid = i + 1, row = r1Rows.get(qid), mr = row?.metaReview, debt = r1.artifactDispositions.rows[i];
    assert(row && mr?.status === 'PASS_WITH_PROJECTION_DEBT' && row.verdict === 'PASS' && row.axisEvidence?.META?.status === 'PASS', 'R1_META_ROW_MISSING', String(qid));
    assert(meta[i].standardCourse === bank[i].standardCourse && meta[i].standardUnitKey === bank[i].standardUnitKey && meta[i].subUnitKey === bank[i].subUnitKey && meta[i].standardUnitOrder === bank[i].standardUnitOrder, 'R1_META_SOURCE_PARITY_MISMATCH', String(qid));
    assert(meta[i].problemTypeKey === (bank[i].problemTypeKey ?? null) && meta[i].templateKey === (bank[i].templateKey ?? null) && debt.qid === qid && JSON.stringify(debt.metaDebtFields) === JSON.stringify(row.metaDebtFields) && debt.metaDebtReason === row.metaDebtReason, 'R1_NULL_DEBT_MISMATCH', String(qid));
  }

  const registryBefore = Object.fromEntries(qidFiles.map(p => [p, hash(fs.readFileSync(path.join(root, p)))]));
  fs.cpSync(path.join(root,'archive/data'),path.join(candidateRoot,'archive/data'),{recursive:true});   for (const rel of qidFiles) {
    const from = path.join(root, rel), to = path.join(candidateRoot, rel);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
    assert(hash(fs.readFileSync(to)) === registryBefore[rel], 'CANDIDATE_BASELINE_COPY_MISMATCH', rel);
  }
  fs.mkdirSync(sourceMount, { recursive: true });
  const shortSource = path.join(sourceMount, `${examUid}.js`);
  fs.writeFileSync(shortSource, sourceBytes);
  assert(hash(fs.readFileSync(shortSource)) === sourceRaw, 'SHORT_SOURCE_MOUNT_MISMATCH');
  fs.mkdirSync(path.dirname(path.join(candidateRoot, relSource)), { recursive: true });   fs.copyFileSync(sourceBytes ? source : source, path.join(candidateRoot, relSource));
  for (const asset of promotion.assets) {
    const src = path.join(root, 'archive', asset.ref), dest = path.join(candidateRoot, 'archive', asset.ref);
    assert(hash(fs.readFileSync(src)) === asset.sha256, 'ASSET_HASH_MISMATCH', asset.ref);
    fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.copyFileSync(src, dest);
    assert(hash(fs.readFileSync(dest)) === asset.sha256, 'CANDIDATE_ASSET_COPY_MISMATCH', asset.ref);
  }

  const db = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(candidateRoot, 'archive/db.js'), 'utf8'), db);
  const existingDb = db.window.mainDB.exams;
  assert(!existingDb.some(x => x.file === file), 'TARGET_DB_ALREADY_PRESENT');
  const groups = new Map();
  for (const q of bank) {
    const key = `${q.standardCourse}\0${String(q.standardUnitKey).split('-').slice(0,-1).join('-')}`;
    if (!groups.has(key)) groups.set(key, { standardCourse: q.standardCourse, courseCode: String(q.standardUnitKey).replace(/-\d+$/, ''), units: new Map() });
    groups.get(key).units.set(q.standardUnitKey, { standardUnitKey: q.standardUnitKey, standardUnit: q.standardUnit, standardUnitOrder: q.standardUnitOrder });
  }
  const courseRanges = [...groups.values()].map(g => {
    const units = [...g.units.values()].sort((a,b)=>a.standardUnitOrder-b.standardUnitOrder);
    return { standardCourse:g.standardCourse, courseCode:g.courseCode, rangeStartUnitKey:units[0].standardUnitKey, rangeStartUnit:units[0].standardUnit, rangeStartUnitOrder:units[0].standardUnitOrder, rangeEndUnitKey:units.at(-1).standardUnitKey, rangeEndUnit:units.at(-1).standardUnit, rangeEndUnitOrder:units.at(-1).standardUnitOrder };
  });
  const targetDbRow = { file, school:'동산중', topic:'', grade:'중2', year:2026, semester:'1', examType:'mid', subject:'중2 수학', contentType:'기출', qCount:24, rangeStartUnitKey:courseRanges[0].rangeStartUnitKey, rangeStartUnit:courseRanges[0].rangeStartUnit, rangeStartUnitOrder:courseRanges[0].rangeStartUnitOrder, rangeEndUnitKey:courseRanges.at(-1).rangeEndUnitKey, rangeEndUnit:courseRanges.at(-1).rangeEndUnit, rangeEndUnitOrder:courseRanges.at(-1).rangeEndUnitOrder, courseRanges, primaryStandardCourse:'중2 수학' };
  fs.writeFileSync(path.join(candidateRoot,'archive/db.js'), importTool.appendDbExamRow(fs.readFileSync(path.join(candidateRoot,'archive/db.js')), targetDbRow));
  const idMapPath = path.join(candidateRoot,'archive/data/question_identity_map.json');
  const idMap = readJson(idMapPath);
  const identityRecords = [...idMap.records, ...ids].sort((a,b)=>a.sourceArchiveFile.localeCompare(b.sourceArchiveFile,'en')||Number(a.sourceOrdinal)-Number(b.sourceOrdinal));
  const byQuestionUid={},byLegacyQKey={},bySourceFileAndOrdinal={},bySourceFileAndQuestionNo={};
  for(const x of identityRecords){byQuestionUid[x.questionUid]={sourceArchiveFile:x.sourceArchiveFile,sourceOrdinal:x.sourceOrdinal,sourceQuestionNo:x.sourceQuestionNo};(byLegacyQKey[x.legacyQKey]??=[]).push(x.questionUid);(bySourceFileAndOrdinal[x.sourceArchiveFile]??={})[String(x.sourceOrdinal)]=x.questionUid;const k=String(x.sourceQuestionNo??'');bySourceFileAndQuestionNo[x.sourceArchiveFile]??={};bySourceFileAndQuestionNo[x.sourceArchiveFile][k]=[...(bySourceFileAndQuestionNo[x.sourceArchiveFile][k]||[]),x.questionUid];}
  const identityNext={...idMap,sourceCommit:'5c63a37e9f247267ac54aaf060007fb0bc3f68e4',records:identityRecords,lookup:{byQuestionUid,byLegacyQKey,bySourceFileAndOrdinal,bySourceFileAndQuestionNo},stats:{...(idMap.stats||{}),examFileCount:new Set(identityRecords.map(x=>x.sourceArchiveFile)).size,sourceQuestionCount:identityRecords.length,uniqueQuestionUidCount:new Set(identityRecords.map(x=>x.questionUid)).size,duplicateQuestionUidCount:0,failures:0},incrementalSync:{schemaVersion:'question-identity-incremental-sync-v2',sourceCommit:'5c63a37e9f247267ac54aaf060007fb0bc3f68e4',newFiles:1,newRecords:24,newSourceFiles:[file],renamedFiles:[],renamedRecords:0,renamedSourceFiles:[]},generatedAt:new Date().toISOString()};
  delete identityNext.identityDigest;const stableIdentity={...identityNext};delete stableIdentity.generatedAt;identityNext.identityDigest=hashJson(stableIdentity);writeJson(idMapPath,identityNext);
  const metadataPath=path.join(candidateRoot,'archive/data/question_metadata.json'),metadataBase=readJson(metadataPath);
  const metadataRecords=[...metadataBase.records,...meta].sort((a,b)=>String(a.questionUid).localeCompare(String(b.questionUid),'en'));
  const metadataNext={...metadataBase,generatedAt:new Date().toISOString(),sourceDigests:{...(metadataBase.sourceDigests||{}),identityMap:hash(Buffer.from(JSON.stringify(identityNext,null,2)+'\n','utf8'))},consistency:{...(metadataBase.consistency||{}),productionValuesWinOnMerge:true},counts:{...(metadataBase.counts||{}),records:metadataRecords.length,uidUnique:true,sourceJoinUnique:true,semanticallyReviewed:metadataRecords.filter(x=>x.reviewStatus==='reviewed_pass'||x.metadataStatus==='approved_semantic_review'||x.metadataStatus==='approved_exam_meta_source').length,explicitProblemTypeHolds:metadataRecords.filter(x=>x.fieldStatus?.problemType==='manual_review_pending').length,explicitTemplateHolds:metadataRecords.filter(x=>x.fieldStatus?.template==='manual_review_pending').length,explicitDifficultyHolds:metadataRecords.filter(x=>x.fieldStatus?.difficulty==='manual_review_pending').length},records:metadataRecords,registrationSync:{schemaVersion:'archive-registration-metadata-sync-v2',added:24,addedFiles:[file],relocated:0,relocatedFiles:[]}};
  delete metadataNext.digest;metadataNext.digest=hashJson(metadataNext);writeJson(metadataPath,metadataNext);

  fs.mkdirSync(path.join(indexRoot,'archive/exams/original/middle/m2/1mid'),{recursive:true}); fs.mkdirSync(path.join(indexRoot,'archive/tools'),{recursive:true});
  fs.mkdirSync(path.join(indexRoot,'archive/tools'),{recursive:true});
  fs.copyFileSync(path.join(root,'archive/tools/build-question-index.mjs'),path.join(indexRoot,'archive/tools/build-question-index.mjs'));
  fs.copyFileSync(path.join(candidateRoot,relSource),path.join(indexRoot,relSource));
  fs.writeFileSync(path.join(indexRoot,'archive/db.js'),'window.mainDB = '+JSON.stringify({exams:[targetDbRow]},null,2)+';\n');
  execFileSync(process.execPath,[path.join(indexRoot,'archive/tools/build-question-index.mjs')],{cwd:indexRoot,env:{...process.env,GEOMETRY_ARCHIVE_ROOT:path.join(indexRoot,'archive'),GEOMETRY_REPO_ROOT:indexRoot},stdio:'inherit'});
  const generatedIndex=fs.readFileSync(path.join(indexRoot,'archive/question-index.js'));
  fs.writeFileSync(path.join(candidateRoot,'archive/question-index.js'),generatedIndex);
  const indexWindow={window:{}};vm.runInNewContext(generatedIndex.toString('utf8'),indexWindow);
  const targetIndex=indexWindow.window.questionIndex;
  assert(targetIndex.length===24&&targetIndex.every((x,i)=>x.sourceFile===file&&Number(x.sourceOrdinal)===i+1),'TARGET_INDEX_DENOMINATOR_OR_ORDER_FAIL');
  fs.cpSync(path.join(root,'docs'),path.join(candidateRoot,'docs'),{recursive:true});   fs.mkdirSync(path.join(candidateRoot,'archive/tools'),{recursive:true}); fs.copyFileSync(path.join(root,'archive/tools/build-archive2-catalog.mjs'),path.join(candidateRoot,'archive/tools/build-archive2-catalog.mjs')); fs.copyFileSync(path.join(root,'archive/archive2-core.js'),path.join(candidateRoot,'archive/archive2-core.js')); fs.copyFileSync(path.join(root,'archive/mixer-selector.js'),path.join(candidateRoot,'archive/mixer-selector.js')); fs.copyFileSync(path.join(root,'archive/archive2-canonical.js'),path.join(candidateRoot,'archive/archive2-canonical.js'));   fs.cpSync(path.join(root,'archive/exams'),path.join(candidateRoot,'archive/exams'),{recursive:true}); fs.cpSync(path.join(root,'archive/_generated'),path.join(candidateRoot,'archive/_generated'),{recursive:true});   execFileSync(process.execPath,[path.join(candidateRoot,'archive/tools/build-archive2-catalog.mjs')],{cwd:candidateRoot,stdio:'inherit'});
  const catalogPath=path.join(candidateRoot,'archive/data/archive2-catalog.json');
  const core=await import(pathToFileURL(path.join(root,'archive/archive2-core.js')).href);
  const catalog=core.default.decodeCatalog(readJson(catalogPath));
  const catalogRows=catalog.records.filter(x=>x.sourceFile===file);
  assert(catalogRows.length===24&&catalogRows.every((x,i)=>Number(x.sourceOrdinal)===i+1),'TARGET_CATALOG_DENOMINATOR_OR_ORDER_FAIL');

  const assets=promotion.assets.map(x=>({ref:x.ref,sha256:x.sha256}));
  const assignment={schemaVersion:'JS_ARCHIVE_TARGET_REGISTRATION_ASSIGNMENT_V1',runId,examUid,productionRelativePath:relSource,expectedHead:'5c63a37e9f247267ac54aaf060007fb0bc3f68e4',artifactRawSha256:sourceRaw,validatorRawBufferBlobSha1:sourceBlob,questionCount:24,lockedRosterSha256:'',producerAuthorityPath:'',producerAuthoritySha256:'',r1EvidencePath:path.relative(root,r1Path).replaceAll('\\','/'),r1EvidenceSha256:hash(r1Bytes),r1EvidenceReferencePath:r1Path,r1ValidationPath:path.relative(root,r1ValidationPath).replaceAll('\\','/'),r1ValidationSha256:hash(r1ValidationBytes),releaseAssets:assets,sourceStatusException:{observed:assignmentHead,reason:'ROOT promotion receipt binds the exact current source and assets; source remains untracked pending ROOT publication.'},promotionReceiptPath:path.relative(root,promotionPath).replaceAll('\\','/'),promotionReceiptSha256:hash(promotionBytes),originalProductionAbsolute:source,currentPhysicalCourseBinding:{standardCourse:'중2 수학',standardUnitKeyPrefix:'M2',semanticFieldsSource:'current R1 currentMeta rows'},registryBaselineSha256:registryBefore};
  const roster={schemaVersion:'JS_ARCHIVE_CODEX_LOCKED_ROSTER_V1',runId,rows:[{examUid,productionPath:relSource,grade:'m2',course:'중2 수학',questionCount:24}]};
  assignment.lockedRosterSha256=hash(Buffer.from(JSON.stringify(roster,null,2)+'\n','utf8'));
  const authority={schemaVersion:'ROOT_TARGET_REGISTRATION_PRODUCER_AUTHORITY_V1',decisionAuthority:'ROOT_DELEGATED',runId,authorityReference:{path:path.relative(root,path.join(root,'archive/analysis',runId,'ROOT.user-AGENTS.snapshot.md')).replaceAll('\\','/'),sha256:'9f3403b4085e1e393ec35f986f8b226599a022d2625dc8c13fd54942dd9fff9f',sourceRawSha256:'9f3403b4085e1e393ec35f986f8b226599a022d2625dc8c13fd54942dd9fff9f',sourceGitBlobSha1:'4d3654504451ab2d4b5b0ecd2ce5694d53095924'},roster:{path:path.relative(root,rosterPath).replaceAll('\\','/'),sha256:assignment.lockedRosterSha256},scope:[{examUid,productionPath:relSource,grade:'m2',course:'중2 수학'}],scopeReason:'Exact ROOT-assigned technical registration continuation; strict target-only 24-row package over the current physical nine registry baselines. Reuse current R1 Meta disposition, M2-02 PT/TPL null projection debt, and semantic paths without reclassification.'};
  assignment.producerAuthorityPath=path.relative(root,authorityPath).replaceAll('\\','/');
  writeJson(rosterPath,roster);writeJson(authorityPath,authority);writeJson(assignmentPath,assignment);
  const relativeAssignment=path.relative(root,assignmentPath).replaceAll('\\','/');
  execFileSync(process.execPath,[path.join(root,'archive/tools/prepare-target-registration.mjs'),'--root',root,'--assignment',relativeAssignment,'--candidate-root',candidateRoot,'--output',path.relative(root,packagePath).replaceAll('\\','/')],{cwd:root,stdio:'inherit'});
  execFileSync(process.execPath,[path.join(root,'archive/tools/register-target-exam.mjs'),'--root',root,'--assignment',relativeAssignment,'--proposal',path.relative(root,packagePath).replaceAll('\\','/'),'--catalog-candidate',path.relative(root,catalogPath).replaceAll('\\','/'),'--evidence-root',path.relative(root,evidenceRoot).replaceAll('\\','/')],{cwd:root,stdio:'inherit'});
  const packageBytes=fs.readFileSync(packagePath),dryRun=readJson(path.join(evidenceRoot,'target-registration.receipt.json'));
  const result={schemaVersion:'ROOT_REGISTRATION_TECHNICAL_PREAPPLY_CLOSEOUT_V1',status:'PACKAGE_AND_DRY_RUN_READY_NOT_APPLIED',runId,examUid,stage:'MASTER_TECHNICAL_REGISTRATION',executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',head:'5c63a37e9f247267ac54aaf060007fb0bc3f68e4',assignment:{path:assignmentPath,sha256:hash(fs.readFileSync(assignmentPath))},source:{path:source,rawSha256:sourceRaw,rawBufferBlobSha1:sourceBlob},assets:assets.map(x=>({path:path.join(root,'archive',x.ref),sha256:x.sha256})),r1Proof:{path:r1Path,sha256:hash(r1Bytes),validatorPath:r1ValidationPath,validatorSha256:hash(r1ValidationBytes),disposition:r1v.disposition,denominator:r1v.denominator,rowCount:r1v.rowCount,artifactContract:r1v.artifactContract.disposition,metaDispositionRows:r1.artifactDispositions.rows.length,noSemanticReclassification:true},registryBaselineFiles:qidFiles.map(relativePath=>({relativePath,sha256:registryBefore[relativePath]})),candidate:{root:candidateRoot,catalogPath,catalogRawSha256:hash(fs.readFileSync(catalogPath)),catalogIndexVersion:catalog.indexVersion,catalogColumns:catalog.records[0]?.packedRow?.length||catalog.columns?.length||67,targetRows:{identity:ids.length,metadata:meta.length,index:targetIndex.length,catalog:catalogRows.length,db:1},packagePath,packageSha256:hash(packageBytes),schemaVersion:readJson(packagePath).schemaVersion},preapplyProof:{path:path.join(evidenceRoot,'target-registration.receipt.json'),sha256:hash(fs.readFileSync(path.join(evidenceRoot,'target-registration.receipt.json'))),status:dryRun.status,targetCounts:dryRun.targetCounts,nonTargetInvariant:dryRun.nonTargetInvariant,checks:dryRun.checks,issues:dryRun.issues},noSourceAssetOrMainRegistryMutation:true,nextRequiredAction:'ROOT applies the exact package, runs catalog check/parity/identity runtime, then verifies final nine registry raw and clean-filter hashes.'};
  writeJson(path.join(evidenceRoot,'ROOT.registration.preapply-closeout.json'),result);
  console.log(JSON.stringify({status:result.status,assignment:result.assignment,candidate:result.candidate,preapplyProof:result.preapplyProof},null,2));
}

main().catch(error=>{console.error(String(error?.stack||error));process.exitCode=1;});













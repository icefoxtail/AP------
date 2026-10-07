import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import {validateRegistrationPackage} from './target-registration-contract.mjs';

const args={};
for(let i=2;i<process.argv.length;i++){const key=process.argv[i];if(key==='--apply')args.apply=true;else if(['--root','--assignment','--proposal','--catalog-candidate','--evidence-root'].includes(key))args[key.slice(2)]=process.argv[++i];else throw Error('UNKNOWN_ARGUMENT:'+key);}
for(const key of ['root','assignment','proposal','catalog-candidate','evidence-root'])if(!args[key])throw Error('REQUIRED_ARGUMENT:'+key);
const root=fs.realpathSync(path.resolve(args.root));
function safe(relative){const result=path.resolve(root,relative),rel=path.relative(root,result);if(rel.startsWith('..')||path.isAbsolute(rel))throw Error('PATH_OUTSIDE_ROOT:'+relative);return result;}
const evidence=safe(args['evidence-root']);fs.mkdirSync(evidence,{recursive:true});
const proposal=JSON.parse(fs.readFileSync(safe(args.proposal),'utf8'));
const assignment=JSON.parse(fs.readFileSync(safe(args.assignment),'utf8'));
const require=createRequire(import.meta.url);
const core=require(path.join(root,'archive/archive2-core.js'));
const targetFile=core.normalizeFile(assignment.productionRelativePath.replace(/^archive\/exams\//,''));
if(!/^original\/(?:high|middle)\//.test(targetFile)||targetFile.includes('..')||targetFile.includes('_generated'))throw Error('TARGET_PRODUCTION_PATH_REQUIRED');
const fullGenCatalogPath=safe(args['catalog-candidate']);
const targetWindow={window:{}};vm.runInNewContext(fs.readFileSync(safe(assignment.productionRelativePath),'utf8'),targetWindow,{timeout:5000});
const targetBank=targetWindow.window.questionBank||targetWindow.window.questions;
if(!Array.isArray(targetBank)||!targetBank.length)throw Error('TARGET_BANK_REQUIRED');
const questionCount=targetBank.length;
const snapshotMap=proposal.baselineBindings||[];
const allowed=[
 'archive/db.js','archive/data/question_identity_map.json','archive/data/question_metadata.json','archive/question-identity.js',
 'archive/question-index.js','archive/question-index-report.md','archive/question-index-audit.md','archive/data/archive2-catalog.json',
 'archive/data/archive2-canonical-input-manifest.json'
];
const abs=rel=>safe(rel);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const shaFile=f=>sha(fs.readFileSync(f));
const readJson=f=>JSON.parse(fs.readFileSync(f,'utf8').replace(/^\uFEFF/,''));
const hashJson=value=>sha(Buffer.from(JSON.stringify(value),'utf8'));
const stableSortObject=obj=>Object.fromEntries(Object.entries(obj).sort(([a],[b])=>a.localeCompare(b,'en')));
const deep=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const now=new Date().toISOString();
const backup=new Map(allowed.map(rel=>[rel,fs.readFileSync(abs(rel))]));
const before=Object.fromEntries(allowed.map(rel=>[rel,sha(backup.get(rel))]));
let writesStarted=false;
const restore=()=>{if(writesStarted)for(const [rel,bytes] of backup)fs.writeFileSync(abs(rel),bytes);};
try {
  validateRegistrationPackage({proposal,allowed,questionCount,targetFile});
  if(!['JS_ARCHIVE_TARGET_REGISTRATION_PACKAGE_V1','MASTER_TARGET_ONLY_REGISTRATION_PROPOSAL_V1'].includes(proposal.schemaVersion))throw Error('proposal schema mismatch');
  if(snapshotMap.length!==allowed.length||new Set(snapshotMap.map(r=>r.relativePath)).size!==allowed.length||snapshotMap.some(r=>!allowed.includes(r.relativePath)))throw Error('COMPLETE_BASELINE_BINDINGS_REQUIRED');
  if(proposal.catalogCandidateSha256!==shaFile(fullGenCatalogPath))throw Error('CATALOG_CANDIDATE_SHA_MISMATCH');
  if(proposal.inputArtifact.rawSha256!==assignment.artifactRawSha256)throw Error('target artifact SHA binding mismatch');
  if(shaFile(abs(assignment.productionRelativePath))!==assignment.artifactRawSha256)throw Error('target source raw SHA changed');
  if(execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim()!==assignment.expectedHead)throw Error('HEAD mismatch');
  for(const row of snapshotMap){const f=abs(row.relativePath);if(shaFile(f)!==row.sha256)throw Error('baseline derived file differs from preserved snapshot: '+row.relativePath);}
  for(const asset of assignment.releaseAssets){if(shaFile(path.join(root,'archive',asset.ref))!==asset.sha256)throw Error('asset SHA mismatch: '+asset.ref);}

  const dbBase={};vm.runInNewContext(backup.get('archive/db.js').toString('utf8'),{window:dbBase});
  const identityBase=JSON.parse(backup.get('archive/data/question_identity_map.json'));
  const metadataBase=JSON.parse(backup.get('archive/data/question_metadata.json'));
  const indexBase={};vm.runInNewContext(backup.get('archive/question-index.js').toString('utf8'),{window:indexBase});
  const packedBase=JSON.parse(backup.get('archive/data/archive2-catalog.json'));
  const catalogBase=core.decodeCatalog(packedBase);
  const runtimeBaseWindow={};vm.runInNewContext(backup.get('archive/question-identity.js').toString('utf8'),{window:runtimeBaseWindow});
  const runtimeBase=runtimeBaseWindow.questionIdentity;
  if(dbBase.mainDB.exams.some(x=>x.file===targetFile)||identityBase.records.some(x=>x.sourceArchiveFile===targetFile)||metadataBase.records.some(x=>x.sourceArchiveFile===targetFile)||indexBase.questionIndex.some(x=>x.sourceFile===targetFile)||catalogBase.records.some(x=>x.sourceFile===targetFile))throw Error('target already present in baseline');

  const targetDbRow=proposal.registrationDelta.targetDbRow;
  const targetIds=proposal.targetOutputs.identityRows;
  const targetMeta=proposal.targetOutputs.metadataRows;
  const targetIndex=proposal.targetOutputs.indexRows;
  const generatedCatalog=core.decodeCatalog(JSON.parse(fs.readFileSync(fullGenCatalogPath,'utf8')));
  const targetCatalog=proposal.targetOutputs.catalogRows;
  const targetExam=generatedCatalog.exams.find(x=>x.file===targetFile);
  if(!targetDbRow||targetIds.length!==questionCount||targetMeta.length!==questionCount||targetIndex.length!==questionCount||targetCatalog.length!==questionCount||!targetExam)throw Error('target proposal incomplete');
  const targetQids=Array.from({length:questionCount},(_,i)=>i+1);
  const checkOrdinals=(rows,name,get)=>{const a=rows.map(get).sort((x,y)=>x-y);if(!deep(a,targetQids))throw Error(name+' target ordinal coverage mismatch: '+JSON.stringify(a));};
  checkOrdinals(targetIds,'identity',x=>Number(x.sourceOrdinal));
  checkOrdinals(targetMeta,'metadata',x=>Number(x.sourceOrdinal));
  checkOrdinals(targetIndex,'index',x=>Number(x.sourceOrdinal));
  checkOrdinals(targetCatalog,'catalog',x=>Number(x.sourceOrdinal));
  const uidByOrdinal=new Map(targetIds.map(x=>[Number(x.sourceOrdinal),x.questionUid]));
  for(const [name,rows] of [['metadata',targetMeta],['catalog',targetCatalog]])for(const row of rows)if(row.questionUid!==uidByOrdinal.get(Number(row.sourceOrdinal)))throw Error(name+' UID mismatch at ordinal '+row.sourceOrdinal);
  for(const row of targetIndex)if(row.qKey!==targetFile+'_'+String(targetIds.find(x=>Number(x.sourceOrdinal)===Number(row.sourceOrdinal)).sourceQuestionNo))throw Error('index qKey mismatch at '+row.sourceOrdinal);

  // Identity map: use the canonical v1 lookup/digest contract while retaining all baseline records.
  const identityRecords=[...identityBase.records,...targetIds].sort((a,b)=>a.sourceArchiveFile.localeCompare(b.sourceArchiveFile,'en')||Number(a.sourceOrdinal)-Number(b.sourceOrdinal));
  const byQuestionUid={},byLegacyQKey={},bySourceFileAndOrdinal={},bySourceFileAndQuestionNo={};
  for(const r of identityRecords){
    byQuestionUid[r.questionUid]={sourceArchiveFile:r.sourceArchiveFile,sourceOrdinal:r.sourceOrdinal,sourceQuestionNo:r.sourceQuestionNo};
    (byLegacyQKey[r.legacyQKey]??=[]).push(r.questionUid);
    (bySourceFileAndOrdinal[r.sourceArchiveFile]??={})[String(r.sourceOrdinal)]=r.questionUid;
    (bySourceFileAndQuestionNo[r.sourceArchiveFile]??={})[String(r.sourceQuestionNo??'')]=(bySourceFileAndQuestionNo[r.sourceArchiveFile][String(r.sourceQuestionNo??'')]||[]).concat(r.questionUid);
  }
  const identityNext={...identityBase,sourceCommit:assignment.expectedHead,records:identityRecords,lookup:{byQuestionUid:stableSortObject(byQuestionUid),byLegacyQKey:stableSortObject(byLegacyQKey),bySourceFileAndOrdinal:stableSortObject(bySourceFileAndOrdinal),bySourceFileAndQuestionNo:stableSortObject(bySourceFileAndQuestionNo)},stats:{...(identityBase.stats||{}),examFileCount:new Set(identityRecords.map(r=>r.sourceArchiveFile)).size,sourceQuestionCount:identityRecords.length,uniqueQuestionUidCount:new Set(identityRecords.map(r=>r.questionUid)).size,duplicateQuestionUidCount:0,failures:0},incrementalSync:{schemaVersion:'question-identity-incremental-sync-v2',sourceCommit:assignment.expectedHead,newFiles:1,newRecords:questionCount,newSourceFiles:[targetFile],renamedFiles:[],renamedRecords:0,renamedSourceFiles:[]},generatedAt:now};
  delete identityNext.identityDigest;
  const identityStable={...identityNext};delete identityStable.generatedAt;
  identityNext.identityDigest=hashJson(identityStable);
  const identityText=JSON.stringify(identityNext,null,2)+'\n';

  // Metadata: append only target pending records; preserve existing field values and classifications.
  const metadataRecords=[...metadataBase.records,...targetMeta].sort((a,b)=>String(a.questionUid).localeCompare(String(b.questionUid),'en'));
  const sourceJoinKeys=new Set(metadataRecords.map(r=>String(r.sourceArchiveFile).replace(/\\/g,'/')+'#'+Number(r.sourceOrdinal)));
  if(sourceJoinKeys.size!==metadataRecords.length||new Set(metadataRecords.map(r=>r.questionUid)).size!==metadataRecords.length)throw Error('metadata identity/source uniqueness failure');
  const metadataNext={...metadataBase,generatedAt:now,sourceDigests:{...(metadataBase.sourceDigests||{}),identityMap:sha(Buffer.from(identityText,'utf8'))},consistency:{...(metadataBase.consistency||{}),sourceFingerprintFailures:Number(metadataBase.consistency?.sourceFingerprintFailures||0),sourceClassificationConflicts:Number(metadataBase.consistency?.sourceClassificationConflicts||0),productionValuesWinOnMerge:true},counts:{...(metadataBase.counts||{}),records:metadataRecords.length,uidUnique:true,sourceJoinUnique:true,semanticallyReviewed:metadataRecords.filter(r=>r.reviewStatus==='reviewed_pass'||r.metadataStatus==='approved_semantic_review'||r.metadataStatus==='approved_exam_meta_source').length,explicitProblemTypeHolds:metadataRecords.filter(r=>r.fieldStatus?.problemType==='manual_review_pending').length,explicitTemplateHolds:metadataRecords.filter(r=>r.fieldStatus?.template==='manual_review_pending').length,explicitDifficultyHolds:metadataRecords.filter(r=>r.fieldStatus?.difficulty==='manual_review_pending').length},records:metadataRecords,registrationSync:{schemaVersion:'archive-registration-metadata-sync-v2',added:questionCount,addedFiles:[targetFile],relocated:0,relocatedFiles:[]}};
  delete metadataNext.digest;metadataNext.digest=hashJson(metadataNext);
  const metadataText=JSON.stringify(metadataNext,null,2)+'\n';

  // Preserve db.js bytes outside the single appended production exam row.
  const eol=backup.get('archive/db.js').includes(Buffer.from('\r\n'))?'\r\n':'\n';
  const dbSource=backup.get('archive/db.js').toString('utf8');
  const closeAt=dbSource.lastIndexOf(eol+'  ]');
  if(closeAt<0)throw Error('db exam array closing locus not found');
  const rowText=JSON.stringify(targetDbRow,null,2).split('\n').map(line=>'    '+line).join(eol);
  const dbText=dbSource.slice(0,closeAt).replace(/[ \t\r\n]*$/,'')+','+eol+rowText+dbSource.slice(closeAt);
  const dbAfter={};vm.runInNewContext(dbText,{window:dbAfter});
  if(dbAfter.mainDB.exams.length!==dbBase.mainDB.exams.length+1)throw Error('db target insert count mismatch');

  // Question index: generated target rows are the exact rows from the canonical full scan; append after the baseline roster.
  const indexRows=[...indexBase.questionIndex,...targetIndex];
  if(new Set(indexRows.map(x=>x.qKey)).size!==indexRows.length)throw Error('question-index qKey collision');
  const indexPrefix=backup.get('archive/question-index.js').toString('utf8').split('window.questionIndex=')[0];
  const indexText=indexPrefix+'window.questionIndex='+JSON.stringify(indexRows)+';\n';

  // Stable runtime bridge: append the new file index so every existing runtime tuple remains byte/value stable.
  const runtimeNext=JSON.parse(JSON.stringify(runtimeBase));
  delete runtimeNext.runtimeDigest;
  runtimeNext.identityDigest=identityNext.identityDigest;
  let fileIndex=runtimeNext.fileIndexByPath[targetFile];
  if(fileIndex===undefined){fileIndex=runtimeNext.files.length;runtimeNext.files.push(targetFile);runtimeNext.fileIndexByPath[targetFile]=fileIndex;runtimeNext.byFile[String(fileIndex)]={o:{},n:{}};}
  for(const r of targetIds){runtimeNext.byUid[r.questionUid]=[fileIndex,r.sourceOrdinal,r.sourceQuestionNo];runtimeNext.byFile[String(fileIndex)].o[String(r.sourceOrdinal)]=r.questionUid;const no=String(r.sourceQuestionNo??'');runtimeNext.byFile[String(fileIndex)].n[no]??=[];runtimeNext.byFile[String(fileIndex)].n[no].push(r.questionUid);}
  const runtimeDigest=hashJson(runtimeNext);
  const identityRuntimeText=`// Generated by archive/tools/intelligence/build-question-identity-runtime.mjs\n// identityDigest: ${identityNext.identityDigest}\n(function () {\n  const data = ${JSON.stringify({...runtimeNext,runtimeDigest})};\n  function normalizeFile(value) { return String(value || '').normalize('NFC').replace(/\\\\/g, '/').replace(/^exams\\//, '').replace(/^\\.\\//, '').trim(); }\n  function positiveInteger(value) { const n = Number(value); return Number.isInteger(n) && n > 0 ? n : null; }\n  function pick(reference, names) { for (const name of names) { const value = reference && reference[name]; if (value !== undefined && value !== null && String(value).trim() !== '') return value; } return null; }\n  function unresolved(status, candidates) { return { status, questionUid: null, sourceArchiveFile: null, sourceOrdinal: null, sourceQuestionNo: null, candidates: candidates || [] }; }\n  function resolved(status, questionUid, tuple) { return { status, questionUid, sourceArchiveFile: data.files[tuple[0]], sourceOrdinal: tuple[1], sourceQuestionNo: tuple[2], candidates: [] }; }\n  window.questionIdentity = data;\n  window.resolveQuestionIdentityReference = function (reference) {\n    const questionUid = pick(reference, ['questionUid', 'question_uid', 'sourceQuestionUid', 'source_question_uid']);\n    if (questionUid) { const tuple = data.byUid[questionUid]; return tuple ? resolved('RESOLVED_CANONICAL_UID', questionUid, tuple) : unresolved('UNKNOWN_QUESTION_UID'); }\n    const sourceFile = normalizeFile(pick(reference, ['sourceArchiveFile', 'source_archive_file', 'sourceFile', '_sourceFile']) || '');\n    const sourceOrdinal = positiveInteger(pick(reference, ['sourceOrdinal', 'source_ordinal', 'sourceQuestionOrdinal', 'source_question_ordinal']));\n    const sourceQuestionNo = pick(reference, ['sourceQuestionNo', 'source_question_no', 'legacyQuestionNo', 'legacy_question_no', 'questionId', 'question_id', 'id']);\n    const fileIndex = data.fileIndexByPath[sourceFile];\n    const fileData = fileIndex === undefined ? null : data.byFile[String(fileIndex)];\n    if (sourceFile && sourceOrdinal) { const uid = fileData && fileData.o[String(sourceOrdinal)]; const tuple = uid && data.byUid[uid]; return tuple ? resolved('RESOLVED_SOURCE_ORDINAL', uid, tuple) : unresolved('UNKNOWN_SOURCE_ORDINAL'); }\n    if (sourceFile && sourceQuestionNo !== null) { const candidates = fileData && fileData.n[String(sourceQuestionNo)] || []; if (candidates.length === 1) return resolved('RESOLVED_LEGACY_UNAMBIGUOUS', candidates[0], data.byUid[candidates[0]]); if (candidates.length > 1) return unresolved('AMBIGUOUS_LEGACY_REFERENCE', candidates); return unresolved('UNKNOWN_LEGACY_REFERENCE'); }\n    return unresolved('INSUFFICIENT_IDENTITY_REFERENCE');\n  };\n})();\n`;

  // Catalog codec: retain every baseline column/string ID and append target strings/rows only.
  const sourceFileSha=shaFile(abs(assignment.productionRelativePath));
  const catalogRecords=[...catalogBase.records,...targetCatalog];
  const sourceHashes=[...catalogBase.sourceHashes,[targetFile,sourceFileSha]];
  const exams=[...catalogBase.exams,JSON.parse(JSON.stringify(targetExam))];
  const runtimePacks=core.Canonical.RUNTIME_INPUT_PATHS.map(rel=>readJson(path.join(root,'archive',rel)));
  const baseManifest=readJson(abs('archive/data/archive2-canonical-input-manifest.json')),resources={},versionFiles={};
  for(const row of baseManifest.files){const buf=Buffer.from(fs.readFileSync(safe('archive/'+row.path),'utf8').replace(/^\uFEFF/,'').replace(/\r\n/g,'\n'));if(sha(buf)!==row.sha256)throw Error('BASE_MANIFEST_SHA_MISMATCH:'+row.path);resources[row.path]=JSON.parse(buf);versionFiles[row.path]={sha256:row.sha256};}
  const canonicalData=core.Canonical.resolveCatalog({versionBundle:{manifest:baseManifest,projectionVersion:baseManifest.projectionVersion,files:versionFiles,resources}}).canonicalAuthority;
  const auth=JSON.parse(JSON.stringify(canonicalData));
  auth.examGradeByFile[targetFile]=targetDbRow.grade;
  for(const r of targetIds)auth.identityByUid[r.questionUid]={questionUid:r.questionUid,sourceArchiveFile:targetFile,sourceOrdinal:r.sourceOrdinal,status:'VERIFIED'};
  const targetResults=targetCatalog.map(record=>core.eligibility(record,{canonicalAuthority:auth}));
  if(targetResults.length!==questionCount||targetResults.some((r,i)=>Boolean(r.ok)!==Boolean(targetCatalog[i].automatic)))throw Error('target catalog eligibility does not match generated rows');
  const health={...catalogBase.health,exams:catalogBase.exams.length+1,questions:catalogBase.records.length+questionCount,metadataRecords:metadataRecords.length};
  for(const result of targetResults){for(const reason of result.reasons)health[reason]=(health[reason]||0)+1;if(result.ok)health.automatic=(health.automatic||0)+1;}
  const targetExamFinal={...exams.at(-1),automaticCount:targetResults.filter(r=>r.ok).length};
  exams[exams.length-1]=targetExamFinal;
  const indexVersion=sha(Buffer.from(JSON.stringify([core.VERSION,sourceHashes,sha(Buffer.from(metadataText,'utf8')),identityNext.identityDigest,catalogBase.taxonomy,exams,catalogRecords]),'utf8'));
  const catalogNext={...catalogBase,indexVersion,identityDigest:identityNext.identityDigest,metadataRevision:metadataNext.metadataRevision,sourceHashes,exams,records:catalogRecords,health};
  const columns=[...packedBase.columns];
  for(const row of targetCatalog)for(const key of Object.keys(row))if(!columns.includes(key))columns.push(key);
  const strings=[...packedBase.strings],stringIds=new Map(strings.map((value,i)=>[value,i]));
  const encode=value=>{if(typeof value!=='string')return value??null;if(!stringIds.has(value)){stringIds.set(value,strings.length);strings.push(value);}return [stringIds.get(value)];};
  const packedNext={...catalogNext,encoding:'column-dictionary-v1',columns,strings,records:catalogRecords.map(row=>columns.map(column=>encode(row[column])))};
  const packedText=JSON.stringify(packedNext)+'\n';
  const allInputPaths=core.Canonical.manifestInputPathsFromRuntimePacks(runtimePacks,inputPath=>{const f=path.resolve(root,'archive',inputPath);return fs.existsSync(f)&&fs.statSync(f).isFile();});
  const manifestFiles=allInputPaths.map(inputPath=>{
    let bytes;
    if(inputPath==='data/archive2-catalog.json')bytes=Buffer.from(packedText,'utf8');
    else if(inputPath==='data/question_identity_map.json')bytes=Buffer.from(identityText,'utf8');
    else if(inputPath==='data/question_metadata.json')bytes=Buffer.from(metadataText,'utf8');
    else bytes=Buffer.from(fs.readFileSync(path.join(root,'archive',inputPath),'utf8').replace(/^\uFEFF/,'').replace(/\r\n/g,'\n'),'utf8');
    return {path:inputPath,sha256:sha(bytes)};
  });
  const manifest={schemaVersion:'archive2-canonical-input-manifest-v1',resolverVersion:core.Canonical.RESOLVER_VERSION,generatedFromCatalogIndexVersion:indexVersion,projectionVersion:await core.Canonical.computeProjectionVersion(manifestFiles,core.Canonical.RESOLVER_VERSION),files:manifestFiles};
  const manifestText=JSON.stringify(manifest)+'\n';

  // Keep index reports accurate for this one registered exam.
  const officialSource=fs.readFileSync(path.join(root,'archive/tools/build-question-index.mjs'),'utf8').split('const OFFICIAL_KEYS')[0];
  const keyRegion=officialSource.slice(officialSource.indexOf('const MASTER_TABLE = {'));
  const officialKeys=new Set([...keyRegion.matchAll(/^\s*"([A-Z][A-Z0-9-]+)"\s*:\s*\{/gm)].map(x=>x[1]));
  const keyClass=k=>!String(k||'').trim()?'empty':officialKeys.has(String(k).trim())?'official':String(k).trim().startsWith('RAW-')?'raw':'invalid';
  const delta={official:0,raw:0,invalid:0,empty:0,missing:{id:0,content:0,choices:0,level:0,standardUnit:0,standardUnitKey:0,standardCourse:0,tags:0},visual:{image:0,img:0,svg:0,table:0,total:0}};
  const bankWindow={};vm.runInNewContext(fs.readFileSync(abs(assignment.productionRelativePath),'utf8'),{window:bankWindow,console:{log(){},warn(){},error(){}}});
  const bank=bankWindow.questions||bankWindow.questionBank;if(!Array.isArray(bank)||bank.length!==questionCount)throw Error('target source bank denominator mismatch');
  for(const r of targetIndex){delta[keyClass(r.standardUnitKey)]++;for(const k of Object.keys(delta.missing)){const value=k==='standardCourse'?r.course:r[k==='id'?'id':k==='content'?'contentText':k==='choices'?'choicesText':k==='level'?'level':k==='standardUnit'?'standardUnit':k==='standardUnitKey'?'standardUnitKey':'tags'];if(k==='choices'&&(!Array.isArray(bank[r.sourceOrdinal-1]?.choices)||!bank[r.sourceOrdinal-1].choices.length)||k!=='choices'&&(value===undefined||value===null||value===''))delta.missing[k]++;}
    const text=String(r.contentText||'').toLowerCase(),question=bank[r.sourceOrdinal-1];if(question.image!==undefined&&question.image!==null&&String(question.image).trim())delta.visual.image++;if(/<img\b/.test(text))delta.visual.img++;if(/<svg\b/.test(text))delta.visual.svg++;if(/<table\b/.test(text))delta.visual.table++;if(r.hasImage)delta.visual.total++;}
  const dbBytes=Buffer.byteLength(dbText,'utf8'),examBytes=Number((fs.readFileSync(path.join(root,'archive/question-index-report.md'),'utf8').match(/시험지 JS 총 크기: (\d+) bytes/)||[])[1]||0)+Buffer.byteLength(fs.readFileSync(abs(assignment.productionRelativePath)),'utf8'),indexBytes=Buffer.byteLength(indexText,'utf8');
  const escapeRe=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const readNum=(text,prefix)=>{const m=text.match(new RegExp('^'+escapeRe(prefix)+'(\\d+)','m'));if(!m)throw Error('report number missing: '+prefix);return Number(m[1]);};
  const writeNum=(text,prefix,value)=>{const re=new RegExp('(^'+escapeRe(prefix)+')(\\d+)(.*$)','m');if(!re.test(text))throw Error('report line missing: '+prefix);return text.replace(re,(_,a,n,tail)=>a+value+tail);};
  let report=backup.get('archive/question-index-report.md').toString('utf8');
  const rline=(label)=>'- '+label+': ';
  report=writeNum(report,rline('시험지 수(db.js)'),dbAfter.mainDB.exams.length);
  report=writeNum(report,rline('시험지 파일 수'),dbAfter.mainDB.exams.length);
  report=writeNum(report,rline('원본 문항 수(중복 제거 전)'),indexRows.length);
  report=writeNum(report,rline('최종 인덱스 문항 수(중복 제거 후)'),indexRows.length);
  report=writeNum(report,rline('db.js 크기'),dbBytes);
  report=writeNum(report,rline('시험지 JS 총 크기'),examBytes);
  report=writeNum(report,rline('인덱스 크기'),indexBytes);
  for(const [label,amount] of [['공식(official)',delta.official],['RAW-(임시 규약, 허용)',delta.raw],['비공식(invalid)',delta.invalid],['빈 키(empty)',delta.empty]])report=writeNum(report,rline(label),readNum(report,rline(label))+amount);
  for(const [label,key] of [['누락 id','id'],['누락 content','content'],['누락 choices','choices'],['누락 level','level'],['누락 standardUnit','standardUnit'],['누락 standardUnitKey','standardUnitKey'],['누락 standardCourse','standardCourse'],['누락 tags','tags']])report=writeNum(report,rline(label),readNum(report,rline(label))+delta.missing[key]);
  for(const [label,key] of [['q.image 보유','image'],['content 내부 <img>','img'],['content 내부 <svg>','svg'],['content 내부 <table>','table'],['시각요소 보유(hasImage=true, OR 합산)','total']])report=writeNum(report,rline(label),readNum(report,rline(label))+delta.visual[key]);
  let audit=backup.get('archive/question-index-audit.md').toString('utf8');
  audit=audit.replace(/(인덱싱\()\d+(파일\)\.)/,`$1${dbAfter.mainDB.exams.length}$2`);
  audit=writeNum(audit,'- 원본 문항 수: ',indexRows.length);
  audit=writeNum(audit,'- 최종 인덱스 문항 수: ',indexRows.length);
  if(delta.invalid!==0)throw Error('target adds invalid keys; detailed audit patch required');  for(const [label,key] of [['id','id'],['content','content'],['choices(배열)','choices'],['level','level'],['standardUnit','standardUnit'],['standardUnitKey','standardUnitKey'],['standardCourse','standardCourse'],['tags','tags']])audit=writeNum(audit,'| '+label+' | ',readNum(audit,'| '+label+' | ')+delta.missing[key]);
  for(const [label,key] of [['q.image 보유','image'],['content <img>','img'],['content <svg>','svg'],['content <table>','table'],['시각요소 보유(hasImage=true)','total']])audit=writeNum(audit,'| '+label+' | ',readNum(audit,'| '+label+' | ')+delta.visual[key]);  // Keep old non-target rows/values and verify transaction before committing bytes.
  const dbFinal={};vm.runInNewContext(dbText,{window:dbFinal});
  const identityFinal=identityNext,metadataFinal=metadataNext;
  const indexFinal={};vm.runInNewContext(indexText,{window:indexFinal});
  const catalogFinal=core.decodeCatalog(JSON.parse(packedText));
  const runtimeFinalWindow={};vm.runInNewContext(identityRuntimeText,{window:runtimeFinalWindow});
  if(!deep(dbBase.mainDB.exams,dbFinal.mainDB.exams.filter(x=>x.file!==targetFile)))throw Error('non-target DB exam values changed');
  if(!deep(identityBase.records,identityFinal.records.filter(x=>x.sourceArchiveFile!==targetFile)))throw Error('non-target identity values changed');
  if(!deep(metadataBase.records,metadataFinal.records.filter(x=>x.sourceArchiveFile!==targetFile)))throw Error('non-target metadata values changed');
  if(!deep(indexBase.questionIndex,indexFinal.questionIndex.filter(x=>x.sourceFile!==targetFile)))throw Error('non-target question-index values changed');
  if(!deep(catalogBase.records,catalogFinal.records.filter(x=>x.sourceFile!==targetFile)))throw Error('non-target catalog values changed');
  for(const [uid,tuple] of Object.entries(runtimeBase.byUid))if(!deep(tuple,runtimeFinalWindow.questionIdentity.byUid[uid]))throw Error('non-target runtime tuple changed: '+uid);
  if(!deep(runtimeBase.files,runtimeFinalWindow.questionIdentity.files.slice(0,runtimeBase.files.length)))throw Error('non-target runtime file indices changed');
  if(!deep(runtimeBase.byFile,runtimeFinalWindow.questionIdentity.byFile) && Object.keys(runtimeBase.byFile).some(k=>!deep(runtimeBase.byFile[k],runtimeFinalWindow.questionIdentity.byFile[k])))throw Error('non-target runtime byFile values changed');
  if(!deep(targetQids,targetCatalog.map(x=>Number(x.sourceOrdinal)).sort((a,b)=>a-b))||!targetCatalog.every(x=>x.sourceStatus==='VERIFIED'))throw Error('target catalog source integrity/denominator failure');
  if(!deep(targetQids,metadataNext.records.filter(x=>x.sourceArchiveFile===targetFile).map(x=>Number(x.sourceOrdinal)).sort((a,b)=>a-b)))throw Error('target metadata qid coverage failure');

  const outputs={
    'archive/db.js':Buffer.from(dbText,'utf8'),
    'archive/data/question_identity_map.json':Buffer.from(identityText,'utf8'),
    'archive/data/question_metadata.json':Buffer.from(metadataText,'utf8'),
    'archive/question-identity.js':Buffer.from(identityRuntimeText,'utf8'),
    'archive/question-index.js':Buffer.from(indexText,'utf8'),
    'archive/question-index-report.md':Buffer.from(report,'utf8'),
    'archive/question-index-audit.md':Buffer.from(audit,'utf8'),
    'archive/data/archive2-catalog.json':Buffer.from(packedText,'utf8'),
    'archive/data/archive2-canonical-input-manifest.json':Buffer.from(manifestText,'utf8')
  };
  // Check again immediately before writes; never overwrite concurrent registry edits.
  for(const rel of allowed)if(shaFile(abs(rel))!==before[rel])throw Error('BASELINE_CHANGED_DURING_PREPARATION:'+rel);
  if(shaFile(abs(assignment.productionRelativePath))!==assignment.artifactRawSha256)throw Error('SOURCE_CHANGED_DURING_PREPARATION');
  for(const asset of assignment.releaseAssets)if(shaFile(safe('archive/'+asset.ref))!==asset.sha256)throw Error('ASSET_CHANGED_DURING_PREPARATION');
  if(args.apply){writesStarted=true;for(const rel of allowed)fs.writeFileSync(abs(rel),outputs[rel]);}
  const actualOut=Object.fromEntries(allowed.map(rel=>[rel,sha(Buffer.from(outputs[rel],'utf8'))]));
  const receipt={schemaVersion:'JS_ARCHIVE_TARGET_ONLY_REGISTRATION_APPLICATION_V1',status:args.apply?'APPLIED_PENDING_VALIDATORS':'PLAN_VALIDATED_NOT_APPLIED',runId:assignment.runId,examUid:assignment.examUid,head:assignment.expectedHead,sourceArtifactSha256:assignment.artifactRawSha256,sourceArtifactBlobSha1:assignment.validatorRawBufferBlobSha1,targetQidSet:targetQids,targetCounts:{identity:targetIds.length,metadata:targetMeta.length,index:targetIndex.length,catalog:targetCatalog.length,db:1},nonTargetInvariant:{dbExamRows:dbBase.mainDB.exams.length,identityRows:identityBase.records.length,metadataRows:metadataBase.records.length,indexRows:indexBase.questionIndex.length,catalogRows:catalogBase.records.length,allPreservedByDeepComparison:true,identityRuntimeTuplesPreserved:true},metaProjection:{targetFieldStatusCounts:metadataNext.records.filter(x=>x.sourceArchiveFile===targetFile).reduce((o,x)=>{for(const [k,v] of Object.entries(x.fieldStatus||{}))o[k+'='+v]=(o[k+'='+v]||0)+1;return o;},{}),targetNullProblemType:targetMeta.filter(x=>x.problemTypeKey==null||x.problemTypeKey==='').length,targetNullTemplate:targetMeta.filter(x=>x.templateKey==null||x.templateKey==='').length,semanticFieldsCopiedUnchanged:true},catalog:{records:catalogFinal.records.length,exams:catalogFinal.exams.length,identityDigest:identityNext.identityDigest,indexVersion:catalogFinal.indexVersion,projectionVersion:manifest.projectionVersion,targetAutomaticCount:targetResults.filter(x=>x.ok).length},assets:assignment.releaseAssets.map(x=>({ref:x.ref,sha256:shaFile(safe('archive/'+x.ref)),expectedSha256:x.sha256})),changedFiles:allowed.map(rel=>({path:rel,beforeSha256:before[rel],afterSha256:actualOut[rel]})),checks:{baselineSnapshotExact:true,targetOrdinalCoverage:true,nonTargetRowsUnchanged:true,sourceAssetHashesMatch:true,sourceStatusVerified:true,manifestGeneratedFromCurrentCatalog:true},createdAt:now};
  fs.writeFileSync(path.join(evidence,'target-registration.receipt.json'),JSON.stringify(receipt,null,2)+'\n');
  console.log(JSON.stringify({status:receipt.status,targetCounts:receipt.targetCounts,nonTargetInvariant:receipt.nonTargetInvariant,catalog:receipt.catalog,changedFiles:receipt.changedFiles.map(x=>x.path)},null,2));
} catch(error) {
  restore();
  fs.writeFileSync(path.join(evidence,'target-registration.failure.json'),JSON.stringify({schemaVersion:'JS_ARCHIVE_TARGET_ONLY_REGISTRATION_FAILURE_V1',message:String(error?.stack||error),restoredExactOriginalBytes:true,createdAt:now},null,2)+'\n');
  throw error;
}

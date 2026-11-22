// Read-only verification after the official writer, before catalog/4slot build.
// Issued receipts are local at this stage; the candidate inputs are immutable Git.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { materializeReviewedSourceMetadata, SOURCE_METADATA_MANIFEST_SCHEMA, M3_SOURCE_METADATA_PROFILE } from '../../archive/tools/meta-foundation/materialize-reviewed-source-metadata.mjs';
import { questionMetadataBytesAt } from '../../archive/tools/meta-foundation/question-metadata-format.mjs';
import { registerReviewedExamV2 } from '../../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs';
import { loadActiveMetaRegistry } from '../../archive/tools/meta-foundation/active-registry.mjs';
import { loadBank } from '../../archive/tools/meta-foundation/auto-register-merged-source.mjs';
import { validateReviewedSourceReassessment } from '../../archive/tools/meta-foundation/reviewed-source-reassessment.mjs';
import { REVIEWED_META_VALUE_FIELDS } from '../../archive/tools/meta-foundation/reviewed-meta-value-fields.mjs';

const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const same=(a,b)=>stable(a)===stable(b),GIT=/^[a-f0-9]{40}$/,SHA=/^[a-f0-9]{64}$/;
const exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&same(Object.keys(x).sort(),[...keys].sort());
const fail=m=>{throw Error('HOLD_METADATA_REPLAY_'+m);};
// This named profile carries one already explicit 2015/M3-2 scope. Existing
// aliases may agree with it; neither null nor an opposing grade/semester can
// become a second authority. Nothing here fills or removes an alias.
const SCOPE_ALIASES=Object.freeze({curriculum:['2015'],curriculumKey:['2015'],courseKey:['M3-2'],
  standardCourse:['중3 수학','M3-2'],courseSemester:['M3-2'],semester:[2,'2','2학기'],
  grade:['중3','M3','중학교 3학년'],gradeKey:['M3']});
function assertScopeAliases(row,phase) {
  for(const [field,allowed]of Object.entries(SCOPE_ALIASES))
    if(Object.hasOwn(row||{},field)&&!allowed.some(value=>same(row[field],value)))fail('SCOPE_ALIAS_'+phase+'_'+field);
}
function safe(root,p) {
  if(typeof p!=='string'||path.isAbsolute(p)||/[\\\x00-\x1f]/u.test(p)||p.split('/').some(k=>!k||k==='.'||k==='..'))fail('PATH');
  const full=path.resolve(root,p);
  for(let x=full;x!==root;x=path.dirname(x))if(fs.existsSync(x)&&fs.lstatSync(x).isSymbolicLink())fail('SYMLINK');
  return full;
}
export function verifyHoldMetadataReplay({root,carrierPath,carrierCommit,carrierSha256}) {
  root=fs.realpathSync(root);
  if(!GIT.test(carrierCommit)||!SHA.test(carrierSha256))fail('CARRIER_REFERENCE');
  const run=args=>execFileSync('git',args,{cwd:root,env:{...process.env,GIT_NO_LAZY_FETCH:'1'},maxBuffer:256*1024*1024,timeout:15000,stdio:['ignore','pipe','pipe']});
  function immutable(ref) {
    if(!exact(ref,['commit','path','gitBlobSha1','sha256'])||!GIT.test(ref.commit)||!GIT.test(ref.gitBlobSha1)||!SHA.test(ref.sha256))fail('REFERENCE');
    safe(root,ref.path);const bytes=run(['show',ref.commit+':'+ref.path]);
    if(blob(bytes)!==ref.gitBlobSha1||sha(bytes)!==ref.sha256)fail('IMMUTABLE_BYTES');
    return bytes;
  }
  const carrierBytes=run(['show',carrierCommit+':'+carrierPath]);
  if(sha(carrierBytes)!==carrierSha256||sha(fs.readFileSync(safe(root,carrierPath)))!==carrierSha256)fail('CARRIER_BYTES');
  const c=JSON.parse(carrierBytes),candidate=c.candidate;
  if(c.schemaVersion!=='m3-s2-renderer-hold-metadata-continuity-v1'||c.scope!=='EXACT_M3_SCOPE_METADATA_TRANSPORT_PRESERVE_RENDERER_HOLD'||
    c.decision!=='WITHHOLD_REGISTRATION'||!exact(candidate,['baseCommit','inputCommit','manifestRef','requestRef'])||
    !GIT.test(candidate.baseCommit)||!GIT.test(candidate.inputCommit)||candidate.manifestRef.commit!==candidate.inputCommit)fail('CANDIDATE');
  const manifest=JSON.parse(immutable(candidate.manifestRef)),requestBytes=immutable(candidate.requestRef),request=JSON.parse(requestBytes);
  const sourcePath='archive/exams/'+c.sourceArchiveFile;
  if(manifest.schemaVersion!==SOURCE_METADATA_MANIFEST_SCHEMA||manifest.transportProfile!==M3_SOURCE_METADATA_PROFILE||
    manifest.baseCommit!==candidate.baseCommit||!Array.isArray(manifest.files)||!Array.isArray(manifest.requestRefs))fail('MANIFEST_PROFILE');
  const fileRows=manifest.files.filter(x=>x.path===sourcePath),file=fileRows[0];
  if(fileRows.length!==1||!file.changes?.length)fail('ONE_SOURCE');
  const indices=new Set(file.changes.map(x=>x.requestIndex));
  if(indices.size!==1)fail('ONE_REQUEST');
  const index=[...indices][0],r=manifest.requestRefs[index];
  if(!r||!same({...r,commit:r.commit??candidate.inputCommit},{path:candidate.requestRef.path,blobSha1:candidate.requestRef.gitBlobSha1,
    sha256:candidate.requestRef.sha256,commit:candidate.requestRef.commit}))fail('REQUEST_REF');
  if(request.schemaVersion!=='archive-reviewed-exam-meta-register-request-v2'||request.scope!=='PARTIAL_UIDS'||request.sourceArchiveFile!==c.sourceArchiveFile||
    request.approval?.type!=='FINAL_QA'||request.approval.metadataReviewed!==true||request.registrationMode!==undefined||request.approval.sourceRebind!==undefined||
    !Array.isArray(request.registryChanges)||request.registryChanges.length||!Array.isArray(request.items)||
    !same(request.items.map(({questionUid,sourceOrdinal})=>({questionUid,sourceOrdinal})),c.selected)||request.expectedQuestionCount!==c.sourceQuestionCount)fail('REGISTERED_REQUEST_PROFILE');
  // The writer derives a curriculum alias in its output. Check the actual
  // immutable before row as well, so an explicit old null cannot be confused
  // with an absent property after that derivation.
  const selectedUids=new Set(request.items.map(item=>item.questionUid));
  const initialMetadata=(()=>{
    const raw=questionMetadataBytesAt(root,candidate.baseCommit),document=JSON.parse(raw);
    if(!Array.isArray(document.records))fail('BASE_METADATA_SCOPE');
    return {sha256:sha(raw),records:document.records.filter(row=>selectedUids.has(row.questionUid))};
  })();
  if(initialMetadata.records.length!==request.items.length)fail('BASE_METADATA_SCOPE');
  for(const item of request.items) {
    const rows=initialMetadata.records.filter(row=>row.questionUid===item.questionUid),row=rows[0];
    if(rows.length!==1||row.sourceArchiveFile!==request.sourceArchiveFile||row.sourceOrdinal!==item.sourceOrdinal)fail('BASE_METADATA_SCOPE');
    assertScopeAliases(row,'initial_metadata');
    for(const field of Object.keys(SCOPE_ALIASES))if(Object.hasOwn(item.before||{},field)&&!same(item.before[field],row[field]??null))fail('BASE_METADATA_SCOPE_ALIAS_BEFORE');
  }
  // The correction review approves no curriculum. Require the same explicit
  // native M3 scope carried by this metadata candidate, independently of the
  // negative renderer decision. The official replay below still checks every
  // native after value, ACTIVE tuple, parent, renderer and issued record.
  const nativeReviews=new Map();
  for(const item of request.items) {
    const spec=item.sourceReview,ref=spec?.reviewRef;
    if(spec?.schemaVersion!=='archive-reviewed-source-reassessment-v1'||!GIT.test(spec.reviewCommit||'')||
      !ref||!SHA.test(ref.sha256||'')||!exact(spec,['schemaVersion','reviewCommit','reviewPath','reviewRef',
        ...(Object.hasOwn(spec,'rendererProof')?['rendererProof']:[])]))fail('NATIVE_SCOPE_REFERENCE_REQUIRED');
    safe(root,spec.reviewPath);safe(root,ref.path);
    const key=stable([spec.reviewCommit,spec.reviewPath,ref.path,ref.sha256]);
    if(!nativeReviews.has(key)) {
      const raw=run(['show',spec.reviewCommit+':'+spec.reviewPath]);
      if(sha(raw)!==ref.sha256||sha(fs.readFileSync(safe(root,ref.path)))!==ref.sha256)fail('NATIVE_SCOPE_BYTES');
      const document=JSON.parse(raw),source=run(['show',spec.reviewCommit+':'+sourcePath]);
      if(blob(source)!==document.sourceAfterBlob||sha(source)!==document.sourceAfterSha256)fail('NATIVE_SCOPE_SOURCE_BYTES');
      nativeReviews.set(key,{document,bank:loadBank(source.toString('utf8'),sourcePath)});
    }
    const {document:native,bank:nativeBank}=nativeReviews.get(key),rows=native.items?.filter(row=>row.questionUid===item.questionUid&&row.ordinal===item.sourceOrdinal);
    if(native.schemaVersion!=='m3-s2-complete-semantic-review-v1'||native.sourceArchiveFile!==request.sourceArchiveFile||
      native.questionCount!==request.expectedQuestionCount||rows?.length!==1||
      rows[0].rpm?.sourceComparison?.curriculum!=='2015'||rows[0].rpm?.sourceComparison?.scope!=='M3-2'||
      item.after?.curriculumKey!=='2015'||item.after?.courseKey!=='M3-2'||
      ['curriculum','curriculumKey','courseKey'].some(field=>Object.hasOwn(rows[0].after||{},field)&&
        rows[0].after[field]!==({curriculum:'2015',curriculumKey:'2015',courseKey:'M3-2'})[field]))fail('EXACT_NATIVE_SCOPE_REQUIRED');
    if(nativeBank.length!==request.expectedQuestionCount)fail('NATIVE_SCOPE_DENOMINATOR');
    assertScopeAliases(nativeBank[item.sourceOrdinal-1],'native_source');assertScopeAliases(rows[0].after,'native_after');
  }
  const narrowed={...manifest,requestRefs:[r],outputScope:[sourcePath],files:[{...file,changes:file.changes.map(x=>({...x,requestIndex:0}))}]};
  const result=materializeReviewedSourceMetadata({repoRoot:root,manifest:narrowed,baseCommit:candidate.baseCommit,inputCommit:candidate.inputCommit,
    outputRoot:path.join(path.dirname(root),'.hold-materialization-check-'+carrierSha256),write:false});
  const sourceRaw=fs.readFileSync(safe(root,sourcePath));
  if(result.sourceFiles!==1||result.changedQuestionCount!==c.selected.length||result.repositorySourceWrites!==0||result.newApprovals!==0||
    result.protectedStudentChanges!==0||blob(sourceRaw)!==file.after.blobSha1||sha(sourceRaw)!==file.after.sha256||
    !same(c.materializedSource,{path:sourcePath,gitBlobSha1:file.after.blobSha1,sha256:file.after.sha256}))fail('MATERIALIZED_SOURCE');
  const receiptPath=`archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${request.requestId}.json`;
  if(!/^[A-Za-z0-9][A-Za-z0-9_-]*$/u.test(request.requestId||'')||!fs.existsSync(safe(root,receiptPath)))fail('ISSUED_RECEIPT_REQUIRED');
  const receiptBytes=fs.readFileSync(safe(root,receiptPath)),receipt=JSON.parse(receiptBytes);
  const outputs=receipt.outputDigests?.map(x=>x.path)||[];
  const paths=[...new Set([sourcePath,carrierPath,receiptPath,'archive/data/question_metadata.json','archive/data/question_identity_map.json',...outputs])];
  const before=new Map(paths.map(p=>[p,sha(fs.readFileSync(safe(root,p)))]));
  const replay=registerReviewedExamV2({root,request,write:false,verifyProjection:false});
  if(replay.status!=='PASS'||replay.replay!==true||!Array.isArray(replay.plannedPaths)||replay.plannedPaths.length||
    replay.totalQuestions!==c.selected.length||replay.consumerSearchStatus!=='NOT_RUN')fail('OFFICIAL_ISSUED_REPLAY');
  // A historical plain sourceReview receipt does not have the newer typed
  // sidecar. This contract must still reject deleting its stored native proof,
  // so reproduce each original immutable patch after the whole issued replay.
  const bank=loadBank(sourceRaw.toString('utf8'),sourcePath),registry=loadActiveMetaRegistry(root);
  const canonical={pt:registry.problemTypes,tpl:registry.templates},cache=new Map();
  const metadata=JSON.parse(fs.readFileSync(safe(root,'archive/data/question_metadata.json'))).records;
  if(!Array.isArray(receipt.fingerprintRepairs)||receipt.fingerprintRepairs.length!==request.items.length)fail('ISSUED_NATIVE_PROOF_INVENTORY');
  for(const patch of request.items) {
    const current=metadata.filter(row=>row.questionUid===patch.questionUid),repairs=receipt.fingerprintRepairs.filter(row=>
      row.questionUid===patch.questionUid&&row.sourceOrdinal===patch.sourceOrdinal);
    if(current.length!==1||repairs.length!==1||!repairs[0].sourceReview)fail('ISSUED_NATIVE_PROOF_REQUIRED');
    assertScopeAliases(bank[patch.sourceOrdinal-1],'current_source');assertScopeAliases(current[0],'metadata');
    const proof=validateReviewedSourceReassessment({root,request,patch,metadata:{...current[0],...patch.before},
      question:bank[patch.sourceOrdinal-1],final:current[0],canonicalBefore:canonical,canonicalAfter:canonical,
      supportedFields:new Set(REVIEWED_META_VALUE_FIELDS),issuedSourceReview:repairs[0].sourceReview,cache});
    if(!same(proof,repairs[0].sourceReview))fail('ISSUED_NATIVE_PROOF_CHANGED');
  }
  for(const [p,h]of before)if(sha(fs.readFileSync(safe(root,p)))!==h)fail('INPUT_CHANGED_DURING_REPLAY');
  return {schemaVersion:'archive-renderer-hold-metadata-replay-v1',status:'PASS',officialReplay:true,nativeScopeVerified:true,scopeAliasesVerified:true,requestId:request.requestId,
    requestSelectedCount:c.selected.length,nativeProofReproducedCount:request.items.length,initialMetadataSha256:initialMetadata.sha256,
    carrierSha256,sourceBlobSha1:blob(sourceRaw),sourceSha256:sha(sourceRaw),
    sourceWrites:0,metadataWrites:0,newFourSlotApprovals:0};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    const names={'--root':'root','--carrier-path':'carrierPath','--carrier-commit':'carrierCommit','--carrier-sha256':'carrierSha256'},options={};
    const args=process.argv.slice(2);
    for(let i=0;i<args.length;i+=2){if(!names[args[i]]||options[names[args[i]]]!==undefined||!args[i+1])fail('CLI_ARGUMENT');options[names[args[i]]]=args[i+1];}
    if(Object.keys(options).length!==4)fail('CLI_ARGUMENT');
    process.stdout.write(JSON.stringify(verifyHoldMetadataReplay(options))+'\n');
  }catch(e){process.stderr.write(e.message+'\n');process.exitCode=1;}
}

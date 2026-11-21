import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const studentFields = ['id','questionType','content','choices','answer','solution','image','images','figureSvg','solutionImage','solutionFigureSvg','layoutTag','wide'];
const fields = ['standardCourse','standardUnitKey','standardUnit','subUnitKey','subUnit','level','problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern','difficultyBucket','difficultyConfidence'];
const stable = x => JSON.stringify(x, (_,v) => v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])) : v);
const sha = x => crypto.createHash('sha256').update(x).digest('hex');
const json = x => JSON.stringify(x,null,2)+'\n';
const fail = m => { throw new Error(m); };
function bank(bytes) {
  const ctx = vm.createContext({window:{}}, {codeGeneration:{strings:false,wasm:false}});
  vm.runInContext(bytes.toString('utf8'),ctx,{timeout:3000});
  const rows = ctx.window.questionBank || ctx.window.questions || ctx.window.examData?.questions;
  if (!Array.isArray(rows)) fail('SOURCE_BANK_MISSING');
  return rows;
}
function inside(root, rel) {
  const p=path.resolve(root,rel);
  if (path.isAbsolute(rel) || path.relative(root,p).startsWith('..')) fail('PATH_OUTSIDE_ROOT: '+rel);
  return p;
}

// Preserve native handoffs that cannot yet satisfy the registrar's metadata proof.
// They are access-only submissions: no audited classification is promoted or asserted.
function convertNativePending({root,spec,metadata,identities,input,prod,drive}) {
  const a=input.audit.data,m=input.manifest.data,c=input.classification?.data;
  const sop=a.manifestType==='META_AUDIT_ATOMIC_PACKAGE'&&a.sopVersion==='SOP_v1.2';
  const flat=a.schemaVersion==='ALIVE_META_AUDIT_ATOMIC_PACKAGE_v3';
  const alias=spec.auditedExamAlias&&a.schemaVersion==='ALIVE_META_AUDIT_ATOMIC_v3';
  const sourceOnlyAlias=flat&&spec.sourceOnlyExamAlias;
  if(!sop&&!flat&&!alias)return null;
  if(!c)fail('CLASSIFICATION_REQUIRED');
  const source=spec.sourceArchiveFile,title=path.basename(source,'.js'),id=x=>x.sourceFileDriveId||x.sourceDriveId||x.sourceFileId;
  if(sourceOnlyAlias){if([a,m,c].some(x=>x.examTitle!==spec.sourceOnlyExamAlias))fail('EXAM_IDENTITY_MISMATCH');}
  else if(alias){if(title!==spec.auditedExamAlias+'c'||[a,m,c].some(x=>x.examTitle!==spec.auditedExamAlias))fail('EXAM_IDENTITY_MISMATCH');}
  else if(sop ? [a,m,c].some(x=>x.examSlug!==title)||a.examTitle!==m.examTitle||a.examTitle!==c.examTitle : [a,m,c].some(x=>x.examTitle!==title))fail('EXAM_IDENTITY_MISMATCH');
  const sourceSha=sha(drive), declared=x=>x.sourceSha256||x.sourceFileSha256;
  if([a,m,c].some(x=>declared(x)!==sourceSha))fail('AUDIT_DRIVE_SHA_MISMATCH');
  if(!id(a)||[m,c].some(x=>id(x)!==id(a)))fail('DRIVE_ID_MISMATCH');
  const p=bank(prod),d=bank(drive),n=p.length;
  const rows=sop?[a.auditRecords,m.recordsToBind,c.classificationRecords]:[a.records,m.recordsToBind,c.records];
  if(!n||d.length!==n||rows.some(x=>!Array.isArray(x)||x.length!==n))fail('QUESTION_COUNT_MISMATCH');
  if(sop&&(a.totalQuestionsAudited!==n||a.auditPassedCount!==n||a.holdCount!==0||m.totalQuestionsToRegister!==n||m.readyForRegistrationCount!==n||m.pipelineStatus!=='READY_FOR_COURIER_REGISTRATION'))fail('AUDIT_DENOMINATOR_MISMATCH');
  if(flat&&(a.totalQuestions!==n||a.totalApproved!==n||a.totalHold!==0||m.totalQuestions!==n||m.totalHoldCount!==0||m.status!=='READY_FOR_COURIER_REGISTRATION'))fail('AUDIT_DENOMINATOR_MISMATCH');
  if(alias&&(a.auditVerdict!=='ALL_APPROVED_CANONICAL_STANDARDIZED'||m.status!=='READY_FOR_COURIER_REGISTRATION'||(a.statistics?(a.statistics.totalQuestions!==n||a.statistics.approved!==n||a.statistics.holdRemaining!==0||a.statistics.newTemplatesCreated!==0):(a.totalAuditedCount!==n||a.zeroStubCertified!==true))))fail('AUDIT_DENOMINATOR_MISMATCH');
  if(sop&&a.auditStatus!=='AUDIT_COMPLETE_100_PERCENT_PASS'||flat&&!['AUDIT_COMPLETE_ALL_APPROVED','PASSED_CANONICAL_AUDIT'].includes(a.auditStatus))fail('AUDIT_NOT_APPROVED');
  const maps=rows.map(rs=>{const map=new Map();for(const row of rs){const i=Number(sop?row.questionNumber:row.questionId);if(!Number.isInteger(i)||i<1||i>n||map.has(i))fail('DUPLICATE_OR_INVALID_ORDINAL');if(sop&&Number(row.sourceQuestionId)!==i)fail('ORDINAL_ID_MISMATCH');map.set(i,row);}return map;});
  const pairs=sop?['primaryTaxonomy','templatePattern','crossConcepts']:['problemTypeKey','templateKey','crossConceptKeys'];
  for(let i=1;i<=n;i++){
    const verdict=maps[0].get(i).auditVerdict;
    if(sop&&(verdict||maps[0].get(i).auditStatus)!=='PASS'||flat&&verdict!=='APPROVED_CANONICAL'||alias&&verdict!==undefined&&verdict!=='APPROVED')fail('QUESTION_AUDIT_NOT_APPROVED: '+i);
    if(sop&&maps[1].get(i).registrationStatus!=='READY_FOR_COURIER_REGISTRATION')fail('QUESTION_NOT_READY: '+i);
    for(const key of pairs){const v=maps.map((map,index)=>index===0&&alias?(map.get(i).classification||map.get(i))[key]:map.get(i)[key]);if(v.some(x=>x===undefined)||stable(v[0])!==stable(v[1])||stable(v[1])!==stable(v[2]))fail('CLASSIFICATION_PARITY_MISMATCH: '+i+'.'+key);}
  }
  const metas=metadata.records.filter(r=>r.sourceArchiveFile===source), ids=identities.records.filter(r=>r.sourceArchiveFile===source);
  if(metas.length!==n||ids.length!==n)fail('UID_COUNT_MISMATCH');
  const sourceBlobSha1=crypto.createHash('sha1').update('blob '+prod.length+'\0').update(prod).digest('hex'),outputs=new Map(),refs=[],prefix='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+spec.requestId;
  const evidence=(name,bytes)=>{const path=prefix+'.'+name+'.json';outputs.set(path,bytes);const ref={path,sha256:sha(bytes)};refs.push(ref);return ref;};
  const auditRef=evidence('audit',input.audit.bytes),manifestRef=evidence('manifest',input.manifest.bytes),classificationRef=evidence('classification',input.classification.bytes);
  const seen=new Set(),parity=[],items=[];
  for(let i=0;i<n;i++){
    if(stable(p[i].id??null)!==stable(d[i].id??null))fail('SOURCE_QUESTION_ID_MISMATCH: '+(i+1));
    const meta=metas.filter(x=>Number(x.sourceOrdinal)===i+1), identity=ids.filter(x=>Number(x.sourceOrdinal)===i+1);
    if(meta.length!==1||identity.length!==1||!meta[0].questionUid||meta[0].questionUid!==identity[0].questionUid||seen.has(meta[0].questionUid))fail('UID_MISMATCH: '+(i+1));
    const uid=meta[0].questionUid;seen.add(uid);const payload=q=>stable(Object.fromEntries(studentFields.map(f=>[f,Object.hasOwn(q,f)?q[f]:null]))),changed=studentFields.filter(f=>stable(p[i][f]??null)!==stable(d[i][f]??null));
    if(alias&&changed.some(f=>!['solution','solutionImage','solutionFigureSvg'].includes(f)))fail('ALIAS_STUDENT_PAYLOAD_MISMATCH: '+(i+1));
    if(sourceOnlyAlias){
      const norm=x=>typeof x==='string'?x.replace(/\\\\(?=[A-Za-z])/g,'\\').replace(/\s+/g,' ').trim():x;
      const prompt=q=>norm(q.content??q.question??q.stem??'');
      if(!prompt(d[i])||prompt(d[i])!==prompt(p[i])||stable((d[i].choices||[]).map(norm))!==stable((p[i].choices||[]).map(norm))||(d[i].answer??'')!==''||['image','images','figureSvg'].some(f=>stable(d[i][f]??null)!==stable(p[i][f]??null)))fail('SOURCE_ONLY_ALIAS_PAYLOAD_MISMATCH: '+(i+1));
    }
    parity.push({sourceOrdinal:i+1,questionId:i+1,questionUid:uid,driveStudentPayloadSha256:sha(payload(d[i])),productionStudentPayloadSha256:sha(payload(p[i])),studentPayloadEqual:changed.length===0,changedFields:changed});
    items.push({questionUid:uid,sourceOrdinal:i+1,before:{},after:{},evidenceRefs:[],reason:'Access-only provisional submission; original metadata audit requires registrar-compatible evidence.'});
  }
  const parityRef=evidence('source-parity',Buffer.from(json({schemaVersion:'archive-meta-pipeline-source-parity-v1',sourceFileDriveId:id(a),sourceArchiveFile:source,...(alias?{auditedExamAlias:spec.auditedExamAlias,aliasBasis:'EXACT_NON_SOLUTION_FIELDS_AND_UID_ORDINAL_PARITY'}:{}),...(sourceOnlyAlias?{auditedExamAlias:spec.sourceOnlyExamAlias,aliasBasis:'NORMALIZED_PROMPT_CHOICES_EXACT_IMAGES_EMPTY_AUDIT_ANSWERS_UID_ORDINAL'}:{}),auditSourceSha256:sourceSha,driveSourceSha256:sourceSha,productionSourceSha256:sha(prod),productionSourceBlobSha1:sourceBlobSha1,parityBasis:'PER_UID_STUDENT_FIELDS',status:parity.every(x=>x.studentPayloadEqual)?'EXACT_STUDENT_VISIBLE_PARITY':'CURRENT_SOURCE_PRESERVED_WITH_SUPPLEMENTS',studentFields,questionCount:n,records:parity})));
  const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:spec.requestId,examUid:title,sourceArchiveFile:source,expectedSourceBlobSha1:sourceBlobSha1,expectedQuestionCount:n,approval:{type:'META_PIPELINE_AUDIT',metadataReviewed:false,approvedBy:'SOURCE_ONLY_PROVISIONAL_INPUT_NOT_A_METADATA_REVIEW',evidenceRefs:refs,metaPipelineAudit:{schemaVersion:'source-only-provisional-not-registrar-proof-v1',authorityStatus:'EVIDENCE_DEBT',sourceFileDriveId:id(a),auditPackageRef:auditRef,manifestRef,classificationRef,sourceParityRef:parityRef}},registryChanges:[],items,supplements:[{reason:'REGISTRAR_COMPATIBLE_METADATA_PROOF_REQUIRED',status:'NOT_VERIFIED'},...parity.filter(x=>!x.studentPayloadEqual).map(x=>({questionUid:x.questionUid,sourceOrdinal:x.sourceOrdinal,reason:'SOURCE_VERSION_CHANGED',fields:x.changedFields,policy:'PRESERVE_CURRENT_PRODUCTION'}))],provisionalApproval:{policy:'STUDENT_ACCESS_FIRST',verificationStatus:'NOT_VERIFIED',metadataApprovalStatus:'USER_APPROVED_PENDING_SUPPLEMENT'}};
  if(alias)for(let i=1;i<=n;i++)if(maps[0].get(i).auditVerdict===undefined)request.supplements.push({questionUid:parity[i-1].questionUid,sourceOrdinal:i,reason:'ROW_AUDIT_VERDICT_NOT_PROVIDED',status:'NOT_VERIFIED'});
  outputs.set('.archive-meta-register/inbox/'+spec.requestId+'.json',Buffer.from(json(request)));return {request,outputs};
}

// Pure preparation: output files are returned in memory. No production writes,
// approval execution, network access, Git operations or semantic corrections.
export function convertPackage({root, spec, metadata, identities, master}) {
  if (!/^[a-zA-Z0-9_-]+$/.test(spec.requestId||'')) fail('REQUEST_ID_INVALID');
  const source=spec.sourceArchiveFile;
  const prod=fs.readFileSync(inside(root,'archive/exams/'+source));
  const drive=fs.readFileSync(spec.driveSource);
  const input={};
  for (const key of ['audit','manifest','classification']) {
    if (spec[key]) {const bytes=fs.readFileSync(spec[key]); input[key]={bytes,data:JSON.parse(bytes.toString('utf8'))};}
  }
  const a=input.audit?.data,m=input.manifest?.data,c=input.classification?.data;
  if (!a || !m) fail('AUDIT_MANIFEST_REQUIRED');
  const native=convertNativePending({root,spec,metadata,identities,input,prod,drive});
  if(native)return native;
  const title=path.basename(source,'.js');
  const auditTitle=a.examTitle??a.examId, manifestTitle=m.examTitle??m.examId, classificationTitle=c?.examTitle??c?.examId;
  if (auditTitle!==title || manifestTitle!==title || c && classificationTitle!==title) fail('EXAM_IDENTITY_MISMATCH');
  const driveSha=sha(drive),productionSha=sha(prod),sourceVersionDrift=driveSha!==productionSha;
  if (a.sourceSha256!==driveSha || m.sourceSha256!==driveSha || c && c.sourceSha256!==driveSha) fail('AUDIT_DRIVE_SHA_MISMATCH');
  const driveId=x=>x.sourceFileDriveId||x.sourceDriveId||x.sourceFileId;
  const auditDrive=driveId(a);
  if (!auditDrive || auditDrive!==driveId(m) || c && auditDrive!==driveId(c)) fail('DRIVE_ID_MISMATCH');
  const b=bank(prod),d=bank(drive),n=b.length;
  if (!n || d.length!==n || a.records?.length!==n || m.recordsToBind?.length!==n || c && c.records?.length!==n) fail('QUESTION_COUNT_MISMATCH');
  const byOrdinal=rows=>{
    const map=new Map();
    for(const r of rows){const id=Number(r.questionId);if(!Number.isInteger(id)||id<1||id>n||map.has(id))fail('DUPLICATE_OR_INVALID_ORDINAL');map.set(id,r);}
    return map;
  };
  const audits=byOrdinal(a.records); byOrdinal(m.recordsToBind); if(c)byOrdinal(c.records);
  const metas=metadata.records.filter(r=>r.sourceArchiveFile===source);
  const ids=identities.records.filter(r=>r.sourceArchiveFile===source);
  if(metas.length!==n||ids.length!==n)fail('UID_COUNT_MISMATCH');
  const uidSet=new Set(), parity=[],supplements=[];
  const sourceBlobSha1=crypto.createHash('sha1').update('blob '+prod.length+'\0').update(prod).digest('hex');
  const prefix='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+spec.requestId;
  const outputs=new Map(),refs=[];
  const evidence=(name,bytes)=>{const p=prefix+'.'+name+'.json';outputs.set(p,bytes);const ref={path:p,sha256:sha(bytes)};refs.push(ref);return ref;};
  const auditRef=evidence('audit',input.audit.bytes),manifestRef=evidence('manifest',input.manifest.bytes);
  const classRef=c?evidence('classification',input.classification.bytes):null;
  for(let i=0;i<n;i++) {
    const meta=metas.find(r=>Number(r.sourceOrdinal)===i+1),id=ids.find(r=>Number(r.sourceOrdinal)===i+1);
    if(!meta?.questionUid||meta.questionUid!==id?.questionUid||uidSet.has(meta.questionUid))fail('UID_MISMATCH: '+(i+1));uidSet.add(meta.questionUid);
    const payload=q=>stable(Object.fromEntries(studentFields.map(f=>[f,Object.hasOwn(q,f)?q[f]:null])));
    const changed=studentFields.filter(f=>stable(b[i][f]??null)!==stable(d[i][f]??null));
    if(changed.length)supplements.push({questionUid:meta.questionUid,sourceOrdinal:i+1,reason:'SOURCE_VERSION_CHANGED',fields:changed,policy:'PRESERVE_CURRENT_PRODUCTION'});
    parity.push({sourceOrdinal:i+1,questionId:i+1,questionUid:meta.questionUid,driveStudentPayloadSha256:sha(payload(d[i])),productionStudentPayloadSha256:sha(payload(b[i])),studentPayloadEqual:changed.length===0});
  }
  const parityRef=evidence('source-parity',Buffer.from(json({schemaVersion:'archive-meta-pipeline-source-parity-v1',sourceFileDriveId:auditDrive,sourceArchiveFile:source,auditSourceSha256:driveSha,driveSourceSha256:driveSha,productionSourceSha256:productionSha,productionSourceBlobSha1:sourceBlobSha1,parityBasis:sourceVersionDrift?'PER_UID_STUDENT_FIELDS':'EXACT_SOURCE_SHA256',sourceVersionDrift,status:parity.every(r=>r.studentPayloadEqual)?'EXACT_STUDENT_VISIBLE_PARITY':'CURRENT_SOURCE_PRESERVED_WITH_SUPPLEMENTS',studentFields,questionCount:n,records:parity})));
  const rich=Array.isArray(a.boundAtomicCrossConcepts)&&a.records[0]?.classification;
  const flat=a.sourceDriveId&&!Object.hasOwn(a,'boundAtomicCrossConcepts')&&a.records[0]?.difficulty;
  const proofVersion=rich?1:flat?3:2;
  if(a.schemaVersion!=='ALIVE_META_AUDIT_ATOMIC_v3'&&a.schemaVersion!=='META_AUDIT_ATOMIC_PACKAGE_v2'&&a.schemaVersion!=='SOP_v1.2_AUDIT_ATOMIC')fail('UNSUPPORTED_AUDIT_SCHEMA');
  if(!rich&&!c)fail('CLASSIFICATION_REQUIRED');
  const masterPath='docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
  const masterRef={path:masterPath,sha256:sha(fs.readFileSync(inside(root,masterPath)))};refs.push(masterRef);
  const items=parity.map((p,i)=>{
    const current=metas.find(r=>r.questionUid===p.questionUid),row=audits.get(i+1),cls=row.classification||row;
    const after={};
    for(const f of fields) {if(Object.hasOwn(cls,f))after[f]=cls[f];else if(Object.hasOwn(row,f))after[f]=row[f];}
    // Concurrent difficulty/source-solution writers own those values.
    for(const f of ['difficultyBucket','difficultyConfidence','level']) {
      const latest=current[f]??b[i][f];
      if(Object.hasOwn(after,f)&&stable(after[f])!==stable(latest))supplements.push({questionUid:p.questionUid,reason:'PRESERVE_CURRENT_DIFFICULTY',field:f});
      delete after[f];
    }
    const before={}; for(const f of new Set([...Object.keys(after),'L1','L2','L3','L4']))before[f]=current[f]??null;
    const sourceMetadataBefore=Object.fromEntries(fields.filter(f=>Object.hasOwn(b[i],f)).map(f=>[f,b[i][f]]));
    const scope=current.standardCourse, candidates=master.records.filter(r=>r.curriculum===(current.curriculum||current.curriculumKey)&&r.scope===scope&&r.majorUnit===current.L1&&r.midUnit===current.L2);
    const parent=spec.parentRefs?.[p.questionUid] || (candidates.length===1?{path:masterPath,curriculum:candidates[0].curriculum,scope:candidates[0].scope,majorUnit:candidates[0].majorUnit,midUnit:candidates[0].midUnit}:null);
    if(!parent)supplements.push({questionUid:p.questionUid,reason:'PARENT_REFERENCE_REQUIRED'});
    return {questionUid:p.questionUid,sourceOrdinal:i+1,before,after,sourceMetadataBefore,...(parent?{targetParentRef:parent}:{}),evidenceRefs:[...refs],reason:'Submit supplied audit metadata; preserve current production content and difficulty.'};
  });
  const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:spec.requestId,examUid:title,sourceArchiveFile:source,expectedSourceBlobSha1:sourceBlobSha1,expectedQuestionCount:n,approval:{type:'META_PIPELINE_AUDIT',metadataReviewed:true,approvedBy:'CODEX_META_PIPELINE_COURIER',evidenceRefs:refs,metaPipelineAudit:{schemaVersion:'meta-pipeline-audit-approval-v'+proofVersion,sourceFileDriveId:auditDrive,auditPackageRef:auditRef,manifestRef,sourceParityRef:parityRef,...(classRef?{classificationRef:classRef}:{}),existingConceptReviews:spec.existingConceptReviews||[],unreviewedFields:spec.unreviewedFields||[]}},registryChanges:spec.registryChanges||[],items};
  request.supplements=supplements;
  request.provisionalApproval={policy:'STUDENT_ACCESS_FIRST',verificationStatus:'NOT_VERIFIED',metadataApprovalStatus:'USER_APPROVED_PENDING_SUPPLEMENT'};
  outputs.set('.archive-meta-register/inbox/'+spec.requestId+'.json',Buffer.from(json(request)));
  return {request,outputs};
}

export function runBatch({root,batch,out,write=false}) {
  const read=rel=>JSON.parse(fs.readFileSync(inside(root,rel),'utf8'));
  const common={root,metadata:read('archive/data/question_metadata.json'),identities:read('archive/data/question_identity_map.json'),master:read('docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json')};
  const results=[],seen=new Set();
  for(const spec of batch.packages){try{
    if(seen.has(spec.requestId))fail('DUPLICATE_REQUEST_ID');seen.add(spec.requestId);
    const result=convertPackage({...common,spec});
    for(const [rel,bytes] of result.outputs){const dest=inside(out,rel);if(fs.existsSync(dest)&&!fs.readFileSync(dest).equals(bytes))fail('OUTPUT_CONFLICT: '+rel);}
    if(write)for(const [rel,bytes] of result.outputs){const dest=inside(out,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes);}
    results.push({requestId:spec.requestId,status:write?'CONVERTED':'DRY_RUN',questionCount:result.request.items.length,registrationStatus:'NOT_RUN'});
  }catch(e){results.push({requestId:spec.requestId,status:'BLOCKED',reason:e.message});}}
  return results;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=process.argv.slice(2),get=k=>args[args.indexOf(k)+1];
  if(!args.includes('--batch')||!args.includes('--out')){console.error('Usage: node tools/convert-meta-pipeline.mjs --batch batch.json --out STAGING_DIR [--root REPO] [--write]');process.exitCode=2;}
  else{const root=path.resolve(args.includes('--root')?get('--root'):'.'),out=path.resolve(get('--out'));if(out===root)throw Error('Use a separate staging directory');const batch=JSON.parse(fs.readFileSync(get('--batch'),'utf8'));console.log(json(runBatch({root,out,batch,write:args.includes('--write')})));}
}

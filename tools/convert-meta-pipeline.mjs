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
  const rows = ctx.window.questionBank || ctx.window.questions;
  if (!Array.isArray(rows)) fail('SOURCE_BANK_MISSING');
  return rows;
}
function inside(root, rel) {
  const p=path.resolve(root,rel);
  if (path.isAbsolute(rel) || path.relative(root,p).startsWith('..')) fail('PATH_OUTSIDE_ROOT: '+rel);
  return p;
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

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileRef,readBoundFile,objectSha} from '../../pipeline-core/canonical.mjs';
import {normalizeSourceExamIdRegistry,questionUidV2,createUidMigrationEvidence} from '../../pipeline-core/question-uid.mjs';
import {loadBank} from '../build-visual-render-matrix.mjs';

// Registration is an explicit operator action, not a side effect of a render.
// Preserve the existing exam identifier and map-backed file/ordinal identity;
// never infer approval from a successful locator, source solution, or filename.
export function registerSourceAuthority(root,{targets,identityMapRef,decision,previousRegistry=null}) {
  if(decision?.authority!=='DIRECT_USER_INSTRUCTION'||!decision.request||decision.scope!=='CURRENT_SOURCE_IDENTITY_REGISTRATION_ONLY')throw Error('SOURCE_REGISTRATION_DECISION_REQUIRED');
  if(identityMapRef?.path!=='archive/data/question_identity_map.json')throw Error('SOURCE_IDENTITY_MAP_CANONICAL_PATH_REQUIRED');
  if(!Array.isArray(targets)||!targets.length)throw Error('SOURCE_REGISTRATION_TARGETS_REQUIRED');
  const map=JSON.parse(readBoundFile(root,identityMapRef));
  if(map.schemaVersion!=='question-identity-map-v1'||map.identityAlgorithm?.version!=='qid_v1')throw Error('SOURCE_IDENTITY_MAP_INVALID');
  const prior=previousRegistry?normalizeSourceExamIdRegistry(previousRegistry).entries:[];
  const entries=[],migrations=[],roster=[],seen=new Set();
  for(const target of targets){
    const {sourcePath,sourceQuestionOrdinal,group}=target;
    if(typeof sourcePath!=='string'||!sourcePath.startsWith('archive/exams/original/')||!['GEOMETRY','GRAPH'].includes(group)||!Number.isSafeInteger(sourceQuestionOrdinal)||sourceQuestionOrdinal<1)throw Error('SOURCE_REGISTRATION_TARGET_INVALID');
    const archiveFile=sourcePath.slice('archive/exams/'.length).normalize('NFC');
    const matches=map.records.filter(r=>r.sourceArchiveFile.normalize('NFC')===archiveFile&&r.sourceOrdinal===sourceQuestionOrdinal);
    if(matches.length!==1)throw Error('SOURCE_IDENTITY_MAP_TARGET_NOT_UNIQUE');
    const record=matches[0];
    const expected='qid_v1_'+crypto.createHash('sha256').update(archiveFile+'#'+sourceQuestionOrdinal).digest('hex');
    if(record.questionUid!==expected)throw Error('SOURCE_IDENTITY_MAP_UID_MISMATCH');
    const sourceRef=fileRef(root,sourcePath),bank=loadBank(readBoundFile(root,sourceRef).toString('utf8'));
    const question=bank[sourceQuestionOrdinal-1]?JSON.parse(JSON.stringify(bank[sourceQuestionOrdinal-1])):null;
    if(!question||question.id!==sourceQuestionOrdinal||bank.filter(q=>q.id===sourceQuestionOrdinal).length!==1)throw Error('SOURCE_ORDINAL_AND_QUESTION_ID_MISMATCH');
    const sourceIdentityKey='source-file:'+archiveFile;
    const old=prior.find(e=>e.sourceIdentityKey===sourceIdentityKey&&e.status==='ACTIVE');
    const sourceExamId=old?.canonicalSourceExamId??path.posix.basename(sourcePath,'.js').normalize('NFC');
    // A basename collision anywhere in the current source inventory requires
    // an explicit identity decision; it cannot silently share an exam ID.
    const paths=new Set(map.records.filter(r=>path.posix.basename(r.sourceArchiveFile,'.js').normalize('NFC')===sourceExamId).map(r=>r.sourceArchiveFile.normalize('NFC')));
    if(!old&&(paths.size!==1||!paths.has(archiveFile)))throw Error('SOURCE_EXAM_ID_AMBIGUOUS');
    const uid=questionUidV2(sourceExamId,sourceQuestionOrdinal);
    if(seen.has(uid))throw Error('SOURCE_REGISTRATION_DUPLICATE_TARGET');seen.add(uid);
    entries.push({canonicalSourceExamId:sourceExamId,sourceExamId,sourceIdentityKey,status:'ACTIVE',sourceQuestionOrdinal,questionUidV2:uid,legacyQuestionUid:record.questionUid,sourcePath,sourceSha256:sourceRef.sha256});
    migrations.push(createUidMigrationEvidence({legacyQuestionUid:record.questionUid,sourceExamId,sourceQuestionOrdinal,sourcePath,sourceSha256:sourceRef.sha256,reason:'CURRENT_MAP_FILE_ORDINAL_REGISTRATION'}));
    roster.push({...target,questionUidV2:uid,legacyQuestionUid:record.questionUid,sourceRef,questionObjectSha256:objectSha(question),sourceImageRef:question.image?fileRef(root,'archive/'+question.image):null});
  }
  const registry=normalizeSourceExamIdRegistry({entries});
  const registration={schemaVersion:'SOURCE_EXAM_REGISTRATION_DECISION_v1',decision,identityMapRef,registrySha256:objectSha(registry),rosterSha256:objectSha(roster),migrationsSha256:objectSha(migrations),status:'REGISTERED_CURRENT_SOURCE_IDENTITIES',engineQualification:false,productionPublication:false};
  return {registry:{...registry,registration},migrations,roster,registration};
}

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileRef,readBoundFile,objectSha,canonicalJson} from '../../pipeline-core/canonical.mjs';
import {normalizeSourceExamIdRegistry,parseQuestionUidV2,questionIdentityFromRecord} from '../../pipeline-core/question-uid.mjs';
import {loadBank} from '../build-visual-render-matrix.mjs';
import {auditV2Run} from '../../pipeline-core/v2-audit.mjs';
import {prepareProviderReview,dispatchProviderReview} from '../../pipeline-core/provider-bridge.mjs';
import {commitStage} from './store.mjs';

export function resolveQuestion(root,{questionUid,sourceRegistryRef,parentRunRef}) {
  if(!sourceRegistryRef)throw Error('UID_AUTHORITY_REGISTRY_REQUIRED');
  const raw=JSON.parse(readBoundFile(root,sourceRegistryRef));
  if(raw.schemaVersion!=='SOURCE_EXAM_ID_REGISTRY_v1')throw Error('UID_REGISTRY_SCHEMA_INVALID');
  const registry=normalizeSourceExamIdRegistry(raw);
  const identity=questionIdentityFromRecord({questionUid}, {registry});
  const entry=registry.entries.find(e=>e.questionUidV2===identity.questionUidV2&&e.status==='ACTIVE');
  if(!entry || !entry.sourcePath?.startsWith('archive/exams/original/'))throw Error('CURRENT_SOURCE_MAPPING_REQUIRED');
  const sourceRef=fileRef(root,entry.sourcePath);
  if(sourceRef.sha256!==entry.sourceSha256)throw Error('STALE_SOURCE_AUTHORITY');
  const bank=loadBank(readBoundFile(root,sourceRef).toString('utf8'));
  const matches=bank.filter(q=>q.id===entry.sourceQuestionOrdinal);
  if(matches.length!==1)throw Error('SOURCE_QUESTION_MISSING_OR_DUPLICATE');
  const question=JSON.parse(JSON.stringify(matches[0]));
  const source={questionUid:identity.questionUidV2,sourceRef,sourceRegistryRef,questionObjectSha256:objectSha(question),question};
  if(!parentRunRef)return {...source,status:'VERIFIED_SOLUTION_AUTHORITY_REQUIRED',verifiedSolution:null};
  const parent=JSON.parse(readBoundFile(root,parentRunRef));
  const matching=parent.questions?.find(q=>q.questionUid===identity.questionUidV2);
  if(!matching || !parent.inputs?.some(ref=>ref.path===sourceRef.path&&ref.sha256===sourceRef.sha256))throw Error('PARENT_SOURCE_BINDING_MISMATCH');
  const report=auditV2Run(root,parent);
  if(report.status!=='PASS')return {...source,status:'PARENT_AUTHORITY_NOT_CLOSED',verifiedSolution:null,parentAuditErrors:report.errors};
  // Preserve existing parent's current verification. A solution string alone
  // never becomes verified because it was found in a production bank.
  return {...source,status:'PLANNER_CONTINUATION_REQUIRED',verifiedSolution:{parentRunRef,parentInputSha:parent.inputSha,questionEvidence:matching.evidence}};
}

export function resumeParentReview(root,context) {
  // Use only the existing, supplied work-batch/provider launch. No new identity.
  if(!context?.workBatchId||!context.transport||!context.planPath)throw Error('PARENT_PROVIDER_CONTINUATION_REQUIRED');
  return context.launchId ? dispatchProviderReview(root,context) : prepareProviderReview(root,context);
}

export function locatedSourceCandidates(root,questionUid) {
  const {sourceExamId,sourceQuestionOrdinal}=parseQuestionUidV2(questionUid);
  const files=fs.readdirSync(path.join(root,'archive/exams/original'),{recursive:true});
  const candidates=files.filter(p=>path.basename(p)===sourceExamId+'.js').map(p=>'archive/exams/original/'+p.replaceAll('\\','/'));
  return candidates.map(sourcePath=>{
    const sourceRef=fileRef(root,sourcePath);
    const q=loadBank(readBoundFile(root,sourceRef).toString('utf8')).find(q=>q.id===sourceQuestionOrdinal);
    return {sourceRef,ordinal:sourceQuestionOrdinal,questionFound:!!q,solutionPresent:!!q?.solution,identityStatus:'LOCATOR_ONLY_NOT_CANONICAL_AUTHORITY'};
  });
}

export function runQuestion(root,request) {
  let resolution,reason;
  try {resolution=resolveQuestion(root,request);reason=resolution.status;}catch(error){reason=error.message;}
  let located=[];
  if(!request.sourceRegistryRef){try{located=locatedSourceCandidates(root,request.questionUid);}catch{}}
  const result={schemaVersion:'VISUAL_RESULT_v1',questionUid:request.questionUid,status:'INPUT_REQUIRED',reason,phase:2,productionAuthorized:false,sourceResolution:resolution??null,locatedSourceCandidates:located,completedStages:resolution?['SOURCE_RESOLVE']:[],unrunStages:['VERIFIED_SOLUTION_RESOLVE','PLANNER','INDEPENDENT_SOURCE_REVIEW','FROZEN_PLAN','NORMALIZE','MATH','INDEPENDENT_RECONSTRUCTION','TYPESET','MEASURE','LAYOUT','SVG','STATIC_AUDIT','ACTUAL_ARCHIVE','INDEPENDENT_VISUAL_REVIEW']};
  const receipt=commitStage(root,{stage:'RESULT',key:objectSha({request,result,invocation:crypto.randomUUID()}),provenance:{requestSha256:objectSha(request)},outputs:{'result.json':canonicalJson(result)}});
  return {result,receipt};
}

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const archiveDir=path.resolve(scriptDir,'../..');
const repoRoot=path.resolve(archiveDir,'..');
const metadataPath=path.join(archiveDir,'data','question_metadata.json');
const identityPath=path.join(archiveDir,'data','question_identity_map.json');
const overridePath=path.join(archiveDir,'_generated','intelligence','meta-ingest','exam-meta-overrides.json');

const sha256=v=>crypto.createHash('sha256').update(v).digest('hex');
const normalizeFile=v=>String(v||'').normalize('NFC').replace(/\\/g,'/').replace(/^\.?\/?archive\/exams\//,'').replace(/^\.?\/?exams\//,'').replace(/^\/+/, '').trim();
const contentFingerprint=q=>sha256(JSON.stringify({content:q?.content??null,choices:Array.isArray(q?.choices)?q.choices:null,image:q?.image??null}));

function readQuestion(sourceFile, ordinal){
  const full=path.join(archiveDir,'exams',sourceFile);
  const ctx={window:{},console:{log(){},warn(){},error(){}}};ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(full,'utf8'),ctx,{filename:full,timeout:3000});
  const bank=ctx.window.questions||ctx.window.questionBank||ctx.questions||ctx.questionBank;
  if(!Array.isArray(bank)) throw new Error('questions array not found: '+sourceFile);
  const q=bank[Number(ordinal)-1];
  if(!q) throw new Error('source ordinal not found: '+sourceFile+'#'+ordinal);
  return q;
}

function approvedRecord(base, row, question){
  const fieldStatus={
    standardUnit:'approved_source',
    subUnit:'approved_exam_meta_source',
    concept:'approved_exam_meta_source',
    problemType:'approved_exam_meta_source',
    template:'approved_exam_meta_source',
    difficulty:'approved_exam_meta_source'
  };
  return {
    ...(base||{}),
    questionUid:row.questionUid,
    sourceArchiveFile:normalizeFile(row.sourceArchiveFile),
    sourceOrdinal:Number(row.sourceOrdinal),
    sourceQuestionNo:row.sourceQuestionNo ?? question?.id ?? null,
    sourceFingerprint:row.sourceFingerprint,
    contentFingerprint:contentFingerprint(question),
    standardCourse:row.standardCourse||question?.standardCourse||question?.course||'',
    standardUnitKey:row.standardUnitKey||question?.standardUnitKey||'',
    standardUnit:row.standardUnit||question?.standardUnit||'',
    curriculumKey:row.curriculumKey,
    courseKey:row.courseKey,
    L1:row.L1,L2:row.L2,L3:row.L3,L4:row.L4,
    subUnitKey:row.subUnitKey,subUnit:row.subUnit,
    conceptClusterKey:row.conceptClusterKey||row.subUnitKey,
    problemTypeKey:row.problemTypeKey,templateKey:row.templateKey,
    crossConceptKeys:Array.isArray(row.crossConceptKeys)?row.crossConceptKeys:[],
    secondaryConceptKeys:Array.isArray(row.secondaryConceptKeys)?row.secondaryConceptKeys:[],
    conditionKeys:Array.isArray(row.conditionKeys)?row.conditionKeys:[],
    integrationPattern:row.integrationPattern||'',
    curriculumApplicability:row.curriculumApplicability||'DEFAULT_SCOPE',
    defaultSelectable:row.defaultSelectable===true,
    difficultyBucket:Number(row.difficultyBucket),
    difficultyConfidence:row.difficultyConfidence,
    difficultyBoundaryFlag:row.difficultyBoundaryFlag||'NONE',
    legacyLevelCompatibility:row.legacyLevelCompatibility||'NORMAL',
    tagConfidence:row.tagConfidence||'high',
    tagStatus:row.tagStatus||'approved_semantic_review',
    reviewStatus:'reviewed_pass',
    metadataStatus:'approved_exam_meta_source',
    fieldStatus,
    metadataRevision:'archive-exam-meta-source-v1',
    approvalEvidence:[row.reviewSource]
  };
}

function heldRecord(base,row,question){
  return {
    ...(base||{}),
    questionUid:row.questionUid,
    sourceArchiveFile:normalizeFile(row.sourceArchiveFile),
    sourceOrdinal:Number(row.sourceOrdinal),
    sourceQuestionNo:row.sourceQuestionNo ?? question?.id ?? null,
    sourceFingerprint:row.sourceFingerprint,
    contentFingerprint:contentFingerprint(question),
    standardCourse:row.standardCourse||question?.standardCourse||question?.course||'',
    standardUnitKey:row.standardUnitKey||question?.standardUnitKey||'',
    standardUnit:row.standardUnit||question?.standardUnit||'',
    subUnitKey:row.subUnitKey||'',
    subUnit:row.subUnit||'',
    conceptClusterKey:row.conceptClusterKey||row.subUnitKey||'',
    difficultyBucket:Number(row.difficultyBucket),
    difficultyConfidence:row.difficultyConfidence,
    difficultyBoundaryFlag:row.difficultyBoundaryFlag||'NONE',
    legacyLevelCompatibility:row.legacyLevelCompatibility||'NORMAL',
    tagConfidence:'review_required',
    tagStatus:'review_required',
    reviewStatus:'review_required',
    metadataStatus:'exam_meta_review_hold',
    fieldStatus:{
      standardUnit:'approved_source',
      subUnit:row.subUnitKey?'exam_meta_review_hold':'manual_review_pending',
      concept:'manual_review_pending',
      problemType:'manual_review_pending',
      template:'manual_review_pending',
      difficulty:Number.isInteger(Number(row.difficultyBucket))?'exam_meta_review_hold':'manual_review_pending'
    },
    metadataRevision:'archive-exam-meta-source-v1',
    approvalEvidence:[row.reviewSource]
  };
}

function main(){
  if(!fs.existsSync(overridePath)) throw new Error('exam meta ingest output missing: '+overridePath);
  const ingest=JSON.parse(fs.readFileSync(overridePath,'utf8'));
  const rows=ingest.records||[];
  if(!rows.length){
    console.log(JSON.stringify({status:'NO_CHANGE',records:0,reason:'no exam meta source rows'},null,2));
    return;
  }
  const identity=JSON.parse(fs.readFileSync(identityPath,'utf8'));
  const identityByUid=new Map((identity.records||[]).map(x=>[x.questionUid,x]));
  const metadata=JSON.parse(fs.readFileSync(metadataPath,'utf8'));
  const byUid=new Map((metadata.records||[]).map(x=>[x.questionUid,x]));
  let added=0,updated=0,approved=0,held=0;

  for(const row of rows){
    const id=identityByUid.get(row.questionUid);
    if(!id) throw new Error('identity missing for exam meta: '+row.questionUid);
    if(normalizeFile(id.sourceArchiveFile)!==normalizeFile(row.sourceArchiveFile)||Number(id.sourceOrdinal)!==Number(row.sourceOrdinal)){
      throw new Error('identity/source mismatch for exam meta: '+row.questionUid);
    }
    if(id.sourceFingerprint && row.sourceFingerprint && id.sourceFingerprint!==row.sourceFingerprint){
      throw new Error('identity fingerprint mismatch for exam meta: '+row.questionUid);
    }
    const question=readQuestion(row.sourceArchiveFile,row.sourceOrdinal);
    const base=byUid.get(row.questionUid);
    const next=row.disposition==='reviewed_pass'?approvedRecord(base,row,question):heldRecord(base,row,question);
    if(base) updated += 1; else added += 1;
    if(row.disposition==='reviewed_pass') approved += 1; else held += 1;
    byUid.set(row.questionUid,next);
  }

  const records=[...byUid.values()].sort((a,b)=>String(a.questionUid).localeCompare(String(b.questionUid),'en'));
  const next={...metadata};
  next.generatedAt=new Date().toISOString();
  next.metadataRevision='archive-metadata-v1+exam-meta-source-v1';
  next.sourceDigests={...(metadata.sourceDigests||{}),identityMap:sha256(fs.readFileSync(identityPath,'utf8')),examMetaOverrides:ingest.digest||sha256(fs.readFileSync(overridePath,'utf8'))};
  next.counts={
    ...(metadata.counts||{}),
    records:records.length,
    uidUnique:new Set(records.map(x=>x.questionUid)).size===records.length,
    sourceJoinUnique:new Set(records.map(x=>normalizeFile(x.sourceArchiveFile)+'#'+Number(x.sourceOrdinal))).size===records.length,
    semanticallyReviewed:records.filter(x=>x.reviewStatus==='reviewed_pass'||x.metadataStatus==='approved_semantic_review'||x.metadataStatus==='approved_exam_meta_source').length,
    explicitProblemTypeHolds:records.filter(x=>x.fieldStatus?.problemType==='manual_review_pending').length,
    explicitTemplateHolds:records.filter(x=>x.fieldStatus?.template==='manual_review_pending').length,
    explicitDifficultyHolds:records.filter(x=>x.fieldStatus?.difficulty==='manual_review_pending').length
  };
  next.reviewedPassCount=records.filter(x=>x.reviewStatus==='reviewed_pass'||x.metadataStatus==='approved_semantic_review').length;
  next.records=records;
  delete next.digest;
  const stable={...next};delete stable.generatedAt;
  next.digest=sha256(JSON.stringify(stable));
  fs.writeFileSync(metadataPath,JSON.stringify(next,null,2)+'\n','utf8');
  console.log(JSON.stringify({status:'UPDATED',added,updated,approved,held,total:records.length,digest:next.digest},null,2));
}
main();

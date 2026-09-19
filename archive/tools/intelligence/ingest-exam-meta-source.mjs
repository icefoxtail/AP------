import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const archiveDir=path.resolve(scriptDir,'../..');
const repoRoot=path.resolve(archiveDir,'..');
const sourceRoot=path.join(archiveDir,'data','exam-meta-source');
const identityPath=path.join(archiveDir,'data','question_identity_map.json');
const taxonomyPath=path.join(archiveDir,'data','meta-foundation','compiled','taxonomy_registry.json');
const bindingsPath=path.join(archiveDir,'data','meta-foundation','compiled','curriculum_bindings.json');
const conceptPath=path.join(archiveDir,'data','meta-foundation','compiled','concept_registry.json');
const conditionPath=path.join(archiveDir,'data','meta-foundation','compiled','condition_registry.json');
const outputDir=path.join(archiveDir,'_generated','intelligence','meta-ingest');
const overridePath=path.join(outputDir,'exam-meta-overrides.json');
const queuePath=path.join(outputDir,'exam-meta-review-queue.json');

const sha256=v=>crypto.createHash('sha256').update(v).digest('hex');
const normalizeFile=v=>String(v||'').normalize('NFC').replace(/\\/g,'/').replace(/^\.?\/?archive\/exams\//,'').replace(/^\.?\/?exams\//,'').replace(/^\/+/, '').trim();
const fingerprint=q=>sha256(JSON.stringify({content:q?.content??null,choices:Array.isArray(q?.choices)?q.choices:null,answer:q?.answer??null,solution:q?.solution??null,image:q?.image??null}));
const text=v=>String(v??'').trim();

function walk(dir){
  if(!fs.existsSync(dir)) return [];
  const out=[];
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,e.name);
    if(e.isDirectory()) out.push(...walk(full));
    else if(e.isFile() && e.name.endsWith('.meta.json') && e.name!=='exam-meta-source.schema.json') out.push(full);
  }
  return out.sort((a,b)=>a.localeCompare(b,'en'));
}
function runQuestions(sourceFile){
  const full=path.join(archiveDir,'exams',sourceFile);
  const ctx={window:{},console:{log(){},warn(){},error(){}}};ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(full,'utf8'),ctx,{filename:full,timeout:3000});
  const bank=ctx.window.questions||ctx.window.questionBank||ctx.questions||ctx.questionBank;
  if(!Array.isArray(bank)) throw new Error('questions array not found: '+sourceFile);
  return bank;
}
function uniqStrings(value){ return [...new Set((Array.isArray(value)?value:[]).map(text).filter(Boolean))]; }

function main(){
  const identity=JSON.parse(fs.readFileSync(identityPath,'utf8'));
  const taxonomy=JSON.parse(fs.readFileSync(taxonomyPath,'utf8'));
  const bindings=JSON.parse(fs.readFileSync(bindingsPath,'utf8'));
  const concepts=JSON.parse(fs.readFileSync(conceptPath,'utf8'));
  const conditions=JSON.parse(fs.readFileSync(conditionPath,'utf8'));
  const identityBySource=new Map((identity.records||[]).map(r=>[normalizeFile(r.sourceArchiveFile)+'#'+Number(r.sourceOrdinal),r]));
  const ptByKey=new Map((taxonomy.problemTypes||[]).map(x=>[x.problemTypeKey,x]));
  const tplByKey=new Map((taxonomy.templates||[]).map(x=>[x.templateKey,x]));
  const conceptKeys=new Set((concepts.concepts||[]).map(x=>x.conceptKey));
  const conditionKeys=new Set((conditions.conditions||[]).map(x=>x.conditionKey));
  const bindingRows=bindings.bindings||[];
  const records=[],queue=[],hardFailures=[],seenSource=new Set(),metaSourceFiles=new Set();
  const allowedStatuses=new Set(['APPROVED','REVIEW_REQUIRED','CANDIDATE_REQUIRED']);

  for(const file of walk(sourceRoot)){
    let doc;
    try{ doc=JSON.parse(fs.readFileSync(file,'utf8')); }catch(error){hardFailures.push({file:path.relative(repoRoot,file).replaceAll('\\','/'),reason:'invalid_json',error:error.message});continue;}
    const reviewSource=path.relative(repoRoot,file).replaceAll('\\','/');
    const sourceFile=normalizeFile(doc.sourceArchiveFile);
    metaSourceFiles.add(sourceFile);
    const defaultStatus=text(doc.reviewStatus||'REVIEW_REQUIRED').toUpperCase();
    if(doc.schemaVersion!=='archive-exam-meta-source-v1'||!sourceFile||!Array.isArray(doc.questions)||!allowedStatuses.has(defaultStatus)){
      hardFailures.push({file:reviewSource,reason:'invalid_document_header'});continue;
    }
    let questions;
    try{ questions=runQuestions(sourceFile); }catch(error){hardFailures.push({file:reviewSource,sourceArchiveFile:sourceFile,reason:'source_load_failed',error:error.message});continue;}
    if(doc.questions.length!==questions.length){
      hardFailures.push({file:reviewSource,sourceArchiveFile:sourceFile,reason:'question_count_mismatch',metaCount:doc.questions.length,sourceCount:questions.length});continue;
    }
    const ordinals=new Set();
    for(const raw of doc.questions){
      const ordinal=Number(raw.sourceOrdinal);
      const status=text(raw.reviewStatus||defaultStatus).toUpperCase();
      const reasons=[];
      if(!Number.isInteger(ordinal)||ordinal<1||ordinal>questions.length||ordinals.has(ordinal)) reasons.push('invalid_or_duplicate_sourceOrdinal');
      ordinals.add(ordinal);
      if(!allowedStatuses.has(status)) reasons.push('invalid_reviewStatus');
      const q=questions[ordinal-1];
      const identityRow=identityBySource.get(sourceFile+'#'+ordinal);
      if(!identityRow) reasons.push('identity_missing');
      const currentFingerprint=q?fingerprint(q):'';
      if(raw.sourceQuestionNo!==undefined && String(raw.sourceQuestionNo)!==String(q?.id??'')) reasons.push('sourceQuestionNo_mismatch');
      if(status==='APPROVED' && !text(raw.sourceFingerprint)) reasons.push('sourceFingerprint_required_for_APPROVED');
      if(text(raw.sourceFingerprint) && text(raw.sourceFingerprint)!==currentFingerprint) reasons.push('sourceFingerprint_mismatch');

      const standardUnitKey=text(raw.standardUnitKey), subUnitKey=text(raw.subUnitKey), problemTypeKey=text(raw.problemTypeKey), templateKey=text(raw.templateKey);
      if(!standardUnitKey) reasons.push('standardUnitKey_missing');
      if(!subUnitKey) reasons.push('subUnitKey_missing');
      const pt=ptByKey.get(problemTypeKey), tpl=tplByKey.get(templateKey);
      if(status==='APPROVED'){
        if(!pt) reasons.push('problemTypeKey_not_canonical');
        if(!tpl) reasons.push('templateKey_not_canonical');
        if(tpl && problemTypeKey && tpl.parentProblemTypeKey!==problemTypeKey) reasons.push('template_parent_mismatch');
      }
      const matchingBindings=bindingRows.filter(b=>b.standardUnitKey===standardUnitKey&&b.subUnitKey===subUnitKey&&(!problemTypeKey||b.problemTypeKey===problemTypeKey));
      const binding=status==='APPROVED' ? matchingBindings.find(b=>b.problemTypeKey===problemTypeKey) : matchingBindings[0];
      if(status==='APPROVED'&&!binding) reasons.push('l2_l3_binding_missing');
      const crossConceptKeys=uniqStrings(raw.crossConceptKeys), conditionList=uniqStrings(raw.conditionKeys);
      if(status==='APPROVED') for(const k of crossConceptKeys) if(!conceptKeys.has(k)) reasons.push('crossConcept_not_canonical:'+k);
      if(status==='APPROVED') for(const k of conditionList) if(!conditionKeys.has(k)) reasons.push('condition_not_canonical:'+k);
      const difficultyBucket=Number(raw.difficultyBucket), difficultyConfidence=text(raw.difficultyConfidence).toLowerCase();
      const difficultyBoundaryFlag=text(raw.difficultyBoundaryFlag||'NONE').toUpperCase();
      const legacyLevelCompatibility=text(raw.legacyLevelCompatibility||'NORMAL').toUpperCase();
      if(!Number.isInteger(difficultyBucket)||difficultyBucket<1||difficultyBucket>5) reasons.push('difficultyBucket_invalid');
      if(!['high','medium','low'].includes(difficultyConfidence)) reasons.push('difficultyConfidence_invalid');
      if(!['NONE','B12','B23','B34','B45'].includes(difficultyBoundaryFlag)) reasons.push('difficultyBoundaryFlag_invalid');
      if(!['NORMAL','BORDERLINE_ACCEPTABLE','STRONG_CONFLICT'].includes(legacyLevelCompatibility)) reasons.push('legacyLevelCompatibility_invalid');

      const canonicalReady=status==='APPROVED'&&reasons.length===0;
      const standardUnit=text(q?.standardUnit)||standardUnitKey;
      const standardCourse=text(binding?.standardCourse||q?.standardCourse||q?.course);
      const subUnit=text(binding?.subUnitLabelKo)||subUnitKey;
      const record={
        questionUid:identityRow?.questionUid||'',sourceArchiveFile:sourceFile,sourceOrdinal:ordinal,sourceQuestionNo:String(q?.id??''),sourceFingerprint:currentFingerprint,
        disposition:canonicalReady?'reviewed_pass':status.toLowerCase(),reviewStatus:canonicalReady?'reviewed_pass':'review_required',
        standardCourse,standardUnitKey,standardUnit,subUnitKey,subUnit,conceptClusterKey:subUnitKey,
        difficultyBucket,difficultyConfidence,difficultyBoundaryFlag,legacyLevelCompatibility,
        reviewSource
      };
      if(canonicalReady){
        Object.assign(record,{
          curriculumKey:String(binding.curriculum),courseKey:standardCourse,L1:standardUnit,L2:subUnit,L3:text(pt.canonicalLabelKo),L4:text(tpl.canonicalLabelKo),
          problemTypeKey,templateKey,crossConceptKeys,secondaryConceptKeys:crossConceptKeys,conditionKeys:conditionList,
          integrationPattern:text(raw.integrationPattern),curriculumApplicability:text(binding.curriculumApplicability||'DEFAULT_SCOPE'),
          defaultSelectable:binding.defaultSelectable===true,tagConfidence:'high',tagStatus:'approved_semantic_review',
          metadataStatus:'approved_exam_meta_source'
        });
      }
      records.push(record);
      seenSource.add(sourceFile+'#'+ordinal);
      if(!canonicalReady){
        queue.push({questionUid:record.questionUid,sourceArchiveFile:sourceFile,sourceOrdinal:ordinal,status,reasons,proposed:{standardUnitKey,subUnitKey,problemTypeKey,templateKey,crossConceptKeys,conditionKeys:conditionList,difficultyBucket,difficultyConfidence,integrationPattern:text(raw.integrationPattern)},reviewSource});
      }
      if(status==='APPROVED'&&reasons.length) hardFailures.push({file:reviewSource,sourceArchiveFile:sourceFile,sourceOrdinal:ordinal,reason:'APPROVED_record_invalid',details:reasons});
    }
    for(let i=1;i<=questions.length;i++) if(!ordinals.has(i)) hardFailures.push({file:reviewSource,sourceArchiveFile:sourceFile,reason:'missing_sourceOrdinal',sourceOrdinal:i});
  }

  for(const sourceFile of identity.incrementalSync?.newSourceFiles || []){
    if(!metaSourceFiles.has(normalizeFile(sourceFile))) {
      hardFailures.push({sourceArchiveFile:normalizeFile(sourceFile),reason:'new_exam_meta_missing'});
    }
  }

  records.sort((a,b)=>a.sourceArchiveFile.localeCompare(b.sourceArchiveFile,'en')||a.sourceOrdinal-b.sourceOrdinal);
  queue.sort((a,b)=>a.sourceArchiveFile.localeCompare(b.sourceArchiveFile,'en')||a.sourceOrdinal-b.sourceOrdinal);
  const stableReport={schemaVersion:'archive-exam-meta-ingest-v1',counts:{metaFiles:walk(sourceRoot).length,records:records.length,approved:records.filter(x=>x.disposition==='reviewed_pass').length,reviewQueue:queue.length,hardFailures:hardFailures.length},records,hardFailures};
  const report={...stableReport,generatedAt:new Date().toISOString(),digest:sha256(JSON.stringify(stableReport))};
  const review={schemaVersion:'archive-exam-meta-review-queue-v1',generatedAt:report.generatedAt,count:queue.length,records:queue,digest:sha256(JSON.stringify(queue))};
  fs.mkdirSync(outputDir,{recursive:true});
  fs.writeFileSync(overridePath,JSON.stringify(report,null,2)+'\n','utf8');
  fs.writeFileSync(queuePath,JSON.stringify(review,null,2)+'\n','utf8');
  console.log(JSON.stringify({overrides:path.relative(repoRoot,overridePath).replaceAll('\\','/'),reviewQueue:path.relative(repoRoot,queuePath).replaceAll('\\','/'),counts:report.counts},null,2));
  if(hardFailures.length) process.exitCode=1;
}
main();

#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const global='archive/_generated/intelligence/phase1/middle1-foundation/global';
const read=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const input=read(`${global}/B01_B16_GLOBAL_COMPRESSION_INPUT.json`);
const l3=read(`${global}/B01_B16_L3_COMPRESSION.json`),l4=read(`${global}/B01_B16_L4_COMPRESSION.json`),cc=read(`${global}/B01_B16_CROSSCONCEPT_COMPRESSION.json`);
const mapping=read(`${global}/B01_B16_CANONICAL_MAPPING.json`);
const sourceReceipt=read(`${global}/B01_B16_SOURCE_NORMALIZATION_RECEIPT.json`);
const metadataReceipt=read(`${global}/B01_B16_QUESTION_METADATA_SYNC_RECEIPT.json`);
const runtimeParity=read(`${global}/B01_B16_RUNTIME_PARITY.json`);
const archive2=read(`${global}/B01_B16_ARCHIVE2_JOIN_AUDIT.json`);
const mainDrift=read(`${global}/B01_B16_MAIN_CATALOG_DRIFT.json`),mainAlign=read(`${global}/B01_B16_MAIN_SOURCE_ALIGN_RECEIPT.json`);
const progress=read('archive/_generated/intelligence/phase1/middle1-foundation/M1_PROGRESS.json');
const metadata=read('archive/data/question_metadata.json');
const inventory=read('archive/_generated/intelligence/phase1/middle1-foundation/M1_EXAM_INVENTORY_31.json');
const pack=read('archive/data/meta-foundation/canonical/packs/middle1/pack.json');
const tax=read('archive/data/meta-foundation/canonical/packs/middle1/taxonomy.json');
const binds=read('archive/data/meta-foundation/canonical/packs/middle1/bindings.json');
const alias=read('archive/data/meta-foundation/canonical/packs/middle1/aliases.json');
const compiledTax=read('archive/data/meta-foundation/compiled/taxonomy_registry.json');
const compiledConcepts=read('archive/data/meta-foundation/compiled/concept_registry.json');
const compiledConds=read('archive/data/meta-foundation/compiled/condition_registry.json');
const compiledBinds=read('archive/data/meta-foundation/compiled/curriculum_bindings.json');
const compiledAliases=read('archive/data/meta-foundation/compiled/aliases.json');
const runtime=read('archive/data/meta-foundation/runtime/middle1-v1.json');
const metaByUid=new Map(metadata.records.map((r)=>[r.questionUid,r]));
const runtimeByUid=new Map(runtime.records.map((r)=>[r.questionUid,r]));
const inputByUid=new Map(input.rows.map((r)=>[r.questionUid,r]));
const finalByUid=new Map(mapping.uidMappings.map((r)=>[r.questionUid,r]));
const pt=new Map(compiledTax.problemTypes.map((r)=>[r.problemTypeKey,r]));
const tpl=new Map(compiledTax.templates.map((r)=>[r.templateKey,r]));
const concept=new Set(compiledConcepts.concepts.map((r)=>r.conceptKey));
const condition=new Set(compiledConds.conditions.map((r)=>r.conditionKey));
const binding=new Set(compiledBinds.bindings.map((r)=>[r.curriculum,r.standardUnitKey,r.subUnitKey,r.problemTypeKey].join('\u0000')));
const patterns=new Set(['NONE','SEQUENTIAL','INTERDEPENDENT','REINTERPRETATION','CASE_BRANCH','DEEP_COMPOSITE']);
const failures=[];const checks={};
const gate=(name,ok,detail)=>{checks[name]={pass:Boolean(ok),detail};if(!ok)failures.push(name+(detail?`:${detail}`:''));};
const same=(a,b)=>JSON.stringify(a??null)===JSON.stringify(b??null);
const loadBank=(code,file)=>{const ctx={window:{},console:{log(){},warn(){},error(){}}};ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(code,ctx,{filename:file,timeout:3000});return ctx.window.questionBank||ctx.window.questions||ctx.questionBank||ctx.questions;};
const gitShow=(p)=>execFileSync('git',['show',`HEAD:${p}`],{cwd:root,maxBuffer:50*1024*1024}).toString('utf8');

gate('batch_16_of_16',input.counts.batches===16&&progress.batches.filter((r)=>r.batchNo<=16&&r.status.startsWith('SCOPED_BATCH_CLOSED')).length===16);
gate('uid_identity_denominator',input.counts.rawRows===381&&input.counts.uniqueUid===381&&input.counts.uniqueSourceIdentity===381&&!input.failures.length);
gate('candidate_mapping_coverage',l3.mappings.length===l3.oldCandidateCount&&l4.mappings.length===l4.oldCandidateCount&&cc.mappings.length===cc.oldCandidateCount&&mapping.uidMappings.length===364&&mapping.heldUids.length===17);
gate('compressed_key_counts',l3.finalCanonicalCount===85&&l4.finalCanonicalCount===155&&cc.finalCanonicalCount===11);
gate('canonical_new_key_counts',pack.problemTypeCount===tax.problemTypes.length&&pack.templateCount===tax.templates.length&&pack.problemTypeCount===78&&pack.templateCount===149&&binds.bindingCount===binds.bindings.length&&alias.aliasCount===alias.aliases.length);
gate('alias_collision_zero',compiledAliases.collisionCount===0&&alias.collisionCount===0);
gate('duplicate_canonical_key_zero',new Set(compiledTax.problemTypes.map((r)=>r.problemTypeKey)).size===compiledTax.problemTypes.length&&new Set(compiledTax.templates.map((r)=>r.templateKey)).size===compiledTax.templates.length);
gate('condition_registry_active',compiledConds.conditionCount>=6);
let badParent=0,badBinding=0,badConcept=0,badCondition=0,badPattern=0,badMeta=0,badRuntime=0,badDiff=0,badCurriculum=0;
for(const m of mapping.uidMappings){
  const s=inputByUid.get(m.questionUid),r=metaByUid.get(m.questionUid),rt=runtimeByUid.get(m.questionUid);
  if(!s||!r||!rt){badMeta++;continue;}
  const sourceYear=Number(path.basename(m.sourceArchiveFile).slice(0,2));
  const expectedCurriculum=sourceYear>=25?'2022':'2015';
  if(r.curriculum!==expectedCurriculum||rt.curriculum!==expectedCurriculum||(r.curriculumKey&&r.curriculumKey!==expectedCurriculum))badCurriculum++;
  if(!pt.has(m.finalProblemTypeKey)||tpl.get(m.finalTemplateKey)?.parentProblemTypeKey!==m.finalProblemTypeKey)badParent++;
  if(!binding.has([r.curriculum,m.standardUnitKey,m.subUnitKey,m.finalProblemTypeKey].join('\u0000')))badBinding++;
  if(m.finalCrossConceptKeys.some((k)=>!concept.has(k)))badConcept++;
  if(m.conditionKeys.some((k)=>!condition.has(k)))badCondition++;
  if(!patterns.has(m.integrationPattern))badPattern++;
  if(r.problemTypeKey!==m.finalProblemTypeKey||r.templateKey!==m.finalTemplateKey||!same(r.crossConceptKeys,m.finalCrossConceptKeys)||r.sourceFingerprint!==s.sourceFingerprint)badMeta++;
  if(rt.problemTypeKey!==r.problemTypeKey||rt.templateKey!==r.templateKey||!same(rt.crossConceptKeys,r.crossConceptKeys)||rt.difficultyBucket!==r.difficultyBucket)badRuntime++;
  if(!Number.isInteger(s.difficultyBucket)||s.difficultyBucket<1||s.difficultyBucket>5)badDiff++;
}
for(const s of input.rows.filter((r)=>!finalByUid.has(r.questionUid)))if(s.difficultyBucket!=='UNKNOWN'&&!Number.isInteger(s.difficultyBucket))badDiff++;
gate('l3_l4_parent',badParent===0,badParent);gate('l2_l3_binding',badBinding===0,badBinding);gate('crossconcept_reference',badConcept===0,badConcept);gate('condition_reference',badCondition===0,badCondition);gate('integration_pattern',badPattern===0,badPattern);
gate('curriculum_2015_2022_rollout',badCurriculum===0,badCurriculum);
gate('question_metadata_parity',badMeta===0&&metadataReceipt.updatedUidCount===381&&metadataReceipt.nonTargetRecordChangeCount===0,badMeta);
gate('runtime_parity',badRuntime===0&&runtimeParity.status==='PASS'&&runtime.records.length===381,badRuntime);
gate('difficulty_381_of_381',badDiff===0&&input.counts.difficultyCovered===381,badDiff);
const originalMetadata=JSON.parse(gitShow('archive/data/question_metadata.json'));
const origMetaByUid=new Map(originalMetadata.records.map((r)=>[r.questionUid,r]));
const target=new Set(input.rows.map((r)=>r.questionUid));
let outsideMetadataChanges=0;
for(const r of metadata.records)if(!target.has(r.questionUid)&&!same(r,origMetaByUid.get(r.questionUid)))outsideMetadataChanges++;
gate('question_metadata_scope_only',outsideMetadataChanges===0,outsideMetadataChanges);
let protectedMutations=0,nonFoundationMutations=0,sourceKeyMismatch=0,changedUid=0;
const allowed=new Set(['problemTypeKey','templateKey','crossConceptKeys']);
for(const batch of input.batches){
  const p=`archive/exams/${batch.sourceArchiveFile}`;
  const old=loadBank(gitShow(p),p),now=loadBank(fs.readFileSync(path.join(root,p),'utf8'),p);
  if(old.length!==now.length||old.length!==batch.questionCount){nonFoundationMutations++;continue;}
  for(let i=0;i<old.length;i++){
    const uid=input.rows.find((r)=>r.batchNo===batch.batchNo&&r.sourceOrdinal===i+1)?.questionUid;
    const m=finalByUid.get(uid);
    for(const key of new Set([...Object.keys(old[i]),...Object.keys(now[i])])){
      if(allowed.has(key))continue;
      if(!same(old[i][key],now[i][key])){nonFoundationMutations++;if(['content','choices','answer','solution','image','layoutTag','wide'].includes(key))protectedMutations++;}
    }
    if(m){changedUid++;if(now[i].problemTypeKey!==m.finalProblemTypeKey||now[i].templateKey!==m.finalTemplateKey||!same(now[i].crossConceptKeys,m.finalCrossConceptKeys))sourceKeyMismatch++;}
    else if(!same(old[i],now[i]))sourceKeyMismatch++;
  }
}
gate('source_metadata_mapping_364_of_364',changedUid===364&&sourceKeyMismatch===0,`${changedUid}/${sourceKeyMismatch}`);
gate('protected_source_mutation_zero',protectedMutations===0&&nonFoundationMutations===0&&sourceReceipt.protectedMutationCount===0,`${protectedMutations}/${nonFoundationMutations}`);
let b17PlusChanges=0;
for(const exam of inventory.exams.filter((r)=>r.batchNo>=17)){
  const p=`archive/exams/${exam.sourceArchiveFile}`;
  const a=fs.readFileSync(path.join(root,p),'utf8').replaceAll('\r\n','\n');
  const b=gitShow(p).replaceAll('\r\n','\n');
  if(a!==b)b17PlusChanges++;
}
gate('b17_b31_source_untouched',b17PlusChanges===0,b17PlusChanges);
gate('main_catalog_drift_preserved',mainAlign.dependencyCount===mainDrift.counts.changedSources&&archive2.counts.outsideCatalogChanges===0&&archive2.counts.outsideCatalogAdded===0&&archive2.counts.outsideCatalogRemoved===0);
gate('archive2_uid_join_381_of_381',archive2.status==='PASS'&&archive2.counts.joined===381&&archive2.counts.identityVerified===381&&archive2.counts.sourceVerified===381&&archive2.counts.foundationConfirmed===364);
gate('archive2_conflict_duplicate_zero',archive2.counts.metadataConflicts===0&&archive2.counts.duplicateUidGlobal===0&&archive2.counts.duplicateSourceGlobal===0);
gate('hold_route_selectability',archive2.counts.semanticHold===15&&archive2.counts.routeOut===2&&archive2.counts.explicitRpmPathHold===11&&runtime.counts.runtimeSelectable===archive2.counts.automatic);
let batchValidationFailures=0,missingArtifacts=0;
for(const b of input.batches){for(const name of ['CONSENSUS.jsonl','DIFFICULTY_FINAL.jsonl','WRITEBACK_RECEIPT.json','VALIDATION.json'])if(!fs.existsSync(path.join(root,b.artifactPath,name)))missingArtifacts++;const v=read(`${b.artifactPath}/VALIDATION.json`);batchValidationFailures+=v.failures.length;}
gate('physical_batch_artifacts',missingArtifacts===0&&batchValidationFailures===0,`${missingArtifacts}/${batchValidationFailures}`);
const counts={rawRows:381,uniqueUid:381,mapped:364,semanticHold:15,routeOut:2,sourceWriteback:sourceReceipt.changedUidCount,questionMetadataSync:metadataReceipt.updatedUidCount,finalL3:l3.finalCanonicalCount,finalL4:l4.finalCanonicalCount,finalCrossConcept:cc.finalCanonicalCount,compiledRuntimeCoverage:runtime.records.length,archive2Join:archive2.counts.joined,archive2DirectTaxonomy:archive2.counts.taxonomyConfirmed,archive2ExplicitRpmPathHold:archive2.counts.explicitRpmPathHold,archive2Automatic:archive2.counts.automatic,protectedStudentFieldMutation:protectedMutations,nonTargetQuestionMetadataMutation:outsideMetadataChanges,b17PlusSourceMutation:b17PlusChanges};
const out={schemaVersion:'m1-b01-b16-compression-validation-v1',status:failures.length?'FAIL':'PASS',sourceHead:input.sourceHead,counts,checks,failures};
fs.writeFileSync(path.join(root,global,'B01_B16_COMPRESSION_VALIDATION.json'),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({status:out.status,counts,failureCount:failures.length,firstFailures:failures.slice(0,12)},null,2));
if(failures.length)process.exitCode=1;

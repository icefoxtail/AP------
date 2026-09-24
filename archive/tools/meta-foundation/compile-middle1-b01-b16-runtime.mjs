#!/usr/bin/env node
// Derives the scoped M1 runtime and audit sidecars from canonical/compiled authority and UID metadata.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const global='archive/_generated/intelligence/phase1/middle1-foundation/global';
const runtimePath='archive/data/meta-foundation/runtime/middle1-v1.json';
const evidencePath='archive/data/meta-foundation/evidence/middle1/v1/item_metadata_assignments_381.json';
const read=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const text=(v)=>JSON.stringify(v,null,2)+'\n';
// Canonical/metadata JSON may be checked out as CRLF on Windows. Provenance
// hashes follow the same stable LF policy as the global Foundation compiler.
const sha=(p)=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p),'utf8').replaceAll('\r\n','\n'),'utf8').digest('hex');
const input=read(`${global}/B01_B16_GLOBAL_COMPRESSION_INPUT.json`);
const mapping=read(`${global}/B01_B16_CANONICAL_MAPPING.json`);
const metadata=read('archive/data/question_metadata.json');
const normalization=read(`${global}/B01_B16_SOURCE_NORMALIZATION_RECEIPT.json`);
const pack=read('archive/data/meta-foundation/canonical/packs/middle1/pack.json');
const ct=read('archive/data/meta-foundation/compiled/taxonomy_registry.json');
const cc=read('archive/data/meta-foundation/compiled/concept_registry.json');
const cd=read('archive/data/meta-foundation/compiled/condition_registry.json');
const cb=read('archive/data/meta-foundation/compiled/curriculum_bindings.json');
const ap=read('archive/data/meta-foundation/compiled/aliases.json');
const pt=new Map(ct.problemTypes.map((r)=>[r.problemTypeKey,r]));
const tpl=new Map(ct.templates.map((r)=>[r.templateKey,r]));
const concepts=new Set(cc.concepts.map((r)=>r.conceptKey));
const conditions=new Set(cd.conditions.map((r)=>r.conditionKey));
const bindings=new Set(cb.bindings.map((r)=>[r.curriculum,r.standardUnitKey,r.subUnitKey,r.problemTypeKey].join('\u0000')));
const metaByUid=new Map(metadata.records.map((r)=>[r.questionUid,r]));
const mapByUid=new Map(mapping.uidMappings.map((r)=>[r.questionUid,r]));
const sourceByUid=new Map(input.rows.map((r)=>[r.questionUid,r]));
const qualityByUid=new Map();
for(const b of input.batches){const qpath=path.join(root,b.artifactPath,'SOURCE_QUALITY.jsonl');for(const line of fs.readFileSync(qpath,'utf8').split(/\r?\n/).filter(Boolean)){const q=JSON.parse(line);qualityByUid.set(q.questionUid,q);}}
const failures=[];const records=[];
const seen=new Set();
for(const s of input.rows){
  const m=mapByUid.get(s.questionUid),r=metaByUid.get(s.questionUid),q=qualityByUid.get(s.questionUid);
  if(!r||!q){failures.push(`missingUid:${s.questionUid}`);continue;}
  if(seen.has(s.questionUid))failures.push(`duplicateUid:${s.questionUid}`);seen.add(s.questionUid);
  if(r.sourceArchiveFile!==s.sourceArchiveFile||r.sourceOrdinal!==s.sourceOrdinal||r.sourceFingerprint!==s.sourceFingerprint)failures.push(`identity:${s.questionUid}`);
  if(m){
    if(r.problemTypeKey!==m.finalProblemTypeKey||r.templateKey!==m.finalTemplateKey||JSON.stringify(r.crossConceptKeys)!==JSON.stringify(m.finalCrossConceptKeys)||r.difficultyBucket!==s.difficultyBucket)failures.push(`metadataMapping:${s.questionUid}`);
    if(!pt.has(r.problemTypeKey)||tpl.get(r.templateKey)?.parentProblemTypeKey!==r.problemTypeKey)failures.push(`parent:${s.questionUid}`);
    if(!bindings.has([r.curriculum,r.standardUnitKey,r.subUnitKey,r.problemTypeKey].join('\u0000')))failures.push(`binding:${s.questionUid}`);
    if((r.crossConceptKeys||[]).some((k)=>!concepts.has(k)))failures.push(`concept:${s.questionUid}`);
    if((r.conditionKeys||[]).some((k)=>!conditions.has(k)))failures.push(`condition:${s.questionUid}`);
  }else if(r.problemTypeKey||r.templateKey||r.foundationTaxonomyStatus!=='HOLD')failures.push(`heldMetadata:${s.questionUid}`);
  const selectable=Boolean(m&&r.reviewStatus==='reviewed_pass'&&r.rpmPathStatus==='DIRECT'&&r.defaultSelectable===true&&Number.isInteger(r.difficultyBucket));
  records.push({questionUid:s.questionUid,sourceArchiveFile:s.sourceArchiveFile,sourceOrdinal:s.sourceOrdinal,sourceFingerprint:s.sourceFingerprint,
    curriculum:r.curriculum,standardUnitKey:r.standardUnitKey,subUnitKey:r.subUnitKey,
    problemTypeKey:r.problemTypeKey||'',templateKey:r.templateKey||'',
    crossConceptKeys:r.crossConceptKeys||[],conditionKeys:r.conditionKeys||[],integrationPattern:r.integrationPattern||'NONE',
    difficultyBucket:r.difficultyBucket,difficultyConfidence:r.difficultyConfidence,difficultyBoundaryFlag:r.difficultyBoundaryFlag,legacyLevelCompatibility:r.legacyLevelCompatibility,
    semanticDisposition:s.reviewStatus,sourceQualityDisposition:q.disposition,
    foundationTaxonomyStatus:r.foundationTaxonomyStatus,rpmPathStatus:r.rpmPathStatus,
    reviewStatus:r.reviewStatus,curriculumApplicability:r.curriculumApplicability,defaultSelectable:r.defaultSelectable,
    runtimeSelectable:selectable,metadataRevision:r.metadataRevision,metaFoundationPackVersion:r.metaFoundationPackVersion});
}
if(records.length!==input.counts.uniqueUid||mapByUid.size!==pack.activeItemEvidenceCount||normalization.changedUidCount!==mapByUid.size)failures.push('denominator');
if(ap.collisionCount!==0)failures.push('aliasCollision');
const counts={records:records.length,mapped:records.filter((r)=>r.problemTypeKey).length,semanticHold:records.filter((r)=>r.semanticDisposition==='HOLD').length,routeOut:records.filter((r)=>r.semanticDisposition==='ROUTE_OUT').length,
  solutionQualityHold:records.filter((r)=>r.sourceQualityDisposition==='SOLUTION_REPAIR_REQUIRED').length,
  rpmPathHold:records.filter((r)=>r.rpmPathStatus==='HOLD_NO_EQUIVALENT_PATH').length,
  runtimeSelectable:records.filter((r)=>r.runtimeSelectable).length,
  uniqueProblemTypes:new Set(records.map((r)=>r.problemTypeKey).filter(Boolean)).size,
  uniqueTemplates:new Set(records.map((r)=>r.templateKey).filter(Boolean)).size,
  uniqueCrossConcepts:new Set(records.flatMap((r)=>r.crossConceptKeys)).size};
const runtime={schemaVersion:'meta-foundation-runtime-overlay-v1',status:'ACTIVE',runtimeVersion:'MIDDLE1@1.0.0/runtime-bridge-v1',packId:'MIDDLE1',packVersion:'1.0.0',
  generatedFrom:{canonicalPack:'archive/data/meta-foundation/canonical/packs/middle1',compiledTaxonomySha256:sha('archive/data/meta-foundation/compiled/taxonomy_registry.json'),compiledConceptSha256:sha('archive/data/meta-foundation/compiled/concept_registry.json'),questionMetadataSha256:sha('archive/data/question_metadata.json'),mapping:`${global}/B01_B16_CANONICAL_MAPPING.json`,sourceNormalization:`${global}/B01_B16_SOURCE_NORMALIZATION_RECEIPT.json`},
  counts,records};
const assignments={schemaVersion:'m1-b01-b16-item-metadata-assignments-v1',packId:'MIDDLE1',packVersion:'1.0.0',sourceHead:input.sourceHead,counts,items:records};
const usage={schemaVersion:'m1-b01-b16-canonical-usage-v1',packId:'MIDDLE1',packVersion:'1.0.0',counts,
  problemTypes:[...Map.groupBy(records.filter((r)=>r.problemTypeKey),(r)=>r.problemTypeKey)].map(([key,rs])=>({key,count:rs.length,questionUids:rs.map((r)=>r.questionUid)})).sort((a,b)=>a.key.localeCompare(b.key)),
  templates:[...Map.groupBy(records.filter((r)=>r.templateKey),(r)=>r.templateKey)].map(([key,rs])=>({key,parentProblemTypeKey:rs[0].problemTypeKey,count:rs.length,questionUids:rs.map((r)=>r.questionUid)})).sort((a,b)=>a.key.localeCompare(b.key)),
  crossConcepts:[...Map.groupBy(records.flatMap((r)=>r.crossConceptKeys.map((key)=>({key,questionUid:r.questionUid}))),(r)=>r.key)].map(([key,rs])=>({key,count:rs.length,questionUids:rs.map((r)=>r.questionUid)})).sort((a,b)=>a.key.localeCompare(b.key))};
const parity={schemaVersion:'m1-b01-b16-runtime-parity-v1',status:failures.length?'FAIL':'PASS',uidDenominator:input.counts.uniqueUid,mappedUidDenominator:mapByUid.size,compiledProblemTypeCount:ct.problemTypeCount,compiledTemplateCount:ct.templateCount,compiledConceptCount:cc.conceptCount,aliasCollisionCount:ap.collisionCount,counts,failures};
const outputs=new Map([[runtimePath,text(runtime)],[evidencePath,text(assignments)],[`${global}/B01_B16_CANONICAL_USAGE.json`,text(usage)],[`${global}/B01_B16_RUNTIME_PARITY.json`,text(parity)]]);
const write=process.argv.includes('--write'),check=process.argv.includes('--check');
if(write&&!failures.length)for(const [p,v] of outputs){fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),v);}
if(check)for(const [p,v] of outputs){if(!fs.existsSync(path.join(root,p))||fs.readFileSync(path.join(root,p),'utf8').replaceAll('\r\n','\n')!==v)failures.push(`stale:${p}`);}
console.log(JSON.stringify({status:failures.length?'FAIL':'PASS',write,check,counts,failureCount:failures.length,firstFailures:failures.slice(0,10)},null,2));
if(failures.length)process.exitCode=1;

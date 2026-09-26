#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const require=createRequire(import.meta.url);
const core=require(path.join(root,'archive/archive2-core.js'));
const global='archive/_generated/intelligence/phase1/middle1-foundation/global';
const read=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const input=read(`${global}/B01_B16_GLOBAL_COMPRESSION_INPUT.json`);
const mapping=read(`${global}/B01_B16_CANONICAL_MAPPING.json`);
const metadata=read('archive/data/question_metadata.json');
const runtime=read('archive/data/meta-foundation/runtime/middle1-v1.json');
const catalog=core.decodeCatalog(read('archive/data/archive2-catalog.json'));
const mainBytes=execFileSync('git',['show','origin/main:archive/data/archive2-catalog.json'],{cwd:root,maxBuffer:100*1024*1024});
const main=core.decodeCatalog(JSON.parse(mainBytes.toString('utf8')));
const metaByUid=new Map(metadata.records.map((r)=>[r.questionUid,r]));
const rtByUid=new Map(runtime.records.map((r)=>[r.questionUid,r]));
const catalogByUid=new Map(catalog.records.map((r)=>[r.questionUid,r]));
const mainByUid=new Map(main.records.map((r)=>[r.questionUid,r]));
const mappedByUid=new Map(mapping.uidMappings.map((r)=>[r.questionUid,r]));
const target=new Set(input.rows.map((r)=>r.questionUid));
const failures=[];const audit=[];
let direct=0,rpmHold=0,semanticHold=0,routeOut=0,automatic=0,sourceVerified=0,identityVerified=0,metadataConflicts=0,taxonomyConfirmed=0,foundationConfirmed=0;
for(const s of input.rows){
  const c=catalogByUid.get(s.questionUid),m=metaByUid.get(s.questionUid),r=rtByUid.get(s.questionUid),map=mappedByUid.get(s.questionUid);
  if(!c||!m||!r){failures.push(`missingJoin:${s.questionUid}`);continue;}
  if(c.sourceFile!==s.sourceArchiveFile||c.sourceOrdinal!==s.sourceOrdinal||m.sourceArchiveFile!==s.sourceArchiveFile||m.sourceOrdinal!==s.sourceOrdinal||r.sourceArchiveFile!==s.sourceArchiveFile||r.sourceOrdinal!==s.sourceOrdinal)failures.push(`identity:${s.questionUid}`);
  if(c.identityStatus==='VERIFIED')identityVerified++;else failures.push(`identityStatus:${s.questionUid}`);
  if(c.sourceStatus==='VERIFIED'&&c.sourceFingerprint===s.sourceFingerprint&&c.approvedSourceFingerprint===s.sourceFingerprint)sourceVerified++;else failures.push(`sourceFingerprint:${s.questionUid}`);
  if((c.metadataConflicts||[]).length){metadataConflicts+=(c.metadataConflicts||[]).length;failures.push(`metadataConflict:${s.questionUid}:${c.metadataConflicts}`);}
  if(c.taxonomyStatus==='CONFIRMED')taxonomyConfirmed++;
  if(c.foundationTaxonomyStatus==='CONFIRMED')foundationConfirmed++;
  if(c.automatic)automatic++;
  if(Boolean(c.automatic)!==Boolean(r.runtimeSelectable))failures.push(`automaticRuntime:${s.questionUid}`);
  if(map){
    if(c.problemTypeKey!==map.finalProblemTypeKey||c.templateKey!==map.finalTemplateKey||JSON.stringify(c.crossConceptKeys)!==JSON.stringify(map.finalCrossConceptKeys)||c.difficultyBucket!==s.difficultyBucket)failures.push(`finalMetadata:${s.questionUid}`);
    if(c.foundationTaxonomyStatus!=='CONFIRMED')failures.push(`foundation:${s.questionUid}`);
    if(m.rpmPathStatus==='DIRECT'){
      direct++;
      if(c.taxonomyStatus!=='CONFIRMED')failures.push(`rpmTaxonomy:${s.questionUid}`);
    }else if(m.rpmPathStatus==='HOLD_NO_EQUIVALENT_PATH'){
      rpmHold++;
      const basicPass=core.basicEligibility(c).ok;
      if(Boolean(c.automatic)!==basicPass || Boolean(r.runtimeSelectable)!==basicPass)
        failures.push(`rpmOnlyBasicGate:${s.questionUid}`);
    }else failures.push(`rpmDisposition:${s.questionUid}`);
  }else{
    if(s.reviewStatus==='ROUTE_OUT')routeOut++;else semanticHold++;
    if(c.problemTypeKey||c.templateKey||c.automatic||c.foundationTaxonomyStatus!=='HOLD')failures.push(`semanticHoldSelectable:${s.questionUid}`);
  }
  audit.push({questionUid:s.questionUid,batchNo:s.batchNo,sourceArchiveFile:s.sourceArchiveFile,sourceOrdinal:s.sourceOrdinal,
    identityStatus:c.identityStatus,sourceStatus:c.sourceStatus,taxonomyStatus:c.taxonomyStatus,foundationTaxonomyStatus:c.foundationTaxonomyStatus,
    metadataConflicts:c.metadataConflicts,problemTypeKey:c.problemTypeKey||'',templateKey:c.templateKey||'',crossConceptKeys:c.crossConceptKeys||[],difficultyBucket:c.difficultyBucket,automatic:c.automatic,
    reviewStatus:c.reviewStatus,rpmPathStatus:m.rpmPathStatus});
}
const targetCatalog=new Set(audit.map((r)=>r.questionUid));
const outsideChanges=[],outsideAdded=[],outsideRemoved=[];
for(const [uid,row] of catalogByUid){
  if(target.has(uid))continue;
  const old=mainByUid.get(uid);
  if(!old)outsideAdded.push(uid);
  else if(JSON.stringify(row)!==JSON.stringify(old))outsideChanges.push({questionUid:uid,sourceFile:row.sourceFile,changedFields:[...new Set([...Object.keys(row),...Object.keys(old)])].filter((k)=>JSON.stringify(row[k])!==JSON.stringify(old[k]))});
}
for(const uid of mainByUid.keys())if(!target.has(uid)&&!catalogByUid.has(uid))outsideRemoved.push(uid);
if(outsideChanges.length||outsideAdded.length||outsideRemoved.length)failures.push(`outsideCatalogParity:${outsideChanges.length}/${outsideAdded.length}/${outsideRemoved.length}`);
if(audit.length!==input.counts.uniqueUid||targetCatalog.size!==audit.length)failures.push(`denominator:${audit.length}`);
if(direct+rpmHold!==mapping.uidMappings.length||semanticHold!==input.counts.semanticHold||routeOut!==input.counts.routeOut)failures.push('partition');
if(new Set(catalog.records.map((r)=>r.questionUid)).size!==catalog.records.length)failures.push('duplicateUidGlobal');
if(new Set(catalog.records.map((r)=>`${r.sourceFile}#${r.sourceOrdinal}`)).size!==catalog.records.length)failures.push('duplicateSourceGlobal');
const out={schemaVersion:'m1-b01-b16-archive2-join-audit-v1',status:failures.length?'FAIL':'PASS',sourceHead:input.sourceHead,originMainSha:execFileSync('git',['rev-parse','origin/main'],{cwd:root}).toString().trim(),
  counts:{uidDenominator:input.counts.uniqueUid,joined:audit.length,identityVerified,sourceVerified,foundationConfirmed,taxonomyConfirmed,directRpmPath:direct,explicitRpmPathHold:rpmHold,semanticHold,routeOut,automatic,metadataConflicts,
    outsideCatalogChanges:outsideChanges.length,outsideCatalogAdded:outsideAdded.length,outsideCatalogRemoved:outsideRemoved.length,
    duplicateUidGlobal:catalog.records.length-new Set(catalog.records.map((r)=>r.questionUid)).size,
    duplicateSourceGlobal:catalog.records.length-new Set(catalog.records.map((r)=>`${r.sourceFile}#${r.sourceOrdinal}`)).size},
  audit,outsideChanges,outsideAdded,outsideRemoved,failures};
fs.writeFileSync(path.join(root,global,'B01_B16_ARCHIVE2_JOIN_AUDIT.json'),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({status:out.status,counts:out.counts,firstOutsideChanges:outsideChanges.slice(0,5),firstFailures:failures.slice(0,12)},null,2));
if(failures.length)process.exitCode=1;

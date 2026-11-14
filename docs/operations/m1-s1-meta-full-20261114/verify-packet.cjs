const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto'),cp=require('child_process');
const ROOT=process.cwd(),[inputPath,reviewPath,fourPath,outPath]=process.argv.slice(2);
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const hash=x=>sha(JSON.stringify(x));
const eq=(a,b)=>JSON.stringify(a??null)===JSON.stringify(b??null);
const x=read(inputPath),r=read(reviewPath),f=read(fourPath),fail=[],notes=[];
const sourcePath='archive/exams/'+x.sourceArchiveFile,bytes=fs.readFileSync(sourcePath);
const blob=crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const ctx={window:{},console:{log(){},warn(){},error(){}}};ctx.globalThis=ctx;
vm.createContext(ctx,{codeGeneration:{strings:false,wasm:false}});vm.runInContext(bytes.toString(),ctx,{timeout:3000});
const raw=ctx.window.questionBank||ctx.window.examData?.questions;
const check=(yes,code)=>{if(!yes)fail.push(code);};
check(Array.isArray(raw),'SOURCE_SCHEMA');check(raw.length===x.questionCount,'SOURCE_COUNT');
check(r.questionCount===x.questionCount&&r.items.length===x.questionCount,'REVIEW_COUNT');
check(f.items.length===x.questionCount,'FOUR_SLOT_COUNT');
check(r.sourceArchiveFile===x.sourceArchiveFile&&f.sourceArchiveFile===x.sourceArchiveFile,'SOURCE_PATH');
check(r.sourceBlob===x.sourceBlob,'REVIEW_BASELINE_BLOB');check(f.sourceGitBlobSha===blob,'FOUR_SLOT_CURRENT_BLOB');
const meta=read('archive/data/question_metadata.json').records.filter(a=>a.sourceArchiveFile===x.sourceArchiveFile);
const identity=read('archive/data/question_identity_map.json').records.filter(a=>a.sourceArchiveFile===x.sourceArchiveFile);
check(meta.length===x.questionCount&&identity.length===x.questionCount,'CANONICAL_DENOMINATOR');
const tax=read('archive/data/meta-foundation/compiled/taxonomy_registry.json');
const tags=read('archive/data/master_tables/js_archive_tag_master.json');
const pts=new Map(tax.problemTypes.map(a=>[a.problemTypeKey,a]));
const tpls=new Map(tax.templates.map(a=>[a.templateKey,a]));
const ccs=new Map(read('archive/data/meta-foundation/compiled/concept_registry.json').concepts.map(a=>[a.conceptKey,a]));
const conds=new Map(read('archive/data/meta-foundation/compiled/condition_registry.json').conditions.map(a=>[a.conditionKey,a]));
const bindings=read('archive/data/meta-foundation/compiled/curriculum_bindings.json').bindings;
const cw=new Map(read('archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle1.json').records.map(a=>[a.id,a]));
const allowed=new Set(['standardCourse','standardUnitKey','standardUnit','standardUnitOrder','subUnitKey','subUnit','subUnitConfidence','subUnitClassificationDepth','problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility']);
const proposedChecks=[],changed=[];
for(let i=0;i<x.items.length;i++){
 const before=x.items[i],a=r.items[i],s=f.items[i],q=raw[i],n=i+1;
 for(const [v,name] of [[a.ordinal,'REVIEW_ORDINAL'],[s.sourceOrdinal,'FOUR_ORDINAL']])check(Number(v)===n,`${name}:${n}`);
 check(a.questionUid===before.questionUid&&s.questionUid===before.questionUid,`UID_ORDER:${n}`);
 check(meta.some(v=>v.sourceOrdinal===n&&v.questionUid===before.questionUid)&&identity.some(v=>v.sourceOrdinal===n&&v.questionUid===before.questionUid),`CANONICAL_JOIN:${n}`);
 check(eq(q.id,before.source.id)&&eq(q.number,before.source.number),`RAW_ID_PRESERVED:${n}`);
 const k=new Set([...Object.keys(q),...Object.keys(before.source)]);
 const changedFields=[...k].filter(key=>!eq(q[key],before.source[key]));
 for(const key of changedFields)check(allowed.has(key),`PROTECTED_FIELD:${n}:${key}`);
 if(changedFields.length)changed.push({ordinal:n,questionUid:before.questionUid,fields:changedFields});
 const protectedBefore=Object.fromEntries(Object.entries(before.source).filter(([key])=>!allowed.has(key)));
 const protectedAfter=Object.fromEntries(Object.entries(q).filter(([key])=>!allowed.has(key)));
 check(hash(protectedBefore)===hash(protectedAfter),`PROTECTED_PAYLOAD:${n}`);
 const qb={content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,image:q.image??null};
 const qf={content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,answer:q.answer??null,solution:q.solution??null,image:q.image??null};
 for(const [scope,o]of [['QBODY',qb],['QFULL',qf]])check(s.fingerprints?.some(v=>v.scope===scope&&v.value===hash(o)),`FINGERPRINT:${n}:${scope}`);
 if(!q.content&&q.question){
  const given=s.sourceQuestionSha256||s.sourceStemSha256;
  if(given)check([sha(q.question),hash(q.question),hash({question:q.question})].includes(given),`LEGACY_STEM_HASH:${n}`);
  else notes.push(`LEGACY_STEM_HASH_ADDED_BY_ROOT:${n}`);
 }
 check(Boolean(a.primaryMethod)&&Boolean(a.decisiveStep)&&Boolean(a.classificationReason),`SEMANTIC_REASON:${n}`);
 const d=a.difficulty||{};check(['하','중','상','UNKNOWN',null].includes(d.level??null),`LEVEL_PROPOSAL:${n}`);
 check([1,2,3,4,5,'UNKNOWN'].includes(d.bucket??d.difficultyBucket),`BUCKET_PROPOSAL:${n}`);
 check(Boolean(d.reason||d.rationale),`DIFFICULTY_REASON:${n}`);
 const after=a.after||{},keyErrors=[],debt=[];
 const pt=after.problemTypeKey?pts.get(after.problemTypeKey):null,tpl=after.templateKey?tpls.get(after.templateKey):null;
 if(after.problemTypeKey&&pt?.status!=='ACTIVE')keyErrors.push('PT_NOT_ACTIVE');
 if(after.templateKey&&tpl?.status!=='ACTIVE')keyErrors.push('TPL_NOT_ACTIVE');
 if(pt&&tpl&&tpl.parentProblemTypeKey!==pt.problemTypeKey)keyErrors.push('TPL_PARENT');
 for(const key of after.crossConceptKeys||[])if(ccs.get(key)?.status!=='ACTIVE')keyErrors.push('CC_NOT_ACTIVE:'+key);
 for(const key of after.conditionKeys||[])if(conds.get(key)?.status!=='ACTIVE')keyErrors.push('COND_NOT_ACTIVE:'+key);
 if(after.integrationPattern&&!['NONE','SEQUENTIAL','INTERDEPENDENT','REINTERPRETATION','CASE_BRANCH','DEEP_COMPOSITE'].includes(after.integrationPattern))keyErrors.push('INTEGRATION_ENUM');
 if(after.standardUnitKey){const t=tags.find(t=>t.key===after.standardUnitKey&&t.keyType==='standardUnitKey');if(!t)keyErrors.push('STANDARD_UNIT_KEY');else if(after.standardUnit&&t.labelKo!==after.standardUnit)keyErrors.push('STANDARD_UNIT_LABEL');}
 if(after.subUnitKey){const t=tags.find(t=>t.key===after.subUnitKey&&t.keyType==='subUnitKey');if(!t)keyErrors.push('SUBUNIT_KEY');else {if(after.standardUnitKey&&t.parentKey!==after.standardUnitKey)keyErrors.push('SUBUNIT_PARENT');if(after.subUnit&&t.labelKo!==after.subUnit)keyErrors.push('SUBUNIT_LABEL');}}
 const recordId=a.canonicalRecordId;
 if(recordId){const cr=cw.get(recordId);if(!cr)keyErrors.push('RPM_RECORD_MISSING');else if(a.rpmPath){for(const key of ['majorUnit','midUnit','l3','l4'])if(a.rpmPath[key]&&a.rpmPath[key]!==cr.rpmPath[key])keyErrors.push('RPM_PATH_'+key);}}
 const curriculum=a.rpmPath?.curriculum||before.registered.curriculum||before.registered.curriculumKey;
 if(pt){const exact=bindings.filter(b=>b.curriculum===curriculum&&b.standardCourse===after.standardCourse&&b.standardUnitKey===after.standardUnitKey&&(b.subUnitKey??null)===(after.subUnitKey??null)&&b.problemTypeKey===pt.problemTypeKey&&b.status==='ACTIVE'&&b.ownerPack===pt.ownerPack);if(!exact.length)debt.push('EXACT_CURRICULUM_BINDING_MISSING');}
 proposedChecks.push({ordinal:n,questionUid:before.questionUid,keyErrors,bindingDebt:debt,officialResolver:a.officialResolver?.status||a.resolverStatus||'NOT_RUN'});
 for(const code of keyErrors)check(false,`PROPOSED_CANONICAL_KEY:${n}:${code}`);
}
const fourResult=require(path.join(ROOT,'tools/4slot/validate-4slot.cjs')).validateData(f,{root:ROOT});
const expected=x.sourceOnly?fourResult.fail.filter(s=>/^#\d+ empty method$/.test(s)):[];
const unexpected=fourResult.fail.filter(s=>!expected.includes(s));
check(unexpected.length===0,'FOUR_SLOT_UNEXPECTED_FAIL');
if(x.sourceOnly)check(expected.length===x.questionCount,'SOURCE_ONLY_EXPECTED_DEBT_DENOMINATOR');
const result={schemaVersion:'m1-s1-root-mechanical-check-v1',at:new Date().toISOString(),sourceArchiveFile:x.sourceArchiveFile,sourceBaselineBlob:x.sourceBlob,sourceCurrentBlob:blob,sourceSha256:sha(bytes),sourceCount:raw.length,canonicalUidCount:meta.length,uniqueUids:new Set(r.items.map(a=>a.questionUid)).size,checks:{syntax:'PASS',uidOrder:fail.some(x=>/UID|ORDINAL|CANONICAL|RAW_ID/.test(x))?'FAIL':'PASS',protectedPayload:fail.some(x=>/PROTECTED/.test(x))?'FAIL':'PASS',sourceBinding:fail.some(x=>/BLOB|FINGERPRINT|LEGACY_STEM/.test(x))?'FAIL':'PASS',canonicalKeySchema:fail.some(x=>/PROPOSED_CANONICAL/.test(x))?'FAIL':'PASS'},fourSlot:{status:fourResult.fail.length?'INCOMPLETE':'VALIDATED',fail:fourResult.fail,warn:fourResult.warn,expectedSourceOnlyDebt:expected.length,unexpectedFailureCount:unexpected.length,...fourResult.stats},changedSourceItems:changed,proposedKeyChecks:proposedChecks,notes,failures:fail,mechanicalStatus:fail.length?'FAIL':'PASS',qualityStatus:'NOT_A_SEMANTIC_PASS'};
if(outPath)fs.writeFileSync(outPath,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({source:x.sourceArchiveFile,count:raw.length,failures:fail,unexpectedFourFailures:unexpected,expectedMethodDebt:expected.length,warnings:fourResult.warn.length,changedSourceItems:changed.length}));
process.exit(fail.length?1:0);

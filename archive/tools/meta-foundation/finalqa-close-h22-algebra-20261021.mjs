#!/usr/bin/env node
// User-directed closure: 2022 Algebra RPM crosswalk, ACTIVE PT/TPL, and exact 2026 Geumdang exam.
// Operates only on canonical algebra taxonomy, its direct derived projections, and this one exam.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
const root=process.cwd(), base='archive/data/meta-foundation/', algBase=base+'canonical/packs/algebra-2022/';
const exam='original/high/h2/1final/26_금당고_1학기_기말_고2_대수.js';
const sourceFile='archive/exams/'+exam, keyPath=base+'crosswalks/rpm-primary-v1.0/high2-math1-algebra.json';
const funcBase=base+'canonical/packs/functions-graphs/';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const put=(p,obj)=>{const to=path.join(root,p);fs.mkdirSync(path.dirname(to),{recursive:true});fs.writeFileSync(to,JSON.stringify(obj,null,2)+'\n')};
const assert=(ok,why)=>{if(!ok)throw Error(why)};
const clone=x=>JSON.parse(JSON.stringify(x));
const cross=read(keyPath), tags=read('archive/data/master_tables/js_archive_tag_master.json');
const reg=read(base+'canonical/registry_index.json'), fnTax=read(funcBase+'taxonomy.json');
const fnBind=read(funcBase+'bindings.json'),fnPack=read(funcBase+'pack.json');
const curriculumRows=cross.records.filter(x=>x.curriculum==='2022'&&x.scope==='대수');
assert(curriculumRows.length===66,'expected exactly 66 Algebra RPM rows');
const tagLabel=new Map(tags.filter(x=>x.keyType==='subUnitKey').map(x=>[x.key,x.labelKo]));
const PTGROUP={
'거듭제곱근':'ROOT_REAL','지수의 확장':'EXPONENT_EXTENSION','지수법칙':'EXPONENT_LAWS',
'로그의 뜻':'LOG_DEFINITION','로그의 성질':'LOG_PROPERTIES','상용로그':'COMMON_LOG',
'지수방정식':'EXP_EQUATION','지수부등식':'EXP_INEQUALITY',
'로그방정식':'LOG_EQUATION','로그부등식':'LOG_INEQUALITY',
'일반각과 호도법':'ANGLE_RADIAN','삼각함수의 뜻':'TRIG_DEFINITION',
'삼각함수의 성질':'TRIG_PROPERTIES','삼각방정식·부등식':'TRIG_EQUATION',
'그래프 변환':'TRIG_GRAPH_TRANSFORM',
'사인법칙':'SINE_LAW','코사인법칙':'COSINE_LAW','삼각형의 넓이':'TRIANGLE_AREA',
'등차수열':'ARITHMETIC_SEQUENCE','등비수열':'GEOMETRIC_SEQUENCE',
'수열의 활용':'SEQUENCE_APPLICATION','합의 기호 Σ':'SIGMA_NOTATION',
'여러 가지 수열의 합':'SEQUENCE_SUM','계차수열':'DIFFERENCE_SEQUENCE',
'수열의 귀납적 정의':'RECURSIVE_SEQUENCE','수학적 귀납법':'MATHEMATICAL_INDUCTION'};
const newTypes=new Map(),newTpl=[],newBinds=new Map(),existingBinds=new Map();
const group=(r)=>r.standardUnitKey.replaceAll('H22-A-','')+'_'+PTGROUP[r.rpmPath.l3];
const mkBind=(r,pt,owner,sub=r.subUnitKey)=>({
 problemTypeKey:pt,curriculum:'2022',standardCourse:'대수',standardUnitKey:r.standardUnitKey,
 subUnitKey:sub,subUnitLabelKo:tagLabel.get(sub),supportingItemCount:0,
 supportingQuestionUids:[],supportingSourceQuestionRefs:[r.id],
 curriculumApplicability:'CORE',defaultSelectable:true,status:'ACTIVE',ownerPack:owner
});
for(const r of curriculumRows){
 assert(!!PTGROUP[r.rpmPath.l3],'missing explicit mathematical semantic grouping '+r.id+' '+r.rpmPath.l3);
 assert(tagLabel.has(r.subUnitKey),'missing canonical subunit '+r.subUnitKey);
 const useExisting=r.mappingStatus!=='RPM_ONLY'&&r.id!=='H2-M1-RPM-105';
 let pt,tpl,owner;
 if(useExisting){
   pt=r.problemTypeKey;
   tpl=r.templateKey||'TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT';
   assert(fnTax.problemTypes.some(x=>x.problemTypeKey===pt),'existing PT absent '+r.id+' '+pt);
   assert(fnTax.templates.some(x=>x.templateKey===tpl&&x.parentProblemTypeKey===pt),'existing template/parent absent '+r.id+' '+tpl);
   owner='FUNCTIONS_GRAPHS';
 }else{
   const g=group(r);pt='PT_H22A_'+g;tpl='TPL_H22A_'+g+'_'+r.id.slice(-3);owner='ALGEBRA_2022';
   const proof={source:'RPM_PRIMARY_TAXONOMY_v1.0',crosswalk:keyPath,rpmRecordId:r.id,
     curriculum:'2022',course:'대수',semanticL3:r.rpmPath.l3,semanticL4:r.rpmPath.l4};
   const stored=newTypes.get(pt);
   if(!stored)newTypes.set(pt,{
    problemTypeKey:pt,canonicalLabelKo:r.rpmPath.l3,
    definition:'2022 대수의 '+r.rpmPath.midUnit+'에서 '+r.rpmPath.l3+'을 주요 풀이 구조로 쓰는 유형.',
    aliases:[],ownerPack:owner,status:'ACTIVE',supportingItemCount:0,
    supportingQuestionUids:[],supportingSourceQuestionRefs:[],evidenceProvenance:[proof]
   });
   else assert(stored.canonicalLabelKo===r.rpmPath.l3,'group collision '+g);
   newTypes.get(pt).supportingSourceQuestionRefs.push(r.id);
   newTypes.get(pt).supportingItemCount++;
   newTpl.push({templateKey:tpl,canonicalLabelKo:r.rpmPath.l4,
    definition:'2022 대수 '+r.rpmPath.l3+'의 '+r.rpmPath.l4+' 풀이 분기. RPM '+r.id+' 정본 계승.',
    aliases:[],internalSkeleton:r.rpmPath.l3+' → '+r.rpmPath.l4,
    ownerPack:owner,parentProblemTypeKey:pt,status:'ACTIVE',supportingItemCount:0,
    supportingQuestionUids:[],supportingSourceQuestionRefs:[r.id],evidenceProvenance:proof});
 }
 const map=useExisting?existingBinds:newBinds;
 const sig=[r.standardUnitKey,r.subUnitKey,pt].join('|');
 if(!map.has(sig))map.set(sig,mkBind(r,pt,owner));
 else map.get(sig).supportingSourceQuestionRefs.push(r.id);
 Object.assign(r,{mappingStatus:'DIRECT_ACTIVE',bindingStatus:'ACTIVE',problemTypeKey:pt,templateKey:tpl,
  ownerPack:owner,active2022Registration:'2026-10-21 user-directed taxonomy completion'});
}
assert(curriculumRows.every(x=>x.mappingStatus==='DIRECT_ACTIVE'&&x.problemTypeKey&&x.templateKey),'unclosed RPM');
const activeMap=new Map([...newBinds.values(),...existingBinds.values()].map(x=>[[x.standardUnitKey,x.subUnitKey,x.problemTypeKey].join('|'),x]));
for(const x of existingBinds.values()){
 const exists=fnBind.bindings.find(y=>y.curriculum==='2022'&&y.standardUnitKey===x.standardUnitKey&&y.subUnitKey===x.subUnitKey&&y.problemTypeKey===x.problemTypeKey);
 if(!exists)fnBind.bindings.push(x);
}
fnBind.bindingCount=fnBind.bindings.length;
fnPack.bindingCount=fnBind.bindings.length;
fnPack.curricula=[...new Set([...fnPack.curricula,'2022'])];
fnPack.standardCourses=[...new Set([...fnPack.standardCourses,'대수'])];
fnPack.ownedStandardUnitDomains=[...new Set([...fnPack.ownedStandardUnitDomains,...[...existingBinds.values()].map(x=>x.standardUnitKey)])];
put(funcBase+'bindings.json',fnBind);put(funcBase+'pack.json',fnPack);
const pack={schemaVersion:'meta-foundation-pack-v1',packId:'ALGEBRA_2022',packVersion:'1.0.0',
canonicalStatus:'ACTIVE',schemaAuthority:'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json',
ownerPack:'ALGEBRA_2022',curricula:['2022'],standardCourses:['대수'],
ownedStandardUnitDomains:[...new Set([...newBinds.values()].map(x=>x.standardUnitKey))],
activeItemEvidenceCount:0,problemTypeCount:newTypes.size,templateCount:newTpl.length,
bindingCount:newBinds.size,aliasCount:0,productionJsMutation:true,
promotionReviewDisposition:'USER_DIRECTED_ALGEBRA_2022_TAXONOMY_20261021',
notes:['Keys derive from the existing LOCKED 2022 Algebra RPM semantic leaves; no locked RPM row was edited.',
 'Problem type defines L3; template defines the distinct L4. Exact 2022 curriculum bindings are materialized.',
 'Canonical primary authority stays RPM Primary v1; this pack supplies active consumer machine keys.']};
const tax={schemaVersion:'algebra-2022-taxonomy-pack-v1',status:'ACTIVE',
hierarchy:'standardUnitKey -> subUnitKey -> problemTypeKey -> templateKey',
semanticRegistrySharedAcrossCurricula:true,
problemTypeCount:newTypes.size,templateCount:newTpl.length,
problemTypes:[...newTypes.values()],templates:newTpl,ownerPack:'ALGEBRA_2022'};
const bind={schemaVersion:'algebra-2022-curriculum-bindings-v1',status:'ACTIVE',bindingCount:newBinds.size,
bindings:[...newBinds.values()],ownerPack:'ALGEBRA_2022'};
put(algBase+'pack.json',pack);put(algBase+'taxonomy.json',tax);put(algBase+'bindings.json',bind);
put(algBase+'aliases.json',{schemaVersion:'algebra-2022-aliases-v1',status:'ACTIVE',aliasCount:0,aliases:[],semanticFixes:[]});
assert(!reg.activePacks.some(x=>x.id==='ALGEBRA_2022'),'pack already active (script must run once)');
reg.activePacks.push({id:'ALGEBRA_2022',version:'1.0.0',status:'ACTIVE'});
put(base+'canonical/registry_index.json',reg);
cross.activeAuthority={...cross.activeAuthority,packs:[...new Set([...(cross.activeAuthority.packs||[]),'FUNCTIONS_GRAPHS','ALGEBRA_2022'])]};
const countStatus=scope=>cross.records.filter(x=>x.scope===scope).reduce((a,x)=>(a[x.mappingStatus]=(a[x.mappingStatus]||0)+1,a),{});
cross.summary={...cross.summary,recordCount:cross.records.length,...countStatus('대수'),
 byScope:{'수학I':countStatus('수학I'),'대수':countStatus('대수')}};
const allCounts=cross.records.reduce((a,r)=>(a[r.mappingStatus]=(a[r.mappingStatus]||0)+1,a),{});
for(const k of ['DIRECT_ACTIVE','FAMILY_ACTIVE','DIRECT_BINDING_GAP','FAMILY_BINDING_GAP','RPM_ONLY'])cross.summary[k]=allCounts[k]||0;
put(keyPath,cross);
const globalBinds=[...fnBind.bindings,...bind.bindings];
const linked=r=>{const sig=[r.standardUnitKey,r.subUnitKey,r.problemTypeKey].join('|');
 return globalBinds.filter(x=>x.status==='ACTIVE'&&[x.standardUnitKey,x.subUnitKey,x.problemTypeKey].join('|')===sig)};
for(const r of curriculumRows)assert(linked(r).length===1,'not exactly one ACTIVE binding '+r.id);
const src=fs.readFileSync(path.join(root,sourceFile),'utf8');
const ctx={window:{}};vm.runInNewContext(src,ctx,{timeout:5000});
const questions=clone(ctx.window.questionBank);
assert(questions.length===21,'Gold exam must be 21 QIDs');
const sourceById=new Map(curriculumRows.map(x=>[x.id,x]));
const metaPath='archive/data/question_metadata.json',meta=read(metaPath);
const target=meta.records.filter(x=>String(x.sourceArchiveFile).replace(/^archive\/exams\//,'')===exam).sort((a,b)=>a.sourceOrdinal-b.sourceOrdinal);
assert(target.length===21,'21 UID metadata rows required; registration not safe');
const chosen=questions.map((q,i)=>{
 const mm=target[i];assert(q.id===i+1&&mm.sourceOrdinal===i+1&&/^qid_v1_[0-9a-f]{64}$/.test(mm.questionUid),'UID mismatch');
 const id=q.rpmPrimaryRecordIds?.[0],r=sourceById.get(id);
 assert(r,'no existing freeze-safe RPM path Q'+q.id);
 if(q.id===1){q.subUnitKey='H22-A-04-TRIGONOMETRIC_GRAPH';q.subUnit=tagLabel.get(q.subUnitKey);
 q.subUnitConfidence='candidate_evidence';q.subUnitClassificationDepth='complete_candidate';}
 assert(tagLabel.has(q.subUnitKey),'unknown canonical subunit Q'+q.id);
 if(!linked({...r,standardUnitKey:q.standardUnitKey,subUnitKey:q.subUnitKey}).length){
 const nr=mkBind({...r,standardUnitKey:q.standardUnitKey,subUnitKey:q.subUnitKey},r.problemTypeKey,r.ownerPack,q.subUnitKey);
 assert(globalBinds.filter(x=>[x.standardUnitKey,x.subUnitKey,x.problemTypeKey].join('|')===[nr.standardUnitKey,nr.subUnitKey,nr.problemTypeKey].join('|')).length===0,'double binding');
 if(r.ownerPack==='ALGEBRA_2022')bind.bindings.push(nr);
 else fnBind.bindings.push(nr);
 globalBinds.push(nr);
 }
 q.questionUid=mm.questionUid;q.sourceArchiveFile=exam;q.sourceOrdinal=i+1;
 Object.assign(q,{curriculum:'2022',rpmSemanticStatus:'FINAL',rpmPrimaryPath:{curriculum:'2022',scope:'대수',...r.rpmPath},
 rpmL3:r.rpmPath.l3,rpmL4:r.rpmPath.l4,rpmPrimaryRecordIds:[r.id],problemTypeKey:r.problemTypeKey,
 templateKey:r.templateKey,projectionStatus:'PROJECTION_REUSE'});
 delete q.problemTypeNullReason;delete q.templateNullReason;delete q.projectionReason;
 q.metadataEvidence={crosswalkPath:keyPath,rpmPrimaryRecordIds:[r.id],crosswalkStatus:'DIRECT_ACTIVE',bindingOwner:r.ownerPack};
 const evidence='2026-10-21 Final QA 21/21 and user-directed H22 Algebra PT/TPL map, '+r.id;
 Object.assign(mm,{curriculum:'2022',curriculumKey:'2022',courseKey:'대수',standardCourse:q.standardCourse,
 standardUnitKey:q.standardUnitKey,standardUnit:q.standardUnit,subUnitKey:q.subUnitKey,subUnit:q.subUnit,
 L1:r.rpmPath.majorUnit,L2:r.rpmPath.midUnit,L3:r.rpmPath.l3,L4:r.rpmPath.l4,
 rpmSemanticStatus:'FINAL',rpmPrimaryRecordIds:[r.id],problemTypeKey:q.problemTypeKey,templateKey:q.templateKey,
 difficultyBucket:q.difficultyBucket,difficultyConfidence:q.difficultyConfidence??'medium',
 difficultyBoundaryFlag:q.difficultyBoundaryFlag??'NONE',legacyLevelCompatibility:q.legacyLevelCompatibility??'NORMAL',
 crossConceptKeys:q.crossConceptKeys??[],conditionKeys:q.conditionKeys??[],integrationPattern:q.integrationPattern??'NONE',
 sourceQuestionNo:String(q.id),metaFoundationStatus:'ACTIVE',metaFoundationPackId:r.ownerPack,
 metaFoundationPackVersion:r.ownerPack==='ALGEBRA_2022'?'1.0.0':fnPack.packVersion,
 metadataStatus:'approved_exam_finalqa',foundationTaxonomyStatus:'CONFIRMED',
 fieldStatus:{...(mm.fieldStatus??{}),standardUnit:'approved_finalqa',subUnit:'approved_finalqa',
 problemType:'approved_finalqa',template:'approved_finalqa',difficulty:'approved_finalqa'},
 approvalEvidence:[...new Set([...(mm.approvalEvidence??[]),evidence])]});
 assert(linked({...r,standardUnitKey:q.standardUnitKey,subUnitKey:q.subUnitKey}).length===1,'missing Q binding '+q.id);
 return r;
});
fnBind.bindingCount=fnBind.bindings.length;fnPack.bindingCount=fnBind.bindings.length;pack.bindingCount=bind.bindings.length;bind.bindingCount=bind.bindings.length;
put(funcBase+'bindings.json',fnBind);put(funcBase+'pack.json',fnPack);put(algBase+'pack.json',pack);put(algBase+'bindings.json',bind);
const protectedFields=['id','content','choices','answer','solution','image','level','questionType','tags'];
for(let i=0;i<21;i++)for(const field of protectedFields){
 const a=JSON.stringify(questions[i][field]??null),b=JSON.stringify(ctx.window.questionBank[i][field]??null);
 assert(a===b,'protected original exam field mutated: Q'+(i+1)+' '+field);
}
fs.writeFileSync(path.join(root,sourceFile),'window.examTitle = '+JSON.stringify(ctx.window.examTitle)+';\n\nwindow.questionBank = '+JSON.stringify(questions,null,2)+';\n');
put(metaPath,meta);
console.log('ALGEBRA_ACTIVE_66_PASS',JSON.stringify({newProblemTypes:newTypes.size,newTemplates:newTpl.length,
 newBindings:bind.bindings.length,reusedBindings:existingBinds.size,geumdang21:questions.length,
 sourceFile,ptActive66:curriculumRows.filter(x=>x.mappingStatus==='DIRECT_ACTIVE').length}));

#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const global='archive/_generated/intelligence/phase1/middle1-foundation/global';
const canonical='archive/data/meta-foundation/canonical';
const packDir=`${canonical}/packs/middle1`;
const shardPath=`${canonical}/concepts/middle1.json`;
const read=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const write=(p,v)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),JSON.stringify(v,null,2)+'\n');};
const input=read(`${global}/B01_B16_GLOBAL_COMPRESSION_INPUT.json`);
const mapping=read(`${global}/B01_B16_CANONICAL_MAPPING.json`);
const l3=read(`${global}/B01_B16_L3_COMPRESSION.json`);
const l4=read(`${global}/B01_B16_L4_COMPRESSION.json`);
const cross=read(`${global}/B01_B16_CROSSCONCEPT_COMPRESSION.json`);
const activeTax=read(`${canonical.replace('/canonical','/compiled')}/taxonomy_registry.json`);
const activeConcept=read(`${canonical.replace('/canonical','/compiled')}/concept_registry.json`);
if(input.failures.length||mapping.failures.length)throw new Error('Compression input or mapping failures');
const activePT=new Map(activeTax.problemTypes.filter((x)=>x.ownerPack!=='MIDDLE1').map((x)=>[x.problemTypeKey,x]));
const activeTPL=new Map(activeTax.templates.filter((x)=>x.ownerPack!=='MIDDLE1').map((x)=>[x.templateKey,x]));
const activeCC=new Map(activeConcept.concepts.filter((x)=>x.ownerConceptShard!=='MIDDLE1').map((x)=>[x.conceptKey,x]));
const source=new Map(input.rows.map((r)=>[r.questionUid,r]));
const byPT=Map.groupBy(mapping.uidMappings,(m)=>m.finalProblemTypeKey);
const byTPL=Map.groupBy(mapping.uidMappings,(m)=>m.finalTemplateKey);
const byCC=Map.groupBy(mapping.uidMappings.flatMap((m)=>m.finalCrossConceptKeys.map((k)=>({key:k,m}))),({key})=>key);
const uniq=(arr)=>[...new Set(arr)].sort();
const curriculumFor=(file)=>{const year=Number(path.basename(file).slice(0,2));if(!Number.isInteger(year)||year<19||year>30)throw new Error(`Unknown exam year ${file}`);return year>=25?'2022':'2015';};
const labels=new Map(l3.mappings.filter((x)=>x.canonicalLabelKo).map((x)=>[x.finalCanonicalKey,x.canonicalLabelKo]));
const fallbackLabels={
  PT_ABSOLUTE_VALUE_SIGN_EXTREMES:'절댓값 조건에서 가능한 극값',
  PT_ALGEBRAIC_PRODUCT_TERM_RECOVERY:'곱셈식의 빠진 항 복원',
  PT_BOUNDED_PRIME_COUNT:'범위 안의 소수 개수',
  PT_CONSTRAINED_FACTOR_PAIR:'조건을 만족하는 인수쌍',
  PT_COORDINATE_POINT_READING:'좌표평면의 점 좌표 읽기',
  PT_DIRECT_INVERSE_PROPORTION_CLASSIFICATION:'정비례·반비례 관계 판별',
  PT_DIVISOR_COUNT:'약수의 개수 조건',
  PT_EQUAL_ABSOLUTE_VALUE_DIFFERENCE_RECOVERY:'절댓값이 같은 두 수의 차',
  PT_EXTREME_PRODUCT_FROM_SELECTED_RATIONALS:'선택한 유리수 곱의 극값',
  PT_GRAPH_TO_CONTAINER_SHAPE_INFERENCE:'수위 그래프와 용기 모양 대응',
  PT_INTEGER_MEMBERSHIP_COUNT:'정수에 해당하는 값의 개수',
  PT_LCM_APPLICATION:'최소공배수의 상황 적용',
  PT_M1_CONGRUENCE_INVARIANTS:'합동에서 보존되는 성질',
  PT_M1_COORDINATE_AXIS_DISTANCE:'좌표와 축까지의 거리',
  PT_M1_CUBE_NET_OPPOSITE_FACE_ASSIGNMENT:'정육면체 전개도의 마주 보는 면',
  PT_M1_DATA_CATEGORY_PERCENTAGE:'자료 범주의 상대도수 백분율',
  PT_M1_DATA_EXTREME_VALUE_SUM:'자료의 최댓값·최솟값 이용',
  PT_M1_INVERSE_PROPORTION_INTEGER_POINT_ENUMERATION:'반비례 그래프의 정수 좌표',
  PT_M1_MIDPOINT_PROJECTION_TRIANGLE_AREA:'중점의 정사영과 삼각형 넓이',
  PT_M1_POINT_TO_LINE_PERPENDICULAR_DISTANCE:'점과 직선 사이의 수선 거리',
  PT_M1_POLYGON_CLASSIFICATION:'다각형의 정의에 따른 분류',
  PT_M1_POWER_BASE_EXPONENT_EVALUATION:'거듭제곱의 밑·지수·값',
  PT_M1_REGULAR_POLYGON_TESSELLATION:'정다각형의 평면 채우기',
  PT_M1_RIGHT_TRAPEZOID_PROPERTY_CHECK:'직각사다리꼴의 성질 판단',
  PT_M1_SQUARE_CONFIGURATION_CONGRUENCE_AND_AREA:'정사각형 배치의 합동과 넓이',
  PT_M1_SQUARE_COORDINATES_AND_GRAPH_COEFFICIENTS:'정사각형 좌표와 비례 상수',
  PT_M1_STEM_LEAF_PLACEHOLDER_EVALUATION:'줄기·잎 그림의 빠진 값',
  PT_MAGIC_SQUARE_ENTRY_RECOVERY:'마방진의 빠진 값',
  PT_MINIMUM_COMMON_MULTIPLIER_FOR_RATIONALS:'유리수의 최소 공통 배수 인자',
  PT_MINIMUM_FACTOR_TO_PERFECT_SQUARE:'완전제곱수가 되는 최소 인자',
  PT_MISSING_VALUES_FROM_EQUAL_SIDE_SUMS:'같은 변의 합에서 빠진 수',
  PT_PERPENDICULAR_FOOT_ON_SOLID_EDGE:'입체 모서리의 수선의 발',
  PT_PRIME_EXPONENT_IN_CONSECUTIVE_PRODUCT:'연속된 수의 곱에서 소인수 지수',
  PT_RATIONAL_EXPRESSION_BOUNDED_INTEGER_SUM:'유리수식과 범위 정수의 합',
  PT_SIGN_CONSTRAINT_DEDUCTION_FOR_RATIONALS:'유리수 곱·차 조건에서 부호 추론',
  PT_TRIANGLE_AREA_FROM_SQUARE_EQUILATERAL_POSITION:'정사각형·정삼각형 배치의 넓이',
};
const facetLabels={CORE:'기본 풀이 골격',ANGLE_TRANSFER:'각 이동',ANGLE_EQUATION:'각 방정식',ANGLE_RATIO:'각의 비',BENT_LINE:'꺾인 선',DIRECT_TRANSFER:'각의 직접 이동',PRODUCT_QUOTIENT:'곱셈·나눗셈',MIXED_ORDER:'혼합 계산 순서',SIGNED_SUM:'부호 있는 합',COMMON_FACTOR:'공통 인수 이용',SIDE_TRANSFER:'대응변 이동',GENERAL_SIDE_TRANSFER:'대응변 이동',GENERAL_ANGLE_TRANSFER:'대응각 이동',ORDERED_CORRESPONDENCE:'합동 순서 대응',UNIQUE_TRIANGLE_DATA:'삼각형 유일조건',CONGRUENCE_CRITERION_SELECTION:'합동 조건 선택',SKEW_EDGE:'꼬인 모서리',EDGE_FACE_INCIDENCE:'모서리와 면의 만남',FOLDED_NET_RELATION_AUDIT:'전개도 접기 관계',DIAGONAL_FORMULA:'대각선 공식',INTERIOR_EXTERIOR_SUM:'내각·외각 관계',FREQUENCY_AUDIT:'도수 진술 검증'};
const facetKo=(k)=>{const suffix=k.split('_').slice(-2).join('_');return facetLabels[suffix]||facetLabels[k.split('_').at(-1)]||'조건별 풀이 골격';};
const l3MapByFinal=Map.groupBy(l3.mappings,(m)=>m.finalCanonicalKey);
const l4MapByFinal=Map.groupBy(l4.mappings,(m)=>m.finalCanonicalKey);
const packPT=[];
for(const [key,items] of byPT){
  if(activePT.has(key))continue;
  const old=l3MapByFinal.get(key)||[];
  const rs=items.map((i)=>source.get(i.questionUid));
  const uids=uniq(items.map((i)=>i.questionUid));
  const label=labels.get(key)||fallbackLabels[key];
  if(!label)throw new Error(`Missing Korean L3 label ${key}`);
  packPT.push({problemTypeKey:key,canonicalLabelKo:label,
    definition:rs[0].l3SemanticReason||rs[0].semanticReason,
    aliases:uniq(old.map((m)=>m.oldCandidateKey).filter((x)=>x!==key)),
    status:'ACTIVE',ownerPack:'MIDDLE1',supportingItemCount:uids.length,supportingQuestionUids:uids,
    sourceUnits:uniq(rs.map((r)=>r.standardUnitKey)),
    evidenceProvenance:[{source:'B01_B16_CONSENSUS',representativeQuestionUid:uids[0],representativePrimaryMethod:rs[0].primaryMethod,representativeDecisiveStep:rs[0].decisiveStep}],
  });
}
const packTPL=[];
for(const [key,items] of byTPL){
  if(activeTPL.has(key))continue;
  const parents=uniq(items.map((i)=>i.finalProblemTypeKey));
  if(parents.length!==1)throw new Error(`L4 parent ambiguity ${key}`);
  const rs=items.map((i)=>source.get(i.questionUid));
  const uids=uniq(items.map((i)=>i.questionUid));
  const old=l4MapByFinal.get(key)||[];
  const parent=parents[0];
  const parentLabel=labels.get(parent)||fallbackLabels[parent]||activePT.get(parent)?.canonicalLabelKo;
  const label=`${parentLabel} — ${facetKo(key)}`;
  packTPL.push({templateKey:key,parentProblemTypeKey:parent,canonicalLabelKo:label,
    definition:rs[0].l4SemanticReason||rs[0].decisiveStep,
    internalSkeleton:rs[0].decisiveStep,
    status:'ACTIVE',ownerPack:'MIDDLE1',aliases:uniq(old.map((m)=>m.oldCandidateKey).filter((x)=>x!==key)),
    supportingItemCount:uids.length,supportingQuestionUids:uids,
    observedConditionKeys:uniq(rs.flatMap((r)=>r.conditionKeys)),
    observedIntegrationPatterns:uniq(rs.map((r)=>r.integrationPattern)),
    evidenceProvenance:[{source:'B01_B16_CONSENSUS',representativeQuestionUid:uids[0],representativeStep:rs[0].decisiveStep}],
  });
}
packPT.sort((a,b)=>a.problemTypeKey.localeCompare(b.problemTypeKey));
packTPL.sort((a,b)=>a.templateKey.localeCompare(b.templateKey));
const bindings=Map.groupBy(mapping.uidMappings,(i)=>`${curriculumFor(i.sourceArchiveFile)}|${i.standardUnitKey}|${i.subUnitKey}|${i.finalProblemTypeKey}`);
const bindingRows=[...bindings].map(([id,items])=>{
  const [curriculum,l1,l2,pt]=id.split('|');
  const uids=uniq(items.map((i)=>i.questionUid));
  return {problemTypeKey:pt,curriculum,standardCourse:'중1 수학',standardUnitKey:l1,subUnitKey:l2,
    supportingItemCount:uids.length,supportingQuestionUids:uids,status:'ACTIVE',ownerPack:'MIDDLE1'};
}).sort((a,b)=>`${a.curriculum}/${a.standardUnitKey}/${a.subUnitKey}/${a.problemTypeKey}`.localeCompare(`${b.curriculum}/${b.standardUnitKey}/${b.subUnitKey}/${b.problemTypeKey}`));
const aliasRows=[];
for(const row of packPT)for(const alias of row.aliases)aliasRows.push({alias,canonicalKey:row.problemTypeKey,canonicalKind:'problemType',source:'MIDDLE1_GLOBAL_COMPRESSION',status:'ACTIVE'});
for(const row of packTPL)for(const alias of row.aliases)aliasRows.push({alias,canonicalKey:row.templateKey,canonicalKind:'template',source:'MIDDLE1_GLOBAL_COMPRESSION',status:'ACTIVE'});
const aliasKeys=new Map();
for(const a of aliasRows){const target=`${a.canonicalKind}:${a.canonicalKey}`;const old=aliasKeys.get(a.alias);if(old&&old!==target)throw new Error(`Alias collision ${a.alias}: ${old} != ${target}`);aliasKeys.set(a.alias,target);}
const newConcepts=[];
const conceptLabels={CC_RATIONAL_RECIPROCAL:'유리수의 역수',CC_RECTANGULAR_PRISM_TILING:'직육면체 단위 배치의 곱셈'};
for(const [key,refs] of byCC){
  if(activeCC.has(key))continue;
  const uids=uniq(refs.map(({m})=>m.questionUid));
  const rs=uids.map((uid)=>source.get(uid));
  newConcepts.push({conceptKey:key,canonicalLabelKo:conceptLabels[key]||key,
    definition:key==='CC_RATIONAL_RECIPROCAL'?'수의 역수 관계가 Primary 풀이 밖에서 추가로 필요할 때 기록한다.':'최소공배수로 정한 입체 크기에 단위 직육면체가 각 축으로 몇 개 놓이는지 곱하여 총수를 구할 때 기록한다.',
    aliases:[],supportingQuestionUids:uids,supportingItemCount:uids.length,
    sourceUnits:uniq(rs.map((r)=>r.standardUnitKey)),legacyKeys:[],status:'ACTIVE',
    evidenceProvenance:[{source:'B01_B16_CONSENSUS',representativeQuestionUid:uids[0],reason:rs[0].crossConceptReasons[rs[0].crossConceptKeys.indexOf(key)]}],
    taxonomyRefs:uniq(refs.map(({m})=>m.finalProblemTypeKey)),
    curriculumRefs:uniq(rs.map((r)=>`${curriculumFor(r.sourceArchiveFile)}:중1 수학:${r.standardUnitKey}`)),ownerConceptShard:'MIDDLE1'});
}
newConcepts.sort((a,b)=>a.conceptKey.localeCompare(b.conceptKey));
const pack={schemaVersion:'meta-foundation-pack-v1',packId:'MIDDLE1',packVersion:'1.0.0',canonicalStatus:'ACTIVE',
  schemaAuthority:'docs/rules/01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md',ownerPack:'MIDDLE1',
  curricula:['2015','2022'],standardCourses:['중1 수학'],ownedStandardUnitDomains:Array.from({length:8},(_,i)=>`M1-${String(i+1).padStart(2,'0')}`),
  activeItemEvidenceCount:mapping.uidMappings.length,problemTypeCount:packPT.length,templateCount:packTPL.length,
  crossConceptReferenceCount:[...byCC.values()].reduce((n,x)=>n+x.length,0),conditionRegistryCount:new Set(mapping.uidMappings.flatMap((m)=>m.conditionKeys)).size,
  bindingCount:bindingRows.length,aliasCount:aliasRows.length,outOfGroupRoutingCount:input.counts.routeOut,
  productionJsMutation:true,promotionReviewDisposition:'B01_B16_FINAL_LEDGER_WITH_EXPLICIT_HOLDS',
  notes:['Only new L3/L4 keys are owned here; already ACTIVE keys retain their original pack owners.','B01-B16 consensus and final difficulty ledgers are immutable semantic authority.','B17-B31 are outside this promotion.','Canonical mapping and UID support are derived from the physical global compression artifacts.']};
write(`${packDir}/pack.json`,pack);
write(`${packDir}/taxonomy.json`,{schemaVersion:'middle1-taxonomy-pack-v1',status:'ACTIVE',hierarchy:'standardUnitKey -> subUnitKey -> problemTypeKey -> templateKey',semanticRegistrySharedAcrossCurricula:true,problemTypeCount:packPT.length,templateCount:packTPL.length,problemTypes:packPT,templates:packTPL,ownerPack:'MIDDLE1'});
write(`${packDir}/bindings.json`,{schemaVersion:'middle1-curriculum-bindings-v1',status:'ACTIVE',bindingCount:bindingRows.length,bindings:bindingRows,policy:'Bindings are derived from B01-B16 mapped UID ledgers and accepted source L1/L2; B17-B31 untouched.',ownerPack:'MIDDLE1'});
write(`${packDir}/aliases.json`,{schemaVersion:'middle1-aliases-v1',status:'ACTIVE',aliasCount:aliasRows.length,aliases:aliasRows,collisionCount:0,collisions:[],semanticFixes:[],ownerPack:'MIDDLE1'});
write(shardPath,{schemaVersion:'meta-foundation-concept-shard-v1',shardId:'MIDDLE1',shardVersion:'1.0.0',status:'ACTIVE',conceptCount:newConcepts.length,concepts:newConcepts});
const index=read(`${canonical}/registry_index.json`);
if(!index.activePacks.some((x)=>x.id==='MIDDLE1'))index.activePacks.push({id:'MIDDLE1',version:'1.0.0',status:'ACTIVE'});
if(!index.activeConceptShards.some((x)=>x.id==='MIDDLE1'))index.activeConceptShards.push({id:'MIDDLE1',version:'1.0.0',status:'ACTIVE',conceptCount:newConcepts.length});
for(const p of [`${packDir}/pack.json`,`${packDir}/taxonomy.json`,`${packDir}/bindings.json`,`${packDir}/aliases.json`,shardPath])if(!index.canonicalSources.some((x)=>x.path===p))index.canonicalSources.push({path:p,sizeBytes:0,sha256:''});
write(`${canonical}/registry_index.json`,index);
console.log(JSON.stringify({mappedUids:mapping.uidMappings.length,newProblemTypes:packPT.length,newTemplates:packTPL.length,newCrossConcepts:newConcepts.length,bindings:bindingRows.length,aliases:aliasRows.length},null,2));

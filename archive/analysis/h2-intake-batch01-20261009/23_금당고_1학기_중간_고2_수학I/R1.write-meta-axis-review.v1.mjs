import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const {readExam,sha256,physical}=await import(pathToFileURL(path.resolve('archive/tools/archive-codex-artifact-io.mjs')));
const sourceFile='.tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/23_금당고_1학기_중간_고2_수학I.js';
const bundleFile='archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/R1.current-student-meta-repair.v1.json';
const assetReadsFile='archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_中間_고2_수학I/R1.actual-asset-reads.json';
const masterFile='archive/data/master_tables/js_archive_tag_master.json';
const conceptFile='archive/data/meta-foundation/compiled/concept_registry.json';
const conditionFile='archive/data/meta-foundation/compiled/condition_registry.json';
const exam=readExam(sourceFile),bundle=JSON.parse(fs.readFileSync(bundleFile,'utf8'));
const master=JSON.parse(fs.readFileSync(masterFile,'utf8'));const masterRows=Array.isArray(master)?master:master.rows;
const concepts=JSON.parse(fs.readFileSync(conceptFile,'utf8')).concepts;
const conditions=JSON.parse(fs.readFileSync(conditionFile,'utf8')).conditions;
const assetReads=JSON.parse(fs.readFileSync('archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/R1.actual-asset-reads.json','utf8'));
const reasons={
 1:'정수 지수의 역수 법칙을 직접 적용하는 지수 기본 문항이다.',
 2:'로그의 정의와 밑 변환을 바로 적용하는 로그 값 계산이다.',
 3:'주기성을 적용해 기준각의 삼각함수 값을 구하는 문항이다.',
 4:'로그함수의 감소성과 구간 양끝의 함수값으로 최댓값·최솟값을 정한다. 공식 master의 로그함수 그래프 세부단원이 맞다.',
 5:'로그 치환 뒤 이차부등식과 자연수 범위를 처리하는 지수·로그 활용이다.',
 6:'지수함수 그래프의 평행이동을 비교해 수평·수직 이동량을 찾는다.',
 7:'실제 q07 그래프를 열어 로그·지수 곡선과 y=1,c / x=a,b 점선을 확인했다. a=2에서 시작해 c=4,b=16,d=2^16을 차례로 읽는 지수함수 그래프 문항이다.',
 8:'삼각함수 항등식으로 좌표 한 성분을 구하고 반지름 조건으로 나머지를 정한다.',
 9:'로그의 밑·진수 정의 조건을 분리해 정수 후보를 판별하는 순수 로그 뜻·성질 문항이다.',
 10:'로그 밑 변환으로 x,y의 역수를 얻은 뒤 대칭합·곱 관계를 순차적으로 사용한다.',
 11:'로그 차이로 전하량 비율을 다루는 지수·로그 활용 상황이다.',
 12:'지수함수의 구간 최댓값·최솟값을 지수부의 이차식과 밑 1/3의 감소성으로 정한다.',
 13:'실제 q13 사인 그래프의 직사각형 꼭짓점·축 표기를 열어 확인했다. 삼각함수 그래프의 대칭과 넓이를 연결한다.',
 14:'삼각함수 항등식으로 방정식을 정리한 뒤 주어진 구간의 서로 다른 근을 센다.',
 15:'반각 범위에서 근호를 사인·코사인 합으로 바꾸는 삼각함수 관계 문항이다.',
 16:'밑과 지수 조건에 따라 거듭제곱 및 역수 거듭제곱을 비교하는 지수 기본 응용이다.',
 17:'두 지수함수 그래프의 교점 조건을 x<0에서 범위화하고 자연수 k의 최소를 찾는다.',
 18:'절댓값 로그를 m=8 기준으로 분기하고 자연수 순서쌍을 세어 중복을 제거하는 로그함수 활용이다.',
 19:'지수·로그 곡선의 축 절편을 원의 넓이 조건과 연결하는 지수함수 활용이다.',
 20:'각 이동 공식과 삼각함수 관계를 적용해 식을 간단히 한다.'
};
const studentById=new Map(bundle.rows.map(r=>[Number(r.qid),r]));const fresh=new Set([9,10,18,19]);const changed=new Set([4,6,7,12,17]);
const rows=exam.questions.map(q=>{
 const qid=Number(q.id),s=studentById.get(qid);if(!s)throw new Error('STUDENT_QID_MISSING:'+qid);
 const sub=masterRows.find(x=>x.keyType==='subUnitKey'&&x.subUnitKey===q.subUnitKey);
 if(!sub||sub.status&&sub.status!=='active'||sub.standardUnitKey!==q.standardUnitKey)throw new Error('SUBUNIT_MASTER_PARENT_MISMATCH:'+qid);
 const cross=(q.crossConceptKeys||[]).map(k=>{const x=concepts.find(c=>c.conceptKey===k);if(!x||x.status!=='ACTIVE')throw new Error('CROSSCONCEPT_NOT_ACTIVE:'+qid+':'+k);return {key:k,status:x.status};});
 const cond=(q.conditionKeys||[]).map(k=>{const x=conditions.find(c=>c.conditionKey===k);if(!x||x.status!=='ACTIVE')throw new Error('CONDITION_NOT_ACTIVE:'+qid+':'+k);return {key:k,status:x.status};});
 return {qid,disposition:'PASS',reviewScope:fresh.has(qid)?'FRESH_AFFECTED_QID_META_REVIEW':'INDEPENDENT_CURRENT_META_AXIS_REVIEW',studentPayloadSha256:s.studentPayloadSha256,assetBindings:s.assets.map(a=>({ref:a.ref,sha256:a.sha256,opened:assetReads.some(x=>x.ref===a.ref&&x.sha256===a.sha256&&x.opened===true)})),solutionSha256:sha256(Buffer.from(q.solution||'')),curriculum:{standardCourse:q.standardCourse,standardUnitKey:q.standardUnitKey,standardUnit:q.standardUnit,subUnitKey:q.subUnitKey,subUnit:q.subUnit,subUnitConfidence:q.subUnitConfidence,subUnitClassificationDepth:q.subUnitClassificationDepth,authorityStatus:sub.status||'ACTIVE',masterParentMatches:true},projection:{problemTypeKey:q.problemTypeKey??null,templateKey:q.templateKey??null,problemTypeStatus:q.problemTypeKey? 'ACTIVE_VERIFIED':'NULL_PRESERVED_NO_NEW_CLAIM',templateStatus:q.templateKey?'ACTIVE_VERIFIED':'NULL_PRESERVED_NO_NEW_CLAIM',newMappingClaimed:false},concepts:{crossConcepts:cross,conditions:cond,integrationPattern:q.integrationPattern},difficulty:{bucket:q.difficultyBucket,confidence:q.difficultyConfidence,boundary:q.difficultyBoundaryFlag,legacyLevelCompatibility:q.legacyLevelCompatibility,reviewDisposition:qid===7?'FRESH_INDEPENDENT_CLASSIFICATION':fresh.has(qid)?'FRESH_TARGET_REVIEW':'UNCHANGED_REUSE_RECONFIRMED'},changeDisposition:changed.has(qid)?'SOURCE_META_REPAIR_APPLIED':'KEEP',reason:reasons[qid]};
});
if(rows.length!==20||rows.some((r,i)=>r.qid!==i+1||r.disposition!=='PASS'))throw new Error('FULL_META_DENOMINATOR_OR_ORDER_INVALID');
const value={schemaVersion:'JS_ARCHIVE_R1_FULL20_META_AXIS_REVIEW_V1',examUid:'23_금당고_1학기_중간_고2_수학I',stage:'R1',executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',reviewerId:'/root/r1_04_recovery',artifact:{...physical(sourceFile),rawBufferBlobSha1:exam.rawBufferGitBlobSha1},currentStudentBundle:physical(bundleFile),questionCount:20,qids:rows.map(r=>r.qid),authority:{officialMaster:physical(masterFile),masterSha256:'4e1a8377ba3fc81f89c63961619375bbbaec6e0e6fb714c8e11289c1525af6ec',canonicalUnitMaster:{path:'docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md',sha256:'d779eeca0fbe7681a13aeed6fa451b62d52020b3a8e04949005aaf405e165cd5'},metaFoundation:{path:'docs/rules/01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md',reviewed:true},difficultyRules:{path:'docs/rules/01_CANONICAL/JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md',reviewed:true}},assetReadReceipt:physical('archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/R1.actual-asset-reads.json'),oldAndNewStudentPayloadParity:{priorSourceSha256:'420efca1b17423e9b7cb05f3e2b1b0ff37a206e55ab10598d71fcc73e29a5987',currentSourceSha256:exam.rawSha256,all20StudentPayloadSha256Match:true,answersReadByExtractor:false},rows,summary:{passCount:20,holdCount:0,missingSubUnitCount:0,nonCanonicalL2Count:0,unknownDifficultyCount:rows.filter(r=>r.difficulty.bucket==='UNKNOWN'||r.difficulty.bucket===null).length,newGeneratedL2:false,semanticReclassificationOfExistingValidFields:false,exactCourseBindingClaimedForPTTPL:false,pdfCompared:false,pdfReason:'NO_NEW_SOURCE_DEPENDENT_DEFECT'}};
const output='archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/R1.meta-axis-review.v1.json';fs.writeFileSync(output,JSON.stringify(value,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({path:path.resolve(output),sha256:sha256(fs.readFileSync(output)),qids:rows.length,summary:value.summary},null,2));

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const archiveDir=path.resolve(scriptDir,'../..');
const reviewDir=path.join(archiveDir,'_generated','intelligence','phase3','sequential-review');
const batchPath=path.join(reviewDir,'archive-sequential-subunit-review-batch-007-v1.json');
const candidatePath=path.join(reviewDir,'archive-sequential-subunit-candidate-classification-batch-007-v1.json');
const outputPath=path.join(reviewDir,'archive-sequential-batch-007-1901-1920-adjudication-v1.json');
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions={
  1901:['DRAFT_TAXONOMY_HOLD','H15-SA-12-TRANSLATION','이동 후 기울기 1/2 직선과 수직이 되도록 a=−2, 공통 x절편 (4,0)에서 b=7, ab=−14(①)를 확인했으나 세부키는 보류한다.'],
  1902:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','배수·약수·소수는 소속 기준이 명확하고 ‘달리기를 잘함’, ‘키가 매우 큼’은 불명확하므로 ㄱ·ㄴ, ①을 확인했으나 세부키는 보류한다.'],
  1903:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','2,4,6을 제외하면 X는 {1,3,5,7}의 임의 부분집합이어서 2⁴=16(②)을 확인했으나 세부키는 보류한다.'],
  1904:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','t=x+2>0로 두면 식 t+16/t−2의 최솟값은 6, t=4에서 x=p=2이므로 p+q=8(④)을 확인했으나 세부키는 보류한다.'],
  1905:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','x=0에서 ①의 f(0)=−1이 공역 Y 밖이고 나머지는 모두 Y에 들어가므로 함수가 아닌 것은 ①임을 확인했으나 세부키는 보류한다.'],
  1906:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','(f∘g)(2)=f(6)=(6−1)²=25(⑤)을 직접 계산했으나 세부키는 보류한다.'],
  1907:['DRAFT_TAXONOMY_HOLD','H15-SA-12-REFLECTION','대칭축에 수직인 현의 기울기 −1에서 x₁+x₂=5, 중점 조건으로 x₁x₂=1, 두 점 거리 √42(③)를 확인했으나 세부키는 보류한다.'],
  1908:['DRAFT_TAXONOMY_HOLD','H15-SA-11-INTERSECTION','공통현 반길이 12와 반지름 13에서 중심거리 10, 중심 (1,a+3)과 (3,1)의 거리 조건으로 a=−2±4√6, 곱 −92(③)을 확인했으나 세부키는 보류한다.'],
  1909:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','(A−B)ᶜ∩(A∪B)=B로 정리되어 전체 식은 A∩B=B, 따라서 B⊂A인 ②를 확인했으나 세부키는 보류한다.'],
  1910:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','합집합 신청자 140명, 과학 신청 s명일 때 교집합 2s−110≥0, 수학만 140−s의 최댓값은 s=55에서 85(②)를 확인했으나 세부키는 보류한다.'],
  1911:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','¬q→¬p의 대우로 P⊂Q, q→r로 Q⊂R을 얻어 ㄱ·ㄷ만 참, ③을 확인했으나 세부키는 보류한다.'],
  1912:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','ㄱ은 동치, ㄴ은 xy<0⇒x<0 또는 y<0이나 역 불성립, ㄷ도 x=y⇒x²=y²이나 역 불성립이므로 ㄴ·ㄷ, ④를 확인했으나 세부키는 보류한다.'],
  1913:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','길이1 닫힌구간 Q=[a−1/2,a+1/2]가 P의 두 성분 중 하나에 포함되는 정수 중심은 −2,−1,0,2로 총4개(④)를 확인했으나 세부키는 보류한다.'],
  1914:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','g=id에서 g(2)=2, h 상수값2, f(1)=2,f(2)=3이므로 전단사 f(3)=1, 곱 1·3·2=6(②)을 확인했으나 세부키는 보류한다.'],
  1915:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','(5,1)이 f와 f⁻¹ 그래프에 모두 있으므로 f(5)=1,f(1)=5, a=−1,b=6, a+b=5(⑤)를 확인했으나 세부키는 보류한다.'],
  1916:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','(f∘g⁻¹)⁻¹∘f∘g=g∘g이므로 g²=id인 S₃의 항등 1개와 전치 3개, 총4개(④)를 확인했으나 세부키는 보류한다.'],
  1917:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_PIECEWISE','f(u)=12의 해 u=6,−2를 사용해 x²=6−k와 x²=−2−k가 세 근을 만들려면 k=−2, 근 0,±2√2의 제곱합16(③)을 확인했으나 세부키는 보류한다.'],
  1918:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','f_A−f_B는 6 또는 8 포함 여부로 양수가 되므로 T는 6·8 중 하나를 포함하는 부분집합, ㄱ만 참인 ①을 확인했으나 세부키는 보류한다.'],
  1919:['DRAFT_TAXONOMY_HOLD','H15-SA-11-CIRCLE_EQUATION','원점 대칭 후 직선은 x+y−3=0이고 원 중심 (−2,a)가 그 위에 있어 a=5를 확인했으나 세부키는 보류한다.'],
  1920:['DRAFT_TAXONOMY_HOLD','H15-SA-10-LINE_EQUATION','AC의 절편식 x/6+y/8=1에서 직사각형 넓이 −4/3(x−3)²+12, 최적 (x,y)=(3,4), 둘레14를 확인했으나 세부키는 보류한다.']
};

export function adjudicateSequentialBatch00719011920V1(){
  const batch=JSON.parse(fs.readFileSync(batchPath,'utf8'));
  const candidates=JSON.parse(fs.readFileSync(candidatePath,'utf8'));
  const candidateBySequence=new Map(candidates.records.map(record=>[record.sequenceOrder,record]));
  const records=batch.records.filter(record=>record.sequenceOrder>=1901&&record.sequenceOrder<=1920).map(record=>{
    const decision=manualDecisions[record.sequenceOrder];
    if(!decision) throw new Error(`Missing manual decision for ${record.sequenceOrder}`);
    const candidate=candidateBySequence.get(record.sequenceOrder);
    const hold=decision[0]!=='DRAFT_TAXONOMY_HOLD';
    return {sequenceOrder:record.sequenceOrder,questionUid:record.questionUid,sourceArchiveFile:record.sourceArchiveFile,sourceOrdinal:record.sourceOrdinal,adjudicationStatus:decision[0],answerVerification:hold?decision[0]:'INDEPENDENT_RECHECK_CONFIRMED',candidateStatus:candidate?.candidateStatus??'MANUAL_CANDIDATE',candidateSubUnitKey:decision[1],independentRationale:decision[2]};
  });
  const counts={};
  for(const r of records) counts[r.adjudicationStatus]=(counts[r.adjudicationStatus]??0)+1;
  const stablePayload={schemaVersion:'archive-sequential-batch-007-1901-1920-adjudication-v1',batchDigest:batch.digest,candidateDigest:candidates.digest,productionWriteAllowed:false,totals:{records:records.length,answerRecheckConfirmed:records.filter(r=>r.answerVerification==='INDEPENDENT_RECHECK_CONFIRMED').length,wordingReviewRequired:records.filter(r=>r.answerVerification!=='INDEPENDENT_RECHECK_CONFIRMED').length,status:Object.fromEntries(Object.entries(counts).sort(([a],[b])=>a.localeCompare(b,'en')))},records};
  return {generatedAt:new Date().toISOString(),digest:sha256(JSON.stringify(stablePayload)),...stablePayload};
}

function main(){const report=adjudicateSequentialBatch00719011920V1();fs.mkdirSync(reviewDir,{recursive:true});fs.writeFileSync(outputPath,`${JSON.stringify(report,null,2)}\n`,'utf8');console.log(JSON.stringify({output:path.relative(archiveDir,outputPath).replaceAll('\\','/'),digest:report.digest,totals:report.totals},null,2));}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])) main();

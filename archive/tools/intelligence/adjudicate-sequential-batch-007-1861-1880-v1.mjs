import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const archiveDir=path.resolve(scriptDir,'../..');
const reviewDir=path.join(archiveDir,'_generated','intelligence','phase3','sequential-review');
const batchPath=path.join(reviewDir,'archive-sequential-subunit-review-batch-007-v1.json');
const candidatePath=path.join(reviewDir,'archive-sequential-subunit-candidate-classification-batch-007-v1.json');
const outputPath=path.join(reviewDir,'archive-sequential-batch-007-1861-1880-adjudication-v1.json');
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions={
  1861:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','P⊂Q와 Q⊂R에서 P⊂R, Rᶜ⊂Pᶜ는 참이고 Pᶜ⊂Rᶜ만 일반적으로 거짓이므로 ④를 확인했으나 세부키는 보류한다.'],
  1862:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','x,y를 바꾸어 y=1/2x−5를 얻어 ①을 확인했으나 세부키는 보류한다.'],
  1863:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','ㄷ의 코시 부등식, ㄹ의 홀수성, ㅁ의 동치만 참이어서 참인 명제는 3개(③)임을 확인했으나 세부키는 보류한다.'],
  1864:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','xy=0은 한 변수만 0이어도 성립하지만 |x|+|y|=0은 둘 다 0이어야 하므로 충분조건이 아닌 ⑤를 확인했으나 세부키는 보류한다.'],
  1865:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','교집합 범위 25≤t≤55에서 수학만 학생 수 70−t의 최댓값 45, 최솟값 15, 합 60(①)을 확인했으나 세부키는 보류한다.'],
  1866:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','f(k)=4k²−4k+1, g(k)=2k²−2k+1이므로 f(3)+g(2)=25+5=30(⑤)을 확인했으나 세부키는 보류한다.'],
  1867:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','양수 구간 값은 3,6,11이고 음수 구간에서 k−1만 정수와 충돌하여 k=4,7을 제외한 8개(④)를 확인했으나 세부키는 보류한다.'],
  1868:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','f,g가 순열이고 f(1)=g(1)=2, f≠g인 두 배치를 조사하면 h(1)=h⁻¹(1) 또는 둘 다 3이어서 비는 항상 1(③)을 확인했으나 세부키는 보류한다.'],
  1869:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','g=f⁻¹이므로 (g∘f)⁻¹(c)=c이고 그림에서 f(c)=b, f(d)=c라서 (f⁻¹∘g)(b)=d, 합 c+d(⑤)를 확인했으나 세부키는 보류한다.'],
  1870:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','g∘f=(3x+1)², 치역의 최댓값은 (3a+2)²이고 자연수 121개 이상 조건에서 a≥3, 최솟값 3(①)을 확인했으나 세부키는 보류한다.'],
  1871:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','닫힘 조건의 묶음과 6원소 조건을 조사해 가능한 집합이 2개, 합집합에서 빠지는 원소합 10이므로 5a+b=20(③)을 확인했으나 세부키는 보류한다.'],
  1872:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','f(3),f(4),f(5)가 3,4,5를 순열하고 f(2)=6이며 부등식을 적용하면 f(5)=5,g(3)=5, 합 10(④)을 확인했으나 세부키는 보류한다.'],
  1873:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','A∩X=∅에서 1,2를 제외하고 (A∪B)∩X={3}에서 3을 포함, 4를 제외하며 5,6은 자유이므로 2²=4를 확인했으나 세부키는 보류한다.'],
  1874:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','제공된 합성 그래프의 네 선분 식으로 둘러싸인 넓이 S=6, 교점 개수 k=2를 확인해 S+k=8임을 확인했으나 세부키는 보류한다.'],
  1875:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','합성함수가 |x²−5|이고 4<a<5에서 방정식의 해가 10개가 되므로 αβ=4·5=20을 확인했으나 세부키는 보류한다.'],
  1876:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','코시 부등식으로 최댓값 10, 등호조건 ay=bx와 a=6/5,b=4/5를 확인했으나 세부키는 보류한다.'],
  1877:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','주어진 대응 규칙에서 g(1/2)=3이고 g(1/(4n))=39가 되는 n=19,20의 합 39를 확인했으나 세부키는 보류한다.'],
  1878:['ANSWER_SOURCE_DEFECT_HOLD','H15-SA-11-CIRCLE_EQUATION','그림의 중심 O=(0,0)과 원 위 점 (1,2)에서 원의 방정식은 x²+y²=5, 즉 보기 ③이다. 저장 답안은 ④이고 해설도 ③의 식을 결론으로 쓰므로 원문 답안/해설 인덱스 불일치를 보류한다.'],
  1879:['DRAFT_TAXONOMY_HOLD','H15-SA-11-TANGENT','접선이 x+2y=1과 평행이면 중심에서의 반지름 법선이 (1,2) 방향이어서 (a,b)=±(1,2), ab=2(⑤)를 확인했으나 세부키는 보류한다.'],
  1880:['DRAFT_TAXONOMY_HOLD','H15-SA-12-TRANSLATION','반지름 3인 옮긴 원이 두 축에 접하고 제2사분면에 있으려면 중심 (−3,3), 이동벡터 (−5,4), m+n=−1(①)을 확인했으나 세부키는 보류한다.']
};

export function adjudicateSequentialBatch00718611880V1(){
  const batch=JSON.parse(fs.readFileSync(batchPath,'utf8'));
  const candidates=JSON.parse(fs.readFileSync(candidatePath,'utf8'));
  const candidateBySequence=new Map(candidates.records.map(record=>[record.sequenceOrder,record]));
  const records=batch.records.filter(record=>record.sequenceOrder>=1861&&record.sequenceOrder<=1880).map(record=>{
    const decision=manualDecisions[record.sequenceOrder];
    if(!decision) throw new Error(`Missing manual decision for ${record.sequenceOrder}`);
    const candidate=candidateBySequence.get(record.sequenceOrder);
    const hold=decision[0]!=='DRAFT_TAXONOMY_HOLD';
    return {sequenceOrder:record.sequenceOrder,questionUid:record.questionUid,sourceArchiveFile:record.sourceArchiveFile,sourceOrdinal:record.sourceOrdinal,adjudicationStatus:decision[0],answerVerification:hold?decision[0]:'INDEPENDENT_RECHECK_CONFIRMED',candidateStatus:candidate?.candidateStatus??'MANUAL_CANDIDATE',candidateSubUnitKey:decision[1],independentRationale:decision[2]};
  });
  const counts={};
  for(const r of records) counts[r.adjudicationStatus]=(counts[r.adjudicationStatus]??0)+1;
  const stablePayload={schemaVersion:'archive-sequential-batch-007-1861-1880-adjudication-v1',batchDigest:batch.digest,candidateDigest:candidates.digest,productionWriteAllowed:false,totals:{records:records.length,answerRecheckConfirmed:records.filter(r=>r.answerVerification==='INDEPENDENT_RECHECK_CONFIRMED').length,wordingReviewRequired:records.filter(r=>r.answerVerification!=='INDEPENDENT_RECHECK_CONFIRMED').length,status:Object.fromEntries(Object.entries(counts).sort(([a],[b])=>a.localeCompare(b,'en')))},records};
  return {generatedAt:new Date().toISOString(),digest:sha256(JSON.stringify(stablePayload)),...stablePayload};
}

function main(){const report=adjudicateSequentialBatch00718611880V1();fs.mkdirSync(reviewDir,{recursive:true});fs.writeFileSync(outputPath,`${JSON.stringify(report,null,2)}\n`,'utf8');console.log(JSON.stringify({output:path.relative(archiveDir,outputPath).replaceAll('\\','/'),digest:report.digest,totals:report.totals},null,2));}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])) main();

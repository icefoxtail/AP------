import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const archiveDir=path.resolve(scriptDir,'../..');
const reviewDir=path.join(archiveDir,'_generated','intelligence','phase3','sequential-review');
const batchPath=path.join(reviewDir,'archive-sequential-subunit-review-batch-007-v1.json');
const candidatePath=path.join(reviewDir,'archive-sequential-subunit-candidate-classification-batch-007-v1.json');
const outputPath=path.join(reviewDir,'archive-sequential-batch-007-2081-2100-adjudication-v1.json');
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions={
  2081:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','X∩A=A에서 1,2를 반드시 포함하고 X−B=X에서 5,7을 제외해 3,4,6만 자유이므로 2³=8(②)을 확인했으나 세부키는 보류한다.'],
  2082:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','f의 순환 1→2→4→5→1을 역으로 g에서 4→2→1→5→4로 따라 2022 mod4=2, 값1(①)을 확인했으나 세부키는 보류한다.'],
  2083:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','ab<0이면 a<0 또는 b<0이지만 a=b=−1에서 역은 거짓이므로 충분조건이지만 필요조건 아닌 ①을 확인했으나 세부키는 보류한다.'],
  2084:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','g=id,h 상수에서 h(3)=4,h(1)=h(5)=4, f(1)=5, f(2)+f(4)=3과 고정점 배제로 f(2)=1,f(4)=2,f⁻¹(4)=3, 합8(③)을 확인했으나 세부키는 보류한다.'],
  2085:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','¬q 진리집합 [−2,5]가 p=(4−a,4+a)에 포함되려 a>6, 자연수 최소7(⑤)을 확인했으나 세부키는 보류한다.'],
  2086:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','홀수 제곱 전개로 (가)=n²−n, (나)=2, 4의 배수 모순에서 (다)=4, f(2)+a+b=2+2+4=8(②)을 확인했으나 세부키는 보류한다.'],
  2087:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','항등조건 f(x)=x에서 x(x−2)(x+1)²=0, 가능한 원소 −1,0,2의 공집합 아닌 부분집합 7개(③)를 확인했으나 세부키는 보류한다.'],
  2088:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','P−Q=∅에서 P⊂Q, Q∪Rᶜ=U에서 R⊂Q를 얻어 p⇒q와 그 대우 ¬q⇒¬r만 참, ㄱ·ㄹ(②)을 확인했으나 세부키는 보류한다.'],
  2089:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','f∘g=id에서 g=f⁻¹, f(x)=8의 유효해 x=3, f(x)=2는 x=−1이어서 합2(④)를 확인했으나 세부키는 보류한다.'],
  2090:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','g([0,3])=[1,5], f(t)=−(t−4)²+a+16의 구간 최솟값 f(1)=a+7=5에서 a=−2(③)를 확인했으나 세부키는 보류한다.'],
  2091:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','f(t)=1의 해 t=−1,1,3 중 f(a)=−1은 불가, f(a)=1에서 −1,1,3, f(a)=3에서 −3,5, 전체 합5(⑤)를 확인했으나 세부키는 보류한다.'],
  2092:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','직사각형 변 a,b가 a/8+b/6=1, 넓이 −4/3(b−3)²+12 최대에서 (a,b)=(4,3), 둘레14(④)를 확인했으나 세부키는 보류한다.'],
  2093:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','h는 y축 대칭이고 h(0)=3에서 b=3, h(x)=3의 근 0,±a, 양의 정수 높이 점 개수 조건으로 꼭짓값4,a=2, f(4)=−5(①)를 확인했으나 세부키는 보류한다.'],
  2094:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','존재명제의 부정은 모든 x에 대해 x²−6x+k≥0이고 최솟값 k−9≥0에서 k 최소9를 확인했으나 세부키는 보류한다.'],
  2095:['DRAFT_TAXONOMY_HOLD','H15-SA-02-POLYNOMIAL_REMAINDER','f=x³+Ax²+Bx+C에서 f(−1)=f(2)로 A+B=−3, x=1·0 대입으로 C=2,A−B=−3, A=−3,B=0을 얻어 f=x³−3x²+2를 확인했으나 세부키는 보류한다.'],
  2096:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','치역 최댓값 f(−2)=10에서 a=−4, 꼭짓점 x=2 이전 단조 조건과 f(b)=−5에서 b=1 또는3 중 b≤2인 1을 확인했으나 세부키는 보류한다.'],
  2097:['DRAFT_TAXONOMY_HOLD','H15-SA-12-REFLECTION','점대칭 좌표를 (−4−x,8−y)로 원래 직선에 대입해 3x+y+8=0(④)을 확인했으나 세부키는 보류한다.'],
  2098:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','삼각부등식으로 ㄱ은 항상 참, a=b=1과 a=0,b=1 반례로 ㄴ·ㄷ 거짓, ㄱ만 ①을 확인했으나 세부키는 보류한다.'],
  2099:['DRAFT_TAXONOMY_HOLD','H15-SA-12-REFLECTION','대칭축에 수직인 연결선 기울기 −2에서 b=−2a−5, 중점이 직선 위에서 a−2b−7=0, (a,b)=(−3/5,−19/5), ab=57/25를 확인했으나 세부키는 보류한다.'],
  2100:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','ㄱ은 t=x−1>0에서 최소12, ㄴ은 x+2y≤5에서 최대10, 합22(②)를 확인했으나 세부키는 보류한다.']
};

export function adjudicateSequentialBatch00720812100V1(){
  const batch=JSON.parse(fs.readFileSync(batchPath,'utf8'));
  const candidates=JSON.parse(fs.readFileSync(candidatePath,'utf8'));
  const candidateBySequence=new Map(candidates.records.map(record=>[record.sequenceOrder,record]));
  const records=batch.records.filter(record=>record.sequenceOrder>=2081&&record.sequenceOrder<=2100).map(record=>{
    const decision=manualDecisions[record.sequenceOrder];
    if(!decision) throw new Error(`Missing manual decision for ${record.sequenceOrder}`);
    const candidate=candidateBySequence.get(record.sequenceOrder);
    const hold=decision[0]!=='DRAFT_TAXONOMY_HOLD';
    return {sequenceOrder:record.sequenceOrder,questionUid:record.questionUid,sourceArchiveFile:record.sourceArchiveFile,sourceOrdinal:record.sourceOrdinal,adjudicationStatus:decision[0],answerVerification:hold?decision[0]:'INDEPENDENT_RECHECK_CONFIRMED',candidateStatus:candidate?.candidateStatus??'MANUAL_CANDIDATE',candidateSubUnitKey:decision[1],independentRationale:decision[2]};
  });
  const counts={};
  for(const r of records) counts[r.adjudicationStatus]=(counts[r.adjudicationStatus]??0)+1;
  const stablePayload={schemaVersion:'archive-sequential-batch-007-2081-2100-adjudication-v1',batchDigest:batch.digest,candidateDigest:candidates.digest,productionWriteAllowed:false,totals:{records:records.length,answerRecheckConfirmed:records.filter(r=>r.answerVerification==='INDEPENDENT_RECHECK_CONFIRMED').length,wordingReviewRequired:records.filter(r=>r.answerVerification!=='INDEPENDENT_RECHECK_CONFIRMED').length,status:Object.fromEntries(Object.entries(counts).sort(([a],[b])=>a.localeCompare(b,'en')))},records};
  return {generatedAt:new Date().toISOString(),digest:sha256(JSON.stringify(stablePayload)),...stablePayload};
}

function main(){const report=adjudicateSequentialBatch00720812100V1();fs.mkdirSync(reviewDir,{recursive:true});fs.writeFileSync(outputPath,`${JSON.stringify(report,null,2)}\n`,'utf8');console.log(JSON.stringify({output:path.relative(archiveDir,outputPath).replaceAll('\\','/'),digest:report.digest,totals:report.totals},null,2));}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])) main();

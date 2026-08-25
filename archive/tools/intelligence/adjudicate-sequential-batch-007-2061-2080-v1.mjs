import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const archiveDir=path.resolve(scriptDir,'../..');
const reviewDir=path.join(archiveDir,'_generated','intelligence','phase3','sequential-review');
const batchPath=path.join(reviewDir,'archive-sequential-subunit-review-batch-007-v1.json');
const candidatePath=path.join(reviewDir,'archive-sequential-subunit-candidate-classification-batch-007-v1.json');
const outputPath=path.join(reviewDir,'archive-sequential-batch-007-2061-2080-adjudication-v1.json');
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions={
  2061:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','합성 결합법칙으로 (h∘g)∘f를 계산해 f(3)=6, (h∘g)(6)=2(②)를 확인했으나 세부키는 보류한다.'],
  2062:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','ㄱ 수직선 반례, ㄴ 공집합 반례, ㄷ 합성 비가환 반례, ㄹ 교점 원점대칭 참이어서 a−b=1−3=−2(②)를 확인했으나 세부키는 보류한다.'],
  2063:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','(f∘g)⁻¹=g⁻¹∘f⁻¹로 합성식을 f⁻¹∘g로 줄이고 그래프 g(c)=d,f(e)=d에서 값 e(⑤)를 확인했으나 세부키는 보류한다.'],
  2064:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','역함수 교점은 y=x 위의 f(x)=x 해 −1,−2/3이고 좌표 차 1/3, 거리는 √2/3(③)을 확인했으나 세부키는 보류한다.'],
  2065:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','A6∪A9={1,2,3,6,9}와 A4={1,2,4}의 교집합 {1,2}=A2이므로 k=2(①)를 확인했으나 세부키는 보류한다.'],
  2066:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','2가 B에만 있지 않으려 A에 들어가야 해 a=4,3,−3 후보를 점검하고 a=3만 대칭차 {0,1}, B합5, a+b=8(②)을 확인했으나 세부키는 보류한다.'],
  2067:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','g(y)=3x−1에서 x=(g(y)+1)/3, 역함수는 (1/3)g(x)+1/3(④)을 확인했으나 세부키는 보류한다.'],
  2068:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','A=[−3,5], Bᶜ=[a,b], A−B=[−3,2]와 합집합 전체 조건에서 a=−3,b=2, b−a=5(⑤)를 확인했으나 세부키는 보류한다.'],
  2069:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','p 진리집합 [a+1,a+2], q (0,4) 포함 조건에서 −1<a<2(①)을 확인했으나 세부키는 보류한다.'],
  2070:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','1→4→3→1 주기에서 지수 50≡2,100≡1 (mod3), 값 3+4=7(②)을 확인했으나 세부키는 보류한다.'],
  2071:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','f=g 방정식 (x−1)(x+2)²=0의 해집합 {−2,1}의 공집합 아닌 부분집합 3개를 확인했으나 세부키는 보류한다.'],
  2072:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','A∩B가 {2,5,6} 중 정확히 두 개가 되도록 k≤20 후보를 조사하고 A−B 원소합 홀수인 k=10,20,18의 합48을 확인했으나 세부키는 보류한다.'],
  2073:['DRAFT_TAXONOMY_HOLD','H15-SB-04-RATIONAL_FUNCTION','교점 x좌표 r,s가 x²−8x+k=0의 근, 넓이 4|r−s|=26에서 (r−s)²=169/4, k=87/16을 확인했으나 세부키는 보류한다.'],
  2074:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','A 원소는 ∅,0,1,2,{0,1}의 5개이고 ①~④는 참, n(A)=6인 ⑤만 거짓임을 확인했으나 세부키는 보류한다.'],
  2075:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','수직선 판정에서 ㄱ·ㄹ·ㅁ만 모든 실수 x에 단일 y가 대응하므로 ④를 확인했으나 세부키는 보류한다.'],
  2076:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','A∪B=B에서 A⊂B, 5가 B에 들어가도록 x=5 또는 −1을 대입해 x=−1만 성립, A합3(①)을 확인했으나 세부키는 보류한다.'],
  2077:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','적어도 하나 관람 50−8=42, 포함배제로 두 영화 모두 31+23−42=12, a−b=30(③)을 확인했으나 세부키는 보류한다.'],
  2078:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','f⁻¹(3)=1은 f(1)=3, 2+a=3에서 a=1(④)을 확인했으나 세부키는 보류한다.'],
  2079:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','U={1,…,6}, p={2,3,4}, ¬q={1,2}, 합집합 {1,2,3,4}의 원소합10(⑤)을 확인했으나 세부키는 보류한다.'],
  2080:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','(f∘g)⁻¹ 정리로 합성식을 f⁻¹∘g로 줄이고 g(e)=d,f(b)=d에서 값 b(②)를 확인했으나 세부키는 보류한다.']
};

export function adjudicateSequentialBatch00720612080V1(){
  const batch=JSON.parse(fs.readFileSync(batchPath,'utf8'));
  const candidates=JSON.parse(fs.readFileSync(candidatePath,'utf8'));
  const candidateBySequence=new Map(candidates.records.map(record=>[record.sequenceOrder,record]));
  const records=batch.records.filter(record=>record.sequenceOrder>=2061&&record.sequenceOrder<=2080).map(record=>{
    const decision=manualDecisions[record.sequenceOrder];
    if(!decision) throw new Error(`Missing manual decision for ${record.sequenceOrder}`);
    const candidate=candidateBySequence.get(record.sequenceOrder);
    const hold=decision[0]!=='DRAFT_TAXONOMY_HOLD';
    return {sequenceOrder:record.sequenceOrder,questionUid:record.questionUid,sourceArchiveFile:record.sourceArchiveFile,sourceOrdinal:record.sourceOrdinal,adjudicationStatus:decision[0],answerVerification:hold?decision[0]:'INDEPENDENT_RECHECK_CONFIRMED',candidateStatus:candidate?.candidateStatus??'MANUAL_CANDIDATE',candidateSubUnitKey:decision[1],independentRationale:decision[2]};
  });
  const counts={};
  for(const r of records) counts[r.adjudicationStatus]=(counts[r.adjudicationStatus]??0)+1;
  const stablePayload={schemaVersion:'archive-sequential-batch-007-2061-2080-adjudication-v1',batchDigest:batch.digest,candidateDigest:candidates.digest,productionWriteAllowed:false,totals:{records:records.length,answerRecheckConfirmed:records.filter(r=>r.answerVerification==='INDEPENDENT_RECHECK_CONFIRMED').length,wordingReviewRequired:records.filter(r=>r.answerVerification!=='INDEPENDENT_RECHECK_CONFIRMED').length,status:Object.fromEntries(Object.entries(counts).sort(([a],[b])=>a.localeCompare(b,'en')))},records};
  return {generatedAt:new Date().toISOString(),digest:sha256(JSON.stringify(stablePayload)),...stablePayload};
}

function main(){const report=adjudicateSequentialBatch00720612080V1();fs.mkdirSync(reviewDir,{recursive:true});fs.writeFileSync(outputPath,`${JSON.stringify(report,null,2)}\n`,'utf8');console.log(JSON.stringify({output:path.relative(archiveDir,outputPath).replaceAll('\\','/'),digest:report.digest,totals:report.totals},null,2));}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])) main();

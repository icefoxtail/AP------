import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const archiveDir=path.resolve(scriptDir,'../..');
const reviewDir=path.join(archiveDir,'_generated','intelligence','phase3','sequential-review');
const batchPath=path.join(reviewDir,'archive-sequential-subunit-review-batch-007-v1.json');
const candidatePath=path.join(reviewDir,'archive-sequential-subunit-candidate-classification-batch-007-v1.json');
const outputPath=path.join(reviewDir,'archive-sequential-batch-007-1881-1900-adjudication-v1.json');
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions={
  1881:['DRAFT_TAXONOMY_HOLD','H15-SA-12-REFLECTION','원점 대칭은 두 좌표의 부호를 바꾸므로 (−3,−1)→(3,1), ⑤를 확인했으나 세부키는 보류한다.'],
  1882:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','수학을 잘한다는 기준은 객관적으로 명확하지 않아 집합이 아닌 ④를 확인했으나 세부키는 보류한다.'],
  1883:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','A={2,3,5,7}, A∪B={1,…,9}, A∩B={2,3}에서 B={1,2,3,4,6,8,9}, 합33(③)을 확인했으나 세부키는 보류한다.'],
  1884:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','조건의 부정은 3<x≤5이고 자연수 4,5의 합은 9(②)임을 확인했으나 세부키는 보류한다.'],
  1885:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','x+1/(4x)≥1, 등호 x=1/2에서 최솟값 b=4이므로 ab=2(②)를 확인했으나 세부키는 보류한다.'],
  1886:['DRAFT_TAXONOMY_HOLD','H15-SA-11-TANGENT','중심 (√3,b)의 y축 거리로 x=√3, 직선까지 거리 조건 |3−b|/2=√3을 적용하고 제1사분면에서 b=3+2√3, ④를 확인했으나 세부키는 보류한다.'],
  1887:['DRAFT_TAXONOMY_HOLD','H15-SA-12-TRANSLATION','x축 방향 2만큼 이동한 식은 k(x−2)+3x−2y+2=0이고 k와 무관하려면 x=2,y=4, ②를 확인했으나 세부키는 보류한다.'],
  1888:['DRAFT_TAXONOMY_HOLD','H15-SA-12-COMPOSITE_TRANSFORMATION','꼭짓점 대응에서 (x,y)→(x+5,−y−1)인 평행·대칭 합성이므로 ④를 확인했으나 세부키는 보류한다.'],
  1889:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','B=[−9,2], A의 교집합이 [−9,−5)이고 합집합이 실수 전체가 되도록 경계 −5,2에서 a=3,b=−10, a−b=13(③)을 확인했으나 세부키는 보류한다.'],
  1890:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','A−B=A는 A∩B=∅이고 합집합 4원소 중 두 집합 모두 공집합이 아니므로 빠질 원소 5가지와 배치 2⁴−2=14를 곱해 70(①)을 확인했으나 세부키는 보류한다.'],
  1891:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','p의 진리집합 [2,8], q의 진리집합 (a,b)가 (a,b)⊂[2,8]이어야 하므로 a의 최솟값 2,b의 최댓값 8, 합10(①)을 확인했으나 세부키는 보류한다.'],
  1892:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','필요조건은 q⇒p 방향으로 확인하고 충분조건은 아님을 반례로 점검하면 ⑤만 해당함을 확인했으나 세부키는 보류한다.'],
  1893:['DRAFT_TAXONOMY_HOLD','H15-SA-11-INTERSECTION','AB=4√2a, 넓이 조건에서 |y|=2/a, 교점 수가 3이 되려면 a=1이며 세 점의 삼각형 넓이는 8√2(③)을 확인했으나 세부키는 보류한다.'],
  1894:['DRAFT_TAXONOMY_HOLD','H15-SA-10-DISTANCE_ANGLE','두 직선까지 원점 거리 제곱 64/5와 16/5 중 최솟값 16/5에서 a−b=11, ⑤를 확인했으나 세부키는 보류한다.'],
  1895:['DRAFT_TAXONOMY_HOLD','H15-SA-12-REFLECTION','세 변에서의 수선 발 D,E,F가 둘레 최솟값을 주고 DE=4√5/5, EF=√5, FD=3√5/5이므로 a−b=7(④)을 확인했으나 세부키는 보류한다.'],
  1896:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','세 합집합 식에서 n(C)=37, 세 과목 모두 없음으로 C만=37−12−15=10(①)을 확인했으나 세부키는 보류한다.'],
  1897:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','두 범인 조건을 다섯 보기와 대조하면 A,D만 B→D, ¬B→¬C, ¬A→¬D를 모두 만족해 ②를 확인했으나 세부키는 보류한다.'],
  1898:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','(a+b)/2와 √ab의 제곱 차가 (a−b)²/4이고, 5a+8b=40에서 큰 넓이 최댓값 40 및 가로 5/2·세로4를 재확인했으나 세부키는 보류한다.'],
  1899:['DRAFT_TAXONOMY_HOLD','H15-SA-12-REFLECTION','원 중심 (4,3), 반지름3을 각각 y=x,y=−x 대칭한 두 원의 중심이 (3,4),(−3,−4), 중심거리10이므로 최대거리16을 확인했으나 세부키는 보류한다.'],
  1900:['DRAFT_TAXONOMY_HOLD','H15-SA-12-TRANSLATION','원 중심 (1,−2), 반지름2를 원점으로 옮기려 a=−1,b=2,c=4를 얻어 합5(⑤)를 확인했으나 세부키는 보류한다.']
};

export function adjudicateSequentialBatch00718811900V1(){
  const batch=JSON.parse(fs.readFileSync(batchPath,'utf8'));
  const candidates=JSON.parse(fs.readFileSync(candidatePath,'utf8'));
  const candidateBySequence=new Map(candidates.records.map(record=>[record.sequenceOrder,record]));
  const records=batch.records.filter(record=>record.sequenceOrder>=1881&&record.sequenceOrder<=1900).map(record=>{
    const decision=manualDecisions[record.sequenceOrder];
    if(!decision) throw new Error(`Missing manual decision for ${record.sequenceOrder}`);
    const candidate=candidateBySequence.get(record.sequenceOrder);
    const hold=decision[0]!=='DRAFT_TAXONOMY_HOLD';
    return {sequenceOrder:record.sequenceOrder,questionUid:record.questionUid,sourceArchiveFile:record.sourceArchiveFile,sourceOrdinal:record.sourceOrdinal,adjudicationStatus:decision[0],answerVerification:hold?decision[0]:'INDEPENDENT_RECHECK_CONFIRMED',candidateStatus:candidate?.candidateStatus??'MANUAL_CANDIDATE',candidateSubUnitKey:decision[1],independentRationale:decision[2]};
  });
  const counts={};
  for(const r of records) counts[r.adjudicationStatus]=(counts[r.adjudicationStatus]??0)+1;
  const stablePayload={schemaVersion:'archive-sequential-batch-007-1881-1900-adjudication-v1',batchDigest:batch.digest,candidateDigest:candidates.digest,productionWriteAllowed:false,totals:{records:records.length,answerRecheckConfirmed:records.filter(r=>r.answerVerification==='INDEPENDENT_RECHECK_CONFIRMED').length,wordingReviewRequired:records.filter(r=>r.answerVerification!=='INDEPENDENT_RECHECK_CONFIRMED').length,status:Object.fromEntries(Object.entries(counts).sort(([a],[b])=>a.localeCompare(b,'en')))},records};
  return {generatedAt:new Date().toISOString(),digest:sha256(JSON.stringify(stablePayload)),...stablePayload};
}

function main(){const report=adjudicateSequentialBatch00718811900V1();fs.mkdirSync(reviewDir,{recursive:true});fs.writeFileSync(outputPath,`${JSON.stringify(report,null,2)}\n`,'utf8');console.log(JSON.stringify({output:path.relative(archiveDir,outputPath).replaceAll('\\','/'),digest:report.digest,totals:report.totals},null,2));}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])) main();

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const archiveDir=path.resolve(scriptDir,'../..');
const reviewDir=path.join(archiveDir,'_generated','intelligence','phase3','sequential-review');
const batchPath=path.join(reviewDir,'archive-sequential-subunit-review-batch-007-v1.json');
const candidatePath=path.join(reviewDir,'archive-sequential-subunit-candidate-classification-batch-007-v1.json');
const outputPath=path.join(reviewDir,'archive-sequential-batch-007-1981-2000-adjudication-v1.json');
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions={
  1981:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','대칭차가 X이고 원소 수가 같은 두 집합은 서로소 3원소 분할, 최대원소 조건으로 5∈A,6∈B, 합21에서 S(A)>10.5이고 실제 11 달성을 확인했으나 세부키는 보류한다.'],
  1982:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','t=f(x)로 두어 t+f(t)=4의 가능한 t를 구하고 각 원상 합을 합산해 19(⑤)를 확인했으나 세부키는 보류한다.'],
  1983:['DRAFT_TAXONOMY_HOLD','H15-SA-12-COMPOSITE_TRANSFORMATION','이동 직선 y=ax−5a+3을 y=x 대칭해 y=x/a+5−3/a, y축 교점 일치에서 a=1을 확인했으나 세부키는 보류한다.'],
  1984:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','신청 합집합 140명, a=b+40 및 교집합 비음 조건에서 b≥50, A만=140−b의 최댓값 90명을 확인했으나 세부키는 보류한다.'],
  1985:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','이미 f값 1,4를 사용했으므로 3+a,4+a는 2,3이어야 해 a=−1이고 역함수 존재를 확인했으나 세부키는 보류한다.'],
  1986:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','삼차식이 (x−1)(x²+(6−a)x+9)이고 x=1에서 b=1, 판별식 a(a−12) 조건으로 0<a≤12를 확인했으나 세부키는 보류한다.'],
  1987:['DRAFT_TAXONOMY_HOLD','H15-SA-09-COORDINATE_METRIC','AC²,BC²를 같게 두어 (a−1)²+4=(a−3)²+16, a=5(⑤)를 확인했으나 세부키는 보류한다.'],
  1988:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','각 보기의 반례를 점검해 x²+y²=0⇒x=y=0인 ②만 참임을 확인했으나 세부키는 보류한다.'],
  1989:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','f(a)=g(a)에서 a(a−2)(a+1)=0, n(X)=3 조건으로 −1,0 제외해 a=2(③)를 확인했으나 세부키는 보류한다.'],
  1990:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','f(1)=−1과 f⁻¹(5)=3⇒f(3)=5, 연립으로 f(x)=3x−4, f(2)=2(④)를 확인했으나 세부키는 보류한다.'],
  1991:['DRAFT_TAXONOMY_HOLD','H15-SA-09-COORDINATE_METRIC','외분점 ((2k+5)/(k−5),(4k−5)/(k−5))을 직선에 대입해 10k−20=0, 양수 k=2(①)를 확인했으나 세부키는 보류한다.'],
  1992:['ANSWER_SOURCE_DEFECT_HOLD','H15-SA-09-COORDINATE_METRIC','대각선 중점 조건으로 b=a+4, 변 길이 조건에서 a=1 또는5가 모두 가능해 a+b=6 또는14이다. 원문 보기에는 14만 있어 단일 정답이 되지 않으므로 조건/보기 누락 결함으로 보류한다.'],
  1993:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','ㄱ,ㄷ,ㄹ만 참이고 공집합에는 원소가 없으므로 옳은 것은 ④를 확인했으나 세부키는 보류한다.'],
  1994:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','2a,5b의 합100에 AM-GM을 적용해 ab≤250, 등호 a=25,b=10, M+m+n=285(③)를 확인했으나 세부키는 보류한다.'],
  1995:['DRAFT_TAXONOMY_HOLD','H15-SA-12-COMPOSITE_TRANSFORMATION','A→B는 y=x 대칭, B→C는 원점 대칭이고 BC를 밑변으로 넓이 8(a+2)=48에서 a=4(①)를 확인했으나 세부키는 보류한다.'],
  1996:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','A⊂X로 1,3 포함, (B−A)∩X={4,8}로 4,8 포함·6 제외, 나머지 5개 자유여서 2⁵=32(②)를 확인했으나 세부키는 보류한다.'],
  1997:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','P⊂Qᶜ, Qᶜ⊂R, Q⊂Rᶜ에서 P∩Q=∅와 R=Qᶜ, Q∪R=U이므로 ㄱ·ㄷ, ③을 확인했으나 세부키는 보류한다.'],
  1998:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','g(f(2))=g(2)=3이고 g 전단사라 f(2)=2, g(f(4))=4와 g(1)=1로 f(4)=3,g(3)=4, 합6(④)을 확인했으나 세부키는 보류한다.'],
  1999:['DRAFT_TAXONOMY_HOLD','H15-SA-10-DISTANCE_ANGLE','모든 직선이 P(−3,1)를 지나므로 점 A와 P 거리 2√10이 최대, AP 기울기1/3에 수직인 m=−3, 곱−6√10(①)을 확인했으나 세부키는 보류한다.'],
  2000:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','C=ℝ, A=(−∞,2)∪(4,∞), 조건으로 B=[−1,4]=(x+1)(x−4)≤0, a=−3,b=−4, ab=12(③)를 확인했으나 세부키는 보류한다.']
};

export function adjudicateSequentialBatch00719812000V1(){
  const batch=JSON.parse(fs.readFileSync(batchPath,'utf8'));
  const candidates=JSON.parse(fs.readFileSync(candidatePath,'utf8'));
  const candidateBySequence=new Map(candidates.records.map(record=>[record.sequenceOrder,record]));
  const records=batch.records.filter(record=>record.sequenceOrder>=1981&&record.sequenceOrder<=2000).map(record=>{
    const decision=manualDecisions[record.sequenceOrder];
    if(!decision) throw new Error(`Missing manual decision for ${record.sequenceOrder}`);
    const candidate=candidateBySequence.get(record.sequenceOrder);
    const hold=decision[0]!=='DRAFT_TAXONOMY_HOLD';
    return {sequenceOrder:record.sequenceOrder,questionUid:record.questionUid,sourceArchiveFile:record.sourceArchiveFile,sourceOrdinal:record.sourceOrdinal,adjudicationStatus:decision[0],answerVerification:hold?decision[0]:'INDEPENDENT_RECHECK_CONFIRMED',candidateStatus:candidate?.candidateStatus??'MANUAL_CANDIDATE',candidateSubUnitKey:decision[1],independentRationale:decision[2]};
  });
  const counts={};
  for(const r of records) counts[r.adjudicationStatus]=(counts[r.adjudicationStatus]??0)+1;
  const stablePayload={schemaVersion:'archive-sequential-batch-007-1981-2000-adjudication-v1',batchDigest:batch.digest,candidateDigest:candidates.digest,productionWriteAllowed:false,totals:{records:records.length,answerRecheckConfirmed:records.filter(r=>r.answerVerification==='INDEPENDENT_RECHECK_CONFIRMED').length,wordingReviewRequired:records.filter(r=>r.answerVerification!=='INDEPENDENT_RECHECK_CONFIRMED').length,status:Object.fromEntries(Object.entries(counts).sort(([a],[b])=>a.localeCompare(b,'en')))},records};
  return {generatedAt:new Date().toISOString(),digest:sha256(JSON.stringify(stablePayload)),...stablePayload};
}

function main(){const report=adjudicateSequentialBatch00719812000V1();fs.mkdirSync(reviewDir,{recursive:true});fs.writeFileSync(outputPath,`${JSON.stringify(report,null,2)}\n`,'utf8');console.log(JSON.stringify({output:path.relative(archiveDir,outputPath).replaceAll('\\','/'),digest:report.digest,totals:report.totals},null,2));}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])) main();

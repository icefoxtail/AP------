import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const archiveDir=path.resolve(scriptDir,'../..');
const reviewDir=path.join(archiveDir,'_generated','intelligence','phase3','sequential-review');
const batchPath=path.join(reviewDir,'archive-sequential-subunit-review-batch-007-v1.json');
const candidatePath=path.join(reviewDir,'archive-sequential-subunit-candidate-classification-batch-007-v1.json');
const outputPath=path.join(reviewDir,'archive-sequential-batch-007-2021-2040-adjudication-v1.json');
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions={
  2021:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','t=|x−3|로 두면 t²−6t=t에서 t=0,7, 원상 x=3,10,−4의 합9(②)을 확인했으나 세부키는 보류한다.'],
  2022:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','432=2⁴·3³이고 곱셈 가법성으로 f(432)=4·6+3·9=51(③)을 확인했으나 세부키는 보류한다.'],
  2023:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','두 번째 조건의 여집합에서 A−B={3,4,6}, 첫 조건의 여집합에서 B−A={1,5,8}, 대칭차 합 27(②)을 확인했으나 세부키는 보류한다.'],
  2024:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','제곱항 합 (가)=8, AM-GM 두 항의 상수 (나)=4, 세 부등식 합 (다)=16, p+q+r=28(④)을 확인했으나 세부키는 보류한다.'],
  2025:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','3a+b≥2√(3ab), t=√(3ab)로 t≤3, ab≤3이며 a=1,b=3에서 달성해 ①을 확인했으나 세부키는 보류한다.'],
  2026:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','(가),(나)에서 Y=Xᶜ, S(X)>64.5 및 n(X) 홀수 조건을 나누면 64∈X에서 나머지 짝수 선택 32 중 공집합 제외 31개임을 확인했으나 세부키는 보류한다.'],
  2027:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','일대일대응을 위해 이차함수 축이 x=1, 꼭짓값 v=3이어야 하고 f(0)=f(2)=1, g(1)=3,g(2)=5, 합8(②)을 확인했으나 세부키는 보류한다.'],
  2028:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','A_m⊊A_48에서 최대 진약수 m=24, A_48⊊A_n에서 최소 배수 n=96, 합120을 확인했으나 세부키는 보류한다.'],
  2029:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','색칠넓이=(√3/2)xy, x+y=BC에서 xy≤(x+y)²/4, 최댓값 √3로 BC=2√2, 둘레6√2를 확인했으나 세부키는 보류한다.'],
  2030:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','역함수 대칭으로 A=(t,f(t)),B=(f(t),t), AB=√2(f(t)−t), t=1/2에서 최소, 넓이15/8을 확인했으나 세부키는 보류한다.'],
  2031:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','A 교점 x=−1,3; B 교점 x=a,2a; C 교점 x=3,3(b−1)/(b+1)이고 합집합 3개 조건에서 a=3/2,b=3, 합9/2를 확인했으나 세부키는 보류한다.'],
  2032:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','A의 원소와 부분집합/원소 기호를 구별하면 ⑤의 {∅,1,2}는 원소가 아니라 부분집합이라 옳지 않음을 확인했으나 세부키는 보류한다.'],
  2033:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','x=0에서 b=0, x=1에서 a=1을 얻고 x=−1도 일치하여 a²−b²=1(①)을 확인했으나 세부키는 보류한다.'],
  2034:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','식=4+4a/b+b/a≥8, b=2a에서 등호를 확인해 최솟값 8(③)을 재확인했으나 세부키는 보류한다.'],
  2035:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','①,②,④,⑤에 반례를 대입하고 모든 실수 제곱 비음인 ③만 참임을 확인했으나 세부키는 보류한다.'],
  2036:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','(f∘g)(2)=f(−4)=−2, (g∘f)(−2)=g(0)=2, 합0(⑤)을 확인했으나 세부키는 보류한다.'],
  2037:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','X∪A=X에서 A⊂X, X−B에 A가 남아 B와 교집합이 없고 8,10만 자유여서 4개(①)를 확인했으나 세부키는 보류한다.'],
  2038:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','p⇒q, r⇒¬q에서 q⇒¬r 및 p⇒¬r의 대우 r⇒¬p를 얻어 ㄴ·ㄷ, ④를 확인했으나 세부키는 보류한다.'],
  2039:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','x≥0 조각 치역 [−2,∞), x<0 조각이 (−∞,b) 전체를 이루려 b=−2,a>−3, 따라서 a−b>−1(④)을 확인했으나 세부키는 보류한다.'],
  2040:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','그래프의 주기 1→2→3→1에서 지수 104,203은 나머지2로 값3, 301은 나머지1로 값2, 합8(⑤)을 확인했으나 세부키는 보류한다.']
};

export function adjudicateSequentialBatch00720212040V1(){
  const batch=JSON.parse(fs.readFileSync(batchPath,'utf8'));
  const candidates=JSON.parse(fs.readFileSync(candidatePath,'utf8'));
  const candidateBySequence=new Map(candidates.records.map(record=>[record.sequenceOrder,record]));
  const records=batch.records.filter(record=>record.sequenceOrder>=2021&&record.sequenceOrder<=2040).map(record=>{
    const decision=manualDecisions[record.sequenceOrder];
    if(!decision) throw new Error(`Missing manual decision for ${record.sequenceOrder}`);
    const candidate=candidateBySequence.get(record.sequenceOrder);
    const hold=decision[0]!=='DRAFT_TAXONOMY_HOLD';
    return {sequenceOrder:record.sequenceOrder,questionUid:record.questionUid,sourceArchiveFile:record.sourceArchiveFile,sourceOrdinal:record.sourceOrdinal,adjudicationStatus:decision[0],answerVerification:hold?decision[0]:'INDEPENDENT_RECHECK_CONFIRMED',candidateStatus:candidate?.candidateStatus??'MANUAL_CANDIDATE',candidateSubUnitKey:decision[1],independentRationale:decision[2]};
  });
  const counts={};
  for(const r of records) counts[r.adjudicationStatus]=(counts[r.adjudicationStatus]??0)+1;
  const stablePayload={schemaVersion:'archive-sequential-batch-007-2021-2040-adjudication-v1',batchDigest:batch.digest,candidateDigest:candidates.digest,productionWriteAllowed:false,totals:{records:records.length,answerRecheckConfirmed:records.filter(r=>r.answerVerification==='INDEPENDENT_RECHECK_CONFIRMED').length,wordingReviewRequired:records.filter(r=>r.answerVerification!=='INDEPENDENT_RECHECK_CONFIRMED').length,status:Object.fromEntries(Object.entries(counts).sort(([a],[b])=>a.localeCompare(b,'en')))},records};
  return {generatedAt:new Date().toISOString(),digest:sha256(JSON.stringify(stablePayload)),...stablePayload};
}

function main(){const report=adjudicateSequentialBatch00720212040V1();fs.mkdirSync(reviewDir,{recursive:true});fs.writeFileSync(outputPath,`${JSON.stringify(report,null,2)}\n`,'utf8');console.log(JSON.stringify({output:path.relative(archiveDir,outputPath).replaceAll('\\','/'),digest:report.digest,totals:report.totals},null,2));}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])) main();

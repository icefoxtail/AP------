import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const scriptDir = path.dirname(fileURLToPath(import.meta.url)); const archiveDir = path.resolve(scriptDir, '../..'); const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'sequential-review'); const batchPath = path.join(reviewDir, 'archive-sequential-subunit-review-batch-004-v1.json'); const candidatePath = path.join(reviewDir, 'archive-sequential-subunit-candidate-classification-batch-004-v1.json'); const outputPath = path.join(reviewDir, 'archive-sequential-batch-004-921-940-adjudication-v1.json'); const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const manualDecisions = {
  921:['DRAFT_TAXONOMY_HOLD','H15-SA-01-POLYNOMIAL_OPERATION','(2A+B)−(A−B)=A+2B로 목표식 4x²−6xy−6y², 계수합 −8(①)을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  922:['DRAFT_TAXONOMY_HOLD','H15-SA-01-ALGEBRAIC_IDENTITY','x³+y³=(x+y)³−3xy(x+y)=64−24=40(③)을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  923:['DRAFT_TAXONOMY_HOLD','H15-SA-04-COMPLEX_OPERATION','(1−3i)(2−i)=−1−7i의 실수부 −1(②)을 확인했으나 H15-SA-04 세부키는 보류한다.'],
  924:['DRAFT_TAXONOMY_HOLD','H15-SA-02-POLYNOMIAL_IDENTITY','x=0,1,−1 대입으로 a=−4,2b=3,2c=9을 얻어 −a+2b+2c=16(⑤)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  925:['DRAFT_TAXONOMY_HOLD','H15-SA-03-POLYNOMIAL_FACTOR','(x−2y−3)(x+y+2)로 인수분해해 a=−2,b=1,c=2, −2a+3b+c=9(④)을 확인했으나 H15-SA-03 세부키는 보류한다.'],
  926:['DRAFT_TAXONOMY_HOLD','H15-SA-13-QUADRATIC_TANGENCY','접선 기울기 판별식 m²−8m+4=0의 두 근 합 8(②)을 확인했으나 H15-SA-13 세부키는 보류한다.'],
  927:['DRAFT_TAXONOMY_HOLD','H15-SA-07-SYSTEM_EQUATION','(2x+y)(x−y)=0을 나누어 조사해 x+2y 최댓값 3√10(④)을 확인했으나 H15-SA-07 세부키는 보류한다.'],
  928:['DRAFT_TAXONOMY_HOLD','H15-SA-02-REMAINDER_THEOREM','f(3)=11,f(−2)=−4를 R=3x+2로 복원해 R(1)=5(④)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  929:['DRAFT_TAXONOMY_HOLD','H15-SA-05-QUADRATIC_FUNCTION','f(x)−1이 α,β를 근으로 하는 x²−2x+5이므로 f=x²−2x+6, f(2)=6(⑤)을 확인했으나 H15-SA-05 세부키는 보류한다.'],
  930:['DRAFT_TAXONOMY_HOLD','H15-SA-02-POLYNOMIAL_REMAINDER','f=(x+2)(x−k), f(4)=−18에서 k=7, f(2)=−20(②)을 확인했으나 H15-SA-02 세부키는 보류한다.'],
  931:['EVIDENCE_MISSING_HOLD','H15-SA-13-QUADRATIC_GRAPH','문항의 “그림”이 패킷에 없고 해설은 절편을 임의로 사용한다. 그래프 근거 없이 α−β=5를 독립 확정할 수 없다.'],
  932:['DRAFT_TAXONOMY_HOLD','H15-SA-01-POLYNOMIAL_COMPOSITION','x−2 기준 연쇄 조립제법으로 a=1,b=2,c=−1,d=−7, ab+cd=9(④)을 확인했으나 H15-SA-01 세부키는 보류한다.'],
  933:['DRAFT_TAXONOMY_HOLD','H15-SA-04-COMPLEX_CONJUGATE','켤레 조건으로 z₁+z₂=−2+5i,z₁z₂=−5+6i를 복원해 a−b=7(③)을 확인했으나 H15-SA-04 세부키는 보류한다.'],
  934:['DRAFT_TAXONOMY_HOLD','H15-SA-04-COMPLEX_POWER','ω³=1, ω²+ω+1=0을 사용해 ㄱ·ㄴ·ㄷ 모두 참이고 6의 배수 10개(⑤)를 확인했으나 H15-SA-04 세부키는 보류한다.'],
  935:['DRAFT_TAXONOMY_HOLD','H15-SA-01-POLYNOMIAL_DIVISION','세로셈으로 (가)=2,(나)=2x,(다)=8x+7을 확인해 합 10x+9를 확인했으나 H15-SA-01 세부키는 보류한다.'],
  936:['DRAFT_TAXONOMY_HOLD','H15-SA-08-SYSTEM_INEQUALITY','1<x≤(−2a−1)/3에 정수 2,3만 들어가도록 −6.5<a≤−5, 합 −11을 확인했으나 H15-SA-08 세부키는 보류한다.'],
  937:['DRAFT_TAXONOMY_HOLD','H15-SA-05-QUADRATIC_DISCRIMINANT','D/4=−2k−2≥0에서 k≤−1을 확인했으나 H15-SA-05 세부키는 보류한다.'],
  938:['DRAFT_TAXONOMY_HOLD','H15-SA-07-CUBIC_ROOTS','켤레근 1±i와 x항 계수로 c=1,a=−3,b=−2를 얻어 합 −3−i를 확인했으나 H15-SA-07 세부키는 보류한다.'],
  939:['ANSWER_SOURCE_DEFECT_HOLD','H15-SA-04-COMPLEX_RADICAL','α,β가 음수라 실수 제곱근이 아니며 복소 제곱근의 가지·학교답안(0)과 해설(−20)이 불일치한다. 저장 정답을 확정하지 않고 출처 결함 보류한다.'],
  940:['EVIDENCE_MISSING_HOLD','H15-SA-13-QUADRATIC_GEOMETRY','문항의 도형이 누락되어 RQ와 직사각형의 닮음 배치를 독립 확인할 수 없다. 해설의 RQ=5, 넓이 15는 근거 부족 보류한다.']
};
export function adjudicateSequentialBatch004921940V1(){const batch=JSON.parse(fs.readFileSync(batchPath,'utf8'));const candidates=JSON.parse(fs.readFileSync(candidatePath,'utf8'));const candidateBySequence=new Map(candidates.records.map(record=>[record.sequenceOrder,record]));const records=batch.records.filter(record=>record.sequenceOrder>=921&&record.sequenceOrder<=940).map(record=>{const decision=manualDecisions[record.sequenceOrder];if(!decision)throw new Error(`Missing manual decision for ${record.sequenceOrder}`);const candidate=candidateBySequence.get(record.sequenceOrder);const hold=decision[0]!=='DRAFT_TAXONOMY_HOLD';return{sequenceOrder:record.sequenceOrder,questionUid:record.questionUid,sourceArchiveFile:record.sourceArchiveFile,sourceOrdinal:record.sourceOrdinal,adjudicationStatus:decision[0],answerVerification:hold?decision[0]:'INDEPENDENT_RECHECK_CONFIRMED',candidateStatus:candidate?.candidateStatus??'MANUAL_CANDIDATE',candidateSubUnitKey:decision[1],independentRationale:decision[2]};});const counts={};for(const record of records)counts[record.adjudicationStatus]=(counts[record.adjudicationStatus]??0)+1;const stablePayload={schemaVersion:'archive-sequential-batch-004-921-940-adjudication-v1',batchDigest:batch.digest,candidateDigest:candidates.digest,productionWriteAllowed:false,totals:{records:records.length,answerRecheckConfirmed:records.filter(record=>record.answerVerification==='INDEPENDENT_RECHECK_CONFIRMED').length,wordingReviewRequired:records.filter(record=>record.answerVerification!=='INDEPENDENT_RECHECK_CONFIRMED').length,status:Object.fromEntries(Object.entries(counts).sort(([a],[b])=>a.localeCompare(b,'en')))},records};return{generatedAt:new Date().toISOString(),digest:sha256(JSON.stringify(stablePayload)),...stablePayload};}
function main(){const report=adjudicateSequentialBatch004921940V1();fs.mkdirSync(reviewDir,{recursive:true});fs.writeFileSync(outputPath,`${JSON.stringify(report,null,2)}\n`,'utf8');console.log(JSON.stringify({output:path.relative(archiveDir,outputPath).replaceAll('\\','/'),digest:report.digest,totals:report.totals},null,2));}if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1]))main();

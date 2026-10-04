import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const archiveDir=path.resolve(scriptDir,'../..');
const reviewDir=path.join(archiveDir,'_generated','intelligence','phase3','sequential-review');
const batchPath=path.join(reviewDir,'archive-sequential-subunit-review-batch-007-v1.json');
const candidatePath=path.join(reviewDir,'archive-sequential-subunit-candidate-classification-batch-007-v1.json');
const outputPath=path.join(reviewDir,'archive-sequential-batch-007-1961-1980-adjudication-v1.json');
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions={
  1961:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','증가함수와 역함수 교점은 y=x 위에 있고 x²−4x=x에서 정의역 조건을 적용하면 (5,5), a+b=10을 확인했으나 세부키는 보류한다.'],
  1962:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','① 차집합 정의, ② 드모르간, ③ 분배, ④ 여집합 성질, ⑤ 결합, ⑥ 교환 법칙을 식의 앞뒤로 대조했으나 세부키는 보류한다.'],
  1963:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','대우 n=3k+1 또는 3k+2에서 n²≡1 (mod 3)을 보여 원명제가 참임을 확인했으나 세부키는 보류한다.'],
  1964:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','그래프 식 f=2−x와 g의 구간을 합성해 [0,1]에서 1, [1,2]에서 2−x, 넓이 1+1/2=3/2를 확인했으나 세부키는 보류한다.'],
  1965:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','대응도에서 2의 화살표가 1로 향하므로 f(2)=1(①)을 확인했으나 세부키는 보류한다.'],
  1966:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','1,3을 제외한 {2,4,5}의 임의 부분집합 수 2³=8(③)을 확인했으나 세부키는 보류한다.'],
  1967:['DRAFT_TAXONOMY_HOLD','H15-SA-12-TRANSLATION','x축 이동 후 y=2(x−a)+1, (4,1) 대입에서 a=4(④)를 확인했으나 세부키는 보류한다.'],
  1968:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','대우 x=a이면 x²−2x−5=0이어야 하므로 가능한 a는 두 근, 합2(②)를 확인했으나 세부키는 보류한다.'],
  1969:['DRAFT_TAXONOMY_HOLD','H15-SA-12-REFLECTION','중심 (−6,k)를 y=x 대칭해 (k,−6), 직선 2x+y=4에 대입하면 k=5(⑤)를 확인했으나 세부키는 보류한다.'],
  1970:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','a=2에서 A={1,2,3},B={0,1,2}의 대칭차가 {0,3}; 다른 보기와 대조해 ②를 확인했으나 세부키는 보류한다.'],
  1971:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','g∘f=x−3, 역함수 x+3, g⁻¹=2x+2이므로 p(1)=−2,q(1)=4,r(0)=2, 합4(④)를 확인했으나 세부키는 보류한다.'],
  1972:['DRAFT_TAXONOMY_HOLD','H15-SA-12-COMPOSITE_TRANSFORMATION','ㄱ은 x축 대칭, ㄴ은 x축 대칭 후 우측5·하방1 이동, ㄷ은 역관계로 모두 참이어서 ⑤를 확인했으나 세부키는 보류한다.'],
  1973:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','[-1,0]에서 전단사 치역 일치의 두 끝점 조건을 비교해 a=−1,b=−1, a+b=−2(①)를 확인했으나 세부키는 보류한다.'],
  1974:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','2~11의 약수 개수를 직접 합해 2+2+3+2+4+2+4+3+4+2=28(③)을 확인했으나 세부키는 보류한다.'],
  1975:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','①의 A−(B−C) 전개가 (A−B)∪(A∩C)라서 우변과 일반적으로 다르고 나머지는 성립하여 ①을 확인했으나 세부키는 보류한다.'],
  1976:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','¬p→q에서 Pᶜ⊂Q로 a≥3, ¬r→¬p에서 (−∞,b)⊂Pᶜ로 b≤−2, 곱 −6(②)을 확인했으나 세부키는 보류한다.'],
  1977:['DRAFT_TAXONOMY_HOLD','H15-SA-10-LINE_EQUATION','직선 y−3=m(x+2)의 절편으로 S₁=9/(2m),S₂=2m, AM-GM 최솟값6(③)을 확인했으나 세부키는 보류한다.'],
  1978:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','p,q가 동시에 거짓인 두 열린구간의 중심거리 k/2<2 조건으로 자연수 k=1,2,3, 총3개(③)를 확인했으나 세부키는 보류한다.'],
  1979:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','(f⁻¹(2),g(2))=(3,4) 또는 (4,3)을 나누어 두 번째 조건과 전단사 대응을 적용하면 최솟값3(②)을 확인했으나 세부키는 보류한다.'],
  1980:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','X∪A=X−B에서 A⊂X,B∩X=∅, Bᶜ−Aᶜ=A이고 n(A)=1, 순서쌍 5·2^{n(U)−5}=80에서 n(U)=9(④)를 확인했으나 세부키는 보류한다.']
};

export function adjudicateSequentialBatch00719611980V1(){
  const batch=JSON.parse(fs.readFileSync(batchPath,'utf8'));
  const candidates=JSON.parse(fs.readFileSync(candidatePath,'utf8'));
  const candidateBySequence=new Map(candidates.records.map(record=>[record.sequenceOrder,record]));
  const records=batch.records.filter(record=>record.sequenceOrder>=1961&&record.sequenceOrder<=1980).map(record=>{
    const decision=manualDecisions[record.sequenceOrder];
    if(!decision) throw new Error(`Missing manual decision for ${record.sequenceOrder}`);
    const candidate=candidateBySequence.get(record.sequenceOrder);
    const hold=decision[0]!=='DRAFT_TAXONOMY_HOLD';
    return {sequenceOrder:record.sequenceOrder,questionUid:record.questionUid,sourceArchiveFile:record.sourceArchiveFile,sourceOrdinal:record.sourceOrdinal,adjudicationStatus:decision[0],answerVerification:hold?decision[0]:'INDEPENDENT_RECHECK_CONFIRMED',candidateStatus:candidate?.candidateStatus??'MANUAL_CANDIDATE',candidateSubUnitKey:decision[1],independentRationale:decision[2]};
  });
  const counts={};
  for(const r of records) counts[r.adjudicationStatus]=(counts[r.adjudicationStatus]??0)+1;
  const stablePayload={schemaVersion:'archive-sequential-batch-007-1961-1980-adjudication-v1',batchDigest:batch.digest,candidateDigest:candidates.digest,productionWriteAllowed:false,totals:{records:records.length,answerRecheckConfirmed:records.filter(r=>r.answerVerification==='INDEPENDENT_RECHECK_CONFIRMED').length,wordingReviewRequired:records.filter(r=>r.answerVerification!=='INDEPENDENT_RECHECK_CONFIRMED').length,status:Object.fromEntries(Object.entries(counts).sort(([a],[b])=>a.localeCompare(b,'en')))},records};
  return {generatedAt:new Date().toISOString(),digest:sha256(JSON.stringify(stablePayload)),...stablePayload};
}

function main(){const report=adjudicateSequentialBatch00719611980V1();fs.mkdirSync(reviewDir,{recursive:true});fs.writeFileSync(outputPath,`${JSON.stringify(report,null,2)}\n`,'utf8');console.log(JSON.stringify({output:path.relative(archiveDir,outputPath).replaceAll('\\','/'),digest:report.digest,totals:report.totals},null,2));}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])) main();

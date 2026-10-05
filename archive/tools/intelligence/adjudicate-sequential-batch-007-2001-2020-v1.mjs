import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const archiveDir=path.resolve(scriptDir,'../..');
const reviewDir=path.join(archiveDir,'_generated','intelligence','phase3','sequential-review');
const batchPath=path.join(reviewDir,'archive-sequential-subunit-review-batch-007-v1.json');
const candidatePath=path.join(reviewDir,'archive-sequential-subunit-candidate-classification-batch-007-v1.json');
const outputPath=path.join(reviewDir,'archive-sequential-batch-007-2001-2020-adjudication-v1.json');
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions={
  2001:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','조건 P⇒Q에서 P가 참인 짝수 2와 Q가 거짓인 모음 ㅓ의 뒷면을 확인해야 하므로 ㅓ,2(④)를 확인했으나 세부키는 보류한다.'],
  2002:['DRAFT_TAXONOMY_HOLD','H15-SA-11-TANGENT','t=y/(x+2)인 직선이 원에 접할 때 t²=1, 최대 t=1의 접점 (−1,1)에서 OP 기울기 −1(②)을 확인했으나 세부키는 보류한다.'],
  2003:['ANSWER_SOURCE_DEFECT_HOLD','H15-SB-03-INVERSE_FUNCTION','f(f(a))=a인 순열을 세면 f(a)=a인 4! =24개와 a와 한 원소의 전치 후 나머지 3!인 24개로 총48개이다. 저장 answer도 48을 적었지만 보기에는 48이 없어 선택지 결함으로 보류한다.'],
  2004:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','q⇒¬p의 대우 p⇒¬q, 보기 ④의 ¬s⇒q 대우 ¬q⇒s를 연결해 p⇒¬q⇒s⇒¬r을 얻으므로 ④를 확인했으나 세부키는 보류한다.'],
  2005:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','t=f(x)로 두면 f(t)≤0의 범위 0≤t≤2, 그래프에서 0≤f(x)≤2의 정수해 −1,0,2,3,4 합8(④)을 확인했으나 세부키는 보류한다.'],
  2006:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','교점 O 이외 A의 x=2a+1/a, 꼭짓점 B의 x=a, 중점 C의 x=3a/2+1/(2a)≥√3을 AM-GM으로 확인해 ⑤를 확인했으나 세부키는 보류한다.'],
  2007:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','f(g(x))=a(2x+a)+b=2ax+a²+b와 4x+3의 계수를 비교해 a=2,b=−1, f⁻¹(3)=2를 확인했으나 세부키는 보류한다.'],
  2008:['DRAFT_TAXONOMY_HOLD','H15-SA-10-PARALLEL_PERPENDICULAR','방향계수 조건으로 평행/일치 후보 a=1,−3에서 α=1,β=−3, 법선 내적 조건 γ=−1/2, 곱3/2를 확인했으나 세부키는 보류한다.'],
  2009:['DRAFT_TAXONOMY_HOLD','H15-SA-12-REFLECTION','원점 대칭한 중심 (−2,3)에서 직선 mx−y=0까지 거리=2를 풀어 12m=−5, m=−5/12를 확인했으나 세부키는 보류한다.'],
  2010:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','h=f⁻¹∘g∘f에서 h(−1)=√2,h(−4)=−1을 구해 합 √2−1을 확인했으나 세부키는 보류한다.'],
  2011:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','대응도에서 ③만 정의역 모든 원소가 공역 한 원소에 정확히 대응하므로 함수임을 확인했으나 세부키는 보류한다.'],
  2012:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','A=B에서 2가 A의 나머지 원소라 a=2, −1이 B의 나머지 원소라 b=−1, 합1(①)을 확인했으나 세부키는 보류한다.'],
  2013:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','4원소 집합의 부분집합 수 2⁴=16(⑤)을 확인했으나 세부키는 보류한다.'],
  2014:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','p⇒¬q의 대우는 q⇒¬p이므로 항상 참인 ⑤를 확인했으나 세부키는 보류한다.'],
  2015:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','명제의 전제 x=2를 결론에 대입해 2⁵−k=0, k=32(④)를 확인했으나 세부키는 보류한다.'],
  2016:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','f⁻¹(0)=1은 f(1)=0이므로 2+a=0, a=−2(①)를 확인했으나 세부키는 보류한다.'],
  2017:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','합집합 원소수 공식에서 교집합 원소수0, 따라서 서로소 관련 보기들은 참이고 A∪B=B만 보장되지 않아 ③을 확인했으나 세부키는 보류한다.'],
  2018:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','①~④는 반례가 있고 2(x²+y²)−(x+y)²=(x−y)²≥0인 ⑤만 모든 실수에서 참임을 확인했으나 세부키는 보류한다.'],
  2019:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','(f∘g)(a)=2(a+1)+4=2a+6=−4에서 a=−5(⑤)를 확인했으나 세부키는 보류한다.'],
  2020:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','완전제곱 최솟값 −k²≥k−6에서 (k+3)(k−2)≤0, k∈[−3,2], M−m=5(②)를 확인했으나 세부키는 보류한다.']
};

export function adjudicateSequentialBatch00720012020V1(){
  const batch=JSON.parse(fs.readFileSync(batchPath,'utf8'));
  const candidates=JSON.parse(fs.readFileSync(candidatePath,'utf8'));
  const candidateBySequence=new Map(candidates.records.map(record=>[record.sequenceOrder,record]));
  const records=batch.records.filter(record=>record.sequenceOrder>=2001&&record.sequenceOrder<=2020).map(record=>{
    const decision=manualDecisions[record.sequenceOrder];
    if(!decision) throw new Error(`Missing manual decision for ${record.sequenceOrder}`);
    const candidate=candidateBySequence.get(record.sequenceOrder);
    const hold=decision[0]!=='DRAFT_TAXONOMY_HOLD';
    return {sequenceOrder:record.sequenceOrder,questionUid:record.questionUid,sourceArchiveFile:record.sourceArchiveFile,sourceOrdinal:record.sourceOrdinal,adjudicationStatus:decision[0],answerVerification:hold?decision[0]:'INDEPENDENT_RECHECK_CONFIRMED',candidateStatus:candidate?.candidateStatus??'MANUAL_CANDIDATE',candidateSubUnitKey:decision[1],independentRationale:decision[2]};
  });
  const counts={};
  for(const r of records) counts[r.adjudicationStatus]=(counts[r.adjudicationStatus]??0)+1;
  const stablePayload={schemaVersion:'archive-sequential-batch-007-2001-2020-adjudication-v1',batchDigest:batch.digest,candidateDigest:candidates.digest,productionWriteAllowed:false,totals:{records:records.length,answerRecheckConfirmed:records.filter(r=>r.answerVerification==='INDEPENDENT_RECHECK_CONFIRMED').length,wordingReviewRequired:records.filter(r=>r.answerVerification!=='INDEPENDENT_RECHECK_CONFIRMED').length,status:Object.fromEntries(Object.entries(counts).sort(([a],[b])=>a.localeCompare(b,'en')))},records};
  return {generatedAt:new Date().toISOString(),digest:sha256(JSON.stringify(stablePayload)),...stablePayload};
}

function main(){const report=adjudicateSequentialBatch00720012020V1();fs.mkdirSync(reviewDir,{recursive:true});fs.writeFileSync(outputPath,`${JSON.stringify(report,null,2)}\n`,'utf8');console.log(JSON.stringify({output:path.relative(archiveDir,outputPath).replaceAll('\\','/'),digest:report.digest,totals:report.totals},null,2));}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])) main();

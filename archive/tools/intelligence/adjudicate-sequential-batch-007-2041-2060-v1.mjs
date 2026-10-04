import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const archiveDir=path.resolve(scriptDir,'../..');
const reviewDir=path.join(archiveDir,'_generated','intelligence','phase3','sequential-review');
const batchPath=path.join(reviewDir,'archive-sequential-subunit-review-batch-007-v1.json');
const candidatePath=path.join(reviewDir,'archive-sequential-subunit-candidate-classification-batch-007-v1.json');
const outputPath=path.join(reviewDir,'archive-sequential-batch-007-2041-2060-adjudication-v1.json');
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions={
  2041:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','절편 양쪽 기울기 −1−4a,1−4a가 같은 부호여야 일대일이고 a<−1/4 또는 a>1/4, 보기 중 불가능한 1/5(⑤)을 확인했으나 세부키는 보류한다.'],
  2042:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','0~9 세제곱 일의 자리가 0~9를 모두 한 번씩 만들어 α=45,n(A)=10, 합55(④)를 확인했으나 세부키는 보류한다.'],
  2043:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','p의 진리집합 (k−2,k+2), q의 (2−2k,2+2k)에서 p∧¬q 정수 −1,0이 정확히 2개인 1/2<k<1(③)을 확인했으나 세부키는 보류한다.'],
  2044:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','1/x+1/y=1/2에서 xy=2(x+y), 역수 제곱합·합·제곱합의 하한을 구해 ㄱ·ㄴ·ㄷ 모두 참, ⑤를 확인했으나 세부키는 보류한다.'],
  2045:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','함수방정식에서 f(0)=0, f(−x)=f(x), f(2x)=4f(x)를 얻어 ㄱ·ㄴ 참, f(2¹⁰)=2²²라 ㄷ 거짓, ②를 확인했으나 세부키는 보류한다.'],
  2046:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','f∘f는 x<2에서 x, x≥2에서 −x/4+5/2이고 첫 직선과 포물선 접선 판별식으로 a=−49/8, 다른 구간 교점 없음(②)을 확인했으나 세부키는 보류한다.'],
  2047:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','y=f(3x−4)의 역에서 g(y)=3x−4, 즉 역함수 y=(1/3)g(x)+4/3, ab=4/9를 확인했으나 세부키는 보류한다.'],
  2048:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','a(n−a)=b(n−b)에서 a=b 또는 a+b=n, n=21일 때 10쌍으로 원소 수 최소, 최솟값20, k+α=41을 확인했으나 세부키는 보류한다.'],
  2049:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','f(0)=1에서 f(0)=1, 역함수로 g(1)=0, 곱셈 관계에 역함수를 적용해 g(pq)=g(p)+g(q), g(p²)=2g(p), ㄱ·ㄴ·ㄷ 모두 참을 확인했으나 세부키는 보류한다.'],
  2050:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','합집합 140명, 제주−서울=30, 교집합 t에서 제주만=85−t/2, t=0·110으로 최대85·최소30, 합115를 확인했으나 세부키는 보류한다.'],
  2051:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','정육각형 기하로 f의 세 구간을 세우고 f(f(a))=7/32에서 f(a)=7√3/24, 원상 7/6,23/6의 합5를 확인했으나 세부키는 보류한다.'],
  2052:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','5 이하 자연수와 방정식 해의 모임만 객관적이어서 ㄱ·ㄷ, ⑤를 확인했으나 세부키는 보류한다.'],
  2053:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','변수 x에 따라 참·거짓이 바뀌는 x−3=5만 조건이고 나머지는 명제이므로 ①을 확인했으나 세부키는 보류한다.'],
  2054:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','f⁻¹(7)=x는 2x−3=7과 같아 x=5(⑤)를 확인했으나 세부키는 보류한다.'],
  2055:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','그래프 ①에 x=2에서 y=2,4 두 점이 있어 수직선 판정에 실패하므로 함수 그래프가 아님을 확인했으나 세부키는 보류한다.'],
  2056:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','4원소 집합 부분집합 16개에서 자기 자신 하나를 제외해 진부분집합 15개(④)를 확인했으나 세부키는 보류한다.'],
  2057:['DRAFT_TAXONOMY_HOLD','H15-SB-04-RATIONAL_FUNCTION','ㄴ,ㄹ은 분모에 x가 남아 x=0에서 정의되지 않는 유리함수이고 ㄱ,ㄷ은 다항함수여서 ②를 확인했으나 세부키는 보류한다.'],
  2058:['DRAFT_TAXONOMY_HOLD','H15-SB-04-RATIONAL_FUNCTION','정의역은 x≠0이고 원점 대칭·좌표축 점근선·점 (1/4,−1)·제2·4사분면은 참, 정의역 전체라는 ③만 거짓임을 확인했으나 세부키는 보류한다.'],
  2059:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','A 원소 중 1과 {∅}는 포함, ∅와 {1,2,3}은 불포함/부분집합 아님이어서 참 2개(③)를 확인했으나 세부키는 보류한다.'],
  2060:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','색칠영역은 B∩C∩Aᶜ이고 C−(B−A)ᶜ를 변형하면 같은 식이므로 ①을 확인했으나 세부키는 보류한다.']
};

export function adjudicateSequentialBatch00720412060V1(){
  const batch=JSON.parse(fs.readFileSync(batchPath,'utf8'));
  const candidates=JSON.parse(fs.readFileSync(candidatePath,'utf8'));
  const candidateBySequence=new Map(candidates.records.map(record=>[record.sequenceOrder,record]));
  const records=batch.records.filter(record=>record.sequenceOrder>=2041&&record.sequenceOrder<=2060).map(record=>{
    const decision=manualDecisions[record.sequenceOrder];
    if(!decision) throw new Error(`Missing manual decision for ${record.sequenceOrder}`);
    const candidate=candidateBySequence.get(record.sequenceOrder);
    const hold=decision[0]!=='DRAFT_TAXONOMY_HOLD';
    return {sequenceOrder:record.sequenceOrder,questionUid:record.questionUid,sourceArchiveFile:record.sourceArchiveFile,sourceOrdinal:record.sourceOrdinal,adjudicationStatus:decision[0],answerVerification:hold?decision[0]:'INDEPENDENT_RECHECK_CONFIRMED',candidateStatus:candidate?.candidateStatus??'MANUAL_CANDIDATE',candidateSubUnitKey:decision[1],independentRationale:decision[2]};
  });
  const counts={};
  for(const r of records) counts[r.adjudicationStatus]=(counts[r.adjudicationStatus]??0)+1;
  const stablePayload={schemaVersion:'archive-sequential-batch-007-2041-2060-adjudication-v1',batchDigest:batch.digest,candidateDigest:candidates.digest,productionWriteAllowed:false,totals:{records:records.length,answerRecheckConfirmed:records.filter(r=>r.answerVerification==='INDEPENDENT_RECHECK_CONFIRMED').length,wordingReviewRequired:records.filter(r=>r.answerVerification!=='INDEPENDENT_RECHECK_CONFIRMED').length,status:Object.fromEntries(Object.entries(counts).sort(([a],[b])=>a.localeCompare(b,'en')))},records};
  return {generatedAt:new Date().toISOString(),digest:sha256(JSON.stringify(stablePayload)),...stablePayload};
}

function main(){const report=adjudicateSequentialBatch00720412060V1();fs.mkdirSync(reviewDir,{recursive:true});fs.writeFileSync(outputPath,`${JSON.stringify(report,null,2)}\n`,'utf8');console.log(JSON.stringify({output:path.relative(archiveDir,outputPath).replaceAll('\\','/'),digest:report.digest,totals:report.totals},null,2));}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])) main();

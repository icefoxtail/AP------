import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const archiveDir=path.resolve(scriptDir,'../..');
const reviewDir=path.join(archiveDir,'_generated','intelligence','phase3','sequential-review');
const batchPath=path.join(reviewDir,'archive-sequential-subunit-review-batch-007-v1.json');
const candidatePath=path.join(reviewDir,'archive-sequential-subunit-candidate-classification-batch-007-v1.json');
const outputPath=path.join(reviewDir,'archive-sequential-batch-007-1921-1940-adjudication-v1.json');
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions={
  1921:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','재귀식에서 f(98)=98,f(99)=99를 구하고 80~99의 짝수 10개는 98, 홀수 10개는 99, f(100)=98이어서 합2068을 확인했으나 세부키는 보류한다.'],
  1922:['DRAFT_TAXONOMY_HOLD','H15-SA-12-TRANSLATION','이동식 a−3=−2,b+4=3에서 (a,b)=(1,−1), 합0(①)을 확인했으나 세부키는 보류한다.'],
  1923:['DRAFT_TAXONOMY_HOLD','H15-SA-12-REFLECTION','y축 대칭 직선은 −2x+y=3, 원점 대칭 원의 중심은 (k,−3)이며 중심을 직선에 대입해 k=−3(②)을 확인했으나 세부키는 보류한다.'],
  1924:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','정의역 −1,3에서 a−b=4, 9a−b=12를 얻어 a=1,b=−3, 요구값4(⑤)를 확인했으나 세부키는 보류한다.'],
  1925:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','객관적 기준인 학교 학년, 100보다 작은 짝수, 공집합인 −2보다 작은 자연수는 집합이고 ‘높은 산’, ‘빠른 자동차’는 아니어서 3개(④)를 확인했으나 세부키는 보류한다.'],
  1926:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','2,3을 제외한 7원소에서 4 또는 5 포함은 2⁷−2⁵=96(④)이고 전체집합과 같을 수 없어 진부분집합임을 확인했으나 세부키는 보류한다.'],
  1927:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','㉠ 드모르간, ㉡ 교환, ㉢ 분배 법칙의 순서로 ②를 확인했으나 세부키는 보류한다.'],
  1928:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','U={1,…,15}, A={1,2,3,4,6,12}, B={1,3,7,9,11,13}을 열거해 (A∪B)ᶜ={5,8,10,14,15}, ①만 참임을 확인했으나 세부키는 보류한다.'],
  1929:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','A18∩A9=A18, 100 미만 18의 배수 5개와 12의 배수 8개, 공통 36의 배수 2개에서 합집합 11(③)을 확인했으나 세부키는 보류한다.'],
  1930:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','역이 참이고 대우가 거짓이면 원명제가 거짓인 경우를 찾으며 ⑤는 x=3에서 역 참, x=±√2에서 원명제 거짓임을 확인했으나 세부키는 보류한다.'],
  1931:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','그림에서 Pᶜ와 Q가 서로소이므로 Q⊂P, 즉 q는 p의 충분조건인 ①을 확인했으나 세부키는 보류한다.'],
  1932:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','귀류법의 (가)~(마) 모든 단계가 논리적으로 옳아 저장 answer ‘정답 없음’이 타당함을 확인했으나 세부키는 보류한다.'],
  1933:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','x+y=1에서 x²+y²≥1/2, xy≤1/4로 역수 제곱합≥8, x=y=1/2에서 합17/2(⑤)를 확인했으나 세부키는 보류한다.'],
  1934:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','정의역 정수 −2,…,2에서 치역 {0,1,2,3,4}, 원소합10(④)을 확인했으나 세부키는 보류한다.'],
  1935:['DRAFT_TAXONOMY_HOLD','H15-SA-12-COMPOSITE_TRANSFORMATION','평행이동 후 l:y=2x−2a−1, y축 대칭 m:y=−2x−2a−1, y=x 대칭 n:y=−x/2−a−1/2, x=0 교점 조건에서 a=−1/2(②)을 확인했으나 세부키는 보류한다.'],
  1936:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','f는 [2,a]에서 증가, 치역 일치를 위해 b=2,(a−2)²+2=a, a>2에서 a=3, ab=6(④)을 확인했으나 세부키는 보류한다.'],
  1937:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','h=id에서 h(2)=2,h(1)=1, g 상수값2, f(0)=2,f(1)=0,f(2)=1, 전단사로 f(3)=3, 합6(⑤)을 확인했으나 세부키는 보류한다.'],
  1938:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','t=f(x)가 고정점 f(t)=t를 만족하려 t=2,6이고 각각 f(x)=t의 해가 2,4 및 0,6, 합12(⑤)을 확인했으나 세부키는 보류한다.'],
  1939:['DRAFT_TAXONOMY_HOLD','H15-SA-11-INTERSECTION','중심 (−3,1)에서 직선 x+y−6=0까지 거리 4√2가 최소 반지름, 따라서 r²=32(③)을 확인했으나 세부키는 보류한다.'],
  1940:['DRAFT_TAXONOMY_HOLD','H15-SA-12-REFLECTION','B를 x축 대칭한 B′=(4,−5)로 바꾸면 AP+BP≥AB′=6√2, 직선 AB′와 x축 교점 x=−1을 확인했으나 세부키는 보류한다.']
};

export function adjudicateSequentialBatch00719211940V1(){
  const batch=JSON.parse(fs.readFileSync(batchPath,'utf8'));
  const candidates=JSON.parse(fs.readFileSync(candidatePath,'utf8'));
  const candidateBySequence=new Map(candidates.records.map(record=>[record.sequenceOrder,record]));
  const records=batch.records.filter(record=>record.sequenceOrder>=1921&&record.sequenceOrder<=1940).map(record=>{
    const decision=manualDecisions[record.sequenceOrder];
    if(!decision) throw new Error(`Missing manual decision for ${record.sequenceOrder}`);
    const candidate=candidateBySequence.get(record.sequenceOrder);
    const hold=decision[0]!=='DRAFT_TAXONOMY_HOLD';
    return {sequenceOrder:record.sequenceOrder,questionUid:record.questionUid,sourceArchiveFile:record.sourceArchiveFile,sourceOrdinal:record.sourceOrdinal,adjudicationStatus:decision[0],answerVerification:hold?decision[0]:'INDEPENDENT_RECHECK_CONFIRMED',candidateStatus:candidate?.candidateStatus??'MANUAL_CANDIDATE',candidateSubUnitKey:decision[1],independentRationale:decision[2]};
  });
  const counts={};
  for(const r of records) counts[r.adjudicationStatus]=(counts[r.adjudicationStatus]??0)+1;
  const stablePayload={schemaVersion:'archive-sequential-batch-007-1921-1940-adjudication-v1',batchDigest:batch.digest,candidateDigest:candidates.digest,productionWriteAllowed:false,totals:{records:records.length,answerRecheckConfirmed:records.filter(r=>r.answerVerification==='INDEPENDENT_RECHECK_CONFIRMED').length,wordingReviewRequired:records.filter(r=>r.answerVerification!=='INDEPENDENT_RECHECK_CONFIRMED').length,status:Object.fromEntries(Object.entries(counts).sort(([a],[b])=>a.localeCompare(b,'en')))},records};
  return {generatedAt:new Date().toISOString(),digest:sha256(JSON.stringify(stablePayload)),...stablePayload};
}

function main(){const report=adjudicateSequentialBatch00719211940V1();fs.mkdirSync(reviewDir,{recursive:true});fs.writeFileSync(outputPath,`${JSON.stringify(report,null,2)}\n`,'utf8');console.log(JSON.stringify({output:path.relative(archiveDir,outputPath).replaceAll('\\','/'),digest:report.digest,totals:report.totals},null,2));}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])) main();

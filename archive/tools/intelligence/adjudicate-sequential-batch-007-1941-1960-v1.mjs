import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const archiveDir=path.resolve(scriptDir,'../..');
const reviewDir=path.join(archiveDir,'_generated','intelligence','phase3','sequential-review');
const batchPath=path.join(reviewDir,'archive-sequential-subunit-review-batch-007-v1.json');
const candidatePath=path.join(reviewDir,'archive-sequential-subunit-candidate-classification-batch-007-v1.json');
const outputPath=path.join(reviewDir,'archive-sequential-batch-007-1941-1960-adjudication-v1.json');
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

const manualDecisions={
  1941:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','포함배제로 적어도 한 과목 비율 23/30, 미신청 7/30=7명에서 전체30명, 신청자는 23명을 확인했으나 세부키는 보류한다.'],
  1942:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','차이는 (ay−bx)²≥0이고 (a,2b),(3,1) 적용으로 |3a+2b|≤2√5, M−m=4√5를 확인했으나 세부키는 보류한다.'],
  1943:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_COMPOSITION','(f∘g)(a)=−8a+15=5에서 a=5/4, h∘f=g를 역치환해 h(x)=−2x를 확인했으나 세부키는 보류한다.'],
  1944:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','A⊂B에서 합집합·교집합·차집합과 여집합 포함은 참이나 (A∪B)ᶜ=Aᶜ는 일반적으로 불성립하여 ③을 확인했으나 세부키는 보류한다.'],
  1945:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','ㄴ 공집합⊂A, ㄷ 짝수 소수 집합 {2}⊂{2,4,6,8}만 참이고 ㄱ·ㄹ은 거짓이어서 ②를 확인했으나 세부키는 보류한다.'],
  1946:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','−2와 1이 B에 들어가려는 후보의 교집합이 a=1, 이때 A 합 −1,B 합1로 총합0(②)을 확인했으나 세부키는 보류한다.'],
  1947:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','Pᶜ∩Q=∅에서 Q⊂P와 q→p를 얻어 ㄱ·ㄴ만 항상 참, ①을 확인했으나 세부키는 보류한다.'],
  1948:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','ㄱ은 xy=0이 둘 다 0과 동치 아님, ㄴ은 등변 조건 방향 불일치, ㄷ과 ㄹ만 양방향 성립해 ③을 확인했으나 세부키는 보류한다.'],
  1949:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','y+2z=x+3과 코시로 (x+3)²≤5(9−x²), −3≤x≤2를 얻어 M+m=−1(②)을 확인했으나 세부키는 보류한다.'],
  1950:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','제시 그래프에 수직선을 적용하면 ③만 한 x에 두 y가 대응하여 함수 그래프가 아님을 확인했으나 세부키는 보류한다.'],
  1951:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','g⁻¹(x)=(1−x)/3, f(g⁻¹(a))=3−a=8에서 a=−5(⑤)를 확인했으나 세부키는 보류한다.'],
  1952:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','g=id, h 상수, f(3)=g(2)=h(1)=2, f(1)=3,f(2)=1이므로 f(2)+g(3)−h(2)=2(④)를 확인했으나 세부키는 보류한다.'],
  1953:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','합집합 원소합 40=21+S(B)−(4+6)에서 S(B)=29(③)를 확인했으나 세부키는 보류한다.'],
  1954:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','p의 진리집합 (k−3,k+3), q의 (k/2−5,k/2+5)가 겹치는 조건 k<16, 자연수 15개(⑤)를 확인했으나 세부키는 보류한다.'],
  1955:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','t=2x−1>0에서 8/t+t/2+1/2의 최솟값 9/2, x=b=5/2이므로 a−b=2(②)를 확인했으나 세부키는 보류한다.'],
  1956:['DRAFT_TAXONOMY_HOLD','H15-SB-03-INVERSE_FUNCTION','합성식을 g∘f⁻¹로 정리하고 그래프에서 f(d)=c,g(d)=e를 읽어 값 e(④)를 확인했으나 세부키는 보류한다.'],
  1957:['DRAFT_TAXONOMY_HOLD','H15-SB-02-PROPOSITION','역은 a=−2 반례로 거짓, 대우 a²<3⇒a<√3은 참임을 확인했으나 세부키는 보류한다.'],
  1958:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','다운로드 총합 1.15n, 정확히 두 개 10명과 세 개 중복 0.05n을 보정해 1.15n=n+10+0.05n, n=100을 확인했으나 세부키는 보류한다.'],
  1959:['DRAFT_TAXONOMY_HOLD','H15-SB-01-SET','객관적 기준이 있는 ②,④,⑤만 집합이므로 해당 번호를 확인했으나 세부키는 보류한다.'],
  1960:['DRAFT_TAXONOMY_HOLD','H15-SB-03-FUNCTION_MAPPING','f=g가 되는 방정식이 (x−2)(x−1)(x+1)=0이어서 가능한 원소 −1,1,2 중 2개 선택 세 집합을 확인했으나 세부키는 보류한다.']
};

export function adjudicateSequentialBatch00719411960V1(){
  const batch=JSON.parse(fs.readFileSync(batchPath,'utf8'));
  const candidates=JSON.parse(fs.readFileSync(candidatePath,'utf8'));
  const candidateBySequence=new Map(candidates.records.map(record=>[record.sequenceOrder,record]));
  const records=batch.records.filter(record=>record.sequenceOrder>=1941&&record.sequenceOrder<=1960).map(record=>{
    const decision=manualDecisions[record.sequenceOrder];
    if(!decision) throw new Error(`Missing manual decision for ${record.sequenceOrder}`);
    const candidate=candidateBySequence.get(record.sequenceOrder);
    const hold=decision[0]!=='DRAFT_TAXONOMY_HOLD';
    return {sequenceOrder:record.sequenceOrder,questionUid:record.questionUid,sourceArchiveFile:record.sourceArchiveFile,sourceOrdinal:record.sourceOrdinal,adjudicationStatus:decision[0],answerVerification:hold?decision[0]:'INDEPENDENT_RECHECK_CONFIRMED',candidateStatus:candidate?.candidateStatus??'MANUAL_CANDIDATE',candidateSubUnitKey:decision[1],independentRationale:decision[2]};
  });
  const counts={};
  for(const r of records) counts[r.adjudicationStatus]=(counts[r.adjudicationStatus]??0)+1;
  const stablePayload={schemaVersion:'archive-sequential-batch-007-1941-1960-adjudication-v1',batchDigest:batch.digest,candidateDigest:candidates.digest,productionWriteAllowed:false,totals:{records:records.length,answerRecheckConfirmed:records.filter(r=>r.answerVerification==='INDEPENDENT_RECHECK_CONFIRMED').length,wordingReviewRequired:records.filter(r=>r.answerVerification!=='INDEPENDENT_RECHECK_CONFIRMED').length,status:Object.fromEntries(Object.entries(counts).sort(([a],[b])=>a.localeCompare(b,'en')))},records};
  return {generatedAt:new Date().toISOString(),digest:sha256(JSON.stringify(stablePayload)),...stablePayload};
}

function main(){const report=adjudicateSequentialBatch00719411960V1();fs.mkdirSync(reviewDir,{recursive:true});fs.writeFileSync(outputPath,`${JSON.stringify(report,null,2)}\n`,'utf8');console.log(JSON.stringify({output:path.relative(archiveDir,outputPath).replaceAll('\\','/'),digest:report.digest,totals:report.totals},null,2));}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])) main();

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const sha = (value) => `sha256:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
const entries = [
  {
    questionUid: 'archive/exams/original/high/h1/2mid/22_복성고_2학기_중간_고1_기출.js|22_복성고_2학기_중간_고1_기출|9',
    status: 'VERIFIED_AGAINST_EXISTING_SOLUTION',
    verification: 'B∩C∩Aᶜ와 보기 ① C-(B-A)^c를 전개해 동일함을 확인',
    answerSolutionParity: 'PASS'
  },
  {
    questionUid: 'archive/exams/original/high/h1/2mid/22_제일고_2학기_중간_고1_기출.js|22_제일고_2학기_중간_고1_기출|20',
    status: 'VERIFIED_AGAINST_EXISTING_SOLUTION',
    verification: 'a₁=1, a₄=9, 9∈B에서 3∈A, T 합 조건에서 A={1,2,3,9,11}을 재계산',
    answerSolutionParity: 'PASS'
  },
  {
    questionUid: 'archive/exams/original/high/h1/2mid/22_팔마고_2학기_중간_고1_기출.js|22_팔마고_2학기_중간_고1_기출|18',
    status: 'VERIFIED_AGAINST_EXISTING_SOLUTION',
    verification: 'x²+y²=5의 정수해 (±1,±2),(±2,±1) 8개와 n(B)=k를 대조해 k=8 확인',
    answerSolutionParity: 'PASS'
  },
  {
    questionUid: 'archive/exams/original/high/h1/2mid/22_효천고_2학기_중간_고1_기출.js|22_효천고_2학기_중간_고1_기출|10',
    status: 'VERIFIED_AGAINST_EXISTING_SOLUTION',
    verification: 'max min(28,23)=23, min 28+23-45=6, 합 29를 독립 계산식으로 대조',
    answerSolutionParity: 'PASS'
  },
  {
    questionUid: 'archive/exams/original/high/h1/2mid/22_효천고_2학기_중간_고1_기출.js|22_효천고_2학기_중간_고1_기출|11',
    status: 'VERIFIED_AGAINST_EXISTING_SOLUTION',
    verification: 'A-B=∅와 B-A=∅에서 A⊆B, B⊆A를 각각 도출해 A=B 확인',
    answerSolutionParity: 'PASS'
  },
  {
    questionUid: 'archive/exams/original/high/h1/2mid/22_효천고_2학기_중간_고1_기출.js|22_효천고_2학기_중간_고1_기출|12',
    status: 'VERIFIED_AGAINST_EXISTING_SOLUTION',
    verification: 'a=3,2,-2 후보의 대칭차집합을 비교해 a=2, b=6, b-a=4 확인',
    answerSolutionParity: 'PASS'
  }
];
const output = {
  generatedAtKst: '2026-09-06',
  manifestVersion: 'MATH_VERIFICATION_MANIFEST_v1',
  batchId: 'phase2-batch-11',
  verificationMode: 'SEPARATE_MATH_RECHECK_NOT_EXTERNAL_BLIND',
  independentExternalStatus: 'NOT_PROVEN',
  entries,
  status: 'RECORDED_SEPARATE_MATH_RECHECK_EXTERNAL_INDEPENDENCE_PENDING',
  manifestSha: sha(entries)
};
fs.writeFileSync(path.join(OUT, 'phase2_batch_11_math_verification.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, entryCount: entries.length, independentExternalStatus: output.independentExternalStatus, manifestSha: output.manifestSha }, null, 2));

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const OUTPUT = path.join(REPORT, '329_source_solution_repairs_independent_recheck_r25.json');
const checks = [
  ['archive/exams/original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js', 20, ['k=2', 'α=1', 'β=4', 'f(1)='], { computed: 'f(x)=−(x−3)²+k+6; k=2; [α,β]=[1,4]; minimum=4', answer: '②' }],
  ['archive/exams/original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js', 22, ['a=4', '22', '최댓값'], { computed: 'a=4; f(x)=(x−4)²+13; maximum=22', answer: '22' }],
  ['archive/exams/original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js', 16, ['−15/8', '선택지 ③'], { computed: 'k=−2(α−3/4)²−15/8; maximum=−15/8', answer: '③', forbidden: '원문 표시 정답' }],
  ['archive/exams/original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js', 6, ['x=3', '11', '정답은 ⑤'], { computed: 'y=(x−3)²−5 decreases on [−1,2]; maximum=11', answer: '⑤' }],
  ['archive/exams/original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js', 9, ['1−8k', 'k=\\dfrac18', '정답은 ④'], { computed: 'D=0; k=1/8', answer: '④' }],
  ['archive/exams/original/high/h1/1mid/26_매산여고_1학기_중간_고1_기출_c.js', 13, ['D=6^2', 'k<12', '11', '정답은 ④'], { computed: 'D=48−4k>0; natural maximum k=11', answer: '④' }],
  ['archive/exams/original/high/h1/1mid/26_매산여고_1학기_중간_고1_기출_c.js', 14, ['2(x−1)^2+5', '−1\\le t\\le1', '정답은 ①'], { computed: '1∈[t,t+2] ⇔ −1≤t≤1', answer: '①' }],
  ['archive/exams/original/high/h1/1mid/26_매산여고_1학기_중간_고1_기출_c.js', 6, ['k^2−36=0', 'k=\\pm6', '정답은 ⑤'], { computed: 'vertex y=k²−36=0; k=±6', answer: '⑤' }],
  ['archive/exams/original/high/h1/1mid/26_매산여고_1학기_중간_고1_기출_c.js', 7, ['(x−1)^2−1', '최댓값은 3', '합은 3+(-1)=2'], { computed: 'minimum=−1; maximum=3; sum=2', answer: '②' }],
  ['archive/exams/original/high/h1/1mid/26_팔마고_1학기_중간_고1_기출_c.js', 4, ['k−7>0', '최솟값은 8', '정답은 ③'], { computed: 'vertex y=k−7>0; least integer k=8', answer: '③' }],
  ['archive/exams/original/high/h1/1mid/26_팔마고_1학기_중간_고1_기출_c.js', 5, ['33+8k', 'k=\\dfrac{−33}{8}', '3', '정답은 ⑤'], { computed: 'D=33+8k=0; (8/11)|k|=3', answer: '⑤' }],
];
function load(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return context.window; }
function normalize(value) { return String(value ?? '').replace(/\\(?:d?frac)\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2').replace(/\\(?:alpha|beta)/g, match => match === '\\alpha' ? 'α' : 'β').replace(/\\(?:le|leq)/g, '≤').replace(/\\pm/g, '±').replace(/\$|\\/g, '').replace(/[{}]/g, '').replace(/[−–]/g, '-').replace(/\s+/g, ''); }
const rows = [];
for (const [sourceJsPath, id, required, independent] of checks) {
  const question = load(sourceJsPath).questionBank.find(item => Number(item.id) === id);
  const solution = String(question.solution ?? '');
  const missing = required.filter(token => !normalize(solution).includes(normalize(token)));
  const forbiddenPresent = independent.forbidden ? solution.includes(independent.forbidden) : false;
  const pass = !missing.length && !forbiddenPresent && solution.includes(String(question.answer));
  rows.push({ sourceJsPath, id, independentlyComputed: independent.computed, expectedAnswer: independent.answer, sourceAnswer: question.answer, requiredSolutionTokens: required, missingSolutionTokens: missing, forbiddenToken: independent.forbidden ?? null, forbiddenTokenPresent: forbiddenPresent, solutionContainsSourceAnswer: solution.includes(String(question.answer)), status: pass ? 'SOURCE_SOLUTION_REPAIR_RECHECK_MATCH' : 'SOURCE_SOLUTION_REPAIR_RECHECK_MISMATCH' });
}
const mismatchCount = rows.filter(row => row.status.endsWith('MISMATCH')).length;
const output = { schemaVersion: 'HS_QUADRATIC_SOURCE_SOLUTION_REPAIRS_INDEPENDENT_RECHECK_R25', status: mismatchCount ? 'SOURCE_SOLUTION_REPAIR_RECHECK_FAIL' : 'SOURCE_SOLUTION_REPAIR_INDEPENDENT_RECHECK_PASS_NO_FINAL_PASS', productionAuthorized: false, inputVisibilityProfile: 'SOURCE_SOLUTION_A2_RECHECK', priorReviewVisibility: 'NONE', rows, checkedRows: rows.length, mismatchCount, calculatorDigest: crypto.createHash('sha256').update(JSON.stringify(checks)).digest('hex'), note: 'Independent recheck of the 11 current-source solution repairs; this does not replace whole-job provider FINAL_AUDIT.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, checkedRows: output.checkedRows, mismatchCount }, null, 2));

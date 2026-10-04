import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const OUT_DIR = path.join(ROOT, 'archive', '_generated', 'hs-quadratic-svg-upgrade-20260908', 'candidate-r5', 'exams');
const OUTPUT = path.join(REPORT, '22_current_solution_repairs_candidate_r5.json');

const FILES = [
  'archive/exams/original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js',
  'archive/exams/original/high/h1/1mid/26_매산여고_1학기_중간_고1_기출_c.js',
  'archive/exams/original/high/h1/1mid/26_팔마고_1학기_중간_고1_기출_c.js',
];

const REPAIRS = new Map([
  ['26_금당고_1학기_중간_고1_기출_c.js|6', '구간 $-1\\le x\\le2$에서 $y=x^2-6x+4=(x-3)^2-5$의 축은 $x=3$이다. 축이 구간의 오른쪽에 있으므로 이 구간에서는 x가 커질수록 함수값이 작아진다. 따라서 양 끝값을 비교하면 $f(-1)=11$, $f(2)=-4$이고 최댓값은 $11$이다. 따라서 정답은 ⑤이다.'],
  ['26_금당고_1학기_중간_고1_기출_c.js|9', '이차함수 $y=2x^2-x+k$의 그래프와 x축이 한 점에서 만나려면 중근을 가져야 하므로 판별식이 0이어야 한다. $D=(-1)^2-4\\cdot2\\cdot k=1-8k=0$에서 $k=\\frac{1}{8}$이다. 따라서 정답은 ④이다.'],
  ['26_금당고_1학기_중간_고1_기출_c.js|16', '두 교점의 x좌표를 $\\alpha,\\beta$라 하고 $\\alpha:\\beta=1:2$, $\\alpha<\\beta$이므로 $\\beta=2\\alpha$로 둔다. $f(x)=x^2+px+q$라 하면 교점 방정식은 $x^2+(p-5)x+(q-k)=0$이다. 근과 계수의 관계에서 $3\\alpha=5-p$이므로 $p=5-3\\alpha$이다. 또 $f(1)=3$에서 $q=2-p=3\\alpha-3$이다. 따라서 $k=q-\\alpha\\beta=3\\alpha-3-2\\alpha^2=-2(\\alpha-\\frac34)^2-\\frac{15}{8}$이다. $\\alpha=\\frac34$일 때 최댓값 $-\\frac{15}{8}$이고 현재 선택지의 정답은 ③이다.'],
  ['26_매산여고_1학기_중간_고1_기출_c.js|6', '$y=x^2-6x+k^2-27=(x-3)^2+k^2-36$이다. x축과 한 점에서 만나려면 꼭짓점의 y좌표가 0이어야 하므로 $k^2-36=0$이다. 따라서 $k=-6$ 또는 $k=6$이고, 모든 값은 $-6,6$이므로 정답은 ⑤이다.'],
  ['26_매산여고_1학기_중간_고1_기출_c.js|7', '$y=x^2-2x=(x-1)^2-1$이다. 구간 $[1,3]$에서 꼭짓점 $x=1$의 함수값은 최솟값 $-1$이고, 오른쪽 끝점에서 $f(3)=3$이므로 최댓값은 $3$이다. 따라서 최댓값과 최솟값의 합은 $3+(-1)=2$이고 정답은 ②이다.'],
  ['26_매산여고_1학기_중간_고1_기출_c.js|13', '두 그래프의 교점은 $x^2+4x+k=-2x+3$, 즉 $x^2+6x+k-3=0$의 실근이다. 서로 다른 두 점에서 만나려면 $D=6^2-4(k-3)=48-4k>0$이므로 $k<12$이다. 자연수 $k$의 최댓값은 $11$이고 정답은 ④이다.'],
  ['26_매산여고_1학기_중간_고1_기출_c.js|14', '$f(x)=2x^2-4x+7=2(x-1)^2+5$이므로 전체 최솟값은 $x=1$에서 $5$이다. 구간 $[t,t+2]$에서 이 최솟값을 가지려면 $1$이 구간에 포함되어야 하므로 $t\\le1\\le t+2$, 즉 $-1\\le t\\le1$이다. 따라서 정답은 ①이다.'],
  ['26_팔마고_1학기_중간_고1_기출_c.js|4', '$y=x^2-2x+k-6=(x-1)^2+k-7$이다. 위로 열린 포물선의 최솟값은 $k-7$이므로 x축과 만나지 않으려면 $k-7>0$, 즉 $k>7$이어야 한다. 정수 $k$의 최솟값은 $8$이고 정답은 ③이다.'],
  ['26_팔마고_1학기_중간_고1_기출_c.js|5', '두 그래프의 교점은 $2x^2+3x-1=-2x+k$, 즉 $2x^2+5x-(1+k)=0$의 근이다. 한 점에서 만나려면 판별식이 0이므로 $25+8(1+k)=0$, 따라서 $k=-\\frac{33}{8}$이다. 그러므로 $\\frac{8}{11}|k|=\\frac{8}{11}\\cdot\\frac{33}{8}=3$이고 정답은 ⑤이다.'],
]);

function load(filePath) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window)); }
function protectedHash(q) { return crypto.createHash('sha256').update(JSON.stringify({ id: q.id ?? null, content: q.content ?? null, choices: q.choices ?? null, answer: q.answer ?? null, image: q.image ?? null })).digest('hex'); }
function textSha(value) { return crypto.createHash('sha256').update(value || '').digest('hex'); }

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outputRows = [];
  for (const sourcePath of FILES) {
    const source = load(path.join(ROOT, sourcePath));
    const candidate = source.questionBank.map(q => ({ ...q }));
    const basename = path.basename(sourcePath);
    for (const [key, replacement] of REPAIRS) {
      if (!key.startsWith(`${basename}|`)) continue;
      const id = Number(key.split('|').at(-1));
      const q = candidate.find(item => Number(item.id) === id);
      if (!q) throw new Error(`missing ${basename} q${id}`);
      const beforeProtected = protectedHash(q); const beforeSolution = q.solution || '';
      q.solution = replacement;
      const afterProtected = protectedHash(q);
      if (beforeProtected !== afterProtected) throw new Error(`protected hash changed ${key}`);
      outputRows.push({ questionUid: `${sourcePath}|${basename.replace(/\.js$/, '')}|${id}`, sourceJsPath: sourcePath, id, beforeSolutionSha256: textSha(beforeSolution), afterSolutionSha256: textSha(q.solution), protectedHashBefore: beforeProtected, protectedHashAfter: afterProtected, reasonCode: key.includes('|9') ? 'GENERIC_SOLUTION_PLACEHOLDER' : key.includes('|16') ? 'STALE_SOURCE_ANSWER_CONFLICT_TEXT' : 'GENERIC_SOLUTION_PLACEHOLDER', status: 'CANDIDATE_SOLUTION_REPAIRED_NO_PASS' });
    }
    const outputName = basename.replace(/\.js$/, '-solution-repair.js');
    fs.writeFileSync(path.join(OUT_DIR, outputName), `window.examTitle = ${JSON.stringify(source.examTitle)};\nwindow.questionBank = ${JSON.stringify(candidate, null, 2)};\n`, 'utf8');
  }
  const output = { schemaVersion: 'HS_QUADRATIC_CURRENT_SOLUTION_REPAIRS_CANDIDATE_R5', status: 'CANDIDATE_SOLUTION_REPAIRED_NO_PASS', productionAuthorized: false, rows: outputRows, candidateRoot: 'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r5/exams', note: 'Nine generic/stale solution defects are repaired in candidate-only banks. q13 degeneracy and the three additional correctness source holds are not overwritten.' };
  fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ status: output.status, repairedRows: output.rows.length, protectedParity: output.rows.every(row => row.protectedHashBefore === row.protectedHashAfter) }, null, 2));
}
main();

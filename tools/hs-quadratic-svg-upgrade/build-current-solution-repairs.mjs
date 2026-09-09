import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const SOURCE_PATH = 'archive/exams/original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js';
const OUT_DIR = path.join(ROOT, 'archive', '_generated', 'hs-quadratic-svg-upgrade-20260908', 'candidate-r4', 'exams');
const OUT_PATH = path.join(OUT_DIR, '26-geumdang-solution-repairs.js');
const LEDGER = path.join(REPORT, '21_current_solution_repairs_candidate.json');

function loadWindow(filePath) {
  const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window));
}
function protectedHash(q) { return crypto.createHash('sha256').update(JSON.stringify({ id: q.id ?? null, content: q.content ?? null, choices: q.choices ?? null, answer: q.answer ?? null, image: q.image ?? null })).digest('hex'); }

const REPAIRS = new Map([
  [9, {
    reasonCode: 'GENERIC_SOLUTION_PLACEHOLDER',
    solution: '이차함수 $y=2x^2-x+k$의 그래프가 x축과 한 점에서 만나려면 꼭짓점이 x축 위에 있어야 하므로 판별식이 0이어야 한다.\n$D=(-1)^2-4\cdot2\cdot k=1-8k=0$에서 $k=\\frac{1}{8}$이다. 따라서 정답은 ④이다.',
  }],
  [16, {
    reasonCode: 'STALE_SOURCE_ANSWER_CONFLICT_TEXT',
    solution: '두 교점의 x좌표를 $\\alpha,\\beta$라 하고 $\\alpha:\\beta=1:2$, $\\alpha<\\beta$이므로 $\\beta=2\\alpha$로 둔다.\\n$f(x)=x^2+px+q$라 하면 직선 $y=5x+k$와의 교점 방정식은 $x^2+(p-5)x+(q-k)=0$이다. 근과 계수의 관계로 $3\\alpha=\\alpha+\\beta=5-p$이므로 $p=5-3\\alpha$이다. 또한 $f(1)=3$에서 $1+p+q=3$, 즉 $q=2-p=3\\alpha-3$이다.\\n따라서 $k=q-\\alpha\\beta=3\\alpha-3-2\\alpha^2=-2(\\alpha-\\frac34)^2-\\frac{15}{8}$이다. $\\alpha=\\frac34$일 때 최댓값 $-\\frac{15}{8}$을 얻으며, 현재 선택지의 정답은 ③이다.',
  }],
]);

function main() {
  const source = loadWindow(path.join(ROOT, SOURCE_PATH));
  const candidate = source.questionBank.map(q => ({ ...q }));
  const rows = [];
  for (const [id, repair] of REPAIRS) {
    const q = candidate.find(item => Number(item.id) === id);
    if (!q) throw new Error(`missing q${id}`);
    const before = protectedHash(q);
    const oldSolution = q.solution;
    q.solution = repair.solution;
    const after = protectedHash(q);
    if (before !== after) throw new Error(`protected hash changed q${id}`);
    rows.push({ questionUid: `${SOURCE_PATH}|${path.basename(SOURCE_PATH, '.js')}|${id}`, sourceJsPath: SOURCE_PATH, id, reasonCode: repair.reasonCode, beforeSolutionSha256: crypto.createHash('sha256').update(oldSolution || '').digest('hex'), afterSolutionSha256: crypto.createHash('sha256').update(q.solution).digest('hex'), protectedHashBefore: before, protectedHashAfter: after, status: 'CANDIDATE_SOLUTION_REPAIRED_NO_PASS' });
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_PATH, `window.examTitle = ${JSON.stringify(source.examTitle)};\nwindow.questionBank = ${JSON.stringify(candidate, null, 2)};\n`, 'utf8');
  const output = { schemaVersion: 'HS_QUADRATIC_CURRENT_SOLUTION_REPAIRS_CANDIDATE_V1', status: 'CANDIDATE_SOLUTION_REPAIRED_NO_PASS', sourcePath: SOURCE_PATH, candidatePath: 'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r4/exams/26-geumdang-solution-repairs.js', productionAuthorized: false, rows, note: 'q9 generic placeholder and q16 stale answer-conflict prose are repaired in candidate only. q17 source hold is not overwritten.' };
  fs.writeFileSync(LEDGER, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(output, null, 2));
}
main();

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const PLAN = JSON.parse(fs.readFileSync(path.join(REPORT, '36_approved_source_repair_plan_r8.json'), 'utf8'));
const R7 = JSON.parse(fs.readFileSync(path.join(REPORT, '32_full_candidate_bank_manifest_r7.json'), 'utf8'));
const OUT = path.join(ROOT, 'archive', '_generated', 'hs-quadratic-svg-upgrade-20260908', 'candidate-r8', 'exams');
const OUTPUT = path.join(REPORT, '37_candidate_source_repair_manifest_r8.json');

function load(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window)); }
function hash(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function protectedHash(q) { return hash(JSON.stringify({ id: q.id ?? null, content: q.content ?? null, choices: q.choices ?? null, answer: q.answer ?? null, image: q.image ?? null })); }
function uidFor(sourcePath, id) { return `${sourcePath}|${path.basename(sourcePath, '.js')}|${id}`; }

const repairMap = new Map([
  ['26_금당고_1학기_중간_고1_기출_c.js|13', q => { q.content = String(q.content).replace('상수이다.)', '상수이고, k\\ne0이다.)'); q.solution = '두 그래프의 교점 방정식은 $kx^2+2(k+1-a)x+k-3-b=0$이다. 단, $k=0$이면 두 그래프가 일치하므로 문제의 조건에서 제외된다. $k\\ne0$에서 한 점에서 만나려면 판별식이 0이어야 한다.\\n$D/4=(k+1-a)^2-k(k-3-b)=k(5+b-2a)+(1-a)^2$이다. 이 식이 모든 $k\\ne0$에서 0이 되려면 $a=1$, $b=-3$이다. 따라서 $a+b=-2$이고 정답은 ②이다.'; }],
  ['26_금당고_1학기_중간_고1_기출_c.js|17', q => { q.choices = [...q.choices.slice(0, 4), '없다']; q.answer = '⑤'; q.solution = '항상 $x=0,1$은 두 그래프의 교점이다. $1<a<4$이면 $x=a$에서 교점이 하나 더 생기고, $x<-1$에서는 추가 교점이 없으므로 정확히 세 교점이다. $a=4$에서는 $x=-2$와 $x=4$가 추가되어 네 교점이 되며, $a>4$에서는 교점이 더 생긴다. 따라서 정확히 세 교점을 만드는 범위는 $1<a<4$이고 이 범위에는 최댓값이 없다. 그러므로 정답은 ⑤이다.'; }],
  ['26_매산여고_1학기_중간_고1_기출_c.js|19', q => { q.answer = '④'; q.solution = '수평선 $y=t$와 $y=(x-1)^2$의 교점 수, $y=-(x-2)^2+5$의 교점 수를 비교한다. $t=0$에서는 첫 그래프와 한 점, 둘째 그래프와 두 점에서 만나므로 모두 세 점이다. $t=5$에서도 첫 그래프와 두 점, 둘째 그래프와 한 점이므로 세 점이다. $0<t<5$에서는 각각 두 점씩 만나며, 두 그래프가 겹치는 점은 $t=1$의 $(0,1)$과 $t=4$의 $(3,4)$뿐이다. 따라서 서로 다른 점이 세 개인 $t$는 $0,1,4,5$이고 그 합은 $10$이다. 따라서 정답은 ④이다.'; }],
  ['26_팔마고_1학기_중간_고1_기출_c.js|9', q => { q.answer = '①'; q.solution = '그림의 좌우 대칭을 이용해 직사각형의 오른쪽 위 x좌표를 $t$라 하자. 위쪽 포물선은 $y=-x^2/3+3$, 아래쪽 포물선은 $y=x^2-9$이므로 직사각형의 너비는 $2t$, 높이는 $(-t^2/3+3)-(t^2-9)=12-4t^2/3$이다. $0<t\\le3$에서 둘레는 $P(t)=2(2t+12-4t^2/3)=-8t^2/3+4t+24$이다. 완전제곱식으로 $P(t)=-8/3(t-3/4)^2+51/2$이므로 최댓값은 $51/2$이다. 선택지 ①이 정답이다.'; }],
  ['26_팔마고_1학기_중간_고1_기출_c.js|15', q => { q.answer = '③'; q.solution = '두 교점의 x좌표가 $-3,1$이므로 최고차항의 계수가 양수인 이차함수는 $f(x)=a(x+3)(x-1)+7$로 쓸 수 있다. 구간 $[-2,2]$에서 위로 열린 포물선의 최댓값은 오른쪽 끝점에서 생기므로 $f(2)=5a+7=22$에서 $a=3$이다. 따라서 $f(3)=3(6)(2)+7=43$이고, 선택지 ③이 정답이다.'; }],
]);

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const repairsByFile = new Map();
  for (const repair of PLAN.repairs) {
    const sourcePath = repair.questionUid.split('|')[0]; const id = Number(repair.questionUid.split('|').at(-1));
    const key = `${path.basename(sourcePath)}|${id}`;
    if (!repairMap.has(key)) throw new Error(`repair implementation missing ${key}`);
    if (!repairsByFile.has(sourcePath)) repairsByFile.set(sourcePath, []);
    repairsByFile.get(sourcePath).push({ repair, id, apply: repairMap.get(key) });
  }
  const candidateFiles = []; const repairRows = [];
  for (const file of R7.candidateFiles) {
    const sourcePath = file.sourcePath; const candidate = load(file.candidatePath); const source = load(sourcePath);
    const changes = repairsByFile.get(sourcePath) || [];
    for (const change of changes) {
      const sourceQ = source.questionBank.find(q => Number(q.id) === change.id); const candidateQ = candidate.questionBank.find(q => Number(q.id) === change.id);
      if (!sourceQ || !candidateQ) throw new Error(`source/candidate q missing ${sourcePath} q${change.id}`);
      const before = protectedHash(candidateQ); const sourceBefore = protectedHash(sourceQ);
      change.apply(candidateQ);
      const after = protectedHash(candidateQ);
      repairRows.push({ questionUid: uidFor(sourcePath, change.id), sourceJsPath: sourcePath, id: change.id, fields: change.repair.fields, sourceProtectedHashBefore: sourceBefore, candidateProtectedHashBefore: before, candidateProtectedHashAfter: after, approvedBy: PLAN.approval.approvedBy, approvalEvidence: PLAN.approval.approvalEvidence, status: 'CANDIDATE_SOURCE_REPAIR_APPLIED_NO_PASS' });
    }
    const outputName = `${String(candidateFiles.length + 1).padStart(3, '0')}-${path.basename(sourcePath)}`;
    fs.writeFileSync(path.join(OUT, outputName), `window.examTitle = ${JSON.stringify(candidate.examTitle)};\nwindow.questionBank = ${JSON.stringify(candidate.questionBank, null, 2)};\n`, 'utf8');
    candidateFiles.push({ sourcePath, candidatePath: `archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r8/exams/${outputName}`, sourceQuestionCount: source.questionBank.length, candidateQuestionCount: candidate.questionBank.length, sourceFileSha256: sha(fs.readFileSync(path.join(ROOT, sourcePath))), candidateFileSha256: sha(fs.readFileSync(path.join(OUT, outputName))) });
  }
  const output = { schemaVersion: 'HS_QUADRATIC_CANDIDATE_SOURCE_REPAIR_MANIFEST_R8', status: 'CANDIDATE_SOURCE_REPAIRS_APPLIED_NO_PASS', productionAuthorized: false, approval: PLAN.approval, scope: { targetQuestionCount: R7.scope.targetQuestionCount, candidateFileCount: candidateFiles.length, repairedQuestionCount: repairRows.length }, repairedRows: repairRows, candidateFiles, sourceHoldsBefore: 5, sourceHoldsAfterCandidateRepair: 0, note: 'The five explicit source repairs are applied to candidate-r8 only. Independent recheck, SVG re-generation, current V1/V2/V3, render and final audit remain required.' };
  fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ status: output.status, repairedQuestionCount: output.scope.repairedQuestionCount, candidateFileCount: output.scope.candidateFileCount, sourceHoldsAfterCandidateRepair: output.sourceHoldsAfterCandidateRepair }, null, 2));
}
main();

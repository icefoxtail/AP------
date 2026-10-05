import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const STAGING = path.join(REPORTS, 'staging', 'archive');
const manifest = JSON.parse(fs.readFileSync(path.join(REPORTS, 'geometry_equation_manifest.json'), 'utf8'));
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const sol = (raw) => String.raw({ raw: [raw] }).replaceAll('\\ne', '__NE_TOKEN__').replaceAll('\\n', '\n').replaceAll('__NE_TOKEN__', '\\ne').replaceAll(',quad', ',\\quad');

const repairs = new Map([
  ['original/high/h1/1final/23_강남여고_1학기_기말_고1_기출.js_17', sol('직사각형을 좌표평면에 놓아 $A=(0,10)$, $D=(6,10)$, $B=(0,0)$, $C=(6,0)$으로 두자. 출발점 $S$는 $AD$의 중점이므로 $S=(3,10)$이다.\n\n$CD=AB=10$이고 $CT:TD=1:4$이므로 $CT=2$이다. 따라서 도착점은 $T=(6,2)$이다.\n\n경로가 $AB$, $BC$를 차례로 지나므로 두 변을 차례로 펼친다. $AB$를 기준으로 반사하면 $T$는 $T_1=(-6,2)$로 옮겨지고, 이어서 $BC$를 기준으로 반사하면 $T_1$은 $T_2=(-6,-2)$로 옮겨진다. 반사는 거리를 보존하므로, 원래의 꺾인 경로의 길이는 펼친 그림에서 $S$와 $T_2$를 잇는 꺾인 경로의 길이와 같다.\n\n따라서 삼각부등식에 의해 최단 경로는 $S$와 $T_2$를 잇는 선분이다. 이 선분은 $x=0$과 만나는 점의 $y$좌표가 $6$이므로 $AB$를 통과하고, $y=0$과 만나는 점의 $x$좌표가 $-\dfrac92$이므로 펼쳐진 뒤의 $BC$도 통과한다. 따라서 주어진 통과 순서를 만족한다.\n\n두 점의 가로 차이와 세로 차이는 각각 $|3-(-6)|=9$, $|10-(-2)|=12$이므로 최단거리는\n$\sqrt{9^2+12^2}=\sqrt{225}=15$이다.\n\n따라서 정답은 ⑤이다.')],
  ['original/high/h1/2mid/21_복성고_2학기_중간_고1_기출.js_18', sol('삼각형 $OAB$에서\n$OA=3\sqrt2$, $OB=4$, $AB=\sqrt{(4-3)^2+(0-3)^2}=\sqrt{10}$이다. 세 변 위의 점을\n$D=(4-s,3s)$ $(0\le s\le1)$, $E=(u,u)$ $(0\le u\le3)$, $F=(v,0)$ $(0\le v\le4)$로 나타내자.\n\n먼저 다음 세 거리 부등식을 확인하자. 임의의 실수 $p,q$에 대하여\n$\sqrt{p^2+q^2}\ge\dfrac{-2p+q}{\sqrt5}$인데, 이는\n$5(p^2+q^2)-(-2p+q)^2=(p+2q)^2\ge0$\n에서 따른다. 같은 방식으로\n$\sqrt{p^2+q^2}\ge\dfrac{p-2q}{\sqrt5}$,\quad $5(p^2+q^2)-(p-2q)^2=(2p+q)^2\ge0$,\n$\sqrt{p^2+q^2}\ge\dfrac{p+2q}{\sqrt5}$,\quad $5(p^2+q^2)-(p+2q)^2=(2p-q)^2\ge0$\n도 성립한다.\n\n$DE$에서 $p=u-4+s$, $q=u-3s$로 두면\n$DE\ge\dfrac{-2(u-4+s)+(u-3s)}{\sqrt5}=\dfrac{8-5s-u}{\sqrt5}$이다.\n\n$EF$에서 $p=v-u$, $q=-u$로 두면\n$EF\ge\dfrac{(v-u)-2(-u)}{\sqrt5}=\dfrac{v+u}{\sqrt5}$이다.\n\n$FD$에서 $p=4-s-v$, $q=3s$로 두면\n$FD\ge\dfrac{(4-s-v)+2(3s)}{\sqrt5}=\dfrac{4+5s-v}{\sqrt5}$이다.\n\n세 부등식을 더하면 $s,u,v$가 모두 소거되어\n$DE+EF+FD\ge\dfrac{12}{\sqrt5}=\dfrac{12\sqrt5}{5}$를 얻는다.\n\n이 하한이 실제로 달성되는지 확인하자.\n$D=\left(\dfrac{18}{5},\dfrac65\right)$, $E=(2,2)$, $F=(3,0)$으로 잡으면 각각 $s=\dfrac25$, $u=2$, $v=3$이고, 세 거리 부등식에서 동시에 등호가 성립한다. 실제로\n$DE=\dfrac{4\sqrt5}{5}$,\quad EF=\sqrt5,\quad FD=\dfrac{3\sqrt5}{5}$이다.\n\n따라서 최소 둘레는\n$\dfrac{4\sqrt5}{5}+\sqrt5+\dfrac{3\sqrt5}{5}=\dfrac{12\sqrt5}{5}$이다. 문제에서 이를 $\dfrac{a}{b}\sqrt5$로 나타냈으므로 $a=12$, $b=5$이고,\n$a-b=12-5=7$이다. 따라서 정답은 ④이다.')]
]);

function readBank(filePath) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath });
  return context.window.questionBank || [];
}

function locateObject(text, id) {
  const marker = new RegExp(`\\n[ \\t]*\\{\\r?\\n[ \\t]*"id":\\s*${id},`);
  const found = marker.exec(text);
  if (!found) throw new Error(`Question object not found: ${id}`);
  const start = found.index + 1;
  let depth = 0; let quoted = false; let escaped = false;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) { if (escaped) escaped = false; else if (ch === '\\') escaped = true; else if (ch === '"') quoted = false; continue; }
    if (ch === '"') { quoted = true; continue; }
    if (ch === '{') depth += 1;
    else if (ch === '}') { depth -= 1; if (depth === 0) return { start, end: i + 1 }; }
  }
  throw new Error(`Question object closing brace not found: ${id}`);
}

function replaceSolution(text, id, nextSolution) {
  const object = locateObject(text, id);
  const block = text.slice(object.start, object.end);
  const pattern = /(^[ \t]*"solution"\s*:\s*)("(?:\\.|[^"\\])*")/m;
  const found = pattern.exec(block);
  if (!found) throw new Error(`Solution property not found: ${id}`);
  const previous = JSON.parse(found[2]);
  const replacement = `${found[1]}${JSON.stringify(nextSolution)}`;
  const nextBlock = block.slice(0, found.index) + replacement + block.slice(found.index + found[0].length);
  return { text: text.slice(0, object.start) + nextBlock + text.slice(object.end), previous };
}

const manifestByKey = new Map(manifest.rows.map((row) => [row.qKey, row]));
const ledger = [];
const touched = new Map();
for (const [qKey, nextSolution] of repairs) {
  const row = manifestByKey.get(qKey);
  if (!row) throw new Error(`Repair qKey not in frozen manifest: ${qKey}`);
  const filePath = path.join(STAGING, 'exams', row.sourceJsPath.replaceAll('/', path.sep));
  const beforeFile = fs.readFileSync(filePath, 'utf8');
  const current = touched.get(filePath) || beforeFile;
  const question = readBank(filePath).find((item) => item.id === row.id);
  if (!question || question.answer !== (row.answer || question.answer)) throw new Error(`Protected answer identity mismatch: ${qKey}`);
  const result = replaceSolution(current, row.id, nextSolution);
  touched.set(filePath, result.text);
  ledger.push({ questionUid: row.questionUid, qKey, sourceJsPath: row.sourceJsPath, id: row.id, field: 'solution', beforeHash: sha(result.previous), afterHash: sha(nextSolution), reasonCode: 'A_FINAL_RECHECK_STUDENT_REPRODUCIBILITY', protectedFieldsTouched: [] });
}

for (const [filePath, text] of touched) {
  new vm.Script(text, { filename: filePath });
  fs.writeFileSync(filePath, text, 'utf8');
}
fs.writeFileSync(path.join(REPORTS, 'solution_only_final_repair.json'), JSON.stringify({ status: 'A_REPAIR_APPLIED_TO_STAGING_ONLY', repairedQuestionCount: repairs.size, changedSourceFileCount: touched.size, ledger }, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: 'A_REPAIR_APPLIED_TO_STAGING_ONLY', repairedQuestionCount: repairs.size, changedSourceFileCount: touched.size }, null, 2));

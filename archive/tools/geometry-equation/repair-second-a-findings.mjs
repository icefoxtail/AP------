import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const STAGING = path.join(REPORTS, 'staging', 'archive');
const sol = (raw) => String.raw({ raw: [raw] }).replaceAll('\\n', '\n').replaceAll('\\ne', '__NE_TOKEN__').replaceAll('__NE_TOKEN__', '\\ne');
const fixes = new Map([
  ['original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js_20', sol('삼각형 $AOB$의 넓이는 $\\dfrac12\\cdot6\\cdot4=12$이므로 이등분되어야 하는 넓이는 $6$이다.\n\n직선 $y=-2x+k$와 변 $OB$($y=0$)의 교점을 $R$, 변 $OA$($y=\\dfrac45x$)의 교점을 $S$라 하자.\n$R=(\\dfrac{k}{2},0)$이고, $S=\\left(\\dfrac{5k}{14},\\dfrac{2k}{7}\\right)$이다.\n\n첫째, $0<k<12$이면 $R$, $S$가 각각 선분 $OB$, $OA$ 위에 있다. 이때 원점 쪽 작은 삼각형의 넓이는\n$[ORS]=\\dfrac12\\cdot\\dfrac{k}{2}\\cdot\\dfrac{2k}{7}=\\dfrac{k^2}{14}$이다.\n이를 $6$과 같게 두면 $k^2=84$이고, 이 구간에서 $k=2\\sqrt{21}$이다. 실제로 $0<2\\sqrt{21}<12$이다.\n\n둘째, $12\\le k<14$이면 직선은 $OA$와 $AB$를 자른다. 이때 $A$ 쪽에 생기는 작은 삼각형의 넓이는\n$\\dfrac{3(14-k)^2}{7}$이고, 최대값은 $k=12$일 때의 $\\dfrac{12}{7}$이다. 따라서 이 구간에서 원점 쪽 넓이는 $12-\\dfrac{3(14-k)^2}{7}>6$이므로 넓이를 이등분할 수 없다.\n\n셋째, $k\\le0$이면 직선은 삼각형의 내부를 가르지 못하고, $k\\ge14$이면 원점 쪽 넓이가 삼각형 전체 넓이 $12$가 되어 역시 이등분 조건을 만족하지 않는다.\n\n따라서 조건을 만족하는 값은 $k=2\\sqrt{21}$이다.')],
  ['original/high/h1/1final/23_복성고_1학기_기말_고1_기출.js_15', sol('겹쳐진 부분을 그림의 삼각형으로 보고, 그 삼각형의 밑변 양 끝을 $U,V$라 하자. 밑변의 길이를 $UV=d$로 정의한다.\n\n종이를 대각선으로 접으면 접힌 선을 기준으로 서로 포개지는 선분은 합동이므로, 밑변 $UV$에 대응하는 접힌 선분의 길이도 $d$이다. 이 대응 선분과 직사각형의 변이 이루는 직각삼각형에서 한 변은 세로 길이 $a$, 다른 변은 가로로 남은 길이 $4-d$, 빗변은 $d$이다.\n\n따라서 피타고라스 정리에 의해\n$d^2=a^2+(4-d)^2$이다. 정리하면\n$d=\\dfrac{a^2+16}{8}$이다.\n\n겹친 삼각형의 높이는 직사각형의 세로 길이와 같으므로 $a$이고, 밑변은 $d$이다. 겹친 넓이가 $\\dfrac52$이므로\n$\\dfrac12ad=\\dfrac52$이다. 위의 $d$를 대입하면\n$a(a^2+16)=40$, 즉 $a^3+16a-40=0$이다.\n\n$a=2$를 대입하면 식을 만족하고,\n$a^3+16a-40=(a-2)(a^2+2a+20)$이다. 그런데 $a^2+2a+20=(a+1)^2+19>0$이므로 실수해는 $a=2$뿐이다. $0<a<4$도 만족하므로 정답은 ③이다.')],
]);

function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function locate(text, id) {
  const found = new RegExp(`\\n[ \\t]*\\{\\r?\\n[ \\t]*"id":\\s*${id},`).exec(text);
  if (!found) throw new Error(`Question object not found: ${id}`);
  const start = found.index + 1; let depth = 0; let quote = false; let escaped = false;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (quote) { if (escaped) escaped = false; else if (ch === '\\') escaped = true; else if (ch === '"') quote = false; continue; }
    if (ch === '"') { quote = true; continue; }
    if (ch === '{') depth += 1;
    else if (ch === '}') { depth -= 1; if (depth === 0) return { start, end: i + 1 }; }
  }
  throw new Error(`Question object not closed: ${id}`);
}
function replaceSolution(text, id, nextSolution) {
  const object = locate(text, id); const block = text.slice(object.start, object.end);
  const property = /(^[ \t]*"solution"\s*:\s*)("(?:\\.|[^"\\])*")/m.exec(block);
  if (!property) throw new Error(`Solution property not found: ${id}`);
  const previous = JSON.parse(property[2]);
  const replacement = `${property[1]}${JSON.stringify(nextSolution)}`;
  return { text: text.slice(0, object.start) + block.slice(0, property.index) + replacement + block.slice(property.index + property[0].length) + text.slice(object.end), previous };
}

const manifest = JSON.parse(fs.readFileSync(path.join(REPORTS, 'geometry_equation_manifest.json'), 'utf8'));
const byFile = new Map(); const ledger = [];
for (const [qKey, nextSolution] of fixes) {
  const row = manifest.rows.find((candidate) => candidate.qKey === qKey);
  if (!row) throw new Error(`qKey not in manifest: ${qKey}`);
  const filePath = path.join(STAGING, 'exams', row.sourceJsPath.replaceAll('/', path.sep));
  const before = byFile.get(filePath) || fs.readFileSync(filePath, 'utf8');
  const result = replaceSolution(before, row.id, nextSolution);
  byFile.set(filePath, result.text);
  ledger.push({ questionUid: row.questionUid, qKey, sourceJsPath: row.sourceJsPath, id: row.id, field: 'solution', beforeHash: sha(result.previous), afterHash: sha(nextSolution), reasonCode: 'A_RECHECK_REPAIR_SOLUTION_LOGIC', artifactShaBefore: sha(before), artifactShaAfter: sha(result.text) });
}
for (const [filePath, content] of byFile) { new vm.Script(content, { filename: filePath }); fs.writeFileSync(filePath, content, 'utf8'); }
fs.writeFileSync(path.join(REPORTS, 'repair_second_a_findings.json'), JSON.stringify({ status: 'STAGING_REPAIR_APPLIED', repairedQuestionCount: fixes.size, ledger }, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: 'STAGING_REPAIR_APPLIED', repairedQuestionCount: fixes.size, changedSourceFileCount: byFile.size }, null, 2));

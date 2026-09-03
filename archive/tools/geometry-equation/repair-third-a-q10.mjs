import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const STAGING = path.join(REPORTS, 'staging', 'archive');
const qKey = 'original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js_20';
const nextSolution = String.raw({ raw: ['삼각형 $AOB$의 넓이는 $\\dfrac12\\cdot6\\cdot4=12$이므로 이등분되어야 하는 넓이는 $6$이다.\n\n직선 $y=-2x+k$와 변 $OB$($y=0$)의 교점을 $R$, 변 $OA$($y=\\dfrac45x$)의 교점을 $S$라 하자.\n$R=(\\dfrac{k}{2},0)$이고, $S=\\left(\\dfrac{5k}{14},\\dfrac{2k}{7}\\right)$이다.\n\n첫째, $0<k<12$이면 $R$, $S$가 각각 선분 $OB$, $OA$ 위에 있다. 이때 원점 쪽 삼각형의 넓이는\n$[ORS]=\\dfrac12\\cdot\\dfrac{k}{2}\\cdot\\dfrac{2k}{7}=\\dfrac{k^2}{14}$이다.\n따라서 $\\dfrac{k^2}{14}=6$에서 $k=2\\sqrt{21}$이고, 실제로 $0<2\\sqrt{21}<12$이다.\n\n둘째, $12\\le k<14$이면 직선은 $OA$와 $AB$를 자른다. $S$는 그대로 $OA$와의 교점이고, $T$를 $AB$와의 교점이라 하자. 변 $AB$의 방정식은 $y=-4x+24$이므로\n$T=\\left(\\dfrac{24-k}{2},2k-24\\right)$이다.\n$A=(5,4)$에서 $S$, $T$로 향하는 두 벡터는\n$\\overrightarrow{AS}=(14-k)\\left(\\dfrac5{14},\\dfrac27\\right)$,\quad $\\overrightarrow{AT}=(14-k)\\left(-\\dfrac12,2\\right)$이다.\n두 벡터의 행렬식의 절댓값은 $\\dfrac67(14-k)^2$이므로, $A$ 쪽 삼각형의 넓이는\n$[AST]=\\dfrac12\\cdot\\dfrac67(14-k)^2=\\dfrac37(14-k)^2$이다.\n$12\\le k<14$에서 이 값은 $\\dfrac{12}{7}$ 이하이므로 원점 쪽 넓이는 $12-[AST]>6$이다.\n\n셋째, $k\\le0$이면 직선은 삼각형 내부를 가르지 못하고, $k\\ge14$이면 원점 쪽 넓이가 삼각형 전체 넓이 $12$가 되어 이등분 조건을 만족하지 않는다.\n\n따라서 조건을 만족하는 값은 $k=2\\sqrt{21}$이다.'] }).replaceAll('\\n', '\n').replaceAll('\\ne', '__NE_TOKEN__').replaceAll('__NE_TOKEN__', '\\ne').replaceAll(',quad', ',\\quad');

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
const manifest = JSON.parse(fs.readFileSync(path.join(REPORTS, 'geometry_equation_manifest.json'), 'utf8'));
const row = manifest.rows.find((candidate) => candidate.qKey === qKey);
if (!row) throw new Error(`qKey not found: ${qKey}`);
const filePath = path.join(STAGING, 'exams', row.sourceJsPath.replaceAll('/', path.sep));
const before = fs.readFileSync(filePath, 'utf8'); const object = locate(before, row.id); const block = before.slice(object.start, object.end);
const property = /(^[ \t]*"solution"\s*:\s*)("(?:\\.|[^"\\])*")/m.exec(block);
if (!property) throw new Error('solution property not found');
const previous = JSON.parse(property[2]);
const replacement = `${property[1]}${JSON.stringify(nextSolution)}`;
const after = before.slice(0, object.start) + block.slice(0, property.index) + replacement + block.slice(property.index + property[0].length) + before.slice(object.end);
new vm.Script(after, { filename: filePath });
fs.writeFileSync(filePath, after, 'utf8');
fs.writeFileSync(path.join(REPORTS, 'repair_third_a_q10.json'), JSON.stringify({ status: 'STAGING_REPAIR_APPLIED', questionUid: row.questionUid, field: 'solution', beforeHash: sha(previous), afterHash: sha(nextSolution), fileShaBefore: sha(before), fileShaAfter: sha(after) }, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: 'STAGING_REPAIR_APPLIED', questionUid: row.questionUid, beforeHash: sha(previous), afterHash: sha(nextSolution), fileShaAfter: sha(after) }, null, 2));

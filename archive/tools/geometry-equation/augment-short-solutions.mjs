import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const STAGING = path.join(REPORTS, 'staging', 'archive');
const additions = new Map([
  ['original/high/h1/1final/23_강남여고_1학기_기말_고1_기출.js_4', '무게중심은 세 좌표의 평균이므로 두 좌표를 따로 평균 내어 얻은 값을 각각 $a$, $b$로 읽으면 된다.'],
  ['original/high/h1/1final/23_금당고_1학기_기말_고1_기출.js_3', '점이 직선 위에 있다는 조건을 점-기울기형에 반영했으므로 계산한 식은 주어진 점과 기울기를 모두 만족한다.'],
  ['original/high/h1/1final/23_금당고_1학기_기말_고1_기출.js_5', '구한 직선에 점 $(1,1)$을 대입하면 $1=2-1$이 되어 점을 실제로 지나가는 것도 확인된다.'],
  ['original/high/h1/1final/24_금당고_1학기_기말_고1_기출.js_3', '중점은 두 끝점에서 같은 거리에 있는 점이므로 각 좌표의 평균을 취하는 중점 공식을 사용한다.'],
  ['original/high/h1/1final/24_금당고_1학기_기말_고1_기출.js_4', '점의 좌표를 직선의 식에 대입하는 것은 그 점이 직선 위에 있다는 조건을 식으로 바꾸는 과정이다. 또한 계산한 $k$를 다시 식에 넣으면 $2=12-10$이 되어 조건을 만족한다.'],
  ['original/high/h1/1final/24_금당고_1학기_기말_고1_기출.js_6', '수직인 직선의 기울기는 주어진 기울기의 음의 역수이므로 부호와 분모를 함께 바꾸어 계산한다. 따라서 기울기의 값은 하나로 결정된다.'],
  ['original/high/h1/2mid/21_복성고_2학기_중간_고1_기출.js_4', '원점에서 같은 거리에 있는 두 점은 좌표의 부호만 서로 반대가 되므로 이 변환 규칙을 적용한다. 실제로 두 점은 원점에서 같은 거리에 있다. 따라서 원점 대칭의 결과는 보기 ⑤와 일치한다.'],
  ['original/high/h1/2mid/23_매산여고_2학기_중간_고1_기출.js_11', '이동량이 음수이면 해당 좌표를 그만큼 빼는 것이므로 $y$좌표에서는 $4+(-3)=1$이 된다. 따라서 두 좌표를 각각 계산해야 한다.'],
  ['original/high/h1/2mid/23_팔마고_2학기_중간_고1_기출.js_3', '평행이동 식의 두 좌표를 각각 비교하면 이동량과 도착 좌표가 빠짐없이 결정된다.'],
  ['original/high/h1/2mid/25_금당고_2학기_중간_고1_기출.js_2', '평행한 직선의 기울기를 먼저 고정한 뒤 주어진 점을 대입하면 절편이 하나로 정해진다.'],
  ['original/high/h1/2mid/25_매산고_2학기_중간_고1_기출.js_16', '거리 공식에서 두 좌표의 차이를 제곱하므로 어느 순서로 빼더라도 같은 길이를 얻는다.'],
  ['original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js_2', '이동벡터는 모든 점에 동일하게 적용되므로 기준점에서 구한 벡터를 목표점에도 그대로 더한다.'],
]);

function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function locateObject(text, id) {
  const found = new RegExp(`\\n[ \\t]*\\{\\r?\\n[ \\t]*"id":\\s*${id},`).exec(text);
  if (!found) throw new Error(`Question object not found: ${id}`);
  const start = found.index + 1; let depth = 0; let quoted = false; let escaped = false;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) { if (escaped) escaped = false; else if (ch === '\\') escaped = true; else if (ch === '"') quoted = false; continue; }
    if (ch === '"') { quoted = true; continue; }
    if (ch === '{') depth += 1;
    else if (ch === '}') { depth -= 1; if (depth === 0) return { start, end: i + 1 }; }
  }
  throw new Error(`Question object not closed: ${id}`);
}
function appendSolution(text, id, addition) {
  const object = locateObject(text, id);
  const block = text.slice(object.start, object.end);
  const pattern = /(^[ \t]*"solution"\s*:\s*)("(?:\\.|[^"\\])*")/m;
  const found = pattern.exec(block);
  if (!found) throw new Error(`Solution property not found: ${id}`);
  const previous = JSON.parse(found[2]);
  if (previous.includes(addition)) return { text, previous, changed: false };
  const next = `${previous}\n${addition}`;
  const replacement = `${found[1]}${JSON.stringify(next)}`;
  return { text: text.slice(0, object.start) + block.slice(0, found.index) + replacement + block.slice(found.index + found[0].length) + text.slice(object.end), previous, changed: true };
}

const manifest = JSON.parse(fs.readFileSync(path.join(REPORTS, 'geometry_equation_manifest.json'), 'utf8'));
const byFile = new Map(); const ledger = [];
for (const [qKey, addition] of additions) {
  const row = manifest.rows.find((candidate) => candidate.qKey === qKey);
  if (!row) throw new Error(`qKey not found: ${qKey}`);
  const filePath = path.join(STAGING, 'exams', row.sourceJsPath.replaceAll('/', path.sep));
  const current = byFile.get(filePath) || fs.readFileSync(filePath, 'utf8');
  const result = appendSolution(current, row.id, addition);
  byFile.set(filePath, result.text);
  ledger.push({ questionUid: row.questionUid, qKey, field: 'solution', beforeHash: sha(result.previous), afterHash: sha(result.changed ? result.previous + '\n' + addition : result.previous), reasonCode: 'STUDENT_REPRODUCIBILITY_EXPLANATORY_SENTENCE', changed: result.changed });
}
for (const [filePath, text] of byFile) { new vm.Script(text, { filename: filePath }); fs.writeFileSync(filePath, text, 'utf8'); }
fs.writeFileSync(path.join(REPORTS, 'solution_short_explanation_ledger.json'), JSON.stringify({ status: 'STAGING_SOLUTION_EXPLANATIONS_ADDED', count: ledger.filter((row) => row.changed).length, ledger }, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: 'STAGING_SOLUTION_EXPLANATIONS_ADDED', count: ledger.filter((row) => row.changed).length }, null, 2));

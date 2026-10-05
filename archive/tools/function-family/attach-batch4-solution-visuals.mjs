import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');

const PATCHES = [
  ['original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js', 9, 'assets/images/25_금당고_2학기_기말_고1_기출/q09-solution.svg', '유리함수의 점근선과 주어진 점을 나타낸 해설 그래프', '점근선 x=1, y=−4와 점 (0,4)를 확인하여 k=−8을 구한다.'],
  ['original/high/h1/2final/25_팔마고_2학기_기말_고1_기출.js', 14, 'assets/images/25_팔마고_2학기_기말_고1_기출/q14-solution.svg', '함수 y=1/x의 두 가지 그래프와 좌표축을 나타낸 해설 그래프', 'y=1/x는 자기 자신이 역함수이고 제1·3사분면을 지나며 좌표축은 점근선이다.'],
  ['original/high/h1/2final/24_매산여고_2학기_기말_고1_기출.js', 3, 'assets/images/24_매산여고_2학기_기말_고1_기출/q03-solution.svg', '평행이동된 유리함수의 점근선과 그래프를 나타낸 해설 그래프', 'y=2+7/(x−1)로 고쳐 y=7/x에서 (1,2)만큼 이동했음을 확인한다.'],
  ['original/high/h1/2final/24_매산여고_2학기_기말_고1_기출.js', 5, 'assets/images/24_매산여고_2학기_기말_고1_기출/q05-solution.svg', '유리함수의 점근선과 중심을 나타낸 해설 그래프', 'y=−3+5/(x+1)에서 점근선 x=−1, y=−3과 중심을 확인한다.'],
  ['original/high/h1/2final/24_매산여고_2학기_기말_고1_기출.js', 7, 'assets/images/24_매산여고_2학기_기말_고1_기출/q07-solution.svg', '절댓값 유리함수와 수평선의 교점 개수를 나타낸 해설 그래프', 'k=1,2,3 수평선과의 교점 수를 비교하여 N(1),N(2),N(3)을 확인한다.'],
  ['original/high/h1/2final/23_강남여고_2학기_기말_고1_기출.js', 6, 'assets/images/23_강남여고_2학기_기말_고1_기출/q06-solution.svg', '평행이동한 무리함수의 끝점·절편·사분면을 나타낸 해설 그래프', '끝점 (2,3), x절편 (13/2,0), 정의역과 치역을 함께 확인한다.'],
  ['original/high/h1/2final/23_금당고_2학기_기말_고1_기출.js', 20, 'assets/images/23_금당고_2학기_기말_고1_기출/q20-solution.svg', '무리함수와 세 평행 직선의 교점 개수를 나타낸 해설 그래프', 'k=2,3,4에서 각각 1,2,0개의 교점이 생기는 구조를 확인한다.'],
  ['original/high/h1/2final/24_금당고_2학기_기말_고1_기출.js', 18, 'assets/images/24_금당고_2학기_기말_고1_기출/q18-solution.svg', '유리함수와 무리함수의 교점 조건을 나타낸 해설 그래프', '유리함수와 y=√x의 한 교점을 표시하고 k≤−1과 k>−1의 차이를 확인한다.'],
  ['original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js', 15, 'assets/images/25_금당고_2학기_기말_고1_기출/q15-solution.svg', '함수와 역함수의 그래프, y=x, 두 교점을 나타낸 해설 그래프', '증가함수와 역함수의 공통점 P=(6,6), Q=(7,7)을 확인한다.'],
  ['original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js', 14, 'assets/images/25_제일고_2학기_기말_고1_기출/q14-solution.svg', '두 유리함수의 점근선과 직사각형 넓이를 나타낸 해설 그래프', 'k=4일 때 점근선 x=1,4와 y=0,4가 만드는 넓이 12를 확인한다.'],
].map(([sourceJsPath, id, assetRef, alt, caption]) => ({ sourceJsPath, id, assetRef, alt, caption }));

function loadBank(relativePath) {
  const filePath = path.join(ARCHIVE, 'exams', relativePath.replaceAll('/', path.sep));
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 5000 });
  return context.window.questionBank || [];
}

function locate(text, id) {
  const found = new RegExp('\\n[ \\t]*\\{\\r?\\n[ \\t]*"id":\\s*' + id + ',').exec(text);
  if (!found) throw new Error(`question object not found: id=${id}`);
  const start = found.index + 1;
  let depth = 0; let quoted = false; let escaped = false;
  for (let index = start; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === '"') quoted = false;
      continue;
    }
    if (character === '"') quoted = true;
    else if (character === '{') depth += 1;
    else if (character === '}') {
      depth -= 1;
      if (depth === 0) return { start, end: index + 1 };
    }
  }
  throw new Error(`question object closing brace not found: id=${id}`);
}

function attach(text, patch) {
  const object = locate(text, patch.id);
  const block = text.slice(object.start, object.end);
  if (/"solutionImage"\s*:/.test(block)) throw new Error(`solutionImage already exists: ${patch.sourceJsPath} q${patch.id}`);
  const solutionLine = /^(\s*)"solution"\s*:\s*.*(?:\r?\n|$)/m.exec(block);
  if (!solutionLine) throw new Error(`solution field not found: ${patch.sourceJsPath} q${patch.id}`);
  const indent = solutionLine[1];
  const fields = [['solutionImage', patch.assetRef], ['solutionImageAlt', patch.alt], ['solutionImageCaption', patch.caption], ['solutionImageSize', 'full']]
    .map(([key, value]) => `${indent}${JSON.stringify(key)}: ${JSON.stringify(value)},`).join('\n') + '\n';
  const insertAt = object.start + solutionLine.index + solutionLine[0].length;
  return text.slice(0, insertAt) + fields + text.slice(insertAt);
}

function protectedHash(question) {
  return sha(JSON.stringify({ id: question.id ?? null, content: question.content ?? null, choices: question.choices ?? null, answer: question.answer ?? null, image: question.image ?? null }));
}

function sha(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function main() {
  const ledger = [];
  for (const patch of PATCHES) {
    const filePath = path.join(ARCHIVE, 'exams', patch.sourceJsPath.replaceAll('/', path.sep));
    const beforeText = fs.readFileSync(filePath, 'utf8');
    const beforeQuestion = loadBank(patch.sourceJsPath).find((question) => Number(question.id) === patch.id);
    if (!beforeQuestion) throw new Error(`question missing: ${patch.sourceJsPath} q${patch.id}`);
    if (beforeQuestion.solutionImage) throw new Error(`refusing to overwrite existing solutionImage: ${patch.sourceJsPath} q${patch.id}`);
    const beforeProtectedHash = protectedHash(beforeQuestion);
    const afterText = attach(beforeText, patch);
    const temporary = `${filePath}.function-family.tmp`;
    fs.writeFileSync(temporary, afterText, 'utf8');
    fs.renameSync(temporary, filePath);
    const afterQuestion = loadBank(patch.sourceJsPath).find((question) => Number(question.id) === patch.id);
    const afterProtectedHash = protectedHash(afterQuestion);
    if (beforeProtectedHash !== afterProtectedHash) throw new Error(`protected payload changed: ${patch.sourceJsPath} q${patch.id}`);
    ledger.push({ qKey: `${patch.sourceJsPath}_${patch.id}`, sourceJsPath: patch.sourceJsPath, id: patch.id, field: 'solutionImage|solutionImageAlt|solutionImageCaption|solutionImageSize', assetRef: patch.assetRef, beforeProtectedHash, afterProtectedHash, status: 'ATTACHED' });
  }
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const report = { reportType: 'FUNCTION_FAMILY_BATCH4_SOLUTION_VISUAL_ATTACHMENT', generatedAt: new Date().toISOString(), status: 'PASS', changedQuestionCount: ledger.length, protectedPayloadParity: ledger.every((row) => row.beforeProtectedHash === row.afterProtectedHash), ledger };
  fs.writeFileSync(path.join(REPORT_DIR, 'function_family_batch4_attachment_ledger.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main();

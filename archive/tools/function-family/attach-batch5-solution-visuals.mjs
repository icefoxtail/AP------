import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');

const PATCHES = [
  ['original/high/h1/2final/25_효천고_2학기_기말_고1_기출.js', 8, 'assets/images/25_효천고_2학기_기말_고1_기출/q08-solution.svg', '무리함수의 끝점·정의역·치역·사분면을 나타낸 해설 그래프', '끝점 (2,4)와 x절편 (−14,0)을 기준으로 제4사분면을 지나지 않음을 확인한다.'],
  ['original/high/h1/2final/25_효천고_2학기_기말_고1_기출.js', 11, 'assets/images/25_효천고_2학기_기말_고1_기출/q11-solution.svg', '무리함수와 역함수의 그래프 및 교점 A를 나타낸 해설 그래프', '최솟값으로 b=2, 교점 A=(3,3)으로부터 a=−5를 확인한다.'],
  ['original/high/h1/2final/25_팔마고_2학기_기말_고1_기출.js', 11, 'assets/images/25_팔마고_2학기_기말_고1_기출/q11-solution.svg', '함수와 역함수의 접점 및 y=x를 나타낸 해설 그래프', 'f(x)=x의 중근 (7/2,7/2)을 표시하여 두 그래프의 접점을 확인한다.'],
  ['original/high/h1/2final/21_복성고_2학기_기말_고1_기출.js', 3, 'assets/images/21_복성고_2학기_기말_고1_기출/q03-solution.svg', '유리함수의 두 점근선을 나타낸 해설 그래프', '점근선 x=3/2, y=−2를 읽어 ab=−3을 확인한다.'],
  ['original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js', 3, 'assets/images/21_강남여고_2학기_기말_고1_기출/q03-solution.svg', '유리함수의 중심과 두 점근선을 나타낸 해설 그래프', '점근선 x=1, y=2의 교점 (1,2)를 표시한다.'],
  ['original/high/h1/2final/21_순천고_2학기_기말_고1_기출.js', 8, 'assets/images/21_순천고_2학기_기말_고1_기출/q08-solution.svg', '무리함수와 직선의 두 교점을 나타낸 해설 그래프', '2≤k<5/2에서 두 교점이 생기는 영역을 표시한다.'],
  ['original/high/h1/2final/21_순천고_2학기_기말_고1_기출.js', 11, 'assets/images/21_순천고_2학기_기말_고1_기출/q11-solution.svg', '함수와 역함수의 두 고정점을 나타낸 해설 그래프', '교점 (3,3), (4,4)와 y=x를 표시하여 거리를 확인한다.'],
  ['original/high/h1/2final/21_금당고_2학기_기말_고1_기출.js', 8, 'assets/images/21_금당고_2학기_기말_고1_기출/q08-solution.svg', '함수와 역함수의 교점 P를 나타낸 해설 그래프', '정의역 x≥3에서 교점 P=(5,5)와 OP=5√2를 확인한다.'],
  ['original/high/h1/2final/21_금당고_2학기_기말_고1_기출.js', 4, 'assets/images/21_금당고_2학기_기말_고1_기출/q04-solution.svg', '평행이동한 무리함수의 끝점을 나타낸 해설 그래프', 'y=√(2−2x)+4의 끝점 (1,4)와 이동량을 확인한다.'],
  ['original/high/h1/2final/21_팔마고_2학기_기말_고1_기출.js', 5, 'assets/images/21_팔마고_2학기_기말_고1_기출/q05-solution.svg', '유리함수와 역함수의 점근선 이동을 나타낸 해설 그래프', 'f와 f⁻¹의 점근선을 비교하여 오른쪽 1, 아래 1 이동을 확인한다.'],
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
  return crypto.createHash('sha256').update(JSON.stringify({ id: question.id ?? null, content: question.content ?? null, choices: question.choices ?? null, answer: question.answer ?? null, image: question.image ?? null })).digest('hex');
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
  const report = { reportType: 'FUNCTION_FAMILY_BATCH5_SOLUTION_VISUAL_ATTACHMENT', generatedAt: new Date().toISOString(), status: 'PASS', changedQuestionCount: ledger.length, protectedPayloadParity: ledger.every((row) => row.beforeProtectedHash === row.afterProtectedHash), ledger };
  fs.writeFileSync(path.join(REPORT_DIR, 'function_family_batch5_attachment_ledger.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main();

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');

const PATCHES = [
  ['original/high/h1/2final/24_금당고_2학기_기말_고1_기출.js', 10, 'assets/images/24_금당고_2학기_기말_고1_기출/q10-solution.svg', '무리함수와 직선의 두 교점을 나타낸 해설 그래프', 'k=−1.4인 직선과 무리함수의 두 교점을 표시하고 −3/2<k≤−1 범위의 경계를 확인한다.'],
  ['original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js', 22, 'assets/images/25_금당고_2학기_기말_고1_기출/q22-solution.svg', '무리함수와 직선의 두 교점을 나타낸 해설 그래프', '두 비음수 근이 생기는 구간에서 −2≤k<−7/4 조건을 그래프와 함께 확인한다.'],
  ['original/high/h1/2final/25_팔마고_2학기_기말_고1_기출.js', 23, 'assets/images/25_팔마고_2학기_기말_고1_기출/q23-solution.svg', '무리함수와 직선의 두 교점을 나타낸 해설 그래프', '무리함수의 정의역과 직선의 교점 두 개를 표시하여 1/3≤k<11/6 범위를 확인한다.'],
  ['original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js', 20, 'assets/images/25_제일고_2학기_기말_고1_기출/q20-solution.svg', '함수와 역함수의 그래프 및 교점 A를 나타낸 해설 그래프', '함수와 역함수는 y=x에 대하여 대칭이고 교점은 A=(2,2)임을 확인한다.'],
  ['original/high/h1/2final/24_금당고_2학기_기말_고1_기출.js', 11, 'assets/images/24_금당고_2학기_기말_고1_기출/q11-solution.svg', '무리함수 위의 두 점과 현 PQ를 나타낸 해설 그래프', 'y=3√x 위에서 b+d=3이 되는 두 점을 표시하고 직선 PQ의 기울기 3을 확인한다.'],
  ['original/high/h1/2final/24_금당고_2학기_기말_고1_기출.js', 16, 'assets/images/24_금당고_2학기_기말_고1_기출/q16-solution.svg', '유리함수 위의 점 A와 선분 BC를 나타낸 해설 그래프', 'A=(√2,√2)에서 직선 BC까지의 높이가 최소가 되는 관계를 확인한다.'],
  ['original/high/h1/2final/23_강남여고_2학기_기말_고1_기출.js', 24, 'assets/images/23_강남여고_2학기_기말_고1_기출/q24-solution.svg', '무리함수와 기울기 경계 직선을 나타낸 해설 그래프', '끝점 조건과 접하는 경계 직선의 기울기 −1, 1/2를 표시한다.'],
  ['original/high/h1/2final/24_매산여고_2학기_기말_고1_기출.js', 23, 'assets/images/24_매산여고_2학기_기말_고1_기출/q23-solution.svg', '함수와 역함수, y=x, 삼각형 ABC를 나타낸 해설 그래프', '역함수의 정의역과 y=x 위의 교점 A, 직선 l 위의 B·C를 표시하여 넓이를 확인한다.'],
].map(([sourceJsPath, id, assetRef, alt, caption]) => ({ sourceJsPath, id, assetRef, alt, caption }));

function loadBank(relativePath) {
  const filePath = path.join(ARCHIVE, 'exams', relativePath.replaceAll('/', path.sep));
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 5000 });
  return context.window.questionBank || [];
}

function findObject(text, id) {
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

function insertMetadata(text, patch) {
  const object = findObject(text, patch.id);
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

function protectedSnapshot(question) {
  return JSON.stringify({ id: question.id ?? null, content: question.content ?? null, choices: question.choices ?? null, answer: question.answer ?? null, image: question.image ?? null });
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
    const beforeProtectedHash = sha(protectedSnapshot(beforeQuestion));
    const afterText = insertMetadata(beforeText, patch);
    const temporary = `${filePath}.function-family.tmp`;
    fs.writeFileSync(temporary, afterText, 'utf8');
    fs.renameSync(temporary, filePath);
    const afterQuestion = loadBank(patch.sourceJsPath).find((question) => Number(question.id) === patch.id);
    const afterProtectedHash = sha(protectedSnapshot(afterQuestion));
    if (beforeProtectedHash !== afterProtectedHash) throw new Error(`protected payload changed: ${patch.sourceJsPath} q${patch.id}`);
    ledger.push({ qKey: `${patch.sourceJsPath}_${patch.id}`, sourceJsPath: patch.sourceJsPath, id: patch.id, field: 'solutionImage|solutionImageAlt|solutionImageCaption|solutionImageSize', assetRef: patch.assetRef, beforeProtectedHash, afterProtectedHash, status: 'ATTACHED' });
  }
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const report = { reportType: 'FUNCTION_FAMILY_BATCH3_SOLUTION_VISUAL_ATTACHMENT', generatedAt: new Date().toISOString(), status: 'PASS', changedQuestionCount: ledger.length, protectedPayloadParity: ledger.every((row) => row.beforeProtectedHash === row.afterProtectedHash), ledger };
  fs.writeFileSync(path.join(REPORT_DIR, 'function_family_batch3_attachment_ledger.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main();

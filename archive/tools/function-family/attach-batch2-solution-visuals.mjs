import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');

const PATCHES = [
  ['original/high/h1/2final/24_금당고_2학기_기말_고1_기출.js', 3, 'assets/images/24_금당고_2학기_기말_고1_기출/q03-solution.svg', '유리함수의 두 점근선 x=−2, y=2를 나타낸 해설 그래프', '수직점근선과 수평점근선을 확인하여 a=2, b=2를 읽는다.'],
  ['original/high/h1/2final/24_금당고_2학기_기말_고1_기출.js', 5, 'assets/images/24_금당고_2학기_기말_고1_기출/q05-solution.svg', '무리함수의 끝점과 최솟값을 나타낸 해설 그래프', '정의역 x≤2에서 끝점 (2,3)이 최솟값을 주는 위치를 확인한다.'],
  ['original/high/h1/2final/25_팔마고_2학기_기말_고1_기출.js', 4, 'assets/images/25_팔마고_2학기_기말_고1_기출/q04-solution.svg', '유리함수의 점근선과 사분면 통과를 나타낸 해설 그래프', '점근선 x=3, y=−2와 x절편을 기준으로 그래프가 지나는 사분면을 확인한다.'],
  ['original/high/h1/2final/25_팔마고_2학기_기말_고1_기출.js', 6, 'assets/images/25_팔마고_2학기_기말_고1_기출/q06-solution.svg', '유리함수의 점근선과 f⁻¹(3)의 위치를 나타낸 해설 그래프', '점근선 x=−1, y=4를 읽고 y=3과 그래프의 교점 x=−2를 확인한다.'],
  ['original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js', 11, 'assets/images/25_제일고_2학기_기말_고1_기출/q11-solution.svg', '무리함수의 끝점과 x절편, 사분면을 나타낸 해설 그래프', '정의역 x≤−1, x절편 (−2,0), 끝점 (−1,−1)을 확인한다.'],
  ['original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js', 13, 'assets/images/25_제일고_2학기_기말_고1_기출/q13-solution.svg', '유리함수의 점근선과 중심을 나타낸 해설 그래프', 'y=−1−1/(x−1)에서 점근선 x=1, y=−1과 중심 (1,−1)을 확인한다.'],
  ['original/high/h1/2final/23_강남여고_2학기_기말_고1_기출.js', 5, 'assets/images/23_강남여고_2학기_기말_고1_기출/q05-solution.svg', '양의 반비례 함수의 두 가지 그래프 가지를 나타낸 해설 그래프', 'k>0이면 그래프가 제1, 3사분면에 있고 두 좌표축이 점근선이다.'],
  ['original/high/h1/2final/23_금당고_2학기_기말_고1_기출.js', 7, 'assets/images/23_금당고_2학기_기말_고1_기출/q07-solution.svg', '유리함수의 점근선과 대칭 직선을 나타낸 해설 그래프', '점근선 x=1, y=−1과 중심 (1,−1), 대칭 직선 y=x−2를 확인한다.'],
  ['original/high/h1/2final/24_강남여고_2학기_기말_고1_기출.js', 6, 'assets/images/24_강남여고_2학기_기말_고1_기출/q06-solution.svg', '평행이동한 무리함수의 끝점과 정의역을 나타낸 해설 그래프', 'y=√(−3x)를 오른쪽 2, 위 1만큼 이동한 그래프의 끝점 (2,1)을 확인한다.'],
  ['original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js', 18, 'assets/images/25_순천고_2학기_기말_고1_기출/q18-solution.svg', '유리함수와 원의 두 교점을 나타낸 해설 그래프', '중심 (1,2), 반지름 3인 원과 유리함수의 두 교점 사이 거리 √14를 확인한다.'],
].map(([sourceJsPath, id, assetRef, alt, caption]) => ({ sourceJsPath, id, assetRef, alt, caption }));

function read(relativePath) {
  return fs.readFileSync(path.join(ARCHIVE, 'exams', relativePath.replaceAll('/', path.sep)), 'utf8');
}

function loadBank(relativePath) {
  const filePath = path.join(ARCHIVE, 'exams', relativePath.replaceAll('/', path.sep));
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 5000 });
  return context.window.questionBank || [];
}

function findObject(text, id) {
  const marker = new RegExp('\\n[ \\t]*\\{\\r?\\n[ \\t]*"id":\\s*' + id + ',');
  const found = marker.exec(text);
  if (!found) throw new Error(`question object not found: id=${id}`);
  const start = found.index + 1;
  let depth = 0;
  let quoted = false;
  let escaped = false;
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
  const fields = [
    ['solutionImage', patch.assetRef],
    ['solutionImageAlt', patch.alt],
    ['solutionImageCaption', patch.caption],
    ['solutionImageSize', 'full'],
  ].map(([key, value]) => `${indent}${JSON.stringify(key)}: ${JSON.stringify(value)},`).join('\n') + '\n';
  const insertAt = object.start + solutionLine.index + solutionLine[0].length;
  return text.slice(0, insertAt) + fields + text.slice(insertAt);
}

function sha(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function protectedSnapshot(question) {
  return JSON.stringify({ id: question.id ?? null, content: question.content ?? null, choices: question.choices ?? null, answer: question.answer ?? null, image: question.image ?? null });
}

function main() {
  const ledger = [];
  for (const patch of PATCHES) {
    const filePath = path.join(ARCHIVE, 'exams', patch.sourceJsPath.replaceAll('/', path.sep));
    const beforeText = read(patch.sourceJsPath);
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
  const report = { reportType: 'FUNCTION_FAMILY_BATCH2_SOLUTION_VISUAL_ATTACHMENT', generatedAt: new Date().toISOString(), status: 'PASS', changedQuestionCount: ledger.length, protectedPayloadParity: ledger.every((row) => row.beforeProtectedHash === row.afterProtectedHash), ledger };
  fs.writeFileSync(path.join(REPORT_DIR, 'function_family_batch2_attachment_ledger.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main();

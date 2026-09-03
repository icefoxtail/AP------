import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');

const PATCHES = [
  ['original/high/h1/2final/23_매산여고_2학기_기말_고1_기출.js', 9, 'assets/images/23_매산여고_2학기_기말_고1_기출/q09-solution.svg', '무리함수·유리함수 사이의 정수 격자 영역을 나타낸 해설 그래프', '두 그래프와 x=0,10 경계 사이의 정수 격자점을 세는 구조를 확인한다.'],
  ['original/high/h1/2final/24_제일고_2학기_기말_고1_기출.js', 12, 'assets/images/24_제일고_2학기_기말_고1_기출/q12-solution.svg', '무리함수의 끝점·절편·정의역을 나타낸 해설 그래프', '끝점 (−2,1), x절편 (−3/2,0), 정의역과 치역을 확인한다.'],
  ['original/high/h1/2final/24_제일고_2학기_기말_고1_기출.js', 13, 'assets/images/24_제일고_2학기_기말_고1_기출/q13-solution.svg', '유리함수의 점근선과 사분면 조건을 나타낸 해설 그래프', 'k=4 대표 그래프와 자연수 k=1,…,7 조건을 확인한다.'],
  ['original/high/h1/2final/22_효천고_2학기_기말_고1_기출.js', 16, 'assets/images/22_효천고_2학기_기말_고1_기출/q16-solution.svg', '무리함수·역함수와 삼각형을 나타낸 해설 그래프', 'k=31에서 원함수·역함수와 삼각형의 만남을 확인한다.'],
  ['original/high/h1/2final/22_금당고_2학기_기말_고1_기출.js', 17, 'assets/images/22_금당고_2학기_기말_고1_기출/q17-solution.svg', '유리함수와 무리함수의 두 교점을 나타낸 해설 그래프', '대표값 t=0에서 두 교점과 −3/2≤t≤0 범위를 확인한다.'],
  ['original/high/h1/2final/23_강남여고_2학기_기말_고1_기출.js', 20, 'assets/images/23_강남여고_2학기_기말_고1_기출/q20-solution.svg', '평행이동한 두 유리함수와 넓이를 나타낸 해설 그래프', 't=6에서 A,B,C,D와 둘러싸인 넓이 8을 확인한다.'],
  ['original/high/h1/2final/23_강남여고_2학기_기말_고1_기출.js', 22, 'assets/images/23_강남여고_2학기_기말_고1_기출/q22-solution.svg', '유리함수에서 유도한 무리함수의 범위를 나타낸 해설 그래프', 'g=√(3x)−2의 구간 [3,27]에서 최솟값 1, 최댓값 7을 확인한다.'],
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
  const fields = [['solutionImage', patch.assetRef], ['solutionImageAlt', patch.alt], ['solutionImageCaption', patch.caption], ['solutionImageSize', 'full']]
    .map(([key, value]) => `${solutionLine[1]}${JSON.stringify(key)}: ${JSON.stringify(value)},`).join('\n') + '\n';
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
    if (!beforeQuestion) throw new Error(`invalid target: ${patch.sourceJsPath} q${patch.id}`);
    const beforeProtectedHash = protectedHash(beforeQuestion);
    if (beforeQuestion.solutionImage) {
      if (beforeQuestion.solutionImage !== patch.assetRef) throw new Error(`existing solutionImage mismatch: ${patch.sourceJsPath} q${patch.id}`);
      ledger.push({ qKey: `${patch.sourceJsPath}_${patch.id}`, sourceJsPath: patch.sourceJsPath, id: patch.id, field: 'solutionImage|solutionImageAlt|solutionImageCaption|solutionImageSize', assetRef: patch.assetRef, beforeProtectedHash, afterProtectedHash: beforeProtectedHash, status: 'ALREADY_ATTACHED' });
      continue;
    }
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
  const report = { reportType: 'FUNCTION_FAMILY_BATCH14_SOLUTION_VISUAL_ATTACHMENT', generatedAt: new Date().toISOString(), status: 'PASS', changedQuestionCount: ledger.length, protectedPayloadParity: ledger.every((row) => row.beforeProtectedHash === row.afterProtectedHash), ledger };
  fs.writeFileSync(path.join(REPORT_DIR, 'function_family_batch14_attachment_ledger.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main();

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');

const PATCHES = [
  ['original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js', 16, 'assets/images/21_강남여고_2학기_기말_고1_기출/q16-solution.svg', '렌즈 방정식을 유리함수로 나타낸 해설 그래프', 'y=4+16/(x−4)로 정리해 점근선 x=4, y=4를 확인한다.'],
  ['original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js', 28, 'assets/images/21_강남여고_2학기_기말_고1_기출/q28-solution.svg', '유리함수의 구간 최댓값과 최솟값을 나타낸 해설 그래프', 'f=−2/(x+4)−3을 −3≤x≤6에서 확인해 m=−5, M=−16/5를 읽는다.'],
  ['original/high/h1/2final/21_순천고_2학기_기말_고1_기출.js', 2, 'assets/images/21_순천고_2학기_기말_고1_기출/q02-solution.svg', '유리함수의 두 점근선을 나타낸 해설 그래프', 'y=3+8/(x−2)에서 점근선 x=2, y=3과 절편을 확인한다.'],
  ['original/high/h1/2final/21_복성고_2학기_기말_고1_기출.js', 11, 'assets/images/21_복성고_2학기_기말_고1_기출/q11-solution.svg', '무리함수와 직선의 두 교점을 나타낸 해설 그래프', '2≤k<5/2에서 두 교점이 생기며 대표값 k=9/4를 확인한다.'],
  ['original/high/h1/2final/21_팔마고_2학기_기말_고1_기출.js', 20, 'assets/images/21_팔마고_2학기_기말_고1_기출/q20-solution.svg', '무리함수와 직선의 접점을 나타낸 해설 그래프', 'y=√(4x−8)과 y=x−1이 T=(3,2)에서 한 점으로 만남을 확인한다.'],
  ['original/high/h1/2final/22_강남여고_2학기_기말_고1_기출.js', 15, 'assets/images/22_강남여고_2학기_기말_고1_기출/q15-solution.svg', '유리함수의 중심과 대칭축을 나타낸 해설 그래프', '중심 (2,1)과 대칭축 y=x−1, y=−x+3을 확인한다.'],
  ['original/high/h1/2final/22_강남여고_2학기_기말_고1_기출.js', 22, 'assets/images/22_강남여고_2학기_기말_고1_기출/q22-solution.svg', '무리함수와 역함수의 그래프를 나타낸 해설 그래프', 'a=16일 때 f=√(2x+16)−4, 역함수의 정의역 x≥−4를 확인한다.'],
  ['original/high/h1/2final/22_매산고_2학기_기말_고1_기출.js', 3, 'assets/images/22_매산고_2학기_기말_고1_기출/q03-solution.svg', '무리함수의 끝점·정의역·치역을 나타낸 해설 그래프', '끝점 (3,3), 정의역 x≥3, 치역 y≤3을 확인한다.'],
  ['original/high/h1/2final/22_효천고_2학기_기말_고1_기출.js', 18, 'assets/images/22_효천고_2학기_기말_고1_기출/q18-solution.svg', '무리함수의 끝점·정의역·치역을 나타낸 해설 그래프', '끝점 (3,−1), 정의역 x≤3, 치역 y≥−1을 확인한다.'],
  ['original/high/h1/2final/22_팔마고_2학기_기말_고1_기출.js', 8, 'assets/images/22_팔마고_2학기_기말_고1_기출/q08-solution.svg', '유리함수와 직선의 최단거리를 나타낸 해설 그래프', 'k=0인 y=x에서 두 교점 사이 최솟거리 4를 확인한다.'],
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
    if (!beforeQuestion || beforeQuestion.solutionImage) throw new Error(`invalid target or existing solutionImage: ${patch.sourceJsPath} q${patch.id}`);
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
  const report = { reportType: 'FUNCTION_FAMILY_BATCH8_SOLUTION_VISUAL_ATTACHMENT', generatedAt: new Date().toISOString(), status: 'PASS', changedQuestionCount: ledger.length, protectedPayloadParity: ledger.every((row) => row.beforeProtectedHash === row.afterProtectedHash), ledger };
  fs.writeFileSync(path.join(REPORT_DIR, 'function_family_batch8_attachment_ledger.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main();

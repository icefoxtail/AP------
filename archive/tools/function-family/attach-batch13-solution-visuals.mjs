import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');

const PATCHES = [
  ['original/high/h1/2final/22_효천고_2학기_기말_고1_기출.js', 22, 'assets/images/22_효천고_2학기_기말_고1_기출/q22-solution.svg', '유리함수 자기역함수의 고정점과 대칭축을 나타낸 해설 그래프', 'f=2+3/(x−2)의 중심·대칭축과 두 고정점을 확인한다.'],
  ['original/high/h1/2final/23_금당고_2학기_기말_고1_기출.js', 11, 'assets/images/23_금당고_2학기_기말_고1_기출/q11-solution.svg', '유리함수의 중심과 구간 최댓값을 나타낸 해설 그래프', '점근선 교점 (2,3), [0,1]의 최댓값 2, f(4)=4를 확인한다.'],
  ['original/high/h1/2final/23_금당고_2학기_기말_고1_기출.js', 13, 'assets/images/23_금당고_2학기_기말_고1_기출/q13-solution.svg', '역함수 직선과 좌표축 넓이를 나타낸 해설 그래프', 'f⁻¹=1−x/3의 절편과 좌표축 삼각형 넓이를 확인한다.'],
  ['original/high/h1/2final/23_강남여고_2학기_기말_고1_기출.js', 19, 'assets/images/23_강남여고_2학기_기말_고1_기출/q19-solution.svg', '무리함수와 접선 및 삼각형을 나타낸 해설 그래프', 'a=1, b=5/2에서 접점 C=(−3/4,1)과 넓이 1/4을 확인한다.'],
  ['original/high/h1/2final/24_제일고_2학기_기말_고1_기출.js', 11, 'assets/images/24_제일고_2학기_기말_고1_기출/q11-solution.svg', '유리함수와 역함수 대칭축을 나타낸 해설 그래프', '중심 (2,3), 두 대칭축, 역함수 대응점 (10,3)을 확인한다.'],
  ['original/high/h1/2final/24_매산여고_2학기_기말_고1_기출.js', 22, 'assets/images/24_매산여고_2학기_기말_고1_기출/q22-solution.svg', '두 유리함수의 사분면 조건을 나타낸 해설 그래프', 'k=7 대표 그래프와 허용 정수 5,6,7,8,9를 확인한다.'],
  ['original/high/h1/2final/24_매산여고_2학기_기말_고1_기출.js', 6, 'assets/images/24_매산여고_2학기_기말_고1_기출/q06-solution.svg', '유리함수와 무리함수의 끝점 교점을 나타낸 해설 그래프', '구간 [5,8]에서 한 교점과 k의 최솟값 −11/2를 확인한다.'],
  ['original/high/h1/2final/24_금당고_2학기_기말_고1_기출.js', 14, 'assets/images/24_금당고_2학기_기말_고1_기출/q14-solution.svg', '조각함수와 직선으로 둘러싸인 넓이를 나타낸 해설 그래프', 'A=(−4,2), O=(0,0), B=(2,4)와 넓이 10을 확인한다.'],
  ['original/high/h1/2final/23_매산여고_2학기_기말_고1_기출.js', 22, 'assets/images/23_매산여고_2학기_기말_고1_기출/q22-solution.svg', '무리함수와 역함수의 정의역·치역을 나타낸 해설 그래프', 'g=√(1−x)+2와 g⁻¹=1−(x−2)²의 대응을 확인한다.'],
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
  const report = { reportType: 'FUNCTION_FAMILY_BATCH13_SOLUTION_VISUAL_ATTACHMENT', generatedAt: new Date().toISOString(), status: 'PASS', changedQuestionCount: ledger.length, protectedPayloadParity: ledger.every((row) => row.beforeProtectedHash === row.afterProtectedHash), ledger };
  fs.writeFileSync(path.join(REPORT_DIR, 'function_family_batch13_attachment_ledger.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main();

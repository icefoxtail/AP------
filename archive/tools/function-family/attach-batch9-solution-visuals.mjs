import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');

const PATCHES = [
  ['original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js', 14, 'assets/images/21_강남여고_2학기_기말_고1_기출/q14-solution.svg', '변환된 유리함수의 점근선을 나타낸 해설 그래프', 'f(x)=−x+6에서 y=−1+7/(x−4)로 정리해 점근선을 확인한다.'],
  ['original/high/h1/2final/21_복성고_2학기_기말_고1_기출.js', 22, 'assets/images/21_복성고_2학기_기말_고1_기출/q22-solution.svg', '두 무리함수와 직각삼각형을 나타낸 해설 그래프', 't=1일 때 A=(1,3), B=(1,1), C=(9,3)이고 넓이는 8이다.'],
  ['original/high/h1/2final/22_강남여고_2학기_기말_고1_기출.js', 18, 'assets/images/22_강남여고_2학기_기말_고1_기출/q18-solution.svg', '두 무리함수의 세로 차를 나타낸 해설 그래프', 'Pₖ=(k,√(k+1)), Qₖ=(k,√k)로 두고 망원합을 확인한다.'],
  ['original/high/h1/2final/22_매산고_2학기_기말_고1_기출.js', 19, 'assets/images/22_매산고_2학기_기말_고1_기출/q19-solution.svg', '유리함수와 직선 및 삼각형을 나타낸 해설 그래프', 'k=−5일 때 P=(−5,1), Q=(−1,5), 삼각형 넓이 12를 확인한다.'],
  ['original/high/h1/2final/22_효천고_2학기_기말_고1_기출.js', 4, 'assets/images/22_효천고_2학기_기말_고1_기출/q04-solution.svg', '유리함수의 중심과 대칭축을 나타낸 해설 그래프', '중심 (1,−5)과 대칭축 y=x−6, y=−x−4를 확인한다.'],
  ['original/high/h1/2final/22_효천고_2학기_기말_고1_기출.js', 5, 'assets/images/22_효천고_2학기_기말_고1_기출/q05-solution.svg', '무리함수와 역함수 대응점을 나타낸 해설 그래프', '역함수의 점 (5,3)은 원래 함수의 점 (3,5)에 대응하고 a=22이다.'],
  ['original/high/h1/2final/22_팔마고_2학기_기말_고1_기출.js', 16, 'assets/images/22_팔마고_2학기_기말_고1_기출/q16-solution.svg', '두 무리함수로 둘러싸인 넓이를 나타낸 해설 그래프', 'y=5, y=−5와 x=±2를 기준으로 대칭 초과분이 상쇄되어 넓이 40이다.'],
  ['original/high/h1/2final/23_금당고_2학기_기말_고1_기출.js', 8, 'assets/images/23_금당고_2학기_기말_고1_기출/q08-solution.svg', '이차함수와 역함수의 두 교점을 나타낸 해설 그래프', '교점 P=(1/2,1/2), Q=(3/2,3/2)와 PQ=√2를 확인한다.'],
  ['original/high/h1/2final/22_효천고_2학기_기말_고1_기출.js', 15, 'assets/images/22_효천고_2학기_기말_고1_기출/q15-solution.svg', '두 유리함수의 사분면 조건을 나타낸 해설 그래프', '대표값 k=1/3에서 첫 그래프는 네 사분면, 둘째 그래프는 제4사분면을 지나지 않는다.'],
  ['original/high/h1/2final/21_순천고_2학기_기말_고1_기출.js', 9, 'assets/images/21_순천고_2학기_기말_고1_기출/q09-solution.svg', '계수의 부호에 따른 무리함수 그래프', 'a=1과 a=−1의 대표 그래프로 정의역·치역과 사분면 차이를 확인한다.'],
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
  const report = { reportType: 'FUNCTION_FAMILY_BATCH9_SOLUTION_VISUAL_ATTACHMENT', generatedAt: new Date().toISOString(), status: 'PASS', changedQuestionCount: ledger.length, protectedPayloadParity: ledger.every((row) => row.beforeProtectedHash === row.afterProtectedHash), ledger };
  fs.writeFileSync(path.join(REPORT_DIR, 'function_family_batch9_attachment_ledger.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main();

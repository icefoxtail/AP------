import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');

const PATCHES = [
  ['original/high/h1/2final/25_팔마고_2학기_기말_고1_기출.js', 20, 'assets/images/25_팔마고_2학기_기말_고1_기출/q20-solution.svg', '정의역 제한 이차함수의 그래프를 나타낸 해설 그래프', 'k=0에서 f=−(x−2)²+4가 x≤0에서 일대일대응임을 확인한다.'],
  ['original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js', 15, 'assets/images/25_순천고_2학기_기말_고1_기출/q15-solution.svg', '이차함수와 역함수의 두 교점을 나타낸 해설 그래프', 'a=12에서 (4,4), (6,6)의 두 고정점을 확인한다.'],
  ['original/high/h1/2final/25_효천고_2학기_기말_고1_기출.js', 22, 'assets/images/25_효천고_2학기_기말_고1_기출/q22-solution.svg', '유리함수와 수선 길이를 나타낸 해설 그래프', 'P=(−3,−2)에서 두 수선 길이의 합이 5가 됨을 확인한다.'],
  ['original/high/h1/2mid/22_팔마고_2학기_중간_고1_기출.js', 12, 'assets/images/22_팔마고_2학기_중간_고1_기출/q12-solution.svg', '함수와 역함수로 둘러싸인 넓이를 나타낸 해설 그래프', '두 그래프의 교점과 분기점 (−2,−2), (0,1), (3,3)을 확인한다.'],
  ['original/high/h1/2mid/22_효천고_2학기_중간_고1_기출.js', 22, 'assets/images/22_효천고_2학기_중간_고1_기출/q22-solution.svg', '절댓값함수와 직선의 교점 개수를 나타낸 해설 그래프', 'k=5인 직선과 네 선분이 만나지 않아 g(5)=0임을 확인한다.'],
  ['original/high/h1/2mid/22_순천여고_2학기_중간_고1_기출.js', 16, 'assets/images/22_순천여고_2학기_중간_고1_기출/q16-solution.svg', '조각함수와 역함수의 그래프를 나타낸 해설 그래프', 'f⁻¹(8)=3, f⁻¹(2)=−1을 그래프 대응으로 확인한다.'],
  ['original/high/h1/2mid/22_순천여고_2학기_중간_고1_기출.js', 17, 'assets/images/22_순천여고_2학기_중간_고1_기출/q17-solution.svg', '합성함수의 구간 최솟값을 나타낸 해설 그래프', 'g의 치역 [1,5]에서 (f∘g)의 최솟값 5와 a=−2를 확인한다.'],
  ['original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js', 11, 'assets/images/22_금당고_2학기_중간_고1_기출/q11-solution.svg', '절댓값 합성식의 세 근을 나타낸 해설 그래프', 't=|x−3|에서 근 −4, 3, 10과 합 9를 확인한다.'],
  ['original/high/h1/2final/21_효천고_2학기_기말_고1_기출.js', 12, 'assets/images/21_효천고_2학기_기말_고1_기출/q12-solution.svg', '절댓값 무리함수와 수평선의 교점을 나타낸 해설 그래프', 'n=2에서 x=−32,0,32의 세 교점을 확인한다.'],
  ['original/high/h1/2final/21_효천고_2학기_기말_고1_기출.js', 13, 'assets/images/21_효천고_2학기_기말_고1_기출/q13-solution.svg', '조각 무리함수와 직선으로 둘러싸인 넓이를 나타낸 해설 그래프', 'A=(−4,−8), O=(0,0), B=(8,−4)와 넓이 40을 확인한다.'],
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
  const report = { reportType: 'FUNCTION_FAMILY_BATCH12_SOLUTION_VISUAL_ATTACHMENT', generatedAt: new Date().toISOString(), status: 'PASS', changedQuestionCount: ledger.length, protectedPayloadParity: ledger.every((row) => row.beforeProtectedHash === row.afterProtectedHash), ledger };
  fs.writeFileSync(path.join(REPORT_DIR, 'function_family_batch12_attachment_ledger.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main();

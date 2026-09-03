import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');

const PATCHES = [
  ['original/high/h1/2final/21_금당고_2학기_기말_고1_기출.js', 22, 'assets/images/21_금당고_2학기_기말_고1_기출/q22-solution.svg', '두 반비례 함수와 삼각형의 최솟값을 나타낸 해설 그래프', 'A=(a,20/a), B=(b,−45/b)에서 a/b=2/3일 때 최소 넓이 30을 확인한다.'],
  ['original/high/h1/2final/22_금당고_2학기_기말_고1_기출.js', 9, 'assets/images/22_금당고_2학기_기말_고1_기출/q09-solution.svg', '유리함수의 대칭 중심을 나타낸 해설 그래프', 'f=3+2/(x−2)와 점 (3,5), 대칭 조건을 이용해 중심 (2,3)을 확인한다.'],
  ['original/high/h1/2final/22_제일고_2학기_기말_고1_기출.js', 2, 'assets/images/22_제일고_2학기_기말_고1_기출/q02-solution.svg', '유리함수의 점근선과 절편을 나타낸 해설 그래프', 'y=3+5/(x−2)에서 점근선 x=2, y=3과 x절편을 확인한다.'],
  ['original/high/h1/2final/22_제일고_2학기_기말_고1_기출.js', 22, 'assets/images/22_제일고_2학기_기말_고1_기출/q22-solution.svg', '두 무리함수의 세로 차를 나타낸 해설 그래프', 'Pₖ=(k,−√k), Qₖ=(k,−√(k+2))의 망원합 구조를 확인한다.'],
  ['original/high/h1/2final/22_복성고_2학기_기말_고1_기출.js', 15, 'assets/images/22_복성고_2학기_기말_고1_기출/q15-solution.svg', '유리함수가 네 사분면을 지나는 모습을 나타낸 해설 그래프', 'k=4 대표 그래프와 일반 조건 k>3을 확인한다.'],
  ['original/high/h1/2final/22_순천여고_2학기_기말_고1_기출.js', 20, 'assets/images/22_순천여고_2학기_기말_고1_기출/q20-solution.svg', '유리함수·직선과 삼각형을 나타낸 해설 그래프', 'a=2에서 P=(2,1), Q=(2,−2), R=(−1,1)과 최소 넓이 9/2를 확인한다.'],
  ['original/high/h1/2mid/24_제일고_2학기_중간_고1_기출.js', 15, 'assets/images/24_제일고_2학기_중간_고1_기출/q15-solution.svg', '평행이동된 무리함수의 점을 나타낸 해설 그래프', 'y=√(−2x−2)−1이 점 (k,3), k=−9를 지남을 확인한다.'],
  ['original/high/h1/2mid/24_제일고_2학기_중간_고1_기출.js', 16, 'assets/images/24_제일고_2학기_중간_고1_기출/q16-solution.svg', '평행이동된 유리함수의 점근선을 나타낸 해설 그래프', 'y=−2−3/(x−3)의 점근선과 −3/x 평행이동 구조를 확인한다.'],
  ['original/high/h1/2mid/24_제일고_2학기_중간_고1_기출.js', 17, 'assets/images/24_제일고_2학기_중간_고1_기출/q17-solution.svg', '유리함수와 양의 기울기 대칭축을 나타낸 해설 그래프', '중심 (1,3), 대칭축 y=x+2와 두 교점, AB=8을 확인한다.'],
  ['original/high/h1/2final/22_팔마고_2학기_기말_고1_기출.js', 6, 'assets/images/22_팔마고_2학기_기말_고1_기출/q06-solution.svg', '유리함수의 중심과 주어진 점을 나타낸 해설 그래프', 'f=(x−1)/(x+1), 중심 (−1,1), f(2)=1/3을 확인한다.'],
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
  const report = { reportType: 'FUNCTION_FAMILY_BATCH10_SOLUTION_VISUAL_ATTACHMENT', generatedAt: new Date().toISOString(), status: 'PASS', changedQuestionCount: ledger.length, protectedPayloadParity: ledger.every((row) => row.beforeProtectedHash === row.afterProtectedHash), ledger };
  fs.writeFileSync(path.join(REPORT_DIR, 'function_family_batch10_attachment_ledger.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main();

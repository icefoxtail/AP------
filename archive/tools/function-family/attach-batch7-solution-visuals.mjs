import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');

const PATCHES = [
  ['original/high/h1/2final/25_효천고_2학기_기말_고1_기출.js', 12, 'assets/images/25_효천고_2학기_기말_고1_기출/q12-solution.svg', '유리함수의 중심과 두 대칭축을 나타낸 해설 그래프', 'a=−2, b=2일 때 중심 C=(−2,3)과 대칭축 y=x+5, y=−x+1을 확인한다.'],
  ['original/high/h1/2final/22_팔마고_2학기_기말_고1_기출.js', 12, 'assets/images/22_팔마고_2학기_기말_고1_기출/q12-solution.svg', '무리함수와 직선의 접점을 나타낸 해설 그래프', 'y=−√(x−5)와 y=−x+19/4가 T=(21/4,−1/2)에서 한 점으로 만남을 확인한다.'],
  ['original/high/h1/2final/22_제일고_2학기_기말_고1_기출.js', 9, 'assets/images/22_제일고_2학기_기말_고1_기출/q09-solution.svg', '무리함수와 직선의 두 교점을 나타낸 해설 그래프', '대표값 k=17/8에서 두 교점이 생기며 2≤k<9/4임을 확인한다.'],
  ['original/high/h1/2final/22_순천여고_2학기_기말_고1_기출.js', 7, 'assets/images/22_순천여고_2학기_기말_고1_기출/q07-solution.svg', '유리함수가 네 사분면을 지나는 모습을 나타낸 해설 그래프', 'k=3일 때 점근선 x=−1, y=−2를 기준으로 네 사분면 통과를 확인한다.'],
  ['original/high/h1/2final/22_순천여고_2학기_기말_고1_기출.js', 8, 'assets/images/22_순천여고_2학기_기말_고1_기출/q08-solution.svg', '유리함수와 직선이 만나지 않는 모습을 나타낸 해설 그래프', 'k=8일 때 판별식 D=(k−1)(k−9)<0이므로 두 그래프가 만나지 않음을 확인한다.'],
  ['original/high/h1/2final/22_복성고_2학기_기말_고1_기출.js', 7, 'assets/images/22_복성고_2학기_기말_고1_기출/q07-solution.svg', '무리함수의 끝점·정의역·치역을 나타낸 해설 그래프', '끝점 (−3/2,2), 정의역 x≥−3/2, 치역 y≤2와 점 (3,−1)을 확인한다.'],
  ['original/high/h1/2final/22_금당고_2학기_기말_고1_기출.js', 1, 'assets/images/22_금당고_2학기_기말_고1_기출/q01-solution.svg', '유리함수의 두 점근선을 나타낸 해설 그래프', 'y=2/(x−2)−1에서 수직점근선 x=2와 수평점근선 y=−1을 확인한다.'],
  ['original/high/h1/2final/22_강남여고_2학기_기말_고1_기출.js', 11, 'assets/images/22_강남여고_2학기_기말_고1_기출/q11-solution.svg', '무리함수와 역함수의 두 교점을 나타낸 해설 그래프', 'y=x 위의 교점 A=(1,1), B=(2,2)와 AB=√2를 확인한다.'],
  ['original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js', 13, 'assets/images/25_순천고_2학기_기말_고1_기출/q13-solution.svg', '유리함수의 점근선과 절편을 나타낸 해설 그래프', 'x절편 −5, 점근선 x=−3, y=1을 이용해 a=5, b=1, c=3을 확인한다.'],
  ['original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js', 14, 'assets/images/25_순천고_2학기_기말_고1_기출/q14-solution.svg', '유리함수가 네 사분면을 지나는 모습을 나타낸 해설 그래프', 'a=−1/4일 때 −1/2<a<0이므로 네 사분면을 모두 지남을 확인한다.'],
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
  const report = { reportType: 'FUNCTION_FAMILY_BATCH7_SOLUTION_VISUAL_ATTACHMENT', generatedAt: new Date().toISOString(), status: 'PASS', changedQuestionCount: ledger.length, protectedPayloadParity: ledger.every((row) => row.beforeProtectedHash === row.afterProtectedHash), ledger };
  fs.writeFileSync(path.join(REPORT_DIR, 'function_family_batch7_attachment_ledger.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main();

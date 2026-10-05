import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');

const PATCHES = [
  ['original/high/h1/2final/21_효천고_2학기_기말_고1_기출.js', 11, 'assets/images/21_효천고_2학기_기말_고1_기출/q11-solution.svg', '유리함수의 점근선과 사분면 통과를 나타낸 해설 그래프', '점근선 x=1, y=2와 x절편을 기준으로 매개변수 a에 따른 사분면 개수를 확인한다.'],
  ['original/high/h1/2final/21_팔마고_2학기_기말_고1_기출.js', 3, 'assets/images/21_팔마고_2학기_기말_고1_기출/q03-solution.svg', '유리함수의 점근선과 중심을 나타낸 해설 그래프', 'y=−3+5/(x+1)에서 점근선 x=−1, y=−3과 중심을 확인한다.'],
  ['original/high/h1/2final/21_팔마고_2학기_기말_고1_기출.js', 4, 'assets/images/21_팔마고_2학기_기말_고1_기출/q04-solution.svg', '무리함수의 끝점·절편·정의역을 나타낸 해설 그래프', '끝점 (1/2,2), x절편 (−3/2,0), 역함수 정의역을 확인한다.'],
  ['original/high/h1/2final/21_제일고_2학기_기말_고1_기출.js', 5, 'assets/images/21_제일고_2학기_기말_고1_기출/q05-solution.svg', '무리함수의 끝점과 x절편을 나타낸 해설 그래프', '끝점 (1,3)과 x절편 (−5/4,0)을 이용해 정의역·치역·구간 최댓값을 확인한다.'],
  ['original/high/h1/2final/21_제일고_2학기_기말_고1_기출.js', 4, 'assets/images/21_제일고_2학기_기말_고1_기출/q04-solution.svg', '유리함수의 점근선과 중심을 나타낸 해설 그래프', 'y=2−5/(x+3)에서 점근선 x=−3, y=2와 중심을 확인한다.'],
  ['original/high/h1/2final/21_순천고_2학기_기말_고1_기출.js', 18, 'assets/images/21_순천고_2학기_기말_고1_기출/q18-solution.svg', '원과 반비례 함수의 두 교점을 나타낸 해설 그래프', 'x²=1/2, 9/2인 두 교점과 x좌표의 비 1:3을 확인한다.'],
  ['original/high/h1/2final/21_복성고_2학기_기말_고1_기출.js', 4, 'assets/images/21_복성고_2학기_기말_고1_기출/q04-solution.svg', '무리함수의 끝점·정의역·치역을 나타낸 해설 그래프', '끝점 (2,4)와 정의역 x≤2, 치역 y≤4를 확인한다.'],
  ['original/high/h1/2final/21_복성고_2학기_기말_고1_기출.js', 12, 'assets/images/21_복성고_2학기_기말_고1_기출/q12-solution.svg', '무리함수와 역함수의 접점을 나타낸 해설 그래프', 'a=4일 때 두 그래프의 접점 T=(5,5)를 확인한다.'],
  ['original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js', 17, 'assets/images/21_강남여고_2학기_기말_고1_기출/q17-solution.svg', '유리함수와 직선 사이의 최단 선분을 나타낸 해설 그래프', 'a=3/2일 때 P=(3/2,2), Q=(3/2,−6)로 PQ=8임을 확인한다.'],
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
  const report = { reportType: 'FUNCTION_FAMILY_BATCH6_SOLUTION_VISUAL_ATTACHMENT', generatedAt: new Date().toISOString(), status: 'PASS', changedQuestionCount: ledger.length, protectedPayloadParity: ledger.every((row) => row.beforeProtectedHash === row.afterProtectedHash), ledger };
  fs.writeFileSync(path.join(REPORT_DIR, 'function_family_batch6_attachment_ledger.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main();

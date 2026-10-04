import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');

const PATCHES = [
  ['original/high/h1/2final/22_금당고_2학기_기말_고1_기출.js', 8, 'assets/images/22_금당고_2학기_기말_고1_기출/q08-solution.svg', '무리함수와 역함수의 교점을 나타낸 해설 그래프', '교점 P=(1,1), Q=(2,2), 거리 √2와 직선 기울기 1을 확인한다.'],
  ['original/high/h1/2final/22_매산고_2학기_기말_고1_기출.js', 7, 'assets/images/22_매산고_2학기_기말_고1_기출/q07-solution.svg', '무리함수와 직선의 제1사분면 교점을 나타낸 해설 그래프', '1<k≤11 범위에서 제1사분면 교점이 생김을 확인한다.'],
  ['original/high/h1/2final/22_매산고_2학기_기말_고1_기출.js', 8, 'assets/images/22_매산고_2학기_기말_고1_기출/q08-solution.svg', '반비례 함수와 직각삼각형을 나타낸 해설 그래프', 'k=6에서 A=(1,2), B=(3,2), C=(1,6)과 넓이 4를 확인한다.'],
  ['original/high/h1/2final/22_순천여고_2학기_기말_고1_기출.js', 14, 'assets/images/22_순천여고_2학기_기말_고1_기출/q14-solution.svg', '두 무리함수와 넓이를 나타낸 해설 그래프', 'a=6에서 두 그래프의 교점 (3/2,0)과 y축 절편을 확인한다.'],
  ['original/high/h1/2final/22_순천여고_2학기_기말_고1_기출.js', 17, 'assets/images/22_순천여고_2학기_기말_고1_기출/q17-solution.svg', '반원의 거리 함수 개형을 나타낸 해설 그래프', 'f(x)=2√(2−x), 0≤x≤2의 감소 개형과 끝점을 확인한다.'],
  ['original/high/h1/2final/22_순천여고_2학기_기말_고1_기출.js', 21, 'assets/images/22_순천여고_2학기_기말_고1_기출/q21-solution.svg', '평행이동·대칭된 무리함수 그래프', '변환 결과 y=−√(2x−5)+3과 계수 a,b,c를 확인한다.'],
  ['original/high/h1/2final/22_복성고_2학기_기말_고1_기출.js', 12, 'assets/images/22_복성고_2학기_기말_고1_기출/q12-solution.svg', '유리함수와 평행이동된 그래프의 중심을 나타낸 해설 그래프', 'k=5에서 g의 중심 (−2,1)이 f 위에 있음을 확인한다.'],
  ['original/high/h1/2final/22_복성고_2학기_기말_고1_기출.js', 21, 'assets/images/22_복성고_2학기_기말_고1_기출/q21-solution.svg', '조각 유리함수와 직각삼각형을 나타낸 해설 그래프', 'u=2에서 P,Q,R과 최소 넓이 9를 확인한다.'],
  ['original/high/h1/2mid/22_팔마고_2학기_중간_고1_기출.js', 22, 'assets/images/22_팔마고_2학기_중간_고1_기출/q22-solution.svg', '이차함수와 역함수의 두 교점을 나타낸 해설 그래프', 'k=2 대표 그래프에서 (1,1), (2,2) 교점을 확인한다.'],
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
  const report = { reportType: 'FUNCTION_FAMILY_BATCH11_SOLUTION_VISUAL_ATTACHMENT', generatedAt: new Date().toISOString(), status: 'PASS', changedQuestionCount: ledger.length, protectedPayloadParity: ledger.every((row) => row.beforeProtectedHash === row.afterProtectedHash), ledger };
  fs.writeFileSync(path.join(REPORT_DIR, 'function_family_batch11_attachment_ledger.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main();

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');

const PATCHES = [
  {
    sourceJsPath: 'original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js',
    id: 23,
    assetRef: 'assets/images/21_강남여고_2학기_기말_고1_기출/q23-solution.svg',
    alt: '함수와 역함수의 그래프, y=x, 대응점 B와 C, 교점 A를 나타낸 해설 그래프',
    caption: '함수와 역함수의 그래프는 y=x에 대하여 대칭이고, A·B·C의 위치와 삼각형의 넓이를 확인한다.',
  },
  {
    sourceJsPath: 'original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js',
    id: 29,
    assetRef: 'assets/images/21_강남여고_2학기_기말_고1_기출/q29-solution.svg',
    alt: '절댓값 무리함수의 두 가지 가지와 직선, 세 교점을 나타낸 해설 그래프',
    caption: 'x<0에서의 수평 가지와 x≥0에서의 무리함수 가지를 직선과 함께 그려 세 교점 조건을 확인한다.',
  },
  {
    sourceJsPath: 'original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js',
    id: 17,
    assetRef: 'assets/images/25_순천고_2학기_기말_고1_기출/q17-solution.svg',
    alt: '절댓값 무리함수와 최솟값을 주는 직선, 두 교점을 나타낸 해설 그래프',
    caption: '절댓값 안의 부호에 따른 두 가지 가지와 k=−1/2인 직선을 비교하여 최솟값 조건을 확인한다.',
  },
  {
    sourceJsPath: 'original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js',
    id: 23,
    assetRef: 'assets/images/25_순천고_2학기_기말_고1_기출/q23-solution.svg',
    alt: '두 무리함수의 조각 그래프와 직선, 네 교점을 나타낸 해설 그래프',
    caption: '왼쪽 끝점 (1,2)과 오른쪽 시작점 (2,3)을 표시하고 k=1일 때 네 교점을 확인한다.',
  },
  {
    sourceJsPath: 'original/high/h1/2final/25_효천고_2학기_기말_고1_기출.js',
    id: 18,
    assetRef: 'assets/images/25_효천고_2학기_기말_고1_기출/q18-solution.svg',
    alt: '유리함수의 그래프와 같은 중심을 갖는 원, 두 교점을 나타낸 해설 그래프',
    caption: '중심을 (2,3)으로 옮긴 뒤 유리함수와 원이 두 점에서 만나는 경계 반지름을 확인한다.',
  },
];

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

function insertMetadata(text, id, patch) {
  const object = findObject(text, id);
  const block = text.slice(object.start, object.end);
  if (/"solutionImage"\s*:/.test(block)) throw new Error(`solutionImage already exists: ${patch.sourceJsPath} q${id}`);
  const solutionLine = /^(\s*)"solution"\s*:\s*.*(?:\r?\n|$)/m.exec(block);
  if (!solutionLine) throw new Error(`solution field not found: ${patch.sourceJsPath} q${id}`);
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
  return JSON.stringify({
    id: question.id ?? null,
    content: question.content ?? null,
    choices: question.choices ?? null,
    answer: question.answer ?? null,
    image: question.image ?? null,
  });
}

function main() {
  const ledger = [];
  for (const patch of PATCHES) {
    const filePath = path.join(ARCHIVE, 'exams', patch.sourceJsPath.replaceAll('/', path.sep));
    const beforeText = read(patch.sourceJsPath);
    const beforeBank = loadBank(patch.sourceJsPath);
    const beforeQuestion = beforeBank.find((question) => Number(question.id) === patch.id);
    if (!beforeQuestion) throw new Error(`question missing: ${patch.sourceJsPath} q${patch.id}`);
    if (beforeQuestion.solutionImage) throw new Error(`refusing to overwrite existing solutionImage: ${patch.sourceJsPath} q${patch.id}`);
    const beforeProtectedHash = sha(protectedSnapshot(beforeQuestion));
    const afterText = insertMetadata(beforeText, patch.id, patch);
    const temporary = `${filePath}.function-family.tmp`;
    fs.writeFileSync(temporary, afterText, 'utf8');
    fs.renameSync(temporary, filePath);
    const afterQuestion = loadBank(patch.sourceJsPath).find((question) => Number(question.id) === patch.id);
    if (!afterQuestion) throw new Error(`question missing after write: ${patch.sourceJsPath} q${patch.id}`);
    const afterProtectedHash = sha(protectedSnapshot(afterQuestion));
    if (beforeProtectedHash !== afterProtectedHash) throw new Error(`protected payload changed: ${patch.sourceJsPath} q${patch.id}`);
    ledger.push({
      qKey: `${patch.sourceJsPath}_${patch.id}`,
      sourceJsPath: patch.sourceJsPath,
      id: patch.id,
      field: 'solutionImage|solutionImageAlt|solutionImageCaption|solutionImageSize',
      assetRef: patch.assetRef,
      beforeProtectedHash,
      afterProtectedHash,
      status: 'ATTACHED',
    });
  }
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const report = {
    reportType: 'FUNCTION_FAMILY_PILOT_SOLUTION_VISUAL_ATTACHMENT',
    generatedAt: new Date().toISOString(),
    status: 'PASS',
    changedQuestionCount: ledger.length,
    protectedPayloadParity: ledger.every((row) => row.beforeProtectedHash === row.afterProtectedHash),
    ledger,
  };
  fs.writeFileSync(path.join(REPORT_DIR, 'function_family_pilot_attachment_ledger.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main();

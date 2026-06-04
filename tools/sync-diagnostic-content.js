'use strict';
/**
 * sync-diagnostic-content.js
 * 진단평가 팩의 문항 선택(어떤 문제를 쓸지)은 유지하면서
 * 소스 파일에서 발문/보기/정답/해설 등 내용만 다시 읽어 동기화한다.
 */
const fs = require('fs');
const path = require('path');

const EXAMS_BASE = path.resolve('./archive/exams');
const PACKS_FILE = path.resolve('./archive/assessment/assessment-packs-1sem.generated.js');

// 소스에서 덮어쓸 내용 필드 (선택 메타데이터는 건드리지 않음)
const CONTENT_FIELDS = [
  'content', 'question',
  'choices', 'answer',
  'solution', 'explanation', 'sol',
  'level', 'tags',
  'hasImage', 'wide', 'image',
];

const fileCache = new Map();

function loadSourceFile(relPath) {
  if (fileCache.has(relPath)) return fileCache.get(relPath);
  const fullPath = path.join(EXAMS_BASE, relPath);
  try {
    const code = fs.readFileSync(fullPath, 'utf8');
    const w = {};
    new Function('window', code)(w);
    const bank = (w.questionBank || w.examQuestions || []).filter(q => q && typeof q === 'object');
    const byId = new Map(bank.map(q => [String(q.id), q]));
    fileCache.set(relPath, byId);
    return byId;
  } catch (e) {
    console.warn(`  소스 로드 실패: ${relPath} —`, e.message);
    fileCache.set(relPath, new Map());
    return new Map();
  }
}

// 생성 파일 로드
const raw = fs.readFileSync(PACKS_FILE, 'utf8');
const w = {};
new Function('window', raw)(w);
const data = w.APMATH_ASSESSMENT_PACKS_1SEM;

if (!data || !Array.isArray(data.packs)) {
  console.error('ERROR: assessment-packs-1sem.generated.js 읽기 실패');
  process.exit(1);
}

let updatedQuestions = 0;
let missingQuestions = 0;
let checkedPacks = 0;

for (const pack of data.packs) {
  // 진단평가 팩만 대상 (SUB 팩은 _sourceFile 경로 이슈가 있어 제외)
  if (!String(pack.id || '').startsWith('DIAG_')) continue;
  if (!Array.isArray(pack.questions) || pack.questions.length === 0) continue;
  checkedPacks++;

  for (const q of pack.questions) {
    const sourceFile = q._sourceFile;
    const sourceNo = String(q._sourceQuestionNo ?? '');
    if (!sourceFile || !sourceNo) continue;

    const byId = loadSourceFile(sourceFile);
    const sourceQ = byId.get(sourceNo);

    if (!sourceQ) {
      console.warn(`  누락: ${sourceFile} #${sourceNo} (pack: ${pack.id})`);
      missingQuestions++;
      continue;
    }

    let changed = false;
    for (const field of CONTENT_FIELDS) {
      if (!(field in sourceQ)) continue;
      if (JSON.stringify(q[field]) !== JSON.stringify(sourceQ[field])) {
        q[field] = sourceQ[field];
        changed = true;
      }
    }
    if (changed) updatedQuestions++;
  }
}

// 파일 쓰기
const commentLine = raw.split('\n')[0];
const newContent =
  commentLine + '\n' +
  '(function(){\n  window.APMATH_ASSESSMENT_PACKS_1SEM = ' +
  JSON.stringify(data, null, 2) +
  '\n})();\n';

fs.writeFileSync(PACKS_FILE, newContent, 'utf8');

console.log(`✓ 동기화 완료`);
console.log(`  팩 ${checkedPacks}개 확인`);
console.log(`  문항 업데이트: ${updatedQuestions}개`);
if (missingQuestions > 0) {
  console.warn(`  누락 문항: ${missingQuestions}개 (소스에서 찾지 못함)`);
}

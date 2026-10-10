#!/usr/bin/env node
/**
 * 발문 안에서 <보기>, &lt;보기&gt;, [보기] 뒤에 조사가 붙은 오용을 검사한다.
 * 이런 표기는 engine의 보기 블록 정규화와 충돌해 문장 중간 줄바꿈이나 과대 박스를
 * 만들 수 있다. 독립된 보기 제목은 허용하고, 문장 성분은 평문 "보기"만 허용한다.
 *
 * 사용법:
 *   node archive/tools/view-label-lint.mjs
 *   node archive/tools/view-label-lint.mjs --json
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '..');
const examsDir = path.join(archiveDir, 'exams');
const asJson = process.argv.includes('--json');

// Keep this boundary aligned with normalizeViewBlocks: labels only become
// view blocks at the start of content or after an explicit rendered line break.
// Raw newlines are included because the renderer converts them to <br> first.
const BLOCK_BOUNDARY = String.raw`(?:^|(?:<br\s*\/?>\s*|\r?\n)+)`;
const INLINE_VIEW_LABEL = new RegExp(
  `${BLOCK_BOUNDARY}(?:&lt;보기&gt;|<보기>|\\[보기\\])(?=\\s*(?:에서|의|중|으로|처럼|보다|를|을|와|과|에|로|만|도|가|는|은|이))`,
  'gi'
);

export function findInlineViewLabels(content) {
  const value = String(content || '');
  return [...value.matchAll(INLINE_VIEW_LABEL)].flatMap(match => {
    const afterLabel = match.index + match[0].length;
    const nextBlock = value.slice(afterLabel).search(/(?:<br\s*\/?>\s*){2,}|(?:\r?\n\s*){2,}/i);
    const body = value.slice(afterLabel, nextBlock < 0 ? value.length : afterLabel + nextBlock);
    const plain = body.replace(/<[^>]+>/g, '').trim();
    const markerCount = (plain.match(/[ㄱㄴㄷㄹㅁ]\.|㉠|㉡|㉢|㉣|㉤|①|②|③|④|⑤/g) || []).length;
    // normalizeViewBlocks only promotes substantial blocks (or blocks with
    // multiple item markers); short labels remain ordinary text.
    if (plain.length < 60 && markerCount < 2) return [];
    return [{ index: match.index, value: match[0] }];
  });
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

const failures = [];
let fileCount = 0;
let questionCount = 0;

for (const file of walk(examsDir)) {
  const source = fs.readFileSync(file, 'utf8');
  const sandbox = { window: {} };
  try {
    vm.runInNewContext(source, sandbox, { timeout: 5000 });
  } catch (error) {
    failures.push({
      file: path.relative(archiveDir, file).replace(/\\/g, '/'),
      id: null,
      field: 'file',
      value: `파싱 실패: ${error.message}`
    });
    continue;
  }

  const bank = sandbox.window.questionBank;
  if (!Array.isArray(bank)) continue;
  fileCount++;

  for (const question of bank) {
    questionCount++;
    const content = String(question.content || '');
    const matches = findInlineViewLabels(content);
    for (const match of matches) {
      failures.push({
        file: path.relative(archiveDir, file).replace(/\\/g, '/'),
        id: question.id,
        field: 'content',
        value: content.slice(Math.max(0, match.index - 40), match.index + match.value.length + 40)
      });
    }
  }
}

const summary = {
  files: fileCount,
  questions: questionCount,
  failures: failures.length,
  report: failures
};

if (asJson) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log(`대상 ${fileCount}개 파일 / ${questionCount}문항`);
  console.log(`인라인 보기 라벨 오류 ${failures.length}건`);
  for (const item of failures) {
    console.log(`[FAIL] ${item.file} q${item.id ?? '-'} ${item.field}: ${item.value}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(failures.length ? 1 : 0);
}

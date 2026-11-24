#!/usr/bin/env node
// pre-commit 검사: 스테이징된 archive/exams/**/*.js 에서 "새로 추가된 줄"의 그림 경로가 `archive/assets/...`로
// 시작하면 커밋을 막는다(정본 형태는 `assets/images/<시험지>/<파일>`, archive/exams/ 기준이 아니라 archive/ 기준).
// 이유: 시험지 게시 라인들이 main에 바로 올려 PR CI를 거치지 않아, 같은 실수가 세 번(#2774·#2798·#2804) 사후 수리됐다.
// 바뀐 파일의 추가된 줄만 보므로(수 초 안에 끝남) 이미 들어 있는 옛 줄 때문에 다른 수정이 막히지 않는다.
//
//   node tools/check-staged-exam-image-paths.mjs          스테이징된 변경 검사(훅이 부른다)
//   node tools/check-staged-exam-image-paths.mjs --all    작업 폴더의 시험지 JS 전체 검사(집계용, 막지 않고 개수만 낸다)
//
// 설치: node tools/install-image-path-guard-hook.mjs  (공용 .git/hooks/pre-commit 맨 앞에 한 블록을 넣는다)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { scanExamSource, describeHit } from '../archive/tools/exam-image-ref-lib.mjs';

const PATHSPEC = ':(glob)archive/exams/**/*.js';
const MAX_SHOWN = 20;

function git(args) {
  const result = spawnSync('git', ['-c', 'core.quotepath=off', ...args], { encoding: 'utf8', maxBuffer: 1 << 29 });
  if (result.status !== 0) throw new Error(`git ${args.join(' ')} 실패: ${(result.stderr || '').trim()}`);
  return result.stdout;
}

// `git diff --cached -U0` 출력에서 파일별 "추가된 줄 번호(새 파일 기준)" 집합을 만든다.
export function addedLinesByFile(diffText) {
  const files = new Map();
  let current = null;
  let line = 0;
  for (const row of diffText.split('\n')) {
    if (row.startsWith('+++ ')) {
      current = row === '+++ /dev/null' ? null : row.slice(4).replace(/^b\//, '');
      if (current && !files.has(current)) files.set(current, new Set());
      continue;
    }
    const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(row);
    if (hunk) { line = Number(hunk[1]); continue; }
    if (!current) continue;
    if (row.startsWith('+') && !row.startsWith('+++')) { files.get(current).add(line); line += 1; }
  }
  return files;
}

function checkStaged() {
  const diff = git(['diff', '--cached', '-U0', '--no-color', '--no-ext-diff', '--diff-filter=ACMR', '--', PATHSPEC]);
  const added = addedLinesByFile(diff);
  const violations = [];
  for (const [file, lines] of added) {
    if (!lines.size) continue;
    const staged = spawnSync('git', ['show', `:${file}`], { encoding: 'utf8', maxBuffer: 1 << 29 });
    if (staged.status !== 0) continue;
    for (const hit of scanExamSource(staged.stdout, { onlyLines: lines })) violations.push({ file, hit });
  }
  if (!violations.length) return 0;
  console.error(`[pre-commit] 그림 경로 오류 ${violations.length}곳: 시험지 JS의 그림 경로는 archive/ 없이 assets/images/<시험지>/<파일> 로 적어야 합니다.`);
  console.error('[pre-commit] 이유: archive/assets/... 로 적으면 학생 화면 그림 주소가 어긋납니다(#2774·#2798·#2804 사후 수리).');
  for (const { file, hit } of violations.slice(0, MAX_SHOWN)) console.error(`  ${path.basename(file)} ${describeHit(hit)}`);
  if (violations.length > MAX_SHOWN) console.error(`  … 외 ${violations.length - MAX_SHOWN}곳`);
  console.error('[pre-commit] 고치는 법: 해당 줄의 "archive/assets/" 를 "assets/" 로 바꾸고 다시 git add 하세요(다른 도구는 archive/tools/exam-image-ref-lib.mjs 의 canonicalExamImageRef 사용).');
  return 1;
}

function checkAll() {
  const files = git(['ls-files', '-z', '--', PATHSPEC]).split('\0').filter(Boolean);
  const perFile = [];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    if (!text.includes('archive/assets/')) continue;
    const hits = scanExamSource(text);
    if (hits.length) perFile.push({ file, hits });
  }
  const total = perFile.reduce((sum, row) => sum + row.hits.length, 0);
  for (const { file, hits } of perFile) console.log(`${path.basename(file)}: ${hits.length}곳 (예: ${describeHit(hits[0])})`);
  console.log(`검사 ${files.length}개 파일, 위반 ${total}곳 (${perFile.length}개 파일)`);
  return 0;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    process.exit(process.argv.includes('--all') ? checkAll() : checkStaged());
  } catch (error) {
    // 검사 도구 자체의 고장으로 커밋을 막지 않는다(알리고 통과). 막는 것은 위반이 확인됐을 때뿐이다.
    console.error(`[pre-commit] 그림 경로 검사를 실행하지 못했습니다(통과 처리): ${error.message}`);
    process.exit(0);
  }
}

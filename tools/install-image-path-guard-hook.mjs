#!/usr/bin/env node
// 공용 pre-commit 훅(<git 공용 폴더>/hooks/pre-commit) 맨 앞에 그림 경로 검사 한 블록을 넣는다. 여러 번 돌려도 한 번만 들어간다.
//   node tools/install-image-path-guard-hook.mjs            설치(이미 있으면 그대로)
//   node tools/install-image-path-guard-hook.mjs --check    들어 있는지만 확인(없으면 종료 코드 1)
//   node tools/install-image-path-guard-hook.mjs --hook <파일>   다른 훅 파일에 적용(시험용)
// 훅 파일은 Git에 올라가지 않으므로(.git 안) 검사 본체는 tools/check-staged-exam-image-paths.mjs 에 두고,
// 훅에는 그것을 부르는 블록만 넣는다. 검사 스크립트가 없는 작업 폴더에서는 블록이 조용히 건너뛴다.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

export const BEGIN = '# >>> image-path-guard (tools/install-image-path-guard-hook.mjs)';
export const END = '# <<< image-path-guard';
export const BLOCK = [
  BEGIN,
  '# 시험지 JS 그림 경로가 archive/assets/... 로 시작하면 커밋을 막는다(정본: assets/images/<시험지>/<파일>).',
  'if [ -f tools/check-staged-exam-image-paths.mjs ]; then',
  '  node tools/check-staged-exam-image-paths.mjs || exit 1',
  'fi',
  END,
  ''
].join('\n');

// 훅 본문에 블록을 넣은 새 본문. 이미 있으면 그대로(같은 문자열).
export function withGuardBlock(hookText) {
  const text = String(hookText).replace(/\r\n/g, '\n');
  if (text.includes(BEGIN)) return text;
  const lines = text.split('\n');
  const at = lines[0] && lines[0].startsWith('#!') ? 1 : 0;
  lines.splice(at, 0, BLOCK.replace(/\n$/, ''));
  return lines.join('\n');
}

function defaultHookPath() {
  const result = spawnSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error('git 공용 폴더를 찾지 못했습니다');
  return path.join(result.stdout.trim(), 'hooks', 'pre-commit');
}

function main() {
  const args = process.argv.slice(2);
  const at = args.indexOf('--hook');
  const hook = at >= 0 ? path.resolve(args[at + 1]) : defaultHookPath();
  const text = fs.existsSync(hook) ? fs.readFileSync(hook, 'utf8') : '#!/bin/sh\n';
  const present = text.includes(BEGIN);
  if (args.includes('--check')) {
    console.log(`${hook}: ${present ? '설치됨' : '설치 안 됨'}`);
    process.exit(present ? 0 : 1);
  }
  if (present) { console.log(`${hook}: 이미 설치됨`); return; }
  fs.writeFileSync(hook, withGuardBlock(text), { mode: 0o755 });
  console.log(`${hook}: 그림 경로 검사 블록을 넣었습니다`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

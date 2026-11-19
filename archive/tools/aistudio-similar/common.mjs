// 공용: 하네스(similar-import) 위치, 원본 시험지 읽기, 인자 파싱.
// 하네스(archive/tools/similar-import)는 이 저장소에 있다. 기본값은 이 파일 기준 저장소 루트이고, 다른 체크아웃을 쓰려면 SIMILAR_HARNESS로 지정한다.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';

export const HARNESS = process.env.SIMILAR_HARNESS || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
export const WORK_ROOT = process.env.SIMILAR_PILOT_WORK || 'C:/AI_WS/tmp/similar-pilot';
export const CIRCLED = ['①', '②', '③', '④', '⑤'];

export const harnessUrl = name => pathToFileURL(path.join(HARNESS, 'archive/tools/similar-import', name)).href;
export const lib = () => import(harnessUrl('lib.mjs'));
export const choiceLib = () => import(harnessUrl('choice-order-lib.mjs'));

export function gitShow(repoPath) {
  try {
    return execFileSync('git', ['-C', HARNESS, 'show', `origin/main:${repoPath}`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    const p = path.join(HARNESS, repoPath); // 러너 체크아웃에 있는 파일로 대체
    if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8');
    throw new Error(`원본을 읽을 수 없습니다: ${repoPath}`);
  }
}

export function bankFromText(text, name = 'exam.js') {
  const ctx = { window: {} };
  vm.createContext(ctx);
  new vm.Script(text, { filename: name }).runInContext(ctx);
  if (!Array.isArray(ctx.window.questionBank)) throw new Error(`BANK_NOT_ARRAY: ${name}`);
  return { bank: ctx.window.questionBank, examTitle: ctx.window.examTitle, examDisplayTitle: ctx.window.examDisplayTitle };
}

export const readBankFile = p => bankFromText(fs.readFileSync(p, 'utf8'), p);
export const stemOf = p => path.basename(p, '.js');
export const originalStemOf = stem => stem.replace(/_유사\d*$/, '');

/** 유사 시험지 stem 에 대응하는 원본 기출의 저장소 경로를 찾는다. */
export function findOriginalPath(stem) {
  const name = `${originalStemOf(stem)}.js`;
  const out = execFileSync('git', ['-C', HARNESS, 'ls-tree', '-r', '--name-only', 'origin/main', 'archive/exams/original/'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const hits = out.split('\n').map(s => s.trim()).filter(l => l.endsWith('/' + name));
  if (hits.length !== 1) throw new Error(`원본 기출을 하나로 정할 수 없습니다(${hits.length}개): ${name}. --original 로 알려 주세요.`);
  return hits[0];
}

export function parseArgs(argv, boolFlags = []) {
  const pos = []; const opt = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      if (boolFlags.includes(a)) opt[a] = true;
      else opt[a] = argv[++i];
    } else pos.push(a);
  }
  return { pos, opt };
}

export const isMain = metaUrl => Boolean(process.argv[1]) && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(metaUrl));

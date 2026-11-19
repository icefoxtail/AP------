#!/usr/bin/env node
// 사용법: node archive/tools/similar-import/build-selection-tables.mjs --write [--out <dir>]   선택표를 등록부에서 만들어 쓴다
//         node archive/tools/similar-import/build-selection-tables.mjs --check [--out <dir>]   쓰인 선택표가 등록부와 같은지 본다 (다르면 종료 1)
// 선택표: 학교급·학년·과목(과목 묶음 id)마다 마크다운 한 벌. 단원 -> 소단원 · RPM 행 · 유형(PT -> TPL) 을 한 곳에 모아
// 판정자가 개념 단어(한글 이름)로 찾아 고르게 한다. 손으로 쓰지 않는다 (등록부가 바뀌면 다시 만든다). ACTIVE 키만 싣는다.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_REPO_ROOT, COURSE_UNIT_PREFIXES, buildAllSelections, lowerGroupIds, groupPts, parseCli } from './lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const SELECTION_DIR = path.join(__dirname, 'selection');
export const MAX_FILE_BYTES = 300 * 1024;
export const selectionFileName = id => `${id}.md`;

const curriculumLabel = id => Object.keys(COURSE_UNIT_PREFIXES[id] || {}).map(c => `${c} 개정`).join('·');

function ptLines(p, indent = '') {
  const out = [`${indent}- \`${p.problemTypeKey}\` **${p.label}**${p.definition ? ` — ${p.definition}` : ''}`];
  for (const t of p.templates) out.push(`${indent}  - \`${t.templateKey}\` ${t.label}`);
  return out;
}

export function renderSelection(sel, all) {
  const lines = [
    `# 선택표 · ${sel.members[0]} (${sel.id}) · ${sel.grade} · ${curriculumLabel(sel.id)}`,
    '',
    '등록부에서 만든 문서다. 손으로 고치지 않는다 (`build-selection-tables.mjs --write`).',
    '판정은 이 표의 키만 쓴다. 개념 단어(한글 이름)로 Ctrl+F 로 먼저 찾고, 없을 때만 NONE + 새 키 제안을 쓴다.',
    '단원 키는 단원 제목의 키, 소단원·RPM 행은 그 단원 안에서 고른다. 유형(PT)과 템플릿(TPL)은 그 단원 것이 먼저이고, 맨 끝 "아래 학년 유형" 의 키도 쓸 수 있다.',
    '',
    '## 단원 목차',
    '',
    ...sel.units.map(u => `- \`${u.standardUnitKey}\` ${u.label} (소단원 ${u.subUnits.length} · RPM ${u.rpm.length} · 유형 ${u.problemTypes.length})`),
    '',
  ];
  for (const u of sel.units) {
    lines.push(`## ${u.standardUnitKey} ${u.label}`, '', '### 소단원', '');
    lines.push(...(u.subUnits.length ? u.subUnits.map(s => `- \`${s.subUnitKey}\` ${s.label}`) : ['- (없음)']), '');
    lines.push('### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다', '');
    const curricula = [...new Set(u.rpm.map(r => r.curriculum))].sort();
    if (!curricula.length) lines.push('- (없음)', '');
    for (const c of curricula) {
      lines.push(`**${c} 개정**`, '');
      for (const r of u.rpm.filter(x => x.curriculum === c)) lines.push(`- \`${r.id}\` ${r.path}${r.subUnitKey ? ` · \`${r.subUnitKey}\`` : ''}`);
      lines.push('');
    }
    lines.push('### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)', '');
    if (u.problemTypes.length) for (const p of u.problemTypes) lines.push(...ptLines(p));
    else lines.push('- (이 단원에 묶인 유형이 아직 없다)');
    lines.push('');
  }
  lines.push('## 아래 학년 유형', '', '학년이 같거나 낮은 다른 과목의 유형도 쓸 수 있다 (키의 학년이 시험지 학년 이하이면 받는다). 키 순서이고, 정의·TPL 은 그 과목의 선택표 파일에 있다.', '');
  const lower = lowerGroupIds(sel, all);
  if (!lower.length) lines.push('(없음)', '');
  for (const id of lower) {
    const g = all.get(id);
    lines.push(`### ${g.members[0]} (${g.id}) · ${g.grade} — 파일 \`${selectionFileName(g.id)}\``, '');
    for (const p of groupPts(g)) lines.push(`- \`${p.problemTypeKey}\` ${p.label}${p.templates.length ? ` (TPL ${p.templates.length})` : ''}`);
    lines.push('');
  }
  return lines.join('\n').replace(/\n+$/, '\n');
}

/** { 파일이름 -> 내용 }. 등록부가 같으면 내용도 같다 (시각·경로를 넣지 않는다). */
export function buildSelectionFiles(repoRoot = DEFAULT_REPO_ROOT, all = buildAllSelections(repoRoot)) {
  const files = new Map();
  for (const sel of all.values()) {
    const text = renderSelection(sel, all);
    if (Buffer.byteLength(text) > MAX_FILE_BYTES) throw new Error(`SELECTION_TOO_LARGE: ${sel.id} 선택표가 ${MAX_FILE_BYTES}바이트를 넘었습니다. 단원 묶음으로 나누도록 도구를 고치세요.`);
    files.set(selectionFileName(sel.id), text);
  }
  return files;
}

export function writeSelectionFiles(outDir, files) {
  fs.mkdirSync(outDir, { recursive: true });
  for (const [name, text] of files) fs.writeFileSync(path.join(outDir, name), text, 'utf8');
}

/** 디스크의 선택표와 등록부에서 새로 만든 것을 비교한다. 문제 목록(빈 배열이면 같다). */
export function diffSelectionFiles(outDir, files) {
  const problems = [];
  const onDisk = fs.existsSync(outDir) ? fs.readdirSync(outDir).filter(f => f.endsWith('.md')) : [];
  for (const [name, text] of files) {
    const f = path.join(outDir, name);
    if (!fs.existsSync(f)) problems.push(`없음: ${name}`);
    else if (fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n') !== text) problems.push(`등록부와 다름: ${name}`);
  }
  for (const name of onDisk) if (!files.has(name)) problems.push(`등록부에 없는 파일: ${name}`);
  return problems;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  const { opt } = parseCli(a, ['--write', '--check']);
  const outDir = path.resolve(opt('--out') || SELECTION_DIR);
  if (!a.includes('--write') && !a.includes('--check')) {
    console.error('Usage: node build-selection-tables.mjs --write|--check [--out <dir>]');
    process.exit(1);
  }
  try {
    const files = buildSelectionFiles();
    if (a.includes('--write')) {
      writeSelectionFiles(outDir, files);
      for (const [name, text] of files) console.log(`${name}\t${Buffer.byteLength(text)} bytes`);
    } else {
      const problems = diffSelectionFiles(outDir, files);
      if (problems.length) { console.error(`선택표가 등록부와 다릅니다. --write 로 다시 만드세요.\n${problems.join('\n')}`); process.exit(1); }
      console.log(`선택표 ${files.size}개가 등록부와 같습니다.`);
    }
  } catch (e) {
    console.error('ERROR:', e.message);
    process.exit(1);
  }
}

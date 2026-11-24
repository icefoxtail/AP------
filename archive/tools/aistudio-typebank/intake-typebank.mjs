#!/usr/bin/env node
// 사용법: node archive/tools/aistudio-typebank/intake-typebank.mjs <merged.js> --target <target.json> --stem <stem> [--types-dir <폴더>] [--todo <figures-todo.json>] [--force]
// merged.js: merge-prompt.cjs 가 AI Studio 대화 파일에서 꺼낸 결과. target.json: prep-typebank.mjs 가 만든 목표.
// 하는 일: 5문항·id·정답 번호 계획·보기 크기순·꼴 누설(lint-similar 재사용) + 메타 키가 목표·메뉴 안인지 확인,
//   [그림:]/[해설그림:] 을 본문에서 떼어 그림 할 일 목록으로 옮기고, archive/exams/types/high/h2/<stem>.js 를 쓴다.
// 오류가 하나라도 있으면 파일을 쓰지 않는다(--force 로 오류 있어도 쓸 수 있으나 병합 금지). 흐름: docs/agents/aistudio-similar.md "유형 채우기(TYPE_BANK)".
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { TYPES_DIR, INTEGRATION_PATTERNS, SUBJECTS, loadMenus, parseArgs, isMain, bankFromText, CIRCLED } from './common.mjs';
import { lintSimilar } from '../aistudio-similar/lint-similar.mjs';

// 출력에 남기는 칸(허용 목록). 이 밖의 칸은 버리고 경고한다(CI 후보 검사의 UNKNOWN_METADATA_FIELD 방지).
const FIELD_ORDER = [
  'id', 'questionType', 'layoutTag', 'tags', 'wide', 'content', 'choices', 'answer', 'solution',
  'standardCourse', 'standardUnitKey', 'standardUnit', 'standardUnitOrder', 'curriculum', 'subUnitKey', 'subUnit',
  'rpmPrimaryRecordId', 'problemTypeKey', 'templateKey', 'primaryMethod', 'decisiveStep',
  'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility',
  'crossConceptKeys', 'conditionKeys', 'integrationPattern',
];
const FORBIDDEN = ['level', 'score', 'rpmPrimaryL1', 'rpmPrimaryL2', 'rpmPrimaryL3', 'rpmPrimaryL4', 'rpmPrimary', 'rpmPrimaryRecordIds', 'curriculumKey', 'ptTplCandidate', 'difficultyBasis', 'levelBasis'];

/** `[태그: ...]` 를 대괄호 짝을 세어 꺼낸다(설명 안의 [0,2] 같은 구간 표기 때문에 정규식으로는 안 된다). */
export function extractMarkers(text, tag) {
  const open = `[${tag}`;
  const specs = []; let out = ''; let i = 0; const s = String(text ?? '');
  while (i < s.length) {
    const at = s.indexOf(open, i);
    if (at < 0 || !/^\s*:/.test(s.slice(at + open.length, at + open.length + 4))) { out += s.slice(i); break; }
    out += s.slice(i, at);
    let depth = 0; let j = at;
    for (; j < s.length; j++) { if (s[j] === '[') depth++; else if (s[j] === ']') { depth--; if (depth === 0) break; } }
    if (depth !== 0) { out += s.slice(at); break; } // 닫히지 않음 — 그대로 둬서 아래 검사가 잡는다
    specs.push(s.slice(at + open.length, j).replace(/^\s*:\s*/, '').trim());
    i = j + 1;
  }
  return { text: out.replace(/[ \t]+$/gm, '').replace(/\s+$/, ''), specs };
}

const digitsFree = s => String(s ?? '').replace(/\$/g, '').replace(/\d+/g, '#').replace(/\s+/g, '');
function bigrams(s) { const t = digitsFree(s); const m = new Set(); for (let i = 0; i < t.length - 1; i++) m.add(t.slice(i, i + 2)); return m; }
const jaccard = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };

export async function intakeTypebank({ mergedPath, targetPath, stem, typesDir = TYPES_DIR, todoPath = null, force = false }) {
  const target = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
  const issues = [];
  const add = (qid, level, code, msg) => issues.push({ qid, level, code, msg });
  if (stem !== target.stem) add(null, 'ERROR', 'STEM', `--stem ${stem} ≠ target.stem ${target.stem} (요청문에 적힌 이름과 같아야 한다)`);
  const cfg = SUBJECTS[target.subject];

  // 1) lint-similar 재사용: 임시 사본에서 \frac→\dfrac 고치고 검사
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'typebank-'));
  const tmpJs = path.join(tmpDir, `${stem}.js`);
  fs.copyFileSync(mergedPath, tmpJs);
  const lint = await lintSimilar({ jsPath: tmpJs, targetPath, fix: true });
  for (const i of lint.issues) {
    if (i.code === 'FIGURE_NOTE') continue; // 아래에서 할 일 목록으로 바꾼다
    add(i.qid, i.level, i.code, i.msg);
  }
  const bank = lint.bank;
  if (!bank.length) return { ok: false, issues, written: null, todo: [] };

  // 2) 메타 키 검사
  const menus = loadMenus(cfg);
  const shown = target.menu || {};
  const tplOk = new Set(target.templateKeys);
  const rpmOk = new Set(target.rpmIds);
  for (const q of bank) {
    const id = q.id;
    const fixed = { curriculum: target.curriculum, standardCourse: target.standardCourse, standardUnitKey: target.standardUnitKey, problemTypeKey: target.problemTypeKey };
    for (const [k, v] of Object.entries(fixed)) if (q[k] !== v) add(id, 'ERROR', 'META_FIXED', `${k}=${JSON.stringify(q[k])} 는 목표 ${JSON.stringify(v)} 이어야 한다`);
    if ((q.subUnitKey ?? null) !== (target.subUnitKey ?? null)) add(id, 'ERROR', 'META_FIXED', `subUnitKey=${JSON.stringify(q.subUnitKey)} 는 목표 ${JSON.stringify(target.subUnitKey)} 이어야 한다`);
    if (!tplOk.has(q.templateKey)) add(id, 'ERROR', 'META_TPL', `templateKey=${q.templateKey} 는 목표 ${[...tplOk].join('|')} 중 하나여야 한다`);
    if (!rpmOk.has(q.rpmPrimaryRecordId)) add(id, 'ERROR', 'META_RPM', `rpmPrimaryRecordId=${q.rpmPrimaryRecordId} 는 목표 ${[...rpmOk].join('|')} 중 하나여야 한다`);
    for (const k of ['primaryMethod', 'decisiveStep']) if (typeof q[k] !== 'string' || q[k].trim().length < 8) add(id, 'ERROR', 'META_TEXT', `${k} 가 비었거나 너무 짧다`);
    if (!Number.isInteger(q.difficultyBucket) || q.difficultyBucket < 1 || q.difficultyBucket > 5) add(id, 'ERROR', 'META_DIFFICULTY', `difficultyBucket=${JSON.stringify(q.difficultyBucket)} 는 1~5 정수여야 한다`);
    const role = id === 1 ? [1, 2] : id <= 3 ? [2, 3] : [3, 5];
    if (Number.isInteger(q.difficultyBucket) && (q.difficultyBucket < role[0] || q.difficultyBucket > role[1])) add(id, 'WARN', 'DIFFICULTY_ROLE', `${id}번 난이도 ${q.difficultyBucket} 가 역할 범위 ${role[0]}~${role[1]} 밖`);
    if (!INTEGRATION_PATTERNS.includes(q.integrationPattern)) add(id, 'ERROR', 'META_PATTERN', `integrationPattern=${q.integrationPattern} 는 ${INTEGRATION_PATTERNS.join('|')} 중 하나여야 한다`);
    for (const [field, reg, key, max] of [['crossConceptKeys', menus.cc, 'crossConceptKeys', 3], ['conditionKeys', menus.cond, 'conditionKeys', 2]]) {
      const v = q[field];
      if (!Array.isArray(v)) { add(id, 'ERROR', 'META_KEYS', `${field} 는 배열이어야 한다`); continue; }
      if (v.length > max) add(id, 'WARN', 'META_KEYS_MANY', `${field} 가 ${v.length}개(권장 ${max}개 이하)`);
      for (const k of v) {
        if (!reg.has(k)) add(id, 'ERROR', 'META_KEY_UNKNOWN', `${field} 의 ${k} 는 등록부에 없다`);
        else if ((shown[key] || []).length && !shown[key].includes(k)) add(id, 'WARN', 'META_KEY_OFF_MENU', `${field} 의 ${k} 는 요청문 메뉴 밖(등록부에는 있음)`);
      }
    }
    for (const k of FORBIDDEN) if (k in q) add(id, 'WARN', 'FIELD_DROPPED', `${k} 칸은 쓰지 않는다(버림)`);
    for (const k of Object.keys(q)) if (!FIELD_ORDER.includes(k) && !FORBIDDEN.includes(k)) add(id, 'WARN', 'FIELD_UNKNOWN', `알 수 없는 칸 ${k} (버림)`);
  }

  // 3) 문항끼리 겹침: 숫자만 바꾼 변형은 오류
  for (let a = 0; a < bank.length; a++) {
    for (let b = a + 1; b < bank.length; b++) {
      const da = digitsFree(bank[a].content); const db = digitsFree(bank[b].content);
      if (da && da === db) add(bank[b].id, 'ERROR', 'NUMBER_SWAP_ONLY', `${bank[a].id}번과 숫자만 다른 같은 발문`);
      else if (jaccard(bigrams(bank[a].content), bigrams(bank[b].content)) > 0.85) add(bank[b].id, 'WARN', 'SIMILAR_STEM', `${bank[a].id}번과 발문이 매우 비슷하다(구조변형 맞는지 확인)`);
    }
  }

  // 4) 그림 표식 → 할 일 목록, 본문에서 제거
  const todo = [];
  const outBank = bank.map(q => {
    const c = extractMarkers(q.content, '그림');
    const s = extractMarkers(q.solution, '해설그림');
    for (const spec of c.specs) todo.push({ qid: q.id, kind: 'problem', spec });
    for (const spec of s.specs) todo.push({ qid: q.id, kind: 'solution', spec });
    // 같은 표식이 보기·다른 칸에 남아 있으면 오류
    for (const f of ['choices', 'answer', 'primaryMethod', 'decisiveStep']) if (/\[(해설)?그림\s*:/.test(JSON.stringify(q[f] ?? ''))) add(q.id, 'ERROR', 'FIGURE_MARK_MISPLACED', `${f} 안에 [그림:] 표식이 있다`);
    if (/\[(해설)?그림\s*:/.test(c.text + s.text)) add(q.id, 'ERROR', 'FIGURE_MARK_BROKEN', '[그림:] 표식의 대괄호가 닫히지 않았거나 해설에 [그림:](문제용)이 있다');
    if (c.specs.some(x => x.length < 15)) add(q.id, 'WARN', 'FIGURE_SPEC_THIN', '[그림:] 설명이 짧다(점·좌표·길이·강조할 것을 정확히)');
    if (!c.specs.length && /그림과 같|다음 그림|아래 그림|위의 그림/.test(c.text)) add(q.id, 'ERROR', 'FIGURE_MISSING_SPEC', '발문이 그림을 가리키는데 [그림:] 설명이 없다');
    const o = {
      ...q, content: c.text, solution: s.text,
      layoutTag: 'grid', tags: [], wide: false,
      standardUnit: target.standardUnit, standardUnitOrder: target.standardUnitOrder,
      ...(target.subUnit ? { subUnit: target.subUnit } : {}),
      difficultyConfidence: 'medium', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL',
    };
    const ordered = {};
    for (const k of FIELD_ORDER) if (k in o) ordered[k] = o[k];
    return ordered;
  });

  const errors = issues.filter(i => i.level === 'ERROR');
  let written = null;
  if (!errors.length || force) {
    const dest = path.join(typesDir, `${stem}.js`);
    if (fs.existsSync(dest) && !force) add(null, 'ERROR', 'EXISTS', `이미 있다: ${dest} (다음 회차 번호를 쓰거나 --force)`);
    else {
      fs.mkdirSync(typesDir, { recursive: true });
      fs.writeFileSync(dest, `window.examTitle = ${JSON.stringify(stem)};\n\nwindow.questionBank = ${JSON.stringify(outBank, null, 2)};\n`, 'utf8');
      written = dest;
    }
  }
  const todoOut = todoPath || path.join(path.dirname(path.resolve(mergedPath)), `${stem}.figures-todo.json`);
  if (written || todo.length) fs.writeFileSync(todoOut, JSON.stringify({ stem, file: written, items: todo }, null, 2) + '\n', 'utf8');
  fs.rmSync(tmpDir, { recursive: true, force: true });
  return { ok: !issues.some(i => i.level === 'ERROR'), issues, written, todo, todoPath: todo.length ? todoOut : null, dist: lint.dist };
}

if (isMain(import.meta.url)) {
  const { pos, opt } = parseArgs(process.argv.slice(2), ['--force']);
  if (!pos[0] || !opt['--target'] || !opt['--stem']) {
    console.error('Usage: node intake-typebank.mjs <merged.js> --target <target.json> --stem <stem> [--types-dir <폴더>] [--todo <out.json>] [--force]');
    process.exit(1);
  }
  const r = await intakeTypebank({ mergedPath: path.resolve(pos[0]), targetPath: path.resolve(opt['--target']), stem: opt['--stem'], typesDir: opt['--types-dir'] ? path.resolve(opt['--types-dir']) : TYPES_DIR, todoPath: opt['--todo'] ? path.resolve(opt['--todo']) : null, force: Boolean(opt['--force']) });
  const errs = r.issues.filter(i => i.level === 'ERROR'); const warns = r.issues.filter(i => i.level === 'WARN');
  console.log(`intake ${opt['--stem']}: 오류 ${errs.length}, 경고 ${warns.length}`);
  for (const i of [...errs, ...warns]) console.log(`${i.level === 'ERROR' ? 'ERROR' : 'warn '} ${i.qid ? 'Q' + i.qid : '세트'} ${i.code}: ${i.msg}`);
  if (r.written) console.log(`쓴 파일: ${r.written}${errs.length ? ' (--force: 오류가 있어 병합 금지)' : ''}`);
  else console.log('파일을 쓰지 않았다(오류를 고치고 다시 합쳐서 돌린다).');
  if (r.todo.length) {
    console.log(`그림 할 일 ${r.todo.length}건 → ${r.todoPath}`);
    for (const t of r.todo) console.log(`  Q${t.qid} ${t.kind === 'problem' ? '문제그림' : '해설그림'}: ${t.spec}`);
    console.log('HOLD_FIGURES: 그림이 붙기 전에는 PR·병합하지 않는다(그림 없는 문제가 학생에게 보인다).');
  }
  console.log('4칸(item-4slot)은 만들지 않는다: 용어 사전 번호와 근거가 필요해 4slot 라인 몫이다(없어도 학생 접근은 막히지 않는다).');
  process.exit(errs.length ? 1 : 0);
}

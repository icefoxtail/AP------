// 4칸 제출 파일 검사. node validate-4slot.cjs <file.4slot.json> [사전경로]
// 실패(종료코드 1): JSON·필드·문항 누락·인용 불일치·사전 밖 용어(후보 미선언)·format·evidence.
// 한 칸 안에 같은 용어(동의어를 풀어 같은 번호)가 두 번 있으면 FAIL. dictionaryVersion은 v1.3·v1.4·v1.5만 허용(옛 출력은 v1.3).
// 경고(종료코드 0, 다시 보기): goal 방법어, 용어 4개 이하, method 1개, 같은 4칸 문항, method의 사칙연산.
const fs = require('fs'), path = require('path');
const { loadExam } = require('./exam-items.cjs');
const [file, dictArg] = process.argv.slice(2);
const root = process.cwd();
const dictPath = dictArg || 'docs/architecture/4slot/term-dictionary-v1.5.json';
const dict = JSON.parse(fs.readFileSync(path.join(root, dictPath), 'utf8'));
const norm = s => String(s).replace(/[\s·()\[\]]/g, '');
const lut = new Map();
for (const t of dict.terms) for (const s of [t.ko, ...(t.synonyms || [])]) if (!lut.has(norm(s))) lut.set(norm(s), t);
const OK_DICT_VERSIONS = ['term-dict-v1.3-2026-11-03', 'term-dict-v1.4-2026-11-03', 'term-dict-v1.5-2026-11-04'];
const FORMATS = ['단일 정답', '옳은 것 고르기', '옳지 않은 것 고르기', '보기(ㄱㄴㄷ) 판정', '보기 판정', '빈칸 채우기', '단답', '서술', '증명', '소문항 묶음'];
const ACTION = ['대입', '계산', '치환', '정리', '적용', '변형', '구하기', '확인'];
const SLOTS = ['given', 'goal', 'method', 'condition'];
const fail = [], warn = [];
const d = JSON.parse(fs.readFileSync(file, 'utf8'));
for (const k of ['schemaVersion', 'sourceArchiveFile', 'sourceGitBlobSha', 'dictionaryVersion', 'judgedBy', 'items', 'candidates', 'selfCheck']) if (!(k in d)) fail.push('missing field ' + k);
if ('dictionaryVersion' in d && !OK_DICT_VERSIONS.includes(d.dictionaryVersion)) fail.push('dictionaryVersion ' + d.dictionaryVersion + ' not in ' + OK_DICT_VERSIONS.join('|'));
const exam = loadExam(path.join(root, 'archive/exams', d.sourceArchiveFile));
const byOrd = new Map(exam.map(q => [String(q.ordinal), q]));
const cand = new Map((d.candidates || []).map(c => [norm(c.term), c]));
for (const c of d.candidates || []) for (const k of ['term', 'en', 'synonyms', 'kind', 'parent', 'note', 'usedIn']) if (!(k in c)) fail.push(`candidate ${c.term} missing ${k}`);
for (const c of d.candidates || []) if (lut.has(norm(c.term))) warn.push(`candidate ${c.term} is already in dictionary (${lut.get(norm(c.term)).ko})`);
const seen = new Set(), vecs = new Map(); let quotes = 0;
for (const it of d.items || []) {
  const o = String(it.sourceOrdinal), q = byOrd.get(o);
  if (!q) { fail.push(`#${o} not in exam`); continue; }
  if (seen.has(o)) fail.push(`#${o} duplicated`); seen.add(o);
  if (!FORMATS.includes(it.format)) fail.push(`#${o} bad format ${it.format}`);
  const sl = it.slots || {};
  if (!(sl.goal || []).length) fail.push(`#${o} empty goal`);
  if (!(sl.method || []).length) fail.push(`#${o} empty method`);
  const v = new Set();
  for (const s of SLOTS) {
    const inSlot = new Map();
    for (const e of sl[s] || []) {
      const t0 = lut.get(norm(e.term)), k0 = t0 ? 'T' + t0.id : 'C:' + norm(e.term);
      inSlot.set(k0, (inSlot.get(k0) || 0) + 1);
      if (inSlot.get(k0) === 2) fail.push(`#${o} ${s} ${e.term}: duplicate term in one slot${t0 && t0.ko !== e.term ? ' (= ' + t0.ko + ')' : ''}`);
    }
  }
  for (const s of SLOTS) for (const e of sl[s] || []) {
    quotes++;
    const src = e.src === 'stem' ? q.stem : e.src === 'solution' ? q.solution : null;
    const ok = e.src === 'choices' ? q.choices.some(c => String(c).includes(e.quote)) : (src != null && e.quote && src.includes(e.quote));
    if (!ok) fail.push(`#${o} ${s} ${e.term}: quote not found [${e.src}] ${String(e.quote).slice(0, 40)}`);
    const t = lut.get(norm(e.term));
    if (!t && !cand.has(norm(e.term))) fail.push(`#${o} ${s} ${e.term}: not in dictionary and not declared as candidate`);
    if (t && t.status === 'RETIRED') fail.push(`#${o} ${s} ${e.term}: RETIRED term`);
    if (s === 'method') { if (!['NAMED', 'IMPLIED'].includes(e.evidenceType)) fail.push(`#${o} method ${e.term}: evidenceType`); if (e.evidenceType === 'IMPLIED' && !e.justification) fail.push(`#${o} method ${e.term}: IMPLIED without justification`); }
    if (s === 'method' && t && t.ko === '사칙연산') warn.push(`#${o} method has 사칙연산 (단원 목표가 계산 자체일 때만 허용)`);
    if (s === 'goal' && ACTION.includes(e.term)) warn.push(`#${o} goal has action word ${e.term}`);
    v.add(t ? 'T' + t.id : 'C:' + norm(e.term));
  }
  const g = sl.goal || [];
  if (g.length && g.every(e => (lut.get(norm(e.term)) || {}).kind === '방법')) warn.push(`#${o} goal only 방법 terms`);
  if (v.size <= 4) warn.push(`#${o} only ${v.size} distinct terms`);
  if ((sl.method || []).length === 1) warn.push(`#${o} method has 1 term`);
  const key = [...v].sort().join(','); if (vecs.has(key)) warn.push(`#${o} same 4-slot set as #${vecs.get(key)}`); else vecs.set(key, o);
}
for (const q of exam) if (!seen.has(String(q.ordinal))) fail.push(`#${q.ordinal} missing`);
console.log(JSON.stringify({ file: path.basename(file), items: (d.items || []).length, examItems: exam.length, quotes, fail: fail.length, warn: warn.length }));
for (const x of fail) console.log('FAIL ' + x); for (const x of warn) console.log('WARN ' + x);
process.exit(fail.length ? 1 : 0);

// archive/data/item-4slot/ 아래 compact 4칸 파일의 결함 검사. 개수는 세지 않는다(계속 늘어나는 운영 데이터).
// 결함 조건: JSON 깨짐, schemaVersion·필수 필드 누락, 사전에 없거나 RETIRED인 용어 번호, 한 칸 안 중복 번호,
//            goal·method 비어 있음, 문항 번호 중복/시험지 문항과 불일치.
// 시험지가 그사이 수정되어 blob가 달라진 것은 실패가 아니다(다른 세션의 정상 수정이 해시 고정값을 깨서 main CI가 막힌 전례가 있다).
// 그런 파일은 STALE 안내만 출력한다. 재검 방법: docs/operations/JS_Archive_4Slot_Review_and_Main_Import_CURRENT_v1.md §7.
'use strict';
const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { loadExam } = require('../tools/4slot/exam-items.cjs');
const { numberKey, loadBank } = require('../tools/4slot/build-4slot-runtime.cjs');

const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'archive/data/item-4slot');
const SCHEMA = 'archive-meta-4slot-compact-v1';
const SLOTS = ['given', 'goal', 'method', 'condition'];
const DICT_BY_VERSION = {
  'term-dict-v1.3-2026-11-03': 'docs/architecture/4slot/term-dictionary-v1.3.json',
  'term-dict-v1.4-2026-11-03': 'docs/architecture/4slot/term-dictionary-v1.4.json',
  'term-dict-v1.5-2026-11-04': 'docs/architecture/4slot/term-dictionary-v1.5.json'
};
const FORMATS = ['단일 정답', '옳은 것 고르기', '옳지 않은 것 고르기', '보기(ㄱㄴㄷ) 판정', '보기 판정', '빈칸 채우기', '단답', '서술', '증명', '소문항 묶음'];

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out.sort();
}

const dictCache = new Map();
function dictionary(version) {
  if (!dictCache.has(version)) {
    const rel = DICT_BY_VERSION[version];
    if (!rel) return null;
    const dict = JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
    dictCache.set(version, new Map(dict.terms.map(t => [t.id, t])));
  }
  return dictCache.get(version);
}

function gitBlob(file) {
  const buf = fs.readFileSync(file);
  return crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${buf.length}\0`), buf])).digest('hex');
}

const problems = [];
const stale = [];
let files = [];
if (fs.existsSync(dataDir)) files = walk(dataDir);

for (const file of files) {
  const rel = path.relative(root, file).split(path.sep).join('/');
  const bad = msg => problems.push(`${rel}: ${msg}`);
  if (!rel.endsWith('.4slot.json')) { bad('unexpected file (only *.4slot.json allowed)'); continue; }
  let d;
  try { d = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { bad('JSON parse error ' + e.message); continue; }
  if (d.schemaVersion !== SCHEMA) bad(`schemaVersion ${d.schemaVersion} != ${SCHEMA}`);
  for (const k of ['sourceArchiveFile', 'sourceGitBlobSha', 'dictionaryVersion', 'evidence', 'reviewedBy', 'items']) if (!(k in d)) bad('missing field ' + k);
  if (d.evidence) for (const k of ['branch', 'commit', 'path']) if (!d.evidence[k] || typeof d.evidence[k] !== 'string') bad('evidence.' + k + ' missing');
  if (d.reviewedBy) {
    if (!d.reviewedBy.agent || typeof d.reviewedBy.agent !== 'string') bad('reviewedBy.agent missing');
    if (!d.reviewedBy.at) bad('reviewedBy.at missing');
    if (!Array.isArray(d.reviewedBy.sampled)) bad('reviewedBy.sampled must be an array');
  }
  const expectedRel = 'archive/data/item-4slot/' + String(d.sourceArchiveFile).replace(/\.js$/, '.4slot.json');
  if (rel !== expectedRel) bad(`path does not match sourceArchiveFile (expected ${expectedRel})`);
  const dict = dictionary(d.dictionaryVersion);
  if (!dict) { bad('unknown dictionaryVersion ' + d.dictionaryVersion); continue; }
  if (!Array.isArray(d.items) || !d.items.length) { bad('items empty'); continue; }

  const ords = new Set(), positions = new Set();
  for (const it of d.items) {
    const at = `#${it.ordinal}`;
    if (!Number.isInteger(it.ordinal)) { bad(`${at}: ordinal is not an integer`); continue; }
    let label;try { label=numberKey(it.sourceQuestionNo??it.ordinal); } catch { bad(`${at}: invalid source question number`); continue; }
    if (ords.has(label)||positions.has(it.ordinal)) bad(`${at}: duplicate ordinal`);
    ords.add(label);positions.add(it.ordinal);
    if (!FORMATS.includes(it.format)) bad(`${at}: bad format ${it.format}`);
    for (const s of SLOTS) {
      const ids = it[s];
      if (!Array.isArray(ids)) { bad(`${at}: ${s} is not an array`); continue; }
      const seen = new Set();
      for (const id of ids) {
        if (!Number.isInteger(id)) { bad(`${at}: ${s} has non-integer id ${id}`); continue; }
        const t = dict.get(id);
        if (!t) bad(`${at}: ${s} id ${id} not in ${d.dictionaryVersion}`);
        else if (t.status === 'RETIRED') bad(`${at}: ${s} id ${id} (${t.ko}) is RETIRED`);
        if (seen.has(id)) bad(`${at}: ${s} has duplicate id ${id}`);
        seen.add(id);
      }
    }
    if (Array.isArray(it.goal) && !it.goal.length) bad(`${at}: goal is empty`);
    if (Array.isArray(it.method) && !it.method.length) bad(`${at}: method is empty`);
    if (!Array.isArray(it.candidates) || it.candidates.some(c => typeof c !== 'string')) bad(`${at}: candidates must be an array of strings`);
  }

  const examFile = path.join(root, 'archive/exams', String(d.sourceArchiveFile));
  if (!fs.existsSync(examFile)) { bad('source exam does not exist: ' + d.sourceArchiveFile); continue; }
  const isStale = gitBlob(examFile) !== d.sourceGitBlobSha;
  let exam;
  try { exam = loadExam(examFile); } catch (e) { bad('cannot load exam: ' + e.message); continue; }
  const examOrds = loadBank(fs.readFileSync(examFile, 'utf8')).map(q => numberKey(q.id ?? q.number));
  for(const it of d.items)if(Object.hasOwn(it,'sourceQuestionNo')&&examOrds[it.ordinal-1]!==numberKey(it.sourceQuestionNo))bad(`#${it.ordinal}: named ordinal does not match source`);
  const missing = examOrds.filter(o => !ords.has(o));
  const extra = [...ords].filter(o => !examOrds.includes(o));
  if (missing.length || extra.length) {
    const msg = `ordinals differ from the exam (missing ${JSON.stringify(missing)}, extra ${JSON.stringify(extra)})`;
    if (isStale) stale.push(`${rel}: exam changed and ${msg}`);
    else bad(msg);
  } else if (isStale) {
    stale.push(`${rel}: exam blob changed since import`);
  }
}

if (stale.length) {
  console.log(`STALE notice (not a failure): ${stale.length} compact file(s) were made from an older exam text. Re-annotate when convenient (Review doc §7).`);
  for (const s of stale.slice(0, 20)) console.log('  STALE ' + s);
  if (stale.length > 20) console.log(`  ... and ${stale.length - 20} more`);
}
if (problems.length) {
  console.error(`item-4slot-data: ${problems.length} defect(s)`);
  for (const p of problems.slice(0, 50)) console.error('  FAIL ' + p);
  if (problems.length > 50) console.error(`  ... and ${problems.length - 50} more`);
}
assert.strictEqual(problems.length, 0, 'item-4slot data defects found');
console.log(`item-4slot-data: ${files.length} file(s) checked, 0 defects` + (stale.length ? `, ${stale.length} STALE` : ''));

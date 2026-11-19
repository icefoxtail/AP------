// 유사 시험지 가져오기 하네스 공용 함수 (변환기·후보 뽑기·검사기·반영기·검수 묶음이 함께 쓴다).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { loadUnitOrders } from '../archive-unit-order.mjs';
import { questionUidForSource } from '../meta-foundation/rpm-active-resolver.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_REPO_ROOT = path.resolve(__dirname, '../../..');
export { questionUidForSource };

// 판정 기록·후보·검수 묶음·보류 목록은 저장소 밖에 둔다.
export const DEFAULT_WORK_ROOT = 'C:/AI_WS/tmp/similar-judgment';

export function gitBlobSha1(content) {
  const buf = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf8');
  const header = Buffer.from(`blob ${buf.length}\0`);
  return crypto.createHash('sha1').update(Buffer.concat([header, buf])).digest('hex');
}

export const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
export const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
};
export const pad2 = n => String(n).padStart(2, '0');
export const stripWs = s => String(s ?? '').replace(/\s+/g, '');
export const CIRCLED = ['①', '②', '③', '④', '⑤'];
/**
 * 객관식 정답 칸을 보기 번호 목록으로. "③" → ['③'], "②, ④" / "②,④" / "④, ②" → ['②','④'].
 * 원본 기출의 복수 정답은 "②, ④" 형식으로 저장돼 있다. 읽을 수 없거나 중복이면 null.
 */
export function parseObjectiveAnswer(raw) {
  const parts = String(raw ?? '').split(/[,，、\s]+/).filter(Boolean);
  if (!parts.length || parts.some(p => !CIRCLED.includes(p))) return null;
  if (new Set(parts).size !== parts.length) return null;
  return [...parts].sort((a, b) => CIRCLED.indexOf(a) - CIRCLED.indexOf(b));
}
export const formatObjectiveAnswer = list => list.join(', ');

// ---------- 문자열 점검 ----------
// 탭·폼피드·백스페이스·CR 등 (줄바꿈 제외). LaTeX \times \frac \beta \right 가 JSON 이스케이프로 깨질 때 생기는 글자다.
export const CTRL_RE = /[\u0000-\u0009\u000b-\u001f\u007f\ufffd]/;

/** 문자열 안에서 $...$ (인라인) 수식 사이에 줄바꿈이 들어 있으면 true. $$...$$ 는 제외한다. */
export function hasNewlineInInlineMath(text) {
  const stripped = String(text).replace(/\$\$[\s\S]*?\$\$/g, ' ');
  const segs = stripped.split('$');
  for (let i = 1; i < segs.length; i += 2) {
    if (i < segs.length - 1 && segs[i].includes('\n')) return true;
  }
  return false;
}

/** 객체 안 모든 문자열을 돌며 깨진 제어문자·수식 안 줄바꿈을 찾는다. */
export function findBrokenStrings(value, pathPart = '$', out = []) {
  if (typeof value === 'string') {
    if (CTRL_RE.test(value)) out.push({ path: pathPart, kind: 'CTRL_CHAR' });
    else if (hasNewlineInInlineMath(value)) out.push({ path: pathPart, kind: 'NEWLINE_IN_INLINE_MATH' });
  } else if (Array.isArray(value)) value.forEach((v, i) => findBrokenStrings(v, `${pathPart}[${i}]`, out));
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) findBrokenStrings(v, `${pathPart}.${k}`, out);
  return out;
}

/** 문항 하나의 "고유 토큰"(숫자·문자 식별자). 이유 문장이 이 문항을 읽고 쓴 것인지 볼 때 쓴다. */
export function tokenize(text) {
  const s = String(text ?? '').replace(/\\[a-zA-Z]+/g, ' ');
  return new Set([...s.matchAll(/\d+(?:\.\d+)?|[A-Za-z][A-Za-z0-9]*/g)].map(m => m[0]));
}
export function itemTokenSet(texts) {
  const all = tokenize(texts.join('\n'));
  const long = new Set([...all].filter(t => t.length >= 2));
  return long.size ? long : all;
}
export function sharesItemToken(reason, itemTokens) {
  for (const t of tokenize(reason)) if (itemTokens.has(t)) return true;
  return false;
}

// ---------- JS 시험지 읽고 쓰기 ----------
export function readBank(jsPath) {
  const text = fs.readFileSync(jsPath, 'utf8');
  const ctx = { window: {} };
  vm.createContext(ctx);
  new vm.Script(text, { filename: jsPath }).runInContext(ctx);
  const bank = ctx.window.questionBank;
  if (!Array.isArray(bank)) throw new Error(`BANK_NOT_ARRAY: ${jsPath}`);
  return { bank, examTitle: ctx.window.examTitle, examDisplayTitle: ctx.window.examDisplayTitle, text };
}

export const ITEM_KEY_ORDER = [
  'id', 'category', 'originalCategory', 'standardCourse', 'curriculum', 'curriculumKey', 'courseKey',
  'standardUnitKey', 'standardUnit', 'standardUnitOrder', 'subUnitKey', 'subUnit', 'subUnitConfidence',
  'subUnitClassificationDepth', 'conceptClusterKey', 'questionType', 'layoutTag', 'tags', 'wide', 'content',
  'choices', 'answer', 'solution', 'score', 'points', 'difficultyBucket', 'problemTypeKey', 'templateKey',
  'crossConceptKeys', 'conditionKeys', 'integrationPattern', 'rpmPrimaryL1', 'rpmPrimaryL2', 'rpmPrimaryL3',
  'rpmPrimaryL4', 'rpmPrimaryRecordId', 'sourceQid', 'variationType', 'problemPlanRef',
];
export function orderItem(item) {
  const out = {};
  for (const k of ITEM_KEY_ORDER) if (k in item && item[k] !== undefined) out[k] = item[k];
  for (const k of Object.keys(item)) if (!(k in out) && item[k] !== undefined) out[k] = item[k];
  return out;
}
export function serializeBank(stem, displayTitle, bank) {
  const lines = [
    `window.examTitle = ${JSON.stringify(stem)};`,
    `window.examDisplayTitle = ${JSON.stringify(displayTitle)};`,
    '',
    'window.questionBank = [',
    bank.map(q => JSON.stringify(q, null, 2).split('\n').map(l => '  ' + l).join('\n')).join(',\n'),
    '];\n',
  ];
  return lines.join('\n').replace(/\r\n/g, '\n');
}

export function findSibling(jsPath, suffixRe) {
  const dir = path.dirname(jsPath);
  const stem = path.basename(jsPath, '.js');
  const hit = fs.readdirSync(dir).find(f => f.startsWith(stem + '.') && suffixRe.test(f.slice(stem.length)));
  return hit ? path.join(dir, hit) : null;
}

// ---------- 마스터 표·레지스트리 ----------
export function loadMasters(repoRoot = DEFAULT_REPO_ROOT) {
  const unitOrders = loadUnitOrders(repoRoot).orders;
  const rows = readJson(path.join(repoRoot, 'archive/data/master_tables/js_archive_tag_master.json'));
  const subUnits = new Map();
  const subUnitsByUnit = new Map();
  for (const r of rows) {
    if (r.keyType !== 'subUnitKey' || !r.key) continue;
    const row = {
      subUnitKey: r.key,
      labelKo: r.labelKo || r.subUnit || '',
      standardUnitKey: r.standardUnitKey || r.parentKey || '',
      conceptClusterKey: r.conceptClusterKey || '',
    };
    subUnits.set(r.key, row);
    if (!subUnitsByUnit.has(row.standardUnitKey)) subUnitsByUnit.set(row.standardUnitKey, []);
    subUnitsByUnit.get(row.standardUnitKey).push(row);
  }
  return { unitOrders, subUnits, subUnitsByUnit };
}

export function loadCrosswalkRecords(repoRoot = DEFAULT_REPO_ROOT) {
  const dir = path.join(repoRoot, 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0');
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
    const d = readJson(path.join(dir, f));
    for (const r of d.records || d.rows || []) if (r && r.id && r.rpmPath) out.push(r);
  }
  return out;
}

export function loadTaxonomy(repoRoot = DEFAULT_REPO_ROOT) {
  const base = path.join(repoRoot, 'archive/data/meta-foundation/compiled');
  const tax = readJson(path.join(base, 'taxonomy_registry.json'));
  const asRows = v => (Array.isArray(v) ? v : Object.values(v || {}));
  const pts = new Map(asRows(tax.problemTypes).filter(p => p?.problemTypeKey).map(p => [p.problemTypeKey, p]));
  const tpls = new Map(asRows(tax.templates).filter(t => t?.templateKey).map(t => [t.templateKey, t]));
  const bindings = readJson(path.join(base, 'curriculum_bindings.json')).bindings || [];
  return { pts, tpls, bindings };
}

export function loadTermDictionary(repoRoot = DEFAULT_REPO_ROOT) {
  const dir = path.join(repoRoot, 'docs/architecture/4slot');
  const files = fs.readdirSync(dir)
    .map(f => ({ f, m: /^term-dictionary-v1\.(\d+)\.json$/.exec(f) }))
    .filter(x => x.m)
    .sort((a, b) => Number(b.m[1]) - Number(a.m[1]));
  if (!files.length) throw new Error('TERM_DICTIONARY_NOT_FOUND');
  const file = path.join(dir, files[0].f);
  const d = readJson(file);
  const byName = new Map();
  const terms = (d.terms || []).filter(t => (t.status || 'ACTIVE') === 'ACTIVE');
  for (const t of terms) {
    for (const name of [t.ko, ...(t.synonyms || [])]) if (name && !byName.has(stripWs(name))) byName.set(stripWs(name), t);
  }
  return { version: d.dictionaryVersion, file, terms, byName };
}

// ---------- 과목 ----------
export const COURSE_UNIT_PREFIXES = {
  MIDDLE1: { 2015: ['M1'], 2022: ['M1'] },
  MIDDLE2: { 2015: ['M2'], 2022: ['M2'] },
  MIDDLE3: { 2015: ['M3'], 2022: ['M3'] },
  H15_COMMON_SANG: { 2015: ['H15-SA'] },
  H15_COMMON_HA: { 2015: ['H15-SB'] },
  H22_COMMON1: { 2022: ['H22-C'] },
  H22_COMMON2: { 2022: ['H22-C2'] },
  H15_MATH1: { 2015: ['H15-M1'] },
  H15_MATH2: { 2015: ['H15-M2'] },
  H22_ALGEBRA: { 2022: ['H22-A'] },
  H22_CALCULUS1: { 2022: ['H22-M1'] },
  H15_CALCULUS: { 2015: ['H15-CALC'] },
  H22_CALCULUS2: { 2022: ['H22-M2'] },
  PROBABILITY_STATISTICS: { 2015: ['H15-PS'], 2022: ['H22-PS'] },
  GEOMETRY: { 2015: ['H15-GV'], 2022: ['H22-GE'] },
};
const GRADE_FAMILY = {
  중1: { 2015: ['MIDDLE1'], 2022: ['MIDDLE1'] },
  중2: { 2015: ['MIDDLE2'], 2022: ['MIDDLE2'] },
  중3: { 2015: ['MIDDLE3'], 2022: ['MIDDLE3'] },
  고1: { 2015: ['H15_COMMON_SANG', 'H15_COMMON_HA'], 2022: ['H22_COMMON1', 'H22_COMMON2'] },
};

export function loadCourseGroups(repoRoot = DEFAULT_REPO_ROOT) {
  const a = readJson(path.join(repoRoot, 'archive/data/meta-foundation/course-aliases.v1.json'));
  return a.spellingGroups;
}
export function groupOfCourseName(name, groups) {
  const n = String(name ?? '').trim();
  if (!n) return null;
  return groups.find(g => g.members.includes(n)) || null;
}
/** 시험지의 과목 묶음 목록을 정한다. 우선순위: 명시(--course) > 문항의 standardCourse > 학년 */
export function resolveCourseGroups({ bank, explicitCourse, grade, curriculum, groups }) {
  const ids = new Set();
  if (explicitCourse) {
    for (const name of String(explicitCourse).split(',')) {
      const g = groupOfCourseName(name, groups);
      if (!g) throw new Error(`COURSE_UNKNOWN: ${name}`);
      ids.add(g.id);
    }
  } else {
    for (const q of bank) {
      const g = groupOfCourseName(q.standardCourse, groups) || groupOfCourseName(q.courseKey, groups);
      if (g) ids.add(g.id);
    }
    if (!ids.size && grade && GRADE_FAMILY[grade]) for (const id of GRADE_FAMILY[grade][curriculum] || []) ids.add(id);
  }
  if (!ids.size) throw new Error('COURSE_UNRESOLVED: 문항에 standardCourse가 없고 학년으로도 정할 수 없습니다. --course 로 알려 주세요.');
  return [...ids].map(id => groups.find(g => g.id === id)).filter(Boolean);
}
export function unitKeysForGroups(courseGroups, curriculum, unitOrders) {
  const prefixes = courseGroups.flatMap(g => COURSE_UNIT_PREFIXES[g.id]?.[curriculum] || []);
  const keys = [];
  for (const [key, row] of unitOrders) {
    const p = prefixes.find(pre => key.startsWith(pre + '-') && /^\d{2}$/.test(key.slice(pre.length + 1)));
    if (p) keys.push(row);
  }
  return keys.sort((a, b) => a.order - b.order || a.key.localeCompare(b.key));
}
export function memberSet(courseGroups) {
  return new Set(courseGroups.flatMap(g => g.members));
}

/** 과목·교육과정 후보 표 (RPM 행, PT/TPL).
 *  ptByUnit: 교육과정과 상관없이 같은 과목·같은 단원 키에 ACTIVE 로 묶인 유형 전부 (등록부 정본). 단원을 좁혀 보여 주지 않는다.
 *  extraPts: [{ problemTypeKey, standardUnitKey }] 원본 기출이 쓴 유형이 위에서 빠졌을 때 ptByUnit 에 더한다. */
export function buildCourseTables({ repoRoot = DEFAULT_REPO_ROOT, courseGroups, curriculum, masters, crosswalk, taxonomy, extraPts = [] }) {
  const members = memberSet(courseGroups);
  const units = unitKeysForGroups(courseGroups, String(curriculum), masters.unitOrders);
  const unitKeys = new Set(units.map(u => u.key));
  const rpmRows = crosswalk.filter(r => String(r.curriculum) === String(curriculum)
    && (members.has(r.scope) || members.has(r.standardCourse)) && (!r.standardUnitKey || unitKeys.has(r.standardUnitKey)));
  const rpmById = new Map(rpmRows.map(r => [r.id, r]));
  const ptByUnit = new Map();
  const ptAll = new Map();
  const put = (unit, key, pt) => { if (!ptByUnit.has(unit)) ptByUnit.set(unit, new Map()); ptByUnit.get(unit).set(key, pt); };
  for (const b of taxonomy.bindings) {
    if (b.status && b.status !== 'ACTIVE') continue;
    if (!members.has(b.standardCourse)) continue;
    if (!b.problemTypeKey || !unitKeys.has(b.standardUnitKey)) continue;
    const pt = taxonomy.pts.get(b.problemTypeKey);
    if (!pt || (pt.status && pt.status !== 'ACTIVE')) continue;
    ptAll.set(b.problemTypeKey, pt);
    put(b.standardUnitKey, b.problemTypeKey, pt);
  }
  for (const e of extraPts) {
    const pt = taxonomy.pts.get(e.problemTypeKey);
    if (!pt || (pt.status && pt.status !== 'ACTIVE') || !unitKeys.has(e.standardUnitKey)) continue;
    ptAll.set(e.problemTypeKey, pt);
    put(e.standardUnitKey, e.problemTypeKey, pt);
  }
  const tplByPt = new Map();
  for (const t of taxonomy.tpls.values()) {
    if (!ptAll.has(t.parentProblemTypeKey) || (t.status && t.status !== 'ACTIVE')) continue;
    if (!tplByPt.has(t.parentProblemTypeKey)) tplByPt.set(t.parentProblemTypeKey, []);
    tplByPt.get(t.parentProblemTypeKey).push(t);
  }
  return { units, unitKeys, rpmRows, rpmById, ptByUnit, ptAll, tplByPt };
}

// ---------- 선택표 (학교급·학년·과목별 메타 선택 문서의 자료) ----------
export const GRADE_ORDER = ['중1', '중2', '중3', '고1', '고2', '고3'];

/** 과목 묶음 하나의 선택표 자료. 단원 -> 소단원 · RPM 행 · 유형(PT -> TPL). 등록부(ACTIVE)에서 그때그때 만든다.
 *  교육과정은 가르지 않는다 (중학 단원 키는 2015·2022 가 같다). RPM 행에는 교육과정을 적는다. */
export function buildGroupSelection({ group, masters, crosswalk, taxonomy, repoRoot = DEFAULT_REPO_ROOT }) {
  const units = new Map();
  for (const curriculum of Object.keys(COURSE_UNIT_PREFIXES[group.id] || {})) {
    const t = buildCourseTables({ repoRoot, courseGroups: [group], curriculum, masters, crosswalk, taxonomy });
    for (const u of t.units) {
      if (!units.has(u.key)) {
        const pts = [...(t.ptByUnit.get(u.key) || new Map()).values()].sort((a, b) => a.problemTypeKey.localeCompare(b.problemTypeKey));
        units.set(u.key, {
          standardUnitKey: u.key,
          label: u.label,
          order: u.order,
          subUnits: (masters.subUnitsByUnit.get(u.key) || []).map(s => ({ subUnitKey: s.subUnitKey, label: s.labelKo })),
          rpm: [],
          problemTypes: pts.map(p => ({
            problemTypeKey: p.problemTypeKey,
            label: p.canonicalLabelKo,
            definition: String(p.definition || '').replace(/\s+/g, ' ').trim(),
            templates: (t.tplByPt.get(p.problemTypeKey) || []).map(x => ({ templateKey: x.templateKey, label: x.canonicalLabelKo })).sort((a, b) => a.templateKey.localeCompare(b.templateKey)),
          })),
        });
      }
      units.get(u.key).rpm.push(...t.rpmRows.filter(r => r.standardUnitKey === u.key).map(r => ({
        id: r.id,
        curriculum: String(r.curriculum),
        path: [r.rpmPath.majorUnit, r.rpmPath.midUnit, r.rpmPath.l3, r.rpmPath.l4].join(' > '),
        subUnitKey: r.subUnitKey || '',
        mappingStatus: r.mappingStatus || '',
      })));
    }
  }
  return { id: group.id, grade: group.grade, members: group.members, units: [...units.values()].sort((a, b) => a.order - b.order || a.standardUnitKey.localeCompare(b.standardUnitKey)) };
}

/** 선택표 자료 전체: id -> buildGroupSelection 결과 (등록부에 단원이 하나도 없는 묶음은 뺀다). */
export function buildAllSelections(repoRoot = DEFAULT_REPO_ROOT, { masters = loadMasters(repoRoot), crosswalk = loadCrosswalkRecords(repoRoot), taxonomy = loadTaxonomy(repoRoot) } = {}) {
  const out = new Map();
  for (const group of loadCourseGroups(repoRoot)) {
    const sel = buildGroupSelection({ group, masters, crosswalk, taxonomy, repoRoot });
    if (sel.units.length) out.set(group.id, sel);
  }
  return out;
}

/** 이 묶음의 시험지가 쓸 수 있는 아래 학년 묶음: 학년이 같거나 낮은 다른 묶음 (키의 학년이 시험지 학년 이하이면 받는 규칙, meta-foundation reach). */
export function lowerGroupIds(selection, all) {
  const rank = g => GRADE_ORDER.indexOf(g);
  return [...all.values()].filter(o => o.id !== selection.id && rank(o.grade) >= 0 && rank(o.grade) <= rank(selection.grade))
    .sort((a, b) => rank(a.grade) - rank(b.grade) || a.id.localeCompare(b.id)).map(o => o.id);
}

/** 묶음 안 모든 단원의 유형을 키 하나에 한 번씩 (단원 구분 없이). */
export function groupPts(selection) {
  const m = new Map();
  for (const u of selection.units) for (const p of u.problemTypes) if (!m.has(p.problemTypeKey)) m.set(p.problemTypeKey, p);
  return [...m.values()].sort((a, b) => a.problemTypeKey.localeCompare(b.problemTypeKey));
}

/** 시험지 과목 묶음(들)이 선택표에서 쓸 수 있는 유형·템플릿: Map<PT 키, Set<TPL 키>>. 자기 묶음과 아래 학년 묶음의 것. */
export function selectionAccepts(courseIds, all) {
  const out = new Map();
  for (const id of courseIds || []) {
    const sel = all.get(id);
    if (!sel) continue;
    for (const g of [sel, ...lowerGroupIds(sel, all).map(x => all.get(x))]) {
      for (const p of groupPts(g)) {
        if (!out.has(p.problemTypeKey)) out.set(p.problemTypeKey, new Set());
        for (const t of p.templates) out.get(p.problemTypeKey).add(t.templateKey);
      }
    }
  }
  return out;
}

// ---------- 원본 기출 · 문항 지문(fingerprint) · 가이드 예시 ----------
/** 유사 시험지에 대응하는 원본 기출 파일의 저장소 경로(archive/exams/original/...)를 찾는다. 없으면 null.
 *  우선순위: 원천 마크다운 머리글의 sourceArchiveFile > 유사 파일 위치 + 이름 규칙(_유사N -> _기출 / _수학). */
export function findOriginalExamFile({ repoRoot = DEFAULT_REPO_ROOT, stem, targetSourceFile = null, mdSourceFile = null }) {
  const exists = rel => fs.existsSync(path.join(repoRoot, rel));
  const out = [];
  if (mdSourceFile) out.push(mdSourceFile.startsWith('archive/') ? mdSourceFile : `archive/exams/${mdSourceFile}`);
  const m = /^archive\/exams\/similar\/(.+)\/[^/]+$/.exec(String(targetSourceFile || '').replaceAll('\\', '/'));
  if (m) for (const suf of ['_기출', '_수학', '']) out.push(`archive/exams/original/${m[1]}/${stem.replace(/_유사\d*$/, suf)}.js`);
  return out.find(exists) || null;
}
/** 판정 틀을 만든 시점의 문항 지문. 이 값이 현재 JS 의 문항과 다르면 판정은 다른 문항(또는 옛 지문)의 것이다. */
export function itemFingerprint(item) {
  return gitBlobSha1(JSON.stringify([item.content ?? '', item.choices ?? [], item.answer ?? '', item.solution ?? ''])).slice(0, 16);
}
/** JUDGMENT_GUIDE.md 의 예시 판정(첫 json 블록). 예시 글을 그대로 낸 판정을 잡는 데 쓴다. */
export function loadGuideExample() {
  const guide = fs.readFileSync(path.join(__dirname, 'JUDGMENT_GUIDE.md'), 'utf8');
  const m = /```json\r?\n([\s\S]*?)\r?\n```/.exec(guide);
  return m ? JSON.parse(m[1]) : null;
}

/** 난이도 경계 플래그 (difficultyBucket 5단계 운영규칙): 두 단계 사이에서 애매하면 낮은 쪽을 고르고 그 경계를 적는다. */
export const BOUNDARY_FLAGS = ['NONE', 'B12', 'B23', 'B34', 'B45', 'UNKNOWN'];

// ---------- 그림 ----------
export function itemHasImage(item) {
  return Boolean(item.image || (Array.isArray(item.images) && item.images.length)
    || /<img\b|<svg\b/i.test(`${item.content ?? ''}\n${(item.choices || []).join('\n')}`));
}
export const FIGURE_CUE_RE = /그림|그래프|도형|표\b|좌표평면|수직선|벤\s*다이어그램|다음과\s*같이|아래의?|위의/g;

// ---------- 명령줄 / 상태 ----------
/** --flag(값 없음) 목록을 boolFlags 에 주면 나머지 --name 은 다음 인자를 값으로 가진다. */
export function parseCli(argv, boolFlags = []) {
  const pos = [];
  const opts = new Map();
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      if (boolFlags.includes(a)) opts.set(a, true);
      else opts.set(a, argv[++i]);
    } else pos.push(a);
  }
  return { pos, opt: n => (opts.has(n) ? opts.get(n) : null), has: n => opts.has(n) };
}

/** 시험지 진행 단계를 한 줄씩 누적한다 (CONVERTED -> JUDGED -> REVIEWED -> READY / HOLD). 저장소 밖 파일. */
export function appendStatus(file, stem, status, detail = '') {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
  fs.appendFileSync(file, `${stem}\t${status}\t${String(detail).replace(/[\t\n]+/g, ' ')}\t${ts}\n`, 'utf8');
}

/** "slots.method[0].term" 같은 경로로 값을 꺼낸다. */
export function getPath(obj, p) {
  return String(p).split('.').flatMap(seg => {
    const m = /^([^[]*)((?:\[\d+\])*)$/.exec(seg);
    if (!m) return [seg];
    return [m[1], ...[...m[2].matchAll(/\[(\d+)\]/g)].map(x => Number(x[1]))].filter(x => x !== '');
  }).reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

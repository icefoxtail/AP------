// 읽기 전용: 원본 시험지 전체에 "기준 시험지로 다시 만들기"(same 유형 × same/up-one 난이도)를 돌려
//   1) (과정, 세부 유형, 난이도)별 "후보가 모자란 칸 × 그 칸을 요구하는 시험지 수" TSV (유사·교재 문항 생성의 우선순위 주문서)
//   2) 학년·학기·난이도 모드별 일치율 중앙값 (a)~(f): 세부 유형(정식만) · 세부 유형(정식+힌트) · 유형 · 난이도 · 힌트 비율 · 기준 문항 중 유형 정보 없는 비율
//      (유형 정보가 없는 기준 문항은 유형 일치율 분모에서 빼고 그 비율을 (f)로 따로 낸다. 하나로 평균 낸 수치는 만들지 않는다)
// 를 낸다. 빈 문항(정답 없음, 해설·해설 그림 모두 없음)은 후보에서 뺀다. 저장소에는 아무것도 쓰지 않는다(출력 폴더가 저장소 안이면 거부).
//
// 사용: node archive/tools/derive-coverage-report.mjs --out <폴더> [--min-items 10] [--seed derive] [--include-blank] [--exams-root <폴더>]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const archiveDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoDir = path.resolve(archiveDir, '..');
const core = require('../archive2-core.js');
const Unified = require('../archive2-unified-units.js');
const Derive = require('../archive2-derive.js');
const KeyResolver = require('../archive2-key-resolver.js');
const ReportData = require('../assessment/diagnostic-report-data.js');
const { createBlankChecker } = require('./derive-blank-check.cjs');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const outDir = arg('out', '');
const minItems = Number(arg('min-items', '10'));
const seed = arg('seed', 'derive');
const includeBlank = process.argv.includes('--include-blank');
const examsRoot = arg('exams-root', path.join(archiveDir, 'exams'));
if (!outDir) { console.error('사용: --out <폴더>(저장소 밖)'); process.exit(2); }
const outAbs = path.resolve(outDir);
const rel = path.relative(repoDir, outAbs);
if (!rel.startsWith('..') && !path.isAbsolute(rel)) { console.error('출력 폴더가 저장소 안입니다. 저장소 밖 폴더를 지정하세요: ' + outAbs); process.exit(2); }
fs.mkdirSync(outAbs, { recursive: true });

// 운영 카탈로그를 브라우저와 같은 경로(meta-foundation-runtime → canonical 해석)로 읽는다.
async function loadCatalog() {
  const window = { Archive2Core: core, Archive2Canonical: core.Canonical };
  vm.runInNewContext(fs.readFileSync(path.join(archiveDir, 'meta-foundation-runtime.js'), 'utf8'), {
    window, document: { baseURI: 'https://derive.test/AP------/archive/workspace.html' }, URL, console,
    fetch: async (url) => {
      const pathname = decodeURIComponent(new URL(String(url)).pathname);
      let file;
      if (pathname.startsWith('/AP------/archive/')) file = path.join(archiveDir, pathname.slice('/AP------/archive/'.length));
      else if (pathname.startsWith('/AP------/docs/')) file = path.join(repoDir, 'docs', pathname.slice('/AP------/docs/'.length));
      else return new Response('not found', { status: 404 });
      return fs.existsSync(file) ? new Response(fs.readFileSync(file)) : new Response('not found', { status: 404 });
    },
  });
  return window.applyArchiveMetaFoundationCatalog();
}

function makeLabelOf() {
  try {
    const read = (rel2) => JSON.parse(fs.readFileSync(path.join(archiveDir, rel2), 'utf8'));
    return ReportData.createLabelOf({
      taxonomy: read('data/meta-foundation/compiled/taxonomy_registry.json'),
      concepts: read('data/meta-foundation/compiled/concept_registry.json'),
      conditions: read('data/meta-foundation/compiled/condition_registry.json'),
      extensions: read('data/archive2-extension-keys.json'),
    }, KeyResolver);
  } catch (error) { return () => ''; }
}

const median = (values) => {
  const v = values.filter((x) => x !== null && Number.isFinite(x)).sort((a, b) => a - b);
  if (!v.length) return null;
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
};
const fmt = (x, d = 3) => (x === null || x === undefined ? '' : Number(x).toFixed(d));
const tsv = (rows) => rows.map((row) => row.map((cell) => String(cell ?? '').replace(/[\t\r\n]+/g, ' ')).join('\t')).join('\n') + '\n';

const t0 = Date.now();
const data = await loadCatalog();
const manifest = JSON.parse(fs.readFileSync(path.join(archiveDir, 'data/textbook-source-manifest-v1.json'), 'utf8'));
const tIndex = Date.now();
const blankChecker = createBlankChecker({ root: examsRoot });
const index = Derive.buildDeriveIndex(data.records, { projectionPolicy: data.projectionPolicy, manifest, isBlank: blankChecker.isBlank });
console.error(`카탈로그 ${data.records.length}문항 읽기 ${tIndex - t0}ms, 색인(빈 문항 판정 포함) ${Date.now() - tIndex}ms, 빈 문항 ${blankChecker.stats.blank}, 원문 못 읽음 ${blankChecker.stats.unreadable}`);
const labelOf = makeLabelOf();

// 원본 시험지(original/) 단위로 묶는다.
const papers = new Map();
for (const record of data.records) {
  if (!/^original\//.test(record.sourceFile)) continue;
  if (!papers.has(record.sourceFile)) papers.set(record.sourceFile, []);
  papers.get(record.sourceFile).push(record);
}
const semesterOf = (file) => { const m = /\/(\d)(?:mid|final)\//.exec(file); return m ? `${m[1]}학기` : '학기 미상'; };

const MODES = [{ name: '기본', level: 'same' }, { name: '심화', level: 'up-one' }];
const paperRows = [['시험지', '학년', '학기', '문항 수', '난이도 모드', '채움', '같은 세부 유형', '같은 유형', '같은 개념', '같은 단원', '범위 안 다른 단원', '(a)세부 유형 일치율(정식만)', '(b)세부 유형 일치율(정식+힌트)', '(c)유형 일치율', '(d)난이도 일치율', '(e)힌트 비율', '(f)기준 문항 중 유형 정보 없는 비율']];
const METRICS = ['templateFormal', 'template', 'type', 'level', 'hintRate', 'noTypeInfoRate'];
const groups = new Map(); // 학년|학기|모드 → { papers, unfilled, metric별 배열 }
const demand = new Map(); // 모드|ck|키종류|키|난이도 → { papers:Set, unsatisfied:Set, items, unsatisfiedItems, sample }
let paperCount = 0;
const unfilledPapers = {};
const unfilledItems = {};
const gradeOfPaper = (rows) => {
  const tally = {};
  for (const record of rows) { const cand = index.byUid.get(record.questionUid); if (cand && cand.ck) { const g = cand.ck.split('|')[0]; tally[g] = (tally[g] || 0) + 1; } }
  return Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] || '학년 미상';
};

for (const [file, rows] of papers) {
  if (rows.length < minItems) continue;
  paperCount += 1;
  const grade = gradeOfPaper(rows);
  const semester = semesterOf(file);
  const baseUids = rows.map((r) => r.questionUid);
  for (const mode of MODES) {
    const out = Derive.deriveFromPaper(baseUids, { typeMode: 'same', level: mode.level, seed, includeBlank }, index);
    const s = out.summary;
    paperRows.push([file, grade, semester, rows.length, mode.name, s.filled, s.counts.template, s.counts.type, s.counts.concept, s.counts.subunit + s.counts.unit, s.counts.none,
      ...METRICS.map((m) => fmt(s.match[m]))]);
    const key = `${grade}\t${semester}\t${mode.name}`;
    if (!groups.has(key)) groups.set(key, { papers: 0, unfilled: 0, ...Object.fromEntries(METRICS.map((m) => [m, []])) });
    const g = groups.get(key);
    g.papers += 1;
    if (s.shortfall > 0) { g.unfilled += 1; unfilledPapers[mode.name] = (unfilledPapers[mode.name] || 0) + 1; unfilledItems[mode.name] = (unfilledItems[mode.name] || 0) + s.shortfall; }
    METRICS.forEach((m) => g[m].push(s.match[m]));

    // 요구 칸: 기준 문항마다 (과정, 세부 유형 → 없으면 유형, 목표 난이도). 그 칸에서 뽑히지 못하면 "모자란 칸".
    const targets = Derive.levelTargets(baseUids.map((uid) => index.byUid.get(uid) || null), mode.level, seed);
    out.perItem.forEach((p, i) => {
      const base = index.byUid.get(p.baseUid);
      if (!base || !base.ck || base.bucket === null) return;
      const keyKind = base.tpl ? '세부 유형' : base.pt ? '유형' : '유형 정보 없음';
      const key2 = base.tpl || base.pt || `(없음) ${base.unit || '단원 미분류'}`;
      const target = targets[i];
      const cellKey = `${mode.name}\t${base.ck}\t${keyKind}\t${key2}\t${target}`;
      if (!demand.has(cellKey)) demand.set(cellKey, { papers: new Set(), unsatisfiedPapers: new Set(), items: 0, unsatisfiedItems: 0, ck: base.ck, keyKind, key: key2, target, mode: mode.name, base });
      const cell = demand.get(cellKey);
      cell.papers.add(file);
      cell.items += 1;
      const best = base.tpl ? 'template' : base.pt ? 'type' : 'unit';
      const cand = p.pickedUid ? index.byUid.get(p.pickedUid) : null;
      const satisfied = Boolean(cand) && p.rung === best && cand.bucket === target;
      if (!satisfied) { cell.unsatisfiedPapers.add(file); cell.unsatisfiedItems += 1; }
    });
  }
}

// 후보 수(공급): 같은 과정·같은 키·그 난이도의 적격 문항 수(기준 시험지 문항 포함)
const supplyOf = (cell) => {
  const pool = index.pools.get(cell.ck);
  if (!pool) return { atLevel: 0, anyLevel: 0 };
  const list = cell.keyKind === '세부 유형' ? pool.tpl.get(cell.key) : cell.keyKind === '유형' ? pool.pt.get(cell.key) : [];
  const arr = list || [];
  const usable = includeBlank ? arr : arr.filter((c) => !c.blank);
  return { atLevel: usable.filter((c) => c.bucket === cell.target).length, anyLevel: usable.length };
};
// ck = 학년|통합 과목 (교육과정은 경계가 아니므로 키에 없다)
const subjectLabel = (ck) => { const [grade, subject] = ck.split('|'); const row = Unified.subjectByValue ? Unified.subjectByValue(grade, subject) : null; return { grade, subject: (row && row.label) || subject }; };

const shortage = [...demand.values()].filter((cell) => cell.unsatisfiedPapers.size > 0).map((cell) => ({ cell, supply: supplyOf(cell) }))
  .sort((a, b) => b.cell.unsatisfiedPapers.size - a.cell.unsatisfiedPapers.size || b.cell.unsatisfiedItems - a.cell.unsatisfiedItems || a.supply.atLevel - b.supply.atLevel);
const shortageRows = [['난이도 모드', '학년', '과목', '키 종류', '유형 키', '유형 이름', '목표 난이도', '모자란 시험지 수', '모자란 문항 수', '요구한 시험지 수', '요구한 문항 수', '같은 칸 후보 수(그 난이도)', '같은 칸 후보 수(전 난이도)']];
for (const { cell, supply } of shortage) {
  const sub = subjectLabel(cell.ck);
  shortageRows.push([cell.mode, sub.grade, sub.subject, cell.keyKind, cell.key, cell.keyKind === '유형 정보 없음' ? '' : labelOf(cell.key), cell.target,
    cell.unsatisfiedPapers.size, cell.unsatisfiedItems, cell.papers.size, cell.items, supply.atLevel, supply.anyLevel]);
}

const rateRows = [['학년', '학기', '난이도 모드', '시험지 수', '못 채운 시험지 수', '(a)세부 유형 일치율(정식만) 중앙값', '(b)세부 유형 일치율(정식+힌트) 중앙값', '(c)유형 일치율 중앙값', '(d)난이도 일치율 중앙값', '(e)힌트 비율 중앙값', '(f)기준 문항 중 유형 정보 없는 비율 중앙값']];
const gradeRank = { 중1: 1, 중2: 2, 중3: 3, 고1: 4, 고2: 5, 고3: 6 };
for (const [key, g] of [...groups.entries()].sort((a, b) => {
  const [ga, sa, ma] = a[0].split('\t'); const [gb, sb, mb] = b[0].split('\t');
  return (gradeRank[ga] || 9) - (gradeRank[gb] || 9) || sa.localeCompare(sb) || ma.localeCompare(mb);
})) {
  const [grade, semester, modeName] = key.split('\t');
  rateRows.push([grade, semester, modeName, g.papers, g.unfilled, ...METRICS.map((m) => fmt(median(g[m])))]);
}

fs.writeFileSync(path.join(outAbs, 'derive-coverage-papers.tsv'), tsv(paperRows));
fs.writeFileSync(path.join(outAbs, 'derive-coverage-shortage.tsv'), tsv(shortageRows));
fs.writeFileSync(path.join(outAbs, 'derive-coverage-rates.tsv'), tsv(rateRows));
const summary = {
  generatedAt: new Date().toISOString(),
  derive: Derive.VERSION,
  seed,
  minItems,
  catalogRecords: data.records.length,
  papers: paperCount,
  modes: MODES.map((m) => `${m.name}=same유형×${m.level}`),
  includeBlank,
  blankExcluded: blankChecker.stats.blank,
  blankSourceUnreadable: blankChecker.stats.unreadable,
  unfilledPapers,
  unfilledItems,
  shortageCells: shortage.length,
  note: '요구 칸 = 기준 문항의 (과정, 세부 유형[없으면 유형], 목표 난이도). 그 칸(세부 유형·목표 난이도)에서 뽑히지 못한 문항이 있으면 모자란 칸이다.',
};
fs.writeFileSync(path.join(outAbs, 'derive-coverage-summary.json'), JSON.stringify(summary, null, 2));
console.error(`시험지 ${paperCount}개, 모자란 칸 ${shortage.length}개 → ${outAbs}`);

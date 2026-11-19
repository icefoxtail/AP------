// 읽기 전용: 원본 시험지 전체에 "기준 시험지로 다시 만들기"(same 유형 × same/up-one 난이도)를 돌려
//   1) (과정, 세부 유형, 난이도)별 "후보가 모자란 칸 × 그 칸을 요구하는 시험지 수" TSV (유사·교재 문항 생성의 우선순위 주문서)
//   2) 학년·학기별 시험지 수준 일치율 분포
// 를 낸다. 저장소에는 아무것도 쓰지 않는다(출력 폴더가 저장소 안이면 거부).
//
// 사용: node archive/tools/derive-coverage-report.mjs --out <폴더> [--min-items 10] [--seed derive]
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

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const outDir = arg('out', '');
const minItems = Number(arg('min-items', '10'));
const seed = arg('seed', 'derive');
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
const index = Derive.buildDeriveIndex(data.records, { projectionPolicy: data.projectionPolicy, manifest });
console.error(`카탈로그 ${data.records.length}문항 읽기 ${tIndex - t0}ms, 색인 ${Date.now() - tIndex}ms`);
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
const paperRows = [['시험지', '학년', '학기', '문항 수', '난이도 모드', '채움', '같은 세부 유형', '같은 유형', '같은 개념', '같은 단원', '범위 안 다른 단원', '세부 유형 일치율', '유형 일치율', '난이도 일치율', '단원 일치율', '수준 일치율(유형·난이도·단원 평균)']];
const groups = new Map(); // 학년|학기|모드 → { template:[], type:[], level:[], unit:[], quality:[] }
const demand = new Map(); // 모드|ck|키종류|키|난이도 → { papers:Set, unsatisfied:Set, items, unsatisfiedItems, sample }
let paperCount = 0;
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
    const out = Derive.deriveFromPaper(baseUids, { typeMode: 'same', level: mode.level, seed }, index);
    const s = out.summary;
    const quality = [s.match.type, s.match.level, s.match.unit].filter((x) => x !== null);
    const q = quality.length ? quality.reduce((a, b) => a + b, 0) / quality.length : null;
    paperRows.push([file, grade, semester, rows.length, mode.name, s.filled, s.counts.template, s.counts.type, s.counts.concept, s.counts.subunit + s.counts.unit, s.counts.none,
      fmt(s.match.template), fmt(s.match.type), fmt(s.match.level), fmt(s.match.unit), fmt(q)]);
    const key = `${grade}\t${semester}\t${mode.name}`;
    if (!groups.has(key)) groups.set(key, { template: [], type: [], level: [], unit: [], quality: [], papers: 0 });
    const g = groups.get(key);
    g.papers += 1;
    g.template.push(s.match.template); g.type.push(s.match.type); g.level.push(s.match.level); g.unit.push(s.match.unit); g.quality.push(q);

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
  return { atLevel: arr.filter((c) => c.bucket === cell.target).length, anyLevel: arr.length };
};
const subjectLabel = (ck) => { const [grade, subject, curr] = ck.split('|'); const row = Unified.subjectByValue ? Unified.subjectByValue(grade, subject) : null; return { grade, subject: (row && row.label) || subject, curr }; };

const shortage = [...demand.values()].filter((cell) => cell.unsatisfiedPapers.size > 0).map((cell) => ({ cell, supply: supplyOf(cell) }))
  .sort((a, b) => b.cell.unsatisfiedPapers.size - a.cell.unsatisfiedPapers.size || b.cell.unsatisfiedItems - a.cell.unsatisfiedItems || a.supply.atLevel - b.supply.atLevel);
const shortageRows = [['난이도 모드', '학년', '과목', '교육과정', '키 종류', '유형 키', '유형 이름', '목표 난이도', '모자란 시험지 수', '모자란 문항 수', '요구한 시험지 수', '요구한 문항 수', '같은 칸 후보 수(그 난이도)', '같은 칸 후보 수(전 난이도)']];
for (const { cell, supply } of shortage) {
  const sub = subjectLabel(cell.ck);
  shortageRows.push([cell.mode, sub.grade, sub.subject, sub.curr, cell.keyKind, cell.key, cell.keyKind === '유형 정보 없음' ? '' : labelOf(cell.key), cell.target,
    cell.unsatisfiedPapers.size, cell.unsatisfiedItems, cell.papers.size, cell.items, supply.atLevel, supply.anyLevel]);
}

const rateRows = [['학년', '학기', '난이도 모드', '시험지 수', '세부 유형 일치율 중앙값', '유형 일치율 중앙값', '난이도 일치율 중앙값', '단원 일치율 중앙값', '수준 일치율 중앙값(유형·난이도·단원 평균)']];
const gradeRank = { 중1: 1, 중2: 2, 중3: 3, 고1: 4, 고2: 5, 고3: 6 };
for (const [key, g] of [...groups.entries()].sort((a, b) => {
  const [ga, sa, ma] = a[0].split('\t'); const [gb, sb, mb] = b[0].split('\t');
  return (gradeRank[ga] || 9) - (gradeRank[gb] || 9) || sa.localeCompare(sb) || ma.localeCompare(mb);
})) {
  const [grade, semester, modeName] = key.split('\t');
  rateRows.push([grade, semester, modeName, g.papers, fmt(median(g.template)), fmt(median(g.type)), fmt(median(g.level)), fmt(median(g.unit)), fmt(median(g.quality))]);
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
  shortageCells: shortage.length,
  note: '요구 칸 = 기준 문항의 (과정, 세부 유형[없으면 유형], 목표 난이도). 그 칸(세부 유형·목표 난이도)에서 뽑히지 못한 문항이 있으면 모자란 칸이다.',
};
fs.writeFileSync(path.join(outAbs, 'derive-coverage-summary.json'), JSON.stringify(summary, null, 2));
console.error(`시험지 ${paperCount}개, 모자란 칸 ${shortage.length}개 → ${outAbs}`);

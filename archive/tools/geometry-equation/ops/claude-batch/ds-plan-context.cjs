// ds-plan-lib.cjs 가 쓰는 "문맥 꾸러미" 만들기. 저장소 루트에서 실행한다(경로는 모두 루트 기준).
// 목적: DeepSeek 이 파일을 열거나 grep 하며 탐색하지 않고, 입력에 든 것만으로 바로 plan 을 쓰게 한다(2026-11-19: 탐색이 문항당 9분 중 거의 전부였다).
// 만드는 것
//   1) 본보기 색인(.tmp/work/ds-plan-index.json): plan 폴더의 모든 q*-solution*.json → 시험지 JS 문항의 subUnitKey·standardUnitKey, capability, 크기, 글 토큰.
//      DeepSeek 이 글로만 쓴 plan(_decisions.jsonl 의 note 가 "ds-plan 2026-11-19" 이고 render=NOT_RUN)은 본보기에서 제외한다(렌더로 확인된 것만 본보기). ops/golden 의 plan.json 도 후보에 넣는다.
//   2) 문항별 본보기 2~3개: 같은 subUnitKey → 같은 standardUnitKey → 같은 과목 순으로 우선하고, 문항 글(발문·해설·장부 사유)과 본보기 글(발문·캡션) 유사도로 같은 형태를 고른다.
//   3) 본보기가 쓴 capability·필드에 해당하는 AUTHOR_GUIDE 줄만 발췌(바이트 예산 안에서).
const fs = require('fs'), path = require('path'), vm = require('vm');

const PLAN_BASE = 'docs/plans/archive-one-route-upgrade/svg-plans-expanded/original/';
const EXAM_BASE = 'archive/exams/original/';
const GOLDEN = 'archive/tools/geometry-equation/ops/golden';
const AUTHOR_GUIDE = 'archive/tools/geometry-equation/production/AUTHOR_GUIDE.md';
const TIPS = '.tmp/svg-m1/guide/guide-tips.md';
const INDEX_CACHE = '.tmp/work/ds-plan-index.json';
const num = (k, d) => (process.env[k] && Number(process.env[k]) > 0 ? Number(process.env[k]) : d);
const GUIDE_BYTES = num('DS_GUIDE_BYTES', 24000);       // 가이드 발췌 상한(바이트, 한 번 호출당)
const EXEMPLAR_BYTES = num('DS_EXEMPLAR_BYTES', 36000); // 본보기 plan 합계 상한
const PER_Q = num('DS_EXEMPLARS_PER_Q', 3);
const PLAN_MAX = 9000;                                  // 이보다 큰 plan 은 다른 후보가 없을 때만 본보기로 쓴다

const readJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const bankOf = file => { const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(file, 'utf8'), ctx); return ctx.window.questionBank ?? ctx.window.examData?.questions; };

// ---------- 글 토큰(유사도) ----------
const NOISE = new Set(['\\left', '\\right', '\\dfrac', '\\frac', '\\displaystyle', '\\cdot', '\\quad', '\\text', '\\mathrm', '\\le', '\\ge', '\\times', '\\begin', '\\end']);
function tokens(s) {
  s = String(s || '').replace(/\\\\/g, '\\');
  const t = new Set();
  for (const m of s.matchAll(/\\([a-zA-Z]+)/g)) { const k = '\\' + m[1]; if (!NOISE.has(k)) t.add(k); }
  for (const m of s.matchAll(/[가-힣]+/g)) { const w = m[0]; for (let i = 0; i + 1 < w.length; i++) t.add(w.slice(i, i + 2)); }
  for (const m of s.matchAll(/\b(sin|cos|tan|sec|csc|cot|ln|log|lim|exp)\b/g)) t.add(m[1]);
  return [...t];
}

// ---------- 본보기 색인 ----------
function planFilesSignature() {
  let n = 0, mt = 0; const files = [];
  const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = d + '/' + e.name;
    if (e.isDirectory()) walk(p);
    else if (/^q\d+-solution(-\d+)?\.json$/.test(e.name)) { n++; const s = fs.statSync(p); if (s.mtimeMs > mt) mt = s.mtimeMs; files.push(p); }
    else if (e.name === '_decisions.jsonl') { const s = fs.statSync(p); if (s.mtimeMs > mt) mt = s.mtimeMs; } } };
  walk(PLAN_BASE.replace(/\/$/, ''));
  return { n, mt: Math.round(mt), files };
}

function buildIndex() {
  const sig = planFilesSignature();
  try { const c = readJson(INDEX_CACHE); if (c.sig && c.sig.n === sig.n && c.sig.mt === sig.mt && c.v === 4) return c; } catch {}
  const entries = [], banks = {}, decCache = {};
  const decOf = dir => { if (decCache[dir]) return decCache[dir]; const o = {};
    try { for (const l of fs.readFileSync(dir + '/_decisions.jsonl', 'utf8').split('\n').filter(Boolean)) { const r = JSON.parse(l); o[r.no] = r; } } catch {} return (decCache[dir] = o); };
  for (const f of sig.files) {
    const dir = path.dirname(f), rel = dir.slice(PLAN_BASE.length), m = path.basename(f).match(/^q(\d+)-solution/);
    const no = Number(m[1]); const js = EXAM_BASE + rel + '.js';
    if (!fs.existsSync(js)) continue;
    let bank = banks[js]; if (!bank) { try { bank = banks[js] = bankOf(js); } catch { bank = banks[js] = null; } }
    const q = bank && bank[no - 1]; if (!q) continue;
    let plan; try { plan = readJson(f); } catch { continue; }
    if (typeof plan.capability !== 'string') continue;
    const dec = decOf(dir)[no]; const verified = !(dec && dec.render === 'NOT_RUN' && /ds-plan 2026-11-19/.test(String(dec.note || ''))); // DeepSeek 이 글로만 쓴 plan 은 렌더 전이라 본보기로 쓰지 않는다
    const text = [q.content, String(q.solution || '').slice(0, 500)].join(' '), figText = [plan.caption, plan.accessibilityDescription, dec && dec.why].join(' ');
    entries.push({ f, rel, no, sub: q.subUnitKey || '', std: q.standardUnitKey || '', course: q.standardCourse || '', cap: plan.capability,
      size: fs.statSync(f).size, verified, tok: tokens(text), tokF: tokens(figText) });
  }
  for (const d of fs.readdirSync(GOLDEN)) { const f = `${GOLDEN}/${d}/plan.json`; if (!fs.existsSync(f)) continue;
    let plan; try { plan = readJson(f); } catch { continue; }
    if (typeof plan.capability !== 'string') continue;
    entries.push({ f, rel: 'golden/' + d, no: 0, sub: '', std: '', course: '', cap: plan.capability, size: fs.statSync(f).size, verified: true, golden: true,
      tok: [], tokF: tokens([plan.caption, plan.accessibilityDescription].join(' ')) }); }
  const df = {};
  for (const e of entries) for (const t of new Set([...e.tok, ...e.tokF])) df[t] = (df[t] || 0) + 1;
  const out = { v: 4, sig: { n: sig.n, mt: sig.mt }, N: entries.length, df, entries };
  fs.mkdirSync(path.dirname(INDEX_CACHE), { recursive: true });
  fs.writeFileSync(INDEX_CACHE, JSON.stringify(out));
  return out;
}

// 장부 사유·발문에 이 낱말이 있으면 그 capability 의 본보기를 우선한다
const KEYWORD_CAP = [
  [/벤다이어그램|벤 다이어그램|합집합|교집합|여집합|배반|포함관계|대응도|함수의 대응/, 'set-diagram-figure-v1'],
  [/정규분포|수형도|도수분포|히스토그램|상자그림|줄기와 잎|산점도|이산확률|확률분포|주사위|막대/, 'stat-chart-figure-v1'],
  [/수직선|해집합|구간의 교집합/, 'number-line-figure-v1'],
  [/입체|각뿔|각기둥|원뿔|원기둥|구의|정사면체|정육면체|전개도/, 'solid-figure-v1'],
  [/최단경로|도로망|격자/, 'lattice-path-figure-v1'],
  [/타원|쌍곡선|포물선의 초점/, 'ellipse-figure-v1'],
  [/물의 높이|물 채우기|그릇/, 'container-fill-figure-v1'],
  [/원탁|원순열|원형|동심원|원 위의|단위원/, 'construction-spike-v1'],
  [/계단|점프|고립점|불연속/, 'piecewise-discontinuous-spike-v1'],
  [/구간별|조각|절댓값/, 'piecewise-polynomial-spike-v1']
];
function pickExemplars(idx, q, queryText, figQuery, exclude) {
  const idf = t => Math.log((idx.N + 1) / ((idx.df[t] || 0) + 1));
  const vec = toks => { const w = new Map(toks.map(t => [t, idf(t)])); let n = 0; for (const x of w.values()) n += x * x; return { w, n: Math.sqrt(n) || 1 }; };
  const cosOf = (qv, toks) => { let dot = 0, en = 0; for (const t of toks) { const w = idf(t); en += w * w; const a = qv.w.get(t); if (a) dot += a * w; } return dot / (qv.n * (Math.sqrt(en) || 1)); };
  const qv = vec(tokens(queryText)), fv = vec(tokens(figQuery));
  const wantCaps = new Set(KEYWORD_CAP.filter(([re]) => re.test(figQuery)).map(x => x[1]));
  const scored = [];
  for (const e of idx.entries) {
    if (exclude.has(e.f)) continue;
    const cosT = e.tok.length ? cosOf(qv, e.tok) : 0, cosF = e.tokF.length ? cosOf(fv, e.tokF) : 0;
    const tier = !e.golden && q.subUnitKey && e.sub === q.subUnitKey ? 0.3 : !e.golden && q.standardUnitKey && e.std === q.standardUnitKey ? 0.18 : !e.golden && q.standardCourse && e.course === q.standardCourse ? 0.06 : 0;
    const tierName = tier === 0.3 ? 'subUnitKey' : tier === 0.18 ? 'standardUnitKey' : tier === 0.06 ? 'standardCourse' : e.golden ? 'golden' : '유사도';
    const capBoost = wantCaps.has(e.cap) ? 0.45 : 0;
    const score = tier + 0.6 * cosT + 1.2 * cosF + capBoost + (e.verified ? 0.1 : -0.5) - (e.size > 14000 ? 0.45 : e.size > PLAN_MAX ? 0.2 : 0);
    scored.push({ e, score, tierName: tierName + (capBoost ? '+형태' : '') });
  }
  scored.sort((a, b) => b.score - a.score);
  const picked = [], perExam = {};
  for (const s of scored) {
    if (picked.length >= PER_Q) break;
    if (s.e.size > PLAN_MAX && picked.length >= 1) continue; // 큰 plan 은 첫 후보일 때만
    if (picked.some(p => p.e.rel === s.e.rel && p.e.no === s.e.no)) continue; // 같은 문항의 다른 plan(-2 등)은 건너뛴다
    if ((perExam[s.e.rel] || 0) >= 2) continue;
    perExam[s.e.rel] = (perExam[s.e.rel] || 0) + 1; picked.push(s);
  }
  return picked;
}

// ---------- plan 에서 쓰인 키·값(가이드 발췌용) ----------
const GENERIC = new Set(['capability', 'caption', 'accessibilityDescription', 'sourceConditions', 'newVisualInformation', 'condition', 'mappedTo', 'text', 'name', 'value', 'args', 'inputs', 'kind', 'refs', 'label', 'color', 'true', 'false', 'null', 'plan', 'panels', 'nodes', 'integer', 'expression']);
function planKeys(plan, set = new Set(), depth = 0) {
  if (depth > 6 || !plan || typeof plan !== 'object') return set;
  if (Array.isArray(plan)) { for (const x of plan.slice(0, 40)) planKeys(x, set, depth + 1); return set; }
  for (const [k, v] of Object.entries(plan)) {
    set.add(k);
    if (typeof v === 'string' && /^(op|family|function|type|recipeId|schemaVersion|capability|kind|labelAt|mode|style|shape|orientation|pattern|labelKind)$/.test(k) && v.length <= 40) set.add(v);
    else planKeys(v, set, depth + 1);
  }
  return set;
}
const idents = s => [...new Set((String(s).match(/[A-Za-z_][A-Za-z0-9_]{3,}/g) || []))];

// capability → AUTHOR_GUIDE 절(### 뒤 첫 낱말)
const SECTIONS = {
  'construction-spike-v1': ['3-1', '3-8', '3-9', '3-9-색', '3-10', '3-41', '3-46'],
  'multi-curve-figure-v1': ['3-40', '3-14', '3-6-영역', '3-46'],
  'piecewise-polynomial-spike-v1': ['3-2', '3-3', '3-4', '3-5', '3-6', '3-6-영역', '3-14'],
  'polynomial-spike-v1': ['3-2', '3-3', '3-4', '3-5', '3-6', '3-6-영역', '3-14'],
  'rational-spike-v1': ['3-2', '3-14'],
  'sqrt-affine-spike-v1': ['3-2', '3-14'],
  'trigonometric-spike-v1': ['3-2', '3-7', '3-7b', '3-7c', '3-13', '3-14'],
  'piecewise-discontinuous-spike-v1': ['3-15', '3-14'],
  'composite-panels-v1': ['3-16'],
  'set-diagram-figure-v1': ['3-12'],
  'stat-chart-figure-v1': ['3-11', '3-43'],
  'solid-figure-v1': ['3-입체'],
  'ellipse-figure-v1': ['3-45'],
  'lattice-path-figure-v1': ['3-17'],
  'container-fill-figure-v1': ['3-50'],
  'number-line-figure-v1': []
};

let guideCache = null;
function guideUnits() {
  if (guideCache) return guideCache;
  const lines = fs.readFileSync(AUTHOR_GUIDE, 'utf8').split('\n');
  const units = []; let sec = '', secLine = 0, seen44 = false; let in4 = false, openJson = false;
  const bal = t => { let b = 0; for (const c of t) { if (c === '{' || c === '[') b++; else if (c === '}' || c === ']') b--; } return b; };
  lines.forEach((ln, i) => {
    let m;
    if ((m = ln.match(/^### (\S+)/))) { sec = m[1].replace(/[.:,]+$/, ''); secLine = i; in4 = false; units.push({ sec, head: true, text: ln, i }); return; }
    if (/^## 3\. /.test(ln)) { sec = 'overview'; in4 = false; units.push({ sec, head: true, text: ln, i }); return; }
    if (/^## 4\. /.test(ln)) { if (seen44) { sec = ''; in4 = false; return; } seen44 = true; sec = 'names'; in4 = true; units.push({ sec, head: true, text: ln, i }); return; }
    if (/^## /.test(ln)) { sec = ''; in4 = false; return; }
    if (!sec) return;
    if (!ln.trim()) { openJson = false; return; }
    // 여러 줄에 걸친 JSON 예시는 한 단위로 묶는다(줄만 따로 뽑으면 조각이 된다)
    const last = units[units.length - 1];
    const isCont = /^\s+["{}\[\]]/.test(ln), isItem = /^\s*(- |\* |\d+\. |\*\*|\|)/.test(ln);
    if (last && !last.head && last.sec === sec && (last.bal > 0 || isCont || (openJson && !isItem))) { last.text += '\n' + ln; last.bal += bal(ln); return; }
    openJson = ln.includes('`{"') && bal(ln) > 0;
    units.push({ sec, head: false, text: ln, i, bal: bal(ln) });
  });
  const df = {}; for (const u of units) { u.ids = idents(u.text); for (const t of u.ids) df[t] = (df[t] || 0) + 1; }
  return (guideCache = { units, df, N: units.length });
}

// exemplars: plan 객체 배열 → 발췌 텍스트
function guideExcerpt(plans) {
  const g = guideUnits(); const caps = new Set(), keys = new Set();
  for (const p of plans) { planKeys(p, keys); const walk = o => { if (!o || typeof o !== 'object') return; if (typeof o.capability === 'string') caps.add(o.capability); for (const v of Object.values(o)) walk(v); }; walk(p); }
  const secs = new Set(['overview', 'names']);
  for (const c of caps) for (const s of (SECTIONS[c] || [])) secs.add(s);
  const idf = t => Math.log((g.N + 1) / ((g.df[t] || 0) + 1));
  const kw = [...keys].filter(k => k.length >= 4 && !GENERIC.has(k));
  const capNames = [...caps];
  const cands = [];
  for (const u of g.units) {
    if (!secs.has(u.sec)) continue;
    let score = 0; const hit = new Set(u.ids);
    for (const k of kw) if (hit.has(k)) score += idf(k);
    for (const c of capNames) if (u.text.includes(c)) score += 3;
    if (u.head) score += 1000; // 절 제목은 항상(뒤에서 낱줄이 하나도 안 뽑힌 절의 제목은 뺀다)
    cands.push({ u, score });
  }
  // 낱줄을 점수순으로 예산 안에서 고른다. 한 줄이 너무 길면(>2400자) 앞부분만.
  const chosen = new Set(); let used = 0;
  const cut = t => t.length > 3000 ? t.slice(0, 3000) + ' …(줄임)' : t;
  const body = cands.filter(c => !c.u.head && c.score > 0).sort((a, b) => b.score - a.score);
  for (const c of body) { const b = Buffer.byteLength(cut(c.u.text)) + 1; if (used + b > GUIDE_BYTES) continue; used += b; chosen.add(c.u.i); }
  const out = []; let lastSec = null;
  for (const c of cands) {
    if (c.u.head) continue;
    if (!chosen.has(c.u.i)) continue;
    if (c.u.sec !== lastSec) { const h = cands.find(x => x.u.head && x.u.sec === c.u.sec); out.push(h ? h.u.text : '### ' + c.u.sec); lastSec = c.u.sec; }
    out.push(cut(c.u.text));
  }
  return { text: out.join('\n'), bytes: used, lines: out.length, caps: [...caps], secs: [...secs].filter(s => s !== 'overview' && s !== 'names') };
}

// ---------- INPUT 만들기 ----------
const stripSource = plan => { const p = JSON.parse(JSON.stringify(plan)); if (Array.isArray(p.sourceConditions)) { p.sourceConditions = p.sourceConditions.filter(c => !(c && c.mappedTo === 'PRESERVED_ARCHIVE_BANK')); if (!p.sourceConditions.length) delete p.sourceConditions; } return p; };

// rows: [{no, ord, ordinal, fam, reason}], bank: 문항 배열, examRel: 'high/h2/...'. extra: no → {problems:[], prev:obj} (재시도용)
function buildInput({ bank, rows, examRel, extra }) {
  const idx = buildIndex();
  const exam = new Set(); // 이 시험지 자기 자신의 plan 은 본보기로 써도 된다(같은 문체)
  const exemplars = [], exIndex = new Map(), perQ = {};
  let exBytes = 0;
  for (const r of rows) {
    const q = bank[r.no - 1];
    const query = [q.content, r.reason, String(q.solution || '').slice(0, 600)].join(' ');
    const picks = pickExemplars(idx, q, query, String(r.reason || '').replace(/^plan 대기:?s*/, '') + ' ' + String(q.content || '').slice(0, 200), exam);
    perQ[r.no] = [];
    for (const s of picks) {
      let id = exIndex.get(s.e.f);
      if (!id) {
        const plan = readJson(s.e.f); const compact = JSON.stringify(stripSource(plan));
        if (exBytes + Buffer.byteLength(compact) > EXEMPLAR_BYTES && perQ[r.no].length >= 1) continue; // 예산 초과면 문항당 1개는 보장
        id = 'E' + (exemplars.length + 1); exIndex.set(s.e.f, id); exBytes += Buffer.byteLength(compact);
        let head = ''; if (!s.e.golden) { try { const b = bankOf(EXAM_BASE + s.e.rel + '.js'); head = String(b[s.e.no - 1].content || '').replace(/\s+/g, ' ').slice(0, 280); } catch {} }
        exemplars.push({ id, e: s.e, plan, compact, head, tier: s.tierName });
      }
      perQ[r.no].push({ id, tier: s.tierName });
    }
  }
  const guide = guideExcerpt(exemplars.map(x => x.plan));
  const parts = [];
  parts.push('[본보기 plan 모음] 아래 plan 들은 이미 쓰여 엔진 계약에 맞는 것이다. 각 문항의 "본보기"에 적힌 번호의 plan 을 구조·필드 이름 그대로 두고 값만 이 문항에 맞게 바꿔 쓴다. (본보기의 sourceConditions "source" 항목은 스크립트가 넣으므로 보이지 않는다.)');
  for (const x of exemplars) {
    parts.push(`#### ${x.id}  capability=${x.e.cap}  ${x.e.golden ? '(ops/golden 본보기)' : x.e.rel.split('/').pop() + ' Q' + x.e.no}  [고른 이유: ${x.tier}${x.e.sub ? ', ' + x.e.sub : ''}]`);
    if (x.head) parts.push('그 문항(앞부분): ' + x.head);
    parts.push('plan: ' + x.compact);
  }
  parts.push('');
  parts.push('[가이드 발췌] 본보기가 쓰는 capability 와 필드에 해당하는 작성 지침 줄만 뽑았다. 이 밖의 가이드는 읽을 수 없고 읽을 필요도 없다.');
  parts.push(guide.text);
  parts.push('');
  parts.push('[대상 문항]');
  for (const r of rows) {
    const q = bank[r.no - 1];
    parts.push([`### Q${r.no}   (출력 표지 === Q${r.no} ===)`,
      `장부 판정 사유: ${r.reason}${r.fam ? '  [family: ' + r.fam + ']' : ''}`,
      `분류: ${q.standardCourse || ''} / ${q.standardUnit || ''} / ${q.subUnitKey || ''}`,
      `문제: ${q.content ?? q.question ?? ''}`,
      q.choices && q.choices.length ? `보기: ${JSON.stringify(q.choices)}` : '',
      q.image ? `문제 그림: 있다(이미지 파일이라 볼 수 없다. 해설이 쓰는 값으로 그린다)` : '',
      `정답: ${q.answer ?? ''}`, `해설: ${q.solution ?? ''}`,
      `본보기: ${perQ[r.no].map(p => p.id).join(', ') || '(없음: 가이드 발췌와 위 다른 본보기를 참고)'}`,
      extra && extra[r.no] ? `[재시도] 직전 답의 문제: ${extra[r.no].problems.join(' / ')}\n직전 답(고쳐서 다시 쓴다): ${JSON.stringify(extra[r.no].prev ?? null)}` : ''].filter(Boolean).join('\n'));
  }
  const text = parts.join('\n') + '\n';
  return { text, stats: { exemplars: exemplars.length, exBytes, guideBytes: guide.bytes, guideLines: guide.lines, caps: guide.caps, secs: guide.secs, bytes: Buffer.byteLength(text), lines: text.split('\n').length }, perQ, exemplars };
}

module.exports = { buildInput, buildIndex, pickExemplars, tokens, guideExcerpt };

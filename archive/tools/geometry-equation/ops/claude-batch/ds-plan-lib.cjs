// ds-plan-exam.sh 가 부르는 보조 도구(대상 계산·검증·정리). 저장소 루트에서 실행한다.
//   node ds-plan-lib.cjs prep     <시험지 JS> <outdir>   plan 대기 문항 − 이미 plan/판정이 있는 문항 → <outdir>/pending.json. 문맥 꾸러미(본보기 plan·가이드 발췌·문항)를 호출 묶음(기본 5문항)마다
//                                                        <outdir>/INPUT-<k>.md 로 만들고 묶음 목록 chunks.txt(줄마다 문항 번호 쉼표 목록)와 INPUT 크기를 쓴다. 대상 수를 출력(0이면 할 일 없음)
//   node ds-plan-lib.cjs expand   <시험지 JS> <outdir> <답 파일…>  DeepSeek 의 답(=== Q<번호> === 줄 뒤에 JSON 하나씩)을 읽어 FIGURE 는 plan 폴더에 q<no>-solution.json(문제 원문 source 항목은 여기서 넣는다),
//                                                        그 밖의 판정은 <outdir>/q<no>/result.json 으로 펼친다. 읽은 JSON 은 <outdir>/q<no>/answer.json 에 남긴다(재시도 입력용)
//   node ds-plan-lib.cjs retry-prep <시험지 JS> <outdir>  validate.json 의 bad 문항만 문제 목록·직전 답과 함께 INPUT-r<k>.md 로 만들고 chunks-retry.txt 를 쓴다. 묶음 수를 출력
//   node ds-plan-lib.cjs validate <시험지 JS> <outdir>   대상 문항마다 기계 검증 → <outdir>/validate.json({ok:[no…], bad:[{no,problems}]}). 문제가 있으면 줄마다 출력하고 종료코드 1
//   node ds-plan-lib.cjs finalize <시험지 JS> <outdir>   validate.json 기준으로 정리: 못 통과한 문항의 plan 파일을 치우고(백업), 통과한 문항의 _decisions.jsonl 행과
//                                                        source-revision.json 을 쓰고, 예상 밖의 변경을 되돌린다. 통과 문항 번호를 출력한다.
//   node ds-plan-lib.cjs report   <시험지 JS> <outdir>   통과 문항 결과 표(문항 | 결과 | 설명 | PNG 경로)를 출력한다.
// 문항 번호 no = 시험지 문항 배열의 1부터 센 자리(공장 build.cjs 와 같다). 렌더에 넘기는 ordinal = 배열에 숫자가 아닌 id가 있으면 그 id, 아니면 no.
// DeepSeek 은 탐색하지 않는다(2026-11-19 사용자 지시: 탐색이 문항당 9분 중 거의 전부였다). 필요한 것은 INPUT 에 다 넣고 답만 받는다(도구 없는 agent).
// 글로만 쓴다(2026-11-19 사용자 지시): 렌더·PNG 확인은 하지 않는다(나중에 공장이 일괄 렌더하고 실패분은 수리로 넘긴다).
// DeepSeek 이 쓰는 것: <PLANDIR>/q<no>-solution.json(FIGURE), <OUT>/q<no>/result.json(FIGURE 가 아닌 문항만). _decisions.jsonl 은 이 도구가 쓴다.
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process');
const LEDGER = 'archive/tools/geometry-equation/production/exam-figure-ledger/';
const PLAN_BASE = 'docs/plans/archive-one-route-upgrade/svg-plans-expanded/';
const DECISIONS = ['FIGURE', 'EXEMPT', 'CONTENT', 'UNSUPPORTED'];
// 최상위 accessibilityDescription 을 받지 않는 capability(엔진이 형태별 고정 문장을 쓴다: production/stat-chart-v1.mjs:1789, set-diagram-v1.mjs:1080, lattice-path-v1.mjs:27, container-fill-v1.mjs:271).
// 이 필드를 쓰면 렌더가 STAT_CHART_PLAN_INVALID 등으로 거절한다(2026-11-20 일괄 렌더: 이 세 형태 plan 284개 중 0개 통과). expand 가 지우고, validate 는 요구하지 않는다.
const NO_A11Y_CAPS = new Set(['stat-chart-figure-v1', 'set-diagram-figure-v1', 'lattice-path-figure-v1', 'container-fill-figure-v1']);
const [cmd, js, out, ...rest] = process.argv.slice(2);
if (!cmd || !js || !out) { console.error('usage: ds-plan-lib.cjs prep|expand|retry-prep|validate|finalize|report <시험지 JS> <outdir>'); process.exit(2); }
const src = js.replace(/\\/g, '/');
const PFX = 'archive/exams/original/';
if (!src.startsWith(PFX) || !src.endsWith('.js')) { console.error('시험지 JS는 저장소 루트 기준 archive/exams/original/...js 경로여야 한다'); process.exit(2); }
const rel = src.slice(PFX.length, -3);
const ledgerPath = LEDGER + rel + '.json';
const planDir = PLAN_BASE + 'original/' + rel + '/';
const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(src, 'utf8'), ctx);
const bank = ctx.window.questionBank ?? ctx.window.examData?.questions;
if (!Array.isArray(bank) || !bank.length) { console.error('문항 배열이 없다'); process.exit(2); }
const nonNumericIds = bank.some(q => typeof q.id !== 'number');
const noOf = ord => { const i = bank.findIndex(q => String(q.id) === String(ord)); return i < 0 ? null : i + 1; };
const ordinalOf = no => (nonNumericIds ? bank[no - 1].id : no);
const planFile = no => `q${no}-solution.json`;
const decFile = planDir + '_decisions.jsonl';
const readDecisions = () => fs.existsSync(decFile) ? fs.readFileSync(decFile, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : [];
const git = (...a) => cp.execFileSync('git', a, { encoding: 'utf8', maxBuffer: 1 << 26 }).trim();
const readJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const pendingPath = path.join(out, 'pending.json');

function ledgerPending() {
  if (!fs.existsSync(ledgerPath)) return [];
  const led = readJson(ledgerPath);
  return led.items.filter(i => i.state === 'OPEN_LAYOUT' && String(i.reason || '').startsWith('plan 대기'));
}

const CHUNK = Math.max(1, Number(process.env.DS_CHUNK) || 5);
// rows 를 CHUNK 문항씩 묶어 문맥 꾸러미(INPUT-<prefix><k>.md)를 쓰고 묶음 목록을 chunksFile 에 쓴다. INPUT 크기를 표준에러로 알린다.
function writeChunks(rows, prefix, chunksFile, extra) {
  const { buildInput } = require('./ds-plan-context.cjs');
  const lines = [];
  for (let k = 0, i = 0; i < rows.length; i += CHUNK, k++) {
    const part = rows.slice(i, i + CHUNK);
    const r = buildInput({ bank, rows: part, examRel: rel, extra });
    const name = `${prefix}${k + 1}.md`;
    fs.writeFileSync(path.join(out, name), r.text);
    lines.push(part.map(x => x.no).join(','));
    console.error(`${name}: ${part.length}문항 ${(r.stats.bytes / 1024).toFixed(1)}KB ${r.stats.lines}줄 (본보기 ${r.stats.exemplars}개 ${(r.stats.exBytes / 1024).toFixed(1)}KB, 가이드 ${r.stats.guideLines}줄 ${(r.stats.guideBytes / 1024).toFixed(1)}KB, capability ${r.stats.caps.join('/')})`);
  }
  fs.writeFileSync(path.join(out, chunksFile), lines.join('\n') + '\n');
}

if (cmd === 'prep') {
  fs.mkdirSync(out, { recursive: true });
  const dec = readDecisions().map(d => d.no);
  const existingFiles = fs.existsSync(planDir) ? fs.readdirSync(planDir) : [];
  const hasPlanFile = no => existingFiles.some(f => new RegExp(`^q${no}-solution(-\\d+)?\\.json$`).test(f));
  const rows = [], skipped = { plan: 0, decided: 0, notInBank: 0 };
  for (const it of ledgerPending()) {
    const no = noOf(it.ord);
    if (!no) { skipped.notInBank++; continue; }
    if (hasPlanFile(no)) { skipped.plan++; continue; }
    if (dec.includes(no)) { skipped.decided++; continue; }
    rows.push({ ord: it.ord, no, ordinal: ordinalOf(no), fam: it.fam || '', reason: it.reason });
  }
  rows.sort((a, b) => a.no - b.no);
  fs.writeFileSync(pendingPath, JSON.stringify({ exam: src, rows, skipped }, null, 1));
  if (skipped.plan || skipped.decided || skipped.notInBank) console.error(`건너뜀: plan 있음 ${skipped.plan}, 이미 판정 ${skipped.decided}, 문항 번호 없음 ${skipped.notInBank}`);
  if (rows.length) writeChunks(rows, 'INPUT-', 'chunks.txt', null);
  console.log(rows.length);
  process.exit(0);
}

const pend = readJson(pendingPath).rows;
const hasKorean = s => /[가-힣]/.test(s);
const CONTAINERS = ['graphPlan', 'chart', 'numberLine', 'mathPlan', 'planeMarks', 'solids', 'ellipse', 'setDiagram'];

// plan-lint: 렌더 전에 엔진의 검증 함수로 plan 형식 오류를 잡는다(Chrome 불필요, 문항당 1초 안팎). 기본으로 켠다.
// 환경변수 PLAN_LINT=0 이면 건너뛴다(엔진·python 의존성이 없는 환경 점검용). lint 자체가 못 돌면 경고만 하고 기존 검증만 한다.
let lintCache = null;
function lintResults() {
  if (lintCache) return lintCache;
  lintCache = {};
  if (process.env.PLAN_LINT === '0') return lintCache;
  const files = pend.map(r => planDir + planFile(r.no)).filter(f => fs.existsSync(f));
  if (!files.length) return lintCache;
  const r = cp.spawnSync(process.execPath, [path.join(__dirname, 'plan-lint.cjs'), '--json', ...files], { encoding: 'utf8', maxBuffer: 1 << 26, timeout: 20 * 60e3 });
  if (r.status === null || r.status === 2 || !r.stdout) { console.error('WARN: plan-lint 를 실행하지 못했다(' + String(r.stderr || r.error || '').split('\n')[0] + '). 렌더 사전검사 없이 기존 검증만 한다.'); return lintCache; }
  for (const line of r.stdout.split('\n').filter(Boolean)) { try { const j = JSON.parse(line); lintCache[j.file.replace(/\\/g, '/')] = j; } catch { /* 한 줄이 깨져도 나머지는 쓴다 */ } }
  return lintCache;
}

function checkLanguage(text, surface) {
  const { validateSvgStudentLanguage } = require(path.resolve('archive/tools/svg-language-contract.cjs'));
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // 같은 계약을 plan 글에 적용한다. title/desc 한쪽에 넣어 영어·입력용 표기·축척을 검사한다.
  const title = surface === 'title' ? text : '해설 그림';
  const desc = surface === 'desc' ? text : '그래프에서 값과 관계를 보여 주는 해설 그림이다.';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="t d"><title id="t">${esc(title)}</title><desc id="d">${esc(desc)}</desc></svg>`;
  const r = validateSvgStudentLanguage(svg);
  return r.errors.filter(e => e.surface === surface || !e.surface && !String(e.code).startsWith('SVG_ACCESSIBILITY_DESCRIPTION')).map(e => e.code + (e.token ? ':' + e.token : ''));
}

// 같은 capability 로 이미 있는 plan 들이 쓴 필드(최상위, 그리고 형태 본문 한 단계 아래)의 합집합. 한 번도 쓰인 적 없는 필드는 지어낸 것으로 본다.
let knownCache = null;
function knownFields() {
  if (knownCache) return knownCache;
  const by = {}; const base = PLAN_BASE + 'original/';
  const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = d + '/' + e.name;
    if (e.isDirectory()) { if ((p + '/') !== planDir) walk(p); } else if (/^q\d+-solution(-\d+)?\.json$/.test(e.name)) {
      try { const j = readJson(p); const c = j.capability; if (typeof c !== 'string') continue;
        const o = by[c] || (by[c] = { n: 0, top: new Set(), sub: {} }); o.n++;
        for (const k of Object.keys(j)) { o.top.add(k);
          if (CONTAINERS.includes(k) && j[k] && typeof j[k] === 'object' && !Array.isArray(j[k])) { const s = o.sub[k] || (o.sub[k] = new Set()); for (const kk of Object.keys(j[k])) s.add(kk); } }
      } catch {} } } };
  walk(base.replace(/\/$/, ''));
  // ops/golden 의 plan.json 도 본보기다(plan 폴더에 plan 이 없는 capability 가 있다: exp-log-pair, lattice-path 등)
  const gd = 'archive/tools/geometry-equation/ops/golden';
  if (fs.existsSync(gd)) for (const d of fs.readdirSync(gd)) { try { const j = readJson(`${gd}/${d}/plan.json`); const c = j.capability; if (typeof c !== 'string') continue;
    const o = by[c] || (by[c] = { n: 0, top: new Set(), sub: {} }); o.n++;
    for (const k of Object.keys(j)) { o.top.add(k);
      if (CONTAINERS.includes(k) && j[k] && typeof j[k] === 'object' && !Array.isArray(j[k])) { const s = o.sub[k] || (o.sub[k] = new Set()); for (const kk of Object.keys(j[k])) s.add(kk); } } } catch {} }
  return (knownCache = by);
}

function problemsOfPlan(r) {
  const problems = [], pf = planDir + planFile(r.no);
  let plan = null;
  try { plan = readJson(pf); } catch (e) { return ['plan JSON 을 읽을 수 없다: ' + e.message]; }
  const raw = fs.readFileSync(pf, 'utf8');
  if (/�|\?\?/.test(raw)) problems.push('plan 에 깨진 글자(? 또는 U+FFFD)가 있다');
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) return ['plan 최상위가 객체가 아니다'];
  if (typeof plan.capability !== 'string' || !plan.capability) problems.push('plan.capability 가 없다');
  for (const k of ['caption', 'accessibilityDescription']) {
    if (k === 'accessibilityDescription' && NO_A11Y_CAPS.has(plan.capability)) continue; // 이 형태는 받지 않는다(있으면 아래 plan-lint 가 짚는다)
    if (typeof plan[k] !== 'string' || !plan[k].trim()) { problems.push(`plan.${k} 가 없다`); continue; }
    if (/\^|sqrt|\\frac|\\dfrac|축척/.test(plan[k]) || /(?<![\w)])\*|\*(?![\w(])/.test(plan[k])) problems.push(`plan.${k} 에 입력용 표기(^, sqrt, *, \\frac)나 "축척"이 있다`);
    const errs = checkLanguage(plan[k], k === 'caption' ? 'title' : 'desc');
    if (errs.length) problems.push(`plan.${k} 가 언어 계약을 통과하지 못한다: ${errs.join(', ')}`);
  }
  if (!Array.isArray(plan.sourceConditions) || !plan.sourceConditions.length) problems.push('plan.sourceConditions 가 없다(본보기 플랜처럼 source 조건 필요)');
  else if (!plan.sourceConditions.some(c => c && c.mappedTo === 'PRESERVED_ARCHIVE_BANK')) problems.push('plan.sourceConditions 에 mappedTo PRESERVED_ARCHIVE_BANK 항목(문제 원문)이 없다');
  if (!Array.isArray(plan.newVisualInformation) || !plan.newVisualInformation.length) problems.push('plan.newVisualInformation 이 없다');
  // 지어낸 필드 검사(같은 capability 의 기존 plan 3개 이상이 있을 때만)
  if (typeof plan.capability === 'string') {
    const known = knownFields()[plan.capability];
    if (!known) problems.push(`capability "${plan.capability}" 로 쓴 기존 plan 이 없다(이름이 틀렸거나 새 형태다. 가이드의 정확한 이름을 확인하고, 엔진이 지원하지 않는 것이 확실하면 UNSUPPORTED)`);
    else if (known.n >= 3) {
      const REQUIRED_TOP = ['capability', 'caption', 'accessibilityDescription', 'sourceConditions', 'newVisualInformation']; // 필수 필드는 본보기에 없어도 지어낸 필드가 아니다
      const bad = Object.keys(plan).filter(k => !known.top.has(k) && !REQUIRED_TOP.includes(k));
      if (bad.length) problems.push(`본보기에 없는 최상위 필드: ${bad.join(', ')} (같은 capability 의 기존 plan ${known.n}개에서 쓰인 적 없다. 필드를 지어내지 않는다)`);
      for (const k of CONTAINERS) if (plan[k] && typeof plan[k] === 'object' && !Array.isArray(plan[k]) && known.sub[k]) {
        const b2 = Object.keys(plan[k]).filter(kk => !known.sub[k].has(kk));
        if (b2.length) problems.push(`본보기에 없는 ${k} 하위 필드: ${b2.join(', ')}`); }
    }
  }
  const lint = lintResults()[pf];
  if (lint && lint.status === 'FAIL') for (const p of lint.problems || [lint]) problems.push(`렌더 사전검사(plan-lint) ${p.code}: ${p.reason}${p.fix ? ' → ' + p.fix : ''}`);
  return problems;
}

// 문항 하나의 결과를 읽는다. FIGURE 는 plan 파일이 곧 판정이다(result.json 이 있으면 why 만 가져온다).
function resultOf(r) {
  const pf = planDir + planFile(r.no);
  let res = null; try { res = readJson(path.join(out, 'q' + r.no, 'result.json')); } catch {}
  if (fs.existsSync(pf) && (!res || res.decision === 'FIGURE')) {
    let why = res && typeof res.why === 'string' ? res.why : '';
    if (!why) { try { why = String(readJson(pf).caption || '').split(/(?<=[.다])\s/)[0]; } catch {} }
    return { decision: 'FIGURE', why };
  }
  return res;
}

function validateOne(r) {
  const problems = [], pf = planDir + planFile(r.no);
  const res = resultOf(r);
  if (!res) { let pe = ''; try { pe = fs.readFileSync(path.join(out, 'q' + r.no, 'parse-error.txt'), 'utf8').trim(); } catch {}
    return [pe ? `답에서 이 문항의 JSON 을 읽지 못했다: ${pe}` : `이 문항의 답(=== Q${r.no} === 표지와 JSON)이 없다`]; }
  if (!DECISIONS.includes(res.decision)) return [`decision 값이 정해진 것이 아니다(${res.decision})`];
  if (res.decision === 'FIGURE') {
    if (!fs.existsSync(pf)) return [`FIGURE 인데 ${planFile(r.no)} 가 plan 폴더에 없다`];
    return problemsOfPlan(r);
  }
  if (typeof res.why !== 'string' || res.why.trim().length < 12 || !hasKorean(res.why)) problems.push('why 가 비었거나 너무 짧다(구체적인 한국어 사유 필요)');
  if (fs.existsSync(pf)) problems.push(`${planFile(r.no)} 가 plan 폴더에 남아 있는데 판정은 ${res.decision} 이다(plan 을 쓰지 않았다면 파일을 지우고, plan 을 썼다면 result.json 을 지운다)`);
  if (res.decision === 'UNSUPPORTED') {
    if (typeof res.errorCode !== 'string' || !res.errorCode.trim()) problems.push('UNSUPPORTED 는 errorCode(지원하지 않는다고 본 근거)가 필요하다');
    if (typeof res.attempts !== 'string' || res.attempts.trim().length < 10) problems.push('UNSUPPORTED 는 attempts(찾아 본 방법)가 필요하다');
  }
  return problems;
}

// ---------- DeepSeek 답 펼치기 ----------
// 답 형식: 문항마다 "=== Q<번호> ===" 한 줄, 그 뒤에 JSON 객체 하나. 코드펜스는 있어도 읽는다.
//   {"decision":"FIGURE","plan":{…}}  |  {"decision":"EXEMPT|CONTENT|UNSUPPORTED","why":"…","errorCode":"…","attempts":"…"}
const stripAnsi = t => String(t).replace(/\x1b\[[0-9;?]*[A-Za-z]/g, '').replace(/\r/g, '');
// 첫 '{' 부터 짝이 맞는 '}' 까지(문자열 안의 괄호는 무시)
function extractObject(t) {
  const a = t.indexOf('{'); if (a < 0) throw new Error('JSON 객체가 없다');
  let depth = 0, inStr = false, esc = false;
  for (let i = a; i < t.length; i++) { const c = t[i];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
    if (c === '"') inStr = true; else if (c === '{') depth++; else if (c === '}' && --depth === 0) return t.slice(a, i + 1); }
  throw new Error('JSON 객체가 닫히지 않았다(출력이 잘렸을 수 있다)');
}
function parseLoose(seg) {
  const t = extractObject(seg);
  try { return JSON.parse(t); } catch (e1) {
    try { return JSON.parse(t.replace(/\\(?!["\\/bfnrtu])/g, '\\\\')); } catch { throw e1; } // 잘못된 백슬래시 이스케이프(LaTeX)만 고쳐 본다
  }
}
function parseAnswers(text) {
  const t = stripAnsi(text), re = /^[ \t`*#>-]*={2,}[ \t]*Q(\d+)[ \t]*={2,}[ \t`*]*$/gm, marks = [];
  let m; while ((m = re.exec(t))) marks.push({ no: Number(m[1]), at: m.index, end: m.index + m[0].length });
  return marks.map((mk, i) => ({ no: mk.no, seg: t.slice(mk.end, i + 1 < marks.length ? marks[i + 1].at : t.length) }));
}
const qdir = no => path.join(out, 'q' + no);
const rmQuiet = f => { try { fs.rmSync(f); } catch {} };

if (cmd === 'expand') {
  if (!rest.length) { console.error('usage: ds-plan-lib.cjs expand <시험지 JS> <outdir> <답 파일…>'); process.exit(2); }
  const targets = new Set(pend.map(r => r.no)); let n = 0, fail = 0;
  for (const file of rest) {
    let text = ''; try { text = fs.readFileSync(file, 'utf8'); } catch { console.error('답 파일을 읽을 수 없다: ' + file); continue; }
    for (const { no, seg } of parseAnswers(text)) {
      if (!targets.has(no)) { console.error(`WARN: 대상이 아닌 문항 Q${no} 의 답은 버린다`); continue; }
      fs.mkdirSync(qdir(no), { recursive: true });
      rmQuiet(path.join(qdir(no), 'parse-error.txt'));
      let obj; try { obj = parseLoose(seg); } catch (e) { fs.writeFileSync(path.join(qdir(no), 'parse-error.txt'), String(e.message) + '\n'); console.error(`Q${no}: 답을 읽지 못했다: ${e.message}`); fail++; continue; }
      fs.writeFileSync(path.join(qdir(no), 'answer.json'), JSON.stringify(obj, null, 1));
      const pf = planDir + planFile(no); let decision = obj.decision;
      if (!decision && obj.capability) decision = 'FIGURE';
      if (decision === 'FIGURE') {
        const plan = obj.plan && typeof obj.plan === 'object' ? obj.plan : (obj.capability ? obj : null);
        if (!plan) { fs.writeFileSync(path.join(qdir(no), 'parse-error.txt'), 'decision 이 FIGURE 인데 plan 객체가 없다\n'); fail++; continue; }
        const q = bank[no - 1];
        if (NO_A11Y_CAPS.has(plan.capability)) delete plan.accessibilityDescription; // 엔진이 받지 않는 필드(렌더가 PLAN_INVALID 로 거절한다)
        if (!Array.isArray(plan.sourceConditions)) plan.sourceConditions = [];
        if (!plan.sourceConditions.some(c => c && c.mappedTo === 'PRESERVED_ARCHIVE_BANK'))
          plan.sourceConditions.unshift({ id: 'source', condition: String(q.content ?? q.question ?? ''), mappedTo: 'PRESERVED_ARCHIVE_BANK' });
        fs.mkdirSync(planDir, { recursive: true });
        fs.writeFileSync(pf, JSON.stringify(plan, null, 2) + '\n');
        rmQuiet(path.join(qdir(no), 'result.json'));
      } else {
        const res = { decision: decision || null, why: obj.why };
        if (obj.errorCode !== undefined) res.errorCode = obj.errorCode;
        if (obj.attempts !== undefined) res.attempts = obj.attempts;
        fs.writeFileSync(path.join(qdir(no), 'result.json'), JSON.stringify(res, null, 1));
        rmQuiet(pf); // 판정이 FIGURE 가 아니면 plan 폴더에 plan 이 남지 않는다
      }
      n++;
    }
  }
  console.log(`EXPAND answers=${n} unreadable=${fail}`);
  process.exit(0);
}

if (cmd === 'retry-prep') {
  const v = readJson(path.join(out, 'validate.json'));
  const extra = {}, rows = [];
  for (const b of v.bad) { const r = pend.find(x => x.no === b.no); if (!r) continue; rows.push(r);
    let prev = null; try { prev = readJson(path.join(qdir(b.no), 'answer.json')); } catch {}
    extra[b.no] = { problems: b.problems, prev }; }
  rows.sort((a, b) => a.no - b.no);
  if (!rows.length) { console.log(0); process.exit(0); }
  writeChunks(rows, 'INPUT-r', 'chunks-retry.txt', extra);
  console.log(fs.readFileSync(path.join(out, 'chunks-retry.txt'), 'utf8').split('\n').filter(Boolean).length);
  process.exit(0);
}

if (cmd === 'validate') {
  const ok = [], bad = [], decisions = {};
  for (const r of pend) { const p = validateOne(r); if (p.length) bad.push({ no: r.no, problems: p }); else { ok.push(r.no); decisions[r.no] = resultOf(r).decision; } }
  fs.writeFileSync(path.join(out, 'validate.json'), JSON.stringify({ ok, bad, decisions }, null, 1));
  for (const b of bad) for (const p of b.problems) console.log(`Q${b.no}: ${p}`);
  console.log(`VALIDATE ok=${ok.length} bad=${bad.length} of ${pend.length}`);
  process.exit(bad.length ? 1 : 0);
}

if (cmd === 'finalize' || cmd === 'report') {
  const v = readJson(path.join(out, 'validate.json'));
  if (cmd === 'report') {
    for (const n of v.ok) { const r = resultOf(pend.find(x => x.no === n));
      let cap = ''; if (r.decision === 'FIGURE') { try { cap = ' [' + readJson(planDir + planFile(n)).capability + ']'; } catch {} }
      console.log(`Q${n} | ${r.decision === 'FIGURE' ? 'PLAN(렌더 NOT_RUN)' : r.decision}${cap} | ${String(r.why).replace(/\s+/g, ' ').slice(0, 160)}`); }
    process.exit(0);
  }
  // 1) 못 통과한 문항의 plan 파일은 백업하고 plan 폴더에서 치운다(장부는 그대로 plan 대기)
  const bk = path.join(out, 'backup'); fs.mkdirSync(bk, { recursive: true });
  for (const b of v.bad) { const pf = planDir + planFile(b.no);
    if (fs.existsSync(pf)) { fs.copyFileSync(pf, path.join(bk, planFile(b.no))); fs.rmSync(pf); } }
  // 2) 통과한 문항의 _decisions.jsonl 행
  if (v.ok.length) {
    fs.mkdirSync(planDir, { recursive: true });
    const rows = readDecisions();
    for (const n of v.ok) {
      const r = resultOf(pend.find(x => x.no === n)); let why = String(r.why).trim();
      const res = (() => { try { return readJson(path.join(out, 'q' + n, 'result.json')); } catch { return {}; } })();
      if (r.decision === 'UNSUPPORTED') why += ` [근거: ${res.errorCode}; 찾아 본 방법: ${String(res.attempts).trim()}]`;
      const row = { exam: src, no: n, decision: r.decision, plans: r.decision === 'FIGURE' ? [planFile(n)] : [],
        capability: r.decision === 'FIGURE' ? readJson(planDir + planFile(n)).capability : null, why,
        render: 'NOT_RUN',
        note: 'ds-plan 2026-11-19 (DeepSeek 글로만 작성, 렌더 미확인: 공장 일괄 렌더 대기; 구조·언어 계약 기계 검증 통과)' };
      const i = rows.findIndex(x => x.no === n); if (i >= 0) rows[i] = row; else rows.push(row);
    }
    rows.sort((a, b) => a.no - b.no);
    fs.writeFileSync(decFile, rows.map(x => JSON.stringify(x)).join('\n') + '\n');
    // 3) source-revision.json: 공장 build.cjs 가 문항 내용 변경(DRIFT)을 가리는 기준. 없으면 지금 main 커밋으로 만든다.
    const sr = planDir + 'source-revision.json';
    let head = ''; try { head = git('rev-parse', 'origin/main'); } catch {}
    let sameAsMain = false; try { sameAsMain = git('rev-parse', 'origin/main:' + src) === git('rev-parse', 'HEAD:' + src); } catch {}
    if (!fs.existsSync(sr)) {
      if (head && sameAsMain) {
        fs.writeFileSync(sr, JSON.stringify({ mainCommit: head, verifiedUnchangedAt: head, exam: src, sourceBlobSha: git('rev-parse', 'HEAD:' + src), revisedOrdinals: [] }, null, 2) + '\n');
      } else console.error('WARN: origin/main 과 시험지가 달라 source-revision.json 을 만들지 않았다(공장이 기본 기준 커밋으로 DRIFT 판정할 수 있다)');
    } else {
      // 이미 있으면 바꾸지 않는다. 기준 커밋 뒤로 새 문항의 내용이 바뀌었는지만 경고한다(공장이 DRIFT 로 거르게 된다).
      try {
        const o = {}; vm.runInNewContext(git('show', readJson(sr).mainCommit + ':' + src), { window: o }); const ob = o.questionBank ?? o.examData?.questions;
        const drift = v.ok.filter(n => ob && ob[n - 1] && ['content', 'answer', 'solution', 'choices'].some(k => JSON.stringify(ob[n - 1][k]) !== JSON.stringify(bank[n - 1][k])));
        if (drift.length) console.error('WARN: source-revision.json 기준 뒤로 내용이 바뀐 문항(공장 DRIFT 우려): Q' + drift.join(', Q'));
      } catch (e) { console.error('WARN: source-revision 기준 커밋을 읽지 못했다: ' + String(e.message).split(String.fromCharCode(10))[0]); }
    }
  }
  // 4) 예상 밖의 변경은 되돌린다(plan 폴더 안 허용: q<통과 no>-solution.json, _decisions.jsonl, source-revision.json)
  const allowed = new Set(['_decisions.jsonl', 'source-revision.json', ...v.ok.map(n => planFile(n))]);
  const st = cp.execFileSync('git', ['status', '--porcelain', '--untracked-files=all', '--', planDir], { encoding: 'utf8' }).split('\n').filter(Boolean); // trim 하지 않는다(첫 줄 ' M' 앞 공백이 상태 칸이다)
  for (const line of st) {
    const f = line.slice(3).replace(/^"|"$/g, ''); const base = path.basename(f);
    if (path.dirname(f).replace(/\\/g, '/') + '/' === planDir && allowed.has(base)) continue;
    console.error('WARN: 예상 밖의 변경을 되돌린다: ' + line);
    if (line.startsWith('??')) { fs.mkdirSync(path.join(bk, 'unexpected'), { recursive: true }); fs.copyFileSync(f, path.join(bk, 'unexpected', base)); fs.rmSync(f); }
    else git('checkout', '--', f);
  }
  console.log(v.ok.join(' '));
  process.exit(0);
}
console.error('unknown command'); process.exit(2);

// ds-plan-exam.sh 가 부르는 보조 도구(대상 계산·검증·정리). 저장소 루트에서 실행한다.
//   node ds-plan-lib.cjs prep     <시험지 JS> <outdir>   plan 대기 문항 − 이미 plan/판정이 있는 문항 → <outdir>/pending.json, INPUT.md. 대상 수를 출력(0이면 할 일 없음)
//   node ds-plan-lib.cjs validate <시험지 JS> <outdir>   대상 문항마다 기계 검증 → <outdir>/validate.json({ok:[no…], bad:[{no,problems}]}). 문제가 있으면 줄마다 출력하고 종료코드 1
//   node ds-plan-lib.cjs finalize <시험지 JS> <outdir>   validate.json 기준으로 정리: 못 통과한 문항의 plan 파일을 치우고(백업), 통과한 문항의 _decisions.jsonl 행과
//                                                        source-revision.json 을 쓰고, 예상 밖의 변경을 되돌린다. 통과 문항 번호를 출력한다.
//   node ds-plan-lib.cjs report   <시험지 JS> <outdir>   통과 문항 결과 표(문항 | 결과 | 설명 | PNG 경로)를 출력한다.
// 문항 번호 no = 시험지 문항 배열의 1부터 센 자리(공장 build.cjs 와 같다). 렌더에 넘기는 ordinal = 배열에 숫자가 아닌 id가 있으면 그 id, 아니면 no.
// DeepSeek 이 쓰는 것: <PLANDIR>/q<no>-solution.json(FIGURE만), <OUT>/q<no>/{item.json,result.json,out/,fig.png}. _decisions.jsonl 은 이 도구가 쓴다.
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process');
const LEDGER = 'archive/tools/geometry-equation/production/exam-figure-ledger/';
const PLAN_BASE = 'docs/plans/archive-one-route-upgrade/svg-plans-expanded/';
const DECISIONS = ['FIGURE', 'EXEMPT', 'CONTENT', 'UNSUPPORTED'];
const [cmd, js, out] = process.argv.slice(2);
if (!cmd || !js || !out) { console.error('usage: ds-plan-lib.cjs prep|validate|finalize|report <시험지 JS> <outdir>'); process.exit(2); }
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
  const md = rows.map(r => { const q = bank[r.no - 1];
    return [`### Q${r.no}  (plan 파일 q${r.no}-solution.json, 렌더 ordinal ${JSON.stringify(r.ordinal)})`,
      `장부 사유: ${r.reason}`,
      `문제: ${q.content ?? q.question ?? ''}`,
      q.choices && q.choices.length ? `보기: ${JSON.stringify(q.choices)}` : '',
      q.image ? `문제 그림 파일: archive/${q.image}` : '',
      `정답: ${q.answer ?? ''}`, `해설: ${q.solution ?? ''}`].filter(Boolean).join('\n'); });
  fs.writeFileSync(path.join(out, 'INPUT.md'), md.join('\n\n') + '\n');
  if (skipped.plan || skipped.decided || skipped.notInBank) console.error(`건너뜀: plan 있음 ${skipped.plan}, 이미 판정 ${skipped.decided}, 문항 번호 없음 ${skipped.notInBank}`);
  console.log(rows.length);
  process.exit(0);
}

const pend = readJson(pendingPath).rows;
const hasKorean = s => /[가-힣]/.test(s);

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

function validateOne(r) {
  const problems = [], d = path.join(out, 'q' + r.no);
  const pf = planDir + planFile(r.no);
  let res = null;
  try { res = readJson(path.join(d, 'result.json')); } catch (e) { return ['result.json 을 읽을 수 없다: ' + e.message]; }
  if (!DECISIONS.includes(res.decision)) problems.push(`decision 값이 정해진 것이 아니다(${res.decision})`);
  if (typeof res.why !== 'string' || res.why.trim().length < 12 || !hasKorean(res.why)) problems.push('why 가 비었거나 너무 짧다(구체적인 한국어 사유 필요)');
  if (res.decision !== 'FIGURE') {
    if (fs.existsSync(pf)) problems.push(`${planFile(r.no)} 가 plan 폴더에 남아 있다(UNSUPPORTED/EXEMPT/CONTENT 는 plan 폴더에 파일을 두지 않는다. 마지막 시도는 ${d}/last-plan.json 으로 옮긴다)`);
    if (res.decision === 'UNSUPPORTED') {
      if (typeof res.errorCode !== 'string' || !res.errorCode.trim()) problems.push('UNSUPPORTED 는 errorCode 가 필요하다');
      if (typeof res.attempts !== 'string' || res.attempts.trim().length < 10) problems.push('UNSUPPORTED 는 attempts(시도한 방법)가 필요하다');
    }
    return problems;
  }
  // FIGURE
  if (!fs.existsSync(pf)) { problems.push(`${planFile(r.no)} 가 plan 폴더에 없다`); return problems; }
  let plan = null;
  try { plan = readJson(pf); } catch (e) { problems.push('plan JSON 을 읽을 수 없다: ' + e.message); return problems; }
  const raw = fs.readFileSync(pf, 'utf8');
  if (/�|\?\?/.test(raw)) problems.push('plan 에 깨진 글자(? 또는 U+FFFD)가 있다');
  if (typeof plan.capability !== 'string' || !plan.capability) problems.push('plan.capability 가 없다');
  for (const k of ['caption', 'accessibilityDescription']) {
    if (typeof plan[k] !== 'string' || !plan[k].trim()) { problems.push(`plan.${k} 가 없다`); continue; }
    if (/\^|sqrt|\\frac|\\dfrac|축척/.test(plan[k]) || /(?<![\w)])\*|\*(?![\w(])/.test(plan[k])) problems.push(`plan.${k} 에 입력용 표기(^, sqrt, *, \\frac)나 "축척"이 있다`);
    const errs = checkLanguage(plan[k], k === 'caption' ? 'title' : 'desc');
    if (errs.length) problems.push(`plan.${k} 가 언어 계약을 통과하지 못한다: ${errs.join(', ')}`);
  }
  if (!Array.isArray(plan.sourceConditions) || !plan.sourceConditions.length) problems.push('plan.sourceConditions 가 없다(본보기 플랜처럼 source 조건 필요)');
  // 렌더 결과
  const fr = path.join(d, 'out', 'figure-result.json'), svgf = path.join(d, 'out', 'figure-solution.svg');
  let fres = null;
  try { fres = readJson(fr); } catch { problems.push('렌더 결과 out/figure-result.json 이 없다(렌더하지 않았다)'); }
  if (fres) {
    if (fres.status !== 'ARCHIVE_BOUND') problems.push(`렌더 status 가 ARCHIVE_BOUND 가 아니다(${fres.status})`);
    if (fs.statSync(pf).mtimeMs > fs.statSync(fr).mtimeMs + 2000) problems.push('plan 이 마지막 렌더보다 나중에 바뀌었다(고친 plan 을 다시 렌더하지 않았다)');
  }
  if (!fs.existsSync(svgf)) problems.push('out/figure-solution.svg 가 없다');
  else {
    const { validateSvgStudentLanguage } = require(path.resolve('archive/tools/svg-language-contract.cjs'));
    // 합성 그림 등은 접근성 title/desc 를 게시 단계에서 붙이므로 그 항목은 제외하고 글자(영어·입력용 표기·축척)만 본다.
    const v = validateSvgStudentLanguage(fs.readFileSync(svgf, 'utf8'));
    const errs = v.errors.filter(e => !String(e.code).startsWith('SVG_ACCESSIBILITY_'));
    if (errs.length) problems.push('렌더된 SVG 글자가 언어 계약을 통과하지 못한다: ' + errs.slice(0, 4).map(e => e.code + (e.token ? ':' + e.token : '')).join(', '));
  }
  try { const it = readJson(path.join(d, 'item.json'));
    if (it.sourcePath !== src || String(it.ordinal) !== String(r.ordinal)) problems.push(`item.json 이 이 문항과 다르다(sourcePath/ordinal 은 ${src} / ${JSON.stringify(r.ordinal)})`);
  } catch { problems.push('item.json 이 없다'); }
  if (!fs.existsSync(path.join(d, 'fig.png'))) problems.push('fig.png 를 만들지 않았다(PNG 를 만들어 직접 봐야 한다)');
  return problems;
}

if (cmd === 'validate') {
  const ok = [], bad = [];
  for (const r of pend) { const p = validateOne(r); (p.length ? bad : ok).push(p.length ? { no: r.no, problems: p } : r.no); }
  fs.writeFileSync(path.join(out, 'validate.json'), JSON.stringify({ ok, bad }, null, 1));
  for (const b of bad) for (const p of b.problems) console.log(`Q${b.no}: ${p}`);
  console.log(`VALIDATE ok=${ok.length} bad=${bad.length} of ${pend.length}`);
  process.exit(bad.length ? 1 : 0);
}

if (cmd === 'finalize' || cmd === 'report') {
  const v = readJson(path.join(out, 'validate.json'));
  const results = n => readJson(path.join(out, 'q' + n, 'result.json'));
  if (cmd === 'report') {
    for (const n of v.ok) { const r = results(n);
      const png = r.decision === 'FIGURE' ? path.resolve(out, 'q' + n, 'fig.png') : '';
      console.log(`Q${n} | ${r.decision === 'FIGURE' ? 'ARCHIVE_BOUND' : r.decision} | ${String(r.why).replace(/\s+/g, ' ').slice(0, 160)} | ${png}`); }
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
      const r = results(n); let why = String(r.why).trim();
      if (r.decision === 'UNSUPPORTED') why += ` [오류 코드: ${r.errorCode}; 시도: ${String(r.attempts).trim()}]`;
      const row = { exam: src, no: n, decision: r.decision, plans: r.decision === 'FIGURE' ? [planFile(n)] : [],
        capability: r.decision === 'FIGURE' ? readJson(planDir + planFile(n)).capability : (r.capability ?? null), why,
        render: r.decision === 'FIGURE' ? 'ARCHIVE_BOUND' : 'NOT_RUN',
        note: `ds-plan 2026-11-19 (DeepSeek 초안, 기계 검증 통과)${r.decision === 'FIGURE' ? '; PNG 직접 확인 ' + (r.pngViewed ? '함' : '미확인') : ''}` };
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
  const st = git('status', '--porcelain', '--untracked-files=all', '--', planDir).split('\n').filter(Boolean);
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

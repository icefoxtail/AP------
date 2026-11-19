// ds-triage-exam.sh 가 부르는 보조 도구(미판정 계산·검증·장부 반영). 저장소 루트에서 실행한다.
//   node ds-triage-lib.cjs prep     <시험지 JS> <outdir>   미판정 문항 계산 -> <outdir>/pending.json, INPUT.md. 미판정 수를 출력(0이면 할 일 없음)
//   node ds-triage-lib.cjs validate <시험지 JS> <outdir>   <outdir>/triage.json 검증. 문제가 있으면 줄마다 출력하고 종료코드 1
//   node ds-triage-lib.cjs apply    <시험지 JS> <outdir>   검증된 판정을 ledger-upsert.py 로 장부에 넣고, 이미 있던 문항은 그대로 되돌려 놓는다
// 미판정 = 장부 파일이 없거나(또는 CLOSED가 아닌데) 그 문항 항목이 없는 문항. CLOSED 시험지는 판정이 끝난 것으로 본다.
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process');
const LEDGER = 'archive/tools/geometry-equation/production/exam-figure-ledger/';
const UPSERT = 'archive/tools/geometry-equation/ops/svg-m1/ledger-upsert.py';
const DECISIONS = ['FIGURE', 'REPLACE', 'KEEP_EXISTING', 'EXEMPT', 'CONTENT'];
const [cmd, js, out] = process.argv.slice(2);
if (!cmd || !js || !out) { console.error('usage: ds-triage-lib.cjs prep|validate|apply <시험지 JS> <outdir>'); process.exit(2); }
const src = js.replace(/\\/g, '/');
if (!src.startsWith('archive/exams/original/') || !src.endsWith('.js')) { console.error('시험지 JS는 저장소 루트 기준 archive/exams/original/...js 경로여야 한다'); process.exit(2); }
const ledgerPath = LEDGER + src.slice('archive/exams/original/'.length, -3) + '.json';
const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(src, 'utf8'), ctx);
const bank = ctx.window.questionBank ?? ctx.window.examData?.questions;
if (!Array.isArray(bank) || !bank.length) { console.error('문항 배열이 없다'); process.exit(2); }
const led = fs.existsSync(ledgerPath) ? JSON.parse(fs.readFileSync(ledgerPath, 'utf8')) : null;
const have = new Set(led ? led.items.map(i => String(i.ord)) : []);
const pending = led && led.status === 'CLOSED' ? [] : bank.filter(q => !have.has(String(q.id)));
function figClass(rel) { // exam-figs.cjs 와 같은 분류
  if (!rel) return 'NONE';
  const p = path.join('archive', rel);
  if (!fs.existsSync(p)) return 'MISSING_FILE';
  if (!/\.svg$/i.test(rel)) return 'OLD_PNG';
  const head = fs.readFileSync(p, 'utf8').slice(0, 8000);
  return /data-engine-version=|data-publication-profile=|data-composite=/.test(head) || /data-([a-z0-9-]+)="\1-figure-v1"/.test(head) ? 'NEW' : 'OLD_SVG';
}
const ids = pending.map(q => q.id), cls = Object.fromEntries(bank.map(q => [String(q.id), figClass(q.solutionImage)]));

if (cmd === 'prep') {
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'pending.json'), JSON.stringify(ids));
  const md = pending.map(q => [`### Q${q.id}`, `문제: ${q.content ?? q.question ?? ''}`,
    q.choices && q.choices.length ? `보기: ${JSON.stringify(q.choices)}` : '', q.image ? `문제 그림: ${q.image}` : '',
    `정답: ${q.answer ?? ''}`, `해설: ${q.solution ?? ''}`, `기존 해설 그림: ${cls[String(q.id)]}${q.solutionImage ? ' ' + q.solutionImage : ''}`].filter(Boolean).join('\n'));
  fs.writeFileSync(path.join(out, 'INPUT.md'), md.join('\n\n') + '\n');
  console.log(pending.length);
} else if (cmd === 'validate' || cmd === 'apply') {
  const problems = [];
  let rows = [];
  try { const t = JSON.parse(fs.readFileSync(path.join(out, 'triage.json'), 'utf8')); rows = Array.isArray(t) ? t : t.items; if (!Array.isArray(rows)) throw new Error('items 배열이 없다'); }
  catch (e) { problems.push('triage.json 을 읽을 수 없다: ' + e.message); rows = []; }
  const want = new Set(ids.map(String)), got = new Set();
  // 옛 형식 시험지는 id가 "Q01" 같은 문자열이다. DeepSeek이 1처럼 숫자로 답하면 같은 번호의 id로 맞춘다.
  const byNum = {};
  for (const k of want) { const m = /^[A-Za-z]*0*(\d+)$/.exec(k); if (m) byNum[m[1]] = byNum[m[1]] === undefined ? k : null; }
  for (const r of rows) { const k = String(r.ord); if (!want.has(k)) { const m = /^[A-Za-z]*0*(\d+)$/.exec(k); if (m && byNum[m[1]]) r.ord = byNum[m[1]]; } }
  for (const r of rows) {
    const k = String(r.ord);
    if (!want.has(k)) { problems.push(`시험지에 없는(또는 이미 판정된) 번호: ${r.ord}`); continue; }
    if (got.has(k)) problems.push(`번호 중복: ${r.ord}`);
    got.add(k);
    if (!DECISIONS.includes(r.decision)) problems.push(`Q${r.ord}: 판정 값이 정해진 것이 아니다(${r.decision})`);
    if (typeof r.reason !== 'string' || !r.reason.trim()) problems.push(`Q${r.ord}: 사유가 비어 있다`);
    if (typeof r.family !== 'string' || !r.family.trim()) problems.push(`Q${r.ord}: family 가 비어 있다`);
    if (r.decision === 'KEEP_EXISTING' && cls[k] !== 'NEW') problems.push(`Q${r.ord}: KEEP_EXISTING 은 기존 그림 분류가 NEW 일 때만 쓴다(현재 ${cls[k]})`);
  }
  for (const k of want) if (!got.has(k)) problems.push(`빠진 문항: ${k}`);
  if (problems.length) { problems.forEach(p => console.log(p)); process.exit(1); }
  if (cmd === 'validate') { console.log(`OK ${rows.length}`); process.exit(0); }

  // apply: 시험지 전체 triage(이미 있던 문항은 자리표시)를 만들어 ledger-upsert.py 에 넣는다.
  const byOrd = Object.fromEntries(rows.map(r => [String(r.ord), r]));
  const full = bank.map(q => {
    const r = byOrd[String(q.id)];
    return r ? { ord: q.id, decision: r.decision, family: r.family, reason: r.reason } : { ord: q.id, decision: 'EXEMPT', reason: '기존 장부 항목(자리표시, 되돌려 놓음)' };
  });
  const open = {};
  for (const r of rows) if (r.decision === 'FIGURE' || r.decision === 'REPLACE') open[String(r.ord)] = ['OPEN_LAYOUT', `plan 대기: ${r.decision} ${r.family} - ${r.reason}`];
  const triPath = path.join(out, 'triage-full.json'), specPath = path.join(out, 'spec.json');
  fs.writeFileSync(triPath, JSON.stringify(full));
  fs.writeFileSync(specPath, JSON.stringify({ exam: path.basename(src, '.js'), src, camp: 'ds-triage', closedBy: 'DeepSeek 판정(ds-triage)', note: led ? (led.note || '') : 'DeepSeek 판정(미판정 문항)', triage: triPath, open }));
  const r = cp.spawnSync('python', [UPSERT, specPath], { encoding: 'utf8', env: { ...process.env, PYTHONUTF8: '1' } });
  process.stdout.write(r.stdout || ''); process.stderr.write(r.stderr || '');
  if (r.status !== 0) process.exit(r.status || 1);
  if (led) { // 이미 있던 문항은 한 글자도 바꾸지 않는다
    const e = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
    const old = Object.fromEntries(led.items.map(i => [String(i.ord), i]));
    e.items = e.items.map(i => old[String(i.ord)] ?? i);
    const closed = e.items.every(i => i.state === 'PUBLISHED' || i.state === 'EXEMPT');
    e.status = closed ? 'CLOSED' : 'OPEN'; e.closedBy = closed ? 'DeepSeek 판정(ds-triage)' : null; e.note = led.note ?? e.note;
    fs.writeFileSync(ledgerPath, JSON.stringify(e, null, 2) + '\n');
  }
  console.log('APPLIED ' + ledgerPath);
} else { console.error('unknown command'); process.exit(2); }

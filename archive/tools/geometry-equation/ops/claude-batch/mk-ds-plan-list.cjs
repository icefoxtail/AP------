// plan 대기 문항이 남은 시험지 목록(한 줄에 시험지 JS 저장소 상대경로)을 순서대로 stdout 에 낸다. 저장소 루트에서 실행한다.
//   node mk-ds-plan-list.cjs [--counts]    --counts 이면 "경로<TAB>남은 문항 수" 로 낸다(qrun 은 첫 칸만 읽는다).
// 대상 = 장부에서 state OPEN_LAYOUT·reason 이 "plan 대기"로 시작하는 문항 중, plan 폴더에 qN-solution*.json 이나 _decisions.jsonl 행이 아직 없는 것.
// 순서(사용자 지시 2026-11-19): 고2(h2) → 중2(m2) → 중1(m1) → 고1(h1) → 그 밖(중3 등). 학년 안에서는 최신 연도 내림차순, 같은 해는 2학기 기말 → 2학기 중간 → 1학기 기말 → 1학기 중간, 그다음 이름 순.
const fs = require('fs'), path = require('path'), vm = require('vm');
const LEDGER = 'archive/tools/geometry-equation/production/exam-figure-ledger';
const PLAN = 'docs/plans/archive-one-route-upgrade/svg-plans-expanded/original/';
const GRADE_ORDER = ['h2', 'm2', 'm1', 'h1'], TERM_ORDER = ['2final', '2mid', '1final', '1mid'];
const counts = process.argv.includes('--counts');
function walk(d, o = []) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p, o); else if (p.endsWith('.json') && e.name !== '_meta.json') o.push(p); } return o; }
const rows = [];
for (const f of walk(LEDGER)) {
  const rel = path.relative(LEDGER, f).split(path.sep).join('/').replace(/\.json$/, ''); // high/h2/2mid/25_…
  const led = JSON.parse(fs.readFileSync(f, 'utf8'));
  const pend = (led.items || []).filter(i => i.state === 'OPEN_LAYOUT' && String(i.reason || '').startsWith('plan 대기'));
  if (!pend.length) continue;
  const js = 'archive/exams/original/' + rel + '.js';
  if (!fs.existsSync(js)) continue;
  const c = { window: {} }; vm.runInNewContext(fs.readFileSync(js, 'utf8'), c);
  const bank = c.window.questionBank ?? c.window.examData?.questions; if (!Array.isArray(bank)) continue;
  const dir = PLAN + rel + '/'; const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  let dec = []; try { dec = fs.readFileSync(dir + '_decisions.jsonl', 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l).no); } catch {}
  let n = 0;
  for (const it of pend) { const i = bank.findIndex(q => String(q.id) === String(it.ord)); if (i < 0) continue; const no = i + 1;
    if (files.some(x => new RegExp(`^q${no}-solution(-\d+)?\.json$`).test(x)) || dec.includes(no)) continue; n++; }
  if (!n) continue;
  const parts = rel.split('/'); const grade = parts[1], term = parts[2], name = parts[3];
  rows.push({ js, n, g: GRADE_ORDER.indexOf(grade) < 0 ? 99 : GRADE_ORDER.indexOf(grade), y: parseInt(name, 10) || 0, t: TERM_ORDER.indexOf(term) < 0 ? 99 : TERM_ORDER.indexOf(term), name });
}
rows.sort((a, b) => a.g - b.g || b.y - a.y || a.t - b.t || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
for (const r of rows) console.log(counts ? `${r.js}\t${r.n}` : r.js);

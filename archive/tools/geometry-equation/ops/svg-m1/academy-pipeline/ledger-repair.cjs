// 부분 게시(일부 문항만 다시 게시) 때 장부의 나머지 문항이 OPEN_*로 되돌아간 것을 이력에서 복구한다.
// 대상: 장부 상태가 PUBLISHED가 아닌데 시험지 JS에는 해설 그림이 있는 문항.
// 복구: 장부 git 이력에서 그 문항이 PUBLISHED였던 가장 최근 항목을 그대로 가져온다(figures가 현재 JS와 같을 때만).
// usage: node ledger-repair.cjs [--write]
const { execSync } = require('child_process'); const fs = require('fs'); const vm = require('vm');
const LP = 'archive/tools/geometry-equation/production/exam-figure-ledger.json';
const sh = (c) => execSync(c, { encoding: 'utf8', maxBuffer: 5e8 });
const write = process.argv.includes('--write');
const raw = fs.readFileSync(LP, 'utf8');
const L = JSON.parse(raw);
const bank = (src) => { const c = { window: {} }; vm.runInNewContext(fs.readFileSync(src, 'utf8'), c); return c.window.questionBank || c.window.examData.questions; };
const figsOf = (q) => { const v = q.solutionImage; const a = Array.isArray(v) ? v : (v ? [v] : []); return a.map(String); };
const ordOf = (q, i) => i + 1;

// 대상 수집
const targets = new Map(); // exam -> Map(ordKey -> current figs)
for (const e of L.exams) {
  let q; try { q = bank(e.src); } catch (err) { continue; }
  const byOrd = new Map();
  q.forEach((x, i) => { byOrd.set(String(i + 1), x); if (x.id !== undefined) byOrd.set('id:' + String(x.id), x); });
  for (const it of e.items) {
    if (it.state === 'PUBLISHED' || it.state === 'EXEMPT') continue;
    const x = byOrd.get(String(it.ord)) || byOrd.get('id:' + String(it.ord));
    if (!x) continue;
    const f = figsOf(x); if (!f.length) continue;
    if (!targets.has(e.exam)) targets.set(e.exam, new Map());
    targets.get(e.exam).set(String(it.ord), f);
  }
}
let need = 0; for (const m of targets.values()) need += m.size;
console.log('exams', targets.size, 'items to repair', need);

// 이력 탐색
const commits = sh('git log --format=%H -n 400 origin/main -- ' + LP).trim().split('\n');
const found = new Map(); // exam|ord -> item
const examMeta = new Map(); // exam -> {status, closedBy, note} (가장 최근 CLOSED)
let remaining = need;
for (const c of commits) {
  if (remaining <= 0 && [...targets.keys()].every(k => examMeta.has(k))) break;
  let H; try { H = JSON.parse(sh('git show ' + c + ':' + LP)); } catch (err) { continue; }
  for (const e of H.exams || []) {
    const t = targets.get(e.exam); if (!t) continue;
    if (!examMeta.has(e.exam) && e.status === 'CLOSED') examMeta.set(e.exam, { status: e.status, closedBy: e.closedBy, note: e.note });
    for (const it of e.items) {
      const k = e.exam + '|' + String(it.ord);
      if (found.has(k) || !t.has(String(it.ord)) || it.state !== 'PUBLISHED') continue;
      const cur = t.get(String(it.ord)).map(s => s.replace(/^archive\//, ''));
      const old = (it.figures || []).map(s => String(s).replace(/^archive\//, ''));
      if (JSON.stringify(cur) === JSON.stringify(old)) { found.set(k, it); remaining--; }
    }
  }
}
console.log('found in history', found.size, 'of', need);

// 적용
let fixed = 0, closed = 0; const miss = [];
for (const e of L.exams) {
  const t = targets.get(e.exam); if (!t) continue;
  e.items = e.items.map(it => { const h = found.get(e.exam + '|' + String(it.ord)); if (h) { fixed++; return h; } if (t.has(String(it.ord))) miss.push(e.exam + ' ' + it.ord + ' ' + it.state + ' ' + t.get(String(it.ord)).join(',')); return it; });
  const open = e.items.filter(it => it.state !== 'PUBLISHED' && it.state !== 'EXEMPT');
  if (!open.length && e.status !== 'CLOSED') { e.status = 'CLOSED'; closed++; }
  if (typeof e.note === 'string' && /^\d+개 게시/.test(e.note)) e.note = e.note.replace(/^\d+개 게시/, e.items.filter(it => it.state === 'PUBLISHED').length + '개 게시');
  const c = {}; for (const it of e.items) c[it.state] = (c[it.state] || 0) + 1;
  console.log(e.exam, e.status, JSON.stringify(c));
}
console.log('fixed', fixed, 'closed', closed, 'missing', miss.length); for (const x of miss) console.log('  MISS', x);
if (write) {
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  const indent = (raw.match(/\n( +)"/) || [, '  '])[1].length;
  let out = JSON.stringify(L, null, indent); if (raw.endsWith('\n')) out += '\n';
  fs.writeFileSync(LP, eol === '\n' ? out : out.replace(/\n/g, '\r\n'));
  console.log('written');
}

// Usage: node review-list.cjs <작업폴더>
// 경량 검수에서 Sonnet 이 직접 풀 문항 목록을 만든다 (LIGHT_REVIEW.md 의 a~d).
//  a) Gemini 판정이 answerMatches:false 이거나 check-judgment(작업폴더/check.json)·lint(작업폴더/lint.json)에 오류가 있는 문항
//  b) 서술형·단답형(객관식이 아닌 문항 전부)
//  c) 판정 난이도(difficultyBucket)가 가장 높은 3문항
//  d) 발문에 의심 낱말(항상·반드시·적어도·오직·유일·있는 대로)이 있는 문항 — 읽고 의심되는 것만 직접 푼다(목록은 후보일 뿐)
const fs = require('fs'), path = require('path'), vm = require('vm');
const work = process.argv[2];
if (!work) { console.error('Usage: node review-list.cjs <작업폴더>'); process.exit(1); }
const readJ = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const stage = fs.readdirSync(path.join(work, 'stage')).find(f => f.endsWith('.js'));
const ctx = { window: {} }; vm.createContext(ctx); new vm.Script(fs.readFileSync(path.join(work, 'stage', stage), 'utf8')).runInContext(ctx);
const bank = ctx.window.questionBank;
const reasons = new Map();
const add = (q, why) => { if (!reasons.has(q)) reasons.set(q, []); reasons.get(q).push(why); };
const judg = {};
for (const q of bank) {
  const p = path.join(work, 'judgment', `q${String(q.id).padStart(2, '0')}.json`);
  judg[q.id] = fs.existsSync(p) ? readJ(p) : {};
  const j = judg[q.id];
  if (j.answerMatches === false) add(q.id, `a: Gemini 판정 answerMatches:false (${String(j.answerIssue || '').slice(0, 80)})`);
  if (q.questionType !== '객관식') add(q.id, `b: ${q.questionType}`);
  if (/항상|반드시|적어도|오직|유일|있는 대로/.test(String(q.content))) add(q.id, 'd: 의심 낱말(항상·반드시·적어도·유일·있는 대로 …) — 읽고 의심될 때만 직접 푼다');
}
const cp = path.join(work, 'check.json');
if (fs.existsSync(cp)) for (const it of readJ(cp).items || []) { const f = (it.codes || []).filter(c => c.severity === 'FAIL'); if (f.length) add(it.qid, `a: check-judgment ${[...new Set(f.map(c => c.code))].join(',')}`); }
const lp = path.join(work, 'lint.json');
if (fs.existsSync(lp)) for (const i of readJ(lp)) if (i.level === 'ERROR' && i.qid) add(i.qid, `a: lint ${i.code}`);
const top = bank.map(q => ({ id: q.id, b: Number(judg[q.id].difficultyBucket) || 0 })).filter(x => x.b).sort((a, b) => b.b - a.b || b.id - a.id).slice(0, 3);
for (const t of top) add(t.id, `c: 난이도 ${t.b} (상위 3)`);
const order = [...reasons.keys()].sort((a, b) => a - b);
console.log(`직접 풀 문항 ${order.length}/${bank.length}: ${order.join(', ')}`);
for (const q of order) console.log(`Q${String(q).padStart(2, '0')}  ${reasons.get(q).join(' | ')}`);
if (!Object.values(judg).some(j => j.difficultyBucket)) console.log('(주의: 판정 파일에 난이도가 아직 없어 c 항목은 비어 있다)');
